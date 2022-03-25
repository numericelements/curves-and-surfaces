import { BSplineR1toR3 } from "../bsplines/BSplineR1toR3";
import { IObservable, IObserver } from "../designPatterns/Observer";
import { Vector3d } from "../mathVector/Vector3d";

export class CurveModel3d implements IObservable<BSplineR1toR3> {


    public _spline: BSplineR1toR3

    
    private observers: IObserver<BSplineR1toR3>[] = []

    constructor() {
        const cp0 = new Vector3d(-0.25, 0, -0.15)
        const cp1 = new Vector3d(-0.15, 0.15, -0.05)
        const cp2 = new Vector3d(0, 0.25, -0.05)
        const cp3 = new Vector3d(0.15, 0.15, -0.05)
        const cp4 = new Vector3d(0.25, 0, 0.05)
        this._spline = new BSplineR1toR3([ cp0, cp1, cp2, cp3, cp4 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1 ])
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
        this._spline.setControlPointPosition(controlPointIndex, new Vector3d(x, y, z))
        this.notifyObservers()
        /*
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y)
        }
        */
    }

}