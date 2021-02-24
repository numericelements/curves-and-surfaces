import { expect } from 'chai';
import { findSpan } from '../src/mathematics/Piegl_Tiller_NURBS_Book';
import { basisFunctions } from '../src/mathematics/Piegl_Tiller_NURBS_Book';


describe('findSpan', () => {

    it('throws an exception if u < knots[degree] || u > knots[knots.length - degree - 1] ', () => {
        expect(function() {findSpan(0, [0, 1, 2, 3, 4, 5, 6], 2)}).to.throw()
        expect(function() {findSpan(1, [0, 1, 2, 3, 4, 5, 6], 2)}).to.throw()
        expect(function() {findSpan(5, [0, 1, 2, 3, 4, 5, 6], 2)}).to.throw()
        expect(function() {findSpan(6, [0, 1, 2, 3, 4, 5, 6], 2)}).to.throw()
    });
    
    it('returns the span index i for which knots[i] ≤ u < knots[i+1]', () => {
        expect(findSpan(2, [0, 1, 2, 3, 4, 5, 6], 2)).to.equal(2)
        expect(findSpan(2.5, [0, 1, 2, 3, 4, 5, 6], 2)).to.equal(2)
        expect(findSpan(3, [0, 1, 2, 3, 4, 5, 6], 2)).to.equal(3)
    });

    it('returns knots.length - degree - 2 if u = knots[knots.length - degree - 1]', () => {
        expect(findSpan(4, [0, 1, 2, 3, 4, 5, 6], 2)).to.equal(3)
        expect(findSpan(3, [0, 1, 2, 3, 4, 5, 6], 3)).to.equal(2)
    });
});

describe('basisFunctions', () => {
    it('returns the values of the basis functions at u', () => {
        const knots = [0, 0, 0, 1, 1, 1]
        const degree = 2
        const u = 0.5
        const span = findSpan(u, knots, degree)
        const b = basisFunctions(span, u, knots, degree)
        expect(b[0]).to.equal(0.25)
        expect(b[1]).to.equal(0.5)
        expect(b[2]).to.equal(0.25)
    });

});