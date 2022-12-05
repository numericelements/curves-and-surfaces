import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { CurveConstraintInterface } from "../designPatterns/CurveConstraintInterface";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { Vector2d } from "../mathVector/Vector2d";
import { ConstraintType, CurveConstraints } from "./CurveConstraints";
import { CurveShapeSpaceNavigator } from "./CurveShapeSpaceNavigator";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";

const TOL_LOCATION_CURVE_REFERENCE_POINTS = 1.0E-6;

export abstract class CurveConstraintStrategy {

    protected readonly curveConstraints: CurveConstraints;
    protected _constraintsNotSatisfied: boolean;

    constructor(curveConstraints: CurveConstraints) {
        this.curveConstraints = curveConstraints;
        this._constraintsNotSatisfied = false;
    }

    get constraintsNotSatisfied(): boolean {
        return this._constraintsNotSatisfied;
    }
}

export class CurveConstraintNoConstraint extends CurveConstraintStrategy implements CurveConstraintInterface {

    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined;
    private readonly shapeNavigableCurve: ShapeNavigableCurve;
    private readonly _firstControlPoint: ConstraintType;
    private readonly _lastControlPoint: ConstraintType;
    private _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveConstraints: CurveConstraints) {
        super(curveConstraints);
        this.shapeNavigableCurve = curveConstraints.shapeNavigableCurve;
        if(this.shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            this._curveShapeSpaceNavigator = this.shapeNavigableCurve.curveShapeSpaceNavigator;
        } else {
            this._curveShapeSpaceNavigator = undefined;
        }
        this._firstControlPoint = ConstraintType.none;
        this._lastControlPoint = ConstraintType.none;
        this.curveConstraints.firstControlPoint = this._firstControlPoint;
        this.curveConstraints.lastControlPoint = this._lastControlPoint;
        if(this._curveShapeSpaceNavigator !== undefined) {
            this._optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve.clone();
        } else {
            this._optimizedCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline.clone();
        }
        const warning = new WarningLog(this.constructor.name, "constructor", " strategy for no CP clamped.");
        warning.logMessageToConsole();
    }

    get optimizedCurve(): BSplineR1toR2Interface {
        return this._optimizedCurve;
    }

    get firstControlPoint(): ConstraintType {
        return this._firstControlPoint;
    }

    get lastControlPoint(): ConstraintType {
        return this._lastControlPoint;
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator | undefined {
        return this._curveShapeSpaceNavigator;
    }

    set curveShapeSpaceNavigator(curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }

    updateCurve(): void {
        if(this._curveShapeSpaceNavigator !== undefined) {
            this._optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve.clone();
        } else {
            const error = new ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessageToConsole();
        }
    }

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{
        if(curveConstraints.firstControlPoint === ConstraintType.none 
            && curveConstraints.lastControlPoint === ConstraintType.none) {
                this.updateCurve();
                if(this._curveShapeSpaceNavigator !== undefined) {
                    this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this._optimizedCurve.clone();
                } else {
                    const error = new ErrorLog(this.constructor.name, 'locateCurveExtremityUnderConstraint', 'Cannot update the optimized curve: curveShapeSpaceNavigator undefined.');
                    error.logMessageToConsole();
                }
        } else {
            const warning = new WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessageToConsole();
        }
    }
}

