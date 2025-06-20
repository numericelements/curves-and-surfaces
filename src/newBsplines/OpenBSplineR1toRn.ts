import { ProjectiveVectorSpace } from "../mathVector/ProjectiveVectorSpace";
import { createRealVectorSpace, RealVectorSpace } from "../mathVector/RealVectorSpace";
import { ProjectiveVector, RealVector, Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { isVector2D, isVector3D, isVector4D } from "../mathVector/VectorSpaceUtilities";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";
import { AbstractBSplineR1toRn } from "./AbstractBSplineR1toRn";
import { AlgorithmBootstrap } from "./AlgorithmBootstrap";
import { BSPL_CP_DEG_NONUNIFORM, BSPL_CP_DEG_UNIFORM, BSPL_CP_DEG_UNIFORM_EUCLIDEAN, BSPL_CP_NO_KNOT, BSpline_type } from "./BSplineR1toRnConstructorInterface";
import { ControlPolygon } from "./ControlPolygon";
import { CoxDeBoorAlgorithm } from "./CoxDeBoorAlgorithm";
import { NO_KNOT_OPEN_CURVE, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { OpenBSplineR1toRnComplexProjectiveVectorStrategy } from "./OpenBSplineR1toRnComplexProjectiveVectorStrategy";
import { OpenBSplineR1toRnComplexVectorStrategy } from "./OpenBSplineR1toRnComplexVectorStrategy";
import { OpenBSplineR1toRnRealProjectiveVectorStrategy } from "./OpenBSplineR1toRnRealProjectiveVectorStrategy";
import { OpenBSplineR1toRnRealVectorStrategy } from "./OpenBSplineR1toRnRealVectorStrategy";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";


// Strategy interface
export interface OpenBSplineR1toRnStrategy {
    evaluate(u: number): RealVector;
    evaluateWithAlgorithm(u: number, algorithmName: string): RealVector;
    setDefaultAlgorithm(algorithmName: string): void;
    derivative(): OpenBSplineR1toRn;
    bernsteinDecomposition(): OpenBSplineR1toRn;
    euclideanDistances(): number[];
    // getEvaluatorView<T>(viewType: string, factory:() => T): T;
    getEvaluatorView<T extends BSplineEvaluator>(algorithmName: string): T
    invalidate(): void;
}

export class BSplineEvaluator {

    evaluate(parameter: number): RealVector {
        return 0;
    };
}

export class CoxDeBoorEvaluator<T extends Vector = Vector> extends BSplineEvaluator {

    private vectorSpace: RealVectorSpace<number>;
    private _isDirty: boolean = true;
    private _flatCoordinates: Float64Array | null = null;

    constructor(private controlPolygon: ControlPolygon) {
        super();
        // this.vectorSpace = new RealVectorSpace(controlPolygon.spaceDimension);
        this.vectorSpace = createRealVectorSpace(controlPolygon.spaceDimension)
    }
    
    get flatCoordinates(): Float64Array {
        if (this._isDirty || !this._flatCoordinates) {
            // Fix: Actually implement the flattening
            const coords: number[] = [];
            for (let i = 0; i < this.controlPolygon.length; i++) {
                const vector = this.controlPolygon.getVector(i) as RealVector;
                if(isVector2D(vector) || isVector3D(vector) || isVector4D(vector)) {
                    coords.push(...vector.coordinates);
                } else {
                    coords.push(vector);
                }
            }
            this._flatCoordinates = new Float64Array(coords);
            this._isDirty = false;
        }
        return this._flatCoordinates;
    }
    
    evaluate(parameter: number): RealVector {
        // Ultra-efficient implementation
        const coords = this.flatCoordinates;
        // ... Cox-de Boor algorithm
        const resultCoords = this.coxDeBoorAlgorithm(parameter, coords);
        return this.vectorSpace.createVector(resultCoords);
    }

    invalidate(): void {
        this._isDirty = true;
    }

    private coxDeBoorAlgorithm(u: number, controlPoints: Float64Array): number[] {
        // Placeholder - implement actual algorithm
        const dim = this.vectorSpace.dimension();
        return new Array(dim).fill(0);
    }
}

export class CoxDeBoorProjectiveEvaluator extends BSplineEvaluator {
    private vectorSpace: ProjectiveVectorSpace;
    
    constructor(
        private controlPolygon: ControlPolygon,
        private knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
        private degree: number
    ) {
        super();
        this.vectorSpace = new ProjectiveVectorSpace(controlPolygon.spaceDimension);
    }

    evaluate(parameter: number): RealVector {
        // 1. Evaluate in projective space
        const projResult = this.evaluateProjective(parameter);
        // 2. Convert back to real space
        return this.vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(projResult);
    }

    private evaluateProjective(parameter: number): ProjectiveVector {
        // Cox-de Boor algorithm for projective vectors
        // Handle weights properly
        return this.vectorSpace.createVector([]);
    }
}

/**
 * Performance-optimized evaluator for real vectors
 * Handles caching, coordinate flattening, and other optimizations
 */
export class CoxDeBoorRealEvaluator extends BSplineEvaluator {
    private vectorSpace: RealVectorSpace;
    private algorithm: CoxDeBoorAlgorithm;
    
    // Performance optimization caches
    private _isDirty: boolean = true;
    private _flatCoordinates: Float64Array | null = null;
    private _lastParameter: number = NaN;
    private _lastResult: RealVector | null = null;

    constructor(
        private controlPolygon: ControlPolygon,
        private knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
        private degree: number,
        vectorSpace: RealVectorSpace
    ) {
        super();
        this.vectorSpace = vectorSpace;
        this.algorithm = new CoxDeBoorAlgorithm(controlPolygon, knotSequence, degree);
    }

    evaluate(parameter: number): RealVector {
        // Performance optimization: check if same parameter
        if (!this._isDirty && parameter === this._lastParameter && this._lastResult) {
            return this._lastResult;
        }

        const coords = this.getFlatCoordinates();
        const resultCoords = this.algorithm.compute(parameter, coords);
        const result = this.vectorSpace.createVector(resultCoords);
        
        // Cache the result
        this._lastParameter = parameter;
        this._lastResult = result;
        
        return result;
    }

    private getFlatCoordinates(): Float64Array {
        if (this._isDirty || !this._flatCoordinates) {
            const coords: number[] = [];
            for (let i = 0; i < this.controlPolygon.length; i++) {
                const vector = this.controlPolygon.getVector(i) as RealVector;
                if (isVector2D(vector) || isVector3D(vector) || isVector4D(vector)) {
                    coords.push(...vector.coordinates);
                } else {
                    coords.push(vector as any); // Handle scalar case
                }
            }
            this._flatCoordinates = new Float64Array(coords);
            this._isDirty = false;
        }
        return this._flatCoordinates;
    }

    invalidate(): void {
        this._isDirty = true;
        this._flatCoordinates = null;
        this._lastResult = null;
        this._lastParameter = NaN;
    }
}


export class OpenBSplineR1toRn extends AbstractBSplineR1toRn {

    protected _controlPolygon: ControlPolygon;
    protected _curveOrigin: number;
    protected _degree: number;
    protected _knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;
    protected strategy: OpenBSplineR1toRnStrategy;
    protected _performanceViews: Map <string, any> = new Map();

    constructor(curveParameters: BSpline_type) {
        super(curveParameters);
        this._curveOrigin = KNOT_SEQUENCE_ORIGIN;
        // this.createStrategy(curveParameters);
        switch(this._vectorSpace) {
            case VectorSpaceType.REAL:
                this.strategy = new OpenBSplineR1toRnRealVectorStrategy(curveParameters, this);
                break;
            case VectorSpaceType.COMPLEX:
                this.strategy = new OpenBSplineR1toRnComplexVectorStrategy(curveParameters, this);
                break;
            case VectorSpaceType.PROJECTIVE:
                this.strategy = new OpenBSplineR1toRnRealProjectiveVectorStrategy(curveParameters, this);
                break;
            case VectorSpaceType.PROJECTIVECOMPLEX:
                this.strategy = new OpenBSplineR1toRnComplexProjectiveVectorStrategy(curveParameters, this);
                break;
            default:
                throw new Error("Invalid vector space for OpenBSplineR1toRn constructor");
        }
        if(curveParameters.type === BSPL_CP_NO_KNOT || curveParameters.type === BSPL_CP_DEG_UNIFORM ||
            curveParameters.type === BSPL_CP_DEG_UNIFORM_EUCLIDEAN || curveParameters.type === BSPL_CP_DEG_NONUNIFORM) {
            if(curveParameters.controlPoints instanceof ControlPolygon) {
                this._controlPolygon = curveParameters.controlPoints;
            } else {
                this._controlPolygon = new ControlPolygon(curveParameters.controlPoints);
            }
            if(curveParameters.type === BSPL_CP_NO_KNOT) {
                this._degree = this._controlPolygon.length - 1;
                this._knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._degree + 1, {type: NO_KNOT_OPEN_CURVE});
            } else {
                this._degree = curveParameters.degree;
                if(curveParameters.type === BSPL_CP_DEG_UNIFORM) {
                    this._knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._degree + 1, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: this._controlPolygon.length - 1});
                } else if(curveParameters.type === BSPL_CP_DEG_UNIFORM_EUCLIDEAN) {
                    this._knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._degree + 1, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: this._controlPolygon.length - 1});
                } else {
                    this._knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._degree + 1, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: this._controlPolygon.length - 1});
                }
            }

        } else {
            throw new Error("Invalid curve parameters for OpenBSplineR1toRn constructor");
        }

    }

    get controlPolygon(): ControlPolygon {
        return this._controlPolygon;
    }

    get knotSequence(): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        return this._knotSequence;
    }

    set controlPolygon(controlPolygon: ControlPolygon) {
        this._controlPolygon = controlPolygon;
    }

    set knotSequence(knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve) {
        this._knotSequence = knotSequence;
    }

    euclideanDistances(): number[] {
        const distances = this.strategy.euclideanDistances();
        return distances;
    }

    evaluate(u: number): RealVector {
        const result = this.strategy.evaluate(u);
        // const result = this.strategy.getEvaluatorView('coxdeboor', () => new CoxDeBoorEvaluator(this._controlPolygon)).evaluate(u);
        // this.getEvaluator().evaluate(u);
        // this.getEvaluatorView('coxdeboor', () => new CoxDeBoorView(this._controlPolygon)).evaluate(u);
        return result;
    }

    /**
     * Evaluate using a specific algorithm
     */
    evaluateWithAlgorithm(u: number, algorithmName?: string): RealVector {
        const algorithm = algorithmName || AlgorithmBootstrap.getRecommendedAlgorithm(this._vectorSpace, 'general');
        return this.strategy.evaluateWithAlgorithm(u, algorithm);
    }

    /**
     * Get available algorithms for this curve's vector space
     */
    getAvailableAlgorithms(): string[] {
        return AlgorithmRegistry.getAvailableAlgorithms(this._vectorSpace);
    }

    /**
     * Switch to a different algorithm for future evaluations
     */
    setDefaultAlgorithm(algorithmName: string): void {
        const available = this.getAvailableAlgorithms();
        if (available.indexOf(algorithmName) == -1) {
            throw new Error(`Algorithm '${algorithmName}' not available for vector space type ${this._vectorSpace}`);
        }
        
        this.strategy.setDefaultAlgorithm(algorithmName);
    }

    moveControlPoint(index: number, displacement: Vector): void {
        this._controlPolygon.moveControlPoint(index, displacement);
        this.strategy.invalidate();
    }


}

