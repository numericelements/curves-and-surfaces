import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractOpenKnotSequence } from "./AbstractOpenKnotSequence";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";
import { Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { StrictlyIncreasingOpenKnotSequenceInterface } from "./StrictlyIncreasingKnotSequenceInterface";
import { AbstractIncreasingOpenKnotSequence_type, IncreasingOpenKnotSequence, INCREASINGOPENKNOTSEQUENCE, IncreasingOpenKnotSequenceCCurve, IncreasingOpenKnotSequenceCCurve_allKnots, INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, IncreasingOpenKnotSubSequence, INCREASINGOPENKNOTSUBSEQUENCE, IncreasingOpenKnotSubSequenceCCurve, INCREASINGOPENKNOTSUBSEQUENCECLOSEDCURVE, NO_KNOT_CLOSED_CURVE, NO_KNOT_OPEN_CURVE, Uniform_OpenKnotSequence, UNIFORM_OPENKNOTSEQUENCE, UniformlySpreadInterKnots_OpenKnotSequence, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "./IncreasingPeriodicKnotSequenceClosedCurve";


export abstract class AbstractIncreasingOpenKnotSequence extends AbstractOpenKnotSequence {

    protected knotSequence: Knot[];
    protected _indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    protected _uMax: number;
    protected _isKnotMultiplicityNonUniform: boolean;


    constructor(maxMultiplicityOrder: number, knotParameters: AbstractIncreasingOpenKnotSequence_type) {
        super(maxMultiplicityOrder);
        this.knotSequence = [];
        this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence(RETURN_ERROR_CODE);
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
        } else if(knotParameters.type === INCREASINGOPENKNOTSEQUENCE || knotParameters.type === INCREASINGOPENKNOTSUBSEQUENCE
            || knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS || knotParameters.type === INCREASINGOPENKNOTSUBSEQUENCECLOSEDCURVE) {
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

    get isKnotMultiplicityNonUniform(): boolean {
        return this._isKnotMultiplicityNonUniform;
    }

    get uMax(): number {
        return this._uMax;
    }

    get indexKnotOrigin(): KnotIndexIncreasingSequence {
        return this._indexKnotOrigin;
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

    constructorInputArrayAssessment(knots: number[]): void {
        const error = new ErrorLog(this.constructor.name, "constructor");
        if((knots.length) === 0) {
            error.addMessage("Knot sequence with null length encountered. Cannot proceed.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    constructorInputBspBasisSizeAssessment(knotParameters: AbstractIncreasingOpenKnotSequence_type): void {
        const error = new ErrorLog(this.constructor.name, "constructor");
        if(knotParameters.type ===  UNIFORM_OPENKNOTSEQUENCE || knotParameters.type === UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            if(knotParameters.BsplBasisSize < this._maxMultiplicityOrder) {
                error.addMessage("Knot sequence cannot be generated. Not enough control points to generate a B-Spline basis. Cannot proceed.");
                console.log(error.logMessage());
                throw new RangeError(error.logMessage());
            }
        }
    }

    knotIndexInputParamAssessment(index: KnotIndexIncreasingSequence, methodName: string): void {
        if(index.knotIndex < 0) {
            const error = new ErrorLog(this.constructor.name, methodName, "The knot index cannot be negative. The corresponding method is not applied.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        } else if(index.knotIndex > (this.allAbscissae.length - 1)) {
            const error = new ErrorLog(this.constructor.name, methodName, "The knot index cannot be greater than the last knot index.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    checkKnotIncreasingValues(knots: number[]): void {
        if(knots.length > 1) {
            for(let i = 1; i < knots.length; i++) {
                if(knots[i] < knots[i -1]) {
                const error = new ErrorLog(this.constructor.name, "checkKnotIncreasingValues");
                    error.addMessage("Knot sequence is not increasing. Cannot proceed.");
                    console.log(error.logMessage());
                    throw new RangeError(error.logMessage());
                }
            }
        }
    }

    computeKnotSequenceFromMaxMultiplicityOrderOCurve(): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.knotSequence.push(new Knot(0, this._maxMultiplicityOrder));
        this.knotSequence.push(new Knot(1, this._maxMultiplicityOrder));
        this._uMax = 1;
        this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
    }

    computeKnotSequenceFromMaxMultiplicityOrderCCurve(): void {
        const minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        for(let i = - (this._maxMultiplicityOrder - 1); i < (3 * this._maxMultiplicityOrder - 2); i++) {
            this.knotSequence.push(new Knot(i, 1));
        }
        this._uMax = this._maxMultiplicityOrder;
        this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
    }

    computeUniformKnotSequenceFromBsplBasisSize(knotParameters: Uniform_OpenKnotSequence): void {
        const minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputBspBasisSizeAssessment(knotParameters);
        for(let i = - (this._maxMultiplicityOrder - 1); i < (knotParameters.BsplBasisSize + this._maxMultiplicityOrder - 1); i++) {
            this.knotSequence.push(new Knot(i, 1));
        }
        this._uMax = knotParameters.BsplBasisSize - 1;
        this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
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
        this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
    }

    generateKnotSequence(knotParameters: IncreasingOpenKnotSequence | IncreasingOpenKnotSequenceCCurve_allKnots | IncreasingOpenKnotSubSequence | IncreasingOpenKnotSubSequenceCCurve): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters.knots);
        this.checkKnotIncreasingValues(knotParameters.knots);
        this.knotSequence.push(new Knot(knotParameters.knots[0], 1));
        for(let i = 1; i < knotParameters.knots.length; i++) {
            if(knotParameters.knots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity++;
            } else {
                this.knotSequence.push(new Knot(knotParameters.knots[i], 1));
            }
        }
        if(knotParameters.type === INCREASINGOPENKNOTSEQUENCE) {
            if(this.knotSequence[this.knotSequence.length - 1].multiplicity === this._maxMultiplicityOrder) this._uMax = this.knotSequence[this.knotSequence.length - 1].abscissa;
            this.checkUniformityOfKnotMultiplicity();
            if(this._isKnotMultiplicityUniform && this._maxMultiplicityOrder > 2) this._uMax = this.knotSequence[this.knotSequence.length - this._maxMultiplicityOrder + 1].abscissa;
        }
        if(knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS) {
            this.checkUniformityOfKnotMultiplicity();
            if(this._isKnotMultiplicityUniform) {
                if(this._maxMultiplicityOrder > 2) this._uMax = this.knotSequence[this.knotSequence.length - this._maxMultiplicityOrder].abscissa;
            } else {
                let cumulativeMultiplicity = this.knotSequence[this.knotSequence.length - 1].multiplicity;
                let index = this.knotSequence.length - 1;
                while(cumulativeMultiplicity < this._maxMultiplicityOrder) {
                    index--;
                    cumulativeMultiplicity = cumulativeMultiplicity + this.knotSequence[index].multiplicity;
                }
                if(index >= 0) this._uMax = this.knotSequence[index].abscissa;
            }
        }
        this.checkSizeConsistency(knotParameters.knots);
    }

    computeKnotSequenceFromPeriodicKnotSequence(knotParameters: IncreasingOpenKnotSequenceCCurve): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters.periodicKnots);
        this.checkKnotIncreasingValues(knotParameters.periodicKnots);
        const periodicSeq = new IncreasingPeriodicKnotSequenceClosedCurve((this._maxMultiplicityOrder - 1), knotParameters.periodicKnots);
        const openSequence = periodicSeq.toOpenKnotSequence();
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
        seq.revertKnots();
        return seq.allAbscissae;
    }

    checkSizeConsistency(knots: number[]): void {
        let size = 0;
        for (const multiplicity of this.multiplicities()) {
            size += multiplicity;
        }
        const increasingSequence = [];
        for(const knot of knots) {
            increasingSequence.push(knot)
        }
        if(size !== increasingSequence.length) {
            const error = new ErrorLog(this.constructor.name, "checkSizeConsistency", "increasing knot sequence size incompatible with the multiplicity orders of the strictly increasing sequence.");
            error.logMessageToConsole();
        }
    }

    length(): number {
        let length = 0;
        for(const knot of this) {
            if(knot !== undefined) length++;
        }
        return length;
    }

    abstract clone(): IncreasingOpenKnotSequenceInterface;

    abstract toStrictlyIncreasingKnotSequence(): StrictlyIncreasingOpenKnotSequenceInterface;

    abscissaAtIndex(index: KnotIndexIncreasingSequence): number {
        // this.knotIndexInputParamAssessment(index, "abscissaAtIndex");
        let abscissa = RETURN_ERROR_CODE;
        let i = 0;
        for(const knot of this) {
            if(i === index.knotIndex && knot !== undefined) abscissa = knot;
            i++;
        }
        return abscissa;
    }

    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence {
        const strictlyIncreasingKnotSequence = this.toStrictlyIncreasingKnotSequence();
        // const strictltIncreasingKnotSequence = new AbstractStrictlyIncreasingOpenKnotSequenceCurve(this._degree, this.distinctAbscissae(), this.multiplicities());
        const abscissa = this.abscissaAtIndex(index);
        let i = 0;
        for(const knot of strictlyIncreasingKnotSequence.allAbscissae) {
            if(knot !== undefined) {
                if(knot === abscissa) break;
                i++;
            }
        }
        return new KnotIndexStrictlyIncreasingSequence(i);
    }

    extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[] {
        let knots: number[] = [];
        if(!(knotStart.knotIndex >= 0) || !(knotEnd.knotIndex <= this.length() - 1) || !(knotStart.knotIndex <= knotEnd.knotIndex)) {
            const error = new ErrorLog(this.constructor.name, "extractSubset", "start and/or end indices values are out of range. Cannot perform the extraction.");
            error.logMessageToConsole();
            return knots;
        }
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