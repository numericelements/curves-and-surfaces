import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT, EM_NOT_NORMALIZED_BASIS } from "./AbstractIncreasingOpenKnotSequence";
import { AbstractKnotSequence, EM_MAXMULTIPLICITY_ORDER_SEQUENCE, EM_SEQUENCE_ORIGIN_REMOVAL, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "./AbstractKnotSequence";
import { Knot, KnotIndexIncreasingSequence, KnotIndexInterface, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { AbstractOpenKnotSequence_type, NO_KNOT_CLOSED_CURVE, NO_KNOT_OPEN_CURVE, UNIFORM_OPENKNOTSEQUENCE, Uniform_OpenKnotSequence, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, UniformlySpreadInterKnots_OpenKnotSequence } from "./KnotSequenceConstructorInterface";
import { OPEN_KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences"
import { KNOT_COINCIDENCE_TOLERANCE } from "../namedConstants/KnotSequences"
// import { resetKnotAbscissaeToOrigin } from "./Piegl_Tiller_NURBS_Book";

export const EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART = "Knot multiplicities at sequence start don't add up correctly to produce a normalized basis starting from some knot. Cannot proceed.";
export const EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND = "Knot multiplicities at sequence end don't add up correctly to produce a normalized basis ending from some knot. Cannot proceed.";
export const EM_KNOT_INSERTION_OVER_UMAX = "Knot insertion cannot take place over the largest knot abscissa. Please, create a new knot sequence incorporating the new abscissa.";
export const EM_KNOT_INSERTION_UNDER_SEQORIGIN = "Knot insertion cannot take place at abscissa lower than the knot sequence origin. Please, create a new knot sequence incorporating the new abscissa.";
export const EM_MAXMULTIPLICITY_ORDER_ATKNOT = "The knot multiplicity becomes greater than the maximal multiplicity of the knot sequence. Perhaps, raise the maximal multiplicity before increasing the knot multiplicity.";
export const EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS = "The knot multiplicity cannot be modified since it modifies the interval of the normalized basis. Please, change the normalized basis definition."
export const WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE = "Knot abscissa cannot be found into the knot sequence."
export const WM_ABSCISSA_TOO_CLOSE_TO_KNOT = "Abscissa is too close from an existing knot: please, raise multiplicity of an existing knot.";

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
        this.strictlyIncKnotIndexInputParamAssessment(index, "toKnotIndexIncreasingSequence")
        let indexIncSeq = 0;
        for(let i = 0; i < index.knotIndex; i++) {
            indexIncSeq += this.knotSequence[i].multiplicity;
        }
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
            const warning = new WarningLog(this.constructor.name, "insertKnot", WM_ABSCISSA_TOO_CLOSE_TO_KNOT);
            warning.logMessage();
            insertion = false;
            return insertion;
        } else if(abscissa > this._uMax) {
            this.throwRangeErrorMessage("insertKnot", EM_KNOT_INSERTION_OVER_UMAX);
        } else if(abscissa < OPEN_KNOT_SEQUENCE_ORIGIN) {
            this.throwRangeErrorMessage("insertKnot", EM_KNOT_INSERTION_UNDER_SEQORIGIN);
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

    removeKnot(index: KnotIndexStrictlyIncreasingSequence): void {
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
    }

    /**
     * Raises the multiplicity of a knot at the specified index.
     * 
     * @param index - The index of the knot to modify, represented as a KnotIndexStrictlyIncreasingSequence object.
     * @param multiplicity - The amount to increase the knot's multiplicity. Defaults to 1.
     * @param checkSequenceConsistency - Whether to perform additional consistency checks. Defaults to true.
     * 
     * @throws {RangeError} If the knot index is out of bounds or if the new multiplicity violates sequence constraints.
     * 
     * @description
     * This method increases the multiplicity of a specified knot in the sequence. 
     * Increasing a knot's multiplicity affects the continuity and shape of the resulting curve:
     * - Higher multiplicity creates a "stronger" control point influence
     * - It can introduce discontinuities or sharp corners in the curve
     * 
     * The method includes several checks to maintain the mathematical validity of the knot sequence:
     * - Ensures the modified knot is not at the sequence boundaries
     * - Verifies that the new multiplicity doesn't exceed allowed maximums
     * - Checks for uniformity and allowed non-uniform orders in the sequence
     * 
     * @example
     * // Increase the multiplicity of the third knot (index 2) by 1
     * const index = { knotIndex: 2 };
     * this.raiseKnotMultiplicity(index);
     * 
     * // Increase the multiplicity of the fourth knot (index 3) by 2
     * const index2 = { knotIndex: 3 };
     * this.raiseKnotMultiplicity(index2, 2);
     */
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number = 1, checkSequenceConsistency: boolean = true): void {
        this.strictlyIncKnotIndexInputParamAssessment(index, "raiseKnotMultiplicity");
        this.knotSequence[index.knotIndex].multiplicity += multiplicity;
        if(checkSequenceConsistency || (!checkSequenceConsistency && !this._isSequenceUpToC0Discontinuity)) {
            const basisAtEnd = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            if(index.knotIndex <= this._indexKnotOrigin.knotIndex || index.knotIndex >= basisAtEnd.knotIndex.knotIndex) {
                this.throwRangeErrorMessage('raiseKnotMultiplicity', EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            }
            if(!this._isSequenceUpToC0Discontinuity) {
                this.checkMaxKnotMultiplicityAtIntermediateKnots();
            } else if(this.knotSequence[index.knotIndex].multiplicity > this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage('raiseKnotMultiplicity', EM_MAXMULTIPLICITY_ORDER_ATKNOT);
            }
        }
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, checkSequenceConsistency: boolean = true): void {
        this.strictlyIncKnotIndexInputParamAssessment(index, "decrementKnotMultiplicity");
        if(checkSequenceConsistency) {
            const basisAtEnd = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            if(index.knotIndex <= this._indexKnotOrigin.knotIndex || index.knotIndex >= basisAtEnd.knotIndex.knotIndex) {
                this.throwRangeErrorMessage('raiseKnotMultiplicity', EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            }
            if(this.knotSequence[index.knotIndex].multiplicity === 1) {
                if(index.knotIndex === this._indexKnotOrigin.knotIndex) {
                    this.throwRangeErrorMessage("decrementKnotMultiplicity", EM_SEQUENCE_ORIGIN_REMOVAL);
                } else {
                    this.removeKnot(index);
                }
            } else {
                this.knotSequence[index.knotIndex].decrementMultiplicity();
            }
        } else {
            if(this.knotSequence[index.knotIndex].multiplicity === 1) {
                this.removeKnot(index);
            } else {
                this.knotSequence[index.knotIndex].decrementMultiplicity();
            }
        }

        this.checkUniformityOfKnotSpacing();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

    updateKnotSequenceThroughNormalizedBasisAnalysis(): void {
        for(let i = 0; i < this.knotSequence.length; i++) {
            const knot = this.knotSequence[i];
            if(knot.multiplicity > this._maxMultiplicityOrder) {
                this._maxMultiplicityOrder = knot.multiplicity;
            }
        }
        const indices = this.getKnotIndicesBoundingNormalizedBasis();
        if(indices.start.basisAtSeqExt === NormalizedBasisAtSequenceEnd.StrictlyNormalized) {
            this._indexKnotOrigin = indices.start.knotIndex;
            if(this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa !== OPEN_KNOT_SEQUENCE_ORIGIN) {
                this.resetKnotAbscissaeToOrigin();
                // const relocatedAbscissae = resetKnotAbscissaeToOrigin(this.distinctAbscissae(), this._indexKnotOrigin);
                // const multiplicities = this.multiplicities();
                // this.knotSequence = [];
                // let i = 0;
                // for(const abscissa of relocatedAbscissae) {
                //     const knot = new Knot(abscissa, multiplicities[i]);
                //     this.knotSequence.push(knot);
                //     i++;
                // }
            }
        } else if(indices.start.basisAtSeqExt === NormalizedBasisAtSequenceEnd.OverDefined) {
            this.throwRangeErrorMessage("updateKnotSequenceThroughNormalizedBasisAnalysis", EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART)
        } else if(indices.start.basisAtSeqExt === NormalizedBasisAtSequenceEnd.NotNormalized) {
            this.throwRangeErrorMessage("updateKnotSequenceThroughNormalizedBasisAnalysis",EM_NOT_NORMALIZED_BASIS)
        }
        if(indices.end.basisAtSeqExt === NormalizedBasisAtSequenceEnd.StrictlyNormalized) {
            this._uMax = this.abscissaAtIndex(this.toKnotIndexIncreasingSequence(indices.end.knotIndex));
        } else if(indices.end.basisAtSeqExt === NormalizedBasisAtSequenceEnd.NotNormalized) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_NOT_NORMALIZED_BASIS);
        } else if(indices.end.basisAtSeqExt === NormalizedBasisAtSequenceEnd.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND);
        }
        if(indices.end.knotIndex.knotIndex <= indices.start.knotIndex.knotIndex) this.throwRangeErrorMessage("generateKnotSequence", EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
    }

    resetKnotAbscissaeToOrigin(): void {
        for(let i = 0; i < this.knotSequence.length; i++) {
            let newAbscissa = this.knotSequence[i].abscissa - this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa;
            if(Math.abs(newAbscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                newAbscissa = OPEN_KNOT_SEQUENCE_ORIGIN;
            }
            this.knotSequence[i].abscissa = newAbscissa;
        }
    }
}