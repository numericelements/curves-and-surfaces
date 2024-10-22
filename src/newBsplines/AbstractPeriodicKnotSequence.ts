import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractKnotSequence, EM_SEQUENCE_ORIGIN_REMOVAL } from "./AbstractKnotSequence";
import { Knot, KnotIndexInterface, KnotIndexStrictlyIncreasingSequence } from "./Knot";


export abstract class AbstractPeriodicKnotSequence extends AbstractKnotSequence {

    protected abstract _uMax: number;
    protected _isKnotMultiplicityNonUniform: boolean;

    constructor(maxMultiplicityOrder: number) {
        super(maxMultiplicityOrder);
        this._isKnotMultiplicityNonUniform = false;
    }

    get isKnotMultiplicityNonUniform(): boolean {
        return this._isKnotMultiplicityNonUniform;
    }

    checkNonUniformKnotMultiplicityOrder(): void {
        this._isKnotMultiplicityNonUniform = false;
        if(this.knotSequence[0].multiplicity === this._maxMultiplicityOrder &&
            this.knotSequence[this.knotSequence.length - 1].multiplicity === this._maxMultiplicityOrder) this._isKnotMultiplicityNonUniform = true;
    }

    checkCurveOrigin(): void {
        if(this.knotSequence[0].abscissa !== 0.0) {
            const error = new ErrorLog(this.constructor.name, "checkCurveOrigin", "Inconsistent knot sequence origin. First knot abscissa must be 0.0");
            error.logMessage;
        }
    }

    checkMultiplicityAtEndKnots(): void {
        if(this.knotSequence[0].multiplicity !== this.knotSequence[this.knotSequence.length - 1].multiplicity) {
            const error = new ErrorLog(this.constructor.name, "checkMultiplicityAtEndKnots", "Multiplicities at end knots of the sequence differ. They must be equal to define a periodic sequence structure.");
            error.logMessage();
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
            error.logMessage();
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

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): void {
        this.strictlyIncKnotIndexInputParamAssessment(index, "decrementKnotMultiplicity");
        if(this.knotSequence[index.knotIndex].multiplicity === 1) {
            if(index.knotIndex === 0) {
                const error = new ErrorLog(this.constructor.name, "decrementKnotMultiplicity");
                error.addMessage(EM_SEQUENCE_ORIGIN_REMOVAL);
                console.log(error.generateMessageString());
                throw new RangeError(error.generateMessageString());
            }
            const abscissae = this.distinctAbscissae();
            const multiplicities = this.multiplicities();
            abscissae.splice(index.knotIndex, 1);
            multiplicities.splice(index.knotIndex, 1);
            this.knotSequence = [];
            let i = 0;
            for(const abscissa of abscissae) {
                const knot = new Knot(abscissa, multiplicities[i]);
                this.knotSequence.push(knot);
                i++;
            }
        } else {
            this.knotSequence[index.knotIndex].multiplicity--;
        }
        this.checkUniformityOfKnotSpacing();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

}