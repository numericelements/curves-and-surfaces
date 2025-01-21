"use strict";
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
exports.deepCopyAnalyticHighOrderCurveDerivatives = exports.convertStepToVector2d = exports.AbstractOptProblemBSplineR1toR2 = exports.ConstraintType = void 0;
var BernsteinDecompositionR1toR1_1 = require("../newBsplines/BernsteinDecompositionR1toR1");
var DenseMatrix_1 = require("../linearAlgebra/DenseMatrix");
var DiagonalMatrix_1 = require("../linearAlgebra/DiagonalMatrix");
var Vector2d_1 = require("../mathVector/Vector2d");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ConstraintType;
(function (ConstraintType) {
    ConstraintType[ConstraintType["none"] = 0] = "none";
    ConstraintType[ConstraintType["inflection"] = 1] = "inflection";
    ConstraintType[ConstraintType["curvatureExtrema"] = 2] = "curvatureExtrema";
})(ConstraintType = exports.ConstraintType || (exports.ConstraintType = {}));
var AbstractOptProblemBSplineR1toR2 = /** @class */ (function () {
    function AbstractOptProblemBSplineR1toR2(splineInitial, shapeSpaceDiffEventsStructure) {
        this.inflectionConstraintsSign = [];
        this._inflectionInactiveConstraints = [];
        this._curvatureExtremaConstraintsSign = [];
        this._curvatureExtremaInactiveConstraints = [];
        this._curvatureNumeratorCP = [];
        this._curvatureDerivativeNumeratorCP = [];
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];
        this.constraintType = ConstraintType.none;
        this._inflectionTotalNumberOfConstraints = 0;
        this.inflectionNumberOfActiveConstraints = 0;
        this._curvatureExtremaTotalNumberOfConstraints = 0;
        this.curvatureExtremaNumberOfActiveConstraints = 0;
        this._spline = splineInitial.clone();
        this._previousSpline = splineInitial.clone();
        this._target = splineInitial.clone();
        this._shapeSpaceDiffEventsStructure = shapeSpaceDiffEventsStructure;
        this.computeBasisFunctionsDerivatives();
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2;
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        this._hessian_f0 = DiagonalMatrix_1.identityMatrix(this._numberOfIndependentVariables);
        this._f = [];
        this._gradient_f = new DenseMatrix_1.DenseMatrix(1, 1);
        this._hessian_f = undefined;
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        this._previousAnalyticHighOrderCurveDerivatives = this.initExpansiveComputations();
    }
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "shapeSpaceDiffEventsStructure", {
        get: function () {
            return this._shapeSpaceDiffEventsStructure;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "inflectionInactiveConstraints", {
        get: function () {
            return this._inflectionInactiveConstraints.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "curvatureExtremaInactiveConstraints", {
        get: function () {
            return this._curvatureExtremaInactiveConstraints.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "numberOfIndependentVariables", {
        get: function () {
            return this._numberOfIndependentVariables;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "inflectionTotalNumberOfConstraints", {
        get: function () {
            return this._inflectionTotalNumberOfConstraints;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "curvatureExtremaTotalNumberOfConstraints", {
        get: function () {
            return this._curvatureExtremaTotalNumberOfConstraints;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "curvatureExtremaConstraintsSign", {
        get: function () {
            return this._curvatureExtremaConstraintsSign.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "curvatureNumeratorCP", {
        get: function () {
            return this._curvatureNumeratorCP.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "curvatureDerivativeNumeratorCP", {
        get: function () {
            return this._curvatureDerivativeNumeratorCP.slice();
        },
        set: function (curvatureDerivativeNumeratorCP) {
            this._curvatureDerivativeNumeratorCP = curvatureDerivativeNumeratorCP.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "f0", {
        get: function () {
            return this._f0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "gradient_f0", {
        get: function () {
            return this._gradient_f0.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "hessian_f0", {
        get: function () {
            return this._hessian_f0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "numberOfConstraints", {
        get: function () {
            if (this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                return this.inflectionConstraintsSign.length - this._inflectionInactiveConstraints.length + this._curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length;
            }
            else if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                return this._curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length;
            }
            else if (this._shapeSpaceDiffEventsStructure.activeControlInflections) {
                return this.inflectionConstraintsSign.length - this._inflectionInactiveConstraints.length;
            }
            else {
                // JCL 27/02/2023 modification to integrate the status none: must be double checked
                return 0;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "f", {
        get: function () {
            return this._f.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "gradient_f", {
        get: function () {
            return this._gradient_f;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "hessian_f", {
        get: function () {
            return this._hessian_f;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "analyticHighOrderCurveDerivatives", {
        get: function () {
            return this._analyticHighOrderCurveDerivatives;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractOptProblemBSplineR1toR2.prototype, "previousAnalyticHighOrderCurveDerivatives", {
        get: function () {
            return this._previousAnalyticHighOrderCurveDerivatives;
        },
        enumerable: false,
        configurable: true
    });
    AbstractOptProblemBSplineR1toR2.prototype.step = function (deltaX) {
        this._previousAnalyticHighOrderCurveDerivatives = deepCopyAnalyticHighOrderCurveDerivatives(this._analyticHighOrderCurveDerivatives);
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        var curvatureNumerator = [];
        var curvatureDerivativeNumerator = [];
        this._previousSpline = this._spline.clone();
        this._spline = this.spline.moveControlPoints(convertStepToVector2d(deltaX));
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        if (this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // e = this.expensiveComputation(this._spline);
            this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
            // curvatureNumerator = this.curvatureNumerator(e.h4);
            curvatureNumerator = this.curvatureNumerator();
            this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator);
            this.constraintType = ConstraintType.inflection;
            //this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
            this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator);
            this.inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length;
        }
        if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // curvatureDerivativeNumerator = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
            this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(curvatureDerivativeNumerator);
            this.constraintType = ConstraintType.curvatureExtrema;
            //this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
            this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(curvatureDerivativeNumerator);
            this.curvatureExtremaNumberOfActiveConstraints = curvatureDerivativeNumerator.length - this.curvatureExtremaInactiveConstraints.length;
        }
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, curvatureDerivativeNumerator, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)  
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        // JCL temporary add
        return true;
    };
    AbstractOptProblemBSplineR1toR2.prototype.fStep = function (step) {
        if (this._previousAnalyticHighOrderCurveDerivatives.bdsxu.flattenControlPointsArray().length === 0) {
            if (this._analyticHighOrderCurveDerivatives.bdsxu.flattenControlPointsArray().length === 0) {
                this._previousAnalyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
            }
            else {
                this._previousAnalyticHighOrderCurveDerivatives = deepCopyAnalyticHighOrderCurveDerivatives(this._analyticHighOrderCurveDerivatives);
            }
            this._previousSpline = this._spline.clone();
        }
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        var curvatureNumerator = [];
        var curvatureDerivativeNumerator = [];
        var splineTemp = this.spline.clone();
        splineTemp = splineTemp.moveControlPoints(convertStepToVector2d(step));
        if (this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // e = this.expensiveComputation(splineTemp);
            this._analyticHighOrderCurveDerivatives = this.expensiveComputation(splineTemp);
            // curvatureNumerator = this.curvatureNumerator(e.h4);
            curvatureNumerator = this.curvatureNumerator();
        }
        if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // curvatureDerivativeNumerator = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
        }
        return this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, curvatureDerivativeNumerator, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    };
    AbstractOptProblemBSplineR1toR2.prototype.f0Step = function (step) {
        var splineTemp = this.spline.clone();
        splineTemp = splineTemp.moveControlPoints(convertStepToVector2d(step));
        return this.compute_f0(this.compute_gradient_f0(splineTemp));
    };
    AbstractOptProblemBSplineR1toR2.prototype.expensiveComputation = function (spline) {
        var sxuuu;
        var syuuu;
        var controlPointArray = [];
        var bdsxuuu = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var bdsyuuu = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var h1 = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var h2 = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var h3 = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var sx = this.bSplineR1toR1Factory(spline.getControlPointsX(), spline.knots);
        var sy = this.bSplineR1toR1Factory(spline.getControlPointsY(), spline.knots);
        var sxu = sx.derivative();
        var syu = sy.derivative();
        var sxuu = sxu.derivative();
        var syuu = syu.derivative();
        var bdsxu = sxu.bernsteinDecomposition();
        var bdsyu = syu.bernsteinDecomposition();
        var bdsxuu = sxuu.bernsteinDecomposition();
        var bdsyuu = syuu.bernsteinDecomposition();
        if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            sxuuu = sxuu.derivative();
            syuuu = syuu.derivative();
            bdsxuuu = sxuuu.bernsteinDecomposition();
            bdsyuuu = syuuu.bernsteinDecomposition();
            h1 = (bdsxu.multiply(bdsxu)).add(bdsyu.multiply(bdsyu));
            h2 = (bdsxu.multiply(bdsyuuu)).subtract(bdsyu.multiply(bdsxuuu));
            h3 = (bdsxu.multiply(bdsxuu)).add(bdsyu.multiply(bdsyuu));
        }
        var h4 = (bdsxu.multiply(bdsyuu)).subtract(bdsyu.multiply(bdsxuu));
        return {
            bdsxu: bdsxu,
            bdsyu: bdsyu,
            bdsxuu: bdsxuu,
            bdsyuu: bdsyuu,
            bdsxuuu: bdsxuuu,
            bdsyuuu: bdsyuuu,
            h1: h1,
            h2: h2,
            h3: h3,
            h4: h4
        };
    };
    AbstractOptProblemBSplineR1toR2.prototype.initExpansiveComputations = function () {
        var controlPointArray = [];
        var bdsxu = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var bdsyu = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var bdsxuu = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var bdsyuu = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var bdsxuuu = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var bdsyuuu = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var h1 = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var h2 = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var h3 = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        var h4 = new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(controlPointArray);
        return {
            bdsxu: bdsxu,
            bdsyu: bdsyu,
            bdsxuu: bdsxuu,
            bdsyuu: bdsyuu,
            bdsxuuu: bdsxuuu,
            bdsyuuu: bdsyuuu,
            h1: h1,
            h2: h2,
            h3: h3,
            h4: h4
        };
    };
    AbstractOptProblemBSplineR1toR2.prototype.compute_gradient_f0 = function (spline) {
        var result = [];
        var n = spline.freeControlPoints.length;
        for (var i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].x - this._target.freeControlPoints[i].x);
        }
        for (var i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].y - this._target.freeControlPoints[i].y);
        }
        return result;
    };
    AbstractOptProblemBSplineR1toR2.prototype.compute_f0 = function (gradient_f0) {
        var result = 0;
        var n = gradient_f0.length;
        for (var i = 0; i < n; i += 1) {
            result += Math.pow(gradient_f0[i], 2);
        }
        return 0.5 * result;
    };
    AbstractOptProblemBSplineR1toR2.prototype.compute_curvatureExtremaConstraints = function (curvatureDerivativeNumerator, constraintsSign, inactiveConstraints) {
        var result = [];
        for (var i = 0, j = 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            }
            else {
                result.push(curvatureDerivativeNumerator[i] * constraintsSign[i]);
            }
        }
        return result;
    };
    AbstractOptProblemBSplineR1toR2.prototype.compute_inflectionConstraints = function (curvatureNumerator, constraintsSign, inactiveConstraints) {
        var result = [];
        for (var i = 0, j = 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            }
            else {
                result.push(curvatureNumerator[i] * constraintsSign[i]);
            }
        }
        return result;
    };
    // curvatureNumerator(h4: BernsteinDecompositionR1toR1): number[] {
    //     return h4.flattenControlPointsArray();
    AbstractOptProblemBSplineR1toR2.prototype.curvatureNumerator = function () {
        return this._analyticHighOrderCurveDerivatives.h4.flattenControlPointsArray();
    };
    // curvatureDerivativeNumerator(   h1: BernsteinDecompositionR1toR1, 
    //                                 h2: BernsteinDecompositionR1toR1, 
    //                                 h3: BernsteinDecompositionR1toR1, 
    //                                 h4: BernsteinDecompositionR1toR1): number[] {
    //     const g = (h1.multiply(h2)).subtract(h3.multiply(h4).multiplyByScalar(3));
    AbstractOptProblemBSplineR1toR2.prototype.curvatureDerivativeNumerator = function () {
        var g = (this._analyticHighOrderCurveDerivatives.h1.multiply(this._analyticHighOrderCurveDerivatives.h2)).subtract(this._analyticHighOrderCurveDerivatives.h3.multiply(this._analyticHighOrderCurveDerivatives.h4).multiplyByScalar(3));
        return g.flattenControlPointsArray();
    };
    AbstractOptProblemBSplineR1toR2.prototype.curvatureDerivativeNumeratorPreviousIteration = function () {
        var g = (this._previousAnalyticHighOrderCurveDerivatives.h1.multiply(this._previousAnalyticHighOrderCurveDerivatives.h2)).subtract(this._previousAnalyticHighOrderCurveDerivatives.h3.multiply(this._previousAnalyticHighOrderCurveDerivatives.h4).multiplyByScalar(3));
        return g.flattenControlPointsArray();
    };
    AbstractOptProblemBSplineR1toR2.prototype.computeConstraintsSign = function (controlPoints) {
        var result = [];
        for (var i = 0, n = controlPoints.length; i < n; i += 1) {
            if (controlPoints[i] > 0) {
                result.push(-1);
            }
            else {
                result.push(1);
            }
        }
        return result;
    };
    AbstractOptProblemBSplineR1toR2.prototype.compute_f = function (curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints, curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints) {
        var f = [];
        if (this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            var r1 = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            var r2 = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
            f = r1.concat(r2);
        }
        else if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            f = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        }
        else if (this._shapeSpaceDiffEventsStructure.activeControlInflections) {
            f = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
        }
        else {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "compute_f", "active control set to none: unable to compute f.");
            warning.logMessage();
            f[0] = 0;
        }
        return f;
    };
    // compute_gradient_f( e: ExpensiveComputationResults,
    //                     inflectionConstraintsSign: number[],
    AbstractOptProblemBSplineR1toR2.prototype.compute_gradient_f = function (inflectionConstraintsSign, inflectionInactiveConstraints, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints) {
        if (this._shapeSpaceDiffEventsStructure.activeControlInflections && this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // const m1 = this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
            // const m2 = this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints)
            var m1 = this.compute_curvatureExtremaConstraints_gradient(curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
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
            // return this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints)
            return this.compute_curvatureExtremaConstraints_gradient(curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            // JCL modif temporaire pour debuter integration OptProblemBSplineR1toR2
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
    AbstractOptProblemBSplineR1toR2.prototype.update = function (spline) {
        // let e: ExpensiveComputationResults = this.initExpansiveComputations();
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        this._spline = spline.clone();
        this.computeBasisFunctionsDerivatives();
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2;
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        this._hessian_f0 = DiagonalMatrix_1.identityMatrix(this._numberOfIndependentVariables);
        if (this._shapeSpaceDiffEventsStructure.activeControlInflections || this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // e = this.expensiveComputation(this._spline);
            this._analyticHighOrderCurveDerivatives = this.expensiveComputation(this._spline);
            // this._curvatureNumeratorCP = this.curvatureNumerator(e.h4);
            this._curvatureNumeratorCP = this.curvatureNumerator();
            this._inflectionTotalNumberOfConstraints = this._curvatureNumeratorCP.length;
            this.inflectionConstraintsSign = this.computeConstraintsSign(this._curvatureNumeratorCP);
            this.constraintType = ConstraintType.inflection;
            this._inflectionInactiveConstraints = this.computeInactiveConstraints(this._curvatureNumeratorCP);
            this.inflectionNumberOfActiveConstraints = this._curvatureNumeratorCP.length - this.inflectionInactiveConstraints.length;
        }
        if (this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
            // this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
            this._curvatureDerivativeNumeratorCP = this.curvatureDerivativeNumerator();
            this._curvatureExtremaTotalNumberOfConstraints = this._curvatureDerivativeNumeratorCP.length;
            this._curvatureExtremaConstraintsSign = this.computeConstraintsSign(this._curvatureDerivativeNumeratorCP);
            this.constraintType = ConstraintType.curvatureExtrema;
            this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this._curvatureDerivativeNumeratorCP);
            this.curvatureExtremaNumberOfActiveConstraints = this._curvatureDerivativeNumeratorCP.length - this.curvatureExtremaInactiveConstraints.length;
        }
        this._f = this.compute_f(this._curvatureNumeratorCP, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureDerivativeNumeratorCP, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        // this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this._curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    };
    AbstractOptProblemBSplineR1toR2.prototype.init = function (spline) {
        this._analyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        this._previousAnalyticHighOrderCurveDerivatives = this.initExpansiveComputations();
        // this._previousAnalyticHighOrderCurveDerivatives = this.expensiveComputation(spline);
    };
    return AbstractOptProblemBSplineR1toR2;
}());
exports.AbstractOptProblemBSplineR1toR2 = AbstractOptProblemBSplineR1toR2;
function convertStepToVector2d(step) {
    var n = step.length / 2;
    var result = [];
    for (var i = 0; i < n; i += 1) {
        result.push(new Vector2d_1.Vector2d(step[i], step[n + i]));
    }
    return result;
}
exports.convertStepToVector2d = convertStepToVector2d;
function deepCopyAnalyticHighOrderCurveDerivatives(analyticHighOrderCurveDerivatives) {
    var bdsxu = analyticHighOrderCurveDerivatives.bdsxu.clone();
    var bdsyu = analyticHighOrderCurveDerivatives.bdsyu.clone();
    var bdsxuu = analyticHighOrderCurveDerivatives.bdsxuu.clone();
    var bdsyuu = analyticHighOrderCurveDerivatives.bdsyuu.clone();
    var bdsxuuu = analyticHighOrderCurveDerivatives.bdsxuuu.clone();
    var bdsyuuu = analyticHighOrderCurveDerivatives.bdsyuuu.clone();
    var h1 = analyticHighOrderCurveDerivatives.h1.clone();
    var h2 = analyticHighOrderCurveDerivatives.h2.clone();
    var h3 = analyticHighOrderCurveDerivatives.h3.clone();
    var h4 = analyticHighOrderCurveDerivatives.h4.clone();
    return {
        bdsxu: bdsxu,
        bdsyu: bdsyu,
        bdsxuu: bdsxuu,
        bdsyuu: bdsyuu,
        bdsxuuu: bdsxuuu,
        bdsyuuu: bdsyuuu,
        h1: h1,
        h2: h2,
        h3: h3,
        h4: h4
    };
}
exports.deepCopyAnalyticHighOrderCurveDerivatives = deepCopyAnalyticHighOrderCurveDerivatives;
