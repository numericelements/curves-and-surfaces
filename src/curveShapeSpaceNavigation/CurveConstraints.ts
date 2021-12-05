import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { CurveShapeSpaceNavigator } from "./CurveShapeSpaceNavigator";

export enum ConstraintType {none, location, tangent, locationAndTangent}

export enum CurveExtremity {first, last}

export class CurveConstraints {

    private _firstControlPoint: ConstraintType;
    private _lastControlPoint: ConstraintType;
    private curveConstraintProcessor: CurveConstraintProcessor;
    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(curveConstraintProcessor: CurveConstraintProcessor, curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        this.curveConstraintProcessor = curveConstraintProcessor;
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._firstControlPoint = ConstraintType.none;
        this._lastControlPoint = ConstraintType.none;

    }

    set constraintAtFirstPoint(constraintAtFirstPoint: ConstraintType) {
        this._firstControlPoint = constraintAtFirstPoint;
    }

    set constraintAtLastPoint(constraintAtLastPoint: ConstraintType) {
        this._lastControlPoint = constraintAtLastPoint;
    }

    get constraintAtFirstPoint(): ConstraintType {
        return this._firstControlPoint;
    }

    get constraintAtLastPoint(): ConstraintType {
        return this._lastControlPoint;
    }
    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator {
        return this._curveShapeSpaceNavigator;
    }

    setConstraint(curveConstraintProcessor: CurveConstraintProcessor): void {
        this.curveConstraintProcessor = curveConstraintProcessor;
    }

    processConstraint(): void {
        this.curveConstraintProcessor.locateCurveExtremityUnderConstraint(this);
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