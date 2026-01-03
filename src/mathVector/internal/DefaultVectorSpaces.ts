import { EM_NO_DEFAULT_COMPLEXVECTORSPACE_FOR_DIMENSION } from "../../ErrorMessages/ComplexVectorSpace";
import { EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE, EM_INVALID_DEFAULT_VECTOR_SPACE_ID_STRUCTURE, EM_INVALID_VECTOR_SPACE_TYPE } from "../../ErrorMessages/DefaultSpaceResolvers";
import { EM_NO_DEFAULT_PROJECTIVECOMPLEXVECTORSPACE_FOR_DIMENSION } from "../../ErrorMessages/ProjectiveComplexVectorSpace";
import { EM_NO_DEFAULT_PROJECTIVEVECTORSPACE_FOR_DIMENSION } from "../../ErrorMessages/ProjectiveVectorSpace";
import { EM_NO_DEFAULT_REALVECTORSPACE_FOR_DIMENSION } from "../../ErrorMessages/RealVectorSpace";
import { VectorSpaceType } from "../../namedConstants/BSplineR1toRn";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../namedConstants/ComplexVectorSpace";
import { DEFAULT_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME, DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME, DEFAULT_REAL_VECTOR_SPACE_NAME, DEFAULT_VSPACE_INDEX_INITIAL_VALUE, LOCATION_INDEX_INTO_DEFAULT_VECTOR_SPACE_ID } from "../../namedConstants/DefaultVectorSpaces";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../namedConstants/ProjectiveComplexVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE, WeightManagement } from "../../namedConstants/ProjectiveVectorSpace";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../namedConstants/RealVectorSpace";
import { INITIAL_VECTOR_SPACE_ID, VECTOR_SPACE } from "../../namedConstants/VectorSpaceIdentifierManager";
import type { ComplexVectorSpace } from "../ComplexVectorSpace";
import type { IdentifiableVectorSpace } from "../IVectorSpace";
import type { ProjectiveComplexVectorSpace } from "../ProjectiveComplexVectorSpace";
import type { ProjectiveVectorSpace } from "../ProjectiveVectorSpace";
import type { RealVectorSpace } from "../RealVectorSpace";
import { sendRangeErrorMessage } from "../VectorSpaceUtilities";

/**
 * Singleton manager for default vector spaces
 */
export class DefaultVectorSpaces {
    private static instance: DefaultVectorSpaces | null = null;
    private nextIndex: number = DEFAULT_VSPACE_INDEX_INITIAL_VALUE;
    
    private realSpaces: Map<number, RealVectorSpace<any>> = new Map();
    private complexSpaces: Map<number, ComplexVectorSpace<any>> = new Map();
    private projectiveRealSpaces: Map<number, ProjectiveVectorSpace<any>> = new Map();
    private projectiveComplexSpaces: Map<number, ProjectiveComplexVectorSpace<any>> = new Map();


    // factories to create default instances (register from concrete modules)
    private realFactories: Map<number, () => any> = new Map();
    private complexFactories: Map<number, () => any> = new Map();
    private projectiveRealFactories: Map<number, () => any> = new Map();
    private projectiveComplexFactories: Map<number, () => any> = new Map();

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

    // Factory registration API (called by concrete VectorSpace modules)
    // registerRealVectorSpaceFactory(dimension: number, factory: () => any): void {
    //     this.realFactories.set(dimension, factory);
    // }
    // registerComplexVectorSpaceFactory(dimension: number, factory: () => any): void {
    //     this.complexFactories.set(dimension, factory);
    // }
    // registerProjectiveRealVectorSpaceFactory(dimension: number, factory: () => any): void {
    //     this.projectiveRealFactories.set(dimension, factory);
    // }
    // registerProjectiveComplexVectorSpaceFactory(dimension: number, factory: () => any): void {
    //     this.projectiveComplexFactories.set(dimension, factory);
    // }


    // Backwards-compatible instance registration
    // registerVectorSpace1(vectorSpace: IdentifiableVectorSpace<any, any>): boolean {
    //     let registered = true;
    //     switch(vectorSpace.spaceType) {
    //         case VectorSpaceType.REAL:
    //             if(this.realSpaces.has(vectorSpace.dimension())) {
    //                 registered = false;
    //             } else {
    //                 this.realSpaces.set(vectorSpace.dimension(), vectorSpace as RealVectorSpace<any>);
    //             }
    //             return registered;
    //         case VectorSpaceType.COMPLEX:
    //             if(this.complexSpaces.has(vectorSpace.dimension())) {
    //                 registered = false;
    //             } else {
    //                 this.complexSpaces.set(vectorSpace.dimension(), vectorSpace as ComplexVectorSpace<any>);
    //             }
    //             return registered;
    //         case VectorSpaceType.PROJECTIVE:
    //             if(this.projectiveRealSpaces.has(vectorSpace.dimension())) {
    //                 registered = false;
    //             } else {
    //                 this.projectiveRealSpaces.set(vectorSpace.dimension(), vectorSpace as ProjectiveVectorSpace<any>);
    //             }
    //             return registered;
    //         case VectorSpaceType.PROJECTIVECOMPLEX:
    //             if(this.projectiveComplexSpaces.has(vectorSpace.dimension())) {
    //                 registered = false;
    //             } else {
    //                 this.projectiveComplexSpaces.set(vectorSpace.dimension(), vectorSpace as ProjectiveComplexVectorSpace<any>);
    //             }
    //             return registered;
    //         default:
    //             const error = sendRangeErrorMessage(this.constructor.name, 'registerVectorSpace', EM_INVALID_VECTOR_SPACE_TYPE);
    //             throw new RangeError(error.generateMessageString());
    //     }
    // }

