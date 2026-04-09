import { expect } from "chai";
import { Complex } from "../../src/mathVector/Complex";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { TOLERANCE_MIN_MAGNITUDE } from "../../src/namedConstants/Complex";
import { EM_MAGNITUDE_COMPLEX_TOO_SMALL } from "../../src/ErrorMessages/Complex";
import { TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { WeightManagement } from "../../src/namedConstants/ProjectiveRealVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { EM_NEGATIVE_REAL_IMAGINARY_PARTS } from "../../src/ErrorMessages/ComplexWeight";

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

            it('can compute the reciprocal of a complex number', () => {
                const c1 = new Complex(7, 8);
                const magnitude = c1.magnitude();
                expect(magnitude > TOLERANCE_MIN_MAGNITUDE).to.eql(true)
                const c2 = c1.reciprocal();
                expect(c2.real).to.be.closeTo(c1.real / Math.pow(magnitude, 2), TOLERANCE_FLOAT);
                expect(c2.imaginary).to.be.closeTo( -c1.imaginary / Math.pow(magnitude, 2), TOLERANCE_FLOAT);
            });

            it('check the reciprocal of a complex number with equal real and imaginary parts whose reciprocal must have equal absolute values of real and imaginary parts and a sum vanishing', () => {
                const value = 5;
                const c1 = new Complex(value, value);
                const magnitude = c1.magnitude();
                expect(magnitude > TOLERANCE_MIN_MAGNITUDE).to.eql(true)
                const c2 = c1.reciprocal();
                expect(Math.abs(c2.real)).to.eql(Math.abs(c2.imaginary));
                expect(c2.real + c2.imaginary).to.eql(0);
            });

            it('cannot compute the reciprocal of a complex number if the magnitude of the number is too small', () => {
                const c1 = new Complex(0, TOLERANCE_MIN_MAGNITUDE / 2);
                const magnitude = c1.magnitude();
                expect(magnitude).to.be.lessThan(TOLERANCE_MIN_MAGNITUDE);
                expect(() => c1.reciprocal()).to.throw(EM_MAGNITUDE_COMPLEX_TOO_SMALL);
            });

            it('can divide a complex number by another one', () => {
                const c1 = new Complex(7, 8);
                const c3 = new Complex(1, 1);
                const magnitude = c3.magnitude();
                expect(magnitude > TOLERANCE_MIN_MAGNITUDE).to.eql(true)
                const c2 = c3.divide(c1);
                expect(c2.real).to.be.closeTo((c1.real * c3.real + c1.imaginary * c3.imaginary)/Math.pow(magnitude, 2), TOLERANCE_FLOAT);
                expect(c2.imaginary).to.be.closeTo((c1.imaginary * c3.real - c1.real * c3.imaginary)/Math.pow(magnitude, 2), TOLERANCE_FLOAT);
            });

            it(`check the division of a complex number by itself produces a complex number with real part close to 1 and null imaginary part within tolerance ${TOLERANCE_MIN_MAGNITUDE}`, () => {
                const value = 3;
                const c1 = new Complex(value, value);
                const c2 = new Complex(value, value);
                const magnitude = c2.magnitude();
                expect(magnitude > TOLERANCE_MIN_MAGNITUDE).to.eql(true)
                const c3 = c2.divide(c1);
                expect(c3.real).to.be.closeTo(1, TOLERANCE_MIN_MAGNITUDE);
                expect(c3.imaginary).to.be.closeTo(0, TOLERANCE_MIN_MAGNITUDE);
            });

            it('cannot divide of a non null complex number by a divisor whose magnitude is too small', () => {
                const c1 = new Complex(0, TOLERANCE_MIN_MAGNITUDE / 2);
                const magnitude = c1.magnitude();
                expect(magnitude).to.be.lessThan(TOLERANCE_MIN_MAGNITUDE);
                const c2 = new Complex(1, 2);
                expect(c2.magnitude() > TOLERANCE_MIN_MAGNITUDE).to.eql(true);
                expect(() => c1.divide(c2)).to.throw(EM_MAGNITUDE_COMPLEX_TOO_SMALL);
            });

            it(`can generate a complex weight with weight management ${WeightManagement.AllStrictlyPositiveWeights} from a complex`, () => {
                const c1 = new Complex(7, 8);
                const complexW = c1.toComplexWeight();
                expect(complexW.real).to.eql(new Weight(c1.real));
                expect(complexW.imaginary).to.eql(new Weight(c1.imaginary));
                expect(complexW.real.strictlyPositive).to.eql(true);
                expect(complexW.imaginary.strictlyPositive).to.eql(true);
            });

            it(`can generate a complex weight with weight management ${WeightManagement.AllPositiveWeights} from a complex`, () => {
                const c1 = new Complex(7, 8);
                const complexW = c1.toComplexWeight(WeightManagement.AllPositiveWeights);
                expect(complexW.real).to.eql(new Weight(c1.real, false));
                expect(complexW.imaginary).to.eql(new Weight(c1.imaginary, false));
                expect(complexW.real.strictlyPositive).to.eql(false);
                expect(complexW.imaginary.strictlyPositive).to.eql(false);
            });

            it(`cannot generate a complex weight if the real or imaginary part of a complex are negative`, () => {
                const c1 = new Complex(-7, 8);
                expect(() => c1.toComplexWeight()).to.throw(EM_NEGATIVE_REAL_IMAGINARY_PARTS);

                const c2 = new Complex(7, -8);
                expect(() => c1.toComplexWeight()).to.throw(EM_NEGATIVE_REAL_IMAGINARY_PARTS);
            });

            it(`can generate a complex weight with weight management ${WeightManagement.SomeNullWeights} from a complex`, () => {
                const c1 = new Complex(0, 8);
                const complexW = c1.toComplexWeight(WeightManagement.SomeNullWeights);
                expect(complexW.real).to.eql(new Weight(c1.real, false));
                expect(complexW.imaginary).to.eql(new Weight(c1.imaginary, false));
                expect(complexW.real.strictlyPositive).to.eql(false);
                expect(complexW.imaginary.strictlyPositive).to.eql(false);

                const c2 = new Complex(7, 0);
                const complexW1 = c2.toComplexWeight(WeightManagement.SomeNullWeights);
                expect(complexW1.real).to.eql(new Weight(c2.real, false));
                expect(complexW1.imaginary).to.eql(new Weight(c2.imaginary, false));
                expect(complexW1.real.strictlyPositive).to.eql(false);
                expect(complexW1.imaginary.strictlyPositive).to.eql(false);
            });
        });
});