import { PeriodicBSplineR1toR2, create_PeriodicBSplineR1toR2 } from "../bsplines/PeriodicBSplineR1toR2"
import { Vector2d } from "../mathVector/Vector2d"
import { OptimizationProblemPeriodicBSplineR1toR2Hessian } from "../bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2Hessian"
import { Optimizer } from "../optimizers/Optimizer"
import { AbstractCurveModel } from "./AbstractCurveModel"

export class ClosedCurveModelHessian extends AbstractCurveModel {

    protected _spline: PeriodicBSplineR1toR2
    protected optimizationProblem: OptimizationProblemPeriodicBSplineR1toR2Hessian

    constructor() {
        super()
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

        this._spline = create_PeriodicBSplineR1toR2([[-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176], [0.28, -0.201], [0, -0.406], [-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176] ], [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2Hessian(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)

    }

    get spline(): PeriodicBSplineR1toR2 {
        return this._spline.clone()
    }

    get isClosed(): boolean {
        return true
    }


    
    setControlPointPosition(controlPointIndex: number, x: number, y: number) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector2d(x, y))
        this.notifyObservers()
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y)
        }
    }


    setSpline(spline: PeriodicBSplineR1toR2) {
        this._spline = spline
        this.notifyObservers()
    }

    addControlPoint(controlPointIndex: number | null) {
        let cp = controlPointIndex
        if (cp != null) {
            if (cp === 0) { cp += 1}
            if (cp === this._spline.freeControlPoints.length -1) { cp -= 1} 
            const grevilleAbscissae = this._spline.grevilleAbscissae()
            let meanGA = (grevilleAbscissae[cp] + grevilleAbscissae[cp+1]) / 2
            if (meanGA < this._spline.knots[this._spline.degree]) {
                let index = this._spline.degree;
                meanGA = (this._spline.knots[index] + this._spline.knots[index + 1]) / 2;
            }
            else if (meanGA > this._spline.knots[this._spline.knots.length - this._spline.degree - 1]) {
                let index = this._spline.knots.length - this._spline.degree - 1;
                meanGA = (this._spline.knots[index] + this._spline.knots[index - 1]) / 2;
            }
            this._spline.insertKnot(meanGA)
        }
        this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2Hessian(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }

    setActiveControl() {
        this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2Hessian(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }
    

}