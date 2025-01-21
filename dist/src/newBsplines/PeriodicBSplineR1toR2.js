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
exports.PeriodicBSplineR1toR2 = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var Vector2d_1 = require("../mathVector/Vector2d");
var ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var AbstractBSplineR1toR2_1 = require("./AbstractBSplineR1toR2");
var BSplineR1toR1_1 = require("./BSplineR1toR1");
var BSplineR1toR2_1 = require("./BSplineR1toR2");
var IncreasingPeriodicKnotSequenceClosedCurve_1 = require("./IncreasingPeriodicKnotSequenceClosedCurve");
var fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC_1 = require("./KnotSequenceAndUtilities/fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1 = require("./KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence");
var PeriodicBSplineR1toR2withOpenKnotSequence_1 = require("./PeriodicBSplineR1toR2withOpenKnotSequence");
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
var Knots_1 = require("../namedConstants/Knots");
/**
 * A B-Spline function from a one dimensional real periodic space to a two dimensional real space
 * with a periodic knot sequence
 */
var PeriodicBSplineR1toR2 = /** @class */ (function (_super) {
    __extends(PeriodicBSplineR1toR2, _super);
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function PeriodicBSplineR1toR2(controlPoints, knots, degree) {
        if (controlPoints === void 0) { controlPoints = [new Vector2d_1.Vector2d(0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        var _this = _super.call(this, controlPoints, knots) || this;
        _this._degree = degree;
        _this.constructorInputParamAssessment(controlPoints, knots, degree);
        var maxMultiplicity = _this._degree;
        _this._increasingKnotSequence = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicity, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots });
        return _this;
    }
    Object.defineProperty(PeriodicBSplineR1toR2.prototype, "knots", {
        get: function () {
            var e_1, _a;
            var knots = [];
            try {
                for (var _b = __values(this._increasingKnotSequence), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var knot = _c.value;
                    if (knot !== undefined)
                        knots.push(knot);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return knots;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PeriodicBSplineR1toR2.prototype, "freeControlPoints", {
        get: function () {
            return this._controlPoints;
        },
        enumerable: false,
        configurable: true
    });
    PeriodicBSplineR1toR2.prototype.create = function (controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector2d_1.Vector2d(0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        return new PeriodicBSplineR1toR2(controlPoints, knots, this._degree);
    };
    // static create(controlPoints: Vector2d[], knots: number[], degree: number): PeriodicBSplineR1toR2 | undefined {
    //     try{
    //         return new PeriodicBSplineR1toR2(controlPoints, knots, degree);
    //     } catch(error) {
    //         console.error(error);
    //         return undefined;
    //     } 
    // }
    PeriodicBSplineR1toR2.prototype.constructorInputParamAssessment = function (controlPoints, knots, degree) {
        var increasingKnotSequence = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(degree, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots });
        var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor");
        var invalid = false;
        if (degree < 0) {
            error.addMessage("Negative degree for periodic B-Spline cannot be processed.");
            invalid = true;
        }
        else if (degree === 0) {
            error.addMessage("A degree 0 periodic B-Spline cannot be defined. Please, use a non-uniform non periodic B-Spline.");
            invalid = true;
        }
        else if (degree > 0 && (knots.length - controlPoints.length) !== increasingKnotSequence.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0))) {
            error.addMessage("Inconsistent numbers of knots and control points.");
            invalid = true;
        }
        else if (knots.length < (degree + 1)) {
            error.addMessage("Inconsistent numbers of control points. Not enough control points to define a basis of B-Splines");
            invalid = true;
        }
        if (invalid) {
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    };
    /**
     * Return a deep copy of this b-spline
     */
    PeriodicBSplineR1toR2.prototype.clone = function () {
        var cloneControlPoints = AbstractBSplineR1toR2_1.deepCopyControlPoints(this._controlPoints);
        return new PeriodicBSplineR1toR2(cloneControlPoints, this.knots.slice(), this._degree);
    };
    PeriodicBSplineR1toR2.prototype.optimizerStep = function (step) {
        for (var i = 0; i < this._controlPoints.length; i += 1) {
            this._controlPoints[i].x += step[i];
            this._controlPoints[i].y += step[i + this._controlPoints.length];
        }
    };
    PeriodicBSplineR1toR2.prototype.abcsissaInputParamAssessment = function (u, methodName) {
        if (u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0))) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, methodName, "The abscissa cannot be negative. The corresponding method is not applied.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
        else if (u > this._increasingKnotSequence.getPeriod()) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, methodName, "The abscissa cannot be greater or equal than the knot sequence period. The corresponding method is not applied.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    };
    /**
     * Periodic B-Spline evaluation
     * @param u The parameter
     * @returns the value of the periodic B-Spline at u
     */
    PeriodicBSplineR1toR2.prototype.evaluate = function (u) {
        try {
            this.abcsissaInputParamAssessment(u, "evaluate");
            var span = this._increasingKnotSequence.findSpan(u);
            var basis = Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(span.knotIndex, u, this._increasingKnotSequence);
            var result = new Vector2d_1.Vector2d(0, 0);
            for (var i = 0; i < this._degree + 1; i += 1) {
                if (basis[i] !== 0.0) {
                    var indexCP = this.fromIncKnotSeqIndexToControlPointIndex(span, i);
                    result.x += basis[i] * this._controlPoints[indexCP].x;
                    result.y += basis[i] * this._controlPoints[indexCP].y;
                }
            }
            return result;
        }
        catch (error) {
            if (error instanceof RangeError) {
                error = error + " Value Infinity is returned.";
                console.error(error);
            }
            return new Vector2d_1.Vector2d(Infinity, Infinity);
        }
    };
    PeriodicBSplineR1toR2.prototype.fromIncKnotSeqIndexToControlPointIndexInputParamAssessment = function (indexKSeq, offset, methodName) {
        this._increasingKnotSequence.knotIndexInputParamAssessment(indexKSeq, methodName);
        if (offset < 0 || offset > this._degree) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, methodName, "Offset value is out of range: must be positive or null and smaller or equal to the curve degree. Control point index cannot be defined.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    };
    PeriodicBSplineR1toR2.prototype.fromIncKnotSeqIndexToControlPointIndex = function (indexKSeq, offset) {
        if (offset === void 0) { offset = 0; }
        try {
            this.fromIncKnotSeqIndexToControlPointIndexInputParamAssessment(indexKSeq, offset, "fromIncKnotSeqIndexToControlPointIndex");
            var indexCP = Infinity;
            var multiplicityFirstKnot = this._increasingKnotSequence.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
            if (((indexKSeq.knotIndex - this._degree + offset) - (multiplicityFirstKnot - 1)) < 0) {
                indexCP = this._controlPoints.length + (indexKSeq.knotIndex - this._degree + offset) - (multiplicityFirstKnot - 1);
            }
            else if (((indexKSeq.knotIndex - this._degree + offset) - (multiplicityFirstKnot - 1)) >= 0 && (indexKSeq.knotIndex - this._degree + offset) < this._controlPoints.length) {
                indexCP = indexKSeq.knotIndex - this._degree + offset - (multiplicityFirstKnot - 1);
            }
            else {
                indexCP = indexKSeq.knotIndex - this._degree + offset - this._controlPoints.length;
            }
            return indexCP;
        }
        catch (error) {
            if (error instanceof RangeError) {
                error = error + " The control point index returned is Infinity.";
                console.error(error);
            }
            return Infinity;
        }
    };
    /**
     *
     * @param u1 Parametric position where the section starts. A value inside the interval span of the curve.
     * @param u2 Parametric position where the section ends. A positive value greater than or equal to fromU but not larger than
     * @retrun the BSpline_R1_to_R2 section as open curve.
     */
    PeriodicBSplineR1toR2.prototype.extractInputParamAssessment = function (u1, u2) {
        var abscissae = this._increasingKnotSequence.allAbscissae;
        if (u1 < abscissae[0]) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "extract", "First abscissa is negative. Positive abscissa only are valid.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
        else if (u1 >= abscissae[abscissae.length - 1]) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "extract", "First abscissa must be lower than the right bound of the knot sequence. Cannot proceed.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
        if (u2 < abscissae[0]) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "extract", "Second abscissa is negative. Positive abscissa only are valid.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
        else if (u2 >= abscissae[abscissae.length - 1]) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "extract", "Second abscissa must be lower than the right bound of the knot sequence. Cannot proceed.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
        return;
    };
    PeriodicBSplineR1toR2.prototype.extract = function (u1, u2) {
        try {
            this.extractInputParamAssessment(u1, u2);
            var spline = this.clone();
            if (Math.abs(u1 - u2) < AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE) {
                var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "extract", "The bounding abscissa are either identical or close enough to each other. No curve interval can be extracted. The curve is opened at the prescribed abscissa.");
                warning.logMessage();
                var index = this.findSpanBoehmAlgorithm(u1);
                if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u1) !== 0) {
                    u1 = this._increasingKnotSequence.abscissaAtIndex(index);
                }
                spline.clamp(u1);
            }
            else {
                spline.clamp(u1);
                spline.clamp(u2);
            }
            return spline.toOpenBSpline(u1, u2);
        }
        catch (error) {
            if (error instanceof RangeError) {
                console.error(error);
            }
            return undefined;
        }
    };
    PeriodicBSplineR1toR2.prototype.clamp = function (u) {
        try {
            this.abcsissaInputParamAssessment(u, "clamp");
            var index = this.findSpanBoehmAlgorithm(u);
            var indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
            var multiplicity = 0;
            if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
                && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE) {
                multiplicity = this.knotMultiplicity(indexStrictInc);
            }
            var times = this._degree - multiplicity;
            this.insertKnotBoehmAlgorithm(u, times);
        }
        catch (error) {
            if (error instanceof RangeError) {
                console.error(error);
            }
        }
    };
    PeriodicBSplineR1toR2.prototype.elevateDegree = function (times) {
        if (times === void 0) { times = 1; }
    };
    PeriodicBSplineR1toR2.prototype.generateIntermediateSplinesForDegreeElevation = function () {
        var knotSequences = [];
        var controlPolygons = [];
        for (var i = 0; i <= this._degree; i += 1) {
            // let knotSequence = this._increasingKnotSequence.clone();
            var knotSequence = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(this._increasingKnotSequence.maxMultiplicityOrder + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: this._increasingKnotSequence.allAbscissae });
            var controlPolygon = this._controlPoints.slice();
            var k = 0;
            for (var j = i; j < (this._increasingKnotSequence.length() - 1); j += this._degree + 1) {
                var indexStrctIncreasingSeq = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(j));
                knotSequence.raiseKnotMultiplicity(indexStrctIncreasingSeq, 1);
                if (j < this._controlPoints.length) {
                    var controlPoint = this._controlPoints[j];
                    controlPolygon.splice((j + k), 0, controlPoint);
                }
                k += 1;
            }
            knotSequences.push(knotSequence.allAbscissae);
            if (i === 0) {
                var cp = controlPolygon.splice(0, 1);
                controlPolygon.splice(controlPolygon.length, 0, cp[0]);
            }
            controlPolygons.push(controlPolygon);
        }
        return {
            knotVectors: knotSequences,
            CPs: controlPolygons
        };
    };
    PeriodicBSplineR1toR2.prototype.findSpanBoehmAlgorithm = function (u) {
        try {
            this.abcsissaInputParamAssessment(u, "findSpanBoehmAlgorithm");
            // Special case
            if (u === this._increasingKnotSequence.lastKnot()) {
                var multiplicityAtOrigin = this._increasingKnotSequence.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
                return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(multiplicityAtOrigin - 1);
            }
            // Do binary search
            var low = 0;
            var high = this._increasingKnotSequence.length() - 1;
            var i = Math.floor((low + high) / 2);
            var rightBound = void 0;
            var lastAbscissa = this._increasingKnotSequence.allAbscissae[this._increasingKnotSequence.allAbscissae.length - 1];
            if (this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1)) === this._increasingKnotSequence.allAbscissae[0]) {
                rightBound = lastAbscissa;
            }
            else {
                rightBound = this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1));
            }
            while (!(this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i)) <= u && u < rightBound)) {
                if (u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i))) {
                    high = i;
                }
                else {
                    low = i;
                }
                i = Math.floor((low + high) / 2);
                if (this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1)) === this._increasingKnotSequence.allAbscissae[0]) {
                    rightBound = lastAbscissa;
                }
                else {
                    rightBound = this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1));
                }
            }
            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
        }
        catch (error) {
            if (error instanceof RangeError) {
                error = error + " Index value Infinity is returned.";
                console.error(error);
            }
            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Infinity);
        }
    };
    PeriodicBSplineR1toR2.prototype.regularizeKnotIntervalsOfSubsquence = function (index, subSequence) {
        if ((index.knotIndex - this._degree + 1) >= 0) {
            var subSeqForTest = [];
            if (subSequence[0] === ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL) {
                subSeqForTest = subSequence.slice(1);
            }
            else {
                subSeqForTest = subSequence.slice();
            }
            if (subSeqForTest.find(function (knot) { return knot === ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL; }) === ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL && subSeqForTest[0] !== ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL) {
                // if(subSequence.find((knot) => knot === 0.0) === 0.0 && subSequence[0] !== 0.0) {
                var subSeqIndex = subSequence.length - 1;
                while (subSeqIndex > 0 && subSequence[subSeqIndex] !== ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL) {
                    subSequence[subSeqIndex] = subSequence[subSeqIndex] + this._increasingKnotSequence.getPeriod();
                    subSeqIndex--;
                }
                while (subSeqIndex > 0 && subSequence[subSeqIndex] === ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL) {
                    subSequence[subSeqIndex] = this._increasingKnotSequence.getPeriod();
                    subSeqIndex--;
                }
            }
        }
        else {
            var subSeqIndex = 0;
            while (subSeqIndex < subSequence.length && subSequence[subSeqIndex] !== ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL) {
                subSequence[subSeqIndex] = subSequence[subSeqIndex] - this._increasingKnotSequence.getPeriod();
                subSeqIndex++;
            }
        }
    };
    PeriodicBSplineR1toR2.prototype.insertKnotBoehmAlgorithmInputParamAssessment = function (u, times) {
        this.abcsissaInputParamAssessment(u, "insertKnotBoehmAlgorithmInputParamAssessment");
        if (times <= 0) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnotBoehmAlgorithmInputParamAssessment", "The knot multiplicity cannot be negative or null. No insertion is perfomed.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
        else if (times > this._degree) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnotBoehmAlgorithmInputParamAssessment", "The knot multiplicity cannot be greater than the curve degree. No insertion is perfomed.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    };
    PeriodicBSplineR1toR2.prototype.insertKnotBoehmAlgorithm = function (u, times) {
        if (times === void 0) { times = 1; }
        // Uses Boehm's algorithm without restriction on the structure of the knot sequence,
        //i.e. applicable to non uniform or arbitrary knot sequences
        try {
            this.insertKnotBoehmAlgorithmInputParamAssessment(u, times);
            var index = this.findSpanBoehmAlgorithm(u);
            var multiplicityAtOrigin = this.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
            var multiplicity = 0;
            var indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
            if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u) !== 0) {
                multiplicity = this.knotMultiplicity(indexStrictInc);
            }
            for (var t = 0; t < times; t += 1) {
                var newControlPoints = [];
                var firstIndex = 0;
                var lastIndex = 0;
                if (index.knotIndex !== (multiplicity - 1)) {
                    firstIndex = (this._controlPoints.length + 1 + index.knotIndex - this._degree + 1 - (multiplicityAtOrigin - 1)) % (this._controlPoints.length + 1);
                    lastIndex = (this._controlPoints.length + 1 + index.knotIndex - multiplicity - (multiplicityAtOrigin - 1)) % (this._controlPoints.length + 1);
                }
                else {
                    firstIndex = this._controlPoints.length + index.knotIndex - this._degree + 1 - (multiplicityAtOrigin - 1);
                    lastIndex = this._controlPoints.length + index.knotIndex - multiplicity - (multiplicityAtOrigin - 1);
                }
                if (firstIndex > 0 && lastIndex > 0 && lastIndex >= firstIndex) {
                    for (var i = 0; i < firstIndex; i += 1) {
                        newControlPoints[i] = this._controlPoints[i];
                    }
                }
                var subSequence = [];
                if ((index.knotIndex - this._degree + 1) >= 0) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                    this.regularizeKnotIntervalsOfSubsquence(index, subSequence);
                }
                else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1 + (index.knotIndex - this._degree + 1) - (multiplicityAtOrigin - 1)), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1 - (multiplicityAtOrigin - 1) + index.knotIndex - multiplicity + this._degree));
                    this.regularizeKnotIntervalsOfSubsquence(index, subSequence);
                }
                var indexCPn = 0;
                var offset = index.knotIndex - this._degree + 1;
                for (var i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                    var alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                    indexCPn = (this._controlPoints.length + 1 + i - (multiplicityAtOrigin - 1)) % (this._controlPoints.length + 1);
                    if (index.knotIndex === (multiplicity - 1)) {
                        indexCPn = (this._controlPoints.length + i - (multiplicityAtOrigin - 1));
                    }
                    if (indexCPn > 0 && indexCPn < this._controlPoints.length && lastIndex > firstIndex) {
                        newControlPoints[indexCPn] = (this._controlPoints[indexCPn - 1].multiply(1 - alpha)).add(this._controlPoints[indexCPn].multiply(alpha));
                    }
                    else if (indexCPn > 0 && indexCPn <= this._controlPoints.length && lastIndex < firstIndex) {
                        if (indexCPn >= firstIndex) {
                            newControlPoints[indexCPn] = (this._controlPoints[indexCPn - 2].multiply(1 - alpha)).add(this._controlPoints[indexCPn - 1].multiply(alpha));
                        }
                        else {
                            newControlPoints[indexCPn] = (this._controlPoints[indexCPn - 1].multiply(1 - alpha)).add(this._controlPoints[indexCPn].multiply(alpha));
                        }
                    }
                    else if (indexCPn === 0) {
                        newControlPoints[0] = (this._controlPoints[this._controlPoints.length - 1].multiply(1 - alpha)).add(this._controlPoints[0].multiply(alpha));
                        // } else if(indexCPn === this._controlPoints.length && lastIndex >= firstIndex) {
                        //     // this configuration cannot occur given the equations of firstIndex and lastIndex
                        //     newControlPoints[this._controlPoints.length] = (this._controlPoints[this._controlPoints.length - 2].multiply(1 - alpha)).add(this._controlPoints[this._controlPoints.length - 1].multiply(alpha));
                    }
                    else if (indexCPn === firstIndex && firstIndex === lastIndex) {
                        newControlPoints[indexCPn] = (this._controlPoints[indexCPn - 1].multiply(1 - alpha)).add(this._controlPoints[indexCPn].multiply(alpha));
                    }
                }
                var lastCP = this._controlPoints.length;
                if ((firstIndex - 1) < this._controlPoints.length && firstIndex > lastIndex)
                    lastCP = firstIndex - 1;
                for (var j = indexCPn; j < lastCP; j++) {
                    newControlPoints[j + 1] = this._controlPoints[j];
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
                if (index.knotIndex === 0 && multiplicity !== 0)
                    multiplicityAtOrigin++;
                multiplicity++;
                index.knotIndex++;
            }
        }
        catch (error) {
            if (error instanceof RangeError) {
                console.error(error);
            }
            return;
        }
    };
    PeriodicBSplineR1toR2.prototype.degreeIncrement = function () {
        var intermSplKnotsAndCPs = this.generateIntermediateSplinesForDegreeElevation();
        var splineHigherDegree = new PeriodicBSplineR1toR2(intermSplKnotsAndCPs.CPs[0], intermSplKnotsAndCPs.knotVectors[0], (this._degree + 1));
        for (var i = 1; i <= this._degree; i += 1) {
            // const strictIncSeq_splineHigherDegree = splineHigherDegree._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
            var strictIncSeq_splineHigherDegree = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(splineHigherDegree._increasingKnotSequence);
            var splineTemp = new PeriodicBSplineR1toR2(intermSplKnotsAndCPs.CPs[i], intermSplKnotsAndCPs.knotVectors[i], (this._degree + 1));
            // const strictIncSeq_splineTemp = splineTemp._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
            var strictIncSeq_splineTemp = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(splineTemp._increasingKnotSequence);
            for (var j = 0; j < (strictIncSeq_splineHigherDegree.length() - 1); j++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(j);
                if (strictIncSeq_splineHigherDegree.knotMultiplicity(index) > strictIncSeq_splineTemp.knotMultiplicity(index))
                    splineTemp.insertKnotBoehmAlgorithm(strictIncSeq_splineTemp.abscissaAtIndex(index));
                if (strictIncSeq_splineHigherDegree.knotMultiplicity(index) < strictIncSeq_splineTemp.knotMultiplicity(index))
                    splineHigherDegree.insertKnotBoehmAlgorithm(strictIncSeq_splineHigherDegree.abscissaAtIndex(index));
            }
            var tempCPs = [];
            for (var ind = 0; ind < splineHigherDegree.controlPoints.length; ind += 1) {
                tempCPs[ind] = splineHigherDegree.controlPoints[ind].add(splineTemp.controlPoints[ind]);
            }
            splineHigherDegree.controlPoints = tempCPs;
        }
        var tempHigherDegCP = [];
        for (var j = 0; j < splineHigherDegree.controlPoints.length; j += 1) {
            tempHigherDegCP[j] = splineHigherDegree.controlPoints[j].multiply(1 / (this._degree + 1));
        }
        splineHigherDegree.controlPoints = tempHigherDegCP;
        return new PeriodicBSplineR1toR2(splineHigherDegree.controlPoints, splineHigherDegree._increasingKnotSequence.allAbscissae, (this._degree + 1));
    };
    PeriodicBSplineR1toR2.prototype.grevilleAbscissae = function () {
        var e_2, _a;
        var result = [];
        for (var i = 0; i < this._controlPoints.length; i += 1) {
            var sum = 0;
            var subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + this._degree - 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 2 * this._degree - 2));
            try {
                for (var subSequence_1 = (e_2 = void 0, __values(subSequence)), subSequence_1_1 = subSequence_1.next(); !subSequence_1_1.done; subSequence_1_1 = subSequence_1.next()) {
                    var knot = subSequence_1_1.value;
                    sum += knot;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (subSequence_1_1 && !subSequence_1_1.done && (_a = subSequence_1.return)) _a.call(subSequence_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            result.push(sum / this._degree);
        }
        return result;
    };
    // Probably not compatible with periodic BSplines -> to be modified
    PeriodicBSplineR1toR2.prototype.removeKnot = function (indexFromFindSpan, tolerance) {
        //Piegl and Tiller, The NURBS book, p : 185
        if (tolerance === void 0) { tolerance = BSplineR1toR1_1.KNOT_REMOVAL_TOLERANCE; }
        var index = indexFromFindSpan;
        // end knots are not removed
        if (index > this._degree && index < this._increasingKnotSequence.length() - this._degree - 1) {
            throw new Error("index out of range");
        }
        var indexIncSeq = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
        var multiplicity = this.knotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        var last = index - multiplicity;
        var first = index - this._degree;
        var offset = first - 1;
        //std::vector<vectorType> local(2*degree+1);
        var local = [];
        local[0] = this.controlPoints[offset];
        local[last + 1 - offset] = this.controlPoints[last + 1];
        var i = first;
        var j = last;
        var ii = 1;
        var jj = last - offset;
        var removable = false;
        var subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(first), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(last + this.degree + 1));
        // Compute new control point for one removal step
        var offset_i = first;
        while (j > i) {
            var offset_j = last;
            var alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i]) / (subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            var alpha_j = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[j - offset_j]) / (subSequence[j + this.degree + 1 - offset_j] - subSequence[j - offset_j]);
            local[ii] = (this.controlPoints[i].substract(local[ii - 1].multiply(1.0 - alpha_i))).multiply(1 / alpha_i);
            local[jj] = (this.controlPoints[j].substract(local[jj + 1].multiply(alpha_j))).multiply(1 / (1.0 - alpha_j));
            ++i;
            ++ii;
            --j;
            --jj;
        }
        if (j < i) {
            if ((local[ii - 1].substract(local[jj + 1])).norm() <= tolerance) {
                removable = true;
            }
        }
        else {
            var alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i]) / (subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            if (((this.controlPoints[i].substract((local[ii + 1].multiply(alpha_i)))).add(local[ii - 1].multiply(1.0 - alpha_i))).norm() <= tolerance) {
                removable = true;
            }
        }
        if (!removable)
            return;
        else {
            var indInc = first;
            var indDec = last;
            while (indDec > indInc) {
                this.controlPoints[indInc] = local[indInc - offset];
                this.controlPoints[indDec] = local[indDec - offset];
                ++indInc;
                --indDec;
            }
        }
        // this.knots.splice(index, 1);
        this._increasingKnotSequence.decrementKnotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        var fout = (2 * index - multiplicity - this.degree) / 2;
        this._controlPoints.splice(fout, 1);
    };
    PeriodicBSplineR1toR2.prototype.getDistinctKnots = function () {
        var multiplicityBoundary = this.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
        var result = _super.prototype.getDistinctKnots.call(this);
        return result.slice(this.degree - (multiplicityBoundary - 1), result.length - this.degree + (multiplicityBoundary - 1));
    };
    PeriodicBSplineR1toR2.prototype.isKnotlMultiplicityZero = function (u) {
        try {
            this.abcsissaInputParamAssessment(u, "isKnotlMultiplicityZero");
            var multiplicityZero = true;
            if (this.isAbscissaCoincidingWithKnot(u))
                multiplicityZero = false;
            return multiplicityZero;
        }
        catch (error) {
            if (error instanceof RangeError) {
                error = error + " Returns true considering the abscissa has necessarily a multiplicity of 0.";
                console.error(error);
            }
            return true;
        }
    };
    PeriodicBSplineR1toR2.prototype.findCoincidentKnot = function (u) {
        try {
            this.abcsissaInputParamAssessment(u, "findCoincidentKnot");
            var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
            if (!this.isKnotlMultiplicityZero(u))
                index = this.getFirstKnotIndexCoincidentWithAbscissa(u);
            return index;
        }
        catch (error) {
            if (error instanceof RangeError) {
                error = error + " Index value Infinity is returned.";
                console.error(error);
            }
            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Infinity);
        }
    };
    PeriodicBSplineR1toR2.prototype.insertKnot = function (u) {
        var uToInsert = u;
        var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        if (!this.isKnotlMultiplicityZero(u)) {
            index = this.findCoincidentKnot(u);
            var indexSpan = this._increasingKnotSequence.findSpan(this._increasingKnotSequence.abscissaAtIndex(index));
            uToInsert = this._increasingKnotSequence.abscissaAtIndex(indexSpan);
        }
        if (uToInsert >= this.knots[0] && uToInsert <= this.knots[this.knots.length - 1]) {
            var knotAbsc = this._increasingKnotSequence.allAbscissae;
            var indexOrigin = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0);
            // temoprary modif
            var knotAbscResetOrigin = [];
            // const knotAbscResetOrigin = resetKnotAbscissaeToOrigin(knotAbsc);
            var sameSplineOpenCurve = new BSplineR1toR2_1.BSplineR1toR2(this.controlPoints, knotAbscResetOrigin);
            var newUToInsert = sameSplineOpenCurve.increasingKnotSequence.abscissaAtIndex(indexOrigin) + uToInsert;
            var indexSpan = this._increasingKnotSequence.findSpan(uToInsert);
            var indexStrictIncSeq = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexSpan);
            var knotMultiplicity = this.knotMultiplicity(indexStrictIncSeq);
            if (knotMultiplicity === this._degree) {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "cannot insert knot. Current knot multiplicity already equals curve degree.");
                throw (error);
            }
            else {
                // two knot insertions must take place to preserve the periodic structure of the function basis
                // unless if uToInsert = uSymmetric. In this case, only one knot insertion is possible
                var uSymmetric = knotAbscResetOrigin[indexOrigin.knotIndex];
                // const uSymmetric = this.findKnotAbscissaeRightBound() + knotAbscResetOrigin[indexOrigin.knotIndex];
                sameSplineOpenCurve.insertKnot(newUToInsert, 1);
                if ((uSymmetric - uToInsert) !== uToInsert) {
                    sameSplineOpenCurve.insertKnot(uSymmetric - uToInsert, 1);
                }
                var newKnotAbsc = sameSplineOpenCurve.increasingKnotSequence.allAbscissae;
                for (var i = 0; i < newKnotAbsc.length; i++) {
                    newKnotAbsc[i] -= knotAbscResetOrigin[indexOrigin.knotIndex];
                }
                var newCtrlPts = sameSplineOpenCurve.controlPoints;
                if (indexSpan.knotIndex === indexOrigin.knotIndex) {
                    // the knot inserted is located at the origin of the periodic curve. To obtain the new knot
                    // sequence, the extreme knots must be removed as well as the corresponding control points
                    newKnotAbsc = newKnotAbsc.slice(1, newKnotAbsc.length - 1);
                    newCtrlPts = sameSplineOpenCurve.controlPoints.slice(1, sameSplineOpenCurve.controlPoints.length - 1);
                }
                this._controlPoints = newCtrlPts;
                this._increasingKnotSequence = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(this._degree, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: newKnotAbsc });
            }
            return;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "Cannot insert a knot outside the period of the knot sequence.");
            throw (error);
        }
    };
    PeriodicBSplineR1toR2.prototype.scale = function (factor) {
        try {
            this.scaleInputParamAssessment(factor);
            var cp_1 = [];
            this._controlPoints.forEach(function (element) {
                cp_1.push(element.multiply(factor));
            });
            return new PeriodicBSplineR1toR2(cp_1, this.knots.slice(), this._degree);
        }
        catch (error) {
            if (error instanceof RangeError) {
                console.error(error);
            }
            return undefined;
        }
    };
    PeriodicBSplineR1toR2.prototype.scaleY = function (factor) {
        try {
            this.scaleInputParamAssessment(factor);
            var cp_2 = [];
            this._controlPoints.forEach(function (element) {
                cp_2.push(new Vector2d_1.Vector2d(element.x, element.y * factor));
            });
            return new PeriodicBSplineR1toR2(cp_2, this.knots.slice(), this._degree);
        }
        catch (error) {
            if (error instanceof RangeError) {
                console.error(error);
            }
            return undefined;
        }
    };
    PeriodicBSplineR1toR2.prototype.scaleX = function (factor) {
        try {
            this.scaleInputParamAssessment(factor);
            var cp_3 = [];
            this._controlPoints.forEach(function (element) {
                cp_3.push(new Vector2d_1.Vector2d(element.x * factor, element.y));
            });
            return new PeriodicBSplineR1toR2(cp_3, this.knots.slice(), this._degree);
        }
        catch (error) {
            if (error instanceof RangeError) {
                console.error(error);
            }
            return undefined;
        }
    };
    PeriodicBSplineR1toR2.prototype.evaluateOutsideRefIntervalInputParamAssessment = function (u) {
        if (u < (-this._increasingKnotSequence.getPeriod())) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefIntervalInputParamAssessment", "Abscissa is negative. Its value is lower than the knot sequence period. No evaluation takes place.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    };
    PeriodicBSplineR1toR2.prototype.evaluateOutsideRefInterval = function (u) {
        // const strctIncSeq = this._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
        var strctIncSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(this._increasingKnotSequence);
        var lastKnot = strctIncSeq.allAbscissae[strctIncSeq.allAbscissae.length - 1];
        try {
            this.evaluateOutsideRefIntervalInputParamAssessment(u);
            if (u >= 0 && u < lastKnot) {
                var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "evaluateOutsideRefInterval", "Abscissa value falls within the interval of definition of the curve, use the evaluation method.");
                warning.logMessage();
                return this.evaluate(u);
            }
            else if (u < 0) {
                var uInInterval = u + this._increasingKnotSequence.getPeriod();
                return this.evaluate(uInInterval);
            }
            else if (u >= lastKnot) {
                var uInInterval = u % this._increasingKnotSequence.getPeriod();
                return this.evaluate(uInInterval);
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Abscissa has not fallen into any predefined sub interval. No evaluation can take place.");
                console.log(error.generateMessageString());
                throw new EvalError(error.generateMessageString());
            }
        }
        catch (error) {
            if (error instanceof RangeError) {
                console.error(error);
            }
            else if (error instanceof EvalError) {
                console.error(error);
            }
            console.log("A null value is returned.");
            return new Vector2d_1.Vector2d();
        }
    };
    PeriodicBSplineR1toR2.prototype.toPeriodicBSplineR1toR2withOpenKnotSequence = function () {
        // const knots = this._increasingKnotSequence.toOpenKnotSequence();
        var knots = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC_1.fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(this._increasingKnotSequence);
        var controlPoints = [];
        var multiplicityOrigin = this._increasingKnotSequence.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
        for (var i = 0; i < this._degree; i++) {
            controlPoints[i] = this._controlPoints[this._controlPoints.length - this._degree + i];
        }
        for (var cp = 0; cp < this._controlPoints.length - (multiplicityOrigin - 1); cp++) {
            controlPoints.push(this._controlPoints[cp]);
        }
        return new PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence(controlPoints, knots.allAbscissae);
    };
    PeriodicBSplineR1toR2.prototype.toOpenBSplineInputParamAssessment = function (u1, u2) {
        if (this.isKnotlMultiplicityZero(u1)) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "toOpenBSplineInputParamAssessment", "First abscissa is not a knot. Curve opening process cannot take place.");
            console.log(error.generateMessageString());
            throw new TypeError(error.generateMessageString());
        }
        else if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u1) !== this._degree) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "toOpenBSplineInputParamAssessment", "First abscissa has not a multiplicity equal to the curve degree. Curve opening process cannot take place.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
        if (this.isKnotlMultiplicityZero(u2)) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "toOpenBSplineInputParamAssessment", "Second abscissa is not a knot. Curve opening process cannot take place.");
            console.log(error.generateMessageString());
            throw new TypeError(error.generateMessageString());
        }
        else if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u2) !== this._degree) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "toOpenBSplineInputParamAssessment", "Second abscissa has not a multiplicity equal to the curve degree. Curve opening process cannot take place.");
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
        return;
    };
    PeriodicBSplineR1toR2.prototype.toOpenBSpline = function (u1, u2) {
        var newKnots = [];
        var newControlPoints = [];
        var multiplicityAtOrigin = this.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
        try {
            this.toOpenBSplineInputParamAssessment(u1, u2);
            if (Math.abs(u1 - u2) < AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE) {
                var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "toOpenBSpline", "The bounding abscissa are either identical or close enough to each other. No curve interval can be extracted. The curve is opened at the prescribed abscissa.");
                warning.logMessage();
                var index = this.findSpanBoehmAlgorithm(u1);
                if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u1) !== 0) {
                    u1 = this._increasingKnotSequence.abscissaAtIndex(index);
                }
                index = this.findSpanBoehmAlgorithm(u1);
                var firstIndex = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1);
                var knotSeqLength = this._increasingKnotSequence.allAbscissae.length;
                var lastIndex = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + knotSeqLength - 1 - (multiplicityAtOrigin - 1));
                newKnots = this._increasingKnotSequence.extractSubsetOfAbscissae(firstIndex, lastIndex);
                newKnots = Piegl_Tiller_NURBS_Book_1.resetKnotAbscissaeToOrigin(newKnots);
                newKnots.splice(0, 0, newKnots[0]);
                newKnots.splice(newKnots.length, 0, newKnots[newKnots.length - 1]);
                var indexCP = this.fromIncKnotSeqIndexToControlPointIndex(index);
                for (var i = indexCP; i < this._controlPoints.length; i += 1) {
                    newControlPoints.push(new Vector2d_1.Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
                }
                if (indexCP !== 0) {
                    for (var i = 0; i <= indexCP; i += 1) {
                        newControlPoints.push(new Vector2d_1.Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
                    }
                }
                else {
                    newControlPoints.push(new Vector2d_1.Vector2d(newControlPoints[0].x, newControlPoints[0].y));
                }
            }
            else {
                var index1 = this.findSpanBoehmAlgorithm(u1);
                var index2 = this.findSpanBoehmAlgorithm(u2);
                var secondSegment = false;
                if (u2 < u1)
                    secondSegment = true;
                var indexFirstKnot = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index1.knotIndex - this._degree + 1);
                if (secondSegment) {
                    var indexLastKnot = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index2.knotIndex + this._increasingKnotSequence.allAbscissae.length - multiplicityAtOrigin);
                    newKnots = this._increasingKnotSequence.extractSubsetOfAbscissae(indexFirstKnot, indexLastKnot);
                }
                else {
                    newKnots = this._increasingKnotSequence.extractSubsetOfAbscissae(indexFirstKnot, index2);
                }
                newKnots = Piegl_Tiller_NURBS_Book_1.resetKnotAbscissaeToOrigin(newKnots);
                newKnots.splice(0, 0, newKnots[0]);
                newKnots.splice(newKnots.length, 0, newKnots[newKnots.length - 1]);
                var nbCtrlPts = newKnots.length - (this._degree + 1);
                var indexCP1 = this.fromIncKnotSeqIndexToControlPointIndex(index1);
                var indexCP2 = this.fromIncKnotSeqIndexToControlPointIndex(index2);
                var lastIndex = this._controlPoints.length;
                var spanAllIndices = false;
                if ((indexCP1 + nbCtrlPts) <= this._controlPoints.length) {
                    spanAllIndices = true;
                    lastIndex = indexCP1 + nbCtrlPts;
                }
                for (var i = indexCP1; i < lastIndex; i += 1) {
                    newControlPoints.push(new Vector2d_1.Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
                }
                if (!spanAllIndices) {
                    lastIndex = indexCP2 + 1;
                    for (var i = 0; i < lastIndex; i += 1) {
                        newControlPoints.push(new Vector2d_1.Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
                    }
                }
            }
            return new BSplineR1toR2_1.BSplineR1toR2(newControlPoints, newKnots);
        }
        catch (error) {
            if (error instanceof RangeError) {
                console.error(error);
            }
            else if (error instanceof TypeError) {
                console.error(error);
            }
            return undefined;
        }
    };
    return PeriodicBSplineR1toR2;
}(AbstractBSplineR1toR2_1.AbstractBSplineR1toR2));
exports.PeriodicBSplineR1toR2 = PeriodicBSplineR1toR2;
