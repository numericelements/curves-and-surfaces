/**
 * Data transfer object carrying the extracted parameters of an increasing open knot sequence
 * within a contiguous index window.
 *
 * @description
 * Produced by span-extraction utilities and consumed by the Cox–De Boor and other similar algorithms.
 * The `knots` array is the flat (increasing) knot vector; `indexLeft` and `indexRight`
 * delimit the window of knots relevant to a single evaluation span.
 */
export interface increasingKnotSequenceExtractionInterface {
    /** Maximum allowed multiplicity order of the source sequence. */
    maxMultiplicityOrder: number;
    /** Flat index of the leftmost knot in the extraction window. */
    indexLeft: number;
    /** Flat index of the rightmost knot in the extraction window. */
    indexRight: number;
    /** The flat (increasing) knot vector, with repeated values for knots of multiplicity > 1. */
    knots: readonly number[];
}

/** @internal Used only to force code-coverage instrumentation of this interface. */
export function testFunctionForCoveragePurposesOnly_increasingKnotSequenceExtractionInterface(
    maxMultiplicityOrder: number,
    indexLeft: number,
    indexRight: number,
    knots: readonly number[]
): increasingKnotSequenceExtractionInterface {
    return { maxMultiplicityOrder, indexLeft, indexRight, knots };
}