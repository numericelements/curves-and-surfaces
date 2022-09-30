import { expect } from 'chai';
import { SquareMatrix } from '../../src/linearAlgebra/SquareMatrix';
import { rotationMatrixFromTwoVectors } from '../../src/mathVector/RotationMatrix';
import { Vector3d } from '../../src/mathVector/Vector3d';

describe('RotationMatrix', () => {
    
    it('returns the indentity matrix one given twice the same vector', () => {
        const v1 = new Vector3d(1, 0, 0)
        let m = rotationMatrixFromTwoVectors(v1, v1)
        expect(m.get(0, 0)).to.be.closeTo(1, 10e-8)
        expect(m.get(0, 1)).to.be.closeTo(0, 10e-8)
        expect(m.get(0, 2)).to.be.closeTo(0, 10e-8)
        expect(m.get(1, 0)).to.be.closeTo(0, 10e-8)
        expect(m.get(1, 1)).to.be.closeTo(1, 10e-8)
        expect(m.get(1, 2)).to.be.closeTo(0, 10e-8)
        expect(m.get(2, 0)).to.be.closeTo(0, 10e-8)
        expect(m.get(2, 1)).to.be.closeTo(0, 10e-8)
        expect(m.get(2, 2)).to.be.closeTo(1, 10e-8)
    });

    it('returns the correct rotation matrix for vectors (1, 0, 0) and (0, 1, 0)', () => {
        const v1 = new Vector3d(1, 0, 0)
        const v2 = new Vector3d(0, 1, 0)
        let m = rotationMatrixFromTwoVectors(v1, v2)
        expect(m.get(0, 0)).to.be.closeTo(0, 10e-8)
        expect(m.get(0, 1)).to.be.closeTo(-1, 10e-8)
        expect(m.get(0, 2)).to.be.closeTo(0, 10e-8)
        expect(m.get(1, 0)).to.be.closeTo(1, 10e-8)
        expect(m.get(1, 1)).to.be.closeTo(0, 10e-8)
        expect(m.get(1, 2)).to.be.closeTo(0, 10e-8)
        expect(m.get(2, 0)).to.be.closeTo(0, 10e-8)
        expect(m.get(2, 1)).to.be.closeTo(0, 10e-8)
        expect(m.get(2, 2)).to.be.closeTo(1, 10e-8)
        const v3 = m.multiplyByVector([v1.x, v1.y, v1.z])
        expect(v3[0]).to.be.closeTo(0, 10e-8)
        expect(v3[1]).to.be.closeTo(1, 10e-8)
        expect(v3[2]).to.be.closeTo(0, 10e-8)
    });

    it('returns the correct rotation matrix for vectors (1, 0, 0) and (0, 0, 1)', () => {
        const v1 = new Vector3d(1, 0, 0)
        const v2 = new Vector3d(0, 0, 1)
        let m = rotationMatrixFromTwoVectors(v1, v2)
        const v3 = m.multiplyByVector([v1.x, v1.y, v1.z])
        expect(v3[0]).to.be.closeTo(0, 10e-8)
        expect(v3[1]).to.be.closeTo(0, 10e-8)
        expect(v3[2]).to.be.closeTo(1, 10e-8)
    });

    it('returns the correct rotation matrix for vectors (0, 1, 0) and (0, 0, 1)', () => {
        const v1 = new Vector3d(0, 1, 0)
        const v2 = new Vector3d(0, 0, 1)
        let m = rotationMatrixFromTwoVectors(v1, v2)
        const v3 = m.multiplyByVector([v1.x, v1.y, v1.z])
        expect(v3[0]).to.be.closeTo(0, 10e-8)
        expect(v3[1]).to.be.closeTo(0, 10e-8)
        expect(v3[2]).to.be.closeTo(1, 10e-8)
    });

    it('throws if the vectors given points in opposite directions', () => {
        const v1 = new Vector3d(0, 1, 0)
        const v2 = new Vector3d(0, -1, 0)
        expect(() => rotationMatrixFromTwoVectors(v1, v2)).to.throw()
    });
    


});