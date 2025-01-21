"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquareMatrix = void 0;
/**
 * A square matrix
 */
var SquareMatrix = /** @class */ (function () {
    /**
     * Create a square matrix
     * @param size Number of row and column
     * @param data A row after row flat array
     * @throws If data length is not equal to size*size
     */
    function SquareMatrix(size, data) {
        this._shape = [size, size];
        if (data) {
            if (data.length !== size * size) {
                throw new Error("Square matrix constructor expect the data to have size*size length");
            }
            this.data = data.slice();
        }
        else {
            this.data = [];
            for (var i = 0; i < this.shape[0] * this.shape[1]; i += 1) {
                this.data.push(0);
            }
        }
    }
    Object.defineProperty(SquareMatrix.prototype, "shape", {
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
     * Return the corresponding index in the flat row by row data vector
     * @param row The row index
     * @param column The column index
     */
    SquareMatrix.prototype.dataIndex = function (row, column) {
        var n = row * this._shape[1] + column;
        return n;
    };
    /**
     * Return the value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @return Scalar
     * @throws If an index is out of range
     */
    SquareMatrix.prototype.get = function (row, column) {
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
    SquareMatrix.prototype.set = function (row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] = value;
    };
    /**
     * Change the value of the matrix at a given row and column position by this value divided by the divisor value
     * @param row The row index
     * @param column The column index
     * @param divisor The divisor value
     * @throws If an index is out of range
     */
    SquareMatrix.prototype.divideAt = function (row, column, divisor) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] /= divisor;
    };
    /**
     * Change the value of the matrix at a given row and column position by this value substracted by the subtrahend value
     * @param row The row index
     * @param column The column index
     * @param divisor The divisor value
     * @throws If an index is out of range
     */
    SquareMatrix.prototype.substractAt = function (row, column, subtrahend) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] -= subtrahend;
    };
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    SquareMatrix.prototype.checkRowRange = function (index) {
        if (index < 0 || index >= this.shape[0]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    };
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    SquareMatrix.prototype.checkColumnRange = function (index) {
        if (index < 0 || index >= this.shape[1]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    };
    /**
     * Multiply a matrix by a vector
     * @param v A vector the same size the matrix
     * @return a vector
     */
    SquareMatrix.prototype.multiplyByVector = function (v) {
        if (this.shape[0] !== v.length) {
            throw new Error("SquareMatrix multiply a vector of incorrect length");
        }
        var result = [];
        var n = this.shape[0];
        for (var i = 0; i < n; i += 1) {
            var temp = 0;
            for (var j = 0; j < n; j += 1) {
                temp += this.get(i, j) * v[j];
            }
            result.push(temp);
        }
        return result;
    };
    /**
     * Multiply two matrices
     * @param that A square or a symmetric matrix
     * @return a square matrix
     */
    SquareMatrix.prototype.multiplyByMatrix = function (that) {
        if (this.shape[1] !== that.shape[0]) {
            throw new Error("Size mismatch in matrix multiplication");
        }
        var result = new SquareMatrix(this.shape[1]);
        for (var i = 0; i < this.shape[0]; i += 1) {
            for (var j = 0; j < this.shape[0]; j += 1) {
                var temp = 0;
                for (var k = 0; k < this.shape[0]; k += 1) {
                    temp += this.get(i, k) * that.get(k, j);
                }
                result.set(i, j, temp);
            }
        }
        return result;
    };
    return SquareMatrix;
}());
exports.SquareMatrix = SquareMatrix;
