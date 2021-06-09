import { SequenceOfDifferentialEvents } from "./SequenceOfDifferentialEvents";
import { SequenceOfIntervals } from "./SequenceOfIntervals";
import { ComparatorOfSequencesOfIntervals } from "./ComparatorOfSequencesOfIntervals";
import { NeighboringEvents } from "./NeighboringEvents";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";

/* named constants */
import { ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL, 
        ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL,
        ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL,
        TWO_CURVEXT_EVENTS_APPEAR,
        TWO_CURVEXT_EVENTS_DISAPPEAR,
        TWO_INFLECTIONS_EVENTS_APPEAR,
        TWO_INFLECTIONS_EVENTS_DISAPPEAR,
        UPPER_BOUND_CURVE_INTERVAL
        } from "./ComparatorOfSequencesDiffEvents";
import { INITIAL_INTERV_INDEX,
        NeighboringEventsType
         } from "./NeighboringEvents";

import { MaxIntervalVariation } from "./MaxIntervalVariation";
import { ORDER_INFLECTION } from "./DifferentialEvent";

export enum intervalLocation {first, last}

export abstract class LocalizerOfDifferentialEvents {

    protected sequenceDiffEvents1: SequenceOfDifferentialEvents;
    protected sequenceDiffEvents2: SequenceOfDifferentialEvents;
    protected location: number;

    /**
     * Localize the differential events modifications in the sequence sequenceDiffEvents1, i.e., before optimization
     * @param sequenceDiffEvents1 : diffrential event sequence before the optimization
     * @param sequenceDiffEvents2 : differential event sequence after the optimization
     * @param indexInflection : definition of the interval of sequenceDiffEvents1 where the events get modified.
     *      It is the right bound of the interval characterized by the inflection located there, if any. This 
     *      inflection is defined by its INDEX in the sequence of inflections attached to the sequence of differential events.
     *      If the right bound is the right hand side of the interval, indexInflection contains the length of the
     *      inflection sequence
     */

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexInflection: number) {
        this.sequenceDiffEvents1 = sequenceDiffEvents1;
        this.sequenceDiffEvents2 = sequenceDiffEvents2;
        this.location = indexInflection;
    }

    abstract locateDifferentialEvents(): NeighboringEvents;

}

export abstract class LocalizerOfCurvatureExtremumInsideExtremeInterval extends LocalizerOfDifferentialEvents {

