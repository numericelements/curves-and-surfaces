import { expect } from "chai";
import { Complex, COMPLEX, ComplexWeight, COMPLEXWEIGHT, WEIGHT, Weight_Interface } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { Weight } from "../../src/mathVector/Weight";
import { ComplexOperators } from "../../src/mathVector/ComplexOperators";
import { NULL_WEIGHT_TOLERANCE } from "../../src/namedConstants/ProjectiveVectorSpace";
import { EM_COMPLEXWEIGHT_ADD_NEGATIVE_IMAGINERY, EM_COMPLEXWEIGHT_ADD_NEGATIVE_REAL, EM_COMPLEXWEIGHT_ADD_NEGATIVE_REAL_IMAGINERY } from "../../src/ErrorMessages/ComplexOperators";
import { TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";

describe('ComplexOperators', () => {

    it('can create a complex number', () => {
        const result = ComplexOperators.createComplex(1, 2);
        expect(result.type).to.eql(COMPLEX);
        expect(result.real).to.eql(1);
        expect(result.imaginary).to.eql(2);
    });

    it('can add two complex numbers', () => {
        const c1: Complex = {type: COMPLEX, real: 1, imaginary: 2};
        const c2: Complex = {type: COMPLEX, real: 2, imaginary: 3};
        const result = ComplexOperators.add(c1, c2);
        expect(result.type).to.eql(COMPLEX);
        expect(result.real).to.eql(3);
        expect(result.imaginary).to.eql(5);
    });

    it('can multiply two complex numbers', () => {
        const c1: Complex = {type: COMPLEX, real: 1, imaginary: 2};
        const c2: Complex = {type: COMPLEX, real: 2, imaginary: 3};
        const result = ComplexOperators.multiply(c1, c2);
        expect(result.type).to.eql(COMPLEX);
        expect(result.real).to.eql(-4);
        expect(result.imaginary).to.eql(7);
    });

    it('can subtract two complex numbers', () => {
        const c1: Complex = {type: COMPLEX, real: 1, imaginary: 2};
        const c2: Complex = {type: COMPLEX, real: 2, imaginary: 3};
        const result = ComplexOperators.subtract(c1, c2);
        expect(result.type).to.eql(COMPLEX);
        expect(result.real).to.eql(-1);
        expect(result.imaginary).to.eql(-1);
    });

    it('can get the conjugate of a complex number', () => {
        const c1: Complex = {type: COMPLEX, real: 1, imaginary: 2};
        const result = ComplexOperators.conjugate(c1);
        expect(result.type).to.eql(COMPLEX);
        expect(result.real).to.eql(1);
        expect(result.imaginary).to.eql(-2);
    });

    it('can get the magnitude of a complex number', () => {
        const c1: Complex = {type: COMPLEX, real: 1, imaginary: 2};
        const result = ComplexOperators.magnitude(c1);
        expect(result).to.eql(Math.sqrt(5));
    });

    it('can add two complex non null weights', () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(4)};
        const result = ComplexOperators.addWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(3.5);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.weight).to.eql(7);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it('can add two complex weights with null real part', () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(3)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(4)};
        const result = ComplexOperators.addWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.weight).to.eql(7);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it(`can add two complex weights with real parts lower than ${NULL_WEIGHT_TOLERANCE}`, () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1e-11), imaginary: new Weight(3)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1e-11), imaginary: new Weight(4)};
        const result = ComplexOperators.addWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.weight).to.eql(7);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it('can add two complex weights with null imaginery part', () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(0, false)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(0, false)};
        const result = ComplexOperators.addWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(3.5);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.weight).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it(`can add two complex weights with imaginery parts lower than ${NULL_WEIGHT_TOLERANCE}`, () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1e-11)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(1e-11)};
        const result = ComplexOperators.addWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(3.5);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.weight).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it('can add two complex weights with null real and imaginery parts', () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(0, false)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(0, false)};
        const result = ComplexOperators.addWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.weight).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it(`can add two complex weights with real and imaginery parts lower than ${NULL_WEIGHT_TOLERANCE}`, () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1e-11), imaginary: new Weight(1e-11)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1e-11), imaginary: new Weight(1e-11)};
        const result = ComplexOperators.addWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.weight).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it('can subtract two complex weights resulting into strictly positive real and imaginery parts', () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(4)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(3)};
        const result = ComplexOperators.subtractWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0.5);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.weight).to.eql(1);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it('can subtract two complex weights resulting into null real and strictly positive imaginery parts', () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(4)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)};
        const result = ComplexOperators.subtractWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.weight).to.eql(1);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it('can subtract two complex weights resulting into strictly positive real and null imaginery parts', () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(4)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(4)};
        const result = ComplexOperators.subtractWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0.5);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.weight).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it('can subtract two complex weights resulting into null real and imaginery parts', () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(4)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(4)};
        const result = ComplexOperators.subtractWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.weight).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it(`can subtract two complex weights resulting into positive real part lower than ${NULL_WEIGHT_TOLERANCE} and strictly positive imaginery parts`, () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1e-11), imaginary: new Weight(4)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(3)};
        const result = ComplexOperators.subtractWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.weight).to.eql(1);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it(`can subtract two complex weights resulting into positive real and positive imaginery parts lower than ${NULL_WEIGHT_TOLERANCE}`, () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1e-11), imaginary: new Weight(0, false)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(1e-11)};
        const result = ComplexOperators.subtractWeights(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.weight).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it(`cannot subtract two complex weights resulting into a negative real part and a positive imaginery part`, () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(4)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)};
        expect(() => ComplexOperators.subtractWeights(c1, c2)).to.throw(EM_COMPLEXWEIGHT_ADD_NEGATIVE_REAL);
    });

    it(`cannot subtract two complex weights resulting into a positive real part and a negative imaginery part`, () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(3)};
        expect(() => ComplexOperators.subtractWeights(c1, c2)).to.throw(EM_COMPLEXWEIGHT_ADD_NEGATIVE_IMAGINERY);
    });

    it(`cannot subtract two complex weights resulting into negative real and imaginery parts`, () => {
        const c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(1)};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)};
        expect(() => ComplexOperators.subtractWeights(c1, c2)).to.throw(EM_COMPLEXWEIGHT_ADD_NEGATIVE_REAL_IMAGINERY);
    });

    it('can multiply a complex weight by a complex number producing strictly positive real and imaginery parts', () => {
        const c1: Complex = {type: COMPLEX, real: 3, imaginary: 4};
        const real = 3;
        const imaginery = 1.5;
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(real), imaginary: new Weight(imaginery)};
        const result = ComplexOperators.multiplyWeight(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(3);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.weight).to.eql(16.5);
        expect(result.imaginary.strictlyPositive).to.eql(true);

        const c3 = ComplexOperators.createComplex(real, imaginery);
        const c4 = ComplexOperators.multiply(c1, c3);
        expect(c4.real).to.eql(result.real.weight);
        expect(c4.imaginary).to.eql(result.imaginary.weight);
    });

    it('can multiply a complex weight by a complex number producing a positive real part and a strictly positive imaginery parts', () => {
        const c1: Complex = {type: COMPLEX, real: 1.5, imaginary: 3};
        const real = 3;
        const imaginery = 1.5;
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(real), imaginary: new Weight(imaginery)};
        const result = ComplexOperators.multiplyWeight(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.weight).to.eql(11.25);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it('can multiply a complex weight by a complex number producing a strictly positive real part and a positive imaginery parts', () => {
        const c1: Complex = {type: COMPLEX, real: 1.5, imaginary: -3};
        const real = 1.5;
        const imaginery = 3;
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(real), imaginary: new Weight(imaginery)};
        const result = ComplexOperators.multiplyWeight(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(11.25);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.weight).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it('can multiply a complex weight by a complex number producing null real and imaginery parts', () => {
        const c1: Complex = {type: COMPLEX, real: 0, imaginary: 0};
        const real = 3;
        const imaginery = 1.5;
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(real), imaginary: new Weight(imaginery)};
        const result = ComplexOperators.multiplyWeight(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.weight).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it(`can multiply a complex weight by a complex number resulting into positive real part lower than ${NULL_WEIGHT_TOLERANCE} and a strictly positive imaginery part`, () => {
        const c1: Complex = {type: COMPLEX, real: 1 + 1e-11, imaginary: 1};
        const real = 1.5;
        const imaginery = 1.5;
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(real), imaginary: new Weight(imaginery)};
        const result = ComplexOperators.multiplyWeight(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.weight).to.be.closeTo(3, TOLERANCE_FLOAT);
        expect(result.imaginary.strictlyPositive).to.eql(true);
    });

    it(`can multiply a complex weight by a complex number resulting into positive and imaginery parts lower than ${NULL_WEIGHT_TOLERANCE}`, () => {
        const c1: Complex = {type: COMPLEX, real: 1e-11, imaginary: 1e-11};
        const real = 3;
        const imaginery = 1.5;
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(real), imaginary: new Weight(imaginery)};
        const result = ComplexOperators.multiplyWeight(c1, c2);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(0);
        expect(result.real.strictlyPositive).to.eql(false);
        expect(result.imaginary.weight).to.eql(0);
        expect(result.imaginary.strictlyPositive).to.eql(false);
    });

    it(`cannot multiply a complex weight by a complex number resulting into a negative real part and a positive imaginery part`, () => {
        const c1: Complex = {type: COMPLEX, real: 1, imaginary: 4};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)};
        expect(() => ComplexOperators.multiplyWeight(c1, c2)).to.throw(EM_COMPLEXWEIGHT_ADD_NEGATIVE_REAL);
    });

    it(`cannot multiply a complex weight by a complex number resulting into a positive real part and a negative imaginery part`, () => {
        const c1: Complex = {type: COMPLEX, real: 1, imaginary: -4};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1), imaginary: new Weight(3)};
        expect(() => ComplexOperators.multiplyWeight(c1, c2)).to.throw(EM_COMPLEXWEIGHT_ADD_NEGATIVE_IMAGINERY);
    });

    it(`cannot multiply a complex weight by a complex number resulting into negative real and imaginery parts`, () => {
        const c1: Complex = {type: COMPLEX, real: -4, imaginary: -1};
        const c2: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)};
        expect(() => ComplexOperators.multiplyWeight(c1, c2)).to.throw(EM_COMPLEXWEIGHT_ADD_NEGATIVE_REAL_IMAGINERY);
    });

    it('can clone a complex number', () => {
        let c1: Complex = {type: COMPLEX, real: 1, imaginary: 2};
        const result = ComplexOperators.clone(c1);
        expect(result.type).to.eql(COMPLEX);
        expect(result.real).to.eql(1);
        expect(result.imaginary).to.eql(2);
        c1.real = 3;
        c1.imaginary = 4;
        expect(result.real).to.eql(1);
        expect(result.imaginary).to.eql(2);
    });

    it('can clone a complex weight', () => {
        let c1: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(2)};
        const result = ComplexOperators.cloneWeight(c1);
        expect(result.type).to.eql(COMPLEXWEIGHT);
        expect(result.real.weight).to.eql(1.5);
        expect(result.real.strictlyPositive).to.eql(true);
        expect(result.imaginary.weight).to.eql(2);
        expect(result.imaginary.strictlyPositive).to.eql(true);
        c1.real = new Weight(3);
        c1.imaginary = new Weight(4);
        expect(result.real.weight).to.eql(1.5);
        expect(result.imaginary.weight).to.eql(2);
    });
});