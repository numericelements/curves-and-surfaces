import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { AbstractOpenKnotSequence, NormalizedBasisAtSequenceEnd } from "./AbstractOpenKnotSequence";
import { DEFAULT_KNOT_ABSCISSA_VALUE, DEFAULT_KNOT_INDEX, Knot, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { StrictlyIncreasingOpenKnotSequenceInterface } from "./StrictlyIncreasingKnotSequenceInterface";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractStrictlyIncreasingOpenKnotSequence_type, NO_KNOT_CLOSED_CURVE, NO_KNOT_OPEN_CURVE, StrictlyIncreasingOpenKnotSequence, STRICTLYINCREASINGOPENKNOTSEQUENCE, StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, Uniform_OpenKnotSequence, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART, EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND, EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT, EM_KNOT_MULTIPLICITY_OUT_OF_RANGE, EM_KNOT_SEQUENCE_ORIGIN_INCONSISTENT, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_NOT_NORMALIZED_BASIS, EM_KNOTINDEX_INC_SEQ_NEGATIVE, EM_KNOTINDEX_INC_SEQ_TOO_LARGE } from "../ErrorMessages/KnotSequences"
import { OPEN_KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";

export abstract class AbstractStrictlyIncreasingOpenKnotSequence extends AbstractOpenKnotSequence {

    protected _indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    protected _isSequenceUpToC0Discontinuity: boolean;

    constructor(maxMultiplicityOrder: number, knotParameters: AbstractStrictlyIncreasingOpenKnotSequence_type) {
        super(maxMultiplicityOrder, knotParameters);
        this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence(DEFAULT_KNOT_INDEX);
        this._isSequenceUpToC0Discontinuity = false;
        if(knotParameters.type === NO_KNOT_OPEN_CURVE) {
            this._indexKnotOrigin.knotIndex = 0;
        } else if(knotParameters.type === NO_KNOT_CLOSED_CURVE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        } else if(knotParameters.type === UNIFORM_OPENKNOTSEQUENCE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        } else if(knotParameters.type === UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            this._indexKnotOrigin.knotIndex = 0;
        } else if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE || knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY ||
            knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS || knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY || knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) this._isSequenceUpToC0Discontinuity = true;
            this.generateKnotSequence(knotParameters);
        } else if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE) {
            if(knotParameters.periodicKnots.length !== knotParameters.multiplicities.length) {
                const error = new ErrorLog(this.constructor.name, "constructor", "size of multiplicities array does not the size of knot abscissae array.");
                error.logMessage();
            }
            for(let i = 0; i < knotParameters.periodicKnots.length; i++) {
                this.knotSequence.push(new Knot(knotParameters.periodicKnots[i], knotParameters.multiplicities[i]));
            }
        }
    }

    get allAbscissae(): number[] {
        const abscissae: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) abscissae.push(knot.abscissa);
        }
        return abscissae;
    }

    get indexKnotOrigin(): KnotIndexStrictlyIncreasingSequence {
        return this._indexKnotOrigin;
    }

    [Symbol.iterator]() {
        const lastIndex = this.knotSequence.length - 1;
        let index = 0;
        return  {
            next: () => {
                if (index <= lastIndex ) {
                    const abscissa = this.knotSequence[index].abscissa;
                    const multiplicity = this.knotSequence[index].multiplicity;
                    index++;
                    return { value: {abscissa: abscissa, multiplicity: multiplicity}, 
                    done: false };
                } else {
                    index = 0;
                    return { done: true };
                }
            }
        }
    }

    abstract clone(): StrictlyIncreasingOpenKnotSequenceInterface;

    // abstract toIncreasingKnotSequence(): IncreasingOpenKnotSequenceInterface;

    abstract checkNonUniformKnotMultiplicityOrder(): void;

    checkKnotMultiplicities(multiplicities: number[]): void {
        for(let i = 0; i < multiplicities.length; i++) {
            if(multiplicities[i] <= 0) this.throwRangeErrorMessage("checkKnotMultiplicities", EM_KNOT_MULTIPLICITY_OUT_OF_RANGE);
        }
    }

    checkCurveOrigin(): void {
        const normalizedBasisAtStart = this.getKnotIndexNormalizedBasisAtSequenceStart();
        let abscissaOrigin = DEFAULT_KNOT_ABSCISSA_VALUE;
        if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceEnd.StrictlyNormalized) {
            abscissaOrigin = this.abscissaAtIndex(normalizedBasisAtStart.knot);
        }
        if(abscissaOrigin !== OPEN_KNOT_SEQUENCE_ORIGIN) this.throwRangeErrorMessage("checkOriginOfNormalizedBasis", EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
    }

    generateKnotSequence(knotParameters: StrictlyIncreasingOpenKnotSequence | StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots |
        StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity | StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotStrictlyIncreasingValues(knotParameters.knots);
        this.checkKnotMultiplicities(knotParameters.multiplicities);
        for(let i = 0; i < knotParameters.knots.length; i++) {
            this.knotSequence.push(new Knot(knotParameters.knots[i], knotParameters.multiplicities[i]));
        }
        this.checkMaxMultiplicityOrderConsistency();
        if(!this._isSequenceUpToC0Discontinuity) this.checkMaxKnotMultiplicityAtIntermediateKnots();
        const {start: normalizedBasisAtStart, end: normalizedBasisAtEnd} = this.getKnotIndicesBoundingNormalizedBasis();
        if(normalizedBasisAtEnd.basisAtSeqExt === NormalizedBasisAtSequenceEnd.StrictlyNormalized) {
            this._uMax = this.abscissaAtIndex(normalizedBasisAtEnd.knot);
        } else if(normalizedBasisAtEnd.basisAtSeqExt === NormalizedBasisAtSequenceEnd.NotNormalized) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_NOT_NORMALIZED_BASIS);
        } else if(normalizedBasisAtEnd.basisAtSeqExt === NormalizedBasisAtSequenceEnd.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND);
        }
        if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceEnd.StrictlyNormalized) {
            this._indexKnotOrigin = normalizedBasisAtStart.knot;
        } else if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceEnd.NotNormalized) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_NOT_NORMALIZED_BASIS);
        } else if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceEnd.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
        }
        if(normalizedBasisAtEnd.knot.knotIndex <= normalizedBasisAtStart.knot.knotIndex) this.throwRangeErrorMessage("generateKnotSequence", EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
    }

    revertSequence(): number[] {
        const seq = this.clone();
        seq.revertKnotSequence();
        return seq.distinctAbscissae();
    }

    length(): number {
        return this.knotSequence.length;
    }

    knotIndexInputParamAssessment(index: KnotIndexStrictlyIncreasingSequence, methodName: string): void {
        if(index.knotIndex < 0) {
            this.throwRangeErrorMessage(methodName, EM_KNOTINDEX_INC_SEQ_NEGATIVE);
        } else if(index.knotIndex > (this.allAbscissae.length - 1)) {
            this.throwRangeErrorMessage(methodName, EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        }
    }

    abscissaAtIndex(index: KnotIndexStrictlyIncreasingSequence): number {
        this.knotIndexInputParamAssessment(index, "abscissaAtIndex");
        let abscissa = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        let i = 0;
        for(const knot of this) {
            if(i === index.knotIndex && knot !== undefined) abscissa = knot.abscissa;
            i++;
        }
        return abscissa;
    }

    incrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number = 1): boolean {
        let increment = true;
        if(index.knotIndex < 0 || index.knotIndex > (this.knotSequence.length - 1)) {
            const error = new ErrorLog(this.constructor.name, "incrementKnotMultiplicity", "the index parameter is out of range. Cannot increment knot multiplicity.");
            error.logMessage();
            increment = false;
        } else {
            this.knotSequence[index.knotIndex].multiplicity += multiplicity;
            this.checkMaxMultiplicityOrderConsistency();
        }
        return increment;
    }
}