import { expect } from "chai";
import { Weight } from "../../src/mathVector/Weight";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { EM_WEIGHT_VALUE_POSITIVE, EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../../src/ErrorMessages/Weight";
import { WEIGHT } from "../../src/mathVector/VectorSpaceConstructorInterface";

describe('Weight', () => {

    describe('Constructor', () => {
        it('can generate a Weight object without a weight value', () => {
            const weight = new Weight();
            expect(weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(weight.strictlyPositive).to.eql(true);
        });

        it('can generate a Weight object with a weight value that must be strictly positive', () => {
            const value = 1;
            const weight = new Weight(value);
            expect(weight.value).to.eql(value);
            expect(weight.strictlyPositive).to.eql(true);
        });

        it('can generate a Weight object with a weight value that can be null', () => {
            const value = 0;
            const strictlyPositive = false;
            const weight = new Weight(value, strictlyPositive);
            expect(weight.value).to.eql(value);
            expect(weight.strictlyPositive).to.eql(false);
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
            expect(weight.value).to.eql(value);
        });

        it('can get the weight value while the weight should be positive', () => {
            const value = 1;
            const strictlyPositive = false;
            const weight = new Weight(value, strictlyPositive);
            expect(weight.value).to.eql(value);
        });

        it(`can get the type of the weight`, () => {
            const value = 5;
            const weight = new Weight(value);
            expect(weight.type).to.eql(WEIGHT);
        });

        it(`can clone weight`, () => {
            const value = 10;
            let weight = new Weight(value);
            const newWeight = weight.clone();
            expect(newWeight.value).to.eql(weight.value)
            expect(newWeight.strictlyPositive).to.eql(weight.strictlyPositive)
            weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            expect(newWeight.value).to.not.eql(weight.value);
            expect(newWeight.strictlyPositive).to.not.eql(weight.strictlyPositive);
        });

        it(`can get the weight descriptor as a string`, () => {
            const value = 10;
            const weight = new Weight(value);
            const string = weight.toString();
            expect(string).to.eql(WEIGHT + `(value: ${weight.value}, strictlyPositive: ${weight.strictlyPositive})`);
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