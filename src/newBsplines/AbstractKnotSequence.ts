import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { INCREASINGOPENKNOTSEQUENCE, IncreasingOpenKnotSequence, IncreasingOpenKnotSequenceCCurve, IncreasingOpenKnotSequenceCCurve_allKnots, INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, IncreasingOpenKnotSequenceUpToC0Discontinuity, IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, INCREASINGPERIODICKNOTSEQUENCE, IncreasingPeriodicKnotSequence, INCREASINGPERIODICKNOTSUBSEQUENCE, IncreasingPeriodicKnotSubSequence, StrictIncreasingPeriodicKnotSequence, StrictlyIncreasingOpenKnotSequence, STRICTLYINCREASINGOPENKNOTSEQUENCE, StrictlyIncreasingOpenKnotSequenceCCurve, StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity, StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, STRICTLYINCREASINGPERIODICKNOTSEQUENCE, Uniform_OpenKnotSequence, UNIFORM_OPENKNOTSEQUENCE, Uniform_PeriodicKnotSequence, UNIFORM_PERIODICKNOTSEQUENCE, UniformlySpreadInterKnots_OpenKnotSequence, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";


export const EM_MAXMULTIPLICITY_ORDER_SEQUENCE = "Maximal value of knot multiplicity order is too small for this category of knot sequence. Cannot proceed.";
export const EM_SIZENORMALIZED_BSPLINEBASIS = "Normalized knot sequence cannot be generated. The prescribed basis size is too small to generate a B-Spline basis. Cannot proceed.";
export const EM_MAXMULTIPLICITY_ORDER_KNOT = "Knot multiplicity is greater than the maximum multiplicity order set for the knot sequence."
export const EM_NULL_MULTIPLICITY_ARRAY = "Knot multiplicity array with null length encountered. Cannot proceed.";
export const EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT = "Maximal knot multiplicity reached at an intermediate knot. Please, split the curve at these knots to describe elementary B-splines.";
export const EM_NULL_KNOT_SEQUENCE = "Knot sequence with null length encountered. Cannot proceed.";
export const EM_NON_INCREASING_KNOT_VALUES = "Knot sequence is not increasing. Cannot proceed.";
export const EM_NON_STRICTLY_INCREASING_VALUES = "Knot sequence is not strictly increasing. Cannot proceed.";
export const EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL = "Knot sequence with length not equal to the multiplicity array length. Cannot proceed.";
export const EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE = "Knot index value in strictly increasing knot sequence is out of range.";
export const EM_SEQUENCE_ORIGIN_REMOVAL = "Decrementing knot multiplicity would remove this knot. This knot is the origin of the knot sequence. Cannot remove this knot."

// Important remark: There is an interaction between KNOT_COINCIDENCE_TOLERANCE and CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// when computing the zeros of a BSplineR1toR1. KNOT_COINCIDENCE_TOLERANCE currently set to 10E-2 CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// It may be needed to check if there are side effects (JCL 2024/05/06).
export const KNOT_COINCIDENCE_TOLERANCE = 1E-9;
export const UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA = Infinity;

export abstract class AbstractKnotSequence {

    protected abstract knotSequence: Array<Knot>;
    protected _maxMultiplicityOrder: number;
    protected _isKnotSpacingUniform: boolean;
    protected _isKnotMultiplicityUniform: boolean;

    constructor(maxMultiplicityOrder: number) {
        this._maxMultiplicityOrder = maxMultiplicityOrder;
        this._isKnotSpacingUniform = true;
        this._isKnotMultiplicityUniform = true;
    }

    get maxMultiplicityOrder() {
        return this._maxMultiplicityOrder;
    }

    get isKnotSpacingUniform() {
        return this._isKnotSpacingUniform;
    }

    get isKnotMultiplicityUniform() {
        return this._isKnotMultiplicityUniform;
    }

    abstract checkNonUniformKnotMultiplicityOrder(): void;

    abstract decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): void;

    throwRangeErrorMessage(functionName: string, message: string): void {
        const error = new ErrorLog(this.constructor.name, functionName);
        error.addMessage(message);
        console.log(error.generateMessageString());
        throw new RangeError(error.generateMessageString());
    }

    constructorInputMultOrderAssessment(minValue: number): void {
        if(this._maxMultiplicityOrder < minValue) this.throwRangeErrorMessage("constructor", EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
    }

    distinctAbscissae(): number[] {
        let abscissae: number[] = [];
        for(const knot of this.knotSequence) {
            abscissae.push(knot.abscissa);
        }
        return abscissae;
    }

    multiplicities(): number[] {
        let multiplicities: number[] = [];
        for(const knot of this.knotSequence) {
            multiplicities.push(knot.multiplicity);
        }
        return multiplicities;
    }

    maxMultiplicityOrderInputParamAssessment(multiplicity: number, methodName: string): void {
        if(multiplicity > this._maxMultiplicityOrder) this.throwRangeErrorMessage(methodName, EM_MAXMULTIPLICITY_ORDER_KNOT);
    }

    constructorInputArrayAssessment(knotParameters: IncreasingOpenKnotSequence | IncreasingOpenKnotSequenceCCurve_allKnots | IncreasingOpenKnotSequenceUpToC0Discontinuity |
        IncreasingOpenKnotSequenceCCurve | IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots | StrictlyIncreasingOpenKnotSequence | StrictlyIncreasingOpenKnotSequenceCCurve |
        StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots | StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity | StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots |
        IncreasingPeriodicKnotSequence | IncreasingPeriodicKnotSubSequence | StrictIncreasingPeriodicKnotSequence): void {

        let message = "";
        const messageKnots = EM_NULL_KNOT_SEQUENCE;
        const messageMultiplicities = EM_NULL_MULTIPLICITY_ARRAY;
        const messageKnotLengthVsMultitplicityLength = EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL;
        if(knotParameters.type === INCREASINGOPENKNOTSEQUENCE || knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS
            || knotParameters.type === INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY || knotParameters.type === INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            if(knotParameters.knots.length === 0) message = messageKnots;
        } else if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE || knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS ||
            knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY || knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            if(knotParameters.knots.length === 0) {
                message = messageKnots;
            } else if(knotParameters.multiplicities.length === 0) {
                message = messageMultiplicities;
            } else if(knotParameters.knots.length !== knotParameters.multiplicities.length) {
                message = messageKnotLengthVsMultitplicityLength;
            }
        } else if(knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVE || knotParameters.type === INCREASINGPERIODICKNOTSEQUENCE || knotParameters.type === INCREASINGPERIODICKNOTSUBSEQUENCE) {
            if((knotParameters.periodicKnots.length) === 0) message = messageKnots;
        } else if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE || knotParameters.type === STRICTLYINCREASINGPERIODICKNOTSEQUENCE) {
            if(knotParameters.periodicKnots.length === 0) {
                message = messageKnots;
            } else if(knotParameters.multiplicities.length === 0) {
                message = messageMultiplicities;
            } else if(knotParameters.periodicKnots.length !== knotParameters.multiplicities.length) {
                message = messageKnotLengthVsMultitplicityLength;
            }
        }
        if(message !== "") this.throwRangeErrorMessage("constructor", message);
    }

    constructorInputBspBasisSizeAssessment(knotParameters: Uniform_OpenKnotSequence | UniformlySpreadInterKnots_OpenKnotSequence |
                                                            Uniform_PeriodicKnotSequence): void {

        if(knotParameters.type === UNIFORM_OPENKNOTSEQUENCE || knotParameters.type === UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            if(knotParameters.BsplBasisSize < this._maxMultiplicityOrder) this.throwRangeErrorMessage("constructor", EM_SIZENORMALIZED_BSPLINEBASIS);
        } else if(knotParameters.type === UNIFORM_PERIODICKNOTSEQUENCE) {
            if(knotParameters.BsplBasisSize < (this._maxMultiplicityOrder + 2)) this.throwRangeErrorMessage("constructor", EM_SIZENORMALIZED_BSPLINEBASIS);
        }
    }

    checkMaxMultiplicityOrderConsistency(): void {
        for (const knot of this.knotSequence) {
            this.maxMultiplicityOrderInputParamAssessment(knot.multiplicity, "checkMaxMultiplicityOrderConsistency");
        }
    }

    checkUniformityOfKnotSpacing(): void {
        this._isKnotSpacingUniform = true;
        if(this.knotSequence.length > 1) {
            const spacing = this.knotSequence[1].abscissa - this.knotSequence[0].abscissa;
            for(let i = 1; i < (this.knotSequence.length - 1); i++) {
                const spacingAdjKnots = this.knotSequence[i + 1].abscissa - this.knotSequence[i].abscissa;
                if(spacingAdjKnots > (spacing + KNOT_COINCIDENCE_TOLERANCE) || spacingAdjKnots < (spacing - KNOT_COINCIDENCE_TOLERANCE)) this._isKnotSpacingUniform = false;
            }
        }
        return;
    }

    checkUniformityOfKnotMultiplicity(): void {
        this._isKnotMultiplicityUniform = true;
        for(const knot of this.knotSequence) {
            if(knot !== undefined && knot.multiplicity !== 1) this._isKnotMultiplicityUniform = false;
        }
        return;
    }

    checkMaxKnotMultiplicityAtIntermediateKnots(): void {
        let maxMultiplicityOrderReached = false;
        for(let knot = 1; knot < (this.knotSequence.length - 1); knot++) {
            if(this.knotSequence[knot].multiplicity === this._maxMultiplicityOrder) maxMultiplicityOrderReached = true;
        }
        if(maxMultiplicityOrderReached) this.throwRangeErrorMessage("checkMaxKnotMultiplicityAtIntermediateKnots", EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
    }

    checkKnotIncreasingValues(knots: number[]): void {
        if(knots.length > 1) {
            for(let i = 1; i < knots.length; i++) {
                if(knots[i] < knots[i -1]) this.throwRangeErrorMessage("checkKnotIncreasingValues", EM_NON_INCREASING_KNOT_VALUES);
            }
        }
    }

    checkKnotStrictlyIncreasingValues(knots: number[]): void {
        if(knots.length > 1) {
            for(let i = 1; i < knots.length; i++) {
                if(knots[i] <= knots[i -1]) this.throwRangeErrorMessage("checkKnotStrictlyIncreasingValues", EM_NON_STRICTLY_INCREASING_VALUES);
            }
        }
    }

    isAbscissaCoincidingWithKnot(abscissa: number): boolean {
        let coincident = false;
        for(const knot of this.knotSequence) {
            if(Math.abs(abscissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) coincident = true;
        }
        return coincident;
    }

    isKnotlMultiplicityZero(abscissa: number): boolean {
        let multiplicityZero = true;
        if(this.isAbscissaCoincidingWithKnot(abscissa)) multiplicityZero = false;
        return multiplicityZero;
    }

    knotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): number {
        this.strictlyIncKnotIndexInputParamAssessment(index, "knotMultiplicity");
        const result = this.knotSequence[index.knotIndex].multiplicity;
        return result;
    }

    revertKnotSequence(): void {
        const sequence: Array<Knot> = [];
        for(const knot of this.knotSequence) {
            sequence.push(new Knot(0.0))
        }
        let i = 0;
        for(const knot of this.knotSequence) {
            sequence[this.knotSequence.length - i - 1].abscissa = this.knotSequence[this.knotSequence.length - 1].abscissa - (knot.abscissa - this.knotSequence[0].abscissa);
            sequence[this.knotSequence.length - i - 1].multiplicity = knot.multiplicity;
            i++;
        }
        this.knotSequence = sequence.slice();
        return
    }

    strictlyIncKnotIndexInputParamAssessment(index: KnotIndexStrictlyIncreasingSequence, methodName: string): void {
        if(index.knotIndex < 0 || index.knotIndex > this.knotSequence.length - 1) this.throwRangeErrorMessage(methodName, EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
    }

}