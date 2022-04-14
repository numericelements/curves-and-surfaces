import { IBSplineR1toR2 } from "../bsplines/R1toR2/IBSplineR1toR2";
import { IObservable } from "../designPatterns/Observer";

export interface ICurve2dModel extends IObservable<IBSplineR1toR2> {

    spline : IBSplineR1toR2

    isClosed : boolean

    setControlPointPosition(controlPointIndex: number, x: number, y: number) : void

    setSpline(spline: IBSplineR1toR2): void 

    addControlPoint(controlPointIndex: number | null): void

    toggleActiveControlOfCurvatureExtrema() : void

    toggleActiveControlOfInflections() : void

    notifyObservers() : void

    increaseControlPointWeight(controlPointIndex: number): void

    decreaseControlPointWeight(controlPointIndex: number): void

}