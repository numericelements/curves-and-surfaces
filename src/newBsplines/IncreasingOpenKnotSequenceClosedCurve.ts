import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { AbstractIncreasingOpenKnotSequence } from "./AbstractIncreasingOpenKnotSequence";
import { Knot } from "./Knot";
import { INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, IncreasingOpenKnotSequenceClosedCurve_type, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, Uniform_OpenKnotSequence, IncreasingOpenKnotSequenceCCurve, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS } from "./KnotSequenceConstructorInterface";
import { EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE, EM_INCORRECT_MULTIPLICITY_AT_FIRST_KNOT, EM_INCORRECT_MULTIPLICITY_AT_LAST_KNOT, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_SIZENORMALIZED_BSPLINEBASIS, EM_U_OUTOF_KNOTSEQ_RANGE } from "../ErrorMessages/KnotSequences";
import { fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC } from "./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC";
import { prepareIncreasingOpenKnotSequenceCC } from "./KnotSequenceAndUtilities/prepareIncreasingOpenKnotSequenceCC";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "./StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { fromStrictlyIncreasingToIncreasingKnotSequenceCC } from "./KnotSequenceAndUtilities/fromStrictlyIncreasingToIncreasingKnotSequenceCC";

export class IncreasingOpenKnotSequenceClosedCurve extends AbstractIncreasingOpenKnotSequence {

    constructor(maxMultiplicityOrder: number, knotParameters: IncreasingOpenKnotSequenceClosedCurve_type) {
        super(maxMultiplicityOrder, knotParameters);
        if(knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVE) {
            this.computeKnotSequenceFromPeriodicKnotSequence(knotParameters);
        } 
        // The validity of the knot sequence should follow the given sequence of calls
        // to make sure that the sequence origin is correctly set first since it is used
        // when checking the degree consistency and knot multiplicities outside the effective curve interval
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
        if(knotParameters.type === INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS || knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVE
            || knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS) {
            this.updateNormalizedBasisOrigin();
            this.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
            this.checkKnotIntervalConsistency();
        }
        this.checkMaxMultiplicityOrderConsistency();
    }

    // freeKnots is an accessor available for B-Spline curves to obtain a subset of a knot sequence, associated with control points
    // that can be available as a free parameter subset for some applications, e.g., optimization
    get freeKnots(): number [] {
        const freeKnots = this.periodicKnots;
        freeKnots.splice(0, 1);
        freeKnots.splice(freeKnots.length - 1, 1);
        return freeKnots;
    }

    get periodicKnots(): number[] {
        const periodicKnots: number[] = [];
        for(const knot of this) {
            if(knot !== undefined) periodicKnots.push(knot);
        }
        periodicKnots.splice(0, (this._maxMultiplicityOrder - this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity));
        periodicKnots.splice(periodicKnots.length - (this._maxMultiplicityOrder - this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity), (this._maxMultiplicityOrder - this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity));
        return periodicKnots;
    }

    constructorInputBspBasisSizeAssessment(knotParameters: Uniform_OpenKnotSequence): void {
            if(knotParameters.BsplBasisSize < this._maxMultiplicityOrder || (this._maxMultiplicityOrder === 2 && knotParameters.BsplBasisSize < (this._maxMultiplicityOrder + 1))) this.throwRangeErrorMessage("constructor", EM_SIZENORMALIZED_BSPLINEBASIS);
    }

