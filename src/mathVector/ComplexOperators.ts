// ------------ Complex Number Operations ------------

import { COMPLEX, Complex, COMPLEXWEIGHT, ComplexWeight } from "./VectorSpaceConstructorInterface";
import { Weight } from "./Weight";

/**
 * Complex number operations helper class
 */
export class ComplexOperators {
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
        return {type: COMPLEXWEIGHT, real: new Weight(a.real.weight + b.real.weight), imaginery: new Weight(a.imaginery.weight + b.imaginery.weight)};
    }

    /**
     * Subtracts two complex numbers
     */
    static subtractWeights(a: ComplexWeight, b: ComplexWeight): ComplexWeight {
        return {type: COMPLEXWEIGHT, real: new Weight(a.real.weight - b.real.weight), imaginery: new Weight(a.imaginery.weight - b.imaginery.weight)};
    }

    /**
     * Multiplies two complex numbers
     */
    static multiplyWeight(a: Complex, b: ComplexWeight): ComplexWeight {
        return {type: COMPLEXWEIGHT, 
            real: new Weight(a.real * b.real.weight - a.imaginery * b.imaginery.weight),
            imaginery: new Weight(a.real * b.imaginery.weight + a.imaginery * b.real.weight)
        };
    }

    clone(a: Complex): Complex {
        return {type: COMPLEX, real: a.real, imaginery: a.imaginery};
    }
}