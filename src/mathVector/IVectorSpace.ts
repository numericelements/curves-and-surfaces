import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import type { IComplex, RealVectorOfDimension, Vector } from "./VectorSpaceConstructorInterface";

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

export interface RealVectorSpaceInterface<D extends number>  {
// export interface RealVectorSpaceInterface<D extends number> 
//     extends IdentifiableVectorSpace<RealVectorOfDimension<D>> {
    // readonly dimension: D;
    // dotDescriptors(a: RealVectorOfDimension<D>, b: RealVectorOfDimension<D>): number;
    // normDescriptor(v: RealVectorOfDimension<D>): number;

    addDescriptors(a: RealVectorOfDimension<D>, b: RealVectorOfDimension<D>): RealVectorOfDimension<D>;
}