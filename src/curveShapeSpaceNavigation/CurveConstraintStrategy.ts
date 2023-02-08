import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { CurveConstraintInterface } from "../designPatterns/CurveConstraintInterface";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { toVector2d, Vector2d } from "../mathVector/Vector2d";
import { ConstraintType, CurveConstraints } from "./CurveConstraints";
import { CurveShapeSpaceNavigator } from "./CurveShapeSpaceNavigator";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { SquareMatrix } from "../linearAlgebra/SquareMatrix";
import { deepCopyControlPoints } from "../newBsplines/AbstractBSplineR1toR2";

export const TOL_LOCATION_CURVE_REFERENCE_POINTS = 1.0E-6;

export abstract class CurveConstraintStrategy {

    protected readonly curveConstraints: CurveConstraints;
    protected readonly shapeNavigableCurve: ShapeNavigableCurve;
    protected _currentCurve: BSplineR1toR2Interface;
    protected _constraintsNotSatisfied: boolean;
    protected abstract _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveConstraints: CurveConstraints) {
        this.curveConstraints = curveConstraints;
        this.shapeNavigableCurve = curveConstraints.shapeNavigableCurve;
        this._currentCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        this._constraintsNotSatisfied = false;
    }

    get constraintsNotSatisfied(): boolean {
        return this._constraintsNotSatisfied;
    }

    get currentCurve(): BSplineR1toR2Interface {
        return this._currentCurve.clone();
    }

    get optimizedCurve(): BSplineR1toR2Interface {
        return this._optimizedCurve.clone();
    }

    set optimizedCurve(optimizedCurve: BSplineR1toR2Interface) {
        this._optimizedCurve = optimizedCurve.clone();
    }

    set currentCurve(currentCurve: BSplineR1toR2Interface) {
        this._currentCurve = currentCurve.clone();
    }
}

