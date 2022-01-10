import { BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveConstraintClampedFirstControlPoint } from "./CurveConstraintStrategy";
import { CurveShapeSpaceNavigator } from "./CurveShapeSpaceNavigator";

export enum ConstraintType {none, location, tangent, locationAndTangent}

export enum CurveExtremity {first, last}

export class CurveConstraints {

    private _firstControlPoint: ConstraintType;
    private _lastControlPoint: ConstraintType;
    private _curveConstraintProcessor: CurveConstraintProcessor;
    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private _optimizedCurve: BSpline_R1_to_R2;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator, curveConstraintProcessor?: CurveConstraintProcessor) {
        let warning = new WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessageToConsole();
        if(!curveConstraintProcessor) {
            this._curveConstraintProcessor = new CurveConstraintClampedFirstControlPoint(curveShapeSpaceNavigator, this);
        } else {
            this._curveConstraintProcessor = curveConstraintProcessor;
        }
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._firstControlPoint = this._curveConstraintProcessor.firstControlPoint;
        this._lastControlPoint = this._curveConstraintProcessor.lastControlPoint;
        this._optimizedCurve = this._curveShapeSpaceNavigator.optimizedCurve;
    }

    set firstControlPoint(constraintAtFirstPoint: ConstraintType) {
        this._firstControlPoint = constraintAtFirstPoint;
    }

    set lastControlPoint(constraintAtLastPoint: ConstraintType) {
        this._lastControlPoint = constraintAtLastPoint;
    }

    set optimizedCurve(curve: BSpline_R1_to_R2) {
        this._optimizedCurve = curve;
    }

    get firstControlPoint(): ConstraintType {
        return this._firstControlPoint;
    }

    get lastControlPoint(): ConstraintType {
        return this._lastControlPoint;
    }

    get curveConstraintProcessor(): CurveConstraintProcessor {
        return this._curveConstraintProcessor;
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator {
        return this._curveShapeSpaceNavigator;
    }

    get optimizedCurve(): BSpline_R1_to_R2 {
        return this._optimizedCurve;
    }

    setConstraint(curveConstraintProcessor: CurveConstraintProcessor): void {
        this._curveConstraintProcessor = curveConstraintProcessor;
        this._firstControlPoint = this._curveConstraintProcessor.firstControlPoint;
        this._lastControlPoint = this._curveConstraintProcessor.lastControlPoint;
    }

    processConstraint(): void {
        this._curveConstraintProcessor.locateCurveExtremityUnderConstraint(this);
        this._curveShapeSpaceNavigator.optimizedCurve = this._optimizedCurve;
    }

    updateCurve(): void {
        this._optimizedCurve = this._curveShapeSpaceNavigator.optimizedCurve;
    }

    // clearConstraint(extremity: CurveExtremity): void {
    //     if(extremity === CurveExtremity.first) {
    //         this._firstControlPoint = ConstraintType.none;
    //     }
    //     if(extremity === CurveExtremity.last) {
    //         this._lastControlPoint = ConstraintType.none;
    //     }
    // }

    // clearAll(): void {
    //     this._firstControlPoint = ConstraintType.none;
    //     this._lastControlPoint = ConstraintType.none;
    // }

}