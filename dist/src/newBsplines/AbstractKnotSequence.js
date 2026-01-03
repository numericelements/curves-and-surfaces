"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractKnotSequence = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const Knot_1 = require("./Knot");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const KnotSequences_1 = require("../namedConstants/KnotSequences");
const KnotSequences_2 = require("../ErrorMessages/KnotSequences");
/**
 * Abstract base class for knot sequences used in B-spline entities (curves or surfaces).
 *
 * @description
 * Provides common functionality for managing and validating knot sequences
 * with different knot multiplicity orders and spacing characteristics.
 * This base class covers increasing and strictly increasing knot sequences, open and periodic knot sequences.
 * All these categories enable the description of open and closed curves and surfaces.
 * Derived classes from this class are responsible for implementing all categories of open knot sequences, on the one hand, and periodic knot sequences, on the other hand.
 * The internal representation of the knot sequence is an array of Knot objects describing the sequence as a strictly increasing sequence of knots.
 *
 * @abstract
 */
class AbstractKnotSequence {
    /**
     * Creates a new knot sequence with specified maximum multiplicity order.
     *
     * @param maxMultiplicityOrder - Maximum allowed multiplicity for any knot
     *
     */
    constructor(maxMultiplicityOrder) {
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
    throwRangeErrorMessage(functionName, message) {
        const error = new ErrorLoging_1.ErrorLog(this.constructor.name, functionName);
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
    constructorInputMultOrderAssessment(minValue) {
        if (this._maxMultiplicityOrder < minValue)
            this.throwRangeErrorMessage("constructor", KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
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
    maxMultiplicityOrderInputParamAssessment(multiplicity, methodName) {
        if (multiplicity > this._maxMultiplicityOrder)
            this.throwRangeErrorMessage(methodName, KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_KNOT);
    }
    /**
     * Assesses the input array parameters for the constructor of the `AbstractKnotSequence` class hierarchy.
     *
     * @param knotParameters - An object containing the knot sequence parameters.
     * @throws {RangeError} If the input parameters are invalid.
     *
     * @description
     * This method checks the validity of the `knotParameters` object, which can be of type `IncreasingOpenKnotSequence`,
     * `IncreasingOpenKnotSequenceCCurve_allKnots`, or `IncreasingOpenKnotSequenceUpToC0Discontinuity`...., i.e. all knot sequences that use knot abscissae as input parameters.
     * It ensures that the knot sequence and multiplicity arrays have the correct lengthes.
     *
     * @example
     * const knotParams = {
     *   type: INCREASINGOPENKNOTSEQUENCE,
     *   knots: [0, 0, 0, 1, 2, 3, 3, 3]
     * };
     * this.constructorInputArrayAssessment(knotParams);
     */
    constructorInputArrayAssessment(knotParameters) {
        let message = "";
        const messageKnots = KnotSequences_2.EM_NULL_KNOT_SEQUENCE;
        const messageMultiplicities = KnotSequences_2.EM_NULL_MULTIPLICITY_ARRAY;
        const messageKnotLengthVsMultitplicityLength = KnotSequences_2.EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL;
        if (knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS
            || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            if (knotParameters.knots.length === 0)
                message = messageKnots;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE || knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS ||
            knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY || knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS) {
            if (knotParameters.knots.length === 0) {
                message = messageKnots;
            }
            else if (knotParameters.multiplicities.length === 0) {
                message = messageMultiplicities;
            }
            else if (knotParameters.knots.length !== knotParameters.multiplicities.length) {
                message = messageKnotLengthVsMultitplicityLength;
            }
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE || knotParameters.type === KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE) {
            if ((knotParameters.periodicKnots.length) === 0)
                message = messageKnots;
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE || knotParameters.type === KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE) {
            if (knotParameters.periodicKnots.length === 0) {
                message = messageKnots;
            }
            else if (knotParameters.multiplicities.length === 0) {
                message = messageMultiplicities;
            }
            else if (knotParameters.periodicKnots.length !== knotParameters.multiplicities.length) {
                message = messageKnotLengthVsMultitplicityLength;
            }
        }
        if (message !== "")
            this.throwRangeErrorMessage("constructor", message);
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
    constructorInputBspBasisSizeAssessment(knotParameters) {
        if (knotParameters.type === KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE || knotParameters.type === KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            if (knotParameters.BsplBasisSize < this._maxMultiplicityOrder)
                this.throwRangeErrorMessage("constructor", KnotSequences_2.EM_SIZENORMALIZED_BSPLINEBASIS);
        }
        else if (knotParameters.type === KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE) {
            if (knotParameters.BsplBasisSize < (this._maxMultiplicityOrder + 1))
                this.throwRangeErrorMessage("constructor", KnotSequences_2.EM_SIZENORMALIZED_BSPLINEBASIS);
        }
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
    strictlyIncKnotIndexInputParamAssessment(index, methodName) {
        if (index.knotIndex < 0 || index.knotIndex > this.knotSequence.length - 1)
            this.throwRangeErrorMessage(methodName, KnotSequences_2.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
    }
    /**
     * Finds a span in an increasing knot sequence where the abscissa is distinct from knots.
     *
     * @description
     * Locates a span between two consecutive distinct knots where the given abscissa lies,
     * accounting for knots with multiplicity greater than 1.
     * The method does not ensure the abscissa is not coincident with any knot in the sequence.
     * This method is called by the findSpan method. The findSpan checks the validity of the asbcissa
     * as well as the coincidence of the abscissa with knots.
     * Performs a binary search to find the knot index characterizing the span.
     *
     * @param abscissa - The abscissa value to locate in the sequence
     * @param warningLog - Index of the knot defining the right bound of normalized basis interval. Defaults to the last knot index.
     * The index value is defined from the strictly increasing representation of the knot sequence.
     * @returns The index of the knot defining the span containing the abscissa within the increasing knot sequence.
     *
     * @example
     * // For sequence [0,0,0,1,2,3,3,3], maxMultiplicityOrder = 3 and abscissa 1.5
     * const span = knotSequence.findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(1.5);
     * // Returns 3 (span between knots at indices 3 and 4)
     *
     * @example
     * // For sequence [-2,-1,0,1,2,3,4,4,5,6,7], maxMultiplicityOrder = 3 and abscissa 4.999. targetIndex = 8.
     * const span = knotSequence.findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(4.999);
     * // Returns 7 (span between knots at indices 7 and 8)
     */
    findSpanWithAbscissaDistinctFromKnotIncreasingKnotSequence(u, targetIndex = this.knotSequence.length - 1) {
        let knotIndex = this.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u, targetIndex);
        let indexSeq = 0;
        for (let i = 0; i < (knotIndex + 1); i++) {
            indexSeq += this.knotSequence[i].multiplicity;
        }
        knotIndex = indexSeq - 1;
        return knotIndex;
    }
    /**
     * Finds a span in a strictly increasing knot sequence where the abscissa is distinct from knots.
     *
     * @description
     * Locates a span between two consecutive knots where the given abscissa lies.
     * The method does not ensure the abscissa is not coincident with any knot in the sequence.
     * This method is called by the findSpan method. The findSpan checks the validity of the asbcissa
     * as well as the coincidence of the abscissa with knots.
     * Performs a binary search to find the knot index characterizing the span.
     *
     * @param abscissa - The abscissa value to locate in the sequence
     * @param targetIndex - Index of the knot defining the right bound of normalized basis interval. Defaults to the last knot index.
     * @returns The index of the knot defining the span containing the abscissa within the strictly increasing knot sequence.
     *
     * @example
     * // For a strictly increasing sequence [0.0, 0.5, 0.6, 0.7, 1] with multiplicities [4, 1, 1, 2, 4], maxMultiplicityOrder = 4 and abscissa 0.55
     * const span = knotSequence.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(0.55);
     * // Returns 1 (span between knots at indices 1 and 2)
     *
     * @example
     * // For a strictly increasing sequence [-2,-1,0,1,2,3,4,5] with multiplicities [1,1,1,1,1,1,1,1], maxMultiplicityOrder = 3 and abscissa 2.999
     * const span = knotSequence.findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(2.999, 5);
     * // Returns 4 (span between knots at indices 4 and 5)
     */
    findSpanWithAbscissaDistinctFromKnotStrictlyIncreasingKnotSequence(u, targetIndex = this.knotSequence.length - 1) {
        // Do binary search
        let low = this._indexKnotOrigin.knotIndex;
        let knotIndex = Math.floor((low + targetIndex) / 2);
        while (!(this.knotSequence[knotIndex].abscissa < u && u < this.knotSequence[knotIndex + 1].abscissa)) {
            if (u < this.knotSequence[knotIndex].abscissa) {
                targetIndex = knotIndex;
            }
            else {
                low = knotIndex;
            }
            knotIndex = Math.floor((low + targetIndex) / 2);
        }
        return knotIndex;
    }
    /**
     * Returns an array containing the distinct abscissa values of all knots in the knot sequence.
     *
     * @returns {number[]} Array of distinct knot abscissa values
     *
     * @example
     * const abscissae = knotSequence.distinctAbscissae(); // [0, 1, 2, 3]
     */
    distinctAbscissae() {
        let abscissae = [];
        for (const knot of this.knotSequence) {
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
    multiplicities() {
        let multiplicities = [];
        for (const knot of this.knotSequence) {
            multiplicities.push(knot.multiplicity);
        }
        return multiplicities;
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
    checkMaxMultiplicityOrderConsistency() {
        for (const knot of this.knotSequence) {
            this.maxMultiplicityOrderInputParamAssessment(knot.multiplicity, "checkMaxMultiplicityOrderConsistency");
        }
    }
    /**
     * Checks uniformity of knot spacing in the sequence.
     * Updates isKnotSpacingUniform property.
     */
    checkUniformityOfKnotSpacing() {
        this._isKnotSpacingUniform = true;
        if (this.knotSequence.length > 1) {
            const spacing = this.knotSequence[1].abscissa - this.knotSequence[0].abscissa;
            for (let i = 1; i < (this.knotSequence.length - 1); i++) {
                const spacingAdjKnots = this.knotSequence[i + 1].abscissa - this.knotSequence[i].abscissa;
                if (spacingAdjKnots > (spacing + KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) || spacingAdjKnots < (spacing - KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE))
                    this._isKnotSpacingUniform = false;
            }
        }
        return;
    }
    /**
     * Checks uniformity of knot multiplicity in the sequence.
     * Updates isKnotMultiplicityUniform property.
     */
    checkUniformityOfKnotMultiplicity() {
        this._isKnotMultiplicityUniform = true;
        for (const knot of this.knotSequence) {
            if (knot !== undefined && knot.multiplicity !== 1)
                this._isKnotMultiplicityUniform = false;
        }
        return;
    }
    /**
     * Verifies that intermediate knots don't exceed maximum multiplicity order assigned to the knot sequence.
     *
     * @throws {RangeError} If any intermediate knot exceeds max multiplicity
     */
    checkMaxKnotMultiplicityAtIntermediateKnots() {
        let maxMultiplicityOrderReached = false;
        for (let knot = 1; knot < (this.knotSequence.length - 1); knot++) {
            if (this.knotSequence[knot].multiplicity === this._maxMultiplicityOrder)
                maxMultiplicityOrderReached = true;
        }
        if (maxMultiplicityOrderReached)
            this.throwRangeErrorMessage("checkMaxKnotMultiplicityAtIntermediateKnots", KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
    }
    /**
     * Verifies that knot values of the iterated knot sequence are in increasing order.
     *
     * @param knots - Array of knot values to check
     * @throws {RangeError} If knots are not in increasing order
     */
    checkKnotIncreasingValues(knots) {
        if (knots.length > 1) {
            for (let i = 1; i < knots.length; i++) {
                if (knots[i] < knots[i - 1])
                    this.throwRangeErrorMessage("checkKnotIncreasingValues", KnotSequences_2.EM_NON_INCREASING_KNOT_VALUES);
            }
        }
    }
    /**
     * Verifies that knot values of the iterated knot sequence are in strictly increasing order.
     *
     * @param knots - Array of knot values to check
     * @throws {RangeError} If knots are not in strictly increasing order
     */
    checkKnotStrictlyIncreasingValues(knots) {
        if (knots.length > 1) {
            for (let i = 1; i < knots.length; i++) {
                if (knots[i] <= knots[i - 1])
                    this.throwRangeErrorMessage("checkKnotStrictlyIncreasingValues", KnotSequences_2.EM_NON_STRICTLY_INCREASING_VALUES);
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
    isAbscissaCoincidingWithKnot(abscissa) {
        let coincident = false;
        for (const knot of this.knotSequence) {
            if (Math.abs(abscissa - knot.abscissa) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE)
                coincident = true;
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
    isKnotlMultiplicityZero(abscissa) {
        let multiplicityZero = true;
        if (this.isAbscissaCoincidingWithKnot(abscissa))
            multiplicityZero = false;
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
    knotMultiplicity(index) {
        this.strictlyIncKnotIndexInputParamAssessment(index, "knotMultiplicity");
        const result = this.knotSequence[index.knotIndex].multiplicity;
        return result;
    }
    /**
     * Reverses the knot spacing distribution in the sequence while preserving multiplicities and the origin of the knot sequence.
     *
     * @example
     * knotSequence.revertKnotSpacing(); // [0,0,1,3,3] becomes [0,0,2,3,3] for an increasing open knot sequence describing an open curve
     * knotSequence.revertKnotSpacing(); // [0,1,1.5,3] becomes [0,1.5,2,3] for an increasing periodic knot sequence describing a closed curve
     */
    revertKnotSpacing() {
        const sequence = [];
        for (const knot of this.knotSequence) {
            sequence.push(new Knot_1.Knot(0.0));
        }
        let i = 0;
        for (const knot of this.knotSequence) {
            sequence[this.knotSequence.length - i - 1].abscissa = this.knotSequence[this.knotSequence.length - 1].abscissa - (knot.abscissa - this.knotSequence[0].abscissa);
            sequence[this.knotSequence.length - i - 1].multiplicity = knot.multiplicity;
            i++;
        }
        this.knotSequence = sequence.slice();
        return;
    }
}
exports.AbstractKnotSequence = AbstractKnotSequence;
