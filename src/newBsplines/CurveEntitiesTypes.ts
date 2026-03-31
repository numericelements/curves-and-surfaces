import { IComplexVector, IProjectiveComplexVector, IProjectiveVector, IRealVector, IVector } from "../mathVector/Vector";
import { ComplexVector, ProjectiveComplexVector, ProjectiveVector, RealVector, Vector } from "../mathVector/VectorSpaceConstructorInterface";

// newBsplines/CurveEntitiesTypes.ts
/**
 * Maps the descriptor type V to the precise vector interface.
 * When V is concrete at a call site, TypeScript resolves the conditional
 * and getCoordinate() / coordinates return the exact scalar type.
 */
export type CurvePoint<V extends Vector, D extends number> =
    V extends RealVector              ? IRealVector<D> :
    V extends ProjectiveVector        ? IProjectiveVector<D> :
    V extends ComplexVector           ? IComplexVector<D> :
    V extends ProjectiveComplexVector ? IProjectiveComplexVector<D> :
    IVector<D, V>;

export type ControlPoint<V extends Vector, D extends number> = CurvePoint<V, D>;
// Domain-specific narrowed forms:
export type RealControlPoint<D extends number>              = IRealVector<D>;
export type ComplexControlPoint<D extends number>           = IComplexVector<D>;
export type ProjectiveRealControlPoint<D extends number>       = IProjectiveVector<D>;
export type ProjectiveComplexControlPoint<D extends number>    = IProjectiveComplexVector<D>;

// Narrowed types for distinction between R1toRn curves and R1toR1 curves:
export type RealVectorN = Exclude<RealVector, number>;