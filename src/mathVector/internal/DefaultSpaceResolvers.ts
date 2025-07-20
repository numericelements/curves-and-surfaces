/**
 * Internal module - exported within package but not exposed to consumers
 * @internal
 */

import { DefaultVectorSpaces } from './DefaultVectorSpaces';
import { VectorSpaceType } from '../../namedConstants/BSplineR1toRn';
import type { 
    VectorSpaceForType,
    RealVectorSpaceOfDimension,
    ComplexVectorSpaceOfDimension,
    ProjectiveRealVectorSpaceOfDimension,
    ProjectiveComplexVectorSpaceOfDimension,
    AnyVectorSpace
} from '../VectorSpaceTypes';

/**
 * Get default real vector space for given dimension
 * @internal
 */
export function getDefaultRealVectorSpace<D extends number>(dimension: D): RealVectorSpaceOfDimension<D> {
    return DefaultVectorSpaces.getInstance().getRealVectorSpace(dimension) as RealVectorSpaceOfDimension<D>;
}

/**
 * Get default complex vector space for given dimension
 * @internal
 */
export function getDefaultComplexVectorSpace<D extends number>(dimension: D): ComplexVectorSpaceOfDimension<D> {
    return DefaultVectorSpaces.getInstance().getComplexVectorSpace(dimension) as ComplexVectorSpaceOfDimension<D>;
}

/**
 * Get default projective real vector space for given dimension
 * @internal
 */
export function getDefaultProjectiveRealVectorSpace<D extends number>(dimension: D): ProjectiveRealVectorSpaceOfDimension<D> {
    return DefaultVectorSpaces.getInstance().getProjectiveVectorSpace(dimension) as ProjectiveRealVectorSpaceOfDimension<D>;
}

/**
 * Get default projective complex vector space for given dimension
 * @internal
 */
export function getDefaultProjectiveComplexVectorSpace<D extends number>(dimension: D): ProjectiveComplexVectorSpaceOfDimension<D> {
    return DefaultVectorSpaces.getInstance().getProjectiveComplexVectorSpace(dimension) as ProjectiveComplexVectorSpaceOfDimension<D>;
}

/**
 * Resolve default vector space based on type and dimension
 * @internal
 */
export function resolveDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.REAL, dimension: D): RealVectorSpaceOfDimension<D>;
export function resolveDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.COMPLEX, dimension: D): ComplexVectorSpaceOfDimension<D>;
export function resolveDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.PROJECTIVE, dimension: D): ProjectiveRealVectorSpaceOfDimension<D>;
export function resolveDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.PROJECTIVECOMPLEX, dimension: D): ProjectiveComplexVectorSpaceOfDimension<D>
export function resolveDefaultVectorSpace<VS extends VectorSpaceType, D extends number>(spaceType: VS, dimension: D): VectorSpaceForType<VS, D>;
export function resolveDefaultVectorSpace(spaceType: VectorSpaceType, dimension: number): AnyVectorSpace {
    switch (spaceType) {
        case VectorSpaceType.REAL:
            return getDefaultRealVectorSpace(dimension);
        case VectorSpaceType.COMPLEX:
            return getDefaultComplexVectorSpace(dimension);
        case VectorSpaceType.PROJECTIVE:
            return getDefaultProjectiveRealVectorSpace(dimension);
        case VectorSpaceType.PROJECTIVECOMPLEX:
            return getDefaultProjectiveComplexVectorSpace(dimension);
        default:
            throw new Error(`Unknown vector space type: ${spaceType}`);
    }
}