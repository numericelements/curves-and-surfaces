"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ComplexWeight_1 = require("../../src/mathVector/ComplexWeight");
const Weight_1 = require("../../src/namedConstants/Weight");
const Weight_2 = require("../../src/mathVector/Weight");
const ComplexWeight_2 = require("../../src/ErrorMessages/ComplexWeight");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
describe('ComplexWeight', () => {
    describe('Constructor', () => {
        it('can generate a ComplexWeight object without weight values', () => {
            const weight = new ComplexWeight_1.ComplexWeight();
            (0, chai_1.expect)(weight.real.value).to.eql(Weight_1.DEFAULT_WEIGHT_VALUE);
            (0, chai_1.expect)(weight.imaginary.value).to.eql(Weight_1.DEFAULT_WEIGHT_VALUE);
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(true);
        });
        it('can generate a ComplexWeight object with prescribed real weight value that must be strictly positive and default imaginary weight value', () => {
            const valueReal = 2;
            const weightR = new Weight_2.Weight(valueReal);
            const weight = new ComplexWeight_1.ComplexWeight(weightR);
            (0, chai_1.expect)(weight.real.value).to.eql(valueReal);
            (0, chai_1.expect)(weight.imaginary.value).to.eql(Weight_1.DEFAULT_WEIGHT_VALUE);
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(true);
        });
        it('can generate a ComplexWeight object with prescribed real weight value that is positive and default imaginary weight value that is positive', () => {
            const valueReal = 2;
            const strictlyPositive = false;
            const weightR = new Weight_2.Weight(valueReal, strictlyPositive);
            const weight = new ComplexWeight_1.ComplexWeight(weightR);
            (0, chai_1.expect)(weight.real.value).to.eql(valueReal);
            (0, chai_1.expect)(weight.imaginary.value).to.eql(Weight_1.DEFAULT_WEIGHT_VALUE);
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(false);
        });
        it('can generate a ComplexWeight object with null real weight value and default imaginary weight value that is positive', () => {
            const valueReal = 0;
            const strictlyPositive = false;
            const weightR = new Weight_2.Weight(valueReal, strictlyPositive);
            const weight = new ComplexWeight_1.ComplexWeight(weightR);
            (0, chai_1.expect)(weight.real.value).to.eql(valueReal);
            (0, chai_1.expect)(weight.imaginary.value).to.eql(Weight_1.DEFAULT_WEIGHT_VALUE);
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(false);
        });
        it('can generate a ComplexWeight object with weight values that must be strictly positive', () => {
            const valueReal = 2;
            const weightR = new Weight_2.Weight(valueReal);
            const valueImaginary = 3;
            const weightI = new Weight_2.Weight(valueImaginary);
            const weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            (0, chai_1.expect)(weight.real.value).to.eql(valueReal);
            (0, chai_1.expect)(weight.imaginary.value).to.eql(valueImaginary);
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(true);
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(true);
        });
        it('can generate a ComplexWeight object with weight values that can be positive', () => {
            const valueReal = 2;
            const strictlyPositive = false;
            const weightR = new Weight_2.Weight(valueReal, strictlyPositive);
            const valueImaginary = 3;
            const weightI = new Weight_2.Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            (0, chai_1.expect)(weight.real.value).to.eql(valueReal);
            (0, chai_1.expect)(weight.imaginary.value).to.eql(valueImaginary);
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(false);
        });
        it('can generate a ComplexWeight object with a null complex weight', () => {
            const valueReal = 0;
            const strictlyPositive = false;
            const weightR = new Weight_2.Weight(valueReal, strictlyPositive);
            const valueImaginary = 0;
            const weightI = new Weight_2.Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            (0, chai_1.expect)(weight.real.value).to.eql(valueReal);
            (0, chai_1.expect)(weight.imaginary.value).to.eql(valueImaginary);
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(false);
        });
        it('cannot generate a ComplexWeight object when real and imaginary weight positivity status differ', () => {
            let valueR = 0;
            const strictlyPositive = false;
            let weightR = new Weight_2.Weight(valueR, strictlyPositive);
            let valueImaginary = 3;
            let weightI = new Weight_2.Weight(valueImaginary);
            (0, chai_1.expect)(() => new ComplexWeight_1.ComplexWeight(weightR, weightI)).to.throw(ComplexWeight_2.EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
            valueR = 2;
            weightR = new Weight_2.Weight(valueR);
            valueImaginary = 3;
            weightI = new Weight_2.Weight(valueImaginary, strictlyPositive);
            (0, chai_1.expect)(() => new ComplexWeight_1.ComplexWeight(weightR, weightI)).to.throw(ComplexWeight_2.EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        });
        it('can generate a ComplexWeight object with a real weight value that can be null', () => {
            const valueR = 0;
            const strictlyPositive = false;
            const weightR = new Weight_2.Weight(valueR, strictlyPositive);
            const valueImaginary = 3;
            const weightI = new Weight_2.Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            (0, chai_1.expect)(weight.real.value).to.eql(valueR);
            (0, chai_1.expect)(weight.imaginary.value).to.eql(valueImaginary);
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(false);
        });
        it('can generate a ComplexWeight object with an imaginary weight value that can be null', () => {
            const valueR = 2;
            const strictlyPositive = false;
            const weightR = new Weight_2.Weight(valueR, strictlyPositive);
            const valueImaginary = 0;
            const weightI = new Weight_2.Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            (0, chai_1.expect)(weight.real.value).to.eql(valueR);
            (0, chai_1.expect)(weight.imaginary.value).to.eql(valueImaginary);
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(false);
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(false);
        });
    });
    describe('Accessors', () => {
        it('can get the real weight value while the complex weight should be strictly positive', () => {
            const valueR = 2;
            const valueImaginary = 3;
            const strictlyPositive = true;
            const weightR = new Weight_2.Weight(valueR, strictlyPositive);
            const weightI = new Weight_2.Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            (0, chai_1.expect)(weight.real).to.eql(weightR);
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(true);
        });
        it('can get the imaginary weight value while the complex weight should be strictly positive', () => {
            const valueR = 2;
            const valueImaginary = 3;
            const strictlyPositive = true;
            const weightR = new Weight_2.Weight(valueR, strictlyPositive);
            const weightI = new Weight_2.Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            (0, chai_1.expect)(weight.imaginary).to.eql(weightI);
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(true);
        });
        it('can get the real weight value while the complex weight should be positive', () => {
            const valueR = 0;
            const valueImaginary = 3;
            const strictlyPositive = false;
            const weightR = new Weight_2.Weight(valueR, strictlyPositive);
            const weightI = new Weight_2.Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            (0, chai_1.expect)(weight.real).to.eql(weightR);
            (0, chai_1.expect)(weight.real.strictlyPositive).to.eql(false);
        });
        it('can get the imaginary weight value while the complex weight should be positive', () => {
            const valueR = 2;
            const valueImaginary = 0;
            const strictlyPositive = false;
            const weightR = new Weight_2.Weight(valueR, strictlyPositive);
            const weightI = new Weight_2.Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            (0, chai_1.expect)(weight.imaginary).to.eql(weightI);
            (0, chai_1.expect)(weight.imaginary.strictlyPositive).to.eql(false);
        });
        it(`can get the type of the complex weight`, () => {
            const valueR = 2;
            const valueImaginary = 4;
            const weightR = new Weight_2.Weight(valueR);
            const weightI = new Weight_2.Weight(valueImaginary);
            const weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            (0, chai_1.expect)(weight.type).to.eql(WeightTypeTags_1.COMPLEXWEIGHT);
        });
    });
    describe('Methods', () => {
        it(`can clone a complex weight`, () => {
            const valueR = 2;
            const valueImaginary = 4;
            let weightR = new Weight_2.Weight(valueR);
            let weightI = new Weight_2.Weight(valueImaginary);
            let weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            const newWeight = weight.clone();
            (0, chai_1.expect)(newWeight.real).to.eql(weightR);
            (0, chai_1.expect)(newWeight.imaginary).to.eql(weightI);
            weightR = new Weight_2.Weight(Weight_1.DEFAULT_WEIGHT_VALUE, false);
            weightI = new Weight_2.Weight(valueImaginary, false);
            weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            (0, chai_1.expect)(newWeight.real).to.not.eql(weightR);
            (0, chai_1.expect)(newWeight.imaginary).to.not.eql(weightI);
            (0, chai_1.expect)(newWeight.real.strictlyPositive).to.not.eql(weight.real.strictlyPositive);
        });
        it(`can get the complex weight descriptor as a string`, () => {
            const valueR = 2;
            const valueImaginary = 4;
            const weightR = new Weight_2.Weight(valueR);
            const weightI = new Weight_2.Weight(valueImaginary);
            const weight = new ComplexWeight_1.ComplexWeight(weightR, weightI);
            const string = weight.toString();
            (0, chai_1.expect)(string).to.eql(WeightTypeTags_1.COMPLEXWEIGHT + `(real: ${weight.real.toString()}, imaginary: ${weight.imaginary.toString()})`);
        });
    });
});
