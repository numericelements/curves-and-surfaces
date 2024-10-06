import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequence";
import { AbstractIncreasingOpenKnotSequence } from "./AbstractIncreasingOpenKnotSequence";
import { Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "./StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "./IncreasingPeriodicKnotSequenceClosedCurve";
import { INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, IncreasingOpenKnotSequenceClosedCurve_type, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, INCREASINGOPENKNOTSUBSEQUENCECLOSEDCURVE } from "./KnotSequenceConstructorInterface";

export class IncreasingOpenKnotSequenceClosedCurve extends AbstractIncreasingOpenKnotSequence {

    private indexKnotOrigin: number;

    // constructor(maxMultiplicityOrder: number, knots: number[], subsequence: boolean = false) {
    //     super(maxMultiplicityOrder, knots);
    //     this.knotSequence = [];
    constructor(maxMultiplicityOrder: number, knotParameters: IncreasingOpenKnotSequenceClosedCurve_type) {
        super(maxMultiplicityOrder, knotParameters);
        this.indexKnotOrigin = RETURN_ERROR_CODE;
        // if(knots.length < 1) {
        //     const error = new ErrorLog(this.constructor.name, "constructor", "null length knot sequence cannot be processed.");
        //     error.logMessageToConsole();
        //     return;
        // }
        // this.knotSequence.push(new Knot(knots[0], 1));
        // for(let i = 1; i < knots.length; i++) {
        //     if(knots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
        //         this.knotSequence[this.knotSequence.length - 1].multiplicity++;
        //     } else if(knots[i] < this.knotSequence[this.knotSequence.length - 1].abscissa) {
        //         const error = new ErrorLog(this.constructor.name, "constructor", "knot abscissae must be increasing. This condition is not satisfied. Knot sequence cannot be created.");
        //         error.logMessageToConsole();
        //     } else {
        //         this.knotSequence.push(new Knot(knots[i], 1));
        //     }
        // }

        // The validity of the knot sequence should follow the given sequence of calls
        // to make sure that the sequence origin is correctly set first since it is used
        // when checking the degree consistency and knot multiplicities outside the effective curve interval
        if(knotParameters.type !== INCREASINGOPENKNOTSUBSEQUENCECLOSEDCURVE) this.checkCurveOrigin();
        // if(!subsequence) this.checkCurveOrigin();
        this.checkMaxMultiplicityOrderConsistency();
        if(knotParameters.type !== INCREASINGOPENKNOTSUBSEQUENCECLOSEDCURVE) this.checkKnotIntervalConsistency();
        // if(!subsequence) this.checkKnotIntervalConsistency();
        this.checkUniformity();
    }

    get freeKnots(): number [] {
        const freeKnots: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) freeKnots.push(knot);
        }
        freeKnots.splice(0, (this.indexKnotOrigin + this.knotSequence[this.indexKnotOrigin].multiplicity));
        freeKnots.splice(freeKnots.length - (this.indexKnotOrigin + this.knotSequence[this.indexKnotOrigin].multiplicity), (this.indexKnotOrigin + this.knotSequence[this.indexKnotOrigin].multiplicity));
        return freeKnots;
    }

    // Assumes that checkCurveOrigin has been called before to get a consistent index of curve origin with the knot location of abscisssa = 0.0
    checkKnotIntervalConsistency(): void {
        let i = 0;
        if(this.knotSequence[0].multiplicity >= (this._maxMultiplicityOrder) && this.knotSequence[this.knotSequence.length - 1].multiplicity >= (this._maxMultiplicityOrder + 1)) return;

        while(((i + 1) < (this.knotSequence.length - 2 - i) || i < (this._maxMultiplicityOrder - 1)) && this.knotSequence[i].abscissa !== 0.0
            && i < this.knotSequence.length - 1) {
            const interval1 = this.knotSequence[i + 1].abscissa - this.knotSequence[i].abscissa;
            const interval2 = this.knotSequence[this.knotSequence.length - i - 2].abscissa - this.knotSequence[this.knotSequence.length - 1 - i].abscissa;
            if(Math.abs(interval1 + interval2) > KNOT_COINCIDENCE_TOLERANCE) {
                const error = new ErrorLog(this.constructor.name, "checkKnotIntervalConsistency", "knot intervals are not symmetrically spread around the closure point. This sequence cannot be processed.");
                error.logMessageToConsole();
                return;
            }
            i++;
        }
        const indexKnotOrigin = i;
        i = 0;
        while(indexKnotOrigin - i !== 0 && (indexKnotOrigin + i + 1) < this.knotSequence.length && (indexKnotOrigin - i) > 0) {
            const interval1 = this.knotSequence[indexKnotOrigin + i + 1].abscissa - this.knotSequence[indexKnotOrigin + i].abscissa;
            const interval2 = this.knotSequence[indexKnotOrigin - (i + 1)].abscissa - this.knotSequence[indexKnotOrigin - i].abscissa;
            if(Math.abs(interval1 + interval2) > KNOT_COINCIDENCE_TOLERANCE) {
                const error = new ErrorLog(this.constructor.name, "checkKnotIntervalConsistency", "knot intervals are not symmetrically spread around the closure point (left hand side). This sequence cannot be processed.");
                error.logMessageToConsole();
                return;
            }
            i++;
        }
        i = 0;
        while(indexKnotOrigin - i !== 0 && (this.knotSequence.length - indexKnotOrigin + i) < this.knotSequence.length && this.knotSequence.length - indexKnotOrigin - i > 0) {
            const interval1 = this.knotSequence[this.knotSequence.length - indexKnotOrigin + i].abscissa - this.knotSequence[this.knotSequence.length - indexKnotOrigin + i - 1].abscissa;
            const interval2 = this.knotSequence[this.knotSequence.length - indexKnotOrigin - (i + 2)].abscissa - this.knotSequence[this.knotSequence.length - indexKnotOrigin - i - 1].abscissa;
            if(Math.abs(interval1 + interval2) > KNOT_COINCIDENCE_TOLERANCE) {
                const error = new ErrorLog(this.constructor.name, "checkKnotIntervalConsistency", "knot intervals are not symmetrically spread around the closure point (right hand side). This sequence cannot be processed.");
                error.logMessageToConsole();
                return;
            }
            i++;
        }
    }

    checkMaxMultiplicityOrderConsistency(): void {
        let i = 0;
        let cumulativeMultiplicity = 0;
        while(i !== this.indexKnotOrigin) {
            if(this.knotSequence[i].multiplicity !== 1) {
                const error = new ErrorLog(this.constructor.name, "checkDegreeConsistency", "inconsistent order of multiplicity of knots before the curve origin.");
                error.logMessageToConsole();
                return;
            }
            if(this.knotSequence[i].multiplicity !== this.knotSequence[this.knotSequence.length - 1 - i].multiplicity) {
                const error = new ErrorLog(this.constructor.name, "checkDegreeConsistency", "inconsistent order of multiplicity of knots located outside the interval of definition of the curve.");
                error.logMessageToConsole();
                return;
            }
            cumulativeMultiplicity += this.knotSequence[i].multiplicity;
            i++;
        }
        if(cumulativeMultiplicity !== this.indexKnotOrigin) {
            const error = new ErrorLog(this.constructor.name, "checkDegreeConsistency", "inconsistent order of multiplicity of knots contributing to the closure area of the curve.");
            error.logMessageToConsole();
            return;
        }
        for(const knot of this.knotSequence) {
            if(knot.multiplicity > this._maxMultiplicityOrder) {
                const error = new ErrorLog(this.constructor.name, "checkDegreeConsistency", "inconsistent order of multiplicity of a knot.");
                error.logMessageToConsole();
                return;
            }
        }
    }

    checkCurveOrigin(): void {
        let i = 0;
        let cumulativeMultiplicity = 0;
        while(cumulativeMultiplicity < this._maxMultiplicityOrder) {
            cumulativeMultiplicity += this.knotSequence[i].multiplicity;
            i++;
        }
        this.indexKnotOrigin = i - 1;
        if(this.knotSequence[this.indexKnotOrigin].abscissa !== 0.0) {
            const error = new ErrorLog(this.constructor.name, "checkCurveOrigin", "curve origin is not zero. Curve origin must be set to 0.0. Not able to process this not sequence.");
            error.logMessageToConsole();
        }
    }

    checkNonUniformStructure(): void {
        this._isNonUniform = false;
    }

    deepCopy(): IncreasingOpenKnotSequenceClosedCurve {
        // return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, this.allAbscissae);
        return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, freeknots: this.freeKnots});
    }

    toStrictlyIncreasingKnotSequence(): StrictlyIncreasingOpenKnotSequenceClosedCurve {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, this.distinctAbscissae(), this.multiplicities());
    }

    getIndexKnotOrigin(): KnotIndexIncreasingSequence {
        return new KnotIndexIncreasingSequence(this.indexKnotOrigin);
    }

    isAbscissaCoincidingWithKnot(abscissa: number): boolean {
        let coincident = false;
        let indexCoincidentKnot = 0;
        for(const knot of this.knotSequence) {
            if(Math.abs(abscissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE)
            {
                coincident = true; 
                break;
            }
            indexCoincidentKnot++;
        }
        if(coincident) {
            if(indexCoincidentKnot < this.indexKnotOrigin || indexCoincidentKnot > this.knotSequence.length - this.indexKnotOrigin - 1) {
                coincident = false;
                const error = new ErrorLog(this.constructor.name, "isAbscissaCoincidingWithKnot", "knot abscissa is outside the definition interval of the closed curve.");
                error.logMessageToConsole();
            }
        }
        return coincident;
    }

    getKnotMultiplicityAtCurveOrigin(): number {
        const multiplicity = this.knotSequence[this.indexKnotOrigin].multiplicity;
        return multiplicity;
    }

    findSpan(u: number): KnotIndexIncreasingSequence {
        let index = RETURN_ERROR_CODE;
        if (u < this.knotSequence[this.indexKnotOrigin].abscissa || u > this.knotSequence[this.knotSequence.length - this.indexKnotOrigin - 1].abscissa) {
            const error = new ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside valid span");
            error.logMessageToConsole();
        } else {
            if(this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                for(const knot of this.knotSequence) {
                    index += knot.multiplicity;
                    if(Math.abs(u - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                        if(knot.abscissa === this.knotSequence[this.knotSequence.length - this.indexKnotOrigin - 1].abscissa
                        && this.knotSequence[this.knotSequence.length - this.indexKnotOrigin - 1].multiplicity === this._maxMultiplicityOrder) {
                            index -= this.knotSequence[this.knotSequence.length - this.indexKnotOrigin - 1].multiplicity
                        }
                        if(this._isUniform && index === (this.knotSequence.length - this._maxMultiplicityOrder + 1)) index -= 1;
                        return new KnotIndexIncreasingSequence(index - 1);
                    }
                }
            }
            
            // Do binary search
            let low = this.indexKnotOrigin;
            let high = this.knotSequence.length - 1 - this.indexKnotOrigin;
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

    decrementMaxMultiplicityOrder(): IncreasingOpenKnotSequenceClosedCurve {
        const strictlyIncSeq = this.toStrictlyIncreasingKnotSequence();
        const strictlyIncSeq_Mult = strictlyIncSeq.multiplicities();
        const knotIdx_maxMultiplicityOrder: number[] = [];
        for(let i = 0; i < strictlyIncSeq_Mult.length; i++) {
            if(strictlyIncSeq_Mult[i] === this._maxMultiplicityOrder) knotIdx_maxMultiplicityOrder.push(i);
        }
        for(const multiplicity of knotIdx_maxMultiplicityOrder) {
            strictlyIncSeq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(multiplicity));
        }
        let newKnots: number[] = [];
        if(this._maxMultiplicityOrder > 2 || (this._maxMultiplicityOrder === 2 && 
            (knotIdx_maxMultiplicityOrder.length > 0 && knotIdx_maxMultiplicityOrder[0] !== this.indexKnotOrigin ||
            knotIdx_maxMultiplicityOrder.length === 0))) {
            const newIncKnotSeq = strictlyIncSeq.toIncreasingKnotSequence();
            newKnots = newIncKnotSeq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1),
                new KnotIndexIncreasingSequence(newIncKnotSeq.length() - 2));
        } else {
            // newKnots = new IncreasingOpenKnotSequenceClosedCurve(1, strictlyIncSeq.allAbscissae).allAbscissae;
            newKnots = new IncreasingOpenKnotSequenceClosedCurve(1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: strictlyIncSeq.allAbscissae}).allAbscissae;
        }
        // return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder - 1, newKnots);
        return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder - 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: newKnots});
    }

    toPeriodicKnotSequence(): IncreasingPeriodicKnotSequenceClosedCurve {
        const indexOrigin = this.getIndexKnotOrigin();
        const knotAbscissae = this.allAbscissae;
        knotAbscissae.splice(knotAbscissae.length - 1 - (indexOrigin.knotIndex - 1), indexOrigin.knotIndex);
        knotAbscissae.splice(0, indexOrigin.knotIndex);
        return new IncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, knotAbscissae);
    }
}