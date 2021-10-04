import { CurveModels2D } from "../models/CurveModels2D";

export interface ShapeSpaceDiffEvventsConfigurator {
    
    monitorCurveUsingDiffrentialEvents(curveModel: CurveModels2D): void;
}