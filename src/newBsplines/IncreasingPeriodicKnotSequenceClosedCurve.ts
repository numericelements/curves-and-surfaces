import { WarningLog } from "../errorProcessing/ErrorLoging";
import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { AbstractPeriodicKnotSequence } from "./AbstractPeriodicKnotSequence";
import { Knot } from "./Knot";
import { IncreasingPeriodicKnotSequence, INCREASINGPERIODICKNOTSEQUENCE, IncreasingPeriodicKnotSequenceClosedCurve_type } from "./KnotSequenceConstructorInterface";
import { fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence } from "./KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence";
import { EM_ABSCISSA_TOO_CLOSE_TO_KNOT, EM_INDICES_SPAN_TWICE_PERIOD, EM_KNOT_INSERTION_OVER_UMAX, EM_KNOT_INSERTION_UNDER_SEQORIGIN, EM_KNOTINDEX_INC_SEQ_NEGATIVE, EM_KNOTINDEX_INC_SEQ_TOO_LARGE, EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS, EM_START_INDEX_GREATER_THAN_END_INDEX, EM_START_INDEX_OUTOF_RANGE, EM_U_OUTOF_KNOTSEQ_RANGE } from "../ErrorMessages/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";

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
        this.checkCurveOrigin();
    }

    get allAbscissae(): number[] {
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
        if(index.knotIndex < 0) {
            this.throwRangeErrorMessage(methodName, EM_KNOTINDEX_INC_SEQ_NEGATIVE);
        } else if(index.knotIndex > (this.allAbscissae.length - 1)) {
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
        this.checkCurveOrigin();
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
            const warning = new WarningLog(this.constructor.name, "knotMultiplicityAtAbscissa", "knot abscissa cannot be found within the knot sequence.");
            warning.logMessage();
        }
        return multiplicity;
    }

    // insertKnot(abscissa: number, multiplicity: number = 1): void {
    //     if(this.isAbscissaCoincidingWithKnot(abscissa)) {
    //         this.throwRangeErrorMessage("insertKnot", EM_ABSCISSA_TOO_CLOSE_TO_KNOT);
    //     } else if(abscissa < this.knotSequence[0].abscissa) {
    //         this.throwRangeErrorMessage("insertKnot", EM_KNOT_INSERTION_UNDER_SEQORIGIN);
    //     } else if (abscissa > this.knotSequence[this.knotSequence.length - 1].abscissa) {
    //         this.throwRangeErrorMessage("insertKnot", EM_KNOT_INSERTION_OVER_UMAX);
    //     }
    //     this.maxMultiplicityOrderInputParamAssessment(multiplicity, "insertKnot");
    //     const knot = new Knot(abscissa, multiplicity);
    //     let i = 0;
    //     while(i < (this.knotSequence.length - 1)) {
    //         if(this.knotSequence[i].abscissa < abscissa && abscissa < this.knotSequence[i + 1].abscissa) break;
    //         i++;
    //     }
    //     this.knotSequence.splice((i + 1), 0, knot);
    //     this.checkUniformityOfKnotSpacing();
    //     this.checkUniformityOfKnotMultiplicity();
    //     this.checkNonUniformKnotMultiplicityOrder();
    // }

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
                        return new KnotIndexIncreasingSequence(index - 1);
                    }
                }
            }
            index = this.findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(u);
            return new KnotIndexIncreasingSequence(index);
        }
        return new KnotIndexIncreasingSequence(index);
    }

    revertKnotSequence(): IncreasingPeriodicKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): IncreasingPeriodicKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityMutSeq(index);
        return newKnotSequence;
    }
}