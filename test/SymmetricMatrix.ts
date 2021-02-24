import { expect } from 'chai';
import { SymmetricMatrix } from '../src/mathematics/SymmetricMatrix';

describe('SymmetricMatrix', () => {

    it('can be initialize to a zero matrix of a given size', () => {
        const matrix = new SymmetricMatrix(2)
        expect( matrix.get(0, 0) ).to.equal(0)
        expect( matrix.get(0, 1) ).to.equal(0)
        expect( matrix.get(1, 0) ).to.equal(0)
        expect( matrix.get(1, 1) ).to.equal(0)
    });

    it('can be initialize to a matrix of given size with given data taking a safe copy', () => {
        //initialize a matrix
        const data = [1, 2, 3]
        const matrix = new SymmetricMatrix(2, data)
        expect( matrix.get(0, 0) ).to.equal(1)
        expect( matrix.get(0, 1) ).to.equal(2)
        expect( matrix.get(1, 0) ).to.equal(2)
        expect( matrix.get(1, 1) ).to.equal(3)
        //with data of appropriate size
        expect(function() {const m = new SymmetricMatrix(2, [1])}).to.throw()
        //taking a safe copy
        matrix.set(0, 0, 5)
        expect( matrix.get(0, 0) ).to.equal(5)
        expect( data[0] ).to.equal(1)
    });

    it('can return the value at a given row and column if indices are inside the appropriate range', () => {
        const data = [1, 2, 3]
        const matrix = new SymmetricMatrix(2, data)
        expect( matrix.get(0, 0) ).to.equal(1)
        expect(function() {const value = matrix.get(3, 0)}).to.throw()
        expect(function() {const value = matrix.get(0, 3)}).to.throw()
        expect(function() {const value = matrix.get(-1, 0)}).to.throw()
        expect(function() {const value = matrix.get(0, -1)}).to.throw()
    });

    it('can compute the quadratic form', () => {
        const data = [1, 2, 3]
        const matrix = new SymmetricMatrix(2, data)
        const result = matrix.quadraticForm([3, 5])
        // value = 1*x*x + 2*2*x*y + 3*y*y
        const value = 1*3*3 + 2*2*3*5+ 3*5*5
        expect( result ).to.equal(144)
        expect( result ).to.equal(value)

    });

});