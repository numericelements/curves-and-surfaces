import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequenceCurve";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { AbstractStrictlyIncreasingOpenKnotSequenceCurve } from "./AbstractStrictlyIncreasingOpenKnotSequenceCurve";

export class StrictlyIncreasingOpenKnotSequenceOpenCurve extends AbstractStrictlyIncreasingOpenKnotSequenceCurve {

    protected knotSequence: Knot[];

    constructor(degree: number, knots: number[], multiplicities: number[]) {
        super(degree, knots, multiplicities);
        this.knotSequence = [];
        if(knots.length !== multiplicities.length) {
            const error = new ErrorLog(this.constructor.name, "constructor", "size of multiplicities array does not match the size of knot abscissae array.");
            error.logMessageToConsole();
        }
        for(let i = 0; i < knots.length; i++) {
            this.knotSequence.push(new Knot(knots[i], multiplicities[i]));
        }
        this.checkCurveOrigin();
        this.checkDegreeConsistency();
        this.checkNonUniformStructure();
        this.checkUniformity();
    }

    checkCurveOrigin(): void {
        if(this.knotSequence[0].abscissa !== 0.0) {
            const error = new ErrorLog(this.constructor.name, "checkCurveOrigin", "curve origin is not zero. Curve origin must be set to 0.0. Not able to process this knot sequence.");
            error.logMessageToConsole();
        }
    }

    checkNonUniformStructure(): void {
        this._isNonUniform = false;
        if(this.knotSequence[0].multiplicity === (this._degree + 1) &&
            this.knotSequence[this.knotSequence.length - 1].multiplicity === (this._degree + 1)) this._isNonUniform = true;
    }

    deepCopy(): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        return new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._degree, this.distinctAbscissae(), this.multiplicities());
    }

    toIncreasingKnotSequence(): IncreasingOpenKnotSequenceOpenCurve {
        const knotAbscissae: number[] = [];
        for (const knot of this.knotSequence) {
            for(let i = 0; i < knot.multiplicity; i++) {
                knotAbscissae.push(knot.abscissa);
            }
        }
        return new IncreasingOpenKnotSequenceOpenCurve(this._degree, knotAbscissae);
    }

    findSpan(u: number): KnotIndexStrictlyIncreasingSequence {
        let index = RETURN_ERROR_CODE;
        if (u < this.knotSequence[0].abscissa || u > this.knotSequence[this.knotSequence.length - 1].abscissa) {
            console.log(u);
            const error = new ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside valid span");
            error.logMessageToConsole();
        } else {
            if(this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                for(const knot of this.knotSequence) {
                    index++;
                    if(Math.abs(u - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                        if(knot.abscissa === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                            index = this.knotSequence.length - 1;
                        }
                        return new KnotIndexStrictlyIncreasingSequence(index - 1);
                    }
                }
            }
            // Do binary search
            let low = 0;
            let high = this.knotSequence.length - 1;
            index = Math.floor((low + high) / 2);
        
            while (!(this.knotSequence[index].abscissa < u && u < this.knotSequence[index + 1].abscissa)) {
                if (u < this.knotSequence[index].abscissa) {
                    high = index;
                } else {
                    low = index;
                }
                index = Math.floor((low + high) / 2);
            }
            return new KnotIndexStrictlyIncreasingSequence(index);
        }
        return new KnotIndexStrictlyIncreasingSequence(index);
    }
}