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
exports.StrictlyIncreasingOpenKnotSequenceClosedCurve = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var KnotSequences_1 = require("../namedConstants/KnotSequences");
var Knot_1 = require("./Knot");
var AbstractStrictlyIncreasingOpenKnotSequence_1 = require("./AbstractStrictlyIncreasingOpenKnotSequence");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1 = require("./StrictlyIncreasingPeriodicKnotSequenceClosedCurve");
var KnotSequences_2 = require("../ErrorMessages/KnotSequences");
var fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC_1 = require("./KnotSequenceAndUtilities/fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
var StrictlyIncreasingOpenKnotSequenceClosedCurve = /** @class */ (function (_super) {
    __extends(StrictlyIncreasingOpenKnotSequenceClosedCurve, _super);
    function StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, knotParameters) {
        var _this = _super.call(this, maxMultiplicityOrder, knotParameters) || this;
        if (knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE) {
            _this.computeKnotSequenceFromPeriodicKnotSequence(knotParameters);
        }
        // this._isSequenceOfDerivative = false;
        // The validity of the knot sequence should follow the given sequence of calls
        // to make sure that the sequence origin is correctly set first since it is used
        // when checking the degree consistency and knot multiplicities outside the effective curve interval
        _this.checkCurveOrigin();
        _this.checkMaxMultiplicityOrderConsistency();
        _this.checkKnotIntervalConsistency();
        _this.checkUniformityOfKnotSpacing();
        _this.checkUniformityOfKnotMultiplicity();
        _this.checkNonUniformKnotMultiplicityOrder();
        return _this;
    }
    Object.defineProperty(StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype, "periodicKnots", {
        // // freeKnots is an accessor available for B-Spline curves to obtain a subset of a knot sequence, associated with control points
        // // that can be available as a free parameter subset for some applications, e.g., optimization
        // // here it is the abscissa only that can be regarded as free parameters, their multiplicity order is not considered (care must be taken about this point)
        // get freeKnots(): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        //     const abscissae = this.periodicKnots.allAbscissae.slice(0, this.periodicKnots.allAbscissae.length - 2);
        //     const multiplicities: number[] = [];
        //     return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder - 1, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: abscissae, multiplicities: multiplicities});
        //     // const freeKnots = this.periodicKnots;
        //     // freeKnots.splice(0, 1);
        //     // freeKnots.splice(freeKnots.length - 1, 1);
        //     // return freeKnots;
        // }
        get: function () {
            var abscissae = [];
            var multiplicities = [];
            for (var i = this._indexKnotOrigin.knotIndex; i <= this.getKnotIndexNormalizedBasisAtSequenceEnd().knot.knotIndex; i++) {
                abscissae.push(this.knotSequence[i].abscissa);
                multiplicities.push(this.knotSequence[i].multiplicity);
            }
            return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder - 1, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: abscissae, multiplicities: multiplicities });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype, "isSequenceUpToC0Discontinuity", {
        get: function () {
            return this._isSequenceUpToC0Discontinuity;
        },
        enumerable: false,
        configurable: true
    });
    StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype.checkNonUniformKnotMultiplicityOrder = function () {
        this._isKnotMultiplicityNonUniform = false;
    };
    StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype.checkKnotIntervalConsistency = function () {
        if (this.knotSequence[0].multiplicity >= this._maxMultiplicityOrder && this.knotSequence[this.knotSequence.length - 1].multiplicity >= this._maxMultiplicityOrder)
            return;
        if (this.abscissaAtIndex(this._indexKnotOrigin) !== KnotSequences_1.KNOT_SEQUENCE_ORIGIN)
            this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
        var normalizedBasis = this.getKnotIndicesBoundingNormalizedBasis();
        var indexKnotOrigin = normalizedBasis.start.knot.knotIndex;
        var multiplicityAtOrigin = this.knotSequence[indexKnotOrigin].multiplicity;
        var indexEnd = normalizedBasis.end.knot.knotIndex;
        var i = 0;
        var cumulativeMultiplicity = 0;
        while ((indexKnotOrigin - i) !== 0) {
            var interval1 = this.knotSequence[indexEnd - i].abscissa - this.knotSequence[indexEnd - i - 1].abscissa;
            var multiplicity1 = this.knotSequence[indexEnd - (i + 1)].multiplicity;
            var interval2 = this.knotSequence[indexKnotOrigin - (i + 1)].abscissa - this.knotSequence[indexKnotOrigin - i].abscissa;
            var multiplicity2 = this.knotSequence[indexKnotOrigin - (i + 1)].multiplicity;
            if ((Math.abs(interval1 + interval2) > KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE || multiplicity1 !== multiplicity2) && (indexKnotOrigin - i) > 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
            }
            else if ((Math.abs(interval1 + interval2) > KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE || multiplicity1 < multiplicity2) && (indexKnotOrigin - i) === 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
            }
            if ((indexKnotOrigin - i) > 1) {
                cumulativeMultiplicity += multiplicity1;
            }
            else if (cumulativeMultiplicity + multiplicity2 + multiplicityAtOrigin !== this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_INCORRECT_MULTIPLICITY_AT_FIRST_KNOT);
            }
            i++;
        }
        i = 0;
        cumulativeMultiplicity = 0;
        while ((indexEnd + i) < (this.knotSequence.length - 1)) {
            var interval1 = this.knotSequence[indexKnotOrigin + (i + 1)].abscissa - this.knotSequence[indexKnotOrigin + i].abscissa;
            var multiplicity1 = this.knotSequence[indexKnotOrigin + (i + 1)].multiplicity;
            var interval2 = this.knotSequence[indexEnd + i].abscissa - this.knotSequence[indexEnd + (i + 1)].abscissa;
            var multiplicity2 = this.knotSequence[indexEnd + (i + 1)].multiplicity;
            if ((Math.abs(interval1 + interval2) > KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE || multiplicity1 !== multiplicity2) && (indexEnd + i) < (this.knotSequence.length - 2)) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
            }
            else if ((Math.abs(interval1 + interval2) > KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE || multiplicity1 < multiplicity2) && (indexEnd + i) === (this.knotSequence.length - 2)) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
            }
            if ((indexEnd + i) < (this.knotSequence.length - 2)) {
                cumulativeMultiplicity += multiplicity1;
            }
            else if (cumulativeMultiplicity + multiplicity2 + multiplicityAtOrigin !== this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_INCORRECT_MULTIPLICITY_AT_LAST_KNOT);
            }
            i++;
        }
    };
    StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype.constructorInputBspBasisSizeAssessment = function (knotParameters) {
        if (knotParameters.BsplBasisSize < this._maxMultiplicityOrder || (this._maxMultiplicityOrder === 2 && knotParameters.BsplBasisSize < (this._maxMultiplicityOrder + 1)))
            this.throwRangeErrorMessage("constructor", KnotSequences_2.EM_SIZENORMALIZED_BSPLINEBASIS);
    };
    StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype.computeKnotSequenceFromPeriodicKnotSequence = function (knotParameters) {
        var minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotStrictlyIncreasingValues(knotParameters.periodicKnots);
        if (this._maxMultiplicityOrder === 2 && knotParameters.periodicKnots.length < 3)
            this.throwRangeErrorMessage("constructor", KnotSequences_2.EM_SIZENORMALIZED_BSPLINEBASIS);
        if (this._maxMultiplicityOrder > 2) {
            if (knotParameters.periodicKnots.length <= (1 + this._maxMultiplicityOrder - knotParameters.multiplicities[0])) {
                var cumulative_multiplicities = 0;
                for (var i = 1; i < knotParameters.periodicKnots.length - 1; i++) {
                    cumulative_multiplicities += knotParameters.multiplicities[i];
                }
                if (cumulative_multiplicities < (this._maxMultiplicityOrder - knotParameters.multiplicities[0]))
                    this.throwRangeErrorMessage("constructor", KnotSequences_2.EM_SIZENORMALIZED_BSPLINEBASIS);
            }
        }
        var openSequence = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC_1.fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(this._maxMultiplicityOrder, knotParameters);
        var knots = openSequence.distinctAbscissae();
        var multiplicities = openSequence.multiplicities();
        for (var i = 0; i < knots.length; i++) {
            this.knotSequence.push(new Knot_1.Knot(knots[i], multiplicities[i]));
        }
        this._uMax = openSequence._uMax;
        this._indexKnotOrigin = openSequence._indexKnotOrigin;
    };
    StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype.getIndexKnotOrigin = function () {
        return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(this._indexKnotOrigin.knotIndex);
    };
    StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype.isAbscissaCoincidingWithKnot = function (abscissa) {
        var e_1, _a;
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
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (coincident) {
            if (indexCoincidentKnot < this._indexKnotOrigin.knotIndex || abscissa > this._uMax) {
                this.throwRangeErrorMessage("isAbscissaCoincidingWithKnot", KnotSequences_2.EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE);
            }
        }
        return coincident;
    };
    StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype.getKnotMultiplicityAtCurveOrigin = function () {
        var multiplicity = this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity;
        return multiplicity;
    };
    // This index transformation is not unique. The convention followed here is the assignment of the first index of the increasing
    // sequence where the abscissa at index (strictly increasing sequence) appears
    StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype.toKnotIndexIncreasingSequence = function (index) {
        this.strictlyIncKnotIndexInputParamAssessment(index, "toKnotIndexIncreasingSequence");
        var indexIncSeq = 0;
        for (var i = 0; i < index.knotIndex; i++) {
            indexIncSeq += this.knotSequence[i].multiplicity;
        }
        return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(indexIncSeq);
    };
    StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype.clone = function () {
        if (this._isSequenceUpToC0Discontinuity) {
            return new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: this.distinctAbscissae(), multiplicities: this.multiplicities() });
        }
        else {
            return new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: this.distinctAbscissae(), multiplicities: this.multiplicities() });
        }
    };
    StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype.findSpan = function (u) {
        var e_2, _a;
        var index = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        if (u < this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa || u > this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].abscissa) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside valid span");
            error.logMessage();
        }
        else {
            if (this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                try {
                    for (var _b = __values(this.knotSequence), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var knot = _c.value;
                        index++;
                        if (Math.abs(u - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                            if (knot.abscissa === this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].abscissa) {
                                index = this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1;
                            }
                            return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index - 1);
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
            }
            var indexAtUmax = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            index = this.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
            return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index);
        }
        return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index);
    };
    StrictlyIncreasingOpenKnotSequenceClosedCurve.prototype.revertKnotSequence = function () {
        var newKnotSequence = this.clone();
        // newKnotSequence.revertKnotSequence();
        return newKnotSequence;
    };
    return StrictlyIncreasingOpenKnotSequenceClosedCurve;
}(AbstractStrictlyIncreasingOpenKnotSequence_1.AbstractStrictlyIncreasingOpenKnotSequence));
exports.StrictlyIncreasingOpenKnotSequenceClosedCurve = StrictlyIncreasingOpenKnotSequenceClosedCurve;
