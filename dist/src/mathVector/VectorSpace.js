"use strict";
/**
 * Core types and interfaces for vector space operations
 * Implements mathematical vector space axioms for real and complex numbers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealVectorSpace = exports.ComplexOps = exports.isComplexVector = exports.isRealVector = exports.isVector1D = exports.Weight = exports.DEFAULT_WEIGHT_VALUE = exports.EM_WEIGHT_VALUE = exports.PROJECTIVEVECTOR3D = exports.VECTOR3D = exports.PROJECTIVEVECTOR2D = exports.VECTOR2D = exports.WEIGHT = exports.COMPLEX = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
// ------------ Type Definitions ------------
exports.COMPLEX = 'Complex';
exports.WEIGHT = 'Weight';
exports.VECTOR2D = 'Vector2D';
exports.PROJECTIVEVECTOR2D = 'ProjectiveVector2D';
exports.VECTOR3D = 'Vector3D';
exports.PROJECTIVEVECTOR3D = 'ProjectiveVector3D';
exports.EM_WEIGHT_VALUE = 'A weight value cannot be negative or null. Cannot proceed.';
exports.DEFAULT_WEIGHT_VALUE = -1;
var Weight = /** @class */ (function () {
    function Weight(weight) {
        this.type = exports.WEIGHT;
        if (weight !== undefined) {
            this.assessmentInputWeightValue(weight);
            this._weight = weight;
        }
        else {
            this._weight = exports.DEFAULT_WEIGHT_VALUE;
        }
    }
    Object.defineProperty(Weight.prototype, "weight", {
        get: function () {
            return this._weight;
        },
        set: function (weight) {
            this.assessmentInputWeightValue(weight);
            this._weight = weight;
        },
        enumerable: false,
        configurable: true
    });
    Weight.prototype.assessmentInputWeightValue = function (weight) {
        if (weight <= 0) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor");
            error.addMessage(exports.EM_WEIGHT_VALUE);
            console.log(error.generateMessageString());
            throw new RangeError(error.generateMessageString());
        }
    };
    return Weight;
}());
exports.Weight = Weight;
// ------------ Type Guards ------------
/**
 * Checks if the vector is one-dimensional
 * @param v Vector to check
 * @returns True if vector is 1D (number or Complex)
 */
function isVector1D(v) {
    return typeof v === 'number' ||
        (Array.isArray(v) && v.length === 2 && !Array.isArray(v[0]));
}
exports.isVector1D = isVector1D;
/**
 * Checks if the vector contains real numbers
 * @param v Vector to check
 * @returns True if vector contains real numbers
 */
function isRealVector(v) {
    return typeof v === 'number' || (Array.isArray(v) && typeof v[0] === 'number');
}
exports.isRealVector = isRealVector;
/**
 * Checks if the vector contains complex numbers
 * @param v Vector to check
 * @returns True if vector contains complex numbers
 */
function isComplexVector(v) {
    return Array.isArray(v) && (v.length === 2 || Array.isArray(v[0]));
}
exports.isComplexVector = isComplexVector;
// export function isProjectiveVector2D(v: Vector): v is ProjectiveVector2D {
//     return (
//         Array.isArray(v) &&
//         v.length === 3 &&
//         typeof v[0] === 'number' &&
//         typeof v[1] === 'number' &&
//         v[2] instanceof Weight
//     );
// }
// ------------ Complex Number Operations ------------
/**
 * Complex number operations helper class
 */
var ComplexOps = /** @class */ (function () {
    function ComplexOps() {
    }
    return ComplexOps;
}());
exports.ComplexOps = ComplexOps;
// ------------ Vector Space Implementations ------------
/**
 * Implementation of a real vector space
 */
var RealVectorSpace = /** @class */ (function () {
    function RealVectorSpace(dimension) {
        if (dimension < 1) {
            throw new Error('Dimension must be positive');
        }
        this.dim = dimension;
    }
    RealVectorSpace.prototype.zero = function () {
        return this.dim === 1 ? 0 : new Array(this.dim).fill(0);
    };
    RealVectorSpace.prototype.add = function (a, b) {
        if (typeof a === 'number' && typeof b === 'number') {
            return a + b;
        }
        return a.map(function (val, i) { return val + b[i]; });
    };
    RealVectorSpace.prototype.scale = function (scalar, v) {
        if (typeof v === 'number') {
            return scalar * v;
        }
        return v.map(function (val) { return scalar * val; });
    };
    RealVectorSpace.prototype.subtract = function (a, b) {
        if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        }
        return a.map(function (val, i) { return val - b[i]; });
    };
    RealVectorSpace.prototype.dimension = function () {
        return this.dim;
    };
    return RealVectorSpace;
}());
exports.RealVectorSpace = RealVectorSpace;
// export class ComplexVectorSpace implements VectorSpace<Complex, ComplexVector> {
//     private readonly dim: number;
//     constructor(dimension: number) {
//         if (dimension < 1) {
//             throw new Error('Dimension must be positive');
//         }
//         this.dim = dimension;
//     }
//     zero(): ComplexVector {
//         return this.dim === 1 ? [0, 0] : Array(this.dim).fill([0, 0]);
//     }
//     // add(a: ComplexVector, b: ComplexVector): ComplexVector {
//     //     if (isVector1D(a) && isVector1D(b)) {
//     //         return ComplexOps.add(a as Complex, b as Complex);
//     //     }
//     //     return (a as Complex[]).map((val, i) => 
//     //         ComplexOps.add(val, (b as Complex[])[i])
//     //     );
//     // }
//     // Overloaded scale method
//     scale(scalar: Complex, vector: Complex[]): Complex[];
//     scale(scalar: number, vector: Complex[]): Complex[];
//     // Implementation of the scale method
//     scale(scalar: Complex | number, vector: Complex[]): Complex[] {
//         if (typeof scalar === 'number') {
//         // Directly scale the real part of the complex vector
//         return vector.map(([real, imag]) => [
//             real * scalar, // Scale real part
//             imag * scalar, // Scale imaginary part
//         ]);
//         } else {
//         // Handle the case where scalar is a complex number
//         return vector.map(([real, imag]) => [
//             real * scalar[0] - imag * scalar[1], // Real part
//             real * scalar[1] + imag * scalar[0], // Imaginary part
//         ]);
//         }
//     }
//     subtract(a: ComplexVector, b: ComplexVector): ComplexVector {
//         if (isVector1D(a) && isVector1D(b)) {
//             return ComplexOps.subtract(a as Complex, b as Complex);
//         }
//         return (a as Complex[]).map((val, i) => 
//             ComplexOps.subtract(val, (b as Complex[])[i])
//         );
//     }
//     dimension() {
//         return this.dim
//     }
// }
