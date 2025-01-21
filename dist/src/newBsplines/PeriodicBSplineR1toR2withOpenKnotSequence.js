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
exports.create_PeriodicBSplineR1toR2 = exports.PeriodicBSplineR1toR2withOpenKnotSequence = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var Vector2d_1 = require("../mathVector/Vector2d");
var AbstractBSplineR1toR2_1 = require("./AbstractBSplineR1toR2");
var BernsteinDecompositionR1toR1_1 = require("./BernsteinDecompositionR1toR1");
var BSplineR1toR1_1 = require("./BSplineR1toR1");
var BSplineR1toR2_1 = require("./BSplineR1toR2");
var IncreasingOpenKnotSequenceClosedCurve_1 = require("./IncreasingOpenKnotSequenceClosedCurve");
var fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1 = require("./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC");
var KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
var fromIncreasingOpentoIncreasingPeriodicKnotSequence_1 = require("./KnotSequenceAndUtilities/fromIncreasingOpentoIncreasingPeriodicKnotSequence");
var PeriodicBSplineR1toR1_1 = require("./PeriodicBSplineR1toR1");
var PeriodicBSplineR1toR2_1 = require("./PeriodicBSplineR1toR2");
var Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
var KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
var KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
var Knots_1 = require("../namedConstants/Knots");
/**
 * A B-Spline function from a one dimensional real periodic space to a two dimensional real space
 */
