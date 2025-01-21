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
exports.deepCopyControlPoints = exports.RationalBSplineR1toR2Adapter = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var Vector2d_1 = require("../mathVector/Vector2d");
var Vector3d_1 = require("../mathVector/Vector3d");
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
var RationalBSplineR1toR2_1 = require("./RationalBSplineR1toR2");
var RationalBSplineR1toR2Adapter = /** @class */ (function () {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function RationalBSplineR1toR2Adapter(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector3d_1.Vector3d(0, 0, 1)]; }
        if (knots === void 0) { knots = [0, 1]; }
        this._controlPoints = deepCopyControlPoints(controlPoints);
        this.rationalBSplineR1toR2 = new RationalBSplineR1toR2_1.RationalBSplineR1toR2(this._controlPoints, knots);
    }
    // protected override factory(controlPoints: readonly Vector3d[] = [new Vector3d(0, 0)], knots: readonly number[] = [0, 1]) {
    RationalBSplineR1toR2Adapter.prototype.factory = function (controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector3d_1.Vector3d(0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        return new RationalBSplineR1toR2Adapter(controlPoints, knots);
    };
    RationalBSplineR1toR2Adapter.prototype.getControlPointsX = function () {
        var e_1, _a;
        var result = [];
        try {
            for (var _b = __values(this.rationalBSplineR1toR2.controlPoints), _c = _b.next(); !_c.done; _c = _b.next()) {
                var cp = _c.value;
                result.push(cp.x);
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
    RationalBSplineR1toR2Adapter.prototype.getControlPointsY = function () {
        var e_2, _a;
        var result = [];
        try {
            for (var _b = __values(this.rationalBSplineR1toR2.controlPoints), _c = _b.next(); !_c.done; _c = _b.next()) {
                var cp = _c.value;
                result.push(cp.y);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return result;
    };
    RationalBSplineR1toR2Adapter.prototype.getDistinctKnots = function () {
        var result = [this.rationalBSplineR1toR2.knots[0]];
        var temp = result[0];
        for (var i = 1; i < this.rationalBSplineR1toR2.knots.length; i += 1) {
            if (this.rationalBSplineR1toR2.knots[i] !== temp) {
                result.push(this.rationalBSplineR1toR2.knots[i]);
                temp = this.rationalBSplineR1toR2.knots[i];
            }
        }
        return result;
    };
    RationalBSplineR1toR2Adapter.prototype.grevilleAbscissae = function () {
        var result = [];
        for (var i = 0; i < this.rationalBSplineR1toR2.controlPoints.length; i += 1) {
            var sum = 0;
            for (var j = i + 1; j < i + this.rationalBSplineR1toR2.degree + 1; j += 1) {
                sum += this.rationalBSplineR1toR2.knots[j];
            }
            result.push(sum / this.rationalBSplineR1toR2.degree);
        }
        return result;
    };
    RationalBSplineR1toR2Adapter.prototype.knotMultiplicity = function (indexFromFindSpan) {
        var result = 0;
        var i = 0;
        while (this.rationalBSplineR1toR2.knots[indexFromFindSpan + i] === this.rationalBSplineR1toR2.knots[indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    };
    RationalBSplineR1toR2Adapter.prototype.insertKnot = function (u, times) {
        if (times === void 0) { times = 1; }
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0) {
            return;
        }
        var index = Piegl_Tiller_NURBS_Book_1.findSpan(u, this.rationalBSplineR1toR2.knots, this.rationalBSplineR1toR2.degree);
        var multiplicity = 0;
        if (u === this.rationalBSplineR1toR2.knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }
        for (var t = 0; t < times; t += 1) {
            var newControlPoints = [];
            for (var i = 0; i < index - this.rationalBSplineR1toR2.degree + 1; i += 1) {
                newControlPoints[i] = this.rationalBSplineR1toR2.controlPoints[i];
            }
            for (var i = index - this.rationalBSplineR1toR2.degree + 1; i <= index - multiplicity; i += 1) {
                var alpha = (u - this.rationalBSplineR1toR2.knots[i]) / (this.rationalBSplineR1toR2.knots[i + this.rationalBSplineR1toR2.degree] - this.rationalBSplineR1toR2.knots[i]);
                newControlPoints[i] = (this.rationalBSplineR1toR2.controlPoints[i - 1].multiply(1 - alpha)).add(this.rationalBSplineR1toR2.controlPoints[i].multiply(alpha));
            }
            for (var i = index - multiplicity; i < this.rationalBSplineR1toR2.controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this.rationalBSplineR1toR2.controlPoints[i];
            }
            this.rationalBSplineR1toR2.knots.splice(index + 1, 0, u);
            this.rationalBSplineR1toR2.controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }
    };
    RationalBSplineR1toR2Adapter.prototype.moveControlPoint = function (i, deltaX, deltaY) {
        if (i < 0 || i >= this.rationalBSplineR1toR2.controlPoints.length - this.rationalBSplineR1toR2.degree) {
            throw new Error("Control point indentifier is out of range");
        }
        this.rationalBSplineR1toR2.controlPoints[i].x += deltaX;
        this.rationalBSplineR1toR2.controlPoints[i].y += deltaY;
    };
    RationalBSplineR1toR2Adapter.prototype.moveControlPoints = function (delta) {
        var n = this._controlPoints.length;
        if (delta.length !== n) {
            throw new Error("Array of unexpected dimension");
        }
        var controlPoints = this._controlPoints;
        // JCL method to be updated for rational BSplines
        // for (let i = 0; i < n; i += 1) {
        //     controlPoints[i] = controlPoints[i].add(delta[i]);
        // }
        return this.factory(controlPoints, this.knots);
    };
    RationalBSplineR1toR2Adapter.prototype.setControlPointPosition = function (index, value) {
    };
    Object.defineProperty(RationalBSplineR1toR2Adapter.prototype, "degree", {
        get: function () {
            return this.rationalBSplineR1toR2.degree;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RationalBSplineR1toR2Adapter.prototype, "knots", {
        get: function () {
            return this.rationalBSplineR1toR2.knots;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RationalBSplineR1toR2Adapter.prototype, "controlPoints", {
        get: function () {
            return this.rationalBSplineR1toR2.controlPoints2D();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RationalBSplineR1toR2Adapter.prototype, "freeControlPoints", {
        get: function () {
            return this.rationalBSplineR1toR2.controlPoints2D();
        },
        enumerable: false,
        configurable: true
    });
    RationalBSplineR1toR2Adapter.prototype.clone = function () {
        return new RationalBSplineR1toR2Adapter(this.rationalBSplineR1toR2.controlPoints, this.rationalBSplineR1toR2.knots);
    };
    RationalBSplineR1toR2Adapter.prototype.evaluate = function (u) {
        return this.rationalBSplineR1toR2.evaluate(u);
    };
    RationalBSplineR1toR2Adapter.prototype.optimizerStep = function (step) {
    };
    RationalBSplineR1toR2Adapter.prototype.elevateDegree = function (times) {
        // JCL method to be implemented
        var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "elevateDegree", "method not yet implemented !");
        error.logMessage();
    };
    RationalBSplineR1toR2Adapter.prototype.degreeIncrement = function () {
        // JCL method to be implemented
        var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "degreeIncrement", "method not yet implemented !");
        error.logMessage();
        return new RationalBSplineR1toR2Adapter();
    };
    RationalBSplineR1toR2Adapter.prototype.scale = function (factor) {
        var cp = [];
        // need to double check this transformation before using this method
        this._controlPoints.forEach(function (element) {
            cp.push(element.multiply(factor));
        });
        return new RationalBSplineR1toR2Adapter(cp, this.knots.slice());
    };
    RationalBSplineR1toR2Adapter.prototype.scaleY = function (factor) {
        var cp = [];
        // need to double check the component element.z before using this method
        this._controlPoints.forEach(function (element) {
            cp.push(new Vector3d_1.Vector3d(element.x, element.y * factor, element.z));
        });
        return new RationalBSplineR1toR2Adapter(cp, this.knots.slice());
    };
    RationalBSplineR1toR2Adapter.prototype.scaleX = function (factor) {
        var cp = [];
        // need to double check the component element.z before using this method
        this._controlPoints.forEach(function (element) {
            cp.push(new Vector3d_1.Vector3d(element.x * factor, element.y, element.z));
        });
        return new RationalBSplineR1toR2Adapter(cp, this.knots.slice());
    };
    RationalBSplineR1toR2Adapter.prototype.evaluateOutsideRefInterval = function (u) {
        var result = new Vector2d_1.Vector2d();
        var knots = this.getDistinctKnots();
        if (u >= knots[0] && u <= knots[knots.length - 1]) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Parameter value for evaluation is not outside the knot interval.");
            error.logMessage();
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Method not implemented yet.");
            error.logMessage();
        }
        return result;
    };
    // to be checked for adequate usage
    RationalBSplineR1toR2Adapter.prototype.flattenControlPointsArray = function () {
        var controlPointsArray = [];
        for (var i = 0; i < this.controlPoints.length; i++) {
            controlPointsArray.push([this.controlPoints[i].x, this.controlPoints[i].y]);
        }
        return controlPointsArray.reduce(function (acc, val) {
            return acc.concat(val);
        }, []);
    };
    return RationalBSplineR1toR2Adapter;
}());
exports.RationalBSplineR1toR2Adapter = RationalBSplineR1toR2Adapter;
function deepCopyControlPoints(controlPoints) {
    var e_3, _a;
    var result = [];
    try {
        for (var controlPoints_1 = __values(controlPoints), controlPoints_1_1 = controlPoints_1.next(); !controlPoints_1_1.done; controlPoints_1_1 = controlPoints_1.next()) {
            var cp = controlPoints_1_1.value;
            result.push(cp.clone());
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (controlPoints_1_1 && !controlPoints_1_1.done && (_a = controlPoints_1.return)) _a.call(controlPoints_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return result;
}
exports.deepCopyControlPoints = deepCopyControlPoints;
