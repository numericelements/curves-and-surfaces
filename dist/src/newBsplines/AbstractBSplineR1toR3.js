"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
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
exports.deepCopyControlPoints = exports.AbstractBSplineR1toR3 = void 0;
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
var Vector3d_1 = require("../mathVector/Vector3d");
/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
var AbstractBSplineR1toR3 = /** @class */ (function () {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function AbstractBSplineR1toR3(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector3d_1.Vector3d(0, 0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        this._controlPoints = deepCopyControlPoints(controlPoints);
        this._knots = __spread(knots);
        this._degree = this.computeDegree();
    }
    AbstractBSplineR1toR3.prototype.computeDegree = function () {
        var degree = this._knots.length - this._controlPoints.length - 1;
        if (degree < 0) {
            throw new Error("Negative degree BSplineR1toR1 are not supported");
        }
        return degree;
    };
    Object.defineProperty(AbstractBSplineR1toR3.prototype, "controlPoints", {
        get: function () {
            return deepCopyControlPoints(this._controlPoints);
        },
        set: function (controlPoints) {
            this._controlPoints = deepCopyControlPoints(controlPoints);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractBSplineR1toR3.prototype, "knots", {
        get: function () {
            return __spread(this._knots);
        },
        set: function (knots) {
            this._knots = __spread(knots);
            this._degree = this.computeDegree();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractBSplineR1toR3.prototype, "degree", {
        get: function () {
            return this._degree;
        },
        enumerable: false,
        configurable: true
    });
    AbstractBSplineR1toR3.prototype.getControlPoint = function (index) {
        return this._controlPoints[index].clone();
    };
    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    AbstractBSplineR1toR3.prototype.evaluate = function (u) {
        var span = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots, this._degree);
        var basis = Piegl_Tiller_NURBS_Book_1.basisFunctions(span, u, this._knots, this._degree);
        var result = new Vector3d_1.Vector3d(0, 0, 0);
        for (var i = 0; i < this._degree + 1; i += 1) {
            result.x += basis[i] * this._controlPoints[span - this._degree + i].x;
            result.y += basis[i] * this._controlPoints[span - this._degree + i].y;
            result.z += basis[i] * this._controlPoints[span - this._degree + i].z;
        }
        return result;
    };
    AbstractBSplineR1toR3.prototype.getControlPointsX = function () {
        var e_1, _a;
        var result = [];
        try {
            for (var _b = __values(this._controlPoints), _c = _b.next(); !_c.done; _c = _b.next()) {
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
    AbstractBSplineR1toR3.prototype.getControlPointsY = function () {
        var e_2, _a;
        var result = [];
        try {
            for (var _b = __values(this._controlPoints), _c = _b.next(); !_c.done; _c = _b.next()) {
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
    AbstractBSplineR1toR3.prototype.getDistinctKnots = function () {
        var result = [this._knots[0]];
        var temp = result[0];
        for (var i = 1; i < this._knots.length; i += 1) {
            if (this._knots[i] !== temp) {
                result.push(this._knots[i]);
                temp = this._knots[i];
            }
        }
        return result;
    };
    AbstractBSplineR1toR3.prototype.moveControlPoint = function (i, deltaX, deltaY) {
        if (i < 0 || i >= this._controlPoints.length - this._degree) {
            throw new Error("Control point indentifier is out of range");
        }
        this._controlPoints[i].x += deltaX;
        this._controlPoints[i].y += deltaY;
    };
    AbstractBSplineR1toR3.prototype.moveControlPoints = function (delta) {
        var n = this._controlPoints.length;
        if (delta.length !== n) {
            throw new Error("Array of unexpected dimension");
        }
        var controlPoints = this._controlPoints;
        for (var i = 0; i < n; i += 1) {
            controlPoints[i] = controlPoints[i].add(delta[i]);
        }
        return this.factory(controlPoints, this._knots);
    };
    AbstractBSplineR1toR3.prototype.setControlPointPosition = function (index, value) {
        this._controlPoints[index] = value;
    };
    AbstractBSplineR1toR3.prototype.insertKnot = function (u, times) {
        if (times === void 0) { times = 1; }
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0) {
            return;
        }
        var index = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots, this._degree);
        var multiplicity = 0;
        if (u === this._knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }
        for (var t = 0; t < times; t += 1) {
            var newControlPoints = [];
            for (var i = 0; i < index - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            for (var i = index - this._degree + 1; i <= index - multiplicity; i += 1) {
                var alpha = (u - this._knots[i]) / (this._knots[i + this._degree] - this._knots[i]);
                newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
            }
            for (var i = index - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            this._knots.splice(index + 1, 0, u);
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }
    };
    AbstractBSplineR1toR3.prototype.knotMultiplicity = function (indexFromFindSpan) {
        var result = 0;
        var i = 0;
        while (this._knots[indexFromFindSpan + i] === this._knots[indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    };
    AbstractBSplineR1toR3.prototype.grevilleAbscissae = function () {
        var result = [];
        for (var i = 0; i < this._controlPoints.length; i += 1) {
            var sum = 0;
            for (var j = i + 1; j < i + this._degree + 1; j += 1) {
                sum += this._knots[j];
            }
            result.push(sum / this._degree);
        }
        return result;
    };
    AbstractBSplineR1toR3.prototype.clamp = function (u) {
        // Piegl and Tiller, The NURBS book, p: 151
        var index = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(u, this._knots, this._degree);
        var newControlPoints = [];
        var multiplicity = 0;
        if (u === this._knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }
        var times = this._degree - multiplicity + 1;
        for (var t = 0; t < times; t += 1) {
            for (var i = 0; i < index - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            for (var i = index - this._degree + 1; i <= index - multiplicity; i += 1) {
                var alpha = (u - this._knots[i]) / (this._knots[i + this._degree] - this._knots[i]);
                newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
            }
            for (var i = index - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            this._knots.splice(index + 1, 0, u);
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }
    };
    return AbstractBSplineR1toR3;
}());
exports.AbstractBSplineR1toR3 = AbstractBSplineR1toR3;
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
