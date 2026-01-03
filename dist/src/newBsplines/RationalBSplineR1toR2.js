"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RationalBSplineR1toR2 = void 0;
const Vector2d_1 = require("../mathVector/Vector2d");
const Vector3d_1 = require("../mathVector/Vector3d");
const BSplineR1toR3_1 = require("./BSplineR1toR3");
class RationalBSplineR1toR2 extends BSplineR1toR3_1.BSplineR1toR3 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [new Vector3d_1.Vector3d(0, 0, 1)], knots = [0, 1]) {
        super(controlPoints, knots);
    }
    // protected override factory(controlPoints: readonly Vector3d[] = [new Vector3d(0, 0)], knots: readonly number[] = [0, 1]) {
    factory(controlPoints = [new Vector3d_1.Vector3d(0, 0)], knots = [0, 1]) {
        return new RationalBSplineR1toR2(controlPoints, knots);
    }
    evaluate(u) {
        let result = super.evaluate(u);
        return new Vector2d_1.Vector2d(result.x / result.z, result.y / result.z);
    }
    controlPoints2D() {
        let result = [];
        for (let cp of this.controlPoints) {
            result.push(new Vector2d_1.Vector2d(cp.x, cp.y));
        }
        return result;
    }
}
exports.RationalBSplineR1toR2 = RationalBSplineR1toR2;
