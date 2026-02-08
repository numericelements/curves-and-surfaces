import { expect } from "chai";
import { ComplexWeight } from "../../src/mathVector/ComplexWeight";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { Weight } from "../../src/mathVector/Weight";
import { EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT } from "../../src/ErrorMessages/ComplexWeight";
import { COMPLEXWEIGHT } from "../../src/namedConstants/WeightTypeTags";

describe('ComplexWeight', () => {

    describe('Constructor', () => {
        it('can generate a ComplexWeight object without weight values', () => {
            const weight = new ComplexWeight();
            expect(weight.real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(weight.real.strictlyPositive).to.eql(true);
            expect(weight.imaginary.strictlyPositive).to.eql(false);
        });

        it('can generate a ComplexWeight object with prescribed real weight value that must be strictly positive and default imaginary weight value', () => {
            const valueReal = 2;
            const weightR = new Weight(valueReal);
            const weight = new ComplexWeight(weightR);
            expect(weight.real.value).to.eql(valueReal);
            expect(weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(weight.real.strictlyPositive).to.eql(true);
            expect(weight.imaginary.strictlyPositive).to.eql(false);
        });

        it('can generate a ComplexWeight object with prescribed real weight value that is positive and default imaginary weight value that is positive', () => {
            const valueReal = 2;
            const strictlyPositive = false;
            const weightR = new Weight(valueReal, strictlyPositive);
            const weight = new ComplexWeight(weightR);
            expect(weight.real.value).to.eql(valueReal);
            expect(weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(weight.real.strictlyPositive).to.eql(false);
            expect(weight.imaginary.strictlyPositive).to.eql(false);
        });

        it('can generate a ComplexWeight object with null real weight value and default imaginary weight value that is positive', () => {
            const valueReal = 0;
            const strictlyPositive = false;
            const weightR = new Weight(valueReal, strictlyPositive);
            const weight = new ComplexWeight(weightR);
            expect(weight.real.value).to.eql(valueReal);
            expect(weight.imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(weight.real.strictlyPositive).to.eql(false);
            expect(weight.imaginary.strictlyPositive).to.eql(false);
        });

        it('can generate a ComplexWeight object with weight values that must be strictly positive', () => {
            const valueReal = 2;
            const weightR = new Weight(valueReal);
            const valueImaginary = 3;
            const weightI = new Weight(valueImaginary);
            const weight = new ComplexWeight(weightR, weightI);
            expect(weight.real.value).to.eql(valueReal);
            expect(weight.imaginary.value).to.eql(valueImaginary);
            expect(weight.real.strictlyPositive).to.eql(true);
            expect(weight.imaginary.strictlyPositive).to.eql(true);
        });

        it('can generate a ComplexWeight object with weight values that can be positive', () => {
            const valueReal = 2;
            const strictlyPositive = false;
            const weightR = new Weight(valueReal, strictlyPositive);
            const valueImaginary = 3;
            const weightI = new Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight(weightR, weightI);
            expect(weight.real.value).to.eql(valueReal);
            expect(weight.imaginary.value).to.eql(valueImaginary);
            expect(weight.real.strictlyPositive).to.eql(false);
            expect(weight.imaginary.strictlyPositive).to.eql(false);
        });

        it('can generate a ComplexWeight object with a null complex weight', () => {
            const valueReal = 0;
            const strictlyPositive = false;
            const weightR = new Weight(valueReal, strictlyPositive);
            const valueImaginary = 0;
            const weightI = new Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight(weightR, weightI);
            expect(weight.real.value).to.eql(valueReal);
            expect(weight.imaginary.value).to.eql(valueImaginary);
            expect(weight.real.strictlyPositive).to.eql(false);
            expect(weight.imaginary.strictlyPositive).to.eql(false);
        });

        // Deactivated unit test to set the imaginary weight free of strict positivity constraint
        // it('cannot generate a ComplexWeight object when real and imaginary weight positivity status differ', () => {
        //     let valueR = 0;
        //     const strictlyPositive = false;
        //     let weightR = new Weight(valueR, strictlyPositive);
        //     let valueImaginary = 3;
        //     let weightI = new Weight(valueImaginary);
        //     expect(() => new ComplexWeight(weightR, weightI)).to.throw(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        //     valueR = 2;
        //     weightR = new Weight(valueR);
        //     valueImaginary = 3;
        //     weightI = new Weight(valueImaginary, strictlyPositive);
        //     expect(() => new ComplexWeight(weightR, weightI)).to.throw(EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
        // });

        it('can generate a ComplexWeight object with a real weight value that can be null', () => {
            const valueR = 0;
            const strictlyPositive = false;
            const weightR = new Weight(valueR, strictlyPositive);
            const valueImaginary = 3;
            const weightI = new Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight(weightR, weightI);
            expect(weight.real.value).to.eql(valueR);
            expect(weight.imaginary.value).to.eql(valueImaginary);
            expect(weight.real.strictlyPositive).to.eql(false);
            expect(weight.imaginary.strictlyPositive).to.eql(false);
        });

        it('can generate a ComplexWeight object with an imaginary weight value that can be null', () => {
            const valueR = 2;
            const strictlyPositive = false;
            const weightR = new Weight(valueR, strictlyPositive);
            const valueImaginary = 0;
            const weightI = new Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight(weightR, weightI);
            expect(weight.real.value).to.eql(valueR);
            expect(weight.imaginary.value).to.eql(valueImaginary);
            expect(weight.real.strictlyPositive).to.eql(false);
            expect(weight.imaginary.strictlyPositive).to.eql(false);
        });

    });

    describe('Accessors', () => {
        it('can get the real weight value while the complex weight should be strictly positive', () => {
            const valueR = 2;
            const valueImaginary = 3;
            const strictlyPositive = true;
            const weightR = new Weight(valueR, strictlyPositive);
            const weightI = new Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight(weightR, weightI);
            expect(weight.real).to.eql(weightR);
            expect(weight.real.strictlyPositive).to.eql(true);
        });

        it('can get the imaginary weight value while the complex weight should be strictly positive', () => {
            const valueR = 2;
            const valueImaginary = 3;
            const strictlyPositive = true;
            const weightR = new Weight(valueR, strictlyPositive);
            const weightI = new Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight(weightR, weightI);
            expect(weight.imaginary).to.eql(weightI);
            expect(weight.imaginary.strictlyPositive).to.eql(true);
        });

        it('can get the real weight value while the complex weight should be positive', () => {
            const valueR = 0;
            const valueImaginary = 3;
            const strictlyPositive = false;
            const weightR = new Weight(valueR, strictlyPositive);
            const weightI = new Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight(weightR, weightI);
            expect(weight.real).to.eql(weightR);
            expect(weight.real.strictlyPositive).to.eql(false);
        });

        it('can get the imaginary weight value while the complex weight should be positive', () => {
            const valueR = 2;
            const valueImaginary = 0;
            const strictlyPositive = false;
            const weightR = new Weight(valueR, strictlyPositive);
            const weightI = new Weight(valueImaginary, strictlyPositive);
            const weight = new ComplexWeight(weightR, weightI);
            expect(weight.imaginary).to.eql(weightI);
            expect(weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can get the type of the complex weight`, () => {
            const valueR = 2;
            const valueImaginary = 4;
            const weightR = new Weight(valueR);
            const weightI = new Weight(valueImaginary);
            const weight = new ComplexWeight(weightR, weightI);
            expect(weight.type).to.eql(COMPLEXWEIGHT);
        });
    });

    describe('Methods', () => {
        it(`can clone a complex weight`, () => {
            const valueR = 2;
            const valueImaginary = 4;
            let weightR = new Weight(valueR);
            let weightI = new Weight(valueImaginary);
            let weight = new ComplexWeight(weightR, weightI);
            const newWeight = weight.clone();
            expect(newWeight.real).to.eql(weightR)
            expect(newWeight.imaginary).to.eql(weightI)
            weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            weightI = new Weight(valueImaginary, false);
            weight = new ComplexWeight(weightR, weightI);
            expect(newWeight.real).to.not.eql(weightR);
            expect(newWeight.imaginary).to.not.eql(weightI);
            expect(newWeight.real.strictlyPositive).to.not.eql(weight.real.strictlyPositive);
        });

        it(`can get the complex weight descriptor as a string`, () => {
            const valueR = 2;
            const valueImaginary = 4;
            const weightR = new Weight(valueR);
            const weightI = new Weight(valueImaginary);
            const weight = new ComplexWeight(weightR, weightI);
            const string = weight.toString();
            expect(string).to.eql(COMPLEXWEIGHT + `(real: ${weight.real.toString()}, imaginary: ${weight.imaginary.toString()})`);
        });

        it(`can get the complex weight descriptor`, () => {
            const valueR = 2;
            const valueImaginary = 4;
            const weightR = new Weight(valueR);
            const weightI = new Weight(valueImaginary);
            const weight = new ComplexWeight(weightR, weightI);
            const descriptor = weight.toDescriptor();
            expect(descriptor.type).to.eql(COMPLEXWEIGHT);
            expect(descriptor.real).to.eql(weight.real);
            expect(descriptor.imaginary).to.eql(weight.imaginary);
        });

        it(`can extract the complex weight values to generate a Complex`, () => {
            const valueR = 2;
            const valueImaginary = 4;
            const weightR = new Weight(valueR);
            const weightI = new Weight(valueImaginary);
            const weight = new ComplexWeight(weightR, weightI);
            const complex = weight.toComplex();
            expect(complex.real).to.eql(weight.real.value);
            expect(complex.imaginary).to.eql(weight.imaginary.value);
        });
    });
});