import { expect } from 'chai';
import { SquareMatrix } from '../src/mathematics/SquareMatrix';
import { SymmetricMatrix } from '../src/mathematics/SymmetricMatrix';


describe('SquareMatrix', () => {

    it('can be initialize to a zero matrix of a given size', () => {
        const matrix = new SquareMatrix(2)
        expect( matrix.get(0, 0) ).to.equal(0)
        expect( matrix.get(0, 1) ).to.equal(0)
        expect( matrix.get(1, 0) ).to.equal(0)
        expect( matrix.get(1, 1) ).to.equal(0)
    });

    it('can be initialize to a matrix of given size with given data taking a safe copy', () => {
        //initialize a matrix
        const data = [1, 2, 3, 4]
        const matrix = new SquareMatrix(2, data)
        expect( matrix.get(0, 0) ).to.equal(1)
        expect( matrix.get(0, 1) ).to.equal(2)
        expect( matrix.get(1, 0) ).to.equal(3)
        expect( matrix.get(1, 1) ).to.equal(4)
        //with data of appropriate size
        expect(function() {const m = new SquareMatrix(2, [1])}).to.throw()
        //taking a safe copy
        matrix.set(0, 0, 5)
        expect( matrix.get(0, 0) ).to.equal(5)
        expect( data[0] ).to.equal(1)
    });

    it('can return the value at a given row and column if indices are inside the appropriate range', () => {
        const data = [1, 2, 3, 4]
        const matrix = new SquareMatrix(2, data)
        expect( matrix.get(0, 0) ).to.equal(1)
        expect(function() {const value = matrix.get(3, 0)}).to.throw()
        expect(function() {const value = matrix.get(0, 3)}).to.throw()
        expect(function() {const value = matrix.get(-1, 0)}).to.throw()
        expect(function() {const value = matrix.get(0, -1)}).to.throw()
    });

    it('can  multiply another square matrix', () => {
        const matrix1 = new SquareMatrix(2, [1, 2, 3, 4])
        //const matrix2 = new SquareMatrix(2, [2, 0, 0, 2])
        const matrix2 = new SymmetricMatrix(2, [2, 0, 2])
        const matrix3 = matrix1.multiplyByMatrix(matrix2)
        expect(matrix3.get(0,0)).to.equal(2)
        expect(matrix3.get(0,1)).to.equal(4)
        expect(matrix3.get(1,0)).to.equal(6)
        expect(matrix3.get(1,1)).to.equal(8)
    });

});
