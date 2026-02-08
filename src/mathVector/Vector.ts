
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import type { Complex } from "./Complex";
import type { ComplexVectorSpace } from "./ComplexVectorSpace";
import type { ComplexWeight } from "./ComplexWeight";
import type { IdentifiableVectorSpace } from "./IVectorSpace";
import type { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import type { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import type { RealVectorSpace } from "./RealVectorSpace";
import type { IComplex, ComplexVector, ProjectiveVector, RealVector, Vector } from "./VectorSpaceConstructorInterface";
import type { Weight } from "./Weight";


/**
 * Core vector interface - all vector classes implement this
 */

export interface IVector {
    readonly dimension: number;
    readonly vectorType: string;
    readonly spaceType: VectorSpaceType;
    readonly vectorSpace: IdentifiableVectorSpace<any>; // The vector space this vector belongs to

    // Coordinate access
    getCoordinate(index: number): number | Complex;
    readonly coordinates: (number | Complex)[];
    
    // Descriptor data access for interoperability
    readonly descriptor: Vector;
    
    // Basic operations - now can be performed directly on vectors
    clone(): IVector;
    equals(other: IVector): boolean;
    add(other: IVector): IVector;
    subtract(other: IVector): IVector;
    scale(scalar: number | Complex): IVector;
    revert(): IVector;
    
    // Vector space operations
    norm(): number;
    normalize(tolerance?: number): IVector;
    dot(other: IVector): number;
    isParallel(other: IVector, tolerance?: number): boolean;
    isOrthogonal(other: IVector, tolerance?: number): boolean;
    
    // Conversion utilities
    toArray(): number[];
    toString(): string;
}


/**
 * Real vector specific interface
 */

export interface IRealVector<D extends number = number> extends IVector {
    readonly vectorSpace: RealVectorSpace<D>;
    getCoordinate(index: number): number;
    readonly coordinates: number[];
    readonly descriptor: RealVector;
    
    add(other: IRealVector): IRealVector;
    subtract(other: IRealVector): IRealVector;
    scale(scalar: number): IRealVector;
    dot(other: IRealVector): number;
    
    // Real vector specific accessors
    readonly x?: number;
    readonly y?: number;
    readonly z?: number;
    readonly t?: number;
}

/**
 * Complex vector specific interface
 */

export interface IComplexVector<D extends number = number> extends IVector {
    readonly vectorSpace: ComplexVectorSpace<D>;
    getCoordinate(index: number): Complex;
    readonly coordinates: Complex[];
    readonly descriptor: ComplexVector;

    add(other: IComplexVector): IComplexVector;
    subtract(other: IComplexVector): IComplexVector;
    scale(scalar: number | Complex): IComplexVector;
    
    // Complex-specific methods
    getReal(index: number): number;
    getImaginary(index: number): number;
}

/**
 * Projective vector specific interface
 */

export interface IProjectiveVector<D extends number = number> extends IVector {
    readonly vectorSpace: ProjectiveVectorSpace<D>;
    readonly weight: Weight;
    readonly descriptor: ProjectiveVector;
    readonly coordinates: number[];
    readonly homogeneousCoordinates: number[];
    getCoordinate(index: number): number;
    
    add(other: IProjectiveVector): IProjectiveVector;
    subtract(other: IProjectiveVector): IProjectiveVector;
    scale(scalar: number): IProjectiveVector;

    // Projective-specific methods
    clone(): IProjectiveVector;
    normalize(): IProjectiveVector;
    // toRealVector(realVectorSpace?: RealVectorSpace<any>): IRealVector;
}

export interface IProjectiveComplexVector<D extends number = number> extends IVector {
    readonly vectorSpace: ProjectiveComplexVectorSpace<D>;
    readonly weight: ComplexWeight;
    readonly homogeneousComplexCoordinates: Complex[];
    getCoordinate(index: number): Complex;
    
    add(other: IProjectiveComplexVector): IProjectiveComplexVector;
    subtract(other: IProjectiveComplexVector): IProjectiveComplexVector;
    scale(scalar: number): IProjectiveComplexVector;

    // Projective-specific methods
    normalize(): IProjectiveComplexVector;
    toComplexVector(): IRealVector | IComplexVector;
}