var PeriodicBSplineR1toR2withOpenKnotSequence = /** @class */ (function (_super) {
    __extends(PeriodicBSplineR1toR2withOpenKnotSequence, _super);
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function PeriodicBSplineR1toR2withOpenKnotSequence(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector2d_1.Vector2d(0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        var _this = _super.call(this, controlPoints, knots) || this;
        var maxMultiplicityOrder = _this._degree + 1;
        _this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        return _this;
    }
    Object.defineProperty(PeriodicBSplineR1toR2withOpenKnotSequence.prototype, "knots", {
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
    Object.defineProperty(PeriodicBSplineR1toR2withOpenKnotSequence.prototype, "periodicControlPointsLength", {
        get: function () {
            // const indexOrigin = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(this._increasingKnotSequence.indexKnotOrigin);
            var indexOrigin = this._increasingKnotSequence.indexKnotOrigin;
            var multiplicityBoundary = this.knotMultiplicity(indexOrigin);
            if (multiplicityBoundary === (this._degree + 1)) {
                multiplicityBoundary--;
            }
            return this._controlPoints.length - this._degree + (multiplicityBoundary - 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PeriodicBSplineR1toR2withOpenKnotSequence.prototype, "freeControlPoints", {
        get: function () {
            var periodicControlPoints = [];
            for (var i = 0; i < this.periodicControlPointsLength; i += 1) {
                periodicControlPoints.push(this._controlPoints[i].clone());
            }
            return periodicControlPoints;
        },
        enumerable: false,
        configurable: true
    });
    // protected override factory(controlPoints: readonly Vector2d[] = [new Vector2d(0, 0)], knots: readonly number[] = [0, 1]) {
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.create = function (controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector2d_1.Vector2d(0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        return new PeriodicBSplineR1toR2withOpenKnotSequence(controlPoints, knots);
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.getClampSpline = function () {
        var s = this.clone();
        var degree = this._degree;
        s.clamp(s.knots[degree]);
        s.clamp(s.knots[s.knots.length - degree - 1]);
        var newControlPoints = s.controlPoints.slice(degree, s.controlPoints.length - degree);
        var newKnots = s.knots.slice(degree, s.knots.length - degree);
        return new BSplineR1toR2_1.BSplineR1toR2(newControlPoints, newKnots);
    };
    /**
     * Return a deep copy of this b-spline
     */
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.clone = function () {
        var cloneControlPoints = AbstractBSplineR1toR2_1.deepCopyControlPoints(this._controlPoints);
        return new PeriodicBSplineR1toR2withOpenKnotSequence(cloneControlPoints, this._increasingKnotSequence.allAbscissae.slice());
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.optimizerStep = function (step) {
        var n = this.periodicControlPointsLength;
        for (var i = 0; i < n; i += 1) {
            this.moveControlPoint(i, step[i], step[i + n]);
        }
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.moveControlPoint = function (i, deltaX, deltaY) {
        if (i < 0 || i >= this.periodicControlPointsLength) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "moveControlPoint", "Control point indentifier is out of range.");
            throw (error);
        }
        _super.prototype.moveControlPoint.call(this, i, deltaX, deltaY);
        var n = this.periodicControlPointsLength;
        if (i < this.degree) {
            _super.prototype.setControlPointPosition.call(this, n + i, this.getControlPoint(i));
        }
    };
    /**
     *
     * @param fromU Parametric position where the section start
     * @param toU Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.extract = function (fromU, toU) {
        var spline = this.clone();
        spline.clamp(fromU);
        spline.clamp(toU);
        var newFromSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(fromU, spline.knots, spline._degree);
        var newToSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(toU, spline.knots, spline._degree);
        var newKnots = [];
        var newControlPoints = [];
        for (var i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline.knots[i]);
        }
        for (var i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector2d_1.Vector2d(spline._controlPoints[i].x, spline._controlPoints[i].y));
        }
        return new BSplineR1toR2_1.BSplineR1toR2(newControlPoints, newKnots);
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.elevateDegree = function (times) {
        if (times === void 0) { times = 1; }
        var sx = new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(this.getControlPointsX(), this.knots);
        var sy = new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(this.getControlPointsY(), this.knots);
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
        var newSpline = new PeriodicBSplineR1toR2withOpenKnotSequence(newcp, sxNew.knots);
        for (var i = 0; i < knots.length; i += 1) {
            var m = this.knotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(this._increasingKnotSequence.findSpan(knots[i])));
            for (var j = 0; j < newSpline.degree - m - 1; j += 1) {
                newSpline.removeKnot(Piegl_Tiller_NURBS_Book_1.findSpan(newSpline.knots[i], newSpline.knots, newSpline.degree));
            }
        }
        this._controlPoints = newSpline.controlPoints;
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(newSpline.degree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: newSpline.knots });
        this._degree = newSpline.degree;
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.generateKnotSequenceOfBSplineR1toR2 = function () {
        var knotSequence = this._increasingKnotSequence.allAbscissae;
        var distinctKnots = this.getDistinctKnots();
        // const knotMultiplicity: number[] = this._increasingKnotSequence.toStrictlyIncreasingKnotSequence().multiplicities();
        var knotMultiplicity = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(this._increasingKnotSequence).multiplicities();
        if (knotMultiplicity.length !== distinctKnots.length) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "generateKnotSequenceOfBSplineR1toR2", "inconsistent set of knot multiplicities compared to the disctinct knot values.");
            error.logMessage();
        }
        else if (knotMultiplicity[0] !== knotMultiplicity[knotMultiplicity.length - 1]) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "generateKnotSequenceOfBSplineR1toR2", "knot multiplicities at sequence extremities differ. Cannot generate the knot sequence of the corresponding open curve.");
            error.logMessage();
        }
        var knotToAddAtOrigin = [];
        for (var j = 0; j < (this._degree - knotMultiplicity[0] + 2); j++) {
            knotToAddAtOrigin.push(knotSequence[0] + (knotSequence[knotSequence.length - 1 - this._degree - j] - knotSequence[knotSequence.length - 1]));
        }
        var knotToAddAtExtremity = [];
        for (var j = 0; j < (this._degree - knotMultiplicity[knotMultiplicity.length - 1] + 2); j++) {
            knotToAddAtExtremity.push(knotSequence[knotSequence.length - 1] + (knotSequence[j + 1] - knotSequence[0]));
        }
        var result = knotToAddAtOrigin.concat(knotSequence).concat(knotToAddAtExtremity);
        return result;
    };
    // generateKnotSequenceOfBSplineR1toR2(): number[] {
    //     const knotSequence = this._knots;
    //     const distinctKnots = this.getDistinctKnots();
    //     const knotMultiplicity: number[] = [];
    //     let i = this._knots.length - 1;
    //     while(i > 0) {
    //         const multiplicity = this.knotMultiplicity(i);
    //         knotMultiplicity.splice(0, 0, multiplicity);
    //         i = i - multiplicity;
    //     }
    //     if(knotMultiplicity.length !== distinctKnots.length) {
    //         const error = new ErrorLog(this.constructor.name, "generateKnotSequenceOfBSplineR1toR2", "inconsistent set of knot multiplicities compared to the disctinct knot values.");
    //         error.logMessageToConsole();
    //     } else if(knotMultiplicity[0] !== knotMultiplicity[knotMultiplicity.length - 1]) {
    //         const error = new ErrorLog(this.constructor.name, "generateKnotSequenceOfBSplineR1toR2", "knot multiplicities at sequence extremities differ. Cannot generate the knot sequence of the corresponding open curve.");
    //         error.logMessageToConsole();
    //     }
    //     const knotToAddAtOrigin: number[] = [];
    //     for(let j = 0; j < (this._degree - knotMultiplicity[0] + 2); j++) {
    //         knotToAddAtOrigin.push(knotSequence[0] + (knotSequence[knotSequence.length - 1 - this._degree - j] - knotSequence[knotSequence.length - 1]));
    //     }
    //     const knotToAddAtExtremity: number[] = [];
    //     for(let j = 0; j < (this._degree - knotMultiplicity[knotMultiplicity.length - 1] + 2); j++) {
    //         knotToAddAtExtremity.push(knotSequence[knotSequence.length - 1] + (knotSequence[j + 1] - knotSequence[0]));
    //     }
    //     let result =  knotToAddAtOrigin.concat(knotSequence).concat(knotToAddAtExtremity);
    //     return result;
    // }
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.generateKnotSequenceOfPeriodicBSplineR1toR2 = function (bSplineDegreeUp) {
        var knotSequenceDegreeUp = bSplineDegreeUp.increasingKnotSequence.allAbscissae;
        while (knotSequenceDegreeUp[0] !== this._increasingKnotSequence.allAbscissae[0]) {
            knotSequenceDegreeUp.splice(0, 1);
        }
        while (knotSequenceDegreeUp[knotSequenceDegreeUp.length - 1] !== this._increasingKnotSequence.allAbscissae[this._increasingKnotSequence.length() - 1]) {
            knotSequenceDegreeUp.splice((knotSequenceDegreeUp.length - 1), 1);
        }
        return knotSequenceDegreeUp;
    };
    // generateKnotSequenceOfPeriodicBSplineR1toR2(bSplineDegreeUp: BSplineR1toR2): number[] {
    //     let knotSequenceDegreeUp = bSplineDegreeUp.knots;
    //     while(knotSequenceDegreeUp[0] !== this._knots[0]) {
    //         knotSequenceDegreeUp.splice(0, 1);
    //     }
    //     while(knotSequenceDegreeUp[knotSequenceDegreeUp.length - 1] !== this._knots[this._knots.length - 1]) {
    //         knotSequenceDegreeUp.splice((knotSequenceDegreeUp.length - 1), 1);
    //     }
    //     return knotSequenceDegreeUp;
    // }
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.generateControlPolygonOfBSplineR1toR2 = function () {
        var result = [];
        // const knotMultiplicity: number[] = this._increasingKnotSequence.toStrictlyIncreasingKnotSequence().multiplicities();
        var knotMultiplicity = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(this._increasingKnotSequence).multiplicities();
        if (knotMultiplicity[0] === (this._degree + 1)) {
            result = this._controlPoints;
        }
        else {
            var controlPtsToAddAtOrigin = [];
            for (var j = 0; j < (this._degree - knotMultiplicity[0] + 2); j++) {
                controlPtsToAddAtOrigin.push(this._controlPoints[this._controlPoints.length - 1 - j]);
            }
            result = controlPtsToAddAtOrigin.concat(this._controlPoints);
        }
        return result;
    };
    // generateControlPolygonOfBSplineR1toR2(): Vector2d[] {
    //     let result: Vector2d[] = [];
    //     const knotMultiplicity: number[] = [];
    //     let i = this._knots.length - 1;
    //     while(i > 0) {
    //         const multiplicity = this.knotMultiplicity(i);
    //         knotMultiplicity.splice(0, 0, multiplicity);
    //         i = i - multiplicity;
    //     }
    //     if(knotMultiplicity[0] === (this._degree + 1)) {
    //         result = this._controlPoints;
    //     } else {
    //         const controlPtsToAddAtOrigin: Vector2d[] = [];
    //         for(let j = 0; j < (this._degree - knotMultiplicity[0] + 2); j++) {
    //             controlPtsToAddAtOrigin.push(this._controlPoints[this._controlPoints.length - 1 - j]);
    //         }
    //         result = controlPtsToAddAtOrigin.concat(this._controlPoints);
    //     }
    //     return result;
    // }
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.generateControlPolygonOfPeriodicBSplineR1toR2 = function (bSplineDegreeUp) {
        var controlPolygonDegreeUp = bSplineDegreeUp.controlPoints;
        controlPolygonDegreeUp.splice(0, bSplineDegreeUp.degree);
        controlPolygonDegreeUp.splice((controlPolygonDegreeUp.length - 1), 1);
        return controlPolygonDegreeUp;
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.generateBSplineR1toR2 = function () {
        return new BSplineR1toR2_1.BSplineR1toR2(this._controlPoints, this._increasingKnotSequence.allAbscissae);
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.degreeIncrement = function () {
        // temporary setting -> the design of an interface should avoid the definition of this method
        return new PeriodicBSplineR1toR2withOpenKnotSequence();
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.toPeriodicBSplineR1toR2 = function () {
        // const periodicSequence = this._increasingKnotSequence.toPeriodicKnotSequence();
        var periodicSequence = fromIncreasingOpentoIncreasingPeriodicKnotSequence_1.fromIncreasingOpentoIncreasingPeriodicKnotSequence(this._increasingKnotSequence);
        var increasingKnotAbscissae = periodicSequence.allAbscissae;
        var controlPoints = this._controlPoints.slice(this._degree, this._controlPoints.length);
        var multiplicityOrigin = periodicSequence.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
        for (var i = 0; i < (multiplicityOrigin - 1); i++) {
            controlPoints.splice(controlPoints.length, 0, this._controlPoints[i + this._degree - (multiplicityOrigin - 1)]);
        }
        var periodicBSpline = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2(controlPoints, increasingKnotAbscissae, this._degree);
        if (periodicBSpline === undefined) {
            return undefined;
        }
        else {
            return periodicBSpline;
        }
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.grevilleAbscissae = function () {
        var e_2, _a;
        var result = [];
        for (var i = 0; i < this.freeControlPoints.length; i += 1) {
            var sum = 0;
            var subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + this._degree - 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 2 * this._degree - 2));
            try {
                for (var subSequence_1 = (e_2 = void 0, __values(subSequence)), subSequence_1_1 = subSequence_1.next(); !subSequence_1_1.done; subSequence_1_1 = subSequence_1.next()) {
                    var knot = subSequence_1_1.value;
                    sum += knot;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (subSequence_1_1 && !subSequence_1_1.done && (_a = subSequence_1.return)) _a.call(subSequence_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            result.push(sum / this._degree);
        }
        return result;
    };
    // Probably not compatible with periodic BSplines -> to be modified
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.removeKnot = function (indexFromFindSpan, tolerance) {
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
        var first = index - this._degree;
        var offset = first - 1;
        //std::vector<vectorType> local(2*degree+1);
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
        // this.knots.splice(index, 1);
        this._increasingKnotSequence.decrementKnotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        var fout = (2 * index - multiplicity - this.degree) / 2;
        this._controlPoints.splice(fout, 1);
    };
    // removeKnot(indexFromFindSpan: number, tolerance: number = 10e-5): void {
    //     //Piegl and Tiller, The NURBS book, p : 185
    //     const index = indexFromFindSpan;
    //     // end knots are not removed
    //     if (index > this._degree && index < this.knots.length-this._degree - 1) {
    //         throw new Error("index out of range");
    //     }
    //     //const double tolerance = 1;
    //     const multiplicity = this.knotMultiplicity(index);
    //     const last = index - multiplicity;
    //     const first = index -this.degree;
    //     const offset = first -1;
    //     //std::vector<vectorType> local(2*degree+1);
    //     let local: Vector2d[] = [];
    //     local[0] = this.controlPoints[offset];
    //     local[last+1-offset] = this.controlPoints[last+1];
    //     let i = first;
    //     let j = last;
    //     let ii = 1;
    //     let jj = last - offset;
    //     let removable = false;
    //     // Compute new control point for one removal step
    //     while (j>i){
    //         let alpha_i = (this.knots[index] - this.knots[i])/(this.knots[i+this.degree+1]-this.knots[i]);
    //         let alpha_j = (this.knots[index] - this.knots[j])/(this.knots[j+this.degree+1] - this.knots[j]);
    //         local[ii] = (this.controlPoints[i].substract(local[ii-1].multiply(1.0-alpha_i))).multiply(1 / alpha_i ) 
    //         local[jj] = (this.controlPoints[j].substract(local[jj+1].multiply(alpha_j))).multiply(1 / (1.0-alpha_j) )
    //         ++i;
    //         ++ii;
    //         --j;
    //         --jj;
    //     }
    //     if (j < i) {
    //         if ((local[ii-1].substract(local[jj+1])).norm() <= tolerance){
    //             removable = true;
    //         }
    //     }
    //     else {
    //         const alpha_i = (this.knots[index] - this.knots[i]) / (this.knots[i+this.degree+1]-this.knots[i]) ;
    //         if ( ((this.controlPoints[i].substract((local[ii+1].multiply(alpha_i)))).add (local[ii-1].multiply(1.0- alpha_i))).norm() <= tolerance) {
    //             removable = true;
    //         }
    //     }
    //     if (!removable) return;
    //     else {
    //         let indInc = first;
    //         let indDec = last;
    //         while (indDec > indInc) {
    //             this.controlPoints[indInc] = local[indInc-offset];
    //             this.controlPoints[indDec] = local[indDec-offset];
    //             ++indInc;
    //             --indDec;
    //         }
    //     }
    //     this.knots.splice(index, 1);
    //     const fout = (2*index - multiplicity - this.degree) / 2;
    //     this._controlPoints.splice(fout, 1);
    // }
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.getDistinctKnots = function () {
        // const indexStrctInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(this._increasingKnotSequence.indexKnotOrigin);
        var indexStrctInc = this._increasingKnotSequence.indexKnotOrigin;
        var multiplicityBoundary = this.knotMultiplicity(indexStrctInc);
        var result = _super.prototype.getDistinctKnots.call(this);
        return result.slice(this.degree - (multiplicityBoundary - 1), result.length - this.degree + (multiplicityBoundary - 1));
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.setControlPointPosition = function (i, value) {
        if (i < 0 || i >= this.periodicControlPointsLength) {
            throw new Error("Control point indentifier is out of range");
        }
        _super.prototype.setControlPointPosition.call(this, i, value.clone());
        if (i < this._degree) {
            var j = this.periodicControlPointsLength + i;
            _super.prototype.setControlPointPosition.call(this, j, value.clone());
        }
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.isKnotlMultiplicityZero = function (u) {
        var multiplicityZero = true;
        if (this.isAbscissaCoincidingWithKnot(u))
            multiplicityZero = false;
        return multiplicityZero;
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.findCoincidentKnot = function (u) {
        var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        if (!this.isKnotlMultiplicityZero(u))
            index = this.getFirstKnotIndexCoincidentWithAbscissa(u);
        return index;
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.insertKnot = function (u) {
        var uToInsert = u;
        var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        if (!this.isKnotlMultiplicityZero(u)) {
            index = this.findCoincidentKnot(u);
            var indexSpan = this._increasingKnotSequence.findSpan(this._increasingKnotSequence.abscissaAtIndex(index));
            uToInsert = this._increasingKnotSequence.abscissaAtIndex(indexSpan);
        }
        if (uToInsert < this.knots[2 * this._degree] || uToInsert > this.knots[this.knots.length - 2 * this._degree - 1]) {
            var knotAbsc = this._increasingKnotSequence.allAbscissae;
            var indexOrigin = this._increasingKnotSequence.indexKnotOrigin;
            // temporary modif
            var knotAbscResetOrigin = [];
            // const knotAbscResetOrigin = resetKnotAbscissaeToOrigin(knotAbsc);
            var sameSplineOpenCurve = new BSplineR1toR2_1.BSplineR1toR2(this.controlPoints, knotAbscResetOrigin);
            // const newUToInsert = sameSplineOpenCurve.increasingKnotSequence.abscissaAtIndex(indexOrigin) + uToInsert;
            var indexInc = this._increasingKnotSequence.toKnotIndexIncreasingSequence(indexOrigin);
            var newUToInsert = sameSplineOpenCurve.increasingKnotSequence.abscissaAtIndex(indexInc) + uToInsert;
            var indexSpan = this._increasingKnotSequence.findSpan(uToInsert);
            var indexStrictIncSeq = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexSpan);
            var knotMultiplicity = this.knotMultiplicity(indexStrictIncSeq);
            if (knotMultiplicity === this._degree) {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "cannot insert knot. Current knot multiplicity already equals curve degree.");
                error.logMessage();
            }
            else {
                // two knot insertions must take place to preserve the periodic structure of the function basis
                // unless if uToInsert = uSymmetric. In this case, only one knot insertion is possible
                var uSymmetric = this.findKnotAbscissaeRightBound() + knotAbscResetOrigin[indexOrigin.knotIndex];
                sameSplineOpenCurve.insertKnot(newUToInsert, 1);
                if ((uSymmetric - uToInsert) !== uToInsert) {
                    sameSplineOpenCurve.insertKnot(uSymmetric - uToInsert, 1);
                }
                var newKnotAbsc = sameSplineOpenCurve.increasingKnotSequence.allAbscissae;
                for (var i = 0; i < newKnotAbsc.length; i++) {
                    newKnotAbsc[i] -= knotAbscResetOrigin[indexOrigin.knotIndex];
                }
                var newCtrlPts = sameSplineOpenCurve.controlPoints;
                if (indexSpan.knotIndex === indexOrigin.knotIndex) {
                    // the knot inserted is located at the origin of the periodic curve. To obtain the new knot
                    // sequence, the extreme knots must be removed as well as the corresponding control points
                    newKnotAbsc = newKnotAbsc.slice(1, newKnotAbsc.length - 1);
                    newCtrlPts = sameSplineOpenCurve.controlPoints.slice(1, sameSplineOpenCurve.controlPoints.length - 1);
                }
                this._controlPoints = newCtrlPts;
                this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(this._degree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: newKnotAbsc });
            }
            return;
        }
        else {
            _super.prototype.insertKnot.call(this, uToInsert, 1);
        }
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.insertKnotIntoTempSpline = function (u) {
        var uToInsert = u;
        var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        if (!this.isKnotlMultiplicityZero(u)) {
            index = this.findCoincidentKnot(u);
            var indexSpan = this._increasingKnotSequence.findSpan(this._increasingKnotSequence.abscissaAtIndex(index));
            uToInsert = this._increasingKnotSequence.abscissaAtIndex(indexSpan);
        }
        if (uToInsert < this.knots[2 * this._degree] || uToInsert > this.knots[this.knots.length - 2 * this._degree - 1]) {
            var knotAbsc = this._increasingKnotSequence.allAbscissae;
            var indexOrigin = this._increasingKnotSequence.indexKnotOrigin;
            // temporary modif
            var knotAbscResetOrigin = Piegl_Tiller_NURBS_Book_1.resetKnotAbscissaeToOrigin(knotAbsc);
            var sameSplineOpenCurve = new BSplineR1toR2_1.BSplineR1toR2(this.controlPoints, knotAbscResetOrigin);
            // const newUToInsert = sameSplineOpenCurve.increasingKnotSequence.abscissaAtIndex(indexOrigin) + uToInsert;
            var indexIncSeq = this._increasingKnotSequence.toKnotIndexIncreasingSequence(indexOrigin);
            var newUToInsert = sameSplineOpenCurve.increasingKnotSequence.abscissaAtIndex(indexIncSeq) + uToInsert;
            var indexSpan = this._increasingKnotSequence.findSpan(uToInsert);
            var indexStrictIncSeq = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexSpan);
            var knotMultiplicity = this.knotMultiplicity(indexStrictIncSeq);
            if (knotMultiplicity === this._degree) {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "cannot insert knot. Current knot multiplicity already equals curve degree.");
                error.logMessage();
            }
            else {
                // two knot insertions must take place to preserve the periodic structure of the function basis
                // unless if uToInsert = uSymmetric. In this case, only one knot insertion is possible
                var uSymmetric = this.findKnotAbscissaeRightBound() + knotAbscResetOrigin[indexOrigin.knotIndex];
                sameSplineOpenCurve.insertKnot(newUToInsert, 1);
                if ((uSymmetric - uToInsert) !== uToInsert) {
                    sameSplineOpenCurve.insertKnot(uSymmetric - uToInsert, 1);
                }
                var newKnotAbsc = sameSplineOpenCurve.increasingKnotSequence.allAbscissae;
                for (var i = 0; i < newKnotAbsc.length; i++) {
                    newKnotAbsc[i] -= knotAbscResetOrigin[indexOrigin.knotIndex];
                }
                var newCtrlPts = sameSplineOpenCurve.controlPoints;
                // if(indexSpan.knotIndex === indexOrigin.knotIndex) {
                //     // the knot inserted is located at the origin of the periodic curve. To obtain the new knot
                //     // sequence, the extreme knots must be removed as well as the corresponding control points
                //     newKnotAbsc = newKnotAbsc.slice(1, newKnotAbsc.length - 1);
                //     newCtrlPts = sameSplineOpenCurve.controlPoints.slice(1, sameSplineOpenCurve.controlPoints.length - 1);
                // }
                this._controlPoints = newCtrlPts;
                this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(this._degree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: newKnotAbsc });
            }
            return;
        }
        else {
            _super.prototype.insertKnot.call(this, uToInsert, 1);
        }
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.findKnotAbscissaeRightBound = function () {
        var result = 0.0;
        var cumulativeMultiplicity = 0;
        // const strictIncSeq = this._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
        var strictIncSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(this._increasingKnotSequence);
        var indexOrigin = this._increasingKnotSequence.indexKnotOrigin;
        for (var j = 0; j < indexOrigin.knotIndex; j++) {
            cumulativeMultiplicity += strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(j));
        }
        var multiplicityAtOrigin = strictIncSeq.knotMultiplicity(indexOrigin);
        var cumulativeMultRightBound = 0;
        for (var i = strictIncSeq.length() - 1; i >= strictIncSeq.length() - indexOrigin.knotIndex; i--) {
            cumulativeMultRightBound += strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i));
        }
        if (multiplicityAtOrigin === strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(strictIncSeq.length() - indexOrigin.knotIndex - 1)))
            result = strictIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(strictIncSeq.length() - indexOrigin.knotIndex - 1));
        return result;
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.scale = function (factor) {
        var cp = [];
        this._controlPoints.forEach(function (element) {
            cp.push(element.multiply(factor));
        });
        return new PeriodicBSplineR1toR2withOpenKnotSequence(cp, this.knots.slice());
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.scaleY = function (factor) {
        var cp = [];
        this._controlPoints.forEach(function (element) {
            cp.push(new Vector2d_1.Vector2d(element.x, element.y * factor));
        });
        return new PeriodicBSplineR1toR2withOpenKnotSequence(cp, this.knots.slice());
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.scaleX = function (factor) {
        var cp = [];
        this._controlPoints.forEach(function (element) {
            cp.push(new Vector2d_1.Vector2d(element.x * factor, element.y));
        });
        return new PeriodicBSplineR1toR2withOpenKnotSequence(cp, this.knots.slice());
    };
    PeriodicBSplineR1toR2withOpenKnotSequence.prototype.evaluateOutsideRefInterval = function (u) {
        var result = new Vector2d_1.Vector2d();
        var knots = this.getDistinctKnots();
        if (u >= knots[0] && u <= knots[knots.length - 1]) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Parameter value for evaluation is not outside the knot interval.");
            error.logMessage();
        }
        else {
            u = u % (knots[knots.length - 1] - knots[0]);
            result = this.evaluate(u);
        }
        return result;
    };
    return PeriodicBSplineR1toR2withOpenKnotSequence;
}(AbstractBSplineR1toR2_1.AbstractBSplineR1toR2));
exports.PeriodicBSplineR1toR2withOpenKnotSequence = PeriodicBSplineR1toR2withOpenKnotSequence;
function create_PeriodicBSplineR1toR2(controlPoints, knots) {
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
    return new PeriodicBSplineR1toR2withOpenKnotSequence(newControlPoints, knots);
}
exports.create_PeriodicBSplineR1toR2 = create_PeriodicBSplineR1toR2;
