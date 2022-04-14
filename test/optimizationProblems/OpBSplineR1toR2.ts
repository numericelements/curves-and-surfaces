import { expect } from 'chai';
import { OpBSplineR1toR2} from '../../src/optimizationProblems/OpBSplineR1toR2';
import { create_BSplineR1toR2, BSplineR1toR2 } from '../../src/bsplines/R1toR2/BSplineR1toR2';
import { zeroVector, containsNaN } from '../../src/linearAlgebra/MathVectorBasicOperations';
import { identityMatrix } from '../../src/linearAlgebra/DiagonalMatrix';
import { BSplineR1toR2DifferentialProperties } from '../../src/bsplines/R1toR2/BSplineR1toR2DifferentialProperties';
import { Vector2d } from '../../src/mathVector/Vector2d';
import { ActiveControl } from '../../src/optimizationProblems/BaseOpBSplineR1toR2';
import { BaseBSplineR1toR2 } from '../../src/bsplines/R1toR2/BaseBSplineR1toR2';
import { BSplineR1toR1 } from '../../src/bsplines/R1toR1/BSplineR1toR1';




describe('OpBSplineR1toR2', () => {

    it('has a number of independent variables equal to twice the number of control points', () => {
        let splineTarget = create_BSplineR1toR2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.controlPoints.length * 2)
    });

    it('has a zero value objective function for a spline that is identical to the target', () => {
        let splineTarget = create_BSplineR1toR2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)
        expect( o.f0 ).to.equal(0)
        let deltaX = zeroVector(splineInitial.controlPoints.length * 2)
        o.step(deltaX)
        expect( o.f0 ).to.equal(0)
    });

    it('returns an identity matrix for its objective function hessian', () => {
        let splineTarget = create_BSplineR1toR2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)
        expect(o.hessian_f0).to.eql(identityMatrix(splineInitial.controlPoints.length * 2))
    });

    it('has a number of constraints + inactiveConstraints equal to (4 * d - 5) * (n - d) for curvature extrema', () => {
        //If the b-spline is of degree d, the curvature derivative numerator is of degree (4d - 6) and is itself decomposed
        //into (n - d) Bezier segments. Each Bezier segment has (4d - 5) control points. There are then (4d - 5) * (n - d)
        // available control points.
        let splineTarget = create_BSplineR1toR2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR2(splineTarget, splineInitial, ActiveControl.curvatureExtrema)
        const n = splineInitial.controlPoints.length
        const d = splineInitial.degree
        const numberOfConstraints = o.numberOfConstraints
        const numberOfInactiveConstraints = o.curvatureExtremaInactiveConstraints.length
        // n - d = 1
        // 4 * d - 5 = 7
        // CurvatureDerivativeNumerator = [-2.53, -1.69, -4.2, 0, 4.2, 1.69, 2.53]
        expect(o.curvatureExtremaInactiveConstraints).to.eql([3, 4])
        expect(numberOfConstraints + numberOfInactiveConstraints).to.equal( (4 * d - 5) * (n - d) )
    });

    it('returns f of length number of constraints and a gradient_f of shape [number of constraints, number of independent variables]', () => {
        let splineTarget = create_BSplineR1toR2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR2(splineTarget, splineInitial, ActiveControl.both)
        expect(o.f.length).to.eql(9)
        expect(o.gradient_f.shape).to.eql([9, 8])
        const numberOfCurvatureExtremaInactiveConstraints = o.curvatureExtremaInactiveConstraints.length
        expect(numberOfCurvatureExtremaInactiveConstraints).to.eql(2)
        const numberOfInflectionInactiveConstraints = o.inflectionInactiveConstraints.length
        expect(numberOfInflectionInactiveConstraints).to.eql(0)
    });

    it('returns gradient_f such that a dot product of a rigid motion equal zero', () => {
        let splineTarget = create_BSplineR1toR2([[-0.5, 0], [-0.25, 0.000005], [0.25, 0.00002], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2([[-0.5, 0], [-0.25, 0.000005], [0.25, 0.00002], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        splineInitial = splineInitial.insertKnot(0.1)
        splineTarget = splineTarget.insertKnot(0.1)
        splineInitial = splineInitial.insertKnot(0.2)
        splineTarget = splineTarget.insertKnot(0.2)
        splineInitial = splineInitial.insertKnot(0.3)
        splineTarget = splineTarget.insertKnot(0.3)
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)
        for (let i = 0; i < o.gradient_f.shape[0]; i += 1) {
            let temp = 0
            for (let j = 0; j < o.gradient_f.shape[1]; j += 1) {
                temp += o.gradient_f.get(i, j)    
            }
            expect(Math.abs(temp)).to.be.below(10e-12)
        }
    });

    it('returns the same value for f/f0 and fstep/f0step when it should', () => {
        let splineTarget = create_BSplineR1toR2([[-0.5, 0.1], [-0.25, 0.25], [0.25, 0.25], [0.5, 0.1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)
        let step = zeroVector(o.numberOfIndependentVariables)
        expect(o.fStep(step)).to.deep.equal(o.f)
        expect(o.f0Step(step)).to.deep.equal(o.f0)
        /*
        step[0] = 0.01
        step[1] = 0.02
        let fStepTemp = o.fStep(step)
        let f0StepTemp = o.f0Step(step)
        o.step(step)
        expect(fStepTemp).to.deep.equal(o.f)
        expect(fStepTemp).to.eql(o.f)
        expect(f0StepTemp).to.eql(o.f0)
        */
    });



    it('returns the same value for f/f0 and fstep/f0step when it should, special case', () => {
        const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSplineR1toR2(cp, knots)
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
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)
        let step = zeroVector(o.numberOfIndependentVariables)
        expect(o.fStep(step) ).to.eql(o.f)
        expect(o.f0Step(step) ).to.eql(o.f0)
        step[0] = 0.001
        step[1] = 0.00
        let fStepTemp = o.fStep(step)
        let f0StepTemp = o.f0Step(step)
        o.step(step)
        expect(fStepTemp ).to.eql(o.f)
        expect(fStepTemp ).to.eql(o.f)
        expect(f0StepTemp ).to.eql(o.f0)
    });


    it('can compute changing sign polygon segments', () => {
        const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSplineR1toR2(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)
        let t1 = o.extractChangingSignControlPointsSequences([-5, -3, 5, 5])
        expect(t1).to.deep.equal([[{index: 1, value: -3}, {index: 2, value: 5}]])
        let t2 = o.extractChangingSignControlPointsSequences([-5, -5, 3, 5])
        expect(t2).to.deep.equal([[{index: 1, value: -5}, {index: 2, value: 3}]])
        let t3 = o.extractChangingSignControlPointsSequences([5, -3, -5, 5.1])
        expect(t3).to.deep.equal([[{index: 0, value: 5}, {index: 1, value: -3}], [{index: 2, value: -5}, {index: 3, value: 5.1}]])
        let t4 = o.extractChangingSignControlPointsSequences([5, -3, 5, -3])
        expect(t4).to.deep.equal([[{index: 0, value: 5}, {index: 1, value: -3}, {index: 2, value: 5}, {index: 3, value: -3}]])
    });

    it('can extract control points closest to zero', () => {
        const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSplineR1toR2(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)
        let t1 = o.extractChangingSignControlPointsSequences([-5, -3, 5, 5])
        let t1a = o.extractControlPointsClosestToZero(t1)
        expect(t1a).to.deep.equal([1])
        let t2 = o.extractChangingSignControlPointsSequences([-5, -5, 3, 5])
        let t2a = o.extractControlPointsClosestToZero(t2)
        expect(t2a).to.deep.equal([2])
        let t3 = o.extractChangingSignControlPointsSequences([5, -3, -5, 5.1])
        let t3a = o.extractControlPointsClosestToZero(t3)
        expect(t3a).to.deep.equal([1, 2])
        let t4 = o.extractChangingSignControlPointsSequences([5, -3, 5, -3])
        let t4a = o.extractControlPointsClosestToZero(t4)
        expect(t4a).to.deep.equal([1,2,3])       
    });

    it('can remove biggest', () => {
        const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSplineR1toR2(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)
        let t1 = o.extractChangingSignControlPointsSequences([-5, -3, 5, 5])
        let t1a = o.removeBiggest(t1[0])
        expect(t1a).to.deep.equal([{index: 1, value: -3}])
    });


    it('has no repeated inactive constaints', () => {

        const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSplineR1toR2(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OpBSplineR1toR2(splineTarget, splineInitial, ActiveControl.curvatureExtrema)

        let result = o.computeInactiveConstraints([-3, -4, 5, 6])
        expect(result).to.eql([1])

        result = o.computeInactiveConstraints([-3, -4, -5, 6])
        expect(result).to.eql([2])

        result = o.computeInactiveConstraints([-3, -4, -5, -6])
        expect(result).to.eql([])

        result = o.computeInactiveConstraints([-3, -4, -5, 6])
        expect(result).to.eql([2])

        result = o.computeInactiveConstraints([-3, -4, -6, 5])
        expect(result).to.eql([3])

        result = o.computeInactiveConstraints([-3, -4, 5, -4.9])
        expect(result).to.eql([1, 3])

        result = o.computeInactiveConstraints([3, -4, -5, -5])
        expect(result).to.eql([0])

        result = o.computeInactiveConstraints([4, -3, -5, -5])
        expect(result).to.eql([1])
    });



    it('can take a symmetric b-spline curve', () => {
        let cp0 = new Vector2d(-0.5, 0)
        let cp1 = new Vector2d(-0.25, 8)
        let cp2 = new Vector2d(0.25, 8)
        let cp3 = new Vector2d(0.5, 0)
        let splineTarget = new BSplineR1toR2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1]) 
        splineTarget = splineTarget.insertKnot(0.2)
        splineTarget = splineTarget.insertKnot(0.8)
        let cp4 = new Vector2d(-0.5, 0)
        let cp5 = new Vector2d(-0.25, 7)
        let cp6 = new Vector2d(0.25, 7)
        let cp7 = new Vector2d(0.5, 0)
        let splineInitial = new BSplineR1toR2([cp4, cp5, cp6, cp7], [0, 0, 0, 0, 1, 1, 1, 1]) 
        splineInitial = splineInitial.insertKnot(0.2)
        splineInitial = splineInitial.insertKnot(0.8)        
        let optimizationProblem = new OpBSplineR1toR2(splineTarget, splineInitial)
        
    });

    it('has a number of independent variables equal to twice the number of control points special case', () => {
        let splineTarget = create_BSplineR1toR2([[-0.5, 0], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2([[-0.5, 0.1], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.controlPoints.length * 2)
    });

    it('has no nan in constraint vector', () => {
        let splineTarget = create_BSplineR1toR2([[-0.5, 0], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2([[-0.5, 0.1], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)
        let e = o.expensiveComputation(o.spline)
        let g = o.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        expect(containsNaN(g)).to.equal(false)
    });

    it('has no zeros in constraint vector', () => {
        let splineTarget = create_BSplineR1toR2([[-0.5, 0], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2([[-0.5, 0.1], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)
        let e = o.expensiveComputation(o.spline)
        let constraint_vector = o.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        for (let v of constraint_vector) {
            expect(v).to.not.equal(0)
        }
    });

    it('has no nan in gradient constraint matrix', () => {
        let splineTarget = create_BSplineR1toR2([[-0.5, 0], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2([[-0.5, 0.1], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OpBSplineR1toR2(splineTarget, splineInitial)

        const e = o.expensiveComputation(o.spline)
        const cdn = o.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        const cs = o.computeConstraintsSign(cdn)
        const m = o.compute_curvatureExtremaConstraints_gradient(e, cs, [])
        for (let i = 0; i < m.shape[0]; i += 1) {
            for (let j = 0; j < m.shape[1]; j += 1) {
                expect (m.get(i, j)).to.not.equal(NaN)
                }
        }
        

    });




});