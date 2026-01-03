"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DenseMatrix = void 0;
/**
 * A dense matrix
 */
class DenseMatrix {
    /**
     * Create a square matrix
     * @param nrows Number of rows
     * @param ncols Number of columns
     * @param data A row after row flat array
     * @throws If data length is not equal to nrows*ncols
     */
    constructor(nrows, ncols, data) {
        this._shape = [nrows, ncols];
        if (data) {
            if (data.length !== this.shape[0] * this.shape[1]) {
                throw new Error("Dense matrix constructor expect the data to have nrows*ncols length");
            }
            this.data = data.slice();
        }
        else {
            this.data = [];
            for (let i = 0; i < this.shape[0] * this.shape[1]; i += 1) {
                this.data.push(0);
            }
        }
    }
    /**
     * Returns the shape of the matrix : [number of rows, number of columns]
     */
    get shape() {
        return this._shape;
    }
    /**
     * Return the corresponding index in the flat row by row data vector
     * @param row The row index
     * @param column The column index
     */
    dataIndex(row, column) {
        let n = row * this.shape[1] + column;
        return n;
    }
    /**
     * Return the value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @return Scalar
     * @throws If an index is out of range
     */
    get(row, column) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        return this.data[this.dataIndex(row, column)];
    }
    /**
     * Set a given value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @param value The new value
     * @throws If an index is out of range
     */
    set(row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] = value;
    }
    /**
     * Check that the column index is inside appropriate range
     * @param index The column index
     * @throws If index is out of range
     */
    checkColumnRange(index) {
        if (index < 0 || index >= this.shape[1]) {
            throw new Error("DenseMatrix column index out of range");
        }
    }
    /**
     * Check that the row index is inside appropriate range
     * @param index The row index
     * @throws If index is out of range
     */
    checkRowRange(index) {
        if (index < 0 || index >= this.shape[0]) {
            throw new Error("DenseMatrix row index out of range");
        }
    }
}
exports.DenseMatrix = DenseMatrix;
