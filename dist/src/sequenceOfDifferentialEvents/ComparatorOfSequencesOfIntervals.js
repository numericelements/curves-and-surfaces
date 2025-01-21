"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparatorOfSequencesOfIntervals = void 0;
var MaxIntervalVariation_1 = require("./MaxIntervalVariation");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
/* named constants */
var ComparatorOfSequencesDiffEvents_1 = require("./ComparatorOfSequencesDiffEvents");
var ComparatorOfSequencesDiffEvents_2 = require("./ComparatorOfSequencesDiffEvents");
var ComparatorOfSequencesOfIntervals = /** @class */ (function () {
    function ComparatorOfSequencesOfIntervals(sequenceOfIntervals1, sequenceOfIntervals2) {
        this._sequenceOfIntervals1 = sequenceOfIntervals1;
        this._sequenceOfIntervals2 = sequenceOfIntervals2;
        this.maxVariationInSeq1 = new MaxIntervalVariation_1.MaxIntervalVariation();
    }
    Object.defineProperty(ComparatorOfSequencesOfIntervals.prototype, "sequenceOfIntervals1", {
        get: function () {
            return this._sequenceOfIntervals1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ComparatorOfSequencesOfIntervals.prototype, "sequenceOfIntervals2", {
        get: function () {
            return this._sequenceOfIntervals2;
        },
        enumerable: false,
        configurable: true
    });
    ComparatorOfSequencesOfIntervals.prototype.indexIntervalMaximalVariationUnderForwardScan = function (candidateEvent, nbEvents) {
        if (this.maxVariationInSeq1.index !== ComparatorOfSequencesDiffEvents_2.RETURN_ERROR_CODE) {
            this.maxVariationInSeq1 = new MaxIntervalVariation_1.MaxIntervalVariation();
        }
        this.checkCandidateIndexInReferenceSequence(candidateEvent, nbEvents);
        var upperBound = candidateEvent;
        var lowerBound = 0;
        /* JCL To process intervals that are uniquely bounded by events */
        if ((nbEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR || nbEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR) && candidateEvent > 1) {
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
        for (var k = lowerBound; k < upperBound; k += 1) {
            var currentRatio = 0.0;
            if (this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
                currentRatio = (this._sequenceOfIntervals2.sequence[k] / this._sequenceOfIntervals2.span) / (this._sequenceOfIntervals1.sequence[k] / this._sequenceOfIntervals1.span);
            }
            else if (this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length) {
                currentRatio = (this._sequenceOfIntervals1.sequence[k] / this._sequenceOfIntervals1.span) / (this._sequenceOfIntervals2.sequence[k] / this._sequenceOfIntervals2.span);
            }
            if (k === 0 || currentRatio > this.maxVariationInSeq1.value) {
                this.maxVariationInSeq1.value = currentRatio;
                this.maxVariationInSeq1.index = k;
            }
        }
    };
    ComparatorOfSequencesOfIntervals.prototype.indexIntervalMaximalVariationUnderReverseScan = function (candidateEvent, nbEvents) {
        if (this.maxVariationInSeq1.index !== ComparatorOfSequencesDiffEvents_2.RETURN_ERROR_CODE) {
            this.maxVariationInSeq1 = new MaxIntervalVariation_1.MaxIntervalVariation();
        }
        this.checkCandidateIndexInReferenceSequence(candidateEvent, nbEvents);
        var upperBound = 0;
        var lowerBound = 0;
        if (this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
            lowerBound = candidateEvent + nbEvents;
            upperBound = this._sequenceOfIntervals2.sequence.length - 1;
            if (nbEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR && candidateEvent < this._sequenceOfIntervals2.sequence.length - 1)
                upperBound -= 1;
        }
        else if (this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length) {
            lowerBound = candidateEvent - nbEvents;
            upperBound = this._sequenceOfIntervals1.sequence.length - 1;
            if (nbEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR && candidateEvent < this._sequenceOfIntervals1.sequence.length - 1)
                upperBound -= 1;
        }
        // if(candidateEvent === 1) {
        //     if(this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
        //         this.maxVariationInSeq1.value = 1.0/(this._sequenceOfIntervals1.sequence[this._sequenceOfIntervals1.sequence.length - 1]/this._sequenceOfIntervals1.span);
        //     } else if(this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length) {
        //         this.maxVariationInSeq1.value = 1.0/(this._sequenceOfIntervals2.sequence[this._sequenceOfIntervals2.sequence.length - 1]/this._sequenceOfIntervals2.span);
        //     }
        //     this.maxVariationInSeq1.index = upperBound;
        // }
        for (var k = upperBound; k > lowerBound; k -= 1) {
            var currentRatio = 0.0;
            if (this._sequenceOfIntervals1.sequence.length > this._sequenceOfIntervals2.sequence.length) {
                currentRatio = (this._sequenceOfIntervals2.sequence[k] / this._sequenceOfIntervals2.span) / (this._sequenceOfIntervals1.sequence[k - nbEvents] / this._sequenceOfIntervals1.span);
            }
            else if (this._sequenceOfIntervals1.sequence.length < this._sequenceOfIntervals2.sequence.length) {
                currentRatio = (this._sequenceOfIntervals1.sequence[k] / this._sequenceOfIntervals1.span) / (this._sequenceOfIntervals2.sequence[k + nbEvents] / this._sequenceOfIntervals2.span);
            }
            if (k === this._sequenceOfIntervals2.sequence.length - 1 || currentRatio > this.maxVariationInSeq1.value) {
                this.maxVariationInSeq1.value = currentRatio;
                this.maxVariationInSeq1.index = k;
            }
        }
    };
    ComparatorOfSequencesOfIntervals.prototype.checkCandidateIndexInReferenceSequence = function (CandidateEvent, nbEvents) {
        if (nbEvents === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && CandidateEvent >= this._sequenceOfIntervals1.sequence.length) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkCandidateIndexInReferenceSequence", "Invalid index to scan sequence1 of intervals: out of bounds.");
            error.logMessage();
        }
        else if (nbEvents === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && CandidateEvent >= this._sequenceOfIntervals2.sequence.length) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkCandidateIndexInReferenceSequence", "Invalid index to scan sequence2 of intervals: out of bounds.");
            error.logMessage();
        }
    };
    return ComparatorOfSequencesOfIntervals;
}());
exports.ComparatorOfSequencesOfIntervals = ComparatorOfSequencesOfIntervals;
