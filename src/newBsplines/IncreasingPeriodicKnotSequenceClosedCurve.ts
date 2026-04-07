import { WarningLog } from "../errorProcessing/ErrorLoging";
import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { AbstractPeriodicKnotSequence } from "./AbstractPeriodicKnotSequence";
import { Knot } from "./Knot";
import { IncreasingPeriodicKnotSequence, INCREASINGPERIODICKNOTSEQUENCE, IncreasingPeriodicKnotSequenceClosedCurve_type } from "./KnotSequenceConstructorInterface";
import { fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence } from "./KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence";
import { EM_INDICES_SPAN_TWICE_PERIOD, EM_KNOTINDEX_INC_SEQ_TOO_LARGE, EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS, EM_START_INDEX_GREATER_THAN_END_INDEX, EM_START_INDEX_OUTOF_RANGE, EM_U_OUTOF_KNOTSEQ_RANGE } from "../ErrorMessages/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";
import { WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE } from "../WarningMessages/KnotSequences";

/**
 * Increasing periodic knot sequence for a closed B-spline curve.
 *
 * @description
 * Concrete implementation of {@link AbstractPeriodicKnotSequence} that stores the
 * knot sequence in the flat increasing form (repeated abscissae for knots with
 * multiplicity > 1). The sequence is periodic: the first and last knot abscissae
 * define the period, and their multiplicities must be equal.
 *
 * When constructed with `INCREASINGPERIODICKNOTSEQUENCE`, the raw flat knot array
 * is validated and assembled via `generateKnotSequence`, followed by a boundary
 * multiplicity consistency check. For uniform and no-knot types the base class
 * handles the construction directly.
 *
 * After construction the following validations are always run:
 * - uniformity flags (multiplicity and spacing)
 * - non-uniform multiplicity order check
 * - normalised basis origin check (first knot must be at `KNOT_SEQUENCE_ORIGIN`)
 *
 * The iterator exposes knot abscissae in the flat (repeated) form. The companion
 * method `toStrictlyIncreasing()` delegates to
 * {@link fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence} when a
 * compact representation is needed.
 */
export class IncreasingPeriodicKnotSequenceClosedCurve extends AbstractPeriodicKnotSequence {

    protected _indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;

    constructor(maxMultiplicityOrder: number, knotParameters: IncreasingPeriodicKnotSequenceClosedCurve_type) {
        super(maxMultiplicityOrder, knotParameters);
        this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence(0);
        if(knotParameters.type === INCREASINGPERIODICKNOTSEQUENCE) {
            this.generateKnotSequence(knotParameters);
            this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
        }
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkNormalizedBasisOrigin();
    }

    get indexKnotOrigin(): KnotIndexStrictlyIncreasingSequence {
        return this._indexKnotOrigin;
    }

