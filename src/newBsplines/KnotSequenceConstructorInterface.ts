
export const NO_KNOT_OPEN_CURVE = 'No_Knot_OpenCurve';
export const NO_KNOT_CLOSED_CURVE = 'No_Knot_ClosedCurve';
export const UNIFORM_OPENKNOTSEQUENCE = 'Uniform_OpenKnotSequence';
export const UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE = 'UniformlySpreadInterKnots_OpenKnotSequence';
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