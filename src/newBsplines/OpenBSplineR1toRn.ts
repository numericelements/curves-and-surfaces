import { ProjectiveVectorSpace } from "../mathVector/ProjectiveVectorSpace";
import { RealVectorSpace } from "../mathVector/RealVectorSpace";
import { IVector } from "../mathVector/Vector";
import { ProjectiveVector, RealVector, Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { createRealVectorSpace } from "../mathVector/VectorSpaceFactory";
import { isVector2D, isVector3D, isVector4D } from "../mathVector/VectorSpaceUtilities";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";
import { AbstractBSplineR1toRn, normalizeDescriptorsToControlPolygon } from "./AbstractBSplineR1toRn";
import { AbstractOPenBSplineR1toRnStrategy } from "./AbstractOPenBSplineR1toRnStrategy";
import { AlgorithmBootstrap } from "./AlgorithmBootstrap";
import { BSPL_CP_DEG_NONUNIFORM, BSPL_CP_DEG_UNIFORM, BSPL_CP_DEG_UNIFORM_EUCLIDEAN, BSPL_CP_NO_KNOT, BSpline_CP, BSpline_CP_Deg_NonUniform, BSpline_CP_Deg_Uniform, BSpline_CP_Deg_Uniform_EuclideanDist, BSpline_type, ControlPoints } from "./BSplineR1toRnConstructorInterface";
import { ControlPolygon } from "./ControlPolygon";
import { ControlPolygonFromDescriptors } from "./ControlPolygonFromDescriptors";
import { CoxDeBoorAlgorithm } from "./CoxDeBoorAlgorithm";
import { NO_KNOT_OPEN_CURVE, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
// import { OpenBSplineR1toRnComplexProjectiveVectorStrategy } from "./OpenBSplineR1toRnComplexProjectiveVectorStrategy";
// import { OpenBSplineR1toRnComplexVectorStrategy } from "./OpenBSplineR1toRnComplexVectorStrategy";
// import { OpenBSplineR1toRnRealProjectiveVectorStrategy } from "./OpenBSplineR1toRnRealProjectiveVectorStrategy";
// import { OpenBSplineR1toRnRealVectorStrategy } from "./OpenBSplineR1toRnRealVectorStrategy";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";


// Strategy interface
// export interface OpenBSplineR1toRnStrategy<V extends Vector, D extends number> {
//     evaluate(u: number): RealVector;
//     evaluateWithAlgorithm(u: number, algorithmName: string): RealVector;
//     setDefaultAlgorithm(algorithmName: string): void;
//     derivative(): OpenBSplineR1toRn<V, D>;
//     bernsteinDecomposition(): OpenBSplineR1toRn<V, D>;
//     euclideanDistances(): number[];
//     // getEvaluatorView<T>(viewType: string, factory:() => T): T;
//     getEvaluatorView<T extends BSplineEvaluator>(algorithmName: string): T
//     invalidate(): void;
// }

export class BSplineEvaluator {

    evaluate(parameter: number): RealVector {
        return 0;
    };
}

export class CoxDeBoorEvaluator<T extends Vector = Vector> extends BSplineEvaluator {

    private vectorSpace: RealVectorSpace<number>;
    private _isDirty: boolean = true;
    private _flatCoordinates: Float64Array | null = null;

    constructor(private controlPolygon: ControlPolygonFromDescriptors) {
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
        private controlPolygon: ControlPolygonFromDescriptors,
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
        private controlPolygon: ControlPolygonFromDescriptors,
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


export type OpenBSplineCtorParams =
    | BSpline_CP
    | BSpline_CP_Deg_Uniform
    | BSpline_CP_Deg_Uniform_EuclideanDist
    | BSpline_CP_Deg_NonUniform;

type PreparedOpenInit = {
    controlPolygon: ControlPolygon<Vector, number>;
    knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;
    degree: number;
    knots: readonly number[];
    curveOrigin: number;
    vectorSpace: VectorSpaceType;
    spaceDimension: number;
};

export class OpenBSplineR1toRn<V extends Vector, D extends number>
    extends AbstractBSplineR1toRn<V, D>
{
    protected readonly _curveOrigin: number;
    protected readonly _knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;
    // protected readonly _controlPolygon: ControlPolygon<V, D>;
    protected readonly _evaluator: BSplineEvaluator;

    // private readonly _params: OpenBSplineCtorParams;

    // constructor(curveParameters: OpenBSplineCtorParams) {
    //     const init = OpenBSplineR1toRn.prepareOpenInit(curveParameters);

    //     super(
    //         init.controlPolygon as ControlPolygon<V, D>,
    //         init.knots,
    //         init.degree,
    //         init.vectorSpace,
    //         init.spaceDimension
    //     );

    //     this._params = curveParameters;
    //     this._controlPolygon = init.controlPolygon as ControlPolygon<V, D>;
    //     this._knotSequence = init.knotSequence;
    //     this._curveOrigin = init.curveOrigin;

    //     AlgorithmBootstrap.initialize();
    //     const algorithmName = AlgorithmBootstrap.getRecommendedAlgorithm(this._vectorSpace, "general");
    //     this._evaluator = AlgorithmRegistry.createEvaluator(
    //         algorithmName,
    //         OpenBSplineR1toRn.toDescriptorPolygon(this._controlPolygon),
    //         this._knotSequence,
    //         this._degree,
    //         null,
    //         this._vectorSpace
    //     );
    // }
    constructor(
        controlPolygon: ControlPolygon<V, D>,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
        degree: number,
        vectorSpace: VectorSpaceType,
        spaceDimension: number
    ) {
        const knots = knotSequence.distinctAbscissae();
        super(controlPolygon, knots, degree, vectorSpace, spaceDimension);

        this._knotSequence = knotSequence;
        this._curveOrigin = knots[knotSequence.indexKnotOrigin.knotIndex];

        AlgorithmBootstrap.initialize();
        const algorithmName = AlgorithmBootstrap.getRecommendedAlgorithm(vectorSpace, "general");
        this._evaluator = AlgorithmRegistry.createEvaluator(
            algorithmName,
            new ControlPolygonFromDescriptors(controlPolygon as any) as any,
            knotSequence,
            degree,
            null,
            vectorSpace
        );
    }

    private static prepareOpenInit(curveParameters: OpenBSplineCtorParams): PreparedOpenInit {
        const controlPolygon = OpenBSplineR1toRn.toCanonicalControlPolygon(
            curveParameters.controlPoints as ControlPoints<Vector, number>
        );

        let degree: number;
        let knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;

        if (curveParameters.type === BSPL_CP_NO_KNOT) {
            degree = controlPolygon.length - 1;
            knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(
                degree + 1,
                { type: NO_KNOT_OPEN_CURVE }
            );
        } else if (
            curveParameters.type === BSPL_CP_DEG_UNIFORM ||
            curveParameters.type === BSPL_CP_DEG_UNIFORM_EUCLIDEAN
        ) {
            degree = curveParameters.degree;
            knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(
                degree + 1,
                { type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: controlPolygon.length - 1 }
            );
        } else {
            // BSPL_CP_DEG_NONUNIFORM
            degree = curveParameters.degree;
            knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(
                degree + 1,
                { type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: controlPolygon.length - 1 }
            );
        }

        const knots = knotSequence.distinctAbscissae();
        const curveOrigin = knots[knotSequence.indexKnotOrigin.knotIndex];

        const first = controlPolygon.controlPoints[0];
        if (!first) throw new Error("Control polygon must contain at least one point");

        const vectorSpace = first.vectorSpace.spaceType as VectorSpaceType;
        const spaceDimension = first.dimension;

        return {
            controlPolygon,
            knotSequence,
            degree,
            knots,
            curveOrigin,
            vectorSpace,
            spaceDimension
        };
    }

    get controlPolygon(): ControlPolygon<V, D> {
        return this._controlPolygon;
    }

    get knotSequence(): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        return this._knotSequence;
    }

    get degree(): number {
        return this._degree;
    }

    get curveOrigin(): number {
        return this._curveOrigin;
    }

    evaluate(u: number): RealVector {
        return this._evaluator.evaluate(u);
    }

    evaluateWithAlgorithm(u: number, algorithmName?: string): RealVector {
        const name = algorithmName
            ?? AlgorithmBootstrap.getRecommendedAlgorithm(this._vectorSpace, "general");

        const evaluator = AlgorithmRegistry.createEvaluator(
            name,
            OpenBSplineR1toRn.toDescriptorPolygon(this._controlPolygon),
            this._knotSequence,
            this._degree,
            null,
            this._vectorSpace
        );

        return evaluator.evaluate(u);
    }

    getAvailableAlgorithms(): string[] {
        return AlgorithmRegistry.getAvailableAlgorithms(this._vectorSpace);
    }

    /**
     * Switch to a different algorithm for future evaluations
     */
    setDefaultAlgorithm(vectorSpaceType: VectorSpaceType, algorithmName: string): void {
        const available = this.getAvailableAlgorithms();
        if (available.indexOf(algorithmName) == -1) {
            throw new Error(`Algorithm '${algorithmName}' not available for vector space type ${this._vectorSpace}`);
        }
        AlgorithmRegistry.setDefaultAlgorithm(vectorSpaceType, algorithmName);
    }

    /**
     * Immutable update API for knots.
     * (Uses current parameter scheme; adapt when knot-sequence interface is fully generalized.)
     */
    // withKnots(_knots: readonly number[]): OpenBSplineR1toRn<V, D> {
    //     return new OpenBSplineR1toRn<V, D>(this._buildParams());
    // }
    withKnots(knots: readonly number[]): OpenBSplineR1toRn<V, D> {
        const knotSequence = this._knotSequence.insertKnot(knots as any);
        return new OpenBSplineR1toRn<V, D>(
            this._controlPolygon,
            knotSequence,
            this._degree,
            this._vectorSpace,
            this._spaceDimension
        );
    }

    withControlPolygon(controlPolygon: ControlPolygon<V, D>): OpenBSplineR1toRn<V, D> {
        return new OpenBSplineR1toRn<V, D>(
            controlPolygon,
            this._knotSequence,
            this._degree,
            this._vectorSpace,
            this._spaceDimension
        );
    }

    // withControlPolygon(controlPolygon: ControlPolygon<V, D>): OpenBSplineR1toRn<V, D> {
    //     return new OpenBSplineR1toRn<V, D>({
    //         ...this._params,
    //         controlPoints: controlPolygon as any
    //     });
    // }

    withControlPoints(controlPoints: ControlPoints<V, D>): OpenBSplineR1toRn<V, D> {
        return this.withControlPolygon(
            OpenBSplineR1toRn.toCanonicalControlPolygon(controlPoints as any) as ControlPolygon<V, D>
        );
    }

    euclideanDistances(): number[] {
        throw new Error("euclideanDistances: not yet implemented in this version");
    }

    // private _buildParams(): OpenBSplineCtorParams {
    //     return {
    //         ...this._params,
    //         controlPoints: this._controlPolygon as any
    //     };
    // }

    moveControlPoint(index: number, displacement: IVector<D, V>): OpenBSplineR1toRn<V, D> {
        return this.withControlPolygon(this._controlPolygon.withMovedControlPoint(index, displacement));
        // this.strategy.invalidate();
    }

    private static toCanonicalControlPolygon<V extends Vector, D extends number>(
        cp: ControlPoints<V, D>
    ): ControlPolygon<V, D> {
        if (cp instanceof ControlPolygon) return cp;
        if (cp instanceof ControlPolygonFromDescriptors) {
            return normalizeDescriptorsToControlPolygon(cp as any) as ControlPolygon<V, D>;
        }
        return normalizeDescriptorsToControlPolygon(
            new ControlPolygonFromDescriptors(cp as any)
        ) as ControlPolygon<V, D>;
    }

    private static toDescriptorPolygon<V extends Vector, D extends number>(
        cp: ControlPolygon<V, D>
    ): ControlPolygonFromDescriptors<V, D> {
        return new ControlPolygonFromDescriptors(cp as any) as ControlPolygonFromDescriptors<V, D>;
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
        controlPolygon: ControlPolygonFromDescriptors,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
        degree: number,
        vectorSpace: any
    ): BSplineEvaluator;
}

export interface AlgorithmFactoryInterface<V extends Vector, D extends number> {
    createEvaluator(
        controlPolygon: ControlPolygonFromDescriptors,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
        degree: number,
        vectorSpace: unknown
    ): BSplineEvaluator;
}

export interface AlgorithmRegistration<V extends Vector, D extends number> {
    readonly name: string;
    readonly vectorSpaceTypes: readonly VectorSpaceType[];
    readonly description: string;
    readonly factory: AlgorithmFactoryInterface<V, D>;
}

export class AlgorithmRegistry {
    private static algorithms = new Map<string, Map<VectorSpaceType, AlgorithmFactory>>();
    private static readonly _registry = new Map<string, AlgorithmRegistration<any, any>>();

    // static register(descriptor: AlgorithmDescriptor): void {
    //     if (!this.algorithms.has(descriptor.name)) {
    //         this.algorithms.set(descriptor.name, new Map());
    //     }
        
    //     const algorithmMap = this.algorithms.get(descriptor.name)!;
    //     descriptor.vectorSpaceTypes.forEach(vectorType => {
    //         algorithmMap.set(vectorType, descriptor.factory);
    //     });
    // }


    static createEvaluator<V extends Vector, D extends number>(
        algorithmName: string,
        controlPolygon: ControlPolygonFromDescriptors,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
        degree: number,
        vectorSpace: unknown,
        vectorSpaceType: VectorSpaceType
    ): BSplineEvaluator {
        const registration = AlgorithmRegistry._registry.get(algorithmName);
        if (!registration) {
            throw new Error(
                `Algorithm '${algorithmName}' is not registered. ` +
                `Did you call AlgorithmBootstrap.initialize()?`
            );
        }

        // if (!registration.vectorSpaceTypes.includes(vectorSpaceType)) {
        //     throw new Error(
        //         `Algorithm '${algorithmName}' does not support vector space type '${vectorSpaceType}'`
        //     );
        // }
        if (!registration.vectorSpaceTypes.some(vst => vst === vectorSpaceType)) {
            throw new Error(
                `Algorithm '${algorithmName}' does not support vector space type '${vectorSpaceType}'`
            );
}

        return registration.factory.createEvaluator(
            controlPolygon,
            knotSequence,
            degree,
            vectorSpace
        );
    }


    static register<V extends Vector, D extends number>(
        registration: AlgorithmRegistration<V, D>
    ): void {
        if (AlgorithmRegistry._registry.has(registration.name)) {
            throw new Error(`Algorithm '${registration.name}' is already registered`);
        }
        AlgorithmRegistry._registry.set(registration.name, registration);
    }

    // static create<V extends Vector, D extends number>(
    //     algorithmName: string,
    //     curve: AbstractBSplineR1toRn<V, D>
    // ): AbstractOPenBSplineR1toRnStrategy<V, D> {
    //     const registration = AlgorithmRegistry._registry.get(algorithmName);
    //     if (!registration) {
    //         throw new Error(
    //             `Algorithm '${algorithmName}' is not registered. ` +
    //             `Did you call AlgorithmBootstrap.initialize()?`
    //         );
    //     }
    //     if (!registration.vectorSpaceTypes.includes(curve.vectorSpace)) {
    //         throw new Error(
    //             `Algorithm '${algorithmName}' does not support ` +
    //             `vector space type '${curve.vectorSpace}'`
    //         );
    //     }
    //     return registration.factory.create(curve);
    // }
    
    static isRegistered(algorithmName: string): boolean {
        return AlgorithmRegistry._registry.has(algorithmName);
    }

    static registeredNames(): readonly string[] {
        return [...AlgorithmRegistry._registry.keys()];
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

    static setDefaultAlgorithm(vectorSpaceType: VectorSpaceType, algorithmName: string): void {
        if (!this.algorithms.has(algorithmName)) {
            throw new Error(`Algorithm '${algorithmName}' is not registered`);
        }
        const vectorSpaceMap = this.algorithms.get(algorithmName)!;
        if (!vectorSpaceMap.has(vectorSpaceType)) {
            throw new Error(
                `Algorithm '${algorithmName}' does not support vector space type '${vectorSpaceType}'`
            );
        }
        // Move the algorithm to the front of the list for this vector space type
        const currentDefault = this.getDefaultAlgorithm(vectorSpaceType);
        if (currentDefault === algorithmName) return; // Already default

        // Reorder algorithms to make the specified one the default
        const newAlgorithms = new Map<string, Map<VectorSpaceType, AlgorithmFactory>>();
        newAlgorithms.set(algorithmName, vectorSpaceMap);
        this.algorithms.forEach((vsMap, name) => {
            if (name !== algorithmName && vsMap.has(vectorSpaceType)) {
                newAlgorithms.set(name, vsMap);
            }
        });
        this.algorithms = newAlgorithms;
    }
}
