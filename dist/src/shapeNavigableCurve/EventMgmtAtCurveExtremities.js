"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventMgmtAtCurveExtremities = void 0;
const ShapeSpaceDiffEventsStructure_1 = require("../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
const EventStateAtCurveExtremity_1 = require("./EventStateAtCurveExtremity");
class EventMgmtAtCurveExtremities {
    constructor(curveShapeSpaceNavigator) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._shapeSpaceDiffEventsStructure = this._curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        this._shapeNavigableCurve = this._curveShapeSpaceNavigator.shapeNavigableCurve;
        this._eventStateAtCrvExtremities = new EventStateAtCurveExtremity_1.NoEventToManageForCurve(this);
        this._previousManagementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.NotApplicable;
        this._shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.NotApplicable;
        if (this._shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent curve type. Should be an open curve.");
            error.logMessage();
        }
        this._eventOutOfInterval = false;
        this._locationsCurvExtrema = [];
        this._locationsInflections = [];
    }
    get shapeNavigableCurve() {
        return this._shapeNavigableCurve;
    }
    get eventStateAtCrvExtremities() {
        return this._eventStateAtCrvExtremities;
    }
    get curveShapeSpaceNavigator() {
        return this._curveShapeSpaceNavigator;
    }
    get shapeSpaceDiffEventsStructure() {
        return this._shapeSpaceDiffEventsStructure;
    }
    get previousManagementOfEventsAtExtremities() {
        return this._previousManagementOfEventsAtExtremities;
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
    set eventStateAtCrvExtremities(eventState) {
        this._eventStateAtCrvExtremities = eventState;
    }
    set previousManagementOfEventsAtExtremities(state) {
        this._previousManagementOfEventsAtExtremities = state;
    }
    set eventOutOfInterval(eventOutOfInterval) {
        this._eventOutOfInterval = eventOutOfInterval;
    }
    changeMngmtOfEventAtExtremity(eventState) {
        this._eventStateAtCrvExtremities = eventState;
        this._curveShapeSpaceNavigator.eventStateAtCrvExtremities = eventState;
    }
    processEventAtCurveExtremity() {
        this._eventStateAtCrvExtremities.handleEventAtCurveExtremity();
    }
    clearEvents() {
        this._eventOutOfInterval = false;
        this._locationsCurvExtrema = [];
        this._locationsInflections = [];
    }
}
exports.EventMgmtAtCurveExtremities = EventMgmtAtCurveExtremities;
