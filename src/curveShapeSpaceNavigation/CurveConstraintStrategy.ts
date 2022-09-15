import { ActiveLocationControl, ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { Vector2d } from "../mathVector/Vector2d";
import { ConstraintType, CurveConstraints } from "./CurveConstraints";
import { AbstractCurveShapeSpaceNavigator } from "./CurveShapeSpaceNavigator";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";

const TOL_LOCATION_CURVE_EXTREMITIES = 1.0E-6;

export class CurveConstraintNoConstraint implements CurveConstraintProcessor {

    private curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator | undefined;
    private shapeNavigableCurve: ShapeNavigableCurve;
    private _firstControlPoint: ConstraintType;
    private _lastControlPoint: ConstraintType;
    private curveConstraints: CurveConstraints;
    private targetCurve?: BSplineR1toR2Interface | undefined;
    private _optimizedCurve?: BSplineR1toR2Interface | undefined;

    constructor(curveConstraints: CurveConstraints){
        this.curveConstraints = curveConstraints;
        this.shapeNavigableCurve = curveConstraints.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = undefined;
        this._firstControlPoint = ConstraintType.none;
        this._lastControlPoint = ConstraintType.none;
        this.curveConstraints.firstControlPoint = this._firstControlPoint;
        this.curveConstraints.lastControlPoint = this._lastControlPoint;
        // this.targetCurve = this.curveShapeSpaceNavigator.targetCurve;
        this.targetCurve = undefined;
        this._optimizedCurve = this.targetCurve;
        let warning = new WarningLog(this.constructor.name, "constructor", " strategy for no CP clamped.");
        warning.logMessageToConsole();
        // this.activeLocationControl = ActiveLocationControl.none;
    }

    get optimizedCurve(): BSplineR1toR2Interface | undefined {
        return this._optimizedCurve;
    }

    get firstControlPoint(): ConstraintType {
        return this._firstControlPoint;
    }

    get lastControlPoint(): ConstraintType {
        return this._lastControlPoint;
    }

    updateCurve(): void {
        if(this.curveShapeSpaceNavigator !== undefined)
        {
            this._optimizedCurve = this.curveShapeSpaceNavigator.optimizedCurve;
        }
    }

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{
        if(curveConstraints.firstControlPoint === ConstraintType.none 
            && curveConstraints.lastControlPoint === ConstraintType.none) {
                this.updateCurve();
                // this._optimizedCurve = this.curveShapeSpaceNavigator.optimizedCurve;
        } else {
            let warning = new WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessageToConsole();
        }
    }
}

export class CurveConstraintClampedFirstControlPoint implements CurveConstraintProcessor {

    private curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator | undefined;
    private shapeNavigableCurve: ShapeNavigableCurve;
    private _firstControlPoint: ConstraintType;
    private _lastControlPoint: ConstraintType;
    private curveConstraints: CurveConstraints;
    private targetCurve?: BSplineR1toR2Interface | undefined;
    private displacementCurrentCurveControlPolygon: Vector2d[] | undefined;
    private _optimizedCurve?: BSplineR1toR2Interface | undefined;

    constructor(curveConstraints: CurveConstraints){
        this.curveConstraints = curveConstraints;
        this.shapeNavigableCurve = curveConstraints.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = undefined;
        this._firstControlPoint = ConstraintType.location;
        this._lastControlPoint = ConstraintType.none;
        this.curveConstraints.firstControlPoint = this._firstControlPoint;
        this.curveConstraints.lastControlPoint = this._lastControlPoint;
        this.targetCurve = undefined;
        this._optimizedCurve = this.targetCurve;
        this.displacementCurrentCurveControlPolygon = undefined;
        // this.displacementCurrentCurveControlPolygon = this.curveShapeSpaceNavigator.displacementCurrentCurveControlPolygon;
        let warning = new WarningLog(this.constructor.name, "constructor", " strategy for first CP clamped.");
        warning.logMessageToConsole();
    }

    get optimizedCurve(): BSplineR1toR2Interface | undefined {
        return this._optimizedCurve;
    }

    get firstControlPoint(): ConstraintType {
        return this._firstControlPoint;
    }

    get lastControlPoint(): ConstraintType {
        return this._lastControlPoint;
    }

    updateCurve(): void {
        if(this.curveShapeSpaceNavigator !== undefined)
        {
            this._optimizedCurve = this.curveShapeSpaceNavigator.optimizedCurve;
        }
    }

    relocateCurveAfterOptimization(): BSplineR1toR2Interface | undefined {
        this.updateCurve();
        if(this._optimizedCurve !== undefined)
        {
            let controlPoints: Array<Vector2d> = this._optimizedCurve.controlPoints;
            if(this.curveShapeSpaceNavigator !== undefined
                && this.displacementCurrentCurveControlPolygon !== undefined)
            {
                this.curveShapeSpaceNavigator.curveDisplacement();
                for(let controlP of controlPoints) {
                    controlP.x -= this.displacementCurrentCurveControlPolygon[0].x;
                    controlP.y -= this.displacementCurrentCurveControlPolygon[0].y;
                }
            }
            this._optimizedCurve.controlPoints = controlPoints;
        }

        return this._optimizedCurve;
    }

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{
        if(curveConstraints.firstControlPoint === ConstraintType.location
            && curveConstraints.lastControlPoint === ConstraintType.none) {
                this.relocateCurveAfterOptimization();
        } else {
            let warning = new WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessageToConsole();
        }
    }

}

export class CurveConstraintClampedLastControlPoint implements CurveConstraintProcessor {

    private curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator | undefined;
    private shapeNavigableCurve: ShapeNavigableCurve;
    private _firstControlPoint: ConstraintType;
    private _lastControlPoint: ConstraintType;
    private curveConstraints: CurveConstraints;
    private targetCurve: BSplineR1toR2Interface | undefined;
    private displacementCurrentCurveControlPolygon: Vector2d[] | undefined;
    private _optimizedCurve: BSplineR1toR2Interface | undefined;

    constructor(curveConstraints: CurveConstraints){
        this.curveConstraints = curveConstraints;
        this.shapeNavigableCurve = curveConstraints.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = undefined;
        this._firstControlPoint = ConstraintType.none;
        this._lastControlPoint = ConstraintType.location;
        this.curveConstraints.firstControlPoint = this._firstControlPoint;
        this.curveConstraints.lastControlPoint = this._lastControlPoint;
        this.targetCurve = undefined;
        this._optimizedCurve = this.targetCurve;
        // this.displacementCurrentCurveControlPolygon = this.curveShapeSpaceNavigator.displacementCurrentCurveControlPolygon;
        this.displacementCurrentCurveControlPolygon = undefined;
        let warning = new WarningLog(this.constructor.name, "constructor", " strategy for last CP clamped.");
        warning.logMessageToConsole();
    }

    get firstControlPoint(): ConstraintType {
        return this._firstControlPoint;
    }

    get lastControlPoint(): ConstraintType {
        return this._lastControlPoint;
    }

    updateCurve(): void {
        if(this.curveShapeSpaceNavigator !== undefined)
        {
            this._optimizedCurve = this.curveShapeSpaceNavigator.optimizedCurve;
        }
    }

    relocateCurveAfterOptimization(): BSplineR1toR2Interface | undefined {
        this.updateCurve();
        if(this._optimizedCurve !== undefined)
        {
            let controlPoints: Array<Vector2d> = this._optimizedCurve.controlPoints;
            if(this.curveShapeSpaceNavigator !== undefined &&
                this.displacementCurrentCurveControlPolygon !== undefined)
            {
                this.curveShapeSpaceNavigator.curveDisplacement();
                for(let controlP of controlPoints) {
                    controlP.x -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].x;
                    controlP.y -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].y;
                }
            }
            this._optimizedCurve.controlPoints = controlPoints;
        }
        return this._optimizedCurve;
    }

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{
        if(curveConstraints.firstControlPoint === ConstraintType.none
            && curveConstraints.lastControlPoint === ConstraintType.location) {
                this.relocateCurveAfterOptimization();
        } else {
            let warning = new WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessageToConsole();
        }
    }

}

