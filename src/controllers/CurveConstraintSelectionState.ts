import { NO_CONSTRAINT, ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { CurveConstraints } from "../curveShapeSpaceNavigation/CurveConstraints";
import { CurveConstraintClampedFirstAndLastControlPoint, CurveConstraintClampedFirstControlPoint, CurveConstraintClampedLastControlPoint, CurveConstraintNoConstraint } from "../curveShapeSpaceNavigation/CurveConstraintStrategy";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveSceneController } from "./CurveSceneController";

export abstract class CurveConstraintSelectionState {

    protected curveSceneController: CurveSceneController;
    protected shapeNavigableCurve: ShapeNavigableCurve;
    protected curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    protected curveConstraints: CurveConstraints;

    constructor(context: CurveSceneController) {
        this.curveSceneController = context;
        this.shapeNavigableCurve = this.curveSceneController.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = this.curveSceneController.curveShapeSpaceNavigator;
        this.curveConstraints = this.shapeNavigableCurve.curveConstraints;
    }

    setContext(context: CurveSceneController) {
        this.curveSceneController = context;
    }

    abstract handleCurveConstraintAtPoint1(selectedPoint: number): void;

    abstract handleCurveConstraintAtPoint2(selectedPoint: number): void;
}

export class HandleConstraintAtPoint1Point2NoConstraintState extends CurveConstraintSelectionState {

    constructor(context: CurveSceneController) {
        super(context)
        const crvConstraintAtExtremitiesStgy = new CurveConstraintNoConstraint(this.shapeNavigableCurve.curveConstraints);
        this.curveConstraints.setConstraint(crvConstraintAtExtremitiesStgy);
        this.shapeNavigableCurve.changeCurveConstraintStrategy(crvConstraintAtExtremitiesStgy);
    }

    handleCurveConstraintAtPoint1(selectedPoint: number): void {
        const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1ConstraintPoint2NoConstraintState');
        warning.logMessageToConsole();
        if(this.shapeNavigableCurve.clampedPoints[0] !== NO_CONSTRAINT && this.shapeNavigableCurve.clampedPoints[1] !== NO_CONSTRAINT)
        {
            const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' inconsistent configuration of clamped points !');
            warning.logMessageToConsole();
        } else {
            this.shapeNavigableCurve.clampedPoints[0] = selectedPoint;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this.curveSceneController))
    }

    handleCurveConstraintAtPoint2(selectedPoint: number): void {
        const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1NoConstraintPoint2ConstraintState');
        warning.logMessageToConsole();
        if(this.shapeNavigableCurve.clampedPoints[0] !== NO_CONSTRAINT && this.shapeNavigableCurve.clampedPoints[1] !== NO_CONSTRAINT)
        {
            const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' inconsistent configuration of clamped points !');
            warning.logMessageToConsole();
        } else {
            this.shapeNavigableCurve.clampedPoints[1] = selectedPoint;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(this.curveSceneController))
    }

}

export class HandleConstraintAtPoint1ConstraintPoint2NoConstraintState extends CurveConstraintSelectionState {

    constructor(context: CurveSceneController) {
        super(context)
        const crvConstraintAtExtremitiesStgy = new CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints);
        this.curveConstraints.setConstraint(crvConstraintAtExtremitiesStgy);
        this.shapeNavigableCurve.changeCurveConstraintStrategy(crvConstraintAtExtremitiesStgy);
    }

    handleCurveConstraintAtPoint1(selectedPoint: number): void {
        const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1Point2NoConstraintState');
        warning.logMessageToConsole();
        if(this.shapeNavigableCurve.clampedPoints[0] === NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] !== NO_CONSTRAINT)
        {
            const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' inconsistent configuration of clamped points !');
            warning.logMessageToConsole();
        } else if(this.shapeNavigableCurve.clampedPoints[0] !== selectedPoint)
        {
            const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' clamped point selection is incorrect !');
            warning.logMessageToConsole();
        } else {
            this.shapeNavigableCurve.clampedPoints[0] = NO_CONSTRAINT;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2NoConstraintState(this.curveSceneController))
    }

    handleCurveConstraintAtPoint2(selectedPoint: number): void {
        const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1Point2ConstraintState');
        warning.logMessageToConsole();
        if(this.shapeNavigableCurve.clampedPoints[0] === NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] !== NO_CONSTRAINT)
        {
            const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' inconsistent configuration of clamped points !');
            warning.logMessageToConsole();
        } else {
            this.shapeNavigableCurve.clampedPoints[1] = selectedPoint;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2ConstraintState(this.curveSceneController))
    }

}

