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
exports.StrictShapeSpacesBoundaryEnforcerClosedCurve = exports.StrictShapeSpacesBoundaryEnforcerOpenCurve = exports.NestedShapeSpacesBoundaryEnforcerOpenCurve = exports.AbstractShapeSpaceBoundaryEnforcer = exports.EventsAtCurveExtremities = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
var EventsAtCurveExtremities = /** @class */ (function () {
    function EventsAtCurveExtremities() {
        this._start = false;
        this._end = false;
    }
    Object.defineProperty(EventsAtCurveExtremities.prototype, "start", {
        get: function () {
            return this._start;
        },
        set: function (start) {
            this._start = start;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EventsAtCurveExtremities.prototype, "end", {
        get: function () {
            return this._end;
        },
        set: function (end) {
            this._end = end;
        },
        enumerable: false,
        configurable: true
    });
    return EventsAtCurveExtremities;
}());
exports.EventsAtCurveExtremities = EventsAtCurveExtremities;
var AbstractShapeSpaceBoundaryEnforcer = /** @class */ (function () {
    function AbstractShapeSpaceBoundaryEnforcer() {
        this.status = false;
        this._neighboringEvents = [];
    }
    Object.defineProperty(AbstractShapeSpaceBoundaryEnforcer.prototype, "neighboringEvents", {
        get: function () {
            return this._neighboringEvents;
        },
        enumerable: false,
        configurable: true
    });
    AbstractShapeSpaceBoundaryEnforcer.prototype.activate = function () {
        this.status = true;
    };
    AbstractShapeSpaceBoundaryEnforcer.prototype.isActive = function () {
        if (this.status) {
            return true;
        }
        else {
            return false;
        }
    };
    AbstractShapeSpaceBoundaryEnforcer.prototype.deactivate = function () {
        this.status = false;
    };
    AbstractShapeSpaceBoundaryEnforcer.prototype.addTransitionOfEvents = function (neighborinhEvents) {
        this._neighboringEvents = neighborinhEvents.slice();
    };
    AbstractShapeSpaceBoundaryEnforcer.prototype.hasTransitionsOfEvents = function () {
        var e_1, _a;
        if (this._neighboringEvents.length > 0) {
            var validList = true;
            try {
                for (var _b = __values(this._neighboringEvents), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var neighboringEvent = _c.value;
                    if (neighboringEvent.type === NeighboringEvents_1.NeighboringEventsType.none)
                        validList = false;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (validList) {
                return true;
            }
            else {
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "hasTransitionsOfEvents", "The list of current differential events is inconsistent");
                error.logMessage();
                return false;
            }
        }
        else {
            return false;
        }
    };
    AbstractShapeSpaceBoundaryEnforcer.prototype.resetNeighboringEvents = function () {
        this._neighboringEvents = [];
    };
    return AbstractShapeSpaceBoundaryEnforcer;
}());
exports.AbstractShapeSpaceBoundaryEnforcer = AbstractShapeSpaceBoundaryEnforcer;
var NestedShapeSpacesBoundaryEnforcerOpenCurve = /** @class */ (function (_super) {
    __extends(NestedShapeSpacesBoundaryEnforcerOpenCurve, _super);
    function NestedShapeSpacesBoundaryEnforcerOpenCurve() {
        var _this = _super.call(this) || this;
        _this._curvExtremumEventAtExtremity = new EventsAtCurveExtremities();
        _this._inflectionEventAtExtremity = new EventsAtCurveExtremities();
        return _this;
    }
    Object.defineProperty(NestedShapeSpacesBoundaryEnforcerOpenCurve.prototype, "curvExtremumEventAtExtremity", {
        get: function () {
            return this._curvExtremumEventAtExtremity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NestedShapeSpacesBoundaryEnforcerOpenCurve.prototype, "inflectionEventAtExtremity", {
        get: function () {
            return this._inflectionEventAtExtremity;
        },
        enumerable: false,
        configurable: true
    });
    NestedShapeSpacesBoundaryEnforcerOpenCurve.prototype.isTransitionAtExtremity = function () {
        var isTransition = false;
        if (this.isCurvatureExtTransitionAtExtremity() || this.isInflectionTransitionAtExtremity()
            || this.isMixedTransitionAtExtremity())
            isTransition = true;
        return isTransition;
    };
    NestedShapeSpacesBoundaryEnforcerOpenCurve.prototype.isCurvatureExtTransitionAtExtremity = function () {
        var isTransition = false;
        if ((this._curvExtremumEventAtExtremity.start || this._curvExtremumEventAtExtremity.end)
            && !(this._inflectionEventAtExtremity.start || this._inflectionEventAtExtremity.end))
            isTransition = true;
        return isTransition;
    };
    NestedShapeSpacesBoundaryEnforcerOpenCurve.prototype.isInflectionTransitionAtExtremity = function () {
        var isTransition = false;
        if (!(this._curvExtremumEventAtExtremity.start || this._curvExtremumEventAtExtremity.end)
            && (this._inflectionEventAtExtremity.start || this._inflectionEventAtExtremity.end))
            isTransition = true;
        return isTransition;
    };
    NestedShapeSpacesBoundaryEnforcerOpenCurve.prototype.isMixedTransitionAtExtremity = function () {
        var isTransition = false;
        if (this._curvExtremumEventAtExtremity.start && this._inflectionEventAtExtremity.end
            && !this._curvExtremumEventAtExtremity.end && !this._inflectionEventAtExtremity.start)
            isTransition = true;
        if (this._curvExtremumEventAtExtremity.end && this._inflectionEventAtExtremity.start
            && !this._curvExtremumEventAtExtremity.start && !this._inflectionEventAtExtremity.end)
            isTransition = true;
        return isTransition;
    };
    NestedShapeSpacesBoundaryEnforcerOpenCurve.prototype.resetEventsAtExtremities = function () {
        this._curvExtremumEventAtExtremity = new EventsAtCurveExtremities();
        this._inflectionEventAtExtremity = new EventsAtCurveExtremities();
    };
    NestedShapeSpacesBoundaryEnforcerOpenCurve.prototype.reset = function () {
        this.resetNeighboringEvents();
        this.resetEventsAtExtremities();
        this.status = false;
    };
    NestedShapeSpacesBoundaryEnforcerOpenCurve.prototype.configureBoundaryEnforcer = function (filteredSeqComparator) {
        if (filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
            || filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear) {
            this.curvExtremumEventAtExtremity.start = true;
        }
        else if (filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
            || filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) {
            this.curvExtremumEventAtExtremity.end = true;
        }
        else if (filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear
            || filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionLeftBoundaryAppear) {
            this.inflectionEventAtExtremity.start = true;
        }
        else if (filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryDisappear
            || filteredSeqComparator.neighboringEvents[0].type === NeighboringEvents_1.NeighboringEventsType.neighboringInflectionRightBoundaryAppear) {
            this.inflectionEventAtExtremity.end = true;
        }
        this.activate();
        this.neighboringEvents.push(filteredSeqComparator.neighboringEvents[0]);
    };
    return NestedShapeSpacesBoundaryEnforcerOpenCurve;
}(AbstractShapeSpaceBoundaryEnforcer));
exports.NestedShapeSpacesBoundaryEnforcerOpenCurve = NestedShapeSpacesBoundaryEnforcerOpenCurve;
var StrictShapeSpacesBoundaryEnforcerOpenCurve = /** @class */ (function (_super) {
    __extends(StrictShapeSpacesBoundaryEnforcerOpenCurve, _super);
    function StrictShapeSpacesBoundaryEnforcerOpenCurve() {
        var _this = _super.call(this) || this;
        _this._curvatureDerivativeCPOpt = [];
        _this._newEvent = false;
        return _this;
    }
    Object.defineProperty(StrictShapeSpacesBoundaryEnforcerOpenCurve.prototype, "curvatureDerivativeCPOpt", {
        get: function () {
            return this._curvatureDerivativeCPOpt;
        },
        set: function (curvatureDerivativeCPOpt) {
            this._curvatureDerivativeCPOpt = curvatureDerivativeCPOpt.slice();
        },
        enumerable: false,
        configurable: true
    });
    StrictShapeSpacesBoundaryEnforcerOpenCurve.prototype.newEventExist = function () {
        this._newEvent = true;
    };
    StrictShapeSpacesBoundaryEnforcerOpenCurve.prototype.removeNewEvent = function () {
        this._newEvent = false;
    };
    StrictShapeSpacesBoundaryEnforcerOpenCurve.prototype.hasNewEvent = function () {
        if (this._newEvent) {
            return true;
        }
        else {
            return false;
        }
    };
    return StrictShapeSpacesBoundaryEnforcerOpenCurve;
}(NestedShapeSpacesBoundaryEnforcerOpenCurve));
exports.StrictShapeSpacesBoundaryEnforcerOpenCurve = StrictShapeSpacesBoundaryEnforcerOpenCurve;
var StrictShapeSpacesBoundaryEnforcerClosedCurve = /** @class */ (function (_super) {
    __extends(StrictShapeSpacesBoundaryEnforcerClosedCurve, _super);
    function StrictShapeSpacesBoundaryEnforcerClosedCurve() {
        var _this = _super.call(this) || this;
        _this._curvatureDerivativeCPOpt = [];
        _this._newEvent = false;
        return _this;
    }
    StrictShapeSpacesBoundaryEnforcerClosedCurve.prototype.reset = function () {
        this.resetNeighboringEvents();
        this.status = false;
    };
    StrictShapeSpacesBoundaryEnforcerClosedCurve.prototype.newEventExist = function () {
        this._newEvent = true;
    };
    StrictShapeSpacesBoundaryEnforcerClosedCurve.prototype.removeNewEvent = function () {
        this._newEvent = false;
    };
    StrictShapeSpacesBoundaryEnforcerClosedCurve.prototype.hasNewEvent = function () {
        if (this._newEvent) {
            return true;
        }
        else {
            return false;
        }
    };
    return StrictShapeSpacesBoundaryEnforcerClosedCurve;
}(AbstractShapeSpaceBoundaryEnforcer));
exports.StrictShapeSpacesBoundaryEnforcerClosedCurve = StrictShapeSpacesBoundaryEnforcerClosedCurve;
