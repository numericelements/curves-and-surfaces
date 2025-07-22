import { VectorSpaceType } from "../../namedConstants/BSplineR1toRn";
import { DEFAULT, VECTOR_SPACE } from "../../namedConstants/VectorSpaceIdentifierManager";
import { ComplexVectorSpace } from "../ComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "../ProjectiveComplexVectorSpace";
import { ProjectiveVectorSpace } from "../ProjectiveVectorSpace";
import { RealVectorSpace } from "../RealVectorSpace";
import { IdentifiableVectorSpace } from "../VectorSpaceConstructorInterface";

/**
 * Vector Space Identifier Manager - Singleton for generating unique IDs
 */
export class VectorSpaceIdentifierManager {
    private static instance: VectorSpaceIdentifierManager | null = null;
    private nextIndex: number = 1;
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
        if(vsId === undefined) return undefined;
        const index = parseInt(vsId.split('_')[3], 10);
        if (isNaN(index) || index < 1 || index >= this.nextIndex) {
            throw new Error(`Invalid vector space ID: ${vsId}`);
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
        } 
    }

    registerRealVectorSpace<D extends number>(realVS: RealVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(realVS);
        if (vsIndex === undefined || (!this.realSpaces.has(this.nextIndex) && !(vsIndex < this.nextIndex))) {
            // Create vector space with special marking
            this.realSpaces.set(this.nextIndex, realVS);
            return true;
        } else if(vsIndex < this.nextIndex) {
            return false;
        }
        return false;
    }

    registerComplexVectorSpace<D extends number>(complexVS: ComplexVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(complexVS);
        if (vsIndex === undefined || (!this.complexSpaces.has(this.nextIndex) && !(vsIndex < this.nextIndex))) {
            // Create vector space with special marking
            this.complexSpaces.set(this.nextIndex, complexVS);
            return true;
        } else if(vsIndex < this.nextIndex) {
            return false;
        }
        return false;
    }

    registerProjectiveRealVectorSpace<D extends number>(projectiveVS: ProjectiveVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(projectiveVS);
        if (vsIndex === undefined || (!this.projectiveRealSpaces.has(this.nextIndex) && !(vsIndex < this.nextIndex))) {
            // Create vector space with special marking
            this.projectiveRealSpaces.set(this.nextIndex, projectiveVS);
            return true;
        } else if(vsIndex < this.nextIndex) {
            return false;
        }
        return false;
    }

    registerProjectiveComplexVectorSpace<D extends number>(projectiveComplexVS: ProjectiveComplexVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(projectiveComplexVS);
        if (vsIndex === undefined || (!this.projectiveComplexSpaces.has(this.nextIndex) && !(vsIndex < this.nextIndex))) {
            // Create vector space with special marking
            this.projectiveComplexSpaces.set(this.nextIndex, projectiveComplexVS);
            return true;
        } else if(vsIndex < this.nextIndex) {
            return false;
        }
        return false;
    }

    /**
     * Get or create default vector space identifier for a given type and dimension
     */
    getDefaultSpaceId(spaceType: VectorSpaceType, dimension: number): string {
        const key = `${spaceType}_${dimension}`;
        const id = DEFAULT + `${key}_${this.generateId()}`;
        return id;
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