import type { ProjectiveComplexVector, ProjectiveVector, ProjectiveVectorOfDimension, Real, RealVector } from "../../VectorSpaceConstructorInterface";
import type { WeightManager } from "../../WeightManager";

export interface IProjectiveVectorSpaceStrategy<D extends number> {
    getWeight(v: ProjectiveVector): Real;
    shareSameWeightManagement(v1: ProjectiveVector, v2: ProjectiveVector, weightManager: WeightManager): boolean;
    areSameDimension(v1: ProjectiveVector, v2: ProjectiveVector): boolean;
    isInVectorSpace(v: ProjectiveVector): v is ProjectiveVector;
    createVector(coordinates: Real[], weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    defaultVect(weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    add(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    scale(scalar: Real, v: ProjectiveVector, weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    subtract(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVectorOfDimension<D>;
    norm(a: ProjectiveVector): Real;
    clone(v: ProjectiveVector): ProjectiveVectorOfDimension<D>;
    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector;
    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector): ProjectiveComplexVector
}