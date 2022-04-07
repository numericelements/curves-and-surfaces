import { IObserver } from "../designPatterns/Observer"
import { KindOfObservers } from "./CurveModelInterface"
import { Optimizer } from "../optimizers/Optimizer"
import { ActiveControl } from "../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2"
import { RationalBSplineR1toR2 } from "../bsplines/RationalBSplineR1toR2"
import { Vector3d } from "../mathVector/Vector3d"
import { OptimizationProblemRationalBSplineR1toR2 } from "../bsplinesOptimizationProblems/OptimizationProblemRationalBSplineR1toR2"
import { BSplineR1toR2Interface } from "../bsplines/BSplineR1toR2Interface"



export abstract class AbstractNurbsModel  {

    protected abstract _spline : RationalBSplineR1toR2
    protected observers: IObserver<BSplineR1toR2Interface>[] = []
    protected observersCP: IObserver<BSplineR1toR2Interface>[] = []
    protected activeControl: ActiveControl = ActiveControl.both
    protected activeOptimizer: boolean = true
    protected optimizationProblem: OptimizationProblemRationalBSplineR1toR2 | null = null
    protected optimizer: Optimizer | null = null


    abstract spline : RationalBSplineR1toR2
    abstract isClosed : boolean

    abstract setSpline(spline: RationalBSplineR1toR2): void 
    abstract addControlPoint(controlPointIndex: number | null): void
    abstract setActiveControl(): void

    registerObserver(observer: IObserver<BSplineR1toR2Interface>, kind: KindOfObservers) {
        switch(kind) {
            case 'curve':
                this.observers.push(observer)
                break
            case 'control points':
                this.observersCP.push(observer)
                break
            default:
                throw Error("unknown kind")
        }
        
    }


    removeObserver(observer: IObserver<BSplineR1toR2Interface>, kind: KindOfObservers) {
        switch(kind) {
            case 'curve':
                this.observers.splice(this.observers.indexOf(observer), 1)
                break
            case 'control points':
                this.observersCP.splice(this.observersCP.indexOf(observer), 1)
                break
        }
    }

    notifyObservers() {
        for (let observer of this.observers){
            observer.update(this._spline.getSplineAdapter() )
        }
        for (let observer of this.observersCP){
            observer.update(this._spline.getSplineAdapter())
        }
    }

    setControlPointPosition(controlPointIndex: number, x: number, y: number, z: number) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector3d(x, y, z))
        this.notifyObservers()
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y)
        }
    }


    setControlPointPositionXY(controlPointIndex: number, x: number, y: number) {
        const cp = this._spline.controlPoints[controlPointIndex]
        this._spline.setControlPointPosition(controlPointIndex, new Vector3d(x * cp.z, y * cp.z, cp.z))
        this.notifyObservers()
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y)
        }
    }

    setControlPointWeight(controlPointIndex: number, w: number) {
        /*
            const p = this._spline.controlPoints[controlPointIndex]
            this._spline.setControlPointPosition(controlPointIndex, new Vector3d(p.x, p.y, w))

            this.notifyObservers()
            if (this.activeOptimizer) {
                this.optimize(controlPointIndex, p.x, p.y, w)
            }
            */
    }

    increaseControlPointWeight(controlPointIndex: number) {
        if (this._spline instanceof RationalBSplineR1toR2) {
            const delta = 1.1
            const w = this._spline.getControlPointWeight(controlPointIndex)
            const newW = w * delta
            this._spline.setControlPointWeight(controlPointIndex, newW)
            this.notifyObservers()
            
            if (this.activeOptimizer) {
                this.optimizeWeight(controlPointIndex, newW)
            }
            
        }
    }

    decreaseControlPointWeight(controlPointIndex: number) {
        if (this._spline instanceof RationalBSplineR1toR2) {
            const delta = 0.9
            const w = this._spline.getControlPointWeight(controlPointIndex)
            const newW = w * delta
            this._spline.setControlPointWeight(controlPointIndex, newW)
            this.notifyObservers()
            
            if (this.activeOptimizer) {
                this.optimizeWeight(controlPointIndex, newW)
            }
            
        }
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        if (this.optimizationProblem && this.optimizer) {
            //const p = this._spline.freeControlPoints[selectedControlPoint].clone()
            const p = this.optimizationProblem.spline.freeControlPoints[selectedControlPoint].clone()
            const distance = Math.sqrt(Math.pow(ndcX - p.x, 2) + Math.pow(ndcY - p.y, 2))
            //console.log(ndcX - p.x)
            //const numberOfStep = 3 * Math.ceil(distance * 10)
            const numberOfStep = 1
            //const numberOfStep = 1
            for (let i = 1; i <= numberOfStep; i += 1) {
                let alpha = Math.pow(i / numberOfStep, 3)
                //this._spline.setControlPointPosition(selectedControlPoint, new Vector3d((1-alpha)*p.x + alpha * ndcX, (1-alpha)*p.y + alpha * ndcY, (1-alpha)*p.z + alpha * ndcY ))
                this._spline.setControlPointPosition(selectedControlPoint, new Vector3d(ndcX * p.z, ndcY * p.z, p.z ))
                this.optimizationProblem.setTargetSpline(this._spline)
                try {
                    this.optimizer.optimize_using_trust_region(10e-6, 1000, 800)
                    if (this.optimizer.success === true) {
                        this.setSpline(this.optimizationProblem.spline.clone())
                    }
                }
                catch(e) {
                    this._spline.setControlPointPosition(selectedControlPoint, new Vector3d(p.x, p.y, p.z))
                    console.log(e)
                }
            }
        }
    }

    optimizeWeight(selectedControlPoint: number, w: number) {
        if (this.optimizationProblem && this.optimizer) {
            //const p = this._spline.freeControlPoints[selectedControlPoint].clone()
            const p = this.optimizationProblem.spline.freeControlPoints[selectedControlPoint].clone()
            //const distance = Math.sqrt(Math.pow(ndcX - p.x, 2) + Math.pow(ndcY - p.y, 2))
            //console.log(ndcX - p.x)
            //const numberOfStep = 3 * Math.ceil(distance * 10)
            const numberOfStep = 1
            //const numberOfStep = 1
            for (let i = 1; i <= numberOfStep; i += 1) {
                let alpha = Math.pow(i / numberOfStep, 3)
                //this._spline.setControlPointPosition(selectedControlPoint, new Vector3d((1-alpha)*p.x + alpha * ndcX, (1-alpha)*p.y + alpha * ndcY, (1-alpha)*p.z + alpha * ndcY ))
                this._spline.setControlPointPosition(selectedControlPoint, new Vector3d(p.x * w / p.z, p.y * w / p.z, w ))
                this.optimizationProblem.setTargetSpline(this._spline)
                try {
                    this.optimizer.optimize_using_trust_region(10e-6, 1000, 800)
                    if (this.optimizer.success === true) {
                        this.setSpline(this.optimizationProblem.spline.clone())
                    }
                }
                catch(e) {
                    this._spline.setControlPointPosition(selectedControlPoint, new Vector3d(p.x, p.y, p.z))
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