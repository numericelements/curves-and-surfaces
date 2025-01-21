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
exports.deepCopySequenceOfDifferentialEvents = exports.SequenceOfDifferentialEvents = exports.MIN_NB_INTERVALS_BEFORE_AFTER_INFL_2CEXT_REMOVED = exports.MIN_NB_INTERVALS_BTW_INFL_2CEXT_ADDED = exports.MIN_NB_INTERVALS_BTW_INFL_2CEXT_REMOVED = void 0;
var DifferentialEvent_1 = require("./DifferentialEvent");
var SequenceOfIntervals_1 = require("./SequenceOfIntervals");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
/* named constants */
var DifferentialEvent_2 = require("./DifferentialEvent");
var ComparatorOfSequencesDiffEvents_1 = require("./ComparatorOfSequencesDiffEvents");
/*
* Set up a sequence of differential events as part of the characterization of a curve shape space
*/
exports.MIN_NB_INTERVALS_BTW_INFL_2CEXT_REMOVED = 4;
exports.MIN_NB_INTERVALS_BTW_INFL_2CEXT_ADDED = 2;
exports.MIN_NB_INTERVALS_BEFORE_AFTER_INFL_2CEXT_REMOVED = 3;
var SequenceOfDifferentialEvents = /** @class */ (function () {
    /**
     * Instantiates a sequence of differential events using optionally:
     * @param curvatureExtrema  a strictly increasing sequence of locations of curvature extrema along a curve
     * @param inflections a strictly increasing sequence of locations of inflections along a curve
     * @throws Errors if:
     *          a sequence of inflections is provided only and contains more than one inflection (a sequence cannot contain two or more consecutive inflections)
     *          the sequence of curvature extrema supplied is not strictly increasing
     *          the sequence terminates with more two or more successive inflections
     *          the sequence instantiated has a length that is not equal to the sum of the lengthes of curvatureExtrema.length + inflections.length
     *          type or location inconsistecies are detected in the sequence instantiated or modified
     */
    function SequenceOfDifferentialEvents(curvatureExtrema, inflections) {
        var e_1, _a;
        this._sequence = [];
        if (curvatureExtrema !== undefined && inflections === undefined) {
            try {
                for (var curvatureExtrema_1 = __values(curvatureExtrema), curvatureExtrema_1_1 = curvatureExtrema_1.next(); !curvatureExtrema_1_1.done; curvatureExtrema_1_1 = curvatureExtrema_1.next()) {
                    var curvatExtremum = curvatureExtrema_1_1.value;
                    var event_1 = new DifferentialEvent_1.CurvatureExtremumEvent(curvatExtremum);
                    this._sequence.push(event_1);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (curvatureExtrema_1_1 && !curvatureExtrema_1_1.done && (_a = curvatureExtrema_1.return)) _a.call(curvatureExtrema_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else if (curvatureExtrema === undefined && inflections !== undefined) {
            if (inflections.length > 1) {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Unable to generate a sequence of differential events: too many consecutive inflections.");
                error.logMessage();
            }
            else {
                var event_2 = new DifferentialEvent_1.InflectionEvent(inflections[0]);
                this._sequence.push(event_2);
            }
        }
        else if (curvatureExtrema !== undefined && inflections !== undefined) {
            this.insertEvents(curvatureExtrema, inflections);
        }
        this._indicesOfInflections = this.generateIndicesInflection();
    }
    Object.defineProperty(SequenceOfDifferentialEvents.prototype, "event", {
        set: function (event) {
            this._sequence.push(event);
            this.checkSequenceConsistency();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequenceOfDifferentialEvents.prototype, "sequence", {
        get: function () {
            return this._sequence;
        },
        set: function (sequence) {
            this._sequence = sequence.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequenceOfDifferentialEvents.prototype, "indicesOfInflections", {
        get: function () {
            return this._indicesOfInflections;
        },
        set: function (indicesOfInflections) {
            this._indicesOfInflections = indicesOfInflections.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequenceOfDifferentialEvents.prototype, "lastEvent", {
        get: function () {
            var event;
            if (this._sequence[this._sequence.length - 1] !== undefined) {
                event = this._sequence[this._sequence.length - 1];
                this._sequence.pop();
                return event;
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "lastEvent", "Cannot get event because the sequence is empty.");
                error.logMessage();
            }
        },
        enumerable: false,
        configurable: true
    });
    SequenceOfDifferentialEvents.prototype.length = function () {
        return this._sequence.length;
    };
    SequenceOfDifferentialEvents.prototype.eventAt = function (i) {
        if (i >= 0 && i < this._sequence.length) {
            return this._sequence[i].clone();
        }
        else {
            return undefined;
        }
    };
    SequenceOfDifferentialEvents.prototype.insertAt = function (event, index) {
        this._sequence.splice(index, 0, event);
        this._indicesOfInflections = this.generateIndicesInflection();
        this.checkSequenceConsistency();
    };
    SequenceOfDifferentialEvents.prototype.removeAt = function (index) {
        this._sequence.splice(index, 1);
        this._indicesOfInflections = this.generateIndicesInflection();
        this.checkSequenceConsistency();
    };
    SequenceOfDifferentialEvents.prototype.nbInflections = function () {
        var nbInflections = 0;
        this._sequence.forEach(function (element) {
            if (element.order === DifferentialEvent_2.ORDER_INFLECTION) {
                nbInflections += 1;
            }
        });
        return nbInflections;
    };
    SequenceOfDifferentialEvents.prototype.nbCurvatureExtrema = function () {
        var nbCurvatureExtrema = 0;
        this._sequence.forEach(function (element) {
            if (element.order === DifferentialEvent_2.ORDER_CURVATURE_EXTREMUM) {
                nbCurvatureExtrema += 1;
            }
        });
        return nbCurvatureExtrema;
    };
    SequenceOfDifferentialEvents.prototype.generateIndicesInflection = function () {
        var inflectionIndices = [];
        this._sequence.forEach(function (element, index) {
            if (element.order === DifferentialEvent_2.ORDER_INFLECTION) {
                inflectionIndices.push(index);
            }
        });
        return inflectionIndices;
    };
    SequenceOfDifferentialEvents.prototype.generateIndicesOscillations = function () {
        var e_2, _a;
        var oscillationIndices = [];
        try {
            for (var _b = __values(this._indicesOfInflections), _c = _b.next(); !_c.done; _c = _b.next()) {
                var index = _c.value;
                if (this._sequence.length > index + 2 &&
                    this._sequence[index + 1].order === DifferentialEvent_2.ORDER_CURVATURE_EXTREMUM && this._sequence[index + 2].order === DifferentialEvent_2.ORDER_INFLECTION) {
                    oscillationIndices.push(index + 1);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return oscillationIndices;
    };
    SequenceOfDifferentialEvents.prototype.insertEvents = function (curvatureExtrema, inflections) {
        this._sequence = [];
        var j = 0;
        var currentLocExtrema = 0.0;
        var indexExtrema = 0;
        for (var i = 0; i < curvatureExtrema.length; i += 1) {
            if (i === 0) {
                currentLocExtrema = curvatureExtrema[i];
            }
            else if (i > 0 && curvatureExtrema[i] > currentLocExtrema) {
                currentLocExtrema = curvatureExtrema[i - 1];
            }
            else {
                indexExtrema = i;
            }
            if (curvatureExtrema[i] > inflections[j]) {
                while (curvatureExtrema[i] > inflections[j]) {
                    var inflectionEvent = new DifferentialEvent_1.InflectionEvent(inflections[j]);
                    this._sequence.push(inflectionEvent);
                    j += 1;
                }
            }
            var curvatureEvent = new DifferentialEvent_1.CurvatureExtremumEvent(curvatureExtrema[i]);
            this._sequence.push(curvatureEvent);
        }
        if (j < inflections.length) {
            var inflectionEvent = new DifferentialEvent_1.InflectionEvent(inflections[j]);
            this._sequence.push(inflectionEvent);
            j += 1;
        }
        if (indexExtrema > 0) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertEvents", "Inconsistent sequence of differential events because the location of curvature extrema is not stricly increasing at index."
                + indexExtrema);
            error.logMessage();
        }
        if (j < inflections.length) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertEvents", "Inconsistent sequence of differential events that terminates with multiple inflections.");
            error.logMessage();
        }
        else if (this._sequence.length !== curvatureExtrema.length + inflections.length) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertEvents", "Inconsistent length of sequence of differential events.");
            error.logMessage();
        }
        this.checkSequenceConsistency();
        this._indicesOfInflections = this.generateIndicesInflection();
    };
    SequenceOfDifferentialEvents.prototype.computeIntervalsBtwCurvatureExtrema = function (indexInflection) {
        var intervalExtrema = new SequenceOfIntervals_1.SequenceOfIntervals();
        if (this._indicesOfInflections.length === 0 && this._sequence.length === 0) {
            intervalExtrema.span = ComparatorOfSequencesDiffEvents_1.CURVE_INTERVAL_SPAN;
            intervalExtrema.sequence.push(intervalExtrema.span);
        }
        else if (this._indicesOfInflections.length === 0 && this._sequence.length > 0) {
            intervalExtrema.span = ComparatorOfSequencesDiffEvents_1.CURVE_INTERVAL_SPAN;
            intervalExtrema.sequence.push(this._sequence[0].location - ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL);
            for (var k = 0; k < this._sequence.length - 1; k += 1) {
                intervalExtrema.sequence.push(this._sequence[k + 1].location - this._sequence[k].location);
            }
            intervalExtrema.sequence.push(ComparatorOfSequencesDiffEvents_1.UPPER_BOUND_CURVE_INTERVAL - this._sequence[this._sequence.length - 1].location);
        }
        else if (indexInflection === this._indicesOfInflections.length) {
            intervalExtrema.span = ComparatorOfSequencesDiffEvents_1.UPPER_BOUND_CURVE_INTERVAL - this._sequence[this._indicesOfInflections[indexInflection - 1]].location;
            for (var k = this._indicesOfInflections[this._indicesOfInflections.length - 1]; k < this._sequence.length - 1; k += 1) {
                intervalExtrema.sequence.push(this._sequence[k + 1].location - this._sequence[k].location);
            }
            intervalExtrema.sequence.push(ComparatorOfSequencesDiffEvents_1.UPPER_BOUND_CURVE_INTERVAL - this._sequence[this._sequence.length - 1].location);
        }
        else if (indexInflection === 0 && this._indicesOfInflections[0] > 0) {
            intervalExtrema.span = this._sequence[this._indicesOfInflections[indexInflection]].location - ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL;
            intervalExtrema.sequence.push(this._sequence[0].location - ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL);
            for (var k = 1; k < this._indicesOfInflections[indexInflection]; k += 1) {
                intervalExtrema.sequence.push(this._sequence[k].location - this._sequence[k - 1].location);
            }
            intervalExtrema.sequence.push(intervalExtrema.span - this._sequence[this._indicesOfInflections[indexInflection] - 1].location);
        }
        else if (indexInflection === 0 && this._indicesOfInflections[0] === 0) {
            intervalExtrema.span = this._sequence[this._indicesOfInflections[indexInflection]].location - ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL;
            intervalExtrema.sequence.push(intervalExtrema.span);
        }
        else if (this._indicesOfInflections.length > 1 && indexInflection < this._indicesOfInflections.length) {
            intervalExtrema.span = this._sequence[this._indicesOfInflections[indexInflection]].location - this._sequence[this._indicesOfInflections[indexInflection - 1]].location;
            for (var k = this._indicesOfInflections[indexInflection - 1] + 1; k < this._indicesOfInflections[indexInflection]; k += 1) {
                intervalExtrema.sequence.push(this._sequence[k].location - this._sequence[k - 1].location);
            }
            intervalExtrema.sequence.push(this._sequence[this._indicesOfInflections[indexInflection]].location - this._sequence[this._indicesOfInflections[indexInflection] - 1].location);
        }
        return intervalExtrema;
    };
    SequenceOfDifferentialEvents.prototype.checkTypeConsistency = function () {
        if (this._sequence.length === 0)
            return;
        var currentOrder = this._sequence[0].order;
        var index = 0;
        // Look for type consistency. If two successive differential events are inflections, the sequence is incorrect
        // All other configurations are valid
        for (var i = 1; i < this._sequence.length; i += 1) {
            if (currentOrder === DifferentialEvent_2.ORDER_INFLECTION && this._sequence[i].order === DifferentialEvent_2.ORDER_INFLECTION) {
                index = i;
                break;
            }
            else {
                currentOrder = this._sequence[i].order;
            }
        }
        if (index > 0) {
            var message = "Inconsistent sequence of differential events: two successive inflections at indices " + (index - 1) + " and " + index;
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkTypeConsistency", message);
            error.logMessage();
        }
    };
    SequenceOfDifferentialEvents.prototype.checkLocationConsistency = function () {
        if (this._sequence.length === 0)
            return;
        var index = 0;
        // Look for location consistency. The sequence of abscissae must be strictly increasing
        for (var i = 1; i < this._sequence.length; i += 1) {
            if (this._sequence[i].location > this._sequence[i - 1].location) {
                continue;
            }
            else {
                index = i;
                break;
            }
        }
        if (index > 0) {
            var message = "Inconsistent sequence of differential events: two successive events have non strictly increasing abscissa at indices " +
                (index - 1) + " and " + index + " with values " + this._sequence[index - 1].location + " and " + this._sequence[index].location;
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkLocationConsistency", message);
            error.logMessage();
        }
    };
    SequenceOfDifferentialEvents.prototype.checkSequenceConsistency = function () {
        this.checkTypeConsistency();
        this.checkLocationConsistency();
    };
    SequenceOfDifferentialEvents.prototype.checkConsistencyIntervalBtwInflections = function (modifiedEvent) {
        var inflectionIndex = modifiedEvent.indexInflection;
        var nbModifiedEvents = modifiedEvent.nbEvents;
        if (this._indicesOfInflections.length > 2) {
            if (inflectionIndex > 0) {
                if (nbModifiedEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR && this._indicesOfInflections[inflectionIndex] - this._indicesOfInflections[inflectionIndex - 1] < exports.MIN_NB_INTERVALS_BTW_INFL_2CEXT_REMOVED) {
                    /* JCL A minimum of four intervals is required to obtain a meaningful loss of curvature extrema */
                    var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencyIntervalBtwInflections", "Inconsistent number of curvature extrema in the current interval of inflections. Number too small for curvature extrema removal.");
                    error.logMessage();
                }
                else if (nbModifiedEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR && this._indicesOfInflections[inflectionIndex] - this._indicesOfInflections[inflectionIndex - 1] < exports.MIN_NB_INTERVALS_BTW_INFL_2CEXT_ADDED) {
                    var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencyIntervalBtwInflections", "Inconsistent number of curvature extrema in the current interval of inflections. Number too small for curvature extrema insertion.");
                    error.logMessage();
                }
            }
        }
        else if ((inflectionIndex === 0 || inflectionIndex === this._indicesOfInflections.length) && this._indicesOfInflections.length > 0) {
            if (nbModifiedEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR && inflectionIndex === 0 && this._indicesOfInflections[inflectionIndex] < exports.MIN_NB_INTERVALS_BEFORE_AFTER_INFL_2CEXT_REMOVED) {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencyIntervalBtwInflections", "Inconsistent number of curvature extrema in the first interval of inflections. Number too small.");
                error.logMessage();
            }
            else if (nbModifiedEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR && inflectionIndex === this._indicesOfInflections.length && this._indicesOfInflections.length - this._indicesOfInflections[inflectionIndex - 1] < exports.MIN_NB_INTERVALS_BEFORE_AFTER_INFL_2CEXT_REMOVED) {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencyIntervalBtwInflections", "Inconsistent number of curvature extrema in the last interval of inflections. Number too small.");
                error.logMessage();
            }
        }
    };
    SequenceOfDifferentialEvents.prototype.clone = function () {
        var sequence = new SequenceOfDifferentialEvents();
        for (var event_3 = 0; event_3 < this._sequence.length; event_3++) {
            sequence.insertAt(this.eventAt(event_3), event_3);
        }
        sequence._indicesOfInflections = sequence.generateIndicesInflection();
        return sequence;
    };
    SequenceOfDifferentialEvents.prototype.clear = function () {
        this._sequence = [];
        this._indicesOfInflections = this.generateIndicesInflection();
    };
    return SequenceOfDifferentialEvents;
}());
exports.SequenceOfDifferentialEvents = SequenceOfDifferentialEvents;
function deepCopySequenceOfDifferentialEvents(sequenceDifEvents) {
    var sequence = new SequenceOfDifferentialEvents();
    sequence.sequence = sequenceDifEvents.sequence;
    sequence.indicesOfInflections = sequenceDifEvents.indicesOfInflections;
    return sequence;
}
exports.deepCopySequenceOfDifferentialEvents = deepCopySequenceOfDifferentialEvents;
