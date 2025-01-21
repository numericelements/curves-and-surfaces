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
exports.ClosedCurveModelHessian = void 0;
var PeriodicBSplineR1toR2withOpenKnotSequence_1 = require("../newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence");
var Vector2d_1 = require("../mathVector/Vector2d");
// import { OptimizationProblemPeriodicBSplineR1toR2Hessian } from "../bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2Hessian"
// import { Optimizer } from "../optimizers/Optimizer"
var AbstractCurveModel_1 = require("./AbstractCurveModel");
var ClosedCurveModelHessian = /** @class */ (function (_super) {
    __extends(ClosedCurveModelHessian, _super);
    // protected optimizationProblem: OptimizationProblemPeriodicBSplineR1toR2Hessian
    function ClosedCurveModelHessian() {
        var _this = _super.call(this) || this;
        /*
        const px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3
        const py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72
        const cp = [ [-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4],
        [px0, py5], [px1, py4], [px2, py2], [px3, py0],
        [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4],
        [-px2, -py2], [-px3, py0], [-px2, py2] ]
        let cp1: number[][] = []
        for (let cpi of cp) {
            cp1.push([cpi[1], -cpi[0]])
        }

        const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        this._spline = create_PeriodicBSplineR1toR2(cp1, knots)
        */
        _this._spline = PeriodicBSplineR1toR2withOpenKnotSequence_1.create_PeriodicBSplineR1toR2([[-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176], [0.28, -0.201], [0, -0.406], [-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176]], [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        return _this;
        // this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2Hessian(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
    }
    Object.defineProperty(ClosedCurveModelHessian.prototype, "spline", {
        get: function () {
            return this._spline.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveModelHessian.prototype, "isClosed", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    ClosedCurveModelHessian.prototype.setControlPointPosition = function (controlPointIndex, x, y) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector2d_1.Vector2d(x, y));
        this.notifyObservers();
        if (this.activeOptimizer) {
            // this.optimize(controlPointIndex, x, y)
        }
    };
    ClosedCurveModelHessian.prototype.setSpline = function (spline) {
        this._spline = spline;
        this.notifyObservers();
    };
    ClosedCurveModelHessian.prototype.addControlPoint = function (controlPointIndex) {
        var cp = controlPointIndex;
        if (cp != null) {
            if (cp === 0) {
                cp += 1;
            }
            if (cp === this._spline.freeControlPoints.length - 1) {
                cp -= 1;
            }
            var grevilleAbscissae = this._spline.grevilleAbscissae();
            var meanGA = (grevilleAbscissae[cp] + grevilleAbscissae[cp + 1]) / 2;
            if (meanGA < this._spline.knots[this._spline.degree]) {
                var index = this._spline.degree;
                meanGA = (this._spline.knots[index] + this._spline.knots[index + 1]) / 2;
            }
            else if (meanGA > this._spline.knots[this._spline.knots.length - this._spline.degree - 1]) {
                var index = this._spline.knots.length - this._spline.degree - 1;
                meanGA = (this._spline.knots[index] + this._spline.knots[index - 1]) / 2;
            }
            this._spline.insertKnot(meanGA);
        }
        // this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2Hessian(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    };
    ClosedCurveModelHessian.prototype.setActiveControl = function () {
        // this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2Hessian(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    };
    return ClosedCurveModelHessian;
}(AbstractCurveModel_1.AbstractCurveModel));
exports.ClosedCurveModelHessian = ClosedCurveModelHessian;
