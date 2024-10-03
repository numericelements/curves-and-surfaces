import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractOpenKnotSequenceCurve } from "./AbstractOpenKnotSequenceCurve";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";
import { Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { StrictlyIncreasingOpenKnotSequenceInterface } from "./StrictlyIncreasingKnotSequenceInterface";


export abstract class AbstractIncreasingOpenKnotSequenceCurve extends AbstractOpenKnotSequenceCurve {

    protected knotSequence: Knot[];
    protected _index: KnotIndexIncreasingSequence;
    protected _end: KnotIndexIncreasingSequence;
    protected _isNonUniform: boolean;

    constructor(maxMultiplicityOrder: number, knots: number[]) {
        super(maxMultiplicityOrder);
        this.knotSequence = [];
        this._index = new KnotIndexIncreasingSequence();
        this._end = new KnotIndexIncreasingSequence(Infinity);
        this._isNonUniform = false;
        if(knots.length < 1) {
            const error = new ErrorLog(this.constructor.name, "constructor", "null length knot sequence cannot be processed.");
            error.logMessageToConsole();
            return;
        }
        this.knotSequence.push(new Knot(knots[0], 1));
        for(let i = 1; i < knots.length; i++) {
            if(knots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity++;
            } else {
                this.knotSequence.push(new Knot(knots[i], 1));
            }
        }
        this.checkSizeConsistency(knots);
    }

    get allAbscissae(): number[] {
        const abscissae: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) abscissae.push(knot);
        }
        return abscissae;
    }

    get isNonUniform(): boolean {
        return this._isNonUniform;
    }

    [Symbol.iterator]() {
        let knotAmount = 0;
        const knotIndicesKnotAbscissaChange: number[] = [];
        for(const multiplicity of this.multiplicities()) {
            knotAmount = knotAmount + multiplicity;
            knotIndicesKnotAbscissaChange.push(knotAmount);
        }
        this._end = new KnotIndexIncreasingSequence(knotAmount - 1);
        let indexAbscissaChange = new KnotIndexIncreasingSequence();
        return  {
            next: () => {
                if ( this._index.knotIndex <= this._end.knotIndex ) {
                    if(this._index.knotIndex === knotIndicesKnotAbscissaChange[indexAbscissaChange.knotIndex]) {
                        indexAbscissaChange.knotIndex++;
                    }
                    this._index.knotIndex++;
                    return { value: this.knotSequence[indexAbscissaChange.knotIndex].abscissa,  done: false };
                } else {
                    this._index = new KnotIndexIncreasingSequence();
                    return { done: true };
                }
            }
        }
    }

    abstract checkNonUniformStructure(): void;

    revertSequence(): number[] {
        const seq = this.deepCopy();
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

    abstract deepCopy(): IncreasingOpenKnotSequenceInterface;

    abstract toStrictlyIncreasingKnotSequence(): StrictlyIncreasingOpenKnotSequenceInterface;

    abscissaAtIndex(index: KnotIndexIncreasingSequence): number {
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