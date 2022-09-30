import { IBSplineR1toR2 } from "../bsplines/R1toR2/IBSplineR1toR2"
import { IOpBSplineR1toR2 } from "../optimizationProblems/IOpBSplineR1toR2"
import { IObserver } from "../designPatterns/Observer"
import { Vector2d } from "../mathVector/Vector2d"
import { ICurve2dModel } from "./ICurve2dModel"
import { Optimizer } from "../optimizers/Optimizer"
import { ActiveControl } from "../optimizationProblems/BaseOpBSplineR1toR2"
import { RationalBSplineR1toR2Adapter } from "../bsplines/R1toR2/RationalBSplineR1toR2Adapter"



export abstract class BaseCurve2dModel implements ICurve2dModel {

    protected abstract _spline : Readonly<IBSplineR1toR2>
    protected observers: IObserver<Readonly<IBSplineR1toR2>>[] = []
    protected observersCP: IObserver<Readonly<IBSplineR1toR2>>[] = []
    protected activeControl: ActiveControl = ActiveControl.both
    protected activeOptimizer: boolean = true
    protected optimizationProblem: IOpBSplineR1toR2 | null = null
    protected optimizer: Optimizer | null = null


    abstract spline : IBSplineR1toR2
    abstract isClosed : boolean

    abstract setSpline(spline: IBSplineR1toR2): void 
    abstract addControlPoint(controlPointIndex: number | null): void
    abstract setActiveControl(): void

    registerObserver(observer: IObserver<IBSplineR1toR2>) {
                this.observers.push(observer)
    }


    removeObserver(observer: IObserver<Readonly<IBSplineR1toR2>>) {
        this.observers.splice(this.observers.indexOf(observer), 1)
    }

    notifyObservers() {
        for (let observer of this.observers){
            observer.update(this._spline.clone())
        }
        for (let observer of this.observersCP){
            observer.update(this._spline.clone())
        }
    }

    setControlPointPosition(controlPointIndex: number, x: number, y: number) {
        this._spline = this._spline.setControlPointPosition(controlPointIndex, new Vector2d(x, y))
        this.notifyObservers()
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y)
        }
    }

    setControlPointWeight(controlPointIndex: number, w: number) {
        if (this._spline instanceof RationalBSplineR1toR2Adapter) {
            this._spline.setControlPointWeight(controlPointIndex, w)
            this.notifyObservers()
            /*
            if (this.activeOptimizer) {
                this.optimize(controlPointIndex, x, y)
            }
            */
        }
    }

    increaseControlPointWeight(controlPointIndex: number) {
        if (this._spline instanceof RationalBSplineR1toR2Adapter) {
            const delta = 1.1
            const w = this._spline.getControlPointWeight(controlPointIndex)
            this._spline.setControlPointWeight(controlPointIndex, w * delta)
            this.notifyObservers()
            /*
            if (this.activeOptimizer) {
                this.optimize(controlPointIndex, x, y)
            }
            */
        }
    }

    decreaseControlPointWeight(controlPointIndex: number) {
        if (this._spline instanceof RationalBSplineR1toR2Adapter) {
            const delta = 0.9
            const w = this._spline.getControlPointWeight(controlPointIndex)
            this._spline.setControlPointWeight(controlPointIndex, w * delta)
            this.notifyObservers()
            /*
            if (this.activeOptimizer) {
                this.optimize(controlPointIndex, x, y)
            }
            */
        }
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        if (this.optimizationProblem && this.optimizer) {
            //const p = this._spline.freeControlPoints[selectedControlPoint].clone()
            const p = this.optimizationProblem.spline.freeControlPoints[selectedControlPoint].clone()
            const distance = Math.sqrt(Math.pow(ndcX - p.x, 2) + Math.pow(ndcY - p.y, 2))
            //console.log(ndcX - p.x)
            const numberOfStep = 3 * Math.ceil(distance * 10)
            //const numberOfStep = 1
            for (let i = 1; i <= numberOfStep; i += 1) {
                let alpha = Math.pow(i / numberOfStep, 3)
                this._spline.setControlPointPosition(selectedControlPoint, new Vector2d((1-alpha)*p.x + alpha * ndcX, (1-alpha)*p.y + alpha * ndcY))
                this.optimizationProblem.setTargetSpline(this._spline)
                try {
                    this.optimizer.optimize_using_trust_region(10e-6, 1000, 800)
                    if (this.optimizer.success === true) {
                        this.setSpline(this.optimizationProblem.spline.clone())
                    }
                }
                catch(e) {
                    this._spline.setControlPointPosition(selectedControlPoint, new Vector2d(p.x, p.y))
                    console.log(e)
                }
            }
        }
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