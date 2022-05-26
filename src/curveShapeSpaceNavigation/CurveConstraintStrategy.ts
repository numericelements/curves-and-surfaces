import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { CurveConstraintProcessor } from "../designPatterns/CurveConstraintProcessor";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { Vector2d } from "../mathVector/Vector2d";
import { ConstraintType, CurveConstraints } from "./CurveConstraints";
import { AbstractCurveShapeSpaceNavigator } from "./CurveShapeSpaceNavigator";

const TOL_LOCATION_CURVE_EXTREMITIES = 1.0E-6;

export class CurveConstraintNoConstraint implements CurveConstraintProcessor {

    private curveConstraints: CurveConstraints;
    private curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator;
    private shapeNavigableCurve: ShapeNavigableCurve;
    private targetCurve: BSplineR1toR2Interface;
    public firstControlPoint: ConstraintType;
    public lastControlPoint: ConstraintType;
    private _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator, curveConstraints: CurveConstraints){
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.curveConstraints = curveConstraints;
        this.firstControlPoint = ConstraintType.none;
        this.lastControlPoint = ConstraintType.none;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        this.targetCurve = this.curveShapeSpaceNavigator.targetCurve;
        this._optimizedCurve = this.targetCurve;
        let warning = new WarningLog(this.constructor.name, "constructor", " strategy for no CP clamped.");
        warning.logMessageToConsole();
    }

    get optimizedCurve(): BSplineR1toR2Interface {
        return this._optimizedCurve;
    }

    // get firstControlPoint(): ConstraintType {
    //     return this._firstControlPoint;
    // }

    // get lastControlPoint(): ConstraintType {
    //     return this._lastControlPoint;
    // }

    updateCurve(): void {
        this._optimizedCurve = this.curveConstraints.optimizedCurve;
    }

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{
        if(curveConstraints.firstControlPoint === ConstraintType.none 
            && curveConstraints.lastControlPoint === ConstraintType.none) {
                this.updateCurve();
                this._optimizedCurve = this.curveShapeSpaceNavigator.optimizedCurve;
                this.curveConstraints.optimizedCurve = this._optimizedCurve;
        } else {
            let warning = new WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessageToConsole();
        }
    }
}

export class CurveConstraintClampedFirstControlPoint implements CurveConstraintProcessor {

    private curveConstraints: CurveConstraints;
    private curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator;
    private curveModeler: ShapeNavigableCurve;
    private targetCurve: BSplineR1toR2Interface;
    private displacementCurrentCurveControlPolygon: Vector2d[];
    public firstControlPoint: ConstraintType;
    public lastControlPoint: ConstraintType;
    private _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator, curveConstraints: CurveConstraints){
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.curveConstraints = curveConstraints;
        this.firstControlPoint = ConstraintType.location;
        this.lastControlPoint = ConstraintType.none;
        this.curveModeler = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        this.targetCurve = this.curveShapeSpaceNavigator.targetCurve;
        this._optimizedCurve = this.targetCurve;
        this.displacementCurrentCurveControlPolygon = this.curveShapeSpaceNavigator.displacementCurrentCurveControlPolygon;
        let warning = new WarningLog(this.constructor.name, "constructor", " strategy for first CP clamped.");
        warning.logMessageToConsole();
    }

    get optimizedCurve(): BSplineR1toR2Interface {
        return this._optimizedCurve;
    }

    // get firstControlPoint(): ConstraintType {
    //     return this._firstControlPoint;
    // }

    // get lastControlPoint(): ConstraintType {
    //     return this._lastControlPoint;
    // }

    updateCurve(): void {
        this._optimizedCurve = this.curveConstraints.optimizedCurve;
    }

    relocateCurveAfterOptimization(): BSplineR1toR2Interface {
        this.updateCurve();
        let controlPoints: Array<Vector2d> = this._optimizedCurve.controlPoints;
        this.curveShapeSpaceNavigator.curveDisplacement();
        for(let controlP of controlPoints) {
            controlP.x -= this.displacementCurrentCurveControlPolygon[0].x;
            controlP.y -= this.displacementCurrentCurveControlPolygon[0].y;
        }
        this._optimizedCurve.controlPoints = controlPoints;
        this.curveConstraints.optimizedCurve = this._optimizedCurve;
        return this.curveConstraints.optimizedCurve;
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

    private curveConstraints: CurveConstraints;
    private curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator;
    private curveModeler: ShapeNavigableCurve;
    private targetCurve: BSplineR1toR2Interface;
    private displacementCurrentCurveControlPolygon: Vector2d[];
    public firstControlPoint: ConstraintType;
    public lastControlPoint: ConstraintType;
    private _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator){
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.curveConstraints = this.curveShapeSpaceNavigator.curveConstraints;
        this.firstControlPoint = ConstraintType.none;
        this.lastControlPoint = ConstraintType.location;
        this.curveModeler = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        this.targetCurve = this.curveShapeSpaceNavigator.targetCurve;
        this._optimizedCurve = this.targetCurve;
        this.displacementCurrentCurveControlPolygon = this.curveShapeSpaceNavigator.displacementCurrentCurveControlPolygon;
        let warning = new WarningLog(this.constructor.name, "constructor", " strategy for last CP clamped.");
        warning.logMessageToConsole();
    }

    // get firstControlPoint(): ConstraintType {
    //     return this._firstControlPoint;
    // }

    // get lastControlPoint(): ConstraintType {
    //     return this._lastControlPoint;
    // }

    updateCurve(): void {
        this._optimizedCurve = this.curveConstraints.optimizedCurve;
    }

    relocateCurveAfterOptimization(): BSplineR1toR2Interface {
        this.updateCurve();
        let controlPoints: Array<Vector2d> = this._optimizedCurve.controlPoints;
        this.curveShapeSpaceNavigator.curveDisplacement();
        for(let controlP of controlPoints) {
            controlP.x -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].x;
            controlP.y -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].y;
        }
        this._optimizedCurve.controlPoints = controlPoints;
        this.curveConstraints.optimizedCurve = this._optimizedCurve;
        return this.curveConstraints.optimizedCurve;
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

    private curveConstraints: CurveConstraints;
    private curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator;
    private curveModeler: ShapeNavigableCurve;
    private currentCurve: BSplineR1toR2Interface;
    private targetCurve: BSplineR1toR2Interface;
    private displacementCurrentCurveControlPolygon: Vector2d[];
    public firstControlPoint: ConstraintType;
    public lastControlPoint: ConstraintType;
    private _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator){
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.curveConstraints = this.curveShapeSpaceNavigator.curveConstraints;
        this.firstControlPoint = ConstraintType.location;
        this.lastControlPoint = ConstraintType.location;
        this.curveModeler = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        this.currentCurve = this.curveShapeSpaceNavigator.currentCurve;
        this.targetCurve = this.curveShapeSpaceNavigator.targetCurve;
        this._optimizedCurve = this.targetCurve;
        this.displacementCurrentCurveControlPolygon = this.curveShapeSpaceNavigator.displacementCurrentCurveControlPolygon;
        let warning = new WarningLog(this.constructor.name, "constructor", " strategy for first and last CP clamped.");
        warning.logMessageToConsole();
    }

    // get firstControlPoint(): ConstraintType {
    //     return this._firstControlPoint;
    // }

    // get lastControlPoint(): ConstraintType {
    //     return this._lastControlPoint;
    // }

    relocateCurveAfterOptimization(): BSplineR1toR2Interface {
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