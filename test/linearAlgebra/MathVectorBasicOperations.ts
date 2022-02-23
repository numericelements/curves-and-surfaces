import { expect } from 'chai';
import { removeElements } from '../../src/linearAlgebra/MathVectorBasicOperations';
import { SymmetricMatrix } from '../../src/linearAlgebra/SymmetricMatrix';

describe('removeElements', () => {
    
    it('can remove elements from an array given and list of indices', () => {
        let m1 = new SymmetricMatrix(2)
        let m2 = new SymmetricMatrix(2)
        let m3 = new SymmetricMatrix(2)
        let l1 = [m1, m2, m3]
        let l2 = removeElements(l1, [1])
        expect(l2.length).equal(2)
        expect(l1.length).equal(3)
    });
    


});