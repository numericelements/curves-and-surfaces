/**
 * Internal module - exported within package but not exposed to consumers
 * @internal
 */

import { VectorSpaceIdentifierManager } from './VectorSpaceIdentifierManager';
import { RealVectorSpace } from '../RealVectorSpace';
import { IdentifiableVectorSpace } from '../VectorSpaceConstructorInterface';
import { ComplexVectorSpace } from '../ComplexVectorSpace';
import { ProjectiveVectorSpace } from '../ProjectiveVectorSpace';
import { ProjectiveComplexVectorSpace } from '../ProjectiveComplexVectorSpace';

/**
 * Register a real vector space for given dimension if not already registered
 * @internal
 */
export function registerRealVectorSpace<D extends number>(realVS: RealVectorSpace<D>): boolean {
    return VectorSpaceIdentifierManager.getInstance().registerRealVectorSpace(realVS);
}

/**
 * Register a complex vector space for given dimension if not already registered
 * @internal
 */
export function registerComplexVectorSpace<D extends number>(complexVS: ComplexVectorSpace<D>): boolean {
    return VectorSpaceIdentifierManager.getInstance().registerComplexVectorSpace(complexVS);
}

/**
 * Register a projective real vector space for given dimension if not already registered
 * @internal
 */
export function registerProjectiveRealVectorSpace<D extends number>(projectiveVS: ProjectiveVectorSpace<D>): boolean {
    return VectorSpaceIdentifierManager.getInstance().registerProjectiveRealVectorSpace(projectiveVS);
}

/**
 * Register a projective complex vector space for given dimension if not already registered
 * @internal
 */
export function registerProjectiveComplexVectorSpace<D extends number>(projectiveComplexVS: ProjectiveComplexVectorSpace<D>): boolean {
    return VectorSpaceIdentifierManager.getInstance().registerProjectiveComplexVectorSpace(projectiveComplexVS);
}

/**
 * Resolve default vector space based on type and dimension
 * @internal
 */
export function resolveVectorSpace<D extends number>(vectorSpace: ComplexVectorSpace<D>, isDefault: boolean, id?: string): string;
export function resolveVectorSpace<D extends number>(vectorSpace: RealVectorSpace<D>, isDefault: boolean, id?: string): string;
export function resolveVectorSpace<D extends number>(vectorSpace: ProjectiveVectorSpace<D>, isDefault: boolean, id?: string): string;
export function resolveVectorSpace<D extends number>(vectorSpace: ProjectiveComplexVectorSpace<D>, isDefault: boolean, id?: string): string;
export function resolveVectorSpace(vectorSpace: IdentifiableVectorSpace<any, any>, isDefault: boolean, id?: string): string {
    let vsId = "";
    const idManager = VectorSpaceIdentifierManager.getInstance();
    if (isDefault) {
        if(id === undefined) {
            vsId = idManager.getDefaultSpaceId(vectorSpace.spaceType, vectorSpace.dimension());
        } else {
            vsId = id;
        }
    } else {
        if(id === undefined) {
            idManager.registerVectorSpace(vectorSpace);
            vsId = `${vectorSpace.spaceType}_${vectorSpace.dimension()}_` + idManager.generateId();
        } else {
            vsId = id;
        }
    }
    return vsId;
}