    protected intervalsBtwExtrema1: SequenceOfIntervals;
    protected intervalsBtwExtrema2: SequenceOfIntervals;
    protected comparatorSequenceOfIntervals: ComparatorOfSequencesOfIntervals;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexInflection: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        if(this.sequenceDiffEvents1.indicesOfInflections.length === 0) {
            let error = new ErrorLog(this.constructor.name, "constructor", "This class is inapropriate to handle the sequence 'sequence1' of differential events input.");
            error.logMessageToConsole();
        } else if(this.sequenceDiffEvents2.indicesOfInflections.length === 0) {
            let error = new ErrorLog(this.constructor.name, "constructor", "This class is inapropriate to handle the sequence 'sequence2' of differential events input.");
            error.logMessageToConsole();
        }
        this.intervalsBtwExtrema1 = this.sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(this.location);
        this.intervalsBtwExtrema2 = this.sequenceDiffEvents2.computeIntervalsBtwCurvatureExtrema(this.location);
        this.comparatorSequenceOfIntervals = new ComparatorOfSequencesOfIntervals(this.intervalsBtwExtrema1, this.intervalsBtwExtrema2);
    }

    abstract locateDifferentialEvents(): NeighboringEvents;

    assignNewEventInExtremeInterval(sequenceDiffEvents: SequenceOfDifferentialEvents, candidateEventIndex: number, indexMaxInterVar: number, nbEventsModified: number): NeighboringEvents {
        let newEvent= new NeighboringEvents();
        if(this.location === sequenceDiffEvents.indicesOfInflections.length && nbEventsModified === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
            if(candidateEventIndex !== INITIAL_INTERV_INDEX && (candidateEventIndex !== this.intervalsBtwExtrema2.sequence.length - 1 || indexMaxInterVar !== this.intervalsBtwExtrema2.sequence.length - 1)) {
                /* Temporary statement. Should evolve to decide whether to process it as an error or not */
                // newEvent.type = NeighboringEventsType.none;
                console.log("A first evaluation of intervals between events shows that the event identified may be inconsistent.")
            }
            newEvent.type = NeighboringEventsType.neighboringCurExtremumRightBoundary;
            newEvent.index = sequenceDiffEvents.sequence.length - 1;
        } else if(this.location === sequenceDiffEvents.indicesOfInflections.length && nbEventsModified === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
            if(candidateEventIndex !== INITIAL_INTERV_INDEX && (candidateEventIndex !== this.intervalsBtwExtrema1.sequence.length - 1 || indexMaxInterVar !== this.intervalsBtwExtrema1.sequence.length - 1)) {
                /* Temporary statement. Should evolve to decide whether to process it as an error or not */
                // newEvent.type = NeighboringEventsType.none;
                console.log("A first evaluation of intervals between events shows that the event identified may be inconsistent.")
            }
            newEvent.type = NeighboringEventsType.neighboringCurExtremumRightBoundary;
            newEvent.index = sequenceDiffEvents.sequence.length - 1;
        } else {
            if(candidateEventIndex !== INITIAL_INTERV_INDEX && (candidateEventIndex !== 0 || indexMaxInterVar !== 0)) {
                /* Temporary statement. Should evolve to decide whether to process it as an error or not */
                // newEvent.type = NeighboringEventsType.none;
                console.log("A first evaluation of intervals between events shows that the event identified may be inconsistent.")
            }
            newEvent.type = NeighboringEventsType.neighboringCurExtremumLeftBoundary;
            newEvent.index = 0;
        }
        return newEvent;
    }

    analyzeExtremeIntervalVariations(nbEventsModified: number): number {
        let modifiedEventIndex = INITIAL_INTERV_INDEX;
        let ratio = 0.0;
        this.checkIndexConsistency(this.location);
        if(this.intervalsBtwExtrema2.sequence.length > 0 && nbEventsModified === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
            if(this.location === this.sequenceDiffEvents1.indicesOfInflections.length) {
                ratio = this.variationOfExtremeInterval(intervalLocation.last, ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
                modifiedEventIndex = this.intervalsBtwExtrema1.sequence.length - 1;
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderForwardScan(modifiedEventIndex - 1, ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
            } else if(this.location === 0) {
                ratio = this.variationOfExtremeInterval(intervalLocation.first, ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
                modifiedEventIndex = 0;
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderReverseScan(modifiedEventIndex, ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
            }
            if(this.comparatorSequenceOfIntervals.maxVariationInSeq1.value > ratio) {
                modifiedEventIndex = this.comparatorSequenceOfIntervals.maxVariationInSeq1.index;
            }
        } else if(nbEventsModified === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
            if(this.location === this.sequenceDiffEvents1.indicesOfInflections.length) {
                modifiedEventIndex = this.intervalsBtwExtrema1.sequence.length - 1;
            } else modifiedEventIndex = 0;
        } else if(this.intervalsBtwExtrema1.sequence.length > 0 && nbEventsModified === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
            if(this.location === this.sequenceDiffEvents1.indicesOfInflections.length) {
                ratio = this.variationOfExtremeInterval(intervalLocation.last, ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
                modifiedEventIndex = this.intervalsBtwExtrema2.sequence.length - 1; // a voir
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderForwardScan(modifiedEventIndex - 1, ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
            } else if(this.location === 0) {
                ratio = this.variationOfExtremeInterval(intervalLocation.first, ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
                modifiedEventIndex = 0;
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderReverseScan(modifiedEventIndex, ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
            }
            if(this.comparatorSequenceOfIntervals.maxVariationInSeq1.value > ratio) {
                modifiedEventIndex = this.comparatorSequenceOfIntervals.maxVariationInSeq1.index;
            }
        } else if(nbEventsModified === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
            if(this.location === this.sequenceDiffEvents1.indicesOfInflections.length) {
                modifiedEventIndex = this.intervalsBtwExtrema2.sequence.length - 1;
            } else modifiedEventIndex = 0;
        }
        return modifiedEventIndex;
    }

    variationOfExtremeInterval(interval: intervalLocation, nbEventsModified: number): number {
        let ratio = 0.0;
        if(nbEventsModified === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
            if(interval === intervalLocation.last) {
                ratio = (this.intervalsBtwExtrema2.sequence[this.intervalsBtwExtrema2.sequence.length - 1]/this.intervalsBtwExtrema2.span)/(this.intervalsBtwExtrema1.sequence[this.intervalsBtwExtrema1.sequence.length - 1]/this.intervalsBtwExtrema1.span);
            } else if(interval === intervalLocation.first) {
                ratio = (this.intervalsBtwExtrema2.sequence[0]/this.intervalsBtwExtrema2.span)/(this.intervalsBtwExtrema1.sequence[0]/this.intervalsBtwExtrema1.span);
            }
        } else if(nbEventsModified === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
            if(interval === intervalLocation.last) {
                ratio = (this.intervalsBtwExtrema1.sequence[this.intervalsBtwExtrema1.sequence.length - 1]/this.intervalsBtwExtrema1.span)/(this.intervalsBtwExtrema2.sequence[this.intervalsBtwExtrema2.sequence.length - 1]/this.intervalsBtwExtrema2.span);
            } else if(interval === intervalLocation.first) {
                ratio = (this.intervalsBtwExtrema1.sequence[0]/this.intervalsBtwExtrema1.span)/(this.intervalsBtwExtrema2.sequence[0]/this.intervalsBtwExtrema2.span);
            }
        }
        return ratio;
    }

    checkIndexConsistency(indexInflection: number): void {
        if((indexInflection !== this.sequenceDiffEvents1.indicesOfInflections.length && indexInflection !== 0 && this.sequenceDiffEvents1.indicesOfInflections.length > 0)
        || (indexInflection !== 0 && this.sequenceDiffEvents1.indicesOfInflections.length === 0)) {
            const error = new ErrorLog(this.constructor.name, "checkIndexConsistency", "Index of inflection in the sequence of differerntial events is invalid.");
            error.logMessageToConsole();
        }
    }

}

export class LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval extends LocalizerOfCurvatureExtremumInsideExtremeInterval {

    private candidateEventIndex: number;
    private ONE_EVENT_APPEAR = ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexInflection: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.candidateEventIndex = this.intervalsBtwExtrema2.indexSmallestInterval(this.ONE_EVENT_APPEAR);
    }

    locateDifferentialEvents(): NeighboringEvents {
        let indexMaxInterVar = this.analyzeExtremeIntervalVariations(this.ONE_EVENT_APPEAR);
        return this.assignNewEventInExtremeInterval(this.sequenceDiffEvents2, this.candidateEventIndex, indexMaxInterVar, this.ONE_EVENT_APPEAR);
    }
}

export class LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval extends LocalizerOfCurvatureExtremumInsideExtremeInterval {

    private candidateEventIndex: number;
    private ONE_EVENT_DISAPPEAR = ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexInflection: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.candidateEventIndex = this.intervalsBtwExtrema1.indexSmallestInterval(this.ONE_EVENT_DISAPPEAR);
    }

    locateDifferentialEvents(): NeighboringEvents {
        let indexMaxInterVar = this.analyzeExtremeIntervalVariations(this.ONE_EVENT_DISAPPEAR);
        return this.assignNewEventInExtremeInterval(this.sequenceDiffEvents1, this.candidateEventIndex, indexMaxInterVar, this.ONE_EVENT_DISAPPEAR);
    }
}


export abstract class LocalizerOfCurvatureExtremumInsideUniqueInterval extends LocalizerOfDifferentialEvents {

    protected intervalsBtwExtrema1: SequenceOfIntervals;
    protected intervalsBtwExtrema2: SequenceOfIntervals;
    protected comparatorSequenceOfIntervals: ComparatorOfSequencesOfIntervals;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents) {
        const indexInflection = 0;
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        if(this.sequenceDiffEvents1.indicesOfInflections.length !== 0) {
            let error = new ErrorLog(this.constructor.name, "constructor", "This class is inapropriate to handle the sequence 'sequence1' of differential events input.");
            error.logMessageToConsole();
        } else if(this.sequenceDiffEvents2.indicesOfInflections.length !== 0) {
            let error = new ErrorLog(this.constructor.name, "constructor", "This class is inapropriate to handle the sequence 'sequence2' of differential events input.");
            error.logMessageToConsole();
        }
        this.intervalsBtwExtrema1 = this.sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(this.location);
        this.intervalsBtwExtrema2 = this.sequenceDiffEvents2.computeIntervalsBtwCurvatureExtrema(this.location);
        this.comparatorSequenceOfIntervals = new ComparatorOfSequencesOfIntervals(this.intervalsBtwExtrema1, this.intervalsBtwExtrema2);
    }

    abstract locateDifferentialEvents(): NeighboringEvents;

    assignNewEventInUniqueInterval(sequenceDiffEvents: SequenceOfDifferentialEvents, candidateEventIndex: number, nbEventsModified: number): NeighboringEvents {
        let newEvent= new NeighboringEvents();
        newEvent.type = NeighboringEventsType.none;
        if(candidateEventIndex === 0) {
            newEvent.type = NeighboringEventsType.neighboringCurExtremumLeftBoundary;
            newEvent.index = 0;
        } else if ((candidateEventIndex === this.intervalsBtwExtrema2.sequence.length - 1 && nbEventsModified === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) ||
            (candidateEventIndex === this.intervalsBtwExtrema1.sequence.length - 1 && nbEventsModified === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL)) {
            newEvent.type = NeighboringEventsType.neighboringCurExtremumRightBoundary;
            newEvent.index = sequenceDiffEvents.sequence.length - 1;
        } else {
            newEvent.type = NeighboringEventsType.none;
            newEvent.index = candidateEventIndex;
            const warning = new WarningLog(this.constructor.name, "assignNewEventInUniqueInterval", "Inconsistent identification of curvature extremum. Possibly extremum at a knot.")
            warning.logMessageToConsole();
        }
        return newEvent;
    }

    analyzeUniqueIntervalVariations(candidateEventIndex: number, nbEventsModified: number): number {
        let modifiedEventIndex = INITIAL_INTERV_INDEX;
        let ratioLeft = 0.0, ratioRight = 0.0;
        if((nbEventsModified === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && this.intervalsBtwExtrema1.sequence.length > 0) ||
            (nbEventsModified === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && this.intervalsBtwExtrema2.sequence.length > 0)) {
            ratioLeft = this.variationOfExtremeInterval(intervalLocation.first, nbEventsModified);
            ratioRight = this.variationOfExtremeInterval(intervalLocation.last, nbEventsModified);
            if(ratioLeft > ratioRight) {
                modifiedEventIndex = 0;
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderReverseScan(modifiedEventIndex, ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
                if(this.comparatorSequenceOfIntervals.maxVariationInSeq1.value > ratioLeft) {
                    modifiedEventIndex = this.comparatorSequenceOfIntervals.maxVariationInSeq1.index;
                }
            } else {
                if(nbEventsModified === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
                    modifiedEventIndex = this.intervalsBtwExtrema2.sequence.length - 1;
                } else if(nbEventsModified === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
                    modifiedEventIndex = this.intervalsBtwExtrema1.sequence.length - 1;
                }
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderForwardScan(modifiedEventIndex - 1, ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
                if(this.comparatorSequenceOfIntervals.maxVariationInSeq1.value > ratioRight) {
                    modifiedEventIndex = this.comparatorSequenceOfIntervals.maxVariationInSeq1.index;
                }
            }
        } else if(nbEventsModified !== ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && nbEventsModified !== ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
            const error = new ErrorLog(this.constructor.name, "analyzeUniqueIntervalVariations", "Incorrect number of modified differential events.");
            error.logMessageToConsole();
        } else {
            if(nbEventsModified === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
                modifiedEventIndex = candidateEventIndex;
            } else if(nbEventsModified === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
                modifiedEventIndex = 0;
            }
        }

        if(candidateEventIndex !== INITIAL_INTERV_INDEX) {
            if(this.sequenceDiffEvents1.indicesOfInflections.length === 0) {
                if(modifiedEventIndex === candidateEventIndex) {
                    const warning = new WarningLog(this.constructor.name, "analyzeUniqueIntervalVariations", "Events are stable as well as the candidate event.");
                    warning.logMessageToConsole();
                } else {
                    const warning = new WarningLog(this.constructor.name, "analyzeUniqueIntervalVariations", "Other events variations may influence the decision about the candidate event.");
                    warning.logMessageToConsole();
                    if(!(ratioLeft > ratioRight && candidateEventIndex === 0)) {
                        modifiedEventIndex = 0;
                    } else if(!(ratioLeft < ratioRight && candidateEventIndex === this.intervalsBtwExtrema1.sequence.length - 1) && nbEventsModified === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
                        modifiedEventIndex = this.intervalsBtwExtrema1.sequence.length - 1;
                    } else if(!(ratioLeft < ratioRight && candidateEventIndex === this.intervalsBtwExtrema2.sequence.length - 1) && nbEventsModified === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
                        modifiedEventIndex = this.intervalsBtwExtrema2.sequence.length - 1;
                    }
                }
            }
        } else {
            const error = new ErrorLog(this.constructor.name, "analyzeUniqueIntervalVariations", "Unable to generate the smallest interval of differential events for this curve.");
            error.logMessageToConsole();
        }

        return modifiedEventIndex;
    }

    variationOfExtremeInterval(interval: intervalLocation, nbEventsModified: number): number {
        let ratio = 0.0;
        if(nbEventsModified === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
            if(interval === intervalLocation.last) {
                ratio = (this.intervalsBtwExtrema2.sequence[this.intervalsBtwExtrema2.sequence.length - 1]/this.intervalsBtwExtrema2.span)/(this.intervalsBtwExtrema1.sequence[this.intervalsBtwExtrema1.sequence.length - 1]/this.intervalsBtwExtrema1.span);
            } else if(interval === intervalLocation.first) {
                ratio = (this.intervalsBtwExtrema2.sequence[0]/this.intervalsBtwExtrema2.span)/(this.intervalsBtwExtrema1.sequence[0]/this.intervalsBtwExtrema1.span);
            }
        } else if(nbEventsModified === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
            if(interval === intervalLocation.last) {
                ratio = (this.intervalsBtwExtrema1.sequence[this.intervalsBtwExtrema1.sequence.length - 1]/this.intervalsBtwExtrema1.span)/(this.intervalsBtwExtrema2.sequence[this.intervalsBtwExtrema2.sequence.length - 1]/this.intervalsBtwExtrema2.span);
            } else if(interval === intervalLocation.first) {
                ratio = (this.intervalsBtwExtrema1.sequence[0]/this.intervalsBtwExtrema1.span)/(this.intervalsBtwExtrema2.sequence[0]/this.intervalsBtwExtrema2.span);
            }
        }
        return ratio;
    }
}

export class LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval extends LocalizerOfCurvatureExtremumInsideUniqueInterval {

    private candidateEventIndex: number;
    private ONE_EVENT_APPEAR = ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
        this.candidateEventIndex = this.intervalsBtwExtrema2.indexSmallestInterval(this.ONE_EVENT_APPEAR);
    }

    locateDifferentialEvents(): NeighboringEvents {
        this.candidateEventIndex = this.analyzeUniqueIntervalVariations(this.candidateEventIndex, this.ONE_EVENT_APPEAR);
        return this.assignNewEventInUniqueInterval(this.sequenceDiffEvents2, this.candidateEventIndex, this.ONE_EVENT_APPEAR);
    }
}

export class LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval extends LocalizerOfCurvatureExtremumInsideUniqueInterval {

    private candidateEventIndex: number;
    private ONE_EVENT_DISAPPEAR = ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
        this.candidateEventIndex = this.intervalsBtwExtrema1.indexSmallestInterval(this.ONE_EVENT_DISAPPEAR);
    }

    locateDifferentialEvents(): NeighboringEvents {
        this.candidateEventIndex = this.analyzeUniqueIntervalVariations(this.candidateEventIndex, this.ONE_EVENT_DISAPPEAR);
        return this.assignNewEventInUniqueInterval(this.sequenceDiffEvents1, this.candidateEventIndex, this.ONE_EVENT_DISAPPEAR);
    }
}

export abstract class LocalizerOfCurvatureExtrema extends LocalizerOfDifferentialEvents {
    protected intervalsBtwExtrema1: SequenceOfIntervals;
    protected intervalsBtwExtrema2: SequenceOfIntervals;
    protected comparatorSequenceOfIntervals: ComparatorOfSequencesOfIntervals;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexInflection: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.intervalsBtwExtrema1 = this.sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(this.location);
        this.intervalsBtwExtrema2 = this.sequenceDiffEvents2.computeIntervalsBtwCurvatureExtrema(this.location);
        this.comparatorSequenceOfIntervals = new ComparatorOfSequencesOfIntervals(this.intervalsBtwExtrema1, this.intervalsBtwExtrema2);
    }


    abstract locateDifferentialEvents(): NeighboringEvents;

    assignNewEvent(sequenceDiffEvents: SequenceOfDifferentialEvents, candidateEventIndex: number): NeighboringEvents {
        let newEvent= new NeighboringEvents();
        newEvent.type = NeighboringEventsType.neighboringCurvatureExtrema;
        if(sequenceDiffEvents.indicesOfInflections.length === 0 || this.location === 0) {
            /* JCL To avoid use of incorrect indices */
            if(candidateEventIndex === sequenceDiffEvents.length()) {
                newEvent.index = candidateEventIndex - 2;
                console.log("Probably incorrect identification of events indices close to curve extremity.");
            } else if(candidateEventIndex === INITIAL_INTERV_INDEX) {
                newEvent.index = 0;
                console.log("Probably incorrect identification of events indices close to curve origin.");
            } else {
                /* JCL Set the effectively computed event index*/
                newEvent.index = candidateEventIndex - 1;
            }
        } else if(this.location === sequenceDiffEvents.indicesOfInflections.length) {
            /* JCL To avoid use of incorrect indices */
            if(sequenceDiffEvents.indicesOfInflections[sequenceDiffEvents.indicesOfInflections.length - 1] + candidateEventIndex === sequenceDiffEvents.length() - 1) {
                newEvent.index = sequenceDiffEvents.indicesOfInflections[sequenceDiffEvents.indicesOfInflections.length - 1] + candidateEventIndex - 1;
                console.log("Probably incorrect identification of events indices.");
            } else {
                /* JCL Set the effectively computed event index*/
                newEvent.index = sequenceDiffEvents.indicesOfInflections[sequenceDiffEvents.indicesOfInflections.length - 1] + candidateEventIndex;
            }
        } else {
            newEvent.index = sequenceDiffEvents.indicesOfInflections[this.location - 1] + candidateEventIndex;
        }
        return newEvent;
    }

    analyzeIntervalVariations(candidateEventIndex: number, nbEventsModified: number): number {
        let modifiedEventIndex = candidateEventIndex;
        this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderForwardScan(candidateEventIndex, nbEventsModified);
        let maxRatioF: MaxIntervalVariation = this.comparatorSequenceOfIntervals.maxVariationInSeq1;
        this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderReverseScan(candidateEventIndex, nbEventsModified);
        let maxRatioR: MaxIntervalVariation = this.comparatorSequenceOfIntervals.maxVariationInSeq1;
        if(candidateEventIndex !== INITIAL_INTERV_INDEX) {
            if(this.intervalsBtwExtrema1.sequence.length > 0) {
                if(maxRatioF.index === maxRatioR.index && maxRatioF.index === (candidateEventIndex - 1)) {
                    let warning = new WarningLog(this.constructor.name, "analyzeIntervalVariations", "Events are stable as well as the candidate events.");
                    warning.logMessageToConsole();
                } else if(maxRatioF.index !== (candidateEventIndex - 1) || maxRatioR.index !== (candidateEventIndex - 1)) {
                    let warning = new WarningLog(this.constructor.name, "analyzeIntervalVariations", "The candidate events are not the ones added.");
                    warning.logMessageToConsole();
                    /* Current assumption consists in considering an adjacent interval as candidate */
                    if(maxRatioF.value > maxRatioR.value) {
                        modifiedEventIndex = maxRatioF.index - 1;
                    } else modifiedEventIndex = maxRatioF.index + 1;
                } else {
                    let warning = new WarningLog(this.constructor.name, "analyzeIntervalVariations", "Events are not stable enough.");
                    warning.logMessageToConsole();
                }
            } else {
                /* JCL this.sequenceDiffEvents2 contains two events only that may appear/disappear */
                modifiedEventIndex = 1;
            }
        // This initial code is not adequate for an arbitrary interval between inflection -> should be adapted if the code is needed
        // } else if(nbEventsModified === TWO_CURVEXT_EVENTS_APPEAR) {
        //     console.log("Error when computing smallest interval. Assign arbitrarily interval to 0.");
        //     if(this.sequenceDiffEvents1.indicesOfInflections.length === 0) {
        //         modifiedEventIndex = 1;
        //     } else if(this.location === this.sequenceDiffEvents2.indicesOfInflections.length) {
        //         modifiedEventIndex = this.sequenceDiffEvents2.length() - this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1] - 2;
        //     } else modifiedEventIndex = 0;
        // } else if(nbEventsModified === TWO_CURVEXT_EVENTS_DISAPPEAR) {
        //     console.log("Error when computing smallest interval. Assign arbitrarily interval to 0.");
        //     if(this.sequenceDiffEvents1.indicesOfInflections.length === 0 || this.location === 0) {
        //         modifiedEventIndex = 1;
        //     } else if(this.location === this.sequenceDiffEvents1.indicesOfInflections.length) {
        //         modifiedEventIndex = this.sequenceDiffEvents1.length() - this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1] - 2;
        //     } else modifiedEventIndex = 0;
        } else {
            let error = new ErrorLog(this.constructor.name, "analyzeIntervalVariations", "Incorrect number of modified differential events.");
            error.logMessageToConsole();
        }

        return modifiedEventIndex;
    }

}
export class LocalizerOfCurvatureExtremaAppearing extends LocalizerOfCurvatureExtrema {

    private candidateEventIndex: number;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexInflection: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.candidateEventIndex = this.intervalsBtwExtrema2.indexSmallestInterval(TWO_CURVEXT_EVENTS_APPEAR);
    }

    locateDifferentialEvents(): NeighboringEvents {
        this.candidateEventIndex = this.analyzeIntervalVariations(this.candidateEventIndex, TWO_CURVEXT_EVENTS_APPEAR);
        return this.assignNewEvent(this.sequenceDiffEvents2, this.candidateEventIndex);;
    }
}

export class LocalizerOfCurvatureExtremaDisappearing extends LocalizerOfCurvatureExtrema {

    private candidateEventIndex: number;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexInflection: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.candidateEventIndex = this.intervalsBtwExtrema1.indexSmallestInterval(TWO_CURVEXT_EVENTS_DISAPPEAR);
    }

    locateDifferentialEvents(): NeighboringEvents {
        this.candidateEventIndex = this.analyzeIntervalVariations(this.candidateEventIndex, TWO_CURVEXT_EVENTS_DISAPPEAR);
        return this.assignNewEvent(this.sequenceDiffEvents1, this.candidateEventIndex);
    }
}

export abstract class LocalizerOfInflectionInUniqueInterval extends LocalizerOfDifferentialEvents {

    protected inflectionVariation: number;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents) {
        const index = INITIAL_INTERV_INDEX;
        super(sequenceDiffEvents1, sequenceDiffEvents2, index);
        this.inflectionVariation = this.sequenceDiffEvents1.indicesOfInflections.length - this.sequenceDiffEvents2.indicesOfInflections.length;
    }

    abstract locateDifferentialEvents(): NeighboringEvents;

    analyzeIntervalVariations(sequenceDiffEvents: SequenceOfDifferentialEvents): number {
        let index;
        let intervalExtrema = [];

        if(sequenceDiffEvents.indicesOfInflections.length === 1) {
            if(sequenceDiffEvents.eventAt(0).order === ORDER_INFLECTION) {
                intervalExtrema.push(sequenceDiffEvents.eventAt(0).location);
            } else if(sequenceDiffEvents.eventAt(sequenceDiffEvents.length() - 1).order === ORDER_INFLECTION) {
                intervalExtrema.push(sequenceDiffEvents.eventAt(sequenceDiffEvents.length() - 1).location);
            }
            intervalExtrema.push(UPPER_BOUND_CURVE_INTERVAL - sequenceDiffEvents.eventAt(sequenceDiffEvents.indicesOfInflections[sequenceDiffEvents.indicesOfInflections.length - 1]).location);
        } else {
            let error =  new ErrorLog(this.constructor.name, "analyzeIntervalVariations", "Inconsistent content of the sequence of events to identify the curve extremity where the inflection is lost.");
            error.logMessageToConsole();
        }
        if(intervalExtrema[0] > intervalExtrema[intervalExtrema.length - 1]) {
            index = sequenceDiffEvents.indicesOfInflections[sequenceDiffEvents.indicesOfInflections.length - 1];
            if(sequenceDiffEvents.length() === 1) {
                index = 1;
            }
        } else {
            index = 0;
        }

        return index;
    }
}

