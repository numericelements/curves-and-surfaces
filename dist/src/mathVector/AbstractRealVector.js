"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRealVector = void 0;
const Vectors_1 = require("../namedConstants/Vectors");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const AbstractVector_1 = require("./AbstractVector");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
/**
 * Abstract base for real vectors
 */
class AbstractRealVector extends AbstractVector_1.AbstractVector {
    get spaceType() { return BSplineR1toRn_1.VectorSpaceType.REAL; }
    get vectorSpace() { return this._vectorSpace; }
    // Default implementations for coordinate accessors
    get x() { return this.getCoordinate(0); }
    // Override with more specific types
    add(other) {
        return super.add(other);
    }
    subtract(other) {
        return super.subtract(other);
    }
    scale(scalar) {
        const result = this._vectorSpace.scaleDescriptor(scalar, this.descriptor);
        // return this.createVectorFromRaw(result);
        return result;
    }
    dot(other) {
        return super.dot(other);
    }
    revert() {
        return super.revert();
    }
    toArray() {
        return this.coordinates;
    }
    toString() {
        return this.vectorType + `(${this.toArray().join(', ')})` + ` ` + this._vectorSpace.toString();
    }
    equals(other, tolerance) {
        return super.equals(other, tolerance);
    }
    isParallel(other, angularTolerance) {
        this.validateCompatibility(other);
        if (angularTolerance === undefined)
            angularTolerance = Vectors_1.ANGULAR_TOL_VECTOR;
        const thisNorm = this.norm();
        const otherNorm = other.norm();
        if (thisNorm < Vectors_1.LINEAR_TOL_VECTOR || otherNorm < Vectors_1.LINEAR_TOL_VECTOR) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'isParallel', Vectors_1.EM_VECTOR_NORM_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        const dotProduct = this.dot(other);
        const angle = Math.acos(Math.abs(dotProduct / (thisNorm * otherNorm)));
        return angle <= angularTolerance;
    }
    isOrthogonal(other, angularTolerance) {
        this.validateCompatibility(other);
        if (this.dimension === 1) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'isOrthogonal', Vectors_1.EM_ISORTHOGONAL_NOT_APPLICABLE);
            throw new RangeError(error.generateMessageString());
        }
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
        const angle = Math.acos(Math.abs(dotProduct / (thisNorm * otherNorm)));
        const halfPi = Math.atan(1) * 2;
        return (halfPi - angle) <= angularTolerance;
    }
}
exports.AbstractRealVector = AbstractRealVector;
