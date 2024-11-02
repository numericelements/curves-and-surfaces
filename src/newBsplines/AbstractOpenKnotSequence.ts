import { WarningLog } from "../errorProcessing/ErrorLoging";
import { AbstractKnotSequence, EM_SEQUENCE_ORIGIN_REMOVAL, KNOT_COINCIDENCE_TOLERANCE, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "./AbstractKnotSequence";
import { Knot, KnotIndexIncreasingSequence, KnotIndexInterface, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { AbstractOpenKnotSequence_type, NO_KNOT_CLOSED_CURVE, NO_KNOT_OPEN_CURVE, UNIFORM_OPENKNOTSEQUENCE, Uniform_OpenKnotSequence, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, UniformlySpreadInterKnots_OpenKnotSequence } from "./KnotSequenceConstructorInterface";

export const OPEN_KNOT_SEQUENCE_ORIGIN = 0.0;
export const EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART = "Knot multiplicities at sequence start don't add up correctly to produce a normalized basis starting from some knot. Cannot proceed.";
export const EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND = "Knot multiplicities at sequence end don't add up correctly to produce a normalized basis ending from some knot. Cannot proceed.";
export const WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE = "Knot abscissa cannot be found into the knot sequence."

export enum NormalizedBasisAtSequenceEnd {NotNormalized, StrictlyNormalized, OverDefined};

export abstract class AbstractOpenKnotSequence extends AbstractKnotSequence {

    protected knotSequence: Knot[];
    protected _uMax: number;
    protected _isKnotMultiplicityNonUniform: boolean;
    protected abstract _indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    protected abstract _isSequenceUpToC0Discontinuity: boolean;

    constructor(maxMultiplicityOrder: number, knotParameters: AbstractOpenKnotSequence_type) {
        super(maxMultiplicityOrder);
        this.knotSequence = [];
        this._uMax = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        this._isKnotMultiplicityNonUniform = false;
        if(knotParameters.type === NO_KNOT_OPEN_CURVE) {
            this.computeKnotSequenceFromMaxMultiplicityOrderOCurve();
        } else if(knotParameters.type === NO_KNOT_CLOSED_CURVE) {
            this.computeKnotSequenceFromMaxMultiplicityOrderCCurve();
        } else if(knotParameters.type === UNIFORM_OPENKNOTSEQUENCE) {
            this.computeUniformKnotSequenceFromBsplBasisSize(knotParameters);
        } else if(knotParameters.type === UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            this.computeNonUniformKnotSequenceFromBsplBasisSize(knotParameters);
        }
    }

    abstract checkNonUniformKnotMultiplicityOrder(): void;

    abstract abscissaAtIndex(index: KnotIndexInterface): number;

    get uMax(): number {
        return this._uMax;
    }

    get isKnotMultiplicityNonUniform(): boolean {
        return this._isKnotMultiplicityNonUniform;
    }

    // This index transformation is not unique. The convention followed here is the assignment of the first index of the increasing
    // sequence where the abscissa at index (strictly increasing sequence) appears
    toKnotIndexIncreasingSequence(index: KnotIndexStrictlyIncreasingSequence): KnotIndexIncreasingSequence {
        let indexIncSeq = 0;
        for(let i = 0; i < index.knotIndex; i++) {
            indexIncSeq += this.knotSequence[i].multiplicity;
        }
        // if(index.knotIndex !== 0) indexIncSeq++;
        return new KnotIndexIncreasingSequence(indexIncSeq);
    }

    getKnotIndicesBoundingNormalizedBasis(): {start: {knotIndex: KnotIndexStrictlyIncreasingSequence, basisAtSeqExt: NormalizedBasisAtSequenceEnd}, end: {knotIndex: KnotIndexStrictlyIncreasingSequence, basisAtSeqExt: NormalizedBasisAtSequenceEnd}} {
        const normalizedBasisAtStart = this.getKnotIndexNormalizedBasisAtSequenceStart();
        const normalizedBasisAtEnd = this.getKnotIndexNormalizedBasisAtSequenceEnd();
        return {start: normalizedBasisAtStart, end: normalizedBasisAtEnd};
    }

    getKnotIndexNormalizedBasisAtSequenceEnd(): {knotIndex: KnotIndexStrictlyIncreasingSequence, basisAtSeqExt: NormalizedBasisAtSequenceEnd} {
        let cumulativeMultiplicity = this.knotSequence[this.knotSequence.length - 1].multiplicity;
        let index = this.knotSequence.length - 1;
        let basisAtSeqEnd: NormalizedBasisAtSequenceEnd = NormalizedBasisAtSequenceEnd.NotNormalized;
        while(cumulativeMultiplicity < this._maxMultiplicityOrder && index > 0) {
            index--;
            cumulativeMultiplicity = cumulativeMultiplicity + this.knotSequence[index].multiplicity;
        }
        if(cumulativeMultiplicity > this._maxMultiplicityOrder) {
            basisAtSeqEnd = NormalizedBasisAtSequenceEnd.OverDefined;
        } else if(cumulativeMultiplicity === this._maxMultiplicityOrder) {
            basisAtSeqEnd = NormalizedBasisAtSequenceEnd.StrictlyNormalized;
        }
        return {knotIndex: new KnotIndexStrictlyIncreasingSequence(index), basisAtSeqExt: basisAtSeqEnd};
    }

    getKnotIndexNormalizedBasisAtSequenceStart(): {knotIndex: KnotIndexStrictlyIncreasingSequence, basisAtSeqExt: NormalizedBasisAtSequenceEnd} {
        let cumulativeMultiplicity = this.knotSequence[0].multiplicity;
        let index = 0;
        let basisAtSeqStart: NormalizedBasisAtSequenceEnd = NormalizedBasisAtSequenceEnd.NotNormalized;
        while(cumulativeMultiplicity < this._maxMultiplicityOrder && index < (this.knotSequence.length - 1)) {
            index++;
            cumulativeMultiplicity = cumulativeMultiplicity + this.knotSequence[index].multiplicity;
        }
        if(cumulativeMultiplicity > this._maxMultiplicityOrder) {
            basisAtSeqStart = NormalizedBasisAtSequenceEnd.OverDefined;
        } else if(cumulativeMultiplicity === this._maxMultiplicityOrder) {
            basisAtSeqStart = NormalizedBasisAtSequenceEnd.StrictlyNormalized;
        }
        return {knotIndex: new KnotIndexStrictlyIncreasingSequence(index), basisAtSeqExt: basisAtSeqStart};
    }

    computeKnotSequenceFromMaxMultiplicityOrderOCurve(): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.knotSequence.push(new Knot(0, this._maxMultiplicityOrder));
        this.knotSequence.push(new Knot(1, this._maxMultiplicityOrder));
        this._uMax = this.knotSequence[this.knotSequence.length - 1].abscissa;
    }

    computeKnotSequenceFromMaxMultiplicityOrderCCurve(): void {
        const minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        for(let i = - (this._maxMultiplicityOrder - 1); i < (3 * this._maxMultiplicityOrder - 2); i++) {
            this.knotSequence.push(new Knot(i, 1));
        }
        this._uMax = this._maxMultiplicityOrder;
    }

    computeUniformKnotSequenceFromBsplBasisSize(knotParameters: Uniform_OpenKnotSequence): void {
        const minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputBspBasisSizeAssessment(knotParameters);
        for(let i = - (this._maxMultiplicityOrder - 1); i < (knotParameters.BsplBasisSize + this._maxMultiplicityOrder - 1); i++) {
            this.knotSequence.push(new Knot(i, 1));
        }
        this._uMax = knotParameters.BsplBasisSize - 1;
    }

    computeNonUniformKnotSequenceFromBsplBasisSize(knotParameters: UniformlySpreadInterKnots_OpenKnotSequence): void {
        const minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputBspBasisSizeAssessment(knotParameters);
        this.knotSequence.push(new Knot(0, this._maxMultiplicityOrder));
        for(let i = 0; i < knotParameters.BsplBasisSize - this._maxMultiplicityOrder; i++) {
            this.knotSequence.push(new Knot((i + 1), 1));
        }
        this.knotSequence.push(new Knot((knotParameters.BsplBasisSize - this._maxMultiplicityOrder + 1), this._maxMultiplicityOrder));
        this._uMax = knotParameters.BsplBasisSize - this._maxMultiplicityOrder + 1;
    }

    knotMultiplicityAtAbscissa(abscissa: number): number {
        let multiplicity = 0;
        for(const knot of this.knotSequence) {
            if(Math.abs(abscissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                multiplicity = knot.multiplicity;
            }
        }
        if(multiplicity === 0) {
            const warning = new WarningLog(this.constructor.name, "getMultiplicityOfKnotAt", WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE);
            warning.logMessage();
        }
        return multiplicity;
    }

    insertKnot(abscissa: number, multiplicity: number = 1): boolean {
        let insertion = true;
        if(this.isAbscissaCoincidingWithKnot(abscissa)) {
            const warning = new WarningLog(this.constructor.name, "insertKnot", "abscissa is too close from an existing knot: please, raise multiplicity of an existing knot.");
            warning.logMessage();
            insertion = false;
            return insertion;
        }
        this.maxMultiplicityOrderInputParamAssessment(multiplicity, "insertKnot");
        if(insertion) {
            const knot = new Knot(abscissa, multiplicity);
            if(abscissa < this.knotSequence[0].abscissa) {
                this.knotSequence.splice(0, 0, knot);
            } else {
                let i = 0;
                while(i < (this.knotSequence.length - 1)) {
                    if(this.knotSequence[i].abscissa < abscissa && abscissa < this.knotSequence[i + 1].abscissa) break;
                    i++;
                }
                if(i === (this.knotSequence.length - 1)) {
                    this.knotSequence.push(knot);
                } else {
                    this.knotSequence.splice((i + 1), 0, knot);
                }
            }
            this.checkUniformityOfKnotSpacing();
            this.checkUniformityOfKnotMultiplicity();
            this.checkNonUniformKnotMultiplicityOrder();
        }
        return insertion;
    }

    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): void {
        this.strictlyIncKnotIndexInputParamAssessment(index, "raiseKnotMultiplicity");
        this.knotSequence[index.knotIndex].multiplicity += multiplicity;
        if(!this._isSequenceUpToC0Discontinuity) this.checkMaxKnotMultiplicityAtIntermediateKnots();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): void {
        this.strictlyIncKnotIndexInputParamAssessment(index, "decrementKnotMultiplicity");
        if(this.knotSequence[index.knotIndex].multiplicity === 1) {
            if(this._indexKnotOrigin instanceof KnotIndexStrictlyIncreasingSequence && index.knotIndex === this._indexKnotOrigin.knotIndex) this.throwRangeErrorMessage("decrementKnotMultiplicity", EM_SEQUENCE_ORIGIN_REMOVAL);
            const abscissae = this.distinctAbscissae();
            const multiplicities = this.multiplicities();
            abscissae.splice(index.knotIndex, 1);
            multiplicities.splice(index.knotIndex, 1);
            this.knotSequence = [];
            let i = 0;
            for(const abscissa of abscissae) {
                const knot = new Knot(abscissa, multiplicities[i]);
                this.knotSequence.push(knot);
                i++;
            }
        } else {
            this.knotSequence[index.knotIndex].multiplicity--;
        }
        this.checkUniformityOfKnotSpacing();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }
}