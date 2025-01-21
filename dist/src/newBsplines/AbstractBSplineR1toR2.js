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
exports.deepCopyControlPoints = exports.AbstractBSplineR1toR2 = exports.TOL_KNOT_COINCIDENCE = exports.curveSegment = void 0;
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
var Vector2d_1 = require("../mathVector/Vector2d");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
var Knots_1 = require("../namedConstants/Knots");
var curveSegment;
(function (curveSegment) {
    curveSegment[curveSegment["BEFORE"] = 0] = "BEFORE";
    curveSegment[curveSegment["AFTER"] = 1] = "AFTER";
})(curveSegment = exports.curveSegment || (exports.curveSegment = {}));
;
exports.TOL_KNOT_COINCIDENCE = 1.0E-8;
/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
var AbstractBSplineR1toR2 = /** @class */ (function () {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function AbstractBSplineR1toR2(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector2d_1.Vector2d(0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        this._controlPoints = deepCopyControlPoints(controlPoints);
        this._degree = this.computeDegree(knots.length);
        this.abstractConstructorInputParamAssessment(knots);
    }
    AbstractBSplineR1toR2.prototype.abstractConstructorInputParamAssessment = function (knots) {
        var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor");
        var invalid = false;
        if (this.degree < 0) {
            error.addMessage("Negative degree for periodic B-Spline cannot be processed.");
            invalid = true;
        }
        else if (knots.length < (this.degree + 1)) {
            error.addMessage("Inconsistent numbers of control points. Not enough control points to define a basis of B-Splines");
            invalid = true;
        }
        if (invalid) {
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    };
    AbstractBSplineR1toR2.prototype.computeDegree = function (knotLength) {
        var degree = knotLength - this._controlPoints.length - 1;
        if (degree < 0) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "computeDegree", "Negative degree for BSplines is inconsistent.");
            error.logMessage();
        }
        return degree;
    };
    Object.defineProperty(AbstractBSplineR1toR2.prototype, "controlPoints", {
        get: function () {
            return deepCopyControlPoints(this._controlPoints);
        },
        set: function (controlPoints) {
            this._controlPoints = deepCopyControlPoints(controlPoints);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractBSplineR1toR2.prototype, "degree", {
        get: function () {
            return this._degree;
        },
        enumerable: false,
        configurable: true
    });
    AbstractBSplineR1toR2.prototype.getControlPoint = function (index) {
        return this._controlPoints[index].clone();
    };
    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    AbstractBSplineR1toR2.prototype.evaluate = function (u) {
        var span = this._increasingKnotSequence.findSpan(u);
        var basis = Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(span.knotIndex, u, this._increasingKnotSequence);
        var result = new Vector2d_1.Vector2d(0, 0);
        for (var i = 0; i < this._degree + 1; i += 1) {
            if (basis[i] !== 0.0) {
                result.x += basis[i] * this._controlPoints[span.knotIndex - this._degree + i].x;
                result.y += basis[i] * this._controlPoints[span.knotIndex - this._degree + i].y;
            }
        }
        return result;
    };
    AbstractBSplineR1toR2.prototype.scaleInputParamAssessment = function (factor) {
        if (factor <= 0) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "scaleInputParamAssessment", "Scale factor is negative or null. Cannot generate the scaled curve.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    };
    AbstractBSplineR1toR2.prototype.getControlPointsX = function () {
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
    AbstractBSplineR1toR2.prototype.getControlPointsY = function () {
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
    AbstractBSplineR1toR2.prototype.getDistinctKnots = function () {
        return this._increasingKnotSequence.distinctAbscissae();
    };
    AbstractBSplineR1toR2.prototype.moveControlPoint = function (CPindex, deltaX, deltaY) {
        try {
            this.controlPointIndexInputParamAssessment(CPindex, "moveControlPoint");
            this._controlPoints[CPindex].x += deltaX;
            this._controlPoints[CPindex].y += deltaY;
        }
        catch (error) {
            if (error instanceof RangeError) {
                console.error(error);
            }
        }
    };
    AbstractBSplineR1toR2.prototype.moveControlPoints = function (delta) {
        var n = this._controlPoints.length;
        if (delta.length !== n) {
            throw new Error("Array of unexpected dimension");
        }
        var controlPoints = this._controlPoints;
        for (var i = 0; i < n; i += 1) {
            controlPoints[i] = controlPoints[i].add(delta[i]);
        }
        return this.create(controlPoints, this.knots);
    };
    AbstractBSplineR1toR2.prototype.controlPointIndexInputParamAssessment = function (index, methodName) {
        if (index < 0 || index >= this._controlPoints.length) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, methodName, "Control point index is out of range: control point location cannot be prescribed.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    };
    AbstractBSplineR1toR2.prototype.setControlPointPosition = function (index, value) {
        try {
            this.controlPointIndexInputParamAssessment(index, "setControlPointPosition");
            this._controlPoints[index] = value;
        }
        catch (error) {
            if (error instanceof RangeError) {
                console.error(error);
            }
        }
    };
    // resetKnotAbscissaToOrigin(knotAbscissa: number[]): number[] {
    //     let result: number[] = [];
    //     if(Math.abs(knotAbscissa[0]) < TOL_KNOT_COINCIDENCE) {
    //         result = knotAbscissa.slice();
    //         const warning = new WarningLog(this.constructor.name, "resetKnotAbscissaToOrigin", "No need to reset the sequence of knot abscissa");
    //         warning.logMessage();
    //     } else {
    //         result.push(OPEN_KNOT_SEQUENCE_ORIGIN);
    //         for(let i= 1; i < knotAbscissa.length; i++) {
    //             result.push(knotAbscissa[i] - knotAbscissa[0]);
    //         }
    //     }
    //     return result;
    // }
    AbstractBSplineR1toR2.prototype.insertKnot = function (u, times) {
        if (times === void 0) { times = 1; }
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0 || times > (this._degree + 1)) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "Inconsistent multiplicity order of the knot insertion. No insertion performed.");
            error.logMessage();
            return;
        }
        var index = this._increasingKnotSequence.findSpan(u);
        var indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        var multiplicity = 0;
        if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u) !== 0) {
            multiplicity = this.knotMultiplicity(indexStrictInc);
        }
        if ((multiplicity + times) > (this._degree + 1)) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "The number of times the knot should be inserted is incompatible with the curve degree.");
            console.log("u = ", u, " multiplicity + times = ", (multiplicity + times));
            error.logMessage();
            return;
        }
        var newIndexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        for (var t = 0; t < times; t += 1) {
            var newControlPoints = [];
            var upperBound = 1;
            if ((index.knotIndex - this._degree + 1) < this._controlPoints.length && (index.knotIndex - this._degree + 1) > 0) {
                upperBound = index.knotIndex - this._degree + 1;
            }
            else if ((index.knotIndex - this._degree + 1) > 0) {
                upperBound = this._controlPoints.length;
            }
            for (var i = 0; i < upperBound; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            var subSequence = [];
            if ((index.knotIndex - this._degree + 1) >= 0) {
                if (index.knotIndex - multiplicity + this._degree < this._increasingKnotSequence.length()) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                }
                else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1));
                }
            }
            else {
                subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), 
                // new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(2 * this._degree - multiplicity - 1));
            }
            for (var i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                if (i > 0 && i < this._controlPoints.length) {
                    var offset = index.knotIndex - this._degree + 1;
                    var alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                    newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
                }
            }
            var lowerBound = this._controlPoints.length - 1;
            if (index.knotIndex - multiplicity < this._controlPoints.length)
                lowerBound = index.knotIndex - multiplicity;
            for (var i = lowerBound; i < this._controlPoints.length; i += 1) {
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
            // index += 1;
        }
    };
    AbstractBSplineR1toR2.prototype.insertKnotBoehmAlgorithm = function (u, times) {
        if (times === void 0) { times = 1; }
        // Uses Boehm algorithm without restriction on the structure of the knot sequence,
        //i.e. applicable to non uniform or arbitrary knot sequences
        if (times <= 0 || times > (this._degree + 1)) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnotBoehmAlgorithm", "The knot multiplicity prescribed is incompatible with the curve degree.");
            error.logMessage();
            return;
        }
        var index = this.findSpanBoehmAlgorithm(u);
        if (u > this._increasingKnotSequence.abscissaAtIndex(index)
            && u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + 1))) {
            // if(times > )
        }
        var multiplicity = 0;
        var indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u) !== 0) {
            multiplicity = this.knotMultiplicity(indexStrictInc);
        }
        var newIndexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        for (var t = 0; t < times; t += 1) {
            var newControlPoints = [];
            for (var i = 0; i < index.knotIndex; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            var subSequence = [];
            if ((index.knotIndex - this._degree + 1) >= 0) {
                if (index.knotIndex - multiplicity + this._degree < this._increasingKnotSequence.length()) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                }
                else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1));
                }
            }
            else {
                subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), 
                // new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(2 * this._degree - multiplicity - 1));
            }
            // const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
            // new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
            for (var i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                var offset = index.knotIndex - this._degree + 1;
                var alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                if ((i - 1) >= 0 && i < (this._controlPoints.length - 1)) {
                    newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
                }
                else if (i < (this._controlPoints.length - 1)) {
                    newControlPoints[i] = this._controlPoints[i].multiply(alpha);
                }
                else if ((i - 1) >= 0) {
                    newControlPoints[i] = this._controlPoints[i - 1].multiply(1 - alpha);
                }
                else {
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
            multiplicity++;
            index.knotIndex++;
        }
    };
    AbstractBSplineR1toR2.prototype.findSpanBoehmAlgorithm = function (u) {
        // Special case
        if (u === this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - this._degree - 1))) {
            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - this._degree - 2);
        }
        // Do binary search
        var low = 0;
        var high = this._increasingKnotSequence.length() - 1 - this._degree;
        var i = Math.floor((low + high) / 2);
        while (!(this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i)) <= u && u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1)))) {
            if (u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i))) {
                high = i;
            }
            else {
                low = i;
            }
            i = Math.floor((low + high) / 2);
        }
        return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
    };
    AbstractBSplineR1toR2.prototype.knotMultiplicity = function (index) {
        var result = this._increasingKnotSequence.knotMultiplicity(index);
        return result;
    };
    AbstractBSplineR1toR2.prototype.grevilleAbscissae = function () {
        var e_3, _a;
        var result = [];
        for (var i = 0; i < this._controlPoints.length; i += 1) {
            var sum = 0;
            var subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + this._degree));
            try {
                for (var subSequence_1 = (e_3 = void 0, __values(subSequence)), subSequence_1_1 = subSequence_1.next(); !subSequence_1_1.done; subSequence_1_1 = subSequence_1.next()) {
                    var knot = subSequence_1_1.value;
                    sum += knot;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (subSequence_1_1 && !subSequence_1_1.done && (_a = subSequence_1.return)) _a.call(subSequence_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            result.push(sum / this._degree);
        }
        return result;
    };
    AbstractBSplineR1toR2.prototype.isAbscissaCoincidingWithKnot = function (u) {
        return this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u);
    };
    AbstractBSplineR1toR2.prototype.getFirstKnotIndexCoincidentWithAbscissa = function (u) {
        var index = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        for (var i = 0; i < this._increasingKnotSequence.length(); i++) {
            if (Math.abs(u - this.knots[i]) < exports.TOL_KNOT_COINCIDENCE) {
                index = i;
                break;
            }
        }
        if (index < this._degree || index > (this._increasingKnotSequence.length() - 1 - this._degree)) {
            index = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        }
        return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
    };
    AbstractBSplineR1toR2.prototype.clamp = function (u) {
        // Piegl and Tiller, The NURBS book, p: 151
        var index = this._increasingKnotSequence.findSpan(u);
        var indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        var newControlPoints = [];
        var multiplicity = 0;
        if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
            && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < exports.TOL_KNOT_COINCIDENCE) {
            multiplicity = this.knotMultiplicity(indexStrictInc);
        }
        var times = this._degree - multiplicity + 1;
        for (var t = 0; t < times; t += 1) {
            for (var i = 0; i < index.knotIndex - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            if ((index.knotIndex - this._degree + 1) <= (index.knotIndex - multiplicity)) {
                var subSequence = [];
                if ((index.knotIndex + this._degree - multiplicity) > (index.knotIndex + 1)) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + this._degree - multiplicity));
                }
                else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + 1));
                }
                var offset = index.knotIndex - this._degree + 1;
                for (var i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                    var alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                    newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
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
                indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
            }
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index.knotIndex += 1;
        }
    };
    AbstractBSplineR1toR2.prototype.flattenControlPointsArray = function () {
        var controlPointsArray = [];
        for (var i = 0; i < this.controlPoints.length; i++) {
            controlPointsArray.push([this.controlPoints[i].x, this.controlPoints[i].y]);
        }
        return controlPointsArray.reduce(function (acc, val) {
            return acc.concat(val);
        }, []);
    };
    return AbstractBSplineR1toR2;
}());
exports.AbstractBSplineR1toR2 = AbstractBSplineR1toR2;
function deepCopyControlPoints(controlPoints) {
    var e_4, _a;
    var result = [];
    try {
        for (var controlPoints_1 = __values(controlPoints), controlPoints_1_1 = controlPoints_1.next(); !controlPoints_1_1.done; controlPoints_1_1 = controlPoints_1.next()) {
            var cp = controlPoints_1_1.value;
            result.push(cp.clone());
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (controlPoints_1_1 && !controlPoints_1_1.done && (_a = controlPoints_1.return)) _a.call(controlPoints_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return result;
}
exports.deepCopyControlPoints = deepCopyControlPoints;
