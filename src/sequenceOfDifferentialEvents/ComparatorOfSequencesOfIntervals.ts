import { SequenceOfIntervals } from "./SequenceOfIntervals";
import { MaxIntervalVariation } from "./MaxIntervalVariation";

/* named constants */
import { TWO_CURVEXT_EVENTS_APPEAR } from "./ComparatorOfSequencesDiffEvents";
import { TWO_CURVEXT_EVENTS_DISAPPEAR} from "./ComparatorOfSequencesDiffEvents";
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

        let upperBound = candidateEvent;
        let lowerBound = 0;
        /* JCL To process intervals that are uniquely bounded by events */
        if((nbEvents === TWO_CURVEXT_EVENTS_APPEAR || nbEvents === TWO_CURVEXT_EVENTS_DISAPPEAR) && candidateEvent > 1) {
            lowerBound = 1;
        }
        if(candidateEvent === 1) {
            if(this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
                this.maxVariationInSeq1.value = 1.0/(this._sequenceOfIntervals1.sequence[0]/this._sequenceOfIntervals1.span);
            } else if(this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length) {
                this.maxVariationInSeq1.value = 1.0/(this._sequenceOfIntervals2.sequence[0]/this._sequenceOfIntervals1.span);
            }
            this.maxVariationInSeq1.index = 0;
        }
        for(let k = lowerBound; k < upperBound; k += 1) {
            let currentRatio = 1.0;
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
        return;
    }
        
    indexIntervalMaximalVariationUnderReverseScan(candidateEvent: number, nbEvents: number): void {
        if(this.maxVariationInSeq1.index !== RETURN_ERROR_CODE) {
            this.maxVariationInSeq1 = new MaxIntervalVariation();
        }
        let upperBound = 0;
        let lowerBound = 0;
        if(this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
            lowerBound = candidateEvent - nbEvents;
            upperBound = this._sequenceOfIntervals2.sequence.length - 1;
            if(nbEvents === TWO_CURVEXT_EVENTS_APPEAR && candidateEvent < this._sequenceOfIntervals2.sequence.length - 1) upperBound -= 1;
        } else if(this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length){
            lowerBound = candidateEvent + nbEvents;
            upperBound = this._sequenceOfIntervals1.sequence.length - 1;
            if(nbEvents === TWO_CURVEXT_EVENTS_DISAPPEAR && candidateEvent < this._sequenceOfIntervals1.sequence.length - 1) upperBound -= 1;
        }
        if(candidateEvent === 1) {
            if(this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
                this.maxVariationInSeq1.value = 1.0/(this._sequenceOfIntervals1.sequence[this._sequenceOfIntervals1.sequence.length - 1]/this._sequenceOfIntervals1.span);
            } else if(this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length) {
                this.maxVariationInSeq1.value = 1.0/(this._sequenceOfIntervals2.sequence[this._sequenceOfIntervals2.sequence.length - 1]/this._sequenceOfIntervals2.span);
            }
            this.maxVariationInSeq1.index = upperBound;
        }
        for(let k = upperBound; k > lowerBound; k -= 1) {
            let currentRatio = 1.0;
            if(this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
                currentRatio = (this._sequenceOfIntervals2.sequence[k]/this._sequenceOfIntervals2.span)/(this._sequenceOfIntervals1.sequence[k + nbEvents]/this._sequenceOfIntervals1.span);
            } else if(this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length) {
                currentRatio = (this._sequenceOfIntervals1.sequence[k]/this._sequenceOfIntervals1.span)/(this._sequenceOfIntervals2.sequence[k - nbEvents]/this._sequenceOfIntervals2.span);
            }
            if(k === this._sequenceOfIntervals2.sequence.length - 1 || currentRatio > this.maxVariationInSeq1.value) {
                this.maxVariationInSeq1.value = currentRatio;
                this.maxVariationInSeq1.index = k;
            }
        }
        return;
    }

}