import { IObserver } from "../newDesignPatterns/Observer";
import { ChartEventListener, CurveModelDefinitionEventListener, FileEventListener, ShapeSpaceNavigationEventListener } from "../userInterfaceController/UserInterfaceEventListener";
import { CurveModel } from "../newModels/CurveModel";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveSceneController } from "../controllers/CurveSceneController";
import { CCurveNavigationStrictlyInsideShapeSpace, CCurveNavigationThroughSimplerShapeSpaces, CCurveNavigationWithoutShapeSpaceMonitoring, NavigationState, OCurveNavigationStrictlyInsideShapeSpace, OCurveNavigationThroughSimplerShapeSpaces, OCurveNavigationWithoutShapeSpaceMonitoring } from "../curveShapeSpaceNavigation/NavigationState";
import { NO_CONSTRAINT } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { ClosedCurveShapeSpaceNavigator, OpenCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/NavigationCurveModel";
import { EventMgmtAtCurveExtremities } from "../shapeNavigableCurve/EventMgmtAtCurveExtremities";
import { CurveConstraintClampedFirstControlPoint, CurveConstraintNoConstraint } from "../curveShapeSpaceNavigation/CurveConstraintStrategy";
import { HandleConstraintAtPoint1ConstraintPoint2NoConstraintState, HandleConstraintAtPoint1NoConstraintPoint2ConstraintState, HandleConstraintAtPoint1Point2ConstraintState, HandleConstraintAtPoint1Point2NoConstraintState } from "../controllers/CurveConstraintSelectionState";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { EventSlideOutsideCurve, EventStayInsideCurve, NoEventToManageForCurve } from "../shapeNavigableCurve/EventStateAtCurveExtremity";
import { CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection, CurveSceneControllerNoShapeSpaceConstraintsCPSelection, CurveSceneControllerStrictlyInsideShapeSpaceCPSelection } from "../controllers/CurveSceneControllerInteractionStrategy";

abstract class CurveModelObserver implements IObserver<CurveModel> {

    abstract update(message: CurveModelInterface): void;

    abstract reset(message: CurveModelInterface): void;

}
export class CurveModelObserverInChartEventListener extends CurveModelObserver {

    private listener: ChartEventListener;

    constructor(listener: ChartEventListener) {
        super();
        this.listener = listener;
    }

    update(message: CurveModelInterface): void {
        const degreeChange = this.listener.shapeNavigableCurve.curveCategory.degreeChange;
        const curveModelChange = this.listener.shapeNavigableCurve.curveCategory.curveModelChange;
        if(curveModelChange) {
            if(message instanceof CurveModel) {
                if(this.listener.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
                {
                    this.listener.curveModel = message;
                    this.listener.resetChartContext();
                }
            } else if(message instanceof ClosedCurveModel) {
                if(this.listener.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
                {
                    this.listener.curveModel = message;
                    this.listener.resetChartContext();
                }
            }
        }
    }

    reset(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            const curveModel = new CurveModel();
            if(curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
            {
                this.listener.curveModel = curveModel;
            }
        } else if(message instanceof ClosedCurveModel) {
            const curveModel = new ClosedCurveModel();
            if(curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
            {
                this.listener.curveModel = curveModel;
            }
        }
    }
}

export class CurveModelObserverInCurveModelEventListener extends CurveModelObserver {

    private listener: CurveModelDefinitionEventListener;

    constructor(listener: CurveModelDefinitionEventListener) {
        super();
        this.listener = listener;
    }

    update(message: CurveModelInterface): void {
        this.listener.curveModel = message;
        const curveCategory = this.listener.shapeNavigableCurve.curveCategory;
        if(message instanceof CurveModel) {
            curveCategory.curveModel = message;
            const curveShapeSpaceNavigator = this.listener.curveShapeSpaceNavigator;
            if(curveShapeSpaceNavigator !== undefined) {
                curveShapeSpaceNavigator.navigationCurveModel.curveModel = message;
                const shapeSpaceConfigurationChange = curveShapeSpaceNavigator.curveControlState.curveControlParamChange;
                const navigationStateChange = curveShapeSpaceNavigator.navigationState.navigationStateChange;
                const curveModelChange = this.listener.shapeNavigableCurve.curveCategory.curveModelChange;
                if(curveModelChange) {
                    const degree = message.spline.degree;
                    this.listener.updateCurveDegreeSelector(degree);
                    this.listener.shapeNavigableCurve.clampedPoints = [];

                    this.listener.shapeNavigableCurve.clampedPointsPreviousState = [];
                    if(curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring
                        || curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring) {
                        this.listener.resetConstraintControl();
                        this.listener.disableCurveClamping();
                        if(curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring)
                            curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                        if(curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring)
                            curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                        curveShapeSpaceNavigator.eventStateAtCrvExtremities = curveShapeSpaceNavigator.eventMgmtAtExtremities.eventStateAtCrvExtremities;
                    } else {
                        this.listener.enableCurveClamping();
                        this.listener.restorePreviousConstraintControl();
                        curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                        curveShapeSpaceNavigator.eventStateAtCrvExtremities = curveShapeSpaceNavigator.eventMgmtAtExtremities.eventStateAtCrvExtremities;
                    }
                }
                if(navigationStateChange) {
                    const degree = message.spline.degree;
                    this.listener.updateCurveDegreeSelector(degree);
                    // this.listener.shapeNavigableCurve.clampedPoints = [];
                    if(curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
                        || curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
                        this.listener.resetConstraintControl();
                        this.listener.disableCurveClamping();
                        if(curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring)
                            curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                        if(curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring)
                            curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                            curveShapeSpaceNavigator.eventStateAtCrvExtremities = curveShapeSpaceNavigator.eventMgmtAtExtremities.eventStateAtCrvExtremities;
                    } else {
                        this.listener.enableCurveClamping();
                        this.listener.restorePreviousConstraintControl();
                        curveShapeSpaceNavigator.eventStateAtCrvExtremities = curveShapeSpaceNavigator.eventMgmtAtExtremities.eventStateAtCrvExtremities;
                        // this.listener.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintClampedFirstControlPoint(this.listener.shapeNavigableCurve.curveConstraints));
                    }
                }
                if(shapeSpaceConfigurationChange) {
                    curveCategory.curveModelDifferentialEventsLocations = curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
                }
            }
        } else if(message instanceof ClosedCurveModel) {
            this.listener.shapeNavigableCurve.curveCategory.curveModel = message;
            const curveShapeSpaceNavigator = this.listener.curveShapeSpaceNavigator;
            if(curveShapeSpaceNavigator !== undefined) {
                curveShapeSpaceNavigator.navigationCurveModel.curveModel = message;
                const shapeSpaceConfigurationChange = curveShapeSpaceNavigator.curveControlState.curveControlParamChange;
                const navigationStateChange = curveShapeSpaceNavigator.navigationState.navigationStateChange;
                const curveModelChange = this.listener.shapeNavigableCurve.curveCategory.curveModelChange;
                if(curveModelChange) {
                    const degree = message.spline.degree;
                    this.listener.updateCurveDegreeSelector(degree);
                    this.listener.shapeNavigableCurve.clampedPoints = [];

                    this.listener.shapeNavigableCurve.clampedPointsPreviousState = [];
                    if(curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring
                        || curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring) {
                        curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                        this.listener.resetConstraintControl();
                        this.listener.disableCurveClamping();
                    } else {
                        this.listener.enableCurveClamping();
                        this.listener.restorePreviousConstraintControl();
                        curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                        curveShapeSpaceNavigator.eventStateAtCrvExtremities = curveShapeSpaceNavigator.eventMgmtAtExtremities.eventStateAtCrvExtremities;
                    }
                }
                if(navigationStateChange) {
                    const degree = message.spline.degree;
                    this.listener.updateCurveDegreeSelector(degree);
                    this.listener.shapeNavigableCurve.clampedPoints = [];
                    if(curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
                        || curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
                        if(curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring)
                        curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                        this.listener.resetConstraintControl();
                        this.listener.disableCurveClamping();
                    } else {
                        this.listener.enableCurveClamping();
                        this.listener.restorePreviousConstraintControl();
                        curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                        curveShapeSpaceNavigator.eventStateAtCrvExtremities = curveShapeSpaceNavigator.eventMgmtAtExtremities.eventStateAtCrvExtremities;
                        // this.listener.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintClampedFirstControlPoint(this.listener.shapeNavigableCurve.curveConstraints));
                    }
                }
                if(shapeSpaceConfigurationChange) {
                    curveCategory.curveModelDifferentialEventsLocations = curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
                }
            }
        }
    }

    reset(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            const curveModel = new CurveModel();
            this.listener.curveModel = curveModel;
            this.listener.shapeNavigableCurve.curveCategory.curveModel = curveModel;
        } else if(message instanceof ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in CurveModelEventListener")
        }
    }

}

export class CurveModelObserverInShapeSpaceNavigationEventListener extends CurveModelObserver {

    private listener: ShapeSpaceNavigationEventListener;
    private navigationState: NavigationState;

    constructor(listener: ShapeSpaceNavigationEventListener) {
        super();
        this.listener = listener;
        this.navigationState = this.listener.curveShapeSpaceNavigator.navigationState;
    }

    update(message: CurveModelInterface): void {
        const curveShapeSpaceNavigator = this.listener.curveShapeSpaceNavigator;
        const curveModelChange = curveShapeSpaceNavigator.shapeNavigableCurve.curveCategory.curveModelChange;
        const navigationStateChange = curveShapeSpaceNavigator.navigationState.navigationStateChange;
        const shapeSpaceConfigurationChange = curveShapeSpaceNavigator.curveControlState.curveControlParamChange;
        this.listener.curveShapeSpaceNavigator.navigationCurveModel.curveModel = message;
        if(curveModelChange) {
            const currentNavigationState = curveShapeSpaceNavigator.navigationState;
            if(message instanceof CurveModel) {
                curveShapeSpaceNavigator.navigationCurveModel = new OpenCurveShapeSpaceNavigator(curveShapeSpaceNavigator);
                if(curveShapeSpaceNavigator.navigationCurveModel instanceof OpenCurveShapeSpaceNavigator) {
                    if(currentNavigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
                        curveShapeSpaceNavigator.navigationCurveModel.changeNavigationState(new OCurveNavigationWithoutShapeSpaceMonitoring(curveShapeSpaceNavigator.navigationCurveModel));
                        this.listener.resetCurveShapeControlButtons();
                        this.listener.disableControlOfCurvatureExtrema();
                        this.listener.disableControlOfInflections();
                        this.listener.disableControlOfSliding();
                        this.listener.disableEventMgmtAtCurveExt();
                    } else {
                        if(currentNavigationState instanceof CCurveNavigationThroughSimplerShapeSpaces) {
                            curveShapeSpaceNavigator.navigationCurveModel.changeNavigationState(new OCurveNavigationThroughSimplerShapeSpaces(curveShapeSpaceNavigator.navigationCurveModel));
                        } else if(currentNavigationState instanceof CCurveNavigationStrictlyInsideShapeSpace) {
                            curveShapeSpaceNavigator.navigationCurveModel.changeNavigationState(new OCurveNavigationStrictlyInsideShapeSpace(curveShapeSpaceNavigator.navigationCurveModel));
                        }
                        this.listener.enableControlOfCurvatureExtrema();
                        this.listener.enableControlOfInflections();
                        this.listener.enableControlOfSliding();
                        this.listener.updateCurveShapeControlButtons();
                        this.listener.restorePreviousCurveShapeControlButtons();
                        this.listener.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this.listener.curveShapeSpaceNavigator.curveControlState;
                    }
                    curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                    curveShapeSpaceNavigator.navigationState = curveShapeSpaceNavigator.navigationCurveModel.navigationState;
                }

            } else if(message instanceof ClosedCurveModel) {
                curveShapeSpaceNavigator.navigationCurveModel = new ClosedCurveShapeSpaceNavigator(this.listener.curveShapeSpaceNavigator);
                if(curveShapeSpaceNavigator.navigationCurveModel instanceof ClosedCurveShapeSpaceNavigator) {
                    if(currentNavigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring) {
                        curveShapeSpaceNavigator.navigationCurveModel.changeNavigationState(new CCurveNavigationWithoutShapeSpaceMonitoring(curveShapeSpaceNavigator.navigationCurveModel));
                        this.listener.resetCurveShapeControlButtons();
                        this.listener.disableControlOfCurvatureExtrema();
                        this.listener.disableControlOfInflections();
                        this.listener.disableControlOfSliding();
                        this.listener.disableEventMgmtAtCurveExt();
                    } else {
                        if(currentNavigationState instanceof OCurveNavigationThroughSimplerShapeSpaces) {
                            curveShapeSpaceNavigator.navigationCurveModel.changeNavigationState(new CCurveNavigationThroughSimplerShapeSpaces(curveShapeSpaceNavigator.navigationCurveModel));
                        } else if(currentNavigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
                            curveShapeSpaceNavigator.navigationCurveModel.changeNavigationState(new CCurveNavigationStrictlyInsideShapeSpace(curveShapeSpaceNavigator.navigationCurveModel));
                        }
                        this.listener.enableControlOfCurvatureExtrema();
                        this.listener.enableControlOfInflections();
                        this.listener.enableControlOfSliding();
                        this.listener.updateCurveShapeControlButtons();
                        this.listener.restorePreviousCurveShapeControlButtons();
                        this.listener.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this.listener.curveShapeSpaceNavigator.curveControlState;
                    }
                    curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                    curveShapeSpaceNavigator.navigationState = curveShapeSpaceNavigator.navigationCurveModel.navigationState;
                }
            }
            this.listener.reinitializePreviousShapeControlButtons();
        } else if(!curveModelChange && navigationStateChange) {
            this.updateNavigationState();
            // this.updateCurveModelMaintainNavigationState();
            if(this.listener.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
                || this.listener.curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
                this.listener.storeCurrentCurveShapeControlButtons();
                this.listener.resetCurveShapeControlButtons();
                this.listener.disableControlOfCurvatureExtrema();
                this.listener.disableControlOfInflections();
                this.listener.disableControlOfSliding();
                this.listener.disableEventMgmtAtCurveExt();
                if(this.listener.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring)
                    curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                if(this.listener.curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring)
                    curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
            } else {
                // curveShapeSpaceNavigator.navigationCurveModel.currentCurve = curveShapeSpaceNavigator.shapeNavigableCurve.curveCategory.curveModel.spline;
                // curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = curveShapeSpaceNavigator.navigationCurveModel.currentCurve;
                this.listener.enableControlOfCurvatureExtrema();
                this.listener.enableControlOfInflections();
                this.listener.enableControlOfSliding();
                this.listener.updateCurveShapeControlButtons();
                this.listener.restorePreviousCurveShapeControlButtons();
                this.listener.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this.listener.curveShapeSpaceNavigator.curveControlState;
                if(this.listener.sliding) {
                    curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(curveShapeSpaceNavigator.eventMgmtAtExtremities));
                }
            }
        } else if(shapeSpaceConfigurationChange) {
            // nothing to do there at the moment
        }
    }

    updateNavigationState(): void {
        this.navigationState = this.listener.curveShapeSpaceNavigator.navigationState;
    }

    updateCurveModelMaintainNavigationState() {
        if(this.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
            || this.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            this.listener.curveShapeSpaceNavigator.navigationState.setNavigationWithoutShapeSpaceMonitoring();
        }
        else if(this.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
            || this.navigationState instanceof CCurveNavigationThroughSimplerShapeSpaces) {
            this.listener.curveShapeSpaceNavigator.navigationState.setNavigationThroughSimplerShapeSpaces();
        }
        else if(this.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace
            || this.navigationState instanceof CCurveNavigationStrictlyInsideShapeSpace) {
            this.listener.curveShapeSpaceNavigator.navigationState.setNavigationStrictlyInsideShapeSpace();
        }
    }

    reset(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            const curveModel = new CurveModel();
            if(curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
            {
                this.listener.curveShapeSpaceNavigator.navigationCurveModel.curveModel = this.listener.curveShapeSpaceNavigator.shapeNavigableCurve.curveCategory.curveModel;
            }
        } else if(message instanceof ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in ShapeSpaceNavigationEventListener")
        }
    }
}

export class CurveModelObserverInFileEventListener extends CurveModelObserver {

    private listener: FileEventListener;

    constructor(listener: FileEventListener) {
        super();
        this.listener = listener;
    }

    update(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            this.listener.curveModel = this.listener.shapeNavigableCurve.curveCategory.curveModel;
            console.log("something to do there with CurveModel in FileEventListener")
        } else if(message instanceof ClosedCurveModel) {
            this.listener.curveModel = this.listener.shapeNavigableCurve.curveCategory.curveModel;
            console.log("something to do there with ClosedCurveModel in FileEventListener")
        }
    }

    reset(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            console.log("something to do there with CurveModel in FileEventListener")
        } else if(message instanceof ClosedCurveModel) {
            console.log("something to do there with ClosedCurveModel in FileEventListener")
        }
    }
}

