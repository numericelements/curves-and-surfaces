import { WarningLog } from "../errorProcessing/ErrorLoging";
import { AbstractKnotSequence, KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequence";
import { Knot, KnotIndexInterface, KnotIndexStrictlyIncreasingSequence } from "./Knot";

export const OPEN_KNOT_SEQUENCE_ORIGIN = 0.0;

export abstract class AbstractOpenKnotSequence extends AbstractKnotSequence {

    abstract checkNonUniformKnotMultiplicityOrder(): void;

    abstract abscissaAtIndex(index: KnotIndexInterface): number;

    knotMultiplicityAtAbscissa(abscissa: number): number {
        let multiplicity = 0;
        for(const knot of this.knotSequence) {
            if(Math.abs(abscissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
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
            const warning = new WarningLog(this.constructor.name, "insertKnot", "abscissa is too close from an existing knot: please, raise multiplicity of an existing knot.");
            warning.logMessageToConsole();
            insertion = false;
            return insertion;
        }
        this.maxMultiplicityOrderInputParamAssessment(multiplicity, "insertKnot");
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
            this.checkUniformityOfKnotSpacing();
            this.checkUniformityOfKnotMultiplicity();
            this.checkNonUniformKnotMultiplicityOrder();
        }
        return insertion;
    }

    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number): void {
        this.strictlyIncKnotIndexInputParamAssessment(index, "raiseKnotMultiplicity");
        this.knotSequence[index.knotIndex].multiplicity += multiplicity;
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): void {
        super.decrementKnotMultiplicity(index);
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

}