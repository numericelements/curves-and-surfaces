import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR1Interface } from "./BSplineR1toR1Interface";

export interface BSplineR1toR2DifferentialPropertiesInterface {

    // knots: number[];

    // degree: number;

    // controlPoints: Vector2d[];

    // freeControlPoints: Vector2d[];

    curvatureNumerator(): BSplineR1toR1Interface;

    curvatureDerivativeNumerator(): BSplineR1toR1Interface;

}