"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncreasingOpenKnotSequenceOpenCurve = void 0;
const KnotSequences_1 = require("../namedConstants/KnotSequences");
const AbstractIncreasingOpenKnotSequence_1 = require("./AbstractIncreasingOpenKnotSequence");
const KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const KnotSequences_2 = require("../namedConstants/KnotSequences");
const KnotSequences_3 = require("../ErrorMessages/KnotSequences");
const fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1 = require("./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC");
const KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
class IncreasingOpenKnotSequenceOpenCurve extends AbstractIncreasingOpenKnotSequence_1.AbstractIncreasingOpenKnotSequence {
    constructor(maxMultiplicityOrder, knotParameters) {
        super(maxMultiplicityOrder, knotParameters);
        if (knotParameters.type !== KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY)
            this.updateNormalizedBasisOrigin();
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
    }
    checkNonUniformKnotMultiplicityOrder() {
        this._isKnotMultiplicityNonUniform = false;
        if (this.knotSequence[0].multiplicity === this._maxMultiplicityOrder &&
            this.knotSequence[this.knotSequence.length - 1].multiplicity === this._maxMultiplicityOrder)
            this._isKnotMultiplicityNonUniform = true;
    }
    clone() {
        if (this._isSequenceUpToC0Discontinuity) {
            return new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: this.allAbscissae });
        }
        else {
            return new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: this.allAbscissae });
        }
    }
    toKnotIndexStrictlyIncreasingSequence(index) {
        const strictlyIncreasingKnotSequence = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(this);
        const abscissa = this.abscissaAtIndex(index);
        let i = 0;
        for (const knot of strictlyIncreasingKnotSequence.allAbscissae) {
            if (knot !== undefined) {
                if (knot === abscissa)
                    break;
                i++;
            }
        }
        return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
    }
    findSpan(u) {
        let index = KnotSequences_1.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if (u < KnotSequences_2.KNOT_SEQUENCE_ORIGIN || u > this._uMax) {
            this.throwRangeErrorMessage("findSpan", KnotSequences_3.EM_U_OUTOF_KNOTSEQ_RANGE);
        }
        else {
            if (this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                for (const knot of this.knotSequence) {
                    index += knot.multiplicity;
                    if (Math.abs(u - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                        if (knot.abscissa === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                            index -= this.knotSequence[this.knotSequence.length - 1].multiplicity;
                        }
                        const curveDegree = this._maxMultiplicityOrder - 1;
                        if (this.isKnotMultiplicityUniform && index === (this.knotSequence.length - curveDegree))
                            index -= 1;
                        index -= 1;
                        break;
                    }
                }
                return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
            }
            const indexAtUmax = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            index = this.findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
        }
        return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
    }
    revertKnotSequence() {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }
    decrementKnotMultiplicity(index, checkSequenceConsistency = true) {
        const newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityKnotArrayMutSeq(index, checkSequenceConsistency);
        return newKnotSequence;
    }
    raiseKnotMultiplicity(arrayIndices, multiplicity = 1, checkSequenceConsistency = true) {
        const newKnotSequence = this.clone();
        newKnotSequence.raiseKnotMultiplicityKnotArrayMutSeq(arrayIndices, multiplicity, checkSequenceConsistency);
        return newKnotSequence;
    }
    insertKnot(arrayAbscissae, multplicity = 1) {
        const newKnotSequence = this.clone();
        newKnotSequence.insertKnotAbscissaArrayMutSeq(arrayAbscissae, multplicity);
        return newKnotSequence;
    }
    updateKnotSequenceThroughNormalizedBasisAnalysis() {
        const previousKnotSequence = this.knotSequence.slice();
        this.updateKnotSequenceThroughNormalizedBasisAnalysisMutSeq();
        const knotAbscissae = [];
        for (const knot of this.allAbscissae) {
            knotAbscissae.push(knot);
        }
        let updatedSeq = new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knotAbscissae });
        if (this._isSequenceUpToC0Discontinuity)
            updatedSeq = new IncreasingOpenKnotSequenceOpenCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knotAbscissae });
        this.knotSequence = previousKnotSequence;
        return updatedSeq;
    }
}
exports.IncreasingOpenKnotSequenceOpenCurve = IncreasingOpenKnotSequenceOpenCurve;
