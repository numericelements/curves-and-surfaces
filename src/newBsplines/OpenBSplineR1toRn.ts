import { VectorDesc } from "../mathVector/utilityTypes/VectorDescriptorTypes";
import { Vector } from "../mathVector/interfaces/VectorInterfaces";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractBSplineR1toRn, checkConsistency, normalizeDescriptorsToControlPolygon } from "./AbstractBSplineR1toRn";
import { AlgorithmBootstrap } from "./AlgorithmBootstrap";
import { AlgorithmRegistry } from "./AlgorithmRegistry";
import { BSPL_CP_DEG_NONUNIFORM, BSPL_CP_DEG_UNIFORM, BSPL_CP_DEG_UNIFORM_EUCLIDEAN, BSPL_CP_NO_KNOT, BSpline_CP, BSpline_CP_Deg_NonUniform, BSpline_CP_Deg_Uniform, BSpline_CP_Deg_Uniform_EuclideanDist, BSpline_type, ControlPoints } from "./BSplineR1toRnConstructorInterface";
import { ControlPolygon } from "./ControlPolygon";
import { ControlPolygonFromDescriptors } from "./ControlPolygonFromDescriptors";
import { CoxDeBoorAlgorithm } from "./CoxDeBoorAlgorithm";
import { fromStrictlyIncreasingtToIncreasingKnotSequenceOC } from "./KnotSequenceAndUtilities/fromStrictlyIncreasingtToIncreasingKnotSequenceOC";
import { NO_KNOT_OPEN_CURVE, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "./StrictlyIncreasingPeriodicKnotSequenceClosedCurve";



export class BSplineEvaluator<V extends Vector<any, VectorDesc>> {

    evaluate(parameter: number): V {
        return null as any;
    };
}

// export class CoxDeBoorEvaluator<V extends Vector, D extends number> extends BSplineEvaluator<V, D> {

//     private vectorSpace: RealVectorSpace<number>;
//     private _isDirty: boolean = true;
//     private _flatCoordinates: Float64Array | null = null;

//     constructor(private controlPolygon: ControlPolygon<V, D>) {
//         super();
//         // this.vectorSpace = new RealVectorSpace(controlPolygon.spaceDimension);
//         this.vectorSpace = createRealVectorSpace(controlPolygon.spaceDimension)
//     }
    
//     get flatCoordinates(): Float64Array {
//         if (this._isDirty || !this._flatCoordinates) {
//             // Fix: Actually implement the flattening
//             const coords: number[] = [];
//             for (let i = 0; i < this.controlPolygon.length; i++) {
//                 const vector = this.controlPolygon.controlPoints[i].toArray();
//                 // if(isVector2D(vector) || isVector3D(vector) || isVector4D(vector)) {
//                 //     coords.push(...vector.coordinates);
//                 // } else {
//                 //     coords.push(vector);
//                 // }
//             }
//             this._flatCoordinates = new Float64Array(coords);
//             this._isDirty = false;
//         }
//         return this._flatCoordinates;
//     }
    
//     evaluate(parameter: number): IVector<D, V> {
//         // Ultra-efficient implementation
//         const coords = this.flatCoordinates;
//         // ... Cox-de Boor algorithm
//         const resultCoords = this.coxDeBoorAlgorithm(parameter, coords);
//         return this.vectorSpace.createVector(resultCoords);
//     }

//     invalidate(): void {
//         this._isDirty = true;
//     }

//     private coxDeBoorAlgorithm(u: number, controlPoints: Float64Array): number[] {
//         // Placeholder - implement actual algorithm
//         const dim = this.vectorSpace.dimension();
//         return new Array(dim).fill(0);
//     }
// }

// export class CoxDeBoorProjectiveEvaluator<V extends Vector, D extends number> extends BSplineEvaluator {
//     private vectorSpace: ProjectiveVectorSpace;
    
//     constructor(
//         private controlPolygon: ControlPolygon<V, D>,
//         private knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
//         private degree: number
//     ) {
//         super();
//         this.vectorSpace = new ProjectiveVectorSpace(controlPolygon.spaceDimension);
//     }

//     evaluate(parameter: number): RealVector {
//         // 1. Evaluate in projective space
//         const projResult = this.evaluateProjective(parameter);
//         // 2. Convert back to real space
//         return this.vectorSpace.fromProjectiveVectorSpaceToRealVectorSpace(projResult);
//     }

//     private evaluateProjective(parameter: number): ProjectiveVector {
//         // Cox-de Boor algorithm for projective vectors
//         // Handle weights properly
//         return this.vectorSpace.createVector([]);
//     }
// }

/**
 * Performance-optimized evaluator for real vectors
 * Handles caching, coordinate flattening, and other optimizations
 */
// export class CoxDeBoorRealEvaluator<V extends RealVector, D extends number> extends BSplineEvaluator {
//     private vectorSpace: RealVectorSpace<number>;
//     private algorithm: CoxDeBoorAlgorithm<V, D>;
    
//     // Performance optimization caches
//     private _isDirty: boolean = true;
//     private _flatCoordinates: Float64Array | null = null;
//     private _lastParameter: number = NaN;
//     private _lastResult: RealVector | null = null;

//     constructor(
//         private controlPolygon: ControlPolygon<V, D>,
//         private knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
//         private degree: number
//     ) {
//         super();
//         const increasingKnotSequence = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(knotSequence);
//         this.vectorSpace = controlPolygon.vectorSpace as RealVectorSpace<D>;
//         this.algorithm = new CoxDeBoorAlgorithm(controlPolygon, increasingKnotSequence, this.degree);
//     }

//     evaluate(parameter: number): RealVector {
//         // Performance optimization: check if same parameter
//         if (!this._isDirty && parameter === this._lastParameter && this._lastResult) {
//             return this._lastResult;
//         }

//         const coords = this.getFlatCoordinates();
//         const resultCoords = this.algorithm.compute(parameter, coords);
//         const result = this.vectorSpace.createVector(resultCoords);
        
//         // Cache the result
//         this._lastParameter = parameter;
//         this._lastResult = result;
//         this._isDirty = false;
//         return result;
//     }

//     private getFlatCoordinates(): Float64Array {
//         if (this._isDirty || !this._flatCoordinates) {
//             const coords: number[] = [];
//             for (let i = 0; i < this.controlPolygon.length; i++) {
//                 const vector = this.controlPolygon.controlPoints[i].toArray();
//                 coords.push(...vector);
//                 // if (isVector2D(vector) || isVector3D(vector) || isVector4D(vector)) {
//                 //     coords.push(...vector.coordinates);
//                 // } else {
//                 //     coords.push(vector as any); // Handle scalar case
//                 // }
//             }
//             this._flatCoordinates = new Float64Array(coords);
//             this._isDirty = false;
//         }
//         return this._flatCoordinates;
//     }

//     invalidate(): void {
//         this._isDirty = true;
//         this._flatCoordinates = null;
//         this._lastResult = null;
//         this._lastParameter = NaN;
//     }
// }


export type OpenBSplineCtorParams =
    | BSpline_CP
    | BSpline_CP_Deg_Uniform
    | BSpline_CP_Deg_Uniform_EuclideanDist
    | BSpline_CP_Deg_NonUniform;

type PreparedOpenInit = {
    controlPolygon: ControlPolygon<Vector<any, VectorDesc>>;
    knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;
    degree: number;
    knots: readonly number[];
    curveOrigin: number;
    vectorSpace: VectorSpaceType;
    spaceDimension: number;
};


export class OpenBSplineR1toRn<IV extends Vector<any, VectorDesc>>
    extends AbstractBSplineR1toRn<IV>
{
    protected readonly _curveOrigin: number;
    protected readonly _knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;
    // protected readonly _controlPolygon: ControlPolygon<IV>;
    protected readonly _evaluator: BSplineEvaluator<IV>;

    // private readonly _params: OpenBSplineCtorParams;

    constructor(
        controlPolygon: ControlPolygon<IV>,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve,
        degree: number,
        vectorSpace: VectorSpaceType,
        spaceDimension: number
    ) {
        const knots = knotSequence.distinctAbscissae();
        const nbKnotsIncreasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(knotSequence).length();
        checkConsistency(degree, nbKnotsIncreasingSeq, controlPolygon.length, vectorSpace, spaceDimension);
        super(controlPolygon, knotSequence, degree, vectorSpace, spaceDimension);

        this._knotSequence = knotSequence;
        this._curveOrigin = knots[knotSequence.indexKnotOrigin.knotIndex];

        AlgorithmBootstrap.initialize();
        const algorithmName = AlgorithmBootstrap.getRecommendedAlgorithm(vectorSpace, "general");
        this._evaluator = AlgorithmRegistry.createEvaluator(
            algorithmName,
            this._controlPolygon,
            this._knotSequence,
            this._degree,
            this._vectorSpace
        );
    }

    private static prepareOpenInit(curveParameters: OpenBSplineCtorParams): PreparedOpenInit {
        const controlPolygon = OpenBSplineR1toRn.toCanonicalControlPolygon(
            curveParameters.controlPoints as ControlPoints<Vector<any, VectorDesc>>
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

    get controlPolygon(): ControlPolygon<IV> {
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

    evaluate(u: number): IV {
        return this._evaluator.evaluate(u);
    }

    evaluateWithAlgorithm(u: number, algorithmName?: string): IV {
        const name = algorithmName
            ?? AlgorithmBootstrap.getRecommendedAlgorithm(this._vectorSpace, "general");

        const evaluator = AlgorithmRegistry.createEvaluator(
            name,
            this._controlPolygon as ControlPolygon<Vector<any, VectorDesc>>,
            this._knotSequence,
            this._degree,
            this._vectorSpace
        );

        return evaluator.evaluate(u) as IV;
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
    withKnots(knots: readonly number[]): OpenBSplineR1toRn<IV> {
        const knotSequence = this._knotSequence.insertKnot(knots as any);
        return new OpenBSplineR1toRn<IV>(
            this._controlPolygon,
            knotSequence,
            this._degree,
            this._vectorSpace,
            this._spaceDimension
        );
    }

    withControlPolygon(controlPolygon: ControlPolygon<IV>): OpenBSplineR1toRn<IV> {
        return new OpenBSplineR1toRn<IV>(
            controlPolygon,
            this._knotSequence,
            this._degree,
            this._vectorSpace,
            this._spaceDimension
        );
    }

    withControlPoints(controlPoints: ControlPolygonFromDescriptors | ControlPolygon<IV>): OpenBSplineR1toRn<IV> {
        return this.withControlPolygon(
            OpenBSplineR1toRn.toCanonicalControlPolygon(controlPoints as any) as ControlPolygon<IV>
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

    moveControlPoint(index: number, displacement: IV): OpenBSplineR1toRn<IV> {
        return this.withControlPolygon(this._controlPolygon.withMovedControlPoint(index, displacement));
        // this.strategy.invalidate();
    }

    private static toCanonicalControlPolygon<IV extends Vector<any, VectorDesc>>(
        cp: ControlPolygonFromDescriptors | ControlPolygon<IV>
    ): ControlPolygon<IV> {
        if (cp instanceof ControlPolygon) return cp;
        if (cp instanceof ControlPolygonFromDescriptors) {
            return normalizeDescriptorsToControlPolygon(cp as any) as ControlPolygon<IV>;
        }
        return normalizeDescriptorsToControlPolygon(
            new ControlPolygonFromDescriptors(cp as any)
        ) as ControlPolygon<IV>;
    }

    private static toDescriptorPolygon<IV extends Vector<any, VectorDesc>>(
        cp: ControlPolygon<IV>
    ): ControlPolygonFromDescriptors {
        return new ControlPolygonFromDescriptors(cp as any);
    }
}

export interface AlgorithmDescriptor<IV extends Vector<any, VectorDesc>> {
    name: string;
    vectorSpaceTypes: VectorSpaceType[];
    description: string;
    factory: AlgorithmFactory<IV>;
}

export interface AlgorithmFactory<IV extends Vector<any, VectorDesc>> {
    createEvaluator(
        controlPolygon: ControlPolygon<IV>,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve | StrictlyIncreasingPeriodicKnotSequenceClosedCurve,
        degree: number
    ): BSplineEvaluator<IV>;
}

export interface AlgorithmFactoryInterface {
    createEvaluator(
        controlPolygon: ControlPolygon<Vector<any, VectorDesc>>,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve | StrictlyIncreasingPeriodicKnotSequenceClosedCurve,
        degree: number
    ): BSplineEvaluator<Vector<any, VectorDesc>>;
}

export interface AlgorithmRegistration {
    readonly name: string;
    readonly vectorSpaceTypes: readonly VectorSpaceType[];
    readonly description: string;
    readonly factory: AlgorithmFactoryInterface;
}


// export class AlgorithmRegistry {
//     private static readonly _registry = new Map<string, AlgorithmRegistration>();
//     private static readonly _defaults = new Map<VectorSpaceType, string>();

//     static register(registration: AlgorithmRegistration): void {
//         if (this._registry.has(registration.name)) {
//             throw new Error(`Algorithm '${registration.name}' is already registered`);
//         }
//         this._registry.set(registration.name, registration);
//     }

//     static isRegistered(algorithmName: string): boolean {
//         return this._registry.has(algorithmName);
//     }

//     static registeredNames(): readonly string[] {
//         return [...this._registry.keys()];
//     }

//     static getAvailableAlgorithms(vectorSpaceType?: VectorSpaceType): string[] {
//         const names: string[] = [];
//         this._registry.forEach((reg, name) => {
//             if (!vectorSpaceType || reg.vectorSpaceTypes.some(v => v === vectorSpaceType)) {
//                 names.push(name);
//             }
//         });
//         return names;
//     }

//     static getDefaultAlgorithm(vectorSpaceType: VectorSpaceType): string {
//         const explicit = this._defaults.get(vectorSpaceType);
//         if (explicit) return explicit;

//         const available = this.getAvailableAlgorithms(vectorSpaceType);
//         if (available.some(a => a === "coxdeboor")) return "coxdeboor";
//         if (available.length > 0) return available[0];
//         throw new Error(`No algorithm registered for vector space '${vectorSpaceType}'`);
//     }

//     static setDefaultAlgorithm(vectorSpaceType: VectorSpaceType, algorithmName: string): void {
//         const reg = this._registry.get(algorithmName);
//         if (!reg) throw new Error(`Algorithm '${algorithmName}' is not registered`);
//         if (!reg.vectorSpaceTypes.some(v => v === vectorSpaceType)) {
//             throw new Error(`Algorithm '${algorithmName}' does not support vector space type '${vectorSpaceType}'`);
//         }
//         this._defaults.set(vectorSpaceType, algorithmName);
//     }

//     // static getFactory(algorithmName: string, vectorSpaceType: VectorSpaceType): AlgorithmFactory | undefined {
//     //     return this.algorithms.get(algorithmName)?.get(vectorSpaceType);
//     // }

//     static createEvaluator<V extends Vector, D extends number>(
//         algorithmName: string,
//         controlPolygon: ControlPolygon<V, D>,
//         knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve | StrictlyIncreasingPeriodicKnotSequenceClosedCurve,
//         degree: number,
//         vectorSpaceType: VectorSpaceType
//     ): BSplineEvaluator<V, D> {
//         const reg = this._registry.get(algorithmName);
//         if (!reg) {
//             throw new Error(`Algorithm '${algorithmName}' is not registered. Did you call AlgorithmBootstrap.initialize()?`);
//         }
//         if (!reg.vectorSpaceTypes.some(v => v === vectorSpaceType)) {
//             throw new Error(`Algorithm '${algorithmName}' does not support vector space type '${vectorSpaceType}'`);
//         }
//         return reg.factory.createEvaluator(controlPolygon, knotSequence, degree);
//     }
// }
