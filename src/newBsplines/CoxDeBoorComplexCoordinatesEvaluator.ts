import { ComplexVectorSpace } from "../mathVector/ComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "../mathVector/ProjectiveComplexVectorSpace";
import { ProjectiveVectorSpace } from "../mathVector/ProjectiveVectorSpace";
import { RealVectorSpace } from "../mathVector/RealVectorSpace";
import { IVector } from "../mathVector/Vector";
import { createVectorFromAnyDescriptor } from "../mathVector/VectorFromDescriptorFactory";
import { ComplexVector, Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPolygon } from "./ControlPolygon";
import { CurveCache } from "./CoxDeBoorRealCoordinatesEvaluator";
import { ComplexControlPoint, CurvePoint } from "./CurveEntitiesTypes";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";
import { fromStrictlyIncreasingtToIncreasingKnotSequenceOC } from "./KnotSequenceAndUtilities/fromStrictlyIncreasingtToIncreasingKnotSequenceOC";
import { BSplineEvaluator } from "./OpenBSplineR1toRn";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";

export class CoxDeBoorComplexCoordinatesEvaluator<V extends Vector, D extends number> extends BSplineEvaluator<V, D> {

    private _pointCache: { parameter: number; result: CurvePoint<V, D>; knotSpanIndex: number } | null = null;
    private _rangeCache: { samples: number; buffer: Float64Array } | null = null;
    private _curveCache: CurveCache | null = null;
    private readonly knotSequence: IncreasingOpenKnotSequenceOpenCurve
    
    constructor(
        private readonly controlPolygon: ControlPolygon<V, D>,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
        private readonly degree: number
    ) {
        super();
        this.knotSequence = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(knotSequence);
    }
    evaluate(parameter: number): CurvePoint<V, D> {

        // 1. Ensure curve-level cache is valid
        const cc = this._getCurveCache();

        // 2. Check point cache hit (same u, same curve state)
        if (
            this._pointCache !== null &&
            this._pointCache.parameter === parameter
        ) {
            return this._pointCache.result;
        }

        // 3. Find knot span (reuse last if nearby, otherwise binary search)
        const spanIndex = this._findKnotSpan(parameter, cc.flatKnots);

        // 4. Run Cox-de Boor on flat buffers
        const resultCoords = this._coxDeBoor(
            parameter,
            spanIndex,
            cc.flatCoordinates,
            cc.flatKnots,
            cc.spaceDimension,
            cc.workBuffer
        );

        // 5. Build result vector
        const vectorSpace = this.controlPolygon.vectorSpace;
        let result: CurvePoint<V, D>;
        if (vectorSpace instanceof RealVectorSpace) {
            throw new Error("CoxDeBoorComplexEvaluator does not support RealVectorSpace: use a dedicated real evaluator");
        } else if (vectorSpace instanceof ProjectiveVectorSpace) {
            throw new Error("CoxDeBoorComplexEvaluator does not support ProjectiveVectorSpace: use a dedicated real evaluator");
        } else if (vectorSpace instanceof ComplexVectorSpace) {
            result = createVectorFromAnyDescriptor(vectorSpace.createVector(resultCoords), vectorSpace) as CurvePoint<V, D>;
        } else if (vectorSpace instanceof ProjectiveComplexVectorSpace) {
            result = createVectorFromAnyDescriptor(vectorSpace.createVector(resultCoords), vectorSpace) as CurvePoint<V, D>;
        } else {
            throw new Error("Unsupported vector space type for result construction");
        }
        // 6. Store point cache
        this._pointCache = { parameter, result, knotSpanIndex: spanIndex };

        return result;
    }

    evaluateRange(samples: number): Float64Array {

        // 1. Check range cache
        if (this._rangeCache && this._rangeCache.samples === samples) {
            return this._rangeCache.buffer;
        }

        // 2. Ensure curve cache
        const cc = this._getCurveCache();
        const dim = cc.spaceDimension;
        const buffer = new Float64Array(samples * dim);

        // 3. Evaluate at each sample, write directly to buffer
        for (let i = 0; i < samples; i++) {
            const u = i / (samples - 1);
            const pt = this.evaluate(u);
            this._writeToBuffer(buffer, i * dim, pt);
        }

        // 4. Store range cache
        this._rangeCache = { samples, buffer };
        return buffer;
    }

