import { CurveShapeMonitoringStrategy, OCurveShapeMonitoringStrategy } from "../controllers/CurveShapeMonitoringStrategy";
import { CONVERGENCE_THRESHOLD, CurveShapeSpaceNavigator, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER, MAX_TRUST_REGION_RADIUS } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { OpenCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/NavigationCurveModel";
import { CCurveNavigationWithoutShapeSpaceMonitoring, OCurveNavigationStrictlyInsideShapeSpace, OCurveNavigationThroughSimplerShapeSpaces, OCurveNavigationWithoutShapeSpaceMonitoring } from "../curveShapeSpaceNavigation/NavigationState";
import { EventMgmtState, ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { ComparatorOfSequencesOfDiffEvents } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { NeighboringEventsType } from "../sequenceOfDifferentialEvents/NeighboringEvents";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { EventMgmtAtCurveExtremities } from "./EventMgmtAtCurveExtremities";
import { ShapeNavigableCurve } from "./ShapeNavigableCurve";

export abstract class EventStateAtCurveExtremity {

    protected readonly eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities;
    protected readonly shapeNavigableCurve: ShapeNavigableCurve;
    protected readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    protected readonly shapeSpaceDiffEventStructure: ShapeSpaceDiffEventsStructure;

    constructor(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
        this.eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
        this.shapeNavigableCurve = eventMgmtAtCurveExtremities.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = eventMgmtAtCurveExtremities.curveShapeSpaceNavigator;
        this.shapeSpaceDiffEventStructure = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
    }

    abstract handleEventAtCurveExtremity(): void;

    abstract monitorEventInsideCurve(seqComparator: ComparatorOfSequencesOfDiffEvents): void;

}

export class EventStayInsideCurve extends EventStateAtCurveExtremity {

    private readonly curveShapeMonitoringStrategy: CurveShapeMonitoringStrategy;
    private sequenceCurvExtOutside: SequenceOfDifferentialEvents;
    private sequenceInflectionOutside: SequenceOfDifferentialEvents;

    constructor(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
        super(eventMgmtAtCurveExtremities);
        this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities = this;
        this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities = EventMgmtState.Active;
        if(this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy) {
            this.curveShapeMonitoringStrategy = this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy;
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent curveShapeMonitoringStrategy class");
            error.logMessage();
            this.curveShapeMonitoringStrategy = this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy;
        }
        this.curveShapeMonitoringStrategy.resetCurve(this.shapeNavigableCurve.curveCategory.curveModel.spline);
        this.sequenceCurvExtOutside = new SequenceOfDifferentialEvents();
        this.sequenceInflectionOutside = new SequenceOfDifferentialEvents();
    }

    handleEventAtCurveExtremity(): void {
        if(this.shapeSpaceDiffEventStructure.slidingDifferentialEvents &&
            (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
            || this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace)) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtCurveExtremities));
            const message = new WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        } else if(this.shapeSpaceDiffEventStructure.slidingDifferentialEvents && this.shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(this.eventMgmtAtCurveExtremities));
            const message = new WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        } else if(!this.shapeSpaceDiffEventStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "handleEventAtCurveExtremity", "Cannot appply state change of event management at curve extremities: sliding status is inconsistent.");
            error.logMessage();
        }
    }

    monitorEventInsideCurve(seqComparator: ComparatorOfSequencesOfDiffEvents): void {
        if(seqComparator.neighboringEvents.length > 0) {
            if(seqComparator.neighboringEvents.length === 1) {
                let processEvent = false;
                let curvExtLocation: Array<number> = [];
                let inflectionLocation: Array<number> = [];
                switch(seqComparator.neighboringEvents[0].type) {
                    case NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear: {
                        console.log("Curvature extremum disappear on the left boundary.");
                        curvExtLocation.push(seqComparator.sequenceDiffEvents1.eventAt(0).location);
                        this.sequenceCurvExtOutside.insertEvents(curvExtLocation, inflectionLocation);
                        processEvent = true;
                        break;
                    }
                    case NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear: {
                        console.log("Curvature extremum disappear on the right boundary.");
                        curvExtLocation.push(seqComparator.sequenceDiffEvents1.eventAt(seqComparator.sequenceDiffEvents1.length() - 1).location);
                        this.sequenceCurvExtOutside.insertEvents(curvExtLocation, inflectionLocation);
                        processEvent = true;
                        break;
                    }
                    case NeighboringEventsType.neighboringCurvatureExtrema: {
                        console.log("Two Curvature extrema disappear between two inflections or an extreme interval or a unique interval.");
                        break;
                    }
                    case NeighboringEventsType.neighboringCurvatureExtremaAppear: {
                        console.log("Two Curvature extrema appear between two inflections or an extreme interval or a unique interval.");
                        break;
                    }
                    case NeighboringEventsType.neighboringCurvatureExtremaDisappear: {
                        console.log("Two Curvature extrema disappear between two inflections or an extreme interval or a unique interval.");
                        break;
                    }
                    case NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear: {
                        console.log("Inflection disappear on the left boundary.");
                        inflectionLocation.push(seqComparator.sequenceDiffEvents1.eventAt(0).location);
                        this.sequenceInflectionOutside.insertEvents(curvExtLocation, inflectionLocation);
                        processEvent = true;
                        break;
                    }
                    case NeighboringEventsType.neighboringInflectionRightBoundaryDisappear: {
                        console.log("Inflection disappear on the right boundary.");
                        inflectionLocation.push(seqComparator.sequenceDiffEvents1.eventAt(seqComparator.sequenceDiffEvents1.length() - 1).location);
                        this.sequenceInflectionOutside.insertEvents(curvExtLocation, inflectionLocation);
                        processEvent = true;
                        break;
                    }
                    default: {
                        console.log("Cannot process this configuration with current navigation state.");
                    }
                    this.checkConsistencySequencesDiffEvents();
                }
                if(processEvent) {
                    if(this.curveShapeMonitoringStrategy instanceof OCurveShapeMonitoringStrategy) {
                        this.curveShapeMonitoringStrategy.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
                    }
                    this.eventMgmtAtCurveExtremities.eventOutOfInterval = true;
                    if(this.eventMgmtAtCurveExtremities.locationsCurvExtrema.length > 0)
                        this.eventMgmtAtCurveExtremities.locationsCurvExtrema.splice(0, this.eventMgmtAtCurveExtremities.locationsCurvExtrema.length - 1);
                    if(this.eventMgmtAtCurveExtremities.locationsInflections.length > 0)
                        this.eventMgmtAtCurveExtremities.locationsInflections.splice(0, this.eventMgmtAtCurveExtremities.locationsInflections.length - 1);
                    for(let i = 0; i < this.sequenceCurvExtOutside.length(); i++) {
                        this.eventMgmtAtCurveExtremities.locationsCurvExtrema.push(this.sequenceCurvExtOutside.eventAt(i).location);
                    }
                    for(let i = 0; i < this.sequenceInflectionOutside.length(); i++) {
                        this.eventMgmtAtCurveExtremities.locationsInflections.push(this.sequenceInflectionOutside.eventAt(i).location);
                    }
                }
            } else {
                const error = new ErrorLog(this.constructor.name, "navigate", "Several events appear/disappear simultaneously. Configuration not processed yet");
                error.logMessage();
            }
        }
    }

    checkConsistencySequencesDiffEvents(): void {
        if(this.sequenceCurvExtOutside.length() > 2) {
            const error = new ErrorLog(this.constructor.name, "checkConsistencySequencesDiffEvents", "Number of curvature extrema moving outside is inconsistent.");
            error.logMessage();
        } else if(this.sequenceInflectionOutside.length() > 2) {
            const error = new ErrorLog(this.constructor.name, "checkConsistencySequencesDiffEvents", "Number of inflections moving outside is inconsistent.");
            error.logMessage();
        }
    }

}

