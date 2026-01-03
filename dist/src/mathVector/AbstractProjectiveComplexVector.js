"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractProjectiveComplexVector = void 0;
const ProjectiveComplexVectors_1 = require("../ErrorMessages/ProjectiveComplexVectors");
const Vectors_1 = require("../namedConstants/Vectors");
const AbstractVector_1 = require("./AbstractVector");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
/**
 * Abstract base for projective complex vectors
 */
class AbstractProjectiveComplexVector extends AbstractVector_1.AbstractVector {
    get vectorSpace() { return this._vectorSpace; }
    add(other) {
        return super.add(other);
    }
    subtract(other) {
        return super.subtract(other);
    }
    scale(scalar) {
        const result = this._vectorSpace.scaleDescriptor(scalar, this.descriptor);
        return result;
        // return this.createVectorFromRaw(result);
    }
    revert() {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'revert', ProjectiveComplexVectors_1.EM_REVERT_NOT_APPLICABLE_PROJECTIVE_COMPLEX);
        throw new RangeError(error.generateMessageString());
    }
    toArray() {
        const coord = [];
        for (let i = 0; i < this.dimension; i++) {
            const c = this.getCoordinate(i);
            coord.push(c.real);
            coord.push(c.imaginary);
        }
        return coord;
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
        if (thisNorm === 0 || otherNorm === 0) {
            return true; // Zero vectors are colinear
        }
        const dotProduct = this.dot(other);
        const ratio = Math.abs(dotProduct / (thisNorm * otherNorm));
        return ratio >= 1 - tolerance;
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
exports.AbstractProjectiveComplexVector = AbstractProjectiveComplexVector;
