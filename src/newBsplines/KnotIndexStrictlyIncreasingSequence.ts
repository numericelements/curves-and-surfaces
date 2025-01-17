import { AbstractKnotIndex } from "./AbstractKnotIndex";
import { KNOT_INDEX_STRICTLY_INCREASING_SEQUENCE, StrictlyIncreasingSequence } from "./KnotIndexConstructorInterface";

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
export class KnotIndexStrictlyIncreasingSequence extends AbstractKnotIndex {

    protected _knotIndex: StrictlyIncreasingSequence;

    /**
     * Creates a new strictly increasing knot index
     * @param value - The initial index value
     * @throws {RangeError} If value is negative
     */
    constructor(value: number) {
        super(value);
        this._knotIndex = {type: KNOT_INDEX_STRICTLY_INCREASING_SEQUENCE, index: value};
    }
}