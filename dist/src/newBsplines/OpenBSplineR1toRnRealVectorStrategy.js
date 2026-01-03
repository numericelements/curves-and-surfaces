"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenBSplineR1toRnRealVectorStrategy = void 0;
const RealVectorSpace_1 = require("../mathVector/RealVectorSpace");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const AbstractOPenBSplineR1toRnStrategy_1 = require("./AbstractOPenBSplineR1toRnStrategy");
const OpenBSplineR1toRn_1 = require("./OpenBSplineR1toRn");
class OpenBSplineR1toRnRealVectorStrategy extends AbstractOPenBSplineR1toRnStrategy_1.AbstractOPenBSplineR1toRnStrategy {
    constructor(curveParameters, openSBplineR1toRn) {
        super(curveParameters, openSBplineR1toRn);
        this.vectorSpace = new RealVectorSpace_1.RealVectorSpace(openSBplineR1toRn.spaceDimension);
    }
    // protected createEvaluator(algorithmName: string): BSplineEvaluator {
    //     switch (algorithmName) {
    //         case 'coxdeboor':
    //             return new CoxDeBoorEvaluator(
    //                 this.openBSplineR1toRn.controlPolygon);
    //         case 'boehm':
    //             // return new BoehmRealEvaluator(/* ... */);
    //         default:
    //             return new CoxDeBoorEvaluator(
    //                 this.openBSplineR1toRn.controlPolygon);
    //     }
    // }
    createEvaluator(algorithmName) {
        const factory = OpenBSplineR1toRn_1.AlgorithmRegistry.getFactory(algorithmName, BSplineR1toRn_1.VectorSpaceType.REAL);
        if (!factory) {
            // Fallback to default algorithm
            const defaultAlgorithm = OpenBSplineR1toRn_1.AlgorithmRegistry.getDefaultAlgorithm(BSplineR1toRn_1.VectorSpaceType.REAL);
            const defaultFactory = OpenBSplineR1toRn_1.AlgorithmRegistry.getFactory(defaultAlgorithm, BSplineR1toRn_1.VectorSpaceType.REAL);
            if (!defaultFactory) {
                throw new Error(`No algorithm factory found for ${algorithmName} or default algorithm for REAL vector space`);
            }
            return defaultFactory.createEvaluator(this.openBSplineR1toRn.controlPolygon, this.openBSplineR1toRn.knotSequence, this.openBSplineR1toRn.degree, this.vectorSpace);
        }
        return factory.createEvaluator(this.openBSplineR1toRn.controlPolygon, this.openBSplineR1toRn.knotSequence, this.openBSplineR1toRn.degree, this.vectorSpace);
    }
    euclideanDistances() {
        const distances = [];
        for (let i = 0; i < this.openBSplineR1toRn.controlPolygon.length - 1; i += 1) {
            distances.push(this.vectorSpace.normDescriptor(this.vectorSpace.subtractDescriptors(this.openBSplineR1toRn.controlPolygon.getVector(i + 1), this.openBSplineR1toRn.controlPolygon.getVector(i))));
        }
        return distances;
    }
    evaluate(u) {
        const evaluator = this.getEvaluatorView('coxdeboor');
        return evaluator.evaluate(u);
        // const result = this.vectorSpace.createVector([]);
        // return result;
    }
    derivative() {
        return this.openBSplineR1toRn;
    }
    bernsteinDecomposition() {
        return this.openBSplineR1toRn;
    }
}
exports.OpenBSplineR1toRnRealVectorStrategy = OpenBSplineR1toRnRealVectorStrategy;
