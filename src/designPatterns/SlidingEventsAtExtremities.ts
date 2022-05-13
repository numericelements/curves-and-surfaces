import { OpenCurveAnalyzer } from "../curveShapeSpaceAnalysis/CurveAnalyzer";

export interface SlidingEventsAtExtremities {
    getCurvatureCrtlPtsClosestToZero(curveAnalyzer: OpenCurveAnalyzer): void;
    getCurvatureDerivCrtlPtsClosestToZero(curveAnalyzer: OpenCurveAnalyzer): void;
}