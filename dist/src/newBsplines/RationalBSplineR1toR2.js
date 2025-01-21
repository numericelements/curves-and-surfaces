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
exports.RationalBSplineR1toR2 = void 0;
var Vector2d_1 = require("../mathVector/Vector2d");
var Vector3d_1 = require("../mathVector/Vector3d");
var BSplineR1toR3_1 = require("./BSplineR1toR3");
var RationalBSplineR1toR2 = /** @class */ (function (_super) {
    __extends(RationalBSplineR1toR2, _super);
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function RationalBSplineR1toR2(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector3d_1.Vector3d(0, 0, 1)]; }
        if (knots === void 0) { knots = [0, 1]; }
        return _super.call(this, controlPoints, knots) || this;
    }
    // protected override factory(controlPoints: readonly Vector3d[] = [new Vector3d(0, 0)], knots: readonly number[] = [0, 1]) {
    RationalBSplineR1toR2.prototype.factory = function (controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector3d_1.Vector3d(0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        return new RationalBSplineR1toR2(controlPoints, knots);
    };
    RationalBSplineR1toR2.prototype.evaluate = function (u) {
        var result = _super.prototype.evaluate.call(this, u);
        return new Vector2d_1.Vector2d(result.x / result.z, result.y / result.z);
    };
    RationalBSplineR1toR2.prototype.controlPoints2D = function () {
        var e_1, _a;
        var result = [];
        try {
            for (var _b = __values(this.controlPoints), _c = _b.next(); !_c.done; _c = _b.next()) {
                var cp = _c.value;
                result.push(new Vector2d_1.Vector2d(cp.x, cp.y));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    return RationalBSplineR1toR2;
}(BSplineR1toR3_1.BSplineR1toR3));
exports.RationalBSplineR1toR2 = RationalBSplineR1toR2;
