import { EventSlideOutsideCurve, EventStateAtCurveExtremity } from "./EventStateAtCurveExtremity";


export class EventMgmtAtCurveExtremities {

    public eventState: EventStateAtCurveExtremity;

    constructor() {
        this.eventState = new EventSlideOutsideCurve(this);

    }

    transitionToState(eventState: EventStateAtCurveExtremity): void {
        this.eventState = eventState;

    }

    processEventAtCurveExtremity(): void {
        this.eventState.handleEventAtCurveExtremity();
    }

}