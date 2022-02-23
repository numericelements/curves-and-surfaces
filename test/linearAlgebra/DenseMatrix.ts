import { expect } from 'chai';
import { DenseMatrix } from '../../src/linearAlgebra/DenseMatrix';

describe('DenseMatrix', () => {
    
    it('can return a DenseMatrix with removed given rows', () => {
        let m1 = new DenseMatrix(3, 3, [1, 0, 0, 0, 1, 0, 0, 0, 1])
        let m2 = m1.removeRows([1])
        expect(m2.shape).to.deep.equal([2, 3])
        expect(m2.get(0, 0)).equal(1)
        expect(m2.get(1, 0)).equal(0)
        expect(m2.get(1, 2)).equal(1)
    });
    


});