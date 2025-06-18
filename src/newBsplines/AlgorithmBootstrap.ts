import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
// import { BoehmAlgorithmFactory } from "./algorithms/BoehmAlgorithmFactory";
// import { NURBSBookAlgorithmFactory } from "./algorithms/NURBSBookAlgorithmFactory";
import { CoxDeBoorAlgorithmFactory } from "./CoxDeBoorAlgorithmFactory";
import { AlgorithmRegistry } from "./OpenBSplineR1toRn";

/**
 * Bootstrap class to register all available algorithms
 * This should be called once during application initialization
 */
export class AlgorithmBootstrap {
    private static isInitialized = false;

    static initialize(): void {
        if (this.isInitialized) {
            return;
        }

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
            factory: new CoxDeBoorAlgorithmFactory()
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

        this.isInitialized = true;
    }

    /**
     * Get algorithm recommendations based on use case
     */
    static getRecommendedAlgorithm(
        vectorSpaceType: VectorSpaceType,
        useCase: 'general' | 'performance' | 'precision' | 'subdivision'
    ): string {
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
                return 'coxdeboor';
        }
    }
}