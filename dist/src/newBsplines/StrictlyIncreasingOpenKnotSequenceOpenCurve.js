"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrictlyIncreasingOpenKnotSequenceOpenCurve = void 0;
const KnotSequences_1 = require("../namedConstants/KnotSequences");
const AbstractStrictlyIncreasingOpenKnotSequence_1 = require("./AbstractStrictlyIncreasingOpenKnotSequence");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const KnotSequences_2 = require("../ErrorMessages/KnotSequences");
const KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
class StrictlyIncreasingOpenKnotSequenceOpenCurve extends AbstractStrictlyIncreasingOpenKnotSequence_1.AbstractStrictlyIncreasingOpenKnotSequence {
    constructor(maxMultiplicityOrder, knotParameters) {
        super(maxMultiplicityOrder, knotParameters);
        this.updateNormalizedBasisOrigin();
        this.checkMaxMultiplicityOrderConsistency();
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
    }
    get isSequenceUpToC0Discontinuity() {
        return this._isSequenceUpToC0Discontinuity;
    }
    updateNormalizedBasisOrigin() {
        if (this.knotSequence[0].abscissa !== KnotSequences_1.KNOT_SEQUENCE_ORIGIN && this._maxMultiplicityOrder === this.knotSequence[0].multiplicity) {
            this.throwRangeErrorMessage("checkCurveOrigin", KnotSequences_2.EM_INCONSISTENT_ORIGIN_NONUNIFORM_KNOT_SEQUENCE);
        }
        else if (this.knotSequence[0].abscissa !== KnotSequences_1.KNOT_SEQUENCE_ORIGIN) {
            super.updateNormalizedBasisOrigin();
        }
    }
    checkNonUniformKnotMultiplicityOrder() {
        this._isKnotMultiplicityNonUniform = false;
        if (this.knotSequence[0].multiplicity === this._maxMultiplicityOrder &&
            this.knotSequence[this.knotSequence.length - 1].multiplicity === this._maxMultiplicityOrder)
            this._isKnotMultiplicityNonUniform = true;
    }
    clone() {
        if (this._isSequenceUpToC0Discontinuity) {
            return new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: this.distinctAbscissae(), multiplicities: this.multiplicities() });
        }
        else {
            return new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: this.distinctAbscissae(), multiplicities: this.multiplicities() });
        }
    }
    findSpan(u) {
        let index = KnotSequences_1.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if (u < KnotSequences_1.KNOT_SEQUENCE_ORIGIN || u > this._uMax) {
            this.throwRangeErrorMessage("findSpan", KnotSequences_2.EM_U_OUTOF_KNOTSEQ_RANGE);
        }
        else {
            if (this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                for (const knot of this.knotSequence) {
                    index++;
                    if (Math.abs(u - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                        if (knot.abscissa === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                            index = this.knotSequence.length - 1;
                        }
                        index -= 1;
                        break;
                    }
                }
                return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index);
            }
            const indexAtUmax = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            index = this.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
        }
        return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index);
    }
    revertKnotSequence() {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }
    decrementKnotMultiplicity(index, checkSequenceConsistency = true) {
        const newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityMutSeq(index, checkSequenceConsistency);
        return newKnotSequence;
    }
    raiseKnotMultiplicity(index, multiplicity = 1, checkSequenceConsistency = true) {
        const newKnotSequence = this.clone();
        newKnotSequence.raiseKnotMultiplicityKnotArrayMutSeq(index, multiplicity, checkSequenceConsistency);
        return newKnotSequence;
    }
    insertKnot(abscissae, multiplicity = 1) {
        const newKnotSequence = this.clone();
        newKnotSequence.insertKnotAbscissaArrayMutSeq(abscissae, multiplicity);
        return newKnotSequence;
    }
    updateKnotSequenceThroughNormalizedBasisAnalysis() {
        const previousKnotSequence = this.knotSequence.slice();
        this.updateKnotSequenceThroughNormalizedBasisAnalysisMutSeq();
        const knotAbscissae = [];
        const multiplicities = [];
        for (const knot of this.knotSequence) {
            if (knot !== undefined) {
                knotAbscissae.push(knot.abscissa);
                multiplicities.push(knot.multiplicity);
            }
        }
        const updatedSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knotAbscissae, multiplicities: multiplicities });
        this.knotSequence = previousKnotSequence;
        return updatedSeq;
    }
}
exports.StrictlyIncreasingOpenKnotSequenceOpenCurve = StrictlyIncreasingOpenKnotSequenceOpenCurve;
