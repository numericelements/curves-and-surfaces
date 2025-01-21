import { WarningLog } from "../errorProcessing/ErrorLoging";
import { AbstractKnotSequence } from "./AbstractKnotSequence";
import { Knot } from "./Knot";
import { AbstractOpenKnotSequence_type, NO_KNOT_CLOSED_CURVE, NO_KNOT_OPEN_CURVE, UNIFORM_OPENKNOTSEQUENCE, Uniform_OpenKnotSequence, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, UniformlySpreadInterKnots_OpenKnotSequence } from "./KnotSequenceConstructorInterface";
import { KNOT_SEQUENCE_ORIGIN, KNOT_COINCIDENCE_TOLERANCE, UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA, NormalizedBasisAtSequenceExtremity } from "../namedConstants/KnotSequences";
import { EM_SEQUENCE_ORIGIN_REMOVAL, EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART, EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND, EM_KNOT_INSERTION_OVER_UMAX, EM_KNOT_INSERTION_UNDER_SEQORIGIN, EM_MAXMULTIPLICITY_ORDER_ATKNOT, EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS, EM_NOT_NORMALIZED_BASIS, EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT, EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER } from "../ErrorMessages/KnotSequences"
import { WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE, WM_ABSCISSA_TOO_CLOSE_TO_KNOT } from "../WarningMessages/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "./KnotIndexStrictlyIncreasingSequence";
import { KnotIndexIncreasingSequence } from "./KnotIndexIncreasingSequence";
import { KnotIndexInterface } from "./KnotIndexConstructorInterface";


/**
 * Abstract base class for open knot sequences used in B-spline curves or surfaces.
 * 
 * @description
 * Extends AbstractKnotSequence to provide functionality specific to open knot sequences,
 * including normalized basis bounds and knot insertion/removal operations.
 * This class is applicable to open B-spline curves and surfaces as well as closed ones that can be described not with periodic knot sequences but also with open ones.
 * 
 * @abstract
 * @extends AbstractKnotSequence
 * @example
 * // Example knot sequence: [0,0,0,1,2,3,3,3]
 * class ConcreteOpenKnotSequence extends AbstractOpenKnotSequence {
 *   constructor() {
 *     super(3, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE});
 *   }
 * }
 */
export abstract class AbstractOpenKnotSequence extends AbstractKnotSequence {

    protected knotSequence: Knot[];
    protected _uMax: number;
    protected _isKnotMultiplicityNonUniform: boolean;
    protected abstract _indexKnotOrigin: KnotIndexStrictlyIncreasingSequence;
    protected abstract _isSequenceUpToC0Discontinuity: boolean;

    /**
     * Creates a new open knot sequence with specified maximum multiplicity order.
     * 
     * @param maxMultiplicityOrder - Maximum allowed multiplicity for any knot in the sequence
     * @param knotParameters - Parameters defining the knot sequence. Their content depends on the AbstractOpenKnotSequence_type type
     * that enables to specialize the constructor into a variety of categories defined by type property.
     * @example
     * // Create uniform open knot sequence
     * const params = {
     *   type: UNIFORM_OPENKNOTSEQUENCE,
     *   BsplBasisSize: 5
     * };
     * new ConcreteOpenKnotSequence(3, params);
     */
    constructor(maxMultiplicityOrder: number, knotParameters: AbstractOpenKnotSequence_type) {
        super(maxMultiplicityOrder);
        this.knotSequence = [];
        this._uMax = UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA;
        this._isKnotMultiplicityNonUniform = false;
        if(knotParameters.type === NO_KNOT_OPEN_CURVE) {
            this.computeKnotSequenceFromMaxMultiplicityOrderOCurve();
        } else if(knotParameters.type === NO_KNOT_CLOSED_CURVE) {
            this.computeKnotSequenceFromMaxMultiplicityOrderCCurve();
        } else if(knotParameters.type === UNIFORM_OPENKNOTSEQUENCE) {
            this.computeUniformKnotSequenceFromBsplBasisSize(knotParameters);
        } else if(knotParameters.type === UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            this.computeNonUniformKnotSequenceFromBsplBasisSize(knotParameters);
        }
    }

    abstract checkNonUniformKnotMultiplicityOrder(): void;

    abstract abscissaAtIndex(index: KnotIndexInterface): number;

    /**
     * Gets the knot abscissa of the right bound of the normalized basis of the knot sequence.
     */
    get uMax(): number {
        return this._uMax;
    }

    /**
     * Indicates if knot multiplicity is non-uniform across the sequence
     * 
     * @description
     * When the knot multiplicity is maxMultiplicityOrder at both ends, the property is set to true.
     */
    get isKnotMultiplicityNonUniform(): boolean {
        return this._isKnotMultiplicityNonUniform;
    }

