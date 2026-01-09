import { ProjectiveVector2DTypeReal } from "../ProjectiveVector2DTypeReal";
import { RealVectorSpace } from "../RealVectorSpace";
import { Vector2DTypeReal } from "../Vector2DTypeReal";

export function from3DProjectiveRealTo2DReal(projectiveVector: ProjectiveVector2DTypeReal, realVSpace?: RealVectorSpace<2>): Vector2DTypeReal {
        const realCoord = projectiveVector.applyHomogeneousTransformation();
    if (realVSpace !== undefined) {
        return new Vector2DTypeReal(realCoord[0], realCoord[1], realVSpace);
    }
    return new Vector2DTypeReal(realCoord[0], realCoord[1]);
}