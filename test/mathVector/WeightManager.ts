import { expect } from "chai";
import { WeightManager } from "../../src/mathVector/WeightManager";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_WEIGHT_MANAGER_WEIGHT_TYPE_ERROR, EM_WEIGHT_SUBTRACTION_ERROR } from "../../src/ErrorMessages/WeightManager";
import { WM_WEIGHT_WITH_POSITIVE_VALUE_STATUS, WM_WEIGHT_WITH_STRICTLY_POSITIVE_VALUE_STATUS } from "../../src/WarningMessages/WeightManager";
import { DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";

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

        describe('setWeightStatus', () => {
            const weight = new Weight(10);
            const weight1 = new Weight(10, false);
            it('can set the Weight status of a weight with management category ' + WeightManagement.AllPositiveWeights, () => {
                const weightManagement = WeightManagement.AllPositiveWeights;
                const weightManager = new WeightManager(weightManagement);
                expect(weight.strictlyPositive).to.eql(true)
                const newWeight = weightManager.setWeightStatus(weight);
                expect(newWeight.strictlyPositive).to.eql(false)

                expect(weight1.strictlyPositive).to.eql(false)
                const newWeight1 = weightManager.setWeightStatus(weight1);
                expect(newWeight1.strictlyPositive).to.eql(false)
            });

            it('can set the Weight status of a weight with management category ' + WeightManagement.AllStrictlyPositiveWeights, () => {
                const weightManagement1 = WeightManagement.AllStrictlyPositiveWeights;
                const weightManager1 = new WeightManager(weightManagement1);
                const newWeight2 = weightManager1.setWeightStatus(weight);
                expect(newWeight2.strictlyPositive).to.eql(true)
                expect(() => weightManager1.setWeightStatus(weight1)).to.throw(EM_WEIGHT_MANAGER_WEIGHT_TYPE_ERROR);
            });

            it('can set the Weight status of a weight with management category ' + WeightManagement.SomeNullWeights, () => {
                const weightManagement2 = WeightManagement.SomeNullWeights;
                const weightManager2 = new WeightManager(weightManagement2);
                const newWeight3 = weightManager2.setWeightStatus(weight);
                expect(newWeight3.strictlyPositive).to.eql(true)
                const newWeight5 = weightManager2.setWeightStatus(weight1);
                expect(newWeight5.strictlyPositive).to.eql(false)
            });
        });

        it('can add weights with management category ' + WeightManagement.AllStrictlyPositiveWeights, () => {
            const weight = new Weight();
            const value = 10;
            const weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight2 = weightManager.addWeights(weight, weight1);
            expect(newWeight2.strictlyPositive).to.eql(true)
            expect(newWeight2.weight).to.eql(value + DEFAULT_WEIGHT_VALUE)
            // test the warning message issued by the method
            const originalConsoleLog = console.log;
            let capturedMessage = '';
            console.log = (message: string) => {
                capturedMessage = message;
            };
            weightManager.addWeights(weight, weight1);
            expect(capturedMessage.includes(WM_WEIGHT_WITH_POSITIVE_VALUE_STATUS)).to.eql(true);
            console.log = originalConsoleLog;
        });

        it('can add weights with management category ' + WeightManagement.AllPositiveWeights, () => {
            const weight = new Weight();
            const value = 10;
            const weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight2 = weightManager.addWeights(weight, weight1);
            expect(newWeight2.strictlyPositive).to.eql(false)
            expect(newWeight2.weight).to.eql(value + DEFAULT_WEIGHT_VALUE)
            // test the warning message issued by the method
            const originalConsoleLog = console.log;
            let capturedMessage = '';
            console.log = (message: string) => {
                capturedMessage = message;
            };
            weightManager.addWeights(weight, weight1);
            expect(capturedMessage.includes(WM_WEIGHT_WITH_STRICTLY_POSITIVE_VALUE_STATUS)).to.eql(true);
            console.log = originalConsoleLog;
        });

        it('can add weights with management category ' + WeightManagement.SomeNullWeights, () => {
            const value = 1e-11;
            const weight = new Weight(value, true);
            const weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight2 = weightManager.addWeights(weight, weight1);
            expect(newWeight2.strictlyPositive).to.eql(false)
            expect(newWeight2.weight).to.eql(0)
            const value1 = 10;
            const weight2 = new Weight(value1, false);
            const newWeight3 = weightManager.addWeights(weight, weight2);
            expect(newWeight3.strictlyPositive).to.eql(true)
            expect(newWeight3.weight).to.eql(value + value1)
        });

        it('cannot subtract weights if the subtraction produces a negative weight', () => {
            const weight = new Weight();
            const value = 10;
            const weight1 = new Weight(value, false);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR)
            const weightManagement2 = WeightManagement.AllPositiveWeights;
            const weightManager2 = new WeightManager(weightManagement2);
            expect(() => weightManager2.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR)
            const weightManagement3 = WeightManagement.SomeNullWeights;
            const weightManager3 = new WeightManager(weightManagement3);
            expect(() => weightManager3.subtractWeights(weight, weight1)).to.throw(EM_WEIGHT_SUBTRACTION_ERROR)
        });

        it('cannot subtract weights if the subtraction produces a weight under the null weight threshold under ' + WeightManagement.AllStrictlyPositiveWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE + 1e-11;
            const weight1 = new Weight(value, true);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            expect(() => weightManager.subtractWeights(weight, weight1)).to.throw(EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)
        });

        it('can subtract weights if the subtraction produces a positive weight over the null weight threshold under ' + WeightManagement.AllStrictlyPositiveWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE - COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * NULL_WEIGHT_TOLERANCE;
            const weight1 = new Weight(value, true);
            const weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(true)
            expect(newWeight.weight).to.be.closeTo(COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * NULL_WEIGHT_TOLERANCE, TOLERANCE_FLOAT)
        });
        
        it('can subtract weights if the subtraction produces a positive weight greater than the null weight threshold under ' + WeightManagement.AllPositiveWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE - (NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF);
            const weight1 = new Weight(value, true);
            const weightManagement = WeightManagement.AllPositiveWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(false)
            expect(newWeight.weight).to.be.closeTo(COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * NULL_WEIGHT_TOLERANCE, TOLERANCE_FLOAT)
        });

        it(' can subtract weights and obtain a null weight if the weight difference is under the null weight threshold under ' + WeightManagement.AllPositiveWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE - 1e-11;
            const weight1 = new Weight(value, true);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(false)
            expect(newWeight.weight).to.be.eql(0)
        });

        it('can subtract weights if the subtraction produces a null weight under ' + WeightManagement.SomeNullWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE - 1e-11;
            const weight1 = new Weight(value, true);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(false)
            expect(newWeight.weight).to.be.eql(0)
        });

        it('can subtract weights if the subtraction produces a positive weight under ' + WeightManagement.SomeNullWeights + ' management' , () => {
            const weight = new Weight();
            const value = DEFAULT_WEIGHT_VALUE - (NULL_WEIGHT_TOLERANCE * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF);
            const weight1 = new Weight(value, true);
            const weightManagement = WeightManagement.SomeNullWeights;
            const weightManager = new WeightManager(weightManagement);
            const newWeight = weightManager.subtractWeights(weight, weight1);
            expect(newWeight.strictlyPositive).to.eql(true)
            expect(newWeight.weight).to.be.closeTo(COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * NULL_WEIGHT_TOLERANCE, TOLERANCE_FLOAT)
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

    });

});