import { EM_WEIGHT_TOO_SMALL } from "../../ErrorMessages/ProjectiveVectors";
import { NULL_WEIGHT_TOLERANCE } from "../../namedConstants/ProjectiveRealVectorSpace";
import type { ProjectiveVector3DReal } from "../ProjectiveVector3DReal";
import type { RealVectorSpace } from "../RealVectorSpace";
import { Vector3DReal } from "../Vector3DReal";
import { sendRangeErrorMessage } from "../VectorSpaceUtilities";

const SPACE_DIMENSION = 4;

export function fromProjectiveReal3DToReal3D(projectiveVector: ProjectiveVector3DReal, realVSpace?: RealVectorSpace<3>): Vector3DReal {
      if(projectiveVector.weight.value < NULL_WEIGHT_TOLERANCE) {
            const error = sendRangeErrorMessage('fromProjectiveReal3DToReal3D', 'fromProjectiveReal3DToReal3D', EM_WEIGHT_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        if(realVSpace !== undefined) {
            return new Vector3DReal(
                projectiveVector.coordinates[0] / projectiveVector.coordinates[SPACE_DIMENSION - 1],
                projectiveVector.coordinates[1] / projectiveVector.coordinates[SPACE_DIMENSION - 1],
                projectiveVector.coordinates[2] / projectiveVector.coordinates[SPACE_DIMENSION - 1],
                realVSpace
            );
        }
        return new Vector3DReal(
            projectiveVector.coordinates[0] / projectiveVector.coordinates[SPACE_DIMENSION - 1],
            projectiveVector.coordinates[1] / projectiveVector.coordinates[SPACE_DIMENSION - 1],
            projectiveVector.coordinates[2] / projectiveVector.coordinates[SPACE_DIMENSION - 1]
        );
    }