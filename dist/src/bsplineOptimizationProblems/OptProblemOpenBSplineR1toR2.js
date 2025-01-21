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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace = exports.OptProblemOpenBSplineR1toR2WithWeigthingFactorsDedicatedToCubics = exports.OptProblemOpenBSplineR1toR2NoInactiveConstraints = exports.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints = exports.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities = exports.OptProblemOPenBSplineR1toR2WithWeigthingFactors = exports.OptProblemOpenBSplineR1toR2 = exports.WEIGHT_AT_EXTREMITIES = exports.DEFAULT_WEIGHT = exports.CONSTRAINT_BOUND_THRESHOLD = exports.eventMove = void 0;
var MathVectorBasicOperations_1 = require("../linearAlgebra/MathVectorBasicOperations");
var BSplineR1toR1_1 = require("../newBsplines/BSplineR1toR1");
var DiagonalMatrix_1 = require("../linearAlgebra/DiagonalMatrix");
var DenseMatrix_1 = require("../linearAlgebra/DenseMatrix");
var SymmetricMatrix_1 = require("../linearAlgebra/SymmetricMatrix");
var NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
var BSplineR1toR2DifferentialProperties_1 = require("../newBsplines/BSplineR1toR2DifferentialProperties");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var PolygonWithVerticesR1_1 = require("../containers/PolygonWithVerticesR1");
var OscillatingPolygonWithVerticesR1_1 = require("../containers/OscillatingPolygonWithVerticesR1");
var ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
var DifferentialEventVariation_1 = require("../sequenceOfDifferentialEvents/DifferentialEventVariation");
var AbstractOptProblemBSplineR1toR2_1 = require("./AbstractOptProblemBSplineR1toR2");
var ShapeSpaceBoundaryEnforcer_1 = require("../curveShapeSpaceNavigation/ShapeSpaceBoundaryEnforcer");
var eventMove;
(function (eventMove) {
    eventMove[eventMove["still"] = 0] = "still";
    eventMove[eventMove["moveToKnotLR"] = 1] = "moveToKnotLR";
    eventMove[eventMove["moveAwayFromKnotRL"] = 2] = "moveAwayFromKnotRL";
    eventMove[eventMove["moveToKnotRL"] = 3] = "moveToKnotRL";
    eventMove[eventMove["moveAwayFromKnotLR"] = 4] = "moveAwayFromKnotLR";
    eventMove[eventMove["atKnot"] = 5] = "atKnot";
})(eventMove = exports.eventMove || (exports.eventMove = {}));
var transitionCP;
(function (transitionCP) {
    transitionCP[transitionCP["negativeToPositive"] = 0] = "negativeToPositive";
    transitionCP[transitionCP["positiveToNegative"] = 1] = "positiveToNegative";
    transitionCP[transitionCP["none"] = 2] = "none";
})(transitionCP || (transitionCP = {}));
var DEVIATION_FROM_KNOT = 0.25;
exports.CONSTRAINT_BOUND_THRESHOLD = 1.0e-7;
exports.DEFAULT_WEIGHT = 1;
exports.WEIGHT_AT_EXTREMITIES = 10;
var OptProblemOpenBSplineR1toR2 = /** @class */ (function (_super) {
    __extends(OptProblemOpenBSplineR1toR2, _super);
    function OptProblemOpenBSplineR1toR2(splineInitial, shapeSpaceDiffEventsStructure) {
        var _this = _super.call(this, splineInitial, shapeSpaceDiffEventsStructure) || this;
        _this.isComputingHessian = false;
        _this.Dh5xx = [];
        _this.Dh6_7xy = [];
        _this.Dh8_9xx = [];
        _this.Dh10_11xy = [];
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        _this._analyticHighOrderCurveDerivatives = _this.initExpansiveComputations();
        // e = this.expensiveComputation(this._spline);
        _this._analyticHighOrderCurveDerivatives = _this.expensiveComputation(_this._spline);
        if (_this._shapeSpaceDiffEventsStructure.activeControlInflections || _this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
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
        if (_this.isComputingHessian) {
            var e = _this.expensiveComputation(_this.spline);
            _this.prepareForHessianComputation(_this.dBasisFunctions_du, _this.d2BasisFunctions_du2, _this.d3BasisFunctions_du3);
            _this._hessian_f = _this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu, e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, _this.curvatureExtremaConstraintsSign, _this.curvatureExtremaInactiveConstraints);
        }
        _this.nbZeros = [];
        _this.curvatureDerivativeBuffer = [];
        return _this;
    }
    Object.defineProperty(OptProblemOpenBSplineR1toR2.prototype, "f", {
        get: function () {
            if (MathVectorBasicOperations_1.containsNaN(this._f)) {
                throw new Error("OptimizationProblem_BSpline_R1_to_R2 contains Nan in its f vector");
            }
            return this._f;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptProblemOpenBSplineR1toR2.prototype, "spline", {
        get: function () {
            return this._spline;
        },
        set: function (spline) {
            this._spline = spline;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptProblemOpenBSplineR1toR2.prototype, "previousSpline", {
        get: function () {
            return this._previousSpline;
        },
        enumerable: false,
        configurable: true
    });
    OptProblemOpenBSplineR1toR2.prototype.bSplineR1toR1Factory = function (controlPoints, knots) {
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    };
    OptProblemOpenBSplineR1toR2.prototype.computeBasisFunctionsDerivatives = function () {
        var n = this.spline.controlPoints.length;
        this._numberOfIndependentVariables = n * 2;
        var diracControlPoints = MathVectorBasicOperations_1.zeroVector(n);
        var secondOrderSplineDerivatives = [];
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];
        if (this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            for (var i = 0; i < n; i += 1) {
                diracControlPoints[i] = 1;
                var s = new BSplineR1toR1_1.BSplineR1toR1(diracControlPoints.slice(), this.spline.knots.slice());
                var su = s.derivative();
                var suu = su.derivative();
                secondOrderSplineDerivatives.push(suu);
                var suBDecomp = su.bernsteinDecomposition();
                var suuBDecomp = suu.bernsteinDecomposition();
                this.dBasisFunctions_du.push(suBDecomp);
                this.d2BasisFunctions_du2.push(suuBDecomp);
                diracControlPoints[i] = 0;
            }
        }
        if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            var diracControlPoints_1 = MathVectorBasicOperations_1.zeroVector(n);
            for (var i = 0; i < n; i += 1) {
                diracControlPoints_1[i] = 1;
                var suuu = secondOrderSplineDerivatives[i].derivative();
                var suuuBDecomp = suuu.bernsteinDecomposition();
                this.d3BasisFunctions_du3.push(suuuBDecomp);
                diracControlPoints_1[i] = 0;
            }
        }
    };
    OptProblemOpenBSplineR1toR2.prototype.computeSignChangeIntervals = function (constraintsSign) {
        var signChangesIntervals = [];
        var previousSign = constraintsSign[0];
        for (var i = 1, n = constraintsSign.length; i < n; i += 1) {
            if (previousSign !== constraintsSign[i]) {
                signChangesIntervals.push(i - 1);
            }
            previousSign = constraintsSign[i];
        }
        return signChangesIntervals;
    };
    OptProblemOpenBSplineR1toR2.prototype.inactivateConstraintsAtCurveEXtremities = function (controlPoints, inactiveConstraints) {
        if (inactiveConstraints.indexOf(0) === -1)
            inactiveConstraints.splice(0, 0, 0);
        if (inactiveConstraints.indexOf(controlPoints.length - 1) === -1)
            inactiveConstraints.push(controlPoints.length - 1);
    };
    /**
     * Some contraints are set inactive to allowed the point of curvature extrema to slide along the curve.
     * A curvature extremum or an inflection is located between two coefficient of different signs.
     * For the general case, the smallest coefficient in absolute value is chosen to be free.
     * For the specific case of two successive sign changes, the coefficient in the middle is chosen.
     *
     * @param constraintsSign The vector of sign for the constraints: sign f_i <= 0
     * @param controlPoints The vector of value of the function: f_i
     */
    OptProblemOpenBSplineR1toR2.prototype.computeInactiveConstraints = function (controlPoints) {
        this.checkConstraintTypeConsistency(controlPoints);
        var result = this.extractVerticesLocallyClosestToZero(controlPoints);
        return result;
    };
    OptProblemOpenBSplineR1toR2.prototype.extractVerticesLocallyClosestToZero = function (controlPoints) {
        var e_1, _a;
        var indicesConstraints = [];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(controlPoints);
        var oscillatingPolygons = polygon.extractOscillatingPolygons();
        if (oscillatingPolygons.length !== 0) {
            var oscillatingPolygonsWithAdjacency = OscillatingPolygonWithVerticesR1_1.extractAdjacentOscillatingPolygons(oscillatingPolygons);
            try {
                for (var oscillatingPolygonsWithAdjacency_1 = __values(oscillatingPolygonsWithAdjacency), oscillatingPolygonsWithAdjacency_1_1 = oscillatingPolygonsWithAdjacency_1.next(); !oscillatingPolygonsWithAdjacency_1_1.done; oscillatingPolygonsWithAdjacency_1_1 = oscillatingPolygonsWithAdjacency_1.next()) {
                    var oscillatingPolyWithAdj = oscillatingPolygonsWithAdjacency_1_1.value;
                    if (oscillatingPolyWithAdj.oscillatingPolygons[0].closestVertexAtBeginning.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
                        indicesConstraints.push(oscillatingPolyWithAdj.oscillatingPolygons[0].closestVertexAtBeginning.index);
                    }
                    if (oscillatingPolyWithAdj.oscillatingPolygons.length !== 1) {
                        for (var connectionIndex = 0; connectionIndex < (oscillatingPolyWithAdj.oscillatingPolygons.length - 1); connectionIndex++) {
                            var compatibleConstraint = oscillatingPolyWithAdj.getClosestVertexToZeroAtConnection(connectionIndex);
                            if (compatibleConstraint.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE && indicesConstraints[indicesConstraints.length - 1] !== compatibleConstraint.index) {
                                indicesConstraints.push(compatibleConstraint.index);
                            }
                            else {
                                var indexEnd = oscillatingPolyWithAdj.oscillatingPolygons[connectionIndex].closestVertexAtEnd.index;
                                if (indexEnd !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE && indicesConstraints[indicesConstraints.length - 1] !== indexEnd) {
                                    indicesConstraints.push(oscillatingPolyWithAdj.oscillatingPolygons[connectionIndex].closestVertexAtEnd.index);
                                }
                                var indexBgng = oscillatingPolyWithAdj.oscillatingPolygons[connectionIndex + 1].closestVertexAtBeginning.index;
                                if (indexBgng !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE && indicesConstraints[indicesConstraints.length - 1] !== indexBgng) {
                                    indicesConstraints.push(indexBgng);
                                }
                            }
                        }
                    }
                    var nbOscillatingPolygons = oscillatingPolyWithAdj.oscillatingPolygons.length;
                    var index = oscillatingPolyWithAdj.oscillatingPolygons[nbOscillatingPolygons - 1].closestVertexAtEnd.index;
                    if (index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE && indicesConstraints[indicesConstraints.length - 1] !== index) {
                        indicesConstraints.push(index);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (oscillatingPolygonsWithAdjacency_1_1 && !oscillatingPolygonsWithAdjacency_1_1.done && (_a = oscillatingPolygonsWithAdjacency_1.return)) _a.call(oscillatingPolygonsWithAdjacency_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return indicesConstraints;
    };
    OptProblemOpenBSplineR1toR2.prototype.checkConstraintTypeConsistency = function (controlPoints) {
        var valid = false;
        if (controlPoints.length === this._inflectionTotalNumberOfConstraints && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection) {
            valid = true;
        }
        else if (controlPoints.length === this._curvatureExtremaTotalNumberOfConstraints && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema) {
            valid = true;
        }
        if (!valid) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConstraintTypeConsistency", "The number of constraints to analyse is not consistent with the type of constraint prescribed: please check.");
            error.logMessage();
        }
    };
    OptProblemOpenBSplineR1toR2.prototype.g = function () {
        // const e = this.expensiveComputation(this.spline);
        // return this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
        this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this.spline);
        return this.curvatureDerivativeNumerator();
    };
    OptProblemOpenBSplineR1toR2.prototype.gradient_g = function () {
        var e = this.expensiveComputation(this.spline);
        return this.gradient_curvatureDerivativeNumerator(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu, e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4);
    };
    OptProblemOpenBSplineR1toR2.prototype.gradient_curvatureDerivativeNumerator = function (sxu, syu, sxuu, syuu, sxuuu, syuuu, h1, h2, h3, h4) {
        var dgx = [];
        var dgy = [];
        var m = this.spline.controlPoints.length;
        var n = this.curvatureExtremaTotalNumberOfConstraints;
        var result = new DenseMatrix_1.DenseMatrix(n, 2 * m);
        for (var i = 0; i < m; i += 1) {
            var h5 = this.dBasisFunctions_du[i].multiply(sxu);
            var h6 = this.dBasisFunctions_du[i].multiply(syuuu);
            var h7 = syu.multiply(this.d3BasisFunctions_du3[i]).multiplyByScalar(-1);
            var h8 = this.dBasisFunctions_du[i].multiply(sxuu);
            var h9 = sxu.multiply(this.d2BasisFunctions_du2[i]);
            var h10 = this.dBasisFunctions_du[i].multiply(syuu);
            var h11 = syu.multiply(this.d2BasisFunctions_du2[i]).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2).multiplyByScalar(2)).add(h1.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4))).add((h10.add(h11)).multiply(h3))).multiplyByScalar(-3)));
        }
        for (var i = 0; i < m; i += 1) {
            var h5 = this.dBasisFunctions_du[i].multiply(syu);
            var h6 = this.dBasisFunctions_du[i].multiply(sxuuu).multiplyByScalar(-1);
            var h7 = sxu.multiply(this.d3BasisFunctions_du3[i]);
            var h8 = this.dBasisFunctions_du[i].multiply(syuu);
            var h9 = syu.multiply(this.d2BasisFunctions_du2[i]);
            var h10 = this.dBasisFunctions_du[i].multiply(sxuu).multiplyByScalar(-1);
            var h11 = sxu.multiply(this.d2BasisFunctions_du2[i]);
            dgy.push((h5.multiply(h2).multiplyByScalar(2)).add(h1.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4))).add((h10.add(h11)).multiply(h3))).multiplyByScalar(-3)));
        }
        for (var i = 0; i < m; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            for (var j = 0; j < n; j += 1) {
                result.set(j, i, cpx[j]);
                result.set(j, m + i, cpy[j]);
            }
        }
        return result;
    };
    // compute_curvatureExtremaConstraints_gradient( e: ExpensiveComputationResults,
    //                                                 constraintsSign: number[], 
    //                                                 inactiveConstraints: number[]): DenseMatrix {
    OptProblemOpenBSplineR1toR2.prototype.compute_curvatureExtremaConstraints_gradient = function (constraintsSign, inactiveConstraints) {
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
        var controlPointsLength = this.spline.controlPoints.length;
        var totalNumberOfConstraints = this.curvatureExtremaTotalNumberOfConstraints;
        var degree = this.spline.degree;
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
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
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
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
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        var result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength);
        for (var i = 0; i < controlPointsLength; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (4 * degree - 5);
            var lessThan = Math.min(controlPointsLength - degree, i + 1) * (4 * degree - 5);
            var deltaj = 0;
            for (var i_1 = 0; i_1 < inactiveConstraints.length; i_1 += 1) {
                if (inactiveConstraints[i_1] >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    };
    OptProblemOpenBSplineR1toR2.prototype.compute_curvatureExtremaConstraints_gradientPreviousIteration = function (constraintsSign, inactiveConstraints) {
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
        var controlPointsLength = this.spline.controlPoints.length;
        var totalNumberOfConstraints = this.curvatureExtremaTotalNumberOfConstraints;
        var degree = this.spline.degree;
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
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
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
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
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        var result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength);
        for (var i = 0; i < controlPointsLength; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (4 * degree - 5);
            var lessThan = Math.min(controlPointsLength - degree, i + 1) * (4 * degree - 5);
            var deltaj = 0;
            for (var i_2 = 0; i_2 < inactiveConstraints.length; i_2 += 1) {
                if (inactiveConstraints[i_2] >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    };
    OptProblemOpenBSplineR1toR2.prototype.traceCurvatureExtrema = function () {
        var curvatureExtrema_gradientsPrevious = [];
        var curvatureDerivative_gradientUPrevious = [];
        var knotsCurvatureDerivNumerator = this._shapeSpaceDiffEventsStructure.curveShapeSpaceNavigator.navigationState.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.knots;
        var gradient_curvatureExtremaPrevious = this.compute_curvatureExtremaConstraints_gradientPreviousIteration(this.curvatureExtremaConstraintsSign, []);
        var curvatureDerivativePrevious = this.bSplineR1toR1Factory(this.curvatureDerivativeNumeratorPreviousIteration(), knotsCurvatureDerivNumerator);
        // let curvatureDerivativePrevious = new BSplineR1toR1(this.curvatureDerivativeNumeratorPreviousIteration(), knotsCurvatureDerivNumerator);
        var zerosCuratureDerivPrevious = curvatureDerivativePrevious.zeros();
        var curvatureDerivative = this.bSplineR1toR1Factory(this.curvatureDerivativeNumerator(), knotsCurvatureDerivNumerator);
        var zerosCuratureDeriv = curvatureDerivative.zeros();
        var curveDP = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(this.previousSpline);
        var curvatureDeriv = curveDP.curvatureDerivativeNumerator();
        var zerosCDeriv = curvatureDeriv.zeros();
        console.log("zeros from BSplineDifProp = " + zerosCDeriv);
        var curveDPcurrent = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(this.spline);
        var curvatureDerivCurrent = curveDPcurrent.curvatureDerivativeNumerator();
        var zerosCDerivCurrent = curvatureDerivCurrent.zeros();
        console.log("zeros current from BSplineDifProp = " + zerosCDerivCurrent);
        if (this.nbZeros.length < 2) {
            this.nbZeros.push(zerosCuratureDerivPrevious.length);
            this.curvatureDerivativeBuffer.push(curvatureDerivativePrevious);
        }
        else if (this.nbZeros.length === 2) {
            this.nbZeros.splice(0, 1);
            this.curvatureDerivativeBuffer.splice(0, 1);
            this.nbZeros.push(zerosCuratureDerivPrevious.length);
            this.curvatureDerivativeBuffer.push(curvatureDerivativePrevious);
        }
        console.log("estimate variations of zeros during optim iteration. nb zeros = " + zerosCuratureDerivPrevious.length);
        console.log("spline previous = " + JSON.stringify(this.previousSpline.controlPoints));
        console.log("spline current = " + JSON.stringify(this.spline.controlPoints));
        if (zerosCuratureDerivPrevious.length === 2 && zerosCuratureDeriv.length === 0) {
            // console.log("nbZ[0] = "+this.nbZeros[0]+" Bvert = "+this.curvatureDerivativeBuffer[0].controlPoints+" nbZ[1] = "+this.nbZeros[1]+" Bvert = "+this.curvatureDerivativeBuffer[1].controlPoints);
            console.log("B[0] = " + curvatureDerivative.evaluate(zerosCuratureDerivPrevious[0]) + " B[1] = " + curvatureDerivative.evaluate(zerosCuratureDerivPrevious[1]));
            if (curvatureDerivative.evaluate(zerosCuratureDerivPrevious[0]) < 0.0 && curvatureDerivative.evaluate(zerosCuratureDerivPrevious[1]) < 0.0) {
                console.log("Two curvature extrema have merged");
            }
        }
        var curvatureSecondDerivativePrevious = curvatureDerivativePrevious.derivative();
        for (var i = 0; i < zerosCuratureDerivPrevious.length; i++) {
            console.log("zero location[ " + i + " ] = " + zerosCuratureDerivPrevious[i]);
            curvatureDerivative_gradientUPrevious.push(curvatureSecondDerivativePrevious.evaluate(zerosCuratureDerivPrevious[i]));
            if (gradient_curvatureExtremaPrevious.shape[0] !== this._shapeSpaceDiffEventsStructure.curveShapeSpaceNavigator.navigationState.curveAnalyserCurrentCurve.curvatureDerivativeNumerator.controlPoints.length) {
                console.log('inconsistent sizes of control polygons !!');
            }
            var curvatureExtrema_gradientperCPComponent = [];
            for (var k = 0; k < gradient_curvatureExtremaPrevious.shape[1]; k++) {
                var gradient = [];
                for (var j = 0; j < gradient_curvatureExtremaPrevious.shape[0]; j++) {
                    gradient.push(gradient_curvatureExtremaPrevious.get(j, k));
                }
                var spline = new BSplineR1toR1_1.BSplineR1toR1(gradient, knotsCurvatureDerivNumerator);
                curvatureExtrema_gradientperCPComponent.push(spline.evaluate(zerosCuratureDerivPrevious[i]));
            }
            curvatureExtrema_gradientsPrevious.push(curvatureExtrema_gradientperCPComponent);
        }
        var flattenedCPsplinePrevious = this.previousSpline.flattenControlPointsArray();
        var flattenedCPsplineUpdated = this.spline.flattenControlPointsArray();
        var curvatureDerivativeVariationWrtCP = [];
        var variationCP = [];
        for (var i = 0; i < flattenedCPsplinePrevious.length; i++) {
            variationCP.push(flattenedCPsplineUpdated[i] - flattenedCPsplinePrevious[i]);
        }
        for (var i = 0; i < curvatureExtrema_gradientsPrevious.length; i++) {
            var gradient = 0.0;
            for (var j = 0; j < curvatureExtrema_gradientsPrevious[i].length; j++) {
                gradient = gradient + curvatureExtrema_gradientsPrevious[i][j] * variationCP[j];
            }
            curvatureDerivativeVariationWrtCP.push(gradient);
        }
        var zerosVariations = [];
        for (var i = 0; i < curvatureDerivativeVariationWrtCP.length; i++) {
            console.log("sum variation B(u) wrt CP at [" + i + "]= " + curvatureDerivativeVariationWrtCP[i] + " gradientUprevious = " + curvatureDerivative_gradientUPrevious[i]);
            zerosVariations.push(-(curvatureDerivativeVariationWrtCP[i]) / curvatureDerivative_gradientUPrevious[i]);
        }
        var zerosPreviousCurve = [0.0];
        var zerosEstimated = [0.0];
        for (var i = 0; i < zerosCuratureDerivPrevious.length; i++) {
            var zeroLoc = zerosCuratureDerivPrevious[i];
            zerosPreviousCurve.push(zeroLoc);
            console.log("estimated zero from previous iter location[ " + i + " ] = " + (zeroLoc + zerosVariations[i]) + " variation = " + zerosVariations[i]);
            zerosEstimated.push(zeroLoc + zerosVariations[i]);
        }
        zerosPreviousCurve.push(1.0);
        zerosEstimated.push(1.0);
        for (var i = 1; i < zerosPreviousCurve.length; i++) {
            var interval = (zerosPreviousCurve[i] - zerosPreviousCurve[i - 1]);
            var intervalEstimated = (zerosEstimated[i] - zerosEstimated[i - 1]);
            var intervalVariation = intervalEstimated - interval;
            if (intervalEstimated < 0.0)
                console.log("estimated interval[ " + i + " ] with zeros crossing");
            if (intervalEstimated < interval)
                console.log("interval[ " + i + " ]" + " shrinks: " + intervalVariation);
            if (intervalEstimated > interval)
                console.log("interval[ " + i + " ]" + " expands: " + intervalVariation);
        }
    };
    // compute_inflectionConstraints_gradient( e: ExpensiveComputationResults,
    //                                         constraintsSign: number[], 
    //                                         inactiveConstraints: number[]): DenseMatrix {
    OptProblemOpenBSplineR1toR2.prototype.compute_inflectionConstraints_gradient = function (constraintsSign, inactiveConstraints) {
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
        var controlPointsLength = this.spline.controlPoints.length;
        var degree = this.spline.degree;
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        var totalNumberOfConstraints = this.inflectionConstraintsSign.length;
        var result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength);
        for (var i = 0; i < controlPointsLength; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (2 * degree - 2);
            var lessThan = Math.min(controlPointsLength - degree, i + 1) * (2 * degree - 2);
            var deltaj = 0;
            for (var i_3 = 0; i_3 < inactiveConstraints.length; i_3 += 1) {
                if (inactiveConstraints[i_3] >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    };
    OptProblemOpenBSplineR1toR2.prototype.compute_inflectionConstraints_gradientPreviousIteration = function (constraintsSign, inactiveConstraints) {
        var sxu = this._previousAnalyticHighOrderCurveDerivatives.bdsxu;
        var sxuu = this._previousAnalyticHighOrderCurveDerivatives.bdsxuu;
        var syu = this._previousAnalyticHighOrderCurveDerivatives.bdsyu;
        var syuu = this._previousAnalyticHighOrderCurveDerivatives.bdsyuu;
        var dgx = [];
        var dgy = [];
        var controlPointsLength = this.spline.controlPoints.length;
        var degree = this.spline.degree;
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        var totalNumberOfConstraints = this.inflectionConstraintsSign.length;
        var result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength);
        for (var i = 0; i < controlPointsLength; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (2 * degree - 2);
            var lessThan = Math.min(controlPointsLength - degree, i + 1) * (2 * degree - 2);
            var deltaj = 0;
            for (var i_4 = 0; i_4 < inactiveConstraints.length; i_4 += 1) {
                if (inactiveConstraints[i_4] >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    };
    OptProblemOpenBSplineR1toR2.prototype.compute_hessian_f = function (sxu, syu, sxuu, syuu, sxuuu, syuuu, h1, h2, h3, h4, constraintsSign, inactiveConstraints) {
        var n = this.spline.controlPoints.length;
        var result = [];
        var h5x = [];
        var h5y = [];
        var h6x = [];
        var h6y = [];
        var h7x = [];
        var h7y = [];
        var h8x = [];
        var h8y = [];
        var h9x = [];
        var h9y = [];
        var h10x = [];
        var h10y = [];
        var h11x = [];
        var h11y = [];
        var hessian_gxx = [];
        var hessian_gyy = [];
        var hessian_gxy = [];
        for (var i = 0; i < n; i += 1) {
            hessian_gxx.push([]);
            hessian_gyy.push([]);
            hessian_gxy.push([]);
        }
        for (var i = 0; i < n; i += 1) {
            h5x.push(this.dBasisFunctions_du[i].multiply(sxu));
            h6x.push(this.dBasisFunctions_du[i].multiply(syuuu));
            h7x.push(syu.multiply(this.d3BasisFunctions_du3[i]).multiplyByScalar(-1));
            h8x.push(this.dBasisFunctions_du[i].multiply(sxuu));
            h9x.push(sxu.multiply(this.d2BasisFunctions_du2[i]));
            h10x.push(this.dBasisFunctions_du[i].multiply(syuu));
            h11x.push(syu.multiply(this.d2BasisFunctions_du2[i]).multiplyByScalar(-1));
        }
        for (var i = 0; i < n; i += 1) {
            h5y.push(this.dBasisFunctions_du[i].multiply(syu));
            h6y.push(this.dBasisFunctions_du[i].multiply(sxuuu).multiplyByScalar(-1));
            h7y.push(sxu.multiply(this.d3BasisFunctions_du3[i]));
            h8y.push(this.dBasisFunctions_du[i].multiply(syuu));
            h9y.push(syu.multiply(this.d2BasisFunctions_du2[i]));
            h10y.push(this.dBasisFunctions_du[i].multiply(sxuu).multiplyByScalar(-1));
            h11y.push(sxu.multiply(this.d2BasisFunctions_du2[i]));
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j <= i; j += 1) {
                var term1 = this.Dh5xx[i][j].multiply(h2).multiplyByScalar(2);
                var term2xx = ((h5x[j].multiply(h6x[i].add(h7x[i]))).add(h5x[i].multiply((h6x[j].add(h7x[j]))))).multiplyByScalar(2);
                var term2yy = ((h5y[j].multiply(h6y[i].add(h7y[i]))).add(h5y[i].multiply((h6y[j].add(h7y[j]))))).multiplyByScalar(2);
                // term3 = 0
                var term4 = this.Dh8_9xx[i][j].multiply(h4).multiplyByScalar(-3);
                var term5xx = (((h8x[j].add(h9x[j])).multiply(h10x[i].add(h11x[i]))).add((h8x[i].add(h9x[i])).multiply((h10x[j].add(h11x[j]))))).multiplyByScalar(-3);
                var term5yy = (((h8y[j].add(h9y[j])).multiply(h10y[i].add(h11y[i]))).add((h8y[i].add(h9y[i])).multiply((h10y[j].add(h11y[j]))))).multiplyByScalar(-3);
                // term 6 = 0
                hessian_gxx[i][j] = (term1.add(term2xx).add(term4).add(term5xx)).flattenControlPointsArray();
                hessian_gyy[i][j] = (term1.add(term2yy).add(term4).add(term5yy)).flattenControlPointsArray();
            }
        }
        for (var i = 1; i < n; i += 1) {
            for (var j = 0; j < i; j += 1) {
                // term1 = 0
                var term2xy = ((h5x[j].multiply(h6y[i].add(h7y[i]))).add(h5y[i].multiply((h6x[j].add(h7x[j]))))).multiplyByScalar(2);
                var term3 = this.Dh6_7xy[j][i].multiply(h1).multiplyByScalar(-1); //Dh_6_7xy is antisymmetric
                // term4 = 0
                var term5xy = (((h8x[j].add(h9x[j])).multiply((h10y[i].add(h11y[i])))).add((h8y[i].add(h9y[i])).multiply((h10x[j].add(h11x[j]))))).multiplyByScalar(-3);
                var term6 = this.Dh10_11xy[j][i].multiply(h3).multiplyByScalar(3); //Dh_10_11xy is antisymmetric
                hessian_gxy[i][j] = (term2xy.add(term3).add(term5xy).add(term6)).flattenControlPointsArray();
            }
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = i + 1; j < n; j += 1) {
                // term1 = 0
                var term2xy = ((h5x[j].multiply((h6y[i].add(h7y[i])))).add(h5y[i].multiply((h6x[j].add(h7x[j]))))).multiplyByScalar(2);
                var term3 = this.Dh6_7xy[i][j].multiply(h1); //Dh_6_7xy is antisymmetric
                // term4 = 0
                var term5xy = (((h8x[j].add(h9x[j])).multiply((h10y[i].add(h11y[i])))).add((h8y[i].add(h9y[i])).multiply((h10x[j].add(h11x[j]))))).multiplyByScalar(-3);
                var term6 = this.Dh10_11xy[i][j].multiply(h3).multiplyByScalar(-3); //Dh_10_11xy is antisymmetric
                hessian_gxy[i][j] = (term2xy.add(term3).add(term5xy).add(term6)).flattenControlPointsArray();
            }
        }
        for (var i = 0; i < n; i += 1) {
            // term1 = 0
            var term2xy = ((h5x[i].multiply(h6y[i].add(h7y[i]))).add(h5y[i].multiply((h6x[i].add(h7x[i]))))).multiplyByScalar(2);
            //const term3 = this.Dh6_7xy[i][i].multiply(h1)
            // term3 = 0
            // term4 = 0
            var term5xy = (((h8y[i].add(h9y[i])).multiply((h10x[i].add(h11x[i])))).add((h8x[i].add(h9x[i])).multiply(h10y[i].add(h11y[i])))).multiplyByScalar(-3);
            // term6 = 0
            hessian_gxy[i][i] = (term2xy.add(term5xy)).flattenControlPointsArray();
        }
        var deltak = 0;
        for (var k = 0; k < constraintsSign.length; k += 1) {
            if (k === inactiveConstraints[deltak]) {
                deltak += 1;
            }
            else {
                var m = new SymmetricMatrix_1.SymmetricMatrix(2 * n);
                for (var i = 0; i < n; i += 1) {
                    for (var j = 0; j <= i; j += 1) {
                        m.set(i, j, hessian_gxx[i][j][k] * constraintsSign[k]);
                        m.set(n + i, n + j, hessian_gyy[i][j][k] * constraintsSign[k]);
                    }
                }
                for (var i = 0; i < n; i += 1) {
                    for (var j = 0; j < n; j += 1) {
                        m.set(n + i, j, hessian_gxy[i][j][k] * constraintsSign[k]);
                    }
                }
                result.push(m);
            }
        }
        return result;
    };
    OptProblemOpenBSplineR1toR2.prototype.prepareForHessianComputation = function (Dsu, Dsuu, Dsuuu) {
        var n = this.spline.controlPoints.length;
        for (var i = 0; i < n; i += 1) {
            this.Dh5xx.push([]);
            this.Dh6_7xy.push([]);
            this.Dh8_9xx.push([]);
            this.Dh10_11xy.push([]);
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j <= i; j += 1) {
                this.Dh5xx[i][j] = Dsu[i].multiply(Dsu[j]);
            }
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j < n; j += 1) {
                this.Dh6_7xy[i][j] = (Dsu[i].multiply(Dsuuu[j])).subtract(Dsu[j].multiply(Dsuuu[i]));
            }
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j <= i; j += 1) {
                this.Dh8_9xx[i][j] = (Dsu[i].multiply(Dsuu[j])).add(Dsu[j].multiply(Dsuu[i]));
            }
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j < n; j += 1) {
                this.Dh10_11xy[i][j] = (Dsu[i].multiply(Dsuu[j])).subtract(Dsu[j].multiply(Dsuu[i]));
            }
        }
    };
    OptProblemOpenBSplineR1toR2.prototype.setTargetSpline = function (spline) {
        this._target = spline.clone();
        this._gradient_f0 = this.compute_gradient_f0(this.spline);
        this._f0 = this.compute_f0(this.gradient_f0);
    };
    return OptProblemOpenBSplineR1toR2;
}(AbstractOptProblemBSplineR1toR2_1.AbstractOptProblemBSplineR1toR2));
exports.OptProblemOpenBSplineR1toR2 = OptProblemOpenBSplineR1toR2;
var OptProblemOPenBSplineR1toR2WithWeigthingFactors = /** @class */ (function (_super) {
    __extends(OptProblemOPenBSplineR1toR2WithWeigthingFactors, _super);
    function OptProblemOPenBSplineR1toR2WithWeigthingFactors(splineInitial, shapeSpaceDiffEventsStructure) {
        var _this = _super.call(this, splineInitial, shapeSpaceDiffEventsStructure) || this;
        _this.weigthingFactors = [];
        for (var i = 0; i < _this.spline.controlPoints.length * 2; i += 1) {
            _this.weigthingFactors.push(exports.DEFAULT_WEIGHT);
        }
        return _this;
    }
    Object.defineProperty(OptProblemOPenBSplineR1toR2WithWeigthingFactors.prototype, "f0", {
        get: function () {
            var result = 0;
            var n = this._gradient_f0.length;
            for (var i = 0; i < n; i += 1) {
                result += Math.pow(this._gradient_f0[i], 2) * this.weigthingFactors[i];
            }
            return 0.5 * result;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptProblemOPenBSplineR1toR2WithWeigthingFactors.prototype, "gradient_f0", {
        get: function () {
            var result = [];
            var n = this._gradient_f0.length;
            for (var i = 0; i < n; i += 1) {
                result.push(this._gradient_f0[i] * this.weigthingFactors[i]);
            }
            return result;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptProblemOPenBSplineR1toR2WithWeigthingFactors.prototype, "hessian_f0", {
        get: function () {
            var n = this._gradient_f0.length;
            var result = new DiagonalMatrix_1.DiagonalMatrix(n);
            for (var i = 0; i < n; i += 1) {
                result.set(i, i, this.weigthingFactors[i]);
            }
            return result;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * The objective function value: f0(x + step)
     */
    OptProblemOPenBSplineR1toR2WithWeigthingFactors.prototype.f0Step = function (step) {
        var splineTemp = this._spline.clone();
        splineTemp = splineTemp.moveControlPoints(AbstractOptProblemBSplineR1toR2_1.convertStepToVector2d(step));
        var gradient = this.compute_gradient_f0(splineTemp);
        var n = gradient.length;
        var result = 0;
        for (var i = 0; i < n; i += 1) {
            result += Math.pow(gradient[i], 2) * this.weigthingFactors[i];
        }
        return 0.5 * result;
    };
    OptProblemOPenBSplineR1toR2WithWeigthingFactors.prototype.setWeightingFactor = function () {
        this.weigthingFactors[0] = exports.WEIGHT_AT_EXTREMITIES;
        this.weigthingFactors[this._spline.controlPoints.length] = exports.WEIGHT_AT_EXTREMITIES;
        this.weigthingFactors[this._spline.controlPoints.length - 1] = exports.WEIGHT_AT_EXTREMITIES;
        this.weigthingFactors[this._spline.controlPoints.length * 2 - 1] = exports.WEIGHT_AT_EXTREMITIES;
    };
    return OptProblemOPenBSplineR1toR2WithWeigthingFactors;
}(OptProblemOpenBSplineR1toR2));
exports.OptProblemOPenBSplineR1toR2WithWeigthingFactors = OptProblemOPenBSplineR1toR2WithWeigthingFactors;
var OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities = /** @class */ (function (_super) {
    __extends(OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities, _super);
    function OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities(splineInitial, shapeSpaceDiffEventsStructure) {
        var _this = _super.call(this, splineInitial, shapeSpaceDiffEventsStructure) || this;
        _this._shapeSpaceBoundaryEnforcer = new ShapeSpaceBoundaryEnforcer_1.NestedShapeSpacesBoundaryEnforcerOpenCurve();
        var e = _this.initExpansiveComputations();
        e = _this.expensiveComputation(_this._spline);
        if (_this._shapeSpaceDiffEventsStructure.activeControlInflections || _this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            _this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection;
            _this._inflectionInactiveConstraints = _this.computeInactiveConstraints(_this._curvatureNumeratorCP);
            _this.inflectionNumberOfActiveConstraints = _this._curvatureNumeratorCP.length - _this.inflectionInactiveConstraints.length;
        }
        if (_this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            _this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema;
            _this._curvatureExtremaInactiveConstraints = _this.computeInactiveConstraints(_this._curvatureDerivativeNumeratorCP);
            _this.curvatureExtremaNumberOfActiveConstraints = _this._curvatureDerivativeNumeratorCP.length - _this.curvatureExtremaInactiveConstraints.length;
        }
        _this._f = _this.compute_f(_this._curvatureNumeratorCP, _this.inflectionConstraintsSign, _this.inflectionInactiveConstraints, _this._curvatureDerivativeNumeratorCP, _this.curvatureExtremaConstraintsSign, _this.curvatureExtremaInactiveConstraints);
        // this.checkConstraintConsistency();
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints,
        //     this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        _this._gradient_f = _this.compute_gradient_f(_this.inflectionConstraintsSign, _this.inflectionInactiveConstraints, _this.curvatureExtremaConstraintsSign, _this.curvatureExtremaInactiveConstraints);
        return _this;
    }
    Object.defineProperty(OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities.prototype, "shapeSpaceBoundaryEnforcer", {
        get: function () {
            return this._shapeSpaceBoundaryEnforcer;
        },
        enumerable: false,
        configurable: true
    });
    OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities.prototype.computeInactiveConstraints = function (controlPoints) {
        var _a;
        this.checkConstraintTypeConsistency(controlPoints);
        var inactiveConstraints = this.extractVerticesLocallyClosestToZero(controlPoints);
        if (!((_a = this._shapeSpaceBoundaryEnforcer) === null || _a === void 0 ? void 0 : _a.isActive())) {
            this.inactivateConstraintsAtCurveEXtremities(controlPoints, inactiveConstraints);
        }
        else if (this._shapeSpaceBoundaryEnforcer.isCurvatureExtTransitionAtExtremity() && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema
            && inactiveConstraints.length > 0) {
            if (inactiveConstraints.indexOf(0) !== -1)
                inactiveConstraints.splice(inactiveConstraints.indexOf(0), 1);
            if (inactiveConstraints.indexOf(this._curvatureExtremaTotalNumberOfConstraints - 1) !== -1)
                inactiveConstraints.splice(inactiveConstraints.indexOf(this._curvatureExtremaTotalNumberOfConstraints - 1), 1);
        }
        else if (this._shapeSpaceBoundaryEnforcer.isInflectionTransitionAtExtremity() && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection
            && inactiveConstraints.length > 0) {
            if (inactiveConstraints.indexOf(0) !== -1)
                inactiveConstraints.splice(inactiveConstraints.indexOf(0), 1);
            if (inactiveConstraints.indexOf(this._inflectionTotalNumberOfConstraints - 1) !== -1)
                inactiveConstraints.splice(inactiveConstraints.indexOf(this._inflectionTotalNumberOfConstraints - 1), 1);
        }
        console.log("Optim EventMonitoringAtExtremities. inactive constraints" + inactiveConstraints);
        return inactiveConstraints;
    };
    OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities.prototype.step = function (deltaX) {
        var checked = true;
        // if(this._previousAnalyticHighOrderCurveDerivatives.bdsxu.flattenControlPointsArray().length === 0) {
        //     this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
        // }
        // this._previousAnalyticHighOrderCurveDerivatives = deepCopyAnalyticHighOrderCurveDerivatives(this._analyticHighOrderCurveDerivatives);
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        var curvatureNumerator = [];
        var curvatureDerivativeNumerator = [];
        // this._previousSpline = this._spline.clone();
        if (this._shapeSpaceBoundaryEnforcer.isActive()) {
            this._inflectionInactiveConstraints = [];
            this._curvatureExtremaInactiveConstraints = [];
        }
        this._spline = this.spline.moveControlPoints(AbstractOptProblemBSplineR1toR2_1.convertStepToVector2d(deltaX));
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        // e = this.expensiveComputation(this._spline);
        this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
        this.traceCurvatureExtrema();
        this._previousAnalyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        if (this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // curvatureNumerator = this.curvatureNumerator(e.h4);
            curvatureNumerator = this.curvatureNumerator();
            this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator);
            this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection;
            if (!this._shapeSpaceBoundaryEnforcer.isActive())
                this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator);
            this.inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length;
        }
        if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // curvatureDerivativeNumerator = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
            this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(curvatureDerivativeNumerator);
            this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema;
            if (!this._shapeSpaceBoundaryEnforcer.isActive())
                this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(curvatureDerivativeNumerator);
            this.curvatureExtremaNumberOfActiveConstraints = curvatureDerivativeNumerator.length - this.curvatureExtremaInactiveConstraints.length;
        }
        this._curvatureNumeratorCP = curvatureNumerator;
        this._curvatureDerivativeNumeratorCP = curvatureDerivativeNumerator;
        //console.log("step : inactive cst start: " + inactiveCurvatureConstraintsAtStart + " updated " + this.curvatureExtremaInactiveConstraints + " infl " + this.inflectionInactiveConstraints + " cst sgn " + this.curvatureExtremaConstraintsSign)
        console.log("step : inactive cst: " + this.curvatureExtremaInactiveConstraints + " cst sgn " + this.curvatureExtremaConstraintsSign);
        this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this._curvatureDerivativeNumeratorCP, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        if (this.isComputingHessian) {
            // this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
            this._hessian_f = this.compute_hessian_f(this._analyticHighOrderCurveDerivatives.bdsxu, this._analyticHighOrderCurveDerivatives.bdsyu, this._analyticHighOrderCurveDerivatives.bdsxuu, this._analyticHighOrderCurveDerivatives.bdsyuu, this._analyticHighOrderCurveDerivatives.bdsxuuu, this._analyticHighOrderCurveDerivatives.bdsyuuu, this._analyticHighOrderCurveDerivatives.h1, this._analyticHighOrderCurveDerivatives.h2, this._analyticHighOrderCurveDerivatives.h3, this._analyticHighOrderCurveDerivatives.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        }
        return checked;
    };
    OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities.prototype.update = function (spline) {
        this._spline = spline.clone();
        this.computeBasisFunctionsDerivatives();
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2;
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        this._hessian_f0 = DiagonalMatrix_1.identityMatrix(this._numberOfIndependentVariables);
        this._inflectionInactiveConstraints = [];
        this._curvatureExtremaInactiveConstraints = [];
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        // e = this.expensiveComputation(this._spline);
        this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
        if (this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // this._curvatureNumeratorCP = this.curvatureNumerator(e.h4);
            this._curvatureNumeratorCP = this.curvatureNumerator();
            this._inflectionTotalNumberOfConstraints = this._curvatureNumeratorCP.length;
            this.inflectionConstraintsSign = this.computeConstraintsSign(this._curvatureNumeratorCP);
            this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection;
            this._inflectionInactiveConstraints = this.computeInactiveConstraints(this._curvatureNumeratorCP);
            this.inflectionNumberOfActiveConstraints = this._curvatureNumeratorCP.length - this.inflectionInactiveConstraints.length;
        }
        if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator();
            this._curvatureExtremaTotalNumberOfConstraints = this._curvatureDerivativeNumeratorCP.length;
            this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(this._curvatureDerivativeNumeratorCP);
            this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema;
            this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this._curvatureDerivativeNumeratorCP);
            this.curvatureExtremaNumberOfActiveConstraints = this._curvatureDerivativeNumeratorCP.length - this.curvatureExtremaInactiveConstraints.length;
        }
        console.log("optim curv ext inactive constraints: " + this.curvatureExtremaInactiveConstraints);
        console.log("optim inflection inactive constraints: " + this.inflectionInactiveConstraints);
        this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this._curvatureDerivativeNumeratorCP, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        // this.checkConstraintConsistency();
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    };
    return OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities;
}(OptProblemOPenBSplineR1toR2WithWeigthingFactors));
exports.OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities = OptProblemOPenBSplineR1toR2WithWeigthingFactorsEventMonitoringAtExtremities;
var OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints = /** @class */ (function (_super) {
    __extends(OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints, _super);
    function OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(splineInitial, shapeSpaceDiffEventsStructure) {
        return _super.call(this, splineInitial, shapeSpaceDiffEventsStructure) || this;
    }
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints.prototype.computeInactiveConstraints = function (curvatureDerivativeNumerator) {
        return [];
    };
    return OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints;
}(OptProblemOPenBSplineR1toR2WithWeigthingFactors));
exports.OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints = OptProblemOpenBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints;
var OptProblemOpenBSplineR1toR2NoInactiveConstraints = /** @class */ (function (_super) {
    __extends(OptProblemOpenBSplineR1toR2NoInactiveConstraints, _super);
    function OptProblemOpenBSplineR1toR2NoInactiveConstraints(splineInitial, shapeSpaceDiffEventsStructure) {
        return _super.call(this, splineInitial, shapeSpaceDiffEventsStructure) || this;
    }
    OptProblemOpenBSplineR1toR2NoInactiveConstraints.prototype.computeInactiveConstraints = function (curvatureDerivativeNumerator) {
        return [];
    };
    return OptProblemOpenBSplineR1toR2NoInactiveConstraints;
}(OptProblemOpenBSplineR1toR2));
exports.OptProblemOpenBSplineR1toR2NoInactiveConstraints = OptProblemOpenBSplineR1toR2NoInactiveConstraints;
/* JCL 2020/10/06 derive a class to process cubics with specific desactivation constraint process at discontinuities of B(u) */
var OptProblemOpenBSplineR1toR2WithWeigthingFactorsDedicatedToCubics = /** @class */ (function (_super) {
    __extends(OptProblemOpenBSplineR1toR2WithWeigthingFactorsDedicatedToCubics, _super);
    function OptProblemOpenBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(splineInitial, shapeSpaceDiffEventsStructure) {
        return _super.call(this, splineInitial, shapeSpaceDiffEventsStructure) || this;
    }
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsDedicatedToCubics.prototype.computeControlPointsClosestToZeroForCubics = function (signChangesIntervals, controlPoints) {
        var result = [];
        for (var i = 0, n = signChangesIntervals.length; i < n; i += 1) {
            if (i < n - 1 && signChangesIntervals[i] + 1 === signChangesIntervals[i + 1]) {
                result.push(signChangesIntervals[i] + 1);
                i += 1;
            }
            else {
                if (Math.pow(controlPoints[signChangesIntervals[i]], 2) < Math.pow(controlPoints[signChangesIntervals[i] + 1], 2)) {
                    result.push(signChangesIntervals[i]);
                }
                else {
                    result.push(signChangesIntervals[i] + 1);
                }
            }
        }
        //console.log("degree: " + this.spline.degree + " nbKnot: " + this.spline.distinctKnots().length)
        /* JCL 2020/10/02 modification as alternative to sliding mechanism */
        if (this.spline.degree === 3 && controlPoints.length === (this.spline.getDistinctKnots().length - 1) * 7) {
            var n = Math.trunc(controlPoints.length / 7);
            console.log("degree: " + this.spline.degree + " nbCP: " + controlPoints.length);
            for (var j = 1; j < n; j += 1) {
                if (controlPoints[6 * j] * controlPoints[6 * j + 1] < 0) {
                    //console.log("CP: " + controlPoints)
                    if (result.indexOf(6 * j) > 0 && result.indexOf(6 * j + 1) < 0) {
                        result.push(6 * j + 1);
                    }
                    else if (result.indexOf(6 * j) < 0 && result.indexOf(6 * j + 1) > 0) {
                        result.push(6 * j);
                    }
                }
            }
            result.sort(function (a, b) { return (a - b); });
        }
        return result;
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsDedicatedToCubics.prototype.addInactiveConstraintsForInflections = function (list, controlPoints) {
        var result = [];
        for (var i = 0, n = list.length; i < n; i += 1) {
            if (list[i] !== 0 && controlPoints[list[i] - 1] === controlPoints[list[i]]) {
                if (i == 0) {
                    result.push(list[i] - 1);
                }
                if (i !== 0 && list[i - 1] !== list[i] - 1) {
                    result.push(list[i] - 1);
                }
            }
            result.push(list[i]);
            if (list[i] !== controlPoints.length - 2 && controlPoints[list[i]] === controlPoints[list[i] + 1]) {
                if (i == list.length - 1) {
                    result.push(list[i] + 1);
                }
                if (i !== list.length - 1 && list[i + 1] !== list[i] + 1) {
                    result.push(list[i] + 1);
                }
            }
        }
        return result;
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsDedicatedToCubics.prototype.computeInactiveConstraints = function (controlPoints) {
        var constraintsSign = this.computeConstraintsSign(controlPoints);
        var signChangesIntervals = this.computeSignChangeIntervals(constraintsSign);
        var controlPointsClosestToZero = this.computeControlPointsClosestToZeroForCubics(signChangesIntervals, controlPoints);
        var result = this.addInactiveConstraintsForInflections(controlPointsClosestToZero, controlPoints);
        return result;
    };
    return OptProblemOpenBSplineR1toR2WithWeigthingFactorsDedicatedToCubics;
}(OptProblemOPenBSplineR1toR2WithWeigthingFactors));
exports.OptProblemOpenBSplineR1toR2WithWeigthingFactorsDedicatedToCubics = OptProblemOpenBSplineR1toR2WithWeigthingFactorsDedicatedToCubics;
var OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace = /** @class */ (function (_super) {
    __extends(OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace, _super);
    function OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace(splineInitial, shapeSpaceDiffEventsStructure, navigationCurveModel) {
        var _this = _super.call(this, splineInitial, shapeSpaceDiffEventsStructure) || this;
        _this.curveAnalyzerCurrentCurve = navigationCurveModel.curveAnalyserCurrentCurve;
        _this.curveAnalyzerOptimizedCurve = navigationCurveModel.curveAnalyserOptimizedCurve;
        _this._diffEventsVariation = new DifferentialEventVariation_1.DiffrentialEventVariation(_this.curveAnalyzerCurrentCurve, _this.curveAnalyzerOptimizedCurve);
        _this._shapeSpaceBoundaryEnforcer = new ShapeSpaceBoundaryEnforcer_1.StrictShapeSpacesBoundaryEnforcerOpenCurve();
        _this._iteratedCurves = [];
        _this.updateConstraintBound = true;
        _this.revertCurvatureExtremaConstraints = [];
        _this.revertInflectionsConstraints = [];
        var e = _this.initExpansiveComputations();
        e = _this.expensiveComputation(_this._spline);
        if (_this._shapeSpaceDiffEventsStructure.activeControlInflections || _this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            _this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection;
            _this._inflectionInactiveConstraints = _this.computeInactiveConstraints(_this._curvatureNumeratorCP);
            _this.inflectionNumberOfActiveConstraints = _this._curvatureNumeratorCP.length - _this.inflectionInactiveConstraints.length;
        }
        for (var i = 0; i < _this._curvatureNumeratorCP.length; i += 1) {
            _this.revertInflectionsConstraints.push(1);
        }
        _this.inflectionsConstraintsBounds = MathVectorBasicOperations_1.zeroVector(_this._curvatureNumeratorCP.length);
        if (_this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            _this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema;
            _this._curvatureExtremaInactiveConstraints = _this.computeInactiveConstraints(_this._curvatureDerivativeNumeratorCP);
            _this.curvatureExtremaNumberOfActiveConstraints = _this._curvatureDerivativeNumeratorCP.length - _this.curvatureExtremaInactiveConstraints.length;
        }
        _this.controlPointsFunctionBInit = _this._curvatureDerivativeNumeratorCP;
        _this.curvatureExtremaConstraintBounds = MathVectorBasicOperations_1.zeroVector(_this._curvatureDerivativeNumeratorCP.length);
        for (var i = 0; i < _this._curvatureDerivativeNumeratorCP.length; i += 1) {
            _this.revertCurvatureExtremaConstraints.push(1);
        }
        _this.clearInequalityChanges();
        _this.clearConstraintBoundsUpdate();
        _this.revertInequalitiesWithinRangeOfLocalExtremum();
        _this.updateConstraintBoundsWithinRangeOfLocalExtremum();
        console.log("optim inactive curv ext constraints: " + _this.curvatureExtremaInactiveConstraints);
        console.log("optim inactive inflection constraints: " + _this.inflectionInactiveConstraints);
        _this._f = _this.compute_f(_this._curvatureNumeratorCP, _this.inflectionConstraintsSign, _this.inflectionInactiveConstraints, _this._curvatureDerivativeNumeratorCP, _this.curvatureExtremaConstraintsSign, _this.curvatureExtremaInactiveConstraints);
        _this.checkConstraintConsistency();
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints,
        //     this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        _this._gradient_f = _this.compute_gradient_f(_this.inflectionConstraintsSign, _this.inflectionInactiveConstraints, _this.curvatureExtremaConstraintsSign, _this.curvatureExtremaInactiveConstraints);
        return _this;
        // if (this.isComputingHessian) {
        //     this.prepareForHessianComputation(this.dBasisFunctions_du, this.d2BasisFunctions_du2, this.d3BasisFunctions_du3)
        //     this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
        // }
    }
    Object.defineProperty(OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype, "diffEventsVariation", {
        get: function () {
            return this._diffEventsVariation;
        },
        set: function (diffEventsVariation) {
            this._diffEventsVariation = diffEventsVariation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype, "iteratedCurves", {
        get: function () {
            return this._iteratedCurves;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype, "shapeSpaceBoundaryEnforcer", {
        get: function () {
            return this._shapeSpaceBoundaryEnforcer;
        },
        enumerable: false,
        configurable: true
    });
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.clearIteratedCurves = function () {
        this._iteratedCurves = [];
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.checkConstraintConsistency = function () {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d;
        /* JCL 08/03/2021 Add test to check the consistency of the constraints values.
            As the reference optimization problem is set up, each active constraint is an inequality strictly negative.
            Consequently, each active constraint value must be negative. */
        var constraintType;
        (function (constraintType) {
            constraintType[constraintType["curvatureExtremum"] = 0] = "curvatureExtremum";
            constraintType[constraintType["inflexion"] = 1] = "inflexion";
            constraintType[constraintType["none"] = 2] = "none";
        })(constraintType || (constraintType = {}));
        ;
        var invalidConstraints = [];
        for (var i = 0; i < this._f.length; i += 1) {
            if (this._f[i] > 0.0) {
                var typeC = void 0;
                var indexC = void 0;
                if (this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                    typeC = constraintType.curvatureExtremum;
                    indexC = i;
                    if (i < this.curvatureExtremaNumberOfActiveConstraints) {
                        try {
                            for (var _e = (e_2 = void 0, __values(this.curvatureExtremaInactiveConstraints)), _g = _e.next(); !_g.done; _g = _e.next()) {
                                var constraintIndex = _g.value;
                                if (i > constraintIndex)
                                    indexC = indexC + 1;
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_g && !_g.done && (_a = _e.return)) _a.call(_e);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                    else {
                        indexC = i - this.curvatureExtremaNumberOfActiveConstraints;
                        typeC = constraintType.inflexion;
                        try {
                            for (var _h = (e_3 = void 0, __values(this.inflectionInactiveConstraints)), _j = _h.next(); !_j.done; _j = _h.next()) {
                                var constraintIndex = _j.value;
                                if (i > constraintIndex)
                                    indexC = indexC + 1;
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                }
                else if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                    typeC = constraintType.curvatureExtremum;
                    indexC = i;
                    try {
                        for (var _k = (e_4 = void 0, __values(this.curvatureExtremaInactiveConstraints)), _l = _k.next(); !_l.done; _l = _k.next()) {
                            var constraintIndex = _l.value;
                            if (i > constraintIndex)
                                indexC = indexC + 1;
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
                else if (this._shapeSpaceDiffEventsStructure.activeControlInflections) {
                    typeC = constraintType.inflexion;
                    indexC = i;
                    try {
                        for (var _m = (e_5 = void 0, __values(this.inflectionInactiveConstraints)), _o = _m.next(); !_o.done; _o = _m.next()) {
                            var constraintIndex = _o.value;
                            if (i > constraintIndex)
                                indexC = indexC + 1;
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                }
                else {
                    typeC = constraintType.none;
                    indexC = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
                    var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "checkConstraintConsistency", "No active control set. There should be no constraint.");
                    warning.logMessage();
                }
                invalidConstraints.push({ value: this._f[i], type: typeC, index: indexC });
            }
        }
        if (invalidConstraints.length > 0) {
            var message = "Inconsistent constraints. Constraints value must be negative. " + JSON.stringify(invalidConstraints);
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConstraintConsistency", message);
            error.logMessage();
        }
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.inactivateConstraintClosestToZero = function (controlPoints, inactiveConstraints) {
        var polygonOfCtrlPts = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(controlPoints);
        var globalExtremumOffAxis = polygonOfCtrlPts.extractClosestLocalExtremmumToAxis().index;
        if (globalExtremumOffAxis !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
            inactiveConstraints.push(globalExtremumOffAxis);
            inactiveConstraints.sort(function (a, b) { return (a - b); });
        }
    };
    // inactivateConstraintsAtCurveEXtremities(controlPoints: number[], inactiveConstraints: number[]): void {
    //     if(inactiveConstraints.indexOf(0) === -1) inactiveConstraints.splice(0, 0, 0);
    //     if(inactiveConstraints.indexOf(controlPoints.length - 1) === -1) inactiveConstraints.push(controlPoints.length - 1);
    // }
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.inactivateConstraintsWithinRangeOfLocalExtremum = function (inactiveConstraints) {
        if (this._diffEventsVariation === undefined || this._diffEventsVariation.neighboringEvents.length === 0) {
            return;
        }
        else if ((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear)
            // && this.constraintType === ConstraintType.curvatureExtrema && this.updateConstraintBound) {
            && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema) {
            var upperBound = this._diffEventsVariation.span;
            var lowerBound = this._diffEventsVariation.span - this._diffEventsVariation.rangeOfInfluence;
            for (var j = lowerBound; j < upperBound + 1; j += 1) {
                if (inactiveConstraints.indexOf(j) !== -1)
                    inactiveConstraints.splice(inactiveConstraints.indexOf(j), 1);
            }
        }
        else if ((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear)
            && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema) {
            if (this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.start || this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.end) {
                // if(this.shapeSpaceBoundaryConstraintsCurvExtrema.length > 0) {
                if (this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.start) {
                    if (inactiveConstraints.length > 0 && inactiveConstraints.indexOf(0) !== -1)
                        inactiveConstraints.splice(inactiveConstraints.indexOf(0), 1);
                }
                else if (this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.end) {
                    if (inactiveConstraints.length > 0 && inactiveConstraints.indexOf(this._curvatureExtremaTotalNumberOfConstraints - 1) !== -1)
                        inactiveConstraints.splice(inactiveConstraints.indexOf(this._curvatureExtremaTotalNumberOfConstraints - 1), 1);
                }
                /* JCL 08/03/2021 Add constraint modifications to curvature extrema appearing based on a non null optimum value of B(u) */
                if (this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
                    /* to be added: the interval span to be processed */
                    for (var i = 1; i < this._curvatureExtremaTotalNumberOfConstraints - 1; i += 1) {
                        if (inactiveConstraints.length > 0 && inactiveConstraints.indexOf(i) !== -1)
                            inactiveConstraints.splice(inactiveConstraints.indexOf(i), 1);
                    }
                }
            }
            else
                console.log("Null content of shapeSpaceBoundaryConstraintsCurvExtrema.");
        }
        else if ((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear)
            && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection) {
            if (this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.start || this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.end) {
                // if(this.shapeSpaceBoundaryConstraintsInflections.length > 0) {
                if (this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.start) {
                    if (inactiveConstraints.length > 0 && inactiveConstraints.indexOf(0) !== -1)
                        inactiveConstraints.splice(inactiveConstraints.indexOf(0), 1);
                }
                else if (this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.end) {
                    if (inactiveConstraints.length > 0 && inactiveConstraints.indexOf(this._inflectionTotalNumberOfConstraints - 1) !== -1)
                        inactiveConstraints.splice(inactiveConstraints.indexOf(this._inflectionTotalNumberOfConstraints - 1), 1);
                }
                /* JCL something to do with this._diffEventsVariation for A(u) extrema ? */
            }
        }
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.clearInequalityChanges = function () {
        var e_6, _a, e_7, _b;
        if (this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema) {
            try {
                for (var _c = __values(this._curvatureDerivativeNumeratorCP), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var controlPoint = _d.value;
                    this.revertCurvatureExtremaConstraints[controlPoint] = 1;
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        else if (this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection) {
            try {
                for (var _e = __values(this._curvatureNumeratorCP), _g = _e.next(); !_g.done; _g = _e.next()) {
                    var controlPoint = _g.value;
                    this.revertCurvatureExtremaConstraints[controlPoint] = 1;
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "clearInequalityChanges", "Current constraint type is not compatible with the inequalities changes.");
            error.logMessage();
        }
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.clearConstraintBoundsUpdate = function () {
        var e_8, _a, e_9, _b;
        if (this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema) {
            try {
                for (var _c = __values(this._curvatureDerivativeNumeratorCP), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var controlPoint = _d.value;
                    this.curvatureExtremaConstraintBounds[controlPoint] = 0;
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_8) throw e_8.error; }
            }
        }
        else if (this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection) {
            try {
                for (var _e = __values(this._curvatureNumeratorCP), _g = _e.next(); !_g.done; _g = _e.next()) {
                    var controlPoint = _g.value;
                    this.curvatureExtremaConstraintBounds[controlPoint] = 0;
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_9) throw e_9.error; }
            }
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "clearConstraintBoundsUpdate", "Current constraint type is not compatible with the constraint bounds update.");
            error.logMessage();
        }
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.revertInequalitiesWithinRangeOfLocalExtremum = function () {
        if (this._diffEventsVariation.neighboringEvents.length === 0) {
            return;
        }
        else if ((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear)
            && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema && (this.updateConstraintBound || this._shapeSpaceBoundaryEnforcer.hasNewEvent())) {
            var upperBound = this._diffEventsVariation.span;
            var lowerBound = this._diffEventsVariation.span - this._diffEventsVariation.rangeOfInfluence;
            for (var i = lowerBound + 1; i < upperBound; i += 1) {
                if (this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
                    if (this.controlPointsFunctionBInit[i] < 0 && this._diffEventsVariation.extremumValue > 0
                        && this._diffEventsVariation.extremumValueOpt < 0)
                        this.revertCurvatureExtremaConstraints[i] = -1;
                    if (this.controlPointsFunctionBInit[i] > 0 && this._diffEventsVariation.extremumValue < 0
                        && this._diffEventsVariation.extremumValueOpt > 0)
                        this.revertCurvatureExtremaConstraints[i] = -1;
                }
                else if (this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                    if (this.controlPointsFunctionBInit[i] < 0 && this._diffEventsVariation.extremumValue > 0
                        && this._diffEventsVariation.extremumValueOpt < 0)
                        this.revertCurvatureExtremaConstraints[i] = -1;
                    if (this.controlPointsFunctionBInit[i] > 0 && this._diffEventsVariation.extremumValue < 0
                        && this._diffEventsVariation.extremumValueOpt > 0) {
                        if (this._diffEventsVariation.CPvariations[i] > 0) {
                            this.revertCurvatureExtremaConstraints[i] = 1;
                        }
                        else {
                            this.revertCurvatureExtremaConstraints[i] = -1;
                        }
                    }
                }
            }
        }
        else if ((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear)
            && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema) {
            if (this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.start || this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.end) {
                // if(this.shapeSpaceBoundaryConstraintsCurvExtrema.length > 0) {
                if (this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.start) {
                    this.revertCurvatureExtremaConstraints[0] = 1;
                }
                if (this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.end) {
                    this.revertCurvatureExtremaConstraints[this._curvatureExtremaTotalNumberOfConstraints - 1] = 1;
                }
                if (this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
                    /* to be added: the interval span to be processed */
                    for (var i = 1; i < this._curvatureExtremaTotalNumberOfConstraints - 1; i += 1) {
                        this.revertCurvatureExtremaConstraints[i] = 1;
                        if (this._diffEventsVariation.extremumValueOpt > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
                            if (this._diffEventsVariation.CPvariations[i] > 0.0) {
                                this.revertCurvatureExtremaConstraints[i] = -1;
                            }
                            else {
                                this.revertCurvatureExtremaConstraints[i] = -1;
                            }
                        }
                    }
                }
            }
        }
        else if ((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear)
            && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection) {
            if (this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.start || this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.end) {
                // if(this.shapeSpaceBoundaryConstraintsInflections.length > 0) {
                if (this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.start) {
                    this.revertInflectionsConstraints[0] = 1;
                }
                if (this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.end) {
                    this.revertInflectionsConstraints[this._inflectionTotalNumberOfConstraints - 1] = 1;
                }
                // if(this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
                //     /* to be added: the interval span to be processed */
                //     for(let i = 1; i < this._inflectionTotalNumberOfConstraints - 1; i+= 1){
                //         this.revertInflectionsConstraints[i] = 1;
                //         if(this._diffEventsVariation.extremumValueOpt > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
                //             if(this._diffEventsVariation.CPvariations[i] > 0.0) {
                //                 this.revertInflectionsConstraints[i] = -1;
                //             } else {
                //                 this.revertInflectionsConstraints[i] = -1;
                //             }
                //         }
                //     }
                // }
            }
        }
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.updateConstraintBoundsWithinRangeOfLocalExtremum = function () {
        if (this._diffEventsVariation.neighboringEvents.length === 0) {
            return;
        }
        else if ((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear)
            && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema && (this.updateConstraintBound || this._shapeSpaceBoundaryEnforcer.hasNewEvent())) {
            var upperBound = this._diffEventsVariation.span;
            var lowerBound = this._diffEventsVariation.span - this._diffEventsVariation.rangeOfInfluence;
            for (var i = lowerBound + 1; i < upperBound; i += 1) {
                if (this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                    if (this.controlPointsFunctionBInit[i] > 0 && this._diffEventsVariation.extremumValue < 0
                        && this._diffEventsVariation.extremumValueOpt > 0) {
                        if (this._diffEventsVariation.CPvariations[i] > 0) {
                            this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + (this._diffEventsVariation.CPvariations[i] * this._diffEventsVariation.extremumValue) / (this._diffEventsVariation.extremumValueOpt - this._diffEventsVariation.extremumValue);
                        }
                        else {
                            this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + exports.CONSTRAINT_BOUND_THRESHOLD;
                        }
                    }
                }
            }
            if (this._shapeSpaceBoundaryEnforcer.hasNewEvent()) {
                this.curvatureExtremaConstraintBounds[0] = 0;
                for (var i = 1; i < this._curvatureExtremaTotalNumberOfConstraints; i += 1) {
                    if (this.curveAnalyzerCurrentCurve.curvatureDerivativeNumerator.controlPoints[i] > 0) {
                        this.curvatureExtremaConstraintBounds[i] = this.curveAnalyzerCurrentCurve.curvatureDerivativeNumerator.controlPoints[i] - exports.CONSTRAINT_BOUND_THRESHOLD;
                    }
                    else {
                        this.curvatureExtremaConstraintBounds[i] = 0;
                    }
                }
            }
        }
        else if ((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear)
            && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema) {
            if (this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.start || this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.end) {
                // if(this.shapeSpaceBoundaryConstraintsCurvExtrema.length > 0) {
                if (this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.start) {
                    // this.curvatureExtremaConstraintBounds[0] = this.controlPointsFunctionBInit[0] + CONSTRAINT_BOUND_THRESHOLD;
                    this.curvatureExtremaConstraintBounds[0] = 0;
                }
                if (this._shapeSpaceBoundaryEnforcer.curvExtremumEventAtExtremity.end) {
                    this.curvatureExtremaConstraintBounds[this._curvatureExtremaTotalNumberOfConstraints - 1] = 0;
                }
                if (this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
                    /* to be added: the interval span to be processed */
                    for (var i = 1; i < this._curvatureExtremaTotalNumberOfConstraints - 1; i += 1) {
                        this.curvatureExtremaConstraintBounds[i] = 0;
                        if (this._diffEventsVariation.extremumValueOpt > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
                            if (this._diffEventsVariation.CPvariations[i] > 0.0) {
                                this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this._diffEventsVariation.CPvariations[i];
                            }
                            else {
                                this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + exports.CONSTRAINT_BOUND_THRESHOLD;
                            }
                        }
                        else if (this._diffEventsVariation.extremumValueOpt < 0.0 && this.controlPointsFunctionBInit[i] < 0.0) {
                            if (this._diffEventsVariation.CPvariations[i] < 0.0) {
                                this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this._diffEventsVariation.CPvariations[i];
                            }
                            else {
                                this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + exports.CONSTRAINT_BOUND_THRESHOLD;
                            }
                        }
                    }
                }
            }
        }
        else if ((this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear
            || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear)
            && this.constraintType === AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection) {
            if (this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.start || this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.end) {
                // if(this.shapeSpaceBoundaryConstraintsInflections.length > 0) {
                if (this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.start) {
                    // this.curvatureExtremaConstraintBounds[0] = this.controlPointsFunctionBInit[0] + CONSTRAINT_BOUND_THRESHOLD;
                    this.inflectionsConstraintsBounds[0] = 0;
                }
                if (this._shapeSpaceBoundaryEnforcer.inflectionEventAtExtremity.end) {
                    this.inflectionsConstraintsBounds[this._inflectionTotalNumberOfConstraints - 1] = 0;
                }
                // if(this._diffEventsVariation.extremumValueOpt !== 0.0 && this._diffEventsVariation.CPvariations !== undefined) {
                //     /* to be added: the interval span to be processed */
                //     for(let i = 1; i < this._curvatureExtremaTotalNumberOfConstraints - 1; i+= 1){
                //         this.curvatureExtremaConstraintBounds[i] = 0;
                //         if(this._diffEventsVariation.extremumValueOpt > 0.0 && this.controlPointsFunctionBInit[i] > 0.0) {
                //             if(this._diffEventsVariation.CPvariations[i] > 0.0) {
                //                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this._diffEventsVariation.CPvariations[i];
                //             } else {
                //                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + CONSTRAINT_BOUND_THRESHOLD;
                //             }
                //         } else if(this._diffEventsVariation.extremumValueOpt < 0.0 && this.controlPointsFunctionBInit[i] < 0.0) {
                //             if(this._diffEventsVariation.CPvariations[i] < 0.0) {
                //                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + this._diffEventsVariation.CPvariations[i];
                //             } else {
                //                 this.curvatureExtremaConstraintBounds[i] = this.controlPointsFunctionBInit[i] + CONSTRAINT_BOUND_THRESHOLD;
                //             }
                //         }
                //     }
                // }
            }
        }
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.computeInactiveConstraints = function (controlPoints) {
        this.checkConstraintTypeConsistency(controlPoints);
        var inactiveConstraints = this.extractVerticesLocallyClosestToZero(controlPoints);
        this.inactivateConstraintClosestToZero(controlPoints, inactiveConstraints);
        this.inactivateConstraintsAtCurveEXtremities(controlPoints, inactiveConstraints);
        this.inactivateConstraintsWithinRangeOfLocalExtremum(inactiveConstraints);
        return inactiveConstraints;
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.compute_curvatureExtremaConstraints = function (curvatureDerivativeNumerator, constraintsSign, inactiveConstraints) {
        var result = [];
        if (this._diffEventsVariation === undefined)
            return result;
        for (var i = 0, j = 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            }
            else {
                result.push((curvatureDerivativeNumerator[i] - this.curvatureExtremaConstraintBounds[i]) * constraintsSign[i] * this.revertCurvatureExtremaConstraints[i]);
            }
        }
        return result;
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.compute_inflectionConstraints = function (curvatureNumerator, constraintsSign, inactiveConstraints) {
        var result = [];
        if (this._diffEventsVariation === undefined)
            return result;
        for (var i = 0, j = 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            }
            else {
                result.push((curvatureNumerator[i] - this.inflectionsConstraintsBounds[i]) * constraintsSign[i] * this.revertInflectionsConstraints[i]);
            }
        }
        return result;
    };
    // compute_curvatureExtremaConstraints_gradient( e: ExpensiveComputationResults,
    //                                             constraintsSign: number[], 
    //                                             inactiveConstraints: number[]): DenseMatrix {
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.compute_curvatureExtremaConstraints_gradient = function (constraintsSign, inactiveConstraints) {
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
        var controlPointsLength = this.spline.controlPoints.length;
        var totalNumberOfConstraints = this.curvatureExtremaTotalNumberOfConstraints;
        var degree = this.spline.degree;
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
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
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
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
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        var result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength);
        if (this._diffEventsVariation === undefined)
            return result;
        for (var i = 0; i < controlPointsLength; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (4 * degree - 5);
            var lessThan = Math.min(controlPointsLength - degree, i + 1) * (4 * degree - 5);
            var deltaj = 0;
            for (var i_5 = 0; i_5 < inactiveConstraints.length; i_5 += 1) {
                if (inactiveConstraints[i_5] >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j] * this.revertCurvatureExtremaConstraints[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j] * this.revertCurvatureExtremaConstraints[j]);
                }
            }
        }
        return result;
    };
    // compute_inflectionConstraints_gradient( e: ExpensiveComputationResults,
    //     constraintsSign: number[], 
    //     inactiveConstraints: number[]): DenseMatrix {
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.compute_inflectionConstraints_gradient = function (constraintsSign, inactiveConstraints) {
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
        var controlPointsLength = this.spline.controlPoints.length;
        var degree = this.spline.degree;
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
            var h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        var totalNumberOfConstraints = this.inflectionConstraintsSign.length;
        var result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength);
        if (this._diffEventsVariation === undefined)
            return result;
        for (var i = 0; i < controlPointsLength; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (2 * degree - 2);
            var lessThan = Math.min(controlPointsLength - degree, i + 1) * (2 * degree - 2);
            var deltaj = 0;
            for (var i_6 = 0; i_6 < inactiveConstraints.length; i_6 += 1) {
                if (inactiveConstraints[i_6] >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j] * this.revertInflectionsConstraints[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j] * this.revertInflectionsConstraints[j]);
                }
            }
        }
        return result;
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.compute_f = function (curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints, curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints) {
        var f = [];
        if (this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            var r1 = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            // console.log(" compute_fGN: " + this.curvatureExtremaConstraintBounds + " modifSignConstraints: " + this.revertCurvatureExtremaConstraints + " r1: " + r1)
            var r2 = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
            f = r1.concat(r2);
        }
        else if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            f = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            // console.log(" compute_fGN: " + this.curvatureExtremaConstraintBounds + " modifSignConstraints: " + this.revertCurvatureExtremaConstraints + " f: " + f)
        }
        else if (this._shapeSpaceDiffEventsStructure.activeControlInflections) {
            f = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
        }
        return f;
    };
    // compute_gradient_f( e: ExpensiveComputationResults,
    //                     inflectionConstraintsSign: number[],
    //                     inflectionInactiveConstraints: number[],
    //                     curvatureExtremaConstraintsSign: number[], 
    //                     curvatureExtremaInactiveConstraints: number[]): DenseMatrix {
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.compute_gradient_f = function (inflectionConstraintsSign, inflectionInactiveConstraints, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints) {
        if (this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // const m1 = this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            var m1 = this.compute_curvatureExtremaConstraints_gradient(curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            // console.log(" grad_fGN: " + curvatureExtremaConstraintsSign + " modifSignConstraints: " + this.revertCurvatureExtremaConstraints + " m1: " + m1)
            // const m2 = this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
            var m2 = this.compute_inflectionConstraints_gradient(inflectionConstraintsSign, inflectionInactiveConstraints);
            var _a = __read(m1.shape, 2), row_m1 = _a[0], n = _a[1];
            var _b = __read(m2.shape, 1), row_m2 = _b[0];
            var m = row_m1 + row_m2;
            var result = new DenseMatrix_1.DenseMatrix(m, n);
            for (var i = 0; i < row_m1; i += 1) {
                for (var j = 0; j < n; j += 1) {
                    result.set(i, j, m1.get(i, j));
                }
            }
            for (var i = 0; i < row_m2; i += 1) {
                for (var j = 0; j < n; j += 1) {
                    result.set(row_m1 + i, j, m2.get(i, j));
                }
            }
            return result;
        }
        else if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // return this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            return this.compute_curvatureExtremaConstraints_gradient(curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        }
        else if (this._shapeSpaceDiffEventsStructure.activeControlInflections) {
            // return this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
            return this.compute_inflectionConstraints_gradient(inflectionConstraintsSign, inflectionInactiveConstraints);
        }
        else {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "compute_gradient_f", "active control set to none: unable to compute gradients of f.");
            warning.logMessage();
            var result = new DenseMatrix_1.DenseMatrix(1, 1);
            return result;
        }
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.step = function (deltaX) {
        var e_10, _a, e_11, _b;
        var checked = true;
        var inactiveCurvatureConstraintsAtStart = this.curvatureExtremaInactiveConstraints;
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        var curvatureNumerator = [];
        var curvatureDerivativeNumerator = [];
        var curvatureDerivativeEXtrema = [];
        var curvatureDerivativeEXtremaUpdated = [];
        if (this._shapeSpaceBoundaryEnforcer.isActive()) {
            this._inflectionInactiveConstraints = [];
            this._curvatureExtremaInactiveConstraints = [];
        }
        // if(this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaDisappear || this.neighboringEvent.event === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
        if (this.diffEventsVariation.neighboringEvents.length > 0) {
            if (this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear || this._diffEventsVariation.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                var splineDP = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(this.spline);
                var functionB = splineDP.curvatureDerivativeNumerator();
                var curvatureExtremaLocations = functionB.zeros();
                var functionBderivativeExtrema = functionB.derivative().zeros();
                try {
                    for (var functionBderivativeExtrema_1 = __values(functionBderivativeExtrema), functionBderivativeExtrema_1_1 = functionBderivativeExtrema_1.next(); !functionBderivativeExtrema_1_1.done; functionBderivativeExtrema_1_1 = functionBderivativeExtrema_1.next()) {
                        var extLoc = functionBderivativeExtrema_1_1.value;
                        curvatureDerivativeEXtrema.push(functionB.evaluate(extLoc));
                    }
                }
                catch (e_10_1) { e_10 = { error: e_10_1 }; }
                finally {
                    try {
                        if (functionBderivativeExtrema_1_1 && !functionBderivativeExtrema_1_1.done && (_a = functionBderivativeExtrema_1.return)) _a.call(functionBderivativeExtrema_1);
                    }
                    finally { if (e_10) throw e_10.error; }
                }
                var splineCurrent = this.spline.clone();
                this._spline = this.spline.moveControlPoints(AbstractOptProblemBSplineR1toR2_1.convertStepToVector2d(deltaX));
                var splineDPupdated = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(this.spline);
                var functionBupdated = splineDPupdated.curvatureDerivativeNumerator();
                var curvatureExtremaLocationsUpdated = functionBupdated.zeros();
                var functionBderivativeExtremaUpdated = functionBupdated.derivative().zeros();
                try {
                    for (var functionBderivativeExtremaUpdated_1 = __values(functionBderivativeExtremaUpdated), functionBderivativeExtremaUpdated_1_1 = functionBderivativeExtremaUpdated_1.next(); !functionBderivativeExtremaUpdated_1_1.done; functionBderivativeExtremaUpdated_1_1 = functionBderivativeExtremaUpdated_1.next()) {
                        var extLoc = functionBderivativeExtremaUpdated_1_1.value;
                        curvatureDerivativeEXtremaUpdated.push(functionBupdated.evaluate(extLoc));
                    }
                }
                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                finally {
                    try {
                        if (functionBderivativeExtremaUpdated_1_1 && !functionBderivativeExtremaUpdated_1_1.done && (_b = functionBderivativeExtremaUpdated_1.return)) _b.call(functionBderivativeExtremaUpdated_1);
                    }
                    finally { if (e_11) throw e_11.error; }
                }
                if (curvatureExtremaLocationsUpdated.length !== curvatureExtremaLocations.length) {
                    checked = false;
                    // this.spline = splineCurrent
                    console.log("extrema current: " + curvatureExtremaLocations + " extrema updated: " + curvatureExtremaLocationsUpdated);
                    this._iteratedCurves.pop();
                    return checked;
                }
                else {
                    this._iteratedCurves.push(this.spline);
                }
            }
            else {
                this._spline = this.spline.moveControlPoints(AbstractOptProblemBSplineR1toR2_1.convertStepToVector2d(deltaX));
            }
        }
        else {
            this._spline = this.spline.moveControlPoints(AbstractOptProblemBSplineR1toR2_1.convertStepToVector2d(deltaX));
            this._iteratedCurves.push(this.spline);
        }
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        if (this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // e = this.expensiveComputation(this._spline);
            this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
            // curvatureNumerator = this.curvatureNumerator(e.h4);
            curvatureNumerator = this.curvatureNumerator();
            this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator);
            this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection;
            // this._inflectionInactiveConstraints = this.computeInactiveConstraintsGN(curvatureNumerator)
            if (!this._shapeSpaceBoundaryEnforcer.isActive())
                this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator);
            this.inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length;
            // if(this.updateConstraintBound) {
            //     this.clearInequalityChanges();
            //     this.clearConstraintBoundsUpdate();
            //     this.revertInequalitiesWithinRangeOfLocalExtremum();
            //     this.updateConstraintBoundsWithinRangeOfLocalExtremum();
            // }
        }
        if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // curvatureDerivativeNumerator = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
            this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(curvatureDerivativeNumerator);
            this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema;
            // this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraintsGN(g)
            if (!this._shapeSpaceBoundaryEnforcer.isActive())
                this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(curvatureDerivativeNumerator);
            this.curvatureExtremaNumberOfActiveConstraints = curvatureDerivativeNumerator.length - this.curvatureExtremaInactiveConstraints.length;
        }
        if (this.updateConstraintBound) {
            this.clearInequalityChanges();
            this.clearConstraintBoundsUpdate();
            this.revertInequalitiesWithinRangeOfLocalExtremum();
            this.updateConstraintBoundsWithinRangeOfLocalExtremum();
        }
        //console.log("step : inactive cst start: " + inactiveCurvatureConstraintsAtStart + " updated " + this.curvatureExtremaInactiveConstraints + " infl " + this.inflectionInactiveConstraints + " cst sgn " + this.curvatureExtremaConstraintsSign)
        console.log("step : inactive cst: " + this.curvatureExtremaInactiveConstraints + " revert " + this.revertCurvatureExtremaConstraints
            + " cst sgn " + this.curvatureExtremaConstraintsSign + " bound " + this.curvatureExtremaConstraintBounds
            + " update status " + this.updateConstraintBound + " extB " + curvatureDerivativeEXtrema + " extBUpdt " + curvatureDerivativeEXtremaUpdated);
        this.updateConstraintBound = false;
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, curvatureDerivativeNumerator, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        if (this.isComputingHessian) {
            // this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu,e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints)
            this._hessian_f = this.compute_hessian_f(this._analyticHighOrderCurveDerivatives.bdsxu, this._analyticHighOrderCurveDerivatives.bdsyu, this._analyticHighOrderCurveDerivatives.bdsxuu, this._analyticHighOrderCurveDerivatives.bdsyuu, this._analyticHighOrderCurveDerivatives.bdsxuuu, this._analyticHighOrderCurveDerivatives.bdsyuuu, this._analyticHighOrderCurveDerivatives.h1, this._analyticHighOrderCurveDerivatives.h2, this._analyticHighOrderCurveDerivatives.h3, this._analyticHighOrderCurveDerivatives.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        }
        return checked;
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.update = function (spline) {
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        this._spline = spline.clone();
        this.computeBasisFunctionsDerivatives();
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2;
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        this._hessian_f0 = DiagonalMatrix_1.identityMatrix(this._numberOfIndependentVariables);
        this._inflectionInactiveConstraints = [];
        this._curvatureExtremaInactiveConstraints = [];
        this.curveAnalyzerCurrentCurve = this._diffEventsVariation.curveAnalyser1;
        this.curveAnalyzerOptimizedCurve = this._diffEventsVariation.curveAnalyser2;
        if (this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // e = this.expensiveComputation(this._spline);
            this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
            // this._curvatureNumeratorCP = this.curvatureNumerator(e.h4);
            this._curvatureNumeratorCP = this.curvatureNumerator();
            this._inflectionTotalNumberOfConstraints = this._curvatureNumeratorCP.length;
            this.inflectionConstraintsSign = this.computeConstraintsSign(this._curvatureNumeratorCP);
            this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.inflection;
            if (!this._shapeSpaceBoundaryEnforcer.hasNewEvent())
                this._inflectionInactiveConstraints = this.computeInactiveConstraints(this._curvatureNumeratorCP);
            this.inflectionNumberOfActiveConstraints = this._curvatureNumeratorCP.length - this.inflectionInactiveConstraints.length;
        }
        if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator();
            this._curvatureExtremaTotalNumberOfConstraints = this._curvatureDerivativeNumeratorCP.length;
            this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(this._curvatureDerivativeNumeratorCP);
            this.constraintType = AbstractOptProblemBSplineR1toR2_1.ConstraintType.curvatureExtrema;
            if (!this._shapeSpaceBoundaryEnforcer.hasNewEvent())
                this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this._curvatureDerivativeNumeratorCP);
            this.curvatureExtremaNumberOfActiveConstraints = this._curvatureDerivativeNumeratorCP.length - this.curvatureExtremaInactiveConstraints.length;
        }
        this.controlPointsFunctionBInit = this._curvatureDerivativeNumeratorCP;
        // if(this.neighboringEvent.event !== NeighboringEventsType.none) console.log("B(u) control points at init:" + this.currentCurvatureExtremaControPoints)
        this.curvatureExtremaConstraintBounds = MathVectorBasicOperations_1.zeroVector(this._curvatureDerivativeNumeratorCP.length);
        for (var i = 0; i < this._curvatureDerivativeNumeratorCP.length; i += 1) {
            this.revertCurvatureExtremaConstraints[i] = 1;
        }
        this.clearInequalityChanges();
        this.clearConstraintBoundsUpdate();
        this.revertInequalitiesWithinRangeOfLocalExtremum();
        this.updateConstraintBoundsWithinRangeOfLocalExtremum();
        console.log("optim curv ext inactive constraints: " + this.curvatureExtremaInactiveConstraints);
        console.log("optim inflection inactive constraints: " + this.inflectionInactiveConstraints);
        this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this._curvatureDerivativeNumeratorCP, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        this.checkConstraintConsistency();
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    };
    OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace.prototype.cancelEvent = function () {
        /* JCL attention clearVariation n'est pas strictement equivalent aux operations ci-dessus*/
        this._diffEventsVariation.clearVariation();
        // this._diffEventsVariation.neighboringEvents = [];
        //const e = this.expensiveComputation(this.spline)  
        //const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        this.curvatureExtremaConstraintBounds = MathVectorBasicOperations_1.zeroVector(this.curvatureExtremaConstraintBounds.length);
        for (var i = 0; i < this.revertCurvatureExtremaConstraints.length; i += 1) {
            this.revertCurvatureExtremaConstraints[i] = 1;
        }
        var delta = MathVectorBasicOperations_1.zeroVector(this.spline.controlPoints.length * 2);
        this.step(delta);
        this.checkConstraintConsistency();
    };
    return OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace;
}(OptProblemOPenBSplineR1toR2WithWeigthingFactors));
exports.OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace = OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace;