    /**
     * Converts strictly increasing sequence index to an increasing sequence index.
     * 
     * @param index - The knot index to convert as represented into the strictly increasing sequence used as reference.
     * @returns The index into the corresponding increasing sequence.
     * @throws {RangeError} if the index is out of range, i.e. either negative or greater than the strictly increasing knot sequence length.
     * 
     * @description
     * This index transformation is not unique. The convention followed here is the assignment of the first index 
     * of the increasing sequence where the abscissa at index (strictly increasing sequence) appears.
     * 
     * @example
     * // For sequence [0,0,0,1,2,3,3,3]
     * // Convert index 2 (third unique knot) to index 4 (counting multiplicities)
     * const strictIndex = new KnotIndexStrictlyIncreasingSequence(2);
     * const incIndex = knotSequence.toKnotIndexIncreasingSequence(strictIndex);
     */
    toKnotIndexIncreasingSequence(index: KnotIndexStrictlyIncreasingSequence): KnotIndexIncreasingSequence {
        this.strictlyIncKnotIndexInputParamAssessment(index, "toKnotIndexIncreasingSequence")
        let indexIncSeq = 0;
        for(let i = 0; i < index.knotIndex; i++) {
            indexIncSeq += this.knotSequence[i].multiplicity;
        }
        return new KnotIndexIncreasingSequence(indexIncSeq);
    }

    /**
     * Gets the knot indices that bound the normalized basis of the knot sequence.
     * 
     * @returns An object containing the start and end knot indices with their respective basis normalization states
     * @property {start} Contains the knot index as KnotIndexStrictlyIncreasingSequence and basis state at sequence start
     * @property {end} Contains the knot index as KnotIndexStrictlyIncreasingSequence and basis state at sequence end
     * 
     * @description
     * This method determines the boundary knots of the normalized basis interval by analyzing
     * the cumulative multiplicities at both ends of the sequence with respect to maxMultiplicityOrder assigned 
     * to the knot sequence. For each boundary:
     * - Returns the knot index as a KnotIndexStrictlyIncreasingSequence. The knot index is always valid, i.e. >= 0 and < knotSequence.length.
     * - Indicates the basis normalization state (StrictlyNormalized, NotNormalized, or OverDefined)
     * When returning the normaalization state, the knot index value is not relevant.
     * 
     * @example
     * // For sequence [0,0,0,1,2,3,3,3] with maxMultiplicityOrder = 3
     * const bounds = knotSequence.getKnotIndicesBoundingNormalizedBasis();
     * // Returns: {
     * //   start: {knot: KnotIndexStrictlyIncreasingSequence{knotIndex: 0}, basisAtSeqExt: StrictlyNormalized},
     * //   end: {knot: KnotIndexStrictlyIncreasingSequence{knotIndex: 3}, basisAtSeqExt: StrictlyNormalized}
     * // }
     * 
     * // For sequence [-2,-1,0,1,2,3,3,4,4] with maxMultiplicityOrder = 3
     * const bounds = knotSequence.getKnotIndicesBoundingNormalizedBasis();
     * // Returns: {
     * //   start: {knot: KnotIndexStrictlyIncreasingSequence{knotIndex: 2}, basisAtSeqExt: StrictlyNormalized},
     * //   end: {knot: KnotIndexStrictlyIncreasingSequence{knotIndex: 5}, basisAtSeqExt: OverDefined}
     * // }
     * 
     * // For sequence [-1,0,1] with maxMultiplicityOrder = 4
     * const bounds = knotSequence.getKnotIndicesBoundingNormalizedBasis();
     * // Returns: {
     * //   start: {knot: KnotIndexStrictlyIncreasingSequence{knotIndex: 2}, basisAtSeqExt: NotNormalized},
     * //   end: {knot: KnotIndexStrictlyIncreasingSequence{knotIndex: 0}, basisAtSeqExt: NotNormalized}
     * // }
     */
    getKnotIndicesBoundingNormalizedBasis(): {start: {knot: KnotIndexStrictlyIncreasingSequence, basisAtSeqExt: NormalizedBasisAtSequenceExtremity}, end: {knot: KnotIndexStrictlyIncreasingSequence, basisAtSeqExt: NormalizedBasisAtSequenceExtremity}} {
        const normalizedBasisAtStart = this.getKnotIndexNormalizedBasisAtSequenceStart();
        const normalizedBasisAtEnd = this.getKnotIndexNormalizedBasisAtSequenceEnd();
        return {start: normalizedBasisAtStart, end: normalizedBasisAtEnd};
    }