        // get methods now create instances using registered factories when needed
    // getRealVectorSpace1<D extends number>(dimension: D): any {
    //     if (dimension < MIN_DIMENSION_REALVECTORSPACE || dimension > MAX_DIMENSION_REALVECTORSPACE) {
    //         throw new RangeError();
    //     }
    //     if (!this.realSpaces.has(dimension)) {
    //         const factory = this.realFactories.get(dimension);
    //         if (!factory) {
    //             const errorMessage = sendRangeErrorMessage(this.constructor.name, 'getRealVectorSpace', EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE);
    //             throw new RangeError(errorMessage.generateMessageString());
    //         }
    //         const defaultSpace = factory();
    //         this.realSpaces.set(dimension, defaultSpace);
    //     }
    //     return this.realSpaces.get(dimension);
    // }

    // getComplexVectorSpace1<D extends number>(dimension: D): any {
    //     if (dimension < MIN_DIMENSION_COMPLEXVECTORSPACE || dimension > MAX_DIMENSION_COMPLEXVECTORSPACE) {
    //         throw new RangeError();
    //     }
    //     if (!this.complexSpaces.has(dimension)) {
    //         const factory = this.complexFactories.get(dimension);
    //         if (!factory) {
    //             const errorMessage = sendRangeErrorMessage(this.constructor.name, 'getComplexVectorSpace', EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE);
    //             throw new RangeError(errorMessage.generateMessageString());
    //         }
    //         const defaultSpace = factory();
    //         this.complexSpaces.set(dimension, defaultSpace);
    //     }
    //     return this.complexSpaces.get(dimension);
    // }

    // getProjectiveVectorSpace1<D extends number>(dimension: D): any {
    //     if (dimension < MIN_DIMENSION_PROJECTIVEVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVEVECTORSPACE) {
    //         throw new RangeError();
    //     }
    //     if (!this.projectiveRealSpaces.has(dimension)) {
    //         const factory = this.projectiveRealFactories.get(dimension);
    //         if (!factory) {
    //             const errorMessage = sendRangeErrorMessage(this.constructor.name, 'getProjectiveVectorSpace', EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE);
    //             throw new RangeError(errorMessage.generateMessageString());
    //         }
    //         const defaultSpace = factory();
    //         this.projectiveRealSpaces.set(dimension, defaultSpace);
    //     }
    //     return this.projectiveRealSpaces.get(dimension);
    // }

    // getProjectiveComplexVectorSpace1<D extends number>(dimension: D): any {
    //     if (dimension < MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE) {
    //         throw new RangeError();
    //     }
    //     if (!this.projectiveComplexSpaces.has(dimension)) {
    //         const factory = this.projectiveComplexFactories.get(dimension);
    //         if (!factory) {
    //             const errorMessage = sendRangeErrorMessage(this.constructor.name, 'getProjectiveComplexVectorSpace', EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE);
    //             throw new RangeError(errorMessage.generateMessageString());
    //         }
    //         const defaultSpace = factory();
    //         this.projectiveComplexSpaces.set(dimension, defaultSpace);
    //     }
    //     return this.projectiveComplexSpaces.get(dimension);
    // }

    /**
     * Generate a unique identifier for a default vector space
     */
    generateId(): string {
        const vsId = this.nextIndex++;
        return VECTOR_SPACE + `${vsId}_${Date.now()}`;
    }

    getVectorSpaceIndex(vectorSpace: IdentifiableVectorSpace<any, any>): number | undefined{
        const vsId = vectorSpace.id;
        if(vsId === INITIAL_VECTOR_SPACE_ID) return undefined;
        const decomposedId = vsId.split('_');
        if(decomposedId.length < LOCATION_INDEX_INTO_DEFAULT_VECTOR_SPACE_ID) {
            const errorMessage = sendRangeErrorMessage(this.constructor.name, 'getVectorSpaceIndex', EM_INVALID_DEFAULT_VECTOR_SPACE_ID_STRUCTURE);
            throw new RangeError(errorMessage.generateMessageString());
        }
        const index = parseInt(decomposedId[LOCATION_INDEX_INTO_DEFAULT_VECTOR_SPACE_ID], 10);
        if (isNaN(index) || index < DEFAULT_VSPACE_INDEX_INITIAL_VALUE || index > this.nextIndex) {
            const errorMessage = sendRangeErrorMessage(this.constructor.name, 'getVectorSpaceIndex', EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE);
            throw new RangeError(errorMessage.generateMessageString());
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
                const error = sendRangeErrorMessage(this.constructor.name, 'registerVectorSpace', EM_INVALID_VECTOR_SPACE_TYPE);
                throw new RangeError(error.generateMessageString());
        } 
    }

