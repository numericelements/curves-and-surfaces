import { expect } from 'chai';
import { SymmetricMatrix } from '../../src/linearAlgebra/SymmetricMatrix';

describe('SquareMatrix', () => {
    
    it('can multiply a vector', () => {
        let m = new SymmetricMatrix(3, [1, 2, 3, 4, 5, 6])
        expect(m.get(0, 0)).equal(1)
        expect(m.get(0, 1)).equal(2)
        expect(m.get(0, 2)).equal(3)
        expect(m.get(1, 1)).equal(4)
        expect(m.get(1, 2)).equal(5)
        expect(m.get(2, 2)).equal(6)
    });
    
});