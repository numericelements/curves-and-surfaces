"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveModelAlternative01 = void 0;
const BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
const Vector2d_1 = require("../mathVector/Vector2d");
// import { OptimizationProblemBSplineR1toR2} from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2"
// import { OptimizationProblemBSplineR1toR2WithWeigthingFactors } from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2WithWeigthingFactors"
// import { Optimizer } from "../optimizers/Optimizer"
// import { ActiveControl } from "../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2"
const AbstractCurveModel_1 = require("./AbstractCurveModel");
class CurveModelAlternative01 extends AbstractCurveModel_1.AbstractCurveModel {
    // protected optimizationProblem: OptimizationProblemBSplineR1toR2
    constructor() {
        super();
        const cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        const cp1 = new Vector2d_1.Vector2d(-0.1, 0.5);
        const cp2 = new Vector2d_1.Vector2d(0.1, 0.5);
        const cp3 = new Vector2d_1.Vector2d(0.5, 0);
        this._splineTarget = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1]);
        this._spline = this._splineTarget.clone();
        //this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2WithWeigthingFactors(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
    }
    get spline() {
        return this._spline.clone();
    }
    get isClosed() {
        return false;
    }
    notifyObservers() {
        for (let observer of this.observers) {
            observer.update(this._spline.clone());
        }
        for (let observer of this.observersCP) {
            observer.update(this._splineTarget.clone());
        }
    }
    moveControlPoint(controlPointIndex, deltaX, deltaY) {
        this._splineTarget.moveControlPoint(controlPointIndex, deltaX, deltaY);
        if (deltaX * deltaX + deltaY * deltaY > 0) {
            this.notifyObservers();
        }
    }
    setControlPointPosition(controlPointIndex, x, y) {
        this._splineTarget.setControlPointPosition(controlPointIndex, new Vector2d_1.Vector2d(x, y));
        if (this.activeOptimizer) {
            // this.optimize(controlPointIndex, x, y)
        }
        else {
            this._spline = this._splineTarget.clone();
        }
        this.notifyObservers();
    }
    // optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
    //     if (this.optimizationProblem && this.optimizer) {
    //         const p = this._splineTarget.freeControlPoints[selectedControlPoint].clone()
    //         this._splineTarget.setControlPointPosition(selectedControlPoint, new Vector2d(ndcX, ndcY))
    //         this.optimizationProblem.setTargetSpline(this._splineTarget)
    //         try {
    //             this.optimizer.optimize_using_trust_region(10e-6, 1000, 800)
    //             if (this.optimizer.success === true) {
    //                 this.setSpline(this.optimizationProblem.spline.clone())
    //             }
    //         }
    //         catch(e) {
    //             this._splineTarget.setControlPointPosition(selectedControlPoint, new Vector2d(p.x, p.y))
    //             console.log(e)
    //         }
    //     }
    // }
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
            if (cp === this._splineTarget.controlPoints.length - 1) {
                cp -= 1;
            }
            const grevilleAbscissae = this._splineTarget.grevilleAbscissae();
            this._splineTarget.insertKnot(grevilleAbscissae[cp]);
            this._spline.insertKnot(grevilleAbscissae[cp]);
        }
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2WithWeigthingFactors(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    }
    setActiveControl() {
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2WithWeigthingFactors(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    }
}
exports.CurveModelAlternative01 = CurveModelAlternative01;
