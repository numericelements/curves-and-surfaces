
import { TrustRegionSubproblem } from "./TrustRegionSubproblem"
import { dotProduct, multiplyVectorByScalar, addTwoVectors, saxpy2, zeroVector, norm} from "../linearAlgebra/MathVectorBasicOperations"
import { OptimizationProblemInterface } from "./OptimizationProblemInterface" 
import { SymmetricMatrixInterface, MatrixInterface } from "../linearAlgebra/MatrixInterfaces" 
import { SymmetricMatrix } from "../linearAlgebra/SymmetricMatrix" 
import { CholeskyDecomposition } from "../linearAlgebra/CholeskyDecomposition";
import { Optimizer } from "./Optimizer"

export class QuasiNewtonOptimizer extends Optimizer {

    public success = false
    private barrierHessianApproximation: SymmetricMatrix[] = []
    private previousGradient_f: MatrixInterface

    constructor(o: OptimizationProblemInterface ) {
        super(o)
        const numberOfConstraints = this.o.f.length
        if (this.o.f.length !== this.o.gradient_f.shape[0] ) {
            console.log("Problem about f length and gradient_f shape 0 is in the Optimizer Constructor")
        }
        for (let i = 0; i < numberOfConstraints; i += 1) {
            this.barrierHessianApproximation.push(new SymmetricMatrix(this.o.gradient_f.shape[1]))
        }
        this.previousGradient_f = o.gradient_f
    }

    optimize_using_trust_region(epsilon: number = 10e-8, maxTrustRadius = 10, maxNumSteps: number = 800) {
        this.success = false
        // Bibliographic reference: Numerical Optimization, second edition, Jorge Nocedal and Stephen J. Wright, p. 69
        let numSteps = 0
        let t = this.o.numberOfConstraints / this.o.f0
        let trustRadius = 9
        let rho: number 
        const eta = 0.1 // [0, 1/4)
        const mu = 10 // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 569
        let counter = 0
        //while (this.o.numberOfConstraints / t > epsilon) {
        while ( 10 / t > epsilon) {
            //console.log(t)
            while (true) {
            counter += 1
                numSteps += 1              
                if (this.o.f.length !== this.o.gradient_f.shape[0] ) {
                    console.log("Problem about f length and gradient_f shape 0 is in the function optimize_using_trust_region")
                }
                let b = this.barrier(this.o.f, this.o.gradient_f, this.o.hessian_f)
                let gradient = saxpy2(t, this.o.gradient_f0, b.gradient)
                let hessian = b.hessian.plusSymmetricMatrixMultipliedByValue(this.o.hessian_f0, t)
                let trustRegionSubproblem = new TrustRegionSubproblem(gradient, hessian);
                let tr = trustRegionSubproblem.solve(trustRadius)
                let fStep = this.o.fStep(tr.step)
                let numSteps2 = 0
                while(Math.max.apply(null, fStep) >= 0) {
                    numSteps2 += 1
                    trustRadius *= 0.25
                    tr = trustRegionSubproblem.solve(trustRadius)
                    fStep = this.o.fStep(tr.step)
                    if (numSteps2 > 100) {
                        throw new Error("maxSteps2 > 100")
                    }
                }

                let barrierValueStep = this.barrierValue(fStep)
                let actualReduction = t * (this.o.f0 - this.o.f0Step(tr.step)) + (b.value - barrierValueStep)
                let predictedReduction = -dotProduct(gradient, tr.step) - 0.5 * hessian.quadraticForm(tr.step)

                rho = actualReduction / predictedReduction
                if (rho < 0.25) {
                    trustRadius *= 0.25;
                } else if (rho > 0.75 && tr.hitsBoundary) {
                    trustRadius = Math.min(2 * trustRadius, maxTrustRadius)
                }
                if (rho > eta) {
                    this.o.step(tr.step)
                    this.updateSymmetricRank1(tr.step, this.o.f, this.o.gradient_f)
                }
                if (numSteps > maxNumSteps) {
                    return
                }
                if ((new CholeskyDecomposition(hessian).success)) {
                    let newtonDecrementSquared = -dotProduct(gradient, tr.step)
                    if (newtonDecrementSquared < 0) {
                        throw new Error("newtonDecrementSquared is smaller than zero")
                    }
                    if (newtonDecrementSquared < epsilon) {
                        break
                    }
                }
                if (trustRadius < 10e-18) {
                    console.log(b)
                    throw new Error("trust Radius < 10e-18")
                }
            }
            t *= mu;
        }
        this.success = true
        //console.log(counter)
    }



