import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { EventStayInsideCurve, EventStateAtCurveExtremity, EventSlideOutsideCurve } from "./EventStateAtCurveExtremity";
import { ShapeNavigableCurve } from "./ShapeNavigableCurve";


export class EventMgmtAtCurveExtremities {

    private _shapeNavigableCurve: ShapeNavigableCurve;
    private _eventState: EventStateAtCurveExtremity;
    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined;
    private _shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure | undefined;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {
        this._shapeNavigableCurve = shapeNavigableCurve;
        if(this._shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            this._curveShapeSpaceNavigator = this._shapeNavigableCurve.curveShapeSpaceNavigator;
            this._shapeSpaceDiffEventsStructure = this._curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        } else {
            this._curveShapeSpaceNavigator = undefined;
            this._shapeSpaceDiffEventsStructure = undefined;
        }
        this._eventState = new EventSlideOutsideCurve(this);
    }

    get shapeNavigableCurve(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }

    get eventState(): EventStateAtCurveExtremity {
        return this._eventState;
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator | undefined {
        return this._curveShapeSpaceNavigator;
    }

    get shapeSpaceDiffEventsStructure(): ShapeSpaceDiffEventsStructure | undefined {
        return this._shapeSpaceDiffEventsStructure;
    }

    set eventState(eventState: EventStateAtCurveExtremity) {
        this._eventState = eventState;
    }

    set curveShapeSpaceNavigator(curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }

    set shapeSpaceDiffEventsStructure(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure | undefined) {
        this._shapeSpaceDiffEventsStructure = shapeSpaceDiffEventsStructure;
    }

    processEventAtCurveExtremity(): void {
        this._eventState.handleEventAtCurveExtremity();
    }

}