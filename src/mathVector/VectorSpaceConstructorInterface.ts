/**
 * Core types and interfaces for vector space operations
 * Implements mathematical vector space axioms for real and complex numbers
 */

import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { IVector } from "./Vector";
import { Weight } from "./Weight";

// ------------ Type Definitions ------------

export const COMPLEX = 'Complex' as const;
export const WEIGHT = 'Weight' as const;
export const COMPLEXWEIGHT = 'ComplexWeight' as const;
export const REALVECTOR1D = 'RealVector1D' as const;
export const REALVECTOR2D = 'RealVector2D' as const;
export const REALVECTOR3D = 'RealVector3D' as const;
export const REALVECTOR4D = 'RealVector4D' as const;
export const COMPLEXVECTOR1D = 'ComplexVector1D' as const;
export const COMPLEXVECTOR2D = 'ComplexVector2D' as const;
export const PROJECTIVEVECTOR2D = 'ProjectiveVector2D' as const;
export const PROJECTIVEVECTOR3D = 'ProjectiveVector3D' as const;
export const PROJECTIVECOMPLEXVECTOR1D = 'ProjectiveComplexVector1D' as const;
export const UNDEFINED_VECTORTYPE = 'UndefinedVectorType' as const;

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

export interface UndefinedVectorType {
    readonly type: typeof UNDEFINED_VECTORTYPE;
}

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

export type RealVectorOfDimension<D extends number> = 
    D extends 1 ? RealVector1D :
    D extends 2 ? RealVector2D :
    D extends 3 ? RealVector3D :
    D extends 4 ? RealVector4D :
    RealVector;
    // never;

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

export const VECTOR_TYPE_INFO = {
    UndefinedVectorType: {
        typeString: UNDEFINED_VECTORTYPE,
        vectorSpaceType: VectorSpaceType.UNKNOWN_VECTORSPACE,
        spaceDimension: 0,
        isBasicType: false
    },
    RealVector1D: {
        typeString: REALVECTOR1D,
        vectorSpaceType: VectorSpaceType.REAL,
        spaceDimension: 1,
        isBasicType: true
    },
    RealVector2D: {
        typeString: REALVECTOR2D,
        vectorSpaceType: VectorSpaceType.REAL,
        spaceDimension: 2,
        isBasicType: false
    },
    RealVector3D: {
        typeString: REALVECTOR3D,
        vectorSpaceType: VectorSpaceType.REAL,
        spaceDimension: 3,
        isBasicType: false
    },
    RealVector4D: {
        typeString: REALVECTOR4D,
        vectorSpaceType: VectorSpaceType.REAL,
        spaceDimension: 4,
        isBasicType: false
    },
    Complex: {
        typeString: COMPLEX,
        vectorSpaceType: VectorSpaceType.COMPLEX,
        spaceDimension: 1,
        isBasicType: false
    },
    ComplexVector1D: {
        typeString: COMPLEXVECTOR1D,
        vectorSpaceType: VectorSpaceType.COMPLEX,
        spaceDimension: 1,
        isBasicType: false
    },
    ComplexVector2D: {
        typeString: COMPLEXVECTOR2D,
        vectorSpaceType: VectorSpaceType.COMPLEX,
        spaceDimension: 2,
        isBasicType: false
    },
    ProjectiveVector2D: {
        typeString: PROJECTIVEVECTOR2D,
        vectorSpaceType: VectorSpaceType.PROJECTIVE,
        spaceDimension: 3,
        isBasicType: false
    },
    ProjectiveVector3D: {
        typeString: PROJECTIVEVECTOR3D,
        vectorSpaceType: VectorSpaceType.PROJECTIVE,
        spaceDimension: 4,
        isBasicType: false
    },
    ProjectiveComplexVector1D: {
        typeString: PROJECTIVECOMPLEXVECTOR1D,
        vectorSpaceType: VectorSpaceType.PROJECTIVECOMPLEX,
        spaceDimension: 2,
        isBasicType: false
    }
} as const;


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

    addVectors(v1: IVector, v2: IVector): IVector;
}

export interface RealVectorSpaceInterface extends VectorSpace<Real, RealVector> {
    scale(scalar: Real, v: RealVector): RealVector;
}

export interface ComplexVectorSpaceInterface extends VectorSpace<Complex | Real, ComplexVector> {
    scale(scalar: Complex, vector: ComplexVector): ComplexVector;
    scale(scalar: Real, vector: ComplexVector): ComplexVector;
}

/**
 * Enhanced Vector Space Interface with Identity
 */
export interface IdentifiableVectorSpace<K extends Scalar, V extends Vector> extends VectorSpace<K, V> {
    /** Unique identifier for this vector space instance */
    readonly id: string;
    
    /** Human-readable name for this vector space */
    readonly name: string;
    
    /** Whether this is a default vector space managed by singleton */
    readonly isDefault: boolean;
    
    /** Type of vector space (Real, Complex, etc.) */
    readonly spaceType: VectorSpaceType;
    
    /** Check if this vector space is the same as another */
    isSameSpace(other: IdentifiableVectorSpace<any, any>): boolean;
    
    /** Check if this vector space is isomorphic to another */
    isIsomorphicTo(other: IdentifiableVectorSpace<any, any>): boolean;
}
