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
    OpenBSpline_type,
    BSPL_CP_DEG_NONUNIFORM_EUCLIDEAN,
    BSPL_CP_INCREASING_KNOTSEQ,
    BSPL_CP_STRICTLY_INCREASING_KNOTSEQ,
    BSPL_CP_KNOTSEQ_INTERFACE,
    BSPL_CP_KNOTSEQ_INTERFACE_C0DISCONTINUITY
} from "./BSplineR1toRnConstructorInterface";
import {
    INCREASINGOPENKNOTSEQUENCE,
    INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY,
    NO_KNOT_OPEN_CURVE,
    STRICTLYINCREASINGOPENKNOTSEQUENCE,
    STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY,
    UNIFORM_OPENKNOTSEQUENCE,
    UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE
} from "./KnotSequenceConstructorInterface";
import { KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";
import { fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC } from "./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC";

export function createOpenBSplineFromParams<V extends Vector, D extends number>(
    params: { type: typeof BSPL_CP_NO_KNOT; controlPoints: ControlPolygon<V, D> }
): OpenBSplineR1toRn<V, D>;
export function createOpenBSplineFromParams(
    params: OpenBSpline_type
): OpenBSplineR1toRn<Vector, number>;
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
        knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(
            degree + 1, { type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: controlPolygon.length - 1 });
    } else if (params.type === BSPL_CP_DEG_NONUNIFORM) {
        degree = params.degree;
        knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(
        degree + 1, { type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: controlPolygon.length - 1 });
    } else if (params.type === BSPL_CP_DEG_NONUNIFORM_EUCLIDEAN) {
        degree = params.degree;
        const controlPolygonLength = controlPolygon.polygonalLength();
        const knotAbscissae: number[] = [KNOT_SEQUENCE_ORIGIN];
        const multiplicities: number[] = [degree + 1];
        for (let i = 1; i < controlPolygon.length - degree; i++) {
            const edgeLength = controlPolygon.edgeLength(i - 1);
            knotAbscissae.push(knotAbscissae[i - 1] + edgeLength / controlPolygonLength);
            multiplicities.push(1);
        }
        multiplicities[multiplicities.length - 1] = degree + 1;
        knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(
            degree + 1, { type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knotAbscissae, multiplicities: multiplicities });
    } else if (params.type === BSPL_CP_INCREASING_KNOTSEQ) {
        degree = deriveDegree(params.knots.length, controlPolygon.length);
        const increasingKnotSeq = new IncreasingOpenKnotSequenceOpenCurve(degree + 1, 
            { type: INCREASINGOPENKNOTSEQUENCE, knots: params.knots });
        knotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(increasingKnotSeq);
    } else if (params.type === BSPL_CP_STRICTLY_INCREASING_KNOTSEQ) {
        degree = deriveDegree(params.knots.length, controlPolygon.length);
        const increasingKnotSeq = new IncreasingOpenKnotSequenceOpenCurve(degree + 1, 
            { type: INCREASINGOPENKNOTSEQUENCE, knots: params.knots });
        knotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(increasingKnotSeq);
        if(!knotSequence.isKnotMultiplicityNonUniform) {
            throw new RangeError("For strictly increasing knot sequence, all knot multiplicities must be 1");
        }
    } else if (params.type === BSPL_CP_KNOTSEQ_INTERFACE) {
        degree = deriveDegree(params.knotSequence.knots.length, controlPolygon.length);
        if(params.knotSequence.type === INCREASINGOPENKNOTSEQUENCE) {
            const increasingKnotSeq = new IncreasingOpenKnotSequenceOpenCurve(degree + 1, 
                { type: INCREASINGOPENKNOTSEQUENCE, knots: params.knotSequence.knots });
            knotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(increasingKnotSeq);
        } else if(params.knotSequence.type === STRICTLYINCREASINGOPENKNOTSEQUENCE) {
            knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(degree + 1, 
                { type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: params.knotSequence.knots, multiplicities: params.knotSequence.multiplicities });
        } else {
            throw new RangeError("Unsupported knot sequence type in BSPL_CP_KNOTSEQ_INTERFACE");
        }
    } else if (params.type === BSPL_CP_KNOTSEQ_INTERFACE_C0DISCONTINUITY) {
        degree = deriveDegree(params.knotSequence.knots.length, controlPolygon.length);
        if(params.knotSequence.type === INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY) {
            const increasingKnotSeq = new IncreasingOpenKnotSequenceOpenCurve(degree + 1, 
                { type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: params.knotSequence.knots });
            knotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(increasingKnotSeq);
        } else if(params.knotSequence.type === STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY) {
            knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(degree + 1, 
                { type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: params.knotSequence.knots, multiplicities: params.knotSequence.multiplicities });
        } else {
            throw new RangeError("Unsupported knot sequence type in BSPL_CP_KNOTSEQ_INTERFACE_C0DISCONTINUITY");
        }
    } else {
        throw new Error(`Unsupported OpenBSpline type`);
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

    return new OpenBSplineR1toRn<V, D>(
        controlPolygon,
        knotSequence,
        degree,
        vectorSpace,
        spaceDimension
    );
}
