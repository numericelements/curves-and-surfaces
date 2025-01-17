import { AbstractKnotIndex } from "./AbstractKnotIndex";
import { IncreasingSequence, KNOT_INDEX_INCREASING_SEQUENCE } from "./KnotIndexConstructorInterface";

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
export class KnotIndexIncreasingSequence extends AbstractKnotIndex {

    protected _knotIndex: IncreasingSequence;

    /**
     * Creates a new increasing knot index
     * @param value - The initial index value
     * @throws {RangeError} If value is negative
     */
    constructor(value: number) {
        super(value);
        this._knotIndex = {type: KNOT_INDEX_INCREASING_SEQUENCE, index: value};
    }
}