"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractBSplineR1toRn = void 0;
const VectorSpaceUtilities_1 = require("../mathVector/VectorSpaceUtilities");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const BSplineR1toRnConstructorInterface_1 = require("./BSplineR1toRnConstructorInterface");
const ControlPolygon_1 = require("./ControlPolygon");
class AbstractBSplineR1toRn {
    // protected _isDirty: boolean;
    constructor(curveParameters) {
        // this._isDirty = true;
        if (curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_NO_KNOT || curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_UNIFORM ||
            curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_UNIFORM_EUCLIDEAN || curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_NONUNIFORM) {
            let vector;
            if (curveParameters.controlPoints instanceof ControlPolygon_1.ControlPolygon) {
                vector = curveParameters.controlPoints.pop();
            }
            else {
                vector = curveParameters.controlPoints[0];
            }
            try {
                const vSpaceDim = (0, VectorSpaceUtilities_1.getVectorSpaceTypeAndDimension)(vector);
                this._vectorSpace = vSpaceDim.type;
                this._spaceDimension = vSpaceDim.dimension;
            }
            catch (error) {
                throw new Error("Control points are not valid");
            }
        }
        else if (curveParameters.type === BSplineR1toRnConstructorInterface_1.BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY) {
            let controlPoint;
            // for(const vector of curveParameters.controlPoints) {
            //     this._controlPolygon.push(vector);
            // }
            this._vectorSpace = BSplineR1toRn_1.VectorSpaceType.REAL;
            this._spaceDimension = 1;
        }
        else {
            throw new Error("Control polygon is required");
        }
    }
    get vectorSpace() {
        return this._vectorSpace;
    }
    get spaceDimension() {
        return this._spaceDimension;
    }
    get curveOrigin() {
        return this._curveOrigin;
    }
    get degree() {
        return this._degree;
    }
    set degree(degree) {
        this._degree = degree;
    }
}
exports.AbstractBSplineR1toRn = AbstractBSplineR1toRn;
