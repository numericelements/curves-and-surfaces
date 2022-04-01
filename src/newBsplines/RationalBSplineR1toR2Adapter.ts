import { Vector2d } from "../mathVector/Vector2d"
import { Vector3d } from "../mathVector/Vector3d"
import { BSplineR1toR2Interface } from "./BSplineR1toR2Interface"
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