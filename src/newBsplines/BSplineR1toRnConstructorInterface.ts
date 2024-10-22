import { Vector2d } from "../mathVector/Vector2d";
import { Vector3d } from "../mathVector/Vector3d";
import { IncreasingOpenKnotSequenceInterface } from "./IncreasingOpenKnotSequenceInterface";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";
import { StrictlyIncreasingOpenKnotSequenceInterface } from "./StrictlyIncreasingKnotSequenceInterface";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";


export interface BSplinenD_CParray {
    type: 'CParray_No_KnotSequence';
    controlPoints: ControlPoints[];
    spaceDimension: number;
}

export interface BSplinenD_CParrayDeg_Uniform {
    type: 'CParray_Degree_UniformKnotSeq';
    controlPoints: ControlPoints[];
    spaceDimension: number;
    degree: number;
}

export interface BSplinenD_CParrayDeg_NonUniform {
    type: 'CParray_Degree_NonUniformKnotSeq';
    controlPoints: ControlPoints[];
    spaceDimension: number;
    degree: number;
}

export interface BSplinenD_KCParray {
    type: 'knotArray_increasingSequence_CParray';
    controlPoints: ControlPoints[];
    spaceDimension: number;
    knots: number[];
}

export interface BSplinenD_CParrayIncS {
    type: 'increasingSequence_CParray';
    controlPoints: ControlPoints[];
    spaceDimension: number;
    increasingKnotSequence: IncreasingOpenKnotSequenceInterface;
}

export interface BSplinenD_CParrayStIncS {
    type: 'strIncreasingSequence_CParray';
    controlPoints: ControlPoints[];
    spaceDimension: number;
    increasingKnotSequence: StrictlyIncreasingOpenKnotSequenceInterface;
}

export type ControlPoints = Vector2d | Vector3d;

export type BSplinenD_type = BSplinenD_CParray | BSplinenD_CParrayDeg_Uniform | BSplinenD_CParrayDeg_NonUniform | BSplinenD_KCParray | BSplinenD_CParrayIncS | BSplinenD_CParrayStIncS;

export interface BSpline3D_CParray {
    type: 'CParray';
    controlPoints: Vector3d[];
}

export interface BSpline3D_CParrayDeg {
    type: 'CParray_Degree';
    controlPoints: Vector3d[];
    degree: number;
}

export interface BSpline3D_KCParray {
    type: 'knotArray_increasingSequence_CParray';
    controlPoints: Vector3d[];
    knots: number[];
}

export interface BSpline3D_CParrayIncS {
    type: 'increasingSequence_CParray';
    controlPoints: Vector3d[];
    increasingKnotSequence: IncreasingOpenKnotSequenceOpenCurve;
}

export interface BSpline3D_CParrayStIncS {
    type: 'strIncreasingSequence_CParray';
    controlPoints: Vector3d[];
    increasingKnotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;
}

export type BSpline3D_type = BSpline3D_CParray | BSpline3D_KCParray | BSpline3D_CParrayIncS | BSpline3D_CParrayStIncS | BSpline3D_CParrayDeg;

export type BSpline_type = BSplinenD_type | BSpline3D_type;