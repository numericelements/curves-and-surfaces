import { EM_MAGNITUDE_COMPLEX_TOO_SMALL } from "../ErrorMessages/Complex";
import { EM_NEGATIVE_REAL_IMAGINARY_PARTS } from "../ErrorMessages/ComplexWeight";
import { TOLERANCE_MIN_MAGNITUDE } from "../namedConstants/Complex";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { WeightManagement } from "../namedConstants/ProjectiveRealVectorSpace";
import { createComplexDescriptor } from "./ComplexNumberFactory";
import { ComplexWeight } from "./ComplexWeight";
import type { ComplexDesc } from "./VectorDescriptorConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


/**
 * Immutable complex number `a + i·b` supporting standard arithmetic.
 *
 * All operations return new `Complex` instances; the original is never mutated.
 *
 * @example
 * const z1  = new Complex(3, 4);   // 3 + 4i
 * const z2  = new Complex(-1, 2);  // -1 + 2i
 * const sum = z1.add(z2);          // 2 + 6i
 * const mag = z1.magnitude();      // 5
 */
export class Complex {

    private readonly _real: number;
    private readonly _imaginary: number;

    /**
     * @param real      - real part `a` of `a + i·b`. Defaults to 0.
     * @param imaginary - imaginary part `b` of `a + i·b`. Defaults to 0.
     */
    constructor(real: number = 0, imaginary: number = 0) {
        this._real = real;
        this._imaginary = imaginary;
    }

    /** Real part `a` of `a + i·b`. */
    get real(): number {
        return this._real;
    }

    /** Imaginary part `b` of `a + i·b`. */
    get imaginary(): number {
        return this._imaginary;
    }

    /** Returns the string `"complex(a , i b)"`. */
    toString(): string {
        return COMPLEX + `(${this._real} , i ${this._imaginary})`;
    }

    /** Returns a {@link ComplexDesc} descriptor for serialization. */
    toDescriptor(): ComplexDesc {
        return createComplexDescriptor(this._real, this._imaginary);
    }

    /** Returns `this + other`. */
    add(other: Complex): Complex {
        return new Complex(this._real + other.real, this._imaginary + other.imaginary);
    }

    /** Returns `this - other`. */
    subtract(other: Complex): Complex {
        return new Complex(this._real - other.real, this._imaginary - other.imaginary);
    }

    /** Returns `this × other` using standard complex multiplication. */
    multiply(other: Complex): Complex {
        return new Complex(
            this._real * other.real - this._imaginary * other.imaginary,
            this._real * other.imaginary + this._imaginary * other.real
        );
    }

    /**
     * Returns `1 / this`.
     * @throws {RangeError} if the magnitude is below `TOLERANCE_MIN_MAGNITUDE` (≈ 1e-12).
     */
    reciprocal(): Complex {
        const magnitude = this.magnitude();
        if(magnitude > TOLERANCE_MIN_MAGNITUDE) {
            return new Complex(this._real / Math.pow(magnitude, 2), -this._imaginary / Math.pow(magnitude, 2));
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'reciprocal', EM_MAGNITUDE_COMPLEX_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
    }

    /**
     * Returns `other / this`.
     * @throws {RangeError} if the magnitude of `this` is below `TOLERANCE_MIN_MAGNITUDE`.
     */
    divide(other: Complex): Complex {
        const realNumerator = other._real * this._real + other._imaginary * this._imaginary;
        const imaginaryNumerator = other._imaginary * this._real - other._real * this._imaginary;
        const magnitude = this.magnitude();
        if(magnitude > TOLERANCE_MIN_MAGNITUDE) {
            return new Complex(realNumerator / Math.pow(magnitude, 2), imaginaryNumerator / Math.pow(magnitude, 2));
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'divide', EM_MAGNITUDE_COMPLEX_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
    }

    /** Multiplies by a real scalar or by another complex number. */
    scale(scalar: number): Complex;
    scale(complex: Complex): Complex;
    scale(scalarOrComplex: number | Complex): Complex {
        if (typeof scalarOrComplex === 'number') {
            return new Complex(this._real * scalarOrComplex, this._imaginary * scalarOrComplex);
        } else {
            return this.multiply(scalarOrComplex);
        }
    }

    /** Returns the complex conjugate `a - i·b`. */
    conjugate(): Complex {
        return new Complex(this._real, -this._imaginary);
    }

    /** Returns the additive inverse `-a - i·b`. */
    opposite(): Complex {
        return new Complex(-this._real, -this._imaginary);
    }

    /** Returns `|this| = √(a² + b²)`. */
    magnitude(): number {
        return Math.sqrt(this._real * this._real + this._imaginary * this._imaginary);
    }

    /**
     * Converts to a {@link ComplexWeight} according to the given weight-management policy.
     * @param weightManagement - optional {@link WeightManager} policy controlling null-weight handling.
     * @throws {RangeError} if either component is negative.
     */
    toComplexWeight(weightManagement?: WeightManagement): ComplexWeight {
        if(this._real < 0 || this._imaginary < 0) {
            const error = sendRangeErrorMessage(this.constructor.name, 'toComplexWeight', EM_NEGATIVE_REAL_IMAGINARY_PARTS);
            throw new RangeError(error.generateMessageString());
        }
        let complexWeight = new ComplexWeight();
        if(this._real > 0 && this._imaginary > 0)
            complexWeight = new ComplexWeight(new Weight(this._real), new Weight(this._imaginary));
        if(weightManagement === undefined) return complexWeight;
        if(weightManagement === WeightManagement.AllPositiveWeights)
            complexWeight = new ComplexWeight(new Weight(this._real, false), new Weight(this._imaginary, false));
        if(this._real === 0)
            complexWeight = new ComplexWeight(new Weight(this._real, false), new Weight(this._imaginary, false));
        if(this._imaginary === 0)
            complexWeight = new ComplexWeight(new Weight(this._real, false), new Weight(this._imaginary, false));
        return complexWeight;
    }

    /** Returns a deep copy of this complex number. */
    clone(): Complex {
        return new Complex(this._real, this._imaginary);
    }
}