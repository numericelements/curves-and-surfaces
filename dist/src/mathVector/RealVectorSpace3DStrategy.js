"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealVectorSpace3DStrategy = void 0;
const RealVectorSpace_1 = require("../ErrorMessages/RealVectorSpace");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const WeightTypeTags_1 = require("../namedConstants/WeightTypeTags");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_1 = require("./Weight");
class RealVectorSpace3DStrategy {
    // Implementation for 3D vectors
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
    createVector(coordinates) {
        let vector = { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [coordinates[0], coordinates[1], coordinates[2]] };
        return vector;
    }
    defaultVect() {
        return { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [0, 0, 0] };
    }
    addDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(a) && (0, VectorSpaceUtilities_1.isVector3D)(b)) {
            return { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], a.coordinates[2] + b.coordinates[2]] };
        }
        else {
            throw new RangeError();
        }
    }
    subtractDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(a) && (0, VectorSpaceUtilities_1.isVector3D)(b)) {
            return { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], a.coordinates[2] - b.coordinates[2]] };
        }
        else {
            throw new RangeError();
        }
    }
    scaleDescriptor(scalar, v) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(v)) {
            return { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2]] };
        }
        else {
            throw new RangeError();
        }
    }
    cloneVector(v) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(v)) {
            return { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2]] };
        }
        else {
            throw new RangeError();
        }
    }
    normDescriptor(v) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(v)) {
            let result = 0;
            for (const component of v.coordinates) {
                result += Math.pow(component, 2);
            }
            result = Math.sqrt(result);
            return result;
        }
        else {
            throw new RangeError();
        }
    }
    normalizeRaw(v) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(v)) {
            const norm = this.normDescriptor(v);
            return { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [v.coordinates[0] / norm, v.coordinates[1] / norm, v.coordinates[2] / norm] };
        }
        else {
            throw new RangeError();
        }
    }
    crossProductRaw(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(a) && (0, VectorSpaceUtilities_1.isVector3D)(b)) {
            return { type: VectorTypeTags_1.REALVECTOR3D, coordinates: [a.coordinates[1] * b.coordinates[2] - a.coordinates[2] * b.coordinates[1], a.coordinates[2] * b.coordinates[0] - a.coordinates[0] * b.coordinates[2], a.coordinates[0] * b.coordinates[1] - a.coordinates[1] * b.coordinates[0]] };
        }
        else {
            if (!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'crossProduct', RealVectorSpace_1.EM_REALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(error.generateMessageString());
            }
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'crossProduct', RealVectorSpace_1.EM_REALVECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
    }
    dotDescriptors(a, b) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(a) && (0, VectorSpaceUtilities_1.isVector3D)(b)) {
            return a.coordinates[0] * b.coordinates[0] + a.coordinates[1] * b.coordinates[1] + a.coordinates[2] * b.coordinates[2];
        }
        else {
            throw new RangeError();
        }
    }
    fromRealVectorSpaceToProjectiveVectorSpace(v, weight = new Weight_1.Weight()) {
        if ((0, VectorSpaceUtilities_1.isVector3D)(v)) {
            if (weight.value === 0) {
                return { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2], { type: WeightTypeTags_1.WEIGHT, weight: weight }] };
            }
            return { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [v.coordinates[0] * weight.value, v.coordinates[1] * weight.value, v.coordinates[2] * weight.value, { type: WeightTypeTags_1.WEIGHT, weight: weight }] };
        }
        else {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromRealVectorSpaceToProjectiveVectorSpace', RealVectorSpace_1.EM_REALVECTOR_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }
    fromRealVectorSpaceToComplexVectorSpace(v) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'fromRealVectorSpaceToComplexVectorSpace', RealVectorSpace_1.EM_REALVECTOR_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
}
exports.RealVectorSpace3DStrategy = RealVectorSpace3DStrategy;