export class LocalizerOfInflectionDisappearingInUniqueInterval extends LocalizerOfInflectionInUniqueInterval {

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
    }

    locateDifferentialEvents(): NeighboringEvents {
        let newEvent= new NeighboringEvents();
        if(this.analyzeIntervalVariations(this.sequenceDiffEvents1) === 0 && this.inflectionVariation === 1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEventsType.neighboringInflectionLeftBoundary;
        } else if(this.analyzeIntervalVariations(this.sequenceDiffEvents1) === this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1]) {
            newEvent.index = this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1];
            newEvent.type = NeighboringEventsType.neighboringInflectionRightBoundary;
        } else if(this.analyzeIntervalVariations(this.sequenceDiffEvents1) === 1 && this.sequenceDiffEvents1.length() === 1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEventsType.neighboringInflectionRightBoundary;
        } else {
            let error = new ErrorLog(this.constructor.name, "locateDifferentialEvents", "Inconsistent index to locate an inflection into the unique interval.");
            error.logMessageToConsole();
        }

        return newEvent;
    }
}

export class LocalizerOfInflectionAppearingInUniqueInterval extends LocalizerOfInflectionInUniqueInterval {

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
    }

    locateDifferentialEvents(): NeighboringEvents {
        let newEvent= new NeighboringEvents();
        if(this.analyzeIntervalVariations(this.sequenceDiffEvents2) === 0  && this.inflectionVariation === -1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEventsType.neighboringInflectionLeftBoundary;
        } else if(this.analyzeIntervalVariations(this.sequenceDiffEvents2) === this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1]) {
            newEvent.index = this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1];
            newEvent.type = NeighboringEventsType.neighboringInflectionRightBoundary;
        } else if(this.analyzeIntervalVariations(this.sequenceDiffEvents2) === 1 && this.sequenceDiffEvents2.length() === 1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEventsType.neighboringInflectionRightBoundary;
        } else {
            let error = new ErrorLog(this.constructor.name, "locateDifferentialEvents", "Inconsistent index to locate an inflection into the unique interval.");
            error.logMessageToConsole();
        }

        return newEvent;
    }
}