    /**
     * Gets the knot index and basis normalization state at the end of the normalized basis interval.
     *
     * @returns An object containing the knot index as KnotIndexStrictlyIncreasingSequence and basis state at sequence end
     * @property {knot} Contains the knot index as KnotIndexStrictlyIncreasingSequence
     * @property {basisAtSeqExt} Contains the basis normalization state (StrictlyNormalized, NotNormalized, or OverDefined)
     *
     * @description
     * This method determines the knot index and basis normalization state at the end of the normalized basis interval
     * by analyzing the cumulative multiplicities starting from the last knot and heading toward the start of the sequence.
     * The cumulative multiplicities are constrained by the maxMultiplicityOrder assigned
     * to the knot sequence. The knot index is always valid, i.e. >= 0 and < knotSequence.length.
     *
     * @example
     * // For sequence [0,0,0,1,2,3,3,3] with maxMultiplicityOrder = 3
     * const bounds = knotSequence.getKnotIndexNormalizedBasisAtSequenceEnd();
     * // Returns: {knot: KnotIndexStrictlyIncreasingSequence{knotIndex: 3}, basisAtSeqExt: StrictlyNormalized}
     *
     * // For sequence [0,0,0,1,2,3,3,4,4] with maxMultiplicityOrder = 3
     * const bounds = knotSequence.getKnotIndexNormalizedBasisAtSequenceEnd();
     * // Returns: {knot: KnotIndexStrictlyIncreasingSequence{knotIndex: 3}, basisAtSeqExt: OverDefined}
     *
     * // For sequence [-1,0,1] with maxMultiplicityOrder = 4
     * const bounds = knotSequence.getKnotIndexNormalizedBasisAtSequenceEnd();
     * // Returns: {knot: KnotIndexStrictlyIncreasingSequence{knotIndex: 0}, basisAtSeqExt: NotNormalized}
     */
    getKnotIndexNormalizedBasisAtSequenceEnd(): {knot: KnotIndexStrictlyIncreasingSequence, basisAtSeqExt: NormalizedBasisAtSequenceExtremity} {
        let cumulativeMultiplicity = this.knotSequence[this.knotSequence.length - 1].multiplicity;
        let index = this.knotSequence.length - 1;
        let basisAtSeqEnd: NormalizedBasisAtSequenceExtremity = NormalizedBasisAtSequenceExtremity.NotNormalized;
        while(cumulativeMultiplicity < this._maxMultiplicityOrder && index > 0) {
            index--;
            cumulativeMultiplicity = cumulativeMultiplicity + this.knotSequence[index].multiplicity;
        }
        if(cumulativeMultiplicity > this._maxMultiplicityOrder) {
            basisAtSeqEnd = NormalizedBasisAtSequenceExtremity.OverDefined;
        } else if(cumulativeMultiplicity === this._maxMultiplicityOrder) {
            basisAtSeqEnd = NormalizedBasisAtSequenceExtremity.StrictlyNormalized;
        }
        return {knot: new KnotIndexStrictlyIncreasingSequence(index), basisAtSeqExt: basisAtSeqEnd};
    }

    /**
     * Gets the knot index and basis normalization state at the start of the normalized basis interval.
     *
     * @returns An object containing the knot index as KnotIndexStrictlyIncreasingSequence and basis state at sequence start
     * @property {knot} Contains the knot index as KnotIndexStrictlyIncreasingSequence
     * @property {basisAtSeqExt} Contains the basis normalization state (StrictlyNormalized, NotNormalized, or OverDefined)
     *
     * @description
     * This method determines the knot index and basis normalization state at the start of the normalized basis interval
     * by analyzing the cumulative multiplicities starting from the first knot and heading toward the end of the sequence.
     * The cumulative multiplicities are constrained by the maxMultiplicityOrder assigned
     * to the knot sequence. The knot index is always valid, i.e. >= 0 and < knotSequence.length.
     *
     * @example
     * // For sequence [0,0,0,1,2,3,3,3] with maxMultiplicityOrder = 3
     * const bounds = knotSequence.getKnotIndexNormalizedBasisAtSequenceStart();
     * // Returns: {knot: KnotIndexStrictlyIncreasingSequence{knotIndex: 0}, basisAtSeqExt: StrictlyNormalized}
     *
     * // For sequence [0,1,1,1,2,3,3,3] with maxMultiplicityOrder = 3
     * const bounds = knotSequence.getKnotIndexNormalizedBasisAtSequenceStart();
     * // Returns: {knot: KnotIndexStrictlyIncreasingSequence{knotIndex: 1}, basisAtSeqExt: OverDefined}
     *
     * // For sequence [-1,0,1] with maxMultiplicityOrder = 4
     * const bounds = knotSequence.getKnotIndexNormalizedBasisAtSequenceStart();
     * // Returns: {knot: KnotIndexStrictlyIncreasingSequence{knotIndex: 2}, basisAtSeqExt: NotNormalized}
     */
    getKnotIndexNormalizedBasisAtSequenceStart(): {knot: KnotIndexStrictlyIncreasingSequence, basisAtSeqExt: NormalizedBasisAtSequenceExtremity} {
        let cumulativeMultiplicity = this.knotSequence[0].multiplicity;
        let index = 0;
        let basisAtSeqStart: NormalizedBasisAtSequenceExtremity = NormalizedBasisAtSequenceExtremity.NotNormalized;
        while(cumulativeMultiplicity < this._maxMultiplicityOrder && index < (this.knotSequence.length - 1)) {
            index++;
            cumulativeMultiplicity = cumulativeMultiplicity + this.knotSequence[index].multiplicity;
        }
        if(cumulativeMultiplicity > this._maxMultiplicityOrder) {
            basisAtSeqStart = NormalizedBasisAtSequenceExtremity.OverDefined;
        } else if(cumulativeMultiplicity === this._maxMultiplicityOrder) {
            basisAtSeqStart = NormalizedBasisAtSequenceExtremity.StrictlyNormalized;
        }
        return {knot: new KnotIndexStrictlyIncreasingSequence(index), basisAtSeqExt: basisAtSeqStart};
    }

