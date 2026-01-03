"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealVectorSpace1DStrategy = void 0;
const RealVectorSpace_1 = require("../ErrorMessages/RealVectorSpace");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
class RealVectorSpace1DStrategy {
    // Implementation for 1D vectors
    areSameDimension(v1, v2) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(v1) && (0, VectorSpaceUtilities_1.isVector1D)(v2))
            return true;
        return false;
    }
    isInVectorSpace(v) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(v))
            return true;
        return false;
    }
    createVector(coordinates) {
        return coordinates[0];
    }
    defaultVect() {
        return 0;
    }
    addDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(a) && (0, VectorSpaceUtilities_1.isVector1D)(b)) {
            return a + b;
        }
        else {
            throw new RangeError();
        }
    }
    scaleDescriptor(scalar, v) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(v)) {
            return scalar * v;
        }
        else {
            throw new RangeError();
        }
    }
    subtractDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(a) && (0, VectorSpaceUtilities_1.isVector1D)(b)) {
            return a - b;
        }
        else {
            throw new RangeError();
        }
    }
    cloneVector(v) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(v)) {
            return v;
        }
        else {
            throw new RangeError();
        }
    }
    normDescriptor(v) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(v)) {
            return Math.abs(v);
        }
        else {
            throw new RangeError();
        }
    }
    normalizeRaw(v) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(v)) {
            return v / this.normDescriptor(v);
        }
        else {
            throw new RangeError();
        }
    }
    crossProductRaw(a, b) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'crossProduct', RealVectorSpace_1.EM_CROSS_PRODUCT_NOT_APPLICABLE_DIM1);
        throw new RangeError(error.generateMessageString());
    }
    dotDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(a) && (0, VectorSpaceUtilities_1.isVector1D)(b)) {
            return a * b;
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
exports.RealVectorSpace1DStrategy = RealVectorSpace1DStrategy;
