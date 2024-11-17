import { AbstractOpenKnotSequence, NormalizedBasisAtSequenceEnd } from "./AbstractOpenKnotSequence";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";
import { DEFAULT_KNOT_ABSCISSA_VALUE, DEFAULT_KNOT_INDEX, Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { AbstractIncreasingOpenKnotSequence_type, IncreasingOpenKnotSequence, INCREASINGOPENKNOTSEQUENCE, IncreasingOpenKnotSequenceCCurve, IncreasingOpenKnotSequenceCCurve_allKnots, INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, IncreasingOpenKnotSequenceUpToC0Discontinuity, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, INCREASINGPERIODICKNOTSEQUENCE, NO_KNOT_CLOSED_CURVE, NO_KNOT_OPEN_CURVE, Uniform_OpenKnotSequence, UNIFORM_OPENKNOTSEQUENCE, UniformlySpreadInterKnots_OpenKnotSequence, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { fromInputParametersToOpenKnotSequenceCC } from "./KnotSequenceConversionAndUtilities";
import { EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART, EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND, EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_KNOTINDEX_INC_SEQ_NEGATIVE, EM_KNOTINDEX_INC_SEQ_TOO_LARGE, EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE, EM_NOT_NORMALIZED_BASIS, EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT } from "../ErrorMessages/KnotSequences";
import { OPEN_KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";

// export const EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ = "Increasing knot sequence size incompatible with the multiplicity orders of the strictly increasing sequence. Cannot proceed.";
// export const EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE = "The abscissa defining the origin of the normalized basis of the knot sequence is not 0.0. The knot sequence is not consistent. Cannot proceed.";
// export const EM_KNOTINDEX_INC_SEQ_NEGATIVE = "The knot index cannot be negative. The corresponding method is not applied.";
// export const EM_KNOTINDEX_INC_SEQ_TOO_LARGE = "The knot index cannot be greater than the last knot index. The corresponding method is not applied.";
// export const EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE = "Start and/or end indices values are out of range. Cannot perform the extraction.";
// export const EM_NOT_NORMALIZED_BASIS = "The B-Spline basis is not normalized over the knot interval defined. This basis cannot be used for curve modeling.";
// export const EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT = "The normalized basis interval is not large enough to apply curve modeling algorithms."

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
        } else if(knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVE) {
            this.computeKnotSequenceFromPeriodicKnotSequence(knotParameters);
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
        if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceEnd.StrictlyNormalized) {
            abscissaOrigin = this.abscissaAtIndex(this.toKnotIndexIncreasingSequence(normalizedBasisAtStart.knotIndex));
        }

        if(abscissaOrigin !== OPEN_KNOT_SEQUENCE_ORIGIN) this.throwRangeErrorMessage("checkOriginOfNormalizedBasis", EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
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
        if(normalizedBasisAtEnd.basisAtSeqExt === NormalizedBasisAtSequenceEnd.StrictlyNormalized) {
            this._uMax = this.abscissaAtIndex(this.toKnotIndexIncreasingSequence(normalizedBasisAtEnd.knotIndex));
        } else if(normalizedBasisAtEnd.basisAtSeqExt === NormalizedBasisAtSequenceEnd.NotNormalized) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_NOT_NORMALIZED_BASIS);
        } else if(normalizedBasisAtEnd.basisAtSeqExt === NormalizedBasisAtSequenceEnd.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND);
        }
        if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceEnd.StrictlyNormalized) {
            this._indexKnotOrigin = normalizedBasisAtStart.knotIndex;
        } else if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceEnd.NotNormalized) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_NOT_NORMALIZED_BASIS);
        } else if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceEnd.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
        }
        if(normalizedBasisAtEnd.knotIndex.knotIndex <= normalizedBasisAtStart.knotIndex.knotIndex) this.throwRangeErrorMessage("generateKnotSequence", EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
    }

    computeKnotSequenceFromPeriodicKnotSequence(knotParameters: IncreasingOpenKnotSequenceCCurve): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotIncreasingValues(knotParameters.periodicKnots);
        const openSequence = fromInputParametersToOpenKnotSequenceCC(this._maxMultiplicityOrder, knotParameters);
        // // const periodicSeq = new IncreasingPeriodicKnotSequenceClosedCurve((this._maxMultiplicityOrder - 1), {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotParameters.periodicKnots});
        // // // const openSequence = periodicSeq.toOpenKnotSequence();
        // // const openSequence = fromIncreasingPeriodicToOpenKnotSequenceCC(periodicSeq);
        const knots = openSequence.distinctAbscissae();
        const multiplicities = openSequence.multiplicities();
        for(let i = 0; i < knots.length; i++) {
            this.knotSequence.push(new Knot(knots[i], multiplicities[i]));
        }
        this._uMax = knotParameters.periodicKnots[knotParameters.periodicKnots.length - 1];
        this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
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
        let abscissa = Infinity;
        let i = 0;
        for(const knot of this) {
            if(i === index.knotIndex && knot !== undefined) abscissa = knot;
            i++;
        }
        return abscissa;
    }

    // toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence {
    //     // const strictlyIncreasingKnotSequence = this.toStrictlyIncreasingKnotSequence();
    //     const strictlyIncreasingKnotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(this);
    //     const abscissa = this.abscissaAtIndex(index);
    //     let i = 0;
    //     for(const knot of strictlyIncreasingKnotSequence.allAbscissae) {
    //         if(knot !== undefined) {
    //             if(knot === abscissa) break;
    //             i++;
    //         }
    //     }
    //     return new KnotIndexStrictlyIncreasingSequence(i);
    // }

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