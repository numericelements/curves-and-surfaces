import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { NeighboringEvents, NeighboringEventsType } from "../sequenceOfDifferentialEvents/NeighboringEvents";

export class EventsAtCurveExtremities {
    private _start: boolean;
    private _end: boolean;

    constructor() {
        this._start = false;
        this._end = false;
    }

    get start(): boolean {
        return this._start;
    }

    get end(): boolean {
        return this._end;
    }

    set start(start: boolean) {
        this._start = start;
    }

    set end(end: boolean) {
        this._end = end;
    }
}

export abstract class AbstractBoundaryEnforcer {

    protected status: boolean;
    protected _neighboringEvents: Array<NeighboringEvents>;
    protected abstract _curvExtremumEventAtExtremity: EventsAtCurveExtremities;
    protected abstract _inflectionEventAtExtremity: EventsAtCurveExtremities;

    constructor() {
        this.status = false;
        this._neighboringEvents = [];
    }

    get neighboringEvents(): Array<NeighboringEvents> {
        return this._neighboringEvents;
    }

    abstract get curvExtremumEventAtExtremity(): EventsAtCurveExtremities;

    abstract get inflectionEventAtExtremity(): EventsAtCurveExtremities;

    abstract isActive(): boolean;

    abstract deactivate(): void;

    abstract reset(): void;

    abstract addTransitionOfEvents(neighborinhEvents: Array<NeighboringEvents>): void;

    abstract hasNewEvent(): boolean;

}

export class BoundaryEnforcerNoShapeSpaceOpenCurve extends AbstractBoundaryEnforcer {

    protected _curvExtremumEventAtExtremity: EventsAtCurveExtremities;
    protected _inflectionEventAtExtremity: EventsAtCurveExtremities;

    constructor() {
        super();
        this._curvExtremumEventAtExtremity = new EventsAtCurveExtremities();
        this._inflectionEventAtExtremity = new EventsAtCurveExtremities();
    }

    get curvExtremumEventAtExtremity(): EventsAtCurveExtremities {
        return this._curvExtremumEventAtExtremity;
    }

    get inflectionEventAtExtremity(): EventsAtCurveExtremities {
        return this._inflectionEventAtExtremity;
    }

    isActive(): boolean {
        return false;
    }

    deactivate(): void {
        return;
    }

    reset(): void {
        return;
    }

    addTransitionOfEvents(neighborinhEvents: Array<NeighboringEvents>): void {
        return;
    }

    hasNewEvent(): boolean {
        return false;
    }

}

export class BoundaryEnforcerNestedShapeSpacesOpenCurve extends BoundaryEnforcerNoShapeSpaceOpenCurve {


    activate(): void {
        this.status = true;
    }

    deactivate(): void {
        this.status = false;
    }

    isActive(): boolean {
        if(this.status) {
            return true;
        } else {
            return false;
        }
    }

    isTransitionAtExtremity(): boolean {
        let isTransition = false;
        if(this.isCurvatureExtTransitionAtExtremity() || this.isInflectionTransitionAtExtremity()
            || this.isMixedTransitionAtExtremity()) isTransition = true;
        return isTransition;
    }

    isCurvatureExtTransitionAtExtremity(): boolean {
        let isTransition = false;
        if((this._curvExtremumEventAtExtremity.start || this._curvExtremumEventAtExtremity.end)
            && !(this._inflectionEventAtExtremity.start || this._inflectionEventAtExtremity.end)) isTransition = true;
        return isTransition;
    }

    isInflectionTransitionAtExtremity(): boolean {
        let isTransition = false;
        if(!(this._curvExtremumEventAtExtremity.start || this._curvExtremumEventAtExtremity.end)
            && (this._inflectionEventAtExtremity.start || this._inflectionEventAtExtremity.end)) isTransition = true;
        return isTransition;
    }

    isMixedTransitionAtExtremity(): boolean {
        let isTransition = false;
        if(this._curvExtremumEventAtExtremity.start && this._inflectionEventAtExtremity.end
            && !this._curvExtremumEventAtExtremity.end && !this._inflectionEventAtExtremity.start) isTransition = true;
        if(this._curvExtremumEventAtExtremity.end && this._inflectionEventAtExtremity.start
            && !this._curvExtremumEventAtExtremity.start && !this._inflectionEventAtExtremity.end) isTransition = true;
        return isTransition;
    }

    addTransitionOfEvents(neighborinhEvents: Array<NeighboringEvents>): void {
        this._neighboringEvents = neighborinhEvents.slice();
    }

