import { IncreasingOpenKnotSequenceOpenCurve } from "../IncreasingOpenKnotSequenceOpenCurve";
import { STRICTLYINCREASINGOPENKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "../StrictlyIncreasingOpenKnotSequenceOpenCurve";

export function fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(increasingSeq: IncreasingOpenKnotSequenceOpenCurve): StrictlyIncreasingOpenKnotSequenceOpenCurve {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    if(increasingSeq.isSequenceUpToC0Discontinuity) {
        return new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
    } else {
        return new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
    }
}