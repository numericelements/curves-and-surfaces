"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Optimizer = exports.OptimizerReturnStatus = void 0;
const TrustRegionSubproblem_1 = require("./TrustRegionSubproblem");
const MathVectorBasicOperations_1 = require("../linearAlgebra/MathVectorBasicOperations");
const MathVectorBasicOperations_2 = require("../linearAlgebra/MathVectorBasicOperations");
const MathVectorBasicOperations_3 = require("../linearAlgebra/MathVectorBasicOperations");
const SymmetricMatrix_1 = require("../linearAlgebra/SymmetricMatrix");
const CholeskyDecomposition_1 = require("../linearAlgebra/CholeskyDecomposition");
var OptimizerReturnStatus;
(function (OptimizerReturnStatus) {
    OptimizerReturnStatus[OptimizerReturnStatus["SOLUTION_FOUND"] = 0] = "SOLUTION_FOUND";
    OptimizerReturnStatus[OptimizerReturnStatus["MAX_NB_ITER_REACHED"] = 1] = "MAX_NB_ITER_REACHED";
    OptimizerReturnStatus[OptimizerReturnStatus["SOLUTION_OUTSIDE_SHAPE_SPACE"] = 2] = "SOLUTION_OUTSIDE_SHAPE_SPACE";
    OptimizerReturnStatus[OptimizerReturnStatus["FIRST_ITERATION"] = 3] = "FIRST_ITERATION";
})(OptimizerReturnStatus = exports.OptimizerReturnStatus || (exports.OptimizerReturnStatus = {}));
class Optimizer {
    constructor(optimizationProblem) {
        this.optimizationProblem = optimizationProblem;
        this.success = false;
        if (this.optimizationProblem.f.length !== this.optimizationProblem.gradient_f.shape[0]) {
            console.log("Problem about f length and gradient_f shape 0 is in the Optimizer Constructor");
        }
    }
    optimize_using_trust_region(epsilon = 10e-8, maxTrustRadius = 10, maxNumSteps = 800) {
        this.success = false;
        // Bibliographic reference: Numerical Optimization, second edition, Jorge Nocedal and Stephen J. Wright, p. 69
        let numSteps = 0;
        //let numGradientComputation = 0
        let t = this.optimizationProblem.numberOfConstraints / this.optimizationProblem.f0;
        let trustRadius = 9;
        let rho;
        const eta = 0.1; // [0, 1/4)
        const mu = 10; // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 569
        /* JCL 2020/09/18 Collect the elementary steps prior to shift the control polygon */
        let globalStep = (0, MathVectorBasicOperations_3.zeroVector)(this.optimizationProblem.f.length);
        // JCL 05/03/2021 add the use of checked to take into account the curve analysis
        let checked = true;
        while (this.optimizationProblem.numberOfConstraints / t > epsilon) {
            while (true) {
                numSteps += 1;
                //console.log("number of steps")
                //console.log(numSteps) 
                if (this.optimizationProblem.f.length !== this.optimizationProblem.gradient_f.shape[0]) {
                    console.log("Problem about f length and gradient_f shape 0 is in the function optimize_using_trust_region");
                }
                let b = this.barrier(this.optimizationProblem.f, this.optimizationProblem.gradient_f, this.optimizationProblem.hessian_f);
                let gradient = (0, MathVectorBasicOperations_2.saxpy2)(t, this.optimizationProblem.gradient_f0, b.gradient);
                let hessian = b.hessian.plusSymmetricMatrixMultipliedByValue(this.optimizationProblem.hessian_f0, t);
                let trustRegionSubproblem = new TrustRegionSubproblem_1.TrustRegionSubproblem(gradient, hessian);
                let tr = trustRegionSubproblem.solve(trustRadius);
                let fStep = this.optimizationProblem.fStep(tr.step);
                let numSteps2 = 0;
                while (Math.max.apply(null, fStep) >= 0) {
                    numSteps2 += 1;
                    trustRadius *= 0.25;
                    tr = trustRegionSubproblem.solve(trustRadius);
                    //numGradientComputation += 1;
                    fStep = this.optimizationProblem.fStep(tr.step);
                    if (numSteps2 > 100) {
                        throw new Error("maxSteps2 > 100");
                    }
                }
                let barrierValueStep = this.barrierValue(fStep);
                let actualReduction = t * (this.optimizationProblem.f0 - this.optimizationProblem.f0Step(tr.step)) + (b.value - barrierValueStep);
                let predictedReduction = -(0, MathVectorBasicOperations_1.dotProduct)(gradient, tr.step) - 0.5 * hessian.quadraticForm(tr.step);
                /* JCL 2020/09/17 update the global step */
                for (let i = 0; i < this.optimizationProblem.f.length; i += 1) {
                    globalStep[i] += tr.step[i];
                }
                rho = actualReduction / predictedReduction;
                if (rho < 0.25) {
                    trustRadius *= 0.25;
                }
                else if (rho > 0.75 && tr.hitsBoundary) {
                    trustRadius = Math.min(2 * trustRadius, maxTrustRadius);
                }
                if (rho > eta) {
                    //numGradientComputation += 1;
                    //console.log("number of gradient computation")
                    //console.log(numGradientComputation) 
                    //numGradientComputation = 0
                    // JCL 05/03/2021 modify the use of step to take into account the curve analysis
                    //this.o.step(tr.step)
                    checked = this.optimizationProblem.step(tr.step);
                    if (!checked) {
                        this.success = true;
                        console.log("terminate optimization: solution not in shape space. ");
                        if (numSteps === 1) {
                            return OptimizerReturnStatus.FIRST_ITERATION;
                        }
                        else {
                            return OptimizerReturnStatus.SOLUTION_OUTSIDE_SHAPE_SPACE;
                        }
                    }
                }
                if (numSteps > maxNumSteps) {
                    //throw new Error("numSteps > maxNumSteps")
                    //break;
                    console.log("optimizer: max number of iterations reached ");
                    return OptimizerReturnStatus.MAX_NB_ITER_REACHED;
                }
                let newtonDecrementSquared = this.newtonDecrementSquared(tr.step, t, this.optimizationProblem.gradient_f0, b.gradient);
                if (newtonDecrementSquared < 0) {
                    throw new Error("newtonDecrementSquared is smaller than zero");
                }
                //if (newtonDecrementSquared < epsilon && !tr.hitsBoundary) {
                if (newtonDecrementSquared < epsilon) {
                    //console.log('break newtonDecrementSquared < epsilon && !hitsBoundary');
                    break;
                }
                if (trustRadius < 10e-18) {
                    //console.log('trustRadius < 10e-10');
                    console.log(b);
                    throw new Error("trust Radius < 10e-18");
                    //break;
                }
            }
            t *= mu;
        }
        //if (numSteps === maxNumSteps) {
        //    return -1;
        //}
        //console.log(numSteps)
        this.success = true;
        return OptimizerReturnStatus.SOLUTION_FOUND;
    }
    optimize_using_line_search(epsilon = 10e-6, maxNumSteps = 300) {
        // Bibliographic reference: Numerical Optimization, second edition, Jorge Nocedal and Stephen J. Wright, p. 69
        let numSteps = 0;
        let t = this.optimizationProblem.numberOfConstraints / this.optimizationProblem.f0;
        let rho;
        const eta = 0.1; // [0, 1/4)
        const mu = 10; // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 569
        while (this.optimizationProblem.numberOfConstraints / t > epsilon) {
            while (true) {
                numSteps += 1;
                //console.log(numSteps) 
                const b = this.barrier(this.optimizationProblem.f, this.optimizationProblem.gradient_f, this.optimizationProblem.hessian_f);
                const gradient = (0, MathVectorBasicOperations_2.saxpy2)(t, this.optimizationProblem.gradient_f0, b.gradient);
                const hessian = b.hessian.plusSymmetricMatrixMultipliedByValue(this.optimizationProblem.hessian_f0, t);
                const newtonStep = this.computeNewtonStep(gradient, hessian);
                const stepRatio = this.backtrackingLineSearch(t, newtonStep, this.optimizationProblem.f0, b.value, this.optimizationProblem.gradient_f0, b.gradient);
                if (stepRatio < 1) {
                    //console.log(stepRatio)
                }
                const step = (0, MathVectorBasicOperations_1.multiplyVectorByScalar)(newtonStep, stepRatio);
                /*
                if (Math.max(...this.o.fStep(step)) > 0) {
                    console.log(Math.max(...this.o.fStep(step)))
                }
                */
                //console.log(Math.max(...this.o.fStep(step)))
                /*
                if (Math.max(...this.o.fStep(step)) < 0) {
                    this.o.step(step)
                }
                */
                this.optimizationProblem.step(step);
                if (numSteps > maxNumSteps) {
                    //throw new Error("numSteps > maxNumSteps")
                    //break;
                    console.log("numSteps > maxNumSteps");
                    return;
                }
                let newtonDecrementSquared = this.newtonDecrementSquared(step, t, this.optimizationProblem.gradient_f0, b.gradient);
                if (newtonDecrementSquared < 0) {
                    throw new Error("newtonDecrementSquared is smaller than zero");
                }
                //if (newtonDecrementSquared < epsilon && !tr.hitsBoundary) {
                if (newtonDecrementSquared < epsilon) {
                    //console.log('break newtonDecrementSquared < epsilon && !hitsBoundary');
                    //console.log(numSteps)
                    break;
                }
            }
            t *= mu;
            //console.log(t)
        }
        //if (numSteps === maxNumSteps) {
        //    return -1;
        //}
        //console.log(numSteps)
    }
    newtonDecrementSquared(newtonStep, t, gradient_f0, barrierGradient) {
        return -(0, MathVectorBasicOperations_1.dotProduct)((0, MathVectorBasicOperations_2.saxpy2)(t, gradient_f0, barrierGradient), newtonStep);
    }
    barrierValue(f) {
        //console.log(f)
        let result = 0;
        const n = f.length;
        for (let i = 0; i < n; i += 1) {
            result -= Math.log(-f[i]);
        }
        return result;
    }
    barrierGradient(f, gradient_f) {
        let result = (0, MathVectorBasicOperations_3.zeroVector)(gradient_f.shape[1]);
        const n = f.length;
        const m = gradient_f.shape[1];
        if (n !== gradient_f.shape[0]) {
            throw new Error("barrierGradient f and gradient_f dimensions do not match");
        }
        for (let i = 0; i < n; i += 1) {
            for (let j = 0; j < m; j += 1) {
                if (f[i] === 0) {
                    throw new Error("barrierGradient makes a division by zero");
                }
                result[j] += -gradient_f.get(i, j) / f[i];
                //console.log(result[j])
            }
        }
        //console.log(gradient_f)
        //console.log(result)
        return result;
    }
    barrierHessian(f, gradient_f, hessian_f) {
        // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 564
        const m = gradient_f.shape[0];
        const n = gradient_f.shape[1];
        let result = new SymmetricMatrix_1.SymmetricMatrix(n);
        // barrier hessian first term
        for (let i = 0; i < m; i += 1) {
            for (let k = 0; k < n; k += 1) {
                for (let l = 0; l <= k; l += 1) {
                    result.addAt(k, l, gradient_f.get(i, k) * gradient_f.get(i, l) / (f[i] * f[i]));
                }
            }
        }
        // barrier hessian second term
        if (hessian_f) {
            for (let i = 0; i < n; i += 1) {
                for (let j = 0; j <= i; j += 1) {
                    for (let k = 0; k < f.length; k += 1) {
                        result.addAt(i, j, -hessian_f[k].get(i, j) / f[k]);
                    }
                }
            }
        }
        return result;
    }
    barrier(f, gradient_f, hessian_f) {
        /*
        if (f.length !== gradient_f.shape[0]) {
            console.log("Problem about f length and gradient_f shape 0 is in Optimizer in the function barrier")
        }
        */
        return { value: this.barrierValue(f),
            gradient: this.barrierGradient(f, gradient_f),
            hessian: this.barrierHessian(f, gradient_f, hessian_f)
        };
    }
    backtrackingLineSearch(t, newtonStep, f0, barrierValue, gradient_f0, barrierGradient) {
        const alpha = 0.2;
        const beta = 0.5;
        let result = 1;
        let step = newtonStep.slice();
        while (Math.max(...this.optimizationProblem.fStep(step)) > 0) {
            result *= beta;
            //console.log(Math.max(...this.o.fStep(step)))
            step = (0, MathVectorBasicOperations_1.multiplyVectorByScalar)(newtonStep, result);
        }
        while (t * this.optimizationProblem.f0Step(step) + this.barrierValue(this.optimizationProblem.fStep(step)) > t * f0 + barrierValue
            + alpha * result * (0, MathVectorBasicOperations_1.dotProduct)((0, MathVectorBasicOperations_1.addTwoVectors)((0, MathVectorBasicOperations_1.multiplyVectorByScalar)(gradient_f0, t), barrierGradient), newtonStep)) {
            result *= beta;
            step = (0, MathVectorBasicOperations_1.multiplyVectorByScalar)(newtonStep, result);
        }
        return result;
    }
    computeNewtonStep(gradient, hessian) {
        let choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessian);
        if (!choleskyDecomposition.success) {
            console.log("choleskyDecomposition failed");
        }
        return choleskyDecomposition.solve((0, MathVectorBasicOperations_1.multiplyVectorByScalar)(gradient, -1));
    }
}
exports.Optimizer = Optimizer;
