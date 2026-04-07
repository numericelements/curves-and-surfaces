import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { StrictlyIncreasingKnotSequenceInterface } from "./StrictlyIncreasingKnotSequenceInterface";

/**
 * Contract for strictly increasing open knot sequences (clamped at both ends).
 *
 * @description
 * Extends {@link StrictlyIncreasingKnotSequenceInterface} for open (clamped) sequences
 * where boundary knots carry up to multiplicity `maxMultiplicityOrder` and produces
 * a partition of unity in the interval `[{@link KNOT_SEQUENCE_ORIGIN}, uMax]`. Provides index
 * conversion, span lookup, and mutation operations in the strictly increasing domain.
 * The closed-curve variant includes extended boundary knots to ensure C-continuity
 * across the seam.
 */
export interface StrictlyIncreasingOpenKnotSequenceInterface extends StrictlyIncreasingKnotSequenceInterface {

    indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    uMax: number;
    allAbscissae: readonly number[];
    isKnotMultiplicityNonUniform: boolean;

    /**
     * Returns a deep copy of this knot sequence.
     * @returns A new independent instance with identical content.
     */
    clone(): StrictlyIncreasingOpenKnotSequenceInterface;

    /**
     * Returns the abscissa at the given strictly increasing index.
     * @param index - Position in the strictly increasing knot array.
     * @returns The abscissa value at that position.
     */
    abscissaAtIndex(index: KnotIndexStrictlyIncreasingSequence): number;

    /**
     * Returns the multiplicity of the knot at the given abscissa.
     * @param abscissa - The abscissa to look up.
     * @returns The multiplicity, or 0 if no knot coincides with that value.
     */
    knotMultiplicityAtAbscissa(abscissa: number): number;

    /**
     * Converts a strictly increasing index to the first corresponding flat (increasing) index.
     * @param index - An index in the strictly increasing view.
     * @returns The flat index pointing to the first occurrence of that knot's abscissa.
     */
    toKnotIndexIncreasingSequence(index: KnotIndexStrictlyIncreasingSequence): KnotIndexIncreasingSequence;

    /**
     * Finds the knot span index for a given parameter value.
     * @param u - The parameter value, which must satisfy `0 ≤ u ≤ uMax`.
     * @returns The strictly increasing index `i` such that `allAbscissae[i] ≤ u < allAbscissae[i+1]`.
     */
    findSpan(u: number): KnotIndexStrictlyIncreasingSequence;

    /**
     * Returns a new sequence with a knot inserted at the specified abscissa.
     * @param abscissa - The parameter value at which to insert.
     * @param multiplicity - The multiplicity of the insertion.
     * @returns A new open knot sequence with the knot inserted.
     */
    insertKnot(abscissa: number, multiplicity: number): StrictlyIncreasingOpenKnotSequenceInterface;

    /**
     * Returns a new sequence with the multiplicity of the specified knot raised.
     * @param index - Strictly increasing index of the target knot.
     * @param multiplicity - Amount by which to raise the multiplicity.
     * @returns A new open knot sequence with the updated multiplicity.
     */
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): StrictlyIncreasingOpenKnotSequenceInterface;

    /**
     * Returns a new sequence with the multiplicity of the specified knot decremented by one.
     * @param index - Strictly increasing index of the target knot.
     * @param checkSequenceConsistency - If `true`, validates the sequence after the operation.
     * @returns A new open knot sequence with the decremented multiplicity.
     */
    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, checkSequenceConsistency: boolean): StrictlyIncreasingOpenKnotSequenceInterface;

    /**
     * Recomputes the knot sequence to restore the normalised B-spline basis property.
     * Called after knot removal to re-establish partition-of-unity conditions.
     */
    updateKnotSequenceThroughNormalizedBasisAnalysis(): void;
}