 import { expect } from 'chai';
 import { BSpline_R1_to_R2 } from '../src/bsplines/BSpline_R1_to_R2';
 import { create_BSpline_R1_to_R2 } from '../src/bsplines/BSpline_R1_to_R2';
 import { Vector_2d } from '../src/mathematics/Vector_2d';

 describe('BSpline_R1_to_R2', () => {
    
    it('can be initialized without an initializer', () => {
        const s = new BSpline_R1_to_R2();
        expect(s.controlPoints[0]).to.eql(new Vector_2d(0, 0))
        expect(s.knots).to.eql([0, 1])
    });
    
    it('can be initialized with an initializer', () => {
        const cp0 = new Vector_2d(-0.5, 0)
        const cp1 = new Vector_2d(0, 8)
        const cp2 = new Vector_2d(0.5, 0)

        const s = new BSpline_R1_to_R2([ cp0, cp1, cp2 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s.controlPoints).to.eql([ cp0, cp1, cp2 ])
        expect(s.knots).to.eql([ 0, 0, 0, 1, 1, 1 ])
        expect(s.degree).to.equal(2)
    });

    it('can be created by the factory function create_BSpline_R1_to_R2', () => {
        const cp0 = new Vector_2d(-0.5, 0)
        const cp1 = new Vector_2d(0, 8)
        const cp2 = new Vector_2d(0.5, 0)
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        //const s = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1])
        const s = create_BSpline_R1_to_R2( [cp0, cp1, cp2], [ 0, 0, 0, 1, 1, 1])
        expect(s.controlPoints).to.eql([ cp0, cp1, cp2 ])
        expect(s.knots).to.eql([ 0, 0, 0, 1, 1, 1 ])
        expect(s.degree).to.equal(2)
    });
    
    it('throws an exception at construction if the degree of the b-spline is negative', () => {
        const cp0 = new Vector_2d(-0.5, 0)
        const cp1 = new Vector_2d(0, 8)
        const cp2 = new Vector_2d(0.5, 0)
        expect(function() {const s = new BSpline_R1_to_R2([ cp0, cp1, cp2 ], [ 0, 0, 1 ])}).to.throw()
    });

    it('can be used to evaluate a Bezier curve', () => {
        const u = 0.22
        const cp0 = new Vector_2d(-0.5, 0)
        const cp1 = new Vector_2d(0, 8)
        const cp2 = new Vector_2d(0.5, 0)
        const b02 = Math.pow(1-u, 2)
        const b12 = 2*u*(1-u)
        const b22 = Math.pow(u, 2)
        const s = new  BSpline_R1_to_R2([ cp0, cp1, cp2 ], [ 0, 0, 0, 1, 1, 1 ])
        const result = ( cp0.multiply(b02) ).add( cp1.multiply(b12) ).add( cp2.multiply(b22) )
        expect(s.evaluate(u)).to.eql(result)
    });

    it('can be safely cloned', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector_2d(-0.5, 0)
        const cp1 = new Vector_2d(0, 8)
        const cp2 = new Vector_2d(0.5, 0)
        let s1 = create_BSpline_R1_to_R2( [cp0, cp1, cp2], [ 0, 0, 0, 1, 1, 1])
        //let s1 = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1])
        let s2 = s1.clone()
        s2.optimizerStep([1, 0, 0, 0, 0, 0])
        expect(s2.controlPoints[0].x).to.equal(0.5)
        expect(s1.controlPoints[0].x).to.equal(-0.5)
    });

    it('can insert a new knot', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector_2d(-0.5, 0)
        const cp1 = new Vector_2d(0, 8)
        const cp2 = new Vector_2d(0.5, 0)
        let s1 = create_BSpline_R1_to_R2( [cp0, cp1, cp2], [ 0, 0, 0, 1, 1, 1] )
        //let s1 = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1] )
        let s2 = s1.clone()
        s2.insertKnot(0.5)
        s2.insertKnot(0.25)
        s2.insertKnot(0.75)
        expect(Math.abs(s2.evaluate(0.3).x - s1.evaluate(0.3).x)).to.be.below(10e-6)
        expect(Math.abs(s2.evaluate(0.3).y - s1.evaluate(0.3).y)).to.be.below(10e-6)
        expect(s2.knots).to.eql([0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1])

        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp3 = new Vector_2d(-0.5, 0)
        const cp4 = new Vector_2d(-0.25, 0.25)
        const cp5 = new Vector_2d(0.25, 0.25)
        const cp6 = new Vector_2d(0.5, 0)
        const cp = [ cp3, cp4, cp5, cp6 ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let spline = create_BSpline_R1_to_R2(cp, knots)
        let spline1 = spline.clone()
        spline1.insertKnot(0.5)
        spline1.insertKnot(0.25)
        spline1.insertKnot(0.75)
        expect(Math.abs(spline.evaluate(0.3).x - spline1.evaluate(0.3).x)).to.be.below(10e-6)
        expect(Math.abs(spline.evaluate(0.3).y - spline1.evaluate(0.3).y)).to.be.below(10e-6)
        expect(spline1.knots).to.eql([0, 0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1, 1])

    });

    it('can return a section of a curve', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector_2d(-0.5, 0)
        const cp1 = new Vector_2d(0, 8)
        const cp2 = new Vector_2d(0.5, 0)
        let s1 = create_BSpline_R1_to_R2( [cp0, cp1, cp2], [ 0, 0, 0, 1, 1, 1] )
        //let s1 = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1] )
        let s2 = s1.section(0.2, 0.5)
        let s3 = s1.section(0, 1)

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


 });