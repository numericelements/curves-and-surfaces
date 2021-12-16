import { expect } from 'chai';
import { BSplineR1toR1 } from '../../src/bsplines/BSplineR1toR1';

describe('BSplineR1toR1', () => {
    
    it('can be initialized without an initializer', () => {
        const s = new BSplineR1toR1();
        expect(s.controlPoints).to.deep.equal([0])
        expect(s.knots).to.deep.equal([0, 1])
    });
    
    it('can be initialized with an initializer', () => {
        const s = new BSplineR1toR1([ 1, 2, 3 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s.controlPoints).to.deep.equal([ 1, 2, 3])
        expect(s.knots).to.deep.equal([ 0, 0, 0, 1, 1, 1 ])
        expect(s.degree).to.equal(2)
    });

    it('produces an independent deep copy of its attributes during construction', () => {
        const s1 = new BSplineR1toR1([ 1, 2, 3 ], [ 0, 0, 0, 1, 1, 1 ])
        const s2 = new BSplineR1toR1(s1.controlPoints, s1.knots)
        s2.controlPoints = [3, 4, 5]
        s2.knots = [0, 1, 2, 3, 4, 5]
        expect(s1.controlPoints).to.deep.equal([ 1, 2, 3])
        expect(s1.knots).to.deep.equal([ 0, 0, 0, 1, 1, 1 ])
        expect(s1.degree).to.equal(2)
        expect(s2.controlPoints).to.deep.equal([ 3, 4, 5])
        expect(s2.knots).to.deep.equal([ 0, 1, 2, 3, 4, 5 ])
        expect(s2.degree).to.equal(2)
    });
    
    it('throws an exception at construction if the degree of the b-spline is negative', () => {
        expect(function() {const s = new BSplineR1toR1([ 1, 2, 3 ], [ 0, 0, 1 ])}).to.throw()
    });

    it('returns a deep copy of its attributes', () => {
        const s1 = new BSplineR1toR1([ 1, 2, 3 ], [ 0, 0, 0, 1, 1, 1 ])
        let cp = s1.controlPoints
        let knots = s1.knots
        cp[1] = 5
        knots[2] = 8
        expect(s1.controlPoints).to.deep.equal([ 1, 2, 3])
        expect(s1.knots).to.deep.equal([ 0, 0, 0, 1, 1, 1 ])
        expect(s1.degree).to.equal(2)
    });

    it('can be used to evaluate a Bernstein polynomial', () => {
        const u = 0.22
        const a = 1.1
        const b = 3.2
        const c = 6.3
        const b02 = Math.pow(1-u, 2)
        const b12 = 2*u*(1-u)
        const b22 = Math.pow(u, 2)
        const s = new  BSplineR1toR1([ a, b, c ], [ 0, 0, 0, 1, 1, 1 ])
        expect(a*b02+b*b12+c*b22).to.equal(s.evaluate(u))
    });

    it('can evaluate its zeros', () => {

        
        const s1 = new  BSplineR1toR1([ -1, 0, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        let zeros = s1.zeros()
        expect(zeros.length).to.equal(1)
        expect(zeros[0]).to.be.closeTo(0.5, 10e-8)
        

        
        const s2 = new  BSplineR1toR1([0, 0, 1], [ 0, 0, 0, 1, 1, 1])
        expect(s2.zeros().length).to.equal(1)
        expect(s2.zeros()[0]).to.be.closeTo(0.0, 10e-6)
        
        
        const s3 = new  BSplineR1toR1([1, 0, 0], [ 0, 0, 0, 1, 1, 1])
        expect(s3.zeros().length).to.equal(1)
        expect(s3.zeros()[0]).to.be.closeTo(1.0, 10e-6)
        
        
        
        const s4 = new  BSplineR1toR1([0, 1, 0], [ 0, 0, 0, 1, 1, 1])
        expect(s4.zeros().length).to.equal(2)
        expect(s4.zeros()[0]).to.be.closeTo(0.0, 10e-6)
        expect(s4.zeros()[1]).to.be.closeTo(1.0, 10e-6)
        

        

        const s5 = new  BSplineR1toR1([-0.5, 0.5, -0.5], [ 0, 0, 0, 1, 1, 1])
        expect(s5.zeros().length).to.equal(2)
        expect(s5.zeros()[0]).to.be.closeTo(0.5, 10e-6)
        expect(s5.zeros()[1]).to.be.closeTo(0.5, 10e-6)

        const s6 = new  BSplineR1toR1([-0.5, -0.5, 0.5], [ 0, 0, 0, 1, 1, 1])
        expect(s6.zeros().length).to.equal(1)
        expect(s6.zeros()[0]).to.be.closeTo(Math.sqrt(2)/2, 10e-6)

        

        
    });

    it('can compute the number of sign changes of its control polygon', () => {
        const s1 = new  BSplineR1toR1([ -1, 0, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s1.controlPolygonNumberOfSignChanges()).to.equal(2)

        const s2 = new  BSplineR1toR1([ -1, 0.1, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s2.controlPolygonNumberOfSignChanges()).to.equal(1)

        const s3 = new  BSplineR1toR1([ -1, 0.1, 1, -2 ], [ 0, 0, 0, 0.5, 1, 1, 1 ])
        expect(s3.controlPolygonNumberOfSignChanges()).to.equal(2)
    });

    it('can compute the zeros of the control polygon', () => {
        const s1 = new  BSplineR1toR1([ -1, 1, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s1.controlPolygonZeros().length).to.equal(1)
        expect(s1.controlPolygonZeros()[0]).to.be.closeTo(0.25, 10e-8)
    });

    it('can produce a curve', () => {
        const s1 = new  BSplineR1toR1([ -1, 1, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        const c1 = s1.curve()
        expect(c1.controlPoints[0].x).to.equal(0)
        expect(c1.controlPoints[0].y).to.equal(-1)
        expect(c1.controlPoints[1].x).to.equal(0.5)
        expect(c1.controlPoints[1].y).to.equal(1)
        expect(c1.controlPoints[2].x).to.equal(1)
        expect(c1.controlPoints[2].y).to.equal(1)
    });

    it('can compute its Greville abscissae', () => {
        const s1 = new  BSplineR1toR1([ 1, 1, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        const c1 = s1.grevilleAbscissae()
        expect(c1).to.deep.equal([0, 0.5, 1])

        const s2 = new  BSplineR1toR1([ 1, 1, 1, 1, 1, 1 ], [ 0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1 ])
        const c2 = s2.grevilleAbscissae()
        expect(c2).to.deep.equal([0, 0.25, 0.5, 0.5, 0.75, 1])
 
    });



});