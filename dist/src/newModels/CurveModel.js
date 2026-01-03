"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveModel = void 0;
const BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
const Vector2d_1 = require("../mathVector/Vector2d");
// import { OptimizationProblemBSplineR1toR2 } from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2"
// import { Optimizer } from "../optimizers/Optimizer"
const AbstractCurveModel_1 = require("./AbstractCurveModel");
class CurveModel extends AbstractCurveModel_1.AbstractCurveModel {
    // protected optimizationProblem: OptimizationProblemBSplineR1toR2
    constructor() {
        super();
        const cp0 = new Vector2d_1.Vector2d(-0.5, -0.1);
        const cp1 = new Vector2d_1.Vector2d(-0.25, -0.3);
        const cp2 = new Vector2d_1.Vector2d(0.25, -0.2);
        const cp3 = new Vector2d_1.Vector2d(0.5, 0.3);
        this._spline = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1]);
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
    get spline() {
        return this._spline.clone();
    }
    get isClosed() {
        return false;
    }
    setSpline(spline) {
        this._spline = spline;
        this.notifyObservers();
    }
    addControlPoint(controlPointIndex) {
        let cp = controlPointIndex;
        if (cp != null) {
            if (cp === 0) {
                cp += 1;
            }
            if (cp === this._spline.controlPoints.length - 1) {
                cp -= 1;
            }
            const grevilleAbscissae = this._spline.grevilleAbscissae();
            this._spline.insertKnot(grevilleAbscissae[cp]);
        }
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    }
    setActiveControl() {
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    }
    setControlPoints(controlPoints) {
        this.spline.controlPoints = controlPoints;
        //this.notifyObservers()
    }
}
exports.CurveModel = CurveModel;
