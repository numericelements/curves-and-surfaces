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
exports.deepCopyIncreasingKnotSequenceOpenCurve = exports.IncreasingOpenKnotSequenceOpenCurve = void 0;
var KnotSequences_1 = require("../namedConstants/KnotSequences");
var AbstractIncreasingOpenKnotSequence_1 = require("./AbstractIncreasingOpenKnotSequence");
var KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var KnotSequences_2 = require("../namedConstants/KnotSequences");
var KnotSequences_3 = require("../ErrorMessages/KnotSequences");
var fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1 = require("./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var IncreasingOpenKnotSequenceOpenCurve = /** @class */ (function (_super) {
    __extends(IncreasingOpenKnotSequenceOpenCurve, _super);
    function IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, knotParameters) {
        var _this = _super.call(this, maxMultiplicityOrder, knotParameters) || this;
        if (knotParameters.type !== KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY)
            _this.checkOriginOfNormalizedBasis();
        _this.checkNonUniformKnotMultiplicityOrder();
        _this.checkUniformityOfKnotMultiplicity();
        _this.checkUniformityOfKnotSpacing();
        return _this;
    }
    IncreasingOpenKnotSequenceOpenCurve.prototype.checkNonUniformKnotMultiplicityOrder = function () {
        this._isKnotMultiplicityNonUniform = false;
        if (this.knotSequence[0].multiplicity === this._maxMultiplicityOrder &&
            this.knotSequence[this.knotSequence.length - 1].multiplicity === this._maxMultiplicityOrder)
            this._isKnotMultiplicityNonUniform = true;
    };
    IncreasingOpenKnotSequenceOpenCurve.prototype.clone = function () {
        if (this._isSequenceUpToC0Discontinuity) {
            return new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: this.allAbscissae });
        }
        else {
            return new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: this.allAbscissae });
        }
    };
    IncreasingOpenKnotSequenceOpenCurve.prototype.toKnotIndexStrictlyIncreasingSequence = function (index) {
        var e_1, _a;
        var strictlyIncreasingKnotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(this);
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
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
    };
    IncreasingOpenKnotSequenceOpenCurve.prototype.findSpan = function (u) {
        var e_2, _a;
        var index = KnotSequences_1.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if (u < KnotSequences_2.KNOT_SEQUENCE_ORIGIN || u > this._uMax) {
            this.throwRangeErrorMessage("findSpan", KnotSequences_3.EM_U_OUTOF_KNOTSEQ_RANGE);
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
                            var curveDegree = this._maxMultiplicityOrder - 1;
                            if (this.isKnotMultiplicityUniform && index === (this.knotSequence.length - curveDegree))
                                index -= 1;
                            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index - 1);
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
            index = this.findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
        }
        return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
    };
    IncreasingOpenKnotSequenceOpenCurve.prototype.revertKnotSequence = function () {
        var newKnotSequence = this.clone();
        // newKnotSequence.revertKnotSequence();
        return newKnotSequence;
    };
    return IncreasingOpenKnotSequenceOpenCurve;
}(AbstractIncreasingOpenKnotSequence_1.AbstractIncreasingOpenKnotSequence));
exports.IncreasingOpenKnotSequenceOpenCurve = IncreasingOpenKnotSequenceOpenCurve;
function deepCopyIncreasingKnotSequenceOpenCurve(knotSeq) {
    var abscissae = knotSeq.allAbscissae;
    return abscissae;
}
exports.deepCopyIncreasingKnotSequenceOpenCurve = deepCopyIncreasingKnotSequenceOpenCurve;
