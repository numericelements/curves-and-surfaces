import { Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { ControlPolygon } from "./ControlPolygon";
import { ControlPolygonFromDescriptors } from "./ControlPolygonFromDescriptors";
import { OpenBSplineR1toRn, OpenBSplineCtorParams } from "./OpenBSplineR1toRn";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { normalizeDescriptorsToControlPolygon, deriveDegree } from "./AbstractBSplineR1toRn";
import {
    BSPL_CP_NO_KNOT,
    BSPL_CP_DEG_UNIFORM,
    BSPL_CP_DEG_UNIFORM_EUCLIDEAN,
    BSPL_CP_DEG_NONUNIFORM,
    OpenBSpline_type
} from "./BSplineR1toRnConstructorInterface";
import {
    NO_KNOT_OPEN_CURVE,
    UNIFORM_OPENKNOTSEQUENCE,
    UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE
} from "./KnotSequenceConstructorInterface";

export function createOpenBSplineFromParams<V extends Vector, D extends number>(
        params: OpenBSpline_type
    ): OpenBSplineR1toRn<V, D> {

    const controlPolygon: ControlPolygon<V, D> = 
        params.controlPoints instanceof ControlPolygon
            ? params.controlPoints as ControlPolygon<V, D>
                : normalizeDescriptorsToControlPolygon(
                    params.controlPoints instanceof ControlPolygonFromDescriptors
                        ? params.controlPoints
                        : new ControlPolygonFromDescriptors(params.controlPoints)
                    ) as ControlPolygon<V, D>;

    let knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;
    let degree: number;

    if (params.type === BSPL_CP_NO_KNOT) {
        degree = controlPolygon.length - 1;
        knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(
            degree + 1, { type: NO_KNOT_OPEN_CURVE });
    } else if (params.type === BSPL_CP_DEG_UNIFORM) {
        degree = params.degree;
        knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(
            degree + 1, { type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: controlPolygon.length - 1 });
    } else if (params.type === BSPL_CP_DEG_UNIFORM_EUCLIDEAN) {
        degree = params.degree;
        
    } else {
        throw new Error(`Unsupported OpenBSpline type: ${params.type}`);
        // BSPL_CP_DEG_NONUNIFORM
        // degree = params.degree;
        // knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(
        //     degree + 1,
        //     { type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: controlPolygon.length - 1 }
        // );
    }

    // 3) infer vector space from first control point
    const first = controlPolygon.controlPoints[0];
    if (!first) throw new Error("Control polygon must not be empty");
    const vectorSpace = first.vectorSpace.spaceType as VectorSpaceType;
    const spaceDimension = first.dimension as D;

// temporary
knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(
            degree + 1, { type: NO_KNOT_OPEN_CURVE });

    return new OpenBSplineR1toRn<V, D>(
        controlPolygon,
        knotSequence,
        degree,
        vectorSpace,
        spaceDimension
    );
}
