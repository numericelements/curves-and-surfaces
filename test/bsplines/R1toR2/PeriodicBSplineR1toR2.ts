import { expect } from 'chai'
import { BSplineR1toR2 } from '../../../src/bsplines/R1toR2/BSplineR1toR2'
import { PeriodicBSplineR1toR2 } from '../../../src/bsplines/R1toR2/PeriodicBSplineR1toR2'
import { Vector2d } from '../../../src/mathVector/Vector2d'

describe('PeriodicBSplineR1toR2', () => {

    it('can be initialized without an initializer', () => {
        const s = new PeriodicBSplineR1toR2()
        expect(s.controlPoints[0]).to.deep.equal(new Vector2d(0, 0))
        expect(s.controlPoints.length).to.equal(1)
        expect(s.knots).to.deep.equal([0, 1])
    })

    it('can be initialized with an initializer', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)

        const s = new PeriodicBSplineR1toR2([ cp0, cp1, cp2 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s.controlPoints).to.deep.equal([ cp0, cp1, cp2 ])
        expect(s.knots).to.deep.equal([ 0, 0, 0, 1, 1, 1 ])
        expect(s.degree).to.equal(2)
    })

    it('throws an exception at construction if the degree of the b-spline is negative', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        expect(function() {const s = new PeriodicBSplineR1toR2([ cp0, cp1, cp2 ], [ 0, 0, 1 ])}).to.throw()
    })

    it('can be used to evaluate a Bezier curve', () => {
        const u = 0.22
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const b02 = Math.pow(1-u, 2)
        const b12 = 2*u*(1-u)
        const b22 = Math.pow(u, 2)
        const s = new PeriodicBSplineR1toR2([ cp0, cp1, cp2 ], [ 0, 0, 0, 1, 1, 1 ])
        const result = ( cp0.multiply(b02) ).add( cp1.multiply(b12) ).add( cp2.multiply(b22) )
        expect(s.evaluate(u)).to.eql(result)
    })

    it('can be safely cloned', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp2 = new Vector2d(-0.1, 8)
        const cp3 = new Vector2d(0.1, 8)
        const cp4 = new Vector2d(0.5, 0)
        let s1 = new PeriodicBSplineR1toR2([cp0, cp2, cp3, cp4], [ 0, 0, 0, 0.5, 1, 1, 1])
        let s2 = s1.clone()
        //s2.optimizerStep([1, 0, 0, 0])
        let s3 = s2.moveControlPoints([new Vector2d(1, 0), new Vector2d(0, 0)])
        expect(s3.controlPoints[0].x).to.equal(0.5)
        expect(s1.controlPoints[0].x).to.equal(-0.5)
    });

})