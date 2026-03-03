
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import type { Complex } from "./Complex";
import type { ComplexVectorSpace } from "./ComplexVectorSpace";
import type { ComplexWeight } from "./ComplexWeight";
import type { IdentifiableVectorSpace } from "./IVectorSpace";
import type { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import type { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import type { RealVectorSpace } from "./RealVectorSpace";
import type { ComplexVectorOfDimension, ProjectiveComplexVectorOfDimension, ProjectiveVectorOfDimension, RealVectorOfDimension, Vector } from "./VectorSpaceConstructorInterface";
import type { Weight } from "./Weight";


/**
 * Core vector interface - all vector classes implement this
 */

export interface IVector <
        D extends number = number,
        V extends Vector = Vector
    > {
    readonly dimension: number;
    readonly vectorType: string;
    readonly spaceType: VectorSpaceType;
    readonly vectorSpace: IdentifiableVectorSpace<V>; // The vector space this vector belongs to
    readonly descriptor: V;

    // Coordinate access
    readonly coordinates: (number | Complex)[];
    getCoordinate(index: number): number | Complex;

    // Basic operations - now can be performed directly on vectors
    clone(): IVector<D, V>;
    equals(other: IVector<D, V>): boolean;
    add(other: IVector<D, V>): IVector<D, V>;
    subtract(other: IVector<D, V>): IVector<D, V>;
    scale(scalar: number | Complex): IVector<D, V>;
    revert(): IVector<D, V>;
    
    // Vector space operations
    norm(tolerance?: number): number;
    normalize(tolerance?: number): IVector<D, V>;
    dot(other: IVector<D, V>): number;
    isParallel(other: IVector<D, V>, tolerance?: number): boolean;
    isOrthogonal(other: IVector<D, V>, tolerance?: number): boolean;
    
    // Conversion utilities
    toArray(): number[];
    toString(): string;
}


/**
 * Real vector specific interface
 */

export interface IRealVector<D extends number = number> 
    extends IVector<D, RealVectorOfDimension<D>> 
    {
    readonly vectorSpace: RealVectorSpace<D>;
    readonly spaceType: VectorSpaceType.REAL;

    // Real vector specific accessors
    readonly x?: number;
    readonly y?: number;
    readonly z?: number;
    readonly t?: number;
    toProjectiveVector(projectiveRealVectorSpace?: ProjectiveVectorSpace<any>): IProjectiveVector<any>;
    toComplexVector(complexVectorSpace?: ComplexVectorSpace<any>): IComplexVector<any>;
    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): IProjectiveComplexVector<any>;
}

/**
 * Complex vector specific interface
 */

export interface IComplexVector<D extends number = number> 
    extends IVector<D, ComplexVectorOfDimension<D>> 
{
    readonly vectorSpace: ComplexVectorSpace<D>;
    readonly spaceType: VectorSpaceType.COMPLEX;
  
    // Complex-specific methods
    getReal(index: number): number;
    getImaginary(index: number): number;
}

/**
 * Projective vector specific interface
 */

export interface IProjectiveVector<D extends number = number>
    extends IVector<D, ProjectiveVectorOfDimension<D>> 
{
    readonly vectorSpace: ProjectiveVectorSpace<D>;
    readonly spaceType: VectorSpaceType.PROJECTIVE;
    readonly coordinates: number[];
    readonly weight: Weight;
    readonly homogeneousCoordinates: number[];
    
    // Projective-specific methods
    homogeneousTransform(tolerance?: number): IProjectiveVector<D>;
    toRealVector(vectorSpace?: RealVectorSpace<any>): IRealVector<any>;
    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): IProjectiveComplexVector<any>;
}

export interface IProjectiveComplexVector<D extends number = number>
    extends IVector<D, ProjectiveComplexVectorOfDimension<D>>
{
    readonly vectorSpace: ProjectiveComplexVectorSpace<D>;
    readonly spaceType: VectorSpaceType.PROJECTIVECOMPLEX;
    readonly weight: ComplexWeight;
    readonly homogeneousComplexCoordinates: Complex[];
    
    // Projective-specific methods
    toComplexVector(vectorSpace?: ComplexVectorSpace<D>): IComplexVector<any>;
    // toRealVector(): IRealVector<any>;
}