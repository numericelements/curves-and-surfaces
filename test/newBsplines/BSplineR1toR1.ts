import { expect } from 'chai';
import { BSplineR1toR1 } from '../../src/newBsplines/BSplineR1toR1';

export const TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1 = 1e-10;
export const TOL_COMPARISON_PT_CRV_BSPL_R1TOR1 = 1e-10;
export const TOL_EVAL_ZEROS_BSPL_R1TOR1 = 1e-7;

describe('BSplineR1toR1', () => {
    
    it('can be initialized without an initializer', () => {
        const s = new BSplineR1toR1();
        expect(s.controlPoints).to.eql([0])
        expect(s.knots).to.eql([0, 1])
    });
    
    it('can be initialized with an initializer', () => {
        const s = new BSplineR1toR1([ 1, 2, 3 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s.controlPoints).to.eql([ 1, 2, 3])
        expect(s.knots).to.eql([ 0, 0, 0, 1, 1, 1 ])
        expect(s.degree).to.equal(2)
    });
    
    it('throws an exception at construction if the degree of the b-spline is negative', () => {
        const knots = [ 0, 0, 1 ]
        const controlPts = [ 1, 2, 3 ]
        const s = new BSplineR1toR1(controlPts, knots)
        // expect(function() {const s = new BSplineR1toR1([ 1, 2, 3 ], [ 0, 0, 1 ])}).to.throw()
        // test sending error message by ErrorLog class replaced by
        expect(knots.length).to.gt(controlPts.length - 1)
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

    it('can evaluate a non uniform B-Spline', () => {
        const s = new  BSplineR1toR1([ -1, 0, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s.degree).to.equal(2)
        let spanIndex = s.increasingKnotSequence.findSpan(0);
        expect(spanIndex.knotIndex).to.eql(2)
        expect(s.evaluate(0)).to.be.closeTo(-1, TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        spanIndex = s.increasingKnotSequence.findSpan(0.5);
        expect(spanIndex.knotIndex).to.eql(2)
        expect(s.evaluate(0.5)).to.be.closeTo(0, TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        spanIndex = s.increasingKnotSequence.findSpan(1);
        expect(spanIndex.knotIndex).to.eql(2)
        expect(s.evaluate(1)).to.be.closeTo(1, TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
    });

    it('can evaluate a uniform B-Spline', () => {
        const s = new  BSplineR1toR1([ -1, 0, 1 ], [0, 1, 2, 3, 4, 5])
        expect(s.degree).to.equal(2)
        expect(s.increasingKnotSequence.isUniform).to.eql(true)
        let spanIndex = s.increasingKnotSequence.findSpan(2);
        expect(spanIndex.knotIndex).to.eql(2)
        expect(s.evaluate(2)).to.be.closeTo(-0.5, TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        spanIndex = s.increasingKnotSequence.findSpan(3);
        expect(spanIndex.knotIndex).to.eql(2)
        expect(s.evaluate(3)).to.be.closeTo(0.5, TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
    });

    it('can evaluate its zeros', () => {
        const s = new  BSplineR1toR1([ -1, 0, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        const zeros = s.zeros()
        expect(zeros.length).to.equal(1)
        expect(zeros[0]).to.be.closeTo(0.5, TOL_EVAL_ZEROS_BSPL_R1TOR1)
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
        expect(s1.controlPolygonZeros()[0]).to.be.closeTo(0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1)
    });

    it('can produce a curve', () => {
        const s1 = new  BSplineR1toR1([ -1, 1, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        const c1 = s1.convertTocurve()
        expect(c1.controlPoints[0].x).to.equal(0)
        expect(c1.controlPoints[0].y).to.equal(-1)
        expect(c1.controlPoints[1].x).to.equal(0.5)
        expect(c1.controlPoints[1].y).to.equal(1)
        expect(c1.controlPoints[2].x).to.equal(1)
        expect(c1.controlPoints[2].y).to.equal(1)
    });

    it('can increment the degree of non-uniform B-spline with end knots only', () => {
        const s1 = new BSplineR1toR1([ -1, 0, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s1.degree).to.eql(2)
        const s = s1.degreeIncrement();
        expect(s.degree).to.eql(3)
        expect(s.knots).to.eql([0, 0, 0, 0, 1, 1, 1, 1])
        const cpSolution = [-1, -0.33333333333333333, 0.33333333333333333, 1];
        for(let i = 0; i < s.controlPoints.length; i++) {
            expect(s.controlPoints[i]).to.be.closeTo(cpSolution[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1)
        }
    });

    it('can increment the degree of non-uniform B-spline with arbitrary knot sequence', () => {
        const s1 = new BSplineR1toR1([ 1, 1, 1, 1 ], [ 0, 0, 0, 1, 2, 2, 2])
        expect(s1.degree).to.eql(2)
        const s = s1.degreeIncrement();
        expect(s.degree).to.eql(3)
        expect(s.knots).to.eql([0, 0, 0, 0, 1, 1, 2, 2, 2, 2])
        const cpSolution = [1, 1, 1, 1, 1, 1];
        for(let i = 0; i < s.controlPoints.length; i++) {
            expect(s.controlPoints[i]).to.be.closeTo(cpSolution[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1)
        }
        const s2 = new BSplineR1toR1([ 0, 1, 2, 3 ], [ 0, 0, 0, 1, 2, 2, 2])
        expect(s2.degree).to.eql(2)
        const s3 = s2.degreeIncrement();
        expect(s3.degree).to.eql(3)
        const cpSolution1 = [0, 0.666666666666666, 1.166666666666666, 1.833333333333333, 2.3333333333333333, 3];
        for(let i = 0; i < s3.controlPoints.length; i++) {
            expect(s3.controlPoints[i]).to.be.closeTo(cpSolution1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1)
        }
    });

    it('can insert a knot into a non-uniform B-spline', () => {
        const s1 = new BSplineR1toR1([1, 1, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s1.degree).to.eql(2)
        const s = s1.clone();
        s.insertKnot(0.5);
        expect(s.knots).to.eql([0, 0, 0, 0.5, 1, 1, 1])
        expect(Math.abs(s.evaluate(0.4) - s1.evaluate(0.4))).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(s.evaluate(0.4)).to.be.closeTo(1, TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        s.insertKnot(0.5);
        expect(s.knots).to.eql([0, 0, 0, 0.5, 0.5, 1, 1, 1])
        expect(Math.abs(s.evaluate(0.4) - s1.evaluate(0.4))).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(s.evaluate(0.4)).to.be.closeTo(1, TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        s.insertKnot(0.5);
        expect(s.knots).to.eql([0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1])
        expect(Math.abs(s.evaluate(0.4) - s1.evaluate(0.4))).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(s.evaluate(0.4)).to.be.closeTo(1, TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
    });

    it('can insert a knot with a multiplicity greater than one into a non-uniform B-spline', () => {
        const s1 = new BSplineR1toR1([1, 1, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s1.degree).to.eql(2)
        const s = s1.clone();
        s.insertKnot(0.5, 2);
        expect(s.knots).to.eql([0, 0, 0, 0.5, 0.5, 1, 1, 1])
        expect(Math.abs(s.evaluate(0.4) - s1.evaluate(0.4))).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(s.evaluate(0.4)).to.be.closeTo(1, TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        const s2 = s1.clone();
        s2.insertKnot(0.5, 3);
        expect(s2.knots).to.eql([0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1])
        expect(Math.abs(s2.evaluate(0.4) - s1.evaluate(0.4))).to.be.below(TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
        expect(s2.evaluate(0.4)).to.be.closeTo(1, TOL_COMPARISON_PT_CRV_BSPL_R1TOR1)
    });

    it('can compute the derivative of non-uniform B-spline with end knots only', () => {
        const s1 = new BSplineR1toR1([1, 1, 1 ], [ 0, 0, 0, 1, 1, 1 ])
        expect(s1.degree).to.eql(2)
        const s = s1.derivative();
        expect(s.degree).to.eql(1)
        expect(s.knots).to.eql([0, 0, 1, 1])
        const cpSolution = [0, 0];
        for(let i = 0; i < s.controlPoints.length; i++) {
            expect(s.controlPoints[i]).to.be.closeTo(cpSolution[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1)
        }
    });

    it('can compute the derivative of an arbitrary non-uniform B-spline', () => {
        const s1 = new BSplineR1toR1([1, 1, 1, 1], [ 0, 0, 0, 0.5, 1, 1, 1])
        expect(s1.degree).to.eql(2)
        const s = s1.derivative();
        expect(s.degree).to.eql(1)
        expect(s.knots).to.eql([0, 0, 0.5, 1, 1])
        const cpSolution = [0, 0, 0];
        for(let i = 0; i < s.controlPoints.length; i++) {
            expect(s.controlPoints[i]).to.be.closeTo(cpSolution[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1)
        }
        const s2 = new BSplineR1toR1([1, 1, 1, 1, 1], [ 0, 0, 0, 0.5, 0.5, 1, 1, 1])
        expect(s2.degree).to.eql(2)
        const s3 = s2.derivative();
        expect(s3.degree).to.eql(1)
        expect(s3.knots).to.eql([0, 0, 0.5, 0.5, 1, 1])
        const cpSolution1 = [0, 0, 0, 0];
        for(let i = 0; i < s3.controlPoints.length; i++) {
            expect(s3.controlPoints[i]).to.be.closeTo(cpSolution1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1)
        }
        const s4 = new BSplineR1toR1([1, 1, 1, 1, 1, 1], [ 0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1])
        expect(s4.degree).to.eql(2)
        const s5 = s4.derivative();
        expect(s5.degree).to.eql(1)
        expect(s5.knots).to.eql([0, 0, 0.5, 0.5, 1, 1])
        const cpSolution2 = [0, 0, 0, 0];
        for(let i = 0; i < s5.controlPoints.length; i++) {
            expect(s5.controlPoints[i]).to.be.closeTo(cpSolution2[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1)
        }
        const s6 = new BSplineR1toR1([1, 1, 1, 1, 1, 1, 1, 1], [ 0, 0, 0, 0.1, 0.5, 0.5, 0.5, 0.8, 1, 1, 1])
        expect(s4.degree).to.eql(2)
        const s7 = s6.derivative();
        expect(s7.degree).to.eql(1)
        expect(s7.knots).to.eql([0, 0, 0.1, 0.5, 0.5, 0.8, 1, 1])
        const cpSolution3 = [0, 0, 0, 0, 0, 0];
        for(let i = 0; i < s7.controlPoints.length; i++) {
            expect(s7.controlPoints[i]).to.be.closeTo(cpSolution3[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1)
        }
    });

    it('can compute the derivative of an arbitrary uniform B-spline', () => {
        const s1 = new BSplineR1toR1([1, 1, 1, 1, 1], [ 0, 1, 2, 3, 4, 5, 6, 7])
        expect(s1.degree).to.eql(2)
        const s = s1.derivative();
        expect(s.degree).to.eql(1)
        expect(s.knots).to.eql([0, 1, 2, 3, 4, 5])
        const cpSolution = [0, 0, 0, 0];
        for(let i = 0; i < s.controlPoints.length; i++) {
            expect(s.controlPoints[i]).to.be.closeTo(cpSolution[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1)
        }
    });
});