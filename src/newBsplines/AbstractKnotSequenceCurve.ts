import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "./Knot";

// Important remark: There is an interaction between KNOT_COINCIDENCE_TOLERANCE and CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// when computing the zeros of a BSplineR1toR1. KNOT_COINCIDENCE_TOLERANCE currently set to 10E-2 CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// It may be needed to check if there are side effects (JCL 2024/05/06).
export const KNOT_COINCIDENCE_TOLERANCE = 10E-10;

export abstract class AbstractKnotSequenceCurve {

    protected abstract knotSequence: Array<Knot>;
    protected _degree: number;

    constructor(degree: number) {
        this._degree = degree;
    }

    get degree() {
        return this._degree;
    }

    get distinctAbscissae(): number[] {
        let abscissae: number[] = [];
        for(const knot of this.knotSequence) {
            abscissae.push(knot.abscissa);
        }
        return abscissae;
    }

    get multiplicities(): number[] {
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
}