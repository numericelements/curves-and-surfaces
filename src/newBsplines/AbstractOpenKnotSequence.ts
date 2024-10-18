import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractKnotSequence, KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequence";
import { Knot, KnotIndexIncreasingSequence, KnotIndexInterface, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { AbstractOpenKnotSequence_type, NO_KNOT_CLOSED_CURVE, NO_KNOT_OPEN_CURVE, UNIFORM_OPENKNOTSEQUENCE, Uniform_OpenKnotSequence, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, UniformlySpreadInterKnots_OpenKnotSequence } from "./KnotSequenceConstructorInterface";

export const OPEN_KNOT_SEQUENCE_ORIGIN = 0.0;

export abstract class AbstractOpenKnotSequence extends AbstractKnotSequence {

    protected knotSequence: Knot[];
    protected _uMax: number;
    protected _isKnotMultiplicityNonUniform: boolean;
    protected abstract _indexKnotOrigin: KnotIndexInterface;
    protected abstract _enableMaxMultiplicityOrderAtIntermediateKnots: boolean;

    constructor(maxMultiplicityOrder: number, knotParameters: AbstractOpenKnotSequence_type) {
        super(maxMultiplicityOrder);
        this.knotSequence = [];
        this._uMax = RETURN_ERROR_CODE;
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

    getKnotIndicesBoundingNormalizedBasis(): {start: KnotIndexStrictlyIncreasingSequence, end: KnotIndexStrictlyIncreasingSequence} {
        const startIndex = this.getKnotIndexNormalizedBasisAtSequenceStart();
        const endIndex = this.getKnotIndexNormalizedBasisAtSequenceEnd();
        return {start: startIndex, end: endIndex};
    }

    getKnotIndexNormalizedBasisAtSequenceEnd(): KnotIndexStrictlyIncreasingSequence {
        let cumulativeMultiplicity = this.knotSequence[this.knotSequence.length - 1].multiplicity;
        let index = this.knotSequence.length - 1;
        while(cumulativeMultiplicity < this._maxMultiplicityOrder) {
            index--;
            cumulativeMultiplicity = cumulativeMultiplicity + this.knotSequence[index].multiplicity;
        }
        if(cumulativeMultiplicity !== this._maxMultiplicityOrder) {
            const error = new ErrorLog(this.constructor.name, "getKnotIndexNormalizedBasisAtSequenceEnd");
            error.addMessage("Knot multiplicities at sequence end don't add up correctly to produce a normalized basis starting from some knot. Cannot proceed.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        } else {
            return new KnotIndexStrictlyIncreasingSequence(index);
        }
    }

    getKnotIndexNormalizedBasisAtSequenceStart(): KnotIndexStrictlyIncreasingSequence {
        let cumulativeMultiplicity = this.knotSequence[0].multiplicity;
        let index = 0;
        while(cumulativeMultiplicity < this._maxMultiplicityOrder) {
            index++;
            cumulativeMultiplicity = cumulativeMultiplicity + this.knotSequence[index].multiplicity;
        }
        if(cumulativeMultiplicity !== this._maxMultiplicityOrder) {
            const error = new ErrorLog(this.constructor.name, "getKnotIndexNormalizedBasisAtSequenceEnd");
            error.addMessage("Knot multiplicities at sequence start don't add up correctly to produce a normalized basis starting from some knot. Cannot proceed.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        } else {
            return new KnotIndexStrictlyIncreasingSequence(index);
        }
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
            const warning = new WarningLog(this.constructor.name, "getMultiplicityOfKnotAt", "knot abscissa cannot be found within the knot sequence.");
            warning.logMessageToConsole();
        }
        return multiplicity;
    }

    insertKnot(abscissa: number, multiplicity: number = 1): boolean {
        let insertion = true;
        if(this.isAbscissaCoincidingWithKnot(abscissa)) {
            const warning = new WarningLog(this.constructor.name, "insertKnot", "abscissa is too close from an existing knot: please, raise multiplicity of an existing knot.");
            warning.logMessageToConsole();
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
        // if(!this._enableMaxMultiplicityOrderAtIntermediateKnots) this.checkMaxKnotMultiplicityAtIntermediateKnots();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): void {
        super.decrementKnotMultiplicity(index);
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

}