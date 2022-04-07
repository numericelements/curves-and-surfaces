import { expect } from 'chai';
import { create_BSplineR1toR3 } from '../../src/bsplines/BSplineR1toR3';
import { OptimizationProblemBSplineR1toR3 } from '../../src/bsplinesOptimizationProblems/OptimizationProblemBSplineR1toR3';
import { identityMatrix } from '../../src/linearAlgebra/DiagonalMatrix';
import { zeroVector } from '../../src/linearAlgebra/MathVectorBasicOperations';
import { ActiveControl } from '../../src/models/CurveModel3d';




describe('OptimizationProblemBSplineR1toR3', () => {

    it('has a number of independent variables equal to three time the number of control points', () => {
        let splineTarget = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblemBSplineR1toR3(splineTarget, splineInitial)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.controlPoints.length * 3)
    });

    it('has a zero value objective function for a spline that is identical to the target', () => {
        let splineTarget = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblemBSplineR1toR3(splineTarget, splineInitial)
        expect( o.f0 ).to.equal(0)
        let deltaX = zeroVector(splineInitial.controlPoints.length * 3)
        o.step(deltaX)
        expect( o.f0 ).to.equal(0)
    });

    it('returns an identity matrix for its objective function hessian', () => {
        let splineTarget = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblemBSplineR1toR3(splineTarget, splineInitial)
        expect(o.hessian_f0).to.deep.equal(identityMatrix(splineInitial.controlPoints.length * 3))
    });

    it('has a number of constraints + inactiveConstraints equal to (6 * d - 8) * (n - d) for curvature extrema', () => {
        //If the b-spline is of degree d, the curvature derivative numerator is of degree (4d - 6) and is itself decomposed
        //into (n - d) Bezier segments. Each Bezier segment has (4d - 5) control points. There are then (4d - 5) * (n - d)
        // available control points.
        let splineTarget = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblemBSplineR1toR3(splineTarget, splineInitial, ActiveControl.curvatureExtrema)
        const n = splineInitial.controlPoints.length
        const d = splineInitial.degree
        const numberOfConstraints = o.numberOfConstraints
        const numberOfInactiveConstraints = o.curvatureExtremaInactiveConstraints.length
        // n - d = 1
        // 6 * d - 8 = 10
        expect(o.curvatureExtremaInactiveConstraints).to.eql([5])
        expect(numberOfConstraints + numberOfInactiveConstraints).to.equal( (6 * d - 8) * (n - d) )
    });

    it('has a number of constraints + inactiveConstraints equal to (?) * (n - d) for torsion', () => {
        //If the b-spline is of degree d, the curvature derivative numerator is of degree (4d - 6) and is itself decomposed
        //into (n - d) Bezier segments. Each Bezier segment has (4d - 5) control points. There are then (4d - 5) * (n - d)
        // available control points.

        let splineTarget = create_BSplineR1toR3([[-0.25, 0, -0.15], [-0.15, 0.15, -0.05], [0.15, 0.15, -0.05], [0.25, 0, 0.05]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.25, 0, -0.15], [-0.15, 0.15, -0.05], [0.15, 0.15, -0.05], [0.25, 0, 0.05]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblemBSplineR1toR3(splineTarget, splineInitial, ActiveControl.torsionZeros)
        const n = splineInitial.controlPoints.length
        const d = splineInitial.degree
        const numberOfConstraints = o.numberOfConstraints
        const numberOfInactiveConstraints = o.torsionZerosInactiveConstraints.length
        // n - d = 1
        // 6 * d - 8 = 10
        console.log(o.torsionZerosInactiveConstraints)
        console.log(numberOfConstraints + numberOfInactiveConstraints)
        //expect(o.curvatureExtremaInactiveConstraints).to.eql([5])
        //expect(numberOfConstraints + numberOfInactiveConstraints).to.equal( (6 * d - 8) * (n - d) )
    });

    it('returns f of length number of constraints and a gradient_f of shape [number of constraints, number of independent variables]', () => {
        let splineTarget = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblemBSplineR1toR3(splineTarget, splineInitial, ActiveControl.both)
        expect(o.f.length).to.eql(13)
        expect(o.gradient_f.shape).to.eql([13, 12])
        /*
        const numberOfCurvatureExtremaInactiveConstraints = o.curvatureExtremaInactiveConstraints.length
        expect(numberOfCurvatureExtremaInactiveConstraints).to.eql(2)
        const numberOfInflectionInactiveConstraints = o.inflectionInactiveConstraints.length
        expect(numberOfInflectionInactiveConstraints).to.eql(0)
        */
    });

    
});