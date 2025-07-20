import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../namedConstants/ComplexVectorSpace";
import { DEFAULT_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME, DEFAULT_REAL_VECTOR_SPACE_NAME } from "../../namedConstants/DefaultVectorSpaces";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../namedConstants/ProjectiveComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement } from "../../namedConstants/ProjectiveVectorSpace";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../namedConstants/RealVectorSpace";
import { ComplexVectorSpace } from "../ComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "../ProjectiveComplexVectorSpace";
import { ProjectiveVectorSpace } from "../ProjectiveVectorSpace";
import { RealVectorSpace } from "../RealVectorSpace";
import { IdentifiableVectorSpace } from "../VectorSpaceConstructorInterface";

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
        if (dimension < MIN_DIMENSION_REALVECTORSPACE || dimension > MAX_DIMENSION_REALVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.realSpaces.has(dimension)) {
            // Create default space with special marking
            const defaultSpace = new RealVectorSpace<D>(dimension, DEFAULT_REAL_VECTOR_SPACE_NAME + dimension, true);
            this.realSpaces.set(dimension, defaultSpace);
        }
        return this.realSpaces.get(dimension) as RealVectorSpace<D>;
    }

    getComplexVectorSpace<D extends number>(dimension: D): ComplexVectorSpace<D> {
        if (dimension < MIN_DIMENSION_COMPLEXVECTORSPACE || dimension > MAX_DIMENSION_COMPLEXVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.complexSpaces.has(dimension)) {
            const defaultSpace = new ComplexVectorSpace<D>(dimension, DEFAULT_COMPLEX_VECTOR_SPACE_NAME + dimension, true);
            this.complexSpaces.set(dimension, defaultSpace);
        }
        return this.complexSpaces.get(dimension) as ComplexVectorSpace<D>;
    }

    getProjectiveVectorSpace<D extends number>(dimension: D): ProjectiveVectorSpace<D> {
        if (dimension < MIN_DIMENSION_PROJECTIVEVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVEVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.projectiveRealSpaces.has(dimension)) {
            const defaultSpace = new ProjectiveVectorSpace<D>(dimension, WeightManagement.AllStrictlyPositiveWeights, DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + dimension, true);
            this.projectiveRealSpaces.set(dimension, defaultSpace);
        }
        return this.projectiveRealSpaces.get(dimension) as ProjectiveVectorSpace<D>;
    }

    getProjectiveComplexVectorSpace<D extends number>(dimension: D): ProjectiveComplexVectorSpace<D> {
        if (dimension < MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.projectiveComplexSpaces.has(dimension)) {
            const defaultSpace = new ProjectiveComplexVectorSpace<D>(dimension, WeightManagement.AllStrictlyPositiveWeights, DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + dimension, true);
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
     * Check if a vector space is managed by this singleton
     */
    isDefaultSpace(space: IdentifiableVectorSpace<any, any>): boolean {
        return space.isDefault && this.getAllDefaultSpaces().some(s => s.isSameSpace(space));
    }
}
