"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractComplexVector = void 0;
const Vectors_1 = require("../namedConstants/Vectors");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const AbstractVector_1 = require("./AbstractVector");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
/**
 * Abstract base for complex vectors
 */
class AbstractComplexVector extends AbstractVector_1.AbstractVector {
    get spaceType() { return BSplineR1toRn_1.VectorSpaceType.COMPLEX; }
    get vectorSpace() { return this._vectorSpace; }
    add(other) {
        return super.add(other);
    }
    subtract(other) {
        return super.subtract(other);
    }
    dot(other) {
        return super.dot(other);
    }
    scale(scalar) {
        const result = this._vectorSpace.scaleDescriptor(scalar, this.descriptor);
        return result;
        // return this.createVectorFromRaw(result);
    }
    revert() {
        return super.revert();
    }
    // Complex-specific implementations
    getReal(index) {
        const coord = this.getCoordinate(index);
        return coord.real;
    }
    getImaginary(index) {
        const coord = this.getCoordinate(index);
        return coord.imaginary;
    }
    toArray() {
        let result = [];
        for (let i = 0; i < this.dimension; i++) {
            result.push(this.coordinates[i].real);
            result.push(this.coordinates[i].imaginary);
        }
        return result;
    }
    equals(other, tolerance) {
        return super.equals(other, tolerance);
    }
    isParallel(other, tolerance) {
        this.validateCompatibility(other);
        if (tolerance === undefined)
            tolerance = Vectors_1.LINEAR_TOL_VECTOR;
        const thisNorm = this.norm();
        const otherNorm = other.norm();
        if (thisNorm < Vectors_1.LINEAR_TOL_VECTOR || otherNorm < Vectors_1.LINEAR_TOL_VECTOR) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'isParallel', Vectors_1.EM_VECTOR_NORM_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        const dotProduct = this.dot(other);
        const ratio = Math.abs(dotProduct / (thisNorm * otherNorm));
        return ratio >= (1 - tolerance);
    }
    isOrthogonal(other, angularTolerance) {
        this.validateCompatibility(other);
        if (angularTolerance === undefined)
            angularTolerance = Vectors_1.ANGULAR_TOL_VECTOR;
        const thisNorm = this.norm();
        const otherNorm = other.norm();
        if (thisNorm < Vectors_1.LINEAR_TOL_VECTOR || otherNorm < Vectors_1.LINEAR_TOL_VECTOR) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'isOrthogonal', Vectors_1.EM_VECTOR_NORM_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        // better to use cross product if available
        const dotProduct = this.dot(other);
        const ratio = Math.abs(dotProduct / (thisNorm * otherNorm));
        return ratio <= angularTolerance;
    }
}
exports.AbstractComplexVector = AbstractComplexVector;
