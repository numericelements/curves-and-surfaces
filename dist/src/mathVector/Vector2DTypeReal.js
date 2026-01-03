"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2DTypeReal = void 0;
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
const Vectors_1 = require("../namedConstants/Vectors");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const AbstractRealVector_1 = require("./AbstractRealVector");
const DefaultSpaceResolvers_1 = require("./internal/DefaultSpaceResolvers");
const ProjectiveVector2DTypeReal_1 = require("./ProjectiveVector2DTypeReal");
const RealVectorSpace_1 = require("./RealVectorSpace");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_1 = require("./Weight");
const SPACE_DIMENSION = 2;
class Vector2DTypeReal extends AbstractRealVector_1.AbstractRealVector {
    constructor(xOrVectorSpace, y, vectorSpace) {
        super();
        if (xOrVectorSpace instanceof RealVectorSpace_1.RealVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            this.data = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [0, 0] };
        }
        else {
            const x = xOrVectorSpace !== null && xOrVectorSpace !== void 0 ? xOrVectorSpace : 0;
            this.data = { type: VectorTypeTags_1.REALVECTOR2D, coordinates: [x, y !== null && y !== void 0 ? y : 0] };
            if (vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            }
            else {
                this._vectorSpace = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(this.spaceType, this.dimension);
            }
        }
    }
    get dimension() { return SPACE_DIMENSION; }
    get vectorType() { return VectorTypeTags_1.REALVECTOR2D; }
    get coordinates() { return [...this.data.coordinates]; }
    get descriptor() { return Object.assign({}, this.data); }
    get y() { return this.getCoordinate(SPACE_DIMENSION - 1); }
    getCoordinate(index) {
        if (index < 0 || index >= SPACE_DIMENSION) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getCoordinate', Vectors_1.EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this.data.coordinates[index];
    }
    add(other) {
        // return super.add(other) as Vector2DTypeReal;
        return new Vector2DTypeReal(super.add(other).coordinates[0], super.add(other).coordinates[1], this.vectorSpace);
    }
    subtract(other) {
        return new Vector2DTypeReal(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], this.vectorSpace);
    }
    scale(scalar) {
        return new Vector2DTypeReal(super.scale(scalar).coordinates[0], super.scale(scalar).coordinates[1], this.vectorSpace);
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
    toProjectiveVector(projectiveRealVectorSpace) {
        if (projectiveRealVectorSpace !== undefined) {
            if (projectiveRealVectorSpace.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights) {
                return new ProjectiveVector2DTypeReal_1.ProjectiveVector2DTypeReal(this.x, this.y, new Weight_1.Weight(1, false), projectiveRealVectorSpace);
            }
            return new ProjectiveVector2DTypeReal_1.ProjectiveVector2DTypeReal(this.x, this.y, new Weight_1.Weight(), projectiveRealVectorSpace);
        }
        return new ProjectiveVector2DTypeReal_1.ProjectiveVector2DTypeReal(this.x, this.y, new Weight_1.Weight());
    }
    clone() {
        return new Vector2DTypeReal(this.x, this.y, this.vectorSpace);
    }
}
exports.Vector2DTypeReal = Vector2DTypeReal;
