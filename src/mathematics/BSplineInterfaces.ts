import { Vector_2d } from "./Vector_2d";

export interface BSpline_R1_to_R2_interface {

    visibleControlPoints(): Vector_2d[]

    knots: number[]

    degree: number

    evaluate(u: number): Vector_2d
}