export class CurveModelObserverInCurveSceneController extends CurveModelObserver {

    private listener: CurveSceneController;

    constructor(listener: CurveSceneController) {
        super();
        this.listener = listener;
    }

    update(message: CurveModelInterface): void {
        this.listener.curveModel = message;
        this.listener.curveModelDifferentialEventsExtractor = this.listener.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents;
        this.listener.curveDiffEventsLocations = this.listener.curveModelDifferentialEventsExtractor.crvDiffEventsLocations;
        if(!this.listener.shapeNavigableCurve.curveCategory.curveModelChange) 
            this.listener.removeCurveObservers();
        this.listener.initCurveSceneView();
        const navigationState = this.listener.curveShapeSpaceNavigator.navigationState;
        this.listener.navigationState = navigationState;
        if(!this.listener.shapeNavigableCurve.curveCategory.curveModelChange) {
            if(navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring ||
                navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
                if(this.listener.shapeNavigableCurve.controlOfCurveClamping) {
                    const error = new ErrorLog(this.constructor.name, "update", " incorrect status of control of curve clamping.");
                    error.logMessageToConsole();
                }
                this.listener.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2NoConstraintState(this.listener));
                this.listener.changeSceneInteraction(new CurveSceneControllerNoShapeSpaceConstraintsCPSelection(this.listener));
                this.listener.clampedControlPointView.clearSelectedPoints();
            } else {
                if(navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces ||
                    navigationState instanceof CCurveNavigationThroughSimplerShapeSpaces) {
                    this.listener.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this.listener));
                } else if(navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace ||
                    navigationState instanceof CCurveNavigationStrictlyInsideShapeSpace) {
                    this.listener.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(this.listener));
                }
                if(!this.listener.shapeNavigableCurve.controlOfCurveClamping) {
                    this.listener.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2NoConstraintState(this.listener));
                    this.listener.clampedControlPointView.clearSelectedPoints();
                } else {
                    if(this.listener.shapeNavigableCurve.clampedPoints[0] !== NO_CONSTRAINT) {
                        this.listener.curveConstraintTransitionTo(new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this.listener));
                    }
                    if(this.listener.shapeNavigableCurve.clampedPoints[1] !== NO_CONSTRAINT) {
                        if(this.listener.curveConstraintSelectionState instanceof HandleConstraintAtPoint1Point2NoConstraintState) {
                            this.listener.curveConstraintTransitionTo(new HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(this.listener));
                        } else if(this.listener.curveConstraintSelectionState instanceof HandleConstraintAtPoint1ConstraintPoint2NoConstraintState){
                            this.listener.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2ConstraintState(this.listener));
                        }
                    }
                }
            }
            this.listener.curveModel.notifyObservers();
        } else {
            if(message instanceof CurveModel) {
                this.listener.curveModel = this.listener.shapeNavigableCurve.curveCategory.curveModel;
                // this.listener.initCurveSceneView();
            } else if(message instanceof ClosedCurveModel) {
                this.listener.curveModel = this.listener.shapeNavigableCurve.curveCategory.curveModel;
                this.listener.removeCurveObservers();
                this.listener.initCurveSceneView();
                const navigationState = this.listener.curveShapeSpaceNavigator.navigationState;
                this.listener.navigationState = navigationState;
            }
        }

        this.listener.renderFrame();
    }

    reset(message: CurveModelInterface): void {
        
    }
}