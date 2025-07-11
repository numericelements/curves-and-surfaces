import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import { IdentifiableVectorSpace } from "./VectorSpaceConstructorInterface";

/**
 * Singleton manager for default vector spaces
 */
export class DefaultVectorSpaces {
    private static instance: DefaultVectorSpaces;
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

    getRealVectorSpace<D extends number>(dimension: D): RealVectorSpace<D> {
        if (!this.realSpaces.has(dimension)) {
            // Create default space with special marking
            const defaultSpace = new RealVectorSpace<D>(dimension, `Default Real Vector Space R^${dimension}`, true);
            this.realSpaces.set(dimension, defaultSpace);
        }
        return this.realSpaces.get(dimension) as RealVectorSpace<D>;
    }

    getComplexVectorSpace<D extends number>(dimension: D): ComplexVectorSpace<D> {
        if (!this.complexSpaces.has(dimension)) {
            const defaultSpace = new ComplexVectorSpace<D>(dimension, `Default Complex Vector Space R^${dimension}`, true);
            this.complexSpaces.set(dimension, defaultSpace);
        }
        return this.complexSpaces.get(dimension) as ComplexVectorSpace<D>;
    }

    getProjectiveVectorSpace<D extends number>(dimension: D): ProjectiveVectorSpace<D> {
        if (!this.projectiveRealSpaces.has(dimension)) {
            const defaultSpace = new ProjectiveVectorSpace<D>(dimension, WeightManagement.AllStrictlyPositiveWeights, `Default Projective Vector Space R^${dimension}`, true);
            this.projectiveRealSpaces.set(dimension, defaultSpace);
        }
        return this.projectiveRealSpaces.get(dimension) as ProjectiveVectorSpace<D>;
    }

    getProjectiveComplexVectorSpace<D extends number>(dimension: D): ProjectiveComplexVectorSpace<D> {
        if (!this.projectiveComplexSpaces.has(dimension)) {
            const defaultSpace = new ProjectiveComplexVectorSpace<D>(dimension, WeightManagement.AllStrictlyPositiveWeights, `Default Projective Complex Vector Space R^${dimension}`, true);
            this.projectiveComplexSpaces.set(dimension, defaultSpace);
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
     * Check if a space is managed by this singleton
     */
    isDefaultSpace(space: IdentifiableVectorSpace<any, any>): boolean {
        return space.isDefault && this.getAllDefaultSpaces().some(s => s.isSameSpace(space));
    }
}
