import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveConstraintClampedFirstControlPoint } from "./CurveConstraintStrategy";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";

export enum ConstraintType {none, location, tangent, locationAndTangent}

export enum CurveExtremity {first, last}

export class CurveConstraints {

    private _firstControlPoint: ConstraintType;
    private _lastControlPoint: ConstraintType;
    private _curveConstraintProcessor: CurveConstraintProcessor;
    private _shapeNavigableCurve: ShapeNavigableCurve;
    // private _optimizedCurve: BSplineR1toR2Interface;

    constructor(shapeNavigableCurve: ShapeNavigableCurve) {

        let warning = new WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessageToConsole();
        this._curveConstraintProcessor = new CurveConstraintClampedFirstControlPoint(this);
        this._firstControlPoint = this._curveConstraintProcessor.firstControlPoint;
        this._lastControlPoint = this._curveConstraintProcessor.lastControlPoint;
        this._shapeNavigableCurve = shapeNavigableCurve;
        this._firstControlPoint = ConstraintType.location;
        this._lastControlPoint = ConstraintType.none;
        // this._optimizedCurve = this._shapeNavigableCurve.optimizedCurve;
    }

    set firstControlPoint(constraintAtFirstPoint: ConstraintType) {
        this._firstControlPoint = constraintAtFirstPoint;
    }

    set lastControlPoint(constraintAtLastPoint: ConstraintType) {
        this._lastControlPoint = constraintAtLastPoint;
    }

    // set optimizedCurve(curve: BSplineR1toR2Interface) {
    //     this._optimizedCurve = curve;
    // }

    get shapeNavigableCurve(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
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

    get curveShapeSpaceNavigator(): ShapeNavigableCurve {
        return this._shapeNavigableCurve;
    }

    // get optimizedCurve(): BSplineR1toR2Interface {
    //     return this._optimizedCurve;
    // }

    setConstraint(curveConstraintProcessor: CurveConstraintProcessor): void {
        this._curveConstraintProcessor = curveConstraintProcessor;
        this._firstControlPoint = this._curveConstraintProcessor.firstControlPoint;
        this._lastControlPoint = this._curveConstraintProcessor.lastControlPoint;
    }

    // processConstraint(): void {
    //     this._curveConstraintProcessor.locateCurveExtremityUnderConstraint(this);
    //     if(this._optimizedCurve instanceof BSplineR1toR2) {
    //         this._shapeNavigableCurve.optimizedCurve = this._optimizedCurve;
    //     } else if(this._optimizedCurve instanceof PeriodicBSplineR1toR2) {
    //         console.log("periodic Bspline to be processed")
    //     }
        
    // }

    // updateCurve(): void {
    //     this._optimizedCurve = this._shapeNavigableCurve.optimizedCurve;
    // }

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