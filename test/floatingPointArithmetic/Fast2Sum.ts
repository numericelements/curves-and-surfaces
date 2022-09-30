import { expect } from 'chai';
import { fast2Sum, twoSum } from '../../src/floatingPointArithmetic/Fast2Sum';

describe('Fast2Sum', () => {
    
    it('computes very accurate sum ', () => {
        const a = 1
        const b = -1 * Math.pow(2, -3 * 53)
        const sum1 = fast2Sum(a, b)
        const sum2 = twoSum(a, b)
        expect(-1 * Math.pow(2, -3 * 53)).equal(-1.3684555315672042e-48)
        expect(sum1.s).equal(1)
        expect(sum1.t).equal(-1.3684555315672042e-48)
        expect(sum2.s).equal(1)
        expect(sum2.t).equal(-1.3684555315672042e-48)
    });

});