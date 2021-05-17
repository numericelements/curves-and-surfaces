import { SequenceOfDifferentialEvents } from "./SequenceOfDifferentialEvents";
import { ModifiedCurvatureEvents } from "./ModifiedCurvatureEvents";
import { NeighboringEvents, NeighboringEventsType } from "./NeighboringEvents";
import { SequenceOfIntervals } from "./SequenceOfIntervals";
import { ComparatorOfSequencesOfIntervals } from "./ComparatorOfSequencesOfIntervals";
import { LocalizerOfCurvatureExtremaAppearing, 
        LocalizerOfCurvatureExtremaDisappearing,
        LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval,
        LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval,
        LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval,
        LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval } from "./LocalizerOfDifferentialEvents";


export const UPPER_BOUND_CURVE_INTERVAL = 1.0;
export const LOWER_BOUND_CURVE_INTERVAL = 0.0;
export const CURVE_INTERVAL_SPAN = UPPER_BOUND_CURVE_INTERVAL - LOWER_BOUND_CURVE_INTERVAL;

export const RETURN_ERROR_CODE = -1;

export const ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL = 1;
export const ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL = -1;
export const TWO_CURVEXT_EVENTS_APPEAR = 2;
export const TWO_CURVEXT_EVENTS_DISAPPEAR = -2;
export const ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL = -1;


/**
 * Compare the sequences of differential events _sequenceDiffEvents1 and _sequenceDiffEvents2 to look for curvature extrema changes (appearing/disappearing)
 * when the number of inflections is identical in each sequence:
 * @returns : array of ModifiedCurvatureEvents where each interval is defined by two successive inflections. 
 * This interval is characterized by the right inflection identified by its INDEX in the array of indices of inflections found in _sequenceDiffEvents1. 
 * When event changes occur in the last interval of _sequenceDiffEvents1, i.e., after the last inflection of this sequence, the right bound of this interval 
 * is set to: indicesInflection1.length (the number inflections + 1).
 */
export class ComparatorOfSequencesOfDiffEvents {

    private _sequenceDiffEvents1: SequenceOfDifferentialEvents;
    private _sequenceDiffEvents2: SequenceOfDifferentialEvents;
    public modifiedEvents: Array<ModifiedCurvatureEvents> = [];
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

    locateIntervalAndNumberOfEventChanges(): Array<ModifiedCurvatureEvents> {
        if(this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
            let shift = 0;
            for(let j = 0; j < this._sequenceDiffEvents1.indicesOfInflections.length; j += 1) {
                const delta = this._sequenceDiffEvents1.indicesOfInflections[j] - this._sequenceDiffEvents2.indicesOfInflections[j];
                if(delta !== shift) {
                    const modEventInInterval = new ModifiedCurvatureEvents(j, (delta-shift));
                    this.modifiedEvents.push(modEventInInterval);
                    shift = shift + delta;
                }
            }
            if(this._sequenceDiffEvents1.indicesOfInflections.length > 0 && this.modifiedEvents.length === 0) {
                // There are inflections and no changes in the first indicesInflectionInit.length intervals -> changes take place in the last interval
                const modEventInInterval = new ModifiedCurvatureEvents(this._sequenceDiffEvents1.indicesOfInflections.length, (this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length()));
                this.modifiedEvents.push(modEventInInterval);
            }
            if(this._sequenceDiffEvents1.indicesOfInflections.length === 0) {
                // There is no inflexion in the sequence of events -> all events take place in the 'first' interval
                const modEventInInterval = new ModifiedCurvatureEvents(0, (this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length()));
                this.modifiedEvents.push(modEventInInterval);
            }
        }
        if(this._sequenceDiffEvents1.length() === this._sequenceDiffEvents2.length() && this._sequenceDiffEvents1.indicesOfInflections.length > 0) {
            this.checkConsistencySumModifiedEvents();
        }
        this.checkConsistencyModifiedEvents();

        return this.modifiedEvents;
    }

