"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenBSplineR1toRnComplexProjectiveVectorStrategy = void 0;
const ComplexVectorSpace_1 = require("../mathVector/ComplexVectorSpace");
const ProjectiveComplexVectorSpace_1 = require("../mathVector/ProjectiveComplexVectorSpace");
const WeightManager_1 = require("../mathVector/WeightManager");
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
const AbstractOPenBSplineR1toRnStrategy_1 = require("./AbstractOPenBSplineR1toRnStrategy");
const OpenBSplineR1toRn_1 = require("./OpenBSplineR1toRn");
class OpenBSplineR1toRnComplexProjectiveVectorStrategy extends AbstractOPenBSplineR1toRnStrategy_1.AbstractOPenBSplineR1toRnStrategy {
    constructor(curveParameters, openSBplineR1toRn) {
        super(curveParameters, openSBplineR1toRn);
        this.vectorSpace = new ProjectiveComplexVectorSpace_1.ProjectiveComplexVectorSpace(openSBplineR1toRn.spaceDimension);
    }
    createEvaluator(algorithmName) {
        switch (algorithmName) {
            case 'coxdeboor':
                return new OpenBSplineR1toRn_1.CoxDeBoorProjectiveEvaluator(this.openBSplineR1toRn.controlPolygon, this.openBSplineR1toRn.knotSequence, this.openBSplineR1toRn.degree);
            default:
                return new OpenBSplineR1toRn_1.CoxDeBoorProjectiveEvaluator(this.openBSplineR1toRn.controlPolygon, this.openBSplineR1toRn.knotSequence, this.openBSplineR1toRn.degree);
        }
    }
    evaluate(u) {
        const weightManager = new WeightManager_1.WeightManager(ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights);
        const projVector = this.vectorSpace.createVector([], weightManager);
        const complexVect = this.vectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(projVector);
        const complexVectorSpace = new ComplexVectorSpace_1.ComplexVectorSpace(this.openBSplineR1toRn.spaceDimension);
        return complexVectorSpace.fromComplexVectorSpaceToRealVectorSpace(complexVect);
    }
    euclideanDistances() {
        const distances = [];
        for (let i = 0; i < this.openBSplineR1toRn.controlPolygon.length - 1; i += 1) {
            distances.push(this.vectorSpace.norm(this.vectorSpace.subtractDescriptors(this.openBSplineR1toRn.controlPolygon.getVector(i + 1), this.openBSplineR1toRn.controlPolygon.getVector(i))));
        }
        return distances;
    }
    derivative() {
        return this.openBSplineR1toRn;
    }
    bernsteinDecomposition() {
        return this.openBSplineR1toRn;
    }
}
exports.OpenBSplineR1toRnComplexProjectiveVectorStrategy = OpenBSplineR1toRnComplexProjectiveVectorStrategy;
