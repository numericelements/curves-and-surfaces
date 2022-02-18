import { expect } from 'chai';
import { BernsteinDecompositionR1toR1 } from '../../src/bsplines/BernsteinDecompositionR1toR1';
import { BSplineR1toR1 } from '../../src/bsplines/BSplineR1toR1';
import { create_BSplineR1toR2 } from '../../src/bsplines/BSplineR1toR2';
import { PeriodicBSplineR1toR1 } from '../../src/bsplines/PeriodicBSplineR1toR1';
import { create_PeriodicBSplineR1toR2 } from '../../src/bsplines/PeriodicBSplineR1toR2';

describe('BSplineR1toR1', () => {
    
    it('can be initialized without an initializer', () => {
        const s = new PeriodicBSplineR1toR1()
        expect(s.degree).to.equal(0)
    });
    
    it('can be used to evaluate a Bernstein polynomial', () => {
        const u = 0.22
        const a = 1.1
        const b = 3.2
        const c = 6.3
        const b02 = Math.pow(1-u, 2)
        const b12 = 2*u*(1-u)
        const b22 = Math.pow(u, 2)
        const s = new PeriodicBSplineR1toR1([ a, b, c ], [ 0, 0, 0, 1, 1, 1 ])
        expect(a*b02+b*b12+c*b22).to.equal(s.evaluate(u))
        expect(s.degree).to.equal(2)
    });

    it('can return its Bernstein decomposition', () => {
        const px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3
        const py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72
        const cp = [ [-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4], 
        [px0, py5], [px1, py4], [px2, py2], [px3, py0], 
        [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4], 
        [-px2, -py2], [-px3, py0], [-px2, py2] ]
        let cp1 = []
        for (let cpi of cp) {
            cp1.push([cpi[1], -cpi[0]])
        }
        const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        let spline = create_BSplineR1toR2(cp1, knots)
        let periodicSpline = create_PeriodicBSplineR1toR2(cp1, knots)
        const sx = new PeriodicBSplineR1toR1(periodicSpline.getControlPointsX(), periodicSpline.knots) 
        const sy = new PeriodicBSplineR1toR1(periodicSpline.getControlPointsY(), periodicSpline.knots)

        const bdsx = sx.bernsteinDecomposition()
        const bdsy = sx.bernsteinDecomposition()

        spline.clamp(spline.knots[3])
        spline.clamp(spline.knots[spline.knots.length - 3 - 1])
        
    });

});