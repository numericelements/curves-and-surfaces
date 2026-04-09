import type { ComplexDesc, ComplexVector2D, ProjectiveComplexVector1D, ProjectiveRealVector2D, ProjectiveRealVector3D, RealVector2D, RealVector3D, RealVector4D } from "../VectorDescriptorConstructorInterface";

/** Real numbers (ℝ) */
export type Real = number;

/** Specific vector types */
export type RealVector1D = Real;

export type ComplexVector1D = ComplexDesc;

/** The dimension specified in the type name corresponds to the number of components in the vector whether real or complex */
export type VectorDesc1D = Real | ComplexDesc;

/** The dimension specified in the type name corresponds to the dimension of the ambient space when considering projective vectors */
export type VectorDesc2D = RealVector2D | ComplexVector2D | ProjectiveComplexVector1D;

export type VectorDesc3D = RealVector3D | ProjectiveRealVector2D;

export type VectorDesc4D = RealVector4D | ProjectiveRealVector3D;


/** Generic vector types for n-dimensional vectorspaces */
export type RealVectorDesc = RealVector1D | RealVector2D | RealVector3D | RealVector4D;
export type ComplexVectorDesc = ComplexVector1D | ComplexVector2D;
export type ProjectiveRealVectorDesc = ProjectiveRealVector2D | ProjectiveRealVector3D;
export type ProjectiveComplexVectorDesc = ProjectiveComplexVector1D;
export type VectorDesc = RealVectorDesc | ComplexVectorDesc | ProjectiveRealVectorDesc | ProjectiveComplexVectorDesc;