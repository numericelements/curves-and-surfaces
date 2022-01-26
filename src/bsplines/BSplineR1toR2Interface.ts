import { Vector2d } from "../mathVector/Vector2d";
import { AbstractBSplineR1toR2 } from "./AbstractBSplineR1toR2";

export interface BSplineR1toR2Interface {

    knots: number[]

    degree: number

    controlPoints: Vector2d[]

    freeControlPoints: Vector2d[]

    evaluate(u: number): Vector2d

    clone(): BSplineR1toR2Interface

    optimizerStep(step: number[]): void

    getControlPointsX(): number[]

    getControlPointsY(): number[]

}