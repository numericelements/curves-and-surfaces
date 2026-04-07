import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { KnotSequenceInterface } from "./KnotSequenceInterface";

/**
 * Contract for knot sequences represented in their increasing (flat) form.
 *
 * @description
 * In the increasing representation every knot appears as many times as its multiplicity,
 * so the array length equals the total knot count. This is the standard B-spline knot
 * vector format used by the Cox–De Boor algorithm.
 * Extends {@link KnotSequenceInterface} with index types, span lookup, and mutation operations.
 */
export interface IncreasingKnotSequenceInterface extends KnotSequenceInterface {

    /**
     * The complete knot vector in increasing order, with repeated values for knots of multiplicity > 1.
     * Length equals {@link KnotSequenceInterface.length}.
     */
    allAbscissae: readonly number[];

    /** True if at least one knot carries a multiplicity different from the others. */
    isKnotMultiplicityNonUniform: boolean;

    /** The upper bound of the parameter domain (abscissa of the last knot). */
    uMax: number;

    /**
     * Returns a deep copy of this knot sequence.
     * @returns A new independent instance with identical content.
     */
    clone(): IncreasingKnotSequenceInterface;

    /**
     * Tests whether a given abscissa coincides with a knot in the sequence.
     * @param abscissa - The parameter value to test.
     * @returns `true` if `abscissa` matches a knot within the coincidence tolerance.
     */
    isAbscissaCoincidingWithKnot(abscissa: number): boolean;

    /**
     * Returns the abscissa at a given position in the increasing sequence.
     * @param index - Index into the flat (increasing) knot vector.
     * @returns The abscissa value at that position.
     */
    abscissaAtIndex(index: KnotIndexIncreasingSequence): number;

    /**
     * Returns the multiplicity of the knot whose abscissa matches the given value.
     * @param abscissa - The abscissa to look up.
     * @returns The multiplicity at that abscissa, or 0 if no knot is found there.
     */
    knotMultiplicityAtAbscissa(abscissa: number): number;

    /**
     * Converts a flat (increasing) index to its corresponding strictly increasing index.
     * @param index - An index in the flat knot vector.
     * @returns The index of the distinct knot that contains this flat position.
     */
    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence;

    /**
     * Finds the knot span index for a given parameter value using the standard B-spline span algorithm.
     * @param u - The parameter value to locate.
     * @returns The flat index `i` such that `allAbscissae[i] ≤ u < allAbscissae[i+1]`.
     */
    findSpan(u: number): KnotIndexIncreasingSequence;

    /**
     * Returns a new sequence with a knot inserted at the specified abscissa.
     * @param abscissa - The parameter value at which to insert the knot.
     * @param multiplicity - The multiplicity of the inserted knot.
     * @returns A new knot sequence with the insertion applied.
     */
    insertKnot(abscissa: number, multiplicity: number): IncreasingKnotSequenceInterface;

    /**
     * Returns a new sequence with the multiplicity of a knot increased by `multiplicity`.
     * @param index - Strictly increasing index of the knot to raise.
     * @param multiplicity - The amount by which to raise the multiplicity.
     * @returns A new knot sequence with the updated multiplicity.
     */
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): IncreasingKnotSequenceInterface;

    /**
     * Decreases the multiplicity of the specified knot by one.
     * @param index - Strictly increasing index of the knot to decrement.
     * @param checkSequenceConsistency - If `true`, validates the sequence after the operation.
     */
    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, checkSequenceConsistency: boolean): void;

    /**
     * Extracts a contiguous sub-array of abscissae between two flat indices (inclusive).
     * @param knotStart - The start position in the flat knot vector.
     * @param knotEnd - The end position in the flat knot vector.
     * @returns The abscissae values from `knotStart` to `knotEnd`.
     */
    extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[];
}