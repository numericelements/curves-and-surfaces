import { EventStayInsideCurve, EventStateAtCurveExtremity, EventSlideOutsideCurve } from "./EventStateAtCurveExtremity";
import { ShapeNavigableCurve } from "./ShapeNavigableCurve";


export class EventMgmtAtCurveExtremities {

    private _shapeNavigableCurve: ShapeNavigableCurve;
    private _eventState: EventStateAtCurveExtremity;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        this._shapeNavigableCurve = shapeNavigableCurve;
        this._eventState = new EventSlideOutsideCurve(this);
    }

    get shapeNavigableCurve(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }

    get eventState(): EventStateAtCurveExtremity {
        return this._eventState;
    }

    set eventState(eventState: EventStateAtCurveExtremity) {
        this._eventState = eventState;
    }

    processEventAtCurveExtremity(): void {
        this._eventState.handleEventAtCurveExtremity();
    }

}