import { IncreasingOpenKnotSequenceClosedCurve } from "../IncreasingOpenKnotSequenceClosedCurve";
import { INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "../StrictlyIncreasingOpenKnotSequenceClosedCurve";

export function fromStrictlyIncreasingToIncreasingKnotSequenceCC(strictIncSeq: StrictlyIncreasingOpenKnotSequenceClosedCurve): IncreasingOpenKnotSequenceClosedCurve {
    const knotAbscissae = strictIncSeq.toIncreasingSeqOfAbscissae();
    if(strictIncSeq.isSequenceUpToC0Discontinuity) {
        return new IncreasingOpenKnotSequenceClosedCurve(strictIncSeq.maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knotAbscissae});
    } else {
        return new IncreasingOpenKnotSequenceClosedCurve(strictIncSeq.maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotAbscissae});
    }
}