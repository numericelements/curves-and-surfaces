import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { CCurveNavigationWithoutShapeSpaceMonitoring, OCurveNavigationStrictlyInsideShapeSpace, OCurveNavigationThroughSimplerShapeSpaces, OCurveNavigationWithoutShapeSpaceMonitoring } from "../curveShapeSpaceNavigation/NavigationState";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { EventMgmtAtCurveExtremities } from "./EventMgmtAtCurveExtremities";
import { ShapeNavigableCurve } from "./ShapeNavigableCurve";

export abstract class EventStateAtCurveExtremity {

    protected readonly eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities;
    protected readonly shapeNavigableCurve: ShapeNavigableCurve;
    protected readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator

    constructor(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
        this.eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
        this.shapeNavigableCurve = eventMgmtAtCurveExtremities.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = eventMgmtAtCurveExtremities.curveShapeSpaceNavigator;
    }

    // setContext(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities): void {
    //     this.eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
    // }

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
        const shapeSpaceDiffEventsStructure = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        if(shapeSpaceDiffEventsStructure.slidingDifferentialEvents &&
            (this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
            || this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces)) {
            console.log(" display events, (insert knots ?)");
            this.curveShapeSpaceNavigator.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtCurveExtremities));
        } else {
            console.log(" nothing to do. No state change")
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
        const shapeSpaceDiffEventsStructure = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        if(shapeSpaceDiffEventsStructure.slidingDifferentialEvents
            || this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring) {
            console.log(" nothing to do. No state change")
        } else if((this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
            || this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace)
            && shapeSpaceDiffEventsStructure.slidingDifferentialEvents) {
            this.curveShapeSpaceNavigator.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtCurveExtremities));
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