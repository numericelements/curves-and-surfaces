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
exports.PeriodicBSplineR1toR2DifferentialProperties = void 0;
var AbstractBSplineR1toR2DifferentialProperties_1 = require("./AbstractBSplineR1toR2DifferentialProperties");
var PeriodicBSplineR1toR1_1 = require("./PeriodicBSplineR1toR1");
var PeriodicBSplineR1toR2DifferentialProperties = /** @class */ (function (_super) {
    __extends(PeriodicBSplineR1toR2DifferentialProperties, _super);
    function PeriodicBSplineR1toR2DifferentialProperties(spline) {
        return _super.call(this, spline) || this;
    }
    PeriodicBSplineR1toR2DifferentialProperties.prototype.bSplineR1toR1Factory = function (controlPoints, knots) {
        return new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(controlPoints, knots);
    };
    PeriodicBSplineR1toR2DifferentialProperties.prototype.curvatureExtrema = function (curvatureDerivativeNumerator) {
        var e_1, _a;
        if (!curvatureDerivativeNumerator) {
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
        }
        var zeros = curvatureDerivativeNumerator.zeros(10e-3);
        var result = [];
        try {
            for (var zeros_1 = __values(zeros), zeros_1_1 = zeros_1.next(); !zeros_1_1.done; zeros_1_1 = zeros_1.next()) {
                var z = zeros_1_1.value;
                result.push(this._spline.evaluate(z));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (zeros_1_1 && !zeros_1_1.done && (_a = zeros_1.return)) _a.call(zeros_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var a = curvatureDerivativeNumerator.controlPoints[0];
        var b = curvatureDerivativeNumerator.controlPoints[curvatureDerivativeNumerator.controlPoints.length - 1];
        if (a * b < 0) { // a and b have different sign
            var u = curvatureDerivativeNumerator.knots[curvatureDerivativeNumerator.knots.length - 1];
            result.push(this._spline.evaluate(u));
        }
        return result;
    };
    return PeriodicBSplineR1toR2DifferentialProperties;
}(AbstractBSplineR1toR2DifferentialProperties_1.AbstractBSplineR1toR2DifferentialProperties));
exports.PeriodicBSplineR1toR2DifferentialProperties = PeriodicBSplineR1toR2DifferentialProperties;
