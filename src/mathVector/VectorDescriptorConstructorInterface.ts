import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEREALVECTOR2D, PROJECTIVEREALVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D, UNDEFINED_VECTORDESCRIPTOR } from "../namedConstants/VectorTypeTags";
import { COMPLEXWEIGHT, WEIGHT } from "../namedConstants/WeightTypeTags";
import type { Real } from "./utilityTypes/VectorDescriptorTypes";
import type { Weight } from "./Weight";


/**
 * Core types and interfaces for vector space operations
 * Implements mathematical vector space axioms for real and complex numbers
 */

/** Complex number descriptor (ℂ) represented as [real, imaginary] */
export interface ComplexDesc {
    readonly type: typeof COMPLEX;
    readonly real: number;
    readonly imaginary: number;
}

/** Weight descriptor (ℝ) represented as a weight object */
export interface WeightDesc {
    readonly type: typeof WEIGHT;
    readonly weight: Weight;
}

/** Complex weight descriptor (ℂ) represented as [real, imaginary] weight objects */
export interface ComplexWeightDesc {
    readonly type: typeof COMPLEXWEIGHT;
    readonly real: Weight;
    readonly imaginary: Weight;
}

// ------------ Vector descriptor definitions ------------

/** Real vector descriptors */

export interface RealVector2D {
    readonly type: typeof REALVECTOR2D;
    readonly coordinates: [Real, Real];
}

export interface RealVector3D {
    readonly type: typeof REALVECTOR3D;
    readonly coordinates: [Real, Real, Real];
}

export interface RealVector4D {
    readonly type: typeof REALVECTOR4D;
    readonly coordinates: [Real, Real, Real, Real];
}

/** Projective real vector descriptors based on real coordinates and a weight descriptor*/

export interface ProjectiveRealVector2D {
    readonly type: typeof PROJECTIVEREALVECTOR2D;
    readonly coordinates: [Real, Real, WeightDesc];
}

export interface ProjectiveRealVector3D {
    readonly type: typeof PROJECTIVEREALVECTOR3D;
    readonly coordinates: [Real, Real, Real, WeightDesc];
}

/** Complex vector descriptors based on complex coordinates as descriptors */
export interface ComplexVector2D {
    readonly type: typeof COMPLEXVECTOR2D;
    readonly coordinates: [ComplexDesc, ComplexDesc];
}

/** Projective complex vector descriptors based on complex coordinates as descriptors and a complex weight descriptor */
export interface ProjectiveComplexVector1D {
    readonly type: typeof PROJECTIVECOMPLEXVECTOR1D;
    readonly coordinates: [ComplexDesc, ComplexWeightDesc];
}

/** Undefined vector descriptor for error handling */
export interface UndefinedVectorDesc {
    readonly type: typeof UNDEFINED_VECTORDESCRIPTOR;
}
