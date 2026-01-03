"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_BSplineR1toR3 = exports.BSplineR1toR3 = void 0;
const Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
const Vector3d_1 = require("../mathVector/Vector3d");
const AbstractBSplineR1toR3_1 = require("./AbstractBSplineR1toR3");
/**
 * A B-Spline function from a one dimensional real space to a three dimensional real space
 */
class BSplineR1toR3 extends AbstractBSplineR1toR3_1.AbstractBSplineR1toR3 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [new Vector3d_1.Vector3d(0, 0, 0)], knots = [0, 1]) {
        super(controlPoints, knots);
    }
    get freeControlPoints() {
        return this.controlPoints;
    }
    // protected override factory(controlPoints: readonly Vector2d[] = [new Vector2d(0, 0)], knots: readonly number[] = [0, 1]) {
    factory(controlPoints = [new Vector3d_1.Vector3d(0, 0)], knots = [0, 1]) {
        return new BSplineR1toR3(controlPoints, knots);
    }
    /**
     * Return a deep copy of this b-spline
     */
    clone() {
        let cloneControlPoints = (0, AbstractBSplineR1toR3_1.deepCopyControlPoints)(this._controlPoints);
        return new BSplineR1toR3(cloneControlPoints, this._knots.slice());
    }
    optimizerStep(step) {
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            this._controlPoints[i].x += step[i];
            this._controlPoints[i].y += step[i + this._controlPoints.length];
        }
    }
    /**
     *
     * @param fromU Parametric position where the section start
     * @param toU Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
    extract(fromU, toU) {
        let spline = this.clone();
        spline.clamp(fromU);
        spline.clamp(toU);
        const newFromSpan = (0, Piegl_Tiller_NURBS_Book_1.clampingFindSpan)(fromU, spline._knots, spline._degree);
        const newToSpan = (0, Piegl_Tiller_NURBS_Book_1.clampingFindSpan)(toU, spline._knots, spline._degree);
        let newKnots = [];
        let newControlPoints = [];
        for (let i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline._knots[i]);
        }
        for (let i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector3d_1.Vector3d(spline._controlPoints[i].x, spline._controlPoints[i].y));
        }
        return new BSplineR1toR3(newControlPoints, newKnots);
    }
}
exports.BSplineR1toR3 = BSplineR1toR3;
function create_BSplineR1toR3(controlPoints, knots) {
    let newControlPoints = [];
    for (let cp of controlPoints) {
        newControlPoints.push(new Vector3d_1.Vector3d(cp[0], cp[1], cp[2]));
    }
    return new BSplineR1toR3(newControlPoints, knots);
}
exports.create_BSplineR1toR3 = create_BSplineR1toR3;
