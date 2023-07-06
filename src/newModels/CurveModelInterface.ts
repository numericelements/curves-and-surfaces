import { BSplineR1toR2DifferentialPropertiesInterface } from "../newBsplines/BSplineR1toR2DifferentialPropertiesInterface";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import {  IMultiObservable } from "../newDesignPatterns/Observer";

export type KindOfObservers = 'curve' | 'control points';

export interface CurveModelInterface extends IMultiObservable<BSplineR1toR2Interface, KindOfObservers> {

    spline : BSplineR1toR2Interface;

    isClosed : boolean;

    setControlPointPosition(controlPointIndex: number, x: number, y: number) : void;

    setSpline(spline: BSplineR1toR2Interface): void ;

    addControlPoint(controlPointIndex: number | null): void;

    // toggleActiveControlOfCurvatureExtrema() : void;

    // toggleActiveControlOfInflections() : void;

    notifyObservers(): void;

    checkObservers(): void;

}