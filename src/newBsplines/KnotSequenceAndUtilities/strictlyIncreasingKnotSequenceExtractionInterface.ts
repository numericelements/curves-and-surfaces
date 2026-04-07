import { increasingKnotSequenceExtractionInterface } from "./increasingKnotSequenceExtractionInterface";

/**
 * Extends {@link increasingKnotSequenceExtractionInterface} with the multiplicity array
 * needed when the source sequence is in strictly increasing form.
 *
 * @description
 * Used by utility functions that convert a strictly increasing knot sequence extraction
 * into a flat representation for the Cox–De Boor and other similar algorithms.
 */
export interface strictlyIncreasingKnotSequenceExtractionInterface extends increasingKnotSequenceExtractionInterface {
    /**
     * Multiplicity of each distinct knot in `knots`.
     * Parallel array: `multiplicities[i]` is the multiplicity of `knots[i]`.
     */
    multiplicities: readonly number[];
}

/** @internal Used only to force code-coverage instrumentation of this interface. */
export function testFunctionForCoveragePurposesOnly_strictlyIncreasingKnotSequenceExtractionInterface(
    maxMultiplicityOrder: number,
    indexLeft: number,
    indexRight: number,
    knots: readonly number[],
    multiplicities: readonly number[]
): strictlyIncreasingKnotSequenceExtractionInterface {
    return { maxMultiplicityOrder, indexLeft, indexRight, knots, multiplicities };
}