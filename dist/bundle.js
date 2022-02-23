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
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
const BSplineR1toR2_1 = __webpack_require__(/*! ./BSplineR1toR2 */ "./src/bsplines/BSplineR1toR2.ts");
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
    curve() {
        let x = this.grevilleAbscissae();
        let cp = [];
        for (let i = 0; i < x.length; i += 1) {
            cp.push(new Vector2d_1.Vector2d(x[i], this._controlPoints[i]));
        }
        return new BSplineR1toR2_1.BSplineR1toR2(cp, this._knots.slice());
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

/***/ "./src/bsplines/BSplineR1toR1.ts":
/*!***************************************!*\
  !*** ./src/bsplines/BSplineR1toR1.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Piegl_Tiller_NURBS_Book_1 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/bsplines/Piegl_Tiller_NURBS_Book.ts");
const AbstractBSplineR1toR1_1 = __webpack_require__(/*! ./AbstractBSplineR1toR1 */ "./src/bsplines/AbstractBSplineR1toR1.ts");
const BernsteinDecompositionR1toR1_1 = __webpack_require__(/*! ./BernsteinDecompositionR1toR1 */ "./src/bsplines/BernsteinDecompositionR1toR1.ts");
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

/***/ "./src/bsplines/BernsteinDecompositionR1toR1.ts":
/*!******************************************************!*\
  !*** ./src/bsplines/BernsteinDecompositionR1toR1.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BinomialCoefficient_1 = __webpack_require__(/*! ./BinomialCoefficient */ "./src/bsplines/BinomialCoefficient.ts");
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
    /**
     *
     * @param bd: BernsteinDecomposition_R1_to_R1
     * @param index: Index of the basis function
     */
    multiplyRange(bd, start, lessThan) {
        let result = [];
        for (let i = start; i < lessThan; i += 1) {
            result[i - start] = this.bernsteinMultiplication(this.controlPointsArray[i], bd.controlPointsArray[i]);
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
    flattenControlPointsArray() {
        return this.controlPointsArray.reduce(function (acc, val) {
            return acc.concat(val);
        }, []);
    }
    subset(start, lessThan) {
        return new BernsteinDecompositionR1toR1(this.controlPointsArray.slice(start, lessThan));
    }
}
exports.BernsteinDecompositionR1toR1 = BernsteinDecompositionR1toR1;
BernsteinDecompositionR1toR1.binomial = BinomialCoefficient_1.memoizedBinomialCoefficient();
BernsteinDecompositionR1toR1.flopsCounter = 0;


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
const AbstractBSplineR1toR1_1 = __webpack_require__(/*! ./AbstractBSplineR1toR1 */ "./src/bsplines/AbstractBSplineR1toR1.ts");
const BernsteinDecompositionR1toR1_1 = __webpack_require__(/*! ./BernsteinDecompositionR1toR1 */ "./src/bsplines/BernsteinDecompositionR1toR1.ts");
const BSplineR1toR1_1 = __webpack_require__(/*! ./BSplineR1toR1 */ "./src/bsplines/BSplineR1toR1.ts");
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
}
exports.PeriodicBSplineR1toR1 = PeriodicBSplineR1toR1;


/***/ }),

/***/ "./src/bsplines/PeriodicBSplineR1toR2.ts":
/*!***********************************************!*\
  !*** ./src/bsplines/PeriodicBSplineR1toR2.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BSplineR1toR2_1 = __webpack_require__(/*! ./BSplineR1toR2 */ "./src/bsplines/BSplineR1toR2.ts");
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
const AbstractBSplineR1toR2_1 = __webpack_require__(/*! ./AbstractBSplineR1toR2 */ "./src/bsplines/AbstractBSplineR1toR2.ts");
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
const PeriodicBSplineR1toR1_1 = __webpack_require__(/*! ./PeriodicBSplineR1toR1 */ "./src/bsplines/PeriodicBSplineR1toR1.ts");
const AbstractBSplineR1toR2DifferentialProperties_1 = __webpack_require__(/*! ./AbstractBSplineR1toR2DifferentialProperties */ "./src/bsplines/AbstractBSplineR1toR2DifferentialProperties.ts");
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

/***/ "./src/models/AbstractCurveModel.ts":
/*!******************************************!*\
  !*** ./src/models/AbstractCurveModel.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Vector2d_1 = __webpack_require__(/*! ../mathVector/Vector2d */ "./src/mathVector/Vector2d.ts");
