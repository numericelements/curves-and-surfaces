import type { ComplexDesc, ComplexWeightDesc } from "../VectorDescriptorConstructorInterface";
import type { ComplexVectorOfDimension, ProjectiveComplexVectorOfDimension, ProjectiveRealVectorOfDimension, RealVectorOfDimension } from "../conditionalTypes/VectorDescriptorTypes";
import type { Weight } from "../Weight";
import type { WeightManager } from "../WeightManager";
import type { ComplexVector1D, ComplexVectorDesc, ProjectiveComplexVectorDesc, ProjectiveRealVectorDesc, Real, RealVectorDesc } from "../utilityTypes/VectorDescriptorTypes";

export interface RealVectorSpaceStrategy<D extends number, RVD extends RealVectorDesc = RealVectorOfDimension<D>>  {

    readonly dimension: D;

    areSameDimension(v1: RealVectorDesc, v2: RealVectorDesc): boolean;
    isInVectorSpace(v: RealVectorDesc): v is RealVectorDesc;
    createVector(coordinates: readonly Real[]): RVD;
    defaultVect(): RVD;
    addDescriptors(a: RVD, b: RVD): RVD;
    scaleDescriptor(scalar: Real, v: RVD): RVD;
    subtractDescriptors(a: RVD, b: RVD): RVD;
    cloneVector(v: RVD): RVD;
    normDescriptor(v: RVD): number;
    normalizeDescriptor(v: RVD): RVD;
    crossProductRaw(a: RVD, b: RVD): RealVectorDesc;
    dotDescriptors(a: RVD, b: RVD): number;
    fromRealVectorSpaceToProjectiveRealVectorSpace(v: RVD, weight: Weight): ProjectiveRealVectorDesc;
    fromRealVectorSpaceToComplexVectorSpace(v: RVD): ComplexVectorDesc
}

export interface ComplexVectorSpaceStrategy<D extends number, CVD extends ComplexVectorDesc = ComplexVectorOfDimension<D>> {

    areSameDimension(v1: ComplexVectorDesc, v2: ComplexVectorDesc): boolean;
    isInVectorSpace(v: ComplexVectorDesc): v is ComplexVectorDesc;
    createVector(coordinates: readonly (readonly number[])[]): CVD;
    defaultVect(): CVD;
    addDescriptors(a: CVD, b: CVD): CVD;
    scaleDescriptor(scalar: ComplexDesc | number, vector: CVD): CVD;
    subtractDescriptors(a: CVD, b: CVD): CVD;
    dotDescriptors(a: CVD, b: CVD): number;
    cloneVector(v: CVD): CVD;
    normDescriptor(v: CVD): number;
    // normalize(v: ComplexVector): ComplexVector;
    fromComplexVectorSpaceToRealVectorSpace(v: CVD): RealVectorDesc;
    fromComplexVectorSpaceToProjectiveComplexVectorSpace(v: CVD, weight: ComplexWeightDesc): ProjectiveComplexVectorDesc
}

export interface ProjectiveRealVectorSpaceStrategy<D extends number, PRVD extends ProjectiveRealVectorDesc = ProjectiveRealVectorOfDimension<D>> {

    shareSameWeightManagement(v1: ProjectiveRealVectorDesc, v2: ProjectiveRealVectorDesc, weightManager: WeightManager): boolean;
    areSameDimension(v1: ProjectiveRealVectorDesc, v2: ProjectiveRealVectorDesc): boolean;
    isInVectorSpace(v: ProjectiveRealVectorDesc): v is ProjectiveRealVectorDesc;
    createVector(coordinates: readonly Real[], weightManager: WeightManager): PRVD;
    defaultVect(weightManager: WeightManager): PRVD;
    addDescriptors(a: PRVD, b: PRVD, weightManager: WeightManager): PRVD;
    scaleDescriptor(scalar: Real, v: PRVD, weightManager: WeightManager): PRVD;
    subtractDescriptors(a: PRVD, b: PRVD, weightManager: WeightManager): PRVD;
    normDescriptor(a: PRVD): Real;
    cloneVector(v: PRVD): PRVD;
    fromProjectiveRealVectorSpaceToRealVectorSpace(v: PRVD): RealVectorDesc;
    fromProjectiveRealVectorSpaceToProjectiveComplexVectorSpace(v: PRVD): ProjectiveComplexVectorDesc
}

export interface ProjectiveComplexVectorSpaceStrategy<D extends number, PCVD extends ProjectiveComplexVectorDesc = ProjectiveComplexVectorOfDimension<D>> {

    getWeight(v: PCVD): ComplexWeightDesc;
    shareSameWeightManagement(v1: ProjectiveComplexVectorDesc, v2: ProjectiveComplexVectorDesc, weightManager: WeightManager): boolean;
    areSameDimension(v1: ProjectiveComplexVectorDesc, v2: ProjectiveComplexVectorDesc): boolean;
    isInVectorSpace(v: ProjectiveComplexVectorDesc): v is ProjectiveComplexVectorDesc;
    createVector(coordinates: readonly Real[], weightManager: WeightManager): PCVD;
    defaultVect(weightManager: WeightManager): PCVD;
    addDescriptors(a: PCVD, b: PCVD, weightManager: WeightManager): PCVD;
    scaleDescriptor(scalar: ComplexDesc | number, v: PCVD, weightManager: WeightManager): PCVD;
    subtractDescriptors(a: PCVD, b: PCVD, weightManager: WeightManager): PCVD;
    normDescriptor(a: PCVD): Real;
    cloneVector(v: PCVD, weightManager: WeightManager): PCVD;
    fromProjectiveComplexVectorSpaceToComplexVectorSpace(v: PCVD, weightManager: WeightManager): ComplexVector1D;
}