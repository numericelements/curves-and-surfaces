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
exports.CurveModelObserverInCurveSceneController = exports.CurveModelObserverInFileEventListener = exports.CurveModelObserverInShapeSpaceNavigationEventListener = exports.CurveModelObserverInCurveModelEventListener = exports.CurveModelObserverInChartEventListener = void 0;
var CurveModel_1 = require("../newModels/CurveModel");
var ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
var NavigationState_1 = require("../curveShapeSpaceNavigation/NavigationState");
var ShapeNavigableCurve_1 = require("../shapeNavigableCurve/ShapeNavigableCurve");
var NavigationCurveModel_1 = require("../curveShapeSpaceNavigation/NavigationCurveModel");
var CurveConstraintSelectionState_1 = require("../controllers/CurveConstraintSelectionState");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var EventStateAtCurveExtremity_1 = require("../shapeNavigableCurve/EventStateAtCurveExtremity");
var CurveSceneControllerInteractionStrategy_1 = require("../controllers/CurveSceneControllerInteractionStrategy");
var CurveModelObserver = /** @class */ (function () {
    function CurveModelObserver() {
    }
    return CurveModelObserver;
}());
var CurveModelObserverInChartEventListener = /** @class */ (function (_super) {
    __extends(CurveModelObserverInChartEventListener, _super);
    function CurveModelObserverInChartEventListener(listener) {
        var _this = _super.call(this) || this;
        _this.listener = listener;
        return _this;
    }
    CurveModelObserverInChartEventListener.prototype.update = function (message) {
        var degreeChange = this.listener.shapeNavigableCurve.curveCategory.degreeChange;
        var curveModelChange = this.listener.shapeNavigableCurve.curveCategory.curveModelChange;
        if (curveModelChange) {
            if (message instanceof CurveModel_1.CurveModel) {
                if (this.listener.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel')) {
                    this.listener.curveModel = message;
                    this.listener.resetChartContext();
                }
            }
            else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
                if (this.listener.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel')) {
                    this.listener.curveModel = message;
                    this.listener.resetChartContext();
                }
            }
        }
    };
    CurveModelObserverInChartEventListener.prototype.reset = function (message) {
        if (message instanceof CurveModel_1.CurveModel) {
            var curveModel = new CurveModel_1.CurveModel();
            if (curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel')) {
                this.listener.curveModel = curveModel;
            }
        }
        else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
            var curveModel = new ClosedCurveModel_1.ClosedCurveModel();
            if (curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel')) {
                this.listener.curveModel = curveModel;
            }
        }
    };
    return CurveModelObserverInChartEventListener;
}(CurveModelObserver));
exports.CurveModelObserverInChartEventListener = CurveModelObserverInChartEventListener;
var CurveModelObserverInCurveModelEventListener = /** @class */ (function (_super) {
    __extends(CurveModelObserverInCurveModelEventListener, _super);
    function CurveModelObserverInCurveModelEventListener(listener) {
        var _this = _super.call(this) || this;
        _this.listener = listener;
        return _this;
    }
    CurveModelObserverInCurveModelEventListener.prototype.update = function (message) {
        this.listener.curveModel = message;
        var curveCategory = this.listener.shapeNavigableCurve.curveCategory;
        if (message instanceof CurveModel_1.CurveModel) {
            curveCategory.curveModel = message;
            var curveShapeSpaceNavigator = this.listener.curveShapeSpaceNavigator;
            if (curveShapeSpaceNavigator !== undefined) {
                curveShapeSpaceNavigator.navigationCurveModel.curveModel = message;
                var shapeSpaceConfigurationChange = curveShapeSpaceNavigator.curveControlState.curveControlParamChange;
                var navigationStateChange = curveShapeSpaceNavigator.navigationState.navigationStateChange;
                var curveModelChange = this.listener.shapeNavigableCurve.curveCategory.curveModelChange;
                if (curveModelChange) {
                    var degree = message.spline.degree;
                    this.listener.updateCurveDegreeSelector(degree);
                    this.listener.reinitializeConstraintControl();
                }
                if (navigationStateChange) {
                    var degree = message.spline.degree;
                    this.listener.updateCurveDegreeSelector(degree);
                    // this.listener.shapeNavigableCurve.clampedPoints.push(NO_CONSTRAINT);
                    // this.listener.shapeNavigableCurve.clampedPoints.push(NO_CONSTRAINT);
                    if (curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring
                        || curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring) {
                        this.listener.resetConstraintControl();
                        this.listener.disableCurveClamping();
                        if (curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring)
                            curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.EventSlideOutsideCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                        if (curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring)
                            curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                        curveShapeSpaceNavigator.eventStateAtCrvExtremities = curveShapeSpaceNavigator.eventMgmtAtExtremities.eventStateAtCrvExtremities;
                    }
                    else {
                        this.listener.enableCurveClamping();
                        this.listener.restorePreviousConstraintControl();
                        curveShapeSpaceNavigator.eventStateAtCrvExtremities = curveShapeSpaceNavigator.eventMgmtAtExtremities.eventStateAtCrvExtremities;
                        // this.listener.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintClampedFirstControlPoint(this.listener.shapeNavigableCurve.curveConstraints));
                    }
                }
                if (shapeSpaceConfigurationChange) {
                    curveCategory.curveModelDifferentialEventsLocations = curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
                }
            }
        }
        else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.listener.shapeNavigableCurve.curveCategory.curveModel = message;
            var curveShapeSpaceNavigator = this.listener.curveShapeSpaceNavigator;
            if (curveShapeSpaceNavigator !== undefined) {
                curveShapeSpaceNavigator.navigationCurveModel.curveModel = message;
                var shapeSpaceConfigurationChange = curveShapeSpaceNavigator.curveControlState.curveControlParamChange;
                var navigationStateChange = curveShapeSpaceNavigator.navigationState.navigationStateChange;
                var curveModelChange = this.listener.shapeNavigableCurve.curveCategory.curveModelChange;
                if (curveModelChange) {
                    var degree = message.spline.degree;
                    this.listener.updateCurveDegreeSelector(degree);
                    this.listener.reinitializeConstraintControl();
                }
                if (navigationStateChange) {
                    var degree = message.spline.degree;
                    this.listener.updateCurveDegreeSelector(degree);
                    // this.listener.shapeNavigableCurve.clampedPoints.push(NO_CONSTRAINT);
                    // this.listener.shapeNavigableCurve.clampedPoints.push(NO_CONSTRAINT);
                    if (curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring
                        || curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring) {
                        if (curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring)
                            curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                        this.listener.resetConstraintControl();
                        this.listener.disableCurveClamping();
                    }
                    else {
                        this.listener.enableCurveClamping();
                        this.listener.restorePreviousConstraintControl();
                        curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                        curveShapeSpaceNavigator.eventStateAtCrvExtremities = curveShapeSpaceNavigator.eventMgmtAtExtremities.eventStateAtCrvExtremities;
                        // this.listener.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintClampedFirstControlPoint(this.listener.shapeNavigableCurve.curveConstraints));
                    }
                }
                if (shapeSpaceConfigurationChange) {
                    curveCategory.curveModelDifferentialEventsLocations = curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
                }
            }
        }
    };
    CurveModelObserverInCurveModelEventListener.prototype.reset = function (message) {
        if (message instanceof CurveModel_1.CurveModel) {
            var curveModel = new CurveModel_1.CurveModel();
            this.listener.curveModel = curveModel;
            this.listener.shapeNavigableCurve.curveCategory.curveModel = curveModel;
        }
        else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in CurveModelEventListener");
        }
    };
    return CurveModelObserverInCurveModelEventListener;
}(CurveModelObserver));
exports.CurveModelObserverInCurveModelEventListener = CurveModelObserverInCurveModelEventListener;
var CurveModelObserverInShapeSpaceNavigationEventListener = /** @class */ (function (_super) {
    __extends(CurveModelObserverInShapeSpaceNavigationEventListener, _super);
    function CurveModelObserverInShapeSpaceNavigationEventListener(listener) {
        var _this = _super.call(this) || this;
        _this.listener = listener;
        _this.navigationState = _this.listener.curveShapeSpaceNavigator.navigationState;
        return _this;
    }
    CurveModelObserverInShapeSpaceNavigationEventListener.prototype.update = function (message) {
        var curveShapeSpaceNavigator = this.listener.curveShapeSpaceNavigator;
        var curveModelChange = curveShapeSpaceNavigator.shapeNavigableCurve.curveCategory.curveModelChange;
        var navigationStateChange = curveShapeSpaceNavigator.navigationState.navigationStateChange;
        var shapeSpaceConfigurationChange = curveShapeSpaceNavigator.curveControlState.curveControlParamChange;
        this.listener.curveShapeSpaceNavigator.navigationCurveModel.curveModel = message;
        if (curveModelChange) {
            if (message instanceof CurveModel_1.CurveModel) {
                curveShapeSpaceNavigator.navigationCurveModel = new NavigationCurveModel_1.OpenCurveShapeSpaceNavigator(curveShapeSpaceNavigator);
                if (curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
                    curveShapeSpaceNavigator.navigationCurveModel.changeNavigationState(new NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring(curveShapeSpaceNavigator.navigationCurveModel));
                }
            }
            else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
                curveShapeSpaceNavigator.navigationCurveModel = new NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator(this.listener.curveShapeSpaceNavigator);
                if (curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
                    curveShapeSpaceNavigator.navigationCurveModel.changeNavigationState(new NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring(curveShapeSpaceNavigator.navigationCurveModel));
                }
            }
            this.listener.resetCurveShapeControlButtons();
            this.listener.disableControlOfCurvatureExtrema();
            this.listener.disableControlOfInflections();
            this.listener.disableControlOfSliding();
            this.listener.disableEventMgmtAtCurveExt();
            this.listener.reinitializeNavigationMode();
            curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
            curveShapeSpaceNavigator.navigationState = curveShapeSpaceNavigator.navigationCurveModel.navigationState;
            this.listener.reinitializePreviousShapeControlButtons();
        }
        else if (!curveModelChange && navigationStateChange) {
            this.updateNavigationState();
            // this.updateCurveModelMaintainNavigationState();
            if (this.listener.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring
                || this.listener.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring) {
                this.listener.storeCurrentCurveShapeControlButtons();
                this.listener.resetCurveShapeControlButtons();
                this.listener.disableControlOfCurvatureExtrema();
                this.listener.disableControlOfInflections();
                this.listener.disableControlOfSliding();
                this.listener.disableEventMgmtAtCurveExt();
                if (this.listener.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring)
                    curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.EventSlideOutsideCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                if (this.listener.curveShapeSpaceNavigator.navigationState instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring)
                    curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
            }
            else {
                // curveShapeSpaceNavigator.navigationCurveModel.currentCurve = curveShapeSpaceNavigator.shapeNavigableCurve.curveCategory.curveModel.spline;
                // curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = curveShapeSpaceNavigator.navigationCurveModel.currentCurve;
                this.listener.enableControlOfCurvatureExtrema();
                this.listener.enableControlOfInflections();
                this.listener.enableControlOfSliding();
                this.listener.updateCurveShapeControlButtons();
                this.listener.restorePreviousCurveShapeControlButtons();
                this.listener.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this.listener.curveShapeSpaceNavigator.curveControlState;
                if (this.listener.sliding) {
                    curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStateAtCurveExtremity_1.EventStayInsideCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                }
            }
        }
        else if (shapeSpaceConfigurationChange) {
            // nothing to do there at the moment
        }
    };
    CurveModelObserverInShapeSpaceNavigationEventListener.prototype.updateNavigationState = function () {
        this.navigationState = this.listener.curveShapeSpaceNavigator.navigationState;
    };
    CurveModelObserverInShapeSpaceNavigationEventListener.prototype.updateCurveModelMaintainNavigationState = function () {
        if (this.navigationState instanceof NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring
            || this.navigationState instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring) {
            this.listener.curveShapeSpaceNavigator.navigationState.setNavigationWithoutShapeSpaceMonitoring();
        }
        else if (this.navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces
            || this.navigationState instanceof NavigationState_1.CCurveNavigationThroughSimplerShapeSpaces) {
            this.listener.curveShapeSpaceNavigator.navigationState.setNavigationThroughSimplerShapeSpaces();
        }
        else if (this.navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace
            || this.navigationState instanceof NavigationState_1.CCurveNavigationStrictlyInsideShapeSpace) {
            this.listener.curveShapeSpaceNavigator.navigationState.setNavigationStrictlyInsideShapeSpace();
        }
    };
    CurveModelObserverInShapeSpaceNavigationEventListener.prototype.reset = function (message) {
        if (message instanceof CurveModel_1.CurveModel) {
            var curveModel = new CurveModel_1.CurveModel();
            if (curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel')) {
                this.listener.curveShapeSpaceNavigator.navigationCurveModel.curveModel = this.listener.curveShapeSpaceNavigator.shapeNavigableCurve.curveCategory.curveModel;
            }
        }
        else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in ShapeSpaceNavigationEventListener");
        }
    };
    return CurveModelObserverInShapeSpaceNavigationEventListener;
}(CurveModelObserver));
exports.CurveModelObserverInShapeSpaceNavigationEventListener = CurveModelObserverInShapeSpaceNavigationEventListener;
var CurveModelObserverInFileEventListener = /** @class */ (function (_super) {
    __extends(CurveModelObserverInFileEventListener, _super);
    function CurveModelObserverInFileEventListener(listener) {
        var _this = _super.call(this) || this;
        _this.listener = listener;
        return _this;
    }
    CurveModelObserverInFileEventListener.prototype.update = function (message) {
        if (message instanceof CurveModel_1.CurveModel) {
            this.listener.curveModel = this.listener.shapeNavigableCurve.curveCategory.curveModel;
            console.log("something to do there with CurveModel in FileEventListener");
        }
        else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.listener.curveModel = this.listener.shapeNavigableCurve.curveCategory.curveModel;
            console.log("something to do there with ClosedCurveModel in FileEventListener");
        }
    };
    CurveModelObserverInFileEventListener.prototype.reset = function (message) {
        if (message instanceof CurveModel_1.CurveModel) {
            console.log("something to do there with CurveModel in FileEventListener");
        }
        else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in FileEventListener");
        }
    };
    return CurveModelObserverInFileEventListener;
}(CurveModelObserver));
exports.CurveModelObserverInFileEventListener = CurveModelObserverInFileEventListener;
var CurveModelObserverInCurveSceneController = /** @class */ (function (_super) {
    __extends(CurveModelObserverInCurveSceneController, _super);
    function CurveModelObserverInCurveSceneController(listener) {
        var _this = _super.call(this) || this;
        _this.listener = listener;
        return _this;
    }
    CurveModelObserverInCurveSceneController.prototype.update = function (message) {
        this.listener.curveModel = message;
        this.listener.curveModelDifferentialEventsExtractor = this.listener.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents;
        this.listener.curveDiffEventsLocations = this.listener.curveModelDifferentialEventsExtractor.crvDiffEventsLocations;
        if (!this.listener.shapeNavigableCurve.curveCategory.curveModelChange)
            this.listener.removeCurveObservers();
        this.listener.initCurveSceneView();
        var navigationState = this.listener.curveShapeSpaceNavigator.navigationState;
        this.listener.navigationState = navigationState;
        if (!this.listener.shapeNavigableCurve.curveCategory.curveModelChange) {
            if (navigationState instanceof NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring ||
                navigationState instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring) {
                if (this.listener.shapeNavigableCurve.controlOfCurveClamping) {
                    var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "update", " incorrect status of control of curve clamping.");
                    error.logMessage();
                }
                this.listener.curveConstraintTransitionTo(new CurveConstraintSelectionState_1.HandleConstraintAtPoint1Point2NoConstraintState(this.listener));
                this.listener.changeSceneInteraction(new CurveSceneControllerInteractionStrategy_1.CurveSceneControllerNoShapeSpaceConstraintsCPSelection(this.listener));
                this.listener.clampedControlPointView.clearSelectedPoints();
            }
            else {
                if (navigationState instanceof NavigationState_1.OCurveNavigationThroughSimplerShapeSpaces ||
                    navigationState instanceof NavigationState_1.CCurveNavigationThroughSimplerShapeSpaces) {
                    this.listener.changeSceneInteraction(new CurveSceneControllerInteractionStrategy_1.CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this.listener));
                }
                else if (navigationState instanceof NavigationState_1.OCurveNavigationStrictlyInsideShapeSpace ||
                    navigationState instanceof NavigationState_1.CCurveNavigationStrictlyInsideShapeSpace) {
                    this.listener.changeSceneInteraction(new CurveSceneControllerInteractionStrategy_1.CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(this.listener));
                }
                if (!this.listener.shapeNavigableCurve.controlOfCurveClamping) {
                    this.listener.curveConstraintTransitionTo(new CurveConstraintSelectionState_1.HandleConstraintAtPoint1Point2NoConstraintState(this.listener));
                    this.listener.clampedControlPointView.clearSelectedPoints();
                }
                else {
                    if (this.listener.shapeNavigableCurve.clampedPoints[0] !== ShapeNavigableCurve_1.NO_CONSTRAINT) {
                        this.listener.curveConstraintTransitionTo(new CurveConstraintSelectionState_1.HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this.listener));
                    }
                    if (this.listener.shapeNavigableCurve.clampedPoints[1] !== ShapeNavigableCurve_1.NO_CONSTRAINT) {
                        if (this.listener.curveConstraintSelectionState instanceof CurveConstraintSelectionState_1.HandleConstraintAtPoint1Point2NoConstraintState) {
                            this.listener.curveConstraintTransitionTo(new CurveConstraintSelectionState_1.HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(this.listener));
                        }
                        else if (this.listener.curveConstraintSelectionState instanceof CurveConstraintSelectionState_1.HandleConstraintAtPoint1ConstraintPoint2NoConstraintState) {
                            this.listener.curveConstraintTransitionTo(new CurveConstraintSelectionState_1.HandleConstraintAtPoint1Point2ConstraintState(this.listener));
                        }
                    }
                }
            }
            this.listener.curveModel.notifyObservers();
        }
        else {
            if (message instanceof CurveModel_1.CurveModel) {
                this.listener.curveModel = this.listener.shapeNavigableCurve.curveCategory.curveModel;
                // this.listener.initCurveSceneView();
            }
            else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
                this.listener.curveModel = this.listener.shapeNavigableCurve.curveCategory.curveModel;
                this.listener.removeCurveObservers();
                this.listener.initCurveSceneView();
                var navigationState_1 = this.listener.curveShapeSpaceNavigator.navigationState;
                this.listener.navigationState = navigationState_1;
            }
        }
        this.listener.renderFrame();
    };
    CurveModelObserverInCurveSceneController.prototype.reset = function (message) {
    };
    return CurveModelObserverInCurveSceneController;
}(CurveModelObserver));
exports.CurveModelObserverInCurveSceneController = CurveModelObserverInCurveSceneController;
