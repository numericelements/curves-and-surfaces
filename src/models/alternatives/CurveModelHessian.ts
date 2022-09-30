import { BSplineR1toR2 } from "../../bsplines/R1toR2/BSplineR1toR2"
import { Vector2d } from "../../mathVector/Vector2d"
import { OpBSplineR1toR2Hessian } from "../../optimizationProblems/alternatives/OpBSplineR1toR2Hessian"
import { Optimizer } from "../../optimizers/Optimizer"
import { BaseCurve2dModel } from "../BaseCurve2dModel"

export class CurveModelHessian extends BaseCurve2dModel {

    protected _spline: BSplineR1toR2
    protected optimizationProblem: OpBSplineR1toR2Hessian

    constructor() {
        super()
        /*
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.1, 0.5)
        const cp2 = new Vector2d(0.1, 0.7)
        const cp3 = new Vector2d(0.5, 0)

        this._spline = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])
        */

        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.3, 0.5)
        const cp2 = new Vector2d(0, 0.7)
        const cp3 = new Vector2d(0.3, 0.6)
        const cp4 = new Vector2d(0.5, 0)

        this._spline = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1 ])


        this.optimizationProblem = new  OpBSplineR1toR2Hessian(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)

    }

    get spline(): BSplineR1toR2 {
        return this._spline.clone()
    }

    get isClosed(): boolean {
        return false
    }



    setControlPointPosition(controlPointIndex: number, x: number, y: number) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector2d(x, y))
        this.notifyObservers()
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y)
        }
    }


    setSpline(spline: BSplineR1toR2) {
        this._spline = spline
        this.notifyObservers()
    }

    addControlPoint(controlPointIndex: number | null) {
        let cp = controlPointIndex
        if (cp != null) {
            if (cp === 0) { cp += 1}
            if (cp === this._spline.controlPoints.length -1) { cp -= 1} 
            const grevilleAbscissae = this._spline.grevilleAbscissae()
            this._spline = this._spline.insertKnot(grevilleAbscissae[cp])
        }
        this.optimizationProblem = new  OpBSplineR1toR2Hessian(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()

    }

    setActiveControl() {
        this.optimizationProblem = new  OpBSplineR1toR2Hessian(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }

}