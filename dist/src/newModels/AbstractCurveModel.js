"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCurveModel = exports.DEFAULT_CURVE_DEGREE = void 0;
const Vector2d_1 = require("../mathVector/Vector2d");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
// import { Optimizer } from "../optimizers/Optimizer"
// import { ActiveControl } from "../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2"
exports.DEFAULT_CURVE_DEGREE = 3;
class AbstractCurveModel {
    constructor() {
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
    get observers() {
        return this._observers;
    }
    registerObserver(observer, kind) {
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
    }
    checkObservers() {
        var i = 0;
        for (let observer of this.observers) {
            const indexObs = this.observers.indexOf(observer);
            if (indexObs === -1) {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkObservers", "Unable to locate the " + i + "th observer in the list of observers.");
                error.logMessage();
            }
            i++;
        }
        i = 0;
        for (let observer of this.observersCP) {
            const indexObsCP = this.observersCP.indexOf(observer);
            if (indexObsCP === -1) {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkObservers", "Unable to locate the " + i + "th observerCP in the list of observersCP.");
                error.logMessage();
            }
            i++;
        }
    }
    removeObserver(observer, kind) {
        switch (kind) {
            case 'curve':
                const indexObs = this.observers.indexOf(observer);
                if (indexObs === -1) {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "removeObserver", "Unable to locate the observer " + observer + " in the list of observers.");
                    error.logMessage();
                }
                this.observers.splice(this.observers.indexOf(observer), 1);
                break;
            case 'control points':
                const indexObsCP = this.observersCP.indexOf(observer);
                if (indexObsCP === -1) {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "removeObserver", "Unable to locate the observer " + observer + " in the list of observers.");
                    error.logMessage();
                }
                this.observersCP.splice(this.observersCP.indexOf(observer), 1);
                break;
        }
    }
    notifyObservers() {
        for (let observer of this.observers) {
            // console.log("CurveModel: update as curve: " + observer.constructor.name)
            observer.update(this._spline.clone());
        }
        for (let observer of this.observersCP) {
            // console.log("CurveModel: update as CP: " + observer.constructor.name)
            observer.update(this._spline.clone());
        }
        this.checkObservers();
    }
    setControlPointPosition(controlPointIndex, x, y) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector2d_1.Vector2d(x, y));
        this.notifyObservers();
        // if (this.activeOptimizer) {
        //     this.optimize(controlPointIndex, x, y);
        // }
    }
}
exports.AbstractCurveModel = AbstractCurveModel;
