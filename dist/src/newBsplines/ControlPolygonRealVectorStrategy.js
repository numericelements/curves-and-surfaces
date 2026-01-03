"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlPolygonRealVectorStrategy = void 0;
const RealVectorSpace_1 = require("../mathVector/RealVectorSpace");
class ControlPolygonRealVectorStrategy {
    constructor(controlPolygon) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new RealVectorSpace_1.RealVectorSpace(controlPolygon.spaceDimension);
    }
    moveControlPoint(index, displacement) {
        this.controlPolygon.vectorCollection[index] = this.vectorSpace.addDescriptors(this.controlPolygon.vectorCollection[index], displacement);
    }
}
exports.ControlPolygonRealVectorStrategy = ControlPolygonRealVectorStrategy;
