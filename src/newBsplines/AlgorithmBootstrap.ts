import { ComplexVector, ProjectiveComplexVector, ProjectiveVector, RealVector, RealVector2D, RealVector3D, RealVector4D, Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { IVector } from "../mathVector/Vector";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AlgorithmRegistry } from "./AlgorithmRegistry";
import { ControlPolygon } from "./ControlPolygon";
// import { BoehmAlgorithmFactory } from "./algorithms/BoehmAlgorithmFactory";
// import { NURBSBookAlgorithmFactory } from "./algorithms/NURBSBookAlgorithmFactory";
import { CoxDeBoorAlgorithmFactory } from "./CoxDeBoorAlgorithmFactory";
import { CoxDeBoorComplexCoordinatesEvaluator } from "./CoxDeBoorComplexCoordinatesEvaluator";
import { CoxDeBoorRealCoordinatesEvaluator } from "./CoxDeBoorRealCoordinatesEvaluator";
import { RealVectorN } from "./CurveEntitiesTypes";
import { AlgorithmFactoryInterface, BSplineEvaluator } from "./OpenBSplineR1toRn";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";

/**
 * Bootstrap class to register all available algorithms
 * This should be called once during application initialization
 */

export function isRealControlPolygon(
    controlPolygon: ControlPolygon<IVector<any, Vector>>
): controlPolygon is ControlPolygon<IVector<any, RealVector>> {
    return controlPolygon.vectorSpace.spaceType === VectorSpaceType.REAL;
}

export function isProjectiveControlPolygon(
    controlPolygon: ControlPolygon<IVector<any, Vector>>
): controlPolygon is ControlPolygon<IVector<any, ProjectiveVector>> {
    return controlPolygon.vectorSpace.spaceType === VectorSpaceType.PROJECTIVE;
}

export function isComplexControlPolygon(
    controlPolygon: ControlPolygon<IVector<any, Vector>>
): controlPolygon is ControlPolygon<IVector<any, ComplexVector>> {
    return controlPolygon.vectorSpace.spaceType === VectorSpaceType.COMPLEX;
}

export function isProjectiveComplexControlPolygon(
    controlPolygon: ControlPolygon<IVector<any, Vector>>
): controlPolygon is ControlPolygon<IVector<any, ProjectiveComplexVector>> {
    return controlPolygon.vectorSpace.spaceType === VectorSpaceType.PROJECTIVECOMPLEX;
}

export class AlgorithmBootstrap {
    private static _initialized = false;
    private static _instance: AlgorithmBootstrap | undefined;

    private constructor() {}
    
    public static getInstance(): AlgorithmBootstrap {
        if (!AlgorithmBootstrap._instance) {
            AlgorithmBootstrap._instance = new AlgorithmBootstrap();
        }
        return AlgorithmBootstrap._instance;
    }

    static initialize(): void {
        if (this._initialized) return;

        const coxFactory: AlgorithmFactoryInterface = {
            createEvaluator(controlPolygon, knotSequence, degree) {
                // if (isRealControlPolygon(controlPolygon)) {
                    if(knotSequence instanceof StrictlyIncreasingOpenKnotSequenceOpenCurve) {
                        if(isRealControlPolygon(controlPolygon)) {
                            return new CoxDeBoorRealCoordinatesEvaluator(controlPolygon, knotSequence, degree);
                        } else if (isProjectiveControlPolygon(controlPolygon)) {
                            return new CoxDeBoorRealCoordinatesEvaluator(controlPolygon, knotSequence, degree);
                        } else if (isComplexControlPolygon(controlPolygon)) {
                            return new CoxDeBoorComplexCoordinatesEvaluator(controlPolygon, knotSequence, degree);
                        } else if (isProjectiveComplexControlPolygon(controlPolygon)) {
                            return new CoxDeBoorComplexCoordinatesEvaluator(controlPolygon, knotSequence, degree);
                        } else {
                            throw new Error(`Unsupported vector space type for Cox-de Boor algorithm`);
                        }
                    }
                    else {
                        throw new Error(`Cox-de Boor algorithm currently only supports open curves with strictly increasing knot sequences`);
                    }
                // return new CoxDeBoorEvaluator(controlPolygon);
            }
        };
        // Register Cox-de Boor algorithm for all vector space types
        AlgorithmRegistry.register({
            name: 'coxdeboor',
            vectorSpaceTypes: [
                VectorSpaceType.REAL,
                VectorSpaceType.COMPLEX,
                VectorSpaceType.PROJECTIVE,
                VectorSpaceType.PROJECTIVECOMPLEX
            ],
            description: 'Cox-de Boor algorithm - Standard B-spline evaluation',
            factory: coxFactory
        });

        // Register Boehm algorithm (example of another algorithm)
        // AlgorithmRegistry.register({
        //     name: 'boehm',
        //     vectorSpaceTypes: [
        //         VectorSpaceType.REAL,
        //         VectorSpaceType.PROJECTIVE
        //     ],
        //     description: 'Boehm algorithm - Optimized for subdivision',
        //     factory: new BoehmAlgorithmFactory()
        // });

        // Register NURBS Book algorithm (another example)
        // AlgorithmRegistry.register({
        //     name: 'nurbsbook',
        //     vectorSpaceTypes: [
        //         VectorSpaceType.REAL,
        //         VectorSpaceType.COMPLEX,
        //         VectorSpaceType.PROJECTIVE,
        //         VectorSpaceType.PROJECTIVECOMPLEX
        //     ],
        //     description: 'Piegl & Tiller NURBS Book algorithms',
        //     factory: new NURBSBookAlgorithmFactory()
        // });

        // Register specialized algorithms
        // AlgorithmRegistry.register({
        //     name: 'simd-optimized',
        //     vectorSpaceTypes: [VectorSpaceType.REAL],
        //     description: 'SIMD-optimized Cox-de Boor for real vectors',
        //     factory: new SIMDOptimizedAlgorithmFactory()
        // });

        this._initialized = true;
    }

    private static ensureInitialized(): void {
        if (!this._initialized) this.initialize();
    }

    /**
     * Get algorithm recommendations based on use case
     */
    // static getRecommendedAlgorithm(vectorSpaceType: VectorSpaceType, _useCase: string): string {
    //     return AlgorithmRegistry.getDefaultAlgorithm(vectorSpaceType);
    // }
    static getRecommendedAlgorithm(
        vectorSpaceType: VectorSpaceType,
        useCase: 'general' | 'performance' | 'precision' | 'subdivision'
    ): string {
        this.ensureInitialized();
        switch (useCase) {
            case 'performance':
                if (vectorSpaceType === VectorSpaceType.REAL) {
                    return 'simd-optimized';
                }
                return 'coxdeboor';
            
            case 'subdivision':
                return 'boehm';
            
            case 'precision':
                return 'nurbsbook';
            
            case 'general':
            default:
                return AlgorithmRegistry.getDefaultAlgorithm(vectorSpaceType);
        }
    }
}