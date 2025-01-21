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
exports.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints = exports.OptProblemPeriodicBSplineR1toR2 = void 0;
var MathVectorBasicOperations_1 = require("../linearAlgebra/MathVectorBasicOperations");
var PeriodicBSplineR1toR1_1 = require("../newBsplines/PeriodicBSplineR1toR1");
var DenseMatrix_1 = require("../linearAlgebra/DenseMatrix");
var AbstractOptProblemBSplineR1toR2_1 = require("./AbstractOptProblemBSplineR1toR2");
var OptProblemPeriodicBSplineR1toR2 = /** @class */ (function (_super) {
    __extends(OptProblemPeriodicBSplineR1toR2, _super);
    function OptProblemPeriodicBSplineR1toR2(splineInitial, shapeSpaceDiffEventsStructure) {
        var _this = _super.call(this, splineInitial, shapeSpaceDiffEventsStructure) || this;
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        _this._analyticHighOrderCurveDerivatives = _this.initExpansiveComputations();
        if (_this._shapeSpaceDiffEventsStructure.activeControlInflections || _this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // e = this.expensiveComputation(this._spline);
            _this._analyticHighOrderCurveDerivatives = _this.expensiveComputation(_this._spline);
            // this._curvatureNumeratorCP = this.curvatureNumerator(e.h4);
            _this._curvatureNumeratorCP = _this.curvatureNumerator();
            _this._inflectionTotalNumberOfConstraints = _this._curvatureNumeratorCP.length;
            _this.inflectionConstraintsSign = _this.computeConstraintsSign(_this._curvatureNumeratorCP);
            _this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection;
            _this._inflectionInactiveConstraints = _this.computeInactiveConstraints(_this._curvatureNumeratorCP);
            _this.inflectionNumberOfActiveConstraints = _this._curvatureNumeratorCP.length - _this.inflectionInactiveConstraints.length;
        }
        if (_this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            _this._curvatureDerivativeNumeratorCP = _this.curvatureDerivativeNumerator();
            _this._curvatureExtremaTotalNumberOfConstraints = _this._curvatureDerivativeNumeratorCP.length;
            _this._curvatureExtremaConstraintsSign = _this.computeConstraintsSign(_this._curvatureDerivativeNumeratorCP);
            _this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema;
            _this._curvatureExtremaInactiveConstraints = _this.computeInactiveConstraints(_this._curvatureDerivativeNumeratorCP);
            _this.curvatureExtremaNumberOfActiveConstraints = _this._curvatureDerivativeNumeratorCP.length - _this.curvatureExtremaInactiveConstraints.length;
        }
        _this._f = _this.compute_f(_this._curvatureNumeratorCP, _this.inflectionConstraintsSign, _this._inflectionInactiveConstraints, _this._curvatureDerivativeNumeratorCP, _this._curvatureExtremaConstraintsSign, _this._curvatureExtremaInactiveConstraints);
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints,
        //     this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        _this._gradient_f = _this.compute_gradient_f(_this.inflectionConstraintsSign, _this._inflectionInactiveConstraints, _this._curvatureExtremaConstraintsSign, _this._curvatureExtremaInactiveConstraints);
        return _this;
    }
    Object.defineProperty(OptProblemPeriodicBSplineR1toR2.prototype, "spline", {
        get: function () {
            return this._spline;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptProblemPeriodicBSplineR1toR2.prototype, "previousSpline", {
        get: function () {
            return this._previousSpline;
        },
        enumerable: false,
        configurable: true
    });
    OptProblemPeriodicBSplineR1toR2.prototype.bSplineR1toR1Factory = function (controlPoints, knots) {
        return new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(controlPoints, knots);
    };
    OptProblemPeriodicBSplineR1toR2.prototype.setTargetSpline = function (spline) {
        this._target = spline.clone();
        this._gradient_f0 = this.compute_gradient_f0(this.spline);
        this._f0 = this.compute_f0(this._gradient_f0);
    };
    /**
     * Some contraints are set inactive to allowed the point of inflection or curvature extrema
     * to slide along the curve.
     **/
    OptProblemPeriodicBSplineR1toR2.prototype.computeInactiveConstraints = function (controlPoints) {
        var controlPointsSequences = this.extractChangingSignControlPointsSequences(controlPoints);
        var result = this.extractControlPointsClosestToZero(controlPointsSequences);
        var firstCP = controlPoints[0];
        var lastCP = controlPoints[controlPoints.length - 1];
        if (firstCP * lastCP <= 0) {
            if (Math.pow(firstCP, 2) <= Math.pow(lastCP, 2)) {
                if (result[0] != 0) {
                    result = [0].concat(result);
                }
            }
            else {
                if (result[result.length - 1] != controlPoints.length - 1) {
                    result.push(controlPoints.length - 1);
                }
            }
        }
        return result;
    };
    OptProblemPeriodicBSplineR1toR2.prototype.extractChangingSignControlPointsSequences = function (controlPoints) {
        var result = [];
        var successiveControlPoints = [];
        var i = 1;
        while (i < controlPoints.length) {
            successiveControlPoints = [];
            if (controlPoints[i - 1] * controlPoints[i] <= 0) {
                successiveControlPoints.push({ index: i - 1, value: controlPoints[i - 1] });
                successiveControlPoints.push({ index: i, value: controlPoints[i] });
                i += 1;
                while (controlPoints[i - 1] * controlPoints[i] <= 0) {
                    successiveControlPoints.push({ index: i, value: controlPoints[i] });
                    i += 1;
                }
                result.push(successiveControlPoints);
            }
            i += 1;
        }
        return result;
    };
    OptProblemPeriodicBSplineR1toR2.prototype.extractControlPointsClosestToZero = function (polygonSegments) {
        var e_1, _a, e_2, _b;
        var result = [];
        try {
            for (var polygonSegments_1 = __values(polygonSegments), polygonSegments_1_1 = polygonSegments_1.next(); !polygonSegments_1_1.done; polygonSegments_1_1 = polygonSegments_1.next()) {
                var polygonSegment = polygonSegments_1_1.value;
                var s = this.removeBiggest(polygonSegment);
                try {
                    for (var s_1 = (e_2 = void 0, __values(s)), s_1_1 = s_1.next(); !s_1_1.done; s_1_1 = s_1.next()) {
                        var iv = s_1_1.value;
                        result.push(iv.index);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (s_1_1 && !s_1_1.done && (_b = s_1.return)) _b.call(s_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (polygonSegments_1_1 && !polygonSegments_1_1.done && (_a = polygonSegments_1.return)) _a.call(polygonSegments_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    OptProblemPeriodicBSplineR1toR2.prototype.removeBiggest = function (controlPointsSequence) {
        var result = controlPointsSequence.slice();
        var maxIndex = 0;
        for (var i = 1; i < controlPointsSequence.length; i += 1) {
            if (Math.pow(controlPointsSequence[i].value, 2) > Math.pow(controlPointsSequence[maxIndex].value, 2)) {
                maxIndex = i;
            }
        }
        result.splice(maxIndex, 1);
        return result;
    };
    // compute_curvatureExtremaConstraints_gradient( e: ExpensiveComputationResults,
    //                                             constraintsSign: number[], 
    //                                             inactiveConstraints: number[]) {
    OptProblemPeriodicBSplineR1toR2.prototype.compute_curvatureExtremaConstraints_gradient = function (constraintsSign, inactiveConstraints) {
        var e_3, _a, e_4, _b;
        // const sxu = e.bdsxu
        // const sxuu = e.bdsxuu
        // const sxuuu = e.bdsxuuu
        // const syu = e.bdsyu
        // const syuu = e.bdsyuu
        // const syuuu = e.bdsyuuu
        // const h1 = e.h1
        // const h2 = e.h2
        // const h3 = e.h3
        // const h4 = e.h4
        var sxu = this._analyticHighOrderCurveDerivatives.bdsxu;
        var sxuu = this._analyticHighOrderCurveDerivatives.bdsxuu;
        var sxuuu = this._analyticHighOrderCurveDerivatives.bdsxuuu;
        var syu = this._analyticHighOrderCurveDerivatives.bdsyu;
        var syuu = this._analyticHighOrderCurveDerivatives.bdsyuu;
        var syuuu = this._analyticHighOrderCurveDerivatives.bdsyuuu;
        var h1 = this._analyticHighOrderCurveDerivatives.h1;
        var h2 = this._analyticHighOrderCurveDerivatives.h2;
        var h3 = this._analyticHighOrderCurveDerivatives.h3;
        var h4 = this._analyticHighOrderCurveDerivatives.h4;
        var dgx = [];
        var dgy = [];
        var periodicControlPointsLength = this.spline.freeControlPoints.length;
        var totalNumberOfConstraints = constraintsSign.length;
        var degree = this.spline.degree;
        for (var i = 0; i < periodicControlPointsLength; i += 1) {
            // moved control point : i
            // periodicControlPointsLength = n - degree (it is necessery to add degree cyclic control points, if we do not count them we have n - degree control points)
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(periodicControlPointsLength, i + 1);
            var h1_subset = h1.subset(start, lessThan);
            var h2_subset = h2.subset(start, lessThan);
            var h3_subset = h3.subset(start, lessThan);
            var h4_subset = h4.subset(start, lessThan);
            var h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
            var h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
            var h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
            var h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
            var h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (var i = 0; i < periodicControlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(periodicControlPointsLength, i + 1);
            var h1_subset = h1.subset(start, lessThan);
            var h2_subset = h2.subset(start, lessThan);
            var h3_subset = h3.subset(start, lessThan);
            var h4_subset = h4.subset(start, lessThan);
            var h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            var h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            var h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
            var h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        var result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * periodicControlPointsLength);
        for (var i = 0; i < periodicControlPointsLength; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (4 * degree - 5);
            var lessThan = Math.min(periodicControlPointsLength, i + 1) * (4 * degree - 5);
            var deltaj = 0;
            try {
                for (var inactiveConstraints_1 = (e_3 = void 0, __values(inactiveConstraints)), inactiveConstraints_1_1 = inactiveConstraints_1.next(); !inactiveConstraints_1_1.done; inactiveConstraints_1_1 = inactiveConstraints_1.next()) {
                    var inactiveConstraint = inactiveConstraints_1_1.value;
                    if (inactiveConstraint >= start) {
                        break;
                    }
                    deltaj += 1;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (inactiveConstraints_1_1 && !inactiveConstraints_1_1.done && (_a = inactiveConstraints_1.return)) _a.call(inactiveConstraints_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, periodicControlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        //Adding periodic term inside the Matrix
        // The effect of the first control points over the constraints at the end
        for (var i = 0; i < degree; i += 1) {
            // moved control point : i
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]
            var start = i - degree + periodicControlPointsLength;
            var lessThan = periodicControlPointsLength;
            var h1_subset = h1.subset(start, lessThan);
            var h2_subset = h2.subset(start, lessThan);
            var h3_subset = h3.subset(start, lessThan);
            var h4_subset = h4.subset(start, lessThan);
            var h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
            var h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
            var h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
            var h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
            var h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (var i = 0; i < degree; i += 1) {
            var start = i - degree + periodicControlPointsLength;
            var lessThan = periodicControlPointsLength;
            var h1_subset = h1.subset(start, lessThan);
            var h2_subset = h2.subset(start, lessThan);
            var h3_subset = h3.subset(start, lessThan);
            var h4_subset = h4.subset(start, lessThan);
            var h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            var h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            var h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
            var h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (var i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = (i - degree) * (4 * degree - 5);
            var lessThan = (periodicControlPointsLength) * (4 * degree - 5);
            var deltaj = 0;
            try {
                for (var inactiveConstraints_2 = (e_4 = void 0, __values(inactiveConstraints)), inactiveConstraints_2_1 = inactiveConstraints_2.next(); !inactiveConstraints_2_1.done; inactiveConstraints_2_1 = inactiveConstraints_2.next()) {
                    var inactiveConstraint = inactiveConstraints_2_1.value;
                    if (inactiveConstraint >= start) {
                        break;
                    }
                    deltaj += 1;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (inactiveConstraints_2_1 && !inactiveConstraints_2_1.done && (_b = inactiveConstraints_2.return)) _b.call(inactiveConstraints_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i - periodicControlPointsLength, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    };
    OptProblemPeriodicBSplineR1toR2.prototype.compute_curvatureExtremaConstraints_gradientPreviousIteration = function (constraintsSign, inactiveConstraints) {
        var e_5, _a, e_6, _b;
        var sxu = this._previousAnalyticHighOrderCurveDerivatives.bdsxu;
        var sxuu = this._previousAnalyticHighOrderCurveDerivatives.bdsxuu;
        var sxuuu = this._previousAnalyticHighOrderCurveDerivatives.bdsxuuu;
        var syu = this._previousAnalyticHighOrderCurveDerivatives.bdsyu;
        var syuu = this._previousAnalyticHighOrderCurveDerivatives.bdsyuu;
        var syuuu = this._previousAnalyticHighOrderCurveDerivatives.bdsyuuu;
        var h1 = this._previousAnalyticHighOrderCurveDerivatives.h1;
        var h2 = this._previousAnalyticHighOrderCurveDerivatives.h2;
        var h3 = this._previousAnalyticHighOrderCurveDerivatives.h3;
        var h4 = this._previousAnalyticHighOrderCurveDerivatives.h4;
        var dgx = [];
        var dgy = [];
        var periodicControlPointsLength = this.spline.freeControlPoints.length;
        var totalNumberOfConstraints = constraintsSign.length;
        var degree = this.spline.degree;
        for (var i = 0; i < periodicControlPointsLength; i += 1) {
            // moved control point : i
            // periodicControlPointsLength = n - degree (it is necessery to add degree cyclic control points, if we do not count them we have n - degree control points)
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(periodicControlPointsLength, i + 1);
            var h1_subset = h1.subset(start, lessThan);
            var h2_subset = h2.subset(start, lessThan);
            var h3_subset = h3.subset(start, lessThan);
            var h4_subset = h4.subset(start, lessThan);
            var h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
            var h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
            var h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
            var h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
            var h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (var i = 0; i < periodicControlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(periodicControlPointsLength, i + 1);
            var h1_subset = h1.subset(start, lessThan);
            var h2_subset = h2.subset(start, lessThan);
            var h3_subset = h3.subset(start, lessThan);
            var h4_subset = h4.subset(start, lessThan);
            var h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            var h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            var h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
            var h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        var result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * periodicControlPointsLength);
        for (var i = 0; i < periodicControlPointsLength; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (4 * degree - 5);
            var lessThan = Math.min(periodicControlPointsLength, i + 1) * (4 * degree - 5);
            var deltaj = 0;
            try {
                for (var inactiveConstraints_3 = (e_5 = void 0, __values(inactiveConstraints)), inactiveConstraints_3_1 = inactiveConstraints_3.next(); !inactiveConstraints_3_1.done; inactiveConstraints_3_1 = inactiveConstraints_3.next()) {
                    var inactiveConstraint = inactiveConstraints_3_1.value;
                    if (inactiveConstraint >= start) {
                        break;
                    }
                    deltaj += 1;
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (inactiveConstraints_3_1 && !inactiveConstraints_3_1.done && (_a = inactiveConstraints_3.return)) _a.call(inactiveConstraints_3);
                }
                finally { if (e_5) throw e_5.error; }
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, periodicControlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        //Adding periodic term inside the Matrix
        // The effect of the first control points over the constraints at the end
        for (var i = 0; i < degree; i += 1) {
            // moved control point : i
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]
            var start = i - degree + periodicControlPointsLength;
            var lessThan = periodicControlPointsLength;
            var h1_subset = h1.subset(start, lessThan);
            var h2_subset = h2.subset(start, lessThan);
            var h3_subset = h3.subset(start, lessThan);
            var h4_subset = h4.subset(start, lessThan);
            var h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
            var h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
            var h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
            var h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
            var h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (var i = 0; i < degree; i += 1) {
            var start = i - degree + periodicControlPointsLength;
            var lessThan = periodicControlPointsLength;
            var h1_subset = h1.subset(start, lessThan);
            var h2_subset = h2.subset(start, lessThan);
            var h3_subset = h3.subset(start, lessThan);
            var h4_subset = h4.subset(start, lessThan);
            var h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            var h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            var h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
            var h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (var i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = (i - degree) * (4 * degree - 5);
            var lessThan = (periodicControlPointsLength) * (4 * degree - 5);
            var deltaj = 0;
            try {
                for (var inactiveConstraints_4 = (e_6 = void 0, __values(inactiveConstraints)), inactiveConstraints_4_1 = inactiveConstraints_4.next(); !inactiveConstraints_4_1.done; inactiveConstraints_4_1 = inactiveConstraints_4.next()) {
                    var inactiveConstraint = inactiveConstraints_4_1.value;
                    if (inactiveConstraint >= start) {
                        break;
                    }
                    deltaj += 1;
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (inactiveConstraints_4_1 && !inactiveConstraints_4_1.done && (_b = inactiveConstraints_4.return)) _b.call(inactiveConstraints_4);
                }
                finally { if (e_6) throw e_6.error; }
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i - periodicControlPointsLength, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    };
    // compute_inflectionConstraints_gradient( e: ExpensiveComputationResults,
    //                                         constraintsSign: number[], 
    //                                         inactiveConstraints: number[]) {
    OptProblemPeriodicBSplineR1toR2.prototype.compute_inflectionConstraints_gradient = function (constraintsSign, inactiveConstraints) {
        var e_7, _a, e_8, _b;
        // const sxu = e.bdsxu
        // const sxuu = e.bdsxuu
        // const syu = e.bdsyu
        // const syuu = e.bdsyuu
        var sxu = this._analyticHighOrderCurveDerivatives.bdsxu;
        var sxuu = this._analyticHighOrderCurveDerivatives.bdsxuu;
        var syu = this._analyticHighOrderCurveDerivatives.bdsyu;
        var syuu = this._analyticHighOrderCurveDerivatives.bdsyuu;
        var dgx = [];
        var dgy = [];
        var periodicControlPointsLength = this.spline.freeControlPoints.length;
        var degree = this.spline.degree;
        for (var i = 0; i < periodicControlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(periodicControlPointsLength, i + 1);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (var i = 0; i < periodicControlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(periodicControlPointsLength, i + 1);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        var totalNumberOfConstraints = this.inflectionConstraintsSign.length;
        var result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * periodicControlPointsLength);
        for (var i = 0; i < periodicControlPointsLength; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (2 * degree - 2);
            var lessThan = Math.min(periodicControlPointsLength, i + 1) * (2 * degree - 2);
            var deltaj = 0;
            try {
                for (var inactiveConstraints_5 = (e_7 = void 0, __values(inactiveConstraints)), inactiveConstraints_5_1 = inactiveConstraints_5.next(); !inactiveConstraints_5_1.done; inactiveConstraints_5_1 = inactiveConstraints_5.next()) {
                    var inactiveConstraint = inactiveConstraints_5_1.value;
                    if (inactiveConstraint >= start) {
                        break;
                    }
                    deltaj += 1;
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (inactiveConstraints_5_1 && !inactiveConstraints_5_1.done && (_a = inactiveConstraints_5.return)) _a.call(inactiveConstraints_5);
                }
                finally { if (e_7) throw e_7.error; }
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, periodicControlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        //Adding periodic term inside the Matrix
        // The effect of the first control points over the constraints at the end
        for (var i = 0; i < degree; i += 1) {
            // moved control point : i
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]
            var start = i - degree + periodicControlPointsLength;
            var lessThan = periodicControlPointsLength;
            var h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (var i = 0; i < degree; i += 1) {
            var start = i - degree + periodicControlPointsLength;
            var lessThan = periodicControlPointsLength;
            var h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        for (var i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (2 * degree - 2);
            var lessThan = (periodicControlPointsLength) * (2 * degree - 2);
            var deltaj = 0;
            try {
                for (var inactiveConstraints_6 = (e_8 = void 0, __values(inactiveConstraints)), inactiveConstraints_6_1 = inactiveConstraints_6.next(); !inactiveConstraints_6_1.done; inactiveConstraints_6_1 = inactiveConstraints_6.next()) {
                    var inactiveConstraint = inactiveConstraints_6_1.value;
                    if (inactiveConstraint >= start) {
                        break;
                    }
                    deltaj += 1;
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (inactiveConstraints_6_1 && !inactiveConstraints_6_1.done && (_b = inactiveConstraints_6.return)) _b.call(inactiveConstraints_6);
                }
                finally { if (e_8) throw e_8.error; }
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i - periodicControlPointsLength, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    };
    OptProblemPeriodicBSplineR1toR2.prototype.compute_inflectionConstraints_gradientPreviousIteration = function (constraintsSign, inactiveConstraints) {
        var e_9, _a, e_10, _b;
        var sxu = this._previousAnalyticHighOrderCurveDerivatives.bdsxu;
        var sxuu = this._previousAnalyticHighOrderCurveDerivatives.bdsxuu;
        var syu = this._previousAnalyticHighOrderCurveDerivatives.bdsyu;
        var syuu = this._previousAnalyticHighOrderCurveDerivatives.bdsyuu;
        var dgx = [];
        var dgy = [];
        var periodicControlPointsLength = this.spline.freeControlPoints.length;
        var degree = this.spline.degree;
        for (var i = 0; i < periodicControlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(periodicControlPointsLength, i + 1);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (var i = 0; i < periodicControlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(periodicControlPointsLength, i + 1);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        var totalNumberOfConstraints = this.inflectionConstraintsSign.length;
        var result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * periodicControlPointsLength);
        for (var i = 0; i < periodicControlPointsLength; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (2 * degree - 2);
            var lessThan = Math.min(periodicControlPointsLength, i + 1) * (2 * degree - 2);
            var deltaj = 0;
            try {
                for (var inactiveConstraints_7 = (e_9 = void 0, __values(inactiveConstraints)), inactiveConstraints_7_1 = inactiveConstraints_7.next(); !inactiveConstraints_7_1.done; inactiveConstraints_7_1 = inactiveConstraints_7.next()) {
                    var inactiveConstraint = inactiveConstraints_7_1.value;
                    if (inactiveConstraint >= start) {
                        break;
                    }
                    deltaj += 1;
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (inactiveConstraints_7_1 && !inactiveConstraints_7_1.done && (_a = inactiveConstraints_7.return)) _a.call(inactiveConstraints_7);
                }
                finally { if (e_9) throw e_9.error; }
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, periodicControlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        //Adding periodic term inside the Matrix
        // The effect of the first control points over the constraints at the end
        for (var i = 0; i < degree; i += 1) {
            // moved control point : i
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]
            var start = i - degree + periodicControlPointsLength;
            var lessThan = periodicControlPointsLength;
            var h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (var i = 0; i < degree; i += 1) {
            var start = i - degree + periodicControlPointsLength;
            var lessThan = periodicControlPointsLength;
            var h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        for (var i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (2 * degree - 2);
            var lessThan = (periodicControlPointsLength) * (2 * degree - 2);
            var deltaj = 0;
            try {
                for (var inactiveConstraints_8 = (e_10 = void 0, __values(inactiveConstraints)), inactiveConstraints_8_1 = inactiveConstraints_8.next(); !inactiveConstraints_8_1.done; inactiveConstraints_8_1 = inactiveConstraints_8.next()) {
                    var inactiveConstraint = inactiveConstraints_8_1.value;
                    if (inactiveConstraint >= start) {
                        break;
                    }
                    deltaj += 1;
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (inactiveConstraints_8_1 && !inactiveConstraints_8_1.done && (_b = inactiveConstraints_8.return)) _b.call(inactiveConstraints_8);
                }
                finally { if (e_10) throw e_10.error; }
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i - periodicControlPointsLength, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    };
    OptProblemPeriodicBSplineR1toR2.prototype.computeBasisFunctionsDerivatives = function () {
        var n = this.spline.controlPoints.length;
        var m = this.spline.freeControlPoints.length;
        this._numberOfIndependentVariables = m * 2;
        var diracControlPoints = MathVectorBasicOperations_1.zeroVector(n);
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];
        for (var i = 0; i < m; i += 1) {
            diracControlPoints[i] = 1;
            if (i < (n - m)) {
                // the condition (n-m) enables to take into account the multiplicity of the knot at the boundary of the curve interval u=0
                diracControlPoints[m + i] = 1;
            }
            var basisFunction = this.bSplineR1toR1Factory(diracControlPoints.slice(), this.spline.knots.slice());
            var dBasisFunction_du = basisFunction.derivative();
            var d2BasisFunction_du2 = dBasisFunction_du.derivative();
            var d3BasisFunction_du3 = d2BasisFunction_du2.derivative();
            this.dBasisFunctions_du.push(dBasisFunction_du.bernsteinDecomposition());
            this.d2BasisFunctions_du2.push(d2BasisFunction_du2.bernsteinDecomposition());
            this.d3BasisFunctions_du3.push(d3BasisFunction_du3.bernsteinDecomposition());
            diracControlPoints[i] = 0;
            if (i < (n - m)) {
                diracControlPoints[m + i] = 0;
            }
        }
    };
    return OptProblemPeriodicBSplineR1toR2;
}(AbstractOptProblemBSplineR1toR2_1.AbstractOptProblemBSplineR1toR2));
exports.OptProblemPeriodicBSplineR1toR2 = OptProblemPeriodicBSplineR1toR2;
var OptProblemPeriodicBSplineR1toR2NoInactiveConstraints = /** @class */ (function (_super) {
    __extends(OptProblemPeriodicBSplineR1toR2NoInactiveConstraints, _super);
    function OptProblemPeriodicBSplineR1toR2NoInactiveConstraints(splineInitial, shapeSpaceDiffEventsStructure) {
        return _super.call(this, splineInitial, shapeSpaceDiffEventsStructure) || this;
    }
    OptProblemPeriodicBSplineR1toR2NoInactiveConstraints.prototype.computeInactiveConstraints = function (controlPoints) {
        return [];
    };
    return OptProblemPeriodicBSplineR1toR2NoInactiveConstraints;
}(OptProblemPeriodicBSplineR1toR2));
exports.OptProblemPeriodicBSplineR1toR2NoInactiveConstraints = OptProblemPeriodicBSplineR1toR2NoInactiveConstraints;
