import { VectorSpaceType } from "../../namedConstants/BSplineR1toRn";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../namedConstants/ComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../namedConstants/ProjectiveComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE } from "../../namedConstants/ProjectiveVectorSpace";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../namedConstants/RealVectorSpace";
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
    private static instance: VectorSpaceIdentifierManager;
    private nextId: number = 1;
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
     * Generate a unique identifier for a vector space
     */
    generateId(): string {
        const vsId = this.nextId++;
        return VECTOR_SPACE + `${vsId}_${Date.now()}`;
    }

    registerVectorSpace(vectorSpace: IdentifiableVectorSpace<any, any>, vsId: number): void {
        switch(vectorSpace.spaceType) {
            case VectorSpaceType.REAL:
                this.realSpaces.set(vsId, vectorSpace as RealVectorSpace);
                return;
            case VectorSpaceType.COMPLEX:
                this.complexSpaces.set(vsId, vectorSpace as ComplexVectorSpace);
                return;
            case VectorSpaceType.PROJECTIVE:
                this.projectiveRealSpaces.set(vsId, vectorSpace as ProjectiveVectorSpace);
                return;
            case VectorSpaceType.PROJECTIVECOMPLEX:
                this.projectiveComplexSpaces.set(vsId, vectorSpace as ProjectiveComplexVectorSpace);
                return;
        } 
    }

    getRealVectorSpace<D extends number>(dimension: D, realVS: RealVectorSpace<D>): RealVectorSpace<D> {
        if (dimension < MIN_DIMENSION_REALVECTORSPACE || dimension > MAX_DIMENSION_REALVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.realSpaces.has(this.nextId)) {
            // Create vector space with special marking
            this.realSpaces.set(this.nextId, realVS);
        }
        return this.realSpaces.get(this.nextId) as RealVectorSpace<D>;
    }

    getComplexVectorSpace<D extends number>(dimension: D, complexVS: ComplexVectorSpace<D>): ComplexVectorSpace<D> {
        if (dimension < MIN_DIMENSION_COMPLEXVECTORSPACE || dimension > MAX_DIMENSION_COMPLEXVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.complexSpaces.has(this.nextId)) {
            // Create vector space with special marking
            this.complexSpaces.set(this.nextId, complexVS);
        }
        return this.complexSpaces.get(this.nextId) as ComplexVectorSpace<D>;
    }

    getProjectiveRealVectorSpace<D extends number>(dimension: D, projectiveVS: ProjectiveVectorSpace<D>): ProjectiveVectorSpace<D> {
        if (dimension < MIN_DIMENSION_PROJECTIVEVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVEVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.projectiveRealSpaces.has(this.nextId)) {
            // Create vector space with special marking
            this.projectiveRealSpaces.set(this.nextId, projectiveVS);
        }
        return this.projectiveRealSpaces.get(this.nextId) as ProjectiveVectorSpace<D>;
    }

    getProjectiveComplexVectorSpace<D extends number>(dimension: D, projectiveComplexVS: ProjectiveComplexVectorSpace<D>): ProjectiveComplexVectorSpace<D> {
        if (dimension < MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.projectiveComplexSpaces.has(this.nextId)) {
            // Create vector space with special marking
            this.projectiveComplexSpaces.set(this.nextId, projectiveComplexVS);
        }
        return this.projectiveComplexSpaces.get(this.nextId) as ProjectiveComplexVectorSpace<D>;
    }

    /**
     * Get or create default space identifier for a given type and dimension
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
    isAnExistingVectorSpace(space: IdentifiableVectorSpace<any, any>): boolean {
        return (!space.isDefault) && this.getAllVectorSpaces().some(s => s.isSameSpace(space));
    }
}