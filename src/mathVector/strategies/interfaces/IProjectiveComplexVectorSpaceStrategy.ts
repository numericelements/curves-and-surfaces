import type { ComplexVector1D, IComplex, IComplexWeight, ProjectiveComplexVector, ProjectiveComplexVectorOfDimension, Real } from "../../VectorSpaceConstructorInterface";
import type { WeightManager } from "../../WeightManager";

export interface IProjectiveComplexVectorSpaceStrategy<D extends number> {
    getWeight(v: ProjectiveComplexVector): IComplexWeight;
    shareSameWeightManagement(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector, weightManager: WeightManager): boolean;
    areSameDimension(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector): boolean;
    isInVectorSpace(v: ProjectiveComplexVector): v is ProjectiveComplexVector;
    createVector(coordinates: Real[], weightManager: WeightManager): ProjectiveComplexVectorOfDimension<D>;
    defaultVect(weightManager: WeightManager): ProjectiveComplexVectorOfDimension<D>;
    add(a: ProjectiveComplexVector, b: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVectorOfDimension<D>;
    scale(scalar: IComplex | number, v: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVectorOfDimension<D>;
    subtract(a: ProjectiveComplexVector, b: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVectorOfDimension<D>;
    norm(a: ProjectiveComplexVector): Real;
    clone(v: ProjectiveComplexVector, weightManager: WeightManager): ProjectiveComplexVectorOfDimension<D>;
    fromProjectiveComplexVectorSpaceToComplexVectorSpace(v: ProjectiveComplexVector, weightManager: WeightManager): ComplexVector1D;
}