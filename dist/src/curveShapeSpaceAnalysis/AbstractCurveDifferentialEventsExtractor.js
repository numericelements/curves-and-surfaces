"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCurveDifferentialEventsExtractor = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const SequenceOfDifferentialEvents_1 = require("../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
const CurveDifferentialEventsLocations_1 = require("./CurveDifferentialEventsLocations");
class AbstractCurveDifferentialEventsExtractor {
    constructor(curveToAnalyze) {
        this._observers = [];
        this._observersCP = [];
        this.curve = curveToAnalyze;
        this._sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents_1.SequenceOfDifferentialEvents();
        this._crvDiffEventsLocations = new CurveDifferentialEventsLocations_1.CurveDifferentialEventsLocations();
    }
    get sequenceOfDifferentialEvents() {
        return this._sequenceOfDifferentialEvents;
    }
    get crvDiffEventsLocations() {
        return this._crvDiffEventsLocations;
    }
    get observers() {
        return this._observers;
    }
    get observersCP() {
        return this._observersCP;
    }
    registerObserver(observer, kind) {
        switch (kind) {
            case 'curve':
                this._observers.push(observer);
                let warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'registerObserver', 'register as curve' + observer.constructor.name);
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
    }
    removeObserver(observer, kind) {
        switch (kind) {
            case 'curve':
                this._observers.splice(this._observers.indexOf(observer), 1);
                break;
            case 'control points':
                this._observersCP.splice(this._observersCP.indexOf(observer), 1);
                break;
        }
    }
    notifyObservers() {
        for (let observer of this._observers) {
            // const warning = new WarningLog(this.constructor.name, 'notifyObservers', "update as curve: " + observer.constructor.name);
            // warning.logMessageToConsole();
            observer.update(this._crvDiffEventsLocations.clone());
        }
        for (let observer of this._observersCP) {
            // const warning = new WarningLog(this.constructor.name, 'notifyObservers', "update as curve: " + observer.constructor.name);
            // warning.logMessageToConsole();
            observer.update(this._crvDiffEventsLocations.clone());
        }
    }
}
exports.AbstractCurveDifferentialEventsExtractor = AbstractCurveDifferentialEventsExtractor;