export class CurveConstraintClampedFirstAndLastControlPoint implements CurveConstraintProcessor {

    private curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator | undefined;
    private shapeNavigableCurve: ShapeNavigableCurve;
    private _firstControlPoint: ConstraintType;
    private _lastControlPoint: ConstraintType;
    private curveConstraints: CurveConstraints;
    private currentCurve: BSplineR1toR2Interface | undefined;
    private targetCurve: BSplineR1toR2Interface | undefined;
    private displacementCurrentCurveControlPolygon: Vector2d[] | undefined;
    private _optimizedCurve: BSplineR1toR2Interface | undefined;

    constructor(curveConstraints: CurveConstraints){
        this.curveConstraints = curveConstraints;
        this.shapeNavigableCurve = curveConstraints.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = undefined;
        this._firstControlPoint = ConstraintType.location;
        this._lastControlPoint = ConstraintType.location;
        this.curveConstraints.firstControlPoint = this._firstControlPoint;
        this.curveConstraints.lastControlPoint = this._lastControlPoint;
        this.currentCurve = undefined;
        this.targetCurve = undefined;
        this._optimizedCurve = this.targetCurve;
        // this.displacementCurrentCurveControlPolygon = this.curveShapeSpaceNavigator.displacementCurrentCurveControlPolygon;
        this.displacementCurrentCurveControlPolygon = undefined;
        let warning = new WarningLog(this.constructor.name, "constructor", " strategy for first and last CP clamped.");
        warning.logMessageToConsole();
    }

    get firstControlPoint(): ConstraintType {
        return this._firstControlPoint;
    }

    get lastControlPoint(): ConstraintType {
        return this._lastControlPoint;
    }

    relocateCurveAfterOptimization(): BSplineR1toR2Interface | undefined {
        if(this._optimizedCurve !== undefined && this.curveShapeSpaceNavigator !== undefined
            && this.displacementCurrentCurveControlPolygon !== undefined)
        {
            let controlPoints: Array<Vector2d> = this._optimizedCurve.controlPoints;
            const nbControlPts = this.displacementCurrentCurveControlPolygon.length;
            this.curveShapeSpaceNavigator.curveDisplacement();
            if(Math.abs(this.displacementCurrentCurveControlPolygon[nbControlPts - 1].substract(this.displacementCurrentCurveControlPolygon[0]).norm()) < TOL_LOCATION_CURVE_EXTREMITIES) {
                this.displacementCurrentCurveControlPolygon[controlPoints.length - 1] = this.displacementCurrentCurveControlPolygon[0];
                for(let controlP of controlPoints) {
                    controlP.x -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].x;
                    controlP.y -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].y;
                }
                this._optimizedCurve.controlPoints = controlPoints;
            } else {
                // JCL Stop deforming curve because constraint is violated. Need to change strategy -> todo
                this._optimizedCurve = this.currentCurve;
            }
        }
        return this._optimizedCurve;
    }

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{
        if(curveConstraints.firstControlPoint === ConstraintType.location
            && curveConstraints.lastControlPoint === ConstraintType.location) {
                this.relocateCurveAfterOptimization();
        } else {
            let warning = new WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessageToConsole();
        }
    }

}