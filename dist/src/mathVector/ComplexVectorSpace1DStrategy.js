"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplexVectorSpace1DStrategy = void 0;
const ComplexVectorSpace_1 = require("../ErrorMessages/ComplexVectorSpace");
const ComplexTypeTag_1 = require("../namedConstants/ComplexTypeTag");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const WeightTypeTags_1 = require("../namedConstants/WeightTypeTags");
const ComplexNumberFactory_1 = require("./ComplexNumberFactory");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_1 = require("./Weight");
class ComplexVectorSpace1DStrategy {
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
        let vector = { type: ComplexTypeTag_1.COMPLEX, real: coordinates[0][0], imaginary: coordinates[0][1] };
        return vector;
    }
    defaultVect() {
        const nullComplex = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        return nullComplex;
    }
    addDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(a) && (0, VectorSpaceUtilities_1.isVector1D)(b)) {
            return (0, ComplexNumberFactory_1.addComplexUsingDescriptors)(a, b);
        }
        else {
            throw new RangeError();
        }
    }
    normDescriptor(vector) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(vector)) {
            return Math.sqrt(vector.real * vector.real + vector.imaginary * vector.imaginary);
        }
        else {
            throw new RangeError();
        }
    }
    dotDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(a) && (0, VectorSpaceUtilities_1.isVector1D)(b)) {
            return a.real * b.real + a.imaginary * b.imaginary;
        }
        else {
            throw new RangeError();
        }
    }
    scaleDescriptor(scaleFactor, vector) {
        if (typeof scaleFactor === 'number') {
            if ((0, VectorSpaceUtilities_1.isVector1D)(vector)) {
                return { type: ComplexTypeTag_1.COMPLEX, real: scaleFactor * vector.real, imaginary: scaleFactor * vector.imaginary };
            }
            else {
                throw new RangeError();
            }
        }
        else {
            if ((0, VectorSpaceUtilities_1.isVector1D)(vector)) {
                return { type: ComplexTypeTag_1.COMPLEX,
                    real: (0, ComplexNumberFactory_1.multiplyComplexUsingDescriptors)(scaleFactor, vector).real,
                    imaginary: (0, ComplexNumberFactory_1.multiplyComplexUsingDescriptors)(scaleFactor, vector).imaginary };
            }
            else {
                throw new RangeError();
            }
        }
    }
    subtractDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(a) && (0, VectorSpaceUtilities_1.isVector1D)(b)) {
            return (0, ComplexNumberFactory_1.subtractComplexUsingDescriptors)(a, b);
        }
        else {
            throw new RangeError();
        }
    }
    cloneVector(vector) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(vector)) {
            return { type: ComplexTypeTag_1.COMPLEX, real: vector.real, imaginary: vector.imaginary };
        }
        else {
            throw new RangeError();
        }
    }
    fromComplexVectorSpaceToRealVectorSpace(vector) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(vector)) {
            return { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [vector.real, vector.imaginary] };
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromComplexVectorSpaceToRealVectorSpace', ComplexVectorSpace_1.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }
    fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector, weight = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight() }) {
        if ((0, VectorSpaceUtilities_1.isVector1D)(vector)) {
            return { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [vector, weight] };
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromComplexVectorSpaceToProjectiveComplexVectorSpace', ComplexVectorSpace_1.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }
}
exports.ComplexVectorSpace1DStrategy = ComplexVectorSpace1DStrategy;
