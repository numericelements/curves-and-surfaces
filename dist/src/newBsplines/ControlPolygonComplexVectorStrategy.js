"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlPolygonComplexVectorStrategy = void 0;
const ComplexVectorSpace_1 = require("../mathVector/ComplexVectorSpace");
class ControlPolygonComplexVectorStrategy {
    constructor(controlPolygon) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new ComplexVectorSpace_1.ComplexVectorSpace(controlPolygon.spaceDimension);
    }
    moveControlPoint(index, displacement) {
        this.controlPolygon.vectorCollection[index] = this.vectorSpace.addDescriptors(this.controlPolygon.vectorCollection[index], displacement);
    }
}
exports.ControlPolygonComplexVectorStrategy = ControlPolygonComplexVectorStrategy;
