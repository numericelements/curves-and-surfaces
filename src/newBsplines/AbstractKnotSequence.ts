import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { INCREASINGOPENKNOTSEQUENCE, IncreasingOpenKnotSequence, IncreasingOpenKnotSequenceCCurve, IncreasingOpenKnotSequenceCCurve_allKnots, INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, IncreasingOpenKnotSequenceUpToC0Discontinuity, IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, INCREASINGPERIODICKNOTSEQUENCE, IncreasingPeriodicKnotSequence, StrictIncreasingPeriodicKnotSequence, StrictlyIncreasingOpenKnotSequence, STRICTLYINCREASINGOPENKNOTSEQUENCE, StrictlyIncreasingOpenKnotSequenceCCurve, StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity, StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, STRICTLYINCREASINGPERIODICKNOTSEQUENCE, Uniform_OpenKnotSequence, UNIFORM_OPENKNOTSEQUENCE, Uniform_PeriodicKnotSequence, UNIFORM_PERIODICKNOTSEQUENCE, UniformlySpreadInterKnots_OpenKnotSequence, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";
import { KNOT_COINCIDENCE_TOLERANCE } from "../namedConstants/KnotSequences";
import { EM_MAXMULTIPLICITY_ORDER_SEQUENCE, EM_SIZENORMALIZED_BSPLINEBASIS, EM_MAXMULTIPLICITY_ORDER_KNOT, EM_NULL_MULTIPLICITY_ARRAY, EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT, EM_NULL_KNOT_SEQUENCE, EM_NON_INCREASING_KNOT_VALUES, EM_NON_STRICTLY_INCREASING_VALUES, EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL, EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE, EM_SEQUENCE_ORIGIN_REMOVAL } from "../ErrorMessages/KnotSequences";

/**
 * Abstract base class for knot sequences used in B-spline entities (curves or surfaces).
 * Provides common functionality for managing and validating knot sequences
 * with different knot multiplicity orders and spacing characteristics.
 * This base class covers increasing and strictly increasing knot sequences, open and periodic knot sequences.
 * All these categories enable the description of open and closed curves and surfaces.
 * Derived classes from this class are responsible for implementing all categories of open knot sequences, on the one hand, and periodic knot sequences, on the other hand.
 * The internal representation of the knot sequence is an array of Knot objects describing the sequence as a strictly increasing sequence of knots.
 * 
 * @abstract
 */
export abstract class AbstractKnotSequence {

    protected abstract knotSequence: Array<Knot>;
    protected _maxMultiplicityOrder: number;
    protected _isKnotSpacingUniform: boolean;
    protected _isKnotMultiplicityUniform: boolean;

    /**
     * Creates a new knot sequence with specified maximum multiplicity order.
     * 
     * @param maxMultiplicityOrder - Maximum allowed multiplicity for any knot
     * 
     */
    constructor(maxMultiplicityOrder: number) {
        this._maxMultiplicityOrder = maxMultiplicityOrder;
        this._isKnotSpacingUniform = true;
        this._isKnotMultiplicityUniform = true;
    }

    /**
     * Gets the maximum allowed multiplicity order for knots in the sequence.
     * 
     * @returns {number} Maximum multiplicity order
     */
    get maxMultiplicityOrder() {
        return this._maxMultiplicityOrder;
    }

    /**
     * Indicates if knot spacing is uniform across the sequence.
     * 
     * @returns {boolean} True if knot spacing is uniform
     */
    get isKnotSpacingUniform() {
        return this._isKnotSpacingUniform;
    }

    /**
     * Indicates if knot multiplicity is uniform across the sequence.
     * 
     * @returns {boolean} True if knot multiplicity is uniform
     */
    get isKnotMultiplicityUniform() {
        return this._isKnotMultiplicityUniform;
    }

    abstract checkNonUniformKnotMultiplicityOrder(): void;

    abstract decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): void;

    /**
     * Generates and throws a RangeError with formatted error message.
     * 
     * @param functionName - Name of the function where error occurred
     * @param message - Error message to include
     * @throws {RangeError} With formatted error message
     * 
     * @example
     * this.throwRangeErrorMessage("constructor", "Invalid multiplicity order");
     */
    throwRangeErrorMessage(functionName: string, message: string): void {
        const error = new ErrorLog(this.constructor.name, functionName);
        error.addMessage(message);
        console.log(error.generateMessageString());
        throw new RangeError(error.generateMessageString());
    }

    /**
     * Validates that the maximum multiplicity order of a knot sequence is greater than or equal to the minimum allowed value.
     * 
     * @param minValue - Minimum allowed value for maximum multiplicity order
     * @throws {RangeError} If maxMultiplicityOrder is less than minValue
     * 
     * @example
     * this.constructorInputMultOrderAssessment(3);
     */
    constructorInputMultOrderAssessment(minValue: number): void {
        if(this._maxMultiplicityOrder < minValue) this.throwRangeErrorMessage("constructor", EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
    }

    /**
     * Returns an array containing the distinct abscissa values of all knots in the knot sequence.
     * 
     * @returns {number[]} Array of distinct knot abscissa values
     * 
     * @example
     * const abscissae = knotSequence.distinctAbscissae(); // [0, 1, 2, 3]
     */
    distinctAbscissae(): number[] {
        let abscissae: number[] = [];
        for(const knot of this.knotSequence) {
            abscissae.push(knot.abscissa);
        }
        return abscissae;
    }

    /**
     * Returns an array containing the multiplicities of all knots in the knot sequence.
     * 
     * @returns {number[]} Array of knot multiplicities
     * 
     * @example
     * const multiplicities = knotSequence.multiplicities(); // [3, 1, 1, 3]
     */
    multiplicities(): number[] {
        let multiplicities: number[] = [];
        for(const knot of this.knotSequence) {
            multiplicities.push(knot.multiplicity);
        }
        return multiplicities;
    }

    /**
     * Validates that a knot multiplicity does not exceed the maximum multiplicity order assigned to a knot sequence.
     * 
     * @param multiplicity - The knot multiplicity value to validate
     * @param methodName - Name of the calling method for error reporting
     * @throws {RangeError} If multiplicity exceeds maxMultiplicityOrder
     * 
     * @example
     * const multiplicity = 3;
     * const methodName = "checkMaxMultiplicityOrderConsistency";
     * this.maxMultiplicityOrderInputParamAssessment(multiplicity, methodName);
     */
    maxMultiplicityOrderInputParamAssessment(multiplicity: number, methodName: string): void {
        if(multiplicity > this._maxMultiplicityOrder) this.throwRangeErrorMessage(methodName, EM_MAXMULTIPLICITY_ORDER_KNOT);
    }

    /**
     * Assesses the input array parameters for the constructor of the `AbstractKnotSequence` class hierarchy.
     * This method checks the validity of the `knotParameters` object, which can be of type `IncreasingOpenKnotSequence`,
     * `IncreasingOpenKnotSequenceCCurve_allKnots`, or `IncreasingOpenKnotSequenceUpToC0Discontinuity`...., i.e. all knot sequences that use knot abscissae as input parameters.
     * It ensures that the knot sequence and multiplicity arrays have the correct lengthes.
     *
     * @param knotParameters - An object containing the knot sequence parameters.
     * @throws {RangeError} If the input parameters are invalid.
     * 
     * @example
     * const knotParams = {
     *   type: INCREASINGOPENKNOTSEQUENCE,
     *   knots: [0, 0, 0, 1, 2, 3, 3, 3]
     * };
     * this.constructorInputArrayAssessment(knotParams);
     */
    constructorInputArrayAssessment(knotParameters: IncreasingOpenKnotSequence | IncreasingOpenKnotSequenceCCurve_allKnots | IncreasingOpenKnotSequenceUpToC0Discontinuity |
        IncreasingOpenKnotSequenceCCurve | IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots | StrictlyIncreasingOpenKnotSequence | StrictlyIncreasingOpenKnotSequenceCCurve |
        StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots | StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity | StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots |
        IncreasingPeriodicKnotSequence | StrictIncreasingPeriodicKnotSequence): void {

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
        } else if(knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVE || knotParameters.type === INCREASINGPERIODICKNOTSEQUENCE) {
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

    /**
     * Validates B-spline basis size requirements for uniform knot sequences to ensure that a normalized basis exists given the maxMultiplicityOrder assigned to the knot sequence.
     * For open sequences: basis size must be >= maxMultiplicityOrder
     * For periodic sequences: basis size must be >= (maxMultiplicityOrder + 1)
     * 
     * @param knotParameters - Parameters containing B-spline basis size
     * @throws {RangeError} If basis size requirements are not met
     * 
     * @example
     * const params = {
     *   type: UNIFORM_OPENKNOTSEQUENCE,
     *   BsplBasisSize: 4
     * };
     * this.constructorInputBspBasisSizeAssessment(params);
     */
    constructorInputBspBasisSizeAssessment(knotParameters: Uniform_OpenKnotSequence | UniformlySpreadInterKnots_OpenKnotSequence |
                                                            Uniform_PeriodicKnotSequence): void {

        if(knotParameters.type === UNIFORM_OPENKNOTSEQUENCE || knotParameters.type === UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            if(knotParameters.BsplBasisSize < this._maxMultiplicityOrder) this.throwRangeErrorMessage("constructor", EM_SIZENORMALIZED_BSPLINEBASIS);
        } else if(knotParameters.type === UNIFORM_PERIODICKNOTSEQUENCE) {
            if(knotParameters.BsplBasisSize < (this._maxMultiplicityOrder + 1)) this.throwRangeErrorMessage("constructor", EM_SIZENORMALIZED_BSPLINEBASIS);
        }
    }

    /**
     * Verifies that no knot multiplicity exceeds the maximum multiplicity order
     * assigned to the knot sequence.
     * 
     * @throws {RangeError} If any knot multiplicity exceeds maxMultiplicityOrder
     * 
     * @example
     * knotSequence.checkMaxMultiplicityOrderConsistency(); // Validates all knot multiplicities
     */
    checkMaxMultiplicityOrderConsistency(): void {
        for (const knot of this.knotSequence) {
            this.maxMultiplicityOrderInputParamAssessment(knot.multiplicity, "checkMaxMultiplicityOrderConsistency");
        }
    }

    /**
     * Checks uniformity of knot spacing in the sequence.
     * Updates isKnotSpacingUniform property.
     */
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

    /**
     * Checks uniformity of knot multiplicity in the sequence.
     * Updates isKnotMultiplicityUniform property.
     */
    checkUniformityOfKnotMultiplicity(): void {
        this._isKnotMultiplicityUniform = true;
        for(const knot of this.knotSequence) {
            if(knot !== undefined && knot.multiplicity !== 1) this._isKnotMultiplicityUniform = false;
        }
        return;
    }

    /**
     * Verifies that intermediate knots don't exceed maximum multiplicity order assigned to the knot sequence.
     * 
     * @throws {RangeError} If any intermediate knot exceeds max multiplicity
     */
    checkMaxKnotMultiplicityAtIntermediateKnots(): void {
        let maxMultiplicityOrderReached = false;
        for(let knot = 1; knot < (this.knotSequence.length - 1); knot++) {
            if(this.knotSequence[knot].multiplicity === this._maxMultiplicityOrder) maxMultiplicityOrderReached = true;
        }
        if(maxMultiplicityOrderReached) this.throwRangeErrorMessage("checkMaxKnotMultiplicityAtIntermediateKnots", EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
    }

    /**
     * Verifies that knot values of the iterated knot sequence are in increasing order.
     * 
     * @param knots - Array of knot values to check
     * @throws {RangeError} If knots are not in increasing order
     */
    checkKnotIncreasingValues(knots: number[]): void {
        if(knots.length > 1) {
            for(let i = 1; i < knots.length; i++) {
                if(knots[i] < knots[i -1]) this.throwRangeErrorMessage("checkKnotIncreasingValues", EM_NON_INCREASING_KNOT_VALUES);
            }
        }
    }

    /**
     * Verifies that knot values of the iterated knot sequence are in strictly increasing order.
     * 
     * @param knots - Array of knot values to check
     * @throws {RangeError} If knots are not in strictly increasing order
     */
    checkKnotStrictlyIncreasingValues(knots: number[]): void {
        if(knots.length > 1) {
            for(let i = 1; i < knots.length; i++) {
                if(knots[i] <= knots[i -1]) this.throwRangeErrorMessage("checkKnotStrictlyIncreasingValues", EM_NON_STRICTLY_INCREASING_VALUES);
            }
        }
    }

    /**
     * Checks if a given abscissa value coincides with any knot in the sequence within the KNOT_COINCIDENCE_TOLERANCE tolerance.
     * 
     * @param abscissa - Knot abscissa value to check for coincidence with knots of the sequence
     * @returns {boolean} True if abscissa coincides with a knot
     * 
     * @example
     * const coincides = knotSequence.isAbscissaCoincidingWithKnot(1.0);
     */
    isAbscissaCoincidingWithKnot(abscissa: number): boolean {
        let coincident = false;
        for(const knot of this.knotSequence) {
            if(Math.abs(abscissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) coincident = true;
        }
        return coincident;
    }

    /**
     * Checks if a given knot abscissa has zero multiplicity (no coincident knot).
     * 
     * @param abscissa - Value to check for zero multiplicity
     * @returns {boolean} True if abscissa has zero multiplicity
     * 
     * @example
     * const isZero = knotSequence.isKnotlMultiplicityZero(1.5);
     */
    isKnotlMultiplicityZero(abscissa: number): boolean {
        let multiplicityZero = true;
        if(this.isAbscissaCoincidingWithKnot(abscissa)) multiplicityZero = false;
        return multiplicityZero;
    }

    /**
     * Gets the multiplicity of knot at specified index.
     * 
     * @param index - Index of knot into a strictly increasing representation of the knot sequence
     * @returns {number} Multiplicity of knot at index
     * 
     * @example
     * const mult = knotSequence.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(1));
     */
    knotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): number {
        this.strictlyIncKnotIndexInputParamAssessment(index, "knotMultiplicity");
        const result = this.knotSequence[index.knotIndex].multiplicity;
        return result;
    }

    /**
     * Reverses the knot spacing distribution in the sequence while preserving multiplicities and the origin of the knot sequence.
     * 
     * @example
     * knotSequence.revertKnotSequence(); // [0,0,1,3,3] becomes [0,0,2,3,3] for an increasing open knot sequence describing an open curve
     * knotSequence.revertKnotSequence(); // [0,1,1.5,3] becomes [0,1.5,2,3] for an increasing periodic knot sequence describing a closed curve
     */
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

    /**
     * Validates that a knot index is within valid bounds of the sequence.
     * 
     * @param index - Index to validate in the strictly increasing representation of the knot sequence
     * @param methodName - Name of calling method for error reporting
     * @throws {RangeError} If index is out of valid range
     * 
     * @example
     * const index = new KnotIndexStrictlyIncreasingSequence(1);
     * this.strictlyIncKnotIndexInputParamAssessment(index, "knotMultiplicity");
     */
    strictlyIncKnotIndexInputParamAssessment(index: KnotIndexStrictlyIncreasingSequence, methodName: string): void {
        if(index.knotIndex < 0 || index.knotIndex > this.knotSequence.length - 1) this.throwRangeErrorMessage(methodName, EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
    }

}