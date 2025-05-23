import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { Knot } from "./Knot";
import { AbstractStrictlyIncreasingOpenKnotSequence } from "./AbstractStrictlyIncreasingOpenKnotSequence";
import { STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, StrictlyIncreasingOpenKnotSequenceCCurve, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, StrictlyIncreasingOpenKnotSequenceClosedCurve_type, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, STRICTLYINCREASINGPERIODICKNOTSEQUENCE, Uniform_OpenKnotSequence } from "./KnotSequenceConstructorInterface";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "./StrictlyIncreasingPeriodicKnotSequenceClosedCurve";
import { EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE, EM_INCORRECT_MULTIPLICITY_AT_FIRST_KNOT, EM_INCORRECT_MULTIPLICITY_AT_LAST_KNOT, EM_MAXMULTIPLICITY_ORDER_KNOT, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_SIZENORMALIZED_BSPLINEBASIS, EM_U_OUTOF_KNOTSEQ_RANGE } from "../ErrorMessages/KnotSequences";
import { prepareStrictlyIncreasingOpenKnotSequenceCC } from "./KnotSequenceAndUtilities/prepareStrictlyIncreasingOpenKnotSequenceCC";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";

export class StrictlyIncreasingOpenKnotSequenceClosedCurve extends AbstractStrictlyIncreasingOpenKnotSequence {


