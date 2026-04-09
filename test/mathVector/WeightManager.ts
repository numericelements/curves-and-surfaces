import { expect } from "chai";
import { WeightManager } from "../../src/mathVector/WeightManager";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveRealVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { EM_FORCE_NULL_WEIGHT_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT, EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_SCALE_FACTOR_NULL, EM_SCALE_FACTOR_STRICTLY_NEGATIVE, EM_TOGGLE_STATUS_INCOMPATIBLE, EM_WEIGHT_MANAGEMENT_UNKOWN, EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT, EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT, EM_WEIGHT_SUBTRACTION_ERROR } from "../../src/ErrorMessages/WeightManager";
import { WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE, WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE } from "../../src/WarningMessages/WeightManager";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { EM_WEIGHT_VALUE_POSITIVE, EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../../src/ErrorMessages/Weight";
import { ComplexWeight } from "../../src/mathVector/ComplexWeight";
import { Complex } from "../../src/mathVector/Complex";

describe('WeightManager', () => {

    describe('Constructor', () => {

        it('can generate a Weight manager with ' + WeightManagement.AllPositiveWeights + ' weight management', () => {
            const weightManagement = WeightManagement.AllPositiveWeights;
            expect(() => new WeightManager(weightManagement)).to.not.throw()
        });

        it('can generate a Weight manager with ' + WeightManagement.AllStrictlyPositiveWeights + ' weight management', () => {
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            expect(() => new WeightManager(weightManagement)).to.not.throw()
        });

        it('can generate a Weight manager with ' + WeightManagement.SomeNullWeights + ' weight management', () => {
            const weightManagement = WeightManagement.SomeNullWeights;
            expect(() => new WeightManager(weightManagement)).to.not.throw()
        });

        it('cannot generate a Weight manager with a weight management outside ' + `(`+ WeightManagement.AllPositiveWeights + WeightManagement.AllStrictlyPositiveWeights + WeightManagement.SomeNullWeights + `)`, () => {
            const weightManagement = ('Invalid weight management' as unknown) as WeightManagement;
            expect(() => new WeightManager(weightManagement)).to.throw(EM_WEIGHT_MANAGEMENT_UNKOWN)
        });

    });

    describe('Methods', () => {

        describe('createWeightFromValueOnly', () => {
            const value = 10;
            it('can set a weight with management category ' + WeightManagement.AllPositiveWeights, () => {
                const weightManagement = WeightManagement.AllPositiveWeights;
                const weightManager = new WeightManager(weightManagement);
                const newWeight = weightManager.createWeightFromValueOnly(value);
                expect(newWeight.strictlyPositive).to.eql(false);
                const newWeight1 = weightManager.createWeightFromValueOnly(0);
                expect(newWeight1.strictlyPositive).to.eql(false);
            });

            it('cannot set a weight with a negative value with management category ' + WeightManagement.AllPositiveWeights, () => {
                const weightManagement = WeightManagement.AllPositiveWeights;
                const weightManager = new WeightManager(weightManagement);
                expect(() => weightManager.createWeightFromValueOnly(-1)).to.throw(EM_WEIGHT_VALUE_POSITIVE);
            });

            it('can set a weight with management category ' + WeightManagement.AllStrictlyPositiveWeights, () => {
                const weightManagement1 = WeightManagement.AllStrictlyPositiveWeights;
                const weightManager1 = new WeightManager(weightManagement1);
                const newWeight2 = weightManager1.createWeightFromValueOnly(value);
                expect(newWeight2.strictlyPositive).to.eql(true)
            });

            it('cannot set a weight with a null or negative value with management category ' + WeightManagement.AllStrictlyPositiveWeights, () => {
                const weightManagement1 = WeightManagement.AllStrictlyPositiveWeights;
                const weightManager1 = new WeightManager(weightManagement1);
                expect(() => weightManager1.createWeightFromValueOnly(0)).to.throw(EM_WEIGHT_VALUE_STRICTLY_POSITIVE);
                expect(() => weightManager1.createWeightFromValueOnly(-1)).to.throw(EM_WEIGHT_VALUE_STRICTLY_POSITIVE)
            });

            it('can set a weight with management category ' + WeightManagement.SomeNullWeights, () => {
                const weightManagement2 = WeightManagement.SomeNullWeights;
                const weightManager2 = new WeightManager(weightManagement2);
                const newWeight3 = weightManager2.createWeightFromValueOnly(value);
                expect(newWeight3.strictlyPositive).to.eql(true)
                const newWeight5 = weightManager2.createWeightFromValueOnly(0);
                expect(newWeight5.strictlyPositive).to.eql(false);
            });

            it('cannot set a weight with a negative value with management category ' + WeightManagement.SomeNullWeights, () => {
                const weightManagement2 = WeightManagement.SomeNullWeights;
                const weightManager2 = new WeightManager(weightManagement2);
                expect(() => weightManager2.createWeightFromValueOnly(-1)).to.throw(EM_WEIGHT_VALUE_POSITIVE)
            });
        });

        it('cannot add weights with management category ' + WeightManagement.AllStrictlyPositiveWeights + `if any of the weights has a stricltyPositive status set to false`, () => {
            let weight = new Weight();
            const value = 10;
            let weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.addWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            expect(() => weightManager.addWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            weight1 = new Weight(value, true);
            expect(() => weightManager.addWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
        });

        it('can add weights with management category ' + WeightManagement.AllStrictlyPositiveWeights + `and values greater than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weight = new Weight();
            expect(weight.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const value = 10;
            const weight1 = new Weight(value);
            expect(weight1.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight2 = weightManager.addWeights(weight, weight1);
            expect(newWeight2.value).to.eql(value + DEFAULT_WEIGHT_VALUE);
            expect(newWeight2.strictlyPositive).to.eql(weight.strictlyPositive && weight1.strictlyPositive);
        });

        it('can add weights with management category ' + WeightManagement.AllStrictlyPositiveWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            expect(weight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const value = NULL_WEIGHT_TOLERANCE / 3;
            const weight1 = new Weight(value);
            expect(weight1.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight2 = weightManager.addWeights(weight, weight1);
            expect(newWeight2.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight2.value).to.eql(value + NULL_WEIGHT_TOLERANCE / 2);
            expect(newWeight2.strictlyPositive).to.eql(weight.strictlyPositive && weight1.strictlyPositive);
        });

        it('send a warning when adding weights with management category ' + WeightManagement.AllStrictlyPositiveWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            expect(weight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const value = NULL_WEIGHT_TOLERANCE / 3;
            const weight1 = new Weight(value);
            expect(weight1.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            // test the warning message issued by the method
            const originalConsoleLog = console.log;
            let capturedMessage = '';
            console.log = (message: string) => {
                capturedMessage = message;
            };
            weightManager.addWeights(weight, weight1);
            expect(capturedMessage.includes(WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE)).to.eql(true);
            console.log = originalConsoleLog;
        });

        it('cannot add weights with management category ' + WeightManagement.AllPositiveWeights + `if any of the weights has strictlyPositive status set to true`, () => {
            let weight = new Weight();
            const value = 10;
            let weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.addWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            weight1 = new Weight(value, true);
            expect(() => weightManager.addWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            weight = new Weight(value, false);
            expect(() => weightManager.addWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
        });

        it('can add weights with management category ' + WeightManagement.AllPositiveWeights + ` and values greater than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            expect(weight.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const value = 10;
            const weight1 = new Weight(value, false);
            expect(weight1.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight2 = weightManager.addWeights(weight, weight1);
            expect(newWeight2.strictlyPositive).to.eql(weight.strictlyPositive && weight1.strictlyPositive)
            expect(newWeight2.value).to.eql(value + DEFAULT_WEIGHT_VALUE)
        });

        it('can add weights with management category ' + WeightManagement.AllPositiveWeights + ` and values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            expect(weight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const value = NULL_WEIGHT_TOLERANCE / 3;
            const weight1 = new Weight(value, false);
            expect(weight1.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight2 = weightManager.addWeights(weight, weight1);
            expect(newWeight2.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight2.value).to.eql(value + NULL_WEIGHT_TOLERANCE / 2);
            expect(newWeight2.strictlyPositive).to.eql(weight.strictlyPositive && weight1.strictlyPositive);
        });

        it('send a warning when adding weights with management category ' + WeightManagement.AllPositiveWeights + ` and values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            expect(weight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const value = NULL_WEIGHT_TOLERANCE / 3;
            const weight1 = new Weight(value, false);
            expect(weight1.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            // test the warning message issued by the method
            const originalConsoleLog = console.log;
            let capturedMessage = '';
            console.log = (message: string) => {
                capturedMessage = message;
            };
            weightManager.addWeights(weight, weight1);
            expect(capturedMessage.includes(WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE)).to.eql(true);
            console.log = originalConsoleLog;
        });

        it('can add weights with arbitrary strictlyPositive status and management category ' + WeightManagement.SomeNullWeights + `and values greater than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            // configuration promoting strictlyPositive status to true
            const value = 10;
            let weight = new Weight();
            expect(weight.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            let weight1 = new Weight(value, false);
            expect(weight1.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const newWeight2 = weightManager.addWeights(weight, weight1);
            expect(newWeight2.strictlyPositive).to.eql(true);
            expect(newWeight2.value).to.eql(value + DEFAULT_WEIGHT_VALUE);
            // configuration preserving strictlyPositive status to false
            weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const newWeight3 = weightManager.addWeights(weight, weight1);
            expect(newWeight3.strictlyPositive).to.eql(false)
            expect(newWeight3.value).to.eql(value + DEFAULT_WEIGHT_VALUE)
            // configuration promoting strictlyPositive status to true
            weight1 = new Weight(value);
            const newWeight4 = weightManager.addWeights(weight, weight1);
            expect(newWeight4.strictlyPositive).to.eql(true)
            expect(newWeight4.value).to.eql(value + DEFAULT_WEIGHT_VALUE)
            // configuration preserving strictlyPositive status to true
            weight = new Weight();
            const newWeight5 = weightManager.addWeights(weight, weight1);
            expect(newWeight5.strictlyPositive).to.eql(true)
            expect(newWeight5.value).to.eql(value + DEFAULT_WEIGHT_VALUE)
        });

        it('can add weights with management category ' + WeightManagement.SomeNullWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE} and propagate a strictlyPositive status true when weights have the same status`, () => {
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            // configuration propagating strictlyPositive status to true
            let weight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            expect(weight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const value = NULL_WEIGHT_TOLERANCE / 3;
            let weight1 = new Weight(value);
            expect(weight1.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const newWeight2 = weightManager.addWeights(weight, weight1);
            expect(newWeight2.strictlyPositive).to.eql(true);
        });

        it('can add weights with management category ' + WeightManagement.SomeNullWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE} and propagate a strictlyPositive status false when weights have the same status or different statuses`, () => {
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            // configuration propagating strictlyPositive status to false
            let weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            expect(weight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const value = NULL_WEIGHT_TOLERANCE / 3;
            let weight1 = new Weight(value, false);
            expect(weight1.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const newWeight2 = weightManager.addWeights(weight, weight1);
            expect(newWeight2.strictlyPositive).to.eql(false);
            // configuration promoting strictlyPositive status to false
            weight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            const newWeight3 = weightManager.addWeights(weight, weight1);
            expect(newWeight3.strictlyPositive).to.eql(false);
            // configuration promoting strictlyPositive status to false
            weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            weight1 = new Weight(value);
            const newWeight4 = weightManager.addWeights(weight, weight1);
            expect(newWeight4.strictlyPositive).to.eql(false);
        });

        it('cannot subtract weights with management category ' + WeightManagement.AllStrictlyPositiveWeights + `if any of the weights has a stricltyPositive status set to false`, () => {
            let weight = new Weight();
            const value = 10;
            let weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            weight1 = new Weight(value, true);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
        });

        it('cannot subtract weights with management category ' + WeightManagement.AllPositiveWeights + `if any of the weights has strictlyPositive status set to true`, () => {
            let weight = new Weight();
            const value = 10;
            let weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            weight1 = new Weight(value, true);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            weight = new Weight(value, false);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
        });

        it(`cannot subtract weights if the subtraction produces a negative weight with absolute value greater than ${NULL_WEIGHT_TOLERANCE}`, () => {
            let weight = new Weight();
            const value = 10;
            let weight1 = new Weight(value);
            // configuration with weight management AllStrictlyPositiveWeights
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(Math.abs(weight.value - weight1.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR)
            // configuration with weight management AllPositiveWeights
            const weightManagement2 = WeightManagement.AllPositiveWeights;
            const weightManager2 = new WeightManager(weightManagement2);
            weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            weight1 = new Weight(value, false);
            expect(Math.abs(weight.value - weight1.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager2.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR)
            // configuration with weight management SomeNullWeights
            const weightManagement3 = WeightManagement.SomeNullWeights;
            const weightManager3 = new WeightManager(weightManagement3);
            weight = new Weight();
            expect(Math.abs(weight.value - weight1.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager3.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR)
        });

        it(`cannot subtract weights if the subtraction produces a null or negative weight with ` + WeightManagement.AllStrictlyPositiveWeights + ' management' , () => {
            let weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE + NULL_WEIGHT_TOLERANCE / 2;
            let weight1 = new Weight(value, true);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weight.value - weight1.value).to.be.lessThan(0);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)
            weight1 = new Weight();
            expect(weight.value - weight1.value).to.eql(0);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)
        });

        it('send a warning when subtracting weights with management category ' + WeightManagement.AllStrictlyPositiveWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE - NULL_WEIGHT_TOLERANCE / 3;
            const weight1 = new Weight(value);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            // test the warning message issued by the method
            const originalConsoleLog = console.log;
            let capturedMessage = '';
            console.log = (message: string) => {
                capturedMessage = message;
            };
            const result  = weightManager.subtractWeights(weight, weight1);
            expect(result.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(capturedMessage.includes(WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE)).to.eql(true);
            console.log = originalConsoleLog;
        });

        it(`can subtract weights as long as the subtraction produces a positive weight under ` + WeightManagement.AllStrictlyPositiveWeights + ' management' , () => {
            const value = 10;
            const weight = new Weight(value);
            const weight1 = new Weight();
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(true)
            expect(newWeight.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.value).to.be.closeTo(value - DEFAULT_WEIGHT_VALUE, TOLERANCE_FLOAT)
        });

        it(`can subtract weights as long as the subtraction produces a positive weight, even under the null weight threshold ${NULL_WEIGHT_TOLERANCE} using ` + WeightManagement.AllStrictlyPositiveWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE - NULL_WEIGHT_TOLERANCE / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF;
            const weight1 = new Weight(value, true);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(true)
            expect(newWeight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.value).to.be.closeTo(COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * NULL_WEIGHT_TOLERANCE, TOLERANCE_FLOAT)
        });
        
        it('can subtract weights as long as the subtraction produces a positive weight even smaller than the null weight threshold under ' + WeightManagement.AllPositiveWeights + ' management' , () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const value = DEFAULT_WEIGHT_VALUE - (NULL_WEIGHT_TOLERANCE / 2);
            const weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(false)
            expect(newWeight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 2, TOLERANCE_FLOAT)
        });

        it(`can subtract weights as long as the subtraction produces a positive weight under ` + WeightManagement.AllPositiveWeights + ' management' , () => {
            const value = 10;
            const weight = new Weight(value, false);
            const weight1 = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(false);
            expect(newWeight.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.value).to.be.closeTo(value - DEFAULT_WEIGHT_VALUE, TOLERANCE_FLOAT)
        });

        it('can subtract weights and obtain a null weight if the weight difference is negative and smaller than the NULL_WEIGHT_TOLERANCE under ' + WeightManagement.AllPositiveWeights + ' management' , () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const value = DEFAULT_WEIGHT_VALUE + (NULL_WEIGHT_TOLERANCE / 2);
            const weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weight.value - weight1.value).to.be.lessThan(0);
            expect(Math.abs(weight.value - weight1.value)).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(false)
            expect(newWeight.value).to.be.eql(0)
        });

        it(`can subtract weights and obtain a small weight if the weight difference is positive and smaller than the ${NULL_WEIGHT_TOLERANCE} tolerance under ` + WeightManagement.AllPositiveWeights + ' management' , () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const value = DEFAULT_WEIGHT_VALUE - (NULL_WEIGHT_TOLERANCE / 2);
            const weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(false)
            expect(newWeight.value).to.be.greaterThan(0);
            expect(newWeight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 2, TOLERANCE_FLOAT)
        });

        it(`cannot subtract weights if the subtraction produces a negative weight smaller than -${NULL_WEIGHT_TOLERANCE}, with ` + WeightManagement.AllPositiveWeights + ' management' , () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const value = DEFAULT_WEIGHT_VALUE + NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF;
            const weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weight.value - weight1.value).to.be.lessThan(0);
            expect(Math.abs(weight.value - weight1.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR)
        });

        it('sends a warning when subtracting weights with management category ' + WeightManagement.AllPositiveWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const value = DEFAULT_WEIGHT_VALUE - NULL_WEIGHT_TOLERANCE / 3;
            const weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            // test the warning message issued by the method
            const originalConsoleLog = console.log;
            let capturedMessage = '';
            console.log = (message: string) => {
                capturedMessage = message;
            };
            const result  = weightManager.subtractWeights(weight, weight1);
            expect(result.value).to.be.greaterThan(0);
            expect(result.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(capturedMessage.includes(WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE)).to.eql(true);
            console.log = originalConsoleLog;
        });

        it(`can subtract weights if the subtraction produces a strictly positive weight smaller than ${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE - NULL_WEIGHT_TOLERANCE / 2;
            const weight1 = new Weight(value, true);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(false)
            expect(newWeight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.value).to.be.greaterThan(0);
            expect(newWeight.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 2, TOLERANCE_FLOAT)
        });

        it('can subtract weights if the subtraction produces a positive weight under ' + WeightManagement.SomeNullWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE - (NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF);
            const weight1 = new Weight(value, true);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.strictlyPositive).to.eql(true)
            expect(newWeight.value).to.be.closeTo(COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * NULL_WEIGHT_TOLERANCE, TOLERANCE_FLOAT)
        });

        it(`can subtract weights if the subtraction produces a negative weight smaller than ${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE + NULL_WEIGHT_TOLERANCE / 2;
            const weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weight.value - weight1.value).to.be.lessThan(0);
            expect(Math.abs(weight.value - weight1.value)).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(false)
            expect(newWeight.value).to.eql(0);
        });

        it(`assigns a false strictlyPositive status, whatever the status of the input weights, if the subtraction produces a negative weight greater than -${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE + NULL_WEIGHT_TOLERANCE / 2;
            const weight1 = new Weight(value);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weight.value - weight1.value).to.be.lessThan(0);
            expect(Math.abs(weight.value - weight1.value)).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(false)
            expect(newWeight.value).to.eql(0);
        });

        it(`assigns a false strictlyPositive status, whatever the status of the input weights, if the subtraction produces a positive weight smaller than ${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE - NULL_WEIGHT_TOLERANCE / 2;
            const weight1 = new Weight(value);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weight.value - weight1.value).to.be.greaterThan(0);
            expect(Math.abs(weight.value - weight1.value)).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(false)
            expect(newWeight.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 2, TOLERANCE_FLOAT);
        });

        it(`assigns a true strictlyPositive status, whatever the status of the input weights, if the subtraction produces a positive weight greater than ${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE / 2;
            const weight1 = new Weight(value);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weight.value - weight1.value).to.be.greaterThan(0);
            expect(Math.abs(weight.value - weight1.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(true)
            expect(newWeight.value).to.be.closeTo(DEFAULT_WEIGHT_VALUE / 2, TOLERANCE_FLOAT);
        });

        it(`cannot subtract weights if the subtraction produces a negative weight smaller than -${NULL_WEIGHT_TOLERANCE}, with ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const value = DEFAULT_WEIGHT_VALUE + NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF;
            const weight1 = new Weight(value);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weight.value - weight1.value).to.be.lessThan(0);
            expect(Math.abs(weight.value - weight1.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR)
        });

        it('can subtract weights with management category ' + WeightManagement.SomeNullWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE} and propagate a strictlyPositive status false when weights have the same status or different statuses`, () => {
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            // configuration propagating strictlyPositive status to false
            let weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            expect(weight.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const value = NULL_WEIGHT_TOLERANCE / 3;
            let weight1 = new Weight(value, false);
            expect(weight1.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const newWeight2 = weightManager.subtractWeights(weight, weight1);
            expect(newWeight2.strictlyPositive).to.eql(false);
            // configuration promoting strictlyPositive status to false
            weight = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            const newWeight3 = weightManager.subtractWeights(weight, weight1);
            expect(newWeight3.strictlyPositive).to.eql(false);
            // configuration promoting strictlyPositive status to false
            weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            weight1 = new Weight(value);
            const newWeight4 = weightManager.subtractWeights(weight, weight1);
            expect(newWeight4.strictlyPositive).to.eql(false);
        });

        it(`cannot scale weight if the scale factor is strictly negative under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weight = new Weight();
            let scale = -1;
            expect(scale).to.be.lessThan(0);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.scaleWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)
        });

        it(`cannot scale weight if the scale factor is null under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weight = new Weight();
            let scale = 0;
            expect(scale).to.eql(0);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.scaleWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_NULL)
        });

        it(`can scale weight if the scale factor is strictly positive under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weight = new Weight();
            let scale = 2;
            expect(scale).to.be.greaterThan(0);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.scaleWeight(weight, scale);
            expect(newWeight.value).to.eql(scale * DEFAULT_WEIGHT_VALUE)
            expect(newWeight.strictlyPositive).to.eql(true)
        });

        it(`scale a weight and preserve its strictlyPositive status under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE / 3);
            let scale = 2;
            expect(weight.strictlyPositive).to.eql(true)
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleWeight(weight, scale);
            expect(newWeight.strictlyPositive).to.eql(weight.strictlyPositive)
        });

        it(`cannot scale weight if the scale factor is strictly negative under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            let scale = -1;
            expect(scale).to.be.lessThan(0);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.scaleWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)
        });

        it(`can scale a weight with a strictly positive factor under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            let scale = 2;
            expect(scale).to.be.greaterThan(0);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleWeight(weight, scale);
            expect(newWeight.value).to.be.closeTo(weight.value * scale, TOLERANCE_FLOAT)
        });

        it(`can scale a weight with a strictly positive factor and preserve its strictlyPositive status under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            let scale = 2;
            expect(scale).to.be.greaterThan(0);
            expect(weight.strictlyPositive).to.eql(false)
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleWeight(weight, scale);
            expect(newWeight.strictlyPositive).to.eql(false)
        });

        it(`can scale a weight with a null factor under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            let scale = 0;
            expect(weight.strictlyPositive).to.eql(false)
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleWeight(weight, scale);
            expect(newWeight.value).to.eql(0)
        });

        it(`can scale a weight with a null factor and preserve its strictlyPositive status under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            let scale = 0;
            expect(weight.strictlyPositive).to.eql(false)
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleWeight(weight, scale);
            expect(newWeight.strictlyPositive).to.eql(false)
        });

        it(`cannot scale weight if the scale factor is strictly negative under ${WeightManagement.SomeNullWeights} management`, () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            let scale = -1;
            expect(scale).to.be.lessThan(0);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.scaleWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)
        });

        it(`can scale a weight with a strictly positive value and preserve its strictlyPositive status under ${WeightManagement.SomeNullWeights} management`, () => {
            let weight = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            let scale = 2;
            expect(scale).to.be.greaterThan(0);
            expect(weight.strictlyPositive).to.eql(false)
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleWeight(weight, scale);
            expect(newWeight.value).to.be.closeTo(weight.value * scale, TOLERANCE_FLOAT);
            expect(newWeight.strictlyPositive).to.eql(weight.strictlyPositive)
            weight = new Weight(DEFAULT_WEIGHT_VALUE / 3);
            expect(weight.strictlyPositive).to.eql(true);
            newWeight = weightManager.scaleWeight(weight, scale);
            expect(newWeight.value).to.be.closeTo(weight.value * scale, TOLERANCE_FLOAT);
            expect(newWeight.strictlyPositive).to.eql(weight.strictlyPositive)
        });

        it(`can scale weight if the scale factor is null under ${WeightManagement.SomeNullWeights} management`, () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            let scale = 0;
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleWeight(weight, scale);
            expect(newWeight.value).to.eql(0)
        });

        it(`can scale weight if the scale factor is null and assign a false strictlyPositive status under ${WeightManagement.SomeNullWeights} management`, () => {
            const value = NULL_WEIGHT_TOLERANCE / 3;
            let weight = new Weight(value, false);
            let scale = 0;
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.scaleWeight(weight, scale);
            expect(newWeight.value).to.eql(0)
            expect(newWeight.strictlyPositive).to.eql(weight.strictlyPositive)
            weight = new Weight(value);
            expect(weight.strictlyPositive).to.eql(true);
            const newWeight1 = weightManager.scaleWeight(weight, scale);
            expect(newWeight1.value).to.eql(0)
            expect(newWeight1.strictlyPositive).to.eql(false)
        });

        it('cannot add complex weights with management category ' + WeightManagement.AllStrictlyPositiveWeights + `if any of the weights involved has a stricltyPositive status set to false`, () => {
            let weight = new Weight();
            const value = 10;
            let weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const complexW1 = new ComplexWeight(weight, weight);
            const complexW2 = new ComplexWeight(weight1, weight1);
            expect(() => weightManager.addComplexWeights(complexW1, complexW2)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            expect(() => weightManager.addWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
            weight1 = new Weight(value, true);
            expect(() => weightManager.addWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
        });

        it('can add complex weights with management category ' + WeightManagement.AllStrictlyPositiveWeights + `and values greater than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weightR = new Weight();
            expect(weightR.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const value = 10;
            const weightI = new Weight(value);
            expect(weightI.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const weight = new ComplexWeight(weightR, weightI);
            const weight1R = new Weight();
            const value1 = 5;
            expect(weight1R.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const weight1I = new Weight(value1);
            expect(weight1I.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight2 = weightManager.addComplexWeights(weight, weight1);
            expect(newWeight2.real).to.eql(weightManager.addWeights(weight.real, weight1.real));
            expect(newWeight2.imaginary).to.eql(weightManager.addWeights(weight.imaginary, weight1.imaginary));
        });

        it('can add complex weights with management category ' + WeightManagement.AllStrictlyPositiveWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weightR = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            expect(weightR.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const value = NULL_WEIGHT_TOLERANCE / 3;
            const weightI = new Weight(value);
            expect(weightI.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weight = new ComplexWeight(weightR, weightI);
            const weight1R = new Weight(NULL_WEIGHT_TOLERANCE / 4);
            expect(weight1R.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const value1 = NULL_WEIGHT_TOLERANCE / 5;
            const weight1I = new Weight(value1);
            expect(weight1I.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight2 = weightManager.addComplexWeights(weight, weight1);
            expect(newWeight2.real.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight2.imaginary.value).to.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight2.real.strictlyPositive).to.eql(weightR.strictlyPositive && weight1R.strictlyPositive);
        });

        it('send a warning when adding complex weights with management category ' + WeightManagement.AllStrictlyPositiveWeights + `and values of real or imaginary wieghts smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weightR = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            expect(weightR.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            const value = NULL_WEIGHT_TOLERANCE / 3;
            const weight1R = new Weight(value);
            expect(weight1R.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weight1I = new Weight();
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            // test the warning message issued by the method
            const originalConsoleLog = console.log;
            let capturedMessage = '';
            console.log = (message: string) => {
                capturedMessage = message;
            };
            weightManager.addComplexWeights(weight, weight1);
            expect(capturedMessage.includes(WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE)).to.eql(true);
            console.log = originalConsoleLog;
        });

        it('cannot add complex weights with management category ' + WeightManagement.AllPositiveWeights + `if any of the complex weights has strictlyPositive status set to true`, () => {
            let weightR = new Weight();
            let weightI = new Weight();
            const complexW1 = new ComplexWeight(weightR, weightI);
            const value = 10;
            let weight1R = new Weight(value, false);
            let weight1I = new Weight(value, false);
            const complexW2 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.addComplexWeights(complexW1, complexW2)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            weight1R = new Weight(value, true);
            weight1I = new Weight(value, true);
            expect(() => weightManager.addComplexWeights(complexW1, complexW2)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            weightR = new Weight(value, false);
            weightI = new Weight(value, false);
            expect(() => weightManager.addComplexWeights(complexW1, complexW2)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
        });

        it('can add complex weights with management category ' + WeightManagement.AllPositiveWeights + ` and weight values greater than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            expect(weightR.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            expect(weightI.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const weight = new ComplexWeight(weightR, weightI);
            const value = 10;
            const weight1R = new Weight(value, false);
            expect(weight1R.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const weight1I = new Weight(value, false);
            expect(weight1I.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight2 = weightManager.addComplexWeights(weight, weight1);
            expect(newWeight2.real.strictlyPositive).to.eql(weightR.strictlyPositive && weight1R.strictlyPositive)
            expect(newWeight2.real.value).to.eql(value + DEFAULT_WEIGHT_VALUE);
            expect(newWeight2.imaginary.value).to.eql(value + DEFAULT_WEIGHT_VALUE);
        });

        it('can add complex weights with management category ' + WeightManagement.AllPositiveWeights + `and weight values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weightR = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            expect(weightR.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weightI = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            expect(weightI.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weight = new ComplexWeight(weightR, weightI);
            const weight1R = new Weight(NULL_WEIGHT_TOLERANCE / 3, false);
            expect(weight1R.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weight1I = new Weight(NULL_WEIGHT_TOLERANCE / 3, false);
            expect(weight1I.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight2 = weightManager.addComplexWeights(weight, weight1);
            expect(newWeight2.real.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight2.real.value).to.eql(NULL_WEIGHT_TOLERANCE / 3 + NULL_WEIGHT_TOLERANCE / 2);
            expect(newWeight2.imaginary.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight2.imaginary.value).to.eql(NULL_WEIGHT_TOLERANCE / 3 + NULL_WEIGHT_TOLERANCE / 2);
            expect(newWeight2.real.strictlyPositive).to.eql(weightR.strictlyPositive && weight1R.strictlyPositive);
        });

        it('send a warning when adding complex weights with management category ' + WeightManagement.AllPositiveWeights + `and weight values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weightR = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            expect(weightR.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            const value = NULL_WEIGHT_TOLERANCE / 3;
            const weight1R = new Weight(value, false);
            expect(weight1R.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weight1I = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            // test the warning message issued by the method
            const originalConsoleLog = console.log;
            let capturedMessage = '';
            console.log = (message: string) => {
                capturedMessage = message;
            };
            weightManager.addComplexWeights(weight, weight1);
            expect(capturedMessage.includes(WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE)).to.eql(true);
            console.log = originalConsoleLog;
        });

        it('can add complex weights with arbitrary strictlyPositive status and management category ' + WeightManagement.SomeNullWeights + `and values greater than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            // configuration promoting strictlyPositive status to true
            const value = 10;
            let weightR = new Weight();
            expect(weightR.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            let weightI = new Weight();
            expect(weightI.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            let weight = new ComplexWeight(weightR, weightI);
            let weight1R = new Weight(value, false);
            expect(weight1R.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            let weight1I = new Weight(value, false);
            expect(weight1I.value).to.be.greaterThanOrEqual(NULL_WEIGHT_TOLERANCE);
            let weight1 = new ComplexWeight(weight1R, weight1I);
            const newWeight2 = weightManager.addComplexWeights(weight, weight1);
            expect(newWeight2.real.strictlyPositive).to.eql(true);
            expect(newWeight2.real.value).to.eql(value + DEFAULT_WEIGHT_VALUE);
            expect(newWeight2.imaginary.strictlyPositive).to.eql(true);
            expect(newWeight2.imaginary.value).to.eql(value + DEFAULT_WEIGHT_VALUE);
            // configuration preserving strictlyPositive status to false
            weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            weight = new ComplexWeight(weightR, weightI);
            const newWeight3 = weightManager.addComplexWeights(weight, weight1);
            expect(newWeight3.real.strictlyPositive).to.eql(false)
            expect(newWeight3.real.value).to.eql(value + DEFAULT_WEIGHT_VALUE)
            expect(newWeight3.imaginary.strictlyPositive).to.eql(false)
            expect(newWeight3.imaginary.value).to.eql(value + DEFAULT_WEIGHT_VALUE)
            // configuration promoting strictlyPositive status to true
            weight1R = new Weight(value);
            weight1I = new Weight(value);
            weight1 = new ComplexWeight(weight1R, weight1I);
            const newWeight4 = weightManager.addComplexWeights(weight, weight1);
            expect(newWeight4.real.strictlyPositive).to.eql(true)
            expect(newWeight4.real.value).to.eql(value + DEFAULT_WEIGHT_VALUE)
            expect(newWeight4.imaginary.strictlyPositive).to.eql(true)
            expect(newWeight4.imaginary.value).to.eql(value + DEFAULT_WEIGHT_VALUE)
            // configuration preserving strictlyPositive status to true
            weightR = new Weight();
            weightI = new Weight();
            weight = new ComplexWeight(weightR, weightI);
            const newWeight5 = weightManager.addComplexWeights(weight, weight1);
            expect(newWeight5.real.strictlyPositive).to.eql(true)
            expect(newWeight5.real.value).to.eql(value + DEFAULT_WEIGHT_VALUE)
            expect(newWeight5.imaginary.strictlyPositive).to.eql(true)
            expect(newWeight5.imaginary.value).to.eql(value + DEFAULT_WEIGHT_VALUE)
        });

        it('can add complex weights with management category ' + WeightManagement.SomeNullWeights + `and weight values smaller than ${NULL_WEIGHT_TOLERANCE} and propagate a strictlyPositive status true when weights have the same status`, () => {
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            // configuration propagating strictlyPositive status to true
            const weightR = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            expect(weightR.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weightI = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            expect(weightI.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weight = new ComplexWeight(weightR, weightI);
            const value = NULL_WEIGHT_TOLERANCE / 3;
            const weight1R = new Weight(value);
            expect(weight1R.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weight1I = new Weight(value);
            expect(weight1I.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const newWeight2 = weightManager.addComplexWeights(weight, weight1);
            expect(newWeight2.real.strictlyPositive).to.eql(true);
        });

        it('can add complex weights with management category ' + WeightManagement.SomeNullWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE} and propagate a strictlyPositive status false when weights have the same status or different statuses`, () => {
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            // configuration propagating strictlyPositive status to false
            let weightR = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            expect(weightR.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            let weightI = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            expect(weightI.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            let weight = new ComplexWeight(weightR, weightI);
            const value = NULL_WEIGHT_TOLERANCE / 3;
            let weight1R = new Weight(value, false);
            expect(weight1R.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            let weight1I = new Weight(value, false);
            expect(weight1I.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            let weight1 = new ComplexWeight(weight1R, weight1I);
            const newWeight2 = weightManager.addComplexWeights(weight, weight1);
            expect(newWeight2.real.strictlyPositive).to.eql(false);
            // configuration promoting strictlyPositive status to false
            weightR = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            weightI = new Weight(NULL_WEIGHT_TOLERANCE / 2);
            weight = new ComplexWeight(weightR, weightI);
            const newWeight3 = weightManager.addComplexWeights(weight, weight1);
            expect(newWeight3.real.strictlyPositive).to.eql(false);
            // configuration promoting strictlyPositive status to false
            weightR = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            weightI = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            weight = new ComplexWeight(weightR, weightI);
            weight1R = new Weight(value);
            weight1I = new Weight(value);
            weight1 = new ComplexWeight(weight1R, weight1I);
            const newWeight4 = weightManager.addComplexWeights(weight, weight1);
            expect(newWeight4.real.strictlyPositive).to.eql(false);
        });

        it('cannot subtract complex weights with management category ' + WeightManagement.AllPositiveWeights + `if any of the complex weights has strictlyPositive status set to true`, () => {
            let weightR = new Weight();
            let weightI = new Weight();
            let weight = new ComplexWeight(weightR, weightI);
            const value = 10;
            let weight1R = new Weight(value, false);
            let weight1I = new Weight(value, false);
            let weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.subtractComplexWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            weight1R = new Weight(value, true);
            weight1I = new Weight(value, true);
            weight1 = new ComplexWeight(weight1R, weight1I);
            expect(() => weightManager.subtractComplexWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
            weightR = new Weight(value, false);
            weightI = new Weight(value, false);
            weight = new ComplexWeight(weightR, weightI);
            expect(() => weightManager.subtractComplexWeights(weight, weight1)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
        });

        it(`cannot subtract complex weights if the subtraction produces a negative weight (real or imaginary) with absolute value greater than ${NULL_WEIGHT_TOLERANCE}`, () => {
            let weightR = new Weight();
            let weightI = new Weight();
            let weight = new ComplexWeight(weightR, weightI);
            const value = 10;
            let weight1R = new Weight(value);
            let weight1I = new Weight(value);
            let weight1 = new ComplexWeight(weight1R, weight1I);
            // configuration with weight management AllStrictlyPositiveWeights
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(Math.abs(weightR.value - weight1R.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager.subtractComplexWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR);
            expect(Math.abs(weightI.value - weight1I.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager.subtractComplexWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR);
            // configuration with weight management AllPositiveWeights
            const weightManagement2 = WeightManagement.AllPositiveWeights;
            const weightManager2 = new WeightManager(weightManagement2);
            weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            weight = new ComplexWeight(weightR, weightI);
            weight1R = new Weight(value, false);
            weight1I = new Weight(value, false);
            weight1 = new ComplexWeight(weight1R, weight1I);
            expect(Math.abs(weightR.value - weight1R.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager2.subtractComplexWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR);
            expect(Math.abs(weightI.value - weight1I.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager2.subtractComplexWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR);
            // configuration with weight management SomeNullWeights
            const weightManagement3 = WeightManagement.SomeNullWeights;
            const weightManager3 = new WeightManager(weightManagement3);
            weightR = new Weight();
            weightI = new Weight();
            weight = new ComplexWeight(weightR, weightI);
            expect(Math.abs(weightR.value - weight1R.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager3.subtractComplexWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR);
            expect(Math.abs(weightI.value - weight1I.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager3.subtractComplexWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR);
        });

        it(`cannot subtract complex weights if the subtraction produces null or negative (real or imaginary) weights with ` + WeightManagement.AllStrictlyPositiveWeights + ' management' , () => {
            let weightR = new Weight();
            let weightI = new Weight();
            let weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE + NULL_WEIGHT_TOLERANCE / 2;
            let weight1R = new Weight(value, true);
            let weight1I = new Weight(DEFAULT_WEIGHT_VALUE / 2, true);
            let weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightR.value - weight1R.value).to.be.lessThan(0);
            expect(() => weightManager.subtractComplexWeights(weight, weight1)).to.throw(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)
            weight1R = new Weight(DEFAULT_WEIGHT_VALUE / 2);
            weight1I = new Weight(value, true);
            weight1 = new ComplexWeight(weight1R, weight1I);
            expect(weightI.value - weight1I.value).to.lessThan(0);
            expect(() => weightManager.subtractComplexWeights(weight, weight1)).to.throw(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)
            weight1R = new Weight();
            weight1I = new Weight(DEFAULT_WEIGHT_VALUE / 2, true);
            weight1 = new ComplexWeight(weight1R, weight1I);
            expect(weightR.value - weight1R.value).to.eql(0);
            expect(() => weightManager.subtractComplexWeights(weight, weight1)).to.throw(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)
            weight1R = new Weight(DEFAULT_WEIGHT_VALUE / 2);
            weight1I = new Weight();
            weight1 = new ComplexWeight(weight1R, weight1I);
            expect(weightI.value - weight1I.value).to.eql(0);
            expect(() => weightManager.subtractComplexWeights(weight, weight1)).to.throw(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)
        });

        it('send a warning when subtracting complex weights with management category ' + WeightManagement.AllStrictlyPositiveWeights + `and weight values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE - NULL_WEIGHT_TOLERANCE / 3;
            const weight1R = new Weight(value);
            const weight1I = new Weight(value);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            // test the warning message issued by the method
            const originalConsoleLog = console.log;
            let capturedMessage = '';
            console.log = (message: string) => {
                capturedMessage = message;
            };
            const result  = weightManager.subtractComplexWeights(weight, weight1);
            expect(result.real.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(result.imaginary.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(capturedMessage.includes(WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE)).to.eql(true);
            console.log = originalConsoleLog;
        });

        it(`can subtract complex weights as long as the subtraction produces a positive complex weight under ` + WeightManagement.AllStrictlyPositiveWeights + ' management' , () => {
            const value = 10;
            const weightR = new Weight(value);
            const weightI = new Weight(value - 1);
            const weight = new ComplexWeight(weightR, weightI);
            const weight1R = new Weight();
            const weight1I = new Weight();
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.strictlyPositive).to.eql(true)
            expect(newWeight.real.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.imaginary.strictlyPositive).to.eql(true)
            expect(newWeight.imaginary.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.real.value).to.be.closeTo(value - DEFAULT_WEIGHT_VALUE, TOLERANCE_FLOAT);
            expect(newWeight.imaginary.value).to.be.closeTo(value - 1 - DEFAULT_WEIGHT_VALUE, TOLERANCE_FLOAT);
        });

        it(`can subtract complex weights as long as the subtraction produces a positive complex  weight, even under the null weight threshold ${NULL_WEIGHT_TOLERANCE} using ` + WeightManagement.AllStrictlyPositiveWeights + ' management' , () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE - NULL_WEIGHT_TOLERANCE / COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF;
            const weight1R = new Weight(value, true);
            const weight1I = new Weight(value, true);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.strictlyPositive).to.eql(true)
            expect(newWeight.real.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.real.value).to.be.closeTo(COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * NULL_WEIGHT_TOLERANCE, TOLERANCE_FLOAT);
            expect(newWeight.imaginary.strictlyPositive).to.eql(true)
            expect(newWeight.imaginary.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.imaginary.value).to.be.closeTo(COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * NULL_WEIGHT_TOLERANCE, TOLERANCE_FLOAT);
        });

        it('can subtract complex weights as long as the subtraction produces a positive complex weight even smaller than the null weight threshold under ' + WeightManagement.AllPositiveWeights + ' management' , () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE - (NULL_WEIGHT_TOLERANCE / 2);
            const weight1R = new Weight(value, false);
            const weight1I = new Weight(value, false);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.real.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.real.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 2, TOLERANCE_FLOAT)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.imaginary.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 2, TOLERANCE_FLOAT)
        });

        it(`can subtract complex weights as long as the subtraction produces a positive complex weight under ` + WeightManagement.AllPositiveWeights + ' management' , () => {
            const value = 10;
            const weightR = new Weight(value, false);
            const weightI = new Weight(value - 1, false);
            const weight = new ComplexWeight(weightR, weightI);
            const weight1R = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight1I = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.strictlyPositive).to.eql(false);
            expect(newWeight.real.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.real.value).to.be.closeTo(value - DEFAULT_WEIGHT_VALUE, TOLERANCE_FLOAT);
            expect(newWeight.imaginary.strictlyPositive).to.eql(false);
            expect(newWeight.imaginary.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.imaginary.value).to.be.closeTo(value - 1 - DEFAULT_WEIGHT_VALUE, TOLERANCE_FLOAT);
        });

        it('can subtract complex weights and obtain a null complex weight if the complex weight difference is negative and smaller than the NULL_WEIGHT_TOLERANCE under ' + WeightManagement.AllPositiveWeights + ' management' , () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE + (NULL_WEIGHT_TOLERANCE / 2);
            const weight1R = new Weight(value, false);
            const weight1I = new Weight(value, false);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightR.value - weight1R.value).to.be.lessThan(0);
            expect(Math.abs(weightR.value - weight1R.value)).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(weightI.value - weight1I.value).to.be.lessThan(0);
            expect(Math.abs(weightI.value - weight1I.value)).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.real.value).to.be.eql(0)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.value).to.be.eql(0)
        });

        it(`can subtract complex weights and obtain a small complex weight if the complex weight difference is positive and smaller than the ${NULL_WEIGHT_TOLERANCE} tolerance under ` + WeightManagement.AllPositiveWeights + ' management' , () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE - (NULL_WEIGHT_TOLERANCE / 2);
            const weight1R = new Weight(value, false);
            const weight1I = new Weight(value, false);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.real.value).to.be.greaterThan(0);
            expect(newWeight.real.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.real.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 2, TOLERANCE_FLOAT);
            expect(newWeight.imaginary.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.value).to.be.greaterThan(0);
            expect(newWeight.imaginary.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.imaginary.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 2, TOLERANCE_FLOAT);
        });

        it(`cannot subtract complex weights if the subtraction produces a negative complex weight smaller than -${NULL_WEIGHT_TOLERANCE}, with ` + WeightManagement.AllPositiveWeights + ' management' , () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE + NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF;
            const weight1R = new Weight(value, false);
            const weight1I = new Weight(value, false);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightR.value - weight1R.value).to.be.lessThan(0);
            expect(Math.abs(weightR.value - weight1R.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(weightI.value - weight1I.value).to.be.lessThan(0);
            expect(Math.abs(weightI.value - weight1I.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager.subtractComplexWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR)
        });

        it('sends a warning when subtracting complex weights with management category ' + WeightManagement.AllPositiveWeights + `and weighht values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE - NULL_WEIGHT_TOLERANCE / 3;
            const weight1R = new Weight(value, false);
            const weight1I = new Weight(value, false);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            // test the warning message issued by the method
            const originalConsoleLog = console.log;
            let capturedMessage = '';
            console.log = (message: string) => {
                capturedMessage = message;
            };
            const result  = weightManager.subtractComplexWeights(weight, weight1);
            expect(result.real.value).to.be.greaterThan(0);
            expect(result.real.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(result.imaginary.value).to.be.greaterThan(0);
            expect(result.imaginary.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(capturedMessage.includes(WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE)).to.eql(true);
            console.log = originalConsoleLog;
        });

        it(`can subtract complex weights if the subtraction produces a strictly positive complex weight smaller than ${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE - NULL_WEIGHT_TOLERANCE / 2;
            const weight1R = new Weight(value, true);
            const weight1I = new Weight(value, true);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.real.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.real.value).to.be.greaterThan(0);
            expect(newWeight.real.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 2, TOLERANCE_FLOAT)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.value).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.imaginary.value).to.be.greaterThan(0);
            expect(newWeight.imaginary.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 2, TOLERANCE_FLOAT)
        });

        it('can subtract complex weights if the subtraction produces a positive complex weight under ' + WeightManagement.SomeNullWeights + ' management' , () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE - (NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF);
            const weight1R = new Weight(value, true);
            const weight1I = new Weight(value, true);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.real.strictlyPositive).to.eql(true)
            expect(newWeight.real.value).to.be.closeTo(COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * NULL_WEIGHT_TOLERANCE, TOLERANCE_FLOAT);
            expect(newWeight.imaginary.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(newWeight.imaginary.strictlyPositive).to.eql(true)
            expect(newWeight.imaginary.value).to.be.closeTo(COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * NULL_WEIGHT_TOLERANCE, TOLERANCE_FLOAT);
        });

        it(`can subtract complex weights if the subtraction produces a negative complex weight smaller than ${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE + NULL_WEIGHT_TOLERANCE / 2;
            const weight1R = new Weight(value, false);
            const weight1I = new Weight(value, false);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightR.value - weight1R.value).to.be.lessThan(0);
            expect(Math.abs(weightR.value - weight1R.value)).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(weightI.value - weight1I.value).to.be.lessThan(0);
            expect(Math.abs(weightI.value - weight1I.value)).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.real.value).to.eql(0);
            expect(newWeight.imaginary.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.value).to.eql(0);
        });

        it(`assigns a false strictlyPositive status, whatever the status of the input complex weights, if the subtraction produces a negative complex weight greater than -${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE + NULL_WEIGHT_TOLERANCE / 2;
            const weight1R = new Weight(value);
            const weight1I = new Weight(DEFAULT_WEIGHT_VALUE / 2);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightR.value - weight1R.value).to.be.lessThan(0);
            expect(Math.abs(weightR.value - weight1R.value)).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            expect(weightI.value - weight1I.value).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false);
            expect(newWeight.real.value).to.eql(0);
        });

        it(`assigns a false strictlyPositive status, whatever the status of the input complex weights, if the subtraction produces a positive complex weight smaller than ${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE - NULL_WEIGHT_TOLERANCE / 2;
            const weight1R = new Weight(DEFAULT_WEIGHT_VALUE / 2);
            const weight1I = new Weight(value);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightI.value - weight1I.value).to.be.greaterThan(0);
            expect(Math.abs(weightI.value - weight1I.value)).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false);
            expect(newWeight.imaginary.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 2, TOLERANCE_FLOAT);
        });

        it(`assigns a false strictlyPositive status, whatever with input complex weights of status false, if the subtraction produces a positive complex weight smaller than ${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE - NULL_WEIGHT_TOLERANCE / 2;
            const weight1R = new Weight(DEFAULT_WEIGHT_VALUE / 2, false);
            const weight1I = new Weight(value, false);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightI.value - weight1I.value).to.be.greaterThan(0);
            expect(Math.abs(weightI.value - weight1I.value)).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false);
            expect(newWeight.imaginary.value).to.be.closeTo(NULL_WEIGHT_TOLERANCE / 2, TOLERANCE_FLOAT);
        });

        it(`assigns a true strictlyPositive status, whatever the status of the input complex weights, if the subtraction produces a positive complex weight greater than ${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE / 2;
            const weight1R = new Weight(value);
            const weight1I = new Weight(value);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightR.value - weight1R.value).to.be.greaterThan(0);
            expect(Math.abs(weightR.value - weight1R.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            const newWeight = weightManager.subtractComplexWeights(weight, weight1);
            expect(newWeight.real.strictlyPositive).to.eql(true)
            expect(newWeight.imaginary.strictlyPositive).to.eql(true);
            expect(newWeight.real.value).to.be.closeTo(DEFAULT_WEIGHT_VALUE / 2, TOLERANCE_FLOAT);
        });

        it(`cannot subtract complex weights if the subtraction produces a negative complex weight smaller than -${NULL_WEIGHT_TOLERANCE}, with ` + WeightManagement.SomeNullWeights + ' management' , () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            const value = DEFAULT_WEIGHT_VALUE + NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF;
            const weight1R = new Weight(value);
            const weight1I = new Weight(value);
            const weight1 = new ComplexWeight(weight1R, weight1I);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightR.value - weight1R.value).to.be.lessThan(0);
            expect(Math.abs(weightR.value - weight1R.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(weightI.value - weight1I.value).to.be.lessThan(0);
            expect(Math.abs(weightI.value - weight1I.value)).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(() => weightManager.subtractComplexWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR)
        });

        it(`cannot scale a complex weight if the scale factor is strictly negative and scalar under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            let scale = -1;
            expect(scale).to.be.lessThan(0);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)
        });

        it(`cannot scale a complex weight if the scale factor is strictly negative and complex under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(-1, -2);
            expect(scale.real).to.be.lessThan(0);
            expect(scale.imaginary).to.be.lessThan(0);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)
            scale = new Complex(-1, 2);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)
            scale = new Complex(1, -2);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)
        });

        it(`cannot scale a complex weight if the scale factor is null and scalar under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            let scale = 0;
            expect(scale).to.eql(0);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_NULL)
        });

        it(`cannot scale a complex weight if the scale factor is null and complex under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(0, 0);
            const complexW = new Complex(weightR.value, weightI.value);
            expect(scale.real).to.eql(0);
            expect(scale.imaginary).to.eql(0);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_NULL);
            scale = new Complex(0, 2);
            expect(complexW.multiply(scale).real).to.be.lessThan(0);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
            scale = new Complex(2, -2);
            expect(complexW.multiply(scale).imaginary).to.eql(0);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_NULL);
        });

        it(`can scale a complex weight if the scale factor is scalar and strictly positive under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            let scale = 2;
            expect(scale).to.be.greaterThan(0);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.eql(scale * DEFAULT_WEIGHT_VALUE)
            expect(newWeight.real.strictlyPositive).to.eql(true)
            expect(newWeight.imaginary.value).to.eql(scale * DEFAULT_WEIGHT_VALUE)
            expect(newWeight.imaginary.strictlyPositive).to.eql(true)
        });

        it(`can scale a complex weight if the scale factor is complex and strictly positive under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weightR = new Weight();
            const weightI = new Weight();
            const weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(3, 2);
            expect(scale.real).to.be.greaterThan(0);
            expect(scale.imaginary).to.be.greaterThan(0);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.scaleComplexWeight(weight, scale);
            const complexWeight = new Complex(DEFAULT_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE);
            expect(newWeight.real.value).to.eql(complexWeight.multiply(scale).real)
            expect(newWeight.real.strictlyPositive).to.eql(true)
            expect(newWeight.imaginary.value).to.eql(complexWeight.multiply(scale).imaginary)
            expect(newWeight.imaginary.strictlyPositive).to.eql(true)
        });

        it(`scale a complex weight with a scalar and preserve its strictlyPositive status under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = 2;
            expect(weight.real.strictlyPositive).to.eql(true)
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.strictlyPositive).to.eql(weightR.strictlyPositive);
            expect(newWeight.imaginary.strictlyPositive).to.eql(weightI.strictlyPositive);
        });

        it(`scale a complex weight with a complex and preserve its strictlyPositive status under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(3, 2);
            expect(weight.real.strictlyPositive).to.eql(true)
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.be.greaterThan(0);
            expect(newWeight.imaginary.value).to.be.greaterThan(0);
            expect(newWeight.real.strictlyPositive).to.eql(weightR.strictlyPositive);
            expect(newWeight.imaginary.strictlyPositive).to.eql(weightI.strictlyPositive);
        });

        it(`cannot scale complex weight if the scale factor is scalar and strictly negative under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = -1;
            expect(scale).to.be.lessThan(0);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)
        });

        it(`cannot scale complex weight if the scale factor is complex and strictly negative under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(-1, -2);
            const weightC = new Complex(weightR.value, weightI.value);
            expect(weightC.multiply(scale).real).to.be.greaterThan(0);
            expect(weightC.multiply(scale).imaginary).to.be.lessThan(0);
            expect(scale.real).to.be.lessThan(0);
            expect(scale.imaginary).to.be.lessThan(0);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)
        });

        it(`can scale a complex weight with a strictly positive scalar factor under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = 2;
            expect(scale).to.be.greaterThan(0);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.be.closeTo(weightR.value * scale, TOLERANCE_FLOAT)
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.value).to.be.closeTo(weightI.value * scale, TOLERANCE_FLOAT)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false)
        });

        it(`can scale a complex weight with a strictly positive complex factor under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(3, 2);
            expect(scale.real).to.be.greaterThan(0);
            expect(scale.imaginary).to.be.greaterThan(0);
            const weightC = new Complex(weightR.value, weightI.value);
            expect(weightC.multiply(scale).real).to.be.greaterThan(0);
            expect(weightC.multiply(scale).imaginary).to.be.greaterThan(0);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.be.closeTo(weightC.multiply(scale).real, TOLERANCE_FLOAT)
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.value).to.be.closeTo(weightC.multiply(scale).imaginary, TOLERANCE_FLOAT)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false)
        });

        it(`can scale a complex weight with a strictly positive scalar factor and preserve its strictlyPositive status under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = 2;
            expect(scale).to.be.greaterThan(0);
            expect(weightR.strictlyPositive).to.eql(false)
            expect(weightI.strictlyPositive).to.eql(false)
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can scale a complex weight with a strictly positive complex factor and preserve its strictlyPositive status under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(3, 2);
            expect(scale.real).to.be.greaterThan(0);
            expect(scale.imaginary).to.be.greaterThan(0);
            expect(weightR.strictlyPositive).to.eql(false)
            expect(weightI.strictlyPositive).to.eql(false)
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can scale a complex weight with a null factor under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = 0;
            expect(weightR.strictlyPositive).to.eql(false)
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.eql(0)
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.value).to.eql(0)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false)
        });

        it(`can scale a complex weight with a null complex under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(0, 0);
            expect(weightR.strictlyPositive).to.eql(false)
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.eql(0)
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.value).to.eql(0)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false)
        });

        it(`can scale a complex weight with a null factor and preserve its strictlyPositive status under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = 0;
            expect(weightR.strictlyPositive).to.eql(false)
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can scale a complex weight with a null complex and preserve its strictlyPositive status under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(0, 0);
            expect(weightR.strictlyPositive).to.eql(false)
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`cannot scale a complex weight if the scalar scale factor is strictly negative under ${WeightManagement.SomeNullWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = -1;
            expect(scale).to.be.lessThan(0);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)
        });

        it(`cannot scale a complex weight if the complex scale factor is strictly negative under ${WeightManagement.SomeNullWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(-1, -2);
            const weightC = new Complex(weightR.value, weightI.value);
            expect(weightC.multiply(scale).real).to.be.greaterThan(0);
            expect(weightC.multiply(scale).imaginary).to.be.lessThan(0);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)
            scale = new Complex(-1, 2);
            expect(weightC.multiply(scale).real).to.be.lessThan(0);
            expect(weightC.multiply(scale).imaginary).to.be.greaterThan(0);
            expect(() => weightManager.scaleComplexWeight(weight, scale)).to.throw(EM_SCALE_FACTOR_STRICTLY_NEGATIVE)
        });

        it(`can scale a complex weight with a strictly positive scalar value and preserve its strictlyPositive status under ${WeightManagement.SomeNullWeights} management`, () => {
            let weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            let weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4, false);
            let weight = new ComplexWeight(weightR, weightI);
            let scale = 2;
            expect(scale).to.be.greaterThan(0);
            expect(weightR.strictlyPositive).to.eql(false)
            expect(weightI.strictlyPositive).to.eql(false)
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.be.closeTo(weightR.value * scale, TOLERANCE_FLOAT);
            expect(newWeight.real.strictlyPositive).to.eql(weightR.strictlyPositive);
            expect(newWeight.imaginary.value).to.be.closeTo(weightI.value * scale, TOLERANCE_FLOAT);
            expect(newWeight.imaginary.strictlyPositive).to.eql(weightI.strictlyPositive);
            weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3);
            weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4);
            weight = new ComplexWeight(weightR, weightI);
            expect(weightR.strictlyPositive).to.eql(true);
            expect(weightI.strictlyPositive).to.eql(true);
            newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.be.closeTo(weightR.value * scale, TOLERANCE_FLOAT);
            expect(newWeight.real.strictlyPositive).to.eql(weightR.strictlyPositive)
            expect(newWeight.imaginary.value).to.be.closeTo(weightI.value * scale, TOLERANCE_FLOAT);
            expect(newWeight.imaginary.strictlyPositive).to.eql(weightI.strictlyPositive);
        });

        it(`can scale a complex weight with a strictly positive complex value and preserve its strictlyPositive status under ${WeightManagement.SomeNullWeights} management`, () => {
            let weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3, false);
            let weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4, false);
            let weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(3, 2);
            const weightC = new Complex(weightR.value, weightI.value);
            expect(weightC.multiply(scale).real).to.be.greaterThan(0);
            expect(weightC.multiply(scale).imaginary).to.be.greaterThan(0);
            expect(weightR.strictlyPositive).to.eql(false)
            expect(weightI.strictlyPositive).to.eql(false)
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.be.closeTo(weightC.multiply(scale).real, TOLERANCE_FLOAT);
            expect(newWeight.real.strictlyPositive).to.eql(weightR.strictlyPositive);
            expect(newWeight.imaginary.value).to.be.closeTo(weightC.multiply(scale).imaginary, TOLERANCE_FLOAT);
            expect(newWeight.imaginary.strictlyPositive).to.eql(weightI.strictlyPositive);
            weightR = new Weight(DEFAULT_WEIGHT_VALUE / 3);
            weightI = new Weight(DEFAULT_WEIGHT_VALUE / 4);
            weight = new ComplexWeight(weightR, weightI);
            expect(weightR.strictlyPositive).to.eql(true);
            expect(weightI.strictlyPositive).to.eql(true);
            newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.be.closeTo(weightC.multiply(scale).real, TOLERANCE_FLOAT);
            expect(newWeight.real.strictlyPositive).to.eql(weightR.strictlyPositive)
            expect(newWeight.imaginary.value).to.be.closeTo(weightC.multiply(scale).imaginary, TOLERANCE_FLOAT);
            expect(newWeight.imaginary.strictlyPositive).to.eql(weightI.strictlyPositive);
        });

        it(`can scale a complex weight if the scalar scale factor is null under ${WeightManagement.SomeNullWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = 0;
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.eql(0)
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.value).to.eql(0)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false)
        });

        it(`can scale a complex weight if the complex scale factor is null under ${WeightManagement.SomeNullWeights} management`, () => {
            const weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weightI = new Weight(DEFAULT_WEIGHT_VALUE, false);
            const weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(0, 0);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.eql(0)
            expect(newWeight.real.strictlyPositive).to.eql(false)
            expect(newWeight.imaginary.value).to.eql(0)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false)
        });

        it(`can scale a complex weight if the scalar scale factor is null and assign a false strictlyPositive status under ${WeightManagement.SomeNullWeights} management`, () => {
            const value = NULL_WEIGHT_TOLERANCE / 3;
            let weightR = new Weight(value, false);
            let weightI = new Weight(value, false);
            let weight = new ComplexWeight(weightR, weightI);
            let scale = 0;
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.eql(0)
            expect(newWeight.real.strictlyPositive).to.eql(weightR.strictlyPositive);
            expect(newWeight.imaginary.value).to.eql(0)
            expect(newWeight.imaginary.strictlyPositive).to.eql(weightI.strictlyPositive);
            weightR = new Weight(value);
            weightI = new Weight(value);
            weight = new ComplexWeight(weightR, weightI);
            newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.eql(0)
            expect(newWeight.real.strictlyPositive).to.eql(false);
            expect(newWeight.imaginary.value).to.eql(0)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can scale a complex weight if the scaled real weight is null and assign a false strictlyPositive status under ${WeightManagement.SomeNullWeights} management`, () => {
            const value = NULL_WEIGHT_TOLERANCE / 3;
            let weightR = new Weight(value, false);
            let weightI = new Weight(value, false);
            let weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(2, 2);
            const weightC = new Complex(weightR.value, weightI.value);
            expect(weightC.multiply(scale).real).to.eql(0);
            expect(weightC.multiply(scale).imaginary).to.be.greaterThan(0);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.eql(0)
            expect(newWeight.real.strictlyPositive).to.eql(weightR.strictlyPositive);
            expect(newWeight.imaginary.value).to.eql(weightC.multiply(scale).imaginary)
            expect(newWeight.imaginary.strictlyPositive).to.eql(weightI.strictlyPositive);
            weightR = new Weight(value);
            weightI = new Weight(value);
            weight = new ComplexWeight(weightR, weightI);
            newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.eql(0)
            expect(newWeight.real.strictlyPositive).to.eql(false);
            expect(newWeight.imaginary.value).to.eql(weightC.multiply(scale).imaginary)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can scale a complex weight if the scaled imaginary weight is null and assign a false strictlyPositive status under ${WeightManagement.SomeNullWeights} management`, () => {
            const value = NULL_WEIGHT_TOLERANCE / 3;
            let weightR = new Weight(DEFAULT_WEIGHT_VALUE, false);
            let weightI = new Weight(value, false);
            let weight = new ComplexWeight(weightR, weightI);
            let scale = new Complex(1, value);
            const weightC = new Complex(weightR.value, weightI.value);
            expect(weightC.multiply(scale).real).to.be.greaterThan(NULL_WEIGHT_TOLERANCE);
            expect(weightC.multiply(scale).imaginary).to.be.lessThan(NULL_WEIGHT_TOLERANCE);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            let newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.eql(weightC.multiply(scale).real)
            expect(newWeight.real.strictlyPositive).to.eql(weightR.strictlyPositive);
            expect(newWeight.imaginary.value).to.eql(0)
            expect(newWeight.imaginary.strictlyPositive).to.eql(weightI.strictlyPositive);
            weightR = new Weight(DEFAULT_WEIGHT_VALUE);
            weightI = new Weight(value);
            weight = new ComplexWeight(weightR, weightI);
            newWeight = weightManager.scaleComplexWeight(weight, scale);
            expect(newWeight.real.value).to.eql(weightC.multiply(scale).real)
            expect(newWeight.real.strictlyPositive).to.eql(false);
            expect(newWeight.imaginary.value).to.eql(0)
            expect(newWeight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can clone a weight manager under ${WeightManagement.AllStrictlyPositiveWeights} management`, () => {
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            let weightManager = new WeightManager(weightManagement);
            const weightManager1 = weightManager.clone();
            expect(weightManager1).to.eql(weightManager);
            weightManager = new WeightManager(WeightManagement.AllPositiveWeights);
            expect(weightManager1.weightManagement).to.not.eql(weightManager.weightManagement)
        });

        it(`can clone a weight manager under ${WeightManagement.AllPositiveWeights} management`, () => {
            const weightManagement = WeightManagement.AllPositiveWeights;
            let weightManager = new WeightManager(weightManagement);
            const weightManager1 = weightManager.clone();
            expect(weightManager1).to.eql(weightManager);
            weightManager = new WeightManager(WeightManagement.SomeNullWeights);
            expect(weightManager1.weightManagement).to.not.eql(weightManager.weightManagement)
        });

        it(`can clone a weight manager under ${WeightManagement.SomeNullWeights} management`, () => {
            const weightManagement = WeightManagement.SomeNullWeights;
            let weightManager = new WeightManager(weightManagement);
            const weightManager1 = weightManager.clone();
            expect(weightManager1).to.eql(weightManager);
            weightManager = new WeightManager(WeightManagement.AllStrictlyPositiveWeights);
            expect(weightManager1.weightManagement).to.not.eql(weightManager.weightManagement)
        });

        it('can check if two weights are under same weight management for ' +  WeightManagement.AllStrictlyPositiveWeights + ' management' , () => {
            const weight = new Weight();
            let weight1 = new Weight(10);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightManager.haveSameWeightManagement(weight, weight1)).to.eql(true)
            weight1 = new Weight(10, false);
            expect(weightManager.haveSameWeightManagement(weight, weight1)).to.eql(false)
        });

        it('can check if two weights are under same weight management for ' +  WeightManagement.AllPositiveWeights + ' management' , () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            let weight1 = new Weight(10, false);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightManager.haveSameWeightManagement(weight, weight1)).to.eql(true)
            weight1 = new Weight(10);
            expect(weightManager.haveSameWeightManagement(weight, weight1)).to.eql(false)
        });

        it('can check if two weights are under same weight management for ' +  WeightManagement.SomeNullWeights + ' management' , () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            let weight1 = new Weight(10, false);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightManager.haveSameWeightManagement(weight, weight1)).to.eql(true)
            weight1 = new Weight(10);
            expect(weightManager.haveSameWeightManagement(weight, weight1)).to.eql(true)
            weight1 = new Weight(0, false);
            expect(weightManager.haveSameWeightManagement(weight, weight1)).to.eql(true)
        });

        it('can force a weight to null for a weight under weight management ' +  WeightManagement.AllPositiveWeights, () => {
            const weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightManager.forcesNullWeight(weight)).to.eql(new Weight(0, false))
        });

        it('cannot force a weight to null for a weight under weight management ' +  WeightManagement.AllPositiveWeights + ' if the strictlyPositive weight status is true', () => {
            const weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, true);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.forcesNullWeight(weight)).to.throw(EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT);
        });

        it('can force a weight to null for a weight under weight management ' +  WeightManagement.SomeNullWeights, () => {
            const weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightManager.forcesNullWeight(weight)).to.eql(new Weight(0, false))
            const weight1 = new Weight(NULL_WEIGHT_TOLERANCE / 2, true);
            expect(weightManager.forcesNullWeight(weight1)).to.eql(new Weight(0, false))
        });

        it('cannot force a weight to null for a weight under weight management ' +  WeightManagement.AllStrictlyPositiveWeights, () => {
            const weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, true);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.forcesNullWeight(weight)).to.throw(EM_FORCE_NULL_WEIGHT_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT);
        });

        it('can set the weight status to null weight status under weight management ' +  WeightManagement.SomeNullWeights, () => {
            const weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, true);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightManager.setWeightStatusToNullWeightStatus(weight).strictlyPositive).to.eql(false)
            const weight1 = new Weight(NULL_WEIGHT_TOLERANCE / 2, false);
            expect(weightManager.setWeightStatusToNullWeightStatus(weight1).strictlyPositive).to.eql(false)
        });

        it('cannot set the weight status to null weight status under weight management ' +  WeightManagement.AllStrictlyPositiveWeights, () => {
            const weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, true);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.setWeightStatusToNullWeightStatus(weight)).to.throw(EM_TOGGLE_STATUS_INCOMPATIBLE)
        });

        it('cannot set the weight status to null weight status under weight management ' +  WeightManagement.AllPositiveWeights, () => {
            const weight = new Weight(NULL_WEIGHT_TOLERANCE / 2, true);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.setWeightStatusToNullWeightStatus(weight)).to.throw(EM_TOGGLE_STATUS_INCOMPATIBLE)
        });

    });

});