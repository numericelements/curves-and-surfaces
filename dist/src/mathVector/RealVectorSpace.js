"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRealVectorSpace = exports.RealVectorSpace = void 0;
const RealVectorSpace_1 = require("../ErrorMessages/RealVectorSpace");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const DefaultVectorSpaces_1 = require("../namedConstants/DefaultVectorSpaces");
const RealVectorSpace_2 = require("../namedConstants/RealVectorSpace");
const VectorSpaceIdentifierManager_1 = require("../namedConstants/VectorSpaceIdentifierManager");
const VectorSpaceResolvers_1 = require("../namedConstants/VectorSpaceResolvers");
const DefaultSpaceResolvers_1 = require("./internal/DefaultSpaceResolvers");
const VectorSpaceResolvers_2 = require("./internal/VectorSpaceResolvers");
const RealVectorSpace1DStrategy_1 = require("./RealVectorSpace1DStrategy");
const RealVectorSpace2DStrategy_1 = require("./RealVectorSpace2DStrategy");
const RealVectorSpace3DStrategy_1 = require("./RealVectorSpace3DStrategy");
const RealVectorSpace4DStrategy_1 = require("./RealVectorSpace4DStrategy");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_1 = require("./Weight");
/**
 * Implementation of a real vector space
 */
class RealVectorSpace {
    constructor(dimension, isDefault = false, name) {
        this.dim = dimension;
        this._isDefault = isDefault;
        this._id = VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID;
        if (this._isDefault) {
            this._id = (0, DefaultSpaceResolvers_1.resolveDefaultVectorSpace)(this);
        }
        else {
            this._id = (0, VectorSpaceResolvers_2.resolveVectorSpace)(this);
        }
        if (this._isDefault) {
            this._name = DefaultVectorSpaces_1.DEFAULT_REAL_VECTOR_SPACE_NAME + dimension.toString();
        }
        else {
            this._name = name || VectorSpaceResolvers_1.REAL_VECTOR_SPACE_NAME + dimension.toString();
        }
        switch (this.dim) {
            case RealVectorSpace_2.MIN_DIMENSION_REALVECTORSPACE:
                this.strategy = new RealVectorSpace1DStrategy_1.RealVectorSpace1DStrategy();
                break;
            case 2:
                this.strategy = new RealVectorSpace2DStrategy_1.RealVectorSpace2DStrategy();
                break;
            case 3:
                this.strategy = new RealVectorSpace3DStrategy_1.RealVectorSpace3DStrategy();
                break;
            case RealVectorSpace_2.MAX_DIMENSION_REALVECTORSPACE:
                this.strategy = new RealVectorSpace4DStrategy_1.RealVectorSpace4DStrategy();
                break;
            default:
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', RealVectorSpace_1.EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
        }
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get isDefault() { return this._isDefault; }
    get spaceType() { return BSplineR1toRn_1.VectorSpaceType.REAL; }
    // Identity methods
    isSameSpace(other) {
        return this._id === other.id;
    }
    isIsomorphicTo(other) {
        return this.spaceType === other.spaceType &&
            this.dimension() === other.dimension();
    }
    dimension() {
        return this.dim;
    }
    areSameDimension(a, b) {
        return this.strategy.areSameDimension(a, b);
    }
    isInVectorSpace(v) {
        return this.strategy.isInVectorSpace(v);
    }
    createVector(coordinates) {
        if (coordinates.length !== this.dim) {
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'createVector', RealVectorSpace_1.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
        const vect = this.strategy.createVector(coordinates);
        return vect;
    }
    defaultVect() {
        return this.strategy.defaultVect();
    }
    // Validation methods
    validateVectorCompatibility(a, b) {
        if (a.dimension !== b.dimension || a.spaceType !== b.spaceType) {
            throw new Error(`Vectors are not compatible: ${a.vectorType} vs ${b.vectorType}`);
        }
        if (a.dimension !== this.dim) {
            throw new Error(`Vector dimension ${a.dimension} does not match space dimension ${this.dim}`);
        }
    }
    validateVectorBelongsToSpace(v) {
        if (v.spaceType !== BSplineR1toRn_1.VectorSpaceType.REAL) {
            throw new Error(`Vector is not a real vector: ${v.vectorType}`);
        }
        if (v.dimension !== this.dim) {
            throw new Error(`Vector dimension ${v.dimension} does not match space dimension ${this.dim}`);
        }
    }
    // Utility methods
    toString() {
        return `${this._name} [ID: ${this._id}]`;
    }
    equals(other) {
        return other instanceof RealVectorSpace && this.isSameSpace(other);
    }
    addDescriptors(a, b) {
        try {
            return this.strategy.addDescriptors(a, b);
        }
        catch (error) {
            if (!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'add', RealVectorSpace_1.EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'add', RealVectorSpace_1.EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }
    subtractDescriptors(a, b) {
        try {
            return this.strategy.subtractDescriptors(a, b);
        }
        catch (error) {
            if (!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', RealVectorSpace_1.EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', RealVectorSpace_1.EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }
    scaleDescriptor(scalar, v) {
        try {
            return this.strategy.scaleDescriptor(scalar, v);
        }
        catch (error) {
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scale', RealVectorSpace_1.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }
    cloneVector(v) {
        try {
            return this.strategy.cloneVector(v);
        }
        catch (error) {
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'clone', RealVectorSpace_1.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }
    normDescriptor(v) {
        try {
            return this.strategy.normDescriptor(v);
        }
        catch (error) {
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'norm', RealVectorSpace_1.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }
    normalizeRaw(v) {
        try {
            return this.strategy.normalizeRaw(v);
        }
        catch (error) {
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'normalize', RealVectorSpace_1.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
    }
    crossProductRaw(a, b) {
        return this.strategy.crossProductRaw(a, b);
    }
    dotDescriptors(a, b) {
        try {
            return this.strategy.dotDescriptors(a, b);
        }
        catch (error) {
            if (!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'dot', RealVectorSpace_1.EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'dot', RealVectorSpace_1.EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }
    fromRealVectorSpaceToProjectiveVectorSpace(v, weight = new Weight_1.Weight()) {
        return this.strategy.fromRealVectorSpaceToProjectiveVectorSpace(v, weight);
    }
    fromRealVectorSpaceToComplexVectorSpace(v) {
        return this.strategy.fromRealVectorSpaceToComplexVectorSpace(v);
    }
}
exports.RealVectorSpace = RealVectorSpace;
function createRealVectorSpace(dimension) {
    if (dimension < RealVectorSpace_2.MIN_DIMENSION_REALVECTORSPACE || dimension > RealVectorSpace_2.MAX_DIMENSION_REALVECTORSPACE) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)("createRealVectorSpace", 'function', RealVectorSpace_1.EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
        throw new RangeError(error.generateMessageString());
    }
    return new RealVectorSpace(dimension);
}
exports.createRealVectorSpace = createRealVectorSpace;
