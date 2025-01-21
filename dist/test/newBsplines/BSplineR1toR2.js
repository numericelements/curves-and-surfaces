"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var BSplineR1toR2_1 = require("../../src/newBsplines/BSplineR1toR2");
var BSplineR1toR2_2 = require("../../src/newBsplines/BSplineR1toR2");
var Vector2d_1 = require("../../src/mathVector/Vector2d");
var AbstractBSplineR1toR2_1 = require("../../src/newBsplines/AbstractBSplineR1toR2");
var Curves_1 = require("../namedConstants/Curves");
var KnotIndexIncreasingSequence_1 = require("../../src/newBsplines/KnotIndexIncreasingSequence");
var KnotSequences_1 = require("../../src/namedConstants/KnotSequences");
var Curves_2 = require("../namedConstants/Curves");
var Piegl_Tiller_NURBS_Book_1 = require("../../src/newBsplines/Piegl_Tiller_NURBS_Book");
describe('BSplineR1toR2', function () {
    it('can be initialized without an initializer', function () {
        var s = new BSplineR1toR2_1.BSplineR1toR2();
        chai_1.expect(s.controlPoints[0]).to.eql(new Vector2d_1.Vector2d(0, 0));
        chai_1.expect(s.knots).to.eql([0, 1]);
    });
    it('can be initialized with an initializer', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var s = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2], [0, 0, 0, 1, 1, 1]);
        chai_1.expect(s.controlPoints).to.eql([cp0, cp1, cp2]);
        chai_1.expect(s.knots).to.eql([0, 0, 0, 1, 1, 1]);
        chai_1.expect(s.degree).to.equal(2);
    });
    it('can be created by the factory function create_BSpline_R1_to_R2', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        //const s = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1])
        var s = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2], [0, 0, 0, 1, 1, 1]);
        chai_1.expect(s.controlPoints).to.eql([cp0, cp1, cp2]);
        chai_1.expect(s.knots).to.eql([0, 0, 0, 1, 1, 1]);
        chai_1.expect(s.degree).to.equal(2);
    });
    it('throws an exception at construction if the degree of the B-spline is negative', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        chai_1.expect(function () { return new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2], [0, 0, 1]); }).to.throw();
    });
    it('throws an exception at construction if the number of knots differs from the number of CPs by less than the degree', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var knots = [0, 0, 1, 1];
        chai_1.expect(function () { return new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2], knots); }).to.throw();
    });
    it('can be used to evaluate a Bezier curve', function () {
        var u = 0.22;
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var b02 = Math.pow(1 - u, 2);
        var b12 = 2 * u * (1 - u);
        var b22 = Math.pow(u, 2);
        var s = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2], [0, 0, 0, 1, 1, 1]);
        var result = (cp0.multiply(b02)).add(cp1.multiply(b12)).add(cp2.multiply(b22));
        chai_1.expect(s.evaluate(u)).to.eql(result);
    });
    it('can be safely cloned', function () {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var s1 = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2], [0, 0, 0, 1, 1, 1]);
        //let s1 = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1])
        var s2 = s1.clone();
        s2.optimizerStep([1, 0, 0, 0, 0, 0]);
        chai_1.expect(s2.controlPoints[0].x).to.equal(0.5);
        chai_1.expect(s1.controlPoints[0].x).to.equal(-0.5);
    });
    it('can insert a new knot', function () {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var s1 = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2], [0, 0, 0, 1, 1, 1]);
        //let s1 = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1] )
        var s2 = s1.clone();
        s2.insertKnot(0.5);
        s2.insertKnot(0.25);
        s2.insertKnot(0.75);
        chai_1.expect(Math.abs(s2.evaluate(0.3).x - s1.evaluate(0.3).x)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        chai_1.expect(Math.abs(s2.evaluate(0.3).y - s1.evaluate(0.3).y)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        chai_1.expect(s2.knots).to.eql([0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1]);
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        var cp3 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp4 = new Vector2d_1.Vector2d(-0.25, 0.25);
        var cp5 = new Vector2d_1.Vector2d(0.25, 0.25);
        var cp6 = new Vector2d_1.Vector2d(0.5, 0);
        var cp = [cp3, cp4, cp5, cp6];
        var knots = [0, 0, 0, 0, 1, 1, 1, 1];
        var spline = BSplineR1toR2_2.create_BSplineR1toR2V2d(cp, knots);
        var spline1 = spline.clone();
        spline1.insertKnot(0.5);
        spline1.insertKnot(0.25);
        spline1.insertKnot(0.75);
        chai_1.expect(Math.abs(spline.evaluate(0.3).x - spline1.evaluate(0.3).x)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        chai_1.expect(Math.abs(spline.evaluate(0.3).y - spline1.evaluate(0.3).y)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        chai_1.expect(spline1.knots).to.eql([0, 0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1, 1]);
    });
    it('can insert a new knot with multiplicity greater than one', function () {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var cp3 = new Vector2d_1.Vector2d(1.0, -2);
        var s1 = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1]);
        //let s1 = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1] )
        var s2 = s1.clone();
        s2.insertKnot(0.5, 2);
        chai_1.expect(s2.knots).to.eql([0, 0, 0, 0, 0.5, 0.5, 1, 1, 1, 1]);
        chai_1.expect(Math.abs(s1.evaluate(0.5).x - s2.evaluate(0.5).x)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        chai_1.expect(Math.abs(s1.evaluate(0.5).y - s2.evaluate(0.5).y)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
    });
    it('can return a section of a curve', function () {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var s1 = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2], [0, 0, 0, 1, 1, 1]);
        //let s1 = create_BSpline_R1_to_R2( [[-0.5, 0], [0, 8], [0.5, 0]], [ 0, 0, 0, 1, 1, 1] )
        var s2 = s1.extract(0.2, 0.5);
        var s3 = s1.extract(0, 1);
        var offset = 0.2;
        chai_1.expect(s2.increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0))).to.eql(0.0);
        chai_1.expect(Math.abs(s1.evaluate(0.2).x - s2.evaluate(0.2 - offset).x)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        chai_1.expect(Math.abs(s1.evaluate(0.2).y - s2.evaluate(0.2 - offset).y)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        chai_1.expect(Math.abs(s1.evaluate(0.3).x - s2.evaluate(0.3 - offset).x)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        chai_1.expect(Math.abs(s1.evaluate(0.3).y - s2.evaluate(0.3 - offset).y)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        chai_1.expect(Math.abs(s1.evaluate(0.5).x - s2.evaluate(0.5 - offset).x)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        chai_1.expect(Math.abs(s1.evaluate(0.5).y - s2.evaluate(0.5 - offset).y)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        chai_1.expect(s2.knots.length).to.equal(6);
        chai_1.expect(s3.knots.length).to.equal(6);
        chai_1.expect(Math.abs(s1.evaluate(0.5).x - s3.evaluate(0.5).x)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
        chai_1.expect(Math.abs(s1.evaluate(0.5).y - s3.evaluate(0.5).y)).to.be.below(Curves_1.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1);
    });
    it('extends a curve with intermediate knots on its left hand side. Check new knot sequence ', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var cp3 = new Vector2d_1.Vector2d(1.0, 1.0);
        var cp4 = new Vector2d_1.Vector2d(1.5, 3.0);
        var s1 = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.6666666, 1, 1, 1, 1]);
        var s2 = s1.extend(-0.01);
        chai_1.expect(s2.knots).to.eql([0, 0, 0, 0, 0.6766666, 1.01, 1.01, 1.01, 1.01]);
    });
    it('extends a curve with intermediate knots on its right hand side. Check new knot sequence ', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var cp3 = new Vector2d_1.Vector2d(1.0, 1.0);
        var cp4 = new Vector2d_1.Vector2d(1.5, 3.0);
        var s1 = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.6666666, 1, 1, 1, 1]);
        var s2 = s1.extend(1.01);
        // to be checked with the new version of knot sequence (revertKnotSequence)
        // expect(s2.knots, 'knot sequence: ').to.eql([0, 0, 0, 0, 0.6666666, 1.01, 1.01, 1.01, 1.01])
    });
    it('split a curve without intermediate knots on its right hand side. Check new knot sequence ', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var cp3 = new Vector2d_1.Vector2d(1.0, 1.0);
        var s1 = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1]);
        var s2 = s1.splitAt(0.01, AbstractBSplineR1toR2_1.curveSegment.AFTER);
        chai_1.expect(s2.controlPoints.length).to.eql(4);
        chai_1.expect(s2.knots, 'knot sequence: ').to.eql([0, 0, 0, 0, 0.99, 0.99, 0.99, 0.99]);
    });
    it('split a curve with intermediate knots on its right hand side. Check new knot sequence ', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var cp3 = new Vector2d_1.Vector2d(1.0, 1.0);
        var cp4 = new Vector2d_1.Vector2d(1.5, 3.0);
        var uMax = 1;
        var s1 = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.6666666, uMax, uMax, uMax, uMax]);
        var splitAbscissa = 0.01;
        var sInsKnot = s1.clone();
        var startVertex = sInsKnot.evaluate(splitAbscissa);
        sInsKnot.insertKnot(splitAbscissa, sInsKnot.degree);
        var knotAbscissae = sInsKnot.getDistinctKnots();
        chai_1.expect(splitAbscissa).to.eql(knotAbscissae[1]);
        chai_1.expect(startVertex.x).to.be.closeTo(sInsKnot.controlPoints[sInsKnot.degree].x, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(startVertex.y).to.be.closeTo(sInsKnot.controlPoints[sInsKnot.degree].y, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sInsKnot.knots).to.eql([0, 0, 0, 0, splitAbscissa, splitAbscissa, splitAbscissa, 0.6666666, uMax, uMax, uMax, uMax]);
        var s2 = s1.splitAt(splitAbscissa, AbstractBSplineR1toR2_1.curveSegment.AFTER);
        chai_1.expect(s2.controlPoints.length).to.eql(5);
        chai_1.expect(s2.increasingKnotSequence.indexKnotOrigin.knotIndex).to.eql(0);
        chai_1.expect(s2.increasingKnotSequence.uMax).to.eql(uMax - splitAbscissa);
        var knots = [splitAbscissa, splitAbscissa, splitAbscissa, splitAbscissa, 0.6666666, uMax, uMax, uMax, uMax];
        var shiftedKnots = Piegl_Tiller_NURBS_Book_1.resetKnotAbscissaeToOrigin(knots);
        for (var i = 0; i < shiftedKnots.length; i++) {
            chai_1.expect(s2.knots[i]).to.be.closeTo(shiftedKnots[i], KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
        }
    });
    it('split a curve with intermediate knots on its left hand side. Check new knot sequence ', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var cp3 = new Vector2d_1.Vector2d(1.0, 1.0);
        var cp4 = new Vector2d_1.Vector2d(1.5, 3.0);
        var uMax = 1;
        var s1 = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.6666666, uMax, uMax, uMax, uMax]);
        var sInsKnot = s1.clone();
        var splitAbscissa = 0.8;
        var maxMultiplicity = sInsKnot.degree + 1;
        var startVertex = sInsKnot.evaluate(splitAbscissa);
        sInsKnot.insertKnot(splitAbscissa, sInsKnot.degree);
        chai_1.expect(sInsKnot.knots).to.eql([0, 0, 0, 0, 0.6666666, splitAbscissa, splitAbscissa, splitAbscissa, uMax, uMax, uMax, uMax]);
        var s2 = s1.splitAt(splitAbscissa, AbstractBSplineR1toR2_1.curveSegment.AFTER);
        chai_1.expect(s2.controlPoints.length).to.eql(maxMultiplicity);
        chai_1.expect(s2.knots.length).to.eql(2 * maxMultiplicity);
        for (var i = 0; i < maxMultiplicity; i++) {
            chai_1.expect(s2.knots[i], 'knot : ').to.eql(0);
        }
        for (var i = 2 * maxMultiplicity; i < 2 * maxMultiplicity; i++) {
            chai_1.expect(s2.knots[i], 'knot : ').to.be.closeTo(uMax - splitAbscissa, KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
        }
        chai_1.expect(s2.increasingKnotSequence.indexKnotOrigin.knotIndex).to.eql(0);
        chai_1.expect(s2.increasingKnotSequence.uMax).to.eql(uMax - splitAbscissa);
        chai_1.expect(s2.controlPoints[0].x).to.be.closeTo(startVertex.x, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2.controlPoints[0].y).to.be.closeTo(startVertex.y, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2.controlPoints[s2.controlPoints.length - 1].x).to.be.closeTo(sInsKnot.controlPoints[sInsKnot.controlPoints.length - 1].x, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2.controlPoints[s2.controlPoints.length - 1].y).to.be.closeTo(sInsKnot.controlPoints[sInsKnot.controlPoints.length - 1].y, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('split a curve without intermediate knots on its right hand side. Check new knot sequence ', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var cp3 = new Vector2d_1.Vector2d(1.0, 1.0);
        var uMax = 1;
        var s1 = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, uMax, uMax, uMax, uMax]);
        var splitAbscissa = 0.1;
        var startVertex = s1.evaluate(splitAbscissa);
        var s2 = s1.splitAt(splitAbscissa, AbstractBSplineR1toR2_1.curveSegment.BEFORE);
        var maxMultiplicity = s2.degree + 1;
        chai_1.expect(s2.controlPoints.length).to.eql(maxMultiplicity);
        chai_1.expect(s2.knots.length).to.eql(2 * maxMultiplicity);
        for (var i = 0; i < maxMultiplicity; i++) {
            chai_1.expect(s2.knots[i], 'knot : ').to.eql(0);
        }
        for (var i = 2 * maxMultiplicity; i < 2 * maxMultiplicity; i++) {
            chai_1.expect(s2.knots[i], 'knot : ').to.be.closeTo(splitAbscissa, KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
        }
        chai_1.expect(s2.increasingKnotSequence.uMax).to.eql(splitAbscissa);
        chai_1.expect(s2.increasingKnotSequence.indexKnotOrigin.knotIndex).to.eql(0);
        chai_1.expect(s2.controlPoints[s2.controlPoints.length - 1].x).to.be.closeTo(startVertex.x, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2.controlPoints[s2.controlPoints.length - 1].y).to.be.closeTo(startVertex.y, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('split a curve with intermediate knots on its right hand side. Check new knot sequence ', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var cp3 = new Vector2d_1.Vector2d(1.0, 1.0);
        var cp4 = new Vector2d_1.Vector2d(1.5, 3.0);
        var uMax = 1;
        var s1 = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.6666666, uMax, uMax, uMax, uMax]);
        var sInsKnot = s1.clone();
        var splitAbscissa = 0.5;
        var startVertex = s1.evaluate(splitAbscissa);
        sInsKnot.insertKnot(splitAbscissa, sInsKnot.degree);
        chai_1.expect(sInsKnot.knots).to.eql([0, 0, 0, 0, splitAbscissa, splitAbscissa, splitAbscissa, 0.6666666, uMax, uMax, uMax, uMax]);
        var s2 = s1.splitAt(splitAbscissa, AbstractBSplineR1toR2_1.curveSegment.BEFORE);
        var maxMultiplicity = s2.degree + 1;
        chai_1.expect(s2.controlPoints.length).to.eql(maxMultiplicity);
        chai_1.expect(s2.increasingKnotSequence.uMax).to.eql(splitAbscissa);
        chai_1.expect(s2.increasingKnotSequence.indexKnotOrigin.knotIndex).to.eql(0);
        chai_1.expect(s2.knots, 'knot sequence: ').to.eql([0, 0, 0, 0, splitAbscissa, splitAbscissa, splitAbscissa, splitAbscissa]);
        chai_1.expect(s2.controlPoints[s2.controlPoints.length - 1].x).to.be.closeTo(startVertex.x, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2.controlPoints[s2.controlPoints.length - 1].y).to.be.closeTo(startVertex.y, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('split a curve with intermediate knots on its left hand side. Check new knot sequence ', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var cp3 = new Vector2d_1.Vector2d(1.0, 1.0);
        var cp4 = new Vector2d_1.Vector2d(1.5, 3.0);
        var uMax = 1;
        var s1 = BSplineR1toR2_2.create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.6666666, uMax, uMax, uMax, uMax]);
        var sInsKnot = s1.clone();
        var splitAbscissa = 0.8;
        var startVertex = s1.evaluate(splitAbscissa);
        sInsKnot.insertKnot(splitAbscissa, sInsKnot.degree);
        chai_1.expect(sInsKnot.knots).to.eql([0, 0, 0, 0, 0.6666666, splitAbscissa, splitAbscissa, splitAbscissa, uMax, uMax, uMax, uMax]);
        var s2 = s1.splitAt(splitAbscissa, AbstractBSplineR1toR2_1.curveSegment.BEFORE);
        var maxMultiplicity = s2.degree + 1;
        chai_1.expect(s2.controlPoints.length).to.eql(maxMultiplicity + 1);
        chai_1.expect(s2.increasingKnotSequence.uMax).to.eql(splitAbscissa);
        chai_1.expect(s2.increasingKnotSequence.indexKnotOrigin.knotIndex).to.eql(0);
        chai_1.expect(s2.knots, 'knot sequence: ').to.eql([0, 0, 0, 0, 0.6666666, splitAbscissa, splitAbscissa, splitAbscissa, splitAbscissa]);
        chai_1.expect(s2.controlPoints[s2.controlPoints.length - 1].x).to.be.closeTo(startVertex.x, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2.controlPoints[s2.controlPoints.length - 1].y).to.be.closeTo(startVertex.y, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can generate the intermediate splines required to increment the degree of a non uniform B-spline without intermediate knots', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var cp3 = new Vector2d_1.Vector2d(1.0, 1.0);
        var s1 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1]);
        var maxMultiplicity = s1.degree + 1;
        var uMax = 1;
        var intermSplines = s1.generateIntermediateSplinesForDegreeElevation();
        chai_1.expect(intermSplines.knotVectors.length).to.eql(maxMultiplicity);
        chai_1.expect(intermSplines.CPs.length).to.eql(maxMultiplicity);
        for (var i = 0; i < s1.degree; i++) {
            chai_1.expect(intermSplines.knotVectors[i]).to.eql([0, 0, 0, 0, 0, uMax, uMax, uMax, uMax, uMax]);
        }
        for (var i = 0; i < maxMultiplicity; i++) {
            chai_1.expect(intermSplines.CPs[i].length).to.eql(maxMultiplicity + 1);
        }
        chai_1.expect(intermSplines.CPs[0]).to.eql([cp0, cp0, cp1, cp2, cp3]);
        chai_1.expect(intermSplines.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3]);
        chai_1.expect(intermSplines.CPs[2]).to.eql([cp0, cp1, cp2, cp2, cp3]);
        chai_1.expect(intermSplines.CPs[3]).to.eql([cp0, cp1, cp2, cp3, cp3]);
    });
    it('can generate the intermediate splines required to increment the degree of a non uniform B-spline with intermediate knots', function () {
        var cp0 = new Vector2d_1.Vector2d(0, 1);
        var cp1 = new Vector2d_1.Vector2d(1, 1);
        var cp2 = new Vector2d_1.Vector2d(2, 1);
        var cp3 = new Vector2d_1.Vector2d(3, 1);
        var cp4 = new Vector2d_1.Vector2d(4, 1);
        var s1 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.5, 1, 1, 1, 1]);
        var intermSplines = s1.generateIntermediateSplinesForDegreeElevation();
        chai_1.expect(intermSplines.knotVectors.length).to.eql(4);
        chai_1.expect(intermSplines.CPs.length).to.eql(4);
        chai_1.expect(intermSplines.knotVectors[0]).to.eql([0, 0, 0, 0, 0, 0.5, 0.5, 1, 1, 1, 1, 1]);
        chai_1.expect(intermSplines.knotVectors[1]).to.eql([0, 0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1]);
        chai_1.expect(intermSplines.knotVectors[2]).to.eql([0, 0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1]);
        chai_1.expect(intermSplines.knotVectors[3]).to.eql([0, 0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1]);
        chai_1.expect(intermSplines.CPs[0].length).to.eql(7);
        chai_1.expect(intermSplines.CPs[0]).to.eql([cp0, cp0, cp1, cp2, cp3, cp4, cp4]);
        chai_1.expect(intermSplines.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp4]);
        chai_1.expect(intermSplines.CPs[2]).to.eql([cp0, cp1, cp2, cp2, cp3, cp4]);
        chai_1.expect(intermSplines.CPs[3]).to.eql([cp0, cp1, cp2, cp3, cp3, cp4]);
    });
    it('can generate the intermediate splines required to increment the degree of a non uniform B-spline with intermediate knots with multiplicity greater than 1', function () {
        var cp0 = new Vector2d_1.Vector2d(0, 1);
        var cp1 = new Vector2d_1.Vector2d(1, 1);
        var cp2 = new Vector2d_1.Vector2d(2, 1);
        var cp3 = new Vector2d_1.Vector2d(3, 1);
        var cp4 = new Vector2d_1.Vector2d(4, 1);
        var s1 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0.5, 0.5, 1, 1, 1]);
        var intermSplines = s1.generateIntermediateSplinesForDegreeElevation();
        chai_1.expect(intermSplines.knotVectors.length).to.eql(3);
        chai_1.expect(intermSplines.CPs.length).to.eql(3);
        chai_1.expect(intermSplines.knotVectors[0]).to.eql([0, 0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1, 1]);
        chai_1.expect(intermSplines.knotVectors[1]).to.eql([0, 0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1, 1]);
        chai_1.expect(intermSplines.knotVectors[2]).to.eql([0, 0, 0, 0, 0.5, 0.5, 1, 1, 1, 1]);
        chai_1.expect(intermSplines.CPs[0].length).to.eql(7);
        chai_1.expect(intermSplines.CPs[0]).to.eql([cp0, cp0, cp1, cp2, cp3, cp3, cp4]);
        chai_1.expect(intermSplines.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp4, cp4]);
        chai_1.expect(intermSplines.CPs[2]).to.eql([cp0, cp1, cp2, cp2, cp3, cp4]);
    });
    it('can insert a knot using Boehm algorithm with comparison with insertKnot method', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, 0);
        var cp4 = new Vector2d_1.Vector2d(1, -1);
        var cp5 = new Vector2d_1.Vector2d(0, -1);
        var cp6 = new Vector2d_1.Vector2d(0, 0);
        var knots = [0, 0, 1, 2, 3, 4, 5, 6, 6];
        var s = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots);
        var sp = s.clone();
        chai_1.expect(s === null || s === void 0 ? void 0 : s.controlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5, cp6]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.degree).to.eql(1);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4)).to.eql(cp4);
        // requires an appropriate constructor to enable the generation of intermediate knots with multiplicity equal to maxMultiplicity
        // s?.insertKnotBoehmAlgorithm(4);
        // expect(s?.controlPoints.length).to.eql(8)
        // expect(s?.controlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp4, cp5, cp6])
        // expect(s?.knots.length).to.eql(10)
        // expect(s?.knots).to.eql([0, 0, 1, 2, 3, 4, 4, 5, 6, 6])
        // expect(s?.evaluate(4)).to.eql(cp4)
        // sp.insertKnot(4)
        // expect(s.knots).to.eql(sp.knots)
        // expect(s.controlPoints).to.eql(sp.controlPoints)
        var knots1 = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5];
        var sp1 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots1);
        var sp2 = sp1.clone();
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.degree).to.eql(2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(4)).to.eql(new Vector2d_1.Vector2d(0.5, -1));
        sp1 === null || sp1 === void 0 ? void 0 : sp1.insertKnotBoehmAlgorithm(4);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.knots.length).to.eql(11);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 5, 5, 5]);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.controlPoints.length).to.eql(8);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.controlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, new Vector2d_1.Vector2d(0.5, -1), cp5, cp6]);
        sp2.insertKnot(4);
        chai_1.expect(sp1.knots).to.eql(sp2.knots);
        chai_1.expect(sp1.controlPoints).to.eql(sp2.controlPoints);
        var knots2 = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5];
        var sp3 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots2);
        var sp4 = sp3.clone();
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.evaluate(3)).to.eql(new Vector2d_1.Vector2d(1, -0.5));
        sp3 === null || sp3 === void 0 ? void 0 : sp3.insertKnotBoehmAlgorithm(3);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.knots.length).to.eql(11);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.knots).to.eql([0, 0, 0, 1, 2, 3, 3, 4, 5, 5, 5]);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.controlPoints.length).to.eql(8);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.controlPoints).to.eql([cp0, cp1, cp2, cp3, new Vector2d_1.Vector2d(1, -0.5), cp4, cp5, cp6]);
        sp4.insertKnot(3);
        chai_1.expect(sp3.knots).to.eql(sp4.knots);
        chai_1.expect(sp3.controlPoints).to.eql(sp4.controlPoints);
        var knots3 = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5];
        var sp5 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots3);
        var sp6 = sp5.clone();
        chai_1.expect(sp5 === null || sp5 === void 0 ? void 0 : sp5.evaluate(2)).to.eql(new Vector2d_1.Vector2d(1, 0.5));
        sp5 === null || sp5 === void 0 ? void 0 : sp5.insertKnotBoehmAlgorithm(2);
        chai_1.expect(sp5 === null || sp5 === void 0 ? void 0 : sp5.knots.length).to.eql(11);
        chai_1.expect(sp5 === null || sp5 === void 0 ? void 0 : sp5.knots).to.eql([0, 0, 0, 1, 2, 2, 3, 4, 5, 5, 5]);
        chai_1.expect(sp5 === null || sp5 === void 0 ? void 0 : sp5.controlPoints.length).to.eql(8);
        chai_1.expect(sp5 === null || sp5 === void 0 ? void 0 : sp5.controlPoints).to.eql([cp0, cp1, cp2, new Vector2d_1.Vector2d(1, 0.5), cp3, cp4, cp5, cp6]);
        sp6.insertKnot(2);
        chai_1.expect(sp5.knots).to.eql(sp6.knots);
        chai_1.expect(sp5.controlPoints).to.eql(sp6.controlPoints);
        var knots4 = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5];
        var sp7 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots4);
        var sp8 = sp7.clone();
        chai_1.expect(sp7 === null || sp7 === void 0 ? void 0 : sp7.evaluate(1)).to.eql(new Vector2d_1.Vector2d(0.5, 1));
        sp7 === null || sp7 === void 0 ? void 0 : sp7.insertKnotBoehmAlgorithm(1);
        chai_1.expect(sp7 === null || sp7 === void 0 ? void 0 : sp7.knots.length).to.eql(11);
        chai_1.expect(sp7 === null || sp7 === void 0 ? void 0 : sp7.knots).to.eql([0, 0, 0, 1, 1, 2, 3, 4, 5, 5, 5]);
        chai_1.expect(sp7 === null || sp7 === void 0 ? void 0 : sp7.controlPoints.length).to.eql(8);
        chai_1.expect(sp7 === null || sp7 === void 0 ? void 0 : sp7.controlPoints).to.eql([cp0, cp1, new Vector2d_1.Vector2d(0.5, 1), cp2, cp3, cp4, cp5, cp6]);
        sp8.insertKnot(1);
        chai_1.expect(sp7.knots).to.eql(sp8.knots);
        chai_1.expect(sp7.controlPoints).to.eql(sp8.controlPoints);
        var knots5 = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5];
        var sp9 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots5);
        var sp10 = sp9.clone();
        chai_1.expect(sp9 === null || sp9 === void 0 ? void 0 : sp9.evaluate(3.5)).to.eql(new Vector2d_1.Vector2d(0.875, -0.875));
        sp9 === null || sp9 === void 0 ? void 0 : sp9.insertKnotBoehmAlgorithm(3.5);
        chai_1.expect(sp9 === null || sp9 === void 0 ? void 0 : sp9.knots.length).to.eql(11);
        chai_1.expect(sp9 === null || sp9 === void 0 ? void 0 : sp9.knots).to.eql([0, 0, 0, 1, 2, 3, 3.5, 4, 5, 5, 5]);
        chai_1.expect(sp9 === null || sp9 === void 0 ? void 0 : sp9.controlPoints.length).to.eql(8);
        chai_1.expect(sp9 === null || sp9 === void 0 ? void 0 : sp9.controlPoints).to.eql([cp0, cp1, cp2, cp3, new Vector2d_1.Vector2d(1, -0.75), new Vector2d_1.Vector2d(0.75, -1), cp5, cp6]);
        sp10.insertKnot(3.5);
        chai_1.expect(sp9.knots).to.eql(sp10.knots);
        chai_1.expect(sp9.controlPoints).to.eql(sp10.controlPoints);
    });
    it('can insert a knot into a non uniform B-spline with arbitrary knot sequence using Boehm algorithm', function () {
        var cp0 = new Vector2d_1.Vector2d(0, 1);
        var cp1 = new Vector2d_1.Vector2d(1, 1);
        var cp2 = new Vector2d_1.Vector2d(2, 1);
        var cp3 = new Vector2d_1.Vector2d(3, 1);
        var cp4 = new Vector2d_1.Vector2d(4, 1);
        var s1 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.5, 1, 1, 1, 1]);
        s1.insertKnotBoehmAlgorithm(0.5);
        chai_1.expect(s1.degree).to.eql(3);
        chai_1.expect(s1.knots).to.eql([0, 0, 0, 0, 0.5, 0.5, 1, 1, 1, 1]);
        var cpSolutionX = [0, 1, 1.5, 2.5, 3, 4];
        var cpSolutionY = [1, 1, 1, 1, 1, 1];
        for (var i = 0; i < s1.controlPoints.length; i++) {
            chai_1.expect(s1.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(s1.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
    });
    it('can insert a knot into a uniform B-spline with arbitrary knot sequence using Boehm algorithm', function () {
        var cp0 = new Vector2d_1.Vector2d(0, 1);
        var cp1 = new Vector2d_1.Vector2d(1, 1);
        var cp2 = new Vector2d_1.Vector2d(2, 1);
        var cp3 = new Vector2d_1.Vector2d(3, 1);
        var cp4 = new Vector2d_1.Vector2d(4, 1);
        var s1 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4], [-3, -2, -1, 0, 0.5, 1, 2, 3, 4]);
        chai_1.expect(s1.findSpanBoehmAlgorithm(0).knotIndex).to.eql(3);
        // the knot insertion algorithm must be modified for this configuration because -3 is longer useful
        // s1.insertKnotBoehmAlgorithm(0);
        // expect(s1.degree).to.eql(3)
        // expect(s1.knots).to.eql([-3, -2, -1, 0, 0, 0.5, 1, 2, 3, 4])
        // const cpSolutionX = [0, 0.8, 1.5, 2, 3, 4];
        // const cpSolutionY = [1, 1, 1, 1, 1, 1];
        // for(let i = 0; i < s1.controlPoints.length; i++) {
        //     expect(s1.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        //     expect(s1.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        // }
        // expect(s1.findSpanBoehmAlgorithm(0).knotIndex).to.eql(4)
        // s1.insertKnotBoehmAlgorithm(0);
        // expect(s1.knots).to.eql([-3, -2, -1, 0, 0, 0, 0.5, 1, 2, 3, 4])
        // const cpSolutionX1 = [0, 0.8, 1.2666666666666, 1.5, 2, 3, 4];
        // const cpSolutionY1 = [1, 1, 1, 1, 1, 1, 1];
        // for(let i = 0; i < s1.controlPoints.length; i++) {
        //     expect(s1.controlPoints[i].x).to.be.closeTo(cpSolutionX1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        //     expect(s1.controlPoints[i].y).to.be.closeTo(cpSolutionY1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        // }
    });
    it('can insert knots repeatedly into a cubic B-spline using Boehm algorithm (knot on symmetry axis) (for comparison with periodic B-Splines', function () {
        var cp0 = new Vector2d_1.Vector2d(-1, 0);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(-1, 2);
        var cp3 = new Vector2d_1.Vector2d(0, 2);
        var cp4 = new Vector2d_1.Vector2d(1, 2);
        var cp5 = new Vector2d_1.Vector2d(1, 1);
        var cp6 = new Vector2d_1.Vector2d(1, 0);
        var spl = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6], [0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 4]);
        var spl1 = spl.clone();
        chai_1.expect(spl.degree).to.eql(3);
        chai_1.expect(spl.knots).to.eql([0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 4]);
        chai_1.expect(spl.evaluate(2).x).to.be.closeTo(0, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl.evaluate(2).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        spl.insertKnotBoehmAlgorithm(2);
        chai_1.expect(spl.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 3, 4, 4, 4, 4]);
        chai_1.expect(spl.controlPoints.length).to.eql(8);
        chai_1.expect(spl.evaluate(2).x).to.be.closeTo(0, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl.evaluate(2).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var cpSolutionX = [-1, -1, -1, -0.333333333333, 0.333333333333, 1, 1, 1];
        var cpSolutionY = [0, 1, 2, 2, 2, 2, 1, 0];
        for (var i = 0; i < spl.controlPoints.length; i++) {
            chai_1.expect(spl.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(spl.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
        spl.insertKnotBoehmAlgorithm(2);
        chai_1.expect(spl.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 4, 4, 4]);
        chai_1.expect(spl.controlPoints.length).to.eql(9);
        chai_1.expect(spl.evaluate(2).x).to.be.closeTo(0, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl.evaluate(2).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        cpSolutionX = [-1, -1, -1, -0.333333333333, 0, 0.333333333333, 1, 1, 1];
        cpSolutionY = [0, 1, 2, 2, 2, 2, 2, 1, 0];
        for (var i = 0; i < spl.controlPoints.length; i++) {
            chai_1.expect(spl.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(spl.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
        var spl2 = spl1.clone();
        spl2.insertKnot(2, 2);
        chai_1.expect(spl2.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 4, 4, 4]);
        chai_1.expect(spl2.controlPoints.length).to.eql(9);
        chai_1.expect(spl2.evaluate(2).x).to.be.closeTo(0, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl2.evaluate(2).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        cpSolutionX = [-1, -1, -1, -0.333333333333, 0, 0.333333333333, 1, 1, 1];
        cpSolutionY = [0, 1, 2, 2, 2, 2, 2, 1, 0];
        for (var i = 0; i < spl2.controlPoints.length; i++) {
            chai_1.expect(spl2.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(spl2.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
        spl1.insertKnotBoehmAlgorithm(2, 2);
        chai_1.expect(spl1.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 4, 4, 4]);
        chai_1.expect(spl1.controlPoints.length).to.eql(9);
        chai_1.expect(spl1.evaluate(2).x).to.be.closeTo(0, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl1.evaluate(2).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        cpSolutionX = [-1, -1, -1, -0.333333333333, 0, 0.333333333333, 1, 1, 1];
        cpSolutionY = [0, 1, 2, 2, 2, 2, 2, 1, 0];
        for (var i = 0; i < spl1.controlPoints.length; i++) {
            chai_1.expect(spl1.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(spl1.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
    });
    it('can insert knots repeatedly into a cubic B-spline using Boehm algorithm (knot off symmetry axis) (for comparison with periodic B-Splines', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(-0.5, 1);
        var cp2 = new Vector2d_1.Vector2d(-0.5, 2);
        var cp3 = new Vector2d_1.Vector2d(-0.5, 3);
        var cp4 = new Vector2d_1.Vector2d(0.5, 3);
        var cp5 = new Vector2d_1.Vector2d(0.5, 2);
        var cp6 = new Vector2d_1.Vector2d(0.5, 1);
        var cp7 = new Vector2d_1.Vector2d(0.5, 0);
        var spl = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7], [0, 0, 0, 0, 1, 2, 3, 4, 5, 5, 5, 5]);
        var spl1 = spl.clone();
        chai_1.expect(spl.degree).to.eql(3);
        chai_1.expect(spl.knots).to.eql([0, 0, 0, 0, 1, 2, 3, 4, 5, 5, 5, 5]);
        chai_1.expect(spl.evaluate(2).x).to.be.closeTo(-0.333333333333333, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl.evaluate(2).y).to.be.closeTo(2.833333333333333, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        spl.insertKnotBoehmAlgorithm(2);
        chai_1.expect(spl.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 3, 4, 5, 5, 5, 5]);
        chai_1.expect(spl.controlPoints.length).to.eql(9);
        chai_1.expect(spl.evaluate(2).x).to.be.closeTo(-0.333333333333333, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl.evaluate(2).y).to.be.closeTo(2.833333333333333, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var cpSolutionX = [-0.5, -0.5, -0.5, -0.5, -0.16666666666666, 0.5, 0.5, 0.5, 0.5];
        var cpSolutionY = [0, 1, 2, 2.66666666666, 3, 3, 2, 1, 0];
        for (var i = 0; i < spl.controlPoints.length; i++) {
            chai_1.expect(spl.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(spl.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
        spl.insertKnotBoehmAlgorithm(2);
        chai_1.expect(spl.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 5, 5, 5, 5]);
        chai_1.expect(spl.controlPoints.length).to.eql(10);
        chai_1.expect(spl.evaluate(2).x).to.be.closeTo(-0.333333333333333, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl.evaluate(2).y).to.be.closeTo(2.833333333333333, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        cpSolutionX = [-0.5, -0.5, -0.5, -0.5, -0.3333333333333, -0.16666666666666, 0.5, 0.5, 0.5, 0.5];
        cpSolutionY = [0, 1, 2, 2.66666666666, 2.8333333333333, 3, 3, 2, 1, 0];
        for (var i = 0; i < spl.controlPoints.length; i++) {
            chai_1.expect(spl.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(spl.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
        var spl2 = spl1.clone();
        spl2.insertKnot(2, 2);
        chai_1.expect(spl2.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 5, 5, 5, 5]);
        chai_1.expect(spl2.controlPoints.length).to.eql(10);
        chai_1.expect(spl2.evaluate(2).x).to.be.closeTo(-0.333333333333333, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl2.evaluate(2).y).to.be.closeTo(2.833333333333333, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        cpSolutionX = [-0.5, -0.5, -0.5, -0.5, -0.3333333333333, -0.16666666666666, 0.5, 0.5, 0.5, 0.5];
        cpSolutionY = [0, 1, 2, 2.66666666666, 2.8333333333333, 3, 3, 2, 1, 0];
        for (var i = 0; i < spl2.controlPoints.length; i++) {
            chai_1.expect(spl2.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(spl2.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
        spl1.insertKnotBoehmAlgorithm(2, 2);
        chai_1.expect(spl1.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 5, 5, 5, 5]);
        chai_1.expect(spl1.controlPoints.length).to.eql(10);
        chai_1.expect(spl1.evaluate(2).x).to.be.closeTo(-0.333333333333333, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl1.evaluate(2).y).to.be.closeTo(2.833333333333333, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        cpSolutionX = [-0.5, -0.5, -0.5, -0.5, -0.3333333333333, -0.16666666666666, 0.5, 0.5, 0.5, 0.5];
        cpSolutionY = [0, 1, 2, 2.66666666666, 2.8333333333333, 3, 3, 2, 1, 0];
        for (var i = 0; i < spl1.controlPoints.length; i++) {
            chai_1.expect(spl1.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(spl1.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
    });
    it('can increment the curve degree of a non uniform B-spline without intermediate knots', function () {
        var cp0 = new Vector2d_1.Vector2d(-0.5, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 8);
        var cp2 = new Vector2d_1.Vector2d(0.5, 0);
        var cp3 = new Vector2d_1.Vector2d(1.0, 1.0);
        var s1 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1]);
        var sInc = s1.degreeIncrement();
        chai_1.expect(sInc.degree).to.eql(4);
        chai_1.expect(sInc.knots).to.eql([0, 0, 0, 0, 0, 1, 1, 1, 1, 1]);
        var cpSolutionX = [-0.5, -0.125, 0.25, 0.625, 1];
        var cpSolutionY = [0, 6, 4, 0.25, 1];
        for (var i = 0; i < sInc.controlPoints.length; i++) {
            chai_1.expect(sInc.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(sInc.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
    });
    it('can increment the curve degree of a non uniform B-spline with arbitrary knot sequence', function () {
        var cp0 = new Vector2d_1.Vector2d(0, 1);
        var cp1 = new Vector2d_1.Vector2d(1, 1);
        var cp2 = new Vector2d_1.Vector2d(2, 1);
        var cp3 = new Vector2d_1.Vector2d(3, 1);
        var cp4 = new Vector2d_1.Vector2d(4, 1);
        var s1 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.5, 1, 1, 1, 1]);
        var sInc = s1.degreeIncrement();
        chai_1.expect(sInc.degree).to.eql(4);
        chai_1.expect(sInc.knots).to.eql([0, 0, 0, 0, 0, 0.5, 0.5, 1, 1, 1, 1, 1]);
        var cpSolutionX = [0, 0.75, 1.25, 2, 2.75, 3.25, 4];
        var cpSolutionY = [1, 1, 1, 1, 1, 1, 1];
        for (var i = 0; i < sInc.controlPoints.length; i++) {
            chai_1.expect(sInc.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(sInc.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
    });
    it('can increment the curve degree of a non uniform B-spline v2', function () {
        var cp0 = new Vector2d_1.Vector2d(0, 1);
        var cp1 = new Vector2d_1.Vector2d(1, 1);
        var cp2 = new Vector2d_1.Vector2d(2, 1);
        var cp3 = new Vector2d_1.Vector2d(3, 1);
        var s1 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3], [0, 0, 0, 1, 2, 2, 2]);
        var sInc = s1.degreeIncrement();
        chai_1.expect(sInc.degree).to.eql(3);
        chai_1.expect(sInc.knots).to.eql([0, 0, 0, 0, 1, 1, 2, 2, 2, 2]);
        var cpSolutionX = [0, 0.666666666666666, 1.166666666666666, 1.833333333333333, 2.3333333333333333, 3];
        var cpSolutionY = [1, 1, 1, 1, 1, 1];
        for (var i = 0; i < sInc.controlPoints.length; i++) {
            chai_1.expect(sInc.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(sInc.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
    });
    it('can increment the degree of a closed degree one B-Spline with a rectangular control polygon', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, 0);
        var cp4 = new Vector2d_1.Vector2d(1, -1);
        var cp5 = new Vector2d_1.Vector2d(0, -1);
        var cp6 = new Vector2d_1.Vector2d(0, 0);
        var knots = [0, 0, 1, 2, 3, 4, 5, 6, 6];
        var s = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6], knots);
        var sp = s.clone();
        chai_1.expect(s === null || s === void 0 ? void 0 : s.controlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5, cp6]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.degree).to.eql(1);
        var sInc = s.degreeIncrement();
        chai_1.expect(sInc.degree).to.eql(2);
        chai_1.expect(sInc === null || sInc === void 0 ? void 0 : sInc.knots.length).to.eql(16);
        chai_1.expect(sInc.knots).to.eql([0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6]);
        chai_1.expect(sInc === null || sInc === void 0 ? void 0 : sInc.controlPoints.length).to.eql(13);
        chai_1.expect(sInc === null || sInc === void 0 ? void 0 : sInc.controlPoints).to.eql([cp0, new Vector2d_1.Vector2d(0, 0.5), cp1, new Vector2d_1.Vector2d(0.5, 1), cp2, new Vector2d_1.Vector2d(1, 0.5), cp3, new Vector2d_1.Vector2d(1, -0.5), cp4, new Vector2d_1.Vector2d(0.5, -1), cp5, new Vector2d_1.Vector2d(0, -0.5), cp6]);
        chai_1.expect(s.evaluate(1)).to.eql(sInc.evaluate(1));
        var sInc1 = sInc.degreeIncrement();
        chai_1.expect(sInc1.degree).to.eql(3);
        chai_1.expect(sInc1 === null || sInc1 === void 0 ? void 0 : sInc1.knots.length).to.eql(23);
        chai_1.expect(sInc1.knots).to.eql([0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6]);
        chai_1.expect(sInc1 === null || sInc1 === void 0 ? void 0 : sInc1.controlPoints.length).to.eql(19);
        var cp7 = new Vector2d_1.Vector2d(0, 0.3333333333333);
        var cp8 = new Vector2d_1.Vector2d(0, 0.6666666666666);
        var cp9 = new Vector2d_1.Vector2d(0.3333333333333, 1);
        var cp10 = new Vector2d_1.Vector2d(0.6666666666666, 1);
        var cp11 = new Vector2d_1.Vector2d(1, 0.6666666666666);
        var cp12 = new Vector2d_1.Vector2d(1, 0.3333333333333);
        var cp13 = new Vector2d_1.Vector2d(1, -0.3333333333333);
        var cp14 = new Vector2d_1.Vector2d(1, -0.6666666666666);
        var cp15 = new Vector2d_1.Vector2d(0.6666666666666, -1);
        var cp16 = new Vector2d_1.Vector2d(0.3333333333333, -1);
        var cp17 = new Vector2d_1.Vector2d(0, -0.6666666666666);
        var cp18 = new Vector2d_1.Vector2d(0, -0.3333333333333);
        var cpInc1 = [cp0, cp7, cp8, cp1, cp9, cp10, cp2, cp11, cp12, cp3,
            cp13, cp14, cp4, cp15, cp16, cp5, cp17, cp18, cp6];
        for (var cp = 0; cp < (sInc1 === null || sInc1 === void 0 ? void 0 : sInc1.controlPoints.length); cp++) {
            chai_1.expect(sInc1 === null || sInc1 === void 0 ? void 0 : sInc1.controlPoints[cp].x).to.be.closeTo(cpInc1[cp].x, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(sInc1 === null || sInc1 === void 0 ? void 0 : sInc1.controlPoints[cp].y).to.be.closeTo(cpInc1[cp].y, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
        chai_1.expect(s.evaluate(1)).to.eql(sInc1.evaluate(1));
        chai_1.expect(sInc.evaluate(1)).to.eql(sInc1.evaluate(1));
    });
    it('can generate the intermediate splines of a non uniform B-spline with coinciding extremities, i.e., closed', function () {
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, 0);
        var cp4 = new Vector2d_1.Vector2d(0, 0);
        var s1 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4], [0, 0, 1, 2, 3, 4, 4]);
        var intermSplines = s1.generateIntermediateSplinesForDegreeElevation();
        chai_1.expect(intermSplines.knotVectors[0]).to.eql([0, 0, 0, 1, 1, 2, 3, 3, 4, 4, 4]);
        chai_1.expect(intermSplines.knotVectors[1]).to.eql([0, 0, 0, 1, 2, 2, 3, 4, 4, 4]);
        var CP0x = [0, 0, 0, 1, 1, 1, 0, 0];
        var CP0y = [0, 0, 1, 1, 1, 0, 0, 0];
        for (var i = 0; i < intermSplines.CPs[0].length; i++) {
            chai_1.expect(intermSplines.CPs[0][i].x).to.eql(CP0x[i]);
            chai_1.expect(intermSplines.CPs[0][i].y).to.eql(CP0y[i]);
        }
        var CP1x = [0, 0, 0, 1, 1, 1, 0];
        var CP1y = [0, 1, 1, 1, 0, 0, 0];
        for (var i = 0; i < intermSplines.CPs[1].length; i++) {
            chai_1.expect(intermSplines.CPs[1][i].x).to.eql(CP1x[i]);
            chai_1.expect(intermSplines.CPs[1][i].y).to.eql(CP1y[i]);
        }
    });
    it('can increment the curve degree of a non uniform B-spline with coinciding extremities, i.e., closed (for comparison with periodic B-Splines)', function () {
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, 0);
        var cp4 = new Vector2d_1.Vector2d(0, 0);
        var s1 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4], [0, 0, 1, 2, 3, 4, 4]);
        var sInc = s1.degreeIncrement();
        chai_1.expect(sInc.knots).to.eql([0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4]);
        chai_1.expect(sInc.degree).to.eql(2);
        chai_1.expect(sInc.knots).to.eql([0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4]);
        var cpSolutionX = [0, 0, 0, 0.5, 1.0, 1.0, 1.0, 0.5, 0];
        var cpSolutionY = [0, 0.5, 1, 1, 1, 0.5, 0, 0, 0];
        for (var i = 0; i < sInc.controlPoints.length; i++) {
            chai_1.expect(sInc.controlPoints[i].x).to.be.closeTo(cpSolutionX[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(sInc.controlPoints[i].y).to.be.closeTo(cpSolutionY[i], Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
    });
    it('evaluate intermediate B-Spline parameterization during degree elevation (for comparison with periodic B-Splines)', function () {
        var cp0 = new Vector2d_1.Vector2d(-1, 0);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(-1, 2);
        var cp3 = new Vector2d_1.Vector2d(0, 2);
        var cp4 = new Vector2d_1.Vector2d(1, 2);
        var cp5 = new Vector2d_1.Vector2d(1, 1);
        var cp6 = new Vector2d_1.Vector2d(1, 0);
        var spl = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6], [0, 0, 0, 1, 2, 3, 4, 5, 5, 5]);
        chai_1.expect(spl.degree).to.eql(2);
        chai_1.expect(spl.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 5, 5, 5]);
        chai_1.expect(spl.evaluate(1).x).to.be.closeTo(-1, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl.evaluate(1).y).to.be.closeTo(1.5, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl.evaluate(2).x).to.be.closeTo(-0.5, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl.evaluate(2).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl.evaluate(2.5).x).to.be.closeTo(0, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl.evaluate(2.5).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var intermSplines = spl.generateIntermediateSplinesForDegreeElevation();
        chai_1.expect(intermSplines.knotVectors[0]).to.eql([0, 0, 0, 0, 1, 1, 2, 3, 4, 4, 5, 5, 5, 5]);
        chai_1.expect(intermSplines.knotVectors[1]).to.eql([0, 0, 0, 0, 1, 2, 2, 3, 4, 5, 5, 5, 5]);
        chai_1.expect(intermSplines.knotVectors[2]).to.eql([0, 0, 0, 0, 1, 2, 3, 3, 4, 5, 5, 5, 5]);
        var CP0x = [-1, -1, -1, -1, 0, 0, 1, 1, 1, 1];
        var CP0y = [0, 0, 1, 2, 2, 2, 2, 1, 0, 0];
        for (var i = 0; i < intermSplines.CPs[0].length; i++) {
            chai_1.expect(intermSplines.CPs[0][i].x).to.eql(CP0x[i]);
            chai_1.expect(intermSplines.CPs[0][i].y).to.eql(CP0y[i]);
        }
        var spl1 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp0, cp1, cp2, cp3, cp3, cp4, cp5, cp6, cp6], [0, 0, 0, 0, 1, 1, 2, 3, 4, 4, 5, 5, 5, 5]);
        chai_1.expect(spl1.evaluate(1).x).to.be.closeTo(-1, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl1.evaluate(1).y).to.be.closeTo(1.5, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl1.evaluate(2).x).to.be.closeTo(-0.25, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl1.evaluate(2).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl1.evaluate(2.5).x).to.be.closeTo(0, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl1.evaluate(2.5).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var CP1x = [-1, -1, -1, -1, 0, 1, 1, 1, 1];
        var CP1y = [0, 1, 1, 2, 2, 2, 2, 1, 0];
        for (var i = 0; i < intermSplines.CPs[1].length; i++) {
            chai_1.expect(intermSplines.CPs[1][i].x).to.eql(CP1x[i]);
            chai_1.expect(intermSplines.CPs[1][i].y).to.eql(CP1y[i]);
        }
        var spl2 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp1, cp2, cp3, cp4, cp4, cp5, cp6], [0, 0, 0, 0, 1, 2, 2, 3, 4, 5, 5, 5, 5]);
        chai_1.expect(spl2.evaluate(1).x).to.be.closeTo(-1, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl2.evaluate(1).y).to.be.closeTo(1.25, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl2.evaluate(2).x).to.be.closeTo(-0.5, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl2.evaluate(2).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl2.evaluate(2.5).x).to.be.closeTo(0.21875, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl2.evaluate(2.5).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var CP2x = [-1, -1, -1, -1, 0, 1, 1, 1, 1];
        var CP2y = [0, 1, 2, 2, 2, 2, 1, 1, 0];
        for (var i = 0; i < intermSplines.CPs[2].length; i++) {
            chai_1.expect(intermSplines.CPs[2][i].x).to.eql(CP2x[i]);
            chai_1.expect(intermSplines.CPs[2][i].y).to.eql(CP2y[i]);
        }
        var spl3 = new BSplineR1toR2_1.BSplineR1toR2([cp0, cp1, cp2, cp2, cp3, cp4, cp5, cp5, cp6], [0, 0, 0, 0, 1, 2, 3, 3, 4, 5, 5, 5, 5]);
        chai_1.expect(spl3.evaluate(1).x).to.be.closeTo(-1, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl3.evaluate(1).y).to.be.closeTo(1.75, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl3.evaluate(2).x).to.be.closeTo(-0.75, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl3.evaluate(2).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl3.evaluate(2.5).x).to.be.closeTo(-0.21875, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spl3.evaluate(2.5).y).to.be.closeTo(2, Curves_2.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
});
