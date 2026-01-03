"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopyControlPoints = exports.RationalBSplineR1toR2Adapter = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const Vector2d_1 = require("../mathVector/Vector2d");
const Vector3d_1 = require("../mathVector/Vector3d");
const Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
const RationalBSplineR1toR2_1 = require("./RationalBSplineR1toR2");
class RationalBSplineR1toR2Adapter {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [new Vector3d_1.Vector3d(0, 0, 1)], knots = [0, 1]) {
        this._controlPoints = deepCopyControlPoints(controlPoints);
        this.rationalBSplineR1toR2 = new RationalBSplineR1toR2_1.RationalBSplineR1toR2(this._controlPoints, knots);
    }
    // protected override factory(controlPoints: readonly Vector3d[] = [new Vector3d(0, 0)], knots: readonly number[] = [0, 1]) {
    factory(controlPoints = [new Vector3d_1.Vector3d(0, 0)], knots = [0, 1]) {
        return new RationalBSplineR1toR2Adapter(controlPoints, knots);
    }
    getControlPointsX() {
        let result = [];
        for (let cp of this.rationalBSplineR1toR2.controlPoints) {
            result.push(cp.x);
        }
        return result;
    }
    getControlPointsY() {
        let result = [];
        for (let cp of this.rationalBSplineR1toR2.controlPoints) {
            result.push(cp.y);
        }
        return result;
    }
    getDistinctKnots() {
        let result = [this.rationalBSplineR1toR2.knots[0]];
        let temp = result[0];
        for (let i = 1; i < this.rationalBSplineR1toR2.knots.length; i += 1) {
            if (this.rationalBSplineR1toR2.knots[i] !== temp) {
                result.push(this.rationalBSplineR1toR2.knots[i]);
                temp = this.rationalBSplineR1toR2.knots[i];
            }
        }
        return result;
    }
    grevilleAbscissae() {
        let result = [];
        for (let i = 0; i < this.rationalBSplineR1toR2.controlPoints.length; i += 1) {
            let sum = 0;
            for (let j = i + 1; j < i + this.rationalBSplineR1toR2.degree + 1; j += 1) {
                sum += this.rationalBSplineR1toR2.knots[j];
            }
            result.push(sum / this.rationalBSplineR1toR2.degree);
        }
        return result;
    }
    knotMultiplicity(indexFromFindSpan) {
        let result = 0;
        let i = 0;
        while (this.rationalBSplineR1toR2.knots[indexFromFindSpan + i] === this.rationalBSplineR1toR2.knots[indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    }
    insertKnot(u, times = 1) {
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0) {
            return;
        }
        let index = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(u, this.rationalBSplineR1toR2.knots, this.rationalBSplineR1toR2.degree);
        let multiplicity = 0;
        if (u === this.rationalBSplineR1toR2.knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }
        for (let t = 0; t < times; t += 1) {
            let newControlPoints = [];
            for (let i = 0; i < index - this.rationalBSplineR1toR2.degree + 1; i += 1) {
                newControlPoints[i] = this.rationalBSplineR1toR2.controlPoints[i];
            }
            for (let i = index - this.rationalBSplineR1toR2.degree + 1; i <= index - multiplicity; i += 1) {
                let alpha = (u - this.rationalBSplineR1toR2.knots[i]) / (this.rationalBSplineR1toR2.knots[i + this.rationalBSplineR1toR2.degree] - this.rationalBSplineR1toR2.knots[i]);
                newControlPoints[i] = (this.rationalBSplineR1toR2.controlPoints[i - 1].multiply(1 - alpha)).add(this.rationalBSplineR1toR2.controlPoints[i].multiply(alpha));
            }
            for (let i = index - multiplicity; i < this.rationalBSplineR1toR2.controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this.rationalBSplineR1toR2.controlPoints[i];
            }
            this.rationalBSplineR1toR2.knots.splice(index + 1, 0, u);
            this.rationalBSplineR1toR2.controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }
    }
    moveControlPoint(i, deltaX, deltaY) {
        if (i < 0 || i >= this.rationalBSplineR1toR2.controlPoints.length - this.rationalBSplineR1toR2.degree) {
            throw new Error("Control point indentifier is out of range");
        }
        this.rationalBSplineR1toR2.controlPoints[i].x += deltaX;
        this.rationalBSplineR1toR2.controlPoints[i].y += deltaY;
    }
    moveControlPoints(delta) {
        const n = this._controlPoints.length;
        if (delta.length !== n) {
            throw new Error("Array of unexpected dimension");
        }
        let controlPoints = this._controlPoints;
        // JCL method to be updated for rational BSplines
        // for (let i = 0; i < n; i += 1) {
        //     controlPoints[i] = controlPoints[i].add(delta[i]);
        // }
        return this.factory(controlPoints, this.knots);
    }
    setControlPointPosition(index, value) {
    }
    get degree() {
        return this.rationalBSplineR1toR2.degree;
    }
    get knots() {
        return this.rationalBSplineR1toR2.knots;
    }
    get controlPoints() {
        return this.rationalBSplineR1toR2.controlPoints2D();
    }
    get freeControlPoints() {
        return this.rationalBSplineR1toR2.controlPoints2D();
    }
    clone() {
        return new RationalBSplineR1toR2Adapter(this.rationalBSplineR1toR2.controlPoints, this.rationalBSplineR1toR2.knots);
    }
    evaluate(u) {
        return this.rationalBSplineR1toR2.evaluate(u);
    }
    optimizerStep(step) {
    }
    elevateDegree(times) {
        // JCL method to be implemented
        const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "elevateDegree", "method not yet implemented !");
        error.logMessage();
    }
    degreeIncrement() {
        // JCL method to be implemented
        const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "degreeIncrement", "method not yet implemented !");
        error.logMessage();
        return new RationalBSplineR1toR2Adapter();
    }
    scale(factor) {
        let cp = [];
        // need to double check this transformation before using this method
        this._controlPoints.forEach(element => {
            cp.push(element.multiply(factor));
        });
        return new RationalBSplineR1toR2Adapter(cp, this.knots.slice());
    }
    scaleY(factor) {
        let cp = [];
        // need to double check the component element.z before using this method
        this._controlPoints.forEach(element => {
            cp.push(new Vector3d_1.Vector3d(element.x, element.y * factor, element.z));
        });
        return new RationalBSplineR1toR2Adapter(cp, this.knots.slice());
    }
    scaleX(factor) {
        let cp = [];
        // need to double check the component element.z before using this method
        this._controlPoints.forEach(element => {
            cp.push(new Vector3d_1.Vector3d(element.x * factor, element.y, element.z));
        });
        return new RationalBSplineR1toR2Adapter(cp, this.knots.slice());
    }
    evaluateOutsideRefInterval(u) {
        let result = new Vector2d_1.Vector2d();
        const knots = this.getDistinctKnots();
        if (u >= knots[0] && u <= knots[knots.length - 1]) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Parameter value for evaluation is not outside the knot interval.");
            error.logMessage();
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Method not implemented yet.");
            error.logMessage();
        }
        return result;
    }
    // to be checked for adequate usage
    flattenControlPointsArray() {
        const controlPointsArray = [];
        for (let i = 0; i < this.controlPoints.length; i++) {
            controlPointsArray.push([this.controlPoints[i].x, this.controlPoints[i].y]);
        }
        return controlPointsArray.reduce(function (acc, val) {
            return acc.concat(val);
        }, []);
    }
}
exports.RationalBSplineR1toR2Adapter = RationalBSplineR1toR2Adapter;
function deepCopyControlPoints(controlPoints) {
    let result = [];
    for (let cp of controlPoints) {
        result.push(cp.clone());
    }
    return result;
}
exports.deepCopyControlPoints = deepCopyControlPoints;
