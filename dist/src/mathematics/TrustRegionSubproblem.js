"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoundariesIntersections = exports.gershgorin_bounds = exports.frobeniusNorm = exports.TrustRegionSubproblem = void 0;
var SquareMatrix_1 = require("../linearAlgebra/SquareMatrix");
var MathVectorBasicOperations_1 = require("../linearAlgebra/MathVectorBasicOperations");
var MathVectorBasicOperations_2 = require("../linearAlgebra/MathVectorBasicOperations");
var MathVectorBasicOperations_3 = require("../linearAlgebra/MathVectorBasicOperations");
var MathVectorBasicOperations_4 = require("../linearAlgebra/MathVectorBasicOperations");
var MathVectorBasicOperations_5 = require("../linearAlgebra/MathVectorBasicOperations");
var MathVectorBasicOperations_6 = require("../linearAlgebra/MathVectorBasicOperations");
var MathVectorBasicOperations_7 = require("../linearAlgebra/MathVectorBasicOperations");
var MathVectorBasicOperations_8 = require("../linearAlgebra/MathVectorBasicOperations");
var MathVectorBasicOperations_9 = require("../linearAlgebra/MathVectorBasicOperations");
var CholeskyDecomposition_1 = require("../linearAlgebra/CholeskyDecomposition");
// Bibliographic Reference: Trust-Region Methods, Conn, Gould and Toint p. 187
// note: lambda is never negative
var lambdaRange;
(function (lambdaRange) {
    lambdaRange[lambdaRange["N"] = 0] = "N";
    lambdaRange[lambdaRange["L"] = 1] = "L";
    lambdaRange[lambdaRange["G"] = 2] = "G";
    lambdaRange[lambdaRange["F"] = 3] = "F";
})(lambdaRange || (lambdaRange = {}));
/**
 * A trust region subproblem solver
 */
