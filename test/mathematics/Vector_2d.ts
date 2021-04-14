import { expect } from 'chai';
import { Vector_2d } from '../../src/mathematics/Vector_2d';

describe('Vector_2d', () => {
    
    it('can be initialized without an initializer', () => {
        const v = new Vector_2d();
        expect(v.x).to.equal(0)
        expect(v.y).to.eql(0)
    });
    
    it('can be initialized with an initializer', () => {
        const v = new Vector_2d(1, 2);
        expect(v.x).to.equal(1)
        expect(v.y).to.eql(2)
    });

});