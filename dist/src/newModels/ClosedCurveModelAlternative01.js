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
exports.ClosedCurveModelAlternative01 = void 0;
var Vector2d_1 = require("../mathVector/Vector2d");
// import { Optimizer } from "../optimizers/Optimizer"
// import { ActiveControl } from "../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2"
var AbstractCurveModel_1 = require("./AbstractCurveModel");
var PeriodicBSplineR1toR2withOpenKnotSequence_1 = require("../newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence");
// import { OptimizationProblemPeriodicBSplineR1toR2QuasiNewton } from "../bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2QuasiNewton"
var ClosedCurveModelAlternative01 = /** @class */ (function (_super) {
    __extends(ClosedCurveModelAlternative01, _super);
    // protected optimizationProblem: OptimizationProblemPeriodicBSplineR1toR2QuasiNewton
    function ClosedCurveModelAlternative01() {
        var e_1, _a;
        var _this = _super.call(this) || this;
        var px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3;
        var py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72;
        var cp = [[-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4],
            [px0, py5], [px1, py4], [px2, py2], [px3, py0],
            [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4],
            [-px2, -py2], [-px3, py0], [-px2, py2]];
        var cp1 = [];
        try {
            for (var cp_1 = __values(cp), cp_1_1 = cp_1.next(); !cp_1_1.done; cp_1_1 = cp_1.next()) {
                var cpi = cp_1_1.value;
                cp1.push([cpi[1], -cpi[0]]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (cp_1_1 && !cp_1_1.done && (_a = cp_1.return)) _a.call(cp_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        _this._splineTarget = PeriodicBSplineR1toR2withOpenKnotSequence_1.create_PeriodicBSplineR1toR2(cp1, knots);
        _this._spline = _this._splineTarget.clone();
        return _this;
        // this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2QuasiNewton(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
    }
    Object.defineProperty(ClosedCurveModelAlternative01.prototype, "spline", {
        get: function () {
            return this._spline.clone();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClosedCurveModelAlternative01.prototype, "isClosed", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    ClosedCurveModelAlternative01.prototype.notifyObservers = function () {
        var e_2, _a, e_3, _b;
        try {
            for (var _c = __values(this.observers), _d = _c.next(); !_d.done; _d = _c.next()) {
                var observer = _d.value;
                observer.update(this._spline.clone());
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _e = __values(this.observersCP), _f = _e.next(); !_f.done; _f = _e.next()) {
                var observer = _f.value;
                observer.update(this._splineTarget.clone());
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    ClosedCurveModelAlternative01.prototype.moveControlPoint = function (controlPointIndex, deltaX, deltaY) {
        this._splineTarget.moveControlPoint(controlPointIndex, deltaX, deltaY);
        if (deltaX * deltaX + deltaY * deltaY > 0) {
            this.notifyObservers();
        }
    };
    ClosedCurveModelAlternative01.prototype.setControlPointPosition = function (controlPointIndex, x, y) {
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
    ClosedCurveModelAlternative01.prototype.setSpline = function (spline) {
        this._spline = spline;
        this.notifyObservers();
    };
    ClosedCurveModelAlternative01.prototype.addControlPoint = function (controlPointIndex) {
        var cp = controlPointIndex;
        if (cp != null) {
            if (cp === 0) {
                cp += 1;
            }
            if (cp === this._spline.freeControlPoints.length - 1) {
                cp -= 1;
            }
            var grevilleAbscissae = this._spline.grevilleAbscissae();
            var meanGA = (grevilleAbscissae[cp] + grevilleAbscissae[cp + 1]) / 2;
            if (meanGA < this._spline.knots[this._spline.degree]) {
                var index = this._spline.degree;
                meanGA = (this._spline.knots[index] + this._spline.knots[index + 1]) / 2;
            }
            else if (meanGA > this._spline.knots[this._spline.knots.length - this._spline.degree - 1]) {
                var index = this._spline.knots.length - this._spline.degree - 1;
                meanGA = (this._spline.knots[index] + this._spline.knots[index - 1]) / 2;
            }
            this._splineTarget.insertKnot(meanGA);
            this._spline.insertKnot(meanGA);
        }
        // this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2QuasiNewton(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    };
    ClosedCurveModelAlternative01.prototype.setActiveControl = function () {
        // this.optimizationProblem = new  OptimizationProblemPeriodicBSplineR1toR2QuasiNewton(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        // this.optimizer = new Optimizer(this.optimizationProblem)
        this.notifyObservers();
    };
    return ClosedCurveModelAlternative01;
}(AbstractCurveModel_1.AbstractCurveModel));
exports.ClosedCurveModelAlternative01 = ClosedCurveModelAlternative01;
