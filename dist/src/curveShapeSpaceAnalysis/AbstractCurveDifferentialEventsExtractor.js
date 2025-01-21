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
exports.AbstractCurveDifferentialEventsExtractor = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var SequenceOfDifferentialEvents_1 = require("../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
var CurveDifferentialEventsLocations_1 = require("./CurveDifferentialEventsLocations");
var AbstractCurveDifferentialEventsExtractor = /** @class */ (function () {
    function AbstractCurveDifferentialEventsExtractor(curveToAnalyze) {
        this._observers = [];
        this._observersCP = [];
        this.curve = curveToAnalyze;
        this._sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents();
        this._crvDiffEventsLocations = new CurveDifferentialEventsLocations_1.CurveDifferentialEventsLocations();
    }
    Object.defineProperty(AbstractCurveDifferentialEventsExtractor.prototype, "sequenceOfDifferentialEvents", {
        get: function () {
            return this._sequenceOfDifferentialEvents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractCurveDifferentialEventsExtractor.prototype, "crvDiffEventsLocations", {
        get: function () {
            return this._crvDiffEventsLocations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractCurveDifferentialEventsExtractor.prototype, "observers", {
        get: function () {
            return this._observers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractCurveDifferentialEventsExtractor.prototype, "observersCP", {
        get: function () {
            return this._observersCP;
        },
        enumerable: false,
        configurable: true
    });
    AbstractCurveDifferentialEventsExtractor.prototype.registerObserver = function (observer, kind) {
        switch (kind) {
            case 'curve':
                this._observers.push(observer);
                var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'registerObserver', 'register as curve' + observer.constructor.name);
                warning.logMessage();
                break;
            case 'control points':
                this._observersCP.push(observer);
                warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'registerObserver', 'register as CP' + observer.constructor.name);
                warning.logMessage();
                break;
            default:
                throw Error("unknown kind");
        }
    };
    AbstractCurveDifferentialEventsExtractor.prototype.removeObserver = function (observer, kind) {
        switch (kind) {
            case 'curve':
                this._observers.splice(this._observers.indexOf(observer), 1);
                break;
            case 'control points':
                this._observersCP.splice(this._observersCP.indexOf(observer), 1);
                break;
        }
    };
    AbstractCurveDifferentialEventsExtractor.prototype.notifyObservers = function () {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values(this._observers), _d = _c.next(); !_d.done; _d = _c.next()) {
                var observer = _d.value;
                // const warning = new WarningLog(this.constructor.name, 'notifyObservers', "update as curve: " + observer.constructor.name);
                // warning.logMessageToConsole();
                observer.update(this._crvDiffEventsLocations.clone());
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _e = __values(this._observersCP), _f = _e.next(); !_f.done; _f = _e.next()) {
                var observer = _f.value;
                // const warning = new WarningLog(this.constructor.name, 'notifyObservers', "update as curve: " + observer.constructor.name);
                // warning.logMessageToConsole();
                observer.update(this._crvDiffEventsLocations.clone());
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    return AbstractCurveDifferentialEventsExtractor;
}());
exports.AbstractCurveDifferentialEventsExtractor = AbstractCurveDifferentialEventsExtractor;
