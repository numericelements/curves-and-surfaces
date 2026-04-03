import type { ComplexVector, ComplexVectorOfDimension, IComplex, IComplexWeight, ProjectiveComplexVector, RealVector } from "../../VectorSpaceConstructorInterface";

export interface IComplexVectorSpaceStrategy<D extends number, V extends ComplexVector = ComplexVectorOfDimension<D>> {
    areSameDimension(v1: ComplexVector, v2: ComplexVector): boolean;
    isInVectorSpace(v: ComplexVector): v is ComplexVector;
    createVector(coordinates: readonly (readonly number[])[]): V;
    defaultVect(): V;
    addDescriptors(a: V, b: V): V;
    scaleDescriptor(scalar: IComplex | number, vector: V): V;
    subtractDescriptors(a: V, b: V): V;
    dotDescriptors(a: V, b: V): number;
    cloneVector(v: V): V;
    normDescriptor(v: V): number;
    // normalize(v: ComplexVector): ComplexVector;
    fromComplexVectorSpaceToRealVectorSpace(v: V): RealVector;
    fromComplexVectorSpaceToProjectiveComplexVectorSpace(v: V, weight: IComplexWeight): ProjectiveComplexVector
}