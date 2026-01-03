"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplexVectorSpace2DStrategy = void 0;
const ComplexVectorSpace_1 = require("../ErrorMessages/ComplexVectorSpace");
const ComplexTypeTag_1 = require("../namedConstants/ComplexTypeTag");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const WeightTypeTags_1 = require("../namedConstants/WeightTypeTags");
const ComplexNumberFactory_1 = require("./ComplexNumberFactory");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_1 = require("./Weight");
class ComplexVectorSpace2DStrategy {
    // Implementation for 2D vectors
    areSameDimension(v1, v2) {
        if ((0, VectorSpaceUtilities_1.isVector2D)(v1) && (0, VectorSpaceUtilities_1.isVector2D)(v2))
            return true;
        return false;
    }
    isInVectorSpace(v) {
        if ((0, VectorSpaceUtilities_1.isVector2D)(v))
            return true;
        return false;
    }
    createVector(coordinates) {
        const complex1 = { type: ComplexTypeTag_1.COMPLEX, real: coordinates[0][0], imaginary: coordinates[0][1] };
        const complex2 = { type: ComplexTypeTag_1.COMPLEX, real: coordinates[1][0], imaginary: coordinates[1][1] };
        return { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [complex1, complex2] };
    }
    defaultVect() {
        const nullComplex = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        return { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [nullComplex, nullComplex] };
    }
    addDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector2D)(a) && (0, VectorSpaceUtilities_1.isVector2D)(b)) {
            return { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [
                    (0, ComplexNumberFactory_1.addComplexUsingDescriptors)(a.coordinates[0], b.coordinates[0]),
                    (0, ComplexNumberFactory_1.addComplexUsingDescriptors)(a.coordinates[1], b.coordinates[1])
                ] };
        }
        else {
            throw new RangeError();
        }
    }
    normDescriptor(vector) {
        if ((0, VectorSpaceUtilities_1.isVector2D)(vector)) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromComplexVectorSpaceToProjectiveComplexVectorSpace', ComplexVectorSpace_1.EM_TRANSFORMATION_NOT_AVAILABLE);
            throw new RangeError(error.generateMessageString());
        }
        else {
            throw new RangeError();
        }
    }
    dotDescriptors(a, b) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'crossProduct', ComplexVectorSpace_1.EM_DOT_PRODUCT_NOT_APPLICABLE_DIM2);
        throw new RangeError(error.generateMessageString());
    }
    scaleDescriptor(scaleFactor, vector) {
        if (typeof scaleFactor === 'number') {
            if ((0, VectorSpaceUtilities_1.isVector2D)(vector)) {
                const result = vector.coordinates.map((val) => ({ type: ComplexTypeTag_1.COMPLEX, real: val.real * scaleFactor, imaginary: val.imaginary * scaleFactor }));
                return { type: vector.type, coordinates: [
                        { type: ComplexTypeTag_1.COMPLEX, real: result[0].real, imaginary: result[0].imaginary },
                        { type: ComplexTypeTag_1.COMPLEX, real: result[1].real, imaginary: result[1].imaginary }
                    ] };
            }
            else {
                throw new RangeError();
            }
        }
        else {
            if ((0, VectorSpaceUtilities_1.isVector2D)(vector)) {
                const result = vector.coordinates.map((val) => (0, ComplexNumberFactory_1.multiplyComplexUsingDescriptors)(scaleFactor, val));
                return { type: vector.type, coordinates: [
                        { type: ComplexTypeTag_1.COMPLEX, real: result[0].real, imaginary: result[0].imaginary },
                        { type: ComplexTypeTag_1.COMPLEX, real: result[1].real, imaginary: result[1].imaginary }
                    ] };
            }
            else {
                throw new RangeError();
            }
        }
    }
    subtractDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector2D)(a) && (0, VectorSpaceUtilities_1.isVector2D)(b)) {
            return { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [
                    (0, ComplexNumberFactory_1.subtractComplexUsingDescriptors)(a.coordinates[0], b.coordinates[0]),
                    (0, ComplexNumberFactory_1.subtractComplexUsingDescriptors)(a.coordinates[1], b.coordinates[1])
                ] };
        }
        else {
            throw new RangeError();
        }
    }
    cloneVector(vector) {
        if ((0, VectorSpaceUtilities_1.isVector2D)(vector)) {
            return { type: VectorTypeTags_1.COMPLEXVECTOR2D, coordinates: [
                    { type: ComplexTypeTag_1.COMPLEX, real: vector.coordinates[0].real, imaginary: vector.coordinates[0].imaginary },
                    { type: ComplexTypeTag_1.COMPLEX, real: vector.coordinates[1].real, imaginary: vector.coordinates[1].imaginary }
                ] };
        }
        else {
            throw new RangeError();
        }
    }
    fromComplexVectorSpaceToRealVectorSpace(vector) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromComplexVectorSpaceToRealVectorSpace', ComplexVectorSpace_1.EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }
    fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector, weight = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight() }) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromComplexVectorSpaceToProjectiveComplexVectorSpace', ComplexVectorSpace_1.EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }
}
exports.ComplexVectorSpace2DStrategy = ComplexVectorSpace2DStrategy;
