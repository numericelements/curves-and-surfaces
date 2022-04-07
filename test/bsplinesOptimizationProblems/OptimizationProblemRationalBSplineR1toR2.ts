import { expect } from 'chai';
import { OptimizationProblemBSplineR1toR2} from '../../src/bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR2';
import { create_BSplineR1toR2, BSplineR1toR2 } from '../../src/bsplines/BSplineR1toR2';
import { zeroVector, containsNaN } from '../../src/linearAlgebra/MathVectorBasicOperations';
import { identityMatrix } from '../../src/linearAlgebra/DiagonalMatrix';
import { Vector2d } from '../../src/mathVector/Vector2d';
import { ActiveControl } from '../../src/bsplinesOptimizationProblems/AbstractOptimizationProblemBSplineR1toR2';
import { OptimizationProblemRationalBSplineR1toR2 } from '../../src/bsplinesOptimizationProblems/OptimizationProblemRationalBSplineR1toR2';
import { create_BSplineR1toR3 } from '../../src/bsplines/BSplineR1toR3';
import { create_RationalBSplineR1toR2 } from '../../src/bsplines/RationalBSplineR1toR2';
import { computeDerivatives } from '../../src/bsplinesOptimizationProblems/AbstractOptimizationProblemRationalBSplineR1toR2';




describe('OptimizationProblemRationalBSplineR1toR2', () => {

    it('has a number of independent variables equal to three time the number of control points', () => {
        let splineTarget = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblemRationalBSplineR1toR2(splineTarget, splineInitial)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.controlPoints.length * 3)
    });

    
    it('has a zero value objective function for a spline that is identical to the target', () => {
        let splineTarget = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblemRationalBSplineR1toR2(splineTarget, splineInitial)
        expect( o.f0 ).to.equal(0)
        let deltaX = zeroVector(splineInitial.controlPoints.length * 3)
        o.step(deltaX)
        expect( o.f0 ).to.equal(0)
    });



    it('returns an identity matrix for its objective function hessian', () => {
        let splineTarget = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblemRationalBSplineR1toR2(splineTarget, splineInitial)
        expect(o.hessian_f0).to.deep.equal(identityMatrix(splineInitial.controlPoints.length * 3))
    });

    it('returns inflection gradient matrix of correct shape', () => {
        let splineTarget = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblemRationalBSplineR1toR2(splineTarget, splineInitial, ActiveControl.inflections)
        const gradient_f = o.gradient_f
        expect(gradient_f.shape).to.deep.equal([7, 12])

    });

    it('can handle a spline with an interior knot', () => {
        let splineTarget = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0, 8, 1], [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let splineInitial = create_RationalBSplineR1toR2([[-0.5, 0, 1], [-0.25, 7, 1], [0, 8, 1],  [0.25, 7, 1], [0.5, 0, 1]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OptimizationProblemRationalBSplineR1toR2(splineTarget, splineInitial)
        const gradient_f = o.gradient_f
        //expect(gradient_f.shape).to.deep.equal([7, 12])

    });





});