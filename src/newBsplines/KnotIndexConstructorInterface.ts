
/**
 * Named constants for knot indices constructor types
 */

export const KNOT_INDEX_INCREASING_SEQUENCE = "KnotIndexIncreasingSequence" as const;
export const KNOT_INDEX_STRICTLY_INCREASING_SEQUENCE = "KnotIndexStrictlyIncreasingSequence" as const;

/**
 * Represents a knot index in an increasing sequence
 * @interface
 * @property {string} type - Identifier for increasing sequence type
 * @property {number} index - The index value in the sequence
 */
export interface IncreasingSequence {
    type: typeof KNOT_INDEX_INCREASING_SEQUENCE;
    index : number;
}

/**
 * Represents a knot index in a strictly increasing sequence
 * @interface
 * @property {string} type - Identifier for strictly increasing sequence type
 * @property {number} index - The index value in the sequence
 */
export interface StrictlyIncreasingSequence {
    type: typeof KNOT_INDEX_STRICTLY_INCREASING_SEQUENCE;
    index : number;
}

/**
 * Union type representing either an increasing or strictly increasing knot index of a knot into a knot sequence
 * @typedef {IncreasingSequence | StrictlyIncreasingSequence} AbstractKnotIndex_type
 */
export type AbstractKnotIndex_type = IncreasingSequence | StrictlyIncreasingSequence;

/**
 * Interface defining the knot index property
 * @interface
 * @property {number} knotIndex - The index value of the knot
 */
export interface KnotIndexInterface {
    knotIndex: number;
}