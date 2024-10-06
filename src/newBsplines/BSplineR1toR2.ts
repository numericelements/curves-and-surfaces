import { clampingFindSpan, findSpan } from "./Piegl_Tiller_NURBS_Book"
import { Vector2d } from "../mathVector/Vector2d"
import { AbstractBSplineR1toR2, TOL_KNOT_COINCIDENCE, curveSegment, deepCopyControlPoints } from "./AbstractBSplineR1toR2"
import { BSplineR1toR1, KNOT_REMOVAL_TOLERANCE } from "./BSplineR1toR1"
import { splineRecomposition } from "./BernsteinDecompositionR1toR1"
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging"
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve"
import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot"
import { INCREASINGOPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface"

/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
export class BSplineR1toR2 extends AbstractBSplineR1toR2 {

    protected _increasingKnotSequence: IncreasingOpenKnotSequenceOpenCurve;

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]) {
        super(controlPoints, knots);
        const maxMultiplicityOrder = this._degree + 1;
        // this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, knots);
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots});
        this.constructorInputParamAssessment(controlPoints, knots);
    }

    get knots(): number[] {
        return this._increasingKnotSequence.allAbscissae;
    }

    get increasingKnotSequence(): IncreasingOpenKnotSequenceOpenCurve {
        return this._increasingKnotSequence;
    }

    get freeControlPoints(): Vector2d[] {
        return this.controlPoints;
    }

    set knots(knots: number[]) {
        this._degree = this.computeDegree(knots.length);
        // this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve(this._degree + 1, knots);
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve(this._degree + 1, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots});
    }

    constructorInputParamAssessment(controlPoints: Vector2d[], knots: number[]): void {
        const error = new ErrorLog(this.constructor.name, "constructor");
        let invalid = false;
        if((knots.length - controlPoints.length) < (this._degree + 1)) {
            error.addMessage("Inconsistent numbers of control points. Not enough control points to define a basis of B-Splines");
            invalid = true;
        } else if((knots.length - controlPoints.length) !== (this._degree + 1) ) {
            error.addMessage("Inconsistent numbers of knots and control points.");
            invalid = true;
        }

        if(invalid) {
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    // protected override factory(controlPoints: readonly Vector2d[] = [new Vector2d(0, 0)], knots: readonly number[] = [0, 1]) {
    protected create(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]) {
        return new BSplineR1toR2(controlPoints, knots)
    }

    /**
     * Return a deep copy of this b-spline
     */
    clone(): BSplineR1toR2 {
        const cloneControlPoints = deepCopyControlPoints(this._controlPoints);
        return new BSplineR1toR2(cloneControlPoints, this.knots.slice());
    }

    optimizerStep(step: number[]): void {
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            this._controlPoints[i].x += step[i];
            this._controlPoints[i].y += step[i + this._controlPoints.length];
        }
    }


    elevateDegree(times: number = 1): void {
        const sx = new BSplineR1toR1(this.getControlPointsX(), this.knots);
        const sy = new BSplineR1toR1(this.getControlPointsY(), this.knots);
        const bdsx = sx.bernsteinDecomposition();
        const bdsy = sy.bernsteinDecomposition();
        bdsx.elevateDegree();
        bdsy.elevateDegree();

        const knots = this.getDistinctKnots();

        const sxNew = splineRecomposition(bdsx, knots);
        const syNew = splineRecomposition(bdsy, knots);

        const newcp: Vector2d[] = [];
        for (let i = 0; i < sxNew.controlPoints.length; i += 1) {
            newcp.push(new Vector2d(sxNew.controlPoints[i], syNew.controlPoints[i]));
        }
        const newSpline = new BSplineR1toR2(newcp, sxNew.knots);

        for (let i = 0; i < knots.length; i += 1) {
            let m = this.knotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(this._increasingKnotSequence.findSpan(knots[i])));
            for (let j = 0; j < newSpline.degree - m - 1; j += 1) {
                newSpline.removeKnot(findSpan(newSpline.knots[i], newSpline.knots, newSpline.degree));
            }
        }

        this.controlPoints = newSpline.controlPoints;
        // this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve(newSpline.degree + 1, newSpline.knots);
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve(newSpline.degree + 1, {type: INCREASINGOPENKNOTSEQUENCE, knots: newSpline.knots});
        this._degree = newSpline.degree;
    }

    removeKnot(indexFromFindSpan: number, tolerance: number = KNOT_REMOVAL_TOLERANCE): void {
        //Piegl and Tiller, The NURBS book, p : 185
    
        const index = indexFromFindSpan;

        // end knots are not removed
        if (index > this._degree && index < this._increasingKnotSequence.length() - this._degree - 1) {
            throw new Error("index out of range");
        }
        
        const indexIncSeq = new KnotIndexIncreasingSequence(index);
        const multiplicity = this.knotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        
        const last = index - multiplicity;
        const first = index -this.degree;
        const offset = first - 1;
        //std::vector<vectorType> local(2*degree+1);
        const local: Vector2d[] = [];
        local[0] = this.controlPoints[offset];
        local[last + 1 - offset] = this.controlPoints[last + 1];
        let i = first;
        let j = last;
        let ii = 1;
        let jj = last - offset;
        let removable = false;
        
        const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(first), new KnotIndexIncreasingSequence(last + this.degree + 1));
        // Compute new control point for one removal step
        const offset_i = first;
        while (j > i){
            const offset_j = last;
            const alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i])/(subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            const alpha_j = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[j - offset_j])/(subSequence[j + this.degree + 1 - offset_j] - subSequence[j - offset_j]);
            local[ii] = (this.controlPoints[i].substract(local[ii - 1].multiply(1.0 - alpha_i))).multiply(1 / alpha_i );
            local[jj] = (this.controlPoints[j].substract(local[jj + 1].multiply(alpha_j))).multiply(1 / (1.0 - alpha_j));
            ++i;
            ++ii;
            --j;
            --jj;
        }
        
        if (j < i) {
            if ((local[ii-1].substract(local[jj+1])).norm() <= tolerance){
                removable = true;
            }
        }
        else {
            const alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i]) / (subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]) ;
            if ( ((this.controlPoints[i].substract((local[ii+1].multiply(alpha_i)))).add (local[ii-1].multiply(1.0- alpha_i))).norm() <= tolerance) {
                removable = true;
            }
        }
        
        if (!removable) return;
        else {
            let indInc = first;
            let indDec = last;
            while (indDec > indInc) {
                this.controlPoints[indInc] = local[indInc - offset];
                this.controlPoints[indDec] = local[indDec - offset];
                ++indInc;
                --indDec;
            }
        }
        this._increasingKnotSequence.decrementKnotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        
        const fout = (2 * index - multiplicity - this.degree) / 2;
        this._controlPoints.splice(fout, 1);
    }

    /* JCL 2020/10/06 increase the degree of the spline while preserving its shape (Prautzsch algorithm) */
    degreeIncrement(): BSplineR1toR2 {
        const intermSplKnotsAndCPs = this.generateIntermediateSplinesForDegreeElevation();
        const splineHigherDegree = new BSplineR1toR2(intermSplKnotsAndCPs.CPs[0], intermSplKnotsAndCPs.knotVectors[0]);
        for(let i = 1; i <= this._degree; i += 1) {
            const strictIncSeq_splineHigherDegree = splineHigherDegree._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
            const splineTemp = new BSplineR1toR2(intermSplKnotsAndCPs.CPs[i], intermSplKnotsAndCPs.knotVectors[i]);
            const strictIncSeq_splineTemp = splineTemp._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
            for(let j = 1; j < (strictIncSeq_splineHigherDegree.length() - 1); j++) {
                const index = new KnotIndexStrictlyIncreasingSequence(j);
                if(strictIncSeq_splineHigherDegree.knotMultiplicity(index) > strictIncSeq_splineTemp.knotMultiplicity(index))
                    splineTemp.insertKnotBoehmAlgorithm(strictIncSeq_splineTemp.abscissaAtIndex(index));
                if(strictIncSeq_splineHigherDegree.knotMultiplicity(index) < strictIncSeq_splineTemp.knotMultiplicity(index))
                    splineHigherDegree.insertKnotBoehmAlgorithm(strictIncSeq_splineHigherDegree.abscissaAtIndex(index));
            }
            let tempCPs: Vector2d[] = [];
            for(let ind = 0; ind < splineHigherDegree.controlPoints.length; ind += 1) {
                tempCPs[ind] = splineHigherDegree.controlPoints[ind].add(splineTemp.controlPoints[ind]);
            }
            splineHigherDegree.controlPoints = tempCPs;
        }
        let tempHigherDegCP: Vector2d[] = [];
        for(let j = 0; j < splineHigherDegree.controlPoints.length; j += 1) {
            tempHigherDegCP[j] = splineHigherDegree.controlPoints[j].multiply(1 / (this._degree + 1));
        }
        splineHigherDegree.controlPoints = tempHigherDegCP;
        console.log("degreeIncrease: " + splineHigherDegree._increasingKnotSequence.allAbscissae);
        return new BSplineR1toR2(splineHigherDegree.controlPoints, splineHigherDegree._increasingKnotSequence.allAbscissae);
    }
    
    generateIntermediateSplinesForDegreeElevation(): {knotVectors: number[][], CPs: Array<Vector2d[]>} {
        const knotSequences: number[][] = [];
        const controlPolygons: Array<Vector2d[]> = [];
        for(let i = 0; i <= this._degree; i += 1) {
            const knotSequence = this._increasingKnotSequence.deepCopy();
            let controlPolygon = this._controlPoints.slice();
            let k = 0;
            for(let j = i; j < this._increasingKnotSequence.length(); j += this._degree + 1) {
                const indexStrctIncreasingSeq = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(j));
                knotSequence.raiseKnotMultiplicity(indexStrctIncreasingSeq, 1);
                if(j < this._controlPoints.length) {
                    let controlPoint = this._controlPoints[j];
                    controlPolygon.splice((j + k), 0, controlPoint);
                }
                k += 1;
            }
            knotSequences.push(knotSequence.allAbscissae);
            controlPolygons.push(controlPolygon);
        }
        return {
            knotVectors : knotSequences,
            CPs : controlPolygons
        };
    }

    scale(factor: number): BSplineR1toR2 {
        let cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(element.multiply(factor))
        });
        return new BSplineR1toR2(cp, this.knots.slice())
    }

    scaleY(factor: number): BSplineR1toR2 {
        let cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(new Vector2d(element.x, element.y * factor))
        });
        return new BSplineR1toR2(cp, this.knots.slice())
    }

    scaleX(factor: number): BSplineR1toR2 {
        let cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(new Vector2d(element.x * factor, element.y))
        });
        return new BSplineR1toR2(cp, this.knots.slice())
    }

    extend(uAbsc: number): BSplineR1toR2 {
        let result = this.clone();
        const knots = this.getDistinctKnots();
        if(!this._increasingKnotSequence.isNonUniform) {
            const warning = new WarningLog(this.constructor.name, "extend", "The knot sequence of the input curve is not of type non uniform. The algorithm is not operating on this category of curve.");
            warning.logMessageToConsole();
        } else if(uAbsc >= knots[0] && uAbsc <= knots[knots.length - 1]) {
            const warning = new WarningLog(this.constructor.name, "extend", "Parameter value for extension is not outside the knot interval. No extension performed.");
            warning.logMessageToConsole();
        } else {
            if(this._increasingKnotSequence.isAbscissaCoincidingWithKnot(uAbsc)) {
                const warning = new WarningLog(this.constructor.name, "extend", "The abscissae used to extend the curve is considered as similar to one of the end knots of curve knot sequence. However, the extension is performed.");
                warning.logMessageToConsole();
            }
            let tempCurve = this.clone();
            let reversed = false;
            let u;
            if(uAbsc > knots[knots.length - 1]) {
                tempCurve = this.revertCurve();
                u = knots[knots.length - 1] - uAbsc;
                reversed = true;
            } else {
                u = uAbsc;
            }
            let tempCtrlPoly = tempCurve._controlPoints;
            let tempKnots = tempCurve.increasingKnotSequence.allAbscissae;
            const vertices: Array<Array<Vector2d>> = [];
            for(let i= 1; i < this._degree + 1; i++) {
                let controlPolygon: Array<Vector2d> = [];
                controlPolygon.push(tempCtrlPoly[i]);
                const u1 = (tempKnots[this._degree + i]  - u) / (tempKnots[this._degree + i] - tempKnots[0]);
                const u2 = (u  - tempKnots[0]) / (tempKnots[this._degree + i] - tempKnots[0]);
                const vertex = tempCtrlPoly[i - 1].multiply(u1).add(tempCtrlPoly[i].multiply(u2));
                controlPolygon.splice(0, 0, vertex);
                for(let j = 1; j < i; j++) {
                    const u1 = (tempKnots[this._degree + i - j]  - u) / (tempKnots[this._degree + i - j] - tempKnots[0]);
                    const u2 = (u  - tempKnots[0]) / (tempKnots[this._degree + i - j] - tempKnots[0]);
                    const vertex = vertices[i - 2][vertices[i - 2].length - 1 - j].multiply(u1).add(controlPolygon[0].multiply(u2));
                    controlPolygon.splice(0, 0, vertex);
                }
                vertices.push(controlPolygon);
            }
            for(let k = 0; k < this._degree + 1; k++) {
                tempCtrlPoly[k] = vertices[vertices.length - 1][k];
                tempKnots[k] = u;
            }
            const newKnots = this.resetKnotAbscissaToOrigin(tempKnots);
            result = new BSplineR1toR2(tempCtrlPoly, newKnots);
            if(reversed) result = result.revertCurve();
        }
        return result;
    }

    splitAt(u: number, segmentLocation: curveSegment): BSplineR1toR2 {
        let result = this.clone();
        const knots = this.getDistinctKnots();
        if(result.increasingKnotSequence.isAbscissaCoincidingWithKnot(u)) {
            const warning = new WarningLog(this.constructor.name, "splitAt", "Method not configured to split a curve at an existing knot");
            warning.logMessageToConsole();
        } else if(u < knots[0] || u > knots[knots.length - 1]) {
            const warning = new WarningLog(this.constructor.name, "splitAt", "The abscissae used to split the curve is outside the knot sequence interval. No split performed.");
            warning.logMessageToConsole();
        } else {
            result.insertKnot(u, result._degree + 1);
            const knotSequence = result.knots;
            const newControlPolygon: Vector2d[] = [];
            const newKnots: number[] = [];
            let knotIndex = result._degree + 1;
            while(knotSequence[knotIndex] !== u && knotIndex < knotSequence.length) {
                knotIndex++;
            }
            const indexBound = knotIndex + result._degree + 1;
            if(segmentLocation === curveSegment.BEFORE) {
                for(let i = 0; i < knotIndex; i++) {
                    newControlPolygon.push(result._controlPoints[i]);
                }
                for(let i = 0; i < indexBound; i++) {
                    newKnots.push(result.knots[i]);
                }
                result = new BSplineR1toR2(newControlPolygon, newKnots);
            } else if(segmentLocation === curveSegment.AFTER) {
                for(let i = knotIndex; i < result._controlPoints.length; i++) {
                    newControlPolygon.push(result._controlPoints[i]);
                }
                for(let i = knotIndex; i < result.knots.length; i++) {
                    newKnots.push(result.knots[i]);
                }
                const updatedKnots = this.resetKnotAbscissaToOrigin(newKnots)
                result = new BSplineR1toR2(newControlPolygon, updatedKnots);
            } else {
                const error = new ErrorLog(this.constructor.name, "splitAt", "undefined specification of curve interval to be extracted.");
                error.logMessageToConsole();
            }
        }
        return result;
    }

    evaluateOutsideRefInterval(u: number): Vector2d {
        let result = new Vector2d();
        const spline = this.clone();
        const knots = spline.getDistinctKnots();
        if(u >= knots[0] && u <= knots[knots.length - 1]) {
            const error = new ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Parameter value for evaluation is not outside the knot interval.");
            error.logMessageToConsole();
        } else {
            const extendedSpline = spline.extend(u);
            if(u < knots[0]) {
                result = extendedSpline.evaluate(0.0);
            } else {
                result = extendedSpline.evaluate(knots[knots.length - 1]);
            }
        }
        return result;
    }

    revertCurve(): BSplineR1toR2 {
        const vertices: Array<Vector2d> = [];
        for(let i = 0; i < this._controlPoints.length; i++) {
            vertices.push(this._controlPoints[this._controlPoints.length - 1 - i]);
        }
        let result = new BSplineR1toR2(vertices, this._increasingKnotSequence.revertSequence());
        return result;
    }

    /**
     * 
     * @param from Parametric position where the section start
     * @param to Parametric position where the section end
     * @return the BSpline_R1_to_R2 section
     */
    extract(from: number, to: number) {

        const spline = this.clone();
        const strictIncSeq = spline._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
        let newFromSpan = spline._degree;
        let newToSpan = spline._increasingKnotSequence.length() - 1;
        if(spline._increasingKnotSequence.isAbscissaCoincidingWithKnot(from)) {
            let i = 0;
            for(const knot of strictIncSeq) {
                if(knot !== undefined && Math.abs(from - knot.abscissa) < TOL_KNOT_COINCIDENCE) break;
                i++;
            }
            const indexStrictIncSeq = new KnotIndexStrictlyIncreasingSequence(i);
            const mult = strictIncSeq.knotMultiplicity(indexStrictIncSeq);
            if(mult !== (this._degree + 1)) {
                spline.clamp(from);
                newFromSpan = clampingFindSpan(from, spline.knots, spline._degree);
            }
        } else {
            spline.clamp(from);
            newFromSpan = clampingFindSpan(from, spline.knots, spline._degree);
        }
        if(spline._increasingKnotSequence.isAbscissaCoincidingWithKnot(to)) {
            let i = 0;
            for(const knot of strictIncSeq) {
                if(knot !== undefined && Math.abs(to - knot.abscissa) < TOL_KNOT_COINCIDENCE) break;
                i++;
            }
            const indexStrictIncSeq = new KnotIndexStrictlyIncreasingSequence(i);
            const mult = strictIncSeq.knotMultiplicity(indexStrictIncSeq);
            if(mult !== (this._degree + 1)) {
                spline.clamp(to);
                newToSpan = clampingFindSpan(to, spline.knots, spline._degree);
            }
        } else {
            spline.clamp(to);
            newToSpan = clampingFindSpan(to, spline.knots, spline._degree);
        }

        const newKnots : number[] = []
        const newControlPoints : Vector2d[] = []

        for (let i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline.knots[i])
        }

        for (let i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector2d(spline._controlPoints[i].x, spline._controlPoints[i].y))
        }
        const knotSequence = this.resetKnotAbscissaToOrigin(newKnots);

        return new BSplineR1toR2(newControlPoints, knotSequence);
    }

}

export function create_BSplineR1toR2(controlPoints: number[][], knots: number[]): BSplineR1toR2 {
    let newControlPoints: Vector2d[] = [];
    for (let cp of controlPoints) {
        newControlPoints.push(new Vector2d(cp[0], cp[1]));
    }
    return new BSplineR1toR2(newControlPoints, knots);
}

export function create_BSplineR1toR2V2d(controlPoints: Vector2d[], knots: number[]): BSplineR1toR2 {
    return new BSplineR1toR2(controlPoints, knots);
}

// export function convertToBsplR1_to_R2(spline: BSplineR1toR2): BSpline_R1_to_R2 {
//     return new BSpline_R1_to_R2(spline.controlPoints, spline.knots);
// }