    newtonDecrementSquared(newtonStep: number[], t: number, gradient_f0: number[], barrierGradient: number[]) {
        return -dotProduct(saxpy2(t, gradient_f0, barrierGradient), newtonStep)
    }

    barrierValue(f: number[]) {
        let result = 0
        const n = f.length
        for (let i = 0; i < n; i += 1) {
            result -= Math.log(-f[i])
        }
        return result;
    }

    barrierGradient(f: number[], gradient_f: MatrixInterface) {
        let result = zeroVector(gradient_f.shape[1])
        const n = f.length
        const m = gradient_f.shape[1]
        if (n !== gradient_f.shape[0]){
            throw new Error("barrierGradient f and gradient_f dimensions do not match")
        }

        for (let i = 0; i < n; i += 1) {
            for (let j = 0; j < m; j += 1) {
                if (f[i] === 0) {
                    throw new Error("barrierGradient makes a division by zero")
                }
                result[j] += -gradient_f.get(i, j) / f[i]
            }
        }
        return result;
    }

    barrierHessian(f: number[], gradient_f: MatrixInterface, hessian_f?: SymmetricMatrixInterface[]) {
        // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 564
        const m = gradient_f.shape[0]
        const n = gradient_f.shape[1]
        let result = new SymmetricMatrix(n)
        // barrier hessian first term
        for (let i = 0; i < m; i += 1) {
            for (let k = 0; k < n; k += 1) {
                for (let l = 0; l <= k; l += 1) {
                    result.addAt(k, l, gradient_f.get(i, k) * gradient_f.get(i, l) / (f[i] * f[i]))
                }
            }
        }
        // barrier hessian second term
        if (hessian_f) {
            for (let i = 0; i < n; i += 1){
                for (let j = 0; j <= i; j += 1){
                    for (let k = 0; k < f.length; k += 1){
                        result.addAt(i, j, -hessian_f[k].get(i,j) / f[k]);
                    }
                }
            }
        } else {
            for (let i = 0; i < n; i += 1){
                for (let j = 0; j <= i; j += 1){
                    for (let k = 0; k < f.length; k += 1){
                        result.addAt(i, j, -this.barrierHessianApproximation[k].get(i,j) / f[k]);
                    }
                }
            }
        }
        return result;
    }

    /**
     * Update the symmetric matrix hessian with an improvement of rank 1
     * See: Jorge Nocedal and Stephen J. Wright, 
     * Numerical Optimization, Second Edition, p. 144 (The SR1 Method)
     */
    updateSymmetricRank1(step: number[], f: number[], gradient_f: MatrixInterface) {
        let m = gradient_f.shape[0] // number of constraints
        let n = gradient_f.shape[1] // number of free variables
        let deltaGradient: number[][] = []
        for (let i = 0; i < m; i += 1) {
            deltaGradient.push([])
            for (let j = 0; j < n; j += 1) {
                deltaGradient[i].push(gradient_f.get(i, j) - this.previousGradient_f.get(i, j))
            }
        }
        for (let i = 0; i < m ; i += 1) {
            const hessian = this.computeSR1(step, deltaGradient[i], this.barrierHessianApproximation[i])
            if (hessian) {
                this.barrierHessianApproximation[i] = hessian
            }
        }
        this.previousGradient_f = gradient_f
    }

