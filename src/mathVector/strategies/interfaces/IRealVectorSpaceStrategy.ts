import type { ComplexVector, ProjectiveVector, Real, RealVector, RealVectorOfDimension } from "../../VectorSpaceConstructorInterface";
import type { Weight } from "../../Weight";

export interface IRealVectorSpaceStrategy<D extends number>  {

    readonly dimension: D;

    areSameDimension(v1: RealVector, v2: RealVector): boolean;
    isInVectorSpace(v: RealVector): v is RealVector;
    createVector(coordinates: Real[]): RealVectorOfDimension<D>;
    defaultVect(): RealVectorOfDimension<D>;
    addDescriptors(a: RealVectorOfDimension<D>, b: RealVectorOfDimension<D>): RealVectorOfDimension<D>;
    scaleDescriptor(scalar: Real, v: RealVectorOfDimension<D>): RealVectorOfDimension<D>;
    subtractDescriptors(a: RealVectorOfDimension<D>, b: RealVectorOfDimension<D>): RealVectorOfDimension<D>;
    cloneVector(v: RealVectorOfDimension<D>): RealVectorOfDimension<D>;
    normDescriptor(v: RealVectorOfDimension<D>): number;
    normalizeDescriptor(v: RealVectorOfDimension<D>): RealVectorOfDimension<D>;
    crossProductRaw(a: RealVectorOfDimension<D>, b: RealVectorOfDimension<D>): RealVector;
    dotDescriptors(a: RealVectorOfDimension<D>, b: RealVectorOfDimension<D>): number;
    fromRealVectorSpaceToProjectiveVectorSpace(v: RealVectorOfDimension<D>, weight: Weight): ProjectiveVector;
    fromRealVectorSpaceToComplexVectorSpace(v: RealVectorOfDimension<D>): ComplexVector
}