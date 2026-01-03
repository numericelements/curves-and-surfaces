// ------------ Complex Number Operations ------------

import { EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY, EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL, EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY } from "../ErrorMessages/ComplexOperators";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { NULL_WEIGHT_TOLERANCE } from "../namedConstants/ProjectiveVectorSpace";
import { COMPLEXWEIGHT } from "../namedConstants/WeightTypeTags";
import { Complex } from "./Complex";
import type { IComplex, IComplexWeight } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

/**
 * Complex number operations factory
 */

/**
 * Creates the descriptor of a complex number from two real numbers
 */
export function createComplexDescriptor(real: number, imaginary: number): IComplex {
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
export function addComplexUsingDescriptors(a: IComplex, b: IComplex): IComplex {
    return {type: COMPLEX, real: a.real + b.real, imaginary: a.imaginary + b.imaginary};
}

/**
 * Multiply two complex numbers using their descriptors
 */
export function multiplyComplexUsingDescriptors(a: IComplex, b: IComplex): IComplex {
    return {type: COMPLEX, 
        real: a.real * b.real - a.imaginary * b.imaginary,
        imaginary: a.real * b.imaginary + a.imaginary * b.real
    };
}

/**
 * Subtract two complex numbers using their descriptors
 */
export function subtractComplexUsingDescriptors(a: IComplex, b: IComplex): IComplex {
    return {type: COMPLEX, real: a.real - b.real, imaginary: a.imaginary - b.imaginary};
}

/**
 * Returns the complex conjugate using its descriptor
 */
export function conjugateUsingDescriptor(a: IComplex): IComplex {
        return {type: COMPLEX, real: a.real, imaginary: -a.imaginary};
}

/**
 * Returns the magnitude of a complex number using its descriptor
 * @param a
 * @returns
 */
export function magnitudeUsingDescriptor(a: IComplex): number {
    return Math.sqrt(a.real * a.real + a.imaginary * a.imaginary);
}


/**
 * Adds two complex weights using their descriptors
 */
export function addComplexWeightsUsingDescriptors(a: IComplexWeight, b: IComplexWeight): IComplexWeight {
    const realRes = a.real.value + b.real.value;
    const imaginaryRes = a.imaginary.value + b.imaginary.value;
    if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) >= NULL_WEIGHT_TOLERANCE) {
        return {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(imaginaryRes)};
    } else if(Math.abs(realRes) >= NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < NULL_WEIGHT_TOLERANCE) {
        return {type: COMPLEXWEIGHT, real: new Weight(realRes), imaginary: new Weight(0, false)};
    } else if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < NULL_WEIGHT_TOLERANCE) {
        return {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(0, false)};
    }
    return {type: COMPLEXWEIGHT, real: new Weight(realRes), imaginary: new Weight(imaginaryRes)};
}


/**
 * Subtracts two complex numbers using their descriptors
 */
export function subtractComplexWeightsUsingDescriptors(a: IComplexWeight, b: IComplexWeight): IComplexWeight {
    const realRes = a.real.value - b.real.value;
    const imaginaryRes = a.imaginary.value - b.imaginary.value;
    if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && imaginaryRes >= NULL_WEIGHT_TOLERANCE) {
        return {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(imaginaryRes)};
    } else if(realRes >= NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < NULL_WEIGHT_TOLERANCE) {
        return {type: COMPLEXWEIGHT, real: new Weight(realRes), imaginary: new Weight(0, false)};
    } else if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < NULL_WEIGHT_TOLERANCE) {
        return {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(0, false)};
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
    return {type: COMPLEXWEIGHT, real: new Weight(realRes), imaginary: new Weight(imaginaryRes)};
}

/**
 * Multiplies a complex weight by a complex number using their descriptors
 */
export function multiplyComplexWeightsUsingDescriptors(a: IComplex, b: IComplexWeight): IComplexWeight {
    const realRes = a.real * b.real.value - a.imaginary * b.imaginary.value;
    const imaginaryRes = a.real * b.imaginary.value + a.imaginary * b.real.value;
    if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && imaginaryRes >= NULL_WEIGHT_TOLERANCE) {
        return {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(imaginaryRes)};
    } else if(realRes >= NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < NULL_WEIGHT_TOLERANCE) {
        return {type: COMPLEXWEIGHT, real: new Weight(realRes), imaginary: new Weight(0, false)};
    } else if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && Math.abs(imaginaryRes) < NULL_WEIGHT_TOLERANCE) {
        return {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(0, false)};
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
    return {type: COMPLEXWEIGHT, real: new Weight(realRes), imaginary: new Weight(imaginaryRes)};
}
