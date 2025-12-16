/**
 * Internal module - exported within package but not exposed to consumers
 * @internal
 */

import { VectorSpaceIdentifierManager } from './VectorSpaceIdentifierManager';
import { RealVectorSpace } from '../RealVectorSpace';
import { Scalar, Vector } from '../VectorSpaceConstructorInterface';
import { ComplexVectorSpace } from '../ComplexVectorSpace';
import { ProjectiveVectorSpace } from '../ProjectiveVectorSpace';
import { ProjectiveComplexVectorSpace } from '../ProjectiveComplexVectorSpace';
import { VectorSpaceType } from '../../namedConstants/BSplineR1toRn';
import { sendErrorMessage, sendRangeErrorMessage } from '../VectorSpaceUtilities';
import { EM_INVALID_VECTOR_SPACE_TYPE } from '../../ErrorMessages/DefaultSpaceResolvers';
import { EM_VECTOR_SPACE_ALREADY_REGISTERED } from '../../ErrorMessages/VectorSpaceResolvers';
import { IdentifiableVectorSpace } from '../Vector';

/**
 * Register a real vector space for given dimension if not already registered
 * @internal
 */
export function isRegisteredRealVectorSpace<D extends number>(realVS: RealVectorSpace<D>): boolean {
    const registered = !VectorSpaceIdentifierManager.getInstance().registerRealVectorSpace(realVS);
    return registered;
}

/**
 * Register a complex vector space for given dimension if not already registered
 * @internal
 */
export function isRegisteredComplexVectorSpace<D extends number>(complexVS: ComplexVectorSpace<D>): boolean {
    const registered = !VectorSpaceIdentifierManager.getInstance().registerComplexVectorSpace(complexVS);
    return registered;
}

/**
 * Register a projective real vector space for given dimension if not already registered
 * @internal
 */
export function isRegisteredProjectiveRealVectorSpace<D extends number>(projectiveVS: ProjectiveVectorSpace<D>): boolean {
    const registered = !VectorSpaceIdentifierManager.getInstance().registerProjectiveRealVectorSpace(projectiveVS);
    return registered;
}

/**
 * Register a projective complex vector space for given dimension if not already registered
 * @internal
 */
export function isRegisteredProjectiveComplexVectorSpace<D extends number>(projectiveComplexVS: ProjectiveComplexVectorSpace<D>): boolean {
    const registered = !VectorSpaceIdentifierManager.getInstance().registerProjectiveComplexVectorSpace(projectiveComplexVS);
    return registered;
}

/**
 * Register a vector space based on type and dimension
 * @internal
 */
export function isRegisteredVectorSpace<D extends number>(vectorSpace: ComplexVectorSpace<D>): boolean;
export function isRegisteredVectorSpace<D extends number>(vectorSpace: RealVectorSpace<D>): boolean;
export function isRegisteredVectorSpace<D extends number>(vectorSpace: ProjectiveVectorSpace<D>): boolean;
export function isRegisteredVectorSpace<D extends number>(vectorSpace: ProjectiveComplexVectorSpace<D>): boolean;
export function isRegisteredVectorSpace<K extends Scalar, V extends Vector>(vectorSpace: IdentifiableVectorSpace<K, V>): boolean;
export function isRegisteredVectorSpace(vectorSpace: IdentifiableVectorSpace<any, any>): boolean {
    switch (vectorSpace.spaceType) {
        case VectorSpaceType.REAL:
            return isRegisteredRealVectorSpace(vectorSpace as RealVectorSpace);
        case VectorSpaceType.COMPLEX:
            return isRegisteredComplexVectorSpace(vectorSpace as ComplexVectorSpace);
        case VectorSpaceType.PROJECTIVE:
            return isRegisteredProjectiveRealVectorSpace(vectorSpace as ProjectiveVectorSpace);
        case VectorSpaceType.PROJECTIVECOMPLEX:
            return isRegisteredProjectiveComplexVectorSpace(vectorSpace as ProjectiveComplexVectorSpace);
        default:
            const error = sendRangeErrorMessage('getDefaultVectorSpace', 'getDefaultVectorSpace', EM_INVALID_VECTOR_SPACE_TYPE);
            throw new RangeError(error.generateMessageString());
    }
}

/**
 * Resolve vector space based on type and dimension to generate a unique identifier
 * @internal
 */
export function resolveVectorSpace<D extends number>(vectorSpace: ComplexVectorSpace<D>): string;
export function resolveVectorSpace<D extends number>(vectorSpace: RealVectorSpace<D>): string;
export function resolveVectorSpace<D extends number>(vectorSpace: ProjectiveVectorSpace<D>): string;
export function resolveVectorSpace<D extends number>(vectorSpace: ProjectiveComplexVectorSpace<D>): string;
export function resolveVectorSpace<K extends Scalar, V extends Vector>(vectorSpace: IdentifiableVectorSpace<K, V>): string;
export function resolveVectorSpace(vectorSpace: IdentifiableVectorSpace<any, any>): string {
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