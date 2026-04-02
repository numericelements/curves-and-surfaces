import type { ComplexVector1D, IComplex, IComplexWeight, ProjectiveComplexVector, ProjectiveComplexVectorOfDimension, Real } from "../../VectorSpaceConstructorInterface";
import type { WeightManager } from "../../WeightManager";

export interface IProjectiveComplexVectorSpaceStrategy<D extends number, V extends ProjectiveComplexVector = ProjectiveComplexVectorOfDimension<D>> {
    getWeight(v: V): IComplexWeight;
    shareSameWeightManagement(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector, weightManager: WeightManager): boolean;
    areSameDimension(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector): boolean;
    isInVectorSpace(v: ProjectiveComplexVector): v is ProjectiveComplexVector;
    createVector(coordinates: Real[], weightManager: WeightManager): V;
    defaultVect(weightManager: WeightManager): V;
    addDescriptors(a: V, b: V, weightManager: WeightManager): V;
    scaleDescriptor(scalar: IComplex | number, v: V, weightManager: WeightManager): V;
    subtractDescriptors(a: V, b: V, weightManager: WeightManager): V;
    normDescriptor(a: V): Real;
    cloneVector(v: V, weightManager: WeightManager): V;
    fromProjectiveComplexVectorSpaceToComplexVectorSpace(v: V, weightManager: WeightManager): ComplexVector1D;
}