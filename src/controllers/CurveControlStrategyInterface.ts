
import { OptimizationProblem_BSpline_R1_to_R2 } from "../bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2";
import { Optimizer } from "../mathematics/Optimizer";
import { CurveModelInterface } from "../newModels/CurveModelInterface";


export interface CurveControlStrategyInterface  {

    optimizer: Optimizer;
    optimizationProblem: OptimizationProblem_BSpline_R1_to_R2;

    // toggleControlOfCurvatureExtrema(): void 
    // toggleControlOfInflections(): void
    // toggleSliding(): void

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number): void
    resetCurve(curveModel: CurveModelInterface): void
    
}