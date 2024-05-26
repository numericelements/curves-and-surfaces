import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractKnotSequenceCurve, KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequenceCurve";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "./Knot";

export abstract class AbstractOpenKnotSequenceCurve extends AbstractKnotSequenceCurve {

    abstract checkNonUniformStructure(): void;

    KnotMultiplicityAtAbscissa(abcissa: number): number {
        let multiplicity = 0;
        for(const knot of this.knotSequence) {
            if(Math.abs(abcissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                multiplicity = knot.multiplicity;
            }
        }
        if(multiplicity === 0) {
            const warning = new WarningLog(this.constructor.name, "getMultiplicityOfKnotAt", "knot abscissa cannot be found within the knot sequence.");
            warning.logMessageToConsole();
        }
        return multiplicity;
    }

    insertKnot(abscissa: number, multiplicity: number = 1): boolean {
        let insertion = true;
        if(this.isAbscissaCoincidingWithKnot(abscissa)) {
            const warning = new WarningLog(this.constructor.name, "insertKnot", "abscissa is too close from an existing knot: raise multiplicity of an existing knot.");
            warning.logMessageToConsole();
            insertion = false;
            return insertion;
        } else if(multiplicity >= (this._degree + 1)) {
            const warning = new WarningLog(this.constructor.name, "insertKnot", "the order of multiplicity of the new knot is not compatible with the curve degree")
            warning.logMessageToConsole();
            insertion = false;
            return insertion;
        }
        if(insertion) {
            const knot = new Knot(abscissa, multiplicity);
            if(abscissa < this.knotSequence[0].abscissa) {
                this.knotSequence.splice(0, 0, knot);
            } else {
                let i = 0;
                while(i < (this.knotSequence.length - 1)) {
                    if(this.knotSequence[i].abscissa < abscissa && abscissa < this.knotSequence[i + 1].abscissa) break;
                    i++;
                }
                if(i === (this.knotSequence.length - 1)) {
                    this.knotSequence.push(knot);
                } else {
                    this.knotSequence.splice((i + 1), 0, knot);
                }
            }
            this.checkUniformity();
            this.checkNonUniformStructure();
        }
        return insertion;
    }

    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): void {
        if(index.knotIndex < 0 || index.knotIndex > this.knotSequence.length - 1) {
            const error = new ErrorLog(this.constructor.name, "raiseKnotMultiplicity", "Index value is out of range.");
            error.logMessageToConsole();
            return;
        }
        this.knotSequence[index.knotIndex].multiplicity += multiplicity;
        this.checkUniformity();
        this.checkNonUniformStructure();
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
        this.checkNonUniformStructure();
    }

}