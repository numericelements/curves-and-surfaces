import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { KNOT_COINCIDENCE_TOLERANCE, OPEN_KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { AbstractStrictlyIncreasingOpenKnotSequence } from "./AbstractStrictlyIncreasingOpenKnotSequence";
import { STRICTLYINCREASINGOPENKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, StrictlyIncreasingOpenKnotSequenceOpenCurve_type } from "./KnotSequenceConstructorInterface";
import { EM_INCONSISTENT_ORIGIN_NONUNIFORM_KNOT_SEQUENCE } from "../ErrorMessages/KnotSequences";

export class StrictlyIncreasingOpenKnotSequenceOpenCurve extends AbstractStrictlyIncreasingOpenKnotSequence {

    
    constructor(maxMultiplicityOrder: number, knotParameters: StrictlyIncreasingOpenKnotSequenceOpenCurve_type) {
        super(maxMultiplicityOrder, knotParameters);
        this.checkCurveOrigin();
        this.checkMaxMultiplicityOrderConsistency();
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
    }

    get isSequenceUpToC0Discontinuity(): boolean {
        return this._isSequenceUpToC0Discontinuity;
    }

    set isSequenceUpToC0Discontinuity(value: boolean) {
        this._isSequenceUpToC0Discontinuity = value;
    }

    checkCurveOrigin(): void {
        if(this.knotSequence[0].abscissa !== OPEN_KNOT_SEQUENCE_ORIGIN && this._maxMultiplicityOrder === this.knotSequence[0].multiplicity) {
            this.throwRangeErrorMessage("checkCurveOrigin", EM_INCONSISTENT_ORIGIN_NONUNIFORM_KNOT_SEQUENCE);
        } else if(this.knotSequence[0].abscissa !== OPEN_KNOT_SEQUENCE_ORIGIN) {
            super.checkCurveOrigin();
        }
    }

    checkNonUniformKnotMultiplicityOrder(): void {
        this._isKnotMultiplicityNonUniform = false;
        if(this.knotSequence[0].multiplicity === this._maxMultiplicityOrder &&
            this.knotSequence[this.knotSequence.length - 1].multiplicity === this._maxMultiplicityOrder) this._isKnotMultiplicityNonUniform = true;
    }

    clone(): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        if(this._isSequenceUpToC0Discontinuity) {
            return new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: this.distinctAbscissae(), multiplicities: this.multiplicities()});
        } else {
            return new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: this.distinctAbscissae(), multiplicities: this.multiplicities()});
        }
    }

    // toIncreasingKnotSequence(): IncreasingOpenKnotSequenceOpenCurve {
    //     const knotAbscissae: number[] = [];
    //     for (const knot of this.knotSequence) {
    //         for(let i = 0; i < knot.multiplicity; i++) {
    //             knotAbscissae.push(knot.abscissa);
    //         }
    //     }
    //     return new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knotAbscissae});
    // }

    findSpan(u: number): KnotIndexStrictlyIncreasingSequence {
        let index = RETURN_ERROR_CODE;
        if (u < this.knotSequence[0].abscissa || u > this.knotSequence[this.knotSequence.length - 1].abscissa) {
            console.log(u);
            const error = new ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside valid span");
            error.logMessage();
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