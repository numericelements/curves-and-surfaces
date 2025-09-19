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
import { ComplexVectorSpace } from '../ComplexVectorSpace';
import { RealVectorSpace } from '../RealVectorSpace';
import { ProjectiveVectorSpace } from '../ProjectiveVectorSpace';
import { ProjectiveComplexVectorSpace } from '../ProjectiveComplexVectorSpace';
import { IdentifiableVectorSpace } from '../VectorSpaceConstructorInterface';
import { DEFAULT } from '../../namedConstants/VectorSpaceIdentifierManager';

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

export function getDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.REAL, dimension: D): RealVectorSpaceOfDimension<D>;
export function getDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.COMPLEX, dimension: D): ComplexVectorSpaceOfDimension<D>;
export function getDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.PROJECTIVE, dimension: D): ProjectiveRealVectorSpaceOfDimension<D>;
export function getDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.PROJECTIVECOMPLEX, dimension: D): ProjectiveComplexVectorSpaceOfDimension<D>
export function getDefaultVectorSpace<VS extends VectorSpaceType, D extends number>(spaceType: VS, dimension: D): VectorSpaceForType<VS, D>;
export function getDefaultVectorSpace(spaceType: VectorSpaceType, dimension: number): AnyVectorSpace {
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

/**
 * Resolve default vector space based on type and dimension
 * @internal
 */

export function resolveDefaultVectorSpace<D extends number>(vectorSpace: ComplexVectorSpace<D>): string;
export function resolveDefaultVectorSpace<D extends number>(vectorSpace: RealVectorSpace<D>): string;
export function resolveDefaultVectorSpace<D extends number>(vectorSpace: ProjectiveVectorSpace<D>): string;
export function resolveDefaultVectorSpace<D extends number>(vectorSpace: ProjectiveComplexVectorSpace<D>): string;
export function resolveDefaultVectorSpace(vectorSpace: IdentifiableVectorSpace<any, any>): string {
    let defltVsId = "";
    const defaultSpaces = DefaultVectorSpaces.getInstance();
    if (!defaultSpaces.registerVectorSpace(vectorSpace)) {
        // Already registered - get the ID
        throw new Error(`Vector space already registered: ${vectorSpace.id}`);
    }
    defltVsId = DEFAULT + `${vectorSpace.spaceType}_${vectorSpace.dimension()}_` + defaultSpaces.generateId();
    return defltVsId;
}