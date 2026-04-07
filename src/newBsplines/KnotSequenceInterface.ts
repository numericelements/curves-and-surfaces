import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";

/**
 * Core contract for all B-spline knot sequences.
 *
 * @description
 * Defines the minimal set of operations and invariants that every knot sequence
 * must support, regardless of its representation (increasing, strictly increasing,
 * open, or periodic). Derived interfaces specialise this contract for specific
 * sequence categories.
 */
export interface KnotSequenceInterface {

    /** Maximum allowed multiplicity for any single knot in the sequence. */
    readonly maxMultiplicityOrder: number;

    /** True if all intervals between consecutive distinct knots are equal in length. */
    readonly isKnotSpacingUniform: boolean;

    /** True if all distinct knots carry the same multiplicity. */
    readonly isKnotMultiplicityUniform: boolean;

    /**
     * Index of the knot located at the sequence origin (abscissa defined by {@link KNOT_SEQUENCE_ORIGIN} (set to 0 in principle)).
     * Used as a reference point for span lookup and periodic sequence alignment.
     */
    readonly indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;

    /**
     * Returns the sorted list of distinct knot abscissae, without repetitions.
     * @returns Array of unique abscissa values in strictly increasing order.
     */
    distinctAbscissae(): number[];

    /**
     * Returns the multiplicity of each distinct knot.
     * @returns Array parallel to {@link distinctAbscissae}: entry `i` is the multiplicity of the `i`-th distinct knot.
     */
    multiplicities(): number[];

    /**
     * Validates that no knot multiplicity exceeds {@link maxMultiplicityOrder}.
     * @throws {RangeError} If any knot multiplicity exceeds `maxMultiplicityOrder`.
     */
    checkMaxMultiplicityOrderConsistency(): void;

    /**
     * Validates that knot spacing is uniform across the sequence.
     * @throws {RangeError} If knot spacing is not uniform.
     */
    checkUniformityOfKnotSpacing(): void;

    /**
     * Validates that all distinct knots carry equal multiplicity.
     * @throws {RangeError} If knot multiplicities are not uniform.
     */
    checkUniformityOfKnotMultiplicity(): void;

    /**
     * Validates that no interior (non-boundary) knot has multiplicity equal to `maxMultiplicityOrder`.
     * @throws {RangeError} If an interior knot reaches the maximum multiplicity.
     */
    checkMaxKnotMultiplicityAtIntermediateKnots(): void;

    /**
     * Validates that the provided knot abscissae form a non-decreasing sequence.
     * @param knots - Array of knot abscissa values to validate.
     * @throws {RangeError} If any value is strictly less than its predecessor.
     */
    checkKnotIncreasingValues(knots: readonly number[]): void;

    /**
     * Validates that the provided knot abscissae form a strictly increasing sequence.
     * @param knots - Array of knot abscissa values to validate.
     * @throws {RangeError} If any value is less than or equal to its predecessor.
     */
    checkKnotStrictlyIncreasingValues(knots: readonly number[]): void;

    /**
     * Tests whether a given abscissa coincides with a knot in the sequence.
     * @param abscissa - The parameter value to test.
     * @returns `true` if `abscissa` matches a knot position within the coincidence tolerance {@link KNOT_COINCIDENCE_TOLERANCE}.
     */
    isAbscissaCoincidingWithKnot(abscissa: number): boolean;

    /**
     * Tests whether the knot at a given abscissa has been reduced to multiplicity zero (i.e. removed).
     * @param abscissa - The parameter value to test.
     * @returns `true` if the knot at `abscissa` has multiplicity 0.
     */
    isKnotlMultiplicityZero(abscissa: number): boolean;

    /**
     * Returns the multiplicity of the knot identified by a strictly increasing sequence index.
     * @param index - Index into the strictly increasing view of the sequence.
     * @returns The multiplicity of the knot at that index.
     */
    knotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): number;

    /**
     * Returns a new knot sequence with the knot order reversed.
     * @returns A new `KnotSequenceInterface` whose abscissae run in the opposite direction.
     */
    revertKnotSequence(): KnotSequenceInterface;

    /**
     * Returns the total number of knots in the sequence, counting multiplicities.
     * @returns The sum of all knot multiplicities.
     */
    length(): number;
}