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
exports.create_BSplineR1toR2V2d = exports.create_BSplineR1toR2 = exports.BSplineR1toR2 = void 0;
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
var Vector2d_1 = require("../mathVector/Vector2d");
var AbstractBSplineR1toR2_1 = require("./AbstractBSplineR1toR2");
var BSplineR1toR1_1 = require("./BSplineR1toR1");
var BernsteinDecompositionR1toR1_1 = require("./BernsteinDecompositionR1toR1");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var IncreasingOpenKnotSequenceOpenCurve_1 = require("./IncreasingOpenKnotSequenceOpenCurve");
var KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1 = require("./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
var BSplineR1toR2 = /** @class */ (function (_super) {
    __extends(BSplineR1toR2, _super);
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function BSplineR1toR2(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector2d_1.Vector2d(0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        var _this = _super.call(this, controlPoints, knots) || this;
        var maxMultiplicityOrder = _this._degree + 1;
        _this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        _this.constructorInputParamAssessment(controlPoints, knots);
        return _this;
    }
    Object.defineProperty(BSplineR1toR2.prototype, "knots", {
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
    Object.defineProperty(BSplineR1toR2.prototype, "increasingKnotSequence", {
        get: function () {
            return this._increasingKnotSequence;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BSplineR1toR2.prototype, "freeControlPoints", {
        get: function () {
            return this.controlPoints;
        },
        enumerable: false,
        configurable: true
    });
    BSplineR1toR2.prototype.constructorInputParamAssessment = function (controlPoints, knots) {
        var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor");
        var invalid = false;
        if ((knots.length - controlPoints.length) < (this._degree + 1)) {
            error.addMessage("Inconsistent numbers of control points. Not enough control points to define a basis of B-Splines");
            invalid = true;
        }
        else if ((knots.length - controlPoints.length) !== (this._degree + 1)) {
            error.addMessage("Inconsistent numbers of knots and control points.");
            invalid = true;
        }
        if (invalid) {
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    };
    // protected override factory(controlPoints: readonly Vector2d[] = [new Vector2d(0, 0)], knots: readonly number[] = [0, 1]) {
    BSplineR1toR2.prototype.create = function (controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector2d_1.Vector2d(0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        return new BSplineR1toR2(controlPoints, knots);
    };
    /**
     * Return a deep copy of this b-spline
     */
    BSplineR1toR2.prototype.clone = function () {
        var cloneControlPoints = AbstractBSplineR1toR2_1.deepCopyControlPoints(this._controlPoints);
        return new BSplineR1toR2(cloneControlPoints, this.knots.slice());
    };
    BSplineR1toR2.prototype.optimizerStep = function (step) {
        for (var i = 0; i < this._controlPoints.length; i += 1) {
            this._controlPoints[i].x += step[i];
            this._controlPoints[i].y += step[i + this._controlPoints.length];
        }
    };
    BSplineR1toR2.prototype.elevateDegree = function (times) {
        if (times === void 0) { times = 1; }
        var sx = new BSplineR1toR1_1.BSplineR1toR1(this.getControlPointsX(), this.knots);
        var sy = new BSplineR1toR1_1.BSplineR1toR1(this.getControlPointsY(), this.knots);
        var bdsx = sx.bernsteinDecomposition();
        var bdsy = sy.bernsteinDecomposition();
        bdsx.elevateDegree();
        bdsy.elevateDegree();
        var knots = this.getDistinctKnots();
        var sxNew = BernsteinDecompositionR1toR1_1.splineRecomposition(bdsx, knots);
        var syNew = BernsteinDecompositionR1toR1_1.splineRecomposition(bdsy, knots);
        var newcp = [];
        for (var i = 0; i < sxNew.controlPoints.length; i += 1) {
            newcp.push(new Vector2d_1.Vector2d(sxNew.controlPoints[i], syNew.controlPoints[i]));
        }
        var newSpline = new BSplineR1toR2(newcp, sxNew.knots);
        for (var i = 0; i < knots.length; i += 1) {
            var m = this.knotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(this._increasingKnotSequence.findSpan(knots[i])));
            for (var j = 0; j < newSpline.degree - m - 1; j += 1) {
                newSpline.removeKnot(Piegl_Tiller_NURBS_Book_1.findSpan(newSpline.knots[i], newSpline.knots, newSpline.degree));
            }
        }
        this.controlPoints = newSpline.controlPoints;
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(newSpline.degree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: newSpline.knots });
        this._degree = newSpline.degree;
    };
    BSplineR1toR2.prototype.removeKnot = function (indexFromFindSpan, tolerance) {
        //Piegl and Tiller, The NURBS book, p : 185
        if (tolerance === void 0) { tolerance = BSplineR1toR1_1.KNOT_REMOVAL_TOLERANCE; }
        var index = indexFromFindSpan;
        // end knots are not removed
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
        // Compute new control point for one removal step
        var offset_i = first;
        while (j > i) {
            var offset_j = last;
            var alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i]) / (subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            var alpha_j = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[j - offset_j]) / (subSequence[j + this.degree + 1 - offset_j] - subSequence[j - offset_j]);
            local[ii] = (this.controlPoints[i].substract(local[ii - 1].multiply(1.0 - alpha_i))).multiply(1 / alpha_i);
            local[jj] = (this.controlPoints[j].substract(local[jj + 1].multiply(alpha_j))).multiply(1 / (1.0 - alpha_j));
            ++i;
            ++ii;
            --j;
            --jj;
        }
        if (j < i) {
            if ((local[ii - 1].substract(local[jj + 1])).norm() <= tolerance) {
                removable = true;
            }
        }
        else {
            var alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i]) / (subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            if (((this.controlPoints[i].substract((local[ii + 1].multiply(alpha_i)))).add(local[ii - 1].multiply(1.0 - alpha_i))).norm() <= tolerance) {
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
    /* JCL 2020/10/06 increase the degree of the spline while preserving its shape (Prautzsch algorithm) */
    BSplineR1toR2.prototype.degreeIncrement = function () {
        var intermSplKnotsAndCPs = this.generateIntermediateSplinesForDegreeElevation();
        var splineHigherDegree = new BSplineR1toR2(intermSplKnotsAndCPs.CPs[0], intermSplKnotsAndCPs.knotVectors[0]);
        for (var i = 1; i <= this._degree; i += 1) {
            // const strictIncSeq_splineHigherDegree = splineHigherDegree._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
            var strictIncSeq_splineHigherDegree = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(splineHigherDegree._increasingKnotSequence);
            var splineTemp = new BSplineR1toR2(intermSplKnotsAndCPs.CPs[i], intermSplKnotsAndCPs.knotVectors[i]);
            // const strictIncSeq_splineTemp = splineTemp._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
            var strictIncSeq_splineTemp = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(splineTemp._increasingKnotSequence);
            for (var j = 1; j < (strictIncSeq_splineHigherDegree.length() - 1); j++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(j);
                if (strictIncSeq_splineHigherDegree.knotMultiplicity(index) > strictIncSeq_splineTemp.knotMultiplicity(index))
                    splineTemp.insertKnotBoehmAlgorithm(strictIncSeq_splineTemp.abscissaAtIndex(index));
                if (strictIncSeq_splineHigherDegree.knotMultiplicity(index) < strictIncSeq_splineTemp.knotMultiplicity(index))
                    splineHigherDegree.insertKnotBoehmAlgorithm(strictIncSeq_splineHigherDegree.abscissaAtIndex(index));
            }
            var tempCPs = [];
            for (var ind = 0; ind < splineHigherDegree.controlPoints.length; ind += 1) {
                tempCPs[ind] = splineHigherDegree.controlPoints[ind].add(splineTemp.controlPoints[ind]);
            }
            splineHigherDegree.controlPoints = tempCPs;
        }
        var tempHigherDegCP = [];
        for (var j = 0; j < splineHigherDegree.controlPoints.length; j += 1) {
            tempHigherDegCP[j] = splineHigherDegree.controlPoints[j].multiply(1 / (this._degree + 1));
        }
        splineHigherDegree.controlPoints = tempHigherDegCP;
        console.log("degreeIncrease: " + splineHigherDegree._increasingKnotSequence.allAbscissae);
        return new BSplineR1toR2(splineHigherDegree.controlPoints, splineHigherDegree._increasingKnotSequence.allAbscissae);
    };
    BSplineR1toR2.prototype.generateIntermediateSplinesForDegreeElevation = function () {
        var knotSequences = [];
        var controlPolygons = [];
        for (var i = 0; i <= this._degree; i += 1) {
            // const knotSequence = this._increasingKnotSequence.clone();
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
    BSplineR1toR2.prototype.scale = function (factor) {
        var cp = [];
        this._controlPoints.forEach(function (element) {
            cp.push(element.multiply(factor));
        });
        return new BSplineR1toR2(cp, this.knots.slice());
    };
    BSplineR1toR2.prototype.scaleY = function (factor) {
        var cp = [];
        this._controlPoints.forEach(function (element) {
            cp.push(new Vector2d_1.Vector2d(element.x, element.y * factor));
        });
        return new BSplineR1toR2(cp, this.knots.slice());
    };
    BSplineR1toR2.prototype.scaleX = function (factor) {
        var cp = [];
        this._controlPoints.forEach(function (element) {
            cp.push(new Vector2d_1.Vector2d(element.x * factor, element.y));
        });
        return new BSplineR1toR2(cp, this.knots.slice());
    };
    BSplineR1toR2.prototype.toBSplineWithC0Discontinuity = function () {
        var controlPts = this._controlPoints;
        if (this._increasingKnotSequence.isSequenceUpToC0Discontinuity) {
            var knotSeq = this._increasingKnotSequence.clone();
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "toBSplineWithC0Continuity", "This curve can already describe C0 discontinuities at a current point.");
            warning.logMessage();
            return new BSplineR1toR2(controlPts, knotSeq.allAbscissae);
        }
        else {
            var newKnotSeq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve((this._degree + 1), { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: this._increasingKnotSequence.allAbscissae });
            // to be modified so that isSequenceUpToC0Discontinuity can be set to true
            // return new BSplineR1toR2(controlPts, newKnotSeq.allAbscissae);
            var newCurve = new BSplineR1toR2(controlPts, newKnotSeq.allAbscissae);
            newCurve.increasingKnotSequence.isSequenceUpToC0Discontinuity = true;
            return newCurve;
        }
    };
    BSplineR1toR2.prototype.extend = function (uAbsc) {
        var result = this.clone();
        var knots = this.getDistinctKnots();
        if (!this._increasingKnotSequence.isKnotMultiplicityNonUniform) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "extend", "The knot sequence of the input curve is not of type non uniform. The algorithm is not operating on this category of curve.");
            warning.logMessage();
        }
        else if (uAbsc >= knots[0] && uAbsc <= knots[knots.length - 1]) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "extend", "Parameter value for extension is not outside the knot interval. No extension performed.");
            warning.logMessage();
        }
        else {
            if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(uAbsc)) {
                var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "extend", "The abscissae used to extend the curve is considered as similar to one of the end knots of curve knot sequence. However, the extension is performed.");
                warning.logMessage();
            }
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
            var tempKnots = tempCurve.increasingKnotSequence.allAbscissae;
            var vertices = [];
            for (var i = 1; i < this._degree + 1; i++) {
                var controlPolygon = [];
                controlPolygon.push(tempCtrlPoly[i]);
                var u1 = (tempKnots[this._degree + i] - u) / (tempKnots[this._degree + i] - tempKnots[0]);
                var u2 = (u - tempKnots[0]) / (tempKnots[this._degree + i] - tempKnots[0]);
                var vertex = tempCtrlPoly[i - 1].multiply(u1).add(tempCtrlPoly[i].multiply(u2));
                controlPolygon.splice(0, 0, vertex);
                for (var j = 1; j < i; j++) {
                    var u1_1 = (tempKnots[this._degree + i - j] - u) / (tempKnots[this._degree + i - j] - tempKnots[0]);
                    var u2_1 = (u - tempKnots[0]) / (tempKnots[this._degree + i - j] - tempKnots[0]);
                    var vertex_1 = vertices[i - 2][vertices[i - 2].length - 1 - j].multiply(u1_1).add(controlPolygon[0].multiply(u2_1));
                    controlPolygon.splice(0, 0, vertex_1);
                }
                vertices.push(controlPolygon);
            }
            for (var k = 0; k < this._degree + 1; k++) {
                tempCtrlPoly[k] = vertices[vertices.length - 1][k];
                tempKnots[k] = u;
            }
            var newKnots = Piegl_Tiller_NURBS_Book_1.resetKnotAbscissaeToOrigin(tempKnots);
            result = new BSplineR1toR2(tempCtrlPoly, newKnots);
            if (reversed)
                result = result.revertCurve();
        }
        return result;
    };
    BSplineR1toR2.prototype.splitAt = function (u, segmentLocation) {
        var result = this.toBSplineWithC0Discontinuity();
        // let result = this.clone();
        var knots = this.getDistinctKnots();
        if (result.increasingKnotSequence.isAbscissaCoincidingWithKnot(u)) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "splitAt", "Method not configured to split a curve at an existing knot");
            warning.logMessage();
        }
        else if (u < knots[0] || u > knots[knots.length - 1]) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "splitAt", "The abscissae used to split the curve is outside the knot sequence interval. No split performed.");
            warning.logMessage();
        }
        else {
            result.insertKnot(u, result._degree + 1);
            var knotSequence = result.knots;
            var newControlPolygon = [];
            var newKnots = [];
            var knotIndex = result._degree + 1;
            while (knotSequence[knotIndex] !== u && knotIndex < knotSequence.length) {
                knotIndex++;
            }
            var indexBound = knotIndex + result._degree + 1;
            if (segmentLocation === AbstractBSplineR1toR2_1.curveSegment.BEFORE) {
                for (var i = 0; i < knotIndex; i++) {
                    newControlPolygon.push(result._controlPoints[i]);
                }
                for (var i = 0; i < indexBound; i++) {
                    newKnots.push(result.knots[i]);
                }
                result = new BSplineR1toR2(newControlPolygon, newKnots);
            }
            else if (segmentLocation === AbstractBSplineR1toR2_1.curveSegment.AFTER) {
                for (var i = knotIndex; i < result._controlPoints.length; i++) {
                    newControlPolygon.push(result._controlPoints[i]);
                }
                for (var i = knotIndex; i < result.knots.length; i++) {
                    newKnots.push(result.knots[i]);
                }
                var updatedKnots = Piegl_Tiller_NURBS_Book_1.resetKnotAbscissaeToOrigin(newKnots);
                result = new BSplineR1toR2(newControlPolygon, updatedKnots);
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "splitAt", "undefined specification of curve interval to be extracted.");
                error.logMessage();
            }
        }
        return result;
    };
    BSplineR1toR2.prototype.evaluateOutsideRefInterval = function (u) {
        var result = new Vector2d_1.Vector2d();
        var spline = this.clone();
        var knots = spline.getDistinctKnots();
        if (u >= knots[0] && u <= knots[knots.length - 1]) {
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
    BSplineR1toR2.prototype.revertCurve = function () {
        var vertices = [];
        for (var i = 0; i < this._controlPoints.length; i++) {
            vertices.push(this._controlPoints[this._controlPoints.length - 1 - i]);
        }
        var result = new BSplineR1toR2(vertices, this._increasingKnotSequence.revertSequence());
        return result;
    };
    /**
     *
     * @param from Parametric position where the section start
     * @param to Parametric position where the section end
     * @return the BSpline_R1_to_R2 section
     */
    BSplineR1toR2.prototype.extract = function (from, to) {
        var e_1, _a, e_2, _b;
        // clone to be replaced by toBSplineWithC0Discontinuity
        var spline = this.toBSplineWithC0Discontinuity();
        // const spline = this.clone();
        // const strictIncSeq = spline._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
        var strictIncSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(spline._increasingKnotSequence);
        var newFromSpan = spline._degree;
        var newToSpan = spline._increasingKnotSequence.length() - 1;
        if (spline._increasingKnotSequence.isAbscissaCoincidingWithKnot(from)) {
            var i = 0;
            try {
                for (var strictIncSeq_1 = __values(strictIncSeq), strictIncSeq_1_1 = strictIncSeq_1.next(); !strictIncSeq_1_1.done; strictIncSeq_1_1 = strictIncSeq_1.next()) {
                    var knot = strictIncSeq_1_1.value;
                    if (knot !== undefined && Math.abs(from - knot.abscissa) < AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE)
                        break;
                    i++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (strictIncSeq_1_1 && !strictIncSeq_1_1.done && (_a = strictIncSeq_1.return)) _a.call(strictIncSeq_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var indexStrictIncSeq = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
            var mult = strictIncSeq.knotMultiplicity(indexStrictIncSeq);
            if (mult !== (this._degree + 1)) {
                spline.clamp(from);
                newFromSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(from, spline.knots, spline._degree);
            }
        }
        else {
            spline.clamp(from);
            newFromSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(from, spline.knots, spline._degree);
        }
        if (spline._increasingKnotSequence.isAbscissaCoincidingWithKnot(to)) {
            var i = 0;
            try {
                for (var strictIncSeq_2 = __values(strictIncSeq), strictIncSeq_2_1 = strictIncSeq_2.next(); !strictIncSeq_2_1.done; strictIncSeq_2_1 = strictIncSeq_2.next()) {
                    var knot = strictIncSeq_2_1.value;
                    if (knot !== undefined && Math.abs(to - knot.abscissa) < AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE)
                        break;
                    i++;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (strictIncSeq_2_1 && !strictIncSeq_2_1.done && (_b = strictIncSeq_2.return)) _b.call(strictIncSeq_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            var indexStrictIncSeq = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
            var mult = strictIncSeq.knotMultiplicity(indexStrictIncSeq);
            if (mult !== (this._degree + 1)) {
                spline.clamp(to);
                newToSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(to, spline.knots, spline._degree);
            }
        }
        else {
            spline.clamp(to);
            newToSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(to, spline.knots, spline._degree);
        }
        var newKnots = [];
        var newControlPoints = [];
        for (var i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline.knots[i]);
        }
        for (var i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector2d_1.Vector2d(spline._controlPoints[i].x, spline._controlPoints[i].y));
        }
        var knotSequence = Piegl_Tiller_NURBS_Book_1.resetKnotAbscissaeToOrigin(newKnots);
        return new BSplineR1toR2(newControlPoints, knotSequence);
    };
    return BSplineR1toR2;
}(AbstractBSplineR1toR2_1.AbstractBSplineR1toR2));
exports.BSplineR1toR2 = BSplineR1toR2;
function create_BSplineR1toR2(controlPoints, knots) {
    var e_3, _a;
    var newControlPoints = [];
    try {
        for (var controlPoints_1 = __values(controlPoints), controlPoints_1_1 = controlPoints_1.next(); !controlPoints_1_1.done; controlPoints_1_1 = controlPoints_1.next()) {
            var cp = controlPoints_1_1.value;
            newControlPoints.push(new Vector2d_1.Vector2d(cp[0], cp[1]));
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (controlPoints_1_1 && !controlPoints_1_1.done && (_a = controlPoints_1.return)) _a.call(controlPoints_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return new BSplineR1toR2(newControlPoints, knots);
}
exports.create_BSplineR1toR2 = create_BSplineR1toR2;
function create_BSplineR1toR2V2d(controlPoints, knots) {
    return new BSplineR1toR2(controlPoints, knots);
}
exports.create_BSplineR1toR2V2d = create_BSplineR1toR2V2d;
// export function convertToBsplR1_to_R2(spline: BSplineR1toR2): BSpline_R1_to_R2 {
//     return new BSpline_R1_to_R2(spline.controlPoints, spline.knots);
// }
