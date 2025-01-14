import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";
import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { AbstractStrictlyIncreasingOpenKnotSequence } from "./AbstractStrictlyIncreasingOpenKnotSequence";
import { STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, StrictlyIncreasingOpenKnotSequenceClosedCurve_type, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, STRICTLYINCREASINGPERIODICKNOTSEQUENCE, Uniform_OpenKnotSequence } from "./KnotSequenceConstructorInterface";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "./StrictlyIncreasingPeriodicKnotSequenceClosedCurve";
import { EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE, EM_INCORRECT_MULTIPLICITY_AT_FIRST_KNOT, EM_INCORRECT_MULTIPLICITY_AT_LAST_KNOT, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_SIZENORMALIZED_BSPLINEBASIS } from "../ErrorMessages/KnotSequences";

export class StrictlyIncreasingOpenKnotSequenceClosedCurve extends AbstractStrictlyIncreasingOpenKnotSequence {


    constructor(maxMultiplicityOrder: number, knotParameters: StrictlyIncreasingOpenKnotSequenceClosedCurve_type) {
        super(maxMultiplicityOrder, knotParameters);

        // this._isSequenceOfDerivative = false;
        // The validity of the knot sequence should follow the given sequence of calls
        // to make sure that the sequence origin is correctly set first since it is used
        // when checking the degree consistency and knot multiplicities outside the effective curve interval
        this.checkCurveOrigin();
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
            } else if(cumulativeMultiplicity + multiplicity2 + multiplicityAtOrigin !== this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_INCORRECT_MULTIPLICITY_AT_LAST_KNOT);
            }
            i++;
        }
    }

    constructorInputBspBasisSizeAssessment(knotParameters: Uniform_OpenKnotSequence): void {
        if(knotParameters.BsplBasisSize < this._maxMultiplicityOrder || (this._maxMultiplicityOrder === 2 && knotParameters.BsplBasisSize < (this._maxMultiplicityOrder + 1))) this.throwRangeErrorMessage("constructor", EM_SIZENORMALIZED_BSPLINEBASIS);
}

    getIndexKnotOrigin(): KnotIndexStrictlyIncreasingSequence {
        return new KnotIndexStrictlyIncreasingSequence(this._indexKnotOrigin.knotIndex);
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
        let index = RETURN_ERROR_CODE;
        if (u < this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa || u > this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].abscissa) {
            const error = new ErrorLog(this.constructor.name, "findSpan", "Parameter u is outside valid span");
            error.logMessage();
        } else {
            if(this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                for(const knot of this.knotSequence) {
                    index ++;
                    if(Math.abs(u - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                        if(knot.abscissa === this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].abscissa) {
                            index = this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1;
                        }
                        return new KnotIndexStrictlyIncreasingSequence(index - 1);
                    }
                }
            }
            const indexAtUmax = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            index = this.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
            return new KnotIndexStrictlyIncreasingSequence(index);
        }
        return new KnotIndexStrictlyIncreasingSequence(index);
    }

    revertKnotSequence(): StrictlyIncreasingOpenKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        // newKnotSequence.revertKnotSequence();
        return newKnotSequence;
    }
}