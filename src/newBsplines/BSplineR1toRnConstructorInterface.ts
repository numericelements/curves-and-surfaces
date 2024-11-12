import { Vector2d } from "../mathVector/Vector2d";
import { Vector3d } from "../mathVector/Vector3d";
import { IncreasingOpenKnotSequence, IncreasingOpenKnotSequenceCCurve, IncreasingOpenKnotSequenceCCurve_allKnots, IncreasingOpenKnotSequenceUpToC0Discontinuity, IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots, IncreasingPeriodicKnotSequence, StrictIncreasingPeriodicKnotSequence, StrictlyIncreasingOpenKnotSequence, StrictlyIncreasingOpenKnotSequenceCCurve, StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots, StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity, StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots } from "./KnotSequenceConstructorInterface";


export interface BSpline_CParray {
    type: 'OpenBSPL_CParray_No_KnotSequence';
    controlPoints: ControlPoints[];
}

export interface BSpline_CParrayDeg_Uniform {
    type: 'OpenBSPL_CParray_Degree_UniformKnotSeq';
    controlPoints: ControlPoints[];
    degree: number;
}

export interface BSpline_CParrayDeg_Uniform_EuclideanDist {
    type: 'OpenBSPL_CParray_Degree_UniformKnotSeq_EuclideanDist';
    controlPoints: ControlPoints[];
    degree: number;
}

export interface BSpline_CParrayDeg_NonUniform {
    type: 'OpenBSPL_CParray_Degree_NonUniformKnotSeq';
    controlPoints: ControlPoints[];
    degree: number;
}

export interface BSpline_CParrayDeg_NonUniform_EuclideanDist {
    type: 'OpenBSPL_CParray_Degree_NonUniformKnotSeq_EuclideanDist';
    controlPoints: ControlPoints[];
    degree: number;
}

export interface BSpline_CParray_KarrayIncreasing {
    type: 'OpenBSPL_CParray_knotArray_increasingSequence';
    controlPoints: ControlPoints[];
    knots: number[];
}

export interface BSpline_CParray_KarrayStrctIncreasing {
    type: 'OpenBSPL_CParray_knotArray_StrictIncreasingSequence';
    controlPoints: ControlPoints[];
    knots: number[];
}

export interface BSpline_CParrayKnotSeq {
    type: 'OpenBSPL_IncreasingSequence_CParray';
    controlPoints: ControlPoints[];
    knotSequence: OpenKnotSequenceInterface_type;
}

export interface BSpline_CParrayKnotSeq_Derivative {
    type: 'OpenBSPL_IncreasingSequence_CParray_Derivative';
    controlPoints: ControlPoints[];
    knotSequence: OpenKnotSequenceUpToC0DiscontinuityInterface_type;
}

export interface PeriodicBSpline_CParrayOpenKnotSeq {
    type: 'PeriodicBSPL_IncreasingSequence_CParray_OpenKSeq';
    periodicControlPoints: ControlPoints[];
    knotSequence: OpenKnotSequenceCCurveInterface_type;
}

export interface PeriodicBSpline_CParrayOpenKnotSeq_allCPK {
    type: 'PeriodicBSPL_IncreasingSequence_CParray_OpenKSeq_allCPK';
    controlPoints: ControlPoints[];
    knotSequence: OpenKnotSequenceCCurveInterfaceAllCPK_type;
}

export interface PeriodicBSpline_CParrayOpenKnotSeq_Derivative {
    type: 'PeriodicBSPL_IncreasingSequence_CParray_OpenKSeq_allCPK_Derivative';
    controlPoints: ControlPoints[];
    knotSequence: OpenKnotSequenceUpToC0DiscontinuityCCurveInterfaceAllCPK_type;
}

export interface PeriodicBSpline_CParray {
    type: 'PeriodicBSPL_CParray_No_KnotSequence';
    controlPoints: ControlPoints[];
}

export interface PeriodicBSpline_CParrayDeg_Uniform {
    type: 'PeriodicBSPL_CParray_Degree_PeriodicUniformKnotSeq';
    controlPoints: ControlPoints[];
    degree: number;
}

export interface PeriodicBSpline_CParrayPeriodicKnotSeq {
    type: 'PeriodicBSPL_IncreasingSequence_CParray_PeriodicKSeq';
    periodicControlPoints: ControlPoints[];
    knotSequence: PeriodicKnotSequenceCCurveInterface_type;
}


export interface BSplineR1toR1_CParrayIncS {
    type: 'OpenBSPL_IncreasingSequence_CParray';
    controlPoints: number[];
    knotSequence: OpenKnotSequenceUpToC0DiscontinuityInterface_type;
}

export interface PeriodicBSplineR1toR1_CParrayIncS {
    type: 'PeriodicBSPL_IncreasingSequence_CParray_OpenKSeq';
    controlPoints: number[];
    knotSequence: OpenKnotSequenceUpToC0DiscontinuityCCurveInterfaceAllCPK_type;
}

export type ControlPoints = Vector2d | Vector3d;
export type OpenKnotSequenceInterface_type = IncreasingOpenKnotSequence | StrictlyIncreasingOpenKnotSequence;
export type OpenKnotSequenceUpToC0DiscontinuityInterface_type = IncreasingOpenKnotSequenceUpToC0Discontinuity | StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity;
export type OpenKnotSequenceCCurveInterface_type = IncreasingOpenKnotSequenceCCurve | StrictlyIncreasingOpenKnotSequenceCCurve;
export type OpenKnotSequenceCCurveInterfaceAllCPK_type = IncreasingOpenKnotSequenceCCurve_allKnots | StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots;
export type OpenKnotSequenceUpToC0DiscontinuityCCurveInterfaceAllCPK_type = IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots | StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots;
export type PeriodicKnotSequenceCCurveInterface_type = IncreasingPeriodicKnotSequence | StrictIncreasingPeriodicKnotSequence;

export type OpenBSpline_type = BSpline_CParray | BSpline_CParrayDeg_Uniform | BSpline_CParrayDeg_Uniform_EuclideanDist | BSpline_CParrayDeg_NonUniform | BSpline_CParrayDeg_NonUniform_EuclideanDist | BSpline_CParray_KarrayIncreasing | BSpline_CParray_KarrayStrctIncreasing | BSpline_CParrayKnotSeq | BSpline_CParrayKnotSeq_Derivative
export type PeriodicBSplineOPenSeq_type = PeriodicBSpline_CParrayOpenKnotSeq | PeriodicBSpline_CParrayOpenKnotSeq_allCPK | PeriodicBSpline_CParrayOpenKnotSeq_Derivative;
export type PeriodicBSpline_type = PeriodicBSpline_CParray | PeriodicBSpline_CParrayDeg_Uniform | PeriodicBSpline_CParrayPeriodicKnotSeq;
export type BSpline_type = OpenBSpline_type | PeriodicBSplineOPenSeq_type | PeriodicBSpline_type;

export type BSplineR1toR1_type = BSplineR1toR1_CParrayIncS | PeriodicBSplineR1toR1_CParrayIncS;