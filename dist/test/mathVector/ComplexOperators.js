"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Weight_1 = require("../../src/mathVector/Weight");
const ComplexNumberFactory_1 = require("../../src/mathVector/ComplexNumberFactory");
const ProjectiveVectorSpace_1 = require("../../src/namedConstants/ProjectiveVectorSpace");
const ComplexOperators_1 = require("../../src/ErrorMessages/ComplexOperators");
const GeneralPurpose_1 = require("../namedConstants/GeneralPurpose");
const ComplexTypeTag_1 = require("../../src/namedConstants/ComplexTypeTag");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
describe('ComplexNumbersFactory', () => {
    it('can create a complex number descriptor', () => {
        const result = (0, ComplexNumberFactory_1.createComplexDescriptor)(1, 2);
        (0, chai_1.expect)(result.type).to.eql(ComplexTypeTag_1.COMPLEX);
        (0, chai_1.expect)(result.real).to.eql(1);
        (0, chai_1.expect)(result.imaginary).to.eql(2);
    });
    it('can create a complex number as an object', () => {
        const result = (0, ComplexNumberFactory_1.createComplex)(1, 2);
        (0, chai_1.expect)(result.real).to.eql(1);
        (0, chai_1.expect)(result.imaginary).to.eql(2);
    });
    it('can add two complex numbers using their descriptors', () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 };
        const c2 = { type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 3 };
        const result = (0, ComplexNumberFactory_1.addComplexUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(ComplexTypeTag_1.COMPLEX);
        (0, chai_1.expect)(result.real).to.eql(3);
        (0, chai_1.expect)(result.imaginary).to.eql(5);
    });
    it('can multiply two complex numbers using their descriptors', () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 };
        const c2 = { type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 3 };
        const result = (0, ComplexNumberFactory_1.multiplyComplexUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(ComplexTypeTag_1.COMPLEX);
        (0, chai_1.expect)(result.real).to.eql(-4);
        (0, chai_1.expect)(result.imaginary).to.eql(7);
    });
    it('can subtract two complex numbers using their descriptors', () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 };
        const c2 = { type: ComplexTypeTag_1.COMPLEX, real: 2, imaginary: 3 };
        const result = (0, ComplexNumberFactory_1.subtractComplexUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(ComplexTypeTag_1.COMPLEX);
        (0, chai_1.expect)(result.real).to.eql(-1);
        (0, chai_1.expect)(result.imaginary).to.eql(-1);
    });
    it('can get the conjugate of a complex number using its descriptor', () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 };
        const result = (0, ComplexNumberFactory_1.conjugateUsingDescriptor)(c1);
        (0, chai_1.expect)(result.type).to.eql(ComplexTypeTag_1.COMPLEX);
        (0, chai_1.expect)(result.real).to.eql(1);
        (0, chai_1.expect)(result.imaginary).to.eql(-2);
    });
    it('can get the magnitude of a complex number using its descriptor', () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 2 };
        const result = (0, ComplexNumberFactory_1.magnitudeUsingDescriptor)(c1);
        (0, chai_1.expect)(result).to.eql(Math.sqrt(5));
    });
    it('can add two complex non null weights', () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(3) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1.5), imaginary: new Weight_1.Weight(4) };
        const result = (0, ComplexNumberFactory_1.addComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(3.5);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(true);
        (0, chai_1.expect)(result.imaginary.value).to.eql(7);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(true);
    });
    it('can add two complex weights with null real part', () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(3) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(4) };
        const result = (0, ComplexNumberFactory_1.addComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(false);
        (0, chai_1.expect)(result.imaginary.value).to.eql(7);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(true);
    });
    it(`can add two complex weights with real parts lower than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE}`, () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1e-11), imaginary: new Weight_1.Weight(3) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1e-11), imaginary: new Weight_1.Weight(4) };
        const result = (0, ComplexNumberFactory_1.addComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(false);
        (0, chai_1.expect)(result.imaginary.value).to.eql(7);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(true);
    });
    it('can add two complex weights with null imaginary part', () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(0, false) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1.5), imaginary: new Weight_1.Weight(0, false) };
        const result = (0, ComplexNumberFactory_1.addComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(3.5);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(true);
        (0, chai_1.expect)(result.imaginary.value).to.eql(0);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(false);
    });
    it(`can add two complex weights with imaginary parts lower than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE}`, () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(1e-11) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1.5), imaginary: new Weight_1.Weight(1e-11) };
        const result = (0, ComplexNumberFactory_1.addComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(3.5);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(true);
        (0, chai_1.expect)(result.imaginary.value).to.eql(0);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(false);
    });
    it('can add two complex weights with null real and imaginary parts', () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(0, false) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(0, false) };
        const result = (0, ComplexNumberFactory_1.addComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(false);
        (0, chai_1.expect)(result.imaginary.value).to.eql(0);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(false);
    });
    it(`can add two complex weights with real and imaginary parts lower than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE}`, () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1e-11), imaginary: new Weight_1.Weight(1e-11) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1e-11), imaginary: new Weight_1.Weight(1e-11) };
        const result = (0, ComplexNumberFactory_1.addComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(false);
        (0, chai_1.expect)(result.imaginary.value).to.eql(0);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(false);
    });
    it('can subtract two complex weights resulting into strictly positive real and imaginary parts', () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(4) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1.5), imaginary: new Weight_1.Weight(3) };
        const result = (0, ComplexNumberFactory_1.subtractComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0.5);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(true);
        (0, chai_1.expect)(result.imaginary.value).to.eql(1);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(true);
    });
    it('can subtract two complex weights resulting into null real and strictly positive imaginary parts', () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(4) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(3) };
        const result = (0, ComplexNumberFactory_1.subtractComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(false);
        (0, chai_1.expect)(result.imaginary.value).to.eql(1);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(true);
    });
    it('can subtract two complex weights resulting into strictly positive real and null imaginary parts', () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(4) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1.5), imaginary: new Weight_1.Weight(4) };
        const result = (0, ComplexNumberFactory_1.subtractComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0.5);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(true);
        (0, chai_1.expect)(result.imaginary.value).to.eql(0);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(false);
    });
    it('can subtract two complex weights resulting into null real and imaginary parts', () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(4) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(4) };
        const result = (0, ComplexNumberFactory_1.subtractComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(false);
        (0, chai_1.expect)(result.imaginary.value).to.eql(0);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(false);
    });
    it(`can subtract two complex weights resulting into positive real part lower than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE} and strictly positive imaginary parts`, () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1e-11), imaginary: new Weight_1.Weight(4) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(3) };
        const result = (0, ComplexNumberFactory_1.subtractComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(false);
        (0, chai_1.expect)(result.imaginary.value).to.eql(1);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(true);
    });
    it(`can subtract two complex weights resulting into positive real and positive imaginary parts lower than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE}`, () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1e-11), imaginary: new Weight_1.Weight(0, false) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(0, false), imaginary: new Weight_1.Weight(1e-11) };
        const result = (0, ComplexNumberFactory_1.subtractComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(false);
        (0, chai_1.expect)(result.imaginary.value).to.eql(0);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(false);
    });
    it(`cannot subtract two complex weights resulting into a negative real part and a positive imaginary part`, () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(4) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(3) };
        (0, chai_1.expect)(() => (0, ComplexNumberFactory_1.subtractComplexWeightsUsingDescriptors)(c1, c2)).to.throw(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
    });
    it(`cannot subtract two complex weights resulting into a positive real part and a negative imaginary part`, () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(1) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(3) };
        (0, chai_1.expect)(() => (0, ComplexNumberFactory_1.subtractComplexWeightsUsingDescriptors)(c1, c2)).to.throw(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY);
    });
    it(`cannot subtract two complex weights resulting into negative real and imaginary parts`, () => {
        const c1 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(1) };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(3) };
        (0, chai_1.expect)(() => (0, ComplexNumberFactory_1.subtractComplexWeightsUsingDescriptors)(c1, c2)).to.throw(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY);
    });
    it('can multiply a complex weight by a complex number producing strictly positive real and imaginary parts', () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 3, imaginary: 4 };
        const real = 3;
        const imaginary = 1.5;
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(real), imaginary: new Weight_1.Weight(imaginary) };
        const result = (0, ComplexNumberFactory_1.multiplyComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(3);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(true);
        (0, chai_1.expect)(result.imaginary.value).to.eql(16.5);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(true);
        const c3 = (0, ComplexNumberFactory_1.createComplexDescriptor)(real, imaginary);
        const c4 = (0, ComplexNumberFactory_1.multiplyComplexUsingDescriptors)(c1, c3);
        (0, chai_1.expect)(c4.real).to.eql(result.real.value);
        (0, chai_1.expect)(c4.imaginary).to.eql(result.imaginary.value);
    });
    it('can multiply a complex weight by a complex number producing a positive real part and a strictly positive imaginary parts', () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 1.5, imaginary: 3 };
        const real = 3;
        const imaginary = 1.5;
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(real), imaginary: new Weight_1.Weight(imaginary) };
        const result = (0, ComplexNumberFactory_1.multiplyComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(false);
        (0, chai_1.expect)(result.imaginary.value).to.eql(11.25);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(true);
    });
    it('can multiply a complex weight by a complex number producing a strictly positive real part and a positive imaginary parts', () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 1.5, imaginary: -3 };
        const real = 1.5;
        const imaginary = 3;
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(real), imaginary: new Weight_1.Weight(imaginary) };
        const result = (0, ComplexNumberFactory_1.multiplyComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(11.25);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(true);
        (0, chai_1.expect)(result.imaginary.value).to.eql(0);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(false);
    });
    it('can multiply a complex weight by a complex number producing null real and imaginary parts', () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const real = 3;
        const imaginary = 1.5;
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(real), imaginary: new Weight_1.Weight(imaginary) };
        const result = (0, ComplexNumberFactory_1.multiplyComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(false);
        (0, chai_1.expect)(result.imaginary.value).to.eql(0);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(false);
    });
    it(`can multiply a complex weight by a complex number resulting into positive real part lower than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE} and a strictly positive imaginary part`, () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 1 + 1e-11, imaginary: 1 };
        const real = 1.5;
        const imaginary = 1.5;
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(real), imaginary: new Weight_1.Weight(imaginary) };
        const result = (0, ComplexNumberFactory_1.multiplyComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(false);
        (0, chai_1.expect)(result.imaginary.value).to.be.closeTo(3, GeneralPurpose_1.TOLERANCE_FLOAT);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(true);
    });
    it(`can multiply a complex weight by a complex number resulting into positive and imaginary parts lower than ${ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE}`, () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 1e-11, imaginary: 1e-11 };
        const real = 3;
        const imaginary = 1.5;
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(real), imaginary: new Weight_1.Weight(imaginary) };
        const result = (0, ComplexNumberFactory_1.multiplyComplexWeightsUsingDescriptors)(c1, c2);
        (0, chai_1.expect)(result.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        (0, chai_1.expect)(result.real.value).to.eql(0);
        (0, chai_1.expect)(result.real.strictlyPositive).to.eql(false);
        (0, chai_1.expect)(result.imaginary.value).to.eql(0);
        (0, chai_1.expect)(result.imaginary.strictlyPositive).to.eql(false);
    });
    it(`cannot multiply a complex weight by a complex number resulting into a negative real part and a positive imaginary part`, () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: 4 };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(3) };
        (0, chai_1.expect)(() => (0, ComplexNumberFactory_1.multiplyComplexWeightsUsingDescriptors)(c1, c2)).to.throw(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
    });
    it(`cannot multiply a complex weight by a complex number resulting into a positive real part and a negative imaginary part`, () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: 1, imaginary: -4 };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(1), imaginary: new Weight_1.Weight(3) };
        (0, chai_1.expect)(() => (0, ComplexNumberFactory_1.multiplyComplexWeightsUsingDescriptors)(c1, c2)).to.throw(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY);
    });
    it(`cannot multiply a complex weight by a complex number resulting into negative real and imaginary parts`, () => {
        const c1 = { type: ComplexTypeTag_1.COMPLEX, real: -4, imaginary: -1 };
        const c2 = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(2), imaginary: new Weight_1.Weight(3) };
        (0, chai_1.expect)(() => (0, ComplexNumberFactory_1.multiplyComplexWeightsUsingDescriptors)(c1, c2)).to.throw(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY);
    });
});