var TrustRegionSubproblem = /** @class */ (function () {
    /**
     * Create the trust region subproblem solver
     * @param gradient The gradient of the objective function to minimize
     * @param hessian The hessian of the objective function to minimize
     * @param k_easy Optional value in the range (0, 1)
     * @param k_hard Optional value in the range (0, 1)
     */
    function TrustRegionSubproblem(gradient, hessian, k_easy, k_hard) {
        if (k_easy === void 0) { k_easy = 0.1; }
        if (k_hard === void 0) { k_hard = 0.2; }
        this.gradient = gradient;
        this.hessian = hessian;
        this.k_easy = k_easy;
        this.k_hard = k_hard;
        this.CLOSE_TO_ZERO = 10e-8;
        this.numberOfIterations = 0;
        this.lambda = { current: 0, lowerBound: 0, upperBound: 0 };
        this.hitsBoundary = true;
        this.step = [];
        this.stepSquaredNorm = 0;
        this.stepNorm = 0;
        this.range = lambdaRange.F;
        this.lambdaPlus = 0;
        this.hardCase = false;
        this.gNorm = MathVectorBasicOperations_1.norm(this.gradient);
        if (MathVectorBasicOperations_1.containsNaN(gradient)) {
            throw new Error("The gradient parameter passed to the TrustRegionSubproblem constructor contains NaN");
        }
        if (hessian.containsNaN()) {
            throw new Error("The hessian parameter passed to the TrustRegionSubproblem to constructor contains NaN");
        }
        this.cauchyPoint = MathVectorBasicOperations_8.zeroVector(this.gradient.length);
    }
    /**
     * Find the nearly exact trust region subproblem minimizer
     * @param trustRegionRadius The trust region radius
     * @returns The vector .step and the boolean .hitsBoundary
     */
    TrustRegionSubproblem.prototype.solve = function (trustRegionRadius) {
        // Bibliographic Reference: Trust-Region Methods, Conn, Gould and Toint p. 193
        // see also the list of errata: ftp://ftp.numerical.rl.ac.uk/pub/trbook/trbook-errata.pdf for Algorithm 7.3.4 Step 1a
        this.cauchyPoint = this.computeCauchyPoint(trustRegionRadius);
        this.lambda = this.initialLambdas(trustRegionRadius);
        this.numberOfIterations = 0;
        /* JCL 2021/02/09 Try modify maxNumberOfIterations to reach a solution (original= 300)*/
        var maxNumberOfIterations = 300;
        //const maxNumberOfIterations = 400
        while (true) {
            this.numberOfIterations += 1;
            // step 1.
            var hessianPlusLambda = this.hessian.addValueOnDiagonal(this.lambda.current);
            var choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessianPlusLambda);
            //We have found the exact lambda, however the hessian is indefinite
            //The idea is then to find an approximate solution increasing the lambda value by EPSILON
            if (this.lambda.upperBound === this.lambda.lowerBound && !choleskyDecomposition.success) {
                var EPSILON = 10e-6;
                this.lambda.upperBound += EPSILON;
                this.lambda.current += EPSILON;
                hessianPlusLambda = this.hessian.addValueOnDiagonal(this.lambda.current);
                choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessianPlusLambda);
                this.range = lambdaRange.G;
            }
            // step 1a.
            this.update_step_and_range(trustRegionRadius, choleskyDecomposition);
            if (this.interiorConvergence()) {
                break;
            }
            // step 2.
            this.update_lower_and_upper_bounds();
            // step 3.
            this.update_lambda_lambdaPlus_lowerBound_and_step(trustRegionRadius, hessianPlusLambda, choleskyDecomposition);
            // step 4.
            if (this.check_for_termination_and_update_step(trustRegionRadius, hessianPlusLambda, choleskyDecomposition)) {
                break;
            }
            // step 5.
            this.update_lambda();
            if (this.numberOfIterations > maxNumberOfIterations) {
                throw new Error("Trust region subproblem maximum number of step exceeded");
            }
        }
        //console.log(this.numberOfIterations)
        return {
            step: this.step,
            hitsBoundary: this.hitsBoundary,
            hardCase: this.hardCase
        };
    };
    /**
     * An interior solution with a zero Lagrangian multiplier implies interior convergence
     */
    TrustRegionSubproblem.prototype.interiorConvergence = function () {
        // A range G corresponds to a step smaller than the trust region radius
        if (this.lambda.current === 0 && this.range === lambdaRange.G) {
            this.hitsBoundary = false;
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Updates the lambdaRange set. Updates the step if the factorization succeeded.
     * @param trustRegionRadius Trust region radius
     * @param choleskyDecomposition Cholesky decomposition
     */
    TrustRegionSubproblem.prototype.update_step_and_range = function (trustRegionRadius, choleskyDecomposition) {
        if (choleskyDecomposition.success) {
            this.step = choleskyDecomposition.solve(MathVectorBasicOperations_4.multiplyVectorByScalar(this.gradient, -1));
            this.stepSquaredNorm = MathVectorBasicOperations_3.squaredNorm(this.step);
            this.stepNorm = Math.sqrt(this.stepSquaredNorm);
            if (this.stepNorm < trustRegionRadius) {
                this.range = lambdaRange.G;
            }
            else {
                this.range = lambdaRange.L; // once a Newton iterate falls into L it stays there
            }
        }
        else {
            this.range = lambdaRange.N;
        }
    };
    /**
     * Update lambda.upperBound or lambda.lowerBound
     */
    TrustRegionSubproblem.prototype.update_lower_and_upper_bounds = function () {
        if (this.range === lambdaRange.G) {
            this.lambda.upperBound = this.lambda.current;
        }
        else {
            this.lambda.lowerBound = this.lambda.current;
        }
    };
    /**
     * Update lambdaPlus, lambda.lowerBound, lambda.current and step
     * @param trustRegionRadius Trust region radius
     * @param hessianPlusLambda Hessian + lambda.current * I
     * @param choleskyDecomposition The Cholesky Decomposition of Hessian + lambda.current * I
     */
    TrustRegionSubproblem.prototype.update_lambda_lambdaPlus_lowerBound_and_step = function (trustRegionRadius, hessianPlusLambda, choleskyDecomposition) {
        // Step 3. If lambda in F
        if (this.range === lambdaRange.L || this.range === lambdaRange.G) {
            // Step 3a. Solve Lw = step and set lambdaPlus (algorithm 7.3.1)
            var w = solveLowerTriangular(choleskyDecomposition.g, this.step);
            var wSquaredNorm = MathVectorBasicOperations_3.squaredNorm(w);
            this.lambdaPlus = this.lambda.current + (this.stepNorm / trustRegionRadius - 1) * (this.stepSquaredNorm / wSquaredNorm);
            // Step 3b. If lambda in G
            if (this.range === lambdaRange.G) {
                // i. Use the LINPACK method to find a unit vector u to make <u, H(lambda), u> small.
                var s_min = estimateSmallestSingularValue(choleskyDecomposition.g);
                // ii. Replace lambda.lowerBound by max [lambda_lb, lambda - <u, H(lambda), u>].
                this.lambda.lowerBound = Math.max(this.lambda.lowerBound, this.lambda.current - Math.pow(s_min.value, 2));
                // iii. Find the root alpha of the equation || step + alpha u || = trustRegionRadius which makes
                // the model q(step + alpha u) smallest and replace step by step + alpha u
                var intersection = getBoundariesIntersections(this.step, s_min.vector, trustRegionRadius);
                var t = void 0;
                if (Math.abs(intersection.tmin) < Math.abs(intersection.tmax)) {
                    t = intersection.tmin;
                }
                else {
                    t = intersection.tmax;
                }
                MathVectorBasicOperations_7.saxpy(t, s_min.vector, this.step);
                this.stepSquaredNorm = MathVectorBasicOperations_3.squaredNorm(this.step);
                this.stepNorm = Math.sqrt(this.stepSquaredNorm);
            }
        }
        else {
            // Step 3c. Use the partial factorization to find delta and v such that (H(lambda) + delta e_k e_k^T) v = 0
            var sls = singularLeadingSubmatrix(hessianPlusLambda, choleskyDecomposition.g, choleskyDecomposition.firstNonPositiveDefiniteLeadingSubmatrixSize);
            // Step 3d. Replace lambda.lb by max [ lambda_lb, lambda_current + delta / || v ||^2 ]
            var vSquaredNorm = MathVectorBasicOperations_3.squaredNorm(sls.vector);
            this.lambda.lowerBound = Math.max(this.lambda.lowerBound, this.lambda.current + sls.delta / vSquaredNorm);
            //lambda.current = Math.max(Math.sqrt(lambda.lb * lambda.ub), lambda.lb + this.UPDATE_COEFF * (lambda.ub - lambda.lb));
        }
    };
    /**
     * Check for termination
     * @param trustRegionRadius Trust region radius
     * @param hessianPlusLambda Hessian + lambda.current * I
     * @param choleskyDecomposition The CholeskyDecomposition of Hessian + lambda.current * I
     */
    TrustRegionSubproblem.prototype.check_for_termination_and_update_step = function (trustRegionRadius, hessianPlusLambda, choleskyDecomposition) {
        var terminate = false;
        // Algorithm 7.3.5, Step 1. If lambda is in F and | ||s(lambda)|| - trustRegionRadius | <= k_easy * trustRegionRadius
        if ((this.range === lambdaRange.L || this.range === lambdaRange.G) && Math.abs(this.stepNorm - trustRegionRadius) <= this.k_easy * trustRegionRadius) {
            // Added test to make sure that the result is better than the Cauchy point
            var evalResult = MathVectorBasicOperations_6.dotProduct(this.gradient, this.step) + 0.5 * this.hessian.quadraticForm(this.step);
            var evalCauchy = MathVectorBasicOperations_6.dotProduct(this.gradient, this.cauchyPoint) + 0.5 * this.hessian.quadraticForm(this.cauchyPoint);
            if (evalResult > evalCauchy) {
                return false;
            }
            else {
                // stop with s = s(lambda)
                this.hitsBoundary = true;
                terminate = true;
            }
        }
        if (this.range === lambdaRange.G) {
            // Algorithm 7.3.5, Step 2. If lambda = 0 in G
            if (this.lambda.current === 0) {
                this.hitsBoundary = false; // since the Lagrange Multiplier is zero
                terminate = true;
                return terminate;
            }
            // Algorithm 7.3.5, Step 3. If lambda is in G and the LINPACK method gives u and alpha such that
            // alpha^2 <u, H(lambda), u> <= k_hard ( <s(lambda), H(lambda) * s(lambda) + lambda * trustRegionRadius^2 >)
            var s_min = estimateSmallestSingularValue(choleskyDecomposition.g);
            //let alpha = s_min.value
            //let u = s_min.vector
            var intersection = getBoundariesIntersections(this.step, s_min.vector, trustRegionRadius);
            var t_abs_max = void 0;
            // To do : explain better why > instead of <
            // relative_error is smaller for <
            // it seems that we need the worst case to make sure the result is a better solution
            // than the Cauchy point
            if (Math.abs(intersection.tmin) > Math.abs(intersection.tmax)) {
                t_abs_max = intersection.tmin;
            }
            else {
                t_abs_max = intersection.tmax;
            }
            var quadraticTerm = hessianPlusLambda.quadraticForm(this.step);
            var relative_error = Math.pow(t_abs_max * s_min.value, 2) / (quadraticTerm + this.lambda.current * Math.pow(trustRegionRadius, 2));
            //if (relative_error <= this.k_hard || t_abs_min < this.CLOSE_TO_ZERO) {
            if (relative_error <= this.k_hard) {
                //saxpy(t_abs_min, s_min.vector, this.step) done at step 3b iii.
                this.hitsBoundary = true;
                this.hardCase = true;
                terminate = true;
            }
        }
        return terminate;
    };
    /**
     * Update lambda.current
     */
    TrustRegionSubproblem.prototype.update_lambda = function () {
        //step 5.
        if (this.range === lambdaRange.L && this.gNorm !== 0) {
            this.lambda.current = this.lambdaPlus;
        }
        else if (this.range === lambdaRange.G) {
            var hessianPlusLambda = this.hessian.clone();
            hessianPlusLambda.addValueOnDiagonal(this.lambdaPlus);
            var choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessianPlusLambda);
            // If the factorization succeeds, then lambdaPlus is in L. Otherwise, lambdaPlus is in N
            if (choleskyDecomposition.success) {
                this.lambda.current = this.lambdaPlus;
            }
            else {
                this.lambda.lowerBound = Math.max(this.lambda.lowerBound, this.lambdaPlus);
                // Check lambda.lb for interior convergence ???
                this.lambda.current = updateLambda_using_equation_7_3_14(this.lambda.lowerBound, this.lambda.upperBound);
            }
        }
        else {
            this.lambda.current = updateLambda_using_equation_7_3_14(this.lambda.lowerBound, this.lambda.upperBound);
        }
    };
    /**
     * Returns the minimizer along the steepest descent (-gradient) direction subject to trust-region bound.
     * Note: If the gradient is a zero vector then the function returns a zero vector
     * @param trustRegionRadius The trust region radius
     * @return The minimizer vector deta x
     */
    TrustRegionSubproblem.prototype.computeCauchyPoint = function (trustRegionRadius) {
        // Bibliographic referece: Numerical Optimizatoin, second edition, Nocedal and Wright, p. 71-72
        var gHg = this.hessian.quadraticForm(this.gradient);
        var gNorm = MathVectorBasicOperations_1.norm(this.gradient);
        // return a zero step if the gradient is zero
        if (gNorm === 0) {
            return MathVectorBasicOperations_8.zeroVector(this.gradient.length);
        }
        var result = MathVectorBasicOperations_4.multiplyVectorByScalar(this.gradient, -trustRegionRadius / gNorm);
        if (gHg <= 0) {
            return result;
        }
        var tau = Math.pow(gNorm, 3) / trustRegionRadius / gHg;
        if (tau < 1) {
            return MathVectorBasicOperations_4.multiplyVectorByScalar(result, tau);
        }
        return result;
    };
    /**
     * Return an initial value, an upper bound and a lower bound for lambda.
     * @param trustRegionRadius The trust region radius
     * @return .current (lambda intial value) .lb (lower bound) and .ub (upper bound)
     */
    TrustRegionSubproblem.prototype.initialLambdas = function (trustRegionRadius) {
        // Bibliographic reference : Trust-Region Methods, Conn, Gould and Toint p. 192
        var gershgorin = gershgorin_bounds(this.hessian);
        var hessianFrobeniusNorm = frobeniusNorm(this.hessian);
        var hessianInfiniteNorm = 0;
        var minHessianDiagonal = this.hessian.get(0, 0);
        for (var i = 0; i < this.hessian.shape[0]; i += 1) {
            var tempInfiniteNorm = 0;
            for (var j = 0; j < this.hessian.shape[0]; j += 1) {
                tempInfiniteNorm += Math.abs(this.hessian.get(i, j));
            }
            hessianInfiniteNorm = Math.max(hessianInfiniteNorm, tempInfiniteNorm);
            minHessianDiagonal = Math.min(minHessianDiagonal, this.hessian.get(i, i));
        }
        var lowerBound = Math.max(0, Math.max(-minHessianDiagonal, MathVectorBasicOperations_1.norm(this.gradient) / trustRegionRadius - Math.min(gershgorin.upperBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm))));
        var upperBound = Math.max(0, MathVectorBasicOperations_1.norm(this.gradient) / trustRegionRadius + Math.min(-gershgorin.lowerBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm)));
        var lambda_initial;
        if (lowerBound === 0) {
            lambda_initial = 0;
        }
        else {
            lambda_initial = updateLambda_using_equation_7_3_14(lowerBound, upperBound);
        }
        return {
            current: lambda_initial,
            lowerBound: lowerBound,
            upperBound: upperBound
        };
    };
    return TrustRegionSubproblem;
}());
exports.TrustRegionSubproblem = TrustRegionSubproblem;
/**
 *
 * @param A
 * @param L
 * @param k
 * @return dela, vector
 * @throws If k < 0
 */
