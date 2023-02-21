import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { EventStayInsideCurve, EventStateAtCurveExtremity, EventSlideOutsideCurve } from "./EventStateAtCurveExtremity";
import { ShapeNavigableCurve } from "./ShapeNavigableCurve";


export class EventMgmtAtCurveExtremities {

    private readonly _shapeNavigableCurve: ShapeNavigableCurve;
    private _eventState: EventStateAtCurveExtremity;
    private readonly _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private _shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure | undefined;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {

        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._shapeSpaceDiffEventsStructure = this._curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        this._shapeNavigableCurve = this._curveShapeSpaceNavigator.shapeNavigableCurve;
        this._eventState = new EventSlideOutsideCurve(this);
    }

    get shapeNavigableCurve(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }

    get eventState(): EventStateAtCurveExtremity {
        return this._eventState;
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator {
        return this._curveShapeSpaceNavigator;
    }

    get shapeSpaceDiffEventsStructure(): ShapeSpaceDiffEventsStructure | undefined {
        return this._shapeSpaceDiffEventsStructure;
    }

    set eventState(eventState: EventStateAtCurveExtremity) {
        this._eventState = eventState;
    }

    set shapeSpaceDiffEventsStructure(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure | undefined) {
        this._shapeSpaceDiffEventsStructure = shapeSpaceDiffEventsStructure;
    }

    processEventAtCurveExtremity(): void {
        this._eventState.handleEventAtCurveExtremity();
    }

}