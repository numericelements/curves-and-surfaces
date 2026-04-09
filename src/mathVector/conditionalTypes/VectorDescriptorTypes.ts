import { VectorSpaceType } from "../../namedConstants/BSplineR1toRn";
import type { Complex } from "../Complex";
import type { ComplexVector1D, ComplexVectorDesc, ProjectiveComplexVectorDesc, ProjectiveRealVectorDesc, RealVector1D, RealVectorDesc, VectorDesc } from "../utilityTypes/VectorDescriptorTypes";
import type { ComplexVector2D, ProjectiveComplexVector1D, ProjectiveRealVector2D, ProjectiveRealVector3D, RealVector2D, RealVector3D, RealVector4D } from "../VectorDescriptorConstructorInterface";

export type VectorTypeForSpace<VS extends VectorSpaceType, D extends number> =
    VS extends VectorSpaceType.REAL ? RealVectorOfDimension<D> :
    VS extends VectorSpaceType.COMPLEX ? ComplexVectorOfDimension<D> :
    VS extends VectorSpaceType.PROJECTIVEREAL ? ProjectiveRealVectorOfDimension<D> :
    VS extends VectorSpaceType.PROJECTIVECOMPLEX ? ProjectiveComplexVectorOfDimension<D> :
    VectorSpaceType.UNKNOWN_VECTORSPACE;

export type RealVectorOfDimension<D extends number> = 
    D extends 1 ? RealVector1D :
    D extends 2 ? RealVector2D :
    D extends 3 ? RealVector3D :
    D extends 4 ? RealVector4D :
    RealVectorDesc;
    // never;

export type ComplexVectorOfDimension<D extends number> = 
    D extends 1 ? ComplexVector1D :
    D extends 2 ? ComplexVector2D :
    ComplexVectorDesc;
    // never;

export type ProjectiveRealVectorOfDimension<D extends number> = 
    D extends 3 ? ProjectiveRealVector2D :
    D extends 4 ? ProjectiveRealVector3D :
    ProjectiveRealVectorDesc;
    // never;

export type ProjectiveComplexVectorOfDimension<D extends number> = 
    D extends 2 ? ProjectiveComplexVector1D :
    ProjectiveComplexVectorDesc;
    // never;

/**
 * Maps a Vector descriptor type to its coordinate scalar type.
 * Useful as a return-type annotation at call sites, not inside IVector itself,
 * because TypeScript defers resolution of conditional types over generic params.
 */
export type CoordinateType<VD extends VectorDesc> =
    VD extends (RealVectorDesc | ProjectiveRealVectorDesc) ? number :
    VD extends (ComplexVectorDesc | ProjectiveComplexVectorDesc) ? Complex :
    number | Complex;