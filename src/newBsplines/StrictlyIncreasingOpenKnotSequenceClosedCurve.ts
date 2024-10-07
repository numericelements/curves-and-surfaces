import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequence";
import { IncreasingOpenKnotSequenceClosedCurve } from "./IncreasingOpenKnotSequenceClosedCurve";
import { Knot, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { AbstractStrictlyIncreasingOpenKnotSequence } from "./AbstractStrictlyIncreasingOpenKnotSequence";
import { INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from "./KnotSequenceConstructorInterface";

export class StrictlyIncreasingOpenKnotSequenceClosedCurve extends AbstractStrictlyIncreasingOpenKnotSequence {

    protected knotSequence: Knot[];
    protected indexKnotOrigin: number;

    constructor(maxMultiplicityOrder: number, knots: number[], multiplicities: number[]) {
        super(maxMultiplicityOrder, knots, multiplicities);
        this.knotSequence = [];
        this.indexKnotOrigin = RETURN_ERROR_CODE;
        if(knots.length !== multiplicities.length) {
            const error = new ErrorLog(this.constructor.name, "constructor", "size of multiplicities array does not match the size of knot abscissae array.");
            error.logMessageToConsole();
        }
        for(let i = 0; i < knots.length; i++) {
            if(this.knotSequence.length === 0) {
                this.knotSequence.push(new Knot(knots[i], multiplicities[i]));
            } else if(!this.isAbscissaCoincidingWithKnot(knots[i]) && knots[i] > this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.knotSequence.push(new Knot(knots[i], multiplicities[i]));
            } else {
                const error = new ErrorLog(this.constructor.name, "constructor", "knot abscissa cannot be duplicated and must be increasing. These conditions are not satisfied. Knot sequence cannot be created.");
                error.logMessageToConsole();
            }
        }
        // The validity of the knot sequence should follow the given sequence of calls
        // to make sure that the sequence origin is correctly set first since it is used
        // when checking the degree consistency and knot multiplicities outside the effective curve interval
        this.checkCurveOrigin();
        this.checkMaxMultiplicityOrderConsistency();
        this.checkKnotIntervalConsistency();
        this.checkUniformityOfKnotSpacing();
        this.checkNonUniformKnotMultiplicityOrder();
    }

    get freeKnots(): number [] {
        const freeKnots: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) freeKnots.push(knot.abscissa);
        }
        freeKnots.splice(0, this.indexKnotOrigin + 1);
        freeKnots.splice(freeKnots.length - this.indexKnotOrigin - 1, this.indexKnotOrigin + 1);
        return freeKnots;
    }

    checkNonUniformKnotMultiplicityOrder(): void {
        this._isNonUniform = false;
    }

    checkKnotIntervalConsistency(): void {
        let i = 0;
        if(this.knotSequence[0].multiplicity >= this._maxMultiplicityOrder && this.knotSequence[this.knotSequence.length - 1].multiplicity >= this._maxMultiplicityOrder) return;

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

    getIndexKnotOrigin(): KnotIndexStrictlyIncreasingSequence {
        return new KnotIndexStrictlyIncreasingSequence(this.indexKnotOrigin);
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

    toIncreasingKnotSequence(): IncreasingOpenKnotSequenceClosedCurve {
        const knotAbscissae: number[] = [];
        for (const knot of this.knotSequence) {
            for(let i = 0; i < knot.multiplicity; i++) {
                knotAbscissae.push(knot.abscissa);
            }
        }
        // return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, knotAbscissae);
        return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotAbscissae});
    }

    // This index transformation is not unique. The convention followed here is the assignment of the first index of the increasing
    // sequence where the abscissa at index (sttrictly increasing sequence) appears
    toKnotIndexIncreasingSequence(index: KnotIndexStrictlyIncreasingSequence): KnotIndexIncreasingSequence {
        let indexIncSeq = 0;
        for(let i = 0; i < index.knotIndex; i++) {
            indexIncSeq += this.knotSequence[i].multiplicity;
        }
        // if(index.knotIndex !== 0) indexIncSeq++;
        return new KnotIndexIncreasingSequence(indexIncSeq);
    }

    deepCopy(): StrictlyIncreasingOpenKnotSequenceClosedCurve {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, this.distinctAbscissae(), this.multiplicities());
    }

    findSpan(u: number): KnotIndexStrictlyIncreasingSequence {
        let index = RETURN_ERROR_CODE;
        if (u < this.knotSequence[this.indexKnotOrigin].abscissa || u > this.knotSequence[this.knotSequence.length - this.indexKnotOrigin - 1].abscissa) {
            const error = new ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside valid span");
            error.logMessageToConsole();
        } else {
            if(this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                for(const knot of this.knotSequence) {
                    index ++;
                    if(Math.abs(u - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                        if(knot.abscissa === this.knotSequence[this.knotSequence.length - this.indexKnotOrigin - 1].abscissa) {
                            index = this.knotSequence.length - this.indexKnotOrigin - 1;
                        }
                        return new KnotIndexStrictlyIncreasingSequence(index - 1);
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
            return new KnotIndexStrictlyIncreasingSequence(index);
        }
        return new KnotIndexStrictlyIncreasingSequence(index);
    }
}