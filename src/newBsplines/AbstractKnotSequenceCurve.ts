import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { Knot, KnotIndexInterface, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { KnotSequenceInterface } from "./KnotSequenceInterface";

// Important remark: There is an interaction between KNOT_COINCIDENCE_TOLERANCE and CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// when computing the zeros of a BSplineR1toR1. KNOT_COINCIDENCE_TOLERANCE currently set to 10E-2 CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// It may be needed to check if there are side effects (JCL 2024/05/06).
export const KNOT_COINCIDENCE_TOLERANCE = 10E-10;

export abstract class AbstractKnotSequenceCurve {

    protected abstract knotSequence: Array<Knot>;
    protected _degree: number;
    protected _isUniform: boolean;

    constructor(degree: number) {
        this._degree = degree;
        this._isUniform = true;
    }

    get degree() {
        return this._degree;
    }

    get isUniform() {
        return this._isUniform;
    }

    distinctAbscissae(): number[] {
        let abscissae: number[] = [];
        for(const knot of this.knotSequence) {
            abscissae.push(knot.abscissa);
        }
        return abscissae;
    }

    multiplicities(): number[] {
        let multiplicities: number[] = [];
        for(const knot of this.knotSequence) {
            multiplicities.push(knot.multiplicity);
        }
        return multiplicities;
    }

    checkDegreeConsistency(): void {
        for (const knot of this.knotSequence) {
            if(knot.multiplicity > (this._degree + 1)) {
                const error = new ErrorLog(this.constructor.name, "checkDegreeConsistency", "inconsistent order of multiplicity: too large.");
                error.logMessageToConsole();
            }
        }
    }

    checkUniformity(): void {
        this._isUniform = true;
        for(const knot of this.knotSequence) {
            if(knot.multiplicity !== 1) this._isUniform = false;
        }
        return;
    }

    isAbscissaCoincidingWithKnot(abscissa: number): boolean {
        let coincident = false;
        for(const knot of this.knotSequence) {
            if(Math.abs(abscissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) coincident = true;
        }
        return coincident;
    }

    isKnotlMultiplicityZero(abscissa: number): boolean {
        let multiplicityZero = true;
        if(this.isAbscissaCoincidingWithKnot(abscissa)) multiplicityZero = false;
        return multiplicityZero;
    }

    knotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): number {
        const result = this.knotSequence[index.knotIndex].multiplicity;
        return result;
    }

    revertKnots(): void {
        const sequence: Array<Knot> = [];
        for(const knot of this.knotSequence) {
            sequence.push(new Knot(0.0))
        }
        let i = 0;
        for(const knot of this.knotSequence) {
            sequence[this.knotSequence.length - i - 1].abscissa = this.knotSequence[this.knotSequence.length - 1].abscissa - (knot.abscissa - this.knotSequence[0].abscissa);
            sequence[this.knotSequence.length - i - 1].multiplicity = knot.multiplicity;
            i++;
        }
        this.knotSequence = sequence.slice();
        return
    }

}