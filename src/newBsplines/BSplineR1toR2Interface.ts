import { Vector2d } from "../mathVector/Vector2d";

export interface BSplineR1toR2Interface {

    knots: number[];

    degree: number;

    controlPoints: Vector2d[];

    freeControlPoints: Vector2d[];

    evaluate(u: number): Vector2d;

    evaluateOutsideRefInterval(u: number): Vector2d;

    clone(): BSplineR1toR2Interface;

    optimizerStep(step: number[]): void;

    getControlPointsX(): number[];

    getControlPointsY(): number[];
    
    getDistinctKnots(): number[];

    grevilleAbscissae(): number[];

    insertKnot(u: number, times: number): void

    moveControlPoint(i: number, deltaX: number, deltaY: number): void;

    setControlPointPosition(index: number, value: Vector2d): void;

    elevateDegree(times: number): void;

    scale(factor: number): BSplineR1toR2Interface;

    scaleX(factor: number): BSplineR1toR2Interface;

    scaleY(factor: number): BSplineR1toR2Interface;

    degreeIncrement(): BSplineR1toR2Interface;

    moveControlPoints(delta: Vector2d[]): BSplineR1toR2Interface;

}