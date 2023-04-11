import { expect } from 'chai';
import { OptimizationProblem_BSpline_R1_to_R2, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints} from '../../src/bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2';
import { create_BSplineR1toR2V2d, BSplineR1toR2 } from '../../src/newBsplines/BSplineR1toR2';
import { zeroVector, containsNaN } from '../../src/linearAlgebra/MathVectorBasicOperations';
import { identityMatrix } from '../../src/linearAlgebra/DiagonalMatrix';
import { BSplineR1toR2DifferentialProperties } from '../../src/newBsplines/BSplineR1toR2DifferentialProperties';
import { Vector2d } from '../../src/mathVector/Vector2d';




describe('OptimizationProblem_BSpline_R1_to_R2', () => {

    it('has a number of independent variables equal to twice the number of control points', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.25, 7)
        const cp2 = new Vector2d(0.25, 7)
        const cp3 = new Vector2d(0.5, 0)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.controlPoints.length * 2)
    });

    it('has a zero value objective function for a spline that is identical to the target', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.25, 7)
        const cp2 = new Vector2d(0.25, 7)
        const cp3 = new Vector2d(0.5, 0)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        expect( o.f0 ).to.equal(0)
        let deltaX = zeroVector(splineInitial.controlPoints.length * 2)
        o.step(deltaX)
        expect( o.f0 ).to.equal(0)
    });

    it('returns an identity matrix for its objective function hessian', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.25, 7)
        const cp2 = new Vector2d(0.25, 7)
        const cp3 = new Vector2d(0.5, 0)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        expect(o.hessian_f0).to.eql(identityMatrix(splineInitial.controlPoints.length * 2))
    });

    it('has a number of constraints + free indices equal to (4 * d - 5) * (n - d) for curvature extrema', () => {
        //If the b-spline is of degree d, the curvature derivative numerator is of degree (4d - 6) and is itself decomposed
        //into (n - d) Bezier segments. Each Bezier segment has (4d - 5) control points. There are then (4d - 5) * (n - d)
        // available control points
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.25, 0.25)
        const cp2 = new Vector2d(0.25, 0.25)
        const cp3 = new Vector2d(0.5, 0)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        const n = splineInitial.controlPoints.length
        const d = splineInitial.degree
        const numberOfConstraints = o.numberOfConstraints
        const numberOfConstraintsFreeIndices = o.curvatureExtremaInactiveConstraints.length

        
        // n - d = 1
        // 4 * d - 5 = 7
        const g = o.g()
        // g = [-2.53, -1.69, -4.2, 0, 4.2, 1.69, 2.53]
        expect(o.curvatureExtremaInactiveConstraints).to.eql([3])
        //expect(numberOfConstraints + numberOfConstraintsFreeIndices).to.equal( (4 * d - 5) * (n - d) )
        expect(g.length).to.equal( (4 * d - 5) * (n - d) )

    
        const dp = new BSplineR1toR2DifferentialProperties(splineInitial)
        expect(dp.curvatureDerivativeNumerator().controlPoints).to.eql(o.g())
        

    });

    it('returns f of length number of constraints and a gradient_f of shape [number of constraints, number of independent variables]', () => {
        //If the b-spline is of degree d, the curvature derivative numerator is of degree (4d - 6) and is itself decomposed
        //into (n - d) Bezier segments. Each Bezier segment has (4d - 5) control points. There are then (4d - 5) * (n - d)
        // available control points
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.25, 0.25)
        const cp2 = new Vector2d(0.25, 0.25)
        const cp3 = new Vector2d(0.5, 0)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        expect(o.gradient_f.shape).to.eql([10, 8])
        expect(o.f.length).to.eql(10)

        const numberOfConstraintsFreeIndicesCurvatureExtrema = o.curvatureExtremaInactiveConstraints.length
        expect(numberOfConstraintsFreeIndicesCurvatureExtrema).to.eql(1)

        const numberOfConstraintsFreeIndicesInflection = o.inflectionInactiveConstraints.length
        expect(numberOfConstraintsFreeIndicesInflection).to.eql(0)

    });

    it('returns gradient_f such that a dot product of a rigid motion equal to zero', () => {
        //If the b-spline is of degree d, the curvature derivative numerator is of degree (4d - 6) and is itself decomposed
        //into (n - d) Bezier segments. Each Bezier segment has (4d - 5) control points. There are then (4d - 5) * (n - d)
        // available control points
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.25, 0.000005)
        const cp2 = new Vector2d(0.25, 0.00002)
        const cp3 = new Vector2d(0.5, 0)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.000005], [0.25, 0.00002], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.000005], [0.25, 0.00002], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
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
        
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0.1)
        const cp1 = new Vector2d(-0.25, 0.25)
        const cp2 = new Vector2d(0.25, 0.25)
        const cp3 = new Vector2d(0.5, 0.1)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0.1], [-0.25, 0.25], [0.25, 0.25], [0.5, 0.1]], [0, 0, 0, 0, 1, 1, 1, 1])
        const cp4 = new Vector2d(0.5, 0)
        let splineInitial = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp4], [0, 0, 0, 0, 1, 1, 1, 1])
        //let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 0.25], [0.25, 0.25], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
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

        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0.5)
        const cp1 = new Vector2d(-0.25, -0.4)
        const cp2 = new Vector2d(0.25, 0.0)
        const cp3 = new Vector2d(0.5, -0.5)
        const cp = [ cp0, cp1, cp2, cp3 ]
        //const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSplineR1toR2V2d(cp, knots)
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
        
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0.5)
        const cp1 = new Vector2d(-0.25, -0.4)
        const cp2 = new Vector2d(0.25, 0.0)
        const cp3 = new Vector2d(0.5, -0.5)
        const cp = [ cp0, cp1, cp2, cp3 ]
        //const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSplineR1toR2V2d(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        let result = o.computeSignChangeIntervals([-1, -1, 1, 1])
        expect(result).to.eql([1])

        let result1 = o.computeSignChangeIntervals([-1, -1, 1, 1, -1, -1])
        expect(result1).to.eql([1, 3])

    });

    it('can compute ControlPoints Closest To Zero at sign changes', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0.5)
        const cp1 = new Vector2d(-0.25, -0.4)
        const cp2 = new Vector2d(0.25, 0.0)
        const cp3 = new Vector2d(0.5, -0.5)
        const cp = [ cp0, cp1, cp2, cp3 ]
        //const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSplineR1toR2V2d(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        let t1 = o.computeControlPointsClosestToZero([1], [-5, -3, 5, 5],)
        expect(t1).to.eql([1])

        let t2 = o.computeControlPointsClosestToZero([1], [-5, -5, 3, 5])
        expect(t2).to.eql([2])

        let t3 = o.computeControlPointsClosestToZero([0, 2], [5, -3, -5, 5.1])
        expect(t3).to.eql([1, 2])

        /* for compatibility with PolygonWithVerticesR1 class*/
        let c4 = o.computeConstraintsSign([-5, -10, 1, -2, -1, 2, 1, -0.5])
        expect(c4).to.eql([1, 1, -1, 1, 1, -1, -1, 1])
        let s4 = o.computeSignChangeIntervals(c4)
        expect(s4).to.eql([1, 2, 4, 6])
        let t4 = o.computeControlPointsClosestToZero(s4, [-5, -10, 1, -2, -1, 2, 1, -0.5])
        expect(t4).to.eql([2, 4, 7])

        let c5 = o.computeConstraintsSign([-5, -10, 1, -0.5, -1, 2, 1, -0.5])
        expect(c5).to.eql([1, 1, -1, 1, 1, -1, -1, 1])
        let s5 = o.computeSignChangeIntervals(c5)
        expect(s5).to.eql([1, 2, 4, 6])
        let t5 = o.computeControlPointsClosestToZero(s5, [-5, -10, 1, -0.5, -1, 2, 1, -0.5])
        expect(t5).to.eql([2, 4, 7])
        // expect(t5).to.eql([2, 3, 4, 7])

        let c6 = o.computeConstraintsSign([-0.5, 1, 2, -1, -0.5, 1, -10, -5])
        expect(c6).to.eql([1, -1, -1, 1, 1, -1, 1, 1])
        let s6 = o.computeSignChangeIntervals(c6)
        expect(s6).to.eql([0, 2, 4, 5])
        let t6 = o.computeControlPointsClosestToZero(s6, [-0.5, 1, 2, -1, -0.5, 1, -10, -5])
        expect(t6).to.eql([0, 3, 5])
    });

    it('can add Inactive Constraints For Inflections', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0.5)
        const cp1 = new Vector2d(-0.25, -0.4)
        const cp2 = new Vector2d(0.25, 0.0)
        const cp3 = new Vector2d(0.5, -0.5)
        const cp = [ cp0, cp1, cp2, cp3 ]
        //const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSplineR1toR2V2d(cp, knots)
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
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0.5)
        const cp1 = new Vector2d(-0.25, -0.4)
        const cp2 = new Vector2d(0.25, 0.0)
        const cp3 = new Vector2d(0.5, -0.5)
        const cp = [ cp0, cp1, cp2, cp3 ]
        //const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSplineR1toR2V2d(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        // let result = o.computeInactiveConstraints([-1, -1, 1, 1], [-3, -4, 5, 6])
        let result = o.computeInactiveConstraints([-3, -4, 5, 6])
        expect(result).to.eql([1])

        // result = o.computeInactiveConstraints([-1, -1, -1, 1], [-3, -4, -5, 6])
        result = o.computeInactiveConstraints([-3, -4, -5, 6])
        expect(result).to.eql([2])

        // result = o.computeInactiveConstraints([-1, -1, -1, -1], [-3, -4, -5, -6])
        result = o.computeInactiveConstraints([-3, -4, -5, -6])
        expect(result).to.eql([])

        // result = o.computeInactiveConstraints([-1, -1, -1, 1], [-3, -4, -5, 6])
        result = o.computeInactiveConstraints([-3, -4, -5, 6])
        expect(result).to.eql([2])

        // result = o.computeInactiveConstraints([-1, -1, -1, 1], [-3, -4, -6, 5])
        result = o.computeInactiveConstraints([-3, -4, -6, 5])
        expect(result).to.eql([3])

        // result = o.computeInactiveConstraints([-1, -1, 1, -1], [-3, -4, 5, -5])
        result = o.computeInactiveConstraints([-3, -4, 5, -5])
        expect(result).to.eql([2])

        // result = o.computeInactiveConstraints([1, -1, -1, -1], [3, -4, -5, -5])
        result = o.computeInactiveConstraints([3, -4, -5, -5])
        expect(result).to.eql([0])

        // result = o.computeInactiveConstraints([1, -1, -1, -1], [4, -3, -5, -5])
        result = o.computeInactiveConstraints([4, -3, -5, -5])
        expect(result).to.eql([1])
    });


    it('has no repeated inactive constaints and handle inflections between Bezier segments', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0.5)
        const cp1 = new Vector2d(-0.25, -0.4)
        const cp2 = new Vector2d(0.25, 0.0)
        const cp3 = new Vector2d(0.5, -0.5)
        const cp = [ cp0, cp1, cp2, cp3 ]
        //const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        let splineInitial = create_BSplineR1toR2V2d(cp, knots)
        let splineTarget = splineInitial.clone()
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        // let result = o.computeInactiveConstraints([1, 1, 1, 1, 1, -1, -1, -1], [3, 4, 5, 2, 2, -6, -7, -8])
        let result = o.computeInactiveConstraints([3, 4, 5, 2, 2, -6, -7, -8])
        expect(result).to.eql([3, 4])

        // result = o.computeInactiveConstraints([1, 1, 1, -1, -1, -1, -1, -1], [3, 4, 5, -2, -2, -6, -7, -8])
        result = o.computeInactiveConstraints([3, 4, 5, -2, -2, -6, -7, -8])
        expect(result).to.eql([3, 4])

        // result = o.computeInactiveConstraints([1, 1, 1, -1, -1, -1, -1, -1, 1, 1, 1, 1], [3, 4, 5, -2, -2, -6, -7, -8, 2, 2, 5, 6])
        result = o.computeInactiveConstraints([3, 4, 5, -2, -2, -6, -7, -8, 2, 2, 5, 6])
        expect(result).to.eql([3, 4, 8, 9])

        // result = o.computeInactiveConstraints([1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1, 1], [3, 4, 5, -2, -2, -6, -7, -8, -2, -2, 5, 6])
        result = o.computeInactiveConstraints([3, 4, 5, -2, -2, -6, -7, -8, -2, -2, 5, 6])
        expect(result).to.eql([3, 4, 8, 9])
    });

    it('can take a symmetric b-spline curve', () => {
        
        
        let cp0 = new Vector2d(-0.5, 0)
        let cp1 = new Vector2d(-0.25, 8)
        let cp2 = new Vector2d(0.25, 8)
        let cp3 = new Vector2d(0.5, 0)
        let splineTarget = new BSplineR1toR2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        splineTarget.insertKnot(0.2)
        splineTarget.insertKnot(0.8)
        let cp4 = new Vector2d(-0.5, 0)
        let cp5 = new Vector2d(-0.25, 7)
        let cp6 = new Vector2d(0.25, 7)
        let cp7 = new Vector2d(0.5, 0)
        let splineInitial = new BSplineR1toR2([cp4, cp5, cp6, cp7], [0, 0, 0, 0, 1, 1, 1, 1])
        splineInitial.insertKnot(0.2)
        splineInitial.insertKnot(0.8)        
        let optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        
    });

    it('has a number of independent variables equal to twice the number of control points special case', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.25, 7)
        const cp2 = new Vector2d(0, 0)
        const cp3 = new Vector2d(0.25, 7)
        const cp4 = new Vector2d(0.5, 0)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        //let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        const cp5 = new Vector2d(-0.5, 0)
        const cp6 = new Vector2d(-0.25, 7)
        const cp7 = new Vector2d(0, 0)
        const cp8 = new Vector2d(0.25, 7)
        const cp9 = new Vector2d(0.5, 0)
        let splineInitial = create_BSplineR1toR2V2d([cp5, cp6, cp7, cp8, cp9], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        //let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0.1], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.controlPoints.length * 2)
    });

    it('has no nan in constraint vector', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.25, 7)
        const cp2 = new Vector2d(0, 0)
        const cp3 = new Vector2d(0.25, 7)
        const cp4 = new Vector2d(0.5, 0)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        //let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        const cp5 = new Vector2d(-0.5, 0.1)
        const cp6 = new Vector2d(-0.25, 7)
        const cp7 = new Vector2d(0, 0)
        const cp8 = new Vector2d(0.25, 7)
        const cp9 = new Vector2d(0.5, 0)
        let splineInitial = create_BSplineR1toR2V2d([cp5, cp6, cp7, cp8, cp9], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        //let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0.1], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        expect(containsNaN(o.g())).to.equal(false)
    });

    it('has no zeros in constraint vector', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.25, 7)
        const cp2 = new Vector2d(0, 0)
        const cp3 = new Vector2d(0.25, 7)
        const cp4 = new Vector2d(0.5, 0)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        //let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        const cp5 = new Vector2d(-0.5, 0.1)
        const cp6 = new Vector2d(-0.25, 7)
        const cp7 = new Vector2d(0, 0)
        const cp8 = new Vector2d(0.25, 7)
        const cp9 = new Vector2d(0.5, 0)
        let splineInitial = create_BSplineR1toR2V2d([cp5, cp6, cp7, cp8, cp9], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        //let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0.1], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        const constraint_vector = o.g()
        for (let i = 0; i < constraint_vector.length; i += 1) {
            expect(constraint_vector[i]).to.not.equal(0)
        }

    });

    it('has no nan in gradient constraint matrix', () => {
        /* JCL 2020/10/19 Take into account the modification of create_BSpline_R1_to_R2 */
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.25, 7)
        const cp2 = new Vector2d(0, 0)
        const cp3 = new Vector2d(0.25, 7)
        const cp4 = new Vector2d(0.5, 0)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3, cp4], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        //let splineTarget = create_BSpline_R1_to_R2([[-0.5, 0], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        const cp5 = new Vector2d(-0.5, 0.1)
        const cp6 = new Vector2d(-0.25, 7)
        const cp7 = new Vector2d(0, 0)
        const cp8 = new Vector2d(0.25, 7)
        const cp9 = new Vector2d(0.5, 0)
        let splineInitial = create_BSplineR1toR2V2d([cp5, cp6, cp7, cp8, cp9], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        //let splineInitial = create_BSpline_R1_to_R2([[-0.5, 0.1], [-0.25, 7], [0, 0], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 0.5, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        const m = o.gradient_g()
        const is_nan = false
        for (let i = 0; i < m.shape[0]; i += 1) {
            for (let j = 0; j < m.shape[1]; j += 1) {
                expect (m.get(i, j)).to.not.equal(NaN)
                }
        }
        

    });

    it('compare constraint inactivation 1', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.25, 7)
        const cp2 = new Vector2d(0.25, 7)
        const cp3 = new Vector2d(0.5, 0)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        const ctrlPts = [-6468381.36,-266511.33,597745.062,51520.05,-159846.34,111507.975,281.475,-283.5,-111510,162596.7,-55920.37,-607691.7,296730,6669621];
        o.computeInactiveConstraints2(ctrlPts);
        expect(o.computeInactiveConstraints2(ctrlPts).length).to.eql(6);
        expect(o.computeInactiveConstraints2(ctrlPts)).to.eql([1,3,6,8,10,12]);
    });

    it('compare constraint inactivation 1', () => {
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.25, 7)
        const cp2 = new Vector2d(0.25, 7)
        const cp3 = new Vector2d(0.5, 0)
        let splineTarget = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2V2d([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        const ctrlPts = [450.72,-81.945,-66.29,14.42,-15.9,-81.324,91.32];
        o.computeInactiveConstraints2(ctrlPts);
        expect(o.computeInactiveConstraints2(ctrlPts).length).to.eql(3);
        expect(o.computeInactiveConstraints2(ctrlPts)).to.eql([1,3,5]);
    });
});