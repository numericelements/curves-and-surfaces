import { expect } from 'chai';
import { CholeskyDecomposition } from '../../src/linearAlgebra/CholeskyDecomposition';
import { SymmetricMatrix } from '../../src/linearAlgebra/SymmetricMatrix';

describe('CholeskyDecomposition', () => {
    
    it('can tell if a symmetric matrix is positive definite', () => {
        let sm1 = new SymmetricMatrix(3, [2, -1, 0, 2, -1, 2])
        let cd1 = new CholeskyDecomposition(sm1)
        expect(cd1.success).to.equal(true)

        let sm2 = new SymmetricMatrix(3, [-1, 0, 0, 1, 0, 1])
        let cd2 = new CholeskyDecomposition(sm2)
        expect(cd2.success).to.equal(false)
    });
    


});