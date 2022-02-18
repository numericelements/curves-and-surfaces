import { expect } from 'chai';
import { ConvexOptimizationProblemForTests, OptimizationProblemForTests } from '../../src/optimizers/OptimizationProblemForTests';
import { Optimizer } from '../../src/optimizers/Optimizer';


describe('OptimizationProblemForTests', () => {
    
    it('returns its hessian matrix for f0', () => {
        const o = new OptimizationProblemForTests(0, 0, 5, 0)
        expect(o.hessian_f0.get(0, 0)).to.equal(2)
        expect(o.hessian_f0.get(1, 0)).to.equal(0)
        expect(o.hessian_f0.get(0, 1)).to.equal(0)
        expect(o.hessian_f0.get(1, 1)).to.equal(2)
    });

    it('returns its hessian matrix for f', () => {
        const o = new OptimizationProblemForTests(0, 0, 5, 0)
        expect(o.hessian_f[0].get(0, 0)).to.equal(-4)
        expect(o.hessian_f[0].get(1, 0)).to.equal(0)
        expect(o.hessian_f[0].get(0, 1)).to.equal(0)
        expect(o.hessian_f[0].get(1, 1)).to.equal(4)
    });

    it('can be optimized by the optimizer', () => {
        const o = new OptimizationProblemForTests(0, 0, 2, 0)
        const opt = new Optimizer(o)
        opt.optimize_using_trust_region(10e-8)
        expect(o.x).to.be.closeTo(-1.4915574739042994, 10e-5)
        expect(o.y).to.be.closeTo(0, 10e-4)
    });

    
    it('can be optimized by the optimizer 2', () => {
        const o = new OptimizationProblemForTests(0, 0.4, 0, 5)
        const opt = new Optimizer(o)
        opt.optimize_using_trust_region(10e-8)
        expect(o.x).to.be.closeTo(-0.6318472055045684, 10e-5)
        expect(o.y).to.be.closeTo(-0.6004805487306158, 10e-4)
    });


    it('can be optimized by the optimizer 3', () => {
        const o = new OptimizationProblemForTests(0, 0, 0, 0.4)
        const opt = new Optimizer(o)
        opt.optimize_using_trust_region(10e-8)
        expect(o.x).to.be.closeTo(0, 10e-5)
        expect(o.y).to.be.closeTo(-0.3999991710046955, 10e-4)
    });
    
    

    it('can be optimized by the optimizer 4', () => {
        const o = new OptimizationProblemForTests(0, 0, 0, 0)
        const opt = new Optimizer(o)
        opt.optimize_using_trust_region(10e-8)
        expect(o.x).to.be.closeTo(0, 10e-5)
        expect(o.y).to.be.closeTo(0, 10e-4)
    });

    

    
    it('can be optimized by the optimizer 5', () => {
        const o = new OptimizationProblemForTests(0.0, 0.01, 0.2, 0)
        const opt = new Optimizer(o)
        opt.optimize_using_trust_region(10e-8)
        expect(o.x).to.be.closeTo(-0.2, 10e-5)
        expect(o.y).to.be.closeTo(0, 10e-4)
    });

    it('can be optimized by the optimizer 6', () => {
        const o = new OptimizationProblemForTests(1.2, 0.4, 2, 0)
        const opt = new Optimizer(o)
        opt.optimize_using_trust_region(10e-8)
        expect(o.x).to.be.closeTo(-1.5, 10e-2)
        expect(o.y).to.be.closeTo(0, 10e-2)
    });
    

});

describe('ConvexOptimizationProblemForTests', () => {
    
    it('returns its hessian matrix for f0', () => {
        const o = new ConvexOptimizationProblemForTests(0, 0, 5, 0)
        expect(o.hessian_f0.get(0, 0)).to.equal(2)
        expect(o.hessian_f0.get(1, 0)).to.equal(0)
        expect(o.hessian_f0.get(0, 1)).to.equal(0)
        expect(o.hessian_f0.get(1, 1)).to.equal(2)
    });

    it('returns its hessian matrix for f', () => {
        const o = new ConvexOptimizationProblemForTests(0, 0, 5, 0)
        expect(o.hessian_f[0].get(0, 0)).to.equal(4)
        expect(o.hessian_f[0].get(1, 0)).to.equal(0)
        expect(o.hessian_f[0].get(0, 1)).to.equal(0)
        expect(o.hessian_f[0].get(1, 1)).to.equal(2)
    });

    it('can be optimized by the optimizer', () => {
        const o = new ConvexOptimizationProblemForTests(0.2, 0.1, 2, 0)
        const opt = new Optimizer(o)
        opt.optimize_using_trust_region(10e-8)
        expect(o.x).to.be.closeTo(-0.7071066261080462, 10e-5)
        expect(o.y).to.be.closeTo(0, 10e-4)
    });

    
    it('can be optimized by the optimizer 2', () => {
        const o = new ConvexOptimizationProblemForTests(0, 0.4, 0, 5)
        const opt = new Optimizer(o)
        opt.optimize_using_trust_region(10e-8)
        expect(o.x).to.be.closeTo(0, 10e-5)
        expect(o.y).to.be.closeTo(-1, 10e-4)
    });


    it('can be optimized by the optimizer 3', () => {
        const o = new ConvexOptimizationProblemForTests(0, 0, 0, 0.4)
        const opt = new Optimizer(o)
        opt.optimize_using_trust_region(10e-8)
        expect(o.x).to.be.closeTo(0, 10e-5)
        expect(o.y).to.be.closeTo(-0.3999991710046955, 10e-4)
    });
    
    

    it('can be optimized by the optimizer 4', () => {
        const o = new ConvexOptimizationProblemForTests(0, 0, 0, 0)
        const opt = new Optimizer(o)
        opt.optimize_using_trust_region(10e-8)
        expect(o.x).to.be.closeTo(0, 10e-5)
        expect(o.y).to.be.closeTo(0, 10e-4)
    });

    


    it('can be optimized by the optimizer 5', () => {
        const o = new ConvexOptimizationProblemForTests(0.0, 0.01, 0.2, 0)
        const opt = new Optimizer(o)
        opt.optimize_using_trust_region(10e-8)
        expect(o.x).to.be.closeTo(-0.2, 10e-5)
        expect(o.y).to.be.closeTo(0, 10e-4)
    });


    
    

});