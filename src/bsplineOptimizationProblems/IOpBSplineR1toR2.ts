import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { OptimizationProblemInterface } from "../optimizationProblemFacade/OptimizationProblemInterface";

export interface OpBSplineR1toR2Interface extends OptimizationProblemInterface {
    spline: BSplineR1toR2Interface
    setTargetSpline(spline: BSplineR1toR2Interface): void
    
}