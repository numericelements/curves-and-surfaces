import { ConstraintType, CurveConstraints } from "../curveShapeSpaceNavigation/CurveConstraints";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";

export interface CurveConstraintInterface {

    firstControlPoint: ConstraintType;
    lastControlPoint: ConstraintType;
    currentCurve: BSplineR1toR2Interface;
    optimizedCurve: BSplineR1toR2Interface;
    curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined;
    constraintsNotSatisfied: boolean;

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void;

}