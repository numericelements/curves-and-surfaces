import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import type { IComplex } from "./VectorSpaceConstructorInterface";


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

    toDescriptor(): IComplex {
        return { type: COMPLEX, real: this._real, imaginary: this._imaginary };
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

    clone(): Complex {
        return new Complex(this._real, this._imaginary);
    }
}