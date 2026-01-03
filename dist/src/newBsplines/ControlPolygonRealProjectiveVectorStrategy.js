"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlPolygonRealProjectiveVectorStrategy = void 0;
const ProjectiveVectorSpace_1 = require("../mathVector/ProjectiveVectorSpace");
class ControlPolygonRealProjectiveVectorStrategy {
    constructor(controlPolygon) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new ProjectiveVectorSpace_1.ProjectiveVectorSpace(controlPolygon.spaceDimension);
    }
    moveControlPoint(index, displacement) {
        this.controlPolygon.vectorCollection[index] = this.vectorSpace.addDescriptors(this.controlPolygon.vectorCollection[index], displacement);
    }
}
exports.ControlPolygonRealProjectiveVectorStrategy = ControlPolygonRealProjectiveVectorStrategy;
