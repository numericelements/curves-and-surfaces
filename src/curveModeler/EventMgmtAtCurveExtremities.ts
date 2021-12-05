import { EventStayInsideCurve, EventStateAtCurveExtremity } from "./EventStateAtCurveExtremity";


export class EventMgmtAtCurveExtremities {

    private _eventState: EventStateAtCurveExtremity;

    constructor() {
        this._eventState = new EventStayInsideCurve(this);
    }

    get eventState(): EventStateAtCurveExtremity {
        return this._eventState;
    }

    set eventState(eventState: EventStateAtCurveExtremity) {
        this._eventState = eventState;
    }

    transitionToState(eventState: EventStateAtCurveExtremity): void {
        this._eventState = eventState;

    }

    processEventAtCurveExtremity(): void {
        this._eventState.handleEventAtCurveExtremity();
    }

}