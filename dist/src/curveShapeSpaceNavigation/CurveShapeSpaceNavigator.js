"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveShapeSpaceNavigator = exports.ActiveInflectionLocationControl = exports.ActiveExtremaLocationControl = exports.CONVERGENCE_THRESHOLD = exports.MAX_TRUST_REGION_RADIUS = exports.MAX_NB_STEPS_TRUST_REGION_OPTIMIZER = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var ShapeSpaceDiffEventsStructure_1 = require("./ShapeSpaceDiffEventsStructure");
var EventMgmtAtCurveExtremities_1 = require("../shapeNavigableCurve/EventMgmtAtCurveExtremities");
var CurveControlState_1 = require("../controllers/CurveControlState");
var NavigationCurveModel_1 = require("./NavigationCurveModel");
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
var CurveShapeSpaceNavigator = /** @class */ (function () {
    function CurveShapeSpaceNavigator(shapeNavigableCurve) {
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
    Object.defineProperty(CurveShapeSpaceNavigator.prototype, "navigationCurveModel", {
        get: function () {
            return this._navigationCurveModel;
        },
        set: function (navigationCurveModel) {
            this._navigationCurveModel = navigationCurveModel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveShapeSpaceNavigator.prototype, "navigationState", {
        get: function () {
            return this._navigationState;
        },
        set: function (navigationState) {
            this._navigationState = navigationState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveShapeSpaceNavigator.prototype, "controlOfEventsAtExtremity", {
        get: function () {
            return this._controlOfEventsAtExtremity;
        },
        set: function (controlOfEventsAtExtremity) {
            this._controlOfEventsAtExtremity = controlOfEventsAtExtremity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveShapeSpaceNavigator.prototype, "eventMgmtAtExtremities", {
        get: function () {
            return this._eventMgmtAtExtremities;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveShapeSpaceNavigator.prototype, "eventStateAtCrvExtremities", {
        get: function () {
            return this._eventStateAtCrvExtremities;
        },
        set: function (eventStateAtCrvExtremities) {
            this._eventStateAtCrvExtremities = eventStateAtCrvExtremities;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveShapeSpaceNavigator.prototype, "shapeNavigableCurve", {
        get: function () {
            return this._shapeNavigableCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveShapeSpaceNavigator.prototype, "shapeSpaceDiffEventsStructure", {
        get: function () {
            return this._shapeSpaceDiffEventsStructure;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveShapeSpaceNavigator.prototype, "curveControlState", {
        get: function () {
            return this._curveControlState;
        },
        set: function (curveControlState) {
            this._curveControlState = curveControlState;
        },
        enumerable: false,
        configurable: true
    });
    CurveShapeSpaceNavigator.prototype.getActiveControlInflections = function () {
        return this._shapeSpaceDiffEventsStructure.activeControlInflections;
    };
    CurveShapeSpaceNavigator.prototype.getActiveControlCurvatureExtrema = function () {
        return this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema;
    };
    CurveShapeSpaceNavigator.prototype.getSlidingDifferentialEvents = function () {
        return this._shapeSpaceDiffEventsStructure.slidingDifferentialEvents;
    };
    CurveShapeSpaceNavigator.prototype.getManagementDiffEventsAtExtremities = function () {
        return this._shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities;
    };
    CurveShapeSpaceNavigator.prototype.setActiveControlInflections = function (activeControlInflections) {
        this._shapeSpaceDiffEventsStructure.activeControlInflections = activeControlInflections;
    };
    CurveShapeSpaceNavigator.prototype.setActiveControlCurvatureExtrema = function (activeControlCurvatureExtrema) {
        this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = activeControlCurvatureExtrema;
    };
    CurveShapeSpaceNavigator.prototype.setSlidingDifferentialEvents = function (slidingDifferentialEvents) {
        this._shapeSpaceDiffEventsStructure.slidingDifferentialEvents = slidingDifferentialEvents;
    };
    CurveShapeSpaceNavigator.prototype.setManagementDiffEventsAtExtremities = function (eventManagementStateAtExtremity) {
        this._shapeSpaceDiffEventsStructure.managementOfEventsAtExtremities = eventManagementStateAtExtremity;
    };
    CurveShapeSpaceNavigator.prototype.transitionTo = function (curveControlState) {
        this._curveControlState = curveControlState;
    };
    CurveShapeSpaceNavigator.prototype.toggleSliding = function () {
        this._curveControlState.handleSliding();
    };
    CurveShapeSpaceNavigator.prototype.toggleControlOfCurvatureExtrema = function () {
        this._curveControlState.handleCurvatureExtrema();
    };
    CurveShapeSpaceNavigator.prototype.toggleControlOfInflections = function () {
        this._curveControlState.handleInflections();
    };
    CurveShapeSpaceNavigator.prototype.toggleEventMgmtAtCurveExt = function () {
        // this._curveControl.toggleEventMgmtAtCurveExt();
        this._controlOfEventsAtExtremity = !this._controlOfEventsAtExtremity;
        console.log("control of event at extremity: " + this._controlOfEventsAtExtremity);
        this._eventMgmtAtExtremities.processEventAtCurveExtremity();
    };
    CurveShapeSpaceNavigator.prototype.restoreCurveControlState = function (shapeSpaceNavigationEventListener) {
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
    };
    CurveShapeSpaceNavigator.prototype.inputSelectNavigationProcess = function (navigationID) {
        var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "inputSelectNavigationProcess", navigationID.toString());
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
                var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "inputSelectNavigationProcess", "no available navigation process.");
                error.logMessage();
                break;
            }
        }
        // JCL 2021/12/07 temporary setting to keep consistency between curvescenecontroller context and curveShapeSpaceNavigator context
        // JCL 2021/12/07 should be removed when the curveScenceController context would be decomposed into (UI and graphics) and the curveShapeSpaceNavigator context on the other side
        // this.navigationState = this.curveShapeSpaceNavigator.navigationState;
    };
    return CurveShapeSpaceNavigator;
}());
exports.CurveShapeSpaceNavigator = CurveShapeSpaceNavigator;
