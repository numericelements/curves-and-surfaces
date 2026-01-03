"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparatorOfSequencesOfDiffEvents = exports.TWO_INFLECTIONS_EVENTS_DISAPPEAR = exports.TWO_INFLECTIONS_EVENTS_APPEAR = exports.ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL = exports.ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL = exports.TWO_CURVEXT_EVENTS_DISAPPEAR = exports.TWO_CURVEXT_EVENTS_APPEAR = exports.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL = exports.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL = exports.LAST_INDEX = exports.RETURN_ERROR_CODE = exports.CURVE_INTERVAL_SPAN = exports.LOWER_BOUND_CURVE_INTERVAL = exports.UPPER_BOUND_CURVE_INTERVAL = void 0;
const ModifiedDifferentialEvents_1 = require("./ModifiedDifferentialEvents");
const NeighboringEvents_1 = require("./NeighboringEvents");
const LocalizerOfDifferentialEvents_1 = require("./LocalizerOfDifferentialEvents");
const DifferentialEvent_1 = require("./DifferentialEvent");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ExtremumLocationClassifiier_1 = require("../curveShapeSpaceAnalysis/ExtremumLocationClassifiier");
exports.UPPER_BOUND_CURVE_INTERVAL = 1.0;
exports.LOWER_BOUND_CURVE_INTERVAL = 0.0;
exports.CURVE_INTERVAL_SPAN = exports.UPPER_BOUND_CURVE_INTERVAL - exports.LOWER_BOUND_CURVE_INTERVAL;
exports.RETURN_ERROR_CODE = -1;
exports.LAST_INDEX = -1;
exports.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL = 1;
exports.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL = -1;
exports.TWO_CURVEXT_EVENTS_APPEAR = 2;
exports.TWO_CURVEXT_EVENTS_DISAPPEAR = -2;
exports.ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL = 1;
exports.ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL = -1;
exports.TWO_INFLECTIONS_EVENTS_APPEAR = 2;
exports.TWO_INFLECTIONS_EVENTS_DISAPPEAR = -2;
/**
 * Compare the sequences of differential events _sequenceDiffEvents1 and _sequenceDiffEvents2 to look for curvature extrema changes (appearing/disappearing)
 * when the number of inflections is identical in each sequence:
 * @returns : array of ModifiedCurvatureEvents where each interval is defined by two successive inflections.
 * This interval is characterized by the right inflection identified by its INDEX in the array of indices of inflections found in _sequenceDiffEvents1.
 * When event changes occur in the last interval of _sequenceDiffEvents1, i.e., after the last inflection of this sequence, the right bound of this interval
 * is set to: indicesInflection1.length (the number inflections + 1). This process is used to designate an interval, only, and is
 * not altering the content of the array of indices of inflections. In case a sequence has no inflection, i.e., this array has length zero,
 * though the interval is designated with zero.
 * It can  be an array of modifiedInflectionEvents where each interval is defined by the INDEX of a curvature
 * extremum in _sequenceDiffEvents1 (if two inflections appear or disappear, they are adjacent to a curvature extremum).
 * When event changes occur in the last interval of _sequenceDiffEvents1, i.e., after the last curvature extremum of this sequence, the right bound of this interval
 * is set to: _sequenceDiffEvents1.length (the number of events + 1). If the inflection change occurs in the first interval,
 * the index is set to 1.
 */
