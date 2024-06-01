import { expect } from 'chai';
import { BSplineR1toR2 } from '../../src/newBsplines/BSplineR1toR2';
import { create_BSplineR1toR2V2d } from '../../src/newBsplines/BSplineR1toR2';
import { Vector2d } from '../../src/mathVector/Vector2d';
import { curveSegment } from '../../src/newBsplines/AbstractBSplineR1toR2';
import { TOL_COMPARISON_PT_CRV_BSPL_R1TOR1 } from './BSplineR1toR1';
import { KnotIndexIncreasingSequence } from '../../src/newBsplines/Knot';

export const TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2 = 1e-10

describe('BSplineR1toR2', () => {
    
    it('can be initialized without an initializer', () => {
        const s = new BSplineR1toR2();
        expect(s.controlPoints[0]).to.eql(new Vector2d(0, 0))
        expect(s.knots).to.eql([0, 1])
    });
    
    it('can be initialized with an initializer', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)

        const s = new BSplineR1toR2([ cp0, cp1, cp2 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s.controlPoints).to.eql([ cp0, cp1, cp2 ])
        expect(s.knots).to.eql([ 0, 0, 0, 1, 1, 1 ])
        expect(s.degree).to.equal(2)
    });

    it('can be created by the factory function create_BSpline_R1_to_R2', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        //const s = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1])
        const s = create_BSplineR1toR2V2d( [cp0, cp1, cp2], [ 0, 0, 0, 1, 1, 1])
        expect(s.controlPoints).to.eql([ cp0, cp1, cp2 ])
        expect(s.knots).to.eql([ 0, 0, 0, 1, 1, 1 ])
        expect(s.degree).to.equal(2)
    });
    
    it('throws an exception at construction if the degree of the b-spline is negative', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const s = new BSplineR1toR2([ cp0, cp1, cp2 ], [ 0, 0, 1 ])
        expect(s.degree).to.equal(-1)
        // error is thrown by ErrorLog class
        // expect(function() {const s = new BSplineR1toR2([ cp0, cp1, cp2 ], [ 0, 0, 1 ])}).to.throw()
    });

    it('can be used to evaluate a Bezier curve', () => {
        const u = 0.22
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const b02 = Math.pow(1-u, 2)
        const b12 = 2*u*(1-u)
        const b22 = Math.pow(u, 2)
        const s = new  BSplineR1toR2([ cp0, cp1, cp2 ], [ 0, 0, 0, 1, 1, 1 ])
        const result = ( cp0.multiply(b02) ).add( cp1.multiply(b12) ).add( cp2.multiply(b22) )
        expect(s.evaluate(u)).to.eql(result)
    });

    it('can be safely cloned', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        let s1 = create_BSplineR1toR2V2d( [cp0, cp1, cp2], [ 0, 0, 0, 1, 1, 1])
        //let s1 = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1])
        let s2 = s1.clone()
        s2.optimizerStep([1, 0, 0, 0, 0, 0])
        expect(s2.controlPoints[0].x).to.equal(0.5)
        expect(s1.controlPoints[0].x).to.equal(-0.5)
    });

    it('can insert a new knot', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const s1 = create_BSplineR1toR2V2d( [cp0, cp1, cp2], [ 0, 0, 0, 1, 1, 1] )
        //let s1 = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1] )
        const s2 = s1.clone()
        s2.insertKnot(0.5)
        s2.insertKnot(0.25)
        s2.insertKnot(0.75)
        expect(Math.abs(s2.evaluate(0.3).x - s1.evaluate(0.3).x)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(Math.abs(s2.evaluate(0.3).y - s1.evaluate(0.3).y)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(s2.knots).to.eql([0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1])

        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp3 = new Vector2d(-0.5, 0)
        const cp4 = new Vector2d(-0.25, 0.25)
        const cp5 = new Vector2d(0.25, 0.25)
        const cp6 = new Vector2d(0.5, 0)
        const cp = [ cp3, cp4, cp5, cp6 ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        const spline = create_BSplineR1toR2V2d(cp, knots)
        const spline1 = spline.clone()
        spline1.insertKnot(0.5)
        spline1.insertKnot(0.25)
        spline1.insertKnot(0.75)
        expect(Math.abs(spline.evaluate(0.3).x - spline1.evaluate(0.3).x)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(Math.abs(spline.evaluate(0.3).y - spline1.evaluate(0.3).y)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(spline1.knots).to.eql([0, 0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1, 1])
    });

    it('can insert a new knot with multiplicity greater than one', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const cp3 = new Vector2d(1.0, -2)
        let s1 = create_BSplineR1toR2V2d( [cp0, cp1, cp2, cp3], [ 0, 0, 0, 0, 1, 1, 1, 1] )
        //let s1 = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1] )
        let s2 = s1.clone()
        s2.insertKnot(0.5, 2);
        expect(s2.knots).to.eql([0, 0, 0, 0, 0.5, 0.5, 1, 1, 1, 1])
        expect(Math.abs(s1.evaluate(0.5).x - s2.evaluate(0.5).x)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(Math.abs(s1.evaluate(0.5).y - s2.evaluate(0.5).y)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
    });

    it('can return a section of a curve', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        let s1 = create_BSplineR1toR2V2d( [cp0, cp1, cp2], [ 0, 0, 0, 1, 1, 1] )
        //let s1 = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1] )
        let s2 = s1.extract(0.2, 0.5)
        let s3 = s1.extract(0, 1)
        const offset = 0.2;
        expect(s2.increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(0))).to.eql(0.0);
        expect(Math.abs(s1.evaluate(0.2).x - s2.evaluate(0.2 - offset).x)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(Math.abs(s1.evaluate(0.2).y - s2.evaluate(0.2 - offset).y)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)

        expect(Math.abs(s1.evaluate(0.3).x - s2.evaluate(0.3 - offset).x)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(Math.abs(s1.evaluate(0.3).y - s2.evaluate(0.3 - offset).y)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)

        expect(Math.abs(s1.evaluate(0.5).x - s2.evaluate(0.5 - offset).x)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(Math.abs(s1.evaluate(0.5).y - s2.evaluate(0.5 - offset).y)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)

        expect(s2.knots.length).to.equal(6)
        expect(s3.knots.length).to.equal(6)

        expect(Math.abs(s1.evaluate(0.5).x - s3.evaluate(0.5).x)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(Math.abs(s1.evaluate(0.5).y - s3.evaluate(0.5).y)).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)

    });

    it('extends a curve with intermediate knots on its left hand side. Check new knot sequence ', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const cp3 = new Vector2d(1.0, 1.0)
        const cp4 = new Vector2d(1.5, 3.0)
        const s1 = create_BSplineR1toR2V2d( [cp0, cp1, cp2, cp3, cp4], [ 0, 0, 0, 0, 0.6666666, 1, 1, 1, 1] )
        const s2 = s1.extend(-0.01);
        expect(s2.knots).to.eql([0, 0, 0, 0, 0.6766666, 1.01, 1.01, 1.01, 1.01])
    })

    it('extends a curve with intermediate knots on its right hand side. Check new knot sequence ', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const cp3 = new Vector2d(1.0, 1.0)
        const cp4 = new Vector2d(1.5, 3.0)
        const s1 = create_BSplineR1toR2V2d( [cp0, cp1, cp2, cp3, cp4], [ 0, 0, 0, 0, 0.6666666, 1, 1, 1, 1] )
        const s2 = s1.extend(1.01);
        expect(s2.knots, 'knot sequence: ').to.eql([0, 0, 0, 0, 0.6666666, 1.01, 1.01, 1.01, 1.01])
    })

    it('split a curve without intermediate knots on its right hand side. Check new knot sequence ', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const cp3 = new Vector2d(1.0, 1.0)
        const s1 = create_BSplineR1toR2V2d( [cp0, cp1, cp2, cp3], [ 0, 0, 0, 0, 1, 1, 1, 1] )
        const s2 = s1.splitAt(0.01, curveSegment.AFTER);
        expect(s2.controlPoints.length).to.eql(4)
        expect(s2.knots, 'knot sequence: ').to.eql([0, 0, 0, 0, 0.99, 0.99, 0.99, 0.99])
    })

    it('split a curve with intermediate knots on its right hand side. Check new knot sequence ', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const cp3 = new Vector2d(1.0, 1.0)
        const cp4 = new Vector2d(1.5, 3.0)
        const s1 = create_BSplineR1toR2V2d( [cp0, cp1, cp2, cp3, cp4], [ 0, 0, 0, 0, 0.6666666, 1, 1, 1, 1] )
        const sInsKnot = s1.clone();
        sInsKnot.insertKnot(0.01, sInsKnot.degree + 1);
        expect(sInsKnot.knots).to.eql([0, 0, 0, 0, 0.01, 0.01, 0.01, 0.01, 0.6666666, 1, 1, 1, 1])
        const s2 = s1.splitAt(0.01, curveSegment.AFTER);
        expect(s2.controlPoints.length).to.eql(5)
        expect(s2.knots, 'knot sequence: ').to.eql([0, 0, 0, 0, 0.6566666, 0.99, 0.99, 0.99, 0.99])
    })

    it('split a curve with intermediate knots on its left hand side. Check new knot sequence ', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const cp3 = new Vector2d(1.0, 1.0)
        const cp4 = new Vector2d(1.5, 3.0)
        const s1 = create_BSplineR1toR2V2d( [cp0, cp1, cp2, cp3, cp4], [ 0, 0, 0, 0, 0.6666666, 1, 1, 1, 1] )
        const sInsKnot = s1.clone();
        sInsKnot.insertKnot(0.8, sInsKnot.degree + 1);
        expect(sInsKnot.knots).to.eql([0, 0, 0, 0, 0.6666666, 0.8, 0.8, 0.8, 0.8, 1, 1, 1, 1])
        const s2 = s1.splitAt(0.8, curveSegment.AFTER);
        expect(s2.controlPoints.length).to.eql(4)
        expect(s2.knots[0], 'knot : ').to.eql(0);
        expect(s2.knots[1], 'knot : ').to.eql(0);
        expect(s2.knots[2], 'knot : ').to.eql(0);
        expect(s2.knots[3], 'knot : ').to.eql(0);
        expect(s2.knots[4], 'knot : ').to.be.closeTo(0.2, 1.0e-10);
        expect(s2.knots[5], 'knot : ').to.be.closeTo(0.2, 1.0e-10);
        expect(s2.knots[6], 'knot : ').to.be.closeTo(0.2, 1.0e-10);
        expect(s2.knots[7], 'knot : ').to.be.closeTo(0.2, 1.0e-10);
    })

    it('split a curve without intermediate knots on its right hand side. Check new knot sequence ', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const cp3 = new Vector2d(1.0, 1.0)
        const s1 = create_BSplineR1toR2V2d( [cp0, cp1, cp2, cp3], [ 0, 0, 0, 0, 1, 1, 1, 1] )
        const s2 = s1.splitAt(0.1, curveSegment.BEFORE);
        expect(s2.controlPoints.length).to.eql(4)
        expect(s2.knots, 'knot sequence: ').to.eql([0, 0, 0, 0, 0.1, 0.1, 0.1, 0.1])
    })

    it('split a curve with intermediate knots on its right hand side. Check new knot sequence ', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const cp3 = new Vector2d(1.0, 1.0)
        const cp4 = new Vector2d(1.5, 3.0)
        const s1 = create_BSplineR1toR2V2d( [cp0, cp1, cp2, cp3, cp4], [ 0, 0, 0, 0, 0.6666666, 1, 1, 1, 1] )
        const sInsKnot = s1.clone();
        sInsKnot.insertKnot(0.5, sInsKnot.degree + 1);
        expect(sInsKnot.knots).to.eql([0, 0, 0, 0, 0.5, 0.5, 0.5, 0.5, 0.6666666, 1, 1, 1, 1])
        const s2 = s1.splitAt(0.5, curveSegment.BEFORE);
        expect(s2.controlPoints.length).to.eql(4)
        expect(s2.knots, 'knot sequence: ').to.eql([0, 0, 0, 0, 0.5, 0.5, 0.5, 0.5])
    })

    it('split a curve with intermediate knots on its left hand side. Check new knot sequence ', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const cp3 = new Vector2d(1.0, 1.0)
        const cp4 = new Vector2d(1.5, 3.0)
        const s1 = create_BSplineR1toR2V2d( [cp0, cp1, cp2, cp3, cp4], [ 0, 0, 0, 0, 0.6666666, 1, 1, 1, 1] )
        const sInsKnot = s1.clone();
        sInsKnot.insertKnot(0.8, sInsKnot.degree + 1);
        expect(sInsKnot.knots).to.eql([0, 0, 0, 0, 0.6666666, 0.8, 0.8, 0.8, 0.8, 1, 1, 1, 1])
        const s2 = s1.splitAt(0.8, curveSegment.BEFORE);
        expect(s2.controlPoints.length).to.eql(5)
        expect(s2.knots, 'knot sequence: ').to.eql([0, 0, 0, 0, 0.6666666, 0.8, 0.8, 0.8, 0.8])
    })

    it('can increment the curve degree of a non uniform B-spline without intermediate knots', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const cp3 = new Vector2d(1.0, 1.0)
        const s1 = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1])
        const sInc = s1.degreeIncrement();
        expect(sInc.degree).to.eql(4)
        expect(sInc.knots).to.eql([ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1])
        const cpSolutionX = [-0.5, -0.125, 0.25, 0.625, 1];
        const cpSolutionY = [0, 6, 4, 0.25, 1];
        for(let i = 0; i < sInc.controlPoints.length; i++) {
            expect(sInc.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(sInc.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
    })

    it('can increment the curve degree of a non uniform B-spline with arbitrary knot sequence', () => {
        const cp0 = new Vector2d(0, 1)
        const cp1 = new Vector2d(1, 1)
        const cp2 = new Vector2d(2, 1)
        const cp3 = new Vector2d(3, 1)
        const cp4 = new Vector2d(4, 1)
        const s1 = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4], [ 0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        const sInc = s1.degreeIncrement();
        expect(sInc.degree).to.eql(4)
        expect(sInc.knots).to.eql([ 0, 0, 0, 0, 0, 0.5, 0.5, 1, 1, 1, 1, 1])
        const cpSolutionX = [0, 0.75, 1.25, 2, 2.75, 3.25, 4];
        const cpSolutionY = [1, 1, 1, 1, 1, 1, 1];
        for(let i = 0; i < sInc.controlPoints.length; i++) {
            expect(sInc.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(sInc.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
    })

    it('can increment the curve degree of a non uniform B-spline v2', () => {
        const cp0 = new Vector2d(0, 1)
        const cp1 = new Vector2d(1, 1)
        const cp2 = new Vector2d(2, 1)
        const cp3 = new Vector2d(3, 1)
        const s1 = new BSplineR1toR2([ cp0, cp1, cp2, cp3], [ 0, 0, 0, 1, 2, 2, 2])
        const sInc = s1.degreeIncrement();
        expect(sInc.degree).to.eql(3)
        expect(sInc.knots).to.eql([ 0, 0, 0, 0, 1, 1, 2, 2, 2, 2])
        const cpSolutionX = [0, 0.666666666666666, 1.166666666666666, 1.833333333333333, 2.3333333333333333, 3];
        const cpSolutionY = [1, 1, 1, 1, 1, 1];
        for(let i = 0; i < sInc.controlPoints.length; i++) {
            expect(sInc.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(sInc.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
    })

 });