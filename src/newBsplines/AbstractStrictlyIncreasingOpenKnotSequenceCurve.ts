import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { AbstractOpenKnotSequenceCurve } from "./AbstractOpenKnotSequenceCurve";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";
import { StrictlyIncreasingOpenKnotSequenceInterface } from "./StrictlyIncreasingKnotSequenceInterface";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";


export abstract class AbstractStrictlyIncreasingOpenKnotSequenceCurve extends AbstractOpenKnotSequenceCurve {

    protected knotSequence: Knot[];
    protected _index: KnotIndexStrictlyIncreasingSequence;
    protected _end: KnotIndexStrictlyIncreasingSequence;
    protected _isNonUniform: boolean;

    constructor(degree: number, knots: number[], multiplicities: number[]) {
        super(degree);
        this.knotSequence = [];
        this._index = new KnotIndexStrictlyIncreasingSequence();
        this._end = new KnotIndexStrictlyIncreasingSequence(Infinity);
        if(knots.length !== multiplicities.length) {
            const error = new ErrorLog(this.constructor.name, "constructor", "size of multiplicities array does not the size of knot abscissae array.");
            error.logMessageToConsole();
        }
        for(let i = 0; i < knots.length; i++) {
            this.knotSequence.push(new Knot(knots[i], multiplicities[i]));
        }
        this._isNonUniform = false;
    }

    get allAbscissae(): number[] {
        const abscissae: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) abscissae.push(knot.abscissa);
        }
        return abscissae;
    }

    get isNonUniform(): boolean {
        return this._isNonUniform;
    }

    [Symbol.iterator]() {
        this._end = new KnotIndexStrictlyIncreasingSequence(this.knotSequence.length - 1);
        return  {
            next: () => {
                if ( this._index.knotIndex <= this._end.knotIndex ) {
                    const abscissa = this.knotSequence[this._index.knotIndex].abscissa;
                    const multiplicity = this.knotSequence[this._index.knotIndex].multiplicity;
                    this._index.knotIndex++;
                    return { value: {abscissa: abscissa, multiplicity: multiplicity}, 
                    done: false };
                } else {
                    this._index = new KnotIndexStrictlyIncreasingSequence();
                    return { done: true };
                }
            }
        }
    }

    checkNonUniformStructure(): void {
        this._isNonUniform = false;
    }

    revertSequence(): number[] {
        const seq = this.deepCopy();
        seq.revertKnots();
        return seq.distinctAbscissae();
    }

    length(): number {
        return this.knotSequence.length;
    }

    abscissaAtIndex(index: KnotIndexStrictlyIncreasingSequence): number {
        let abscissa = RETURN_ERROR_CODE;
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
            error.logMessageToConsole();
            increment = false;
        } else {
            this.knotSequence[index.knotIndex].multiplicity += multiplicity;
            this.checkDegreeConsistency();
        }
        return increment;
    }

    abstract deepCopy(): StrictlyIncreasingOpenKnotSequenceInterface;

    abstract toIncreasingKnotSequence(): IncreasingOpenKnotSequenceInterface;
}