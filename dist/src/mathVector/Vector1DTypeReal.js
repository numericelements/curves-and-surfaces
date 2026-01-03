"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector1DTypeReal = void 0;
const Vectors_1 = require("../namedConstants/Vectors");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const AbstractRealVector_1 = require("./AbstractRealVector");
const DefaultSpaceResolvers_1 = require("./internal/DefaultSpaceResolvers");
const RealVectorSpace_1 = require("./RealVectorSpace");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const SPACE_DIMENSION = 1;
class Vector1DTypeReal extends AbstractRealVector_1.AbstractRealVector {
    constructor(xOrVectorSpace, vectorSpace) {
        super();
        if (xOrVectorSpace instanceof RealVectorSpace_1.RealVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            this.value = 0;
        }
        else {
            this.value = xOrVectorSpace !== null && xOrVectorSpace !== void 0 ? xOrVectorSpace : 0;
            if (vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            }
            else {
                this._vectorSpace = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(this.spaceType, this.dimension);
            }
        }
    }
    get dimension() { return SPACE_DIMENSION; }
    get vectorType() { return VectorTypeTags_1.REALVECTOR1D; }
    get coordinates() { return [this.value]; }
    get descriptor() { return this.value; }
    getCoordinate(index) {
        if (index !== 0) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getCoordinate', Vectors_1.EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this.value;
    }
    toProjectiveVector(projectiveRealVectorSpace) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'toProjectiveVector', Vectors_1.EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
    clone() {
        return new Vector1DTypeReal(this.value, this.vectorSpace);
    }
    add(other) {
        // return super.add(other) as Vector1DTypeReal;
        return new Vector1DTypeReal(super.add(other).coordinates[0], this.vectorSpace);
    }
    subtract(other) {
        // return super.subtract(other) as Vector1DTypeReal;
        return new Vector1DTypeReal(super.subtract(other).coordinates[0], this.vectorSpace);
    }
    scale(factor) {
        return new Vector1DTypeReal(super.scale(factor).coordinates[0], this.vectorSpace);
    }
    dot(other) {
        return super.dot(other);
    }
    equals(other, tolerance) {
        return super.equals(other, tolerance);
    }
    isParallel(other, angularTolerance) {
        return super.isParallel(other, angularTolerance);
    }
    isOrthogonal(other, angularTolerance) {
        return super.isOrthogonal(other, angularTolerance);
    }
}
exports.Vector1DTypeReal = Vector1DTypeReal;