    registerRealVectorSpace<D extends number>(realVS: RealVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(realVS);
        let registered = false;
        if ((vsIndex === undefined || !this.realSpaces.has(realVS.dimension())) && 
                (realVS.dimension() >= MIN_DIMENSION_REALVECTORSPACE && realVS.dimension() <= MAX_DIMENSION_REALVECTORSPACE)) {
            this.realSpaces.set(realVS.dimension(), realVS);
            registered = true;
        }
        return registered;
    }

    registerComplexVectorSpace<D extends number>(complexVS: ComplexVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(complexVS);
        let registered = false;
        if ((vsIndex === undefined || !this.complexSpaces.has(complexVS.dimension())) && 
                (complexVS.dimension() >= MIN_DIMENSION_COMPLEXVECTORSPACE && complexVS.dimension() <= MAX_DIMENSION_COMPLEXVECTORSPACE)) {
            this.complexSpaces.set(complexVS.dimension(), complexVS);
            registered = true;
        }
        return registered;
    }

    registerProjectiveRealVectorSpace<D extends number>(projectiveVS: ProjectiveVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(projectiveVS);
        let registered = false;
        if ((vsIndex === undefined || !this.projectiveRealSpaces.has(projectiveVS.dimension())) && 
                (projectiveVS.dimension() >= MIN_DIMENSION_PROJECTIVEVECTORSPACE && projectiveVS.dimension() <= MAX_DIMENSION_PROJECTIVEVECTORSPACE)) {
            this.projectiveRealSpaces.set(projectiveVS.dimension(), projectiveVS);
            registered = true;
        }
        return registered;
    }

    registerProjectiveComplexVectorSpace<D extends number>(projectiveComplexVS: ProjectiveComplexVectorSpace<D>): boolean {
        const vsIndex = this.getVectorSpaceIndex(projectiveComplexVS);
        let registered = false;
        if ((vsIndex === undefined || !this.projectiveComplexSpaces.has(projectiveComplexVS.dimension())) && 
                (projectiveComplexVS.dimension() >= MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE && projectiveComplexVS.dimension() <= MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE))  {
            this.projectiveComplexSpaces.set(projectiveComplexVS.dimension(), projectiveComplexVS);
            registered = true;
        }
        return registered;
    }

    getRealVectorSpace<D extends number>(dimension: D): RealVectorSpace<D> {
        if (dimension < MIN_DIMENSION_REALVECTORSPACE || dimension > MAX_DIMENSION_REALVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.realSpaces.has(dimension)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getRealVectorSpace', EM_NO_DEFAULT_REALVECTORSPACE_FOR_DIMENSION);
            throw new RangeError(error.generateMessageString());
        }
        return this.realSpaces.get(dimension) as RealVectorSpace<D>;
    }

    getComplexVectorSpace<D extends number>(dimension: D): ComplexVectorSpace<D> {
        if (dimension < MIN_DIMENSION_COMPLEXVECTORSPACE || dimension > MAX_DIMENSION_COMPLEXVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.complexSpaces.has(dimension)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getComplexVectorSpace', EM_NO_DEFAULT_COMPLEXVECTORSPACE_FOR_DIMENSION);
            throw new RangeError(error.generateMessageString());
        }
        return this.complexSpaces.get(dimension) as ComplexVectorSpace<D>;
    }

    getProjectiveVectorSpace<D extends number>(dimension: D): ProjectiveVectorSpace<D> {
        if (dimension < MIN_DIMENSION_PROJECTIVEVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVEVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.projectiveRealSpaces.has(dimension)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getProjectiveVectorSpace', EM_NO_DEFAULT_PROJECTIVEVECTORSPACE_FOR_DIMENSION);
            throw new RangeError(error.generateMessageString());
        }
        return this.projectiveRealSpaces.get(dimension) as ProjectiveVectorSpace<D>;
    }

    getProjectiveComplexVectorSpace<D extends number>(dimension: D): ProjectiveComplexVectorSpace<D> {
        if (dimension < MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.projectiveComplexSpaces.has(dimension)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getProjectiveComplexVectorSpace', EM_NO_DEFAULT_PROJECTIVECOMPLEXVECTORSPACE_FOR_DIMENSION);
            throw new RangeError(error.generateMessageString());
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
