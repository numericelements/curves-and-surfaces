import { VectorInterface } from "../mathVector/VectorInterface";

export interface BSplineR1toRxInterface<T> {

    knots: number[];

    degree: number;

    controlPoints: T[];

    freeControlPoints: T[];

    evaluate(u: number): VectorInterface;

    clone(): BSplineR1toRxInterface<T>;

    optimizerStep(step: number[]): void;

    getControlPointsX(): number[];

    getControlPointsY(): number[];

    moveControlPoint(i: number, deltaX: number, deltaY: number): void;

    setControlPointPosition(index: number, value: T): void;

}