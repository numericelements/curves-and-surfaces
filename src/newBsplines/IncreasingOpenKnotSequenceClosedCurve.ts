import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequenceCurve";
import { IncreasingOpenKnotSequenceCurve } from "./IncreasingOpenKnotSequenceCurve";
import { Knot, KnotIndexIncreasingSequence } from "./Knot";

export class IncreasingOpenKnotSequenceClosedCurve extends IncreasingOpenKnotSequenceCurve {

    protected _index: KnotIndexIncreasingSequence;
    protected _end: KnotIndexIncreasingSequence;
    private indexKnotOrigin: number;

    constructor(degree: number, knots: number[]) {
        super(degree, knots);
        this.knotSequence = [];
        this._index = new KnotIndexIncreasingSequence();
        this._end = new KnotIndexIncreasingSequence(Infinity);
        this.indexKnotOrigin = 0;
        if(knots.length < 1) {
            const error = new ErrorLog(this.constructor.name, "constructor", "null length knot sequence cannot be processed.");
            error.logMessageToConsole();
        }
        this.knotSequence.push(new Knot(knots[0], 1));
        for(let i = 1; i < knots.length; i++) {
            if(knots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity++;
            } else {
                this.knotSequence.push(new Knot(knots[i], 1));
            }
        }
        this.checkCurveOrigin();
        this.checkDegreeConsistency();
        this.checkKnotIntervalConsistency();
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

    checkKnotIntervalConsistency(): void {
        let i = 0;
        if(this.knotSequence[0].multiplicity === (this._degree + 1) && this.knotSequence[this.knotSequence.length - 1].multiplicity === (this._degree + 1)) return;

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