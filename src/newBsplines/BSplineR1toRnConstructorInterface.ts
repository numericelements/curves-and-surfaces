import { Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { IncreasingOpenKnotSequence, IncreasingOpenKnotSequenceCCurve, IncreasingOpenKnotSequenceCCurve_allKnots, IncreasingOpenKnotSequenceUpToC0Discontinuity, IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots, IncreasingPeriodicKnotSequence, StrictIncreasingPeriodicKnotSequence, StrictlyIncreasingOpenKnotSequence, StrictlyIncreasingOpenKnotSequenceCCurve, StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots, StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity, StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots } from "./KnotSequenceConstructorInterface";


export const BSPL_CP_NO_KNOT = "OpenBSPL_CP_No_KnotSequence";
export const BSPL_CP_DEG_UNIFORM = "OpenBSPL_CP_Degree_UniformKnotSeq";
export const BSPL_CP_DEG_UNIFORM_EUCLIDEAN = "OpenBSPL_CP_Degree_UniformKnotSeq_EuclideanDist";
export const BSPL_CP_DEG_NONUNIFORM = "OpenBSPL_CP_Degree_NonUniformKnotSeq";
export const BSPL_CP_DEG_NONUNIFORM_EUCLIDEAN = "OpenBSPL_CP_Degree_NonUniformKnotSeq_EuclideanDist";
export const BSPL_CP_INCREASING_KNOTSEQ = "OpenBSPL_CP_IncreasingSequence_AllKnots";
export const BSPL_CP_STRICTLY_INCREASING_KNOTSEQ = "OpenBSPL_CP_StrictlyIncreasingSequence_AllKnots";
export const BSPL_CP_KNOTSEQ_INTERFACE = "OpenBSPL_CP_KnotSequenceInterface";
export const BSPL_CP_KNOTSEQ_INTERFACE_C0DISCONTINUITY = "OpenBSPL_CP_KnotSequenceInterface_C0Discontinuity";
export const CLOSED_BSPL_CP_NO_KNOT = "ClosedBSPL_CP_No_KnotSequence";
export const CLOSED_BSPL_CP_DEG_PERIODIC_UNIFORM = "ClosedBSPL_CP_Degree_PeriodicUniformKnotSeq";
export const CLOSED_BSPL_CP_DEG_PERIODIC_UNIFORM_EUCLIDEAN = "ClosedBSPL_CP_Degree_PeriodicUniformKnotSeq_EuclideanDist";
export const CLOSED_BSPL_CP_DEG_PERIODIC_NONUNIFORM = "ClosedBSPL_CP_Degree_PeriodicNonUniformKnotSeq";
export const CLOSED_BSPL_CP_DEG_PERIODIC_NONUNIFORM_EUCLIDEAN = "ClosedBSPL_CP_Degree_PeriodicNonUniformKnotSeq_EuclideanDist";
export const CLOSED_BSPL_CP_INCREASING_KNOTSEQ = "ClosedBSPL_CP_IncreasingSequence_AllKnots";
export const CLOSED_BSPL_CP_STRICTLY_INCREASING_KNOTSEQ = "ClosedBSPL_CP_StrictlyIncreasingSequence_AllKnots";
export const CLOSED_BSPL_CP_KNOTSEQ_INTERFACE = "ClosedBSPL_CP_KnotSequenceInterface";
export const CLOSED_BSPL_CP_KNOTSEQ_INTERFACE_C0DISCONTINUITY = "ClosedBSPL_CP_KnotSequenceInterface_C0Discontinuity";
export const CLOSED_BSPL_CP_PERIODICKNOTSEQ_INTERFACE = "ClosedBSpline_CP_PeriodicKnotSeq";
export const BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY = "OpenBSPLR1toR1_CP_OpenKnotSeq_allKnots_C0Discontinuity";
export const CLOSED_BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY = "ClosedBSPLR1toR1_CP_OpenKnotSeq_allKnots_C0Discontinuity";


export interface BSpline_CP {
    type: 'OpenBSPL_CP_No_KnotSequence';
    controlPoints: ControlPoints[];
}

export interface BSpline_CP_Deg_Uniform {
    type: 'OpenBSPL_CP_Degree_UniformKnotSeq';
    controlPoints: ControlPoints[];
    degree: number;
}

export interface BSpline_CP_Deg_Uniform_EuclideanDist {
    type: 'OpenBSPL_CP_Degree_UniformKnotSeq_EuclideanDist';
    controlPoints: ControlPoints[];
    degree: number;
}

export interface BSpline_CP_Deg_NonUniform {
    type: 'OpenBSPL_CP_Degree_NonUniformKnotSeq';
    controlPoints: ControlPoints[];
    degree: number;
}

export interface BSpline_CP_Deg_NonUniform_EuclideanDist {
    type: 'OpenBSPL_CP_Degree_NonUniformKnotSeq_EuclideanDist';
    controlPoints: ControlPoints[];
    degree: number;
}

export interface BSpline_CP_IncreasingKnotSeq_AllKnots {
    type: 'OpenBSPL_CP_IncreasingSequence_AllKnots';
    controlPoints: ControlPoints[];
    knots: number[];
}

export interface BSpline_CP_StrctIncreasingKnotSeq_AllKnots {
    type: 'OpenBSPL_CP_StrictIncreasingSequence_AllKnots';
    controlPoints: ControlPoints[];
    knots: number[];
}

export interface BSpline_CP_KnotSeqInterface {
    type: 'OpenBSPL_CP_KnotSequenceInterface';
    controlPoints: ControlPoints[];
    knotSequence: OpenKnotSequenceInterface_type;
}

export interface BSpline_CP_KnotSequenceInterface_C0Discontinuity {
    type: 'OpenBSPL_CP_KnotSequenceInterface_C0Discontinuity';
    controlPoints: ControlPoints[];
    knotSequence: OpenKnotSequenceUpToC0DiscontinuityInterface_type;
}

export interface ClosedBSpline_CP {
    type: 'ClosedBSPL_CP_No_KnotSequence';
    controlPoints: ControlPoints[];
}

export interface ClosedBSpline_CP_Deg_PeriodicUniformKnotSeq {
    type: 'ClosedBSPL_CP_Degree_PeriodicUniformKnotSeq';
    controlPoints: ControlPoints[];
    degree: number;
}

export interface ClosedBSpline_CP_Deg_PeriodicUniformKnotSeq_EuclideanDist {
    type: 'ClosedBSPL_CP_Degree_PeriodicUniformKnotSeq_EuclideanDist';
    controlPoints: ControlPoints[];
    degree: number;
}

export interface ClosedBSpline_CP_OpenKnotSeq {
    type: 'ClosedBSPL_CP_OpenKotSeq';
    periodicControlPoints: ControlPoints[];
    knotSequence: OpenKnotSequenceCCurveInterface_type;
}

export interface ClosedBSpline_CP_OpenKnotSeq_allKnots {
    type: 'ClosedBSPL_CP_OpenKnotSeq_allKnots';
    controlPoints: ControlPoints[];
    knotSequence: OpenKnotSequenceCCurveInterfaceAllCPK_type;
}

export interface ClosedBSpline_CP_OpenKnotSeq_allKnots_C0Discontinuity {
    type: 'ClosedBSpline_CP_OpenKnotSeq_allKnots_C0Discontinuity';
    controlPoints: ControlPoints[];
    knotSequence: OpenKnotSequenceUpToC0DiscontinuityCCurveInterfaceAllCPK_type;
}

export interface ClosedBSpline_CP_PeriodicKnotSeq {
    type: 'ClosedBSpline_CP_PeriodicKnotSeq';
    periodicControlPoints: ControlPoints[];
    knotSequence: PeriodicKnotSequenceCCurveInterface_type;
}

export interface OpenBSPLR1toR1_CP_OpenKnotSeq_C0Discontinuity {
    type: 'OpenBSPLR1toR1_CP_OpenKnotSeq_allKnots_C0Discontinuity';
    controlPoints: number[];
    knotSequence: OpenKnotSequenceUpToC0DiscontinuityInterface_type;
}

export interface ClosedBSPLR1toR1_CP_OpenKnotSeq_allKnots_C0Discontinuity {
    type: 'ClosedBSPLR1toR1_CP_OpenKnotSeq_allKnots_C0Discontinuity';
    controlPoints: number[];
    knotSequence: OpenKnotSequenceUpToC0DiscontinuityCCurveInterfaceAllCPK_type;
}

export type ControlPoints = Vector;
export type OpenKnotSequenceInterface_type = IncreasingOpenKnotSequence | StrictlyIncreasingOpenKnotSequence;
export type OpenKnotSequenceUpToC0DiscontinuityInterface_type = IncreasingOpenKnotSequenceUpToC0Discontinuity | StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity;
export type OpenKnotSequenceCCurveInterface_type = IncreasingOpenKnotSequenceCCurve | StrictlyIncreasingOpenKnotSequenceCCurve;
export type OpenKnotSequenceCCurveInterfaceAllCPK_type = IncreasingOpenKnotSequenceCCurve_allKnots | StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots;
export type OpenKnotSequenceUpToC0DiscontinuityCCurveInterfaceAllCPK_type = IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots | StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots;
export type PeriodicKnotSequenceCCurveInterface_type = IncreasingPeriodicKnotSequence | StrictIncreasingPeriodicKnotSequence;

export type OpenBSpline_type = BSpline_CP | BSpline_CP_Deg_Uniform | BSpline_CP_Deg_Uniform_EuclideanDist | BSpline_CP_Deg_NonUniform | BSpline_CP_Deg_NonUniform_EuclideanDist | BSpline_CP_IncreasingKnotSeq_AllKnots | BSpline_CP_StrctIncreasingKnotSeq_AllKnots | BSpline_CP_KnotSeqInterface | BSpline_CP_KnotSequenceInterface_C0Discontinuity
export type PeriodicBSplineOPenSeq_type = ClosedBSpline_CP_OpenKnotSeq | ClosedBSpline_CP_OpenKnotSeq_allKnots | ClosedBSpline_CP_OpenKnotSeq_allKnots_C0Discontinuity;
export type PeriodicBSpline_type = ClosedBSpline_CP | ClosedBSpline_CP_Deg_PeriodicUniformKnotSeq | ClosedBSpline_CP_Deg_PeriodicUniformKnotSeq_EuclideanDist | ClosedBSpline_CP_PeriodicKnotSeq;
export type BSpline_type = OpenBSpline_type | PeriodicBSplineOPenSeq_type | PeriodicBSpline_type;

export type BSplineR1toR1_type = OpenBSPLR1toR1_CP_OpenKnotSeq_C0Discontinuity | ClosedBSPLR1toR1_CP_OpenKnotSeq_allKnots_C0Discontinuity;