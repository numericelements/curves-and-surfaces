import { expect } from "chai";
import { Vector2d } from "../../src/mathVector/Vector2d";
import { TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2 } from "./BSplineR1toR2";
import { PeriodicBSplineR1toR2 } from "../../src/newBsplines/PeriodicBSplineR1toR2";
import { basisFunctionsFromSequence } from "../../src/newBsplines/Piegl_Tiller_NURBS_Book";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "../../src/newBsplines/IncreasingPeriodicKnotSequenceClosedCurve";

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

    it('can evaluate a periodic B-Spline with an arbitrary knot sequence at a point u', () => {
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
        expect(spline?.evaluate(0).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(0).y).to.be.closeTo(-0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(1).x).to.be.closeTo(0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(1).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(2).x).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(2).y).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(3).x).to.be.closeTo(1, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(spline?.evaluate(3).y).to.be.closeTo(0.5, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
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
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 1)
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        const intermSplineKnots = s?.generateIntermediateSplinesForDegreeElevation();
        const knots0 = [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6]
        const knots1 = [0, 1, 1, 2, 3, 3, 4, 5, 5, 6]
        expect(intermSplineKnots?.knotVectors[0]).to.eql(knots0)
        expect(intermSplineKnots?.knotVectors[1]).to.eql(knots1)
        expect(intermSplineKnots?.CPs[0]).to.eql([cp0, cp0, cp1, cp2, cp2, cp3, cp4, cp4, cp5])
        expect(intermSplineKnots?.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp3, cp4, cp5, cp5])
        const s0 = PeriodicBSplineR1toR2.create([cp0, cp0, cp1, cp2, cp2, cp3, cp4, cp4, cp5], knots0, 2)
        s0?.insertKnotBoehmAlgorithm(1)
        s0?.insertKnotBoehmAlgorithm(3)
        s0?.insertKnotBoehmAlgorithm(5)
        console.log("p0= ", s0?.evaluate(0))
        console.log("p1= ", s0?.evaluate(1))
        console.log("p2= ", s0?.evaluate(2))
        console.log("p3= ", s0?.evaluate(3))
        console.log("p4= ", s0?.evaluate(4))
        console.log("p5= ", s0?.evaluate(5))
        console.log("p05= ", s0?.evaluate(0.5))
        console.log("p15= ", s0?.evaluate(1.5))
        console.log("p25= ", s0?.evaluate(2.5))
        console.log("p35= ", s0?.evaluate(3.5))
        console.log("p45= ", s0?.evaluate(4.5))
        console.log("p55= ", s0?.evaluate(5.5))
        const s1 = PeriodicBSplineR1toR2.create([cp0, cp1, cp1, cp2, cp3, cp3, cp4, cp5, cp5], knots1, 2)
        s1?.insertKnotBoehmAlgorithm(0)
        s1?.insertKnotBoehmAlgorithm(2)
        s1?.insertKnotBoehmAlgorithm(4)
        console.log("p0= ", s1?.evaluate(0))
        console.log("p1= ", s1?.evaluate(1))
        console.log("p2= ", s1?.evaluate(2))
        console.log("p3= ", s1?.evaluate(3))
        console.log("p4= ", s1?.evaluate(4))
        console.log("p5= ", s1?.evaluate(5))
        console.log("p05= ", s1?.evaluate(0.5))
        console.log("p15= ", s1?.evaluate(1.5))
        console.log("p25= ", s1?.evaluate(2.5))
        console.log("p35= ", s1?.evaluate(3.5))
        console.log("p45= ", s1?.evaluate(4.5))
        console.log("p55= ", s1?.evaluate(5.5))
        const newSpline = s?.degreeIncrement();
        const point0 = newSpline?.evaluate(0)
        const point1 = newSpline?.evaluate(1)
        const point2 = newSpline?.evaluate(2)
        const point3 = newSpline?.evaluate(3)
        const point4 = newSpline?.evaluate(4)
        const point5 = newSpline?.evaluate(5)
        expect(newSpline?.degree).to.eql(2)
        expect(newSpline?.knots.length).to.eql(14)
        expect(newSpline?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6])
        expect(newSpline?.freeControlPoints.length).to.eql(11)

        const cp6 = new Vector2d(0, 0.5)
        const cp7 = new Vector2d(0.5, 1)
        const cp8 = new Vector2d(1, 0.5)
        const cp9 = new Vector2d(1, -0.5)
        const cp10 = new Vector2d(0.5, -1)
        const cp11 = new Vector2d(0, -0.5)
        const test = PeriodicBSplineR1toR2.create([cp0, cp6, cp6, cp1, cp2, cp8, cp8, cp3, cp4, cp10, cp10, cp5], [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6], 2)
        const p0 = test?.evaluate(0)
        // expect(p0).to.eql(new Vector2d(0, -1))
        const p1 = test?.evaluate(1)
        // expect(p1).to.eql(new Vector2d(0, 0.5))
        const p2 = test?.evaluate(2)
        // expect(p2).to.eql(new Vector2d(0, 1))
        const p3 = test?.evaluate(3)
        // expect(p3).to.eql(new Vector2d(1, 0.5))
        const p4 = test?.evaluate(4)
        // expect(p4).to.eql(new Vector2d(1, 0))
        const p5 = test?.evaluate(5)
        // expect(p5).to.eql(new Vector2d(0.5, -1))
        console.log("p0= ", p0)
        console.log("p1= ", p1)
        console.log("p2= ", p2)
        console.log("p3= ", p3)
        console.log("p4= ", p4)
        console.log("p5= ", p5)
        console.log("p05= ", test?.evaluate(0.5))
        console.log("p15= ", test?.evaluate(1.5))
        console.log("p25= ", test?.evaluate(2.5))
        console.log("p35= ", test?.evaluate(3.5))
        console.log("p45= ", test?.evaluate(4.5))
        console.log("p55= ", test?.evaluate(5.5))
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
        const intermSplineKnots = s?.generateIntermediateSplinesForDegreeElevation();
        const knots0 = [0, 0, 1, 2, 3, 3, 4, 5, 6, 6]
        const knots1 = [0, 1, 1, 2, 3, 4, 4, 5, 6]
        const knots2 = [0, 1, 2, 2, 3, 4, 5, 5, 6]
        expect(intermSplineKnots?.knotVectors[0]).to.eql(knots0)
        expect(intermSplineKnots?.knotVectors[1]).to.eql(knots1)
        expect(intermSplineKnots?.knotVectors[2]).to.eql(knots2)
        expect(intermSplineKnots?.CPs[0]).to.eql([cp0, cp0, cp1, cp2, cp3, cp3, cp4, cp5])
        expect(intermSplineKnots?.CPs[1]).to.eql([cp0, cp1, cp1, cp2, cp3, cp4, cp4, cp5])
        expect(intermSplineKnots?.CPs[2]).to.eql([cp0, cp1, cp2, cp2, cp3, cp4, cp5, cp5])
        const s0 = PeriodicBSplineR1toR2.create([cp0, cp0, cp1, cp2, cp3, cp3, cp4, cp5], knots0, 3)
        const newSpline = s?.degreeIncrement();
        expect(newSpline?.degree).to.eql(3)
        expect(newSpline?.knots.length).to.eql(14)
        expect(newSpline?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6])
        expect(newSpline?.freeControlPoints.length).to.eql(11)
        // const cpX = [0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0, 0]
        // const cpY = [0, 0.5, 1, 1, 1, 0.5, 0, -0.5, -1, -1, -1, -0.5]
        // if(newSpline !== undefined) {
        //     for( let i = 0; i < newSpline.freeControlPoints.length; i++) {
        //         expect(newSpline.freeControlPoints[i].x).to.eql(cpX[i])
        //         expect(newSpline.freeControlPoints[i].y).to.eql(cpY[i])
        //     }
        // }

        // const s1 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        // expect(s1?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        // s1?.insertKnotBoehmAlgorithm(3);
        // expect(s1?.freeControlPoints.length).to.eql(7)
        // expect(s1?.knots.length).to.eql(8)
        // expect(s1?.knots).to.eql([0, 1, 2, 3, 3, 4, 5, 6])
        // const cpX1 = [0, 0, 0.5, 1, 1, 1, 0]
        // const cpY1 = [0, 1, 1, 1, 0, -1, -1]
        // if(s1 !== undefined) {
        //     for( let i = 0; i < s1.freeControlPoints.length; i++) {
        //         expect(s1.freeControlPoints[i].x).to.eql(cpX1[i])
        //         expect(s1.freeControlPoints[i].y).to.eql(cpY1[i])
        //     }
        // }
        // const s2 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        // expect(s2?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        // s2?.insertKnotBoehmAlgorithm(2);
        // expect(s2?.freeControlPoints.length).to.eql(7)
        // expect(s2?.knots.length).to.eql(8)
        // expect(s2?.knots).to.eql([0, 1, 2, 2, 3, 4, 5, 6])
        // const cpX2 = [0, 0, 0, 1, 1, 1, 0]
        // const cpY2 = [0, 0.5, 1, 1, 0, -1, -1]
        // if(s2 !== undefined) {
        //     for( let i = 0; i < s2.freeControlPoints.length; i++) {
        //         expect(s2.freeControlPoints[i].x).to.eql(cpX2[i])
        //         expect(s2.freeControlPoints[i].y).to.eql(cpY2[i])
        //     }
        // }
        // const s3 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        // expect(s3?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        // s3?.insertKnotBoehmAlgorithm(1);
        // expect(s3?.freeControlPoints.length).to.eql(7)
        // expect(s3?.knots.length).to.eql(8)
        // expect(s3?.knots).to.eql([0, 1, 1, 2, 3, 4, 5, 6])
        // const cpX3 = [0, 0, 1, 1, 1, 0, 0]
        // const cpY3 = [0, 1, 1, 0, -1, -1, -0.5]
        // if(s3 !== undefined) {
        //     for( let i = 0; i < s3.freeControlPoints.length; i++) {
        //         expect(s3.freeControlPoints[i].x).to.eql(cpX3[i])
        //         expect(s3.freeControlPoints[i].y).to.eql(cpY3[i])
        //     }
        // }
        // const s4 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        // expect(s4?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        // s4?.insertKnotBoehmAlgorithm(5);
        // expect(s4?.freeControlPoints.length).to.eql(7)
        // expect(s4?.knots.length).to.eql(8)
        // expect(s4?.knots).to.eql([0, 1, 2, 3, 4, 5, 5, 6])
        // const cpX4 = [0, 0, 1, 1, 1, 1, 0]
        // const cpY4 = [0, 1, 1, 0, -0.5, -1, -1]
        // if(s4 !== undefined) {
        //     for( let i = 0; i < s4.freeControlPoints.length; i++) {
        //         expect(s4.freeControlPoints[i].x).to.eql(cpX4[i])
        //         expect(s4.freeControlPoints[i].y).to.eql(cpY4[i])
        //     }
        // }
        // const s5 = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5], knots, 2)
        // expect(s5?.freeControlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5])
        // s5?.insertKnotBoehmAlgorithm(0);
        // expect(s5?.freeControlPoints.length).to.eql(7)
        // expect(s5?.knots.length).to.eql(9)
        // expect(s5?.knots).to.eql([0, 0, 1, 2, 3, 4, 5, 6, 6])
        // const cpX5 = [0, 0, 1, 1, 1, 0.5, 0]
        // const cpY5 = [0, 1, 1, 0, -1, -1, -1]
        // if(s5 !== undefined) {
        //     for( let i = 0; i < s5.freeControlPoints.length; i++) {
        //         expect(s5.freeControlPoints[i].x).to.eql(cpX5[i])
        //         expect(s5.freeControlPoints[i].y).to.eql(cpY5[i])
        //     }
        // }
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
        const knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        const s = PeriodicBSplineR1toR2.create([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11], knots, 3)
        const newSpline = s?.degreeIncrement();
        expect(newSpline?.degree).to.eql(4)
        expect(newSpline?.knots.length).to.eql(26)
        expect(newSpline?.knots).to.eql([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12])
        expect(newSpline?.freeControlPoints.length).to.eql(23)
        const cpX = [-0.27, -0.275, -0.28, -0.2704166666666667, -0.23625000000000002, -0.19500000000000003,
            -0.12875, -0.037500000000000006, 0.04375, 0.11666666666666667, 0.18125, 0.21791666666666668,
            0.255, 0.28125, 0.29125, 0.26875000000000004, 0.235, 0.18305555555555558,
            0.14416666666666667, 0.09666666666666666, 0.05, -0.027083333333333327, -0.08124999999999999]
        const cpY = [-0.35, -0.2916666666666666, 0.02916666666666666, 0.21041666666666664, 0.3604166666666666, 0.48624999999999996,
            0.6041666666666666, 0.6666666666666666, 0.685, 0.6052777777777778, 0.5108333333333333, 0.42652777777777784,
            0.28541666666666665, 0.14166666666666666, -0.04375, -0.25277777777777777, -0.4229166666666666, -0.5222222222222221,
            -0.5854166666666667, -0.63625, -0.6799999999999999, -0.6583333333333333, -0.6549999999999999]
        if(newSpline !== undefined) {
            for( let i = 0; i < newSpline.freeControlPoints.length; i++) {
                expect(newSpline.freeControlPoints[i].x).to.be.closeTo(cpX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(newSpline.freeControlPoints[i].y).to.be.closeTo(cpY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
    });
    
});