"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Optimizer = exports.OptimizerReturnStatus = void 0;
var TrustRegionSubproblem_1 = require("./TrustRegionSubproblem");
var MathVectorBasicOperations_1 = require("../linearAlgebra/MathVectorBasicOperations");
var MathVectorBasicOperations_2 = require("../linearAlgebra/MathVectorBasicOperations");
var MathVectorBasicOperations_3 = require("../linearAlgebra/MathVectorBasicOperations");
var SymmetricMatrix_1 = require("../linearAlgebra/SymmetricMatrix");
var CholeskyDecomposition_1 = require("../linearAlgebra/CholeskyDecomposition");
var OptimizerReturnStatus;
(function (OptimizerReturnStatus) {
    OptimizerReturnStatus[OptimizerReturnStatus["SOLUTION_FOUND"] = 0] = "SOLUTION_FOUND";
    OptimizerReturnStatus[OptimizerReturnStatus["MAX_NB_ITER_REACHED"] = 1] = "MAX_NB_ITER_REACHED";
    OptimizerReturnStatus[OptimizerReturnStatus["SOLUTION_OUTSIDE_SHAPE_SPACE"] = 2] = "SOLUTION_OUTSIDE_SHAPE_SPACE";
    OptimizerReturnStatus[OptimizerReturnStatus["FIRST_ITERATION"] = 3] = "FIRST_ITERATION";
})(OptimizerReturnStatus = exports.OptimizerReturnStatus || (exports.OptimizerReturnStatus = {}));
var Optimizer = /** @class */ (function () {
    function Optimizer(optimizationProblem) {
        this.optimizationProblem = optimizationProblem;
        this.success = false;
        if (this.optimizationProblem.f.length !== this.optimizationProblem.gradient_f.shape[0]) {
            console.log("Problem about f length and gradient_f shape 0 is in the Optimizer Constructor");
        }
    }
    Optimizer.prototype.optimize_using_trust_region = function (epsilon, maxTrustRadius, maxNumSteps) {
        if (epsilon === void 0) { epsilon = 10e-8; }
        if (maxTrustRadius === void 0) { maxTrustRadius = 10; }
        if (maxNumSteps === void 0) { maxNumSteps = 800; }
        this.success = false;
        // Bibliographic reference: Numerical Optimization, second edition, Jorge Nocedal and Stephen J. Wright, p. 69
        var numSteps = 0;
        //let numGradientComputation = 0
        var t = this.optimizationProblem.numberOfConstraints / this.optimizationProblem.f0;
        var trustRadius = 9;
        var rho;
        var eta = 0.1; // [0, 1/4)
        var mu = 10; // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 569
        /* JCL 2020/09/18 Collect the elementary steps prior to shift the control polygon */
        var globalStep = MathVectorBasicOperations_3.zeroVector(this.optimizationProblem.f.length);
        // JCL 05/03/2021 add the use of checked to take into account the curve analysis
        var checked = true;
        while (this.optimizationProblem.numberOfConstraints / t > epsilon) {
            while (true) {
                numSteps += 1;
                //console.log("number of steps")
                //console.log(numSteps) 
                if (this.optimizationProblem.f.length !== this.optimizationProblem.gradient_f.shape[0]) {
                    console.log("Problem about f length and gradient_f shape 0 is in the function optimize_using_trust_region");
                }
                var b = this.barrier(this.optimizationProblem.f, this.optimizationProblem.gradient_f, this.optimizationProblem.hessian_f);
                var gradient = MathVectorBasicOperations_2.saxpy2(t, this.optimizationProblem.gradient_f0, b.gradient);
                var hessian = b.hessian.plusSymmetricMatrixMultipliedByValue(this.optimizationProblem.hessian_f0, t);
                var trustRegionSubproblem = new TrustRegionSubproblem_1.TrustRegionSubproblem(gradient, hessian);
                var tr = trustRegionSubproblem.solve(trustRadius);
                var fStep = this.optimizationProblem.fStep(tr.step);
                var numSteps2 = 0;
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
                var barrierValueStep = this.barrierValue(fStep);
                var actualReduction = t * (this.optimizationProblem.f0 - this.optimizationProblem.f0Step(tr.step)) + (b.value - barrierValueStep);
                var predictedReduction = -MathVectorBasicOperations_1.dotProduct(gradient, tr.step) - 0.5 * hessian.quadraticForm(tr.step);
                /* JCL 2020/09/17 update the global step */
                for (var i = 0; i < this.optimizationProblem.f.length; i += 1) {
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
                var newtonDecrementSquared = this.newtonDecrementSquared(tr.step, t, this.optimizationProblem.gradient_f0, b.gradient);
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
    };
    Optimizer.prototype.optimize_using_line_search = function (epsilon, maxNumSteps) {
        if (epsilon === void 0) { epsilon = 10e-6; }
        if (maxNumSteps === void 0) { maxNumSteps = 300; }
        // Bibliographic reference: Numerical Optimization, second edition, Jorge Nocedal and Stephen J. Wright, p. 69
        var numSteps = 0;
        var t = this.optimizationProblem.numberOfConstraints / this.optimizationProblem.f0;
        var rho;
        var eta = 0.1; // [0, 1/4)
        var mu = 10; // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 569
        while (this.optimizationProblem.numberOfConstraints / t > epsilon) {
            while (true) {
                numSteps += 1;
                //console.log(numSteps) 
                var b = this.barrier(this.optimizationProblem.f, this.optimizationProblem.gradient_f, this.optimizationProblem.hessian_f);
                var gradient = MathVectorBasicOperations_2.saxpy2(t, this.optimizationProblem.gradient_f0, b.gradient);
                var hessian = b.hessian.plusSymmetricMatrixMultipliedByValue(this.optimizationProblem.hessian_f0, t);
                var newtonStep = this.computeNewtonStep(gradient, hessian);
                var stepRatio = this.backtrackingLineSearch(t, newtonStep, this.optimizationProblem.f0, b.value, this.optimizationProblem.gradient_f0, b.gradient);
                if (stepRatio < 1) {
                    //console.log(stepRatio)
                }
                var step = MathVectorBasicOperations_1.multiplyVectorByScalar(newtonStep, stepRatio);
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
                var newtonDecrementSquared = this.newtonDecrementSquared(step, t, this.optimizationProblem.gradient_f0, b.gradient);
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
    };
    Optimizer.prototype.newtonDecrementSquared = function (newtonStep, t, gradient_f0, barrierGradient) {
        return -MathVectorBasicOperations_1.dotProduct(MathVectorBasicOperations_2.saxpy2(t, gradient_f0, barrierGradient), newtonStep);
    };
    Optimizer.prototype.barrierValue = function (f) {
        //console.log(f)
        var result = 0;
        var n = f.length;
        for (var i = 0; i < n; i += 1) {
            result -= Math.log(-f[i]);
        }
        return result;
    };
    Optimizer.prototype.barrierGradient = function (f, gradient_f) {
        var result = MathVectorBasicOperations_3.zeroVector(gradient_f.shape[1]);
        var n = f.length;
        var m = gradient_f.shape[1];
        if (n !== gradient_f.shape[0]) {
            throw new Error("barrierGradient f and gradient_f dimensions do not match");
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j < m; j += 1) {
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
    };
    Optimizer.prototype.barrierHessian = function (f, gradient_f, hessian_f) {
        // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 564
        var m = gradient_f.shape[0];
        var n = gradient_f.shape[1];
        var result = new SymmetricMatrix_1.SymmetricMatrix(n);
        // barrier hessian first term
        for (var i = 0; i < m; i += 1) {
            for (var k = 0; k < n; k += 1) {
                for (var l = 0; l <= k; l += 1) {
                    result.addAt(k, l, gradient_f.get(i, k) * gradient_f.get(i, l) / (f[i] * f[i]));
                }
            }
        }
        // barrier hessian second term
        if (hessian_f) {
            for (var i = 0; i < n; i += 1) {
                for (var j = 0; j <= i; j += 1) {
                    for (var k = 0; k < f.length; k += 1) {
                        result.addAt(i, j, -hessian_f[k].get(i, j) / f[k]);
                    }
                }
            }
        }
        return result;
    };
    Optimizer.prototype.barrier = function (f, gradient_f, hessian_f) {
        /*
        if (f.length !== gradient_f.shape[0]) {
            console.log("Problem about f length and gradient_f shape 0 is in Optimizer in the function barrier")
        }
        */
        return { value: this.barrierValue(f),
            gradient: this.barrierGradient(f, gradient_f),
            hessian: this.barrierHessian(f, gradient_f, hessian_f)
        };
    };
    Optimizer.prototype.backtrackingLineSearch = function (t, newtonStep, f0, barrierValue, gradient_f0, barrierGradient) {
        var alpha = 0.2;
        var beta = 0.5;
        var result = 1;
        var step = newtonStep.slice();
        while (Math.max.apply(Math, __spread(this.optimizationProblem.fStep(step))) > 0) {
            result *= beta;
            //console.log(Math.max(...this.o.fStep(step)))
            step = MathVectorBasicOperations_1.multiplyVectorByScalar(newtonStep, result);
        }
        while (t * this.optimizationProblem.f0Step(step) + this.barrierValue(this.optimizationProblem.fStep(step)) > t * f0 + barrierValue
            + alpha * result * MathVectorBasicOperations_1.dotProduct(MathVectorBasicOperations_1.addTwoVectors(MathVectorBasicOperations_1.multiplyVectorByScalar(gradient_f0, t), barrierGradient), newtonStep)) {
            result *= beta;
            step = MathVectorBasicOperations_1.multiplyVectorByScalar(newtonStep, result);
        }
        return result;
    };
    Optimizer.prototype.computeNewtonStep = function (gradient, hessian) {
        var choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessian);
        if (choleskyDecomposition.success === false) {
            console.log("choleskyDecomposition failed");
        }
        return choleskyDecomposition.solve(MathVectorBasicOperations_1.multiplyVectorByScalar(gradient, -1));
    };
    return Optimizer;
}());
exports.Optimizer = Optimizer;
