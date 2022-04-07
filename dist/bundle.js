/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/bsplines/AbstractBSplineR1toR1.ts":
/*!***********************************************!*\
  !*** ./src/bsplines/AbstractBSplineR1toR1.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Piegl_Tiller_NURBS_Book_1 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/bsplines/Piegl_Tiller_NURBS_Book.ts");
/**
 * A B-Spline function from a one dimensional real space to a one dimensional real space
 */
class AbstractBSplineR1toR1 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [0], knots = [0, 1]) {
        this._controlPoints = [];
        this._knots = [];
        this._degree = 0;
        this._controlPoints = [...controlPoints];
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
        return [...this._controlPoints];
    }
    set controlPoints(controlPoints) {
        this._controlPoints = [...controlPoints];
        this._degree = this.computeDegree();
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
    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    evaluate(u) {
        const span = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots, this._degree);
        const basis = Piegl_Tiller_NURBS_Book_1.basisFunctions(span, u, this._knots, this._degree);
        let result = 0;
        for (let i = 0; i < this._degree + 1; i += 1) {
            result += basis[i] * this._controlPoints[span - this._degree + i];
        }
        return result;
    }
    distinctKnots() {
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
    zeros(tolerance = 10e-8) {
        //see : chapter 11 : Computing Zeros of Splines by Tom Lyche and Knut Morken for u_star method
        let spline = this.clone();
        let greville = [];
        let maxError = tolerance * 2;
        let vertexIndex = [];
        let it = 0;
        while (maxError > tolerance && it < 10e8) {
            it += 1;
            let maximum = 0;
            let newKnots = [];
            vertexIndex = findControlPointsFollowingSignChanges(spline);
            greville = spline.grevilleAbscissae();
            for (let v of vertexIndex) {
                let uLeft = greville[v - 1];
                let uRight = greville[v];
                if (uRight - uLeft > maximum) {
                    maximum = uRight - uLeft;
                }
                if (uRight - uLeft > tolerance) {
                    let lineZero = this.robustFindLineZero(uLeft, spline.controlPoints[v - 1], uRight, spline.controlPoints[v]);
                    newKnots.push(0.05 * (uLeft + uRight) / 2 + 0.95 * lineZero);
                }
            }
            for (let knot of newKnots) {
                spline.insertKnot(knot);
            }
            maxError = maximum;
        }
        vertexIndex = findControlPointsFollowingSignChanges(spline);
        let result = [];
        for (let v of vertexIndex) {
            result.push(greville[v]);
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
    insertKnot(u, times = 1) {
        if (times <= 0) {
            return;
        }
        let index = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots, this._degree);
        let multiplicity = 0;
        let newControlPoints = [];
        if (u === this._knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }
        for (let t = 0; t < times; t += 1) {
            for (let i = 0; i < index - this._degree + 1; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            for (let i = index - this._degree + 1; i <= index - multiplicity; i += 1) {
                let alpha = (u - this._knots[i]) / (this._knots[i + this._degree] - this._knots[i]);
                newControlPoints[i] = this._controlPoints[i - 1] * (1 - alpha) + this._controlPoints[i] * alpha;
            }
            for (let i = index - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            this._knots.splice(index + 1, 0, u);
            this._controlPoints = newControlPoints.slice();
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
    clamp(u) {
        // Piegl and Tiller, The NURBS book, p: 151
        let index = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(u, this._knots, this._degree);
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
                newControlPoints[i] = this._controlPoints[i - 1] * (1 - alpha) + this._controlPoints[i] * alpha;
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
    controlPolygonNumberOfSignChanges() {
        let result = 0;
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            if (Math.sign(this._controlPoints[i]) !== Math.sign(this._controlPoints[i + 1])) {
                result += 1;
            }
        }
        return result;
    }
    controlPolygonZeros() {
        let result = [];
        let greville = this.grevilleAbscissae();
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            if (Math.sign(this._controlPoints[i]) !== Math.sign(this._controlPoints[i + 1])) {
                result.push(this.findLineZero(greville[i], this._controlPoints[i], greville[i + 1], this._controlPoints[i + 1]));
            }
        }
        return result;
    }
    findLineZero(x1, y1, x2, y2) {
        // find the zero of the line y = ax + b
        let a = (y2 - y1) / (x2 - x1);
        let b = y1 - a * x1;
        return -b / a;
    }
    robustFindLineZero(x1, y1, x2, y2) {
        let result = this.findLineZero(x1, y1, x2, y2);
        if (isNaN(result)) {
            return x1;
        }
        return result;
    }
}
exports.AbstractBSplineR1toR1 = AbstractBSplineR1toR1;
function findControlPointsFollowingSignChanges(spline) {
    let cpLeft = spline.controlPoints[0];
    let vertexIndex = [];
    for (let index = 1; index < spline.controlPoints.length; index += 1) {
        let cpRight = spline.controlPoints[index];
        if (cpLeft <= 0 && cpRight > 0) {
            vertexIndex.push(index);
        }
        if (cpLeft >= 0 && cpRight < 0) {
            vertexIndex.push(index);
        }
        cpLeft = cpRight;
    }
    if (spline.controlPoints[spline.controlPoints.length - 1] == 0) {
        vertexIndex.push(spline.controlPoints.length - 1);
    }
    return vertexIndex;
}


/***/ }),

/***/ "./src/bsplines/AbstractBSplineR1toR2.ts":
/*!***********************************************!*\
  !*** ./src/bsplines/AbstractBSplineR1toR2.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Piegl_Tiller_NURBS_Book_1 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/bsplines/Piegl_Tiller_NURBS_Book.ts");
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
class AbstractBSplineR1toR2 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [new Vector2d_1.Vector2d(0, 0)], knots = [0, 1]) {
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
        const span = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots, this._degree);
        const basis = Piegl_Tiller_NURBS_Book_1.basisFunctions(span, u, this._knots, this._degree);
        let result = new Vector2d_1.Vector2d(0, 0);
        for (let i = 0; i < this._degree + 1; i += 1) {
            result.x += basis[i] * this._controlPoints[span - this._degree + i].x;
            result.y += basis[i] * this._controlPoints[span - this._degree + i].y;
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
    setControlPointPosition(index, value) {
        this._controlPoints[index] = value;
    }
    insertKnot(u, times = 1) {
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0) {
            return;
        }
        let index = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots, this._degree);
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
        let index = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(u, this._knots, this._degree);
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
exports.AbstractBSplineR1toR2 = AbstractBSplineR1toR2;
function deepCopyControlPoints(controlPoints) {
    let result = [];
    for (let cp of controlPoints) {
        result.push(cp.clone());
    }
    return result;
}
exports.deepCopyControlPoints = deepCopyControlPoints;


/***/ }),

/***/ "./src/bsplines/AbstractBSplineR1toR2DifferentialProperties.ts":
/*!*********************************************************************!*\
  !*** ./src/bsplines/AbstractBSplineR1toR2DifferentialProperties.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BSplineR1toR1_1 = __webpack_require__(/*! ./BSplineR1toR1 */ "./src/bsplines/BSplineR1toR1.ts");
class AbstractBSplineR1toR2DifferentialProperties {
    constructor(spline) {
        this._spline = spline.clone();
    }
    expensiveComputation(spline) {
        const sx = this.bSplineR1toR1Factory(spline.getControlPointsX(), spline.knots);
        const sy = this.bSplineR1toR1Factory(spline.getControlPointsY(), spline.knots);
        const sxu = sx.derivative();
        const syu = sy.derivative();
        const sxuu = sxu.derivative();
        const syuu = syu.derivative();
        const sxuuu = sxuu.derivative();
        const syuuu = syuu.derivative();
        const bdsxu = sxu.bernsteinDecomposition();
        const bdsyu = syu.bernsteinDecomposition();
        const bdsxuu = sxuu.bernsteinDecomposition();
        const bdsyuu = syuu.bernsteinDecomposition();
        const bdsxuuu = sxuuu.bernsteinDecomposition();
        const bdsyuuu = syuuu.bernsteinDecomposition();
        const h1 = (bdsxu.multiply(bdsxu)).add((bdsyu.multiply(bdsyu)));
        const h2 = (bdsxu.multiply(bdsyuuu)).subtract((bdsyu.multiply(bdsxuuu)));
        const h3 = (bdsxu.multiply(bdsxuu)).add((bdsyu.multiply(bdsyuu)));
        const h4 = (bdsxu.multiply(bdsyuu)).subtract((bdsyu.multiply(bdsxuu)));
        return {
            h1: h1,
            h2: h2,
            h3: h3,
            h4: h4
        };
    }
    curvatureNumerator() {
        const e = this.expensiveComputation(this._spline);
        const distinctKnots = this._spline.getDistinctKnots();
        const controlPoints = e.h4.flattenControlPointsArray();
        const curvatureNumeratorDegree = 2 * this._spline.degree - 3;
        let knots = [];
        for (let knot of distinctKnots) {
            for (let j = 0; j < curvatureNumeratorDegree + 1; j += 1) {
                knots.push(knot);
            }
        }
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    }
    h1() {
        const e = this.expensiveComputation(this._spline);
        const distinctKnots = this._spline.getDistinctKnots();
        const controlPoints = e.h1.flattenControlPointsArray();
        const h1Degree = 2 * this._spline.degree - 2;
        let knots = [];
        for (let knot of distinctKnots) {
            for (let j = 0; j < h1Degree + 1; j += 1) {
                knots.push(knot);
            }
        }
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    }
    inflections(curvatureNumerator) {
        if (!curvatureNumerator) {
            curvatureNumerator = this.curvatureNumerator();
        }
        const zeros = curvatureNumerator.zeros();
        let result = [];
        for (let z of zeros) {
            result.push(this._spline.evaluate(z));
        }
        return result;
    }
    curvatureDerivativeNumerator() {
        const e = this.expensiveComputation(this._spline);
        const bd_curvatureDerivativeNumerator = (e.h1.multiply(e.h2)).subtract(e.h3.multiply(e.h4).multiplyByScalar(3));
        const distinctKnots = this._spline.getDistinctKnots();
        const controlPoints = bd_curvatureDerivativeNumerator.flattenControlPointsArray();
        const curvatureDerivativeNumeratorDegree = 4 * this._spline.degree - 6;
        let knots = [];
        for (let knot of distinctKnots) {
            for (let j = 0; j < curvatureDerivativeNumeratorDegree + 1; j += 1) {
                knots.push(knot);
            }
        }
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    }
    curvatureExtrema(_curvatureDerivativeNumerator) {
        if (!_curvatureDerivativeNumerator) {
            _curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
        }
        const zeros = _curvatureDerivativeNumerator.zeros();
        let result = [];
        for (let z of zeros) {
            result.push(this._spline.evaluate(z));
        }
        return result;
    }
}
exports.AbstractBSplineR1toR2DifferentialProperties = AbstractBSplineR1toR2DifferentialProperties;


/***/ }),

/***/ "./src/bsplines/AbstractBSplineR1toR3.ts":
/*!***********************************************!*\
  !*** ./src/bsplines/AbstractBSplineR1toR3.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Piegl_Tiller_NURBS_Book_1 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/bsplines/Piegl_Tiller_NURBS_Book.ts");
const Vector3d_1 = __webpack_require__(/*! ../mathVector/Vector3d */ "./src/mathVector/Vector3d.ts");
/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
//export abstract class AbstractBSplineR1toR3 implements BSplineR1toRxInterface<Vector3d> {
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
        const span = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots, this._degree);
        const basis = Piegl_Tiller_NURBS_Book_1.basisFunctions(span, u, this._knots, this._degree);
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
    getControlPointsZ() {
        let result = [];
        for (let cp of this._controlPoints) {
            result.push(cp.z);
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
    setControlPointPosition(index, value) {
        this._controlPoints[index] = value;
    }
    insertKnot(u, times = 1) {
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0) {
            return;
        }
        let index = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots, this._degree);
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
        let index = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(u, this._knots, this._degree);
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


/***/ }),

/***/ "./src/bsplines/BSplineR1toR1.ts":
/*!***************************************!*\
  !*** ./src/bsplines/BSplineR1toR1.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Piegl_Tiller_NURBS_Book_1 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/bsplines/Piegl_Tiller_NURBS_Book.ts");
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
const AbstractBSplineR1toR1_1 = __webpack_require__(/*! ./AbstractBSplineR1toR1 */ "./src/bsplines/AbstractBSplineR1toR1.ts");
const BernsteinDecompositionR1toR1_1 = __webpack_require__(/*! ./BernsteinDecompositionR1toR1 */ "./src/bsplines/BernsteinDecompositionR1toR1.ts");
const BSplineR1toR2_1 = __webpack_require__(/*! ./BSplineR1toR2 */ "./src/bsplines/BSplineR1toR2.ts");
/**
 * A B-Spline function from a one dimensional real space to a one dimensional real space
 */
class BSplineR1toR1 extends AbstractBSplineR1toR1_1.AbstractBSplineR1toR1 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [0], knots = [0, 1]) {
        super(controlPoints, knots);
    }
    bernsteinDecomposition() {
        // Piegl_Tiller_NURBS_Book.ts
        return new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(Piegl_Tiller_NURBS_Book_1.decomposeFunction(this));
    }
    clone() {
        return new BSplineR1toR1(this._controlPoints.slice(), this._knots.slice());
    }
    derivative() {
        let newControlPoints = [];
        let newKnots = [];
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            newControlPoints[i] = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree / (this._knots[i + this._degree + 1] - this._knots[i + 1]));
        }
        newKnots = this._knots.slice(1, this._knots.length - 1);
        return new BSplineR1toR1(newControlPoints, newKnots);
    }
    elevateDegree(times = 1) {
        const bds = this.bernsteinDecomposition();
        bds.elevateDegree();
        const knots = this.distinctKnots();
        const newSpline = BernsteinDecompositionR1toR1_1.splineRecomposition(bds, knots);
        for (let i = 0; i < knots.length; i += 1) {
            let m = this.knotMultiplicity(Piegl_Tiller_NURBS_Book_1.findSpan(knots[i], this.knots, this.degree));
            for (let j = 0; j < newSpline.degree - m - 1; j += 1) {
                newSpline.removeKnot(Piegl_Tiller_NURBS_Book_1.findSpan(newSpline.knots[i], newSpline.knots, newSpline.degree));
            }
        }
        this.controlPoints = newSpline.controlPoints;
        this.knots = newSpline.knots;
        this._degree = newSpline.degree;
    }
    removeKnot(indexFromFindSpan, tolerance = 10e-5) {
        //Piegl and Tiller, The NURBS book, p : 185
        const index = indexFromFindSpan;
        // end knots are not removed
        if (index > this._degree && index < this.knots.length - this._degree - 1) {
            throw new Error("index out of range");
        }
        //const double tolerance = 1;
        const multiplicity = this.knotMultiplicity(index);
        const last = index - multiplicity;
        const first = index - this.degree;
        const offset = first - 1;
        //std::vector<vectorType> local(2*degree+1);
        let local = [];
        local[0] = this.controlPoints[offset];
        local[last + 1 - offset] = this.controlPoints[last + 1];
        let i = first;
        let j = last;
        let ii = 1;
        let jj = last - offset;
        let removable = false;
        // Compute new control point for one removal step
        while (j > i) {
            let alpha_i = (this.knots[index] - this.knots[i]) / (this.knots[i + this.degree + 1] - this.knots[i]);
            let alpha_j = (this.knots[index] - this.knots[j]) / (this.knots[j + this.degree + 1] - this.knots[j]);
            local[ii] = (this.controlPoints[i] - (local[ii - 1] * (1.0 - alpha_i))) / alpha_i;
            local[jj] = (this.controlPoints[j] - (local[jj + 1] * (alpha_j))) / (1.0 - alpha_j);
            ++i;
            ++ii;
            --j;
            --jj;
        }
        if (j < i) {
            if ((local[ii - 1] - (local[jj + 1])) <= tolerance) {
                removable = true;
            }
        }
        else {
            const alpha_i = (this.knots[index] - this.knots[i]) / (this.knots[i + this.degree + 1] - this.knots[i]);
            if (((this.controlPoints[i] - ((local[ii + 1] * (alpha_i)))) + (local[ii - 1] * (1.0 - alpha_i))) <= tolerance) {
                removable = true;
            }
        }
        if (removable == false)
            return;
        else {
            let i = first;
            let j = last;
            while (j > i) {
                this.controlPoints[i] = local[i - offset];
                this.controlPoints[j] = local[j - offset];
                ++i;
                --j;
            }
        }
        this.knots.splice(index, 1);
        const fout = (2 * index - multiplicity - this.degree) / 2;
        this._controlPoints.splice(fout, 1);
    }
    moveControlPoint(i, delta) {
        if (i < 0 || i >= this.controlPoints.length) {
            throw new Error("Control point indentifier is out of range");
        }
        this.controlPoints[i] += delta;
    }
    curve() {
        let x = this.grevilleAbscissae();
        let cp = [];
        for (let i = 0; i < x.length; i += 1) {
            cp.push(new Vector2d_1.Vector2d(x[i], this._controlPoints[i]));
        }
        return new BSplineR1toR2_1.BSplineR1toR2(cp, this._knots.slice());
    }
}
exports.BSplineR1toR1 = BSplineR1toR1;


/***/ }),

/***/ "./src/bsplines/BSplineR1toR2.ts":
/*!***************************************!*\
  !*** ./src/bsplines/BSplineR1toR2.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Piegl_Tiller_NURBS_Book_1 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/bsplines/Piegl_Tiller_NURBS_Book.ts");
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
const AbstractBSplineR1toR2_1 = __webpack_require__(/*! ./AbstractBSplineR1toR2 */ "./src/bsplines/AbstractBSplineR1toR2.ts");
const BSplineR1toR1_1 = __webpack_require__(/*! ./BSplineR1toR1 */ "./src/bsplines/BSplineR1toR1.ts");
const BernsteinDecompositionR1toR1_1 = __webpack_require__(/*! ./BernsteinDecompositionR1toR1 */ "./src/bsplines/BernsteinDecompositionR1toR1.ts");
/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
class BSplineR1toR2 extends AbstractBSplineR1toR2_1.AbstractBSplineR1toR2 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [new Vector2d_1.Vector2d(0, 0)], knots = [0, 1]) {
        super(controlPoints, knots);
    }
    get freeControlPoints() {
        return this.controlPoints;
    }
    /**
     * Return a deep copy of this b-spline
     */
    clone() {
        let cloneControlPoints = AbstractBSplineR1toR2_1.deepCopyControlPoints(this._controlPoints);
        return new BSplineR1toR2(cloneControlPoints, this._knots.slice());
    }
    optimizerStep(step) {
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            this._controlPoints[i].x += step[i];
            this._controlPoints[i].y += step[i + this._controlPoints.length];
        }
    }
    /**
     *
     * @param fromU Parametric position where the section start
     * @param toU Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
    extract(fromU, toU) {
        let spline = this.clone();
        spline.clamp(fromU);
        spline.clamp(toU);
        const newFromSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(fromU, spline._knots, spline._degree);
        const newToSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(toU, spline._knots, spline._degree);
        let newKnots = [];
        let newControlPoints = [];
        for (let i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline._knots[i]);
        }
        for (let i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector2d_1.Vector2d(spline._controlPoints[i].x, spline._controlPoints[i].y));
        }
        return new BSplineR1toR2(newControlPoints, newKnots);
    }
    elevateDegree(times = 1) {
        const sx = new BSplineR1toR1_1.BSplineR1toR1(this.getControlPointsX(), this.knots);
        const sy = new BSplineR1toR1_1.BSplineR1toR1(this.getControlPointsY(), this.knots);
        const bdsx = sx.bernsteinDecomposition();
        const bdsy = sy.bernsteinDecomposition();
        bdsx.elevateDegree();
        bdsy.elevateDegree();
        const knots = this.distinctKnots();
        const sxNew = BernsteinDecompositionR1toR1_1.splineRecomposition(bdsx, knots);
        const syNew = BernsteinDecompositionR1toR1_1.splineRecomposition(bdsy, knots);
        let newcp = [];
        for (let i = 0; i < sxNew.controlPoints.length; i += 1) {
            newcp.push(new Vector2d_1.Vector2d(sxNew.controlPoints[i], syNew.controlPoints[i]));
        }
        let newSpline = new BSplineR1toR2(newcp, sxNew.knots);
        for (let i = 0; i < knots.length; i += 1) {
            let m = this.knotMultiplicity(Piegl_Tiller_NURBS_Book_1.findSpan(knots[i], this.knots, this.degree));
            for (let j = 0; j < newSpline.degree - m - 1; j += 1) {
                newSpline.removeKnot(Piegl_Tiller_NURBS_Book_1.findSpan(newSpline.knots[i], newSpline.knots, newSpline.degree));
            }
        }
        this.controlPoints = newSpline.controlPoints;
        this.knots = newSpline.knots;
        this._degree = newSpline.degree;
    }
    removeKnot(indexFromFindSpan, tolerance = 10e-5) {
        //Piegl and Tiller, The NURBS book, p : 185
        const index = indexFromFindSpan;
        // end knots are not removed
        if (index > this._degree && index < this.knots.length - this._degree - 1) {
            throw new Error("index out of range");
        }
        //const double tolerance = 1;
        const multiplicity = this.knotMultiplicity(index);
        const last = index - multiplicity;
        const first = index - this.degree;
        const offset = first - 1;
        //std::vector<vectorType> local(2*degree+1);
        let local = [];
        local[0] = this.controlPoints[offset];
        local[last + 1 - offset] = this.controlPoints[last + 1];
        let i = first;
        let j = last;
        let ii = 1;
        let jj = last - offset;
        let removable = false;
        // Compute new control point for one removal step
        while (j > i) {
            let alpha_i = (this.knots[index] - this.knots[i]) / (this.knots[i + this.degree + 1] - this.knots[i]);
            let alpha_j = (this.knots[index] - this.knots[j]) / (this.knots[j + this.degree + 1] - this.knots[j]);
            local[ii] = (this.controlPoints[i].substract(local[ii - 1].multiply(1.0 - alpha_i))).multiply(1 / alpha_i);
            local[jj] = (this.controlPoints[j].substract(local[jj + 1].multiply(alpha_j))).multiply(1 / (1.0 - alpha_j));
            ++i;
            ++ii;
            --j;
            --jj;
        }
        if (j < i) {
            if ((local[ii - 1].substract(local[jj + 1])).norm() <= tolerance) {
                removable = true;
            }
        }
        else {
            const alpha_i = (this.knots[index] - this.knots[i]) / (this.knots[i + this.degree + 1] - this.knots[i]);
            if (((this.controlPoints[i].substract((local[ii + 1].multiply(alpha_i)))).add(local[ii - 1].multiply(1.0 - alpha_i))).norm() <= tolerance) {
                removable = true;
            }
        }
        if (removable == false)
            return;
        else {
            let i = first;
            let j = last;
            while (j > i) {
                this.controlPoints[i] = local[i - offset];
                this.controlPoints[j] = local[j - offset];
                ++i;
                --j;
            }
        }
        this.knots.splice(index, 1);
        const fout = (2 * index - multiplicity - this.degree) / 2;
        this._controlPoints.splice(fout, 1);
    }
    distinctKnots() {
        let result = [this.knots[0]];
        let temp = result[0];
        for (let i = 1; i < this.knots.length; i += 1) {
            if (this.knots[i] !== temp) {
                result.push(this.knots[i]);
                temp = this.knots[i];
            }
        }
        return result;
    }
}
exports.BSplineR1toR2 = BSplineR1toR2;
function create_BSplineR1toR2(controlPoints, knots) {
    let newControlPoints = [];
    for (let cp of controlPoints) {
        newControlPoints.push(new Vector2d_1.Vector2d(cp[0], cp[1]));
    }
    return new BSplineR1toR2(newControlPoints, knots);
}
exports.create_BSplineR1toR2 = create_BSplineR1toR2;


/***/ }),

/***/ "./src/bsplines/BSplineR1toR2DifferentialProperties.ts":
/*!*************************************************************!*\
  !*** ./src/bsplines/BSplineR1toR2DifferentialProperties.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractBSplineR1toR2DifferentialProperties_1 = __webpack_require__(/*! ./AbstractBSplineR1toR2DifferentialProperties */ "./src/bsplines/AbstractBSplineR1toR2DifferentialProperties.ts");
const BSplineR1toR1_1 = __webpack_require__(/*! ./BSplineR1toR1 */ "./src/bsplines/BSplineR1toR1.ts");
class BSplineR1toR2DifferentialProperties extends AbstractBSplineR1toR2DifferentialProperties_1.AbstractBSplineR1toR2DifferentialProperties {
    constructor(spline) {
        super(spline);
    }
    bSplineR1toR1Factory(controlPoints, knots) {
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    }
}
exports.BSplineR1toR2DifferentialProperties = BSplineR1toR2DifferentialProperties;


/***/ }),

/***/ "./src/bsplines/BSplineR1toR3.ts":
/*!***************************************!*\
  !*** ./src/bsplines/BSplineR1toR3.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Piegl_Tiller_NURBS_Book_1 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/bsplines/Piegl_Tiller_NURBS_Book.ts");
const Vector3d_1 = __webpack_require__(/*! ../mathVector/Vector3d */ "./src/mathVector/Vector3d.ts");
const AbstractBSplineR1toR3_1 = __webpack_require__(/*! ./AbstractBSplineR1toR3 */ "./src/bsplines/AbstractBSplineR1toR3.ts");
/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
class BSplineR1toR3 extends AbstractBSplineR1toR3_1.AbstractBSplineR1toR3 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [new Vector3d_1.Vector3d(0, 0, 0)], knots = [0, 1]) {
        super(controlPoints, knots);
    }
    get freeControlPoints() {
        return this.controlPoints;
    }
    /**
     * Return a deep copy of this b-spline
     */
    clone() {
        let cloneControlPoints = AbstractBSplineR1toR3_1.deepCopyControlPoints(this._controlPoints);
        return new BSplineR1toR3(cloneControlPoints, this._knots.slice());
    }
    optimizerStep(step) {
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            this._controlPoints[i].x += step[i];
            this._controlPoints[i].y += step[i + this._controlPoints.length];
            this._controlPoints[i].z += step[i + 2 * this._controlPoints.length];
        }
    }
    /**
     *
     * @param fromU Parametric position where the section start
     * @param toU Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
    extract(fromU, toU) {
        let spline = this.clone();
        spline.clamp(fromU);
        spline.clamp(toU);
        const newFromSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(fromU, spline._knots, spline._degree);
        const newToSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(toU, spline._knots, spline._degree);
        let newKnots = [];
        let newControlPoints = [];
        for (let i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline._knots[i]);
        }
        for (let i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector3d_1.Vector3d(spline._controlPoints[i].x, spline._controlPoints[i].y));
        }
        return new BSplineR1toR3(newControlPoints, newKnots);
    }
}
exports.BSplineR1toR3 = BSplineR1toR3;
function create_BSplineR1toR3(controlPoints, knots) {
    let newControlPoints = [];
    for (let cp of controlPoints) {
        newControlPoints.push(new Vector3d_1.Vector3d(cp[0], cp[1], cp[2]));
    }
    return new BSplineR1toR3(newControlPoints, knots);
}
exports.create_BSplineR1toR3 = create_BSplineR1toR3;


/***/ }),

/***/ "./src/bsplines/BSplineR1toR3DifferentialProperties.ts":
/*!*************************************************************!*\
  !*** ./src/bsplines/BSplineR1toR3DifferentialProperties.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BSplineR1toR1_1 = __webpack_require__(/*! ./BSplineR1toR1 */ "./src/bsplines/BSplineR1toR1.ts");
class BSplineR1toR3DifferentialProperties {
    constructor(spline) {
        this._spline = spline.clone();
        this.derivatives = this.computeDerivatives(this._spline);
    }
    bSplineR1toR1Factory(controlPoints, knots) {
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    }
    computeDerivatives(spline) {
        const sx = this.bSplineR1toR1Factory(spline.getControlPointsX(), spline.knots);
        const sy = this.bSplineR1toR1Factory(spline.getControlPointsY(), spline.knots);
        const sz = this.bSplineR1toR1Factory(spline.getControlPointsZ(), spline.knots);
        const sxu = sx.derivative();
        const syu = sy.derivative();
        const szu = sz.derivative();
        const sxuu = sxu.derivative();
        const syuu = syu.derivative();
        const szuu = szu.derivative();
        const sxuuu = sxuu.derivative();
        const syuuu = syuu.derivative();
        const szuuu = szuu.derivative();
        return {
            xu: sxu.bernsteinDecomposition(),
            yu: syu.bernsteinDecomposition(),
            zu: szu.bernsteinDecomposition(),
            xuu: sxuu.bernsteinDecomposition(),
            yuu: syuu.bernsteinDecomposition(),
            zuu: szuu.bernsteinDecomposition(),
            xuuu: sxuuu.bernsteinDecomposition(),
            yuuu: syuuu.bernsteinDecomposition(),
            zuuu: szuuu.bernsteinDecomposition()
        };
    }
    torsionNumerator() {
        const s = this.derivatives;
        const t1 = s.yu.multiply(s.zuu).subtract(s.yuu.multiply(s.zu));
        const t2 = s.xuu.multiply(s.zu).subtract(s.xu.multiply(s.zuu));
        const t3 = s.xu.multiply(s.yuu).subtract(s.xuu.multiply(s.yu));
        const distinctKnots = this._spline.getDistinctKnots();
        const result = s.xuuu.multiply(t1).add(s.yuuu.multiply(t2).add(s.zuuu.multiply(t3)));
        return result.splineRecomposition(distinctKnots);
    }
    curvatureSquaredNumerator() {
        const s = this.derivatives;
        const t1 = s.zuu.multiply(s.yu).subtract(s.yuu.multiply(s.zu));
        const t2 = s.xuu.multiply(s.zu).subtract(s.zuu.multiply(s.xu));
        const t3 = s.yuu.multiply(s.xu).subtract(s.xuu.multiply(s.yu));
        const result = (t1.multiply(t1).add(t2.multiply(t2)).add(t3.multiply(t3)));
        const distinctKnots = this._spline.getDistinctKnots();
        return result.splineRecomposition(distinctKnots);
    }
    curvatureSquaredDerivativeNumerator() {
        const s = this.derivatives;
        const t1 = s.zuu.multiply(s.yu).subtract(s.yuu.multiply(s.zu));
        const t2 = s.xuu.multiply(s.zu).subtract(s.zuu.multiply(s.xu));
        const t3 = s.yuu.multiply(s.xu).subtract(s.xuu.multiply(s.yu));
        const t4 = s.zuuu.multiply(s.yu).subtract(s.yuuu.multiply(s.zu));
        const t5 = s.xuuu.multiply(s.zu).subtract(s.zuuu.multiply(s.xu));
        const t6 = s.yuuu.multiply(s.xu).subtract(s.xuuu.multiply(s.yu));
        const t7 = s.xu.multiply(s.xu).add(s.yu.multiply(s.yu)).add(s.zu.multiply(s.zu));
        const t8 = s.xu.multiply(s.xuu).add(s.yu.multiply(s.yuu)).add(s.zu.multiply(s.zuu));
        const t9 = ((t1.multiply(t4)).add(t2.multiply(t5)).add(t3.multiply(t6))).multiply(t7);
        const t10 = (t1.multiply(t1).add(t2.multiply(t2)).add(t3.multiply(t3))).multiply(t8);
        const result = t9.subtract(t10.multiplyByScalar(3));
        const distinctKnots = this._spline.getDistinctKnots();
        return result.splineRecomposition(distinctKnots);
    }
    curvatureDerivativeZeros() {
        const curvatureDerivative = this.curvatureSquaredDerivativeNumerator();
        const zeros = curvatureDerivative.zeros();
        let result = [];
        for (let z of zeros) {
            result.push(this._spline.evaluate(z));
        }
        return result;
    }
    torsionZeros() {
        const torsionNumerator = this.torsionNumerator();
        const zeros = torsionNumerator.zeros();
        let result = [];
        for (let z of zeros) {
            result.push(this._spline.evaluate(z));
        }
        return result;
    }
}
exports.BSplineR1toR3DifferentialProperties = BSplineR1toR3DifferentialProperties;


/***/ }),

/***/ "./src/bsplines/BernsteinDecompositionR1toR1.ts":
/*!******************************************************!*\
  !*** ./src/bsplines/BernsteinDecompositionR1toR1.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BinomialCoefficient_1 = __webpack_require__(/*! ./BinomialCoefficient */ "./src/bsplines/BinomialCoefficient.ts");
const BSplineR1toR1_1 = __webpack_require__(/*! ./BSplineR1toR1 */ "./src/bsplines/BSplineR1toR1.ts");
/**
* A Bernstein decomposition of a B-Spline function from a one dimensional real space to a one dimensional real space
*/
class BernsteinDecompositionR1toR1 {
    /**
     *
     * @param controlPointsArray An array of array of control points
     */
    constructor(controlPointsArray = []) {
        this.controlPointsArray = controlPointsArray;
    }
    add(bd) {
        let result = [];
        for (let i = 0; i < bd.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (let j = 0; j < bd.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] + bd.controlPointsArray[i][j];
            }
        }
        return new BernsteinDecompositionR1toR1(result);
    }
    subtract(bd) {
        let result = [];
        for (let i = 0; i < bd.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (let j = 0; j < bd.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] - bd.controlPointsArray[i][j];
            }
        }
        return new BernsteinDecompositionR1toR1(result);
    }
    multiply(bd) {
        return new BernsteinDecompositionR1toR1(this.bernsteinMultiplicationArray(this.controlPointsArray, bd.controlPointsArray));
    }
    multiplyRange(bd, start, lessThan) {
        let result = [];
        for (let i = start; i < lessThan; i += 1) {
            result[i - start] = this.bernsteinMultiplication(this.controlPointsArray[i], bd.controlPointsArray[i]);
        }
        return new BernsteinDecompositionR1toR1(result);
    }
    multiplyRange2(bd, start, lessThan) {
        let result = [];
        for (let i = start; i < lessThan; i += 1) {
            result[i - start] = this.bernsteinMultiplication(this.controlPointsArray[i - start], bd.controlPointsArray[i]);
        }
        return new BernsteinDecompositionR1toR1(result);
    }
    bernsteinMultiplicationArray(f, g) {
        let result = [];
        for (let i = 0; i < f.length; i += 1) {
            result[i] = this.bernsteinMultiplication(f[i], g[i]);
        }
        return result;
    }
    bernsteinMultiplication(f, g) {
        const f_degree = f.length - 1;
        const g_degree = g.length - 1;
        let result = [];
        for (let k = 0; k < f_degree + g_degree + 1; k += 1) {
            let cp = 0;
            for (let i = Math.max(0, k - g_degree); i < Math.min(f_degree, k) + 1; i += 1) {
                let bfu = BernsteinDecompositionR1toR1.binomial(f_degree, i);
                let bgu = BernsteinDecompositionR1toR1.binomial(g_degree, k - i);
                let bfugu = BernsteinDecompositionR1toR1.binomial(f_degree + g_degree, k);
                cp += bfu * bgu / bfugu * f[i] * g[k - i];
            }
            result[k] = cp;
        }
        return result;
    }
    multiplyByScalar(value) {
        let result = [];
        for (let i = 0; i < this.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (let j = 0; j < this.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] * value;
            }
        }
        return new BernsteinDecompositionR1toR1(result);
    }
    addScalar(value) {
        let result = [];
        for (let i = 0; i < this.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (let j = 0; j < this.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] + value;
            }
        }
        return new BernsteinDecompositionR1toR1(result);
    }
    flattenControlPointsArray() {
        return this.controlPointsArray.reduce(function (acc, val) {
            return acc.concat(val);
        }, []);
    }
    subset(start, lessThan) {
        return new BernsteinDecompositionR1toR1(this.controlPointsArray.slice(start, lessThan));
    }
    elevateDegree(times = 1) {
        let newControlPointsArray = [];
        for (let i = 0; i < this.controlPointsArray.length; i += 1) {
            newControlPointsArray.push(this.elevateDegreeB(this.controlPointsArray[i], times));
        }
        this.controlPointsArray = newControlPointsArray;
    }
    elevateDegreeB(controlPoints, times = 1) {
        const degree = controlPoints.length - 1;
        let result = [];
        for (let i = 0; i < controlPoints.length + times; i += 1) {
            let cp = 0;
            for (let j = Math.max(0, i - times); j <= Math.min(degree, i); j += 1) {
                const bc0 = BinomialCoefficient_1.binomialCoefficient(times, i - j);
                const bc1 = BinomialCoefficient_1.binomialCoefficient(degree, j);
                const bc2 = BinomialCoefficient_1.binomialCoefficient(degree + times, i);
                cp += bc0 * bc1 / bc2 * controlPoints[j];
            }
            result.push(cp);
        }
        return result;
    }
    splineRecomposition(distinctKnots) {
        const cp = this.flattenControlPointsArray();
        const degree = this.getDegree();
        let knots = [];
        for (let i = 0; i < distinctKnots.length; i += 1) {
            for (let j = 0; j < degree + 1; j += 1) {
                knots.push(distinctKnots[i]);
            }
        }
        return new BSplineR1toR1_1.BSplineR1toR1(cp, knots);
    }
    getDegree() {
        return this.controlPointsArray[0].length - 1;
    }
}
exports.BernsteinDecompositionR1toR1 = BernsteinDecompositionR1toR1;
BernsteinDecompositionR1toR1.binomial = BinomialCoefficient_1.memoizedBinomialCoefficient();
BernsteinDecompositionR1toR1.flopsCounter = 0;
function splineRecomposition(bernsteinDecomposiiton, distinctKnots) {
    const cp = bernsteinDecomposiiton.flattenControlPointsArray();
    const degree = bernsteinDecomposiiton.getDegree();
    let knots = [];
    for (let distinctKnot of distinctKnots) {
        for (let j = 0; j < degree + 1; j += 1) {
            knots.push(distinctKnot);
        }
    }
    return new BSplineR1toR1_1.BSplineR1toR1(cp, knots);
}
exports.splineRecomposition = splineRecomposition;
function determinant2by2(ax, ay, bx, by) {
    return (ax.multiply(by)).subtract(bx.multiply(ay));
}
exports.determinant2by2 = determinant2by2;


/***/ }),

/***/ "./src/bsplines/BinomialCoefficient.ts":
/*!*********************************************!*\
  !*** ./src/bsplines/BinomialCoefficient.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function binomialCoefficient(n, k) {
    let result = 1;
    if (n < k || k < 0) {
        return 0;
    }
    // take advantage of symmetry
    if (k > n - k) {
        k = n - k;
    }
    for (let x = n - k + 1; x <= n; x += 1) {
        result *= x;
    }
    for (let x = 1; x <= k; x += 1) {
        result /= x;
    }
    return result;
}
exports.binomialCoefficient = binomialCoefficient;
function memoizedBinomialCoefficient() {
    let cache = [];
    return (n, k) => {
        if (cache[n] !== undefined && cache[n][k] !== undefined) {
            return cache[n][k];
        }
        else {
            if (cache[n] === undefined) {
                cache[n] = [];
            }
            const result = binomialCoefficient(n, k);
            cache[n][k] = result;
            return result;
        }
    };
}
exports.memoizedBinomialCoefficient = memoizedBinomialCoefficient;


/***/ }),

/***/ "./src/bsplines/PeriodicBSplineR1toR1.ts":
/*!***********************************************!*\
  !*** ./src/bsplines/PeriodicBSplineR1toR1.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
const AbstractBSplineR1toR1_1 = __webpack_require__(/*! ./AbstractBSplineR1toR1 */ "./src/bsplines/AbstractBSplineR1toR1.ts");
const BernsteinDecompositionR1toR1_1 = __webpack_require__(/*! ./BernsteinDecompositionR1toR1 */ "./src/bsplines/BernsteinDecompositionR1toR1.ts");
const BSplineR1toR1_1 = __webpack_require__(/*! ./BSplineR1toR1 */ "./src/bsplines/BSplineR1toR1.ts");
const BSplineR1toR2_1 = __webpack_require__(/*! ./BSplineR1toR2 */ "./src/bsplines/BSplineR1toR2.ts");
const Piegl_Tiller_NURBS_Book_1 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/bsplines/Piegl_Tiller_NURBS_Book.ts");
/**
 * A B-Spline function from a one dimensional real periodic space to a one dimensional real space
 */
class PeriodicBSplineR1toR1 extends AbstractBSplineR1toR1_1.AbstractBSplineR1toR1 {
    constructor(controlPoints = [0], knots = [0, 1]) {
        super(controlPoints, knots);
    }
    bernsteinDecomposition() {
        const s = this.clone();
        const degree = this._degree;
        s.clamp(s.knots[degree]);
        s.clamp(s.knots[s.knots.length - degree - 1]);
        const newControlPoints = s.controlPoints.slice(degree, s.controlPoints.length - degree);
        const newKnots = s.knots.slice(degree, s.knots.length - degree);
        //return decomposeFunction(new BSplineR1toR1(newControlPoints, newKnots))
        return new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1(Piegl_Tiller_NURBS_Book_1.decomposeFunction(new BSplineR1toR1_1.BSplineR1toR1(newControlPoints, newKnots)));
    }
    clone() {
        return new PeriodicBSplineR1toR1(this._controlPoints.slice(), this._knots.slice());
    }
    derivative() {
        let newControlPoints = [];
        let newKnots = [];
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            newControlPoints[i] = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree / (this._knots[i + this._degree + 1] - this._knots[i + 1]));
        }
        newKnots = this._knots.slice(1, this._knots.length - 1);
        return new PeriodicBSplineR1toR1(newControlPoints, newKnots);
    }
    curve() {
        let x = this.grevilleAbscissae();
        let cp = [];
        for (let i = 0; i < x.length; i += 1) {
            cp.push(new Vector2d_1.Vector2d(x[i], this._controlPoints[i]));
        }
        return new BSplineR1toR2_1.BSplineR1toR2(cp, this._knots.slice());
    }
}
exports.PeriodicBSplineR1toR1 = PeriodicBSplineR1toR1;


/***/ }),

/***/ "./src/bsplines/PeriodicBSplineR1toR2.ts":
/*!***********************************************!*\
  !*** ./src/bsplines/PeriodicBSplineR1toR2.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
const AbstractBSplineR1toR2_1 = __webpack_require__(/*! ./AbstractBSplineR1toR2 */ "./src/bsplines/AbstractBSplineR1toR2.ts");
const BSplineR1toR2_1 = __webpack_require__(/*! ./BSplineR1toR2 */ "./src/bsplines/BSplineR1toR2.ts");
const Piegl_Tiller_NURBS_Book_1 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/bsplines/Piegl_Tiller_NURBS_Book.ts");
/**
 * A B-Spline function from a one dimensional real periodic space to a two dimensional real space
 */
class PeriodicBSplineR1toR2 extends AbstractBSplineR1toR2_1.AbstractBSplineR1toR2 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [new Vector2d_1.Vector2d(0, 0)], knots = [0, 1]) {
        super(controlPoints, knots);
    }
    get periodicControlPointsLength() {
        return this._controlPoints.length - this._degree;
    }
    get freeControlPoints() {
        let periodicControlPoints = [];
        for (let i = 0; i < this.periodicControlPointsLength; i += 1) {
            periodicControlPoints.push(this._controlPoints[i].clone());
        }
        return periodicControlPoints;
    }
    getClampSpline() {
        const s = this.clone();
        const degree = this._degree;
        s.clamp(s.knots[degree]);
        s.clamp(s.knots[s.knots.length - degree - 1]);
        const newControlPoints = s.controlPoints.slice(degree, s.controlPoints.length - degree);
        const newKnots = s.knots.slice(degree, s.knots.length - degree);
        return new BSplineR1toR2_1.BSplineR1toR2(newControlPoints, newKnots);
    }
    /**
     * Return a deep copy of this b-spline
     */
    clone() {
        let cloneControlPoints = AbstractBSplineR1toR2_1.deepCopyControlPoints(this._controlPoints);
        return new PeriodicBSplineR1toR2(cloneControlPoints, this._knots.slice());
    }
    optimizerStep(step) {
        const n = this.periodicControlPointsLength;
        for (let i = 0; i < n; i += 1) {
            this.moveControlPoint(i, step[i], step[i + n]);
        }
    }
    moveControlPoint(i, deltaX, deltaY) {
        if (i < 0 || i >= this.periodicControlPointsLength) {
            throw new Error("Control point indentifier is out of range");
        }
        super.moveControlPoint(i, deltaX, deltaY);
        let n = this.periodicControlPointsLength;
        if (i < this.degree) {
            super.setControlPointPosition(n + i, this.getControlPoint(i));
        }
    }
    /**
     *
     * @param fromU Parametric position where the section start
     * @param toU Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
    extract(fromU, toU) {
        let spline = this.clone();
        spline.clamp(fromU);
        spline.clamp(toU);
        const newFromSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(fromU, spline._knots, spline._degree);
        const newToSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(toU, spline._knots, spline._degree);
        let newKnots = [];
        let newControlPoints = [];
        for (let i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline._knots[i]);
        }
        for (let i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector2d_1.Vector2d(spline._controlPoints[i].x, spline._controlPoints[i].y));
        }
        return new BSplineR1toR2_1.BSplineR1toR2(newControlPoints, newKnots);
    }
    getDistinctKnots() {
        const result = super.getDistinctKnots();
        return result.slice(this.degree, result.length - this.degree);
    }
    setControlPointPosition(i, value) {
        if (i < 0 || i >= this.periodicControlPointsLength) {
            throw new Error("Control point indentifier is out of range");
        }
        super.setControlPointPosition(i, value.clone());
        if (i < this._degree) {
            const j = this.periodicControlPointsLength + i;
            super.setControlPointPosition(j, value.clone());
        }
    }
    insertKnot(u) {
        super.insertKnot(u, 1);
        if (u < this._knots[2 * this._degree]) {
            let newKnots = [];
            let newControlPoints = [];
            for (let i = 0; i < this._knots.length - 2 * this._degree; i += 1) {
                newKnots.push(this._knots[i]);
            }
            const ui = newKnots[newKnots.length - 1];
            for (let i = 1; i < 2 * this._degree + 1; i += 1) {
                newKnots.push(ui + (this._knots[i] - this._knots[0]));
            }
            for (let i = 0; i < this._controlPoints.length - this._degree; i += 1) {
                newControlPoints.push(new Vector2d_1.Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
            }
            for (let i = 0; i < this._degree; i += 1) {
                newControlPoints.push(new Vector2d_1.Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
            }
            this._controlPoints = newControlPoints;
            this._knots = newKnots;
        }
        if (u > this._knots[this._knots.length - 1 - 2 * this._degree]) {
            let newKnots = [];
            let newControlPoints = [];
            const periodicIndex = this._knots.length - 1 - 2 * this._degree;
            const ui = this._knots[periodicIndex];
            for (let i = 0; i < 2 * this._degree; i += 1) {
                newKnots.push(this._knots[1] + (this._knots[i + periodicIndex] - ui));
            }
            for (let i = 2 * this._degree; i < this._knots.length; i += 1) {
                newKnots.push(this._knots[i]);
            }
            const cpi = this._controlPoints.length - this._degree;
            for (let i = 0; i < this._degree; i += 1) {
                newControlPoints.push(new Vector2d_1.Vector2d(this._controlPoints[cpi + i].x, this._controlPoints[cpi + i].y));
            }
            for (let i = this._degree; i < this._controlPoints.length; i += 1) {
                newControlPoints.push(new Vector2d_1.Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
            }
            this._controlPoints = newControlPoints;
            this._knots = newKnots;
        }
    }
}
exports.PeriodicBSplineR1toR2 = PeriodicBSplineR1toR2;
function create_PeriodicBSplineR1toR2(controlPoints, knots) {
    let newControlPoints = [];
    for (let cp of controlPoints) {
        newControlPoints.push(new Vector2d_1.Vector2d(cp[0], cp[1]));
    }
    return new PeriodicBSplineR1toR2(newControlPoints, knots);
}
exports.create_PeriodicBSplineR1toR2 = create_PeriodicBSplineR1toR2;


/***/ }),

/***/ "./src/bsplines/PeriodicBSplineR1toR2DifferentialProperties.ts":
/*!*********************************************************************!*\
  !*** ./src/bsplines/PeriodicBSplineR1toR2DifferentialProperties.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractBSplineR1toR2DifferentialProperties_1 = __webpack_require__(/*! ./AbstractBSplineR1toR2DifferentialProperties */ "./src/bsplines/AbstractBSplineR1toR2DifferentialProperties.ts");
const PeriodicBSplineR1toR1_1 = __webpack_require__(/*! ./PeriodicBSplineR1toR1 */ "./src/bsplines/PeriodicBSplineR1toR1.ts");
class PeriodicBSplineR1toR2DifferentialProperties extends AbstractBSplineR1toR2DifferentialProperties_1.AbstractBSplineR1toR2DifferentialProperties {
    constructor(spline) {
        super(spline);
    }
    bSplineR1toR1Factory(controlPoints, knots) {
        return new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(controlPoints, knots);
    }
    curvatureExtrema(curvatureDerivativeNumerator) {
        if (!curvatureDerivativeNumerator) {
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
        }
        const zeros = curvatureDerivativeNumerator.zeros(10e-3);
        let result = [];
        for (let z of zeros) {
            result.push(this._spline.evaluate(z));
        }
        const a = curvatureDerivativeNumerator.controlPoints[0];
        const b = curvatureDerivativeNumerator.controlPoints[curvatureDerivativeNumerator.controlPoints.length - 1];
        if (a * b < 0) { // a and b have different sign
            const u = curvatureDerivativeNumerator.knots[curvatureDerivativeNumerator.knots.length - 1];
            result.push(this._spline.evaluate(u));
        }
        return result;
    }
}
exports.PeriodicBSplineR1toR2DifferentialProperties = PeriodicBSplineR1toR2DifferentialProperties;


/***/ }),

/***/ "./src/bsplines/Piegl_Tiller_NURBS_Book.ts":
/*!*************************************************!*\
  !*** ./src/bsplines/Piegl_Tiller_NURBS_Book.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Returns the span index
 * @param u parameter
 * @param knots knot vector
 * @param degree degree
 * @returns span index i for which knots[i] ≤ u < knots[i+1]
 */
function findSpan(u, knots, degree) {
    // Bibliographic reference : Piegl and Tiller, The NURBS book, p: 68
    if (u < knots[degree] || u > knots[knots.length - degree - 1]) {
        console.log("u: " + u);
        console.log("knots: " + knots);
        console.log("degree: " + degree);
        throw new Error("Error: parameter u is outside valid span");
    }
    // Special case
    if (u === knots[knots.length - degree - 1]) {
        return knots.length - degree - 2;
    }
    // Do binary search
    let low = degree;
    let high = knots.length - 1 - degree;
    let i = Math.floor((low + high) / 2);
    while (!(knots[i] <= u && u < knots[i + 1])) {
        if (u < knots[i]) {
            high = i;
        }
        else {
            low = i;
        }
        i = Math.floor((low + high) / 2);
    }
    return i;
}
exports.findSpan = findSpan;
/**
 * Returns the span index used for clamping a periodic B-Spline
 * Note: The only difference with findSpan is the special case u = knots[-degree - 1]
 * @param u parameter
 * @param knots knot vector
 * @param degree degree
 * @returns span index i for which knots[i] ≤ u < knots[i+1]
 */
function clampingFindSpan(u, knots, degree) {
    // Bibliographic reference : Piegl and Tiller, The NURBS book, p: 68
    if (u < knots[degree] || u > knots[knots.length - degree - 1]) {
        throw new Error("Error: parameter u is outside valid span");
    }
    // Special case
    if (u === knots[knots.length - degree - 1]) {
        return knots.length - degree - 1;
    }
    // Do binary search
    let low = degree;
    let high = knots.length - 1 - degree;
    let i = Math.floor((low + high) / 2);
    while (!(knots[i] <= u && u < knots[i + 1])) {
        if (u < knots[i]) {
            high = i;
        }
        else {
            low = i;
        }
        i = Math.floor((low + high) / 2);
    }
    return i;
}
exports.clampingFindSpan = clampingFindSpan;
/**
 * Returns the basis functions values
 * @param span span index
 * @param u parameter
 * @param knots knot vector
 * @param degree degree
 * @returns the array of values evaluated at u
 */
function basisFunctions(span, u, knots, degree) {
    // Bibliographic reference : The NURBS BOOK, p.70
    let result = [1];
    let left = [];
    let right = [];
    for (let j = 1; j <= degree; j += 1) {
        left[j] = u - knots[span + 1 - j];
        right[j] = knots[span + j] - u;
        let saved = 0.0;
        for (let r = 0; r < j; r += 1) {
            let temp = result[r] / (right[r + 1] + left[j - r]);
            result[r] = saved + right[r + 1] * temp;
            saved = left[j - r] * temp;
        }
        result[j] = saved;
    }
    return result;
}
exports.basisFunctions = basisFunctions;
/**
 * Decompose a BSpline function into Bézier segments
 */
function decomposeFunction(spline) {
    //Piegl and Tiller, The NURBS book, p.173
    let result = [];
    const number_of_bezier_segments = spline.distinctKnots().length - 1;
    for (let i = 0; i < number_of_bezier_segments; i += 1) {
        result.push([]);
    }
    for (let i = 0; i <= spline.degree; i += 1) {
        result[0][i] = spline.controlPoints[i];
    }
    let a = spline.degree;
    let b = spline.degree + 1;
    let bezier_segment = 0;
    let alphas = [];
    while (b < spline.knots.length - 1) {
        let i = b;
        while (b < spline.knots.length - 1 && spline.knots[b + 1] === spline.knots[b]) {
            b += 1;
        }
        let mult = b - i + 1;
        if (mult < spline.degree) {
            let numer = spline.knots[b] - spline.knots[a]; // Numerator of alpha
            // Compute and store alphas
            for (let j = spline.degree; j > mult; j -= 1) {
                alphas[j - mult - 1] = numer / (spline.knots[a + j] - spline.knots[a]);
            }
            let r = spline.degree - mult; // insert knot r times
            for (let j = 1; j <= r; j += 1) {
                let save = r - j;
                let s = mult + j; // this many new controlPoints
                for (let k = spline.degree; k >= s; k -= 1) {
                    let alpha = alphas[k - s];
                    result[bezier_segment][k] = (result[bezier_segment][k] * alpha) + (result[bezier_segment][k - 1] * (1 - alpha));
                }
                if (b < spline.knots.length) {
                    result[bezier_segment + 1][save] = result[bezier_segment][spline.degree]; // next segment
                }
            }
        }
        bezier_segment += 1; // Bezier segment completed
        if (b < spline.knots.length - 1) {
            //initialize next bezier_segment
            for (i = Math.max(0, spline.degree - mult); i <= spline.degree; i += 1) {
                result[bezier_segment][i] = spline.controlPoints[b - spline.degree + i];
            }
            a = b;
            b += 1;
        }
    }
    return result;
}
exports.decomposeFunction = decomposeFunction;


/***/ }),

/***/ "./src/bsplines/RationalBSplineR1toR2.ts":
/*!***********************************************!*\
  !*** ./src/bsplines/RationalBSplineR1toR2.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
const Vector3d_1 = __webpack_require__(/*! ../mathVector/Vector3d */ "./src/mathVector/Vector3d.ts");
const BSplineR1toR3_1 = __webpack_require__(/*! ./BSplineR1toR3 */ "./src/bsplines/BSplineR1toR3.ts");
const RationalBSplineR1toR2Adapter_1 = __webpack_require__(/*! ./RationalBSplineR1toR2Adapter */ "./src/bsplines/RationalBSplineR1toR2Adapter.ts");
class RationalBSplineR1toR2 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [new Vector3d_1.Vector3d(0, 0, 1)], knots = [0, 1]) {
        this.spline = new BSplineR1toR3_1.BSplineR1toR3(controlPoints, knots);
    }
    get knots() {
        return this.spline.knots;
    }
    set knots(knots) {
        this.spline.knots = [...knots];
    }
    get degree() {
        return this.spline.degree;
    }
    get controlPoints() {
        return this.spline.controlPoints;
    }
    get freeControlPoints() {
        return this.spline.freeControlPoints;
    }
    set controlPoints(controlPoints) {
        this.spline.controlPoints = controlPoints;
    }
    evaluate(u) {
        let result = this.spline.evaluate(u);
        return new Vector2d_1.Vector2d(result.x / result.z, result.y / result.z);
    }
    controlPoints2D() {
        let result = [];
        for (let cp of this.spline.controlPoints) {
            result.push(new Vector2d_1.Vector2d(cp.x / cp.z, cp.y / cp.z));
        }
        return result;
    }
    clone() {
        return new RationalBSplineR1toR2(this.spline.controlPoints, this.spline.knots);
    }
    insertKnot(u, times = 1) {
        this.spline.insertKnot(u, times);
    }
    optimizerStep(step) {
        this.spline.optimizerStep(step);
    }
    extract(fromU, toU) {
        return this.spline.extract(fromU, toU);
    }
    getControlPointsX() {
        return this.spline.getControlPointsX();
    }
    getControlPointsY() {
        return this.spline.getControlPointsY();
    }
    getControlPointsW() {
        return this.spline.getControlPointsZ();
    }
    setControlPointPosition(index, value) {
        this.spline.setControlPointPosition(index, value);
    }
    setControlPointWeight(controlPointIndex, w) {
        const x = this.controlPoints[controlPointIndex].x;
        const y = this.controlPoints[controlPointIndex].y;
        const z = this.controlPoints[controlPointIndex].z;
        this.setControlPointPosition(controlPointIndex, new Vector3d_1.Vector3d(x * w / z, y * w / z, w));
    }
    getControlPointWeight(controlPointIndex) {
        return this.controlPoints[controlPointIndex].z;
    }
    distinctKnots() {
        let result = [this.knots[0]];
        let temp = result[0];
        for (let i = 1; i < this.knots.length; i += 1) {
            if (this.knots[i] !== temp) {
                result.push(this.knots[i]);
                temp = this.knots[i];
            }
        }
        return result;
    }
    getSplineAdapter() {
        return new RationalBSplineR1toR2Adapter_1.RationalBSplineR1toR2Adapter(this.controlPoints, this.knots);
    }
    grevilleAbscissae() {
        let result = [];
        for (let i = 0; i < this.spline.controlPoints.length; i += 1) {
            let sum = 0;
            for (let j = i + 1; j < i + this.spline.degree + 1; j += 1) {
                sum += this.spline.knots[j];
            }
            result.push(sum / this.spline.degree);
        }
        return result;
    }
}
exports.RationalBSplineR1toR2 = RationalBSplineR1toR2;
function create_RationalBSplineR1toR2(controlPoints, knots) {
    let newControlPoints = [];
    for (let cp of controlPoints) {
        newControlPoints.push(new Vector3d_1.Vector3d(cp[0], cp[1], cp[2]));
    }
    return new RationalBSplineR1toR2(newControlPoints, knots);
}
exports.create_RationalBSplineR1toR2 = create_RationalBSplineR1toR2;


/***/ }),

/***/ "./src/bsplines/RationalBSplineR1toR2Adapter.ts":
/*!******************************************************!*\
  !*** ./src/bsplines/RationalBSplineR1toR2Adapter.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector3d_1 = __webpack_require__(/*! ../mathVector/Vector3d */ "./src/mathVector/Vector3d.ts");
const RationalBSplineR1toR2_1 = __webpack_require__(/*! ./RationalBSplineR1toR2 */ "./src/bsplines/RationalBSplineR1toR2.ts");
class RationalBSplineR1toR2Adapter {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [new Vector3d_1.Vector3d(0, 0, 1)], knots = [0, 1]) {
        this._spline = new RationalBSplineR1toR2_1.RationalBSplineR1toR2(controlPoints, knots);
    }
    getControlPointsX() {
        let result = [];
        for (let cp of this._spline.controlPoints) {
            result.push(cp.x);
        }
        return result;
    }
    getControlPointsY() {
        let result = [];
        for (let cp of this._spline.controlPoints) {
            result.push(cp.y);
        }
        return result;
    }
    moveControlPoint(i, deltaX, deltaY) {
        if (i < 0 || i >= this._spline.controlPoints.length - this._spline.degree) {
            throw new Error("Control point indentifier is out of range");
        }
        this._spline.controlPoints[i].x += deltaX;
        this._spline.controlPoints[i].y += deltaY;
    }
    setControlPointPosition(index, value) {
        const z = this._spline.controlPoints[index].z;
        this._spline.setControlPointPosition(index, new Vector3d_1.Vector3d(value.x * z, value.y * z, z));
    }
    get degree() {
        return this._spline.degree;
    }
    get knots() {
        return this._spline.knots;
    }
    get controlPoints() {
        return this._spline.controlPoints2D();
    }
    get freeControlPoints() {
        return this._spline.controlPoints2D();
    }
    clone() {
        return new RationalBSplineR1toR2Adapter(this._spline.controlPoints, this._spline.knots);
    }
    evaluate(u) {
        return this._spline.evaluate(u);
    }
    optimizerStep(step) {
    }
    getRationalBSplineR1toR2() {
        return this._spline.clone();
    }
    setControlPointWeight(controlPointIndex, w) {
        const x = this._spline.controlPoints[controlPointIndex].x;
        const y = this._spline.controlPoints[controlPointIndex].y;
        const z = this._spline.controlPoints[controlPointIndex].z;
        this._spline.setControlPointPosition(controlPointIndex, new Vector3d_1.Vector3d(x * w / z, y * w / z, w));
    }
    getControlPointWeight(controlPointIndex) {
        return this._spline.controlPoints[controlPointIndex].z;
    }
}
exports.RationalBSplineR1toR2Adapter = RationalBSplineR1toR2Adapter;


/***/ }),

/***/ "./src/bsplines/RationalBSplineR1toR2DifferentialProperties.ts":
/*!*********************************************************************!*\
  !*** ./src/bsplines/RationalBSplineR1toR2DifferentialProperties.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BernsteinDecompositionR1toR1_1 = __webpack_require__(/*! ./BernsteinDecompositionR1toR1 */ "./src/bsplines/BernsteinDecompositionR1toR1.ts");
const BSplineR1toR1_1 = __webpack_require__(/*! ./BSplineR1toR1 */ "./src/bsplines/BSplineR1toR1.ts");
class RationalBSplineR1toR2DifferentialProperties {
    constructor(spline) {
        this.spline = spline.clone();
        this.derivatives = this.computeDerivatives();
        this.ChenTerms = this.ComputeChenTerms();
    }
    bSplineR1toR1Factory(controlPoints, knots) {
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    }
    computeDerivatives() {
        const sx = this.bSplineR1toR1Factory(this.spline.getControlPointsX(), this.spline.knots);
        const sy = this.bSplineR1toR1Factory(this.spline.getControlPointsY(), this.spline.knots);
        const sw = this.bSplineR1toR1Factory(this.spline.getControlPointsW(), this.spline.knots);
        const sxu = sx.derivative();
        const syu = sy.derivative();
        const swu = sw.derivative();
        const sxuu = sxu.derivative();
        const syuu = syu.derivative();
        const swuu = swu.derivative();
        const sxuuu = sxuu.derivative();
        const syuuu = syuu.derivative();
        const swuuu = swuu.derivative();
        return {
            x: sx.bernsteinDecomposition(),
            y: sy.bernsteinDecomposition(),
            w: sw.bernsteinDecomposition(),
            xu: sxu.bernsteinDecomposition(),
            yu: syu.bernsteinDecomposition(),
            wu: swu.bernsteinDecomposition(),
            xuu: sxuu.bernsteinDecomposition(),
            yuu: syuu.bernsteinDecomposition(),
            wuu: swuu.bernsteinDecomposition(),
            xuuu: sxuuu.bernsteinDecomposition(),
            yuuu: syuuu.bernsteinDecomposition(),
            wuuu: swuuu.bernsteinDecomposition()
        };
    }
    ComputeChenTerms() {
        // reference: XIANMING CHEN, COMPLEXITY REDUCTION FOR SYMBOLIC COMPUTATION WITH RATIONAL B-SPLINES
        const s = this.derivatives;
        return {
            w: s.w,
            wu: s.wu,
            D1x: (s.xu.multiply(s.w)).subtract(s.x.multiply(s.wu)),
            D1y: (s.yu.multiply(s.w)).subtract(s.y.multiply(s.wu)),
            D2x: (s.xuu.multiply(s.w)).subtract(s.x.multiply(s.wuu)),
            D2y: (s.yuu.multiply(s.w)).subtract(s.y.multiply(s.wuu)),
            D3x: (s.xuuu.multiply(s.w)).subtract(s.x.multiply(s.wuuu)),
            D3y: (s.yuuu.multiply(s.w)).subtract(s.y.multiply(s.wuuu)),
            D21x: (s.xuu.multiply(s.wu)).subtract(s.xu.multiply(s.wuu)),
            D21y: (s.yuu.multiply(s.wu)).subtract(s.yu.multiply(s.wuu))
        };
    }
    curvatureNumerator() {
        // reference: XIANMING CHEN, COMPLEXITY REDUCTION FOR SYMBOLIC COMPUTATION WITH RATIONAL B-SPLINES
        const s = this.derivatives;
        const t1 = BernsteinDecompositionR1toR1_1.determinant2by2(s.xu, s.yu, s.xuu, s.yuu).multiply(s.w);
        const t2 = BernsteinDecompositionR1toR1_1.determinant2by2(s.x, s.y, s.xuu, s.yuu).multiply(s.wu);
        const t3 = BernsteinDecompositionR1toR1_1.determinant2by2(s.xu, s.yu, s.x, s.y).multiply(s.wuu);
        const distinctKnots = this.spline.distinctKnots();
        return (t1.subtract(t2).subtract(t3)).splineRecomposition(distinctKnots);
    }
    inflections(curvatureNumerator) {
        if (!curvatureNumerator) {
            curvatureNumerator = this.curvatureNumerator();
        }
        const zeros = curvatureNumerator.zeros();
        let result = [];
        for (let z of zeros) {
            result.push(this.spline.evaluate(z));
        }
        return result;
    }
    curvatureDerivativeNumerator() {
        const s = this.derivatives;
        const ct = this.ChenTerms;
        const t0 = (ct.D1x.multiply(ct.D1x)).add(ct.D1y.multiply(ct.D1y));
        const t1 = BernsteinDecompositionR1toR1_1.determinant2by2(ct.D1x, ct.D1y, ct.D3x, ct.D3y);
        const t2 = BernsteinDecompositionR1toR1_1.determinant2by2(ct.D1x, ct.D1y, ct.D21x, ct.D21y);
        const t3 = BernsteinDecompositionR1toR1_1.determinant2by2(ct.D1x, ct.D1y, ct.D2x, ct.D2y);
        const t4 = s.wu.multiplyByScalar(2);
        const t5 = (ct.D1x.multiply(ct.D2x)).add(ct.D1y.multiply(ct.D2y)).multiplyByScalar(3);
        const distinctKnots = this.spline.distinctKnots();
        return ((t1.add(t2)).multiply(t0).multiply(s.w)).add(t4.multiply(t3).multiply(t0)).subtract(t5.multiply(t3).multiply(s.w)).splineRecomposition(distinctKnots);
    }
    curvatureExtrema(_curvatureDerivativeNumerator) {
        if (!_curvatureDerivativeNumerator) {
            _curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
        }
        const zeros = _curvatureDerivativeNumerator.zeros();
        let result = [];
        for (let z of zeros) {
            result.push(this.spline.evaluate(z));
        }
        return result;
    }
}
exports.RationalBSplineR1toR2DifferentialProperties = RationalBSplineR1toR2DifferentialProperties;


/***/ }),

/***/ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2.ts":
/*!**************************************************************************************!*\
  !*** ./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const DenseMatrix_1 = __webpack_require__(/*! ../linearAlgebra/DenseMatrix */ "./src/linearAlgebra/DenseMatrix.ts");
const DiagonalMatrix_1 = __webpack_require__(/*! ../linearAlgebra/DiagonalMatrix */ "./src/linearAlgebra/DiagonalMatrix.ts");
class AbstractOptimizationProblemBSplineR1toR2 {
    constructor(target, initial, activeControl = ActiveControl.curvatureExtrema) {
        this.activeControl = activeControl;
        this._hessian_f = undefined;
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];
        this.inflectionConstraintsSign = [];
        this._inflectionInactiveConstraints = [];
        this.curvatureExtremaConstraintsSign = [];
        this._curvatureExtremaInactiveConstraints = [];
        this._spline = initial.clone();
        this._target = target.clone();
        this.computeBasisFunctionsDerivatives();
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 2;
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        this._hessian_f0 = DiagonalMatrix_1.identityMatrix(this._numberOfIndependentVariables);
        const e = this.expensiveComputation(this._spline);
        const curvatureNumerator = this.curvatureNumerator(e.h4);
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g);
        //this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g);
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator);
        //this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator);
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        if (this._f.length !== this._gradient_f.shape[0]) {
            throw new Error("Problem about f length and gradient_f shape in the optimization problem construtor");
        }
    }
    get inflectionInactiveConstraints() {
        return this._inflectionInactiveConstraints;
    }
    get curvatureExtremaInactiveConstraints() {
        return this._curvatureExtremaInactiveConstraints;
    }
    get numberOfIndependentVariables() {
        return this._numberOfIndependentVariables;
    }
    get f0() {
        return this._f0;
    }
    get gradient_f0() {
        return this._gradient_f0;
    }
    get hessian_f0() {
        return this._hessian_f0;
    }
    get numberOfConstraints() {
        switch (this.activeControl) {
            case ActiveControl.both: {
                return this.inflectionConstraintsSign.length - this._inflectionInactiveConstraints.length + this.curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length;
            }
            case ActiveControl.curvatureExtrema: {
                return this.curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length;
            }
            case ActiveControl.inflections: {
                return this.inflectionConstraintsSign.length - this._inflectionInactiveConstraints.length;
            }
        }
    }
    get f() {
        return this._f;
    }
    get gradient_f() {
        return this._gradient_f;
    }
    get hessian_f() {
        return this._hessian_f;
    }
    step(deltaX) {
        this.spline.optimizerStep(deltaX);
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        const e = this.expensiveComputation(this._spline);
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g);
        //this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g);
        const curvatureNumerator = this.curvatureNumerator(e.h4);
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator);
        //this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator);
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    }
    fStep(step) {
        let splineTemp = this.spline.clone();
        splineTemp.optimizerStep(step);
        let e = this.expensiveComputation(splineTemp);
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
        const curvatureNumerator = this.curvatureNumerator(e.h4);
        return this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    }
    f0Step(step) {
        let splineTemp = this.spline.clone();
        splineTemp.optimizerStep(step);
        return this.compute_f0(this.compute_gradient_f0(splineTemp));
    }
    expensiveComputation(spline) {
        const sx = this.bSplineR1toR1Factory(spline.getControlPointsX(), spline.knots);
        const sy = this.bSplineR1toR1Factory(spline.getControlPointsY(), spline.knots);
        const sxu = sx.derivative();
        const syu = sy.derivative();
        const sxuu = sxu.derivative();
        const syuu = syu.derivative();
        const sxuuu = sxuu.derivative();
        const syuuu = syuu.derivative();
        const bdsxu = sxu.bernsteinDecomposition();
        const bdsyu = syu.bernsteinDecomposition();
        const bdsxuu = sxuu.bernsteinDecomposition();
        const bdsyuu = syuu.bernsteinDecomposition();
        const bdsxuuu = sxuuu.bernsteinDecomposition();
        const bdsyuuu = syuuu.bernsteinDecomposition();
        const h1 = (bdsxu.multiply(bdsxu)).add(bdsyu.multiply(bdsyu));
        const h2 = (bdsxu.multiply(bdsyuuu)).subtract(bdsyu.multiply(bdsxuuu));
        const h3 = (bdsxu.multiply(bdsxuu)).add(bdsyu.multiply(bdsyuu));
        const h4 = (bdsxu.multiply(bdsyuu)).subtract(bdsyu.multiply(bdsxuu));
        return {
            bdsxu: bdsxu,
            bdsyu: bdsyu,
            bdsxuu: bdsxuu,
            bdsyuu: bdsyuu,
            bdsxuuu: bdsxuuu,
            bdsyuuu: bdsyuuu,
            h1: h1,
            h2: h2,
            h3: h3,
            h4: h4
        };
    }
    compute_gradient_f0(spline) {
        let result = [];
        const n = spline.freeControlPoints.length;
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].x - this._target.freeControlPoints[i].x);
        }
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].y - this._target.freeControlPoints[i].y);
        }
        return result;
    }
    compute_f0(gradient_f0) {
        let result = 0;
        const n = gradient_f0.length;
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(gradient_f0[i], 2);
        }
        return 0.5 * result;
    }
    compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, constraintsSign, inactiveConstraints) {
        let result = [];
        for (let i = 0, j = 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            }
            else {
                result.push(curvatureDerivativeNumerator[i] * constraintsSign[i]);
            }
        }
        return result;
    }
    compute_inflectionConstraints(curvatureNumerator, constraintsSign, inactiveConstraints) {
        let result = [];
        for (let i = 0, j = 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            }
            else {
                result.push(curvatureNumerator[i] * constraintsSign[i]);
            }
        }
        return result;
    }
    curvatureNumerator(h4) {
        return h4.flattenControlPointsArray();
    }
    curvatureDerivativeNumerator(h1, h2, h3, h4) {
        const g = (h1.multiply(h2)).subtract(h3.multiply(h4).multiplyByScalar(3));
        return g.flattenControlPointsArray();
    }
    computeConstraintsSign(controlPoints) {
        let result = [];
        for (let i = 0, n = controlPoints.length; i < n; i += 1) {
            if (controlPoints[i] > 0) {
                result.push(-1);
            }
            else {
                result.push(1);
            }
        }
        return result;
    }
    compute_f(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints, curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints) {
        if (this.activeControl === ActiveControl.both) {
            const r1 = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            const r2 = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
            return r1.concat(r2);
        }
        else if (this.activeControl === ActiveControl.curvatureExtrema) {
            return this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        }
        else {
            return this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
        }
    }
    compute_gradient_f(e, inflectionConstraintsSign, inflectionInactiveConstraints, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints) {
        if (this.activeControl === ActiveControl.both) {
            const m1 = this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            const m2 = this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints);
            const [row_m1, n] = m1.shape;
            const [row_m2,] = m2.shape;
            const m = row_m1 + row_m2;
            let result = new DenseMatrix_1.DenseMatrix(m, n);
            for (let i = 0; i < row_m1; i += 1) {
                for (let j = 0; j < n; j += 1) {
                    result.set(i, j, m1.get(i, j));
                }
            }
            for (let i = 0; i < row_m2; i += 1) {
                for (let j = 0; j < n; j += 1) {
                    result.set(row_m1 + i, j, m2.get(i, j));
                }
            }
            return result;
        }
        else if (this.activeControl === ActiveControl.curvatureExtrema) {
            return this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        }
        else {
            return this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints);
        }
    }
}
exports.AbstractOptimizationProblemBSplineR1toR2 = AbstractOptimizationProblemBSplineR1toR2;
var ActiveControl;
(function (ActiveControl) {
    ActiveControl[ActiveControl["curvatureExtrema"] = 0] = "curvatureExtrema";
    ActiveControl[ActiveControl["inflections"] = 1] = "inflections";
    ActiveControl[ActiveControl["both"] = 2] = "both";
})(ActiveControl = exports.ActiveControl || (exports.ActiveControl = {}));


/***/ }),

/***/ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR3.ts":
/*!**************************************************************************************!*\
  !*** ./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR3.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const DenseMatrix_1 = __webpack_require__(/*! ../linearAlgebra/DenseMatrix */ "./src/linearAlgebra/DenseMatrix.ts");
const DiagonalMatrix_1 = __webpack_require__(/*! ../linearAlgebra/DiagonalMatrix */ "./src/linearAlgebra/DiagonalMatrix.ts");
const CurveModel3d_1 = __webpack_require__(/*! ../models/CurveModel3d */ "./src/models/CurveModel3d.ts");
class AbstractOptimizationProblemBSplineR1toR3 {
    constructor(target, initial, activeControl = CurveModel3d_1.ActiveControl.curvatureExtrema) {
        this.activeControl = activeControl;
        this._hessian_f = undefined;
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];
        this.torsionConstraintsSign = [];
        this._torsionZerosInactiveConstraints = [];
        this.curvatureExtremaConstraintsSign = [];
        this._curvatureExtremaInactiveConstraints = [];
        this._spline = initial.clone();
        this._target = target.clone();
        this.computeBasisFunctionsDerivatives();
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 3;
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        this._hessian_f0 = DiagonalMatrix_1.identityMatrix(this._numberOfIndependentVariables);
        const derivatives = this.computeDerivatives(this._spline);
        const torsionNumerator = this.torsionNumerator(derivatives);
        const g = this.curvatureSquaredDerivativeNumerator(derivatives);
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g);
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g);
        this.torsionConstraintsSign = this.computeConstraintsSign(torsionNumerator);
        this._torsionZerosInactiveConstraints = this.computeInactiveConstraints(torsionNumerator);
        this._f = this.compute_f(torsionNumerator, this.torsionConstraintsSign, this._torsionZerosInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(derivatives, this.torsionConstraintsSign, this._torsionZerosInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        if (this._f.length !== this._gradient_f.shape[0]) {
            throw new Error("Problem about f length and gradient_f shape in the optimization problem construtor");
        }
    }
    get torsionZerosInactiveConstraints() {
        return this._torsionZerosInactiveConstraints;
    }
    get curvatureExtremaInactiveConstraints() {
        return this._curvatureExtremaInactiveConstraints;
    }
    get numberOfIndependentVariables() {
        return this._numberOfIndependentVariables;
    }
    get f0() {
        return this._f0;
    }
    get gradient_f0() {
        return this._gradient_f0;
    }
    get hessian_f0() {
        return this._hessian_f0;
    }
    get numberOfConstraints() {
        switch (this.activeControl) {
            case CurveModel3d_1.ActiveControl.both: {
                return this.torsionConstraintsSign.length - this._torsionZerosInactiveConstraints.length + this.curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length;
            }
            case CurveModel3d_1.ActiveControl.curvatureExtrema: {
                return this.curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length;
            }
            case CurveModel3d_1.ActiveControl.torsionZeros: {
                return this.torsionConstraintsSign.length - this._torsionZerosInactiveConstraints.length;
            }
        }
    }
    get f() {
        return this._f;
    }
    get gradient_f() {
        return this._gradient_f;
    }
    get hessian_f() {
        return this._hessian_f;
    }
    step(deltaX) {
        this.spline.optimizerStep(deltaX);
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        const derivatives = this.computeDerivatives(this._spline);
        const g = this.curvatureSquaredDerivativeNumerator(derivatives);
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g);
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g);
        const torsionNumerator = this.torsionNumerator(derivatives);
        this.torsionConstraintsSign = this.computeConstraintsSign(torsionNumerator);
        this._torsionZerosInactiveConstraints = this.computeInactiveConstraints(torsionNumerator);
        this._f = this.compute_f(torsionNumerator, this.torsionConstraintsSign, this._torsionZerosInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(derivatives, this.torsionConstraintsSign, this._torsionZerosInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    }
    fStep(step) {
        let splineTemp = this.spline.clone();
        splineTemp.optimizerStep(step);
        const s = this.computeDerivatives(splineTemp);
        const g = this.curvatureSquaredDerivativeNumerator(s);
        const torsionNumerator = this.torsionNumerator(s);
        return this.compute_f(torsionNumerator, this.torsionConstraintsSign, this._torsionZerosInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    }
    f0Step(step) {
        let splineTemp = this.spline.clone();
        splineTemp.optimizerStep(step);
        return this.compute_f0(this.compute_gradient_f0(splineTemp));
    }
    computeDerivatives(spline) {
        const sx = this.bSplineR1toR1Factory(spline.getControlPointsX(), spline.knots);
        const sy = this.bSplineR1toR1Factory(spline.getControlPointsY(), spline.knots);
        const sz = this.bSplineR1toR1Factory(spline.getControlPointsZ(), spline.knots);
        const sxu = sx.derivative();
        const syu = sy.derivative();
        const szu = sz.derivative();
        const sxuu = sxu.derivative();
        const syuu = syu.derivative();
        const szuu = szu.derivative();
        const sxuuu = sxuu.derivative();
        const syuuu = syuu.derivative();
        const szuuu = szuu.derivative();
        return {
            x: sx.bernsteinDecomposition(),
            y: sy.bernsteinDecomposition(),
            z: sz.bernsteinDecomposition(),
            xu: sxu.bernsteinDecomposition(),
            yu: syu.bernsteinDecomposition(),
            zu: szu.bernsteinDecomposition(),
            xuu: sxuu.bernsteinDecomposition(),
            yuu: syuu.bernsteinDecomposition(),
            zuu: szuu.bernsteinDecomposition(),
            xuuu: sxuuu.bernsteinDecomposition(),
            yuuu: syuuu.bernsteinDecomposition(),
            zuuu: szuuu.bernsteinDecomposition()
        };
    }
    compute_gradient_f0(spline) {
        let result = [];
        const n = spline.freeControlPoints.length;
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].x - this._target.freeControlPoints[i].x);
        }
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].y - this._target.freeControlPoints[i].y);
        }
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].z - this._target.freeControlPoints[i].z);
        }
        return result;
    }
    compute_f0(gradient_f0) {
        let result = 0;
        const n = gradient_f0.length;
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(gradient_f0[i], 2);
        }
        return 0.5 * result;
    }
    compute_curvatureExtremaConstraints(curvatureSquaredDerivativeNumerator, constraintsSign, inactiveConstraints) {
        let result = [];
        for (let i = 0, j = 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            }
            else {
                result.push(curvatureSquaredDerivativeNumerator[i] * constraintsSign[i]);
            }
        }
        return result;
    }
    compute_torsionConstraints(torsionNumerator, constraintsSign, inactiveConstraints) {
        let result = [];
        for (let i = 0, j = 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            }
            else {
                result.push(torsionNumerator[i] * constraintsSign[i]);
            }
        }
        return result;
    }
    /*
    curvatureSquaredNumerator(s: Derivatives) {
        const t1 = s.zuu.multiply(s.yu).subtract(s.yuu.multiply(s.zu))
        const t2 = s.xuu.multiply(s.zu).subtract(s.zuu.multiply(s.xu))
        const t3 = s.yuu.multiply(s.xu).subtract(s.xuu.multiply(s.yu))
        const result = (t1.multiply(t1).add(t2.multiply(t2)).add(t3.multiply(t3)))
        return result.flattenControlPointsArray()
    }
    */
    curvatureSquaredDerivativeNumerator(s) {
        const t1 = s.zuu.multiply(s.yu).subtract(s.yuu.multiply(s.zu));
        const t2 = s.xuu.multiply(s.zu).subtract(s.zuu.multiply(s.xu));
        const t3 = s.yuu.multiply(s.xu).subtract(s.xuu.multiply(s.yu));
        const t4 = s.zuuu.multiply(s.yu).subtract(s.yuuu.multiply(s.zu));
        const t5 = s.xuuu.multiply(s.zu).subtract(s.zuuu.multiply(s.xu));
        const t6 = s.yuuu.multiply(s.xu).subtract(s.xuuu.multiply(s.yu));
        const t7 = s.xu.multiply(s.xu).add(s.yu.multiply(s.yu)).add(s.zu.multiply(s.zu));
        const t8 = s.xu.multiply(s.xuu).add(s.yu.multiply(s.yuu)).add(s.zu.multiply(s.zuu));
        const t9 = ((t1.multiply(t4)).add(t2.multiply(t5)).add(t3.multiply(t6))).multiply(t7);
        const t10 = (t1.multiply(t1).add(t2.multiply(t2)).add(t3.multiply(t3))).multiply(t8);
        const result = t9.subtract(t10.multiplyByScalar(3));
        return result.flattenControlPointsArray();
    }
    torsionNumerator(s) {
        const t1 = s.yu.multiply(s.zuu).subtract(s.yuu.multiply(s.zu));
        const t2 = s.xuu.multiply(s.zu).subtract(s.xu.multiply(s.zuu));
        const t3 = s.xu.multiply(s.yuu).subtract(s.xuu.multiply(s.yu));
        const result = s.xuuu.multiply(t1).add(s.yuuu.multiply(t2).add(s.zuuu.multiply(t3)));
        //console.log(result.flattenControlPointsArray())
        //console.log(t1)
        return result.flattenControlPointsArray();
    }
    computeConstraintsSign(controlPoints) {
        let result = [];
        for (let i = 0, n = controlPoints.length; i < n; i += 1) {
            if (controlPoints[i] > 0) {
                result.push(-1);
            }
            else {
                result.push(1);
            }
        }
        return result;
    }
    compute_f(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints, curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints) {
        if (this.activeControl === CurveModel3d_1.ActiveControl.both) {
            const r1 = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            const r2 = this.compute_torsionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
            return r1.concat(r2);
        }
        else if (this.activeControl === CurveModel3d_1.ActiveControl.curvatureExtrema) {
            return this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        }
        else {
            return this.compute_torsionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
        }
    }
    compute_gradient_f(s, inflectionConstraintsSign, inflectionInactiveConstraints, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints) {
        if (this.activeControl === CurveModel3d_1.ActiveControl.both) {
            const m1 = this.compute_curvatureExtremaConstraints_gradient(s, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            const m2 = this.compute_zeroTorsionConstraints_gradient(s, inflectionConstraintsSign, inflectionInactiveConstraints);
            const [row_m1, n] = m1.shape;
            const [row_m2,] = m2.shape;
            const m = row_m1 + row_m2;
            let result = new DenseMatrix_1.DenseMatrix(m, n);
            for (let i = 0; i < row_m1; i += 1) {
                for (let j = 0; j < n; j += 1) {
                    result.set(i, j, m1.get(i, j));
                }
            }
            for (let i = 0; i < row_m2; i += 1) {
                for (let j = 0; j < n; j += 1) {
                    result.set(row_m1 + i, j, m2.get(i, j));
                }
            }
            return result;
        }
        else if (this.activeControl === CurveModel3d_1.ActiveControl.curvatureExtrema) {
            return this.compute_curvatureExtremaConstraints_gradient(s, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        }
        else {
            return this.compute_zeroTorsionConstraints_gradient(s, inflectionConstraintsSign, inflectionInactiveConstraints);
        }
    }
}
exports.AbstractOptimizationProblemBSplineR1toR3 = AbstractOptimizationProblemBSplineR1toR3;


/***/ }),

/***/ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemRationalBSplineR1toR2.ts":
/*!**********************************************************************************************!*\
  !*** ./src/bsplinesOptimizationProblems/AbstractOptimizationProblemRationalBSplineR1toR2.ts ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BernsteinDecompositionR1toR1_1 = __webpack_require__(/*! ../bsplines/BernsteinDecompositionR1toR1 */ "./src/bsplines/BernsteinDecompositionR1toR1.ts");
const BSplineR1toR1_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR1 */ "./src/bsplines/BSplineR1toR1.ts");
const DenseMatrix_1 = __webpack_require__(/*! ../linearAlgebra/DenseMatrix */ "./src/linearAlgebra/DenseMatrix.ts");
const DiagonalMatrix_1 = __webpack_require__(/*! ../linearAlgebra/DiagonalMatrix */ "./src/linearAlgebra/DiagonalMatrix.ts");
class AbstractOptimizationProblemRationalBSplineR1toR2 {
    constructor(target, initial, activeControl = ActiveControl.curvatureExtrema) {
        this.activeControl = activeControl;
        this._hessian_f = undefined;
        this.basisFunctions = [];
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];
        this.inflectionConstraintsSign = [];
        this._inflectionInactiveConstraints = [];
        this.curvatureExtremaConstraintsSign = [];
        this._curvatureExtremaInactiveConstraints = [];
        this._spline = initial.clone();
        this._target = target.clone();
        this.computeBasisFunctionsDerivatives();
        this._numberOfIndependentVariables = this._spline.freeControlPoints.length * 3;
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        this._hessian_f0 = DiagonalMatrix_1.identityMatrix(this._numberOfIndependentVariables);
        const derivatives = computeDerivatives(this._spline);
        const ct = ComputeChenTerms(derivatives);
        const curvatureNumerator = this.curvatureNumerator(derivatives);
        const g = this.curvatureDerivativeNumerator(derivatives, ct);
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g);
        //this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g);
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator);
        //this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator);
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(derivatives, ct, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        if (this._f.length !== this._gradient_f.shape[0]) {
            throw new Error("Problem about f length and gradient_f shape in the optimization problem construtor");
        }
    }
    get inflectionInactiveConstraints() {
        return this._inflectionInactiveConstraints;
    }
    get curvatureExtremaInactiveConstraints() {
        return this._curvatureExtremaInactiveConstraints;
    }
    get numberOfIndependentVariables() {
        return this._numberOfIndependentVariables;
    }
    get f0() {
        return this._f0;
    }
    get gradient_f0() {
        return this._gradient_f0;
    }
    get hessian_f0() {
        return this._hessian_f0;
    }
    get numberOfConstraints() {
        switch (this.activeControl) {
            case ActiveControl.both: {
                return this.inflectionConstraintsSign.length - this._inflectionInactiveConstraints.length + this.curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length;
            }
            case ActiveControl.curvatureExtrema: {
                return this.curvatureExtremaConstraintsSign.length - this._curvatureExtremaInactiveConstraints.length;
            }
            case ActiveControl.inflections: {
                return this.inflectionConstraintsSign.length - this._inflectionInactiveConstraints.length;
            }
        }
    }
    get f() {
        return this._f;
    }
    get gradient_f() {
        return this._gradient_f;
    }
    get hessian_f() {
        return this._hessian_f;
    }
    step(deltaX) {
        this.spline.optimizerStep(deltaX);
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        const derivatives = computeDerivatives(this._spline);
        const ct = ComputeChenTerms(derivatives);
        const g = this.curvatureDerivativeNumerator(derivatives, ct);
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g);
        //this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g)
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g);
        const curvatureNumerator = this.curvatureNumerator(derivatives);
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator);
        //this._inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator)
        this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator);
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(derivatives, ct, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    }
    fStep(step) {
        let splineTemp = this.spline.clone();
        splineTemp.optimizerStep(step);
        const derivatives = computeDerivatives(splineTemp);
        const ct = ComputeChenTerms(derivatives);
        const g = this.curvatureDerivativeNumerator(derivatives, ct);
        const curvatureNumerator = this.curvatureNumerator(derivatives);
        return this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
    }
    f0Step(step) {
        let splineTemp = this.spline.clone();
        splineTemp.optimizerStep(step);
        return this.compute_f0(this.compute_gradient_f0(splineTemp));
    }
    compute_gradient_f0(spline) {
        let result = [];
        const n = spline.freeControlPoints.length;
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].x - this._target.freeControlPoints[i].x);
        }
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].y - this._target.freeControlPoints[i].y);
        }
        for (let i = 0; i < n; i += 1) {
            result.push(spline.freeControlPoints[i].z - this._target.freeControlPoints[i].z);
        }
        return result;
    }
    compute_f0(gradient_f0) {
        let result = 0;
        const n = gradient_f0.length;
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(gradient_f0[i], 2);
        }
        return 0.5 * result;
    }
    compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, constraintsSign, inactiveConstraints) {
        let result = [];
        for (let i = 0, j = 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            }
            else {
                result.push(curvatureDerivativeNumerator[i] * constraintsSign[i]);
            }
        }
        return result;
    }
    compute_inflectionConstraints(curvatureNumerator, constraintsSign, inactiveConstraints) {
        let result = [];
        for (let i = 0, j = 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            }
            else {
                result.push(curvatureNumerator[i] * constraintsSign[i]);
            }
        }
        return result;
    }
    curvatureNumerator(s) {
        // reference: XIANMING CHEN, COMPLEXITY REDUCTION FOR SYMBOLIC COMPUTATION WITH RATIONAL B-SPLINES
        const t1 = BernsteinDecompositionR1toR1_1.determinant2by2(s.xu, s.yu, s.xuu, s.yuu).multiply(s.w);
        const t2 = BernsteinDecompositionR1toR1_1.determinant2by2(s.x, s.y, s.xuu, s.yuu).multiply(s.wu);
        const t3 = BernsteinDecompositionR1toR1_1.determinant2by2(s.xu, s.yu, s.x, s.y).multiply(s.wuu);
        return (t1.subtract(t2).subtract(t3)).flattenControlPointsArray();
    }
    curvatureDerivativeNumerator(s, ct) {
        const t0 = (ct.D1x.multiply(ct.D1x)).add(ct.D1y.multiply(ct.D1y));
        const t1 = BernsteinDecompositionR1toR1_1.determinant2by2(ct.D1x, ct.D1y, ct.D3x, ct.D3y);
        const t2 = BernsteinDecompositionR1toR1_1.determinant2by2(ct.D1x, ct.D1y, ct.D21x, ct.D21y);
        const t3 = BernsteinDecompositionR1toR1_1.determinant2by2(ct.D1x, ct.D1y, ct.D2x, ct.D2y);
        const t4 = s.wu.multiplyByScalar(2);
        const t5 = (ct.D1x.multiply(ct.D2x)).add(ct.D1y.multiply(ct.D2y)).multiplyByScalar(3);
        return ((t1.add(t2)).multiply(t0).multiply(s.w)).add(t4.multiply(t3).multiply(t0)).subtract(t5.multiply(t3).multiply(s.w)).flattenControlPointsArray();
    }
    computeConstraintsSign(controlPoints) {
        let result = [];
        for (let i = 0, n = controlPoints.length; i < n; i += 1) {
            if (controlPoints[i] > 0) {
                result.push(-1);
            }
            else {
                result.push(1);
            }
        }
        return result;
    }
    compute_f(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints, curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints) {
        if (this.activeControl === ActiveControl.both) {
            const r1 = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            const r2 = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
            return r1.concat(r2);
        }
        else if (this.activeControl === ActiveControl.curvatureExtrema) {
            return this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        }
        else {
            return this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
        }
    }
    compute_gradient_f(d, ct, inflectionConstraintsSign, inflectionInactiveConstraints, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints) {
        if (this.activeControl === ActiveControl.both) {
            const m1 = this.compute_curvatureExtremaConstraints_gradient(d, ct, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            const m2 = this.compute_inflectionConstraints_gradient(d, inflectionConstraintsSign, inflectionInactiveConstraints);
            const [row_m1, n] = m1.shape;
            const [row_m2,] = m2.shape;
            const m = row_m1 + row_m2;
            let result = new DenseMatrix_1.DenseMatrix(m, n);
            for (let i = 0; i < row_m1; i += 1) {
                for (let j = 0; j < n; j += 1) {
                    result.set(i, j, m1.get(i, j));
                }
            }
            for (let i = 0; i < row_m2; i += 1) {
                for (let j = 0; j < n; j += 1) {
                    result.set(row_m1 + i, j, m2.get(i, j));
                }
            }
            return result;
        }
        else if (this.activeControl === ActiveControl.curvatureExtrema) {
            return this.compute_curvatureExtremaConstraints_gradient(d, ct, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        }
        else {
            return this.compute_inflectionConstraints_gradient(d, inflectionConstraintsSign, inflectionInactiveConstraints);
        }
    }
}
exports.AbstractOptimizationProblemRationalBSplineR1toR2 = AbstractOptimizationProblemRationalBSplineR1toR2;
var ActiveControl;
(function (ActiveControl) {
    ActiveControl[ActiveControl["curvatureExtrema"] = 0] = "curvatureExtrema";
    ActiveControl[ActiveControl["inflections"] = 1] = "inflections";
    ActiveControl[ActiveControl["both"] = 2] = "both";
})(ActiveControl = exports.ActiveControl || (exports.ActiveControl = {}));
function computeDerivatives(spline) {
    const sx = new BSplineR1toR1_1.BSplineR1toR1(spline.getControlPointsX(), spline.knots);
    const sy = new BSplineR1toR1_1.BSplineR1toR1(spline.getControlPointsY(), spline.knots);
    const sw = new BSplineR1toR1_1.BSplineR1toR1(spline.getControlPointsW(), spline.knots);
    const sxu = sx.derivative();
    const syu = sy.derivative();
    const swu = sw.derivative();
    const sxuu = sxu.derivative();
    const syuu = syu.derivative();
    const swuu = swu.derivative();
    const sxuuu = sxuu.derivative();
    const syuuu = syuu.derivative();
    const swuuu = swuu.derivative();
    return {
        x: sx.bernsteinDecomposition(),
        y: sy.bernsteinDecomposition(),
        w: sw.bernsteinDecomposition(),
        xu: sxu.bernsteinDecomposition(),
        yu: syu.bernsteinDecomposition(),
        wu: swu.bernsteinDecomposition(),
        xuu: sxuu.bernsteinDecomposition(),
        yuu: syuu.bernsteinDecomposition(),
        wuu: swuu.bernsteinDecomposition(),
        xuuu: sxuuu.bernsteinDecomposition(),
        yuuu: syuuu.bernsteinDecomposition(),
        wuuu: swuuu.bernsteinDecomposition()
    };
}
exports.computeDerivatives = computeDerivatives;
function ComputeChenTerms(s) {
    // reference: XIANMING CHEN, COMPLEXITY REDUCTION FOR SYMBOLIC COMPUTATION WITH RATIONAL B-SPLINES
    return {
        w: s.w,
        wu: s.wu,
        D1x: (s.xu.multiply(s.w)).subtract(s.x.multiply(s.wu)),
        D1y: (s.yu.multiply(s.w)).subtract(s.y.multiply(s.wu)),
        D2x: (s.xuu.multiply(s.w)).subtract(s.x.multiply(s.wuu)),
        D2y: (s.yuu.multiply(s.w)).subtract(s.y.multiply(s.wuu)),
        D3x: (s.xuuu.multiply(s.w)).subtract(s.x.multiply(s.wuuu)),
        D3y: (s.yuuu.multiply(s.w)).subtract(s.y.multiply(s.wuuu)),
        D21x: (s.xuu.multiply(s.wu)).subtract(s.xu.multiply(s.wuu)),
        D21y: (s.yuu.multiply(s.wu)).subtract(s.yu.multiply(s.wuu))
    };
}
exports.ComputeChenTerms = ComputeChenTerms;


/***/ }),

/***/ "./src/bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2.ts":
/*!******************************************************************************!*\
  !*** ./src/bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BSplineR1toR1_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR1 */ "./src/bsplines/BSplineR1toR1.ts");
const DenseMatrix_1 = __webpack_require__(/*! ../linearAlgebra/DenseMatrix */ "./src/linearAlgebra/DenseMatrix.ts");
const AbstractOptimizationProblemBSplineR1toR2_1 = __webpack_require__(/*! ./AbstractOptimizationProblemBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2.ts");
const MathVectorBasicOperations_1 = __webpack_require__(/*! ../linearAlgebra/MathVectorBasicOperations */ "./src/linearAlgebra/MathVectorBasicOperations.ts");
class OptimizationProblemBSplineR1toR2 extends AbstractOptimizationProblemBSplineR1toR2_1.AbstractOptimizationProblemBSplineR1toR2 {
    constructor(target, initial, activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
        super(target, initial, activeControl);
        this.activeControl = activeControl;
    }
    get spline() {
        return this._spline;
    }
    bSplineR1toR1Factory(controlPoints, knots) {
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    }
    setTargetSpline(spline) {
        this._target = spline.clone();
        this._gradient_f0 = this.compute_gradient_f0(this.spline);
        this._f0 = this.compute_f0(this._gradient_f0);
    }
    /**
     * Some contraints are set inactive to allowed the point of inflection or curvature extrema
     * to slide along the curve.
     **/
    computeInactiveConstraints(controlPoints) {
        let controlPointsSequences = this.extractChangingSignControlPointsSequences(controlPoints);
        return this.extractControlPointsClosestToZero(controlPointsSequences);
    }
    extractChangingSignControlPointsSequences(controlPoints) {
        let result = [];
        let successiveControlPoints = [];
        let i = 1;
        while (i < controlPoints.length) {
            successiveControlPoints = [];
            if (controlPoints[i - 1] * controlPoints[i] <= 0) {
                successiveControlPoints.push({ index: i - 1, value: controlPoints[i - 1] });
                successiveControlPoints.push({ index: i, value: controlPoints[i] });
                i += 1;
                while (controlPoints[i - 1] * controlPoints[i] <= 0) {
                    successiveControlPoints.push({ index: i, value: controlPoints[i] });
                    i += 1;
                }
                result.push(successiveControlPoints);
            }
            i += 1;
        }
        return result;
    }
    extractControlPointsClosestToZero(polygonSegments) {
        let result = [];
        for (let polygonSegment of polygonSegments) {
            let s = this.removeBiggest(polygonSegment);
            for (let iv of s) {
                result.push(iv.index);
            }
        }
        return result;
    }
    removeBiggest(controlPointsSequence) {
        let result = controlPointsSequence.slice();
        let maxIndex = 0;
        for (let i = 1; i < controlPointsSequence.length; i += 1) {
            if (Math.pow(controlPointsSequence[i].value, 2) > Math.pow(controlPointsSequence[maxIndex].value, 2)) {
                maxIndex = i;
            }
        }
        result.splice(maxIndex, 1);
        return result;
    }
    compute_curvatureExtremaConstraints_gradient(e, constraintsSign, inactiveConstraints) {
        const sxu = e.bdsxu;
        const sxuu = e.bdsxuu;
        const sxuuu = e.bdsxuuu;
        const syu = e.bdsyu;
        const syuu = e.bdsyuu;
        const syuuu = e.bdsyuuu;
        const h1 = e.h1;
        const h2 = e.h2;
        const h3 = e.h3;
        const h4 = e.h4;
        let dgx = [];
        let dgy = [];
        const controlPointsLength = this.spline.controlPoints.length;
        const totalNumberOfConstraints = constraintsSign.length;
        const degree = this.spline.degree;
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        let result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength);
        for (let i = 0; i < controlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let start = Math.max(0, i - degree) * (4 * degree - 5);
            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (4 * degree - 5);
            let deltaj = 0;
            for (let inactiveConstraint of inactiveConstraints) {
                if (inactiveConstraint >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (let j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    }
    compute_inflectionConstraints_gradient(e, constraintsSign, inactiveConstraints) {
        const sxu = e.bdsxu;
        const sxuu = e.bdsxuu;
        const syu = e.bdsyu;
        const syuu = e.bdsyuu;
        let dgx = [];
        let dgy = [];
        const controlPointsLength = this.spline.controlPoints.length;
        const degree = this.spline.degree;
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        const totalNumberOfConstraints = this.inflectionConstraintsSign.length;
        let result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength);
        for (let i = 0; i < controlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let start = Math.max(0, i - degree) * (2 * degree - 2);
            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (2 * degree - 2);
            let deltaj = 0;
            for (let inactiveConstraint of inactiveConstraints) {
                if (inactiveConstraint >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (let j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    }
    computeBasisFunctionsDerivatives() {
        const n = this._spline.controlPoints.length;
        this._numberOfIndependentVariables = n * 2;
        let diracControlPoints = MathVectorBasicOperations_1.zeroVector(n);
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];
        for (let i = 0; i < n; i += 1) {
            diracControlPoints[i] = 1;
            let basisFunction = this.bSplineR1toR1Factory(diracControlPoints.slice(), this._spline.knots.slice());
            let dBasisFunction_du = basisFunction.derivative();
            let d2BasisFunction_du2 = dBasisFunction_du.derivative();
            let d3BasisFunction_du3 = d2BasisFunction_du2.derivative();
            this.dBasisFunctions_du.push(dBasisFunction_du.bernsteinDecomposition());
            this.d2BasisFunctions_du2.push(d2BasisFunction_du2.bernsteinDecomposition());
            this.d3BasisFunctions_du3.push(d3BasisFunction_du3.bernsteinDecomposition());
            diracControlPoints[i] = 0;
        }
    }
}
exports.OptimizationProblemBSplineR1toR2 = OptimizationProblemBSplineR1toR2;


/***/ }),

/***/ "./src/bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2WithWeigthingFactors.ts":
/*!**************************************************************************************************!*\
  !*** ./src/bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2WithWeigthingFactors.ts ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const DiagonalMatrix_1 = __webpack_require__(/*! ../linearAlgebra/DiagonalMatrix */ "./src/linearAlgebra/DiagonalMatrix.ts");
const AbstractOptimizationProblemBSplineR1toR2_1 = __webpack_require__(/*! ./AbstractOptimizationProblemBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2.ts");
const OptimizationProblemBSplineR1toR2_1 = __webpack_require__(/*! ./OptimizationProblemBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2.ts");
class OptimizationProblemBSplineR1toR2WithWeigthingFactors extends OptimizationProblemBSplineR1toR2_1.OptimizationProblemBSplineR1toR2 {
    constructor(target, initial, activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
        super(target, initial);
        this.activeControl = activeControl;
        this.weigthingFactors = [];
        for (let i = 0; i < this.spline.freeControlPoints.length * 2; i += 1) {
            this.weigthingFactors.push(1);
        }
        this.weigthingFactors[0] = 1000;
        this.weigthingFactors[this.spline.freeControlPoints.length - 1] = 1000;
        this.weigthingFactors[this.spline.freeControlPoints.length] = 1000;
        this.weigthingFactors[this.weigthingFactors.length - 1] = 1000;
    }
    get f0() {
        let result = 0;
        const n = this._gradient_f0.length;
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(this._gradient_f0[i], 2) * this.weigthingFactors[i];
        }
        return 0.5 * result;
    }
    get gradient_f0() {
        let result = [];
        const n = this._gradient_f0.length;
        for (let i = 0; i < n; i += 1) {
            result.push(this._gradient_f0[i] * this.weigthingFactors[i]);
        }
        return result;
    }
    get hessian_f0() {
        const n = this._gradient_f0.length;
        let result = new DiagonalMatrix_1.DiagonalMatrix(n);
        for (let i = 0; i < n; i += 1) {
            result.set(i, i, this.weigthingFactors[i]);
        }
        return result;
    }
    /**
     * The objective function value: f0(x + step)
     */
    f0Step(step) {
        let splineTemp = this.spline.clone();
        splineTemp.optimizerStep(step);
        const gradient = this.compute_gradient_f0(splineTemp);
        const n = gradient.length;
        let result = 0;
        for (let i = 0; i < n; i += 1) {
            result += Math.pow(gradient[i], 2) * this.weigthingFactors[i];
        }
        return 0.5 * result;
    }
}
exports.OptimizationProblemBSplineR1toR2WithWeigthingFactors = OptimizationProblemBSplineR1toR2WithWeigthingFactors;
class OptimizationProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints extends OptimizationProblemBSplineR1toR2WithWeigthingFactors {
    constructor(target, initial, activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
        super(target, initial);
        this.activeControl = activeControl;
    }
    computeInactiveConstraints(curvatureDerivativeNumerator) {
        return [];
    }
}
exports.OptimizationProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints = OptimizationProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints;
class OptimizationProblemBSplineR1toR2NoInactiveConstraints extends OptimizationProblemBSplineR1toR2_1.OptimizationProblemBSplineR1toR2 {
    constructor(target, initial) {
        super(target, initial);
    }
    computeInactiveConstraints(curvatureDerivativeNumerator) {
        return [];
    }
}
exports.OptimizationProblemBSplineR1toR2NoInactiveConstraints = OptimizationProblemBSplineR1toR2NoInactiveConstraints;


/***/ }),

/***/ "./src/bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR3.ts":
/*!******************************************************************************!*\
  !*** ./src/bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR3.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BSplineR1toR1_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR1 */ "./src/bsplines/BSplineR1toR1.ts");
const DenseMatrix_1 = __webpack_require__(/*! ../linearAlgebra/DenseMatrix */ "./src/linearAlgebra/DenseMatrix.ts");
const MathVectorBasicOperations_1 = __webpack_require__(/*! ../linearAlgebra/MathVectorBasicOperations */ "./src/linearAlgebra/MathVectorBasicOperations.ts");
const BernsteinDecompositionR1toR1_1 = __webpack_require__(/*! ../bsplines/BernsteinDecompositionR1toR1 */ "./src/bsplines/BernsteinDecompositionR1toR1.ts");
const AbstractOptimizationProblemBSplineR1toR3_1 = __webpack_require__(/*! ./AbstractOptimizationProblemBSplineR1toR3 */ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR3.ts");
const CurveModel3d_1 = __webpack_require__(/*! ../models/CurveModel3d */ "./src/models/CurveModel3d.ts");
class OptimizationProblemBSplineR1toR3 extends AbstractOptimizationProblemBSplineR1toR3_1.AbstractOptimizationProblemBSplineR1toR3 {
    constructor(target, initial, activeControl = CurveModel3d_1.ActiveControl.curvatureExtrema) {
        super(target, initial, activeControl);
        this.activeControl = activeControl;
    }
    get spline() {
        return this._spline;
    }
    bSplineR1toR1Factory(controlPoints, knots) {
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    }
    setTargetSpline(spline) {
        this._target = spline.clone();
        this._gradient_f0 = this.compute_gradient_f0(this.spline);
        this._f0 = this.compute_f0(this._gradient_f0);
    }
    /**
     * Some contraints are set inactive to allowed the point of inflection or curvature extrema
     * to slide along the curve.
     **/
    computeInactiveConstraints(controlPoints) {
        let controlPointsSequences = this.extractChangingSignControlPointsSequences(controlPoints);
        return this.extractControlPointsClosestToZero(controlPointsSequences);
    }
    extractChangingSignControlPointsSequences(controlPoints) {
        let result = [];
        let successiveControlPoints = [];
        let i = 1;
        while (i < controlPoints.length) {
            successiveControlPoints = [];
            if (controlPoints[i - 1] * controlPoints[i] <= 0) {
                successiveControlPoints.push({ index: i - 1, value: controlPoints[i - 1] });
                successiveControlPoints.push({ index: i, value: controlPoints[i] });
                i += 1;
                while (controlPoints[i - 1] * controlPoints[i] <= 0) {
                    successiveControlPoints.push({ index: i, value: controlPoints[i] });
                    i += 1;
                }
                result.push(successiveControlPoints);
            }
            i += 1;
        }
        return result;
    }
    extractControlPointsClosestToZero(polygonSegments) {
        let result = [];
        for (let polygonSegment of polygonSegments) {
            let s = this.removeBiggest(polygonSegment);
            for (let iv of s) {
                result.push(iv.index);
            }
        }
        return result;
    }
    removeBiggest(controlPointsSequence) {
        let result = controlPointsSequence.slice();
        let maxIndex = 0;
        for (let i = 1; i < controlPointsSequence.length; i += 1) {
            if (Math.pow(controlPointsSequence[i].value, 2) > Math.pow(controlPointsSequence[maxIndex].value, 2)) {
                maxIndex = i;
            }
        }
        result.splice(maxIndex, 1);
        return result;
    }
    compute_curvatureExtremaConstraints_gradient(s, constraintsSign, inactiveConstraints) {
        let dgx = [];
        let dgy = [];
        let dgz = [];
        const controlPointsLength = this.spline.controlPoints.length;
        const totalNumberOfConstraints = constraintsSign.length;
        const degree = this.spline.degree;
        const d1 = BernsteinDecompositionR1toR1_1.determinant2by2(s.zuu, s.yuu, s.zu, s.yu);
        const dd1 = BernsteinDecompositionR1toR1_1.determinant2by2(s.zuuu, s.yuuu, s.zu, s.yu);
        const d2 = BernsteinDecompositionR1toR1_1.determinant2by2(s.xuu, s.zuu, s.xu, s.zu);
        const dd2 = BernsteinDecompositionR1toR1_1.determinant2by2(s.xuuu, s.zuuu, s.xu, s.zu);
        const d3 = BernsteinDecompositionR1toR1_1.determinant2by2(s.yuu, s.xuu, s.yu, s.xu);
        const dd3 = BernsteinDecompositionR1toR1_1.determinant2by2(s.yuuu, s.xuuu, s.yu, s.xu);
        const l2 = s.xu.multiply(s.xu).add(s.yu.multiply(s.yu)).add(s.zu.multiply(s.zu));
        const ddd = d1.multiply(dd1).add(d2.multiply(dd2)).add(d3.multiply(dd3));
        const dl2 = s.xu.multiply(s.xuu).add(s.yu.multiply(s.yuu)).add(s.zu.multiply(s.zuu));
        const ddd2 = d1.multiply(d1).add(d2.multiply(d2)).add(d3.multiply(d3));
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let t2a = this.d2BasisFunctions_du2[i].multiplyRange(s.zu, start, lessThan);
            let t2b = this.dBasisFunctions_du[i].multiplyRange(s.zuu, start, lessThan);
            let t2c = this.d3BasisFunctions_du3[i].multiplyRange(s.zu, start, lessThan);
            let t2d = this.dBasisFunctions_du[i].multiplyRange(s.zuuu, start, lessThan);
            let t2e = (t2a.subtract(t2b)).multiplyRange2(dd2, start, lessThan);
            let t2f = (t2c.subtract(t2d)).multiplyRange2(d2, start, lessThan);
            let t2 = t2e.add(t2f);
            let t3a = this.dBasisFunctions_du[i].multiplyRange(s.yuu, start, lessThan);
            let t3b = this.d2BasisFunctions_du2[i].multiplyRange(s.yu, start, lessThan);
            let t3c = this.dBasisFunctions_du[i].multiplyRange(s.yuuu, start, lessThan);
            let t3d = this.d3BasisFunctions_du3[i].multiplyRange(s.yu, start, lessThan);
            let t3e = (t3a.subtract(t3b)).multiplyRange2(dd3, start, lessThan);
            let t3f = (t3c.subtract(t3d)).multiplyRange2(d3, start, lessThan);
            let t3 = t3e.add(t3f);
            let z1 = (t2.add(t3)).multiplyRange2(l2, start, lessThan);
            let t4 = this.dBasisFunctions_du[i].multiplyRange(s.xu, start, lessThan).multiplyByScalar(2);
            let z2 = t4.multiplyRange2(ddd, start, lessThan);
            let z3a = (t2a.subtract(t2b)).multiplyRange2(d2, start, lessThan);
            let z3b = (t3a.subtract(t3b)).multiplyRange2(d3, start, lessThan);
            let z3 = (z3a.add(z3b)).multiplyRange2(dl2, start, lessThan).multiplyByScalar(-6);
            let z4a = this.dBasisFunctions_du[i].multiplyRange(s.xuu, start, lessThan);
            let z4b = this.d2BasisFunctions_du2[i].multiplyRange(s.xu, start, lessThan);
            let z4 = (z4a.add(z4b)).multiplyRange2(ddd2, start, lessThan).multiplyByScalar(-3);
            dgx.push(z1.add(z2).add(z3).add(z4));
        }
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let t1a = this.dBasisFunctions_du[i].multiplyRange(s.zuu, start, lessThan);
            let t1b = this.d2BasisFunctions_du2[i].multiplyRange(s.zu, start, lessThan);
            let t1c = this.dBasisFunctions_du[i].multiplyRange(s.zuuu, start, lessThan);
            let t1d = this.d3BasisFunctions_du3[i].multiplyRange(s.zu, start, lessThan);
            let t1e = (t1a.subtract(t1b)).multiplyRange2(dd3, start, lessThan);
            let t1f = (t1c.subtract(t1d)).multiplyRange2(d3, start, lessThan);
            let t1 = t1e.add(t1f);
            let t3a = this.d2BasisFunctions_du2[i].multiplyRange(s.xu, start, lessThan);
            let t3b = this.dBasisFunctions_du[i].multiplyRange(s.xuu, start, lessThan);
            let t3c = this.d3BasisFunctions_du3[i].multiplyRange(s.xu, start, lessThan);
            let t3d = this.dBasisFunctions_du[i].multiplyRange(s.xuuu, start, lessThan);
            let t3e = (t3a.subtract(t3b)).multiplyRange2(dd2, start, lessThan);
            let t3f = (t3c.subtract(t3d)).multiplyRange2(d2, start, lessThan);
            let t3 = t3e.add(t3f);
            let z1 = (t1.add(t3)).multiplyRange2(l2, start, lessThan);
            let t4 = this.dBasisFunctions_du[i].multiplyRange(s.yu, start, lessThan).multiplyByScalar(2);
            let z2 = t4.multiplyRange2(ddd, start, lessThan);
            let z3a = (t1a.subtract(t1b)).multiplyRange2(d1, start, lessThan);
            let z3b = (t3a.subtract(t3b)).multiplyRange2(d3, start, lessThan);
            let z3 = (z3a.add(z3b)).multiplyRange2(dl2, start, lessThan).multiplyByScalar(-6);
            let z4a = this.dBasisFunctions_du[i].multiplyRange(s.yuu, start, lessThan);
            let z4b = this.d2BasisFunctions_du2[i].multiplyRange(s.yu, start, lessThan);
            let z4 = (z4a.add(z4b)).multiplyRange2(ddd2, start, lessThan).multiplyByScalar(-3);
            dgy.push(z1.add(z2).add(z3).add(z4));
        }
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let t1a = this.d2BasisFunctions_du2[i].multiplyRange(s.yu, start, lessThan);
            let t1b = this.dBasisFunctions_du[i].multiplyRange(s.yuu, start, lessThan);
            let t1c = this.d3BasisFunctions_du3[i].multiplyRange(s.yu, start, lessThan);
            let t1d = this.dBasisFunctions_du[i].multiplyRange(s.yuuu, start, lessThan);
            let t1e = (t1a.subtract(t1b)).multiplyRange2(dd2, start, lessThan);
            let t1f = (t1c.subtract(t1d)).multiplyRange2(d2, start, lessThan);
            let t1 = t1e.add(t1f);
            let t2a = this.dBasisFunctions_du[i].multiplyRange(s.xuu, start, lessThan);
            let t2b = this.d2BasisFunctions_du2[i].multiplyRange(s.xu, start, lessThan);
            let t2c = this.dBasisFunctions_du[i].multiplyRange(s.xuuu, start, lessThan);
            let t2d = this.d3BasisFunctions_du3[i].multiplyRange(s.xu, start, lessThan);
            let t2e = (t2a.subtract(t2b)).multiplyRange2(dd3, start, lessThan);
            let t2f = (t2c.subtract(t2d)).multiplyRange2(d3, start, lessThan);
            let t2 = t2e.add(t2f);
            let z1 = (t1.add(t2)).multiplyRange2(l2, start, lessThan);
            let t4 = this.dBasisFunctions_du[i].multiplyRange(s.yu, start, lessThan).multiplyByScalar(2);
            let z2 = t4.multiplyRange2(ddd, start, lessThan);
            let z3a = (t1a.subtract(t1b)).multiplyRange2(d1, start, lessThan);
            let z3b = (t2a.subtract(t2b)).multiplyRange2(d2, start, lessThan);
            let z3 = (z3a.add(z3b)).multiplyRange2(dl2, start, lessThan).multiplyByScalar(-6);
            let z4a = this.dBasisFunctions_du[i].multiplyRange(s.zuu, start, lessThan);
            let z4b = this.d2BasisFunctions_du2[i].multiplyRange(s.zu, start, lessThan);
            let z4 = (z4a.add(z4b)).multiplyRange2(ddd2, start, lessThan).multiplyByScalar(-3);
            dgz.push(z1.add(z2).add(z3).add(z4));
        }
        let result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 3 * controlPointsLength);
        for (let i = 0; i < controlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let cpz = dgz[i].flattenControlPointsArray();
            let start = Math.max(0, i - degree) * (6 * degree - 8);
            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (6 * degree - 8);
            let deltaj = 0;
            for (let inactiveConstraint of inactiveConstraints) {
                if (inactiveConstraint >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (let j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, 2 * controlPointsLength + i, cpz[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    }
    compute_zeroTorsionConstraints_gradient(s, constraintsSign, inactiveConstraints) {
        let dgx = [];
        let dgy = [];
        let dgz = [];
        const controlPointsLength = this.spline.controlPoints.length;
        const degree = this.spline.degree;
        const d1 = BernsteinDecompositionR1toR1_1.determinant2by2(s.zuu, s.yuu, s.zu, s.yu);
        const d2 = BernsteinDecompositionR1toR1_1.determinant2by2(s.xuu, s.zuu, s.xu, s.zu);
        const d3 = BernsteinDecompositionR1toR1_1.determinant2by2(s.yuu, s.xuu, s.yu, s.xu);
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let t1 = this.d3BasisFunctions_du3[i].multiplyRange(d1, start, lessThan);
            let t2 = this.d2BasisFunctions_du2[i].multiplyRange(s.yuuu, start, lessThan).multiplyRange2(s.zu, start, lessThan);
            let t3 = this.dBasisFunctions_du[i].multiplyRange(s.yuuu, start, lessThan).multiplyRange2(s.zuu, start, lessThan);
            let t4 = this.dBasisFunctions_du[i].multiplyRange(s.yuu, start, lessThan).multiplyRange2(s.zuuu, start, lessThan);
            let t5 = this.d2BasisFunctions_du2[i].multiplyRange(s.yu, start, lessThan).multiplyRange2(s.zuuu, start, lessThan);
            dgx.push((t1.add(t2).subtract(t3).add(t4).subtract(t5)));
        }
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let t1 = this.d3BasisFunctions_du3[i].multiplyRange(d2, start, lessThan);
            let t2 = this.dBasisFunctions_du[i].multiplyRange(s.xuuu, start, lessThan).multiplyRange2(s.zuu, start, lessThan);
            let t3 = this.d2BasisFunctions_du2[i].multiplyRange(s.xuuu, start, lessThan).multiplyRange2(s.zu, start, lessThan);
            let t4 = this.d2BasisFunctions_du2[i].multiplyRange(s.zuuu, start, lessThan).multiplyRange2(s.xu, start, lessThan);
            let t5 = this.dBasisFunctions_du[i].multiplyRange(s.zuuu, start, lessThan).multiplyRange2(s.xuu, start, lessThan);
            dgy.push((t1.add(t2).subtract(t3).add(t4).subtract(t5)));
        }
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let t1 = this.d3BasisFunctions_du3[i].multiplyRange(d3, start, lessThan);
            let t2 = this.d2BasisFunctions_du2[i].multiplyRange(s.xuuu, start, lessThan).multiplyRange2(s.yu, start, lessThan);
            let t3 = this.dBasisFunctions_du[i].multiplyRange(s.xuuu, start, lessThan).multiplyRange2(s.yuu, start, lessThan);
            let t4 = this.dBasisFunctions_du[i].multiplyRange(s.yuuu, start, lessThan).multiplyRange2(s.xuu, start, lessThan);
            let t5 = this.d2BasisFunctions_du2[i].multiplyRange(s.yuuu, start, lessThan).multiplyRange2(s.xu, start, lessThan);
            dgz.push((t1.add(t2).subtract(t3).add(t4).subtract(t5)));
        }
        const totalNumberOfConstraints = this.torsionConstraintsSign.length;
        let result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 3 * controlPointsLength);
        for (let i = 0; i < controlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let cpz = dgz[i].flattenControlPointsArray();
            let start = Math.max(0, i - degree) * (3 * degree - 5);
            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (3 * degree - 5);
            let deltaj = 0;
            for (let inactiveConstraint of inactiveConstraints) {
                if (inactiveConstraint >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (let j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, 2 * controlPointsLength + i, cpz[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    }
    computeBasisFunctionsDerivatives() {
        const n = this._spline.controlPoints.length;
        this._numberOfIndependentVariables = n * 2;
        let diracControlPoints = MathVectorBasicOperations_1.zeroVector(n);
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];
        for (let i = 0; i < n; i += 1) {
            diracControlPoints[i] = 1;
            let basisFunction = this.bSplineR1toR1Factory(diracControlPoints.slice(), this._spline.knots.slice());
            let dBasisFunction_du = basisFunction.derivative();
            let d2BasisFunction_du2 = dBasisFunction_du.derivative();
            let d3BasisFunction_du3 = d2BasisFunction_du2.derivative();
            this.dBasisFunctions_du.push(dBasisFunction_du.bernsteinDecomposition());
            this.d2BasisFunctions_du2.push(d2BasisFunction_du2.bernsteinDecomposition());
            this.d3BasisFunctions_du3.push(d3BasisFunction_du3.bernsteinDecomposition());
            diracControlPoints[i] = 0;
        }
    }
}
exports.OptimizationProblemBSplineR1toR3 = OptimizationProblemBSplineR1toR3;


/***/ }),

/***/ "./src/bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2.ts":
/*!**************************************************************************************!*\
  !*** ./src/bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const MathVectorBasicOperations_1 = __webpack_require__(/*! ../linearAlgebra/MathVectorBasicOperations */ "./src/linearAlgebra/MathVectorBasicOperations.ts");
const PeriodicBSplineR1toR1_1 = __webpack_require__(/*! ../bsplines/PeriodicBSplineR1toR1 */ "./src/bsplines/PeriodicBSplineR1toR1.ts");
const DenseMatrix_1 = __webpack_require__(/*! ../linearAlgebra/DenseMatrix */ "./src/linearAlgebra/DenseMatrix.ts");
const AbstractOptimizationProblemBSplineR1toR2_1 = __webpack_require__(/*! ./AbstractOptimizationProblemBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2.ts");
class OptimizationProblemPeriodicBSplineR1toR2 extends AbstractOptimizationProblemBSplineR1toR2_1.AbstractOptimizationProblemBSplineR1toR2 {
    constructor(target, initial, activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
        super(target, initial, activeControl);
        this.activeControl = activeControl;
    }
    get spline() {
        return this._spline;
    }
    bSplineR1toR1Factory(controlPoints, knots) {
        return new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(controlPoints, knots);
    }
    setTargetSpline(spline) {
        this._target = spline.clone();
        this._gradient_f0 = this.compute_gradient_f0(this.spline);
        this._f0 = this.compute_f0(this._gradient_f0);
    }
    /**
     * Some contraints are set inactive to allowed the point of inflection or curvature extrema
     * to slide along the curve.
     **/
    computeInactiveConstraints(controlPoints) {
        let controlPointsSequences = this.extractChangingSignControlPointsSequences(controlPoints);
        let result = this.extractControlPointsClosestToZero(controlPointsSequences);
        const firstCP = controlPoints[0];
        const lastCP = controlPoints[controlPoints.length - 1];
        if (firstCP * lastCP <= 0) {
            if (Math.pow(firstCP, 2) <= Math.pow(lastCP, 2)) {
                if (result[0] != 0) {
                    result = [0].concat(result);
                }
            }
            else {
                if (result[result.length - 1] != controlPoints.length - 1) {
                    result.push(controlPoints.length - 1);
                }
            }
        }
        return result;
    }
    extractChangingSignControlPointsSequences(controlPoints) {
        let result = [];
        let successiveControlPoints = [];
        let i = 1;
        while (i < controlPoints.length) {
            successiveControlPoints = [];
            if (controlPoints[i - 1] * controlPoints[i] <= 0) {
                successiveControlPoints.push({ index: i - 1, value: controlPoints[i - 1] });
                successiveControlPoints.push({ index: i, value: controlPoints[i] });
                i += 1;
                while (controlPoints[i - 1] * controlPoints[i] <= 0) {
                    successiveControlPoints.push({ index: i, value: controlPoints[i] });
                    i += 1;
                }
                result.push(successiveControlPoints);
            }
            i += 1;
        }
        return result;
    }
    extractControlPointsClosestToZero(polygonSegments) {
        let result = [];
        for (let polygonSegment of polygonSegments) {
            let s = this.removeBiggest(polygonSegment);
            for (let iv of s) {
                result.push(iv.index);
            }
        }
        return result;
    }
    removeBiggest(controlPointsSequence) {
        let result = controlPointsSequence.slice();
        let maxIndex = 0;
        for (let i = 1; i < controlPointsSequence.length; i += 1) {
            if (Math.pow(controlPointsSequence[i].value, 2) > Math.pow(controlPointsSequence[maxIndex].value, 2)) {
                maxIndex = i;
            }
        }
        result.splice(maxIndex, 1);
        return result;
    }
    compute_curvatureExtremaConstraints_gradient(e, constraintsSign, inactiveConstraints) {
        const sxu = e.bdsxu;
        const sxuu = e.bdsxuu;
        const sxuuu = e.bdsxuuu;
        const syu = e.bdsyu;
        const syuu = e.bdsyuu;
        const syuuu = e.bdsyuuu;
        const h1 = e.h1;
        const h2 = e.h2;
        const h3 = e.h3;
        const h4 = e.h4;
        let dgx = [];
        let dgy = [];
        const periodicControlPointsLength = this.spline.freeControlPoints.length;
        const totalNumberOfConstraints = constraintsSign.length;
        const degree = this.spline.degree;
        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            // moved control point : i
            // periodicControlPointsLength = n - degree (it is necessery to add degree cyclic control points, if we do not count them we have n - degree control points)
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(periodicControlPointsLength, i + 1);
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(periodicControlPointsLength, i + 1);
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        let result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * periodicControlPointsLength);
        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let start = Math.max(0, i - degree) * (4 * degree - 5);
            let lessThan = Math.min(periodicControlPointsLength, i + 1) * (4 * degree - 5);
            let deltaj = 0;
            for (let inactiveConstraint of inactiveConstraints) {
                if (inactiveConstraint >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (let j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, periodicControlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        //Adding periodic term inside the Matrix
        // The effect of the first control points over the constraints at the end
        for (let i = 0; i < degree; i += 1) {
            // moved control point : i
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]
            let start = i - degree + periodicControlPointsLength;
            let lessThan = periodicControlPointsLength;
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (let i = 0; i < degree; i += 1) {
            let start = i - degree + periodicControlPointsLength;
            let lessThan = periodicControlPointsLength;
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (let i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let start = (i - degree) * (4 * degree - 5);
            let lessThan = (periodicControlPointsLength) * (4 * degree - 5);
            let deltaj = 0;
            for (let inactiveConstraint of inactiveConstraints) {
                if (inactiveConstraint >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (let j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i - periodicControlPointsLength, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    }
    compute_inflectionConstraints_gradient(e, constraintsSign, inactiveConstraints) {
        const sxu = e.bdsxu;
        const sxuu = e.bdsxuu;
        const syu = e.bdsyu;
        const syuu = e.bdsyuu;
        let dgx = [];
        let dgy = [];
        const periodicControlPointsLength = this.spline.freeControlPoints.length;
        const degree = this.spline.degree;
        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(periodicControlPointsLength, i + 1);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(periodicControlPointsLength, i + 1);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        const totalNumberOfConstraints = this.inflectionConstraintsSign.length;
        let result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * periodicControlPointsLength);
        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let start = Math.max(0, i - degree) * (2 * degree - 2);
            let lessThan = Math.min(periodicControlPointsLength, i + 1) * (2 * degree - 2);
            let deltaj = 0;
            for (let inactiveConstraint of inactiveConstraints) {
                if (inactiveConstraint >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (let j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, periodicControlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        //Adding periodic term inside the Matrix
        // The effect of the first control points over the constraints at the end
        for (let i = 0; i < degree; i += 1) {
            // moved control point : i
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]
            let start = i - degree + periodicControlPointsLength;
            let lessThan = periodicControlPointsLength;
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (let i = 0; i < degree; i += 1) {
            let start = i - degree + periodicControlPointsLength;
            let lessThan = periodicControlPointsLength;
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        for (let i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let start = Math.max(0, i - degree) * (2 * degree - 2);
            let lessThan = (periodicControlPointsLength) * (2 * degree - 2);
            let deltaj = 0;
            for (let inactiveConstraint of inactiveConstraints) {
                if (inactiveConstraint >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (let j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i - periodicControlPointsLength, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    }
    computeBasisFunctionsDerivatives() {
        const n = this.spline.controlPoints.length;
        const m = this.spline.freeControlPoints.length;
        this._numberOfIndependentVariables = m * 2;
        let diracControlPoints = MathVectorBasicOperations_1.zeroVector(n);
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];
        for (let i = 0; i < m; i += 1) {
            diracControlPoints[i] = 1;
            if (i < this.spline.degree) {
                diracControlPoints[m + i] = 1;
            }
            let basisFunction = this.bSplineR1toR1Factory(diracControlPoints.slice(), this.spline.knots.slice());
            let dBasisFunction_du = basisFunction.derivative();
            let d2BasisFunction_du2 = dBasisFunction_du.derivative();
            let d3BasisFunction_du3 = d2BasisFunction_du2.derivative();
            this.dBasisFunctions_du.push(dBasisFunction_du.bernsteinDecomposition());
            this.d2BasisFunctions_du2.push(d2BasisFunction_du2.bernsteinDecomposition());
            this.d3BasisFunctions_du3.push(d3BasisFunction_du3.bernsteinDecomposition());
            diracControlPoints[i] = 0;
            if (i < this.spline.degree) {
                diracControlPoints[m + i] = 0;
            }
        }
    }
}
exports.OptimizationProblemPeriodicBSplineR1toR2 = OptimizationProblemPeriodicBSplineR1toR2;


/***/ }),

/***/ "./src/bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2QuasiNewton.ts":
/*!*************************************************************************************************!*\
  !*** ./src/bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2QuasiNewton.ts ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const MathVectorBasicOperations_1 = __webpack_require__(/*! ../linearAlgebra/MathVectorBasicOperations */ "./src/linearAlgebra/MathVectorBasicOperations.ts");
const PeriodicBSplineR1toR1_1 = __webpack_require__(/*! ../bsplines/PeriodicBSplineR1toR1 */ "./src/bsplines/PeriodicBSplineR1toR1.ts");
const DenseMatrix_1 = __webpack_require__(/*! ../linearAlgebra/DenseMatrix */ "./src/linearAlgebra/DenseMatrix.ts");
const AbstractOptimizationProblemBSplineR1toR2_1 = __webpack_require__(/*! ./AbstractOptimizationProblemBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2.ts");
const SymmetricMatrix_1 = __webpack_require__(/*! ../linearAlgebra/SymmetricMatrix */ "./src/linearAlgebra/SymmetricMatrix.ts");
class OptimizationProblemPeriodicBSplineR1toR2QuasiNewton extends AbstractOptimizationProblemBSplineR1toR2_1.AbstractOptimizationProblemBSplineR1toR2 {
    constructor(target, initial, activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
        super(target, initial, activeControl);
        this.activeControl = activeControl;
        this.barrierHessianApproximation = [];
        this.curvatureExtremaConstraintsHessians = [];
        this.inflectionConstraintsHessians = [];
        const totalNumberOfCurvatureExtremaConstraints = this.curvatureExtremaConstraintsSign.length;
        const totalNumberOfInflectionConstraints = this.inflectionConstraintsSign.length;
        const totalPossibleNumberOfConstraints = this.curvatureExtremaConstraintsSign.length + this.inflectionConstraintsSign.length;
        const totalNumberOfActiveConstraints = totalPossibleNumberOfConstraints - this._inflectionInactiveConstraints.length - this._curvatureExtremaInactiveConstraints.length;
        //this.previousGradient_f = new DenseMatrix(totalPossibleNumberOfConstraints, this.numberOfIndependentVariables)
        this.previousCurvatureExtremaConstraintsGradient = new DenseMatrix_1.DenseMatrix(this.curvatureExtremaConstraintsSign.length, this.numberOfIndependentVariables);
        this.currentCurvatureExtremaConstraintsGradient = this.previousCurvatureExtremaConstraintsGradient;
        this.previousInflectionConstraintsGradient = new DenseMatrix_1.DenseMatrix(this.inflectionConstraintsSign.length, this.numberOfIndependentVariables);
        this.currentInflectionConstraintsGradient = this.previousInflectionConstraintsGradient;
        for (let i = 0; i < totalNumberOfActiveConstraints; i += 1) {
            this.barrierHessianApproximation.push(new SymmetricMatrix_1.SymmetricMatrix(this.gradient_f.shape[1]));
        }
        for (let i = 0; i < totalNumberOfCurvatureExtremaConstraints; i += 1) {
            this.curvatureExtremaConstraintsHessians.push(new SymmetricMatrix_1.SymmetricMatrix(this.gradient_f.shape[1]));
        }
        for (let i = 0; i < totalNumberOfInflectionConstraints; i += 1) {
            this.inflectionConstraintsHessians.push(new SymmetricMatrix_1.SymmetricMatrix(this.gradient_f.shape[1]));
        }
    }
    get spline() {
        return this._spline;
    }
    get hessian_f() {
        //return undefined
        return this.barrierHessianApproximation.slice(0, this._f.length);
    }
    bSplineR1toR1Factory(controlPoints, knots) {
        return new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(controlPoints, knots);
    }
    setTargetSpline(spline) {
        this._target = spline.clone();
        this._gradient_f0 = this.compute_gradient_f0(this.spline);
        this._f0 = this.compute_f0(this._gradient_f0);
    }
    /**
     * Some contraints are set inactive to allowed the point of inflection or curvature extrema
     * to slide along the curve.
     **/
    computeInactiveConstraints(controlPoints) {
        //return [] 
        let controlPointsSequences = this.extractChangingSignControlPointsSequences(controlPoints);
        let result = this.extractControlPointsClosestToZero(controlPointsSequences);
        const firstCP = controlPoints[0];
        const lastCP = controlPoints[controlPoints.length - 1];
        if (firstCP * lastCP <= 0) {
            if (Math.pow(firstCP, 2) <= Math.pow(lastCP, 2)) {
                if (result[0] != 0) {
                    result = [0].concat(result);
                }
            }
            else {
                if (result[result.length - 1] != controlPoints.length - 1) {
                    result.push(controlPoints.length - 1);
                }
            }
        }
        return result;
    }
    extractChangingSignControlPointsSequences(controlPoints) {
        let result = [];
        let successiveControlPoints = [];
        let i = 1;
        while (i < controlPoints.length) {
            successiveControlPoints = [];
            if (controlPoints[i - 1] * controlPoints[i] <= 0) {
                successiveControlPoints.push({ index: i - 1, value: controlPoints[i - 1] });
                successiveControlPoints.push({ index: i, value: controlPoints[i] });
                i += 1;
                while (controlPoints[i - 1] * controlPoints[i] <= 0) {
                    successiveControlPoints.push({ index: i, value: controlPoints[i] });
                    i += 1;
                }
                result.push(successiveControlPoints);
            }
            i += 1;
        }
        return result;
    }
    extractControlPointsClosestToZero(polygonSegments) {
        let result = [];
        for (let polygonSegment of polygonSegments) {
            let s = this.removeBiggest(polygonSegment);
            for (let iv of s) {
                result.push(iv.index);
            }
        }
        return result;
    }
    removeBiggest(controlPointsSequence) {
        let result = controlPointsSequence.slice();
        let maxIndex = 0;
        for (let i = 1; i < controlPointsSequence.length; i += 1) {
            if (Math.pow(controlPointsSequence[i].value, 2) > Math.pow(controlPointsSequence[maxIndex].value, 2)) {
                maxIndex = i;
            }
        }
        result.splice(maxIndex, 1);
        return result;
    }
    compute_curvatureExtremaConstraints_gradient_full(e, constraintsSign) {
        const sxu = e.bdsxu;
        const sxuu = e.bdsxuu;
        const sxuuu = e.bdsxuuu;
        const syu = e.bdsyu;
        const syuu = e.bdsyuu;
        const syuuu = e.bdsyuuu;
        const h1 = e.h1;
        const h2 = e.h2;
        const h3 = e.h3;
        const h4 = e.h4;
        let dgx = [];
        let dgy = [];
        const periodicControlPointsLength = this.spline.freeControlPoints.length;
        const totalNumberOfConstraints = constraintsSign.length;
        const degree = this.spline.degree;
        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            // moved control point : i
            // periodicControlPointsLength = n - degree (it is necessery to add degree cyclic control points, if we do not count them we have n - degree control points)
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(periodicControlPointsLength, i + 1);
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(periodicControlPointsLength, i + 1);
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        let result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints, 2 * periodicControlPointsLength);
        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let start = Math.max(0, i - degree) * (4 * degree - 5);
            let lessThan = Math.min(periodicControlPointsLength, i + 1) * (4 * degree - 5);
            for (let j = start; j < lessThan; j += 1) {
                result.set(j, i, cpx[j - start] * constraintsSign[j]);
                result.set(j, periodicControlPointsLength + i, cpy[j - start] * constraintsSign[j]);
            }
        }
        //Adding periodic term inside the Matrix
        // The effect of the first control points over the constraints at the end
        for (let i = 0; i < degree; i += 1) {
            // moved control point : i
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]
            let start = i - degree + periodicControlPointsLength;
            let lessThan = periodicControlPointsLength;
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan);
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan);
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (let i = 0; i < degree; i += 1) {
            let start = i - degree + periodicControlPointsLength;
            let lessThan = periodicControlPointsLength;
            let h1_subset = h1.subset(start, lessThan);
            let h2_subset = h2.subset(start, lessThan);
            let h3_subset = h3.subset(start, lessThan);
            let h4_subset = h4.subset(start, lessThan);
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan);
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan);
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (let i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let start = (i - degree) * (4 * degree - 5);
            let lessThan = (periodicControlPointsLength) * (4 * degree - 5);
            for (let j = start; j < lessThan; j += 1) {
                result.set(j, i - periodicControlPointsLength, cpx[j - start] * constraintsSign[j]);
                result.set(j, i, cpy[j - start] * constraintsSign[j]);
            }
        }
        return result;
    }
    compute_curvatureExtremaConstraints_gradient(e, constraintsSign, inactiveConstraints) {
        let result = this.compute_curvatureExtremaConstraints_gradient_full(e, constraintsSign);
        this.currentCurvatureExtremaConstraintsGradient = result;
        return result.removeRows(inactiveConstraints);
    }
    compute_inflectionConstraints_gradient_full(e, constraintsSign) {
        const sxu = e.bdsxu;
        const sxuu = e.bdsxuu;
        const syu = e.bdsyu;
        const syuu = e.bdsyuu;
        let dgx = [];
        let dgy = [];
        const periodicControlPointsLength = this.spline.freeControlPoints.length;
        const degree = this.spline.degree;
        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(periodicControlPointsLength, i + 1);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(periodicControlPointsLength, i + 1);
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        const totalNumberOfConstraints = this.inflectionConstraintsSign.length;
        let result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints, 2 * periodicControlPointsLength);
        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let start = Math.max(0, i - degree) * (2 * degree - 2);
            let lessThan = Math.min(periodicControlPointsLength, i + 1) * (2 * degree - 2);
            for (let j = start; j < lessThan; j += 1) {
                result.set(j, i, cpx[j - start] * constraintsSign[j]);
                result.set(j, periodicControlPointsLength + i, cpy[j - start] * constraintsSign[j]);
            }
        }
        //Adding periodic term inside the Matrix
        // The effect of the first control points over the constraints at the end
        for (let i = 0; i < degree; i += 1) {
            // moved control point : i
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]
            let start = i - degree + periodicControlPointsLength;
            let lessThan = periodicControlPointsLength;
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (let i = 0; i < degree; i += 1) {
            let start = i - degree + periodicControlPointsLength;
            let lessThan = periodicControlPointsLength;
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        for (let i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let start = Math.max(0, i - degree) * (2 * degree - 2);
            let lessThan = (periodicControlPointsLength) * (2 * degree - 2);
            for (let j = start; j < lessThan; j += 1) {
                result.set(j, i - periodicControlPointsLength, cpx[j - start] * constraintsSign[j]);
                result.set(j, i, cpy[j - start] * constraintsSign[j]);
            }
        }
        return result;
    }
    compute_inflectionConstraints_gradient(e, constraintsSign, inactiveConstraints) {
        let result = this.compute_inflectionConstraints_gradient_full(e, constraintsSign);
        this.currentInflectionConstraintsGradient = result;
        return result.removeRows(inactiveConstraints);
    }
    computeBasisFunctionsDerivatives() {
        const n = this._spline.controlPoints.length;
        const m = this._spline.freeControlPoints.length;
        this._numberOfIndependentVariables = m * 2;
        let diracControlPoints = MathVectorBasicOperations_1.zeroVector(n);
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];
        for (let i = 0; i < m; i += 1) {
            diracControlPoints[i] = 1;
            if (i < this.spline.degree) {
                diracControlPoints[m + i] = 1;
            }
            let basisFunction = this.bSplineR1toR1Factory(diracControlPoints.slice(), this.spline.knots.slice());
            let dBasisFunction_du = basisFunction.derivative();
            let d2BasisFunction_du2 = dBasisFunction_du.derivative();
            let d3BasisFunction_du3 = d2BasisFunction_du2.derivative();
            this.dBasisFunctions_du.push(dBasisFunction_du.bernsteinDecomposition());
            this.d2BasisFunctions_du2.push(d2BasisFunction_du2.bernsteinDecomposition());
            this.d3BasisFunctions_du3.push(d3BasisFunction_du3.bernsteinDecomposition());
            diracControlPoints[i] = 0;
            if (i < this.spline.degree) {
                diracControlPoints[m + i] = 0;
            }
        }
    }
    step(deltaX) {
        this.spline.optimizerStep(deltaX);
        this._gradient_f0 = this.compute_gradient_f0(this._spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        const e = this.expensiveComputation(this._spline);
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g);
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g);
        const curvatureNumerator = this.curvatureNumerator(e.h4);
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator);
        this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator);
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints);
        this.curvatureExtremaConstraintsHessians = this.computeSymmetricRank1Update(deltaX, this.currentCurvatureExtremaConstraintsGradient, this.previousCurvatureExtremaConstraintsGradient, this.curvatureExtremaConstraintsHessians);
        this.previousCurvatureExtremaConstraintsGradient = this.currentCurvatureExtremaConstraintsGradient;
        this.inflectionConstraintsHessians = this.computeSymmetricRank1Update(deltaX, this.currentInflectionConstraintsGradient, this.previousInflectionConstraintsGradient, this.inflectionConstraintsHessians);
        this.previousInflectionConstraintsGradient = this.currentInflectionConstraintsGradient;
        //this.updateSymmetricRank1(deltaX, this._gradient_f)
        this.barrierHessianApproximation = MathVectorBasicOperations_1.removeElements(this.inflectionConstraintsHessians, this.inflectionInactiveConstraints).concat(MathVectorBasicOperations_1.removeElements(this.curvatureExtremaConstraintsHessians, this.curvatureExtremaInactiveConstraints));
    }
    /**
     * Update the symmetric matrix hessian with an improvement of rank 1
     * See: Jorge Nocedal and Stephen J. Wright,
     * Numerical Optimization, Second Edition, p. 144 (The SR1 Method)
     */
    /*
     updateSymmetricRank1(step: number[], f: number[], gradient_f: MatrixInterface) {
        let m = gradient_f.shape[0] // number of constraints
        let n = gradient_f.shape[1] // number of free variables
        let deltaGradient: number[][] = []
        for (let i = 0; i < m; i += 1) {
            deltaGradient.push([])
            for (let j = 0; j < n; j += 1) {
                deltaGradient[i].push(gradient_f.get(i, j) - this.previousGradient_f.get(i, j))
            }
        }
        for (let i = 0; i < m ; i += 1) {
            const hessian = this.computeSR1(step, deltaGradient[i], this.barrierHessianApproximation[i])
            if (hessian) {
                this.barrierHessianApproximation[i] = hessian
            }
            else {
                //console.log("approximation hessian not defined")
                this.barrierHessianApproximation[i] = new SymmetricMatrix(n)
            }
        }
        for (let i = 0; i < gradient_f.shape[0]; i += 1) {
            for (let j = 0; j< gradient_f.shape[1]; j += 1) {
                this.previousGradient_f.set(i, j, gradient_f.get(i, j))
            }
        }
    }
    */
    computeSymmetricRank1Update(step, gradients, previousGradients, previousHessians) {
        let m = gradients.shape[0]; // number of constraints
        let n = gradients.shape[1]; // number of free variables
        let deltaGradient = [];
        let result = [];
        for (let i = 0; i < m; i += 1) {
            deltaGradient.push([]);
            for (let j = 0; j < n; j += 1) {
                deltaGradient[i].push(gradients.get(i, j) - previousGradients.get(i, j));
            }
        }
        for (let i = 0; i < m; i += 1) {
            const hessian = this.computeSR1(step, deltaGradient[i], previousHessians[i]);
            if (hessian) {
                result.push(hessian);
            }
            else {
                //console.log("approximation hessian not defined")
                result.push(new SymmetricMatrix_1.SymmetricMatrix(n));
            }
        }
        return result;
    }
    computeSR1(step, deltaGradient, previousHessian, r = 10e-8) {
        let m = step.length;
        let result = new SymmetricMatrix_1.SymmetricMatrix(m);
        let v = [];
        for (let i = 0; i < m; i += 1) {
            let c = 0;
            for (let j = 0; j < m; j += 1) {
                c += previousHessian.get(i, j) * step[j];
            }
            v.push(deltaGradient[i] - c);
        }
        const vTs = MathVectorBasicOperations_1.dotProduct(step, v);
        if (vTs <= r * MathVectorBasicOperations_1.norm(step) * MathVectorBasicOperations_1.norm(v)) {
            //console.log(vTs)
            return undefined;
        }
        for (let i = 0; i < m; i += 1) {
            for (let j = 0; j <= i; j += 1) {
                let h = previousHessian.get(i, j);
                let vvT = v[i] * v[j];
                result.set(i, j, h + vvT / vTs);
                //result.set(i, j, 0)
            }
        }
        return result;
    }
}
exports.OptimizationProblemPeriodicBSplineR1toR2QuasiNewton = OptimizationProblemPeriodicBSplineR1toR2QuasiNewton;


/***/ }),

/***/ "./src/bsplinesOptimizationProblems/OptimizationProblemRationalBSplineR1toR2.ts":
/*!**************************************************************************************!*\
  !*** ./src/bsplinesOptimizationProblems/OptimizationProblemRationalBSplineR1toR2.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BSplineR1toR1_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR1 */ "./src/bsplines/BSplineR1toR1.ts");
const DenseMatrix_1 = __webpack_require__(/*! ../linearAlgebra/DenseMatrix */ "./src/linearAlgebra/DenseMatrix.ts");
const AbstractOptimizationProblemBSplineR1toR2_1 = __webpack_require__(/*! ./AbstractOptimizationProblemBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2.ts");
const MathVectorBasicOperations_1 = __webpack_require__(/*! ../linearAlgebra/MathVectorBasicOperations */ "./src/linearAlgebra/MathVectorBasicOperations.ts");
const BernsteinDecompositionR1toR1_1 = __webpack_require__(/*! ../bsplines/BernsteinDecompositionR1toR1 */ "./src/bsplines/BernsteinDecompositionR1toR1.ts");
const AbstractOptimizationProblemRationalBSplineR1toR2_1 = __webpack_require__(/*! ./AbstractOptimizationProblemRationalBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemRationalBSplineR1toR2.ts");
class OptimizationProblemRationalBSplineR1toR2 extends AbstractOptimizationProblemRationalBSplineR1toR2_1.AbstractOptimizationProblemRationalBSplineR1toR2 {
    constructor(target, initial, activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
        super(target, initial, activeControl);
        this.activeControl = activeControl;
    }
    get spline() {
        return this._spline;
    }
    bSplineR1toR1Factory(controlPoints, knots) {
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    }
    setTargetSpline(spline) {
        this._target = spline.clone();
        this._gradient_f0 = this.compute_gradient_f0(this.spline);
        this._f0 = this.compute_f0(this._gradient_f0);
    }
    /**
     * Some contraints are set inactive to allowed the point of inflection or curvature extrema
     * to slide along the curve.
     **/
    computeInactiveConstraints(controlPoints) {
        let controlPointsSequences = this.extractChangingSignControlPointsSequences(controlPoints);
        return this.extractControlPointsClosestToZero(controlPointsSequences);
    }
    extractChangingSignControlPointsSequences(controlPoints) {
        let result = [];
        let successiveControlPoints = [];
        let i = 1;
        while (i < controlPoints.length) {
            successiveControlPoints = [];
            if (controlPoints[i - 1] * controlPoints[i] <= 0) {
                successiveControlPoints.push({ index: i - 1, value: controlPoints[i - 1] });
                successiveControlPoints.push({ index: i, value: controlPoints[i] });
                i += 1;
                while (controlPoints[i - 1] * controlPoints[i] <= 0) {
                    successiveControlPoints.push({ index: i, value: controlPoints[i] });
                    i += 1;
                }
                result.push(successiveControlPoints);
            }
            i += 1;
        }
        return result;
    }
    extractControlPointsClosestToZero(polygonSegments) {
        let result = [];
        for (let polygonSegment of polygonSegments) {
            let s = this.removeBiggest(polygonSegment);
            for (let iv of s) {
                result.push(iv.index);
            }
        }
        return result;
    }
    removeBiggest(controlPointsSequence) {
        let result = controlPointsSequence.slice();
        let maxIndex = 0;
        for (let i = 1; i < controlPointsSequence.length; i += 1) {
            if (Math.pow(controlPointsSequence[i].value, 2) > Math.pow(controlPointsSequence[maxIndex].value, 2)) {
                maxIndex = i;
            }
        }
        result.splice(maxIndex, 1);
        return result;
    }
    compute_curvatureExtremaConstraints_gradient(s, ct, constraintsSign, inactiveConstraints) {
        let dgx = [];
        let dgy = [];
        let dgw = [];
        const controlPointsLength = this.spline.controlPoints.length;
        const totalNumberOfConstraints = constraintsSign.length;
        const degree = this.spline.degree;
        const D1xD3 = BernsteinDecompositionR1toR1_1.determinant2by2(ct.D1x, ct.D1y, ct.D3x, ct.D3y);
        const D1xD21 = BernsteinDecompositionR1toR1_1.determinant2by2(ct.D1x, ct.D1y, ct.D21x, ct.D21y);
        const D1xD2 = BernsteinDecompositionR1toR1_1.determinant2by2(ct.D1x, ct.D1y, ct.D2x, ct.D2y);
        const D1dotD1 = ct.D1x.multiply(ct.D1x).add(ct.D1y.multiply(ct.D1y));
        const D1dotD2 = ct.D1x.multiply(ct.D2x).add(ct.D1y.multiply(ct.D2y));
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let dD1 = this.dBasisFunctions_du[i].multiplyRange(s.w, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.wu, start, lessThan));
            let dD2 = this.d2BasisFunctions_du2[i].multiplyRange(s.w, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.wuu, start, lessThan));
            let dD3 = this.d3BasisFunctions_du3[i].multiplyRange(s.w, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.wuuu, start, lessThan));
            let dD21 = this.d2BasisFunctions_du2[i].multiplyRange(s.wu, start, lessThan).subtract(this.dBasisFunctions_du[i].multiplyRange(s.wuu, start, lessThan));
            let dD1xD3 = dD1.multiplyRange2(ct.D3y, start, lessThan).subtract(dD3.multiplyRange2(ct.D1y, start, lessThan));
            let dD1xD21 = dD1.multiplyRange2(ct.D21y, start, lessThan).subtract(dD21.multiplyRange2(ct.D1y, start, lessThan));
            let dD1xD2 = dD1.multiplyRange2(ct.D2y, start, lessThan).subtract(dD2.multiplyRange2(ct.D1y, start, lessThan));
            let dD1dotD1 = dD1.multiplyRange2(ct.D1x, start, lessThan).multiplyByScalar(2);
            let dD1dotD2 = dD1.multiplyRange2(ct.D2x, start, lessThan).add(dD2.multiplyRange2(ct.D1x, start, lessThan));
            let t1a = dD1xD3.multiply(D1dotD1).multiplyRange2(s.w, start, lessThan);
            let t1b = dD1dotD1.multiplyRange2(D1xD3, start, lessThan).multiplyRange2(s.w, start, lessThan);
            let t1 = t1a.add(t1b);
            let t2a = dD1xD21.multiply(D1dotD1).multiplyRange2(s.w, start, lessThan);
            let t2b = dD1dotD1.multiplyRange2(D1xD21, start, lessThan).multiplyRange2(s.w, start, lessThan);
            let t2 = t2a.add(t2b);
            let t3a = dD1xD2.multiplyRange2(D1dotD1, start, lessThan).multiplyRange2(s.wu, start, lessThan).multiplyByScalar(2);
            let t3b = dD1dotD1.multiplyRange2(D1xD2, start, lessThan).multiplyRange2(s.wu, start, lessThan).multiplyByScalar(2);
            let t3 = t3a.add(t3b);
            let t4a = dD1xD2.multiplyRange2(D1dotD2, start, lessThan).multiplyRange2(s.w, start, lessThan).multiplyByScalar(-3);
            let t4b = dD1dotD2.multiplyRange2(D1xD2, start, lessThan).multiplyRange2(s.w, start, lessThan).multiplyByScalar(-3);
            let t4 = t4a.add(t4b);
            dgx.push(t1.add(t2).add(t3).add(t4));
        }
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let dD1 = this.dBasisFunctions_du[i].multiplyRange(s.w, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.wu, start, lessThan));
            let dD2 = this.d2BasisFunctions_du2[i].multiplyRange(s.w, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.wuu, start, lessThan));
            let dD3 = this.d3BasisFunctions_du3[i].multiplyRange(s.w, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.wuuu, start, lessThan));
            let dD21 = this.d2BasisFunctions_du2[i].multiplyRange(s.wu, start, lessThan).subtract(this.dBasisFunctions_du[i].multiplyRange(s.wuu, start, lessThan));
            let dD1xD3 = dD3.multiplyRange2(ct.D1x, start, lessThan).subtract(dD1.multiplyRange2(ct.D3x, start, lessThan));
            let dD1xD21 = dD21.multiplyRange2(ct.D1x, start, lessThan).subtract(dD1.multiplyRange2(ct.D21x, start, lessThan));
            let dD1xD2 = dD2.multiplyRange2(ct.D1x, start, lessThan).subtract(dD1.multiplyRange2(ct.D2x, start, lessThan));
            let dD1dotD1 = dD1.multiplyRange2(ct.D1y, start, lessThan).multiplyByScalar(2);
            let dD1dotD2 = dD1.multiplyRange2(ct.D2y, start, lessThan).add(dD2.multiplyRange2(ct.D1y, start, lessThan));
            let t1a = dD1xD3.multiply(D1dotD1).multiplyRange2(s.w, start, lessThan);
            let t1b = dD1dotD1.multiplyRange2(D1xD3, start, lessThan).multiplyRange2(s.w, start, lessThan);
            let t1 = t1a.add(t1b);
            let t2a = dD1xD21.multiply(D1dotD1).multiplyRange2(s.w, start, lessThan);
            let t2b = dD1dotD1.multiplyRange2(D1xD21, start, lessThan).multiplyRange2(s.w, start, lessThan);
            let t2 = t2a.add(t2b);
            let t3a = dD1xD2.multiplyRange2(D1dotD1, start, lessThan).multiplyRange2(s.wu, start, lessThan).multiplyByScalar(2);
            let t3b = dD1dotD1.multiplyRange2(D1xD2, start, lessThan).multiplyRange2(s.wu, start, lessThan).multiplyByScalar(2);
            let t3 = t3a.add(t3b);
            let t4a = dD1xD2.multiplyRange2(D1dotD2, start, lessThan).multiplyRange2(s.w, start, lessThan).multiplyByScalar(-3);
            let t4b = dD1dotD2.multiplyRange2(D1xD2, start, lessThan).multiplyRange2(s.w, start, lessThan).multiplyByScalar(-3);
            let t4 = t4a.add(t4b);
            dgy.push(t1.add(t2).add(t3).add(t4));
        }
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let t1 = this.basisFunctions[i].multiplyRange(D1xD3, start, lessThan).multiplyRange2(D1dotD1, start, lessThan);
            let t2 = this.basisFunctions[i].multiplyRange(D1xD21, start, lessThan).multiplyRange2(D1dotD1, start, lessThan);
            let t3 = this.dBasisFunctions_du[i].multiplyRange(D1xD2, start, lessThan).multiplyRange2(D1dotD1, start, lessThan).multiplyByScalar(2);
            let t4 = this.basisFunctions[i].multiplyRange(D1xD2, start, lessThan).multiplyRange2(D1dotD2, start, lessThan).multiplyByScalar(-3);
            dgw.push(t1.add(t2).add(t3).add(t4));
        }
        let result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 3 * controlPointsLength);
        for (let i = 0; i < controlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();
            let cpw = dgw[i].flattenControlPointsArray();
            let start = Math.max(0, i - degree) * (9 * degree - 5);
            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (9 * degree - 5);
            let deltaj = 0;
            for (let inactiveConstraint of inactiveConstraints) {
                if (inactiveConstraint >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (let j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, 2 * controlPointsLength + i, cpw[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    }
    compute_inflectionConstraints_gradient(s, constraintsSign, inactiveConstraints) {
        let dgx = [];
        let dgy = [];
        let dgw = [];
        const controlPointsLength = this.spline.controlPoints.length;
        const degree = this.spline.degree;
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let t1 = (this.dBasisFunctions_du[i].multiplyRange(s.yuu, start, lessThan).subtract(this.d2BasisFunctions_du2[i].multiplyRange(s.yu, start, lessThan))).multiplyRange2(s.w, start, lessThan);
            let t2 = (this.basisFunctions[i].multiplyRange(s.yuu, start, lessThan).subtract(this.d2BasisFunctions_du2[i].multiplyRange(s.y, start, lessThan))).multiplyRange2(s.wu, start, lessThan);
            let t3 = (this.dBasisFunctions_du[i].multiplyRange(s.y, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.yu, start, lessThan))).multiplyRange2(s.wuu, start, lessThan);
            dgx.push(t1.subtract(t2).subtract(t3));
        }
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let t1 = (this.d2BasisFunctions_du2[i].multiplyRange(s.xu, start, lessThan).subtract(this.dBasisFunctions_du[i].multiplyRange(s.xuu, start, lessThan))).multiplyRange2(s.w, start, lessThan);
            let t2 = (this.d2BasisFunctions_du2[i].multiplyRange(s.x, start, lessThan).subtract(this.basisFunctions[i].multiplyRange(s.xuu, start, lessThan))).multiplyRange2(s.wu, start, lessThan);
            let t3 = (this.basisFunctions[i].multiplyRange(s.xu, start, lessThan).subtract(this.dBasisFunctions_du[i].multiplyRange(s.x, start, lessThan))).multiplyRange2(s.wuu, start, lessThan);
            dgy.push(t1.subtract(t2).subtract(t3));
        }
        const h1 = BernsteinDecompositionR1toR1_1.determinant2by2(s.xu, s.yu, s.xuu, s.yuu);
        const h2 = BernsteinDecompositionR1toR1_1.determinant2by2(s.x, s.y, s.xuu, s.yuu);
        const h3 = BernsteinDecompositionR1toR1_1.determinant2by2(s.xu, s.yu, s.x, s.y);
        for (let i = 0; i < controlPointsLength; i += 1) {
            let start = Math.max(0, i - degree);
            let lessThan = Math.min(controlPointsLength - degree, i + 1);
            let t1 = this.basisFunctions[i].multiplyRange(h1, start, lessThan);
            let t2 = this.dBasisFunctions_du[i].multiplyRange(h2, start, lessThan);
            let t3 = this.d2BasisFunctions_du2[i].multiplyRange(h3, start, lessThan);
            dgw.push(t1.subtract(t2).subtract(t3));
        }
        const totalNumberOfConstraints = this.inflectionConstraintsSign.length;
        let result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 3 * controlPointsLength);
        for (let i = 0; i < controlPointsLength; i += 1) {
            const cpx = dgx[i].flattenControlPointsArray();
            const cpy = dgy[i].flattenControlPointsArray();
            const cpw = dgw[i].flattenControlPointsArray();
            let start = Math.max(0, i - degree) * (3 * degree - 2);
            let lessThan = Math.min(controlPointsLength - degree, i + 1) * (3 * degree - 2);
            let deltaj = 0;
            for (let inactiveConstraint of inactiveConstraints) {
                if (inactiveConstraint >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (let j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, 2 * controlPointsLength + i, cpw[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    }
    computeBasisFunctionsDerivatives() {
        const n = this._spline.controlPoints.length;
        this._numberOfIndependentVariables = n * 2;
        let diracControlPoints = MathVectorBasicOperations_1.zeroVector(n);
        this.basisFunctions = [];
        this.dBasisFunctions_du = [];
        this.d2BasisFunctions_du2 = [];
        this.d3BasisFunctions_du3 = [];
        for (let i = 0; i < n; i += 1) {
            diracControlPoints[i] = 1;
            let basisFunction = this.bSplineR1toR1Factory(diracControlPoints.slice(), this._spline.knots.slice());
            let dBasisFunction_du = basisFunction.derivative();
            let d2BasisFunction_du2 = dBasisFunction_du.derivative();
            let d3BasisFunction_du3 = d2BasisFunction_du2.derivative();
            this.basisFunctions.push(basisFunction.bernsteinDecomposition());
            this.dBasisFunctions_du.push(dBasisFunction_du.bernsteinDecomposition());
            this.d2BasisFunctions_du2.push(d2BasisFunction_du2.bernsteinDecomposition());
            this.d3BasisFunctions_du3.push(d3BasisFunction_du3.bernsteinDecomposition());
            diracControlPoints[i] = 0;
        }
    }
}
exports.OptimizationProblemRationalBSplineR1toR2 = OptimizationProblemRationalBSplineR1toR2;


/***/ }),

/***/ "./src/controllers/CurveScene3dController.ts":
/*!***************************************************!*\
  !*** ./src/controllers/CurveScene3dController.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class CurveScene3dController {
    constructor(curveModel3d) {
        this.curveModel3d = curveModel3d;
    }
    setControlPointPosition(selectedControlPoint, x, y, z) {
        this.curveModel3d.setControlPointPosition(selectedControlPoint, x, y, z);
    }
}
exports.CurveScene3dController = CurveScene3dController;


/***/ }),

/***/ "./src/controllers/CurveSceneController.ts":
/*!*************************************************!*\
  !*** ./src/controllers/CurveSceneController.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class CurveSceneController {
    constructor(curveModel) {
        this.curveModel = curveModel;
    }
    setControlPointPosition(selectedControlPoint, x, y) {
        this.curveModel.setControlPointPosition(selectedControlPoint, x, y);
    }
}
exports.CurveSceneController = CurveSceneController;


/***/ }),

/***/ "./src/linearAlgebra/CholeskyDecomposition.ts":
/*!****************************************************!*\
  !*** ./src/linearAlgebra/CholeskyDecomposition.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * A decomposition of a positive-definite matirx into a product of a lower triangular matrix and its conjugate transpose
 */
class CholeskyDecomposition {
    /**
     * The values of the decomposition are stored in the lower triangular portion of the matrix g
     * @param matrix Matrix
     */
    constructor(matrix) {
        this.success = false;
        this.CLOSE_TO_ZERO = 10e-8;
        this.firstNonPositiveDefiniteLeadingSubmatrixSize = -1;
        this.g = matrix.squareMatrix();
        const n = this.g.shape[0];
        if (this.g.get(0, 0) < this.CLOSE_TO_ZERO) {
            return;
        }
        let sqrtGjj = Math.sqrt(this.g.get(0, 0));
        for (let i = 0; i < n; i += 1) {
            this.g.divideAt(i, 0, sqrtGjj);
        }
        for (let j = 1; j < n; j += 1) {
            for (let i = j; i < n; i += 1) {
                let sum = 0;
                for (let k = 0; k < j; k += 1) {
                    sum += this.g.get(i, k) * this.g.get(j, k);
                }
                this.g.substractAt(i, j, sum);
            }
            if (this.g.get(j, j) < this.CLOSE_TO_ZERO) {
                this.firstNonPositiveDefiniteLeadingSubmatrixSize = j + 1;
                return;
            }
            sqrtGjj = Math.sqrt(this.g.get(j, j));
            for (let i = j; i < n; i += 1) {
                this.g.divideAt(i, j, sqrtGjj);
            }
        }
        for (let j = 0; j < n; j += 1) {
            for (let i = 0; i < j; i += 1) {
                this.g.set(i, j, 0);
            }
        }
        this.success = true;
    }
    /**
     * Solve the linear system
     * @param b Vector
     * @return The vector x
     * @throws If the Cholesky decomposition failed
     */
    solve(b) {
        'use strict';
        // See Numerical Recipes Third Edition p. 101
        if (!this.success) {
            throw new Error("CholeskyDecomposistion.success === false");
        }
        if (b.length !== this.g.shape[0]) {
            throw new Error("The size of the cholesky decomposed matrix g and the vector b do not match");
        }
        const n = this.g.shape[0];
        let x = b.slice();
        // Ly = b
        for (let i = 0; i < n; i += 1) {
            let sum = b[i];
            for (let k = i - 1; k >= 0; k -= 1) {
                sum -= this.g.get(i, k) * x[k];
            }
            x[i] = sum / this.g.get(i, i);
        }
        // LT x = Y
        for (let i = n - 1; i >= 0; i -= 1) {
            let sum = x[i];
            for (let k = i + 1; k < n; k += 1) {
                sum -= this.g.get(k, i) * x[k];
            }
            x[i] = sum / this.g.get(i, i);
        }
        return x;
    }
    /**
     * Solve the linear equation Lower triangular matrix LT * x = b
     * @param b Vector
     */
    solve_LT_result_equal_b(b) {
        const n = this.g.shape[0];
        let x = b.slice();
        for (let i = 0; i < n; i += 1) {
            let sum = b[i];
            for (let k = i - 1; k >= 0; k -= 1) {
                sum -= this.g.get(i, k) * x[k];
            }
            x[i] = sum / this.g.get(i, i);
        }
        return x;
    }
}
exports.CholeskyDecomposition = CholeskyDecomposition;


/***/ }),

/***/ "./src/linearAlgebra/DenseMatrix.ts":
/*!******************************************!*\
  !*** ./src/linearAlgebra/DenseMatrix.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * A dense matrix
 */
class DenseMatrix {
    /**
     * Create a square matrix
     * @param nrows Number of rows
     * @param ncols Number of columns
     * @param data A row after row flat array
     * @throws If data length is not equal to nrows*ncols
     */
    constructor(nrows, ncols, data) {
        this._shape = [nrows, ncols];
        if (data) {
            if (data.length !== this.shape[0] * this.shape[1]) {
                throw new Error("Dense matrix constructor expect the data to have nrows*ncols length");
            }
            this.data = data.slice();
        }
        else {
            this.data = [];
            for (let i = 0; i < this.shape[0] * this.shape[1]; i += 1) {
                this.data.push(0);
            }
        }
    }
    /**
     * Returns the shape of the matrix : [number of rows, number of columns]
     */
    get shape() {
        return this._shape;
    }
    /**
     * Return the corresponding index in the flat row by row data vector
     * @param row The row index
     * @param column The column index
     */
    dataIndex(row, column) {
        return row * this.shape[1] + column;
    }
    /**
     * Return the value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @return Scalar
     * @throws If an index is out of range
     */
    get(row, column) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        return this.data[this.dataIndex(row, column)];
    }
    /**
     * Set a given value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @param value The new value
     * @throws If an index is out of range
     */
    set(row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] = value;
    }
    /**
     * Check that the column index is inside appropriate range
     * @param index The column index
     * @throws If index is out of range
     */
    checkColumnRange(index) {
        if (index < 0 || index >= this.shape[1]) {
            throw new Error("DenseMatrix column index out of range");
        }
    }
    /**
     * Check that the row index is inside appropriate range
     * @param index The row index
     * @throws If index is out of range
     */
    checkRowRange(index) {
        if (index < 0 || index >= this.shape[0]) {
            throw new Error("DenseMatrix row index out of range");
        }
    }
    removeRows(rows) {
        const numberOfRows = this.shape[0] - rows.length;
        const numberOfColumns = this.shape[1];
        let result = new DenseMatrix(numberOfRows, numberOfColumns);
        let k = 0;
        let newRowIndex = 0;
        for (let i = 0; i < this.shape[0]; i += 1) {
            if (rows[k] != i) {
                for (let j = 0; j < this.shape[1]; j += 1) {
                    result.set(newRowIndex, j, this.get(i, j));
                }
                newRowIndex += 1;
            }
            else {
                k += 1;
            }
        }
        return result;
    }
}
exports.DenseMatrix = DenseMatrix;


/***/ }),

/***/ "./src/linearAlgebra/DiagonalMatrix.ts":
/*!*********************************************!*\
  !*** ./src/linearAlgebra/DiagonalMatrix.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * An identity matrix
 */
class DiagonalMatrix {
    /**
     * Create a Symmetric Matrix
     * @param size The number of rows or the number columns
     * @param data The matrix data in a flat vector
     */
    constructor(size, data) {
        this._shape = [size, size];
        if (data) {
            if (data.length !== size) {
                throw new Error("Diagonal matrix constructor expect the data to have size length");
            }
            this.data = data.slice();
        }
        else {
            this.data = [];
            const n = size;
            for (let i = 0; i < n; i += 1) {
                this.data.push(0);
            }
        }
    }
    /**
     * Returns the shape of the matrix : [number of rows, number of columns]
     */
    get shape() {
        return this._shape;
    }
    /**
 * Returns the value at a given row and column position
 * @param row The row index
 * @param column The column index
 * @return Scalar
 * @throws If an index is out of range
 */
    get(row, column) {
        this.checkRange(row, column);
        return this.data[row];
    }
    /**
     * Set a given value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @param value The new value
     * @throws If an index is out of range
     */
    set(row, column, value) {
        this.checkRange(row, column);
        this.data[row] = value;
    }
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    checkRange(row, column) {
        if (row < 0 || row >= this.shape[0] || row != column) {
            throw new Error("DiagonalMatrix index is out of range");
        }
    }
}
exports.DiagonalMatrix = DiagonalMatrix;
function identityMatrix(n) {
    let result = new DiagonalMatrix(n);
    for (let i = 0; i < n; i += 1) {
        result.set(i, i, 1);
    }
    return result;
}
exports.identityMatrix = identityMatrix;


/***/ }),

/***/ "./src/linearAlgebra/LUSolve.ts":
/*!**************************************!*\
  !*** ./src/linearAlgebra/LUSolve.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


// https://rosettacode.org/wiki/Gaussian_elimination#JavaScript
Object.defineProperty(exports, "__esModule", ({ value: true }));
// Lower Upper Solver
function lusolve(matrix, b, update = false) {
    let A = matrix.toNumberArray();
    let lu = ludcmp(A, update);
    if (lu === undefined)
        return; // Singular Matrix!
    return lubksb(lu, b, update);
}
exports.lusolve = lusolve;
// Lower Upper Decomposition
function ludcmp(A, update) {
    // A is a matrix that we want to decompose into Lower and Upper matrices.
    let d = true;
    let n = A.length;
    let idx = new Array(n); // Output vector with row permutations from partial pivoting
    let vv = new Array(n); // Scaling information
    for (let i = 0; i < n; i++) {
        let max = 0;
        for (let j = 0; j < n; j++) {
            let temp = Math.abs(A[i][j]);
            if (temp > max)
                max = temp;
        }
        if (max == 0)
            return; // Singular Matrix!
        vv[i] = 1 / max; // Scaling
    }
    if (!update) { // make a copy of A 
        let Acpy = new Array(n);
        for (let i = 0; i < n; i++) {
            let Ai = A[i];
            let Acpyi = new Array(Ai.length);
            for (let j = 0; j < Ai.length; j += 1)
                Acpyi[j] = Ai[j];
            Acpy[i] = Acpyi;
        }
        A = Acpy;
    }
    let tiny = 1e-20; // in case pivot element is zero
    for (let i = 0;; i++) {
        for (let j = 0; j < i; j++) {
            let sum = A[j][i];
            for (let k = 0; k < j; k++)
                sum -= A[j][k] * A[k][i];
            A[j][i] = sum;
        }
        let jmax = 0;
        let max = 0;
        for (let j = i; j < n; j++) {
            let sum = A[j][i];
            for (let k = 0; k < i; k++)
                sum -= A[j][k] * A[k][i];
            A[j][i] = sum;
            let temp = vv[j] * Math.abs(sum);
            if (temp >= max) {
                max = temp;
                jmax = j;
            }
        }
        if (i <= jmax) {
            for (let j = 0; j < n; j++) {
                let temp = A[jmax][j];
                A[jmax][j] = A[i][j];
                A[i][j] = temp;
            }
            d = !d;
            vv[jmax] = vv[i];
        }
        idx[i] = jmax;
        if (i == n - 1)
            break;
        let temp = A[i][i];
        if (temp == 0)
            A[i][i] = temp = tiny;
        temp = 1 / temp;
        for (let j = i + 1; j < n; j++)
            A[j][i] *= temp;
    }
    return { A: A, idx: idx, d: d };
}
// Lower Upper Back Substitution
function lubksb(lu, b, update) {
    // solves the set of n linear equations A*x = b.
    // lu is the object containing A, idx and d as determined by the routine ludcmp.
    let A = lu.A;
    let idx = lu.idx;
    let n = idx.length;
    if (!update) { // make a copy of b
        let bcpy = new Array(n);
        for (let i = 0; i < b.length; i += 1)
            bcpy[i] = b[i];
        b = bcpy;
    }
    for (let ii = -1, i = 0; i < n; i++) {
        let ix = idx[i];
        let sum = b[ix];
        b[ix] = b[i];
        if (ii > -1)
            for (let j = ii; j < i; j++)
                sum -= A[i][j] * b[j];
        else if (sum)
            ii = i;
        b[i] = sum;
    }
    for (let i = n - 1; i >= 0; i--) {
        let sum = b[i];
        for (let j = i + 1; j < n; j++)
            sum -= A[i][j] * b[j];
        b[i] = sum / A[i][i];
    }
    return b; // solution vector x
}


/***/ }),

/***/ "./src/linearAlgebra/MathVectorBasicOperations.ts":
/*!********************************************************!*\
  !*** ./src/linearAlgebra/MathVectorBasicOperations.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const SquareMatrix_1 = __webpack_require__(/*! ./SquareMatrix */ "./src/linearAlgebra/SquareMatrix.ts");
const DenseMatrix_1 = __webpack_require__(/*! ./DenseMatrix */ "./src/linearAlgebra/DenseMatrix.ts");
/**
 * Multiply a vector by a scalar
 * @param vector vector
 * @param value scalar
 */
function multiplyVectorByScalar(vector, value) {
    let result = [];
    for (let vi of vector) {
        result.push(vi * value);
    }
    return result;
}
exports.multiplyVectorByScalar = multiplyVectorByScalar;
/**
 * Divide a vector by a scalar
 * @param vector Vector
 * @param value Scalar
 * @throws If the scalar value is zero
 */
function divideVectorByScalar(vector, value) {
    if (value === 0) {
        throw new Error("Division by zero");
    }
    let result = [];
    for (let vi of vector) {
        result.push(vi / value);
    }
    return result;
}
exports.divideVectorByScalar = divideVectorByScalar;
/**
 * A standard function in basic linear algebra : y = ax + y
 * @param a Scalar
 * @param x Vector
 * @param y Vector
 * @throws If x and y have different length
 */
function saxpy(a, x, y) {
    if (x.length !== y.length) {
        throw new Error("Adding two vectors of different length");
    }
    for (let i = 0; i < x.length; i += 1) {
        y[i] += a * x[i];
    }
}
exports.saxpy = saxpy;
/**
 * A standard function in basic linear algebra : z = ax + y
 * @param a Scalar
 * @param x Vector
 * @param y Vector
 * @returns ax + y
 * @throws If x and y have different length
 */
function saxpy2(a, x, y) {
    if (x.length !== y.length) {
        throw new Error("Adding two vectors of different length");
    }
    let result = [];
    for (let i = 0; i < x.length; i += 1) {
        result.push(a * x[i] + y[i]);
    }
    return result;
}
exports.saxpy2 = saxpy2;
/**
 * Compute the dot product of two vectors
 * @param x Vector
 * @param y Vector
 * @return The scalar result
 * @throws If x and y have different length
 */
function dotProduct(x, y) {
    if (x.length !== y.length) {
        throw new Error("Making the dot product of two vectors of different length");
    }
    let result = 0;
    for (let i = 0; i < x.length; i += 1) {
        result += x[i] * y[i];
    }
    return result;
}
exports.dotProduct = dotProduct;
/**
 * Add two vectors
 * @param x Vector
 * @param y Vector
 * @return Vector
 * @throws If x and y have different length
 */
function addTwoVectors(x, y) {
    if (x.length !== y.length) {
        throw new Error("Adding two vectors of different length");
    }
    let result = [];
    for (let i = 0; i < x.length; i += 1) {
        result.push(x[i] + y[i]);
    }
    return result;
}
exports.addTwoVectors = addTwoVectors;
/**
 * Add the second vector to the first vector
 * @param x Vector
 * @param y Vector
 * @throws If x and y have different length
 */
function addSecondVectorToFirst(x, y) {
    if (x.length !== y.length) {
        throw new Error("Adding two vectors of different length");
    }
    for (let i = 0; i < x.length; i += 1) {
        x[i] += y[i];
    }
}
exports.addSecondVectorToFirst = addSecondVectorToFirst;
/**
 * Compute the square of the norm
 * @param v Vector
 * @return Non negative scalar
 */
function squaredNorm(vector) {
    let result = 0;
    for (let vi of vector) {
        result += vi * vi;
    }
    return result;
}
exports.squaredNorm = squaredNorm;
/**
 * Compute the norm
 * @param v Vector
 * @return Non negative scalar
 */
function norm(v) {
    return Math.sqrt(squaredNorm(v));
}
exports.norm = norm;
/**
 * Compute the norm p = 1
 * @param v Vector
 * @return Non negative scalar
 */
function norm1(vector) {
    let result = 0;
    for (let vi of vector) {
        result += Math.abs(vi);
    }
    return result;
}
exports.norm1 = norm1;
/**
 * Create a zero vector of size n
 * @param n Size
 */
function zeroVector(n) {
    let result = [];
    for (let i = 0; i < n; i += 1) {
        result.push(0);
    }
    return result;
}
exports.zeroVector = zeroVector;
/**
 * Compute the product of a vector and its transpose
 * @param v Vector
 */
function product_v_vt(v) {
    const n = v.length;
    let result = new SquareMatrix_1.SquareMatrix(n);
    for (let i = 0; i < n; i += 1) {
        for (let j = 0; j < n; j += 1) {
            result.set(i, j, v[i] * v[j]);
        }
    }
    return result;
}
exports.product_v_vt = product_v_vt;
/**
 * Compute the product of a first vector with the transpose of a second vector
 * @param v1 The first vector taken as a column vector
 * @param v2 The second vector taken after transposition as a row vector
 */
function product_v1_v2t(v1, v2) {
    const m = v1.length;
    const n = v2.length;
    let result = new DenseMatrix_1.DenseMatrix(m, n);
    for (let i = 0; i < m; i += 1) {
        for (let j = 0; j < n; j += 1) {
            result.set(i, j, v1[i] * v2[j]);
        }
    }
    return result;
}
exports.product_v1_v2t = product_v1_v2t;
function isZeroVector(vector) {
    for (let vi of vector) {
        if (vi !== 0) {
            return false;
        }
    }
    return true;
}
exports.isZeroVector = isZeroVector;
/**
 * Returns a vector filled with random values between 0 and 1
 * @param n The size of the random vector
 */
function randomVector(n) {
    let result = [];
    for (let i = 0; i < n; i += 1) {
        result.push((Math.random() - 0.5) * 10e8);
        //result.push((Math.random())*10e8)
    }
    return result;
}
exports.randomVector = randomVector;
function containsNaN(vector) {
    for (let vi of vector) {
        if (isNaN(vi)) {
            return true;
        }
    }
    return false;
}
exports.containsNaN = containsNaN;
/**
 * Return the sign of a number.
 * It returns 1 if the number is positive, -1 if the number is negative and 0 if it is zero or minus zero
 * The standard Math.sign() function doesn't work with Windows Internet Explorer
 * @param x Number
 */
function sign(x) {
    if (x == 0)
        return 0;
    else
        return x < 0 ? -1 : 1;
}
exports.sign = sign;
function removeElements(array, indices) {
    let result = array.slice();
    for (let i = indices.length - 1; i >= 0; i--) {
        result.splice(indices[i], 1);
    }
    return result;
}
exports.removeElements = removeElements;


/***/ }),

/***/ "./src/linearAlgebra/SquareMatrix.ts":
/*!*******************************************!*\
  !*** ./src/linearAlgebra/SquareMatrix.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * A square matrix
 */
class SquareMatrix {
    /**
     * Create a square matrix
     * @param size Number of row and column
     * @param data A row after row flat array
     * @throws If data length is not equal to size*size
     */
    constructor(size, data) {
        this._shape = [size, size];
        if (data) {
            if (data.length !== size * size) {
                throw new Error("Square matrix constructor expect the data to have size*size length");
            }
            this.data = data.slice();
        }
        else {
            this.data = [];
            for (let i = 0; i < this.shape[0] * this.shape[1]; i += 1) {
                this.data.push(0);
            }
        }
    }
    /**
     * Returns the shape of the matrix : [number of rows, number of columns]
     */
    get shape() {
        return this._shape;
    }
    /**
     * Return the corresponding index in the flat row by row data vector
     * @param row The row index
     * @param column The column index
     */
    dataIndex(row, column) {
        let n = row * this._shape[1] + column;
        return n;
    }
    /**
     * Return the value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @return Scalar
     * @throws If an index is out of range
     */
    get(row, column) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        return this.data[this.dataIndex(row, column)];
    }
    /**
     * Set a given value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @param value The new value
     * @throws If an index is out of range
     */
    set(row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] = value;
    }
    /**
     * Change the value of the matrix at a given row and column position by this value divided by the divisor value
     * @param row The row index
     * @param column The column index
     * @param divisor The divisor value
     * @throws If an index is out of range
     */
    divideAt(row, column, divisor) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] /= divisor;
    }
    /**
     * Change the value of the matrix at a given row and column position by this value substracted by the subtrahend value
     * @param row The row index
     * @param column The column index
     * @param divisor The divisor value
     * @throws If an index is out of range
     */
    substractAt(row, column, subtrahend) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] -= subtrahend;
    }
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    checkRowRange(index) {
        if (index < 0 || index >= this.shape[0]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    }
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    checkColumnRange(index) {
        if (index < 0 || index >= this.shape[1]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    }
    /**
     * Multiply two matrices
     * @param that A square or a symmetric matrix
     * @return a square matrix
     */
    multiplyByMatrix(that) {
        if (this.shape[1] !== that.shape[0]) {
            throw new Error("Size mismatch in matrix multiplication");
        }
        let result = new SquareMatrix(this.shape[1]);
        for (let i = 0; i < this.shape[0]; i += 1) {
            for (let j = 0; j < this.shape[0]; j += 1) {
                let temp = 0;
                for (let k = 0; k < this.shape[0]; k += 1) {
                    temp += this.get(i, k) * that.get(k, j);
                }
                result.set(i, j, temp);
            }
        }
        return result;
    }
    multiplyByVector(v) {
        if (this.shape[1] !== v.length) {
            throw new Error("SquareMatrix multiply a vector of incorrect length");
        }
        let result = [];
        const n = this.shape[1];
        for (let i = 0; i < n; i += 1) {
            let temp = 0;
            for (let j = 0; j < n; j += 1) {
                temp += this.get(i, j) * v[j];
            }
            result.push(temp);
        }
        return result;
    }
    /**
     * Add two matrices
     * @param that A square or a symmetric matrix
     * @return a square matrix
     */
    addByMatrix(that) {
        if (this.shape[1] !== that.shape[0]) {
            throw new Error("Size mismatch in matrix addition");
        }
        let result = new SquareMatrix(this.shape[1]);
        for (let i = 0; i < this.shape[0]; i += 1) {
            for (let j = 0; j < this.shape[0]; j += 1) {
                result.set(i, j, this.get(i, j) + that.get(i, j));
            }
        }
        return result;
    }
    /**
     * Add two matrices
     * @param that A square or a symmetric matrix
     * @return a square matrix
     */
    mutiplyByConstant(value) {
        let result = new SquareMatrix(this.shape[1]);
        for (let i = 0; i < this.shape[0]; i += 1) {
            for (let j = 0; j < this.shape[0]; j += 1) {
                result.set(i, j, this.get(i, j) * value);
            }
        }
        return result;
    }
    toNumberArray() {
        let result = [];
        for (let i = 0; i < this.shape[0]; i += 1) {
            result.push([]);
            for (let j = 0; j < this.shape[1]; j += 1) {
                result[i].push(this.get(i, j));
            }
        }
        return result;
    }
}
exports.SquareMatrix = SquareMatrix;


/***/ }),

/***/ "./src/linearAlgebra/SymmetricMatrix.ts":
/*!**********************************************!*\
  !*** ./src/linearAlgebra/SymmetricMatrix.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const SquareMatrix_1 = __webpack_require__(/*! ./SquareMatrix */ "./src/linearAlgebra/SquareMatrix.ts");
const DiagonalMatrix_1 = __webpack_require__(/*! ./DiagonalMatrix */ "./src/linearAlgebra/DiagonalMatrix.ts");
const MathVectorBasicOperations_1 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/linearAlgebra/MathVectorBasicOperations.ts");
/**
 * A symmetric matrix
 */
class SymmetricMatrix {
    /**
     * Create a Symmetric Matrix
     * @param size The number of rows or the number columns
     * @param data The matrix data in a flat vector
     */
    constructor(size, data) {
        this._shape = [size, size];
        if (data) {
            if (data.length !== size * (size + 1) / 2) {
                throw new Error("Square matrix constructor expect the data to have (size * (size + 1) / 2) length");
            }
            this.data = data.slice();
        }
        else {
            this.data = [];
            const n = (size * (size + 1)) / 2;
            for (let i = 0; i < n; i += 1) {
                this.data.push(0);
            }
        }
    }
    /**
    * Returns the shape of the matrix : [number of rows, number of columns]
    */
    get shape() {
        return this._shape;
    }
    /**
     * Returns the corresponding index in the flat data vector.
     * In this flat data vector the upper triangular matrix is store row-wise.
     * @param row The row index
     * @param column The column index
     */
    dataIndex(row, column) {
        if (row <= column) {
            return row * this.shape[1] - (row - 1) * row / 2 + column - row;
        }
        return column * this.shape[0] - (column - 1) * column / 2 + row - column;
    }
    /**
     * Returns the value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @return Scalar
     * @throws If an index is out of range
     */
    get(row, column) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        return this.data[this.dataIndex(row, column)];
    }
    /**
     * Set a given value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @param value The new value
     * @throws If an index is out of range
     */
    set(row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] = value;
    }
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    checkRowRange(index) {
        if (index < 0 || index >= this.shape[0]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    }
    /**
 * Check that the index is inside appropriate range
 * @param index The column or the row index
 * @throws If an index is out of range
 */
    checkColumnRange(index) {
        if (index < 0 || index >= this.shape[1]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    }
    /**
     * Compute the product v^t M v
     * @param v Vector
     * @return Scalar
     */
    quadraticForm(v) {
        let result = 0;
        for (let i = 1; i < this.shape[1]; i += 1) {
            for (let j = 0; j < i; j += 1) {
                result += this.get(i, j) * v[i] * v[j];
            }
        }
        result *= 2;
        for (let i = 0; i < this.shape[1]; i += 1) {
            result += this.get(i, i) * Math.pow(v[i], 2);
        }
        return result;
    }
    /**
     * Return a safe copy of this matrix
     * */
    clone() {
        return new SymmetricMatrix(this.shape[0], this.data);
    }
    /**
     * Increases the given element of the matrix by the value
     * @param row The row index
     * @param column The column index
     * @param value The number to be added
     * @throws If an index is out of range
     */
    addAt(row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(row);
        this.data[this.dataIndex(row, column)] += value;
    }
    /**
     * Increases every diagonal element of the matrix by the value
     * @param value The number to be added
     */
    addValueOnDiagonalInPlace(value) {
        const m = this.shape[0];
        for (let i = 0; i < m; i += 1) {
            this.data[this.dataIndex(i, i)] += value;
        }
    }
    /**
     * Returns the new matrix: this.matrix + value * I
     * @param value
     * @returns SymmetricMatrix
     */
    addValueOnDiagonal(value) {
        let result = this.clone();
        result.addValueOnDiagonalInPlace(value);
        return result;
    }
    /**
     * Returns a SquareMatrix with the values of this matrix
     */
    squareMatrix() {
        const n = this.shape[0];
        let result = new SquareMatrix_1.SquareMatrix(n);
        for (let i = 0; i < n; i += 1) {
            for (let j = 0; j < n; j += 1) {
                result.set(i, j, this.get(i, j));
            }
        }
        return result;
    }
    plusSymmetricMatrixMultipliedByValue(matrix, value) {
        if (this.shape[0] !== matrix.shape[0]) {
            throw new Error("Adding two symmetric matrix with different shapes");
        }
        let result = this.clone();
        const n = result.shape[0];
        if (matrix instanceof DiagonalMatrix_1.DiagonalMatrix) {
            for (let i = 0; i < n; i += 1) {
                result.addAt(i, i, matrix.get(i, i) * value);
            }
            return result;
        }
        else {
            for (let i = 0; i < n; i += 1) {
                for (let j = 0; j <= i; j += 1) {
                    result.addAt(i, j, matrix.get(i, j) * value);
                }
            }
            return result;
        }
    }
    multiplyByVector(v) {
        if (this.shape[1] !== v.length) {
            throw new Error("SymmetricMatrix multiply a vector of incorrect length");
        }
        let result = [];
        const n = this.shape[1];
        for (let i = 0; i < n; i += 1) {
            let temp = 0;
            for (let j = 0; j < n; j += 1) {
                temp += this.get(i, j) * v[j];
            }
            result.push(temp);
        }
        return result;
    }
    containsNaN() {
        return MathVectorBasicOperations_1.containsNaN(this.data);
    }
    getData() {
        return this.data;
    }
}
exports.SymmetricMatrix = SymmetricMatrix;


/***/ }),

/***/ "./src/mathVector/RotationMatrix.ts":
/*!******************************************!*\
  !*** ./src/mathVector/RotationMatrix.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const SquareMatrix_1 = __webpack_require__(/*! ../linearAlgebra/SquareMatrix */ "./src/linearAlgebra/SquareMatrix.ts");
function rotationMatrixFromTwoVectors(unitVector1, unitVector2, tolerance = 10e-5) {
    // https://math.stackexchange.com/questions/180418/calculate-rotation-matrix-to-align-vector-a-to-vector-b-in-3d
    let p = unitVector1.crossPoduct(unitVector2);
    let i = new SquareMatrix_1.SquareMatrix(3, [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    let v = new SquareMatrix_1.SquareMatrix(3, [0, -p.z, p.y, p.z, 0, -p.x, -p.y, p.x, 0]);
    let c = unitVector1.dot(unitVector2);
    if (1 + c < tolerance) {
        throw new Error("The two given vectors points in opposite directions, the rotation matrix is indeterminate");
    }
    return i.addByMatrix(v).addByMatrix(v.multiplyByMatrix(v).mutiplyByConstant(1 / (1 + c)));
}
exports.rotationMatrixFromTwoVectors = rotationMatrixFromTwoVectors;


/***/ }),

/***/ "./src/mathVector/Vector2d.ts":
/*!************************************!*\
  !*** ./src/mathVector/Vector2d.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * A two dimensional vector
 */
class Vector2d {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    negative() {
        return new Vector2d(-this.x, -this.y);
    }
    add(v) {
        return new Vector2d(this.x + v.x, this.y + v.y);
    }
    multiply(value) {
        return new Vector2d(this.x * value, this.y * value);
    }
    substract(v) {
        return new Vector2d(this.x - v.x, this.y - v.y);
    }
    rotate90degrees() {
        return new Vector2d(-this.y, this.x);
    }
    normalize() {
        let norm = Math.sqrt(this.x * this.x + this.y * this.y);
        let x = this.x / norm;
        let y = this.y / norm;
        return new Vector2d(x, y);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    distance(v) {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    }
    norm() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    clone() {
        return new Vector2d(this.x, this.y);
    }
}
exports.Vector2d = Vector2d;
function scale(factor, v) {
    let result = [];
    v.forEach(element => {
        result.push(element.multiply(factor));
    });
    return result;
}
exports.scale = scale;
function scaleX(factor, v) {
    let result = [];
    v.forEach(element => {
        v.push(new Vector2d(element.x * factor, element.y));
    });
    return result;
}
exports.scaleX = scaleX;
function scaleY(factor, v) {
    let result = [];
    v.forEach(element => {
        v.push(new Vector2d(element.x, element.y * factor));
    });
    return result;
}
exports.scaleY = scaleY;


/***/ }),

/***/ "./src/mathVector/Vector3d.ts":
/*!************************************!*\
  !*** ./src/mathVector/Vector3d.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * A three dimensional vector
 */
class Vector3d {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    negative() {
        return new Vector3d(-this.x, -this.y, -this.z);
    }
    add(v) {
        return new Vector3d(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    multiply(value) {
        return new Vector3d(this.x * value, this.y * value, this.z * value);
    }
    substract(v) {
        return new Vector3d(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    normalize() {
        let norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        let x = this.x / norm;
        let y = this.y / norm;
        let z = this.z / norm;
        return new Vector3d(x, y, z);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    distance(v) {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2) + Math.pow(this.z - v.z, 2));
    }
    norm() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }
    clone() {
        return new Vector3d(this.x, this.y, this.z);
    }
    crossPoduct(v) {
        return new Vector3d(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    axisAngleRotation(axis, angle) {
        //https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
        const k = axis.normalize();
        const firstTerm = this.multiply(Math.cos(angle));
        const secondTerm = k.crossPoduct(this).multiply(Math.sin(angle));
        const thirdTerm = k.multiply(k.dot(this)).multiply(1 - Math.cos(angle));
        return firstTerm.add(secondTerm).add(thirdTerm);
    }
}
exports.Vector3d = Vector3d;
/**
* @param p0 point
* @param p1 first point of the line
* @param p2 second point of the line
*/
function pointLineDistance(p0, p1, p2) {
    // https://mathworld.wolfram.com/Point-LineDistance3-Dimensional.html
    return ((p0.substract(p1)).crossPoduct(p0.substract(p2))).norm() / p2.substract(p1).norm();
}
exports.pointLineDistance = pointLineDistance;
function linePlaneIntersection(lineP1, lineP2, lookAtOrigin, cameraPosition, objectCenter) {
    //https://en.wikipedia.org/wiki/Line–plane_intersection
    const l = lineP2.substract(lineP1);
    const n = lookAtOrigin.substract(cameraPosition);
    const nn = n.normalize();
    const a = nn.dot(objectCenter.substract(cameraPosition));
    const p0 = nn.multiply(a).add(cameraPosition);
    const d = (p0.substract(lineP1)).dot(n) / (l.dot(n));
    return lineP1.add(l.multiply(d));
}
exports.linePlaneIntersection = linePlaneIntersection;


/***/ }),

/***/ "./src/models/AbstractCurveModel.ts":
/*!******************************************!*\
  !*** ./src/models/AbstractCurveModel.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
const AbstractOptimizationProblemBSplineR1toR2_1 = __webpack_require__(/*! ../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2.ts");
const RationalBSplineR1toR2Adapter_1 = __webpack_require__(/*! ../bsplines/RationalBSplineR1toR2Adapter */ "./src/bsplines/RationalBSplineR1toR2Adapter.ts");
class AbstractCurveModel {
    constructor() {
        this.observers = [];
        this.observersCP = [];
        this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both;
        this.activeOptimizer = true;
        this.optimizationProblem = null;
        this.optimizer = null;
    }
    registerObserver(observer, kind) {
        switch (kind) {
            case 'curve':
                this.observers.push(observer);
                break;
            case 'control points':
                this.observersCP.push(observer);
                break;
            default:
                throw Error("unknown kind");
        }
    }
    removeObserver(observer, kind) {
        switch (kind) {
            case 'curve':
                this.observers.splice(this.observers.indexOf(observer), 1);
                break;
            case 'control points':
                this.observersCP.splice(this.observersCP.indexOf(observer), 1);
                break;
        }
    }
    notifyObservers() {
        for (let observer of this.observers) {
            observer.update(this._spline.clone());
        }
        for (let observer of this.observersCP) {
            observer.update(this._spline.clone());
        }
    }
    setControlPointPosition(controlPointIndex, x, y) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector2d_1.Vector2d(x, y));
        this.notifyObservers();
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y);
        }
    }
    setControlPointWeight(controlPointIndex, w) {
        if (this._spline instanceof RationalBSplineR1toR2Adapter_1.RationalBSplineR1toR2Adapter) {
            this._spline.setControlPointWeight(controlPointIndex, w);
            this.notifyObservers();
            /*
            if (this.activeOptimizer) {
                this.optimize(controlPointIndex, x, y)
            }
            */
        }
    }
    increaseControlPointWeight(controlPointIndex) {
        if (this._spline instanceof RationalBSplineR1toR2Adapter_1.RationalBSplineR1toR2Adapter) {
            const delta = 1.1;
            const w = this._spline.getControlPointWeight(controlPointIndex);
            this._spline.setControlPointWeight(controlPointIndex, w * delta);
            this.notifyObservers();
            /*
            if (this.activeOptimizer) {
                this.optimize(controlPointIndex, x, y)
            }
            */
        }
    }
    decreaseControlPointWeight(controlPointIndex) {
        if (this._spline instanceof RationalBSplineR1toR2Adapter_1.RationalBSplineR1toR2Adapter) {
            const delta = 0.9;
            const w = this._spline.getControlPointWeight(controlPointIndex);
            this._spline.setControlPointWeight(controlPointIndex, w * delta);
            this.notifyObservers();
            /*
            if (this.activeOptimizer) {
                this.optimize(controlPointIndex, x, y)
            }
            */
        }
    }
    optimize(selectedControlPoint, ndcX, ndcY) {
        if (this.optimizationProblem && this.optimizer) {
            //const p = this._spline.freeControlPoints[selectedControlPoint].clone()
            const p = this.optimizationProblem.spline.freeControlPoints[selectedControlPoint].clone();
            const distance = Math.sqrt(Math.pow(ndcX - p.x, 2) + Math.pow(ndcY - p.y, 2));
            //console.log(ndcX - p.x)
            const numberOfStep = 3 * Math.ceil(distance * 10);
            //const numberOfStep = 1
            for (let i = 1; i <= numberOfStep; i += 1) {
                let alpha = Math.pow(i / numberOfStep, 3);
                this._spline.setControlPointPosition(selectedControlPoint, new Vector2d_1.Vector2d((1 - alpha) * p.x + alpha * ndcX, (1 - alpha) * p.y + alpha * ndcY));
                this.optimizationProblem.setTargetSpline(this._spline);
                try {
                    this.optimizer.optimize_using_trust_region(10e-6, 1000, 800);
                    if (this.optimizer.success === true) {
                        this.setSpline(this.optimizationProblem.spline.clone());
                    }
                }
                catch (e) {
                    this._spline.setControlPointPosition(selectedControlPoint, new Vector2d_1.Vector2d(p.x, p.y));
                    console.log(e);
                }
            }
        }
    }
    toggleActiveControlOfCurvatureExtrema() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true;
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
            this.activeOptimizer = false;
        }
        if (this.activeOptimizer) {
            this.setActiveControl();
        }
    }
    toggleActiveControlOfInflections() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true;
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections) {
            this.activeOptimizer = false;
        }
        if (this.activeOptimizer) {
            this.setActiveControl();
        }
    }
}
exports.AbstractCurveModel = AbstractCurveModel;


/***/ }),

/***/ "./src/models/AbstractNurbsModel.ts":
/*!******************************************!*\
  !*** ./src/models/AbstractNurbsModel.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractOptimizationProblemBSplineR1toR2_1 = __webpack_require__(/*! ../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2.ts");
const RationalBSplineR1toR2_1 = __webpack_require__(/*! ../bsplines/RationalBSplineR1toR2 */ "./src/bsplines/RationalBSplineR1toR2.ts");
const Vector3d_1 = __webpack_require__(/*! ../mathVector/Vector3d */ "./src/mathVector/Vector3d.ts");
class AbstractNurbsModel {
    constructor() {
        this.observers = [];
        this.observersCP = [];
        this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both;
        this.activeOptimizer = true;
        this.optimizationProblem = null;
        this.optimizer = null;
    }
    registerObserver(observer, kind) {
        switch (kind) {
            case 'curve':
                this.observers.push(observer);
                break;
            case 'control points':
                this.observersCP.push(observer);
                break;
            default:
                throw Error("unknown kind");
        }
    }
    removeObserver(observer, kind) {
        switch (kind) {
            case 'curve':
                this.observers.splice(this.observers.indexOf(observer), 1);
                break;
            case 'control points':
                this.observersCP.splice(this.observersCP.indexOf(observer), 1);
                break;
        }
    }
    notifyObservers() {
        for (let observer of this.observers) {
            observer.update(this._spline.getSplineAdapter());
        }
        for (let observer of this.observersCP) {
            observer.update(this._spline.getSplineAdapter());
        }
    }
    setControlPointPosition(controlPointIndex, x, y, z) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector3d_1.Vector3d(x, y, z));
        this.notifyObservers();
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y);
        }
    }
    setControlPointPositionXY(controlPointIndex, x, y) {
        const cp = this._spline.controlPoints[controlPointIndex];
        this._spline.setControlPointPosition(controlPointIndex, new Vector3d_1.Vector3d(x * cp.z, y * cp.z, cp.z));
        this.notifyObservers();
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y);
        }
    }
    setControlPointWeight(controlPointIndex, w) {
        /*
            const p = this._spline.controlPoints[controlPointIndex]
            this._spline.setControlPointPosition(controlPointIndex, new Vector3d(p.x, p.y, w))

            this.notifyObservers()
            if (this.activeOptimizer) {
                this.optimize(controlPointIndex, p.x, p.y, w)
            }
            */
    }
    increaseControlPointWeight(controlPointIndex) {
        if (this._spline instanceof RationalBSplineR1toR2_1.RationalBSplineR1toR2) {
            const delta = 1.1;
            const w = this._spline.getControlPointWeight(controlPointIndex);
            const newW = w * delta;
            this._spline.setControlPointWeight(controlPointIndex, newW);
            this.notifyObservers();
            if (this.activeOptimizer) {
                this.optimizeWeight(controlPointIndex, newW);
            }
        }
    }
    decreaseControlPointWeight(controlPointIndex) {
        if (this._spline instanceof RationalBSplineR1toR2_1.RationalBSplineR1toR2) {
            const delta = 0.9;
            const w = this._spline.getControlPointWeight(controlPointIndex);
            const newW = w * delta;
            this._spline.setControlPointWeight(controlPointIndex, newW);
            this.notifyObservers();
            if (this.activeOptimizer) {
                this.optimizeWeight(controlPointIndex, newW);
            }
        }
    }
    optimize(selectedControlPoint, ndcX, ndcY) {
        if (this.optimizationProblem && this.optimizer) {
            //const p = this._spline.freeControlPoints[selectedControlPoint].clone()
            const p = this.optimizationProblem.spline.freeControlPoints[selectedControlPoint].clone();
            const distance = Math.sqrt(Math.pow(ndcX - p.x, 2) + Math.pow(ndcY - p.y, 2));
            //console.log(ndcX - p.x)
            //const numberOfStep = 3 * Math.ceil(distance * 10)
            const numberOfStep = 1;
            //const numberOfStep = 1
            for (let i = 1; i <= numberOfStep; i += 1) {
                let alpha = Math.pow(i / numberOfStep, 3);
                //this._spline.setControlPointPosition(selectedControlPoint, new Vector3d((1-alpha)*p.x + alpha * ndcX, (1-alpha)*p.y + alpha * ndcY, (1-alpha)*p.z + alpha * ndcY ))
                this._spline.setControlPointPosition(selectedControlPoint, new Vector3d_1.Vector3d(ndcX * p.z, ndcY * p.z, p.z));
                this.optimizationProblem.setTargetSpline(this._spline);
                try {
                    this.optimizer.optimize_using_trust_region(10e-6, 1000, 800);
                    if (this.optimizer.success === true) {
                        this.setSpline(this.optimizationProblem.spline.clone());
                    }
                }
                catch (e) {
                    this._spline.setControlPointPosition(selectedControlPoint, new Vector3d_1.Vector3d(p.x, p.y, p.z));
                    console.log(e);
                }
            }
        }
    }
    optimizeWeight(selectedControlPoint, w) {
        if (this.optimizationProblem && this.optimizer) {
            //const p = this._spline.freeControlPoints[selectedControlPoint].clone()
            const p = this.optimizationProblem.spline.freeControlPoints[selectedControlPoint].clone();
            //const distance = Math.sqrt(Math.pow(ndcX - p.x, 2) + Math.pow(ndcY - p.y, 2))
            //console.log(ndcX - p.x)
            //const numberOfStep = 3 * Math.ceil(distance * 10)
            const numberOfStep = 1;
            //const numberOfStep = 1
            for (let i = 1; i <= numberOfStep; i += 1) {
                let alpha = Math.pow(i / numberOfStep, 3);
                //this._spline.setControlPointPosition(selectedControlPoint, new Vector3d((1-alpha)*p.x + alpha * ndcX, (1-alpha)*p.y + alpha * ndcY, (1-alpha)*p.z + alpha * ndcY ))
                this._spline.setControlPointPosition(selectedControlPoint, new Vector3d_1.Vector3d(p.x * w / p.z, p.y * w / p.z, w));
                this.optimizationProblem.setTargetSpline(this._spline);
                try {
                    this.optimizer.optimize_using_trust_region(10e-6, 1000, 800);
                    if (this.optimizer.success === true) {
                        this.setSpline(this.optimizationProblem.spline.clone());
                    }
                }
                catch (e) {
                    this._spline.setControlPointPosition(selectedControlPoint, new Vector3d_1.Vector3d(p.x, p.y, p.z));
                    console.log(e);
                }
            }
        }
    }
    toggleActiveControlOfCurvatureExtrema() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true;
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
            this.activeOptimizer = false;
        }
        if (this.activeOptimizer) {
            this.setActiveControl();
        }
    }
    toggleActiveControlOfInflections() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true;
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections) {
            this.activeOptimizer = false;
        }
        if (this.activeOptimizer) {
            this.setActiveControl();
        }
    }
}
exports.AbstractNurbsModel = AbstractNurbsModel;


/***/ }),

/***/ "./src/models/ClosedCurveModel.ts":
/*!****************************************!*\
  !*** ./src/models/ClosedCurveModel.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const PeriodicBSplineR1toR2_1 = __webpack_require__(/*! ../bsplines/PeriodicBSplineR1toR2 */ "./src/bsplines/PeriodicBSplineR1toR2.ts");
const OptimizationProblemPeriodicBSplineR1toR2_1 = __webpack_require__(/*! ../bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2.ts");
const Optimizer_1 = __webpack_require__(/*! ../optimizers/Optimizer */ "./src/optimizers/Optimizer.ts");
const AbstractCurveModel_1 = __webpack_require__(/*! ./AbstractCurveModel */ "./src/models/AbstractCurveModel.ts");
class ClosedCurveModel extends AbstractCurveModel_1.AbstractCurveModel {
    constructor() {
        super();
        const px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3;
        const py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72;
        const cp = [[-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4],
            [px0, py5], [px1, py4], [px2, py2], [px3, py0],
            [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4],
            [-px2, -py2], [-px3, py0], [-px2, py2]];
        let cp1 = [];
        for (let cpi of cp) {
            cp1.push([cpi[1], -cpi[0]]);
        }
        const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        this._spline = PeriodicBSplineR1toR2_1.create_PeriodicBSplineR1toR2(cp1, knots);
        this.optimizationProblem = new OptimizationProblemPeriodicBSplineR1toR2_1.OptimizationProblemPeriodicBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
    }
    get isClosed() {
        return true;
    }
    get spline() {
        return this._spline.clone();
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
            if (cp === this._spline.freeControlPoints.length - 1) {
                cp -= 1;
            }
            const grevilleAbscissae = this._spline.grevilleAbscissae();
            let meanGA = (grevilleAbscissae[cp] + grevilleAbscissae[cp + 1]) / 2;
            if (meanGA < this._spline.knots[this._spline.degree]) {
                let index = this._spline.degree;
                meanGA = (this._spline.knots[index] + this._spline.knots[index + 1]) / 2;
            }
            else if (meanGA > this._spline.knots[this._spline.knots.length - this._spline.degree - 1]) {
                let index = this._spline.knots.length - this._spline.degree - 1;
                meanGA = (this._spline.knots[index] + this._spline.knots[index - 1]) / 2;
            }
            this._spline.insertKnot(meanGA);
        }
        this.optimizationProblem = new OptimizationProblemPeriodicBSplineR1toR2_1.OptimizationProblemPeriodicBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
        this.notifyObservers();
    }
    setActiveControl() {
        this.optimizationProblem = new OptimizationProblemPeriodicBSplineR1toR2_1.OptimizationProblemPeriodicBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
        this.notifyObservers();
    }
}
exports.ClosedCurveModel = ClosedCurveModel;


/***/ }),

/***/ "./src/models/ClosedCurveModelAlternative01.ts":
/*!*****************************************************!*\
  !*** ./src/models/ClosedCurveModelAlternative01.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
const Optimizer_1 = __webpack_require__(/*! ../optimizers/Optimizer */ "./src/optimizers/Optimizer.ts");
const AbstractOptimizationProblemBSplineR1toR2_1 = __webpack_require__(/*! ../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2.ts");
const AbstractCurveModel_1 = __webpack_require__(/*! ./AbstractCurveModel */ "./src/models/AbstractCurveModel.ts");
const PeriodicBSplineR1toR2_1 = __webpack_require__(/*! ../bsplines/PeriodicBSplineR1toR2 */ "./src/bsplines/PeriodicBSplineR1toR2.ts");
const OptimizationProblemPeriodicBSplineR1toR2QuasiNewton_1 = __webpack_require__(/*! ../bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2QuasiNewton */ "./src/bsplinesOptimizationProblems/OptimizationProblemPeriodicBSplineR1toR2QuasiNewton.ts");
class ClosedCurveModelAlternative01 extends AbstractCurveModel_1.AbstractCurveModel {
    constructor() {
        super();
        const px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3;
        const py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72;
        const cp = [[-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4],
            [px0, py5], [px1, py4], [px2, py2], [px3, py0],
            [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4],
            [-px2, -py2], [-px3, py0], [-px2, py2]];
        let cp1 = [];
        for (let cpi of cp) {
            cp1.push([cpi[1], -cpi[0]]);
        }
        const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        this._splineTarget = PeriodicBSplineR1toR2_1.create_PeriodicBSplineR1toR2(cp1, knots);
        this._spline = this._splineTarget.clone();
        this.optimizationProblem = new OptimizationProblemPeriodicBSplineR1toR2QuasiNewton_1.OptimizationProblemPeriodicBSplineR1toR2QuasiNewton(this._splineTarget.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
    }
    get spline() {
        return this._spline.clone();
    }
    get isClosed() {
        return true;
    }
    notifyObservers() {
        for (let observer of this.observers) {
            observer.update(this._spline.clone());
        }
        for (let observer of this.observersCP) {
            observer.update(this._splineTarget.clone());
        }
    }
    moveControlPoint(controlPointIndex, deltaX, deltaY) {
        this._splineTarget.moveControlPoint(controlPointIndex, deltaX, deltaY);
        if (deltaX * deltaX + deltaY * deltaY > 0) {
            this.notifyObservers();
        }
    }
    setControlPointPosition(controlPointIndex, x, y) {
        this._splineTarget.setControlPointPosition(controlPointIndex, new Vector2d_1.Vector2d(x, y));
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y);
        }
        else {
            this._spline = this._splineTarget.clone();
        }
        this.notifyObservers();
    }
    optimize(selectedControlPoint, ndcX, ndcY) {
        if (this.optimizationProblem && this.optimizer) {
            const p = this._splineTarget.freeControlPoints[selectedControlPoint].clone();
            this._splineTarget.setControlPointPosition(selectedControlPoint, new Vector2d_1.Vector2d(ndcX, ndcY));
            this.optimizationProblem.setTargetSpline(this._splineTarget);
            try {
                this.optimizer.optimize_using_trust_region(10e-6, 1000, 800);
                if (this.optimizer.success === true) {
                    this.setSpline(this.optimizationProblem.spline.clone());
                }
            }
            catch (e) {
                this._splineTarget.setControlPointPosition(selectedControlPoint, new Vector2d_1.Vector2d(p.x, p.y));
                console.log(e);
            }
        }
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
            if (cp === this._spline.freeControlPoints.length - 1) {
                cp -= 1;
            }
            const grevilleAbscissae = this._spline.grevilleAbscissae();
            let meanGA = (grevilleAbscissae[cp] + grevilleAbscissae[cp + 1]) / 2;
            if (meanGA < this._spline.knots[this._spline.degree]) {
                let index = this._spline.degree;
                meanGA = (this._spline.knots[index] + this._spline.knots[index + 1]) / 2;
            }
            else if (meanGA > this._spline.knots[this._spline.knots.length - this._spline.degree - 1]) {
                let index = this._spline.knots.length - this._spline.degree - 1;
                meanGA = (this._spline.knots[index] + this._spline.knots[index - 1]) / 2;
            }
            this._splineTarget.insertKnot(meanGA);
            this._spline.insertKnot(meanGA);
        }
        this.optimizationProblem = new OptimizationProblemPeriodicBSplineR1toR2QuasiNewton_1.OptimizationProblemPeriodicBSplineR1toR2QuasiNewton(this._splineTarget.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
        this.notifyObservers();
    }
    setActiveControl() {
        this.optimizationProblem = new OptimizationProblemPeriodicBSplineR1toR2QuasiNewton_1.OptimizationProblemPeriodicBSplineR1toR2QuasiNewton(this._splineTarget.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
        this.notifyObservers();
    }
    toggleActiveControlOfCurvatureExtrema() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true;
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
            this.activeOptimizer = false;
        }
        if (this.activeOptimizer) {
            this.setActiveControl();
        }
    }
    toggleActiveControlOfInflections() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true;
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections) {
            this.activeOptimizer = false;
        }
        if (this.activeOptimizer) {
            this.setActiveControl();
        }
    }
}
exports.ClosedCurveModelAlternative01 = ClosedCurveModelAlternative01;


/***/ }),

/***/ "./src/models/CurveModel.ts":
/*!**********************************!*\
  !*** ./src/models/CurveModel.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BSplineR1toR2_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR2 */ "./src/bsplines/BSplineR1toR2.ts");
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
const OptimizationProblemBSplineR1toR2_1 = __webpack_require__(/*! ../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2.ts");
const Optimizer_1 = __webpack_require__(/*! ../optimizers/Optimizer */ "./src/optimizers/Optimizer.ts");
const AbstractCurveModel_1 = __webpack_require__(/*! ./AbstractCurveModel */ "./src/models/AbstractCurveModel.ts");
class CurveModel extends AbstractCurveModel_1.AbstractCurveModel {
    constructor() {
        super();
        /*
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.1, 0.5)
        const cp2 = new Vector2d(0.1, 0.5)
        const cp3 = new Vector2d(0.5, 0)

        this._spline = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])
        */
        const cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        const cp1 = new Vector2d_1.Vector2d(-0.3, 0.5);
        const cp2 = new Vector2d_1.Vector2d(0, 0.7);
        const cp3 = new Vector2d_1.Vector2d(0.3, 0.5);
        const cp4 = new Vector2d_1.Vector2d(0.5, 0);
        this._spline = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]);
        this.optimizationProblem = new OptimizationProblemBSplineR1toR2_1.OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
        //this.optimizer = new QuasiNewtonOptimizer(this.optimizationProblem)
    }
    get spline() {
        return this._spline.clone();
    }
    get isClosed() {
        return false;
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
        }
        this.optimizationProblem = new OptimizationProblemBSplineR1toR2_1.OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
        this.notifyObservers();
    }
    setActiveControl() {
        this.optimizationProblem = new OptimizationProblemBSplineR1toR2_1.OptimizationProblemBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
        this.notifyObservers();
    }
}
exports.CurveModel = CurveModel;


/***/ }),

/***/ "./src/models/CurveModel3d.ts":
/*!************************************!*\
  !*** ./src/models/CurveModel3d.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BSplineR1toR3_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR3 */ "./src/bsplines/BSplineR1toR3.ts");
const OptimizationProblemBSplineR1toR3_1 = __webpack_require__(/*! ../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR3 */ "./src/bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR3.ts");
const Vector3d_1 = __webpack_require__(/*! ../mathVector/Vector3d */ "./src/mathVector/Vector3d.ts");
const Optimizer_1 = __webpack_require__(/*! ../optimizers/Optimizer */ "./src/optimizers/Optimizer.ts");
var ActiveControl;
(function (ActiveControl) {
    ActiveControl[ActiveControl["curvatureExtrema"] = 0] = "curvatureExtrema";
    ActiveControl[ActiveControl["torsionZeros"] = 1] = "torsionZeros";
    ActiveControl[ActiveControl["both"] = 2] = "both";
})(ActiveControl = exports.ActiveControl || (exports.ActiveControl = {}));
class CurveModel3d {
    constructor() {
        this.activeOptimizer = true;
        this.activeControl = ActiveControl.both;
        this.optimizer = null;
        this.observers = [];
        const cp0 = new Vector3d_1.Vector3d(-0.25, 0, -0.15);
        const cp1 = new Vector3d_1.Vector3d(-0.15, 0.15, -0.05);
        const cp2 = new Vector3d_1.Vector3d(0, 0.25, -0.05);
        const cp3 = new Vector3d_1.Vector3d(0.15, 0.15, -0.05);
        const cp4 = new Vector3d_1.Vector3d(0.25, 0, 0.05);
        this._spline = new BSplineR1toR3_1.BSplineR1toR3([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]);
        this.optimizationProblem = new OptimizationProblemBSplineR1toR3_1.OptimizationProblemBSplineR1toR3(this._spline.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
    }
    registerObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers.splice(this.observers.indexOf(observer), 1);
    }
    notifyObservers() {
        for (let observer of this.observers) {
            observer.update(this._spline.clone());
        }
    }
    get spline() {
        return this._spline.clone();
    }
    get isClosed() {
        return false;
    }
    setControlPointPosition(controlPointIndex, x, y, z) {
        this._spline.setControlPointPosition(controlPointIndex, new Vector3d_1.Vector3d(x, y, z));
        this.notifyObservers();
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y, z);
        }
    }
    optimize(selectedControlPoint, x, y, z) {
        if (this.optimizationProblem && this.optimizer) {
            const p = this.optimizationProblem.spline.freeControlPoints[selectedControlPoint].clone();
            this._spline.setControlPointPosition(selectedControlPoint, new Vector3d_1.Vector3d(x, y, z));
            this.optimizationProblem.setTargetSpline(this._spline);
            try {
                this.optimizer.optimize_using_trust_region(10e-6, 1000, 800);
                if (this.optimizer.success === true) {
                    this.setSpline(this.optimizationProblem.spline.clone());
                }
            }
            catch (e) {
                this._spline.setControlPointPosition(selectedControlPoint, new Vector3d_1.Vector3d(p.x, p.y, p.z));
                console.log(e);
            }
        }
    }
    setSpline(spline) {
        this._spline = spline;
        this.notifyObservers();
    }
    toggleActiveControlOfCurvatureExtrema() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true;
            this.activeControl = ActiveControl.curvatureExtrema;
        }
        else if (this.activeControl == ActiveControl.both) {
            this.activeControl = ActiveControl.torsionZeros;
        }
        else if (this.activeControl == ActiveControl.torsionZeros) {
            this.activeControl = ActiveControl.both;
        }
        else if (this.activeControl == ActiveControl.curvatureExtrema) {
            this.activeOptimizer = false;
        }
        if (this.activeOptimizer) {
            this.setActiveControl();
        }
    }
    toggleActiveControlOfTorsionZeros() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true;
            this.activeControl = ActiveControl.torsionZeros;
        }
        else if (this.activeControl == ActiveControl.both) {
            this.activeControl = ActiveControl.curvatureExtrema;
        }
        else if (this.activeControl == ActiveControl.curvatureExtrema) {
            this.activeControl = ActiveControl.both;
        }
        else if (this.activeControl == ActiveControl.torsionZeros) {
            this.activeOptimizer = false;
        }
        if (this.activeOptimizer) {
            this.setActiveControl();
        }
    }
    setActiveControl() {
        this.optimizationProblem = new OptimizationProblemBSplineR1toR3_1.OptimizationProblemBSplineR1toR3(this._spline.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
        this.notifyObservers();
    }
}
exports.CurveModel3d = CurveModel3d;


/***/ }),

/***/ "./src/models/CurveModelAlternative01.ts":
/*!***********************************************!*\
  !*** ./src/models/CurveModelAlternative01.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BSplineR1toR2_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR2 */ "./src/bsplines/BSplineR1toR2.ts");
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
const OptimizationProblemBSplineR1toR2WithWeigthingFactors_1 = __webpack_require__(/*! ../bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2WithWeigthingFactors */ "./src/bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2WithWeigthingFactors.ts");
const Optimizer_1 = __webpack_require__(/*! ../optimizers/Optimizer */ "./src/optimizers/Optimizer.ts");
const AbstractOptimizationProblemBSplineR1toR2_1 = __webpack_require__(/*! ../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2.ts");
const AbstractCurveModel_1 = __webpack_require__(/*! ./AbstractCurveModel */ "./src/models/AbstractCurveModel.ts");
class CurveModelAlternative01 extends AbstractCurveModel_1.AbstractCurveModel {
    constructor() {
        super();
        const cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        const cp1 = new Vector2d_1.Vector2d(-0.1, 0.5);
        const cp2 = new Vector2d_1.Vector2d(0.1, 0.5);
        const cp3 = new Vector2d_1.Vector2d(0.5, 0);
        this._splineTarget = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1]);
        this._spline = this._splineTarget.clone();
        //this.optimizationProblem = new  OptimizationProblemBSplineR1toR2(this._splineTarget.clone(), this._spline.clone(), this.activeControl)
        this.optimizationProblem = new OptimizationProblemBSplineR1toR2WithWeigthingFactors_1.OptimizationProblemBSplineR1toR2WithWeigthingFactors(this._splineTarget.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
    }
    get spline() {
        return this._spline.clone();
    }
    get isClosed() {
        return false;
    }
    notifyObservers() {
        for (let observer of this.observers) {
            observer.update(this._spline.clone());
        }
        for (let observer of this.observersCP) {
            observer.update(this._splineTarget.clone());
        }
    }
    moveControlPoint(controlPointIndex, deltaX, deltaY) {
        this._splineTarget.moveControlPoint(controlPointIndex, deltaX, deltaY);
        if (deltaX * deltaX + deltaY * deltaY > 0) {
            this.notifyObservers();
        }
    }
    setControlPointPosition(controlPointIndex, x, y) {
        this._splineTarget.setControlPointPosition(controlPointIndex, new Vector2d_1.Vector2d(x, y));
        if (this.activeOptimizer) {
            this.optimize(controlPointIndex, x, y);
        }
        else {
            this._spline = this._splineTarget.clone();
        }
        this.notifyObservers();
    }
    optimize(selectedControlPoint, ndcX, ndcY) {
        if (this.optimizationProblem && this.optimizer) {
            const p = this._splineTarget.freeControlPoints[selectedControlPoint].clone();
            this._splineTarget.setControlPointPosition(selectedControlPoint, new Vector2d_1.Vector2d(ndcX, ndcY));
            this.optimizationProblem.setTargetSpline(this._splineTarget);
            try {
                this.optimizer.optimize_using_trust_region(10e-6, 1000, 800);
                if (this.optimizer.success === true) {
                    this.setSpline(this.optimizationProblem.spline.clone());
                }
            }
            catch (e) {
                this._splineTarget.setControlPointPosition(selectedControlPoint, new Vector2d_1.Vector2d(p.x, p.y));
                console.log(e);
            }
        }
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
            if (cp === this._splineTarget.controlPoints.length - 1) {
                cp -= 1;
            }
            const grevilleAbscissae = this._splineTarget.grevilleAbscissae();
            this._splineTarget.insertKnot(grevilleAbscissae[cp]);
            this._spline.insertKnot(grevilleAbscissae[cp]);
        }
        this.optimizationProblem = new OptimizationProblemBSplineR1toR2WithWeigthingFactors_1.OptimizationProblemBSplineR1toR2WithWeigthingFactors(this._splineTarget.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
        this.notifyObservers();
    }
    setActiveControl() {
        this.optimizationProblem = new OptimizationProblemBSplineR1toR2WithWeigthingFactors_1.OptimizationProblemBSplineR1toR2WithWeigthingFactors(this._splineTarget.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
        this.notifyObservers();
    }
    toggleActiveControlOfCurvatureExtrema() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true;
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
            this.activeOptimizer = false;
        }
        if (this.activeOptimizer) {
            this.setActiveControl();
        }
    }
    toggleActiveControlOfInflections() {
        if (!this.activeOptimizer) {
            this.activeOptimizer = true;
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.curvatureExtrema) {
            this.activeControl = AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.both;
        }
        else if (this.activeControl == AbstractOptimizationProblemBSplineR1toR2_1.ActiveControl.inflections) {
            this.activeOptimizer = false;
        }
        if (this.activeOptimizer) {
            this.setActiveControl();
        }
    }
}
exports.CurveModelAlternative01 = CurveModelAlternative01;


/***/ }),

/***/ "./src/models/NurbsModel2d.ts":
/*!************************************!*\
  !*** ./src/models/NurbsModel2d.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const RationalBSplineR1toR2_1 = __webpack_require__(/*! ../bsplines/RationalBSplineR1toR2 */ "./src/bsplines/RationalBSplineR1toR2.ts");
const RationalBSplineR1toR2Adapter_1 = __webpack_require__(/*! ../bsplines/RationalBSplineR1toR2Adapter */ "./src/bsplines/RationalBSplineR1toR2Adapter.ts");
const OptimizationProblemRationalBSplineR1toR2_1 = __webpack_require__(/*! ../bsplinesOptimizationProblems/OptimizationProblemRationalBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/OptimizationProblemRationalBSplineR1toR2.ts");
const Vector3d_1 = __webpack_require__(/*! ../mathVector/Vector3d */ "./src/mathVector/Vector3d.ts");
const Optimizer_1 = __webpack_require__(/*! ../optimizers/Optimizer */ "./src/optimizers/Optimizer.ts");
const AbstractNurbsModel_1 = __webpack_require__(/*! ./AbstractNurbsModel */ "./src/models/AbstractNurbsModel.ts");
class NurbsModel2d extends AbstractNurbsModel_1.AbstractNurbsModel {
    constructor() {
        super();
        const cp0 = new Vector3d_1.Vector3d(-0.5, 0, 1);
        const cp1 = new Vector3d_1.Vector3d(-0.3, 0.5, 1);
        const cp2 = new Vector3d_1.Vector3d(0, 0.7, 1);
        const cp3 = new Vector3d_1.Vector3d(0.3, 0.5, 1);
        const cp4 = new Vector3d_1.Vector3d(0.5, 0, 1);
        this._spline = new RationalBSplineR1toR2_1.RationalBSplineR1toR2([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]);
        this.optimizationProblem = new OptimizationProblemRationalBSplineR1toR2_1.OptimizationProblemRationalBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
    }
    get spline() {
        return this._spline.clone();
    }
    getSplineAdapter() {
        return new RationalBSplineR1toR2Adapter_1.RationalBSplineR1toR2Adapter(this._spline.controlPoints, this._spline.knots);
    }
    get isClosed() {
        return false;
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
        }
        console.log(this._spline);
        this.optimizationProblem = new OptimizationProblemRationalBSplineR1toR2_1.OptimizationProblemRationalBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
        this.notifyObservers();
    }
    setActiveControl() {
        this.optimizationProblem = new OptimizationProblemRationalBSplineR1toR2_1.OptimizationProblemRationalBSplineR1toR2(this._spline.clone(), this._spline.clone(), this.activeControl);
        this.optimizer = new Optimizer_1.Optimizer(this.optimizationProblem);
        this.notifyObservers();
    }
    setSpline(spline) {
        this._spline = spline;
        this.notifyObservers();
    }
}
exports.NurbsModel2d = NurbsModel2d;


/***/ }),

/***/ "./src/optimizers/Optimizer.ts":
/*!*************************************!*\
  !*** ./src/optimizers/Optimizer.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const TrustRegionSubproblem_1 = __webpack_require__(/*! ./TrustRegionSubproblem */ "./src/optimizers/TrustRegionSubproblem.ts");
const MathVectorBasicOperations_1 = __webpack_require__(/*! ../linearAlgebra/MathVectorBasicOperations */ "./src/linearAlgebra/MathVectorBasicOperations.ts");
const SymmetricMatrix_1 = __webpack_require__(/*! ../linearAlgebra/SymmetricMatrix */ "./src/linearAlgebra/SymmetricMatrix.ts");
const CholeskyDecomposition_1 = __webpack_require__(/*! ../linearAlgebra/CholeskyDecomposition */ "./src/linearAlgebra/CholeskyDecomposition.ts");
class Optimizer {
    constructor(o) {
        this.o = o;
        this.success = false;
        if (this.o.f.length !== this.o.gradient_f.shape[0]) {
            console.log("Problem about f length and gradient_f shape 0 is in the Optimizer Constructor");
            console.log(this.o.f);
            console.log(this.o.gradient_f);
        }
    }
    optimize_using_trust_region(epsilon = 10e-8, maxTrustRadius = 10, maxNumSteps = 800) {
        this.success = false;
        // Bibliographic reference: Numerical Optimization, second edition, Jorge Nocedal and Stephen J. Wright, p. 69
        let numSteps = 0;
        let t = this.o.numberOfConstraints / this.o.f0;
        //let t = 10 / this.o.f0
        let trustRadius = 0.1;
        let rho;
        const eta = 0.1; // [0, 1/4)
        const mu = 10; // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 569
        let counter = 0;
        let numStepsX = 0;
        //while (this.o.numberOfConstraints / t > epsilon) {
        while (10 / t > epsilon) {
            //console.log(t)
            while (true) {
                counter += 1;
                numSteps += 1;
                if (this.o.f.length !== this.o.gradient_f.shape[0]) {
                    console.log("Problem about f length and gradient_f shape 0 is in the function optimize_using_trust_region");
                }
                let b = this.barrier(this.o.f, this.o.gradient_f, this.o.hessian_f);
                let gradient = MathVectorBasicOperations_1.saxpy2(t, this.o.gradient_f0, b.gradient);
                let hessian = b.hessian.plusSymmetricMatrixMultipliedByValue(this.o.hessian_f0, t);
                let trustRegionSubproblem = new TrustRegionSubproblem_1.TrustRegionSubproblem(gradient, hessian);
                let tr = trustRegionSubproblem.solve(trustRadius);
                let fStep = this.o.fStep(tr.step);
                let numSteps2 = 0;
                while (Math.max.apply(null, fStep) >= 0) {
                    numSteps2 += 1;
                    trustRadius *= 0.25;
                    tr = trustRegionSubproblem.solve(trustRadius);
                    fStep = this.o.fStep(tr.step);
                    if (numSteps2 > 100) {
                        throw new Error("maxSteps2 > 100");
                    }
                }
                let barrierValueStep = this.barrierValue(fStep);
                let actualReduction = t * (this.o.f0 - this.o.f0Step(tr.step)) + (b.value - barrierValueStep);
                let predictedReduction = -MathVectorBasicOperations_1.dotProduct(gradient, tr.step) - 0.5 * hessian.quadraticForm(tr.step);
                rho = actualReduction / predictedReduction;
                if (rho < 0.25) {
                    trustRadius *= 0.25;
                }
                else if (rho > 0.75 && tr.hitsBoundary) {
                    trustRadius = Math.min(2 * trustRadius, maxTrustRadius);
                }
                if (rho > eta) {
                    this.o.step(tr.step);
                    numStepsX += 1;
                }
                if (numSteps > maxNumSteps) {
                    return;
                }
                if ((new CholeskyDecomposition_1.CholeskyDecomposition(hessian).success)) {
                    let newtonDecrementSquared = -MathVectorBasicOperations_1.dotProduct(gradient, tr.step);
                    if (newtonDecrementSquared < 0) {
                        throw new Error("newtonDecrementSquared is smaller than zero");
                    }
                    if (newtonDecrementSquared < epsilon) {
                        break;
                    }
                }
                if (trustRadius < 10e-18) {
                    console.log(b);
                    throw new Error("trust Radius < 10e-18");
                }
            }
            if (trustRadius > 0.001) {
                t *= mu;
            }
            else {
                t *= 100 * mu;
                //console.log("100*mu")
            }
        }
        this.success = true;
        if (numSteps > 100) {
            console.log("numSteps: " + numSteps);
            console.log("t: " + t);
            console.log("trustRadius: " + trustRadius);
        }
        //console.log(counter)
    }
    optimize_using_line_search(epsilon = 10e-6, maxNumSteps = 300) {
        // Bibliographic reference: Numerical Optimization, second edition, Jorge Nocedal and Stephen J. Wright, p. 69
        let numSteps = 0;
        let t = this.o.numberOfConstraints / this.o.f0;
        let rho;
        const eta = 0.1; // [0, 1/4)
        const mu = 10; // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 569
        while (this.o.numberOfConstraints / t > epsilon) {
            while (true) {
                numSteps += 1;
                const b = this.barrier(this.o.f, this.o.gradient_f, this.o.hessian_f);
                const gradient = MathVectorBasicOperations_1.saxpy2(t, this.o.gradient_f0, b.gradient);
                const hessian = b.hessian.plusSymmetricMatrixMultipliedByValue(this.o.hessian_f0, t);
                const newtonStep = this.computeNewtonStep(gradient, hessian);
                const stepRatio = this.backtrackingLineSearch(t, newtonStep, this.o.f0, b.value, this.o.gradient_f0, b.gradient);
                const step = MathVectorBasicOperations_1.multiplyVectorByScalar(newtonStep, stepRatio);
                this.o.step(step);
                if (numSteps > maxNumSteps) {
                    console.log("numSteps > maxNumSteps");
                    return;
                }
                let newtonDecrementSquared = this.newtonDecrementSquared(step, t, this.o.gradient_f0, b.gradient);
                if (newtonDecrementSquared < 0) {
                    throw new Error("newtonDecrementSquared is smaller than zero");
                }
                if (newtonDecrementSquared < epsilon) {
                    break;
                }
            }
            t *= mu;
        }
    }
    newtonDecrementSquared(newtonStep, t, gradient_f0, barrierGradient) {
        return -MathVectorBasicOperations_1.dotProduct(MathVectorBasicOperations_1.saxpy2(t, gradient_f0, barrierGradient), newtonStep);
    }
    barrierValue(f) {
        let result = 0;
        const n = f.length;
        for (let i = 0; i < n; i += 1) {
            result -= Math.log(-f[i]);
        }
        return result;
    }
    barrierGradient(f, gradient_f) {
        let result = MathVectorBasicOperations_1.zeroVector(gradient_f.shape[1]);
        const n = f.length;
        const m = gradient_f.shape[1];
        if (n !== gradient_f.shape[0]) {
            throw new Error("barrierGradient f and gradient_f dimensions do not match");
        }
        for (let i = 0; i < n; i += 1) {
            for (let j = 0; j < m; j += 1) {
                if (f[i] === 0) {
                    throw new Error("barrierGradient makes a division by zero");
                }
                result[j] += -gradient_f.get(i, j) / f[i];
            }
        }
        return result;
    }
    barrierHessian(f, gradient_f, hessian_f) {
        // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 564
        const m = gradient_f.shape[0];
        const n = gradient_f.shape[1];
        let result = new SymmetricMatrix_1.SymmetricMatrix(n);
        // barrier hessian first term
        for (let i = 0; i < m; i += 1) {
            for (let k = 0; k < n; k += 1) {
                for (let l = 0; l <= k; l += 1) {
                    result.addAt(k, l, gradient_f.get(i, k) * gradient_f.get(i, l) / (f[i] * f[i]));
                }
            }
        }
        // barrier hessian second term
        if (hessian_f) {
            for (let i = 0; i < n; i += 1) {
                for (let j = 0; j <= i; j += 1) {
                    for (let k = 0; k < f.length; k += 1) {
                        if (hessian_f.length != f.length) {
                            console.log("f.length: " + f.length);
                            console.log("hessian_f.length: " + hessian_f.length);
                            throw new Error("hessian_f.length != f.length");
                        }
                        result.addAt(i, j, -hessian_f[k].get(i, j) / f[k]);
                    }
                }
            }
        }
        return result;
    }
    barrier(f, gradient_f, hessian_f) {
        return { value: this.barrierValue(f),
            gradient: this.barrierGradient(f, gradient_f),
            hessian: this.barrierHessian(f, gradient_f, hessian_f)
        };
    }
    backtrackingLineSearch(t, newtonStep, f0, barrierValue, gradient_f0, barrierGradient) {
        const alpha = 0.2;
        const beta = 0.5;
        let result = 1;
        let step = newtonStep.slice();
        while (Math.max(...this.o.fStep(step)) > 0) {
            result *= beta;
            step = MathVectorBasicOperations_1.multiplyVectorByScalar(newtonStep, result);
        }
        while (t * this.o.f0Step(step) + this.barrierValue(this.o.fStep(step)) > t * f0 + barrierValue
            + alpha * result * MathVectorBasicOperations_1.dotProduct(MathVectorBasicOperations_1.addTwoVectors(MathVectorBasicOperations_1.multiplyVectorByScalar(gradient_f0, t), barrierGradient), newtonStep)) {
            result *= beta;
            step = MathVectorBasicOperations_1.multiplyVectorByScalar(newtonStep, result);
        }
        return result;
    }
    computeNewtonStep(gradient, hessian) {
        let choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessian);
        if (choleskyDecomposition.success === false) {
            console.log("choleskyDecomposition failed");
        }
        return choleskyDecomposition.solve(MathVectorBasicOperations_1.multiplyVectorByScalar(gradient, -1));
    }
}
exports.Optimizer = Optimizer;


/***/ }),

/***/ "./src/optimizers/TrustRegionSubproblem.ts":
/*!*************************************************!*\
  !*** ./src/optimizers/TrustRegionSubproblem.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const SquareMatrix_1 = __webpack_require__(/*! ../linearAlgebra/SquareMatrix */ "./src/linearAlgebra/SquareMatrix.ts");
const MathVectorBasicOperations_1 = __webpack_require__(/*! ../linearAlgebra/MathVectorBasicOperations */ "./src/linearAlgebra/MathVectorBasicOperations.ts");
const CholeskyDecomposition_1 = __webpack_require__(/*! ../linearAlgebra/CholeskyDecomposition */ "./src/linearAlgebra/CholeskyDecomposition.ts");
// Bibliographic Reference: Trust-Region Methods, Conn, Gould and Toint p. 187
// note: lambda is never negative
var lambdaRange;
(function (lambdaRange) {
    lambdaRange[lambdaRange["N"] = 0] = "N";
    lambdaRange[lambdaRange["L"] = 1] = "L";
    lambdaRange[lambdaRange["G"] = 2] = "G";
    lambdaRange[lambdaRange["F"] = 3] = "F";
})(lambdaRange || (lambdaRange = {}));
/**
 * A trust region subproblem solver
 */
class TrustRegionSubproblem {
    /**
     * Create the trust region subproblem solver
     * @param gradient The gradient of the objective function to minimize
     * @param hessian The hessian of the objective function to minimize
     * @param k_easy Optional value in the range (0, 1)
     * @param k_hard Optional value in the range (0, 1)
     */
    constructor(gradient, hessian, k_easy = 0.1, k_hard = 0.2) {
        this.gradient = gradient;
        this.hessian = hessian;
        this.k_easy = k_easy;
        this.k_hard = k_hard;
        this.CLOSE_TO_ZERO = 10e-8;
        this.numberOfIterations = 0;
        this.lambda = { current: 0, lowerBound: 0, upperBound: 0 };
        this.hitsBoundary = true;
        this.step = [];
        this.stepSquaredNorm = 0;
        this.stepNorm = 0;
        this.range = lambdaRange.F;
        this.lambdaPlus = 0;
        this.hardCase = false;
        this.gNorm = MathVectorBasicOperations_1.norm(this.gradient);
        if (MathVectorBasicOperations_1.containsNaN(gradient)) {
            throw new Error("The gradient parameter passed to the TrustRegionSubproblem constructor contains NaN");
        }
        if (hessian.containsNaN()) {
            throw new Error("The hessian parameter passed to the TrustRegionSubproblem to constructor contains NaN");
        }
        this.cauchyPoint = MathVectorBasicOperations_1.zeroVector(this.gradient.length);
    }
    /**
     * Find the nearly exact trust region subproblem minimizer
     * @param trustRegionRadius The trust region radius
     * @returns The vector .step and the boolean .hitsBoundary
     */
    solve(trustRegionRadius) {
        // Bibliographic Reference: Trust-Region Methods, Conn, Gould and Toint p. 193
        // see also the list of errata: ftp://ftp.numerical.rl.ac.uk/pub/trbook/trbook-errata.pdf for Algorithm 7.3.4 Step 1a
        this.cauchyPoint = this.computeCauchyPoint(trustRegionRadius);
        this.lambda = this.initialLambdas(trustRegionRadius);
        this.numberOfIterations = 0;
        const maxNumberOfIterations = 300;
        while (true) {
            this.numberOfIterations += 1;
            // step 1.
            let hessianPlusLambda = this.hessian.addValueOnDiagonal(this.lambda.current);
            let choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessianPlusLambda);
            //We have found the exact lambda, however the hessian is indefinite
            //The idea is then to find an approximate solution increasing the lambda value by EPSILON
            if (this.lambda.upperBound === this.lambda.lowerBound && !choleskyDecomposition.success) {
                const EPSILON = 10e-6;
                this.lambda.upperBound += EPSILON;
                this.lambda.current += EPSILON;
                hessianPlusLambda = this.hessian.addValueOnDiagonal(this.lambda.current);
                choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessianPlusLambda);
                this.range = lambdaRange.G;
            }
            // step 1a.
            this.update_step_and_range(trustRegionRadius, choleskyDecomposition);
            if (this.interiorConvergence()) {
                break;
            }
            // step 2.
            this.update_lower_and_upper_bounds();
            // step 3.
            this.update_lambda_lambdaPlus_lowerBound_and_step(trustRegionRadius, hessianPlusLambda, choleskyDecomposition);
            // step 4.
            if (this.check_for_termination_and_update_step(trustRegionRadius, hessianPlusLambda, choleskyDecomposition)) {
                break;
            }
            // step 5.
            this.update_lambda();
            if (this.numberOfIterations > maxNumberOfIterations) {
                console.log("gradient: " + this.gradient);
                console.log("hessian: " + this.hessian.getData());
                console.log("trust region radius: " + trustRegionRadius);
                throw new Error("Trust region subproblem maximum number of step exceeded");
            }
        }
        //console.log(this.numberOfIterations)
        return {
            step: this.step,
            hitsBoundary: this.hitsBoundary,
            hardCase: this.hardCase
        };
    }
    /**
     * An interior solution with a zero Lagrangian multiplier implies interior convergence
     */
    interiorConvergence() {
        // A range G corresponds to a step smaller than the trust region radius
        if (this.lambda.current === 0 && this.range === lambdaRange.G) {
            this.hitsBoundary = false;
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Updates the lambdaRange set. Updates the step if the factorization succeeded.
     * @param trustRegionRadius Trust region radius
     * @param choleskyDecomposition Cholesky decomposition
     */
    update_step_and_range(trustRegionRadius, choleskyDecomposition) {
        if (choleskyDecomposition.success) {
            this.step = choleskyDecomposition.solve(MathVectorBasicOperations_1.multiplyVectorByScalar(this.gradient, -1));
            this.stepSquaredNorm = MathVectorBasicOperations_1.squaredNorm(this.step);
            this.stepNorm = Math.sqrt(this.stepSquaredNorm);
            if (this.stepNorm < trustRegionRadius) {
                this.range = lambdaRange.G;
            }
            else {
                this.range = lambdaRange.L; // once a Newton iterate falls into L it stays there
            }
        }
        else {
            this.range = lambdaRange.N;
        }
    }
    /**
     * Update lambda.upperBound or lambda.lowerBound
     */
    update_lower_and_upper_bounds() {
        if (this.range === lambdaRange.G) {
            this.lambda.upperBound = this.lambda.current;
        }
        else {
            this.lambda.lowerBound = this.lambda.current;
        }
    }
    /**
     * Update lambdaPlus, lambda.lowerBound, lambda.current and step
     * @param trustRegionRadius Trust region radius
     * @param hessianPlusLambda Hessian + lambda.current * I
     * @param choleskyDecomposition The Cholesky Decomposition of Hessian + lambda.current * I
     */
    update_lambda_lambdaPlus_lowerBound_and_step(trustRegionRadius, hessianPlusLambda, choleskyDecomposition) {
        // Step 3. If lambda in F
        if (this.range === lambdaRange.L || this.range === lambdaRange.G) {
            // Step 3a. Solve Lw = step and set lambdaPlus (algorithm 7.3.1)
            let w = solveLowerTriangular(choleskyDecomposition.g, this.step);
            let wSquaredNorm = MathVectorBasicOperations_1.squaredNorm(w);
            this.lambdaPlus = this.lambda.current + (this.stepNorm / trustRegionRadius - 1) * (this.stepSquaredNorm / wSquaredNorm);
            // Step 3b. If lambda in G
            if (this.range === lambdaRange.G) {
                // i. Use the LINPACK method to find a unit vector u to make <u, H(lambda), u> small.
                let s_min = estimateSmallestSingularValue(choleskyDecomposition.g);
                // ii. Replace lambda.lowerBound by max [lambda_lb, lambda - <u, H(lambda), u>].
                this.lambda.lowerBound = Math.max(this.lambda.lowerBound, this.lambda.current - Math.pow(s_min.value, 2));
                // iii. Find the root alpha of the equation || step + alpha u || = trustRegionRadius which makes
                // the model q(step + alpha u) smallest and replace step by step + alpha u
                let intersection = getBoundariesIntersections(this.step, s_min.vector, trustRegionRadius);
                let t;
                if (Math.abs(intersection.tmin) < Math.abs(intersection.tmax)) {
                    t = intersection.tmin;
                }
                else {
                    t = intersection.tmax;
                }
                MathVectorBasicOperations_1.saxpy(t, s_min.vector, this.step);
                this.stepSquaredNorm = MathVectorBasicOperations_1.squaredNorm(this.step);
                this.stepNorm = Math.sqrt(this.stepSquaredNorm);
            }
        }
        else {
            // Step 3c. Use the partial factorization to find delta and v such that (H(lambda) + delta e_k e_k^T) v = 0
            let sls = singularLeadingSubmatrix(hessianPlusLambda, choleskyDecomposition.g, choleskyDecomposition.firstNonPositiveDefiniteLeadingSubmatrixSize);
            // Step 3d. Replace lambda.lb by max [ lambda_lb, lambda_current + delta / || v ||^2 ]
            let vSquaredNorm = MathVectorBasicOperations_1.squaredNorm(sls.vector);
            this.lambda.lowerBound = Math.max(this.lambda.lowerBound, this.lambda.current + sls.delta / vSquaredNorm);
        }
    }
    /**
     * Check for termination
     * @param trustRegionRadius Trust region radius
     * @param hessianPlusLambda Hessian + lambda.current * I
     * @param choleskyDecomposition The CholeskyDecomposition of Hessian + lambda.current * I
     */
    check_for_termination_and_update_step(trustRegionRadius, hessianPlusLambda, choleskyDecomposition) {
        let terminate = false;
        // Algorithm 7.3.5, Step 1. If lambda is in F and | ||s(lambda)|| - trustRegionRadius | <= k_easy * trustRegionRadius
        if ((this.range === lambdaRange.L || this.range === lambdaRange.G) && Math.abs(this.stepNorm - trustRegionRadius) <= this.k_easy * trustRegionRadius) {
            // Added test to make sure that the result is better than the Cauchy point
            let evalResult = MathVectorBasicOperations_1.dotProduct(this.gradient, this.step) + 0.5 * this.hessian.quadraticForm(this.step);
            let evalCauchy = MathVectorBasicOperations_1.dotProduct(this.gradient, this.cauchyPoint) + 0.5 * this.hessian.quadraticForm(this.cauchyPoint);
            if (evalResult > evalCauchy) {
                return false;
            }
            else {
                // stop with s = s(lambda)
                this.hitsBoundary = true;
                terminate = true;
            }
        }
        if (this.range === lambdaRange.G) {
            // Algorithm 7.3.5, Step 2. If lambda = 0 in G
            if (this.lambda.current === 0) {
                this.hitsBoundary = false; // since the Lagrange Multiplier is zero
                terminate = true;
                return terminate;
            }
            // Algorithm 7.3.5, Step 3. If lambda is in G and the LINPACK method gives u and alpha such that
            // alpha^2 <u, H(lambda), u> <= k_hard ( <s(lambda), H(lambda) * s(lambda) + lambda * trustRegionRadius^2 >)
            let s_min = estimateSmallestSingularValue(choleskyDecomposition.g);
            let intersection = getBoundariesIntersections(this.step, s_min.vector, trustRegionRadius);
            let t_abs_max;
            // To do : explain better why > instead of <
            // relative_error is smaller for <
            // it seems that we need the worst case to make sure the result is a better solution
            // than the Cauchy point
            if (Math.abs(intersection.tmin) > Math.abs(intersection.tmax)) {
                t_abs_max = intersection.tmin;
            }
            else {
                t_abs_max = intersection.tmax;
            }
            let quadraticTerm = hessianPlusLambda.quadraticForm(this.step);
            let relative_error = Math.pow(t_abs_max * s_min.value, 2) / (quadraticTerm + this.lambda.current * Math.pow(trustRegionRadius, 2));
            if (relative_error <= this.k_hard) {
                //saxpy(t_abs_min, s_min.vector, this.step) done at step 3b iii.
                this.hitsBoundary = true;
                this.hardCase = true;
                terminate = true;
            }
        }
        return terminate;
    }
    /**
     * Update lambda.current
     */
    update_lambda() {
        //step 5.
        if (this.range === lambdaRange.L && this.gNorm !== 0) {
            this.lambda.current = this.lambdaPlus;
        }
        else if (this.range === lambdaRange.G) {
            let hessianPlusLambda = this.hessian.clone();
            hessianPlusLambda.addValueOnDiagonal(this.lambdaPlus);
            let choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessianPlusLambda);
            // If the factorization succeeds, then lambdaPlus is in L. Otherwise, lambdaPlus is in N
            if (choleskyDecomposition.success) {
                this.lambda.current = this.lambdaPlus;
            }
            else {
                this.lambda.lowerBound = Math.max(this.lambda.lowerBound, this.lambdaPlus);
                // Check lambda.lb for interior convergence ???
                this.lambda.current = updateLambda_using_equation_7_3_14(this.lambda.lowerBound, this.lambda.upperBound);
            }
        }
        else {
            this.lambda.current = updateLambda_using_equation_7_3_14(this.lambda.lowerBound, this.lambda.upperBound);
        }
    }
    /**
     * Returns the minimizer along the steepest descent (-gradient) direction subject to trust-region bound.
     * Note: If the gradient is a zero vector then the function returns a zero vector
     * @param trustRegionRadius The trust region radius
     * @return The minimizer vector deta x
     */
    computeCauchyPoint(trustRegionRadius) {
        // Bibliographic referece: Numerical Optimizatoin, second edition, Nocedal and Wright, p. 71-72
        const gHg = this.hessian.quadraticForm(this.gradient);
        const gNorm = MathVectorBasicOperations_1.norm(this.gradient);
        // return a zero step if the gradient is zero
        if (gNorm === 0) {
            return MathVectorBasicOperations_1.zeroVector(this.gradient.length);
        }
        let result = MathVectorBasicOperations_1.multiplyVectorByScalar(this.gradient, -trustRegionRadius / gNorm);
        if (gHg <= 0) {
            return result;
        }
        let tau = Math.pow(gNorm, 3) / trustRegionRadius / gHg;
        if (tau < 1) {
            return MathVectorBasicOperations_1.multiplyVectorByScalar(result, tau);
        }
        return result;
    }
    /**
     * Return an initial value, an upper bound and a lower bound for lambda.
     * @param trustRegionRadius The trust region radius
     * @return .current (lambda intial value) .lb (lower bound) and .ub (upper bound)
     */
    initialLambdas(trustRegionRadius) {
        // Bibliographic reference : Trust-Region Methods, Conn, Gould and Toint p. 192
        let gershgorin = gershgorin_bounds(this.hessian);
        let hessianFrobeniusNorm = frobeniusNorm(this.hessian);
        let hessianInfiniteNorm = 0;
        let minHessianDiagonal = this.hessian.get(0, 0);
        for (let i = 0; i < this.hessian.shape[0]; i += 1) {
            let tempInfiniteNorm = 0;
            for (let j = 0; j < this.hessian.shape[0]; j += 1) {
                tempInfiniteNorm += Math.abs(this.hessian.get(i, j));
            }
            hessianInfiniteNorm = Math.max(hessianInfiniteNorm, tempInfiniteNorm);
            minHessianDiagonal = Math.min(minHessianDiagonal, this.hessian.get(i, i));
        }
        let lowerBound = Math.max(0, Math.max(-minHessianDiagonal, MathVectorBasicOperations_1.norm(this.gradient) / trustRegionRadius - Math.min(gershgorin.upperBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm))));
        let upperBound = Math.max(0, MathVectorBasicOperations_1.norm(this.gradient) / trustRegionRadius + Math.min(-gershgorin.lowerBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm)));
        let lambda_initial;
        if (lowerBound === 0) {
            lambda_initial = 0;
        }
        else {
            lambda_initial = updateLambda_using_equation_7_3_14(lowerBound, upperBound);
        }
        return {
            current: lambda_initial,
            lowerBound: lowerBound,
            upperBound: upperBound
        };
    }
}
exports.TrustRegionSubproblem = TrustRegionSubproblem;
/**
 *
 * @param A
 * @param L
 * @param k
 * @return dela, vector
 * @throws If k < 0
 */
function singularLeadingSubmatrix(A, L, k) {
    if (k < 0) {
        throw new Error('k should not be a negative value');
    }
    let delta = 0;
    let l = new SquareMatrix_1.SquareMatrix(k);
    let v = [];
    let u = MathVectorBasicOperations_1.zeroVector(k);
    for (let j = 0; j < k - 1; j += 1) {
        delta += Math.pow(L.get(k - 1, j), 2);
    }
    delta -= A.get(k - 1, k - 1);
    for (let i = 0; i < k - 1; i += 1) {
        for (let j = 0; j <= i; j += 1) {
            l.set(i, j, L.get(i, j));
        }
        u[i] = L.get(k - 1, i);
    }
    v = MathVectorBasicOperations_1.zeroVector(A.shape[0]);
    v[k - 1] = 1;
    if (k !== 1) {
        let vtemp = solveLowerTriangular(l, u);
        for (let i = 0; i < k - 1; i += 1) {
            v[i] = vtemp[i];
        }
    }
    return {
        delta: delta,
        vector: v
    };
}
/**
 * Estimate the smallest singular value
 * @param lowerTriangular
 */
function estimateSmallestSingularValue(lowerTriangular) {
    // Bibliographic reference :  Golub, G. H., Van Loan, C. F. (2013), "Matrix computations". Forth Edition. JHU press. pp. 140-142.
    // Web reference: https://github.com/scipy/scipy/blob/master/scipy/optimize/_trustregion_exact.py
    const n = lowerTriangular.shape[0];
    let p = MathVectorBasicOperations_1.zeroVector(n);
    let y = MathVectorBasicOperations_1.zeroVector(n);
    let p_plus = [];
    let p_minus = [];
    for (let k = 0; k < n; k += 1) {
        let y_plus = (1 - p[k]) / lowerTriangular.get(k, k);
        let y_minus = (-1 - p[k]) / lowerTriangular.get(k, k);
        for (let i = k + 1; i < n; i += 1) {
            p_plus.push(p[i] + lowerTriangular.get(i, k) * y_plus);
            p_minus.push(p[i] + lowerTriangular.get(i, k) * y_minus);
        }
        if (Math.abs(y_plus) + MathVectorBasicOperations_1.norm1(p_plus) >= Math.abs(y_minus) + MathVectorBasicOperations_1.norm1(p_minus)) {
            y[k] = y_plus;
            for (let i = k + 1; i < n; i += 1) {
                p[i] = p_plus[i - k - 1];
            }
        }
        else {
            y[k] = y_minus;
            for (let i = k + 1; i < n; i += 1) {
                p[i] = p_minus[i - k - 1];
            }
        }
    }
    let v = solveUpperTriangular(lowerTriangular, y);
    let vNorm = MathVectorBasicOperations_1.norm(v);
    let yNorm = MathVectorBasicOperations_1.norm(y);
    if (vNorm === 0) {
        throw new Error("divideVectorByScalar division by zero");
    }
    return {
        value: yNorm / vNorm,
        vector: MathVectorBasicOperations_1.divideVectorByScalar(v, vNorm)
    };
}
/**
 * Solve the linear problem upper triangular matrix UT x = y
 * @param lowerTriangular The transpose of the upper triangular matrix
 * @param y The vector y
 */
function solveUpperTriangular(lowerTriangular, y) {
    let x = y.slice();
    const n = lowerTriangular.shape[0];
    // LT x = y
    for (let i = n - 1; i >= 0; i -= 1) {
        let sum = x[i];
        for (let k = i + 1; k < n; k += 1) {
            sum -= lowerTriangular.get(k, i) * x[k];
        }
        x[i] = sum / lowerTriangular.get(i, i);
    }
    return x;
}
/**
 * Solve the linear problem lower triangular matrix LT x = b
 * @param lowerTriangular The lower triangular matrix
 * @param b The vector b
 */
function solveLowerTriangular(lowerTriangular, b) {
    if (lowerTriangular.shape[0] !== b.length) {
        throw new Error('solveLowerTriangular: matrix and vector are not the same sizes');
    }
    let x = b.slice();
    const n = lowerTriangular.shape[0];
    // L x = b
    for (let i = 0; i < n; i += 1) {
        let sum = b[i];
        for (let k = i - 1; k >= 0; k -= 1) {
            sum -= lowerTriangular.get(i, k) * x[k];
        }
        x[i] = sum / lowerTriangular.get(i, i);
    }
    return x;
}
/**
 * The frobenius norm
 * @param matrix The matrix
 * @return The square root of the sum of every elements squared
 */
function frobeniusNorm(matrix) {
    let result = 0;
    const m = matrix.shape[0];
    const n = matrix.shape[1];
    for (let i = 0; i < m; i += 1) {
        for (let j = 0; j < n; j += 1) {
            result += Math.pow(matrix.get(i, j), 2);
        }
    }
    result = Math.sqrt(result);
    return result;
}
exports.frobeniusNorm = frobeniusNorm;
/**
* Given a symmetric matrix, compute the Gershgorin upper and lower bounds for its eigenvalues
* @param matrix Symmetric Matrix
* @return .lb (lower bound) and .ub (upper bound)
*/
function gershgorin_bounds(matrix) {
    // Bibliographic Reference : Trust-Region Methods, Conn, Gould and Toint p. 19
    // Gershgorin Bounds : All eigenvalues of a matrix A lie in the complex plane within the intersection
    // of n discs centered at a_(i, i) and of radii : sum of a_(i, j) for 1 ≤ i ≤ n and  j != i
    // When the matrix is symmetric, the eigenvalues are real and the discs become intervals on the real
    // line
    const m = matrix.shape[0];
    const n = matrix.shape[1];
    let matrixRowSums = [];
    for (let i = 0; i < m; i += 1) {
        let rowSum = 0;
        for (let j = 0; j < n; j += 1) {
            rowSum += Math.abs(matrix.get(i, j));
        }
        matrixRowSums.push(rowSum);
    }
    let matrixDiagonal = [];
    let matrixDiagonalAbsolute = [];
    for (let i = 0; i < m; i += 1) {
        matrixDiagonal.push(matrix.get(i, i));
        matrixDiagonalAbsolute.push(Math.abs(matrix.get(i, i)));
    }
    let lb = [];
    let ub = [];
    for (let i = 0; i < m; i += 1) {
        lb.push(matrixDiagonal[i] + matrixDiagonalAbsolute[i] - matrixRowSums[i]);
        ub.push(matrixDiagonal[i] - matrixDiagonalAbsolute[i] + matrixRowSums[i]);
    }
    let lowerBound = Math.min.apply(null, lb);
    let upperBound = Math.max.apply(null, ub);
    return {
        lowerBound: lowerBound,
        upperBound: upperBound
    };
}
exports.gershgorin_bounds = gershgorin_bounds;
/**
 * Solve the scalar quadratic equation ||z + t d|| == trust_radius
 * This is like a line-sphere intersection
 * @param z Vector
 * @param d Vector
 * @param trustRegionRadius
 * @returns The two values of t, sorted from low to high
 */
function getBoundariesIntersections(z, d, trustRegionRadius) {
    if (MathVectorBasicOperations_1.isZeroVector(d)) {
        throw new Error("In getBoundariesInstersections the d vector cannot be the zero vector");
    }
    const a = MathVectorBasicOperations_1.squaredNorm(d);
    const b = 2 * MathVectorBasicOperations_1.dotProduct(z, d);
    const c = MathVectorBasicOperations_1.squaredNorm(z) - trustRegionRadius * trustRegionRadius;
    const sqrtDiscriminant = Math.sqrt(b * b - 4 * a * c);
    let sign_b = MathVectorBasicOperations_1.sign(b);
    if (sign_b === 0) {
        sign_b = 1;
    }
    const aux = b + sqrtDiscriminant * sign_b;
    const ta = -aux / (2 * a);
    const tb = -2 * c / aux;
    return {
        tmin: Math.min(ta, tb),
        tmax: Math.max(ta, tb)
    };
}
exports.getBoundariesIntersections = getBoundariesIntersections;
function updateLambda_using_equation_7_3_14(lowerBound, upperBound, theta = 0.01) {
    // Bibliographic Reference: Trust-Region Methods, Conn, Gould and Toint p. 190
    return Math.max(Math.sqrt(upperBound * lowerBound), lowerBound + theta * (upperBound - lowerBound));
}


/***/ }),

/***/ "./src/views/AbstractObject3dShadowView.ts":
/*!*************************************************!*\
  !*** ./src/views/AbstractObject3dShadowView.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mat4_1 = __webpack_require__(/*! ../webgl/mat4 */ "./src/webgl/mat4.ts");
const mat3_1 = __webpack_require__(/*! ../webgl/mat3 */ "./src/webgl/mat3.ts");
const quat_1 = __webpack_require__(/*! ../webgl/quat */ "./src/webgl/quat.ts");
class AbstractObject3dShadowView {
    constructor(object3dShadowShaders, lightDirection) {
        this.object3dShadowShaders = object3dShadowShaders;
        this.lightDirection = lightDirection;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint16Array([]);
        this.orientation = new Float32Array([0, 0, 0, 1]);
        this.orientation = quat_1.setAxisAngle(new Float32Array([1, 0, 0]), -Math.PI / 2);
    }
    renderFrame() {
        let gl = this.object3dShadowShaders.gl, a_Position = gl.getAttribLocation(this.object3dShadowShaders.program, 'a_Position'), a_Normal = gl.getAttribLocation(this.object3dShadowShaders.program, 'a_Normal'), a_Color = gl.getAttribLocation(this.object3dShadowShaders.program, 'a_Color'), FSIZE = this.vertices.BYTES_PER_ELEMENT;
        gl.useProgram(this.object3dShadowShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 9, 0);
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 6);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Normal);
        gl.enableVertexAttribArray(a_Color);
        this.setUniforms();
        this.object3dShadowShaders.renderFrame(this.indices.length);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }
    initVertexBuffers(gl) {
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        let a_Position = gl.getAttribLocation(this.object3dShadowShaders.program, 'a_Position'), a_Normal = gl.getAttribLocation(this.object3dShadowShaders.program, 'a_Normal'), a_Color = gl.getAttribLocation(this.object3dShadowShaders.program, 'a_Color'), FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        if (a_Normal < 0) {
            console.log('Failed to get the storage location of a_Normal');
            return -1;
        }
        if (a_Color < 0) {
            console.log('Failed to get the storage location of a_Color');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 9, 0);
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 6);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Normal);
        gl.enableVertexAttribArray(a_Color);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    }
    updateBuffers() {
        const gl = this.object3dShadowShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    setUniforms() {
        const gl = this.object3dShadowShaders.gl;
        const translate1 = mat4_1.translate(mat4_1.identity_mat4(), new Float32Array([0, 0, 0]));
        //const translate2 = translate(identity_mat4(), new Float32Array([0, 0, 0]))
        //const model = multiply(translate2, multiply(fromQuat(this.orientation), translate1))
        const model = mat4_1.multiply(mat4_1.fromQuat(this.orientation), translate1);
        //const model = identity_mat4()
        const view = this.viewMatrix();
        const projection = this.projectionMatrix();
        const mv = mat4_1.multiply(view, model);
        const mvp = mat4_1.multiply(projection, mv);
        const ambientLoc = gl.getUniformLocation(this.object3dShadowShaders.program, "Ambient");
        const lightColorLoc = gl.getUniformLocation(this.object3dShadowShaders.program, "LightColor");
        const modelViewProjectionMatrixLoc = gl.getUniformLocation(this.object3dShadowShaders.program, "ModelViewProjectionMatrix");
        const normalMatrixLoc = gl.getUniformLocation(this.object3dShadowShaders.program, "NormalMatrix");
        const lightDirectionLoc = gl.getUniformLocation(this.object3dShadowShaders.program, "LightDirection");
        const halfVectorLoc = gl.getUniformLocation(this.object3dShadowShaders.program, "LightDirection");
        const shininessLoc = gl.getUniformLocation(this.object3dShadowShaders.program, "Shininess");
        const strengthLoc = gl.getUniformLocation(this.object3dShadowShaders.program, "Strength");
        gl.uniformMatrix4fv(modelViewProjectionMatrixLoc, false, mvp);
        gl.uniformMatrix3fv(normalMatrixLoc, false, mat3_1.mat4_to_mat3(mv));
        gl.uniform3f(lightDirectionLoc, this.lightDirection[0], this.lightDirection[1], this.lightDirection[2]);
        gl.uniform3f(lightColorLoc, 1, 1, 1);
        gl.uniform3f(ambientLoc, 0.5, 0.5, 0.5);
        const hvX = this.lightDirection[0];
        const hvY = this.lightDirection[1];
        const hvZ = this.lightDirection[2] + 1;
        const norm = Math.sqrt(hvX * hvX + hvY * hvY + hvZ * hvZ);
        gl.uniform3f(halfVectorLoc, hvX / norm, hvY / norm, hvZ / norm);
        gl.uniform1f(shininessLoc, 50);
        gl.uniform1f(strengthLoc, 20);
    }
    viewMatrix() {
        const camera_position = new Float32Array([0, 0, 3.3]);
        const look_at_origin = new Float32Array([0, -0.2, 0]);
        const head_is_up = new Float32Array([0, 1, 0]);
        return mat4_1.lookAt(camera_position, look_at_origin, head_is_up);
    }
    projectionMatrix() {
        const fovy = 20 * Math.PI / 180;
        const canvas = this.object3dShadowShaders.gl.canvas;
        const rect = canvas.getBoundingClientRect();
        return mat4_1.perspective(fovy, rect.width / rect.height, 0.01, 20);
    }
}
exports.AbstractObject3dShadowView = AbstractObject3dShadowView;


/***/ }),

/***/ "./src/views/AbstractObject3dView.ts":
/*!*******************************************!*\
  !*** ./src/views/AbstractObject3dView.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mat4_1 = __webpack_require__(/*! ../webgl/mat4 */ "./src/webgl/mat4.ts");
const mat3_1 = __webpack_require__(/*! ../webgl/mat3 */ "./src/webgl/mat3.ts");
const quat_1 = __webpack_require__(/*! ../webgl/quat */ "./src/webgl/quat.ts");
const Vector3d_1 = __webpack_require__(/*! ../mathVector/Vector3d */ "./src/mathVector/Vector3d.ts");
const SquareMatrix_1 = __webpack_require__(/*! ../linearAlgebra/SquareMatrix */ "./src/linearAlgebra/SquareMatrix.ts");
class AbstractObject3dView {
    constructor(object3dShaders, lightDirection) {
        this.object3dShaders = object3dShaders;
        this.lightDirection = lightDirection;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint16Array([]);
        this.orientation = new Float32Array([0, 0, 0, 1]);
        this.camera_position = new Float32Array([0, 0, 3.3]);
        this.look_at_origin = new Float32Array([0, -0.2, 0]);
        //private look_at_origin = new Float32Array([0, 0, 0])
        this.head_is_up = new Float32Array([0, 1, 0]);
        this.fovy = 20 * Math.PI / 180;
        this.orientation = quat_1.setAxisAngle(new Float32Array([1, 0, 0]), -Math.PI / 2);
        //this.orientation = setAxisAngle(new Float32Array([1, 0, 0]), 0)
    }
    renderFrame() {
        let gl = this.object3dShaders.gl, a_Position = gl.getAttribLocation(this.object3dShaders.program, 'a_Position'), a_Normal = gl.getAttribLocation(this.object3dShaders.program, 'a_Normal'), a_Color = gl.getAttribLocation(this.object3dShaders.program, 'a_Color'), FSIZE = this.vertices.BYTES_PER_ELEMENT;
        gl.useProgram(this.object3dShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 9, 0);
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 6);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Normal);
        gl.enableVertexAttribArray(a_Color);
        this.setUniforms();
        this.object3dShaders.renderFrame(this.indices.length);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }
    initVertexBuffers(gl) {
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        let a_Position = gl.getAttribLocation(this.object3dShaders.program, 'a_Position'), a_Normal = gl.getAttribLocation(this.object3dShaders.program, 'a_Normal'), a_Color = gl.getAttribLocation(this.object3dShaders.program, 'a_Color'), FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        if (a_Normal < 0) {
            console.log('Failed to get the storage location of a_Normal');
            return -1;
        }
        if (a_Color < 0) {
            console.log('Failed to get the storage location of a_Color');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 9, 0);
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 9, FSIZE * 6);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Normal);
        gl.enableVertexAttribArray(a_Color);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    }
    updateBuffers() {
        const gl = this.object3dShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    getModelTransformationMatrix() {
        const model = mat4_1.fromQuat(this.orientation);
        const m = [model[0], model[4], model[8], model[1], model[5], model[9], model[2], model[6], model[10]];
        return new SquareMatrix_1.SquareMatrix(3, m);
    }
    setUniforms() {
        const gl = this.object3dShaders.gl;
        const translate1 = mat4_1.translate(mat4_1.identity_mat4(), new Float32Array([0, 0, 0]));
        const model = mat4_1.multiply(mat4_1.fromQuat(this.orientation), translate1);
        const view = this.viewMatrix();
        const projection = this.projectionMatrix();
        const mv = mat4_1.multiply(view, model);
        const mvp = mat4_1.multiply(projection, mv);
        const ambientLoc = gl.getUniformLocation(this.object3dShaders.program, "Ambient");
        const lightColorLoc = gl.getUniformLocation(this.object3dShaders.program, "LightColor");
        const modelViewProjectionMatrixLoc = gl.getUniformLocation(this.object3dShaders.program, "ModelViewProjectionMatrix");
        const normalMatrixLoc = gl.getUniformLocation(this.object3dShaders.program, "NormalMatrix");
        const lightDirectionLoc = gl.getUniformLocation(this.object3dShaders.program, "LightDirection");
        const halfVectorLoc = gl.getUniformLocation(this.object3dShaders.program, "LightDirection");
        const shininessLoc = gl.getUniformLocation(this.object3dShaders.program, "Shininess");
        const strengthLoc = gl.getUniformLocation(this.object3dShaders.program, "Strength");
        gl.uniformMatrix4fv(modelViewProjectionMatrixLoc, false, mvp);
        gl.uniformMatrix3fv(normalMatrixLoc, false, mat3_1.mat4_to_mat3(mv));
        gl.uniform3f(lightDirectionLoc, this.lightDirection[0], this.lightDirection[1], this.lightDirection[2]);
        gl.uniform3f(lightColorLoc, 1, 1, 1);
        gl.uniform3f(ambientLoc, 0.1, 0.1, 0.1);
        const hvX = this.lightDirection[0];
        const hvY = this.lightDirection[1];
        const hvZ = this.lightDirection[2] + 1;
        const norm = Math.sqrt(hvX * hvX + hvY * hvY + hvZ * hvZ);
        gl.uniform3f(halfVectorLoc, hvX / norm, hvY / norm, hvZ / norm);
        gl.uniform1f(shininessLoc, 50);
        gl.uniform1f(strengthLoc, 20);
    }
    viewMatrix() {
        return mat4_1.lookAt(this.camera_position, this.look_at_origin, this.head_is_up);
    }
    projectionMatrix() {
        const canvas = this.object3dShaders.gl.canvas;
        const rect = canvas.getBoundingClientRect();
        return mat4_1.perspective(this.fovy, rect.width / rect.height, 0.01, 20);
    }
    pickingLine(ndcX, ndcY) {
        //https://jsantell.com/model-view-projection/
        const canvas = this.object3dShaders.gl.canvas;
        const rect = canvas.getBoundingClientRect();
        const p1 = new Vector3d_1.Vector3d(this.camera_position[0], this.camera_position[1], this.camera_position[2]);
        const pOrigin = new Vector3d_1.Vector3d(this.look_at_origin[0], this.look_at_origin[1], this.look_at_origin[2]);
        const v1 = pOrigin.substract(p1);
        const v2 = new Vector3d_1.Vector3d(this.head_is_up[0], this.head_is_up[1], this.head_is_up[2]);
        const v3 = (v1).crossPoduct(v2);
        const top = v1.axisAngleRotation(v3, this.fovy / 2);
        const bottom = v1.axisAngleRotation(v3, -this.fovy / 2);
        const center = top.add(bottom).multiply(0.5);
        const right = v1.axisAngleRotation(v2, -this.fovy / 2);
        const v4 = right.substract(center).multiply(ndcX * rect.width / rect.height);
        const v5 = top.substract(center).multiply(ndcY);
        const p2 = v4.add(v5).add(center).add(p1);
        return { p1: p1, p2: p2 };
    }
    distanceToCamera(point) {
        const p1 = this.getCameraPosition();
        const pOrigin = new Vector3d_1.Vector3d(this.look_at_origin[0], this.look_at_origin[1], this.look_at_origin[2]);
        const v1 = pOrigin.substract(p1);
        // returns null if the point is behind the camera
        if ((point.substract(p1)).dot(v1) < 0) {
            return null;
        }
        return point.substract(p1).norm();
    }
    getCameraPosition() {
        return new Vector3d_1.Vector3d(this.camera_position[0], this.camera_position[1], this.camera_position[2]);
    }
    getLookAtOrigin() {
        return new Vector3d_1.Vector3d(this.look_at_origin[0], this.look_at_origin[1], this.look_at_origin[2]);
    }
}
exports.AbstractObject3dView = AbstractObject3dView;


/***/ }),

/***/ "./src/views/ArrayConversion.ts":
/*!**************************************!*\
  !*** ./src/views/ArrayConversion.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function toFloat32Array(v) {
    let result = new Float32Array(v.length);
    for (let i = 0; i < v.length; i += 1) {
        result[i] = v[i];
    }
    return result;
}
exports.toFloat32Array = toFloat32Array;
function toUint16Array(v) {
    let result = new Uint16Array(v.length);
    for (let i = 0; i < v.length; i += 1) {
        result[i] = v[i];
    }
    return result;
}
exports.toUint16Array = toUint16Array;


/***/ }),

/***/ "./src/views/ControlPoints3dShadowView.ts":
/*!************************************************!*\
  !*** ./src/views/ControlPoints3dShadowView.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const ArrayConversion_1 = __webpack_require__(/*! ./ArrayConversion */ "./src/views/ArrayConversion.ts");
const AbstractObject3dShadowView_1 = __webpack_require__(/*! ./AbstractObject3dShadowView */ "./src/views/AbstractObject3dShadowView.ts");
const ControlPoints3dView_1 = __webpack_require__(/*! ./ControlPoints3dView */ "./src/views/ControlPoints3dView.ts");
class ControlPoints3dShadowView extends AbstractObject3dShadowView_1.AbstractObject3dShadowView {
    constructor(spline, object3dShadowShaders, lightDirection) {
        super(object3dShadowShaders, lightDirection);
        this.spline = spline;
        this.updateVerticesAndIndices();
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShadowShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    updateVerticesAndIndices() {
        const radius = 0.015;
        const sectorCount = 50;
        const stackCount = 50;
        let vertices = [];
        let indices = [];
        let startingIndex = 0;
        for (let cp of this.spline.controlPoints) {
            let v = ControlPoints3dView_1.verticesForOneSphere(cp, radius, sectorCount, stackCount, { red: 0.5, green: 0.5, blue: 0.5 });
            let i = ControlPoints3dView_1.indicesForOneSphere(startingIndex, sectorCount, stackCount);
            vertices = [...vertices, ...v];
            indices = [...indices, ...i];
            startingIndex += v.length / 9;
        }
        this.vertices = ArrayConversion_1.toFloat32Array(vertices);
        this.indices = ArrayConversion_1.toUint16Array(indices);
    }
    update(spline) {
        this.spline = spline;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
}
exports.ControlPoints3dShadowView = ControlPoints3dShadowView;


/***/ }),

/***/ "./src/views/ControlPoints3dView.ts":
/*!******************************************!*\
  !*** ./src/views/ControlPoints3dView.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const ArrayConversion_1 = __webpack_require__(/*! ./ArrayConversion */ "./src/views/ArrayConversion.ts");
const Vector3d_1 = __webpack_require__(/*! ../mathVector/Vector3d */ "./src/mathVector/Vector3d.ts");
const AbstractObject3dView_1 = __webpack_require__(/*! ./AbstractObject3dView */ "./src/views/AbstractObject3dView.ts");
const LUSolve_1 = __webpack_require__(/*! ../linearAlgebra/LUSolve */ "./src/linearAlgebra/LUSolve.ts");
class ControlPoints3dView extends AbstractObject3dView_1.AbstractObject3dView {
    constructor(spline, object3dShaders, lightDirection) {
        super(object3dShaders, lightDirection);
        this.spline = spline;
        this.selectedControlPoint = null;
        this.updateVerticesAndIndices();
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    updateVerticesAndIndices() {
        const radius = 0.015;
        const sectorCount = 50;
        const stackCount = 50;
        let vertices = [];
        let indices = [];
        let startingIndex = 0;
        for (let i = 0; i < this.spline.controlPoints.length; i += 1) {
            let v;
            if (i === this.selectedControlPoint) {
                v = verticesForOneSphere(this.spline.controlPoints[i], radius, sectorCount, stackCount, { red: 0.7, green: 0.7, blue: 0.7 });
            }
            else {
                v = verticesForOneSphere(this.spline.controlPoints[i], radius, sectorCount, stackCount, { red: 0.5, green: 0.5, blue: 0.5 });
            }
            let ind = indicesForOneSphere(startingIndex, sectorCount, stackCount);
            vertices = [...vertices, ...v];
            indices = [...indices, ...ind];
            startingIndex += v.length / 9;
        }
        this.vertices = ArrayConversion_1.toFloat32Array(vertices);
        this.indices = ArrayConversion_1.toUint16Array(indices);
    }
    updateVerticesIndicesAndBuffers() {
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    update(spline) {
        this.spline = spline;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    controlPointSelection(x, y, deltaSquared = 0.01) {
        let result = null;
        let previousDistance = null;
        const l = this.pickingLine(x, y);
        for (let i = 0; i < this.spline.controlPoints.length; i += 1) {
            const m = this.getModelTransformationMatrix();
            const cp = this.spline.controlPoints[i];
            const v = m.multiplyByVector([cp.x, cp.y, cp.z]);
            const p = new Vector3d_1.Vector3d(v[0], v[1], v[2]);
            if (Vector3d_1.pointLineDistance(p, l.p1, l.p2) < deltaSquared) {
                let d = this.distanceToCamera(p);
                if (d !== null) {
                    if (previousDistance === null || d < previousDistance) {
                        result = i;
                        previousDistance = d;
                    }
                }
            }
        }
        return result;
    }
    getSelectedControlPoint() {
        return this.selectedControlPoint;
    }
    setSelected(controlPointIndex) {
        this.selectedControlPoint = controlPointIndex;
    }
    computeNewPosition(ndcX, ndcY) {
        let result = null;
        if (this.selectedControlPoint !== null) {
            const m = this.getModelTransformationMatrix();
            const cp = this.spline.controlPoints[this.selectedControlPoint];
            const v = m.multiplyByVector([cp.x, cp.y, cp.z]);
            const p = new Vector3d_1.Vector3d(v[0], v[1], v[2]);
            const l = this.pickingLine(ndcX, ndcY);
            let pp = Vector3d_1.linePlaneIntersection(l.p1, l.p2, this.getLookAtOrigin(), this.getCameraPosition(), p);
            let point = LUSolve_1.lusolve(m, [pp.x, pp.y, pp.z]);
            if (point !== undefined) {
                result = new Vector3d_1.Vector3d(point[0], point[1], point[2]);
            }
        }
        return result;
    }
}
exports.ControlPoints3dView = ControlPoints3dView;
function verticesForOneSphere(center, radius, sectorCount, stackCount, color) {
    //http://www.songho.ca/opengl/gl_sphere.html
    let x, y, z, xy; // vertex position
    let nx, ny, nz; // vertex normal
    let sectorAngle, stackAngle;
    const lengthInv = 1 / radius;
    const sectorStep = 2 * Math.PI / sectorCount;
    const stackStep = Math.PI / stackCount;
    let result = [];
    for (let i = 0; i <= stackCount; i += 1) {
        stackAngle = Math.PI / 2 - i * stackStep; // starting from pi/2 to -pi/2
        xy = radius * Math.cos(stackAngle);
        z = radius * Math.sin(stackAngle);
        // add (sectorCout+1) vertices per stack
        // the first and last vertices have the same position and normal
        for (let j = 0; j <= sectorCount; j += 1) {
            sectorAngle = j * sectorStep; // starting for 0 to 2pi
            // vertex position (x, y, z)
            x = xy * Math.cos(sectorAngle); // r * cos(u) * cos(v)
            y = xy * Math.sin(sectorAngle); // r * cos(u) * sin(v)
            result.push(x + center.x);
            result.push(y + center.y);
            result.push(z + center.z);
            // normalized vertex normal (nx, ny, nz)
            nx = x * lengthInv;
            ny = y * lengthInv;
            nz = z * lengthInv;
            result.push(nx);
            result.push(ny);
            result.push(nz);
            // Color
            result.push(color.red);
            result.push(color.green);
            result.push(color.blue);
        }
    }
    return result;
}
exports.verticesForOneSphere = verticesForOneSphere;
function indicesForOneSphere(startingIndex, sectorCount, stackCount) {
    let result = [];
    for (let i = 0; i < stackCount; i += 1) {
        let k1 = i * (sectorCount + 1); // beginning of current stack
        let k2 = k1 + sectorCount + 1; // beginning of next stack
        for (let j = 0; j < sectorCount; j += 1, k1 += 1, k2 += 1) {
            if (i != 0) {
                result.push(k1 + startingIndex);
                result.push(k2 + startingIndex);
                result.push(k1 + 1 + startingIndex);
            }
            if (i != (stackCount - 1)) {
                result.push(k1 + 1 + startingIndex);
                result.push(k2 + startingIndex);
                result.push(k2 + 1 + startingIndex);
            }
        }
    }
    return result;
}
exports.indicesForOneSphere = indicesForOneSphere;


/***/ }),

/***/ "./src/views/ControlPointsShaders.ts":
/*!*******************************************!*\
  !*** ./src/views/ControlPointsShaders.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
class ControlPointsShaders {
    constructor(gl) {
        this.gl = gl;
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'attribute vec2 a_Texture; \n' +
            'attribute vec3 a_Color; \n' +
            'varying vec2 v_Texture; \n' +
            'varying vec3 v_Color; \n' +
            'void main() {\n' +
            '    v_Texture = a_Texture; \n' +
            '    v_Color = a_Color; \n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision highp float; \n' +
            '//uniform bool selected; \n' +
            'varying vec2 v_Texture; \n' +
            'varying vec3 v_Color; \n' +
            'void main() {\n' +
            '     vec4 fColor = vec4(0.1, 0.1, 0.1, 0.0); \n' +
            '     float dist = distance(v_Texture, vec2(0.0, 0.0)); \n' +
            '     vec4 color1 = vec4(v_Color, 0.35); \n' +
            '     vec4 color2 = vec4(v_Color, 0.9); \n' +
            '     float delta = 0.1; \n' +
            '     float alpha1 = smoothstep(0.35-delta, 0.35, dist); \n' +
            '     float alpha2 = smoothstep(0.65-delta, 0.65, dist); \n' +
            '     vec4 fColor1 = mix(color1, fColor, alpha1); \n' +
            '     vec4 fColor2 = mix(color2, fColor, alpha2); \n' +
            '     gl_FragColor = (fColor1+fColor2)/2.0; \n' +
            '}\n';
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    renderFrame(numberOfElements, selectedControlPoint) {
        if (this.program) {
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
            if (selectedControlPoint != -1 && selectedControlPoint !== null) {
                this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_BYTE, selectedControlPoint * 6);
            }
        }
    }
}
exports.ControlPointsShaders = ControlPointsShaders;


/***/ }),

/***/ "./src/views/ControlPointsView.ts":
/*!****************************************!*\
  !*** ./src/views/ControlPointsView.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ControlPointsView {
    constructor(spline, controlPointsShaders, red, blue, green) {
        this.controlPointsShaders = controlPointsShaders;
        this.red = red;
        this.blue = blue;
        this.green = green;
        this.z = 0;
        this.selectedControlPoint = null;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        this.controlPoints = spline.freeControlPoints;
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.controlPointsShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    updateVerticesAndIndices() {
        const size = 0.03;
        this.vertices = new Float32Array(this.controlPoints.length * 32);
        this.indices = new Uint8Array(this.controlPoints.length * 6);
        for (let i = 0; i < this.controlPoints.length; i += 1) {
            let x = this.controlPoints[i].x;
            let y = this.controlPoints[i].y;
            this.vertices[32 * i] = x - size;
            this.vertices[32 * i + 1] = y - size;
            this.vertices[32 * i + 2] = this.z;
            this.vertices[32 * i + 3] = -1;
            this.vertices[32 * i + 4] = -1;
            this.vertices[32 * i + 5] = this.red;
            this.vertices[32 * i + 6] = this.green;
            this.vertices[32 * i + 7] = this.blue;
            this.vertices[32 * i + 8] = x + size;
            this.vertices[32 * i + 9] = y - size;
            this.vertices[32 * i + 10] = this.z;
            this.vertices[32 * i + 11] = 1;
            this.vertices[32 * i + 12] = -1;
            this.vertices[32 * i + 13] = this.red;
            this.vertices[32 * i + 14] = this.green;
            this.vertices[32 * i + 15] = this.blue;
            this.vertices[32 * i + 16] = x + size;
            this.vertices[32 * i + 17] = y + size;
            this.vertices[32 * i + 18] = this.z;
            this.vertices[32 * i + 19] = 1;
            this.vertices[32 * i + 20] = 1;
            this.vertices[32 * i + 21] = this.red;
            this.vertices[32 * i + 22] = this.green;
            this.vertices[32 * i + 23] = this.blue;
            this.vertices[32 * i + 24] = x - size;
            this.vertices[32 * i + 25] = y + size;
            this.vertices[32 * i + 26] = this.z;
            this.vertices[32 * i + 27] = -1;
            this.vertices[32 * i + 28] = 1;
            this.vertices[32 * i + 29] = this.red;
            this.vertices[32 * i + 30] = this.green;
            this.vertices[32 * i + 31] = this.blue;
            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    }
    initVertexBuffers(gl) {
        this.updateVerticesAndIndices();
        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        let a_Position = gl.getAttribLocation(this.controlPointsShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.controlPointsShaders.program, 'a_Texture'), a_Color = gl.getAttribLocation(this.controlPointsShaders.program, 'a_Color'), FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        if (a_Texture < 0) {
            console.log('Failed to get the storage location of a_Texture');
            return -1;
        }
        if (a_Color < 0) {
            console.log('Failed to get the storage location of a_Color');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.enableVertexAttribArray(a_Color);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    }
    renderFrame() {
        let gl = this.controlPointsShaders.gl, a_Position = gl.getAttribLocation(this.controlPointsShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.controlPointsShaders.program, 'a_Texture'), a_Color = gl.getAttribLocation(this.controlPointsShaders.program, 'a_Color'), FSIZE = this.vertices.BYTES_PER_ELEMENT;
        gl.useProgram(this.controlPointsShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.enableVertexAttribArray(a_Color);
        this.controlPointsShaders.renderFrame(this.indices.length, this.selectedControlPoint);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }
    controlPointSelection(x, y, deltaSquared = 0.01) {
        let result = null;
        for (let i = 0; i < this.controlPoints.length; i += 1) {
            if (Math.pow(x - this.controlPoints[i].x, 2) + Math.pow(y - this.controlPoints[i].y, 2) < deltaSquared) {
                return i;
            }
        }
        return result;
    }
    update(spline) {
        this.controlPoints = spline.freeControlPoints;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    updatePoints(points) {
        this.controlPoints = points;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    updateBuffers() {
        var gl = this.controlPointsShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    getSelectedControlPoint() {
        return this.selectedControlPoint;
    }
    setSelected(controlPointIndex) {
        this.selectedControlPoint = controlPointIndex;
    }
}
exports.ControlPointsView = ControlPointsView;


/***/ }),

/***/ "./src/views/ControlPolygon3dShadowView.ts":
/*!*************************************************!*\
  !*** ./src/views/ControlPolygon3dShadowView.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const ArrayConversion_1 = __webpack_require__(/*! ./ArrayConversion */ "./src/views/ArrayConversion.ts");
const AbstractObject3dShadowView_1 = __webpack_require__(/*! ./AbstractObject3dShadowView */ "./src/views/AbstractObject3dShadowView.ts");
const ControlPolygon3dView_1 = __webpack_require__(/*! ./ControlPolygon3dView */ "./src/views/ControlPolygon3dView.ts");
class ControlPolygon3dShadowView extends AbstractObject3dShadowView_1.AbstractObject3dShadowView {
    constructor(spline, object3dShadowShaders, lightDirection, closed) {
        super(object3dShadowShaders, lightDirection);
        this.closed = closed;
        this.controlPoints = spline.freeControlPoints;
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.updateVerticesAndIndices();
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShadowShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    updateVerticesAndIndices() {
        const radius = 0.003;
        const sectorCount = 20;
        let vertices = [];
        let indices = [];
        let startingIndex = 0;
        for (let i = 0; i < this.controlPoints.length - 1; i += 1) {
            let v = ControlPolygon3dView_1.verticesForOneCylinder(this.controlPoints[i], this.controlPoints[i + 1], radius, sectorCount);
            let ind = ControlPolygon3dView_1.indicesForOneCylinder(startingIndex, sectorCount);
            vertices = [...vertices, ...v];
            indices = [...indices, ...ind];
            startingIndex += v.length / 9;
        }
        this.vertices = ArrayConversion_1.toFloat32Array(vertices);
        this.indices = ArrayConversion_1.toUint16Array(indices);
    }
    update(spline) {
        this.controlPoints = spline.freeControlPoints;
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
}
exports.ControlPolygon3dShadowView = ControlPolygon3dShadowView;


/***/ }),

/***/ "./src/views/ControlPolygon3dView.ts":
/*!*******************************************!*\
  !*** ./src/views/ControlPolygon3dView.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const ArrayConversion_1 = __webpack_require__(/*! ./ArrayConversion */ "./src/views/ArrayConversion.ts");
const Vector3d_1 = __webpack_require__(/*! ../mathVector/Vector3d */ "./src/mathVector/Vector3d.ts");
const RotationMatrix_1 = __webpack_require__(/*! ../mathVector/RotationMatrix */ "./src/mathVector/RotationMatrix.ts");
const AbstractObject3dView_1 = __webpack_require__(/*! ./AbstractObject3dView */ "./src/views/AbstractObject3dView.ts");
class ControlPolygon3dView extends AbstractObject3dView_1.AbstractObject3dView {
    constructor(spline, object3dShaders, lightDirection, closed) {
        super(object3dShaders, lightDirection);
        this.closed = closed;
        this.controlPoints = spline.freeControlPoints;
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.updateVerticesAndIndices();
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    updateVerticesAndIndices() {
        const radius = 0.003;
        const sectorCount = 20;
        let vertices = [];
        let indices = [];
        let startingIndex = 0;
        for (let i = 0; i < this.controlPoints.length - 1; i += 1) {
            let v = verticesForOneCylinder(this.controlPoints[i], this.controlPoints[i + 1], radius, sectorCount);
            let ind = indicesForOneCylinder(startingIndex, sectorCount);
            vertices = [...vertices, ...v];
            indices = [...indices, ...ind];
            startingIndex += v.length / 9;
        }
        this.vertices = ArrayConversion_1.toFloat32Array(vertices);
        this.indices = ArrayConversion_1.toUint16Array(indices);
    }
    update(spline) {
        this.controlPoints = spline.freeControlPoints;
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
}
exports.ControlPolygon3dView = ControlPolygon3dView;
function verticesForOneCylinder(centerTop, centerBottom, radius, sectorCount) {
    let axisVector = centerTop.substract(centerBottom).normalize();
    const circleTop = orientedCircle(centerTop, radius, axisVector, sectorCount);
    const circleBottom = orientedCircle(centerBottom, radius, axisVector, sectorCount);
    let result = [];
    for (let i = 0; i < circleTop.vertices.length; i += 1) {
        // vertex position (x, y, z)
        result.push(circleTop.vertices[i].x);
        result.push(circleTop.vertices[i].y);
        result.push(circleTop.vertices[i].z);
        // normalized vertex normal (nx, ny, nz)
        result.push(circleTop.normals[i].x);
        result.push(circleTop.normals[i].y);
        result.push(circleTop.normals[i].z);
        // Color
        result.push(0.5);
        result.push(0.5);
        result.push(0.5);
    }
    for (let i = 0; i < circleBottom.vertices.length; i += 1) {
        // vertex position (x, y, z)
        result.push(circleBottom.vertices[i].x);
        result.push(circleBottom.vertices[i].y);
        result.push(circleBottom.vertices[i].z);
        // normalized vertex normal (nx, ny, nz)
        result.push(circleBottom.normals[i].x);
        result.push(circleBottom.normals[i].y);
        result.push(circleBottom.normals[i].z);
        // Color
        result.push(0.8);
        result.push(0.8);
        result.push(0.8);
    }
    return result;
}
exports.verticesForOneCylinder = verticesForOneCylinder;
function orientedCircle(center, radius, axisVector, sectorCount) {
    const n = axisVector.dot(new Vector3d_1.Vector3d(0, 0, 1));
    const sectorStep = 2 * Math.PI / sectorCount;
    let vertices = [];
    let normals = [];
    if (n > 0) {
        const rotationMatrix = RotationMatrix_1.rotationMatrixFromTwoVectors(new Vector3d_1.Vector3d(0, 0, 1), axisVector);
        for (let j = 0; j <= sectorCount; j += 1) {
            let sectorAngle = j * sectorStep; // starting for 0 to 2pi
            // cicle in the plane xy 
            let x = radius * Math.cos(sectorAngle);
            let y = radius * Math.sin(sectorAngle);
            let v = rotationMatrix.multiplyByVector([x, y, 0]);
            vertices.push(new Vector3d_1.Vector3d(v[0] + center.x, v[1] + center.y, v[2] + center.z));
            let nx = Math.cos(sectorAngle);
            let ny = Math.sin(sectorAngle);
            let nv = rotationMatrix.multiplyByVector([nx, ny, 0]);
            normals.push(new Vector3d_1.Vector3d(nv[0], nv[1], nv[2]));
        }
    }
    else {
        const rotationMatrix = RotationMatrix_1.rotationMatrixFromTwoVectors(new Vector3d_1.Vector3d(0, 1, 0), axisVector);
        for (let j = 0; j <= sectorCount; j += 1) {
            let sectorAngle = j * sectorStep; // starting for 0 to 2pi
            // cicle in the plane xz 
            let x = radius * Math.cos(sectorAngle);
            let z = radius * Math.sin(sectorAngle);
            let v = rotationMatrix.multiplyByVector([x, 0, z]);
            vertices.push(new Vector3d_1.Vector3d(v[0] + center.x, v[1] + center.y, v[2] + center.z));
            let nx = Math.cos(sectorAngle);
            let nz = Math.sin(sectorAngle);
            let nv = rotationMatrix.multiplyByVector([nx, 0, nz]);
            normals.push(new Vector3d_1.Vector3d(nv[0], nv[1], nv[2]));
        }
    }
    return { vertices: vertices, normals: normals };
}
exports.orientedCircle = orientedCircle;
function indicesForOneCylinder(startingIndex, sectorCount) {
    let result = [];
    let k1 = 0; // beginning of current stack
    let k2 = k1 + sectorCount + 1; // beginning of next stack
    for (let j = 0; j < sectorCount; j += 1, k1 += 1, k2 += 1) {
        result.push(k1 + startingIndex);
        result.push(k2 + startingIndex);
        result.push(k1 + 1 + startingIndex);
        result.push(k1 + 1 + startingIndex);
        result.push(k2 + startingIndex);
        result.push(k2 + 1 + startingIndex);
    }
    return result;
}
exports.indicesForOneCylinder = indicesForOneCylinder;


/***/ }),

/***/ "./src/views/ControlPolygonShaders.ts":
/*!********************************************!*\
  !*** ./src/views/ControlPolygonShaders.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
class ControlPolygonShaders {
    constructor(gl) {
        this.gl = gl;
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'void main() {\n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision mediump float; \n' +
            'uniform vec4 fColor; \n' +
            'void main() {\n' +
            '    gl_FragColor = fColor; \n' +
            '}\n';
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    renderFrame(numberOfElements) {
        this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
    }
}
exports.ControlPolygonShaders = ControlPolygonShaders;


/***/ }),

/***/ "./src/views/ControlPolygonView.ts":
/*!*****************************************!*\
  !*** ./src/views/ControlPolygonView.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ControlPolygonView {
    constructor(spline, controlPolygonShaders, closed, red, green, blue, alpha) {
        this.controlPolygonShaders = controlPolygonShaders;
        this.closed = closed;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.z = 0;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        this.controlPoints = spline.freeControlPoints;
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.controlPolygonShaders = controlPolygonShaders;
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.controlPolygonShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    set isClosed(bool) {
        this.closed = bool;
    }
    updateVerticesAndIndices() {
        const thickness = 0.003;
        this.vertices = new Float32Array(this.controlPoints.length * 12);
        this.indices = new Uint8Array(this.controlPoints.length * 6);
        for (let i = 0; i < this.controlPoints.length - 1; i += 1) {
            const normal = this.controlPoints[i + 1].substract(this.controlPoints[i]).normalize().rotate90degrees();
            this.vertices[12 * i] = this.controlPoints[i].x - thickness * normal.x;
            this.vertices[12 * i + 1] = this.controlPoints[i].y - thickness * normal.y;
            this.vertices[12 * i + 2] = this.z;
            this.vertices[12 * i + 3] = this.controlPoints[i + 1].x - thickness * normal.x;
            this.vertices[12 * i + 4] = this.controlPoints[i + 1].y - thickness * normal.y;
            this.vertices[12 * i + 5] = this.z;
            this.vertices[12 * i + 6] = this.controlPoints[i + 1].x + thickness * normal.x;
            this.vertices[12 * i + 7] = this.controlPoints[i + 1].y + thickness * normal.y;
            this.vertices[12 * i + 8] = this.z;
            this.vertices[12 * i + 9] = this.controlPoints[i].x + thickness * normal.x;
            this.vertices[12 * i + 10] = this.controlPoints[i].y + thickness * normal.y;
            this.vertices[12 * i + 11] = this.z;
            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    }
    initVertexBuffers(gl) {
        this.updateVerticesAndIndices();
        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        let a_Position = gl.getAttribLocation(this.controlPolygonShaders.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    }
    renderFrame() {
        const gl = this.controlPolygonShaders.gl;
        const a_Position = gl.getAttribLocation(this.controlPolygonShaders.program, 'a_Position');
        const fColorLocation = gl.getUniformLocation(this.controlPolygonShaders.program, "fColor");
        gl.useProgram(this.controlPolygonShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.uniform4f(fColorLocation, this.red, this.green, this.blue, this.alpha);
        this.controlPolygonShaders.renderFrame(this.indices.length);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }
    update(message) {
        this.controlPoints = message.freeControlPoints;
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    updateBuffers() {
        const gl = this.controlPolygonShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
exports.ControlPolygonView = ControlPolygonView;


/***/ }),

/***/ "./src/views/CurvatureExtrema3dView.ts":
/*!*********************************************!*\
  !*** ./src/views/CurvatureExtrema3dView.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const ArrayConversion_1 = __webpack_require__(/*! ./ArrayConversion */ "./src/views/ArrayConversion.ts");
const AbstractObject3dView_1 = __webpack_require__(/*! ./AbstractObject3dView */ "./src/views/AbstractObject3dView.ts");
const BSplineR1toR3DifferentialProperties_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR3DifferentialProperties */ "./src/bsplines/BSplineR1toR3DifferentialProperties.ts");
const ControlPoints3dView_1 = __webpack_require__(/*! ./ControlPoints3dView */ "./src/views/ControlPoints3dView.ts");
class CurvatureExtrema3dView extends AbstractObject3dView_1.AbstractObject3dView {
    constructor(spline, object3dShaders, lightDirection) {
        super(object3dShaders, lightDirection);
        this.spline = spline;
        const splineDP = new BSplineR1toR3DifferentialProperties_1.BSplineR1toR3DifferentialProperties(spline);
        this.zeros = splineDP.curvatureDerivativeZeros();
        this.updateVerticesAndIndices();
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    updateVerticesAndIndices() {
        const radius = 0.012;
        const sectorCount = 50;
        const stackCount = 50;
        let vertices = [];
        let indices = [];
        let startingIndex = 0;
        for (let zero of this.zeros) {
            let v = ControlPoints3dView_1.verticesForOneSphere(zero, radius, sectorCount, stackCount, { red: 1, green: 0.5, blue: 0.5 });
            let ind = ControlPoints3dView_1.indicesForOneSphere(startingIndex, sectorCount, stackCount);
            vertices = [...vertices, ...v];
            indices = [...indices, ...ind];
            startingIndex += v.length / 9;
        }
        this.vertices = ArrayConversion_1.toFloat32Array(vertices);
        this.indices = ArrayConversion_1.toUint16Array(indices);
    }
    updateVerticesIndicesAndBuffers() {
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    update(spline) {
        this.spline = spline;
        const splineDP = new BSplineR1toR3DifferentialProperties_1.BSplineR1toR3DifferentialProperties(spline);
        this.zeros = splineDP.curvatureDerivativeZeros();
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
}
exports.CurvatureExtrema3dView = CurvatureExtrema3dView;


/***/ }),

/***/ "./src/views/CurvatureExtremaShaders.ts":
/*!**********************************************!*\
  !*** ./src/views/CurvatureExtremaShaders.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
class CurvatureExtremaShaders {
    constructor(gl) {
        this.gl = gl;
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'attribute vec2 a_Texture; \n' +
            'varying vec2 v_Texture; \n' +
            'void main() {\n' +
            '    v_Texture = a_Texture; \n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision highp float; \n' +
            'uniform vec4 a_Color; \n' +
            'varying vec2 v_Texture; \n' +
            'void main() {\n' +
            '     float dist = distance(v_Texture, vec2(0.0, 0.0)); \n' +
            '     if (dist > 0.5) discard; \n' +
            '     gl_FragColor = a_Color; \n' +
            '}\n';
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    renderFrame(numberOfElements) {
        if (this.program) {
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
        }
    }
}
exports.CurvatureExtremaShaders = CurvatureExtremaShaders;


/***/ }),

/***/ "./src/views/CurvatureExtremaView.ts":
/*!*******************************************!*\
  !*** ./src/views/CurvatureExtremaView.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const PeriodicBSplineR1toR2DifferentialProperties_1 = __webpack_require__(/*! ../bsplines/PeriodicBSplineR1toR2DifferentialProperties */ "./src/bsplines/PeriodicBSplineR1toR2DifferentialProperties.ts");
const PeriodicBSplineR1toR2_1 = __webpack_require__(/*! ../bsplines/PeriodicBSplineR1toR2 */ "./src/bsplines/PeriodicBSplineR1toR2.ts");
const BSplineR1toR2_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR2 */ "./src/bsplines/BSplineR1toR2.ts");
const BSplineR1toR2DifferentialProperties_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR2DifferentialProperties */ "./src/bsplines/BSplineR1toR2DifferentialProperties.ts");
const RationalBSplineR1toR2Adapter_1 = __webpack_require__(/*! ../bsplines/RationalBSplineR1toR2Adapter */ "./src/bsplines/RationalBSplineR1toR2Adapter.ts");
const RationalBSplineR1toR2DifferentialProperties_1 = __webpack_require__(/*! ../bsplines/RationalBSplineR1toR2DifferentialProperties */ "./src/bsplines/RationalBSplineR1toR2DifferentialProperties.ts");
class CurvatureExtremaView {
    constructor(spline, curvatureExtremaShaders, red, green, blue, alpha) {
        this.curvatureExtremaShaders = curvatureExtremaShaders;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.z = 0;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        this.curvatureExtrema = [];
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.curvatureExtremaShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
        this.update(spline);
    }
    updateVerticesAndIndices() {
        const size = 0.03;
        this.vertices = new Float32Array(this.curvatureExtrema.length * 32);
        this.indices = new Uint8Array(this.curvatureExtrema.length * 6);
        for (let i = 0; i < this.curvatureExtrema.length; i += 1) {
            let x = this.curvatureExtrema[i].x;
            let y = this.curvatureExtrema[i].y;
            this.vertices[32 * i] = x - size;
            this.vertices[32 * i + 1] = y - size;
            this.vertices[32 * i + 2] = this.z;
            this.vertices[32 * i + 3] = -1;
            this.vertices[32 * i + 4] = -1;
            this.vertices[32 * i + 5] = this.red;
            this.vertices[32 * i + 6] = this.green;
            this.vertices[32 * i + 7] = this.blue;
            this.vertices[32 * i + 8] = x + size;
            this.vertices[32 * i + 9] = y - size;
            this.vertices[32 * i + 10] = this.z;
            this.vertices[32 * i + 11] = 1;
            this.vertices[32 * i + 12] = -1;
            this.vertices[32 * i + 13] = this.red;
            this.vertices[32 * i + 14] = this.green;
            this.vertices[32 * i + 15] = this.blue;
            this.vertices[32 * i + 16] = x + size;
            this.vertices[32 * i + 17] = y + size;
            this.vertices[32 * i + 18] = this.z;
            this.vertices[32 * i + 19] = 1;
            this.vertices[32 * i + 20] = 1;
            this.vertices[32 * i + 21] = this.red;
            this.vertices[32 * i + 22] = this.green;
            this.vertices[32 * i + 23] = this.blue;
            this.vertices[32 * i + 24] = x - size;
            this.vertices[32 * i + 25] = y + size;
            this.vertices[32 * i + 26] = this.z;
            this.vertices[32 * i + 27] = -1;
            this.vertices[32 * i + 28] = 1;
            this.vertices[32 * i + 29] = this.red;
            this.vertices[32 * i + 30] = this.green;
            this.vertices[32 * i + 31] = this.blue;
            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    }
    initVertexBuffers(gl) {
        this.updateVerticesAndIndices();
        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        let a_Position = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Texture'), 
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        if (a_Texture < 0) {
            console.log('Failed to get the storage location of a_Texture');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    }
    renderFrame() {
        let gl = this.curvatureExtremaShaders.gl, a_Position = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Texture'), 
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT, a_ColorLocation = gl.getUniformLocation(this.curvatureExtremaShaders.program, "a_Color");
        gl.useProgram(this.curvatureExtremaShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.uniform4f(a_ColorLocation, this.red, this.green, this.blue, this.alpha);
        this.curvatureExtremaShaders.renderFrame(this.indices.length);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }
    update(spline) {
        if (spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
            const splineDP = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(spline);
            this.curvatureExtrema = splineDP.curvatureExtrema();
            this.updateVerticesAndIndices();
            this.updateBuffers();
        }
        if (spline instanceof PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2) {
            const splineDP = new PeriodicBSplineR1toR2DifferentialProperties_1.PeriodicBSplineR1toR2DifferentialProperties(spline);
            this.curvatureExtrema = splineDP.curvatureExtrema();
            this.updateVerticesAndIndices();
            this.updateBuffers();
        }
        if (spline instanceof RationalBSplineR1toR2Adapter_1.RationalBSplineR1toR2Adapter) {
            const splineDP = new RationalBSplineR1toR2DifferentialProperties_1.RationalBSplineR1toR2DifferentialProperties(spline.getRationalBSplineR1toR2());
            this.curvatureExtrema = splineDP.curvatureExtrema();
            this.updateVerticesAndIndices();
            this.updateBuffers();
        }
    }
    /*
    updatePoints(points: Vector_2d[]) {
        this.controlPoints = points;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    */
    updateBuffers() {
        var gl = this.curvatureExtremaShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
exports.CurvatureExtremaView = CurvatureExtremaView;


/***/ }),

/***/ "./src/views/Curve3dShadowView.ts":
/*!****************************************!*\
  !*** ./src/views/Curve3dShadowView.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const ArrayConversion_1 = __webpack_require__(/*! ./ArrayConversion */ "./src/views/ArrayConversion.ts");
const AbstractObject3dShadowView_1 = __webpack_require__(/*! ./AbstractObject3dShadowView */ "./src/views/AbstractObject3dShadowView.ts");
const Curve3dView_1 = __webpack_require__(/*! ./Curve3dView */ "./src/views/Curve3dView.ts");
class Curve3dShadowView extends AbstractObject3dShadowView_1.AbstractObject3dShadowView {
    constructor(spline, object3dShadowShaders, lightDirection, closed) {
        super(object3dShadowShaders, lightDirection);
        this.spline = spline;
        this.closed = closed;
        this.updateVerticesAndIndices();
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShadowShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    updateVerticesAndIndices() {
        const radius = 0.005;
        const sectorCount = 20;
        const stackCount = 200;
        let indices = [];
        let startingIndex = 0;
        const vertices = this.computeVertices(radius, stackCount, sectorCount);
        for (let i = 0; i < stackCount - 1; i += 1) {
            let ind = Curve3dView_1.indicesForOneCylinder(startingIndex, sectorCount);
            indices = [...indices, ...ind];
            startingIndex += sectorCount + 1;
        }
        this.vertices = ArrayConversion_1.toFloat32Array(vertices);
        this.indices = ArrayConversion_1.toUint16Array(indices);
    }
    frames(number) {
        const start = this.spline.knots[this.spline.degree];
        const end = this.spline.knots[this.spline.knots.length - this.spline.degree - 1];
        let pointSequenceOnSpline = [];
        for (let i = 0; i < number; i += 1) {
            let point = this.spline.evaluate(i / (number - 1) * (end - start) + start);
            pointSequenceOnSpline.push(point);
        }
        const tangentSequenceOnSpline = Curve3dView_1.computeApproximatedTangentsFromPointsSequence(pointSequenceOnSpline);
        const randomUpVector = Curve3dView_1.computeRandomUpVector(tangentSequenceOnSpline[0]);
        const upVectorSequenceOnSpline = Curve3dView_1.computeUpVectorSequence(tangentSequenceOnSpline, randomUpVector);
        return { pointSequence: pointSequenceOnSpline, tangentSequence: tangentSequenceOnSpline, upVectorSequence: upVectorSequenceOnSpline };
    }
    computeVertices(radius, stackCount, sectorCount) {
        let frames = this.frames(stackCount);
        let result = [];
        for (let i = 0; i < frames.pointSequence.length; i += 1) {
            let oe = Curve3dView_1.orientedEllipse(frames.pointSequence[i], frames.tangentSequence[i], frames.upVectorSequence[i], sectorCount, radius, radius);
            for (let j = 0; j < oe.vertices.length; j += 1) {
                // vertex position (x, y, z)
                result.push(oe.vertices[j].x);
                result.push(oe.vertices[j].y);
                result.push(oe.vertices[j].z);
                // normalized vertex normal (nx, ny, nz)
                result.push(oe.normals[j].x);
                result.push(oe.normals[j].y);
                result.push(oe.normals[j].z);
                // Color
                result.push(1.0);
                result.push(0.5);
                result.push(0.5);
            }
        }
        return result;
    }
    update(spline) {
        this.spline = spline;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
}
exports.Curve3dShadowView = Curve3dShadowView;


/***/ }),

/***/ "./src/views/Curve3dView.ts":
/*!**********************************!*\
  !*** ./src/views/Curve3dView.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const ArrayConversion_1 = __webpack_require__(/*! ./ArrayConversion */ "./src/views/ArrayConversion.ts");
const Vector3d_1 = __webpack_require__(/*! ../mathVector/Vector3d */ "./src/mathVector/Vector3d.ts");
const RotationMatrix_1 = __webpack_require__(/*! ../mathVector/RotationMatrix */ "./src/mathVector/RotationMatrix.ts");
const AbstractObject3dView_1 = __webpack_require__(/*! ./AbstractObject3dView */ "./src/views/AbstractObject3dView.ts");
class Curve3dView extends AbstractObject3dView_1.AbstractObject3dView {
    //private controlPoints: Vector3d[]
    constructor(spline, object3dShaders, lightDirection, closed) {
        super(object3dShaders, lightDirection);
        this.spline = spline;
        this.closed = closed;
        this.spline = spline;
        this.updateVerticesAndIndices();
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    updateVerticesAndIndices() {
        const radius = 0.005;
        const sectorCount = 20;
        const stackCount = 200;
        let indices = [];
        let startingIndex = 0;
        const vertices = this.computeVertices(radius, stackCount, sectorCount);
        for (let i = 0; i < stackCount - 1; i += 1) {
            let ind = indicesForOneCylinder(startingIndex, sectorCount);
            indices = [...indices, ...ind];
            startingIndex += sectorCount + 1;
        }
        this.vertices = ArrayConversion_1.toFloat32Array(vertices);
        this.indices = ArrayConversion_1.toUint16Array(indices);
    }
    frames(number) {
        const start = this.spline.knots[this.spline.degree];
        const end = this.spline.knots[this.spline.knots.length - this.spline.degree - 1];
        let pointSequenceOnSpline = [];
        for (let i = 0; i < number; i += 1) {
            let point = this.spline.evaluate(i / (number - 1) * (end - start) + start);
            pointSequenceOnSpline.push(point);
        }
        const tangentSequenceOnSpline = computeApproximatedTangentsFromPointsSequence(pointSequenceOnSpline);
        const randomUpVector = computeRandomUpVector(tangentSequenceOnSpline[0]);
        const upVectorSequenceOnSpline = computeUpVectorSequence(tangentSequenceOnSpline, randomUpVector);
        return { pointSequence: pointSequenceOnSpline, tangentSequence: tangentSequenceOnSpline, upVectorSequence: upVectorSequenceOnSpline };
    }
    computeVertices(radius, stackCount, sectorCount) {
        let frames = this.frames(stackCount);
        let result = [];
        for (let i = 0; i < frames.pointSequence.length; i += 1) {
            let oe = orientedEllipse(frames.pointSequence[i], frames.tangentSequence[i], frames.upVectorSequence[i], sectorCount, radius, radius);
            for (let j = 0; j < oe.vertices.length; j += 1) {
                // vertex position (x, y, z)
                result.push(oe.vertices[j].x);
                result.push(oe.vertices[j].y);
                result.push(oe.vertices[j].z);
                // normalized vertex normal (nx, ny, nz)
                result.push(oe.normals[j].x);
                result.push(oe.normals[j].y);
                result.push(oe.normals[j].z);
                // Color
                result.push(1.0);
                result.push(0.5);
                result.push(0.5);
            }
        }
        return result;
    }
    update(spline) {
        this.spline = spline;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
}
exports.Curve3dView = Curve3dView;
function computeRandomUpVector(tangentVector) {
    if (tangentVector.x > tangentVector.y) {
        return tangentVector.crossPoduct(new Vector3d_1.Vector3d(0, 1, 0)).normalize();
    }
    else {
        return tangentVector.crossPoduct(new Vector3d_1.Vector3d(1, 0, 0)).normalize();
    }
}
exports.computeRandomUpVector = computeRandomUpVector;
function indicesForOneCylinder(startingIndex, sectorCount) {
    let result = [];
    let k1 = 0; // beginning of current stack
    let k2 = k1 + sectorCount + 1; // beginning of next stack
    for (let j = 0; j < sectorCount; j += 1, k1 += 1, k2 += 1) {
        result.push(k1 + startingIndex);
        result.push(k2 + startingIndex);
        result.push(k1 + 1 + startingIndex);
        result.push(k1 + 1 + startingIndex);
        result.push(k2 + startingIndex);
        result.push(k2 + 1 + startingIndex);
    }
    return result;
}
exports.indicesForOneCylinder = indicesForOneCylinder;
function computeUpVectorSequence(tangentSequence, firstUpVector) {
    let result = [];
    result.push(firstUpVector);
    for (let i = 0; i < tangentSequence.length - 1; i += 1) {
        let rotationMatrix = RotationMatrix_1.rotationMatrixFromTwoVectors(tangentSequence[i], tangentSequence[i + 1]);
        let lastUpVector = result[result.length - 1];
        let newUpVector = rotationMatrix.multiplyByVector([lastUpVector.x, lastUpVector.y, lastUpVector.z]);
        result.push(new Vector3d_1.Vector3d(newUpVector[0], newUpVector[1], newUpVector[2]).normalize());
    }
    return result;
}
exports.computeUpVectorSequence = computeUpVectorSequence;
function orientedEllipse(center, normal, up, sectorCount, semiMinorAxis, semiMajorAxis, miter = new Vector3d_1.Vector3d(1, 0, 0)) {
    const sectorStep = 2 * Math.PI / sectorCount;
    let vertices = [];
    let normals = [];
    let side = normal.crossPoduct(up).normalize();
    for (let i = 0; i <= sectorCount; i += 1) {
        let sectorAngle = i * sectorStep; // starting for 0 to 2pi
        let v1 = up.multiply(Math.sin(sectorAngle) * semiMinorAxis);
        let v2 = side.multiply(Math.cos(sectorAngle) * semiMajorAxis);
        vertices.push(v1.add(v2).add(center));
    }
    for (let i = 0; i <= sectorCount; i += 1) {
        let sectorAngle = i * sectorStep; // starting for 0 to 2pi
        let v1 = up.multiply(Math.sin(sectorAngle) * semiMinorAxis);
        let v2 = side.multiply(Math.cos(sectorAngle) * semiMajorAxis);
        normals.push(v1.add(v2).normalize());
    }
    return { vertices: vertices, normals: normals };
}
exports.orientedEllipse = orientedEllipse;
function computeMiterFromPointsSequence(points, radius) {
    const tolerance = 10e-5;
    const maxLength = radius * 3;
    let miters = [];
    let lengths = [];
    let normal;
    for (let i = 1; i < points.length - 1; i += 1) {
        let tangent = points[i + 1].substract(points[i - 1]).normalize();
        let v1 = points[i + 1].substract(points[i]);
        let v2 = points[i + 2].substract(points[i + 1]);
        let n = v1.crossPoduct(v2);
        if (n.norm() > tolerance) {
            normal = n.normalize();
        }
        else {
            normal = computeRandomUpVector(tangent);
        }
        miters.push(normal);
        let l = normal.crossPoduct(v1).norm();
        if (l > maxLength) {
            l = maxLength;
        }
        if (l > tolerance) {
            lengths.push(radius / l);
        }
        else {
            lengths.push(radius);
        }
    }
    return { miters: miters, lengths: lengths };
}
function computeApproximatedTangentsFromPointsSequence(points) {
    let result = [];
    let tangent = (points[1].substract(points[0])).normalize();
    result.push(tangent);
    for (let i = 1; i < points.length - 1; i += 1) {
        tangent = (points[i + 1].substract(points[i - 1])).normalize();
        result.push(tangent);
    }
    tangent = (points[points.length - 1].substract(points[points.length - 2])).normalize();
    result.push(tangent);
    return result;
}
exports.computeApproximatedTangentsFromPointsSequence = computeApproximatedTangentsFromPointsSequence;


/***/ }),

/***/ "./src/views/CurveScene3dView.ts":
/*!***************************************!*\
  !*** ./src/views/CurveScene3dView.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const quat_1 = __webpack_require__(/*! ../webgl/quat */ "./src/webgl/quat.ts");
const ControlPoints3dView_1 = __webpack_require__(/*! ./ControlPoints3dView */ "./src/views/ControlPoints3dView.ts");
const ControlPoints3dShadowView_1 = __webpack_require__(/*! ./ControlPoints3dShadowView */ "./src/views/ControlPoints3dShadowView.ts");
const ControlPolygon3dView_1 = __webpack_require__(/*! ./ControlPolygon3dView */ "./src/views/ControlPolygon3dView.ts");
const ControlPolygon3dShadowView_1 = __webpack_require__(/*! ./ControlPolygon3dShadowView */ "./src/views/ControlPolygon3dShadowView.ts");
const Object3dShaders_1 = __webpack_require__(/*! ./Object3dShaders */ "./src/views/Object3dShaders.ts");
const Curve3dView_1 = __webpack_require__(/*! ./Curve3dView */ "./src/views/Curve3dView.ts");
const Curve3dShadowView_1 = __webpack_require__(/*! ./Curve3dShadowView */ "./src/views/Curve3dShadowView.ts");
const Object3dShadowShaders_1 = __webpack_require__(/*! ./Object3dShadowShaders */ "./src/views/Object3dShadowShaders.ts");
const CurveScene3dController_1 = __webpack_require__(/*! ../controllers/CurveScene3dController */ "./src/controllers/CurveScene3dController.ts");
const TorsionZerosView_1 = __webpack_require__(/*! ./TorsionZerosView */ "./src/views/TorsionZerosView.ts");
const CurvatureExtrema3dView_1 = __webpack_require__(/*! ./CurvatureExtrema3dView */ "./src/views/CurvatureExtrema3dView.ts");
var STATE;
(function (STATE) {
    STATE[STATE["NONE"] = 0] = "NONE";
    STATE[STATE["ROTATE"] = 1] = "ROTATE";
})(STATE || (STATE = {}));
class CurveScene3dView {
    constructor(canvas, gl, curve3dModel) {
        this.canvas = canvas;
        this.gl = gl;
        this.selectedControlPoint = null;
        this.dragging = false;
        this.lightDirection = [0, 1, 1];
        this.previousMousePosition = { x: 0, y: 0 };
        this.state = STATE.NONE;
        this.curve3dModel = curve3dModel;
        this.object3dShaders = new Object3dShaders_1.Object3dShaders(this.gl);
        this.object3dShadowShaders = new Object3dShadowShaders_1.Object3dShadowShaders(this.gl);
        this.controlPoints3dView = new ControlPoints3dView_1.ControlPoints3dView(curve3dModel.spline, this.object3dShaders, this.lightDirection);
        this.controlPoints3dShadowView = new ControlPoints3dShadowView_1.ControlPoints3dShadowView(curve3dModel.spline, this.object3dShadowShaders, this.lightDirection);
        this.controlPolygon3dView = new ControlPolygon3dView_1.ControlPolygon3dView(curve3dModel.spline, this.object3dShaders, this.lightDirection, false);
        this.controlPolygon3dShadowView = new ControlPolygon3dShadowView_1.ControlPolygon3dShadowView(curve3dModel.spline, this.object3dShadowShaders, this.lightDirection, false);
        this.curve3dView = new Curve3dView_1.Curve3dView(curve3dModel.spline, this.object3dShaders, this.lightDirection, false);
        this.curve3dShadowView = new Curve3dShadowView_1.Curve3dShadowView(curve3dModel.spline, this.object3dShadowShaders, this.lightDirection, false);
        this.torsionZerosView = new TorsionZerosView_1.TorsionZerosView(curve3dModel.spline, this.object3dShaders, this.lightDirection);
        this.curvatureExtrema3dView = new CurvatureExtrema3dView_1.CurvatureExtrema3dView(curve3dModel.spline, this.object3dShaders, this.lightDirection);
        this.curve3dModel.registerObserver(this.controlPoints3dView);
        this.curve3dModel.registerObserver(this.controlPolygon3dView);
        this.curve3dModel.registerObserver(this.curve3dView);
        this.curve3dModel.registerObserver(this.controlPoints3dShadowView);
        this.curve3dModel.registerObserver(this.controlPolygon3dShadowView);
        this.curve3dModel.registerObserver(this.curve3dShadowView);
        this.curve3dModel.registerObserver(this.torsionZerosView);
        this.curve3dModel.registerObserver(this.curvatureExtrema3dView);
        this.curveScene3dControler = new CurveScene3dController_1.CurveScene3dController(curve3dModel);
    }
    renderFrame() {
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.clearColor(0.2, 0.2, 0.2, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.controlPoints3dView.renderFrame();
        this.controlPoints3dShadowView.renderFrame();
        this.controlPolygon3dView.renderFrame();
        this.controlPolygon3dShadowView.renderFrame();
        this.curve3dView.renderFrame();
        this.curve3dShadowView.renderFrame();
        this.torsionZerosView.renderFrame();
        this.curvatureExtrema3dView.renderFrame();
    }
    mousedown(event, deltaSquared = 0.01) {
        const ndc = this.mouse_get_NormalizedDeviceCoordinates(event);
        this.selectedControlPoint = this.controlPoints3dView.controlPointSelection(ndc.x, ndc.y, deltaSquared);
        this.controlPoints3dView.setSelected(this.selectedControlPoint);
        this.previousMousePosition = ndc;
        if (event.button === 0 && this.selectedControlPoint === null) {
            this.state = STATE.ROTATE;
        }
        if (this.selectedControlPoint !== null) {
            this.dragging = true;
        }
        this.controlPoints3dView.updateVerticesIndicesAndBuffers();
    }
    mousemove(event) {
        if (this.state === STATE.ROTATE || this.dragging === true) {
            const currentMousePosition = this.mouse_get_NormalizedDeviceCoordinates(event);
            const deltaMove = {
                x: currentMousePosition.x - this.previousMousePosition.x,
                y: currentMousePosition.y - this.previousMousePosition.y
            };
            this.previousMousePosition = this.mouse_get_NormalizedDeviceCoordinates(event);
            if (this.state === STATE.ROTATE) {
                const deltaRotationQuaternion = quat_1.fromEuler(-deltaMove.y * 500, deltaMove.x * 500, 0);
                this.controlPoints3dView.orientation = quat_1.multiply_quats(deltaRotationQuaternion, this.controlPoints3dView.orientation);
                this.controlPoints3dShadowView.orientation = quat_1.multiply_quats(deltaRotationQuaternion, this.controlPoints3dShadowView.orientation);
                this.controlPolygon3dView.orientation = quat_1.multiply_quats(deltaRotationQuaternion, this.controlPolygon3dView.orientation);
                this.controlPolygon3dShadowView.orientation = quat_1.multiply_quats(deltaRotationQuaternion, this.controlPolygon3dShadowView.orientation);
                this.curve3dView.orientation = quat_1.multiply_quats(deltaRotationQuaternion, this.curve3dView.orientation);
                this.curve3dShadowView.orientation = quat_1.multiply_quats(deltaRotationQuaternion, this.curve3dShadowView.orientation);
                this.torsionZerosView.orientation = quat_1.multiply_quats(deltaRotationQuaternion, this.torsionZerosView.orientation);
                this.curvatureExtrema3dView.orientation = quat_1.multiply_quats(deltaRotationQuaternion, this.curvatureExtrema3dView.orientation);
            }
            if (this.dragging === true) {
                const selectedControlPoint = this.controlPoints3dView.getSelectedControlPoint();
                if (selectedControlPoint != null && this.dragging === true) {
                    const p = this.controlPoints3dView.computeNewPosition(currentMousePosition.x, currentMousePosition.y);
                    if (p !== null && this.selectedControlPoint !== null) {
                        this.curveScene3dControler.setControlPointPosition(this.selectedControlPoint, p.x, p.y, p.z);
                    }
                }
            }
        }
    }
    mouseup(event) {
        this.state = STATE.NONE;
        this.dragging = false;
    }
    mouse_get_NormalizedDeviceCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const w = parseInt(this.canvas.style.width, 10);
        const h = parseInt(this.canvas.style.height, 10);
        const x = ((event.clientX - rect.left) - w / 2) / (w / 2);
        const y = (h / 2 - (event.clientY - rect.top)) / (h / 2);
        return { x: x, y: y };
    }
    toggleControlOfCurvatureExtrema() {
        this.curve3dModel.toggleActiveControlOfCurvatureExtrema();
    }
    toggleControlOfTorsionZeros() {
        this.curve3dModel.toggleActiveControlOfTorsionZeros();
    }
}
exports.CurveScene3dView = CurveScene3dView;


/***/ }),

/***/ "./src/views/CurveSceneView.ts":
/*!*************************************!*\
  !*** ./src/views/CurveSceneView.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const CurveSceneController_1 = __webpack_require__(/*! ../controllers/CurveSceneController */ "./src/controllers/CurveSceneController.ts");
const ControlPointsShaders_1 = __webpack_require__(/*! ../views/ControlPointsShaders */ "./src/views/ControlPointsShaders.ts");
const ControlPointsView_1 = __webpack_require__(/*! ../views/ControlPointsView */ "./src/views/ControlPointsView.ts");
const ControlPolygonShaders_1 = __webpack_require__(/*! ../views/ControlPolygonShaders */ "./src/views/ControlPolygonShaders.ts");
const ControlPolygonView_1 = __webpack_require__(/*! ../views/ControlPolygonView */ "./src/views/ControlPolygonView.ts");
const CurveShaders_1 = __webpack_require__(/*! ../views/CurveShaders */ "./src/views/CurveShaders.ts");
const CurveView_1 = __webpack_require__(/*! ../views/CurveView */ "./src/views/CurveView.ts");
const CurvatureExtremaShaders_1 = __webpack_require__(/*! ./CurvatureExtremaShaders */ "./src/views/CurvatureExtremaShaders.ts");
const CurvatureExtremaView_1 = __webpack_require__(/*! ./CurvatureExtremaView */ "./src/views/CurvatureExtremaView.ts");
const InflectionsView_1 = __webpack_require__(/*! ../views/InflectionsView */ "./src/views/InflectionsView.ts");
const CurveModel_1 = __webpack_require__(/*! ../models/CurveModel */ "./src/models/CurveModel.ts");
const ClosedCurveModel_1 = __webpack_require__(/*! ../models/ClosedCurveModel */ "./src/models/ClosedCurveModel.ts");
const CurveModelAlternative01_1 = __webpack_require__(/*! ../models/CurveModelAlternative01 */ "./src/models/CurveModelAlternative01.ts");
const ClosedCurveModelAlternative01_1 = __webpack_require__(/*! ../models/ClosedCurveModelAlternative01 */ "./src/models/ClosedCurveModelAlternative01.ts");
class CurveSceneView {
    constructor(canvas, gl, curveModel) {
        this.canvas = canvas;
        this.gl = gl;
        this.curveModel = curveModel;
        this.selectedControlPoint = null;
        this.dragging = false;
        this.curveShaders = new CurveShaders_1.CurveShaders(this.gl);
        this.curveView = new CurveView_1.CurveView(this.curveModel.spline, this.curveShaders, 216 / 255, 91 / 255, 95 / 255, 1);
        this.controlPointsShaders = new ControlPointsShaders_1.ControlPointsShaders(this.gl);
        this.controlPointsView = new ControlPointsView_1.ControlPointsView(this.curveModel.spline, this.controlPointsShaders, 1, 1, 1);
        this.controlPolygonShaders = new ControlPolygonShaders_1.ControlPolygonShaders(this.gl);
        this.controlPolygonView = new ControlPolygonView_1.ControlPolygonView(this.curveModel.spline, this.controlPolygonShaders, this.curveModel.isClosed, 216.0 / 255.0, 216.0 / 255.0, 216.0 / 255.0, 0.05);
        this.curvatureExtremaShaders = new CurvatureExtremaShaders_1.CurvatureExtremaShaders(this.gl);
        this.curvatureExtremaView = new CurvatureExtremaView_1.CurvatureExtremaView(this.curveModel.spline, this.curvatureExtremaShaders, 216 / 255, 91 / 255, 95 / 255, 1);
        this.inflectionsView = new InflectionsView_1.InflectionsView(this.curveModel.spline, this.curvatureExtremaShaders, 216 / 255, 120 / 255, 120 / 255, 1);
        this.curveModel.registerObserver(this.controlPointsView, "control points");
        this.curveModel.registerObserver(this.controlPolygonView, "control points");
        this.curveModel.registerObserver(this.curveView, "curve");
        this.curveModel.registerObserver(this.curvatureExtremaView, "curve");
        this.curveModel.registerObserver(this.inflectionsView, "curve");
        this.curveSceneControler = new CurveSceneController_1.CurveSceneController(curveModel);
        this.renderFrame();
    }
    renderFrame() {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.27, 0.27, 0.27, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.curveView.renderFrame();
        this.curvatureExtremaView.renderFrame();
        this.inflectionsView.renderFrame();
        this.controlPolygonView.renderFrame();
        this.controlPointsView.renderFrame();
    }
    leftMouseDown_event(ndcX, ndcY, deltaSquared = 0.01) {
        this.selectedControlPoint = this.controlPointsView.controlPointSelection(ndcX, ndcY, deltaSquared);
        this.controlPointsView.setSelected(this.selectedControlPoint);
        if (this.selectedControlPoint !== null) {
            this.dragging = true;
        }
    }
    leftMouseDragged_event(ndcX, ndcY) {
        let x = ndcX, y = ndcY, selectedControlPoint = this.controlPointsView.getSelectedControlPoint();
        if (selectedControlPoint != null && this.dragging === true) {
            this.curveSceneControler.setControlPointPosition(selectedControlPoint, x, y);
        }
    }
    leftMouseUp_event() {
        this.dragging = false;
    }
    upArrow_event() {
        if (this.selectedControlPoint !== null) {
            this.curveModel.increaseControlPointWeight(this.selectedControlPoint);
        }
    }
    downArrow_event() {
        if (this.selectedControlPoint !== null) {
            this.curveModel.decreaseControlPointWeight(this.selectedControlPoint);
        }
    }
    addControlPoint() {
        const cp = this.selectedControlPoint;
        this.selectedControlPoint = null;
        this.controlPointsView.setSelected(this.selectedControlPoint);
        this.curveModel.addControlPoint(cp);
        this.renderFrame();
    }
    toggleControlOfCurvatureExtrema() {
        this.curveModel.toggleActiveControlOfCurvatureExtrema();
    }
    toggleControlOfInflections() {
        this.curveModel.toggleActiveControlOfInflections();
    }
    selectCurveCategory(s) {
        switch (s) {
            case "0":
                this.updateCurveModel(new CurveModel_1.CurveModel());
                //this.updateCurveModel(new CurveModelQuasiNewton())
                break;
            case "1":
                //this.updateCurveModel(new ClosedCurveModelQuasiNewton())
                this.updateCurveModel(new ClosedCurveModel_1.ClosedCurveModel());
                break;
            case "2":
                this.updateCurveModel(new CurveModelAlternative01_1.CurveModelAlternative01());
                break;
            case "3":
                this.updateCurveModel(new ClosedCurveModelAlternative01_1.ClosedCurveModelAlternative01());
                break;
        }
        //let toggleButtonCurvatureExtrema = <HTMLInputElement> document.getElementById("toggleButtonCurvatureExtrema")
        //let toggleButtonInflection = <HTMLInputElement> document.getElementById("toggleButtonInflections")
        //toggleButtonCurvatureExtrema.checked = true
        //toggleButtonInflection.checked = true
    }
    updateCurveModel(curveModel) {
        this.curveModel = curveModel;
        this.curveModel.registerObserver(this.controlPointsView, "control points");
        this.curveModel.registerObserver(this.controlPolygonView, "control points");
        this.curveModel.registerObserver(this.curveView, "curve");
        this.curveModel.registerObserver(this.curvatureExtremaView, "curve");
        this.curveModel.registerObserver(this.inflectionsView, "curve");
        this.curveSceneControler = new CurveSceneController_1.CurveSceneController(curveModel);
        this.controlPolygonView.isClosed = this.curveModel.isClosed;
        this.curveModel.notifyObservers();
        this.renderFrame();
    }
}
exports.CurveSceneView = CurveSceneView;


/***/ }),

/***/ "./src/views/CurveShaders.ts":
/*!***********************************!*\
  !*** ./src/views/CurveShaders.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
class CurveShaders {
    constructor(gl) {
        this.gl = gl;
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'void main() {\n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision mediump float; \n' +
            'uniform vec4 fColor; \n' +
            'void main() {\n' +
            '    gl_FragColor = fColor; \n' +
            '}\n';
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    renderFrame(numberOfVertices) {
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, numberOfVertices);
    }
}
exports.CurveShaders = CurveShaders;


/***/ }),

/***/ "./src/views/CurveView.ts":
/*!********************************!*\
  !*** ./src/views/CurveView.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class CurveView {
    constructor(spline, curveShaders, red, green, blue, alpha) {
        this.spline = spline;
        this.curveShaders = curveShaders;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.POINT_SEQUENCE_SIZE = 1000;
        this.pointSequenceOnSpline = [];
        this.vertexBuffer = null;
        this.vertices = new Float32Array(this.POINT_SEQUENCE_SIZE * 6);
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.curveShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    updatePointSequenceOnSpline() {
        const start = this.spline.knots[this.spline.degree];
        const end = this.spline.knots[this.spline.knots.length - this.spline.degree - 1];
        this.pointSequenceOnSpline = [];
        for (let i = 0; i < this.POINT_SEQUENCE_SIZE; i += 1) {
            let point = this.spline.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            this.pointSequenceOnSpline.push(point);
        }
    }
    updateVertices() {
        const thickness = 0.005;
        const maxLength = thickness * 3;
        let tangent = ((this.pointSequenceOnSpline[1]).substract(this.pointSequenceOnSpline[0])).normalize(), normal = tangent.rotate90degrees(), miter, length, result = [];
        result.push(this.pointSequenceOnSpline[0].add(normal.multiply(thickness)));
        result.push(this.pointSequenceOnSpline[0].substract(normal.multiply(thickness)));
        for (let i = 1; i < this.pointSequenceOnSpline.length - 1; i += 1) {
            normal = (this.pointSequenceOnSpline[i].substract(this.pointSequenceOnSpline[i - 1])).normalize().rotate90degrees();
            tangent = (this.pointSequenceOnSpline[i + 1].substract(this.pointSequenceOnSpline[i - 1])).normalize();
            miter = tangent.rotate90degrees();
            length = thickness / (miter.dot(normal));
            if (length > maxLength) {
                length = maxLength;
            }
            result.push(this.pointSequenceOnSpline[i].add(miter.multiply(length)));
            result.push(this.pointSequenceOnSpline[i].substract(miter.multiply(length)));
        }
        tangent = this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 1].substract(this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 2]).normalize();
        normal = tangent.rotate90degrees();
        result.push(this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 1].add(normal.multiply(thickness)));
        result.push(this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 1].substract(normal.multiply(thickness)));
        for (let i = 0; i < result.length; i += 1) {
            this.vertices[3 * i] = result[i].x;
            this.vertices[3 * i + 1] = result[i].y;
            this.vertices[3 * i + 2] = 0.0;
        }
    }
    update(spline) {
        this.spline = spline;
        this.updatePointSequenceOnSpline();
        this.updateVertices();
        this.updateBuffers();
    }
    updateBuffers() {
        const gl = this.curveShaders.gl;
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    renderFrame() {
        const gl = this.curveShaders.gl;
        const a_Position = gl.getAttribLocation(this.curveShaders.program, 'a_Position');
        const fColorLocation = gl.getUniformLocation(this.curveShaders.program, "fColor");
        gl.useProgram(this.curveShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.uniform4f(fColorLocation, this.red, this.green, this.blue, this.alpha);
        this.curveShaders.renderFrame(this.vertices.length / 3);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }
    initVertexBuffers(gl) {
        const a_Position = gl.getAttribLocation(this.curveShaders.program, 'a_Position');
        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        this.updatePointSequenceOnSpline();
        this.updateVertices();
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return 1;
    }
}
exports.CurveView = CurveView;


/***/ }),

/***/ "./src/views/InflectionsView.ts":
/*!**************************************!*\
  !*** ./src/views/InflectionsView.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const PeriodicBSplineR1toR2DifferentialProperties_1 = __webpack_require__(/*! ../bsplines/PeriodicBSplineR1toR2DifferentialProperties */ "./src/bsplines/PeriodicBSplineR1toR2DifferentialProperties.ts");
const PeriodicBSplineR1toR2_1 = __webpack_require__(/*! ../bsplines/PeriodicBSplineR1toR2 */ "./src/bsplines/PeriodicBSplineR1toR2.ts");
const BSplineR1toR2_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR2 */ "./src/bsplines/BSplineR1toR2.ts");
const BSplineR1toR2DifferentialProperties_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR2DifferentialProperties */ "./src/bsplines/BSplineR1toR2DifferentialProperties.ts");
const RationalBSplineR1toR2Adapter_1 = __webpack_require__(/*! ../bsplines/RationalBSplineR1toR2Adapter */ "./src/bsplines/RationalBSplineR1toR2Adapter.ts");
const RationalBSplineR1toR2DifferentialProperties_1 = __webpack_require__(/*! ../bsplines/RationalBSplineR1toR2DifferentialProperties */ "./src/bsplines/RationalBSplineR1toR2DifferentialProperties.ts");
class InflectionsView {
    constructor(spline, curvatureExtremaShaders, red, green, blue, alpha) {
        this.curvatureExtremaShaders = curvatureExtremaShaders;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.z = 0;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        this.controlPoints = spline.freeControlPoints;
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.curvatureExtremaShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
        this.update(spline);
    }
    updateVerticesAndIndices() {
        const size = 0.025;
        this.vertices = new Float32Array(this.controlPoints.length * 32);
        this.indices = new Uint8Array(this.controlPoints.length * 6);
        for (let i = 0; i < this.controlPoints.length; i += 1) {
            let x = this.controlPoints[i].x;
            let y = this.controlPoints[i].y;
            this.vertices[32 * i] = x - size;
            this.vertices[32 * i + 1] = y - size;
            this.vertices[32 * i + 2] = this.z;
            this.vertices[32 * i + 3] = -1;
            this.vertices[32 * i + 4] = -1;
            this.vertices[32 * i + 5] = this.red;
            this.vertices[32 * i + 6] = this.green;
            this.vertices[32 * i + 7] = this.blue;
            this.vertices[32 * i + 8] = x + size;
            this.vertices[32 * i + 9] = y - size;
            this.vertices[32 * i + 10] = this.z;
            this.vertices[32 * i + 11] = 1;
            this.vertices[32 * i + 12] = -1;
            this.vertices[32 * i + 13] = this.red;
            this.vertices[32 * i + 14] = this.green;
            this.vertices[32 * i + 15] = this.blue;
            this.vertices[32 * i + 16] = x + size;
            this.vertices[32 * i + 17] = y + size;
            this.vertices[32 * i + 18] = this.z;
            this.vertices[32 * i + 19] = 1;
            this.vertices[32 * i + 20] = 1;
            this.vertices[32 * i + 21] = this.red;
            this.vertices[32 * i + 22] = this.green;
            this.vertices[32 * i + 23] = this.blue;
            this.vertices[32 * i + 24] = x - size;
            this.vertices[32 * i + 25] = y + size;
            this.vertices[32 * i + 26] = this.z;
            this.vertices[32 * i + 27] = -1;
            this.vertices[32 * i + 28] = 1;
            this.vertices[32 * i + 29] = this.red;
            this.vertices[32 * i + 30] = this.green;
            this.vertices[32 * i + 31] = this.blue;
            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    }
    initVertexBuffers(gl) {
        this.updateVerticesAndIndices();
        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        let a_Position = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Texture'), 
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        if (a_Texture < 0) {
            console.log('Failed to get the storage location of a_Texture');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    }
    renderFrame() {
        let gl = this.curvatureExtremaShaders.gl, a_Position = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Texture'), 
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT, a_ColorLocation = gl.getUniformLocation(this.curvatureExtremaShaders.program, "a_Color");
        gl.useProgram(this.curvatureExtremaShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.uniform4f(a_ColorLocation, this.red, this.green, this.blue, this.alpha);
        this.curvatureExtremaShaders.renderFrame(this.indices.length);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }
    update(spline) {
        if (spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
            const splineDP = new BSplineR1toR2DifferentialProperties_1.BSplineR1toR2DifferentialProperties(spline);
            this.controlPoints = splineDP.inflections();
            this.updateVerticesAndIndices();
            this.updateBuffers();
        }
        if (spline instanceof PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2) {
            const splineDP = new PeriodicBSplineR1toR2DifferentialProperties_1.PeriodicBSplineR1toR2DifferentialProperties(spline);
            this.controlPoints = splineDP.inflections();
            this.updateVerticesAndIndices();
            this.updateBuffers();
        }
        if (spline instanceof RationalBSplineR1toR2Adapter_1.RationalBSplineR1toR2Adapter) {
            const splineDP = new RationalBSplineR1toR2DifferentialProperties_1.RationalBSplineR1toR2DifferentialProperties(spline.getRationalBSplineR1toR2());
            this.controlPoints = splineDP.inflections();
            this.updateVerticesAndIndices();
            this.updateBuffers();
        }
    }
    /*
    updatePoints(points: Vector_2d[]) {
        this.controlPoints = points;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    */
    updateBuffers() {
        var gl = this.curvatureExtremaShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
exports.InflectionsView = InflectionsView;


/***/ }),

/***/ "./src/views/Object3dShaders.ts":
/*!**************************************!*\
  !*** ./src/views/Object3dShaders.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
class Object3dShaders {
    constructor(gl) {
        this.gl = gl;
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'attribute vec3 a_Normal; \n' +
            'attribute vec3 a_Color; \n' +
            'uniform mat4 ModelViewProjectionMatrix; \n' +
            'uniform mat3 NormalMatrix; \n' +
            'varying vec3 normal; \n' +
            'varying vec4 color; \n' +
            'void main() {\n' +
            '    normal = normalize(NormalMatrix * a_Normal); \n' +
            '    color = vec4(a_Color, 1); \n' +
            '    gl_Position = ModelViewProjectionMatrix * vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision mediump float; \n' +
            'uniform vec3 Ambient; \n' +
            'uniform vec3 LightColor; \n' +
            'uniform vec3 LightDirection; \n' +
            'uniform vec3 HalfVector; \n' +
            'uniform float Shininess; \n' +
            'uniform float Strength; \n' +
            'varying vec3 normal; \n' +
            'varying vec4 color; \n' +
            'void main() {\n' +
            '   float diffuse = abs(dot(normal, LightDirection)); \n' +
            '   float specular = abs(dot(normal, HalfVector)); \n' +
            '   specular = pow(specular, Shininess); \n' +
            '   vec3 scatteredLight = Ambient + LightColor*diffuse; \n' +
            '   vec3 reflectedLight = LightColor*specular*Strength; \n' +
            '   vec3 rgb = min(color.rgb*scatteredLight + reflectedLight, vec3(1.0)); \n' +
            '   gl_FragColor = vec4(rgb, color.a); \n' +
            '}\n';
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    renderFrame(numberOfIndices) {
        this.gl.drawElements(this.gl.TRIANGLES, numberOfIndices, this.gl.UNSIGNED_SHORT, 0);
    }
}
exports.Object3dShaders = Object3dShaders;


/***/ }),

/***/ "./src/views/Object3dShadowShaders.ts":
/*!********************************************!*\
  !*** ./src/views/Object3dShadowShaders.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
class Object3dShadowShaders {
    constructor(gl) {
        this.gl = gl;
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'attribute vec3 a_Normal; \n' +
            'attribute vec3 a_Color; \n' +
            'uniform mat4 ModelViewProjectionMatrix; \n' +
            'uniform mat3 NormalMatrix; \n' +
            'varying vec3 normal; \n' +
            'varying vec4 color; \n' +
            'void main() {\n' +
            '    normal = normalize(NormalMatrix * a_Normal); \n' +
            '    color = vec4(a_Color, 1.0); \n' +
            '    vec4 position = ModelViewProjectionMatrix * vec4(a_Position, 1.0); \n' +
            '    gl_Position = vec4(position.x, position.y*0.0 - 1.5, position.z, position.w); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision mediump float; \n' +
            'uniform vec3 Ambient; \n' +
            'uniform vec3 LightColor; \n' +
            'uniform vec3 LightDirection; \n' +
            'uniform vec3 HalfVector; \n' +
            'uniform float Shininess; \n' +
            'uniform float Strength; \n' +
            'varying vec3 normal; \n' +
            'varying vec4 color; \n' +
            'void main() {\n' +
            '   float diffuse = abs(dot(normal, LightDirection)); \n' +
            '   float specular = abs(dot(normal, HalfVector)); \n' +
            '   specular = pow(specular, Shininess); \n' +
            '   vec3 scatteredLight = Ambient + LightColor*diffuse; \n' +
            '   vec3 reflectedLight = LightColor*specular*Strength; \n' +
            '   vec3 rgb = min(color.rgb*scatteredLight + reflectedLight, vec3(1.0)); \n' +
            '   gl_FragColor = vec4(rgb, color.a); \n' +
            '   gl_FragColor = vec4(0.1, 0.1, 0.1, 1); \n' +
            '}\n';
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    renderFrame(numberOfIndices) {
        this.gl.drawElements(this.gl.TRIANGLES, numberOfIndices, this.gl.UNSIGNED_SHORT, 0);
    }
}
exports.Object3dShadowShaders = Object3dShadowShaders;


/***/ }),

/***/ "./src/views/TorsionZerosView.ts":
/*!***************************************!*\
  !*** ./src/views/TorsionZerosView.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const ArrayConversion_1 = __webpack_require__(/*! ./ArrayConversion */ "./src/views/ArrayConversion.ts");
const AbstractObject3dView_1 = __webpack_require__(/*! ./AbstractObject3dView */ "./src/views/AbstractObject3dView.ts");
const BSplineR1toR3DifferentialProperties_1 = __webpack_require__(/*! ../bsplines/BSplineR1toR3DifferentialProperties */ "./src/bsplines/BSplineR1toR3DifferentialProperties.ts");
const ControlPoints3dView_1 = __webpack_require__(/*! ./ControlPoints3dView */ "./src/views/ControlPoints3dView.ts");
class TorsionZerosView extends AbstractObject3dView_1.AbstractObject3dView {
    constructor(spline, object3dShaders, lightDirection) {
        super(object3dShaders, lightDirection);
        this.spline = spline;
        const splineDP = new BSplineR1toR3DifferentialProperties_1.BSplineR1toR3DifferentialProperties(spline);
        this.zeros = splineDP.torsionZeros();
        this.updateVerticesAndIndices();
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    updateVerticesAndIndices() {
        const radius = 0.012;
        const sectorCount = 50;
        const stackCount = 50;
        let vertices = [];
        let indices = [];
        let startingIndex = 0;
        for (let zero of this.zeros) {
            let v = ControlPoints3dView_1.verticesForOneSphere(zero, radius, sectorCount, stackCount, { red: 1, green: 0.75, blue: 0.75 });
            let ind = ControlPoints3dView_1.indicesForOneSphere(startingIndex, sectorCount, stackCount);
            vertices = [...vertices, ...v];
            indices = [...indices, ...ind];
            startingIndex += v.length / 9;
        }
        this.vertices = ArrayConversion_1.toFloat32Array(vertices);
        this.indices = ArrayConversion_1.toUint16Array(indices);
    }
    updateVerticesIndicesAndBuffers() {
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    update(spline) {
        this.spline = spline;
        const splineDP = new BSplineR1toR3DifferentialProperties_1.BSplineR1toR3DifferentialProperties(spline);
        this.zeros = splineDP.torsionZeros();
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
}
exports.TorsionZerosView = TorsionZerosView;


/***/ }),

/***/ "./src/views/Wire3dEventListener.ts":
/*!******************************************!*\
  !*** ./src/views/Wire3dEventListener.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


//import { CurveSceneView } from "./CurveSceneView"
Object.defineProperty(exports, "__esModule", ({ value: true }));
function wire3dEventListener(canvas, curveScene3dView) {
    /*
    hideContextMenu()

    function hideContextMenu() {
        const cm = document.getElementById("contextMenu")
        if (cm) {
            cm.style.display = "none"
        }
    }
    */
    canvas.addEventListener('mousedown', (event) => {
        curveScene3dView.mousedown(event);
        event.preventDefault();
        curveScene3dView.renderFrame();
    });
    canvas.addEventListener('mousemove', (event) => {
        curveScene3dView.mousemove(event);
        event.preventDefault();
        curveScene3dView.renderFrame();
    });
    canvas.addEventListener('mouseup', (event) => {
        curveScene3dView.mouseup(event);
        event.preventDefault();
        curveScene3dView.renderFrame();
    });
    /*
    
    function mouse_get_NormalizedDeviceCoordinates(event: MouseEvent) {
        var x, y,
            rect  = canvas.getBoundingClientRect(),
            ev

        ev = event
        
        x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2)
        y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2)
        return [x, y]
    }

    function touch_get_NormalizedDeviceCoordinates(event: TouchEvent) {
        var x, y,
            rect  = canvas.getBoundingClientRect(),
            ev;
 
        ev = event.touches[0]
        
        x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2)
        y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2)
        return [x, y]
    }


    function mouse_click(ev: MouseEvent) {
        hideContextMenu()
        let c = mouse_get_NormalizedDeviceCoordinates(ev)
        const mousePrecision =  0.0005
        curveSceneView.leftMouseDown_event(c[0], c[1], mousePrecision)
        curveSceneView.renderFrame()
        ev.preventDefault()
    }

    function mouse_drag(ev: MouseEvent) {
        var c = mouse_get_NormalizedDeviceCoordinates(ev)
        curveSceneView.leftMouseDragged_event(c[0], c[1])
        curveSceneView.renderFrame()
        ev.preventDefault()

    }

    function mouse_stop_drag(ev: MouseEvent) {
        curveSceneView.leftMouseUp_event()
        ev.preventDefault()
    }

    function touch_click(ev: TouchEvent) {
        let c = touch_get_NormalizedDeviceCoordinates(ev)
        curveSceneView.leftMouseDown_event(c[0], c[1])
        curveSceneView.renderFrame()
        ev.preventDefault()
    }

    function touch_drag(ev: TouchEvent) {
        var c = touch_get_NormalizedDeviceCoordinates(ev)
        curveSceneView.leftMouseDragged_event(c[0], c[1])
        curveSceneView.renderFrame()
        ev.preventDefault()
    }

    function touch_stop_drag(ev: TouchEvent) {
        curveSceneView.leftMouseUp_event()
        ev.preventDefault()
    }

    canvas.addEventListener('mousedown', mouse_click, false)
    canvas.addEventListener('mousemove', mouse_drag, false)
    canvas.addEventListener('mouseup', mouse_stop_drag, false)
    canvas.addEventListener('touchstart', touch_click, false)
    canvas.addEventListener('touchmove', touch_drag, false)
    canvas.addEventListener('touchend', touch_stop_drag, false)

    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target === canvas) {
            e.preventDefault()
        }
    }, false)
    document.body.addEventListener("touchend", function (e) {
        if (e.target === canvas) {
            e.preventDefault()
        }
    }, false)
    document.body.addEventListener("touchmove", function (e) {
        if (e.target === canvas) {
            e.preventDefault()
        }
    }, false)



    function rightClick(e: MouseEvent) {
        e.preventDefault()

        const cm = document.getElementById("contextMenu")
        if (cm) {
                //cm.style.display = "block"
                cm.style.left = e.pageX + "px"
                cm.style.top = e.pageY + "px"
                cm.style.display = "block"
        }
    }

    function addControlPoint() {
        hideContextMenu()
        curveSceneView.addControlPoint()
    }

    document.getElementById("addControlPoint")?.addEventListener('click', addControlPoint)

    canvas.addEventListener('contextmenu', rightClick, false)


    let toggleButtonCurvatureExtrema = <HTMLButtonElement> document.getElementById("toggleButtonCurvatureExtrema")
    let toggleButtonInflection = <HTMLButtonElement> document.getElementById("toggleButtonInflections")
    

    function toggleControlOfCurvatureExtrema() {
        curveSceneView.toggleControlOfCurvatureExtrema()
    }

    function toggleControlOfInflections() {
        curveSceneView.toggleControlOfInflections()
    }


    function selectCurveCategory(event: any) {
        curveSceneView.selectCurveCategory(event.detail.category)
    }

    toggleButtonCurvatureExtrema.addEventListener('click', toggleControlOfCurvatureExtrema)
    toggleButtonInflection.addEventListener('click', toggleControlOfInflections)

    let app = document.getElementsByTagName("app-curves-and-surfaces")[0]
    app.addEventListener("changeCurveCategory", selectCurveCategory)
    */
    function toggleControlOfCurvatureExtrema3d() {
        curveScene3dView.toggleControlOfCurvatureExtrema();
    }
    function toggleControlOfTorsionZeros() {
        curveScene3dView.toggleControlOfTorsionZeros();
    }
    let app = document.getElementsByTagName("app-curve-3d")[0];
    //app.addEventListener("changeCurveCategory", selectCurveCategory)
    app.addEventListener("toogleControlOverCurvatureExtrema3d", toggleControlOfCurvatureExtrema3d);
    app.addEventListener("toogleControlOverTorsionZeros", toggleControlOfTorsionZeros);
}
exports.wire3dEventListener = wire3dEventListener;


/***/ }),

/***/ "./src/views/WireEventListener.ts":
/*!****************************************!*\
  !*** ./src/views/WireEventListener.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function wireEventListener(canvas, curveSceneView) {
    var _a;
    hideContextMenu();
    function mouse_get_NormalizedDeviceCoordinates(event) {
        const rect = canvas.getBoundingClientRect();
        const w = parseInt(canvas.style.width, 10);
        const h = parseInt(canvas.style.height, 10);
        const x = ((event.clientX - rect.left) - w / 2) / (w / 2);
        const y = (h / 2 - (event.clientY - rect.top)) / (h / 2);
        return [x, y];
    }
    function touch_get_NormalizedDeviceCoordinates(event) {
        var x, y, rect = canvas.getBoundingClientRect(), ev;
        ev = event.touches[0];
        x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
        return [x, y];
    }
    function mouse_click(ev) {
        hideContextMenu();
        let c = mouse_get_NormalizedDeviceCoordinates(ev);
        const mousePrecision = 0.0005;
        curveSceneView.leftMouseDown_event(c[0], c[1], mousePrecision);
        curveSceneView.renderFrame();
        ev.preventDefault();
    }
    function mouse_drag(ev) {
        var c = mouse_get_NormalizedDeviceCoordinates(ev);
        curveSceneView.leftMouseDragged_event(c[0], c[1]);
        curveSceneView.renderFrame();
        ev.preventDefault();
    }
    function mouse_stop_drag(ev) {
        curveSceneView.leftMouseUp_event();
        ev.preventDefault();
    }
    function touch_click(ev) {
        let c = touch_get_NormalizedDeviceCoordinates(ev);
        curveSceneView.leftMouseDown_event(c[0], c[1]);
        curveSceneView.renderFrame();
        ev.preventDefault();
    }
    function touch_drag(ev) {
        var c = touch_get_NormalizedDeviceCoordinates(ev);
        curveSceneView.leftMouseDragged_event(c[0], c[1]);
        curveSceneView.renderFrame();
        ev.preventDefault();
    }
    function touch_stop_drag(ev) {
        curveSceneView.leftMouseUp_event();
        ev.preventDefault();
    }
    function keyDown(ev) {
        switch (ev.key) {
            case "ArrowUp":
                curveSceneView.upArrow_event();
                curveSceneView.renderFrame();
                ev.preventDefault();
                break;
            case "ArrowDown":
                curveSceneView.downArrow_event();
                curveSceneView.renderFrame();
                ev.preventDefault();
                break;
        }
    }
    canvas.addEventListener('mousedown', mouse_click, false);
    canvas.addEventListener('mousemove', mouse_drag, false);
    canvas.addEventListener('mouseup', mouse_stop_drag, false);
    canvas.addEventListener('touchstart', touch_click, false);
    canvas.addEventListener('touchmove', touch_drag, false);
    canvas.addEventListener('touchend', touch_stop_drag, false);
    window.addEventListener('keydown', keyDown, false);
    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchend", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, false);
    function hideContextMenu() {
        const cm = document.getElementById("contextMenu");
        if (cm) {
            cm.style.display = "none";
        }
    }
    function rightClick(e) {
        e.preventDefault();
        const cm = document.getElementById("contextMenu");
        if (cm) {
            //cm.style.display = "block"
            cm.style.left = e.pageX + "px";
            cm.style.top = e.pageY + "px";
            cm.style.display = "block";
        }
    }
    function addControlPoint() {
        hideContextMenu();
        curveSceneView.addControlPoint();
    }
    (_a = document.getElementById("addControlPoint")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addControlPoint);
    canvas.addEventListener('contextmenu', rightClick, false);
    function toggleControlOfCurvatureExtrema() {
        curveSceneView.toggleControlOfCurvatureExtrema();
    }
    function toggleControlOfInflections() {
        curveSceneView.toggleControlOfInflections();
    }
    function selectCurveCategory(event) {
        curveSceneView.selectCurveCategory(event.detail.category);
    }
    let app = document.getElementsByTagName("app-curves-and-surfaces")[0];
    app.addEventListener("changeCurveCategory", selectCurveCategory);
    app.addEventListener("toogleControlOverCurvatureExtrema", toggleControlOfCurvatureExtrema);
    app.addEventListener("toogleControlOverInflections", toggleControlOfInflections);
}
exports.wireEventListener = wireEventListener;


/***/ }),

/***/ "./src/webComponents/AppCurve3d.ts":
/*!*****************************************!*\
  !*** ./src/webComponents/AppCurve3d.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const template = document.createElement('template');
template.innerHTML = `
    <rounded-switch-torsion-zeros></rounded-switch-torsion-zeros>
    <rounded-switch-curvature-extrema-3d></rounded-switch-curvature-extrema-3d>
`;
//import { CurveCategory } from "./CurveCategory"
const RoundedSwitchCurvatureExtrema3d_1 = __webpack_require__(/*! ./RoundedSwitchCurvatureExtrema3d */ "./src/webComponents/RoundedSwitchCurvatureExtrema3d.ts");
const RoundedSwitchTorsionZeros_1 = __webpack_require__(/*! ./RoundedSwitchTorsionZeros */ "./src/webComponents/RoundedSwitchTorsionZeros.ts");
class AppCurves3d extends HTMLElement {
    constructor() {
        super();
        window.customElements.define('rounded-switch-torsion-zeros', RoundedSwitchTorsionZeros_1.RoundedSwitchTorsionZeros);
        window.customElements.define('rounded-switch-curvature-extrema-3d', RoundedSwitchCurvatureExtrema3d_1.RoundedSwitchCurvatureExtrema3d);
        //window.customElements.define('curve-category', CurveCategory)       
        //window.customElements.define('copyright-years', CopyrightYears)
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}
exports.AppCurves3d = AppCurves3d;


/***/ }),

/***/ "./src/webComponents/AppCurvesAndSurfaces.ts":
/*!***************************************************!*\
  !*** ./src/webComponents/AppCurvesAndSurfaces.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const template = document.createElement('template');
template.innerHTML = `
    <rounded-switch-inflections></rounded-switch-inflections>
    <rounded-switch-curvature-extrema></rounded-switch-curvature-extrema>
    <curve-category></curve-category>
`;
//import { CopyrightYears } from "./CopyrightYears"
const CurveCategory_1 = __webpack_require__(/*! ./CurveCategory */ "./src/webComponents/CurveCategory.ts");
const RoundedSwitchCurvatureExtrema_1 = __webpack_require__(/*! ./RoundedSwitchCurvatureExtrema */ "./src/webComponents/RoundedSwitchCurvatureExtrema.ts");
const RoundedSwitchInflections_1 = __webpack_require__(/*! ./RoundedSwitchInflections */ "./src/webComponents/RoundedSwitchInflections.ts");
class AppCurvesAndSurfaces extends HTMLElement {
    constructor() {
        super();
        window.customElements.define('rounded-switch-inflections', RoundedSwitchInflections_1.RoundedSwitchInflections);
        window.customElements.define('rounded-switch-curvature-extrema', RoundedSwitchCurvatureExtrema_1.RoundedSwitchCurvatureExtrema);
        window.customElements.define('curve-category', CurveCategory_1.CurveCategory);
        //window.customElements.define('copyright-years', CopyrightYears)
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}
exports.AppCurvesAndSurfaces = AppCurvesAndSurfaces;


/***/ }),

/***/ "./src/webComponents/CopyrightYears.ts":
/*!*********************************************!*\
  !*** ./src/webComponents/CopyrightYears.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const template = document.createElement('template');
template.innerHTML = `
    <style>
    .text_center {
        text-align: center;
        margin-bottom: 1cm;
        color:rgb(100, 100, 100);
        font-size: 80%;
    }
    </style>
    <div class="text_center" id="copyright"></div>
`;
class CopyrightYears extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        let currentYear = new Date().getFullYear();
        // \u00A9: copyright symbol
        this.shadowRoot.getElementById('copyright').innerText = "\u00A9" + " 2018-" + currentYear;
    }
}
exports.CopyrightYears = CopyrightYears;


/***/ }),

/***/ "./src/webComponents/CurveCategory.ts":
/*!********************************************!*\
  !*** ./src/webComponents/CurveCategory.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const template = document.createElement('template');
template.innerHTML = `
    <style>
    .text_control_button {
        font-size: small;
        font-weight: bold;
        margin-bottom: 0%;
        color:rgb(100, 100, 100);
    }
    #container {
        text-align: center;
        margin-bottom: 1%;
    }
    </style>
    <div id="container">
    <p class="text_control_button"> Curve Category: </p>
        <select id="curve-category-selector">
            <option id= "option1" value="0" selected="selected"> Open </option>
            <option id= "option2" value="1" > Closed </option>
            <!--
            <option id= "option3" value="2" > Alternative open planar </option>
            <option id= "option4" value="3" > Alternative closed planar </option>
            -->
        </select>
    </div>
`;
class CurveCategory extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.shadowRoot.getElementById('curve-category-selector').
            addEventListener('change', this.categorySelected);
    }
    disconnectedCallback() {
        this.shadowRoot.getElementById('curve-category-selector').
            removeEventListener('change', this.categorySelected);
    }
    categorySelected(event) {
        let category = event.target;
        this.dispatchEvent(new CustomEvent("changeCurveCategory", {
            bubbles: true,
            composed: true,
            detail: { category: category.value }
        }));
    }
}
exports.CurveCategory = CurveCategory;


/***/ }),

/***/ "./src/webComponents/RoundedSwitchCurvatureExtrema.ts":
/*!************************************************************!*\
  !*** ./src/webComponents/RoundedSwitchCurvatureExtrema.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const template = document.createElement('template');
template.innerHTML = `
    <style>
    body {
        margin: 0;
        padding: 0;
        font-family:  'Open Sans', sans-serif;
        background-color: rgb(230, 230, 230);}


    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 30px;
      }
    
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 23px;
        width: 23px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: rgb(130, 194, 141);
      }
      
      input:focus + .slider {
        box-shadow: 0 0 1px rgb(145, 182, 145);
      }
      
      input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }
      
      .slider.round {
        border-radius: 34px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }

      .text_control_button {
        font-size: small;
        font-weight: bold;
        margin-bottom: 0%;
        color:rgb(100, 100, 100);
        }
    </style>

    <div id="container">
        <center>  <p class="text_control_button"> Curvature extrema </p> 
            <label class="switch">
            <input type="checkbox"  checked id="toggleButtonCurvatureExtrema">
            <span class="slider round"></span>
            </label>
        </center>
    </div>
`;
class RoundedSwitchCurvatureExtrema extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.shadowRoot.getElementById('toggleButtonCurvatureExtrema').
            addEventListener('change', this.toogleControlOverCurvatureExtrema);
    }
    disconnectedCallback() {
        this.shadowRoot.getElementById('toggleButtonCurvatureExtrema').
            removeEventListener('change', this.toogleControlOverCurvatureExtrema);
    }
    toogleControlOverCurvatureExtrema(event) {
        let category = event.target;
        this.dispatchEvent(new CustomEvent("toogleControlOverCurvatureExtrema", {
            bubbles: true,
            composed: true,
            detail: { category: category.value }
        }));
    }
}
exports.RoundedSwitchCurvatureExtrema = RoundedSwitchCurvatureExtrema;


/***/ }),

/***/ "./src/webComponents/RoundedSwitchCurvatureExtrema3d.ts":
/*!**************************************************************!*\
  !*** ./src/webComponents/RoundedSwitchCurvatureExtrema3d.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const template = document.createElement('template');
template.innerHTML = `
    <style>
    body {
        margin: 0;
        padding: 0;
        font-family:  'Open Sans', sans-serif;
        background-color: rgb(230, 230, 230);}


    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 30px;
      }
    
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 23px;
        width: 23px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: rgb(130, 194, 141);
      }
      
      input:focus + .slider {
        box-shadow: 0 0 1px rgb(145, 182, 145);
      }
      
      input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }
      
      .slider.round {
        border-radius: 34px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }

      .text_control_button {
        font-size: small;
        font-weight: bold;
        margin-bottom: 0%;
        color:rgb(100, 100, 100);
        }
    </style>

    <div id="container">
        <center>  <p class="text_control_button"> Curvature extrema </p> 
            <label class="switch">
            <input type="checkbox"  checked id="toggleButtonCurvatureExtrema3d">
            <span class="slider round"></span>
            </label>
        </center>
    </div>
`;
class RoundedSwitchCurvatureExtrema3d extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.shadowRoot.getElementById('toggleButtonCurvatureExtrema3d').
            addEventListener('change', this.toogleControlOverCurvatureExtrema3d);
    }
    disconnectedCallback() {
        this.shadowRoot.getElementById('toggleButtonCurvatureExtrema3d').
            removeEventListener('change', this.toogleControlOverCurvatureExtrema3d);
    }
    toogleControlOverCurvatureExtrema3d(event) {
        let category = event.target;
        this.dispatchEvent(new CustomEvent("toogleControlOverCurvatureExtrema3d", {
            bubbles: true,
            composed: true,
            detail: { category: category.value }
        }));
    }
}
exports.RoundedSwitchCurvatureExtrema3d = RoundedSwitchCurvatureExtrema3d;


/***/ }),

/***/ "./src/webComponents/RoundedSwitchInflections.ts":
/*!*******************************************************!*\
  !*** ./src/webComponents/RoundedSwitchInflections.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const template = document.createElement('template');
template.innerHTML = `
    <style>

    body {
        margin: 0;
        padding: 0;
        font-family:  'Open Sans', sans-serif;
        background-color: rgb(230, 230, 230);}


    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 30px;
      }
    
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 23px;
        width: 23px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: rgb(130, 194, 141);
      }
      
      input:focus + .slider {
        box-shadow: 0 0 1px rgb(145, 182, 145);
      }
      
      input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }
      
      .slider.round {
        border-radius: 34px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }

      .text_control_button {
        font-size: small;
        font-weight: bold;
        margin-bottom: 0%;
        color:rgb(100, 100, 100);
        }
    </style>

    <div id="container">
        <center>  <p class="text_control_button"> Inflections </p>
            <label class="switch">
            <input type="checkbox" checked id="toggleButtonInflections">
            <span class="slider round"></span>
            </label>
        </center>
    </div>
`;
class RoundedSwitchInflections extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.shadowRoot.getElementById('toggleButtonInflections').
            addEventListener('change', this.toogleControlOverCurvatureExtrema);
    }
    disconnectedCallback() {
        this.shadowRoot.getElementById('toggleButtonInflections').
            removeEventListener('change', this.toogleControlOverCurvatureExtrema);
    }
    toogleControlOverCurvatureExtrema(event) {
        let category = event.target;
        this.dispatchEvent(new CustomEvent("toogleControlOverInflections", {
            bubbles: true,
            composed: true,
            detail: { category: category.value }
        }));
    }
}
exports.RoundedSwitchInflections = RoundedSwitchInflections;


/***/ }),

/***/ "./src/webComponents/RoundedSwitchTorsionZeros.ts":
/*!********************************************************!*\
  !*** ./src/webComponents/RoundedSwitchTorsionZeros.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const template = document.createElement('template');
template.innerHTML = `
    <style>

    body {
        margin: 0;
        padding: 0;
        font-family:  'Open Sans', sans-serif;
        background-color: rgb(230, 230, 230);}


    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 30px;
      }
    
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 23px;
        width: 23px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: rgb(130, 194, 141);
      }
      
      input:focus + .slider {
        box-shadow: 0 0 1px rgb(145, 182, 145);
      }
      
      input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }
      
      .slider.round {
        border-radius: 34px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }

      .text_control_button {
        font-size: small;
        font-weight: bold;
        margin-bottom: 0%;
        color:rgb(100, 100, 100);
        }
    </style>

    <div id="container">
        <center>  <p class="text_control_button"> Torsion Zeros </p>
            <label class="switch">
            <input type="checkbox" checked id="toggleButtonTorsionZeros">
            <span class="slider round"></span>
            </label>
        </center>
    </div>
`;
class RoundedSwitchTorsionZeros extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.shadowRoot.getElementById('toggleButtonTorsionZeros').
            addEventListener('change', this.toogleControlOverTorsionZeros);
    }
    disconnectedCallback() {
        this.shadowRoot.getElementById('toggleButtonTorsionZeros').
            removeEventListener('change', this.toogleControlOverTorsionZeros);
    }
    toogleControlOverTorsionZeros(event) {
        let category = event.target;
        this.dispatchEvent(new CustomEvent("toogleControlOverTorsionZeros", {
            bubbles: true,
            composed: true,
            detail: { category: category.value }
        }));
    }
}
exports.RoundedSwitchTorsionZeros = RoundedSwitchTorsionZeros;


/***/ }),

/***/ "./src/webgl/cuon-utils.ts":
/*!*********************************!*\
  !*** ./src/webgl/cuon-utils.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


// Reference: cuon-utils.js
// cuon-utils.js (c) 2012 kanda and matsuda
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vshader, fshader) {
    // Create shader object
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
        console.log("createProgram was unable to produce a vertex or fragment shader");
        return null;
    }
    // Create a program object
    var program = gl.createProgram();
    if (!program) {
        console.log("createProgram was unable to produce a program");
        return null;
    }
    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // Link the program object
    gl.linkProgram(program);
    // Check the result of linking
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        const error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}
exports.createProgram = createProgram;
/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (shader == null) {
        console.log('unable to create shader');
        return null;
    }
    // Set the shader program
    gl.shaderSource(shader, source);
    // Compile the shader
    gl.compileShader(shader);
    // Check the result of compilation
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        const error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}


/***/ }),

/***/ "./src/webgl/mat3.ts":
/*!***************************!*\
  !*** ./src/webgl/mat3.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


//http://glmatrix.net/docs/mat4.js.html
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Copies the upper-left 3x3 values into a mat3.
 *
 * @param a   the source 4x4 matrix
 * @returns  3x3 matrix
 */
function mat4_to_mat3(a) {
    let result = new Float32Array(9);
    result[0] = a[0];
    result[1] = a[1];
    result[2] = a[2];
    result[3] = a[4];
    result[4] = a[5];
    result[5] = a[6];
    result[6] = a[8];
    result[7] = a[9];
    result[8] = a[10];
    return result;
}
exports.mat4_to_mat3 = mat4_to_mat3;


/***/ }),

/***/ "./src/webgl/mat4.ts":
/*!***************************!*\
  !*** ./src/webgl/mat4.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


//http://glmatrix.net/docs/mat4.js.html
Object.defineProperty(exports, "__esModule", ({ value: true }));
function identity_mat4() {
    let result = new Float32Array(16);
    result[0] = 1;
    result[5] = 1;
    result[10] = 1;
    result[15] = 1;
    return result;
}
exports.identity_mat4 = identity_mat4;
function fromQuat(quaternion) {
    let result = new Float32Array(16);
    let x = quaternion[0], y = quaternion[1], z = quaternion[2], w = quaternion[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let yx = y * x2;
    let yy = y * y2;
    let zx = z * x2;
    let zy = z * y2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    result[0] = 1 - yy - zz;
    result[1] = yx + wz;
    result[2] = zx - wy;
    result[3] = 0;
    result[4] = yx - wz;
    result[5] = 1 - xx - zz;
    result[6] = zy + wx;
    result[7] = 0;
    result[8] = zx + wy;
    result[9] = zy - wx;
    result[10] = 1 - xx - yy;
    result[11] = 0;
    result[12] = 0;
    result[13] = 0;
    result[14] = 0;
    result[15] = 1;
    return result;
}
exports.fromQuat = fromQuat;
function hypot(...args) {
    var y = 0, i = args.length;
    while (i--)
        y += args[i] * args[i];
    return Math.sqrt(y);
}
function lookAt(eye, center, up) {
    let result = new Float32Array(16);
    const EPSILON = 0.000001;
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye[0];
    let eyey = eye[1];
    let eyez = eye[2];
    let upx = up[0];
    let upy = up[1];
    let upz = up[2];
    let centerx = center[0];
    let centery = center[1];
    let centerz = center[2];
    if (Math.abs(eyex - centerx) < EPSILON &&
        Math.abs(eyey - centery) < EPSILON &&
        Math.abs(eyez - centerz) < EPSILON) {
        return identity_mat4();
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = hypot(x0, x1, x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    }
    else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = hypot(y0, y1, y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    }
    else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }
    result[0] = x0;
    result[1] = y0;
    result[2] = z0;
    result[3] = 0;
    result[4] = x1;
    result[5] = y1;
    result[6] = z1;
    result[7] = 0;
    result[8] = x2;
    result[9] = y2;
    result[10] = z2;
    result[11] = 0;
    result[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    result[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    result[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    result[15] = 1;
    return result;
}
exports.lookAt = lookAt;
/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param fovy Vertical field of view in radians
 * @param aspect Aspect ratio. typically viewport width/height
 * @param  near Near bound of the frustum
 * @param  far Far bound of the frustum, can be null or Infinity
 * @returns projection matrix
 */
function perspective(fovy, aspect, near, far) {
    let f = 1.0 / Math.tan(fovy / 2), nf;
    let result = new Float32Array(16);
    result[0] = f / aspect;
    result[1] = 0;
    result[2] = 0;
    result[3] = 0;
    result[4] = 0;
    result[5] = f;
    result[6] = 0;
    result[7] = 0;
    result[8] = 0;
    result[9] = 0;
    result[11] = -1;
    result[12] = 0;
    result[13] = 0;
    result[15] = 0;
    if (far != null && far !== Infinity) {
        nf = 1 / (near - far);
        result[10] = (far + near) * nf;
        result[14] = (2 * far * near) * nf;
    }
    else {
        result[10] = -1;
        result[14] = -2 * near;
    }
    return result;
}
exports.perspective = perspective;
/**
* Multiplies two mat4s
*
* @param  a the first operand
* @param  b the second operand
* @returns matrix
*/
function multiply(a, b) {
    let result = new Float32Array(16);
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    // Cache only the current line of the second matrix
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    result[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    result[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    result[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    result[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    result[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    result[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    result[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    result[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    result[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    result[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    result[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    result[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    result[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    result[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    result[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    result[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return result;
}
exports.multiply = multiply;
/**
 * Translate a mat4 by the given vector
 *
 * @param a the matrix to translate
 * @param v vector to translate by
 * @returns matrix
 */
function translate(a, v) {
    let result = new Float32Array(16);
    const x = v[0], y = v[1], z = v[2];
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    result[0] = a00;
    result[1] = a01;
    result[2] = a02;
    result[3] = a03;
    result[4] = a10;
    result[5] = a11;
    result[6] = a12;
    result[7] = a13;
    result[8] = a20;
    result[9] = a21;
    result[10] = a22;
    result[11] = a23;
    result[12] = a00 * x + a10 * y + a20 * z + a[12];
    result[13] = a01 * x + a11 * y + a21 * z + a[13];
    result[14] = a02 * x + a12 * y + a22 * z + a[14];
    result[15] = a03 * x + a13 * y + a23 * z + a[15];
    return result;
}
exports.translate = translate;
/**
* Generates a orthogonal projection matrix with the given bounds
*
* @param  left Left bound of the frustum
* @param  right Right bound of the frustum
* @param  bottom Bottom bound of the frustum
* @param  top Top bound of the frustum
* @param  near Near bound of the frustum
* @param far Far bound of the frustum
* @return result mat4 frustum matrix
*/
function ortho(left, right, bottom, top, near, far) {
    let result = new Float32Array(16);
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    result[0] = -2 * lr;
    result[1] = 0;
    result[2] = 0;
    result[3] = 0;
    result[4] = 0;
    result[5] = -2 * bt;
    result[6] = 0;
    result[7] = 0;
    result[8] = 0;
    result[9] = 0;
    result[10] = 2 * nf;
    result[11] = 0;
    result[12] = (left + right) * lr;
    result[13] = (top + bottom) * bt;
    result[14] = (far + near) * nf;
    result[15] = 1;
    return result;
}
exports.ortho = ortho;
/**
* Transforms the vec2 with a mat4
* 3rd vector component is implicitly '0'
* 4th vector component is implicitly '1'
*
* @param x, y the vector to transform
* @param  m matrix to transform with
* @returns newX, newY
*/
function mat4_times_vec2(m, x, y) {
    const newX = m[0] * x + m[4] * y + m[12];
    const newY = m[1] * x + m[5] * y + m[13];
    return { x: newX, y: newY };
}
exports.mat4_times_vec2 = mat4_times_vec2;


/***/ }),

/***/ "./src/webgl/quat.ts":
/*!***************************!*\
  !*** ./src/webgl/quat.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


//http://glmatrix.net/docs/quat.js.html
Object.defineProperty(exports, "__esModule", ({ value: true }));
function identity_quat() {
    let result = new Float32Array(4);
    result[3] = 1;
    return result;
}
exports.identity_quat = identity_quat;
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param  axis the axis around which to rotate
 * @param  rad the angle in radians
 * @returns  result
 **/
function setAxisAngle(axis, rad) {
    rad = rad * 0.5;
    let s = Math.sin(rad);
    let result = new Float32Array([0, 0, 0, 0]);
    result[0] = s * axis[0];
    result[1] = s * axis[1];
    result[2] = s * axis[2];
    result[3] = Math.cos(rad);
    return result;
}
exports.setAxisAngle = setAxisAngle;
/**
 * Multiplies two quaternions
 *
 * @param  a the first quaternion operand
 * @param  b the second quaternion operand
 * @returns the resulting quaternion
 */
function multiply_quats(a, b) {
    let ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bx = b[0], by = b[1], bz = b[2], bw = b[3];
    let result = new Float32Array([0, 0, 0, 0]);
    result[0] = ax * bw + aw * bx + ay * bz - az * by;
    result[1] = ay * bw + aw * by + az * bx - ax * bz;
    result[2] = az * bw + aw * bz + ax * by - ay * bx;
    result[3] = aw * bw - ax * bx - ay * by - az * bz;
    return result;
}
exports.multiply_quats = multiply_quats;
/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param Angle to rotate around X axis in degrees.
 * @param Angle to rotate around Y axis in degrees.
 * @param Angle to rotate around Z axis in degrees.
 */
function fromEuler(x, y, z) {
    let result = new Float32Array([0, 0, 0, 0]);
    let halfToRad = 0.5 * Math.PI / 180.0;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    let sx = Math.sin(x);
    let cx = Math.cos(x);
    let sy = Math.sin(y);
    let cy = Math.cos(y);
    let sz = Math.sin(z);
    let cz = Math.cos(z);
    result[0] = sx * cy * cz - cx * sy * sz;
    result[1] = cx * sy * cz + sx * cy * sz;
    result[2] = cx * cy * sz - sx * sy * cz;
    result[3] = cx * cy * cz + sx * sy * sz;
    return result;
}
exports.fromEuler = fromEuler;


/***/ }),

/***/ "./src/webgl/webgl-utils.ts":
/*!**********************************!*\
  !*** ./src/webgl/webgl-utils.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @fileoverview This file contains functions every webgl program will need
 * a version of one way or another.
 *
 * Instead of setting up a context manually it is recommended to
 * use. This will check for success or failure. On failure it
 * will attempt to present an approriate message to the user.
 *
 *       gl = WebGLUtils.setupWebGL(canvas);
 *
 * For animated WebGL apps use of setTimeout or setInterval are
 * discouraged. It is recommended you structure your rendering
 * loop like this.
 *
 *       function render() {
 *         window.requestAnimationFrame(render, canvas);
 *
 *         // do rendering
 *         ...
 *       }
 *       render();
 *
 * This will call your rendering function up to the refresh rate
 * of your display but will stop rendering if your app is not
 * visible.
 */
function WebGLUtils() {
    /**
     * Creates the HTLM for a failure message
     * @param {string} canvasContainerId id of container of th
     *        canvas.
     * @return {string} The html.
     */
    var makeFailHTML = function (msg) {
        return '' +
            '<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">' + msg + '</div>';
        return '' +
            '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
            '<td align="center">' +
            '<div style="display: table-cell; vertical-align: middle;">' +
            '<div style="">' + msg + '</div>' +
            '</div>' +
            '</td></tr></table>';
    };
    /**
     * Mesasge for getting a webgl browser
     * @type {string}
     */
    var GET_A_WEBGL_BROWSER = '' +
        'This page requires a browser that supports WebGL.<br/>' +
        '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';
    /**
     * Mesasge for need better hardware
     * @type {string}
     */
    var OTHER_PROBLEM = '' +
        "It doesn't appear your computer can support WebGL.<br/>" +
        '<a href="http://get.webgl.org">Click here for more information.</a>';
    /**
     * Creates a webgl context. If creation fails it will
     * change the contents of the container of the <canvas>
     * tag to an error message with the correct links for WebGL.
     * @param {Element} canvas. The canvas element to create a
     *     context from.
     * @param {WebGLContextCreationAttirbutes} opt_attribs Any
     *     creation attributes you want to pass in.
     * @param {function:(msg)} opt_onError An function to call
     *     if there is an error during creation.
     * @return {WebGLRenderingContext} The created context.
     */
    var setupWebGL = function (canvas, opt_attribs, opt_onError) {
        function handleCreationError(msg) {
            var container = document.getElementsByTagName("body")[0];
            //var container = canvas.parentNode;
            if (container) {
                var str = window.WebGLRenderingContext ?
                    OTHER_PROBLEM :
                    GET_A_WEBGL_BROWSER;
                if (msg) {
                    str += "<br/><br/>Status: " + msg;
                }
                container.innerHTML = makeFailHTML(str);
            }
        }
        ;
        opt_onError = opt_onError || handleCreationError;
        if (canvas.addEventListener) {
            canvas.addEventListener("webglcontextcreationerror", function (event) {
                opt_onError(event.statusMessage);
            }, false);
        }
        var context = create3DContext(canvas, opt_attribs);
        if (!context) {
            if (!window.WebGLRenderingContext) {
                opt_onError("");
            }
            else {
                opt_onError("");
            }
        }
        return context;
    };
    /**
     * Creates a webgl context.
     * @param {!Canvas} canvas The canvas tag to get context
     *     from. If one is not passed in one will be created.
     * @return {!WebGLContext} The created context.
     */
    var create3DContext = function (canvas, opt_attribs) {
        var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        var context = null;
        for (var ii = 0; ii < names.length; ++ii) {
            try {
                context = canvas.getContext(names[ii], opt_attribs);
            }
            catch (e) { }
            if (context) {
                break;
            }
        }
        return context;
    };
    return {
        create3DContext: create3DContext,
        setupWebGL: setupWebGL
    };
}
exports.WebGLUtils = WebGLUtils;
/**
 * Provides requestAnimationFrame in a cross browser
 * way.
 */
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            //window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}
/** * ERRATA: 'cancelRequestAnimationFrame' renamed to 'cancelAnimationFrame' to reflect an update to the W3C Animation-Timing Spec.
 *
 * Cancels an animation frame request.
 * Checks for cross-browser support, falls back to clearTimeout.
 * @param {number}  Animation frame request. */
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
        //window.webkitCancelAnimationFrame || 
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
        window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
        window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
        window.clearTimeout);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const webgl_utils_1 = __webpack_require__(/*! ./webgl/webgl-utils */ "./src/webgl/webgl-utils.ts");
const CurveSceneView_1 = __webpack_require__(/*! ./views/CurveSceneView */ "./src/views/CurveSceneView.ts");
const CurveModel_1 = __webpack_require__(/*! ./models/CurveModel */ "./src/models/CurveModel.ts");
const WireEventListener_1 = __webpack_require__(/*! ./views/WireEventListener */ "./src/views/WireEventListener.ts");
const AppCurvesAndSurfaces_1 = __webpack_require__(/*! ./webComponents/AppCurvesAndSurfaces */ "./src/webComponents/AppCurvesAndSurfaces.ts");
const CurveScene3dView_1 = __webpack_require__(/*! ./views/CurveScene3dView */ "./src/views/CurveScene3dView.ts");
const Wire3dEventListener_1 = __webpack_require__(/*! ./views/Wire3dEventListener */ "./src/views/Wire3dEventListener.ts");
const CopyrightYears_1 = __webpack_require__(/*! ./webComponents/CopyrightYears */ "./src/webComponents/CopyrightYears.ts");
const CurveModel3d_1 = __webpack_require__(/*! ./models/CurveModel3d */ "./src/models/CurveModel3d.ts");
const NurbsModel2d_1 = __webpack_require__(/*! ./models/NurbsModel2d */ "./src/models/NurbsModel2d.ts");
const AppCurve3d_1 = __webpack_require__(/*! ./webComponents/AppCurve3d */ "./src/webComponents/AppCurve3d.ts");
function main() {
    let canvas2d = document.getElementById("webgl");
    let canvas3d = document.getElementById("webgl2");
    let gl = webgl_utils_1.WebGLUtils().setupWebGL(canvas2d);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    let gl2 = webgl_utils_1.WebGLUtils().setupWebGL(canvas3d);
    if (!gl2) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl2.enable(gl.DEPTH_TEST);
    let curveModel = new CurveModel_1.CurveModel();
    let nurbsModel2d = new NurbsModel2d_1.NurbsModel2d;
    let curveSceneView = new CurveSceneView_1.CurveSceneView(canvas2d, gl, curveModel);
    //let curveSceneView = new NurbsSceneView(canvas2d, gl, nurbsModel2d)
    let curveModel3d = new CurveModel3d_1.CurveModel3d();
    let curve3dSceneView = new CurveScene3dView_1.CurveScene3dView(canvas3d, gl2, curveModel3d);
    curve3dSceneView.renderFrame();
    window.customElements.define('app-curves-and-surfaces', AppCurvesAndSurfaces_1.AppCurvesAndSurfaces);
    window.customElements.define('app-curve-3d', AppCurve3d_1.AppCurves3d);
    window.customElements.define('copy-right-years', CopyrightYears_1.CopyrightYears);
    WireEventListener_1.wireEventListener(canvas2d, curveSceneView);
    //nurbsWireEventListener(canvas2d, curveSceneView)
    Wire3dEventListener_1.wire3dEventListener(canvas3d, curve3dSceneView);
}
exports.main = main;
main();

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map