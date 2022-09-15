import { IObserver } from "../newDesignPatterns/Observer";
import { ChartEventListener, CurveModelDefinitionEventListener, FileEventListener, ShapeSpaceNavigationEventListener } from "../userInterfaceController/UserInterfaceEventListener";
import { CurveModel } from "../newModels/CurveModel";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveSceneController } from "../controllers/CurveSceneController";
import { CCurveNavigationStrictlyInsideShapeSpace, CCurveNavigationThroughSimplerShapeSpaces, CCurveNavigationWithoutShapeSpaceMonitoring, NavigationState, OCurveNavigationStrictlyInsideShapeSpace, OCurveNavigationThroughSimplerShapeSpaces, OCurveNavigationWithoutShapeSpaceMonitoring } from "../curveShapeSpaceNavigation/NavigationState";
import { NO_CONSTRAINT } from "../shapeNavigableCurve/ShapeNavigableCurve";

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
        // Nothing to do there if curve clamping state changes
        if(message instanceof CurveModel) {
            if(this.listener.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
            {
                this.listener.curveModel = message;
                this.listener.shapeNavigableCurve.curveCategory.curveShapeSpaceNavigator.curveModel = message;
                // this.listener.shapeNavigableCurve.curveCategory.curveShapeSpaceNavigator.currentCurve = message.spline;
                // if(this.listener.shapeNavigableCurve.controlOfCurveClamping)
                // {
                //     this.listener.shapeNavigableCurve.clampedPoints[0] = 0;
                //     this.listener.shapeNavigableCurve.clampedPoints[1] = NO_CONSTRAINT;
                // } 
                // else {
                //     this.listener.shapeNavigableCurve.clampedPoints[0] = NO_CONSTRAINT;
                //     this.listener.shapeNavigableCurve.clampedPoints[1] = NO_CONSTRAINT;
                // }
                const degree = message.spline.degree;
                this.listener.updateCurveDegreeSelector(degree);
                this.listener.resetCurveConstraintControlButton();
            }
        } else if(message instanceof ClosedCurveModel) {
            this.listener.curveModel = message;
            this.listener.shapeNavigableCurve.curveCategory.curveShapeSpaceNavigator.curveModel = message;
            // this.listener.shapeNavigableCurve.curveCategory.curveShapeSpaceNavigator.currentCurve = message.spline;
            this.listener.shapeNavigableCurve.clampedPoints[0] = 0;
            const degree = message.spline.degree;
            this.listener.updateCurveDegreeSelector(degree);
            this.listener.resetCurveConstraintControlButton();
            console.log("something to do there with ClosedCurveModel in CurveModelEventListener")
        }
    }

    reset(message: CurveModelInterface): void {
        if(message instanceof CurveModel) {
            const curveModel = new CurveModel();
            if(curveModel.hasOwnProperty('curveModel') || this.listener.hasOwnProperty('_curveModel'))
            {
                this.listener.curveModel = curveModel;
                this.listener.shapeNavigableCurve.curveCategory.curveShapeSpaceNavigator.curveModel = curveModel;
            }
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
        if(curveShapeSpaceNavigator.hasOwnProperty('curveModel') || curveShapeSpaceNavigator.hasOwnProperty('_curveModel'))
        {
            this.listener.curveShapeSpaceNavigator.curveModel = message;
            // this.listener.curveShapeSpaceNavigator.currentCurve = message.spline;
            this.updateNavigationState();
            this.updateCurveModelMaintainNavigationState();
            this.listener.resetCurveShapeControlButtons();
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
                this.listener.curveShapeSpaceNavigator.curveModel = curveModel;
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
            const curveModel = new CurveModel();
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
        if(!this.listener.shapeNavigableCurve.controlOfCurveClamping)
        {
            console.log("update clampedControlPointView when removing clamping control")
            // Update the curveSceneController as if point1 and/or point2 had been selected to update the
            // curve constraint selection state as well as the curveConstraintStrategy of the shapeNavigableCurve
            // and the clampedPoints of the shapeNavigableCurve
            if(this.listener.shapeNavigableCurve.clampedPoints[0] !== NO_CONSTRAINT) {
                this.listener.curveConstraintSelectionState.handleCurveConstraintAtPoint1(this.listener.shapeNavigableCurve.clampedPoints[0]);
                this.listener.shapeNavigableCurve.clampedPoints[0] = NO_CONSTRAINT;
            }
            if(this.listener.shapeNavigableCurve.clampedPoints[1] !== NO_CONSTRAINT) {
                this.listener.curveConstraintSelectionState.handleCurveConstraintAtPoint2(this.listener.shapeNavigableCurve.clampedPoints[1]);
                this.listener.shapeNavigableCurve.clampedPoints[1] = NO_CONSTRAINT;
            }
            this.listener.controlOfCurveClamping = this.listener.shapeNavigableCurve.controlOfCurveClamping;
            this.listener.renderFrame();
        } else if(this.listener.shapeNavigableCurve.controlOfCurveClamping) {
            console.log("update clampedControlPointView when setting clamping control")
            if(this.listener.shapeNavigableCurve.clampedPointsPreviousState[0] !== NO_CONSTRAINT) {
                this.listener.curveConstraintSelectionState.handleCurveConstraintAtPoint1(this.listener.shapeNavigableCurve.clampedPointsPreviousState[0]);
            }
            if(this.listener.shapeNavigableCurve.clampedPointsPreviousState[1] !== NO_CONSTRAINT) {
                this.listener.curveConstraintSelectionState.handleCurveConstraintAtPoint2(this.listener.shapeNavigableCurve.clampedPointsPreviousState[1]);
            }
            this.listener.controlOfCurveClamping = this.listener.shapeNavigableCurve.controlOfCurveClamping;
            this.listener.renderFrame();
        } else if(message instanceof CurveModel) {
            this.listener.curveModel = this.listener.shapeNavigableCurve.curveCategory.curveModel;
            this.listener.initCurveSceneView();
            this.listener.renderFrame();
        } else if(message instanceof ClosedCurveModel) {
            this.listener.curveModel = this.listener.shapeNavigableCurve.curveCategory.curveModel;
            this.listener.initCurveSceneView();
            this.listener.renderFrame();
        }
    }

    reset(message: CurveModelInterface): void {
        
    }
}