
import { CurveModel } from "../newModels/CurveModel";


export interface CurveControlStrategyInterface  {

    toggleControlOfCurvatureExtrema(): void 
    toggleControlOfInflections(): void
    toggleSliding(): void

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number): void
    resetCurve(curveModel: CurveModel): void
    
}