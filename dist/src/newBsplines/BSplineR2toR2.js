"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_BSpline_R2_to_R2 = exports.BSplineR2toR2 = void 0;
const Vector2d_1 = require("../mathVector/Vector2d");
const Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
const BSplineR1toR2_1 = require("./BSplineR1toR2");
/**
 * A B-Spline function from a two dimensional real space to a two dimensional real space
 */
class BSplineR2toR2 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [[new Vector2d_1.Vector2d(0, 0)]], knots = [[0, 1], [0, 1]]) {
        //controlPoints[i][j]
        this._controlPoints = [];
        //knots[0] =  knots_i
        //knots[1] =  knots_j
        this._knots = [];
        //degree[0] = degree_i
        //degree[1] = degree_j
        this._degree = [0, 0];
        this._controlPoints = controlPoints;
        this._knots = knots;
        this._degree[0] = this._knots[0].length - this._controlPoints.length - 1;
        this._degree[1] = this._knots[1].length - this._controlPoints[0].length - 1;
        if (this._degree[0] < 0 || this._degree[1] < 0) {
            throw new Error("Negative degree BSpline_R2_to_R2 are not supported");
        }
    }
    get controlPoints() {
        return this._controlPoints;
    }
    visibleControlPoints() {
        return this.controlPoints;
    }
    get knots() {
        return this._knots;
    }
    /**
 * B-Spline evaluation
 * @param u The parameter u
 * @param v The parameter v
 * @returns the value of the B-Spline at (u, v)
 */
    evaluate(u, v) {
        const uSpan = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(u, this._knots[0], this._degree[0]);
        const uBasis = (0, Piegl_Tiller_NURBS_Book_1.basisFunctions)(uSpan, u, this._knots[0], this._degree[0]);
        const vSpan = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(v, this._knots[1], this._degree[1]);
        const vBasis = (0, Piegl_Tiller_NURBS_Book_1.basisFunctions)(vSpan, v, this._knots[1], this._degree[1]);
        const uInd = uSpan - this._degree[0];
        const vInd = vSpan - this._degree[1];
        let result = new Vector2d_1.Vector2d(0, 0);
        for (let j = 0; j <= this._degree[1]; j += 1) {
            let temp = new Vector2d_1.Vector2d(0, 0);
            for (let i = 0; i <= this._degree[0]; i += 1) {
                temp = temp.add(this._controlPoints[uInd + i][vInd + j].multiply(uBasis[i]));
            }
            result = result.add(temp.multiply(vBasis[j]));
        }
        return result;
    }
    moveControlPoint(indices, deltaX, deltaY) {
        this.controlPoints[indices.i][indices.j].x += deltaX;
        this.controlPoints[indices.i][indices.j].y += deltaY;
        //console.log(deltaX)
    }
    uGrevilleAbscissae() {
        let result = [];
        for (let i = 0; i < this.controlPoints.length; i += 1) {
            let sum = 0;
            for (let j = i + 1; j < i + this._degree[0] + 1; j += 1) {
                sum += this._knots[0][j];
            }
            result.push(sum / this._degree[0]);
        }
        return result;
    }
    vGrevilleAbscissae() {
        let result = [];
        for (let i = 0; i < this.controlPoints[0].length; i += 1) {
            let sum = 0;
            for (let j = i + 1; j < i + this._degree[1] + 1; j += 1) {
                sum += this.knots[1][j];
            }
            result.push(sum / this._degree[1]);
        }
        return result;
    }
    insertKnotU(u, times = 1) {
        if (times <= 0) {
            return;
        }
        const index = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(u, this._knots[0], this._degree[0]);
        let multiplicity = 0;
        if (u === this._knots[0][index]) {
            multiplicity = this.knotMultiplicityU(index);
        }
        for (let t = 0; t < times; t += 1) {
            const m = this.controlPoints.length;
            const n = this.controlPoints[0].length;
            let newControlPoints = [];
            for (let i = 0; i < m + 1; i += 1) {
                newControlPoints.push([]);
            }
            for (let j = 0; j < n; j += 1) {
                for (let i = 0; i < index - this._degree[0] + 1; i += 1) {
                    newControlPoints[i][j] = this.controlPoints[i][j];
                }
                for (let i = index - this._degree[0] + 1; i <= index - multiplicity; i += 1) {
                    let alpha = (u - this._knots[0][i]) / (this._knots[0][i + this._degree[0]] - this._knots[0][i]);
                    newControlPoints[i][j] = this.controlPoints[i - 1][j].multiply(1 - alpha).add(this.controlPoints[i][j].multiply(alpha));
                }
                for (let i = index - multiplicity; i < m; i += 1) {
                    newControlPoints[i + 1][j] = this.controlPoints[i][j];
                }
            }
            //update knots
            this._knots[0].splice(index + 1, 0, u);
            this._controlPoints = newControlPoints;
        }
    }
    insertKnotV(v, times = 1) {
        if (times <= 0) {
            return;
        }
        const index = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(v, this._knots[1], this._degree[1]);
        let multiplicity = 0;
        if (v === this._knots[1][index]) {
            multiplicity = this.knotMultiplicityU(index);
        }
        for (let t = 0; t < times; t += 1) {
            const m = this.controlPoints.length;
            const n = this.controlPoints[0].length;
            let newControlPoints = [];
            for (let i = 0; i < m; i += 1) {
                newControlPoints.push([]);
            }
            for (let i = 0; i < m; i += 1) {
                for (let j = 0; j < index - this._degree[1] + 1; j += 1) {
                    newControlPoints[i][j] = this.controlPoints[i][j];
                }
                for (let j = index - this._degree[1] + 1; j <= index - multiplicity; j += 1) {
                    let alpha = (v - this._knots[1][j]) / (this._knots[1][j + this._degree[1]] - this._knots[1][j]);
                    newControlPoints[i][j] = this.controlPoints[i][j - 1].multiply(1 - alpha).add(this.controlPoints[i][j].multiply(alpha));
                }
                for (let j = index - multiplicity; j < n; j += 1) {
                    newControlPoints[i][j + 1] = this.controlPoints[i][j];
                }
            }
            //update knots
            this._knots[1].splice(index + 1, 0, v);
            this._controlPoints = newControlPoints;
        }
    }
    knotMultiplicityU(indexFromFindSpan) {
        let result = 0, i = 0;
        while (this._knots[0][indexFromFindSpan + i] === this._knots[0][indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    }
    knotMultiplicityV(indexFromFindSpan) {
        let result = 0, i = 0;
        while (this._knots[1][indexFromFindSpan + i] === this._knots[1][indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    }
    elevateDegreeU() {
        const m = this.controlPoints.length;
        const n = this.controlPoints[0].length;
        let splines = [];
        for (let j = 0; j < n; j += 1) {
            let cp = [];
            for (let i = 0; i < m; i += 1) {
                cp.push(this._controlPoints[i][j]);
            }
            splines.push(new BSplineR1toR2_1.BSplineR1toR2(cp, this._knots[0]));
        }
        for (let i = 0; i < splines.length; i += 1) {
            splines[i].elevateDegree();
        }
        this._knots[0] = splines[0].knots;
        this._degree[0] = splines[0].degree;
        let newControlPoints = [];
        /*
        for (let j = 0; j < this.controlPoints[0].length; j += 1 ) {
            newControlPoints.push([])
            for (let i = 0; i < splines[0].controlPoints.length; i += 1) {
                newControlPoints[i].push(splines[j].controlPoints[i])
            }
        }
        */
        /*
       for (let j = 0; j < this.controlPoints[0].length; j += 1) {
            newControlPoints.push([])
            for (let i = 0; i < splines[0].controlPoints.length; i += 1 ) {
                newControlPoints[j].push(splines[j].controlPoints[i])
            }
        }
        */
        /*
        for (let i = 0; i < splines.length; i += 1 ) {
            newControlPoints.push([])
            for (let j = 0; j < splines[0].controlPoints.length; j += 1) {
                newControlPoints[i].push(splines[i].controlPoints[j])
            }
        }
        */
        for (let i = 0; i < splines[0].controlPoints.length; i += 1) {
            newControlPoints.push([]);
            for (let j = 0; j < splines.length; j += 1) {
                newControlPoints[i].push(splines[j].controlPoints[i]);
            }
        }
        this._controlPoints = newControlPoints;
    }
    elevateDegreeV() {
        const m = this.controlPoints.length;
        const n = this.controlPoints[0].length;
        let splines = [];
        for (let i = 0; i < m; i += 1) {
            let cp = [];
            for (let j = 0; j < n; j += 1) {
                cp.push(this._controlPoints[i][j]);
            }
            splines.push(new BSplineR1toR2_1.BSplineR1toR2(cp, this._knots[1]));
        }
        for (let i = 0; i < splines.length; i += 1) {
            splines[i].elevateDegree();
        }
        this._knots[1] = splines[0].knots;
        this._degree[1] = splines[0].degree;
        let newControlPoints = [];
        for (let i = 0; i < this.controlPoints.length; i += 1) {
            newControlPoints.push([]);
            for (let j = 0; j < splines[0].controlPoints.length; j += 1) {
                newControlPoints[i].push(splines[i].controlPoints[j]);
            }
        }
        this._controlPoints = newControlPoints;
    }
}
exports.BSplineR2toR2 = BSplineR2toR2;
function create_BSpline_R2_to_R2(controlPoints, knots) {
    let newControlPoints = [];
    const n = controlPoints.length;
    const m = controlPoints[0].length;
    for (let i = 0; i < n; i += 1) {
        newControlPoints.push([]);
        for (let j = 0; j < m; j += 1) {
            newControlPoints[i].push(new Vector2d_1.Vector2d(controlPoints[i][j][0], controlPoints[i][j][1]));
        }
    }
    return new BSplineR2toR2(newControlPoints, knots);
}
exports.create_BSpline_R2_to_R2 = create_BSpline_R2_to_R2;
