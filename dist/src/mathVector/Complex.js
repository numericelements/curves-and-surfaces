"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Complex = void 0;
const ComplexTypeTag_1 = require("../namedConstants/ComplexTypeTag");
class Complex {
    constructor(real = 0, imaginary = 0) {
        this._real = real;
        this._imaginary = imaginary;
    }
    get real() {
        return this._real;
    }
    get imaginary() {
        return this._imaginary;
    }
    toString() {
        return ComplexTypeTag_1.COMPLEX + `(${this._real} , i ${this._imaginary})`;
    }
    toDescriptor() {
        return { type: ComplexTypeTag_1.COMPLEX, real: this._real, imaginary: this._imaginary };
    }
    add(other) {
        return new Complex(this._real + other.real, this._imaginary + other.imaginary);
    }
    subtract(other) {
        return new Complex(this._real - other.real, this._imaginary - other.imaginary);
    }
    multiply(other) {
        return new Complex(this._real * other.real - this._imaginary * other.imaginary, this._real * other.imaginary + this._imaginary * other.real);
    }
    scale(scalarOrComplex) {
        if (typeof scalarOrComplex === 'number') {
            return new Complex(this._real * scalarOrComplex, this._imaginary * scalarOrComplex);
        }
        else {
            return this.multiply(scalarOrComplex);
        }
    }
    conjugate() {
        return new Complex(this._real, -this._imaginary);
    }
    opposite() {
        return new Complex(-this._real, -this._imaginary);
    }
    magnitude() {
        return Math.sqrt(this._real * this._real + this._imaginary * this._imaginary);
    }
    clone() {
        return new Complex(this._real, this._imaginary);
    }
}
exports.Complex = Complex;
