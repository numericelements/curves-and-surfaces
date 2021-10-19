import { CurveModeler } from "../curveModeler/CurveModeler";
import { CurveConstraintClampedFirstAndLastControlPoint, CurveConstraintClampedFirstControlPoint, CurveConstraintClampedLastControlPoint, CurveConstraintNoConstraint } from "../curveShapeSpaceNavigation/CurveConstraintStrategy";
import { CurveSceneController } from "./CurveSceneController";

export abstract class CurveConstraintSelectionState {

    protected curveSceneController: CurveSceneController;
    protected curveModeler: CurveModeler;

    constructor(context: CurveSceneController) {
        this.curveSceneController = context;
        this.curveModeler = this.curveSceneController.curveModeler;
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
        this.curveSceneController.curveConstraints.setConstraint(new CurveConstraintNoConstraint);
    }

    handleCurveConstraintAtPoint1(): void {
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this.curveSceneController))
    }

    handleCurveConstraintAtPoint2(): void {
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(this.curveSceneController))
    }

}

export class HandleConstraintAtPoint1ConstraintPoint2NoConstraintState extends CurveConstraintSelectionState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.curveConstraints.setConstraint(new CurveConstraintClampedFirstControlPoint);
    }

    handleCurveConstraintAtPoint1(): void {
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2NoConstraintState(this.curveSceneController))
    }

    handleCurveConstraintAtPoint2(): void {
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2ConstraintState(this.curveSceneController))
    }

}

export class HandleConstraintAtPoint1NoConstraintPoint2ConstraintState extends CurveConstraintSelectionState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.curveConstraints.setConstraint(new CurveConstraintClampedLastControlPoint);
    }

    handleCurveConstraintAtPoint1(): void {
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2ConstraintState(this.curveSceneController))
    }

    handleCurveConstraintAtPoint2(): void {
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1Point2NoConstraintState(this.curveSceneController))
    }

}

export class HandleConstraintAtPoint1Point2ConstraintState extends CurveConstraintSelectionState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.curveConstraints.setConstraint(new CurveConstraintClampedFirstAndLastControlPoint);
    }

    handleCurveConstraintAtPoint1(): void {
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1NoConstraintPoint2ConstraintState(this.curveSceneController))
    }

    handleCurveConstraintAtPoint2(): void {
        this.curveSceneController.curveConstraintTransitionTo(new HandleConstraintAtPoint1ConstraintPoint2NoConstraintState(this.curveSceneController))
    }

}