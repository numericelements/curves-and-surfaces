"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnotIndexIncreasingSequence = void 0;
const AbstractKnotIndex_1 = require("./AbstractKnotIndex");
const KnotIndexConstructorInterface_1 = require("./KnotIndexConstructorInterface");
/**
 * Represents a knot index in an increasing sequence
 *
 * @description
 * Implements a knot index where each value must be greater than or equal to the previous one
 * in the sequence. This allows for repeated knot values, which is useful for representing
 * B-spline knot sequences with multiple knots at the same position.
 *
 * @extends AbstractKnotIndex
 */
class KnotIndexIncreasingSequence extends AbstractKnotIndex_1.AbstractKnotIndex {
    /**
     * Creates a new increasing knot index
     * @param value - The initial index value
     * @throws {RangeError} If value is negative
     */
    constructor(value) {
        super(value);
        this._knotIndex = { type: KnotIndexConstructorInterface_1.KNOT_INDEX_INCREASING_SEQUENCE, index: value };
    }
}
exports.KnotIndexIncreasingSequence = KnotIndexIncreasingSequence;
