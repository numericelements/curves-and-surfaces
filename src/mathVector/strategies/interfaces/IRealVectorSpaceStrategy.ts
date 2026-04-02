import type { ComplexVector, ProjectiveVector, Real, RealVector, RealVectorOfDimension } from "../../VectorSpaceConstructorInterface";
import type { Weight } from "../../Weight";

export interface IRealVectorSpaceStrategy<D extends number, V extends RealVector = RealVectorOfDimension<D>>  {

    readonly dimension: D;

    areSameDimension(v1: RealVector, v2: RealVector): boolean;
    isInVectorSpace(v: RealVector): v is RealVector;
    createVector(coordinates: Real[]): V;
    defaultVect(): V;
    addDescriptors(a: V, b: V): V;
    scaleDescriptor(scalar: Real, v: V): V;
    subtractDescriptors(a: V, b: V): V;
    cloneVector(v: V): V;
    normDescriptor(v: V): number;
    normalizeDescriptor(v: V): V;
    crossProductRaw(a: V, b: V): RealVector;
    dotDescriptors(a: V, b: V): number;
    fromRealVectorSpaceToProjectiveVectorSpace(v: V, weight: Weight): ProjectiveVector;
    fromRealVectorSpaceToComplexVectorSpace(v: V): ComplexVector
}