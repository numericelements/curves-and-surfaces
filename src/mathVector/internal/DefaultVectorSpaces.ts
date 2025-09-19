import { VectorSpaceType } from "../../namedConstants/BSplineR1toRn";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../namedConstants/ComplexVectorSpace";
import { DEFAULT_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME, DEFAULT_REAL_VECTOR_SPACE_NAME } from "../../namedConstants/DefaultVectorSpaces";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../namedConstants/ProjectiveComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement } from "../../namedConstants/ProjectiveVectorSpace";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../namedConstants/RealVectorSpace";
import { VECTOR_SPACE } from "../../namedConstants/VectorSpaceIdentifierManager";
import { ComplexVectorSpace } from "../ComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "../ProjectiveComplexVectorSpace";
import { ProjectiveVectorSpace } from "../ProjectiveVectorSpace";
import { RealVectorSpace } from "../RealVectorSpace";
import { IdentifiableVectorSpace } from "../VectorSpaceConstructorInterface";

/**
 * Singleton manager for default vector spaces
 */
export class DefaultVectorSpaces {
    private static instance: DefaultVectorSpaces | null = null;
    private nextIndex: number = 1;
    private realSpaces: Map<number, RealVectorSpace<any>> = new Map();
    private complexSpaces: Map<number, ComplexVectorSpace<any>> = new Map();
    private projectiveRealSpaces: Map<number, ProjectiveVectorSpace<any>> = new Map();
    private projectiveComplexSpaces: Map<number, ProjectiveComplexVectorSpace<any>> = new Map();

    private constructor() {}

    static getInstance(): DefaultVectorSpaces {
        if (!DefaultVectorSpaces.instance) {
            DefaultVectorSpaces.instance = new DefaultVectorSpaces();
        }
        return DefaultVectorSpaces.instance;
    }

    /**
     * Reset the singleton instance for testing purposes only
    @internal
    */
    static reset(): void {
        DefaultVectorSpaces.instance = null;
    }

    static hasInstance(): boolean {
        return DefaultVectorSpaces.instance !== null;
    }

    /**
     * Generate a unique identifier for a default vector space
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

    registerVectorSpace(vectorSpace: IdentifiableVectorSpace<any, any>): boolean {
        let registered = true;
        switch(vectorSpace.spaceType) {
            case VectorSpaceType.REAL:
                if(this.realSpaces.has(vectorSpace.dimension())) {
                    registered = false;
                } else {
                    this.registerRealVectorSpace(vectorSpace as RealVectorSpace);
                }
                return registered;
            case VectorSpaceType.COMPLEX:
                if(this.complexSpaces.has(vectorSpace.dimension())) {
                    registered = false;
                } else {
                    this.registerComplexVectorSpace(vectorSpace as ComplexVectorSpace);
                }
                return registered;
            case VectorSpaceType.PROJECTIVE:
                if(this.projectiveRealSpaces.has(vectorSpace.dimension())) {
                    registered = false;
                } else {
                    this.registerProjectiveRealVectorSpace(vectorSpace as ProjectiveVectorSpace);
                }
                return registered;
            case VectorSpaceType.PROJECTIVECOMPLEX:
                if(this.projectiveComplexSpaces.has(vectorSpace.dimension())) {
                    registered = false;
                } else {
                    this.registerProjectiveComplexVectorSpace(vectorSpace as ProjectiveComplexVectorSpace);
                }
                return registered;
            default:
                throw new Error(`Unknown vector space type: ${vectorSpace.spaceType}`);
        } 
    }

    registerRealVectorSpace<D extends number>(realVS: RealVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(realVS);
        if (vsIndex === undefined || (!this.realSpaces.has(this.nextIndex) && !(vsIndex < this.nextIndex))) {
            // Create vector space with special marking
            this.realSpaces.set(realVS.dimension(), realVS);
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
            this.complexSpaces.set(complexVS.dimension(), complexVS);
            return true;
        } else if(vsIndex < this.nextIndex) {
            return false;
        }
        return false;
    }

    registerProjectiveRealVectorSpace<D extends number>(projectiveVS: ProjectiveVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(projectiveVS);
        // if (vsIndex === undefined || (!this.projectiveRealSpaces.has(this.nextIndex) && !(vsIndex < this.nextIndex))) {
        if (vsIndex === undefined || !this.projectiveRealSpaces.has(projectiveVS.dimension())) {
            // Create vector space with special marking
            this.projectiveRealSpaces.set(projectiveVS.dimension(), projectiveVS);
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
            this.projectiveComplexSpaces.set(projectiveComplexVS.dimension(), projectiveComplexVS);
            return true;
        } else if(vsIndex < this.nextIndex) {
            return false;
        }
        return false;
    }

    getRealVectorSpace<D extends number>(dimension: D): RealVectorSpace<D> {
        if (dimension < MIN_DIMENSION_REALVECTORSPACE || dimension > MAX_DIMENSION_REALVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.realSpaces.has(dimension)) {
            // Create default space with special marking
            const defaultSpace = new RealVectorSpace<D>(dimension, DEFAULT_REAL_VECTOR_SPACE_NAME + dimension, true);
        }
        return this.realSpaces.get(dimension) as RealVectorSpace<D>;
    }

    getComplexVectorSpace<D extends number>(dimension: D): ComplexVectorSpace<D> {
        if (dimension < MIN_DIMENSION_COMPLEXVECTORSPACE || dimension > MAX_DIMENSION_COMPLEXVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.complexSpaces.has(dimension)) {
            const defaultSpace = new ComplexVectorSpace<D>(dimension, DEFAULT_COMPLEX_VECTOR_SPACE_NAME + dimension, true);
        }
        return this.complexSpaces.get(dimension) as ComplexVectorSpace<D>;
    }

    getProjectiveVectorSpace<D extends number>(dimension: D): ProjectiveVectorSpace<D> {
        if (dimension < MIN_DIMENSION_PROJECTIVEVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVEVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.projectiveRealSpaces.has(dimension)) {
            const defaultSpace = new ProjectiveVectorSpace<D>(dimension, WeightManagement.AllStrictlyPositiveWeights, true, DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + dimension);
        }
        return this.projectiveRealSpaces.get(dimension) as ProjectiveVectorSpace<D>;
    }

    getProjectiveComplexVectorSpace<D extends number>(dimension: D): ProjectiveComplexVectorSpace<D> {
        if (dimension < MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.projectiveComplexSpaces.has(dimension)) {
            const defaultSpace = new ProjectiveComplexVectorSpace<D>(dimension, WeightManagement.AllStrictlyPositiveWeights, DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + dimension, true);
        }
        return this.projectiveComplexSpaces.get(dimension) as ProjectiveComplexVectorSpace<D>;
    }

    /**
     * Get all default spaces (for debugging/testing)
     */
    getAllDefaultSpaces(): IdentifiableVectorSpace<any, any>[] {
        return [
            ...Array.from(this.realSpaces.values()),
            ...Array.from(this.complexSpaces.values()),
            ...Array.from(this.projectiveRealSpaces.values()),
            ...Array.from(this.projectiveComplexSpaces.values())
        ];
    }

    /**
     * Check if a vector space is managed by this singleton
     */
    isDefaultSpace(space: IdentifiableVectorSpace<any, any>): boolean {
        return space.isDefault && this.getAllDefaultSpaces().some(s => s.isSameSpace(space));
    }
}
