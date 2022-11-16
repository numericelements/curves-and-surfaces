import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";

export class CurveShapeSpaceDescriptor {

    private _inflectionsTotalNumberOfConstraints: number;
    private _curvatureExtremaTotalNumberOfConstraints: number;
    private _curvatureExtremumMonitoringAtCurveExtremities: number[];
    private _inflectionMonitoringAtCurveExtremities: number[];

    constructor(curveToAnalyze: BSplineR1toR2Interface) {
        // JCL a finaliser avec le nb correct de contraintes
        this._inflectionsTotalNumberOfConstraints = curveToAnalyze.degree;
        this._curvatureExtremaTotalNumberOfConstraints = curveToAnalyze.degree;
        this._curvatureExtremumMonitoringAtCurveExtremities = [];
        this._inflectionMonitoringAtCurveExtremities = [];
    }

    get inflectionsTotalNumberOfConstraints(): number {
        return this._inflectionsTotalNumberOfConstraints;
    }

    get curvatureExtremaTotalNumberOfConstraints(): number {
        return this._curvatureExtremaTotalNumberOfConstraints;
    }

    get curvatureExtremumMonitoringAtCurveExtremities(): number[] {
        return this._curvatureExtremumMonitoringAtCurveExtremities;
    }

    get inflectionMonitoringAtCurveExtremities(): number[] {
        return this._inflectionMonitoringAtCurveExtremities;
    }
}