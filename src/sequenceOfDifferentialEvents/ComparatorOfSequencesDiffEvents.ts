import { SequenceOfDifferentialEvents } from "./SequenceOfDifferentialEvents";
import { ModifiedCurvatureEvents, ModifiedInflectionEvents } from "./ModifiedCurvatureEvents";
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
                    const modEventInInterval = new ModifiedCurvatureEvents(j, (delta-shift));
                    this.modifiedCurvExEvents.push(modEventInInterval);
                    shift = shift + delta;
                }
            }
            if(this._sequenceDiffEvents1.indicesOfInflections.length > 0 && this.modifiedCurvExEvents.length === 0) {
                // There are inflections and no changes in the first indicesInflectionInit.length intervals -> changes take place in the last interval
                const modEventInInterval = new ModifiedCurvatureEvents(this._sequenceDiffEvents1.indicesOfInflections.length, (this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length()));
                this.modifiedCurvExEvents.push(modEventInInterval);
            }
            if(this._sequenceDiffEvents1.indicesOfInflections.length === 0) {
                // There is no inflexion in the sequence of events -> all events take place in the 'first' interval
                const modEventInInterval = new ModifiedCurvatureEvents(0, (this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length()));
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
        if(sequenceDiffEvents.eventAt(0).order === ORDER_INFLECTION && sequenceDiffEvents.eventAt(1).order === ORDER_CURVATURE_EXTREMUM) {
            const modEventInInterval = new ModifiedInflectionEvents(1, nbModifiedInflections);
            this.modifiedInflectionEvents.push(modEventInInterval);
            modificationOfInflectionEventExist = true;
        }
        if(sequenceDiffEvents.eventAt(sequenceDiffEvents.length() - 1).order === ORDER_INFLECTION 
            && sequenceDiffEvents.eventAt(sequenceDiffEvents.length() - 2).order === ORDER_CURVATURE_EXTREMUM) {
            const modEventInInterval = new ModifiedInflectionEvents(sequenceDiffEvents.length(), nbModifiedInflections);
            this.modifiedInflectionEvents.push(modEventInInterval);
            modificationOfInflectionEventExist = true;
        } 
        if(!modificationOfInflectionEventExist) {
            throw new Error("Inconsistent variation of sequences of differential events.");
        }
    }

    setModifedInflectionEventsAjacentToCurvEx(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, nbModifiedInflections: number):void {
            if(sequenceDiffEvents2.indicesOfInflections[0] < sequenceDiffEvents1.indicesOfInflections[0]) {
                const nbCurvExFirstInterval = sequenceDiffEvents1.indicesOfInflections[0];
                const nbCurvExLastInterval = (sequenceDiffEvents1.length() - 1) - sequenceDiffEvents1.indicesOfInflections[sequenceDiffEvents1.indicesOfInflections.length - 1];
                if(sequenceDiffEvents2.eventAt(nbCurvExFirstInterval + 1).order === ORDER_INFLECTION &&
                sequenceDiffEvents2.eventAt(sequenceDiffEvents2.length() - nbCurvExLastInterval).order === ORDER_INFLECTION) {
                    if(nbModifiedInflections > 0) {
                        this.setModifedInflectionEventInExtremeInterval(sequenceDiffEvents2, ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL);
                    } else {
                        this.setModifedInflectionEventInExtremeInterval(sequenceDiffEvents2, ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL);
                    }
                    return;
                } else {
                    throw new Error("Inconsistent distribution of differential events.")
                }
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
                    throw new Error("Inconsistent number of curvature extrema. There must be one, at least.");
                }
            } else if(nbModifiedInflections === TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
                if(nbCurvExtrema2  > 0) {
                    this.setModifedInflectionEventsAjacentToCurvEx(this._sequenceDiffEvents2, this._sequenceDiffEvents1, nbModifiedInflections);
                } else {
                    throw new Error("Inconsistent number of curvature extrema. There must be one, at least.");
                }
            }
        }
    }

    locateNeiboringEvents(): void {
        this.locateIntervalAndNumberOfCurvExEventChanges();
        if(this.modifiedCurvExEvents.length === 0) {
            if(this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                // No change in curvature extrema has been identified as well as no change in inflections
                throw new Error("Inconsistent analysis of lost events in the sequence of differential events.");
            }
            this.locateIntervalAndNumberOfInflectionEventChanges();
            for(let modifiedInflectionEvent of this.modifiedInflectionEvents) {
                if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.length() > 0) {
                    let locatorInflectionEvent = new LocalizerOfInflectionAppearingInExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.length() > 0) {
                    let locatorInflectionEvent = new LocalizerOfInflectionDisappearingInExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.length() === 0) {
                    let locatorInflectionEvent = new LocalizerOfInflectionAppearingInUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.length() === 0) {
                    let locatorInflectionEvent = new LocalizerOfInflectionDisappearingInUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === TWO_INFLECTIONS_EVENTS_APPEAR) {
                    let locatorInflectionEvent = new LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else if(modifiedInflectionEvent.nbEvents === TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
                    let locatorInflectionEvent = new LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorInflectionEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else {
                    console.log("Cannot process the inflection event.")
                }
            }
        } else if(this.modifiedCurvExEvents.length === 1) {
            this._sequenceDiffEvents1.checkConsistencyIntervalBtwInflections(this.modifiedCurvExEvents[0]);
            if(this.modifiedCurvExEvents[0].nbEvents === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                if(this._sequenceDiffEvents1.indicesOfInflections.length === 0) {
                    let locatorCurvatureEvent = new LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else {
                    // Because there is only one event appearing and this event is of type curvature extremum, it can take place either in the first or in the last interval
                    let locatorCurvatureEvent = new LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2, this.modifiedCurvExEvents[0].indexInflection);
                    let neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                }
            }
            else if(this.modifiedCurvExEvents[0].nbEvents === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                if(this._sequenceDiffEvents2.indicesOfInflections.length === 0) {
                    let locatorCurvatureEvent = new LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    let neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                } else {
                    // Because there is only one event appearing and this event is of type curvature extremum, it can take place either in the first or in the last interval
                    let locatorCurvatureEvent = new LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2, this.modifiedCurvExEvents[0].indexInflection);
                    let neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateDifferentialEvents();
                    this.neighboringEvents.push(neighboringEvent);
                }
            }
            else if(this.modifiedCurvExEvents[0].nbEvents === TWO_CURVEXT_EVENTS_APPEAR && this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                // There are only two events appearing and these events are of type curvature extremum. They take place in the first or in the last intervals 
                // or between two consecutive inflections
                let locatorCurvEventAppearing = new LocalizerOfCurvatureExtremaAppearing(this._sequenceDiffEvents1, this._sequenceDiffEvents2, this.modifiedCurvExEvents[0].indexInflection);
                let neighboringEvent: NeighboringEvents = locatorCurvEventAppearing.locateDifferentialEvents();
                this.neighboringEvents.push(neighboringEvent);
            }
            else if(this.modifiedCurvExEvents[0].nbEvents === TWO_CURVEXT_EVENTS_DISAPPEAR && this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                // There are only two events disappearing and these events are of type curvature extremum. They take place in the first or in the last intervals 
                // or between two consecutive inflections
                let locatorCurvEventDisappearing = new LocalizerOfCurvatureExtremaDisappearing(this._sequenceDiffEvents1, this._sequenceDiffEvents2, this.modifiedCurvExEvents[0].indexInflection);
                let neighboringEvent: NeighboringEvents = locatorCurvEventDisappearing.locateDifferentialEvents();
                this.neighboringEvents.push(neighboringEvent);
            }
        }
        else if(this.modifiedCurvExEvents.length === 2) {
            // to do: multiple events occuring at the same time
        }

    }


    checkConsistencyModifiedEvents(): void {
        this.modifiedCurvExEvents.forEach(element => {
            if(element.indexInflection > 0 && element.indexInflection < this._sequenceDiffEvents1.indicesOfInflections.length) {
                if(element.nbEvents % 2 !== 0) {
                    throw new Error("The number of differential events appaearing/disappearing in interval [" + this._sequenceDiffEvents1.indicesOfInflections[element.indexInflection - 1]
                    + ", " + this._sequenceDiffEvents1.indicesOfInflections[element.indexInflection] + "] must be even.");
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
            throw new Error("The sum of events appearing/disappearing must be null but is not: " + sum);
        }
    }

}