class ComparatorOfSequencesOfDiffEvents {
    constructor(sequenceDiffEvents1, sequenceDiffEvents2) {
        this.modifiedCurvExEvents = [];
        this.modifiedInflectionEvents = [];
        this.neighboringEvents = [];
        this._sequenceDiffEvents1 = sequenceDiffEvents1;
        this._sequenceDiffEvents2 = sequenceDiffEvents2;
    }
    get sequenceDiffEvents1() {
        return this._sequenceDiffEvents1;
    }
    get sequenceDiffEvents2() {
        return this._sequenceDiffEvents2;
    }
    set sequenceDiffEvents1(sequenceDiffEvents) {
        sequenceDiffEvents.checkSequenceConsistency();
        this._sequenceDiffEvents1 = sequenceDiffEvents;
    }
    set sequenceDiffEvents2(sequenceDiffEvents) {
        sequenceDiffEvents.checkSequenceConsistency();
        this._sequenceDiffEvents2 = sequenceDiffEvents;
    }
    locateIntervalAndNumberOfCurvExEventChanges() {
        if (this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
            let shift = 0;
            for (let j = 0; j < this._sequenceDiffEvents1.indicesOfInflections.length; j += 1) {
                const delta = this._sequenceDiffEvents1.indicesOfInflections[j] - this._sequenceDiffEvents2.indicesOfInflections[j];
                if (delta !== shift) {
                    const modEventInInterval = new ModifiedDifferentialEvents_1.ModifiedCurvatureEvents(j, (shift - delta));
                    this.modifiedCurvExEvents.push(modEventInInterval);
                    shift = shift + delta;
                }
            }
            if (this._sequenceDiffEvents1.indicesOfInflections.length > 0 && this.modifiedCurvExEvents.length === 0) {
                // There are inflections and no changes in the first indicesInflectionInit.length intervals -> changes take place in the last interval
                const modEventInInterval = new ModifiedDifferentialEvents_1.ModifiedCurvatureEvents(this._sequenceDiffEvents1.indicesOfInflections.length, (this._sequenceDiffEvents2.length() - this._sequenceDiffEvents1.length()));
                this.modifiedCurvExEvents.push(modEventInInterval);
            }
            if (this._sequenceDiffEvents1.indicesOfInflections.length === 0 &&
                this._sequenceDiffEvents1.length() !== this._sequenceDiffEvents2.length()) {
                // There is no inflexion in the sequence of events -> all events take place in the 'first' interval
                const modEventInInterval = new ModifiedDifferentialEvents_1.ModifiedCurvatureEvents(0, (this._sequenceDiffEvents2.length() - this._sequenceDiffEvents1.length()));
                this.modifiedCurvExEvents.push(modEventInInterval);
            }
        }
        else {
            const message = 'Nb of inflections differ. In seq1 = ' + this._sequenceDiffEvents1.indicesOfInflections.length + ' seq2 = ' + this._sequenceDiffEvents2.indicesOfInflections.length;
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "locateIntervalAndNumberOfCurvExEventChanges", message);
            warning.logMessage();
        }
        if (this._sequenceDiffEvents1.length() === this._sequenceDiffEvents2.length() && this._sequenceDiffEvents1.indicesOfInflections.length > 0) {
            this.checkConsistencySumModifiedEvents();
        }
        this.checkConsistencyModifiedEvents();
    }
    setModifedInflectionEventInExtremeInterval(sequenceDiffEvents, nbModifiedInflections) {
        let modificationOfInflectionEventExist = false;
        if (sequenceDiffEvents.eventAt(0).order === DifferentialEvent_1.ORDER_INFLECTION) {
            if (sequenceDiffEvents.length() === 1) {
                const modEventInInterval = new ModifiedDifferentialEvents_1.ModifiedInflectionEvents(0, nbModifiedInflections);
                this.modifiedInflectionEvents.push(modEventInInterval);
            }
            else if (sequenceDiffEvents.eventAt(1).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
                const modEventInInterval = new ModifiedDifferentialEvents_1.ModifiedInflectionEvents(1, nbModifiedInflections);
                this.modifiedInflectionEvents.push(modEventInInterval);
            }
            modificationOfInflectionEventExist = true;
        }
        if (sequenceDiffEvents.length() > 1) {
            if (sequenceDiffEvents.eventAt(sequenceDiffEvents.length() - 1).order === DifferentialEvent_1.ORDER_INFLECTION
                && sequenceDiffEvents.eventAt(sequenceDiffEvents.length() - 2).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
                const modEventInInterval = new ModifiedDifferentialEvents_1.ModifiedInflectionEvents(sequenceDiffEvents.length() - 2, nbModifiedInflections);
                this.modifiedInflectionEvents.push(modEventInInterval);
                modificationOfInflectionEventExist = true;
            }
        }
        if (!modificationOfInflectionEventExist) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "setModifedInflectionEventInExtremeInterval", "Inconsistent variation of sequences of differential events.");
            error.logMessage();
        }
    }
    areTwoInflectionsDisappearingAtCurveExtremities(sequenceDiffEvents1, sequenceDiffEvents2) {
        let twoInflectionsAtCurveExtremities = false;
        if (sequenceDiffEvents2.length() > 1) {
            if (sequenceDiffEvents1.eventAt(0).order === DifferentialEvent_1.ORDER_INFLECTION && sequenceDiffEvents2.eventAt(0).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM
                && sequenceDiffEvents1.eventAt(sequenceDiffEvents1.length() - 1).order === DifferentialEvent_1.ORDER_INFLECTION && sequenceDiffEvents2.eventAt(sequenceDiffEvents2.length() - 1).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
                twoInflectionsAtCurveExtremities = true;
            }
        }
        return twoInflectionsAtCurveExtremities;
    }
    setModifedInflectionEventsAtCurveEx(sequenceDiffEvents1, sequenceDiffEvents2, nbModifiedInflections) {
        let generateModEvents = false;
        if (nbModifiedInflections === exports.TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
            if (this.areTwoInflectionsDisappearingAtCurveExtremities(sequenceDiffEvents1, sequenceDiffEvents2)) {
                this.setModifedInflectionEventInExtremeInterval(sequenceDiffEvents1, exports.ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL);
                generateModEvents = true;
            }
        }
        else if (nbModifiedInflections === exports.TWO_INFLECTIONS_EVENTS_APPEAR) {
            if (this.areTwoInflectionsDisappearingAtCurveExtremities(sequenceDiffEvents2, sequenceDiffEvents1)) {
                this.setModifedInflectionEventInExtremeInterval(sequenceDiffEvents2, exports.ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL);
                generateModEvents = true;
            }
        }
        return generateModEvents;
    }
    setModifedInflectionEventsAjacentToCurvEx(sequenceDiffEvents1, sequenceDiffEvents2, nbModifiedInflections) {
        if (this.setModifedInflectionEventsAtCurveEx(sequenceDiffEvents1, sequenceDiffEvents2, nbModifiedInflections)) {
            return;
        }
        let shift = 0;
        for (let j = 0; j < sequenceDiffEvents1.length(); j += 1) {
            if (sequenceDiffEvents1.eventAt(j).order !== sequenceDiffEvents2.eventAt(j + shift).order) {
                let modEventInInterval;
                if (nbModifiedInflections > 0) {
                    modEventInInterval = new ModifiedDifferentialEvents_1.ModifiedInflectionEvents(j, exports.TWO_INFLECTIONS_EVENTS_APPEAR);
                }
                else {
                    modEventInInterval = new ModifiedDifferentialEvents_1.ModifiedInflectionEvents(j, exports.TWO_INFLECTIONS_EVENTS_DISAPPEAR);
                }
                this.modifiedInflectionEvents.push(modEventInInterval);
                shift = shift + exports.TWO_INFLECTIONS_EVENTS_APPEAR;
            }
        }
    }
    locateIntervalAndNumberOfInflectionEventChanges() {
        const nbCurvExtrema1 = this._sequenceDiffEvents1.length() - this._sequenceDiffEvents1.indicesOfInflections.length;
        const nbCurvExtrema2 = this._sequenceDiffEvents2.length() - this._sequenceDiffEvents2.indicesOfInflections.length;
        if (nbCurvExtrema1 === nbCurvExtrema2) {
            const nbModifiedInflections = this._sequenceDiffEvents2.indicesOfInflections.length - this._sequenceDiffEvents1.indicesOfInflections.length;
            if (nbModifiedInflections === exports.ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL) {
                this.setModifedInflectionEventInExtremeInterval(this._sequenceDiffEvents2, nbModifiedInflections);
            }
            else if (nbModifiedInflections === exports.ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL) {
                this.setModifedInflectionEventInExtremeInterval(this._sequenceDiffEvents1, nbModifiedInflections);
            }
            else if (nbModifiedInflections === exports.TWO_INFLECTIONS_EVENTS_APPEAR) {
                if (nbCurvExtrema1 > 0) {
                    this.setModifedInflectionEventsAjacentToCurvEx(this._sequenceDiffEvents1, this._sequenceDiffEvents2, nbModifiedInflections);
                }
                else {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateIntervalAndNumberOfInflectionEventChanges", "Inconsistent number of curvature extrema. There must be one, at least.");
                    error.logMessage();
                }
            }
            else if (nbModifiedInflections === exports.TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
                if (nbCurvExtrema2 > 0) {
                    this.setModifedInflectionEventsAjacentToCurvEx(this._sequenceDiffEvents2, this._sequenceDiffEvents1, nbModifiedInflections);
                }
                else {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateIntervalAndNumberOfInflectionEventChanges", "Inconsistent number of curvature extrema. There must be one, at least.");
                    error.logMessage();
                }
            }
        }
    }
    locateNeiboringEventsUnderCurvExEventChanges() {
        if (this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
            console.log("Seq Curv Ext zeros = " + this._sequenceDiffEvents2.nbCurvatureExtrema());
            for (let modifiedCurvExEvent of this.modifiedCurvExEvents) {
                this._sequenceDiffEvents1.checkConsistencyIntervalBtwInflections(modifiedCurvExEvent);
                if (modifiedCurvExEvent.nbEvents === exports.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length === 0) {
                    const locatorCurvatureEvent = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent = locatorCurvatureEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForCurvExtrema(neighboringEvent, modifiedCurvExEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                }
                else if (modifiedCurvExEvent.nbEvents === exports.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.indicesOfInflections.length === 0) {
                    const locatorCurvatureEvent = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent = locatorCurvatureEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForCurvExtrema(neighboringEvent, modifiedCurvExEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                }
                else if (modifiedCurvExEvent.nbEvents === exports.ONE_CURVEXT_EVENT_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length > 0) {
                    // Because there is only one event appearing and this event is of type curvature extremum, it can take place either in the first or in the last interval
                    const locatorCurvatureEvent = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumAppearingInsideExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2, modifiedCurvExEvent.indexInflection);
                    const neighboringEvent = locatorCurvatureEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForCurvExtrema(neighboringEvent, modifiedCurvExEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                }
                else if (modifiedCurvExEvent.nbEvents === exports.ONE_CURVEXT_EVENT_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.indicesOfInflections.length > 0) {
                    // Because there is only one event appearing and this event is of type curvature extremum, it can take place either in the first or in the last interval
                    const locatorCurvatureEvent = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremumDisappearingInsideExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2, modifiedCurvExEvent.indexInflection);
                    const neighboringEvent = locatorCurvatureEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForCurvExtrema(neighboringEvent, modifiedCurvExEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                }
                else if (modifiedCurvExEvent.nbEvents === exports.TWO_CURVEXT_EVENTS_APPEAR) {
                    const locatorCurvEventAppearing = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaAppearing(this._sequenceDiffEvents1, this._sequenceDiffEvents2, modifiedCurvExEvent.indexInflection);
                    const neighboringEvent = locatorCurvEventAppearing.locateDifferentialEvents();
                    neighboringEvent.type = NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear;
                    this.neighboringEvents.push(neighboringEvent);
                }
                else if (modifiedCurvExEvent.nbEvents === exports.TWO_CURVEXT_EVENTS_DISAPPEAR) {
                    const locatorCurvEventDisappearing = new LocalizerOfDifferentialEvents_1.LocalizerOfCurvatureExtremaDisappearing(this._sequenceDiffEvents1, this._sequenceDiffEvents2, modifiedCurvExEvent.indexInflection);
                    const neighboringEvent = locatorCurvEventDisappearing.locateDifferentialEvents();
                    neighboringEvent.type = NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear;
                    this.neighboringEvents.push(neighboringEvent);
                }
                else if (modifiedCurvExEvent.nbEvents !== 0) {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateNeiboringEventsUnderCurvExEventChanges", "Cannot process the curvature extremum event.");
                    error.logMessage();
                }
            }
        }
        else {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "locateNeiboringEventsUnderCurvExEventChanges", "No curvature extremum event processed because inflection events are modified too.");
            warning.logMessage();
        }
    }
    combineLocationAndBehaviorForCurvExtrema(neighboringEvent, eventBehavior) {
        let result = neighboringEvent;
        if (neighboringEvent.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary && eventBehavior > 0) {
            result.type = NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear;
        }
        else if (neighboringEvent.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundary && eventBehavior < 0) {
            result.type = NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear;
        }
        else if (neighboringEvent.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary && eventBehavior > 0) {
            result.type = NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear;
        }
        else if (neighboringEvent.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundary && eventBehavior < 0) {
            result.type = NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "combineLocationAndBehaviorForCurvExtrema", "Inconsistent differential event type.");
            error.logMessage();
        }
        return result;
    }
    locateNeiboringEventsUnderInflectionEventChanges() {
        const nbEventsModified = this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length();
        const nbInflectionsModified = this._sequenceDiffEvents1.indicesOfInflections.length - this._sequenceDiffEvents2.indicesOfInflections.length;
        if (nbEventsModified === nbInflectionsModified) {
            for (let modifiedInflectionEvent of this.modifiedInflectionEvents) {
                if (modifiedInflectionEvent.nbEvents === exports.ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length > 0) {
                    const locatorInflectionEvent = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent = locatorInflectionEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForInflections(neighboringEvent, modifiedInflectionEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                }
                else if (modifiedInflectionEvent.nbEvents === exports.ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.indicesOfInflections.length > 0) {
                    const locatorInflectionEvent = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInExtremeInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent = locatorInflectionEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForInflections(neighboringEvent, modifiedInflectionEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                }
                else if (modifiedInflectionEvent.nbEvents === exports.ONE_INFLECTION_APPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents1.indicesOfInflections.length === 0) {
                    const locatorInflectionEvent = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionAppearingInUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent = locatorInflectionEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForInflections(neighboringEvent, modifiedInflectionEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                }
                else if (modifiedInflectionEvent.nbEvents === exports.ONE_INFLECTION_DISAPPEAR_IN_EXTREME_INTERVAL && this._sequenceDiffEvents2.indicesOfInflections.length === 0) {
                    const locatorInflectionEvent = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionDisappearingInUniqueInterval(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent = locatorInflectionEvent.locateDifferentialEvents();
                    const updatedNeighboringEvent = this.combineLocationAndBehaviorForInflections(neighboringEvent, modifiedInflectionEvent.nbEvents);
                    this.neighboringEvents.push(updatedNeighboringEvent);
                }
                else if (modifiedInflectionEvent.nbEvents === exports.TWO_INFLECTIONS_EVENTS_APPEAR) {
                    const locatorInflectionEvent = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsAppearingInAdjacentCurvatureExtremum(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent = locatorInflectionEvent.locateDifferentialEvents();
                    neighboringEvent.type = NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumAppear;
                    this.neighboringEvents.push(neighboringEvent);
                }
                else if (modifiedInflectionEvent.nbEvents === exports.TWO_INFLECTIONS_EVENTS_DISAPPEAR) {
                    const locatorInflectionEvent = new LocalizerOfDifferentialEvents_1.LocalizerOfInflectionsDisappearingInAdjacentCurvatureExtremum(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
                    const neighboringEvent = locatorInflectionEvent.locateDifferentialEvents();
                    neighboringEvent.type = NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear;
                    this.neighboringEvents.push(neighboringEvent);
                }
                else {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateNeiboringEventsUnderInflectionEventChanges", "Cannot process the inflection event.");
                    error.logMessage();
                }
            }
        }
        else {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "locateNeiboringEventsUnderInflectionEventChanges", "No inflection event processed because curvature extrema events are modified too.");
            warning.logMessage();
        }
    }
    combineLocationAndBehaviorForInflections(neighboringEvent, eventBehavior) {
        let result = neighboringEvent;
        if (neighboringEvent.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary && eventBehavior > 0) {
            result.type = NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear;
        }
        else if (neighboringEvent.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundary && eventBehavior < 0) {
            result.type = NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear;
        }
        else if (neighboringEvent.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary && eventBehavior > 0) {
            result.type = NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear;
        }
        else if (neighboringEvent.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundary && eventBehavior < 0) {
            result.type = NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "combineLocationAndBehaviorForInflections", "Inconsistent differential event type.");
            error.logMessage();
        }
        return result;
    }
    assignNeighboringEventUnderCurvExAndInflectionSimultaneousChange(index) {
        if (index !== 0 && index !== exports.LAST_INDEX) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'assignNeighboringEventUnderCurvExAndInflectionSimultaneousChange', 'invalid index to process sequences of differential events.');
            error.logMessage();
            return;
        }
        let orderEventRemoved;
        const sequenceDiffEvents2Temp = this._sequenceDiffEvents2.clone();
        let neighboringEventsCurvExtDisappearing = new NeighboringEvents_1.NeighboringEvents();
        let neighboringEventsInflectionAppearing = new NeighboringEvents_1.NeighboringEvents();
        if (index === exports.LAST_INDEX) {
            orderEventRemoved = this._sequenceDiffEvents2.eventAt(this._sequenceDiffEvents2.length() - 1).order;
            this._sequenceDiffEvents2.removeAt(this._sequenceDiffEvents2.length() - 1);
        }
        else {
            orderEventRemoved = this._sequenceDiffEvents2.eventAt(index).order;
            this._sequenceDiffEvents2.removeAt(index);
        }
        if (orderEventRemoved === DifferentialEvent_1.ORDER_INFLECTION) {
            this.locateIntervalAndNumberOfCurvExEventChanges();
            this.locateNeiboringEventsUnderCurvExEventChanges();
        }
        else if (orderEventRemoved === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
            this.locateIntervalAndNumberOfInflectionEventChanges();
            this.locateNeiboringEventsUnderInflectionEventChanges();
        }
        neighboringEventsCurvExtDisappearing = this.neighboringEvents[0];
        this.modifiedCurvExEvents = [];
        this.neighboringEvents = [];
        this._sequenceDiffEvents2 = sequenceDiffEvents2Temp.clone();
        const sequenceDiffEvents1Temp = this._sequenceDiffEvents1.clone();
        if (index === exports.LAST_INDEX) {
            orderEventRemoved = this._sequenceDiffEvents1.eventAt(this._sequenceDiffEvents1.length() - 1).order;
            this._sequenceDiffEvents1.removeAt(this._sequenceDiffEvents1.length() - 1);
        }
        else {
            orderEventRemoved = this._sequenceDiffEvents1.eventAt(index).order;
            this._sequenceDiffEvents1.removeAt(index);
        }
        if (orderEventRemoved === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
            this.locateIntervalAndNumberOfInflectionEventChanges();
            this.locateNeiboringEventsUnderInflectionEventChanges();
        }
        else if (orderEventRemoved === DifferentialEvent_1.ORDER_INFLECTION) {
            this.locateIntervalAndNumberOfCurvExEventChanges();
            this.locateNeiboringEventsUnderCurvExEventChanges();
        }
        neighboringEventsInflectionAppearing = this.neighboringEvents[0];
        this._sequenceDiffEvents1 = sequenceDiffEvents1Temp.clone();
        this.modifiedInflectionEvents = [];
        this.neighboringEvents = [];
        if (orderEventRemoved === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
            if (index === 0) {
                this.neighboringEvents.push(new NeighboringEvents_1.NeighboringEvents(NeighboringEvents_1.NeighboringEventsType.neighboringCurvExtremumLeftBoundaryDisappearInflectionAppear, 0));
            }
            else if (index === exports.LAST_INDEX) {
                this.neighboringEvents.push(new NeighboringEvents_1.NeighboringEvents(NeighboringEvents_1.NeighboringEventsType.neighboringCurvExtremumRightBoundaryDisappearInflectionAppear, 0));
            }
        }
        else {
            if (index === 0) {
                this.neighboringEvents.push(new NeighboringEvents_1.NeighboringEvents(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappearCurExtremumAppear, 0));
            }
            else if (index === exports.LAST_INDEX) {
                this.neighboringEvents.push(new NeighboringEvents_1.NeighboringEvents(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappearCurExtremumAppear, 0));
            }
        }
    }
    splitEventsInvolvingInflectionAndCurvatureExtremum() {
        const sequenceDiffEvents2Temp = this._sequenceDiffEvents2.clone();
        let neighboringEventsCurvExt = new NeighboringEvents_1.NeighboringEvents();
        let neighboringEventsInflection = new NeighboringEvents_1.NeighboringEvents();
        const eventRemoved = this._sequenceDiffEvents2.eventAt(this._sequenceDiffEvents2.length() - 1).order;
        if (eventRemoved === DifferentialEvent_1.ORDER_INFLECTION) {
            this._sequenceDiffEvents2.removeAt(this._sequenceDiffEvents2.length() - 1);
        }
        this.locateIntervalAndNumberOfCurvExEventChanges();
        this.locateNeiboringEventsUnderCurvExEventChanges();
        neighboringEventsCurvExt = this.neighboringEvents[0];
        this.modifiedCurvExEvents = [];
        this.neighboringEvents = [];
        this._sequenceDiffEvents2 = sequenceDiffEvents2Temp.clone();
        let curvExtEvent = this._sequenceDiffEvents1.eventAt(0);
        if (curvExtEvent.location < this._sequenceDiffEvents2.eventAt(0).location) {
            this._sequenceDiffEvents2.insertAt(curvExtEvent, 0);
        }
        else {
            const dummyLocation = this._sequenceDiffEvents2.eventAt(1).location;
            curvExtEvent.location = dummyLocation / 2.0;
            this._sequenceDiffEvents2.insertAt(curvExtEvent, 0);
        }
        this.locateIntervalAndNumberOfInflectionEventChanges();
        this.locateNeiboringEventsUnderInflectionEventChanges();
        neighboringEventsInflection = this.neighboringEvents[0];
        this._sequenceDiffEvents2 = sequenceDiffEvents2Temp.clone();
        this.modifiedCurvExEvents = [];
        this.neighboringEvents = [];
        this.neighboringEvents.push(new NeighboringEvents_1.NeighboringEvents(NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear, 0));
        this.neighboringEvents.push(new NeighboringEvents_1.NeighboringEvents(NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear, 0));
    }
    locateNeighboringEventsUnderInflectionAndCurvatureExChanges() {
        const nbCurvExtrema1 = this._sequenceDiffEvents1.length() - this._sequenceDiffEvents1.indicesOfInflections.length;
        const nbCurvExtrema2 = this._sequenceDiffEvents2.length() - this._sequenceDiffEvents2.indicesOfInflections.length;
        const variationNbInflections = this._sequenceDiffEvents2.indicesOfInflections.length - this._sequenceDiffEvents1.indicesOfInflections.length;
        const variationNbCurvEx = nbCurvExtrema2 - nbCurvExtrema1;
        if ((variationNbInflections === 1 && variationNbCurvEx === -1) || (variationNbInflections === -1 && variationNbCurvEx === 1)) {
            // A curvature extremum is going out and an inflection is entering or the opposite
            if (variationNbInflections === 1 && variationNbCurvEx === -1) {
                if (this._sequenceDiffEvents1.eventAt(0).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM && this._sequenceDiffEvents2.eventAt(0).order === DifferentialEvent_1.ORDER_INFLECTION) {
                    this.assignNeighboringEventUnderCurvExAndInflectionSimultaneousChange(0);
                }
                else if (this._sequenceDiffEvents1.eventAt(this._sequenceDiffEvents1.length() - 1).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM
                    && this._sequenceDiffEvents2.eventAt(this._sequenceDiffEvents2.length() - 1).order === DifferentialEvent_1.ORDER_INFLECTION) {
                    this.assignNeighboringEventUnderCurvExAndInflectionSimultaneousChange(exports.LAST_INDEX);
                }
                else if (this._sequenceDiffEvents1.eventAt(0).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM && this._sequenceDiffEvents1.eventAt(this._sequenceDiffEvents1.length() - 1).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM
                    && this._sequenceDiffEvents2.eventAt(this._sequenceDiffEvents2.length() - 1).order === DifferentialEvent_1.ORDER_INFLECTION) {
                    this.splitEventsInvolvingInflectionAndCurvatureExtremum();
                }
                else if (this._sequenceDiffEvents1.eventAt(0).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM && this._sequenceDiffEvents1.eventAt(this._sequenceDiffEvents1.length() - 1).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM
                    && this._sequenceDiffEvents2.eventAt(0).order === DifferentialEvent_1.ORDER_INFLECTION) {
                }
                else {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateNeiboringEvents", "The event types at the curve extremity are inconsistent wrt a curvature extremum being replaced by an inflection.");
                    error.logMessage();
                }
            }
            else if (variationNbInflections === -1 && variationNbCurvEx === 1) {
                if (this._sequenceDiffEvents1.eventAt(0).order === DifferentialEvent_1.ORDER_INFLECTION && this._sequenceDiffEvents2.eventAt(0).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
                    this.assignNeighboringEventUnderCurvExAndInflectionSimultaneousChange(0);
                }
                else if (this._sequenceDiffEvents1.eventAt(this._sequenceDiffEvents1.length() - 1).order === DifferentialEvent_1.ORDER_INFLECTION
                    && this._sequenceDiffEvents2.eventAt(this._sequenceDiffEvents2.length() - 1).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
                    this.assignNeighboringEventUnderCurvExAndInflectionSimultaneousChange(exports.LAST_INDEX);
                }
                else if (this._sequenceDiffEvents1.eventAt(0).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM && this._sequenceDiffEvents1.eventAt(this._sequenceDiffEvents1.length() - 1).order === DifferentialEvent_1.ORDER_INFLECTION
                    && this._sequenceDiffEvents2.eventAt(this._sequenceDiffEvents2.length() - 1).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
                }
                else if (this._sequenceDiffEvents1.eventAt(0).order === DifferentialEvent_1.ORDER_INFLECTION && this._sequenceDiffEvents1.eventAt(this._sequenceDiffEvents1.length() - 1).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM
                    && this._sequenceDiffEvents2.eventAt(0).order === DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
                }
                else {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "locateNeiboringEvents", "The event types at the curve extremity are inconsistent wrt an inflection being replaced by a curvature extremum     .");
                    error.logMessage();
                }
            }
        }
    }
    locateNeiboringEvents() {
        this.modifiedCurvExEvents = [];
        this.modifiedInflectionEvents = [];
        const nbCurvExtrema1 = this._sequenceDiffEvents1.length() - this._sequenceDiffEvents1.indicesOfInflections.length;
        const nbCurvExtrema2 = this._sequenceDiffEvents2.length() - this._sequenceDiffEvents2.indicesOfInflections.length;
        if (Math.abs(this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length()) > 2) {
            this.neighboringEvents.push(new NeighboringEvents_1.NeighboringEvents(NeighboringEvents_1.NeighboringEventsType.moreThanOneEvent));
            return;
        }
        if (this._sequenceDiffEvents1.indicesOfInflections.length !== this._sequenceDiffEvents2.indicesOfInflections.length &&
            nbCurvExtrema1 !== nbCurvExtrema2) {
            // There are changes of inflections and curvature extremea simultaneously
            this.locateNeighboringEventsUnderInflectionAndCurvatureExChanges();
        }
        else if (!(this._sequenceDiffEvents1.length() === this._sequenceDiffEvents1.indicesOfInflections.length &&
            this._sequenceDiffEvents2.length() === this._sequenceDiffEvents2.indicesOfInflections.length)) {
            this.locateIntervalAndNumberOfCurvExEventChanges();
        }
        if (this.modifiedCurvExEvents.length === 0) {
            if (this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                // No change in curvature extrema has been identified as well as no change in inflections
                return;
                // no need to process an error to include the comparator into regular optimization configurations
                // const error = new ErrorLog(this.constructor.name, "locateNeiboringEvents", "Inconsistent analysis of lost events in the sequence of differential events.");
                // error.logMessageToConsole();
            }
            this.locateIntervalAndNumberOfInflectionEventChanges();
            this.locateNeiboringEventsUnderInflectionEventChanges();
        }
        else if (this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
            this.locateNeiboringEventsUnderCurvExEventChanges();
        }
        else if (this.modifiedCurvExEvents.length === 0 && this.modifiedInflectionEvents.length === 0
            && this._sequenceDiffEvents1.length() === this._sequenceDiffEvents2.length()) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "locateNeiboringEvents", "Cannot process this configuration yet.");
            warning.logMessage();
        }
    }
    checkConsistencyModifiedEvents() {
        this.modifiedCurvExEvents.forEach(element => {
            if (element.indexInflection > 0 && element.indexInflection < this._sequenceDiffEvents1.indicesOfInflections.length) {
                if (element.nbEvents % 2 !== 0) {
                    const message = "The number of differential events appaearing/disappearing in interval [" + this._sequenceDiffEvents1.indicesOfInflections[element.indexInflection - 1]
                        + ", " + this._sequenceDiffEvents1.indicesOfInflections[element.indexInflection] + "] must be even.";
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencyModifiedEvents", message);
                    error.logMessage();
                }
            }
        });
    }
    checkConsistencySumModifiedEvents() {
        let sum = 0;
        this.modifiedCurvExEvents.forEach(element => {
            sum += element.nbEvents;
        });
        if (sum !== 0) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistencySumModifiedEvents", "The sum of events appearing/disappearing must be null but is not: " + sum);
            error.logMessage();
        }
    }
    removeAllNeighboringEvents(listNeighboringEvents) {
        for (const neighboringEvents of listNeighboringEvents) {
            this.removeNeighboringEvents(neighboringEvents);
        }
    }
    removeNeighboringEvents(neighboringEvents) {
        let index = ExtremumLocationClassifiier_1.INITIAL_INDEX;
        let indexEvent = ExtremumLocationClassifiier_1.INITIAL_INDEX;
        for (const events of this.neighboringEvents) {
            index += 1;
            switch (events.type) {
                case NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumAppear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumAppear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringCurvExtremumLeftBoundaryDisappearInflectionAppear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvExtremumLeftBoundaryDisappearInflectionAppear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappearCurExtremumAppear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappearCurExtremumAppear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringCurvExtremumRightBoundaryDisappearInflectionAppear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvExtremumRightBoundaryDisappearInflectionAppear)
                        indexEvent = index;
                    break;
                case NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappearCurExtremumAppear:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappearCurExtremumAppear)
                        indexEvent = index;
                    break;
                default:
                    if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.none) {
                        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "removeNeighboringEvents", "The events to remove are of type 'none'. Inconsistent operation.");
                        warning.logMessage();
                    }
                    break;
            }
        }
        if (indexEvent === ExtremumLocationClassifiier_1.INITIAL_INDEX) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "removeNeighboringEvents", "Inconsistent index found when removing neighboring events from a comparator. Operation cannot be performed.");
            error.logMessage();
        }
        else {
            this.neighboringEvents.splice(indexEvent, 1);
        }
    }
    clone() {
        const comparator = new ComparatorOfSequencesOfDiffEvents(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
        comparator.neighboringEvents = this.neighboringEvents.slice();
        comparator.modifiedCurvExEvents = this.modifiedCurvExEvents.slice();
        comparator.modifiedInflectionEvents = this.modifiedInflectionEvents.slice();
        return comparator;
    }
    filterOutneighboringEvents(curveShapeSpaceNavigator) {
        const navigationCurveModel = curveShapeSpaceNavigator.navigationCurveModel;
        const filteredSeqComparator = this.clone();
        for (const neighboringEvents of this.neighboringEvents) {
            if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
                || neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear) {
                if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear) {
                    console.log("Curvature extremum disappear on the left boundary.");
                }
                else {
                    console.log("Curvature extremum appear on the left boundary.");
                }
                if (!curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
                || neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) {
                if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear) {
                    console.log("Curvature extremum disappear on the right boundary.");
                }
                else {
                    console.log("Curvature extremum appear on the right boundary.");
                }
                if (!curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
                console.log("Two Curvature extrema disappear between two inflections or an extreme interval or a unique interval.");
                if (curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                    const curvatureExt1 = filteredSeqComparator.sequenceDiffEvents1.eventAt(neighboringEvents.index);
                    navigationCurveModel.navigationState.transitionEvents.insertAt(curvatureExt1, 0);
                    const curvatureExt2 = filteredSeqComparator.sequenceDiffEvents1.eventAt(neighboringEvents.index + 1);
                    navigationCurveModel.navigationState.transitionEvents.insertAt(curvatureExt2, 1);
                }
                else {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                console.log("Two Curvature extrema appear between two inflections or an extreme interval or a unique interval.");
                if (curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
                    const curvatureExt1 = filteredSeqComparator.sequenceDiffEvents2.eventAt(neighboringEvents.index);
                    navigationCurveModel.navigationState.transitionEvents.insertAt(curvatureExt1, 0);
                    const curvatureExt2 = filteredSeqComparator.sequenceDiffEvents2.eventAt(neighboringEvents.index + 1);
                    navigationCurveModel.navigationState.transitionEvents.insertAt(curvatureExt2, 1);
                }
                else {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear
                || neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumAppear) {
                if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear) {
                    console.log("Two inflections disappear at a curvature extremum.");
                }
                else {
                    console.log("Two inflections appear at a curvature extremum.");
                }
                if (!curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlInflections) {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
                || neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear) {
                if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear) {
                    console.log("Inflection disappear on the left boundary.");
                }
                else {
                    console.log("Inflection appear on the left boundary.");
                }
                if (!curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlInflections) {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
                || neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear) {
                if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear) {
                    console.log("Inflection disappear on the right boundary.");
                }
                else {
                    console.log("Inflection appear on the right boundary.");
                }
                if (!curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlInflections) {
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
                }
            }
            else {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "filterOutneighboringEvents", "Incorrect transition of differential events.");
                error.logMessage();
            }
        }
        return filteredSeqComparator;
    }
    filterOutneighboringEventsNestedShapeSpacesNavigation(curveShapeSpaceNavigator) {
        const filteredSeqComparator = this.clone();
        for (const neighboringEvents of this.neighboringEvents) {
            if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
                || neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear) {
                if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear) {
                    console.log("Curvature extremum disappear on the left boundary.");
                }
                else {
                    console.log("Curvature extremum appear on the left boundary.");
                }
                if (!curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema)
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
                || neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) {
                if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear) {
                    console.log("Curvature extremum disappear on the right boundary.");
                }
                else {
                    console.log("Curvature extremum appear on the right boundary.");
                }
                if (!curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema)
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
                console.log("Two Curvature extrema disappear between two inflections or an extreme interval or a unique interval.");
                filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                console.log("Two Curvature extrema appear between two inflections or an extreme interval or a unique interval.");
                filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumDisappear) {
                console.log("Two inflections disappear at a curvature extremum.");
                filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionsCurvatureExtremumAppear) {
                console.log("Two inflections appear at a curvature extremum.");
                filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
                || neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear) {
                if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear) {
                    console.log("Inflection disappear on the left boundary.");
                }
                else {
                    console.log("Inflection appear on the left boundary.");
                }
                if (!curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlInflections)
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
                || neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear) {
                if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear) {
                    console.log("Inflection disappear on the right boundary.");
                }
                else {
                    console.log("Inflection appear on the right boundary.");
                }
                if (!curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlInflections)
                    filteredSeqComparator.removeNeighboringEvents(neighboringEvents);
            }
            else if (neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvExtremumLeftBoundaryDisappearInflectionAppear
                || neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappearCurExtremumAppear
                || neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringCurvExtremumRightBoundaryDisappearInflectionAppear
                || neighboringEvents.type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappearCurExtremumAppear) {
                console.log("curvature extremum and inflection moving. cannot be removed");
            }
            else {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "filterOutneighboringEvents", "Incorrect transition of differential events.");
                error.logMessage();
            }
        }
        return filteredSeqComparator;
    }
}
exports.ComparatorOfSequencesOfDiffEvents = ComparatorOfSequencesOfDiffEvents;
