import { WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveShapeSpaceNavigator } from "./CurveShapeSpaceNavigator";

export abstract class CurveConstraintState {

    protected curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(curveNavigator: CurveShapeSpaceNavigator) {
        this.curveShapeSpaceNavigator = curveNavigator;
    }

    abstract clampFirstControlPoint(): void;

    abstract clampLastControlPoint(): void;

    abstract freeFirstControlPoint(): void;

    abstract freeLastControlPoint(): void;
}

export class CurveConstraintNoConstraint extends CurveConstraintState {

    clampFirstControlPoint(): void {
        this.curveShapeSpaceNavigator.changeCurveState(new CurveConstraintClampedFirstControlPoint(this.curveShapeSpaceNavigator));
    }

    clampLastControlPoint(): void {
        this.curveShapeSpaceNavigator.changeCurveState(new CurveConstraintClampedLastControlPoint(this.curveShapeSpaceNavigator));
    }

    freeFirstControlPoint(): void {
        let warning = new WarningLog(this.constructor.name, "freeFirstControlPoint", "no state change there.");
        warning.logMessageToConsole();
    }

    freeLastControlPoint(): void {
        let warning = new WarningLog(this.constructor.name, "freeLastControlPoint", "no state change there.");
        warning.logMessageToConsole();
    }
}

export class CurveConstraintClampedFirstControlPoint extends CurveConstraintState {

    clampFirstControlPoint(): void {
        let warning = new WarningLog(this.constructor.name, "clampFirstControlPoint", "no state change there.");
        warning.logMessageToConsole();
    }

    clampLastControlPoint(): void {
        this.curveShapeSpaceNavigator.changeCurveState(new CurveConstraintClampedFirstAndLastControlPoint(this.curveShapeSpaceNavigator));
    }

    freeFirstControlPoint(): void {
        this.curveShapeSpaceNavigator.changeCurveState(new CurveConstraintNoConstraint(this.curveShapeSpaceNavigator));
    }

    freeLastControlPoint(): void {
        let warning = new WarningLog(this.constructor.name, "freeLastControlPoint", "no state change there.");
        warning.logMessageToConsole();
    }
}

export class CurveConstraintClampedLastControlPoint extends CurveConstraintState {

    clampFirstControlPoint(): void {
        this.curveShapeSpaceNavigator.changeCurveState(new CurveConstraintClampedFirstAndLastControlPoint(this.curveShapeSpaceNavigator));
    }

    clampLastControlPoint(): void {
        let warning = new WarningLog(this.constructor.name, "clampLastControlPoint", "no state change there.");
        warning.logMessageToConsole();
    }

    freeFirstControlPoint(): void {
        let warning = new WarningLog(this.constructor.name, "freeFirstControlPoint", "no state change there.");
        warning.logMessageToConsole();
    }

    freeLastControlPoint(): void {
        this.curveShapeSpaceNavigator.changeCurveState(new CurveConstraintNoConstraint(this.curveShapeSpaceNavigator));
    }
}

export class CurveConstraintClampedFirstAndLastControlPoint extends CurveConstraintState {

    clampFirstControlPoint(): void {
        let warning = new WarningLog(this.constructor.name, "clampFirstControlPoint", "no state change there.");
        warning.logMessageToConsole();
    }

    clampLastControlPoint(): void {
        let warning = new WarningLog(this.constructor.name, "clampLastControlPoint", "no state change there.");
        warning.logMessageToConsole();
    }

    freeFirstControlPoint(): void {
        this.curveShapeSpaceNavigator.changeCurveState(new CurveConstraintClampedLastControlPoint(this.curveShapeSpaceNavigator));
    }

    freeLastControlPoint(): void {
        this.curveShapeSpaceNavigator.changeCurveState(new CurveConstraintClampedFirstControlPoint(this.curveShapeSpaceNavigator));
    }
}