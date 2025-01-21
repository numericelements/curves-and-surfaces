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
exports.CurveModel = void 0;
var BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
var Vector2d_1 = require("../mathVector/Vector2d");
// import { OptimizationProblemBSplineR1toR2 } from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2"
// import { Optimizer } from "../optimizers/Optimizer"
var AbstractCurveModel_1 = require("./AbstractCurveModel");
var CurveModel = /** @class */ (function (_super) {
    __extends(CurveModel, _super);
    // protected optimizationProblem: OptimizationProblemBSplineR1toR2
    function CurveModel() {
        var _this = _super.call(this) || this;
        var cp0 = new Vector2d_1.Vector2d(-0.5, -0.1);
        var cp1 = new Vector2d_1.Vector2d(-0.25, -0.3);
        var cp2 = new Vector2d_1.Vector2d(0.25, -0.2);
        var cp3 = new Vector2d_1.Vector2d(0.5, 0.3);
        _this._spline = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1]);
        return _this;
        // const cp0 = new Vector2d(-0.5, 0)
        // const cp1 = new Vector2d(-0.3, 0.5)
        // const cp2 = new Vector2d(0, 0.7)
        // const cp3 = new Vector2d(0.3, 0.5)
        // const cp4 = new Vector2d(0.5, 0)
        // this._spline = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1 ])
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        //this.optimizer = new QuasiNewtonOptimizer(this.optimizationProblem)
        // console.log("end constructor CurveModel.")
    }
    Object.defineProperty(CurveModel.prototype, "spline", {
        get: function () {
            return this._spline.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveModel.prototype, "isClosed", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    CurveModel.prototype.setSpline = function (spline) {
        this._spline = spline;
        this.notifyObservers();
    };
    CurveModel.prototype.addControlPoint = function (controlPointIndex) {
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
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    };
    CurveModel.prototype.setActiveControl = function () {
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    };
    CurveModel.prototype.setControlPoints = function (controlPoints) {
        this.spline.controlPoints = controlPoints;
        //this.notifyObservers()
    };
    return CurveModel;
}(AbstractCurveModel_1.AbstractCurveModel));
exports.CurveModel = CurveModel;
