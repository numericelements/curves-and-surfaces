"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorithmBootstrap = void 0;
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
// import { BoehmAlgorithmFactory } from "./algorithms/BoehmAlgorithmFactory";
// import { NURBSBookAlgorithmFactory } from "./algorithms/NURBSBookAlgorithmFactory";
const CoxDeBoorAlgorithmFactory_1 = require("./CoxDeBoorAlgorithmFactory");
const OpenBSplineR1toRn_1 = require("./OpenBSplineR1toRn");
/**
 * Bootstrap class to register all available algorithms
 * This should be called once during application initialization
 */
class AlgorithmBootstrap {
    static initialize() {
        if (this.isInitialized) {
            return;
        }
        // Register Cox-de Boor algorithm for all vector space types
        OpenBSplineR1toRn_1.AlgorithmRegistry.register({
            name: 'coxdeboor',
            vectorSpaceTypes: [
                BSplineR1toRn_1.VectorSpaceType.REAL,
                BSplineR1toRn_1.VectorSpaceType.COMPLEX,
                BSplineR1toRn_1.VectorSpaceType.PROJECTIVE,
                BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX
            ],
            description: 'Cox-de Boor algorithm - Standard B-spline evaluation',
            factory: new CoxDeBoorAlgorithmFactory_1.CoxDeBoorAlgorithmFactory()
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
    static getRecommendedAlgorithm(vectorSpaceType, useCase) {
        switch (useCase) {
            case 'performance':
                if (vectorSpaceType === BSplineR1toRn_1.VectorSpaceType.REAL) {
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
exports.AlgorithmBootstrap = AlgorithmBootstrap;
AlgorithmBootstrap.isInitialized = false;
