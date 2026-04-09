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


export class Complex {

    private readonly _real: number;
    private readonly _imaginary: number;

    constructor(real: number = 0, imaginary: number = 0) {
        this._real = real;
        this._imaginary = imaginary;
    }

    get real(): number {
        return this._real;
    }

    get imaginary(): number {
        return this._imaginary;
    }

    toString(): string {
        return COMPLEX + `(${this._real} , i ${this._imaginary})`;
    }

    toDescriptor(): ComplexDesc {
        return createComplexDescriptor(this._real, this._imaginary);
    }

    add(other: Complex): Complex {
        return new Complex(this._real + other.real, this._imaginary + other.imaginary);
    }

    subtract(other: Complex): Complex {
        return new Complex(this._real - other.real, this._imaginary - other.imaginary);
    }

    multiply(other: Complex): Complex {
        return new Complex(
            this._real * other.real - this._imaginary * other.imaginary,
            this._real * other.imaginary + this._imaginary * other.real
        );
    }

    reciprocal(): Complex {
        const magnitude = this.magnitude();
        if(magnitude > TOLERANCE_MIN_MAGNITUDE) {
            return new Complex(this._real / Math.pow(magnitude, 2), -this._imaginary / Math.pow(magnitude, 2));
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'reciprocal', EM_MAGNITUDE_COMPLEX_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
    }

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

    scale(scalar: number): Complex;
    scale(complex: Complex): Complex;
    scale(scalarOrComplex: number | Complex): Complex {
        if (typeof scalarOrComplex === 'number') {
            return new Complex(this._real * scalarOrComplex, this._imaginary * scalarOrComplex);
        } else {
            return this.multiply(scalarOrComplex);
        }
    }

    conjugate(): Complex {
        return new Complex(this._real, -this._imaginary);
    }

    opposite(): Complex {
        return new Complex(-this._real, -this._imaginary);
    }

    magnitude(): number {
        return Math.sqrt(this._real * this._real + this._imaginary * this._imaginary);
    }

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

    clone(): Complex {
        return new Complex(this._real, this._imaginary);
    }
}