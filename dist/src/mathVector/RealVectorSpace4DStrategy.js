"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealVectorSpace4DStrategy = void 0;
const RealVectorSpace_1 = require("../ErrorMessages/RealVectorSpace");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
class RealVectorSpace4DStrategy {
    // Implementation for 4D vectors
    areSameDimension(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector4D)(a) && (0, VectorSpaceUtilities_1.isVector4D)(b))
            return true;
        return false;
    }
    isInVectorSpace(v) {
        if ((0, VectorSpaceUtilities_1.isVector4D)(v))
            return true;
        return false;
    }
    createVector(coordinates) {
        let vector = { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [coordinates[0], coordinates[1], coordinates[2], coordinates[3]] };
        return vector;
    }
    defaultVect() {
        return { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [0, 0, 0, 0] };
    }
    addDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector4D)(a) && (0, VectorSpaceUtilities_1.isVector4D)(b)) {
            return { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], a.coordinates[2] + b.coordinates[2], a.coordinates[3] + b.coordinates[3]] };
        }
        else {
            throw new RangeError();
        }
    }
    subtractDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector4D)(a) && (0, VectorSpaceUtilities_1.isVector4D)(b)) {
            return { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], a.coordinates[2] - b.coordinates[2], a.coordinates[3] - b.coordinates[3]] };
        }
        else {
            throw new RangeError();
        }
    }
    scaleDescriptor(scalar, v) {
        if ((0, VectorSpaceUtilities_1.isVector4D)(v)) {
            return { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2], scalar * v.coordinates[3]] };
        }
        else {
            throw new RangeError();
        }
    }
    cloneVector(v) {
        if ((0, VectorSpaceUtilities_1.isVector4D)(v)) {
            return { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2], v.coordinates[3]] };
        }
        else {
            throw new RangeError();
        }
    }
    normDescriptor(v) {
        if ((0, VectorSpaceUtilities_1.isVector4D)(v)) {
            let result = 0;
            for (const component of v.coordinates) {
                result += Math.pow(component, 2);
            }
            result = Math.sqrt(result);
            return result;
        }
        else {
            throw new RangeError();
        }
    }
    normalizeRaw(v) {
        if ((0, VectorSpaceUtilities_1.isVector4D)(v)) {
            const norm = this.normDescriptor(v);
            return { type: VectorTypeTags_1.REALVECTOR4D, coordinates: [v.coordinates[0] / norm, v.coordinates[1] / norm, v.coordinates[2] / norm, v.coordinates[3] / norm] };
        }
        else {
            throw new RangeError();
        }
    }
    crossProductRaw(a, b) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'crossProduct', RealVectorSpace_1.EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM4);
        throw new RangeError(error.generateMessageString());
    }
    dotDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector4D)(a) && (0, VectorSpaceUtilities_1.isVector4D)(b)) {
            return a.coordinates[0] * b.coordinates[0] + a.coordinates[1] * b.coordinates[1] + a.coordinates[2] * b.coordinates[2] + a.coordinates[3] * b.coordinates[3];
        }
        else {
            throw new RangeError();
        }
    }
    fromRealVectorSpaceToProjectiveVectorSpace(v, weight) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', RealVectorSpace_1.EM_REALVECTOR_DIMENSION_INCOMPATIBLE_PROJSPACE);
        throw new RangeError(error.generateMessageString());
    }
    fromRealVectorSpaceToComplexVectorSpace(v) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', RealVectorSpace_1.EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
}
exports.RealVectorSpace4DStrategy = RealVectorSpace4DStrategy;
