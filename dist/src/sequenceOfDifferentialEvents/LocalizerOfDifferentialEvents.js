"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum = exports.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum = exports.LocalizerOfInflectionsAdjacentCurvatureExtremum = exports.LocalizerOfInflectionDisappearingInExtremeInterval = exports.LocalizerOfInflectionAppearingInExtremeInterval = exports.LocalizerOfInflectionInExtremeInterval = exports.LocalizerOfInflectionAppearingInUniqueInterval = exports.LocalizerOfInflectionDisappearingInUniqueInterval = exports.LocalizerOfInflectionInUniqueInterval = exports.LocalizerOfCurvatureExtremaDisappearing = exports.LocalizerOfCurvatureExtremaAppearing = exports.LocalizerOfCurvatureExtrema = exports.LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval = exports.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval = exports.LocalizerOfCurvatureExtremumInsideUniqueInterval = exports.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval = exports.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval = exports.LocalizerOfCurvatureExtremumInsideExtremeInterval = exports.LocalizerOfDifferentialEvents = exports.intervalLocation = void 0;
var ComparatorOfSequencesOfIntervals_1 = require("./ComparatorOfSequencesOfIntervals");
var NeighboringEvents_1 = require("./NeighboringEvents");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
/* named constants */
var ComparatorOfSequencesDiffEvents_1 = require("./ComparatorOfSequencesDiffEvents");
var NeighboringEvents_2 = require("./NeighboringEvents");
var DifferentialEvent_1 = require("./DifferentialEvent");
var intervalLocation;
(function (intervalLocation) {
    intervalLocation[intervalLocation["first"] = 0] = "first";
    intervalLocation[intervalLocation["last"] = 1] = "last";
})(intervalLocation = exports.intervalLocation || (exports.intervalLocation = {}));
var LocalizerOfDifferentialEvents = /** @class */ (function () {
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
    function LocalizerOfDifferentialEvents(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        this._sequenceDiffEvents1 = sequenceDiffEvents1;
        this._sequenceDiffEvents2 = sequenceDiffEvents2;
        this.location = indexInflection;
    }
    Object.defineProperty(LocalizerOfDifferentialEvents.prototype, "sequenceDiffEvents1", {
        get: function () {
            return this._sequenceDiffEvents1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LocalizerOfDifferentialEvents.prototype, "sequenceDiffEvents2", {
        get: function () {
            return this._sequenceDiffEvents2;
        },
        enumerable: false,
        configurable: true
    });
    return LocalizerOfDifferentialEvents;
}());
exports.LocalizerOfDifferentialEvents = LocalizerOfDifferentialEvents;
var LocalizerOfCurvatureExtremumInsideExtremeInterval = /** @class */ (function (_super) {
    __extends(LocalizerOfCurvatureExtremumInsideExtremeInterval, _super);
    function LocalizerOfCurvatureExtremumInsideExtremeInterval(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        var _this = _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) || this;
        if (_this.sequenceDiffEvents1.indicesOfInflections.length === 0) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "This class is inapropriate to handle the sequence 'sequence1' of differential events input.");
            error.logMessage();
        }
        else if (_this.sequenceDiffEvents2.indicesOfInflections.length === 0) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "This class is inapropriate to handle the sequence 'sequence2' of differential events input.");
            error.logMessage();
        }
        _this.intervalsBtwExtrema1 = _this.sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(_this.location);
        _this.intervalsBtwExtrema2 = _this.sequenceDiffEvents2.computeIntervalsBtwCurvatureExtrema(_this.location);
        _this.comparatorSequenceOfIntervals = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(_this.intervalsBtwExtrema1, _this.intervalsBtwExtrema2);
        return _this;
    }
    LocalizerOfCurvatureExtremumInsideExtremeInterval.prototype.assignNewEventInExtremeInterval = function (sequenceDiffEvents, candidateEventIndex, indexMaxInterVar, nbEventsModified) {
        var newEvent = new NeighboringEvents_1.NeighboringEvents();
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
    };
    LocalizerOfCurvatureExtremumInsideExtremeInterval.prototype.analyzeExtremeIntervalVariations = function (nbEventsModified) {
        var modifiedEventIndex = NeighboringEvents_2.INITIAL_INTERV_INDEX;
        var ratio = 0.0;
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
    };
    LocalizerOfCurvatureExtremumInsideExtremeInterval.prototype.variationOfExtremeInterval = function (interval, nbEventsModified) {
        var ratio = 0.0;
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
    };
    LocalizerOfCurvatureExtremumInsideExtremeInterval.prototype.checkIndexConsistency = function (indexInflection) {
        if ((indexInflection !== this.sequenceDiffEvents1.indicesOfInflections.length && indexInflection !== 0 && this.sequenceDiffEvents1.indicesOfInflections.length > 0)
            || (indexInflection !== 0 && this.sequenceDiffEvents1.indicesOfInflections.length === 0)) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkIndexConsistency", "Index of inflection in the sequence of differerntial events is invalid.");
            error.logMessage();
        }
    };
    return LocalizerOfCurvatureExtremumInsideExtremeInterval;
}(LocalizerOfDifferentialEvents));
exports.LocalizerOfCurvatureExtremumInsideExtremeInterval = LocalizerOfCurvatureExtremumInsideExtremeInterval;
var LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval = /** @class */ (function (_super) {
    __extends(LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval, _super);
    function LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        var _this = _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) || this;
        _this.ONE_EVENT_APPEAR = ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL;
        _this.candidateEventIndex = _this.intervalsBtwExtrema2.indexSmallestInterval(_this.ONE_EVENT_APPEAR);
        return _this;
    }
    LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval.prototype.locateDifferentialEvents = function () {
        var indexMaxInterVar = this.analyzeExtremeIntervalVariations(this.ONE_EVENT_APPEAR);
        return this.assignNewEventInExtremeInterval(this.sequenceDiffEvents2, this.candidateEventIndex, indexMaxInterVar, this.ONE_EVENT_APPEAR);
    };
    return LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval;
}(LocalizerOfCurvatureExtremumInsideExtremeInterval));
exports.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval = LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval;
var LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval = /** @class */ (function (_super) {
    __extends(LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval, _super);
    function LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        var _this = _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) || this;
        _this.ONE_EVENT_DISAPPEAR = ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL;
        _this.candidateEventIndex = _this.intervalsBtwExtrema1.indexSmallestInterval(_this.ONE_EVENT_DISAPPEAR);
        return _this;
    }
    LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval.prototype.locateDifferentialEvents = function () {
        var indexMaxInterVar = this.analyzeExtremeIntervalVariations(this.ONE_EVENT_DISAPPEAR);
        return this.assignNewEventInExtremeInterval(this.sequenceDiffEvents1, this.candidateEventIndex, indexMaxInterVar, this.ONE_EVENT_DISAPPEAR);
    };
    return LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval;
}(LocalizerOfCurvatureExtremumInsideExtremeInterval));
exports.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval = LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval;
var LocalizerOfCurvatureExtremumInsideUniqueInterval = /** @class */ (function (_super) {
    __extends(LocalizerOfCurvatureExtremumInsideUniqueInterval, _super);
    function LocalizerOfCurvatureExtremumInsideUniqueInterval(sequenceDiffEvents1, sequenceDiffEvents2) {
        var _this = this;
        var indexInflection = 0;
        _this = _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) || this;
        if (_this.sequenceDiffEvents1.indicesOfInflections.length !== 0) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "This class is inapropriate to handle the sequence 'sequence1' of differential events input.");
            error.logMessage();
        }
        else if (_this.sequenceDiffEvents2.indicesOfInflections.length !== 0) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "This class is inapropriate to handle the sequence 'sequence2' of differential events input.");
            error.logMessage();
        }
        _this.intervalsBtwExtrema1 = _this.sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(_this.location);
        _this.intervalsBtwExtrema2 = _this.sequenceDiffEvents2.computeIntervalsBtwCurvatureExtrema(_this.location);
        _this.comparatorSequenceOfIntervals = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(_this.intervalsBtwExtrema1, _this.intervalsBtwExtrema2);
        return _this;
    }
    LocalizerOfCurvatureExtremumInsideUniqueInterval.prototype.assignNewEventInUniqueInterval = function (sequenceDiffEvents, candidateEventIndex, nbEventsModified) {
        var newEvent = new NeighboringEvents_1.NeighboringEvents();
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
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "assignNewEventInUniqueInterval", "Inconsistent identification of curvature extremum. Possibly extremum at a knot.");
            warning.logMessage();
        }
        return newEvent;
    };
    LocalizerOfCurvatureExtremumInsideUniqueInterval.prototype.analyzeUniqueIntervalVariations = function (candidateEventIndex, nbEventsModified) {
        var modifiedEventIndex = NeighboringEvents_2.INITIAL_INTERV_INDEX;
        var ratioLeft = 0.0, ratioRight = 0.0;
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
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "analyzeUniqueIntervalVariations", "Incorrect number of modified differential events.");
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
                    var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "analyzeUniqueIntervalVariations", "Events are stable as well as the candidate event.");
                    warning.logMessage();
                }
                else {
                    var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "analyzeUniqueIntervalVariations", "Other events variations may influence the decision about the candidate event.");
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
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "analyzeUniqueIntervalVariations", "Unable to generate the smallest interval of differential events for this curve.");
            error.logMessage();
        }
        return modifiedEventIndex;
    };
    LocalizerOfCurvatureExtremumInsideUniqueInterval.prototype.variationOfExtremeInterval = function (interval, nbEventsModified) {
        var ratio = 0.0;
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
    };
    return LocalizerOfCurvatureExtremumInsideUniqueInterval;
}(LocalizerOfDifferentialEvents));
exports.LocalizerOfCurvatureExtremumInsideUniqueInterval = LocalizerOfCurvatureExtremumInsideUniqueInterval;
var LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval = /** @class */ (function (_super) {
    __extends(LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval, _super);
    function LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(sequenceDiffEvents1, sequenceDiffEvents2) {
        var _this = _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2) || this;
        _this.ONE_EVENT_APPEAR = ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL;
        _this.candidateEventIndex = _this.intervalsBtwExtrema2.indexSmallestInterval(_this.ONE_EVENT_APPEAR);
        return _this;
    }
    LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval.prototype.locateDifferentialEvents = function () {
        this.candidateEventIndex = this.analyzeUniqueIntervalVariations(this.candidateEventIndex, this.ONE_EVENT_APPEAR);
        return this.assignNewEventInUniqueInterval(this.sequenceDiffEvents2, this.candidateEventIndex, this.ONE_EVENT_APPEAR);
    };
    return LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval;
}(LocalizerOfCurvatureExtremumInsideUniqueInterval));
exports.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval = LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval;
var LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval = /** @class */ (function (_super) {
    __extends(LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval, _super);
    function LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(sequenceDiffEvents1, sequenceDiffEvents2) {
        var _this = _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2) || this;
        _this.ONE_EVENT_DISAPPEAR = ComparatorOfSequencesDiffEvents_1.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL;
        _this.candidateEventIndex = _this.intervalsBtwExtrema1.indexSmallestInterval(_this.ONE_EVENT_DISAPPEAR);
        return _this;
    }
    LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval.prototype.locateDifferentialEvents = function () {
        this.candidateEventIndex = this.analyzeUniqueIntervalVariations(this.candidateEventIndex, this.ONE_EVENT_DISAPPEAR);
        return this.assignNewEventInUniqueInterval(this.sequenceDiffEvents1, this.candidateEventIndex, this.ONE_EVENT_DISAPPEAR);
    };
    return LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval;
}(LocalizerOfCurvatureExtremumInsideUniqueInterval));
exports.LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval = LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval;
var LocalizerOfCurvatureExtrema = /** @class */ (function (_super) {
    __extends(LocalizerOfCurvatureExtrema, _super);
    function LocalizerOfCurvatureExtrema(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        var _this = _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) || this;
        _this.intervalsBtwExtrema1 = _this.sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(_this.location);
        _this.intervalsBtwExtrema2 = _this.sequenceDiffEvents2.computeIntervalsBtwCurvatureExtrema(_this.location);
        _this.comparatorSequenceOfIntervals = new ComparatorOfSequencesOfIntervals_1.ComparatorOfSequencesOfIntervals(_this.intervalsBtwExtrema1, _this.intervalsBtwExtrema2);
        return _this;
    }
    LocalizerOfCurvatureExtrema.prototype.assignNewEvent = function (sequenceDiffEvents, candidateEventIndex) {
        var newEvent = new NeighboringEvents_1.NeighboringEvents();
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
    };
    LocalizerOfCurvatureExtrema.prototype.analyzeIntervalVariations = function (candidateEventIndex, nbEventsModified) {
        var modifiedEventIndex = candidateEventIndex;
        this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderForwardScan(candidateEventIndex, nbEventsModified);
        var maxRatioF = this.comparatorSequenceOfIntervals.maxVariationInSeq1;
        this.comparatorSequenceOfIntervals.indexIntervalMaximalVariationUnderReverseScan(candidateEventIndex, nbEventsModified);
        var maxRatioR = this.comparatorSequenceOfIntervals.maxVariationInSeq1;
        if (candidateEventIndex !== NeighboringEvents_2.INITIAL_INTERV_INDEX) {
            if (this.intervalsBtwExtrema1.sequence.length > 0) {
                if (maxRatioF.index === maxRatioR.index && maxRatioF.index === (candidateEventIndex - 1)) {
                    var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "analyzeIntervalVariations", "Events are stable as well as the candidate events.");
                    warning.logMessage();
                }
                else if (maxRatioF.index !== (candidateEventIndex - 1) || maxRatioR.index !== (candidateEventIndex - 1)) {
                    var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "analyzeIntervalVariations", "The candidate events are not the ones added.");
                    warning.logMessage();
                    /* Current assumption consists in considering an adjacent interval as candidate */
                    if (maxRatioF.value > maxRatioR.value) {
                        modifiedEventIndex = maxRatioF.index - 1;
                    }
                    else
                        modifiedEventIndex = maxRatioF.index + 1;
                }
                else {
                    var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "analyzeIntervalVariations", "Events are not stable enough.");
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
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "analyzeIntervalVariations", "Incorrect number of modified differential events.");
            error.logMessage();
        }
        return modifiedEventIndex;
    };
    return LocalizerOfCurvatureExtrema;
}(LocalizerOfDifferentialEvents));
exports.LocalizerOfCurvatureExtrema = LocalizerOfCurvatureExtrema;
var LocalizerOfCurvatureExtremaAppearing = /** @class */ (function (_super) {
    __extends(LocalizerOfCurvatureExtremaAppearing, _super);
    function LocalizerOfCurvatureExtremaAppearing(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        var _this = _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) || this;
        _this.candidateEventIndex = _this.intervalsBtwExtrema2.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        return _this;
    }
    LocalizerOfCurvatureExtremaAppearing.prototype.locateDifferentialEvents = function () {
        this.candidateEventIndex = this.analyzeIntervalVariations(this.candidateEventIndex, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_APPEAR);
        return this.assignNewEvent(this.sequenceDiffEvents2, this.candidateEventIndex);
    };
    return LocalizerOfCurvatureExtremaAppearing;
}(LocalizerOfCurvatureExtrema));
exports.LocalizerOfCurvatureExtremaAppearing = LocalizerOfCurvatureExtremaAppearing;
var LocalizerOfCurvatureExtremaDisappearing = /** @class */ (function (_super) {
    __extends(LocalizerOfCurvatureExtremaDisappearing, _super);
    function LocalizerOfCurvatureExtremaDisappearing(sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) {
        var _this = _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2, indexInflection) || this;
        _this.candidateEventIndex = _this.intervalsBtwExtrema1.indexSmallestInterval(ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        return _this;
    }
    LocalizerOfCurvatureExtremaDisappearing.prototype.locateDifferentialEvents = function () {
        this.candidateEventIndex = this.analyzeIntervalVariations(this.candidateEventIndex, ComparatorOfSequencesDiffEvents_1.TWO_CURVEXT_EVENTS_DISAPPEAR);
        return this.assignNewEvent(this.sequenceDiffEvents1, this.candidateEventIndex);
    };
    return LocalizerOfCurvatureExtremaDisappearing;
}(LocalizerOfCurvatureExtrema));
exports.LocalizerOfCurvatureExtremaDisappearing = LocalizerOfCurvatureExtremaDisappearing;
var LocalizerOfInflectionInUniqueInterval = /** @class */ (function (_super) {
    __extends(LocalizerOfInflectionInUniqueInterval, _super);
    function LocalizerOfInflectionInUniqueInterval(sequenceDiffEvents1, sequenceDiffEvents2) {
        var _this = this;
        var index = NeighboringEvents_2.INITIAL_INTERV_INDEX;
        _this = _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2, index) || this;
        _this.inflectionVariation = _this.sequenceDiffEvents1.indicesOfInflections.length - _this.sequenceDiffEvents2.indicesOfInflections.length;
        return _this;
    }
    LocalizerOfInflectionInUniqueInterval.prototype.analyzeIntervalVariations = function (sequenceDiffEvents) {
        var index;
        var intervalExtrema = [];
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
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "analyzeIntervalVariations", "Inconsistent content of the sequence of events to identify the curve extremity where the inflection is lost.");
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
    };
    return LocalizerOfInflectionInUniqueInterval;
}(LocalizerOfDifferentialEvents));
exports.LocalizerOfInflectionInUniqueInterval = LocalizerOfInflectionInUniqueInterval;
var LocalizerOfInflectionDisappearingInUniqueInterval = /** @class */ (function (_super) {
    __extends(LocalizerOfInflectionDisappearingInUniqueInterval, _super);
    function LocalizerOfInflectionDisappearingInUniqueInterval(sequenceDiffEvents1, sequenceDiffEvents2) {
        return _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2) || this;
    }
    LocalizerOfInflectionDisappearingInUniqueInterval.prototype.locateDifferentialEvents = function () {
        var newEvent = new NeighboringEvents_1.NeighboringEvents();
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
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateDifferentialEvents", "Inconsistent index to locate an inflection into the unique interval.");
            error.logMessage();
        }
        return newEvent;
    };
    return LocalizerOfInflectionDisappearingInUniqueInterval;
}(LocalizerOfInflectionInUniqueInterval));
exports.LocalizerOfInflectionDisappearingInUniqueInterval = LocalizerOfInflectionDisappearingInUniqueInterval;
var LocalizerOfInflectionAppearingInUniqueInterval = /** @class */ (function (_super) {
    __extends(LocalizerOfInflectionAppearingInUniqueInterval, _super);
    function LocalizerOfInflectionAppearingInUniqueInterval(sequenceDiffEvents1, sequenceDiffEvents2) {
        return _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2) || this;
    }
    LocalizerOfInflectionAppearingInUniqueInterval.prototype.locateDifferentialEvents = function () {
        var newEvent = new NeighboringEvents_1.NeighboringEvents();
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
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateDifferentialEvents", "Inconsistent index to locate an inflection into the unique interval.");
            error.logMessage();
        }
        return newEvent;
    };
    return LocalizerOfInflectionAppearingInUniqueInterval;
}(LocalizerOfInflectionInUniqueInterval));
exports.LocalizerOfInflectionAppearingInUniqueInterval = LocalizerOfInflectionAppearingInUniqueInterval;
var LocalizerOfInflectionInExtremeInterval = /** @class */ (function (_super) {
    __extends(LocalizerOfInflectionInExtremeInterval, _super);
    function LocalizerOfInflectionInExtremeInterval(sequenceDiffEvents1, sequenceDiffEvents2) {
        var _this = this;
        var index = NeighboringEvents_2.INITIAL_INTERV_INDEX;
        _this = _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2, index) || this;
        _this.inflectionVariation = _this.sequenceDiffEvents1.indicesOfInflections.length - _this.sequenceDiffEvents2.indicesOfInflections.length;
        if (_this.inflectionVariation === 1 && _this.sequenceDiffEvents1.indicesOfInflections.length === 1 ||
            _this.inflectionVariation === -1 && _this.sequenceDiffEvents1.indicesOfInflections.length === 0) {
            var error = new ErrorLoging_1.ErrorLog(_this.constructor.name, "constructor", "Differential event sequence inadequate for this configuration.");
            error.logMessage();
        }
        return _this;
    }
    LocalizerOfInflectionInExtremeInterval.prototype.analyzeIntervalVariations = function () {
        var index = NeighboringEvents_2.INITIAL_INTERV_INDEX;
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
    };
    return LocalizerOfInflectionInExtremeInterval;
}(LocalizerOfDifferentialEvents));
exports.LocalizerOfInflectionInExtremeInterval = LocalizerOfInflectionInExtremeInterval;
var LocalizerOfInflectionAppearingInExtremeInterval = /** @class */ (function (_super) {
    __extends(LocalizerOfInflectionAppearingInExtremeInterval, _super);
    function LocalizerOfInflectionAppearingInExtremeInterval(sequenceDiffEvents1, sequenceDiffEvents2) {
        return _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2) || this;
    }
    LocalizerOfInflectionAppearingInExtremeInterval.prototype.locateDifferentialEvents = function () {
        var newEvent = new NeighboringEvents_1.NeighboringEvents();
        if (this.analyzeIntervalVariations() === 0 && this.inflectionVariation === -1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionLeftBoundary;
        }
        else if (this.analyzeIntervalVariations() === this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1]) {
            newEvent.index = this.sequenceDiffEvents2.indicesOfInflections[this.sequenceDiffEvents2.indicesOfInflections.length - 1];
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionRightBoundary;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateDifferentialEvents", "Inconsistent index to locate an inflection into an extreme interval.");
            error.logMessage();
        }
        return newEvent;
    };
    return LocalizerOfInflectionAppearingInExtremeInterval;
}(LocalizerOfInflectionInExtremeInterval));
exports.LocalizerOfInflectionAppearingInExtremeInterval = LocalizerOfInflectionAppearingInExtremeInterval;
var LocalizerOfInflectionDisappearingInExtremeInterval = /** @class */ (function (_super) {
    __extends(LocalizerOfInflectionDisappearingInExtremeInterval, _super);
    function LocalizerOfInflectionDisappearingInExtremeInterval(sequenceDiffEvents1, sequenceDiffEvents2) {
        return _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2) || this;
    }
    LocalizerOfInflectionDisappearingInExtremeInterval.prototype.locateDifferentialEvents = function () {
        var newEvent = new NeighboringEvents_1.NeighboringEvents();
        if (this.analyzeIntervalVariations() === 0 && this.inflectionVariation === 1) {
            newEvent.index = 0;
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionLeftBoundary;
        }
        else if (this.analyzeIntervalVariations() === this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1]) {
            newEvent.index = this.sequenceDiffEvents1.indicesOfInflections[this.sequenceDiffEvents1.indicesOfInflections.length - 1];
            newEvent.type = NeighboringEvents_2.NeighboringEventsType.neighboringInflectionRightBoundary;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateDifferentialEvents", " Inconsistent index to locate an inflection into an extreme interval.");
            error.logMessage();
        }
        return newEvent;
    };
    return LocalizerOfInflectionDisappearingInExtremeInterval;
}(LocalizerOfInflectionInExtremeInterval));
exports.LocalizerOfInflectionDisappearingInExtremeInterval = LocalizerOfInflectionDisappearingInExtremeInterval;
var LocalizerOfInflectionsAdjacentCurvatureExtremum = /** @class */ (function (_super) {
    __extends(LocalizerOfInflectionsAdjacentCurvatureExtremum, _super);
    function LocalizerOfInflectionsAdjacentCurvatureExtremum(sequenceDiffEvents1, sequenceDiffEvents2) {
        var _this = this;
        var index = NeighboringEvents_2.INITIAL_INTERV_INDEX;
        _this = _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2, index) || this;
        _this.indicesOscillations1 = _this.sequenceDiffEvents1.generateIndicesOscillations();
        _this.indicesOscillations2 = _this.sequenceDiffEvents2.generateIndicesOscillations();
        _this.inflectionVariation = _this.sequenceDiffEvents1.indicesOfInflections.length - _this.sequenceDiffEvents2.indicesOfInflections.length;
        return _this;
    }
    LocalizerOfInflectionsAdjacentCurvatureExtremum.prototype.analyzeIntervalVariations = function (indicesOscillations) {
        var intervalEvent = [];
        if (indicesOscillations.length > 0) {
            if (indicesOscillations[0] !== 0)
                intervalEvent.push(indicesOscillations[0]);
            for (var j = 0; j < indicesOscillations.length - 1; j += 1) {
                intervalEvent.push(indicesOscillations[j + 1] - indicesOscillations[j]);
            }
        }
        this.checkIndexLocation();
        return intervalEvent;
    };
    LocalizerOfInflectionsAdjacentCurvatureExtremum.prototype.checkIndexLocation = function () {
        var nbModifedEvents = this.sequenceDiffEvents2.indicesOfInflections.length - this.sequenceDiffEvents1.indicesOfInflections.length;
        if (nbModifedEvents === ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_APPEAR) {
            if ((this.indicesOscillations2.length - this.indicesOscillations1.length === 1 && this.indicesOscillations1.length !== 0) ||
                (this.indicesOscillations2.length - this.indicesOscillations1.length === 2 && this.sequenceDiffEvents2.length() - this.sequenceDiffEvents1.length() !== 2) ||
                (this.indicesOscillations2.length - this.indicesOscillations1.length === 3 && this.indicesOscillations1.length > 0)) {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkIndexLocation", "Inconsistency of reference type event that does not coincide with oscillation removal.");
                error.logMessage();
            }
        }
        else if (nbModifedEvents === ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
            if ((this.indicesOscillations2.length - this.indicesOscillations1.length === -1 && this.indicesOscillations2.length !== 0) ||
                (this.indicesOscillations2.length - this.indicesOscillations1.length === -2 && this.sequenceDiffEvents2.length() - this.sequenceDiffEvents1.length() !== -2) ||
                (this.indicesOscillations2.length - this.indicesOscillations1.length === -3 && this.indicesOscillations2.length > 0)) {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkIndexLocation", "Inconsistency of reference type event that does not coincide with oscillation removal.");
                error.logMessage();
            }
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkIndexLocation", "Inconsistent variation of number of differential events.");
            error.logMessage();
        }
    };
    LocalizerOfInflectionsAdjacentCurvatureExtremum.prototype.assignNewEvent = function (sequenceDiffEvents, nbModifedEvents) {
        var newEvent = new NeighboringEvents_1.NeighboringEvents();
        var intervalEvent1 = [];
        var intervalEvent2 = [];
        var indicesOscillations1 = [];
        var indicesOscillations2 = [];
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
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "assignNewEvent", "Incorrect number of modified differential events.");
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
                for (var k = 0; k < intervalEvent2.length; k += 1) {
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
    };
    return LocalizerOfInflectionsAdjacentCurvatureExtremum;
}(LocalizerOfDifferentialEvents));
exports.LocalizerOfInflectionsAdjacentCurvatureExtremum = LocalizerOfInflectionsAdjacentCurvatureExtremum;
var LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum = /** @class */ (function (_super) {
    __extends(LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum, _super);
    function LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(sequenceDiffEvents1, sequenceDiffEvents2) {
        return _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2) || this;
    }
    LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum.prototype.locateDifferentialEvents = function () {
        return this.assignNewEvent(this.sequenceDiffEvents2, ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_DISAPPEAR);
    };
    return LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum;
}(LocalizerOfInflectionsAdjacentCurvatureExtremum));
exports.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum = LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum;
var LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum = /** @class */ (function (_super) {
    __extends(LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum, _super);
    function LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(sequenceDiffEvents1, sequenceDiffEvents2) {
        return _super.call(this, sequenceDiffEvents1, sequenceDiffEvents2) || this;
    }
    LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum.prototype.locateDifferentialEvents = function () {
        return this.assignNewEvent(this.sequenceDiffEvents1, ComparatorOfSequencesDiffEvents_1.TWO_INFLECTIONS_EVENTS_APPEAR);
    };
    return LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum;
}(LocalizerOfInflectionsAdjacentCurvatureExtremum));
exports.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum = LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum;
