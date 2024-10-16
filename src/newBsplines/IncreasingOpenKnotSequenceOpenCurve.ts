import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequence";
import { AbstractIncreasingOpenKnotSequence } from "./AbstractIncreasingOpenKnotSequence";
import { KnotIndexIncreasingSequence } from "./Knot";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSUBSEQUENCE, IncreasingOpenKnotSequenceOpenCurve_type, STRICTLYINCREASINGOPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { OPEN_KNOT_SEQUENCE_ORIGIN } from "./AbstractOpenKnotSequence";


export class IncreasingOpenKnotSequenceOpenCurve extends AbstractIncreasingOpenKnotSequence {

    protected _enableMaxMultiplicityOrderAtIntermediateKnots: boolean;

    constructor(maxMultiplicityOrder: number, knotParameters: IncreasingOpenKnotSequenceOpenCurve_type) {
        super(maxMultiplicityOrder, knotParameters);
        this._enableMaxMultiplicityOrderAtIntermediateKnots = false;
        if(knotParameters.type !== INCREASINGOPENKNOTSUBSEQUENCE) this.checkOriginOfNormalizedBasis();
        this.checkMaxMultiplicityOrderConsistency();
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
    }

    get enableMaxMultiplicityOrderAtIntermediateKnots(): boolean {
        return this._enableMaxMultiplicityOrderAtIntermediateKnots;
    }

    set enableMaxMultiplicityOrderAtIntermediateKnots(value: boolean) {
        this._enableMaxMultiplicityOrderAtIntermediateKnots = value;
    }

    // checkCurveOrigin(): void {
    //     if(this.knotSequence[0].abscissa !== 0.0) {
    //         let i = 0;
    //         let cumulativeMultiplicity = 0;
    //         while(cumulativeMultiplicity < this._maxMultiplicityOrder) {
    //             cumulativeMultiplicity += this.knotSequence[i].multiplicity;
    //             i++;
    //         }
    //         // this.indexKnotOrigin = i - 1;
    //         if(this.knotSequence[0].abscissa !== 0.0) {
    //             const error = new ErrorLog(this.constructor.name, "checkCurveOrigin", "curve origin is not zero. Curve origin must be set to 0.0. Not able to process this knot sequence.");
    //             error.logMessageToConsole();
    //         }

    //         const error = new ErrorLog(this.constructor.name, "checkCurveOrigin", "curve origin is not zero. Curve origin must be set to 0.0. Not able to process this knot sequence.");
    //         error.logMessageToConsole();
    //     } else {
    //         // this.indexKnotOrigin = 0;
    //     }
    // }

    checkNonUniformKnotMultiplicityOrder(): void {
        this._isKnotMultiplicityNonUniform = false;
        if(this.knotSequence[0].multiplicity === this._maxMultiplicityOrder &&
            this.knotSequence[this.knotSequence.length - 1].multiplicity === this._maxMultiplicityOrder) this._isKnotMultiplicityNonUniform = true;
    }

    clone(): IncreasingOpenKnotSequenceOpenCurve {
        return new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: this.allAbscissae});
    }

    toStrictlyIncreasingKnotSequence(): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        return new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: this.distinctAbscissae(), multiplicities: this.multiplicities()});
    }

    findSpan(u: number): KnotIndexIncreasingSequence {
        let index = RETURN_ERROR_CODE;
        // if (u < this.knotSequence[0].abscissa || u > this.knotSequence[this.knotSequence.length - 1].abscissa) {
        if(u < OPEN_KNOT_SEQUENCE_ORIGIN || u > this._uMax) {
            // console.log(u);
            const error = new ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside the valid knot sequence span.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
            // const error = new ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside valid span");
            // error.logMessageToConsole();
        } else {
            if(this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                for(const knot of this.knotSequence) {
                    index += knot.multiplicity;
                    if(Math.abs(u - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                        if(knot.abscissa === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                            index -= this.knotSequence[this.knotSequence.length - 1].multiplicity
                        }
                        const curveDegree = this._maxMultiplicityOrder - 1;
                        if(this.isKnotMultiplicityUniform && index === (this.knotSequence.length - curveDegree)) index -= 1;
                        return new KnotIndexIncreasingSequence(index - 1);
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
            let indexSeq = 0;
            for(let i = 0; i < (index + 1); i++) {
                indexSeq += this.knotSequence[i].multiplicity; 
            }
            index = indexSeq - 1;
            return new KnotIndexIncreasingSequence(index);
        }
        return new KnotIndexIncreasingSequence(index);
    }

}

export function deepCopyIncreasingKnotSequenceOpenCurve(knotSeq: IncreasingOpenKnotSequenceOpenCurve): number[] {
    const abscissae = knotSeq.allAbscissae;
    return abscissae;
}