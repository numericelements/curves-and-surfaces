"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceOfIntervals = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
/* named constants */
const ComparatorOfSequencesDiffEvents_1 = require("./ComparatorOfSequencesDiffEvents");
/* named constants */
const NeighboringEvents_1 = require("./NeighboringEvents");
class SequenceOfIntervals {
    /**
     * Instantiates a sequence of adjacents intervals whose width is defined by span.
     * @param span the width of the interval sequence
     * @param sequence the sequence of interval width whose sum equals span
     */
    constructor(span, sequence) {
        if (span !== undefined) {
            this._span = span;
        }
        else {
            this._span = 0.0;
        }
        if (sequence !== undefined) {
            this._sequence = sequence;
        }
        else {
            this._sequence = [];
        }
    }
    set span(span) {
        this._span = span;
    }
    set nbEvents(sequence) {
        this._sequence = sequence;
    }
    get span() {
        return this._span;
    }
    get sequence() {
        return this._sequence;
    }
    indexSmallestInterval(nbEvents) {
        let candidateEventIndex = NeighboringEvents_1.INITIAL_INTERV_INDEX;
        let ratio = [];
        if ((nbEvents === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL || nbEvents === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) && this._sequence.length > 1) {
            /* JCL Look at first and last intervals only. Other intervals add noise to get a consistent candidate interval */
            ratio.push(this._sequence[0] / this._span);
            ratio.push(this._sequence[this._sequence.length - 1] / this._span);
            if (ratio[0] < ratio[1])
                candidateEventIndex = 0;
            else
                candidateEventIndex = this._sequence.length - 1;
        }
        else if ((nbEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR || nbEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR) && this._sequence.length > 2) {
            for (let interval of this._sequence) {
                ratio.push(interval / this._span);
            }
            let mappedRatio = ratio.map(function (location, i) {
                return { index: i, value: location };
            });
            mappedRatio.sort(function (a, b) {
                if (a.value > b.value) {
                    return 1;
                }
                if (a.value < b.value) {
                    return -1;
                }
                return 0;
            });
            candidateEventIndex = mappedRatio[0].index;
            /* JCL Take into account the optional number of events  */
            /* if the number of events removed equals 2 smallest intervals at both extremities can be removed because */
            /* they are of different types of there no event if it is a free extremity of the curve */
            if (mappedRatio[0].index === 0 || mappedRatio[0].index === this._sequence.length - 1) {
                candidateEventIndex = mappedRatio[1].index;
                if (mappedRatio[1].index === 0 || mappedRatio[1].index === this._sequence.length - 1) {
                    candidateEventIndex = mappedRatio[2].index;
                }
            }
        }
        else {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "indexSmallestInterval", "Inconsistent number of events (Must be a positive number not larger than two) or inconsistent number of intervals between curvature extrema.");
            warning.logMessage();
        }
        return candidateEventIndex;
    }
}
exports.SequenceOfIntervals = SequenceOfIntervals;
