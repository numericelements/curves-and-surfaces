import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { intervalLocation } from "../sequenceOfDifferentialEvents/LocalizerOfDifferentialEvents";

const KNOT_COINCIDENCE_TOLERANCE = 10-8;

export abstract class KnotSequenceCurve {

    protected abstract _increasingSequence: number[];
    protected abstract _strictlyIncreasingSequence: number[];
    protected abstract _knotMultiplicities: number[];
    protected _degree: number;
    protected _start: number;
    protected _end: number;
    protected interval: number;

    constructor(knots: number[], degree: number, multiplicities?: number[]) {
        this._degree = degree;
        this._start = 0;
        this._end = Infinity;
        this.interval = 1;
    }

    get degree() {
        return this._degree;
    }

    get start() {
        return this._start;
    }

    get end() {
        return this._end;
    }

    abstract get increasingSequence(): number[];
    abstract get strictlyIncreasingSequence(): number[];
    abstract get knotMultiplicities(): number[];

    abstract generateStrictlyIncreasingSequence(): {abscissae: number[], multiplicities: number[]};
    abstract generateIncreasingSequence(): number[];
    abstract checkDegreeConsistency(): void;
    abstract checkCurveOrigin(): void;
    abstract isAbscissaCoincidingWithKnot(u: number): boolean;

    [Symbol.iterator]() {
        let counter = 0;
        let nextIndex = this.start;
        return  {
            next: () => {
                if ( nextIndex <= this.end ) {
                    let result = { value: nextIndex,  done: false }
                    nextIndex += this.interval;
                    counter++;
                    return result;
                }
                return { value: counter, done: true };
            }
        }
    }

    checkSizeConsistency(): void {
        let size = 0;
        for (const multiplicity of this._knotMultiplicities) {
            size += multiplicity;
        }
        if(size !== this._increasingSequence.length) {
            const error = new ErrorLog(this.constructor.name, "checkSizeConsistency", "increasing knot sequence size incompatible with the multiplicity orders of the strictly increasing sequence.");
            error.logMessageToConsole();
        }
    }

    isKnotlMultiplicityZero(u: number): boolean {
        let multiplicityZero = true;
        if(this.isAbscissaCoincidingWithKnot(u)) multiplicityZero = false;
        return multiplicityZero;
    }

    knotMultiplicity(index: number): number {
        let result: number = 0;
        let i = 0;
        while (this._increasingSequence[index + i] === this._increasingSequence[index]) {
            i -= 1;
            result += 1;
            if (index + i < 0) {
                break;
            }
        }
        return result;
    }
}

export class KnotSequenceOpenCurve extends KnotSequenceCurve {

    protected _increasingSequence: number[];
    protected _strictlyIncreasingSequence: number[];
    protected _knotMultiplicities: number[];

    constructor(knots: number[], degree: number, multiplicities?: number[]) {
        super(knots, degree, multiplicities);
        if(multiplicities === undefined) {
            this._increasingSequence = [...knots];
            const seq = this.generateStrictlyIncreasingSequence();
            this._strictlyIncreasingSequence = seq.abscissae;
            this._knotMultiplicities = seq.multiplicities;
            this.checkDegreeConsistency();
        } else {
            this._strictlyIncreasingSequence = [...knots];
            if(knots.length !== multiplicities.length) {
                const error = new ErrorLog(this.constructor.name, "constructor", "size of multiplicities array does not the size of knot abscissae array.");
                error.logMessageToConsole();
            }
            this._knotMultiplicities = [...multiplicities];
            this._increasingSequence = this.generateIncreasingSequence();
        }
    }

    get increasingSequence() {
        let result = [...this._increasingSequence];
        return result;
    }

    get strictlyIncreasingSequence() {
        let result = [...this._strictlyIncreasingSequence];
        return result;
    }

    get knotMultiplicities() {
        let result = [...this._knotMultiplicities];
        return result;
    }

