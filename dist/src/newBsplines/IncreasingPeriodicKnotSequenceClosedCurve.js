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
exports.IncreasingPeriodicKnotSequenceClosedCurve = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var KnotSequences_1 = require("../namedConstants/KnotSequences");
var AbstractPeriodicKnotSequence_1 = require("./AbstractPeriodicKnotSequence");
var Knot_1 = require("./Knot");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1 = require("./KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence");
var KnotSequences_2 = require("../ErrorMessages/KnotSequences");
var KnotSequences_3 = require("../WarningMessages/KnotSequences");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
var IncreasingPeriodicKnotSequenceClosedCurve = /** @class */ (function (_super) {
    __extends(IncreasingPeriodicKnotSequenceClosedCurve, _super);
    function IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, knotParameters) {
        var _this = _super.call(this, maxMultiplicityOrder, knotParameters) || this;
        _this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0);
        if (knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE) {
            _this.generateKnotSequence(knotParameters);
            _this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
        }
        _this.checkUniformityOfKnotMultiplicity();
        _this.checkUniformityOfKnotSpacing();
        _this.checkNonUniformKnotMultiplicityOrder();
        _this.checkCurveOrigin();
        return _this;
    }
    Object.defineProperty(IncreasingPeriodicKnotSequenceClosedCurve.prototype, "allAbscissae", {
        get: function () {
            var e_1, _a;
            var abscissae = [];
            try {
                for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var knot = _c.value;
                    if (knot !== undefined)
                        abscissae.push(knot);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return abscissae;
        },
        enumerable: false,
        configurable: true
    });
    IncreasingPeriodicKnotSequenceClosedCurve.prototype[Symbol.iterator] = function () {
        var e_2, _a;
        var _this = this;
        var knotAmount = 0;
        var knotIndicesKnotAbscissaChange = [];
        try {
            for (var _b = __values(this.multiplicities()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var multiplicity = _c.value;
                knotAmount = knotAmount + multiplicity;
                knotIndicesKnotAbscissaChange.push(knotAmount);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var lastIndex = knotAmount - 1;
        var indexAbscissaChange = 0;
        var index = 0;
        return {
            next: function () {
                if (index <= lastIndex) {
                    if (index === knotIndicesKnotAbscissaChange[indexAbscissaChange]) {
                        indexAbscissaChange++;
                    }
                    index++;
                    return { value: _this.knotSequence[indexAbscissaChange].abscissa, done: false };
                }
                else {
                    index = 0;
                    return { done: true };
                }
            }
        };
    };
    IncreasingPeriodicKnotSequenceClosedCurve.prototype.clone = function () {
        return new IncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: this.allAbscissae });
    };
    IncreasingPeriodicKnotSequenceClosedCurve.prototype.length = function () {
        var e_3, _a;
        var length = 0;
        try {
            for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                var knot = _c.value;
                if (knot !== undefined)
                    length++;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return length;
    };
    IncreasingPeriodicKnotSequenceClosedCurve.prototype.knotIndexInputParamAssessment = function (index, methodName) {
        if (index.knotIndex < 0) {
            this.throwRangeErrorMessage(methodName, KnotSequences_2.EM_KNOTINDEX_INC_SEQ_NEGATIVE);
        }
        else if (index.knotIndex > (this.allAbscissae.length - 1)) {
            this.throwRangeErrorMessage(methodName, KnotSequences_2.EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        }
    };
    IncreasingPeriodicKnotSequenceClosedCurve.prototype.generateKnotSequence = function (knotParameters) {
        var minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotIncreasingValues(knotParameters.periodicKnots);
        this.knotSequence.push(new Knot_1.Knot(knotParameters.periodicKnots[0], 1));
        for (var i = 1; i < knotParameters.periodicKnots.length; i++) {
            if (knotParameters.periodicKnots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity++;
            }
            else {
                this.knotSequence.push(new Knot_1.Knot(knotParameters.periodicKnots[i], 1));
            }
        }
        this.checkMaxMultiplicityOrderConsistency();
        var cumulative_multiplicities = knotParameters.periodicKnots.length - this.knotSequence[this.knotSequence.length - 1].multiplicity;
        if ((cumulative_multiplicities < this._maxMultiplicityOrder && this._maxMultiplicityOrder > 1) ||
            (cumulative_multiplicities < (this._maxMultiplicityOrder + 1) && this._maxMultiplicityOrder === 1)) {
            this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_2.EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS);
        }
        this._uMax = this.knotSequence[this.knotSequence.length - 1].abscissa;
        this.checkCurveOrigin();
        this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
    };
    IncreasingPeriodicKnotSequenceClosedCurve.prototype.raiseKnotMultiplicity = function (index, multiplicity) {
        if (index.knotIndex < 0) {
            this.throwRangeErrorMessage("raiseKnotMultiplicity", KnotSequences_2.EM_KNOTINDEX_INC_SEQ_NEGATIVE);
        }
        var indexWithinPeriod = index.knotIndex % (this.knotSequence.length - 1);
        this.knotSequence[indexWithinPeriod].multiplicity += multiplicity;
        this.checkMaxMultiplicityOrderConsistency();
        if (indexWithinPeriod === 0)
            this.knotSequence[this.knotSequence.length - 1].multiplicity += multiplicity;
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    };
    IncreasingPeriodicKnotSequenceClosedCurve.prototype.knotMultiplicityAtAbscissa = function (abcissa) {
        var e_4, _a;
        var multiplicity = 0;
        try {
            for (var _b = __values(this.knotSequence), _c = _b.next(); !_c.done; _c = _b.next()) {
                var knot = _c.value;
                if (Math.abs(abcissa - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                    multiplicity = knot.multiplicity;
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
        if (multiplicity === 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "knotMultiplicityAtAbscissa", "knot abscissa cannot be found within the knot sequence.");
            warning.logMessage();
        }
        return multiplicity;
    };
    IncreasingPeriodicKnotSequenceClosedCurve.prototype.insertKnot = function (abscissa, multiplicity) {
        if (multiplicity === void 0) { multiplicity = 1; }
        var insertion = true;
        if (this.isAbscissaCoincidingWithKnot(abscissa)) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "insertKnot", KnotSequences_3.WM_ABSCISSA_TOO_CLOSE_TO_KNOT);
            warning.logMessage();
            insertion = false;
            return insertion;
        }
        else if (abscissa < this.knotSequence[0].abscissa) {
            this.throwRangeErrorMessage("insertKnot", KnotSequences_2.EM_KNOT_INSERTION_UNDER_SEQORIGIN);
        }
        else if (abscissa > this.knotSequence[this.knotSequence.length - 1].abscissa) {
            this.throwRangeErrorMessage("insertKnot", KnotSequences_2.EM_KNOT_INSERTION_OVER_UMAX);
        }
        this.maxMultiplicityOrderInputParamAssessment(multiplicity, "insertKnot");
        if (insertion) {
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            var i = 0;
            while (i < (this.knotSequence.length - 1)) {
                if (this.knotSequence[i].abscissa < abscissa && abscissa < this.knotSequence[i + 1].abscissa)
                    break;
                i++;
            }
            this.knotSequence.splice((i + 1), 0, knot);
            this.checkUniformityOfKnotSpacing();
            this.checkUniformityOfKnotMultiplicity();
            this.checkNonUniformKnotMultiplicityOrder();
        }
        return insertion;
    };
    IncreasingPeriodicKnotSequenceClosedCurve.prototype.abscissaAtIndex = function (index) {
        var e_5, _a;
        var abscissa = KnotSequences_1.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        var multLastKnot = this.knotSequence[this.knotSequence.length - 1].multiplicity;
        var indexPeriod = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex % (this.allAbscissae.length - multLastKnot));
        var i = 0;
        try {
            for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                var knot = _c.value;
                if (i === indexPeriod.knotIndex && knot !== undefined)
                    abscissa = knot;
                i++;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return abscissa;
    };
    IncreasingPeriodicKnotSequenceClosedCurve.prototype.toKnotIndexStrictlyIncreasingSequence = function (index) {
        var e_6, _a;
        var strictlyIncreasingKnotSequence = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(this);
        var lastIdxStrictIncSeq = strictlyIncreasingKnotSequence.allAbscissae.length - 1;
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
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        if (index.knotIndex > (this.allAbscissae.length - 1))
            i = i + lastIdxStrictIncSeq;
        return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
    };
    IncreasingPeriodicKnotSequenceClosedCurve.prototype.extractSubsetOfAbscissae = function (knotStart, knotEnd) {
        var knots = [];
        var sequence = this.allAbscissae.slice();
        var lasIndex = this.allAbscissae.length - 1;
        var multFirstKnot = this.knotSequence[0].multiplicity;
        if (knotEnd.knotIndex <= knotStart.knotIndex) {
            this.throwRangeErrorMessage("extractSubsetOfAbscissae", KnotSequences_2.EM_START_INDEX_OUTOF_RANGE);
        }
        if (knotStart.knotIndex > lasIndex) {
            this.throwRangeErrorMessage("extractSubsetOfAbscissae", KnotSequences_2.EM_START_INDEX_GREATER_THAN_END_INDEX);
        }
        if ((knotEnd.knotIndex - knotStart.knotIndex) > (2 * lasIndex)) {
            this.throwRangeErrorMessage("extractSubsetOfAbscissae", KnotSequences_2.EM_INDICES_SPAN_TWICE_PERIOD);
        }
        if (knotEnd.knotIndex > lasIndex) {
            for (var i = multFirstKnot; i < this.allAbscissae.length; i++) {
                sequence.push(this.allAbscissae[i] + this.allAbscissae[lasIndex]);
            }
        }
        if (knotEnd.knotIndex >= (2 * lasIndex)) {
            for (var i = multFirstKnot; i < this.allAbscissae.length; i++) {
                sequence.push(this.allAbscissae[i] + 2 * this.allAbscissae[lasIndex]);
            }
        }
        knots = sequence.slice(knotStart.knotIndex, knotEnd.knotIndex + 1);
        return knots;
    };
    IncreasingPeriodicKnotSequenceClosedCurve.prototype.findSpan = function (u) {
        var e_7, _a;
        var index = KnotSequences_1.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if (u > this.knotSequence[this.knotSequence.length - 1].abscissa) {
            u = u % this.getPeriod();
        }
        if (u < KnotSequences_1.KNOT_SEQUENCE_ORIGIN) {
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
                            if (knot.abscissa === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                                index -= this.knotSequence[this.knotSequence.length - 1].multiplicity;
                            }
                            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index - 1);
                        }
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
            index = this.findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(u);
            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
        }
        return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
    };
    IncreasingPeriodicKnotSequenceClosedCurve.prototype.revertKnotSequence = function () {
        var newKnotSequence = this.clone();
        // newKnotSequence.revertKnotSequence();
        return newKnotSequence;
    };
    return IncreasingPeriodicKnotSequenceClosedCurve;
}(AbstractPeriodicKnotSequence_1.AbstractPeriodicKnotSequence));
exports.IncreasingPeriodicKnotSequenceClosedCurve = IncreasingPeriodicKnotSequenceClosedCurve;
