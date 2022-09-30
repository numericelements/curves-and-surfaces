import { expect } from 'chai';
import { malcolmAlgorithm, precision } from '../../src/floatingPointArithmetic/MalcolmAlgorithm';


describe('Malcolm algorithm', () => {
    
    it('computes the radix of a floating-point system', () => {
        const radix = malcolmAlgorithm()
        expect(radix).equal(2)
        const p = precision(radix)
        expect(p).equal(53)
    });

});