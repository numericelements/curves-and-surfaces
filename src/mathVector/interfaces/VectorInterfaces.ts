
import { VectorSpaceType } from "../../namedConstants/BSplineR1toRn";
import type { Complex } from "../Complex";
import type { ComplexVectorSpace } from "../ComplexVectorSpace";
import type { ComplexWeight } from "../ComplexWeight";
import type { ProjectiveComplexVectorSpace } from "../ProjectiveComplexVectorSpace";
import type { ProjectiveRealVectorSpace } from "../ProjectiveRealVectorSpace";
import type { RealVectorSpace } from "../RealVectorSpace";
import type { IdentifiableVectorSpace } from "./VectorSpaceInterfaces";
import type { Weight } from "../Weight";
import type { ComplexVectorOfDimension, ProjectiveComplexVectorOfDimension, ProjectiveRealVectorOfDimension, RealVectorOfDimension } from "../conditionalTypes/VectorDescriptorTypes";
import type { ComplexVectorDesc, ProjectiveComplexVectorDesc, ProjectiveRealVectorDesc, RealVectorDesc, VectorDesc } from "../utilityTypes/VectorDescriptorTypes";


/**
 * Core vector interface - all vector classes implement this
 */

export interface Vector <
        D extends number = number,
        VD extends VectorDesc = VectorDesc
    > {
    readonly dimension: D;
    readonly vectorType: string;
    readonly spaceType: VectorSpaceType;
    readonly vectorSpace: IdentifiableVectorSpace<VD>; // The vector space this vector belongs to
    readonly descriptor: VD;

    // Coordinate access
    readonly coordinates: readonly (number | Complex)[];
    getCoordinate(index: number): number | Complex;

    // Basic operations - now can be performed directly on vectors
    clone(): this;
    equals(other: Vector<D, VD>, tolerance?: number): boolean;
    add(other: Vector<D, VD>): this;
    subtract(other: Vector<D, VD>): this;
    scale(scalar: number | Complex): this;
    revert(): this;
    
    // Vector space operations
    norm(tolerance?: number): number;
    normalize(tolerance?: number): this;
    dot(other: Vector<D, VD>): number;
    isParallel(other: Vector<D, VD>, tolerance?: number): boolean;
    isOrthogonal(other: Vector<D, VD>, tolerance?: number): boolean;
    distanceTo(other: Vector<D, VD>): number;
    affineDistance(other: Vector<D, VD>): number;
    
    // Conversion utilities
    toArray(): readonly number[];
    toString(): string;
}


/**
 * Real vector specific interface
 */

export interface RealVector<D extends number = number, VD extends RealVectorDesc = RealVectorOfDimension<D>> 
    extends Vector<D, VD> 
    {
    readonly vectorSpace: RealVectorSpace<D, VD>;
    readonly spaceType: VectorSpaceType.REAL;
    readonly coordinates: readonly number[];
    // Real vector specific accessors
    readonly x?: number;
    readonly y?: number;
    readonly z?: number;
    readonly t?: number;
    getCoordinate(index: number): number;

    toProjectiveRealVector(projectiveRealVectorSpace?: ProjectiveRealVectorSpace<any>): ProjectiveRealVector<any>;
    toComplexVector(complexVectorSpace?: ComplexVectorSpace<any>): ComplexVector<any>;
    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): ProjectiveComplexVector<any>;
}

/**
 * Complex vector specific interface
 */

export interface ComplexVector<D extends number = number, VD extends ComplexVectorDesc = ComplexVectorOfDimension<D>> 
    extends Vector<D, VD> 
{
    readonly vectorSpace: ComplexVectorSpace<D, VD>;
    readonly spaceType: VectorSpaceType.COMPLEX;
    readonly coordinates: readonly Complex[];
    // Complex vector specific accessors
    readonly real?: number;
    readonly imaginary?: number;
    getCoordinate(index: number): Complex;
    getReal(index: number): number;
    getImaginary(index: number): number;

    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): ProjectiveComplexVector<any>;
    toProjectiveRealVector(projectiveRealVectorSpace?: ProjectiveRealVectorSpace<any>): ProjectiveRealVector<any>;
}

/**
 * Projective vector specific interface
 */

export interface ProjectiveRealVector<D extends number = number, VD extends ProjectiveRealVectorDesc = ProjectiveRealVectorOfDimension<D>>
    extends Vector<D, VD> 
{
    readonly vectorSpace: ProjectiveRealVectorSpace<D, VD>;
    readonly spaceType: VectorSpaceType.PROJECTIVEREAL;
    readonly coordinates: readonly number[];
    readonly x: number;
    readonly y: number;
    readonly z?: number;
    readonly weight: Weight;
    readonly homogeneousCoordinates: readonly number[];
    getCoordinate(index: number): number;
    homogeneousTransform(tolerance?: number): this;

    toRealVector(vectorSpace?: RealVectorSpace<any>): RealVector<any>;
    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<any>): ProjectiveComplexVector<any>;
}

export interface ProjectiveComplexVector<D extends number = number, VD extends ProjectiveComplexVectorDesc = ProjectiveComplexVectorOfDimension<D>>
    extends Vector<D, VD>
{
    readonly vectorSpace: ProjectiveComplexVectorSpace<D, VD>;
    readonly spaceType: VectorSpaceType.PROJECTIVECOMPLEX;
    readonly coordinates: readonly Complex[];
    readonly weight: ComplexWeight;
    readonly homogeneousComplexCoordinates: readonly Complex[];
    
    // Projective-specific methods
    toComplexVector(vectorSpace?: ComplexVectorSpace<any>): ComplexVector<any>;
    // toRealVector(): IRealVector<any>;
}