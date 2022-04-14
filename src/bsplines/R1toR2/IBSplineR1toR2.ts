import { Vector2d } from "../../mathVector/Vector2d"
import { BSplineR1toR2DifferentialPropertiesInterface } from "./BaseBSplineR1toR2DifferentialProperties"

export interface IBSplineR1toR2 {

    knots: number[]

    degree: number

    controlPoints: Vector2d[]

    freeControlPoints: Vector2d[]

    evaluate(u: number): Vector2d

    clone(): IBSplineR1toR2

    getControlPointsX(): number[]

    getControlPointsY(): number[]

    setControlPointPosition(index: number, value: Vector2d): IBSplineR1toR2

    moveControlPoint(index: number, delta: Vector2d): IBSplineR1toR2

    moveControlPoints(delta: Vector2d[]): IBSplineR1toR2

    getDifferentialProperties(): BSplineR1toR2DifferentialPropertiesInterface

}