"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveShapeSpaceNavigator = exports.ActiveInflectionLocationControl = exports.ActiveExtremaLocationControl = exports.CONVERGENCE_THRESHOLD = exports.MAX_TRUST_REGION_RADIUS = exports.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ShapeSpaceDiffEventsStructure_1 = require("./ShapeSpaceDiffEventsStructure");
const EventMgmtAtCurveExtremities_1 = require("../shapeNavigableCurve/EventMgmtAtCurveExtremities");
const CurveControlState_1 = require("../controllers/CurveControlState");
const NavigationCurveModel_1 = require("./NavigationCurveModel");
exports.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER = 800;
exports.MAX_TRUST_REGION_RADIUS = 100;
exports.CONVERGENCE_THRESHOLD = 10e-8;
/* JCL 2023/03/25 used only in curve control strategies SlidingStrategy, NoSlidingStrategy, ... */
var ActiveExtremaLocationControl;
(function (ActiveExtremaLocationControl) {
    ActiveExtremaLocationControl[ActiveExtremaLocationControl["mergeExtrema"] = 0] = "mergeExtrema";
    ActiveExtremaLocationControl[ActiveExtremaLocationControl["none"] = 1] = "none";
    ActiveExtremaLocationControl[ActiveExtremaLocationControl["stopDeforming"] = 2] = "stopDeforming";
    ActiveExtremaLocationControl[ActiveExtremaLocationControl["extremumLeaving"] = 3] = "extremumLeaving";
    ActiveExtremaLocationControl[ActiveExtremaLocationControl["extremumEntering"] = 4] = "extremumEntering";
})(ActiveExtremaLocationControl = exports.ActiveExtremaLocationControl || (exports.ActiveExtremaLocationControl = {}));
var ActiveInflectionLocationControl;
(function (ActiveInflectionLocationControl) {
    ActiveInflectionLocationControl[ActiveInflectionLocationControl["mergeExtremaAndInflection"] = 0] = "mergeExtremaAndInflection";
    ActiveInflectionLocationControl[ActiveInflectionLocationControl["none"] = 1] = "none";
    ActiveInflectionLocationControl[ActiveInflectionLocationControl["stopDeforming"] = 2] = "stopDeforming";
})(ActiveInflectionLocationControl = exports.ActiveInflectionLocationControl || (exports.ActiveInflectionLocationControl = {}));
class CurveShapeSpaceNavigator {
    constructor(shapeNavigableCurve) {
        // Initializes controlOfEventsAtExtremity in accordance with the navigation mode:
        //      mode 0, mode 1, mode 2: controlOfCurveClamping =  false,
        this._controlOfEventsAtExtremity = false;
        this._shapeNavigableCurve = shapeNavigableCurve;
        this._shapeSpaceDiffEventsStructure = new ShapeSpaceDiffEventsStructure_1.ShapeSpaceDiffEventsStructure(this._shapeNavigableCurve, this);
        this._navigationCurveModel = new NavigationCurveModel_1.OpenCurveShapeSpaceNavigator(this);
        this._navigationState = this._navigationCurveModel.navigationState;
        this._navigationState.navigationStateChange = false;
        this._eventMgmtAtExtremities = new EventMgmtAtCurveExtremities_1.EventMgmtAtCurveExtremities(this);
        this._eventStateAtCrvExtremities = this._eventMgmtAtExtremities.eventStateAtCrvExtremities;
        this._curveControlState = new CurveControlState_1.HandleNoDiffEventNoSlidingState(this);
        this._navigationCurveModel.curveControlState = this._curveControlState;
        this._curveControlState.curveControlParamChange = false;
        this.curveSceneController = undefined;
    }
    get navigationCurveModel() {
        return this._navigationCurveModel;
    }
    get navigationState() {
        return this._navigationState;
    }
    get controlOfEventsAtExtremity() {
        return this._controlOfEventsAtExtremity;
    }
    get eventMgmtAtExtremities() {
        return this._eventMgmtAtExtremities;
    }
    get eventStateAtCrvExtremities() {
        return this._eventStateAtCrvExtremities;
    }
    get shapeNavigableCurve() {
        return this._shapeNavigableCurve;
    }
    get shapeSpaceDiffEventsStructure() {
        return this._shapeSpaceDiffEventsStructure;
    }
    get curveControlState() {
        return this._curveControlState;
    }
    set controlOfEventsAtExtremity(controlOfEventsAtExtremity) {
        this._controlOfEventsAtExtremity = controlOfEventsAtExtremity;
    }
    set eventStateAtCrvExtremities(eventStateAtCrvExtremities) {
        this._eventStateAtCrvExtremities = eventStateAtCrvExtremities;
    }
    set navigationCurveModel(navigationCurveModel) {
        this._navigationCurveModel = navigationCurveModel;
    }
    set navigationState(navigationState) {
        this._navigationState = navigationState;
    }
    set curveControlState(curveControlState) {
        this._curveControlState = curveControlState;
    }
    getActiveControlInflections() {
        return this._shapeSpaceDiffEventsStructure.activeControlInflections;
    }
    getActiveControlCurvatureExtrema() {
        return this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema;
    }
    getSlidingDifferentialEvents() {
        return this._shapeSpaceDiffEventsStructure.slidingDifferentialEvents;
    }
    getManagementDiffEventsAtExtremities() {
        return this._shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities;
    }
    setActiveControlInflections(activeControlInflections) {
        this._shapeSpaceDiffEventsStructure.activeControlInflections = activeControlInflections;
    }
    setActiveControlCurvatureExtrema(activeControlCurvatureExtrema) {
        this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = activeControlCurvatureExtrema;
    }
    setSlidingDifferentialEvents(slidingDifferentialEvents) {
        this._shapeSpaceDiffEventsStructure.slidingDifferentialEvents = slidingDifferentialEvents;
    }
    setManagementDiffEventsAtExtremities(eventManagementStateAtExtremity) {
        this._shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities = eventManagementStateAtExtremity;
    }
    transitionTo(curveControlState) {
        this._curveControlState = curveControlState;
    }
    toggleSliding() {
        this._curveControlState.handleSliding();
    }
    toggleControlOfCurvatureExtrema() {
        this._curveControlState.handleCurvatureExtrema();
    }
    toggleControlOfInflections() {
        this._curveControlState.handleInflections();
    }
    toggleEventMgmtAtCurveExt() {
        // this._curveControl.toggleEventMgmtAtCurveExt();
        this._controlOfEventsAtExtremity = !this._controlOfEventsAtExtremity;
        console.log("control of event at extremity: " + this._controlOfEventsAtExtremity);
        this._eventMgmtAtExtremities.processEventAtCurveExtremity();
    }
    restoreCurveControlState(shapeSpaceNavigationEventListener) {
        if (shapeSpaceNavigationEventListener.previousControlOfCurvatureExtrema) {
            if (shapeSpaceNavigationEventListener.previousControlOfInflection) {
                if (shapeSpaceNavigationEventListener.previousSliding) {
                    this.curveControlState = new CurveControlState_1.HandleInflectionsAndCurvatureExtremaSlidingState(this);
                }
                else {
                    this.curveControlState = new CurveControlState_1.HandleInflectionsAndCurvatureExtremaNoSlidingState(this);
                }
            }
            else {
                if (shapeSpaceNavigationEventListener.previousSliding) {
                    this.curveControlState = new CurveControlState_1.HandleCurvatureExtremaSlidingState(this);
                }
                else {
                    this.curveControlState = new CurveControlState_1.HandleCurvatureExtremaNoSlidingState(this);
                }
            }
        }
        else {
            if (shapeSpaceNavigationEventListener.previousControlOfInflection) {
                if (shapeSpaceNavigationEventListener.previousSliding) {
                    this.curveControlState = new CurveControlState_1.HandleInflectionsSlidingState(this);
                }
                else {
                    this.curveControlState = new CurveControlState_1.HandleInflectionsNoSlidingState(this);
                }
            }
            else {
                this.curveControlState = new CurveControlState_1.HandleNoDiffEventNoSlidingState(this);
                shapeSpaceNavigationEventListener.disableControlOfSliding();
            }
        }
    }
    inputSelectNavigationProcess(navigationID) {
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "inputSelectNavigationProcess", navigationID.toString());
        warning.logMessage();
        switch (navigationID) {
            case 0: {
                this._navigationState.setNavigationWithoutShapeSpaceMonitoring();
                break;
            }
            case 1: {
                this._navigationState.setNavigationThroughSimplerShapeSpaces();
                break;
            }
            case 2: {
                this._navigationState.setNavigationStrictlyInsideShapeSpace();
                break;
            }
            default: {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "inputSelectNavigationProcess", "no available navigation process.");
                error.logMessage();
                break;
            }
        }
        // JCL 2021/12/07 temporary setting to keep consistency between curvescenecontroller context and curveShapeSpaceNavigator context
        // JCL 2021/12/07 should be removed when the curveScenceController context would be decomposed into (UI and graphics) and the curveShapeSpaceNavigator context on the other side
        // this.navigationState = this.curveShapeSpaceNavigator.navigationState;
    }
}
exports.CurveShapeSpaceNavigator = CurveShapeSpaceNavigator;
