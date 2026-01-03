"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractVector = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const Vectors_1 = require("../namedConstants/Vectors");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
/**
 * Base abstract class implementing common IVector functionality
 */
class AbstractVector {
    get vectorSpace() {
        return this._vectorSpace;
    }
    // Vector operations using the vector space
    add(other) {
        this.validateCompatibility(other);
        const result = this._vectorSpace.addDescriptors(this.descriptor, other.descriptor);
        return result;
        // return this.createVectorFromRaw(result);
    }
    subtract(other) {
        this.validateCompatibility(other);
        const result = this._vectorSpace.subtractDescriptors(this.descriptor, other.descriptor);
        return result;
        // return this.createVectorFromRaw(result);
    }
    // scale(scalar: S): IVector {
    //     const result = this._vectorSpace.scaleRaw(scalar, this.descriptor);
    //     return this.createVectorFromRaw(result);
    // }
    revert() {
        const result = this._vectorSpace.scaleDescriptor(-1, this.descriptor);
        return result;
        // return this.createVectorFromRaw(result);
    }
    norm(tolerance) {
        if (tolerance === undefined)
            tolerance = Vectors_1.LINEAR_TOL_VECTOR;
        if ('normDescriptor' in this._vectorSpace && typeof this._vectorSpace.normDescriptor === 'function') {
            const norm = this._vectorSpace.normDescriptor(this.descriptor);
            if (norm < tolerance) {
                const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "norm", Vectors_1.WM_VECTOR_NORM_TOO_SMALL);
                warning.logMessage();
            }
            return norm;
        }
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'norm', Vectors_1.EM_VECTOR_NOT_APPLICABLE_TO_NORM);
        throw new RangeError(error.generateMessageString());
    }
    normalize(tolerance) {
        if (tolerance === undefined)
            tolerance = Vectors_1.LINEAR_TOL_VECTOR;
        const currentNorm = this.norm(tolerance);
        if (currentNorm < tolerance) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'normalize', Vectors_1.EM_NORM_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        return this.scale((1 / currentNorm));
    }
    dot(other) {
        this.validateCompatibility(other);
        if ('dotDescriptors' in this._vectorSpace && typeof this._vectorSpace.dotDescriptors === 'function') {
            return this._vectorSpace.dotDescriptors(this.descriptor, other.descriptor);
        }
        throw new Error('Dot product not available for this vector space');
    }
    equals(other, tolerance) {
        if (this._vectorSpace !== other.vectorSpace) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'equals', Vectors_1.EM_VECTORS_DIFFERENT_VECTOR_SPACES);
            throw new RangeError(error.generateMessageString());
        }
        const currentVector = this.toArray();
        const otherVector = other.toArray();
        const tol = tolerance !== null && tolerance !== void 0 ? tolerance : Vectors_1.LINEAR_TOL_VECTOR;
        for (let i = 0; i < currentVector.length; i++) {
            if (Math.abs(currentVector[i] - otherVector[i]) > tol) {
                return false;
            }
        }
        return true;
    }
    // Enhanced validation that checks space identity
    validateCompatibility(other) {
        if (this.dimension !== other.dimension) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'validateCompatibility', Vectors_1.EM_VECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
        // Check if vectors belong to the same vector space instance
        if (!this._vectorSpace.isSameSpace(other.vectorSpace)) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'validateCompatibility', Vectors_1.EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }
}
exports.AbstractVector = AbstractVector;
