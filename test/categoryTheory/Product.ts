import { expect } from 'chai';
import { firstArgument, productFunction } from '../../src/categoryTheory/Product';

describe('Tuples', () => {
    
    it('can compose functions for tuples', () => {
        expect(productFunction.f(5)).to.deep.equal( { fst: 6, snd: false } )
        expect(firstArgument.f(5)).to.deep.equal(7)
    })

})