const AbstractOptimizationProblemBSplineR1toR2_1 = __webpack_require__(/*! ../bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2 */ "./src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2.ts");
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
    optimize(selectedControlPoint, ndcX, ndcY) {
        if (this.optimizationProblem && this.optimizer) {
            //const p = this._spline.freeControlPoints[selectedControlPoint].clone()
            const p = this.optimizationProblem.spline.freeControlPoints[selectedControlPoint].clone();
            const distance = Math.sqrt(Math.pow(ndcX - p.x, 2) + Math.pow(ndcY - p.y, 2));
            //console.log(ndcX - p.x)
            const numberOfStep = 3 * Math.ceil(distance * 10);
            //const numberOfStep = 1
            for (let i = 1; i <= numberOfStep; i += 1) {
                let alpha = i / numberOfStep;
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
                console.log("100*mu");
            }
        }
        this.success = true;
        if (numSteps > 100) {
            console.log("numSteps: " + numSteps);
            console.log("t: " + t);
            console.log("trustRadius: " + trustRadius);
        }
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
        let px = 100;
        let size = Math.min(window.innerWidth, window.innerHeight) - px;
        this.canvas.width = size;
        this.canvas.height = size;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.3, 0.3, 0.3, 1);
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
        let toggleButtonCurvatureExtrema = document.getElementById("toggleButtonCurvatureExtrema");
        let toggleButtonInflection = document.getElementById("toggleButtonInflections");
        toggleButtonCurvatureExtrema.checked = true;
        toggleButtonInflection.checked = true;
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

/***/ "./src/views/WireEventListner.ts":
/*!***************************************!*\
  !*** ./src/views/WireEventListner.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function wireEventListner(canvas, curveSceneView) {
    var _a;
    hideContextMenu();
    function mouse_get_NormalizedDeviceCoordinates(event) {
        var x, y, rect = canvas.getBoundingClientRect(), ev;
        ev = event;
        x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
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
    canvas.addEventListener('mousedown', mouse_click, false);
    canvas.addEventListener('mousemove', mouse_drag, false);
    canvas.addEventListener('mouseup', mouse_stop_drag, false);
    canvas.addEventListener('touchstart', touch_click, false);
    canvas.addEventListener('touchmove', touch_drag, false);
    canvas.addEventListener('touchend', touch_stop_drag, false);
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
    let toggleButtonCurvatureExtrema = document.getElementById("toggleButtonCurvatureExtrema");
    let toggleButtonInflection = document.getElementById("toggleButtonInflections");
    function toggleControlOfCurvatureExtrema() {
        curveSceneView.toggleControlOfCurvatureExtrema();
    }
    function toggleControlOfInflections() {
        curveSceneView.toggleControlOfInflections();
    }
    function selectCurveCategory(event) {
        curveSceneView.selectCurveCategory(event.detail.category);
    }
    toggleButtonCurvatureExtrema.addEventListener('click', toggleControlOfCurvatureExtrema);
    toggleButtonInflection.addEventListener('click', toggleControlOfInflections);
    let app = document.getElementsByTagName("app-curves-and-surfaces")[0];
    app.addEventListener("changeCurveCategory", selectCurveCategory);
}
exports.wireEventListner = wireEventListner;


/***/ }),

/***/ "./src/webComponents/AppCurvesAndSurfaces.ts":
/*!***************************************************!*\
  !*** ./src/webComponents/AppCurvesAndSurfaces.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const template = document.createElement('template');
template.innerHTML = `
    <curve-category></curve-category>
    <copyright-years></copyright-years>
`;
const CopyrightYears_1 = __webpack_require__(/*! ./CopyrightYears */ "./src/webComponents/CopyrightYears.ts");
const CurveCategory_1 = __webpack_require__(/*! ./CurveCategory */ "./src/webComponents/CurveCategory.ts");
class AppCurvesAndSurfaces extends HTMLElement {
    constructor() {
        super();
        window.customElements.define('copyright-years', CopyrightYears_1.CopyrightYears);
        window.customElements.define('curve-category', CurveCategory_1.CurveCategory);
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
            <option id= "option1" value="0" selected="selected"> Open planar </option>
            <option id= "option2" value="1" > Closed planar </option>
            <option id= "option3" value="2" > Alternative open planar </option>
            <option id= "option4" value="3" > Alternative closed planar </option>
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
            window.webkitRequestAnimationFrame ||
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
        window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
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
const WireEventListner_1 = __webpack_require__(/*! ./views/WireEventListner */ "./src/views/WireEventListner.ts");
const AppCurvesAndSurfaces_1 = __webpack_require__(/*! ./webComponents/AppCurvesAndSurfaces */ "./src/webComponents/AppCurvesAndSurfaces.ts");
function main() {
    let canvas = document.getElementById("webgl");
    let gl = webgl_utils_1.WebGLUtils().setupWebGL(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    let curveModel = new CurveModel_1.CurveModel();
    let curveSceneView = new CurveSceneView_1.CurveSceneView(canvas, gl, curveModel);
    window.customElements.define('app-curves-and-surfaces', AppCurvesAndSurfaces_1.AppCurvesAndSurfaces);
    WireEventListner_1.wireEventListner(canvas, curveSceneView);
}
exports.main = main;
main();

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map