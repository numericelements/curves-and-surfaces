
export const NO_KNOT_OPEN_CURVE = 'No_Knot_OpenCurve';
export const NO_KNOT_CLOSED_CURVE = 'No_Knot_ClosedCurve';
export const UNIFORM_OPENKNOTSEQUENCE = 'Uniform_OpenKnotSequence';
export const UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE = 'UniformlySpreadInterKnots_OpenKnotSequence';
export const INCREASINGOPENKNOTSEQUENCE = 'IncreasingOpenKnotSequence';
export const INCREASINGOPENKNOTSUBSEQUENCE = 'IncreasingOpenKnotSubSequence';
export const INCREASINGOPENKNOTSEQUENCECLOSEDCURVE = 'IncreasingOpenKnotSequenceClosedCurve';
export const INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS = 'IncreasingOpenKnotSequenceClosedCurve_allKnots';
export const INCREASINGOPENKNOTSUBSEQUENCECLOSEDCURVE = 'IncreasingOpenKnotSubSequenceClosedCurve';
export const STRICTLYINCREASINGOPENKNOTSEQUENCE = 'StrictlyIncreasingOpenKnotSequence';
export const STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE = 'StrictlyIncreasingOpenKnotSequenceClosedCurve';
export const STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS = 'StrictlyIncreasingOpenKnotSequenceClosedCurve_allKnots';

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

export interface IncreasingOpenKnotSubSequence {
    type: 'IncreasingOpenKnotSubSequence';
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

export interface IncreasingOpenKnotSubSequenceCCurve {
    type: 'IncreasingOpenKnotSubSequenceClosedCurve';
    knots: number[];
}

export interface StrictlyIncreasingOpenKnotSequence {
    type: 'StrictlyIncreasingOpenKnotSequence';
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

export type IncreasingOpenKnotSequenceOpenCurve_type = OpenKnotSequenceOpenCurve | Uniform_OpenKnotSequence | UniformlySpreadInterKnots_OpenKnotSequence | IncreasingOpenKnotSequence | IncreasingOpenKnotSubSequence;
export type IncreasingOpenKnotSequenceClosedCurve_type = OpenKnotSequenceClosedCurve | Uniform_OpenKnotSequence | IncreasingOpenKnotSequenceCCurve | IncreasingOpenKnotSubSequenceCCurve | IncreasingOpenKnotSequenceCCurve_allKnots;
export type StrictlyIncreasingOpenKnotSequenceOpenCurve_type = OpenKnotSequenceOpenCurve | Uniform_OpenKnotSequence | UniformlySpreadInterKnots_OpenKnotSequence | StrictlyIncreasingOpenKnotSequence;
export type StrictlyIncreasingOpenKnotSequenceClosedCurve_type = OpenKnotSequenceClosedCurve | Uniform_OpenKnotSequence | StrictlyIncreasingOpenKnotSequenceCCurve | StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots;
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
    knots: number[];
}

export interface StrictIncreasingPeriodicKnotSequence {
    type: 'StrictIncreasingPeriodicKnotSequence';
    knots: number[];
}

export type IncreasingPeriodicKnotSequenceClosedCurve_type = PeriodicKnotSequence | Uniform_PeriodicKnotSequence | IncreasingPeriodicKnotSequence;
export type StrictIncreasingPeriodicKnotSequenceClosedCurve_type =  PeriodicKnotSequence | Uniform_PeriodicKnotSequence | StrictIncreasingPeriodicKnotSequence;