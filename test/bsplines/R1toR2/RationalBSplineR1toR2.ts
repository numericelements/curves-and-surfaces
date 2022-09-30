import { expect } from 'chai';
import { RationalBSplineR1toR2 } from '../../../src/bsplines/R1toR2/RationalBSplineR1toR2';
import { Vector3d } from '../../../src/mathVector/Vector3d';

describe('RationalBSplineR1toR2', () => {


    it('can be initialized without an initializer', () => {
        const s = new RationalBSplineR1toR2()
        expect(s.controlPoints[0]).to.deep.equal(new Vector3d(0, 0, 1))
        expect(s.controlPoints.length).to.equal(1)
        expect(s.knots).to.deep.equal([0, 1])
    })


    it('can be initialized with an initializer', () => {
        const cp0 = new Vector3d(-0.5, 0, 1)
        const cp1 = new Vector3d(0, 8, 1)
        const cp2 = new Vector3d(0.5, 0, 1)

        const s = new RationalBSplineR1toR2([ cp0, cp1, cp2 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s.controlPoints).to.deep.equal([ cp0, cp1, cp2 ])
        expect(s.knots).to.deep.equal([ 0, 0, 0, 1, 1, 1 ])
        expect(s.degree).to.equal(2)
    })

    

    it('throws an exception at construction if the degree of the b-spline is negative', () => {
        const cp0 = new Vector3d(-0.5, 0, 1)
        const cp1 = new Vector3d(0, 8, 1)
        const cp2 = new Vector3d(0.5, 0, 1)
        expect(function() {const s = new RationalBSplineR1toR2([ cp0, cp1, cp2 ], [ 0, 0, 1 ])}).to.throw()
    })

    

    it('can be used to evaluate a Bezier curve', () => {
        const u = 0.22
        const cp0 = new Vector3d(-0.5, 0, 1)
        const cp1 = new Vector3d(0, 8, 1)
        const cp2 = new Vector3d(0.5, 0, 1)
        const b02 = Math.pow(1-u, 2)
        const b12 = 2*u*(1-u)
        const b22 = Math.pow(u, 2)
        const s = new  RationalBSplineR1toR2([ cp0, cp1, cp2 ], [ 0, 0, 0, 1, 1, 1 ])
        const result = ( cp0.multiply(b02) ).add( cp1.multiply(b12) ).add( cp2.multiply(b22) )
        let p = s.evaluate(u)
        expect(p.x).to.eql(result.x)
        expect(p.y).to.eql(result.y)
    })

    
    it('can be safely cloned', () => {
        const cp0 = new Vector3d(-0.5, 0, 1)
        const cp1 = new Vector3d(0, 8, 1)
        const cp2 = new Vector3d(0.5, 0, 1)
        let s1 = new RationalBSplineR1toR2( [cp0, cp1, cp2], [ 0, 0, 0, 1, 1, 1])
        let s2 = s1.clone()
        let s3 = s2.moveControlPoints([new Vector3d(1, 0, 0), new Vector3d(0, 0, 0), new Vector3d(0, 0, 0)])
        expect(s3.controlPoints[0].x).to.equal(0.5)
        expect(s1.controlPoints[0].x).to.equal(-0.5)
    });

    
    /*
    it('can insert a new knot', () => {
        const cp0 = new Vector3d(-0.5, 0, 1)
        const cp1 = new Vector3d(0, 8, 1)
        const cp2 = new Vector3d(0.5, 0, 1)
        let s1 = new RationalBSplineR1toR2( [cp0, cp1, cp2], [ 0, 0, 0, 1, 1, 1] )
        let s2 = s1.clone()
        s2.insertKnot(0.5)
        s2.insertKnot(0.25)
        s2.insertKnot(0.75)
        expect(Math.abs(s2.evaluate(0.3).x - s1.evaluate(0.3).x)).to.be.below(10e-6)
        expect(Math.abs(s2.evaluate(0.3).y - s1.evaluate(0.3).y)).to.be.below(10e-6)
        expect(s2.knots).to.eql([0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1])

        const cp3 = new Vector3d(-0.5, 0, 1)
        const cp4 = new Vector3d(-0.25, 0.25, 1)
        const cp5 = new Vector3d(0.25, 0.25, 1)
        const cp6 = new Vector3d(0.5, 0, 1)
        const cp = [ cp3, cp4, cp5, cp6 ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let spline = new RationalBSplineR1toR2(cp, knots)
        let spline1 = spline.clone()
        spline1 = spline1.insertKnot(0.5)
        spline1 = spline1.insertKnot(0.25)
        spline1 = spline1.insertKnot(0.75)
        expect(Math.abs(spline.evaluate(0.3).x - spline1.evaluate(0.3).x)).to.be.below(10e-6)
        expect(Math.abs(spline.evaluate(0.3).y - spline1.evaluate(0.3).y)).to.be.below(10e-6)
        expect(spline1.knots).to.eql([0, 0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1, 1])

    })
    

    

    it('can return a section of a curve', () => {
        
        const cp0 = new Vector3d(-0.5, 0, 1)
        const cp1 = new Vector3d(0, 8, 1)
        const cp2 = new Vector3d(0.5, 0, 1)
        let s1 = new RationalBSplineR1toR2( [cp0, cp1, cp2], [ 0, 0, 0, 1, 1, 1] )
        let s2 = s1.extract(0.2, 0.5)
        let s3 = s1.extract(0, 1)
        
        expect(Math.abs(s1.evaluate(0.2).x - s2.evaluate(0.2).x)).to.be.below(10e-8)
        expect(Math.abs(s1.evaluate(0.2).y - s2.evaluate(0.2).y)).to.be.below(10e-8)
        
        expect(Math.abs(s1.evaluate(0.3).x - s2.evaluate(0.3).x)).to.be.below(10e-8)
        expect(Math.abs(s1.evaluate(0.3).y - s2.evaluate(0.3).y)).to.be.below(10e-8)

        expect(Math.abs(s1.evaluate(0.5).x - s2.evaluate(0.5).x)).to.be.below(10e-8)
        expect(Math.abs(s1.evaluate(0.5).y - s2.evaluate(0.5).y)).to.be.below(10e-8)

        expect(s2.knots.length).to.equal(6)
        expect(s3.knots.length).to.equal(6)

        expect(Math.abs(s1.evaluate(0.5).x - s3.evaluate(0.5).x)).to.be.below(10e-8)
        expect(Math.abs(s1.evaluate(0.5).y - s3.evaluate(0.5).y)).to.be.below(10e-8)
        
    });
    */
    

});