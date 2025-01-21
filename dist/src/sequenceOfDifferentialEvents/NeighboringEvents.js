"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeighboringEvents = exports.INITIAL_INTERV_INDEX = exports.NeighboringEventsType = void 0;
var NeighboringEventsType;
(function (NeighboringEventsType) {
    NeighboringEventsType[NeighboringEventsType["neighboringCurExtremumLeftBoundary"] = 0] = "neighboringCurExtremumLeftBoundary";
    NeighboringEventsType[NeighboringEventsType["neighboringInflectionLeftBoundary"] = 1] = "neighboringInflectionLeftBoundary";
    NeighboringEventsType[NeighboringEventsType["neighboringCurExtremumRightBoundary"] = 2] = "neighboringCurExtremumRightBoundary";
    NeighboringEventsType[NeighboringEventsType["neighboringInflectionRightBoundary"] = 3] = "neighboringInflectionRightBoundary";
    NeighboringEventsType[NeighboringEventsType["neighboringCurvatureExtrema"] = 4] = "neighboringCurvatureExtrema";
    NeighboringEventsType[NeighboringEventsType["neighboringInflectionsCurvatureExtremum"] = 5] = "neighboringInflectionsCurvatureExtremum";
    NeighboringEventsType[NeighboringEventsType["none"] = 6] = "none";
    NeighboringEventsType[NeighboringEventsType["neighboringCurvatureExtremaAppear"] = 7] = "neighboringCurvatureExtremaAppear";
    NeighboringEventsType[NeighboringEventsType["neighboringCurvatureExtremaDisappear"] = 8] = "neighboringCurvatureExtremaDisappear";
    NeighboringEventsType[NeighboringEventsType["neighboringInflectionsCurvatureExtremumAppear"] = 9] = "neighboringInflectionsCurvatureExtremumAppear";
    NeighboringEventsType[NeighboringEventsType["neighboringInflectionsCurvatureExtremumDisappear"] = 10] = "neighboringInflectionsCurvatureExtremumDisappear";
    NeighboringEventsType[NeighboringEventsType["neighboringCurExtremumLeftBoundaryAppear"] = 11] = "neighboringCurExtremumLeftBoundaryAppear";
    NeighboringEventsType[NeighboringEventsType["neighboringCurExtremumLeftBoundaryDisappear"] = 12] = "neighboringCurExtremumLeftBoundaryDisappear";
    NeighboringEventsType[NeighboringEventsType["neighboringCurExtremumRightBoundaryAppear"] = 13] = "neighboringCurExtremumRightBoundaryAppear";
    NeighboringEventsType[NeighboringEventsType["neighboringCurExtremumRightBoundaryDisappear"] = 14] = "neighboringCurExtremumRightBoundaryDisappear";
    NeighboringEventsType[NeighboringEventsType["neighboringInflectionLeftBoundaryAppear"] = 15] = "neighboringInflectionLeftBoundaryAppear";
    NeighboringEventsType[NeighboringEventsType["neighboringInflectionLeftBoundaryDisappear"] = 16] = "neighboringInflectionLeftBoundaryDisappear";
    NeighboringEventsType[NeighboringEventsType["neighboringInflectionRightBoundaryAppear"] = 17] = "neighboringInflectionRightBoundaryAppear";
    NeighboringEventsType[NeighboringEventsType["neighboringInflectionRightBoundaryDisappear"] = 18] = "neighboringInflectionRightBoundaryDisappear";
    NeighboringEventsType[NeighboringEventsType["neighboringCurvExtremumLeftBoundaryDisappearInflectionAppear"] = 19] = "neighboringCurvExtremumLeftBoundaryDisappearInflectionAppear";
    NeighboringEventsType[NeighboringEventsType["neighboringInflectionLeftBoundaryDisappearCurExtremumAppear"] = 20] = "neighboringInflectionLeftBoundaryDisappearCurExtremumAppear";
    NeighboringEventsType[NeighboringEventsType["neighboringCurvExtremumRightBoundaryDisappearInflectionAppear"] = 21] = "neighboringCurvExtremumRightBoundaryDisappearInflectionAppear";
    NeighboringEventsType[NeighboringEventsType["neighboringInflectionRightBoundaryDisappearCurExtremumAppear"] = 22] = "neighboringInflectionRightBoundaryDisappearCurExtremumAppear";
    NeighboringEventsType[NeighboringEventsType["moreThanOneEvent"] = 23] = "moreThanOneEvent";
})(NeighboringEventsType = exports.NeighboringEventsType || (exports.NeighboringEventsType = {}));
exports.INITIAL_INTERV_INDEX = -1;
var NeighboringEvents = /** @class */ (function () {
    /**
     * All configurations of events that can appear or disappear when comparing two consecutive sequences of differential events.
     * The configurations are elementary ones enumerated in NeighboringEventsType.
     * @param eventType Type of differential events enumerated in NeighboringEventsType
     * @param indexInSequence Location of interval where the events appear in the sequence of differential events.
     * It is defined by the index of the index of an inflection as right bound of the interval betwwen [0,sequence.length] and initialized
     * to INITIAL_INTERV_INDEX, i.e., -1, if not explicitly defined.
     */
    function NeighboringEvents(eventType, indexInSequence) {
        if (eventType !== undefined) {
            this._type = eventType;
        }
        else {
            this._type = NeighboringEventsType.none;
        }
        if (indexInSequence !== undefined) {
            this._index = indexInSequence;
        }
        else {
            this._index = exports.INITIAL_INTERV_INDEX;
        }
    }
    Object.defineProperty(NeighboringEvents.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (eventType) {
            this._type = eventType;
            return;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NeighboringEvents.prototype, "index", {
        get: function () {
            return this._index;
        },
        set: function (indexInSequence) {
            this._index = indexInSequence;
            return;
        },
        enumerable: false,
        configurable: true
    });
    NeighboringEvents.prototype.clear = function () {
        this._index = exports.INITIAL_INTERV_INDEX;
        this._type = NeighboringEventsType.none;
    };
    return NeighboringEvents;
}());
exports.NeighboringEvents = NeighboringEvents;