export abstract class LocalizerOfInflectionInExtremeInterval extends LocalizerOfDifferentialEvents {

    protected inflectionVariation: number;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents) {
        const index = INITIAL_INTERV_INDEX;
        super(sequenceDiffEvents1, sequenceDiffEvents2, index);
        this.inflectionVariation = this.sequenceDiffEvents1.indicesOfInflections.length - this.sequenceDiffEvents2.indicesOfInflections.length;
        if(this.inflectionVariation === 1 && this.sequenceDiffEvents1.indicesOfInflections.length === 1 ||
            this.inflectionVariation === -1 && this.sequenceDiffEvents1.indicesOfInflections.length === 0) {
                let error = new ErrorLog(this.constructor.name, "constructor", "Differential event sequence inadequate for this configuration.");
                error.logMessageToConsole();
            }
    }

    abstract locateDifferentialEvents(): NeighboringEvents;

    analyzeIntervalVariations(): number {
        let index = INITIAL_INTERV_INDEX;
        if(this.sequenceDiffEvents1.eventAt(0).order === ORDER_INFLECTION && this.sequenceDiffEvents2.eventAt(0).order !== ORDER_INFLECTION ||
        this.sequenceDiffEvents2.eventAt(0).order === ORDER_INFLECTION && this.sequenceDiffEvents1.eventAt(0).order !== ORDER_INFLECTION) {
            index = 0;
        } else if(this.sequenceDiffEvents1.eventAt(this.sequenceDiffEvents1.length() - 1).order === ORDER_INFLECTION && this.sequenceDiffEvents2.eventAt(this.sequenceDiffEvents2.length() - 1).order !== ORDER_INFLECTION) {
            index = this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1];
        } else if(this.sequenceDiffEvents2.eventAt(this.sequenceDiffEvents2.length() - 1).order === ORDER_INFLECTION && this.sequenceDiffEvents1.eventAt(this.sequenceDiffEvents1.length() - 1).order !== ORDER_INFLECTION) {
            index = this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1];
        }
        return index;
    }

}

