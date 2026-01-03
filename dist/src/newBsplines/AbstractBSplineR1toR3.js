"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopyControlPoints = exports.AbstractBSplineR1toR3 = void 0;
const Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
const Vector3d_1 = require("../mathVector/Vector3d");
/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
class AbstractBSplineR1toR3 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [new Vector3d_1.Vector3d(0, 0, 0)], knots = [0, 1]) {
        this._controlPoints = deepCopyControlPoints(controlPoints);
        this._knots = [...knots];
        this._degree = this.computeDegree();
    }
    computeDegree() {
        let degree = this._knots.length - this._controlPoints.length - 1;
        if (degree < 0) {
            throw new Error("Negative degree BSplineR1toR1 are not supported");
        }
        return degree;
    }
    get controlPoints() {
        return deepCopyControlPoints(this._controlPoints);
    }
    set controlPoints(controlPoints) {
        this._controlPoints = deepCopyControlPoints(controlPoints);
    }
    get knots() {
        return [...this._knots];
    }
    set knots(knots) {
        this._knots = [...knots];
        this._degree = this.computeDegree();
    }
    get degree() {
        return this._degree;
    }
    getControlPoint(index) {
        return this._controlPoints[index].clone();
    }
    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    evaluate(u) {
        const span = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(u, this._knots, this._degree);
        const basis = (0, Piegl_Tiller_NURBS_Book_1.basisFunctions)(span, u, this._knots, this._degree);
        let result = new Vector3d_1.Vector3d(0, 0, 0);
        for (let i = 0; i < this._degree + 1; i += 1) {
            result.x += basis[i] * this._controlPoints[span - this._degree + i].x;
            result.y += basis[i] * this._controlPoints[span - this._degree + i].y;
            result.z += basis[i] * this._controlPoints[span - this._degree + i].z;
        }
        return result;
    }
    getControlPointsX() {
        let result = [];
        for (let cp of this._controlPoints) {
            result.push(cp.x);
        }
        return result;
    }
    getControlPointsY() {
        let result = [];
        for (let cp of this._controlPoints) {
            result.push(cp.y);
        }
        return result;
    }
    getDistinctKnots() {
        let result = [this._knots[0]];
        let temp = result[0];
        for (let i = 1; i < this._knots.length; i += 1) {
            if (this._knots[i] !== temp) {
                result.push(this._knots[i]);
                temp = this._knots[i];
            }
        }
        return result;
    }
    moveControlPoint(i, deltaX, deltaY) {
        if (i < 0 || i >= this._controlPoints.length - this._degree) {
            throw new Error("Control point indentifier is out of range");
        }
        this._controlPoints[i].x += deltaX;
        this._controlPoints[i].y += deltaY;
    }
    moveControlPoints(delta) {
        const n = this._controlPoints.length;
        if (delta.length !== n) {
            throw new Error("Array of unexpected dimension");
        }
        let controlPoints = this._controlPoints;
        for (let i = 0; i < n; i += 1) {
            controlPoints[i] = controlPoints[i].add(delta[i]);
        }
        return this.factory(controlPoints, this._knots);
    }
    setControlPointPosition(index, value) {
        this._controlPoints[index] = value;
    }
    insertKnot(u, times = 1) {
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0) {
            return;
        }
        let index = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(u, this._knots, this._degree);
        let multiplicity = 0;
        if (u === this._knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }
        for (let t = 0; t < times; t += 1) {
            let newControlPoints = [];
            for (let i = 0; i < index - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            for (let i = index - this._degree + 1; i <= index - multiplicity; i += 1) {
                let alpha = (u - this._knots[i]) / (this._knots[i + this._degree] - this._knots[i]);
                newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
            }
            for (let i = index - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            this._knots.splice(index + 1, 0, u);
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }
    }
    knotMultiplicity(indexFromFindSpan) {
        let result = 0;
        let i = 0;
        while (this._knots[indexFromFindSpan + i] === this._knots[indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    }
    grevilleAbscissae() {
        let result = [];
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            let sum = 0;
            for (let j = i + 1; j < i + this._degree + 1; j += 1) {
                sum += this._knots[j];
            }
            result.push(sum / this._degree);
        }
        return result;
    }
    clamp(u) {
        // Piegl and Tiller, The NURBS book, p: 151
        let index = (0, Piegl_Tiller_NURBS_Book_1.clampingFindSpan)(u, this._knots, this._degree);
        let newControlPoints = [];
        let multiplicity = 0;
        if (u === this._knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }
        const times = this._degree - multiplicity + 1;
        for (let t = 0; t < times; t += 1) {
            for (let i = 0; i < index - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            for (let i = index - this._degree + 1; i <= index - multiplicity; i += 1) {
                let alpha = (u - this._knots[i]) / (this._knots[i + this._degree] - this._knots[i]);
                newControlPoints[i] = (this._controlPoints[i - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
            }
            for (let i = index - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            this._knots.splice(index + 1, 0, u);
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }
    }
}
exports.AbstractBSplineR1toR3 = AbstractBSplineR1toR3;
function deepCopyControlPoints(controlPoints) {
    let result = [];
    for (let cp of controlPoints) {
        result.push(cp.clone());
    }
    return result;
}
exports.deepCopyControlPoints = deepCopyControlPoints;
