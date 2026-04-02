import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import type { ComplexVector, ComplexVectorOfDimension, IComplex, ProjectiveComplexVector, ProjectiveComplexVectorOfDimension, ProjectiveVector, ProjectiveVectorOfDimension, RealVector, RealVectorOfDimension, Vector } from "./VectorSpaceConstructorInterface";

/**
 * Vector Space interface following mathematical axioms
 * V is a vector space over field K if it satisfies the vector space axioms
 */
export interface VectorSpace<V extends Vector> {
    /** Additive identity element (zero vector) */
    defaultVect(): V;
    
    /** Vector addition (commutative group operation) */
    addDescriptors(a: V, b: V): V;
    
    /** Scalar multiplication */
    // scaleDescriptor(scalar: K, v: V): V;
    scaleDescriptor(scalar: number | IComplex, v: V): V;
    
    /** Vector subtraction (derived operation) */
    subtractDescriptors(a: V, b: V): V;

    /** Norm of a vector */
    normDescriptor(v: V): number;

    /** Dimension of the vector space */
    dimension(): number;

    /** Duplicate vector */
    cloneVector(v: V): V;
}

/**
 * Enhanced Vector Space Interface with Identity
 */
export interface IdentifiableVectorSpace<V extends Vector> extends VectorSpace<V> {
    /** Unique identifier for this vector space instance */
    readonly id: string;
    
    /** Human-readable name for this vector space */
    readonly name: string;
    
    /** Whether this is a default vector space managed by singleton */
    readonly isDefault: boolean;
    
    /** Type of vector space (Real, Complex, etc.) */
    readonly spaceType: VectorSpaceType;
    
    /** Check if this vector space is the same as another */
    isSameSpace(other: IdentifiableVectorSpace<V>): boolean;
    
    /** Check if this vector space is isomorphic to another */
    isIsomorphicTo(other: IdentifiableVectorSpace<V>): boolean;
}

/**
 * Real vector space interface with dimension-specific descriptors
 */

// export interface RealVectorSpaceInterface<D extends number>  {
export interface RealVectorSpaceInterface<D extends number, V extends RealVector = RealVectorOfDimension<D>> 
    extends IdentifiableVectorSpace<V> {
    // readonly dimension: D;

    readonly spaceType: VectorSpaceType.REAL; 
    // defaultVect(): V;
    // toString(): string
    // addDescriptors(a: V, b: V): V;
    // subtractDescriptors(a: V, b: V): V;
    dotDescriptors(a: V, b: V): number;
    normDescriptor(v: V): number;
}

export interface ComplexVectorSpaceInterface<D extends number, V extends ComplexVector = ComplexVectorOfDimension<D>> 
    extends IdentifiableVectorSpace<V> {
    // readonly dimension: D;

    readonly spaceType: VectorSpaceType.COMPLEX; 
    // defaultVect(): V;
    // toString(): string
    // addDescriptors(a: V, b: V): V;
    // subtractDescriptors(a: V, b: V): V;
    dotDescriptors(a: V, b: V): number;
    normDescriptor(v: V): number;
}

export interface ProjectiveVectorSpaceInterface<D extends number, V extends ProjectiveVector = ProjectiveVectorOfDimension<D>> 
    extends IdentifiableVectorSpace<V> {
    // readonly dimension: D;

    readonly spaceType: VectorSpaceType.PROJECTIVE;
    readonly weightManagement: WeightManagement;
    // defaultVect(): V;
    // toString(): string
    // addDescriptors(a: V, b: V): V;
    // subtractDescriptors(a: V, b: V): V;
    // dotDescriptors(a: V, b: V): number;
    normDescriptor(v: V): number;
}

export interface ProjectiveComplexVectorSpaceInterface<D extends number, V extends ProjectiveComplexVector = ProjectiveComplexVectorOfDimension<D>> 
    extends IdentifiableVectorSpace<V> {
    // readonly dimension: D;

    readonly spaceType: VectorSpaceType.PROJECTIVECOMPLEX; 
    // defaultVect(): V;
    // toString(): string
    // addDescriptors(a: V, b: V): V;
    // subtractDescriptors(a: V, b: V): V;
    // dotDescriptors(a: V, b: V): number;
    // normDescriptor(v: V): number;
}