    generateStrictlyIncreasingSequence(): {abscissae: number[], multiplicities: number[]} {
        const multiplicities: number[] = [];
        const knotAbscissae: number[] = [];
        let i = 0;
        while(i < this._increasingSequence.length) {
            const multiplicity = this.knotMultiplicity(i);
            if(multiplicity > (this._degree + 1)) {
                const error = new ErrorLog(this.constructor.name, "generateStrictlyIncreasingSequence", "inconsistent order of multiplicity: too large.");
                error.logMessageToConsole();
            }
            multiplicities.push(multiplicity);
            knotAbscissae.push(this._increasingSequence[i]);
            i += multiplicity;
        }
        return {
            abscissae: knotAbscissae,
            multiplicities: multiplicities
        }
    }

    generateIncreasingSequence(): number[] {
        const result: number[] = [];
        for (const abscissa of this._strictlyIncreasingSequence) {
            for(let i = 0; i < this._knotMultiplicities[abscissa]; i++) {
                result.push(abscissa);
            }
        }
        return result;
    }

    checkDegreeConsistency(): void {
        for (const multiplicity of this._knotMultiplicities) {
            if(multiplicity > (this._degree + 1)) {
                const error = new ErrorLog(this.constructor.name, "checkDegreeConsistency", "inconsistent order of multiplicity: too large.");
                error.logMessageToConsole();
            }
        }
    }

    checkCurveOrigin(): void {
        if(this._increasingSequence[0] !== 0.0) {
            const error = new ErrorLog(this.constructor.name, "checkCurveOrigin", "curve origin is not zero. Curve origin must be set to 0.0. Not able to process this not sequence.");
            error.logMessageToConsole();
        }
    }

    isAbscissaCoincidingWithKnot(u: number): boolean {
        let coincident = false;
        for(let knot of this._strictlyIncreasingSequence) {
            if(Math.abs(u - knot) < KNOT_COINCIDENCE_TOLERANCE) coincident = true;
        }
        return coincident;
    }

    getMultiplicityOfKnotAt(abcissa: number): number {
        let multiplicity = 0;
        for(let j = 0; j < this._strictlyIncreasingSequence.length; j++) {
            if(Math.abs(abcissa - this._strictlyIncreasingSequence[j]) < KNOT_COINCIDENCE_TOLERANCE) {
                multiplicity = this._knotMultiplicities[j];
            }
        }
        if(multiplicity === 0) {
            const warning = new WarningLog(this.constructor.name, "getMultiplicityOfKnotAt", "knot abscissa does not cannot be found within the knot sequence.");
            warning.logMessageToConsole();
        }
        return multiplicity;
    }

