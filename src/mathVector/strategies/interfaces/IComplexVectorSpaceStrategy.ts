import type { ComplexVector, ComplexVectorOfDimension, IComplex, IComplexWeight, ProjectiveComplexVector, RealVector } from "../../VectorSpaceConstructorInterface";

export interface IComplexVectorSpaceStrategy<D extends number> {
    areSameDimension(v1: ComplexVector, v2: ComplexVector): boolean;
    isInVectorSpace(v: ComplexVector): v is ComplexVector;
    createVector(coordinates: number[][]): ComplexVectorOfDimension<D>;
    defaultVect(): ComplexVectorOfDimension<D>;
    addDescriptors(a: ComplexVector, b: ComplexVector): ComplexVectorOfDimension<D>;
    scaleDescriptor(scalar: IComplex | number, vector: ComplexVector): ComplexVectorOfDimension<D>;
    subtractDescriptors(a: ComplexVector, b: ComplexVector): ComplexVectorOfDimension<D>;
    dotDescriptors(a: ComplexVector, b: ComplexVector): number;
    cloneVector(v: ComplexVector): ComplexVectorOfDimension<D>;
    normDescriptor(v: ComplexVector): number;
    // normalize(v: ComplexVector): ComplexVector;
    fromComplexVectorSpaceToRealVectorSpace(v: ComplexVector): RealVector;
    fromComplexVectorSpaceToProjectiveComplexVectorSpace(v: ComplexVector, weight: IComplexWeight): ProjectiveComplexVector
}