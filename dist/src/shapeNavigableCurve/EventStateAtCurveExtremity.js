"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoEventToManageForCurve = exports.EventSlideOutsideCurve = exports.EventStayInsideCurve = exports.EventStateAtCurveExtremity = void 0;
var CurveShapeMonitoringStrategy_1 = require("../controllers/CurveShapeMonitoringStrategy");
var CurveShapeSpaceNavigator_1 = require("../curveShapeSpaceNavigation/CurveShapeSpaceNavigator");
var NavigationState_1 = require("../curveShapeSpaceNavigation/NavigationState");
var ShapeSpaceDiffEventsStructure_1 = require("../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
var NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
var SequenceOfDifferentialEvents_1 = require("../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
var EventStateAtCurveExtremity = /** @class */ (function () {
    function EventStateAtCurveExtremity(eventMgmtAtCurveExtremities) {
        this.eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
        this.shapeNavigableCurve = eventMgmtAtCurveExtremities.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = eventMgmtAtCurveExtremities.curveShapeSpaceNavigator;
        this.shapeSpaceDiffEventStructure = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
    }
    return EventStateAtCurveExtremity;
}());
exports.EventStateAtCurveExtremity = EventStateAtCurveExtremity;
var EventStayInsideCurve = /** @class */ (function (_super) {
    __extends(EventStayInsideCurve, _super);
    function EventStayInsideCurve(eventMgmtAtCurveExtremities) {
        var _this = _super.call(this, eventMgmtAtCurveExtremities) || this;
        _this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities = _this;
        _this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active;
        if (_this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy) {
            _this.curveShapeMonitoringStrategy = _this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Inconsistent curveShapeMonitoringStrategy class");
            error.logMessage();
            _this.curveShapeMonitoringStrategy = _this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy;
        }
        _this.curveShapeMonitoringStrategy.resetCurve(_this.shapeNavigableCurve.curveCategory.curveModel.spline);
        _this.sequenceCurvExtOutside = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents();
        _this.sequenceInflectionOutside = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents();
        return _this;
    }
    EventStayInsideCurve.prototype.handleEventAtCurveExtremity = function () {
        if (this.shapeSpaceDiffEventStructure.slidingDifferentialEvents &&
            (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces
                || this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace)) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtCurveExtremities));
            var message = new ErrorLoging_1.WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        }
        else if (this.shapeSpaceDiffEventStructure.slidingDifferentialEvents && this.shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(this.eventMgmtAtCurveExtremities));
            var message = new ErrorLoging_1.WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        }
        else if (!this.shapeSpaceDiffEventStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "handleEventAtCurveExtremity", "Cannot appply state change of event management at curve extremities: sliding status is inconsistent.");
            error.logMessage();
        }
    };
    EventStayInsideCurve.prototype.monitorEventInsideCurve = function (seqComparator) {
        if (seqComparator.neighboringEvents.length > 0) {
            if (seqComparator.neighboringEvents.length === 1) {
                var processEvent = false;
                var curvExtLocation = [];
                var inflectionLocation = [];
                switch (seqComparator.neighboringEvents[0].type) {
                    case NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear: {
                        console.log("Curvature extremum disappear on the left boundary.");
                        curvExtLocation.push(seqComparator.sequenceDiffEvents1.eventAt(0).location);
                        this.sequenceCurvExtOutside.insertEvents(curvExtLocation, inflectionLocation);
                        processEvent = true;
                        break;
                    }
                    case NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear: {
                        console.log("Curvature extremum disappear on the right boundary.");
                        curvExtLocation.push(seqComparator.sequenceDiffEvents1.eventAt(seqComparator.sequenceDiffEvents1.length() - 1).location);
                        this.sequenceCurvExtOutside.insertEvents(curvExtLocation, inflectionLocation);
                        processEvent = true;
                        break;
                    }
                    case NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtrema: {
                        console.log("Two Curvature extrema disappear between two inflections or an extreme interval or a unique interval.");
                        break;
                    }
                    case NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear: {
                        console.log("Two Curvature extrema appear between two inflections or an extreme interval or a unique interval.");
                        break;
                    }
                    case NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear: {
                        console.log("Two Curvature extrema disappear between two inflections or an extreme interval or a unique interval.");
                        break;
                    }
                    case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear: {
                        console.log("Inflection disappear on the left boundary.");
                        inflectionLocation.push(seqComparator.sequenceDiffEvents1.eventAt(0).location);
                        this.sequenceInflectionOutside.insertEvents(curvExtLocation, inflectionLocation);
                        processEvent = true;
                        break;
                    }
                    case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear: {
                        console.log("Inflection disappear on the right boundary.");
                        inflectionLocation.push(seqComparator.sequenceDiffEvents1.eventAt(seqComparator.sequenceDiffEvents1.length() - 1).location);
                        this.sequenceInflectionOutside.insertEvents(curvExtLocation, inflectionLocation);
                        processEvent = true;
                        break;
                    }
                    default:
                        {
                            console.log("Cannot process this configuration with current navigation state.");
                        }
                        this.checkConsistencySequencesDiffEvents();
                }
                if (processEvent) {
                    if (this.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy) {
                        this.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CurveShapeSpaceNavigator_1.CONVERGENCE_THRESHOLD, CurveShapeSpaceNavigator_1.MAX_TRUST_REGION_RADIUS, CurveShapeSpaceNavigator_1.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                    }
                    this.eventMgmtAtCurveExtremities.eventOutOfInterval = true;
                    if (this.eventMgmtAtCurveExtremities.locationsCurvExtrema.length > 0)
                        this.eventMgmtAtCurveExtremities.locationsCurvExtrema.splice(0, this.eventMgmtAtCurveExtremities.locationsCurvExtrema.length - 1);
                    if (this.eventMgmtAtCurveExtremities.locationsInflections.length > 0)
                        this.eventMgmtAtCurveExtremities.locationsInflections.splice(0, this.eventMgmtAtCurveExtremities.locationsInflections.length - 1);
                    for (var i = 0; i < this.sequenceCurvExtOutside.length(); i++) {
                        this.eventMgmtAtCurveExtremities.locationsCurvExtrema.push(this.sequenceCurvExtOutside.eventAt(i).location);
                    }
                    for (var i = 0; i < this.sequenceInflectionOutside.length(); i++) {
                        this.eventMgmtAtCurveExtremities.locationsInflections.push(this.sequenceInflectionOutside.eventAt(i).location);
                    }
                }
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "navigate", "Several events appear/disappear simultaneously. Configuration not processed yet");
                error.logMessage();
            }
        }
    };
    EventStayInsideCurve.prototype.checkConsistencySequencesDiffEvents = function () {
        if (this.sequenceCurvExtOutside.length() > 2) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencySequencesDiffEvents", "Number of curvature extrema moving outside is inconsistent.");
            error.logMessage();
        }
        else if (this.sequenceInflectionOutside.length() > 2) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencySequencesDiffEvents", "Number of inflections moving outside is inconsistent.");
            error.logMessage();
        }
    };
    return EventStayInsideCurve;
}(EventStateAtCurveExtremity));
exports.EventStayInsideCurve = EventStayInsideCurve;
var EventSlideOutsideCurve = /** @class */ (function (_super) {
    __extends(EventSlideOutsideCurve, _super);
    function EventSlideOutsideCurve(eventMgmtAtCurveExtremities) {
        var _this = _super.call(this, eventMgmtAtCurveExtremities) || this;
        _this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities = _this;
        _this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.Inactive;
        return _this;
    }
    EventSlideOutsideCurve.prototype.handleEventAtCurveExtremity = function () {
        if ((this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces
            || this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace)
            && this.shapeSpaceDiffEventStructure.slidingDifferentialEvents) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtCurveExtremities));
            var message = new ErrorLoging_1.WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        }
        else if (this.shapeSpaceDiffEventStructure.slidingDifferentialEvents && this.shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(this.eventMgmtAtCurveExtremities));
            var message = new ErrorLoging_1.WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        }
        else if (!this.shapeSpaceDiffEventStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "handleEventAtCurveExtremity", "Cannot appply state change of event management at curve extremities: sliding status is inconsistent.");
            error.logMessage();
        }
    };
    EventSlideOutsideCurve.prototype.monitorEventInsideCurve = function (seqComparator) {
    };
    return EventSlideOutsideCurve;
}(EventStateAtCurveExtremity));
exports.EventSlideOutsideCurve = EventSlideOutsideCurve;
var NoEventToManageForCurve = /** @class */ (function (_super) {
    __extends(NoEventToManageForCurve, _super);
    function NoEventToManageForCurve(eventMgmtAtCurveExtremities) {
        var _this = _super.call(this, eventMgmtAtCurveExtremities) || this;
        _this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities = _this;
        _this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.NotApplicable;
        return _this;
    }
    NoEventToManageForCurve.prototype.handleEventAtCurveExtremity = function () {
        if (this.shapeSpaceDiffEventStructure.slidingDifferentialEvents && (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces
            || this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace)) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            if (this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtCurveExtremities));
            }
            else if (this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Inactive) {
                this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtCurveExtremities));
            }
            var message = new ErrorLoging_1.WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        }
        else if (!this.shapeSpaceDiffEventStructure.slidingDifferentialEvents) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "handleEventAtCurveExtremity", "Cannot appply state change of event management at curve extremities: sliding status is inconsistent.");
            error.logMessage();
        }
    };
    NoEventToManageForCurve.prototype.monitorEventInsideCurve = function (seqComparator) {
    };
    return NoEventToManageForCurve;
}(EventStateAtCurveExtremity));
exports.NoEventToManageForCurve = NoEventToManageForCurve;