    insertKnot(abscissa: number, multiplicity: number = 1): boolean {
        let insertion = true;
        for (const knot of this._strictlyIncreasingSequence) {
            if(Math.abs(knot - abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                const warning = new WarningLog(this.constructor.name, "insertKnot", "abscissa is too close from an existing knot: raise multiplicity of an existing knot.");
                warning.logMessageToConsole();
                insertion = false;
                break;
            }
        }
        if(insertion) {
            if(abscissa < this._strictlyIncreasingSequence[0]) {
                this._strictlyIncreasingSequence.splice(0, 0, abscissa);
                this._knotMultiplicities.splice(0, 0, multiplicity);
                for(let i = 0; i < multiplicity; i++) {
                    this._increasingSequence.splice(0, 0, abscissa);
                }
            } else {
                let i = 0;
                while(this._strictlyIncreasingSequence[i] < abscissa && (! (abscissa < this._strictlyIncreasingSequence[i + 1])) && i < (this._strictlyIncreasingSequence.length - 1)) {
                    i++;
                }
                if(i = (this._strictlyIncreasingSequence.length - 1)) {
                    this._strictlyIncreasingSequence.push(abscissa);
                    this._knotMultiplicities.push(multiplicity);
                    for(let i = 0; i < multiplicity; i++) {
                        this._increasingSequence.push(abscissa);
                    }
                } else {
                    this._strictlyIncreasingSequence.splice(i, 0, abscissa);
                    this._knotMultiplicities.splice(i, 0, multiplicity);
                    let index = 0;
                    for(let k = 0; k <= i; k++) {
                        index += this._knotMultiplicities[k];
                    }
                    for(let j = 0; j < multiplicity; j++) {
                        this._increasingSequence.splice(index - 1 + j, 0, abscissa);
                    }
                }
            }
            this.checkSizeConsistency();
        }
        return insertion;
    }

    incrementKnotMultiplicity(index: number, multiplicity: number = 1): boolean {
        let increment = true;
        if(index < 0 || index > (this._knotMultiplicities.length - 1)) {
            const error = new ErrorLog(this.constructor.name, "incrementKnotMultiplicity", "the index parameter is out of range. Cannot increment knot multiplicity.");
            error.logMessageToConsole();
            increment = false;
        } else {
            let knotInd = 0;
            for(let k = 0; k < index; k++) {
                knotInd += this._knotMultiplicities[k];
            }
            const knotAbsc = this._increasingSequence[knotInd];
            for(let j = 0; j < multiplicity; j++) {
                this._increasingSequence.splice(knotInd + j, 0, knotAbsc);
            }
            this._knotMultiplicities[index] += multiplicity;
            this.checkSizeConsistency();
        }
        return increment;
    }

    findSpan(u: number): number {
        let index = -1;
        if (u < this._strictlyIncreasingSequence[0] || u > this._strictlyIncreasingSequence[this._strictlyIncreasingSequence.length - 1]) {
            console.log(u);
            const error = new ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside valid span");
            error.logMessageToConsole();
        } else {
            if(Math.abs(u - this._strictlyIncreasingSequence[0]) < KNOT_COINCIDENCE_TOLERANCE) {
                index = 0;
                return index;
            } else {
                index = 0;
                for(let j = 1; j < this._strictlyIncreasingSequence.length; j++) {
                    index += this._knotMultiplicities[j];
                    if(Math.abs(u - this._strictlyIncreasingSequence[j]) < KNOT_COINCIDENCE_TOLERANCE) {
                        return index;
                    }
                }
            }
            // Do binary search
            let low = 0;
            let high = this._increasingSequence[this._increasingSequence.length - 1] - 1 - this._degree;
            index = Math.floor((low + high) / 2);
        
            while (!(this._increasingSequence[index] < u && u < this._increasingSequence[index + 1])) {
                if (u < this._increasingSequence[index]) {
                    high = index;
                } else {
                    low = index;
                }
                index = Math.floor((low + high) / 2);
            }
            return index;
        }
        return index;
    }

    test(): void {
        const seq = new Sequence(0, 10, 1)
        seq[Symbol.iterator]
        for(const num of seq) {
            console.log(num)
        }
    }

}

export class KnotSequenceClosedCurve extends KnotSequenceCurve {

    protected _increasingSequence: number[];
    protected _strictlyIncreasingSequence: number[];
    protected _knotMultiplicities: number[];

    constructor(freeKnots: number[], degree: number, multiplicities?: number[]) {
        super(freeKnots, degree, multiplicities);
        this.checkKnotIntervalConsistency(freeKnots, degree);
        if(multiplicities === undefined) {
            this._increasingSequence = [...freeKnots];
            for(let i = 0; i < this._degree; i++) {
                const interval = freeKnots[i + 1] - freeKnots[i];
                const firstKnot = this._increasingSequence[0];
                this._increasingSequence.splice(0, 0, (firstKnot - interval));
            }
            for(let i = 0; i < (this._increasingSequence.length - 1 - this._degree); i--) {
                const interval = freeKnots[freeKnots.length - 1 - i] - freeKnots[freeKnots.length - 2 - i];
                const lastKnot = this._increasingSequence[this._increasingSequence.length - 1];
                this._increasingSequence.splice(this._increasingSequence.length - 1, 0, (lastKnot + interval));
            }
            this.checkDegreeConsistency();
            const seq = this.generateStrictlyIncreasingSequence();
            this._strictlyIncreasingSequence = seq.abscissae;
            this._knotMultiplicities = seq.multiplicities;
        } else {
            this._strictlyIncreasingSequence = [...freeKnots];
            this._knotMultiplicities = [...multiplicities];
            this._increasingSequence = this.generateIncreasingSequence();
        }
    }

    get increasingSequence() {
        let result = [...this._increasingSequence];
        return result;
    }

    get strictlyIncreasingSequence() {
        let result = [...this._strictlyIncreasingSequence];
        return result;
    }

    get knotMultiplicities() {
        let result = [...this._knotMultiplicities];
        return result;
    }

