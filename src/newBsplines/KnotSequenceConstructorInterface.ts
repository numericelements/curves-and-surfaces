
/**
 * Named constants for knot sequence constructor types
 */

/**
 * Identifies an open knot sequence dedicated to increasing and strictly increasing sequence describing open curves.
 * 
 * @constant {string} NO_KNOT_OPEN_CURVE
 * @description
 * Used to specify a knot sequence where:
 * - There is only two knots at positions 0 and 1
 * - Both knots have multiplicity equal to maxMultiplicityOrder
 * - Sequence represents minimal open curve configuration
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
 * - The entire knot sequence is provided as an array of knots.
 * 
 * @example
 * const params = {
 *   type: INCREASINGOPENKNOTSEQUENCE,
 *   knots: [0, 0, 0, 1, 2.5, 3, 3, 3], // with maxMultiplicityOrder = 3
 * };
 */
export const INCREASINGOPENKNOTSEQUENCE = 'IncreasingOpenKnotSequence';


export const INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY = 'IncreasingOpenKnotSequenceUpToC0Discontinuity';
export const INCREASINGOPENKNOTSEQUENCECLOSEDCURVE = 'IncreasingOpenKnotSequenceClosedCurve';
export const INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS = 'IncreasingOpenKnotSequenceClosedCurve_allKnots';
export const INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS = 'IncreasingOpenKnotSequenceUpToC0DiscontinuityClosedCurve_allKnots';
export const STRICTLYINCREASINGOPENKNOTSEQUENCE = 'StrictlyIncreasingOpenKnotSequence';
export const STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY = 'StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity';
export const STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE = 'StrictlyIncreasingOpenKnotSequenceClosedCurve';
export const STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS = 'StrictlyIncreasingOpenKnotSequenceClosedCurve_allKnots';
export const STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS = 'StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityClosedCurve_allKnots';

export const NO_KNOT_PERIODIC_CURVE = 'No_Knot_PeriodicCurve';
export const UNIFORM_PERIODICKNOTSEQUENCE = 'Uniform_PeriodicKnotSequence';
export const INCREASINGPERIODICKNOTSEQUENCE = 'IncreasingPeriodicKnotSequence';
export const STRICTLYINCREASINGPERIODICKNOTSEQUENCE = 'StrictIncreasingPeriodicKnotSequence';


export interface OpenKnotSequenceOpenCurve {
    type: typeof NO_KNOT_OPEN_CURVE;
}

export interface OpenKnotSequenceClosedCurve {
    type: typeof NO_KNOT_CLOSED_CURVE;
}

export interface Uniform_OpenKnotSequence {
    type: typeof UNIFORM_OPENKNOTSEQUENCE;
    BsplBasisSize: number;
}

export interface UniformlySpreadInterKnots_OpenKnotSequence {
    type: typeof UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE;
    BsplBasisSize: number;
}

export interface IncreasingOpenKnotSequence {
    type: typeof INCREASINGOPENKNOTSEQUENCE;
    knots: number[];
}

export interface IncreasingOpenKnotSequenceUpToC0Discontinuity {
    type: typeof INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY;
    knots: number[];
}

export interface IncreasingOpenKnotSequenceCCurve {
    type: typeof INCREASINGOPENKNOTSEQUENCECLOSEDCURVE;
    periodicKnots: number[];
}

export interface IncreasingOpenKnotSequenceCCurve_allKnots {
    type: typeof INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS;
    knots: number[];
}

export interface IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots {
    type: typeof INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS;
    knots: number[];
}

export interface StrictlyIncreasingOpenKnotSequence {
    type: typeof STRICTLYINCREASINGOPENKNOTSEQUENCE;
    knots: number[];
    multiplicities: number[];
}

export interface StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity {
    type: typeof STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY;
    knots: number[];
    multiplicities: number[];
}

export interface StrictlyIncreasingOpenKnotSequenceCCurve {
    type: typeof STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE;
    periodicKnots: number[];
    multiplicities: number[];
}

export interface StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots {
    type: typeof STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS;
    knots: number[];
    multiplicities: number[];
}

export interface StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots {
    type: typeof STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS;
    knots: number[];
    multiplicities: number[];
}

export type BasicOpenKnotSequenceClosedCurve_type = OpenKnotSequenceClosedCurve | Uniform_OpenKnotSequence;
export type BasicOpenKnotSequenceOpenCurve_type = OpenKnotSequenceOpenCurve | Uniform_OpenKnotSequence | UniformlySpreadInterKnots_OpenKnotSequence;
export type IncreasingOpenKnotSequenceOpenCurve_type = BasicOpenKnotSequenceOpenCurve_type | IncreasingOpenKnotSequence | IncreasingOpenKnotSequenceUpToC0Discontinuity;
export type IncreasingOpenKnotSequenceClosedCurve_type = BasicOpenKnotSequenceClosedCurve_type | IncreasingOpenKnotSequenceCCurve | IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots | IncreasingOpenKnotSequenceCCurve_allKnots;
export type StrictlyIncreasingOpenKnotSequenceOpenCurve_type = BasicOpenKnotSequenceOpenCurve_type | StrictlyIncreasingOpenKnotSequence | StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity;
export type StrictlyIncreasingOpenKnotSequenceClosedCurve_type = BasicOpenKnotSequenceClosedCurve_type | StrictlyIncreasingOpenKnotSequenceCCurve | StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots | StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots;
export type AbstractIncreasingOpenKnotSequence_type = IncreasingOpenKnotSequenceOpenCurve_type | IncreasingOpenKnotSequenceClosedCurve_type;
export type AbstractStrictlyIncreasingOpenKnotSequence_type = StrictlyIncreasingOpenKnotSequenceOpenCurve_type | StrictlyIncreasingOpenKnotSequenceClosedCurve_type;
export type AbstractOpenKnotSequence_type = AbstractIncreasingOpenKnotSequence_type | AbstractStrictlyIncreasingOpenKnotSequence_type;

export interface PeriodicKnotSequence {
    type: typeof NO_KNOT_PERIODIC_CURVE;
}

export interface Uniform_PeriodicKnotSequence {
    type: typeof UNIFORM_PERIODICKNOTSEQUENCE;
    BsplBasisSize: number;
}

export interface IncreasingPeriodicKnotSequence {
    type: typeof INCREASINGPERIODICKNOTSEQUENCE;
    periodicKnots: number[];
}

export interface StrictIncreasingPeriodicKnotSequence {
    type: typeof STRICTLYINCREASINGPERIODICKNOTSEQUENCE;
    periodicKnots: number[];
    multiplicities: number[];
}

export type BasicPeriodicKnotSequenceClosedCurve_type = PeriodicKnotSequence | Uniform_PeriodicKnotSequence;
export type IncreasingPeriodicKnotSequenceClosedCurve_type = BasicPeriodicKnotSequenceClosedCurve_type | IncreasingPeriodicKnotSequence;
export type StrictIncreasingPeriodicKnotSequenceClosedCurve_type =  BasicPeriodicKnotSequenceClosedCurve_type | StrictIncreasingPeriodicKnotSequence;
export type AbstractPeriodicKnotSequenceClosedCurve_type = IncreasingPeriodicKnotSequenceClosedCurve_type | StrictIncreasingPeriodicKnotSequenceClosedCurve_type;