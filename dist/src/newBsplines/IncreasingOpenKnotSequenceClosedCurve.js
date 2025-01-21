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
exports.IncreasingOpenKnotSequenceClosedCurve = void 0;
var KnotSequences_1 = require("../namedConstants/KnotSequences");
var AbstractIncreasingOpenKnotSequence_1 = require("./AbstractIncreasingOpenKnotSequence");
var Knot_1 = require("./Knot");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var fromStrictlyIncreasingToIncreasingKnotSequenceCC_1 = require("./KnotSequenceAndUtilities/fromStrictlyIncreasingToIncreasingKnotSequenceCC");
var KnotSequences_2 = require("../ErrorMessages/KnotSequences");
var fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1 = require("./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC");
var fromInputParametersToIncreasingOpenKnotSequenceCC_1 = require("./KnotSequenceAndUtilities/fromInputParametersToIncreasingOpenKnotSequenceCC");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
var IncreasingOpenKnotSequenceClosedCurve = /** @class */ (function (_super) {
    __extends(IncreasingOpenKnotSequenceClosedCurve, _super);
    function IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, knotParameters) {
        var _this = _super.call(this, maxMultiplicityOrder, knotParameters) || this;
        if (knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE) {
            _this.computeKnotSequenceFromPeriodicKnotSequence(knotParameters);
        }
        // The validity of the knot sequence should follow the given sequence of calls
        // to make sure that the sequence origin is correctly set first since it is used
        // when checking the degree consistency and knot multiplicities outside the effective curve interval
        _this.checkNonUniformKnotMultiplicityOrder();
        _this.checkUniformityOfKnotMultiplicity();
        _this.checkUniformityOfKnotSpacing();
        if (knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE
            || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS) {
            _this.checkCurveOrigin();
            _this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
            _this.checkKnotIntervalConsistency();
        }
        _this.checkMaxMultiplicityOrderConsistency();
        return _this;
    }
    Object.defineProperty(IncreasingOpenKnotSequenceClosedCurve.prototype, "freeKnots", {
        // freeKnots is an accessor available for B-Spline curves to obtain a subset of a knot sequence, associated with control points
        // that can be available as a free parameter subset for some applications, e.g., optimization
        get: function () {
            var freeKnots = this.periodicKnots;
            freeKnots.splice(0, 1);
            freeKnots.splice(freeKnots.length - 1, 1);
            return freeKnots;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IncreasingOpenKnotSequenceClosedCurve.prototype, "periodicKnots", {
        get: function () {
            var e_1, _a;
            var periodicKnots = [];
            try {
                for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var knot = _c.value;
                    if (knot !== undefined)
                        periodicKnots.push(knot);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            periodicKnots.splice(0, (this._maxMultiplicityOrder - this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity));
            periodicKnots.splice(periodicKnots.length - (this._maxMultiplicityOrder - this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity), (this._maxMultiplicityOrder - this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity));
            return periodicKnots;
        },
        enumerable: false,
        configurable: true
    });
    IncreasingOpenKnotSequenceClosedCurve.prototype.constructorInputBspBasisSizeAssessment = function (knotParameters) {
        if (knotParameters.BsplBasisSize < this._maxMultiplicityOrder || (this._maxMultiplicityOrder === 2 && knotParameters.BsplBasisSize < (this._maxMultiplicityOrder + 1)))
            this.throwRangeErrorMessage("constructor", KnotSequences_2.EM_SIZENORMALIZED_BSPLINEBASIS);
    };
    IncreasingOpenKnotSequenceClosedCurve.prototype.checkKnotIntervalConsistency = function () {
        if (this.knotSequence[0].multiplicity >= this._maxMultiplicityOrder && this.knotSequence[this.knotSequence.length - 1].multiplicity >= this._maxMultiplicityOrder)
            return;
        if (this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa !== KnotSequences_1.KNOT_SEQUENCE_ORIGIN)
            this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
        var indexRightBoundBasis = this.getKnotIndexNormalizedBasisAtSequenceEnd().knot.knotIndex;
        var multiplicityAtOrigin = this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity;
        var i = 0;
        var cumulativeMultiplicity = 0;
        while ((this._indexKnotOrigin.knotIndex - i) > 0) {
            var interval1 = this.knotSequence[indexRightBoundBasis - (i + 1)].abscissa - this.knotSequence[indexRightBoundBasis - i].abscissa;
            var multiplicity1 = this.knotSequence[indexRightBoundBasis - (i + 1)].multiplicity;
            var interval2 = this.knotSequence[this._indexKnotOrigin.knotIndex - (i + 1)].abscissa - this.knotSequence[this._indexKnotOrigin.knotIndex - i].abscissa;
            var multiplicity2 = this.knotSequence[this._indexKnotOrigin.knotIndex - (i + 1)].multiplicity;
            if ((Math.abs(interval1 - interval2) > KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE || multiplicity1 !== multiplicity2) && (this._indexKnotOrigin.knotIndex - i) > 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
            }
            else if ((Math.abs(interval1 - interval2) > KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE || multiplicity1 < multiplicity2) && (this._indexKnotOrigin.knotIndex - i) === 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
            }
            if ((this._indexKnotOrigin.knotIndex - i) > 1) {
                cumulativeMultiplicity += multiplicity1;
            }
            else if (cumulativeMultiplicity + multiplicity2 + multiplicityAtOrigin !== this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_INCORRECT_MULTIPLICITY_AT_FIRST_KNOT);
            }
            i++;
        }
        i = 0;
        cumulativeMultiplicity = 0;
        while ((indexRightBoundBasis + i + 1) < this.knotSequence.length) {
            var interval1 = this.knotSequence[indexRightBoundBasis + i].abscissa - this.knotSequence[indexRightBoundBasis + i + 1].abscissa;
            var multiplicity1 = this.knotSequence[indexRightBoundBasis + (i + 1)].multiplicity;
            var interval2 = this.knotSequence[this._indexKnotOrigin.knotIndex + i].abscissa - this.knotSequence[this._indexKnotOrigin.knotIndex + i + 1].abscissa;
            var multiplicity2 = this.knotSequence[this._indexKnotOrigin.knotIndex + (i + 1)].multiplicity;
            if ((Math.abs(interval1 - interval2) > KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE || multiplicity1 !== multiplicity2) && (indexRightBoundBasis + (i + 1)) < this.knotSequence.length - 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
            }
            else if ((Math.abs(interval1 - interval2) > KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE || multiplicity2 < multiplicity1) && (indexRightBoundBasis + (i + 1)) === this.knotSequence.length - 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
            }
            if ((indexRightBoundBasis + (i + 1)) < this.knotSequence.length - 1) {
                cumulativeMultiplicity += multiplicity1;
            }
            else if (cumulativeMultiplicity + multiplicity1 + multiplicityAtOrigin !== this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_INCORRECT_MULTIPLICITY_AT_LAST_KNOT);
            }
            i++;
        }
    };
    IncreasingOpenKnotSequenceClosedCurve.prototype.checkNonUniformKnotMultiplicityOrder = function () {
        this._isKnotMultiplicityNonUniform = false;
    };
    IncreasingOpenKnotSequenceClosedCurve.prototype.clone = function () {
        if (this._isSequenceUpToC0Discontinuity) {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: this.allAbscissae });
        }
        else {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: this.allAbscissae });
        }
    };
    IncreasingOpenKnotSequenceClosedCurve.prototype.computeKnotSequenceFromPeriodicKnotSequence = function (knotParameters) {
        var minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotIncreasingValues(knotParameters.periodicKnots);
        var openSequence = fromInputParametersToIncreasingOpenKnotSequenceCC_1.fromInputParametersToIncreasingOpenKnotSequenceCC(this._maxMultiplicityOrder, knotParameters);
        var knots = openSequence.distinctAbscissae();
        var multiplicities = openSequence.multiplicities();
        for (var i = 0; i < knots.length; i++) {
            this.knotSequence.push(new Knot_1.Knot(knots[i], multiplicities[i]));
        }
        this._uMax = knotParameters.periodicKnots[knotParameters.periodicKnots.length - 1];
        this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
    };
    IncreasingOpenKnotSequenceClosedCurve.prototype.toKnotIndexStrictlyIncreasingSequence = function (index) {
        var e_2, _a;
        var strictlyIncreasingKnotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(this);
        var abscissa = this.abscissaAtIndex(index);
        var i = 0;
        try {
            for (var _b = __values(strictlyIncreasingKnotSequence.allAbscissae), _c = _b.next(); !_c.done; _c = _b.next()) {
                var knot = _c.value;
                if (knot !== undefined) {
                    if (knot === abscissa)
                        break;
                    i++;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
    };
    IncreasingOpenKnotSequenceClosedCurve.prototype.isAbscissaCoincidingWithKnot = function (abscissa) {
        var e_3, _a;
        var coincident = false;
        var indexCoincidentKnot = 0;
        try {
            for (var _b = __values(this.knotSequence), _c = _b.next(); !_c.done; _c = _b.next()) {
                var knot = _c.value;
                if (Math.abs(abscissa - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                    coincident = true;
                    break;
                }
                indexCoincidentKnot++;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (coincident) {
            if (indexCoincidentKnot < this._indexKnotOrigin.knotIndex || abscissa > this._uMax) {
                this.throwRangeErrorMessage("isAbscissaCoincidingWithKnot", KnotSequences_2.EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE);
            }
        }
        return coincident;
    };
    IncreasingOpenKnotSequenceClosedCurve.prototype.getKnotMultiplicityAtSequenceOrigin = function () {
        var multiplicity = this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity;
        return multiplicity;
    };
    IncreasingOpenKnotSequenceClosedCurve.prototype.findSpan = function (u) {
        var e_4, _a;
        var index = KnotSequences_1.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if (u < KnotSequences_1.KNOT_SEQUENCE_ORIGIN || u > this._uMax) {
            this.throwRangeErrorMessage("findSpan", KnotSequences_2.EM_U_OUTOF_KNOTSEQ_RANGE);
        }
        else {
            if (this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                try {
                    for (var _b = __values(this.knotSequence), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var knot = _c.value;
                        index += knot.multiplicity;
                        if (Math.abs(u - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                            if (knot.abscissa === this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].abscissa
                                && this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].multiplicity === this._maxMultiplicityOrder) {
                                index -= this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].multiplicity;
                            }
                            else if (knot.abscissa === this._uMax) {
                                index -= knot.multiplicity;
                            }
                            if (this._isKnotMultiplicityUniform && index === (this.knotSequence.length - this._maxMultiplicityOrder + 1))
                                index -= 1;
                            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index - 1);
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
            var indexAtUmax = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            index = this.findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
        }
        return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
    };
    IncreasingOpenKnotSequenceClosedCurve.prototype.decrementMaxMultiplicityOrder = function () {
        var e_5, _a;
        var strictlyIncSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(this);
        var strictlyIncSeq_Mult = strictlyIncSeq.multiplicities();
        var knotIdx_maxMultiplicityOrder = [];
        for (var i = 0; i < strictlyIncSeq_Mult.length; i++) {
            if (strictlyIncSeq_Mult[i] === this._maxMultiplicityOrder)
                knotIdx_maxMultiplicityOrder.push(i);
        }
        try {
            for (var knotIdx_maxMultiplicityOrder_1 = __values(knotIdx_maxMultiplicityOrder), knotIdx_maxMultiplicityOrder_1_1 = knotIdx_maxMultiplicityOrder_1.next(); !knotIdx_maxMultiplicityOrder_1_1.done; knotIdx_maxMultiplicityOrder_1_1 = knotIdx_maxMultiplicityOrder_1.next()) {
                var multiplicity = knotIdx_maxMultiplicityOrder_1_1.value;
                strictlyIncSeq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(multiplicity), false);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (knotIdx_maxMultiplicityOrder_1_1 && !knotIdx_maxMultiplicityOrder_1_1.done && (_a = knotIdx_maxMultiplicityOrder_1.return)) _a.call(knotIdx_maxMultiplicityOrder_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        var newKnots = [];
        if (this._maxMultiplicityOrder > 2 || (this._maxMultiplicityOrder === 2 &&
            (knotIdx_maxMultiplicityOrder.length > 0 && knotIdx_maxMultiplicityOrder[0] !== this._indexKnotOrigin.knotIndex ||
                knotIdx_maxMultiplicityOrder.length === 0))) {
            // const newIncKnotSeq = strictlyIncSeq.toIncreasingKnotSequence();
            var newIncKnotSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC(strictlyIncSeq);
            newKnots = newIncKnotSeq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(newIncKnotSeq.length() - 2));
        }
        else {
            if (this._isSequenceUpToC0Discontinuity) {
                newKnots = new IncreasingOpenKnotSequenceClosedCurve(1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: strictlyIncSeq.allAbscissae }).allAbscissae;
            }
            else {
                newKnots = new IncreasingOpenKnotSequenceClosedCurve(1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: strictlyIncSeq.allAbscissae }).allAbscissae;
            }
        }
        if (this._isSequenceUpToC0Discontinuity) {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder - 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: newKnots });
        }
        else {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder - 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: newKnots });
        }
    };
    IncreasingOpenKnotSequenceClosedCurve.prototype.revertKnotSequence = function () {
        var newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    };
    IncreasingOpenKnotSequenceClosedCurve.prototype.decrementKnotMultiplicity1 = function (index, checkSequenceConsistency) {
        if (checkSequenceConsistency === void 0) { checkSequenceConsistency = true; }
        var newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicity(index, checkSequenceConsistency);
        return newKnotSequence;
    };
    return IncreasingOpenKnotSequenceClosedCurve;
}(AbstractIncreasingOpenKnotSequence_1.AbstractIncreasingOpenKnotSequence));
exports.IncreasingOpenKnotSequenceClosedCurve = IncreasingOpenKnotSequenceClosedCurve;