export class EventSlideOutsideCurve extends EventStateAtCurveExtremity {

    constructor(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
        super(eventMgmtAtCurveExtremities);
        this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities = this;
        this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities = EventMgmtState.Inactive;
    }

    handleEventAtCurveExtremity(): void {
        if((this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
            || this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace)
            && this.shapeSpaceDiffEventStructure.slidingDifferentialEvents) {
                this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtCurveExtremities));
            const message = new WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        } else if(this.shapeSpaceDiffEventStructure.slidingDifferentialEvents && this.shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(this.eventMgmtAtCurveExtremities));
            const message = new WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        } else if(!this.shapeSpaceDiffEventStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "handleEventAtCurveExtremity", "Cannot appply state change of event management at curve extremities: sliding status is inconsistent.");
            error.logMessage();
        }
    }

    monitorEventInsideCurve(seqComparator: ComparatorOfSequencesOfDiffEvents): void {
    }
}

export class NoEventToManageForCurve extends EventStateAtCurveExtremity {

    constructor(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
        super(eventMgmtAtCurveExtremities);
        this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities = this;
        this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities = EventMgmtState.NotApplicable;
    }

    handleEventAtCurveExtremity(): void {
        if(this.shapeSpaceDiffEventStructure.slidingDifferentialEvents && (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
            || this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace)) {
            this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities = this.shapeSpaceDiffEventStructure.managementOfEventsAtExtremities;
            if(this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities === EventMgmtState.Active) {
                this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtCurveExtremities));
            } else if(this.eventMgmtAtCurveExtremities.previousManagementOfEventsAtExtremities === EventMgmtState.Inactive) {
                this.eventMgmtAtCurveExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtCurveExtremities));
            }
            const message = new WarningLog(this.constructor.name, " handleEventAtCurveExtremity ", this.eventMgmtAtCurveExtremities.eventStateAtCrvExtremities.constructor.name);
            message.logMessage();
        } else if(!this.shapeSpaceDiffEventStructure.slidingDifferentialEvents) {
            const error = new ErrorLog(this.constructor.name, "handleEventAtCurveExtremity", "Cannot appply state change of event management at curve extremities: sliding status is inconsistent.");
            error.logMessage();
        }
    }

    monitorEventInsideCurve(seqComparator: ComparatorOfSequencesOfDiffEvents): void {
    }
}