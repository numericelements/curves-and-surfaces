import { expect } from 'chai';
import { Optimizer } from '../src/mathematics/Optimizer';
import { OptimizationProblem_BSpline_R1_to_R2, OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints } from '../src/mathematics/OptimizationProblem_BSpline_R1_to_R2';
import { BSpline_R1_to_R2, create_BSpline_R1_to_R2 } from '../src/mathematics/BSpline_R1_to_R2';
import { Vector_2d } from '../src/mathematics/Vector_2d';
//import { create_PeriodicBSpline_R1_to_R2 } from '../src/mathematics/PeriodicBSpline_R1_to_R2';
//import { OptimizationProblem_PeriodicBSpline_R1_to_R2 } from '../src/mathematics/OptimizationProblem_PeriodicBSpline_R1_to_R2';
import { zeroVector } from '../src/mathematics/MathVectorBasicOperations';



describe('Optimizer', () => {

    

    it('can solve a optimization problem with b-spline curve', () => {

        let cp0 = new Vector_2d(-0.5, 0)
        let cp1 = new Vector_2d(-0.2, 7)
        let cp2 = new Vector_2d(0.25, 8)
        let cp3 = new Vector_2d(0.5, 0)
        let splineTarget = new BSpline_R1_to_R2([cp0, cp1, cp2, cp3], [0, 0, 0, 0, 1, 1, 1, 1])
        splineTarget.insertKnot(0.5)
        let cp4 = new Vector_2d(-0.5, 0)
        let cp5 = new Vector_2d(-0.2, 4)
        let cp6 = new Vector_2d(0.25, 4)
        let cp7 = new Vector_2d(0.5, 0)
        let splineInitial = new BSpline_R1_to_R2([cp4, cp5, cp6, cp7], [0, 0, 0, 0, 1, 1, 1, 1])
        splineInitial.insertKnot(0.5)
        let optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)
        let opt = new Optimizer(optimizationProblem)
        opt.optimize_using_trust_region()
        let result = optimizationProblem.spline
        expect(splineTarget.evaluate(0.5).y - result.evaluate(0.5).y).to.be.below(10e-7)
    
    });

    
    it('can solve a symmetric optimization problem with b-spline curve', () => {
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
        let opt = new Optimizer(optimizationProblem)
        opt.optimize_using_trust_region()
        let result = optimizationProblem.spline
        expect(splineTarget.evaluate(0.5).y - result.evaluate(0.5).y).to.be.below(10e-7)
        
    });
    
    
/*
    it('can solve a symmetric optimization problem with a periodic b-spline curve', () => {


        let px0 = 0, px1 = 0.15, px2 = 0.27, px3 = 0.3
        const py0 = 0, py2 = 0.35, py4 = 0.6, py5 = 0.72
        const cp = [[-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4], 
        [px0, py5], [px1, py4], [px2, py2], [px3, py0], 
        [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4], 
        [-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4] ]
        const knots = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        let splineInitial = create_PeriodicBSpline_R1_to_R2(cp, knots)

        px0 = 0.03
        const cp1 = [[-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4], 
        [px0, py5], [px1, py4], [px2, py2], [px3, py0], 
        [px2, -py2], [px1, -py4], [px0, -py5], [-px1, -py4], 
        [-px2, -py2], [-px3, py0], [-px2, py2], [-px1, py4] ]
        const knots1 = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        let splineTarget = create_PeriodicBSpline_R1_to_R2(cp1, knots1)


        let optimizationProblem = new OptimizationProblem_PeriodicBSpline_R1_to_R2(splineTarget, splineInitial)
        let opt = new Optimizer(optimizationProblem)
        opt.optimize_using_trust_region()
        let result = optimizationProblem.spline
        expect(splineTarget.evaluate(3).y - result.evaluate(3).y).to.be.below(10e-7)
        expect(optimizationProblem.spline.controlPoints[4].x - 0.1).to.be.below(10e-4)
    
    });
    */


    it('can solve a optimization problem with b-spline curve, special case', () => {

        
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
        splineTarget.setControlPoint(0, new Vector_2d(-0.35, 0.5))

        
        
        //let optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints(splineTarget, splineInitial)
        let optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(splineTarget, splineInitial)

        //let optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(splineTarget, splineInitial)


        //let optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2(splineTarget, splineInitial)

        //let optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints(splineTarget, splineInitial)


        
        /*
        optimizationProblem.weigthingFactors[0] = 100
        optimizationProblem.weigthingFactors[optimizationProblem.spline.controlPoints.length] = 100
        optimizationProblem.weigthingFactors[optimizationProblem.spline.controlPoints.length-1] = 100
        optimizationProblem.weigthingFactors[optimizationProblem.spline.controlPoints.length*2-1] = 100
        */

        optimizationProblem.weigthingFactors[0] = 2
        optimizationProblem.weigthingFactors[optimizationProblem.spline.controlPoints.length] = 2
        optimizationProblem.weigthingFactors[optimizationProblem.spline.controlPoints.length-1] = 2
        optimizationProblem.weigthingFactors[optimizationProblem.spline.controlPoints.length*2-1] = 2
        //let junk = optimizationProblem.hessian_f0.get(0, 0)
        
        

        let opt = new Optimizer(optimizationProblem)
        opt.optimize_using_trust_region(10e-8, 10, 800)
        
        let result = optimizationProblem.spline
        expect(splineTarget.evaluate(0.5).y - result.evaluate(0.5).y).to.be.below(10e-7)
        
        
    });
    


});