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
import type { ComplexVectorSpace } from '../ComplexVectorSpace';
import type { RealVectorSpace } from '../RealVectorSpace';
import type { ProjectiveVectorSpace } from '../ProjectiveVectorSpace';
import type { ProjectiveComplexVectorSpace } from '../ProjectiveComplexVectorSpace';
import { DEFAULT } from '../../namedConstants/VectorSpaceIdentifierManager';
import { sendErrorMessage, sendRangeErrorMessage } from '../VectorSpaceUtilities';
import { EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED, EM_INVALID_VECTOR_SPACE_DIMENSION, EM_INVALID_VECTOR_SPACE_TYPE } from '../../ErrorMessages/DefaultSpaceResolvers';
import type { IdentifiableVectorSpace } from '../IVectorSpace';
import { EM_NO_DEFAULT_COMPLEXVECTORSPACE_FOR_DIMENSION } from '../../ErrorMessages/ComplexVectorSpace';
import { EM_NO_DEFAULT_REALVECTORSPACE_FOR_DIMENSION } from '../../ErrorMessages/RealVectorSpace';
import { EM_NO_DEFAULT_PROJECTIVEVECTORSPACE_FOR_DIMENSION } from '../../ErrorMessages/ProjectiveVectorSpace';
import { EM_NO_DEFAULT_PROJECTIVECOMPLEXVECTORSPACE_FOR_DIMENSION } from '../../ErrorMessages/ProjectiveComplexVectorSpace';
import type { Vector } from '../VectorSpaceConstructorInterface';

/**
 * Get default real vector space for given dimension
 * @internal
 */
export function getDefaultRealVectorSpace<D extends number>(dimension: D): RealVectorSpaceOfDimension<D> {
    try {
        return DefaultVectorSpaces.getInstance().getRealVectorSpace(dimension) as RealVectorSpaceOfDimension<D>;
    } catch (error) {
        if(error instanceof RangeError && error.message.includes(EM_NO_DEFAULT_REALVECTORSPACE_FOR_DIMENSION)) {
            const errorMessage = sendRangeErrorMessage('getDefaultRealVectorSpace', 'getDefaultRealVectorSpace', EM_NO_DEFAULT_REALVECTORSPACE_FOR_DIMENSION);
            throw new RangeError(errorMessage.generateMessageString());
        }
        const errorMessage = sendRangeErrorMessage('getDefaultRealVectorSpace', 'getDefaultRealVectorSpace', EM_INVALID_VECTOR_SPACE_DIMENSION);
        throw new RangeError(errorMessage.generateMessageString());
    }
}

/**
 * Get default complex vector space for given dimension
 * @internal
 */
export function getDefaultComplexVectorSpace<D extends number>(dimension: D): ComplexVectorSpaceOfDimension<D> {
    try {
        return DefaultVectorSpaces.getInstance().getComplexVectorSpace(dimension) as ComplexVectorSpaceOfDimension<D>;
    } catch (error) {
        if(error instanceof RangeError && error.message.includes(EM_NO_DEFAULT_COMPLEXVECTORSPACE_FOR_DIMENSION)) {
            const errorMessage = sendRangeErrorMessage('getDefaultComplexVectorSpace', 'getDefaultComplexVectorSpace', EM_NO_DEFAULT_COMPLEXVECTORSPACE_FOR_DIMENSION);
            throw new RangeError(errorMessage.generateMessageString());
        }
        const errorMessage = sendRangeErrorMessage('getDefaultComplexVectorSpace', 'getDefaultComplexVectorSpace', EM_INVALID_VECTOR_SPACE_DIMENSION);
        throw new RangeError(errorMessage.generateMessageString());
    }
}

/**
 * Get default projective real vector space for given dimension
 * @internal
 */
export function getDefaultProjectiveRealVectorSpace<D extends number>(dimension: D): ProjectiveRealVectorSpaceOfDimension<D> {
    try {
        return DefaultVectorSpaces.getInstance().getProjectiveVectorSpace(dimension) as ProjectiveRealVectorSpaceOfDimension<D>;
    } catch (error) {
        if(error instanceof RangeError && error.message.includes(EM_NO_DEFAULT_PROJECTIVEVECTORSPACE_FOR_DIMENSION)) {
            const errorMessage = sendRangeErrorMessage('getDefaultProjectiveRealVectorSpace', 'getDefaultProjectiveRealVectorSpace', EM_NO_DEFAULT_PROJECTIVEVECTORSPACE_FOR_DIMENSION);
            throw new RangeError(errorMessage.generateMessageString());
        }
        const errorMessage = sendRangeErrorMessage('getDefaultProjectiveRealVectorSpace', 'getDefaultProjectiveRealVectorSpace', EM_INVALID_VECTOR_SPACE_DIMENSION);
        throw new RangeError(errorMessage.generateMessageString());
    }
}

/**
 * Get default projective complex vector space for given dimension
 * @internal
 */
export function getDefaultProjectiveComplexVectorSpace<D extends number>(dimension: D): ProjectiveComplexVectorSpaceOfDimension<D> {
    try {
        return DefaultVectorSpaces.getInstance().getProjectiveComplexVectorSpace(dimension) as ProjectiveComplexVectorSpaceOfDimension<D>;
    } catch (error) {
        if(error instanceof RangeError && error.message.includes(EM_NO_DEFAULT_PROJECTIVECOMPLEXVECTORSPACE_FOR_DIMENSION)) {
            const errorMessage = sendRangeErrorMessage('getDefaultProjectiveComplexVectorSpace', 'getDefaultProjectiveComplexVectorSpace', EM_NO_DEFAULT_PROJECTIVECOMPLEXVECTORSPACE_FOR_DIMENSION);
            throw new RangeError(errorMessage.generateMessageString());
        }
        const errorMessage = sendRangeErrorMessage('getDefaultProjectiveComplexVectorSpace', 'getDefaultProjectiveComplexVectorSpace', EM_INVALID_VECTOR_SPACE_DIMENSION);
        throw new RangeError(errorMessage.generateMessageString());
    }
}

/**
 * Get a default vector space based on type and dimension
 * @internal
 */
export function getDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.REAL, dimension: D): RealVectorSpaceOfDimension<D>;
export function getDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.COMPLEX, dimension: D): ComplexVectorSpaceOfDimension<D>;
export function getDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.PROJECTIVE, dimension: D): ProjectiveRealVectorSpaceOfDimension<D>;
export function getDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.PROJECTIVECOMPLEX, dimension: D): ProjectiveComplexVectorSpaceOfDimension<D>;
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
        default: {
            const error = sendRangeErrorMessage('getDefaultVectorSpace', 'getDefaultVectorSpace', EM_INVALID_VECTOR_SPACE_TYPE);
            throw new RangeError(error.generateMessageString());
        }
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
export function resolveDefaultVectorSpace(vectorSpace: IdentifiableVectorSpace<Vector>): string {
    let defltVsId = "";
    const defaultSpaces = DefaultVectorSpaces.getInstance();
    if (!defaultSpaces.registerVectorSpace(vectorSpace)) {
        // VS already registered
        const message = EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED + `: type=${vectorSpace.spaceType}, dimension=${vectorSpace.dimension()}`;
        const error = sendErrorMessage('resolveDefaultVectorSpace', 'resolveDefaultVectorSpace', message);
        throw new Error(error.generateMessageString());
    }
    defltVsId = DEFAULT + `${vectorSpace.spaceType}_${vectorSpace.dimension()}_` + defaultSpaces.generateId();
    return defltVsId;
}