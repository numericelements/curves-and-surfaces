import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { IMultiObservable, IObserver } from "../newDesignPatterns/Observer";
import { KindOfObservers } from "../newModels/CurveModelInterface";
import { CurveDifferentialEventsLocations } from "./CurveDifferentialEventsLocations";

export interface CurveDifferentialEventsLocationInterface 
    extends IMultiObservable<CurveDifferentialEventsLocations, KindOfObservers>{

    crvDiffEventsLocations: CurveDifferentialEventsLocations;

    observers: IObserver<CurveDifferentialEventsLocations>[];

    observersCP: IObserver<CurveDifferentialEventsLocations>[];

    notifyObservers(): void;

    registerObserver(observer: IObserver<CurveDifferentialEventsLocations>, kind: KindOfObservers): void;

    removeObserver(observer: IObserver<CurveDifferentialEventsLocations>, kind: KindOfObservers): void;

    update(curveToAnalyze: BSplineR1toR2Interface): void;

}