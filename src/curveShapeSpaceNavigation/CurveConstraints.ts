import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { CurveConstraintInterface } from "../designPatterns/CurveConstraintInterface";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveConstraintNoConstraint, TOL_LOCATION_CURVE_REFERENCE_POINTS } from "./CurveConstraintStrategy";
import { NO_CONSTRAINT, ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { PeriodicBSplineR1toR2withOpenKnotSequence } from "../newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence";
import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { cpuUsage } from "process";
import { curveSegment } from "../newBsplines/AbstractBSplineR1toR2";

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

    slideConstraintAlongCurve(): boolean {
        let valid = true;
        const indexPoint1 = this._shapeNavigableCurve.clampedPoints[0];
        const indexPoint2 = this._shapeNavigableCurve.clampedPoints[1];
        if(indexPoint1 === NO_CONSTRAINT || indexPoint2 === NO_CONSTRAINT) {
            const error = new ErrorLog(this.constructor.name, "slideConstraintAlongCurve", "Configuration with only one clamped point: cannot be processed.");
            error.logMessageToConsole();
        } else {
            const knots = this._curveConstraintStrategy.optimizedCurve.getDistinctKnots();
            let optimizedSpline = this._curveConstraintStrategy.optimizedCurve;
            const newAbscRefPt2 = this.computeAbscissae(indexPoint1, indexPoint2);
            const deltaU2 = Math.abs(newAbscRefPt2.abscissa - knots[indexPoint2]);
            console.log('newAbsc2 '+ newAbscRefPt2.abscissa + ' iter '+newAbscRefPt2.nbIter+' delatU2 '+deltaU2);

            const newAbscRefPt1 = this.computeAbscissae(indexPoint2, indexPoint1);
            const deltaU1 = Math.abs(newAbscRefPt1.abscissa - knots[indexPoint1]);
            console.log('newAbsc1 '+ newAbscRefPt1.abscissa + ' iter '+newAbscRefPt1.nbIter+' delatU1 '+deltaU1);
            let newAbsc;
            let segment: curveSegment | undefined;
            if(newAbscRefPt1.nbIter < NB_MAX_ITER_SLIDING_CLAMPING_CONSTRAINT && newAbscRefPt2.nbIter < NB_MAX_ITER_SLIDING_CLAMPING_CONSTRAINT
                && newAbscRefPt1.nbIter !== -1 && newAbscRefPt2.nbIter !== -1) {
                if(deltaU1 > deltaU2) {
                    newAbsc = newAbscRefPt2.abscissa;
                    if(indexPoint1 < indexPoint2) {
                        segment = curveSegment.BEFORE;
                    } else {
                        segment = curveSegment.AFTER;
                    }
                } else {
                    newAbsc = newAbscRefPt1.abscissa;
                    if(indexPoint1 < indexPoint2) {
                        segment = curveSegment.AFTER;
                    } else {
                        segment = curveSegment.BEFORE;
                    }
                }
            } else if(newAbscRefPt1.nbIter < NB_MAX_ITER_SLIDING_CLAMPING_CONSTRAINT && newAbscRefPt1.nbIter !== -1) {
                newAbsc = newAbscRefPt1.abscissa;
                if(indexPoint1 < indexPoint2) {
                    segment = curveSegment.AFTER;
                } else {
                    segment = curveSegment.BEFORE;
                }
            } else if(newAbscRefPt2.nbIter < NB_MAX_ITER_SLIDING_CLAMPING_CONSTRAINT && newAbscRefPt2.nbIter !== -1) {
                newAbsc = newAbscRefPt2.abscissa;
                if(indexPoint1 < indexPoint2) {
                    segment = curveSegment.BEFORE;
                } else {
                    segment = curveSegment.AFTER;
                }
            } else {
                // There is no solution of point location to satisfy the constraint
                valid = false;
                console.log("newAbsc = "+newAbsc);
            }
            for(let i = 0; i < optimizedSpline.degree+1; i++) {
                if(optimizedSpline.knots[i] !== 0.0) {
                    console.log("Inconsistent knot sequence")
                }
            }
            if(newAbsc !== undefined && valid) {
                if(optimizedSpline instanceof BSplineR1toR2) {
                    if(newAbsc > knots[knots.length - 1] || newAbsc < knots[0]){
                        // console.log("extend curve to: "+newAbsc);
                        optimizedSpline = optimizedSpline.extend(newAbsc);
                    } else if(newAbsc < knots[knots.length - 1] && newAbsc > knots[0]) {
                        console.log("split curve at: "+newAbsc+" segment = "+segment);
                        if(segment !== undefined) optimizedSpline = optimizedSpline.splitAt(newAbsc, segment);
                    }
                    this._curveConstraintStrategy.optimizedCurve = optimizedSpline;
                    for(let i = 0; i < optimizedSpline.degree+1; i++) {
                        if(optimizedSpline.knots[i] !== 0.0) {
                            console.log("Inconsistent knot sequence")
                        }
                    }
                } else if(this._curveConstraintStrategy.optimizedCurve instanceof PeriodicBSplineR1toR2withOpenKnotSequence) {
    
                }
            } else {
                this._curveConstraintStrategy.optimizedCurve = this._curveConstraintStrategy.currentCurve;
            }
        }
        return valid;
    }

    computeAbscissae(indexPoint1: number, indexPoint2: number): {abscissa: number, nbIter: number} {
        const spline = this._curveConstraintStrategy.currentCurve;
        let optimizedSpline = this._curveConstraintStrategy.optimizedCurve;
        const knots = spline.getDistinctKnots();
        const point1 = spline.evaluate(knots[indexPoint1]);
        const point2 = spline.evaluate(knots[indexPoint2]);
        const refDistance = point1.distance(point2);
        let knotsOptCrv = optimizedSpline.getDistinctKnots();
        const point1Opt = optimizedSpline.evaluate(knotsOptCrv[indexPoint1]);
        let point2Opt = optimizedSpline.evaluate(knotsOptCrv[indexPoint2]);
        let distance = point1Opt.distance(point2Opt);
        let sx = new BSplineR1toR1(optimizedSpline.getControlPointsX(), optimizedSpline.knots);
        let sxu = sx.derivative();
        let sy = new BSplineR1toR1(optimizedSpline.getControlPointsY(), optimizedSpline.knots);
        let syu = sy.derivative();
        let newAbsc = knotsOptCrv[indexPoint2];
        let iter = 0;
        let solution1 = false;
        let solution2 = false;
        let iterOutside = 0;
        let minVariationDistance = 0;
        let maxVariationDistance = 0;
        let minVariationAbscissa = 0;
        let maxVariationAbscissa = 0;
        let offset = 0.0;
        if(knotsOptCrv[0] !== 0.0) {
            const error = new ErrorLog(this.constructor.name, "computeAbscissae", "Inconsistent knot sequence. First knot is not 0.0");
            error.logMessageToConsole();
        }
        
        while(Math.abs(distance - refDistance) > TOL_LOCATION_CURVE_REFERENCE_POINTS && iter < NB_MAX_ITER_SLIDING_CLAMPING_CONSTRAINT) {
            const c = Math.pow(distance, 2) - Math.pow(refDistance, 2);
            const point2dx = sxu.evaluate(newAbsc);
            const point2dy = syu.evaluate(newAbsc);
            const a = Math.pow(point2dx, 2) + Math.pow(point2dy, 2);
            point2Opt = optimizedSpline.evaluate(newAbsc);
            let vectorP1P2 = point2Opt.substract(point1Opt);
            const bprime = point2dx * vectorP1P2.x + point2dy * vectorP1P2.y;
            const discriminant = Math.pow(bprime, 2) - a * c;
            let deltaU1 = 0.0;
            let deltaU2 = 0.0;
            if(discriminant >= 0.0) {
                deltaU1 = (- bprime + Math.sqrt(discriminant)) / a;
                deltaU2 = (- bprime - Math.sqrt(discriminant)) / a;
            } else {
                iter = -1;
                break;
            }
            let solPoint1, solPoint2;
            const u1 = knotsOptCrv[indexPoint2] + deltaU1;
            if(u1 < knotsOptCrv[0] || u1 > knotsOptCrv[knotsOptCrv.length - 1]) {
                solPoint1 = optimizedSpline.evaluateOutsideRefInterval(u1);
            } else {
                solPoint1 = optimizedSpline.evaluate(u1);
            }
            const u2 = knotsOptCrv[indexPoint2] + deltaU2;
            if(u2 < knotsOptCrv[0] || u2 > knotsOptCrv[knotsOptCrv.length - 1]) {
                solPoint2 = optimizedSpline.evaluateOutsideRefInterval(u2);
            } else {
                solPoint2 = optimizedSpline.evaluate(u2);
            }
            const distance1 = point1Opt.distance(solPoint1);
            const distance2 = point1Opt.distance(solPoint2);
            if(iter === 0) {
                if(Math.abs(distance1 - refDistance) > Math.abs(distance2 - refDistance)) {
                    solution2 = true;
                    newAbsc = u2;
                } else {
                    solution1 = true;
                    newAbsc = u1;
                }
            } else {
                if(solution1) newAbsc = u1;
                if(solution2) newAbsc = u2;
            }

            if(newAbsc < knotsOptCrv[0] || newAbsc > knotsOptCrv[knotsOptCrv.length - 1]) {
                iterOutside++;
                // console.log(' newAbsc outside interval. redefine curve');
                if(optimizedSpline instanceof BSplineR1toR2) {
                    let tempSpline = optimizedSpline.extend(newAbsc);
                    if(newAbsc < knotsOptCrv[0]) {
                        offset = offset - newAbsc;
                        minVariationAbscissa = 0.0;
                        newAbsc = 0.0;
                    } else {
                        // console.log("extend curve at right extremity u = "+newAbsc);
                    }
                    optimizedSpline = new BSplineR1toR2(tempSpline.controlPoints, tempSpline.knots);
                    sx = new BSplineR1toR1(optimizedSpline.getControlPointsX(), optimizedSpline.knots);
                    sxu = sx.derivative();
                    sy = new BSplineR1toR1(optimizedSpline.getControlPointsY(), optimizedSpline.knots);
                    syu = sy.derivative();
                    // console.log(' ctrlPts'+JSON.stringify(optimizedSpline.controlPoints)+' knots '+optimizedSpline.knots);
                } else if(this._curveConstraintStrategy.optimizedCurve instanceof PeriodicBSplineR1toR2withOpenKnotSequence) {
                    const error = new ErrorLog(this.constructor.name, "computeAbscissae", "something to do there");
                    error.logMessageToConsole();
                }
            }
            point2Opt = optimizedSpline.evaluate(newAbsc);
            distance = point1Opt.distance(point2Opt);
            // console.log('newAbsc '+ newAbsc+ ' u1 '+sol1+' u2 '+sol2+ ' dist1 '+distance1+' dist2 '+distance2+' distance '+distance+' iter '+iter);
            if((distance - refDistance) > 0.0 && (distance - refDistance) > maxVariationDistance) {
                maxVariationDistance = distance - refDistance;
            } else if((distance - refDistance) < 0.0 && (distance - refDistance) < minVariationDistance) {
                minVariationDistance = distance - refDistance;
            }
            if((newAbsc - offset) > 0.0 && (newAbsc - offset) > maxVariationAbscissa) {
                maxVariationAbscissa = newAbsc - offset;
            } else if((newAbsc - offset) < 0.0 && (newAbsc - offset) < minVariationAbscissa) {
                minVariationAbscissa = newAbsc - offset;
            }
            iter++;
        }
        if(iter === NB_MAX_ITER_SLIDING_CLAMPING_CONSTRAINT) {
            if(iterOutside >= (NB_MAX_ITER_SLIDING_CLAMPING_CONSTRAINT / 2) - 1) {
                // console.log('Nb Iter Outside = '+iterOutside+' maxVariation = '+ maxVariationDistance+' minVariation = '+minVariationDistance);
                let newAbscRef = this.solveWithLinearApproximation(indexPoint1, indexPoint2, minVariationAbscissa, maxVariationAbscissa, optimizedSpline, offset);
                if(newAbscRef.nbIter < NB_MAX_ITER_SLIDING_CLAMPING_CONSTRAINT) {
                    iter = 1;
                    newAbsc = newAbscRef.abscissa;
                }
                // console.log('Found newAbsc = '+newAbscRef.abscissa+' NbIter = '+ newAbscRef.nbIter);
            } else 
                console.log('Nb Iter Outside = '+iterOutside);
        } else if(iter === -1) {
            console.log('NO SOLUTION');
        }
        return {
            abscissa: newAbsc - offset,
            nbIter: iter
        };
    }

    solveWithLinearApproximation(indexPoint1: number, indexPoint2: number, minVariationAbscissa: number, maxVariationAbscissa: number,
        optimizedSplineInit: BSplineR1toR2Interface, offset: number): {abscissa: number, nbIter: number} {
        const spline = this._curveConstraintStrategy.currentCurve;
        let optimizedSpline = optimizedSplineInit.clone();
        let knots = spline.getDistinctKnots();
        const point1 = spline.evaluate(knots[indexPoint1]);
        const point2 = spline.evaluate(knots[indexPoint2]);
        const refDistance = point1.distance(point2);
        let knotsOpt = optimizedSpline.getDistinctKnots();
        const point1Opt = optimizedSpline.evaluate(knotsOpt[indexPoint1]);
        let umin = offset + minVariationAbscissa;
        let uMax = offset + maxVariationAbscissa;
        // if(umin < 0.0) {
        //     console.log("umin = "+umin+" uMax = "+uMax);
        // }
        let point2Opt1 = optimizedSpline.evaluate(offset + minVariationAbscissa);
        let distance1 = point1Opt.distance(point2Opt1);
        let point2Opt2 = optimizedSpline.evaluate(offset + maxVariationAbscissa);
        let distance2 = point1Opt.distance(point2Opt2);
        let u = offset;
        let iter = 0;

        if((distance1 - refDistance) * (distance2 - refDistance) < 0.0) {
            let distance = distance1;
            while(Math.abs(distance - refDistance) > TOL_LOCATION_CURVE_REFERENCE_POINTS && iter < NB_MAX_ITER_SLIDING_CLAMPING_CONSTRAINT) {

                u = offset + maxVariationAbscissa - ((distance2 - refDistance) / (distance2 - distance1)) * (maxVariationAbscissa - minVariationAbscissa);
                distance = point1Opt.distance(optimizedSpline.evaluate(u));
                if((distance - refDistance) > 0.0) {
                    if((distance1 - refDistance) > 0.0) {
                        distance1 = distance;
                        minVariationAbscissa = u - offset;
                    } else {
                        distance2 = distance;
                        maxVariationAbscissa = u - offset;
                    }
                } else {
                    if((distance1 - refDistance) > 0.0) {
                        distance2 = distance;
                        maxVariationAbscissa = u - offset;
                    } else {
                        distance1 = distance;
                        minVariationAbscissa = u - offset;
                    }
                }
                umin = offset + minVariationAbscissa;
                uMax = offset + maxVariationAbscissa;
                // console.log("umin = "+umin+" u = "+u+"uMax = "+uMax);
                iter++;
            }
        } else {
            const error = new ErrorLog(this.constructor.name, "solveWithLinearApproximation", "Cannot process robustly this configuration.");
            error.logMessageToConsole();
        }
        return {
            abscissa: u,
            nbIter: iter
        };
    }

}