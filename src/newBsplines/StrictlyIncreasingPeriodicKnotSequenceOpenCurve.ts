import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractPeriodicKnotSequence } from "./AbstractPeriodicKnotSequence";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "./IncreasingPeriodicKnotSequenceClosedCurve";
import { Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";

export class StrictlyIncreasingPeriodicKnotSequenceClosedCurve extends AbstractPeriodicKnotSequence {

    protected knotSequence: Knot[];
    protected _index: KnotIndexIncreasingSequence;
    protected _end: KnotIndexIncreasingSequence;
    protected _period: number;

    constructor(degree: number, knots: number[], multiplicities: number[], subsequence: boolean = false) {
        super(degree);
        this.knotSequence = [];
        this._index = new KnotIndexIncreasingSequence();
        this._end = new KnotIndexIncreasingSequence(Infinity);
        this._period = RETURN_ERROR_CODE;
        for(let i = 0; i < knots.length; i++) {
            this.knotSequence.push(new Knot(knots[i], multiplicities[i]));
        }
        this._period = this.knotSequence[this.knotSequence.length - 1].abscissa - this.knotSequence[0].abscissa;
        if(knots.length < (this._degree + 2)) {
            const error = new ErrorLog(this.constructor.name, "constructor", "the knot number is not large enough to generate a B-Spline basis.");
            error.logMessageToConsole();
            return;
        }
        if(!subsequence) this.checkCurveOrigin();
        if(!subsequence) this.checkMultiplicityAtEndKnots();
        this.checkDegreeConsistency();
    }

    get allAbscissae(): number[] {
        const abscissae: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) abscissae.push(knot.abscissa);
        }
        return abscissae;
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

    deepCopy(): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(this._degree, this.distinctAbscissae(), this.multiplicities());
    }

    toIncreasingKnotSequence(): IncreasingPeriodicKnotSequenceClosedCurve {
        const knotAbscissae: number[] = [];
        for (const knot of this.knotSequence) {
            for(let i = 0; i < knot.multiplicity; i++) {
                knotAbscissae.push(knot.abscissa);
            }
        }
        return new IncreasingPeriodicKnotSequenceClosedCurve(this._degree, knotAbscissae);
    }

}