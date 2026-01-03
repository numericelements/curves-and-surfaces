"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncreasingPeriodicKnotSequenceClosedCurve = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const KnotSequences_1 = require("../namedConstants/KnotSequences");
const AbstractPeriodicKnotSequence_1 = require("./AbstractPeriodicKnotSequence");
const Knot_1 = require("./Knot");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1 = require("./KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence");
const KnotSequences_2 = require("../ErrorMessages/KnotSequences");
const KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
const KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
const KnotSequences_3 = require("../WarningMessages/KnotSequences");
class IncreasingPeriodicKnotSequenceClosedCurve extends AbstractPeriodicKnotSequence_1.AbstractPeriodicKnotSequence {
    constructor(maxMultiplicityOrder, knotParameters) {
        super(maxMultiplicityOrder, knotParameters);
        this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0);
        if (knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE) {
            this.generateKnotSequence(knotParameters);
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
                abscissae.push(knot);
        }
        return abscissae;
    }
    [Symbol.iterator]() {
        let knotAmount = 0;
        const knotIndicesKnotAbscissaChange = [];
        for (const multiplicity of this.multiplicities()) {
            knotAmount = knotAmount + multiplicity;
            knotIndicesKnotAbscissaChange.push(knotAmount);
        }
        const lastIndex = knotAmount - 1;
        let indexAbscissaChange = 0;
        let index = 0;
        return {
            next: () => {
                if (index <= lastIndex) {
                    if (index === knotIndicesKnotAbscissaChange[indexAbscissaChange]) {
                        indexAbscissaChange++;
                    }
                    index++;
                    return { value: this.knotSequence[indexAbscissaChange].abscissa, done: false };
                }
                else {
                    index = 0;
                    return { done: true };
                }
            }
        };
    }
    clone() {
        return new IncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: this.allAbscissae });
    }
    length() {
        let length = 0;
        for (const knot of this) {
            if (knot !== undefined)
                length++;
        }
        return length;
    }
    knotIndexInputParamAssessment(index, methodName) {
        if (index.knotIndex > (this.allAbscissae.length - 1)) {
            this.throwRangeErrorMessage(methodName, KnotSequences_2.EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        }
    }
    generateKnotSequence(knotParameters) {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotIncreasingValues(knotParameters.periodicKnots);
        this.knotSequence.push(new Knot_1.Knot(knotParameters.periodicKnots[0], 1));
        for (let i = 1; i < knotParameters.periodicKnots.length; i++) {
            if (knotParameters.periodicKnots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity++;
            }
            else {
                this.knotSequence.push(new Knot_1.Knot(knotParameters.periodicKnots[i], 1));
            }
        }
        this.checkMaxMultiplicityOrderConsistency();
        const cumulative_multiplicities = knotParameters.periodicKnots.length - this.knotSequence[this.knotSequence.length - 1].multiplicity;
        if ((cumulative_multiplicities < this._maxMultiplicityOrder && this._maxMultiplicityOrder > 1) ||
            (cumulative_multiplicities < (this._maxMultiplicityOrder + 1) && this._maxMultiplicityOrder === 1)) {
            this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_2.EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS);
        }
        this._uMax = this.knotSequence[this.knotSequence.length - 1].abscissa;
        this.checkNormalizedBasisOrigin();
        this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
    }
    raiseKnotMultiplicity(index, multiplicity) {
        const newKnotSequence = this.clone();
        newKnotSequence.raiseKnotMultiplicityArrayMutSeq(index, multiplicity);
        return newKnotSequence;
    }
    insertKnot(abscissae, multiplicity = 1) {
        const newKnotSequence = this.clone();
        newKnotSequence.insertKnotMutSeq(abscissae, multiplicity);
        return newKnotSequence;
    }
    knotMultiplicityAtAbscissa(abcissa) {
        let multiplicity = 0;
        for (const knot of this.knotSequence) {
            if (Math.abs(abcissa - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                multiplicity = knot.multiplicity;
            }
        }
        if (multiplicity === 0) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "knotMultiplicityAtAbscissa", KnotSequences_3.WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE);
            warning.logMessage();
        }
        return multiplicity;
    }
    abscissaAtIndex(index) {
        let abscissa = KnotSequences_1.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        const multLastKnot = this.knotSequence[this.knotSequence.length - 1].multiplicity;
        const indexPeriod = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex % (this.allAbscissae.length - multLastKnot));
        let i = 0;
        for (const knot of this) {
            if (i === indexPeriod.knotIndex && knot !== undefined)
                abscissa = knot;
            i++;
        }
        return abscissa;
    }
    toKnotIndexStrictlyIncreasingSequence(index) {
        const strictlyIncreasingKnotSequence = (0, fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence)(this);
        const lastIdxStrictIncSeq = strictlyIncreasingKnotSequence.allAbscissae.length - 1;
        const abscissa = this.abscissaAtIndex(index);
        let i = 0;
        for (const knot of strictlyIncreasingKnotSequence.allAbscissae) {
            if (knot !== undefined) {
                if (knot === abscissa)
                    break;
                i++;
            }
        }
        if (index.knotIndex > (this.allAbscissae.length - 1))
            i = i + lastIdxStrictIncSeq;
        return new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
    }
    extractSubsetOfAbscissae(knotStart, knotEnd) {
        let knots = [];
        const sequence = this.allAbscissae.slice();
        const lasIndex = this.allAbscissae.length - 1;
        const multFirstKnot = this.knotSequence[0].multiplicity;
        if (knotEnd.knotIndex <= knotStart.knotIndex) {
            this.throwRangeErrorMessage("extractSubsetOfAbscissae", KnotSequences_2.EM_START_INDEX_OUTOF_RANGE);
        }
        if (knotStart.knotIndex > lasIndex) {
            this.throwRangeErrorMessage("extractSubsetOfAbscissae", KnotSequences_2.EM_START_INDEX_GREATER_THAN_END_INDEX);
        }
        if ((knotEnd.knotIndex - knotStart.knotIndex) > (2 * lasIndex)) {
            this.throwRangeErrorMessage("extractSubsetOfAbscissae", KnotSequences_2.EM_INDICES_SPAN_TWICE_PERIOD);
        }
        if (knotEnd.knotIndex > lasIndex) {
            for (let i = multFirstKnot; i < this.allAbscissae.length; i++) {
                sequence.push(this.allAbscissae[i] + this.allAbscissae[lasIndex]);
            }
        }
        if (knotEnd.knotIndex >= (2 * lasIndex)) {
            for (let i = multFirstKnot; i < this.allAbscissae.length; i++) {
                sequence.push(this.allAbscissae[i] + 2 * this.allAbscissae[lasIndex]);
            }
        }
        knots = sequence.slice(knotStart.knotIndex, knotEnd.knotIndex + 1);
        return knots;
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
                    index += knot.multiplicity;
                    if (Math.abs(u - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                        if (knot.abscissa === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                            index -= this.knotSequence[this.knotSequence.length - 1].multiplicity;
                        }
                        index -= 1;
                        break;
                    }
                }
                return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
            }
            index = this.findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(u);
        }
        return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
    }
    revertKnotSequence() {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }
    decrementKnotMultiplicity(index) {
        const newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityMutSeq(index);
        return newKnotSequence;
    }
}
exports.IncreasingPeriodicKnotSequenceClosedCurve = IncreasingPeriodicKnotSequenceClosedCurve;
