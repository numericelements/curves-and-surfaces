"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = exports.containsNaN = exports.randomVector = exports.isZeroVector = exports.product_v1_v2t = exports.product_v_vt = exports.zeroVector = exports.norm1 = exports.norm = exports.squaredNorm = exports.addSecondVectorToFirst = exports.addTwoVectors = exports.dotProduct = exports.saxpy2 = exports.saxpy = exports.divideVectorByScalar = exports.multiplyVectorByScalar = void 0;
const SquareMatrix_1 = require("./SquareMatrix");
const DenseMatrix_1 = require("./DenseMatrix");
/**
 * Multiply a vector by a scalar
 * @param vector vector
 * @param value scalar
 */
function multiplyVectorByScalar(vector, value) {
    let result = [];
    for (let i = 0; i < vector.length; i += 1) {
        result.push(vector[i] * value);
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
    for (let i = 0; i < vector.length; i += 1) {
        result.push(vector[i] / value);
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
function squaredNorm(v) {
    let result = 0;
    for (let i = 0; i < v.length; i += 1) {
        result += v[i] * v[i];
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
function norm1(v) {
    let result = 0;
    for (let i = 0; i < v.length; i += 1) {
        result += Math.abs(v[i]);
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
;
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
function isZeroVector(v) {
    const n = v.length;
    for (let i = 0; i < v.length; i += 1) {
        if (v[i] !== 0) {
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
function containsNaN(v) {
    const n = v.length;
    for (let i = 0; i < v.length; i += 1) {
        if (isNaN(v[i])) {
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
    return x ? x < 0 ? -1 : 1 : 0;
}
exports.sign = sign;