export interface AlgorithmDescriptor {
    name: string;
    vectorSpaceTypes: VectorSpaceType[];
    description: string;
    factory: AlgorithmFactory;
}

export interface AlgorithmFactory {
    createEvaluator(
        controlPolygon: ControlPolygon,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
        degree: number,
        vectorSpace: any
    ): BSplineEvaluator;
}

export class AlgorithmRegistry {
    private static algorithms = new Map<string, Map<VectorSpaceType, AlgorithmFactory>>();
    
    static register(descriptor: AlgorithmDescriptor): void {
        if (!this.algorithms.has(descriptor.name)) {
            this.algorithms.set(descriptor.name, new Map());
        }
        
        const algorithmMap = this.algorithms.get(descriptor.name)!;
        descriptor.vectorSpaceTypes.forEach(vectorType => {
            algorithmMap.set(vectorType, descriptor.factory);
        });
    }
    
    static getFactory(algorithmName: string, vectorSpaceType: VectorSpaceType): AlgorithmFactory | undefined {
        return this.algorithms.get(algorithmName)?.get(vectorSpaceType);
    }
    
    static getAvailableAlgorithms(vectorSpaceType?: VectorSpaceType): string[] {
        const algorithms: string[] = [];
        this.algorithms.forEach((vectorSpaceMap, algorithmName) => {
            if (!vectorSpaceType || vectorSpaceMap.has(vectorSpaceType)) {
                algorithms.push(algorithmName);
            }
        });
        return algorithms;
    }
    
    static getDefaultAlgorithm(vectorSpaceType: VectorSpaceType): string {
        // Return first available algorithm or 'coxdeboor' as fallback
        const available = this.getAvailableAlgorithms(vectorSpaceType);
        return available.indexOf('coxdeboor') !== -1 ? 'coxdeboor' : available[0] || 'coxdeboor';
    }
}
