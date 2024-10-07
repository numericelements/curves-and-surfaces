import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequence";
import { AbstractPeriodicKnotSequence } from "./AbstractPeriodicKnotSequence";
import { IncreasingOpenKnotSequenceClosedCurve } from "./IncreasingOpenKnotSequenceClosedCurve";
import { Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from "./KnotSequenceConstructorInterface";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "./StrictlyIncreasingPeriodicKnotSequenceOpenCurve";

export class IncreasingPeriodicKnotSequenceClosedCurve extends AbstractPeriodicKnotSequence {

    protected knotSequence: Knot[];
    protected _index: KnotIndexIncreasingSequence;
    protected _uMax: number;

    constructor(maxMultiplicityOrder: number, knots: number[], subsequence: boolean = false) {
        super(maxMultiplicityOrder);
        this.knotSequence = [];
        this._index = new KnotIndexIncreasingSequence();
        this._uMax = 0;
        this.knotSequence.push(new Knot(knots[0], 1));
        for(let i = 1; i < knots.length; i++) {
            if(knots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity++;
            } else {
                this.knotSequence.push(new Knot(knots[i], 1));
            }
        }
        if(knots.length < (this._maxMultiplicityOrder + 2)) {
            const error = new ErrorLog(this.constructor.name, "constructor", "the knot number is not large enough to generate a B-Spline basis.");
            error.logMessageToConsole();
            return;
        }
        if(!subsequence) this.checkCurveOrigin();
        if(!subsequence) this.checkMultiplicityAtEndKnots();
        this.checkMaxMultiplicityOrderConsistency();
    }

    get allAbscissae(): number[] {
        const abscissae: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) abscissae.push(knot);
        }
        return abscissae;
    }

    [Symbol.iterator]() {
        let knotAmount = 0;
        const knotIndicesKnotAbscissaChange: number[] = [];
        for(const multiplicity of this.multiplicities()) {
            knotAmount = knotAmount + multiplicity;
            knotIndicesKnotAbscissaChange.push(knotAmount);
        }
        const lastIndex = new KnotIndexIncreasingSequence(knotAmount - 1);
        let indexAbscissaChange = new KnotIndexIncreasingSequence();
        return  {
            next: () => {
                if ( this._index.knotIndex <= lastIndex.knotIndex ) {
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

    deepCopy(): IncreasingPeriodicKnotSequenceClosedCurve {
        return new IncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, this.allAbscissae);
    }

    toStrictlyIncreasingKnotSequence(): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, this.distinctAbscissae(), this.multiplicities());
    }

    length(): number {
        let length = 0;
        for(const knot of this) {
            if(knot !== undefined) length++;
        }
        return length;
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

    toOpenKnotSequence(): IncreasingOpenKnotSequenceClosedCurve {
        const knotsOpenSequence: number[] = [];
        const multiplicityAtOrigin = this.knotSequence[0].multiplicity;
        let knotNumber = 1;
        for( let i = 1; i <= (this._maxMultiplicityOrder - (this.knotSequence[0].multiplicity - 1)); i++) {
            for(let j = 0; j < this.knotSequence[this.knotSequence.length - 1 - i].multiplicity; j++) {
                if (knotNumber <= (this._maxMultiplicityOrder - (this.knotSequence[0].multiplicity - 1)))
                    knotsOpenSequence.splice(0, 0,(this.knotSequence[this.knotSequence.length - 1 - i].abscissa - this.knotSequence[this.knotSequence.length - 1].abscissa));
                else break;
                knotNumber++;
            }
            if (knotNumber > (this._maxMultiplicityOrder - (this.knotSequence[0].multiplicity - 1))) break;
        }
        for(const knot of this) {
            if(knot !== undefined) knotsOpenSequence.push(knot);
        }
        knotNumber = 1;
        for(let i = 1; i <= (this._maxMultiplicityOrder - (this.knotSequence[0].multiplicity - 1)); i++) {
            for(let j = 0; j < this.knotSequence[0 + i].multiplicity; j++) {
                if (knotNumber <= (this._maxMultiplicityOrder - (this.knotSequence[0].multiplicity - 1)))
                    knotsOpenSequence.push(this.knotSequence[this.knotSequence.length - 1].abscissa + (this.knotSequence[i].abscissa - this.knotSequence[0].abscissa));
                else break;
                knotNumber++;
            }
            if (knotNumber > (this._maxMultiplicityOrder - (this.knotSequence[0].multiplicity - 1))) break;
        }
        // return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder + 1, knotsOpenSequence);
        return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotsOpenSequence});
    }

    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): void {
        if(index.knotIndex < 0) {
            const error = new ErrorLog(this.constructor.name, "raiseKnotMultiplicity", "Index value is out of range.");
            error.logMessageToConsole();
            return;
        }
        const indexWithinPeriod = index.knotIndex % (this.knotSequence.length - 1);
        this.knotSequence[indexWithinPeriod].multiplicity += multiplicity;
        if(indexWithinPeriod === 0) this.knotSequence[this.knotSequence.length - 1].multiplicity += multiplicity;
        this.checkUniformityOfKnotSpacing();
    }

    incrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number = 1): boolean {
        let increment = true;
        if(index.knotIndex < 0) {
            increment = false
            const error =  new ErrorLog(this.constructor.name, "incrementKnotMultiplicity", "negative index value. It cannot be processed");
            error.logMessageToConsole();
            return increment;
        }
        const indexWithinPeriod = index.knotIndex % (this.knotSequence.length - 1);
        this.knotSequence[indexWithinPeriod].multiplicity += multiplicity;
        if(indexWithinPeriod === 0) this.knotSequence[this.knotSequence.length - 1].multiplicity += multiplicity;
        this.checkMaxMultiplicityOrderConsistency();
        return increment;
    }

    knotMultiplicityAtAbscissa(abcissa: number): number {
        let multiplicity = 0;
        for(const knot of this.knotSequence) {
            if(Math.abs(abcissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                multiplicity = knot.multiplicity;
            }
        }
        if(multiplicity === 0) {
            const warning = new WarningLog(this.constructor.name, "knotMultiplicityAtAbscissa", "knot abscissa cannot be found within the knot sequence.");
            warning.logMessageToConsole();
        }
        return multiplicity;
    }

    insertKnot(abscissa: number, multiplicity: number = 1): boolean {
        let insertion = true;
        if(this.isAbscissaCoincidingWithKnot(abscissa)) {
            const warning = new WarningLog(this.constructor.name, "insertKnot", "abscissa is too close from an existing knot: raise multiplicity of an existing knot.");
            warning.logMessageToConsole();
            insertion = false;
            return insertion;
        } else if(multiplicity >= this._maxMultiplicityOrder) {
            const warning = new WarningLog(this.constructor.name, "insertKnot", "the order of multiplicity of the new knot is not compatible with the curve degree")
            warning.logMessageToConsole();
            insertion = false;
            return insertion;
        } else if(abscissa < this.knotSequence[0].abscissa || abscissa > this.knotSequence[this.knotSequence.length - 1].abscissa) {
            const warning = new WarningLog(this.constructor.name, "insertKnot", "the abscissa is out of the range of the knot sequence interval");
            warning.logMessageToConsole();
            insertion = false;
        }
        if(insertion) {
            const knot = new Knot(abscissa, multiplicity);
            let i = 0;
            while(i < (this.knotSequence.length - 1)) {
                if(this.knotSequence[i].abscissa < abscissa && abscissa < this.knotSequence[i + 1].abscissa) break;
                i++;
            }
            this.knotSequence.splice((i + 1), 0, knot);
            this.checkUniformityOfKnotSpacing();
        }
        return insertion;
    }

    abscissaAtIndex(index: KnotIndexIncreasingSequence): number {
        let abscissa = RETURN_ERROR_CODE;
        const multLastKnot = this.knotSequence[this.knotSequence.length - 1].multiplicity;
        const indexPeriod =  new KnotIndexIncreasingSequence(index.knotIndex % (this.allAbscissae.length - multLastKnot));
        let i = 0;
        for(const knot of this) {
            if(i === indexPeriod.knotIndex && knot !== undefined) abscissa = knot;
            i++;
        }
        return abscissa;
    }

    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence {
        const strictlyIncreasingKnotSequence = this.toStrictlyIncreasingKnotSequence();
        const lastIdxStrictIncSeq = strictlyIncreasingKnotSequence.allAbscissae.length - 1;
        const abscissa = this.abscissaAtIndex(index);
        let i = 0;
        for(const knot of strictlyIncreasingKnotSequence.allAbscissae) {
            if(knot !== undefined) {
                if(knot === abscissa) break;
                i++;
            }
        }
        if(index.knotIndex > (this.allAbscissae.length - 1)) i = i + lastIdxStrictIncSeq;
        return new KnotIndexStrictlyIncreasingSequence(i);
    }

    extractSubsetOfAbscissae(knotStart: KnotIndexIncreasingSequence, knotEnd: KnotIndexIncreasingSequence): number[] {
        let knots: number[] = [];
        const sequence = this.allAbscissae.slice();
        const lasIndex = this.allAbscissae.length - 1;
        const multFirstKnot = this.knotSequence[0].multiplicity;
        try{
            if(knotStart.knotIndex < 0) {
                const error = new ErrorLog(this.constructor.name, "extractSubsetOfAbscissae", "start index must be positive or null. Cannot perform the extraction.");
                throw(error.logMessage());
            }
            if(knotEnd.knotIndex <= knotStart.knotIndex) {
                const error = new ErrorLog(this.constructor.name, "extractSubsetOfAbscissae", "start index must be strictly lower than the end one. Cannot perform the extraction.");
                throw(error.logMessage());
            }
            if(knotStart.knotIndex > lasIndex) {
                const error = new ErrorLog(this.constructor.name, "extractSubsetOfAbscissae", "start index is out of range. No extraction is performed.");
                throw(error.logMessageToConsole());
            }
            if((knotEnd.knotIndex - knotStart.knotIndex) > (2 * lasIndex)) {
                const error = new ErrorLog(this.constructor.name, "extractSubsetOfAbscissae", "start and end indices span more than twice the period of the sequence. No extraction is performed.");
                throw(error.logMessageToConsole());
            }

            if(knotEnd.knotIndex > lasIndex) {
                for(let i = multFirstKnot; i < this.allAbscissae.length; i++) {
                    sequence.push(this.allAbscissae[i] + this.allAbscissae[lasIndex]);
                }
            }
            if(knotEnd.knotIndex >= (2 * lasIndex)) {
                for(let i = multFirstKnot; i < this.allAbscissae.length; i++) {
                    sequence.push(this.allAbscissae[i] + 2 * this.allAbscissae[lasIndex]);
                }
            }
            knots = sequence.slice(knotStart.knotIndex, knotEnd.knotIndex + 1);
            return knots;
        } catch(error) {
            console.error(error);
            return knots;
        }

    }

    findSpan(u: number): KnotIndexIncreasingSequence {
        let index = RETURN_ERROR_CODE;
        if(u > this.knotSequence[this.knotSequence.length - 1].abscissa) {
            u = u % this.getPeriod();
        }
        if (u < this.knotSequence[0].abscissa) {
            console.log(u);
            const error = new ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside valid span");
            error.logMessageToConsole();
        } else {
            if(this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                for(const knot of this.knotSequence) {
                    index += knot.multiplicity;
                    if(Math.abs(u - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                        if(knot.abscissa === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                            index -= this.knotSequence[this.knotSequence.length - 1].multiplicity
                        }
                        return new KnotIndexIncreasingSequence(index - 1);
                    }
                }
            }
            // Do binary search
            let low = 0;
            let high = this.knotSequence.length - 1;
            index = Math.floor((low + high) / 2);
        
            while (!(this.knotSequence[index].abscissa < u && u < this.knotSequence[index + 1].abscissa)) {
                if (u < this.knotSequence[index].abscissa) {
                    high = index;
                } else {
                    low = index;
                }
                index = Math.floor((low + high) / 2);
            }
            let indexSeq = 0;
            for(let i = 0; i < (index + 1); i++) {
                indexSeq += this.knotSequence[i].multiplicity; 
            }
            index = indexSeq - 1;
            return new KnotIndexIncreasingSequence(index);
        }
        return new KnotIndexIncreasingSequence(index);
    }
}