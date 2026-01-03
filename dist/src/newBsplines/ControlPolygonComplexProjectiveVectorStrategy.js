"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlPolygonComplexProjectiveVectorStrategy = void 0;
const ProjectiveComplexVectorSpace_1 = require("../mathVector/ProjectiveComplexVectorSpace");
class ControlPolygonComplexProjectiveVectorStrategy {
    constructor(controlPolygon) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new ProjectiveComplexVectorSpace_1.ProjectiveComplexVectorSpace(controlPolygon.spaceDimension);
    }
    moveControlPoint(index, displacement) {
        this.controlPolygon.vectorCollection[index] = this.vectorSpace.addDescriptors(this.controlPolygon.vectorCollection[index], displacement);
    }
}
exports.ControlPolygonComplexProjectiveVectorStrategy = ControlPolygonComplexProjectiveVectorStrategy;
