import { Vector2d } from "../mathVector/Vector2d"
import { Vector3d } from "../mathVector/Vector3d"
import { BSplineR1toR3 } from "./BSplineR1toR3"
import { RationalBSplineR1toR2Adapter } from "./RationalBSplineR1toR2Adapter"

export class RationalBSplineR1toR2 {

    private spline: BSplineR1toR3

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector3d[] = [new Vector3d(0, 0, 1)], knots: number[] = [0, 1]) {
        this.spline = new BSplineR1toR3(controlPoints, knots)
    }

    get knots() : number[] {
        return this.spline.knots
    }

    set knots(knots: number[]) {
        this.spline.knots = [...knots]
    }

    get degree() : number {
        return this.spline.degree
    }

    get controlPoints(): Vector3d[] {
        return this.spline.controlPoints
    }

    get freeControlPoints(): Vector3d[] {
        return this.spline.freeControlPoints
    }

    set controlPoints(controlPoints: Vector3d[]) {
        this.spline.controlPoints = controlPoints
    }

    evaluate(u: number) : Vector2d {
        let result = this.spline.evaluate(u) as Vector3d
        return new Vector2d(result.x / result.z, result.y / result.z)
    }

    controlPoints2D() : Vector2d[] {
        let result: Vector2d[] = []
        for (let cp of this.spline.controlPoints) {
            result.push(new Vector2d(cp.x / cp.z, cp.y / cp.z))
        }
        return result
    }

    clone(): RationalBSplineR1toR2 {
        return new RationalBSplineR1toR2(this.spline.controlPoints, this.spline.knots)
    }

    insertKnot(u: number, times: number = 1)  {
        this.spline.insertKnot(u, times)
    }

    optimizerStep(step: number[]) {
        this.spline.optimizerStep(step)
    }

    extract(fromU: number, toU: number) {
        return this.spline.extract(fromU, toU)
    }

    getControlPointsX() {
        return this.spline.getControlPointsX()
    }

    getControlPointsY() {
        return this.spline.getControlPointsY()
    }

    getControlPointsW() {
        return this.spline.getControlPointsZ()
    }

    setControlPointPosition(index: number, value: Vector3d) {
        this.spline.setControlPointPosition(index, value)
    }

    setControlPointWeight(controlPointIndex: number, w: number) {
        const x = this.controlPoints[controlPointIndex].x
        const y = this.controlPoints[controlPointIndex].y
        const z = this.controlPoints[controlPointIndex].z
        this.setControlPointPosition(controlPointIndex, new Vector3d(x * w / z, y * w / z, w))
    }

    getControlPointWeight(controlPointIndex: number) {
        return this.controlPoints[controlPointIndex].z
    }

    distinctKnots() {
        let result = [this.knots[0]]
        let temp = result[0]
        for (let i = 1; i < this.knots.length; i += 1) {
            if (this.knots[i] !== temp) {
                result.push(this.knots[i]);
                temp = this.knots[i];
            }
        }
        return result;
    }

    getSplineAdapter(): RationalBSplineR1toR2Adapter {
        return new RationalBSplineR1toR2Adapter(this.controlPoints, this.knots)
    }

    grevilleAbscissae() {
        let result = []
        for (let i = 0; i < this.spline.controlPoints.length; i += 1) {
            let sum = 0
            for (let j = i + 1; j < i + this.spline.degree + 1; j += 1) {
                sum += this.spline.knots[j]
            }
            result.push(sum / this.spline.degree)
        }
        return result
    }

}

export function create_RationalBSplineR1toR2(controlPoints: number[][], knots: number[]){
    let newControlPoints: Vector3d[] = []
    for (let cp of controlPoints) {
        newControlPoints.push(new Vector3d(cp[0], cp[1], cp[2]))
    }
    return new RationalBSplineR1toR2(newControlPoints, knots)
}