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
const CurveCategory_1 = require("../shapeNavigableCurve/CurveCategory");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
var EventMgmtState;
(function (EventMgmtState) {
    EventMgmtState[EventMgmtState["Active"] = 0] = "Active";
    EventMgmtState[EventMgmtState["Inactive"] = 1] = "Inactive";
    EventMgmtState[EventMgmtState["NotApplicable"] = 2] = "NotApplicable";
})(EventMgmtState = exports.EventMgmtState || (exports.EventMgmtState = {}));
class ShapeSpaceDiffEventsStructure {
    constructor(shapeNavigableCurve, curveShapeSpaceNavigator) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'constructor', 'start constructor.');
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
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Curve category type unknown.");
            error.logMessage();
        }
    }
    set activeControlInflections(controlOfInflections) {
        this._activeControlInflections = controlOfInflections;
        if (!this._activeControlInflections && !this._activeControlCurvatureExtrema) {
            this._activeNavigationWithOptimizer = false;
        }
        else {
            this._activeNavigationWithOptimizer = true;
        }
    }
    set activeControlCurvatureExtrema(controlOfCurvatureExtrema) {
        this._activeControlCurvatureExtrema = controlOfCurvatureExtrema;
        if (!this._activeControlInflections && !this._activeControlCurvatureExtrema) {
            this._activeNavigationWithOptimizer = false;
        }
        else {
            this._activeNavigationWithOptimizer = true;
        }
    }
    set slidingDifferentialEvents(slidingDiffEvents) {
        this._slidingDifferentialEvents = slidingDiffEvents;
    }
    set activeNavigationWithOptimizer(activeNavigation) {
        this._activeNavigationWithOptimizer = activeNavigation;
    }
    set managementOfEventsAtExtremities(managementOfEventsAtExtremities) {
        if (this._curveCategory instanceof CurveCategory_1.OpenPlanarCurve) {
            if (managementOfEventsAtExtremities === EventMgmtState.NotApplicable && this._slidingDifferentialEvents) {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "managementOfEventsAtExtremities", "Event management state incompatible with the open curve category");
                error.logMessage();
            }
            else {
                this._managementOfEventsAtExtremities = managementOfEventsAtExtremities;
            }
        }
        else if (this._curveCategory instanceof ClosedCurveModel_1.ClosedCurveModel) {
            if (managementOfEventsAtExtremities !== EventMgmtState.NotApplicable) {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "managementOfEventsAtExtremities", "Event management state incompatible with the closed curve category");
                error.logMessage();
            }
            else {
                this._managementOfEventsAtExtremities = managementOfEventsAtExtremities;
            }
        }
    }
    get activeControlInflections() {
        return this._activeControlInflections;
    }
    get activeControlCurvatureExtrema() {
        return this._activeControlCurvatureExtrema;
    }
    get slidingDifferentialEvents() {
        return this._slidingDifferentialEvents;
    }
    get activeNavigationWithOptimizer() {
        return this._activeNavigationWithOptimizer;
    }
    get curveCategory() {
        return this._curveCategory;
    }
    get managementOfEventsAtExtremities() {
        return this._managementOfEventsAtExtremities;
    }
    get curveShapeSpaceNavigator() {
        return this._curveShapeSpaceNavigator;
    }
    reset() {
        this._activeNavigationWithOptimizer = false;
        // this._activeControlInflections = false;
        // this._activeControlCurvatureExtrema = false;
        // this._slidingDifferentialEvents = false;
    }
    stop() {
        this._activeNavigationWithOptimizer = false;
    }
    restart() {
        this._activeNavigationWithOptimizer = true;
    }
}
exports.ShapeSpaceDiffEventsStructure = ShapeSpaceDiffEventsStructure;
