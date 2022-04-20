
import { CurveModelInterface } from "../newModels/CurveModelInterface";


export interface CurveControlStrategyInterface  {

    toggleControlOfCurvatureExtrema(): void 
    toggleControlOfInflections(): void
    toggleSliding(): void

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number): void
    resetCurve(curveModel: CurveModelInterface): void
    
}