export class LocalizerOfInflectionAppearingInExtremeInterval extends LocalizerOfInflectionInExtremeInterval {

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
    }

    locateDifferentialEvents(): NeighboringEvents {
        let newEvent= new NeighboringEvents();
        if(this.analyzeIntervalVariations() === 0  && this.inflectionVariation === -1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEventsType.neighboringInflectionLeftBoundary;
        } else if(this.analyzeIntervalVariations() === this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1]) {
            newEvent.index = this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1];
            newEvent.type = NeighboringEventsType.neighboringInflectionRightBoundary;
        } else {
            let error = new ErrorLog(this.constructor.name, "locateDifferentialEvents", "Inconsistent index to locate an inflection into an extreme interval.");
            error.logMessageToConsole();
        }

        return newEvent;
    }
}

export class LocalizerOfInflectionDisappearingInExtremeInterval extends LocalizerOfInflectionInExtremeInterval {

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
    }

    locateDifferentialEvents(): NeighboringEvents {
        let newEvent= new NeighboringEvents();
        if(this.analyzeIntervalVariations() === 0  && this.inflectionVariation === 1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEventsType.neighboringInflectionLeftBoundary;
        } else if(this.analyzeIntervalVariations() === this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1]) {
            newEvent.index = this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1];
            newEvent.type = NeighboringEventsType.neighboringInflectionRightBoundary;
        } else {
            let error = new ErrorLog(this.constructor.name, "locateDifferentialEvents", " Inconsistent index to locate an inflection into an extreme interval.");
            error.logMessageToConsole();
        }

        return newEvent;
    }
}

