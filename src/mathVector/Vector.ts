
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import type { Complex } from "./Complex";
import type { ComplexVectorSpace } from "./ComplexVectorSpace";
import type { ComplexWeight } from "./ComplexWeight";
import type { IdentifiableVectorSpace } from "./IVectorSpace";
import type { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import type { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import type { RealVectorSpace } from "./RealVectorSpace";
import type { ComplexVector, ComplexVectorOfDimension, ProjectiveComplexVector, ProjectiveComplexVectorOfDimension, ProjectiveVector, ProjectiveVectorOfDimension, RealVector, RealVectorOfDimension, Vector } from "./VectorSpaceConstructorInterface";
import type { Weight } from "./Weight";


/**
 * Core vector interface - all vector classes implement this
 */
/**
 * Maps a Vector descriptor type to its coordinate scalar type.
 * Useful as a return-type annotation at call sites, not inside IVector itself,
 * because TypeScript defers resolution of conditional types over generic params.
 */
export type CoordinateType<V extends Vector> =
    V extends (RealVector | ProjectiveVector) ? number :
    V extends (ComplexVector | ProjectiveComplexVector) ? Complex :
    number | Complex;

export interface IVector <
        D extends number = number,
        V extends Vector = Vector
    > {
    readonly dimension: D;
    readonly vectorType: string;
    readonly spaceType: VectorSpaceType;
    readonly vectorSpace: IdentifiableVectorSpace<V>; // The vector space this vector belongs to
    readonly descriptor: V;

    // Coordinate access
    readonly coordinates: (number | Complex)[];
    getCoordinate(index: number): number | Complex;

    // Basic operations - now can be performed directly on vectors
    clone(): this;
    equals(other: IVector<D, V>, tolerance?: number): boolean;
    add(other: IVector<D, V>): this;
    subtract(other: IVector<D, V>): this;
    scale(scalar: number | Complex): this;
    revert(): this;
    
    // Vector space operations
    norm(tolerance?: number): number;
    normalize(tolerance?: number): this;
    dot(other: IVector<D, V>): number;
    isParallel(other: IVector<D, V>, tolerance?: number): boolean;
    isOrthogonal(other: IVector<D, V>, tolerance?: number): boolean;
    distanceTo(other: IVector<D, V>): number;
    affineDistance(other: IVector<D, V>): number;
    
    // Conversion utilities
    toArray(): number[];
    toString(): string;
}


/**
 * Real vector specific interface
 */

export interface IRealVector<D extends number = number, V extends RealVector = RealVectorOfDimension<D>> 
    extends IVector<D, V> 
    {
    readonly vectorSpace: RealVectorSpace<D, V>;
    readonly spaceType: VectorSpaceType.REAL;
    readonly coordinates: number[];
    // Real vector specific accessors
    readonly x?: number;
    readonly y?: number;
    readonly z?: number;
    readonly t?: number;
    getCoordinate(index: number): number;

    toProjectiveVector(projectiveRealVectorSpace?: ProjectiveVectorSpace<any>): IProjectiveVector<any>;
    toComplexVector(complexVectorSpace?: ComplexVectorSpace<any>): IComplexVector<any>;
    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): IProjectiveComplexVector<any>;
}

/**
 * Complex vector specific interface
 */

export interface IComplexVector<D extends number = number, V extends ComplexVector = ComplexVectorOfDimension<D>> 
    extends IVector<D, V> 
{
    readonly vectorSpace: ComplexVectorSpace<D, V>;
    readonly spaceType: VectorSpaceType.COMPLEX;
    readonly coordinates: Complex[];
    // Complex vector specific accessors
    readonly real?: number;
    readonly imaginary?: number;
    getCoordinate(index: number): Complex;
    getReal(index: number): number;
    getImaginary(index: number): number;

    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): IProjectiveComplexVector<any>;
    toProjectiveVector(projectiveVectorSpace?: ProjectiveVectorSpace<any>): IProjectiveVector<any>;
}

/**
 * Projective vector specific interface
 */

export interface IProjectiveVector<D extends number = number, V extends ProjectiveVector = ProjectiveVectorOfDimension<D>>
    extends IVector<D, V> 
{
    readonly vectorSpace: ProjectiveVectorSpace<D, V>;
    readonly spaceType: VectorSpaceType.PROJECTIVE;
    readonly coordinates: number[];
    readonly x: number;
    readonly y: number;
    readonly z?: number;
    readonly weight: Weight;
    readonly homogeneousCoordinates: number[];
    getCoordinate(index: number): number;
    homogeneousTransform(tolerance?: number): this;

    toRealVector(vectorSpace?: RealVectorSpace<any>): IRealVector<any>;
    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): IProjectiveComplexVector<any>;
}

export interface IProjectiveComplexVector<D extends number = number, V extends ProjectiveComplexVector = ProjectiveComplexVectorOfDimension<D>>
    extends IVector<D, V>
{
    readonly vectorSpace: ProjectiveComplexVectorSpace<D, V>;
    readonly spaceType: VectorSpaceType.PROJECTIVECOMPLEX;
    readonly coordinates: Complex[];
    readonly weight: ComplexWeight;
    readonly homogeneousComplexCoordinates: Complex[];
    
    // Projective-specific methods
    toComplexVector(vectorSpace?: ComplexVectorSpace<any>): IComplexVector<any>;
    // toRealVector(): IRealVector<any>;
}