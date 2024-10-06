import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequence";
import { AbstractPeriodicKnotSequence } from "./AbstractPeriodicKnotSequence";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "./IncreasingPeriodicKnotSequenceClosedCurve";
import { Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "./StrictlyIncreasingOpenKnotSequenceClosedCurve";

export class StrictlyIncreasingPeriodicKnotSequenceClosedCurve extends AbstractPeriodicKnotSequence {

    protected knotSequence: Knot[];
    protected _index: KnotIndexIncreasingSequence;
    protected _end: KnotIndexIncreasingSequence;

    constructor(maxMultiplicityOrder: number, knots: number[], multiplicities: number[], subsequence: boolean = false) {
        super(maxMultiplicityOrder);
        this.knotSequence = [];
        this._index = new KnotIndexIncreasingSequence();
        this._end = new KnotIndexIncreasingSequence(Infinity);
        for(let i = 0; i < knots.length; i++) {
            this.knotSequence.push(new Knot(knots[i], multiplicities[i]));
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

    length(): number {
        return this.knotSequence.length;
    }

    deepCopy(): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, this.distinctAbscissae(), this.multiplicities());
    }

    abscissaAtIndex(index: KnotIndexStrictlyIncreasingSequence): number {
        let abscissa = RETURN_ERROR_CODE;
        const indexPeriod =  new KnotIndexStrictlyIncreasingSequence(index.knotIndex % (this.allAbscissae.length - 1));
        let i = 0;
        for(const knot of this) {
            if(i === indexPeriod.knotIndex && knot !== undefined) abscissa = knot.abscissa;
            i++;
        }
        return abscissa;
    }

    incrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number = 1): boolean {
        let increment = true;
        const indexPeriod =  new KnotIndexStrictlyIncreasingSequence(index.knotIndex % (this.allAbscissae.length - 1));
        if(indexPeriod.knotIndex < 0) {
            const error = new ErrorLog(this.constructor.name, "incrementKnotMultiplicity", "the index parameter is out of range. Cannot increment knot multiplicity.");
            error.logMessageToConsole();
            increment = false;
        } else {
            const indexWithinPeriod = index.knotIndex % (this.knotSequence.length - 1);
            this.knotSequence[indexPeriod.knotIndex].multiplicity += multiplicity;
            if(indexWithinPeriod === 0) this.knotSequence[this.knotSequence.length - 1].multiplicity += multiplicity;
            this.checkMaxMultiplicityOrderConsistency();
        }
        return increment;
    }

    toIncreasingKnotSequence(): IncreasingPeriodicKnotSequenceClosedCurve {
        const knotAbscissae: number[] = [];
        for (const knot of this.knotSequence) {
            for(let i = 0; i < knot.multiplicity; i++) {
                knotAbscissae.push(knot.abscissa);
            }
        }
        return new IncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, knotAbscissae);
    }

    toOpenKnotSequence(): StrictlyIncreasingOpenKnotSequenceClosedCurve {
        const knotsOpenSequence: number[] = [];
        const multiplicitiesOpenSequence: number[] = [];
        let knotNumber = 1;
        for( let i = 1; i <= (this._maxMultiplicityOrder - (this.knotSequence[0].multiplicity - 1)); i++) {
            for(let j = 0; j < this.knotSequence[this.knotSequence.length - 1 - i].multiplicity; j++) {
                if (knotNumber <= (this._maxMultiplicityOrder - (this.knotSequence[0].multiplicity - 1))) {
                    knotsOpenSequence.splice(0, 0,(this.knotSequence[this.knotSequence.length - 1 - i].abscissa - this.knotSequence[this.knotSequence.length - 1].abscissa));
                    multiplicitiesOpenSequence.push(this.knotSequence[this.knotSequence.length - 1 - i].multiplicity);
                } else break;
                knotNumber++;
            }
            if (knotNumber > (this._maxMultiplicityOrder - (this.knotSequence[0].multiplicity - 1))) break;
        }
        for(const knot of this) {
            if(knot !== undefined) {
                knotsOpenSequence.push(knot.abscissa);
                multiplicitiesOpenSequence.push(knot.multiplicity);
            }
        }
        knotNumber = 1;
        for(let i = 1; i <= (this._maxMultiplicityOrder - (this.knotSequence[0].multiplicity - 1)); i++) {
            for(let j = 0; j < this.knotSequence[0 + i].multiplicity; j++) {
                if (knotNumber <= (this._maxMultiplicityOrder - (this.knotSequence[0].multiplicity - 1))) {
                    knotsOpenSequence.push(this.knotSequence[this.knotSequence.length - 1].abscissa + (this.knotSequence[i].abscissa - this.knotSequence[0].abscissa));
                    multiplicitiesOpenSequence.push(this.knotSequence[i].multiplicity);
                } else break;
                knotNumber++;
            }
            if (knotNumber > (this._maxMultiplicityOrder - (this.knotSequence[0].multiplicity - 1))) break;
        }
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, knotsOpenSequence, multiplicitiesOpenSequence);
    }

    findSpan(u: number): KnotIndexStrictlyIncreasingSequence {
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
                    index++;
                    if(Math.abs(u - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                        if(knot.abscissa === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                            index = this.knotSequence.length - 1;
                        }
                        return new KnotIndexStrictlyIncreasingSequence(index - 1);
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
            return new KnotIndexStrictlyIncreasingSequence(index);
        }
        return new KnotIndexStrictlyIncreasingSequence(index);
    }

}