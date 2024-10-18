import { Vector2d } from "../mathVector/Vector2d";
import { Vector3d } from "../mathVector/Vector3d";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";


export interface BSpline2D_CParray {
    type: 'CParray_No_KnotSequence';
    controlPoints: Vector2d[];
}

export interface BSpline2D_CParrayDeg {
    type: 'CParray_Degree';
    controlPoints: Vector2d[];
    degree: number;
}

export interface BSpline2D_KCParray {
    type: 'knotArray_increasingSequence_CParray';
    controlPoints: Vector2d[];
    knots: number[];
}

export interface BSpline2D_CParrayIncS {
    type: 'increasingSequence_CParray';
    controlPoints: Vector2d[];
    increasingKnotSequence: IncreasingOpenKnotSequenceOpenCurve;
}

export interface BSpline2D_CParrayStIncS {
    type: 'strIncreasingSequence_CParray';
    controlPoints: Vector2d[];
    increasingKnotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;
}

export type BSpline2D_type = BSpline2D_CParray | BSpline2D_KCParray | BSpline2D_CParrayIncS | BSpline2D_CParrayStIncS | BSpline2D_CParrayDeg;

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

export type CST_BSpline = BSpline2D_type | BSpline3D_type;