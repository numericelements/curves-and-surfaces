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
exports.splineRecomposition = exports.BernsteinDecompositionR1toR1 = void 0;
var BinomialCoefficient_1 = require("./BinomialCoefficient");
var BSplineR1toR1_1 = require("./BSplineR1toR1");
/**
* A Bernstein decomposition of a B-Spline function from a one dimensional real space to a one dimensional real space
*/
var BernsteinDecompositionR1toR1 = /** @class */ (function () {
    /**
     *
     * @param controlPointsArray An array of array of control points
     */
    function BernsteinDecompositionR1toR1(controlPointsArray) {
        if (controlPointsArray === void 0) { controlPointsArray = []; }
        this.controlPointsArray = controlPointsArray;
    }
    BernsteinDecompositionR1toR1.prototype.add = function (bd) {
        var result = [];
        for (var i = 0; i < bd.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (var j = 0; j < bd.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] + bd.controlPointsArray[i][j];
            }
        }
        return new BernsteinDecompositionR1toR1(result);
    };
    BernsteinDecompositionR1toR1.prototype.subtract = function (bd) {
        var result = [];
        for (var i = 0; i < bd.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (var j = 0; j < bd.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] - bd.controlPointsArray[i][j];
            }
        }
        return new BernsteinDecompositionR1toR1(result);
    };
    BernsteinDecompositionR1toR1.prototype.multiply = function (bd) {
        return new BernsteinDecompositionR1toR1(this.bernsteinMultiplicationArray(this.controlPointsArray, bd.controlPointsArray));
    };
    /**
     *
     * @param bd: BernsteinDecomposition_R1_to_R1
     * @param index: Index of the basis function
     */
    BernsteinDecompositionR1toR1.prototype.multiplyRange = function (bd, start, lessThan) {
        var result = [];
        for (var i = start; i < lessThan; i += 1) {
            result[i - start] = this.bernsteinMultiplication(this.controlPointsArray[i], bd.controlPointsArray[i]);
        }
        return new BernsteinDecompositionR1toR1(result);
    };
    BernsteinDecompositionR1toR1.prototype.bernsteinMultiplicationArray = function (f, g) {
        var result = [];
        for (var i = 0; i < f.length; i += 1) {
            result[i] = this.bernsteinMultiplication(f[i], g[i]);
        }
        return result;
    };
    BernsteinDecompositionR1toR1.prototype.bernsteinMultiplication = function (f, g) {
        var f_degree = f.length - 1;
        var g_degree = g.length - 1;
        var result = [];
        for (var k = 0; k < f_degree + g_degree + 1; k += 1) {
            var cp = 0;
            for (var i = Math.max(0, k - g_degree); i < Math.min(f_degree, k) + 1; i += 1) {
                var bfu = BernsteinDecompositionR1toR1.binomial(f_degree, i);
                var bgu = BernsteinDecompositionR1toR1.binomial(g_degree, k - i);
                var bfugu = BernsteinDecompositionR1toR1.binomial(f_degree + g_degree, k);
                cp += bfu * bgu / bfugu * f[i] * g[k - i];
            }
            result[k] = cp;
        }
        return result;
    };
    BernsteinDecompositionR1toR1.prototype.multiplyByScalar = function (value) {
        var result = [];
        for (var i = 0; i < this.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (var j = 0; j < this.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] * value;
            }
        }
        return new BernsteinDecompositionR1toR1(result);
    };
    BernsteinDecompositionR1toR1.prototype.flattenControlPointsArray = function () {
        return this.controlPointsArray.reduce(function (acc, val) {
            return acc.concat(val);
        }, []);
    };
    BernsteinDecompositionR1toR1.prototype.subset = function (start, lessThan) {
        return new BernsteinDecompositionR1toR1(this.controlPointsArray.slice(start, lessThan));
    };
    BernsteinDecompositionR1toR1.prototype.elevateDegree = function (times) {
        var e_1, _a;
        if (times === void 0) { times = 1; }
        var newControlPointsArray = [];
        try {
            for (var _b = __values(this.controlPointsArray), _c = _b.next(); !_c.done; _c = _b.next()) {
                var controlPoint = _c.value;
                newControlPointsArray.push(this.elevateDegreeB(controlPoint, times));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.controlPointsArray = newControlPointsArray;
    };
    BernsteinDecompositionR1toR1.prototype.elevateDegreeB = function (controlPoints, times) {
        if (times === void 0) { times = 1; }
        var degree = controlPoints.length - 1;
        var result = [];
        for (var i = 0; i < controlPoints.length + times; i += 1) {
            var cp = 0;
            for (var j = Math.max(0, i - times); j <= Math.min(degree, i); j += 1) {
                var bc0 = BinomialCoefficient_1.binomialCoefficient(times, i - j);
                var bc1 = BinomialCoefficient_1.binomialCoefficient(degree, j);
                var bc2 = BinomialCoefficient_1.binomialCoefficient(degree + times, i);
                cp += bc0 * bc1 / bc2 * controlPoints[j];
            }
            result.push(cp);
        }
        return result;
    };
    BernsteinDecompositionR1toR1.prototype.splineRecomposition = function (distinctKnots) {
        var e_2, _a;
        var cp = this.flattenControlPointsArray();
        var degree = this.getDegree();
        var knots = [];
        try {
            for (var distinctKnots_1 = __values(distinctKnots), distinctKnots_1_1 = distinctKnots_1.next(); !distinctKnots_1_1.done; distinctKnots_1_1 = distinctKnots_1.next()) {
                var knot = distinctKnots_1_1.value;
                for (var j = 0; j < degree + 1; j += 1) {
                    knots.push(knot);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (distinctKnots_1_1 && !distinctKnots_1_1.done && (_a = distinctKnots_1.return)) _a.call(distinctKnots_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return new BSplineR1toR1_1.BSplineR1toR1(cp, knots);
    };
    BernsteinDecompositionR1toR1.prototype.getDegree = function () {
        return this.controlPointsArray[0].length - 1;
    };
    BernsteinDecompositionR1toR1.prototype.clone = function () {
        var decompositionCopy = new BernsteinDecompositionR1toR1(this.controlPointsArray.slice());
        return decompositionCopy;
    };
    BernsteinDecompositionR1toR1.binomial = BinomialCoefficient_1.memoizedBinomialCoefficient();
    BernsteinDecompositionR1toR1.flopsCounter = 0;
    return BernsteinDecompositionR1toR1;
}());
exports.BernsteinDecompositionR1toR1 = BernsteinDecompositionR1toR1;
function splineRecomposition(bernsteinDecomposiiton, distinctKnots) {
    var e_3, _a;
    var cp = bernsteinDecomposiiton.flattenControlPointsArray();
    var degree = bernsteinDecomposiiton.getDegree();
    var knots = [];
    try {
        for (var distinctKnots_2 = __values(distinctKnots), distinctKnots_2_1 = distinctKnots_2.next(); !distinctKnots_2_1.done; distinctKnots_2_1 = distinctKnots_2.next()) {
            var knot = distinctKnots_2_1.value;
            for (var j = 0; j < degree + 1; j += 1) {
                knots.push(knot);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (distinctKnots_2_1 && !distinctKnots_2_1.done && (_a = distinctKnots_2.return)) _a.call(distinctKnots_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return new BSplineR1toR1_1.BSplineR1toR1(cp, knots);
}
exports.splineRecomposition = splineRecomposition;
