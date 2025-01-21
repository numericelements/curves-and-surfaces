"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleCurveModel = void 0;
var BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
var Vector2d_1 = require("../mathVector/Vector2d");
var AbstractCurveModel_1 = require("./AbstractCurveModel");
var SimpleCurveModel = /** @class */ (function (_super) {
    __extends(SimpleCurveModel, _super);
    //private observers: IObserver<BSplineR1toR2Interface>[] = []
    function SimpleCurveModel() {
        var _this = _super.call(this) || this;
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(-0.1, 0.5);
        var cp2 = new Vector2d_1.Vector2d(0.1, 0.5);
        var cp3 = new Vector2d_1.Vector2d(0.5, 0);
        _this._spline = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1]);
        return _this;
    }
    Object.defineProperty(SimpleCurveModel.prototype, "spline", {
        get: function () {
            return this._spline.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimpleCurveModel.prototype, "isClosed", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    /*
    moveControlPoint(controlPointIndex: number, deltaX: number, deltaY: number) {
        this._spline.moveControlPoint(controlPointIndex, deltaX, deltaY)
        if (deltaX*deltaX + deltaY*deltaY > 0) {
            this.notifyObservers()
        }
    }
    */
    SimpleCurveModel.prototype.setControlPointPosition = function (controlPointIndex, x, y) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector2d_1.Vector2d(x, y));
        this.notifyObservers();
    };
    SimpleCurveModel.prototype.setSpline = function (spline) {
        this._spline = spline;
        this.notifyObservers();
    };
    SimpleCurveModel.prototype.addControlPoint = function (controlPointIndex) {
        var cp = controlPointIndex;
        if (cp != null) {
            if (cp === 0) {
                cp += 1;
            }
            if (cp === this._spline.controlPoints.length - 1) {
                cp -= 1;
            }
            var grevilleAbscissae = this._spline.grevilleAbscissae();
            this._spline.insertKnot(grevilleAbscissae[cp]);
            //this.resetCurve(this.curveModel)
        }
        this.notifyObservers();
    };
    SimpleCurveModel.prototype.setActiveControl = function () {
    };
    SimpleCurveModel.prototype.toggleActiveControlOfCurvatureExtrema = function () {
    };
    SimpleCurveModel.prototype.toggleActiveControlOfInflections = function () {
    };
    return SimpleCurveModel;
}(AbstractCurveModel_1.AbstractCurveModel));
exports.SimpleCurveModel = SimpleCurveModel;
