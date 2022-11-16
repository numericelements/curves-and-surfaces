import { CCurveNavigationWithoutShapeSpaceMonitoring, OCurveNavigationStrictlyInsideShapeSpace, OCurveNavigationThroughSimplerShapeSpaces, OCurveNavigationWithoutShapeSpaceMonitoring } from "../curveShapeSpaceNavigation/NavigationState";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { EventMgmtAtCurveExtremities } from "./EventMgmtAtCurveExtremities";
import { ShapeNavigableCurve } from "./ShapeNavigableCurve";

export abstract class EventStateAtCurveExtremity {

    protected eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities;
    protected readonly shapeNavigableCurve: ShapeNavigableCurve;

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
        const curveShapeSpaceNavigator = this.shapeNavigableCurve.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator !== undefined) {
            const shapeSpaceDiffEventsStructure = curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
            if(shapeSpaceDiffEventsStructure.slidingDifferentialEvents &&
                (curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
                || curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces)) {
                console.log(" display events, (insert knots ?)");
                this.shapeNavigableCurve.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtCurveExtremities));
            } else {
                console.log(" nothing to do. No state change")
            }
        } else {
            const error = new ErrorLog(this.constructor.name, "handleEventAtCurveExtremity", "Unable to handle events at curve extremity: curve shape space navogator undefined.");
            error.logMessageToConsole();
        }
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
        const curveShapeSpaceNavigator = this.shapeNavigableCurve.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator !== undefined) {
            const shapeSpaceDiffEventsStructure = curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
            if(shapeSpaceDiffEventsStructure.slidingDifferentialEvents
                || curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring) {
                console.log(" nothing to do. No state change")
            } else if((curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
                || curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace)
                && shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
                this.shapeNavigableCurve.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtCurveExtremities));
            }
        } else {
            const error = new ErrorLog(this.constructor.name, "handleEventAtCurveExtremity", "Unable to handle events at curve extremity: curve shape space navogator undefined.");
            error.logMessageToConsole();
        }
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