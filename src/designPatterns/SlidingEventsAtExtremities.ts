import { CurveAnalyzer } from "../curveShapeSpaceAnalysis/CurveAnalyzer";

export interface SlidingEventsAtExtremities {
    getCurvatureCrtlPtsClosestToZero(curveAnalyzer: CurveAnalyzer): void;
    getCurvatureDerivCrtlPtsClosestToZero(curveAnalyzer: CurveAnalyzer): void;
}