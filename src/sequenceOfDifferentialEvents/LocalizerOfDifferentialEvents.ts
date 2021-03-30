import { SequenceOfDifferentialEvents } from "./SequenceOfDifferentialEvents";
import { SequenceOfIntervals } from "./SequenceOfIntervals";
import { ComparatorOfSequencesOfIntervals } from "./ComparatorOfSequencesOfIntervals";
import { NeighboringEvents } from "./NeighboringEvents";

/* named constants */
import { ONE_CURVEXT_EVENT_APPEAR_IN_FIRST_OR_LAST_INTERVAL } from "./ComparatorOfSequencesDiffEvents";
import { INITIAL_INTERV_INDEX } from "./NeighboringEvents";

import { NeighboringEventsType } from "./NeighboringEvents";

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