import { PeriodicBSplineR1toR2, create_PeriodicBSplineR1toR2 } from "../bsplines/PeriodicBSplineR1toR2"
import { IObserver, IObservable } from "../designPatterns/Observer"
import { BSplineR1toR2Interface } from "../bsplines/BSplineR1toR2Interface"
import { Vector2d } from "../mathVector/Vector2d"
import { CurveModelInterface } from "./CurveModelInterface"
import { OptimizationProblemPeriodicBSplineR1toR2, ActiveControl } from "../bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2"
import { Optimizer } from "../optimizers/Optimizer"



export class ClosedCurveModel implements CurveModelInterface,  IObservable<BSplineR1toR2Interface> {

    public _spline: PeriodicBSplineR1toR2
    private observers: IObserver<BSplineR1toR2Interface>[] = []
    private optimizer: Optimizer
    private optimizationProblem: OptimizationProblemPeriodicBSplineR1toR2
    private activeOptimizer: boolean = true
    private activeControl: ActiveControl = ActiveControl.both

    constructor() {

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


        this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)

       
    }

    get isClosed(): boolean {
        return true
    }

    get spline(): PeriodicBSplineR1toR2 {
        return this._spline
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

    
    setControlPointPosition(controlPointIndex: number, x: number, y: number) {
        this._spline.setControlPoint(controlPointIndex, new Vector2d(x, y))
        this.notifyObservers()
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y)
        }
    }




    setSpline(spline: PeriodicBSplineR1toR2) {
        this._spline = spline
        this.notifyObservers()
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
        this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }

    setActiveControl() {
        this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }

    toggleActiveControlOfCurvatureExtrema() {
        //console.log("bla")
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
        //console.log("blo")
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