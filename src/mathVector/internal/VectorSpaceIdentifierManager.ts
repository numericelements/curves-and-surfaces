import { EM_INVALID_VECTOR_SPACE_TYPE } from "../../ErrorMessages/DefaultSpaceResolvers";
import { EM_INVALID_VECTOR_SPACE_ID_STRUCTURE, EM_INVALID_VECTOR_SPACE_INDEX_VALUE } from "../../ErrorMessages/VectorSpaceIdentifierManager";
import { VectorSpaceType } from "../../namedConstants/BSplineR1toRn";
import { INITIAL_VECTOR_SPACE_ID, LOCATION_INDEX_INTO_VECTOR_SPACE_ID, VECTOR_SPACE, VSPACE_INDEX_INITIAL_VALUE } from "../../namedConstants/VectorSpaceIdentifierManager";
import { ComplexVectorSpace } from "../ComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "../ProjectiveComplexVectorSpace";
import { ProjectiveVectorSpace } from "../ProjectiveVectorSpace";
import { RealVectorSpace } from "../RealVectorSpace";
import { IdentifiableVectorSpace } from "../Vector";
import { sendRangeErrorMessage } from "../VectorSpaceUtilities";


/**
 * Vector Space Identifier Manager - Singleton for generating unique IDs
 */
export class VectorSpaceIdentifierManager {
    private static instance: VectorSpaceIdentifierManager | null = null;
    private nextIndex: number = VSPACE_INDEX_INITIAL_VALUE;
    private realSpaces: Map<number, RealVectorSpace<any>> = new Map();
    private complexSpaces: Map<number, ComplexVectorSpace<any>> = new Map();
    private projectiveRealSpaces: Map<number, ProjectiveVectorSpace<any>> = new Map();
    private projectiveComplexSpaces: Map<number, ProjectiveComplexVectorSpace<any>> = new Map();

    private constructor() {}

    static getInstance(): VectorSpaceIdentifierManager {
        if (!VectorSpaceIdentifierManager.instance) {
            VectorSpaceIdentifierManager.instance = new VectorSpaceIdentifierManager();
        }
        return VectorSpaceIdentifierManager.instance;
    }

    /**
     * Reset the singleton instance for testing purposes only
    @internal
    */
    static reset(): void {
        VectorSpaceIdentifierManager.instance = null;
    }

    static hasInstance(): boolean {
        return VectorSpaceIdentifierManager.instance !== null;
    }

    /**
     * Generate a unique identifier for a vector space
     */
    generateId(): string {
        const vsId = this.nextIndex++;
        return VECTOR_SPACE + `${vsId}_${Date.now()}`;
    }

    getVectorSpaceIndex(vectorSpace: IdentifiableVectorSpace<any, any>): number | undefined{
        const vsId = vectorSpace.id;
        if(vsId === INITIAL_VECTOR_SPACE_ID) return undefined;
        const decomposedId = vsId.split('_');
        if(decomposedId.length < LOCATION_INDEX_INTO_VECTOR_SPACE_ID) {
            const errorMessage = sendRangeErrorMessage(this.constructor.name, 'getVectorSpaceIndex', EM_INVALID_VECTOR_SPACE_ID_STRUCTURE);
            throw new RangeError(errorMessage.generateMessageString());
        }
        const index = parseInt(decomposedId[LOCATION_INDEX_INTO_VECTOR_SPACE_ID], 10);
        if (isNaN(index) || index < VSPACE_INDEX_INITIAL_VALUE || index > this.nextIndex) {
            const errorMessage = sendRangeErrorMessage(this.constructor.name, 'getVectorSpaceIndex', EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
            throw new RangeError(errorMessage.generateMessageString());
        }
        return index;
    }

    registerVectorSpace(vectorSpace: IdentifiableVectorSpace<any, any>): void {
        switch(vectorSpace.spaceType) {
            case VectorSpaceType.REAL:
                this.registerRealVectorSpace(vectorSpace as RealVectorSpace);
                return;
            case VectorSpaceType.COMPLEX:
                this.registerComplexVectorSpace(vectorSpace as ComplexVectorSpace);
                return;
            case VectorSpaceType.PROJECTIVE:
                this.registerProjectiveRealVectorSpace(vectorSpace as ProjectiveVectorSpace);
                return;
            case VectorSpaceType.PROJECTIVECOMPLEX:
                this.registerProjectiveComplexVectorSpace(vectorSpace as ProjectiveComplexVectorSpace);
                return;
            default:
                const error = sendRangeErrorMessage(this.constructor.name, 'registerVectorSpace', EM_INVALID_VECTOR_SPACE_TYPE);
                throw new RangeError(error.generateMessageString());
        } 
    }

    registerRealVectorSpace<D extends number>(realVS: RealVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(realVS);
        if ((vsIndex === undefined || !this.realSpaces.has(vsIndex)) && this.nextIndex >= VSPACE_INDEX_INITIAL_VALUE) {
            this.realSpaces.set(this.nextIndex, realVS);
            return true;
        }
        return false;
    }

    registerComplexVectorSpace<D extends number>(complexVS: ComplexVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(complexVS);
        if ((vsIndex === undefined || !this.complexSpaces.has(vsIndex)) && this.nextIndex >= VSPACE_INDEX_INITIAL_VALUE) {
            this.complexSpaces.set(this.nextIndex, complexVS);
            return true;
        }
        return false;
    }

    registerProjectiveRealVectorSpace<D extends number>(projectiveVS: ProjectiveVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(projectiveVS);
        if ((vsIndex === undefined || !this.projectiveRealSpaces.has(vsIndex)) && this.nextIndex >= VSPACE_INDEX_INITIAL_VALUE) {
            this.projectiveRealSpaces.set(this.nextIndex, projectiveVS);
            return true;
        }
        return false;
    }

    registerProjectiveComplexVectorSpace<D extends number>(projectiveComplexVS: ProjectiveComplexVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(projectiveComplexVS);
        if ((vsIndex === undefined || !this.projectiveComplexSpaces.has(vsIndex)) && this.nextIndex >= VSPACE_INDEX_INITIAL_VALUE) {
            this.projectiveComplexSpaces.set(this.nextIndex, projectiveComplexVS);
            return true;
        }
        return false;
    }

    /**
     * For test purposes only to access nextIndex property
     @internal
     */
    static createInstanceForTesting(nextIndex: number): VectorSpaceIdentifierManager {
        if (!VectorSpaceIdentifierManager.instance) {
            VectorSpaceIdentifierManager.instance = new VectorSpaceIdentifierManager();
            VectorSpaceIdentifierManager.instance.nextIndex = nextIndex;
        }
        return VectorSpaceIdentifierManager.instance;
    }

    /**
     * Get all default spaces (for debugging/testing)
     */
    getAllVectorSpaces(): IdentifiableVectorSpace<any, any>[] {
        return [
            ...Array.from(this.realSpaces.values()),
            ...Array.from(this.complexSpaces.values()),
            ...Array.from(this.projectiveRealSpaces.values()),
            ...Array.from(this.projectiveComplexSpaces.values())
        ];
    }

    /**
     * Check if a vector space is registered and managed by this singleton
     */
    isARegisteredVectorSpace(space: IdentifiableVectorSpace<any, any>): boolean {
        return (!space.isDefault) && this.getAllVectorSpaces().some(s => s.isSameSpace(space));
    }
}