
import { BSplineR1toR3 } from "../newBsplines/BSplineR1toR3";
import { Vector3d } from "../mathVector/Vector3d";



export class CurveModel3d {


    public _spline: BSplineR1toR3

    
    //private camberSurfaceObservers: IObserver<BSplineR2toCylCoord>[] = []

    constructor() {
        const cp0 = new Vector3d(-0.25, 0, -0.15)
        const cp1 = new Vector3d(-0.15, 0.15, -0.05)
        const cp2 = new Vector3d(0, 0.25, -0.05)
        const cp3 = new Vector3d(0.15, 0.15, -0.05)
        const cp4 = new Vector3d(0.25, 0, 0.05)
        this._spline = new BSplineR1toR3([ cp0, cp1, cp2, cp3, cp4 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1 ])
    }

    get spline(): BSplineR1toR3 {
        return this._spline.clone()
    }

    get isClosed(): boolean {
        return false
    }

}