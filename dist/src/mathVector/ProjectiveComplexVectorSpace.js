"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectiveComplexVectorSpace = void 0;
const ComplexOperators_1 = require("../ErrorMessages/ComplexOperators");
const ComplexVectorSpace_1 = require("../ErrorMessages/ComplexVectorSpace");
const ProjectiveComplexVectorSpace_1 = require("../ErrorMessages/ProjectiveComplexVectorSpace");
const WeightManager_1 = require("../ErrorMessages/WeightManager");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const ProjectiveComplexVectorSpace_2 = require("../namedConstants/ProjectiveComplexVectorSpace");
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
const VectorSpaceResolvers_1 = require("./internal/VectorSpaceResolvers");
const ProjectiveComplexVectorSpace2DStrategy_1 = require("./ProjectiveComplexVectorSpace2DStrategy");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_1 = require("./Weight");
const WeightManager_2 = require("./WeightManager");
const DefaultVectorSpaces_1 = require("../namedConstants/DefaultVectorSpaces");
const VectorSpaceResolvers_2 = require("../namedConstants/VectorSpaceResolvers");
const DefaultSpaceResolvers_1 = require("./internal/DefaultSpaceResolvers");
const VectorSpaceIdentifierManager_1 = require("../namedConstants/VectorSpaceIdentifierManager");
const ComplexTypeTag_1 = require("../namedConstants/ComplexTypeTag");
const WeightTypeTags_1 = require("../namedConstants/WeightTypeTags");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
class ProjectiveComplexVectorSpace {
    constructor(dimension, isDefltOrWeightMgmt, isDefault, name) {
        this.dim = dimension;
        if (typeof isDefltOrWeightMgmt === 'string') {
            this._weightManagement = isDefltOrWeightMgmt;
        }
        else if (typeof isDefltOrWeightMgmt === 'boolean') {
            isDefault = isDefltOrWeightMgmt;
            this._weightManagement = ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights;
        }
        else {
            this._weightManagement = ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights;
        }
        // this._weightManagement = weightManagement;
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
            this._name = DefaultVectorSpaces_1.DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
        }
        else {
            this._name = name || VectorSpaceResolvers_2.PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
        }
        switch (this.dim) {
            case ProjectiveComplexVectorSpace_2.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE:
                this.strategy = new ProjectiveComplexVectorSpace2DStrategy_1.ProjectiveComplexVectorSpace2DStrategy();
                break;
            default:
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
        }
        if (dimension < ProjectiveComplexVectorSpace_2.MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE || dimension > ProjectiveComplexVectorSpace_2.MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get isDefault() { return this._isDefault; }
    get spaceType() { return BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX; }
    // Identity methods
    isSameSpace(other) {
        return this._id === other.id;
    }
    isIsomorphicTo(other) {
        return this.spaceType === other.spaceType &&
            this.dimension() === other.dimension();
    }
    get weightManagement() {
        return this._weightManagement;
    }
    set weightManagement(weightManagement) {
        this._weightManagement = weightManagement;
    }
    dimension() {
        return this.dim;
    }
    getWeight(v) {
        if (this.isInVectorSpace(v)) {
            return this.strategy.getWeight(v);
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getWeight', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }
    getRealWeight(v) {
        if (this.isInVectorSpace(v)) {
            return this.strategy.getWeight(v).real.value;
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getRealWeight', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }
    getImagiinaryWeight(v) {
        if (this.isInVectorSpace(v)) {
            return this.strategy.getWeight(v).imaginary.value;
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getImagiinaryWeight', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }
    // There is currently only one vector space dimension, so these methods are not neccessary yet
    // areSameDimension(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector): boolean {
    //     if(isVector2D(v1) && isVector2D(v2)) return true;
    //     return false;
    // }
    isInVectorSpace(v) {
        return this.strategy.isInVectorSpace(v);
    }
    shareSameWeightManagement(v1, v2) {
        // not required with only one dimension of projective complex vector space
        // if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
        if (this.hasSameRealImagineryWeightManagement(v1) && this.hasSameRealImagineryWeightManagement(v2)) {
            try {
                return this.strategy.shareSameWeightManagement(v1, v2, this.weightManager);
            }
            catch (error) {
                if (!this.isInVectorSpace(v1) && !this.isInVectorSpace(v2)) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'shareSameWeightManagement', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
                    throw new RangeError(error.generateMessageString());
                }
                const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'shareSameWeightManagement', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORS_DIFFERENT_DIM);
                throw new RangeError(message.generateMessageString());
            }
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'shareSameWeightManagement', ProjectiveComplexVectorSpace_1.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
        // } else {
        //     if(!this.isInVectorSpace(v1) && !this.isInVectorSpace(v2)) {
        //         const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE);
        //         throw new RangeError(error.generateMessageString());
        //     }
        //     const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVECOMPLEXVECTORS_DIFFERENT_DIM);
        //     throw new RangeError(error.generateMessageString());
        // }
    }
    hasSameRealImagineryWeightManagement(v) {
        const realWeight = v.coordinates[1].real;
        const imaginaryWeight = v.coordinates[1].imaginary;
        return realWeight.strictlyPositive === imaginaryWeight.strictlyPositive;
    }
    defaultVect() {
        const nullComplex = { type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 };
        const defaultComplexWeight = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_1.Weight(), imaginary: new Weight_1.Weight() };
        return { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [nullComplex, defaultComplexWeight] };
    }
    createVector(coordinates, weightManager) {
        const complex1 = { type: ComplexTypeTag_1.COMPLEX, real: coordinates[0][0], imaginary: coordinates[0][1] };
        const complexWeight = { type: ComplexTypeTag_1.COMPLEX, real: coordinates[1][0], imaginary: coordinates[1][1] };
        if (coordinates.length !== this.dim) {
            const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'createVector', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
        if (weightManager.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights || (weightManager.weightManagement === ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights && coordinates[1][0] === 0)) {
            let vector = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [complex1, { type: WeightTypeTags_1.COMPLEXWEIGHT,
                        real: weightManager.createWeightFromValueOnly(coordinates[1][0]), imaginary: weightManager.createWeightFromValueOnly(coordinates[1][1]) }] };
            return vector;
        }
        else {
            let vector = { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [complex1, { type: WeightTypeTags_1.COMPLEXWEIGHT,
                        real: weightManager.createWeightFromValueOnly(coordinates[1][0]), imaginary: weightManager.createWeightFromValueOnly(coordinates[1][1]) }] };
            return vector;
        }
    }
    addDescriptors(a, b) {
        if (this.hasSameRealImagineryWeightManagement(a) && this.hasSameRealImagineryWeightManagement(b)) {
            try {
                return this.strategy.add(a, b, this.weightManager);
            }
            catch (error) {
                if (this._weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights && (!a.coordinates[1].real.strictlyPositive || !b.coordinates[1].real.strictlyPositive)) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'add', ProjectiveComplexVectorSpace_1.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
                    throw new RangeError(error.generateMessageString());
                }
                if (!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                    const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'add', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
                    throw new RangeError(message1.generateMessageString());
                }
                const message2 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'add', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORS_DIFFERENT_DIM);
                throw new RangeError(message2.generateMessageString());
            }
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'add', ProjectiveComplexVectorSpace_1.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }
    norm(v) {
        try {
            return this.strategy.norm(v);
        }
        catch (error) {
            const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'norm', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message1.generateMessageString());
        }
    }
    scaleDescriptor(scaleFactor, vector) {
        if (!this.hasSameRealImagineryWeightManagement(vector)) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scale', ProjectiveComplexVectorSpace_1.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
        try {
            return this.strategy.scale(scaleFactor, vector, this.weightManager);
        }
        catch (error) {
            if (typeof scaleFactor === 'number') {
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scale', ProjectiveComplexVectorSpace_1.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
                throw new RangeError(error.generateMessageString());
            }
            else if (!this.isInVectorSpace(vector)) {
                const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scale', ComplexVectorSpace_1.EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(message.generateMessageString());
            }
            else if (error instanceof RangeError && error.message.includes(ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL)) {
                const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scale', ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
                throw new RangeError(message.generateMessageString());
            }
            else {
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'scale', ProjectiveComplexVectorSpace_1.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
                throw new RangeError(error.generateMessageString());
            }
        }
    }
    subtractDescriptors(a, b) {
        if (this.hasSameRealImagineryWeightManagement(a) && this.hasSameRealImagineryWeightManagement(b)) {
            try {
                return this.strategy.subtract(a, b, this.weightManager);
            }
            catch (error) {
                if (this._weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights &&
                    ((!a.coordinates[1].real.strictlyPositive && b.coordinates[1].real.strictlyPositive) ||
                        (a.coordinates[1].real.strictlyPositive && !b.coordinates[1].real.strictlyPositive) ||
                        (!a.coordinates[1].real.strictlyPositive && !b.coordinates[1].real.strictlyPositive))) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ProjectiveComplexVectorSpace_1.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
                    throw new RangeError(error.generateMessageString());
                }
                else if (this._weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights &&
                    ((!a.coordinates[1].real.strictlyPositive && b.coordinates[1].real.strictlyPositive) ||
                        (a.coordinates[1].real.strictlyPositive && !b.coordinates[1].real.strictlyPositive) ||
                        (a.coordinates[1].real.strictlyPositive && b.coordinates[1].real.strictlyPositive))) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ProjectiveComplexVectorSpace_1.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLPOS);
                    throw new RangeError(error.generateMessageString());
                }
                if (error instanceof RangeError && error.message.includes(WeightManager_1.EM_WEIGHT_SUBTRACTION_ERROR) && a.coordinates[1].real.value < b.coordinates[1].real.value &&
                    a.coordinates[1].imaginary.value < b.coordinates[1].imaginary.value) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY);
                    throw new RangeError(error.generateMessageString());
                }
                else if (error instanceof RangeError && error.message.includes(WeightManager_1.EM_WEIGHT_SUBTRACTION_ERROR) && a.coordinates[1].real.value < b.coordinates[1].real.value) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
                    throw new RangeError(error.generateMessageString());
                }
                else if (error instanceof RangeError && error.message.includes(WeightManager_1.EM_WEIGHT_SUBTRACTION_ERROR) && a.coordinates[1].imaginary.value < b.coordinates[1].imaginary.value) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ComplexOperators_1.EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY);
                    throw new RangeError(error.generateMessageString());
                }
                if (!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                    const message1 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
                    throw new RangeError(message1.generateMessageString());
                }
                else if (this._weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights && this.isInVectorSpace(a) && this.isInVectorSpace(b)
                    && error instanceof RangeError && error.message.includes(WeightManager_1.EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)) {
                    const message3 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', WeightManager_1.EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
                    throw new RangeError(message3.generateMessageString());
                }
                else if (error instanceof RangeError && error.message.includes(WeightManager_1.EM_WEIGHT_SUBTRACTION_ERROR)) {
                    const message4 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTOR_WITH_NEGATIVE_WEIGHT);
                    throw new RangeError(message4.generateMessageString());
                }
                const message2 = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'subtract', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORS_DIFFERENT_DIM);
                throw new RangeError(message2.generateMessageString());
            }
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'add', ProjectiveComplexVectorSpace_1.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }
    cloneVector(vector) {
        if (this.hasSameRealImagineryWeightManagement(vector)) {
            try {
                return this.strategy.clone(vector, this.weightManager);
            }
            catch (error) {
                const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'clone', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
                throw new RangeError(message.generateMessageString());
            }
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'clone', ProjectiveComplexVectorSpace_1.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }
    toString() {
        return `${this._name} [ID: ${this._id}]`;
    }
    fromProjectiveComplexVectorSpaceToComplexVectorSpace(vector) {
        if (this.hasSameRealImagineryWeightManagement(vector)) {
            try {
                return this.strategy.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vector, this.weightManager);
            }
            catch (error) {
                if (vector.coordinates[1].real.value === 0 && this.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', ProjectiveComplexVectorSpace_1.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
                    throw new RangeError(error.generateMessageString());
                }
                else if (vector.coordinates[1].imaginary.value === 0 && this.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', ProjectiveComplexVectorSpace_1.EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
                    throw new RangeError(error.generateMessageString());
                }
                const message = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', ProjectiveComplexVectorSpace_1.EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(message.generateMessageString());
            }
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', ProjectiveComplexVectorSpace_1.EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }
}
exports.ProjectiveComplexVectorSpace = ProjectiveComplexVectorSpace;
