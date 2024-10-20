import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { KNOT_COINCIDENCE_TOLERANCE, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "./AbstractKnotSequence";
import { AbstractPeriodicKnotSequence } from "./AbstractPeriodicKnotSequence";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "./IncreasingPeriodicKnotSequenceClosedCurve";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { INCREASINGPERIODICKNOTSEQUENCE, NO_KNOT_PERIODIC_CURVE, StrictIncreasingPeriodicKnotSequenceClosedCurve_type, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGPERIODICKNOTSEQUENCE, UNIFORM_PERIODICKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "./StrictlyIncreasingOpenKnotSequenceClosedCurve";

export class StrictlyIncreasingPeriodicKnotSequenceClosedCurve extends AbstractPeriodicKnotSequence {

    protected knotSequence: Knot[];
    protected _uMax: number;

    constructor(maxMultiplicityOrder: number, knotsParameters: StrictIncreasingPeriodicKnotSequenceClosedCurve_type) {
        super(maxMultiplicityOrder);
        this.knotSequence = [];
        this._uMax = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if(knotsParameters.type === NO_KNOT_PERIODIC_CURVE) {
        
        } else if(knotsParameters.type === UNIFORM_PERIODICKNOTSEQUENCE) {
            
        } else if(knotsParameters.type === STRICTLYINCREASINGPERIODICKNOTSEQUENCE) {
            for(let i = 0; i < knotsParameters.periodicKnots.length; i++) {
                this.knotSequence.push(new Knot(knotsParameters.periodicKnots[i], knotsParameters.multiplicities[i]));
            }
            if(knotsParameters.periodicKnots.length < (this._maxMultiplicityOrder + 2)) {
                const error = new ErrorLog(this.constructor.name, "constructor", "the knot number is not large enough to generate a B-Spline basis.");
                error.logMessage();
                return;
            }
            if(!(knotsParameters.type === STRICTLYINCREASINGPERIODICKNOTSEQUENCE)) this.checkCurveOrigin();
            if(!(knotsParameters.type === STRICTLYINCREASINGPERIODICKNOTSEQUENCE)) this.checkMultiplicityAtEndKnots();
            this.checkMaxMultiplicityOrderConsistency();
        }
    }

    get allAbscissae(): number[] {
        const abscissae: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) abscissae.push(knot.abscissa);
        }
        return abscissae;
    }

    [Symbol.iterator]() {
        const lastIndex = this.knotSequence.length - 1;
        let index = 0;
        return  {
            next: () => {
                if ( index <= lastIndex ) {
                    const abscissa = this.knotSequence[index].abscissa;
                    const multiplicity = this.knotSequence[index].multiplicity;
                    index++;
                    return { value: {abscissa: abscissa, multiplicity: multiplicity}, done: false };
                } else {
                    index = 0;
                    return { done: true };
                }
            }
        }
    }

    length(): number {
        return this.knotSequence.length;
    }

    deepCopy(): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: this.distinctAbscissae(), multiplicities: this.multiplicities()});
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
            error.logMessage();
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
        return new IncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotAbscissae});
    }

    toOpenKnotSequence(): StrictlyIncreasingOpenKnotSequenceClosedCurve {
        const knotsOpenSequence: number[] = [];
        const multiplicitiesOpenSequence: number[] = [];
        let nbComplementaryKnots = this._maxMultiplicityOrder;
        let index = this.knotSequence.length - 2;
        let cumulativeMultiplicity = this.knotSequence[index].multiplicity;
        while(cumulativeMultiplicity <= this._maxMultiplicityOrder) {
            if(this.knotSequence[index].multiplicity > 1) nbComplementaryKnots = nbComplementaryKnots - (this.knotSequence[index].multiplicity - 1);
            index--;
            cumulativeMultiplicity = cumulativeMultiplicity + this.knotSequence[index].multiplicity;
        }
        for( let i = 1; i <= (nbComplementaryKnots - (this.knotSequence[0].multiplicity - 1)); i++) {
            knotsOpenSequence.splice(0, 0,(this.knotSequence[this.knotSequence.length - 1 - i].abscissa - this.knotSequence[this.knotSequence.length - 1].abscissa));
            multiplicitiesOpenSequence.push(this.knotSequence[this.knotSequence.length - 1 - i].multiplicity);
        }
        for(const knot of this) {
            if(knot !== undefined) {
                knotsOpenSequence.push(knot.abscissa);
                multiplicitiesOpenSequence.push(knot.multiplicity);
            }
        }
        nbComplementaryKnots = this._maxMultiplicityOrder;
        index = 1;
        cumulativeMultiplicity = this.knotSequence[index].multiplicity;
        while(cumulativeMultiplicity <= this._maxMultiplicityOrder) {
            if(this.knotSequence[index].multiplicity > 1) nbComplementaryKnots = nbComplementaryKnots - (this.knotSequence[index].multiplicity - 1);
            index++;
            cumulativeMultiplicity = cumulativeMultiplicity + this.knotSequence[index].multiplicity;
        }
        for(let i = 1; i <= (nbComplementaryKnots - (this.knotSequence[0].multiplicity - 1)); i++) {
            knotsOpenSequence.push(this.knotSequence[this.knotSequence.length - 1].abscissa + (this.knotSequence[i].abscissa - this.knotSequence[0].abscissa));
            multiplicitiesOpenSequence.push(this.knotSequence[i].multiplicity);
        }
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: knotsOpenSequence, multiplicities: multiplicitiesOpenSequence});
    }

    findSpan(u: number): KnotIndexStrictlyIncreasingSequence {
        let index = RETURN_ERROR_CODE;
        if(u > this.knotSequence[this.knotSequence.length - 1].abscissa) {
            u = u % this.getPeriod();
        }
        if (u < this.knotSequence[0].abscissa) {
            console.log(u);
            const error = new ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside valid span");
            error.logMessage();
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