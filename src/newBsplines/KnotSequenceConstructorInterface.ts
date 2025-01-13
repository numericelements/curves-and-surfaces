
/**
 * Named constants for knot sequence constructor types
 */

/**
 * Identifies an open knot sequence dedicated to increasing and strictly increasing sequences describing open curves.
 * 
 * @constant {string} NO_KNOT_OPEN_CURVE
 * @description
 * Used to specify a knot sequence where:
 * - There are only two knots at positions 0 and 1
 * - Both knots have multiplicity equal to maxMultiplicityOrder
 * - Sequence represents minimal open curve configurations
 * - Sequence represents an open curve
 * 
 * @example
 * const params = {
 *   type: NO_KNOT_OPEN_CURVE
 * }; // produces a knot array [0,0,0,1,1,1] with maxMultiplicityOrder = 3 or [0,0,1,1] with maxMultiplicityOrder = 2
 */
export const NO_KNOT_OPEN_CURVE = 'No_Knot_OpenCurve';

/**
 * Identifies an open knot sequence dedicated to increasing and strictly increasing sequence describing closed curves.
 * 
 * @constant {string} NO_KNOT_CLOSED_CURVE
 * @description
 * Used to specify a knot sequence where:
 * - All knots are uniformly spaced
 * - All knots have multiplicity of 1
 * - Sequence starts at -(maxMultiplicityOrder-1)
 * - Sequence ends at 2*maxMultiplicityOrder-1 (or 2*maxMultiplicityOrder if maxMultiplicityOrder=2)
 * - Sequence represents a closed curve
 * 
 * @example
 * const params = {
 *   type: NO_KNOT_CLOSED_CURVE
 * }; // produces a knot array [-2,-1,0,1,2,3,4] with maxMultiplicityOrder = 3 or [-1,0,1,2,3] with maxMultiplicityOrder = 2
 */
export const NO_KNOT_CLOSED_CURVE = 'No_Knot_ClosedCurve';

/**
 * Identifies a uniform open knot sequence type that can be applied to open or closed curves.
 * 
 * @constant {string} UNIFORM_OPENKNOTSEQUENCE
 * @description
 * Used to specify an open knot sequence that can be increaing or stricly increasing where:
 * - All knots are uniformly spaced
 * - All knots have multiplicity of 1
 * - Sequence starts at -(maxMultiplicityOrder-1)
 * - Sequence ends at BsplBasisSize + (maxMultiplicityOrder - 1)
 * - Sequence is open (not periodic) and applicable to open or closed curves
 * 
 * @example
 * const params = {
 *   type: UNIFORM_OPENKNOTSEQUENCE,
 *   BsplBasisSize: 3
 * };   // produces a knot array [-2,-1,0,1,2,3,4,5] with maxMultiplicityOrder = 3
 */
export const UNIFORM_OPENKNOTSEQUENCE = 'Uniform_OpenKnotSequence';

/**
 * Identifies an open knot sequence with uniformly spread interior knots and non uniform multiplicity of the extreme knots.
 * 
 * @constant {string} UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE
 * @description
 * Used to specify a knot sequence where:
 * - End knots have multiplicity equal to maxMultiplicityOrder
 * - Interior knots are uniformly distributed and have multiplicity of 1
 * - Sequence is open (not periodic),
 * - The size of the B-Spline basis is provided as a parameter.
 * Devoted to open curves or surfaces.
 * 
 * @example
 * const params = {
 *   type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE,
 *   BsplBasisSize: 5
 * };
 */
export const UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE = 'UniformlySpreadInterKnots_OpenKnotSequence';

/**
 * Identifies an increasing open knot sequence type to describe open curves or surfaces.
 * 
 * @constant {string} INCREASINGOPENKNOTSEQUENCE
 * @description
 * Used to specify an increasing open knot sequence where:
 * - Knots form a non-decreasing sequence
 * - Multiple knots at same location are allowed to express a knot multiplicity
 * - Sequence is open (not periodic)
 * - knots strictly internal to the normalized basis interval have a multiplicity up to (maxMultiplicityOrder-1)
 * - The entire knot sequence is provided as an array of knots.
 * The array of knot cannot contain knots strictly inside the normalized basis interval with
 * a multiplicity equal to maxMultiplicityOrder to make sure that the sequence described defines a single curve/surface only.
 * 
 * @example
 * const params = {
 *   type: INCREASINGOPENKNOTSEQUENCE,
 *   knots: [0, 0, 0, 1, 2.5, 3, 3, 3], // with maxMultiplicityOrder = 3
 * };
 */
export const INCREASINGOPENKNOTSEQUENCE = 'IncreasingOpenKnotSequence';

/**
 * Identifies an increasing open knot sequence type to describe open curves or surfaces and may contain internal C0 discontinuities.
 * 
 * @constant {string} INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY
 * @description
 * Used to specify an increasing open knot sequence where:
 * - Knots form a non-decreasing sequence
 * - Multiple knots at same position are allowed to express a knot multiplicity
 * - Knot multiplicity can reach maxMultiplicityOrder at interior knots
 * - Sequence allows C0 discontinuities at interior knots of the normalized basis interval
 * - Sequence is open (not periodic)
 * - The entire knot sequence is provided as an array of knots.
 * 
 * @example
 * const params = {
 *   type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY,
 *   knots: [0,0,0,1,2,2,2,3,3,3], // with maxMultiplicityOrder = 3
 * };
 * 
 * @example
 * const params = {
 *   type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY,
 *   knots: [-2,-1,0,1,2,2,2,3,4,5,6], // with maxMultiplicityOrder = 3
 * };
 */
export const INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY = 'IncreasingOpenKnotSequenceUpToC0Discontinuity';

/**
 * Identifies an increasing open knot sequence type for closed curves or surfaces with periodic knots specified only.
 * 
 * @constant {string} INCREASINGOPENKNOTSEQUENCECLOSEDCURVE
 * @description
 * Used to specify an increasing open knot sequence where:
 * - Knots form a non-decreasing sequence
 * - Multiple knots at same position are allowed to express a knot multiplicity
 * - Knot sequence represents a closed curve using open knot vector, periodicity constraints hold for some knots at extremities of the sequence
 * - periodicity conditions constrain knot spacing at sequence extremities to contribute to curve closure
 * - knot multiplicities near the extremities of the sequence are analyzed to ensure a consistent definition of a normalized basis interval
 * - the array of periodic knots is provided as an array of knots and defines the normalized basis interval.
 *  Knots are added automatically to incorporate periodicity constraints.
 * - knots strictly internal to the normalized basis interval have a multiplicity up to (maxMultiplicityOrder-1)
 * - Interior knots define shape control
 * 
 * @example
 * const params = {
 *   type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE,
 *   periodicKnots: [0,1,2,2,3,4], // with maxMultiplicityOrder = 3 produces a knot array [-2,-1,0,1,2,2,3,4,5,6]
 * };
 * 
 * @example
 * const params = {
 *   type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE,
 *   periodicKnots: [0,0,1.1,2,2,3,4,4], // with maxMultiplicityOrder = 3 produces a knot array [-1,0,0,1.1,2,2,3,4,4,5.1]
 * };
 */
export const INCREASINGOPENKNOTSEQUENCECLOSEDCURVE = 'IncreasingOpenKnotSequenceClosedCurve';

