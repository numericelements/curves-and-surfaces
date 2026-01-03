"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClosedCurveModelAlternative01 = void 0;
const Vector2d_1 = require("../mathVector/Vector2d");
// import { Optimizer } from "../optimizers/Optimizer"
// import { ActiveControl } from "../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2"
const AbstractCurveModel_1 = require("./AbstractCurveModel");
const PeriodicBSplineR1toR2withOpenKnotSequence_1 = require("../newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence");
// import { OptimizationProblemPeriodicBSplineR1toR2QuasiNewton } from "../bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2QuasiNewton"
class ClosedCurveModelAlternative01 extends AbstractCurveModel_1.AbstractCurveModel {
    // protected optimizationProblem: OptimizationProblemPeriodicBSplineR1toR2QuasiNewton
    constructor() {
        super();
        const px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3;
        const py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72;
        const cp = [[-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4],
            [px0, py5], [px1, py4], [px2, py2], [px3, py0],
            [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4],
            [-px2, -py2], [-px3, py0], [-px2, py2]];
        let cp1 = [];
        for (let cpi of cp) {
            cp1.push([cpi[1], -cpi[0]]);
        }
        const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        this._splineTarget = (0, PeriodicBSplineR1toR2withOpenKnotSequence_1.create_PeriodicBSplineR1toR2)(cp1, knots);
        this._spline = this._splineTarget.clone();
        // this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2QuasiNewton(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
    }
    get spline() {
        return this._spline.clone();
    }
    get isClosed() {
        return true;
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
            if (cp === this._spline.freeControlPoints.length - 1) {
                cp -= 1;
            }
            const grevilleAbscissae = this._spline.grevilleAbscissae();
            let meanGA = (grevilleAbscissae[cp] + grevilleAbscissae[cp + 1]) / 2;
            if (meanGA < this._spline.knots[this._spline.degree]) {
                let index = this._spline.degree;
                meanGA = (this._spline.knots[index] + this._spline.knots[index + 1]) / 2;
            }
            else if (meanGA > this._spline.knots[this._spline.knots.length - this._spline.degree - 1]) {
                let index = this._spline.knots.length - this._spline.degree - 1;
                meanGA = (this._spline.knots[index] + this._spline.knots[index - 1]) / 2;
            }
            this._splineTarget.insertKnot(meanGA);
            this._spline.insertKnot(meanGA);
        }
        // this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2QuasiNewton(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    }
    setActiveControl() {
        // this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2QuasiNewton(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    }
}
exports.ClosedCurveModelAlternative01 = ClosedCurveModelAlternative01;
