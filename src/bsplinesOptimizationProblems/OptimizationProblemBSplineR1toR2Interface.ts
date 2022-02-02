import { BSplineR1toR2Interface } from "../bsplines/BSplineR1toR2Interface";
import { OptimizationProblemInterface } from "./OptimizationProblemInterface";

export interface OptimizationProblemBSplineR1toR2Interface extends OptimizationProblemInterface {
    spline: BSplineR1toR2Interface
    setTargetSpline(spline: BSplineR1toR2Interface): void
    
}