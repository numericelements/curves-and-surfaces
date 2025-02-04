import { AbstractKnotSequence } from "./AbstractKnotSequence";
import { Knot } from "./Knot";
import { AbstractPeriodicKnotSequenceClosedCurve_type, NO_KNOT_PERIODIC_CURVE, Uniform_PeriodicKnotSequence, UNIFORM_PERIODICKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { EM_ABSCISSA_TOO_CLOSE_TO_KNOT, EM_KNOT_INSERTION_OVER_UMAX, EM_KNOT_INSERTION_UNDER_SEQORIGIN, EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER, EM_KNOTINDEX_INC_SEQ_NEGATIVE, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_SEQUENCE_ORIGIN_REMOVAL, EM_U_OUTOF_KNOTSEQ_RANGE } from "../ErrorMessages/KnotSequences";
import { KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences"
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";


export abstract class AbstractPeriodicKnotSequence extends AbstractKnotSequence {

    protected _uMax: number;
    protected knotSequence: Knot[];
    protected _isKnotMultiplicityNonUniform: boolean;

    constructor(maxMultiplicityOrder: number, knotParameters: AbstractPeriodicKnotSequenceClosedCurve_type) {
        super(maxMultiplicityOrder);
        this._isKnotMultiplicityNonUniform = false;
        this.knotSequence = [];
        this._uMax = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if(knotParameters.type === NO_KNOT_PERIODIC_CURVE) {
            this.computeKnotSequenceFromMaxMultiplicityOrder();
        } else if(knotParameters.type === UNIFORM_PERIODICKNOTSEQUENCE) {
            this.computeUniformKnotSequenceFromBsplBasisSize(knotParameters);
        }
    }

    get uMax(): number {
        return this._uMax;
    }

    get isKnotMultiplicityNonUniform(): boolean {
        return this._isKnotMultiplicityNonUniform;
    }

    checkNonUniformKnotMultiplicityOrder(): void {
        this._isKnotMultiplicityNonUniform = false;
    }

    checkNormalizedBasisOrigin(): void {
        if(this.knotSequence[0].abscissa !== KNOT_SEQUENCE_ORIGIN) {
            this.throwRangeErrorMessage('checkNormalizedBasisOrigin', EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
        }
    }

    getPeriod(): number {
         return this.knotSequence[this.knotSequence.length - 1].abscissa - this.knotSequence[0].abscissa;
    }

    lastKnot(): number {
        return this.knotSequence[this.knotSequence.length - 1].abscissa;
    }

    checkKnotMultiplicitiesAtNormalizedBasisBoundaries(): void {
        if(this.knotSequence[0].multiplicity !== this.knotSequence[this.knotSequence.length - 1].multiplicity) {
            this.throwRangeErrorMessage("checkKnotMultiplicitiesAtNormalizedBasisBoundaries", EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER);
        }
    }

    computeKnotSequenceFromMaxMultiplicityOrder(): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        let upperBound = this._maxMultiplicityOrder + 1;
        if(this._maxMultiplicityOrder === 1) upperBound = this._maxMultiplicityOrder + 2;
        for(let i = 0; i < upperBound; i++) {
            this.knotSequence.push(new Knot(i, 1));
        }
        this._uMax = this._maxMultiplicityOrder + 1;
    }

    computeUniformKnotSequenceFromBsplBasisSize(knotParameters: Uniform_PeriodicKnotSequence): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputBspBasisSizeAssessment(knotParameters);
        for(let i = 0; i < knotParameters.BsplBasisSize; i++) {
            this.knotSequence.push(new Knot(i, 1));
        }
        this._uMax = this.knotSequence[this.knotSequence.length - 1].abscissa;
    }

    decrementKnotMultiplicityMutSeq(index: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>): void {
        if(!Array.isArray(index)) index = [index];
        for(const ind of index) {
            this.strictlyIncKnotIndexInputParamAssessment(ind, "decrementKnotMultiplicityMutSeq");
            if(this.knotSequence[ind.knotIndex].multiplicity === 1) {
                if(ind.knotIndex === 0 || ind.knotIndex === this.knotSequence.length - 1) {
                    this.throwRangeErrorMessage("decrementKnotMultiplicityMutSeq", EM_SEQUENCE_ORIGIN_REMOVAL);
                }
                const abscissae = this.distinctAbscissae();
                const multiplicities = this.multiplicities();
                abscissae.splice(ind.knotIndex, 1);
                multiplicities.splice(ind.knotIndex, 1);
                this.knotSequence = [];
                let i = 0;
                for(const abscissa of abscissae) {
                    const knot = new Knot(abscissa, multiplicities[i]);
                    this.knotSequence.push(knot);
                    i++;
                }
            } else {
                this.knotSequence[ind.knotIndex].multiplicity--;
                if(ind.knotIndex === 0) {
                    this.knotSequence[this.knotSequence.length - 1].multiplicity--;
                } else if(ind.knotIndex === (this.knotSequence.length - 1)) {
                    this.knotSequence[0].multiplicity--;
                }
            }
        }
        this.checkUniformityOfKnotSpacing();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

    raiseKnotMultiplicityArrayMutSeq(indicesArray: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>, multiplicity: number): void {
        if(!Array.isArray(indicesArray)) indicesArray = [indicesArray];
        for(const index of indicesArray) {
            const indexWithinPeriod = index.knotIndex % (this.knotSequence.length - 1);
            this.knotSequence[indexWithinPeriod].multiplicity += multiplicity;
            this.checkMaxMultiplicityOrderConsistency();
            if(indexWithinPeriod === 0) this.knotSequence[this.knotSequence.length - 1].multiplicity += multiplicity;
        }
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

    insertKnotMutSeq(abscissae: number | number[], multiplicity: number = 1): void {
        if(!Array.isArray(abscissae)) abscissae = [abscissae];
        for(const abscissa of abscissae) {
            if(this.isAbscissaCoincidingWithKnot(abscissa)) {
                this.throwRangeErrorMessage("insertKnot", EM_ABSCISSA_TOO_CLOSE_TO_KNOT);
            }
            if(abscissa < this.knotSequence[0].abscissa) {
                this.throwRangeErrorMessage("insertKnot", EM_KNOT_INSERTION_UNDER_SEQORIGIN);
            } else if (abscissa > this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.throwRangeErrorMessage("insertKnot", EM_KNOT_INSERTION_OVER_UMAX);
            }
            this.maxMultiplicityOrderInputParamAssessment(multiplicity, "insertKnot");
            const knot = new Knot(abscissa, multiplicity);
            let i = 0;
            while(i < (this.knotSequence.length - 1)) {
                if(this.knotSequence[i].abscissa < abscissa && abscissa < this.knotSequence[i + 1].abscissa) break;
                i++;
            }
            this.knotSequence.splice((i + 1), 0, knot);
            this.checkUniformityOfKnotSpacing();
            this.checkUniformityOfKnotMultiplicity();
            this.checkNonUniformKnotMultiplicityOrder();
        }
    }

}