    /**
     * Validates that knot multiplicities at normalized basis boundaries are equal.
     * 
     * @description
     * Compares the multiplicities of knots at the left and right boundaries of the 
     * normalized basis interval. This check ensures the B-spline basis maintains 
     * consistent behavior at both ends of the interval. This consition is particularly important for
     * open knot sequences describing closed curves.
     * 
     * The method:
     * 1. Gets the indices of knots bounding the normalized basis
     * 2. Compares their multiplicities
     * 3. Throws an error if they differ
     * 
     * @throws {RangeError} If the multiplicities at the normalized basis boundaries differ
     * 
     * @example
     * // Valid sequence [0,0,0,1,2,3,3,3] with maxMultiplicityOrder = 3
     * knotSequence.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
     * // Passes validation (both ends have multiplicity 3)
     * 
     * @example
     * // Invalid sequence [0,0,0,1,2,3,3] with maxMultiplicityOrder = 3
     * knotSequence.checkKnotMultiplicitiesAtNormalizedBasisBoundaries();
     * // Throws RangeError: multiplicities at normalized basis bounds differ (multiplicity at left bound: 3, multiplicity at right bound: 1)
     */
    protected checkKnotMultiplicitiesAtNormalizedBasisBoundaries(): void {
        const indexLeftBoundBasis = this.getKnotIndexNormalizedBasisAtSequenceStart().knot.knotIndex;
        const indexRightBoundBasis = this.getKnotIndexNormalizedBasisAtSequenceEnd().knot.knotIndex;
        if(this.knotSequence[indexLeftBoundBasis].multiplicity !== this.knotSequence[indexRightBoundBasis].multiplicity) {
            this.throwRangeErrorMessage("checkKnotMultiplicitiesAtNormalizedBasisBoundaries", EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER);
        }
    }

    /**
     * Computes a minimal knot sequence for an open curve.
     * 
     * @description
     * Creates a minimal knot sequence consisting of two knots:
     * - First knot at 0 with maxMultiplicityOrder
     * - Second knot at 1 with maxMultiplicityOrder.
     * This method is associated with the constructor category NO_KNOT_OPEN_CURVE.
     * 
     * This configuration represents the simplest possible open curve B-spline,
     * where the basis functions are defined over [0,1].
     * 
     * The method:
     * 1. Validates maxMultiplicityOrder is at least 1
     * 2. Creates knots at 0 and 1 with maxMultiplicityOrder
     * 3. Sets uMax to the last knot abscissa (1)
     * 
     * @throws {RangeError} If maxMultiplicityOrder is less than 1
     * 
     * @example
     * // For maxMultiplicityOrder = 3
     * knotSequence.computeKnotSequenceFromMaxMultiplicityOrderOCurve();
     * // Results in knot sequence [0,0,0,1,1,1]
     * 
     * @example
     * // For maxMultiplicityOrder = 2
     * knotSequence.computeKnotSequenceFromMaxMultiplicityOrderOCurve();
     * // Results in knot sequence [0,0,1,1]
     */
    protected computeKnotSequenceFromMaxMultiplicityOrderOCurve(): void {
        const minValueMaxMultiplicityOrder = 1;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.knotSequence.push(new Knot(0, this._maxMultiplicityOrder));
        this.knotSequence.push(new Knot(1, this._maxMultiplicityOrder));
        this._uMax = this.knotSequence[this.knotSequence.length - 1].abscissa;
    }

    /**
     * Computes a minimal open knot sequence for a closed curve.
     *
     * @description
     * Creates a minimal uniform knot sequence consisting of:
     * - maxMultiplicityOrder knots up to the KNOT_SEQUENCE_ORIGIN (0) where starts the normalized basis,
     * - (maxMultiplicityOrder - 1) knots uniformly spaced that describe the normalized basis: uMax = maxMultiplicityOrder - 1,
     * - (maxMultiplicityOrder - 1) knots up to the last knot abscissa.
     * This method is associated with the constructor category NO_KNOT_CLOSED_CURVE.
     *
     * This configuration represents the simplest possible closed curve B-spline,
     * where the basis functions are defined over [0,1] and the curve is closed.
     *
     * The method:
     * 1. Validates maxMultiplicityOrder is at least 2
     * 2. Creates a uniform knot sequence with normalized basis origin KNOT_SEQUENCE_ORIGIN (0) with maxMultiplicityOrder
     * 3. Sets uMax to the knot abscissa (maxMultiplicityOrder - 1) except for maxMultiplicityOrder = 2 where uMax = 2 to
     * produce enough control vertices for the curve to be closed minimaly.
     *
     * @throws {RangeError} If maxMultiplicityOrder is less than 2
     *
     * @example
     * // For maxMultiplicityOrder = 3
     * knotSequence.computeKnotSequenceFromMaxMultiplicityOrderCCurve();
     * // Results in knot sequence [-2,-1,0,1,2,3,4]
     * // where the normalized basis interval is [0,2]
     *
     * @example
     * // For maxMultiplicityOrder = 2
     * knotSequence.computeKnotSequenceFromMaxMultiplicityOrderCCurve();
     * // Results in knot sequence [-1,0,1,2,3]
     * // where the normalized basis interval is [0,2]
     */
    protected computeKnotSequenceFromMaxMultiplicityOrderCCurve(): void {
        const minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        let upperBound = 2 * this._maxMultiplicityOrder - 1;
        if(this._maxMultiplicityOrder === 2) upperBound = 2 * this._maxMultiplicityOrder;
        for(let i = - (this._maxMultiplicityOrder - 1); i < upperBound; i++) {
            this.knotSequence.push(new Knot(i, 1));
        }
        this._uMax = this._maxMultiplicityOrder - 1;
        if(this._maxMultiplicityOrder === 2) this._uMax = 2;
    }

