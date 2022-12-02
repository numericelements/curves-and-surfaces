import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { CurveConstraintInterface } from "../designPatterns/CurveConstraintInterface";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveConstraintNoConstraint } from "./CurveConstraintStrategy";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";

export enum ConstraintType {none, location, tangent, locationAndTangent}

export enum CurveExtremity {first, last}

export class CurveConstraints {

    private _firstControlPoint: ConstraintType;
    private _lastControlPoint: ConstraintType;
    private _curveConstraintStrategy: CurveConstraintInterface;
    private readonly _shapeNavigableCurve: ShapeNavigableCurve;
    // private _optimizedCurve: BSplineR1toR2Interface;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {

        let warning = new WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessageToConsole();
        this._shapeNavigableCurve = shapeNavigableCurve;
        this._curveConstraintStrategy = new CurveConstraintNoConstraint(this);
        this._firstControlPoint = this._curveConstraintStrategy.firstControlPoint;
        this._lastControlPoint = this._curveConstraintStrategy.lastControlPoint;
        this._shapeNavigableCurve.changeCurveConstraintStrategy(this._curveConstraintStrategy);
        this._firstControlPoint = ConstraintType.none;
        this._lastControlPoint = ConstraintType.none;
        // this._optimizedCurve = this._shapeNavigableCurve.optimizedCurve;
    }

    set firstControlPoint(constraintAtFirstPoint: ConstraintType) {
        this._firstControlPoint = constraintAtFirstPoint;
    }

    set lastControlPoint(constraintAtLastPoint: ConstraintType) {
        this._lastControlPoint = constraintAtLastPoint;
    }

    set curveConstraintStrategy(curveConstraintStrategy: CurveConstraintInterface) {
        this._curveConstraintStrategy = curveConstraintStrategy;
    }

    get shapeNavigableCurve(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }

    get firstControlPoint(): ConstraintType {
        return this._firstControlPoint;
    }

    get lastControlPoint(): ConstraintType {
        return this._lastControlPoint;
    }

    get curveConstraintStrategy(): CurveConstraintInterface {
        return this._curveConstraintStrategy;
    }

    get curveShapeSpaceNavigator(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }

    setConstraint(curveConstraintStrategy: CurveConstraintInterface): void {
        this._curveConstraintStrategy = curveConstraintStrategy;
        this._firstControlPoint = this._curveConstraintStrategy.firstControlPoint;
        this._lastControlPoint = this._curveConstraintStrategy.lastControlPoint;
    }

    processConstraint(): void {
        this._curveConstraintStrategy.locateCurveExtremityUnderConstraint(this);
    }

    // clearConstraint(extremity: CurveExtremity): void {
    //     if(extremity === CurveExtremity.first) {
    //         this._firstControlPoint = ConstraintType.none;
    //     }
    //     if(extremity === CurveExtremity.last) {
    //         this._lastControlPoint = ConstraintType.none;
    //     }
    // }

    clearAll(): void {
        this._firstControlPoint = ConstraintType.none;
        this._lastControlPoint = ConstraintType.none;
    }

}