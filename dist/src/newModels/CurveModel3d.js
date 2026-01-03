"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveModel3d = void 0;
const BSplineR1toR3_1 = require("../newBsplines/BSplineR1toR3");
const Vector3d_1 = require("../mathVector/Vector3d");
class CurveModel3d {
    //private camberSurfaceObservers: IObserver<BSplineR2toCylCoord>[] = []
    constructor() {
        const cp0 = new Vector3d_1.Vector3d(-0.25, 0, -0.15);
        const cp1 = new Vector3d_1.Vector3d(-0.15, 0.15, -0.05);
        const cp2 = new Vector3d_1.Vector3d(0, 0.25, -0.05);
        const cp3 = new Vector3d_1.Vector3d(0.15, 0.15, -0.05);
        const cp4 = new Vector3d_1.Vector3d(0.25, 0, 0.05);
        this._spline = new BSplineR1toR3_1.BSplineR1toR3([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]);
    }
    get spline() {
        return this._spline.clone();
    }
    get isClosed() {
        return false;
    }
}
exports.CurveModel3d = CurveModel3d;
