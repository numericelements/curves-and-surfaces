"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CholeskyDecomposition = void 0;
/**
 * A decomposition of a positive-definite matirx into a product of a lower triangular matrix and its conjugate transpose
 */
var CholeskyDecomposition = /** @class */ (function () {
    /**
     * The values of the decomposition are stored in the lower triangular portion of the matrix g
     * @param matrix Matrix
     */
    function CholeskyDecomposition(matrix) {
        this.success = false;
        this.CLOSE_TO_ZERO = 10e-8;
        this.firstNonPositiveDefiniteLeadingSubmatrixSize = -1;
        this.g = matrix.squareMatrix();
        var n = this.g.shape[0];
        if (this.g.get(0, 0) < this.CLOSE_TO_ZERO) {
            return;
        }
        var sqrtGjj = Math.sqrt(this.g.get(0, 0));
        for (var i = 0; i < n; i += 1) {
            this.g.divideAt(i, 0, sqrtGjj);
        }
        for (var j = 1; j < n; j += 1) {
            for (var i = j; i < n; i += 1) {
                var sum = 0;
                for (var k = 0; k < j; k += 1) {
                    sum += this.g.get(i, k) * this.g.get(j, k);
                }
                this.g.substractAt(i, j, sum);
            }
            if (this.g.get(j, j) < this.CLOSE_TO_ZERO) {
                this.firstNonPositiveDefiniteLeadingSubmatrixSize = j + 1;
                return;
            }
            sqrtGjj = Math.sqrt(this.g.get(j, j));
            for (var i = j; i < n; i += 1) {
                this.g.divideAt(i, j, sqrtGjj);
            }
        }
        for (var j = 0; j < n; j += 1) {
            for (var i = 0; i < j; i += 1) {
                this.g.set(i, j, 0);
            }
        }
        this.success = true;
    }
    /**
     * Solve the linear system
     * @param b Vector
     * @return The vector x
     * @throws If the Cholesky decomposition failed
     */
    CholeskyDecomposition.prototype.solve = function (b) {
        'use strict';
        // See Numerical Recipes Third Edition p. 101
        if (!this.success) {
            throw new Error("CholeskyDecomposistion.success === false");
        }
        if (b.length !== this.g.shape[0]) {
            throw new Error("The size of the cholesky decomposed matrix g and the vector b do not match");
        }
        var n = this.g.shape[0];
        var x = b.slice();
        // Ly = b
        for (var i = 0; i < n; i += 1) {
            var sum = b[i];
            for (var k = i - 1; k >= 0; k -= 1) {
                sum -= this.g.get(i, k) * x[k];
            }
            x[i] = sum / this.g.get(i, i);
        }
        // LT x = Y
        for (var i = n - 1; i >= 0; i -= 1) {
            var sum = x[i];
            for (var k = i + 1; k < n; k += 1) {
                sum -= this.g.get(k, i) * x[k];
            }
            x[i] = sum / this.g.get(i, i);
        }
        return x;
    };
    /**
     * Solve the linear equation Lower triangular matrix LT * x = b
     * @param b Vector
     */
    CholeskyDecomposition.prototype.solve_LT_result_equal_b = function (b) {
        var n = this.g.shape[0];
        var x = b.slice();
        for (var i = 0; i < n; i += 1) {
            var sum = b[i];
            for (var k = i - 1; k >= 0; k -= 1) {
                sum -= this.g.get(i, k) * x[k];
            }
            x[i] = sum / this.g.get(i, i);
        }
        return x;
    };
    return CholeskyDecomposition;
}());
exports.CholeskyDecomposition = CholeskyDecomposition;
