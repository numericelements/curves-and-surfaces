"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splineRecomposition = exports.BernsteinDecompositionR1toR1 = void 0;
const BinomialCoefficient_1 = require("./BinomialCoefficient");
const BSplineR1toR1_1 = require("./BSplineR1toR1");
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
    elevateDegree(times = 1) {
        let newControlPointsArray = [];
        for (let controlPoint of this.controlPointsArray) {
            newControlPointsArray.push(this.elevateDegreeB(controlPoint, times));
        }
        this.controlPointsArray = newControlPointsArray;
    }
    elevateDegreeB(controlPoints, times = 1) {
        const degree = controlPoints.length - 1;
        let result = [];
        for (let i = 0; i < controlPoints.length + times; i += 1) {
            let cp = 0;
            for (let j = Math.max(0, i - times); j <= Math.min(degree, i); j += 1) {
                const bc0 = (0, BinomialCoefficient_1.binomialCoefficient)(times, i - j);
                const bc1 = (0, BinomialCoefficient_1.binomialCoefficient)(degree, j);
                const bc2 = (0, BinomialCoefficient_1.binomialCoefficient)(degree + times, i);
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
        for (let knot of distinctKnots) {
            for (let j = 0; j < degree + 1; j += 1) {
                knots.push(knot);
            }
        }
        return new BSplineR1toR1_1.BSplineR1toR1(cp, knots);
    }
    getDegree() {
        return this.controlPointsArray[0].length - 1;
    }
    clone() {
        const decompositionCopy = new BernsteinDecompositionR1toR1(this.controlPointsArray.slice());
        return decompositionCopy;
    }
}
exports.BernsteinDecompositionR1toR1 = BernsteinDecompositionR1toR1;
BernsteinDecompositionR1toR1.binomial = (0, BinomialCoefficient_1.memoizedBinomialCoefficient)();
BernsteinDecompositionR1toR1.flopsCounter = 0;
function splineRecomposition(bernsteinDecomposiiton, distinctKnots) {
    const cp = bernsteinDecomposiiton.flattenControlPointsArray();
    const degree = bernsteinDecomposiiton.getDegree();
    let knots = [];
    for (let knot of distinctKnots) {
        for (let j = 0; j < degree + 1; j += 1) {
            knots.push(knot);
        }
    }
    return new BSplineR1toR1_1.BSplineR1toR1(cp, knots);
}
exports.splineRecomposition = splineRecomposition;
