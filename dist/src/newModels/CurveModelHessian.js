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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveModelHessian = void 0;
var BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
var Vector2d_1 = require("../mathVector/Vector2d");
// import { OptimizationProblemBSplineR1toR2Hessian } from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2Hessian"
// import { Optimizer } from "../optimizers/Optimizer"
var AbstractCurveModel_1 = require("./AbstractCurveModel");
var CurveModelHessian = /** @class */ (function (_super) {
    __extends(CurveModelHessian, _super);
    // protected optimizationProblem: OptimizationProblemBSplineR1toR2Hessian
    function CurveModelHessian() {
        var _this = _super.call(this) || this;
        /*
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.1, 0.5)
        const cp2 = new Vector2d(0.1, 0.7)
        const cp3 = new Vector2d(0.5, 0)

        this._spline = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])
        */
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(-0.3, 0.5);
        var cp2 = new Vector2d_1.Vector2d(0, 0.7);
        var cp3 = new Vector2d_1.Vector2d(0.3, 0.6);
        var cp4 = new Vector2d_1.Vector2d(0.5, 0);
        _this._spline = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]);
        return _this;
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2Hessian(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
    }
    Object.defineProperty(CurveModelHessian.prototype, "spline", {
        get: function () {
            return this._spline.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveModelHessian.prototype, "isClosed", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    CurveModelHessian.prototype.setControlPointPosition = function (controlPointIndex, x, y) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector2d_1.Vector2d(x, y));
        this.notifyObservers();
        if (this.activeOptimizer) {
            // this.optimize(controlPointIndex, x, y)
        }
    };
    CurveModelHessian.prototype.setSpline = function (spline) {
        this._spline = spline;
        this.notifyObservers();
    };
    CurveModelHessian.prototype.addControlPoint = function (controlPointIndex) {
        var cp = controlPointIndex;
        if (cp != null) {
            if (cp === 0) {
                cp += 1;
            }
            if (cp === this._spline.controlPoints.length - 1) {
                cp -= 1;
            }
            var grevilleAbscissae = this._spline.grevilleAbscissae();
            this._spline.insertKnot(grevilleAbscissae[cp]);
        }
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2Hessian(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    };
    CurveModelHessian.prototype.setActiveControl = function () {
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2Hessian(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    };
    return CurveModelHessian;
}(AbstractCurveModel_1.AbstractCurveModel));
exports.CurveModelHessian = CurveModelHessian;
