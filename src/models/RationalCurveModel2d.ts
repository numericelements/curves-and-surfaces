import { RationalBSplineR1toR2 } from "../bsplines/R1toR2/RationalBSplineR1toR2";
import { OpRationalBSplineR1toR2 } from "../optimizationProblems/OpRationalBSplineR1toR2";
import { Vector3d } from "../mathVector/Vector3d";
import { Optimizer } from "../optimizers/Optimizer";
import { BaseRationalCurve2dModel } from "./BaseRationalCurve2dModel";
import { RationalBSplineR1toR2Adapter } from "../bsplines/R1toR2/RationalBSplineR1toR2Adapter";


export class RationalCurveModel2d extends BaseRationalCurve2dModel {

    protected _spline: RationalBSplineR1toR2

    constructor() {
        super()
        
        const cp0 = new Vector3d(-0.5, 0, 1)
        const cp1 = new Vector3d(-0.3, 0.5, 1)
        const cp2 = new Vector3d(0, 0.7, 1)
        const cp3 = new Vector3d(0.3, 0.5, 1)
        const cp4 = new Vector3d(0.5, 0, 1)
        this._spline = new RationalBSplineR1toR2([ cp0, cp1, cp2, cp3, cp4 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1 ])
        //this._spline.elevateDegree()
        

        /*
        const cp0 = new Vector3d(1, 0, 4)
        const cp1 = new Vector3d(1, 1, Math.pow(2, 0.5) / 2 * 4)
        const cp2 = new Vector3d(0, 1, 4)
        let spline = new RationalBSplineR1toR2([ cp0, cp1, cp2], [ 0, 0, 0, 1, 1, 1 ])
        spline.elevateDegree()
        spline.elevateDegree()
        this._spline = spline
        */
        

        this.optimizationProblem = new  OpRationalBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
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
            this._spline = this._spline.insertKnot(grevilleAbscissae[cp])
        }
        this.optimizationProblem = new OpRationalBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }

    setActiveControl() {
        this.optimizationProblem = new OpRationalBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }

    setSpline(spline: RationalBSplineR1toR2) {
        this._spline = spline
        this.notifyObservers()
    }

}