    locateNeiboringEvents(): void {
        this.modifiedEvents = this.locateIntervalAndNumberOfEventChanges();
        if(this.modifiedEvents.length === 0) {
            if(this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                // No change in curvature extrema has been identified as well as no change in inflections
                throw new Error("Inconsistent analysis of lost events in the sequence of differential events.");
            } else if (this._sequenceDiffEvents1.indicesOfInflections.length - this._sequenceDiffEvents2.indicesOfInflections.length === ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL
                    && this._sequenceDiffEvents2.indicesOfInflections.length === 0) {

            }
            else {
                // Changes in curvature extrema and/or inflections have taken place but have not been identified
                throw new Error("Error when comparing the sequences of events. Some changes occured but where not correctly identified.");
            }

        } else if(this.modifiedEvents.length === 1) {
            this._sequenceDiffEvents1.checkConsistencyIntervalBtwInflections(this.modifiedEvents[0]);
            if(this.modifiedEvents[0].nbEvents === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                if(this._sequenceDiffEvents1.indicesOfInflections.length === 0) {
                    let locatorCurvatureEvent = new LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2, this.modifiedEvents[0].indexInflection);
                    let neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateCurvatureExtremumInsideUniqueInterval();
                    this.neighboringEvents.push(neighboringEvent);
                } else {
                    // Because there is only one event appearing and this event is of type curvature extremum, it can take place either in the first or in the last interval
                    let locatorCurvatureEvent = new LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2, this.modifiedEvents[0].indexInflection);
                    let neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateCurvatureExtremumInsideExtremeInterval();
                    this.neighboringEvents.push(neighboringEvent);
                }
            }
            else if(this.modifiedEvents[0].nbEvents === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                if(this._sequenceDiffEvents2.indicesOfInflections.length === 0) {
                    let locatorCurvatureEvent = new LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2, this.modifiedEvents[0].indexInflection);
                    let neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateCurvatureExtremumInsideUniqueInterval();
                    this.neighboringEvents.push(neighboringEvent);
                } else {
                    // Because there is only one event appearing and this event is of type curvature extremum, it can take place either in the first or in the last interval
                    let locatorCurvatureEvent = new LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2, this.modifiedEvents[0].indexInflection);
                    let neighboringEvent: NeighboringEvents = locatorCurvatureEvent.locateCurvatureExtremumInsideExtremeInterval();
                    this.neighboringEvents.push(neighboringEvent);
                }
            }
            else if(this.modifiedEvents[0].nbEvents === TWO_CURVEXT_EVENTS_APPEAR && this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                // There are only two events appearing and these events are of type curvature extremum. They take place in the first or in the last intervals 
                // or between two consecutive inflections
                let locatorCurvEventAppearing = new LocalizerOfCurvatureExtremaAppearing(this._sequenceDiffEvents1, this._sequenceDiffEvents2, this.modifiedEvents[0].indexInflection);
                let neighboringEvent: NeighboringEvents = locatorCurvEventAppearing.locateCurvatureExtremaBetweenInflections();
                this.neighboringEvents.push(neighboringEvent);
            }
            else if(this.modifiedEvents[0].nbEvents === TWO_CURVEXT_EVENTS_DISAPPEAR && this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                // There are only two events disappearing and these events are of type curvature extremum. They take place in the first or in the last intervals 
                // or between two consecutive inflections
                let locatorCurvEventDisappearing = new LocalizerOfCurvatureExtremaDisappearing(this._sequenceDiffEvents1, this._sequenceDiffEvents2, this.modifiedEvents[0].indexInflection);
                let neighboringEvent: NeighboringEvents = locatorCurvEventDisappearing.locateCurvatureExtremaBetweenInflections();
                this.neighboringEvents.push(neighboringEvent);
            }
        }
        else if(this.modifiedEvents.length === 2) {
            // to do: multiple events occuring at the same time
        }

    }


    checkConsistencyModifiedEvents(): void {
        this.modifiedEvents.forEach(element => {
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
        this.modifiedEvents.forEach(element => {
            sum += element.nbEvents;
        });
        if(sum !== 0) {
            throw new Error("The sum of events appearing/disappearing must be null but is not: " + sum);
        }
    }

}