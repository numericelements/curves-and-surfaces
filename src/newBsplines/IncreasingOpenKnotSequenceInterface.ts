import { IncreasingKnotSequenceInterface } from "./IncreasingKnotSequenceInterface";
import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";

/**
 * Contract for increasing open knot sequences (clamped at both ends).
 *
 * @description
 * An increasing open knot sequence is a non-decreasing sequence of real numbers.
 * The sequence can be of type uniform or non-uniform, depending on whether all internal
 * knots have the same multiplicity.
 * A non-uniform open knot sequence has boundary knots with multiplicity equal to
 * `maxMultiplicityOrder`, ensuring that the B-spline curve interpolates its
 * first and last control points. This interface covers both open-curve and
 * closed-curve variants; for closed curves the sequence is internally extended
 * with wrap-around copies of the boundary knots.
 * Extends {@link IncreasingKnotSequenceInterface} with index conversion, span lookup,
 * and mutation operations specific to open sequences.
 */
export interface IncreasingOpenKnotSequenceInterface extends IncreasingKnotSequenceInterface {

    indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    uMax: number;
    allAbscissae: readonly number[];
    isKnotMultiplicityNonUniform: boolean;

    /**
     * Returns a deep copy of this knot sequence.
     * @returns A new independent instance with identical content.
     */
    clone(): IncreasingOpenKnotSequenceInterface;

    /**
     * Returns the abscissa at the given flat (increasing) index.
     * @param index - Position in the flat knot vector.
     * @returns The abscissa value at that position.
     */
    abscissaAtIndex(index: KnotIndexIncreasingSequence): number;

    /**
     * Returns the multiplicity of the knot at the given abscissa.
     * @param abscissa - The abscissa to look up.
     * @returns The multiplicity, or 0 if no knot coincides with that value.
     */
    knotMultiplicityAtAbscissa(abscissa: number): number;

    /**
     * Converts a strictly increasing index to the first corresponding flat index.
     * @param index - An index in the strictly increasing view.
     * @returns The flat index pointing to the first occurrence of that knot's abscissa.
     */
    toKnotIndexIncreasingSequence(index: KnotIndexStrictlyIncreasingSequence): KnotIndexIncreasingSequence;

    /**
     * Converts a flat (increasing) index to its strictly increasing index.
     * @param index - Position in the flat knot vector.
     * @returns The strictly increasing index of the distinct knot at that position.
     */
    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence;

    /**
     * Finds the knot span index for a given parameter value.
     * @param u - The parameter value, which must satisfy `0 ≤ u ≤ uMax`.
     * @returns The flat index `i` such that `allAbscissae[i] ≤ u < allAbscissae[i+1]`.
     */
    findSpan(u: number): KnotIndexIncreasingSequence;

    /**
     * Returns a new sequence with a knot inserted at the specified abscissa.
     * @param abscissa - The parameter value at which to insert.
     * @param multiplicity - The multiplicity of the insertion.
     * @returns A new open knot sequence with the knot inserted.
     */
    insertKnot(abscissa: number, multiplicity: number): IncreasingOpenKnotSequenceInterface;

    /**
     * Returns a new sequence with the multiplicity of the specified knot raised.
     * @param index - Strictly increasing index of the target knot.
     * @param multiplicity - Amount by which to raise the multiplicity.
     * @returns A new open knot sequence with the updated multiplicity.
     */
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): IncreasingOpenKnotSequenceInterface;

    /**
     * Returns a new sequence with the multiplicity of the specified knot decremented by one.
     * @param index - Strictly increasing index of the target knot.
     * @param checkSequenceConsistency - If `true`, validates the sequence after the operation.
     * @returns A new open knot sequence with the decremented multiplicity.
     */
    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, checkSequenceConsistency: boolean): IncreasingOpenKnotSequenceInterface;

    /**
     * Recomputes the knot sequence to restore the normalised B-spline basis property.
     * Called after knot removal to re-establish partition-of-unity conditions.
     */
    updateKnotSequenceThroughNormalizedBasisAnalysis(): void;

    /**
     * Extracts a contiguous sub-array of abscissae between two flat indices (inclusive).
     * @param knotStart - Start position in the flat knot vector.
     * @param knotEnd - End position in the flat knot vector.
     * @returns The abscissae from `knotStart` to `knotEnd`.
     */
    extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[];
}