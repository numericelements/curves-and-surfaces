"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrictShapeSpacesBoundaryEnforcerClosedCurve = exports.StrictShapeSpacesBoundaryEnforcerOpenCurve = exports.NestedShapeSpacesBoundaryEnforcerOpenCurve = exports.AbstractShapeSpaceBoundaryEnforcer = exports.EventsAtCurveExtremities = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
class EventsAtCurveExtremities {
    constructor() {
        this._start = false;
        this._end = false;
    }
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    set start(start) {
        this._start = start;
    }
    set end(end) {
        this._end = end;
    }
}
exports.EventsAtCurveExtremities = EventsAtCurveExtremities;
class AbstractShapeSpaceBoundaryEnforcer {
    constructor() {
        this.status = false;
        this._neighboringEvents = [];
    }
    get neighboringEvents() {
        return this._neighboringEvents;
    }
    activate() {
        this.status = true;
    }
    isActive() {
        if (this.status) {
            return true;
        }
        else {
            return false;
        }
    }
    deactivate() {
        this.status = false;
    }
    addTransitionOfEvents(neighborinhEvents) {
        this._neighboringEvents = neighborinhEvents.slice();
    }
    hasTransitionsOfEvents() {
        if (this._neighboringEvents.length > 0) {
            let validList = true;
            for (const neighboringEvent of this._neighboringEvents) {
                if (neighboringEvent.type === NeighboringEvents_1.NeighboringEventsType.none)
                    validList = false;
            }
            if (validList) {
                return true;
            }
            else {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "hasTransitionsOfEvents", "The list of current differential events is inconsistent");
                error.logMessage();
                return false;
            }
        }
        else {
            return false;
        }
    }
    resetNeighboringEvents() {
        this._neighboringEvents = [];
    }
}
exports.AbstractShapeSpaceBoundaryEnforcer = AbstractShapeSpaceBoundaryEnforcer;
class NestedShapeSpacesBoundaryEnforcerOpenCurve extends AbstractShapeSpaceBoundaryEnforcer {
    constructor() {
        super();
        this._curvExtremumEventAtExtremity = new EventsAtCurveExtremities();
        this._inflectionEventAtExtremity = new EventsAtCurveExtremities();
    }
    get curvExtremumEventAtExtremity() {
        return this._curvExtremumEventAtExtremity;
    }
    get inflectionEventAtExtremity() {
        return this._inflectionEventAtExtremity;
    }
    isTransitionAtExtremity() {
        let isTransition = false;
        if (this.isCurvatureExtTransitionAtExtremity() || this.isInflectionTransitionAtExtremity()
            || this.isMixedTransitionAtExtremity())
            isTransition = true;
        return isTransition;
    }
    isCurvatureExtTransitionAtExtremity() {
        let isTransition = false;
        if ((this._curvExtremumEventAtExtremity.start || this._curvExtremumEventAtExtremity.end)
            && !(this._inflectionEventAtExtremity.start || this._inflectionEventAtExtremity.end))
            isTransition = true;
        return isTransition;
    }
    isInflectionTransitionAtExtremity() {
        let isTransition = false;
        if (!(this._curvExtremumEventAtExtremity.start || this._curvExtremumEventAtExtremity.end)
            && (this._inflectionEventAtExtremity.start || this._inflectionEventAtExtremity.end))
            isTransition = true;
        return isTransition;
    }
    isMixedTransitionAtExtremity() {
        let isTransition = false;
        if (this._curvExtremumEventAtExtremity.start && this._inflectionEventAtExtremity.end
            && !this._curvExtremumEventAtExtremity.end && !this._inflectionEventAtExtremity.start)
            isTransition = true;
        if (this._curvExtremumEventAtExtremity.end && this._inflectionEventAtExtremity.start
            && !this._curvExtremumEventAtExtremity.start && !this._inflectionEventAtExtremity.end)
            isTransition = true;
        return isTransition;
    }
    resetEventsAtExtremities() {
        this._curvExtremumEventAtExtremity = new EventsAtCurveExtremities();
        this._inflectionEventAtExtremity = new EventsAtCurveExtremities();
    }
    reset() {
        this.resetNeighboringEvents();
        this.resetEventsAtExtremities();
        this.status = false;
    }
    configureBoundaryEnforcer(filteredSeqComparator) {
        if (filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
            || filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear) {
            this.curvExtremumEventAtExtremity.start = true;
        }
        else if (filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
            || filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) {
            this.curvExtremumEventAtExtremity.end = true;
        }
        else if (filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
            || filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear) {
            this.inflectionEventAtExtremity.start = true;
        }
        else if (filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
            || filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear) {
            this.inflectionEventAtExtremity.end = true;
        }
        this.activate();
        this.neighboringEvents.push(filteredSeqComparator.neighboringEvents[0]);
    }
}
exports.NestedShapeSpacesBoundaryEnforcerOpenCurve = NestedShapeSpacesBoundaryEnforcerOpenCurve;
class StrictShapeSpacesBoundaryEnforcerOpenCurve extends NestedShapeSpacesBoundaryEnforcerOpenCurve {
    constructor() {
        super();
        this._curvatureDerivativeCPOpt = [];
        this._newEvent = false;
    }
    get curvatureDerivativeCPOpt() {
        return this._curvatureDerivativeCPOpt;
    }
    set curvatureDerivativeCPOpt(curvatureDerivativeCPOpt) {
        this._curvatureDerivativeCPOpt = curvatureDerivativeCPOpt.slice();
    }
    newEventExist() {
        this._newEvent = true;
    }
    removeNewEvent() {
        this._newEvent = false;
    }
    hasNewEvent() {
        if (this._newEvent) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.StrictShapeSpacesBoundaryEnforcerOpenCurve = StrictShapeSpacesBoundaryEnforcerOpenCurve;
class StrictShapeSpacesBoundaryEnforcerClosedCurve extends AbstractShapeSpaceBoundaryEnforcer {
    constructor() {
        super();
        this._curvatureDerivativeCPOpt = [];
        this._newEvent = false;
    }
    reset() {
        this.resetNeighboringEvents();
        this.status = false;
    }
    newEventExist() {
        this._newEvent = true;
    }
    removeNewEvent() {
        this._newEvent = false;
    }
    hasNewEvent() {
        if (this._newEvent) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.StrictShapeSpacesBoundaryEnforcerClosedCurve = StrictShapeSpacesBoundaryEnforcerClosedCurve;
