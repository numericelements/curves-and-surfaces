import { IBSplineR1toR2 } from "../bsplines/R1toR2/IBSplineR1toR2";
import { IOptimizationProblem } from "../optimizers/IOptimizationProblem";

export interface IOpBSplineR1toR2 extends IOptimizationProblem {
    spline: IBSplineR1toR2
    setTargetSpline(spline: IBSplineR1toR2): void
    
}