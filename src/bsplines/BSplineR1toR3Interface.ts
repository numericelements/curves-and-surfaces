import { Vector3d } from "../mathVector/Vector3d"

export interface BSplineR1toR3Interface {

    knots: number[]

    degree: number

    controlPoints: Vector3d[]

    freeControlPoints: Vector3d[]

    evaluate(u: number): Vector3d

    clone(): BSplineR1toR3Interface

    optimizerStep(step: number[]): void

    getControlPointsX(): number[]

    getControlPointsY(): number[]

    getControlPointsZ(): number[]

    getDistinctKnots(): number[]

    moveControlPoint(i: number, deltaX: number, deltaY: number, deltaZ: number): void

    setControlPointPosition(index: number, value: Vector3d): void

}