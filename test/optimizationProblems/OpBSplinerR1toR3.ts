import { expect } from 'chai';
import { create_BSplineR1toR3 } from '../../src/bsplines/R1toR3/BSplineR1toR3';
import { OpBSplineR1toR3 } from '../../src/optimizationProblems/OpBSplineR1toR3';
import { identityMatrix } from '../../src/linearAlgebra/DiagonalMatrix';
import { zeroVector } from '../../src/linearAlgebra/MathVectorBasicOperations';
import { ActiveControl } from '../../src/models/CurveModel3d';




describe('OpBSplineR1toR3', () => {

    it('has a number of independent variables equal to three time the number of control points', () => {
        let splineTarget = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR3(splineTarget, splineInitial)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.controlPoints.length * 3)
    });

    it('has a zero value objective function for a spline that is identical to the target', () => {
        let splineTarget = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR3(splineTarget, splineInitial)
        expect( o.f0 ).to.equal(0)
        let deltaX = zeroVector(splineInitial.controlPoints.length * 3)
        o.step(deltaX)
        expect( o.f0 ).to.equal(0)
    });

    it('returns an identity matrix for its objective function hessian', () => {
        let splineTarget = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR3(splineTarget, splineInitial)
        expect(o.hessian_f0).to.deep.equal(identityMatrix(splineInitial.controlPoints.length * 3))
    });

    it('has a number of constraints + inactiveConstraints equal to (6 * d - 8) * (n - d) for curvature extrema', () => {
        //If the b-spline is of degree d, the curvature derivative numerator is of degree (4d - 6) and is itself decomposed
        //into (n - d) Bezier segments. Each Bezier segment has (4d - 5) control points. There are then (4d - 5) * (n - d)
        // available control points.
        let splineTarget = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR3(splineTarget, splineInitial, ActiveControl.curvatureExtrema)
        const n = splineInitial.controlPoints.length
        const d = splineInitial.degree
        const numberOfConstraints = o.numberOfConstraints
        const numberOfInactiveConstraints = o.curvatureExtremaInactiveConstraints.length
        // n - d = 1
        // 6 * d - 8 = 10
        expect(o.curvatureExtremaInactiveConstraints).to.eql([5])
        expect(numberOfConstraints + numberOfInactiveConstraints).to.equal( (6 * d - 8) * (n - d) )
    });

    it('has a number of constraints + inactiveConstraints equal to (3d - 5) * (n - d) for torsion', () => {
        //If the b-spline is of degree d, the curvature derivative numerator is of degree (4d - 6) and is itself decomposed
        //into (n - d) Bezier segments. Each Bezier segment has (4d - 5) control points. There are then (4d - 5) * (n - d)
        // available control points.

        let splineTarget = create_BSplineR1toR3([[-0.25, 0, -0.15], [-0.15, 0.15, -0.05], [0.15, 0.15, -0.05], [0.25, 0, 0.05]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.25, 0, -0.15], [-0.15, 0.15, -0.05], [0.15, 0.15, -0.05], [0.25, 0, 0.05]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR3(splineTarget, splineInitial, ActiveControl.torsionZeros)
        const n = splineInitial.controlPoints.length
        const d = splineInitial.degree
        const numberOfConstraints = o.numberOfConstraints
        const numberOfInactiveConstraints = o.torsionZerosInactiveConstraints.length
        // n - d = 1
        // 3 * d - 5 = 4
        expect(o.torsionZerosInactiveConstraints).to.eql([])
        expect(numberOfConstraints + numberOfInactiveConstraints).to.equal( (3 * d - 5) * (n - d) )
    });

    it('returns f of length number of constraints and a gradient_f of shape [number of constraints, number of independent variables]', () => {
        let splineTarget = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.5, 0, 0], [-0.25, 7, 1], [0.25, 7, 1], [0.5, 0, 2]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR3(splineTarget, splineInitial, ActiveControl.both)
        expect(o.f.length).to.eql(13)
        expect(o.gradient_f.shape).to.eql([13, 12])
        /*
        const numberOfCurvatureExtremaInactiveConstraints = o.curvatureExtremaInactiveConstraints.length
        expect(numberOfCurvatureExtremaInactiveConstraints).to.eql(2)
        const numberOfInflectionInactiveConstraints = o.inflectionInactiveConstraints.length
        expect(numberOfInflectionInactiveConstraints).to.eql(0)
        */
    });

    it('returns gradient_f such that a dot product of a rigid motion equal zero', () => {
        let splineTarget = create_BSplineR1toR3([[-0.5, 0, 3], [-0.25, 0.5, 1], [0.25, 0.2, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR3([[-0.5, 0, 3], [-0.25, 0.5, 1], [0.25, 0.2, 1], [0.5, 0, 1]], [0, 0, 0, 0, 1, 1, 1, 1])
        splineInitial.insertKnot(0.1)
        splineTarget.insertKnot(0.1)
        splineInitial.insertKnot(0.2)
        splineTarget.insertKnot(0.2)
        splineInitial.insertKnot(0.3)
        splineTarget.insertKnot(0.3)
        let o = new OpBSplineR1toR3(splineTarget, splineInitial, ActiveControl.both)
        for (let i = 0; i < o.gradient_f.shape[0]; i += 1) {
            let temp = 0
            for (let j = 0; j < o.gradient_f.shape[1]; j += 1) {
                temp += o.gradient_f.get(i, j)    
            }
            expect(Math.abs(temp)).to.be.below(10e-8)
        }
    });

    
});