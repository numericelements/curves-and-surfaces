"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum = exports.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum = exports.LocalizerOfInflectionsAdjacentCurvatureExtremum = exports.LocalizerOfInflectionDisappearingInExtremeInterval = exports.LocalizerOfInflectionAppearingInExtremeInterval = exports.LocalizerOfInflectionInExtremeInterval = exports.LocalizerOfInflectionAppearingInUniqueInterval = exports.LocalizerOfInflectionDisappearingInUniqueInterval = exports.LocalizerOfInflectionInUniqueInterval = exports.LocalizerOfCurvatureExtremaDisappearing = exports.LocalizerOfCurvatureExtremaAppearing = exports.LocalizerOfCurvatureExtrema = exports.LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval = exports.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval = exports.LocalizerOfCurvatureExtremumInsideUniqueInterval = exports.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval = exports.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval = exports.LocalizerOfCurvatureExtremumInsideExtremeInterval = exports.LocalizerOfDifferentialEvents = exports.intervalLocation = void 0;
const ComparatorOfSequencesOfIntervals_1 = require("./ComparatorOfSequencesOfIntervals");
const NeighboringEvents_1 = require("./NeighboringEvents");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
/* named constants */
const ComparatorOfSequencesDiffEvents_1 = require("./ComparatorOfSequencesDiffEvents");
const NeighboringEvents_2 = require("./NeighboringEvents");
const DifferentialEvent_1 = require("./DifferentialEvent");
var intervalLocation;
(function (intervalLocation) {
    intervalLocation[intervalLocation["first"] = 0] = "first";
    intervalLocation[intervalLocation["last"] = 1] = "last";
})(intervalLocation = exports.intervalLocation || (exports.intervalLocation = {}));
class LocalizerOfDifferentialEvents {
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
    constructor(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        this._sequenceDiffEvents1 = sequenceDiffEvents1;
        this._sequenceDiffEvents2 = sequenceDiffEvents2;
        this.location = indexInflection;
    }
    get sequenceDiffEvents1() {
        return this._sequenceDiffEvents1;
    }
    get sequenceDiffEvents2() {
        return this._sequenceDiffEvents2;
    }
}
exports.LocalizerOfDifferentialEvents = LocalizerOfDifferentialEvents;
class LocalizerOfCurvatureExtremumInsideExtremeInterval extends LocalizerOfDifferentialEvents {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        if (this.sequenceDiffEvents1.indicesOfInflections.length === 0) {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "This class is inapropriate to handle the sequence 'sequence1' of differential events input.");
            error.logMessage();
        }
        else if (this.sequenceDiffEvents2.indicesOfInflections.length === 0) {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "This class is inapropriate to handle the sequence 'sequence2' of differential events input.");
            error.logMessage();
        }
        this.intervalsBtwExtrema1 = this.sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(this.location);
        this.intervalsBtwExtrema2 = this.sequenceDiffEvents2.computeIntervalsBtwCurvatureExtrema(this.location);
        this.comparatorSequenceOfIntervals = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(this.intervalsBtwExtrema1, this.intervalsBtwExtrema2);
    }
    assignNewEventInExtremeInterval(sequenceDiffEvents, candidateEventIndex, indexMaxInterVar, nbEventsModified) {
        let newEvent = new NeighboringEvents_1.NeighboringEvents();
        if (this.location === sequenceDiffEvents.indicesOfInflections.length && nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
            if (candidateEventIndex !== NeighboringEvents_2.INITIAL_INTERV_INDEX && (candidateEventIndex !== this.intervalsBtwExtrema2.sequence.length - 1 || indexMaxInterVar !== this.intervalsBtwExtrema2.sequence.length - 1)) {
                /* Temporary statement. Should evolve to decide whether to process it as an error or not */
                // newEvent.type = NeighboringEventsType.none;
                console.log("A first evaluation of intervals between events shows that the event identified may be inconsistent.");
            }
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringCurExtremumRightBoundary;
            newEvent.index = sequenceDiffEvents.sequence.length - 1;
        }
        else if (this.location === sequenceDiffEvents.indicesOfInflections.length && nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
            if (candidateEventIndex !== NeighboringEvents_2.INITIAL_INTERV_INDEX && (candidateEventIndex !== this.intervalsBtwExtrema1.sequence.length - 1 || indexMaxInterVar !== this.intervalsBtwExtrema1.sequence.length - 1)) {
                /* Temporary statement. Should evolve to decide whether to process it as an error or not */
                // newEvent.type = NeighboringEventsType.none;
                console.log("A first evaluation of intervals between events shows that the event identified may be inconsistent.");
            }
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringCurExtremumRightBoundary;
            newEvent.index = sequenceDiffEvents.sequence.length - 1;
        }
        else {
            if (candidateEventIndex !== NeighboringEvents_2.INITIAL_INTERV_INDEX && (candidateEventIndex !== 0 || indexMaxInterVar !== 0)) {
                /* Temporary statement. Should evolve to decide whether to process it as an error or not */
                // newEvent.type = NeighboringEventsType.none;
                console.log("A first evaluation of intervals between events shows that the event identified may be inconsistent.");
            }
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringCurExtremumLeftBoundary;
            newEvent.index = 0;
        }
        return newEvent;
    }
    analyzeExtremeIntervalVariations(nbEventsModified) {
        let modifiedEventIndex = NeighboringEvents_2.INITIAL_INTERV_INDEX;
        let ratio = 0.0;
        this.checkIndexConsistency(this.location);
        if (this.intervalsBtwExtrema2.sequence.length > 0 && nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
            if (this.location === this.sequenceDiffEvents1.indicesOfInflections.length) {
                ratio = this.variationOfExtremeInterval(intervalLocation.last, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
                modifiedEventIndex = this.intervalsBtwExtrema1.sequence.length - 1;
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderForwardScan(modifiedEventIndex - 1, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
            }
            else if (this.location === 0) {
                ratio = this.variationOfExtremeInterval(intervalLocation.first, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
                modifiedEventIndex = 0;
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderReverseScan(modifiedEventIndex, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL);
            }
            if (this.comparatorSequenceOfIntervals.maxVariationInSeq1.value > ratio) {
                modifiedEventIndex = this.comparatorSequenceOfIntervals.maxVariationInSeq1.index;
            }
        }
        else if (nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
            if (this.location === this.sequenceDiffEvents1.indicesOfInflections.length) {
                modifiedEventIndex = this.intervalsBtwExtrema1.sequence.length - 1;
            }
            else
                modifiedEventIndex = 0;
        }
        else if (this.intervalsBtwExtrema1.sequence.length > 0 && nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
            if (this.location === this.sequenceDiffEvents1.indicesOfInflections.length) {
                ratio = this.variationOfExtremeInterval(intervalLocation.last, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
                modifiedEventIndex = this.intervalsBtwExtrema2.sequence.length - 1; // a voir
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderForwardScan(modifiedEventIndex - 1, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
            }
            else if (this.location === 0) {
                ratio = this.variationOfExtremeInterval(intervalLocation.first, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
                modifiedEventIndex = 0;
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderReverseScan(modifiedEventIndex, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
            }
            if (this.comparatorSequenceOfIntervals.maxVariationInSeq1.value > ratio) {
                modifiedEventIndex = this.comparatorSequenceOfIntervals.maxVariationInSeq1.index;
            }
        }
        else if (nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
            if (this.location === this.sequenceDiffEvents1.indicesOfInflections.length) {
                modifiedEventIndex = this.intervalsBtwExtrema2.sequence.length - 1;
            }
            else
                modifiedEventIndex = 0;
        }
        return modifiedEventIndex;
    }
    variationOfExtremeInterval(interval, nbEventsModified) {
        let ratio = 0.0;
        if (nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
            if (interval === intervalLocation.last) {
                ratio = (this.intervalsBtwExtrema2.sequence[this.intervalsBtwExtrema2.sequence.length - 1] / this.intervalsBtwExtrema2.span) / (this.intervalsBtwExtrema1.sequence[this.intervalsBtwExtrema1.sequence.length - 1] / this.intervalsBtwExtrema1.span);
            }
            else if (interval === intervalLocation.first) {
                ratio = (this.intervalsBtwExtrema2.sequence[0] / this.intervalsBtwExtrema2.span) / (this.intervalsBtwExtrema1.sequence[0] / this.intervalsBtwExtrema1.span);
            }
        }
        else if (nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
            if (interval === intervalLocation.last) {
                ratio = (this.intervalsBtwExtrema1.sequence[this.intervalsBtwExtrema1.sequence.length - 1] / this.intervalsBtwExtrema1.span) / (this.intervalsBtwExtrema2.sequence[this.intervalsBtwExtrema2.sequence.length - 1] / this.intervalsBtwExtrema2.span);
            }
            else if (interval === intervalLocation.first) {
                ratio = (this.intervalsBtwExtrema1.sequence[0] / this.intervalsBtwExtrema1.span) / (this.intervalsBtwExtrema2.sequence[0] / this.intervalsBtwExtrema2.span);
            }
        }
        return ratio;
    }
    checkIndexConsistency(indexInflection) {
        if ((indexInflection !== this.sequenceDiffEvents1.indicesOfInflections.length && indexInflection !== 0 && this.sequenceDiffEvents1.indicesOfInflections.length > 0)
            || (indexInflection !== 0 && this.sequenceDiffEvents1.indicesOfInflections.length === 0)) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkIndexConsistency", "Index of inflection in the sequence of differerntial events is invalid.");
            error.logMessage();
        }
    }
}
exports.LocalizerOfCurvatureExtremumInsideExtremeInterval = LocalizerOfCurvatureExtremumInsideExtremeInterval;
class LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval extends LocalizerOfCurvatureExtremumInsideExtremeInterval {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.ONE_EVENT_APPEAR = ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL;
        this.candidateEventIndex = this.intervalsBtwExtrema2.indexSmallestInterval(this.ONE_EVENT_APPEAR);
    }
    locateDifferentialEvents() {
        let indexMaxInterVar = this.analyzeExtremeIntervalVariations(this.ONE_EVENT_APPEAR);
        return this.assignNewEventInExtremeInterval(this.sequenceDiffEvents2, this.candidateEventIndex, indexMaxInterVar, this.ONE_EVENT_APPEAR);
    }
}
exports.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval = LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval;
class LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval extends LocalizerOfCurvatureExtremumInsideExtremeInterval {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.ONE_EVENT_DISAPPEAR = ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL;
        this.candidateEventIndex = this.intervalsBtwExtrema1.indexSmallestInterval(this.ONE_EVENT_DISAPPEAR);
    }
    locateDifferentialEvents() {
        let indexMaxInterVar = this.analyzeExtremeIntervalVariations(this.ONE_EVENT_DISAPPEAR);
        return this.assignNewEventInExtremeInterval(this.sequenceDiffEvents1, this.candidateEventIndex, indexMaxInterVar, this.ONE_EVENT_DISAPPEAR);
    }
}
exports.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval = LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval;
class LocalizerOfCurvatureExtremumInsideUniqueInterval extends LocalizerOfDifferentialEvents {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        const indexInflection = 0;
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        if (this.sequenceDiffEvents1.indicesOfInflections.length !== 0) {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "This class is inapropriate to handle the sequence 'sequence1' of differential events input.");
            error.logMessage();
        }
        else if (this.sequenceDiffEvents2.indicesOfInflections.length !== 0) {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "This class is inapropriate to handle the sequence 'sequence2' of differential events input.");
            error.logMessage();
        }
        this.intervalsBtwExtrema1 = this.sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(this.location);
        this.intervalsBtwExtrema2 = this.sequenceDiffEvents2.computeIntervalsBtwCurvatureExtrema(this.location);
        this.comparatorSequenceOfIntervals = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(this.intervalsBtwExtrema1, this.intervalsBtwExtrema2);
    }
    assignNewEventInUniqueInterval(sequenceDiffEvents, candidateEventIndex, nbEventsModified) {
        let newEvent = new NeighboringEvents_1.NeighboringEvents();
        newEvent.type = NeighboringEvents_2.NeighboringEventsType.none;
        if (candidateEventIndex === 0) {
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringCurExtremumLeftBoundary;
            newEvent.index = 0;
        }
        else if ((candidateEventIndex === this.intervalsBtwExtrema2.sequence.length - 1 && nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) ||
            (candidateEventIndex === this.intervalsBtwExtrema1.sequence.length - 1 && nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL)) {
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringCurExtremumRightBoundary;
            newEvent.index = sequenceDiffEvents.sequence.length - 1;
        }
        else {
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.none;
            newEvent.index = candidateEventIndex;
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "assignNewEventInUniqueInterval", "Inconsistent identification of curvature extremum. Possibly extremum at a knot.");
            warning.logMessage();
        }
        return newEvent;
    }
    analyzeUniqueIntervalVariations(candidateEventIndex, nbEventsModified) {
        let modifiedEventIndex = NeighboringEvents_2.INITIAL_INTERV_INDEX;
        let ratioLeft = 0.0, ratioRight = 0.0;
        if ((nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && this.intervalsBtwExtrema1.sequence.length > 0) ||
            (nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && this.intervalsBtwExtrema2.sequence.length > 0)) {
            ratioLeft = this.variationOfExtremeInterval(intervalLocation.first, nbEventsModified);
            ratioRight = this.variationOfExtremeInterval(intervalLocation.last, nbEventsModified);
            if (ratioLeft > ratioRight) {
                modifiedEventIndex = 0;
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderReverseScan(modifiedEventIndex, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
                if (this.comparatorSequenceOfIntervals.maxVariationInSeq1.value > ratioLeft) {
                    modifiedEventIndex = this.comparatorSequenceOfIntervals.maxVariationInSeq1.index;
                }
            }
            else {
                if (nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
                    modifiedEventIndex = this.intervalsBtwExtrema2.sequence.length - 1;
                }
                else if (nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
                    modifiedEventIndex = this.intervalsBtwExtrema1.sequence.length - 1;
                }
                this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderForwardScan(modifiedEventIndex - 1, ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL);
                if (this.comparatorSequenceOfIntervals.maxVariationInSeq1.value > ratioRight) {
                    modifiedEventIndex = this.comparatorSequenceOfIntervals.maxVariationInSeq1.index;
                }
            }
        }
        else if (nbEventsModified !== ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && nbEventsModified !== ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "analyzeUniqueIntervalVariations", "Incorrect number of modified differential events.");
            error.logMessage();
        }
        else {
            if (nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
                modifiedEventIndex = candidateEventIndex;
            }
            else if (nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
                modifiedEventIndex = 0;
            }
        }
        if (candidateEventIndex !== NeighboringEvents_2.INITIAL_INTERV_INDEX) {
            if (this.sequenceDiffEvents1.indicesOfInflections.length === 0) {
                if (modifiedEventIndex === candidateEventIndex) {
                    const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "analyzeUniqueIntervalVariations", "Events are stable as well as the candidate event.");
                    warning.logMessage();
                }
                else {
                    const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "analyzeUniqueIntervalVariations", "Other events variations may influence the decision about the candidate event.");
                    warning.logMessage();
                    if (!(ratioLeft > ratioRight && candidateEventIndex === 0)) {
                        modifiedEventIndex = 0;
                    }
                    else if (!(ratioLeft < ratioRight && candidateEventIndex === this.intervalsBtwExtrema1.sequence.length - 1) && nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
                        modifiedEventIndex = this.intervalsBtwExtrema1.sequence.length - 1;
                    }
                    else if (!(ratioLeft < ratioRight && candidateEventIndex === this.intervalsBtwExtrema2.sequence.length - 1) && nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
                        modifiedEventIndex = this.intervalsBtwExtrema2.sequence.length - 1;
                    }
                }
            }
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "analyzeUniqueIntervalVariations", "Unable to generate the smallest interval of differential events for this curve.");
            error.logMessage();
        }
        return modifiedEventIndex;
    }
    variationOfExtremeInterval(interval, nbEventsModified) {
        let ratio = 0.0;
        if (nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL) {
            if (interval === intervalLocation.last) {
                ratio = (this.intervalsBtwExtrema2.sequence[this.intervalsBtwExtrema2.sequence.length - 1] / this.intervalsBtwExtrema2.span) / (this.intervalsBtwExtrema1.sequence[this.intervalsBtwExtrema1.sequence.length - 1] / this.intervalsBtwExtrema1.span);
            }
            else if (interval === intervalLocation.first) {
                ratio = (this.intervalsBtwExtrema2.sequence[0] / this.intervalsBtwExtrema2.span) / (this.intervalsBtwExtrema1.sequence[0] / this.intervalsBtwExtrema1.span);
            }
        }
        else if (nbEventsModified === ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL) {
            if (interval === intervalLocation.last) {
                ratio = (this.intervalsBtwExtrema1.sequence[this.intervalsBtwExtrema1.sequence.length - 1] / this.intervalsBtwExtrema1.span) / (this.intervalsBtwExtrema2.sequence[this.intervalsBtwExtrema2.sequence.length - 1] / this.intervalsBtwExtrema2.span);
            }
            else if (interval === intervalLocation.first) {
                ratio = (this.intervalsBtwExtrema1.sequence[0] / this.intervalsBtwExtrema1.span) / (this.intervalsBtwExtrema2.sequence[0] / this.intervalsBtwExtrema2.span);
            }
        }
        return ratio;
    }
}
exports.LocalizerOfCurvatureExtremumInsideUniqueInterval = LocalizerOfCurvatureExtremumInsideUniqueInterval;
class LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval extends LocalizerOfCurvatureExtremumInsideUniqueInterval {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
        this.ONE_EVENT_APPEAR = ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL;
        this.candidateEventIndex = this.intervalsBtwExtrema2.indexSmallestInterval(this.ONE_EVENT_APPEAR);
    }
    locateDifferentialEvents() {
        this.candidateEventIndex = this.analyzeUniqueIntervalVariations(this.candidateEventIndex, this.ONE_EVENT_APPEAR);
        return this.assignNewEventInUniqueInterval(this.sequenceDiffEvents2, this.candidateEventIndex, this.ONE_EVENT_APPEAR);
    }
}
exports.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval = LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval;
class LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval extends LocalizerOfCurvatureExtremumInsideUniqueInterval {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
        this.ONE_EVENT_DISAPPEAR = ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL;
        this.candidateEventIndex = this.intervalsBtwExtrema1.indexSmallestInterval(this.ONE_EVENT_DISAPPEAR);
    }
    locateDifferentialEvents() {
        this.candidateEventIndex = this.analyzeUniqueIntervalVariations(this.candidateEventIndex, this.ONE_EVENT_DISAPPEAR);
        return this.assignNewEventInUniqueInterval(this.sequenceDiffEvents1, this.candidateEventIndex, this.ONE_EVENT_DISAPPEAR);
    }
}
exports.LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval = LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval;
class LocalizerOfCurvatureExtrema extends LocalizerOfDifferentialEvents {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.intervalsBtwExtrema1 = this.sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(this.location);
        this.intervalsBtwExtrema2 = this.sequenceDiffEvents2.computeIntervalsBtwCurvatureExtrema(this.location);
        this.comparatorSequenceOfIntervals = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(this.intervalsBtwExtrema1, this.intervalsBtwExtrema2);
    }
    assignNewEvent(sequenceDiffEvents, candidateEventIndex) {
        let newEvent = new NeighboringEvents_1.NeighboringEvents();
        newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringCurvatureExtrema;
        if (sequenceDiffEvents.indicesOfInflections.length === 0 || this.location === 0) {
            /* JCL To avoid use of incorrect indices */
            if (candidateEventIndex === sequenceDiffEvents.length()) {
                newEvent.index = candidateEventIndex - 2;
                console.log("Probably incorrect identification of events indices close to curve extremity.");
            }
            else if (candidateEventIndex === NeighboringEvents_2.INITIAL_INTERV_INDEX) {
                newEvent.index = 0;
                console.log("Probably incorrect identification of events indices close to curve origin.");
            }
            else {
                /* JCL Set the effectively computed event index*/
                newEvent.index = candidateEventIndex - 1;
            }
        }
        else if (this.location === sequenceDiffEvents.indicesOfInflections.length) {
            /* JCL To avoid use of incorrect indices */
            if (sequenceDiffEvents.indicesOfInflections[sequenceDiffEvents.indicesOfInflections.length - 1] + candidateEventIndex === sequenceDiffEvents.length() - 1) {
                newEvent.index = sequenceDiffEvents.indicesOfInflections[sequenceDiffEvents.indicesOfInflections.length - 1] + candidateEventIndex - 1;
                console.log("Probably incorrect identification of events indices.");
            }
            else {
                /* JCL Set the effectively computed event index*/
                newEvent.index = sequenceDiffEvents.indicesOfInflections[sequenceDiffEvents.indicesOfInflections.length - 1] + candidateEventIndex;
            }
        }
        else {
            newEvent.index = sequenceDiffEvents.indicesOfInflections[this.location - 1] + candidateEventIndex;
        }
        return newEvent;
    }
    analyzeIntervalVariations(candidateEventIndex, nbEventsModified) {
        let modifiedEventIndex = candidateEventIndex;
        this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderForwardScan(candidateEventIndex, nbEventsModified);
        let maxRatioF = this.comparatorSequenceOfIntervals.maxVariationInSeq1;
        this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderReverseScan(candidateEventIndex, nbEventsModified);
        let maxRatioR = this.comparatorSequenceOfIntervals.maxVariationInSeq1;
        if (candidateEventIndex !== NeighboringEvents_2.INITIAL_INTERV_INDEX) {
            if (this.intervalsBtwExtrema1.sequence.length > 0) {
                if (maxRatioF.index === maxRatioR.index && maxRatioF.index === (candidateEventIndex - 1)) {
                    let warning = new ErrorLoging_1.WarningLog(this.constructor.name, "analyzeIntervalVariations", "Events are stable as well as the candidate events.");
                    warning.logMessage();
                }
                else if (maxRatioF.index !== (candidateEventIndex - 1) || maxRatioR.index !== (candidateEventIndex - 1)) {
                    let warning = new ErrorLoging_1.WarningLog(this.constructor.name, "analyzeIntervalVariations", "The candidate events are not the ones added.");
                    warning.logMessage();
                    /* Current assumption consists in considering an adjacent interval as candidate */
                    if (maxRatioF.value > maxRatioR.value) {
                        modifiedEventIndex = maxRatioF.index - 1;
                    }
                    else
                        modifiedEventIndex = maxRatioF.index + 1;
                }
                else {
                    let warning = new ErrorLoging_1.WarningLog(this.constructor.name, "analyzeIntervalVariations", "Events are not stable enough.");
                    warning.logMessage();
                }
            }
            else {
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
        }
        else {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "analyzeIntervalVariations", "Incorrect number of modified differential events.");
            error.logMessage();
        }
        return modifiedEventIndex;
    }
}
exports.LocalizerOfCurvatureExtrema = LocalizerOfCurvatureExtrema;
class LocalizerOfCurvatureExtremaAppearing extends LocalizerOfCurvatureExtrema {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.candidateEventIndex = this.intervalsBtwExtrema2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
    }
    locateDifferentialEvents() {
        this.candidateEventIndex = this.analyzeIntervalVariations(this.candidateEventIndex, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        return this.assignNewEvent(this.sequenceDiffEvents2, this.candidateEventIndex);
    }
}
exports.LocalizerOfCurvatureExtremaAppearing = LocalizerOfCurvatureExtremaAppearing;
class LocalizerOfCurvatureExtremaDisappearing extends LocalizerOfCurvatureExtrema {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        super(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection);
        this.candidateEventIndex = this.intervalsBtwExtrema1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
    }
    locateDifferentialEvents() {
        this.candidateEventIndex = this.analyzeIntervalVariations(this.candidateEventIndex, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        return this.assignNewEvent(this.sequenceDiffEvents1, this.candidateEventIndex);
    }
}
exports.LocalizerOfCurvatureExtremaDisappearing = LocalizerOfCurvatureExtremaDisappearing;
class LocalizerOfInflectionInUniqueInterval extends LocalizerOfDifferentialEvents {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        const index = NeighboringEvents_2.INITIAL_INTERV_INDEX;
        super(sequenceDiffEvents1, sequenceDiffEvents2, index);
        this.inflectionVariation = this.sequenceDiffEvents1.indicesOfInflections.length - this.sequenceDiffEvents2.indicesOfInflections.length;
    }
    analyzeIntervalVariations(sequenceDiffEvents) {
        let index;
        let intervalExtrema = [];
        if (sequenceDiffEvents.indicesOfInflections.length === 1) {
            if (sequenceDiffEvents.eventAt(0).order === DifferentialEvent_1.ORDER_INFLECTION) {
                intervalExtrema.push(sequenceDiffEvents.eventAt(0).location);
            }
            else if (sequenceDiffEvents.eventAt(sequenceDiffEvents.length() - 1).order === DifferentialEvent_1.ORDER_INFLECTION) {
                intervalExtrema.push(sequenceDiffEvents.eventAt(sequenceDiffEvents.length() - 1).location);
            }
            intervalExtrema.push(ComparatorOfSequencesDiffEvents_1.UPPER_BOUND_CURVE_INTERVAL - sequenceDiffEvents.eventAt(sequenceDiffEvents.indicesOfInflections[sequenceDiffEvents.indicesOfInflections.length - 1]).location);
        }
        else {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "analyzeIntervalVariations", "Inconsistent content of the sequence of events to identify the curve extremity where the inflection is lost.");
            error.logMessage();
        }
        if (intervalExtrema[0] > intervalExtrema[intervalExtrema.length - 1]) {
            index = sequenceDiffEvents.indicesOfInflections[sequenceDiffEvents.indicesOfInflections.length - 1];
            if (sequenceDiffEvents.length() === 1) {
                index = 1;
            }
        }
        else {
            index = 0;
        }
        return index;
    }
}
exports.LocalizerOfInflectionInUniqueInterval = LocalizerOfInflectionInUniqueInterval;
class LocalizerOfInflectionDisappearingInUniqueInterval extends LocalizerOfInflectionInUniqueInterval {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
    }
    locateDifferentialEvents() {
        let newEvent = new NeighboringEvents_1.NeighboringEvents();
        if (this.analyzeIntervalVariations(this.sequenceDiffEvents1) === 0 && this.inflectionVariation === 1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionLeftBoundary;
        }
        else if (this.analyzeIntervalVariations(this.sequenceDiffEvents1) === this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1]) {
            newEvent.index = this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1];
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionRightBoundary;
        }
        else if (this.analyzeIntervalVariations(this.sequenceDiffEvents1) === 1 && this.sequenceDiffEvents1.length() === 1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionRightBoundary;
        }
        else {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateDifferentialEvents", "Inconsistent index to locate an inflection into the unique interval.");
            error.logMessage();
        }
        return newEvent;
    }
}
exports.LocalizerOfInflectionDisappearingInUniqueInterval = LocalizerOfInflectionDisappearingInUniqueInterval;
class LocalizerOfInflectionAppearingInUniqueInterval extends LocalizerOfInflectionInUniqueInterval {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
    }
    locateDifferentialEvents() {
        let newEvent = new NeighboringEvents_1.NeighboringEvents();
        if (this.analyzeIntervalVariations(this.sequenceDiffEvents2) === 0 && this.inflectionVariation === -1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionLeftBoundary;
        }
        else if (this.analyzeIntervalVariations(this.sequenceDiffEvents2) === this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1]) {
            newEvent.index = this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1];
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionRightBoundary;
        }
        else if (this.analyzeIntervalVariations(this.sequenceDiffEvents2) === 1 && this.sequenceDiffEvents2.length() === 1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionRightBoundary;
        }
        else {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateDifferentialEvents", "Inconsistent index to locate an inflection into the unique interval.");
            error.logMessage();
        }
        return newEvent;
    }
}
exports.LocalizerOfInflectionAppearingInUniqueInterval = LocalizerOfInflectionAppearingInUniqueInterval;
class LocalizerOfInflectionInExtremeInterval extends LocalizerOfDifferentialEvents {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        const index = NeighboringEvents_2.INITIAL_INTERV_INDEX;
        super(sequenceDiffEvents1, sequenceDiffEvents2, index);
        this.inflectionVariation = this.sequenceDiffEvents1.indicesOfInflections.length - this.sequenceDiffEvents2.indicesOfInflections.length;
        if (this.inflectionVariation === 1 && this.sequenceDiffEvents1.indicesOfInflections.length === 1 ||
            this.inflectionVariation === -1 && this.sequenceDiffEvents1.indicesOfInflections.length === 0) {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Differential event sequence inadequate for this configuration.");
            error.logMessage();
        }
    }
    analyzeIntervalVariations() {
        let index = NeighboringEvents_2.INITIAL_INTERV_INDEX;
        if (this.sequenceDiffEvents1.eventAt(0).order === DifferentialEvent_1.ORDER_INFLECTION && this.sequenceDiffEvents2.eventAt(0).order !== DifferentialEvent_1.ORDER_INFLECTION ||
            this.sequenceDiffEvents2.eventAt(0).order === DifferentialEvent_1.ORDER_INFLECTION && this.sequenceDiffEvents1.eventAt(0).order !== DifferentialEvent_1.ORDER_INFLECTION) {
            index = 0;
        }
        else if (this.sequenceDiffEvents1.eventAt(this.sequenceDiffEvents1.length() - 1).order === DifferentialEvent_1.ORDER_INFLECTION && this.sequenceDiffEvents2.eventAt(this.sequenceDiffEvents2.length() - 1).order !== DifferentialEvent_1.ORDER_INFLECTION) {
            index = this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1];
        }
        else if (this.sequenceDiffEvents2.eventAt(this.sequenceDiffEvents2.length() - 1).order === DifferentialEvent_1.ORDER_INFLECTION && this.sequenceDiffEvents1.eventAt(this.sequenceDiffEvents1.length() - 1).order !== DifferentialEvent_1.ORDER_INFLECTION) {
            index = this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1];
        }
        return index;
    }
}
exports.LocalizerOfInflectionInExtremeInterval = LocalizerOfInflectionInExtremeInterval;
class LocalizerOfInflectionAppearingInExtremeInterval extends LocalizerOfInflectionInExtremeInterval {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
    }
    locateDifferentialEvents() {
        let newEvent = new NeighboringEvents_1.NeighboringEvents();
        if (this.analyzeIntervalVariations() === 0 && this.inflectionVariation === -1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionLeftBoundary;
        }
        else if (this.analyzeIntervalVariations() === this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1]) {
            newEvent.index = this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1];
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionRightBoundary;
        }
        else {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateDifferentialEvents", "Inconsistent index to locate an inflection into an extreme interval.");
            error.logMessage();
        }
        return newEvent;
    }
}
exports.LocalizerOfInflectionAppearingInExtremeInterval = LocalizerOfInflectionAppearingInExtremeInterval;
class LocalizerOfInflectionDisappearingInExtremeInterval extends LocalizerOfInflectionInExtremeInterval {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
    }
    locateDifferentialEvents() {
        let newEvent = new NeighboringEvents_1.NeighboringEvents();
        if (this.analyzeIntervalVariations() === 0 && this.inflectionVariation === 1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionLeftBoundary;
        }
        else if (this.analyzeIntervalVariations() === this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1]) {
            newEvent.index = this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1];
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionRightBoundary;
        }
        else {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateDifferentialEvents", " Inconsistent index to locate an inflection into an extreme interval.");
            error.logMessage();
        }
        return newEvent;
    }
}
exports.LocalizerOfInflectionDisappearingInExtremeInterval = LocalizerOfInflectionDisappearingInExtremeInterval;
class LocalizerOfInflectionsAdjacentCurvatureExtremum extends LocalizerOfDifferentialEvents {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        const index = NeighboringEvents_2.INITIAL_INTERV_INDEX;
        super(sequenceDiffEvents1, sequenceDiffEvents2, index);
        this.indicesOscillations1 = this.sequenceDiffEvents1.generateIndicesOscillations();
        this.indicesOscillations2 = this.sequenceDiffEvents2.generateIndicesOscillations();
        this.inflectionVariation = this.sequenceDiffEvents1.indicesOfInflections.length - this.sequenceDiffEvents2.indicesOfInflections.length;
    }
    analyzeIntervalVariations(indicesOscillations) {
        let intervalEvent = [];
        if (indicesOscillations.length > 0) {
            if (indicesOscillations[0] !== 0)
                intervalEvent.push(indicesOscillations[0]);
            for (let j = 0; j < indicesOscillations.length - 1; j += 1) {
                intervalEvent.push(indicesOscillations[j + 1] - indicesOscillations[j]);
            }
        }
        this.checkIndexLocation();
        return intervalEvent;
    }
    checkIndexLocation() {
        const nbModifedEvents = this.sequenceDiffEvents2.indicesOfInflections.length - this.sequenceDiffEvents1.indicesOfInflections.length;
        if (nbModifedEvents === ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_APPEAR) {
            if ((this.indicesOscillations2.length - this.indicesOscillations1.length === 1 && this.indicesOscillations1.length !== 0) ||
                (this.indicesOscillations2.length - this.indicesOscillations1.length === 2 && this.sequenceDiffEvents2.length() - this.sequenceDiffEvents1.length() !== 2) ||
                (this.indicesOscillations2.length - this.indicesOscillations1.length === 3 && this.indicesOscillations1.length > 0)) {
                let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkIndexLocation", "Inconsistency of reference type event that does not coincide with oscillation removal.");
                error.logMessage();
            }
        }
        else if (nbModifedEvents === ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
            if ((this.indicesOscillations2.length - this.indicesOscillations1.length === -1 && this.indicesOscillations2.length !== 0) ||
                (this.indicesOscillations2.length - this.indicesOscillations1.length === -2 && this.sequenceDiffEvents2.length() - this.sequenceDiffEvents1.length() !== -2) ||
                (this.indicesOscillations2.length - this.indicesOscillations1.length === -3 && this.indicesOscillations2.length > 0)) {
                let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkIndexLocation", "Inconsistency of reference type event that does not coincide with oscillation removal.");
                error.logMessage();
            }
        }
        else {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkIndexLocation", "Inconsistent variation of number of differential events.");
            error.logMessage();
        }
    }
    assignNewEvent(sequenceDiffEvents, nbModifedEvents) {
        let newEvent = new NeighboringEvents_1.NeighboringEvents();
        let intervalEvent1 = [];
        let intervalEvent2 = [];
        let indicesOscillations1 = [];
        let indicesOscillations2 = [];
        if (nbModifedEvents === ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
            intervalEvent1 = this.analyzeIntervalVariations(this.indicesOscillations1);
            intervalEvent2 = this.analyzeIntervalVariations(this.indicesOscillations2);
            indicesOscillations1 = this.indicesOscillations1;
            indicesOscillations2 = this.indicesOscillations2;
        }
        else if (nbModifedEvents === ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_APPEAR) {
            intervalEvent1 = this.analyzeIntervalVariations(this.indicesOscillations2);
            intervalEvent2 = this.analyzeIntervalVariations(this.indicesOscillations1);
            indicesOscillations1 = this.indicesOscillations2;
            indicesOscillations2 = this.indicesOscillations1;
        }
        else {
            let error = new ErrorLoging_1.ErrorLog(this.constructor.name, "assignNewEvent", "Incorrect number of modified differential events.");
            error.logMessage();
        }
        if (indicesOscillations1.length > 0) {
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionsCurvatureExtremum;
            if (indicesOscillations2.length === 0) {
                if (indicesOscillations1.length === 1) {
                    newEvent.index = indicesOscillations1[0];
                }
                else if (indicesOscillations1.length === 2) {
                    if (sequenceDiffEvents.eventAt(0).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
                        newEvent.index = indicesOscillations1[1];
                    }
                    else {
                        newEvent.index = indicesOscillations1[0];
                    }
                }
                else if (indicesOscillations1.length === 3) {
                    newEvent.index = indicesOscillations1[1];
                }
            }
            else {
                newEvent.index = NeighboringEvents_2.INITIAL_INTERV_INDEX;
                for (let k = 0; k < intervalEvent2.length; k += 1) {
                    if (intervalEvent1[k] !== intervalEvent2[k]) {
                        newEvent.index = indicesOscillations1[k];
                    }
                }
                if (indicesOscillations1.length - indicesOscillations2.length === 2 && newEvent.index === NeighboringEvents_2.INITIAL_INTERV_INDEX) {
                    newEvent.index = indicesOscillations1[indicesOscillations1.length - 1];
                }
            }
        }
        return newEvent;
    }
}
exports.LocalizerOfInflectionsAdjacentCurvatureExtremum = LocalizerOfInflectionsAdjacentCurvatureExtremum;
class LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum extends LocalizerOfInflectionsAdjacentCurvatureExtremum {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
    }
    locateDifferentialEvents() {
        return this.assignNewEvent(this.sequenceDiffEvents2, ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_DISAPPEAR);
    }
}
exports.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum = LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum;
class LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum extends LocalizerOfInflectionsAdjacentCurvatureExtremum {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        super(sequenceDiffEvents1, sequenceDiffEvents2);
    }
    locateDifferentialEvents() {
        return this.assignNewEvent(this.sequenceDiffEvents1, ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_APPEAR);
    }
}
exports.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum = LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum;
