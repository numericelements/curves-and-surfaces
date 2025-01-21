"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_BSplineR1toR3 = exports.BSplineR1toR3 = void 0;
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
var Vector3d_1 = require("../mathVector/Vector3d");
var AbstractBSplineR1toR3_1 = require("./AbstractBSplineR1toR3");
/**
 * A B-Spline function from a one dimensional real space to a three dimensional real space
 */
var BSplineR1toR3 = /** @class */ (function (_super) {
    __extends(BSplineR1toR3, _super);
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function BSplineR1toR3(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector3d_1.Vector3d(0, 0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        return _super.call(this, controlPoints, knots) || this;
    }
    Object.defineProperty(BSplineR1toR3.prototype, "freeControlPoints", {
        get: function () {
            return this.controlPoints;
        },
        enumerable: false,
        configurable: true
    });
    // protected override factory(controlPoints: readonly Vector2d[] = [new Vector2d(0, 0)], knots: readonly number[] = [0, 1]) {
    BSplineR1toR3.prototype.factory = function (controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector3d_1.Vector3d(0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        return new BSplineR1toR3(controlPoints, knots);
    };
    /**
     * Return a deep copy of this b-spline
     */
    BSplineR1toR3.prototype.clone = function () {
        var cloneControlPoints = AbstractBSplineR1toR3_1.deepCopyControlPoints(this._controlPoints);
        return new BSplineR1toR3(cloneControlPoints, this._knots.slice());
    };
    BSplineR1toR3.prototype.optimizerStep = function (step) {
        for (var i = 0; i < this._controlPoints.length; i += 1) {
            this._controlPoints[i].x += step[i];
            this._controlPoints[i].y += step[i + this._controlPoints.length];
        }
    };
    /**
     *
     * @param fromU Parametric position where the section start
     * @param toU Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
    BSplineR1toR3.prototype.extract = function (fromU, toU) {
        var spline = this.clone();
        spline.clamp(fromU);
        spline.clamp(toU);
        var newFromSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(fromU, spline._knots, spline._degree);
        var newToSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(toU, spline._knots, spline._degree);
        var newKnots = [];
        var newControlPoints = [];
        for (var i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline._knots[i]);
        }
        for (var i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector3d_1.Vector3d(spline._controlPoints[i].x, spline._controlPoints[i].y));
        }
        return new BSplineR1toR3(newControlPoints, newKnots);
    };
    return BSplineR1toR3;
}(AbstractBSplineR1toR3_1.AbstractBSplineR1toR3));
exports.BSplineR1toR3 = BSplineR1toR3;
function create_BSplineR1toR3(controlPoints, knots) {
    var e_1, _a;
    var newControlPoints = [];
    try {
        for (var controlPoints_1 = __values(controlPoints), controlPoints_1_1 = controlPoints_1.next(); !controlPoints_1_1.done; controlPoints_1_1 = controlPoints_1.next()) {
            var cp = controlPoints_1_1.value;
            newControlPoints.push(new Vector3d_1.Vector3d(cp[0], cp[1], cp[2]));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (controlPoints_1_1 && !controlPoints_1_1.done && (_a = controlPoints_1.return)) _a.call(controlPoints_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return new BSplineR1toR3(newControlPoints, knots);
}
exports.create_BSplineR1toR3 = create_BSplineR1toR3;
