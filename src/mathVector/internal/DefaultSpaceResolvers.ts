/**
 * Internal module - exported within package but not exposed to consumers
 * @internal
 */

import { DefaultVectorSpaces, SupportedVectorSpace } from './DefaultVectorSpaces';
import { VectorSpaceType } from '../../namedConstants/BSplineR1toRn';
import type { 
    VectorSpaceForType,
    RealVectorSpaceOfDimension,
    ComplexVectorSpaceOfDimension,
    ProjectiveRealVectorSpaceOfDimension,
    ProjectiveComplexVectorSpaceOfDimension,
    AnyVectorSpace
} from '../VectorSpaceTypes';
import { DEFAULT } from '../../namedConstants/VectorSpaceIdentifierManager';
import { sendErrorMessage, sendRangeErrorMessage } from '../VectorSpaceUtilities';
import { EM_DEFAULT_VECTOR_SPACE_ALREADY_REGISTERED, EM_INVALID_VECTOR_SPACE_DIMENSION, EM_INVALID_VECTOR_SPACE_TYPE } from '../../ErrorMessages/DefaultSpaceResolvers';
import type { ComplexVectorSpaceInterface, ProjectiveComplexVectorSpaceInterface, ProjectiveVectorSpaceInterface, RealVectorSpaceInterface } from '../IVectorSpace';
import { EM_NO_DEFAULT_COMPLEXVECTORSPACE_FOR_DIMENSION } from '../../ErrorMessages/ComplexVectorSpace';
import { EM_NO_DEFAULT_REALVECTORSPACE_FOR_DIMENSION } from '../../ErrorMessages/RealVectorSpace';
import { EM_NO_DEFAULT_PROJECTIVEVECTORSPACE_FOR_DIMENSION } from '../../ErrorMessages/ProjectiveVectorSpace';
import { EM_NO_DEFAULT_PROJECTIVECOMPLEXVECTORSPACE_FOR_DIMENSION } from '../../ErrorMessages/ProjectiveComplexVectorSpace';
import { RealVectorSpace } from '../RealVectorSpace';
import { ComplexVectorSpace } from '../ComplexVectorSpace';
import { ProjectiveVectorSpace } from '../ProjectiveVectorSpace';
import { ProjectiveComplexVectorSpace } from '../ProjectiveComplexVectorSpace';

/**
 * Get default real vector space for given dimension
 * @internal
 */
export function getDefaultRealVectorSpace(dimension: 1): RealVectorSpace<1>;
export function getDefaultRealVectorSpace(dimension: 2): RealVectorSpace<2>;
export function getDefaultRealVectorSpace(dimension: 3): RealVectorSpace<3>;
export function getDefaultRealVectorSpace(dimension: 4): RealVectorSpace<4>;
export function getDefaultRealVectorSpace<D extends number>(dimension: D): RealVectorSpace<D>;

export function getDefaultRealVectorSpace<D extends number>(dimension: D): RealVectorSpace<D> {
    try {
        return DefaultVectorSpaces.getInstance().getRealVectorSpace(dimension) as RealVectorSpace<D>;
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
export function getDefaultComplexVectorSpace(dimension: 1): ComplexVectorSpace<4>;
export function getDefaultComplexVectorSpace(dimension: 2): ComplexVectorSpace<4>;
export function getDefaultComplexVectorSpace<D extends number>(dimension: D): ComplexVectorSpace<D>;

export function getDefaultComplexVectorSpace<D extends number>(dimension: D): ComplexVectorSpace<D> {
    try {
        return DefaultVectorSpaces.getInstance().getComplexVectorSpace(dimension) as ComplexVectorSpace<D>;
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
export function getDefaultProjectiveRealVectorSpace(dimension: 3): ProjectiveVectorSpace<3>;
export function getDefaultProjectiveRealVectorSpace(dimension: 4): ProjectiveVectorSpace<4>;
export function getDefaultProjectiveRealVectorSpace<D extends number>(dimension: D): ProjectiveVectorSpace<D>;

export function getDefaultProjectiveRealVectorSpace<D extends number>(dimension: D): ProjectiveVectorSpace<D> {
    try {
        return DefaultVectorSpaces.getInstance().getProjectiveVectorSpace(dimension) as ProjectiveVectorSpace<D>;
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
export function getDefaultProjectiveComplexVectorSpace(dimension: 2): ProjectiveComplexVectorSpace<4>;
export function getDefaultProjectiveComplexVectorSpace<D extends number>(dimension: D): ProjectiveComplexVectorSpace<D>;

export function getDefaultProjectiveComplexVectorSpace<D extends number>(dimension: D): ProjectiveComplexVectorSpace<D> {
    try {
        return DefaultVectorSpaces.getInstance().getProjectiveComplexVectorSpace(dimension) as ProjectiveComplexVectorSpace<D>;
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
export function getDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.REAL, dimension: D): RealVectorSpace<D>;
export function getDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.COMPLEX, dimension: D): ComplexVectorSpace<D>;
export function getDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.PROJECTIVE, dimension: D): ProjectiveVectorSpace<D>;
export function getDefaultVectorSpace<D extends number>(spaceType: VectorSpaceType.PROJECTIVECOMPLEX, dimension: D): ProjectiveComplexVectorSpace<D>;

// export function getDefaultVectorSpace<VS extends VectorSpaceType, D extends number>(spaceType: VS, dimension: D): VectorSpaceForType<VS, D>;
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

export function resolveDefaultVectorSpace<D extends number>(vectorSpace: ComplexVectorSpaceInterface<D>): string;
export function resolveDefaultVectorSpace<D extends number>(vectorSpace: RealVectorSpaceInterface<D>): string;
export function resolveDefaultVectorSpace<D extends number>(vectorSpace: ProjectiveVectorSpaceInterface<D>): string;
export function resolveDefaultVectorSpace<D extends number>(vectorSpace: ProjectiveComplexVectorSpaceInterface<D>): string;
export function resolveDefaultVectorSpace(vectorSpace: SupportedVectorSpace): string {
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