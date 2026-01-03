"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorSpaceIdentifierManager = void 0;
const DefaultSpaceResolvers_1 = require("../../ErrorMessages/DefaultSpaceResolvers");
const VectorSpaceIdentifierManager_1 = require("../../ErrorMessages/VectorSpaceIdentifierManager");
const BSplineR1toRn_1 = require("../../namedConstants/BSplineR1toRn");
const VectorSpaceIdentifierManager_2 = require("../../namedConstants/VectorSpaceIdentifierManager");
const VectorSpaceUtilities_1 = require("../VectorSpaceUtilities");
/**
 * Vector Space Identifier Manager - Singleton for generating unique IDs
 */
class VectorSpaceIdentifierManager {
    constructor() {
        this.nextIndex = VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE;
        this.realSpaces = new Map();
        this.complexSpaces = new Map();
        this.projectiveRealSpaces = new Map();
        this.projectiveComplexSpaces = new Map();
    }
    static getInstance() {
        if (!VectorSpaceIdentifierManager.instance) {
            VectorSpaceIdentifierManager.instance = new VectorSpaceIdentifierManager();
        }
        return VectorSpaceIdentifierManager.instance;
    }
    /**
     * Reset the singleton instance for testing purposes only
    @internal
    */
    static reset() {
        VectorSpaceIdentifierManager.instance = null;
    }
    static hasInstance() {
        return VectorSpaceIdentifierManager.instance !== null;
    }
    /**
     * Generate a unique identifier for a vector space
     */
    generateId() {
        const vsId = this.nextIndex++;
        return VectorSpaceIdentifierManager_2.VECTOR_SPACE + `${vsId}_${Date.now()}`;
    }
    getVectorSpaceIndex(vectorSpace) {
        const vsId = vectorSpace.id;
        if (vsId === VectorSpaceIdentifierManager_2.INITIAL_VECTOR_SPACE_ID)
            return undefined;
        const decomposedId = vsId.split('_');
        if (decomposedId.length < VectorSpaceIdentifierManager_2.LOCATION_INDEX_INTO_VECTOR_SPACE_ID) {
            const errorMessage = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getVectorSpaceIndex', VectorSpaceIdentifierManager_1.EM_INVALID_VECTOR_SPACE_ID_STRUCTURE);
            throw new RangeError(errorMessage.generateMessageString());
        }
        const index = parseInt(decomposedId[VectorSpaceIdentifierManager_2.LOCATION_INDEX_INTO_VECTOR_SPACE_ID], 10);
        if (isNaN(index) || index < VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE || index > this.nextIndex) {
            const errorMessage = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getVectorSpaceIndex', VectorSpaceIdentifierManager_1.EM_INVALID_VECTOR_SPACE_INDEX_VALUE);
            throw new RangeError(errorMessage.generateMessageString());
        }
        return index;
    }
    registerVectorSpace(vectorSpace) {
        switch (vectorSpace.spaceType) {
            case BSplineR1toRn_1.VectorSpaceType.REAL:
                this.registerRealVectorSpace(vectorSpace);
                return;
            case BSplineR1toRn_1.VectorSpaceType.COMPLEX:
                this.registerComplexVectorSpace(vectorSpace);
                return;
            case BSplineR1toRn_1.VectorSpaceType.PROJECTIVE:
                this.registerProjectiveRealVectorSpace(vectorSpace);
                return;
            case BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX:
                this.registerProjectiveComplexVectorSpace(vectorSpace);
                return;
            default:
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'registerVectorSpace', DefaultSpaceResolvers_1.EM_INVALID_VECTOR_SPACE_TYPE);
                throw new RangeError(error.generateMessageString());
        }
    }
    registerRealVectorSpace(realVS) {
        const vsIndex = this.getVectorSpaceIndex(realVS);
        if ((vsIndex === undefined || !this.realSpaces.has(vsIndex)) && this.nextIndex >= VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE) {
            this.realSpaces.set(this.nextIndex, realVS);
            return true;
        }
        return false;
    }
    registerComplexVectorSpace(complexVS) {
        const vsIndex = this.getVectorSpaceIndex(complexVS);
        if ((vsIndex === undefined || !this.complexSpaces.has(vsIndex)) && this.nextIndex >= VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE) {
            this.complexSpaces.set(this.nextIndex, complexVS);
            return true;
        }
        return false;
    }
    registerProjectiveRealVectorSpace(projectiveVS) {
        const vsIndex = this.getVectorSpaceIndex(projectiveVS);
        if ((vsIndex === undefined || !this.projectiveRealSpaces.has(vsIndex)) && this.nextIndex >= VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE) {
            this.projectiveRealSpaces.set(this.nextIndex, projectiveVS);
            return true;
        }
        return false;
    }
    registerProjectiveComplexVectorSpace(projectiveComplexVS) {
        const vsIndex = this.getVectorSpaceIndex(projectiveComplexVS);
        if ((vsIndex === undefined || !this.projectiveComplexSpaces.has(vsIndex)) && this.nextIndex >= VectorSpaceIdentifierManager_2.VSPACE_INDEX_INITIAL_VALUE) {
            this.projectiveComplexSpaces.set(this.nextIndex, projectiveComplexVS);
            return true;
        }
        return false;
    }
    /**
     * For test purposes only to access nextIndex property
     @internal
     */
    static createInstanceForTesting(nextIndex) {
        if (!VectorSpaceIdentifierManager.instance) {
            VectorSpaceIdentifierManager.instance = new VectorSpaceIdentifierManager();
            VectorSpaceIdentifierManager.instance.nextIndex = nextIndex;
        }
        return VectorSpaceIdentifierManager.instance;
    }
    /**
     * Get all default spaces (for debugging/testing)
     */
    getAllVectorSpaces() {
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
    isARegisteredVectorSpace(space) {
        return (!space.isDefault) && this.getAllVectorSpaces().some(s => s.isSameSpace(space));
    }
}
exports.VectorSpaceIdentifierManager = VectorSpaceIdentifierManager;
VectorSpaceIdentifierManager.instance = null;
