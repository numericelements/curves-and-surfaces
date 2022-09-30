
import { expect } from 'chai';
import { compensatedDotProduct } from '../../src/floatingPointArithmetic/CompensatedDotProduct';



describe('CompensatedDotProduct', () => {
    
    it('computes very accurate dot product ', () => {
        const a = [1, 2, 3]
        const b = [1, 2, 3]
        const p = compensatedDotProduct(a, b)
        expect(p).equal(14)
    });

});