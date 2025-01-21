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
exports.PeriodicBSplineR1toR1 = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var Vector2d_1 = require("../mathVector/Vector2d");
var AbstractBSplineR1toR1_1 = require("./AbstractBSplineR1toR1");
var BernsteinDecompositionR1toR1_1 = require("./BernsteinDecompositionR1toR1");
var BSplineR1toR1_1 = require("./BSplineR1toR1");
var BSplineR1toR2_1 = require("./BSplineR1toR2");
var IncreasingOpenKnotSequenceClosedCurve_1 = require("./IncreasingOpenKnotSequenceClosedCurve");
var KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
/**
 * A B-Spline function from a one dimensional real periodic space to a one dimensional real space
 */
var PeriodicBSplineR1toR1 = /** @class */ (function (_super) {
    __extends(PeriodicBSplineR1toR1, _super);
    function PeriodicBSplineR1toR1(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [0]; }
        if (knots === void 0) { knots = [0, 1]; }
        var _this = _super.call(this, controlPoints, knots) || this;
        var maxMultiplicityOrder = _this._degree + 1;
        // this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, knots);
        _this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        return _this;
    }
    Object.defineProperty(PeriodicBSplineR1toR1.prototype, "knots", {
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
    Object.defineProperty(PeriodicBSplineR1toR1.prototype, "increasingKnotSequence", {
        get: function () {
            return this._increasingKnotSequence;
        },
        enumerable: false,
        configurable: true
    });
    PeriodicBSplineR1toR1.prototype.bernsteinDecomposition = function () {
        var s = this.clone();
        var degree = this._degree;
        var newControlPoints = [];
        var newKnots = [];
        if (degree === 0) {
            newControlPoints = s.controlPoints;
            newKnots = s.knots;
        }
        else {
            s.clamp(s.knots[degree]);
            s.clamp(s.knots[s.knots.length - degree - 1]);
            var indexKnotOrigin = s._increasingKnotSequence.indexKnotOrigin;
            var lastIndex = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(s._increasingKnotSequence.length() - indexKnotOrigin.knotIndex - 1);
            newControlPoints = s.controlPoints.slice(indexKnotOrigin.knotIndex, s.controlPoints.length - indexKnotOrigin.knotIndex);
            // newKnots = s._increasingKnotSequence.extractSubsetOfAbscissae(indexKnotOrigin, lastIndex);
            var indexInc = this._increasingKnotSequence.toKnotIndexIncreasingSequence(indexKnotOrigin);
            newKnots = s._increasingKnotSequence.extractSubsetOfAbscissae(indexInc, lastIndex);
        }
        return new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(Piegl_Tiller_NURBS_Book_1.decomposeFunction(new BSplineR1toR1_1.BSplineR1toR1(newControlPoints, newKnots)));
    };
    PeriodicBSplineR1toR1.prototype.clone = function () {
        return new PeriodicBSplineR1toR1(this._controlPoints.slice(), this._increasingKnotSequence.allAbscissae.slice());
    };
    PeriodicBSplineR1toR1.prototype.derivative = function () {
        var newControlPoints = [];
        for (var i = 0; i < this._controlPoints.length - 1; i += 1) {
            var indexIncSeq1 = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + this._degree + 1);
            var indexStrictIncSeq1 = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq1);
            var indexIncSeq2 = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1);
            var indexStrictIncSeq2 = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq2);
            if (indexStrictIncSeq1.knotIndex !== indexStrictIncSeq2.knotIndex) {
                var newCtrlPt = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree /
                    (this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + this._degree + 1)) - this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1))));
                newControlPoints.push(newCtrlPt);
            }
        }
        var newKnots = this._increasingKnotSequence.decrementMaxMultiplicityOrder().allAbscissae;
        return new PeriodicBSplineR1toR1(newControlPoints, newKnots);
    };
    PeriodicBSplineR1toR1.prototype.getBasisFunctionSpanWithKnotMultiplicityEqualDegreePlusOne = function () {
        var spanWithMultiplicityDegreePlusOne = [];
        for (var i = 0; i < this._controlPoints.length - 1; i++) {
            spanWithMultiplicityDegreePlusOne.push(false);
            var indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1));
            var multiplicity = this.knotMultiplicity(indexStrictInc);
            if (multiplicity >= (this.degree + 1)) {
                spanWithMultiplicityDegreePlusOne[i - this.degree] = true;
            }
        }
        return spanWithMultiplicityDegreePlusOne;
    };
    PeriodicBSplineR1toR1.prototype.curve = function () {
        var x = this.grevilleAbscissae();
        var cp = [];
        for (var i = 0; i < x.length; i += 1) {
            cp.push(new Vector2d_1.Vector2d(x[i], this._controlPoints[i]));
        }
        return new BSplineR1toR2_1.BSplineR1toR2(cp, this._increasingKnotSequence.allAbscissae);
    };
    PeriodicBSplineR1toR1.prototype.evaluateOutsideRefInterval = function (u) {
        var result = 0.0;
        var knots = this.distinctKnots().slice();
        if (u >= knots[0] && u <= knots[knots.length - 1]) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Parameter value for evaluation is not outside the knot interval.");
            error.logMessage();
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Method not implemented yet.");
            error.logMessage();
        }
        return result;
    };
    return PeriodicBSplineR1toR1;
}(AbstractBSplineR1toR1_1.AbstractBSplineR1toR1));
exports.PeriodicBSplineR1toR1 = PeriodicBSplineR1toR1;
