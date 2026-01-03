"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquareMatrix = void 0;
/**
 * A square matrix
 */
class SquareMatrix {
    /**
     * Create a square matrix
     * @param size Number of row and column
     * @param data A row after row flat array
     * @throws If data length is not equal to size*size
     */
    constructor(size, data) {
        this._shape = [size, size];
        if (data) {
            if (data.length !== size * size) {
                throw new Error("Square matrix constructor expect the data to have size*size length");
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
        let n = row * this._shape[1] + column;
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
     * Change the value of the matrix at a given row and column position by this value divided by the divisor value
     * @param row The row index
     * @param column The column index
     * @param divisor The divisor value
     * @throws If an index is out of range
     */
    divideAt(row, column, divisor) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] /= divisor;
    }
    /**
     * Change the value of the matrix at a given row and column position by this value substracted by the subtrahend value
     * @param row The row index
     * @param column The column index
     * @param divisor The divisor value
     * @throws If an index is out of range
     */
    substractAt(row, column, subtrahend) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] -= subtrahend;
    }
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    checkRowRange(index) {
        if (index < 0 || index >= this.shape[0]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    }
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    checkColumnRange(index) {
        if (index < 0 || index >= this.shape[1]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    }
    /**
     * Multiply a matrix by a vector
     * @param v A vector the same size the matrix
     * @return a vector
     */
    multiplyByVector(v) {
        if (this.shape[0] !== v.length) {
            throw new Error("SquareMatrix multiply a vector of incorrect length");
        }
        let result = [];
        const n = this.shape[0];
        for (let i = 0; i < n; i += 1) {
            let temp = 0;
            for (let j = 0; j < n; j += 1) {
                temp += this.get(i, j) * v[j];
            }
            result.push(temp);
        }
        return result;
    }
    /**
     * Multiply two matrices
     * @param that A square or a symmetric matrix
     * @return a square matrix
     */
    multiplyByMatrix(that) {
        if (this.shape[1] !== that.shape[0]) {
            throw new Error("Size mismatch in matrix multiplication");
        }
        let result = new SquareMatrix(this.shape[1]);
        for (let i = 0; i < this.shape[0]; i += 1) {
            for (let j = 0; j < this.shape[0]; j += 1) {
                let temp = 0;
                for (let k = 0; k < this.shape[0]; k += 1) {
                    temp += this.get(i, k) * that.get(k, j);
                }
                result.set(i, j, temp);
            }
        }
        return result;
    }
}
exports.SquareMatrix = SquareMatrix;
