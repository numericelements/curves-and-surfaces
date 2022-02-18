import { expect } from 'chai';
import { PeriodicBSplineR1toR2DifferentialProperties } from '../../src/bsplines/PeriodicBSplineR1toR2DifferentialProperties';
import { create_PeriodicBSplineR1toR2 } from '../../src/bsplines/PeriodicBSplineR1toR2';
import { PeriodicBSplineR1toR1 } from '../../src/bsplines/PeriodicBSplineR1toR1';
import { BSplineR1toR1 } from '../../src/bsplines/BSplineR1toR1';
import { BernsteinDecompositionR1toR1 } from '../../src/bsplines/BernsteinDecompositionR1toR1';

describe('PeriodicBSplineR1toR2DifferentialProperties', () => {
    
    it('can be initialized with initializer', () => {

        const px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3
        const py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72
        const cps = [ [-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4], 
        [px0, py5], [px1, py4], [px2, py2], [px3, py0], 
        [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4], 
        [-px2, -py2], [-px3, py0], [-px2, py2] ]
        let cp1 = []
        for (let cp of cps) {
            cp1.push([cp[1], -cp[0]])
        }
        const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        let spline = create_PeriodicBSplineR1toR2(cp1, knots)

        const s = new PeriodicBSplineR1toR2DifferentialProperties(spline)

        let cn = s.curvatureNumerator()

    });

    it('can executes the expensive computation correctly', () => {

        const px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3
        const py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72
        const cps = [ [-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4], 
        [px0, py5], [px1, py4], [px2, py2], [px3, py0], 
        [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4], 
        [-px2, -py2], [-px3, py0], [-px2, py2] ]
        let cp1 = []
        for (let cp of cps) {
            cp1.push([cp[1], -cp[0]])
        }
        const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        let spline = create_PeriodicBSplineR1toR2(cp1, knots)

        let dp = new PeriodicBSplineR1toR2DifferentialProperties(spline)

        //let ec = dp.expensiveComputation(spline)

        const sx = new PeriodicBSplineR1toR1(spline.getControlPointsX(), spline.knots) 
        const sy = new PeriodicBSplineR1toR1(spline.getControlPointsY(), spline.knots)
        const sxu = sx.derivative()
        const syu = sy.derivative()
        const sxuu = sxu.derivative()
        const syuu = syu.derivative()
        const sxuuu = sxuu.derivative()
        const syuuu = syuu.derivative()
        const bdsxu = sxu.bernsteinDecomposition()
        const bdsyu = syu.bernsteinDecomposition()
        const bdsxuu = sxuu.bernsteinDecomposition()
        const bdsyuu = syuu.bernsteinDecomposition()
        const bdsxuuu = sxuuu.bernsteinDecomposition()
        const bdsyuuu = syuuu.bernsteinDecomposition()
        const h1 = (bdsxu.multiply(bdsxu)).add((bdsyu.multiply(bdsyu)))
        const h2 = (bdsxu.multiply(bdsyuuu)).subtract((bdsyu.multiply(bdsxuuu)))
        const h3 = (bdsxu.multiply(bdsxuu)).add((bdsyu.multiply(bdsyuu)))
        const h4 = (bdsxu.multiply(bdsyuu)).subtract((bdsyu.multiply(bdsxuu)))


    });
    



});