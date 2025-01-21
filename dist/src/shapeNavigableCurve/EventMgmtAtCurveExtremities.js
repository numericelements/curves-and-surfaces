"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventMgmtAtCurveExtremities = void 0;
var ShapeSpaceDiffEventsStructure_1 = require("../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
var EventStateAtCurveExtremity_1 = require("./EventStateAtCurveExtremity");
var EventMgmtAtCurveExtremities = /** @class */ (function () {
    function EventMgmtAtCurveExtremities(curveShapeSpaceNavigator) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._shapeSpaceDiffEventsStructure = this._curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        this._shapeNavigableCurve = this._curveShapeSpaceNavigator.shapeNavigableCurve;
        this._eventStateAtCrvExtremities = new EventStateAtCurveExtremity_1.NoEventToManageForCurve(this);
        this._previousManagementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.NotApplicable;
        this._shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.NotApplicable;
        if (this._shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent curve type. Should be an open curve.");
            error.logMessage();
        }
        this._eventOutOfInterval = false;
        this._locationsCurvExtrema = [];
        this._locationsInflections = [];
    }
    Object.defineProperty(EventMgmtAtCurveExtremities.prototype, "shapeNavigableCurve", {
        get: function () {
            return this._shapeNavigableCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EventMgmtAtCurveExtremities.prototype, "eventStateAtCrvExtremities", {
        get: function () {
            return this._eventStateAtCrvExtremities;
        },
        set: function (eventState) {
            this._eventStateAtCrvExtremities = eventState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EventMgmtAtCurveExtremities.prototype, "curveShapeSpaceNavigator", {
        get: function () {
            return this._curveShapeSpaceNavigator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EventMgmtAtCurveExtremities.prototype, "shapeSpaceDiffEventsStructure", {
        get: function () {
            return this._shapeSpaceDiffEventsStructure;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EventMgmtAtCurveExtremities.prototype, "previousManagementOfEventsAtExtremities", {
        get: function () {
            return this._previousManagementOfEventsAtExtremities;
        },
        set: function (state) {
            this._previousManagementOfEventsAtExtremities = state;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EventMgmtAtCurveExtremities.prototype, "eventOutOfInterval", {
        get: function () {
            return this._eventOutOfInterval;
        },
        set: function (eventOutOfInterval) {
            this._eventOutOfInterval = eventOutOfInterval;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EventMgmtAtCurveExtremities.prototype, "locationsCurvExtrema", {
        get: function () {
            return this._locationsCurvExtrema;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EventMgmtAtCurveExtremities.prototype, "locationsInflections", {
        get: function () {
            return this._locationsInflections;
        },
        enumerable: false,
        configurable: true
    });
    EventMgmtAtCurveExtremities.prototype.changeMngmtOfEventAtExtremity = function (eventState) {
        this._eventStateAtCrvExtremities = eventState;
        this._curveShapeSpaceNavigator.eventStateAtCrvExtremities = eventState;
    };
    EventMgmtAtCurveExtremities.prototype.processEventAtCurveExtremity = function () {
        this._eventStateAtCrvExtremities.handleEventAtCurveExtremity();
    };
    EventMgmtAtCurveExtremities.prototype.clearEvents = function () {
        this._eventOutOfInterval = false;
        this._locationsCurvExtrema = [];
        this._locationsInflections = [];
    };
    return EventMgmtAtCurveExtremities;
}());
exports.EventMgmtAtCurveExtremities = EventMgmtAtCurveExtremities;
