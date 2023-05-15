
import { OptProblemBSplineR1toR2 } from "../bsplineOptimizationProblems/OptProblemBSplineR1toR2";
import { Optimizer } from "../mathematics/Optimizer";
import { CurveModelInterface } from "../newModels/CurveModelInterface";


export interface CurveControlStrategyInterface  {

    optimizer: Optimizer;
    optimizationProblem: OptProblemBSplineR1toR2;

    // toggleControlOfCurvatureExtrema(): void 
    // toggleControlOfInflections(): void
    // toggleSliding(): void

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number): void
    resetCurve(curveModel: CurveModelInterface): void
    
}