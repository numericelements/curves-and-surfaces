import { expect } from 'chai';
import { Vector2d } from '../../src/mathVector/Vector2d';

describe('Vector2d', () => {
    
    it('can be initialized without an initializer', () => {
        const v = new Vector2d();
        expect(v.x).to.equal(0)
        expect(v.y).to.eql(0)
    });
    
    it('can be initialized with an initializer', () => {
        const v = new Vector2d(1, 2);
        expect(v.x).to.equal(1)
        expect(v.y).to.eql(2)
    });

});