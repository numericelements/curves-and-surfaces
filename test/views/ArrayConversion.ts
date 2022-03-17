import { expect } from 'chai';
import { toFloat32Array, toUint16Array } from '../../src/views/ArrayConversion';

describe('ArrayConversion', () => {
    
    it('can convert an array to a Float32Array ', () => {
        const v = [1.1, 2.2, 3.3, -3.3]
        const a = toFloat32Array(v)
        expect(a[0]).to.be.closeTo(1.1, 10e-6)
        expect(a[1]).to.be.closeTo(2.2, 10e-6)
        expect(a[2]).to.be.closeTo(3.3, 10e-6)
        expect(a[3]).to.be.closeTo(-3.3, 10e-6)
    });

    it('can convert an array to a Uint16Array ', () => {
        const v = [1.1, 2.2, 3.3]
        const a = toUint16Array(v)
        expect(a[0]).to.equal(1)
        expect(a[1]).to.equal(2)
        expect(a[2]).to.equal(3)
    });
    

});