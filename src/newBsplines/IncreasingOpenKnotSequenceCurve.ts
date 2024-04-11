import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractOpenKnotSequenceCurve } from "./AbstractOpenKnotSequenceCurve";
import { Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { StrictlyIncreasingOpenKnotSequenceCurve } from "./StrictlyIncreasingOpenKnotSequenceCurve";


export class IncreasingOpenKnotSequenceCurve extends AbstractOpenKnotSequenceCurve {

    protected knotSequence: Knot[];
    protected _index: KnotIndexIncreasingSequence;
    protected _end: KnotIndexIncreasingSequence;

    constructor(degree: number, knots: number[]) {
        super(degree);
        this.knotSequence = [];
        this._index = new KnotIndexIncreasingSequence();
        this._end = new KnotIndexIncreasingSequence(Infinity);
        if(knots.length < 1) {
            const error = new ErrorLog(this.constructor.name, "constructor", "null length knot cannot be processed.");
            error.logMessageToConsole();
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

    [Symbol.iterator]() {
        let knotAmount = 0;
        const knotIndicesKnotAbscissaChange: number[] = [];
        for(const multiplicity of this.multiplicities) {
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

    checkSizeConsistency(knots: number[]): void {
        let size = 0;
        for (const multiplicity of this.multiplicities) {
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

    toStrictlyIncreasingKnotSequence(): StrictlyIncreasingOpenKnotSequenceCurve {
        return new StrictlyIncreasingOpenKnotSequenceCurve(this._degree, this.distinctAbscissae, this.multiplicities);
    }

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
        const strictltIncreasingKnotSequence = new StrictlyIncreasingOpenKnotSequenceCurve(this._degree, this.distinctAbscissae, this.multiplicities);
        const abscissa = this.abscissaAtIndex(index);
        let i = 0;
        for(const knot of strictltIncreasingKnotSequence) {
            if(knot !== undefined) {
                if(knot.abscissa === abscissa) break;
                i++;
            }
        }
        return new KnotIndexStrictlyIncreasingSequence(i);
    }
}