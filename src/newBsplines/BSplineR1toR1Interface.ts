import { BernsteinDecompositionR1toR1 } from "./BernsteinDecompositionR1toR1";

export interface BSplineR1toR1Interface {

    knots: number[];

    degree: number;

    controlPoints: number[];

    evaluate(u: number): number;

    clone(): BSplineR1toR1Interface;

    derivative(): BSplineR1toR1Interface;

    bernsteinDecomposition(): BernsteinDecompositionR1toR1;

    zeros(): number[];

    getExtremumClosestToZero(): {location: number, value: number};

}