    protected checkKnotIntervalConsistency(): void {
        if(this.knotSequence[0].multiplicity >= this._maxMultiplicityOrder && this.knotSequence[this.knotSequence.length - 1].multiplicity >= this._maxMultiplicityOrder) return;

        if(this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa !== KNOT_SEQUENCE_ORIGIN) this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
        const indexRightBoundBasis = this.getKnotIndexNormalizedBasisAtSequenceEnd().knot.knotIndex;
        const multiplicityAtOrigin = this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity;
        let i = 0;
        let cumulativeMultiplicity = 0;
        while((this._indexKnotOrigin.knotIndex - i) > 0) {
            const interval1 = this.knotSequence[indexRightBoundBasis - (i + 1)].abscissa - this.knotSequence[indexRightBoundBasis - i].abscissa;
            const multiplicity1 = this.knotSequence[indexRightBoundBasis - (i + 1)].multiplicity;
            const interval2 = this.knotSequence[this._indexKnotOrigin.knotIndex - (i + 1)].abscissa - this.knotSequence[this._indexKnotOrigin.knotIndex - i].abscissa;
            const multiplicity2 = this.knotSequence[this._indexKnotOrigin.knotIndex - (i + 1)].multiplicity;
            if((Math.abs(interval1 - interval2) > KNOT_COINCIDENCE_TOLERANCE || multiplicity1 !== multiplicity2) && (this._indexKnotOrigin.knotIndex - i) > 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
            } else if((Math.abs(interval1 - interval2) > KNOT_COINCIDENCE_TOLERANCE || multiplicity1 < multiplicity2) && (this._indexKnotOrigin.knotIndex - i) === 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
            }
            if((this._indexKnotOrigin.knotIndex - i) > 1) {
                cumulativeMultiplicity += multiplicity1;
            } else if(cumulativeMultiplicity + multiplicity2 + multiplicityAtOrigin !== this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_INCORRECT_MULTIPLICITY_AT_FIRST_KNOT);
            }
            i++;
        }
        i = 0;
        cumulativeMultiplicity = 0;
        const multiplicityAtRightBound = this.knotSequence[indexRightBoundBasis].multiplicity;
        while((indexRightBoundBasis + i + 1) < this.knotSequence.length) {
            const interval1 = this.knotSequence[indexRightBoundBasis + i].abscissa - this.knotSequence[indexRightBoundBasis + i + 1].abscissa;
            const multiplicity1 = this.knotSequence[indexRightBoundBasis + (i + 1)].multiplicity;
            const interval2 = this.knotSequence[this._indexKnotOrigin.knotIndex + i].abscissa - this.knotSequence[this._indexKnotOrigin.knotIndex + i + 1].abscissa;
            const multiplicity2 = this.knotSequence[this._indexKnotOrigin.knotIndex + (i + 1)].multiplicity;
            if((Math.abs(interval1 - interval2) > KNOT_COINCIDENCE_TOLERANCE || multiplicity1 !== multiplicity2) && (indexRightBoundBasis + (i + 1)) < this.knotSequence.length - 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
            } else if((Math.abs(interval1 - interval2) > KNOT_COINCIDENCE_TOLERANCE || multiplicity2 < multiplicity1) && (indexRightBoundBasis + (i + 1)) === this.knotSequence.length - 1) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
            }
            if((indexRightBoundBasis + (i + 1)) < this.knotSequence.length - 1) {
                cumulativeMultiplicity += multiplicity1;
            } else if(cumulativeMultiplicity + multiplicity1 + multiplicityAtRightBound !== this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_INCORRECT_MULTIPLICITY_AT_LAST_KNOT);
            }
            i++;
        }
    }

    checkNonUniformKnotMultiplicityOrder(): void {
        this._isKnotMultiplicityNonUniform = false;
    }

    clone(): IncreasingOpenKnotSequenceClosedCurve {
        if(this._isSequenceUpToC0Discontinuity) {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: this.allAbscissae});
        } else {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: this.allAbscissae});
        }
    }

    computeKnotSequenceFromPeriodicKnotSequence(knotParameters: IncreasingOpenKnotSequenceCCurve): void {
        const minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputArrayAssessment(knotParameters);
        this.checkKnotIncreasingValues(knotParameters.periodicKnots);
        const openSequence = prepareIncreasingOpenKnotSequenceCC(this._maxMultiplicityOrder, knotParameters);
        for(let i = 0; i < openSequence.knots.length; i++) {
            this.knotSequence.push(new Knot(openSequence.knots[i], openSequence.multiplicities[i]));
        }
        this._uMax = knotParameters.periodicKnots[knotParameters.periodicKnots.length - 1];
        this._indexKnotOrigin.knotIndex = openSequence.indexKnotOrigin.knotIndex;
    }

    toKnotIndexStrictlyIncreasingSequence(index: KnotIndexIncreasingSequence): KnotIndexStrictlyIncreasingSequence {
        const strictlyIncreasingKnotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(this);
        const abscissa = this.abscissaAtIndex(index);
        let i = 0;
        for(const knot of strictlyIncreasingKnotSequence.allAbscissae) {
            if(knot !== undefined) {
                if(knot === abscissa) break;
                i++;
            }
        }
        return new KnotIndexStrictlyIncreasingSequence(i);
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

    getKnotMultiplicityAtSequenceOrigin(): number {
        const multiplicity = this.knotSequence[this._indexKnotOrigin.knotIndex].multiplicity;
        return multiplicity;
    }

    findSpan(u: number): KnotIndexIncreasingSequence {
        let index = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        if(u < KNOT_SEQUENCE_ORIGIN || u > this._uMax) {
            this.throwRangeErrorMessage("findSpan", EM_U_OUTOF_KNOTSEQ_RANGE);
        } else {
            if(this.isAbscissaCoincidingWithKnot(u)) {
                index = 0;
                for(const knot of this.knotSequence) {
                    index += knot.multiplicity;
                    if(Math.abs(u - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                        if(knot.abscissa === this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].abscissa
                        && this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].multiplicity === this._maxMultiplicityOrder) {
                            index -= this.knotSequence[this.knotSequence.length - this._indexKnotOrigin.knotIndex - 1].multiplicity
                        } else if(knot.abscissa === this._uMax) {
                            index -= knot.multiplicity;
                        }
                        index -= 1;
                        break;
                    }
                }
                return new KnotIndexIncreasingSequence(index);
            }
            const indexAtUmax = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            index = this.findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(u, indexAtUmax.knot.knotIndex);
        }
        return new KnotIndexIncreasingSequence(index);
    }

    decrementMaxMultiplicityOrder(): IncreasingOpenKnotSequenceClosedCurve {
        let strictlyIncSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(this);
        let strictlyIncSeq_Mult = strictlyIncSeq.multiplicities();
        const knotIdx_maxMultiplicityOrder: number[] = [];
        for(let i = 0; i < strictlyIncSeq_Mult.length; i++) {
            if(strictlyIncSeq_Mult[i] === this._maxMultiplicityOrder) knotIdx_maxMultiplicityOrder.push(i);
        }
        for(const index of knotIdx_maxMultiplicityOrder) {
            strictlyIncSeq_Mult[index]--;
        }
        let newKnots: number[] = [];
        if(this._maxMultiplicityOrder > 2 || (this._maxMultiplicityOrder === 2 && 
            (knotIdx_maxMultiplicityOrder.length > 0 && knotIdx_maxMultiplicityOrder[0] !== this._indexKnotOrigin.knotIndex ||
            knotIdx_maxMultiplicityOrder.length === 0))) {
            for(let i = 1; i < strictlyIncSeq.allAbscissae.length - 1; i++) {
                for(let j = 0; j < strictlyIncSeq_Mult[i]; j++) {
                    newKnots.push(strictlyIncSeq.allAbscissae[i]);
                }
            }
        } else {
            if(this._isSequenceUpToC0Discontinuity) {
                newKnots = new IncreasingOpenKnotSequenceClosedCurve(1, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: strictlyIncSeq.allAbscissae}).allAbscissae;
            } else {
                newKnots = new IncreasingOpenKnotSequenceClosedCurve(1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: strictlyIncSeq.allAbscissae}).allAbscissae;
            }
        }
        if(this._isSequenceUpToC0Discontinuity) {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder - 1, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: newKnots});
        } else {
            return new IncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder - 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: newKnots});
        }
    }

    revertKnotSequence(): IncreasingOpenKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.revertKnotSpacing();
        return newKnotSequence;
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>, checkSequenceConsistency: boolean = true): IncreasingOpenKnotSequenceClosedCurve {
        let newKnotSequence = this.clone();
        newKnotSequence.decrementKnotMultiplicityKnotArrayMutSeq(index, checkSequenceConsistency);
        if(checkSequenceConsistency) {
            const periodicKnotAbscissae: number[] = [];
            const periodicKnotMultiplicities: number[] = [];
            for(let i = newKnotSequence._indexKnotOrigin.knotIndex; i < newKnotSequence.knotSequence.length; i++) {
                if(newKnotSequence.knotSequence[i].abscissa <= newKnotSequence._uMax) {
                    periodicKnotAbscissae.push(newKnotSequence.knotSequence[i].abscissa);
                    periodicKnotMultiplicities.push(newKnotSequence.knotSequence[i].multiplicity);
                }
            }
            let strctIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnotAbscissae, multiplicities: periodicKnotMultiplicities});
            newKnotSequence = fromStrictlyIncreasingToIncreasingKnotSequenceCC(strctIncSeq);
            if(this._isSequenceUpToC0Discontinuity) {
                strctIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: strctIncSeq.distinctAbscissae(), multiplicities: strctIncSeq.multiplicities()});
                newKnotSequence = fromStrictlyIncreasingToIncreasingKnotSequenceCC(strctIncSeq);
            }
        }
        return newKnotSequence;
    }

    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>, multiplicity: number = 1, checkSequenceConsistency: boolean = true): IncreasingOpenKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.raiseKnotMultiplicityKnotArrayMutSeq(index, multiplicity, checkSequenceConsistency);
        return newKnotSequence;
    }

    insertKnot(abscissae: number | number[], multiplicity: number = 1): IncreasingOpenKnotSequenceClosedCurve {
        const newKnotSequence = this.clone();
        newKnotSequence.insertKnotAbscissaArrayMutSeq(abscissae, multiplicity);
        return newKnotSequence;
    }

    updateKnotSequenceThroughNormalizedBasisAnalysis(): IncreasingOpenKnotSequenceClosedCurve {
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
        let strctIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnotAbscissae, multiplicities: periodicKnotMultiplicities});
        let updatedSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(strctIncSeq);
        if(this._isSequenceUpToC0Discontinuity) {
            strctIncSeq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(this._maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: strctIncSeq.distinctAbscissae(), multiplicities: strctIncSeq.multiplicities()});
            updatedSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(strctIncSeq);
        }
        this.knotSequence = previousKnotSequence;
        return updatedSeq;
    }
}