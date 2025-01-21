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
exports.BSplineR1toR1 = exports.KNOT_REMOVAL_TOLERANCE = void 0;
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
var Vector2d_1 = require("../mathVector/Vector2d");
var AbstractBSplineR1toR1_1 = require("./AbstractBSplineR1toR1");
var BernsteinDecompositionR1toR1_1 = require("./BernsteinDecompositionR1toR1");
var BSplineR1toR2_1 = require("./BSplineR1toR2");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var IncreasingOpenKnotSequenceOpenCurve_1 = require("./IncreasingOpenKnotSequenceOpenCurve");
var KnotSequences_1 = require("../namedConstants/KnotSequences");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var fromStrictlyIncreasingtToIncreasingKnotSequenceOC_1 = require("./KnotSequenceAndUtilities/fromStrictlyIncreasingtToIncreasingKnotSequenceOC");
var fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1 = require("./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
var Knots_1 = require("../namedConstants/Knots");
exports.KNOT_REMOVAL_TOLERANCE = 10e-5;
/**
 * A B-Spline function from a one dimensional real space to a one dimensional real space
 */
var BSplineR1toR1 = /** @class */ (function (_super) {
    __extends(BSplineR1toR1, _super);
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function BSplineR1toR1(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [0]; }
        if (knots === void 0) { knots = [0, 1]; }
        var _this = _super.call(this, controlPoints, knots) || this;
        var maxMultiplicityOrder = _this._degree + 1;
        // this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots});
        _this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
        return _this;
    }
    Object.defineProperty(BSplineR1toR1.prototype, "knots", {
        get: function () {
            return this._increasingKnotSequence.allAbscissae;
        },
        set: function (knots) {
            this._degree = this.computeDegree(knots.length);
            this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(this._degree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BSplineR1toR1.prototype, "increasingKnotSequence", {
        get: function () {
            return this._increasingKnotSequence;
        },
        enumerable: false,
        configurable: true
    });
    BSplineR1toR1.prototype.bernsteinDecomposition = function () {
        // Piegl_Tiller_NURBS_Book.ts
        return new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(Piegl_Tiller_NURBS_Book_1.decomposeFunction(this));
    };
    BSplineR1toR1.prototype.clone = function () {
        return new BSplineR1toR1(this._controlPoints.slice(), this._increasingKnotSequence.allAbscissae.slice());
    };
    BSplineR1toR1.prototype.derivative = function () {
        var e_1, _a;
        var newControlPoints = [];
        var knotIdx_MultDegPlusOne = [];
        // const strictlyIncSeq = this._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
        var strictlyIncSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(this._increasingKnotSequence);
        var strictlyIncSeq_Mult = strictlyIncSeq.multiplicities();
        for (var i = 0; i < strictlyIncSeq_Mult.length; i++) {
            if (strictlyIncSeq_Mult[i] === (this._degree + 1) && i !== 0 && i !== (strictlyIncSeq.length() - 1))
                knotIdx_MultDegPlusOne.push(i);
        }
        for (var i = 0; i < this._controlPoints.length - 1; i += 1) {
            var indexIncSeq1 = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + this._degree + 1);
            var indexStrictIncSeq1 = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq1);
            var indexIncSeq2 = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1);
            var indexStrictIncSeq2 = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq2);
            if (indexStrictIncSeq1.knotIndex !== indexStrictIncSeq2.knotIndex) {
                var newCtrlPt = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree /
                    (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq1) - this._increasingKnotSequence.abscissaAtIndex(indexIncSeq2)));
                newControlPoints.push(newCtrlPt);
            }
        }
        try {
            for (var knotIdx_MultDegPlusOne_1 = __values(knotIdx_MultDegPlusOne), knotIdx_MultDegPlusOne_1_1 = knotIdx_MultDegPlusOne_1.next(); !knotIdx_MultDegPlusOne_1_1.done; knotIdx_MultDegPlusOne_1_1 = knotIdx_MultDegPlusOne_1.next()) {
                var multiplicity = knotIdx_MultDegPlusOne_1_1.value;
                // strictlyIncSeq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(multiplicity));
                strictlyIncSeq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(multiplicity), false);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (knotIdx_MultDegPlusOne_1_1 && !knotIdx_MultDegPlusOne_1_1.done && (_a = knotIdx_MultDegPlusOne_1.return)) _a.call(knotIdx_MultDegPlusOne_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // const newIncKnotSeq = strictlyIncSeq.toIncreasingKnotSequence();
        var newIncKnotSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC_1.fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strictlyIncSeq);
        var newKnots = newIncKnotSeq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(newIncKnotSeq.length() - 2));
        // if(newKnots[0] !== 0.0) {
        //     const offset = newKnots[0];
        //     for(let i = 0; i < newKnots.length; i++) {
        //         newKnots[i] -= offset;
        //     }
        // }
        return new BSplineR1toR1(newControlPoints, newKnots);
    };
    /* JCL 2024/05/11 increase the degree of the spline while preserving its shape (Prautzsch algorithm) */
    BSplineR1toR1.prototype.degreeIncrement = function () {
        var intermSplKnotsAndCPs = this.generateIntermediateSplinesForDegreeElevation();
        var splineHigherDegree = new BSplineR1toR1(intermSplKnotsAndCPs.CPs[0], intermSplKnotsAndCPs.knotVectors[0]);
        for (var i = 1; i <= this._degree; i += 1) {
            var splineTemp = new BSplineR1toR1(intermSplKnotsAndCPs.CPs[i], intermSplKnotsAndCPs.knotVectors[i]);
            var j = 0, k = 0;
            while (j < splineHigherDegree._increasingKnotSequence.length()) {
                if (splineHigherDegree._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(j)) !== splineTemp._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(k))
                    && splineHigherDegree._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(j)) < splineTemp._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(k))) {
                    splineTemp.insertKnotBoehmAlgorithm(splineHigherDegree._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(j)), 1);
                }
                else if (splineHigherDegree._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(j)) !== splineTemp._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(k))
                    && splineHigherDegree._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(j)) > splineTemp._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(k))) {
                    splineHigherDegree.insertKnotBoehmAlgorithm(splineTemp.knots[k], 1);
                }
                j += 1;
                k += 1;
            }
            var tempCPs = [];
            for (var ind = 0; ind < splineHigherDegree.controlPoints.length; ind += 1) {
                tempCPs[ind] = splineHigherDegree.controlPoints[ind] + splineTemp.controlPoints[ind];
            }
            splineHigherDegree.controlPoints = tempCPs;
        }
        var tempHigherDegCP = [];
        for (var j = 0; j < splineHigherDegree.controlPoints.length; j += 1) {
            tempHigherDegCP[j] = splineHigherDegree.controlPoints[j] * (1 / (this.degree + 1));
        }
        splineHigherDegree.controlPoints = tempHigherDegCP;
        console.log("degreeIncrease: " + splineHigherDegree._increasingKnotSequence.allAbscissae);
        return new BSplineR1toR1(splineHigherDegree.controlPoints, splineHigherDegree._increasingKnotSequence.allAbscissae);
    };
    BSplineR1toR1.prototype.generateIntermediateSplinesForDegreeElevation = function () {
        var knotSequences = [];
        var controlPolygons = [];
        for (var i = 0; i <= this._degree; i += 1) {
            // let knotSequence = this._increasingKnotSequence.clone();
            var knotSequence = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(this._increasingKnotSequence.maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: this._increasingKnotSequence.allAbscissae });
            var controlPolygon = this._controlPoints.slice();
            var k = 0;
            for (var j = i; j < this._increasingKnotSequence.length(); j += this._degree + 1) {
                var indexStrctIncreasingSeq = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(j));
                knotSequence.raiseKnotMultiplicity(indexStrctIncreasingSeq, 1, false);
                if (j < this._controlPoints.length) {
                    var controlPoint = this._controlPoints[j];
                    controlPolygon.splice((j + k), 0, controlPoint);
                }
                k += 1;
            }
            knotSequences.push(knotSequence.allAbscissae);
            controlPolygons.push(controlPolygon);
        }
        return {
            knotVectors: knotSequences,
            CPs: controlPolygons
        };
    };
    BSplineR1toR1.prototype.insertKnotBoehmAlgorithm = function (u, times) {
        if (times === void 0) { times = 1; }
        // Uses Boehm algorithm without restriction on the structure of the knot sequence,
        //i.e. applicable to non uniform or arbitrary knot sequences
        if (times <= 0) {
            return;
        }
        var index = this.findSpanBoehmAlgorithm(u);
        if (u > this._increasingKnotSequence.abscissaAtIndex(index) && u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + 1))) {
            // if(times > )
        }
        var multiplicity = 0;
        if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
            && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
            multiplicity = this._increasingKnotSequence.knotMultiplicityAtAbscissa(this._increasingKnotSequence.abscissaAtIndex(index));
        }
        if ((multiplicity + times) > (this._degree + 1)) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "The number of times the knot should be inserted is incompatible with the curve degree.");
            console.log("u = ", u, " multiplicity + times = ", (multiplicity + times));
            error.logMessage();
            return;
        }
        var indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        var newIndexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        for (var t = 0; t < times; t += 1) {
            var newControlPoints = [];
            for (var i = 0; i < index.knotIndex; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            var subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
            for (var i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                var offset = index.knotIndex - this._degree + 1;
                // let alpha = (u - this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i)))
                // / (this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i + this._degree)) - this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i)));
                var alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                newControlPoints[i] = this._controlPoints[i - 1] * (1 - alpha) + this._controlPoints[i] * (alpha);
            }
            for (var i = index.knotIndex - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            if (multiplicity > 0) {
                this._increasingKnotSequence.raiseKnotMultiplicity(indexStrictInc, 1);
            }
            else if (multiplicity === 0 && t === 0) {
                this._increasingKnotSequence.insertKnot(u, 1);
                var newIndex = this._increasingKnotSequence.findSpan(u);
                newIndexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
            }
            else {
                this._increasingKnotSequence.raiseKnotMultiplicity(newIndexStrictInc, 1);
            }
            // this._knots.splice(index + 1, 0, u);
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index.knotIndex += 1;
        }
    };
    BSplineR1toR1.prototype.findSpanBoehmAlgorithm = function (u) {
        // Special case
        if (u === this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - this._degree - 1))) {
            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - this._degree - 2);
        }
        // Do binary search
        var low = 0;
        var high = this._increasingKnotSequence.length() - 1 - this._degree;
        var i = Math.floor((low + high) / 2);
        while (!(this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i)) <= u && u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1)))) {
            if (u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i))) {
                high = i;
            }
            else {
                low = i;
            }
            i = Math.floor((low + high) / 2);
        }
        return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
    };
    BSplineR1toR1.prototype.elevateDegree = function (times) {
        if (times === void 0) { times = 1; }
        var bds = this.bernsteinDecomposition();
        bds.elevateDegree();
        var knots = this.distinctKnots();
        var newSpline = BernsteinDecompositionR1toR1_1.splineRecomposition(bds, knots);
        for (var i = 0; i < knots.length; i += 1) {
            var m = this.knotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(this._increasingKnotSequence.findSpan(knots[i])));
            for (var j = 0; j < newSpline.degree - m - 1; j += 1) {
                newSpline.removeKnot(newSpline.increasingKnotSequence.findSpan(newSpline.knots[i]).knotIndex);
            }
        }
        this.controlPoints = newSpline.controlPoints;
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(newSpline.degree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: newSpline.knots });
        this._degree = newSpline.degree;
    };
    BSplineR1toR1.prototype.removeKnot = function (indexFromFindSpan, tolerance) {
        //Piegl and Tiller, The NURBS book, p : 185
        if (tolerance === void 0) { tolerance = exports.KNOT_REMOVAL_TOLERANCE; }
        var index = indexFromFindSpan;
        // end knots are not removed
        // if (index > this._degree && index < this._knots.length - this._degree - 1) {
        if (index > this._degree && index < this._increasingKnotSequence.length() - this._degree - 1) {
            throw new Error("index out of range");
        }
        var indexIncSeq = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
        var multiplicity = this.knotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        var last = index - multiplicity;
        var first = index - this.degree;
        var offset = first - 1;
        var local = [];
        local[0] = this.controlPoints[offset];
        local[last + 1 - offset] = this.controlPoints[last + 1];
        var i = first;
        var j = last;
        var ii = 1;
        var jj = last - offset;
        var removable = false;
        var subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(first), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(last + this.degree + 1));
        // Compute new control points for one removal step
        var offset_i = first;
        while (j > i) {
            var offset_j = last;
            var alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i]) / (subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            var alpha_j = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[j - offset_j]) / (subSequence[j + this.degree + 1 - offset_j] - subSequence[j - offset_j]);
            local[ii] = (this.controlPoints[i] - (local[ii - 1] * (1.0 - alpha_i))) / alpha_i;
            local[jj] = (this.controlPoints[j] - (local[jj + 1] * (alpha_j))) / (1.0 - alpha_j);
            ++i;
            ++ii;
            --j;
            --jj;
        }
        if (j < i) {
            if ((local[ii - 1] - (local[jj + 1])) <= tolerance) {
                removable = true;
            }
        }
        else {
            var alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i]) / (subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            if (((this.controlPoints[i] - (local[ii + 1] * (alpha_i))) + (local[ii - 1] * (1.0 - alpha_i))) <= tolerance) {
                removable = true;
            }
        }
        if (!removable)
            return;
        else {
            var indInc = first;
            var indDec = last;
            while (indDec > indInc) {
                this.controlPoints[indInc] = local[indInc - offset];
                this.controlPoints[indDec] = local[indDec - offset];
                ++indInc;
                --indDec;
            }
        }
        this._increasingKnotSequence.decrementKnotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        var fout = (2 * index - multiplicity - this.degree) / 2;
        this._controlPoints.splice(fout, 1);
    };
    BSplineR1toR1.prototype.moveControlPoint = function (i, delta) {
        if (i < 0 || i >= this.controlPoints.length) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "moveControlPoint", "Control point index is out of range.");
            error.logMessage();
            return;
        }
        this.controlPoints[i] += delta;
    };
    BSplineR1toR1.prototype.convertTocurve = function () {
        var x = this.grevilleAbscissae();
        var cp = [];
        for (var i = 0; i < x.length; i += 1) {
            cp.push(new Vector2d_1.Vector2d(x[i], this._controlPoints[i]));
        }
        return new BSplineR1toR2_1.BSplineR1toR2(cp, this._increasingKnotSequence.allAbscissae);
    };
    BSplineR1toR1.prototype.evaluateOutsideRefInterval = function (u) {
        var result;
        var spline = this.clone();
        var knots = spline.distinctKnots().slice();
        if (u >= knots[0] && u <= knots[knots.length - 1]) {
            result = 0.0;
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Parameter value for evaluation is not outside the knot interval.");
            error.logMessage();
        }
        else {
            var extendedSpline = spline.extend(u);
            if (u < knots[0]) {
                result = extendedSpline.evaluate(0.0);
            }
            else {
                result = extendedSpline.evaluate(knots[knots.length - 1]);
            }
        }
        return result;
    };
    BSplineR1toR1.prototype.extend = function (uAbsc) {
        var result = new BSplineR1toR1();
        var knots = this.distinctKnots().slice();
        if (uAbsc >= knots[0] && uAbsc <= knots[knots.length - 1]) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "extend", "Parameter value for extension is not outside the knot interval.");
            error.logMessage();
        }
        else {
            var tempCurve = this.clone();
            var reversed = false;
            var u = void 0;
            if (uAbsc > knots[knots.length - 1]) {
                tempCurve = this.revertCurve();
                u = knots[knots.length - 1] - uAbsc;
                reversed = true;
            }
            else {
                u = uAbsc;
            }
            var tempCtrlPoly = tempCurve._controlPoints;
            var tempKnots = tempCurve._increasingKnotSequence.allAbscissae;
            var vertices = [];
            for (var i = 1; i < this._degree + 1; i++) {
                var controlPolygon = [];
                controlPolygon.push(tempCtrlPoly[i]);
                var u1 = (tempKnots[this._degree + i] - u) / (tempKnots[this._degree + i] - tempKnots[0]);
                var u2 = (u - tempKnots[0]) / (tempKnots[this._degree + i] - tempKnots[0]);
                var vertex = tempCtrlPoly[i - 1] * u1 + tempCtrlPoly[i] * u2;
                controlPolygon.splice(0, 0, vertex);
                for (var j = 1; j < i; j++) {
                    var u1_1 = (tempKnots[this._degree + i - j] - u) / (tempKnots[this._degree + i - j] - tempKnots[0]);
                    var u2_1 = (u - tempKnots[0]) / (tempKnots[this._degree + i - j] - tempKnots[0]);
                    var vertex_1 = vertices[i - 2][vertices[i - 2].length - 1 - j] * u1_1 + controlPolygon[0] * u2_1;
                    controlPolygon.splice(0, 0, vertex_1);
                }
                vertices.push(controlPolygon);
            }
            for (var k = 0; k < this._degree + 1; k++) {
                tempCtrlPoly[k] = vertices[vertices.length - 1][k];
                tempKnots[k] = u;
            }
            // const intervalSpan = tempKnots[tempKnots.length - 1] - tempKnots[0];
            var offset = tempKnots[0];
            for (var i = 0; i < tempKnots.length; i++) {
                // tempKnots[i] = tempKnots[tempKnots.length - 1] - (tempKnots[tempKnots.length - 1] - tempKnots[i]) / intervalSpan;
                tempKnots[i] = tempKnots[i] - offset;
            }
            result = new BSplineR1toR1(tempCtrlPoly, tempKnots);
            if (reversed)
                result = result.revertCurve();
        }
        return result;
    };
    BSplineR1toR1.prototype.revertCurve = function () {
        var vertices = [];
        for (var i = 0; i < this._controlPoints.length; i++) {
            vertices.push(this._controlPoints[this._controlPoints.length - 1 - i]);
        }
        var result = new BSplineR1toR1(vertices, this._increasingKnotSequence.revertSequence());
        return result;
    };
    return BSplineR1toR1;
}(AbstractBSplineR1toR1_1.AbstractBSplineR1toR1));
exports.BSplineR1toR1 = BSplineR1toR1;
