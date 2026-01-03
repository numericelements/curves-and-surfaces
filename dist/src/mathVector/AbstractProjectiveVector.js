"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractProjectiveVector = void 0;
const ProjectiveVectors_1 = require("../ErrorMessages/ProjectiveVectors");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
const Vectors_1 = require("../namedConstants/Vectors");
const AbstractVector_1 = require("./AbstractVector");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
/**
 * Abstract base for projective vectors
 */
class AbstractProjectiveVector extends AbstractVector_1.AbstractVector {
    get spaceType() { return BSplineR1toRn_1.VectorSpaceType.PROJECTIVE; }
    get vectorSpace() { return this._vectorSpace; }
    // Default implementations for coordinate accessors
    get x() { return this.getCoordinate(0); }
    ;
    get y() { return this.getCoordinate(1); }
    ;
    get w() { return this.getCoordinate(this.dimension - 1); }
    ;
    checkValidityWeightStatus(weightOrVSpace, vectorSpace) {
        let strictlyPosWeight = true;
        if (vectorSpace !== undefined && vectorSpace.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights) {
            if (weightOrVSpace !== undefined && weightOrVSpace.strictlyPositive) {
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', Vectors_1.EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
            strictlyPosWeight = false;
        }
        if (vectorSpace !== undefined) {
            // When the vector space is explicitly defined and its weight management restricted to stricly positive, the weight must be effectively strictly positive
            if (vectorSpace.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights && weightOrVSpace !== undefined && !weightOrVSpace.strictlyPositive) {
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', Vectors_1.EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
        }
        else if (weightOrVSpace !== undefined && !weightOrVSpace.strictlyPositive) {
            // When the vector space is not explicitly defined and
            // the weight is explicitly defined as not strictly positive, the weight must be effectively strictly positive 
            // since the weight management is: AllStrictlyPositiveWeights
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', Vectors_1.EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        return strictlyPosWeight;
    }
    applyHomogeneousTransformation() {
        if (this.weight.value < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'toVector2DReal', ProjectiveVectors_1.EM_WEIGHT_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        const realCoordinates = [];
        for (let i = 0; i < this._vectorSpace.dimension() - 1; i++) {
            realCoordinates.push(this.coordinates[i] / this.coordinates[this._vectorSpace.dimension() - 1]);
        }
        return realCoordinates;
    }
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
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'revert', ProjectiveVectors_1.EM_REVERT_NOT_APPLICABLE);
        throw new RangeError(error.generateMessageString());
    }
    normalize() {
        return super.normalize();
    }
    toArray() {
        return this.homogeneousCoordinates;
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
exports.AbstractProjectiveVector = AbstractProjectiveVector;
