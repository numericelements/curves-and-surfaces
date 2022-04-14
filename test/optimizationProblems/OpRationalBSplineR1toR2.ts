import { expect } from 'chai';
import { OpBSplineR1toR2} from '../../src/optimizationProblems/OpBSplineR1toR2';
import { create_BSplineR1toR2, BSplineR1toR2 } from '../../src/bsplines/R1toR2/BSplineR1toR2';
import { zeroVector, containsNaN } from '../../src/linearAlgebra/MathVectorBasicOperations';
import { identityMatrix } from '../../src/linearAlgebra/DiagonalMatrix';
import { Vector2d } from '../../src/mathVector/Vector2d';
import { ActiveControl } from '../../src/optimizationProblems/BaseOpBSplineR1toR2';
import { OpRationalBSplineR1toR2 } from '../../src/optimizationProblems/OpRationalBSplineR1toR2';
import { create_BSplineR1toR3 } from '../../src/bsplines/R1toR3/BSplineR1toR3';
import { create_RationalBSplineR1toR2 } from '../../src/bsplines/R1toR2/RationalBSplineR1toR2';
import { computeDerivatives, ComputeChenTerms } from '../../src/optimizationProblems/BaseOpRationalBSplineR1toR2';
import { BernsteinDecompositionR1toR1, determinant2by2 } from '../../src/bsplines/R1toR1/BernsteinDecompositionR1toR1';
import { BSplineR1toR1 } from '../../src/bsplines/R1toR1/BSplineR1toR1';




describe('OpRationalBSplineR1toR2', () => {

    it('has a number of independent variables equal to three time the number of control points', () => {
        let splineTarget = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpRationalBSplineR1toR2(splineTarget, splineInitial)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.controlPoints.length * 3)
    });

    
    it('has a zero value objective function for a spline that is identical to the target', () => {
        let splineTarget = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpRationalBSplineR1toR2(splineTarget, splineInitial)
        expect( o.f0 ).to.equal(0)
        let deltaX = zeroVector(splineInitial.controlPoints.length * 3)
        o.step(deltaX)
        expect( o.f0 ).to.equal(0)
    });



    /*
    it('returns an identity matrix for its objective function hessian', () => {
        let splineTarget = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblemRationalBSplineR1toR2(splineTarget, splineInitial)
        expect(o.hessian_f0).to.deep.equal(identityMatrix(splineInitial.controlPoints.length * 3))
    });
    */

    it('returns inflection gradient matrix of correct shape', () => {
        let splineTarget = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpRationalBSplineR1toR2(splineTarget, splineInitial, ActiveControl.inflections)
        const gradient_f = o.gradient_f
        expect(gradient_f.shape).to.deep.equal([7, 12])

    });

    it('can handle a spline with an interior knot', () => {
        let splineTarget = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0, 8, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let splineInitial = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0, 8, 1],  [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OpRationalBSplineR1toR2(splineTarget, splineInitial)
        const gradient_f = o.gradient_f
        expect(gradient_f.shape).to.deep.equal([41, 15])

    });



    it('returns gradient_f such that a dot product of a rigid motion equal zero', () => {
        let splineTarget = create_RationalBSplineR1toR2([[-0.5, 0, 2], [-0.25, 0.5, 0.5], [0.25, 0.2, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_RationalBSplineR1toR2([[-0.5, 0, 2], [-0.25, 0.5, 0.5], [0.25, 0.2, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        splineTarget.elevateDegree()
        splineInitial.elevateDegree()
        
        splineInitial.insertKnot(0.1)
        splineTarget.insertKnot(0.1)
        splineInitial.insertKnot(0.2)
        splineTarget.insertKnot(0.2)
        splineInitial.insertKnot(0.3)
        splineTarget.insertKnot(0.3)
        
        let o = new OpRationalBSplineR1toR2(splineTarget, splineInitial, ActiveControl.curvatureExtrema)
        let max = 0
        for (let i = 0; i < o.gradient_f.shape[0]; i += 1) {
            let temp = 0
            for (let j = 0; j < o.gradient_f.shape[1] * 1 / 3; j += 1) {
                temp += o.gradient_f.get(i, j) * o.spline.controlPoints[j].z
                temp += o.gradient_f.get(i, o.gradient_f.shape[1] * 1 / 3 + j) * o.spline.controlPoints[j].z
            }
            if (Math.abs(temp) > max) {
                max = Math.abs(temp)
            }
        }
        expect(max).to.be.below(10e-8)
    });
    
    





});