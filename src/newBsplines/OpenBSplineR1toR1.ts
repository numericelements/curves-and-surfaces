import { KNOT_SEQUENCE_ORIGIN } from "../namedConstants/KnotSequences";
import { AbstractBSplineR1toRn } from "./AbstractBSplineR1toRn";
import { BSplineR1toR1_type, BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY } from "./BSplineR1toRnConstructorInterface";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";
import { fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC } from "./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC";
import { INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY } from "./KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";

export class OpenBSplineR1toR1 extends AbstractBSplineR1toRn {

    protected _controlPolygon: number[];
    protected _curveOrigin: number;
    protected _degree: number;
    protected _knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve;

    constructor(curveParameters: BSplineR1toR1_type, degree: number) {
        super(curveParameters);
        this._curveOrigin = KNOT_SEQUENCE_ORIGIN;
        this._degree = degree;
        if(curveParameters.type === BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY) {
            this._controlPolygon = curveParameters.controlPoints;
            if(curveParameters.knotSequence.type === STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY) {
                this._knotSequence = new StrictlyIncreasingOpenKnotSequenceOpenCurve(this._degree + 1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: curveParameters.knotSequence.knots, multiplicities: curveParameters.knotSequence.multiplicities});
            } else if(curveParameters.knotSequence.type === INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY) {
                const incKnotSeq = new IncreasingOpenKnotSequenceOpenCurve(this._degree + 1, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: curveParameters.knotSequence.knots});
                this._knotSequence = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(incKnotSeq);
            } else {
                throw new Error("Invalid knot sequence type for OpenBSplineR1toR1 constructor");
            }
        } else {
            throw new Error("Invalid curve parameters for OpenBSplineR1toR1 constructor");
        }
    }

    get controlPolygon(): number[] {
        return this._controlPolygon;
    }
}