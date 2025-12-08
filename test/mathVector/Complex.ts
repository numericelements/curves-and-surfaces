import { expect } from "chai";
import { Complex } from "../../src/mathVector/Complex";
import { COMPLEX } from "../../src/mathVector/VectorSpaceConstructorInterface";

describe('Complex numbers and associated operators', () => {

        describe('Constructor', () => {

            it('create a Complex number with prescribed real and imaginary parts', () => {
                const complex = new Complex(3, 4);
                expect(complex.real).to.eql(3);
                expect(complex.imaginary).to.eql(4);
            });

            it('create a Complex number with null real and imaginary parts as default', () => {
                const complex = new Complex();
                expect(complex.real).to.eql(0);
                expect(complex.imaginary).to.eql(0);
            });

            it('create a Complex number with null imaginary part as default', () => {
                const complex = new Complex(-2);
                expect(complex.real).to.eql(-2);
                expect(complex.imaginary).to.eql(0);
            });
        });

        describe('Accessors', () => {

            it('can get the real part', () => {
                const complex = new Complex(5, -7);
                expect(complex.real).to.eql(5);
            });

            it('can get the imaginary part', () => {
                const complex = new Complex(5, -7);
                expect(complex.imaginary).to.eql(-7);
            });
        });

        describe('Methods', () => {

            it('can convert to string', () => {
                const complex = new Complex(1, 2);
                expect(complex.toString()).to.eql(COMPLEX + '(1 , i 2)');
            });

            it('can convert to descriptor', () => {
                const complex = new Complex(3, 4);
                const descriptor = complex.toDescriptor();
                expect(descriptor.type).to.eql(COMPLEX);
                expect(descriptor.real).to.eql(3);
                expect(descriptor.imaginary).to.eql(4);
            });

            it('can add two complex numbers', () => {
                const c1 = new Complex(1, 2);
                const c2 = new Complex(3, 4);
                const result = c1.add(c2);
                expect(result.real).to.eql(4);
                expect(result.imaginary).to.eql(6);
            });

            it('can subtract two complex numbers', () => {
                const c1 = new Complex(5, 6);
                const c2 = new Complex(2, 3);
                const result = c1.subtract(c2);
                expect(result.real).to.eql(3);
                expect(result.imaginary).to.eql(3);
            });

            it('can multiply two complex numbers', () => {
                const c1 = new Complex(1, 2);
                const c2 = new Complex(3, 4);
                const result = c1.multiply(c2);
                expect(result.real).to.eql(-5);
                expect(result.imaginary).to.eql(10);
            });

            it('can scale a complex number with a scalar', () => {
                const scalar = 2;
                const c = new Complex(3, 4);
                const result = c.scale(scalar);
                expect(result.real).to.eql(6);
                expect(result.imaginary).to.eql(8);
            });

            it('can scale a complex number with another complex number', () => {
                const c1 = new Complex(1, 2);
                const c2 = new Complex(3, 4);
                const result = c1.scale(c2);
                expect(result.real).to.eql(c1.multiply(c2).real);
                expect(result.imaginary).to.eql(c1.multiply(c2).imaginary);
            });

            it('can compute the conjugate of a complex number', () => {
                const c = new Complex(3, 4);
                const conjugate = c.conjugate();
                expect(conjugate.real).to.eql(3);
                expect(conjugate.imaginary).to.eql(-4);
            });

            it('can compute the opposite of a complex number', () => {
                const c = new Complex(3, -4);
                const opposite = c.opposite();
                expect(opposite.real).to.eql(-3);
                expect(opposite.imaginary).to.eql(4);
            });

            it('can compute the magnitude of a complex number', () => {
                const c = new Complex(3, 4);
                const magnitude = c.magnitude();
                expect(magnitude).to.eql(5);
            });

            it('can clone a complex number', () => {
                const c1 = new Complex(7, 8);
                const c2 = c1.clone();
                expect(c2.real).to.eql(7);
                expect(c2.imaginary).to.eql(8);
                expect(c2).to.not.equal(c1); // Ensure it's a different instance
            });
        });
});