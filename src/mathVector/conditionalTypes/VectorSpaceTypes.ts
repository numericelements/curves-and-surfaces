import type { RealVectorSpace } from '../RealVectorSpace';
import type { ComplexVectorSpace } from '../ComplexVectorSpace';
import type { ProjectiveRealVectorSpace } from '../ProjectiveRealVectorSpace';
import type { ProjectiveComplexVectorSpace } from '../ProjectiveComplexVectorSpace';
import { VectorSpaceType } from '../../namedConstants/BSplineR1toRn';

/**
 * Vector Space type mapping similar to VectorTypeForSpace
 */
export type VectorSpaceForType<VS extends VectorSpaceType, D extends number> =
    VS extends VectorSpaceType.REAL ? RealVectorSpaceOfDimension<D> :
    VS extends VectorSpaceType.COMPLEX ? ComplexVectorSpaceOfDimension<D> :
    VS extends VectorSpaceType.PROJECTIVEREAL ? ProjectiveRealVectorSpaceOfDimension<D> :
    VS extends VectorSpaceType.PROJECTIVECOMPLEX ? ProjectiveComplexVectorSpaceOfDimension<D> :
    never;

/**
 * Real Vector Space type by dimension
 */
export type RealVectorSpaceOfDimension<D extends number> = 
    D extends 1 ? RealVectorSpace<1> :
    D extends 2 ? RealVectorSpace<2> :
    D extends 3 ? RealVectorSpace<3> :
    D extends 4 ? RealVectorSpace<4> :
    RealVectorSpace<D>;

/**
 * Complex Vector Space type by dimension
 */
export type ComplexVectorSpaceOfDimension<D extends number> = 
    D extends 1 ? ComplexVectorSpace<1> :
    D extends 2 ? ComplexVectorSpace<2> :
    ComplexVectorSpace<D>;

/**
 * Projective Real Vector Space type by dimension
 */
export type ProjectiveRealVectorSpaceOfDimension<D extends number> = 
    D extends 3 ? ProjectiveRealVectorSpace<3> :
    D extends 4 ? ProjectiveRealVectorSpace<4> :
    ProjectiveRealVectorSpace<D>;

/**
 * Projective Complex Vector Space type by dimension
 */
export type ProjectiveComplexVectorSpaceOfDimension<D extends number> = 
    D extends 2 ? ProjectiveComplexVectorSpace<2> :
    ProjectiveComplexVectorSpace<D>;

/**
 * Union type for all possible vector spaces
 */
export type AnyVectorSpace = 
    | RealVectorSpace<any>
    | ComplexVectorSpace<any>
    | ProjectiveRealVectorSpace<any>
    | ProjectiveComplexVectorSpace<any>;
