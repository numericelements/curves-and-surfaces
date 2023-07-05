import { SequenceOfDifferentialEvents } from "./SequenceOfDifferentialEvents";
import { ModifiedCurvatureEvents, ModifiedInflectionEvents } from "./ModifiedDifferentialEvents";
import { NeighboringEvents, NeighboringEventsType } from "./NeighboringEvents";
import { SequenceOfIntervals } from "./SequenceOfIntervals";
import { ComparatorOfSequencesOfIntervals } from "./ComparatorOfSequencesOfIntervals";
import { LocalizerOfCurvatureExtremaAppearing, 
        LocalizerOfCurvatureExtremaDisappearing,
        LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval,
        LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval,
        LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval,
        LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval, 
        LocalizerOfInflectionAppearingInExtremeInterval,
        LocalizerOfInflectionDisappearingInExtremeInterval,
        LocalizerOfInflectionAppearingInUniqueInterval,
        LocalizerOfInflectionDisappearingInUniqueInterval,
        LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum,
        LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum} from "./LocalizerOfDifferentialEvents";
import { ORDER_CURVATURE_EXTREMUM, ORDER_INFLECTION } from "./DifferentialEvent";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { INITIAL_INDEX } from "../curveShapeSpaceAnalysis/ExtremumLocationClassifiier";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";


export const UPPER_BOUND_CURVE_INTERVAL = 1.0;
export const LOWER_BOUND_CURVE_INTERVAL = 0.0;
export const CURVE_INTERVAL_SPAN = UPPER_BOUND_CURVE_INTERVAL - LOWER_BOUND_CURVE_INTERVAL;

export const RETURN_ERROR_CODE = -1;

export const ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL = 1;
export const ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL = -1;
export const TWO_CURVEXT_EVENTS_APPEAR = 2;
export const TWO_CURVEXT_EVENTS_DISAPPEAR = -2;
export const ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL = 1;
export const ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL = -1;
export const TWO_INFLECTIONS_EVENTS_APPEAR = 2;
export const TWO_INFLECTIONS_EVENTS_DISAPPEAR = -2;


/**
 * Compare the sequences of differential events _sequenceDiffEvents1 and _sequenceDiffEvents2 to look for curvature extrema changes (appearing/disappearing)
 * when the number of inflections is identical in each sequence:
 * @returns : array of ModifiedCurvatureEvents where each interval is defined by two successive inflections. 
 * This interval is characterized by the right inflection identified by its INDEX in the array of indices of inflections found in _sequenceDiffEvents1. 
 * When event changes occur in the last interval of _sequenceDiffEvents1, i.e., after the last inflection of this sequence, the right bound of this interval 
 * is set to: indicesInflection1.length (the number inflections + 1). This process is used to designate an interval, only, and is
 * not altering the content of the array of indices of inflections. In case a sequence has no inflection, i.e., this array has length zero,
 * though the interval is designated with zero.
 * It can  be an array of modifiedInflectionEvents where each interval is defined by the INDEX of a curvature
 * extremum in _sequenceDiffEvents1 (if two inflections appear or disappear, they are adjacent to a curvature extremum).
 * When event changes occur in the last interval of _sequenceDiffEvents1, i.e., after the last curvature extremum of this sequence, the right bound of this interval 
 * is set to: _sequenceDiffEvents1.length (the number of events + 1). If the inflection change occurs in the first interval,
 * the index is set to 1.
 */
export class ComparatorOfSequencesOfDiffEvents {

