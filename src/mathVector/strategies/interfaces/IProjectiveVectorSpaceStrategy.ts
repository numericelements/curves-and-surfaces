import type { ProjectiveComplexVector, ProjectiveVector, ProjectiveVectorOfDimension, Real, RealVector } from "../../VectorSpaceConstructorInterface";
import type { WeightManager } from "../../WeightManager";

export interface IProjectiveVectorSpaceStrategy<D extends number> {
    shareSameWeightManagement(v1: ProjectiveVector, v2: ProjectiveVector, weightManager: WeightManager): boolean;
    areSameDimension(v1: ProjectiveVector, v2: ProjectiveVector): boolean;
    isInVectorSpace(v: ProjectiveVector): v is ProjectiveVector;
    createVector(coordinates: Real[], weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    defaultVect(weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    addDescriptors(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    scaleDescriptor(scalar: Real, v: ProjectiveVector, weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    subtractDescriptors(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    normDescriptor(a: ProjectiveVector): Real;
    cloneVector(v: ProjectiveVector): ProjectiveVectorOfDimension<D>;
    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector;
    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector): ProjectiveComplexVector
}