import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractOpenKnotSequence } from "./AbstractOpenKnotSequence";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";
import { DEFAULT_KNOT_INDEX, Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { StrictlyIncreasingOpenKnotSequenceInterface } from "./StrictlyIncreasingKnotSequenceInterface";
import { AbstractIncreasingOpenKnotSequence_type, IncreasingOpenKnotSequence, INCREASINGOPENKNOTSEQUENCE, IncreasingOpenKnotSequenceCCurve, IncreasingOpenKnotSequenceCCurve_allKnots, INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, IncreasingOpenKnotSubSequence, INCREASINGOPENKNOTSUBSEQUENCE, IncreasingOpenKnotSubSequenceCCurve, INCREASINGOPENKNOTSUBSEQUENCECLOSEDCURVE, INCREASINGPERIODICKNOTSEQUENCE, NO_KNOT_CLOSED_CURVE, NO_KNOT_OPEN_CURVE, Uniform_OpenKnotSequence, UNIFORM_OPENKNOTSEQUENCE, UniformlySpreadInterKnots_OpenKnotSequence, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "./IncreasingPeriodicKnotSequenceClosedCurve";


export abstract class AbstractIncreasingOpenKnotSequence extends AbstractOpenKnotSequence {

    protected _indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    protected abstract _enableMaxMultiplicityOrderAtIntermediateKnots: boolean;

    constructor(maxMultiplicityOrder: number, knotParameters: AbstractIncreasingOpenKnotSequence_type) {
        super(maxMultiplicityOrder, knotParameters);
        this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence(DEFAULT_KNOT_INDEX);
        if(knotParameters.type === NO_KNOT_OPEN_CURVE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        } else if(knotParameters.type === NO_KNOT_CLOSED_CURVE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        } else if(knotParameters.type === UNIFORM_OPENKNOTSEQUENCE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        } else if(knotParameters.type === UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
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

    abstract clone(): IncreasingOpenKnotSequenceInterface;

    abstract toStrictlyIncreasingKnotSequence(): StrictlyIncreasingOpenKnotSequenceInterface;

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

    checkOriginOfNormalizedBasis(): void {
        const indexStart = this.getKnotIndexNormalizedBasisAtSequenceStart();
        const abscissaOrigin = this.abscissaAtIndex(this.toKnotIndexIncreasingSequence(indexStart));
        if(abscissaOrigin !== 0.0) {
            const error = new ErrorLog(this.constructor.name, "checkOriginOfNormalizedBasis", "The abscissa defining the origin of the normalized basis of the knot sequence is not 0.0. The knot sequence is not consistent. Cannot proceed.");
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

    generateKnotSequence(knotParameters: IncreasingOpenKnotSequence | IncreasingOpenKnotSequenceCCurve_allKnots | IncreasingOpenKnotSubSequence | IncreasingOpenKnotSubSequenceCCurve): void {
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
        // this.checkMaxKnotMultiplicityAtIntermediateKnots();
        const {start: indexStart, end: indexEnd} = this.getKnotIndicesBoundingNormalizedBasis();
        this._uMax = this.abscissaAtIndex(this.toKnotIndexIncreasingSequence(indexEnd));
        this._indexKnotOrigin = indexStart;
        this.checkSizeConsistency(knotParameters.knots);
    }

    computeKnotSequenceFromPeriodicKnotSequence(knotParameters: IncreasingOpenKnotSequenceCCurve): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotIncreasingValues(knotParameters.periodicKnots);
        const periodicSeq = new IncreasingPeriodicKnotSequenceClosedCurve((this._maxMultiplicityOrder - 1), {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotParameters.periodicKnots});
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
        for(const multiplicity of this.multiplicities()) {
            size += multiplicity;
        }
        if(size !== knots.length) {
            const error = new ErrorLog(this.constructor.name, "checkSizeConsistency");
            error.addMessage("Increasing knot sequence size incompatible with the multiplicity orders of the strictly increasing sequence. Cannot proceed.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    length(): number {
        let length = 0;
        for(const knot of this) {
            if(knot !== undefined) length++;
        }
        return length;
    }

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
            const error = new ErrorLog(this.constructor.name, "extractSubsetOfAbscissae");
            error.addMessage("Start and/or end indices values are out of range. Cannot perform the extraction.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
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