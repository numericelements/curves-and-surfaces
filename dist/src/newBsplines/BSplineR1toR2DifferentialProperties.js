"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BSplineR1toR2DifferentialProperties = void 0;
const AbstractBSplineR1toR2DifferentialProperties_1 = require("./AbstractBSplineR1toR2DifferentialProperties");
const BSplineR1toR1_1 = require("./BSplineR1toR1");
class BSplineR1toR2DifferentialProperties extends AbstractBSplineR1toR2DifferentialProperties_1.AbstractBSplineR1toR2DifferentialProperties {
    constructor(spline) {
        super(spline);
    }
    bSplineR1toR1Factory(controlPoints, knots) {
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    }
}
exports.BSplineR1toR2DifferentialProperties = BSplineR1toR2DifferentialProperties;
