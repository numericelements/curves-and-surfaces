"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Weight_1 = require("../../src/mathVector/Weight");
const Weight_2 = require("../../src/namedConstants/Weight");
const Weight_3 = require("../../src/ErrorMessages/Weight");
const WeightTypeTags_1 = require("../../src/namedConstants/WeightTypeTags");
describe('Weight', () => {
    describe('Constructor', () => {
        it('can generate a Weight object without a weight value', () => {
            const weight = new Weight_1.Weight();
            (0, chai_1.expect)(weight.value).to.eql(Weight_2.DEFAULT_WEIGHT_VALUE);
            (0, chai_1.expect)(weight.strictlyPositive).to.eql(true);
        });
        it('can generate a Weight object with a weight value that must be strictly positive', () => {
            const value = 1;
            const weight = new Weight_1.Weight(value);
            (0, chai_1.expect)(weight.value).to.eql(value);
            (0, chai_1.expect)(weight.strictlyPositive).to.eql(true);
        });
        it('can generate a Weight object with a weight value that can be null', () => {
            const value = 0;
            const strictlyPositive = false;
            const weight = new Weight_1.Weight(value, strictlyPositive);
            (0, chai_1.expect)(weight.value).to.eql(value);
            (0, chai_1.expect)(weight.strictlyPositive).to.eql(false);
        });
        it('cannot generate a Weight object with a negative weight value while the weight should be strictly positive', () => {
            const value = -1;
            (0, chai_1.expect)(() => new Weight_1.Weight(value)).to.throw(Weight_3.EM_WEIGHT_VALUE_STRICTLY_POSITIVE);
        });
        it('cannot generate a Weight object with a negative weight value while the weight should be positive', () => {
            const value = -1;
            const strictlyPositive = false;
            (0, chai_1.expect)(() => new Weight_1.Weight(value, strictlyPositive)).to.throw(Weight_3.EM_WEIGHT_VALUE_POSITIVE);
        });
        it('cannot generate a Weight object with a null weight value while the weight should be strictly positive', () => {
            const value = 0;
            const strictlyPositive = true;
            (0, chai_1.expect)(() => new Weight_1.Weight(value, strictlyPositive)).to.throw(Weight_3.EM_WEIGHT_VALUE_STRICTLY_POSITIVE);
        });
    });
    describe('Accessors', () => {
        it('can get the weight value while the weight should be strictly positive', () => {
            const value = 1;
            const strictlyPositive = true;
            const weight = new Weight_1.Weight(value, strictlyPositive);
            (0, chai_1.expect)(weight.value).to.eql(value);
        });
        it('can get the weight value while the weight should be positive', () => {
            const value = 1;
            const strictlyPositive = false;
            const weight = new Weight_1.Weight(value, strictlyPositive);
            (0, chai_1.expect)(weight.value).to.eql(value);
        });
        it(`can get the type of the weight`, () => {
            const value = 5;
            const weight = new Weight_1.Weight(value);
            (0, chai_1.expect)(weight.type).to.eql(WeightTypeTags_1.WEIGHT);
        });
        it('can get the weight positivity status while the weight must be strictly positive', () => {
            const value = 1;
            const strictlyPositive = true;
            const weight = new Weight_1.Weight(value, strictlyPositive);
            (0, chai_1.expect)(weight.strictlyPositive).to.eql(true);
        });
        it('can get the weight positivity status while the weight must be positive', () => {
            const value = 1;
            const strictlyPositive = false;
            const weight = new Weight_1.Weight(value, strictlyPositive);
            (0, chai_1.expect)(weight.strictlyPositive).to.eql(false);
        });
    });
    describe('Methods', () => {
        it(`can clone weight`, () => {
            const value = 10;
            let weight = new Weight_1.Weight(value);
            const newWeight = weight.clone();
            (0, chai_1.expect)(newWeight.value).to.eql(weight.value);
            (0, chai_1.expect)(newWeight.strictlyPositive).to.eql(weight.strictlyPositive);
            weight = new Weight_1.Weight(Weight_2.DEFAULT_WEIGHT_VALUE, false);
            (0, chai_1.expect)(newWeight.value).to.not.eql(weight.value);
            (0, chai_1.expect)(newWeight.strictlyPositive).to.not.eql(weight.strictlyPositive);
        });
        it(`can get the weight descriptor as a string`, () => {
            const value = 10;
            const weight = new Weight_1.Weight(value);
            const string = weight.toString();
            (0, chai_1.expect)(string).to.eql(WeightTypeTags_1.WEIGHT + `(value: ${weight.value}, strictlyPositive: ${weight.strictlyPositive})`);
        });
    });
});
