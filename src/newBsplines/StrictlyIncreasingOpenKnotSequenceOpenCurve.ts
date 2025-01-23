import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { AbstractStrictlyIncreasingOpenKnotSequence } from "./AbstractStrictlyIncreasingOpenKnotSequence";
import { STRICTLYINCREASINGOPENKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, StrictlyIncreasingOpenKnotSequenceOpenCurve_type } from "./KnotSequenceConstructorInterface";
import { EM_INCONSISTENT_ORIGIN_NONUNIFORM_KNOT_SEQUENCE, EM_U_OUTOF_KNOTSEQ_RANGE } from "../ErrorMessages/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";

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
        if(this.knotSequence[0].abscissa !== KNOT_SEQUENCE_ORIGIN && this._maxMultiplicityOrder === this.knotSequence[0].multiplicity) {
            this.throwRangeErrorMessage("checkCurveOrigin", EM_INCONSISTENT_ORIGIN_NONUNIFORM_KNOT_SEQUENCE);
        } else if(this.knotSequence[0].abscissa !== KNOT_SEQUENCE_ORIGIN) {
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

    findSpan(u: number): KnotIndexStrictlyIncreasingSequence {
        let index = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if (u < KNOT_SEQUENCE_ORIGIN || u > this._uMax) {
            this.throwRangeErrorMessage("findSpan", EM_U_OUTOF_KNOTSEQ_RANGE);
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
            const indexAtUmax = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            index = this.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
            return new KnotIndexStrictlyIncreasingSequence(index);
        }
        return new KnotIndexStrictlyIncreasingSequence(index);
    }

    revertKnotSequence(): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, checkSequenceConsistency: boolean = true): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityMutSeq(index, checkSequenceConsistency);
        return newKnotSequence;
    }

    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number = 1, checkSequenceConsistency: boolean = true): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.raiseKnotMultiplicityMutSeq(index, multiplicity, checkSequenceConsistency);
        return newKnotSequence;
    }
}