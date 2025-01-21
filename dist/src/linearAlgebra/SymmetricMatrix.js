"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymmetricMatrix = void 0;
var SquareMatrix_1 = require("./SquareMatrix");
var DiagonalMatrix_1 = require("./DiagonalMatrix");
var MathVectorBasicOperations_1 = require("./MathVectorBasicOperations");
/**
 * A symmetric matrix
 */
var SymmetricMatrix = /** @class */ (function () {
    /**
     * Create a Symmetric Matrix
     * @param size The number of rows or the number columns
     * @param data The matrix data in a flat vector
     */
    function SymmetricMatrix(size, data) {
        this._shape = [size, size];
        if (data) {
            if (data.length !== size * (size + 1) / 2) {
                throw new Error("Square matrix constructor expect the data to have (size * (size + 1) / 2) length");
            }
            this.data = data.slice();
        }
        else {
            this.data = [];
            var n = (size * (size + 1)) / 2;
            for (var i = 0; i < n; i += 1) {
                this.data.push(0);
            }
        }
    }
    Object.defineProperty(SymmetricMatrix.prototype, "shape", {
        /**
        * Returns the shape of the matrix : [number of rows, number of columns]
        */
        get: function () {
            return this._shape;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the corresponding index in the flat data vector.
     * In this flat data vector the upper triangular matrix is store row-wise.
     * @param row The row index
     * @param column The column index
     */
    SymmetricMatrix.prototype.dataIndex = function (row, column) {
        if (row <= column) {
            return row * this.shape[1] - (row - 1) * row / 2 + column - row;
        }
        return column * this.shape[0] - (column - 1) * column / 2 + row - column;
    };
    /**
     * Returns the value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @return Scalar
     * @throws If an index is out of range
     */
    SymmetricMatrix.prototype.get = function (row, column) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        return this.data[this.dataIndex(row, column)];
    };
    /**
     * Set a given value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @param value The new value
     * @throws If an index is out of range
     */
    SymmetricMatrix.prototype.set = function (row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] = value;
    };
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    SymmetricMatrix.prototype.checkRowRange = function (index) {
        if (index < 0 || index >= this.shape[0]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    };
    /**
 * Check that the index is inside appropriate range
 * @param index The column or the row index
 * @throws If an index is out of range
 */
    SymmetricMatrix.prototype.checkColumnRange = function (index) {
        if (index < 0 || index >= this.shape[1]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    };
    /**
     * Compute the product v^t M v
     * @param v Vector
     * @return Scalar
     */
    SymmetricMatrix.prototype.quadraticForm = function (v) {
        var result = 0;
        for (var i = 1; i < this.shape[1]; i += 1) {
            for (var j = 0; j < i; j += 1) {
                result += this.get(i, j) * v[i] * v[j];
            }
        }
        result *= 2;
        for (var i = 0; i < this.shape[1]; i += 1) {
            result += this.get(i, i) * Math.pow(v[i], 2);
        }
        return result;
    };
    /**
     * Return a safe copy of this matrix
     * */
    SymmetricMatrix.prototype.clone = function () {
        return new SymmetricMatrix(this.shape[0], this.data);
    };
    /**
     * Increases the given element of the matrix by the value
     * @param row The row index
     * @param column The column index
     * @param value The number to be added
     * @throws If an index is out of range
     */
    SymmetricMatrix.prototype.addAt = function (row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(row);
        this.data[this.dataIndex(row, column)] += value;
    };
    /**
     * Increases every diagonal element of the matrix by the value
     * @param value The number to be added
     */
    SymmetricMatrix.prototype.addValueOnDiagonalInPlace = function (value) {
        var m = this.shape[0];
        for (var i = 0; i < m; i += 1) {
            this.data[this.dataIndex(i, i)] += value;
        }
    };
    /**
     * Returns the new matrix: this.matrix + value * I
     * @param value
     * @returns SymmetricMatrix
     */
    SymmetricMatrix.prototype.addValueOnDiagonal = function (value) {
        var result = this.clone();
        result.addValueOnDiagonalInPlace(value);
        return result;
    };
    /**
     * Returns a SquareMatrix with the values of this matrix
     */
    SymmetricMatrix.prototype.squareMatrix = function () {
        var n = this.shape[0];
        var result = new SquareMatrix_1.SquareMatrix(n);
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j < n; j += 1) {
                result.set(i, j, this.get(i, j));
            }
        }
        return result;
    };
    SymmetricMatrix.prototype.plusSymmetricMatrixMultipliedByValue = function (matrix, value) {
        if (this.shape[0] !== matrix.shape[0]) {
            throw new Error("Adding two symmetric matrix with different shapes");
        }
        var result = this.clone();
        var n = result.shape[0];
        if (matrix instanceof DiagonalMatrix_1.DiagonalMatrix) {
            for (var i = 0; i < n; i += 1) {
                result.addAt(i, i, matrix.get(i, i) * value);
            }
            return result;
        }
        else {
            for (var i = 0; i < n; i += 1) {
                for (var j = 0; j <= i; j += 1) {
                    result.addAt(i, j, matrix.get(i, j) * value);
                }
            }
            return result;
        }
    };
    SymmetricMatrix.prototype.multiplyByVector = function (v) {
        if (this.shape[1] !== v.length) {
            throw new Error("SymmetricMatrix multiply a vector of incorrect length");
        }
        var result = [];
        var n = this.shape[1];
        for (var i = 0; i < n; i += 1) {
            var temp = 0;
            for (var j = 0; j < n; j += 1) {
                temp += this.get(i, j) * v[j];
            }
            result.push(temp);
        }
        return result;
    };
    SymmetricMatrix.prototype.containsNaN = function () {
        return MathVectorBasicOperations_1.containsNaN(this.data);
    };
    return SymmetricMatrix;
}());
exports.SymmetricMatrix = SymmetricMatrix;