    computeSR1(step: number[], deltaGradient: number[], previousHessian: SymmetricMatrix, r = 10e-8 ) {
        let m = step.length
        let result: SymmetricMatrix = new SymmetricMatrix(m)
        let v: number[] = []
        for (let i = 0; i < m; i += 1) {
            let c = 0
            for (let j = 0; j < m; j += 1 ) {
                c += previousHessian.get(i, j) * step[j]
            }
            v.push(deltaGradient[i] - c)
        }
        const vTs =  dotProduct(step, v)
        if ( vTs <= r * norm(step) * norm(v)) {
            return undefined
        }
        for (let i = 0; i < m; i += 1) {
            for (let j = 0; j <= i; j += 1 ) {
                let h = previousHessian.get(i, j)
                let vvT = v[i]*v[j]
                result.set(i, j, h + vvT/vTs)
            }
        }
        /*
        for (let i = 0; i < result.shape[0]; i += 1) {
            for (let j = 0; j < result.shape[1]; j+= 1) {
                console.log(result.get(i, j))
            }
        }
        */
        return result
    }

    barrier(f: number[], gradient_f: MatrixInterface, hessian_f?: SymmetricMatrixInterface[]) {
        return {value: this.barrierValue(f),
                gradient: this.barrierGradient(f, gradient_f),
                hessian: this.barrierHessian(f, gradient_f, hessian_f)
            }
    }

    backtrackingLineSearch(t: number, newtonStep: number[], f0: number, barrierValue: number, gradient_f0: number[], barrierGradient: number[]) {
        const alpha = 0.2 
        const beta = 0.5 
        let result = 1
        let step = newtonStep.slice()
        while (Math.max(...this.o.fStep(step)) > 0 ) {
            result *= beta
            step = multiplyVectorByScalar(newtonStep, result)
        }
        while (t * this.o.f0Step(step) + this.barrierValue(this.o.fStep(step)) > t * f0 + barrierValue 
        + alpha * result * dotProduct(addTwoVectors(multiplyVectorByScalar(gradient_f0, t), barrierGradient), newtonStep) ) {
            result *= beta
            step = multiplyVectorByScalar(newtonStep, result)
        }
        return result
    }

    computeNewtonStep(gradient: number[], hessian: SymmetricMatrix) {
        let choleskyDecomposition = new CholeskyDecomposition(hessian)
        if (choleskyDecomposition.success === false) {
            console.log("choleskyDecomposition failed")
        }
        return choleskyDecomposition.solve(multiplyVectorByScalar(gradient, -1))
    }

    optimize_using_line_search(epsilon: number = 10e-6, maxNumSteps: number = 300) {
        // Bibliographic reference: Numerical Optimization, second edition, Jorge Nocedal and Stephen J. Wright, p. 69
        let numSteps = 0
        let t = this.o.numberOfConstraints / this.o.f0 
        let rho: number 
        const eta = 0.1 // [0, 1/4)
        const mu = 10 // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 569
        while (this.o.numberOfConstraints / t > epsilon) {
            while (true) {
                numSteps += 1;
                const b = this.barrier(this.o.f, this.o.gradient_f, this.o.hessian_f)
                const gradient = saxpy2(t, this.o.gradient_f0, b.gradient)
                const hessian = b.hessian.plusSymmetricMatrixMultipliedByValue(this.o.hessian_f0, t)
                const newtonStep = this.computeNewtonStep(gradient, hessian)
                const stepRatio = this.backtrackingLineSearch(t, newtonStep, this.o.f0, b.value, this.o.gradient_f0, b.gradient)
                const step = multiplyVectorByScalar(newtonStep, stepRatio)
                this.o.step(step)
                if (numSteps > maxNumSteps) {
                    console.log("numSteps > maxNumSteps")
                    return
                }
                let newtonDecrementSquared = this.newtonDecrementSquared(step, t, this.o.gradient_f0, b.gradient)
                if (newtonDecrementSquared < 0) {
                    throw new Error("newtonDecrementSquared is smaller than zero")
                }
                if (newtonDecrementSquared < epsilon) {
                    break
                }

            }
            t *= mu
        }
    }
}