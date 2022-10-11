import { WarningLog } from "../errorProcessing/ErrorLoging";
import { EventMgmtAtCurveExtremities } from "./EventMgmtAtCurveExtremities";
import { ShapeNavigableCurve } from "./ShapeNavigableCurve";

export abstract class EventStateAtCurveExtremity {

    protected eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities;
    protected shapeNavigableCurve: ShapeNavigableCurve;

    constructor(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
        this.eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
        this.shapeNavigableCurve = eventMgmtAtCurveExtremities.shapeNavigableCurve;
    }

    setContext(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities): void {
        this.eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
    }

    abstract handleEventAtCurveExtremity(): void;

}

export class EventStayInsideCurve extends EventStateAtCurveExtremity {

    constructor(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
        super(eventMgmtAtCurveExtremities);
        this.eventMgmtAtCurveExtremities.eventState = this;
    }

    handleEventAtCurveExtremity(): void {
        const message = new WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }
}

export class EventSlideOutsideCurve extends EventStateAtCurveExtremity {

    constructor(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
        super(eventMgmtAtCurveExtremities);
        this.eventMgmtAtCurveExtremities.eventState = this;
    }

    handleEventAtCurveExtremity(): void {
        const message = new WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }
}

export class NoEventToManageForClosedCurve extends EventStateAtCurveExtremity {

    constructor(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
        super(eventMgmtAtCurveExtremities);
        this.eventMgmtAtCurveExtremities.eventState = this;
    }

    handleEventAtCurveExtremity(): void {
        const message = new WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", "nothing to do there");
        message.logMessageToConsole();
    }
}