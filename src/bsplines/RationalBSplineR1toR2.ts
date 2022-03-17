import { Vector2d } from "../mathVector/Vector2d"
import { Vector3d } from "../mathVector/Vector3d"
import { BSplineR1toR3 } from "./BSplineR1toR3"

export class RationalBSplineR1toR2 extends BSplineR1toR3 {

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector3d[] = [new Vector3d(0, 0, 1)], knots: number[] = [0, 1]) {
        super(controlPoints, knots)
    }

    evaluate(u: number) : Vector2d {
        let result = super.evaluate(u) as Vector3d
        return new Vector2d(result.x / result.z, result.y / result.z)
    }

    controlPoints2D() : Vector2d[] {
        let result: Vector2d[] = []
        for (let cp of this.controlPoints) {
            result.push(new Vector2d(cp.x, cp.y))
        }
        return result
    }

}