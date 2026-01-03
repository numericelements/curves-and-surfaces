"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenBSplineR1toRnRealProjectiveVectorStrategy = void 0;
const ProjectiveVectorSpace_1 = require("../mathVector/ProjectiveVectorSpace");
const AbstractOPenBSplineR1toRnStrategy_1 = require("./AbstractOPenBSplineR1toRnStrategy");
const OpenBSplineR1toRn_1 = require("./OpenBSplineR1toRn");
class OpenBSplineR1toRnRealProjectiveVectorStrategy extends AbstractOPenBSplineR1toRnStrategy_1.AbstractOPenBSplineR1toRnStrategy {
    constructor(curveParameters, openSBplineR1toRn) {
        super(curveParameters, openSBplineR1toRn);
        this.vectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(openSBplineR1toRn.spaceDimension);
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
        const evaluator = this.getEvaluatorView('coxdeboor');
        // const projVector = this.vectorSpace.createVector([]);
        return evaluator.evaluate(u);
    }
    derivative() {
        return this.openBSplineR1toRn;
    }
    bernsteinDecomposition() {
        return this.openBSplineR1toRn;
    }
}
exports.OpenBSplineR1toRnRealProjectiveVectorStrategy = OpenBSplineR1toRnRealProjectiveVectorStrategy;