/**
 * Identifies an increasing open knot sequence type for closed curves with all knots specified.
 * 
 * @constant {string} INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS
 * @description
 * Used to specify an increasing open knot sequence for closed curves where:
 * - Knots form a non-decreasing sequence
 * - Multiple knots at same position are allowed
 * - Sequence represents a closed curve using an open knot sequence, periodicity constraints hold for some knots at extremities of the sequence
 * - End conditions ensure curve closure and must be incorporated in knot sequence definition to ensure the knot sequence consistency
 * - All knots including end knots are explicitly specified
 * - Full control over knot placement and multiplicity
 * 
 * @example
 * const params = {
 *   type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS,
 *   knots: [0, 0, 0, 1, 2, 3, 3, 3] // with maxMultiplicityOrder = 3
 * };
 * 
 * @example
 * const params = {
 *   type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS,
 *   knots: [-1,0,0,1.1,2,2,3,4,4,5.1], // with maxMultiplicityOrder = 3
 * };
 */
export const INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS = 'IncreasingOpenKnotSequenceClosedCurve_allKnots';

/**
 * Identifies an increasing open knot sequence type for closed curves/surface with all knots specified and possible C0 discontinuities internal to the normalized basis interval.
 * 
 * @constant {string} INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS
 * @description
 * Represents an open knot sequence type for closed curves that:
 * - Knots form a non-decreasing sequence
 * - Allows C0 discontinuities at strictly internal knots of the normalized basis interval (knots with maxMultiplicityOrder multiplicity)
 * - End conditions ensure curve closure and must be incorporated in knot sequence definition to ensure the knot sequence consistency
 * - All knots including end knots are explicitly specified
 * 
 * This type combines the characteristics of closed curves (where the curve endpoints meet) 
 * while allowing C0 discontinuities (discontinuity of the closed curves) 
 * at internal knots (the curve can be open there).
 * 
 * @example
 * const params = {
 *   type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS,
 *   knots: [0, 0, 0, 1, 2, 3, 3, 3] // with maxMultiplicityOrder = 3
 * };
 * 
 * @example
 * const params = {
 *   type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS,
 *   knots: [-1,0,0,1.1,2,2,2,3,4,4,5.1], // with maxMultiplicityOrder = 3
 * };
 */
export const INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS = 'IncreasingOpenKnotSequenceUpToC0DiscontinuityClosedCurve_allKnots';

/**
 * Identifies a strictly increasing open knot sequence type that describes open curves/surfaces.
 * 
 * @constant {string} STRICTLYINCREASINGOPENKNOTSEQUENCE
 * @description
 * Used to specify a strictly open knot sequence where:
 * - Knots form a strictly increasing sequence (No repeated knot abscissa allowed)
 * - Sequence is open (not periodic)
 * - Full control over knot placement while maintaining strict monotonicity
 * - knots strictly internal to the normalized basis interval have a multiplicity up to (maxMultiplicityOrder-1)
 * - The entire knot sequence is provided as an array of knots.
 * - The entire list of knot multiplicities is provided as an array of multiplicities.
 * 
 * The array of knots cannot contain knots strictly inside the normalized basis interval with
 * a multiplicity equal to maxMultiplicityOrder to make sure that the sequence described defines a single curve/surface only.
 * 
 * @example
 * const params = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCE,
 *   knots: [0,1,2,3,4],
 *   multiplicities: [3,1,2,1,3] // with maxMultiplicityOrder = 3
 * };
 *
 * @example
 * const params = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCE,
 *   knots: [-3,-2,-1,0,1,2,3,4,5,6],
 *   multiplicities: [1,1,1,1,1,1,1,1,1,1] // with maxMultiplicityOrder = 4
 * };
 */
export const STRICTLYINCREASINGOPENKNOTSEQUENCE = 'StrictlyIncreasingOpenKnotSequence';

/**
 * Identifies a strictly increasing open knot sequence type to describe open curves/surfaces and may contain internal C0 discontinuities.
 * 
 * @constant {string} STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY
 * @description
 * Used to specify a strictly increasing knot sequence where:
 * - Knots form a strictly increasing sequence
 * - Each knot must have greater abscissa value than previous
 * - Knot multiplicity can reach maxMultiplicityOrder at interior knots
 * - Sequence allows C0 discontinuities at interior knots of the normalized basis interval
 * - Sequence is open (not periodic)
 * - The entire knot sequence is provided as an array of knots.
 * - The entire list of knot multiplicities is provided as an array of multiplicities.
 * 
 * The array of knots can contain knots strictly inside the normalized basis interval with
 * a multiplicity equal to maxMultiplicityOrder. The knot sequence can describe multiple disconnected curves/surfaces.
 * 
 * @example
 * const params = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY,
 *   knots: [0,1,2,3,4],
 *   multiplicities: [3,1,3,1,3] // with maxMultiplicityOrder = 3
 * };
 *
 * @example
 * const params = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY,
 *   knots: [-3,-2,-1,0,1,2,3,4,5,6],
 *   multiplicities: [1,1,1,1,4,1,1,1,1,1] // with maxMultiplicityOrder = 4
 * };
 */
export const STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY = 'StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity';

/**
 * Identifies a strictly increasing open knot sequence type for closed curves or surfaces with periodic knots only.
 * 
 * @constant {string} STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE
 * @description
 * Used to specify a knot sequence where:
 * - Knots form a strictly increasing sequence
 * - Each knot must have greater value than previous
 * - Knot sequence represents a closed curve using open knot vector, periodicity constraints hold for some knots at extremities of the sequence
 * - periodicity conditions constrain knot spacing at sequence extremities to contribute to curve closure
 * - knot multiplicities near the extremities of the sequence are analyzed to ensure a consistent definition of a normalized basis interval
 * - the array of periodic knots is provided as an array of knots and defines the normalized basis interval.
 *  Knots are added automatically to incorporate periodicity constraints.
 * - The periodic knot multiplicities are provided as an array of multiplicities.
 * - knots strictly internal to the normalized basis interval have a multiplicity up to (maxMultiplicityOrder-1)
 * - Interior knots define shape control
 * 
 * @example
 * const params = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE,
 *   periodicKnots: [0,1,2,3,4], 
 *   multiplicities: [1,1,2,1,1]  // with maxMultiplicityOrder = 3 produces a knot array [-2,-1,0,1,2,3,4,5,6] with multiplicities [1,1,1,1,2,1,1,1,1]
 * };
 * 
 * @example
 * const params = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE,
 *   periodicKnots: [0,0,1.1,2,2,3,4,4], 
 *   multiplicities: [2,1,2,1,2]  // with maxMultiplicityOrder = 3 produces a knot array [-1,0,0,1.1,2,2,3,4,4,5.1] with multiplicities [1,2,1,2,1,2,1]
 * };
 */
export const STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE = 'StrictlyIncreasingOpenKnotSequenceClosedCurve';

/**
 * Identifies a strictly increasing open knot sequence type for closed curves/surfaces with all knots specified and possible C0 discontinuities internal to the normalized basis interval.
 * 
 * @constant {string} STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS
 * @description
 * Used to specify a strictly increasing knot sequence type for closed curves where:
 * - Knots form a strictly increasing sequence
 * - Each knot must have greater value than previous
 * - Sequence represents a closed curve using an open knot sequence, periodicity constraints hold for some knots at extremities of the sequence
 * - End conditions ensure curve closure and must be incorporated in knot sequence definition to ensure the knot sequence consistency
 * - All knots including end knots are explicitly specified
 * - Full control over knot placement and multiplicity
 * 
 * @example
 * const params = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS,
 *   knots: [0,1,2,3],
 *   multiplicities: [3,1,1,3] // with maxMultiplicityOrder = 3
 * };
 * 
 * @example
 * const params = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS,
 *   knots: [-1,0,1.1,2,3,4,5.1],
 *   multiplicities: [1,2,1,2,1,2,1] // with maxMultiplicityOrder = 3
 * };
 */
