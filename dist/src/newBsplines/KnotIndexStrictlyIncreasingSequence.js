"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnotIndexStrictlyIncreasingSequence = void 0;
const AbstractKnotIndex_1 = require("./AbstractKnotIndex");
const KnotIndexConstructorInterface_1 = require("./KnotIndexConstructorInterface");
/**
 * Represents a knot index in a strictly increasing sequence
 *
 * @description
 * Implements a knot index where each value must be strictly greater than the previous one
 * in the sequence. This is used in B-spline knot sequences where no repeated knot values
 * are allowed, ensuring strict monotonicity.
 *
 * @extends AbstractKnotIndex
 */
class KnotIndexStrictlyIncreasingSequence extends AbstractKnotIndex_1.AbstractKnotIndex {
    /**
     * Creates a new strictly increasing knot index
     * @param value - The initial index value
     * @throws {RangeError} If value is negative
     */
    constructor(value) {
        super(value);
        this._knotIndex = { type: KnotIndexConstructorInterface_1.KNOT_INDEX_STRICTLY_INCREASING_SEQUENCE, index: value };
    }
}
exports.KnotIndexStrictlyIncreasingSequence = KnotIndexStrictlyIncreasingSequence;
