import { IVector } from "../mathVector/Vector";
import { VectorDescriptorCollection1D } from "../mathVector/VectorDescriptorCollection1D";
import { ComplexVector, ProjectiveComplexVector, ProjectiveVector, RealVector, Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPolygon } from "./ControlPolygon";
import { ControlPolygonFromDescriptors } from "./ControlPolygonFromDescriptors";
import { IncreasingOpenKnotSequence, IncreasingOpenKnotSequenceCCurve, IncreasingOpenKnotSequenceCCurve_allKnots, IncreasingOpenKnotSequenceUpToC0Discontinuity, IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots, IncreasingPeriodicKnotSequence, StrictIncreasingPeriodicKnotSequence, StrictlyIncreasingOpenKnotSequence, StrictlyIncreasingOpenKnotSequenceCCurve, StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots, StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity, StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots } from "./KnotSequenceConstructorInterface";
import { KnotSequenceInterface } from "./KnotSequenceInterface";


export const BSPL_CP_NO_KNOT = "OpenBSPL_CP_No_KnotSequence" as const;
export const BSPL_CP_DEG_UNIFORM = "OpenBSPL_CP_Degree_UniformKnotSeq" as const;
export const BSPL_CP_DEG_UNIFORM_EUCLIDEAN = "OpenBSPL_CP_Degree_UniformKnotSeq_EuclideanDist" as const;
export const BSPL_CP_DEG_NONUNIFORM = "OpenBSPL_CP_Degree_NonUniformKnotSeq" as const;
export const BSPL_CP_DEG_NONUNIFORM_EUCLIDEAN = "OpenBSPL_CP_Degree_NonUniformKnotSeq_EuclideanDist" as const;
export const BSPL_CP_INCREASING_KNOTSEQ = "OpenBSPL_CP_IncreasingSequence_AllKnots" as const;
export const BSPL_CP_STRICTLY_INCREASING_KNOTSEQ = "OpenBSPL_CP_StrictlyIncreasingSequence_AllKnots" as const;
export const BSPL_CP_KNOTSEQ_INTERFACE = "OpenBSPL_CP_KnotSequenceInterface" as const;
export const BSPL_CP_KNOTSEQ_INTERFACE_C0DISCONTINUITY = "OpenBSPL_CP_KnotSequenceInterface_C0Discontinuity" as const;
export const CLOSED_BSPL_CP_NO_KNOT = "ClosedBSPL_CP_No_KnotSequence" as const;
export const CLOSED_BSPL_CP_DEG_PERIODIC_UNIFORM = "ClosedBSPL_CP_Degree_PeriodicUniformKnotSeq" as const;
export const CLOSED_BSPL_CP_DEG_PERIODIC_UNIFORM_EUCLIDEAN = "ClosedBSPL_CP_Degree_PeriodicUniformKnotSeq_EuclideanDist" as const;
export const CLOSED_BSPL_CP_OPENKNOTSEQ = "ClosedBSPL_CP_OpenKotSeq" as const;
export const CLOSED_BSPL_CP_OPENKNOTSEQ_ALLKNOTS = "ClosedBSPL_CP_OpenKnotSeq_allKnots" as const;
export const CLOSED_BSPL_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY = "ClosedBSpline_CP_OpenKnotSeq_allKnots_C0Discontinuity" as const;

// to be re-analyzed after setting up the input parameters factory and the algorithm registry
// export const CLOSED_BSPL_CP_DEG_PERIODIC_NONUNIFORM = "ClosedBSPL_CP_Degree_PeriodicNonUniformKnotSeq" as const;
// export const CLOSED_BSPL_CP_DEG_PERIODIC_NONUNIFORM_EUCLIDEAN = "ClosedBSPL_CP_Degree_PeriodicNonUniformKnotSeq_EuclideanDist" as const;
// export const CLOSED_BSPL_CP_INCREASING_KNOTSEQ = "ClosedBSPL_CP_IncreasingSequence_AllKnots" as const;
// export const CLOSED_BSPL_CP_STRICTLY_INCREASING_KNOTSEQ = "ClosedBSPL_CP_StrictlyIncreasingSequence_AllKnots" as const;
// export const CLOSED_BSPL_CP_KNOTSEQ_INTERFACE = "ClosedBSPL_CP_KnotSequenceInterface" as const;
// export const CLOSED_BSPL_CP_KNOTSEQ_INTERFACE_C0DISCONTINUITY = "ClosedBSPL_CP_KnotSequenceInterface_C0Discontinuity" as const;
export const CLOSED_BSPL_CP_PERIODICKNOTSEQ_INTERFACE = "ClosedBSpline_CP_PeriodicKnotSeq" as const;
export const BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY = "OpenBSPLR1toR1_CP_OpenKnotSeq_allKnots_C0Discontinuity" as const;
export const CLOSED_BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY = "ClosedBSPLR1toR1_CP_OpenKnotSeq_allKnots_C0Discontinuity" as const;

