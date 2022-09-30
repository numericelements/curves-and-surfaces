import { expect } from 'chai'
import { OpBSplineR1toR2Hessian} from '../../../src/optimizationProblems/alternatives/OpBSplineR1toR2Hessian'
import { BSplineR1toR2, create_BSplineR1toR2} from '../../../src/bsplines/R1toR2/BSplineR1toR2'
import { Vector2d } from '../../../src/mathVector/Vector2d'
import { ActiveControl } from '../../../src/optimizationProblems/BaseOpBSplineR1toR2'




describe('OpBSplineR1toR2Hessian', () => {

    it('has a number of independent variables equal to twice the number of control points', () => {
        let splineTarget = create_BSplineR1toR2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let splineInitial = create_BSplineR1toR2([[-0.5, 0], [-0.25, 7], [0.25, 7], [0.5, 0]], [0, 0, 0, 0, 1, 1, 1, 1])
        let o = new OpBSplineR1toR2Hessian(splineTarget, splineInitial)
        expect(o.numberOfIndependentVariables).to.equal(splineInitial.controlPoints.length * 2)
    })

    it('can compute curvature extrema constraint gradient', () => {
        const delta = 10e-8
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.1, 0.5)
        const cp2 = new Vector2d(0.1, 0.7)
        const cp3 = new Vector2d(0.5, 0)
        const cp0_delta_x = new Vector2d(-0.5+delta, 0)
        let splineTarget = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])
        let splineInitial = splineTarget.clone()
        let o = new OpBSplineR1toR2Hessian(splineTarget, splineInitial, ActiveControl.curvatureExtrema)

        let splineTarget_delta = new BSplineR1toR2([ cp0_delta_x, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])
        let splineInitial_delta = splineTarget_delta.clone()
        let o_delta = new OpBSplineR1toR2Hessian(splineTarget_delta, splineInitial_delta, ActiveControl.curvatureExtrema)

        let f = o.f
        let f_delta = o_delta.f
        let df = o.gradient_f
        expect(f.length).to.equal(7)
        expect(df.shape).to.deep.equal([7, 8])
        expect((f_delta[0]-f[0])/delta).to.be.closeTo(df.get(0, 0), 2)
        expect((f_delta[1]-f[1])/delta).to.be.closeTo(df.get(1, 0), 2)
        expect((f_delta[2]-f[2])/delta).to.be.closeTo(df.get(2, 0), 2)
        expect((f_delta[3]-f[3])/delta).to.be.closeTo(df.get(3, 0), 2)
    })

    it('can compute curvature extrema constraint hessian', () => {
        const delta = 10e-8
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.1, 0.5)
        const cp2 = new Vector2d(0.1, 0.7)
        const cp3 = new Vector2d(0.5, 0)
        const cp0_delta_x = new Vector2d(-0.5+delta, 0)
        let splineTarget = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])
        let splineInitial = splineTarget.clone()
        let o = new OpBSplineR1toR2Hessian(splineTarget, splineInitial, ActiveControl.curvatureExtrema)

        let splineTarget_delta = new BSplineR1toR2([ cp0_delta_x, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])
        let splineInitial_delta = splineTarget_delta.clone()
        let o_delta = new OpBSplineR1toR2Hessian(splineTarget_delta, splineInitial_delta, ActiveControl.curvatureExtrema)

        let df = o.gradient_f
        let ddf = o.hessian_f
        let df_delta = o_delta.gradient_f

        expect(df.shape).to.deep.equal([7, 8])
        expect(ddf!.length).to.equal(7)
        expect(ddf![0].shape).to.deep.equal([8 ,8])
        
        expect((df_delta.get(0,0)-df.get(0,0))/delta).to.be.closeTo(ddf![0].get(0, 0), 2)
        expect((df_delta.get(1,0)-df.get(1,0))/delta).to.be.closeTo(ddf![1].get(0, 0), 2)
        expect((df_delta.get(2,0)-df.get(2,0))/delta).to.be.closeTo(ddf![2].get(0, 0), 2)
        expect((df_delta.get(3,0)-df.get(3,0))/delta).to.be.closeTo(ddf![3].get(0, 0), 2)
    })

    it('can compute curvature extrema constraint hessian 2', () => {
        const delta = 10e-8
        const cp0 = new Vector2d(-0.5, 0)
        const cp1 = new Vector2d(-0.1, 0.5)
        const cp2 = new Vector2d(0.1, 0.7)
        const cp3 = new Vector2d(0.5, 0)
        const cp1_delta_x = new Vector2d(-0.1+delta, 0.5)
        let splineTarget = new BSplineR1toR2([ cp0, cp1, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])
        let splineInitial = splineTarget.clone()
        let o = new OpBSplineR1toR2Hessian(splineTarget, splineInitial, ActiveControl.curvatureExtrema)

        let splineTarget_delta = new BSplineR1toR2([ cp0, cp1_delta_x, cp2, cp3 ], [ 0, 0, 0, 0, 1, 1, 1, 1 ])
        let splineInitial_delta = splineTarget_delta.clone()
        let o_delta = new OpBSplineR1toR2Hessian(splineTarget_delta, splineInitial_delta, ActiveControl.curvatureExtrema)

        let df = o.gradient_f
        let ddf = o.hessian_f
        let df_delta = o_delta.gradient_f
        
        expect((df_delta.get(0,1)-df.get(0,1))/delta).to.be.closeTo(ddf![0].get(1, 1), 2)
        expect((df_delta.get(1,1)-df.get(1,1))/delta).to.be.closeTo(ddf![1].get(1, 1), 2)
        expect((df_delta.get(2,1)-df.get(2,1))/delta).to.be.closeTo(ddf![2].get(1, 1), 2)
        expect((df_delta.get(3,1)-df.get(3,1))/delta).to.be.closeTo(ddf![3].get(1, 1), 2)
        expect((df_delta.get(0,0)-df.get(0,0))/delta).to.be.closeTo(ddf![0].get(1, 0), 2)
        expect((df_delta.get(1,0)-df.get(1,0))/delta).to.be.closeTo(ddf![1].get(1, 0), 2)
        expect((df_delta.get(2,0)-df.get(2,0))/delta).to.be.closeTo(ddf![2].get(1, 0), 2)
        expect((df_delta.get(0,0)-df.get(0,0))/delta).to.be.closeTo(ddf![0].get(0, 1), 2)
        expect((df_delta.get(1,0)-df.get(1,0))/delta).to.be.closeTo(ddf![1].get(0, 1), 2)
        expect((df_delta.get(2,0)-df.get(2,0))/delta).to.be.closeTo(ddf![2].get(0, 1), 2)

        expect((df_delta.get(2,1)-df.get(2,1))/delta).to.be.closeTo(ddf![2].get(1, 1), 2)
        expect((df_delta.get(2,5)-df.get(2,5))/delta).to.be.closeTo(ddf![2].get(5, 1), 2)
    })






})