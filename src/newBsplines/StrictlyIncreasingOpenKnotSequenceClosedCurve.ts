import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequenceCurve";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "./KnotSequence";
import { StrictlyIncreasingOpenKnotSequenceCurve } from "./StrictlyIncreasingOpenKnotSequenceCurve";

export class StrictlyIncreasingOpenKnotSequenceClosedCurve extends StrictlyIncreasingOpenKnotSequenceCurve {

    protected knotSequence: Knot[];
    protected _index: KnotIndexStrictlyIncreasingSequence;
    protected _end: KnotIndexStrictlyIncreasingSequence;
    protected indexKnotOrigin: number;

    constructor(degree: number, knots: number[], multiplicities: number[]) {
        super(degree, knots, multiplicities);
        this.knotSequence = [];
        this._index = new KnotIndexStrictlyIncreasingSequence();
        this._end = new KnotIndexStrictlyIncreasingSequence(Infinity);
        this.indexKnotOrigin = 0;
        if(knots.length !== multiplicities.length) {
            const error = new ErrorLog(this.constructor.name, "constructor", "size of multiplicities array does not the size of knot abscissae array.");
            error.logMessageToConsole();
        }
        for(let i = 0; i < knots.length; i++) {
            this.knotSequence.push(new Knot(knots[i], multiplicities[i]));
        }
        this.checkKnotIntervalConsistency();
        this.checkCurveOrigin();
        this.checkDegreeConsistency();
    }

    get freeKnots(): number [] {
        const freeKnots: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) freeKnots.push(knot.abscissa);
        }
        freeKnots.splice(0, this.indexKnotOrigin);
        freeKnots.splice(this.freeKnots.length - 2 * this.indexKnotOrigin, this.indexKnotOrigin);
        return this.freeKnots;
    }

    checkKnotIntervalConsistency(): void {
        let i = 0;
        while(((i + 1) < (this.knotSequence.length - 2 - i) || i < this._degree) && this.knotSequence[i + 1].abscissa !== 0.0) {
            const interval1 = this.knotSequence[i + 1].abscissa - this.knotSequence[i].abscissa;
            const interval2 = this.knotSequence[this.knotSequence.length - i - 2].abscissa - this.knotSequence[this.knotSequence.length - 1 - i].abscissa;
            if(Math.abs(interval1 - interval2) > KNOT_COINCIDENCE_TOLERANCE) {
                const error = new ErrorLog(this.constructor.name, "checkKnotIntervalConsistency", "knot intervals are not symmetrically spread around the closure point. This sequence cannot be processed.");
                error.logMessageToConsole();
            }
            i++;
        }
        const indexKnotOrigin = i + 1;
        i = 0;
        while(indexKnotOrigin - i + 1 !== 0) {
            const interval1 = this.knotSequence[indexKnotOrigin + i + 1].abscissa - this.knotSequence[indexKnotOrigin + i].abscissa;
            const interval2 = this.knotSequence[indexKnotOrigin - (i + 1)].abscissa - this.knotSequence[indexKnotOrigin - i].abscissa;
            if(Math.abs(interval1 - interval2) > KNOT_COINCIDENCE_TOLERANCE) {
                const error = new ErrorLog(this.constructor.name, "checkKnotIntervalConsistency", "knot intervals are not symmetrically spread around the closure point. This sequence cannot be processed.");
                error.logMessageToConsole();
            }
            i++;
        }
    }

    checkDegreeConsistency(): void {
        let i = 0;
        let cumulativeMultiplicity = 0;
        while(i !== this.indexKnotOrigin) {
            cumulativeMultiplicity += this.knotSequence[i].multiplicity;
            i++;
        }
        if(cumulativeMultiplicity !== this.indexKnotOrigin) {
            const error = new ErrorLog(this.constructor.name, "checkDegreeConsistency", "inconsistent order of multiplicity of knots contributing to the closure area of the curve.");
            error.logMessageToConsole();
        }
        for(const knot of this.knotSequence) {
            if(knot.multiplicity > (this._degree + 1)) {
                const error = new ErrorLog(this.constructor.name, "checkDegreeConsistency", "inconsistent order of multiplicity of a knot.");
                error.logMessageToConsole();
            }
        }
    }

    checkCurveOrigin(): void {
        let i = 0;
        let cumulativeMultiplicity = 0;
        while(cumulativeMultiplicity < this._degree) {
            cumulativeMultiplicity += this.knotSequence[i].multiplicity;
            i++;
        }
        this.indexKnotOrigin = i;
        if(this.knotSequence[i].abscissa !== 0.0) {
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
            if(indexCoincidentKnot < this.indexKnotOrigin) {
                coincident = false;
                const error = new ErrorLog(this.constructor.name, "isAbscissaCoincidingWithKnot", "knot abscissa is outside the definition interval of the closed curves.");
                error.logMessageToConsole();
            }
        }
        return coincident;
    }

    getKnotMultiplicityAtCurveOrigin(): number {
        const multiplicity = this.knotSequence[this.indexKnotOrigin].multiplicity;
        return multiplicity;
    }
}