function singularLeadingSubmatrix(A, L, k) {
    if (k < 0) {
        throw new Error('k should not be a negative value');
    }
    var delta = 0;
    var l = new SquareMatrix_1.SquareMatrix(k);
    var v = [];
    var u = MathVectorBasicOperations_8.zeroVector(k);
    for (var j = 0; j < k - 1; j += 1) {
        delta += Math.pow(L.get(k - 1, j), 2);
    }
    delta -= A.get(k - 1, k - 1);
    for (var i = 0; i < k - 1; i += 1) {
        for (var j = 0; j <= i; j += 1) {
            l.set(i, j, L.get(i, j));
        }
        u[i] = L.get(k - 1, i);
    }
    v = MathVectorBasicOperations_8.zeroVector(A.shape[0]);
    v[k - 1] = 1;
    if (k !== 1) {
        var vtemp = solveLowerTriangular(l, u);
        for (var i = 0; i < k - 1; i += 1) {
            v[i] = vtemp[i];
        }
    }
    return {
        delta: delta,
        vector: v
    };
}
/**
 * Estimate the smallest singular value
 * @param lowerTriangular
 */
function estimateSmallestSingularValue(lowerTriangular) {
    // Bibliographic reference :  Golub, G. H., Van Loan, C. F. (2013), "Matrix computations". Forth Edition. JHU press. pp. 140-142.
    // Web reference: https://github.com/scipy/scipy/blob/master/scipy/optimize/_trustregion_exact.py
    var n = lowerTriangular.shape[0];
    var p = MathVectorBasicOperations_8.zeroVector(n);
    var y = MathVectorBasicOperations_8.zeroVector(n);
    var p_plus = [];
    var p_minus = [];
    for (var k = 0; k < n; k += 1) {
        var y_plus = (1 - p[k]) / lowerTriangular.get(k, k);
        var y_minus = (-1 - p[k]) / lowerTriangular.get(k, k);
        for (var i = k + 1; i < n; i += 1) {
            p_plus.push(p[i] + lowerTriangular.get(i, k) * y_plus);
            p_minus.push(p[i] + lowerTriangular.get(i, k) * y_minus);
        }
        if (Math.abs(y_plus) + MathVectorBasicOperations_2.norm1(p_plus) >= Math.abs(y_minus) + MathVectorBasicOperations_2.norm1(p_minus)) {
            y[k] = y_plus;
            for (var i = k + 1; i < n; i += 1) {
                p[i] = p_plus[i - k - 1];
            }
        }
        else {
            y[k] = y_minus;
            for (var i = k + 1; i < n; i += 1) {
                p[i] = p_minus[i - k - 1];
            }
        }
    }
    var v = solveUpperTriangular(lowerTriangular, y);
    var vNorm = MathVectorBasicOperations_1.norm(v);
    var yNorm = MathVectorBasicOperations_1.norm(y);
    if (vNorm === 0) {
        throw new Error("divideVectorByScalar division by zero");
    }
    return {
        value: yNorm / vNorm,
        vector: MathVectorBasicOperations_5.divideVectorByScalar(v, vNorm)
    };
}
/**
 * Solve the linear problem upper triangular matrix UT x = y
 * @param lowerTriangular The transpose of the upper triangular matrix
 * @param y The vector y
 */