export const STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS = 'StrictlyIncreasingOpenKnotSequenceClosedCurve_allKnots';

/**
 * Identifies a strictly increasing open knot sequence type for closed curves/surfaces with all knots specified and possible C0 discontinuities internal to the normalized basis interval.
 *
 * @constant {string} STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS
 * @description
 * Used to specify a strictly increasing knot sequence type for closed curves where:
 * - Knots form a strictly increasing sequence
 * - Each knot must have greater value than previous
 * - Sequence represents a closed curve using an open knot sequence, periodicity constraints hold for some knots at extremities of the sequence
 * - End conditions ensure curve closure and must be incorporated in knot sequence definition to ensure the knot sequence consistency
 * - All knots including end knots are explicitly specified
 * - Full control over knot placement and multiplicity
 *
 * @example
 * const params = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS,
 *   knots: [0,1,2,3],
 *   multiplicities: [3,1,3,3] // with maxMultiplicityOrder = 3
 * };
 *
 * @example
 * const params = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS,
 *   knots: [-1,0,1.1,2,3,4,5.1],
 *   multiplicities: [1,2,1,2,1,2,1] // with maxMultiplicityOrder = 3
 * };
 */
export const STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS = 'StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityClosedCurve_allKnots';

/**
 * Identifies a periodic knot sequence dedicated to increasing and strictly increasing sequences describing closed curves.
 * 
 * @constant {string} NO_KNOT_PERIODIC_CURVE
 * @description
 * Used to specify a periodic knot sequence where:
 * - Knots abscissa are spread with uniform spacing across the normalized basis interval
 * - Knot multiplicity is uniformly set to 1
 * - Knot sequence length equals (maxMultiplicityOrder+1)
 * - Sequence represents minimal closed curve configurations
 * - Sequence represents a closed curve
 * 
 * @example
 * const params = {
 *   type: NO_KNOT_PERIODIC_CURVE
 * }; // produces a knot array [0,1,2,3] with maxMultiplicityOrder = 3 where the knot array corresponds to the periodic knots
 * 
 * @example
 * const params = {
 *   type: NO_KNOT_PERIODIC_CURVE
 * }; // produces a knot array [0,1,2] with maxMultiplicityOrder = 1. A particular case of a periodic knot sequence to describe the smallest closed curve configuration for a linear B-Spline
 */
export const NO_KNOT_PERIODIC_CURVE = 'No_Knot_PeriodicCurve';

/**
 * Identifies a uniform periodic knot sequence type that can be applied to closed curves. The knot sequence is of increasing type.
 * 
 * @constant {string} UNIFORM_PERIODICKNOTSEQUENCE
 * @description
 * Used to specify an periodic knot sequence that is increaing where:
 * - All knots are uniformly spaced
 * - All knots have multiplicity of 1
 * - Sequence starts at KNOT_SEQUENCE_ORIGIN
 * - Sequence ends at abscissa BsplBasisSize
 * - Sequence is periodic and applicable to closed curves
 * - BsplBasisSize must equal or greater than (maxMultiplicityOrder+1)
 * 
 * @example
 * const params = {
 *   type: UNIFORM_PERIODICKNOTSEQUENCE,
 *   BsplBasisSize: 3
 * };   // produces a knot array [0,1,2,3,4,5] with maxMultiplicityOrder = 3
 */
export const UNIFORM_PERIODICKNOTSEQUENCE = 'Uniform_PeriodicKnotSequence';

/**
 * Identifies an increasing periodic knot sequence type to describe closed curves or surfaces.
 * 
 * @constant {string} INCREASINGPERIODICKNOTSEQUENCE
 * @description
 * Used to specify an increasing periodic knot sequence where:
 * - Knots form a non-decreasing sequence
 * - Multiple knots at same location are allowed to express a knot multiplicity
 * - Sequence is periodic
 * - knots strictly internal to the normalized basis interval have a multiplicity up to maxMultiplicityOrder
 * - The entire knot sequence is provided as an array of knots.
 * The normalized basis spans the interval [KNOT_SEQUENCE_ORIGIN, last knot abscissa]
 * 
 * @example
 * const params = {
 *   type: INCREASINGPERIODICKNOTSEQUENCE,
 *   periodicKnots: [0,0,0,1,2.5,3,3,3], // with maxMultiplicityOrder = 3
 * };
 * 
 * @example
 * const params = {
 *   type: INCREASINGPERIODICKNOTSEQUENCE,
 *   periodicKnots: [0,1,1,1,2.5,3], // with maxMultiplicityOrder = 3
 * };
 */
export const INCREASINGPERIODICKNOTSEQUENCE = 'IncreasingPeriodicKnotSequence';

/**
 * Identifies a strictly increasing periodic knot sequence type that describes closed curves/surfaces.
 * 
 * @constant {string} STRICTLYINCREASINGPERIODICKNOTSEQUENCE
 * @description
 * Used to specify a strictly periodic knot sequence where:
 * - Knots form a strictly increasing sequence (No repeated knot abscissa allowed)
 * - Sequence is periodic
 * - Full control over knot placement while maintaining strict monotonicity
 * - knots have a multiplicity up to maxMultiplicityOrder
 * - The entire knot sequence is provided as an array of knots.
 * - The entire list of knot multiplicities is provided as an array of multiplicities.
 * The normalized basis spans the interval [KNOT_SEQUENCE_ORIGIN, last knot abscissa]
 * 
 * @example
 * const params = {
 *   type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE,
 *   periodicKnots: [0,1,2,3,4],
 *   multiplicities: [3,1,2,1,3] // with maxMultiplicityOrder = 3
 * };
 *
 * @example
 * const params = {
 *   type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE,
 *   periodicKnots: [0,1,2,3,4,5,6],
 *   multiplicities: [1,1,1,1,1,1,1] // with maxMultiplicityOrder = 4
 * };
 */
export const STRICTLYINCREASINGPERIODICKNOTSEQUENCE = 'StrictIncreasingPeriodicKnotSequence';


/**
 * Interface for defining an open knot sequence for open curves with minimal number of parameters.
 * 
 * @interface OpenKnotSequenceOpenCurve
 * @description
 * Represents the simplest configuration for an open knot sequence where:
 * - Only two knots are used (at abscissae 0 and 1)
 * - Both knots have multiplicity equal to maxMultiplicityOrder
 * - Sequence represents minimal open curve configurations
 * - Sequence represents an open curve
 * 
 * @property {typeof NO_KNOT_OPEN_CURVE} type - Must be set to NO_KNOT_OPEN_CURVE constant
 */
export interface OpenKnotSequenceOpenCurve {
    type: typeof NO_KNOT_OPEN_CURVE;
}

/**
 * Interface for defining an open knot sequence for closed curves with minimal number of parameters.
 * 
 * @interface OpenKnotSequenceClosedCurve
 * @description
 * Represents the simplest configuration for an open knot sequence where:
 * - All knots are uniformly spaced
 * - All knots have multiplicity of 1
 * - Sequence starts at -(maxMultiplicityOrder-1)
 * - Sequence ends at 2*maxMultiplicityOrder-1 (or 2*maxMultiplicityOrder if maxMultiplicityOrder=2)
 * - Sequence represents a closed curve
 * 
 * @property {typeof NO_KNOT_CLOSED_CURVE} type - Must be set to NO_KNOT_CLOSED_CURVE constant
 */
export interface OpenKnotSequenceClosedCurve {
    type: typeof NO_KNOT_CLOSED_CURVE;
}

