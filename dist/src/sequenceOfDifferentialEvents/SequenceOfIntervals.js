"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceOfIntervals = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
/* named constants */
var ComparatorOfSequencesDiffEvents_1 = require("./ComparatorOfSequencesDiffEvents");
/* named constants */
var NeighboringEvents_1 = require("./NeighboringEvents");
var SequenceOfIntervals = /** @class */ (function () {
    /**
     * Instantiates a sequence of adjacents intervals whose width is defined by span.
     * @param span the width of the interval sequence
     * @param sequence the sequence of interval width whose sum equals span
     */
    function SequenceOfIntervals(span, sequence) {
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
    Object.defineProperty(SequenceOfIntervals.prototype, "span", {
        get: function () {
            return this._span;
        },
        set: function (span) {
            this._span = span;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequenceOfIntervals.prototype, "nbEvents", {
        set: function (sequence) {
            this._sequence = sequence;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequenceOfIntervals.prototype, "sequence", {
        get: function () {
            return this._sequence;
        },
        enumerable: false,
        configurable: true
    });
    SequenceOfIntervals.prototype.indexSmallestInterval = function (nbEvents) {
        var e_1, _a;
        var candidateEventIndex = NeighboringEvents_1.INITIAL_INTERV_INDEX;
        var ratio = [];
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
            try {
                for (var _b = __values(this._sequence), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interval = _c.value;
                    ratio.push(interval / this._span);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var mappedRatio = ratio.map(function (location, i) {
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
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "indexSmallestInterval", "Inconsistent number of events (Must be a positive number not larger than two) or inconsistent number of intervals between curvature extrema.");
            warning.logMessage();
        }
        return candidateEventIndex;
    };
    return SequenceOfIntervals;
}());
exports.SequenceOfIntervals = SequenceOfIntervals;
