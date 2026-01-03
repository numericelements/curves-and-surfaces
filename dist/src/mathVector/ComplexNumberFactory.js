"use strict";
// ------------ Complex Number Operations ------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplyComplexWeightsUsingDescriptors = exports.subtractComplexWeightsUsingDescriptors = exports.addComplexWeightsUsingDescriptors = exports.magnitudeUsingDescriptor = exports.conjugateUsingDescriptor = exports.subtractComplexUsingDescriptors = exports.multiplyComplexUsingDescriptors = exports.addComplexUsingDescriptors = exports.createComplex = exports.createComplexDescriptor = void 0;
const ComplexOperators_1 = require("../ErrorMessages/ComplexOperators");
const ComplexTypeTag_1 = require("../namedConstants/ComplexTypeTag");
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
const WeightTypeTags_1 = require("../namedConstants/WeightTypeTags");
const Complex_1 = require("./Complex");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_1 = require("./Weight");
/**
 * Complex number operations factory
 */
/**
 * Creates the descriptor of a complex number from two real numbers
 */
function createComplexDescriptor(real, imaginary) {
    return { type: ComplexTypeTag_1.COMPLEX, real: real, imaginary: imaginary };
}
exports.createComplexDescriptor = createComplexDescriptor;
/**
 * Creates a complex number from two real numbers
 */
function createComplex(real, imaginary) {
    return new Complex_1.Complex(real, imaginary);
}
exports.createComplex = createComplex;
/**
 * Add two complex numbers using their descriptors
 */
function addComplexUsingDescriptors(a, b) {
    return { type: ComplexTypeTag_1.COMPLEX, real: a.real + b.real, imaginary: a.imaginary + b.imaginary };
}
exports.addComplexUsingDescriptors = addComplexUsingDescriptors;
/**
 * Multiply two complex numbers using their descriptors
 */
function multiplyComplexUsingDescriptors(a, b) {
    return { type: ComplexTypeTag_1.COMPLEX,
        real: a.real * b.real - a.imaginary * b.imaginary,
        imaginary: a.real * b.imaginary + a.imaginary * b.real
    };
}
exports.multiplyComplexUsingDescriptors = multiplyComplexUsingDescriptors;
/**
 * Subtract two complex numbers using their descriptors
 */
function subtractComplexUsingDescriptors(a, b) {
    return { type: ComplexTypeTag_1.COMPLEX, real: a.real - b.real, imaginary: a.imaginary - b.imaginary };
}
exports.subtractComplexUsingDescriptors = subtractComplexUsingDescriptors;
/**
 * Returns the complex conjugate using its descriptor
 */
function conjugateUsingDescriptor(a) {
    return { type: ComplexTypeTag_1.COMPLEX, real: a.real, imaginary: -a.imaginary };
}
exports.conjugateUsingDescriptor = conjugateUsingDescriptor;
/**
 * Returns the magnitude of a complex number using its descriptor
 * @param a
 * @returns
 */
function magnitudeUsingDescriptor(a) {
    return Math.sqrt(a.real * a.real + a.imaginary * a.imaginary);
}
exports.magnitudeUsingDescriptor = magnitudeUsingDescriptor;
/**
 * Adds two complex weights using their descriptors
 */
function addComplexWeightsUsingDescriptors(a, b) {
    const realRes = a.real.value + b.real.value;
    const imaginaryRes = a.imaginary.value + b.imaginary.value;
    if (Math.abs(realRes) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) >= ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
        return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(imaginaryRes) };
    }
    else if (Math.abs(realRes) >= ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
        return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(realRes), imaginary: new Weight_1.Weight(0, false) };
    }
    else if (Math.abs(realRes) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
        return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(0, false) };
    }
    return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(realRes), imaginary: new Weight_1.Weight(imaginaryRes) };
}
exports.addComplexWeightsUsingDescriptors = addComplexWeightsUsingDescriptors;
/**
 * Subtracts two complex numbers using their descriptors
 */
function subtractComplexWeightsUsingDescriptors(a, b) {
    const realRes = a.real.value - b.real.value;
    const imaginaryRes = a.imaginary.value - b.imaginary.value;
    if (Math.abs(realRes) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE && imaginaryRes >= ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
        return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(imaginaryRes) };
    }
    else if (realRes >= ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
        return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(realRes), imaginary: new Weight_1.Weight(0, false) };
    }
    else if (Math.abs(realRes) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
        return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(0, false) };
    }
    if (realRes < 0 || imaginaryRes < 0) {
        let error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('ComplexOperators', 'subtractComplexWeightsUsingDescriptors', ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
        if (realRes < 0 && imaginaryRes < 0) {
            error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('ComplexOperators', 'subtractComplexWeightsUsingDescriptors', ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY);
        }
        else if (imaginaryRes < 0) {
            error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('ComplexOperators', 'subtractComplexWeightsUsingDescriptors', ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY);
        }
        throw new RangeError(error.generateMessageString());
    }
    return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(realRes), imaginary: new Weight_1.Weight(imaginaryRes) };
}
exports.subtractComplexWeightsUsingDescriptors = subtractComplexWeightsUsingDescriptors;
/**
 * Multiplies a complex weight by a complex number using their descriptors
 */
function multiplyComplexWeightsUsingDescriptors(a, b) {
    const realRes = a.real * b.real.value - a.imaginary * b.imaginary.value;
    const imaginaryRes = a.real * b.imaginary.value + a.imaginary * b.real.value;
    if (Math.abs(realRes) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE && imaginaryRes >= ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
        return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(imaginaryRes) };
    }
    else if (realRes >= ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
        return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(realRes), imaginary: new Weight_1.Weight(0, false) };
    }
    else if (Math.abs(realRes) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
        return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(0, false) };
    }
    if (realRes < 0 || imaginaryRes < 0) {
        let error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('ComplexOperators', 'multiplyComplexWeightsUsingDescriptors', ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
        if (realRes < 0 && imaginaryRes < 0) {
            error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('ComplexOperators', 'multiplyComplexWeightsUsingDescriptors', ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY);
        }
        else if (imaginaryRes < 0) {
            error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('ComplexOperators', 'multiplyComplexWeightsUsingDescriptors', ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY);
        }
        throw new RangeError(error.generateMessageString());
    }
    return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(realRes), imaginary: new Weight_1.Weight(imaginaryRes) };
}
exports.multiplyComplexWeightsUsingDescriptors = multiplyComplexWeightsUsingDescriptors;
