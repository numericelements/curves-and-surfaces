import { ComplexVector, ProjectiveComplexVector, ProjectiveRealVector, RealVector, Vector } from "../mathVector/interfaces/VectorInterfaces";
import { ComplexVectorDesc, ProjectiveComplexVectorDesc, ProjectiveRealVectorDesc, RealVectorDesc, VectorDesc } from "../mathVector/utilityTypes/VectorDescriptorTypes";

// newBsplines/CurveEntitiesTypes.ts
/**
 * Maps the descriptor type V to the precise vector interface.
 * When V is concrete at a call site, TypeScript resolves the conditional
 * and getCoordinate() / coordinates return the exact scalar type.
 */
export type CurvePoint<V extends VectorDesc, D extends number> =
    V extends RealVectorDesc              ? RealVector<D> :
    V extends ProjectiveRealVectorDesc        ? ProjectiveRealVector<D> :
    V extends ComplexVectorDesc           ? ComplexVector<D> :
    V extends ProjectiveComplexVectorDesc ? ProjectiveComplexVector<D> :
    Vector<D, V>;

export type ControlPoint<V extends VectorDesc, D extends number> = CurvePoint<V, D>;
// Domain-specific narrowed forms:
export type RealControlPoint<D extends number>              = RealVector<D>;
export type ComplexControlPoint<D extends number>           = ComplexVector<D>;
export type ProjectiveRealControlPoint<D extends number>       = ProjectiveRealVector<D>;
export type ProjectiveComplexControlPoint<D extends number>    = ProjectiveComplexVector<D>;

// Narrowed types for distinction between R1toRn curves and R1toR1 curves:
export type RealVectorN = Exclude<RealVectorDesc, number>;