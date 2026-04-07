import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { KnotSequenceInterface } from "./KnotSequenceInterface";

/**
 * Contract for knot sequences represented in their strictly increasing (compact) form.
 *
 * @description
 * In the strictly increasing representation each distinct abscissa appears exactly once
 * and its multiplicity is stored separately. This form is more compact than the flat
 * increasing vector and is used for knot-insertion algorithms that manipulate the
 * multiplicity array directly.
 * Extends {@link KnotSequenceInterface} with index-based access, span lookup, and
 * mutation operations expressed in terms of strictly increasing indices.
 */
export interface StrictlyIncreasingKnotSequenceInterface extends KnotSequenceInterface {

    /**
     * The complete knot vector in strictly increasing order, with each abscissa listed once.
     * The length equals the number of distinct knots.
     */
    allAbscissae: readonly number[];

    /**
     * Tests whether a given abscissa coincides with a knot in the sequence.
     * @param abscissa - The parameter value to test.
     * @returns `true` if `abscissa` matches a knot within the coincidence tolerance {@link KNOT_COINCIDENCE_TOLERANCE}.
     */
    isAbscissaCoincidingWithKnot(abscissa: number): boolean;

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
     * Finds the knot span index for a given parameter value.
     * @param u - The parameter value to locate.
     * @returns The strictly increasing index `i` such that `allAbscissae[i] ≤ u < allAbscissae[i+1]`.
     */
    findSpan(u: number): KnotIndexStrictlyIncreasingSequence;

    /**
     * Returns a new sequence with a knot inserted at the specified abscissa.
     * @param abscissa - The parameter value at which to insert the knot.
     * @param multiplicity - The multiplicity of the inserted knot.
     * @returns A new knot sequence with the insertion applied.
     */
    insertKnot(abscissa: number, multiplicity: number): StrictlyIncreasingKnotSequenceInterface;

    /**
     * Increases the multiplicity of the specified knot in place.
     * @param index - Strictly increasing index of the knot to raise.
     * @param multiplicity - Amount by which to raise the multiplicity.
     */
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): void;

    /**
     * Returns a new knot sequence with the knot order reversed.
     * @returns A new `StrictlyIncreasingKnotSequenceInterface` whose abscissae run in the opposite direction.
     */
    revertKnotSequence(): StrictlyIncreasingKnotSequenceInterface;
}