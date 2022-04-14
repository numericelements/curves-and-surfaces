import { BSplineR1toR3Interface } from "../bsplines/R1toR3/BSplineR1toR3Interface";
import { IOptimizationProblem } from "../optimizers/IOptimizationProblem";

export interface IOpBSplineR1toR3Interface extends IOptimizationProblem {
    spline: BSplineR1toR3Interface
    setTargetSpline(spline: BSplineR1toR3Interface): void
}