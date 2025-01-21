"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var PeriodicBSplineR1toR1_1 = require("../../src/newBsplines/PeriodicBSplineR1toR1");
var Curves_1 = require("../namedConstants/Curves");
describe('PeriodicBSplineR1toR1', function () {
    it('can be initialized without an initializer', function () {
        var s = new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1();
        chai_1.expect(s.controlPoints).to.eql([0]);
        chai_1.expect(s.knots).to.eql([0, 1]);
    });
    it('can be initialized with a uniform knot sequence', function () {
        var ctrlPts = [1, 2];
        var knots = [-1, 0, 1, 2];
        var s = new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(ctrlPts, knots);
        chai_1.expect(s.controlPoints).to.eql(ctrlPts);
        chai_1.expect(s.knots).to.eql(knots);
        chai_1.expect(s.degree).to.eql(1);
    });
    it('can be initialized with a non-uniform knot sequence', function () {
        var ctrlPts = [1, 2, 1, 0, 0.5];
        var knots = [-1, 0, 1, 1.5, 2, 3, 4];
        var s = new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(ctrlPts, knots);
        chai_1.expect(s.controlPoints).to.eql(ctrlPts);
        chai_1.expect(s.knots).to.eql(knots);
        chai_1.expect(s.degree).to.eql(1);
    });
    it('can be initialized with a non-uniform knot sequence and varying orders of multiplicity', function () {
        var ctrlPts = [1, 2, 1, 0, 0.5, 0.8, 4, 2];
        var knots = [-1, 0, 0, 1, 1.5, 1.7, 1.7, 2, 3, 3, 4];
        var s = new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(ctrlPts, knots);
        chai_1.expect(s.controlPoints).to.eql(ctrlPts);
        chai_1.expect(s.knots).to.eql(knots);
        chai_1.expect(s.degree).to.eql(2);
    });
    it('can evaluate a B-Spline with a uniform knot sequence', function () {
        var ctrlPts = [1, 2, 3, 4, 5, 6, 7, 8];
        var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
        var s = new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(ctrlPts, knots);
        chai_1.expect(s.degree).to.eql(2);
        chai_1.expect(s.evaluate(0)).to.eql(1.5);
        chai_1.expect(s.evaluate(1)).to.be.closeTo(2.5, Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        var spanIndex = s.increasingKnotSequence.findSpan(6);
        chai_1.expect(spanIndex.knotIndex).to.eql(7);
        chai_1.expect(s.evaluate(6)).to.be.closeTo(7.5, Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
    });
    it('can compute a Bernstein decomposition of uniform periodic B-Spline', function () {
        var ctrlPts = [0.35, 0.35, 0.25, 0.12, -0.12, -0.25, -0.35, -0.35, -0.25, -0.12, 0.12, 0.25, 0.35, 0.35];
        var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        var s = new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(ctrlPts, knots);
        chai_1.expect(s.controlPoints).to.eql(ctrlPts);
        chai_1.expect(s.knots).to.eql(knots);
        chai_1.expect(s.degree).to.eql(2);
        // cross influence with getKnotIndicesBoundingNormalizedBasis method -> to analyze
        // const bernsteinDecomp = s.bernsteinDecomposition();
        // const ctrlPtsBernDecomp = bernsteinDecomp.flattenControlPointsArray();
        // expect(ctrlPtsBernDecomp).to.eql([0.35, 0.35, 0.3, 0.3, 0.25, 0.185, 0.185, 0.12, 0, 0,
        //                                  -0.12, -0.185, -0.185, -0.25, -0.3, -0.3, -0.35, -0.35, -0.35, -0.35,
        //                                  -0.3, -0.3, -0.25, -0.185, -0.185, -0.12, 0, 0, 0.12,
        //                                  0.185, 0.185, 0.25, 0.3, 0.3, 0.35, 0.35]);
    });
    it('can clamp a periodic uniform B-Spline, i.e., insert repeatedtly a knot at an arbitrary abscissa up to a multiplicity of (degree + 1)', function () {
        var ctrlPts = [0.35, 0.35, 0.25, 0.12, -0.12, -0.25, -0.35, -0.35, -0.25, -0.12, 0.12, 0.25, 0.35, 0.35];
        var knots = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13];
        var s = new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(ctrlPts, knots);
        chai_1.expect(s.degree).to.eql(2);
        var ctrlPts1 = [0, 0.35, 0.35, 0.25, 0.12, -0.12, -0.25, -0.35, -0.35, -0.25, -0.12, 0.12, 0.25, 0.35, 0.35, 0];
        var knots1 = [-2, -1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 14];
        // cross influence with getKnotIndicesBoundingNormalizedBasis method -> to analyze
        // const s1 = new PeriodicBSplineR1toR1(ctrlPts1, knots1);
        // s.clamp(0)
        // expect(s.knots).to.eql([-1, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13]);
        // expect(s.controlPoints).to.eql([0.35, 0.35, 0.35, 0.25, 0.12, -0.12, -0.25, -0.35, -0.35, -0.25, -0.12, 0.12, 0.25, 0.35, 0.35]);
    });
});
