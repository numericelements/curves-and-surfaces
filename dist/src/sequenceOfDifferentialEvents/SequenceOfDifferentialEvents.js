"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopySequenceOfDifferentialEvents = exports.SequenceOfDifferentialEvents = exports.MIN_NB_INTERVALS_BEFORE_AFTER_INFL_2CEXT_REMOVED = exports.MIN_NB_INTERVALS_BTW_INFL_2CEXT_ADDED = exports.MIN_NB_INTERVALS_BTW_INFL_2CEXT_REMOVED = void 0;
const DifferentialEvent_1 = require("./DifferentialEvent");
const SequenceOfIntervals_1 = require("./SequenceOfIntervals");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
/* named constants */
const DifferentialEvent_2 = require("./DifferentialEvent");
const ComparatorOfSequencesDiffEvents_1 = require("./ComparatorOfSequencesDiffEvents");
/*
* Set up a sequence of differential events as part of the characterization of a curve shape space
*/
exports.MIN_NB_INTERVALS_BTW_INFL_2CEXT_REMOVED = 4;
exports.MIN_NB_INTERVALS_BTW_INFL_2CEXT_ADDED = 2;
exports.MIN_NB_INTERVALS_BEFORE_AFTER_INFL_2CEXT_REMOVED = 3;
class SequenceOfDifferentialEvents {
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
    constructor(curvatureExtrema, inflections) {
        this._sequence = [];
        if (curvatureExtrema !== undefined && inflections === undefined) {
            for (let curvatExtremum of curvatureExtrema) {
                const event = new DifferentialEvent_1.CurvatureExtremumEvent(curvatExtremum);
                this._sequence.push(event);
            }
        }
        else if (curvatureExtrema === undefined && inflections !== undefined) {
            if (inflections.length > 1) {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Unable to generate a sequence of differential events: too many consecutive inflections.");
                error.logMessage();
            }
            else {
                const event = new DifferentialEvent_1.InflectionEvent(inflections[0]);
                this._sequence.push(event);
            }
        }
        else if (curvatureExtrema !== undefined && inflections !== undefined) {
            this.insertEvents(curvatureExtrema, inflections);
        }
        this._indicesOfInflections = this.generateIndicesInflection();
    }
    set event(event) {
        this._sequence.push(event);
        this.checkSequenceConsistency();
    }
    set sequence(sequence) {
        this._sequence = sequence.slice();
    }
    set indicesOfInflections(indicesOfInflections) {
        this._indicesOfInflections = indicesOfInflections.slice();
    }
    get lastEvent() {
        let event;
        if (this._sequence[this._sequence.length - 1] !== undefined) {
            event = this._sequence[this._sequence.length - 1];
            this._sequence.pop();
            return event;
        }
        else {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "lastEvent", "Cannot get event because the sequence is empty.");
            error.logMessage();
        }
    }
    get sequence() {
        return this._sequence;
    }
    get indicesOfInflections() {
        return this._indicesOfInflections;
    }
    length() {
        return this._sequence.length;
    }
    eventAt(i) {
        if (i >= 0 && i < this._sequence.length) {
            return this._sequence[i].clone();
        }
        else {
            return undefined;
        }
    }
    insertAt(event, index) {
        this._sequence.splice(index, 0, event);
        this._indicesOfInflections = this.generateIndicesInflection();
        this.checkSequenceConsistency();
    }
    removeAt(index) {
        this._sequence.splice(index, 1);
        this._indicesOfInflections = this.generateIndicesInflection();
        this.checkSequenceConsistency();
    }
    nbInflections() {
        let nbInflections = 0;
        this._sequence.forEach(element => {
            if (element.order === DifferentialEvent_2.ORDER_INFLECTION) {
                nbInflections += 1;
            }
        });
        return nbInflections;
    }
    nbCurvatureExtrema() {
        let nbCurvatureExtrema = 0;
        this._sequence.forEach(element => {
            if (element.order === DifferentialEvent_2.ORDER_CURVATURE_EXTREMUM) {
                nbCurvatureExtrema += 1;
            }
        });
        return nbCurvatureExtrema;
    }
    generateIndicesInflection() {
        let inflectionIndices = [];
        this._sequence.forEach((element, index) => {
            if (element.order === DifferentialEvent_2.ORDER_INFLECTION) {
                inflectionIndices.push(index);
            }
        });
        return inflectionIndices;
    }
    generateIndicesOscillations() {
        let oscillationIndices = [];
        for (let index of this._indicesOfInflections) {
            if (this._sequence.length > index + 2 &&
                this._sequence[index + 1].order === DifferentialEvent_2.ORDER_CURVATURE_EXTREMUM && this._sequence[index + 2].order === DifferentialEvent_2.ORDER_INFLECTION) {
                oscillationIndices.push(index + 1);
            }
        }
        return oscillationIndices;
    }
    insertEvents(curvatureExtrema, inflections) {
        this._sequence = [];
        let j = 0;
        let currentLocExtrema = 0.0;
        let indexExtrema = 0;
        for (let i = 0; i < curvatureExtrema.length; i += 1) {
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
                    const inflectionEvent = new DifferentialEvent_1.InflectionEvent(inflections[j]);
                    this._sequence.push(inflectionEvent);
                    j += 1;
                }
            }
            const curvatureEvent = new DifferentialEvent_1.CurvatureExtremumEvent(curvatureExtrema[i]);
            this._sequence.push(curvatureEvent);
        }
        if (j < inflections.length) {
            const inflectionEvent = new DifferentialEvent_1.InflectionEvent(inflections[j]);
            this._sequence.push(inflectionEvent);
            j += 1;
        }
        if (indexExtrema > 0) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertEvents", "Inconsistent sequence of differential events because the location of curvature extrema is not stricly increasing at index."
                + indexExtrema);
            error.logMessage();
        }
        if (j < inflections.length) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertEvents", "Inconsistent sequence of differential events that terminates with multiple inflections.");
            error.logMessage();
        }
        else if (this._sequence.length !== curvatureExtrema.length + inflections.length) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertEvents", "Inconsistent length of sequence of differential events.");
            error.logMessage();
        }
        this.checkSequenceConsistency();
        this._indicesOfInflections = this.generateIndicesInflection();
    }
    computeIntervalsBtwCurvatureExtrema(indexInflection) {
        let intervalExtrema = new SequenceOfIntervals_1.SequenceOfIntervals();
        if (this._indicesOfInflections.length === 0 && this._sequence.length === 0) {
            intervalExtrema.span = ComparatorOfSequencesDiffEvents_1.CURVE_INTERVAL_SPAN;
            intervalExtrema.sequence.push(intervalExtrema.span);
        }
        else if (this._indicesOfInflections.length === 0 && this._sequence.length > 0) {
            intervalExtrema.span = ComparatorOfSequencesDiffEvents_1.CURVE_INTERVAL_SPAN;
            intervalExtrema.sequence.push(this._sequence[0].location - ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL);
            for (let k = 0; k < this._sequence.length - 1; k += 1) {
                intervalExtrema.sequence.push(this._sequence[k + 1].location - this._sequence[k].location);
            }
            intervalExtrema.sequence.push(ComparatorOfSequencesDiffEvents_1.UPPER_BOUND_CURVE_INTERVAL - this._sequence[this._sequence.length - 1].location);
        }
        else if (indexInflection === this._indicesOfInflections.length) {
            intervalExtrema.span = ComparatorOfSequencesDiffEvents_1.UPPER_BOUND_CURVE_INTERVAL - this._sequence[this._indicesOfInflections[indexInflection - 1]].location;
            for (let k = this._indicesOfInflections[this._indicesOfInflections.length - 1]; k < this._sequence.length - 1; k += 1) {
                intervalExtrema.sequence.push(this._sequence[k + 1].location - this._sequence[k].location);
            }
            intervalExtrema.sequence.push(ComparatorOfSequencesDiffEvents_1.UPPER_BOUND_CURVE_INTERVAL - this._sequence[this._sequence.length - 1].location);
        }
        else if (indexInflection === 0 && this._indicesOfInflections[0] > 0) {
            intervalExtrema.span = this._sequence[this._indicesOfInflections[indexInflection]].location - ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL;
            intervalExtrema.sequence.push(this._sequence[0].location - ComparatorOfSequencesDiffEvents_1.LOWER_BOUND_CURVE_INTERVAL);
            for (let k = 1; k < this._indicesOfInflections[indexInflection]; k += 1) {
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
            for (let k = this._indicesOfInflections[indexInflection - 1] + 1; k < this._indicesOfInflections[indexInflection]; k += 1) {
                intervalExtrema.sequence.push(this._sequence[k].location - this._sequence[k - 1].location);
            }
            intervalExtrema.sequence.push(this._sequence[this._indicesOfInflections[indexInflection]].location - this._sequence[this._indicesOfInflections[indexInflection] - 1].location);
        }
        return intervalExtrema;
    }
    checkTypeConsistency() {
        if (this._sequence.length === 0)
            return;
        let currentOrder = this._sequence[0].order;
        let index = 0;
        // Look for type consistency. If two successive differential events are inflections, the sequence is incorrect
        // All other configurations are valid
        for (let i = 1; i < this._sequence.length; i += 1) {
            if (currentOrder === DifferentialEvent_2.ORDER_INFLECTION && this._sequence[i].order === DifferentialEvent_2.ORDER_INFLECTION) {
                index = i;
                break;
            }
            else {
                currentOrder = this._sequence[i].order;
            }
        }
        if (index > 0) {
            const message = "Inconsistent sequence of differential events: two successive inflections at indices " + (index - 1) + " and " + index;
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkTypeConsistency", message);
            error.logMessage();
        }
    }
    checkLocationConsistency() {
        if (this._sequence.length === 0)
            return;
        let index = 0;
        // Look for location consistency. The sequence of abscissae must be strictly increasing
        for (let i = 1; i < this._sequence.length; i += 1) {
            if (this._sequence[i].location > this._sequence[i - 1].location) {
                continue;
            }
            else {
                index = i;
                break;
            }
        }
        if (index > 0) {
            const message = "Inconsistent sequence of differential events: two successive events have non strictly increasing abscissa at indices " +
                (index - 1) + " and " + index + " with values " + this._sequence[index - 1].location + " and " + this._sequence[index].location;
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkLocationConsistency", message);
            error.logMessage();
        }
    }
    checkSequenceConsistency() {
        this.checkTypeConsistency();
        this.checkLocationConsistency();
    }
    checkConsistencyIntervalBtwInflections(modifiedEvent) {
        const inflectionIndex = modifiedEvent.indexInflection;
        const nbModifiedEvents = modifiedEvent.nbEvents;
        if (this._indicesOfInflections.length > 2) {
            if (inflectionIndex > 0) {
                if (nbModifiedEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR && this._indicesOfInflections[inflectionIndex] - this._indicesOfInflections[inflectionIndex - 1] < exports.MIN_NB_INTERVALS_BTW_INFL_2CEXT_REMOVED) {
                    /* JCL A minimum of four intervals is required to obtain a meaningful loss of curvature extrema */
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencyIntervalBtwInflections", "Inconsistent number of curvature extrema in the current interval of inflections. Number too small for curvature extrema removal.");
                    error.logMessage();
                }
                else if (nbModifiedEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR && this._indicesOfInflections[inflectionIndex] - this._indicesOfInflections[inflectionIndex - 1] < exports.MIN_NB_INTERVALS_BTW_INFL_2CEXT_ADDED) {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencyIntervalBtwInflections", "Inconsistent number of curvature extrema in the current interval of inflections. Number too small for curvature extrema insertion.");
                    error.logMessage();
                }
            }
        }
        else if ((inflectionIndex === 0 || inflectionIndex === this._indicesOfInflections.length) && this._indicesOfInflections.length > 0) {
            if (nbModifiedEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR && inflectionIndex === 0 && this._indicesOfInflections[inflectionIndex] < exports.MIN_NB_INTERVALS_BEFORE_AFTER_INFL_2CEXT_REMOVED) {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencyIntervalBtwInflections", "Inconsistent number of curvature extrema in the first interval of inflections. Number too small.");
                error.logMessage();
            }
            else if (nbModifiedEvents === ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR && inflectionIndex === this._indicesOfInflections.length && this._indicesOfInflections.length - this._indicesOfInflections[inflectionIndex - 1] < exports.MIN_NB_INTERVALS_BEFORE_AFTER_INFL_2CEXT_REMOVED) {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencyIntervalBtwInflections", "Inconsistent number of curvature extrema in the last interval of inflections. Number too small.");
                error.logMessage();
            }
        }
    }
    clone() {
        let sequence = new SequenceOfDifferentialEvents();
        for (let event = 0; event < this._sequence.length; event++) {
            sequence.insertAt(this.eventAt(event), event);
        }
        sequence._indicesOfInflections = sequence.generateIndicesInflection();
        return sequence;
    }
    clear() {
        this._sequence = [];
        this._indicesOfInflections = this.generateIndicesInflection();
    }
}
exports.SequenceOfDifferentialEvents = SequenceOfDifferentialEvents;
function deepCopySequenceOfDifferentialEvents(sequenceDifEvents) {
    const sequence = new SequenceOfDifferentialEvents();
    sequence.sequence = sequenceDifEvents.sequence;
    sequence.indicesOfInflections = sequenceDifEvents.indicesOfInflections;
    return sequence;
}
exports.deepCopySequenceOfDifferentialEvents = deepCopySequenceOfDifferentialEvents;
