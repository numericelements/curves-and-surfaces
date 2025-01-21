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
exports.AbstractStrictlyIncreasingOpenKnotSequence = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var AbstractOpenKnotSequence_1 = require("./AbstractOpenKnotSequence");
var Knot_1 = require("./Knot");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var KnotSequences_1 = require("../ErrorMessages/KnotSequences");
var KnotSequences_2 = require("../namedConstants/KnotSequences");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var Knots_1 = require("../namedConstants/Knots");
var AbstractStrictlyIncreasingOpenKnotSequence = /** @class */ (function (_super) {
    __extends(AbstractStrictlyIncreasingOpenKnotSequence, _super);
    function AbstractStrictlyIncreasingOpenKnotSequence(maxMultiplicityOrder, knotParameters) {
        var _this = _super.call(this, maxMultiplicityOrder, knotParameters) || this;
        _this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        _this._isSequenceUpToC0Discontinuity = false;
        if (knotParameters.type === KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE) {
            _this._indexKnotOrigin.knotIndex = 0;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE) {
            _this._indexKnotOrigin.knotIndex = _this._maxMultiplicityOrder - 1;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE) {
            _this._indexKnotOrigin.knotIndex = _this._maxMultiplicityOrder - 1;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            _this._indexKnotOrigin.knotIndex = 0;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE || knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY ||
            knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS || knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            if (knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY || knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS)
                _this._isSequenceUpToC0Discontinuity = true;
            _this.generateKnotSequence(knotParameters);
        }
        return _this;
    }
    Object.defineProperty(AbstractStrictlyIncreasingOpenKnotSequence.prototype, "allAbscissae", {
        get: function () {
            var e_1, _a;
            var abscissae = [];
            try {
                for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var knot = _c.value;
                    if (knot !== undefined)
                        abscissae.push(knot.abscissa);
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
    Object.defineProperty(AbstractStrictlyIncreasingOpenKnotSequence.prototype, "indexKnotOrigin", {
        get: function () {
            return this._indexKnotOrigin;
        },
        enumerable: false,
        configurable: true
    });
    AbstractStrictlyIncreasingOpenKnotSequence.prototype[Symbol.iterator] = function () {
        var _this = this;
        var lastIndex = this.knotSequence.length - 1;
        var index = 0;
        return {
            next: function () {
                if (index <= lastIndex) {
                    var abscissa = _this.knotSequence[index].abscissa;
                    var multiplicity = _this.knotSequence[index].multiplicity;
                    index++;
                    return { value: { abscissa: abscissa, multiplicity: multiplicity },
                        done: false };
                }
                else {
                    index = 0;
                    return { done: true };
                }
            }
        };
    };
    AbstractStrictlyIncreasingOpenKnotSequence.prototype.checkKnotMultiplicities = function (multiplicities) {
        for (var i = 0; i < multiplicities.length; i++) {
            if (multiplicities[i] <= 0)
                this.throwRangeErrorMessage("checkKnotMultiplicities", KnotSequences_1.EM_KNOT_MULTIPLICITY_OUT_OF_RANGE);
        }
    };
    AbstractStrictlyIncreasingOpenKnotSequence.prototype.checkCurveOrigin = function () {
        var normalizedBasisAtStart = this.getKnotIndexNormalizedBasisAtSequenceStart();
        var abscissaOrigin = Knots_1.DEFAULT_KNOT_ABSCISSA_VALUE;
        if (normalizedBasisAtStart.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            abscissaOrigin = this.abscissaAtIndex(normalizedBasisAtStart.knot);
        }
        if (abscissaOrigin !== KnotSequences_2.KNOT_SEQUENCE_ORIGIN)
            this.throwRangeErrorMessage("checkOriginOfNormalizedBasis", KnotSequences_1.EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
    };
    AbstractStrictlyIncreasingOpenKnotSequence.prototype.generateKnotSequence = function (knotParameters) {
        var minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotStrictlyIncreasingValues(knotParameters.knots);
        this.checkKnotMultiplicities(knotParameters.multiplicities);
        for (var i = 0; i < knotParameters.knots.length; i++) {
            this.knotSequence.push(new Knot_1.Knot(knotParameters.knots[i], knotParameters.multiplicities[i]));
        }
        this.checkMaxMultiplicityOrderConsistency();
        if (!this._isSequenceUpToC0Discontinuity)
            this.checkMaxKnotMultiplicityAtIntermediateKnots();
        var _a = this.getKnotIndicesBoundingNormalizedBasis(), normalizedBasisAtStart = _a.start, normalizedBasisAtEnd = _a.end;
        if (normalizedBasisAtEnd.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            this._uMax = this.abscissaAtIndex(normalizedBasisAtEnd.knot);
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
        if (knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS || knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
            var periodicKnotLength = normalizedBasisAtEnd.knot.knotIndex - normalizedBasisAtStart.knot.knotIndex;
            if (this._maxMultiplicityOrder === 2 && periodicKnotLength < 3)
                this.throwRangeErrorMessage("constructor", KnotSequences_1.EM_SIZENORMALIZED_BSPLINEBASIS);
            if ((periodicKnotLength + 1) <= (1 + this._maxMultiplicityOrder - this.knotMultiplicity(this._indexKnotOrigin))) {
                var cumulative_multiplicities = 0;
                for (var i = this._indexKnotOrigin.knotIndex + 1; i < periodicKnotLength - 1; i++) {
                    cumulative_multiplicities += knotParameters.multiplicities[i];
                }
                if (cumulative_multiplicities < (this._maxMultiplicityOrder - this.knotMultiplicity(this._indexKnotOrigin)))
                    this.throwRangeErrorMessage("constructor", KnotSequences_1.EM_SIZENORMALIZED_BSPLINEBASIS);
            }
        }
    };
    AbstractStrictlyIncreasingOpenKnotSequence.prototype.revertSequence = function () {
        var seq = this.clone();
        seq.revertKnotSequence();
        return seq.distinctAbscissae();
    };
    AbstractStrictlyIncreasingOpenKnotSequence.prototype.length = function () {
        return this.knotSequence.length;
    };
    AbstractStrictlyIncreasingOpenKnotSequence.prototype.knotIndexInputParamAssessment = function (index, methodName) {
        if (index.knotIndex < 0) {
            this.throwRangeErrorMessage(methodName, KnotSequences_1.EM_KNOTINDEX_INC_SEQ_NEGATIVE);
        }
        else if (index.knotIndex > (this.allAbscissae.length - 1)) {
            this.throwRangeErrorMessage(methodName, KnotSequences_1.EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        }
    };
    AbstractStrictlyIncreasingOpenKnotSequence.prototype.abscissaAtIndex = function (index) {
        var e_2, _a;
        this.knotIndexInputParamAssessment(index, "abscissaAtIndex");
        var abscissa = KnotSequences_2.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        var i = 0;
        try {
            for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                var knot = _c.value;
                if (i === index.knotIndex && knot !== undefined)
                    abscissa = knot.abscissa;
                i++;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return abscissa;
    };
    AbstractStrictlyIncreasingOpenKnotSequence.prototype.incrementKnotMultiplicity = function (index, multiplicity) {
        if (multiplicity === void 0) { multiplicity = 1; }
        var increment = true;
        if (index.knotIndex < 0 || index.knotIndex > (this.knotSequence.length - 1)) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "incrementKnotMultiplicity", "the index parameter is out of range. Cannot increment knot multiplicity.");
            error.logMessage();
            increment = false;
        }
        else {
            this.knotSequence[index.knotIndex].multiplicity += multiplicity;
            this.checkMaxMultiplicityOrderConsistency();
        }
        return increment;
    };
    return AbstractStrictlyIncreasingOpenKnotSequence;
}(AbstractOpenKnotSequence_1.AbstractOpenKnotSequence));
exports.AbstractStrictlyIncreasingOpenKnotSequence = AbstractStrictlyIncreasingOpenKnotSequence;