/**
 * Interface for defining a uniform open knot sequence that can be applied to open or closed curves.
 * 
 * @interface Uniform_OpenKnotSequence
 * @description
 * Represents a uniform open knot sequence where:
 * - All knots are uniformly spaced
 * - All knots have multiplicity of 1
 * - Sequence starts at -(maxMultiplicityOrder-1)
 * - Sequence ends at BsplBasisSize + (maxMultiplicityOrder - 1)
 * - Sequence is open (not periodic) and applicable to open or closed curves
 * 
 * @property {typeof UNIFORM_OPENKNOTSEQUENCE} type - Must be set to UNIFORM_OPENKNOTSEQUENCE constant
 * @property {number} BsplBasisSize - Size of the B-spline basis, must be greater than maxMultiplicityOrder
 */
export interface Uniform_OpenKnotSequence {
    type: typeof UNIFORM_OPENKNOTSEQUENCE;
    BsplBasisSize: number;
}

/**
 * Interface for defining an open knot sequence with uniformly spread interior knots and non uniform multiplicity of the extreme knots.
 * 
 * @interface UniformlySpreadInterKnots_OpenKnotSequence
 * @description
 * Represents an open knot sequence where:
 * - End knots have multiplicity equal to maxMultiplicityOrder
 * - Interior knots are uniformly distributed and have multiplicity of 1
 * - Sequence is open (not periodic)
 * - The size of the B-Spline basis is provided as a parameter
 * - Devoted to open curves or surfaces
 * 
 * @property {typeof UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE} type - Must be set to UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE constant
 * @property {number} BsplBasisSize - Size of the B-spline basis, must be greater than maxMultiplicityOrder
 */
export interface UniformlySpreadInterKnots_OpenKnotSequence {
    type: typeof UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE;
    BsplBasisSize: number;
}

/**
 * Interface for defining an increasing open knot sequence type that describes open curves or surfaces.
 * 
 * @interface IncreasingOpenKnotSequence
 * @description
 * Represents an increasing open knot sequence where:
 * - Knots form a non-decreasing sequence
 * - Multiple knots at same location are allowed to express a knot multiplicity
 * - Sequence is open (not periodic)
 * - knots strictly internal to the normalized basis interval have a multiplicity up to (maxMultiplicityOrder-1)
 * - The entire knot sequence is provided as an array of knots
 * 
 * The array of knots cannot contain knots strictly inside the normalized basis interval with
 * a multiplicity equal to maxMultiplicityOrder to make sure that the sequence described defines a single curve/surface only.
 * 
 * @property {typeof INCREASINGOPENKNOTSEQUENCE} type - Must be set to INCREASINGOPENKNOTSEQUENCE constant
 * @property {number[]} knots - Array of knot values in non-decreasing order
 */
export interface IncreasingOpenKnotSequence {
    type: typeof INCREASINGOPENKNOTSEQUENCE;
    knots: number[];
}

/**
 * Interface for defining an increasing open knot sequence type that describes open curves/surfaces and may contain internal C0 discontinuities.
 * 
 * @interface IncreasingOpenKnotSequenceUpToC0Discontinuity
 * @description
 * Represents an increasing open knot sequence where:
 * - Knots form a non-decreasing sequence
 * - Multiple knots at same position are allowed to express a knot multiplicity
 * - Knot multiplicity can reach maxMultiplicityOrder at interior knots
 * - Sequence allows C0 discontinuities at interior knots of the normalized basis interval
 * - Sequence is open (not periodic)
 * - The entire knot sequence is provided as an array of knots
 * 
 * The array of knots can contain knots strictly inside the normalized basis interval with
 * a multiplicity equal to maxMultiplicityOrder. The knot sequence can describe multiple disconnected curves/surfaces.
 * 
 * @property {typeof INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY} type - Must be set to INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY constant
 * @property {number[]} knots - Array of knot values in non-decreasing order
 */
export interface IncreasingOpenKnotSequenceUpToC0Discontinuity {
    type: typeof INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY;
    knots: number[];
}

/**
 * Interface for defining an increasing open knot sequence type for closed curves with periodic knots specified only.
 * 
 * @interface IncreasingOpenKnotSequenceCCurve
 * @description
 * Represents an increasing open knot sequence where:
 * - Knots form a non-decreasing sequence
 * - Multiple knots at same position are allowed to express a knot multiplicity
 * - Knot sequence represents a closed curve using open knot vector
 * - Periodicity constraints hold for knots at sequence extremities
 * - Knot multiplicities near extremities ensure consistent normalized basis interval
 * - Only periodic knots defining the normalized basis interval are provided
 * - Additional knots are automatically added to satisfy periodicity constraints
 * - Interior knots strictly within normalized basis interval have multiplicity up to (maxMultiplicityOrder-1)
 * 
 * @property {typeof INCREASINGOPENKNOTSEQUENCECLOSEDCURVE} type - Must be set to INCREASINGOPENKNOTSEQUENCECLOSEDCURVE constant
 * @property {number[]} periodicKnots - Array of periodic knot values in non-decreasing order that define the normalized basis interval
 */
export interface IncreasingOpenKnotSequenceCCurve {
    type: typeof INCREASINGOPENKNOTSEQUENCECLOSEDCURVE;
    periodicKnots: number[];
}

/**
 * Interface for defining an increasing open knot sequence type for closed curves with all knots specified.
 * 
 * @interface IncreasingOpenKnotSequenceCCurve_allKnots
 * @description
 * Represents an increasing open knot sequence where:
 * - Knots form a non-decreasing sequence
 * - Multiple knots at same position are allowed to express a knot multiplicity
 * - Sequence represents a closed curve using open knot vector
 * - End conditions ensure curve closure and must be incorporated in knot sequence definition
 * - All knots including end knots are explicitly specified
 * - Full control over knot placement and multiplicity
 * - Interior knots define shape control
 * 
 * @property {typeof INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS} type - Must be set to INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS constant
 * @property {number[]} knots - Array of all knot values in non-decreasing order, including end knots
 */
export interface IncreasingOpenKnotSequenceCCurve_allKnots {
    type: typeof INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS;
    knots: number[];
}

/**
 * Interface for defining an increasing open knot sequence type for closed curves with all knots specified and possible C0 discontinuities.
 * 
 * @interface IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots
 * @description
 * Represents an increasing open knot sequence where:
 * - Knots form a non-decreasing sequence
 * - Multiple knots at same position are allowed to express a knot multiplicity
 * - Sequence represents a closed curve using open knot vector
 * - End conditions ensure curve closure and must be incorporated in knot sequence definition
 * - All knots including end knots are explicitly specified
 * - Full control over knot placement and multiplicity
 * - Allows C0 discontinuities at interior knots (knots with maxMultiplicityOrder multiplicity)
 * - Interior knots define shape control and potential discontinuity locations
 * 
 * @property {typeof INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS} type - Must be set to INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS constant
 * @property {number[]} knots - Array of all knot values in non-decreasing order, including end knots
 */
export interface IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots {
    type: typeof INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS;
    knots: number[];
}

/**
 * Interface for defining a strictly increasing open knot sequence type that describes open curves/surfaces.
 * 
 * @interface StrictlyIncreasingOpenKnotSequence
 * @description
 * Represents a strictly increasing open knot sequence where:
 * - Knots form a strictly increasing sequence (No repeated knot abscissa allowed)
 * - Sequence is open (not periodic)
 * - Full control over knot placement while maintaining strict monotonicity
 * - knots strictly internal to the normalized basis interval have a multiplicity up to (maxMultiplicityOrder-1)
 * - The entire knot sequence is provided as an array of knots
 * - The entire list of knot multiplicities is provided as an array of multiplicities
 * 
 * The array of knots cannot contain knots strictly inside the normalized basis interval with
 * a multiplicity equal to maxMultiplicityOrder to make sure that the sequence described defines a single curve/surface only.
 * 
 * @property {typeof STRICTLYINCREASINGOPENKNOTSEQUENCE} type - Must be set to STRICTLYINCREASINGOPENKNOTSEQUENCE constant
 * @property {number[]} knots - Array of strictly increasing knot abscissae
 * @property {number[]} multiplicities - Array of multiplicity values for each knot
 */
