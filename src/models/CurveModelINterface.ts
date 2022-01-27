import { BSplineR1toR2Interface } from "../bsplines/BSplineR1toR2Interface";
import { IObservable } from "../designPatterns/Observer";


export interface CurveModelInterface extends IObservable<BSplineR1toR2Interface> {

    spline : BSplineR1toR2Interface

    setControlPointPosition(controlPointIndex: number, x: number, y: number) : void

    isClosed : boolean

    setSpline(spline: BSplineR1toR2Interface): void 

    addControlPoint(controlPointIndex: number | null): void

    toggleActiveControlOfCurvatureExtrema() : void

    toggleActiveControlOfInflections() : void

}