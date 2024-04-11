import { AbstractPeriodicKnotSequence } from "./AbstractPeriodicKnotSequence";
import { Knot, KnotIndexIncreasingSequence } from "./Knot";

export class StrictlyIncreasingPeriodicKnotSequenceClosedCurve extends AbstractPeriodicKnotSequence {

    protected knotSequence: Knot[];
    protected _index: KnotIndexIncreasingSequence;
    protected _end: KnotIndexIncreasingSequence;

    constructor(degree: number, freeKnots: number[]) {
        super(degree);
        this.knotSequence = [];
        this._index = new KnotIndexIncreasingSequence();
        this._end = new KnotIndexIncreasingSequence(Infinity);
    }

    generateStrictlyIncreasingSequence(): {abscissae: number[], multiplicities: number[]} {
        const multiplicities: number[] = [];
        const knotAbscissae: number[] = [];
        let i = 0;
        // while(i < this._increasingSequence.length) {
        //     const multiplicity = this.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i));
        //     if(multiplicity > (this._degree + 1)) {
        //         const error = new ErrorLog(this.constructor.name, "generateStrictlyIncreasingSequence", "inconsistent order of multiplicity: too large.");
        //         error.logMessageToConsole();
        //     }
        //     multiplicities.push(multiplicity);
        //     knotAbscissae.push(this._increasingSequence[i]);
        //     i += multiplicity;
        // }
        return {
            abscissae: knotAbscissae,
            multiplicities: multiplicities
        }
    }
}