export const BSPL_PH_QUINTIC_LINE_CIRCLE = "OpenBSpline_PH_quintic_line_circle" as const;


export interface BSpline_CP {
    readonly type: typeof BSPL_CP_NO_KNOT;
    readonly controlPoints: ControlPoints;
}

export interface BSpline_CP_Deg_Uniform {
    readonly type: typeof BSPL_CP_DEG_UNIFORM;
    readonly controlPoints: ControlPoints;
    readonly degree: number;
}

export interface BSpline_CP_Deg_Uniform_EuclideanDist {
    readonly type: typeof BSPL_CP_DEG_UNIFORM_EUCLIDEAN;
    readonly controlPoints: ControlPoints;
    readonly degree: number;
}

export interface BSpline_CP_Deg_NonUniform {
    readonly type: typeof BSPL_CP_DEG_NONUNIFORM;
    readonly controlPoints: ControlPoints;
    readonly degree: number;
}

export interface BSpline_CP_Deg_NonUniform_EuclideanDist {
    readonly type: typeof BSPL_CP_DEG_NONUNIFORM_EUCLIDEAN;
    readonly controlPoints: ControlPoints;
    readonly degree: number;
}

export interface BSpline_CP_IncreasingKnotSeq_AllKnots {
    readonly type: typeof BSPL_CP_INCREASING_KNOTSEQ;
    readonly controlPoints: ControlPoints;
    readonly knots: readonly number[];
}

export interface BSpline_CP_StrctIncreasingKnotSeq_AllKnots {
    readonly type: typeof BSPL_CP_STRICTLY_INCREASING_KNOTSEQ;
    readonly controlPoints: ControlPoints;
    readonly knots: readonly number[];
}

export interface BSpline_CP_KnotSeqInterface {
    readonly type: typeof BSPL_CP_KNOTSEQ_INTERFACE;
    readonly controlPoints: ControlPoints;
    readonly knotSequence: OpenKnotSequenceInterface_type;
}

export interface BSpline_CP_KnotSequenceInterface_C0Discontinuity {
    readonly type: typeof BSPL_CP_KNOTSEQ_INTERFACE_C0DISCONTINUITY;
    readonly controlPoints: ControlPoints;
    readonly knotSequence: OpenKnotSequenceUpToC0DiscontinuityInterface_type;
}

export interface ClosedBSpline_CP {
    readonly type: typeof CLOSED_BSPL_CP_NO_KNOT;
    readonly controlPoints: ControlPoints;
}

export interface ClosedBSpline_CP_Deg_PeriodicUniformKnotSeq {
    readonly type: typeof CLOSED_BSPL_CP_DEG_PERIODIC_UNIFORM;
    readonly controlPoints: ControlPoints;
    readonly degree: number;
}

export interface ClosedBSpline_CP_Deg_PeriodicUniformKnotSeq_EuclideanDist {
    readonly type: typeof CLOSED_BSPL_CP_DEG_PERIODIC_UNIFORM_EUCLIDEAN;
    readonly controlPoints: ControlPoints;
    readonly degree: number;
}

export interface ClosedBSpline_CP_OpenKnotSeq {
    readonly type: typeof CLOSED_BSPL_CP_OPENKNOTSEQ;
    readonly periodicControlPoints: ControlPoints;
    readonly knotSequence: OpenKnotSequenceCCurveInterface_type;
}

export interface ClosedBSpline_CP_OpenKnotSeq_allKnots {
    readonly type: typeof CLOSED_BSPL_CP_OPENKNOTSEQ_ALLKNOTS;
    readonly controlPoints: ControlPoints;
    readonly knotSequence: OpenKnotSequenceCCurveInterfaceAllCPK_type;
}

export interface ClosedBSpline_CP_OpenKnotSeq_allKnots_C0Discontinuity {
    readonly type: typeof CLOSED_BSPL_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY;
    readonly controlPoints: ControlPoints;
    readonly knotSequence: OpenKnotSequenceUpToC0DiscontinuityCCurveInterfaceAllCPK_type;
}

export interface ClosedBSpline_CP_PeriodicKnotSeq {
    readonly type: typeof CLOSED_BSPL_CP_PERIODICKNOTSEQ_INTERFACE;
    readonly periodicControlPoints: ControlPoints;
    readonly knotSequence: PeriodicKnotSequenceCCurveInterface_type;
}

