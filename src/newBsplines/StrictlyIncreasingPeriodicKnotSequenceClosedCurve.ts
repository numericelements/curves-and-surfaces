import { AbstractPeriodicKnotSequence } from "./AbstractPeriodicKnotSequence";
import { Knot, KnotIndexIncreasingSequence } from "./Knot";

export class StrictlyIncreasingPeriodicKnotSequenceClosedCurve extends AbstractPeriodicKnotSequence {

    protected knotSequence: Knot[];
    protected _uMax: number;

    constructor(maxMultiplicityOrder: number, freeKnots: number[]) {
        super(maxMultiplicityOrder);
        this.knotSequence = [];
        this._uMax = 0;
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