    private _getCurveCache(): CurveCache {
        if (this._curveCache) return this._curveCache;

        let spaceDimension = this.controlPolygon.spaceDimension * 2; // complex coordinates are interleaved real/imaginary pairs, so dimension is doubled
        if(this.controlPolygon.vectorSpace instanceof ProjectiveComplexVectorSpace) {
            spaceDimension = (this.controlPolygon.spaceDimension + 1) * 2; // for projective complex, we have n+1 complex coordinates, so total dimension is (n+1)*2    
        }
        const n = this.controlPolygon.length;

        // flatten control polygon
        const flatCoordinates = new Float64Array(n * spaceDimension);
        for (let i = 0; i < n; i++) {
            const coords = this.controlPolygon.controlPoints[i].toArray();
            for (let j = 0; j < spaceDimension; j++) {
                flatCoordinates[i * spaceDimension + j] = coords[j];
            }
        }

        // flatten knot vector
        const knotsArray = this.knotSequence.allAbscissae;
        const flatKnots = new Float64Array(knotsArray);

        // pre-allocate work buffer for Cox-de Boor
        const workBuffer = new Float64Array((this.degree + 1) * spaceDimension);

        this._curveCache = { flatCoordinates, flatKnots, spaceDimension, workBuffer };
        return this._curveCache;
    }

    private _findKnotSpan(u: number, flatKnots: Float64Array): number {
        // reuse last span if still valid (sequential evaluation)
        if (
            this._pointCache !== null &&
            u >= flatKnots[this._pointCache.knotSpanIndex] &&
            u < flatKnots[this._pointCache.knotSpanIndex + 1]
        ) {
            return this._pointCache.knotSpanIndex;
        }
        // binary search
        let lo = this.degree;
        let hi = flatKnots.length - this.degree - 2;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (u < flatKnots[mid]) hi = mid - 1;
            else if (u >= flatKnots[mid + 1]) lo = mid + 1;
            else return mid;
        }
        return lo;
    }

    private _coxDeBoor(
        u: number,
        spanIndex: number,
        coords: Float64Array,
        knots: Float64Array,
        dim: number,
        work: Float64Array
    ): number[][] {
        const p = this.degree;

        // copy relevant control points into work buffer
        for (let j = 0; j <= p; j++) {
            const src = (spanIndex - p + j) * dim;
            const dst = j * dim;
            for (let d = 0; d < dim; d++) work[dst + d] = coords[src + d];
        }

        // triangular scheme
        for (let r = 1; r <= p; r++) {
            for (let j = p; j >= r; j--) {
                const i = spanIndex - p + j;
                const denom = knots[i + p - r + 1] - knots[i];
                const alpha = denom === 0 ? 0 : (u - knots[i]) / denom;
                const base = j * dim;
                const prev = (j - 1) * dim;
                for (let d = 0; d < dim; d++) {
                    work[base + d] = (1 - alpha) * work[prev + d] + alpha * work[base + d];
                }
            }
        }

        // extract result from work buffer
        const nbComplexCoords = dim / 2;
        const result: number[][] = new Array(nbComplexCoords);
        for (let d = 0; d < nbComplexCoords; d++) {
            result[d] = [work[p * dim + 2 * d], work[p * dim + 2 * d + 1]];
        }
        return result;
    }

    private _writeToBuffer(buffer: Float64Array, offset: number, pt: CurvePoint<V, D>): void {
        const coords = (pt as any).coordinates as number[];
        for (let d = 0; d < coords.length; d++) buffer[offset + d] = coords[d];
    }

    invalidateAll(): void {
        this._pointCache = null;
        this._rangeCache = null;
        this._curveCache = null;
        // super.invalidateAll();
    }
}