export interface StrictlyIncreasingOpenKnotSequence {
    type: typeof STRICTLYINCREASINGOPENKNOTSEQUENCE;
    knots: number[];
    multiplicities: number[];
}

/**
 * Interface for defining a strictly increasing open knot sequence type that describes open curves/surfaces and may contain internal C0 discontinuities.
 * 
 * @interface StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity
 * @description
 * Represents a strictly increasing knot sequence where:
 * - Knots form a strictly increasing sequence
 * - Each knot must have greater abscissa value than previous
 * - Knot multiplicity can reach maxMultiplicityOrder at interior knots
 * - Sequence allows C0 discontinuities at interior knots of the normalized basis interval
 * - Sequence is open (not periodic)
 * - The entire knot sequence is provided as an array of knots
 * - The entire list of knot multiplicities is provided as an array of multiplicities
 * 
 * The array of knots can contain knots strictly inside the normalized basis interval with
 * a multiplicity equal to maxMultiplicityOrder. The knot sequence can describe multiple disconnected curves/surfaces.
 * 
 * @property {typeof STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY} type - Must be set to STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY constant
 * @property {number[]} knots - Array of strictly increasing knot abscissae 
 * @property {number[]} multiplicities - Array of multiplicity values for each knot
 */
export interface StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity {
    type: typeof STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY;
    knots: number[];
    multiplicities: number[];
}

/**
 * Interface for defining a strictly increasing open knot sequence type for closed curves with periodic knots only.
 * 
 * @interface StrictlyIncreasingOpenKnotSequenceCCurve
 * @description
 * Represents a strictly increasing open knot sequence where:
 * - Knots form a strictly increasing sequence
 * - Each knot must have greater value than previous
 * - Knot sequence represents a closed curve using open knot sequence
 * - Periodicity constraints hold for knots at sequence extremities
 * - Knot multiplicities near extremities ensure consistent normalized basis interval
 * - Only periodic knots defining the normalized basis interval are provided
 * - Additional knots are automatically added to satisfy periodicity constraints
 * - Interior knots strictly within normalized basis interval have multiplicity up to (maxMultiplicityOrder-1)
 * 
 * @property {typeof STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE} type - Must be set to STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE constant
 * @property {number[]} periodicKnots - Array of strictly increasing periodic knot abscissae that define the normalized basis interval
 * @property {number[]} multiplicities - Array of multiplicity values for each periodic knot
 */
export interface StrictlyIncreasingOpenKnotSequenceCCurve {
    type: typeof STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE;
    periodicKnots: number[];
    multiplicities: number[];
}

/**
 * Interface for defining a strictly increasing open knot sequence type for closed curves with all knots specified.
 * 
 * @interface StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots
 * @description
 * Represents a strictly increasing open knot sequence where:
 * - Knots form a strictly increasing sequence
 * - Each knot must have greater value than previous
 * - Sequence represents a closed curve using open knot sequence
 * - End conditions ensure curve closure and must be incorporated in knot sequence definition
 * - All knots including end knots are explicitly specified
 * - Full control over knot placement and multiplicity
 * - Interior knots define shape control
 * 
 * @property {typeof STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS} type - Must be set to STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS constant
 * @property {number[]} knots - Array of strictly increasing knot abscissae, including end knots
 * @property {number[]} multiplicities - Array of multiplicity values for each knot
 */
export interface StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots {
    type: typeof STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS;
    knots: number[];
    multiplicities: number[];
}

/**
 * Interface for defining a strictly increasing open knot sequence type for closed curves with all knots specified and possible C0 discontinuities.
 * 
 * @interface StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots
 * @description
 * Represents a strictly increasing open knot sequence where:
 * - Knots form a strictly increasing sequence
 * - Each knot must have greater value than previous
 * - Sequence represents a closed curve using open knot sequence
 * - End conditions ensure curve closure and must be incorporated in knot sequence definition
 * - All knots including end knots are explicitly specified
 * - Full control over knot placement and multiplicity
 * - Allows C0 discontinuities at interior knots (knots with maxMultiplicityOrder multiplicity)
 * - Interior knots define shape control and potential discontinuity locations
 * 
 * @property {typeof STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS} type - Must be set to STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS constant
 * @property {number[]} knots - Array of strictly increasing knot abscissae, including end knots
 * @property {number[]} multiplicities - Array of multiplicity values for each knot
 */
export interface StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots {
    type: typeof STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS;
    knots: number[];
    multiplicities: number[];
}

/**
 * Type representing simple open knot sequence configurations for closed curves.
 * 
 * @type {BasicOpenKnotSequenceClosedCurve_type}
 * @description
 * Represents the union of two basic knot sequence types for closed curves:
 * - OpenKnotSequenceClosedCurve: Minimal configuration with uniformly spaced knots and multiplicity 1
 * - Uniform_OpenKnotSequence: Uniform open knot sequence with configurable B-spline basis size
 * 
 * Both types maintain:
 * - Open knot sequence structure
 * - Uniform knot spacing
 * - Support for closed curve representation
 * - Consistent end conditions for curve closure
 */
export type BasicOpenKnotSequenceClosedCurve_type = OpenKnotSequenceClosedCurve | Uniform_OpenKnotSequence;

/**
 * Type representing simple open knot sequence configurations for open curves.
 * 
 * @type {BasicOpenKnotSequenceOpenCurve_type}
 * @description
 * Represents the union of three basic knot sequence types for open curves:
 * - OpenKnotSequenceOpenCurve: Minimal configuration with two knots at 0 and 1 with maxMultiplicityOrder
 * - Uniform_OpenKnotSequence: Uniform open knot sequence with configurable B-spline basis size
 * - UniformlySpreadInterKnots_OpenKnotSequence: Open knot sequence with uniform interior knots and maxMultiplicityOrder at ends
 * 
 * All types maintain:
 * - Open knot sequence structure
 * - Support for open curve representation
 * - Consistent end conditions
 * - Various levels of shape control through knot placement
 */
export type BasicOpenKnotSequenceOpenCurve_type = OpenKnotSequenceOpenCurve | Uniform_OpenKnotSequence | UniformlySpreadInterKnots_OpenKnotSequence;

/**
 * Type representing all possible increasing open knot sequence configurations for open curves.
 * 
 * @type {IncreasingOpenKnotSequenceOpenCurve_type}
 * @description
 * Represents the union of these knot sequence types for open curves:
 * - BasicOpenKnotSequenceOpenCurve_type: Basic configurations including minimal and uniform sequences
 * - IncreasingOpenKnotSequence: Non-decreasing sequence with controlled multiplicity
 * - IncreasingOpenKnotSequenceUpToC0Discontinuity: Non-decreasing sequence allowing C0 discontinuities
 * 
 * All types maintain:
 * - Open knot sequence structure (not periodic)
 * - Non-decreasing knot values
 * - Support for open curve representation
 * - Various levels of continuity control through knot multiplicity
 * - Different degrees of shape control through knot placement and multiplicity
 * 
 * @example
 * // Basic minimal configuration
 * const minimal: IncreasingOpenKnotSequenceOpenCurve_type = {
 *   type: NO_KNOT_OPEN_CURVE
 * };
 * 
 * @example
 * // Increasing sequence with controlled multiplicity
 * const increasing: IncreasingOpenKnotSequenceOpenCurve_type = {
 *   type: INCREASINGOPENKNOTSEQUENCE,
 *   knots: [0,0,0,1,2.5,3,3,3]
 * };
 * 
 * @example
 * // Sequence with potential C0 discontinuities
 * const withC0Discontinuities: IncreasingOpenKnotSequenceOpenCurve_type = {
 *   type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY,
 *   knots: [0,0,0,1,2,2,2,3,3,3]
 * };
 */
