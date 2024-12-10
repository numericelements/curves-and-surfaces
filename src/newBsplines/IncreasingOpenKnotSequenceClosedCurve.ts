import { KNOT_COINCIDENCE_TOLERANCE, OPEN_KNOT_SEQUENCE_ORIGIN, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA } from "../namedConstants/KnotSequences";
import { AbstractIncreasingOpenKnotSequence } from "./AbstractIncreasingOpenKnotSequence";
import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, IncreasingOpenKnotSequenceClosedCurve_type, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS } from "./KnotSequenceConstructorInterface";
import { fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC } from "./KnotSequenceConversionAndUtilities";
import { EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE, EM_INCORRECT_MULTIPLICITY_AT_FIRST_KNOT, EM_INCORRECT_MULTIPLICITY_AT_LAST_KNOT, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_U_OUTOF_KNOTSEQ_RANGE } from "../ErrorMessages/KnotSequences";

export class IncreasingOpenKnotSequenceClosedCurve extends AbstractIncreasingOpenKnotSequence {

    constructor(maxMultiplicityOrder: number, knotParameters: IncreasingOpenKnotSequenceClosedCurve_type) {
        super(maxMultiplicityOrder, knotParameters);
        // The validity of the knot sequence should follow the given sequence of calls
        // to make sure that the sequence origin is correctly set first since it is used
        // when checking the degree consistency and knot multiplicities outside the effective curve interval
        this.checkNonUniformKnotMultiplicityOrder();
        this.checkUniformityOfKnotMultiplicity();
        this.checkUniformityOfKnotSpacing();
        if(knotParameters.type === INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS || knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVE
            || knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS) {
            this.checkCurveOrigin();
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

    checkKnotIntervalConsistency(): void {
        if(this.knotSequence[0].multiplicity >= this._maxMultiplicityOrder && this.knotSequence[this.knotSequence.length - 1].multiplicity >= this._maxMultiplicityOrder) return;

        if(this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa !== OPEN_KNOT_SEQUENCE_ORIGIN) this.throwRangeErrorMessage("checkKnotIntervalConsistency", EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
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
            } else if(cumulativeMultiplicity + multiplicity1 + multiplicityAtOrigin !== this._maxMultiplicityOrder) {
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
        if(u < OPEN_KNOT_SEQUENCE_ORIGIN || u > this._uMax) {
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
                        if(this._isKnotMultiplicityUniform && index === (this.knotSequence.length - this._maxMultiplicityOrder + 1)) index -= 1;
                        return new KnotIndexIncreasingSequence(index - 1);
                    }
                }
            }
            
            // Do binary search
            let low = this._indexKnotOrigin.knotIndex;
            let high = this.knotSequence.length - 1 - this._indexKnotOrigin.knotIndex;
            index = Math.floor((low + high) / 2);
        
            while (!(this.knotSequence[index].abscissa < u && u < this.knotSequence[index + 1].abscissa)) {
                if (u < this.knotSequence[index].abscissa) {
                    high = index;
                } else {
                    low = index;
                }
                index = Math.floor((low + high) / 2);
            }
            let indexSeq = 0;
            for(let i = 0; i < (index + 1); i++) {
                indexSeq += this.knotSequence[i].multiplicity; 
            }
            index = indexSeq - 1;
            return new KnotIndexIncreasingSequence(index);
        }
        return new KnotIndexIncreasingSequence(index);
    }

    decrementMaxMultiplicityOrder(): IncreasingOpenKnotSequenceClosedCurve {
        const strictlyIncSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(this);
        const strictlyIncSeq_Mult = strictlyIncSeq.multiplicities();
        const knotIdx_maxMultiplicityOrder: number[] = [];
        for(let i = 0; i < strictlyIncSeq_Mult.length; i++) {
            if(strictlyIncSeq_Mult[i] === this._maxMultiplicityOrder) knotIdx_maxMultiplicityOrder.push(i);
        }
        for(const multiplicity of knotIdx_maxMultiplicityOrder) {
            strictlyIncSeq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(multiplicity), false);
        }
        let newKnots: number[] = [];
        if(this._maxMultiplicityOrder > 2 || (this._maxMultiplicityOrder === 2 && 
            (knotIdx_maxMultiplicityOrder.length > 0 && knotIdx_maxMultiplicityOrder[0] !== this._indexKnotOrigin.knotIndex ||
            knotIdx_maxMultiplicityOrder.length === 0))) {
            const newIncKnotSeq = strictlyIncSeq.toIncreasingKnotSequence();
            newKnots = newIncKnotSeq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1),
                new KnotIndexIncreasingSequence(newIncKnotSeq.length() - 2));
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

}