export interface OpenBSPLR1toR1_CP_OpenKnotSeq_C0Discontinuity {
    readonly type: typeof BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY;
    readonly controlPoints: readonly number[];
    readonly knotSequence: OpenKnotSequenceUpToC0DiscontinuityInterface_type;
}

export interface ClosedBSPLR1toR1_CP_OpenKnotSeq_allKnots_C0Discontinuity {
    readonly type: typeof CLOSED_BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY;
    readonly controlPoints: readonly number[];
    readonly knotSequence: OpenKnotSequenceUpToC0DiscontinuityCCurveInterfaceAllCPK_type;
}

export interface OpenBSpline_PH_quintic_line_circle {
    readonly type: typeof BSPL_PH_QUINTIC_LINE_CIRCLE;
    readonly refPoint: ControlPoint;
    readonly lineDir: Vector;
    readonly circle: Vector;
    readonly circleRadius: number;
}

// export type ControlPoint = Vector;
// export type ControlPoints = ControlPolygonFromDescriptors | ControlPoint[];
export type OpenKnotSequenceInterface_type = IncreasingOpenKnotSequence | StrictlyIncreasingOpenKnotSequence;
export type OpenKnotSequenceUpToC0DiscontinuityInterface_type = IncreasingOpenKnotSequenceUpToC0Discontinuity | StrictlyIncreasingOpenKnotSequenceUpToC0Discontinuity;
export type OpenKnotSequenceCCurveInterface_type = IncreasingOpenKnotSequenceCCurve | StrictlyIncreasingOpenKnotSequenceCCurve;
export type OpenKnotSequenceCCurveInterfaceAllCPK_type = IncreasingOpenKnotSequenceCCurve_allKnots | StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots;
export type OpenKnotSequenceUpToC0DiscontinuityCCurveInterfaceAllCPK_type = IncreasingOpenKnotSequenceUpToC0DiscontinuityCCurve_allKnots | StrictlyIncreasingOpenKnotSequenceUpToC0DiscontinuityCCurvee_allKnots;
export type PeriodicKnotSequenceCCurveInterface_type = IncreasingPeriodicKnotSequence | StrictIncreasingPeriodicKnotSequence;

export type OpenBSpline_type = BSpline_CP | BSpline_CP_Deg_Uniform | BSpline_CP_Deg_Uniform_EuclideanDist | BSpline_CP_Deg_NonUniform | BSpline_CP_Deg_NonUniform_EuclideanDist | BSpline_CP_IncreasingKnotSeq_AllKnots | BSpline_CP_StrctIncreasingKnotSeq_AllKnots | BSpline_CP_KnotSeqInterface | BSpline_CP_KnotSequenceInterface_C0Discontinuity
export type PeriodicBSplineOpenSeq_type = ClosedBSpline_CP_OpenKnotSeq | ClosedBSpline_CP_OpenKnotSeq_allKnots | ClosedBSpline_CP_OpenKnotSeq_allKnots_C0Discontinuity;
export type ClosedBSpline_type = ClosedBSpline_CP | ClosedBSpline_CP_Deg_PeriodicUniformKnotSeq | ClosedBSpline_CP_Deg_PeriodicUniformKnotSeq_EuclideanDist | ClosedBSpline_CP_PeriodicKnotSeq;
export type BSpline_type = OpenBSpline_type | PeriodicBSplineOpenSeq_type | ClosedBSpline_type;

export type BSplineR1toR1_type = OpenBSPLR1toR1_CP_OpenKnotSeq_C0Discontinuity | ClosedBSPLR1toR1_CP_OpenKnotSeq_allKnots_C0Discontinuity;


export type ControlPointDescriptor<V extends Vector = Vector> = V;
export type ControlPointObject<V extends Vector = Vector, D extends number = number> = IVector<D, V>;

export type ControlPoint<V extends Vector = Vector, D extends number = number> =
    ControlPointDescriptor<V> | ControlPointObject<V, D>;

export type ControlPoints<IV extends IVector<any, Vector> = IVector<any, Vector>> =
    ControlPolygonFromDescriptors | ControlPolygon<IV>;



export interface BSplineFromVectorDescriptorParams<V extends Vector, D extends number> {
    readonly controlPointDescriptors: ControlPolygonFromDescriptors<V, D>;
    readonly knotSequence: KnotSequenceInterface;
    readonly degree: number;
}


export interface BSplineFromVectorParams<IV extends IVector<any, Vector>> {
    readonly controlPolygon: ControlPolygon<IV>;
    readonly knotSequence: KnotSequenceInterface;
    readonly degree: number;
    readonly useCase?: "general" | "performance" | "precision" | "subdivision";
}

export interface BSplineR1toR1Params {
    readonly controlPoints: number[];
    readonly knotSequence: KnotSequenceInterface;
    readonly degree: number;
}