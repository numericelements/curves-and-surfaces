import { expect } from "chai";
import { Weight } from "../../src/mathVector/Weight";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { EM_WEIGHT_VALUE_POSITIVE, EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../../src/ErrorMessages/Weight";

describe('Weight', () => {

    describe('Constructor', () => {
        it('can generate a Weight object without a weight value', () => {
            const weight = new Weight();
            expect(weight.weight).to.eql(DEFAULT_WEIGHT_VALUE);
        });

        it('can generate a Weight object with a weight value that must be strictly positive', () => {
            const value = 1;
            const weight = new Weight(value);
            expect(weight.weight).to.eql(value);
        });

        it('can generate a Weight object with a weight value that can be null', () => {
            const value = 0;
            const strictlyPositive = false;
            const weight = new Weight(value, strictlyPositive);
            expect(weight.weight).to.eql(value);
        });

        it('cannot generate a Weight object with a negative weight value while the weight should be strictly positive', () => {
            const value = -1;
            expect(() => new Weight(value)).to.throw(EM_WEIGHT_VALUE_STRICTLY_POSITIVE);
        });

        it('cannot generate a Weight object with a negative weight value while the weight should be positive', () => {
            const value = -1;
            const strictlyPositive = false;
            expect(() => new Weight(value, strictlyPositive)).to.throw(EM_WEIGHT_VALUE_POSITIVE);
        });

        it('cannot generate a Weight object with a null weight value while the weight should be strictly positive', () => {
            const value = 0;
            const strictlyPositive = true;
            expect(() => new Weight(value, strictlyPositive)).to.throw(EM_WEIGHT_VALUE_STRICTLY_POSITIVE);
        });
    });

    describe('Accessors', () => {
        it('can get the weight value while the weight should be strictly positive', () => {
            const value = 1;
            const strictlyPositive = true;
            const weight = new Weight(value, strictlyPositive);
            expect(weight.weight).to.eql(value);
        });

        it('can get the weight value while the weight should be positive', () => {
            const value = 1;
            const strictlyPositive = false;
            const weight = new Weight(value, strictlyPositive);
            expect(weight.weight).to.eql(value);
        });

        it('can set the weight value while the weight should be strictly positive', () => {
            const value = 1;
            const strictlyPositive = true;
            const weight = new Weight(value, strictlyPositive);
            const newValue = 2;
            weight.weight = newValue;
            expect(weight.weight).to.eql(newValue);
        });

        it('can set the weight value while the weight should be positive', () => {
            const value = 1;
            const strictlyPositive = false;
            const weight = new Weight(value, strictlyPositive);
            const newValue = 0;
            weight.weight = newValue;
            expect(weight.weight).to.eql(newValue);
        });

        it('cannot set the weight value to a negative value while the weight must be strictly positive', () => {
            const value = 1;
            const strictlyPositive = true;
            const weight = new Weight(value, strictlyPositive);
            const newValue = -1;
            expect(() => weight.weight = newValue).to.throw(EM_WEIGHT_VALUE_STRICTLY_POSITIVE);
        });

        it('cannot set the weight value to a negative value while the weight should be positive', () => {
            const value = 1;
            const strictlyPositive = false;
            const weight = new Weight(value, strictlyPositive);
            const newValue = -1;
            expect(() => weight.weight = newValue).to.throw(EM_WEIGHT_VALUE_POSITIVE);
        });

        it('cannot set the weight value to a null value while the weight must be strictly positive', () => {
            const value = 1;
            const strictlyPositive = true;
            const weight = new Weight(value, strictlyPositive);
            const newValue = 0;
            expect(() => weight.weight = newValue).to.throw(EM_WEIGHT_VALUE_STRICTLY_POSITIVE);
        });

        it('can get the weight positivity status while the weight must be strictly positive', () => {
            const value = 1;
            const strictlyPositive = true;
            const weight = new Weight(value, strictlyPositive);
            expect(weight.strictlyPositive).to.eql(true);
        });

        it('can get the weight positivity status while the weight must be positive', () => {
            const value = 1;
            const strictlyPositive = false;
            const weight = new Weight(value, strictlyPositive);
            expect(weight.strictlyPositive).to.eql(false);
        });
    });
});