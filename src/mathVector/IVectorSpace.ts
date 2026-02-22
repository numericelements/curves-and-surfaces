import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import type { ComplexVectorOfDimension, IComplex, ProjectiveComplexVectorOfDimension, ProjectiveVectorOfDimension, RealVectorOfDimension, Vector } from "./VectorSpaceConstructorInterface";

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
export interface RealVectorSpaceInterface<D extends number> 
    extends IdentifiableVectorSpace<RealVectorOfDimension<D>> {
    // readonly dimension: D;

    readonly spaceType: VectorSpaceType.REAL; 
    // defaultVect(): RealVectorOfDimension<D>;
    // toString(): string
    // addDescriptors(a: RealVectorOfDimension<D>, b: RealVectorOfDimension<D>): RealVectorOfDimension<D>;
    // subtractDescriptors(a: RealVectorOfDimension<D>, b: RealVectorOfDimension<D>): RealVectorOfDimension<D>;
    dotDescriptors(a: RealVectorOfDimension<D>, b: RealVectorOfDimension<D>): number;
    normDescriptor(v: RealVectorOfDimension<D>): number;
}

export interface ComplexVectorSpaceInterface<D extends number> 
    extends IdentifiableVectorSpace<ComplexVectorOfDimension<D>> {
    // readonly dimension: D;

    readonly spaceType: VectorSpaceType.COMPLEX; 
    // defaultVect(): ComplexVectorOfDimension<D>;
    // toString(): string
    // addDescriptors(a: ComplexVectorOfDimension<D>, b: ComplexVectorOfDimension<D>): ComplexVectorOfDimension<D>;
    // subtractDescriptors(a: ComplexVectorOfDimension<D>, b: ComplexVectorOfDimension<D>): ComplexVectorOfDimension<D>;
    dotDescriptors(a: ComplexVectorOfDimension<D>, b: ComplexVectorOfDimension<D>): number;
    normDescriptor(v: ComplexVectorOfDimension<D>): number;
}

export interface ProjectiveVectorSpaceInterface<D extends number> 
    extends IdentifiableVectorSpace<ProjectiveVectorOfDimension<D>> {
    // readonly dimension: D;

    readonly spaceType: VectorSpaceType.PROJECTIVE;
    readonly weightManagement: WeightManagement;
    // defaultVect(): ProjectiveVectorOfDimension<D>;
    // toString(): string
    // addDescriptors(a: ProjectiveVectorOfDimension<D>, b: ProjectiveVectorOfDimension<D>): ProjectiveVectorOfDimension<D>;
    // subtractDescriptors(a: ProjectiveVectorOfDimension<D>, b: ProjectiveVectorOfDimension<D>): ProjectiveVectorOfDimension<D>;
    // dotDescriptors(a: ProjectiveVectorOfDimension<D>, b: ProjectiveVectorOfDimension<D>): number;
    normDescriptor(v: ProjectiveVectorOfDimension<D>): number;
}

export interface ProjectiveComplexVectorSpaceInterface<D extends number> 
    extends IdentifiableVectorSpace<ProjectiveComplexVectorOfDimension<D>> {
    // readonly dimension: D;

    readonly spaceType: VectorSpaceType.PROJECTIVECOMPLEX; 
    // defaultVect(): ProjectiveComplexVectorOfDimension<D>;
    // toString(): string
    // addDescriptors(a: ProjectiveComplexVectorOfDimension<D>, b: ProjectiveComplexVectorOfDimension<D>): ProjectiveComplexVectorOfDimension<D>;
    // subtractDescriptors(a: ProjectiveComplexVectorOfDimension<D>, b: ProjectiveComplexVectorOfDimension<D>): ProjectiveComplexVectorOfDimension<D>;
    // dotDescriptors(a: ProjectiveComplexVectorOfDimension<D>, b: ProjectiveComplexVectorOfDimension<D>): number;
    // normDescriptor(v: ProjectiveComplexVectorOfDimension<D>): number;
}