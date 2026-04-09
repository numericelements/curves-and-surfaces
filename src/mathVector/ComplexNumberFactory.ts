// ------------ Complex Number Operations ------------

import { EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY, EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL, EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY } from "../ErrorMessages/ComplexOperators";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { NULL_WEIGHT_TOLERANCE } from "../namedConstants/ProjectiveRealVectorSpace";
import { Complex } from "./Complex";
import { createComplexWeightDescriptor } from "./VectorDescriptorFactory";
import type { ComplexDesc, ComplexWeightDesc } from "./VectorDescriptorConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

/**
 * Complex number operations factory
 */

/**
 * Creates the descriptor of a complex number from two real numbers
 */
export function createComplexDescriptor(real: number, imaginary: number): ComplexDesc {
    return {type: COMPLEX, real: real, imaginary: imaginary};
}

/**
 * Creates a complex number from two real numbers
 */
export function createComplex(real: number, imaginary: number): Complex {
    return new Complex(real, imaginary);
}

/**
 * Add two complex numbers using their descriptors
 */
export function addComplexUsingDescriptors(a: ComplexDesc, b: ComplexDesc): ComplexDesc {
    return createComplexDescriptor(a.real + b.real, a.imaginary + b.imaginary);
}

/**
 * Multiply two complex numbers using their descriptors
 */
export function multiplyComplexUsingDescriptors(a: ComplexDesc, b: ComplexDesc): ComplexDesc {
    return createComplexDescriptor(
        a.real * b.real - a.imaginary * b.imaginary,
        a.real * b.imaginary + a.imaginary * b.real
    );
}

/**
 * Subtract two complex numbers using their descriptors
 */
export function subtractComplexUsingDescriptors(a: ComplexDesc, b: ComplexDesc): ComplexDesc {
    return createComplexDescriptor(a.real - b.real, a.imaginary - b.imaginary);
}

/**
 * Returns the complex conjugate using its descriptor
 */
export function conjugateUsingDescriptor(a: ComplexDesc): ComplexDesc {
        return createComplexDescriptor(a.real, -a.imaginary);
}

/**
 * Returns the magnitude of a complex number using its descriptor
 * @param a
 * @returns
 */
export function magnitudeUsingDescriptor(a: ComplexDesc): number {
    return Math.sqrt(a.real * a.real + a.imaginary * a.imaginary);
}


/**
 * Adds two complex weights using their descriptors
 */
export function addComplexWeightsUsingDescriptors(a: ComplexWeightDesc, b: ComplexWeightDesc): ComplexWeightDesc {
    const realRes = a.real.value + b.real.value;
    const imaginaryRes = a.imaginary.value + b.imaginary.value;
    if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) >= NULL_WEIGHT_TOLERANCE) {
        return createComplexWeightDescriptor(new Weight(0, false), new Weight(imaginaryRes));
    } else if(Math.abs(realRes) >= NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < NULL_WEIGHT_TOLERANCE) {
        return createComplexWeightDescriptor(new Weight(realRes), new Weight(0, false));
    } else if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < NULL_WEIGHT_TOLERANCE) {
        return createComplexWeightDescriptor(new Weight(0, false), new Weight(0, false));
    }
    return createComplexWeightDescriptor(new Weight(realRes), new Weight(imaginaryRes));
}


/**
 * Subtracts two complex numbers using their descriptors
 */
export function subtractComplexWeightsUsingDescriptors(a: ComplexWeightDesc, b: ComplexWeightDesc): ComplexWeightDesc {
    const realRes = a.real.value - b.real.value;
    const imaginaryRes = a.imaginary.value - b.imaginary.value;
    if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && imaginaryRes >= NULL_WEIGHT_TOLERANCE) {
        return createComplexWeightDescriptor(new Weight(0, false), new Weight(imaginaryRes));
    } else if(realRes >= NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < NULL_WEIGHT_TOLERANCE) {
        return createComplexWeightDescriptor(new Weight(realRes), new Weight(0, false));
    } else if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < NULL_WEIGHT_TOLERANCE) {
        return createComplexWeightDescriptor(new Weight(0, false), new Weight(0, false));
    }
    if(realRes < 0 || imaginaryRes < 0) {
        let error = sendRangeErrorMessage('ComplexOperators', 'subtractComplexWeightsUsingDescriptors', EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
        if (realRes < 0 && imaginaryRes < 0) {
            error = sendRangeErrorMessage('ComplexOperators', 'subtractComplexWeightsUsingDescriptors', EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY);
        } else if (imaginaryRes < 0) {
            error = sendRangeErrorMessage('ComplexOperators', 'subtractComplexWeightsUsingDescriptors', EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY);
        }
        throw new RangeError(error.generateMessageString());
    }
    return createComplexWeightDescriptor(new Weight(realRes), new Weight(imaginaryRes));
}

/**
 * Multiplies a complex weight by a complex number using their descriptors
 */
export function multiplyComplexWeightsUsingDescriptors(a: ComplexDesc, b: ComplexWeightDesc): ComplexWeightDesc {
    const realRes = a.real * b.real.value - a.imaginary * b.imaginary.value;
    const imaginaryRes = a.real * b.imaginary.value + a.imaginary * b.real.value;
    if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && imaginaryRes >= NULL_WEIGHT_TOLERANCE) {
        return createComplexWeightDescriptor(new Weight(0, false), new Weight(imaginaryRes));
    } else if(realRes >= NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < NULL_WEIGHT_TOLERANCE) {
        return createComplexWeightDescriptor(new Weight(realRes), new Weight(0, false));
    } else if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < NULL_WEIGHT_TOLERANCE) {
        return createComplexWeightDescriptor(new Weight(0, false), new Weight(0, false));
    }
    if(realRes < 0 || imaginaryRes < 0) {
        let error = sendRangeErrorMessage('ComplexOperators', 'multiplyComplexWeightsUsingDescriptors', EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
        if (realRes < 0 && imaginaryRes < 0) {
            error = sendRangeErrorMessage('ComplexOperators', 'multiplyComplexWeightsUsingDescriptors', EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY);
        } else if (imaginaryRes < 0) {
            error = sendRangeErrorMessage('ComplexOperators', 'multiplyComplexWeightsUsingDescriptors', EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY);
        }
        throw new RangeError(error.generateMessageString());
    }
    return createComplexWeightDescriptor(new Weight(realRes), new Weight(imaginaryRes));
}
