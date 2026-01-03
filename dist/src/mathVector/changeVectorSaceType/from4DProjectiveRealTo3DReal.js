"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.from4DProjectiveRealTo3DReal = void 0;
const ProjectiveVectors_1 = require("../../ErrorMessages/ProjectiveVectors");
const ProjectiveVectorSpace_1 = require("../../namedConstants/ProjectiveVectorSpace");
const Vector3DTypeReal_1 = require("../Vector3DTypeReal");
const VectorSpaceUtilities_1 = require("../VectorSpaceUtilities");
const SPACE_DIMENSION = 4;
function from4DProjectiveRealTo3DReal(projectiveVector, realVSpace) {
    if (projectiveVector.weight.value < ProjectiveVectorSpace_1.NULL_WEIGHT_TOLERANCE) {
        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)('function', 'toVector3DReal', ProjectiveVectors_1.EM_WEIGHT_TOO_SMALL);
        throw new RangeError(error.generateMessageString());
    }
    if (realVSpace !== undefined) {
        return new Vector3DTypeReal_1.Vector3DTypeReal(projectiveVector.coordinates[0] / projectiveVector.coordinates[SPACE_DIMENSION - 1], projectiveVector.coordinates[1] / projectiveVector.coordinates[SPACE_DIMENSION - 1], projectiveVector.coordinates[2] / projectiveVector.coordinates[SPACE_DIMENSION - 1], realVSpace);
    }
    return new Vector3DTypeReal_1.Vector3DTypeReal(projectiveVector.coordinates[0] / projectiveVector.coordinates[SPACE_DIMENSION - 1], projectiveVector.coordinates[1] / projectiveVector.coordinates[SPACE_DIMENSION - 1], projectiveVector.coordinates[2] / projectiveVector.coordinates[SPACE_DIMENSION - 1]);
}
exports.from4DProjectiveRealTo3DReal = from4DProjectiveRealTo3DReal;
