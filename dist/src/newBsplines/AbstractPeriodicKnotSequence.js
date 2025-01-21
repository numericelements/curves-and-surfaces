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
exports.AbstractPeriodicKnotSequence = void 0;
var AbstractKnotSequence_1 = require("./AbstractKnotSequence");
var Knot_1 = require("./Knot");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var KnotSequences_1 = require("../ErrorMessages/KnotSequences");
var KnotSequences_2 = require("../namedConstants/KnotSequences");
var AbstractPeriodicKnotSequence = /** @class */ (function (_super) {
    __extends(AbstractPeriodicKnotSequence, _super);
    function AbstractPeriodicKnotSequence(maxMultiplicityOrder, knotParameters) {
        var _this = _super.call(this, maxMultiplicityOrder) || this;
        _this._isKnotMultiplicityNonUniform = false;
        _this.knotSequence = [];
        _this._uMax = KnotSequences_2.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if (knotParameters.type === KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE) {
            _this.computeKnotSequenceFromMaxMultiplicityOrder();
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE) {
            _this.computeUniformKnotSequenceFromBsplBasisSize(knotParameters);
        }
        return _this;
    }
    Object.defineProperty(AbstractPeriodicKnotSequence.prototype, "uMax", {
        get: function () {
            return this._uMax;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractPeriodicKnotSequence.prototype, "isKnotMultiplicityNonUniform", {
        get: function () {
            return this._isKnotMultiplicityNonUniform;
        },
        enumerable: false,
        configurable: true
    });
    AbstractPeriodicKnotSequence.prototype.checkNonUniformKnotMultiplicityOrder = function () {
        this._isKnotMultiplicityNonUniform = false;
    };
    AbstractPeriodicKnotSequence.prototype.checkCurveOrigin = function () {
        if (this.knotSequence[0].abscissa !== 0.0) {
            this.throwRangeErrorMessage('checkCurveOrigin', KnotSequences_1.EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
        }
    };
    AbstractPeriodicKnotSequence.prototype.getPeriod = function () {
        return this.knotSequence[this.knotSequence.length - 1].abscissa - this.knotSequence[0].abscissa;
    };
    AbstractPeriodicKnotSequence.prototype.lastKnot = function () {
        return this.knotSequence[this.knotSequence.length - 1].abscissa;
    };
    AbstractPeriodicKnotSequence.prototype.length = function () {
        return this.knotSequence.length;
    };
    AbstractPeriodicKnotSequence.prototype.checkKnotMultiplicitiesAtNormalizedBasisBoundaries = function () {
        if (this.knotSequence[0].multiplicity !== this.knotSequence[this.knotSequence.length - 1].multiplicity) {
            this.throwRangeErrorMessage("checkKnotMultiplicitiesAtNormalizedBasisBoundaries", KnotSequences_1.EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER);
        }
    };
    AbstractPeriodicKnotSequence.prototype.isAbscissaCoincidingWithKnot = function (abscissa) {
        if (abscissa < KnotSequences_2.KNOT_SEQUENCE_ORIGIN || abscissa > this._uMax) {
            this.throwRangeErrorMessage("isAbscissaCoincidingWithKnot", KnotSequences_1.EM_U_OUTOF_KNOTSEQ_RANGE);
        }
        return _super.prototype.isAbscissaCoincidingWithKnot.call(this, abscissa);
    };
    AbstractPeriodicKnotSequence.prototype.computeKnotSequenceFromMaxMultiplicityOrder = function () {
        var minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        var upperBound = this._maxMultiplicityOrder + 1;
        if (this._maxMultiplicityOrder === 1)
            upperBound = this._maxMultiplicityOrder + 2;
        for (var i = 0; i < upperBound; i++) {
            this.knotSequence.push(new Knot_1.Knot(i, 1));
        }
        this._uMax = this._maxMultiplicityOrder + 1;
    };
    AbstractPeriodicKnotSequence.prototype.computeUniformKnotSequenceFromBsplBasisSize = function (knotParameters) {
        var minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputBspBasisSizeAssessment(knotParameters);
        for (var i = 0; i < knotParameters.BsplBasisSize; i++) {
            this.knotSequence.push(new Knot_1.Knot(i, 1));
        }
        this._uMax = this.knotSequence[this.knotSequence.length - 1].abscissa;
    };
    AbstractPeriodicKnotSequence.prototype.decrementKnotMultiplicity = function (index) {
        var e_1, _a;
        this.strictlyIncKnotIndexInputParamAssessment(index, "decrementKnotMultiplicity");
        if (this.knotSequence[index.knotIndex].multiplicity === 1) {
            if (index.knotIndex === 0 || index.knotIndex === this.knotSequence.length - 1) {
                this.throwRangeErrorMessage("decrementKnotMultiplicity", KnotSequences_1.EM_SEQUENCE_ORIGIN_REMOVAL);
            }
            var abscissae = this.distinctAbscissae();
            var multiplicities = this.multiplicities();
            abscissae.splice(index.knotIndex, 1);
            multiplicities.splice(index.knotIndex, 1);
            this.knotSequence = [];
            var i = 0;
            try {
                for (var abscissae_1 = __values(abscissae), abscissae_1_1 = abscissae_1.next(); !abscissae_1_1.done; abscissae_1_1 = abscissae_1.next()) {
                    var abscissa = abscissae_1_1.value;
                    var knot = new Knot_1.Knot(abscissa, multiplicities[i]);
                    this.knotSequence.push(knot);
                    i++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (abscissae_1_1 && !abscissae_1_1.done && (_a = abscissae_1.return)) _a.call(abscissae_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            this.knotSequence[index.knotIndex].multiplicity--;
            if (index.knotIndex === 0) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity--;
            }
            else if (index.knotIndex === (this.knotSequence.length - 1)) {
                this.knotSequence[0].multiplicity--;
            }
        }
        this.checkUniformityOfKnotSpacing();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    };
    return AbstractPeriodicKnotSequence;
}(AbstractKnotSequence_1.AbstractKnotSequence));
exports.AbstractPeriodicKnotSequence = AbstractPeriodicKnotSequence;