function solveUpperTriangular(lowerTriangular, y) {
    var x = y.slice();
    var n = lowerTriangular.shape[0];
    // LT x = y
    for (var i = n - 1; i >= 0; i -= 1) {
        var sum = x[i];
        for (var k = i + 1; k < n; k += 1) {
            sum -= lowerTriangular.get(k, i) * x[k];
        }
        x[i] = sum / lowerTriangular.get(i, i);
    }
    return x;
}
/**
 * Solve the linear problem lower triangular matrix LT x = b
 * @param lowerTriangular The lower triangular matrix
 * @param b The vector b
 */
function solveLowerTriangular(lowerTriangular, b) {
    if (lowerTriangular.shape[0] !== b.length) {
        throw new Error('solveLowerTriangular: matrix and vector are not the same sizes');
    }
    var x = b.slice();
    var n = lowerTriangular.shape[0];
    // L x = b
    for (var i = 0; i < n; i += 1) {
        var sum = b[i];
        for (var k = i - 1; k >= 0; k -= 1) {
            sum -= lowerTriangular.get(i, k) * x[k];
        }
        x[i] = sum / lowerTriangular.get(i, i);
    }
    return x;
}
/**
 * The frobenius norm
 * @param matrix The matrix
 * @return The square root of the sum of every elements squared
 */
