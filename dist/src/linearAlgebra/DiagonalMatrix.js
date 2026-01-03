"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identityMatrix = exports.DiagonalMatrix = void 0;
/**
 * An identity matrix
 */
class DiagonalMatrix {
    /**
     * Create a Symmetric Matrix
     * @param size The number of rows or the number columns
     * @param data The matrix data in a flat vector
     */
    constructor(size, data) {
        this._shape = [size, size];
        if (data) {
            if (data.length !== size) {
                throw new Error("Diagonal matrix constructor expect the data to have size length");
            }
            this.data = data.slice();
        }
        else {
            this.data = [];
            const n = size;
            for (let i = 0; i < n; i += 1) {
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
 * Returns the value at a given row and column position
 * @param row The row index
 * @param column The column index
 * @return Scalar
 * @throws If an index is out of range
 */
    get(row, column) {
        this.checkRange(row, column);
        return this.data[row];
    }
    /**
     * Set a given value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @param value The new value
     * @throws If an index is out of range
     */
    set(row, column, value) {
        this.checkRange(row, column);
        this.data[row] = value;
    }
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    checkRange(row, column) {
        if (row < 0 || row >= this.shape[0] || row != column) {
            throw new Error("DiagonalMatrix index is out of range");
        }
    }
}
exports.DiagonalMatrix = DiagonalMatrix;
function identityMatrix(n) {
    let result = new DiagonalMatrix(n);
    for (let i = 0; i < n; i += 1) {
        result.set(i, i, 1);
    }
    return result;
}
exports.identityMatrix = identityMatrix;
