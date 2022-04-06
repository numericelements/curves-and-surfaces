import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";

export class CurveShapeSpaceDescriptor {

    public inflectionsTotalNumberOfConstraints: number;
    public curvatureExtremaTotalNumberOfConstraints: number;
    public curvatureExtremumMonitoringAtCurveExtremities: number[] = [];
    public inflectionMonitoringAtCurveExtremities: number[] = [];

    constructor(curveToAnalyze: BSplineR1toR2Interface) {
        // JCL a finaliser avec le nb correct de contraintes
        this.inflectionsTotalNumberOfConstraints = curveToAnalyze.degree;
        this.curvatureExtremaTotalNumberOfConstraints = curveToAnalyze.degree;
    }
}