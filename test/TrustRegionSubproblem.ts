import { expect } from 'chai';
import { TrustRegionSubproblem, getBoundariesIntersections } from '../src/mathematics/TrustRegionSubproblem';
import { gershgorin_bounds } from '../src/mathematics/TrustRegionSubproblem';
import { frobeniusNorm } from '../src/mathematics/TrustRegionSubproblem';


import { SymmetricMatrix } from '../src/mathematics/SymmetricMatrix';
import { SquareMatrix } from '../src/mathematics/SquareMatrix';
import { norm, randomVector } from '../src/mathematics/MathVectorBasicOperations';
import { dotProduct } from '../src/mathematics/MathVectorBasicOperations';


describe('TrustRegionSubproblem', () => {
    
    it('can compute the Cauchy minimizer', () => {
        let gradient = [0, 1]
        let hessian = new SymmetricMatrix(2, [2, 0, 2])
        let t = new TrustRegionSubproblem(gradient, hessian)
        // d (x^2 + y^2 + y) / dy = 2y + 1
        // df/dy = 0 => y = -0.5
        expect(t.computeCauchyPoint(1)).to.eql([-0, -0.5])
        expect(t.computeCauchyPoint(0.2)).to.eql([-0, -0.2])
        gradient = [1, 0]
        t = new TrustRegionSubproblem(gradient, hessian)
        // d (x^2 + y^2 + x) / dx = 2x + 1
        // df/dx = 0 => x = -0.5
        expect(t.computeCauchyPoint(1)).to.eql([-0.5, -0])
        hessian = new SymmetricMatrix(2, [-2, 0, -2])
        t = new TrustRegionSubproblem(gradient, hessian)
        expect(t.computeCauchyPoint(1)).to.eql([-1, -0])
    });

    it('can compute gershgorin_bounds of a symmetric matrix', () => {
        let gradient = [0, 1]
        let hessian = new SymmetricMatrix(3, [2, 0, 0, 2, 0, 3])
        let g = gershgorin_bounds(hessian)
        expect(g.lowerBound).to.equal(2)
        expect(g.upperBound).to.equal(3)

    });

    it('can compute the Frobenius norm of a matrix', () => {
        let m = new SymmetricMatrix(2, [1, 0, 1])
        let g = frobeniusNorm(m)
        expect(g).to.equal(Math.sqrt(2))
    });


    it('can compute initial Lambdas', () => {
        let gradient = [3, 0]
        let hessian = new SymmetricMatrix(2, [1, 0, 1])
        let t = new TrustRegionSubproblem(gradient, hessian)
        let l = t.initialLambdas(1)
        // max (0, -min_diag, norm(g)/trust_radius - min( gershgorin_upper_bound, frobenius_norm, infinite_norm ) )
        // max (0, -1, 3 - min(1, sqrt(2), 2 ))
        expect(l.lowerBound).to.equal(2)
        // max (0, norm(g)/trust_radius + min( -gershgorin_lower_bound, frobenius_norm, infinite_norm ) )
        // max (0, 3 + min(-1, sqrt(2), 2 ))
        expect(l.upperBound).to.equal(2)
        expect(l.current).to.equal(2)

    });

    it('can solve a very simple convex example', () => {
        let gradient = [0, 1]
        let hessian = new SymmetricMatrix(2, [2, 0, 2])
        let t = new TrustRegionSubproblem(gradient, hessian)
        // d (x^2 + y^2 + y) / dy = 2y + 1
        // df/dy = 0 => y = -0.5
        expect(t.computeCauchyPoint(1)).to.eql([-0, -0.5])
        expect(t.computeCauchyPoint(0.2)).to.eql([-0, -0.2])
        expect(t.solve(1).step).to.eql([0, -0.5000000000000001])
        expect(t.solve(0.2).step).to.eql([-3.469446951953614e-17, -0.2])
    });

    it('can solve a simple convex example', () => {
        // Bibliographic Reference: Trust-Region Methods, Conn, Gould and Toint p. 177

        const k_easy = 0.1
        const k_hard = 0.2
        let gradient = [1, 1, 1, 1]
        let hessian = new SymmetricMatrix(4)
        hessian.set(0, 0, 1)
        hessian.set(1, 1, 2)
        hessian.set(2, 2, 3)
        hessian.set(3, 3, 4)
        let t = new TrustRegionSubproblem(gradient, hessian, k_easy, k_hard)


        let trustRegionRadius = 10
        let gershgorin = gershgorin_bounds(hessian)
        expect(gershgorin.lowerBound).to.equal(1)
        expect(gershgorin.upperBound).to.equal(4)
        let initialLambdas = t.initialLambdas(trustRegionRadius)
        expect(initialLambdas.current).to.equal(0)
       // Math.max(0, Math.max(-minHessianDiagonal, norm(this.gradient) / trustRegionRadius - Math.min(gershgorin.upperBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm))));
        expect(initialLambdas.lowerBound).to.equal(0)
        //Math.max(0, norm(this.gradient) / trustRegionRadius + Math.min(-gershgorin.lowerBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm)));
        expect(initialLambdas.upperBound).to.equal(0)
        let result = t.solve(trustRegionRadius)
        expect(t.lambda.current).to.eql(0)
        expect(result.step).to.eql([-1, -0.5000000000000001, -1/3, -1/4])
        let cauchyPoint = t.computeCauchyPoint(trustRegionRadius)
        let eval1 = dotProduct(gradient, result.step) + 0.5 * hessian.quadraticForm(result.step)
        let eval2 = dotProduct(gradient, cauchyPoint) + 0.5 * hessian.quadraticForm(cauchyPoint)
        expect( eval1 ).to.be.below( eval2 )
        expect(t.numberOfIterations).to.equal(1)



        trustRegionRadius = 1
        initialLambdas = t.initialLambdas(trustRegionRadius)
        expect(initialLambdas.current).to.equal(0)
       // Math.max(0, Math.max(-minHessianDiagonal, norm(this.gradient) / trustRegionRadius - Math.min(gershgorin.upperBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm))));
        expect(initialLambdas.lowerBound).to.equal(0)
        //Math.max(0, norm(this.gradient) / trustRegionRadius + Math.min(-gershgorin.lowerBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm)));
        expect(initialLambdas.upperBound).to.equal(1)
        result = t.solve(trustRegionRadius)
        expect(t.lambda.current).to.eql(0.23349057394184405)
        expect(result.step).to.eql([ -0.8107074517840195, -0.44772967106600303, -0.30926331069551627, -0.23621169872332806])
        expect( Math.abs( norm(result.step) - trustRegionRadius) / trustRegionRadius ).to.be.below(k_easy)
        cauchyPoint = t.computeCauchyPoint(trustRegionRadius)
        eval1 = dotProduct(gradient, result.step) + 0.5 * hessian.quadraticForm(result.step)
        eval2 = dotProduct(gradient, cauchyPoint) + 0.5 * hessian.quadraticForm(cauchyPoint)
        expect( eval1 ).to.be.below( eval2 )
        expect(t.numberOfIterations).to.equal(2)


    });


    it('can solve a simple non convex example', () => {
        // Bibliographic Reference: Trust-Region Methods, Conn, Gould and Toint p. 179

        const k_easy = 0.1
        const k_hard = 0.2
        let gradient = [1, 1, 1, 1]
        let hessian = new SymmetricMatrix(4)
        hessian.set(0, 0, -2)
        hessian.set(1, 1, -1)
        hessian.set(2, 2, 0)
        hessian.set(3, 3, 1)
        let t = new TrustRegionSubproblem(gradient, hessian, k_easy, k_hard)


        let trustRegionRadius = 10
        let gershgorin = gershgorin_bounds(hessian)
        expect(gershgorin.lowerBound).to.equal(-2)
        expect(gershgorin.upperBound).to.equal(1)
        let initialLambdas = t.initialLambdas(trustRegionRadius)
        // Math.max(0, Math.max(-minHessianDiagonal, norm(this.gradient) / trustRegionRadius - Math.min(gershgorin.upperBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm))));
        expect(initialLambdas.lowerBound).to.equal(2)
        //Math.max(0, norm(this.gradient) / trustRegionRadius + Math.min(-gershgorin.lowerBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm)));
        expect(initialLambdas.upperBound).to.equal(2.2)
        //Math.max( Math.sqrt(upperBound * lowerBound), lowerBound + theta * (lowerBound - upperBound) )
        expect(initialLambdas.current).to.equal( Math.sqrt(2 * 2.2) )
        expect(initialLambdas.current).to.equal( 2.0976176963403033 )
        let result = t.solve(trustRegionRadius)
        expect(t.lambda.current).to.eql(2.0976176963403033)
        expect(result.step).to.eql([-10.244044240850739, -0.9110640283353831, -0.47673129462279623, -0.32282873421773617])
        let cauchyPoint = t.computeCauchyPoint(trustRegionRadius)
        let eval1 = dotProduct(gradient, result.step) + 0.5 * hessian.quadraticForm(result.step)
        let eval2 = dotProduct(gradient, cauchyPoint) + 0.5 * hessian.quadraticForm(cauchyPoint)
        expect( eval1 ).to.be.below( eval2 )
        expect( Math.abs( norm(result.step) - trustRegionRadius) / trustRegionRadius ).to.be.below(k_easy)
        expect(t.numberOfIterations).to.equal(1)



        
        trustRegionRadius = 1
        initialLambdas = t.initialLambdas(trustRegionRadius)
        expect(initialLambdas.current).to.equal(2.8284271247461903)
       // Math.max(0, Math.max(-minHessianDiagonal, norm(this.gradient) / trustRegionRadius - Math.min(gershgorin.upperBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm))));
        expect(initialLambdas.lowerBound).to.equal(2)
        //Math.max(0, norm(this.gradient) / trustRegionRadius + Math.min(-gershgorin.lowerBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm)));
        expect(initialLambdas.upperBound).to.equal(4)
        result = t.solve(trustRegionRadius)
        expect(t.lambda.current).to.eql(3.217659532354264)
        expect(result.step).to.eql([  -0.821247625817511, -0.4509258456542251, -0.31078490124414443, -0.23709832250063295])
        expect( Math.abs( norm(result.step) - trustRegionRadius) / trustRegionRadius ).to.be.below(k_easy)
        cauchyPoint = t.computeCauchyPoint(trustRegionRadius)
        eval1 = dotProduct(gradient, result.step) + 0.5 * hessian.quadraticForm(result.step)
        eval2 = dotProduct(gradient, cauchyPoint) + 0.5 * hessian.quadraticForm(cauchyPoint)
        expect( eval1 ).to.be.below( eval2 )
        expect(t.numberOfIterations).to.equal(2)

        

    });

    it('can solve the hard case', () => {
        
        // Bibliographic Reference: Trust-Region Methods, Conn, Gould and Toint p. 180
        const k_easy = 0.1
        const k_hard = 0.2
        let gradient = [0, 1, 1, 1]
        let hessian = new SymmetricMatrix(4)
        hessian.set(0, 0, -2)
        hessian.set(1, 1, -1)
        hessian.set(2, 2, 0)
        hessian.set(3, 3, 1)
        let t = new TrustRegionSubproblem(gradient, hessian, k_easy, k_hard)


        let trustRegionRadius = 10
        let gershgorin = gershgorin_bounds(hessian)
        expect(gershgorin.lowerBound).to.equal(-2)
        expect(gershgorin.upperBound).to.equal(1)
        let initialLambdas = t.initialLambdas(trustRegionRadius)

        
        // Math.max(0, Math.max(-minHessianDiagonal, norm(this.gradient) / trustRegionRadius - Math.min(gershgorin.upperBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm))));
        expect(initialLambdas.lowerBound).to.equal(2)
        //Math.max(0, norm(this.gradient) / trustRegionRadius + Math.min(-gershgorin.lowerBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm)));
        expect(initialLambdas.upperBound).to.equal(2.1732050807568877)
        //Math.max( Math.sqrt(upperBound * lowerBound), lowerBound + theta * (lowerBound - upperBound) )
        //expect(initialLambdas.current).to.equal( Math.sqrt(2 * 2.1732050807568877) )
        expect(initialLambdas.current).to.equal( 2.0848045859297644 )
        let result = t.solve(trustRegionRadius)

        
        expect(t.lambda.current).to.eql(2.0848045859297644)
        expect(result.step).to.eql([-9.799354312643121, -1.6878894213868125, -0.8782742503639317, -0.593564400550473])
        let cauchyPoint = t.computeCauchyPoint(trustRegionRadius)
        let eval1 = dotProduct(gradient, result.step) + 0.5 * hessian.quadraticForm(result.step)
        let eval2 = dotProduct(gradient, cauchyPoint) + 0.5 * hessian.quadraticForm(cauchyPoint)
        expect( eval1 ).to.be.below( eval2 )
        expect( Math.abs( norm(result.step) - trustRegionRadius) / trustRegionRadius ).to.be.below(k_easy)


        
        expect(t.numberOfIterations).to.equal(1)


        trustRegionRadius = 1
        initialLambdas = t.initialLambdas(trustRegionRadius)
        expect(initialLambdas.current).to.equal(2.732050807568877)
       // Math.max(0, Math.max(-minHessianDiagonal, norm(this.gradient) / trustRegionRadius - Math.min(gershgorin.upperBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm))));
        expect(initialLambdas.lowerBound).to.equal(2)
        //Math.max(0, norm(this.gradient) / trustRegionRadius + Math.min(-gershgorin.lowerBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm)));
        expect(initialLambdas.upperBound).to.equal(3.732050807568877)
        result = t.solve(trustRegionRadius)
        expect(t.lambda.current).to.eql(2.732050807568877)
        expect(result.step).to.eql([  -0.36562674574032245, -0.7318823148538462, -0.46399479503677754, -0.3396677644144287])
        expect( Math.abs( norm(result.step) - trustRegionRadius) / trustRegionRadius ).to.be.below(k_easy)
        cauchyPoint = t.computeCauchyPoint(trustRegionRadius)
        eval1 = dotProduct(gradient, result.step) + 0.5 * hessian.quadraticForm(result.step)
        eval2 = dotProduct(gradient, cauchyPoint) + 0.5 * hessian.quadraticForm(cauchyPoint)
        expect(t.numberOfIterations).to.equal(1)

        
        trustRegionRadius = 1.3
        result = t.solve(trustRegionRadius)
        expect(t.lambda.current).to.eql(2.5816067768167104)
        expect(result.step).to.eql([  -0.6821393000541505, -0.8831125790038058, -0.541033922047094, -0.3899749265288985])
        expect( Math.abs( norm(result.step) - trustRegionRadius) / trustRegionRadius ).to.be.below(k_easy)
        cauchyPoint = t.computeCauchyPoint(trustRegionRadius)
        eval1 = dotProduct(gradient, result.step) + 0.5 * hessian.quadraticForm(result.step)
        eval2 = dotProduct(gradient, cauchyPoint) + 0.5 * hessian.quadraticForm(cauchyPoint)
        expect(t.numberOfIterations).to.equal(1)
        

    });

    
    it('can solve a trust region subproblem', () => {
        let hessian = new SymmetricMatrix(2, [-2, 0, 2])
        let gradient = [1, 0]
        let t = new TrustRegionSubproblem(gradient, hessian)
        let result = t.solve(1)
        expect(result.step).eql([-1, 0])
        hessian = new SymmetricMatrix(2, [2, 0, -0.5])
        const theta = 0 / 180 * Math.PI
        const r = new SquareMatrix(2, [Math.cos(theta), -Math.sin(theta), Math.sin(theta), Math.cos(theta)])
        const rt = new SquareMatrix(2, [Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta)])
        let mr = r.multiplyByMatrix(hessian).multiplyByMatrix(rt)
        let mrs = new SymmetricMatrix(2, [mr.get(0, 0), mr.get(0, 1), mr.get(1, 1)])
        gradient = [0.1, 0]
        t = new TrustRegionSubproblem(gradient, mrs)
        result = t.solve(1)
        expect((result.step[0] - Math.sin(theta))).to.be.below(10e-3)
        expect((result.step[1] - Math.cos(theta))).to.be.below(10e-3)
    });

    it('can solve a hard case trust region subproblem with a zero gradient', () => {

        const trustRegionRadius = 1
        const k_easy = 0.1
        const k_hard = 0.2
        const hessian = new SymmetricMatrix(2, [2, 0, -0.5])
        const theta = 0 / 180 * Math.PI
        const r = new SquareMatrix(2, [Math.cos(theta), -Math.sin(theta), Math.sin(theta), Math.cos(theta)])
        const rt = new SquareMatrix(2, [Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta)])
        const mr = r.multiplyByMatrix(hessian).multiplyByMatrix(rt)
        const mrs = new SymmetricMatrix(2, [mr.get(0, 0), mr.get(0, 1), mr.get(1, 1)])
        const gradient = [0, 0]
        const t = new TrustRegionSubproblem(gradient, mrs, k_easy, k_hard)
        const result = t.solve(trustRegionRadius)
        expect((result.step[0] - Math.sin(theta))).to.be.below(10e-5)
        expect((result.step[1] - Math.cos(theta))).to.be.below(10e-5)
    });

    

    it('never produce a worst solution than the cauchy point', () => {  
        const k_easy = 0.1
        const k_hard = 0.2
        for (let i = 0; i < 200; i += 1) {
            let hessian = new SymmetricMatrix(5, randomVector(15))
            let gradient = randomVector(5)
            let t = new TrustRegionSubproblem(gradient, hessian, k_easy, k_hard)
            const trustRegionRadius = 1
            let result = t.solve(trustRegionRadius)
            let cauchyPoint = t.computeCauchyPoint(trustRegionRadius)
            let evalResult = dotProduct(gradient, result.step) + 0.5 * hessian.quadraticForm(result.step)
            let evalCauchy = dotProduct(gradient, cauchyPoint) + 0.5 * hessian.quadraticForm(cauchyPoint)
            expect( evalResult ).to.be.below( evalCauchy )
        }
    });

    it('can compute the intersections of a sphere and a line', () => {
        let point = [0.5, 0]
        let vector = [0, 1]
        const trustRegionRadius = 1
        let b = getBoundariesIntersections(point, vector, trustRegionRadius)
        expect(b.tmin).to.equal(-Math.sqrt(1-Math.pow(0.5, 2)))
        expect(b.tmax - Math.sqrt(1-Math.pow(0.5, 2))).to.be.below(10e-5)

        point = [0, 0]
        vector = [0, 1]
        b = getBoundariesIntersections(point, vector, trustRegionRadius)
        expect(b.tmin).to.equal(-1)
        expect(b.tmax).to.equal(1)

        point = [0, 0]
        vector = [0, 2]
        b = getBoundariesIntersections(point, vector, trustRegionRadius)
        expect(b.tmin).to.equal(-0.5)
        expect(b.tmax).to.equal(0.5)

        point = [0, 0, 0.5]
        vector = [0, 1, 0]
        b = getBoundariesIntersections(point, vector, trustRegionRadius)
        expect(b.tmin).to.equal(-Math.sqrt(1-Math.pow(0.5, 2)))
        expect(b.tmax - Math.sqrt(1-Math.pow(0.5, 2))).to.be.below(10e-5)

    });
    

    



});