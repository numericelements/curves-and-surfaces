import { BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";

export class CurveShapeSpaceDescriptor {

    public inflectionsTotalNumberOfConstraints: number;
    public curvatureExtremaTotalNumberOfConstraints: number;
    public curvatureExtremumMonitoringAtCurveExtremities: number[] = [];
    public inflectionMonitoringAtCurveExtremities: number[] = [];

    constructor(curveToAnalyze: BSpline_R1_to_R2) {
        // JCL a finaliser avec le nb correct de contraintes
        this.inflectionsTotalNumberOfConstraints = curveToAnalyze.degree;
        this.curvatureExtremaTotalNumberOfConstraints = curveToAnalyze.degree;
    }
}