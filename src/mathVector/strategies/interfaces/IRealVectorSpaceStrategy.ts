import type { ComplexVector, ProjectiveVector, Real, RealVector, RealVectorOfDimension } from "../../VectorSpaceConstructorInterface";
import type { Weight } from "../../Weight";

export interface IRealVectorSpaceStrategy<D extends number>  {
    areSameDimension(v1: RealVector, v2: RealVector): boolean;
    isInVectorSpace(v: RealVector): v is RealVector;
    createVector(coordinates: Real[]): RealVectorOfDimension<D>;
    defaultVect(): RealVectorOfDimension<D>;
    addDescriptors(a: RealVector, b: RealVector): RealVectorOfDimension<D>;
    scaleDescriptor(scalar: Real, v: RealVector): RealVectorOfDimension<D>;
    subtractDescriptors(a: RealVector, b: RealVector): RealVectorOfDimension<D>;
    cloneVector(v: RealVector): RealVectorOfDimension<D>;
    normDescriptor(v: RealVector): number;
    normalizeRaw(v: RealVector): RealVector;
    crossProductRaw(a: RealVector, b: RealVector): RealVector;
    dotDescriptors(a: RealVector, b: RealVector): number;
    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVector, weight: Weight): ProjectiveVector;
    fromRealVectorSpaceToComplexVectorSpace(v: RealVector): ComplexVector
}