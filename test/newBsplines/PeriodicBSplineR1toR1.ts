import { expect } from "chai";
import { PeriodicBSplineR1toR1 } from "../../src/newBsplines/PeriodicBSplineR1toR1";

describe('PeriodicBSplineR1toR1', () => {
    
    it('can be initialized without an initializer', () => {
        const s = new PeriodicBSplineR1toR1();
        expect(s.controlPoints).to.eql([0])
        expect(s.knots).to.eql([0, 1])
    });

    it('can be initialized with a uniform knot sequence', () => {
        const ctrlPts = [1, 2];
        const knots = [-1, 0, 1, 2];
        const s = new PeriodicBSplineR1toR1(ctrlPts, knots);
        expect(s.controlPoints).to.eql(ctrlPts);
        expect(s.knots).to.eql(knots);
        expect(s.degree).to.eql(1);
    });

    it('can be initialized with a non-uniform knot sequence', () => {
        const ctrlPts = [1, 2, 1, 0, 0.5];
        const knots = [-1, 0, 1, 1.5, 2, 3, 4];
        const s = new PeriodicBSplineR1toR1(ctrlPts, knots);
        expect(s.controlPoints).to.eql(ctrlPts);
        expect(s.knots).to.eql(knots);
        expect(s.degree).to.eql(1);
    });

    it('can be initialized with a non-uniform knot sequence and varying orders of multiplicity', () => {
        const ctrlPts = [1, 2, 1, 0, 0.5, 0.8, 4, 2];
        const knots = [-1, 0, 0, 1, 1.5, 1.7, 1.7, 2, 3, 3, 4];
        const s = new PeriodicBSplineR1toR1(ctrlPts, knots);
        expect(s.controlPoints).to.eql(ctrlPts);
        expect(s.knots).to.eql(knots);
        expect(s.degree).to.eql(2);
    });

    it('can compute a Bernstein decomposition of uniform periodic B-Spline', () => {
        const ctrlPts = [0.35, 0.35, 0.25, 0.12, -0.12, -0.25, -0.35, -0.35, -0.25, -0.12, 0.12, 0.25, 0.35, 0.35];
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        const s = new PeriodicBSplineR1toR1(ctrlPts, knots);
        expect(s.controlPoints).to.eql(ctrlPts);
        expect(s.knots).to.eql(knots);
        expect(s.degree).to.eql(2);
        const bernsteinDecomp = s.bernsteinDecomposition();
        const ctrlPtsBernDecomp = bernsteinDecomp.flattenControlPointsArray();
        expect(ctrlPtsBernDecomp).to.eql([0.35, 0.35, 0.3, 0.3, 0.25, 0.185, 0.185, 0.12, 0, 0,
                                         -0.12, -0.185, -0.185, -0.25, -0.3, -0.3, -0.35, -0.35, -0.35, -0.35,
                                         -0.3, -0.3, -0.25, -0.185, -0.185, -0.12, 0, 0, 0.12,
                                         0.185, 0.185, 0.25, 0.3, 0.3, 0.35, 0.35]);

    });


    it('can clamp a periodic uniform B-Spline, i.e., insert repeatedtly a knot at an arbitrary abscissa up to a multiplicity of (degree + 1)', () => {
        const ctrlPts = [0.35, 0.35, 0.25, 0.12, -0.12, -0.25, -0.35, -0.35, -0.25, -0.12, 0.12, 0.25, 0.35, 0.35];
        const knots: number [] = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13];
        const s = new PeriodicBSplineR1toR1(ctrlPts, knots);
        expect(s.degree).to.eql(2);
        const ctrlPts1 = [0, 0.35, 0.35, 0.25, 0.12, -0.12, -0.25, -0.35, -0.35, -0.25, -0.12, 0.12, 0.25, 0.35, 0.35, 0];
        const knots1: number [] = [-2, -1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 14]
        const s1 = new PeriodicBSplineR1toR1(ctrlPts1, knots1);
        s.clamp(0)
        expect(s.knots).to.eql([-1, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13]);
        expect(s.controlPoints).to.eql([0.35, 0.35, 0.35, 0.25, 0.12, -0.12, -0.25, -0.35, -0.35, -0.25, -0.12, 0.12, 0.25, 0.35, 0.35]);
    });
});