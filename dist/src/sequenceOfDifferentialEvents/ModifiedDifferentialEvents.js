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
exports.ModifiedInflectionEvents = exports.ModifiedCurvatureEvents = exports.ModifiedDifferentialEvents = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var DifferentialEvent_1 = require("./DifferentialEvent");
var ModifiedDifferentialEvents = /** @class */ (function () {
    function ModifiedDifferentialEvents(order) {
        this.order = order;
        this.checkOrder();
    }
    ModifiedDifferentialEvents.prototype.checkOrder = function () {
        if (this.order !== DifferentialEvent_1.ORDER_INFLECTION && this.order !== DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkOrder", "Inconsistent value of differential event order.");
            error.logMessage();
        }
    };
    return ModifiedDifferentialEvents;
}());
exports.ModifiedDifferentialEvents = ModifiedDifferentialEvents;
/**
* Characterization of modified differential events of type curvature extrema within a sequence of differential events.
* It applies to configurations where inflections are invariant (constant number) when a curve gets modified.
* The events are located within a sequence of differential events using the index of an inflection to identify the interval between two successive inflections
*/
var ModifiedCurvatureEvents = /** @class */ (function (_super) {
    __extends(ModifiedCurvatureEvents, _super);
    /**
     * instantiates a ModifiedCurvatureEvents that is located within a sequence of differential events
    * @param indexInflection index of the inflection defining the interval between inflection where the number of curvature extrema is modified
    * @param nbEventsModified number of curvature extrema appearing (nbEventsModified > 0) or disappearing (nbEventsModified < 0) between
    * two successive inflections defined by indexInflection.
    * @throws errors if the number of modified event is null
    */
    function ModifiedCurvatureEvents(indexInflection, nbEventsModified) {
        var _this = _super.call(this, DifferentialEvent_1.ORDER_CURVATURE_EXTREMUM) || this;
        _this._indexInflection = indexInflection;
        _this._nbEvents = nbEventsModified;
        if (_this._nbEvents === 0) {
            var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, "constructor", "The number of modified differential events is set to 0, which is incorrect.");
            warning.logMessage();
        }
        return _this;
    }
    Object.defineProperty(ModifiedCurvatureEvents.prototype, "indexInflection", {
        get: function () {
            return this._indexInflection;
        },
        set: function (indexInflection) {
            this._indexInflection = indexInflection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ModifiedCurvatureEvents.prototype, "nbEvents", {
        get: function () {
            return this._nbEvents;
        },
        set: function (nbEventsModified) {
            this._nbEvents = nbEventsModified;
        },
        enumerable: false,
        configurable: true
    });
    return ModifiedCurvatureEvents;
}(ModifiedDifferentialEvents));
exports.ModifiedCurvatureEvents = ModifiedCurvatureEvents;
/**
* Characterization of modified differential events of type inflections within a sequence of differential events.
* It applies to configurations where curvature extrema are invariant (constant number) when a curve gets modified.
* The events are located within a sequence of differential events using the index of a curvature extremum to identify
* either the interval between two successive inflections or an extreme interval (in case of open curves)
*/
var ModifiedInflectionEvents = /** @class */ (function (_super) {
    __extends(ModifiedInflectionEvents, _super);
    /**
     * instantiates a ModifiedInflectionEvents that is located within a sequence of differential events
    * @param indexCurvatureEx index of the curvature ext defining the intervals where the number of inflections is modified
    * @param nbEventsModified number of inflections appearing (nbEventsModified > 0) or disappearing (nbEventsModified < 0) that
    * are adjacent to the event defined by indexCurvatureEx.
    * @throws errors if the number of modified event is null
    */
    function ModifiedInflectionEvents(indexCurvatureEx, nbEventsModified) {
        var _this = _super.call(this, DifferentialEvent_1.ORDER_INFLECTION) || this;
        _this._indexCurvatureEx = indexCurvatureEx;
        _this._nbEvents = nbEventsModified;
        if (_this._nbEvents === 0) {
            var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, "constructor", "The number of modified differential events is set to 0, which is incorrect.");
            warning.logMessage();
        }
        return _this;
    }
    Object.defineProperty(ModifiedInflectionEvents.prototype, "indexCurvatureEx", {
        get: function () {
            return this._indexCurvatureEx;
        },
        set: function (indexCurvatureEx) {
            this._indexCurvatureEx = indexCurvatureEx;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ModifiedInflectionEvents.prototype, "nbEvents", {
        get: function () {
            return this._nbEvents;
        },
        set: function (nbEventsModified) {
            this._nbEvents = nbEventsModified;
        },
        enumerable: false,
        configurable: true
    });
    return ModifiedInflectionEvents;
}(ModifiedDifferentialEvents));
exports.ModifiedInflectionEvents = ModifiedInflectionEvents;
