"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectiveVector3DTypeReal = void 0;
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
const Vectors_1 = require("../namedConstants/Vectors");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const Weight_1 = require("../namedConstants/Weight");
const WeightTypeTags_1 = require("../namedConstants/WeightTypeTags");
const AbstractProjectiveVector_1 = require("./AbstractProjectiveVector");
const DefaultSpaceResolvers_1 = require("./internal/DefaultSpaceResolvers");
const ProjectiveVectorSpace_2 = require("./ProjectiveVectorSpace");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_2 = require("./Weight");
const SPACE_DIMENSION = 4;
class ProjectiveVector3DTypeReal extends AbstractProjectiveVector_1.AbstractProjectiveVector {
    constructor(xOrVectorSpace, y, z, weightOrVSpace, vectorSpace) {
        super();
        let strictlyPosWeight = true;
        if (xOrVectorSpace instanceof ProjectiveVectorSpace_2.ProjectiveVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            if (this._vectorSpace.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights)
                strictlyPosWeight = false;
            this.data = { type: VectorTypeTags_1.PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_2.Weight(1, strictlyPosWeight) }] };
            return;
        }
        else if (weightOrVSpace instanceof ProjectiveVectorSpace_2.ProjectiveVectorSpace) {
            this._vectorSpace = weightOrVSpace;
            if (this._vectorSpace.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights)
                strictlyPosWeight = false;
            const x = xOrVectorSpace !== null && xOrVectorSpace !== void 0 ? xOrVectorSpace : 0;
            this.data = {
                type: VectorTypeTags_1.PROJECTIVEVECTOR3D,
                coordinates: [x, y !== null && y !== void 0 ? y : 0, z !== null && z !== void 0 ? z : 0, { type: WeightTypeTags_1.WEIGHT, weight: new Weight_2.Weight(1, strictlyPosWeight) }]
            };
            return;
        }
        else {
            strictlyPosWeight = this.checkValidityWeightStatus(weightOrVSpace, vectorSpace);
            const x = xOrVectorSpace !== null && xOrVectorSpace !== void 0 ? xOrVectorSpace : 0;
            this.data = {
                type: VectorTypeTags_1.PROJECTIVEVECTOR3D,
                coordinates: [x, y !== null && y !== void 0 ? y : 0, z !== null && z !== void 0 ? z : 0, { type: WeightTypeTags_1.WEIGHT, weight: weightOrVSpace !== null && weightOrVSpace !== void 0 ? weightOrVSpace : new Weight_2.Weight(Weight_1.DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }]
            };
            if (vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            }
            else {
                this._vectorSpace = (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(this.spaceType, this.dimension);
            }
        }
    }
    get dimension() { return SPACE_DIMENSION; }
    get vectorType() { return VectorTypeTags_1.PROJECTIVEVECTOR3D; }
    get spaceType() { return BSplineR1toRn_1.VectorSpaceType.PROJECTIVE; }
    get coordinates() { return this.homogeneousCoordinates; }
    get descriptor() { return Object.assign({}, this.data); }
    get z() { return this.getCoordinate(2); }
    ;
    get weight() {
        return this.data.coordinates[3].weight;
    }
    get homogeneousCoordinates() {
        return [this.data.coordinates[0], this.data.coordinates[1], this.data.coordinates[2], this.weight.value];
    }
    getCoordinate(index) {
        if (index < 0 || index >= SPACE_DIMENSION) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getCoordinate', Vectors_1.EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        if (index === SPACE_DIMENSION - 1)
            return this.data.coordinates[3].weight.value;
        return this.data.coordinates[index];
    }
    add(other) {
        // return super.add(other) as ProjectiveVector3DTypeReal;
        return new ProjectiveVector3DTypeReal(super.add(other).coordinates[0], super.add(other).coordinates[1], super.add(other).coordinates[2], super.add(other).weight, this._vectorSpace);
    }
    subtract(other) {
        // return super.subtract(other) as ProjectiveVector3DTypeReal;
        return new ProjectiveVector3DTypeReal(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], super.subtract(other).coordinates[2], super.subtract(other).weight, this._vectorSpace);
    }
    scale(factor) {
        return new ProjectiveVector3DTypeReal(super.scale(factor).coordinates[0], super.scale(factor).coordinates[1], super.scale(factor).coordinates[2], super.scale(factor).weight, this._vectorSpace);
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
    // toRealVector(realVSpace?: RealVectorSpace<3>): Vector3DTypeReal {
    //     if(this.weight.value < NULL_WEIGHT_TOLERANCE) {
    //         const error = sendRangeErrorMessage(this.constructor.name, 'toVector3DReal', EM_WEIGHT_TOO_SMALL);
    //         throw new RangeError(error.generateMessageString());
    //     }
    //     if(realVSpace !== undefined) {
    //         return new Vector3DTypeReal(
    //             this.coordinates[0] / this.coordinates[SPACE_DIMENSION - 1],
    //             this.coordinates[1] / this.coordinates[SPACE_DIMENSION - 1],
    //             this.coordinates[2] / this.coordinates[SPACE_DIMENSION - 1],
    //             realVSpace
    //         );
    //     }
    //     return new Vector3DTypeReal(
    //         this.coordinates[0] / this.coordinates[SPACE_DIMENSION - 1],
    //         this.coordinates[1] / this.coordinates[SPACE_DIMENSION - 1],
    //         this.coordinates[2] / this.coordinates[SPACE_DIMENSION - 1]
    //     );
    // }
    toString() {
        return this.vectorType + `(${this.data.coordinates[0]}, ${this.data.coordinates[1]}, ${this.data.coordinates[2]}, ${this.weight.toString()})` + ` ` + this._vectorSpace.toString();
    }
    clone() {
        let strictlyPosWeight = true;
        if (this._vectorSpace.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights)
            strictlyPosWeight = false;
        if (this._vectorSpace.weightManagement === ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights)
            strictlyPosWeight = this.weight.strictlyPositive;
        return new ProjectiveVector3DTypeReal(this.data.coordinates[0], this.data.coordinates[1], this.data.coordinates[2], new Weight_2.Weight(this.weight.value, strictlyPosWeight), this._vectorSpace);
    }
}
exports.ProjectiveVector3DTypeReal = ProjectiveVector3DTypeReal;
