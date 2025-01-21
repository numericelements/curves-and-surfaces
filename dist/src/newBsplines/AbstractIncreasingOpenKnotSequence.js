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
exports.AbstractIncreasingOpenKnotSequence = void 0;
var AbstractOpenKnotSequence_1 = require("./AbstractOpenKnotSequence");
var Knot_1 = require("./Knot");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var KnotSequences_1 = require("../ErrorMessages/KnotSequences");
var KnotSequences_2 = require("../namedConstants/KnotSequences");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var Knots_1 = require("../namedConstants/Knots");
var AbstractIncreasingOpenKnotSequence = /** @class */ (function (_super) {
    __extends(AbstractIncreasingOpenKnotSequence, _super);
    function AbstractIncreasingOpenKnotSequence(maxMultiplicityOrder, knotParameters) {
        var _this = _super.call(this, maxMultiplicityOrder, knotParameters) || this;
        _this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        _this._isSequenceUpToC0Discontinuity = false;
        if (knotParameters.type === KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE) {
            _this._indexKnotOrigin.knotIndex = _this._maxMultiplicityOrder - 1;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE) {
            _this._indexKnotOrigin.knotIndex = _this._maxMultiplicityOrder - 1;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE) {
            _this._indexKnotOrigin.knotIndex = _this._maxMultiplicityOrder - 1;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            _this._indexKnotOrigin.knotIndex = _this._maxMultiplicityOrder - 1;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY
            || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            if (knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS)
                _this._isSequenceUpToC0Discontinuity = true;
            _this.generateKnotSequence(knotParameters);
        }
        return _this;
    }
    Object.defineProperty(AbstractIncreasingOpenKnotSequence.prototype, "allAbscissae", {
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
    Object.defineProperty(AbstractIncreasingOpenKnotSequence.prototype, "indexKnotOrigin", {
        get: function () {
            return this._indexKnotOrigin;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractIncreasingOpenKnotSequence.prototype, "isSequenceUpToC0Discontinuity", {
        get: function () {
            return this._isSequenceUpToC0Discontinuity;
        },
        // temporary add setter while constructors of curve are set adequately
        set: function (isSequenceUpToC0Discontinuity) {
            this._isSequenceUpToC0Discontinuity = isSequenceUpToC0Discontinuity;
        },
        enumerable: false,
        configurable: true
    });
    AbstractIncreasingOpenKnotSequence.prototype[Symbol.iterator] = function () {
        var e_2, _a;
        var _this = this;
        var nbKnots = 0;
        var knotIndicesKnotAbscissaChange = [];
        try {
            for (var _b = __values(this.multiplicities()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var multiplicity = _c.value;
                nbKnots = nbKnots + multiplicity;
                knotIndicesKnotAbscissaChange.push(nbKnots);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var lastIndex = nbKnots - 1;
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
    AbstractIncreasingOpenKnotSequence.prototype.knotIndexInputParamAssessment = function (index, methodName) {
        if (index.knotIndex < 0) {
            this.throwRangeErrorMessage(methodName, KnotSequences_1.EM_KNOTINDEX_INC_SEQ_NEGATIVE);
        }
        else if (index.knotIndex > (this.allAbscissae.length - 1)) {
            this.throwRangeErrorMessage(methodName, KnotSequences_1.EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        }
    };
    AbstractIncreasingOpenKnotSequence.prototype.checkOriginOfNormalizedBasis = function () {
        var normalizedBasisAtStart = this.getKnotIndexNormalizedBasisAtSequenceStart();
        var abscissaOrigin = Knots_1.DEFAULT_KNOT_ABSCISSA_VALUE;
        if (normalizedBasisAtStart.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            abscissaOrigin = this.abscissaAtIndex(this.toKnotIndexIncreasingSequence(normalizedBasisAtStart.knot));
        }
        if (abscissaOrigin !== KnotSequences_2.KNOT_SEQUENCE_ORIGIN)
            this.throwRangeErrorMessage("checkOriginOfNormalizedBasis", KnotSequences_1.EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
    };
    AbstractIncreasingOpenKnotSequence.prototype.checkCurveOrigin = function () {
        var knotOrigin = this.getKnotIndexNormalizedBasisAtSequenceStart().knot;
        if (this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa !== KnotSequences_2.KNOT_SEQUENCE_ORIGIN || knotOrigin.knotIndex !== this.indexKnotOrigin.knotIndex) {
            this.throwRangeErrorMessage("checkCurveOrigin", KnotSequences_1.EM_KNOT_SEQUENCE_ORIGIN_INCONSISTENT);
        }
    };
    AbstractIncreasingOpenKnotSequence.prototype.generateKnotSequence = function (knotParameters) {
        var minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotIncreasingValues(knotParameters.knots);
        this.knotSequence.push(new Knot_1.Knot(knotParameters.knots[0], 1));
        for (var i = 1; i < knotParameters.knots.length; i++) {
            if (knotParameters.knots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity++;
            }
            else {
                this.knotSequence.push(new Knot_1.Knot(knotParameters.knots[i], 1));
            }
        }
        this.checkMaxMultiplicityOrderConsistency();
        this.checkSizeConsistency(knotParameters.knots);
        if (!this._isSequenceUpToC0Discontinuity)
            this.checkMaxKnotMultiplicityAtIntermediateKnots();
        var _a = this.getKnotIndicesBoundingNormalizedBasis(), normalizedBasisAtStart = _a.start, normalizedBasisAtEnd = _a.end;
        if (normalizedBasisAtEnd.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            this._uMax = this.abscissaAtIndex(this.toKnotIndexIncreasingSequence(normalizedBasisAtEnd.knot));
        }
        else if (normalizedBasisAtEnd.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.NotNormalized) {
            this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_1.EM_NOT_NORMALIZED_BASIS);
        }
        else if (normalizedBasisAtEnd.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_1.EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND);
        }
        if (normalizedBasisAtStart.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            this._indexKnotOrigin = normalizedBasisAtStart.knot;
        }
        else if (normalizedBasisAtStart.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.NotNormalized) {
            this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_1.EM_NOT_NORMALIZED_BASIS);
        }
        else if (normalizedBasisAtStart.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_1.EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
        }
        if (normalizedBasisAtEnd.knot.knotIndex <= normalizedBasisAtStart.knot.knotIndex)
            this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_1.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
    };
    AbstractIncreasingOpenKnotSequence.prototype.revertSequence = function () {
        var seq = this.clone();
        seq.revertKnotSequence();
        return seq.allAbscissae;
    };
    AbstractIncreasingOpenKnotSequence.prototype.checkSizeConsistency = function (knots) {
        var e_3, _a;
        var size = 0;
        try {
            for (var _b = __values(this.multiplicities()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var multiplicity = _c.value;
                size += multiplicity;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (size !== knots.length)
            this.throwRangeErrorMessage("checkSizeConsistency", KnotSequences_1.EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ);
    };
    AbstractIncreasingOpenKnotSequence.prototype.length = function () {
        var e_4, _a;
        var length = 0;
        try {
            for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                var knot = _c.value;
                if (knot !== undefined)
                    length++;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return length;
    };
    AbstractIncreasingOpenKnotSequence.prototype.abscissaAtIndex = function (index) {
        var e_5, _a;
        this.knotIndexInputParamAssessment(index, "abscissaAtIndex");
        var abscissa = KnotSequences_2.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        var i = 0;
        try {
            for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                var knot = _c.value;
                if (i === index.knotIndex && knot !== undefined)
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
    AbstractIncreasingOpenKnotSequence.prototype.extractSubsetOfAbscissae = function (knotStart, knotEnd) {
        var e_6, _a;
        var knots = [];
        if (!(knotStart.knotIndex >= 0) || !(knotEnd.knotIndex <= this.length() - 1) || !(knotStart.knotIndex <= knotEnd.knotIndex))
            this.throwRangeErrorMessage("extractSubsetOfAbscissae", KnotSequences_1.EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE);
        var index = 0;
        try {
            for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                var knot = _c.value;
                if (index >= knotStart.knotIndex && index <= knotEnd.knotIndex) {
                    if (knot !== undefined)
                        knots.push(knot);
                }
                index++;
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return knots;
    };
    return AbstractIncreasingOpenKnotSequence;
}(AbstractOpenKnotSequence_1.AbstractOpenKnotSequence));
exports.AbstractIncreasingOpenKnotSequence = AbstractIncreasingOpenKnotSequence;
