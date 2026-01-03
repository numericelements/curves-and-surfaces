"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractStrictlyIncreasingOpenKnotSequence = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const AbstractOpenKnotSequence_1 = require("./AbstractOpenKnotSequence");
const Knot_1 = require("./Knot");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const KnotSequences_1 = require("../ErrorMessages/KnotSequences");
const KnotSequences_2 = require("../namedConstants/KnotSequences");
const KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
const Knots_1 = require("../namedConstants/Knots");
const adaptParameterInsertKnot_1 = require("./KnotSequenceAndUtilities/adaptParameterInsertKnot");
const adaptParameterRaiseKnotMultiplicity_1 = require("./KnotSequenceAndUtilities/adaptParameterRaiseKnotMultiplicity");
const KnotSequences_3 = require("../WarningMessages/KnotSequences");
class AbstractStrictlyIncreasingOpenKnotSequence extends AbstractOpenKnotSequence_1.AbstractOpenKnotSequence {
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
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE || knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY ||
            knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS || knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            if (knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY || knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS)
                this._isSequenceUpToC0Discontinuity = true;
            this.generateKnotSequence(knotParameters);
        }
    }
    get allAbscissae() {
        const abscissae = [];
        for (const knot of this) {
            if (knot !== undefined)
                abscissae.push(knot.abscissa);
        }
        return abscissae;
    }
    get indexKnotOrigin() {
        return this._indexKnotOrigin;
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
    checkKnotMultiplicities(multiplicities) {
        for (let i = 0; i < multiplicities.length; i++) {
            if (multiplicities[i] <= 0)
                this.throwRangeErrorMessage("checkKnotMultiplicities", KnotSequences_1.EM_KNOT_MULTIPLICITY_OUT_OF_RANGE);
        }
    }
    updateNormalizedBasisOrigin() {
        const normalizedBasisAtStart = this.getKnotIndexNormalizedBasisAtSequenceStart();
        let abscissaOrigin = Knots_1.DEFAULT_KNOT_ABSCISSA_VALUE;
        if (normalizedBasisAtStart.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            abscissaOrigin = this.abscissaAtIndex(normalizedBasisAtStart.knot);
        }
        if (abscissaOrigin !== KnotSequences_2.KNOT_SEQUENCE_ORIGIN)
            this.throwRangeErrorMessage("checkNormalizedBasisOrigin", KnotSequences_1.EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
    }
    generateKnotSequence(knotParameters) {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotStrictlyIncreasingValues(knotParameters.knots);
        this.checkKnotMultiplicities(knotParameters.multiplicities);
        for (let i = 0; i < knotParameters.knots.length; i++) {
            this.knotSequence.push(new Knot_1.Knot(knotParameters.knots[i], knotParameters.multiplicities[i]));
        }
        this.checkMaxMultiplicityOrderConsistency();
        if (!this._isSequenceUpToC0Discontinuity)
            this.checkMaxKnotMultiplicityAtIntermediateKnots();
        const { start: normalizedBasisAtStart, end: normalizedBasisAtEnd } = this.getKnotIndicesBoundingNormalizedBasis();
        if (normalizedBasisAtEnd.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.NotNormalized
            || normalizedBasisAtStart.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.NotNormalized) {
            this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_1.EM_NOT_NORMALIZED_BASIS);
        }
        else if (normalizedBasisAtEnd.basisAtSeqExt === KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            this._uMax = this.abscissaAtIndex(normalizedBasisAtEnd.knot);
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
        if (knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS || knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
            const periodicKnotLength = normalizedBasisAtEnd.knot.knotIndex - normalizedBasisAtStart.knot.knotIndex;
            if (this._maxMultiplicityOrder === 2 && periodicKnotLength < 3)
                this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_1.EM_SIZENORMALIZED_BSPLINEBASIS);
            let cumulative_multiplicities = 0;
            for (let i = this._indexKnotOrigin.knotIndex + 1; i < this._indexKnotOrigin.knotIndex + periodicKnotLength; i++) {
                cumulative_multiplicities += knotParameters.multiplicities[i];
            }
            if (cumulative_multiplicities < (this._maxMultiplicityOrder - this.knotMultiplicity(this._indexKnotOrigin))) {
                const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "generateKnotSequence", KnotSequences_3.WM_GEOMETRIC_CONSTRAINTS_POLYGON_VERTICES);
                warning.logMessage();
                if (this.knotMultiplicity(this._indexKnotOrigin) === 1)
                    this.throwRangeErrorMessage("generateKnotSequence", KnotSequences_1.EM_SIZENORMALIZED_BSPLINEBASIS);
            }
        }
    }
    length() {
        return this.knotSequence.length;
    }
    knotIndexInputParamAssessment(index, methodName) {
        if (index.knotIndex > (this.allAbscissae.length - 1)) {
            this.throwRangeErrorMessage(methodName, KnotSequences_1.EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        }
    }
    abscissaAtIndex(index) {
        this.knotIndexInputParamAssessment(index, "abscissaAtIndex");
        let abscissa = KnotSequences_2.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        let i = 0;
        for (const knot of this) {
            if (i === index.knotIndex && knot !== undefined)
                abscissa = knot.abscissa;
            i++;
        }
        return abscissa;
    }
    raiseKnotMultiplicityKnotArrayMutSeq(arrayIndices, multiplicity = 1, checkSequenceConsistency = true) {
        return super.raiseKnotMultiplicityKnotArrayMutSeq(arrayIndices, multiplicity, checkSequenceConsistency);
    }
    insertKnotAbscissaArrayMutSeq(abscissa, multiplicity = 1) {
        return super.insertKnotAbscissaArrayMutSeq(abscissa, multiplicity);
    }
}
__decorate([
    (0, adaptParameterRaiseKnotMultiplicity_1.adaptParameterRaiseKnotMultiplicity)()
], AbstractStrictlyIncreasingOpenKnotSequence.prototype, "raiseKnotMultiplicityKnotArrayMutSeq", null);
__decorate([
    (0, adaptParameterInsertKnot_1.adaptParameterInsertKnot)()
], AbstractStrictlyIncreasingOpenKnotSequence.prototype, "insertKnotAbscissaArrayMutSeq", null);
exports.AbstractStrictlyIncreasingOpenKnotSequence = AbstractStrictlyIncreasingOpenKnotSequence;
