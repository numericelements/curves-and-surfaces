"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveModelObserverInCurveSceneController = exports.CurveModelObserverInFileEventListener = exports.CurveModelObserverInShapeSpaceNavigationEventListener = exports.CurveModelObserverInCurveModelEventListener = exports.CurveModelObserverInChartEventListener = void 0;
const CurveModel_1 = require("../newModels/CurveModel");
const ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
const NavigationState_1 = require("../curveShapeSpaceNavigation/NavigationState");
const ShapeNavigableCurve_1 = require("../shapeNavigableCurve/ShapeNavigableCurve");
const NavigationCurveModel_1 = require("../curveShapeSpaceNavigation/NavigationCurveModel");
const CurveConstraintSelectionState_1 = require("../controllers/CurveConstraintSelectionState");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const EventStateAtCurveExtremity_1 = require("../shapeNavigableCurve/EventStateAtCurveExtremity");
const CurveSceneControllerInteractionStrategy_1 = require("../controllers/CurveSceneControllerInteractionStrategy");
class CurveModelObserver {
}
class CurveModelObserverInChartEventListener extends CurveModelObserver {
    constructor(listener) {
        super();
        this.listener = listener;
    }
    update(message) {
        const degreeChange = this.listener.shapeNavigableCurve.curveCategory.degreeChange;
        const curveModelChange = this.listener.shapeNavigableCurve.curveCategory.curveModelChange;
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
    }
    reset(message) {
        if (message instanceof CurveModel_1.CurveModel) {
            const curveModel = new CurveModel_1.CurveModel();
            if (curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel')) {
                this.listener.curveModel = curveModel;
            }
        }
        else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
            const curveModel = new ClosedCurveModel_1.ClosedCurveModel();
            if (curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel')) {
                this.listener.curveModel = curveModel;
            }
        }
    }
}
exports.CurveModelObserverInChartEventListener = CurveModelObserverInChartEventListener;
class CurveModelObserverInCurveModelEventListener extends CurveModelObserver {
    constructor(listener) {
        super();
        this.listener = listener;
    }
    update(message) {
        this.listener.curveModel = message;
        const curveCategory = this.listener.shapeNavigableCurve.curveCategory;
        if (message instanceof CurveModel_1.CurveModel) {
            curveCategory.curveModel = message;
            const curveShapeSpaceNavigator = this.listener.curveShapeSpaceNavigator;
            if (curveShapeSpaceNavigator !== undefined) {
                curveShapeSpaceNavigator.navigationCurveModel.curveModel = message;
                const shapeSpaceConfigurationChange = curveShapeSpaceNavigator.curveControlState.curveControlParamChange;
                const navigationStateChange = curveShapeSpaceNavigator.navigationState.navigationStateChange;
                const curveModelChange = this.listener.shapeNavigableCurve.curveCategory.curveModelChange;
                if (curveModelChange) {
                    const degree = message.spline.degree;
                    this.listener.updateCurveDegreeSelector(degree);
                    this.listener.reinitializeConstraintControl();
                }
                if (navigationStateChange) {
                    const degree = message.spline.degree;
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
            const curveShapeSpaceNavigator = this.listener.curveShapeSpaceNavigator;
            if (curveShapeSpaceNavigator !== undefined) {
                curveShapeSpaceNavigator.navigationCurveModel.curveModel = message;
                const shapeSpaceConfigurationChange = curveShapeSpaceNavigator.curveControlState.curveControlParamChange;
                const navigationStateChange = curveShapeSpaceNavigator.navigationState.navigationStateChange;
                const curveModelChange = this.listener.shapeNavigableCurve.curveCategory.curveModelChange;
                if (curveModelChange) {
                    const degree = message.spline.degree;
                    this.listener.updateCurveDegreeSelector(degree);
                    this.listener.reinitializeConstraintControl();
                }
                if (navigationStateChange) {
                    const degree = message.spline.degree;
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
    }
    reset(message) {
        if (message instanceof CurveModel_1.CurveModel) {
            const curveModel = new CurveModel_1.CurveModel();
            this.listener.curveModel = curveModel;
            this.listener.shapeNavigableCurve.curveCategory.curveModel = curveModel;
        }
        else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in CurveModelEventListener");
        }
    }
}
exports.CurveModelObserverInCurveModelEventListener = CurveModelObserverInCurveModelEventListener;
class CurveModelObserverInShapeSpaceNavigationEventListener extends CurveModelObserver {
    constructor(listener) {
        super();
        this.listener = listener;
        this.navigationState = this.listener.curveShapeSpaceNavigator.navigationState;
    }
    update(message) {
        const curveShapeSpaceNavigator = this.listener.curveShapeSpaceNavigator;
        const curveModelChange = curveShapeSpaceNavigator.shapeNavigableCurve.curveCategory.curveModelChange;
        const navigationStateChange = curveShapeSpaceNavigator.navigationState.navigationStateChange;
        const shapeSpaceConfigurationChange = curveShapeSpaceNavigator.curveControlState.curveControlParamChange;
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
    }
    updateNavigationState() {
        this.navigationState = this.listener.curveShapeSpaceNavigator.navigationState;
    }
    updateCurveModelMaintainNavigationState() {
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
    }
    reset(message) {
        if (message instanceof CurveModel_1.CurveModel) {
            const curveModel = new CurveModel_1.CurveModel();
            if (curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel')) {
                this.listener.curveShapeSpaceNavigator.navigationCurveModel.curveModel = this.listener.curveShapeSpaceNavigator.shapeNavigableCurve.curveCategory.curveModel;
            }
        }
        else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in ShapeSpaceNavigationEventListener");
        }
    }
}
exports.CurveModelObserverInShapeSpaceNavigationEventListener = CurveModelObserverInShapeSpaceNavigationEventListener;
class CurveModelObserverInFileEventListener extends CurveModelObserver {
    constructor(listener) {
        super();
        this.listener = listener;
    }
    update(message) {
        if (message instanceof CurveModel_1.CurveModel) {
            this.listener.curveModel = this.listener.shapeNavigableCurve.curveCategory.curveModel;
            console.log("something to do there with CurveModel in FileEventListener");
        }
        else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.listener.curveModel = this.listener.shapeNavigableCurve.curveCategory.curveModel;
            console.log("something to do there with ClosedCurveModel in FileEventListener");
        }
    }
    reset(message) {
        if (message instanceof CurveModel_1.CurveModel) {
            console.log("something to do there with CurveModel in FileEventListener");
        }
        else if (message instanceof ClosedCurveModel_1.ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in FileEventListener");
        }
    }
}
exports.CurveModelObserverInFileEventListener = CurveModelObserverInFileEventListener;
class CurveModelObserverInCurveSceneController extends CurveModelObserver {
    constructor(listener) {
        super();
        this.listener = listener;
    }
    update(message) {
        this.listener.curveModel = message;
        this.listener.curveModelDifferentialEventsExtractor = this.listener.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents;
        this.listener.curveDiffEventsLocations = this.listener.curveModelDifferentialEventsExtractor.crvDiffEventsLocations;
        if (!this.listener.shapeNavigableCurve.curveCategory.curveModelChange)
            this.listener.removeCurveObservers();
        this.listener.initCurveSceneView();
        const navigationState = this.listener.curveShapeSpaceNavigator.navigationState;
        this.listener.navigationState = navigationState;
        if (!this.listener.shapeNavigableCurve.curveCategory.curveModelChange) {
            if (navigationState instanceof NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring ||
                navigationState instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring) {
                if (this.listener.shapeNavigableCurve.controlOfCurveClamping) {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "update", " incorrect status of control of curve clamping.");
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
                const navigationState = this.listener.curveShapeSpaceNavigator.navigationState;
                this.listener.navigationState = navigationState;
            }
        }
        this.listener.renderFrame();
    }
    reset(message) {
    }
}
exports.CurveModelObserverInCurveSceneController = CurveModelObserverInCurveSceneController;
