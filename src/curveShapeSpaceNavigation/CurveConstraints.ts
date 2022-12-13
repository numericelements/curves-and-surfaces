import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { CurveConstraintInterface } from "../designPatterns/CurveConstraintInterface";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveConstraintNoConstraint, TOL_LOCATION_CURVE_REFERENCE_POINTS } from "./CurveConstraintStrategy";
import { NO_CONSTRAINT, ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { BSpline_R1_to_R1 } from "../bsplines/BSpline_R1_to_R1";
import { cpuUsage } from "process";

export enum ConstraintType {none, location, tangent, locationAndTangent}
export enum CurveExtremity {first, last}
export const NB_MAX_ITER_SLIDING_CLAMPING_CONSTRAINT = 10;

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

    slideConstraintAlongCurve(optimizedSpline: BSplineR1toR2Interface): void {
        const indexPoint1 = this._shapeNavigableCurve.clampedPoints[0];
        const indexPoint2 = this._shapeNavigableCurve.clampedPoints[1];
        if(indexPoint1 === NO_CONSTRAINT || indexPoint2 === NO_CONSTRAINT) {
            const error = new ErrorLog(this.constructor.name, "slideConstraintAlongCurve", "Configuration with only one clamped point: cannot be processed.");
            error.logMessageToConsole();
        } else {
            const spline = this._shapeNavigableCurve.curveCategory.curveModel.spline;
            const knots = spline.getDistinctKnots();
            const point1 = spline.evaluate(knots[indexPoint1]);
            const point2 = spline.evaluate(knots[indexPoint2]);
            const refDistance = point1.distance(point2);
            const point1Opt = optimizedSpline.evaluate(knots[indexPoint1]);
            let point2Opt = optimizedSpline.evaluate(knots[indexPoint2]);
            let distance = point1Opt.distance(point2Opt);
            const signVariation = distance - refDistance;
            const sx = new BSpline_R1_to_R1(optimizedSpline.getControlPointsX(), optimizedSpline.knots);
            const sxu = sx.derivative();
            const sy = new BSpline_R1_to_R1(optimizedSpline.getControlPointsY(), optimizedSpline.knots);
            const syu = sy.derivative();
            let newAbsc = knots[indexPoint2];
            let iter = 0;

            while(Math.abs(distance - refDistance) > TOL_LOCATION_CURVE_REFERENCE_POINTS && iter < NB_MAX_ITER_SLIDING_CLAMPING_CONSTRAINT) {
                const c = Math.pow(distance, 2) - Math.pow(refDistance, 2);
                const point2dx = sxu.evaluate(newAbsc);
                const point2dy = syu.evaluate(newAbsc);
                const a = Math.pow(point2dx, 2) + Math.pow(point2dy, 2);
                let vectorP1P2 = point2Opt.substract(point1Opt);
                const bprime = point2dx * vectorP1P2.x + point2dy * vectorP1P2.y;
                const discriminant = Math.pow(bprime, 2) - a * c;
                const deltaU1 = (- bprime + Math.sqrt(discriminant)) / a;
                const deltaU2 = (- bprime - Math.sqrt(discriminant)) / a;
                const solPoint1 = optimizedSpline.evaluate(knots[indexPoint2 + deltaU1]);
                const solPoint2 = optimizedSpline.evaluate(knots[indexPoint2 + deltaU2]);
                const distance1 = point1Opt.distance(solPoint1);
                const distance2 = point1Opt.distance(solPoint2);
                if((distance - distance1) * signVariation > 0.0) {
                    if((distance - distance2) * signVariation < 0.0) {
                        newAbsc += deltaU1;
                    } else {
                        if(Math.abs(distance1 - refDistance) > Math.abs(distance2 - refDistance)) {
                            newAbsc += deltaU2;
                        } else {
                            newAbsc += deltaU1;
                        }
                    }
                } else {
                    if((distance - distance2) * signVariation < 0.0) {
                        const error = new ErrorLog(this.constructor.name, "slideConstraintAlongCurve", "No valid displacement solution to slide the constraint.");
                        error.logMessageToConsole();
                    } else {
                        newAbsc += deltaU2;
                    }
                }
                distance = point1Opt.distance(optimizedSpline.evaluate(newAbsc));
                point2Opt = optimizedSpline.evaluate(newAbsc);
                iter++;
            }
            if(iter < NB_MAX_ITER_SLIDING_CLAMPING_CONSTRAINT) {
                
            }
        }
    }

}