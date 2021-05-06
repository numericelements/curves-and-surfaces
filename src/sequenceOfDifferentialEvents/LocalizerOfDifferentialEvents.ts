import { SequenceOfDifferentialEvents } from "./SequenceOfDifferentialEvents";
import { SequenceOfIntervals } from "./SequenceOfIntervals";
import { ComparatorOfSequencesOfIntervals } from "./ComparatorOfSequencesOfIntervals";
import { NeighboringEvents } from "./NeighboringEvents";

/* named constants */
import { ONE_CURVEXT_EVENT_APPEAR_IN_FIRST_OR_LAST_INTERVAL } from "./ComparatorOfSequencesDiffEvents";
import { TWO_CURVEXT_EVENTS_APPEAR } from "./ComparatorOfSequencesDiffEvents";
import { TWO_CURVEXT_EVENTS_DISAPPEAR } from "./ComparatorOfSequencesDiffEvents";
import { INITIAL_INTERV_INDEX } from "./NeighboringEvents";

import { NeighboringEventsType } from "./NeighboringEvents";
import { MaxIntervalVariation } from "./MaxIntervalVariation";

export class LocalizerOfDifferentialEvents {

    protected sequenceDiffEvents1: SequenceOfDifferentialEvents;
    protected sequenceDiffEvents2: SequenceOfDifferentialEvents;
    protected location: number;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexInflection: number) {
        this.sequenceDiffEvents1 = sequenceDiffEvents1;
        this.sequenceDiffEvents2 = sequenceDiffEvents2;
        this.location = indexInflection;
    }

}

export class LocalizerOfCurvatureExtremumInsideFirstOrLastInterval extends LocalizerOfDifferentialEvents {

