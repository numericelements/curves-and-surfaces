import type { ProjectiveComplexVector, ProjectiveVector, ProjectiveVectorOfDimension, Real, RealVector } from "../../VectorSpaceConstructorInterface";
import type { WeightManager } from "../../WeightManager";

export interface IProjectiveVectorSpaceStrategy<D extends number, V extends ProjectiveVector = ProjectiveVectorOfDimension<D>> {
    shareSameWeightManagement(v1: ProjectiveVector, v2: ProjectiveVector, weightManager: WeightManager): boolean;
    areSameDimension(v1: ProjectiveVector, v2: ProjectiveVector): boolean;
    isInVectorSpace(v: ProjectiveVector): v is ProjectiveVector;
    createVector(coordinates: readonly Real[], weightManager: WeightManager): V;
    defaultVect(weightManager: WeightManager): V;
    addDescriptors(a: V, b: V, weightManager: WeightManager): V;
    scaleDescriptor(scalar: Real, v: V, weightManager: WeightManager): V;
    subtractDescriptors(a: V, b: V, weightManager: WeightManager): V;
    normDescriptor(a: V): Real;
    cloneVector(v: V): V;
    fromProjectiveVectorSpaceToRealVectorSpace(v: V): RealVector;
    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: V): ProjectiveComplexVector
}