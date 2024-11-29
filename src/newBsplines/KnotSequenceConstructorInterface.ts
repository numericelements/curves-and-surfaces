
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
    type: 'No_Knot_OpenCurve';
}

export interface OpenKnotSequenceClosedCurve {
    type: 'No_Knot_ClosedCurve';
}

export interface Uniform_OpenKnotSequence {
    type: 'Uniform_OpenKnotSequence';
    BsplBasisSize: number;
}

export interface UniformlySpreadInterKnots_OpenKnotSequence {
    type: 'UniformlySpreadInterKnots_OpenKnotSequence';
    BsplBasisSize: number;
}

export interface IncreasingOpenKnotSequence {
    type: 'IncreasingOpenKnotSequence';
    knots: number[];
}

export interface IncreasingOpenKnotSequenceUpToC0Discontinuity {
    type: 'IncreasingOpenKnotSequenceUpToC0Discontinuity';
    knots: number[];
}

export interface IncreasingOpenKnotSequenceCCurve {
    type: 'IncreasingOpenKnotSequenceClosedCurve';
    periodicKnots: number[];
}

export interface IncreasingOpenKnotSequenceCCurve_allKnots {
    type: 'IncreasingOpenKnotSequenceClosedCurve_allKnots';
    knots: number[];
}

export interface IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots {
    type: 'IncreasingOpenKnotSequenceUpToC0DiscontinuityClosedCurve_allKnots';
    knots: number[];
}

export interface StrictlyIncreasingOpenKnotSequence {
    type: 'StrictlyIncreasingOpenKnotSequence';
    knots: number[];
    multiplicities: number[];
}

export interface StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity {
    type: 'StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity';
    knots: number[];
    multiplicities: number[];
}

export interface StrictlyIncreasingOpenKnotSequenceCCurve {
    type: 'StrictlyIncreasingOpenKnotSequenceClosedCurve';
    periodicKnots: number[];
    multiplicities: number[];
}

export interface StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots {
    type: 'StrictlyIncreasingOpenKnotSequenceClosedCurve_allKnots';
    knots: number[];
    multiplicities: number[];
}

export interface StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots {
    type: 'StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityClosedCurve_allKnots';
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
    type: 'No_Knot_PeriodicCurve';
}

export interface Uniform_PeriodicKnotSequence {
    type: 'Uniform_PeriodicKnotSequence';
    BsplBasisSize: number;
}

export interface IncreasingPeriodicKnotSequence {
    type: 'IncreasingPeriodicKnotSequence';
    periodicKnots: number[];
}

export interface StrictIncreasingPeriodicKnotSequence {
    type: 'StrictIncreasingPeriodicKnotSequence';
    periodicKnots: number[];
    multiplicities: number[];
}

export type BasicPeriodicKnotSequenceClosedCurve_type = PeriodicKnotSequence | Uniform_PeriodicKnotSequence;
export type IncreasingPeriodicKnotSequenceClosedCurve_type = BasicPeriodicKnotSequenceClosedCurve_type | IncreasingPeriodicKnotSequence;
export type StrictIncreasingPeriodicKnotSequenceClosedCurve_type =  BasicPeriodicKnotSequenceClosedCurve_type | StrictIncreasingPeriodicKnotSequence;
export type AbstractPeriodicKnotSequenceClosedCurve_type = IncreasingPeriodicKnotSequenceClosedCurve_type | StrictIncreasingPeriodicKnotSequenceClosedCurve_type;