function frobeniusNorm(matrix) {
    var result = 0;
    var m = matrix.shape[0];
    var n = matrix.shape[1];
    for (var i = 0; i < m; i += 1) {
        for (var j = 0; j < n; j += 1) {
            result += Math.pow(matrix.get(i, j), 2);
        }
    }
    result = Math.sqrt(result);
    return result;
}
exports.frobeniusNorm = frobeniusNorm;
/**
* Given a symmetric matrix, compute the Gershgorin upper and lower bounds for its eigenvalues
* @param matrix Symmetric Matrix
* @return .lb (lower bound) and .ub (upper bound)
*/
function gershgorin_bounds(matrix) {
    // Bibliographic Reference : Trust-Region Methods, Conn, Gould and Toint p. 19
    // Gershgorin Bounds : All eigenvalues of a matrix A lie in the complex plane within the intersection
    // of n discs centered at a_(i, i) and of radii : sum of a_(i, j) for 1 ≤ i ≤ n and  j != i
    // When the matrix is symmetric, the eigenvalues are real and the discs become intervals on the real
    // line
    var m = matrix.shape[0];
    var n = matrix.shape[1];
    var matrixRowSums = [];
    for (var i = 0; i < m; i += 1) {
        var rowSum = 0;
        for (var j = 0; j < n; j += 1) {
            rowSum += Math.abs(matrix.get(i, j));
        }
        matrixRowSums.push(rowSum);
    }
    var matrixDiagonal = [];
    var matrixDiagonalAbsolute = [];
    for (var i = 0; i < m; i += 1) {
        matrixDiagonal.push(matrix.get(i, i));
        matrixDiagonalAbsolute.push(Math.abs(matrix.get(i, i)));
    }
    var lb = [];
    var ub = [];
    for (var i = 0; i < m; i += 1) {
        lb.push(matrixDiagonal[i] + matrixDiagonalAbsolute[i] - matrixRowSums[i]);
        ub.push(matrixDiagonal[i] - matrixDiagonalAbsolute[i] + matrixRowSums[i]);
    }
    var lowerBound = Math.min.apply(null, lb);
    var upperBound = Math.max.apply(null, ub);
    return {
        lowerBound: lowerBound,
        upperBound: upperBound
    };
}
exports.gershgorin_bounds = gershgorin_bounds;
/**
 * Solve the scalar quadratic equation ||z + t d|| == trust_radius
 * This is like a line-sphere intersection
 * @param z Vector
 * @param d Vector
 * @param trustRegionRadius
 * @returns The two values of t, sorted from low to high
 */
