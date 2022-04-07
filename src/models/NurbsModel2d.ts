import { RationalBSplineR1toR2 } from "../bsplines/RationalBSplineR1toR2";
import { RationalBSplineR1toR2Adapter } from "../bsplines/RationalBSplineR1toR2Adapter";
import { OptimizationProblemRationalBSplineR1toR2 } from "../bsplinesOptimizationProblems/OptimizationProblemRationalBSplineR1toR2";
import { Vector3d } from "../mathVector/Vector3d";
import { Optimizer } from "../optimizers/Optimizer";
import { AbstractNurbsModel } from "./AbstractNurbsModel";


export class NurbsModel2d extends AbstractNurbsModel {

    protected _spline: RationalBSplineR1toR2

    constructor() {
        super()
        const cp0 = new Vector3d(-0.5, 0, 1)
        const cp1 = new Vector3d(-0.3, 0.5, 1)
        const cp2 = new Vector3d(0, 0.7, 1)
        const cp3 = new Vector3d(0.3, 0.5, 1)
        const cp4 = new Vector3d(0.5, 0, 1)
        this._spline = new RationalBSplineR1toR2([ cp0, cp1, cp2, cp3, cp4 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1 ])
        this.optimizationProblem = new  OptimizationProblemRationalBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
    }


    get spline(): RationalBSplineR1toR2 {
        return this._spline.clone()
    }

    getSplineAdapter(): RationalBSplineR1toR2Adapter {
        return new RationalBSplineR1toR2Adapter(this._spline.controlPoints, this._spline.knots)
    }

    get isClosed(): boolean {
        return false
    }

    addControlPoint(controlPointIndex: number | null) {
        
        let cp = controlPointIndex
        if (cp != null) {
            if (cp === 0) { cp += 1}
            if (cp === this._spline.controlPoints.length -1) { cp -= 1} 
            const grevilleAbscissae = this._spline.grevilleAbscissae()
            this._spline.insertKnot(grevilleAbscissae[cp])
        }
        console.log(this._spline)
        this.optimizationProblem = new OptimizationProblemRationalBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
        
    }

    setActiveControl() {
        this.optimizationProblem = new OptimizationProblemRationalBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }

    setSpline(spline: RationalBSplineR1toR2) {
        this._spline = spline
        this.notifyObservers()
    }

}