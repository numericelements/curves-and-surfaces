import { expect } from 'chai';
import { BSpline_R1_to_R2_DifferentialProperties } from '../src/mathematics/BSpline_R1_to_R2_DifferentialProperties';
import { create_BSpline_R1_to_R2 } from '../src/mathematics/BSpline_R1_to_R2';

describe('BSpline_R1_to_R2_DifferentialProperties', () => {
    
    it('can compute curvature extrema', () => {
        const cp = [ [-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        const spline = create_BSpline_R1_to_R2(cp, knots)
        spline.insertKnot(0.5)
        const splineDP = new BSpline_R1_to_R2_DifferentialProperties(spline)
        const curvatureExtrema = splineDP.curvatureExtrema()
        expect(curvatureExtrema.length).to.equal(1)

        
    });
    


});