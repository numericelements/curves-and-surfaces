import { expect } from 'chai';
import { composedFunction } from '../../src/categoryTheory/CategoricalFunction';

describe('Categorical function', () => {
    
    it('can compose functions', () => {
        expect(composedFunction.f(5)).to.equal(false)
    })

})