"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DenseMatrix = void 0;
/**
 * A dense matrix
 */
var DenseMatrix = /** @class */ (function () {
    /**
     * Create a square matrix
     * @param nrows Number of rows
     * @param ncols Number of columns
     * @param data A row after row flat array
     * @throws If data length is not equal to nrows*ncols
     */
    function DenseMatrix(nrows, ncols, data) {
        this._shape = [nrows, ncols];
        if (data) {
            if (data.length !== this.shape[0] * this.shape[1]) {
                throw new Error("Dense matrix constructor expect the data to have nrows*ncols length");
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
    Object.defineProperty(DenseMatrix.prototype, "shape", {
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
    DenseMatrix.prototype.dataIndex = function (row, column) {
        var n = row * this.shape[1] + column;
        return n;
    };
    /**
     * Return the value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @return Scalar
     * @throws If an index is out of range
     */
    DenseMatrix.prototype.get = function (row, column) {
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
    DenseMatrix.prototype.set = function (row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] = value;
    };
    /**
     * Check that the column index is inside appropriate range
     * @param index The column index
     * @throws If index is out of range
     */
    DenseMatrix.prototype.checkColumnRange = function (index) {
        if (index < 0 || index >= this.shape[1]) {
            throw new Error("DenseMatrix column index out of range");
        }
    };
    /**
     * Check that the row index is inside appropriate range
     * @param index The row index
     * @throws If index is out of range
     */
    DenseMatrix.prototype.checkRowRange = function (index) {
        if (index < 0 || index >= this.shape[0]) {
            throw new Error("DenseMatrix row index out of range");
        }
    };
    return DenseMatrix;
}());
exports.DenseMatrix = DenseMatrix;