    checkKnotIntervalConsistency(knots: number[], degree: number): void {
        const distinctKnots = getDistinctKnots(knots);
        let i = 0;
        while((i + 1) < (distinctKnots.length - 2 - i) || i < degree) {
            const interval1 = distinctKnots[i + 1] - distinctKnots[i];
            const interval2 = distinctKnots[distinctKnots.length - i - 2] - distinctKnots[distinctKnots.length - 1 - i];
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
        while(this._strictlyIncreasingSequence[i] !== 0.0) {
            cumulativeMultiplicity = this._knotMultiplicities[i];
            i++;
        }
        if(cumulativeMultiplicity !== this._degree) {
            const error = new ErrorLog(this.constructor.name, "checkDegreeConsistency", "inconsistent order of multiplicity of knots contributing to the closure area of the curve.");
            error.logMessageToConsole();
        }
    }

    checkCurveOrigin(): void {
        if(this._increasingSequence[this._degree] !== 0.0) {
            const error = new ErrorLog(this.constructor.name, "checkCurveOrigin", "curve origin is not zero. Curve origin must be set to 0.0. Not able to process this not sequence.");
            error.logMessageToConsole();
        }
    }

    isAbscissaCoincidingWithKnot(u: number): boolean {
        let coincident = false;
        let abscissaAtCurveBoundary = this._strictlyIncreasingSequence[0];
        let indexAbscissaAtBoundary = 0;
        let cumulativeMultiplicity = this._knotMultiplicities[0];
        while(abscissaAtCurveBoundary !== 0.0) {
            indexAbscissaAtBoundary++;
            cumulativeMultiplicity = cumulativeMultiplicity + this._knotMultiplicities[indexAbscissaAtBoundary];
            abscissaAtCurveBoundary = this._strictlyIncreasingSequence[indexAbscissaAtBoundary];
        }
        if(cumulativeMultiplicity !== this._degree) {
            const error = new ErrorLog(this.constructor.name, "isAbscissaCoincidingWithKnot", "Inconsistent knot multiplicities and knot abscissae before the abscissa at curve boundary.");
            error.logMessageToConsole();
        }
        const freeKnots = this._strictlyIncreasingSequence.slice(indexAbscissaAtBoundary, - indexAbscissaAtBoundary);
        for(let knot of freeKnots) {
            if(Math.abs(u - knot) < KNOT_COINCIDENCE_TOLERANCE) coincident = true;
        }
        return coincident;
    }

    generateIncreasingSequence(): number[] {
        let result: number[] = [];
        return result;
    }

    generateStrictlyIncreasingSequence(): {abscissae: number[], multiplicities: number[]} {
        const multiplicities: number[] = [];
        const knotAbscissae: number[] = [];
        let i = 0;
        while(i < this._increasingSequence.length) {
            const multiplicity = this.knotMultiplicity(i);
            if(multiplicity > (this._degree + 1)) {
                const error = new ErrorLog(this.constructor.name, "generateStrictlyIncreasingSequence", "inconsistent order of multiplicity: too large.");
                error.logMessageToConsole();
            }
            multiplicities.push(multiplicity);
            knotAbscissae.push(this._increasingSequence[i]);
            i += multiplicity;
        }
        return {
            abscissae: knotAbscissae,
            multiplicities: multiplicities
        }
    }
}

export function getDistinctKnots(knots: number[]): number[] {
    let result = [knots[0]];
    let temp = result[0];
    for (let i = 1; i < knots.length; i += 1) {
        if (knots[i] !== temp) {
            result.push(knots[i]);
            temp = knots[i];
        }
    }
    return result;
}

export class Sequence {

    public start: number
    public end: number
    public interval: number

    constructor( start = 0, end = Infinity, interval = 1 ) {
        this.start = start;
        this.end = end;
        this.interval = interval;
    }
    [Symbol.iterator]() {
        let counter = 0;
        let nextIndex = this.start;
        return  {
            next: () => {
                if ( nextIndex <= this.end ) {
                    let result = { value: nextIndex,  done: false }
                    nextIndex += this.interval;
                    counter++;
                    return result;
                }
                return { value: counter, done: true };
            }
        }
    }

}

export class Sequence2 extends Sequence {

    constructor(start = 0, end = Infinity, interval = 1) {
        super();
    }
}