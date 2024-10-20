import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { EventMgmtState, ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { EventStateAtCurveExtremity, NoEventToManageForCurve } from "./EventStateAtCurveExtremity";
import { ShapeNavigableCurve } from "./ShapeNavigableCurve";

export class EventMgmtAtCurveExtremities {

    private readonly _shapeNavigableCurve: ShapeNavigableCurve;
    private _eventStateAtCrvExtremities: EventStateAtCurveExtremity;
    private _previousManagementOfEventsAtExtremities: EventMgmtState;
    private readonly _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private readonly _shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;
    private _locationsCurvExtrema: number[];
    private _locationsInflections: number[];
    private _eventOutOfInterval: boolean;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {

        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._shapeSpaceDiffEventsStructure = this._curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        this._shapeNavigableCurve = this._curveShapeSpaceNavigator.shapeNavigableCurve;
        this._eventStateAtCrvExtremities = new NoEventToManageForCurve(this);
        this._previousManagementOfEventsAtExtremities = EventMgmtState.NotApplicable;
        this._shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities = EventMgmtState.NotApplicable;
        if(this._shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent curve type. Should be an open curve.");
            error.logMessage();
        }
        this._eventOutOfInterval = false;
        this._locationsCurvExtrema = [];
        this._locationsInflections = [];
    }

    get shapeNavigableCurve(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }

    get eventStateAtCrvExtremities(): EventStateAtCurveExtremity {
        return this._eventStateAtCrvExtremities;
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator {
        return this._curveShapeSpaceNavigator;
    }

    get shapeSpaceDiffEventsStructure(): ShapeSpaceDiffEventsStructure | undefined {
        return this._shapeSpaceDiffEventsStructure;
    }

    get previousManagementOfEventsAtExtremities(): EventMgmtState {
        return this._previousManagementOfEventsAtExtremities
    }

    get eventOutOfInterval() {
        return this._eventOutOfInterval;
    }

    get locationsCurvExtrema() {
        return this._locationsCurvExtrema;
    }

    get locationsInflections() {
        return this._locationsInflections;
    }

    set eventStateAtCrvExtremities(eventState: EventStateAtCurveExtremity) {
        this._eventStateAtCrvExtremities = eventState;
    }

    set previousManagementOfEventsAtExtremities(state: EventMgmtState) {
        this._previousManagementOfEventsAtExtremities = state;
    }

    set eventOutOfInterval(eventOutOfInterval: boolean) {
        this._eventOutOfInterval = eventOutOfInterval;
    }

    changeMngmtOfEventAtExtremity(eventState: EventStateAtCurveExtremity): void {
        this._eventStateAtCrvExtremities = eventState;
        this._curveShapeSpaceNavigator.eventStateAtCrvExtremities = eventState;
    }

    processEventAtCurveExtremity(): void {
        this._eventStateAtCrvExtremities.handleEventAtCurveExtremity();
    }

    clearEvents(): void {
        this._eventOutOfInterval = false;
        this._locationsCurvExtrema = [];
        this._locationsInflections = [];
    }
}