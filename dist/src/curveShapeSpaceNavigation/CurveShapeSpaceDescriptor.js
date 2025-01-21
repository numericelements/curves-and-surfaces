"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveShapeSpaceDescriptor = void 0;
var CurveShapeSpaceDescriptor = /** @class */ (function () {
    function CurveShapeSpaceDescriptor(curveToAnalyze) {
        // JCL a finaliser avec le nb correct de contraintes
        this._inflectionsTotalNumberOfConstraints = curveToAnalyze.degree;
        this._curvatureExtremaTotalNumberOfConstraints = curveToAnalyze.degree;
        this._curvatureExtremumMonitoringAtCurveExtremities = [];
        this._inflectionMonitoringAtCurveExtremities = [];
    }
    Object.defineProperty(CurveShapeSpaceDescriptor.prototype, "inflectionsTotalNumberOfConstraints", {
        get: function () {
            return this._inflectionsTotalNumberOfConstraints;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveShapeSpaceDescriptor.prototype, "curvatureExtremaTotalNumberOfConstraints", {
        get: function () {
            return this._curvatureExtremaTotalNumberOfConstraints;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveShapeSpaceDescriptor.prototype, "curvatureExtremumMonitoringAtCurveExtremities", {
        get: function () {
            return this._curvatureExtremumMonitoringAtCurveExtremities;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveShapeSpaceDescriptor.prototype, "inflectionMonitoringAtCurveExtremities", {
        get: function () {
            return this._inflectionMonitoringAtCurveExtremities;
        },
        enumerable: false,
        configurable: true
    });
    return CurveShapeSpaceDescriptor;
}());
exports.CurveShapeSpaceDescriptor = CurveShapeSpaceDescriptor;
