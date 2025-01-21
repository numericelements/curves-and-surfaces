"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var PeriodicBSplineR1toR2withOpenKnotSequence_1 = require("../../src/newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence");
var Vector2d_1 = require("../../src/mathVector/Vector2d");
var Curves_1 = require("../namedConstants/Curves");
describe('PeriodicBSplineR1toR2withOpenKnotSequence', function () {
    it('can be initialized without an initializer', function () {
        var s = new PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence();
        chai_1.expect(s.controlPoints[0]).to.eql(new Vector2d_1.Vector2d(0, 0));
        chai_1.expect(s.knots).to.eql([0, 1]);
    });
    it('can be initialized with an initializer', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.27, -0.35);
        var cp1 = new Vector2d_1.Vector2d(-0.3, 0);
        var cp2 = new Vector2d_1.Vector2d(-0.27, 0.35);
        var cp3 = new Vector2d_1.Vector2d(-0.15, 0.6);
        var cp4 = new Vector2d_1.Vector2d(0, 0.72);
        var cp5 = new Vector2d_1.Vector2d(0.15, 0.6);
        var cp6 = new Vector2d_1.Vector2d(0.27, 0.35);
        var cp7 = new Vector2d_1.Vector2d(0.3, 0);
        var cp8 = new Vector2d_1.Vector2d(0.27, -0.35);
        var cp9 = new Vector2d_1.Vector2d(0.15, -0.6);
        var cp10 = new Vector2d_1.Vector2d(0, -0.72);
        var cp11 = new Vector2d_1.Vector2d(-0.15, -0.6);
        var cp12 = new Vector2d_1.Vector2d(-0.27, -0.35);
        var cp13 = new Vector2d_1.Vector2d(-0.3, 0);
        var cp14 = new Vector2d_1.Vector2d(-0.27, 0.35);
        var px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3;
        var py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72;
        var cp = [[-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4],
            [px0, py5], [px1, py4], [px2, py2], [px3, py0],
            [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4],
            [-px2, -py2], [-px3, py0], [-px2, py2]];
        var knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        var s = new PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence([cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11, cp12, cp13, cp14], knots);
        chai_1.expect(s.controlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11, cp12, cp13, cp14]);
        chai_1.expect(s.knots).to.eql(knots);
        chai_1.expect(s.degree).to.equal(3);
    });
    it('can find the right bound of the definition interval of a periodic BSpline.', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.27, -0.35);
        var cp1 = new Vector2d_1.Vector2d(-0.3, 0);
        var cp2 = new Vector2d_1.Vector2d(-0.27, 0.35);
        var cp3 = new Vector2d_1.Vector2d(-0.15, 0.6);
        var cp4 = new Vector2d_1.Vector2d(0, 0.72);
        var cp5 = new Vector2d_1.Vector2d(0.15, 0.6);
        var cp6 = new Vector2d_1.Vector2d(0.27, 0.35);
        var cp7 = new Vector2d_1.Vector2d(0.3, 0);
        var cp8 = new Vector2d_1.Vector2d(0.27, -0.35);
        var cp9 = new Vector2d_1.Vector2d(0.15, -0.6);
        var cp10 = new Vector2d_1.Vector2d(0, -0.72);
        var cp11 = new Vector2d_1.Vector2d(-0.15, -0.6);
        var cp12 = new Vector2d_1.Vector2d(-0.27, -0.35);
        var cp13 = new Vector2d_1.Vector2d(-0.3, 0);
        var cp14 = new Vector2d_1.Vector2d(-0.27, 0.35);
        var px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3;
        var py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72;
        var cpCrv = [[-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4],
            [px0, py5], [px1, py4], [px2, py2], [px3, py0],
            [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4],
            [-px2, -py2], [-px3, py0], [-px2, py2]];
        var knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        var s = new PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence([cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11, cp12, cp13, cp14], knots);
        chai_1.expect(s.degree).to.eql(3);
        var rBound = s.findKnotAbscissaeRightBound();
        chai_1.expect(rBound).to.eql(12);
        var cp = new Vector2d_1.Vector2d(0.0, 1.0);
        knots = [-3, -2, -1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 14, 15];
        // cross influence with getKnotIndicesBoundingNormalizedBasis -> must be analyzed 
        // s = new PeriodicBSplineR1toR2withOpenKnotSequence([ cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp], knots)
        // expect(s.degree).to.eql(3)
        // rBound = s.findKnotAbscissaeRightBound();
        // expect(rBound).to.eql(12)
        knots = [-2, -1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 14];
        // cross influence with getKnotIndicesBoundingNormalizedBasis -> must be analyzed 
        // s = new PeriodicBSplineR1toR2withOpenKnotSequence([ cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp], knots)
        // expect(s.degree).to.eql(3)
        // rBound = s.findKnotAbscissaeRightBound();
        // expect(rBound).to.eql(12)
    });
    it('can convert a periodic BSpline with open knot sequence to a periodic BSpline.', function () {
        // triangular control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(0, 0);
        var knots = [-1, 0, 0, 0, 1, 1, 1, 2];
        var s = new PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence([cp0, cp1, cp2, cp3], knots);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.controlPoints).to.eql([cp0, cp1, cp2, cp3]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints).to.eql([cp0, cp1, cp2]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0.5).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0.5).y).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sPeriodic = s === null || s === void 0 ? void 0 : s.toPeriodicBSplineR1toR2();
        chai_1.expect(sPeriodic === null || sPeriodic === void 0 ? void 0 : sPeriodic.degree).to.eql(3);
        chai_1.expect(sPeriodic === null || sPeriodic === void 0 ? void 0 : sPeriodic.controlPoints.length).to.eql(3);
        chai_1.expect(sPeriodic === null || sPeriodic === void 0 ? void 0 : sPeriodic.controlPoints).to.eql([cp0, cp1, cp2]);
        chai_1.expect(sPeriodic === null || sPeriodic === void 0 ? void 0 : sPeriodic.knots.length).to.eql(6);
        chai_1.expect(sPeriodic === null || sPeriodic === void 0 ? void 0 : sPeriodic.knots).to.eql([0, 0, 0, 1, 1, 1]);
        chai_1.expect(sPeriodic === null || sPeriodic === void 0 ? void 0 : sPeriodic.evaluate(0).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPeriodic === null || sPeriodic === void 0 ? void 0 : sPeriodic.evaluate(0).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPeriodic === null || sPeriodic === void 0 ? void 0 : sPeriodic.evaluate(1).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPeriodic === null || sPeriodic === void 0 ? void 0 : sPeriodic.evaluate(1).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPeriodic === null || sPeriodic === void 0 ? void 0 : sPeriodic.evaluate(0.5).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPeriodic === null || sPeriodic === void 0 ? void 0 : sPeriodic.evaluate(0.5).y).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can convert a periodic B-Spline with open knot sequence into a periodic BSpline. Case of variable multiplicity at curve origin', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var cp4 = new Vector2d_1.Vector2d(0.3333333333333333, 1);
        var cp5 = new Vector2d_1.Vector2d(1, 0.3333333333333333);
        var cp6 = new Vector2d_1.Vector2d(0.66666666666666, 0.66666666666666);
        var knots = [-1, 0, 0, 0, 1, 2, 3, 4, 4, 4, 5];
        var sOpenKnotSeq = new PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence([cp6, cp5, cp3, cp0, cp1, cp4, cp6], knots);
        chai_1.expect(sOpenKnotSeq.degree).to.eql(3);
        chai_1.expect(sOpenKnotSeq.freeControlPoints).to.eql([cp6, cp5, cp3, cp0, cp1, cp4]);
        chai_1.expect(sOpenKnotSeq.knots).to.eql([-1, 0, 0, 0, 1, 2, 3, 4, 4, 4, 5]);
        chai_1.expect(sOpenKnotSeq === null || sOpenKnotSeq === void 0 ? void 0 : sOpenKnotSeq.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq === null || sOpenKnotSeq === void 0 ? void 0 : sOpenKnotSeq.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq === null || sOpenKnotSeq === void 0 ? void 0 : sOpenKnotSeq.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq === null || sOpenKnotSeq === void 0 ? void 0 : sOpenKnotSeq.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq === null || sOpenKnotSeq === void 0 ? void 0 : sOpenKnotSeq.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq === null || sOpenKnotSeq === void 0 ? void 0 : sOpenKnotSeq.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq === null || sOpenKnotSeq === void 0 ? void 0 : sOpenKnotSeq.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq === null || sOpenKnotSeq === void 0 ? void 0 : sOpenKnotSeq.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sPer = sOpenKnotSeq === null || sOpenKnotSeq === void 0 ? void 0 : sOpenKnotSeq.toPeriodicBSplineR1toR2();
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.degree).to.eql(3);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.freeControlPoints.length).to.eql(6);
        // expect(sPer?.freeControlPoints).to.eql([cp0, cp1, cp4, cp6, cp5, cp3])
        var cpX = [-1, -1, 0.333333333333333, 0.66666666666666, 1, 1];
        var cpY = [-1, 1, 1, 0.66666666666666, 0.333333333333333, -1];
        if (sPer !== undefined) {
            for (var i = 0; i < sPer.freeControlPoints.length; i++) {
                chai_1.expect(sPer.freeControlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sPer.freeControlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.controlPoints.length).to.eql(6);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.knots.length).to.eql(9);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 4]);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var knots1 = [-2, -1, 0, 0, 1, 2, 3, 4, 4, 5, 6];
        var sOpenKnotSeq1 = new PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence([cp4, cp5, cp3, cp0, cp1, cp4, cp5], knots1);
        chai_1.expect(sOpenKnotSeq1.degree).to.eql(3);
        chai_1.expect(sOpenKnotSeq1.freeControlPoints).to.eql([cp4, cp5, cp3, cp0, cp1]);
        chai_1.expect(sOpenKnotSeq1.knots).to.eql([-2, -1, 0, 0, 1, 2, 3, 4, 4, 5, 6]);
        chai_1.expect(sOpenKnotSeq1 === null || sOpenKnotSeq1 === void 0 ? void 0 : sOpenKnotSeq1.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq1 === null || sOpenKnotSeq1 === void 0 ? void 0 : sOpenKnotSeq1.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq1 === null || sOpenKnotSeq1 === void 0 ? void 0 : sOpenKnotSeq1.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq1 === null || sOpenKnotSeq1 === void 0 ? void 0 : sOpenKnotSeq1.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq1 === null || sOpenKnotSeq1 === void 0 ? void 0 : sOpenKnotSeq1.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq1 === null || sOpenKnotSeq1 === void 0 ? void 0 : sOpenKnotSeq1.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq1 === null || sOpenKnotSeq1 === void 0 ? void 0 : sOpenKnotSeq1.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq1 === null || sOpenKnotSeq1 === void 0 ? void 0 : sOpenKnotSeq1.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sPer1 = sOpenKnotSeq1 === null || sOpenKnotSeq1 === void 0 ? void 0 : sOpenKnotSeq1.toPeriodicBSplineR1toR2();
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.degree).to.eql(3);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.freeControlPoints.length).to.eql(5);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.freeControlPoints).to.eql([cp0, cp1, cp4, cp5, cp3]);
        var cpX1 = [-1, -1, 0.333333333333333, 1, 1];
        var cpY1 = [-1, 1, 1, 0.333333333333333, -1];
        if (sPer1 !== undefined) {
            for (var i = 0; i < sPer1.freeControlPoints.length; i++) {
                chai_1.expect(sPer1.freeControlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sPer1.freeControlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.controlPoints.length).to.eql(5);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.knots.length).to.eql(7);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.knots).to.eql([0, 0, 1, 2, 3, 4, 4]);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var knots2 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
        var sOpenKnotSeq2 = new PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence([cp1, cp2, cp3, cp0, cp1, cp2, cp3], knots2);
        chai_1.expect(sOpenKnotSeq2.degree).to.eql(3);
        chai_1.expect(sOpenKnotSeq2.freeControlPoints).to.eql([cp1, cp2, cp3, cp0]);
        chai_1.expect(sOpenKnotSeq2.knots).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]);
        chai_1.expect(sOpenKnotSeq2 === null || sOpenKnotSeq2 === void 0 ? void 0 : sOpenKnotSeq2.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq2 === null || sOpenKnotSeq2 === void 0 ? void 0 : sOpenKnotSeq2.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq2 === null || sOpenKnotSeq2 === void 0 ? void 0 : sOpenKnotSeq2.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq2 === null || sOpenKnotSeq2 === void 0 ? void 0 : sOpenKnotSeq2.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq2 === null || sOpenKnotSeq2 === void 0 ? void 0 : sOpenKnotSeq2.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq2 === null || sOpenKnotSeq2 === void 0 ? void 0 : sOpenKnotSeq2.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq2 === null || sOpenKnotSeq2 === void 0 ? void 0 : sOpenKnotSeq2.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpenKnotSeq2 === null || sOpenKnotSeq2 === void 0 ? void 0 : sOpenKnotSeq2.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sPer2 = sOpenKnotSeq2 === null || sOpenKnotSeq2 === void 0 ? void 0 : sOpenKnotSeq2.toPeriodicBSplineR1toR2();
        chai_1.expect(sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.degree).to.eql(3);
        chai_1.expect(sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.freeControlPoints.length).to.eql(4);
        chai_1.expect(sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        var cpX2 = [-1, -1, 1, 1];
        var cpY2 = [-1, 1, 1, -1];
        if (sPer2 !== undefined) {
            for (var i = 0; i < sPer2.freeControlPoints.length; i++) {
                chai_1.expect(sPer2.freeControlPoints[i].x).to.be.closeTo(cpX2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sPer2.freeControlPoints[i].y).to.be.closeTo(cpY2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.controlPoints.length).to.eql(4);
        chai_1.expect(sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.knots.length).to.eql(5);
        chai_1.expect(sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.knots).to.eql([0, 1, 2, 3, 4]);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
});
