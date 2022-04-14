import { BSplineR1toR3 } from "../bsplines/R1toR3/BSplineR1toR3";
import { OpBSplineR1toR3 } from "../optimizationProblems/OpBSplineR1toR3";
import { IObservable, IObserver } from "../designPatterns/Observer";
import { Vector3d } from "../mathVector/Vector3d";
import { Optimizer } from "../optimizers/Optimizer";


export enum ActiveControl {curvatureExtrema, torsionZeros, both}

export class CurveModel3d implements IObservable<BSplineR1toR3> {


    public _spline: BSplineR1toR3
    protected activeOptimizer: boolean = true
    protected activeControl: ActiveControl = ActiveControl.both
    protected optimizationProblem: OpBSplineR1toR3
    protected optimizer: Optimizer | null = null

    
    private observers: IObserver<BSplineR1toR3>[] = []

    constructor() {
        const cp0 = new Vector3d(-0.25, 0, -0.15)
        const cp1 = new Vector3d(-0.15, 0.15, -0.05)
        const cp2 = new Vector3d(0, 0.25, -0.05)
        const cp3 = new Vector3d(0.15, 0.15, -0.05)
        const cp4 = new Vector3d(0.25, 0, 0.05)
        this._spline = new BSplineR1toR3([ cp0, cp1, cp2, cp3, cp4 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1 ])

        this.optimizationProblem = new  OpBSplineR1toR3(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
    }
    registerObserver(observer: IObserver<BSplineR1toR3>): void {
        this.observers.push(observer)
    }
    
    removeObserver(observer: IObserver<BSplineR1toR3>): void {
        this.observers.splice(this.observers.indexOf(observer), 1)
    }

    notifyObservers(): void {
        for (let observer of this.observers){
            observer.update(this._spline.clone())
        }
    }

    get spline(): BSplineR1toR3 {
        return this._spline.clone()
    }

    get isClosed(): boolean {
        return false
    }

    setControlPointPosition(controlPointIndex: number, x: number, y: number, z: number) {
        this._spline = this._spline.setControlPointPosition(controlPointIndex, new Vector3d(x, y, z)) as BSplineR1toR3
        this.notifyObservers()
        
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y, z)
        }
    }

    optimize(selectedControlPoint: number, x: number, y: number, z: number) {
        if (this.optimizationProblem && this.optimizer) {
            const p = this.optimizationProblem.spline.freeControlPoints[selectedControlPoint].clone()
            this._spline.setControlPointPosition(selectedControlPoint, new Vector3d(x, y, z))
            this.optimizationProblem.setTargetSpline(this._spline)
            try {
                this.optimizer.optimize_using_trust_region(10e-6, 1000, 800)
                if (this.optimizer.success === true) {
                    this.setSpline(this.optimizationProblem.spline.clone())
                }
            }
            catch(e) {
                this._spline = this._spline.setControlPointPosition(selectedControlPoint, new Vector3d(p.x, p.y, p.z)) as BSplineR1toR3
                console.log(e)
            }
            
        }
    }

    setSpline(spline: BSplineR1toR3) {
        this._spline = spline
        this.notifyObservers()
    }


        
    toggleActiveControlOfCurvatureExtrema() {
        
        if (!this.activeOptimizer) {
            this.activeOptimizer = true
            this.activeControl = ActiveControl.curvatureExtrema
        }
        else if (this.activeControl == ActiveControl.both){
            this.activeControl = ActiveControl.torsionZeros
        }
        else if (this.activeControl == ActiveControl.torsionZeros){
            this.activeControl = ActiveControl.both
        }
        else if (this.activeControl == ActiveControl.curvatureExtrema){
            this.activeOptimizer = false
        }

        if (this.activeOptimizer){
            this.setActiveControl()
        }
    }

    toggleActiveControlOfTorsionZeros() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true
            this.activeControl = ActiveControl.torsionZeros
        }
        else if (this.activeControl == ActiveControl.both){
            this.activeControl = ActiveControl.curvatureExtrema
        }
        else if (this.activeControl == ActiveControl.curvatureExtrema){
            this.activeControl = ActiveControl.both
        }
        else if (this.activeControl == ActiveControl.torsionZeros){
            this.activeOptimizer = false
        }

        if (this.activeOptimizer){
            this.setActiveControl()
        }
    }

    setActiveControl() {
        this.optimizationProblem = new  OpBSplineR1toR3(this._spline.clone(), this._spline.clone(), this.activeControl)
        this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers()
    }
    

    

}