"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenBSplineR1toRnComplexVectorStrategy = void 0;
const ComplexVectorSpace_1 = require("../mathVector/ComplexVectorSpace");
const AbstractOPenBSplineR1toRnStrategy_1 = require("./AbstractOPenBSplineR1toRnStrategy");
const OpenBSplineR1toRn_1 = require("./OpenBSplineR1toRn");
class OpenBSplineR1toRnComplexVectorStrategy extends AbstractOPenBSplineR1toRnStrategy_1.AbstractOPenBSplineR1toRnStrategy {
    constructor(curveParameters, openSBplineR1toRn) {
        super(curveParameters, openSBplineR1toRn);
        this.vectorSpace = new ComplexVectorSpace_1.ComplexVectorSpace(openSBplineR1toRn.spaceDimension);
    }
    createEvaluator(algorithmName) {
        switch (algorithmName) {
            case 'coxdeboor':
                return new OpenBSplineR1toRn_1.CoxDeBoorProjectiveEvaluator(this.openBSplineR1toRn.controlPolygon, this.openBSplineR1toRn.knotSequence, this.openBSplineR1toRn.degree);
            default:
                return new OpenBSplineR1toRn_1.CoxDeBoorProjectiveEvaluator(this.openBSplineR1toRn.controlPolygon, this.openBSplineR1toRn.knotSequence, this.openBSplineR1toRn.degree);
        }
    }
    euclideanDistances() {
        const distances = [];
        for (let i = 0; i < this.openBSplineR1toRn.controlPolygon.length - 1; i += 1) {
            distances.push(this.vectorSpace.normDescriptor(this.vectorSpace.subtractDescriptors(this.openBSplineR1toRn.controlPolygon.getVector(i + 1), this.openBSplineR1toRn.controlPolygon.getVector(i))));
        }
        return distances;
    }
    evaluate(u) {
        const complexVector = this.vectorSpace.createVector([]);
        return this.vectorSpace.fromComplexVectorSpaceToRealVectorSpace(complexVector);
    }
    derivative() {
        return this.openBSplineR1toRn;
    }
    bernsteinDecomposition() {
        return this.openBSplineR1toRn;
    }
}
exports.OpenBSplineR1toRnComplexVectorStrategy = OpenBSplineR1toRnComplexVectorStrategy;
