"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectiveVectorSpace3DStrategy = void 0;
const ProjectiveVectorSpace_1 = require("../ErrorMessages/ProjectiveVectorSpace");
const ComplexTypeTag_1 = require("../namedConstants/ComplexTypeTag");
const ProjectiveVectorSpace_2 = require("../namedConstants/ProjectiveVectorSpace");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const Weight_1 = require("../namedConstants/Weight");
const WeightTypeTags_1 = require("../namedConstants/WeightTypeTags");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_2 = require("./Weight");
class ProjectiveVectorSpace3DStrategy {
    // Implementation for 3D vectors
    getWeight(v) {
        if (this.isInVectorSpace(v)) {
            return v.coordinates[2].weight.value;
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getWeight', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }
    shareSameWeightManagement(v1, v2, weightManager) {
        if (this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            const weight1 = v1.coordinates[2].weight;
            const weight2 = v2.coordinates[2].weight;
            return weightManager.haveSameWeightManagement(weight1, weight2);
        }
        else {
            if (!this.isInVectorSpace(v1) && !this.isInVectorSpace(v2)) {
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'shareSameWeightManagement', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(error.generateMessageString());
            }
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'shareSameWeightManagement', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
    }
    areSameDimension(v1, v2) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(v1) && (0, VectorSpaceUtilities_1.isVector3D)(v2))
            return true;
        return false;
    }
    isInVectorSpace(v) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(v))
            return true;
        return false;
    }
    createVector(coordinates, weightManager) {
        if (weightManager.weightManagement === ProjectiveVectorSpace_2.WeightManagement.AllPositiveWeights || (weightManager.weightManagement === ProjectiveVectorSpace_2.WeightManagement.SomeNullWeights && coordinates[2] === 0)) {
            let vector = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [coordinates[0], coordinates[1], { type: WeightTypeTags_1.WEIGHT, weight: weightManager.createWeightFromValueOnly(coordinates[2]) }] };
            return vector;
        }
        else {
            let vector = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [coordinates[0], coordinates[1], { type: WeightTypeTags_1.WEIGHT, weight: weightManager.createWeightFromValueOnly(coordinates[2]) }] };
            return vector;
        }
    }
    defaultVect(weightManager) {
        let vector = { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WeightTypeTags_1.WEIGHT, weight: weightManager.createWeightFromValueOnly(Weight_1.DEFAULT_WEIGHT_VALUE) }] };
        return vector;
    }
    add(a, b, weightManager) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(a) && (0, VectorSpaceUtilities_1.isVector3D)(b)) {
            const sumWeights = weightManager.addWeights(a.coordinates[2].weight, b.coordinates[2].weight);
            return { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], { type: WeightTypeTags_1.WEIGHT, weight: sumWeights }] };
        }
        else {
            throw new RangeError();
        }
    }
    subtract(a, b, weightManager) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(a) && (0, VectorSpaceUtilities_1.isVector3D)(b)) {
            try {
                const diffWeights = weightManager.subtractWeights(a.coordinates[2].weight, b.coordinates[2].weight);
                return { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], { type: WeightTypeTags_1.WEIGHT, weight: diffWeights }] };
            }
            catch (error) {
                throw error;
            }
        }
        else {
            throw new RangeError();
        }
    }
    norm(v) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(v)) {
            let result = 0;
            for (let i = 0; i < v.coordinates.length; i++) {
                let component = 0;
                if (i === (v.coordinates.length - 1)) {
                    const weight = v.coordinates[i];
                    component = weight.weight.value;
                }
                else {
                    component = v.coordinates[i];
                }
                result += Math.pow(component, 2);
            }
            result = Math.sqrt(result);
            return result;
        }
        else {
            throw new RangeError();
        }
    }
    scale(scalar, v, weightManager) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(v)) {
            try {
                const scaledWeight = weightManager.scaleWeight(v.coordinates[2].weight, scalar);
                return { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], { type: WeightTypeTags_1.WEIGHT, weight: scaledWeight }] };
            }
            catch (error) {
                throw error;
            }
        }
        else {
            throw new RangeError();
        }
    }
    clone(v) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(v)) {
            const clonedWeight = v.coordinates[2].weight.clone();
            return { type: VectorTypeTags_1.PROJECTIVEVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1], { type: WeightTypeTags_1.WEIGHT, weight: clonedWeight }] };
        }
        else {
            throw new RangeError();
        }
    }
    fromProjectiveVectorSpaceToRealVectorSpace(v) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(v)) {
            const result = [];
            const weight = v.coordinates[2].weight.value;
            if (weight === 0) {
                return { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1]] };
            }
            else {
                for (let i = 0; i < v.coordinates.length - 1; i++) {
                    result.push(v.coordinates[i] / weight);
                }
                return { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [result[0], result[1]] };
            }
        }
        else {
            throw new RangeError();
        }
    }
    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(v)) {
            const result = [];
            const weight = v.coordinates[2].weight;
            if (weight.value === 0) {
                const cWeight = { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_2.Weight(0, false), imaginary: new Weight_2.Weight(0, false) };
                return { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: v.coordinates[0], imaginary: v.coordinates[1] }, cWeight] };
            }
            else {
                return { type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: v.coordinates[0], imaginary: v.coordinates[1] },
                        { type: WeightTypeTags_1.COMPLEXWEIGHT, real: weight, imaginary: weight }] };
            }
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromProjectiveVectorSpaceToProjectiveComplexVectorSpace', ProjectiveVectorSpace_1.EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }
}
exports.ProjectiveVectorSpace3DStrategy = ProjectiveVectorSpace3DStrategy;
