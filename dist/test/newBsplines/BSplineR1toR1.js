"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const BSplineR1toR1_1 = require("../../src/newBsplines/BSplineR1toR1");
const Curves_1 = require("../namedConstants/Curves");
const Curves_2 = require("../namedConstants/Curves");
const Curves_3 = require("../namedConstants/Curves");
describe('BSplineR1toR1', () => {
    it('can be initialized without an initializer', () => {
        const s = new BSplineR1toR1_1.BSplineR1toR1();
        (0, chai_1.expect)(s.controlPoints).to.eql([0]);
        (0, chai_1.expect)(s.knots).to.eql([0, 1]);
    });
    it('can be initialized with an initializer', () => {
        const s = new BSplineR1toR1_1.BSplineR1toR1([1, 2, 3], [0, 0, 0, 1, 1, 1]);
        (0, chai_1.expect)(s.controlPoints).to.eql([1, 2, 3]);
        (0, chai_1.expect)(s.knots).to.eql([0, 0, 0, 1, 1, 1]);
        (0, chai_1.expect)(s.degree).to.equal(2);
    });
    it('throws an exception at construction if the degree of the b-spline is negative', () => {
        const knots = [0, 0, 1];
        const controlPts = [1, 2, 3];
        (0, chai_1.expect)(() => new BSplineR1toR1_1.BSplineR1toR1(controlPts, knots)).to.throw();
    });
    it('can be used to evaluate a Bernstein polynomial', () => {
        const u = 0.22;
        const a = 1.1;
        const b = 3.2;
        const c = 6.3;
        const b02 = Math.pow(1 - u, 2);
        const b12 = 2 * u * (1 - u);
        const b22 = Math.pow(u, 2);
        const s = new BSplineR1toR1_1.BSplineR1toR1([a, b, c], [0, 0, 0, 1, 1, 1]);
        (0, chai_1.expect)(s.degree).to.eql(2);
        (0, chai_1.expect)(a * b02 + b * b12 + c * b22).to.equal(s.evaluate(u));
    });
    it('can evaluate a non uniform B-Spline', () => {
        const s = new BSplineR1toR1_1.BSplineR1toR1([-1, 0, 1], [0, 0, 0, 1, 1, 1]);
        (0, chai_1.expect)(s.degree).to.equal(2);
        let spanIndex = s.increasingKnotSequence.findSpan(0);
        (0, chai_1.expect)(spanIndex.knotIndex).to.eql(2);
        (0, chai_1.expect)(s.evaluate(0)).to.be.closeTo(-1, Curves_2.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        spanIndex = s.increasingKnotSequence.findSpan(0.5);
        (0, chai_1.expect)(spanIndex.knotIndex).to.eql(2);
        (0, chai_1.expect)(s.evaluate(0.5)).to.be.closeTo(0, Curves_2.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        spanIndex = s.increasingKnotSequence.findSpan(1);
        (0, chai_1.expect)(spanIndex.knotIndex).to.eql(2);
        (0, chai_1.expect)(s.evaluate(1)).to.be.closeTo(1, Curves_2.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
    });
    it('can evaluate a uniform B-Spline', () => {
        const s = new BSplineR1toR1_1.BSplineR1toR1([-1, 0, 1], [-2, -1, 0, 1, 2, 3]);
        (0, chai_1.expect)(s.degree).to.equal(2);
        (0, chai_1.expect)(s.increasingKnotSequence.isKnotSpacingUniform).to.eql(true);
        let spanIndex = s.increasingKnotSequence.findSpan(0);
        (0, chai_1.expect)(spanIndex.knotIndex).to.eql(2);
        (0, chai_1.expect)(s.evaluate(0)).to.be.closeTo(-0.5, Curves_2.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        spanIndex = s.increasingKnotSequence.findSpan(1);
        (0, chai_1.expect)(spanIndex.knotIndex).to.eql(2);
        (0, chai_1.expect)(s.evaluate(1)).to.be.closeTo(0.5, Curves_2.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
    });
    it('can evaluate its zeros', () => {
        const s = new BSplineR1toR1_1.BSplineR1toR1([-1, 0, 1], [0, 0, 0, 1, 1, 1]);
        const zeros = s.zeros();
        (0, chai_1.expect)(zeros.length).to.equal(1);
        (0, chai_1.expect)(zeros[0]).to.be.closeTo(0.5, Curves_1.TOL_EVAL_ZEROS_BSPL_R1TOR1);
    });
    it('can compute the number of sign changes of its control polygon', () => {
        const s1 = new BSplineR1toR1_1.BSplineR1toR1([-1, 0, 1], [0, 0, 0, 1, 1, 1]);
        (0, chai_1.expect)(s1.controlPolygonNumberOfSignChanges()).to.equal(2);
        const s2 = new BSplineR1toR1_1.BSplineR1toR1([-1, 0.1, 1], [0, 0, 0, 1, 1, 1]);
        (0, chai_1.expect)(s2.controlPolygonNumberOfSignChanges()).to.equal(1);
        const s3 = new BSplineR1toR1_1.BSplineR1toR1([-1, 0.1, 1, -2], [0, 0, 0, 0.5, 1, 1, 1]);
        (0, chai_1.expect)(s3.controlPolygonNumberOfSignChanges()).to.equal(2);
    });
    it('can compute the zeros of the control polygon', () => {
        const s1 = new BSplineR1toR1_1.BSplineR1toR1([-1, 1, 1], [0, 0, 0, 1, 1, 1]);
        (0, chai_1.expect)(s1.controlPolygonZeros().length).to.equal(1);
        (0, chai_1.expect)(s1.controlPolygonZeros()[0]).to.be.closeTo(0.25, Curves_3.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1);
    });
    it('can produce a curve', () => {
        const s1 = new BSplineR1toR1_1.BSplineR1toR1([-1, 1, 1], [0, 0, 0, 1, 1, 1]);
        const c1 = s1.convertTocurve();
        (0, chai_1.expect)(c1.controlPoints[0].x).to.equal(0);
        (0, chai_1.expect)(c1.controlPoints[0].y).to.equal(-1);
        (0, chai_1.expect)(c1.controlPoints[1].x).to.equal(0.5);
        (0, chai_1.expect)(c1.controlPoints[1].y).to.equal(1);
        (0, chai_1.expect)(c1.controlPoints[2].x).to.equal(1);
        (0, chai_1.expect)(c1.controlPoints[2].y).to.equal(1);
    });
    it('can increment the degree of non-uniform B-spline with end knots only', () => {
        const s1 = new BSplineR1toR1_1.BSplineR1toR1([-1, 0, 1], [0, 0, 0, 1, 1, 1]);
        (0, chai_1.expect)(s1.degree).to.eql(2);
        const s = s1.degreeIncrement();
        (0, chai_1.expect)(s.degree).to.eql(3);
        (0, chai_1.expect)(s.knots).to.eql([0, 0, 0, 0, 1, 1, 1, 1]);
        const cpSolution = [-1, -0.33333333333333333, 0.33333333333333333, 1];
        for (let i = 0; i < s.controlPoints.length; i++) {
            (0, chai_1.expect)(s.controlPoints[i]).to.be.closeTo(cpSolution[i], Curves_3.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1);
        }
    });
    it('can increment the degree of non-uniform B-spline with arbitrary knot sequence', () => {
        const s1 = new BSplineR1toR1_1.BSplineR1toR1([1, 1, 1, 1], [0, 0, 0, 1, 2, 2, 2]);
        (0, chai_1.expect)(s1.degree).to.eql(2);
        const s = s1.degreeIncrement();
        (0, chai_1.expect)(s.degree).to.eql(3);
        (0, chai_1.expect)(s.knots).to.eql([0, 0, 0, 0, 1, 1, 2, 2, 2, 2]);
        const cpSolution = [1, 1, 1, 1, 1, 1];
        for (let i = 0; i < s.controlPoints.length; i++) {
            (0, chai_1.expect)(s.controlPoints[i]).to.be.closeTo(cpSolution[i], Curves_3.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1);
        }
        const s2 = new BSplineR1toR1_1.BSplineR1toR1([0, 1, 2, 3], [0, 0, 0, 1, 2, 2, 2]);
        (0, chai_1.expect)(s2.degree).to.eql(2);
        const s3 = s2.degreeIncrement();
        (0, chai_1.expect)(s3.degree).to.eql(3);
        const cpSolution1 = [0, 0.666666666666666, 1.166666666666666, 1.833333333333333, 2.3333333333333333, 3];
        for (let i = 0; i < s3.controlPoints.length; i++) {
            (0, chai_1.expect)(s3.controlPoints[i]).to.be.closeTo(cpSolution1[i], Curves_3.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1);
        }
    });
    it('can insert a knot into a non-uniform B-spline', () => {
        const s1 = new BSplineR1toR1_1.BSplineR1toR1([1, 1, 1], [0, 0, 0, 1, 1, 1]);
        (0, chai_1.expect)(s1.degree).to.eql(2);
        const s = s1.clone();
        s.insertKnot(0.5);
        (0, chai_1.expect)(s.knots).to.eql([0, 0, 0, 0.5, 1, 1, 1]);
        (0, chai_1.expect)(Math.abs(s.evaluate(0.4) - s1.evaluate(0.4))).to.be.below(Curves_2.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        (0, chai_1.expect)(s.evaluate(0.4)).to.be.closeTo(1, Curves_2.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        s.insertKnot(0.5);
        (0, chai_1.expect)(s.knots).to.eql([0, 0, 0, 0.5, 0.5, 1, 1, 1]);
        (0, chai_1.expect)(Math.abs(s.evaluate(0.4) - s1.evaluate(0.4))).to.be.below(Curves_2.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        (0, chai_1.expect)(s.evaluate(0.4)).to.be.closeTo(1, Curves_2.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        // to be added if multiplicity bounded to maxOrderOfMultiplicity
        // expect(() => s.insertKnot(0.5)).to.throw();
    });
    it('can insert a knot with a multiplicity greater than one into a non-uniform B-spline', () => {
        const s1 = new BSplineR1toR1_1.BSplineR1toR1([1, 1, 1], [0, 0, 0, 1, 1, 1]);
        (0, chai_1.expect)(s1.degree).to.eql(2);
        const s = s1.clone();
        s.insertKnot(0.5, 2);
        (0, chai_1.expect)(s.knots).to.eql([0, 0, 0, 0.5, 0.5, 1, 1, 1]);
        (0, chai_1.expect)(Math.abs(s.evaluate(0.4) - s1.evaluate(0.4))).to.be.below(Curves_2.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        (0, chai_1.expect)(s.evaluate(0.4)).to.be.closeTo(1, Curves_2.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        const s2 = s1.clone();
        // to be added if multiplicity bounded to maxOrderOfMultiplicity
        // expect(() => s2.insertKnot(0.5, 3)).to.throw();
    });
    it('can compute the derivative of non-uniform B-spline with end knots only', () => {
        const s1 = new BSplineR1toR1_1.BSplineR1toR1([1, 1, 1], [0, 0, 0, 1, 1, 1]);
        (0, chai_1.expect)(s1.degree).to.eql(2);
        const s = s1.derivative();
        (0, chai_1.expect)(s.degree).to.eql(1);
        (0, chai_1.expect)(s.knots).to.eql([0, 0, 1, 1]);
        const cpSolution = [0, 0];
        for (let i = 0; i < s.controlPoints.length; i++) {
            (0, chai_1.expect)(s.controlPoints[i]).to.be.closeTo(cpSolution[i], Curves_3.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1);
        }
    });
    it('can compute the derivative of an arbitrary non-uniform B-spline', () => {
        const s1 = new BSplineR1toR1_1.BSplineR1toR1([1, 1, 1, 1], [0, 0, 0, 0.5, 1, 1, 1]);
        (0, chai_1.expect)(s1.degree).to.eql(2);
        const s = s1.derivative();
        (0, chai_1.expect)(s.degree).to.eql(1);
        (0, chai_1.expect)(s.knots).to.eql([0, 0, 0.5, 1, 1]);
        const cpSolution = [0, 0, 0];
        for (let i = 0; i < s.controlPoints.length; i++) {
            (0, chai_1.expect)(s.controlPoints[i]).to.be.closeTo(cpSolution[i], Curves_3.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1);
        }
        const s2 = new BSplineR1toR1_1.BSplineR1toR1([1, 1, 1, 1, 1], [0, 0, 0, 0.5, 0.5, 1, 1, 1]);
        (0, chai_1.expect)(s2.degree).to.eql(2);
        const s3 = s2.derivative();
        (0, chai_1.expect)(s3.degree).to.eql(1);
        (0, chai_1.expect)(s3.knots).to.eql([0, 0, 0.5, 0.5, 1, 1]);
        const cpSolution1 = [0, 0, 0, 0];
        for (let i = 0; i < s3.controlPoints.length; i++) {
            (0, chai_1.expect)(s3.controlPoints[i]).to.be.closeTo(cpSolution1[i], Curves_3.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1);
        }
        // const s4 = new BSplineR1toR1([1, 1, 1, 1, 1, 1], [ 0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1])
        // expect(s4.degree).to.eql(2)
        // const s5 = s4.derivative();
        // expect(s5.degree).to.eql(1)
        // expect(s5.knots).to.eql([0, 0, 0.5, 0.5, 1, 1])
        // const cpSolution2 = [0, 0, 0, 0];
        // for(let i = 0; i < s5.controlPoints.length; i++) {
        //     expect(s5.controlPoints[i]).to.be.closeTo(cpSolution2[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1)
        // }
        const s6 = new BSplineR1toR1_1.BSplineR1toR1([1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0.1, 0.5, 0.5, 0.8, 1, 1, 1]);
        (0, chai_1.expect)(s6.degree).to.eql(2);
        const s7 = s6.derivative();
        (0, chai_1.expect)(s7.degree).to.eql(1);
        (0, chai_1.expect)(s7.knots).to.eql([0, 0, 0.1, 0.5, 0.5, 0.8, 1, 1]);
        const cpSolution3 = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < s7.controlPoints.length; i++) {
            (0, chai_1.expect)(s7.controlPoints[i]).to.be.closeTo(cpSolution3[i], Curves_3.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1);
        }
    });
    it('can compute the derivative of an arbitrary uniform B-spline', () => {
        const s1 = new BSplineR1toR1_1.BSplineR1toR1([1, 1, 1, 1, 1], [-2, -1, 0, 1, 2, 3, 4, 5]);
        (0, chai_1.expect)(s1.degree).to.eql(2);
        (0, chai_1.expect)(s1.increasingKnotSequence.uMax).to.eql(3);
        const s = s1.derivative();
        (0, chai_1.expect)(s.degree).to.eql(1);
        (0, chai_1.expect)(s.knots).to.eql([-1, 0, 1, 2, 3, 4]);
        const cpSolution = [0, 0, 0, 0];
        for (let i = 0; i < s.controlPoints.length; i++) {
            (0, chai_1.expect)(s.controlPoints[i]).to.be.closeTo(cpSolution[i], Curves_3.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1);
        }
    });
});
