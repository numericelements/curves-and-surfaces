import { CurveConstraints } from "../curveShapeSpaceNavigation/CurveConstraints";

export interface CurveConstraintProcessor {
    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void;
}