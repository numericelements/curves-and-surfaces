"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleCurveModel = void 0;
const BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
const Vector2d_1 = require("../mathVector/Vector2d");
const AbstractCurveModel_1 = require("./AbstractCurveModel");
class SimpleCurveModel extends AbstractCurveModel_1.AbstractCurveModel {
    //private observers: IObserver<BSplineR1toR2Interface>[] = []
    constructor() {
        super();
        const cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        const cp1 = new Vector2d_1.Vector2d(-0.1, 0.5);
        const cp2 = new Vector2d_1.Vector2d(0.1, 0.5);
        const cp3 = new Vector2d_1.Vector2d(0.5, 0);
        this._spline = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1]);
    }
    get spline() {
        return this._spline.clone();
    }
    get isClosed() {
        return false;
    }
    /*
    moveControlPoint(controlPointIndex: number, deltaX: number, deltaY: number) {
        this._spline.moveControlPoint(controlPointIndex, deltaX, deltaY)
        if (deltaX*deltaX + deltaY*deltaY > 0) {
            this.notifyObservers()
        }
    }
    */
    setControlPointPosition(controlPointIndex, x, y) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector2d_1.Vector2d(x, y));
        this.notifyObservers();
    }
    setSpline(spline) {
        this._spline = spline;
        this.notifyObservers();
    }
    addControlPoint(controlPointIndex) {
        let cp = controlPointIndex;
        if (cp != null) {
            if (cp === 0) {
                cp += 1;
            }
            if (cp === this._spline.controlPoints.length - 1) {
                cp -= 1;
            }
            const grevilleAbscissae = this._spline.grevilleAbscissae();
            this._spline.insertKnot(grevilleAbscissae[cp]);
            //this.resetCurve(this.curveModel)
        }
        this.notifyObservers();
    }
    setActiveControl() {
    }
    toggleActiveControlOfCurvatureExtrema() {
    }
    toggleActiveControlOfInflections() {
    }
}
exports.SimpleCurveModel = SimpleCurveModel;
