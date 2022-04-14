import { expect } from 'chai';
import { BSplineR1toR2 } from '../../../src/bsplines/R1toR2/BSplineR1toR2';
import { BSplineR1toR2DifferentialProperties } from '../../../src/bsplines/R1toR2/BSplineR1toR2DifferentialProperties';
import { Vector2d } from '../../../src/mathVector/Vector2d';

describe('BSplineR1toR2DifferentialProperties', () => {
    
    it('can be initialized with initializer', () => {

        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.1, 0.5)
        const cp2 = new Vector2d(0.1, 0.5)
        const cp3 = new Vector2d(0.5, 0)

        let spline = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])
        const s = new BSplineR1toR2DifferentialProperties(spline)
        let cn = s.curvatureNumerator()
    });
    



});