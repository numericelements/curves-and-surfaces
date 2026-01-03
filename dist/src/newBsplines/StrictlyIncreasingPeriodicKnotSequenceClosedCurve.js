"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrictlyIncreasingPeriodicKnotSequenceClosedCurve = void 0;
const KnotSequences_1 = require("../namedConstants/KnotSequences");
const AbstractPeriodicKnotSequence_1 = require("./AbstractPeriodicKnotSequence");
const Knot_1 = require("./Knot");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const KnotSequences_2 = require("../ErrorMessages/KnotSequences");
const KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
class StrictlyIncreasingPeriodicKnotSequenceClosedCurve extends AbstractPeriodicKnotSequence_1.AbstractPeriodicKnotSequence {
    constructor(maxMultiplicityOrder, knotsParameters) {
        super(maxMultiplicityOrder, knotsParameters);
        this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0);
        if (knotsParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE) {
            this.generateStrictlyIncreasingSequence(knotsParameters);
            this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
        }
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkNormalizedBasisOrigin();
    }
    get allAbscissae() {
        const abscissae = [];
        for (const knot of this) {
            if (knot !== undefined)
                abscissae.push(knot.abscissa);
        }
        return abscissae;
    }
    [Symbol.iterator]() {
        const lastIndex = this.knotSequence.length - 1;
        let index = 0;
        return {
            next: () => {
                if (index <= lastIndex) {
                    const abscissa = this.knotSequence[index].abscissa;
                    const multiplicity = this.knotSequence[index].multiplicity;
                    index++;
                    return { value: { abscissa: abscissa, multiplicity: multiplicity }, done: false };
                }
                else {
                    index = 0;
                    return { done: true };
                }
            }
        };
    }
    length() {
        return this.knotSequence.length;
    }
    clone() {
        return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: this.distinctAbscissae(), multiplicities: this.multiplicities() });
    }
    generateStrictlyIncreasingSequence(knotParameters) {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotStrictlyIncreasingValues(knotParameters.periodicKnots);
        for (let i = 0; i < knotParameters.periodicKnots.length; i++) {
            this.knotSequence.push(new Knot_1.Knot(knotParameters.periodicKnots[i], knotParameters.multiplicities[i]));
        }
        this.checkMaxMultiplicityOrderConsistency();
        let cumulative_multiplicities = this.knotSequence[0].multiplicity;
        for (let i = 1; i < this.knotSequence.length - 1; i++) {
            cumulative_multiplicities += this.knotSequence[i].multiplicity;
        }
        if ((cumulative_multiplicities < this._maxMultiplicityOrder && this._maxMultiplicityOrder > 1)
            || (cumulative_multiplicities < (this._maxMultiplicityOrder + 1) && this._maxMultiplicityOrder === 1)) {
            this.throwRangeErrorMessage("generateStrictlyIncreasingSequence", KnotSequences_2.EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS);
        }
        this._uMax = this.knotSequence[this.knotSequence.length - 1].abscissa;
        this.checkNormalizedBasisOrigin();
        this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
    }
    abscissaAtIndex(index) {
        let abscissa = KnotSequences_1.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        const indexPeriod = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index.knotIndex % (this.allAbscissae.length - 1));
        let i = 0;
        for (const knot of this) {
            if (i === indexPeriod.knotIndex && knot !== undefined)
                abscissa = knot.abscissa;
            i++;
        }
        return abscissa;
    }
    findSpan(u) {
        let index = KnotSequences_1.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if (u > this.knotSequence[this.knotSequence.length - 1].abscissa) {
            u = u % this.getPeriod();
        }
        if (u < KnotSequences_1.KNOT_SEQUENCE_ORIGIN) {
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
            index = this.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u);
        }
        return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index);
    }
    revertKnotSequence() {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }
    raiseKnotMultiplicity(indicesArray, multiplicity = 1) {
        const newKnotSequence = this.clone();
        newKnotSequence.raiseKnotMultiplicityArrayMutSeq(indicesArray, multiplicity);
        return newKnotSequence;
    }
    decrementKnotMultiplicity(index) {
        const newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityMutSeq(index);
        return newKnotSequence;
    }
    insertKnot(abscissae, multiplicity = 1) {
        const newKnotSequence = this.clone();
        newKnotSequence.insertKnotMutSeq(abscissae, multiplicity);
        return newKnotSequence;
    }
}
exports.StrictlyIncreasingPeriodicKnotSequenceClosedCurve = StrictlyIncreasingPeriodicKnotSequenceClosedCurve;
