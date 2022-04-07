import { expect } from 'chai';
import { linePlaneIntersection, pointLineDistance, Vector3d } from '../../src/mathVector/Vector3d';

describe('Vector3d', () => {
    
    it('can be initialized without an initializer', () => {
        const v = new Vector3d()
        expect(v.x).to.equal(0)
        expect(v.y).to.equal(0)
        expect(v.z).to.equal(0)
    });
    
    it('can be initialized with an initializer', () => {
        const v = new Vector3d(1, 2, 3)
        expect(v.x).to.equal(1)
        expect(v.y).to.equal(2)
        expect(v.z).to.equal(3)
    });

    it('can compute its norm', () => {
        const v1 = new Vector3d(3, 4, 0)
        expect(v1.norm()).to.equal(5)
        const v2 = new Vector3d(0, 0)
        expect(v2.norm()).to.equal(0)
        const v3 = new Vector3d(-3, 4, 0)
        expect(v3.norm()).to.equal(5)
        const v4 = new Vector3d(Math.random(), Math.random(), Math.random())
        const v5 = new Vector3d(Math.random(), Math.random(), Math.random())
        expect(v4.norm()).to.be.greaterThan(0)
        expect(v5.norm()).to.be.greaterThan(0)
        const v6 = v4.add(v5)
        // |v4| + |v5| ≥ |v6|
        expect(v4.norm() + v5.norm()).to.be.at.least(v6.norm())
    });

    it('can rotate a vector', () => {
        const v1 = new Vector3d(0, 1, 0)
        const v2 = new Vector3d(1, 0, 0)
        const v3 = v1.axisAngleRotation(v2, Math.PI / 2)
        expect(v3.x).to.be.closeTo(0, 10e-8)
        expect(v3.y).to.be.closeTo(0, 10e-8)
        expect(v3.z).to.be.closeTo(1, 10e-8)
    });

    it('can compute minimum distrance between a point and a line', () => {
        const v1 = new Vector3d(0, 0, 0)
        const v2 = new Vector3d(1, 0, 0)
        const v0 = new Vector3d(2, 0, 0)
        expect(pointLineDistance(v0, v1, v2)).to.be.closeTo(0, 10e-8)
        const v1a = new Vector3d(0, 0, 0)
        const v2a = new Vector3d(1, 0, 0)
        const v0a = new Vector3d(0, 1, 0)
        expect(pointLineDistance(v0a, v1a, v2a)).to.be.closeTo(1, 10e-8)
        const v1b = new Vector3d(0, 0, 0)
        const v2b = new Vector3d(0, 1, 0)
        const v0b = new Vector3d(1, 0, 0)
        expect(pointLineDistance(v0b, v1b, v2b)).to.be.closeTo(1, 10e-8)
    });

    it('can find the intersection between a plane an a line', () => {
        const lineP1 = new Vector3d(0, -3, 0)
        const lineP2 = new Vector3d(1, 0, 0)
        const lookAtOrigin = new Vector3d(0, 0, 0)
        const cameraPosition = new Vector3d(0, -3, 0)
        const objectCenter = new Vector3d(0, 0, 0)
        const point = linePlaneIntersection(lineP1, lineP2, lookAtOrigin, cameraPosition, objectCenter)
        expect(point.x).to.be.closeTo(1, 10e-8)
        expect(point.y).to.be.closeTo(0, 10e-8)
        expect(point.z).to.be.closeTo(0, 10e-8)
    });

});