    private intervalsBtwExtrema1: SequenceOfIntervals;
    private intervalsBtwExtrema2: SequenceOfIntervals;
    private candidateEventIndex: number;
    private comparatorSequenceOfIntervals: ComparatorOfSequencesOfIntervals;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexInflection: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.intervalsBtwExtrema1 = this.sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(this.location);
        this.intervalsBtwExtrema2 = this.sequenceDiffEvents2.computeIntervalsBtwCurvatureExtrema(this.location);
        this.candidateEventIndex = this.intervalsBtwExtrema1.indexSmallestInterval(ONE_CURVEXT_EVENT_APPEAR_IN_FIRST_OR_LAST_INTERVAL);
        this.comparatorSequenceOfIntervals = new ComparatorOfSequencesOfIntervals(this.intervalsBtwExtrema1, this.intervalsBtwExtrema2);
    }

    locateCurvatureExtremumInsideFirstInterval(): NeighboringEvents {
        let ratioLeft = 0.0, ratioRight = 0.0;
        let indexMaxInterVar = INITIAL_INTERV_INDEX;
        if(this.intervalsBtwExtrema2.sequence.length > 0) {
            ratioLeft = (this.intervalsBtwExtrema2.sequence[0]/this.intervalsBtwExtrema2.span)/(this.intervalsBtwExtrema1.sequence[0]/this.intervalsBtwExtrema1.span);
            ratioRight = (this.intervalsBtwExtrema2.sequence[this.intervalsBtwExtrema2.sequence.length - 1]/this.intervalsBtwExtrema2.span)/(this.intervalsBtwExtrema1.sequence[this.intervalsBtwExtrema1.sequence.length - 1]/this.intervalsBtwExtrema1.span);
            if(ratioLeft > ratioRight) {
                indexMaxInterVar = 0;
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderReverseScan(indexMaxInterVar, ONE_CURVEXT_EVENT_APPEAR_IN_FIRST_OR_LAST_INTERVAL);
                if(this.comparatorSequenceOfIntervals.maxVariationInSeq1.value > ratioLeft) {
                    indexMaxInterVar = this.comparatorSequenceOfIntervals.maxVariationInSeq1.index;
                }
            } else {
                indexMaxInterVar = this.intervalsBtwExtrema1.sequence.length - 1;
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderForwardScan(indexMaxInterVar, ONE_CURVEXT_EVENT_APPEAR_IN_FIRST_OR_LAST_INTERVAL);
                if(this.comparatorSequenceOfIntervals.maxVariationInSeq1.value > ratioRight) {
                    indexMaxInterVar = this.comparatorSequenceOfIntervals.maxVariationInSeq1.index;
                }
            }
        } else {
            indexMaxInterVar = this.candidateEventIndex;
        }

        if(this.candidateEventIndex !== INITIAL_INTERV_INDEX) {
            if(this.sequenceDiffEvents1.indicesOfInflections.length === 0) {
                if(indexMaxInterVar === this.candidateEventIndex) {
                    console.log("Events are stable as well as the candidate event.");
                } else if(indexMaxInterVar !== this.candidateEventIndex) {
                    console.log("Other events variations may influence the decision about the candidate event.");
                    if(!(ratioLeft > ratioRight && this.candidateEventIndex === 0)) {
                        this.candidateEventIndex = 0;
                    } else if(!(ratioLeft < ratioRight && this.candidateEventIndex === this.intervalsBtwExtrema1.sequence.length - 1)) {
                        this.candidateEventIndex = this.intervalsBtwExtrema1.sequence.length - 1;
                    }
                }
            } else {
                /* JCL The only other possibility is candidateEventIndex = 0 */
                this.candidateEventIndex = 0;
            }

        } else throw new Error("Unable to generate the smallest interval of differential events for this curve.");

        let newEvent= new NeighboringEvents();
        if(this.sequenceDiffEvents1.indicesOfInflections.length === 0) {
            if(this.candidateEventIndex === 0) {
                newEvent.type = NeighboringEventsType.neighboringCurExtremumLeftBoundary;
                newEvent.index = 0;
            } else if (this.candidateEventIndex === this.intervalsBtwExtrema1.sequence.length - 1) {
                newEvent.type = NeighboringEventsType.neighboringCurExtremumRightBoundary;
                newEvent.index = this.sequenceDiffEvents1.sequence.length - 1;
            } else {
                newEvent.type = NeighboringEventsType.none;
                newEvent.index = this.candidateEventIndex;
                console.log("Inconsistent identification of curvature extremum. Possibly extremum at a knot.");
            }
        } else {
            if(this.candidateEventIndex === 0) {
                newEvent.type = NeighboringEventsType.neighboringCurExtremumLeftBoundary;
                newEvent.index = 0;
            } else {
                newEvent.type = NeighboringEventsType.none;
                newEvent.index = this.candidateEventIndex;
                console.log("Inconsistent identification of curvature extremum");
            }
        }

        return newEvent;
    }

    locateCurvatureExtremumInsideLastInterval(): NeighboringEvents {
        let ratioRight = 0.0;
        let indexMaxInterVar = INITIAL_INTERV_INDEX;
        if(this.intervalsBtwExtrema2.sequence.length > 0) {
            ratioRight = (this.intervalsBtwExtrema2.sequence[this.intervalsBtwExtrema2.sequence.length - 1]/this.intervalsBtwExtrema2.span)/(this.intervalsBtwExtrema1.sequence[this.intervalsBtwExtrema1.sequence.length - 1]/this.intervalsBtwExtrema1.span);
            indexMaxInterVar = this.intervalsBtwExtrema1.sequence.length - 1;
            this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderForwardScan(indexMaxInterVar, ONE_CURVEXT_EVENT_APPEAR_IN_FIRST_OR_LAST_INTERVAL);
            if(this.comparatorSequenceOfIntervals.maxVariationInSeq1.value > ratioRight) {
                indexMaxInterVar = this.comparatorSequenceOfIntervals.maxVariationInSeq1.index;
            }
        } else {
            indexMaxInterVar = this.intervalsBtwExtrema1.sequence.length - 1;
        }
        if(this.candidateEventIndex !== INITIAL_INTERV_INDEX && (this.candidateEventIndex !== this.intervalsBtwExtrema1.sequence.length - 1 || indexMaxInterVar !== this.intervalsBtwExtrema1.sequence.length - 1)) {
            console.log("A first evaluation of intervals between events shows that the event identified may be inconsistent.")
        }
        let newEvent= new NeighboringEvents();
        newEvent.type = NeighboringEventsType.neighboringCurExtremumRightBoundary;
        newEvent.index = this.sequenceDiffEvents1.sequence.length - 1;
        return newEvent;
    }

}

