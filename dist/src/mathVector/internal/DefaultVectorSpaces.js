"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultVectorSpaces = void 0;
const DefaultSpaceResolvers_1 = require("../../ErrorMessages/DefaultSpaceResolvers");
const BSplineR1toRn_1 = require("../../namedConstants/BSplineR1toRn");
const ComplexVectorSpace_1 = require("../../namedConstants/ComplexVectorSpace");
const DefaultVectorSpaces_1 = require("../../namedConstants/DefaultVectorSpaces");
const ProjectiveComplexVectorSpace_1 = require("../../namedConstants/ProjectiveComplexVectorSpace");
const ProjectiveVectorSpace_1 = require("../../namedConstants/ProjectiveVectorSpace");
const RealVectorSpace_1 = require("../../namedConstants/RealVectorSpace");
const VectorSpaceIdentifierManager_1 = require("../../namedConstants/VectorSpaceIdentifierManager");
const VectorSpaceUtilities_1 = require("../VectorSpaceUtilities");
/**
 * Singleton manager for default vector spaces
 */
class DefaultVectorSpaces {
    constructor() {
        this.nextIndex = DefaultVectorSpaces_1.DEFAULT_VSPACE_INDEX_INITIAL_VALUE;
        this.realSpaces = new Map();
        this.complexSpaces = new Map();
        this.projectiveRealSpaces = new Map();
        this.projectiveComplexSpaces = new Map();
        // factories to create default instances (register from concrete modules)
        this.realFactories = new Map();
        this.complexFactories = new Map();
        this.projectiveRealFactories = new Map();
        this.projectiveComplexFactories = new Map();
    }
    static getInstance() {
        if (!DefaultVectorSpaces.instance) {
            DefaultVectorSpaces.instance = new DefaultVectorSpaces();
        }
        return DefaultVectorSpaces.instance;
    }
    /**
     * Reset the singleton instance for testing purposes only
    @internal
    */
    static reset() {
        DefaultVectorSpaces.instance = null;
    }
    static hasInstance() {
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
    generateId() {
        const vsId = this.nextIndex++;
        return VectorSpaceIdentifierManager_1.VECTOR_SPACE + `${vsId}_${Date.now()}`;
    }
    getVectorSpaceIndex(vectorSpace) {
        const vsId = vectorSpace.id;
        if (vsId === VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID)
            return undefined;
        const decomposedId = vsId.split('_');
        if (decomposedId.length < DefaultVectorSpaces_1.LOCATION_INDEX_INTO_DEFAULT_VECTOR_SPACE_ID) {
            const errorMessage = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getVectorSpaceIndex', DefaultSpaceResolvers_1.EM_INVALID_DEFAULT_VECTOR_SPACE_ID_STRUCTURE);
            throw new RangeError(errorMessage.generateMessageString());
        }
        const index = parseInt(decomposedId[DefaultVectorSpaces_1.LOCATION_INDEX_INTO_DEFAULT_VECTOR_SPACE_ID], 10);
        if (isNaN(index) || index < DefaultVectorSpaces_1.DEFAULT_VSPACE_INDEX_INITIAL_VALUE || index > this.nextIndex) {
            const errorMessage = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getVectorSpaceIndex', DefaultSpaceResolvers_1.EM_INVALID_DEFAULT_VECTOR_SPACE_INDEX_VALUE);
            throw new RangeError(errorMessage.generateMessageString());
        }
        return index;
    }
    registerVectorSpace(vectorSpace) {
        let registered = true;
        switch (vectorSpace.spaceType) {
            case BSplineR1toRn_1.VectorSpaceType.REAL:
                if (this.realSpaces.has(vectorSpace.dimension())) {
                    registered = false;
                }
                else {
                    this.registerRealVectorSpace(vectorSpace);
                }
                return registered;
            case BSplineR1toRn_1.VectorSpaceType.COMPLEX:
                if (this.complexSpaces.has(vectorSpace.dimension())) {
                    registered = false;
                }
                else {
                    this.registerComplexVectorSpace(vectorSpace);
                }
                return registered;
            case BSplineR1toRn_1.VectorSpaceType.PROJECTIVE:
                if (this.projectiveRealSpaces.has(vectorSpace.dimension())) {
                    registered = false;
                }
                else {
                    this.registerProjectiveRealVectorSpace(vectorSpace);
                }
                return registered;
            case BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX:
                if (this.projectiveComplexSpaces.has(vectorSpace.dimension())) {
                    registered = false;
                }
                else {
                    this.registerProjectiveComplexVectorSpace(vectorSpace);
                }
                return registered;
            default:
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'registerVectorSpace', DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_TYPE);
                throw new RangeError(error.generateMessageString());
        }
    }
    registerRealVectorSpace(realVS) {
        const vsIndex = this.getVectorSpaceIndex(realVS);
        let registered = false;
        if ((vsIndex === undefined || !this.realSpaces.has(realVS.dimension())) &&
            (realVS.dimension() >= RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE && realVS.dimension() <= RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE)) {
            this.realSpaces.set(realVS.dimension(), realVS);
            registered = true;
        }
        return registered;
    }
    registerComplexVectorSpace(complexVS) {
        const vsIndex = this.getVectorSpaceIndex(complexVS);
        let registered = false;
        if ((vsIndex === undefined || !this.complexSpaces.has(complexVS.dimension())) &&
            (complexVS.dimension() >= ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE && complexVS.dimension() <= ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE)) {
            this.complexSpaces.set(complexVS.dimension(), complexVS);
            registered = true;
        }
        return registered;
    }
    registerProjectiveRealVectorSpace(projectiveVS) {
        const vsIndex = this.getVectorSpaceIndex(projectiveVS);
        let registered = false;
        if ((vsIndex === undefined || !this.projectiveRealSpaces.has(projectiveVS.dimension())) &&
            (projectiveVS.dimension() >= ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE && projectiveVS.dimension() <= ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE)) {
            this.projectiveRealSpaces.set(projectiveVS.dimension(), projectiveVS);
            registered = true;
        }
        return registered;
    }
    registerProjectiveComplexVectorSpace(projectiveComplexVS) {
        const vsIndex = this.getVectorSpaceIndex(projectiveComplexVS);
        let registered = false;
        if ((vsIndex === undefined || !this.projectiveComplexSpaces.has(projectiveComplexVS.dimension())) &&
            (projectiveComplexVS.dimension() >= ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE && projectiveComplexVS.dimension() <= ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE)) {
            this.projectiveComplexSpaces.set(projectiveComplexVS.dimension(), projectiveComplexVS);
            registered = true;
        }
        return registered;
    }
    getRealVectorSpace(dimension) {
        if (dimension < RealVectorSpace_1.MIN_DIMENSION_REALVECTORSPACE || dimension > RealVectorSpace_1.MAX_DIMENSION_REALVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.realSpaces.has(dimension)) {
            throw new RangeError();
            // const defaultSpace = new RealVectorSpace<D>(dimension, true, DEFAULT_REAL_VECTOR_SPACE_NAME + dimension);
        }
        return this.realSpaces.get(dimension);
    }
    getComplexVectorSpace(dimension) {
        if (dimension < ComplexVectorSpace_1.MIN_DIMENSION_COMPLEXVECTORSPACE || dimension > ComplexVectorSpace_1.MAX_DIMENSION_COMPLEXVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.complexSpaces.has(dimension)) {
            throw new RangeError();
            // const defaultSpace = new ComplexVectorSpace<D>(dimension, true, DEFAULT_COMPLEX_VECTOR_SPACE_NAME + dimension);
        }
        return this.complexSpaces.get(dimension);
    }
    getProjectiveVectorSpace(dimension) {
        if (dimension < ProjectiveVectorSpace_1.MIN_DIMENSION_PROJECTIVEVECTORSPACE || dimension > ProjectiveVectorSpace_1.MAX_DIMENSION_PROJECTIVEVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.projectiveRealSpaces.has(dimension)) {
            throw new RangeError();
            // const defaultSpace = new ProjectiveVectorSpace<D>(dimension, WeightManagement.AllStrictlyPositiveWeights, true, DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + dimension);
        }
        return this.projectiveRealSpaces.get(dimension);
    }
    getProjectiveComplexVectorSpace(dimension) {
        if (dimension < ProjectiveComplexVectorSpace_1.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE || dimension > ProjectiveComplexVectorSpace_1.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE) {
            throw new RangeError();
        }
        if (!this.projectiveComplexSpaces.has(dimension)) {
            throw new RangeError();
            // const defaultSpace = new ProjectiveComplexVectorSpace<D>(dimension, WeightManagement.AllStrictlyPositiveWeights, true, DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + dimension);
        }
        return this.projectiveComplexSpaces.get(dimension);
    }
    /**
     * Get all default spaces (for debugging/testing)
     */
    getAllDefaultSpaces() {
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
    isDefaultSpace(space) {
        return space.isDefault && this.getAllDefaultSpaces().some(s => s.isSameSpace(space));
    }
}
exports.DefaultVectorSpaces = DefaultVectorSpaces;
DefaultVectorSpaces.instance = null;
