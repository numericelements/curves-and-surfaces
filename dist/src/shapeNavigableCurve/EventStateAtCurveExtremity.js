"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoEventToManageForCurve = exports.EventSlideOutsideCurve = exports.EventStayInsideCurve = exports.EventStateAtCurveExtremity = void 0;
const CurveShapeMonitoringStrategy_1 = require("../controllers/CurveShapeMonitoringStrategy");
const CurveShapeSpaceNavigator_1 = require("../curveShapeSpaceNavigation/CurveShapeSpaceNavigator");
const NavigationState_1 = require("../curveShapeSpaceNavigation/NavigationState");
const ShapeSpaceDiffEventsStructure_1 = require("../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
const NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
const SequenceOfDifferentialEvents_1 = require("../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
class EventStateAtCurveExtremity {
    constructor(eventMgmtAtCurveExtremities) {
        this.eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
        this.shapeNavigableCurve = eventMgmtAtCurveExtremities.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = eventMgmtAtCurveExtremities.curveShapeSpaceNavigator;
        this.shapeSpaceDiffEventStructure = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
    }
}
exports.EventStateAtCurveExtremity = EventStateAtCurveExtremity;
class EventStayInsideCurve extends EventStateAtCurveExtremity {
    constructor(eventMgmtAtCurveExtremities) {
        super(eventMgmtAtCurveExtremities);
        this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities = this;
        this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active;
        if (this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy instanceof CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategy) {
            this.curveShapeMonitoringStrategy = this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Inconsistent curveShapeMonitoringStrategy class");
            error.logMessage();
            this.curveShapeMonitoringStrategy = this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy;
        }
        this.curveShapeMonitoringStrategy.resetCurve(this.shapeNavigableCurve.curveCategory.curveModel.spline);
        this.sequenceCurvExtOutside = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents();
        this.sequenceInflectionOutside = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents();
    }
    handleEventAtCurveExtremity() {
        if (this.shapeSpaceDiffEventStructure.slidingDifferentialEvents &&
            (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces
                || this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace)) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtCurveExtremities));
            const message = new ErrorLoging_1.WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        }
        else if (this.shapeSpaceDiffEventStructure.slidingDifferentialEvents && this.shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(this.eventMgmtAtCurveExtremities));
            const message = new ErrorLoging_1.WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        }
        else if (!this.shapeSpaceDiffEventStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "handleEventAtCurveExtremity", "Cannot appply state change of event management at curve extremities: sliding status is inconsistent.");
            error.logMessage();
        }
    }
    monitorEventInsideCurve(seqComparator) {
        if (seqComparator.neighboringEvents.length > 0) {
            if (seqComparator.neighboringEvents.length === 1) {
                let processEvent = false;
                let curvExtLocation = [];
                let inflectionLocation = [];
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
                    for (let i = 0; i < this.sequenceCurvExtOutside.length(); i++) {
                        this.eventMgmtAtCurveExtremities.locationsCurvExtrema.push(this.sequenceCurvExtOutside.eventAt(i).location);
                    }
                    for (let i = 0; i < this.sequenceInflectionOutside.length(); i++) {
                        this.eventMgmtAtCurveExtremities.locationsInflections.push(this.sequenceInflectionOutside.eventAt(i).location);
                    }
                }
            }
            else {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "navigate", "Several events appear/disappear simultaneously. Configuration not processed yet");
                error.logMessage();
            }
        }
    }
    checkConsistencySequencesDiffEvents() {
        if (this.sequenceCurvExtOutside.length() > 2) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencySequencesDiffEvents", "Number of curvature extrema moving outside is inconsistent.");
            error.logMessage();
        }
        else if (this.sequenceInflectionOutside.length() > 2) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencySequencesDiffEvents", "Number of inflections moving outside is inconsistent.");
            error.logMessage();
        }
    }
}
exports.EventStayInsideCurve = EventStayInsideCurve;
class EventSlideOutsideCurve extends EventStateAtCurveExtremity {
    constructor(eventMgmtAtCurveExtremities) {
        super(eventMgmtAtCurveExtremities);
        this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities = this;
        this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.Inactive;
    }
    handleEventAtCurveExtremity() {
        if ((this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces
            || this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace)
            && this.shapeSpaceDiffEventStructure.slidingDifferentialEvents) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtCurveExtremities));
            const message = new ErrorLoging_1.WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        }
        else if (this.shapeSpaceDiffEventStructure.slidingDifferentialEvents && this.shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(this.eventMgmtAtCurveExtremities));
            const message = new ErrorLoging_1.WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        }
        else if (!this.shapeSpaceDiffEventStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "handleEventAtCurveExtremity", "Cannot appply state change of event management at curve extremities: sliding status is inconsistent.");
            error.logMessage();
        }
    }
    monitorEventInsideCurve(seqComparator) {
    }
}
exports.EventSlideOutsideCurve = EventSlideOutsideCurve;
class NoEventToManageForCurve extends EventStateAtCurveExtremity {
    constructor(eventMgmtAtCurveExtremities) {
        super(eventMgmtAtCurveExtremities);
        this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities = this;
        this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities = ShapeSpaceDiffEventsStructure_1.EventMgmtState.NotApplicable;
    }
    handleEventAtCurveExtremity() {
        if (this.shapeSpaceDiffEventStructure.slidingDifferentialEvents && (this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces
            || this.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace)) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            if (this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Active) {
                this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtCurveExtremities));
            }
            else if (this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities === ShapeSpaceDiffEventsStructure_1.EventMgmtState.Inactive) {
                this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtCurveExtremities));
            }
            const message = new ErrorLoging_1.WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        }
        else if (!this.shapeSpaceDiffEventStructure.slidingDifferentialEvents) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "handleEventAtCurveExtremity", "Cannot appply state change of event management at curve extremities: sliding status is inconsistent.");
            error.logMessage();
        }
    }
    monitorEventInsideCurve(seqComparator) {
    }
}
exports.NoEventToManageForCurve = NoEventToManageForCurve;
