
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import type { Complex } from "./Complex";
import type { ComplexVectorSpace } from "./ComplexVectorSpace";
import type { ComplexWeight } from "./ComplexWeight";
import type { IdentifiableVectorSpace } from "./IVectorSpace";
import type { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import type { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import type { RealVectorSpace } from "./RealVectorSpace";
import type { IComplex, ComplexVector, ProjectiveVector, RealVector, Scalar, Vector, RealVectorOfDimension } from "./VectorSpaceConstructorInterface";
import type { Weight } from "./Weight";


/**
 * Core vector interface - all vector classes implement this
 */

export interface IVector {
    readonly dimension: number;
    readonly vectorType: string;
    readonly spaceType: VectorSpaceType;
    readonly vectorSpace: IdentifiableVectorSpace<any, any>; // The vector space this vector belongs to
    
    // Coordinate access
    getCoordinate(index: number): number | Complex;
    readonly coordinates: (number | Complex)[];
    
    // Raw data access for interoperability
    readonly descriptor: Vector;
    
    // Basic operations - now can be performed directly on vectors
    clone(): IVector;
    equals(other: IVector): boolean;
    add(other: IVector): IVector;
    subtract(other: IVector): IVector;
    scale(scalar: Scalar | Complex): IVector;
    revert(): IVector;
    
    // Vector space operations
    norm(): number;
    normalize(tolerance?: number): IVector;
    dot(other: IVector): number | IComplex;
    isParallel(other: IVector, tolerance?: number): boolean;
    isOrthogonal(other: IVector, tolerance?: number): boolean;
    
    // Conversion utilities
    toArray(): number[];
    toString(): string;
}


/**
 * Real vector specific interface
 */

export interface IRealVector extends IVector {
    readonly vectorSpace: RealVectorSpace<any>;
    getCoordinate(index: number): number;
    // setCoordinate(index: number, value: number): void;
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

export interface IComplexVector extends IVector {
    readonly vectorSpace: ComplexVectorSpace<any>;
    getCoordinate(index: number): Complex;
    // setCoordinate(index: number, value: Complex): void;
    // readonly coordinates: Complex[];
    readonly coordinates: Complex[];
    readonly descriptor: ComplexVector;

    add(other: IComplexVector): IComplexVector;
    subtract(other: IComplexVector): IComplexVector;
    // scale(scalar: number): IComplexVector;
    // scale(scalar: Complex): IComplexVector;
    scale(scalar: number | Complex): IComplexVector;
    
    // Complex-specific methods
    getReal(index: number): number;
    getImaginary(index: number): number;
    // setReal(index: number, value: number): void;
    // setImaginary(index: number, value: number): void;
}

/**
 * Projective vector specific interface
 */

export interface IProjectiveVector extends IVector {
    readonly vectorSpace: ProjectiveVectorSpace<any>;
    readonly weight: Weight;
    readonly descriptor: ProjectiveVector;
    readonly coordinates: number[];
    readonly homogeneousCoordinates: (number | IComplex)[];
    getCoordinate(index: number): number;
    
    add(other: IProjectiveVector): IProjectiveVector;
    subtract(other: IProjectiveVector): IProjectiveVector;
    scale(scalar: number): IProjectiveVector;

    // Projective-specific methods
    clone(): IProjectiveVector;
    normalize(): IProjectiveVector;
    // toRealVector(realVectorSpace?: RealVectorSpace<any>): IRealVector;
}

export interface IProjectiveComplexVector extends IVector {
    readonly vectorSpace: ProjectiveComplexVectorSpace<any>;
    readonly weight: ComplexWeight;
    readonly homogeneousCoordinates: (number | IComplex)[];
    getCoordinate(index: number): Complex;
    // setCoordinate(index: number, value: Complex): void;
    
    add(other: IProjectiveComplexVector): IProjectiveComplexVector;
    subtract(other: IProjectiveComplexVector): IProjectiveComplexVector;
    scale(scalar: number): IProjectiveComplexVector;

    // Projective-specific methods
    normalize(): IProjectiveComplexVector;
    toComplexVector(): IRealVector | IComplexVector;
}