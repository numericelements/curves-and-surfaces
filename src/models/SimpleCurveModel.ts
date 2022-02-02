import { BSplineR1toR2Interface } from "../bsplines/BSplineR1toR2Interface"
import { BSplineR1toR2 } from "../bsplines/BSplineR1toR2"
import { IObserver } from "../designPatterns/Observer"
import { Vector2d } from "../mathVector/Vector2d"
import { CurveModelInterface } from "./CurveModelInterface"
import { AbstractCurveModel } from "./AbstractCurveModel"


export class SimpleCurveModel extends AbstractCurveModel {

    protected _spline: BSplineR1toR2
    //private observers: IObserver<BSplineR1toR2Interface>[] = []

    constructor() {
        super()
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.1, 0.5)
        const cp2 = new Vector2d(0.1, 0.5)
        const cp3 = new Vector2d(0.5, 0)

        this._spline = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])

    }

    get spline(): BSplineR1toR2 {
        return this._spline.clone()
    }

    get isClosed(): boolean {
        return false
    }


    /*
    moveControlPoint(controlPointIndex: number, deltaX: number, deltaY: number) {
        this._spline.moveControlPoint(controlPointIndex, deltaX, deltaY)
        if (deltaX*deltaX + deltaY*deltaY > 0) {
            this.notifyObservers()
        }
    }
    */


    setControlPointPosition(controlPointIndex: number, x: number, y: number) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector2d(x, y))
        this.notifyObservers()
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
            //this.resetCurve(this.curveModel)
        }
        this.notifyObservers()
    }


    setActiveControl() {
       
    }


    toggleActiveControlOfCurvatureExtrema() {
        
    }

    toggleActiveControlOfInflections() {
       
    }


}