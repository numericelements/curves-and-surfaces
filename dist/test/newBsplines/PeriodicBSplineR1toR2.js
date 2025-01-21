"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Vector2d_1 = require("../../src/mathVector/Vector2d");
var Curves_1 = require("../namedConstants/Curves");
var PeriodicBSplineR1toR2_1 = require("../../src/newBsplines/PeriodicBSplineR1toR2");
var Piegl_Tiller_NURBS_Book_1 = require("../../src/newBsplines/Piegl_Tiller_NURBS_Book");
var IncreasingPeriodicKnotSequenceClosedCurve_1 = require("../../src/newBsplines/IncreasingPeriodicKnotSequenceClosedCurve");
var ErrorLoging_1 = require("../../src/errorProcessing/ErrorLoging");
var KnotIndexIncreasingSequence_1 = require("../../src/newBsplines/KnotIndexIncreasingSequence");
var KnotSequenceConstructorInterface_1 = require("../../src/newBsplines/KnotSequenceConstructorInterface");
describe('PeriodicBSplineR1toR2', function () {
    // it('cannot be initialized with the constructor', () => {
    //     const cp0 = new Vector2d(0, 0)
    //     const cp1 = new Vector2d(1, 0)
    //     const cp2 = new Vector2d(1, 1)
    //     const cp3 = new Vector2d(0.5, 1.5)
    //     const cp4 = new Vector2d(0, 1)
    //     const knots = [0, 1, 2, 3, 4, 5]
    //     const degree = 2
    //     expect(() => new PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4], knots, degree)).to.throw()
    // });
    it('cannot be initialized with a negative degree', function () {
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(1, 0);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(0.5, 1.5);
        var cp4 = new Vector2d_1.Vector2d(0, 1);
        var knots = [0, 1, 2, 3, 4, 5];
        var degree = -2;
        chai_1.expect(function () { return new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4], knots, degree); }).to.throw();
    });
    it('cannot be initialized with a null degree', function () {
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(1, 0);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(0.5, 1.5);
        var cp4 = new Vector2d_1.Vector2d(0, 1);
        var knots = [0, 1, 2, 3, 4, 5];
        var degree = 0;
        chai_1.expect(function () { return new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4], knots, degree); }).to.throw();
    });
    it('cannot be initialized with a positive degree and sizes of knot sequence and control points array differing by more than one', function () {
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(1, 0);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(0.5, 1.5);
        var cp4 = new Vector2d_1.Vector2d(0, 1);
        var knots = [0, 1, 2, 3, 4];
        var degree = 2;
        chai_1.expect(function () { return new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4], knots, degree); }).to.throw();
    });
    it('cannot be initialized with a knot sequence size equal or smaller to (degree + 1)', function () {
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var knots = [0, 1];
        var degree = 2;
        chai_1.expect(function () { return new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0], knots, degree); }).to.throw();
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
        var knots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        var knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        var curveDegree = 3;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.controlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.knots).to.eql(knots);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.degree).to.equal(curveDegree);
    });
    it('can generate intermediate Splines for degree elevation of periodic BSpline', function () {
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
        var knots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        var knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        var curveDegree = 3;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11], knots, curveDegree);
        var intermSplKnotsAndCPs = s === null || s === void 0 ? void 0 : s.generateIntermediateSplinesForDegreeElevation();
        chai_1.expect(intermSplKnotsAndCPs === null || intermSplKnotsAndCPs === void 0 ? void 0 : intermSplKnotsAndCPs.CPs.length).to.eql(4);
        chai_1.expect(intermSplKnotsAndCPs === null || intermSplKnotsAndCPs === void 0 ? void 0 : intermSplKnotsAndCPs.knotVectors.length).to.eql(4);
        chai_1.expect(intermSplKnotsAndCPs === null || intermSplKnotsAndCPs === void 0 ? void 0 : intermSplKnotsAndCPs.knotVectors[0]).to.eql([0, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 12]);
        chai_1.expect(intermSplKnotsAndCPs === null || intermSplKnotsAndCPs === void 0 ? void 0 : intermSplKnotsAndCPs.knotVectors[1]).to.eql([0, 1, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 9, 10, 11, 12]);
        chai_1.expect(intermSplKnotsAndCPs === null || intermSplKnotsAndCPs === void 0 ? void 0 : intermSplKnotsAndCPs.knotVectors[2]).to.eql([0, 1, 2, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 10, 11, 12]);
        chai_1.expect(intermSplKnotsAndCPs === null || intermSplKnotsAndCPs === void 0 ? void 0 : intermSplKnotsAndCPs.knotVectors[3]).to.eql([0, 1, 2, 3, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 11, 12]);
        chai_1.expect(intermSplKnotsAndCPs === null || intermSplKnotsAndCPs === void 0 ? void 0 : intermSplKnotsAndCPs.CPs[0]).to.eql([cp0, cp1, cp2, cp3, cp4, cp4, cp5, cp6, cp7, cp8, cp8, cp9, cp10, cp11, cp0]);
        chai_1.expect(intermSplKnotsAndCPs === null || intermSplKnotsAndCPs === void 0 ? void 0 : intermSplKnotsAndCPs.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp4, cp5, cp5, cp6, cp7, cp8, cp9, cp9, cp10, cp11]);
        chai_1.expect(intermSplKnotsAndCPs === null || intermSplKnotsAndCPs === void 0 ? void 0 : intermSplKnotsAndCPs.CPs[2]).to.eql([cp0, cp1, cp2, cp2, cp3, cp4, cp5, cp6, cp6, cp7, cp8, cp9, cp10, cp10, cp11]);
        chai_1.expect(intermSplKnotsAndCPs === null || intermSplKnotsAndCPs === void 0 ? void 0 : intermSplKnotsAndCPs.CPs[3]).to.eql([cp0, cp1, cp2, cp3, cp3, cp4, cp5, cp6, cp7, cp7, cp8, cp9, cp10, cp11, cp11]);
    });
    it('can insert a knot using Boehm algorithm for a quadratic B-Spline with uniform knot sequence ', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, 0);
        var cp4 = new Vector2d_1.Vector2d(1, -1);
        var cp5 = new Vector2d_1.Vector2d(0, -1);
        var knots = [0, 1, 2, 3, 4, 5, 6];
        var curveDegree = 2;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0)).to.eql(new Vector2d_1.Vector2d(0.5, -1));
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1)).to.eql(new Vector2d_1.Vector2d(0, -0.5));
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2)).to.eql(new Vector2d_1.Vector2d(0, 0.5));
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3)).to.eql(new Vector2d_1.Vector2d(0.5, 1));
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4)).to.eql(new Vector2d_1.Vector2d(1, 0.5));
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5)).to.eql(new Vector2d_1.Vector2d(1, -0.5));
        s === null || s === void 0 ? void 0 : s.insertKnotBoehmAlgorithm(4);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints.length).to.eql(7);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.knots.length).to.eql(8);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.knots).to.eql([0, 1, 2, 3, 4, 4, 5, 6]);
        var cpX = [0, 0, 1, 1, 1, 1, 0];
        var cpY = [0, 1, 1, 0.5, 0, -1, -1];
        if (s !== undefined) {
            for (var i = 0; i < s.freeControlPoints.length; i++) {
                chai_1.expect(s.freeControlPoints[i].x).to.eql(cpX[i]);
                chai_1.expect(s.freeControlPoints[i].y).to.eql(cpY[i]);
            }
        }
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4)).to.eql(new Vector2d_1.Vector2d(1, 0.5));
        var s1 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5], knots, curveDegree);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5]);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(3)).to.eql(new Vector2d_1.Vector2d(0.5, 1));
        s1 === null || s1 === void 0 ? void 0 : s1.insertKnotBoehmAlgorithm(3);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.freeControlPoints.length).to.eql(7);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.knots.length).to.eql(8);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.knots).to.eql([0, 1, 2, 3, 3, 4, 5, 6]);
        var cpX1 = [0, 0, 0.5, 1, 1, 1, 0];
        var cpY1 = [0, 1, 1, 1, 0, -1, -1];
        if (s1 !== undefined) {
            for (var i = 0; i < s1.freeControlPoints.length; i++) {
                chai_1.expect(s1.freeControlPoints[i].x).to.eql(cpX1[i]);
                chai_1.expect(s1.freeControlPoints[i].y).to.eql(cpY1[i]);
            }
        }
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(3)).to.eql(new Vector2d_1.Vector2d(0.5, 1));
        s1 === null || s1 === void 0 ? void 0 : s1.insertKnotBoehmAlgorithm(4);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.freeControlPoints.length).to.eql(8);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.knots.length).to.eql(9);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.knots).to.eql([0, 1, 2, 3, 3, 4, 4, 5, 6]);
        var cpX34 = [0, 0, 0.5, 1, 1, 1, 1, 0];
        var cpY34 = [0, 1, 1, 1, 0.5, 0, -1, -1];
        if (s1 !== undefined) {
            for (var i = 0; i < s1.freeControlPoints.length; i++) {
                chai_1.expect(s1.freeControlPoints[i].x).to.eql(cpX34[i]);
                chai_1.expect(s1.freeControlPoints[i].y).to.eql(cpY34[i]);
            }
        }
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(3)).to.eql(new Vector2d_1.Vector2d(0.5, 1));
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(4)).to.eql(new Vector2d_1.Vector2d(1, 0.5));
        var s2 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5], knots, curveDegree);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5]);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(2)).to.eql(new Vector2d_1.Vector2d(0, 0.5));
        s2 === null || s2 === void 0 ? void 0 : s2.insertKnotBoehmAlgorithm(2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.freeControlPoints.length).to.eql(7);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.knots.length).to.eql(8);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.knots).to.eql([0, 1, 2, 2, 3, 4, 5, 6]);
        var cpX2 = [0, 0, 0, 1, 1, 1, 0];
        var cpY2 = [0, 0.5, 1, 1, 0, -1, -1];
        if (s2 !== undefined) {
            for (var i = 0; i < s2.freeControlPoints.length; i++) {
                chai_1.expect(s2.freeControlPoints[i].x).to.eql(cpX2[i]);
                chai_1.expect(s2.freeControlPoints[i].y).to.eql(cpY2[i]);
            }
        }
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(2)).to.eql(new Vector2d_1.Vector2d(0, 0.5));
        s2 === null || s2 === void 0 ? void 0 : s2.insertKnotBoehmAlgorithm(3);
        s2 === null || s2 === void 0 ? void 0 : s2.insertKnotBoehmAlgorithm(4);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.freeControlPoints.length).to.eql(9);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.knots.length).to.eql(10);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.knots).to.eql([0, 1, 2, 2, 3, 3, 4, 4, 5, 6]);
        var cpX234 = [0, 0, 0, 0.5, 1, 1, 1, 1, 0];
        var cpY234 = [0, 0.5, 1, 1, 1, 0.5, 0, -1, -1];
        if (s2 !== undefined) {
            for (var i = 0; i < s2.freeControlPoints.length; i++) {
                chai_1.expect(s2.freeControlPoints[i].x).to.eql(cpX234[i]);
                chai_1.expect(s2.freeControlPoints[i].y).to.eql(cpY234[i]);
            }
        }
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(2)).to.eql(new Vector2d_1.Vector2d(0, 0.5));
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(3)).to.eql(new Vector2d_1.Vector2d(0.5, 1));
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(4)).to.eql(new Vector2d_1.Vector2d(1, 0.5));
        var s3 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5], knots, curveDegree);
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5]);
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.evaluate(1)).to.eql(new Vector2d_1.Vector2d(0, -0.5));
        s3 === null || s3 === void 0 ? void 0 : s3.insertKnotBoehmAlgorithm(1);
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.freeControlPoints.length).to.eql(7);
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.knots.length).to.eql(8);
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.knots).to.eql([0, 1, 1, 2, 3, 4, 5, 6]);
        var cpX3 = [0, 0, 0, 1, 1, 1, 0];
        var cpY3 = [-0.5, 0, 1, 1, 0, -1, -1];
        if (s3 !== undefined) {
            for (var i = 0; i < s3.freeControlPoints.length; i++) {
                chai_1.expect(s3.freeControlPoints[i].x).to.eql(cpX3[i]);
                chai_1.expect(s3.freeControlPoints[i].y).to.eql(cpY3[i]);
            }
        }
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.evaluate(1)).to.eql(new Vector2d_1.Vector2d(0, -0.5));
        s3 === null || s3 === void 0 ? void 0 : s3.insertKnotBoehmAlgorithm(2);
        s3 === null || s3 === void 0 ? void 0 : s3.insertKnotBoehmAlgorithm(3);
        s3 === null || s3 === void 0 ? void 0 : s3.insertKnotBoehmAlgorithm(4);
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.freeControlPoints.length).to.eql(10);
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.knots.length).to.eql(11);
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.knots).to.eql([0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 6]);
        var cpX1234 = [0, 0, 0, 0, 0.5, 1, 1, 1, 1, 0];
        var cpY1234 = [-0.5, 0, 0.5, 1, 1, 1, 0.5, 0, -1, -1];
        if (s3 !== undefined) {
            for (var i = 0; i < s3.freeControlPoints.length; i++) {
                chai_1.expect(s3.freeControlPoints[i].x).to.eql(cpX1234[i]);
                chai_1.expect(s3.freeControlPoints[i].y).to.eql(cpY1234[i]);
            }
        }
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.evaluate(1)).to.eql(new Vector2d_1.Vector2d(0, -0.5));
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.evaluate(2)).to.eql(new Vector2d_1.Vector2d(0, 0.5));
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.evaluate(3)).to.eql(new Vector2d_1.Vector2d(0.5, 1));
        chai_1.expect(s3 === null || s3 === void 0 ? void 0 : s3.evaluate(4)).to.eql(new Vector2d_1.Vector2d(1, 0.5));
        var s4 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5], knots, curveDegree);
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5]);
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.evaluate(5)).to.eql(new Vector2d_1.Vector2d(1, -0.5));
        s4 === null || s4 === void 0 ? void 0 : s4.insertKnotBoehmAlgorithm(5);
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.freeControlPoints.length).to.eql(7);
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.knots.length).to.eql(8);
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.knots).to.eql([0, 1, 2, 3, 4, 5, 5, 6]);
        var cpX4 = [0, 0, 1, 1, 1, 1, 0];
        var cpY4 = [0, 1, 1, 0, -0.5, -1, -1];
        if (s4 !== undefined) {
            for (var i = 0; i < s4.freeControlPoints.length; i++) {
                chai_1.expect(s4.freeControlPoints[i].x).to.eql(cpX4[i]);
                chai_1.expect(s4.freeControlPoints[i].y).to.eql(cpY4[i]);
            }
        }
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.evaluate(5)).to.eql(new Vector2d_1.Vector2d(1, -0.5));
        s4 === null || s4 === void 0 ? void 0 : s4.insertKnotBoehmAlgorithm(1);
        s4 === null || s4 === void 0 ? void 0 : s4.insertKnotBoehmAlgorithm(2);
        s4 === null || s4 === void 0 ? void 0 : s4.insertKnotBoehmAlgorithm(3);
        s4 === null || s4 === void 0 ? void 0 : s4.insertKnotBoehmAlgorithm(4);
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.freeControlPoints.length).to.eql(11);
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.knots.length).to.eql(12);
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.knots).to.eql([0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]);
        var cpX12345 = [0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0];
        var cpY12345 = [-0.5, 0, 0.5, 1, 1, 1, 0.5, 0, -0.5, -1, -1];
        if (s4 !== undefined) {
            for (var i = 0; i < s4.freeControlPoints.length; i++) {
                chai_1.expect(s4.freeControlPoints[i].x).to.eql(cpX12345[i]);
                chai_1.expect(s4.freeControlPoints[i].y).to.eql(cpY12345[i]);
            }
        }
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.evaluate(1)).to.eql(new Vector2d_1.Vector2d(0, -0.5));
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.evaluate(2)).to.eql(new Vector2d_1.Vector2d(0, 0.5));
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.evaluate(3)).to.eql(new Vector2d_1.Vector2d(0.5, 1));
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.evaluate(4)).to.eql(new Vector2d_1.Vector2d(1, 0.5));
        chai_1.expect(s4 === null || s4 === void 0 ? void 0 : s4.evaluate(5)).to.eql(new Vector2d_1.Vector2d(1, -0.5));
        var s5 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5], knots, curveDegree);
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5]);
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.evaluate(0)).to.eql(new Vector2d_1.Vector2d(0.5, -1));
        s5 === null || s5 === void 0 ? void 0 : s5.insertKnotBoehmAlgorithm(0);
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.freeControlPoints.length).to.eql(7);
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.knots.length).to.eql(9);
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.knots).to.eql([0, 0, 1, 2, 3, 4, 5, 6, 6]);
        var cpX5 = [0, 0, 1, 1, 1, 0.5, 0];
        var cpY5 = [0, 1, 1, 0, -1, -1, -1];
        if (s5 !== undefined) {
            for (var i = 0; i < s5.freeControlPoints.length; i++) {
                chai_1.expect(s5.freeControlPoints[i].x).to.eql(cpX5[i]);
                chai_1.expect(s5.freeControlPoints[i].y).to.eql(cpY5[i]);
            }
        }
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.evaluate(0)).to.eql(new Vector2d_1.Vector2d(0.5, -1));
        s5 === null || s5 === void 0 ? void 0 : s5.insertKnotBoehmAlgorithm(1);
        s5 === null || s5 === void 0 ? void 0 : s5.insertKnotBoehmAlgorithm(2);
        s5 === null || s5 === void 0 ? void 0 : s5.insertKnotBoehmAlgorithm(3);
        s5 === null || s5 === void 0 ? void 0 : s5.insertKnotBoehmAlgorithm(4);
        s5 === null || s5 === void 0 ? void 0 : s5.insertKnotBoehmAlgorithm(5);
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.freeControlPoints.length).to.eql(12);
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.knots.length).to.eql(14);
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
        var cpX012345 = [0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0];
        var cpY012345 = [-0.5, 0, 0.5, 1, 1, 1, 0.5, 0, -0.5, -1, -1, -1];
        if (s5 !== undefined) {
            for (var i = 0; i < s5.freeControlPoints.length; i++) {
                chai_1.expect(s5.freeControlPoints[i].x).to.eql(cpX012345[i]);
                chai_1.expect(s5.freeControlPoints[i].y).to.eql(cpY012345[i]);
            }
        }
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.evaluate(0)).to.eql(new Vector2d_1.Vector2d(0.5, -1));
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.evaluate(1)).to.eql(new Vector2d_1.Vector2d(0, -0.5));
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.evaluate(2)).to.eql(new Vector2d_1.Vector2d(0, 0.5));
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.evaluate(3)).to.eql(new Vector2d_1.Vector2d(0.5, 1));
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.evaluate(4)).to.eql(new Vector2d_1.Vector2d(1, 0.5));
        chai_1.expect(s5 === null || s5 === void 0 ? void 0 : s5.evaluate(5)).to.eql(new Vector2d_1.Vector2d(1, -0.5));
    });
    it('can insert repeatedly a knot using Boehm algorithm for a cubic B-Spline at curve origin ', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, 0);
        var cp4 = new Vector2d_1.Vector2d(1, -1);
        var cp5 = new Vector2d_1.Vector2d(0, -1);
        var knots = [0, 1, 2, 3, 4, 5, 6];
        var curveDegree = 3;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(-0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0.16666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(-0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).x).to.be.closeTo(0.16666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).y).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3.5).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3.5).y).to.be.closeTo(0.9583333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4).x).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4).y).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        s === null || s === void 0 ? void 0 : s.insertKnotBoehmAlgorithm(0);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints.length).to.eql(7);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.knots.length).to.eql(9);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.knots).to.eql([0, 0, 1, 2, 3, 4, 5, 6, 6]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(-0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0.16666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(-0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).x).to.be.closeTo(0.16666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).y).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4).x).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4).y).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var cpX0 = [0, 0, 1, 1, 1, 0.6666666666666666, 0];
        var cpY0 = [0, 1, 1, 0, -0.6666666666666666, -1, -1];
        if (s !== undefined) {
            for (var i = 0; i < s.freeControlPoints.length; i++) {
                chai_1.expect(s.freeControlPoints[i].x).to.be.closeTo(cpX0[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(s.freeControlPoints[i].y).to.be.closeTo(cpY0[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        s === null || s === void 0 ? void 0 : s.insertKnotBoehmAlgorithm(0);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints.length).to.eql(8);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.knots.length).to.eql(11);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 5, 6, 6, 6]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(-0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0.16666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(-0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).x).to.be.closeTo(0.16666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).y).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4).x).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4).y).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var cpX1 = [0, 0, 1, 1, 1, 0.83333333333333, 0.6666666666666666, 0];
        var cpY1 = [0, 1, 1, 0, -0.6666666666666666, -0.83333333333333, -1, -1];
        if (s !== undefined) {
            for (var i = 0; i < s.freeControlPoints.length; i++) {
                chai_1.expect(s.freeControlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(s.freeControlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
    });
    it('can insert repeatedly a knot using Boehm algorithm for a cubic B-Spline at every existing knot of the initial sequence ', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sp0 = s === null || s === void 0 ? void 0 : s.clone();
        sp0 === null || sp0 === void 0 ? void 0 : sp0.insertKnotBoehmAlgorithm(0);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.freeControlPoints.length).to.eql(5);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.knots.length).to.eql(7);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.knots).to.eql([0, 0, 1, 2, 3, 4, 4]);
        var cpX0 = [-1, -1, 0.333333333333333, 1, 1];
        var cpY0 = [-1, 1, 1, 0.333333333333333, -1];
        if (sp0 !== undefined) {
            for (var i = 0; i < sp0.freeControlPoints.length; i++) {
                chai_1.expect(sp0.freeControlPoints[i].x).to.be.closeTo(cpX0[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp0.freeControlPoints[i].y).to.be.closeTo(cpY0[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        // insert the knot once again
        var sp00 = sp0 === null || sp0 === void 0 ? void 0 : sp0.clone();
        sp00 === null || sp00 === void 0 ? void 0 : sp00.insertKnotBoehmAlgorithm(0);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.freeControlPoints.length).to.eql(6);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.knots.length).to.eql(9);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 4]);
        var cpX00 = [-1, -1, 0.333333333333333, 0.66666666666666, 1, 1];
        var cpY00 = [-1, 1, 1, 0.66666666666666, 0.333333333333333, -1];
        if (sp00 !== undefined) {
            for (var i = 0; i < sp00.freeControlPoints.length; i++) {
                chai_1.expect(sp00.freeControlPoints[i].x).to.be.closeTo(cpX00[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp00.freeControlPoints[i].y).to.be.closeTo(cpY00[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sp1 = s === null || s === void 0 ? void 0 : s.clone();
        sp1 === null || sp1 === void 0 ? void 0 : sp1.insertKnotBoehmAlgorithm(1);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.freeControlPoints.length).to.eql(5);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.knots.length).to.eql(6);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.knots).to.eql([0, 1, 1, 2, 3, 4]);
        var cpX1 = [0.333333333333333, -1, -1, 1, 1];
        var cpY1 = [-1, -1, 1, 1, -0.333333333333333];
        if (sp1 !== undefined) {
            for (var i = 0; i < sp1.freeControlPoints.length; i++) {
                chai_1.expect(sp1.freeControlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp1.freeControlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        // insert the knot once again
        var sp11 = sp1 === null || sp1 === void 0 ? void 0 : sp1.clone();
        sp11 === null || sp11 === void 0 ? void 0 : sp11.insertKnotBoehmAlgorithm(1);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.freeControlPoints.length).to.eql(6);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.knots.length).to.eql(7);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.knots).to.eql([0, 1, 1, 1, 2, 3, 4]);
        var cpX11 = [0.66666666666666, 0.333333333333333, -1, -1, 1, 1];
        var cpY11 = [-0.66666666666666, -1, -1, 1, 1, -0.333333333333333];
        if (sp11 !== undefined) {
            for (var i = 0; i < sp11.freeControlPoints.length; i++) {
                chai_1.expect(sp11.freeControlPoints[i].x).to.be.closeTo(cpX11[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp11.freeControlPoints[i].y).to.be.closeTo(cpY11[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sp2 = s === null || s === void 0 ? void 0 : s.clone();
        sp2 === null || sp2 === void 0 ? void 0 : sp2.insertKnotBoehmAlgorithm(2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.freeControlPoints.length).to.eql(5);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.knots.length).to.eql(6);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.knots).to.eql([0, 1, 2, 2, 3, 4]);
        var cpX2 = [-0.333333333333333, -1, -1, 1, 1];
        var cpY2 = [-1, -0.333333333333333, 1, 1, -1];
        if (sp2 !== undefined) {
            for (var i = 0; i < sp2.freeControlPoints.length; i++) {
                chai_1.expect(sp2.freeControlPoints[i].x).to.be.closeTo(cpX2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp2.freeControlPoints[i].y).to.be.closeTo(cpY2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        // insert the knot once again
        var sp22 = sp2 === null || sp2 === void 0 ? void 0 : sp2.clone();
        sp22 === null || sp22 === void 0 ? void 0 : sp22.insertKnotBoehmAlgorithm(2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.freeControlPoints.length).to.eql(6);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.knots.length).to.eql(7);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.knots).to.eql([0, 1, 2, 2, 2, 3, 4]);
        var cpX22 = [-0.333333333333333, -0.66666666666666, -1, -1, 1, 1];
        var cpY22 = [-1, -0.66666666666666, -0.333333333333333, 1, 1, -1];
        if (sp22 !== undefined) {
            for (var i = 0; i < sp22.freeControlPoints.length; i++) {
                chai_1.expect(sp22.freeControlPoints[i].x).to.be.closeTo(cpX22[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp22.freeControlPoints[i].y).to.be.closeTo(cpY22[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sp3 = s === null || s === void 0 ? void 0 : s.clone();
        sp3 === null || sp3 === void 0 ? void 0 : sp3.insertKnotBoehmAlgorithm(3);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.freeControlPoints.length).to.eql(5);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.knots.length).to.eql(6);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.knots).to.eql([0, 1, 2, 3, 3, 4]);
        var cpX3 = [-1, -1, -0.333333333333333, 1, 1];
        var cpY3 = [-1, 0.333333333333333, 1, 1, -1];
        if (sp3 !== undefined) {
            for (var i = 0; i < sp3.freeControlPoints.length; i++) {
                chai_1.expect(sp3.freeControlPoints[i].x).to.be.closeTo(cpX3[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp3.freeControlPoints[i].y).to.be.closeTo(cpY3[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp3 === null || sp3 === void 0 ? void 0 : sp3.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        // insert the knot once again
        var sp33 = sp3 === null || sp3 === void 0 ? void 0 : sp3.clone();
        sp33 === null || sp33 === void 0 ? void 0 : sp33.insertKnotBoehmAlgorithm(3);
        chai_1.expect(sp33 === null || sp33 === void 0 ? void 0 : sp33.freeControlPoints.length).to.eql(6);
        chai_1.expect(sp33 === null || sp33 === void 0 ? void 0 : sp33.knots.length).to.eql(7);
        chai_1.expect(sp33 === null || sp33 === void 0 ? void 0 : sp33.knots).to.eql([0, 1, 2, 3, 3, 3, 4]);
        var cpX33 = [-1, -1, -0.66666666666666, -0.333333333333333, 1, 1];
        var cpY33 = [-1, 0.333333333333333, 0.66666666666666, 1, 1, -1];
        if (sp33 !== undefined) {
            for (var i = 0; i < sp33.freeControlPoints.length; i++) {
                chai_1.expect(sp33.freeControlPoints[i].x).to.be.closeTo(cpX33[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp33.freeControlPoints[i].y).to.be.closeTo(cpY33[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp33 === null || sp33 === void 0 ? void 0 : sp33.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp33 === null || sp33 === void 0 ? void 0 : sp33.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp33 === null || sp33 === void 0 ? void 0 : sp33.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp33 === null || sp33 === void 0 ? void 0 : sp33.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp33 === null || sp33 === void 0 ? void 0 : sp33.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp33 === null || sp33 === void 0 ? void 0 : sp33.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp33 === null || sp33 === void 0 ? void 0 : sp33.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp33 === null || sp33 === void 0 ? void 0 : sp33.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can insert repeatedly a knot using Boehm algorithm for a cubic B-Spline at knot u = 1 of the initial sequence when the initial knot has a multiplicity greater than one', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sp0 = s === null || s === void 0 ? void 0 : s.clone();
        sp0 === null || sp0 === void 0 ? void 0 : sp0.insertKnotBoehmAlgorithm(0);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.freeControlPoints.length).to.eql(5);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.knots.length).to.eql(7);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.knots).to.eql([0, 0, 1, 2, 3, 4, 4]);
        var cpX0 = [-1, -1, 0.333333333333333, 1, 1];
        var cpY0 = [-1, 1, 1, 0.333333333333333, -1];
        if (sp0 !== undefined) {
            for (var i = 0; i < sp0.freeControlPoints.length; i++) {
                chai_1.expect(sp0.freeControlPoints[i].x).to.be.closeTo(cpX0[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp0.freeControlPoints[i].y).to.be.closeTo(cpY0[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sp1 = sp0 === null || sp0 === void 0 ? void 0 : sp0.clone();
        sp1 === null || sp1 === void 0 ? void 0 : sp1.insertKnotBoehmAlgorithm(1);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.freeControlPoints.length).to.eql(6);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.knots.length).to.eql(8);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.knots).to.eql([0, 0, 1, 1, 2, 3, 4, 4]);
        var cpX1 = [0.333333333333333, -1, -1, 0.333333333333333, 1, 1];
        var cpY1 = [-1, -1, 1, 1, 0.333333333333333, -0.333333333333333];
        if (sp1 !== undefined) {
            for (var i = 0; i < sp1.freeControlPoints.length; i++) {
                chai_1.expect(sp1.freeControlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp1.freeControlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp1 === null || sp1 === void 0 ? void 0 : sp1.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        // insert the knot at origin once again
        var sp00 = sp0 === null || sp0 === void 0 ? void 0 : sp0.clone();
        sp00 === null || sp00 === void 0 ? void 0 : sp00.insertKnotBoehmAlgorithm(0);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.freeControlPoints.length).to.eql(6);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.knots.length).to.eql(9);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 4]);
        var cpX00 = [-1, -1, 0.333333333333333, 0.66666666666666, 1, 1];
        var cpY00 = [-1, 1, 1, 0.66666666666666, 0.333333333333333, -1];
        if (sp00 !== undefined) {
            for (var i = 0; i < sp00.freeControlPoints.length; i++) {
                chai_1.expect(sp00.freeControlPoints[i].x).to.be.closeTo(cpX00[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp00.freeControlPoints[i].y).to.be.closeTo(cpY00[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sp11 = sp00 === null || sp00 === void 0 ? void 0 : sp00.clone();
        sp11 === null || sp11 === void 0 ? void 0 : sp11.insertKnotBoehmAlgorithm(1);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.freeControlPoints.length).to.eql(7);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.knots.length).to.eql(10);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.knots).to.eql([0, 0, 0, 1, 1, 2, 3, 4, 4, 4]);
        var cpX11 = [0.333333333333333, -1, -1, 0.333333333333333, 0.66666666666666, 1, 1];
        var cpY11 = [-1, -1, 1, 1, 0.66666666666666, 0.333333333333333, -0.333333333333333];
        if (sp11 !== undefined) {
            for (var i = 0; i < sp11.freeControlPoints.length; i++) {
                chai_1.expect(sp11.freeControlPoints[i].x).to.be.closeTo(cpX11[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp11.freeControlPoints[i].y).to.be.closeTo(cpY11[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp11 === null || sp11 === void 0 ? void 0 : sp11.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can insert repeatedly a knot using Boehm algorithm for a cubic B-Spline at knot u = 2 of the initial sequence when the initial knot has a multiplicity greater than one', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var curveDegree = 3;
        var knots = [0, 1, 2, 3, 4];
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sp0 = s === null || s === void 0 ? void 0 : s.clone();
        sp0 === null || sp0 === void 0 ? void 0 : sp0.insertKnotBoehmAlgorithm(0);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.freeControlPoints.length).to.eql(5);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.knots.length).to.eql(7);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.knots).to.eql([0, 0, 1, 2, 3, 4, 4]);
        var cpX0 = [-1, -1, 0.333333333333333, 1, 1];
        var cpY0 = [-1, 1, 1, 0.333333333333333, -1];
        if (sp0 !== undefined) {
            for (var i = 0; i < sp0.freeControlPoints.length; i++) {
                chai_1.expect(sp0.freeControlPoints[i].x).to.be.closeTo(cpX0[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp0.freeControlPoints[i].y).to.be.closeTo(cpY0[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp0 === null || sp0 === void 0 ? void 0 : sp0.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sp2 = sp0 === null || sp0 === void 0 ? void 0 : sp0.clone();
        sp2 === null || sp2 === void 0 ? void 0 : sp2.insertKnotBoehmAlgorithm(2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.freeControlPoints.length).to.eql(6);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.knots.length).to.eql(8);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.knots).to.eql([0, 0, 1, 2, 2, 3, 4, 4]);
        var cpX2 = [-0.333333333333333, -1, -1, 0.333333333333333, 1, 1];
        var cpY2 = [-1, -0.333333333333333, 1, 1, 0.333333333333333, -1];
        if (sp2 !== undefined) {
            for (var i = 0; i < sp2.freeControlPoints.length; i++) {
                chai_1.expect(sp2.freeControlPoints[i].x).to.be.closeTo(cpX2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp2.freeControlPoints[i].y).to.be.closeTo(cpY2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp2 === null || sp2 === void 0 ? void 0 : sp2.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        // insert the knot at origin once again
        var sp00 = sp0 === null || sp0 === void 0 ? void 0 : sp0.clone();
        sp00 === null || sp00 === void 0 ? void 0 : sp00.insertKnotBoehmAlgorithm(0);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.freeControlPoints.length).to.eql(6);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.knots.length).to.eql(9);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 4]);
        var cpX00 = [-1, -1, 0.333333333333333, 0.66666666666666, 1, 1];
        var cpY00 = [-1, 1, 1, 0.66666666666666, 0.333333333333333, -1];
        if (sp00 !== undefined) {
            for (var i = 0; i < sp00.freeControlPoints.length; i++) {
                chai_1.expect(sp00.freeControlPoints[i].x).to.be.closeTo(cpX00[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp00.freeControlPoints[i].y).to.be.closeTo(cpY00[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp00 === null || sp00 === void 0 ? void 0 : sp00.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sp22 = sp00 === null || sp00 === void 0 ? void 0 : sp00.clone();
        sp22 === null || sp22 === void 0 ? void 0 : sp22.insertKnotBoehmAlgorithm(2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.freeControlPoints.length).to.eql(7);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.knots.length).to.eql(10);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.knots).to.eql([0, 0, 0, 1, 2, 2, 3, 4, 4, 4]);
        var cpX22 = [-0.333333333333333, -1, -1, 0.333333333333333, 0.66666666666666, 1, 1];
        var cpY22 = [-1, -0.333333333333333, 1, 1, 0.66666666666666, 0.333333333333333, -1];
        if (sp22 !== undefined) {
            for (var i = 0; i < sp22.freeControlPoints.length; i++) {
                chai_1.expect(sp22.freeControlPoints[i].x).to.be.closeTo(cpX22[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sp22.freeControlPoints[i].y).to.be.closeTo(cpY22[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sp22 === null || sp22 === void 0 ? void 0 : sp22.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can insert a knot using Boehm algorithm for a minimal cubic B-Spline with an initial sequence having a maximal knot multiplicity at the origin', function () {
        // triangular control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var knots = [0, 0, 0, 1, 1, 1];
        var curveDegree = 3;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints).to.eql([cp0, cp1, cp2]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0.5).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0.5).y).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var s05 = s === null || s === void 0 ? void 0 : s.clone();
        s05 === null || s05 === void 0 ? void 0 : s05.insertKnotBoehmAlgorithm(0.5);
        chai_1.expect(s05 === null || s05 === void 0 ? void 0 : s05.freeControlPoints.length).to.eql(4);
        chai_1.expect(s05 === null || s05 === void 0 ? void 0 : s05.knots.length).to.eql(7);
        chai_1.expect(s05 === null || s05 === void 0 ? void 0 : s05.knots).to.eql([0, 0, 0, 0.5, 1, 1, 1]);
        var cpX = [0.5, 0.0, -0.5, 0.0];
        var cpY = [0.5, 0.0, 0.5, 1];
        if (s05 !== undefined) {
            for (var i = 0; i < s05.freeControlPoints.length; i++) {
                chai_1.expect(s05.freeControlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(s05.freeControlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(s05 === null || s05 === void 0 ? void 0 : s05.evaluate(0).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s05 === null || s05 === void 0 ? void 0 : s05.evaluate(0).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s05 === null || s05 === void 0 ? void 0 : s05.evaluate(1).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s05 === null || s05 === void 0 ? void 0 : s05.evaluate(1).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s05 === null || s05 === void 0 ? void 0 : s05.evaluate(0.5).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s05 === null || s05 === void 0 ? void 0 : s05.evaluate(0.5).y).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var s05_2 = s05 === null || s05 === void 0 ? void 0 : s05.clone();
        s05_2 === null || s05_2 === void 0 ? void 0 : s05_2.insertKnotBoehmAlgorithm(0.5);
        chai_1.expect(s05_2 === null || s05_2 === void 0 ? void 0 : s05_2.freeControlPoints.length).to.eql(5);
        chai_1.expect(s05_2 === null || s05_2 === void 0 ? void 0 : s05_2.knots.length).to.eql(8);
        chai_1.expect(s05_2 === null || s05_2 === void 0 ? void 0 : s05_2.knots).to.eql([0, 0, 0, 0.5, 0.5, 1, 1, 1]);
        var cpX2 = [0.25, 0.5, 0.0, -0.5, -0.25];
        var cpY2 = [0.75, 0.5, 0.0, 0.5, 0.75];
        if (s05_2 !== undefined) {
            for (var i = 0; i < s05_2.freeControlPoints.length; i++) {
                chai_1.expect(s05_2.freeControlPoints[i].x).to.be.closeTo(cpX2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(s05_2.freeControlPoints[i].y).to.be.closeTo(cpY2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(s05_2 === null || s05_2 === void 0 ? void 0 : s05_2.evaluate(0).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s05_2 === null || s05_2 === void 0 ? void 0 : s05_2.evaluate(0).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s05_2 === null || s05_2 === void 0 ? void 0 : s05_2.evaluate(1).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s05_2 === null || s05_2 === void 0 ? void 0 : s05_2.evaluate(1).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s05_2 === null || s05_2 === void 0 ? void 0 : s05_2.evaluate(0.5).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s05_2 === null || s05_2 === void 0 ? void 0 : s05_2.evaluate(0.5).y).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('cannot evaluate a periodic B-Spline outside the interval defined by its periodic knot sequence', function () {
        // control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, 0);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 1;
        var spline = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (spline !== undefined) {
            chai_1.expect(spline.evaluate(-0.1)).to.eql(new Vector2d_1.Vector2d(Infinity, Infinity));
            var abscissa = 4 + Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2;
            chai_1.expect(spline.evaluate(abscissa)).to.eql(new Vector2d_1.Vector2d(Infinity, Infinity));
        }
    });
    it('can evaluate a periodic B-Spline with uniform knot sequence at a point u', function () {
        // control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, 0);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 1;
        var maxMultiplicityOrder = curveDegree;
        var spline = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        var incSequence = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots });
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0, incSequence)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(1, 1, incSequence));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(1, 1, incSequence)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 2, incSequence));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 2, incSequence)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3, incSequence));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 2.75, incSequence)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3.75, incSequence));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(1, 1.25, incSequence)[0]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 2.75, incSequence)[1]);
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(1, 1.25, incSequence)[1]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 2.75, incSequence)[0]);
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0.25, incSequence)[0]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3.75, incSequence)[1]);
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0.25, incSequence)[1]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3.75, incSequence)[0]);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(0)).to.eql(cp3);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(1)).to.eql(cp0);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(2)).to.eql(cp1);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(3)).to.eql(cp2);
        curveDegree = 2;
        maxMultiplicityOrder = curveDegree;
        var spline2 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        var incSequence2 = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots });
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0, incSequence2)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(1, 1, incSequence2));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(1, 1, incSequence2)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 2, incSequence2));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 2, incSequence2)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3, incSequence2));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 2.75, incSequence2)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3.75, incSequence2));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0.25, incSequence2)[0]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3.75, incSequence2)[2]);
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0.25, incSequence2)[1]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3.75, incSequence2)[1]);
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0.25, incSequence2)[2]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3.75, incSequence2)[0]);
        chai_1.expect(spline2 === null || spline2 === void 0 ? void 0 : spline2.evaluate(0)).to.eql(new Vector2d_1.Vector2d(1, 0.5));
        chai_1.expect(spline2 === null || spline2 === void 0 ? void 0 : spline2.evaluate(1)).to.eql(new Vector2d_1.Vector2d(0.5, 0));
        chai_1.expect(spline2 === null || spline2 === void 0 ? void 0 : spline2.evaluate(2)).to.eql(new Vector2d_1.Vector2d(0, 0.5));
        chai_1.expect(spline2 === null || spline2 === void 0 ? void 0 : spline2.evaluate(3)).to.eql(new Vector2d_1.Vector2d(0.5, 1));
        curveDegree = 3;
        maxMultiplicityOrder = curveDegree;
        var spline3 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        var incSequence3 = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots });
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0, incSequence3)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(1, 1, incSequence3));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(1, 1, incSequence3)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 2, incSequence3));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 2, incSequence3)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3, incSequence3));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 2.75, incSequence3)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3.75, incSequence3));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0.25, incSequence3)[0]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3.75, incSequence3)[3]);
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0.25, incSequence3)[1]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3.75, incSequence3)[2]);
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0.25, incSequence3)[2]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3.75, incSequence3)[1]);
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0.25, incSequence3)[3]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(3, 3.75, incSequence3)[0]);
        chai_1.expect(spline3 === null || spline3 === void 0 ? void 0 : spline3.evaluate(0).x).to.be.closeTo(0.833333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline3 === null || spline3 === void 0 ? void 0 : spline3.evaluate(0).y).to.be.closeTo(0.833333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline3 === null || spline3 === void 0 ? void 0 : spline3.evaluate(1).x).to.be.closeTo(0.833333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline3 === null || spline3 === void 0 ? void 0 : spline3.evaluate(1).y).to.be.closeTo(0.166666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline3 === null || spline3 === void 0 ? void 0 : spline3.evaluate(2).x).to.be.closeTo(0.166666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline3 === null || spline3 === void 0 ? void 0 : spline3.evaluate(2).y).to.be.closeTo(0.166666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline3 === null || spline3 === void 0 ? void 0 : spline3.evaluate(3).x).to.be.closeTo(0.166666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline3 === null || spline3 === void 0 ? void 0 : spline3.evaluate(3).y).to.be.closeTo(0.833333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can evaluate a periodic quadratic B-Spline with an arbitrary knot sequence at a point u', function () {
        // control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, 0);
        var cp4 = new Vector2d_1.Vector2d(0.5, -0.5);
        var knots = [0, 0, 1, 2, 3, 4, 4];
        var curveDegree = 2;
        var maxMultiplicityOrder = curveDegree;
        var spline = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4], knots, curveDegree);
        var incSequence = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots });
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 1, incSequence)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(4, 3, incSequence));
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(1, 0.5, incSequence)[0]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(4, 3.5, incSequence)[2]);
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(1, 0.5, incSequence)[1]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(4, 3.5, incSequence)[1]);
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(1, 0.5, incSequence)[2]).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(4, 3.5, incSequence)[0]);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(0).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(0).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(1).x).to.be.closeTo(0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(1).y).to.be.closeTo(-0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(2).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(3).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can evaluate a periodic cubic B-Spline with arbitrary knot multiplicity at its origin', function () {
        // control polygon
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, 0);
        var cp4 = new Vector2d_1.Vector2d(1, -1);
        var cp5 = new Vector2d_1.Vector2d(0, -1);
        var knots = [0, 1, 2, 3, 4, 5, 6];
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree;
        var spline = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5], knots, curveDegree);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5]);
        var incSequence = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots });
        for (var i = 0; i < (incSequence.length() - 2); i++) {
            var basis = Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(i, i, incSequence);
            chai_1.expect(basis[0]).to.be.closeTo(0.1666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(basis[1]).to.be.closeTo(0.6666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(basis[2]).to.be.closeTo(0.1666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(basis[3]).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
        chai_1.expect(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(0, 0, incSequence)).to.eql(Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(4, 4, incSequence));
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(0).x).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline === null || spline === void 0 ? void 0 : spline.evaluate(0).y).to.be.closeTo(-0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var cp6 = new Vector2d_1.Vector2d(1, -0.66666666666666);
        var cp7 = new Vector2d_1.Vector2d(0.66666666666666, -1);
        var knots1 = [0, 0, 1, 2, 3, 4, 5, 6, 6];
        var spline1 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp6, cp7, cp5], knots1, curveDegree);
        chai_1.expect(spline1 === null || spline1 === void 0 ? void 0 : spline1.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp6, cp7, cp5]);
        var incSequence1 = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots1 });
        var basis1 = Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(1, 0, incSequence1);
        chai_1.expect(basis1[0]).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(basis1[1]).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(basis1[2]).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(basis1[3]).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        basis1 = Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 1, incSequence1);
        chai_1.expect(basis1[0]).to.be.closeTo(0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(basis1[1]).to.be.closeTo(0.583333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(basis1[2]).to.be.closeTo(0.1666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(basis1[3]).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        for (var i = 3; i < (incSequence.length() - 4); i++) {
            basis1 = Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(i, (i - 1), incSequence1);
            chai_1.expect(basis1[0]).to.be.closeTo(0.1666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(basis1[1]).to.be.closeTo(0.6666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(basis1[2]).to.be.closeTo(0.1666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(basis1[3]).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
        chai_1.expect(spline1 === null || spline1 === void 0 ? void 0 : spline1.evaluate(0).x).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline1 === null || spline1 === void 0 ? void 0 : spline1.evaluate(0).y).to.be.closeTo(-0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var cp8 = new Vector2d_1.Vector2d(0.83333333333333, -0.83333333333333);
        var knots2 = [0, 0, 0, 1, 2, 3, 4, 5, 6, 6, 6];
        var spline2 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp6, cp8, cp7, cp5], knots2, curveDegree);
        chai_1.expect(spline2 === null || spline2 === void 0 ? void 0 : spline2.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp6, cp8, cp7, cp5]);
        var incSequence2 = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots2 });
        var basis2 = Piegl_Tiller_NURBS_Book_1.basisFunctionsFromSequence(2, 0, incSequence2);
        chai_1.expect(basis2[0]).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(basis2[1]).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(basis2[2]).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(basis2[3]).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline2 === null || spline2 === void 0 ? void 0 : spline2.evaluate(0).x).to.be.closeTo(0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(spline2 === null || spline2 === void 0 ? void 0 : spline2.evaluate(0).y).to.be.closeTo(-0.83333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can increment the degree of a linear periodic B-Spline ', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, 0);
        var cp4 = new Vector2d_1.Vector2d(1, -1);
        var cp5 = new Vector2d_1.Vector2d(0, -1);
        var knots = [0, 1, 2, 3, 4, 5, 6];
        var curveDegree = 1;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0.5).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0.5).y).to.be.closeTo(-0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1.5).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1.5).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2.5).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2.5).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3.5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3.5).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4.5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4.5).y).to.be.closeTo(-0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5.5).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5.5).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var intermSplineKnots = s === null || s === void 0 ? void 0 : s.generateIntermediateSplinesForDegreeElevation();
        var knots0 = [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6];
        var knots1 = [0, 1, 1, 2, 3, 3, 4, 5, 5, 6];
        chai_1.expect(intermSplineKnots === null || intermSplineKnots === void 0 ? void 0 : intermSplineKnots.knotVectors[0]).to.eql(knots0);
        chai_1.expect(intermSplineKnots === null || intermSplineKnots === void 0 ? void 0 : intermSplineKnots.knotVectors[1]).to.eql(knots1);
        chai_1.expect(intermSplineKnots === null || intermSplineKnots === void 0 ? void 0 : intermSplineKnots.CPs[0]).to.eql([cp0, cp1, cp2, cp2, cp3, cp4, cp4, cp5, cp0]);
        chai_1.expect(intermSplineKnots === null || intermSplineKnots === void 0 ? void 0 : intermSplineKnots.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp3, cp4, cp5, cp5]);
        curveDegree = 2;
        var s0 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp2, cp3, cp4, cp4, cp5, cp0], knots0, curveDegree);
        s0 === null || s0 === void 0 ? void 0 : s0.insertKnotBoehmAlgorithm(1);
        s0 === null || s0 === void 0 ? void 0 : s0.insertKnotBoehmAlgorithm(3);
        s0 === null || s0 === void 0 ? void 0 : s0.insertKnotBoehmAlgorithm(5);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(0).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(0).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(1).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(1).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(2).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(3).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(4).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(4).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(5).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.freeControlPoints.length).to.eql(12);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.knots.length).to.eql(14);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
        var cpX0 = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0];
        var cpY0 = [0, 0, 1, 1, 1, 1, 0, -1, -1, -1, -1, 0];
        if (s0 !== undefined) {
            for (var i = 0; i < s0.freeControlPoints.length; i++) {
                chai_1.expect(s0.freeControlPoints[i].x).to.be.closeTo(cpX0[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(s0.freeControlPoints[i].y).to.be.closeTo(cpY0[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        var s1 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp1, cp2, cp3, cp3, cp4, cp5, cp5], knots1, curveDegree);
        s1 === null || s1 === void 0 ? void 0 : s1.insertKnotBoehmAlgorithm(0);
        s1 === null || s1 === void 0 ? void 0 : s1.insertKnotBoehmAlgorithm(2);
        s1 === null || s1 === void 0 ? void 0 : s1.insertKnotBoehmAlgorithm(4);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(0).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(0).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(1).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(1).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(2).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(3).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(4).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(4).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(5).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.freeControlPoints.length).to.eql(12);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.knots.length).to.eql(14);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
        var cpX1 = [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0];
        var cpY1 = [0, 1, 1, 1, 1, 0, 0, 0, -1, -1, -1, -1];
        if (s1 !== undefined) {
            for (var i = 0; i < s1.freeControlPoints.length; i++) {
                chai_1.expect(s1.freeControlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(s1.freeControlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        var newSpline = s === null || s === void 0 ? void 0 : s.degreeIncrement();
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.degree).to.eql(2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.knots.length).to.eql(14);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.freeControlPoints.length).to.eql(12);
        var cpXns = [0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0, 0];
        var cpYns = [0, 0.5, 1, 1, 1, 0.5, 0, -0.5, -1, -1, -1, -0.5];
        if (newSpline !== undefined) {
            for (var i = 0; i < newSpline.freeControlPoints.length; i++) {
                chai_1.expect(newSpline.freeControlPoints[i].x).to.be.closeTo(cpXns[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(newSpline.freeControlPoints[i].y).to.be.closeTo(cpYns[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(0).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(0).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(1).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(1).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(2).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(3).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(4).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(4).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(5).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(0.5).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(0.5).y).to.be.closeTo(-0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(1.5).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(1.5).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(2.5).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(2.5).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(3.5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(3.5).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(4.5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(4.5).y).to.be.closeTo(-0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(5.5).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(5.5).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can increment the degree of a quadratic periodic B-Spline ', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(0, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, 0);
        var cp4 = new Vector2d_1.Vector2d(1, -1);
        var cp5 = new Vector2d_1.Vector2d(0, -1);
        var knots = [0, 1, 2, 3, 4, 5, 6];
        var curveDegree = 2;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp4, cp5]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(-0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5).y).to.be.closeTo(-0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0.5).x).to.be.closeTo(0.125, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0.5).y).to.be.closeTo(-0.875, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1.5).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1.5).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2.5).x).to.be.closeTo(0.125, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2.5).y).to.be.closeTo(0.875, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3.5).x).to.be.closeTo(0.875, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3.5).y).to.be.closeTo(0.875, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4.5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4.5).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5.5).x).to.be.closeTo(0.875, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5.5).y).to.be.closeTo(-0.875, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var intermSplineKnots = s === null || s === void 0 ? void 0 : s.generateIntermediateSplinesForDegreeElevation();
        var knots0 = [0, 0, 1, 2, 3, 3, 4, 5, 6, 6];
        var knots1 = [0, 1, 1, 2, 3, 4, 4, 5, 6];
        var knots2 = [0, 1, 2, 2, 3, 4, 5, 5, 6];
        chai_1.expect(intermSplineKnots === null || intermSplineKnots === void 0 ? void 0 : intermSplineKnots.knotVectors[0]).to.eql(knots0);
        chai_1.expect(intermSplineKnots === null || intermSplineKnots === void 0 ? void 0 : intermSplineKnots.knotVectors[1]).to.eql(knots1);
        chai_1.expect(intermSplineKnots === null || intermSplineKnots === void 0 ? void 0 : intermSplineKnots.knotVectors[2]).to.eql(knots2);
        chai_1.expect(intermSplineKnots === null || intermSplineKnots === void 0 ? void 0 : intermSplineKnots.CPs[0]).to.eql([cp0, cp1, cp2, cp3, cp3, cp4, cp5, cp0]);
        chai_1.expect(intermSplineKnots === null || intermSplineKnots === void 0 ? void 0 : intermSplineKnots.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp4, cp4, cp5]);
        chai_1.expect(intermSplineKnots === null || intermSplineKnots === void 0 ? void 0 : intermSplineKnots.CPs[2]).to.eql([cp0, cp1, cp2, cp2, cp3, cp4, cp5, cp5]);
        curveDegree = 3;
        var s0 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp3, cp4, cp5, cp0], knots0, curveDegree);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(0).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(0).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(1).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(1).y).to.be.closeTo(-0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(2).y).to.be.closeTo(0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(3).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(4).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(4).y).to.be.closeTo(0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(5).y).to.be.closeTo(-0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        s0 === null || s0 === void 0 ? void 0 : s0.insertKnotBoehmAlgorithm(1);
        s0 === null || s0 === void 0 ? void 0 : s0.insertKnotBoehmAlgorithm(2);
        s0 === null || s0 === void 0 ? void 0 : s0.insertKnotBoehmAlgorithm(4);
        s0 === null || s0 === void 0 ? void 0 : s0.insertKnotBoehmAlgorithm(5);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(0).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(0).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(1).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(1).y).to.be.closeTo(-0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(2).y).to.be.closeTo(0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(3).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(4).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(4).y).to.be.closeTo(0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.evaluate(5).y).to.be.closeTo(-0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.freeControlPoints.length).to.eql(12);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.knots.length).to.eql(14);
        chai_1.expect(s0 === null || s0 === void 0 ? void 0 : s0.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
        var cpX0 = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0];
        var cpY0 = [0, 0, 0.5, 1, 1, 0.5, 0, 0, -0.5, -1, -1, -0.5];
        if (s0 !== undefined) {
            for (var i = 0; i < s0.freeControlPoints.length; i++) {
                chai_1.expect(s0.freeControlPoints[i].x).to.be.closeTo(cpX0[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(s0.freeControlPoints[i].y).to.be.closeTo(cpY0[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        var s1 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp1, cp2, cp3, cp4, cp4, cp5], knots1, curveDegree);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(0).x).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(0).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(1).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(1).y).to.be.closeTo(-0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(2).y).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(3).x).to.be.closeTo(0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(4).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(4).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(5).y).to.be.closeTo(-0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        s1 === null || s1 === void 0 ? void 0 : s1.insertKnotBoehmAlgorithm(0);
        s1 === null || s1 === void 0 ? void 0 : s1.insertKnotBoehmAlgorithm(2);
        s1 === null || s1 === void 0 ? void 0 : s1.insertKnotBoehmAlgorithm(3);
        s1 === null || s1 === void 0 ? void 0 : s1.insertKnotBoehmAlgorithm(5);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(0).x).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(0).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(1).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(1).y).to.be.closeTo(-0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(2).y).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(3).x).to.be.closeTo(0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(4).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(4).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.evaluate(5).y).to.be.closeTo(-0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.freeControlPoints.length).to.eql(12);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.knots.length).to.eql(14);
        chai_1.expect(s1 === null || s1 === void 0 ? void 0 : s1.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
        var cpX1 = [0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0];
        var cpY1 = [0, 0.5, 1, 1, 1, 1, 0, -0.5, -1, -1, -1, -1];
        if (s1 !== undefined) {
            for (var i = 0; i < s1.freeControlPoints.length; i++) {
                chai_1.expect(s1.freeControlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(s1.freeControlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        var s2 = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp2, cp3, cp4, cp5, cp5], knots2, curveDegree);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(0).x).to.be.closeTo(0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(0).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(1).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(1).y).to.be.closeTo(-0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(2).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(3).x).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(4).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(4).y).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(5).y).to.be.closeTo(-0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        s2 === null || s2 === void 0 ? void 0 : s2.insertKnotBoehmAlgorithm(0);
        s2 === null || s2 === void 0 ? void 0 : s2.insertKnotBoehmAlgorithm(1);
        s2 === null || s2 === void 0 ? void 0 : s2.insertKnotBoehmAlgorithm(3);
        s2 === null || s2 === void 0 ? void 0 : s2.insertKnotBoehmAlgorithm(4);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(0).x).to.be.closeTo(0.25, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(0).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(1).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(1).y).to.be.closeTo(-0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(2).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(3).x).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(4).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(4).y).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.evaluate(5).y).to.be.closeTo(-0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.freeControlPoints.length).to.eql(12);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.knots.length).to.eql(14);
        chai_1.expect(s2 === null || s2 === void 0 ? void 0 : s2.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
        var cpX2 = [0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0, 0];
        var cpY2 = [-0.5, 0, 1, 1, 1, 1, 0.5, 0, -1, -1, -1, -1];
        if (s2 !== undefined) {
            for (var i = 0; i < s2.freeControlPoints.length; i++) {
                chai_1.expect(s2.freeControlPoints[i].x).to.be.closeTo(cpX2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(s2.freeControlPoints[i].y).to.be.closeTo(cpY2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        var newSpline = s === null || s === void 0 ? void 0 : s.degreeIncrement();
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.degree).to.eql(3);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.knots.length).to.eql(14);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.freeControlPoints.length).to.eql(12);
        var cpX = [0, 0, 0, 0.166666666666666, 0.83333333333333, 1, 1, 1, 1, 0.83333333333333, 0.166666666666666, 0];
        var cpY = [-0.166666666666666, 0.166666666666666, 0.83333333333333, 1, 1, 0.83333333333333, 0.166666666666666, -0.166666666666666, -0.83333333333333, -1, -1, -0.83333333333333];
        if (newSpline !== undefined) {
            for (var i = 0; i < newSpline.freeControlPoints.length; i++) {
                chai_1.expect(newSpline.freeControlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(newSpline.freeControlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(0).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(0).y).to.be.closeTo(-1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(1).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(1).y).to.be.closeTo(-0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(2).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(2).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(3).x).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(3).y).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(4).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(4).y).to.be.closeTo(0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(5).y).to.be.closeTo(-0.5, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(0.5).x).to.be.closeTo(0.125, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(0.5).y).to.be.closeTo(-0.875, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(1.5).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(1.5).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(2.5).x).to.be.closeTo(0.125, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(2.5).y).to.be.closeTo(0.875, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(3.5).x).to.be.closeTo(0.875, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(3.5).y).to.be.closeTo(0.875, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(4.5).x).to.be.closeTo(1, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(4.5).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(5.5).x).to.be.closeTo(0.875, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(5.5).y).to.be.closeTo(-0.875, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can increment the degree of a cubic periodic BSpline', function () {
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
        var px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3;
        var py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72;
        var cp = [[-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4],
            [px0, py5], [px1, py4], [px2, py2], [px3, py0],
            [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4],
            [-px2, -py2], [-px3, py0], [-px2, py2]];
        var knots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        var curveDegree = 3;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(-0.68, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(-0.145, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(-0.5783333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).x).to.be.closeTo(-0.255, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).y).to.be.closeTo(-0.3333333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).x).to.be.closeTo(-0.29, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4).x).to.be.closeTo(-0.255, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(4).y).to.be.closeTo(0.3333333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5).x).to.be.closeTo(-0.145, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(5).y).to.be.closeTo(0.5783333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(6).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(6).y).to.be.closeTo(0.68, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(7).x).to.be.closeTo(0.145, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(7).y).to.be.closeTo(0.5783333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(8).x).to.be.closeTo(0.255, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(8).y).to.be.closeTo(0.3333333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(9).x).to.be.closeTo(0.29, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(9).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(10).x).to.be.closeTo(0.255, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(10).y).to.be.closeTo(-0.3333333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(11).x).to.be.closeTo(0.145, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(11).y).to.be.closeTo(-0.5783333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var newSpline = s === null || s === void 0 ? void 0 : s.degreeIncrement();
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.degree).to.eql(4);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.knots.length).to.eql(26);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12]);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.freeControlPoints.length).to.eql(24);
        var cpX = [-0.21, -0.2625, -0.285, -0.295, -0.285, -0.2625, -0.21, -0.1475,
            -0.075, 0.0, 0.075, 0.1475, 0.21, 0.2625, 0.285, 0.295,
            0.285, 0.2625, 0.21, 0.1475, 0.075, 0.0, -0.075, -0.1475];
        var cpY = [-0.475, -0.3416666666666666, -0.175, 0.0, 0.175, 0.3416666666666666, 0.475, 0.58916666666666666666,
            0.66, 0.7, 0.66, 0.58916666666666666666, 0.475, 0.34166666666666666, 0.175, 0.0,
            -0.175, -0.3416666666666666, -0.475, -0.58916666666666666666, -0.66, -0.7, -0.66, -0.58916666666666666666];
        if (newSpline !== undefined) {
            for (var i = 0; i < newSpline.freeControlPoints.length; i++) {
                chai_1.expect(newSpline.freeControlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(newSpline.freeControlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(0).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(0).y).to.be.closeTo(-0.68, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(1).x).to.be.closeTo(-0.145, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(1).y).to.be.closeTo(-0.5783333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(2).x).to.be.closeTo(-0.255, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(2).y).to.be.closeTo(-0.3333333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(3).x).to.be.closeTo(-0.29, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(3).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(4).x).to.be.closeTo(-0.255, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(4).y).to.be.closeTo(0.3333333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(5).x).to.be.closeTo(-0.145, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(5).y).to.be.closeTo(0.5783333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(6).x).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(6).y).to.be.closeTo(0.68, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(7).x).to.be.closeTo(0.145, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(7).y).to.be.closeTo(0.5783333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(8).x).to.be.closeTo(0.255, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(8).y).to.be.closeTo(0.3333333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(9).x).to.be.closeTo(0.29, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(9).y).to.be.closeTo(0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(10).x).to.be.closeTo(0.255, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(10).y).to.be.closeTo(-0.3333333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(11).x).to.be.closeTo(0.145, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(newSpline === null || newSpline === void 0 ? void 0 : newSpline.evaluate(11).y).to.be.closeTo(-0.5783333333333333, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can convert a periodic BSpline into a non periodic BSpline with open knot sequence. Case of curve equivalent to a Bézier curve', function () {
        // triangular control polygon
        var cp0 = new Vector2d_1.Vector2d(0, 0);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var knots = [0, 0, 0, 1, 1, 1];
        var curveDegree = 3;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints).to.eql([cp0, cp1, cp2]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0.5).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0.5).y).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sOpen = s === null || s === void 0 ? void 0 : s.toPeriodicBSplineR1toR2withOpenKnotSequence();
        chai_1.expect(sOpen === null || sOpen === void 0 ? void 0 : sOpen.degree).to.eql(3);
        chai_1.expect(sOpen === null || sOpen === void 0 ? void 0 : sOpen.controlPoints.length).to.eql(4);
        chai_1.expect(sOpen === null || sOpen === void 0 ? void 0 : sOpen.controlPoints).to.eql([cp0, cp1, cp2, cp0]);
        chai_1.expect(sOpen === null || sOpen === void 0 ? void 0 : sOpen.knots.length).to.eql(8);
        chai_1.expect(sOpen === null || sOpen === void 0 ? void 0 : sOpen.knots).to.eql([-1, 0, 0, 0, 1, 1, 1, 2]);
        chai_1.expect(sOpen === null || sOpen === void 0 ? void 0 : sOpen.evaluate(0).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpen === null || sOpen === void 0 ? void 0 : sOpen.evaluate(0).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpen === null || sOpen === void 0 ? void 0 : sOpen.evaluate(1).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpen === null || sOpen === void 0 ? void 0 : sOpen.evaluate(1).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpen === null || sOpen === void 0 ? void 0 : sOpen.evaluate(0.5).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sOpen === null || sOpen === void 0 ? void 0 : sOpen.evaluate(0.5).y).to.be.closeTo(0.75, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can convert a periodic B-Spline with a uniform knot sequence to a periodic BSpline with open knot sequence', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0.5).x).to.be.closeTo(0.916666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0.5).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sPer = s === null || s === void 0 ? void 0 : s.toPeriodicBSplineR1toR2withOpenKnotSequence();
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.degree).to.eql(curveDegree);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.freeControlPoints.length).to.eql(4);
        var cpX = [-1, 1, 1, -1, -1, 1, 1];
        var cpY = [1, 1, -1, -1, 1, 1, -1];
        if (sPer !== undefined) {
            for (var i = 0; i < sPer.freeControlPoints.length; i++) {
                chai_1.expect(sPer.freeControlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sPer.freeControlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.controlPoints.length).to.eql(7);
        if (sPer !== undefined) {
            for (var i = 0; i < sPer.controlPoints.length; i++) {
                chai_1.expect(sPer.controlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sPer.controlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        // expect(sPer?.controlPoints).to.eql([cp1, cp2, cp3, cp0, cp1, cp2, cp3])
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.knots.length).to.eql(11);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.knots).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(4).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(4).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0.5).x).to.be.closeTo(0.916666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0.5).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can convert a periodic B-Spline with a knot multiplicity at origin greater than one to a periodic BSpline with open knot sequence', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var s = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        s === null || s === void 0 ? void 0 : s.insertKnotBoehmAlgorithm(0);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.knots).to.eql([0, 0, 1, 2, 3, 4, 4]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var cp4 = new Vector2d_1.Vector2d(0.3333333333333333, 1);
        var cp5 = new Vector2d_1.Vector2d(1, 0.3333333333333333);
        var sPer = s === null || s === void 0 ? void 0 : s.toPeriodicBSplineR1toR2withOpenKnotSequence();
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.degree).to.eql(curveDegree);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.freeControlPoints.length).to.eql(5);
        // expect(sPer?.freeControlPoints).to.eql([cp4, cp5, cp3, cp0, cp1])
        var cpX = [0.3333333333333333, 1, 1, -1, -1, 0.3333333333333333, 1];
        var cpY = [1, 0.3333333333333333, -1, -1, 1, 1, 0.3333333333333333];
        if (sPer !== undefined) {
            for (var i = 0; i < sPer.freeControlPoints.length; i++) {
                chai_1.expect(sPer.freeControlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sPer.freeControlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.controlPoints.length).to.eql(7);
        // expect(sPer?.controlPoints).to.eql([cp4, cp5, cp3, cp0, cp1, cp4, cp5])
        if (sPer !== undefined) {
            for (var i = 0; i < sPer.controlPoints.length; i++) {
                chai_1.expect(sPer.controlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sPer.controlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.knots.length).to.eql(11);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.knots).to.eql([-2, -1, 0, 0, 1, 2, 3, 4, 4, 5, 6]);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        s === null || s === void 0 ? void 0 : s.insertKnotBoehmAlgorithm(0);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 4]);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(s === null || s === void 0 ? void 0 : s.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var cp6 = new Vector2d_1.Vector2d(0.66666666666666, 0.66666666666666);
        var sPer1 = s === null || s === void 0 ? void 0 : s.toPeriodicBSplineR1toR2withOpenKnotSequence();
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.degree).to.eql(curveDegree);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.freeControlPoints.length).to.eql(6);
        // expect(sPer1?.freeControlPoints).to.eql([cp4, cp5, cp3, cp0, cp1])
        var cpX1 = [0.66666666666666, 1, 1, -1, -1, 0.3333333333333333, 0.66666666666666];
        var cpY1 = [0.66666666666666, 0.3333333333333333, -1, -1, 1, 1, 0.66666666666666];
        if (sPer1 !== undefined) {
            for (var i = 0; i < sPer1.freeControlPoints.length; i++) {
                chai_1.expect(sPer1.freeControlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(sPer1.freeControlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.controlPoints.length).to.eql(7);
        // expect(sPer1?.controlPoints).to.eql([cp4, cp5, cp3, cp0, cp1, cp4, cp5])
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.knots.length).to.eql(11);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.knots).to.eql([-1, 0, 0, 0, 1, 2, 3, 4, 4, 4, 5]);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can insert a knot repeatedly at the origin of a periodic BSpline without calling repeatedly the knot insertion algorithm', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var sPer = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        sPer === null || sPer === void 0 ? void 0 : sPer.insertKnotBoehmAlgorithm(0, 2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 4]);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can insert a knot repeatedly at a knot or any abscissa apart from the origin of a periodic BSpline without calling repeatedly the knot insertion algorithm', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var sPer = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var sPer1 = sPer === null || sPer === void 0 ? void 0 : sPer.clone();
        var sPer2 = sPer === null || sPer === void 0 ? void 0 : sPer.clone();
        var sPer3 = sPer === null || sPer === void 0 ? void 0 : sPer.clone();
        var sPer4 = sPer === null || sPer === void 0 ? void 0 : sPer.clone();
        sPer === null || sPer === void 0 ? void 0 : sPer.insertKnotBoehmAlgorithm(1, 2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.knots).to.eql([0, 1, 1, 1, 2, 3, 4]);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer === null || sPer === void 0 ? void 0 : sPer.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.insertKnotBoehmAlgorithm(0.5, 3);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.knots).to.eql([0, 0.5, 0.5, 0.5, 1, 2, 3, 4]);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        console.log("p0 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(0).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(0).y));
        console.log("p1 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(1.5).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(1.5).y));
        console.log("p2 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(2).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(2).y));
        console.log("p3 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(3).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(3).y));
        sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.insertKnotBoehmAlgorithm(1.5, 3);
        chai_1.expect(sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.knots).to.eql([0, 1, 1.5, 1.5, 1.5, 2, 3, 4]);
        console.log("p0 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(0).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(0).y));
        console.log("p1 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(1.5).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(1.5).y));
        console.log("p2 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(2).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(2).y));
        console.log("p3 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(3).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(3).y));
        chai_1.expect(sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        console.log("p0 = " + (sPer3 === null || sPer3 === void 0 ? void 0 : sPer3.evaluate(0).x) + "  " + (sPer3 === null || sPer3 === void 0 ? void 0 : sPer3.evaluate(0).y));
        console.log("p1 = " + (sPer3 === null || sPer3 === void 0 ? void 0 : sPer3.evaluate(1).x) + "  " + (sPer3 === null || sPer3 === void 0 ? void 0 : sPer3.evaluate(1).y));
        console.log("p2 = " + (sPer3 === null || sPer3 === void 0 ? void 0 : sPer3.evaluate(2.5).x) + "  " + (sPer3 === null || sPer3 === void 0 ? void 0 : sPer3.evaluate(2.5).y));
        console.log("p3 = " + (sPer3 === null || sPer3 === void 0 ? void 0 : sPer3.evaluate(3).x) + "  " + (sPer3 === null || sPer3 === void 0 ? void 0 : sPer3.evaluate(3).y));
        sPer3 === null || sPer3 === void 0 ? void 0 : sPer3.insertKnotBoehmAlgorithm(2.5, 3);
        chai_1.expect(sPer3 === null || sPer3 === void 0 ? void 0 : sPer3.knots).to.eql([0, 1, 2, 2.5, 2.5, 2.5, 3, 4]);
        console.log("p0 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(0).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(0).y));
        console.log("p1 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(1).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(1).y));
        console.log("p2 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(2.5).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(2.5).y));
        console.log("p3 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(3).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(3).y));
        chai_1.expect(sPer3 === null || sPer3 === void 0 ? void 0 : sPer3.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer3 === null || sPer3 === void 0 ? void 0 : sPer3.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        console.log("p0 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(0).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(0).y));
        console.log("p1 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(1).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(1).y));
        console.log("p2 = " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(2).x) + "  " + (sPer2 === null || sPer2 === void 0 ? void 0 : sPer2.evaluate(2).y));
        console.log("p3 = " + (sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.evaluate(3.5).x) + "  " + (sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.evaluate(3.5).y));
        sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.insertKnotBoehmAlgorithm(3.5, 3);
        chai_1.expect(sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.knots).to.eql([0, 1, 2, 3, 3.5, 3.5, 3.5, 4]);
        console.log("p0 = " + (sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.evaluate(0).x) + "  " + (sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.evaluate(0).y));
        console.log("p1 = " + (sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.evaluate(1).x) + "  " + (sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.evaluate(1).y));
        console.log("p2 = " + (sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.evaluate(2).x) + "  " + (sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.evaluate(2).y));
        console.log("p3 = " + (sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.evaluate(3.5).x) + "  " + (sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.evaluate(3.5).y));
        chai_1.expect(sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer4 === null || sPer4 === void 0 ? void 0 : sPer4.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(sPer1 === null || sPer1 === void 0 ? void 0 : sPer1.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can validate the necessary conditions of a periodic B-Spline to extract a B-Spline', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (periodicSpl !== undefined) {
            chai_1.expect(periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
            chai_1.expect(periodicSpl.extractInputParamAssessment.bind(periodicSpl, -0.1, 1)).to.throw(RangeError);
            var error = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "extract", "First abscissa is negative. Positive abscissa only are valid.");
            error.logMessage();
            chai_1.expect(periodicSpl.extractInputParamAssessment.bind(periodicSpl, 1, -0.1)).to.throw(RangeError);
            var error1 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "extract", "Second abscissa is negative. Positive abscissa only are valid.");
            error1.logMessage();
            chai_1.expect(periodicSpl.extractInputParamAssessment.bind(periodicSpl, 1, 4.1)).to.throw(RangeError);
            var error2 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "extract", "Second abscissa is greater than or equal to the largest knot value. Abscissa must be strictly inside the right bound of the knot period.");
            error2.logMessage();
            chai_1.expect(periodicSpl.extractInputParamAssessment.bind(periodicSpl, 4.1, 2.5)).to.throw(RangeError);
            var error3 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "extract", "First abscissa is greater than the largest knot value. Abscissa must be strictly inside the right bound of the knot period.");
            error3.logMessage();
            chai_1.expect(periodicSpl.extractInputParamAssessment.bind(periodicSpl, 1, 4.0)).to.throw(RangeError);
            var error4 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "extract", "Second abscissa is greater than or equal to the largest knot value. Abscissa must be strictly inside the right bound of the knot period.");
            error4.logMessage();
            chai_1.expect(periodicSpl.extractInputParamAssessment.bind(periodicSpl, 4.0, 2.5)).to.throw(RangeError);
            var error5 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "extract", "First abscissa is greater than the largest knot value. Abscissa must be strictly inside the right bound of the knot period.");
            error5.logMessage();
        }
    });
    it('can extract a B-Spline from a periodic B-Spline when start and end abscissae coincide', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        var openBSpline = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.extract(0, 0);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.degree).to.eql(3);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.knots).to.eql([0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 4]);
        var cpX = [0.66666666666666, 1, 1, -1, -1, 0.3333333333333333, 0.66666666666666];
        var cpY = [0.66666666666666, 0.3333333333333333, -1, -1, 1, 1, 0.66666666666666];
        if (openBSpline !== undefined) {
            for (var i = 0; i < openBSpline.controlPoints.length; i++) {
                chai_1.expect(openBSpline.controlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline.controlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(4).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(4).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        var openBSpline1 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.extract(0.5, 0.5);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.degree).to.eql(3);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.knots).to.eql([0, 0, 0, 0, 0.5, 1.5, 2.5, 3.5, 4, 4, 4, 4]);
        var cpX1 = [0.9166666666666666, 0.9166666666666666, 0.66666666666666, -1, -1, 0.66666666666666, 0.9166666666666666, 0.9166666666666666];
        var cpY1 = [0.0, -0.25, -1, -1, 1, 1, 0.25, 0.0];
        if (openBSpline1 !== undefined) {
            for (var i = 0; i < openBSpline1.controlPoints.length; i++) {
                chai_1.expect(openBSpline1.controlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline1.controlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(0).x).to.be.closeTo(0.9166666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(0).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(2).x).to.be.closeTo(-0.9166666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(2).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(4).x).to.be.closeTo(0.9166666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(4).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.insertKnotBoehmAlgorithm(0);
        var openBSpline2 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.extract(2, 2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.degree).to.eql(3);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 3, 4, 4, 4, 4]);
        var cpX2 = [-0.66666666666666, -1, -1, 0.33333333333333, 1, 1, -0.33333333333333, -0.66666666666666];
        var cpY2 = [-0.66666666666666, -0.33333333333333, 1, 1, 0.33333333333333, -1, -1, -0.66666666666666];
        if (openBSpline2 !== undefined) {
            for (var i = 0; i < openBSpline2.controlPoints.length; i++) {
                chai_1.expect(openBSpline2.controlPoints[i].x).to.be.closeTo(cpX2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline2.controlPoints[i].y).to.be.closeTo(cpY2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(0).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(0).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(2).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(2).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(4).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(4).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can extract a B-Spline from a periodic B-Spline when  u1 and u2 abscissae fall within the reference knot sequence with u1 < u2', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        var u1 = 0;
        var u2 = 1;
        var openBSpline = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.extract(u1, u2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.degree).to.eql(3);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.knots).to.eql([0, 0, 0, 0, 1, 1, 1, 1]);
        var cpX = [0.66666666666666, 1, 1, 0.66666666666666];
        var cpY = [0.66666666666666, 0.3333333333333333, -0.3333333333333333, -0.66666666666666];
        if (openBSpline !== undefined) {
            for (var i = 0; i < openBSpline.controlPoints.length; i++) {
                chai_1.expect(openBSpline.controlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline.controlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        u1 = 1;
        u2 = 3;
        var openBSpline1 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.extract(u1, u2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.degree).to.eql(3);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 2, 2]);
        var cpX1 = [0.66666666666666, 0.3333333333333333, -1, -1, -0.66666666666666];
        var cpY1 = [-0.66666666666666, -1, -1, 0.3333333333333333, 0.66666666666666];
        if (openBSpline1 !== undefined) {
            for (var i = 0; i < openBSpline1.controlPoints.length; i++) {
                chai_1.expect(openBSpline1.controlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline1.controlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(0).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(2).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(2).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        u1 = 1.5;
        u2 = 2.5;
        var openBSpline2 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.extract(u1, u2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.degree).to.eql(3);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.knots).to.eql([0, 0, 0, 0, 0.5, 1, 1, 1, 1]);
        var cpX2 = [0.0, -0.25, -0.75, -0.9166666666666666, -0.9166666666666666];
        var cpY2 = [-0.9166666666666666, -0.9166666666666666, -0.75, -0.25, 0.0];
        if (openBSpline2 !== undefined) {
            for (var i = 0; i < openBSpline2.controlPoints.length; i++) {
                chai_1.expect(openBSpline2.controlPoints[i].x).to.be.closeTo(cpX2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline2.controlPoints[i].y).to.be.closeTo(cpY2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(0).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(0).y).to.be.closeTo(-0.9166666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(1).x).to.be.closeTo(-0.9166666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(1).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
    });
    it('can extract a B-Spline from a periodic B-Spline when u1 and u2 abscissae fall within the reference knot sequence with u1 > u2 ', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        var u1 = 1;
        var u2 = 0;
        var openBSpline = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.extract(u1, u2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.degree).to.eql(3);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.knots).to.eql([0, 0, 0, 0, 1, 2, 3, 3, 3, 3]);
        var cpX = [0.66666666666666, 0.3333333333333333, -1, -1, 0.3333333333333333, 0.66666666666666];
        var cpY = [-0.66666666666666, -1, -1, 1, 1, 0.66666666666666];
        if (openBSpline !== undefined) {
            for (var i = 0; i < openBSpline.controlPoints.length; i++) {
                chai_1.expect(openBSpline.controlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline.controlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(0).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(3).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.evaluate(3).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        u1 = 3;
        u2 = 1;
        var openBSpline1 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.extract(u1, u2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.degree).to.eql(3);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 2, 2]);
        var cpX1 = [-0.66666666666666, -0.3333333333333333, 1, 1, 0.66666666666666];
        var cpY1 = [0.66666666666666, 1, 1, -0.3333333333333333, -0.66666666666666];
        if (openBSpline1 !== undefined) {
            for (var i = 0; i < openBSpline1.controlPoints.length; i++) {
                chai_1.expect(openBSpline1.controlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline1.controlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(0).x).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(2).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.evaluate(2).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        u1 = 2.5;
        u2 = 1.5;
        var openBSpline2 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.extract(u1, u2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.degree).to.eql(3);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.knots).to.eql([0, 0, 0, 0, 0.5, 1.5, 2.5, 3, 3, 3, 3]);
        var cpX2 = [-0.9166666666666666, -0.9166666666666666, -0.66666666666666, 1, 1, 0.25, 0.0];
        var cpY2 = [0.0, 0.25, 1, 1, -0.66666666666666, -0.9166666666666666, -0.9166666666666666];
        if (openBSpline2 !== undefined) {
            for (var i = 0; i < openBSpline2.controlPoints.length; i++) {
                chai_1.expect(openBSpline2.controlPoints[i].x).to.be.closeTo(cpX2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline2.controlPoints[i].y).to.be.closeTo(cpY2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(0).x).to.be.closeTo(-0.9166666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(0).y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(3).x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.evaluate(3).y).to.be.closeTo(-0.9166666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        // console.log("p0 = " + openBSpline?.evaluate(0).x + "  " + openBSpline?.evaluate(0).y);
        // console.log("p1 = " + openBSpline?.evaluate(1).x + "  " + openBSpline?.evaluate(1).y);
        // console.log("p2 = " + openBSpline?.evaluate(2).x + "  " + openBSpline?.evaluate(2).y);
        // console.log("p3 = " + openBSpline?.evaluate(3).x + "  " + openBSpline?.evaluate(3).y);
    });
    it('can open a periodic B-Spline when u1 and u2 abscissae fall within the reference knot sequence with u1 < u2', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        var u1 = 0;
        var u2 = 1;
        var periodicSpl1 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.clone();
        periodicSpl1 === null || periodicSpl1 === void 0 ? void 0 : periodicSpl1.clamp(u1);
        periodicSpl1 === null || periodicSpl1 === void 0 ? void 0 : periodicSpl1.clamp(u2);
        var openBSpline = periodicSpl1 === null || periodicSpl1 === void 0 ? void 0 : periodicSpl1.toOpenBSpline(u1, u2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.degree).to.eql(3);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.knots).to.eql([0, 0, 0, 0, 1, 1, 1, 1]);
        var cpX = [0.66666666666666, 1, 1, 0.66666666666666];
        var cpY = [0.66666666666666, 0.3333333333333333, -0.3333333333333333, -0.66666666666666];
        if (openBSpline !== undefined) {
            for (var i = 0; i < openBSpline.controlPoints.length; i++) {
                chai_1.expect(openBSpline.controlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline.controlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        u1 = 1;
        u2 = 3;
        var periodicSpl2 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.clone();
        periodicSpl2 === null || periodicSpl2 === void 0 ? void 0 : periodicSpl2.clamp(u1);
        periodicSpl2 === null || periodicSpl2 === void 0 ? void 0 : periodicSpl2.clamp(u2);
        var openBSpline1 = periodicSpl2 === null || periodicSpl2 === void 0 ? void 0 : periodicSpl2.toOpenBSpline(u1, u2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.degree).to.eql(3);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 2, 2]);
        var cpX1 = [0.66666666666666, 0.3333333333333333, -1, -1, -0.66666666666666];
        var cpY1 = [-0.66666666666666, -1, -1, 0.3333333333333333, 0.66666666666666];
        if (openBSpline1 !== undefined) {
            for (var i = 0; i < openBSpline1.controlPoints.length; i++) {
                chai_1.expect(openBSpline1.controlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline1.controlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        u1 = 1.5;
        u2 = 2.5;
        var periodicSpl3 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.clone();
        periodicSpl3 === null || periodicSpl3 === void 0 ? void 0 : periodicSpl3.clamp(u1);
        periodicSpl3 === null || periodicSpl3 === void 0 ? void 0 : periodicSpl3.clamp(u2);
        var openBSpline2 = periodicSpl3 === null || periodicSpl3 === void 0 ? void 0 : periodicSpl3.toOpenBSpline(u1, u2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.degree).to.eql(3);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.knots).to.eql([0, 0, 0, 0, 0.5, 1, 1, 1, 1]);
        var cpX2 = [0.0, -0.25, -0.75, -0.9166666666666666, -0.9166666666666666];
        var cpY2 = [-0.9166666666666666, -0.9166666666666666, -0.75, -0.25, 0.0];
        if (openBSpline2 !== undefined) {
            for (var i = 0; i < openBSpline2.controlPoints.length; i++) {
                chai_1.expect(openBSpline2.controlPoints[i].x).to.be.closeTo(cpX2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline2.controlPoints[i].y).to.be.closeTo(cpY2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
    });
    it('can open a periodic B-Spline when u1 and u2 abscissae fall within the reference knot sequence with u1 > u2 ', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        var u1 = 1;
        var u2 = 0;
        var periodicSpl1 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.clone();
        periodicSpl1 === null || periodicSpl1 === void 0 ? void 0 : periodicSpl1.clamp(u1);
        periodicSpl1 === null || periodicSpl1 === void 0 ? void 0 : periodicSpl1.clamp(u2);
        var openBSpline = periodicSpl1 === null || periodicSpl1 === void 0 ? void 0 : periodicSpl1.toOpenBSpline(u1, u2);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.degree).to.eql(3);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.knots).to.eql([0, 0, 0, 0, 1, 2, 3, 3, 3, 3]);
        var cpX = [0.66666666666666, 0.3333333333333333, -1, -1, 0.3333333333333333, 0.66666666666666];
        var cpY = [-0.66666666666666, -1, -1, 1, 1, 0.66666666666666];
        if (openBSpline !== undefined) {
            for (var i = 0; i < openBSpline.controlPoints.length; i++) {
                chai_1.expect(openBSpline.controlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline.controlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        u1 = 3;
        u2 = 1;
        var periodicSpl2 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.clone();
        periodicSpl2 === null || periodicSpl2 === void 0 ? void 0 : periodicSpl2.clamp(u1);
        periodicSpl2 === null || periodicSpl2 === void 0 ? void 0 : periodicSpl2.clamp(u2);
        var openBSpline1 = periodicSpl2 === null || periodicSpl2 === void 0 ? void 0 : periodicSpl2.toOpenBSpline(u1, u2);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.degree).to.eql(3);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 2, 2]);
        var cpX1 = [-0.66666666666666, -0.3333333333333333, 1, 1, 0.66666666666666];
        var cpY1 = [0.66666666666666, 1, 1, -0.3333333333333333, -0.66666666666666];
        if (openBSpline1 !== undefined) {
            for (var i = 0; i < openBSpline1.controlPoints.length; i++) {
                chai_1.expect(openBSpline1.controlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline1.controlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        u1 = 2.5;
        u2 = 1.5;
        var periodicSpl3 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.clone();
        periodicSpl3 === null || periodicSpl3 === void 0 ? void 0 : periodicSpl3.clamp(u1);
        periodicSpl3 === null || periodicSpl3 === void 0 ? void 0 : periodicSpl3.clamp(u2);
        var openBSpline2 = periodicSpl3 === null || periodicSpl3 === void 0 ? void 0 : periodicSpl3.toOpenBSpline(u1, u2);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.degree).to.eql(3);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.knots).to.eql([0, 0, 0, 0, 0.5, 1.5, 2.5, 3, 3, 3, 3]);
        var cpX2 = [-0.9166666666666666, -0.9166666666666666, -0.66666666666666, 1, 1, 0.25, 0.0];
        var cpY2 = [0.0, 0.25, 1, 1, -0.66666666666666, -0.9166666666666666, -0.9166666666666666];
        if (openBSpline2 !== undefined) {
            for (var i = 0; i < openBSpline2.controlPoints.length; i++) {
                chai_1.expect(openBSpline2.controlPoints[i].x).to.be.closeTo(cpX2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline2.controlPoints[i].y).to.be.closeTo(cpY2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
    });
    it('can open a periodic B-Spline when start and end abscissae coincide', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(0).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(0).y).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(1).x).to.be.closeTo(0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.evaluate(1).y).to.be.closeTo(-0.66666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        chai_1.expect(periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
        var u1 = 0.0;
        var periodicSpl1 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.clone();
        periodicSpl1 === null || periodicSpl1 === void 0 ? void 0 : periodicSpl1.clamp(u1);
        var openBSpline = periodicSpl1 === null || periodicSpl1 === void 0 ? void 0 : periodicSpl1.toOpenBSpline(u1, u1);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.degree).to.eql(3);
        chai_1.expect(openBSpline === null || openBSpline === void 0 ? void 0 : openBSpline.knots).to.eql([0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 4]);
        var cpX = [0.66666666666666, 1, 1, -1, -1, 0.3333333333333333, 0.66666666666666];
        var cpY = [0.66666666666666, 0.3333333333333333, -1, -1, 1, 1, 0.66666666666666];
        if (openBSpline !== undefined) {
            for (var i = 0; i < openBSpline.controlPoints.length; i++) {
                chai_1.expect(openBSpline.controlPoints[i].x).to.be.closeTo(cpX[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline.controlPoints[i].y).to.be.closeTo(cpY[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        u1 = 0.5;
        var periodicSpl2 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.clone();
        periodicSpl2 === null || periodicSpl2 === void 0 ? void 0 : periodicSpl2.clamp(u1);
        var openBSpline1 = periodicSpl2 === null || periodicSpl2 === void 0 ? void 0 : periodicSpl2.toOpenBSpline(u1, u1);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.degree).to.eql(3);
        chai_1.expect(openBSpline1 === null || openBSpline1 === void 0 ? void 0 : openBSpline1.knots).to.eql([0, 0, 0, 0, 0.5, 1.5, 2.5, 3.5, 4, 4, 4, 4]);
        var cpX1 = [0.9166666666666666, 0.9166666666666666, 0.66666666666666, -1, -1, 0.66666666666666, 0.9166666666666666, 0.9166666666666666];
        var cpY1 = [0.0, -0.25, -1, -1, 1, 1, 0.25, 0.0];
        if (openBSpline1 !== undefined) {
            for (var i = 0; i < openBSpline1.controlPoints.length; i++) {
                chai_1.expect(openBSpline1.controlPoints[i].x).to.be.closeTo(cpX1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline1.controlPoints[i].y).to.be.closeTo(cpY1[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
        u1 = 2;
        var periodicSpl3 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.clone();
        periodicSpl3 === null || periodicSpl3 === void 0 ? void 0 : periodicSpl3.insertKnotBoehmAlgorithm(0);
        periodicSpl3 === null || periodicSpl3 === void 0 ? void 0 : periodicSpl3.clamp(u1);
        var openBSpline2 = periodicSpl3 === null || periodicSpl3 === void 0 ? void 0 : periodicSpl3.toOpenBSpline(u1, u1);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.degree).to.eql(3);
        chai_1.expect(openBSpline2 === null || openBSpline2 === void 0 ? void 0 : openBSpline2.knots).to.eql([0, 0, 0, 0, 1, 2, 2, 3, 4, 4, 4, 4]);
        var cpX2 = [-0.66666666666666, -1, -1, 0.33333333333333, 1, 1, -0.33333333333333, -0.66666666666666];
        var cpY2 = [-0.66666666666666, -0.33333333333333, 1, 1, 0.33333333333333, -1, -1, -0.66666666666666];
        if (openBSpline2 !== undefined) {
            for (var i = 0; i < openBSpline2.controlPoints.length; i++) {
                chai_1.expect(openBSpline2.controlPoints[i].x).to.be.closeTo(cpX2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
                chai_1.expect(openBSpline2.controlPoints[i].y).to.be.closeTo(cpY2[i], Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            }
        }
    });
    it('can validate the necessary conditions of a periodic B-Spline to open a periodic B-Spline at a knot', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        var periodicSpl1 = periodicSpl === null || periodicSpl === void 0 ? void 0 : periodicSpl.clone();
        if (periodicSpl !== undefined) {
            chai_1.expect(periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
            chai_1.expect(periodicSpl.toOpenBSplineInputParamAssessment.bind(periodicSpl, 0.5, 1)).to.throw(TypeError);
            var error = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "toOpenBSplineInputParamAssessment", "First abscissa is not a knot. Curve opening process cannot take place.");
            error.logMessage();
            periodicSpl.insertKnotBoehmAlgorithm(1);
            chai_1.expect(periodicSpl.toOpenBSplineInputParamAssessment.bind(periodicSpl, 1, 2)).to.throw(RangeError);
            var error1 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "toOpenBSplineInputParamAssessment", "First abscissa has not a multiplicity equal to the curve degree. Curve opening process cannot take place.");
            error1.logMessage();
            periodicSpl1 === null || periodicSpl1 === void 0 ? void 0 : periodicSpl1.clamp(1);
            chai_1.expect(periodicSpl1 === null || periodicSpl1 === void 0 ? void 0 : periodicSpl1.toOpenBSplineInputParamAssessment.bind(periodicSpl1, 1, 3.5)).to.throw(TypeError);
            var error2 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "toOpenBSplineInputParamAssessment", "Second abscissa is not a knot. Curve opening process cannot take place.");
            error2.logMessage();
            periodicSpl1 === null || periodicSpl1 === void 0 ? void 0 : periodicSpl1.insertKnotBoehmAlgorithm(3);
            chai_1.expect(periodicSpl1 === null || periodicSpl1 === void 0 ? void 0 : periodicSpl1.toOpenBSplineInputParamAssessment.bind(periodicSpl1, 1, 3)).to.throw(RangeError);
            var error3 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "toOpenBSplineInputParamAssessment", "Second abscissa has not a multiplicity equal to the curve degree. Curve opening process cannot take place.");
            error3.logMessage();
        }
    });
    it('can evaluate a periodic B-Spline outside its interval defining its period', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (periodicSpl !== undefined) {
            chai_1.expect(periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
            var pt1 = periodicSpl.evaluateOutsideRefInterval(0.5);
            chai_1.expect(pt1.x).to.be.closeTo(0.9166666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(pt1.y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            var pt2 = periodicSpl.evaluateOutsideRefInterval(-0.5);
            chai_1.expect(pt2.x).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(pt2.y).to.be.closeTo(0.9166666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            var pt3 = periodicSpl.evaluateOutsideRefInterval(4.5);
            chai_1.expect(pt3.x).to.be.closeTo(0.9166666666666666, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
            chai_1.expect(pt3.y).to.be.closeTo(0.0, Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2);
        }
    });
    it('can validate the necessary conditions of a valid abscissa value', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (periodicSpl !== undefined) {
            chai_1.expect(periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
            chai_1.expect(periodicSpl.abcsissaInputParamAssessment.bind(periodicSpl, -0.1, "testMethod")).to.throw(RangeError);
            var error = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "testMethod", "The abscissa cannot be negative. The corresponding method is not applied.");
            error.logMessage();
            chai_1.expect(periodicSpl.abcsissaInputParamAssessment.bind(periodicSpl, 4.1, "testMethod")).to.throw(RangeError);
            var error1 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "testMethod", "The abscissa cannot be greater or equal than the knot sequence period. The corresponding method is not applied.");
            error1.logMessage();
            var seq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(3, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: [0, 1, 2, 3, 4] });
            var abscissa = seq.getPeriod() + Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2;
            chai_1.expect(periodicSpl.abcsissaInputParamAssessment.bind(periodicSpl, abscissa, "testMethod")).to.throw(RangeError);
            var error2 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "testMethod", "The abscissa cannot be greater or equal than the knot sequence period. The corresponding method is not applied.");
            error2.logMessage();
        }
    });
    it('can validate the necessary conditions of an abscissa to evaluate a periodic B-Spline outside its interval of definition', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (periodicSpl !== undefined) {
            var u4 = -0.5 - periodicSpl.knots[knots.length - 1];
            chai_1.expect(periodicSpl.evaluateOutsideRefIntervalInputParamAssessment.bind(periodicSpl, u4)).to.throw(RangeError);
            var error = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "evaluateOutsideRefIntervalInputParamAssessment", "Abscissa is negative. Its value is lower than the knot sequence period. No evaluation takes place.");
            error.logMessage();
        }
    });
    it('can validate the necessary conditions of a valid scale factor', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (periodicSpl !== undefined) {
            chai_1.expect(periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
            var factor1 = 0;
            chai_1.expect(periodicSpl.scaleInputParamAssessment.bind(periodicSpl, factor1)).to.throw(RangeError);
            var factor2 = -1;
            chai_1.expect(periodicSpl.scaleInputParamAssessment.bind(periodicSpl, factor2)).to.throw(RangeError);
        }
    });
    it('can validate the necessary conditions of a valid knot insertion', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (periodicSpl !== undefined) {
            chai_1.expect(periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
            chai_1.expect(periodicSpl.insertKnotBoehmAlgorithmInputParamAssessment.bind(periodicSpl, 0.1, 0)).to.throw(RangeError);
            var error3 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "insertKnotBoehmAlgorithmInputParamAssessment", "The knot multiplicity cannot be negative or null. No insertion is perfomed.");
            error3.logMessage();
            chai_1.expect(periodicSpl.insertKnotBoehmAlgorithmInputParamAssessment.bind(periodicSpl, 0.1, -1)).to.throw(RangeError);
            var error4 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "insertKnotBoehmAlgorithmInputParamAssessment", "The knot multiplicity cannot be negative or null. No insertion is perfomed.");
            error4.logMessage();
            chai_1.expect(periodicSpl.insertKnotBoehmAlgorithmInputParamAssessment.bind(periodicSpl, 0.1, periodicSpl.degree + 1)).to.throw(RangeError);
            var error5 = new ErrorLoging_1.ErrorLog("PeriodicBSplineR1toR2", "insertKnotBoehmAlgorithmInputParamAssessment", "The knot multiplicity cannot be negative or null. No insertion is perfomed.");
            error5.logMessage();
        }
    });
    it('cannot return a correct span index when the input abscissa is outside the knot sequence interval', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (periodicSpl !== undefined) {
            chai_1.expect(periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
            chai_1.expect(periodicSpl.findSpanBoehmAlgorithm(-Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)).to.eql(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Infinity));
            var seq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(3, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots });
            chai_1.expect(periodicSpl.findSpanBoehmAlgorithm(seq.getPeriod() + Curves_1.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)).to.eql(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Infinity));
        }
    });
    it('can return a correct span index when the input abscissa is inside the knot sequence interval', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (periodicSpl !== undefined) {
            chai_1.expect(periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
            chai_1.expect(periodicSpl.findSpanBoehmAlgorithm(0)).to.eql(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0));
            var seq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots });
            chai_1.expect(periodicSpl.findSpanBoehmAlgorithm(seq.getPeriod())).to.eql(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0));
            chai_1.expect(periodicSpl.findSpanBoehmAlgorithm(0.5)).to.eql(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0));
            chai_1.expect(periodicSpl.findSpanBoehmAlgorithm(1)).to.eql(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1));
            chai_1.expect(periodicSpl.findSpanBoehmAlgorithm(3.5)).to.eql(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3));
            chai_1.expect(periodicSpl.findSpanBoehmAlgorithm(3)).to.eql(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3));
        }
    });
    it('cannot return a correct control point index when the input knot index is outside the knot sequence index range', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (periodicSpl !== undefined) {
            chai_1.expect(periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
            chai_1.expect(function () { return periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(-1)); }).to.throw();
            var seq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots });
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(seq.allAbscissae.length))).to.eql(Infinity);
            periodicSpl.insertKnotBoehmAlgorithm(0);
            // expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence(-1))).to.eql(Infinity);
            chai_1.expect(function () { return periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(-1)); }).to.throw();
            var seq1 = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicSpl.knots });
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(seq1.allAbscissae.length))).to.eql(Infinity);
        }
    });
    it('cannot return a correct control point index when the offset parameter is negative or greater than the curve degree', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (periodicSpl !== undefined) {
            chai_1.expect(periodicSpl.freeControlPoints).to.eql([cp0, cp1, cp2, cp3]);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), -1)).to.eql(Infinity);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), periodicSpl.degree + 1)).to.eql(Infinity);
            periodicSpl.insertKnotBoehmAlgorithm(0);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), -1)).to.eql(Infinity);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1), periodicSpl.degree + 1)).to.eql(Infinity);
        }
    });
    it('can return a correct control point index when the input knot index is inside the knot sequence index range', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (periodicSpl !== undefined) {
            chai_1.expect(periodicSpl.controlPoints).to.eql([cp0, cp1, cp2, cp3]);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0))).to.eql(1);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1))).to.eql(2);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(2))).to.eql(3);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3))).to.eql(0);
            periodicSpl.insertKnotBoehmAlgorithm(0);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0))).to.eql(1);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1))).to.eql(2);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(2))).to.eql(3);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3))).to.eql(4);
            chai_1.expect(periodicSpl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(4))).to.eql(0);
        }
        // rectangular control polygon
        var cp01 = new Vector2d_1.Vector2d(0, 0);
        var cp11 = new Vector2d_1.Vector2d(0, 1);
        var cp21 = new Vector2d_1.Vector2d(1, 1);
        var cp31 = new Vector2d_1.Vector2d(1, 0);
        var cp41 = new Vector2d_1.Vector2d(1, -1);
        var cp51 = new Vector2d_1.Vector2d(0, -1);
        var knots1 = [0, 1, 2, 3, 4, 5, 6];
        curveDegree = 2;
        var spl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp01, cp11, cp21, cp31, cp41, cp51], knots1, curveDegree);
        if (spl !== undefined) {
            chai_1.expect(spl.controlPoints).to.eql([cp01, cp11, cp21, cp31, cp41, cp51]);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0))).to.eql(4);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1))).to.eql(5);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(2))).to.eql(0);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3))).to.eql(1);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(4))).to.eql(2);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(5))).to.eql(3);
            spl.insertKnotBoehmAlgorithm(0);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0))).to.eql(4);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1))).to.eql(5);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(2))).to.eql(6);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3))).to.eql(0);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(4))).to.eql(1);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(5))).to.eql(2);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(6))).to.eql(3);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), curveDegree)).to.eql(6);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1), curveDegree)).to.eql(0);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(2), curveDegree)).to.eql(1);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3), curveDegree)).to.eql(2);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(4), curveDegree)).to.eql(3);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(5), curveDegree)).to.eql(4);
            chai_1.expect(spl.fromIncKnotSeqIndexToControlPointIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(6), curveDegree)).to.eql(5);
        }
    });
    it('cannot move a control point when its index is negative of greater than the number of control points of the curve', function () {
        // rectangular control polygon
        var cp0 = new Vector2d_1.Vector2d(-1, -1);
        var cp1 = new Vector2d_1.Vector2d(-1, 1);
        var cp2 = new Vector2d_1.Vector2d(1, 1);
        var cp3 = new Vector2d_1.Vector2d(1, -1);
        var knots = [0, 1, 2, 3, 4];
        var curveDegree = 3;
        var periodicSpl = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2([cp0, cp1, cp2, cp3], knots, curveDegree);
        if (periodicSpl !== undefined) {
            chai_1.expect(periodicSpl.controlPoints).to.eql([cp0, cp1, cp2, cp3]);
            var periodicSpl1 = periodicSpl.clone();
            periodicSpl1.moveControlPoint(-1, -1, 1);
            chai_1.expect(periodicSpl1.controlPoints).to.eql(periodicSpl.controlPoints);
            periodicSpl.moveControlPoint(4, -1, 1);
            chai_1.expect(periodicSpl1.controlPoints).to.eql(periodicSpl.controlPoints);
        }
    });
});
