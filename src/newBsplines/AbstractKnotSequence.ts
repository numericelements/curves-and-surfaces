import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { Knot, KnotIndexInterface, KnotIndexStrictlyIncreasingSequence } from "./Knot";

// Important remark: There is an interaction between KNOT_COINCIDENCE_TOLERANCE and CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// when computing the zeros of a BSplineR1toR1. KNOT_COINCIDENCE_TOLERANCE currently set to 10E-2 CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// It may be needed to check if there are side effects (JCL 2024/05/06).
export const KNOT_COINCIDENCE_TOLERANCE = 10E-10;

export abstract class AbstractKnotSequence {

    protected abstract knotSequence: Array<Knot>;
    protected _maxMultiplicityOrder: number;
    protected _isUniform: boolean;

    constructor(maxMultiplicityOrder: number) {
        this._maxMultiplicityOrder = maxMultiplicityOrder;
        this._isUniform = true;
    }

    get maxMultiplicityOrder() {
        return this._maxMultiplicityOrder;
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

    checkMaxMultiplicityOrderConsistency(): void {
        for (const knot of this.knotSequence) {
            if(knot.multiplicity > (this._maxMultiplicityOrder)) {
                const error = new ErrorLog(this.constructor.name, "checkDegreeConsistency", "inconsistent order of multiplicity: some knot has a multiplicity greater than the maximum order of multiplicity specified for the sequence.");
                console.log(error.logMessage());
                throw new RangeError(error.logMessage());
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

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): void {
        if(index.knotIndex < 0 || index.knotIndex > this.knotSequence.length - 1) {
            const error = new ErrorLog(this.constructor.name, "decrementKnotMultiplicity", "Index value is out of range.");
            error.logMessageToConsole();
            return;
        }
        this.knotSequence[index.knotIndex].multiplicity--;
        if(this.knotSequence[index.knotIndex].multiplicity === 0) {
            const abscissae = this.distinctAbscissae();
            const multiplicities = this.multiplicities();
            abscissae.splice(index.knotIndex, 1);
            multiplicities.splice(index.knotIndex, 1);
            this.knotSequence = [];
            let i = 0;
            for(const abscissa of abscissae) {
                const knot = new Knot(abscissa, multiplicities[i]);
                this.knotSequence.push(knot);
            }
        }
        this.checkUniformity();
    }

}