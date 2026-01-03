"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplexVectorSpace = void 0;
const ComplexVectorSpace_1 = require("../ErrorMessages/ComplexVectorSpace");
const Weight_1 = require("../ErrorMessages/Weight");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const ComplexVectorSpace_2 = require("../namedConstants/ComplexVectorSpace");
const DefaultVectorSpaces_1 = require("../namedConstants/DefaultVectorSpaces");
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
const VectorSpaceIdentifierManager_1 = require("../namedConstants/VectorSpaceIdentifierManager");
const VectorSpaceResolvers_1 = require("../namedConstants/VectorSpaceResolvers");
const WeightTypeTags_1 = require("../namedConstants/WeightTypeTags");
const ComplexVectorSpace1DStrategy_1 = require("./ComplexVectorSpace1DStrategy");
const ComplexVectorSpace2DStrategy_1 = require("./ComplexVectorSpace2DStrategy");
const DefaultSpaceResolvers_1 = require("./internal/DefaultSpaceResolvers");
// import { DefaultVectorSpaces } from "./internal/DefaultVectorSpaces";
const VectorSpaceResolvers_2 = require("./internal/VectorSpaceResolvers");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_2 = require("./Weight");
class ComplexVectorSpace {
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
            this._name = DefaultVectorSpaces_1.DEFAULT_COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
        }
        else {
            this._name = name || VectorSpaceResolvers_1.COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
        }
        switch (this.dim) {
            case ComplexVectorSpace_2.MIN_DIMENSION_COMPLEXVECTORSPACE:
                this.strategy = new ComplexVectorSpace1DStrategy_1.ComplexVectorSpace1DStrategy();
                break;
            case ComplexVectorSpace_2.MAX_DIMENSION_COMPLEXVECTORSPACE:
                this.strategy = new ComplexVectorSpace2DStrategy_1.ComplexVectorSpace2DStrategy();
                break;
            default:
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ComplexVectorSpace_1.EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
        }
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get isDefault() { return this._isDefault; }
    get spaceType() { return BSplineR1toRn_1.VectorSpaceType.COMPLEX; }
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
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'createVector', ComplexVectorSpace_1.EM_COMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
        for (const coord of coordinates) {
            if (coord.length !== 2) {
                const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'createVector', ComplexVectorSpace_1.EM_INPUT_ARRAY_INCONSISTENT_LENGTH);
                throw new RangeError(message.generateMessageString());
            }
        }
        const vect = this.strategy.createVector(coordinates);
        return vect;
    }
    createComplexWeight(a, b) {
        try {
            const realWeight = this.createWeight(a);
            const imagWeight = this.createWeight(b);
            return { type: WeightTypeTags_1.COMPLEXWEIGHT, real: realWeight, imaginary: imagWeight };
        }
        catch (error) {
            if (error instanceof RangeError && error.message.includes(Weight_1.EM_WEIGHT_VALUE_STRICTLY_POSITIVE) && a < 0) {
                const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'createComplexWeight', ComplexVectorSpace_1.EM_REALWEIGHT_NEGATIVE);
                throw new RangeError(message.generateMessageString());
            }
            else {
                const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'createComplexWeight', ComplexVectorSpace_1.EM_IMAGINARYWEIGHT_NEGATIVE);
                throw new RangeError(message.generateMessageString());
            }
        }
    }
    createWeight(a) {
        let weight;
        if (Math.abs(a) < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
            a = 0;
        }
        if (a === 0) {
            weight = new Weight_2.Weight(0, false);
        }
        else {
            weight = new Weight_2.Weight(a);
        }
        return weight;
    }
    defaultVect() {
        return this.strategy.defaultVect();
    }
    addDescriptors(a, b) {
        try {
            return this.strategy.addDescriptors(a, b);
        }
        catch (error) {
            if (!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'add', ComplexVectorSpace_1.EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'add', ComplexVectorSpace_1.EM_COMPLEXVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }
    normDescriptor(vector) {
        try {
            return this.strategy.normDescriptor(vector);
        }
        catch (error) {
            if (error instanceof RangeError && error.message.includes(ComplexVectorSpace_1.EM_TRANSFORMATION_NOT_AVAILABLE)) {
                throw error;
            }
            const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'norm', ComplexVectorSpace_1.EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message1.generateMessageString());
        }
    }
    scaleDescriptor(scalar, vector) {
        try {
            return this.strategy.scaleDescriptor(scalar, vector);
        }
        catch (error) {
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scale', ComplexVectorSpace_1.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }
    dotDescriptors(a, b) {
        try {
            return this.strategy.dotDescriptors(a, b);
        }
        catch (error) {
            if (!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'dot', ComplexVectorSpace_1.EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'dot', ComplexVectorSpace_1.EM_COMPLEXVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }
    subtractDescriptors(a, b) {
        try {
            return this.strategy.subtractDescriptors(a, b);
        }
        catch (error) {
            if (!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ComplexVectorSpace_1.EM_COMPLEXVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ComplexVectorSpace_1.EM_COMPLEXVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }
    cloneVector(vector) {
        try {
            return this.strategy.cloneVector(vector);
        }
        catch (error) {
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'clone', ComplexVectorSpace_1.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }
    toString() {
        return `${this._name} [ID: ${this._id}]`;
    }
    fromComplexVectorSpaceToRealVectorSpace(vector) {
        return this.strategy.fromComplexVectorSpaceToRealVectorSpace(vector);
    }
    fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector, weight = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_2.Weight(), imaginary: new Weight_2.Weight() }) {
        return this.strategy.fromComplexVectorSpaceToProjectiveComplexVectorSpace(vector, weight);
    }
}
exports.ComplexVectorSpace = ComplexVectorSpace;
// DefaultVectorSpaces.getInstance().registerProjectiveComplexVectorSpaceFactory(2, () => new ComplexVectorSpace(2, true, DEFAULT_COMPLEX_VECTOR_SPACE_NAME + 2));
