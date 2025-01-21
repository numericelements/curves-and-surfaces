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
exports.AbstractBSplineR1toR1 = exports.MAX_ITERATIONS_FOR_ZEROS_COMPUTATION = exports.CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION = void 0;
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
var ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var KnotSequences_1 = require("../namedConstants/KnotSequences");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
var Knots_1 = require("../namedConstants/Knots");
exports.CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION = 10e-8;
exports.MAX_ITERATIONS_FOR_ZEROS_COMPUTATION = 1e6;
/**
 * A B-Spline function from a one dimensional real space to a one dimensional real space
 */
var AbstractBSplineR1toR1 = /** @class */ (function () {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function AbstractBSplineR1toR1(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [0]; }
        if (knots === void 0) { knots = [0, 1]; }
        this._controlPoints = [];
        this._degree = 0;
        this._controlPoints = __spread(controlPoints);
        this._degree = this.computeDegree(knots.length);
    }
    AbstractBSplineR1toR1.prototype.computeDegree = function (knotLength) {
        var degree = knotLength - this._controlPoints.length - 1;
        if (degree < 0) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "computeDegree", "Negative degree BSplineR1toR1 are not supported.");
            error.logMessage();
        }
        return degree;
    };
    Object.defineProperty(AbstractBSplineR1toR1.prototype, "degree", {
        get: function () {
            return this._degree;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractBSplineR1toR1.prototype, "controlPoints", {
        get: function () {
            return __spread(this._controlPoints);
        },
        set: function (controlPoints) {
            this._controlPoints = __spread(controlPoints);
            this._degree = this.computeDegree(this._increasingKnotSequence.length());
        },
        enumerable: false,
        configurable: true
    });
    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    AbstractBSplineR1toR1.prototype.evaluate = function (u) {
        var span = this._increasingKnotSequence.findSpan(u);
        var basis = Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(span.knotIndex, u, this._increasingKnotSequence);
        var result = 0;
        for (var i = 0; i < this._degree + 1; i += 1) {
            result += basis[i] * this._controlPoints[span.knotIndex - this._degree + i];
        }
        return result;
    };
    AbstractBSplineR1toR1.prototype.distinctKnots = function () {
        return this._increasingKnotSequence.distinctAbscissae();
    };
    AbstractBSplineR1toR1.prototype.zeros = function (tolerance) {
        var e_1, _a, e_2, _b, e_3, _c;
        if (tolerance === void 0) { tolerance = exports.CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION; }
        //see : chapter 11 : Computing Zeros of Splines by Tom Lyche and Knut Morken for u_star method
        var spline = this.clone();
        var greville = [];
        var maxError = tolerance * 2;
        var vertexIndex = [];
        var it = 0;
        while (maxError > tolerance && it < exports.MAX_ITERATIONS_FOR_ZEROS_COMPUTATION) {
            it += 1;
            var maximum = 0;
            var newKnots = [];
            vertexIndex = findControlPointsFollowingSignChanges(spline);
            greville = spline.grevilleAbscissae();
            try {
                for (var vertexIndex_1 = (e_1 = void 0, __values(vertexIndex)), vertexIndex_1_1 = vertexIndex_1.next(); !vertexIndex_1_1.done; vertexIndex_1_1 = vertexIndex_1.next()) {
                    var v = vertexIndex_1_1.value;
                    var uLeft = greville[v - 1];
                    var uRight = greville[v];
                    if (uRight - uLeft > maximum) {
                        maximum = uRight - uLeft;
                    }
                    if (uRight - uLeft > tolerance) {
                        var lineZero = this.robustFindLineZero(uLeft, spline.controlPoints[v - 1], uRight, spline.controlPoints[v]);
                        newKnots.push(0.05 * (uLeft + uRight) / 2 + 0.95 * lineZero);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (vertexIndex_1_1 && !vertexIndex_1_1.done && (_a = vertexIndex_1.return)) _a.call(vertexIndex_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var newKnots_1 = (e_2 = void 0, __values(newKnots)), newKnots_1_1 = newKnots_1.next(); !newKnots_1_1.done; newKnots_1_1 = newKnots_1.next()) {
                    var knot = newKnots_1_1.value;
                    spline.insertKnot(knot);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (newKnots_1_1 && !newKnots_1_1.done && (_b = newKnots_1.return)) _b.call(newKnots_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            maxError = maximum;
        }
        var result = [];
        if (it === exports.MAX_ITERATIONS_FOR_ZEROS_COMPUTATION) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "zeros", "Maximum number of iterations reached when computing zeros of BSplineR1toR1");
            error.logMessage();
            return result;
        }
        vertexIndex = findControlPointsFollowingSignChanges(spline);
        try {
            for (var vertexIndex_2 = __values(vertexIndex), vertexIndex_2_1 = vertexIndex_2.next(); !vertexIndex_2_1.done; vertexIndex_2_1 = vertexIndex_2.next()) {
                var v = vertexIndex_2_1.value;
                result.push(greville[v]);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (vertexIndex_2_1 && !vertexIndex_2_1.done && (_c = vertexIndex_2.return)) _c.call(vertexIndex_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return result;
    };
    AbstractBSplineR1toR1.prototype.grevilleAbscissae = function () {
        var e_4, _a;
        var result = [];
        for (var i = 0; i < this._controlPoints.length; i += 1) {
            var sum = 0;
            var subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + this._degree));
            try {
                for (var subSequence_1 = (e_4 = void 0, __values(subSequence)), subSequence_1_1 = subSequence_1.next(); !subSequence_1_1.done; subSequence_1_1 = subSequence_1.next()) {
                    var knot = subSequence_1_1.value;
                    sum += knot;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (subSequence_1_1 && !subSequence_1_1.done && (_a = subSequence_1.return)) _a.call(subSequence_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            result.push(sum / this._degree);
        }
        return result;
    };
    AbstractBSplineR1toR1.prototype.insertKnot = function (u, times) {
        if (times === void 0) { times = 1; }
        if (times <= 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "insertKnot", "knot multiplicity prescribed equals zero or is negative. No knot insertion.");
            warning.logMessage();
            return;
        }
        var index = this._increasingKnotSequence.findSpan(u);
        var multiplicity = 0;
        var newControlPoints = [];
        if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
            && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
            multiplicity = this._increasingKnotSequence.knotMultiplicityAtAbscissa(this._increasingKnotSequence.abscissaAtIndex(index));
        }
        if ((multiplicity + times) > (this._degree + 1)) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "The number of times the knot should be inserted is incompatible with the curve degree.");
            console.log("u = ", u, " multiplicity + times = ", (multiplicity + times));
            error.logMessage();
            return;
        }
        var indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        var newIndexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        for (var t = 0; t < times; t += 1) {
            for (var i = 0; i < index.knotIndex - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            var subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
            for (var i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                var offset = index.knotIndex - this._degree + 1;
                var alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                newControlPoints[i] = this._controlPoints[i - 1] * (1 - alpha) + this._controlPoints[i] * alpha;
            }
            for (var i = index.knotIndex - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            if (multiplicity > 0) {
                this._increasingKnotSequence.raiseKnotMultiplicity(indexStrictInc, 1);
            }
            else if (multiplicity === 0 && t === 0) {
                this._increasingKnotSequence.insertKnot(u, 1);
                var newIndex = this._increasingKnotSequence.findSpan(u);
                newIndexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
            }
            else {
                this._increasingKnotSequence.raiseKnotMultiplicity(newIndexStrictInc, 1);
            }
            this._controlPoints = newControlPoints.slice();
        }
    };
    AbstractBSplineR1toR1.prototype.knotMultiplicity = function (index) {
        var result = this._increasingKnotSequence.knotMultiplicity(index);
        return result;
    };
    AbstractBSplineR1toR1.prototype.clamp = function (u) {
        // Piegl and Tiller, The NURBS book, p: 151
        var index = this._increasingKnotSequence.findSpan(u);
        var newControlPoints = [];
        var multiplicity = 0;
        var indexPlusDegree = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + this.degree);
        if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
            && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
            multiplicity = this._increasingKnotSequence.knotMultiplicityAtAbscissa(this._increasingKnotSequence.abscissaAtIndex(index));
        }
        else if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
            && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(indexPlusDegree)) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
            var temporary_mult = 0;
            var tempIndex = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1);
            while (tempIndex.knotIndex >= (index.knotIndex + this._degree)) {
                var tempIndexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(tempIndex);
                if (this.knotMultiplicity(tempIndexStrictInc) > temporary_mult)
                    temporary_mult = this.knotMultiplicity(tempIndexStrictInc);
                tempIndex.knotIndex--;
            }
            // multiplicity = this.knotMultiplicity(index + this._degree);
            multiplicity = temporary_mult;
        }
        var times = this._degree - multiplicity + 1;
        var indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        var newIndexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        for (var t = 0; t < times; t += 1) {
            for (var i = 0; i < index.knotIndex - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            if ((index.knotIndex - this._degree + 1) <= (index.knotIndex - multiplicity)) {
                var subSequence = [];
                if ((index.knotIndex - multiplicity) > (index.knotIndex + 1)) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - multiplicity));
                }
                else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + 1));
                }
                for (var i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                    var offset = index.knotIndex - this._degree + 1;
                    var alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                    newControlPoints[i] = this._controlPoints[i - 1] * (1 - alpha) + this._controlPoints[i] * alpha;
                }
            }
            for (var i = index.knotIndex - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            if (multiplicity > 0) {
                this._increasingKnotSequence.raiseKnotMultiplicity(indexStrictInc, 1);
            }
            else if (multiplicity === 0 && t === 0) {
                this._increasingKnotSequence.insertKnot(u, 1);
                var newIndex = this._increasingKnotSequence.findSpan(u);
                newIndexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
            }
            else {
                this._increasingKnotSequence.raiseKnotMultiplicity(newIndexStrictInc, 1);
            }
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index.knotIndex += 1;
        }
    };
    AbstractBSplineR1toR1.prototype.controlPolygonNumberOfSignChanges = function () {
        var result = 0;
        for (var i = 0; i < this._controlPoints.length - 1; i += 1) {
            if (Math.sign(this._controlPoints[i]) !== Math.sign(this._controlPoints[i + 1])) {
                result += 1;
            }
        }
        return result;
    };
    AbstractBSplineR1toR1.prototype.controlPolygonZeros = function () {
        var result = [];
        var greville = this.grevilleAbscissae();
        for (var i = 0; i < this._controlPoints.length - 1; i += 1) {
            if (Math.sign(this._controlPoints[i]) !== Math.sign(this._controlPoints[i + 1])) {
                result.push(this.findLineZero(greville[i], this._controlPoints[i], greville[i + 1], this._controlPoints[i + 1]));
            }
        }
        return result;
    };
    AbstractBSplineR1toR1.prototype.findLineZero = function (x1, y1, x2, y2) {
        // find the zero of the line y = ax + b
        var a = (y2 - y1) / (x2 - x1);
        var b = y1 - a * x1;
        return -b / a;
    };
    AbstractBSplineR1toR1.prototype.robustFindLineZero = function (x1, y1, x2, y2) {
        var result = this.findLineZero(x1, y1, x2, y2);
        if (isNaN(result)) {
            return x1;
        }
        return result;
    };
    AbstractBSplineR1toR1.prototype.zerosPolygonVsFunctionDiffViewer = function (tolerance) {
        var e_5, _a;
        if (tolerance === void 0) { tolerance = exports.CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION; }
        //see : chapter 11 : Computing Zeros of Splines by Tom Lyche and Knut Morken for u_star method
        var spline = this.clone();
        // let spline = new BSpline_R1_to_R1(this.controlPoints.slice(), this.knots.slice())
        var greville = spline.grevilleAbscissae();
        var maxError = tolerance * 2;
        var vertexIndex = [];
        var cpZeros = spline.controlPolygonNumberOfSignChanges();
        var result = [];
        var lastInsertedKnot = 0;
        while (maxError > tolerance) {
            var temp = spline.controlPolygonNumberOfSignChanges();
            if (cpZeros !== temp) {
                result.push(lastInsertedKnot);
            }
            cpZeros = temp;
            var cpLeft = spline.controlPoints[0];
            vertexIndex = [];
            var maximum = 0;
            for (var index = 1; index < spline.controlPoints.length; index += 1) {
                var cpRight = spline.controlPoints[index];
                if (cpLeft <= 0 && cpRight > 0) {
                    vertexIndex.push(index);
                }
                if (cpLeft >= 0 && cpRight < 0) {
                    vertexIndex.push(index);
                }
                cpLeft = cpRight;
            }
            try {
                for (var vertexIndex_3 = (e_5 = void 0, __values(vertexIndex)), vertexIndex_3_1 = vertexIndex_3.next(); !vertexIndex_3_1.done; vertexIndex_3_1 = vertexIndex_3.next()) {
                    var index = vertexIndex_3_1.value;
                    var uLeft = greville[index - 1];
                    var uRight = greville[index];
                    if (uRight - uLeft > maximum) {
                        maximum = uRight - uLeft;
                    }
                    if (uRight - uLeft > tolerance) {
                        lastInsertedKnot = (uLeft + uRight) / 2;
                        spline.insertKnot(lastInsertedKnot);
                        greville = spline.grevilleAbscissae();
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (vertexIndex_3_1 && !vertexIndex_3_1.done && (_a = vertexIndex_3.return)) _a.call(vertexIndex_3);
                }
                finally { if (e_5) throw e_5.error; }
            }
            maxError = maximum;
        }
        return result;
    };
    AbstractBSplineR1toR1.prototype.getExtremumClosestToZero = function () {
        var locExtremum = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        var valExtremum = 0.0;
        var locExtrema = this.derivative().zeros();
        if (locExtrema.length > 1) {
            var closestVal = this.evaluate(locExtrema[0]);
            var locExtremum_1 = locExtrema[0];
            for (var location_1 = 1; location_1 < locExtrema.length; location_1++) {
                var currentVal = this.evaluate(locExtrema[location_1]);
                if (Math.abs(currentVal) < Math.abs(closestVal)) {
                    closestVal = currentVal;
                    locExtremum_1 = locExtrema[location_1];
                }
            }
            return { location: locExtremum_1, value: closestVal };
        }
        else if (locExtrema.length === 1) {
            return { location: locExtrema[0], value: this.evaluate(locExtrema[0]) };
        }
        return { location: locExtremum, value: valExtremum };
    };
    return AbstractBSplineR1toR1;
}());
exports.AbstractBSplineR1toR1 = AbstractBSplineR1toR1;
function findControlPointsFollowingSignChanges(spline) {
    var cpLeft = spline.controlPoints[0];
    var vertexIndex = [];
    for (var index = 1; index < spline.controlPoints.length; index += 1) {
        var cpRight = spline.controlPoints[index];
        if (cpLeft <= 0 && cpRight > 0) {
            vertexIndex.push(index);
        }
        if (cpLeft >= 0 && cpRight < 0) {
            vertexIndex.push(index);
        }
        cpLeft = cpRight;
    }
    if (spline.controlPoints[spline.controlPoints.length - 1] == 0) {
        vertexIndex.push(spline.controlPoints.length - 1);
    }
    return vertexIndex;
}
