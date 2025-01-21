"use strict";
/**
 * Constants used for knot sequence operations and validations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizedBasisAtSequenceExtremity = exports.KNOT_COINCIDENCE_TOLERANCE = exports.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA = exports.KNOT_SEQUENCE_ORIGIN = void 0;
/**
 * @description
 * Default origin abscissa for all knot sequences. The origin of the knot sequence coincides with the left bound of the normalized basis interval
 *
 * @constant {number}
 */
exports.KNOT_SEQUENCE_ORIGIN = 0.0;
/**
 * @description
 * Initialization value of the upper bound of the last knot abscissa of a knot sequence: Infinity
 *
 * @constant {number}
 */
exports.UPPER_BOUND_NORMALIZED_BASIS_DEFAULT_ABSCISSA = Infinity;
// Important remark: There is an interaction between KNOT_COINCIDENCE_TOLERANCE and CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// when computing the zeros of a BSplineR1toR1. KNOT_COINCIDENCE_TOLERANCE currently set to 10E-2 CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// It may be needed to check if there are side effects (JCL 2024/05/06).
/**
 * @description
 * Tolerance value for determining whether two knot abscissae coincide or not.
 * Used in equality comparisons for knot positions.
 *
 * @constant {number}
 */
exports.KNOT_COINCIDENCE_TOLERANCE = 1e-9;
/**
 * @description
 * Characterizes the distribution of basis functions located at open knot sequence ends.
 * This distribution, which is influenced by the multiplicity order of each knot originating a basis function, enables the characterization of the existence of a knot abscissa where the normalized basis starts.
 *
 * Used to determine how basis functions are consistent with the knot sequence origin, i.e., the normalized basis starts at
 * KNOT_SEQUENCE_ORIGIN.
 *
 * @enum {NotNormalized, StrictlyNormalized, OverDefined}
 * @example
 * For a knot sequence [0,0,0,1,2,3,3,3] with maxMultiplicityOrder = 3, the normalized basis starts at 0 (it is StrictlyNormalized) and coincides with curve origin and ends at 3 (it is StrictlyNormalized).
 * For a knot sequence [-2,-1,0,1,2,3,4,5] with maxMultiplicityOrder = 3, the normalized basis starts at 0 (it is StrictlyNormalized) and coincides with curve origin and ends at 3 (it is StrictlyNormalized).
 * For a knot sequence [-2,-1,0,1] with maxMultiplicityOrder = 3, there is no knot abscissa where the normalized basis starts (it is NotNormalized).
 * For a knot sequence [-1,0,0,0,1,2,3,3,3] with maxMultiplicityOrder = 3, the normalized basis starts at 0 and coincides with curve origin but it is OverDefined because the basis function defined with [-1,0,0,0] is unecessary. The normalized basis ends at 3 (it is StrictlyNormalized).
 */
var NormalizedBasisAtSequenceExtremity;
(function (NormalizedBasisAtSequenceExtremity) {
    /**
     * There is no knot abscissa where the normalized basis starts or ends.
     */
    NormalizedBasisAtSequenceExtremity["NotNormalized"] = "NotNormalized";
    /**
     * The normalized basis is exactly defined and starts or ends at some knot abscissa.
     */
    NormalizedBasisAtSequenceExtremity["StrictlyNormalized"] = "StrictlyNormalized";
    /**
     * A normalized basis can be defined that starts or ends at some knot abscissa but some basis functions are unecessary.
     */
    NormalizedBasisAtSequenceExtremity["OverDefined"] = "OverDefined";
})(NormalizedBasisAtSequenceExtremity = exports.NormalizedBasisAtSequenceExtremity || (exports.NormalizedBasisAtSequenceExtremity = {}));
;