    get allAbscissae(): readonly number[] {
        const abscissae: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) abscissae.push(knot);
        }
        return abscissae;
    }

    [Symbol.iterator]() {
        let knotAmount = 0;
        const knotIndicesKnotAbscissaChange: number[] = [];
        for(const multiplicity of this.multiplicities()) {
            knotAmount = knotAmount + multiplicity;
            knotIndicesKnotAbscissaChange.push(knotAmount);
        }
        const lastIndex = knotAmount - 1;
        let indexAbscissaChange = 0;
        let index = 0;
        return  {
            next: () => {
                if ( index <= lastIndex ) {
                    if(index === knotIndicesKnotAbscissaChange[indexAbscissaChange]) {
                        indexAbscissaChange++;
                    }
                    index++;
                    return { value: this.knotSequence[indexAbscissaChange].abscissa, done: false };
                } else {
                    index = 0;
                    return { done: true };
                }
            }
        }
    }

    /**
     * Creates a deep copy of this knot sequence.
     *
     * @returns A new `IncreasingPeriodicKnotSequenceClosedCurve` with the same flat
     *   knot array.
     */
    clone(): IncreasingPeriodicKnotSequenceClosedCurve {
        return new IncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: this.allAbscissae});
    }

    length(): number {
        let length = 0;
        for(const knot of this) {
            if(knot !== undefined) length++;
        }
        return length;
    }

    knotIndexInputParamAssessment(index: KnotIndexIncreasingSequence, methodName: string): void {
        if(index.knotIndex > (this.allAbscissae.length - 1)) {
            this.throwRangeErrorMessage(methodName, EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        }
    }

    generateKnotSequence(knotParameters: IncreasingPeriodicKnotSequence): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotIncreasingValues(knotParameters.periodicKnots);
        this.knotSequence.push(new Knot(knotParameters.periodicKnots[0], 1));
        for(let i = 1; i < knotParameters.periodicKnots.length; i++) {
            if(knotParameters.periodicKnots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity++;
            } else {
                this.knotSequence.push(new Knot(knotParameters.periodicKnots[i], 1));
            }
        }
        this.checkMaxMultiplicityOrderConsistency();
        const cumulative_multiplicities = knotParameters.periodicKnots.length - this.knotSequence[this.knotSequence.length - 1].multiplicity;
        if((cumulative_multiplicities < this._maxMultiplicityOrder && this._maxMultiplicityOrder > 1) ||
        (cumulative_multiplicities < (this._maxMultiplicityOrder + 1) && this._maxMultiplicityOrder === 1)) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS)
        }
        this._uMax =  this.knotSequence[this.knotSequence.length - 1].abscissa;
        this.checkNormalizedBasisOrigin();
        this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
    }

    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>, multiplicity: number): IncreasingPeriodicKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.raiseKnotMultiplicityArrayMutSeq(index, multiplicity);
        return newKnotSequence;
    }

    insertKnot(abscissae: number | number[], multiplicity: number = 1): IncreasingPeriodicKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.insertKnotMutSeq(abscissae, multiplicity);
        return newKnotSequence;
    }

    knotMultiplicityAtAbscissa(abcissa: number): number {
        let multiplicity = 0;
        for(const knot of this.knotSequence) {
            if(Math.abs(abcissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                multiplicity = knot.multiplicity;
            }
        }
        if(multiplicity === 0) {
            const warning = new WarningLog(this.constructor.name, "knotMultiplicityAtAbscissa", WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE);
            warning.logMessage();
        }
        return multiplicity;
    }

    abscissaAtIndex(index: KnotIndexIncreasingSequence): number {
        let abscissa = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        const multLastKnot = this.knotSequence[this.knotSequence.length - 1].multiplicity;
        const indexPeriod =  new KnotIndexIncreasingSequence(index.knotIndex % (this.allAbscissae.length - multLastKnot));
        let i = 0;
        for(const knot of this) {
            if(i === indexPeriod.knotIndex && knot !== undefined) abscissa = knot;
            i++;
        }
        return abscissa;
    }

    /**
     * Converts a flat (increasing) knot index to a compact (strictly-increasing)
     * knot index.
     *
     * @description
     * Delegates to
     * {@link fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence} to
     * obtain the compact sequence, then locates the abscissa that corresponds to
     * `index`. Indices beyond the end of one period are mapped modulo the period
     * length, and the returned compact index is offset accordingly.
     *
     * @param index - Flat increasing-sequence index to convert.
     * @returns The {@link KnotIndexStrictlyIncreasingSequence} for the same abscissa.
     */
    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence {
        const strictlyIncreasingKnotSequence = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(this);
        const lastIdxStrictIncSeq = strictlyIncreasingKnotSequence.allAbscissae.length - 1;
        const abscissa = this.abscissaAtIndex(index);
        let i = 0;
        for(const knot of strictlyIncreasingKnotSequence.allAbscissae) {
            if(knot !== undefined) {
                if(knot === abscissa) break;
                i++;
            }
        }
        if(index.knotIndex > (this.allAbscissae.length - 1)) i = i + lastIdxStrictIncSeq;
        return new KnotIndexStrictlyIncreasingSequence(i);
    }

    extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[] {
        let knots: number[] = [];
        const sequence = this.allAbscissae.slice();
        const lasIndex = this.allAbscissae.length - 1;
        const multFirstKnot = this.knotSequence[0].multiplicity;
        if(knotEnd.knotIndex <= knotStart.knotIndex) {
            this.throwRangeErrorMessage("extractSubsetOfAbscissae", EM_START_INDEX_OUTOF_RANGE);
        }
        if(knotStart.knotIndex > lasIndex) {
            this.throwRangeErrorMessage("extractSubsetOfAbscissae", EM_START_INDEX_GREATER_THAN_END_INDEX);
        }
        if((knotEnd.knotIndex - knotStart.knotIndex) > (2 * lasIndex)) {
            this.throwRangeErrorMessage("extractSubsetOfAbscissae", EM_INDICES_SPAN_TWICE_PERIOD);
        }

        if(knotEnd.knotIndex > lasIndex) {
            for(let i = multFirstKnot; i < this.allAbscissae.length; i++) {
                sequence.push(this.allAbscissae[i] + this.allAbscissae[lasIndex]);
            }
        }
        if(knotEnd.knotIndex >= (2 * lasIndex)) {
            for(let i = multFirstKnot; i < this.allAbscissae.length; i++) {
                sequence.push(this.allAbscissae[i] + 2 * this.allAbscissae[lasIndex]);
            }
        }
        knots = sequence.slice(knotStart.knotIndex, knotEnd.knotIndex + 1);
        return knots;
    }

    /**
     * Finds the flat knot span index containing parameter value `u`.
     *
     * @description
     * The periodic domain is handled by reducing `u` modulo the period when it
     * exceeds `uMax`. At a knot coincidence the index is the last occurrence of
     * that abscissa minus one, except at the final knot where the index wraps back
     * to the last active span. For non-coincident values the span is located via
     * bisection.
     *
     * @param u - Parameter value to locate. Values above `uMax` are reduced modulo
     *   the period; values below `KNOT_SEQUENCE_ORIGIN` throw.
     * @returns The flat {@link KnotIndexIncreasingSequence} of the containing span.
     * @throws {RangeError} If `u` is below `KNOT_SEQUENCE_ORIGIN`.
     */
    findSpan(u: number): KnotIndexIncreasingSequence {
        let index = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if(u > this.knotSequence[this.knotSequence.length - 1].abscissa) {
            u = u % this.getPeriod();
        }
        if(u < KNOT_SEQUENCE_ORIGIN) {
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
                        index -= 1;
                        break;
                    }
                }
                return new KnotIndexIncreasingSequence(index);
            }
            index = this.findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(u);
        }
        return new KnotIndexIncreasingSequence(index);
    }

    revertKnotSequence(): IncreasingPeriodicKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>): IncreasingPeriodicKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityMutSeq(index);
        return newKnotSequence;
    }
}