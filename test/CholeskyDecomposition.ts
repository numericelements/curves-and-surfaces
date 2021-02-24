import { expect } from 'chai';
import { CholeskyDecomposition } from '../src/mathematics/CholeskyDecomposition';
import { SymmetricMatrix } from '../src/mathematics/SymmetricMatrix';

describe('CholeskyDecomposition', () => {
    
    it('can perform the Cholesky decomposition of a positive definite matrix', () => {
        let matrix = new SymmetricMatrix(2, [1, 0, 1])
        let c = new CholeskyDecomposition(matrix)
        expect(c.success).to.equal(true)
        let b = [2, 3]
        let a = c.solve(b)
        expect(a).to.eql(b)

    });

    it('can solve the linear system for a positive definite matrix', () => {
        let matrix = new SymmetricMatrix(3, [4, 12, -16, 37, -43, 98])
        let c = new CholeskyDecomposition(matrix)
        expect(c.g.get(0, 0)).to.equal(2)
        expect(c.g.get(1, 0)).to.equal(6)
        expect(c.g.get(2, 0)).to.equal(-8)
        expect(c.g.get(1, 1)).to.equal(1)        
        expect(c.g.get(2, 1)).to.equal(5)
        expect(c.g.get(2, 2)).to.equal(3)
    });

    it('throw an error if an attempt is made to solve a linear system after a failed decomposition', () => {
        // non positive definite
        let matrix = new SymmetricMatrix(2, [1, 0, 0])
        let b = [2, 3]
        let c = new CholeskyDecomposition(matrix)
        expect(c.success).to.equal(false)
        expect(function() {const a = c.solve(b)}).to.throw()
    });

    it('throw an error if the vector b is given to the solve method with a wrong size', () => {
        // non positive definite
        let matrix = new SymmetricMatrix(2, [1, 0, 8])
        let b = [2, 3, 5]
        let c = new CholeskyDecomposition(matrix)
        expect(c.success).to.equal(true)
        expect(function() {const a = c.solve(b)}).to.throw()
    });


});