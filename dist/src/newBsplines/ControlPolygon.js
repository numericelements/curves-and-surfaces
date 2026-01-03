"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createControlPolygon = exports.ControlPolygon = void 0;
const VectorCollection1D_1 = require("../mathVector/VectorCollection1D");
const VectorSpaceUtilities_1 = require("../mathVector/VectorSpaceUtilities");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const ControlPolygonComplexProjectiveVectorStrategy_1 = require("./ControlPolygonComplexProjectiveVectorStrategy");
const ControlPolygonComplexVectorStrategy_1 = require("./ControlPolygonComplexVectorStrategy");
const ControlPolygonRealProjectiveVectorStrategy_1 = require("./ControlPolygonRealProjectiveVectorStrategy");
const ControlPolygonRealVectorStrategy_1 = require("./ControlPolygonRealVectorStrategy");
class ControlPolygon extends VectorCollection1D_1.VectorCollection1D {
    constructor(controlPoints) {
        super(controlPoints);
        const { type: vectorSpace, dimension: spaceDimension } = (0, VectorSpaceUtilities_1.getVectorSpaceTypeAndDimension)(this._vectorCollection[0]);
        this._vectorSpaceType = vectorSpace;
        this._spaceDimension = spaceDimension;
        switch (this._vectorSpaceType) {
            case BSplineR1toRn_1.VectorSpaceType.REAL:
                this.strategy = new ControlPolygonRealVectorStrategy_1.ControlPolygonRealVectorStrategy(this);
                break;
            case BSplineR1toRn_1.VectorSpaceType.COMPLEX:
                this.strategy = new ControlPolygonComplexVectorStrategy_1.ControlPolygonComplexVectorStrategy(this);
                break;
            case BSplineR1toRn_1.VectorSpaceType.PROJECTIVE:
                this.strategy = new ControlPolygonRealProjectiveVectorStrategy_1.ControlPolygonRealProjectiveVectorStrategy(this);
                break;
            case BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX:
                this.strategy = new ControlPolygonComplexProjectiveVectorStrategy_1.ControlPolygonComplexProjectiveVectorStrategy(this);
                break;
            default:
                throw new Error("Invalid vector space for OpenBSplineR1toRn constructor");
        }
    }
    get spaceDimension() {
        return this._spaceDimension;
    }
    moveControlPoint(index, displacement) {
        const firstVector = this._vectorCollection[0];
        if (!(0, VectorSpaceUtilities_1.areSameVSpaceAndDimension)(displacement, firstVector)) {
            throw new Error(`Displacement type mismatch. Expected ${firstVector.constructor.name}, got ${displacement.constructor.name}`);
        }
        this.strategy.moveControlPoint(index, displacement);
    }
    isSameVectorType(v1, v2) {
        return v1.constructor === v2.constructor;
    }
}
exports.ControlPolygon = ControlPolygon;
function createControlPolygon(controlpPoints) {
    return new ControlPolygon(controlpPoints);
}
exports.createControlPolygon = createControlPolygon;
