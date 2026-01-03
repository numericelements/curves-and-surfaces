"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncreasingOpenKnotSequenceClosedCurve = void 0;
const KnotSequences_1 = require("../namedConstants/KnotSequences");
const AbstractIncreasingOpenKnotSequence_1 = require("./AbstractIncreasingOpenKnotSequence");
const Knot_1 = require("./Knot");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const KnotSequences_2 = require("../ErrorMessages/KnotSequences");
const fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1 = require("./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC");
const prepareIncreasingOpenKnotSequenceCC_1 = require("./KnotSequenceAndUtilities/prepareIncreasingOpenKnotSequenceCC");
const KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
const KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
const StrictlyIncreasingOpenKnotSequenceClosedCurve_1 = require("./StrictlyIncreasingOpenKnotSequenceClosedCurve");
class IncreasingOpenKnotSequenceClosedCurve extends AbstractIncreasingOpenKnotSequence_1.AbstractIncreasingOpenKnotSequence {
    constructor(maxMultiplicityOrder, knotParameters) {
        super(maxMultiplicityOrder, knotParameters);
        if (knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE) {
            this.computeKnotSequenceFromPeriodicKnotSequence(knotParameters);
        }
        // The validity of the knot sequence should follow the given sequence of calls
        // to make sure that the sequence origin is correctly set first since it is used
        // when checking the degree consistency and knot multiplicities outside the effective curve interval
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
        if (knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE
            || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS) {
            this.updateNormalizedBasisOrigin();
            this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
            this.checkKnotIntervalConsistency();
        }
        this.checkMaxMultiplicityOrderConsistency();
    }
    // freeKnots is an accessor available for B-Spline curves to obtain a subset of a knot sequence, associated with control points
    // that can be available as a free parameter subset for some applications, e.g., optimization
    get freeKnots() {
        const freeKnots = this.periodicKnots;
        freeKnots.splice(0, 1);
        freeKnots.splice(freeKnots.length - 1, 1);
        return freeKnots;
    }
    get periodicKnots() {
        const periodicKnots = [];
        for (const knot of this) {
            if (knot !== undefined)
                periodicKnots.push(knot);
        }
        periodicKnots.splice(0, (this._maxMultiplicityOrder - this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity));
        periodicKnots.splice(periodicKnots.length - (this._maxMultiplicityOrder - this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity), (this._maxMultiplicityOrder - this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity));
        return periodicKnots;
    }
    constructorInputBspBasisSizeAssessment(knotParameters) {
        if (knotParameters.BsplBasisSize < this._maxMultiplicityOrder || (this._maxMultiplicityOrder === 2 && knotParameters.BsplBasisSize < (this._maxMultiplicityOrder + 1)))
            this.throwRangeErrorMessage("constructor", KnotSequences_2.EM_SIZENORMALIZED_BSPLINEBASIS);
    }
    checkKnotIntervalConsistency() {
        if (this.knotSequence[0].multiplicity >= this._maxMultiplicityOrder && this.knotSequence[this.knotSequence.length - 1].multiplicity >= this._maxMultiplicityOrder)
            return;
        if (this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa !== KnotSequences_1.KNOT_SEQUENCE_ORIGIN)
            this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
        const indexRightBoundBasis = this.getKnotIndexNormalizedBasisAtSequenceEnd().knot.knotIndex;
        const multiplicityAtOrigin = this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity;
        let i = 0;
        let cumulativeMultiplicity = 0;
        while ((this._indexKnotOrigin.knotIndex - i) > 0) {
            const interval1 = this.knotSequence[indexRightBoundBasis - (i + 1)].abscissa - this.knotSequence[indexRightBoundBasis - i].abscissa;
            const multiplicity1 = this.knotSequence[indexRightBoundBasis - (i + 1)].multiplicity;
            const interval2 = this.knotSequence[this._indexKnotOrigin.knotIndex - (i + 1)].abscissa - this.knotSequence[this._indexKnotOrigin.knotIndex - i].abscissa;
            const multiplicity2 = this.knotSequence[this._indexKnotOrigin.knotIndex - (i + 1)].multiplicity;
            if ((Math.abs(interval1 - interval2) > KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE || multiplicity1 !== multiplicity2) && (this._indexKnotOrigin.knotIndex - i) > 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
            }
            else if ((Math.abs(interval1 - interval2) > KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE || multiplicity1 < multiplicity2) && (this._indexKnotOrigin.knotIndex - i) === 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
            }
            if ((this._indexKnotOrigin.knotIndex - i) > 1) {
                cumulativeMultiplicity += multiplicity1;
            }
            else if (cumulativeMultiplicity + multiplicity2 + multiplicityAtOrigin !== this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_INCORRECT_MULTIPLICITY_AT_FIRST_KNOT);
            }
            i++;
        }
        i = 0;
        cumulativeMultiplicity = 0;
        const multiplicityAtRightBound = this.knotSequence[indexRightBoundBasis].multiplicity;
        while ((indexRightBoundBasis + i + 1) < this.knotSequence.length) {
            const interval1 = this.knotSequence[indexRightBoundBasis + i].abscissa - this.knotSequence[indexRightBoundBasis + i + 1].abscissa;
            const multiplicity1 = this.knotSequence[indexRightBoundBasis + (i + 1)].multiplicity;
            const interval2 = this.knotSequence[this._indexKnotOrigin.knotIndex + i].abscissa - this.knotSequence[this._indexKnotOrigin.knotIndex + i + 1].abscissa;
            const multiplicity2 = this.knotSequence[this._indexKnotOrigin.knotIndex + (i + 1)].multiplicity;
            if ((Math.abs(interval1 - interval2) > KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE || multiplicity1 !== multiplicity2) && (indexRightBoundBasis + (i + 1)) < this.knotSequence.length - 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
            }
            else if ((Math.abs(interval1 - interval2) > KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE || multiplicity2 < multiplicity1) && (indexRightBoundBasis + (i + 1)) === this.knotSequence.length - 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
            }
            if ((indexRightBoundBasis + (i + 1)) < this.knotSequence.length - 1) {
                cumulativeMultiplicity += multiplicity1;
            }
            else if (cumulativeMultiplicity + multiplicity1 + multiplicityAtRightBound !== this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", KnotSequences_2.EM_INCORRECT_MULTIPLICITY_AT_LAST_KNOT);
            }
            i++;
        }
    }
    checkNonUniformKnotMultiplicityOrder() {
        this._isKnotMultiplicityNonUniform = false;
    }
    clone() {
        if (this._isSequenceUpToC0Discontinuity) {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: this.allAbscissae });
        }
        else {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: this.allAbscissae });
        }
    }
    computeKnotSequenceFromPeriodicKnotSequence(knotParameters) {
        const minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotIncreasingValues(knotParameters.periodicKnots);
        const openSequence = (0, prepareIncreasingOpenKnotSequenceCC_1.prepareIncreasingOpenKnotSequenceCC)(this._maxMultiplicityOrder, knotParameters);
        for (let i = 0; i < openSequence.knots.length; i++) {
            this.knotSequence.push(new Knot_1.Knot(openSequence.knots[i], openSequence.multiplicities[i]));
        }
        this._uMax = knotParameters.periodicKnots[knotParameters.periodicKnots.length - 1];
        this._indexKnotOrigin.knotIndex = openSequence.indexKnotOrigin.knotIndex;
    }
    toKnotIndexStrictlyIncreasingSequence(index) {
        const strictlyIncreasingKnotSequence = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(this);
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
    isAbscissaCoincidingWithKnot(abscissa) {
        let coincident = false;
        let indexCoincidentKnot = 0;
        for (const knot of this.knotSequence) {
            if (Math.abs(abscissa - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                coincident = true;
                break;
            }
            indexCoincidentKnot++;
        }
        if (coincident) {
            if (indexCoincidentKnot < this._indexKnotOrigin.knotIndex || abscissa > this._uMax) {
                this.throwRangeErrorMessage("isAbscissaCoincidingWithKnot", KnotSequences_2.EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE);
            }
        }
        return coincident;
    }
    getKnotMultiplicityAtSequenceOrigin() {
        const multiplicity = this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity;
        return multiplicity;
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
                    index += knot.multiplicity;
                    if (Math.abs(u - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
                        if (knot.abscissa === this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].abscissa
                            && this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].multiplicity === this._maxMultiplicityOrder) {
                            index -= this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].multiplicity;
                        }
                        else if (knot.abscissa === this._uMax) {
                            index -= knot.multiplicity;
                        }
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
    decrementMaxMultiplicityOrder() {
        let strictlyIncSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(this);
        let strictlyIncSeq_Mult = strictlyIncSeq.multiplicities();
        const knotIdx_maxMultiplicityOrder = [];
        for (let i = 0; i < strictlyIncSeq_Mult.length; i++) {
            if (strictlyIncSeq_Mult[i] === this._maxMultiplicityOrder)
                knotIdx_maxMultiplicityOrder.push(i);
        }
        for (const index of knotIdx_maxMultiplicityOrder) {
            strictlyIncSeq_Mult[index]--;
        }
        let newKnots = [];
        if (this._maxMultiplicityOrder > 2 || (this._maxMultiplicityOrder === 2 &&
            (knotIdx_maxMultiplicityOrder.length > 0 && knotIdx_maxMultiplicityOrder[0] !== this._indexKnotOrigin.knotIndex ||
                knotIdx_maxMultiplicityOrder.length === 0))) {
            for (let i = 1; i < strictlyIncSeq.allAbscissae.length - 1; i++) {
                for (let j = 0; j < strictlyIncSeq_Mult[i]; j++) {
                    newKnots.push(strictlyIncSeq.allAbscissae[i]);
                }
            }
        }
        else {
            if (this._isSequenceUpToC0Discontinuity) {
                newKnots = new IncreasingOpenKnotSequenceClosedCurve(1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: strictlyIncSeq.allAbscissae }).allAbscissae;
            }
            else {
                newKnots = new IncreasingOpenKnotSequenceClosedCurve(1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: strictlyIncSeq.allAbscissae }).allAbscissae;
            }
        }
        if (this._isSequenceUpToC0Discontinuity) {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder - 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: newKnots });
        }
        else {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder - 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: newKnots });
        }
    }
    revertKnotSequence() {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }
    decrementKnotMultiplicity(index, checkSequenceConsistency = true) {
        let newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityKnotArrayMutSeq(index, checkSequenceConsistency);
        if (checkSequenceConsistency) {
            const periodicKnotAbscissae = [];
            const periodicKnotMultiplicities = [];
            for (let i = newKnotSequence._indexKnotOrigin.knotIndex; i < newKnotSequence.knotSequence.length; i++) {
                if (newKnotSequence.knotSequence[i].abscissa <= newKnotSequence._uMax) {
                    periodicKnotAbscissae.push(newKnotSequence.knotSequence[i].abscissa);
                    periodicKnotMultiplicities.push(newKnotSequence.knotSequence[i].multiplicity);
                }
            }
            let strctIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnotAbscissae, multiplicities: periodicKnotMultiplicities });
            const incSeqAbscissae = strctIncSeq.toIncreasingSeqOfAbscissae();
            if (this._isSequenceUpToC0Discontinuity) {
                return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: incSeqAbscissae });
            }
            else {
                return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: incSeqAbscissae });
            }
        }
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
        const periodicKnotAbscissae = [];
        const periodicKnotMultiplicities = [];
        for (let i = this._indexKnotOrigin.knotIndex; i < this.knotSequence.length; i++) {
            if (this.knotSequence[i].abscissa <= this._uMax) {
                periodicKnotAbscissae.push(this.knotSequence[i].abscissa);
                periodicKnotMultiplicities.push(this.knotSequence[i].multiplicity);
            }
        }
        this.knotSequence = previousKnotSequence;
        let strctIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnotAbscissae, multiplicities: periodicKnotMultiplicities });
        const incSeqAbscissae = strctIncSeq.toIncreasingSeqOfAbscissae();
        if (this._isSequenceUpToC0Discontinuity) {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: incSeqAbscissae });
        }
        else {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: incSeqAbscissae });
        }
    }
}
exports.IncreasingOpenKnotSequenceClosedCurve = IncreasingOpenKnotSequenceClosedCurve;
