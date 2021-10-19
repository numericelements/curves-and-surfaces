import { EventMgmtAtCurveExtremities } from "./EventMgmtAtCurveExtremities";

export abstract class EventStateAtCurveExtremity {

    protected eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities;

    constructor(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
        this.eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
    }

    setContext(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities): void {
        this.eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
    }

    abstract handleEventAtCurveExtremity(): void;

}

export class EventStayInsideCurve extends EventStateAtCurveExtremity {


    handleEventAtCurveExtremity(): void {
        this.eventMgmtAtCurveExtremities.transitionToState(new EventSlideOutsideCurve(this.eventMgmtAtCurveExtremities));
    }
}

export class EventSlideOutsideCurve extends EventStateAtCurveExtremity {

    handleEventAtCurveExtremity(): void {
        this.eventMgmtAtCurveExtremities.transitionToState(new EventStayInsideCurve(this.eventMgmtAtCurveExtremities));
    }
}