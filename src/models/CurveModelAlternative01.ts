import { BSplineR1toR2 } from "../bsplines/BSplineR1toR2"
import { Vector2d } from "../mathVector/Vector2d"
import { OptimizationProblemBSplineR1toR2} from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2"
import { OptimizationProblemBSplineR1toR2WithWeigthingFactors } from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2WithWeigthingFactors"
import { Optimizer } from "../optimizers/Optimizer"
import { ActiveControl } from "../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2"
import { AbstractCurveModel } from "./AbstractCurveModel"

export class CurveModelAlternative01 extends AbstractCurveModel {

    private _splineTarget: BSplineR1toR2
    protected _spline: BSplineR1toR2

    protected optimizationProblem: OptimizationProblemBSplineR1toR2


    constructor() {
        super()
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.1, 0.5)
        const cp2 = new Vector2d(0.1, 0.5)
        const cp3 = new Vector2d(0.5, 0)

        this._splineTarget = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])
        this._spline = this._splineTarget.clone()

        //this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        this.optimizationProblem = new  OptimizationProblemBSplineR1toR2WithWeigthingFactors(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        

        this.optimizer = new Optimizer(this.optimizationProblem)

    }

    get spline(): BSplineR1toR2 {
        return this._spline.clone()
    }

    get isClosed(): boolean {
        return false
    }


    notifyObservers() {
        for (let observer of this.observers){
            observer.update(this._spline.clone())
        }
        for (let observer of this.observersCP){
            observer.update(this._splineTarget.clone())
        }
    }

    moveControlPoint(controlPointIndex: number, deltaX: number, deltaY: number) {
        this._splineTarget.moveControlPoint(controlPointIndex, deltaX, deltaY)
        if (deltaX*deltaX + deltaY*deltaY > 0) {
            this.notifyObservers()
        }
    }


    setControlPointPosition(controlPointIndex: number, x: number, y: number) {
        this._splineTarget.setControlPointPosition(controlPointIndex, new Vector2d(x, y))
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y)
        }
        else {
            this._spline = this._splineTarget.clone()
        }
        this.notifyObservers()
    }

    
    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
        if (this.optimizationProblem && this.optimizer) {
            const p = this._splineTarget.freeControlPoints[selectedControlPoint].clone()
            this._splineTarget.setControlPointPosition(selectedControlPoint, new Vector2d(ndcX, ndcY))
            this.optimizationProblem.setTargetSpline(this._splineTarget)
            try {
                this.optimizer.optimize_using_trust_region(10e-6, 1000, 800)
                if (this.optimizer.success === true) {
                    this.setSpline(this.optimizationProblem.spline.clone())
                }
            }
            catch(e) {
                this._splineTarget.setControlPointPosition(selectedControlPoint, new Vector2d(p.x, p.y))
                console.log(e)
            }
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
            if (cp === this._splineTarget.controlPoints.length -1) { cp -= 1} 
            const grevilleAbscissae = this._splineTarget.grevilleAbscissae()
            this._splineTarget.insertKnot(grevilleAbscissae[cp])
            this._spline.insertKnot(grevilleAbscissae[cp])
        }
        this.optimizationProblem = new  OptimizationProblemBSplineR1toR2WithWeigthingFactors(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()

    }

    setActiveControl() {
        this.optimizationProblem = new  OptimizationProblemBSplineR1toR2WithWeigthingFactors(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
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