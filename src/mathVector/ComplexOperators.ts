// ------------ Complex Number Operations ------------

import { EM_COMPLEXWEIGHT_ADD_NEGATIVE_IMAGINERY, EM_COMPLEXWEIGHT_ADD_NEGATIVE_REAL, EM_COMPLEXWEIGHT_ADD_NEGATIVE_REAL_IMAGINERY } from "../ErrorMessages/ComplexOperators";
import { NULL_WEIGHT_TOLERANCE } from "../namedConstants/ProjectiveVectorSpace";
import { COMPLEX, Complex, COMPLEXWEIGHT, ComplexWeight } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

/**
 * Complex number operations helper class
 */
export class ComplexOperators {

    /**
     * Creates a complex number from two real numbers
     */
    static createComplex(real: number, imaginery: number): Complex {
        return {type: COMPLEX, real: real, imaginery: imaginery};
    }

    /**
     * Adds two complex numbers
     */
    static add(a: Complex, b: Complex): Complex {
        return {type: COMPLEX, real: a.real + b.real, imaginery: a.imaginery + b.imaginery};
    }

    /**
     * Multiplies two complex numbers
     */
    static multiply(a: Complex, b: Complex): Complex {
        return {type: COMPLEX, 
            real: a.real * b.real - a.imaginery * b.imaginery,
            imaginery: a.real * b.imaginery + a.imaginery * b.real
        };
    }

    /**
     * Subtracts two complex numbers
     */
    static subtract(a: Complex, b: Complex): Complex {
        return {type: COMPLEX, real: a.real - b.real, imaginery: a.imaginery - b.imaginery};
    }

    /**
     * Returns the complex conjugate
     */
    static conjugate(a: Complex): Complex {
        return {type: COMPLEX, real: a.real, imaginery: -a.imaginery};
    }

    /**
     * Returns the magnitude of a complex number
     * @param a
     * @returns
     */
    static magnitude(a: Complex): number {
        return Math.sqrt(a.real * a.real + a.imaginery * a.imaginery);
    }

    /**
     * Adds two complex weights
     */
    static addWeights(a: ComplexWeight, b: ComplexWeight): ComplexWeight {
        const realRes = a.real.weight + b.real.weight;
        const imagineryRes = a.imaginery.weight + b.imaginery.weight;
        if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && Math.abs(imagineryRes) >= NULL_WEIGHT_TOLERANCE) {
            return {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginery: new Weight(imagineryRes)};
        } else if(Math.abs(realRes) >= NULL_WEIGHT_TOLERANCE && Math.abs(imagineryRes) < NULL_WEIGHT_TOLERANCE) {
            return {type: COMPLEXWEIGHT, real: new Weight(realRes), imaginery: new Weight(0, false)};
        } else if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && Math.abs(imagineryRes) < NULL_WEIGHT_TOLERANCE) {
            return {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginery: new Weight(0, false)};
        }
        return {type: COMPLEXWEIGHT, real: new Weight(realRes), imaginery: new Weight(imagineryRes)};
    }

    /**
     * Subtracts two complex numbers
     */
    static subtractWeights(a: ComplexWeight, b: ComplexWeight): ComplexWeight {
        const realRes = a.real.weight - b.real.weight;
        const imagineryRes = a.imaginery.weight - b.imaginery.weight;
        if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && imagineryRes >= NULL_WEIGHT_TOLERANCE) {
            return {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginery: new Weight(imagineryRes)};
        } else if(realRes >= NULL_WEIGHT_TOLERANCE && Math.abs(imagineryRes) < NULL_WEIGHT_TOLERANCE) {
            return {type: COMPLEXWEIGHT, real: new Weight(realRes), imaginery: new Weight(0, false)};
        } else if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && Math.abs(imagineryRes) < NULL_WEIGHT_TOLERANCE) {
            return {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginery: new Weight(0, false)};
        }
        if(realRes < 0 || imagineryRes < 0) {
            let error = sendRangeErrorMessage('ComplexOperators', 'subtractWeights', EM_COMPLEXWEIGHT_ADD_NEGATIVE_REAL);
            if (realRes < 0 && imagineryRes < 0) {
                error = sendRangeErrorMessage('ComplexOperators', 'subtractWeights', EM_COMPLEXWEIGHT_ADD_NEGATIVE_REAL_IMAGINERY);
            } else if (imagineryRes < 0) {
                error = sendRangeErrorMessage('ComplexOperators', 'subtractWeights', EM_COMPLEXWEIGHT_ADD_NEGATIVE_IMAGINERY);
            }
            throw new RangeError(error.generateMessageString());
        }
        return {type: COMPLEXWEIGHT, real: new Weight(realRes), imaginery: new Weight(imagineryRes)};
    }

    /**
     * Multiplies a complex weight by a complex number
     */
    static multiplyWeight(a: Complex, b: ComplexWeight): ComplexWeight {
        const realRes = a.real * b.real.weight - a.imaginery * b.imaginery.weight;
        const imagineryRes = a.real * b.imaginery.weight + a.imaginery * b.real.weight;
        if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && imagineryRes >= NULL_WEIGHT_TOLERANCE) {
            return {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginery: new Weight(imagineryRes)};
        } else if(realRes >= NULL_WEIGHT_TOLERANCE && Math.abs(imagineryRes) < NULL_WEIGHT_TOLERANCE) {
            return {type: COMPLEXWEIGHT, real: new Weight(realRes), imaginery: new Weight(0, false)};
        } else if(Math.abs(realRes) < NULL_WEIGHT_TOLERANCE && Math.abs(imagineryRes) < NULL_WEIGHT_TOLERANCE) {
            return {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginery: new Weight(0, false)};
        }
        if(realRes < 0 || imagineryRes < 0) {
            let error = sendRangeErrorMessage('ComplexOperators', 'subtractWeights', EM_COMPLEXWEIGHT_ADD_NEGATIVE_REAL);
            if (realRes < 0 && imagineryRes < 0) {
                error = sendRangeErrorMessage('ComplexOperators', 'subtractWeights', EM_COMPLEXWEIGHT_ADD_NEGATIVE_REAL_IMAGINERY);
            } else if (imagineryRes < 0) {
                error = sendRangeErrorMessage('ComplexOperators', 'subtractWeights', EM_COMPLEXWEIGHT_ADD_NEGATIVE_IMAGINERY);
            }
            throw new RangeError(error.generateMessageString());
        }
        return {type: COMPLEXWEIGHT, real: new Weight(realRes), imaginery: new Weight(imagineryRes)};
    }

    static clone(a: Complex): Complex {
        return {type: COMPLEX, real: a.real, imaginery: a.imaginery};
    }

    static cloneWeight(a: ComplexWeight): ComplexWeight {
        return {type: COMPLEXWEIGHT, real: new Weight(a.real.weight), imaginery: new Weight(a.imaginery.weight)};
    }
}