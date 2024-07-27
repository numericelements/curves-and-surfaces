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

    it('can generate the intermediate splines required to increment the degree of a non uniform B-spline without intermediate knots', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(0, 8)
        const cp2 = new Vector2d(0.5, 0)
        const cp3 = new Vector2d(1.0, 1.0)
        const s1 = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1])
        const intermSplines = s1.generateIntermediateSplinesForDegreeElevation();
        expect(intermSplines.knotVectors.length).to.eql(4)
        expect(intermSplines.CPs.length).to.eql(4)
        for(let i = 0; i < s1.degree; i++) {
            expect(intermSplines.knotVectors[i]).to.eql([ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1])
        }
        expect(intermSplines.CPs[0].length).to.eql(5)
        expect(intermSplines.CPs[0]).to.eql([cp0, cp0, cp1, cp2, cp3])
        expect(intermSplines.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3])
        expect(intermSplines.CPs[2]).to.eql([cp0, cp1, cp2, cp2, cp3])
        expect(intermSplines.CPs[3]).to.eql([cp0, cp1, cp2, cp3, cp3])
    })

    it('can generate the intermediate splines required to increment the degree of a non uniform B-spline with intermediate knots', () => {
        const cp0 = new Vector2d(0, 1)
        const cp1 = new Vector2d(1, 1)
        const cp2 = new Vector2d(2, 1)
        const cp3 = new Vector2d(3, 1)
        const cp4 = new Vector2d(4, 1)
        const s1 = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4], [ 0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        const intermSplines = s1.generateIntermediateSplinesForDegreeElevation();
        expect(intermSplines.knotVectors.length).to.eql(4)
        expect(intermSplines.CPs.length).to.eql(4)
        expect(intermSplines.knotVectors[0]).to.eql([ 0, 0, 0, 0, 0, 0.5, 0.5, 1, 1, 1, 1, 1])
        expect(intermSplines.knotVectors[1]).to.eql([ 0, 0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1])
        expect(intermSplines.knotVectors[2]).to.eql([ 0, 0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1])
        expect(intermSplines.knotVectors[3]).to.eql([ 0, 0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1])
        expect(intermSplines.CPs[0].length).to.eql(7)
        expect(intermSplines.CPs[0]).to.eql([cp0, cp0, cp1, cp2, cp3, cp4, cp4])
        expect(intermSplines.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp4])
        expect(intermSplines.CPs[2]).to.eql([cp0, cp1, cp2, cp2, cp3, cp4])
        expect(intermSplines.CPs[3]).to.eql([cp0, cp1, cp2, cp3, cp3, cp4])
    })

    it('can generate the intermediate splines required to increment the degree of a non uniform B-spline with intermediate knots with multiplicity greater than 1', () => {
        const cp0 = new Vector2d(0, 1)
        const cp1 = new Vector2d(1, 1)
        const cp2 = new Vector2d(2, 1)
        const cp3 = new Vector2d(3, 1)
        const cp4 = new Vector2d(4, 1)
        const s1 = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4], [ 0, 0, 0, 0.5, 0.5, 1, 1, 1])
        const intermSplines = s1.generateIntermediateSplinesForDegreeElevation();
        expect(intermSplines.knotVectors.length).to.eql(3)
        expect(intermSplines.CPs.length).to.eql(3)
        expect(intermSplines.knotVectors[0]).to.eql([ 0, 0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1, 1])
        expect(intermSplines.knotVectors[1]).to.eql([ 0, 0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1, 1])
        expect(intermSplines.knotVectors[2]).to.eql([ 0, 0, 0, 0, 0.5, 0.5, 1, 1, 1, 1])
        expect(intermSplines.CPs[0].length).to.eql(7)
        expect(intermSplines.CPs[0]).to.eql([cp0, cp0, cp1, cp2, cp3, cp3, cp4])
        expect(intermSplines.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp4, cp4])
        expect(intermSplines.CPs[2]).to.eql([cp0, cp1, cp2, cp2, cp3, cp4])
    })

    it('can insert a knot using Boehm algorithm with comparison with insertKnot method', () => {
        // rectangular control polygon
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(0, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, 0)
        const cp4 = new Vector2d(1, -1)
        const cp5 = new Vector2d(0, -1)
        const cp6 = new Vector2d(0, 0)
        const knots = [0, 0, 1, 2, 3, 4, 5, 6, 6]
        const s = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots)
        const sp = s.clone()
        expect(s?.controlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5, cp6])
        expect(s?.degree).to.eql(1)
        expect(s?.evaluate(4)).to.eql(cp4)
        s?.insertKnotBoehmAlgorithm(4);
        expect(s?.controlPoints.length).to.eql(8)
        expect(s?.controlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp4, cp5, cp6])
        expect(s?.knots.length).to.eql(10)
        expect(s?.knots).to.eql([0, 0, 1, 2, 3, 4, 4, 5, 6, 6])
        expect(s?.evaluate(4)).to.eql(cp4)
        sp.insertKnot(4)
        expect(s.knots).to.eql(sp.knots)
        expect(s.controlPoints).to.eql(sp.controlPoints)

        const knots1 = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5]
        const sp1 = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots1)
        const sp2 = sp1.clone()
        expect(sp1?.degree).to.eql(2)
        expect(sp1?.evaluate(4)).to.eql(new Vector2d(0.5, -1))
        sp1?.insertKnotBoehmAlgorithm(4);
        expect(sp1?.knots.length).to.eql(11)
        expect(sp1?.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 5, 5, 5])
        expect(sp1?.controlPoints.length).to.eql(8)
        expect(sp1?.controlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, new Vector2d(0.5, -1), cp5, cp6])
        sp2.insertKnot(4)
        expect(sp1.knots).to.eql(sp2.knots)
        expect(sp1.controlPoints).to.eql(sp2.controlPoints)

        const knots2 = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5]
        const sp3 = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots2)
        const sp4 = sp3.clone()
        expect(sp3?.evaluate(3)).to.eql(new Vector2d(1, -0.5))
        sp3?.insertKnotBoehmAlgorithm(3);
        expect(sp3?.knots.length).to.eql(11)
        expect(sp3?.knots).to.eql([0, 0, 0, 1, 2, 3, 3, 4, 5, 5, 5])
        expect(sp3?.controlPoints.length).to.eql(8)
        expect(sp3?.controlPoints).to.eql([ cp0, cp1, cp2, cp3, new Vector2d(1, -0.5), cp4, cp5, cp6])
        sp4.insertKnot(3)
        expect(sp3.knots).to.eql(sp4.knots)
        expect(sp3.controlPoints).to.eql(sp4.controlPoints)

        const knots3 = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5]
        const sp5 = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots3)
        const sp6 = sp5.clone()
        expect(sp5?.evaluate(2)).to.eql(new Vector2d(1, 0.5))
        sp5?.insertKnotBoehmAlgorithm(2);
        expect(sp5?.knots.length).to.eql(11)
        expect(sp5?.knots).to.eql([0, 0, 0, 1, 2, 2, 3, 4, 5, 5, 5])
        expect(sp5?.controlPoints.length).to.eql(8)
        expect(sp5?.controlPoints).to.eql([ cp0, cp1, cp2, new Vector2d(1, 0.5), cp3, cp4, cp5, cp6])
        sp6.insertKnot(2)
        expect(sp5.knots).to.eql(sp6.knots)
        expect(sp5.controlPoints).to.eql(sp6.controlPoints)

        const knots4 = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5]
        const sp7 = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots4)
        const sp8 = sp7.clone()
        expect(sp7?.evaluate(1)).to.eql(new Vector2d(0.5, 1))
        sp7?.insertKnotBoehmAlgorithm(1);
        expect(sp7?.knots.length).to.eql(11)
        expect(sp7?.knots).to.eql([0, 0, 0, 1, 1, 2, 3, 4, 5, 5, 5])
        expect(sp7?.controlPoints.length).to.eql(8)
        expect(sp7?.controlPoints).to.eql([ cp0, cp1, new Vector2d(0.5, 1), cp2, cp3, cp4, cp5, cp6])
        sp8.insertKnot(1)
        expect(sp7.knots).to.eql(sp8.knots)
        expect(sp7.controlPoints).to.eql(sp8.controlPoints)

        const knots5 = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5]
        const sp9 = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots5)
        const sp10 = sp9.clone()
        expect(sp9?.evaluate(3.5)).to.eql(new Vector2d(0.875, -0.875))
        sp9?.insertKnotBoehmAlgorithm(3.5);
        expect(sp9?.knots.length).to.eql(11)
        expect(sp9?.knots).to.eql([0, 0, 0, 1, 2, 3, 3.5, 4, 5, 5, 5])
        expect(sp9?.controlPoints.length).to.eql(8)
        expect(sp9?.controlPoints).to.eql([ cp0, cp1, cp2, cp3, new Vector2d(1, -0.75), new Vector2d(0.75, -1), cp5, cp6])
        sp10.insertKnot(3.5)
        expect(sp9.knots).to.eql(sp10.knots)
        expect(sp9.controlPoints).to.eql(sp10.controlPoints)
    })

    it('can insert a knot into a non uniform B-spline with arbitrary knot sequence using Boehm algorithm', () => {
        const cp0 = new Vector2d(0, 1)
        const cp1 = new Vector2d(1, 1)
        const cp2 = new Vector2d(2, 1)
        const cp3 = new Vector2d(3, 1)
        const cp4 = new Vector2d(4, 1)
        const s1 = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4], [ 0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        s1.insertKnotBoehmAlgorithm(0.5);
        expect(s1.degree).to.eql(3)
        expect(s1.knots).to.eql([ 0, 0, 0, 0, 0.5, 0.5, 1, 1, 1, 1])
        const cpSolutionX = [0, 1, 1.5, 2.5, 3, 4];
        const cpSolutionY = [1, 1, 1, 1, 1, 1];
        for(let i = 0; i < s1.controlPoints.length; i++) {
            expect(s1.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(s1.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
    })

    it('can insert a knot into a uniform B-spline with arbitrary knot sequence using Boehm algorithm', () => {
        const cp0 = new Vector2d(0, 1)
        const cp1 = new Vector2d(1, 1)
        const cp2 = new Vector2d(2, 1)
        const cp3 = new Vector2d(3, 1)
        const cp4 = new Vector2d(4, 1)
        const s1 = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4], [ 0, 1, 2, 3, 3.5, 4, 5, 6, 7])
        expect(s1.findSpanBoehmAlgorithm(3).knotIndex).to.eql(3)
        s1.insertKnotBoehmAlgorithm(3);
        expect(s1.degree).to.eql(3)
        expect(s1.knots).to.eql([ 0, 1, 2, 3, 3, 3.5, 4, 5, 6, 7])
        const cpSolutionX = [0, 0.8, 1.5, 2, 3, 4];
        const cpSolutionY = [1, 1, 1, 1, 1, 1];
        for(let i = 0; i < s1.controlPoints.length; i++) {
            expect(s1.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(s1.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
        expect(s1.findSpanBoehmAlgorithm(3).knotIndex).to.eql(4)
        s1.insertKnotBoehmAlgorithm(3);
        expect(s1.knots).to.eql([ 0, 1, 2, 3, 3, 3, 3.5, 4, 5, 6, 7])
        const cpSolutionX1 = [0, 0.8, 1.2666666666666, 1.5, 2, 3, 4];
        const cpSolutionY1 = [1, 1, 1, 1, 1, 1, 1];
        for(let i = 0; i < s1.controlPoints.length; i++) {
            expect(s1.controlPoints[i].x).to.be.closeTo(cpSolutionX1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(s1.controlPoints[i].y).to.be.closeTo(cpSolutionY1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
    })

    it('can insert knots repeatedly into a cubic B-spline using Boehm algorithm (knot on symmetry axis) (for comparison with periodic B-Splines', () => {
        const cp0 = new Vector2d(-1, 0)
        const cp1 = new Vector2d(-1, 1)
        const cp2 = new Vector2d(-1, 2)
        const cp3 = new Vector2d(0, 2)
        const cp4 = new Vector2d(1, 2)
        const cp5 = new Vector2d(1, 1)
        const cp6 = new Vector2d(1, 0)
        const spl = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6], [ 0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 4])
        const spl1 = spl.clone()
        expect(spl.degree).to.eql(3)
        expect(spl.knots).to.eql([ 0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 4])
        expect(spl.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl.evaluate(2).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        spl.insertKnotBoehmAlgorithm(2);
        expect(spl.knots).to.eql([ 0, 0, 0, 0, 1, 2, 2, 3, 4, 4, 4, 4])
        expect(spl.controlPoints.length).to.eql(8)
        expect(spl.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl.evaluate(2).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        let cpSolutionX = [-1, -1, -1, -0.333333333333, 0.333333333333, 1, 1, 1];
        let cpSolutionY = [0, 1, 2, 2, 2, 2, 1, 0];
        for(let i = 0; i < spl.controlPoints.length; i++) {
            expect(spl.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(spl.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
        spl.insertKnotBoehmAlgorithm(2);
        expect(spl.knots).to.eql([ 0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 4, 4, 4])
        expect(spl.controlPoints.length).to.eql(9)
        expect(spl.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl.evaluate(2).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        cpSolutionX = [-1, -1, -1, -0.333333333333, 0, 0.333333333333, 1, 1, 1];
        cpSolutionY = [0, 1, 2, 2, 2, 2, 2, 1, 0];
        for(let i = 0; i < spl.controlPoints.length; i++) {
            expect(spl.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(spl.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }

        const spl2 = spl1.clone()
        spl2.insertKnot(2, 2);
        expect(spl2.knots).to.eql([ 0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 4, 4, 4])
        expect(spl2.controlPoints.length).to.eql(9)
        expect(spl2.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl2.evaluate(2).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        cpSolutionX = [-1, -1, -1, -0.333333333333, 0, 0.333333333333, 1, 1, 1];
        cpSolutionY = [0, 1, 2, 2, 2, 2, 2, 1, 0];
        for(let i = 0; i < spl2.controlPoints.length; i++) {
            expect(spl2.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(spl2.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
        spl1.insertKnotBoehmAlgorithm(2, 2);
        expect(spl1.knots).to.eql([ 0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 4, 4, 4])
        expect(spl1.controlPoints.length).to.eql(9)
        expect(spl1.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl1.evaluate(2).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        cpSolutionX = [-1, -1, -1, -0.333333333333, 0, 0.333333333333, 1, 1, 1];
        cpSolutionY = [0, 1, 2, 2, 2, 2, 2, 1, 0];
        for(let i = 0; i < spl1.controlPoints.length; i++) {
            expect(spl1.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(spl1.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
    })

    it('can insert knots repeatedly into a cubic B-spline using Boehm algorithm (knot off symmetry axis) (for comparison with periodic B-Splines', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.5, 1)
        const cp2 = new Vector2d(-0.5, 2)
        const cp3 = new Vector2d(-0.5, 3)
        const cp4 = new Vector2d(0.5, 3)
        const cp5 = new Vector2d(0.5, 2)
        const cp6 = new Vector2d(0.5, 1)
        const cp7 = new Vector2d(0.5, 0)
        const spl = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7], [ 0, 0, 0, 0, 1, 2, 3, 4, 5, 5, 5, 5])
        const spl1 = spl.clone()
        expect(spl.degree).to.eql(3)
        expect(spl.knots).to.eql([ 0, 0, 0, 0, 1, 2, 3, 4, 5, 5, 5, 5])
        expect(spl.evaluate(2).x).to.be.closeTo(-0.333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl.evaluate(2).y).to.be.closeTo(2.833333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        spl.insertKnotBoehmAlgorithm(2);
        expect(spl.knots).to.eql([ 0, 0, 0, 0, 1, 2, 2, 3, 4, 5, 5, 5, 5])
        expect(spl.controlPoints.length).to.eql(9)
        expect(spl.evaluate(2).x).to.be.closeTo(-0.333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl.evaluate(2).y).to.be.closeTo(2.833333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        let cpSolutionX = [-0.5, -0.5, -0.5, -0.5, -0.16666666666666, 0.5, 0.5, 0.5, 0.5];
        let cpSolutionY = [0, 1, 2, 2.66666666666, 3, 3, 2, 1, 0];
        for(let i = 0; i < spl.controlPoints.length; i++) {
            expect(spl.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(spl.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
        spl.insertKnotBoehmAlgorithm(2);
        expect(spl.knots).to.eql([ 0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 5, 5, 5, 5])
        expect(spl.controlPoints.length).to.eql(10)
        expect(spl.evaluate(2).x).to.be.closeTo(-0.333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl.evaluate(2).y).to.be.closeTo(2.833333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        cpSolutionX = [-0.5, -0.5, -0.5, -0.5, -0.3333333333333, -0.16666666666666, 0.5, 0.5, 0.5, 0.5];
        cpSolutionY = [0, 1, 2, 2.66666666666, 2.8333333333333, 3, 3, 2, 1, 0];
        for(let i = 0; i < spl.controlPoints.length; i++) {
            expect(spl.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(spl.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }

        const spl2 = spl1.clone()
        spl2.insertKnot(2, 2);
        expect(spl2.knots).to.eql([ 0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 5, 5, 5, 5])
        expect(spl2.controlPoints.length).to.eql(10)
        expect(spl2.evaluate(2).x).to.be.closeTo(-0.333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl2.evaluate(2).y).to.be.closeTo(2.833333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        cpSolutionX = [-0.5, -0.5, -0.5, -0.5, -0.3333333333333, -0.16666666666666, 0.5, 0.5, 0.5, 0.5];
        cpSolutionY = [0, 1, 2, 2.66666666666, 2.8333333333333, 3, 3, 2, 1, 0];
        for(let i = 0; i < spl2.controlPoints.length; i++) {
            expect(spl2.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(spl2.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }

        spl1.insertKnotBoehmAlgorithm(2, 2);
        expect(spl1.knots).to.eql([ 0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 5, 5, 5, 5])
        expect(spl1.controlPoints.length).to.eql(10)
        expect(spl1.evaluate(2).x).to.be.closeTo(-0.333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl1.evaluate(2).y).to.be.closeTo(2.833333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        cpSolutionX = [-0.5, -0.5, -0.5, -0.5, -0.3333333333333, -0.16666666666666, 0.5, 0.5, 0.5, 0.5];
        cpSolutionY = [0, 1, 2, 2.66666666666, 2.8333333333333, 3, 3, 2, 1, 0];
        for(let i = 0; i < spl1.controlPoints.length; i++) {
            expect(spl1.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(spl1.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
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

    it('can increment the degree of a closed degree one B-Spline with a rectangular control polygon', () => {
        // rectangular control polygon
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(0, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, 0)
        const cp4 = new Vector2d(1, -1)
        const cp5 = new Vector2d(0, -1)
        const cp6 = new Vector2d(0, 0)
        const knots = [0, 0, 1, 2, 3, 4, 5, 6, 6]
        const s = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots)
        const sp = s.clone()
        expect(s?.controlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5, cp6])
        expect(s?.degree).to.eql(1)
        const sInc = s.degreeIncrement();
        expect(sInc.degree).to.eql(2)
        expect(sInc?.knots.length).to.eql(16)
        expect(sInc.knots).to.eql([ 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6])
        expect(sInc?.controlPoints.length).to.eql(13)
        expect(sInc?.controlPoints).to.eql([ cp0, new Vector2d(0, 0.5), cp1, new Vector2d(0.5, 1), cp2, new Vector2d(1, 0.5), cp3, new Vector2d(1, -0.5), cp4, new Vector2d(0.5, -1), cp5, new Vector2d(0, -0.5), cp6])
        expect(s.evaluate(1)).to.eql(sInc.evaluate(1))

        const sInc1 = sInc.degreeIncrement();
        expect(sInc1.degree).to.eql(3)
        expect(sInc1?.knots.length).to.eql(23)
        expect(sInc1.knots).to.eql([ 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6])
        expect(sInc1?.controlPoints.length).to.eql(19)
        const cp7 = new Vector2d(0, 0.3333333333333)
        const cp8 = new Vector2d(0, 0.6666666666666)
        const cp9 = new Vector2d(0.3333333333333, 1)
        const cp10 = new Vector2d(0.6666666666666, 1)
        const cp11 = new Vector2d(1, 0.6666666666666)
        const cp12 = new Vector2d(1, 0.3333333333333)
        const cp13 = new Vector2d(1, -0.3333333333333)
        const cp14 = new Vector2d(1, -0.6666666666666)
        const cp15 = new Vector2d(0.6666666666666, -1)
        const cp16 = new Vector2d(0.3333333333333, -1)
        const cp17 = new Vector2d(0, -0.6666666666666)
        const cp18 = new Vector2d(0, -0.3333333333333)
        const cpInc1 = [cp0, cp7, cp8, cp1, cp9, cp10, cp2, cp11, cp12, cp3,
            cp13, cp14, cp4, cp15, cp16, cp5, cp17, cp18, cp6]
        for( let cp = 0; cp <  sInc1?.controlPoints.length; cp++) {
            expect(sInc1?.controlPoints[cp].x).to.be.closeTo(cpInc1[cp].x, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(sInc1?.controlPoints[cp].y).to.be.closeTo(cpInc1[cp].y, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
        expect(s.evaluate(1)).to.eql(sInc1.evaluate(1))
        expect(sInc.evaluate(1)).to.eql(sInc1.evaluate(1))
    })

    it('can generate the intermediate splines of a non uniform B-spline with coinciding extremities, i.e., closed', () => {
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(0, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, 0)
        const cp4 = new Vector2d(0, 0)
        const s1 = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4], [ 0, 0, 1, 2, 3, 4, 4])
        const intermSplines = s1.generateIntermediateSplinesForDegreeElevation();
        expect(intermSplines.knotVectors[0]).to.eql([0, 0, 0, 1, 1, 2, 3, 3, 4, 4, 4])
        expect(intermSplines.knotVectors[1]).to.eql([0, 0, 0, 1, 2, 2, 3, 4, 4, 4])
        const CP0x = [0, 0, 0, 1, 1, 1, 0, 0]
        const CP0y = [0, 0, 1, 1, 1, 0, 0, 0]
        for(let i = 0; i < intermSplines.CPs[0].length; i++) {
            expect(intermSplines.CPs[0][i].x).to.eql(CP0x[i])
            expect(intermSplines.CPs[0][i].y).to.eql(CP0y[i])
        }
        const CP1x = [0, 0, 0, 1, 1, 1, 0]
        const CP1y = [0, 1, 1, 1, 0, 0, 0]
        for(let i = 0; i < intermSplines.CPs[1].length; i++) {
            expect(intermSplines.CPs[1][i].x).to.eql(CP1x[i])
            expect(intermSplines.CPs[1][i].y).to.eql(CP1y[i])
        }
    })

    it('can increment the curve degree of a non uniform B-spline with coinciding extremities, i.e., closed (for comparison with periodic B-Splines)', () => {
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(0, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, 0)
        const cp4 = new Vector2d(0, 0)
        const s1 = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4], [ 0, 0, 1, 2, 3, 4, 4])
        const sInc = s1.degreeIncrement();
        expect(sInc.knots).to.eql([ 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4])
        expect(sInc.degree).to.eql(2)
        expect(sInc.knots).to.eql([ 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4])
        const cpSolutionX = [0, 0, 0, 0.5, 1.0, 1.0, 1.0, 0.5, 0];
        const cpSolutionY = [0, 0.5, 1, 1, 1, 0.5, 0, 0, 0];
        for(let i = 0; i < sInc.controlPoints.length; i++) {
            expect(sInc.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(sInc.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
    })

    it('evaluate intermediate B-Spline parameterization during degree elevation (for comparison with periodic B-Splines)', () => {
        const cp0 = new Vector2d(-1, 0)
        const cp1 = new Vector2d(-1, 1)
        const cp2 = new Vector2d(-1, 2)
        const cp3 = new Vector2d(0, 2)
        const cp4 = new Vector2d(1, 2)
        const cp5 = new Vector2d(1, 1)
        const cp6 = new Vector2d(1, 0)
        const spl = new BSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6], [ 0, 0, 0, 1, 2, 3, 4, 5, 5, 5])
        expect(spl.degree).to.eql(2)
        expect(spl.knots).to.eql([ 0, 0, 0, 1, 2, 3, 4, 5, 5, 5])
        expect(spl.evaluate(1).x).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl.evaluate(1).y).to.be.closeTo(1.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl.evaluate(2).x).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl.evaluate(2).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl.evaluate(2.5).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl.evaluate(2.5).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const intermSplines = spl.generateIntermediateSplinesForDegreeElevation();
        expect(intermSplines.knotVectors[0]).to.eql([0, 0, 0, 0, 1, 1, 2, 3, 4, 4, 5, 5, 5, 5])
        expect(intermSplines.knotVectors[1]).to.eql([0, 0, 0, 0, 1, 2, 2, 3, 4, 5, 5, 5, 5])
        expect(intermSplines.knotVectors[2]).to.eql([0, 0, 0, 0, 1, 2, 3, 3, 4, 5, 5, 5, 5])
        const CP0x = [-1, -1, -1, -1, 0, 0, 1, 1, 1, 1]
        const CP0y = [0, 0, 1, 2, 2, 2, 2, 1, 0, 0]
        for(let i = 0; i < intermSplines.CPs[0].length; i++) {
            expect(intermSplines.CPs[0][i].x).to.eql(CP0x[i])
            expect(intermSplines.CPs[0][i].y).to.eql(CP0y[i])
        }
        const spl1 = new BSplineR1toR2([ cp0, cp0, cp1, cp2, cp3, cp3, cp4, cp5, cp6, cp6], [0, 0, 0, 0, 1, 1, 2, 3, 4, 4, 5, 5, 5, 5])
        expect(spl1.evaluate(1).x).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl1.evaluate(1).y).to.be.closeTo(1.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl1.evaluate(2).x).to.be.closeTo(-0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl1.evaluate(2).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl1.evaluate(2.5).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl1.evaluate(2.5).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const CP1x = [-1, -1, -1, -1, 0, 1, 1, 1, 1]
        const CP1y = [0, 1, 1, 2, 2, 2, 2, 1, 0]
        for(let i = 0; i < intermSplines.CPs[1].length; i++) {
            expect(intermSplines.CPs[1][i].x).to.eql(CP1x[i])
            expect(intermSplines.CPs[1][i].y).to.eql(CP1y[i])
        }
        const spl2 = new BSplineR1toR2([ cp0, cp1, cp1, cp2, cp3, cp4, cp4, cp5, cp6], [0, 0, 0, 0, 1, 2, 2, 3, 4, 5, 5, 5, 5])
        expect(spl2.evaluate(1).x).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl2.evaluate(1).y).to.be.closeTo(1.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl2.evaluate(2).x).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl2.evaluate(2).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl2.evaluate(2.5).x).to.be.closeTo(0.21875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl2.evaluate(2.5).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)


        const CP2x = [-1, -1, -1, -1, 0, 1, 1, 1, 1]
        const CP2y = [0, 1, 2, 2, 2, 2, 1, 1, 0]
        for(let i = 0; i < intermSplines.CPs[2].length; i++) {
            expect(intermSplines.CPs[2][i].x).to.eql(CP2x[i])
            expect(intermSplines.CPs[2][i].y).to.eql(CP2y[i])
        }
        const spl3 = new BSplineR1toR2([ cp0, cp1, cp2, cp2, cp3, cp4, cp5, cp5, cp6], [0, 0, 0, 0, 1, 2, 3, 3, 4, 5, 5, 5, 5])
        expect(spl3.evaluate(1).x).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl3.evaluate(1).y).to.be.closeTo(1.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl3.evaluate(2).x).to.be.closeTo(-0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl3.evaluate(2).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl3.evaluate(2.5).x).to.be.closeTo(-0.21875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spl3.evaluate(2.5).y).to.be.closeTo(2, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

    })
 });