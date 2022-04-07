import { BSplineR1toR3Interface } from "../bsplines/BSplineR1toR3Interface";
import { OptimizationProblemInterface } from "../optimizers/OptimizationProblemInterface";

export interface OptimizationProblemBSplineR1toR3Interface extends OptimizationProblemInterface {
    spline: BSplineR1toR3Interface
    setTargetSpline(spline: BSplineR1toR3Interface): void
}