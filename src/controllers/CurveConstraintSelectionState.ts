import { CurveModeler } from "../curveModeler/CurveModeler";
import { CurveConstraints } from "../curveShapeSpaceNavigation/CurveConstraints";
import { CurveConstraintClampedFirstAndLastControlPoint, CurveConstraintClampedFirstControlPoint, CurveConstraintClampedLastControlPoint, CurveConstraintNoConstraint } from "../curveShapeSpaceNavigation/CurveConstraintStrategy";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveSceneController } from "./CurveSceneController";

export abstract class CurveConstraintSelectionState {

    protected curveSceneController: CurveSceneController;
    protected curveModeler: CurveModeler;
    protected curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    protected curveConstraints: CurveConstraints;

    constructor(context: CurveSceneController) {
        this.curveSceneController = context;
        this.curveModeler = this.curveSceneController.curveModeler;
        this.curveShapeSpaceNavigator = this.curveSceneController.curveShapeSpaceNavigator;
        this.curveConstraints = this.curveShapeSpaceNavigator.curveConstraints;
    }

    setContext(context: CurveSceneController) {
        this.curveSceneController = context;
    }

    abstract handleCurveConstraintAtPoint1(): void;

    abstract handleCurveConstraintAtPoint2(): void;
}

export class HandleConstraintAtPoint1Point2NoConstraintState extends CurveConstraintSelectionState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveConstraints.setConstraint(new CurveConstraintNoConstraint(this.curveShapeSpaceNavigator));
    }

    handleCurveConstraintAtPoint1(): void {
        let warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1ConstraintPoint2NoConstraintState');
        warning.logMessageToConsole();
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this.curveSceneController))
    }

    handleCurveConstraintAtPoint2(): void {
        let warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1NoConstraintPoint2ConstraintState');
        warning.logMessageToConsole();
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(this.curveSceneController))
    }

}

export class HandleConstraintAtPoint1ConstraintPoint2NoConstraintState extends CurveConstraintSelectionState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveConstraints.setConstraint(new CurveConstraintClampedFirstControlPoint(this.curveShapeSpaceNavigator));
    }

    handleCurveConstraintAtPoint1(): void {
        let warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1Point2NoConstraintState');
        warning.logMessageToConsole();
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2NoConstraintState(this.curveSceneController))
    }

    handleCurveConstraintAtPoint2(): void {
        let warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1Point2ConstraintState');
        warning.logMessageToConsole();
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2ConstraintState(this.curveSceneController))
    }

}

export class HandleConstraintAtPoint1NoConstraintPoint2ConstraintState extends CurveConstraintSelectionState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveConstraints.setConstraint(new CurveConstraintClampedLastControlPoint(this.curveShapeSpaceNavigator));
    }

    handleCurveConstraintAtPoint1(): void {
        let warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1Point2ConstraintState');
        warning.logMessageToConsole();
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2ConstraintState(this.curveSceneController))
    }

    handleCurveConstraintAtPoint2(): void {
        let warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1Point2NoConstraintState');
        warning.logMessageToConsole();
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2NoConstraintState(this.curveSceneController))
    }

}

export class HandleConstraintAtPoint1Point2ConstraintState extends CurveConstraintSelectionState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveConstraints.setConstraint(new CurveConstraintClampedFirstAndLastControlPoint(this.curveShapeSpaceNavigator));
    }

    handleCurveConstraintAtPoint1(): void {
        let warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint1', ' call to HandleConstraintAtPoint1NoConstraintPoint2ConstraintState');
        warning.logMessageToConsole();
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(this.curveSceneController))
    }

    handleCurveConstraintAtPoint2(): void {
        let warning = new WarningLog(this.constructor.name, 'handleCurveConstraintAtPoint2', ' call to HandleConstraintAtPoint1ConstraintPoint2NoConstraintState');
        warning.logMessageToConsole();
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this.curveSceneController))
    }

}