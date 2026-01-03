"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveShapeSpaceDescriptor = void 0;
class CurveShapeSpaceDescriptor {
    constructor(curveToAnalyze) {
        // JCL a finaliser avec le nb correct de contraintes
        this._inflectionsTotalNumberOfConstraints = curveToAnalyze.degree;
        this._curvatureExtremaTotalNumberOfConstraints = curveToAnalyze.degree;
        this._curvatureExtremumMonitoringAtCurveExtremities = [];
        this._inflectionMonitoringAtCurveExtremities = [];
    }
    get inflectionsTotalNumberOfConstraints() {
        return this._inflectionsTotalNumberOfConstraints;
    }
    get curvatureExtremaTotalNumberOfConstraints() {
        return this._curvatureExtremaTotalNumberOfConstraints;
    }
    get curvatureExtremumMonitoringAtCurveExtremities() {
        return this._curvatureExtremumMonitoringAtCurveExtremities;
    }
    get inflectionMonitoringAtCurveExtremities() {
        return this._inflectionMonitoringAtCurveExtremities;
    }
}
exports.CurveShapeSpaceDescriptor = CurveShapeSpaceDescriptor;
