import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";

const KNOT_COINCIDENCE_TOLERANCE = 10-6;

export class KnotSequence {

    private _increasingSequence: number[];
    private _strictlyIncreasingSequence: number[];
    private _knotMultiplicities: number[];
    private _degree: number;

    constructor(knots: number[], degree: number, multiplicities?: number[]) {
        this._degree = degree;
        if(multiplicities === undefined) {
            this._increasingSequence = [...knots];
            const seq = this.generateStrictlyIncreasingSequence();
            this._strictlyIncreasingSequence = seq.abscissae;
            this._knotMultiplicities = seq.multiplicities;
            this.checkDegreeConsistency();
        } else {
            this._strictlyIncreasingSequence = [...knots];
            if(knots.length !== multiplicities.length) {
                const error = new ErrorLog(this.constructor.name, "constructor", "size of multiplcities array does not the size of knot abscissae array.");
                error.logMessageToConsole();
            }
            this._knotMultiplicities = [...multiplicities];
            this._increasingSequence = this.generateIncreasingSequence();
        }
        
    }

    get degree() {
        return this._degree;
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

}