export type IncreasingOpenKnotSequenceOpenCurve_type = BasicOpenKnotSequenceOpenCurve_type | IncreasingOpenKnotSequence | IncreasingOpenKnotSequenceUpToC0Discontinuity;

/**
 * Type representing all possible increasing open knot sequence configurations for closed curves.
 * 
 * @type {IncreasingOpenKnotSequenceClosedCurve_type}
 * @description
 * Represents the union of these knot sequence types for closed curves:
 * - BasicOpenKnotSequenceClosedCurve_type: Basic configurations including minimal and uniform sequences
 * - IncreasingOpenKnotSequenceCCurve: Non-decreasing sequence with periodic knots only
 * - IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots: Full knot sequence, possibly with C0 discontinuitie at internal knots
 * - IncreasingOpenKnotSequenceCCurve_allKnots: Full knot sequence without C0 discontinuities
 * 
 * All types maintain:
 * - Open knot sequence structure used to represent closed curves
 * - Non-decreasing knot values
 * - Support for closed curve representation through periodicity conditions
 * - Various levels of continuity control through knot multiplicity
 * - Different degrees of shape control through knot placement
 * 
 * @example
 * // Basic minimal configuration
 * const minimal: IncreasingOpenKnotSequenceClosedCurve_type = {
 *   type: NO_KNOT_CLOSED_CURVE
 * };
 * 
 * @example
 * // Increasing sequence with periodic knots only
 * const periodicOnly: IncreasingOpenKnotSequenceClosedCurve_type = {
 *   type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE,
 *   periodicKnots: [0,1,2,2,3,4]
 * };
 * 
 * @example
 * // Full sequence with potential C0 discontinuities
 * const withDiscontinuities: IncreasingOpenKnotSequenceClosedCurve_type = {
 *   type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS,
 *   knots: [-1,0,0,1.1,2,2,2,3,4,4,5.1]
 * };
 */
export type IncreasingOpenKnotSequenceClosedCurve_type = BasicOpenKnotSequenceClosedCurve_type | IncreasingOpenKnotSequenceCCurve | IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots | IncreasingOpenKnotSequenceCCurve_allKnots;

/**
 * Type representing all possible strictly increasing open knot sequence configurations for open curves.
 * 
 * @type {StrictlyIncreasingOpenKnotSequenceOpenCurve_type}
 * @description
 * Represents the union of these knot sequence types for open curves:
 * - BasicOpenKnotSequenceOpenCurve_type: Basic configurations including minimal and uniform sequences
 * - StrictlyIncreasingOpenKnotSequence: Strictly increasing sequence with controlled multiplicity
 * - StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity: Strictly increasing sequence allowing C0 discontinuities at internal knots
 * 
 * All types maintain:
 * - Open knot sequence structure (not periodic)
 * - Strictly increasing knot values (no repeated abscissae)
 * - Support for open curve representation
 * - Various levels of continuity control through knot multiplicity
 * - Different degrees of shape control through knot placement and multiplicity
 * 
 * @example
 * // Basic minimal configuration
 * const minimal: StrictlyIncreasingOpenKnotSequenceOpenCurve_type = {
 *   type: NO_KNOT_OPEN_CURVE
 * };
 * 
 * @example
 * // Strictly increasing sequence with controlled multiplicity
 * const increasing: StrictlyIncreasingOpenKnotSequenceOpenCurve_type = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCE,
 *   knots: [0,1,2,3,4],
 *   multiplicities: [3,1,2,1,3]
 * };
 * 
 * @example
 * // Sequence with potential C0 discontinuities
 * const withC0Discontinuities: StrictlyIncreasingOpenKnotSequenceOpenCurve_type = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY,
 *   knots: [0,1,2,3,4],
 *   multiplicities: [3,1,3,1,3]
 * };
 */
export type StrictlyIncreasingOpenKnotSequenceOpenCurve_type = BasicOpenKnotSequenceOpenCurve_type | StrictlyIncreasingOpenKnotSequence | StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity;

/**
 * Type representing all possible strictly increasing open knot sequence configurations for closed curves.
 * 
 * @type {StrictlyIncreasingOpenKnotSequenceClosedCurve_type}
 * @description
 * Represents the union of these knot sequence types for closed curves:
 * - BasicOpenKnotSequenceClosedCurve_type: Basic configurations including minimal and uniform sequences
 * - StrictlyIncreasingOpenKnotSequenceCCurve: Strictly increasing sequence with periodic knots only
 * - StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots: Full knot sequence without C0 discontinuities
 * - StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots: Full sequence allowing C0 discontinuities at internal knots
 * 
 * All types maintain:
 * - Open knot sequence structure used to represent closed curves
 * - Strictly increasing knot values (no repeated abscissae)
 * - Support for closed curve representation through periodicity conditions
 * - Various levels of continuity control through knot multiplicity
 * - Different degrees of shape control through knot placement
 * 
 * @example
 * // Basic minimal configuration
 * const minimal: StrictlyIncreasingOpenKnotSequenceClosedCurve_type = {
 *   type: NO_KNOT_CLOSED_CURVE
 * };
 * 
 * @example
 * // Strictly increasing sequence with periodic knots only
 * const periodicOnly: StrictlyIncreasingOpenKnotSequenceClosedCurve_type = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE,
 *   periodicKnots: [0,1,2,3,4],
 *   multiplicities: [1,1,2,1,1]
 * };
 * 
 * @example
 * // Full sequence with potential C0 discontinuities
 * const withDiscontinuities: StrictlyIncreasingOpenKnotSequenceClosedCurve_type = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS,
 *   knots: [-1,0,1.1,2,3,4,5.1],
 *   multiplicities: [1,2,1,3,1,2,1]
 * };
 */
export type StrictlyIncreasingOpenKnotSequenceClosedCurve_type = BasicOpenKnotSequenceClosedCurve_type | StrictlyIncreasingOpenKnotSequenceCCurve | StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots | StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots;

/**
 * Type representing all possible increasing open knot sequence configurations for both open and closed curves.
 * 
 * @type {AbstractIncreasingOpenKnotSequence_type}
 * @description
 * Represents the union of increasing open knot sequence types for both open and closed curves:
 * - IncreasingOpenKnotSequenceOpenCurve_type: All increasing sequences for open curves
 * - IncreasingOpenKnotSequenceClosedCurve_type: All increasing sequences for closed curves
 * 
 * All types maintain:
 * - Open knot sequence structure 
 * - Non-decreasing knot values
 * - Support for both open and closed curve representations
 * - Various levels of continuity control through knot multiplicity
 * - Different degrees of shape control through knot placement
 * 
 * This type serves as an abstraction layer that unifies the handling of increasing 
 * open knot sequences regardless of whether they describe open or closed curves.
 * 
 * @example
 * // For open curve
 * const openCurve: AbstractIncreasingOpenKnotSequence_type = {
 *   type: INCREASINGOPENKNOTSEQUENCE,
 *   knots: [0,0,0,1,2.5,3,3,3]
 * };
 * 
 * @example
 * // For closed curve
 * const closedCurve: AbstractIncreasingOpenKnotSequence_type = {
 *   type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE,
 *   periodicKnots: [0,1,2,2,3,4]
 * };
 */
