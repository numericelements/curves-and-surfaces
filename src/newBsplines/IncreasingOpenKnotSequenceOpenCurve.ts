import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { KNOT_COINCIDENCE_TOLERANCE } from "./AbstractKnotSequence";
import { AbstractIncreasingOpenKnotSequence } from "./AbstractIncreasingOpenKnotSequence";
import { Knot, KnotIndexIncreasingSequence } from "./Knot";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSUBSEQUENCE, IncreasingOpenKnotSequenceOpenCurve_type } from "./KnotSequenceConstructorInterface";


export class IncreasingOpenKnotSequenceOpenCurve extends AbstractIncreasingOpenKnotSequence {

    // protected knotSequence: Knot[];

    // constructor(maxMultiplicityOrder: number, knots: number[], subsequence: boolean = false) {
    //     super(maxMultiplicityOrder, knots);
    constructor(maxMultiplicityOrder: number, knotParameters: IncreasingOpenKnotSequenceOpenCurve_type) {
        super(maxMultiplicityOrder, knotParameters);
        // this.knotSequence = [];
        // if(knots.length < 1) {
        //     const error = new ErrorLog(this.constructor.name, "constructor", "null length knot sequence cannot be processed.");
        //     error.logMessageToConsole();
        //     return;
        // }
        // this.knotSequence.push(new Knot(knots[0], 1));
        // for(let i = 1; i < knots.length; i++) {
        //     if(knots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
        //         this.knotSequence[this.knotSequence.length - 1].multiplicity++;
        //     } else {
        //         this.knotSequence.push(new Knot(knots[i], 1));
        //     }
        // }
        // if(!subsequence) this.checkCurveOrigin();
        if(knotParameters.type !== INCREASINGOPENKNOTSUBSEQUENCE) this.checkCurveOrigin();
        this.checkMaxMultiplicityOrderConsistency();
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
        if(this.knotSequence[0].multiplicity === this._maxMultiplicityOrder &&
            this.knotSequence[this.knotSequence.length - 1].multiplicity === this._maxMultiplicityOrder) this._isNonUniform = true;
    }

    deepCopy(): IncreasingOpenKnotSequenceOpenCurve {
        // return new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, this.allAbscissae);
        return new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: this.allAbscissae});
    }

    toStrictlyIncreasingKnotSequence(): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        return new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, this.distinctAbscissae(), this.multiplicities());
    }

    findSpan(u: number): KnotIndexIncreasingSequence {
        let index = RETURN_ERROR_CODE;
        if (u < this.knotSequence[0].abscissa || u > this.knotSequence[this.knotSequence.length - 1].abscissa) {
            console.log(u);
            const error = new ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside valid span");
            error.logMessageToConsole();
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
                        if(this.isUniform && index === (this.knotSequence.length - curveDegree)) index -= 1;
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