import { expect } from 'chai';
import { Vector2d } from '../../src/mathematics/Vector2d';

describe('Vector2d', () => {
    
    it('can be initialized without an initializer', () => {
        const v = new Vector2d()
        expect(v.x).to.equal(0)
        expect(v.y).to.equal(0)
    });
    
    it('can be initialized with an initializer', () => {
        const v = new Vector2d(1, 2)
        expect(v.x).to.equal(1)
        expect(v.y).to.equal(2)
    });

    it('can compute its norm', () => {
        const v1 = new Vector2d(3, 4)
        expect(v1.norm()).to.equal(5)
        const v2 = new Vector2d(0, 0)
        expect(v2.norm()).to.equal(0)
        const v3 = new Vector2d(-3, 4)
        expect(v3.norm()).to.equal(5)
        const v4 = new Vector2d(Math.random(), Math.random())
        const v5 = new Vector2d(Math.random(), Math.random())
        expect(v4.norm()).to.be.greaterThan(0)
        expect(v5.norm()).to.be.greaterThan(0)
        const v6 = v4.add(v5)
        // |v4| + |v5| ≥ |v6|
        expect(v4.norm() + v5.norm()).to.be.at.least(v6.norm())
    });

});