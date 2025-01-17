import { IncreasingOpenKnotSequenceClosedCurve } from "../IncreasingOpenKnotSequenceClosedCurve";
import { STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "../StrictlyIncreasingOpenKnotSequenceClosedCurve";

export function fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(increasingSeq: IncreasingOpenKnotSequenceClosedCurve): StrictlyIncreasingOpenKnotSequenceClosedCurve {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    if(increasingSeq.isSequenceUpToC0Discontinuity) {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
    } else {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
    }
}