import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { Vector2d } from "../mathVector/Vector2d"
import { Vector3d } from "../mathVector/Vector3d"
import { BSplineR1toR2Interface } from "./BSplineR1toR2Interface"
import { findSpan } from "./Piegl_Tiller_NURBS_Book";
import { RationalBSplineR1toR2 } from "./RationalBSplineR1toR2"


export class RationalBSplineR1toR2Adapter implements BSplineR1toR2Interface {


    private rationalBSplineR1toR2: RationalBSplineR1toR2;
    protected _controlPoints: Vector3d[];

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector3d[] = [new Vector3d(0, 0, 1)], knots: number[] = [0, 1]) {
        this._controlPoints = deepCopyControlPoints(controlPoints);
        this.rationalBSplineR1toR2 = new RationalBSplineR1toR2(this._controlPoints, knots);
    }

    // protected override factory(controlPoints: readonly Vector3d[] = [new Vector3d(0, 0)], knots: readonly number[] = [0, 1]) {
        protected factory(controlPoints: Vector3d[] = [new Vector3d(0, 0)], knots: number[] = [0, 1]): RationalBSplineR1toR2Adapter {
            return new RationalBSplineR1toR2Adapter(controlPoints, knots);
        }

    getControlPointsX(): number[] {
        let result: number[] = [];
        for (let cp of this.rationalBSplineR1toR2.controlPoints) {
            result.push(cp.x);
        }
        return result;
    }
    getControlPointsY(): number[] {
        let result: number[] = [];
        for (let cp of this.rationalBSplineR1toR2.controlPoints) {
            result.push(cp.y);
        }
        return result;
    }

    getDistinctKnots(): number[] {
        let result: number[] = [this.rationalBSplineR1toR2.knots[0]];
        let temp = result[0];
        for (let i = 1; i < this.rationalBSplineR1toR2.knots.length; i += 1) {
            if (this.rationalBSplineR1toR2.knots[i] !== temp) {
                result.push(this.rationalBSplineR1toR2.knots[i]);
                temp = this.rationalBSplineR1toR2.knots[i];
            }
        }
        return result;
    }

    grevilleAbscissae(): number[] {
        let result = [];
        for (let i = 0; i < this.rationalBSplineR1toR2.controlPoints.length; i += 1) {
            let sum = 0;
            for (let j = i + 1; j < i + this.rationalBSplineR1toR2.degree + 1; j += 1) {
                sum += this.rationalBSplineR1toR2.knots[j];
            }
            result.push(sum / this.rationalBSplineR1toR2.degree);
        }
        return result;
    }

    knotMultiplicity(indexFromFindSpan: number): number {
        let result: number = 0;
        let i = 0;
        while (this.rationalBSplineR1toR2.knots[indexFromFindSpan + i] === this.rationalBSplineR1toR2.knots[indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    }

    insertKnot(u: number, times: number = 1): void {
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0) {
            return;
        }
        
        let index = findSpan(u, this.rationalBSplineR1toR2.knots, this.rationalBSplineR1toR2.degree);
        let multiplicity = 0;

        if (u === this.rationalBSplineR1toR2.knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }

        for (let t = 0; t < times; t += 1) {
            let newControlPoints = [];
            for (let i = 0; i < index - this.rationalBSplineR1toR2.degree + 1; i += 1) {
                newControlPoints[i] = this.rationalBSplineR1toR2.controlPoints[i];
            }
            for (let i = index - this.rationalBSplineR1toR2.degree + 1; i <= index - multiplicity; i += 1) {
                let alpha = (u - this.rationalBSplineR1toR2.knots[i]) / (this.rationalBSplineR1toR2.knots[i + this.rationalBSplineR1toR2.degree] - this.rationalBSplineR1toR2.knots[i]);
                newControlPoints[i] = (this.rationalBSplineR1toR2.controlPoints[i - 1].multiply(1 - alpha)).add(this.rationalBSplineR1toR2.controlPoints[i].multiply(alpha));
            }
            for (let i = index - multiplicity; i < this.rationalBSplineR1toR2.controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this.rationalBSplineR1toR2.controlPoints[i];
            }
            this.rationalBSplineR1toR2.knots.splice(index + 1, 0, u);
            this.rationalBSplineR1toR2.controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }

    }

    moveControlPoint(i: number, deltaX: number, deltaY: number): void {
        if (i < 0 || i >= this.rationalBSplineR1toR2.controlPoints.length - this.rationalBSplineR1toR2.degree) {
            throw new Error("Control point indentifier is out of range");
        }
        this.rationalBSplineR1toR2.controlPoints[i].x += deltaX;
        this.rationalBSplineR1toR2.controlPoints[i].y += deltaY;
    }

    moveControlPoints(delta: Vector2d[]): RationalBSplineR1toR2Adapter {
        const n = this._controlPoints.length;
        if (delta.length !== n) {
            throw new Error("Array of unexpected dimension");
        }
        let controlPoints = this._controlPoints;
        // JCL method to be updated for rational BSplines
        // for (let i = 0; i < n; i += 1) {
        //     controlPoints[i] = controlPoints[i].add(delta[i]);
        // }
        return this.factory(controlPoints, this.knots);
    }

    setControlPointPosition(index: number, value: Vector2d): void {
        
    }

    get degree(): number {
        return this.rationalBSplineR1toR2.degree;
    }

    get knots(): number[] {
        return this.rationalBSplineR1toR2.knots;
    }

    get controlPoints(): Vector2d[] {
        return this.rationalBSplineR1toR2.controlPoints2D();
    }

    get freeControlPoints(): Vector2d[] {
        return this.rationalBSplineR1toR2.controlPoints2D();
    }

    clone(): BSplineR1toR2Interface {
        return new RationalBSplineR1toR2Adapter(this.rationalBSplineR1toR2.controlPoints, this.rationalBSplineR1toR2.knots);
    }

    evaluate(u: number) : Vector2d {
        return this.rationalBSplineR1toR2.evaluate(u);
    }

    optimizerStep(step: number[]): void {
        
    }

    elevateDegree(times: number): void {
        // JCL method to be implemented
        const error = new ErrorLog(this.constructor.name, "elevateDegree", "method not yet implemented !");
        error.logMessage();
    }

    degreeIncrement(): BSplineR1toR2Interface {
        // JCL method to be implemented
        const error = new ErrorLog(this.constructor.name, "degreeIncrement", "method not yet implemented !");
        error.logMessage();
        return new RationalBSplineR1toR2Adapter();
    }

    scale(factor: number) {
        let cp: Array<Vector3d> = []
        // need to double check this transformation before using this method
        this._controlPoints.forEach(element => {
            cp.push(element.multiply(factor))
        });
        return new RationalBSplineR1toR2Adapter(cp, this.knots.slice())
    }

    scaleY(factor: number) {
        let cp: Array<Vector3d> = []
        // need to double check the component element.z before using this method
        this._controlPoints.forEach(element => {
            cp.push(new Vector3d(element.x, element.y * factor, element.z))
        });
        return new RationalBSplineR1toR2Adapter(cp, this.knots.slice())
    }

    scaleX(factor: number) {
        let cp: Array<Vector3d> = []
        // need to double check the component element.z before using this method
        this._controlPoints.forEach(element => {
            cp.push(new Vector3d(element.x * factor, element.y, element.z))
        });
        return new RationalBSplineR1toR2Adapter(cp, this.knots.slice())
    }

    evaluateOutsideRefInterval(u: number): Vector2d {
        let result = new Vector2d();
        const knots = this.getDistinctKnots();
        if(u >= knots[0] && u <= knots[knots.length - 1]) {
            const error = new ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Parameter value for evaluation is not outside the knot interval.");
            error.logMessage();
        } else {
            const error = new ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Method not implemented yet.");
            error.logMessage();
        }
        return result;
    }

    // to be checked for adequate usage
    flattenControlPointsArray(): number[] {
        const controlPointsArray: number[][] = [];
        for(let i = 0; i < this.controlPoints.length; i++) {
            controlPointsArray.push([this.controlPoints[i].x, this.controlPoints[i].y])
        }
        return controlPointsArray.reduce(function (acc, val) {
            return acc.concat(val);
        }, [])
    }
}

export function deepCopyControlPoints(controlPoints: Vector3d[]): Vector3d[] {
    let result: Vector3d[] = [];
    for (let cp of controlPoints) {
        result.push(cp.clone());
    }
    return result;
}