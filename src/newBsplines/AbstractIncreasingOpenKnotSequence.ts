import { AbstractOpenKnotSequence } from "./AbstractOpenKnotSequence";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";
import { Knot } from "./Knot";
import { AbstractIncreasingOpenKnotSequence_type, IncreasingOpenKnotSequence, INCREASINGOPENKNOTSEQUENCE, IncreasingOpenKnotSequenceCCurve_allKnots, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, IncreasingOpenKnotSequenceUpToC0Discontinuity, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, NO_KNOT_CLOSED_CURVE, NO_KNOT_OPEN_CURVE, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART, EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND, EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_KNOTINDEX_INC_SEQ_NEGATIVE, EM_KNOTINDEX_INC_SEQ_TOO_LARGE, EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE, EM_NOT_NORMALIZED_BASIS, EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT, EM_KNOT_SEQUENCE_ORIGIN_INCONSISTENT } from "../ErrorMessages/KnotSequences";
import { NormalizedBasisAtSequenceExtremity, KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";
import { DEFAULT_KNOT_ABSCISSA_VALUE, DEFAULT_KNOT_INDEX } from "../namedConstants/Knots";


export abstract class AbstractIncreasingOpenKnotSequence extends AbstractOpenKnotSequence {

    protected _indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    protected _isSequenceUpToC0Discontinuity: boolean;

    constructor(maxMultiplicityOrder: number, knotParameters: AbstractIncreasingOpenKnotSequence_type) {
        super(maxMultiplicityOrder, knotParameters);
        this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence(DEFAULT_KNOT_INDEX);
        this._isSequenceUpToC0Discontinuity = false;
        if(knotParameters.type === NO_KNOT_OPEN_CURVE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        } else if(knotParameters.type === NO_KNOT_CLOSED_CURVE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        } else if(knotParameters.type === UNIFORM_OPENKNOTSEQUENCE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        } else if(knotParameters.type === UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        } else if(knotParameters.type === INCREASINGOPENKNOTSEQUENCE || knotParameters.type === INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY
            || knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS || knotParameters.type === INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            if(knotParameters.type === INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY || knotParameters.type === INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) this._isSequenceUpToC0Discontinuity = true;
            this.generateKnotSequence(knotParameters);
        }
    }

    get allAbscissae(): number[] {
        const abscissae: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) abscissae.push(knot);
        }
        return abscissae;
    }

    get indexKnotOrigin(): KnotIndexStrictlyIncreasingSequence {
        return this._indexKnotOrigin;
    }

    get isSequenceUpToC0Discontinuity(): boolean {
        return this._isSequenceUpToC0Discontinuity;
    }

    // temporary add setter while constructors of curve are set adequately
    set isSequenceUpToC0Discontinuity(isSequenceUpToC0Discontinuity: boolean) {
        this._isSequenceUpToC0Discontinuity = isSequenceUpToC0Discontinuity;
    }

    [Symbol.iterator]() {
        let nbKnots = 0;
        const knotIndicesKnotAbscissaChange: number[] = [];
        for(const multiplicity of this.multiplicities()) {
            nbKnots = nbKnots + multiplicity;
            knotIndicesKnotAbscissaChange.push(nbKnots);
        }
        const lastIndex = nbKnots - 1;
        let indexAbscissaChange = 0;
        let index = 0;
        return  {
            next: () => {
                if (index <= lastIndex ) {
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

    abstract checkNonUniformKnotMultiplicityOrder(): void;

    abstract clone(): IncreasingOpenKnotSequenceInterface;

    knotIndexInputParamAssessment(index: KnotIndexIncreasingSequence, methodName: string): void {
        if(index.knotIndex < 0) {
            this.throwRangeErrorMessage(methodName, EM_KNOTINDEX_INC_SEQ_NEGATIVE);
        } else if(index.knotIndex > (this.allAbscissae.length - 1)) {
            this.throwRangeErrorMessage(methodName, EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        }
    }

    checkOriginOfNormalizedBasis(): void {
        const normalizedBasisAtStart = this.getKnotIndexNormalizedBasisAtSequenceStart();
        let abscissaOrigin = DEFAULT_KNOT_ABSCISSA_VALUE;
        if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            abscissaOrigin = this.abscissaAtIndex(this.toKnotIndexIncreasingSequence(normalizedBasisAtStart.knot));
        }
        if(abscissaOrigin !== KNOT_SEQUENCE_ORIGIN) this.throwRangeErrorMessage("checkOriginOfNormalizedBasis", EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
    }

    checkCurveOrigin(): void {
        const knotOrigin = this.getKnotIndexNormalizedBasisAtSequenceStart().knot;
        if(this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa !== KNOT_SEQUENCE_ORIGIN || knotOrigin.knotIndex !== this.indexKnotOrigin.knotIndex) {
            this.throwRangeErrorMessage("checkCurveOrigin", EM_KNOT_SEQUENCE_ORIGIN_INCONSISTENT);
        }
    }

    generateKnotSequence(knotParameters: IncreasingOpenKnotSequence | IncreasingOpenKnotSequenceCCurve_allKnots | IncreasingOpenKnotSequenceUpToC0Discontinuity | IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotIncreasingValues(knotParameters.knots);
        this.knotSequence.push(new Knot(knotParameters.knots[0], 1));
        for(let i = 1; i < knotParameters.knots.length; i++) {
            if(knotParameters.knots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity++;
            } else {
                this.knotSequence.push(new Knot(knotParameters.knots[i], 1));
            }
        }
        this.checkMaxMultiplicityOrderConsistency();
        this.checkSizeConsistency(knotParameters.knots);
        if(!this._isSequenceUpToC0Discontinuity) this.checkMaxKnotMultiplicityAtIntermediateKnots();
        const {start: normalizedBasisAtStart, end: normalizedBasisAtEnd} = this.getKnotIndicesBoundingNormalizedBasis();
        if(normalizedBasisAtEnd.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            this._uMax = this.abscissaAtIndex(this.toKnotIndexIncreasingSequence(normalizedBasisAtEnd.knot));
        } else if(normalizedBasisAtEnd.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.NotNormalized) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_NOT_NORMALIZED_BASIS);
        } else if(normalizedBasisAtEnd.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND);
        }
        if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            this._indexKnotOrigin = normalizedBasisAtStart.knot;
        } else if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.NotNormalized) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_NOT_NORMALIZED_BASIS);
        } else if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
        }
        if(normalizedBasisAtEnd.knot.knotIndex <= normalizedBasisAtStart.knot.knotIndex) this.throwRangeErrorMessage("generateKnotSequence", EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
    }

    revertSequence(): number[] {
        const seq = this.clone();
        seq.revertKnotSequence();
        return seq.allAbscissae;
    }

    checkSizeConsistency(knots: number[]): void {
        let size = 0;
        for(const multiplicity of this.multiplicities()) {
            size += multiplicity;
        }
        if(size !== knots.length) this.throwRangeErrorMessage("checkSizeConsistency", EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ);
    }

    length(): number {
        let length = 0;
        for(const knot of this) {
            if(knot !== undefined) length++;
        }
        return length;
    }

    abscissaAtIndex(index: KnotIndexIncreasingSequence): number {
        this.knotIndexInputParamAssessment(index, "abscissaAtIndex");
        let abscissa = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        let i = 0;
        for(const knot of this) {
            if(i === index.knotIndex && knot !== undefined) abscissa = knot;
            i++;
        }
        return abscissa;
    }

    extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[] {
        let knots: number[] = [];
        if(!(knotStart.knotIndex >= 0) || !(knotEnd.knotIndex <= this.length() - 1) || !(knotStart.knotIndex <= knotEnd.knotIndex)) this.throwRangeErrorMessage("extractSubsetOfAbscissae", EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE);
        let index = 0;
        for(const knot of this) {
            if(index >= knotStart.knotIndex && index <= knotEnd.knotIndex) {
                if(knot !== undefined) knots.push(knot)
            }
            index++;
        }
        return knots;
    }

}