"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveModelQuasiNewton = void 0;
const BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
const Vector2d_1 = require("../mathVector/Vector2d");
// import { Optimizer } from "../optimizers/Optimizer"
const AbstractCurveModel_1 = require("./AbstractCurveModel");
// import { OptimizationProblemBSplineR1toR2QuasiNewton } from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2QuasiNewton"
class CurveModelQuasiNewton extends AbstractCurveModel_1.AbstractCurveModel {
    // protected optimizationProblem: OptimizationProblemBSplineR1toR2QuasiNewton
    constructor() {
        super();
        /*
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.1, 0.5)
        const cp2 = new Vector2d(0.1, 0.7)
        const cp3 = new Vector2d(0.5, 0)

        this._spline = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])
        */
        const cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        const cp1 = new Vector2d_1.Vector2d(-0.3, 0.5);
        const cp2 = new Vector2d_1.Vector2d(0, 0.7);
        const cp3 = new Vector2d_1.Vector2d(0.3, 0.6);
        const cp4 = new Vector2d_1.Vector2d(0.5, 0);
        this._spline = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]);
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2QuasiNewton(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
    }
    get spline() {
        return this._spline.clone();
    }
    get isClosed() {
        return false;
    }
    setControlPointPosition(controlPointIndex, x, y) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector2d_1.Vector2d(x, y));
        this.notifyObservers();
        if (this.activeOptimizer) {
            // this.optimize(controlPointIndex, x, y)
        }
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
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2QuasiNewton(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    }
    setActiveControl() {
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2QuasiNewton(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    }
}
exports.CurveModelQuasiNewton = CurveModelQuasiNewton;
