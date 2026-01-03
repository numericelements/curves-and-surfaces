"use strict";
/**
 * Named constants for knot sequence constructor types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRICTLYINCREASINGPERIODICKNOTSEQUENCE = exports.INCREASINGPERIODICKNOTSEQUENCE = exports.UNIFORM_PERIODICKNOTSEQUENCE = exports.NO_KNOT_PERIODIC_CURVE = exports.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS = exports.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS = exports.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE = exports.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY = exports.STRICTLYINCREASINGOPENKNOTSEQUENCE = exports.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS = exports.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS = exports.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE = exports.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY = exports.INCREASINGOPENKNOTSEQUENCE = exports.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE = exports.UNIFORM_OPENKNOTSEQUENCE = exports.NO_KNOT_CLOSED_CURVE = exports.NO_KNOT_OPEN_CURVE = void 0;
/**
 * Identifies an open knot sequence dedicated to increasing and strictly increasing sequences describing open curves.
 *
 * @constant {No_Knot_OpenCurve} NO_KNOT_OPEN_CURVE
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
exports.NO_KNOT_OPEN_CURVE = 'No_Knot_OpenCurve';
/**
 * Identifies an open knot sequence dedicated to increasing and strictly increasing sequence describing closed curves.
 *
 * @constant {No_Knot_ClosedCurve} NO_KNOT_CLOSED_CURVE
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
exports.NO_KNOT_CLOSED_CURVE = 'No_Knot_ClosedCurve';
/**
 * Identifies a uniform open knot sequence type that can be applied to open or closed curves.
 *
 * @constant {Uniform_OpenKnotSequence} UNIFORM_OPENKNOTSEQUENCE
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
exports.UNIFORM_OPENKNOTSEQUENCE = 'Uniform_OpenKnotSequence';
/**
 * Identifies an open knot sequence with uniformly spread interior knots and non uniform multiplicity of the extreme knots.
 *
 * @constant {UniformlySpreadInterKnots_OpenKnotSequence} UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE
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
exports.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE = 'UniformlySpreadInterKnots_OpenKnotSequence';
/**
 * Identifies an increasing open knot sequence type to describe open curves or surfaces.
 *
 * @constant {IncreasingOpenKnotSequence} INCREASINGOPENKNOTSEQUENCE
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
exports.INCREASINGOPENKNOTSEQUENCE = 'IncreasingOpenKnotSequence';
/**
 * Identifies an increasing open knot sequence type to describe open curves or surfaces and may contain internal C0 discontinuities.
 *
 * @constant {IncreasingOpenKnotSequenceUpToC0Discontinuity} INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY
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
exports.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY = 'IncreasingOpenKnotSequenceUpToC0Discontinuity';
/**
 * Identifies an increasing open knot sequence type for closed curves or surfaces with periodic knots specified only.
 *
 * @constant {IncreasingOpenKnotSequenceClosedCurve} INCREASINGOPENKNOTSEQUENCECLOSEDCURVE
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
exports.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE = 'IncreasingOpenKnotSequenceClosedCurve';
/**
 * Identifies an increasing open knot sequence type for closed curves with all knots specified.
 *
 * @constant {IncreasingOpenKnotSequenceClosedCurve_allKnots} INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS
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
exports.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS = 'IncreasingOpenKnotSequenceClosedCurve_allKnots';
/**
 * Identifies an increasing open knot sequence type for closed curves/surface with all knots specified and possible C0 discontinuities internal to the normalized basis interval.
 *
 * @constant {IncreasingOpenKnotSequenceUpToC0DiscontinuityClosedCurve_allKnots} INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS
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
exports.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS = 'IncreasingOpenKnotSequenceUpToC0DiscontinuityClosedCurve_allKnots';
/**
 * Identifies a strictly increasing open knot sequence type that describes open curves/surfaces.
 *
 * @constant {StrictlyIncreasingOpenKnotSequence} STRICTLYINCREASINGOPENKNOTSEQUENCE
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
exports.STRICTLYINCREASINGOPENKNOTSEQUENCE = 'StrictlyIncreasingOpenKnotSequence';
/**
 * Identifies a strictly increasing open knot sequence type to describe open curves/surfaces and may contain internal C0 discontinuities.
 *
 * @constant {StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity} STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY
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
exports.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY = 'StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity';
/**
 * Identifies a strictly increasing open knot sequence type for closed curves or surfaces with periodic knots only.
 *
 * @constant {StrictlyIncreasingOpenKnotSequenceClosedCurve} STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE
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
exports.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE = 'StrictlyIncreasingOpenKnotSequenceClosedCurve';
/**
 * Identifies a strictly increasing open knot sequence type for closed curves/surfaces with all knots specified and possible C0 discontinuities internal to the normalized basis interval.
 *
 * @constant {StrictlyIncreasingOpenKnotSequenceClosedCurve_allKnots} STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS
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
exports.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS = 'StrictlyIncreasingOpenKnotSequenceClosedCurve_allKnots';
/**
 * Identifies a strictly increasing open knot sequence type for closed curves/surfaces with all knots specified and possible C0 discontinuities internal to the normalized basis interval.
 *
 * @constant {StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityClosedCurve_allKnots} STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS
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
exports.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS = 'StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityClosedCurve_allKnots';
/**
 * Identifies a periodic knot sequence dedicated to increasing and strictly increasing sequences describing closed curves.
 *
 * @constant {No_Knot_PeriodicCurve} NO_KNOT_PERIODIC_CURVE
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
exports.NO_KNOT_PERIODIC_CURVE = 'No_Knot_PeriodicCurve';
/**
 * Identifies a uniform periodic knot sequence type that can be applied to closed curves. The knot sequence is of increasing type.
 *
 * @constant {Uniform_PeriodicKnotSequence} UNIFORM_PERIODICKNOTSEQUENCE
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
exports.UNIFORM_PERIODICKNOTSEQUENCE = 'Uniform_PeriodicKnotSequence';
/**
 * Identifies an increasing periodic knot sequence type to describe closed curves or surfaces.
 *
 * @constant {IncreasingPeriodicKnotSequence} INCREASINGPERIODICKNOTSEQUENCE
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
exports.INCREASINGPERIODICKNOTSEQUENCE = 'IncreasingPeriodicKnotSequence';
/**
 * Identifies a strictly increasing periodic knot sequence type that describes closed curves/surfaces.
 *
 * @constant {StrictIncreasingPeriodicKnotSequence} STRICTLYINCREASINGPERIODICKNOTSEQUENCE
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
exports.STRICTLYINCREASINGPERIODICKNOTSEQUENCE = 'StrictIncreasingPeriodicKnotSequence';
