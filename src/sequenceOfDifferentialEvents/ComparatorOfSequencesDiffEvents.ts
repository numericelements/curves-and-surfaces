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
            for(let modifiedCurvExEvent of this.modifiedCurvExEvents) {
                this._sequenceDiffEvents1.checkConsistencyIntervalBtwInflections(modifiedCurvExEvent);
                if(modifiedCurvExEvent.nbEvents === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length === 0) {
                    const locatorCurvatureEvent = new LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedCurvExEvent.nbEvents === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.indicesOfInflections.length === 0) {
                    const locatorCurvatureEvent = new LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedCurvExEvent.nbEvents === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length > 0) {
                    // Because there is only one event appearing and this event is of type curvature extremum, it can take place either in the first or in the last interval
                    const locatorCurvatureEvent = new LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2, modifiedCurvExEvent.indexInflection);
                    let neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedCurvExEvent.nbEvents === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.indicesOfInflections.length > 0){
                    // Because there is only one event appearing and this event is of type curvature extremum, it can take place either in the first or in the last interval
                    const locatorCurvatureEvent = new LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2, modifiedCurvExEvent.indexInflection);
                    let neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedCurvExEvent.nbEvents === TWO_CURVEXT_EVENTS_APPEAR) {
                    const locatorCurvEventAppearing = new LocalizerOfCurvatureExtremaAppearing(this._sequenceDiffEvents1, this._sequenceDiffEvents2, modifiedCurvExEvent.indexInflection);
                    let neighboringEvent: NeighboringEvents = locatorCurvEventAppearing.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedCurvExEvent.nbEvents === TWO_CURVEXT_EVENTS_DISAPPEAR) {
                    const locatorCurvEventDisappearing = new LocalizerOfCurvatureExtremaDisappearing(this._sequenceDiffEvents1, this._sequenceDiffEvents2, modifiedCurvExEvent.indexInflection);
                    let neighboringEvent: NeighboringEvents = locatorCurvEventDisappearing.locateDifferentialEvents();
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

    locateNeiboringEventsUnderInflectionEventChanges(): void {
        const nbEventsModified = this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length();
        const nbInflectionsModified = this._sequenceDiffEvents1.indicesOfInflections.length - this._sequenceDiffEvents2.indicesOfInflections.length;
        if(nbEventsModified === nbInflectionsModified) {
            for(let modifiedInflectionEvent of this.modifiedInflectionEvents) {
                if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length > 0) {
                    const locatorInflectionEvent = new LocalizerOfInflectionAppearingInExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.indicesOfInflections.length > 0) {
                    const locatorInflectionEvent = new LocalizerOfInflectionDisappearingInExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length === 0) {
                    const locatorInflectionEvent = new LocalizerOfInflectionAppearingInUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.indicesOfInflections.length === 0) {
                    const locatorInflectionEvent = new LocalizerOfInflectionDisappearingInUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === TWO_INFLECTIONS_EVENTS_APPEAR) {
                    const locatorInflectionEvent = new LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
                    const locatorInflectionEvent = new LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
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

    locateNeiboringEvents(): void {
        this.modifiedCurvExEvents = [];
        this.modifiedInflectionEvents = [];
        this.locateIntervalAndNumberOfCurvExEventChanges();
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
        }
        else if(this.modifiedCurvExEvents.length === 0 && this.modifiedInflectionEvents.length === 0
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

}