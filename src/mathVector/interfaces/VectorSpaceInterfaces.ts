import { VectorSpaceType } from "../../namedConstants/BSplineR1toRn";
import { WeightManagement } from "../../namedConstants/ProjectiveRealVectorSpace";
import type { ComplexDesc } from "../VectorDescriptorConstructorInterface";
import type { ComplexVectorOfDimension, ProjectiveComplexVectorOfDimension, ProjectiveRealVectorOfDimension, RealVectorOfDimension } from "../conditionalTypes/VectorDescriptorTypes";
import type { ComplexVectorDesc, ProjectiveComplexVectorDesc, ProjectiveRealVectorDesc, RealVectorDesc, VectorDesc } from "../utilityTypes/VectorDescriptorTypes";

/**
 * Vector Space interface following mathematical axioms
 * V is a vector space over field K if it satisfies the vector space axioms
 */
export interface VectorSpace<VD extends VectorDesc> {
    /** Additive identity element (zero vector) */
    defaultVect(): VD;
    
    /** Vector addition (commutative group operation) */
    addDescriptors(a: VD, b: VD): VD;
    
    /** Scalar multiplication */
    // scaleDescriptor(scalar: K, v: V): V;
    scaleDescriptor(scalar: number | ComplexDesc, v: VD): VD;
    
    /** Vector subtraction (derived operation) */
    subtractDescriptors(a: VD, b: VD): VD;

    /** Norm of a vector */
    normDescriptor(v: VD): number;

    /** Dimension of the vector space */
    dimension(): number;

    /** Duplicate vector */
    cloneVector(v: VD): VD;
}

/**
 * Enhanced Vector Space Interface with Identity
 */
export interface IdentifiableVectorSpace<VD extends VectorDesc> extends VectorSpace<VD> {
    /** Unique identifier for this vector space instance */
    readonly id: string;
    
    /** Human-readable name for this vector space */
    readonly name: string;
    
    /** Whether this is a default vector space managed by singleton */
    readonly isDefault: boolean;
    
    /** Type of vector space (Real, Complex, etc.) */
    readonly spaceType: VectorSpaceType;
    
    /** Check if this vector space is the same as another */
    isSameSpace(other: IdentifiableVectorSpace<VD>): boolean;
    
    /** Check if this vector space is isomorphic to another */
    isIsomorphicTo(other: IdentifiableVectorSpace<VD>): boolean;
}

/**
 * Real vector space interface with dimension-specific descriptors
 */

// export interface RealVectorSpaceInterface<D extends number>  {
export interface RealVectorSpaceInterface<D extends number, VD extends RealVectorDesc = RealVectorOfDimension<D>> 
    extends IdentifiableVectorSpace<VD> {
    // readonly dimension: D;

    readonly spaceType: VectorSpaceType.REAL; 
    // defaultVect(): V;
    // toString(): string
    // addDescriptors(a: V, b: V): V;
    // subtractDescriptors(a: V, b: V): V;
    dotDescriptors(a: VD, b: VD): number;
    normDescriptor(v: VD): number;
}

export interface ComplexVectorSpaceInterface<D extends number, VD extends ComplexVectorDesc = ComplexVectorOfDimension<D>> 
    extends IdentifiableVectorSpace<VD> {
    // readonly dimension: D;

    readonly spaceType: VectorSpaceType.COMPLEX; 
    // defaultVect(): V;
    // toString(): string
    // addDescriptors(a: V, b: V): V;
    // subtractDescriptors(a: V, b: V): V;
    dotDescriptors(a: VD, b: VD): number;
    normDescriptor(v: VD): number;
}

export interface ProjectiveRealVectorSpaceInterface<D extends number, VD extends ProjectiveRealVectorDesc = ProjectiveRealVectorOfDimension<D>> 
    extends IdentifiableVectorSpace<VD> {
    // readonly dimension: D;

    readonly spaceType: VectorSpaceType.PROJECTIVEREAL;
    readonly weightManagement: WeightManagement;
    // defaultVect(): V;
    // toString(): string
    // addDescriptors(a: V, b: V): V;
    // subtractDescriptors(a: V, b: V): V;
    // dotDescriptors(a: V, b: V): number;
    normDescriptor(v: VD): number;
}

export interface ProjectiveComplexVectorSpaceInterface<D extends number, VD extends ProjectiveComplexVectorDesc = ProjectiveComplexVectorOfDimension<D>> 
    extends IdentifiableVectorSpace<VD> {
    // readonly dimension: D;

    readonly spaceType: VectorSpaceType.PROJECTIVECOMPLEX; 
    // defaultVect(): V;
    // toString(): string
    // addDescriptors(a: V, b: V): V;
    // subtractDescriptors(a: V, b: V): V;
    // dotDescriptors(a: V, b: V): number;
    // normDescriptor(v: V): number;
}