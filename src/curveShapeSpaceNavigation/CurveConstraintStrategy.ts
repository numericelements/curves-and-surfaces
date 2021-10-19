import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveConstraints } from "./CurveConstraints";


export class CurveConstraintNoConstraint implements CurveConstraintProcessor {


    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{

    }
}

export class CurveConstraintClampedFirstControlPoint implements CurveConstraintProcessor {


    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{

    }

}

export class CurveConstraintClampedLastControlPoint implements CurveConstraintProcessor {


    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{

    }

}

export class CurveConstraintClampedFirstAndLastControlPoint implements CurveConstraintProcessor {

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{

    }

}