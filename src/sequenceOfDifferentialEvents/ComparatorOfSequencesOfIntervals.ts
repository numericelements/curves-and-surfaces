import { SequenceOfIntervals } from "./SequenceOfIntervals";
import { MaxIntervalVariation } from "./MaxIntervalVariation";
import { ErrorLog } from "../errorProcessing/ErrorLoging";

/* named constants */
import { TWO_CURVEXT_EVENTS_APPEAR,
        TWO_CURVEXT_EVENTS_DISAPPEAR,
        ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL,
        ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL} from "./ComparatorOfSequencesDiffEvents";
import { RETURN_ERROR_CODE } from "./ComparatorOfSequencesDiffEvents";



export class ComparatorOfSequencesOfIntervals {

    private _sequenceOfIntervals1: SequenceOfIntervals;
    private _sequenceOfIntervals2: SequenceOfIntervals;
    public maxVariationInSeq1: MaxIntervalVariation;

    constructor(sequenceOfIntervals1: SequenceOfIntervals, sequenceOfIntervals2: SequenceOfIntervals) {
        this._sequenceOfIntervals1 = sequenceOfIntervals1;
        this._sequenceOfIntervals2 = sequenceOfIntervals2;
        this.maxVariationInSeq1 = new MaxIntervalVariation();
    }

    indexIntervalMaximalVariationUnderForwardScan(candidateEvent: number, nbEvents: number): void {
        if(this.maxVariationInSeq1.index !== RETURN_ERROR_CODE) {
            this.maxVariationInSeq1 = new MaxIntervalVariation();
        }
        this.checkCandidateIndexInReferenceSequence(candidateEvent, nbEvents);

        let upperBound = candidateEvent;
        let lowerBound = 0;
        /* JCL To process intervals that are uniquely bounded by events */
        if((nbEvents === TWO_CURVEXT_EVENTS_APPEAR || nbEvents === TWO_CURVEXT_EVENTS_DISAPPEAR) && candidateEvent > 1) {
            lowerBound = 1;
        }
        // if(candidateEvent === 1) {
        //     if(this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
        //         this.maxVariationInSeq1.value = 1.0/(this._sequenceOfIntervals1.sequence[0]/this._sequenceOfIntervals1.span);
        //     } else if(this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length) {
        //         this.maxVariationInSeq1.value = 1.0/(this._sequenceOfIntervals2.sequence[0]/this._sequenceOfIntervals1.span);
        //     }
        //     this.maxVariationInSeq1.index = 0;
        // }
        for(let k = lowerBound; k < upperBound; k += 1) {
            let currentRatio = 0.0;
            if(this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
                currentRatio = (this._sequenceOfIntervals2.sequence[k]/this._sequenceOfIntervals2.span)/(this._sequenceOfIntervals1.sequence[k]/this._sequenceOfIntervals1.span);
            } else if(this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length) {
                currentRatio = (this._sequenceOfIntervals1.sequence[k]/this._sequenceOfIntervals1.span)/(this._sequenceOfIntervals2.sequence[k]/this._sequenceOfIntervals2.span);
            }
            if(k === 0 || currentRatio > this.maxVariationInSeq1.value) {
                this.maxVariationInSeq1.value = currentRatio;
                this.maxVariationInSeq1.index = k;
            }
        }
    }
        
    indexIntervalMaximalVariationUnderReverseScan(candidateEvent: number, nbEvents: number): void {
        if(this.maxVariationInSeq1.index !== RETURN_ERROR_CODE) {
            this.maxVariationInSeq1 = new MaxIntervalVariation();
        }
        this.checkCandidateIndexInReferenceSequence(candidateEvent, nbEvents);
        let upperBound = 0;
        let lowerBound = 0;
        if(this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
            lowerBound = candidateEvent + nbEvents;
            upperBound = this._sequenceOfIntervals2.sequence.length - 1;
            if(nbEvents === TWO_CURVEXT_EVENTS_DISAPPEAR && candidateEvent < this._sequenceOfIntervals2.sequence.length - 1) upperBound -= 1;
        } else if(this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length){
            lowerBound = candidateEvent - nbEvents;
            upperBound = this._sequenceOfIntervals1.sequence.length - 1;
            if(nbEvents === TWO_CURVEXT_EVENTS_APPEAR && candidateEvent < this._sequenceOfIntervals1.sequence.length - 1) upperBound -= 1;
        }
        // if(candidateEvent === 1) {
        //     if(this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
        //         this.maxVariationInSeq1.value = 1.0/(this._sequenceOfIntervals1.sequence[this._sequenceOfIntervals1.sequence.length - 1]/this._sequenceOfIntervals1.span);
        //     } else if(this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length) {
        //         this.maxVariationInSeq1.value = 1.0/(this._sequenceOfIntervals2.sequence[this._sequenceOfIntervals2.sequence.length - 1]/this._sequenceOfIntervals2.span);
        //     }
        //     this.maxVariationInSeq1.index = upperBound;
        // }
        for(let k = upperBound; k > lowerBound; k -= 1) {
            let currentRatio = 0.0;
            if(this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
                currentRatio = (this._sequenceOfIntervals2.sequence[k]/this._sequenceOfIntervals2.span)/(this._sequenceOfIntervals1.sequence[k - nbEvents]/this._sequenceOfIntervals1.span);
            } else if(this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length) {
                currentRatio = (this._sequenceOfIntervals1.sequence[k]/this._sequenceOfIntervals1.span)/(this._sequenceOfIntervals2.sequence[k + nbEvents]/this._sequenceOfIntervals2.span);
            }
            if(k === this._sequenceOfIntervals2.sequence.length - 1 || currentRatio > this.maxVariationInSeq1.value) {
                this.maxVariationInSeq1.value = currentRatio;
                this.maxVariationInSeq1.index = k;
            }
        }
    }

    checkCandidateIndexInReferenceSequence(CandidateEvent: number, nbEvents: number): void {
        if(nbEvents === ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && CandidateEvent >= this._sequenceOfIntervals1.sequence.length) {
            let error = new ErrorLog(this.constructor.name, "checkCandidateIndexInReferenceSequence", "Invalid index to scan sequence1 of intervals: out of bounds.")
            error.logMessageToConsole();
        } else if(nbEvents === ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && CandidateEvent >= this._sequenceOfIntervals2.sequence.length) {
            let error = new ErrorLog(this.constructor.name, "checkCandidateIndexInReferenceSequence", "Invalid index to scan sequence2 of intervals: out of bounds.")
            error.logMessageToConsole();
        }
    }

}