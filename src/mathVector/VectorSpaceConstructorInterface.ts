/**
 * Core types and interfaces for vector space operations
 * Implements mathematical vector space axioms for real and complex numbers
 */

import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { RealVectorOfDimension } from "./RealVectorSpace";
import { Weight } from "./Weight";

// ------------ Type Definitions ------------

export const COMPLEX = 'Complex' as const;
export const WEIGHT = 'Weight' as const;
export const COMPLEXWEIGHT = 'ComplexWeight' as const;
export const REALVECTOR2D = 'RealVector2D' as const;
export const COMPLEXVECTOR2D = 'ComplexVector2D' as const;
export const PROJECTIVEVECTOR2D = 'ProjectiveVector2D' as const;
export const REALVECTOR3D = 'RealVector3D' as const;
export const PROJECTIVEVECTOR3D = 'ProjectiveVector3D' as const;
export const REALVECTOR4D = 'RealVector4D' as const;
export const PROJECTIVECOMPLEXVECTOR1D = 'ProjectiveComplexVector1D' as const;

/** Real numbers (ℝ) */
export type Real = number;

/** Complex numbers (ℂ) represented as [real, imaginary] */
// export type Complex = [number, number];
export interface Complex {
    readonly type: typeof COMPLEX;
    real: number;
    imaginary: number;
}

export interface Weight_Interface {
    readonly type: typeof WEIGHT;
    value: Weight;
}

export interface ComplexWeight {
    readonly type: typeof COMPLEXWEIGHT;
    real: Weight;
    imaginary: Weight;
}


/** Scalar types supported in calculations */
export type Scalar = Real | Complex;

/** Generic vector type for n-dimensional space */
export type RealVector = RealVector1D | RealVector2D | RealVector3D | RealVector4D;
export type ComplexVector = ComplexVector1D | ComplexVector2D;
export type ProjectiveVector = ProjectiveVector2D | ProjectiveVector3D;
export type ProjectiveComplexVector = ProjectiveComplexVector1D;
export type Vector = RealVector | ComplexVector | ProjectiveVector | ProjectiveComplexVector;

/** Specific vector type */
export type Vector1D = Scalar;

export type RealVector1D = Real;

// export interface RealVector1D {
//     readonly type: typeof REALVECTOR1D;  // Add this constant
//     coordinates: Real;
// }

export type Vector2D = RealVector2D | ComplexVector2D | ProjectiveComplexVector1D;

export interface RealVector2D {
    readonly type: typeof REALVECTOR2D;
    coordinates: [Real, Real];
}

export interface ProjectiveVector2D {
    readonly type: typeof PROJECTIVEVECTOR2D;
    coordinates: [Real, Real, Weight_Interface];
}

export type Vector3D = RealVector3D | ProjectiveVector2D;

export interface RealVector3D {
    readonly type: typeof REALVECTOR3D;
    coordinates: [Real, Real, Real];
}

export interface ProjectiveVector3D {
    readonly type: typeof PROJECTIVEVECTOR3D;
    coordinates: [Real, Real, Real, Weight_Interface];
}

export interface RealVector4D {
    readonly type: typeof REALVECTOR4D;
    coordinates: [Real, Real, Real, Real];
}

export type Vector4D = RealVector4D | ProjectiveVector3D;

export type ComplexVector1D = Complex;

export interface ComplexVector2D {
    readonly type: typeof COMPLEXVECTOR2D;
    coordinates: [Complex, Complex];
}

export interface ProjectiveComplexVector1D {
    readonly type: typeof PROJECTIVECOMPLEXVECTOR1D;
    coordinates: [Complex, ComplexWeight];
}

export type VectorTypeForSpace<VS extends VectorSpaceType, D extends number> =
    VS extends VectorSpaceType.REAL ? RealVectorOfDimension<D> :
    VS extends VectorSpaceType.COMPLEX ? ComplexVectorOfDimension<D> :
    VS extends VectorSpaceType.PROJECTIVE ? ProjectiveVectorOfDimension<D> :
    VS extends VectorSpaceType.PROJECTIVECOMPLEX ? ProjectiveComplexVectorOfDimension<D> :
    VectorSpaceType.UNKNOWN_VECTORSPACE;


export type ComplexVectorOfDimension<D extends number> = 
    D extends 1 ? ComplexVector1D :
    D extends 2 ? ComplexVector2D :
    ComplexVector;
    // never;


export type ProjectiveVectorOfDimension<D extends number> = 
    D extends 3 ? ProjectiveVector2D :
    D extends 4 ? ProjectiveVector3D :
    ProjectiveVector;
    // never;


export type ProjectiveComplexVectorOfDimension<D extends number> = 
    D extends 2 ? ProjectiveComplexVector1D :
    ProjectiveComplexVector;
    // never;


// ------------ Vector Space Interface ------------

/**
 * Vector Space interface following mathematical axioms
 * V is a vector space over field K if it satisfies the vector space axioms
 */
export interface VectorSpace<K extends Scalar, V extends Vector> {
    /** Additive identity element (zero vector) */
    defaultVect(): V;
    
    /** Vector addition (commutative group operation) */
    add(a: V, b: V): V;
    
    /** Scalar multiplication */
    scale(scalar: K, v: V): V;
    
    /** Vector subtraction (derived operation) */
    subtract(a: V, b: V): V;
    
    /** Dimension of the vector space */
    dimension(): number;

    /** Duplicate vector */
    clone(v: V): V;
}
