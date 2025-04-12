/**
 * Core types and interfaces for vector space operations
 * Implements mathematical vector space axioms for real and complex numbers
 */

import { Weight } from "./Weight";

// ------------ Type Definitions ------------

export const COMPLEX = 'Complex';
export const WEIGHT = 'Weight';
export const COMPLEXWEIGHT = 'ComplexWeight';
export const REALVECTOR2D = 'RealVector2D';
export const COMPLEXVECTOR2D = 'ComplexVector2D';
export const PROJECTIVEVECTOR2D = 'ProjectiveVector2D';
export const REALVECTOR3D = 'RealVector3D';
export const PROJECTIVEVECTOR3D = 'ProjectiveVector3D';
export const REALVECTOR4D = 'RealVector4D';
export const PROJECTIVECOMPLEXVECTOR1D = 'ProjectiveComplexVector1D';

/** Real numbers (ℝ) */
export type Real = number;

/** Complex numbers (ℂ) represented as [real, imaginary] */
// export type Complex = [number, number];
export interface Complex {
    type: typeof COMPLEX;
    real: number;
    imaginary: number;
}

export interface Weight_Interface {
    type: typeof WEIGHT;
    value: Weight;
}

export interface ComplexWeight {
    type: typeof COMPLEXWEIGHT;
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

export type Vector2D = RealVector2D | ComplexVector2D | ProjectiveComplexVector1D;

export interface RealVector2D {
    type: typeof REALVECTOR2D;
    coordinates: [Real, Real];
}

export interface ProjectiveVector2D {
    type: typeof PROJECTIVEVECTOR2D;
    coordinates: [Real, Real, Weight_Interface];
}

export type Vector3D = RealVector3D | ProjectiveVector2D;

export interface RealVector3D {
    type: typeof REALVECTOR3D;
    coordinates: [Real, Real, Real];
}

export interface ProjectiveVector3D {
    type: typeof PROJECTIVEVECTOR3D;
    coordinates: [Real, Real, Real, Weight_Interface];
}

export interface RealVector4D {
    type: typeof REALVECTOR4D;
    coordinates: [Real, Real, Real, Real];
}

export type Vector4D = RealVector4D | ProjectiveVector3D;

export type ComplexVector1D = Complex;

export interface ComplexVector2D {
    type: typeof COMPLEXVECTOR2D;
    coordinates: [Complex, Complex];
}

export interface ProjectiveComplexVector1D {
    type: typeof PROJECTIVECOMPLEXVECTOR1D;
    coordinates: [Complex, ComplexWeight];
}



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