export class HandleConstraintAtPoint1NoConstraintPoint2ConstraintState extends CurveConstraintSelectionState {

    constructor(context: CurveSceneController) {
        super(context)
        const crvConstraintAtExtremitiesStgy = new CurveConstraintClampedLastControlPoint(this.shapeNavigableCurve.curveConstraints);
        this.curveConstraints.setConstraint(crvConstraintAtExtremitiesStgy);
        this.shapeNavigableCurve.changeCurveConstraintStrategy(crvConstraintAtExtremitiesStgy);
    }

    handleCurveConstraintAtPoint1(selectedPoint: number): void {
        const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1Point2ConstraintState');
        warning.logMessageToConsole();
        if(this.shapeNavigableCurve.clampedPoints[0] !== NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] === NO_CONSTRAINT)
        {
            const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' inconsistent configuration of clamped points !');
            warning.logMessageToConsole();
        } else {
            this.shapeNavigableCurve.clampedPoints[0] = selectedPoint;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2ConstraintState(this.curveSceneController))
    }

    handleCurveConstraintAtPoint2(selectedPoint: number): void {
        const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1Point2NoConstraintState');
        warning.logMessageToConsole();
        if(this.shapeNavigableCurve.clampedPoints[0] !== NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] === NO_CONSTRAINT)
        {
            const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' inconsistent configuration of clamped points !');
            warning.logMessageToConsole();
        } else if(this.shapeNavigableCurve.clampedPoints[0] !== selectedPoint)
        {
            const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' clamped point selection is incorrect !');
            warning.logMessageToConsole();
        } else {
            this.shapeNavigableCurve.clampedPoints[1] = NO_CONSTRAINT;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2NoConstraintState(this.curveSceneController))
    }

}

export class HandleConstraintAtPoint1Point2ConstraintState extends CurveConstraintSelectionState {

    constructor(context: CurveSceneController) {
        super(context)
        const crvConstraintAtExtremitiesStgy = new CurveConstraintClampedFirstAndLastControlPoint(this.shapeNavigableCurve.curveConstraints);
        this.curveConstraints.setConstraint(crvConstraintAtExtremitiesStgy);
        this.shapeNavigableCurve.changeCurveConstraintStrategy(crvConstraintAtExtremitiesStgy);
    }

    handleCurveConstraintAtPoint1(selectedPoint: number): void {
        const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1NoConstraintPoint2ConstraintState');
        warning.logMessageToConsole();
        const indexClampedPoint = this.shapeNavigableCurve.clampedPoints.findIndex(element => element == selectedPoint);
        if(this.shapeNavigableCurve.clampedPoints[0] === NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] === NO_CONSTRAINT)
        {
            const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' inconsistent configuration of clamped points !');
            warning.logMessageToConsole();
        } else if(indexClampedPoint === -1) {
            const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' clamped point selection is incorrect !');
            warning.logMessageToConsole();
        } else {
            this.shapeNavigableCurve.clampedPoints[0] = NO_CONSTRAINT;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(this.curveSceneController))
    }

    handleCurveConstraintAtPoint2(selectedPoint: number): void {
        const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1ConstraintPoint2NoConstraintState');
        warning.logMessageToConsole();
        const indexClampedPoint = this.shapeNavigableCurve.clampedPoints.findIndex(element => element == selectedPoint);
        if(this.shapeNavigableCurve.clampedPoints[0] === NO_CONSTRAINT || this.shapeNavigableCurve.clampedPoints[1] === NO_CONSTRAINT)
        {
            const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' inconsistent configuration of clamped points !');
            warning.logMessageToConsole();
        } else if(indexClampedPoint === -1) {
            const warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' clamped point selection is incorrect !');
            warning.logMessageToConsole();
        } else {
            this.shapeNavigableCurve.clampedPoints[1] = NO_CONSTRAINT;
            this.curveSceneController.clampedControlPointView.updateSelectedPoints(selectedPoint);
        }
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this.curveSceneController))
    }

}