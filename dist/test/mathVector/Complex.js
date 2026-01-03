"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Complex_1 = require("../../src/mathVector/Complex");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
describe('Complex numbers and associated operators', () => {
    describe('Constructor', () => {
        it('create a Complex number with prescribed real and imaginary parts', () => {
            const complex = new Complex_1.Complex(3, 4);
            (0, chai_1.expect)(complex.real).to.eql(3);
            (0, chai_1.expect)(complex.imaginary).to.eql(4);
        });
        it('create a Complex number with null real and imaginary parts as default', () => {
            const complex = new Complex_1.Complex();
            (0, chai_1.expect)(complex.real).to.eql(0);
            (0, chai_1.expect)(complex.imaginary).to.eql(0);
        });
        it('create a Complex number with null imaginary part as default', () => {
            const complex = new Complex_1.Complex(-2);
            (0, chai_1.expect)(complex.real).to.eql(-2);
            (0, chai_1.expect)(complex.imaginary).to.eql(0);
        });
    });
    describe('Accessors', () => {
        it('can get the real part', () => {
            const complex = new Complex_1.Complex(5, -7);
            (0, chai_1.expect)(complex.real).to.eql(5);
        });
        it('can get the imaginary part', () => {
            const complex = new Complex_1.Complex(5, -7);
            (0, chai_1.expect)(complex.imaginary).to.eql(-7);
        });
    });
    describe('Methods', () => {
        it('can convert to string', () => {
            const complex = new Complex_1.Complex(1, 2);
            (0, chai_1.expect)(complex.toString()).to.eql(ComplexTypeTag_1.COMPLEX + '(1 , i 2)');
        });
        it('can convert to descriptor', () => {
            const complex = new Complex_1.Complex(3, 4);
            const descriptor = complex.toDescriptor();
            (0, chai_1.expect)(descriptor.type).to.eql(ComplexTypeTag_1.COMPLEX);
            (0, chai_1.expect)(descriptor.real).to.eql(3);
            (0, chai_1.expect)(descriptor.imaginary).to.eql(4);
        });
        it('can add two complex numbers', () => {
            const c1 = new Complex_1.Complex(1, 2);
            const c2 = new Complex_1.Complex(3, 4);
            const result = c1.add(c2);
            (0, chai_1.expect)(result.real).to.eql(4);
            (0, chai_1.expect)(result.imaginary).to.eql(6);
        });
        it('can subtract two complex numbers', () => {
            const c1 = new Complex_1.Complex(5, 6);
            const c2 = new Complex_1.Complex(2, 3);
            const result = c1.subtract(c2);
            (0, chai_1.expect)(result.real).to.eql(3);
            (0, chai_1.expect)(result.imaginary).to.eql(3);
        });
        it('can multiply two complex numbers', () => {
            const c1 = new Complex_1.Complex(1, 2);
            const c2 = new Complex_1.Complex(3, 4);
            const result = c1.multiply(c2);
            (0, chai_1.expect)(result.real).to.eql(-5);
            (0, chai_1.expect)(result.imaginary).to.eql(10);
        });
        it('can scale a complex number with a scalar', () => {
            const scalar = 2;
            const c = new Complex_1.Complex(3, 4);
            const result = c.scale(scalar);
            (0, chai_1.expect)(result.real).to.eql(6);
            (0, chai_1.expect)(result.imaginary).to.eql(8);
        });
        it('can scale a complex number with another complex number', () => {
            const c1 = new Complex_1.Complex(1, 2);
            const c2 = new Complex_1.Complex(3, 4);
            const result = c1.scale(c2);
            (0, chai_1.expect)(result.real).to.eql(c1.multiply(c2).real);
            (0, chai_1.expect)(result.imaginary).to.eql(c1.multiply(c2).imaginary);
        });
        it('can compute the conjugate of a complex number', () => {
            const c = new Complex_1.Complex(3, 4);
            const conjugate = c.conjugate();
            (0, chai_1.expect)(conjugate.real).to.eql(3);
            (0, chai_1.expect)(conjugate.imaginary).to.eql(-4);
        });
        it('can compute the opposite of a complex number', () => {
            const c = new Complex_1.Complex(3, -4);
            const opposite = c.opposite();
            (0, chai_1.expect)(opposite.real).to.eql(-3);
            (0, chai_1.expect)(opposite.imaginary).to.eql(4);
        });
        it('can compute the magnitude of a complex number', () => {
            const c = new Complex_1.Complex(3, 4);
            const magnitude = c.magnitude();
            (0, chai_1.expect)(magnitude).to.eql(5);
        });
        it('can clone a complex number', () => {
            const c1 = new Complex_1.Complex(7, 8);
            const c2 = c1.clone();
            (0, chai_1.expect)(c2.real).to.eql(7);
            (0, chai_1.expect)(c2.imaginary).to.eql(8);
            (0, chai_1.expect)(c2).to.not.equal(c1); // Ensure it's a different instance
        });
    });
});