export class CurveConstraintNoConstraint extends CurveConstraintStrategy implements CurveConstraintInterface {

    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator | undefined;
    private readonly _firstControlPoint: ConstraintType;
    private readonly _lastControlPoint: ConstraintType;
    protected _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveConstraints: CurveConstraints) {
        super(curveConstraints);
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
            this._optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        } else {
            this._optimizedCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        const warning = new WarningLog(this.constructor.name, "constructor", " strategy for no CP clamped.");
        warning.logMessageToConsole();
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
            this.optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
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
                    this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.optimizedCurve;
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
    private readonly _firstControlPoint: ConstraintType;
    private readonly _lastControlPoint: ConstraintType;
    private _referencePtIndex: number;
    private displacementCurrentCurveControlPolygon: Vector2d[] | undefined;
    protected _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveConstraints: CurveConstraints){
        super(curveConstraints);
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
            this._optimizedCurve = this._curveShapeSpaceNavigator?.navigationCurveModel.optimizedCurve;
        } else {
            this._optimizedCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        this._referencePtIndex = this.shapeNavigableCurve.clampedPoints[0];
        this.displacementCurrentCurveControlPolygon = this.curveShapeSpaceNavigator?.navigationCurveModel.displacementCurrentCurveControlPolygon;
        const warning = new WarningLog(this.constructor.name, "constructor", " strategy for first CP clamped.");
        warning.logMessageToConsole();
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
            this.optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        } else {
            const error = new ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessageToConsole();
        }
    }

    relocateCurveAfterOptimization(): BSplineR1toR2Interface {
        this.updateCurve();
        let controlPoints: Array<Vector2d> = deepCopyControlPoints(this._optimizedCurve.controlPoints);
        if(this._curveShapeSpaceNavigator !== undefined
            && this.displacementCurrentCurveControlPolygon !== undefined) {
            this._curveShapeSpaceNavigator.navigationCurveModel.curveDisplacement();
            for(let controlP of controlPoints) {
                controlP.x -= this.displacementCurrentCurveControlPolygon[0].x;
                controlP.y -= this.displacementCurrentCurveControlPolygon[0].y;
            }
        }
        this._optimizedCurve.controlPoints = controlPoints;
        return this.optimizedCurve;
    }

    relocateCurveAfterOptimizationUsingKnotPts(): BSplineR1toR2Interface {
        this.updateCurve();
        const knots = this.optimizedCurve.getDistinctKnots();
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
        return this.optimizedCurve;
    }

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{
        if(curveConstraints.firstControlPoint === ConstraintType.location
            && curveConstraints.lastControlPoint === ConstraintType.none) {
                // this.relocateCurveAfterOptimization();
                this.relocateCurveAfterOptimizationUsingKnotPts();
                if(this._curveShapeSpaceNavigator !== undefined) {
                    this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.optimizedCurve;
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
    private readonly _firstControlPoint: ConstraintType;
    private readonly _lastControlPoint: ConstraintType;
    private _referencePtIndex: number;
    private displacementCurrentCurveControlPolygon: Vector2d[] | undefined;
    protected _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveConstraints: CurveConstraints){
        super(curveConstraints);
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
            this._optimizedCurve = this._curveShapeSpaceNavigator?.navigationCurveModel.optimizedCurve;
        } else {
            this._optimizedCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        this._referencePtIndex = this.shapeNavigableCurve.clampedPoints[1];
        this.displacementCurrentCurveControlPolygon = this.curveShapeSpaceNavigator?.navigationCurveModel.displacementCurrentCurveControlPolygon;
        let warning = new WarningLog(this.constructor.name, "constructor", " strategy for last CP clamped.");
        warning.logMessageToConsole();
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
            this.optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        } else {
            const error = new ErrorLog(this.constructor.name, 'updateCurve', 'Cannot update curve: curveShapeSpaceNavigator undefined.');
            error.logMessageToConsole();
        }
    }

    relocateCurveAfterOptimization(): BSplineR1toR2Interface {
        this.updateCurve();
        let controlPoints: Array<Vector2d> = deepCopyControlPoints(this._optimizedCurve.controlPoints);
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
        return this.optimizedCurve;
    }

    relocateCurveAfterOptimizationUsingKnotPts(): BSplineR1toR2Interface {
        this.updateCurve();
        const knots = this.optimizedCurve.getDistinctKnots();
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
        return this.optimizedCurve;
    }

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{
        if(curveConstraints.firstControlPoint === ConstraintType.none
            && curveConstraints.lastControlPoint === ConstraintType.location) {
                // this.relocateCurveAfterOptimization();
                this.relocateCurveAfterOptimizationUsingKnotPts();
                if(this._curveShapeSpaceNavigator !== undefined) {
                    this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.optimizedCurve;
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
    private readonly _firstControlPoint: ConstraintType;
    private readonly _lastControlPoint: ConstraintType;
    private _referencePtIndex: number;
    private displacementCurrentCurveControlPolygon: Vector2d[] | undefined;
    protected _optimizedCurve: BSplineR1toR2Interface;

    constructor(curveConstraints: CurveConstraints){
        super(curveConstraints);
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
            this._optimizedCurve = this._curveShapeSpaceNavigator?.navigationCurveModel.optimizedCurve;
        } else {
            this._optimizedCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        }
        this._referencePtIndex = this.shapeNavigableCurve.clampedPoints[0];
        this._currentCurve = this.shapeNavigableCurve.curveCategory.curveModel.spline;
        this.displacementCurrentCurveControlPolygon = this.curveShapeSpaceNavigator?.navigationCurveModel.displacementCurrentCurveControlPolygon;
        let warning = new WarningLog(this.constructor.name, "constructor", " strategy for first and last CP clamped.");
        warning.logMessageToConsole();
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
            this.optimizedCurve = this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
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
            let controlPoints: Array<Vector2d> = deepCopyControlPoints(this.optimizedCurve.controlPoints);
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
                this.optimizedCurve = this.currentCurve.clone();
                this._constraintsNotSatisfied = true;
            }
        }
        return this.optimizedCurve;
    }

    relocateCurveAfterOptimizationUsingKnotPts(): BSplineR1toR2Interface {
        this.updateCurve();
        const knotsOptCurve = this.optimizedCurve.getDistinctKnots();
        const refPoint1 = this._optimizedCurve.evaluate(knotsOptCurve[this._referencePtIndex]);
        const refPoint2 = this._optimizedCurve.evaluate(knotsOptCurve[this.shapeNavigableCurve.clampedPoints[1]]);
        const knotsCurrentCurve = this._currentCurve.getDistinctKnots();
        const refDistance = this._currentCurve.evaluate(knotsCurrentCurve[this.shapeNavigableCurve.clampedPoints[1]]).distance(this._currentCurve.evaluate(knotsCurrentCurve[this._referencePtIndex]));
        const distance = refPoint2.distance(refPoint1);
        if(this._curveShapeSpaceNavigator !== undefined) {
            // if(Math.abs(displacement1.substract(displacement2).norm()) < TOL_LOCATION_CURVE_REFERENCE_POINTS) {
            if(Math.abs(distance - refDistance) < TOL_LOCATION_CURVE_REFERENCE_POINTS) {
                this.applyRigidBodyDisplacement();
            } else {
                // Scale the optimized curve to meet the distance constraint
                // const scaleFactor = refDistance / distance;
                // const scaledCurve = this._optimizedCurve.scale(scaleFactor);
                // this._optimizedCurve = scaledCurve.clone();
                // this.applyRigidBodyDisplacement();

                // JCL Stop deforming curve because constraint is violated. Need to change strategy -> todo
                const valid = this.curveConstraints.slideConstraintAlongCurve();
                if(valid) {
                    this.applyRigidBodyDisplacement();
                } else {
                    this._constraintsNotSatisfied = true;
                    this._optimizedCurve = this._currentCurve.clone();
                }
            }
        }
        return this.optimizedCurve;
    }

    applyRigidBodyDisplacement() {
        const knotsCurrentCurve = this._currentCurve.getDistinctKnots();
        const refPt1currentCurve = this._currentCurve.evaluate(knotsCurrentCurve[this._referencePtIndex]);
        const refPt2currentCurve = this._currentCurve.evaluate(knotsCurrentCurve[this.shapeNavigableCurve.clampedPoints[1]]);
        const pt2Pt1currentCurve = refPt2currentCurve.substract(refPt1currentCurve);
        const knotsOptCurve = this.optimizedCurve.getDistinctKnots();
        const refPt1optCurve = this._optimizedCurve.evaluate(knotsOptCurve[this._referencePtIndex]);
        const refPt2optCurve = this._optimizedCurve.evaluate(knotsOptCurve[this.shapeNavigableCurve.clampedPoints[1]]);
        const pt2Pt1optCurve = refPt2optCurve.substract(refPt1optCurve);
        const displacement = refPt1optCurve.substract(refPt1currentCurve);
        // use dot product to compute the angle because angle is very small and crossProduct can be less accurate
        const argument = pt2Pt1currentCurve.dot(pt2Pt1optCurve) / (pt2Pt1currentCurve.norm() * pt2Pt1optCurve.norm());
        let angle = Math.acos(pt2Pt1currentCurve.dot(pt2Pt1optCurve) / (pt2Pt1currentCurve.norm() * pt2Pt1optCurve.norm()));
        if(isNaN(angle)) {
            // Redefine the angle when the argument of the acos is greater than one, due to roundoff errors in the evaluation
            // of the argument. The argument being close an angle of 0, using asin does not lead to roundoff errors near one.
            console.log('applyRigidBodyDisplacement. Angle computed through cosine is not applicable argument = '+argument);
            angle = Math.asin(pt2Pt1currentCurve.crossPoduct(pt2Pt1optCurve) / (pt2Pt1currentCurve.norm() * pt2Pt1optCurve.norm()));
        }
        const signAngle = Math.asin(pt2Pt1currentCurve.crossPoduct(pt2Pt1optCurve) / (pt2Pt1currentCurve.norm() * pt2Pt1optCurve.norm()));
        if(signAngle < 0.0) angle = - angle;
        const rotationMatrix = new SquareMatrix(2, [Math.cos(angle), Math.sin(angle), - Math.sin(angle), Math.cos(angle)]);
        const controlPointsOptCrv: Array<Vector2d> = deepCopyControlPoints(this._optimizedCurve.controlPoints);
        let relocatedCtrlPts: Array<Vector2d> = [];
        for (const controlPt of controlPointsOptCrv) {
            relocatedCtrlPts.push(controlPt.substract(displacement));
        }
        for(let i = 0; i < controlPointsOptCrv.length; i++) {
            const vertexLoc = controlPointsOptCrv[i].substract(refPt1optCurve);
            const vertexRot = toVector2d(rotationMatrix.multiplyByVector(vertexLoc.toArray()))
            relocatedCtrlPts[i] = vertexRot.add(refPt1optCurve).substract(displacement);
        }
        this._optimizedCurve.controlPoints = relocatedCtrlPts;
    }

    locateCurveExtremityUnderConstraint(curveConstraints: CurveConstraints): void{
        if(curveConstraints.firstControlPoint === ConstraintType.location
            && curveConstraints.lastControlPoint === ConstraintType.location) {
                // this.relocateCurveAfterOptimization();
                this.relocateCurveAfterOptimizationUsingKnotPts();
                if(this._curveShapeSpaceNavigator !== undefined) {
                    this._curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.optimizedCurve;
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