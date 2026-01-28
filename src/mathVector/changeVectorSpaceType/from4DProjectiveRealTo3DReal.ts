import { EM_WEIGHT_TOO_SMALL } from "../../ErrorMessages/ProjectiveVectors";
import { NULL_WEIGHT_TOLERANCE } from "../../namedConstants/ProjectiveVectorSpace";
import { ProjectiveVector3DTypeReal } from "../ProjectiveVector3DTypeReal";
import { RealVectorSpace } from "../RealVectorSpace";
import { Vector3DTypeReal } from "../Vector3DTypeReal";
import { sendRangeErrorMessage } from "../VectorSpaceUtilities";

const SPACE_DIMENSION = 4;

export function from4DProjectiveRealTo3DReal(projectiveVector: ProjectiveVector3DTypeReal, realVSpace?: RealVectorSpace<3>): Vector3DTypeReal {
      if(projectiveVector.weight.value < NULL_WEIGHT_TOLERANCE) {
            const error = sendRangeErrorMessage('from4DProjectiveRealTo3DReal', 'from4DProjectiveRealTo3DReal', EM_WEIGHT_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        if(realVSpace !== undefined) {
            return new Vector3DTypeReal(
                projectiveVector.coordinates[0] / projectiveVector.coordinates[SPACE_DIMENSION - 1],
                projectiveVector.coordinates[1] / projectiveVector.coordinates[SPACE_DIMENSION - 1],
                projectiveVector.coordinates[2] / projectiveVector.coordinates[SPACE_DIMENSION - 1],
                realVSpace
            );
        }
        return new Vector3DTypeReal(
            projectiveVector.coordinates[0] / projectiveVector.coordinates[SPACE_DIMENSION - 1],
            projectiveVector.coordinates[1] / projectiveVector.coordinates[SPACE_DIMENSION - 1],
            projectiveVector.coordinates[2] / projectiveVector.coordinates[SPACE_DIMENSION - 1]
        );
    }