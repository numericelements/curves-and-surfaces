import { expect } from 'chai';
import { SquareMatrix } from '../../src/linearAlgebra/SquareMatrix';

describe('SquareMatrix', () => {
    
    it('can multiply a vector', () => {
        let m1 = new SquareMatrix(3, [2, 0, 0, 0, 2, 0, 0, 0, 2])
        let v1 = [1, 2, 3]
        let v2 = m1.multiplyByVector(v1)
        expect(v2).to.deep.equal([2, 4, 6])
    });
    
});