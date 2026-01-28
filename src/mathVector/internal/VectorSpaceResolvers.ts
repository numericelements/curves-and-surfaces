/**
 * Internal module - exported within package but not exposed to consumers
 * @internal
 */

import { VectorSpaceIdentifierManager } from './VectorSpaceIdentifierManager';
import { VectorSpaceType } from '../../namedConstants/BSplineR1toRn';
import { sendErrorMessage, sendRangeErrorMessage } from '../VectorSpaceUtilities';
import { EM_INVALID_VECTOR_SPACE_TYPE } from '../../ErrorMessages/DefaultSpaceResolvers';
import { EM_VECTOR_SPACE_ALREADY_REGISTERED } from '../../ErrorMessages/VectorSpaceResolvers';
import type { ComplexVectorSpaceInterface, ProjectiveComplexVectorSpaceInterface, ProjectiveVectorSpaceInterface, RealVectorSpaceInterface } from '../IVectorSpace';
import { SupportedVectorSpace } from './DefaultVectorSpaces';

/**
 * Register a real vector space for given dimension if not already registered
 * @internal
 */
export function isRegisteredRealVectorSpace<D extends number>(realVS: RealVectorSpaceInterface<D>): boolean {
    const registered = !VectorSpaceIdentifierManager.getInstance().registerRealVectorSpace(realVS);
    return registered;
}

/**
 * Register a complex vector space for given dimension if not already registered
 * @internal
 */
export function isRegisteredComplexVectorSpace<D extends number>(complexVS: ComplexVectorSpaceInterface<D>): boolean {
    const registered = !VectorSpaceIdentifierManager.getInstance().registerComplexVectorSpace(complexVS);
    return registered;
}

/**
 * Register a projective real vector space for given dimension if not already registered
 * @internal
 */
export function isRegisteredProjectiveRealVectorSpace<D extends number>(projectiveVS: ProjectiveVectorSpaceInterface<D>): boolean {
    const registered = !VectorSpaceIdentifierManager.getInstance().registerProjectiveRealVectorSpace(projectiveVS);
    return registered;
}

/**
 * Register a projective complex vector space for given dimension if not already registered
 * @internal
 */
export function isRegisteredProjectiveComplexVectorSpace<D extends number>(projectiveComplexVS: ProjectiveComplexVectorSpaceInterface<D>): boolean {
    const registered = !VectorSpaceIdentifierManager.getInstance().registerProjectiveComplexVectorSpace(projectiveComplexVS);
    return registered;
}

/**
 * Register a vector space based on type and dimension
 * @internal
 */
export function isRegisteredVectorSpace(vectorSpace: SupportedVectorSpace): boolean {
    switch (vectorSpace.spaceType) {
        case VectorSpaceType.REAL:
            return isRegisteredRealVectorSpace(vectorSpace);
        case VectorSpaceType.COMPLEX:
            return isRegisteredComplexVectorSpace(vectorSpace);
        case VectorSpaceType.PROJECTIVE:
            return isRegisteredProjectiveRealVectorSpace(vectorSpace);
        case VectorSpaceType.PROJECTIVECOMPLEX:
            return isRegisteredProjectiveComplexVectorSpace(vectorSpace);
        default: {
            const error = sendRangeErrorMessage('isRegisteredVectorSpace', 'isRegisteredVectorSpace', EM_INVALID_VECTOR_SPACE_TYPE);
            throw new RangeError(error.generateMessageString());
        }
    }
}

/**
 * Resolve vector space based on type and dimension to generate a unique identifier
 * @internal
 */
export function resolveVectorSpace(vectorSpace: SupportedVectorSpace): string {
    let vsId = "";
    const idManager = VectorSpaceIdentifierManager.getInstance();
    if(isRegisteredVectorSpace(vectorSpace)) {
        const message = EM_VECTOR_SPACE_ALREADY_REGISTERED + `: type=${vectorSpace.spaceType}, dimension=${vectorSpace.dimension()}`;
        const error = sendErrorMessage('resolveVectorSpace', 'resolveVectorSpace', message);
        throw new Error(error.generateMessageString());
    }
    idManager.registerVectorSpace(vectorSpace);
    vsId = `${vectorSpace.spaceType}_${vectorSpace.dimension()}_` + idManager.generateId();
    return vsId;
}