export type AbstractIncreasingOpenKnotSequence_type = IncreasingOpenKnotSequenceOpenCurve_type | IncreasingOpenKnotSequenceClosedCurve_type;

/**
 * Type representing all possible strictly increasing open knot sequence configurations for both open and closed curves.
 * 
 * @type {AbstractStrictlyIncreasingOpenKnotSequence_type}
 * @description
 * Represents the union of strictly increasing open knot sequence types for both open and closed curves:
 * - StrictlyIncreasingOpenKnotSequenceOpenCurve_type: All strictly increasing sequences for open curves
 * - StrictlyIncreasingOpenKnotSequenceClosedCurve_type: All strictly increasing sequences for closed curves
 * 
 * All types maintain:
 * - Open knot sequence structure 
 * - Strictly increasing knot values (no repeated abscissae)
 * - Support for both open and closed curve representations
 * - Various levels of continuity control through knot multiplicity
 * - Different degrees of shape control through knot placement
 * 
 * This type serves as an abstraction layer that unifies the handling of strictly increasing 
 * open knot sequences regardless of whether they describe open or closed curves.
 * 
 * @example
 * // For open curve
 * const openCurve: AbstractStrictlyIncreasingOpenKnotSequence_type = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCE,
 *   knots: [0,1,2,3,4],
 *   multiplicities: [3,1,2,1,3]
 * };
 * 
 * @example
 * // For closed curve
 * const closedCurve: AbstractStrictlyIncreasingOpenKnotSequence_type = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE,
 *   periodicKnots: [0,1,2,3,4],
 *   multiplicities: [1,1,2,1,1]
 * };
 */
export type AbstractStrictlyIncreasingOpenKnotSequence_type = StrictlyIncreasingOpenKnotSequenceOpenCurve_type | StrictlyIncreasingOpenKnotSequenceClosedCurve_type;

/**
 * Type representing all possible open knot sequence configurations, including both increasing and strictly increasing sequences for open and closed curves.
 * 
 * @type {AbstractOpenKnotSequence_type}
 * @description
 * Represents the union of all open knot sequence types:
 * - AbstractIncreasingOpenKnotSequence_type: All increasing sequences for both open and closed curves
 * - AbstractStrictlyIncreasingOpenKnotSequence_type: All strictly increasing sequences for both open and closed curves
 * 
 * All types maintain:
 * - Open knot sequence structure
 * - Support for both open and closed curve representations
 * - Various levels of continuity control through knot multiplicity
 * - Different degrees of shape control through knot placement
 * 
 * This type serves as the highest-level abstraction for open knot sequences,
 * encompassing all possible configurations regardless of:
 * - Whether they are increasing or strictly increasing
 * - Whether they describe open or closed curves
 * - Their continuity properties
 * - Their knot placement and multiplicity patterns
 * 
 * @example
 * // For open curve with increasing sequence
 * const openIncreasing: AbstractOpenKnotSequence_type = {
 *   type: INCREASINGOPENKNOTSEQUENCE,
 *   knots: [0,0,0,1,2.5,3,3,3]
 * };
 * 
 * @example
 * // For closed curve with strictly increasing sequence
 * const closedStrictlyIncreasing: AbstractOpenKnotSequence_type = {
 *   type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE,
 *   periodicKnots: [0,1,2,3,4],
 *   multiplicities: [1,1,2,1,1]
 * };
 */
export type AbstractOpenKnotSequence_type = AbstractIncreasingOpenKnotSequence_type | AbstractStrictlyIncreasingOpenKnotSequence_type;


/**
 * Interface for defining a periodic knot sequence with minimal number of parameters for closed curves.
 * 
 * @interface PeriodicKnotSequence
 * @description
 * Represents the simplest configuration for a periodic knot sequence where:
 * - Knots abscissa are spread with uniform spacing across the normalized basis interval
 * - Knot multiplicity is uniformly set to 1
 * - Knot sequence length equals (maxMultiplicityOrder+1)
 * - Sequence represents minimal closed curve configurations
 * - Sequence represents a closed curve
 * 
 * @property {typeof NO_KNOT_PERIODIC_CURVE} type - Must be set to NO_KNOT_PERIODIC_CURVE constant
 * 
 * @example
 * const params: PeriodicKnotSequence = {
 *   type: NO_KNOT_PERIODIC_CURVE
 * }; // produces a knot array [0,1,2,3] with maxMultiplicityOrder = 3
 */
export interface PeriodicKnotSequence {
    type: typeof NO_KNOT_PERIODIC_CURVE;
}

/**
 * Interface for defining a uniform periodic knot sequence type that can be applied to closed curves.
 * 
 * @interface Uniform_PeriodicKnotSequence
 * @description
 * Represents a periodic knot sequence where:
 * - All knots are uniformly spaced
 * - All knots have multiplicity of 1
 * - Sequence starts at KNOT_SEQUENCE_ORIGIN
 * - Sequence ends at abscissa BsplBasisSize
 * - Sequence is periodic and applicable to closed curves
 * - BsplBasisSize must be equal or greater than (maxMultiplicityOrder+1)
 * 
 * @property {typeof UNIFORM_PERIODICKNOTSEQUENCE} type - Must be set to UNIFORM_PERIODICKNOTSEQUENCE constant
 * @property {number} BsplBasisSize - Size of the B-spline basis, must be greater than maxMultiplicityOrder
 * 
 * @example
 * const params: Uniform_PeriodicKnotSequence = {
 *   type: UNIFORM_PERIODICKNOTSEQUENCE,
 *   BsplBasisSize: 3
 * };   // produces a knot array [0,1,2,3,4,5] with maxMultiplicityOrder = 3
 */
export interface Uniform_PeriodicKnotSequence {
    type: typeof UNIFORM_PERIODICKNOTSEQUENCE;
    BsplBasisSize: number;
}

/**
 * Interface for defining an increasing periodic knot sequence type to describe closed curves or surfaces.
 * 
 * @interface IncreasingPeriodicKnotSequence
 * @description
 * Used to specify an increasing periodic knot sequence where:
 * - Knots form a non-decreasing sequence
 * - Multiple knots at same location are allowed to express a knot multiplicity
 * - Sequence is periodic
 * - knots strictly internal to the normalized basis interval have a multiplicity up to maxMultiplicityOrder
 * - The entire knot sequence is provided as an array of knots.
 * The normalized basis spans the interval [KNOT_SEQUENCE_ORIGIN, last knot abscissa]
 * 
 * @property {typeof INCREASINGPERIODICKNOTSEQUENCE} type - Must be set to INCREASINGPERIODICKNOTSEQUENCE constant
 * @property {number[]} periodicKnots - Array of knot values in non-decreasing order
 * 
 * @example
 * const params: IncreasingPeriodicKnotSequence = {
 *   type: INCREASINGPERIODICKNOTSEQUENCE,
 *   periodicKnots: [0,0,0,1,2.5,3,3,3] // with maxMultiplicityOrder = 3
 * };
 * 
 * @example
 * const params: IncreasingPeriodicKnotSequence = {
 *   type: INCREASINGPERIODICKNOTSEQUENCE,
 *   periodicKnots: [0,1,1,1,2.5,3] // with maxMultiplicityOrder = 3
 * };
 */
export interface IncreasingPeriodicKnotSequence {
    type: typeof INCREASINGPERIODICKNOTSEQUENCE;
    periodicKnots: number[];
}

