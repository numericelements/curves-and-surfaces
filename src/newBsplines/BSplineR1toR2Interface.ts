import { Vector2d } from "../mathVector/Vector2d";

export interface BSplineR1toR2Interface {

    knots: number[];

    degree: number;

    controlPoints: Vector2d[];

    freeControlPoints: Vector2d[];

    evaluate(u: number): Vector2d;

    clone(): BSplineR1toR2Interface;

    optimizerStep(step: number[]): void;

    getControlPointsX(): number[];

    getControlPointsY(): number[];

    moveControlPoint(i: number, deltaX: number, deltaY: number): void;

    setControlPointPosition(index: number, value: Vector2d): void;

}