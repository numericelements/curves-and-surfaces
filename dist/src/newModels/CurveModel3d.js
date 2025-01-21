"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveModel3d = void 0;
var BSplineR1toR3_1 = require("../newBsplines/BSplineR1toR3");
var Vector3d_1 = require("../mathVector/Vector3d");
var CurveModel3d = /** @class */ (function () {
    //private camberSurfaceObservers: IObserver<BSplineR2toCylCoord>[] = []
    function CurveModel3d() {
        var cp0 = new Vector3d_1.Vector3d(-0.25, 0, -0.15);
        var cp1 = new Vector3d_1.Vector3d(-0.15, 0.15, -0.05);
        var cp2 = new Vector3d_1.Vector3d(0, 0.25, -0.05);
        var cp3 = new Vector3d_1.Vector3d(0.15, 0.15, -0.05);
        var cp4 = new Vector3d_1.Vector3d(0.25, 0, 0.05);
        this._spline = new BSplineR1toR3_1.BSplineR1toR3([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]);
    }
    Object.defineProperty(CurveModel3d.prototype, "spline", {
        get: function () {
            return this._spline.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveModel3d.prototype, "isClosed", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    return CurveModel3d;
}());
exports.CurveModel3d = CurveModel3d;
