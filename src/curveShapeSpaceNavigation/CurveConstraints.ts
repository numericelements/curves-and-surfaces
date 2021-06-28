
export enum ConstraintType {none, location, tangent, locationAndTangent}

export enum CurveExtremity {first, last}

export class CurveConstraints {

    private _firstControlPoint: ConstraintType;
    private _lastControlPoint: ConstraintType;

    constructor(constraintAtFirstPoint?: ConstraintType, constraintAtLastPoint?: ConstraintType) {
        this._firstControlPoint = ConstraintType.none;
        this._lastControlPoint = ConstraintType.none;
        if(constraintAtFirstPoint !== undefined) {
            this._firstControlPoint = constraintAtFirstPoint;
        }
        if(constraintAtLastPoint !== undefined) {
            this._lastControlPoint = constraintAtLastPoint;
        }
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

    clearConstraint(extremity: CurveExtremity): void {
        if(extremity === CurveExtremity.first) {
            this._firstControlPoint = ConstraintType.none;
        }
        if(extremity === CurveExtremity.last) {
            this._lastControlPoint = ConstraintType.none;
        }
    }

    clearAll(): void {
        this._firstControlPoint = ConstraintType.none;
        this._lastControlPoint = ConstraintType.none;
    }

}