/**
 * Interface for defining a strictly increasing periodic knot sequence type that describes closed curves/surfaces.
 * 
 * @interface StrictIncreasingPeriodicKnotSequence
 * @description
 * Used to specify a strictly periodic knot sequence where:
 * - Knots form a strictly increasing sequence (No repeated knot abscissa allowed)
 * - Sequence is periodic
 * - Full control over knot placement while maintaining strict monotonicity
 * - knots have a multiplicity up to maxMultiplicityOrder
 * - The entire knot sequence is provided as an array of knots
 * - The entire list of knot multiplicities is provided as an array of multiplicities
 * The normalized basis spans the interval [KNOT_SEQUENCE_ORIGIN, last knot abscissa]
 * 
 * @property {typeof STRICTLYINCREASINGPERIODICKNOTSEQUENCE} type - Must be set to STRICTLYINCREASINGPERIODICKNOTSEQUENCE constant
 * @property {number[]} periodicKnots - Array of strictly increasing knot abscissae
 * @property {number[]} multiplicities - Array of multiplicity value for each knot
 * 
 * @example
 * const params: StrictIncreasingPeriodicKnotSequence = {
 *   type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE,
 *   periodicKnots: [0,1,2,3,4],
 *   multiplicities: [3,1,2,1,3] // with maxMultiplicityOrder = 3
 * };
 *
 * @example
 * const params: StrictIncreasingPeriodicKnotSequence = {
 *   type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE,
 *   periodicKnots: [0,1,2,3,4,5,6],
 *   multiplicities: [1,1,1,1,1,1,1] // with maxMultiplicityOrder = 4
 * };
 */
export interface StrictIncreasingPeriodicKnotSequence {
    type: typeof STRICTLYINCREASINGPERIODICKNOTSEQUENCE;
    periodicKnots: number[];
    multiplicities: number[];
}


/**
 * Type representing simple periodic knot sequence configurations for closed curves.
 * 
 * @type {BasicPeriodicKnotSequenceClosedCurve_type}
 * @description
 * Represents the union of two basic knot sequence types for closed curves:
 * - PeriodicKnotSequence: Minimal configuration with uniformly spaced knots and multiplicity 1
 * - Uniform_PeriodicKnotSequence: Uniform periodic knot sequence with configurable B-spline basis size
 * 
 * Both types maintain:
 * - Periodic knot sequence structure
 * - Uniform knot spacing
 * - Support for closed curve representation
 * - Consistent end conditions for curve closure
 * 
 * @example
 * // Minimal configuration
 * const minimal: BasicPeriodicKnotSequenceClosedCurve_type = {
 *   type: NO_KNOT_PERIODIC_CURVE
 * };
 * 
 * @example
 * // Uniform sequence with custom basis size
 * const uniform: BasicPeriodicKnotSequenceClosedCurve_type = {
 *   type: UNIFORM_PERIODICKNOTSEQUENCE,
 *   BsplBasisSize: 5
 * };
 */
export type BasicPeriodicKnotSequenceClosedCurve_type = PeriodicKnotSequence | Uniform_PeriodicKnotSequence;

/**
 * Type representing all possible increasing periodic knot sequence configurations for closed curves.
 * 
 * @type {IncreasingPeriodicKnotSequenceClosedCurve_type}
 * @description
 * Represents the union of these knot sequence types for closed curves:
 * - BasicPeriodicKnotSequenceClosedCurve_type: Basic configurations including minimal and uniform sequences
 * - IncreasingPeriodicKnotSequence: Non-decreasing sequence with periodic knots
 * 
 * All types maintain:
 * - Periodic knot sequence structure for closed curves
 * - Non-decreasing knot values
 * - Support for closed curve representation through periodicity
 * - Various levels of continuity control through knot multiplicity
 * - Different degrees of shape control through knot placement
 * 
 * @example
 * // Basic minimal configuration
 * const minimal: IncreasingPeriodicKnotSequenceClosedCurve_type = {
 *   type: NO_KNOT_PERIODIC_CURVE
 * };
 * 
 * @example
 * // Increasing periodic sequence
 * const periodic: IncreasingPeriodicKnotSequenceClosedCurve_type = {
 *   type: INCREASINGPERIODICKNOTSEQUENCE,
 *   periodicKnots: [0,0,0,1,2.5,3,3,3] // with maxMultiplicityOrder = 3
 * };
 */
export type IncreasingPeriodicKnotSequenceClosedCurve_type = BasicPeriodicKnotSequenceClosedCurve_type | IncreasingPeriodicKnotSequence;

/**
 * Type representing all possible strictly increasing periodic knot sequence configurations for closed curves.
 * 
 * @type {StrictIncreasingPeriodicKnotSequenceClosedCurve_type}
 * @description
 * Represents the union of these knot sequence types for closed curves:
 * - BasicPeriodicKnotSequenceClosedCurve_type: Basic configurations including minimal and uniform sequences
 * - StrictIncreasingPeriodicKnotSequence: Strictly increasing sequence with periodic knots
 * 
 * All types maintain:
 * - Periodic knot sequence structure for closed curves
 * - Strictly increasing knot values (no repeated abscissae)
 * - Support for closed curve representation through periodicity
 * - Various levels of continuity control through knot multiplicity
 * - Different degrees of shape control through knot placement
 * 
 * @example
 * // Basic minimal configuration
 * const minimal: StrictIncreasingPeriodicKnotSequenceClosedCurve_type = {
 *   type: NO_KNOT_PERIODIC_CURVE
 * };
 * 
 * @example
 * // Strictly increasing periodic sequence
 * const periodic: StrictIncreasingPeriodicKnotSequenceClosedCurve_type = {
 *   type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE,
 *   periodicKnots: [0,1,2,3,4],
 *   multiplicities: [3,1,2,1,3] // with maxMultiplicityOrder = 3
 * };
 */
export type StrictIncreasingPeriodicKnotSequenceClosedCurve_type =  BasicPeriodicKnotSequenceClosedCurve_type | StrictIncreasingPeriodicKnotSequence;

/**
 * Type representing all possible periodic knot sequence configurations for closed curves, including both increasing and strictly increasing sequences.
 * 
 * @type {AbstractPeriodicKnotSequenceClosedCurve_type}
 * @description
 * Represents the union of all periodic knot sequence types for closed curves:
 * - IncreasingPeriodicKnotSequenceClosedCurve_type: All increasing sequences for closed curves
 * - StrictIncreasingPeriodicKnotSequenceClosedCurve_type: All strictly increasing sequences for closed curves
 * 
 * All types maintain:
 * - Periodic knot sequence structure
 * - Support for closed curve representations
 * - Various levels of continuity control through knot multiplicity
 * - Different degrees of shape control through knot placement
 * 
 * This type serves as the highest-level abstraction for periodic knot sequences,
 * encompassing all possible configurations regardless of:
 * - Whether they are increasing or strictly increasing
 * - Their continuity properties
 * - Their knot placement and multiplicity patterns
 * 
 * @example
 * // For closed curve with increasing sequence
 * const increasingPeriodic: AbstractPeriodicKnotSequenceClosedCurve_type = {
 *   type: INCREASINGPERIODICKNOTSEQUENCE,
 *   periodicKnots: [0,0,0,1,2.5,3,3,3]
 * };
 * 
 * @example
 * // For closed curve with strictly increasing sequence
 * const strictlyIncreasingPeriodic: AbstractPeriodicKnotSequenceClosedCurve_type = {
 *   type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE,
 *   periodicKnots: [0,1,2,3,4],
 *   multiplicities: [1,1,2,1,1]
 * };
 */
export type AbstractPeriodicKnotSequenceClosedCurve_type = IncreasingPeriodicKnotSequenceClosedCurve_type | StrictIncreasingPeriodicKnotSequenceClosedCurve_type;