    private _sequenceDiffEvents1: SequenceOfDifferentialEvents;
    private _sequenceDiffEvents2: SequenceOfDifferentialEvents;
    public modifiedCurvExEvents: Array<ModifiedCurvatureEvents> = [];
    public modifiedInflectionEvents: Array<ModifiedInflectionEvents> = [];
    public neighboringEvents: Array<NeighboringEvents> = [];


    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents) {
        this._sequenceDiffEvents1 = sequenceDiffEvents1;
        this._sequenceDiffEvents2 = sequenceDiffEvents2;
    }

    get sequenceDiffEvents1(): SequenceOfDifferentialEvents {
        return this._sequenceDiffEvents1;
    }

    get sequenceDiffEvents2(): SequenceOfDifferentialEvents {
        return this._sequenceDiffEvents2;
    }

    set sequenceDiffEvents1(sequenceDiffEvents: SequenceOfDifferentialEvents) {
        sequenceDiffEvents.checkSequenceConsistency();
        this._sequenceDiffEvents1 = sequenceDiffEvents;
    }

    set sequenceDiffEvents2(sequenceDiffEvents: SequenceOfDifferentialEvents) {
        sequenceDiffEvents.checkSequenceConsistency();
        this._sequenceDiffEvents2 = sequenceDiffEvents;
    }

    locateIntervalAndNumberOfCurvExEventChanges(): void {
        if(this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
            let shift = 0;
            for(let j = 0; j < this._sequenceDiffEvents1.indicesOfInflections.length; j += 1) {
                const delta = this._sequenceDiffEvents1.indicesOfInflections[j] - this._sequenceDiffEvents2.indicesOfInflections[j];
                if(delta !== shift) {
                    const modEventInInterval = new ModifiedCurvatureEvents(j, (shift - delta));
                    this.modifiedCurvExEvents.push(modEventInInterval);
                    shift = shift + delta;
                }
            }
            if(this._sequenceDiffEvents1.indicesOfInflections.length > 0 && this.modifiedCurvExEvents.length === 0) {
                // There are inflections and no changes in the first indicesInflectionInit.length intervals -> changes take place in the last interval
                const modEventInInterval = new ModifiedCurvatureEvents(this._sequenceDiffEvents1.indicesOfInflections.length, (this._sequenceDiffEvents2.length() - this._sequenceDiffEvents1.length()));
                this.modifiedCurvExEvents.push(modEventInInterval);
            }
            if(this._sequenceDiffEvents1.indicesOfInflections.length === 0 && 
                this._sequenceDiffEvents1.length() !== this._sequenceDiffEvents2.length()) {
                // There is no inflexion in the sequence of events -> all events take place in the 'first' interval
                const modEventInInterval = new ModifiedCurvatureEvents(0, (this._sequenceDiffEvents2.length() - this._sequenceDiffEvents1.length()));
                this.modifiedCurvExEvents.push(modEventInInterval);
            }
        } else {
            const message = 'Nb of inflections differ. In seq1 = ' + this._sequenceDiffEvents1.indicesOfInflections.length + ' seq2 = '+this._sequenceDiffEvents2.indicesOfInflections.length;
            const warning = new WarningLog(this.constructor.name, "locateIntervalAndNumberOfCurvExEventChanges", message);
            warning.logMessageToConsole();
        }
        if(this._sequenceDiffEvents1.length() === this._sequenceDiffEvents2.length() && this._sequenceDiffEvents1.indicesOfInflections.length > 0) {
            this.checkConsistencySumModifiedEvents();
        }
        this.checkConsistencyModifiedEvents();
    }

    setModifedInflectionEventInExtremeInterval(sequenceDiffEvents: SequenceOfDifferentialEvents, nbModifiedInflections: number): void {
        let modificationOfInflectionEventExist = false;
        if(sequenceDiffEvents.eventAt(0).order === ORDER_INFLECTION) {
            if(sequenceDiffEvents.length() === 1) {
                const modEventInInterval = new ModifiedInflectionEvents(0, nbModifiedInflections);
                this.modifiedInflectionEvents.push(modEventInInterval);
            } else if(sequenceDiffEvents.eventAt(1).order === ORDER_CURVATURE_EXTREMUM) {
                const modEventInInterval = new ModifiedInflectionEvents(1, nbModifiedInflections);
                this.modifiedInflectionEvents.push(modEventInInterval);
            }
            modificationOfInflectionEventExist = true;
        }
        if(sequenceDiffEvents.length() > 1) {
            if(sequenceDiffEvents.eventAt(sequenceDiffEvents.length() - 1).order === ORDER_INFLECTION 
            && sequenceDiffEvents.eventAt(sequenceDiffEvents.length() - 2).order === ORDER_CURVATURE_EXTREMUM) {
                const modEventInInterval = new ModifiedInflectionEvents(sequenceDiffEvents.length() - 2, nbModifiedInflections);
                this.modifiedInflectionEvents.push(modEventInInterval);
                modificationOfInflectionEventExist = true;
            } 
        }
        if(!modificationOfInflectionEventExist) {
            let error = new ErrorLog(this.constructor.name, "setModifedInflectionEventInExtremeInterval", "Inconsistent variation of sequences of differential events.");
            error.logMessageToConsole();
        }
    }

    areTwoInflectionsDisappearingAtCurveExtremities(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents): boolean {
        let twoInflectionsAtCurveExtremities = false;
        if(sequenceDiffEvents2.length() > 1) {
            if(sequenceDiffEvents1.eventAt(0).order === ORDER_INFLECTION && sequenceDiffEvents2.eventAt(0).order === ORDER_CURVATURE_EXTREMUM
            && sequenceDiffEvents1.eventAt(sequenceDiffEvents1.length() - 1).order === ORDER_INFLECTION && sequenceDiffEvents2.eventAt(sequenceDiffEvents2.length() - 1).order === ORDER_CURVATURE_EXTREMUM) {
                twoInflectionsAtCurveExtremities = true;
            }
        }
        return twoInflectionsAtCurveExtremities;
    }

    setModifedInflectionEventsAtCurveEx(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, nbModifiedInflections: number):boolean {
        let generateModEvents = false;
        if(nbModifiedInflections === TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
            if(this.areTwoInflectionsDisappearingAtCurveExtremities(sequenceDiffEvents1, sequenceDiffEvents2)) {
                this.setModifedInflectionEventInExtremeInterval(sequenceDiffEvents1, ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL);
                generateModEvents = true;
            }
        } else if(nbModifiedInflections === TWO_INFLECTIONS_EVENTS_APPEAR) {
            if(this.areTwoInflectionsDisappearingAtCurveExtremities(sequenceDiffEvents2, sequenceDiffEvents1)) {
                this.setModifedInflectionEventInExtremeInterval(sequenceDiffEvents2, ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL);
                generateModEvents = true;
            }
        }
        return generateModEvents;
    }

    setModifedInflectionEventsAjacentToCurvEx(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, nbModifiedInflections: number):void {
        if(this.setModifedInflectionEventsAtCurveEx(sequenceDiffEvents1, sequenceDiffEvents2, nbModifiedInflections)) {
            return;
        }
        let shift = 0;
        for(let j = 0; j < sequenceDiffEvents1.length(); j += 1) {
            if(sequenceDiffEvents1.eventAt(j).order !== sequenceDiffEvents2.eventAt(j + shift).order) {
                let modEventInInterval: ModifiedInflectionEvents;
                if(nbModifiedInflections > 0) {
                    modEventInInterval = new ModifiedInflectionEvents(j, TWO_INFLECTIONS_EVENTS_APPEAR);
                } else {
                    modEventInInterval = new ModifiedInflectionEvents(j, TWO_INFLECTIONS_EVENTS_DISAPPEAR);
                }
                this.modifiedInflectionEvents.push(modEventInInterval);
                shift = shift + TWO_INFLECTIONS_EVENTS_APPEAR;
            }
        }
    }

    locateIntervalAndNumberOfInflectionEventChanges(): void {
        const nbCurvExtrema1 = this._sequenceDiffEvents1.length() - this._sequenceDiffEvents1.indicesOfInflections.length;
        const nbCurvExtrema2 = this._sequenceDiffEvents2.length() - this._sequenceDiffEvents2.indicesOfInflections.length;
        if(nbCurvExtrema1 === nbCurvExtrema2) {
            const nbModifiedInflections =  this._sequenceDiffEvents2.indicesOfInflections.length -   this._sequenceDiffEvents1.indicesOfInflections.length;
            if(nbModifiedInflections === ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL) {
                this.setModifedInflectionEventInExtremeInterval(this._sequenceDiffEvents2, nbModifiedInflections);
            } else if(nbModifiedInflections === ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL) {
                this.setModifedInflectionEventInExtremeInterval(this._sequenceDiffEvents1, nbModifiedInflections);
            } else if(nbModifiedInflections === TWO_INFLECTIONS_EVENTS_APPEAR) {
                if(nbCurvExtrema1 > 0) {
                    this.setModifedInflectionEventsAjacentToCurvEx(this._sequenceDiffEvents1, this._sequenceDiffEvents2, nbModifiedInflections);
                } else {
                    const error = new ErrorLog(this.constructor.name, "locateIntervalAndNumberOfInflectionEventChanges", "Inconsistent number of curvature extrema. There must be one, at least.");
                    error.logMessageToConsole();
                }
            } else if(nbModifiedInflections === TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
                if(nbCurvExtrema2  > 0) {
                    this.setModifedInflectionEventsAjacentToCurvEx(this._sequenceDiffEvents2, this._sequenceDiffEvents1, nbModifiedInflections);
                } else {
                    const error = new ErrorLog(this.constructor.name, "locateIntervalAndNumberOfInflectionEventChanges", "Inconsistent number of curvature extrema. There must be one, at least.");
                    error.logMessageToConsole();
                }
            }
        }
    }

    locateNeiboringEventsUnderCurvExEventChanges(): void {
        if(this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
            console.log("Seq Curv Ext zeros = "+this._sequenceDiffEvents2.nbCurvatureExtrema())
            for(let modifiedCurvExEvent of this.modifiedCurvExEvents) {
                this._sequenceDiffEvents1.checkConsistencyIntervalBtwInflections(modifiedCurvExEvent);
                if(modifiedCurvExEvent.nbEvents === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length === 0) {
                    const locatorCurvatureEvent = new LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForCurvExtrema(neighboringEvent, modifiedCurvExEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                } else if(modifiedCurvExEvent.nbEvents === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.indicesOfInflections.length === 0) {
                    const locatorCurvatureEvent = new LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForCurvExtrema(neighboringEvent, modifiedCurvExEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                } else if(modifiedCurvExEvent.nbEvents === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length > 0) {
                    // Because there is only one event appearing and this event is of type curvature extremum, it can take place either in the first or in the last interval
                    const locatorCurvatureEvent = new LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2, modifiedCurvExEvent.indexInflection);
                    const neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForCurvExtrema(neighboringEvent, modifiedCurvExEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                } else if(modifiedCurvExEvent.nbEvents === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.indicesOfInflections.length > 0){
                    // Because there is only one event appearing and this event is of type curvature extremum, it can take place either in the first or in the last interval
                    const locatorCurvatureEvent = new LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2, modifiedCurvExEvent.indexInflection);
                    const neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForCurvExtrema(neighboringEvent, modifiedCurvExEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                } else if(modifiedCurvExEvent.nbEvents === TWO_CURVEXT_EVENTS_APPEAR) {
                    const locatorCurvEventAppearing = new LocalizerOfCurvatureExtremaAppearing(this._sequenceDiffEvents1, this._sequenceDiffEvents2, modifiedCurvExEvent.indexInflection);
                    const neighboringEvent: NeighboringEvents = locatorCurvEventAppearing.locateDifferentialEvents();
                    neighboringEvent.type = NeighboringEventsType.neighboringCurvatureExtremaAppear;
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedCurvExEvent.nbEvents === TWO_CURVEXT_EVENTS_DISAPPEAR) {
                    const locatorCurvEventDisappearing = new LocalizerOfCurvatureExtremaDisappearing(this._sequenceDiffEvents1, this._sequenceDiffEvents2, modifiedCurvExEvent.indexInflection);
                    const neighboringEvent: NeighboringEvents = locatorCurvEventDisappearing.locateDifferentialEvents();
                    neighboringEvent.type = NeighboringEventsType.neighboringCurvatureExtremaDisappear;
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedCurvExEvent.nbEvents !== 0){
                    const error = new ErrorLog(this.constructor.name, "locateNeiboringEventsUnderCurvExEventChanges", "Cannot process the curvature extremum event.");
                    error.logMessageToConsole();
                }
            }
        } else {
            const warning = new WarningLog(this.constructor.name, "locateNeiboringEventsUnderCurvExEventChanges", "No curvature extremum event processed because inflection events are modified too.");
            warning.logMessageToConsole();
        }
    }

    combineLocationAndBehaviorForCurvExtrema(neighboringEvent: NeighboringEvents, eventBehavior: number): NeighboringEvents {
        let result = neighboringEvent;
        if(neighboringEvent.type === NeighboringEventsType.neighboringCurExtremumLeftBoundary && eventBehavior > 0) {
            result.type = NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear;
        } else if(neighboringEvent.type === NeighboringEventsType.neighboringCurExtremumLeftBoundary && eventBehavior < 0) {
            result.type = NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear;
        } else if(neighboringEvent.type === NeighboringEventsType.neighboringCurExtremumRightBoundary && eventBehavior > 0) {
            result.type = NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear;
        } else if(neighboringEvent.type === NeighboringEventsType.neighboringCurExtremumRightBoundary && eventBehavior < 0) {
            result.type = NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear;
        } else {
            const error = new ErrorLog(this.constructor.name, "combineLocationAndBehaviorForCurvExtrema", "Inconsistent differential event type.");
            error.logMessageToConsole();
        }
        return result;
    }

    locateNeiboringEventsUnderInflectionEventChanges(): void {
        const nbEventsModified = this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length();
        const nbInflectionsModified = this._sequenceDiffEvents1.indicesOfInflections.length - this._sequenceDiffEvents2.indicesOfInflections.length;
        if(nbEventsModified === nbInflectionsModified) {
            for(let modifiedInflectionEvent of this.modifiedInflectionEvents) {
                if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length > 0) {
                    const locatorInflectionEvent = new LocalizerOfInflectionAppearingInExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForInflections(neighboringEvent, modifiedInflectionEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.indicesOfInflections.length > 0) {
                    const locatorInflectionEvent = new LocalizerOfInflectionDisappearingInExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForInflections(neighboringEvent, modifiedInflectionEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length === 0) {
                    const locatorInflectionEvent = new LocalizerOfInflectionAppearingInUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForInflections(neighboringEvent, modifiedInflectionEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.indicesOfInflections.length === 0) {
                    const locatorInflectionEvent = new LocalizerOfInflectionDisappearingInUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForInflections(neighboringEvent, modifiedInflectionEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === TWO_INFLECTIONS_EVENTS_APPEAR) {
                    const locatorInflectionEvent = new LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    neighboringEvent.type = NeighboringEventsType.neighboringInflectionsCurvatureExtremumAppear;
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
                    const locatorInflectionEvent = new LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    neighboringEvent.type = NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear;
                    this.neighboringEvents.push(neighboringEvent);
                } else {
                    const error = new ErrorLog(this.constructor.name, "locateNeiboringEventsUnderInflectionEventChanges", "Cannot process the inflection event.");
                    error.logMessageToConsole();
                }
            }
        } else {
            const warning = new WarningLog(this.constructor.name, "locateNeiboringEventsUnderInflectionEventChanges", "No inflection event processed because curvature extrema events are modified too.");
            warning.logMessageToConsole();
        }
    }

    combineLocationAndBehaviorForInflections(neighboringEvent: NeighboringEvents, eventBehavior: number): NeighboringEvents {
        let result = neighboringEvent;
        if(neighboringEvent.type === NeighboringEventsType.neighboringInflectionLeftBoundary && eventBehavior > 0) {
            result.type = NeighboringEventsType.neighboringInflectionLeftBoundaryAppear;
        } else if(neighboringEvent.type === NeighboringEventsType.neighboringInflectionLeftBoundary && eventBehavior < 0) {
            result.type = NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear;
        } else if(neighboringEvent.type === NeighboringEventsType.neighboringInflectionRightBoundary && eventBehavior > 0) {
            result.type = NeighboringEventsType.neighboringInflectionRightBoundaryAppear;
        } else if(neighboringEvent.type === NeighboringEventsType.neighboringInflectionRightBoundary && eventBehavior < 0) {
            result.type = NeighboringEventsType.neighboringInflectionRightBoundaryDisappear;
        } else {
            const error = new ErrorLog(this.constructor.name, "combineLocationAndBehaviorForInflections", "Inconsistent differential event type.");
            error.logMessageToConsole();
        }
        return result;
    }

    locateNeiboringEvents(): void {
        this.modifiedCurvExEvents = [];
        this.modifiedInflectionEvents = [];
        if(Math.abs(this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length()) > 2 ) {
            this.neighboringEvents.push(new NeighboringEvents(NeighboringEventsType.moreThanOneEvent));
            return;
        }
        if(!(this._sequenceDiffEvents1.length() === this._sequenceDiffEvents1.indicesOfInflections.length &&
            this._sequenceDiffEvents2.length() === this._sequenceDiffEvents2.indicesOfInflections.length)) {
            this.locateIntervalAndNumberOfCurvExEventChanges();
        }
        if(this.modifiedCurvExEvents.length === 0) {
            if(this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                // No change in curvature extrema has been identified as well as no change in inflections
                return;
                // no need to process an error to include the comparator into regular optimization configurations
                // const error = new ErrorLog(this.constructor.name, "locateNeiboringEvents", "Inconsistent analysis of lost events in the sequence of differential events.");
                // error.logMessageToConsole();
            }
            this.locateIntervalAndNumberOfInflectionEventChanges();
            this.locateNeiboringEventsUnderInflectionEventChanges();
        } else if(this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
            this.locateNeiboringEventsUnderCurvExEventChanges();
        } else if(this.modifiedCurvExEvents.length === 0 && this.modifiedInflectionEvents.length === 0
            && this._sequenceDiffEvents1.length() === this._sequenceDiffEvents2.length()) {
            const warning = new WarningLog(this.constructor.name, "locateNeiboringEvents", "Cannot process this configuration yet.");
            warning.logMessageToConsole();
        }
    }


    checkConsistencyModifiedEvents(): void {
        this.modifiedCurvExEvents.forEach(element => {
            if(element.indexInflection > 0 && element.indexInflection < this._sequenceDiffEvents1.indicesOfInflections.length) {
                if(element.nbEvents % 2 !== 0) {
                    const message = "The number of differential events appaearing/disappearing in interval [" + this._sequenceDiffEvents1.indicesOfInflections[element.indexInflection - 1]
                    + ", " + this._sequenceDiffEvents1.indicesOfInflections[element.indexInflection] + "] must be even.";
                    const error = new ErrorLog(this.constructor.name, "checkConsistencyModifiedEvents", message);
                    error.logMessageToConsole();
                }
            }
        });
    }

    checkConsistencySumModifiedEvents(): void {
        let sum = 0;
        this.modifiedCurvExEvents.forEach(element => {
            sum += element.nbEvents;
        });
        if(sum !== 0) {
            const error = new ErrorLog(this.constructor.name, "checkConsistencySumModifiedEvents", "The sum of events appearing/disappearing must be null but is not: " + sum);
            error.logMessageToConsole();
        }
    }

    removeAllNeighboringEvents(listNeighboringEvents: Array<NeighboringEvents>): void {
        for(const neighboringEvents of listNeighboringEvents) {
            this.removeNeighboringEvents(neighboringEvents);
        }
    }

    removeNeighboringEvents(neighboringEvents: NeighboringEvents): void {
        let index = INITIAL_INDEX;
        let indexEvent = INITIAL_INDEX;
        for (const events of this.neighboringEvents) {
            index+= 1;
            switch (events.type) {
                case NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear:
                    if(neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear) indexEvent = index;
                    break;
                case NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear:
                    if(neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear) indexEvent = index;
                    break;
                case NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear:
                    if(neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) indexEvent = index;
                    break;
                case NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear:
                    if(neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear) indexEvent = index;
                    break;
                case NeighboringEventsType.neighboringCurvatureExtremaAppear:
                    if(neighboringEvents.type === NeighboringEventsType.neighboringCurvatureExtremaAppear) indexEvent = index;
                    break;
                case NeighboringEventsType.neighboringCurvatureExtremaDisappear:
                    if(neighboringEvents.type === NeighboringEventsType.neighboringCurvatureExtremaDisappear) indexEvent = index;
                    break;
                case NeighboringEventsType.neighboringInflectionLeftBoundaryAppear:
                    if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionLeftBoundaryAppear) indexEvent = index;
                    break;
                case NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear:
                    if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear) indexEvent = index;
                    break;
                case NeighboringEventsType.neighboringInflectionRightBoundaryAppear:
                    if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionRightBoundaryAppear) indexEvent = index;
                    break;
                case NeighboringEventsType.neighboringInflectionRightBoundaryDisappear:
                    if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionRightBoundaryDisappear) indexEvent = index;
                    break;
                case NeighboringEventsType.neighboringInflectionsCurvatureExtremumAppear:
                    if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionsCurvatureExtremumAppear) indexEvent = index;
                    break;
                case NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear:
                    if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear) indexEvent = index;
                    break;
                default:
                    if(neighboringEvents.type === NeighboringEventsType.none) {
                        const warning = new WarningLog(this.constructor.name, "removeNeighboringEvents", "The events to remove are of type 'none'. Inconsistent operation." );
                        warning.logMessageToConsole();
                    }
                    break;
            }
        }
        if(indexEvent === INITIAL_INDEX) {
            const error = new ErrorLog(this.constructor.name, "removeNeighboringEvents", "Inconsistent index found when removing neighboring events from a comparator. Operation cannot be performed.");
            error.logMessageToConsole();
        } else {
            this.neighboringEvents.splice(indexEvent, 1);
        }
    }

    clone(): ComparatorOfSequencesOfDiffEvents {
        const comparator = new ComparatorOfSequencesOfDiffEvents(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
        comparator.neighboringEvents = this.neighboringEvents.slice();
        comparator.modifiedCurvExEvents = this.modifiedCurvExEvents.slice();
        comparator.modifiedInflectionEvents = this.modifiedInflectionEvents.slice();
        return comparator;
    }

    filterOutneighboringEvents(curveShapeSpaceNavigator: CurveShapeSpaceNavigator): ComparatorOfSequencesOfDiffEvents {
        const navigationCurveModel = curveShapeSpaceNavigator.navigationCurveModel;
        const filteredSeqComparator = this.clone();
        const boundaryEnforcer = navigationCurveModel.navigationState.boundaryEnforcer;
        for(const neighboringEvents of this.neighboringEvents) {
            if(neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
                || neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear) {
                if(neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear) {
                    console.log("Curvature extremum disappear on the left boundary.");
                } else {
                    console.log("Curvature extremum appear on the left boundary.");
                }
                if(curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                    boundaryEnforcer.curvExtremumEventAtExtremity.start = true;
                } else {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
                || neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) {
                if(neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear) {
                    console.log("Curvature extremum disappear on the right boundary.");
                } else {
                    console.log("Curvature extremum appear on the right boundary.");
                }
                if(curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                    boundaryEnforcer.curvExtremumEventAtExtremity.end = true;
                } else {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
                console.log("Two Curvature extrema disappear between two inflections or an extreme interval or a unique interval.");
                if(curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                    const curvatureExt1 = filteredSeqComparator.sequenceDiffEvents1.eventAt(neighboringEvents.index);
                    navigationCurveModel.navigationState.transitionEvents.insertAt(curvatureExt1, 0);
                    const curvatureExt2 = filteredSeqComparator.sequenceDiffEvents1.eventAt(neighboringEvents.index + 1);
                    navigationCurveModel.navigationState.transitionEvents.insertAt(curvatureExt2, 1);
                } else {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                console.log("Two Curvature extrema appear between two inflections or an extreme interval or a unique interval.");
                if(curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                    const curvatureExt1 = filteredSeqComparator.sequenceDiffEvents2.eventAt(neighboringEvents.index);
                    navigationCurveModel.navigationState.transitionEvents.insertAt(curvatureExt1, 0);
                    const curvatureExt2 = filteredSeqComparator.sequenceDiffEvents2.eventAt(neighboringEvents.index + 1);
                    navigationCurveModel.navigationState.transitionEvents.insertAt(curvatureExt2, 1);
                } else {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear
                || neighboringEvents.type === NeighboringEventsType.neighboringInflectionsCurvatureExtremumAppear) {
                if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear) {
                    console.log("Two inflections disappear at a curvature extremum.");
                } else {
                    console.log("Two inflections appear at a curvature extremum.");
                }
                if(curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlInflections) {

                } else {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
                || neighboringEvents.type === NeighboringEventsType.neighboringInflectionLeftBoundaryAppear) {
                if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear) {
                    console.log("Inflection disappear on the left boundary.");
                } else {
                    console.log("Inflection appear on the left boundary.");
                }
                if(curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlInflections) {
                    boundaryEnforcer.inflectionEventAtExtremity.start = true;
                } else {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
                || neighboringEvents.type === NeighboringEventsType.neighboringInflectionRightBoundaryAppear) {
                if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionRightBoundaryDisappear) {
                    console.log("Inflection disappear on the right boundary.");
                } else {
                    console.log("Inflection appear on the right boundary.");
                }
                if(curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlInflections) {
                    boundaryEnforcer.inflectionEventAtExtremity.end = true;
                } else {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            } else {
                const error = new ErrorLog(this.constructor.name, "filterOutneighboringEvents", "Incorrect transition of differential events.");
                error.logMessageToConsole();
            }
        }
        return filteredSeqComparator;
    }
}