    hasTransitionsOfEvents(): boolean {
        if(this._neighboringEvents.length > 0) {
            let validList = true;
            for(const neighboringEvent of this._neighboringEvents) {
                if(neighboringEvent.type === NeighboringEventsType.none) validList = false;
            }
            if(validList) {
                return true;
            } else {
                const error = new ErrorLog(this.constructor.name, "hasTransitionsOfEvents", "The list of current differential events is inconsistent");
                error.logMessageToConsole();
                return false;
            }
        } else {
            return false;
        }
    }

    resetNeighboringEvents(): void {
        this._neighboringEvents = [];
    }

    resetEventsAtExtremities(): void {
        this._curvExtremumEventAtExtremity = new EventsAtCurveExtremities();
        this._inflectionEventAtExtremity = new EventsAtCurveExtremities();
    }

    reset(): void {
        this.resetNeighboringEvents();
        this.resetEventsAtExtremities();
        this.status = false;
    }
}

export class BoundaryEnforcerStrictShapeSpacesOpenCurve extends BoundaryEnforcerNestedShapeSpacesOpenCurve {

    private _curvatureDerivativeCPOpt: number[];
    private _newEvent: boolean;

    constructor() {
        super();
        this._curvatureDerivativeCPOpt = [];
        this._newEvent = false;
    }

    get curvatureDerivativeCPOpt(): number[] {
        return this._curvatureDerivativeCPOpt
    }

    set curvatureDerivativeCPOpt(curvatureDerivativeCPOpt: number[]) {
        this._curvatureDerivativeCPOpt = curvatureDerivativeCPOpt.slice();
    }

    newEventExist(): void {
        this._newEvent = true;
    }   

    removeNewEvent(): void {
        this._newEvent = false;
    }
    
    hasNewEvent(): boolean {
        if(this._newEvent) {
            return true;
        } else {
            return false;
        }
    }

}

export class BoundaryEnforcerNoShapeSpaceClosedCurve extends AbstractBoundaryEnforcer {

    protected _curvExtremumEventAtExtremity: EventsAtCurveExtremities;
    protected _inflectionEventAtExtremity: EventsAtCurveExtremities;

    constructor() {
        super();
        this._curvExtremumEventAtExtremity = new EventsAtCurveExtremities();
        this._inflectionEventAtExtremity = new EventsAtCurveExtremities();
    }

    get curvExtremumEventAtExtremity(): EventsAtCurveExtremities {
        return this._curvExtremumEventAtExtremity;
    }

    get inflectionEventAtExtremity(): EventsAtCurveExtremities {
        return this._inflectionEventAtExtremity;
    }

    isActive(): boolean {
        return false;
    }

    deactivate(): void {
        return;
    }

    reset(): void {
        return;
    }

    addTransitionOfEvents(neighborinhEvents: Array<NeighboringEvents>): void {
        return;
    }

    hasNewEvent(): boolean {
        return false;
    }
}

export class BoundaryEnforcerStrictShapeSpacesClosedCurve extends BoundaryEnforcerNoShapeSpaceClosedCurve {

    private _curvatureDerivativeCPOpt: number[];
    private _newEvent: boolean;

    constructor() {
        super();
        this._curvatureDerivativeCPOpt = [];
        this._newEvent = false;
    }

    activate(): void {
        this.status = true;
    }

    deactivate(): void {
        this.status = false;
    }

    isActive(): boolean {
        if(this.status) {
            return true;
        } else {
            return false;
        }
    }

    addTransitionOfEvents(neighborinhEvents: Array<NeighboringEvents>): void {
        this._neighboringEvents = neighborinhEvents.slice();
    }

    hasTransitionsOfEvents(): boolean {
        if(this._neighboringEvents.length > 0) {
            let validList = true;
            for(const neighboringEvent of this._neighboringEvents) {
                if(neighboringEvent.type === NeighboringEventsType.none) validList = false;
            }
            if(validList) {
                return true;
            } else {
                const error = new ErrorLog(this.constructor.name, "hasTransitionsOfEvents", "The list of current differential events is inconsistent");
                error.logMessageToConsole();
                return false;
            }
        } else {
            return false;
        }
    }

    resetNeighboringEvents(): void {
        this._neighboringEvents = [];
    }

    resetEventsAtExtremities(): void {
        this._curvExtremumEventAtExtremity = new EventsAtCurveExtremities();
        this._inflectionEventAtExtremity = new EventsAtCurveExtremities();
    }

    reset(): void {
        this.resetNeighboringEvents();
        this.resetEventsAtExtremities();
        this.status = false;
    }

    newEventExist(): void {
        this._newEvent = true;
    }   

    removeNewEvent(): void {
        this._newEvent = false;
    }
    
    hasNewEvent(): boolean {
        if(this._newEvent) {
            return true;
        } else {
            return false;
        }
    }

}