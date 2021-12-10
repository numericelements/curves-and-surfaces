import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { CurveShapeSpaceNavigator } from "./CurveShapeSpaceNavigator";

export enum ConstraintType {none, location, tangent, locationAndTangent}

export enum CurveExtremity {first, last}

export class CurveConstraints {

    private _firstControlPoint: ConstraintType;
    private _lastControlPoint: ConstraintType;
    private _curveConstraintProcessor: CurveConstraintProcessor;
    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(curveConstraintProcessor: CurveConstraintProcessor, curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        this._curveConstraintProcessor = curveConstraintProcessor;
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._firstControlPoint = curveConstraintProcessor.firstControlPoint;
        this._lastControlPoint = curveConstraintProcessor.lastControlPoint;

    }

    set firstControlPoint(constraintAtFirstPoint: ConstraintType) {
        this._firstControlPoint = constraintAtFirstPoint;
    }

    set lastControlPoint(constraintAtLastPoint: ConstraintType) {
        this._lastControlPoint = constraintAtLastPoint;
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

    setConstraint(curveConstraintProcessor: CurveConstraintProcessor): void {
        this._curveConstraintProcessor = curveConstraintProcessor;
        this._firstControlPoint = this._curveConstraintProcessor.firstControlPoint;
        this._lastControlPoint = this._curveConstraintProcessor.lastControlPoint;
    }

    processConstraint(): void {
        this._curveConstraintProcessor.locateCurveExtremityUnderConstraint(this);
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