    /**
     * Computes a uniform open knot sequence for a given B-spline basis size.
     * 
     * @description
     * Creates a uniform knot sequence with uniformly spaced knots where:
     * - Knots start at -(maxMultiplicityOrder-1) to produce a normalized basis origin at KNOT_SEQUENCE_ORIGIN (0)
     * - Each knot has multiplicity 1
     * - Knots are spaced at unit intervals
     * - Sequence extends to accommodate the specified basis size after uMax set to (BsplBasisSize - 1).
     * 
     * The resulting sequence supports uniform B-spline basis functions
     * with consistent spacing and behavior across the domain that can be used
     * for open as well as closed curves.
     * 
     * @param knotParameters - Parameters defining the knot sequence with constructor type UNIFORM_OPENKNOTSEQUENCE
     * @param knotParameters.BsplBasisSize - Size of the B-spline basis
     * @throws {RangeError} If maxMultiplicityOrder is less than 2
     * @throws {RangeError} If BsplBasisSize is does not enable the generation of a consistent normalized basis
     * 
     * @example
     * // For maxMultiplicityOrder = 3 and BsplBasisSize = 5
     * const params = {
     *   type: UNIFORM_OPENKNOTSEQUENCE,
     *   BsplBasisSize: 5
     * };
     * knotSequence.computeUniformKnotSequenceFromBsplBasisSize(params);
     * // Results in [-2,-1,0,1,2,3,4,5,6]
     * 
     * @example
     * // For maxMultiplicityOrder = 2 and BsplBasisSize = 4
     * const params = {
     *   type: UNIFORM_OPENKNOTSEQUENCE,
     *   BsplBasisSize: 4
     * };
     * knotSequence.computeUniformKnotSequenceFromBsplBasisSize(params);
     * // Results in [-1,0,1,2,3,4]
     */
    protected computeUniformKnotSequenceFromBsplBasisSize(knotParameters: Uniform_OpenKnotSequence): void {
        const minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputBspBasisSizeAssessment(knotParameters);
        for(let i = - (this._maxMultiplicityOrder - 1); i < (knotParameters.BsplBasisSize + this._maxMultiplicityOrder - 1); i++) {
            this.knotSequence.push(new Knot(i, 1));
        }
        this._uMax = knotParameters.BsplBasisSize - 1;
    }

    /**
     * Computes a non-uniform open knot sequence for a given B-spline basis size of an open curve.
     *
     * @description
     * Creates a non-uniform knot sequence with knots at abscissas specified by the user.
     * The resulting sequence supports non-uniform B-spline basis functions with multiplicity maxMultiplicityOrder at both extremities
     * and a uniform spacing between of the intermediate knots.
     * Defines the uMax of the basis as: BsplBasisSize - maxMultiplicityOrder + 1.
     *
     * @param knotParameters - Parameters defining the knot sequence with constructor type NON_UNIFORM_OPENKNOTSEQUENCE
     * @param knotParameters.BsplBasisSize - Size of the B-spline basis
     * @throws {RangeError} If maxMultiplicityOrder is less than 2
     * @throws {RangeError} If BsplBasisSize is does not enable the generation of a consistent normalized basis
     *
     * @example
     * // For maxMultiplicityOrder = 3 and BsplBasisSize = 5
     * const params = {
     *   type: NON_UNIFORM_OPENKNOTSEQUENCE,
     *   BsplBasisSize: 5
     * };
     * knotSequence.computeNonUniformKnotSequenceFromBsplBasisSize(params);
     * // Results in [0,0,0,1,2,3,3,3]
     *
     * @example
     * // For maxMultiplicityOrder = 2 and BsplBasisSize = 4
     * const params = {
     *   type: NON_UNIFORM_OPENKNOTSEQUENCE,
     *   BsplBasisSize: 4
     * };
     * knotSequence.computeNonUniformKnotSequenceFromBsplBasisSize(params);
     * // Results in [0,0,1,2,3,3]
     */
    protected computeNonUniformKnotSequenceFromBsplBasisSize(knotParameters: UniformlySpreadInterKnots_OpenKnotSequence): void {
        const minValueMaxMultiplicityOrder = 2;
        this.constructorInputMultOrderAssessment(minValueMaxMultiplicityOrder);
        this.constructorInputBspBasisSizeAssessment(knotParameters);
        this.knotSequence.push(new Knot(0, this._maxMultiplicityOrder));
        for(let i = 0; i < knotParameters.BsplBasisSize - this._maxMultiplicityOrder; i++) {
            this.knotSequence.push(new Knot((i + 1), 1));
        }
        this.knotSequence.push(new Knot((knotParameters.BsplBasisSize - this._maxMultiplicityOrder + 1), this._maxMultiplicityOrder));
        this._uMax = knotParameters.BsplBasisSize - this._maxMultiplicityOrder + 1;
    }

