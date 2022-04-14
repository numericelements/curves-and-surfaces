import { expect } from 'chai';
import { BernsteinDecompositionR1toR1 } from '../../../src/bsplines/R1toR1/BernsteinDecompositionR1toR1';

describe('BernsteinDecompositionR1toR1', () => {
    
    it('can be multiplied', () => {
        const bd1 = new BernsteinDecompositionR1toR1([[1, 2, 3], [4, 5, 6]])
        const bd2 = new BernsteinDecompositionR1toR1([[1], [1]])
        const bd3 = bd1.multiply(bd2)
        expect(bd1).to.deep.equal(bd3)
    });

    it('can multiply a range', () => {
        const bd1 = new BernsteinDecompositionR1toR1([[1, 2, 3], [4, 5, 6]])
        const bd2 = new BernsteinDecompositionR1toR1([[1], [1]])
        const bd3 = bd1.multiplyRange(bd2, 1, 2)
        const bd4 = new BernsteinDecompositionR1toR1([[4, 5, 6]])
        expect(bd3).to.deep.equal(bd4)
    });

    it('can multiply a range2', () => {
        const bd1 = new BernsteinDecompositionR1toR1([[4, 5, 6]])
        const bd2 = new BernsteinDecompositionR1toR1([[1], [1]])
        const bd3 = bd1.multiplyRange2(bd2, 1, 2)
        const bd4 = new BernsteinDecompositionR1toR1([[4, 5, 6]])
        expect(bd3).to.deep.equal(bd4)
    });

});