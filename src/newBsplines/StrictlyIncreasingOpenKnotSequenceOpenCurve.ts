import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { AbstractStrictlyIncreasingOpenKnotSequence } from "./AbstractStrictlyIncreasingOpenKnotSequence";
import { STRICTLYINCREASINGOPENKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, StrictlyIncreasingOpenKnotSequenceOpenCurve_type } from "./KnotSequenceConstructorInterface";
import { EM_INCONSISTENT_ORIGIN_NONUNIFORM_KNOT_SEQUENCE, EM_U_OUTOF_KNOTSEQ_RANGE } from "../ErrorMessages/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";

/**
 * Strictly increasing open knot sequence for an open B-spline curve.
 *
 * @description
 * Concrete implementation of {@link AbstractStrictlyIncreasingOpenKnotSequence} for
 * open curves. The sequence is stored in the compact form (distinct abscissae with
 * explicit multiplicities). A clamped open curve typically has boundary knots with
 * multiplicity equal to `maxMultiplicityOrder`, but uniformly spaced and
 * C0-discontinuity variants are also supported.
 *
 * After the base-class constructor has assembled the knot array, this class:
 * - Updates the normalised basis origin, with a specific check: if the first knot
 *   abscissa is not at `KNOT_SEQUENCE_ORIGIN` but its multiplicity equals
 *   `maxMultiplicityOrder`, a `RangeError` is thrown; otherwise it delegates to
 *   the base-class updater.
 * - Runs maximum multiplicity order, non-uniform multiplicity, spacing-uniformity,
 *   and multiplicity-uniformity checks.
 *
 * `clone()` returns a new `StrictlyIncreasingOpenKnotSequenceOpenCurve` preserving
 * the `isSequenceUpToC0Discontinuity` flag.
 */
export class StrictlyIncreasingOpenKnotSequenceOpenCurve extends AbstractStrictlyIncreasingOpenKnotSequence {

    
    constructor(maxMultiplicityOrder: number, knotParameters: StrictlyIncreasingOpenKnotSequenceOpenCurve_type) {
        super(maxMultiplicityOrder, knotParameters);
        this.updateNormalizedBasisOrigin();
        this.checkMaxMultiplicityOrderConsistency();
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
    }

    get isSequenceUpToC0Discontinuity(): boolean {
        return this._isSequenceUpToC0Discontinuity;
    }

    /**
     * Validates and registers the normalised-basis origin for this open-curve sequence.
     *
     * @description
     * Overrides the base implementation to enforce the open-curve constraint: when
     * the first knot is not at {@link KNOT_SEQUENCE_ORIGIN} but already carries the
     * full `maxMultiplicityOrder`, the sequence is structurally inconsistent and a
     * `RangeError` is thrown. When the first knot differs from the origin but does
     * not carry full multiplicity, the base-class logic is applied to locate the
     * actual normalised-basis start.
     *
     * @throws {RangeError} If the first knot differs from {@link KNOT_SEQUENCE_ORIGIN}
     *   and has multiplicity equal to `maxMultiplicityOrder`.
     */
    updateNormalizedBasisOrigin(): void {
        if(this.knotSequence[0].abscissa !== KNOT_SEQUENCE_ORIGIN && this._maxMultiplicityOrder === this.knotSequence[0].multiplicity) {
            this.throwRangeErrorMessage("checkCurveOrigin", EM_INCONSISTENT_ORIGIN_NONUNIFORM_KNOT_SEQUENCE);
        } else if(this.knotSequence[0].abscissa !== KNOT_SEQUENCE_ORIGIN) {
            super.updateNormalizedBasisOrigin();
        }
    }

    checkNonUniformKnotMultiplicityOrder(): void {
        this._isKnotMultiplicityNonUniform = false;
        if(this.knotSequence[0].multiplicity === this._maxMultiplicityOrder &&
            this.knotSequence[this.knotSequence.length - 1].multiplicity === this._maxMultiplicityOrder) this._isKnotMultiplicityNonUniform = true;
    }

    /**
     * Creates a deep copy of this knot sequence.
     *
     * @returns A new `StrictlyIncreasingOpenKnotSequenceOpenCurve` with the same
     *   compact knot data, preserving the `isSequenceUpToC0Discontinuity` flag.
     */
    clone(): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        if(this._isSequenceUpToC0Discontinuity) {
            return new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: this.distinctAbscissae(), multiplicities: this.multiplicities()});
        } else {
            return new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: this.distinctAbscissae(), multiplicities: this.multiplicities()});
        }
    }

    /**
     * Finds the knot span index containing parameter value `u`.
     *
     * @description
     * Returns the compact index `i` such that `knotSequence[i].abscissa ≤ u <
     * knotSequence[i+1].abscissa`. At `uMax` the index is clamped to the last
     * active span (the final knot entry is not a span start).
     * Throws a `RangeError` if `u` is outside `[KNOT_SEQUENCE_ORIGIN, uMax]`.
     *
     * @param u - Parameter value to locate. Must be in `[KNOT_SEQUENCE_ORIGIN, uMax]`.
     * @returns The compact {@link KnotIndexStrictlyIncreasingSequence} of the containing span.
     * @throws {RangeError} If `u` is outside the valid parameter domain.
     */
    findSpan(u: number): KnotIndexStrictlyIncreasingSequence {
        let index = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if (u < KNOT_SEQUENCE_ORIGIN || u > this._uMax) {
            this.throwRangeErrorMessage("findSpan", EM_U_OUTOF_KNOTSEQ_RANGE);
        } else {
            if(this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                for(const knot of this.knotSequence) {
                    index++;
                    if(Math.abs(u - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                        if(knot.abscissa === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                            index = this.knotSequence.length - 1;
                        }
                        index -= 1;
                        break;
                    }
                }
                return new KnotIndexStrictlyIncreasingSequence(index);
            }
            const indexAtUmax = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            index = this.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
        }
        return new KnotIndexStrictlyIncreasingSequence(index);
    }

    revertKnotSequence(): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, checkSequenceConsistency: boolean = true): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityMutSeq(index, checkSequenceConsistency);
        return newKnotSequence;
    }

    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>, multiplicity: number = 1, checkSequenceConsistency: boolean = true): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.raiseKnotMultiplicityKnotArrayMutSeq(index, multiplicity, checkSequenceConsistency);
        return newKnotSequence;
    }

    insertKnot(abscissae: number | number[], multiplicity: number = 1): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.insertKnotAbscissaArrayMutSeq(abscissae, multiplicity);
        return newKnotSequence;
    }

    updateKnotSequenceThroughNormalizedBasisAnalysis(): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        const previousKnotSequence = this.knotSequence.slice();
        this.updateKnotSequenceThroughNormalizedBasisAnalysisMutSeq();
        const knotAbscissae: number[] = [];
        const multiplicities: number[] = [];
        for(const knot of this.knotSequence) {
            if(knot !== undefined) {
                knotAbscissae.push(knot.abscissa);
                multiplicities.push(knot.multiplicity);
            }
        }
        const updatedSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knotAbscissae, multiplicities: multiplicities});
        this.knotSequence = previousKnotSequence;
        return updatedSeq;
    }
}