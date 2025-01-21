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
exports.StrictlyIncreasingPeriodicKnotSequenceClosedCurve = void 0;
var KnotSequences_1 = require("../namedConstants/KnotSequences");
var AbstractPeriodicKnotSequence_1 = require("./AbstractPeriodicKnotSequence");
var Knot_1 = require("./Knot");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var KnotSequences_2 = require("../ErrorMessages/KnotSequences");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var StrictlyIncreasingPeriodicKnotSequenceClosedCurve = /** @class */ (function (_super) {
    __extends(StrictlyIncreasingPeriodicKnotSequenceClosedCurve, _super);
    function StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, knotsParameters) {
        var _this = _super.call(this, maxMultiplicityOrder, knotsParameters) || this;
        _this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0);
        if (knotsParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE) {
            _this.generateStrictlyIncreasingSequence(knotsParameters);
            _this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
        }
        _this.checkUniformityOfKnotMultiplicity();
        _this.checkUniformityOfKnotSpacing();
        _this.checkNonUniformKnotMultiplicityOrder();
        _this.checkCurveOrigin();
        return _this;
    }
    Object.defineProperty(StrictlyIncreasingPeriodicKnotSequenceClosedCurve.prototype, "allAbscissae", {
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
    StrictlyIncreasingPeriodicKnotSequenceClosedCurve.prototype[Symbol.iterator] = function () {
        var _this = this;
        var lastIndex = this.knotSequence.length - 1;
        var index = 0;
        return {
            next: function () {
                if (index <= lastIndex) {
                    var abscissa = _this.knotSequence[index].abscissa;
                    var multiplicity = _this.knotSequence[index].multiplicity;
                    index++;
                    return { value: { abscissa: abscissa, multiplicity: multiplicity }, done: false };
                }
                else {
                    index = 0;
                    return { done: true };
                }
            }
        };
    };
    StrictlyIncreasingPeriodicKnotSequenceClosedCurve.prototype.length = function () {
        return this.knotSequence.length;
    };
    StrictlyIncreasingPeriodicKnotSequenceClosedCurve.prototype.clone = function () {
        return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: this.distinctAbscissae(), multiplicities: this.multiplicities() });
    };
    StrictlyIncreasingPeriodicKnotSequenceClosedCurve.prototype.generateStrictlyIncreasingSequence = function (knotParameters) {
        var minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotStrictlyIncreasingValues(knotParameters.periodicKnots);
        for (var i = 0; i < knotParameters.periodicKnots.length; i++) {
            this.knotSequence.push(new Knot_1.Knot(knotParameters.periodicKnots[i], knotParameters.multiplicities[i]));
        }
        this.checkMaxMultiplicityOrderConsistency();
        var cumulative_multiplicities = this.knotSequence[0].multiplicity;
        for (var i = 1; i < this.knotSequence.length - 1; i++) {
            cumulative_multiplicities += this.knotSequence[i].multiplicity;
        }
        if ((cumulative_multiplicities < this._maxMultiplicityOrder && this._maxMultiplicityOrder > 1)
            || (cumulative_multiplicities < (this._maxMultiplicityOrder + 1) && this._maxMultiplicityOrder === 1)) {
            this.throwRangeErrorMessage("generateStrictlyIncreasingSequence", KnotSequences_2.EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS);
        }
        this._uMax = this.knotSequence[this.knotSequence.length - 1].abscissa;
        this.checkCurveOrigin();
        this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
    };
    StrictlyIncreasingPeriodicKnotSequenceClosedCurve.prototype.abscissaAtIndex = function (index) {
        var e_2, _a;
        var abscissa = KnotSequences_1.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        var indexPeriod = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index.knotIndex % (this.allAbscissae.length - 1));
        var i = 0;
        try {
            for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                var knot = _c.value;
                if (i === indexPeriod.knotIndex && knot !== undefined)
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
    StrictlyIncreasingPeriodicKnotSequenceClosedCurve.prototype.raiseKnotMultiplicity = function (index, multiplicity) {
        if (multiplicity === void 0) { multiplicity = 1; }
        var indexPeriod = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index.knotIndex % (this.allAbscissae.length - 1));
        if (indexPeriod.knotIndex < 0) {
            this.throwRangeErrorMessage("raiseKnotMultiplicity", KnotSequences_2.EM_KNOTINDEX_INC_SEQ_NEGATIVE);
        }
        var indexWithinPeriod = index.knotIndex % (this.knotSequence.length - 1);
        this.knotSequence[indexPeriod.knotIndex].multiplicity += multiplicity;
        if (indexWithinPeriod === 0)
            this.knotSequence[this.knotSequence.length - 1].multiplicity += multiplicity;
        this.checkMaxMultiplicityOrderConsistency();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
        return;
    };
    StrictlyIncreasingPeriodicKnotSequenceClosedCurve.prototype.findSpan = function (u) {
        var e_3, _a;
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
                        index++;
                        if (Math.abs(u - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                            if (knot.abscissa === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                                index = this.knotSequence.length - 1;
                            }
                            return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index - 1);
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            index = this.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u);
            return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index);
        }
        return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index);
    };
    StrictlyIncreasingPeriodicKnotSequenceClosedCurve.prototype.revertKnotSequence = function () {
        var newKnotSequence = this.clone();
        // newKnotSequence.revertKnotSequence();
        return newKnotSequence;
    };
    return StrictlyIncreasingPeriodicKnotSequenceClosedCurve;
}(AbstractPeriodicKnotSequence_1.AbstractPeriodicKnotSequence));
exports.StrictlyIncreasingPeriodicKnotSequenceClosedCurve = StrictlyIncreasingPeriodicKnotSequenceClosedCurve;