export class CurveConstraintClampedFirstControlPoint extends CurveConstraintStrategy implements CurveConstraintInterface {

    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined;
    private readonly shapeNavigableCurve: ShapeNavigableCurve;
    private readonly _firstControlPoint: ConstraintType;
    private readonly _lastControlPoint: ConstraintType;
    private _referencePtIndex: number;
    private displacementCurrentCurveControlPolygon: Vector2d[] | undefined;
    private _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveConstraints: CurveConstraints){
        super(curveConstraints);
        this.shapeNavigableCurve = curveConstraints.shapeNavigableCurve;
        if(this.shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            this._curveShapeSpaceNavigator = this.shapeNavigableCurve.curveShapeSpaceNavigator;
        } else {
            this._curveShapeSpaceNavigator = undefined;
        }
        this._firstControlPoint = ConstraintType.location;
        this._lastControlPoint = ConstraintType.none;
        this.curveConstraints.firstControlPoint = this._firstControlPoint;
        this.curveConstraints.lastControlPoint = this._lastControlPoint;
        if(this._curveShapeSpaceNavigator !== undefined) {
            this._optimizedCurve = this._curveShapeSpaceNavigator?.navigationCurveModel.optimizedCurve.clone();
        } else {
            this._optimizedCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline.clone();
        }
        this._referencePtIndex = this.shapeNavigableCurve.clampedPoints[0];
        this.displacementCurrentCurveControlPolygon = this.curveShapeSpaceNavigator?.navigationCurveModel.displacementCurrentCurveControlPolygon;
        const warning = new WarningLog(this.constructor.name, "constructor", " strategy for first CP clamped.");
        warning.logMessageToConsole();
    }

    get optimizedCurve(): BSplineR1toR2Interface {
        return this._optimizedCurve;
    }

    get firstControlPoint(): ConstraintType {
        return this._firstControlPoint;
    }

    get lastControlPoint(): ConstraintType {
        return this._lastControlPoint;
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator | undefined {
        return this._curveShapeSpaceNavigator;
    }

    set curveShapeSpaceNavigator(curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }

    set referencePtIndex(referencePtIndex: number) {
        this._referencePtIndex = referencePtIndex;
    }

    updateCurve(): void {
        if(this._curveShapeSpaceNavigator !== undefined) {
            this._optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve.clone();
        } else {
            const error = new ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessageToConsole();
        }
    }

    relocateCurveAfterOptimization(): BSplineR1toR2Interface {
        this.updateCurve();
        let controlPoints: Array<Vector2d> = this._optimizedCurve.controlPoints;
        if(this._curveShapeSpaceNavigator !== undefined
            && this.displacementCurrentCurveControlPolygon !== undefined) {
            this._curveShapeSpaceNavigator.navigationCurveModel.curveDisplacement();
            for(let controlP of controlPoints) {
                controlP.x -= this.displacementCurrentCurveControlPolygon[0].x;
                controlP.y -= this.displacementCurrentCurveControlPolygon[0].y;
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this._optimizedCurve;
    }

    relocateCurveAfterOptimizationUsingKnotPts(): BSplineR1toR2Interface {
        this.updateCurve();
        const knots = this._optimizedCurve.getDistinctKnots();
        const refPoint = this._optimizedCurve.evaluate(knots[this._referencePtIndex]);
        let controlPoints: Array<Vector2d> = this._optimizedCurve.controlPoints;
        if(this._curveShapeSpaceNavigator !== undefined) {
            const displacement = refPoint.substract(this._curveShapeSpaceNavigator.navigationCurveModel.currentCurve.evaluate(knots[this._referencePtIndex]));
            for(let controlP of controlPoints) {
                controlP.x -= displacement.x;
                controlP.y -= displacement.y;
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this._optimizedCurve;
    }

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{
        if(curveConstraints.firstControlPoint === ConstraintType.location
            && curveConstraints.lastControlPoint === ConstraintType.none) {
                // this.relocateCurveAfterOptimization();
                this.relocateCurveAfterOptimizationUsingKnotPts();
                if(this._curveShapeSpaceNavigator !== undefined) {
                    this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this._optimizedCurve.clone();
                } else {
                    const error = new ErrorLog(this.constructor.name, 'locateCurveExtremityUnderConstraint', 'Cannot update the optimized curve: curveShapeSpaceNavigator undefined.');
                    error.logMessageToConsole();
                }
        } else {
            const warning = new WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessageToConsole();
        }
    }

}

export class CurveConstraintClampedLastControlPoint extends CurveConstraintStrategy implements CurveConstraintInterface {

    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined;
    private readonly shapeNavigableCurve: ShapeNavigableCurve;
    private readonly _firstControlPoint: ConstraintType;
    private readonly _lastControlPoint: ConstraintType;
    private _referencePtIndex: number;
    private displacementCurrentCurveControlPolygon: Vector2d[] | undefined;
    private _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveConstraints: CurveConstraints){
        super(curveConstraints);
        this.shapeNavigableCurve = curveConstraints.shapeNavigableCurve;
        if(this.shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            this._curveShapeSpaceNavigator = this.shapeNavigableCurve.curveShapeSpaceNavigator;
        } else {
            this._curveShapeSpaceNavigator = undefined;
        }
        this._firstControlPoint = ConstraintType.none;
        this._lastControlPoint = ConstraintType.location;
        this.curveConstraints.firstControlPoint = this._firstControlPoint;
        this.curveConstraints.lastControlPoint = this._lastControlPoint;
        if(this._curveShapeSpaceNavigator !== undefined) {
            this._optimizedCurve = this._curveShapeSpaceNavigator?.navigationCurveModel.optimizedCurve.clone();
        } else {
            this._optimizedCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline.clone();
        }
        this._referencePtIndex = this.shapeNavigableCurve.clampedPoints[1];
        this.displacementCurrentCurveControlPolygon = this.curveShapeSpaceNavigator?.navigationCurveModel.displacementCurrentCurveControlPolygon;
        let warning = new WarningLog(this.constructor.name, "constructor", " strategy for last CP clamped.");
        warning.logMessageToConsole();
    }

    get optimizedCurve(): BSplineR1toR2Interface {
        return this._optimizedCurve;
    }

    get firstControlPoint(): ConstraintType {
        return this._firstControlPoint;
    }

    get lastControlPoint(): ConstraintType {
        return this._lastControlPoint;
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator | undefined {
        return this._curveShapeSpaceNavigator;
    }

    set curveShapeSpaceNavigator(curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }

    set referencePtIndex(referencePtIndex: number) {
        this._referencePtIndex = referencePtIndex;
    }

    updateCurve(): void {
        if(this._curveShapeSpaceNavigator !== undefined) {
            this._optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        } else {
            const error = new ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessageToConsole();
        }
    }

    relocateCurveAfterOptimization(): BSplineR1toR2Interface {
        this.updateCurve();
        let controlPoints: Array<Vector2d> = this._optimizedCurve.controlPoints;
        if(this._curveShapeSpaceNavigator !== undefined &&
            this.displacementCurrentCurveControlPolygon !== undefined)
        {
            this._curveShapeSpaceNavigator.navigationCurveModel.curveDisplacement();
            for(let controlP of controlPoints) {
                controlP.x -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].x;
                controlP.y -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].y;
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this._optimizedCurve;
    }

    relocateCurveAfterOptimizationUsingKnotPts(): BSplineR1toR2Interface {
        this.updateCurve();
        const knots = this._optimizedCurve.getDistinctKnots();
        const refPoint = this._optimizedCurve.evaluate(knots[this._referencePtIndex]);
        let controlPoints: Array<Vector2d> = this._optimizedCurve.controlPoints;
        if(this._curveShapeSpaceNavigator !== undefined) {
            const displacement = refPoint.substract(this._curveShapeSpaceNavigator.navigationCurveModel.currentCurve.evaluate(knots[this._referencePtIndex]));
            for(let controlP of controlPoints) {
                controlP.x -= displacement.x;
                controlP.y -= displacement.y;
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this._optimizedCurve;
    }

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{
        if(curveConstraints.firstControlPoint === ConstraintType.none
            && curveConstraints.lastControlPoint === ConstraintType.location) {
                // this.relocateCurveAfterOptimization();
                this.relocateCurveAfterOptimizationUsingKnotPts();
                if(this._curveShapeSpaceNavigator !== undefined) {
                    this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this._optimizedCurve.clone();
                } else {
                    const error = new ErrorLog(this.constructor.name, 'locateCurveExtremityUnderConstraint', 'Cannot update the optimized curve: curveShapeSpaceNavigator undefined.');
                    error.logMessageToConsole();
                }
        } else {
            const warning = new WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessageToConsole();
        }
    }

}

export class CurveConstraintClampedFirstAndLastControlPoint extends CurveConstraintStrategy implements CurveConstraintInterface {

    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined;
    private readonly shapeNavigableCurve: ShapeNavigableCurve;
    private readonly _firstControlPoint: ConstraintType;
    private readonly _lastControlPoint: ConstraintType;
    private _referencePtIndex: number;
    private currentCurve: BSplineR1toR2Interface;
    private displacementCurrentCurveControlPolygon: Vector2d[] | undefined;
    private _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveConstraints: CurveConstraints){
        super(curveConstraints);
        this.shapeNavigableCurve = curveConstraints.shapeNavigableCurve;
        if(this.shapeNavigableCurve.curveShapeSpaceNavigator !== undefined) {
            this._curveShapeSpaceNavigator = this.shapeNavigableCurve.curveShapeSpaceNavigator;
        } else {
            this._curveShapeSpaceNavigator = undefined;
        }
        this._firstControlPoint = ConstraintType.location;
        this._lastControlPoint = ConstraintType.location;
        this.curveConstraints.firstControlPoint = this._firstControlPoint;
        this.curveConstraints.lastControlPoint = this._lastControlPoint;
        if(this._curveShapeSpaceNavigator !== undefined) {
            this._optimizedCurve = this._curveShapeSpaceNavigator?.navigationCurveModel.optimizedCurve.clone();
        } else {
            this._optimizedCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline.clone();
        }
        this._referencePtIndex = this.shapeNavigableCurve.clampedPoints[0];
        this.currentCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        this.displacementCurrentCurveControlPolygon = this.curveShapeSpaceNavigator?.navigationCurveModel.displacementCurrentCurveControlPolygon;
        let warning = new WarningLog(this.constructor.name, "constructor", " strategy for first and last CP clamped.");
        warning.logMessageToConsole();
    }

    get optimizedCurve(): BSplineR1toR2Interface {
        return this._optimizedCurve;
    }

    get firstControlPoint(): ConstraintType {
        return this._firstControlPoint;
    }

    get lastControlPoint(): ConstraintType {
        return this._lastControlPoint;
    }

    get curveShapeSpaceNavigator(): CurveShapeSpaceNavigator | undefined {
        return this._curveShapeSpaceNavigator;
    }

    set curveShapeSpaceNavigator(curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }

    set referencePtIndex(referencePtIndex: number) {
        this._referencePtIndex = referencePtIndex;
    }

    updateCurve(): void {
        if(this._curveShapeSpaceNavigator !== undefined) {
            this._optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        } else {
            const error = new ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessageToConsole();
        }
    }

    setCurrentCurve(currentCurve: BSplineR1toR2Interface): void {
        this.currentCurve = currentCurve.clone();
    }

    relocateCurveAfterOptimization(): BSplineR1toR2Interface {
        if(this._curveShapeSpaceNavigator !== undefined && this.displacementCurrentCurveControlPolygon !== undefined) {
            let controlPoints: Array<Vector2d> = this._optimizedCurve.controlPoints;
            const nbControlPts = this.displacementCurrentCurveControlPolygon.length;
            this._curveShapeSpaceNavigator.navigationCurveModel.curveDisplacement();
            if(Math.abs(this.displacementCurrentCurveControlPolygon[nbControlPts - 1].substract(this.displacementCurrentCurveControlPolygon[0]).norm()) < TOL_LOCATION_CURVE_REFERENCE_POINTS) {
                this.displacementCurrentCurveControlPolygon[controlPoints.length - 1] = this.displacementCurrentCurveControlPolygon[0];
                for(let controlP of controlPoints) {
                    controlP.x -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].x;
                    controlP.y -= this.displacementCurrentCurveControlPolygon[controlPoints.length - 1].y;
                }
                this._optimizedCurve.controlPoints = controlPoints;
            } else {
                // JCL Stop deforming curve because constraint is violated. Need to change strategy -> todo
                this._optimizedCurve = this.currentCurve.clone();
                this._constraintsNotSatisfied = true;
            }
        }
        return this._optimizedCurve;
    }

    relocateCurveAfterOptimizationUsingKnotPts(): BSplineR1toR2Interface {
        this.updateCurve();
        const knots = this._optimizedCurve.getDistinctKnots();
        const refPoint1 = this._optimizedCurve.evaluate(knots[this._referencePtIndex]);
        const refPoint2 = this._optimizedCurve.evaluate(knots[this.shapeNavigableCurve.clampedPoints[1]]);
        const displacement1 = refPoint1.substract(this.currentCurve.evaluate(knots[this._referencePtIndex]));
        const displacement2 = refPoint2.substract(this.currentCurve.evaluate(knots[this.shapeNavigableCurve.clampedPoints[1]]));
        let controlPoints: Array<Vector2d> = this._optimizedCurve.controlPoints;
        if(this._curveShapeSpaceNavigator !== undefined) {
            if(Math.abs(displacement1.substract(displacement2).norm()) < TOL_LOCATION_CURVE_REFERENCE_POINTS) {
                const displacement = refPoint1.substract(this._curveShapeSpaceNavigator.navigationCurveModel.currentCurve.evaluate(knots[this._referencePtIndex]));
                for(let controlP of controlPoints) {
                    controlP.x -= displacement.x;
                    controlP.y -= displacement.y;
                }
                this._optimizedCurve.controlPoints = controlPoints;
            } else {
                // JCL Stop deforming curve because constraint is violated. Need to change strategy -> todo
                this._constraintsNotSatisfied = true;
                this._optimizedCurve = this.currentCurve.clone();
            }
        }
        return this._optimizedCurve;
    }

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{
        if(curveConstraints.firstControlPoint === ConstraintType.location
            && curveConstraints.lastControlPoint === ConstraintType.location) {
                // this.relocateCurveAfterOptimization();
                this.relocateCurveAfterOptimizationUsingKnotPts();
                if(this._curveShapeSpaceNavigator !== undefined) {
                    this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this._optimizedCurve.clone();
                } else {
                    const error = new ErrorLog(this.constructor.name, 'locateCurveExtremityUnderConstraint', 'Cannot update the optimized curve: curveShapeSpaceNavigator undefined.');
                    error.logMessageToConsole();
                }
        } else {
            const warning = new WarningLog(this.constructor.name, "locateCurveExtremityUnderConstraint", " inconsistent constraint setting for this class.");
            warning.logMessageToConsole();
        }
    }

}