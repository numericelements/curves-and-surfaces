import { ConstraintType, CurveConstraints } from "../curveShapeSpaceNavigation/CurveConstraints";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";

export interface CurveConstraintInterface {

    firstControlPoint: ConstraintType;
    lastControlPoint: ConstraintType;
    curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined;
    constraintsNotSatisfied: boolean;

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void;

}