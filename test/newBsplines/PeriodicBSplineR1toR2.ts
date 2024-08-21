import { expect } from "chai";
import { Vector2d } from "../../src/mathVector/Vector2d";
import { TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2 } from "./BSplineR1toR2";
import { PeriodicBSplineR1toR2 } from "../../src/newBsplines/PeriodicBSplineR1toR2";
import { basisFunctionsFromSequence } from "../../src/newBsplines/Piegl_Tiller_NURBS_Book";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "../../src/newBsplines/IncreasingPeriodicKnotSequenceClosedCurve";
import { PeriodicBSplineR1toR2withOpenKnotSequence } from "../../src/newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence";

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
        expect(intermSplKnotsAndCPs?.CPs[0]).to.eql([cp0, cp1, cp2, cp3, cp4, cp4, cp5, cp6, cp7, cp8, cp8, cp9, cp10, cp11, cp0])
        expect(intermSplKnotsAndCPs?.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp4, cp5, cp5, cp6, cp7, cp8, cp9, cp9, cp10, cp11])
        expect(intermSplKnotsAndCPs?.CPs[2]).to.eql([cp0, cp1, cp2, cp2, cp3, cp4, cp5, cp6, cp6, cp7, cp8, cp9, cp10, cp10, cp11])
        expect(intermSplKnotsAndCPs?.CPs[3]).to.eql([cp0, cp1, cp2, cp3, cp3, cp4, cp5, cp6, cp7, cp7, cp8, cp9, cp10, cp11, cp11])
    });

    it('can insert a knot using Boehm algorithm for a quadratic B-Spline with uniform knot sequence ', () => {
        // rectangular control polygon
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(0, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, 0)
        const cp4 = new Vector2d(1, -1)
        const cp5 = new Vector2d(0, -1)
        const knots = [0, 1, 2, 3, 4, 5, 6]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        expect(s?.evaluate(0)).to.eql(new Vector2d(0.5, -1))
        expect(s?.evaluate(1)).to.eql(new Vector2d(0, -0.5))
        expect(s?.evaluate(2)).to.eql(new Vector2d(0, 0.5))
        expect(s?.evaluate(3)).to.eql(new Vector2d(0.5, 1))
        expect(s?.evaluate(4)).to.eql(new Vector2d(1, 0.5))
        expect(s?.evaluate(5)).to.eql(new Vector2d(1, -0.5))

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
        expect(s?.evaluate(4)).to.eql(new Vector2d(1, 0.5))

        const s1 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s1?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        expect(s1?.evaluate(3)).to.eql(new Vector2d(0.5, 1))
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
        expect(s1?.evaluate(3)).to.eql(new Vector2d(0.5, 1))


        s1?.insertKnotBoehmAlgorithm(4);
        expect(s1?.freeControlPoints.length).to.eql(8)
        expect(s1?.knots.length).to.eql(9)
        expect(s1?.knots).to.eql([0, 1, 2, 3, 3, 4, 4, 5, 6])
        const cpX34 = [0, 0, 0.5, 1, 1, 1, 1, 0]
        const cpY34 = [0, 1, 1, 1, 0.5, 0, -1, -1]
        if(s1 !== undefined) {
            for( let i = 0; i < s1.freeControlPoints.length; i++) {
                expect(s1.freeControlPoints[i].x).to.eql(cpX34[i])
                expect(s1.freeControlPoints[i].y).to.eql(cpY34[i])
            }
        }
        expect(s1?.evaluate(3)).to.eql(new Vector2d(0.5, 1))
        expect(s1?.evaluate(4)).to.eql(new Vector2d(1, 0.5))

        const s2 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s2?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        expect(s2?.evaluate(2)).to.eql(new Vector2d(0, 0.5))
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
        expect(s2?.evaluate(2)).to.eql(new Vector2d(0, 0.5))

        s2?.insertKnotBoehmAlgorithm(3);
        s2?.insertKnotBoehmAlgorithm(4);
        expect(s2?.freeControlPoints.length).to.eql(9)
        expect(s2?.knots.length).to.eql(10)
        expect(s2?.knots).to.eql([0, 1, 2, 2, 3, 3, 4, 4, 5, 6])
        const cpX234 = [0, 0, 0, 0.5, 1, 1, 1, 1, 0]
        const cpY234 = [0, 0.5, 1, 1, 1, 0.5, 0, -1, -1]
        if(s2 !== undefined) {
            for( let i = 0; i < s2.freeControlPoints.length; i++) {
                expect(s2.freeControlPoints[i].x).to.eql(cpX234[i])
                expect(s2.freeControlPoints[i].y).to.eql(cpY234[i])
            }
        }
        expect(s2?.evaluate(2)).to.eql(new Vector2d(0, 0.5))
        expect(s2?.evaluate(3)).to.eql(new Vector2d(0.5, 1))
        expect(s2?.evaluate(4)).to.eql(new Vector2d(1, 0.5))

        const s3 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s3?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        expect(s3?.evaluate(1)).to.eql(new Vector2d(0, -0.5))
        s3?.insertKnotBoehmAlgorithm(1);
        expect(s3?.freeControlPoints.length).to.eql(7)
        expect(s3?.knots.length).to.eql(8)
        expect(s3?.knots).to.eql([0, 1, 1, 2, 3, 4, 5, 6])
        const cpX3 = [0, 0, 0, 1, 1, 1, 0]
        const cpY3 = [-0.5, 0, 1, 1, 0, -1, -1]
        if(s3 !== undefined) {
            for( let i = 0; i < s3.freeControlPoints.length; i++) {
                expect(s3.freeControlPoints[i].x).to.eql(cpX3[i])
                expect(s3.freeControlPoints[i].y).to.eql(cpY3[i])
            }
        }
        expect(s3?.evaluate(1)).to.eql(new Vector2d(0, -0.5))

        s3?.insertKnotBoehmAlgorithm(2);
        s3?.insertKnotBoehmAlgorithm(3);
        s3?.insertKnotBoehmAlgorithm(4);
        expect(s3?.freeControlPoints.length).to.eql(10)
        expect(s3?.knots.length).to.eql(11)
        expect(s3?.knots).to.eql([0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 6])
        const cpX1234 = [0, 0, 0, 0, 0.5, 1, 1, 1, 1, 0]
        const cpY1234 = [-0.5, 0, 0.5, 1, 1, 1, 0.5, 0, -1, -1]
        if(s3 !== undefined) {
            for( let i = 0; i < s3.freeControlPoints.length; i++) {
                expect(s3.freeControlPoints[i].x).to.eql(cpX1234[i])
                expect(s3.freeControlPoints[i].y).to.eql(cpY1234[i])
            }
        }
        expect(s3?.evaluate(1)).to.eql(new Vector2d(0, -0.5))
        expect(s3?.evaluate(2)).to.eql(new Vector2d(0, 0.5))
        expect(s3?.evaluate(3)).to.eql(new Vector2d(0.5, 1))
        expect(s3?.evaluate(4)).to.eql(new Vector2d(1, 0.5))


        const s4 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s4?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        expect(s4?.evaluate(5)).to.eql(new Vector2d(1, -0.5))
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
        expect(s4?.evaluate(5)).to.eql(new Vector2d(1, -0.5))

        s4?.insertKnotBoehmAlgorithm(1);
        s4?.insertKnotBoehmAlgorithm(2);
        s4?.insertKnotBoehmAlgorithm(3);
        s4?.insertKnotBoehmAlgorithm(4);
        expect(s4?.freeControlPoints.length).to.eql(11)
        expect(s4?.knots.length).to.eql(12)
        expect(s4?.knots).to.eql([0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6])
        const cpX12345 = [0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0]
        const cpY12345 = [-0.5, 0, 0.5, 1, 1, 1, 0.5, 0, -0.5, -1, -1]
        if(s4 !== undefined) {
            for( let i = 0; i < s4.freeControlPoints.length; i++) {
                expect(s4.freeControlPoints[i].x).to.eql(cpX12345[i])
                expect(s4.freeControlPoints[i].y).to.eql(cpY12345[i])
            }
        }
        expect(s4?.evaluate(1)).to.eql(new Vector2d(0, -0.5))
        expect(s4?.evaluate(2)).to.eql(new Vector2d(0, 0.5))
        expect(s4?.evaluate(3)).to.eql(new Vector2d(0.5, 1))
        expect(s4?.evaluate(4)).to.eql(new Vector2d(1, 0.5))
        expect(s4?.evaluate(5)).to.eql(new Vector2d(1, -0.5))


        const s5 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s5?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        expect(s5?.evaluate(0)).to.eql(new Vector2d(0.5, -1))
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
        expect(s5?.evaluate(0)).to.eql(new Vector2d(0.5, -1))

        s5?.insertKnotBoehmAlgorithm(1);
        s5?.insertKnotBoehmAlgorithm(2);
        s5?.insertKnotBoehmAlgorithm(3);
        s5?.insertKnotBoehmAlgorithm(4);
        s5?.insertKnotBoehmAlgorithm(5);
        expect(s5?.freeControlPoints.length).to.eql(12)
        expect(s5?.knots.length).to.eql(14)
        expect(s5?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6])
        const cpX012345 = [0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0]
        const cpY012345 = [-0.5, 0, 0.5, 1, 1, 1, 0.5, 0, -0.5, -1, -1, -1]
        if(s5 !== undefined) {
            for( let i = 0; i < s5.freeControlPoints.length; i++) {
                expect(s5.freeControlPoints[i].x).to.eql(cpX012345[i])
                expect(s5.freeControlPoints[i].y).to.eql(cpY012345[i])
            }
        }
        expect(s5?.evaluate(0)).to.eql(new Vector2d(0.5, -1))
        expect(s5?.evaluate(1)).to.eql(new Vector2d(0, -0.5))
        expect(s5?.evaluate(2)).to.eql(new Vector2d(0, 0.5))
        expect(s5?.evaluate(3)).to.eql(new Vector2d(0.5, 1))
        expect(s5?.evaluate(4)).to.eql(new Vector2d(1, 0.5))
        expect(s5?.evaluate(5)).to.eql(new Vector2d(1, -0.5))
    });

    it('can insert repeatedly a knot using Boehm algorithm for a cubic B-Spline at curve origin ', () => {
        // rectangular control polygon
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(0, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, 0)
        const cp4 = new Vector2d(1, -1)
        const cp5 = new Vector2d(0, -1)
        const knots = [0, 1, 2, 3, 4, 5, 6]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 3)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        expect(s?.evaluate(0).x).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(-0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0.16666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(-0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).x).to.be.closeTo(0.16666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).y).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3.5).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3.5).y).to.be.closeTo(0.9583333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4).x).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4).y).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        s?.insertKnotBoehmAlgorithm(0);
        expect(s?.freeControlPoints.length).to.eql(7)
        expect(s?.knots.length).to.eql(9)
        expect(s?.knots).to.eql([0, 0, 1, 2, 3, 4, 5, 6, 6])
        expect(s?.evaluate(0).x).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(-0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0.16666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(-0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).x).to.be.closeTo(0.16666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).y).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4).x).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4).y).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        const cpX0 = [0, 0, 1, 1, 1, 0.6666666666666666, 0]
        const cpY0 = [0, 1, 1, 0, -0.6666666666666666, -1, -1]
        if(s !== undefined) {
            for( let i = 0; i < s.freeControlPoints.length; i++) {
                expect(s.freeControlPoints[i].x).to.be.closeTo(cpX0[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(s.freeControlPoints[i].y).to.be.closeTo(cpY0[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }

        s?.insertKnotBoehmAlgorithm(0);
        expect(s?.freeControlPoints.length).to.eql(8)
        expect(s?.knots.length).to.eql(11)
        expect(s?.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 5, 6, 6, 6])
        expect(s?.evaluate(0).x).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(-0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0.16666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(-0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).x).to.be.closeTo(0.16666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).y).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4).x).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4).y).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        const cpX1 = [0, 0, 1, 1, 1, 0.83333333333333, 0.6666666666666666, 0]
        const cpY1 = [0, 1, 1, 0, -0.6666666666666666, -0.83333333333333, -1, -1]
        if(s !== undefined) {
            for( let i = 0; i < s.freeControlPoints.length; i++) {
                expect(s.freeControlPoints[i].x).to.be.closeTo(cpX1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(s.freeControlPoints[i].y).to.be.closeTo(cpY1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
    });

    it('can insert repeatedly a knot using Boehm algorithm for a cubic B-Spline at every existing knot of the initial sequence ', () => {
        // rectangular control polygon
        const cp0 = new Vector2d(-1, -1)
        const cp1 = new Vector2d(-1, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, -1)
        const knots = [0, 1, 2, 3, 4]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3], knots, 3)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3])
        expect(s?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sp0 = s?.clone();
        sp0?.insertKnotBoehmAlgorithm(0);
        expect(sp0?.freeControlPoints.length).to.eql(5)
        expect(sp0?.knots.length).to.eql(7)
        expect(sp0?.knots).to.eql([0, 0, 1, 2, 3, 4, 4])
        const cpX0 = [-1, -1, 0.333333333333333, 1, 1]
        const cpY0 = [-1, 1, 1, 0.333333333333333, -1]
        if(sp0 !== undefined) {
            for( let i = 0; i < sp0.freeControlPoints.length; i++) {
                expect(sp0.freeControlPoints[i].x).to.be.closeTo(cpX0[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp0.freeControlPoints[i].y).to.be.closeTo(cpY0[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp0?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        // insert the knot once again
        const sp00 = sp0?.clone();
        sp00?.insertKnotBoehmAlgorithm(0);
        expect(sp00?.freeControlPoints.length).to.eql(6)
        expect(sp00?.knots.length).to.eql(9)
        expect(sp00?.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 4])
        const cpX00 = [-1, -1, 0.333333333333333, 0.66666666666666, 1, 1]
        const cpY00 = [-1, 1, 1, 0.66666666666666, 0.333333333333333, -1]
        if(sp00 !== undefined) {
            for( let i = 0; i < sp00.freeControlPoints.length; i++) {
                expect(sp00.freeControlPoints[i].x).to.be.closeTo(cpX00[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp00.freeControlPoints[i].y).to.be.closeTo(cpY00[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp00?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sp1 = s?.clone();
        sp1?.insertKnotBoehmAlgorithm(1);
        expect(sp1?.freeControlPoints.length).to.eql(5)
        expect(sp1?.knots.length).to.eql(6)
        expect(sp1?.knots).to.eql([0, 1, 1, 2, 3, 4])
        const cpX1 = [0.333333333333333, -1, -1, 1, 1]
        const cpY1 = [-1, -1, 1, 1, -0.333333333333333]
        if(sp1 !== undefined) {
            for( let i = 0; i < sp1.freeControlPoints.length; i++) {
                expect(sp1.freeControlPoints[i].x).to.be.closeTo(cpX1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp1.freeControlPoints[i].y).to.be.closeTo(cpY1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp1?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        // insert the knot once again
        const sp11 = sp1?.clone();
        sp11?.insertKnotBoehmAlgorithm(1);
        expect(sp11?.freeControlPoints.length).to.eql(6)
        expect(sp11?.knots.length).to.eql(7)
        expect(sp11?.knots).to.eql([0, 1, 1, 1, 2, 3, 4])
        const cpX11 = [0.66666666666666, 0.333333333333333, -1, -1, 1, 1]
        const cpY11 = [-0.66666666666666, -1, -1, 1, 1, -0.333333333333333]
        if(sp11 !== undefined) {
            for( let i = 0; i < sp11.freeControlPoints.length; i++) {
                expect(sp11.freeControlPoints[i].x).to.be.closeTo(cpX11[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp11.freeControlPoints[i].y).to.be.closeTo(cpY11[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp11?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sp2 = s?.clone();
        sp2?.insertKnotBoehmAlgorithm(2);
        expect(sp2?.freeControlPoints.length).to.eql(5)
        expect(sp2?.knots.length).to.eql(6)
        expect(sp2?.knots).to.eql([0, 1, 2, 2, 3, 4])
        const cpX2 = [-0.333333333333333, -1, -1, 1, 1]
        const cpY2 = [-1, -0.333333333333333, 1, 1, -1]
        if(sp2 !== undefined) {
            for( let i = 0; i < sp2.freeControlPoints.length; i++) {
                expect(sp2.freeControlPoints[i].x).to.be.closeTo(cpX2[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp2.freeControlPoints[i].y).to.be.closeTo(cpY2[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp2?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        // insert the knot once again
        const sp22 = sp2?.clone();
        sp22?.insertKnotBoehmAlgorithm(2);
        expect(sp22?.freeControlPoints.length).to.eql(6)
        expect(sp22?.knots.length).to.eql(7)
        expect(sp22?.knots).to.eql([0, 1, 2, 2, 2, 3, 4])
        const cpX22 = [-0.333333333333333, -0.66666666666666, -1, -1, 1, 1]
        const cpY22 = [-1, -0.66666666666666, -0.333333333333333, 1, 1, -1]
        if(sp22 !== undefined) {
            for( let i = 0; i < sp22.freeControlPoints.length; i++) {
                expect(sp22.freeControlPoints[i].x).to.be.closeTo(cpX22[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp22.freeControlPoints[i].y).to.be.closeTo(cpY22[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp22?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sp3 = s?.clone();
        sp3?.insertKnotBoehmAlgorithm(3);
        expect(sp3?.freeControlPoints.length).to.eql(5)
        expect(sp3?.knots.length).to.eql(6)
        expect(sp3?.knots).to.eql([0, 1, 2, 3, 3, 4])
        const cpX3 = [-1, -1, -0.333333333333333, 1, 1]
        const cpY3 = [-1, 0.333333333333333, 1, 1, -1]
        if(sp3 !== undefined) {
            for( let i = 0; i < sp3.freeControlPoints.length; i++) {
                expect(sp3.freeControlPoints[i].x).to.be.closeTo(cpX3[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp3.freeControlPoints[i].y).to.be.closeTo(cpY3[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp3?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp3?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp3?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp3?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp3?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp3?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp3?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp3?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        // insert the knot once again
        const sp33 = sp3?.clone();
        sp33?.insertKnotBoehmAlgorithm(3);
        expect(sp33?.freeControlPoints.length).to.eql(6)
        expect(sp33?.knots.length).to.eql(7)
        expect(sp33?.knots).to.eql([0, 1, 2, 3, 3, 3, 4])
        const cpX33 = [-1, -1, -0.66666666666666, -0.333333333333333, 1, 1]
        const cpY33 = [-1, 0.333333333333333, 0.66666666666666, 1, 1, -1]
        if(sp33 !== undefined) {
            for( let i = 0; i < sp33.freeControlPoints.length; i++) {
                expect(sp33.freeControlPoints[i].x).to.be.closeTo(cpX33[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp33.freeControlPoints[i].y).to.be.closeTo(cpY33[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp33?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp33?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp33?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp33?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp33?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp33?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp33?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp33?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });


    it('can insert repeatedly a knot using Boehm algorithm for a cubic B-Spline at knot u = 1 of the initial sequence when the initial knot has a multiplicity greater than one', () => {
        // rectangular control polygon
        const cp0 = new Vector2d(-1, -1)
        const cp1 = new Vector2d(-1, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, -1)
        const knots = [0, 1, 2, 3, 4]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3], knots, 3)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3])
        expect(s?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sp0 = s?.clone();
        sp0?.insertKnotBoehmAlgorithm(0);
        expect(sp0?.freeControlPoints.length).to.eql(5)
        expect(sp0?.knots.length).to.eql(7)
        expect(sp0?.knots).to.eql([0, 0, 1, 2, 3, 4, 4])
        const cpX0 = [-1, -1, 0.333333333333333, 1, 1]
        const cpY0 = [-1, 1, 1, 0.333333333333333, -1]
        if(sp0 !== undefined) {
            for( let i = 0; i < sp0.freeControlPoints.length; i++) {
                expect(sp0.freeControlPoints[i].x).to.be.closeTo(cpX0[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp0.freeControlPoints[i].y).to.be.closeTo(cpY0[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp0?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sp1 = sp0?.clone();
        sp1?.insertKnotBoehmAlgorithm(1);
        expect(sp1?.freeControlPoints.length).to.eql(6)
        expect(sp1?.knots.length).to.eql(8)
        expect(sp1?.knots).to.eql([0, 0, 1, 1, 2, 3, 4, 4])
        const cpX1 = [0.333333333333333, -1, -1, 0.333333333333333, 1, 1]
        const cpY1 = [-1, -1, 1, 1, 0.333333333333333, -0.333333333333333] 
        if(sp1 !== undefined) {
            for( let i = 0; i < sp1.freeControlPoints.length; i++) {
                expect(sp1.freeControlPoints[i].x).to.be.closeTo(cpX1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp1.freeControlPoints[i].y).to.be.closeTo(cpY1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp1?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp1?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        // insert the knot at origin once again
        const sp00 = sp0?.clone();
        sp00?.insertKnotBoehmAlgorithm(0);
        expect(sp00?.freeControlPoints.length).to.eql(6)
        expect(sp00?.knots.length).to.eql(9)
        expect(sp00?.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 4])
        const cpX00 = [-1, -1, 0.333333333333333, 0.66666666666666, 1, 1]
        const cpY00 = [-1, 1, 1, 0.66666666666666, 0.333333333333333, -1]
        if(sp00 !== undefined) {
            for( let i = 0; i < sp00.freeControlPoints.length; i++) {
                expect(sp00.freeControlPoints[i].x).to.be.closeTo(cpX00[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp00.freeControlPoints[i].y).to.be.closeTo(cpY00[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp00?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sp11 = sp00?.clone();
        sp11?.insertKnotBoehmAlgorithm(1);
        expect(sp11?.freeControlPoints.length).to.eql(7)
        expect(sp11?.knots.length).to.eql(10)
        expect(sp11?.knots).to.eql([0, 0, 0, 1, 1, 2, 3, 4, 4, 4])
        const cpX11 = [0.333333333333333, -1, -1, 0.333333333333333, 0.66666666666666, 1, 1]
        const cpY11 = [-1, -1, 1, 1, 0.66666666666666, 0.333333333333333, -0.333333333333333] 
        if(sp11 !== undefined) {
            for( let i = 0; i < sp11.freeControlPoints.length; i++) {
                expect(sp11.freeControlPoints[i].x).to.be.closeTo(cpX11[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp11.freeControlPoints[i].y).to.be.closeTo(cpY11[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp11?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp11?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });

    it('can insert repeatedly a knot using Boehm algorithm for a cubic B-Spline at knot u = 2 of the initial sequence when the initial knot has a multiplicity greater than one', () => {
        // rectangular control polygon
        const cp0 = new Vector2d(-1, -1)
        const cp1 = new Vector2d(-1, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, -1)
        const knots = [0, 1, 2, 3, 4]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3], knots, 3)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3])
        expect(s?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sp0 = s?.clone();
        sp0?.insertKnotBoehmAlgorithm(0);
        expect(sp0?.freeControlPoints.length).to.eql(5)
        expect(sp0?.knots.length).to.eql(7)
        expect(sp0?.knots).to.eql([0, 0, 1, 2, 3, 4, 4])
        const cpX0 = [-1, -1, 0.333333333333333, 1, 1]
        const cpY0 = [-1, 1, 1, 0.333333333333333, -1]
        if(sp0 !== undefined) {
            for( let i = 0; i < sp0.freeControlPoints.length; i++) {
                expect(sp0.freeControlPoints[i].x).to.be.closeTo(cpX0[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp0.freeControlPoints[i].y).to.be.closeTo(cpY0[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp0?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp0?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sp2 = sp0?.clone();
        sp2?.insertKnotBoehmAlgorithm(2);
        expect(sp2?.freeControlPoints.length).to.eql(6)
        expect(sp2?.knots.length).to.eql(8)
        expect(sp2?.knots).to.eql([0, 0, 1, 2, 2, 3, 4, 4])
        const cpX2 = [-0.333333333333333, -1, -1, 0.333333333333333, 1, 1]
        const cpY2 = [-1, -0.333333333333333, 1, 1, 0.333333333333333, -1] 
        if(sp2 !== undefined) {
            for( let i = 0; i < sp2.freeControlPoints.length; i++) {
                expect(sp2.freeControlPoints[i].x).to.be.closeTo(cpX2[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp2.freeControlPoints[i].y).to.be.closeTo(cpY2[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp2?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp2?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        // insert the knot at origin once again
        const sp00 = sp0?.clone();
        sp00?.insertKnotBoehmAlgorithm(0);
        expect(sp00?.freeControlPoints.length).to.eql(6)
        expect(sp00?.knots.length).to.eql(9)
        expect(sp00?.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 4])
        const cpX00 = [-1, -1, 0.333333333333333, 0.66666666666666, 1, 1]
        const cpY00 = [-1, 1, 1, 0.66666666666666, 0.333333333333333, -1]
        if(sp00 !== undefined) {
            for( let i = 0; i < sp00.freeControlPoints.length; i++) {
                expect(sp00.freeControlPoints[i].x).to.be.closeTo(cpX00[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp00.freeControlPoints[i].y).to.be.closeTo(cpY00[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp00?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp00?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sp22 = sp00?.clone();
        sp22?.insertKnotBoehmAlgorithm(2);
        expect(sp22?.freeControlPoints.length).to.eql(7)
        expect(sp22?.knots.length).to.eql(10)
        expect(sp22?.knots).to.eql([0, 0, 0, 1, 2, 2, 3, 4, 4, 4])
        const cpX22 = [-0.333333333333333, -1, -1, 0.333333333333333, 0.66666666666666, 1, 1]
        const cpY22 = [-1, -0.333333333333333, 1, 1, 0.66666666666666, 0.333333333333333, -1] 
        if(sp22 !== undefined) {
            for( let i = 0; i < sp22.freeControlPoints.length; i++) {
                expect(sp22.freeControlPoints[i].x).to.be.closeTo(cpX22[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sp22.freeControlPoints[i].y).to.be.closeTo(cpY22[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sp22?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sp22?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });

    it('can insert a knot using Boehm algorithm for a minimal cubic B-Spline with an initial sequence having a maximal knot multiplicity at the origin', () => {
        // triangular control polygon
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(-1, 1)
        const cp2 = new Vector2d(1, 1)
        const knots = [0, 0, 0, 1, 1, 1]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2], knots, 3)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2])
        expect(s?.evaluate(0).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        expect(s?.evaluate(0.5).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0.5).y).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const s05 = s?.clone();
        s05?.insertKnotBoehmAlgorithm(0.5);
        expect(s05?.freeControlPoints.length).to.eql(4)
        expect(s05?.knots.length).to.eql(7)
        expect(s05?.knots).to.eql([0, 0, 0, 0.5, 1, 1, 1])
        const cpX = [0.5, 0.0, -0.5, 0.0]
        const cpY = [0.5, 0.0, 0.5, 1] 
        if(s05 !== undefined) {
            for( let i = 0; i < s05.freeControlPoints.length; i++) {
                expect(s05.freeControlPoints[i].x).to.be.closeTo(cpX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(s05.freeControlPoints[i].y).to.be.closeTo(cpY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(s05?.evaluate(0).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s05?.evaluate(0).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s05?.evaluate(1).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s05?.evaluate(1).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        expect(s05?.evaluate(0.5).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s05?.evaluate(0.5).y).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        // console.log("p05 = " + s?.evaluate(0.5).x + "  " + s?.evaluate(0.5).y);

        const s05_2 = s05?.clone();
        s05_2?.insertKnotBoehmAlgorithm(0.5);
        expect(s05_2?.freeControlPoints.length).to.eql(5)
        expect(s05_2?.knots.length).to.eql(8)
        expect(s05_2?.knots).to.eql([0, 0, 0, 0.5, 0.5, 1, 1, 1])
        const cpX2 = [0.25, 0.5, 0.0, -0.5, -0.25]
        const cpY2 = [0.75, 0.5, 0.0, 0.5, 0.75] 
        if(s05_2 !== undefined) {
            for( let i = 0; i < s05_2.freeControlPoints.length; i++) {
                expect(s05_2.freeControlPoints[i].x).to.be.closeTo(cpX2[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(s05_2.freeControlPoints[i].y).to.be.closeTo(cpY2[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(s05_2?.evaluate(0).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s05_2?.evaluate(0).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s05_2?.evaluate(1).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s05_2?.evaluate(1).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        expect(s05_2?.evaluate(0.5).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s05_2?.evaluate(0.5).y).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });

    it('can evaluate a periodic B-Spline with uniform knot sequence at a point u', () => {
        // control polygon
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(0, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, 0)
        const knots = [0, 1, 2, 3, 4]
        const spline = PeriodicBSplineR1toR2.create([cp0, cp1, cp2, cp3], knots, 1)
        const incSequence = new IncreasingPeriodicKnotSequenceClosedCurve(1, knots)
        expect(basisFunctionsFromSequence(0, 0, incSequence)).to.eql(basisFunctionsFromSequence(1, 1, incSequence))
        expect(basisFunctionsFromSequence(1, 1, incSequence)).to.eql(basisFunctionsFromSequence(2, 2, incSequence))
        expect(basisFunctionsFromSequence(2, 2, incSequence)).to.eql(basisFunctionsFromSequence(3, 3, incSequence))
        expect(basisFunctionsFromSequence(2, 2.75, incSequence)).to.eql(basisFunctionsFromSequence(3, 3.75, incSequence))
        expect(basisFunctionsFromSequence(1, 1.25, incSequence)[0]).to.eql(basisFunctionsFromSequence(2, 2.75, incSequence)[1])
        expect(basisFunctionsFromSequence(1, 1.25, incSequence)[1]).to.eql(basisFunctionsFromSequence(2, 2.75, incSequence)[0])
        expect(basisFunctionsFromSequence(0, 0.25, incSequence)[0]).to.eql(basisFunctionsFromSequence(3, 3.75, incSequence)[1])
        expect(basisFunctionsFromSequence(0, 0.25, incSequence)[1]).to.eql(basisFunctionsFromSequence(3, 3.75, incSequence)[0])
        expect(spline?.evaluate(0)).to.eql(cp3)
        expect(spline?.evaluate(1)).to.eql(cp0)
        expect(spline?.evaluate(2)).to.eql(cp1)
        expect(spline?.evaluate(3)).to.eql(cp2)
        const spline2 = PeriodicBSplineR1toR2.create([cp0, cp1, cp2, cp3], knots, 2)
        const incSequence2 = new IncreasingPeriodicKnotSequenceClosedCurve(2, knots)
        expect(basisFunctionsFromSequence(0, 0, incSequence2)).to.eql(basisFunctionsFromSequence(1, 1, incSequence2))
        expect(basisFunctionsFromSequence(1, 1, incSequence2)).to.eql(basisFunctionsFromSequence(2, 2, incSequence2))
        expect(basisFunctionsFromSequence(2, 2, incSequence2)).to.eql(basisFunctionsFromSequence(3, 3, incSequence2))
        expect(basisFunctionsFromSequence(2, 2.75, incSequence2)).to.eql(basisFunctionsFromSequence(3, 3.75, incSequence2))
        expect(basisFunctionsFromSequence(0, 0.25, incSequence2)[0]).to.eql(basisFunctionsFromSequence(3, 3.75, incSequence2)[2])
        expect(basisFunctionsFromSequence(0, 0.25, incSequence2)[1]).to.eql(basisFunctionsFromSequence(3, 3.75, incSequence2)[1])
        expect(basisFunctionsFromSequence(0, 0.25, incSequence2)[2]).to.eql(basisFunctionsFromSequence(3, 3.75, incSequence2)[0])
        expect(spline2?.evaluate(0)).to.eql(new Vector2d(1, 0.5))
        expect(spline2?.evaluate(1)).to.eql(new Vector2d(0.5, 0))
        expect(spline2?.evaluate(2)).to.eql(new Vector2d(0, 0.5))
        expect(spline2?.evaluate(3)).to.eql(new Vector2d(0.5, 1))
        const spline3 = PeriodicBSplineR1toR2.create([cp0, cp1, cp2, cp3], knots, 3)
        const incSequence3 = new IncreasingPeriodicKnotSequenceClosedCurve(3, knots)
        expect(basisFunctionsFromSequence(0, 0, incSequence3)).to.eql(basisFunctionsFromSequence(1, 1, incSequence3))
        expect(basisFunctionsFromSequence(1, 1, incSequence3)).to.eql(basisFunctionsFromSequence(2, 2, incSequence3))
        expect(basisFunctionsFromSequence(2, 2, incSequence3)).to.eql(basisFunctionsFromSequence(3, 3, incSequence3))
        expect(basisFunctionsFromSequence(2, 2.75, incSequence3)).to.eql(basisFunctionsFromSequence(3, 3.75, incSequence3))
        expect(basisFunctionsFromSequence(0, 0.25, incSequence3)[0]).to.eql(basisFunctionsFromSequence(3, 3.75, incSequence3)[3])
        expect(basisFunctionsFromSequence(0, 0.25, incSequence3)[1]).to.eql(basisFunctionsFromSequence(3, 3.75, incSequence3)[2])
        expect(basisFunctionsFromSequence(0, 0.25, incSequence3)[2]).to.eql(basisFunctionsFromSequence(3, 3.75, incSequence3)[1])
        expect(basisFunctionsFromSequence(0, 0.25, incSequence3)[3]).to.eql(basisFunctionsFromSequence(3, 3.75, incSequence3)[0])
        expect(spline3?.evaluate(0).x).to.be.closeTo(0.833333333333,TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline3?.evaluate(0).y).to.be.closeTo(0.833333333333,TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline3?.evaluate(1).x).to.be.closeTo(0.833333333333,TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline3?.evaluate(1).y).to.be.closeTo(0.166666666666,TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline3?.evaluate(2).x).to.be.closeTo(0.166666666666,TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline3?.evaluate(2).y).to.be.closeTo(0.166666666666,TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline3?.evaluate(3).x).to.be.closeTo(0.166666666666,TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline3?.evaluate(3).y).to.be.closeTo(0.833333333333,TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });

    it('can evaluate a periodic quadratic B-Spline with an arbitrary knot sequence at a point u', () => {
        // control polygon
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(0, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, 0)
        const cp4 = new Vector2d(0.5, -0.5)
        const knots = [0, 0, 1, 2, 3, 4, 4]
        const spline = PeriodicBSplineR1toR2.create([cp0, cp1, cp2, cp3, cp4], knots, 2)
        const incSequence = new IncreasingPeriodicKnotSequenceClosedCurve(2, knots)
        expect(basisFunctionsFromSequence(2, 1, incSequence)).to.eql(basisFunctionsFromSequence(4, 3, incSequence))
        expect(basisFunctionsFromSequence(1, 0.5, incSequence)[0]).to.eql(basisFunctionsFromSequence(4, 3.5, incSequence)[2])
        expect(basisFunctionsFromSequence(1, 0.5, incSequence)[1]).to.eql(basisFunctionsFromSequence(4, 3.5, incSequence)[1])
        expect(basisFunctionsFromSequence(1, 0.5, incSequence)[2]).to.eql(basisFunctionsFromSequence(4, 3.5, incSequence)[0])
        expect(spline?.evaluate(0).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(0).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(1).x).to.be.closeTo(0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(1).y).to.be.closeTo(-0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(2).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(3).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });

    it('can evaluate a periodic cubic B-Spline with arbitrary knot multiplicity at its origin', () => {
        // control polygon
        // rectangular control polygon
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(0, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, 0)
        const cp4 = new Vector2d(1, -1)
        const cp5 = new Vector2d(0, -1)
        const knots = [0, 1, 2, 3, 4, 5, 6]
        const spline = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 3)
        expect(spline?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        const incSequence = new IncreasingPeriodicKnotSequenceClosedCurve(3, knots)
        for(let i = 0; i < (incSequence.length() - 2); i++) {
            let basis = basisFunctionsFromSequence(i, i, incSequence)
            expect(basis[0]).to.be.closeTo(0.1666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(basis[1]).to.be.closeTo(0.6666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(basis[2]).to.be.closeTo(0.1666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(basis[3]).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
        expect(basisFunctionsFromSequence(0, 0, incSequence)).to.eql(basisFunctionsFromSequence(4, 4, incSequence))
        expect(spline?.evaluate(0).x).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(0).y).to.be.closeTo(-0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const cp6 = new Vector2d(1, -0.66666666666666)
        const cp7 = new Vector2d(0.66666666666666, -1)
        const knots1 = [0, 0, 1, 2, 3, 4, 5, 6, 6]
        const spline1 = PeriodicBSplineR1toR2.create([cp0, cp1, cp2, cp3, cp6, cp7, cp5], knots1, 3)
        expect(spline1?.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp6, cp7, cp5])
        const incSequence1 = new IncreasingPeriodicKnotSequenceClosedCurve(3, knots1)
        let basis1 = basisFunctionsFromSequence(1, 0, incSequence1)
        expect(basis1[0]).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(basis1[1]).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(basis1[2]).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(basis1[3]).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        basis1 = basisFunctionsFromSequence(2, 1, incSequence1)
        expect(basis1[0]).to.be.closeTo(0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(basis1[1]).to.be.closeTo(0.583333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(basis1[2]).to.be.closeTo(0.1666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(basis1[3]).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        for(let i = 3; i < (incSequence.length() - 4); i++) {
            basis1 = basisFunctionsFromSequence(i, (i - 1), incSequence1)
            expect(basis1[0]).to.be.closeTo(0.1666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(basis1[1]).to.be.closeTo(0.6666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(basis1[2]).to.be.closeTo(0.1666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            expect(basis1[3]).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        }
        expect(spline1?.evaluate(0).x).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline1?.evaluate(0).y).to.be.closeTo(-0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const cp8 = new Vector2d(0.83333333333333, -0.83333333333333)
        const knots2 = [0, 0, 0, 1, 2, 3, 4, 5, 6, 6, 6]
        const spline2 = PeriodicBSplineR1toR2.create([cp0, cp1, cp2, cp3, cp6, cp8, cp7, cp5], knots2, 3)
        expect(spline2?.freeControlPoints).to.eql([cp0, cp1, cp2, cp3, cp6, cp8, cp7, cp5])
        const incSequence2 = new IncreasingPeriodicKnotSequenceClosedCurve(3, knots2)
        let basis2 = basisFunctionsFromSequence(2, 0, incSequence2)
        expect(basis2[0]).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(basis2[1]).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(basis2[2]).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(basis2[3]).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline2?.evaluate(0).x).to.be.closeTo(0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline2?.evaluate(0).y).to.be.closeTo(-0.83333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });

    it('can increment the degree of a linear periodic B-Spline ', () => {
        // rectangular control polygon
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(0, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, 0)
        const cp4 = new Vector2d(1, -1)
        const cp5 = new Vector2d(0, -1)
        const knots = [0, 1, 2, 3, 4, 5, 6]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 1)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        expect(s?.evaluate(0).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        expect(s?.evaluate(0.5).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0.5).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1.5).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1.5).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2.5).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2.5).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3.5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3.5).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4.5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4.5).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5.5).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5.5).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        const intermSplineKnots = s?.generateIntermediateSplinesForDegreeElevation();
        const knots0 = [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6]
        const knots1 = [0, 1, 1, 2, 3, 3, 4, 5, 5, 6]
        expect(intermSplineKnots?.knotVectors[0]).to.eql(knots0)
        expect(intermSplineKnots?.knotVectors[1]).to.eql(knots1)
        expect(intermSplineKnots?.CPs[0]).to.eql([cp0, cp1, cp2, cp2, cp3, cp4, cp4, cp5, cp0])
        expect(intermSplineKnots?.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp3, cp4, cp5, cp5])

        const s0 = PeriodicBSplineR1toR2.create([cp0, cp1, cp2, cp2, cp3, cp4, cp4, cp5, cp0], knots0, 2)
        s0?.insertKnotBoehmAlgorithm(1)
        s0?.insertKnotBoehmAlgorithm(3)
        s0?.insertKnotBoehmAlgorithm(5)
        expect(s0?.evaluate(0).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(0).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(1).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(2).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(3).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(4).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(4).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(5).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.freeControlPoints.length).to.eql(12)
        expect(s0?.knots.length).to.eql(14)
        expect(s0?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6])
        const cpX0 = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0]
        const cpY0 = [0, 0, 1, 1, 1, 1, 0, -1, -1, -1, -1, 0]
        if(s0 !== undefined) {
            for( let i = 0; i < s0.freeControlPoints.length; i++) {
                expect(s0.freeControlPoints[i].x).to.be.closeTo(cpX0[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(s0.freeControlPoints[i].y).to.be.closeTo(cpY0[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }

        const s1 = PeriodicBSplineR1toR2.create([cp0, cp1, cp1, cp2, cp3, cp3, cp4, cp5, cp5], knots1, 2)
        s1?.insertKnotBoehmAlgorithm(0)
        s1?.insertKnotBoehmAlgorithm(2)
        s1?.insertKnotBoehmAlgorithm(4)
        expect(s1?.evaluate(0).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(0).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(1).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(2).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(3).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(4).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(4).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(5).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.freeControlPoints.length).to.eql(12)
        expect(s1?.knots.length).to.eql(14)
        expect(s1?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6])
        const cpX1 = [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0]
        const cpY1 = [0, 1, 1, 1, 1, 0, 0, 0, -1, -1, -1, -1]
        if(s1 !== undefined) {
            for( let i = 0; i < s1.freeControlPoints.length; i++) {
                expect(s1.freeControlPoints[i].x).to.be.closeTo(cpX1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(s1.freeControlPoints[i].y).to.be.closeTo(cpY1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }

        const newSpline = s?.degreeIncrement();
        expect(newSpline?.degree).to.eql(2)
        expect(newSpline?.knots.length).to.eql(14)
        expect(newSpline?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6])
        expect(newSpline?.freeControlPoints.length).to.eql(12)
        const cpXns = [0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0, 0]
        const cpYns = [0, 0.5, 1, 1, 1, 0.5, 0, -0.5, -1, -1, -1, -0.5]
        if(newSpline !== undefined) {
            for( let i = 0; i < newSpline.freeControlPoints.length; i++) {
                expect(newSpline.freeControlPoints[i].x).to.be.closeTo(cpXns[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(newSpline.freeControlPoints[i].y).to.be.closeTo(cpYns[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(newSpline?.evaluate(0).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(0).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(1).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(2).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(3).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(4).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(4).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(5).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        expect(newSpline?.evaluate(0.5).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(0.5).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(1.5).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(1.5).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(2.5).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(2.5).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(3.5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(3.5).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(4.5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(4.5).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(5.5).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(5.5).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

    });

    it('can increment the degree of a quadratic periodic B-Spline ', () => {
        // rectangular control polygon
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(0, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, 0)
        const cp4 = new Vector2d(1, -1)
        const cp5 = new Vector2d(0, -1)
        const knots = [0, 1, 2, 3, 4, 5, 6]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        expect(s?.evaluate(0).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        expect(s?.evaluate(0.5).x).to.be.closeTo(0.125, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0.5).y).to.be.closeTo(-0.875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1.5).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1.5).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2.5).x).to.be.closeTo(0.125, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2.5).y).to.be.closeTo(0.875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3.5).x).to.be.closeTo(0.875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3.5).y).to.be.closeTo(0.875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4.5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4.5).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5.5).x).to.be.closeTo(0.875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5.5).y).to.be.closeTo(-0.875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const intermSplineKnots = s?.generateIntermediateSplinesForDegreeElevation();
        const knots0 = [0, 0, 1, 2, 3, 3, 4, 5, 6, 6]
        const knots1 = [0, 1, 1, 2, 3, 4, 4, 5, 6]
        const knots2 = [0, 1, 2, 2, 3, 4, 5, 5, 6]
        expect(intermSplineKnots?.knotVectors[0]).to.eql(knots0)
        expect(intermSplineKnots?.knotVectors[1]).to.eql(knots1)
        expect(intermSplineKnots?.knotVectors[2]).to.eql(knots2)
        expect(intermSplineKnots?.CPs[0]).to.eql([cp0, cp1, cp2, cp3, cp3, cp4, cp5, cp0])
        expect(intermSplineKnots?.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp4, cp4, cp5])
        expect(intermSplineKnots?.CPs[2]).to.eql([cp0, cp1, cp2, cp2, cp3, cp4, cp5, cp5])

        const s0 = PeriodicBSplineR1toR2.create([cp0, cp1, cp2, cp3, cp3, cp4, cp5, cp0], knots0, 3)
        expect(s0?.evaluate(0).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(0).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(1).y).to.be.closeTo(-0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(2).y).to.be.closeTo(0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(3).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(4).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(4).y).to.be.closeTo(0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(5).y).to.be.closeTo(-0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        s0?.insertKnotBoehmAlgorithm(1)
        s0?.insertKnotBoehmAlgorithm(2)
        s0?.insertKnotBoehmAlgorithm(4)
        s0?.insertKnotBoehmAlgorithm(5)
        expect(s0?.evaluate(0).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(0).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(1).y).to.be.closeTo(-0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(2).y).to.be.closeTo(0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(3).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(4).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(4).y).to.be.closeTo(0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.evaluate(5).y).to.be.closeTo(-0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s0?.freeControlPoints.length).to.eql(12)
        expect(s0?.knots.length).to.eql(14)
        expect(s0?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6])
        const cpX0 = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0]
        const cpY0 = [0, 0, 0.5, 1, 1, 0.5, 0, 0, -0.5, -1, -1, -0.5]
        if(s0 !== undefined) {
            for( let i = 0; i < s0.freeControlPoints.length; i++) {
                expect(s0.freeControlPoints[i].x).to.be.closeTo(cpX0[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(s0.freeControlPoints[i].y).to.be.closeTo(cpY0[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }

        const s1 = PeriodicBSplineR1toR2.create([cp0, cp1, cp1, cp2, cp3, cp4, cp4, cp5], knots1, 3)
        expect(s1?.evaluate(0).x).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(0).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(1).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(2).y).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(3).x).to.be.closeTo(0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(4).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(4).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(5).y).to.be.closeTo(-0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        s1?.insertKnotBoehmAlgorithm(0)
        s1?.insertKnotBoehmAlgorithm(2)
        s1?.insertKnotBoehmAlgorithm(3)
        s1?.insertKnotBoehmAlgorithm(5)
        expect(s1?.evaluate(0).x).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(0).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(1).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(2).y).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(3).x).to.be.closeTo(0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(4).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(4).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.evaluate(5).y).to.be.closeTo(-0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s1?.freeControlPoints.length).to.eql(12)
        expect(s1?.knots.length).to.eql(14)
        expect(s1?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6])
        const cpX1 = [0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0]
        const cpY1 = [0, 0.5, 1, 1, 1, 1, 0, -0.5, -1, -1, -1, -1]
        if(s1 !== undefined) {
            for( let i = 0; i < s1.freeControlPoints.length; i++) {
                expect(s1.freeControlPoints[i].x).to.be.closeTo(cpX1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(s1.freeControlPoints[i].y).to.be.closeTo(cpY1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }

        const s2 = PeriodicBSplineR1toR2.create([cp0, cp1, cp2, cp2, cp3, cp4, cp5, cp5], knots2, 3)
        expect(s2?.evaluate(0).x).to.be.closeTo(0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(0).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(1).y).to.be.closeTo(-0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(2).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(3).x).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(4).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(4).y).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(5).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        s2?.insertKnotBoehmAlgorithm(0)
        s2?.insertKnotBoehmAlgorithm(1)
        s2?.insertKnotBoehmAlgorithm(3)
        s2?.insertKnotBoehmAlgorithm(4)
        expect(s2?.evaluate(0).x).to.be.closeTo(0.25, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(0).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(1).y).to.be.closeTo(-0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(2).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(3).x).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(4).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(4).y).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.evaluate(5).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s2?.freeControlPoints.length).to.eql(12)
        expect(s2?.knots.length).to.eql(14)
        expect(s2?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6])
        const cpX2 = [0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0, 0]
        const cpY2 = [-0.5, 0, 1, 1, 1, 1, 0.5, 0, -1, -1, -1, -1]
        if(s2 !== undefined) {
            for( let i = 0; i < s2.freeControlPoints.length; i++) {
                expect(s2.freeControlPoints[i].x).to.be.closeTo(cpX2[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(s2.freeControlPoints[i].y).to.be.closeTo(cpY2[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }

        const newSpline = s?.degreeIncrement();
        expect(newSpline?.degree).to.eql(3)
        expect(newSpline?.knots.length).to.eql(14)
        expect(newSpline?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6])
        expect(newSpline?.freeControlPoints.length).to.eql(12)
        const cpX = [0, 0, 0, 0.166666666666666, 0.83333333333333, 1, 1, 1, 1, 0.83333333333333, 0.166666666666666, 0]
        const cpY = [-0.166666666666666, 0.166666666666666, 0.83333333333333, 1, 1, 0.83333333333333, 0.166666666666666, -0.166666666666666, -0.83333333333333, -1, -1, -0.83333333333333]
        if(newSpline !== undefined) {
            for( let i = 0; i < newSpline.freeControlPoints.length; i++) {
                expect(newSpline.freeControlPoints[i].x).to.be.closeTo(cpX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(newSpline.freeControlPoints[i].y).to.be.closeTo(cpY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(newSpline?.evaluate(0).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(0).y).to.be.closeTo(-1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(1).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(2).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(2).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(3).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(3).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(4).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(4).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(5).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        expect(newSpline?.evaluate(0.5).x).to.be.closeTo(0.125, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(0.5).y).to.be.closeTo(-0.875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(1.5).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(1.5).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(2.5).x).to.be.closeTo(0.125, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(2.5).y).to.be.closeTo(0.875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(3.5).x).to.be.closeTo(0.875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(3.5).y).to.be.closeTo(0.875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(4.5).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(4.5).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(5.5).x).to.be.closeTo(0.875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(5.5).y).to.be.closeTo(-0.875, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });

    it('can increment the degree of a cubic periodic BSpline', () => {
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
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11], knots, 3)
        expect(s?.evaluate(0).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(-0.68, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(-0.145, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(-0.5783333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).x).to.be.closeTo(-0.255, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).y).to.be.closeTo(-0.3333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).x).to.be.closeTo(-0.29, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4).x).to.be.closeTo(-0.255, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(4).y).to.be.closeTo(0.3333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5).x).to.be.closeTo(-0.145, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(5).y).to.be.closeTo(0.5783333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(6).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(6).y).to.be.closeTo(0.68, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(7).x).to.be.closeTo(0.145, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(7).y).to.be.closeTo(0.5783333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(8).x).to.be.closeTo(0.255, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(8).y).to.be.closeTo(0.3333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(9).x).to.be.closeTo(0.29, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(9).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(10).x).to.be.closeTo(0.255, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(10).y).to.be.closeTo(-0.3333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(11).x).to.be.closeTo(0.145, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(11).y).to.be.closeTo(-0.5783333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        
        const newSpline = s?.degreeIncrement();
        expect(newSpline?.degree).to.eql(4)
        expect(newSpline?.knots.length).to.eql(26)
        expect(newSpline?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12])
        expect(newSpline?.freeControlPoints.length).to.eql(24)
        const cpX = [-0.21, -0.2625, -0.285, -0.295, -0.285, -0.2625, -0.21, -0.1475,
                -0.075, 0.0, 0.075, 0.1475, 0.21, 0.2625, 0.285, 0.295,
                0.285, 0.2625, 0.21, 0.1475, 0.075, 0.0, -0.075, -0.1475]
        const cpY = [-0.475, -0.3416666666666666, -0.175, 0.0, 0.175, 0.3416666666666666, 0.475, 0.58916666666666666666,
            0.66, 0.7, 0.66, 0.58916666666666666666, 0.475, 0.34166666666666666, 0.175, 0.0,
            -0.175, -0.3416666666666666, -0.475, -0.58916666666666666666, -0.66, -0.7, -0.66, -0.58916666666666666666]
        if(newSpline !== undefined) {
            for( let i = 0; i < newSpline.freeControlPoints.length; i++) {
                expect(newSpline.freeControlPoints[i].x).to.be.closeTo(cpX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(newSpline.freeControlPoints[i].y).to.be.closeTo(cpY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(newSpline?.evaluate(0).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(0).y).to.be.closeTo(-0.68, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(1).x).to.be.closeTo(-0.145, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(1).y).to.be.closeTo(-0.5783333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(2).x).to.be.closeTo(-0.255, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(2).y).to.be.closeTo(-0.3333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(3).x).to.be.closeTo(-0.29, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(3).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(4).x).to.be.closeTo(-0.255, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(4).y).to.be.closeTo(0.3333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(5).x).to.be.closeTo(-0.145, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(5).y).to.be.closeTo(0.5783333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(6).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(6).y).to.be.closeTo(0.68, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(7).x).to.be.closeTo(0.145, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(7).y).to.be.closeTo(0.5783333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(8).x).to.be.closeTo(0.255, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(8).y).to.be.closeTo(0.3333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(9).x).to.be.closeTo(0.29, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(9).y).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(10).x).to.be.closeTo(0.255, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(10).y).to.be.closeTo(-0.3333333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(11).x).to.be.closeTo(0.145, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(newSpline?.evaluate(11).y).to.be.closeTo(-0.5783333333333333, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });
    
    it('can convert a periodic BSpline into a non periodic BSpline with open knot sequence. Case of curve equivalent to a Bézier curve', () => {
        // triangular control polygon
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(-1, 1)
        const cp2 = new Vector2d(1, 1)
        const knots = [0, 0, 0, 1, 1, 1]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2], knots, 3)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2])
        expect(s?.evaluate(0).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        expect(s?.evaluate(0.5).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0.5).y).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sOpen = s?.toPeriodicBSplineR1toR2withOpenKnotSequence();
        expect(sOpen?.degree).to.eql(3);
        expect(sOpen?.controlPoints.length).to.eql(4)
        expect(sOpen?.controlPoints).to.eql([cp0, cp1, cp2, cp0]);
        expect(sOpen?.knots.length).to.eql(8);
        expect(sOpen?.knots).to.eql([-1, 0, 0, 0, 1, 1, 1, 2]);
        expect(sOpen?.evaluate(0).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpen?.evaluate(0).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpen?.evaluate(1).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpen?.evaluate(1).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        expect(sOpen?.evaluate(0.5).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpen?.evaluate(0.5).y).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });

    it('can convert a periodic B-Spline with a uniform knot sequence to a periodic BSpline with open knot sequence', () => {
        // rectangular control polygon
        const cp0 = new Vector2d(-1, -1)
        const cp1 = new Vector2d(-1, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, -1)
        const knots = [0, 1, 2, 3, 4]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3], knots, 3)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3])
        expect(s?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0.5).x).to.be.closeTo(0.916666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0.5).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sPer = s?.toPeriodicBSplineR1toR2withOpenKnotSequence();
        expect(sPer?.degree).to.eql(3)
        expect(sPer?.freeControlPoints.length).to.eql(4)
        const cpX = [-1, 1, 1, -1, -1, 1, 1]
        const cpY = [1, 1, -1, -1, 1, 1, -1]
        if(sPer !== undefined) {
            for( let i = 0; i < sPer.freeControlPoints.length; i++) {
                expect(sPer.freeControlPoints[i].x).to.be.closeTo(cpX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sPer.freeControlPoints[i].y).to.be.closeTo(cpY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sPer?.controlPoints.length).to.eql(7)
        if(sPer !== undefined) {
            for( let i = 0; i < sPer.controlPoints.length; i++) {
                expect(sPer.controlPoints[i].x).to.be.closeTo(cpX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sPer.controlPoints[i].y).to.be.closeTo(cpY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        // expect(sPer?.controlPoints).to.eql([cp1, cp2, cp3, cp0, cp1, cp2, cp3])
        expect(sPer?.knots.length).to.eql(11)
        expect(sPer?.knots).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7])

        expect(sPer?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(4).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(4).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(0.5).x).to.be.closeTo(0.916666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(0.5).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });

    it('can convert a periodic B-Spline with a knot multiplicity at origin greater than one to a periodic BSpline with open knot sequence', () => {
        // rectangular control polygon
        const cp0 = new Vector2d(-1, -1)
        const cp1 = new Vector2d(-1, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, -1)
        const knots = [0, 1, 2, 3, 4]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3], knots, 3)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3])
        s?.insertKnotBoehmAlgorithm(0);
        expect(s?.knots).to.eql([0, 0, 1, 2, 3, 4, 4])
        expect(s?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const cp4 = new Vector2d(0.3333333333333333, 1)
        const cp5 = new Vector2d(1, 0.3333333333333333)
        const sPer = s?.toPeriodicBSplineR1toR2withOpenKnotSequence();
        expect(sPer?.degree).to.eql(3)
        expect(sPer?.freeControlPoints.length).to.eql(5)
        // expect(sPer?.freeControlPoints).to.eql([cp4, cp5, cp3, cp0, cp1])
        const cpX = [0.3333333333333333, 1, 1, -1, -1, 0.3333333333333333, 1]
        const cpY = [1, 0.3333333333333333, -1, -1, 1, 1, 0.3333333333333333]
        if(sPer !== undefined) {
            for( let i = 0; i < sPer.freeControlPoints.length; i++) {
                expect(sPer.freeControlPoints[i].x).to.be.closeTo(cpX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sPer.freeControlPoints[i].y).to.be.closeTo(cpY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sPer?.controlPoints.length).to.eql(7)
        // expect(sPer?.controlPoints).to.eql([cp4, cp5, cp3, cp0, cp1, cp4, cp5])
        if(sPer !== undefined) {
            for( let i = 0; i < sPer.controlPoints.length; i++) {
                expect(sPer.controlPoints[i].x).to.be.closeTo(cpX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sPer.controlPoints[i].y).to.be.closeTo(cpY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sPer?.knots.length).to.eql(11)
        expect(sPer?.knots).to.eql([-2, -1, 0, 0, 1, 2, 3, 4, 4, 5, 6])

        expect(sPer?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        s?.insertKnotBoehmAlgorithm(0);
        expect(s?.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 4])
        expect(s?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        const cp6 = new Vector2d(0.66666666666666, 0.66666666666666)
        const sPer1 = s?.toPeriodicBSplineR1toR2withOpenKnotSequence();
        expect(sPer1?.degree).to.eql(3)
        expect(sPer1?.freeControlPoints.length).to.eql(6)
        // expect(sPer1?.freeControlPoints).to.eql([cp4, cp5, cp3, cp0, cp1])
        const cpX1 = [0.66666666666666, 1, 1, -1, -1, 0.3333333333333333, 0.66666666666666]
        const cpY1 = [0.66666666666666, 0.3333333333333333, -1, -1, 1, 1, 0.66666666666666]
        if(sPer1 !== undefined) {
            for( let i = 0; i < sPer1.freeControlPoints.length; i++) {
                expect(sPer1.freeControlPoints[i].x).to.be.closeTo(cpX1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sPer1.freeControlPoints[i].y).to.be.closeTo(cpY1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sPer1?.controlPoints.length).to.eql(7)
        // expect(sPer1?.controlPoints).to.eql([cp4, cp5, cp3, cp0, cp1, cp4, cp5])
        expect(sPer1?.knots.length).to.eql(11)
        expect(sPer1?.knots).to.eql([-1, 0, 0, 0, 1, 2, 3, 4, 4, 4, 5])
        console.log("p0 = " + sPer1?.evaluate(0).x + "  " + sPer1?.evaluate(0).y);
        console.log("p1 = " + sPer1?.evaluate(1).x + "  " + sPer1?.evaluate(1).y);
        console.log("p2 = " + sPer1?.evaluate(2).x + "  " + sPer1?.evaluate(2).y);
        console.log("p3 = " + sPer1?.evaluate(3).x + "  " + sPer1?.evaluate(3).y);

        expect(sPer1?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });
});