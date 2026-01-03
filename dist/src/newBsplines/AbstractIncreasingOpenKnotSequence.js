"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractIncreasingOpenKnotSequence = void 0;
const AbstractOpenKnotSequence_1 = require("./AbstractOpenKnotSequence");
const Knot_1 = require("./Knot");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const KnotSequences_1 = require("../ErrorMessages/KnotSequences");
const KnotSequences_2 = require("../namedConstants/KnotSequences");
const KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
const Knots_1 = require("../namedConstants/Knots");
const adaptParameterRaiseKnotMultiplicity_1 = require("./KnotSequenceAndUtilities/adaptParameterRaiseKnotMultiplicity");
const adaptParameterInsertKnot_1 = require("./KnotSequenceAndUtilities/adaptParameterInsertKnot");
const adaptParameterDecrementKnotMultiplicity_1 = require("./KnotSequenceAndUtilities/adaptParameterDecrementKnotMultiplicity");
class AbstractIncreasingOpenKnotSequence extends AbstractOpenKnotSequence_1.AbstractOpenKnotSequence {
    constructor(maxMultiplicityOrder, knotParameters) {
        super(maxMultiplicityOrder, knotParameters);
        this._indexKnotOrigin = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        this._isSequenceUpToC0Discontinuity = false;
        if (knotParameters.type === KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE) {
            this._indexKnotOrigin.knotIndex = 0;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE) {
            this._indexKnotOrigin.knotIndex = this._maxMultiplicityOrder - 1;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            this._indexKnotOrigin.knotIndex = 0;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY
            || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            if (knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS)
                this._isSequenceUpToC0Discontinuity = true;
            this.generateKnotSequence(knotParameters);
        }
    }
    get allAbscissae() {
        const abscissae = [];
        for (const knot of this) {
            if (knot !== undefined)
                abscissae.push(knot);
        }
        return abscissae;
    }
    get indexKnotOrigin() {
        return this._indexKnotOrigin;
    }
    get isSequenceUpToC0Discontinuity() {
        return this._isSequenceUpToC0Discontinuity;
    }
    // temporary add setter while constructors of curve are set adequately
    set isSequenceUpToC0Discontinuity(isSequenceUpToC0Discontinuity) {
        this._isSequenceUpToC0Discontinuity = isSequenceUpToC0Discontinuity;
    }
    [Symbol.iterator]() {
        let nbKnots = 0;
        const knotIndicesKnotAbscissaChange = [];
        for (const multiplicity of this.multiplicities()) {
            nbKnots = nbKnots + multiplicity;
            knotIndicesKnotAbscissaChange.push(nbKnots);
        }
        const lastIndex = nbKnots - 1;
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
    knotIndexInputParamAssessment(index, methodName) {
        if (index.knotIndex > (this.allAbscissae.length - 1)) {
            this.throwRangeErrorMessage(methodName, KnotSequences_1.EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        }
    }
    updateNormalizedBasisOrigin() {
        const normalizedBasisAtStart = this.getKnotIndexNormalizedBasisAtSequenceStart();
        let abscissaOrigin = Knots_1.DEFAULT_KNOT_ABSCISSA_VALUE;
        if (normalizedBasisAtStart.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            abscissaOrigin = this.abscissaAtIndex(this.toKnotIndexIncreasingSequence(normalizedBasisAtStart.knot));
        }
        if (abscissaOrigin !== KnotSequences_2.KNOT_SEQUENCE_ORIGIN)
            this.throwRangeErrorMessage("checkNormalizedBasisOrigin", KnotSequences_1.EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
    }
    generateKnotSequence(knotParameters) {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotIncreasingValues(knotParameters.knots);
        this.knotSequence.push(new Knot_1.Knot(knotParameters.knots[0], 1));
        for (let i = 1; i < knotParameters.knots.length; i++) {
            if (knotParameters.knots[i] === this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity++;
            }
            else {
                this.knotSequence.push(new Knot_1.Knot(knotParameters.knots[i], 1));
            }
        }
        this.checkMaxMultiplicityOrderConsistency();
        this.checkSizeConsistency(knotParameters.knots);
        if (!this._isSequenceUpToC0Discontinuity)
            this.checkMaxKnotMultiplicityAtIntermediateKnots();
        const { start: normalizedBasisAtStart, end: normalizedBasisAtEnd } = this.getKnotIndicesBoundingNormalizedBasis();
        if (normalizedBasisAtEnd.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.NotNormalized
            || normalizedBasisAtStart.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.NotNormalized) {
            this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_1.EM_NOT_NORMALIZED_BASIS);
        }
        else if (normalizedBasisAtEnd.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            this._uMax = this.abscissaAtIndex(this.toKnotIndexIncreasingSequence(normalizedBasisAtEnd.knot));
        }
        else if (normalizedBasisAtEnd.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_1.EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND);
        }
        if (normalizedBasisAtStart.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            this._indexKnotOrigin = normalizedBasisAtStart.knot;
        }
        else if (normalizedBasisAtStart.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.OverDefined) {
            this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_1.EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
        }
        if (normalizedBasisAtEnd.knot.knotIndex <= normalizedBasisAtStart.knot.knotIndex)
            this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_1.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
    }
    checkSizeConsistency(knots) {
        let size = 0;
        for (const multiplicity of this.multiplicities()) {
            size += multiplicity;
        }
        if (size !== knots.length)
            this.throwRangeErrorMessage("checkSizeConsistency", KnotSequences_1.EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ);
    }
    length() {
        let length = 0;
        for (const knot of this) {
            if (knot !== undefined)
                length++;
        }
        return length;
    }
    abscissaAtIndex(index) {
        this.knotIndexInputParamAssessment(index, "abscissaAtIndex");
        let abscissa = KnotSequences_2.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        let i = 0;
        for (const knot of this) {
            if (i === index.knotIndex && knot !== undefined)
                abscissa = knot;
            i++;
        }
        return abscissa;
    }
    extractSubsetOfAbscissae(knotStart, knotEnd) {
        let knots = [];
        if (!(knotStart.knotIndex >= 0) || !(knotEnd.knotIndex <= this.length() - 1) || !(knotStart.knotIndex <= knotEnd.knotIndex))
            this.throwRangeErrorMessage("extractSubsetOfAbscissae", KnotSequences_1.EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE);
        let index = 0;
        for (const knot of this) {
            if (index >= knotStart.knotIndex && index <= knotEnd.knotIndex) {
                if (knot !== undefined)
                    knots.push(knot);
            }
            index++;
        }
        return knots;
    }
    decrementKnotMultiplicityKnotArrayMutSeq(index, checkSequenceConsistency = true) {
        return super.decrementKnotMultiplicityKnotArrayMutSeq(index, checkSequenceConsistency);
    }
    raiseKnotMultiplicityKnotArrayMutSeq(arrayIndices, multiplicity = 1, checkSequenceConsistency = true) {
        return super.raiseKnotMultiplicityKnotArrayMutSeq(arrayIndices, multiplicity, checkSequenceConsistency);
    }
    insertKnotAbscissaArrayMutSeq(abscissa, multiplicity = 1) {
        return super.insertKnotAbscissaArrayMutSeq(abscissa, multiplicity);
    }
}
__decorate([
    (0, adaptParameterDecrementKnotMultiplicity_1.adaptParameterDecrementKnotMultiplicity)()
], AbstractIncreasingOpenKnotSequence.prototype, "decrementKnotMultiplicityKnotArrayMutSeq", null);
__decorate([
    (0, adaptParameterRaiseKnotMultiplicity_1.adaptParameterRaiseKnotMultiplicity)()
], AbstractIncreasingOpenKnotSequence.prototype, "raiseKnotMultiplicityKnotArrayMutSeq", null);
__decorate([
    (0, adaptParameterInsertKnot_1.adaptParameterInsertKnot)()
], AbstractIncreasingOpenKnotSequence.prototype, "insertKnotAbscissaArrayMutSeq", null);
exports.AbstractIncreasingOpenKnotSequence = AbstractIncreasingOpenKnotSequence;
