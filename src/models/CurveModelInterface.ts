import { BSplineR1toR2Interface } from "../bsplines/BSplineR1toR2Interface";
import {  IMultiObservable } from "../designPatterns/Observer";

export type KindOfObservers = 'curve' | 'control points'


export interface CurveModelInterface extends IMultiObservable<BSplineR1toR2Interface, KindOfObservers> {

    spline : BSplineR1toR2Interface

    isClosed : boolean

    setControlPointPosition(controlPointIndex: number, x: number, y: number) : void

    setSpline(spline: BSplineR1toR2Interface): void 

    addControlPoint(controlPointIndex: number | null): void

    toggleActiveControlOfCurvatureExtrema() : void

    toggleActiveControlOfInflections() : void

    notifyObservers() : void

}