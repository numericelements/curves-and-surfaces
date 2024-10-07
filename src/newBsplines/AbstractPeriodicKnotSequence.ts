import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractKnotSequence } from "./AbstractKnotSequence";
import { KnotIndexIncreasingSequence, KnotIndexInterface, KnotIndexStrictlyIncreasingSequence } from "./Knot";


export abstract class AbstractPeriodicKnotSequence extends AbstractKnotSequence {

    protected abstract _index: KnotIndexInterface;
    protected abstract _uMax: number;


    checkCurveOrigin(): void {
        if(this.knotSequence[0].abscissa !== 0.0) {
            const error = new ErrorLog(this.constructor.name, "checkCurveOrigin", "Inconsistent knot sequence origin. First knot abscissa must be 0.0");
            error.logMessageToConsole;
        }
    }

    checkMultiplicityAtEndKnots(): void {
        if(this.knotSequence[0].multiplicity !== this.knotSequence[this.knotSequence.length - 1].multiplicity) {
            const error = new ErrorLog(this.constructor.name, "checkMultiplicityAtEndKnots", "Multiplicities at end knots of the sequence differ. They must be equal to define a periodic sequence structure.");
            error.logMessageToConsole();
        }
    }

    checkMaxMultiplicityOrderConsistency(): void {
        for (const knot of this.knotSequence) {
            if(knot.multiplicity >= this._maxMultiplicityOrder) {
                const error = new ErrorLog(this.constructor.name, "checkDegreeConsistency", "inconsistent order of multiplicity of a knot: too large for a periodic knot sequence of the prescribed maximum order of multiplicity.");
                error.logMessageToConsole();
            }
        }
    }

    getPeriod(): number {
        let period = RETURN_ERROR_CODE;
         return period = this.knotSequence[this.knotSequence.length - 1].abscissa - this.knotSequence[0].abscissa;
    }

    lastKnot(): number {
        return this.knotSequence[this.knotSequence.length - 1].abscissa;
    }

    length(): number {
        return this.knotSequence.length;
    }

    incrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number = 1): boolean {
        let increment = true;
        if(index.knotIndex < 0 || index.knotIndex > (this.knotSequence.length - 1)) {
            const error = new ErrorLog(this.constructor.name, "incrementKnotMultiplicity", "the index parameter is out of range. Cannot increment knot multiplicity.");
            error.logMessageToConsole();
            increment = false;
        } else {
            this.knotSequence[index.knotIndex].multiplicity += multiplicity;
            if(index.knotIndex === 0) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity += multiplicity;
            } else if(index.knotIndex === (this.knotSequence.length - 1)) {
                this.knotSequence[0].multiplicity += multiplicity;
            }
            this.checkMaxMultiplicityOrderConsistency();
        }
        return increment;
    }

}