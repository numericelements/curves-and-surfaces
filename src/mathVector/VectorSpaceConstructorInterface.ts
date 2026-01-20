/**
 * Core types and interfaces for vector space operations
 * Implements mathematical vector space axioms for real and complex numbers
 */

import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR1D, COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, REALVECTOR1D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D, UNDEFINED_VECTORTYPE } from "../namedConstants/VectorTypeTags";
import { COMPLEXWEIGHT, WEIGHT } from "../namedConstants/WeightTypeTags";
import type { Weight } from "./Weight";

// ------------ Type Definitions ------------

/** Real numbers (ℝ) */
export type Real = number;

/** Complex numbers (ℂ) represented as [real, imaginary] */
export interface IComplex {
    readonly type: typeof COMPLEX;
    readonly real: number;
    readonly imaginary: number;
}

export interface IWeight {
    readonly type: typeof WEIGHT;
    readonly weight: Weight;
}

export interface IComplexWeight {
    readonly type: typeof COMPLEXWEIGHT;
    readonly real: Weight;
    readonly imaginary: Weight;
}

/** Generic vector type for n-dimensional space */
export type RealVector = RealVector1D | RealVector2D | RealVector3D | RealVector4D;
export type ComplexVector = ComplexVector1D | ComplexVector2D;
export type ProjectiveVector = ProjectiveVector2D | ProjectiveVector3D;
export type ProjectiveComplexVector = ProjectiveComplexVector1D;
export type Vector = RealVector | ComplexVector | ProjectiveVector | ProjectiveComplexVector;

/** Specific vector type */
export type Vector1D = Real | IComplex;;

export type RealVector1D = Real;

export interface UndefinedVectorType {
    readonly type: typeof UNDEFINED_VECTORTYPE;
}

export type Vector2D = RealVector2D | ComplexVector2D | ProjectiveComplexVector1D;

export interface RealVector2D {
    readonly type: typeof REALVECTOR2D;
    readonly coordinates: [Real, Real];
}

export interface ProjectiveVector2D {
    readonly type: typeof PROJECTIVEVECTOR2D;
    readonly coordinates: [Real, Real, IWeight];
}

export type Vector3D = RealVector3D | ProjectiveVector2D;

export interface RealVector3D {
    readonly type: typeof REALVECTOR3D;
    readonly coordinates: [Real, Real, Real];
}

export interface ProjectiveVector3D {
    readonly type: typeof PROJECTIVEVECTOR3D;
    readonly coordinates: [Real, Real, Real, IWeight];
}

export interface RealVector4D {
    readonly type: typeof REALVECTOR4D;
    readonly coordinates: [Real, Real, Real, Real];
}

export type Vector4D = RealVector4D | ProjectiveVector3D;

export type ComplexVector1D = IComplex;

export interface ComplexVector2D {
    readonly type: typeof COMPLEXVECTOR2D;
    readonly coordinates: [IComplex, IComplex];
}

export interface ProjectiveComplexVector1D {
    readonly type: typeof PROJECTIVECOMPLEXVECTOR1D;
    readonly coordinates: [IComplex, IComplexWeight];
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
    never;

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

