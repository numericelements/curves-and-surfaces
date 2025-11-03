import { expect } from "chai";
import { WeightManager } from "../../src/mathVector/WeightManager";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { EM_FORCE_NULL_WEIGHT_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT, EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_SCALE_FACTOR_NULL, EM_SCALE_FACTOR_STRICTLY_NEGATIVE, EM_TOGGLE_STATUS_INCOMPATIBLE, EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT, EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT, EM_WEIGHT_SUBTRACTION_ERROR } from "../../src/ErrorMessages/WeightManager";
import { WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE, WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE } from "../../src/WarningMessages/WeightManager";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { EM_WEIGHT_VALUE_POSITIVE, EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../../src/ErrorMessages/Weight";

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

        it('can add weights with management category ' + WeightManagement.AllPositiveWeights + `and values greater than ${NULL_WEIGHT_TOLERANCE}`, () => {
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

        it('can add weights with management category ' + WeightManagement.AllPositiveWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
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

        it('send a warning when adding weights with management category ' + WeightManagement.AllPositiveWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
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

        it('can add weights with management category ' + WeightManagement.SomeNullWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE} and propagate a strictlyPositive status true when weights has the same status`, () => {
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

        it('can add weights with management category ' + WeightManagement.SomeNullWeights + `and values smaller than ${NULL_WEIGHT_TOLERANCE} and propagate a strictlyPositive status false when weights has the same status or different statuses`, () => {
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

        it(`assigns a false strictlyPositive status, whatever the status if the input weights, if the subtraction produces a negative weight greater than -${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
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

        it(`assigns a false strictlyPositive status, whatever the status if the input weights, if the subtraction produces a positive weight smaller than ${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
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

        it(`assigns a true strictlyPositive status, whatever the status if the input weights, if the subtraction produces a positive weight greater than ${NULL_WEIGHT_TOLERANCE} under ` + WeightManagement.SomeNullWeights + ' management' , () => {
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
            expect(weightManager.isSameWeightManagement(weight, weight1)).to.eql(true)
            weight1 = new Weight(10, false);
            expect(weightManager.isSameWeightManagement(weight, weight1)).to.eql(false)
        });

        it('can check if two weights are under same weight management for ' +  WeightManagement.AllPositiveWeights + ' management' , () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            let weight1 = new Weight(10, false);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightManager.isSameWeightManagement(weight, weight1)).to.eql(true)
            weight1 = new Weight(10);
            expect(weightManager.isSameWeightManagement(weight, weight1)).to.eql(false)
        });

        it('can check if two weights are under same weight management for ' +  WeightManagement.SomeNullWeights + ' management' , () => {
            const weight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            let weight1 = new Weight(10, false);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(weightManager.isSameWeightManagement(weight, weight1)).to.eql(true)
            weight1 = new Weight(10);
            expect(weightManager.isSameWeightManagement(weight, weight1)).to.eql(true)
            weight1 = new Weight(0, false);
            expect(weightManager.isSameWeightManagement(weight, weight1)).to.eql(true)
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