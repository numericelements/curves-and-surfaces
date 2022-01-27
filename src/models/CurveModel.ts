import { BSplineR1toR2Interface } from "../bsplines/BSplineR1toR2Interface"
import { BSplineR1toR2 } from "../bsplines/BSplineR1toR2"
import { IObserver } from "../designPatterns/Observer"
import { Vector2d } from "../mathVector/Vector2d"
import { CurveModelInterface } from "./CurveModelInterface"
import { OptimizationProblemBSplineR1toR2 } from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2"
import { Optimizer } from "../optimizers/Optimizer"
import { ActiveControl } from "../bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2"

export class CurveModel implements CurveModelInterface {

    private _spline: BSplineR1toR2
    private observers: IObserver<BSplineR1toR2Interface>[] = []
    private optimizer: Optimizer
    private optimizationProblem: OptimizationProblemBSplineR1toR2
    private activeOptimizer: boolean = true
    private activeControl: ActiveControl = ActiveControl.both

    constructor() {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.1, 0.5)
        const cp2 = new Vector2d(0.1, 0.5)
        const cp3 = new Vector2d(0.5, 0)

        this._spline = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])

        this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)

    }

    get spline(): BSplineR1toR2 {
        return this._spline.clone()
    }

    get isClosed(): boolean {
        return false
    }

    registerObserver(observer: IObserver<BSplineR1toR2Interface>) {
        this.observers.push(observer)
    }

    removeObserver(observer: IObserver<BSplineR1toR2Interface>) {
        this.observers.splice(this.observers.indexOf(observer), 1)
    }

    notifyObservers() {
        for (let observer of this.observers){
            observer.update(this._spline)
        }
    }

    moveControlPoint(controlPointIndex: number, deltaX: number, deltaY: number) {
        this._spline.moveControlPoint(controlPointIndex, deltaX, deltaY)
        if (deltaX*deltaX + deltaY*deltaY > 0) {
            this.notifyObservers()
        }
    }

    /*
    setControlPointPosition(controlPointIndex: number, x: number, y: number) {
        this._spline.setControlPoint(controlPointIndex, new Vector2d(x, y))
        this.notifyObservers()
    }
    */

    setControlPointPosition(controlPointIndex: number, x: number, y: number) {
        this._spline.setControlPoint(controlPointIndex, new Vector2d(x, y))
        this.notifyObservers()
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y)
        }
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
    
        const p = this._spline.freeControlPoints[selectedControlPoint].clone()

        this._spline.setControlPoint(selectedControlPoint, new Vector2d(ndcX, ndcY))
        this.optimizationProblem.setTargetSpline(this._spline)
        try {
        this.optimizer.optimize_using_trust_region(10e-6, 1000, 800)
        if (this.optimizer.success === true) {
            this.setSpline(this.optimizationProblem.spline.clone())
        }
       }
       catch(e) {
        this._spline.setControlPoint(selectedControlPoint, new Vector2d(p.x, p.y))
        console.log(e)
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
            this._spline.insertKnot(grevilleAbscissae[cp])
        }
        this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone())
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()

    }

    setActiveControl() {
        this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }


    toggleActiveControlOfCurvatureExtrema() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true
            this.activeControl = ActiveControl.curvatureExtrema
        }
        else if (this.activeControl == ActiveControl.both){
            this.activeControl = ActiveControl.inflections
        }
        else if (this.activeControl == ActiveControl.inflections){
            this.activeControl = ActiveControl.both
        }
        else if (this.activeControl == ActiveControl.curvatureExtrema){
            this.activeOptimizer = false
        }

        if (this.activeOptimizer){
            this.setActiveControl()
        }
    }

    toggleActiveControlOfInflections() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true
            this.activeControl = ActiveControl.inflections
        }
        else if (this.activeControl == ActiveControl.both){
            this.activeControl = ActiveControl.curvatureExtrema
        }
        else if (this.activeControl == ActiveControl.curvatureExtrema){
            this.activeControl = ActiveControl.both
        }
        else if (this.activeControl == ActiveControl.inflections){
            this.activeOptimizer = false
        }

        if (this.activeOptimizer){
            this.setActiveControl()
        }
    }


}