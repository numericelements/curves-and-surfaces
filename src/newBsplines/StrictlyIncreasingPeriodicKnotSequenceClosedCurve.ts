import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { AbstractPeriodicKnotSequence } from "./AbstractPeriodicKnotSequence";
import { Knot } from "./Knot";
import { StrictIncreasingPeriodicKnotSequence, StrictIncreasingPeriodicKnotSequenceClosedCurve_type, STRICTLYINCREASINGPERIODICKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS, EM_U_OUTOF_KNOTSEQ_RANGE } from "../ErrorMessages/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";

/**
 * Strictly increasing periodic knot sequence for a closed B-spline curve.
 *
 * @description
 * Concrete implementation of {@link AbstractPeriodicKnotSequence} that stores the
 * knot sequence in the compact form (distinct abscissae with explicit multiplicities,
 * no repeated values). The sequence is periodic: the first and last knot abscissae
 * define the period, and their multiplicities must be equal.
 *
 * When constructed with `STRICTLYINCREASINGPERIODICKNOTSEQUENCE`, the raw compact
 * knot arrays are validated and assembled via `generateStrictlyIncreasingSequence`,
 * followed by a boundary multiplicity consistency check. For uniform and no-knot
 * types the base class handles the construction directly.
 *
 * After construction the following validations are always run:
 * - uniformity flags (multiplicity and spacing)
 * - non-uniform multiplicity order check
 * - normalised basis origin check (first knot must be at `KNOT_SEQUENCE_ORIGIN`)
 *
 * The iterator yields `{ abscissa, multiplicity }` objects (compact form), in
 * contrast to the flat-form iterator in
 * {@link IncreasingPeriodicKnotSequenceClosedCurve}.
 */
export class StrictlyIncreasingPeriodicKnotSequenceClosedCurve extends AbstractPeriodicKnotSequence {

    protected _indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;

    constructor(maxMultiplicityOrder: number, knotsParameters: StrictIncreasingPeriodicKnotSequenceClosedCurve_type) {
        super(maxMultiplicityOrder, knotsParameters);
        this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence(0);
        if(knotsParameters.type === STRICTLYINCREASINGPERIODICKNOTSEQUENCE) {
            this.generateStrictlyIncreasingSequence(knotsParameters);
            this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
        }
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkNormalizedBasisOrigin();
    }

    get allAbscissae(): readonly number[] {
        const abscissae: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) abscissae.push(knot.abscissa);
        }
        return abscissae;
    }

    [Symbol.iterator]() {
        const lastIndex = this.knotSequence.length - 1;
        let index = 0;
        return  {
            next: () => {
                if ( index <= lastIndex ) {
                    const abscissa = this.knotSequence[index].abscissa;
                    const multiplicity = this.knotSequence[index].multiplicity;
                    index++;
                    return { value: {abscissa: abscissa, multiplicity: multiplicity}, done: false };
                } else {
                    index = 0;
                    return { done: true };
                }
            }
        }
    }

    length(): number {
        return this.knotSequence.length;
    }

    /**
     * Creates a deep copy of this knot sequence.
     *
     * @returns A new `StrictlyIncreasingPeriodicKnotSequenceClosedCurve` with the
     *   same compact knot data.
     */
    clone(): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: this.distinctAbscissae(), multiplicities: this.multiplicities()});
    }

    generateStrictlyIncreasingSequence(knotParameters: StrictIncreasingPeriodicKnotSequence): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotStrictlyIncreasingValues(knotParameters.periodicKnots);
        for(let i = 0; i < knotParameters.periodicKnots.length; i++) {
            this.knotSequence.push(new Knot(knotParameters.periodicKnots[i], knotParameters.multiplicities[i]));
        }
        this.checkMaxMultiplicityOrderConsistency();
        let cumulative_multiplicities = this.knotSequence[0].multiplicity;
        for(let i = 1; i < this.knotSequence.length - 1; i++) {
            cumulative_multiplicities += this.knotSequence[i].multiplicity;
        }
        if((cumulative_multiplicities < this._maxMultiplicityOrder && this._maxMultiplicityOrder > 1)
            || (cumulative_multiplicities < (this._maxMultiplicityOrder + 1) && this._maxMultiplicityOrder === 1)) {
            this.throwRangeErrorMessage("generateStrictlyIncreasingSequence", EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS)
        }
        this._uMax =  this.knotSequence[this.knotSequence.length - 1].abscissa;
        this.checkNormalizedBasisOrigin();
        this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
    }

    abscissaAtIndex(index: KnotIndexStrictlyIncreasingSequence): number {
        let abscissa = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        const indexPeriod =  new KnotIndexStrictlyIncreasingSequence(index.knotIndex % (this.allAbscissae.length - 1));
        let i = 0;
        for(const knot of this) {
            if(i === indexPeriod.knotIndex && knot !== undefined) abscissa = knot.abscissa;
            i++;
        }
        return abscissa;
    }

    /**
     * Finds the compact knot span index containing parameter value `u`.
     *
     * @description
     * The periodic domain is handled by reducing `u` modulo the period when it
     * exceeds `uMax`. At a knot coincidence the index is the compact position minus
     * one, except at the final knot entry where the index is set to point to the
     * last active span. For non-coincident values the span is located via bisection.
     *
     * @param u - Parameter value to locate. Values above `uMax` are reduced modulo
     *   the period; values below `KNOT_SEQUENCE_ORIGIN` throw.
     * @returns The compact {@link KnotIndexStrictlyIncreasingSequence} of the containing span.
     * @throws {RangeError} If `u` is below `KNOT_SEQUENCE_ORIGIN`.
     */
    findSpan(u: number): KnotIndexStrictlyIncreasingSequence {
        let index = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if(u > this.knotSequence[this.knotSequence.length - 1].abscissa) {
            u = u % this.getPeriod();
        }
        if (u < KNOT_SEQUENCE_ORIGIN) {
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
            index = this.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u);
        }
        return new KnotIndexStrictlyIncreasingSequence(index);
    }

    revertKnotSequence(): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }

    raiseKnotMultiplicity(indicesArray: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>, multiplicity: number = 1): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.raiseKnotMultiplicityArrayMutSeq(indicesArray, multiplicity);
        return newKnotSequence;
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityMutSeq(index);
        return newKnotSequence;
    }

    insertKnot(abscissae: number | number[], multiplicity: number = 1): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.insertKnotMutSeq(abscissae, multiplicity);
        return newKnotSequence;
    }
}