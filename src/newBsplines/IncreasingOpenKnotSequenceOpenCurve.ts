import { KNOT_COINCIDENCE_TOLERANCE, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { AbstractIncreasingOpenKnotSequence } from "./AbstractIncreasingOpenKnotSequence";
import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, IncreasingOpenKnotSequenceOpenCurve_type } from "./KnotSequenceConstructorInterface";
import { KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";
import { EM_U_OUTOF_KNOTSEQ_RANGE } from "../ErrorMessages/KnotSequences";
import { fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC } from "./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";

/**
 * Increasing open knot sequence for an open B-spline curve.
 *
 * @description
 * Concrete implementation of {@link AbstractIncreasingOpenKnotSequence} for open
 * curves. The sequence is stored in the flat increasing form (repeated abscissae for
 * knots with multiplicity > 1). A clamped open curve typically has boundary knots
 * with multiplicity equal to `maxMultiplicityOrder`, but uniformly spaced and
 * C0-discontinuity variants are also supported.
 *
 * After the base-class constructor has assembled the knot array, this class:
 * - Updates the normalised basis origin (unless the sequence runs up to a C0
 *   discontinuity).
 * - Runs non-uniform multiplicity, spacing-uniformity, and multiplicity-uniformity
 *   checks.
 *
 * `clone()` returns a new `IncreasingOpenKnotSequenceOpenCurve` preserving the
 * `isSequenceUpToC0Discontinuity` flag. The iterator exposes knot abscissae in
 * the flat (repeated) form expected by Cox–de Boor evaluation.
 */
export class IncreasingOpenKnotSequenceOpenCurve extends AbstractIncreasingOpenKnotSequence {

    constructor(maxMultiplicityOrder: number, knotParameters: IncreasingOpenKnotSequenceOpenCurve_type) {
        super(maxMultiplicityOrder, knotParameters);

        if(knotParameters.type !== INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY) this.updateNormalizedBasisOrigin();
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
    }

    checkNonUniformKnotMultiplicityOrder(): void {
        this._isKnotMultiplicityNonUniform = false;
        if(this.knotSequence[0].multiplicity === this._maxMultiplicityOrder &&
            this.knotSequence[this.knotSequence.length - 1].multiplicity === this._maxMultiplicityOrder) this._isKnotMultiplicityNonUniform = true;
    }

    /**
     * Creates a deep copy of this knot sequence.
     *
     * @returns A new `IncreasingOpenKnotSequenceOpenCurve` with the same knot abscissae,
     *   preserving the `isSequenceUpToC0Discontinuity` flag.
     */
    clone(): IncreasingOpenKnotSequenceOpenCurve {
        if(this._isSequenceUpToC0Discontinuity) {
            return new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: this.allAbscissae});
        } else {
            return new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: this.allAbscissae});
        }
    }

    /**
     * Converts a flat increasing-sequence index to the corresponding compact
     * strictly-increasing-sequence index.
     *
     * @description
     * Builds a transient {@link StrictlyIncreasingOpenKnotSequenceOpenCurve} via
     * {@link fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC}, then scans its
     * abscissae to locate the position matching the abscissa at `index`.
     *
     * @param index - Index in the flat increasing representation.
     * @returns The corresponding {@link KnotIndexStrictlyIncreasingSequence}.
     */
    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence {
        const strictlyIncreasingKnotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(this);
        const abscissa = this.abscissaAtIndex(index);
        let i = 0;
        for(const knot of strictlyIncreasingKnotSequence.allAbscissae) {
            if(knot !== undefined) {
                if(knot === abscissa) break;
                i++;
            }
        }
        return new KnotIndexStrictlyIncreasingSequence(i);
    }

    /**
     * Finds the knot span index containing parameter value `u`.
     *
     * @description
     * Returns the flat increasing-sequence index `i` such that
     * `allAbscissae[i] ≤ u < allAbscissae[i+1]`. At `uMax` the returned index
     * maps to the last active span (not the final repeated knot).
     * Throws a `RangeError` if `u` is outside `[KNOT_SEQUENCE_ORIGIN, uMax]`.
     *
     * @param u - Parameter value to locate. Must be in `[KNOT_SEQUENCE_ORIGIN, uMax]`.
     * @returns The flat {@link KnotIndexIncreasingSequence} of the containing span.
     * @throws {RangeError} If `u` is outside the valid parameter domain.
     */
    findSpan(u: number): KnotIndexIncreasingSequence {
        let index = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if(u < KNOT_SEQUENCE_ORIGIN || u > this._uMax) {
            this.throwRangeErrorMessage("findSpan", EM_U_OUTOF_KNOTSEQ_RANGE);
        } else {
            if(this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                for(const knot of this.knotSequence) {
                    index += knot.multiplicity;
                    if(Math.abs(u - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                        if(knot.abscissa === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                            index -= this.knotSequence[this.knotSequence.length - 1].multiplicity
                        }
                        const curveDegree = this._maxMultiplicityOrder - 1;
                        if(this.isKnotMultiplicityUniform && index === (this.knotSequence.length - curveDegree)) index -= 1;
                        index -= 1;
                        break;
                    }
                }
                return new KnotIndexIncreasingSequence(index);
            }
            const indexAtUmax = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            index = this.findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
        }
        return new KnotIndexIncreasingSequence(index);
    }

    revertKnotSequence(): IncreasingOpenKnotSequenceOpenCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>, checkSequenceConsistency: boolean = true): IncreasingOpenKnotSequenceOpenCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityKnotArrayMutSeq(index, checkSequenceConsistency);
        return newKnotSequence;
    }

    raiseKnotMultiplicity(arrayIndices: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>, multiplicity: number = 1, checkSequenceConsistency: boolean = true): IncreasingOpenKnotSequenceOpenCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.raiseKnotMultiplicityKnotArrayMutSeq(arrayIndices, multiplicity, checkSequenceConsistency);
        return newKnotSequence;
    }

    insertKnot(arrayAbscissae: number | number[], multplicity = 1): IncreasingOpenKnotSequenceOpenCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.insertKnotAbscissaArrayMutSeq(arrayAbscissae, multplicity);
        return newKnotSequence;
    }

    updateKnotSequenceThroughNormalizedBasisAnalysis(): IncreasingOpenKnotSequenceOpenCurve {
        const previousKnotSequence = this.knotSequence.slice();
        this.updateKnotSequenceThroughNormalizedBasisAnalysisMutSeq();
        const knotAbscissae: number[] = [];
        for(const knot of this.allAbscissae) {
            knotAbscissae.push(knot);
        }
        let updatedSeq = new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knotAbscissae});
        if(this._isSequenceUpToC0Discontinuity)
            updatedSeq = new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knotAbscissae});
        this.knotSequence = previousKnotSequence;
        return updatedSeq;
    }

}