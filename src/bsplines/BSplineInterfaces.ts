import { Vector2d } from "../mathematics/Vector2d";

export interface BSplineR1toR2Interface {

    visibleControlPoints(): Vector2d[]

    knots: number[]

    degree: number

    evaluate(u: number): Vector2d
}