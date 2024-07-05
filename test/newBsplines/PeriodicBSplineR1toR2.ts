import { expect } from "chai";
import { Vector2d } from "../../src/mathVector/Vector2d";
import { TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2 } from "./BSplineR1toR2";
import { PeriodicBSplineR1toR2 } from "../../src/newBsplines/PeriodicBSplineR1toR2";

describe('PeriodicBSplineR1toR2', () => {

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

    it('cannot be initialized with a negative degree', () => {
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(1, 0)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(0.5, 1.5)
        const cp4 = new Vector2d(0, 1)
        const knots = [0, 1, 2, 3, 4, 5]
        const degree = -2
        const s = PeriodicBSplineR1toR2.create([cp0, cp1, cp2, cp3, cp4], knots, degree);
        expect(s).to.eql(undefined)
    });

    it('cannot be initialized with a null degree', () => {
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(1, 0)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(0.5, 1.5)
        const cp4 = new Vector2d(0, 1)
        const knots = [0, 1, 2, 3, 4, 5]
        const degree = 0
        const s = PeriodicBSplineR1toR2.create([cp0, cp1, cp2, cp3, cp4], knots, degree);
        expect(s).to.eql(undefined)
    });

    it('cannot be initialized with a positive degree and sizes of knot sequence and control points array differing by more than one', () => {
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(1, 0)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(0.5, 1.5)
        const cp4 = new Vector2d(0, 1)
        const knots = [0, 1, 2, 3, 4]
        const degree = 2
        const s = PeriodicBSplineR1toR2.create([cp0, cp1, cp2, cp3, cp4], knots, degree);
        expect(s).to.eql(undefined)
    });

    it('cannot be initialized with a knot sequence size equal or smaller to (degree + 1)', () => {
        const cp0 = new Vector2d(0, 0)
        const knots = [0, 1]
        const degree = 2
        const s = PeriodicBSplineR1toR2.create([cp0], knots, degree);
        expect(s).to.eql(undefined)
    });
    
    it('can be initialized with an initializer', () => {
        const cp0 = new Vector2d(-0.27, -0.35)
        const cp1 = new Vector2d(-0.3, 0)
        const cp2 = new Vector2d(-0.27, 0.35)
        const cp3 = new Vector2d(-0.15, 0.6)
        const cp4 = new Vector2d(0, 0.72)
        const cp5 = new Vector2d(0.15, 0.6)
        const cp6 = new Vector2d(0.27, 0.35)
        const cp7 = new Vector2d(0.3, 0)
        const cp8 = new Vector2d(0.27, -0.35)
        const cp9 = new Vector2d(0.15, -0.6)
        const cp10 = new Vector2d(0, -0.72)
        const cp11 = new Vector2d(-0.15, -0.6)
        const cp12 = new Vector2d(-0.27, -0.35)
        const cp13 = new Vector2d(-0.3, 0)
        const cp14 = new Vector2d(-0.27, 0.35)
        const px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3;
        const py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72;
        const cp = [ [-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4], 
                    [px0, py5], [px1, py4], [px2, py2], [px3, py0], 
                    [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4], 
                    [-px2, -py2], [-px3, py0], [-px2, py2] ];
        const knots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        const knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11], knots, 3)
        expect(s?.controlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11])
        expect(s?.knots).to.eql(knots)
        expect(s?.degree).to.equal(3)
    });

    it('can generate intermediate Splines for degree elevation of periodic BSpline', () => {
        const cp0 = new Vector2d(-0.27, -0.35)
        const cp1 = new Vector2d(-0.3, 0)
        const cp2 = new Vector2d(-0.27, 0.35)
        const cp3 = new Vector2d(-0.15, 0.6)
        const cp4 = new Vector2d(0, 0.72)
        const cp5 = new Vector2d(0.15, 0.6)
        const cp6 = new Vector2d(0.27, 0.35)
        const cp7 = new Vector2d(0.3, 0)
        const cp8 = new Vector2d(0.27, -0.35)
        const cp9 = new Vector2d(0.15, -0.6)
        const cp10 = new Vector2d(0, -0.72)
        const cp11 = new Vector2d(-0.15, -0.6)
        const cp12 = new Vector2d(-0.27, -0.35)
        const cp13 = new Vector2d(-0.3, 0)
        const cp14 = new Vector2d(-0.27, 0.35)
        const px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3;
        const py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72;
        const cp = [ [-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4], 
                    [px0, py5], [px1, py4], [px2, py2], [px3, py0], 
                    [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4], 
                    [-px2, -py2], [-px3, py0], [-px2, py2] ];
        const knots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        const knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11], knots, 3)
        const intermSplKnotsAndCPs = s?.generateIntermediateSplinesForDegreeElevation();
        expect(intermSplKnotsAndCPs?.CPs.length).to.eql(4)
        expect(intermSplKnotsAndCPs?.knotVectors.length).to.eql(4)
        expect(intermSplKnotsAndCPs?.knotVectors[0]).to.eql([0, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 12])
        expect(intermSplKnotsAndCPs?.knotVectors[1]).to.eql([0, 1, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 9, 10, 11, 12])
        expect(intermSplKnotsAndCPs?.knotVectors[2]).to.eql([0, 1, 2, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 10, 11, 12])
        expect(intermSplKnotsAndCPs?.knotVectors[3]).to.eql([0, 1, 2, 3, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 11, 12])
        expect(intermSplKnotsAndCPs?.CPs[0]).to.eql([cp0, cp0, cp1, cp2, cp3, cp4, cp4, cp5, cp6, cp7, cp8, cp8, cp9, cp10, cp11])
        expect(intermSplKnotsAndCPs?.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp4, cp5, cp5, cp6, cp7, cp8, cp9, cp9, cp10, cp11])
        expect(intermSplKnotsAndCPs?.CPs[2]).to.eql([cp0, cp1, cp2, cp2, cp3, cp4, cp5, cp6, cp6, cp7, cp8, cp9, cp10, cp10, cp11])
        expect(intermSplKnotsAndCPs?.CPs[3]).to.eql([cp0, cp1, cp2, cp3, cp3, cp4, cp5, cp6, cp7, cp7, cp8, cp9, cp10, cp11, cp11])
    });

    it('can insert a knot using Boehm algorithm ', () => {
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(0, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, 0)
        const cp4 = new Vector2d(1, -1)
        const cp5 = new Vector2d(0, -1)
        const knots = [0, 1, 2, 3, 4, 5, 6]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        s?.insertKnotBoehmAlgorithm(4);
        expect(s?.freeControlPoints.length).to.eql(7)
        expect(s?.knots.length).to.eql(8)
        expect(s?.knots).to.eql([0, 1, 2, 3, 4, 4, 5, 6])
        const cpX = [0, 0, 1, 1, 1, 1, 0]
        const cpY = [0, 1, 1, 0.5, 0, -1, -1]
        if(s !== undefined) {
            for( let i = 0; i < s.freeControlPoints.length; i++) {
                expect(s.freeControlPoints[i].x).to.eql(cpX[i])
                expect(s.freeControlPoints[i].y).to.eql(cpY[i])
            }
        }
        const s1 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s1?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        s1?.insertKnotBoehmAlgorithm(3);
        expect(s1?.freeControlPoints.length).to.eql(7)
        expect(s1?.knots.length).to.eql(8)
        expect(s1?.knots).to.eql([0, 1, 2, 3, 3, 4, 5, 6])
        const cpX1 = [0, 0, 0.5, 1, 1, 1, 0]
        const cpY1 = [0, 1, 1, 1, 0, -1, -1]
        if(s1 !== undefined) {
            for( let i = 0; i < s1.freeControlPoints.length; i++) {
                expect(s1.freeControlPoints[i].x).to.eql(cpX1[i])
                expect(s1.freeControlPoints[i].y).to.eql(cpY1[i])
            }
        }
        const s2 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s2?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        s2?.insertKnotBoehmAlgorithm(2);
        expect(s2?.freeControlPoints.length).to.eql(7)
        expect(s2?.knots.length).to.eql(8)
        expect(s2?.knots).to.eql([0, 1, 2, 2, 3, 4, 5, 6])
        const cpX2 = [0, 0, 0, 1, 1, 1, 0]
        const cpY2 = [0, 0.5, 1, 1, 0, -1, -1]
        if(s2 !== undefined) {
            for( let i = 0; i < s2.freeControlPoints.length; i++) {
                expect(s2.freeControlPoints[i].x).to.eql(cpX2[i])
                expect(s2.freeControlPoints[i].y).to.eql(cpY2[i])
            }
        }
        const s3 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s3?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        s3?.insertKnotBoehmAlgorithm(1);
        expect(s3?.freeControlPoints.length).to.eql(7)
        expect(s3?.knots.length).to.eql(8)
        expect(s3?.knots).to.eql([0, 1, 1, 2, 3, 4, 5, 6])
        const cpX3 = [0, 0, 1, 1, 1, 0, 0]
        const cpY3 = [0, 1, 1, 0, -1, -1, -0.5]
        if(s3 !== undefined) {
            for( let i = 0; i < s3.freeControlPoints.length; i++) {
                expect(s3.freeControlPoints[i].x).to.eql(cpX3[i])
                expect(s3.freeControlPoints[i].y).to.eql(cpY3[i])
            }
        }
        const s4 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s4?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        s4?.insertKnotBoehmAlgorithm(5);
        expect(s4?.freeControlPoints.length).to.eql(7)
        expect(s4?.knots.length).to.eql(8)
        expect(s4?.knots).to.eql([0, 1, 2, 3, 4, 5, 5, 6])
        const cpX4 = [0, 0, 1, 1, 1, 1, 0]
        const cpY4 = [0, 1, 1, 0, -0.5, -1, -1]
        if(s4 !== undefined) {
            for( let i = 0; i < s4.freeControlPoints.length; i++) {
                expect(s4.freeControlPoints[i].x).to.eql(cpX4[i])
                expect(s4.freeControlPoints[i].y).to.eql(cpY4[i])
            }
        }
        const s5 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s5?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        s5?.insertKnotBoehmAlgorithm(0);
        expect(s5?.freeControlPoints.length).to.eql(7)
        expect(s5?.knots.length).to.eql(9)
        expect(s5?.knots).to.eql([0, 0, 1, 2, 3, 4, 5, 6, 6])
        const cpX5 = [0, 0, 1, 1, 1, 0.5, 0]
        const cpY5 = [0, 1, 1, 0, -1, -1, -1]
        if(s5 !== undefined) {
            for( let i = 0; i < s5.freeControlPoints.length; i++) {
                expect(s5.freeControlPoints[i].x).to.eql(cpX5[i])
                expect(s5.freeControlPoints[i].y).to.eql(cpY5[i])
            }
        }
    });

    it('can increment the degree of periodic BSpline', () => {
        const cp0 = new Vector2d(-0.27, -0.35)
        const cp1 = new Vector2d(-0.3, 0)
        const cp2 = new Vector2d(-0.27, 0.35)
        const cp3 = new Vector2d(-0.15, 0.6)
        const cp4 = new Vector2d(0, 0.72)
        const cp5 = new Vector2d(0.15, 0.6)
        const cp6 = new Vector2d(0.27, 0.35)
        const cp7 = new Vector2d(0.3, 0)
        const cp8 = new Vector2d(0.27, -0.35)
        const cp9 = new Vector2d(0.15, -0.6)
        const cp10 = new Vector2d(0, -0.72)
        const cp11 = new Vector2d(-0.15, -0.6)
        const cp12 = new Vector2d(-0.27, -0.35)
        const cp13 = new Vector2d(-0.3, 0)
        const cp14 = new Vector2d(-0.27, 0.35)
        const px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3;
        const py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72;
        const cp = [ [-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4], 
                    [px0, py5], [px1, py4], [px2, py2], [px3, py0], 
                    [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4], 
                    [-px2, -py2], [-px3, py0], [-px2, py2] ];
        const knots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        const knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11], knots, 3)
        const newSpline = s?.degreeIncrement();
        expect(newSpline?.degree).to.eql(4)
        expect(newSpline?.knots.length).to.eql(26)
        expect(newSpline?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12])
        expect(newSpline?.freeControlPoints.length).to.eql(23)
        // expect(newSpline?.CPs[3]).to.eql([cp0, cp1, cp2, cp3, cp3, cp4, cp5, cp6, cp7, cp7, cp8, cp9, cp10, cp11, cp11])
    });
});