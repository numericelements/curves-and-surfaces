"use strict";
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
exports.AbstractCurveModel = exports.DEFAULT_CURVE_DEGREE = void 0;
var Vector2d_1 = require("../mathVector/Vector2d");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
// import { Optimizer } from "../optimizers/Optimizer"
// import { ActiveControl } from "../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2"
exports.DEFAULT_CURVE_DEGREE = 3;
var AbstractCurveModel = /** @class */ (function () {
    function AbstractCurveModel() {
        this._observers = [];
        this.observersCP = [];
        // protected activeControl: ActiveControl = ActiveControl.both;
        this.activeOptimizer = true;
        // optimize(selectedControlPoint: number, ndcX: number, ndcY: number): void {
        //     if (this.optimizationProblem && this.optimizer) {
        //         //const p = this._spline.freeControlPoints[selectedControlPoint].clone()
        //         const p = this.optimizationProblem.spline.freeControlPoints[selectedControlPoint].clone();
        //         const distance = Math.sqrt(Math.pow(ndcX - p.x, 2) + Math.pow(ndcY - p.y, 2));
        //         //console.log(ndcX - p.x)
        //         const numberOfStep = 3 * Math.ceil(distance * 10);
        //         //const numberOfStep = 1
        //         for (let i = 1; i <= numberOfStep; i += 1) {
        //             let alpha = Math.pow(i / numberOfStep, 3);
        //             this._spline.setControlPointPosition(selectedControlPoint, new Vector2d((1-alpha)*p.x + alpha * ndcX, (1-alpha)*p.y + alpha * ndcY));
        //             this.optimizationProblem.setTargetSpline(this._spline);
        //             try {
        //                 this.optimizer.optimize_using_trust_region(10e-6, 1000, 800);
        //                 if (this.optimizer.success === true) {
        //                     this.setSpline(this.optimizationProblem.spline.clone());
        //                 }
        //             }
        //             catch(e) {
        //                 this._spline.setControlPointPosition(selectedControlPoint, new Vector2d(p.x, p.y));
        //                 console.log(e);
        //             }
        //         }
        //     }
        // }
    }
    Object.defineProperty(AbstractCurveModel.prototype, "observers", {
        get: function () {
            return this._observers;
        },
        enumerable: false,
        configurable: true
    });
    AbstractCurveModel.prototype.registerObserver = function (observer, kind) {
        switch (kind) {
            case 'curve':
                this.observers.push(observer);
                // console.log("CurveModel: registerObs as curve: " + observer.constructor.name)
                break;
            case 'control points':
                this.observersCP.push(observer);
                // console.log("CurveModel: registerObs as CP: " + observer.constructor.name)
                break;
            default:
                throw Error("unknown kind");
        }
    };
    AbstractCurveModel.prototype.checkObservers = function () {
        var e_1, _a, e_2, _b;
        var i = 0;
        try {
            for (var _c = __values(this.observers), _d = _c.next(); !_d.done; _d = _c.next()) {
                var observer = _d.value;
                var indexObs = this.observers.indexOf(observer);
                if (indexObs === -1) {
                    var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkObservers", "Unable to locate the " + i + "th observer in the list of observers.");
                    error.logMessage();
                }
                i++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        i = 0;
        try {
            for (var _e = __values(this.observersCP), _f = _e.next(); !_f.done; _f = _e.next()) {
                var observer = _f.value;
                var indexObsCP = this.observersCP.indexOf(observer);
                if (indexObsCP === -1) {
                    var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkObservers", "Unable to locate the " + i + "th observerCP in the list of observersCP.");
                    error.logMessage();
                }
                i++;
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
    AbstractCurveModel.prototype.removeObserver = function (observer, kind) {
        switch (kind) {
            case 'curve':
                var indexObs = this.observers.indexOf(observer);
                if (indexObs === -1) {
                    var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "removeObserver", "Unable to locate the observer " + observer + " in the list of observers.");
                    error.logMessage();
                }
                this.observers.splice(this.observers.indexOf(observer), 1);
                break;
            case 'control points':
                var indexObsCP = this.observersCP.indexOf(observer);
                if (indexObsCP === -1) {
                    var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "removeObserver", "Unable to locate the observer " + observer + " in the list of observers.");
                    error.logMessage();
                }
                this.observersCP.splice(this.observersCP.indexOf(observer), 1);
                break;
        }
    };
    AbstractCurveModel.prototype.notifyObservers = function () {
        var e_3, _a, e_4, _b;
        try {
            for (var _c = __values(this.observers), _d = _c.next(); !_d.done; _d = _c.next()) {
                var observer = _d.value;
                // console.log("CurveModel: update as curve: " + observer.constructor.name)
                observer.update(this._spline.clone());
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var _e = __values(this.observersCP), _f = _e.next(); !_f.done; _f = _e.next()) {
                var observer = _f.value;
                // console.log("CurveModel: update as CP: " + observer.constructor.name)
                observer.update(this._spline.clone());
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_4) throw e_4.error; }
        }
        this.checkObservers();
    };
    AbstractCurveModel.prototype.setControlPointPosition = function (controlPointIndex, x, y) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector2d_1.Vector2d(x, y));
        this.notifyObservers();
        // if (this.activeOptimizer) {
        //     this.optimize(controlPointIndex, x, y);
        // }
    };
    return AbstractCurveModel;
}());
exports.AbstractCurveModel = AbstractCurveModel;
