"use strict";
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
exports.AbstractBSplineR1toR2DifferentialProperties = void 0;
var BSplineR1toR1_1 = require("./BSplineR1toR1");
var AbstractBSplineR1toR2DifferentialProperties = /** @class */ (function () {
    function AbstractBSplineR1toR2DifferentialProperties(spline) {
        this._spline = spline.clone();
    }
    AbstractBSplineR1toR2DifferentialProperties.prototype.expensiveComputation = function (spline) {
        var sx = this.bSplineR1toR1Factory(spline.getControlPointsX(), spline.knots);
        var sy = this.bSplineR1toR1Factory(spline.getControlPointsY(), spline.knots);
        var sxu = sx.derivative();
        var syu = sy.derivative();
        var sxuu = sxu.derivative();
        var syuu = syu.derivative();
        var sxuuu = sxuu.derivative();
        var syuuu = syuu.derivative();
        var bdsxu = sxu.bernsteinDecomposition();
        var bdsyu = syu.bernsteinDecomposition();
        var bdsxuu = sxuu.bernsteinDecomposition();
        var bdsyuu = syuu.bernsteinDecomposition();
        var bdsxuuu = sxuuu.bernsteinDecomposition();
        var bdsyuuu = syuuu.bernsteinDecomposition();
        var h1 = (bdsxu.multiply(bdsxu)).add((bdsyu.multiply(bdsyu)));
        var h2 = (bdsxu.multiply(bdsyuuu)).subtract((bdsyu.multiply(bdsxuuu)));
        var h3 = (bdsxu.multiply(bdsxuu)).add((bdsyu.multiply(bdsyuu)));
        var h4 = (bdsxu.multiply(bdsyuu)).subtract((bdsyu.multiply(bdsxuu)));
        return {
            h1: h1,
            h2: h2,
            h3: h3,
            h4: h4
        };
    };
    AbstractBSplineR1toR2DifferentialProperties.prototype.curvatureNumerator = function () {
        var e_1, _a;
        var e = this.expensiveComputation(this._spline);
        var distinctKnots = this._spline.getDistinctKnots();
        var controlPoints = e.h4.flattenControlPointsArray();
        var curvatureNumeratorDegree = 2 * this._spline.degree - 3;
        var knots = [];
        try {
            for (var distinctKnots_1 = __values(distinctKnots), distinctKnots_1_1 = distinctKnots_1.next(); !distinctKnots_1_1.done; distinctKnots_1_1 = distinctKnots_1.next()) {
                var knot = distinctKnots_1_1.value;
                for (var j = 0; j < curvatureNumeratorDegree + 1; j += 1) {
                    knots.push(knot);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (distinctKnots_1_1 && !distinctKnots_1_1.done && (_a = distinctKnots_1.return)) _a.call(distinctKnots_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    };
    AbstractBSplineR1toR2DifferentialProperties.prototype.curvatureDenominator = function () {
        var curve = this.h1();
        var controlPoints1 = curve.controlPoints;
        var knots = curve.knots;
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints1, knots);
    };
    AbstractBSplineR1toR2DifferentialProperties.prototype.h1 = function () {
        var e_2, _a;
        var e = this.expensiveComputation(this._spline);
        var distinctKnots = this._spline.getDistinctKnots();
        var controlPoints = e.h1.flattenControlPointsArray();
        var h1Degree = 2 * this._spline.degree - 2;
        var knots = [];
        try {
            for (var distinctKnots_2 = __values(distinctKnots), distinctKnots_2_1 = distinctKnots_2.next(); !distinctKnots_2_1.done; distinctKnots_2_1 = distinctKnots_2.next()) {
                var knot = distinctKnots_2_1.value;
                for (var j = 0; j < h1Degree + 1; j += 1) {
                    knots.push(knot);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (distinctKnots_2_1 && !distinctKnots_2_1.done && (_a = distinctKnots_2.return)) _a.call(distinctKnots_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    };
    AbstractBSplineR1toR2DifferentialProperties.prototype.inflections = function (curvatureNumerator) {
        var e_3, _a;
        if (!curvatureNumerator) {
            curvatureNumerator = this.curvatureNumerator();
        }
        var zeros = curvatureNumerator.zeros();
        var result = [];
        try {
            for (var zeros_1 = __values(zeros), zeros_1_1 = zeros_1.next(); !zeros_1_1.done; zeros_1_1 = zeros_1.next()) {
                var z = zeros_1_1.value;
                result.push(this._spline.evaluate(z));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (zeros_1_1 && !zeros_1_1.done && (_a = zeros_1.return)) _a.call(zeros_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return result;
    };
    AbstractBSplineR1toR2DifferentialProperties.prototype.curvatureDerivativeNumerator = function () {
        var e_4, _a;
        var e = this.expensiveComputation(this._spline);
        var bd_curvatureDerivativeNumerator = (e.h1.multiply(e.h2)).subtract(e.h3.multiply(e.h4).multiplyByScalar(3));
        var distinctKnots = this._spline.getDistinctKnots();
        var controlPoints = bd_curvatureDerivativeNumerator.flattenControlPointsArray();
        var curvatureDerivativeNumeratorDegree = 4 * this._spline.degree - 6;
        var knots = [];
        try {
            for (var distinctKnots_3 = __values(distinctKnots), distinctKnots_3_1 = distinctKnots_3.next(); !distinctKnots_3_1.done; distinctKnots_3_1 = distinctKnots_3.next()) {
                var knot = distinctKnots_3_1.value;
                for (var j = 0; j < curvatureDerivativeNumeratorDegree + 1; j += 1) {
                    knots.push(knot);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (distinctKnots_3_1 && !distinctKnots_3_1.done && (_a = distinctKnots_3.return)) _a.call(distinctKnots_3);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    };
    AbstractBSplineR1toR2DifferentialProperties.prototype.curvatureExtrema = function (_curvatureDerivativeNumerator) {
        var e_5, _a;
        if (!_curvatureDerivativeNumerator) {
            _curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
        }
        var zeros = _curvatureDerivativeNumerator.zeros();
        var result = [];
        try {
            for (var zeros_2 = __values(zeros), zeros_2_1 = zeros_2.next(); !zeros_2_1.done; zeros_2_1 = zeros_2.next()) {
                var z = zeros_2_1.value;
                result.push(this._spline.evaluate(z));
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (zeros_2_1 && !zeros_2_1.done && (_a = zeros_2.return)) _a.call(zeros_2);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return result;
    };
    AbstractBSplineR1toR2DifferentialProperties.prototype.transitionCurvatureExtrema = function (_curvatureDerivativeNumerator) {
        var e_6, _a;
        if (!_curvatureDerivativeNumerator) {
            _curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
        }
        var zeros = _curvatureDerivativeNumerator.zerosPolygonVsFunctionDiffViewer();
        var result = [];
        try {
            for (var zeros_3 = __values(zeros), zeros_3_1 = zeros_3.next(); !zeros_3_1.done; zeros_3_1 = zeros_3.next()) {
                var z = zeros_3_1.value;
                result.push(this._spline.evaluate(z));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (zeros_3_1 && !zeros_3_1.done && (_a = zeros_3.return)) _a.call(zeros_3);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return result;
    };
    return AbstractBSplineR1toR2DifferentialProperties;
}());
exports.AbstractBSplineR1toR2DifferentialProperties = AbstractBSplineR1toR2DifferentialProperties;
