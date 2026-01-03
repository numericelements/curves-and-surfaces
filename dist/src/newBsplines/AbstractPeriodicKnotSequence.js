"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPeriodicKnotSequence = void 0;
const AbstractKnotSequence_1 = require("./AbstractKnotSequence");
const Knot_1 = require("./Knot");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const KnotSequences_1 = require("../ErrorMessages/KnotSequences");
const KnotSequences_2 = require("../namedConstants/KnotSequences");
class AbstractPeriodicKnotSequence extends AbstractKnotSequence_1.AbstractKnotSequence {
    constructor(maxMultiplicityOrder, knotParameters) {
        super(maxMultiplicityOrder);
        this._isKnotMultiplicityNonUniform = false;
        this.knotSequence = [];
        this._uMax = KnotSequences_2.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if (knotParameters.type === KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE) {
            this.computeKnotSequenceFromMaxMultiplicityOrder();
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE) {
            this.computeUniformKnotSequenceFromBsplBasisSize(knotParameters);
        }
    }
    get uMax() {
        return this._uMax;
    }
    get isKnotMultiplicityNonUniform() {
        return this._isKnotMultiplicityNonUniform;
    }
    checkNonUniformKnotMultiplicityOrder() {
        this._isKnotMultiplicityNonUniform = false;
    }
    checkNormalizedBasisOrigin() {
        if (this.knotSequence[0].abscissa !== KnotSequences_2.KNOT_SEQUENCE_ORIGIN) {
            this.throwRangeErrorMessage('checkNormalizedBasisOrigin', KnotSequences_1.EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
        }
    }
    getPeriod() {
        return this.knotSequence[this.knotSequence.length - 1].abscissa - this.knotSequence[0].abscissa;
    }
    lastKnot() {
        return this.knotSequence[this.knotSequence.length - 1].abscissa;
    }
    checkKnotMultiplicitiesAtNormalizedBasisBoundaries() {
        if (this.knotSequence[0].multiplicity !== this.knotSequence[this.knotSequence.length - 1].multiplicity) {
            this.throwRangeErrorMessage("checkKnotMultiplicitiesAtNormalizedBasisBoundaries", KnotSequences_1.EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER);
        }
    }
    computeKnotSequenceFromMaxMultiplicityOrder() {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        let upperBound = this._maxMultiplicityOrder + 1;
        if (this._maxMultiplicityOrder === 1)
            upperBound = this._maxMultiplicityOrder + 2;
        for (let i = 0; i < upperBound; i++) {
            this.knotSequence.push(new Knot_1.Knot(i, 1));
        }
        this._uMax = this._maxMultiplicityOrder + 1;
    }
    computeUniformKnotSequenceFromBsplBasisSize(knotParameters) {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputBspBasisSizeAssessment(knotParameters);
        for (let i = 0; i < knotParameters.BsplBasisSize; i++) {
            this.knotSequence.push(new Knot_1.Knot(i, 1));
        }
        this._uMax = this.knotSequence[this.knotSequence.length - 1].abscissa;
    }
    decrementKnotMultiplicityMutSeq(index) {
        if (!Array.isArray(index))
            index = [index];
        for (const ind of index) {
            this.strictlyIncKnotIndexInputParamAssessment(ind, "decrementKnotMultiplicityMutSeq");
            if (this.knotSequence[ind.knotIndex].multiplicity === 1) {
                if (ind.knotIndex === 0 || ind.knotIndex === this.knotSequence.length - 1) {
                    this.throwRangeErrorMessage("decrementKnotMultiplicityMutSeq", KnotSequences_1.EM_SEQUENCE_ORIGIN_REMOVAL);
                }
                const abscissae = this.distinctAbscissae();
                const multiplicities = this.multiplicities();
                abscissae.splice(ind.knotIndex, 1);
                multiplicities.splice(ind.knotIndex, 1);
                this.knotSequence = [];
                let i = 0;
                for (const abscissa of abscissae) {
                    const knot = new Knot_1.Knot(abscissa, multiplicities[i]);
                    this.knotSequence.push(knot);
                    i++;
                }
            }
            else {
                this.knotSequence[ind.knotIndex].multiplicity--;
                if (ind.knotIndex === 0) {
                    this.knotSequence[this.knotSequence.length - 1].multiplicity--;
                }
                else if (ind.knotIndex === (this.knotSequence.length - 1)) {
                    this.knotSequence[0].multiplicity--;
                }
            }
        }
        this.checkUniformityOfKnotSpacing();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }
    raiseKnotMultiplicityArrayMutSeq(indicesArray, multiplicity) {
        if (!Array.isArray(indicesArray))
            indicesArray = [indicesArray];
        for (const index of indicesArray) {
            const indexWithinPeriod = index.knotIndex % (this.knotSequence.length - 1);
            this.knotSequence[indexWithinPeriod].multiplicity += multiplicity;
            this.checkMaxMultiplicityOrderConsistency();
            if (indexWithinPeriod === 0)
                this.knotSequence[this.knotSequence.length - 1].multiplicity += multiplicity;
        }
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }
    insertKnotMutSeq(abscissae, multiplicity = 1) {
        if (!Array.isArray(abscissae))
            abscissae = [abscissae];
        for (const abscissa of abscissae) {
            if (this.isAbscissaCoincidingWithKnot(abscissa)) {
                this.throwRangeErrorMessage("insertKnot", KnotSequences_1.EM_ABSCISSA_TOO_CLOSE_TO_KNOT);
            }
            if (abscissa < this.knotSequence[0].abscissa) {
                this.throwRangeErrorMessage("insertKnot", KnotSequences_1.EM_KNOT_INSERTION_UNDER_SEQORIGIN);
            }
            else if (abscissa > this.knotSequence[this.knotSequence.length - 1].abscissa) {
                this.throwRangeErrorMessage("insertKnot", KnotSequences_1.EM_KNOT_INSERTION_OVER_UMAX);
            }
            this.maxMultiplicityOrderInputParamAssessment(multiplicity, "insertKnot");
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            let i = 0;
            while (i < (this.knotSequence.length - 1)) {
                if (this.knotSequence[i].abscissa < abscissa && abscissa < this.knotSequence[i + 1].abscissa)
                    break;
                i++;
            }
            this.knotSequence.splice((i + 1), 0, knot);
            this.checkUniformityOfKnotSpacing();
            this.checkUniformityOfKnotMultiplicity();
            this.checkNonUniformKnotMultiplicityOrder();
        }
    }
}
exports.AbstractPeriodicKnotSequence = AbstractPeriodicKnotSequence;
