import { WarningLog } from "../errorProcessing/ErrorLoging";
import { AbstractKnotSequenceCurve, KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequenceCurve";
import { Knot } from "./Knot";

export abstract class AbstractOpenKnotSequenceCurve extends AbstractKnotSequenceCurve {


    getMultiplicityOfKnotAt(abcissa: number): number {
        let multiplicity = 0;
        for(const knot of this.knotSequence) {
            if(Math.abs(abcissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                multiplicity = knot.multiplicity;
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
        if(this.isAbscissaCoincidingWithKnot(abscissa)) {
            const warning = new WarningLog(this.constructor.name, "insertKnot", "abscissa is too close from an existing knot: raise multiplicity of an existing knot.");
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
                while(this.knotSequence[i].abscissa < abscissa && (! (abscissa < this.knotSequence[i + 1].abscissa)) && i < (this.knotSequence.length - 1)) {
                    i++;
                }
                if(i = (this.knotSequence.length - 1)) {
                    this.knotSequence.push(knot);
                } else {
                    this.knotSequence.splice(i, 0, knot);
                }
            }
        }
        return insertion;
    }

    findSpan(u: number): number {
        let index = -1;
        // if (u < this._strictlyIncreasingSequence[0] || u > this._strictlyIncreasingSequence[this._strictlyIncreasingSequence.length - 1]) {
        //     console.log(u);
        //     const error = new ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside valid span");
        //     error.logMessageToConsole();
        // } else {
        //     if(Math.abs(u - this._strictlyIncreasingSequence[0]) < KNOT_COINCIDENCE_TOLERANCE) {
        //         index = 0;
        //         return index;
        //     } else {
        //         index = 0;
        //         for(let j = 1; j < this._strictlyIncreasingSequence.length; j++) {
        //             index += this._knotMultiplicities[j];
        //             if(Math.abs(u - this._strictlyIncreasingSequence[j]) < KNOT_COINCIDENCE_TOLERANCE) {
        //                 return index;
        //             }
        //         }
        //     }
        //     // Do binary search
        //     let low = 0;
        //     let high = this._increasingSequence[this._increasingSequence.length - 1] - 1 - this._degree;
        //     index = Math.floor((low + high) / 2);
        
        //     while (!(this._increasingSequence[index] < u && u < this._increasingSequence[index + 1])) {
        //         if (u < this._increasingSequence[index]) {
        //             high = index;
        //         } else {
        //             low = index;
        //         }
        //         index = Math.floor((low + high) / 2);
        //     }
        //     return index;
        // }
        return index;
    }

}