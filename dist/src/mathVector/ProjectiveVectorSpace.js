"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectiveVectorSpace = void 0;
const ProjectiveVectorSpace_1 = require("../ErrorMessages/ProjectiveVectorSpace");
const Weight_1 = require("../ErrorMessages/Weight");
const WeightManager_1 = require("../ErrorMessages/WeightManager");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const ProjectiveVectorSpace_2 = require("../namedConstants/ProjectiveVectorSpace");
const VectorSpaceResolvers_1 = require("./internal/VectorSpaceResolvers");
const ProjectiveVectorSpace3DStrategy_1 = require("./ProjectiveVectorSpace3DStrategy");
const ProjectiveVectorSpace4DStrategy_1 = require("./ProjectiveVectorSpace4DStrategy");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const WeightManager_2 = require("./WeightManager");
const DefaultVectorSpaces_1 = require("../namedConstants/DefaultVectorSpaces");
const VectorSpaceResolvers_2 = require("../namedConstants/VectorSpaceResolvers");
const DefaultSpaceResolvers_1 = require("./internal/DefaultSpaceResolvers");
const VectorSpaceIdentifierManager_1 = require("../namedConstants/VectorSpaceIdentifierManager");
/**
 * Implementation of a projective vector space
 */
class ProjectiveVectorSpace {
    constructor(dimension, isDefltOrWeightMgmt, isDefault, name) {
        this.dim = dimension;
        if (typeof isDefltOrWeightMgmt === 'string') {
            this._weightManagement = isDefltOrWeightMgmt;
        }
        else if (typeof isDefltOrWeightMgmt === 'boolean') {
            isDefault = isDefltOrWeightMgmt;
            this._weightManagement = ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights;
        }
        else {
            this._weightManagement = ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights;
        }
        if (isDefault === undefined)
            isDefault = false;
        this.weightManager = new WeightManager_2.WeightManager(this._weightManagement);
        this._isDefault = isDefault;
        this._id = VectorSpaceIdentifierManager_1.INITIAL_VECTOR_SPACE_ID;
        if (this._isDefault) {
            this._id = (0, DefaultSpaceResolvers_1.resolveDefaultVectorSpace)(this);
        }
        else {
            this._id = (0, VectorSpaceResolvers_1.resolveVectorSpace)(this);
        }
        if (this._isDefault) {
            this._name = DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_VECTOR_SPACE_NAME + dimension.toString();
        }
        else {
            this._name = name || VectorSpaceResolvers_2.PROJECTIVE_VECTOR_SPACE_NAME + dimension.toString();
        }
        switch (this.dim) {
            case ProjectiveVectorSpace_2.MIN_DIMENSION_PROJECTIVEVECTORSPACE:
                this.strategy = new ProjectiveVectorSpace3DStrategy_1.ProjectiveVectorSpace3DStrategy();
                break;
            case ProjectiveVectorSpace_2.MAX_DIMENSION_PROJECTIVEVECTORSPACE:
                this.strategy = new ProjectiveVectorSpace4DStrategy_1.ProjectiveVectorSpace4DStrategy();
                break;
            default:
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
        }
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get isDefault() { return this._isDefault; }
    get spaceType() { return BSplineR1toRn_1.VectorSpaceType.PROJECTIVE; }
    get weightManagement() {
        return this._weightManagement;
    }
    // Identity methods
    isSameSpace(other) {
        return this._id === other.id;
    }
    isIsomorphicTo(other) {
        return this.spaceType === other.spaceType &&
            this.dimension() === other.dimension();
    }
    getWeight(v) {
        return this.strategy.getWeight(v);
    }
    shareSameWeightManagement(v1, v2) {
        return this.strategy.shareSameWeightManagement(v1, v2, this.weightManager);
    }
    dimension() {
        return this.dim;
    }
    // Methods delegate to strategy
    areSameDimension(a, b) {
        return this.strategy.areSameDimension(a, b);
    }
    isInVectorSpace(v) {
        return this.strategy.isInVectorSpace(v);
    }
    createVector(coordinates) {
        if (coordinates.length !== this.dim) {
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'createVector', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
        try {
            const vect = this.strategy.createVector(coordinates, this.weightManager);
            return vect;
        }
        catch (error) {
            if (error instanceof RangeError && error.message.includes(Weight_1.EM_WEIGHT_VALUE_STRICTLY_POSITIVE) && coordinates[coordinates.length - 1] === 0) {
                const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'createVector', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTOR_WITH_NULL_WEIGHT);
                throw new RangeError(message.generateMessageString());
            }
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'createVector', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
            throw new RangeError(message.generateMessageString());
        }
    }
    defaultVect() {
        const vect = this.strategy.defaultVect(this.weightManager);
        return vect;
    }
    addDescriptors(a, b) {
        try {
            return this.strategy.add(a, b, this.weightManager);
        }
        catch (error) {
            if (!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'add', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            const message2 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'add', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }
    subtractDescriptors(a, b) {
        try {
            return this.strategy.subtract(a, b, this.weightManager);
        }
        catch (error) {
            if (!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(message1.generateMessageString());
            }
            else if (this._weightManagement === ProjectiveVectorSpace_2.WeightManagement.AllStrictlyPositiveWeights && this.isInVectorSpace(a) && this.isInVectorSpace(b)
                && error instanceof RangeError && error.message.includes(WeightManager_1.EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)) {
                const message3 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', WeightManager_1.EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
                throw new RangeError(message3.generateMessageString());
            }
            else if (error instanceof RangeError && error.message.includes(WeightManager_1.EM_WEIGHT_SUBTRACTION_ERROR)) {
                const message4 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTOR_WITH_NEGATIVE_WEIGHT);
                throw new RangeError(message4.generateMessageString());
            }
            const message2 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
            throw new RangeError(message2.generateMessageString());
        }
    }
    normDescriptor(a) {
        try {
            return this.strategy.norm(a);
        }
        catch (error) {
            const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'norm', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message1.generateMessageString());
        }
    }
    scaleDescriptor(scalar, v) {
        try {
            return this.strategy.scale(scalar, v, this.weightManager);
        }
        catch (error) {
            if (error instanceof RangeError && error.message.includes(WeightManager_1.EM_SCALE_FACTOR_STRICTLY_NEGATIVE)) {
                const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scale', WeightManager_1.EM_SCALE_FACTOR_STRICTLY_NEGATIVE);
                throw new RangeError(message.generateMessageString());
            }
            else if (error instanceof RangeError && error.message.includes(WeightManager_1.EM_SCALE_FACTOR_NULL)) {
                const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scale', WeightManager_1.EM_SCALE_FACTOR_NULL);
                throw new RangeError(message.generateMessageString());
            }
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scale', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }
    cloneVector(v) {
        try {
            return this.strategy.clone(v);
        }
        catch (error) {
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'clone', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }
    toString() {
        return `${this._name} [ID: ${this._id}]`;
    }
    fromProjectiveVectorSpaceToRealVectorSpace(v) {
        try {
            return this.strategy.fromProjectiveVectorSpaceToRealVectorSpace(v);
        }
        catch (error) {
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromProjectiveVectorSpaceToRealVectorSpace', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(message.generateMessageString());
        }
    }
    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v) {
        return this.strategy.fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v);
    }
}
exports.ProjectiveVectorSpace = ProjectiveVectorSpace;
