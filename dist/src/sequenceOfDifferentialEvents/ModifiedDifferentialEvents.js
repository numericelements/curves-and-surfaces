"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifiedInflectionEvents = exports.ModifiedCurvatureEvents = exports.ModifiedDifferentialEvents = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const DifferentialEvent_1 = require("./DifferentialEvent");
class ModifiedDifferentialEvents {
    constructor(order) {
        this.order = order;
        this.checkOrder();
    }
    checkOrder() {
        if (this.order !== DifferentialEvent_1.ORDER_INFLECTION && this.order !== DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkOrder", "Inconsistent value of differential event order.");
            error.logMessage();
        }
    }
}
exports.ModifiedDifferentialEvents = ModifiedDifferentialEvents;
/**
* Characterization of modified differential events of type curvature extrema within a sequence of differential events.
* It applies to configurations where inflections are invariant (constant number) when a curve gets modified.
* The events are located within a sequence of differential events using the index of an inflection to identify the interval between two successive inflections
*/
class ModifiedCurvatureEvents extends ModifiedDifferentialEvents {
    /**
     * instantiates a ModifiedCurvatureEvents that is located within a sequence of differential events
    * @param indexInflection index of the inflection defining the interval between inflection where the number of curvature extrema is modified
    * @param nbEventsModified number of curvature extrema appearing (nbEventsModified > 0) or disappearing (nbEventsModified < 0) between
    * two successive inflections defined by indexInflection.
    * @throws errors if the number of modified event is null
    */
    constructor(indexInflection, nbEventsModified) {
        super(DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM);
        this._indexInflection = indexInflection;
        this._nbEvents = nbEventsModified;
        if (this._nbEvents === 0) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "constructor", "The number of modified differential events is set to 0, which is incorrect.");
            warning.logMessage();
        }
    }
    set indexInflection(indexInflection) {
        this._indexInflection = indexInflection;
    }
    set nbEvents(nbEventsModified) {
        this._nbEvents = nbEventsModified;
    }
    get indexInflection() {
        return this._indexInflection;
    }
    get nbEvents() {
        return this._nbEvents;
    }
}
exports.ModifiedCurvatureEvents = ModifiedCurvatureEvents;
/**
* Characterization of modified differential events of type inflections within a sequence of differential events.
* It applies to configurations where curvature extrema are invariant (constant number) when a curve gets modified.
* The events are located within a sequence of differential events using the index of a curvature extremum to identify
* either the interval between two successive inflections or an extreme interval (in case of open curves)
*/
class ModifiedInflectionEvents extends ModifiedDifferentialEvents {
    /**
     * instantiates a ModifiedInflectionEvents that is located within a sequence of differential events
    * @param indexCurvatureEx index of the curvature ext defining the intervals where the number of inflections is modified
    * @param nbEventsModified number of inflections appearing (nbEventsModified > 0) or disappearing (nbEventsModified < 0) that
    * are adjacent to the event defined by indexCurvatureEx.
    * @throws errors if the number of modified event is null
    */
    constructor(indexCurvatureEx, nbEventsModified) {
        super(DifferentialEvent_1.ORDER_INFLECTION);
        this._indexCurvatureEx = indexCurvatureEx;
        this._nbEvents = nbEventsModified;
        if (this._nbEvents === 0) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "constructor", "The number of modified differential events is set to 0, which is incorrect.");
            warning.logMessage();
        }
    }
    set indexCurvatureEx(indexCurvatureEx) {
        this._indexCurvatureEx = indexCurvatureEx;
    }
    set nbEvents(nbEventsModified) {
        this._nbEvents = nbEventsModified;
    }
    get indexCurvatureEx() {
        return this._indexCurvatureEx;
    }
    get nbEvents() {
        return this._nbEvents;
    }
}
exports.ModifiedInflectionEvents = ModifiedInflectionEvents;
