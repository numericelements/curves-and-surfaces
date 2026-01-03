"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodicBSplineR1toR2DifferentialProperties = void 0;
const AbstractBSplineR1toR2DifferentialProperties_1 = require("./AbstractBSplineR1toR2DifferentialProperties");
const PeriodicBSplineR1toR1_1 = require("./PeriodicBSplineR1toR1");
class PeriodicBSplineR1toR2DifferentialProperties extends AbstractBSplineR1toR2DifferentialProperties_1.AbstractBSplineR1toR2DifferentialProperties {
    constructor(spline) {
        super(spline);
    }
    bSplineR1toR1Factory(controlPoints, knots) {
        return new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(controlPoints, knots);
    }
    curvatureExtrema(curvatureDerivativeNumerator) {
        if (!curvatureDerivativeNumerator) {
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
        }
        const zeros = curvatureDerivativeNumerator.zeros(10e-3);
        let result = [];
        for (let z of zeros) {
            result.push(this._spline.evaluate(z));
        }
        const a = curvatureDerivativeNumerator.controlPoints[0];
        const b = curvatureDerivativeNumerator.controlPoints[curvatureDerivativeNumerator.controlPoints.length - 1];
        if (a * b < 0) { // a and b have different sign
            const u = curvatureDerivativeNumerator.knots[curvatureDerivativeNumerator.knots.length - 1];
            result.push(this._spline.evaluate(u));
        }
        return result;
    }
}
exports.PeriodicBSplineR1toR2DifferentialProperties = PeriodicBSplineR1toR2DifferentialProperties;
