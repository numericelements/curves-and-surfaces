import { expect } from "chai";
import { PeriodicBSplineR1toR2 } from "../../src/newBsplines/PeriodicBSplineR1toR2";
import { Vector2d } from "../../src/mathVector/Vector2d";

describe('PeriodicBSplineR1toR2', () => {
    
    it('can be initialized without an initializer', () => {
        const s = new PeriodicBSplineR1toR2();
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
        const s = new PeriodicBSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11, cp12, cp13, cp14 ], knots)
        expect(s.controlPoints).to.eql([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11, cp12, cp13, cp14 ])
        expect(s.knots).to.eql(knots)
        expect(s.degree).to.equal(3)
    });

    it('can generate intermediate splines for degree elevation. Case of curve with uniform knot sequence', () => {
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
        const s = new PeriodicBSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11, cp12, cp13, cp14 ], knots)
        const intermSplines = s.generateIntermediateSplinesForDegreeElevation();
        expect(intermSplines.knotVectors.length).to.eql(4)
        expect(intermSplines.CPs.length).to.eql(4)
        const knots0 = [-3, -2, -1, 0, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 12, 13, 14, 15]
        expect(intermSplines.knotVectors[0].length).to.eql(23)
        expect(intermSplines.knotVectors[0]).to.eql(knots0)
        const knots1 = [-3, -2, -1, 0, 1, 1, 2, 3, 3, 4, 5, 5, 6, 7, 8, 9, 9, 10, 11, 11, 12, 13, 14, 15]
        expect(intermSplines.knotVectors[1].length).to.eql(24)
        expect(intermSplines.knotVectors[1]).to.eql(knots1)
        const knots2 = [-3, -2, -1, 0, 1, 2, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15]
        expect(intermSplines.knotVectors[2].length).to.eql(22)
        expect(intermSplines.knotVectors[2]).to.eql(knots2)
        const knots3 = [-3, -2, -1, 0, 1, 1, 2, 3, 3, 4, 5, 6, 7, 7, 8, 9, 9, 10, 11, 11, 12, 13, 14, 15]
        expect(intermSplines.knotVectors[3].length).to.eql(24)
        expect(intermSplines.knotVectors[3]).to.eql(knots3)
        const CP0 = [ cp0, cp1, cp2, cp3, cp3, cp4, cp5, cp6, cp7, cp7, cp8, cp9, cp10, cp11, cp11, cp12, cp13, cp14, cp3 ];
        expect(intermSplines.CPs[0].length).to.eql(19)
        expect(intermSplines.CPs[0]).to.eql(CP0)
        const CP1 = [ cp0, cp1, cp2, cp3, cp4, cp4, cp5, cp6, cp6, cp7, cp8, cp8, cp9, cp10, cp11, cp12, cp12, cp13, cp14, cp14 ];
        expect(intermSplines.CPs[1].length).to.eql(20)
        expect(intermSplines.CPs[1]).to.eql(CP1)
        const CP2 = [ cp0, cp1, cp2, cp3, cp4, cp5, cp5, cp6, cp7, cp8, cp9, cp9, cp10, cp11, cp12, cp13, cp13, cp14];
        expect(intermSplines.CPs[2].length).to.eql(18)
        expect(intermSplines.CPs[2]).to.eql(CP2)
        const CP3 = [ cp0, cp1, cp2, cp3, cp4, cp4, cp5, cp6, cp6, cp7, cp8, cp9, cp10, cp10, cp11, cp12, cp12, cp13, cp14, cp14];
        expect(intermSplines.CPs[3].length).to.eql(20)
        expect(intermSplines.CPs[3]).to.eql(CP3)
    });

    it('can increment the degree of a uniform periodic BSpline.', () => {
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
        const s = new PeriodicBSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11, cp12, cp13, cp14 ], knots)
        const splineHigherDegree = s.degreeIncrement();
        expect(splineHigherDegree.degree).to.eql(4)
        const newKnots = [-3, -2, -1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 14, 15]
        expect(splineHigherDegree.knots.length).to.eql(32)
        expect(splineHigherDegree.knots).to.eql(newKnots)
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
        let s = new PeriodicBSplineR1toR2([ cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9, cp10, cp11, cp12, cp13, cp14 ], knots)
        expect(s.degree).to.eql(3)
        let rBound = s.findKnotAbscissaeRightBound();
        expect(rBound).to.eql(12)
        const cp = new Vector2d(0.0, 1.0)
        knots = [-3, -2, -1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 14, 15]
        s = new PeriodicBSplineR1toR2([ cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp], knots)
        expect(s.degree).to.eql(3)
        rBound = s.findKnotAbscissaeRightBound();
        expect(rBound).to.eql(12)
        knots = [-2, -1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 14]
        s = new PeriodicBSplineR1toR2([ cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp, cp], knots)
        expect(s.degree).to.eql(3)
        rBound = s.findKnotAbscissaeRightBound();
        expect(rBound).to.eql(12)
    });
});