    constructor(maxMultiplicityOrder: number, knotParameters: StrictlyIncreasingOpenKnotSequenceClosedCurve_type) {
        super(maxMultiplicityOrder, knotParameters);
        if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE) {
            this.computeKnotSequenceFromPeriodicKnotSequence(knotParameters);
        }
        // this._isSequenceOfDerivative = false;
        // The validity of the knot sequence should follow the given sequence of calls
        // to make sure that the sequence origin is correctly set first since it is used
        // when checking the degree consistency and knot multiplicities outside the effective curve interval
        this.updateNormalizedBasisOrigin();
        this.checkMaxMultiplicityOrderConsistency();
        this.checkKnotIntervalConsistency();
        this.checkUniformityOfKnotSpacing();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }


    // // freeKnots is an accessor available for B-Spline curves to obtain a subset of a knot sequence, associated with control points
    // // that can be available as a free parameter subset for some applications, e.g., optimization
    // // here it is the abscissa only that can be regarded as free parameters, their multiplicity order is not considered (care must be taken about this point)
    // get freeKnots(): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
    //     const abscissae = this.periodicKnots.allAbscissae.slice(0, this.periodicKnots.allAbscissae.length - 2);
    //     const multiplicities: number[] = [];

    //     return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder - 1, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: abscissae, multiplicities: multiplicities});
    //     // const freeKnots = this.periodicKnots;
    //     // freeKnots.splice(0, 1);
    //     // freeKnots.splice(freeKnots.length - 1, 1);
    //     // return freeKnots;
    // }

    get periodicKnots(): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
        const abscissae: number[] = [];
        const multiplicities: number[] = [];
        for(let i = this._indexKnotOrigin.knotIndex; i <= this.getKnotIndexNormalizedBasisAtSequenceEnd().knot.knotIndex; i++) {
            abscissae.push(this.knotSequence[i].abscissa);
            multiplicities.push(this.knotSequence[i].multiplicity)
        }
        return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(this._maxMultiplicityOrder - 1, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: abscissae, multiplicities: multiplicities});
    }

    get isSequenceUpToC0Discontinuity(): boolean {
        return this._isSequenceUpToC0Discontinuity;
    }

    checkNonUniformKnotMultiplicityOrder(): void {
        this._isKnotMultiplicityNonUniform = false;
    }

    checkKnotIntervalConsistency(): void {
        if(this.knotSequence[0].multiplicity >= this._maxMultiplicityOrder && this.knotSequence[this.knotSequence.length - 1].multiplicity >= this._maxMultiplicityOrder) return;

        if(this.abscissaAtIndex(this._indexKnotOrigin) !== KNOT_SEQUENCE_ORIGIN) this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
        const normalizedBasis = this.getKnotIndicesBoundingNormalizedBasis()
        const indexKnotOrigin = normalizedBasis.start.knot.knotIndex;
        const multiplicityAtOrigin = this.knotSequence[indexKnotOrigin].multiplicity
        const indexEnd = normalizedBasis.end.knot.knotIndex;
        let i = 0;
        let cumulativeMultiplicity = 0;
        while((indexKnotOrigin - i) !== 0) {
            const interval1 = this.knotSequence[indexEnd - i].abscissa - this.knotSequence[indexEnd - i - 1].abscissa;
            const multiplicity1 = this.knotSequence[indexEnd - (i + 1)].multiplicity;
            const interval2 = this.knotSequence[indexKnotOrigin - (i + 1)].abscissa - this.knotSequence[indexKnotOrigin - i].abscissa;
            const multiplicity2 = this.knotSequence[indexKnotOrigin - (i + 1)].multiplicity;
            if((Math.abs(interval1 + interval2) > KNOT_COINCIDENCE_TOLERANCE || multiplicity1 !== multiplicity2) && (indexKnotOrigin - i) > 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
            } else if((Math.abs(interval1 + interval2) > KNOT_COINCIDENCE_TOLERANCE || multiplicity1 < multiplicity2) && (indexKnotOrigin - i) === 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
            }
            if((indexKnotOrigin - i) > 1) {
                cumulativeMultiplicity += multiplicity1;
            } else if(cumulativeMultiplicity + multiplicity2 + multiplicityAtOrigin !== this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_INCORRECT_MULTIPLICITY_AT_FIRST_KNOT);
            }
            i++;
        }
        i = 0;
        cumulativeMultiplicity = 0;
        const multiplicityAtRightBound = this.knotSequence[indexEnd].multiplicity;
        while((indexEnd + i) < (this.knotSequence.length - 1)) {
            const interval1 = this.knotSequence[indexKnotOrigin + (i + 1)].abscissa - this.knotSequence[indexKnotOrigin + i].abscissa;
            const multiplicity1 = this.knotSequence[indexKnotOrigin + (i + 1)].multiplicity;
            const interval2 = this.knotSequence[indexEnd + i].abscissa - this.knotSequence[indexEnd + (i + 1)].abscissa;
            const multiplicity2 = this.knotSequence[indexEnd + (i + 1)].multiplicity;
            if((Math.abs(interval1 + interval2) > KNOT_COINCIDENCE_TOLERANCE || multiplicity1 !== multiplicity2) && (indexEnd + i) < (this.knotSequence.length - 2)) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
            } else if((Math.abs(interval1 + interval2) > KNOT_COINCIDENCE_TOLERANCE || multiplicity1 < multiplicity2) && (indexEnd + i) === (this.knotSequence.length - 2)) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
            }
            if((indexEnd + i) < (this.knotSequence.length - 2)) {
                cumulativeMultiplicity += multiplicity1;
            } else if(cumulativeMultiplicity + multiplicity2 + multiplicityAtRightBound !== this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_INCORRECT_MULTIPLICITY_AT_LAST_KNOT);
            }
            i++;
        }
    }

    constructorInputBspBasisSizeAssessment(knotParameters: Uniform_OpenKnotSequence): void {
        if(knotParameters.BsplBasisSize < this._maxMultiplicityOrder || (this._maxMultiplicityOrder === 2 && knotParameters.BsplBasisSize < (this._maxMultiplicityOrder + 1))) this.throwRangeErrorMessage("constructor", EM_SIZENORMALIZED_BSPLINEBASIS);
    }

    computeKnotSequenceFromPeriodicKnotSequence(knotParameters: StrictlyIncreasingOpenKnotSequenceCCurve): void {
        const minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotStrictlyIncreasingValues(knotParameters.periodicKnots);
        if(this._maxMultiplicityOrder === 2 && knotParameters.periodicKnots.length < 3) this.throwRangeErrorMessage("computeKnotSequenceFromPeriodicKnotSequence", EM_SIZENORMALIZED_BSPLINEBASIS);
        if(this._maxMultiplicityOrder > 2) {
            for(const multiplicity of knotParameters.multiplicities) {
                if(multiplicity > this._maxMultiplicityOrder) this.throwRangeErrorMessage("computeKnotSequenceFromPeriodicKnotSequence", EM_MAXMULTIPLICITY_ORDER_KNOT)
            }
            if(knotParameters.periodicKnots.length <= (1 + this._maxMultiplicityOrder - knotParameters.multiplicities[0])) {
                let cumulative_multiplicities = 0;
                for(let i = 1; i < knotParameters.periodicKnots.length - 1; i++) {
                    cumulative_multiplicities+= knotParameters.multiplicities[i];
                }
                if(cumulative_multiplicities < (this._maxMultiplicityOrder - knotParameters.multiplicities[0])) this.throwRangeErrorMessage("computeKnotSequenceFromPeriodicKnotSequence", EM_SIZENORMALIZED_BSPLINEBASIS);
            }
        }
        const openSequence = prepareStrictlyIncreasingOpenKnotSequenceCC(this._maxMultiplicityOrder, knotParameters);
        const knots = openSequence.knots;
        const multiplicities = openSequence.multiplicities;
        for(let i = 0; i < knots.length; i++) {
            this.knotSequence.push(new Knot(knots[i], multiplicities[i]));
        }
        this._uMax = openSequence.uMax;
        this._indexKnotOrigin = openSequence.indexKnotOrigin;
    }

    isAbscissaCoincidingWithKnot(abscissa: number): boolean {
        let coincident = false;
        let indexCoincidentKnot = 0;
        for(const knot of this.knotSequence) {
            if(Math.abs(abscissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE)
            {
                coincident = true; 
                break;
            }
            indexCoincidentKnot++;
        }
        if(coincident) {
            if(indexCoincidentKnot < this._indexKnotOrigin.knotIndex || abscissa > this._uMax) {
                this.throwRangeErrorMessage("isAbscissaCoincidingWithKnot", EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE);
            }
        }
        return coincident;
    }

    getKnotMultiplicityAtCurveOrigin(): number {
        const multiplicity = this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity;
        return multiplicity;
    }

    // This index transformation is not unique. The convention followed here is the assignment of the first index of the increasing
    // sequence where the abscissa at index (strictly increasing sequence) appears
    toKnotIndexIncreasingSequence(index: KnotIndexStrictlyIncreasingSequence): KnotIndexIncreasingSequence {
        this.strictlyIncKnotIndexInputParamAssessment(index, "toKnotIndexIncreasingSequence")
        let indexIncSeq = 0;
        for(let i = 0; i < index.knotIndex; i++) {
            indexIncSeq += this.knotSequence[i].multiplicity;
        }
        return new KnotIndexIncreasingSequence(indexIncSeq);
    }

    clone(): StrictlyIncreasingOpenKnotSequenceClosedCurve {
        if(this._isSequenceUpToC0Discontinuity) {
            return new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: this.distinctAbscissae(), multiplicities: this.multiplicities()});
        } else {
            return new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: this.distinctAbscissae(), multiplicities: this.multiplicities()});
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
                    index ++;
                    if(Math.abs(u - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                        if(knot.abscissa === this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].abscissa) {
                            index = this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1;
                        }
                        index -= 1;
                        break;
                    }
                }
                return new KnotIndexStrictlyIncreasingSequence(index);
            }
            const indexAtUmax = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            index = this.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
        }
        return new KnotIndexStrictlyIncreasingSequence(index);
    }

    toIncreasingSeqOfAbscissae(): number[] {
        const incKnotAbscissae: number[] = [];
        for (const knot of this) {
            if(knot !== undefined) {
                for(let i = 0; i < knot.multiplicity; i++) {
                    incKnotAbscissae.push(knot.abscissa);
                }
            }
        }
        return incKnotAbscissae;
    }

    revertKnotSequence(): StrictlyIncreasingOpenKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, checkSequenceConsistency: boolean = true): StrictlyIncreasingOpenKnotSequenceClosedCurve {
        let newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityMutSeq(index, checkSequenceConsistency);
        if(checkSequenceConsistency) {
            const periodicKnotAbscissae: number[] = [];
            const periodicKnotMultiplicities: number[] = [];
            for(let i = newKnotSequence._indexKnotOrigin.knotIndex; i < newKnotSequence.knotSequence.length; i++) {
                if(newKnotSequence.knotSequence[i].abscissa <= newKnotSequence._uMax) {
                    periodicKnotAbscissae.push(newKnotSequence.knotSequence[i].abscissa);
                    periodicKnotMultiplicities.push(newKnotSequence.knotSequence[i].multiplicity);
                }
            }
            newKnotSequence = new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnotAbscissae, multiplicities: periodicKnotMultiplicities});
        }
        return newKnotSequence;
    }

    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number = 1, checkSequenceConsistency: boolean = true): StrictlyIncreasingOpenKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.raiseKnotMultiplicityKnotArrayMutSeq(index, multiplicity, checkSequenceConsistency);
        return newKnotSequence;
    }

    insertKnot(abscissae: number | number[], times: number = 1): StrictlyIncreasingOpenKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.insertKnotAbscissaArrayMutSeq(abscissae, times);
        return newKnotSequence;
    }

    updateKnotSequenceThroughNormalizedBasisAnalysis(): StrictlyIncreasingOpenKnotSequenceClosedCurve {
        const previousKnotSequence = this.knotSequence.slice();
        this.updateKnotSequenceThroughNormalizedBasisAnalysisMutSeq();
        const periodicKnotAbscissae: number[] = [];
        const periodicKnotMultiplicities: number[] = [];
        for(let i = this._indexKnotOrigin.knotIndex; i < this.knotSequence.length; i++) {
            if(this.knotSequence[i].abscissa <= this._uMax) {
                periodicKnotAbscissae.push(this.knotSequence[i].abscissa);
                periodicKnotMultiplicities.push(this.knotSequence[i].multiplicity);
            }
        }
        const updatedSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnotAbscissae, multiplicities: periodicKnotMultiplicities});
        this.knotSequence = previousKnotSequence;
        return updatedSeq;
    }
}