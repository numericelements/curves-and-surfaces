import { ConstraintType, CurveConstraints } from "../curveShapeSpaceNavigation/CurveConstraints";

export interface CurveConstraintProcessor {

    firstControlPoint: ConstraintType;
    lastControlPoint: ConstraintType;

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void;

}