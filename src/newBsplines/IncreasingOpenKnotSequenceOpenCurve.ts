import { KNOT_COINCIDENCE_TOLERANCE, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { AbstractIncreasingOpenKnotSequence } from "./AbstractIncreasingOpenKnotSequence";
import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, IncreasingOpenKnotSequenceOpenCurve_type } from "./KnotSequenceConstructorInterface";
import { KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";
import { EM_U_OUTOF_KNOTSEQ_RANGE } from "../ErrorMessages/KnotSequences";
import { fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC } from "./KnotSequenceConversionAndUtilities";


export class IncreasingOpenKnotSequenceOpenCurve extends AbstractIncreasingOpenKnotSequence {

    constructor(maxMultiplicityOrder: number, knotParameters: IncreasingOpenKnotSequenceOpenCurve_type) {
        super(maxMultiplicityOrder, knotParameters);

        if(knotParameters.type !== INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY) this.checkOriginOfNormalizedBasis();
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
    }

    checkNonUniformKnotMultiplicityOrder(): void {
        this._isKnotMultiplicityNonUniform = false;
        if(this.knotSequence[0].multiplicity === this._maxMultiplicityOrder &&
            this.knotSequence[this.knotSequence.length - 1].multiplicity === this._maxMultiplicityOrder) this._isKnotMultiplicityNonUniform = true;
    }

    clone(): IncreasingOpenKnotSequenceOpenCurve {
        if(this._isSequenceUpToC0Discontinuity) {
            return new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: this.allAbscissae});
        } else {
            return new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: this.allAbscissae});
        }
    }

    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence {
        const strictlyIncreasingKnotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(this);
        const abscissa = this.abscissaAtIndex(index);
        let i = 0;
        for(const knot of strictlyIncreasingKnotSequence.allAbscissae) {
            if(knot !== undefined) {
                if(knot === abscissa) break;
                i++;
            }
        }
        return new KnotIndexStrictlyIncreasingSequence(i);
    }

    findSpan(u: number): KnotIndexIncreasingSequence {
        let index = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if(u < KNOT_SEQUENCE_ORIGIN || u > this._uMax) {
            this.throwRangeErrorMessage("findSpan", EM_U_OUTOF_KNOTSEQ_RANGE);
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
            const indexAtUmax = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            index = this.findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
            return new KnotIndexIncreasingSequence(index);
        }
        return new KnotIndexIncreasingSequence(index);
    }

}

export function deepCopyIncreasingKnotSequenceOpenCurve(knotSeq: IncreasingOpenKnotSequenceOpenCurve): number[] {
    const abscissae = knotSeq.allAbscissae;
    return abscissae;
}