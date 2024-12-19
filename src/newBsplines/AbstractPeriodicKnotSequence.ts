import { AbstractKnotSequence } from "./AbstractKnotSequence";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { AbstractPeriodicKnotSequenceClosedCurve_type, NO_KNOT_PERIODIC_CURVE, Uniform_PeriodicKnotSequence, UNIFORM_PERIODICKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_SEQUENCE_ORIGIN_REMOVAL } from "../ErrorMessages/KnotSequences";
import { UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences"


export abstract class AbstractPeriodicKnotSequence extends AbstractKnotSequence {

    protected _uMax: number;
    protected knotSequence: Knot[];
    protected _isKnotMultiplicityNonUniform: boolean;

    constructor(maxMultiplicityOrder: number, knotParameters: AbstractPeriodicKnotSequenceClosedCurve_type) {
        super(maxMultiplicityOrder);
        this._isKnotMultiplicityNonUniform = false;
        this.knotSequence = [];
        this._uMax = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if(knotParameters.type === NO_KNOT_PERIODIC_CURVE) {
            this.computeKnotSequenceFromMaxMultiplicityOrder();
        } else if(knotParameters.type === UNIFORM_PERIODICKNOTSEQUENCE) {
            this.computeUniformKnotSequenceFromBsplBasisSize(knotParameters);
        }
    }

    get uMax(): number {
        return this._uMax;
    }

    get isKnotMultiplicityNonUniform(): boolean {
        return this._isKnotMultiplicityNonUniform;
    }

    checkNonUniformKnotMultiplicityOrder(): void {
        this._isKnotMultiplicityNonUniform = false;
    }

    checkCurveOrigin(): void {
        if(this.knotSequence[0].abscissa !== 0.0) {
            this.throwRangeErrorMessage('checkCurveOrigin', EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
        }
    }

    getPeriod(): number {
         return this.knotSequence[this.knotSequence.length - 1].abscissa - this.knotSequence[0].abscissa;
    }

    lastKnot(): number {
        return this.knotSequence[this.knotSequence.length - 1].abscissa;
    }

    length(): number {
        return this.knotSequence.length;
    }

    checkKnotMultiplicitiesAtNormalizedBasisBoundaries(): void {
        if(this.knotSequence[0].multiplicity !== this.knotSequence[this.knotSequence.length - 1].multiplicity) {
            this.throwRangeErrorMessage("checkKnotMultiplicitiesAtNormalizedBasisBoundaries", EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER);
        }
    }

    computeKnotSequenceFromMaxMultiplicityOrder(): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        let upperBound = this._maxMultiplicityOrder + 1;
        if(this._maxMultiplicityOrder === 1) upperBound = this._maxMultiplicityOrder + 2;
        for(let i = 0; i < upperBound; i++) {
            this.knotSequence.push(new Knot(i, 1));
        }
        this._uMax = this._maxMultiplicityOrder + 1;
    }

    computeUniformKnotSequenceFromBsplBasisSize(knotParameters: Uniform_PeriodicKnotSequence): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputBspBasisSizeAssessment(knotParameters);
        for(let i = 0; i < knotParameters.BsplBasisSize; i++) {
            this.knotSequence.push(new Knot(i, 1));
        }
        this._uMax = this.knotSequence[this.knotSequence.length - 1].abscissa;
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): void {
        this.strictlyIncKnotIndexInputParamAssessment(index, "decrementKnotMultiplicity");
        if(this.knotSequence[index.knotIndex].multiplicity === 1) {
            if(index.knotIndex === 0 || index.knotIndex === this.knotSequence.length - 1) {
                this.throwRangeErrorMessage("decrementKnotMultiplicity", EM_SEQUENCE_ORIGIN_REMOVAL);
            }
            const abscissae = this.distinctAbscissae();
            const multiplicities = this.multiplicities();
            abscissae.splice(index.knotIndex, 1);
            multiplicities.splice(index.knotIndex, 1);
            this.knotSequence = [];
            let i = 0;
            for(const abscissa of abscissae) {
                const knot = new Knot(abscissa, multiplicities[i]);
                this.knotSequence.push(knot);
                i++;
            }
        } else {
            this.knotSequence[index.knotIndex].multiplicity--;
            if(index.knotIndex === 0) {
                this.knotSequence[this.knotSequence.length - 1].multiplicity--;
            } else if(index.knotIndex === (this.knotSequence.length - 1)) {
                this.knotSequence[0].multiplicity--;
            }
        }
        this.checkUniformityOfKnotSpacing();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

}