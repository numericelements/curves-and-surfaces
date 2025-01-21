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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveModelAlternative01 = void 0;
var BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
var Vector2d_1 = require("../mathVector/Vector2d");
// import { OptimizationProblemBSplineR1toR2} from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2"
// import { OptimizationProblemBSplineR1toR2WithWeigthingFactors } from "../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2WithWeigthingFactors"
// import { Optimizer } from "../optimizers/Optimizer"
// import { ActiveControl } from "../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2"
var AbstractCurveModel_1 = require("./AbstractCurveModel");
var CurveModelAlternative01 = /** @class */ (function (_super) {
    __extends(CurveModelAlternative01, _super);
    // protected optimizationProblem: OptimizationProblemBSplineR1toR2
    function CurveModelAlternative01() {
        var _this = _super.call(this) || this;
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(-0.1, 0.5);
        var cp2 = new Vector2d_1.Vector2d(0.1, 0.5);
        var cp3 = new Vector2d_1.Vector2d(0.5, 0);
        _this._splineTarget = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1]);
        _this._spline = _this._splineTarget.clone();
        return _this;
        //this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2WithWeigthingFactors(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
    }
    Object.defineProperty(CurveModelAlternative01.prototype, "spline", {
        get: function () {
            return this._spline.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveModelAlternative01.prototype, "isClosed", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    CurveModelAlternative01.prototype.notifyObservers = function () {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values(this.observers), _d = _c.next(); !_d.done; _d = _c.next()) {
                var observer = _d.value;
                observer.update(this._spline.clone());
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _e = __values(this.observersCP), _f = _e.next(); !_f.done; _f = _e.next()) {
                var observer = _f.value;
                observer.update(this._splineTarget.clone());
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    CurveModelAlternative01.prototype.moveControlPoint = function (controlPointIndex, deltaX, deltaY) {
        this._splineTarget.moveControlPoint(controlPointIndex, deltaX, deltaY);
        if (deltaX * deltaX + deltaY * deltaY > 0) {
            this.notifyObservers();
        }
    };
    CurveModelAlternative01.prototype.setControlPointPosition = function (controlPointIndex, x, y) {
        this._splineTarget.setControlPointPosition(controlPointIndex, new Vector2d_1.Vector2d(x, y));
        if (this.activeOptimizer) {
            // this.optimize(controlPointIndex, x, y)
        }
        else {
            this._spline = this._splineTarget.clone();
        }
        this.notifyObservers();
    };
    // optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {
    //     if (this.optimizationProblem && this.optimizer) {
    //         const p = this._splineTarget.freeControlPoints[selectedControlPoint].clone()
    //         this._splineTarget.setControlPointPosition(selectedControlPoint, new Vector2d(ndcX, ndcY))
    //         this.optimizationProblem.setTargetSpline(this._splineTarget)
    //         try {
    //             this.optimizer.optimize_using_trust_region(10e-6, 1000, 800)
    //             if (this.optimizer.success === true) {
    //                 this.setSpline(this.optimizationProblem.spline.clone())
    //             }
    //         }
    //         catch(e) {
    //             this._splineTarget.setControlPointPosition(selectedControlPoint, new Vector2d(p.x, p.y))
    //             console.log(e)
    //         }
    //     }
    // }
    CurveModelAlternative01.prototype.setSpline = function (spline) {
        this._spline = spline;
        this.notifyObservers();
    };
    CurveModelAlternative01.prototype.addControlPoint = function (controlPointIndex) {
        var cp = controlPointIndex;
        if (cp != null) {
            if (cp === 0) {
                cp += 1;
            }
            if (cp === this._splineTarget.controlPoints.length - 1) {
                cp -= 1;
            }
            var grevilleAbscissae = this._splineTarget.grevilleAbscissae();
            this._splineTarget.insertKnot(grevilleAbscissae[cp]);
            this._spline.insertKnot(grevilleAbscissae[cp]);
        }
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2WithWeigthingFactors(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    };
    CurveModelAlternative01.prototype.setActiveControl = function () {
        // this.optimizationProblem = new  OptimizationProblemBSplineR1toR2WithWeigthingFactors(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    };
    return CurveModelAlternative01;
}(AbstractCurveModel_1.AbstractCurveModel));
exports.CurveModelAlternative01 = CurveModelAlternative01;