function getBoundariesIntersections(z, d, trustRegionRadius) {
    if (MathVectorBasicOperations_1.isZeroVector(d)) {
        throw new Error("In getBoundariesInstersections the d vector cannot be the zero vector");
    }
    var a = MathVectorBasicOperations_3.squaredNorm(d);
    var b = 2 * MathVectorBasicOperations_6.dotProduct(z, d);
    var c = MathVectorBasicOperations_3.squaredNorm(z) - trustRegionRadius * trustRegionRadius;
    var sqrtDiscriminant = Math.sqrt(b * b - 4 * a * c);
    var sign_b = MathVectorBasicOperations_9.sign(b);
    if (sign_b === 0) {
        sign_b = 1;
    }
    var aux = b + sqrtDiscriminant * sign_b;
    var ta = -aux / (2 * a);
    var tb = -2 * c / aux;
    return {
        tmin: Math.min(ta, tb),
        tmax: Math.max(ta, tb)
    };
}
exports.getBoundariesIntersections = getBoundariesIntersections;
function updateLambda_using_equation_7_3_14(lowerBound, upperBound, theta) {
    if (theta === void 0) { theta = 0.01; }
    // Bibliographic Reference: Trust-Region Methods, Conn, Gould and Toint p. 190
    return Math.max(Math.sqrt(upperBound * lowerBound), lowerBound + theta * (upperBound - lowerBound));
}
