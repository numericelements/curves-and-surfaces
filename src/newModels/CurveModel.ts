import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2"
import { Vector2d } from "../mathVector/Vector2d"
// import { OptimizationProblemBSplineR1toR2 } from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2"
// import { Optimizer } from "../optimizers/Optimizer"
import { AbstractCurveModel } from "./AbstractCurveModel"

export class CurveModel extends AbstractCurveModel {

    protected _spline: BSplineR1toR2
    // protected optimizationProblem: OptimizationProblemBSplineR1toR2

    constructor() {
        super();

        const cp0 = new Vector2d(-0.5, -0.1)
        const cp1 = new Vector2d(-0.25, -0.3)
        const cp2 = new Vector2d(0.25, -0.2)
        const cp3 = new Vector2d(0.5, 0.3)

        this._spline = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])

        // const cp0 = new Vector2d(-0.5, 0)
        // const cp1 = new Vector2d(-0.3, 0.5)
        // const cp2 = new Vector2d(0, 0.7)
        // const cp3 = new Vector2d(0.3, 0.5)
        // const cp4 = new Vector2d(0.5, 0)

        // this._spline = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1 ])

        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        //this.optimizer = new QuasiNewtonOptimizer(this.optimizationProblem)

    }

    get spline(): BSplineR1toR2 {
        return this._spline.clone()
    }

    get isClosed(): boolean {
        return false
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
            this._spline.insertKnot(grevilleAbscissae[cp])
        }
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()

    }

    setActiveControl() {
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }

    setControlPoints(controlPoints: Vector2d[]) {
        this.spline.controlPoints = controlPoints;
        //this.notifyObservers()
    }

}