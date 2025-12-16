import { expect } from "chai";
import { IComplex, IComplexWeight } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { Weight } from "../../src/mathVector/Weight";
import { addComplexUsingDescriptors, addComplexWeightsUsingDescriptors, conjugateUsingDescriptor, createComplex, createComplexDescriptor, magnitudeUsingDescriptor, multiplyComplexUsingDescriptors, multiplyComplexWeightsUsingDescriptors, subtractComplexUsingDescriptors, subtractComplexWeightsUsingDescriptors } from "../../src/mathVector/ComplexNumberFactory";
import { NULL_WEIGHT_TOLERANCE } from "../../src/namedConstants/ProjectiveVectorSpace";
import { EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY, EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL, EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY } from "../../src/ErrorMessages/ComplexOperators";
import { TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { COMPLEXWEIGHT } from "../../src/namedConstants/WeightTypeTags";

describe('ComplexNumbersFactory', () => {

    it('can create a complex number descriptor', () => {
        const result = createComplexDescriptor(1, 2);
        expect(result.type).to.eql(COMPLEX);
        expect(result.real).to.eql(1);
        expect(result.imaginary).to.eql(2);
    });

    it('can create a complex number as an object', () => {
        const result = createComplex(1, 2);
        expect(result.real).to.eql(1);
        expect(result.imaginary).to.eql(2);
    });

    it('can add two complex numbers using their descriptors', () => {
        const c1: IComplex = {type: COMPLEX, real: 1, imaginary: 2};
        const c2: IComplex = {type: COMPLEX, real: 2, imaginary: 3};
        const result = addComplexUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEX);
        expect(result.real).to.eql(3);
        expect(result.imaginary).to.eql(5);
    });

    it('can multiply two complex numbers using their descriptors', () => {
        const c1: IComplex = {type: COMPLEX, real: 1, imaginary: 2};
        const c2: IComplex = {type: COMPLEX, real: 2, imaginary: 3};
        const result = multiplyComplexUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEX);
        expect(result.real).to.eql(-4);
        expect(result.imaginary).to.eql(7);
    });

    it('can subtract two complex numbers using their descriptors', () => {
        const c1: IComplex = {type: COMPLEX, real: 1, imaginary: 2};
        const c2: IComplex = {type: COMPLEX, real: 2, imaginary: 3};
        const result = subtractComplexUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEX);
        expect(result.real).to.eql(-1);
        expect(result.imaginary).to.eql(-1);
    });

    it('can get the conjugate of a complex number using its descriptor', () => {
        const c1: IComplex = {type: COMPLEX, real: 1, imaginary: 2};
        const result = conjugateUsingDescriptor(c1);
        expect(result.type).to.eql(COMPLEX);
        expect(result.real).to.eql(1);
        expect(result.imaginary).to.eql(-2);
    });

    it('can get the magnitude of a complex number using its descriptor', () => {
        const c1: IComplex = {type: COMPLEX, real: 1, imaginary: 2};
        const result = magnitudeUsingDescriptor(c1);
        expect(result).to.eql(Math.sqrt(5));
    });

    it('can add two complex non null weights', () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(4)};
        const result = addComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(3.5);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.value).to.eql(7);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it('can add two complex weights with null real part', () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(3)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(4)};
        const result = addComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.value).to.eql(7);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it(`can add two complex weights with real parts lower than ${NULL_WEIGHT_TOLERANCE}`, () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1e-11), imaginary: new Weight(3)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1e-11), imaginary: new Weight(4)};
        const result = addComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.value).to.eql(7);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it('can add two complex weights with null imaginary part', () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(0, false)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(0, false)};
        const result = addComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(3.5);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.value).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it(`can add two complex weights with imaginary parts lower than ${NULL_WEIGHT_TOLERANCE}`, () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1e-11)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(1e-11)};
        const result = addComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(3.5);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.value).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it('can add two complex weights with null real and imaginary parts', () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(0, false)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(0, false)};
        const result = addComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.value).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it(`can add two complex weights with real and imaginary parts lower than ${NULL_WEIGHT_TOLERANCE}`, () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1e-11), imaginary: new Weight(1e-11)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1e-11), imaginary: new Weight(1e-11)};
        const result = addComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.value).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it('can subtract two complex weights resulting into strictly positive real and imaginary parts', () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(4)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(3)};
        const result = subtractComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0.5);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.value).to.eql(1);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it('can subtract two complex weights resulting into null real and strictly positive imaginary parts', () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(4)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)};
        const result = subtractComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.value).to.eql(1);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it('can subtract two complex weights resulting into strictly positive real and null imaginary parts', () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(4)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(4)};
        const result = subtractComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0.5);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.value).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it('can subtract two complex weights resulting into null real and imaginary parts', () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(4)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(4)};
        const result = subtractComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.value).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it(`can subtract two complex weights resulting into positive real part lower than ${NULL_WEIGHT_TOLERANCE} and strictly positive imaginary parts`, () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1e-11), imaginary: new Weight(4)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(3)};
        const result = subtractComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.value).to.eql(1);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it(`can subtract two complex weights resulting into positive real and positive imaginary parts lower than ${NULL_WEIGHT_TOLERANCE}`, () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1e-11), imaginary: new Weight(0, false)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(1e-11)};
        const result = subtractComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.value).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it(`cannot subtract two complex weights resulting into a negative real part and a positive imaginary part`, () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(4)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)};
        expect(() => subtractComplexWeightsUsingDescriptors(c1, c2)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
    });

    it(`cannot subtract two complex weights resulting into a positive real part and a negative imaginary part`, () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(3)};
        expect(() => subtractComplexWeightsUsingDescriptors(c1, c2)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY);
    });

    it(`cannot subtract two complex weights resulting into negative real and imaginary parts`, () => {
        const c1: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)};
        expect(() => subtractComplexWeightsUsingDescriptors(c1, c2)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY);
    });

    it('can multiply a complex weight by a complex number producing strictly positive real and imaginary parts', () => {
        const c1: IComplex = {type: COMPLEX, real: 3, imaginary: 4};
        const real = 3;
        const imaginary = 1.5;
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(real), imaginary: new Weight(imaginary)};
        const result = multiplyComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(3);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.value).to.eql(16.5);
        expect(result.imaginary.strictlyPositive).to.eql(true);

        const c3 = createComplexDescriptor(real, imaginary);
        const c4 = multiplyComplexUsingDescriptors(c1, c3);
        expect(c4.real).to.eql(result.real.value);
        expect(c4.imaginary).to.eql(result.imaginary.value);
    });

    it('can multiply a complex weight by a complex number producing a positive real part and a strictly positive imaginary parts', () => {
        const c1: IComplex = {type: COMPLEX, real: 1.5, imaginary: 3};
        const real = 3;
        const imaginary = 1.5;
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(real), imaginary: new Weight(imaginary)};
        const result = multiplyComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.value).to.eql(11.25);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it('can multiply a complex weight by a complex number producing a strictly positive real part and a positive imaginary parts', () => {
        const c1: IComplex = {type: COMPLEX, real: 1.5, imaginary: -3};
        const real = 1.5;
        const imaginary = 3;
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(real), imaginary: new Weight(imaginary)};
        const result = multiplyComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(11.25);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.value).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it('can multiply a complex weight by a complex number producing null real and imaginary parts', () => {
        const c1: IComplex = {type: COMPLEX, real: 0, imaginary: 0};
        const real = 3;
        const imaginary = 1.5;
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(real), imaginary: new Weight(imaginary)};
        const result = multiplyComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.value).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it(`can multiply a complex weight by a complex number resulting into positive real part lower than ${NULL_WEIGHT_TOLERANCE} and a strictly positive imaginary part`, () => {
        const c1: IComplex = {type: COMPLEX, real: 1 + 1e-11, imaginary: 1};
        const real = 1.5;
        const imaginary = 1.5;
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(real), imaginary: new Weight(imaginary)};
        const result = multiplyComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.value).to.be.closeTo(3, TOLERANCE_FLOAT);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it(`can multiply a complex weight by a complex number resulting into positive and imaginary parts lower than ${NULL_WEIGHT_TOLERANCE}`, () => {
        const c1: IComplex = {type: COMPLEX, real: 1e-11, imaginary: 1e-11};
        const real = 3;
        const imaginary = 1.5;
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(real), imaginary: new Weight(imaginary)};
        const result = multiplyComplexWeightsUsingDescriptors(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.value).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.value).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it(`cannot multiply a complex weight by a complex number resulting into a negative real part and a positive imaginary part`, () => {
        const c1: IComplex = {type: COMPLEX, real: 1, imaginary: 4};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)};
        expect(() => multiplyComplexWeightsUsingDescriptors(c1, c2)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
    });

    it(`cannot multiply a complex weight by a complex number resulting into a positive real part and a negative imaginary part`, () => {
        const c1: IComplex = {type: COMPLEX, real: 1, imaginary: -4};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(3)};
        expect(() => multiplyComplexWeightsUsingDescriptors(c1, c2)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY);
    });

    it(`cannot multiply a complex weight by a complex number resulting into negative real and imaginary parts`, () => {
        const c1: IComplex = {type: COMPLEX, real: -4, imaginary: -1};
        const c2: IComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)};
        expect(() => multiplyComplexWeightsUsingDescriptors(c1, c2)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY);
    });
});