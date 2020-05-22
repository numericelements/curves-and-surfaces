import { expect } from 'chai';
import { OptimizationProblem_BSpline_R1_to_R2} from '../src/mathematics/OptimizationProblem_BSpline_R1_to_R2';
import { create_BSpline_R1_to_R2, BSpline_R1_to_R2 } from '../src/mathematics/BSpline_R1_to_R2';
import { zeroVector, containsNaN } from '../src/mathematics/MathVectorBasicOperations';
import { identityMatrix } from '../src/mathematics/DiagonalMatrix';
import { BSpline_R1_to_R2_DifferentialProperties } from '../src/mathematics/BSpline_R1_to_R2_DifferentialProperties';
import { Vector_2d } from '../src/mathematics/Vector_2d';




describe('OptimizationProblem_BSpline_R1_to_R2', () => {

    it('has a number of independent variables equal to twice the number of control points', () => {
        let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.controlPoints.length * 2)
    });

    it('has a zero value objective function for a spline that is identical to the target', () => {
        let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        expect( o.f0 ).to.equal(0)
        let deltaX = zeroVector(splineInitial.controlPoints.length * 2)
        o.step(deltaX)
        expect( o.f0 ).to.equal(0)
    });

    it('returns an identity matrix for its objective function hessian', () => {
        let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        expect(o.hessian_f0).to.eql(identityMatrix(splineInitial.controlPoints.length * 2))
    });

    it('has a number of constraints + free indices equal to (4 * d - 5) * (n - d) for curvature extrema', () => {
        //If the b-spline is of degree d, the curvature derivative numerator is of degree (4d - 6) and is itself decomposed
        //into (n - d) Bezier segments. Each Bezier segment has (4d - 5) control points. There are then (4d - 5) * (n - d)
        // available control points
        let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        const n = splineInitial.controlPoints.length
        const d = splineInitial.degree
        const numberOfConstraints = o.numberOfConstraints
        const numberOfConstraintsFreeIndices = o.curvatureExtremaConstraintsFreeIndices.length

        
        // n - d = 1
        // 4 * d - 5 = 7
        const g = o.g()
        // g = [-2.53, -1.69, -4.2, 0, 4.2, 1.69, 2.53]
        expect(o.curvatureExtremaConstraintsFreeIndices).to.eql([3])
        //expect(numberOfConstraints + numberOfConstraintsFreeIndices).to.equal( (4 * d - 5) * (n - d) )
        expect(g.length).to.equal( (4 * d - 5) * (n - d) )

    
        const dp = new BSpline_R1_to_R2_DifferentialProperties(splineInitial)
        expect(dp.curvatureDerivativeNumerator().controlPoints).to.eql(o.g())
        

    });

    it('returns f of length number of constraints and a gradient_f of shape [number of constraints, number of independent variables]', () => {
        //If the b-spline is of degree d, the curvature derivative numerator is of degree (4d - 6) and is itself decomposed
        //into (n - d) Bezier segments. Each Bezier segment has (4d - 5) control points. There are then (4d - 5) * (n - d)
        // available control points
        let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        expect(o.gradient_f.shape).to.eql([10, 8])
        expect(o.f.length).to.eql(10)

        const numberOfConstraintsFreeIndicesCurvatureExtrema = o.curvatureExtremaConstraintsFreeIndices.length
        expect(numberOfConstraintsFreeIndicesCurvatureExtrema).to.eql(1)

        const numberOfConstraintsFreeIndicesInflection = o.inflectionConstraintsFreeIndices.length
        expect(numberOfConstraintsFreeIndicesInflection).to.eql(0)

    });

    it('returns gradient_f such that a dot product of a rigid motion equal to zero', () => {
        //If the b-spline is of degree d, the curvature derivative numerator is of degree (4d - 6) and is itself decomposed
        //into (n - d) Bezier segments. Each Bezier segment has (4d - 5) control points. There are then (4d - 5) * (n - d)
        // available control points
        let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.000005], [0.25, 0.00002], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.000005], [0.25, 0.00002], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        splineInitial.insertKnot(0.1)
        splineTarget.insertKnot(0.1)
        splineInitial.insertKnot(0.2)
        splineTarget.insertKnot(0.2)
        splineInitial.insertKnot(0.3)
        splineTarget.insertKnot(0.3)
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        //let result: number[] = []
        for (let i = 0; i < o.gradient_f.shape[0]; i += 1) {
            let temp = 0
            for (let i = 0; i < o.gradient_f.shape[1]; i += 1) {
                temp += o.gradient_f.get(0, i)    
            }
            expect(Math.abs(temp)).to.be.below(10e-12)
        }

        
    });

    it('returns the same value for f/f0 and fstep/f0step when it should', () => {
        
        let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0.1], [-0.25, 0.25], [0.25, 0.25], [0.5, 0.1]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        let step = zeroVector(o.numberOfIndependentVariables)
        expect(o.fStep(step) ).to.eql(o.f)
        expect(o.f0Step(step) ).to.eql(o.f0)
        
        step[0] = 0.01
        step[1] = 0.02

        let fStepTemp = o.fStep(step)
        let f0StepTemp = o.f0Step(step)
        o.step(step)

        expect(fStepTemp ).to.eql(o.f)
        
        expect(fStepTemp ).to.eql(o.f)
        expect(f0StepTemp ).to.eql(o.f0)
        
        
    });



    it('returns the same value for f/f0 and fstep/f0step when it should, special case', () => {


        const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSpline_R1_to_R2(cp, knots)
        splineInitial.insertKnot(0.1)
        splineInitial.insertKnot(0.2)
        splineInitial.insertKnot(0.3)
        splineInitial.insertKnot(0.4)
        splineInitial.insertKnot(0.5)
        splineInitial.insertKnot(0.6)
        splineInitial.insertKnot(0.7)
        splineInitial.insertKnot(0.8)
        splineInitial.insertKnot(0.9)

        let splineTarget = splineInitial.clone()

        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        let step = zeroVector(o.numberOfIndependentVariables)
        expect(o.fStep(step) ).to.eql(o.f)
        expect(o.f0Step(step) ).to.eql(o.f0)

        //let numberOfinactiveContraint1 = o.inactiveConstraints
        
        
        step[0] = 0.001
        step[1] = 0.00

        let fStepTemp = o.fStep(step)
        let f0StepTemp = o.f0Step(step)
        o.step(step)

        //let numberOfinactiveContraint2 = o.inactiveConstraints

        //expect(numberOfinactiveContraint1 ).to.eql(numberOfinactiveContraint2)

        
        expect(fStepTemp ).to.eql(o.f)
        
        expect(fStepTemp ).to.eql(o.f)
        expect(f0StepTemp ).to.eql(o.f0)
        
    });

    it('can compute sign change intervals', () => {
        const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSpline_R1_to_R2(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        let result = o.computeSignChangeIntervals([-1, -1, 1, 1])
        expect(result).to.eql([1])

        let result1 = o.computeSignChangeIntervals([-1, -1, 1, 1, -1, -1])
        expect(result1).to.eql([1, 3])

    });

    it('can compute ControlPoints Closest To Zero at sign changes', () => {
        const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSpline_R1_to_R2(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        let t1 = o.computeControlPointsClosestToZero([1], [-5, -3, 5, 5],)
        expect(t1).to.eql([1])

        let t2 = o.computeControlPointsClosestToZero([1], [-5, -5, 3, 5])
        expect(t2).to.eql([2])

        let t3 = o.computeControlPointsClosestToZero([0, 2], [5, -3, -5, 5.1])
        expect(t3).to.eql([1, 2])


    });

    it('can add Inactive Constraints For Inflections', () => {
        const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSpline_R1_to_R2(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        let t1 = o.addInactiveConstraintsForInflections([1], [-5, -3, 5, 5])
        expect(t1).to.eql([1])

        //let t2 = o.addInactiveConstraintsForInflections([1], [-3, -3, 5, 6])
        //expect(t2).to.eql([0, 1])

        let t3 = o.addInactiveConstraintsForInflections([1, 2], [5, -2, -2, 5])
        expect(t3).to.eql([1, 2])

        let t4 = o.addInactiveConstraintsForInflections([1], [5, -2, -2, -5])
        expect(t4).to.eql([1, 2])

        let t5 = o.addInactiveConstraintsForInflections([1], [5, -2, -2.1, -5])
        expect(t5).to.eql([1])

        let t6 = o.addInactiveConstraintsForInflections([2], [5, 3, -2, -2])
        expect(t6).to.eql([2])
    });




    it('has no repeated inactive constaints', () => {
        const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSpline_R1_to_R2(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        let result = o.computeInactiveConstraints([-1, -1, 1, 1], [-3, -4, 5, 6])
        expect(result).to.eql([1])

        result = o.computeInactiveConstraints([-1, -1, -1, 1], [-3, -4, -5, 6])
        expect(result).to.eql([2])

        result = o.computeInactiveConstraints([-1, -1, -1, -1], [-3, -4, -5, -6])
        expect(result).to.eql([])

        result = o.computeInactiveConstraints([-1, -1, -1, 1], [-3, -4, -5, 6])
        expect(result).to.eql([2])

        result = o.computeInactiveConstraints([-1, -1, -1, 1], [-3, -4, -6, 5])
        expect(result).to.eql([3])

        result = o.computeInactiveConstraints([-1, -1, 1, -1], [-3, -4, 5, -5])
        expect(result).to.eql([2])

        result = o.computeInactiveConstraints([1, -1, -1, -1], [3, -4, -5, -5])
        expect(result).to.eql([0])

        result = o.computeInactiveConstraints([1, -1, -1, -1], [4, -3, -5, -5])
        expect(result).to.eql([1])
    });


    it('has no repeated inactive constaints and handle inflections between Bezier segments', () => {
        const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSpline_R1_to_R2(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        let result = o.computeInactiveConstraints([1, 1, 1, 1, 1, -1, -1, -1], [3, 4, 5, 2, 2, -6, -7, -8])
        expect(result).to.eql([3, 4])

        result = o.computeInactiveConstraints([1, 1, 1, -1, -1, -1, -1, -1], [3, 4, 5, -2, -2, -6, -7, -8])
        expect(result).to.eql([3, 4])

        result = o.computeInactiveConstraints([1, 1, 1, -1, -1, -1, -1, -1, 1, 1, 1, 1], [3, 4, 5, -2, -2, -6, -7, -8, 2, 2, 5, 6])
        expect(result).to.eql([3, 4, 8, 9])

        result = o.computeInactiveConstraints([1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1, 1], [3, 4, 5, -2, -2, -6, -7, -8, -2, -2, 5, 6])
        expect(result).to.eql([3, 4, 8, 9])
    });

    it('can take a symmetric b-spline curve', () => {
        
        
        let cp0 = new Vector_2d(-0.5, 0)
        let cp1 = new Vector_2d(-0.25, 8)
        let cp2 = new Vector_2d(0.25, 8)
        let cp3 = new Vector_2d(0.5, 0)
        let splineTarget = new BSpline_R1_to_R2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        splineTarget.insertKnot(0.2)
        splineTarget.insertKnot(0.8)
        let cp4 = new Vector_2d(-0.5, 0)
        let cp5 = new Vector_2d(-0.25, 7)
        let cp6 = new Vector_2d(0.25, 7)
        let cp7 = new Vector_2d(0.5, 0)
        let splineInitial = new BSpline_R1_to_R2([cp4, cp5, cp6, cp7], [0, 0, 0, 0, 1, 1, 1, 1])
        splineInitial.insertKnot(0.2)
        splineInitial.insertKnot(0.8)        
        let optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        
    });

    it('has a number of independent variables equal to twice the number of control points special case', () => {
        let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0.1], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.controlPoints.length * 2)
    });

    it('has no nan in constraint vector', () => {
        let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0.1], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        expect(containsNaN(o.g())).to.equal(false)
    });

    it('has no zeros in constraint vector', () => {
        let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0.1], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        const constraint_vector = o.g()
        for (let i = 0; i < constraint_vector.length; i += 1) {
            expect(constraint_vector[i]).to.not.equal(0)
        }

    });

    it('has no nan in gradient constraint matrix', () => {
        let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0.1], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        const m = o.gradient_g()
        const is_nan = false
        for (let i = 0; i < m.shape[0]; i += 1) {
            for (let j = 0; j < m.shape[1]; j += 1) {
                expect (m.get(i, j)).to.not.equal(NaN)
                }
        }
        

    });




});