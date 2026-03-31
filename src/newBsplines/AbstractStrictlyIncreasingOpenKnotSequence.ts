import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { AbstractOpenKnotSequence } from "./AbstractOpenKnotSequence";
import { Knot } from "./Knot";
import { StrictlyIncreasingKnotSequenceInterface } from "./StrictlyIncreasingKnotSequenceInterface";
import { AbstractStrictlyIncreasingOpenKnotSequence_type, NO_KNOT_CLOSED_CURVE, NO_KNOT_OPEN_CURVE, StrictlyIncreasingOpenKnotSequence, STRICTLYINCREASINGOPENKNOTSEQUENCE, StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART, EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND, EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT, EM_KNOT_MULTIPLICITY_OUT_OF_RANGE, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_NOT_NORMALIZED_BASIS, EM_KNOTINDEX_INC_SEQ_NEGATIVE, EM_KNOTINDEX_INC_SEQ_TOO_LARGE, EM_SIZENORMALIZED_BSPLINEBASIS } from "../ErrorMessages/KnotSequences"
import { NormalizedBasisAtSequenceExtremity, KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { DEFAULT_KNOT_ABSCISSA_VALUE, DEFAULT_KNOT_INDEX } from "../namedConstants/Knots";
import { adaptParameterInsertKnot } from "./KnotSequenceAndUtilities/adaptParameterInsertKnot";
import { adaptParameterRaiseKnotMultiplicity } from "./KnotSequenceAndUtilities/adaptParameterRaiseKnotMultiplicity";
import { WM_GEOMETRIC_CONSTRAINTS_POLYGON_VERTICES } from "../WarningMessages/KnotSequences";

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
                    return { value: {abscissa: abscissa, multiplicity: multiplicity}, done: false };
                } else {
                    index = 0;
                    return { done: true };
                }
            }
        }
    }

    abstract clone(): StrictlyIncreasingKnotSequenceInterface;

    abstract checkNonUniformKnotMultiplicityOrder(): void;

    checkKnotMultiplicities(multiplicities: readonly number[]): void {
        for(let i = 0; i < multiplicities.length; i++) {
            if(multiplicities[i] <= 0) this.throwRangeErrorMessage("checkKnotMultiplicities", EM_KNOT_MULTIPLICITY_OUT_OF_RANGE);
        }
    }

    updateNormalizedBasisOrigin(): void {
        const normalizedBasisAtStart = this.getKnotIndexNormalizedBasisAtSequenceStart();
        let abscissaOrigin = DEFAULT_KNOT_ABSCISSA_VALUE;
        if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            abscissaOrigin = this.abscissaAtIndex(normalizedBasisAtStart.knot);
        }
        if(abscissaOrigin !== KNOT_SEQUENCE_ORIGIN) this.throwRangeErrorMessage("checkNormalizedBasisOrigin", EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
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
        if(normalizedBasisAtEnd.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.NotNormalized
            || normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.NotNormalized) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_NOT_NORMALIZED_BASIS);
        }  else if(normalizedBasisAtEnd.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            this._uMax = this.abscissaAtIndex(normalizedBasisAtEnd.knot);
        } else if(normalizedBasisAtEnd.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND);
        }
        if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            this._indexKnotOrigin = normalizedBasisAtStart.knot;
        } else if(normalizedBasisAtStart.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
        }
        if(normalizedBasisAtEnd.knot.knotIndex <= normalizedBasisAtStart.knot.knotIndex) this.throwRangeErrorMessage("generateKnotSequence", EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
        if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS || knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
            const periodicKnotLength = normalizedBasisAtEnd.knot.knotIndex - normalizedBasisAtStart.knot.knotIndex;
            if(this._maxMultiplicityOrder === 2 && periodicKnotLength < 3) this.throwRangeErrorMessage("generateKnotSequence", EM_SIZENORMALIZED_BSPLINEBASIS);
            let cumulative_multiplicities = 0;
            for(let i = this._indexKnotOrigin.knotIndex + 1; i < this._indexKnotOrigin.knotIndex + periodicKnotLength; i++) {
                cumulative_multiplicities += knotParameters.multiplicities[i];
            }
            if(cumulative_multiplicities < (this._maxMultiplicityOrder - this.knotMultiplicity(this._indexKnotOrigin))) {
                const warning = new WarningLog(this.constructor.name, "generateKnotSequence", WM_GEOMETRIC_CONSTRAINTS_POLYGON_VERTICES);
                warning.logMessage();
                if(this.knotMultiplicity(this._indexKnotOrigin) === 1) this.throwRangeErrorMessage("generateKnotSequence", EM_SIZENORMALIZED_BSPLINEBASIS);
            }
        }
    }

    length(): number {
        return this.knotSequence.length;
    }

    knotIndexInputParamAssessment(index: KnotIndexStrictlyIncreasingSequence, methodName: string): void {
        if(index.knotIndex > (this.allAbscissae.length - 1)) {
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

    @adaptParameterRaiseKnotMultiplicity()
    raiseKnotMultiplicityKnotArrayMutSeq(arrayIndices: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>, multiplicity: number = 1, checkSequenceConsistency: boolean = true): void {
        return super.raiseKnotMultiplicityKnotArrayMutSeq(arrayIndices as Array<KnotIndexStrictlyIncreasingSequence>, multiplicity, checkSequenceConsistency);
    }

    @adaptParameterInsertKnot()
    insertKnotAbscissaArrayMutSeq(abscissa: number | number[], multiplicity: number = 1): void {
        return super.insertKnotAbscissaArrayMutSeq(abscissa as number[], multiplicity);
    }
}