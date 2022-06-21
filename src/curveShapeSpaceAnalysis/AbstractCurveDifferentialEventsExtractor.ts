import { WarningLog } from "../errorProcessing/ErrorLoging";
import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BSplineR1toR1Interface } from "../newBsplines/BSplineR1toR1Interface";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { IObserver } from "../newDesignPatterns/Observer";
import { KindOfObservers } from "../newModels/CurveModelInterface";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { CurveDifferentialEventsLocations } from "./CurveDifferentialEventsLocations";

export abstract class AbstractCurveDifferentialEventsExtractor implements IObserver<BSplineR1toR2Interface> {

    protected readonly curve: BSplineR1toR2Interface;
    protected _sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    protected _crvDiffEventsLocations: CurveDifferentialEventsLocations;
    protected _observers: IObserver<CurveDifferentialEventsLocations>[] = [];
    protected _observersCP: IObserver<CurveDifferentialEventsLocations>[] = [];

    constructor(curveToAnalyze: BSplineR1toR2Interface) {
        this.curve = curveToAnalyze;
        this._sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents();
        this._crvDiffEventsLocations = new CurveDifferentialEventsLocations();
    }

    get sequenceOfDifferentialEvents() {
        return this._sequenceOfDifferentialEvents;
    }

    get crvDiffEventsLocations() {
        return this._crvDiffEventsLocations;
    }

    get observers() {
        return this._observers;
    }

    get observersCP() {
        return this._observersCP;
    }

    abstract get curvatureNumerator(): BSplineR1toR1;

    abstract get curvatureDerivativeNumerator(): BSplineR1toR1Interface;

    abstract update(curveToAnalyze: BSplineR1toR2Interface): void;

    abstract extractSeqOfDiffEvents(): SequenceOfDifferentialEvents;

    registerObserver(observer: IObserver<CurveDifferentialEventsLocations>, kind: KindOfObservers): void {
        switch(kind) {
            case 'curve':
                this._observers.push(observer);
                let warning = new WarningLog(this.constructor.name, 'registerObserver', 'register as curve' + observer.constructor.name);
                warning.logMessageToConsole();
                break;
            case 'control points':
                this._observersCP.push(observer);
                warning = new WarningLog(this.constructor.name, 'registerObserver', 'register as CP' + observer.constructor.name);
                warning.logMessageToConsole();
                break;
            default:
                throw Error("unknown kind");
        }
        
    }

    removeObserver(observer: IObserver<CurveDifferentialEventsLocations>, kind: KindOfObservers): void {
        switch(kind) {
            case 'curve':
                this._observers.splice(this._observers.indexOf(observer), 1);
                break;
            case 'control points':
                this._observersCP.splice(this._observersCP.indexOf(observer), 1);
                break;
        }
    }

    notifyObservers(): void {
        for (let observer of this._observers){
            const warning = new WarningLog(this.constructor.name, 'notifyObservers', "update as curve: " + observer.constructor.name);
            warning.logMessageToConsole();
            observer.update(this._crvDiffEventsLocations.clone());
        }
        for (let observer of this._observersCP){
            const warning = new WarningLog(this.constructor.name, 'notifyObservers', "update as curve: " + observer.constructor.name);
            warning.logMessageToConsole();
            observer.update(this._crvDiffEventsLocations.clone());
        }
    }
}