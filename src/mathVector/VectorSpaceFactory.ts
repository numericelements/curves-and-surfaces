import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveRealVectorSpace } from "./ProjectiveRealVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import type { IdentifiableVectorSpace } from "./interfaces/VectorSpaceInterfaces";


export function createRealVectorSpace(dimension: 1, isDefault?: boolean): RealVectorSpace<1>;
export function createRealVectorSpace(dimension: 2, isDefault?: boolean): RealVectorSpace<2>;
export function createRealVectorSpace(dimension: 3, isDefault?: boolean): RealVectorSpace<3>;
export function createRealVectorSpace(dimension: 4, isDefault?: boolean): RealVectorSpace<4>;
export function createRealVectorSpace(dimension: number, isDefault?: boolean): RealVectorSpace<number>;
export function createRealVectorSpace(dimension: number, isDefault = false): RealVectorSpace<number> {
    return new RealVectorSpace(dimension, isDefault);
}

export function isRealVectorSpace <D extends number> (vectorSpace: IdentifiableVectorSpace<any> | undefined, dimension: D): vectorSpace is RealVectorSpace<D> {
    return vectorSpace instanceof RealVectorSpace && vectorSpace.dimension() === dimension;
}

export function isProjectiveRealVectorSpace <D extends number> (vectorSpace: IdentifiableVectorSpace<any> | undefined, dimension: D): vectorSpace is ProjectiveRealVectorSpace<D> {
    return vectorSpace instanceof ProjectiveRealVectorSpace&& vectorSpace.dimension() === dimension;
}

export function isComplexVectorSpace <D extends number> (vectorSpace: IdentifiableVectorSpace<any> | undefined, dimension: D): vectorSpace is ComplexVectorSpace<D> {
    return vectorSpace instanceof ComplexVectorSpace && vectorSpace.dimension() === dimension;
}

export function isProjectiveComplexVectorSpace <D extends number> (vectorSpace: IdentifiableVectorSpace<any> | undefined, dimension: D): vectorSpace is ProjectiveComplexVectorSpace<D> {
    return vectorSpace instanceof ProjectiveComplexVectorSpace && vectorSpace.dimension() === dimension;
}