export class LocalizerOfCurvatureExtrema extends LocalizerOfDifferentialEvents {
    protected intervalsBtwExtrema1: SequenceOfIntervals;
    protected intervalsBtwExtrema2: SequenceOfIntervals;
    protected comparatorSequenceOfIntervals: ComparatorOfSequencesOfIntervals;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexInflection: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.intervalsBtwExtrema1 = this.sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(this.location);
        this.intervalsBtwExtrema2 = this.sequenceDiffEvents2.computeIntervalsBtwCurvatureExtrema(this.location);
        this.comparatorSequenceOfIntervals = new ComparatorOfSequencesOfIntervals(this.intervalsBtwExtrema1, this.intervalsBtwExtrema2);
    }

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
                    console.log("Events are stable as well as the candidate events.");
                } else if(maxRatioF.index !== (candidateEventIndex - 1) || maxRatioR.index !== (candidateEventIndex - 1)) {
                    console.log("The candidate events are not the ones added.");
                    /* Current assumption consists in considering an adjacent interval as candidate */
                    if(maxRatioF.value > maxRatioR.value) {
                        modifiedEventIndex = maxRatioF.index - 1;
                    } else modifiedEventIndex = maxRatioF.index + 1;
                } else {
                    console.log("Events are not stable enough.");
                }
            } else {
                /* JCL this.sequenceDiffEvents2 contains two events only that may appear/disappear */
                modifiedEventIndex = 1;
            }
        } else if(nbEventsModified === TWO_CURVEXT_EVENTS_DISAPPEAR) {
            console.log("Error when computing smallest interval. Assign arbitrarily interval to 0.");
            if(this.sequenceDiffEvents1.indicesOfInflections.length === 0) {
                modifiedEventIndex = 1;
            } else if(this.location === this.sequenceDiffEvents2.indicesOfInflections.length) {
                modifiedEventIndex = this.sequenceDiffEvents2.length() - this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1] - 2;
            } else modifiedEventIndex = 0;
        } else if(nbEventsModified === TWO_CURVEXT_EVENTS_APPEAR) {
            console.log("Error when computing smallest interval. Assign arbitrarily interval to 0.");
            if(this.sequenceDiffEvents1.indicesOfInflections.length === 0 || this.location === 0) {
                modifiedEventIndex = 1;
            } else if(this.location === this.sequenceDiffEvents1.indicesOfInflections.length) {
                modifiedEventIndex = this.sequenceDiffEvents1.length() - this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1] - 2;
            } else modifiedEventIndex = 0;
        } else {
            throw new Error("Incorrect number of modified differential events.")
        }

        return modifiedEventIndex;
    }

}
export class LocalizerOfCurvatureExtremaAppearing extends LocalizerOfCurvatureExtrema {

    private candidateEventIndex: number;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexInflection: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.candidateEventIndex = this.intervalsBtwExtrema1.indexSmallestInterval(TWO_CURVEXT_EVENTS_APPEAR);
    }

    locateCurvatureExtremaBetweenInflections(): NeighboringEvents {
        this.candidateEventIndex = this.analyzeIntervalVariations(this.candidateEventIndex, TWO_CURVEXT_EVENTS_APPEAR);
        let newEvent = this.assignNewEvent(this.sequenceDiffEvents1, this.candidateEventIndex);
        return newEvent;
    }
}

export class LocalizerOfCurvatureExtremaDisappearing extends LocalizerOfCurvatureExtrema {

    private candidateEventIndex: number;

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents, indexInflection: number) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.candidateEventIndex = this.intervalsBtwExtrema1.indexSmallestInterval(TWO_CURVEXT_EVENTS_DISAPPEAR);
    }

    locateCurvatureExtremaBetweenInflections(): NeighboringEvents {
        this.candidateEventIndex = this.analyzeIntervalVariations(this.candidateEventIndex, TWO_CURVEXT_EVENTS_DISAPPEAR);
        let newEvent = this.assignNewEvent(this.sequenceDiffEvents2, this.candidateEventIndex);
        return newEvent;
    }
}