export abstract class LocalizerOfInflectionsAdjacentCurvatureExtremum extends LocalizerOfDifferentialEvents {

    protected indicesOscillations1: number[];
    protected indicesOscillations2: number[];
    protected inflectionVariation: number;


    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexCurveEx: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexCurveEx);
        this.indicesOscillations1 = this.sequenceDiffEvents1.generateIndicesOscillations();
        this.indicesOscillations2 = this.sequenceDiffEvents2.generateIndicesOscillations();
        this.inflectionVariation = this.sequenceDiffEvents1.indicesOfInflections.length - this.sequenceDiffEvents2.indicesOfInflections.length;
    }

    abstract locateDifferentialEvents(): NeighboringEvents;

    analyzeIntervalVariations(indicesOscillations: number[]): number[] {
        let intervalEvent: Array<number> = []
        if(indicesOscillations.length > 0) {
            if(indicesOscillations[0] !== 0) intervalEvent.push(indicesOscillations[0]);
            for(let j = 0; j < indicesOscillations.length - 1; j += 1) {
                intervalEvent.push(indicesOscillations[j + 1] - indicesOscillations[j]);
            }
        }
        this.checkIndexLocation();
        return intervalEvent;
    }

    checkIndexLocation(): void {
        const nbModifedEvents = this.sequenceDiffEvents2.indicesOfInflections.length - this.sequenceDiffEvents1.indicesOfInflections.length;
        if(nbModifedEvents === TWO_INFLECTIONS_EVENTS_APPEAR) {
            if((this.indicesOscillations2.length - this.indicesOscillations1.length !== 1 && this.indicesOscillations2.length === 1) ||
            (this.indicesOscillations2.length - this.indicesOscillations1.length !== 2 && this.indicesOscillations2.length > 1) ||
            (this.indicesOscillations2.length - this.indicesOscillations1.length !== 3 && this.indicesOscillations2.length > 2)) {
                let error = new ErrorLog(this.constructor.name, "checkIndexLocation", "Inconsistency of reference type event that does not coincide with oscillation removal.");
                error.logMessageToConsole();
            }
        } else if (nbModifedEvents === TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
            if((this.indicesOscillations2.length - this.indicesOscillations1.length !== -1 && this.indicesOscillations2.length === 1) ||
            (this.indicesOscillations2.length - this.indicesOscillations1.length !== -2 && this.indicesOscillations2.length > 1) ||
            (this.indicesOscillations2.length - this.indicesOscillations1.length !== -3 && this.indicesOscillations2.length > 2)) {
                let error = new ErrorLog(this.constructor.name, "checkIndexLocation", "Inconsistency of reference type event that does not coincide with oscillation removal.");
                error.logMessageToConsole();
            }
        } else {
            let error = new ErrorLog(this.constructor.name, "checkIndexLocation", "Inconsistent variation of number of differential events.");
            error.logMessageToConsole();
        }
    }

    assignNewEvent(sequenceDiffEvents: SequenceOfDifferentialEvents, nbModifedEvents: number): NeighboringEvents {
        let newEvent= new NeighboringEvents();
        let intervalEvent1: number[] = [];
        let intervalEvent2: number[] = [];
        let indicesOscillations1: number[] = [];
        let indicesOscillations2: number[] = [];
        if(nbModifedEvents === TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
            intervalEvent1 = this.analyzeIntervalVariations(this.indicesOscillations1);
            intervalEvent2 = this.analyzeIntervalVariations(this.indicesOscillations2);
            indicesOscillations1 = this.indicesOscillations1;
            indicesOscillations2 = this.indicesOscillations2;
        } else if(nbModifedEvents === TWO_INFLECTIONS_EVENTS_APPEAR) {
            intervalEvent1 = this.analyzeIntervalVariations(this.indicesOscillations2);
            intervalEvent2 = this.analyzeIntervalVariations(this.indicesOscillations1);
            indicesOscillations1 = this.indicesOscillations2;
            indicesOscillations2 = this.indicesOscillations1;
        } else {
            let error = new ErrorLog(this.constructor.name, "assignNewEvent", "Incorrect number of modified differential events.");
            error.logMessageToConsole();
        }

        if(indicesOscillations1.length > 0) {
            newEvent.type = NeighboringEventsType.neighboringInflectionsCurvatureExtremum;
            if(indicesOscillations2.length === 0) {
                if(indicesOscillations1.length === 1) {
                    newEvent.index = indicesOscillations1[0];
                } else if(indicesOscillations1.length === 2) {
                    if(sequenceDiffEvents.eventAt(indicesOscillations1[0]).order === ORDER_INFLECTION) {
                        newEvent.index = indicesOscillations1[1];
                    } else {
                        newEvent.index = indicesOscillations1[0];
                    }
                } else if(indicesOscillations1.length === 3) {
                    if(sequenceDiffEvents.eventAt(indicesOscillations1[0]).order === ORDER_INFLECTION &&
                    sequenceDiffEvents.eventAt(indicesOscillations1[1]).order !== ORDER_INFLECTION) {
                        newEvent.index = indicesOscillations1[1];
                    }
                }
            } else {
                newEvent.index = INITIAL_INTERV_INDEX;
                for(let k = 0; k < intervalEvent2.length; k += 1) {
                    if(intervalEvent1[k] !== intervalEvent2[k]) {
                        newEvent.index = indicesOscillations1[k];
                    }
                }
                if(indicesOscillations1.length - indicesOscillations2.length === 2 && newEvent.index === INITIAL_INTERV_INDEX) {
                    newEvent.index = indicesOscillations1[indicesOscillations1.length - 1];
                }
            }
        }
        return newEvent;
    }

}

export class LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum extends LocalizerOfInflectionsAdjacentCurvatureExtremum {


    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexCurveEx: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexCurveEx);
    }

    locateDifferentialEvents(): NeighboringEvents {
        return this.assignNewEvent(this.sequenceDiffEvents2, TWO_INFLECTIONS_EVENTS_DISAPPEAR);
    }
}

export class LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum extends LocalizerOfInflectionsAdjacentCurvatureExtremum {


    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexCurveEx: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexCurveEx);
    }

    locateDifferentialEvents(): NeighboringEvents {
        return this.assignNewEvent(this.sequenceDiffEvents1, TWO_INFLECTIONS_EVENTS_APPEAR);
    }
}