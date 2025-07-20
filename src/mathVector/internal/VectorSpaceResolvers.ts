/**
 * Internal module - exported within package but not exposed to consumers
 * @internal
 */

import { VectorSpaceType } from '../../namedConstants/BSplineR1toRn';
import type { 
    RealVectorSpaceOfDimension,
    ComplexVectorSpaceOfDimension,
    ProjectiveRealVectorSpaceOfDimension,
    ProjectiveComplexVectorSpaceOfDimension,
    AnyVectorSpace
} from '../VectorSpaceTypes';
import { VectorSpaceIdentifierManager } from './VectorSpaceIdentifierManager';
import { resolveDefaultVectorSpace } from './DefaultSpaceResolvers';
import { DEFAULT_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME, DEFAULT_REAL_VECTOR_SPACE_NAME } from '../../namedConstants/DefaultVectorSpaces';
import { RealVectorSpace } from '../RealVectorSpace';
import { IdentifiableVectorSpace } from '../VectorSpaceConstructorInterface';
import { VECTOR_SPACE } from '../../namedConstants/VectorSpaceIdentifierManager';
import { ComplexVectorSpace } from '../ComplexVectorSpace';
import { ProjectiveVectorSpace } from '../ProjectiveVectorSpace';
import { ProjectiveComplexVectorSpace } from '../ProjectiveComplexVectorSpace';
import { COMPLEX_VECTOR_SPACE_NAME, PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME, PROJECTIVE_VECTOR_SPACE_NAME, REAL_VECTOR_SPACE_NAME } from '../../namedConstants/VectorSpaceResolvers';

/**
 * Get default real vector space for given dimension
 * @internal
 */
export function getRealVectorSpace<D extends number>(dimension: D, realVS: RealVectorSpace<D>): RealVectorSpaceOfDimension<D> {
    return VectorSpaceIdentifierManager.getInstance().getRealVectorSpace(dimension, realVS) as RealVectorSpaceOfDimension<D>;
}

/**
 * Get default complex vector space for given dimension
 * @internal
 */
export function getComplexVectorSpace<D extends number>(dimension: D, complexVS: ComplexVectorSpace<D>): ComplexVectorSpaceOfDimension<D> {
    return VectorSpaceIdentifierManager.getInstance().getComplexVectorSpace(dimension, complexVS) as ComplexVectorSpaceOfDimension<D>;
}

/**
 * Get default projective real vector space for given dimension
 * @internal
 */
export function getProjectiveRealVectorSpace<D extends number>(dimension: D, projectiveVS: ProjectiveVectorSpace<D>): ProjectiveRealVectorSpaceOfDimension<D> {
    return VectorSpaceIdentifierManager.getInstance().getProjectiveRealVectorSpace(dimension, projectiveVS) as ProjectiveRealVectorSpaceOfDimension<D>;
}

/**
 * Get default projective complex vector space for given dimension
 * @internal
 */
export function getProjectiveComplexVectorSpace<D extends number>(dimension: D, projectiveComplexVS: ProjectiveComplexVectorSpace<D>): ProjectiveComplexVectorSpaceOfDimension<D> {
    return VectorSpaceIdentifierManager.getInstance().getProjectiveComplexVectorSpace(dimension, projectiveComplexVS) as ProjectiveComplexVectorSpaceOfDimension<D>;
}

/**
 * Resolve default vector space based on type and dimension
 * @internal
 */

export function resolveVectorSpace(dimension: number, vectorSpace: IdentifiableVectorSpace<any, any>,  isDefault: boolean, id?: string, name?: string): {id: string, name: string} {
    let vsId = "";
    const idManager = VectorSpaceIdentifierManager.getInstance();
    if (isDefault) {
        if(id === undefined) {
            vsId = idManager.getDefaultSpaceId(vectorSpace.spaceType, dimension);
        } else {
            vsId = id;
        }
        switch(vectorSpace.spaceType) {
            case VectorSpaceType.REAL:
                const nameVS = name || DEFAULT_REAL_VECTOR_SPACE_NAME + dimension.toString();
                return {id: vsId, name: nameVS};
            case VectorSpaceType.COMPLEX:
                const nameVS1 = name || DEFAULT_COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
                return {id: vsId, name: nameVS1};
            case VectorSpaceType.PROJECTIVE:
                const nameVS2 = name || DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + dimension.toString();
                return {id: vsId, name: nameVS2};
            case VectorSpaceType.PROJECTIVECOMPLEX:
                const nameVS3 = name || DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
                return {id: vsId, name: nameVS3};
            default:
                const error = new Error(`Vector space type ${vectorSpace.spaceType} is not supported`);
                throw error;
        }
    } else {
        if(id === undefined) {
            vsId = idManager.generateId();
            const string = vsId.split(VECTOR_SPACE);
            const index = string[string.length - 1].split("_");
            idManager.registerVectorSpace(vectorSpace, Number(index[0]));
            vsId = `${vectorSpace.spaceType}_${dimension}_` + vsId;
        } else {
            vsId = id;
        }
        switch(vectorSpace.spaceType) {
            case VectorSpaceType.REAL:
                const nameVS = name || REAL_VECTOR_SPACE_NAME + dimension.toString();
                return {id: vsId, name: nameVS};
            case VectorSpaceType.PROJECTIVE:
                const nameVS1 = name || PROJECTIVE_VECTOR_SPACE_NAME + dimension.toString();
                return {id: vsId, name: nameVS1};
            case VectorSpaceType.COMPLEX:
                const nameVS2 = name || COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
                return {id: vsId, name: nameVS2};
            case VectorSpaceType.PROJECTIVECOMPLEX:
                const nameVS3 = name || PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
                return {id: vsId, name: nameVS3};
            default:
                const error = new Error(`Vector space type ${vectorSpace.spaceType} is not supported`);
                throw error;
        }
    }
}