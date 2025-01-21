"use strict";
/**
 * Set of parameters monitoring the state of the navigation process
 * @_activeControlInflections : if true activates the optimizer to navigate a shape space with a constant set of inflections
 * @_activeControlCurvatureExtrema : if true activates the optimizer to navigate a shape space with a constant set of curvature extrema
 * @_activeNavigationWithOptimizer : if true activates the optimizer to navigate a shape space in accordance with
 * _activeControlInflections and _activeControlCurvatureExtrema settings
 * if _activeControlInflections and _activeControlCurvatureExtrema are set to false both, _activeNavigationWithOptimizer must be set to false too
 * (there is no need for an optimization process)
 * when the _activeNavigationWithOptimizer is set to false, the shape space navigation process halts but the _activeControlInflections
 * and _activeControlCurvatureExtrema are not reset
 * @_slidingDifferentialEvents : if true the differential events are allowed to slide along the curve. A complementary feature
 * to be taken into account by the optimizer
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeSpaceDiffEventsStructure = exports.EventMgmtState = void 0;
var CurveCategory_1 = require("../shapeNavigableCurve/CurveCategory");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
var EventMgmtState;
(function (EventMgmtState) {
    EventMgmtState[EventMgmtState["Active"] = 0] = "Active";
    EventMgmtState[EventMgmtState["Inactive"] = 1] = "Inactive";
    EventMgmtState[EventMgmtState["NotApplicable"] = 2] = "NotApplicable";
})(EventMgmtState = exports.EventMgmtState || (exports.EventMgmtState = {}));
var ShapeSpaceDiffEventsStructure = /** @class */ (function () {
    function ShapeSpaceDiffEventsStructure(shapeNavigableCurve, curveShapeSpaceNavigator) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessage();
        this._curveCategory = shapeNavigableCurve.curveCategory;
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._activeNavigationWithOptimizer = false;
        this._activeControlInflections = false;
        // Initializes activeControlCurvatureExtrema, controlOfInflection in accordance with the navigation mode:
        //      mode 0: activeControlCurvatureExtrema = false, controlOfInflection = false,
        //      mode 1, mode 2: activeControlCurvatureExtrema = true, controlOfInflection = true
        this._activeControlCurvatureExtrema = false;
        // Initializes slidingDifferentialEvents in accordance with the navigation mode:
        //      mode 0: slidingDifferentialEvents = false
        //      mode 1, mode 2: slidingDifferentialEvents =  true
        this._slidingDifferentialEvents = false;
        if (this._curveCategory instanceof CurveCategory_1.OpenPlanarCurve) {
            this._managementOfEventsAtExtremities = EventMgmtState.Inactive;
        }
        else if (this._curveCategory instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this._managementOfEventsAtExtremities = EventMgmtState.NotApplicable;
        }
        else {
            this._managementOfEventsAtExtremities = EventMgmtState.NotApplicable;
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Curve category type unknown.");
            error.logMessage();
        }
    }
    Object.defineProperty(ShapeSpaceDiffEventsStructure.prototype, "activeControlInflections", {
        get: function () {
            return this._activeControlInflections;
        },
        set: function (controlOfInflections) {
            this._activeControlInflections = controlOfInflections;
            if (this._activeControlInflections === false && this._activeControlCurvatureExtrema === false) {
                this._activeNavigationWithOptimizer = false;
            }
            else {
                this._activeNavigationWithOptimizer = true;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceDiffEventsStructure.prototype, "activeControlCurvatureExtrema", {
        get: function () {
            return this._activeControlCurvatureExtrema;
        },
        set: function (controlOfCurvatureExtrema) {
            this._activeControlCurvatureExtrema = controlOfCurvatureExtrema;
            if (this._activeControlInflections === false && this._activeControlCurvatureExtrema === false) {
                this._activeNavigationWithOptimizer = false;
            }
            else {
                this._activeNavigationWithOptimizer = true;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceDiffEventsStructure.prototype, "slidingDifferentialEvents", {
        get: function () {
            return this._slidingDifferentialEvents;
        },
        set: function (slidingDiffEvents) {
            this._slidingDifferentialEvents = slidingDiffEvents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceDiffEventsStructure.prototype, "activeNavigationWithOptimizer", {
        get: function () {
            return this._activeNavigationWithOptimizer;
        },
        set: function (activeNavigation) {
            this._activeNavigationWithOptimizer = activeNavigation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceDiffEventsStructure.prototype, "managementOfEventsAtExtremities", {
        get: function () {
            return this._managementOfEventsAtExtremities;
        },
        set: function (managementOfEventsAtExtremities) {
            if (this._curveCategory instanceof CurveCategory_1.OpenPlanarCurve) {
                if (managementOfEventsAtExtremities === EventMgmtState.NotApplicable && this._slidingDifferentialEvents) {
                    var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "managementOfEventsAtExtremities", "Event management state incompatible with the open curve category");
                    error.logMessage();
                }
                else {
                    this._managementOfEventsAtExtremities = managementOfEventsAtExtremities;
                }
            }
            else if (this._curveCategory instanceof ClosedCurveModel_1.ClosedCurveModel) {
                if (managementOfEventsAtExtremities !== EventMgmtState.NotApplicable) {
                    var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "managementOfEventsAtExtremities", "Event management state incompatible with the closed curve category");
                    error.logMessage();
                }
                else {
                    this._managementOfEventsAtExtremities = managementOfEventsAtExtremities;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceDiffEventsStructure.prototype, "curveCategory", {
        get: function () {
            return this._curveCategory;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceDiffEventsStructure.prototype, "curveShapeSpaceNavigator", {
        get: function () {
            return this._curveShapeSpaceNavigator;
        },
        enumerable: false,
        configurable: true
    });
    ShapeSpaceDiffEventsStructure.prototype.reset = function () {
        this._activeNavigationWithOptimizer = false;
        // this._activeControlInflections = false;
        // this._activeControlCurvatureExtrema = false;
        // this._slidingDifferentialEvents = false;
    };
    ShapeSpaceDiffEventsStructure.prototype.stop = function () {
        this._activeNavigationWithOptimizer = false;
    };
    ShapeSpaceDiffEventsStructure.prototype.restart = function () {
        this._activeNavigationWithOptimizer = true;
    };
    return ShapeSpaceDiffEventsStructure;
}());
exports.ShapeSpaceDiffEventsStructure = ShapeSpaceDiffEventsStructure;
