import { expect } from 'chai';
import { PeriodicBSplineR1toR2DifferentialProperties } from '../../../src/bsplines/R1toR2/PeriodicBSplineR1toR2DifferentialProperties';
import { create_PeriodicBSplineR1toR2 } from '../../../src/bsplines/R1toR2/PeriodicBSplineR1toR2';
import { ActiveControl } from '../../../src/optimizationProblems/BaseOpBSplineR1toR2';
import { OpPeriodicBSplineR1toR2Hessian } from '../../../src/optimizationProblems/alternatives/OpPeriodicBSplineR1toR2Hessian';
import { identityMatrix } from '../../../src/linearAlgebra/DiagonalMatrix';
import { zeroVector } from '../../../src/linearAlgebra/MathVectorBasicOperations';
import { Vector2d } from '../../../src/mathVector/Vector2d';




describe('OpPeriodicBSplineR1toR2', () => {

    it('has a number of independent variables equal to twice the number of control points minus twice de degree', () => {
        let splineTarget = create_PeriodicBSplineR1toR2([[-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176], [0.28, -0.201], [0, -0.406], [-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176] ], [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        let splineInitial = splineTarget.clone()
        let o = new OpPeriodicBSplineR1toR2Hessian(splineTarget, splineInitial)
        expect(splineTarget.degree).to.equal(4)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.controlPoints.length * 2 - 8)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.freeControlPoints.length * 2)

    });

    it('has a zero value objective function for a spline that is identical to the target', () => {
        let splineTarget = create_PeriodicBSplineR1toR2([[-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176], [0.28, -0.201], [0, -0.406], [-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176] ], [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        let splineInitial = splineTarget.clone()
        let o = new OpPeriodicBSplineR1toR2Hessian(splineTarget, splineInitial)
        expect( o.f0 ).to.equal(0)
        let deltaX = zeroVector(splineInitial.freeControlPoints.length * 2)
        o.step(deltaX)
        expect( o.f0 ).to.equal(0)
    });

    it('returns an identity matrix for its objective function hessian', () => {
        let splineTarget = create_PeriodicBSplineR1toR2([[-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176], [0.28, -0.201], [0, -0.406], [-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176] ], [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        let splineInitial = splineTarget.clone()
        let o = new OpPeriodicBSplineR1toR2Hessian(splineTarget, splineInitial)
        //expect(o.hessian_f0).to.eql(identityMatrix(splineInitial.controlPoints.length * 2))
    });

    it('has a number of constraints + inactiveConstraints equal to (4 * d - 5) * (n - d) for curvature extrema', () => {
        //If the b-spline is of degree d, the curvature derivative numerator is of degree (4d - 6) and is itself decomposed
        //into (n - d) Bezier segments. Each Bezier segment has (4d - 5) control points. There are then (4d - 5) * (n - d)
        // available control points
        let splineTarget = create_PeriodicBSplineR1toR2([[-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176], [0.28, -0.201], [0, -0.406], [-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176] ], [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        let splineInitial = splineTarget.clone()
        let o = new OpPeriodicBSplineR1toR2Hessian(splineTarget, splineInitial, ActiveControl.curvatureExtrema )
        const n = splineInitial.controlPoints.length
        const d = splineInitial.degree
        const numberOfConstraints = o.numberOfConstraints
        const numberOfInactiveConstraints = o.curvatureExtremaInactiveConstraints.length
        // n = 10
        // d = 4
        // n - d = 6
        // 4 * d - 5 = 11
        // 11 * 6 = 66
        //let dp = new PeriodicBSplineR1toR2DifferentialProperties(splineInitial)
        //console.log(dp.curvatureDerivativeNumerator())
        //console.log(numberOfConstraints + numberOfInactiveConstraints)
        expect(o.curvatureExtremaInactiveConstraints).to.deep.equal([5, 19, 38, 57])
        expect(numberOfConstraints + numberOfInactiveConstraints).to.equal( (4 * d - 5) * (n - d) )
    });

    it('returns f of length number of constraints and a gradient_f of shape [number of constraints, number of independent variables]', () => {
        let splineTarget = create_PeriodicBSplineR1toR2([[-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176], [0.28, -0.201], [0, -0.406], [-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176] ], [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        let splineInitial = splineTarget.clone()
        let o = new OpPeriodicBSplineR1toR2Hessian(splineTarget, splineInitial, ActiveControl.both)
        expect(o.f.length).to.eql(98)
        // 6 free control points 
        expect(o.gradient_f.shape).to.eql([98, splineTarget.freeControlPoints.length*2])
        const numberOfConstraintsFreeIndicesCurvatureExtrema = o.curvatureExtremaInactiveConstraints.length
        expect(numberOfConstraintsFreeIndicesCurvatureExtrema).to.equal(4)
        const numberOfConstraintsFreeIndicesInflection = o.inflectionInactiveConstraints.length
        expect(numberOfConstraintsFreeIndicesInflection).to.equal(0)
    });

    it('returns gradient_f such that a dot product of a rigid motion equal zero', () => {
        let splineTarget = create_PeriodicBSplineR1toR2([[-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176], [0.28, -0.201], [0, -0.406], [-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176] ], [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        let splineInitial = splineTarget.clone()
        let o = new OpPeriodicBSplineR1toR2Hessian(splineTarget, splineInitial)
        for (let i = 0; i < o.gradient_f.shape[0]; i += 1) {
            let temp = 0
            for (let j = 0; j < o.gradient_f.shape[1]; j += 1) {
                temp += o.gradient_f.get(0, j)    
            }
            expect(Math.abs(temp)).to.be.below(10e-12)
        }

        
    });

    it('returns the same value for f/f0 and fstep/f0step when it should', () => {
        let splineTarget = create_PeriodicBSplineR1toR2([[-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176], [0.28, -0.201], [0, -0.406], [-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176] ], [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        let splineInitial = splineTarget.clone()        
        let o = new OpPeriodicBSplineR1toR2Hessian(splineTarget, splineInitial)
        let step = zeroVector(o.numberOfIndependentVariables)
        expect(o.fStep(step)).to.deep.equal(o.f)
        expect(o.f0Step(step)).to.deep.equal(o.f0)
        step[0] = 0.01
        step[1] = 0.02
        let fStepTemp = o.fStep(step)
        let f0StepTemp = o.f0Step(step)
        o.step(step)
        expect(fStepTemp).to.deep.equal(o.f)
        expect(fStepTemp).to.deep.equal(o.f)
        expect(f0StepTemp).to.deep.equal(o.f0)
    });

    it('returns the same value for f/f0 and fstep/f0step when it should, special case', () => {
        let splineInitial = create_PeriodicBSplineR1toR2([[-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176], [0.28, -0.201], [0, -0.406], [-0.28, -0.2], [-0.235, 0.176], [0, 0.358], [0.235, 0.176] ], [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])   
        splineInitial = splineInitial.insertKnot(0.1)
        splineInitial = splineInitial.insertKnot(0.2)
        splineInitial = splineInitial.insertKnot(0.3)
        splineInitial = splineInitial.insertKnot(0.4)
        splineInitial = splineInitial.insertKnot(0.5)
        splineInitial = splineInitial.insertKnot(0.6)
        splineInitial = splineInitial.insertKnot(0.7)
        splineInitial = splineInitial.insertKnot(0.8)
        splineInitial = splineInitial.insertKnot(0.9)
        let splineTarget = splineInitial.clone()
        let o = new OpPeriodicBSplineR1toR2Hessian(splineTarget, splineInitial)
        let step = zeroVector(o.numberOfIndependentVariables)
        expect(o.fStep(step) ).to.deep.equal(o.f)
        expect(o.f0Step(step) ).to.deep.equal(o.f0)        
        step[0] = 0.001
        step[1] = 0.00
        let fStepTemp = o.fStep(step)
        let f0StepTemp = o.f0Step(step)
        o.step(step)        
        expect(fStepTemp ).to.deep.equal(o.f)
        expect(fStepTemp ).to.deep.equal(o.f)
        expect(f0StepTemp ).to.deep.equal(o.f0)
    });



});