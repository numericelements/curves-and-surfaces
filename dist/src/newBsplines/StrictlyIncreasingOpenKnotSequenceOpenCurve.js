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
exports.StrictlyIncreasingOpenKnotSequenceOpenCurve = void 0;
var KnotSequences_1 = require("../namedConstants/KnotSequences");
var AbstractStrictlyIncreasingOpenKnotSequence_1 = require("./AbstractStrictlyIncreasingOpenKnotSequence");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var KnotSequences_2 = require("../ErrorMessages/KnotSequences");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var StrictlyIncreasingOpenKnotSequenceOpenCurve = /** @class */ (function (_super) {
    __extends(StrictlyIncreasingOpenKnotSequenceOpenCurve, _super);
    function StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, knotParameters) {
        var _this = _super.call(this, maxMultiplicityOrder, knotParameters) || this;
        _this.checkCurveOrigin();
        _this.checkMaxMultiplicityOrderConsistency();
        _this.checkNonUniformKnotMultiplicityOrder();
        _this.checkUniformityOfKnotMultiplicity();
        _this.checkUniformityOfKnotSpacing();
        return _this;
    }
    Object.defineProperty(StrictlyIncreasingOpenKnotSequenceOpenCurve.prototype, "isSequenceUpToC0Discontinuity", {
        get: function () {
            return this._isSequenceUpToC0Discontinuity;
        },
        set: function (value) {
            this._isSequenceUpToC0Discontinuity = value;
        },
        enumerable: false,
        configurable: true
    });
    StrictlyIncreasingOpenKnotSequenceOpenCurve.prototype.checkCurveOrigin = function () {
        if (this.knotSequence[0].abscissa !== KnotSequences_1.KNOT_SEQUENCE_ORIGIN && this._maxMultiplicityOrder === this.knotSequence[0].multiplicity) {
            this.throwRangeErrorMessage("checkCurveOrigin", KnotSequences_2.EM_INCONSISTENT_ORIGIN_NONUNIFORM_KNOT_SEQUENCE);
        }
        else if (this.knotSequence[0].abscissa !== KnotSequences_1.KNOT_SEQUENCE_ORIGIN) {
            _super.prototype.checkCurveOrigin.call(this);
        }
    };
    StrictlyIncreasingOpenKnotSequenceOpenCurve.prototype.checkNonUniformKnotMultiplicityOrder = function () {
        this._isKnotMultiplicityNonUniform = false;
        if (this.knotSequence[0].multiplicity === this._maxMultiplicityOrder &&
            this.knotSequence[this.knotSequence.length - 1].multiplicity === this._maxMultiplicityOrder)
            this._isKnotMultiplicityNonUniform = true;
    };
    StrictlyIncreasingOpenKnotSequenceOpenCurve.prototype.clone = function () {
        if (this._isSequenceUpToC0Discontinuity) {
            return new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: this.distinctAbscissae(), multiplicities: this.multiplicities() });
        }
        else {
            return new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: this.distinctAbscissae(), multiplicities: this.multiplicities() });
        }
    };
    StrictlyIncreasingOpenKnotSequenceOpenCurve.prototype.findSpan = function (u) {
        var e_1, _a;
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
                        index++;
                        if (Math.abs(u - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                            if (knot.abscissa === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                                index = this.knotSequence.length - 1;
                            }
                            return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index - 1);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            var indexAtUmax = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            index = this.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
            return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index);
        }
        return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index);
    };
    StrictlyIncreasingOpenKnotSequenceOpenCurve.prototype.revertKnotSequence = function () {
        var newKnotSequence = this.clone();
        // newKnotSequence.revertKnotSequence();
        return newKnotSequence;
    };
    return StrictlyIncreasingOpenKnotSequenceOpenCurve;
}(AbstractStrictlyIncreasingOpenKnotSequence_1.AbstractStrictlyIncreasingOpenKnotSequence));
exports.StrictlyIncreasingOpenKnotSequenceOpenCurve = StrictlyIncreasingOpenKnotSequenceOpenCurve;
