import { createRealVector1DFromDescriptor } from "../mathVector/VectorFromDescriptorFactory";
import { Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";
import { AbstractBSplineR1toRn } from "./AbstractBSplineR1toRn";
import { BSplineR1toR1_type, BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY } from "./BSplineR1toRnConstructorInterface";
import { ControlPolygon } from "./ControlPolygon";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";
import { fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC } from "./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC";
import { INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY } from "./KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";

// export class OpenBSplineR1toR1 extends AbstractBSplineR1toRn {

//     protected _controlPolygon: number[];
//     protected _curveOrigin: number;
//     protected _degree: number;
//     protected _knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;

//     constructor(curveParameters: BSplineR1toR1_type, degree: number) {
//         super(curveParameters);
//         this._curveOrigin = KNOT_SEQUENCE_ORIGIN;
//         this._degree = degree;
//         if(curveParameters.type === BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY) {
//             this._controlPolygon = curveParameters.controlPoints;
//             if(curveParameters.knotSequence.type === STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY) {
//                 this._knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._degree + 1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: curveParameters.knotSequence.knots, multiplicities: curveParameters.knotSequence.multiplicities});
//             } else if(curveParameters.knotSequence.type === INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY) {
//                 const incKnotSeq = new IncreasingOpenKnotSequenceOpenCurve(this._degree + 1, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: curveParameters.knotSequence.knots});
//                 this._knotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(incKnotSeq);
//             } else {
//                 throw new Error("Invalid knot sequence type for OpenBSplineR1toR1 constructor");
//             }
//         } else {
//             throw new Error("Invalid curve parameters for OpenBSplineR1toR1 constructor");
//         }
//     }

//     get controlPolygon(): number[] {
//         return this._controlPolygon;
//     }
// }

type OpenR1toR1Params = Extract<
    BSplineR1toR1_type,
    { type: typeof BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY }
>;

export class OpenBSplineR1toR1 extends AbstractBSplineR1toRn<Vector, 1> {

    protected readonly _curveOrigin: number;
    protected readonly _knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;
    private readonly _scalarControlPolygon: readonly number[];
    private readonly _params: OpenR1toR1Params;

    constructor(curveParameters: BSplineR1toR1_type, degree: number) {
        if (curveParameters.type !== BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY) {
            throw new Error("Invalid curve parameters for OpenBSplineR1toR1 constructor");
        }
        const openParams = curveParameters as OpenR1toR1Params;

        const scalarControlPolygon = [...curveParameters.controlPoints];
        const canonicalControlPolygon = new ControlPolygon<Vector, 1>(
            scalarControlPolygon.map(v => createRealVector1DFromDescriptor(v))
        );

        let knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;
        if (curveParameters.knotSequence.type === STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY) {
            knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(
                degree + 1,
                {
                    type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY,
                    knots: curveParameters.knotSequence.knots,
                    multiplicities: curveParameters.knotSequence.multiplicities
                }
            );
        } else if (curveParameters.knotSequence.type === INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY) {
            const inc = new IncreasingOpenKnotSequenceOpenCurve(
                degree + 1,
                {
                    type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY,
                    knots: curveParameters.knotSequence.knots
                }
            );
            knotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(inc);
        } else {
            throw new Error("Invalid knot sequence type for OpenBSplineR1toR1 constructor");
        }

        const knots = knotSequence.distinctAbscissae();

        super(
            canonicalControlPolygon,
            knots,
            degree,
            VectorSpaceType.REAL,
            1
        );

        this._params = openParams;
        this._scalarControlPolygon = scalarControlPolygon;
        this._knotSequence = knotSequence;
        this._curveOrigin = KNOT_SEQUENCE_ORIGIN;
    }

    get controlPolygon(): ControlPolygon<Vector, 1> {
        return this._controlPolygon;
    }

    get scalarControlPolygon(): readonly number[] {
        return this._scalarControlPolygon;
    }

    get knotSequence(): StrictlyIncreasingOpenKnotSequenceOpenCurve {
        return this._knotSequence;
    }

    get curveOrigin(): number {
        return this._curveOrigin;
    }


    public withControlPolygon(controlPolygon: ControlPolygon<Vector, 1>): OpenBSplineR1toR1 {
        const scalarCP = controlPolygon.controlPoints.map(OpenBSplineR1toR1.scalarFromControlPoint);

        const nextParams: OpenR1toR1Params = {
            type: BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY,
            controlPoints: scalarCP,
            knotSequence: this._params.knotSequence
        };

        return new OpenBSplineR1toR1(nextParams, this.degree);
    }

    public withKnots(knots: readonly number[]): OpenBSplineR1toR1 {
        const nextParams: BSplineR1toR1_type = {
            type: BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY,
            controlPoints: [...this._scalarControlPolygon],
            // with only knots provided, use increasing representation
            knotSequence: {
                type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY,
                knots: [...knots]
            }
        };

        return new OpenBSplineR1toR1(nextParams, this.degree);
    }


    private static scalarFromControlPoint(cp: unknown): number {
        // expected: IVector<1, Vector>
        if (typeof cp === "number") return cp;

        if (typeof cp === "object" && cp !== null) {
            const obj = cp as Record<string, unknown>;

            if ("coordinates" in obj && Array.isArray(obj.coordinates) && obj.coordinates.length > 0) {
                return Number(obj.coordinates[0]);
            }

            if ("toArray" in obj && typeof obj.toArray === "function") {
                const arr = (obj.toArray as () => unknown[])();
                if (Array.isArray(arr) && arr.length > 0) return Number(arr[0]);
            }
        }

        throw new Error("Unable to extract scalar value from control point");
    }

}