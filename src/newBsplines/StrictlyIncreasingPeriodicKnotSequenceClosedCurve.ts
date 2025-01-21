import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { AbstractPeriodicKnotSequence } from "./AbstractPeriodicKnotSequence";
import { Knot } from "./Knot";
import { StrictIncreasingPeriodicKnotSequence, StrictIncreasingPeriodicKnotSequenceClosedCurve_type, STRICTLYINCREASINGPERIODICKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { EM_KNOTINDEX_INC_SEQ_NEGATIVE, EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS, EM_U_OUTOF_KNOTSEQ_RANGE } from "../ErrorMessages/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";

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
        this.checkCurveOrigin();
    }

    get allAbscissae(): number[] {
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
        this.checkCurveOrigin();
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

    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number = 1) {
        const indexPeriod =  new KnotIndexStrictlyIncreasingSequence(index.knotIndex % (this.allAbscissae.length - 1));
        if(indexPeriod.knotIndex < 0) {
            this.throwRangeErrorMessage("raiseKnotMultiplicity", EM_KNOTINDEX_INC_SEQ_NEGATIVE);
        }
        const indexWithinPeriod = index.knotIndex % (this.knotSequence.length - 1);
        this.knotSequence[indexPeriod.knotIndex].multiplicity += multiplicity;
        if(indexWithinPeriod === 0) this.knotSequence[this.knotSequence.length - 1].multiplicity += multiplicity;
        this.checkMaxMultiplicityOrderConsistency();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
        return;
    }

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
                        return new KnotIndexStrictlyIncreasingSequence(index - 1);
                    }
                }
            }
            index = this.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u);
            return new KnotIndexStrictlyIncreasingSequence(index);
        }
        return new KnotIndexStrictlyIncreasingSequence(index);
    }

    revertKnotSequence(): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityMutSeq(index);
        return newKnotSequence;
    }
}