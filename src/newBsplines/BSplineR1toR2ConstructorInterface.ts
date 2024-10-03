import { Vector2d } from "../mathVector/Vector2d";
import { Vector3d } from "../mathVector/Vector3d";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";


export interface CST_BSpline2D_CParray {
    type: 'CParray';
    controlPoints: Vector2d[];
}

export interface CST_BSpline2D_CParrayDeg {
    type: 'CParray_Degree';
    controlPoints: Vector2d[];
    degree: number;
}

export interface CST_BSpline2D_KCParray {
    type: 'knotArray_increasingSequence_CParray';
    controlPoints: Vector2d[];
    knots: number[];
}

export interface CST_BSpline2D_CParrayIncS {
    type: 'increasingSequence_CParray';
    controlPoints: Vector2d[];
    increasingKnotSequence: IncreasingOpenKnotSequenceOpenCurve;
}

export interface CST_BSpline2D_CParrayStIncS {
    type: 'strIncreasingSequence_CParray';
    controlPoints: Vector2d[];
    increasingKnotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;
}

export type CST_BSpline2D = CST_BSpline2D_CParray | CST_BSpline2D_KCParray | CST_BSpline2D_CParrayIncS | CST_BSpline2D_CParrayStIncS | CST_BSpline2D_CParrayDeg;

export interface CST_BSpline3D_CParray {
    type: 'CParray';
    controlPoints: Vector3d[];
}

export interface CST_BSpline3D_CParrayDeg {
    type: 'CParray_Degree';
    controlPoints: Vector3d[];
    degree: number;
}

export interface CST_BSpline3D_KCParray {
    type: 'knotArray_increasingSequence_CParray';
    controlPoints: Vector3d[];
    knots: number[];
}

export interface CST_BSpline3D_CParrayIncS {
    type: 'increasingSequence_CParray';
    controlPoints: Vector3d[];
    increasingKnotSequence: IncreasingOpenKnotSequenceOpenCurve;
}

export interface CST_BSpline3D_CParrayStIncS {
    type: 'strIncreasingSequence_CParray';
    controlPoints: Vector3d[];
    increasingKnotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;
}

export type CST_BSpline3D = CST_BSpline3D_CParray | CST_BSpline3D_KCParray | CST_BSpline3D_CParrayIncS | CST_BSpline3D_CParrayStIncS | CST_BSpline3D_CParrayDeg;

export type CST_BSpline = CST_BSpline2D | CST_BSpline3D;