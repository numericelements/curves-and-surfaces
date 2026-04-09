import type { ProjectiveVector2DReal } from "../ProjectiveVector2DReal";
import type { RealVectorSpace } from "../RealVectorSpace";
import { Vector2DReal } from "../Vector2DReal";

export function fromProjectiveReal2DToReal2D(projectiveVector: ProjectiveVector2DReal, realVSpace?: RealVectorSpace<2>): Vector2DReal {
        const realCoord = projectiveVector.applyHomogeneousTransformation();
    if (realVSpace !== undefined) {
        return new Vector2DReal(realCoord[0], realCoord[1], realVSpace);
    }
    return new Vector2DReal(realCoord[0], realCoord[1]);
}