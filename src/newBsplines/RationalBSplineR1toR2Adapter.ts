import { Vector2d } from "../mathVector/Vector2d"
import { Vector3d } from "../mathVector/Vector3d"
import { BSplineR1toR2Interface } from "./BSplineR1toR2Interface"
import { findSpan } from "./Piegl_Tiller_NURBS_Book";
import { RationalBSplineR1toR2 } from "./RationalBSplineR1toR2"


export class RationalBSplineR1toR2Adapter implements BSplineR1toR2Interface {


    private rationalBSplineR1toR2: RationalBSplineR1toR2;

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector3d[] = [new Vector3d(0, 0, 1)], knots: number[] = [0, 1]) {
        this.rationalBSplineR1toR2 = new RationalBSplineR1toR2(controlPoints, knots);
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

}