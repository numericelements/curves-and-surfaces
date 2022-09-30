
import { expect } from 'chai';
import { dekkerProduct } from '../../src/floatingPointArithmetic/DekkerAlgorithm';


describe('DekkerAlgorithm', () => {
    
    it('computes very accurate product ', () => {
        const a = 3
        const b = 3 
        const p = dekkerProduct(a, b)
        expect(p.r1 + p.r2).equal(9)
        expect(p.r2).equal(0)
    });

});