    /**
     * Gets multiplicity of the knot located at specified abscissa.
     *
     * @param abscissa - abscissa of the knot to get multiplicity of
     * @returns {number} Multiplicity of the knot at the specified abscissa.
     * @throws warning message if abscissa is not found in the sequence and retruns a multiplicity order of 0.
     * 
     * @description
     * There is no error throw if the abscissa is below the abscissa of the first knot
     * or greater than the abscissa of the last knot since the value returned is 0 in all cases.
     * 
     * @example
     * // For sequence [0,0,0,1,2,3,3,3]
     * const mult = knotSequence.knotMultiplicityAtAbscissa(0); // Returns 3
     */
    knotMultiplicityAtAbscissa(abscissa: number): number {
        let multiplicity = 0;
        for(const knot of this.knotSequence) {
            if(Math.abs(abscissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                multiplicity = knot.multiplicity;
            }
        }
        if(multiplicity === 0) {
            const warning = new WarningLog(this.constructor.name, "getMultiplicityOfKnotAt", WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE);
            warning.logMessage();
        }
        return multiplicity;
    }

    /**
     * Inserts a new knot into the knot sequence.
     * 
     * @param abscissa - Abscissa value for new knot. Must be within [KNOT_SEQUENCE_ORIGIN, uMax]
     * @param multiplicity - Multiplicity of new knot. Must not exceed maxMultiplicityOrder. Defaults to 1
     * @returns {boolean} True if insertion successful, false if abscissa coincides with existing knot
     * 
     * @throws warning message if abscissa is too close to an existing knot.
     * @throws {RangeError} if the abscissa is smaller than KNOT_SEQUENCE_ORIGIN
     * @throws {RangeError} if the abscissa is greater than uMax
     * @throws {RangeError} if the multiplicity is greater than maxMultiplicityOrder
     * 
     * @description
     * The multiplicity of the inserted knot defaults to 1 and is bounded by maxMultiplicityOrder.
     * The new knot abscissa must be distinct from all other knots in the sequence. If not a warning message is issued and the method returns false.
     * The knot insertion process incorporates the knot increasing or knot strictly increasing constraint depending on the knot sequence type.
     * The uniformity of knot spacing, uniformity of knot multiplicity, and non uniformity of knot multiplicity at normalized basis boundaries are checked.

     * 
     * @example
     * // Insert knot with multiplicity 2 at x=1.5
     * knotSequence.insertKnot(1.5, 2);
     */
    insertKnot(abscissa: number, multiplicity: number = 1): boolean {
        let insertion = true;
        if(this.isAbscissaCoincidingWithKnot(abscissa)) {
            const warning = new WarningLog(this.constructor.name, "insertKnot", WM_ABSCISSA_TOO_CLOSE_TO_KNOT);
            warning.logMessage();
            insertion = false;
            return insertion;
        } else if(abscissa > this._uMax) {
            this.throwRangeErrorMessage("insertKnot", EM_KNOT_INSERTION_OVER_UMAX);
        } else if(abscissa < KNOT_SEQUENCE_ORIGIN) {
            this.throwRangeErrorMessage("insertKnot", EM_KNOT_INSERTION_UNDER_SEQORIGIN);
        }
        this.maxMultiplicityOrderInputParamAssessment(multiplicity, "insertKnot");
        if(insertion) {
            const knot = new Knot(abscissa, multiplicity);
            if(abscissa < this.knotSequence[0].abscissa) {
                this.knotSequence.splice(0, 0, knot);
            } else {
                let i = 0;
                while(i < (this.knotSequence.length - 1)) {
                    if(this.knotSequence[i].abscissa < abscissa && abscissa < this.knotSequence[i + 1].abscissa) break;
                    i++;
                }
                if(i === (this.knotSequence.length - 1)) {
                    this.knotSequence.push(knot);
                } else {
                    this.knotSequence.splice((i + 1), 0, knot);
                }
            }
            this.checkUniformityOfKnotSpacing();
            this.checkUniformityOfKnotMultiplicity();
            this.checkNonUniformKnotMultiplicityOrder();
        }
        return insertion;
    }

    /**
     * Removes a knot from the knot sequence at the specified index.
     * 
     * @param index - The index of the knot to remove, represented as a KnotIndexStrictlyIncreasingSequence object.
     * @throws {RangeError} If the knot index is out of bounds.
     * 
     * @description
     * This method removes a knot from the knot sequence at the specified index, whatever its multiplicity order. It updates the internal strictly increasing knot sequence array by:
     * 1. Retrieving the distinct abscissae and multiplicities of the current knot sequence.
     * 2. Removing the knot at the specified index from the abscissae and multiplicities arrays.
     * 3. Rebuilding the knot sequence array with the updated abscissae and multiplicities.
     */
    protected removeKnot(index: KnotIndexStrictlyIncreasingSequence): void {
        this.strictlyIncKnotIndexInputParamAssessment(index, "removeKnot");
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
    }

    /**
     * Raises the multiplicity of a knot at the specified index.
     * 
     * @param index - The index of the knot to modify, represented as a KnotIndexStrictlyIncreasingSequence object.
     * @param multiplicity - The amount to increase the knot's multiplicity. Defaults to 1.
     * @param checkSequenceConsistency - Whether to perform additional consistency checks. Defaults to true.
     * 
     * @throws {RangeError} If the knot index is out of bounds or if the new multiplicity violates sequence constraints.
     * 
     * @description
     * This method increases the multiplicity of a specified knot in the knot sequence.
     * 
     * The method includes several checks to maintain the mathematical validity of the knot sequence:
     * - Ensures the modified knot is not at the sequence boundaries
     * - Verifies that the new multiplicity doesn't exceed allowed maximums
     * - Checks for uniformity and allowed non-uniform orders in the sequence
     * 
     * @example
     * // Increase the multiplicity of the third knot (index 2) by 1
     * const index = { knotIndex: 2 };
     * this.raiseKnotMultiplicity(index);
     * 
     * // Increase the multiplicity of the fourth knot (index 3) by 2
     * const index2 = { knotIndex: 3 };
     * this.raiseKnotMultiplicity(index2, 2);
     */
    raiseKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence, multiplicity: number = 1, checkSequenceConsistency: boolean = true): void {
        this.strictlyIncKnotIndexInputParamAssessment(index, "raiseKnotMultiplicity");
        this.knotSequence[index.knotIndex].multiplicity += multiplicity;
        if(checkSequenceConsistency || (!checkSequenceConsistency && !this._isSequenceUpToC0Discontinuity)) {
            const basisAtEnd = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            if(index.knotIndex <= this._indexKnotOrigin.knotIndex || index.knotIndex >= basisAtEnd.knot.knotIndex) {
                this.throwRangeErrorMessage('raiseKnotMultiplicity', EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            }
            if(!this._isSequenceUpToC0Discontinuity) {
                this.checkMaxKnotMultiplicityAtIntermediateKnots();
            } else if(this.knotSequence[index.knotIndex].multiplicity > this._maxMultiplicityOrder) {
                this.throwRangeErrorMessage('raiseKnotMultiplicity', EM_MAXMULTIPLICITY_ORDER_ATKNOT);
            }
        }
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

    /**
     * Decrements the multiplicity of a knot at the specified index.
     * 
     * @param index - The index of the knot to modify, represented as a KnotIndexStrictlyIncreasingSequence object.
     * @param checkSequenceConsistency - Whether to perform additional consistency checks. Defaults to true.
     * 
     * @throws {RangeError} If the knot index is out of bounds
     * @throws {RangeError} if the new multiplicity violates sequence constraints regarding the interval of the normalized basis.
     * 
     * @description
     * This method decreases the multiplicity of a specified knot in the knot sequence.
     * If checkSequenceConsistency is true, it performs additional checks to ensure the sequence remains consistent, particularly the normalized basis setting
     * 
     * The method includes several checks to maintain the mathematical validity of the knot sequence:
     * - Ensures the modified knot is not at the sequence boundaries
     * - Removes the knot if its multiplicity becomes 1, except for the sequence origin
     * - Updates the knot sequence properties (uniform knot spacing, uniform knot multiplicity, non uniform knot multiplicity) accordingly
     * 
     * @example
     * // For sequence [0,0,0,1,1,2,3,3,3]
     * const index = new KnotIndexStrictlyIncreasingSequence(2);
     * knotSequence.decrementKnotMultiplicityMutSeq(index); // Results in [0,0,0,1,2,3,3,3]
     * // For sequence [0,0,0,1,2,3,3,3]
     * const index = new KnotIndexStrictlyIncreasingSequence(2);
     * knotSequence.decrementKnotMultiplicityMutSeq(index); // Results in [0,0,0,2,3,3,3]
     * 
     * // Decrement without consistency check
     * // For sequence [0,0,0,1,2,3,3,3]
     * const index = new KnotIndexStrictlyIncreasingSequence(0);
     * knotSequence.decrementKnotMultiplicityMutSeq(index, false); // Results in [0,0,1,2,3,3,3], the normalized basis interval is modified
     */
    protected decrementKnotMultiplicityMutSeq(index: KnotIndexStrictlyIncreasingSequence, checkSequenceConsistency: boolean = true): void {
        this.strictlyIncKnotIndexInputParamAssessment(index, "decrementKnotMultiplicityMutSeq");
        if(checkSequenceConsistency) {
            const basisAtEnd = this.getKnotIndexNormalizedBasisAtSequenceEnd();
            if(index.knotIndex <= this._indexKnotOrigin.knotIndex || index.knotIndex >= basisAtEnd.knot.knotIndex) {
                this.throwRangeErrorMessage('raiseKnotMultiplicity', EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            }
            if(this.knotSequence[index.knotIndex].multiplicity === 1) {
                if(index.knotIndex === this._indexKnotOrigin.knotIndex) {
                    this.throwRangeErrorMessage("decrementKnotMultiplicityMutSeq", EM_SEQUENCE_ORIGIN_REMOVAL);
                } else {
                    this.removeKnot(index);
                }
            } else {
                this.knotSequence[index.knotIndex].decrementMultiplicity();
            }
        } else {
            if(this.knotSequence[index.knotIndex].multiplicity === 1) {
                this.removeKnot(index);
            } else {
                this.knotSequence[index.knotIndex].decrementMultiplicity();
            }
        }

        this.checkUniformityOfKnotSpacing();
        this.checkUniformityOfKnotMultiplicity();
        this.checkNonUniformKnotMultiplicityOrder();
    }

    /**
     * Updates and validates knot sequence through normalized basis analysis.
     * 
     * @throws {RangeError} If sequence start is not properly normalized
     * @throws {RangeError} If sequence end is not properly normalized
     * @throws {RangeError} If normalized basis interval is insufficient
     * 
     * @description
     *
     * - Updates maxMultiplicityOrder if needed based on knot multiplicities
     * - Validates normalization at sequence boundaries
     * - Ensures proper sequence origin position
     * - Sets correct uMax value
     * 
     * @example
     * // For sequence [0,0,0,1,2,3,3,3] with maxMultiplicityOrder = 3
     * knotSequence.updateKnotSequenceThroughNormalizedBasisAnalysis();
     * // Validates normalization and updates sequence properties
     * 
     * // For invalid sequence [0,0,1,2,3,3,3]
     * knotSequence.updateKnotSequenceThroughNormalizedBasisAnalysis();
     * // Throws error: Not normalized at sequence start
     */
    updateKnotSequenceThroughNormalizedBasisAnalysis(): void {
        for(let i = 0; i < this.knotSequence.length; i++) {
            const knot = this.knotSequence[i];
            if(knot.multiplicity > this._maxMultiplicityOrder) {
                this._maxMultiplicityOrder = knot.multiplicity;
            }
        }
        const indices = this.getKnotIndicesBoundingNormalizedBasis();
        if(indices.start.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            this._indexKnotOrigin = indices.start.knot;
            if(this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa !== KNOT_SEQUENCE_ORIGIN) {
                this.resetKnotAbscissaeToOrigin();
            }
            this._uMax = this.knotSequence[indices.end.knot.knotIndex].abscissa;
        } else if(indices.start.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.OverDefined) {
            this.throwRangeErrorMessage("updateKnotSequenceThroughNormalizedBasisAnalysis", EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART)
        } else if(indices.start.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.NotNormalized) {
            this.throwRangeErrorMessage("updateKnotSequenceThroughNormalizedBasisAnalysis",EM_NOT_NORMALIZED_BASIS)
        }
        if(indices.end.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.StrictlyNormalized) {
            this._uMax = this.knotSequence[indices.end.knot.knotIndex].abscissa;
        } else if(indices.end.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.NotNormalized) {
            this.throwRangeErrorMessage("updateKnotSequenceThroughNormalizedBasisAnalysis", EM_NOT_NORMALIZED_BASIS);
        } else if(indices.end.basisAtSeqExt === NormalizedBasisAtSequenceExtremity.OverDefined) {
            this.throwRangeErrorMessage("updateKnotSequenceThroughNormalizedBasisAnalysis", EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND);
        }
        if(indices.end.knot.knotIndex <= indices.start.knot.knotIndex) this.throwRangeErrorMessage("updateKnotSequenceThroughNormalizedBasisAnalysis", EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
    }

    /**
     * Resets all knot abscissae relative to the sequence origin.
     * 
     * @description
     * Translates all knot abscissae by subtracting the offset of the origin knot,
     * effectively moving the sequence origin to KNOT_SEQUENCE_ORIGIN (0).
     * Any resulting abscissa values that are within KNOT_COINCIDENCE_TOLERANCE of zero
     * are set exactly to KNOT_SEQUENCE_ORIGIN.
     * 
     * This method maintains the relative spacing between knots while ensuring
     * the sequence starts at the standard origin position.
     * 
     * @example
     * // For sequence with knots at [2,2,2,3,4,5,5,5]
     * knotSequence.resetKnotAbscissaeToOrigin();
     * // Results in [0,0,0,1,2,3,3,3]
     * 
     * @example
     * // For sequence with knots at [1.001,1.001,1.001,2,3,4,4,4]
     * // and KNOT_COINCIDENCE_TOLERANCE = 0.001
     * knotSequence.resetKnotAbscissaeToOrigin();
     * // Results in [0,0,0,1,2,3,3,3]
     */
    protected resetKnotAbscissaeToOrigin(): void {
        const offset = this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa;
        for(let i = 0; i < this.knotSequence.length; i++) {
            let newAbscissa = this.knotSequence[i].abscissa - offset;
            if(Math.abs(newAbscissa) < KNOT_COINCIDENCE_TOLERANCE) {
                newAbscissa = KNOT_SEQUENCE_ORIGIN;
            }
            this.knotSequence[i].abscissa = newAbscissa;
        }
    }

    protected revertKnotSpacing(): void {
        super.revertKnotSpacing();
        if(Math.abs(this.knotSequence[this._indexKnotOrigin.knotIndex].abscissa) > (KNOT_SEQUENCE_ORIGIN + KNOT_COINCIDENCE_TOLERANCE)) {
            this.resetKnotAbscissaeToOrigin();
        }
    }
}