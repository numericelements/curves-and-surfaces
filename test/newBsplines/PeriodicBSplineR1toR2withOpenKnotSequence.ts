import { expect } from "chai";
import { PeriodicBSplineR1toR2withOpenKnotSequence } from "../../src/newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence";
import { Vector2d } from "../../src/mathVector/Vector2d";
import { TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2 } from "./BSplineR1toR2";

describe('PeriodicBSplineR1toR2withOpenKnotSequence', () => {
    
    it('can be initialized without an initializer', () => {
        const s = new PeriodicBSplineR1toR2withOpenKnotSequence();
        expect(s.controlPoints[0]).to.eql(new Vector2d(0, 0))
        expect(s.knots).to.eql([0, 1])
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
        const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        const s = new PeriodicBSplineR1toR2withOpenKnotSequence([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11, cp12, cp13, cp14 ], knots)
        expect(s.controlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11, cp12, cp13, cp14 ])
        expect(s.knots).to.eql(knots)
        expect(s.degree).to.equal(3)
    });

    it('can find the right bound of the definition interval of a periodic BSpline.', () => {
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
        const cpCrv = [ [-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4], 
                    [px0, py5], [px1, py4], [px2, py2], [px3, py0], 
                    [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4], 
                    [-px2, -py2], [-px3, py0], [-px2, py2] ];
        let knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        let s = new PeriodicBSplineR1toR2withOpenKnotSequence([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11, cp12, cp13, cp14 ], knots)
        expect(s.degree).to.eql(3)
        let rBound = s.findKnotAbscissaeRightBound();
        expect(rBound).to.eql(12)
        const cp = new Vector2d(0.0, 1.0)
        knots = [-3, -2, -1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 14, 15]
        s = new PeriodicBSplineR1toR2withOpenKnotSequence([ cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp], knots)
        expect(s.degree).to.eql(3)
        rBound = s.findKnotAbscissaeRightBound();
        expect(rBound).to.eql(12)
        knots = [-2, -1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 14]
        s = new PeriodicBSplineR1toR2withOpenKnotSequence([ cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp], knots)
        expect(s.degree).to.eql(3)
        rBound = s.findKnotAbscissaeRightBound();
        expect(rBound).to.eql(12)
    });

    it('can convert a periodic BSpline with open knot sequence to a periodic BSpline.', () => {
        // triangular control polygon
        const cp0 = new Vector2d(0, 0)
        const cp1 = new Vector2d(-1, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(0, 0)
        const knots = [-1, 0, 0, 0, 1, 1, 1, 2]
        const s = new PeriodicBSplineR1toR2withOpenKnotSequence([ cp0, cp1, cp2, cp3], knots)
        expect(s?.controlPoints).to.eql([ cp0, cp1, cp2, cp3])
        expect(s?.freeControlPoints).to.eql([ cp0, cp1, cp2])
        expect(s?.evaluate(0).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(1).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        expect(s?.evaluate(0.5).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(s?.evaluate(0.5).y).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sPeriodic = s?.toPeriodicBSplineR1toR2();
        expect(sPeriodic?.degree).to.eql(3);
        expect(sPeriodic?.controlPoints.length).to.eql(3)
        expect(sPeriodic?.controlPoints).to.eql([cp0, cp1, cp2]);
        expect(sPeriodic?.knots.length).to.eql(6);
        expect(sPeriodic?.knots).to.eql([0, 0, 0, 1, 1, 1]);
        expect(sPeriodic?.evaluate(0).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPeriodic?.evaluate(0).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPeriodic?.evaluate(1).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPeriodic?.evaluate(1).y).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        expect(sPeriodic?.evaluate(0.5).x).to.be.closeTo(0.0, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPeriodic?.evaluate(0.5).y).to.be.closeTo(0.75, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
    });

    it('can convert a periodic B-Spline with open knot sequence into a periodic BSpline. Case of variable multiplicity at curve origin', () => {
        // rectangular control polygon
        const cp0 = new Vector2d(-1, -1)
        const cp1 = new Vector2d(-1, 1)
        const cp2 = new Vector2d(1, 1)
        const cp3 = new Vector2d(1, -1)
        const cp4 = new Vector2d(0.3333333333333333, 1)
        const cp5 = new Vector2d(1, 0.3333333333333333)
        const cp6 = new Vector2d(0.66666666666666, 0.66666666666666)
        const knots = [-1, 0, 0, 0, 1, 2, 3, 4, 4, 4, 5]
        const sOpenKnotSeq = new PeriodicBSplineR1toR2withOpenKnotSequence([cp6, cp5, cp3, cp0, cp1, cp4, cp6], knots)
        expect(sOpenKnotSeq.degree).to.eql(3)
        expect(sOpenKnotSeq.freeControlPoints).to.eql([cp6, cp5, cp3, cp0, cp1, cp4])
        expect(sOpenKnotSeq.knots).to.eql([-1, 0, 0, 0, 1, 2, 3, 4, 4, 4, 5])

        expect(sOpenKnotSeq?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sPer = sOpenKnotSeq?.toPeriodicBSplineR1toR2();
        expect(sPer?.degree).to.eql(3)
        expect(sPer?.freeControlPoints.length).to.eql(6)
        // expect(sPer?.freeControlPoints).to.eql([cp0, cp1, cp4, cp6, cp5, cp3])
        const cpX = [-1, -1, 0.333333333333333, 0.66666666666666, 1, 1]
        const cpY = [-1, 1, 1, 0.66666666666666, 0.333333333333333, -1]
        if(sPer !== undefined) {
            for( let i = 0; i < sPer.freeControlPoints.length; i++) {
                expect(sPer.freeControlPoints[i].x).to.be.closeTo(cpX[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sPer.freeControlPoints[i].y).to.be.closeTo(cpY[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sPer?.controlPoints.length).to.eql(6)
        expect(sPer?.knots.length).to.eql(9)
        expect(sPer?.knots).to.eql([0, 0, 0, 1, 2, 3, 4, 4, 4])

        expect(sPer?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const knots1 = [-2, -1, 0, 0, 1, 2, 3, 4, 4, 5, 6]
        const sOpenKnotSeq1 = new PeriodicBSplineR1toR2withOpenKnotSequence([cp4, cp5, cp3, cp0, cp1, cp4, cp5], knots1)
        expect(sOpenKnotSeq1.degree).to.eql(3)
        expect(sOpenKnotSeq1.freeControlPoints).to.eql([cp4, cp5, cp3, cp0, cp1])
        expect(sOpenKnotSeq1.knots).to.eql([-2, -1, 0, 0, 1, 2, 3, 4, 4, 5, 6])

        expect(sOpenKnotSeq1?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq1?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq1?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq1?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq1?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq1?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq1?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq1?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sPer1 = sOpenKnotSeq1?.toPeriodicBSplineR1toR2();
        expect(sPer1?.degree).to.eql(3)
        expect(sPer1?.freeControlPoints.length).to.eql(5)
        expect(sPer1?.freeControlPoints).to.eql([cp0, cp1, cp4, cp5, cp3])
        const cpX1 = [-1, -1, 0.333333333333333,1, 1]
        const cpY1 = [-1, 1, 1, 0.333333333333333, -1]
        if(sPer1 !== undefined) {
            for( let i = 0; i < sPer1.freeControlPoints.length; i++) {
                expect(sPer1.freeControlPoints[i].x).to.be.closeTo(cpX1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sPer1.freeControlPoints[i].y).to.be.closeTo(cpY1[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sPer1?.controlPoints.length).to.eql(5)
        expect(sPer1?.knots.length).to.eql(7)
        expect(sPer1?.knots).to.eql([0, 0, 1, 2, 3, 4, 4])

        expect(sPer1?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sPer1?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const knots2 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const sOpenKnotSeq2 = new PeriodicBSplineR1toR2withOpenKnotSequence([cp1, cp2, cp3, cp0, cp1, cp2, cp3], knots2)
        expect(sOpenKnotSeq2.degree).to.eql(3)
        expect(sOpenKnotSeq2.freeControlPoints).to.eql([cp1, cp2, cp3, cp0])
        expect(sOpenKnotSeq2.knots).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7])

        expect(sOpenKnotSeq2?.evaluate(0).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq2?.evaluate(0).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq2?.evaluate(1).x).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq2?.evaluate(1).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq2?.evaluate(2).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq2?.evaluate(2).y).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq2?.evaluate(3).x).to.be.closeTo(-0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
        expect(sOpenKnotSeq2?.evaluate(3).y).to.be.closeTo(0.66666666666666, TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)

        const sPer2 = sOpenKnotSeq2?.toPeriodicBSplineR1toR2();
        expect(sPer2?.degree).to.eql(3)
        expect(sPer2?.freeControlPoints.length).to.eql(4)
        expect(sPer2?.freeControlPoints).to.eql([cp0, cp1, cp2, cp3])
        const cpX2 = [-1, -1, 1, 1]
        const cpY2 = [-1, 1, 1, -1]
        if(sPer2 !== undefined) {
            for( let i = 0; i < sPer2.freeControlPoints.length; i++) {
                expect(sPer2.freeControlPoints[i].x).to.be.closeTo(cpX2[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
                expect(sPer2.freeControlPoints[i].y).to.be.closeTo(cpY2[i], TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2)
            }
        }
        expect(sPer2?.controlPoints.length).to.eql(4)
        expect(sPer2?.knots.length).to.eql(5)
        expect(sPer2?.knots).to.eql([0, 1, 2, 3, 4])

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