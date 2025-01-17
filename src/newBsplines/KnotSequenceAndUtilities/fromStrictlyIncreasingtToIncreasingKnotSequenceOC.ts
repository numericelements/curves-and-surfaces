import { IncreasingOpenKnotSequenceOpenCurve } from "../IncreasingOpenKnotSequenceOpenCurve";
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "../StrictlyIncreasingOpenKnotSequenceOpenCurve";

export function fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strictIncSeq: StrictlyIncreasingOpenKnotSequenceOpenCurve): IncreasingOpenKnotSequenceOpenCurve {
    const knotAbscissae: number[] = [];
    const maxMultOrder = strictIncSeq.maxMultiplicityOrder;
    const abscissae = strictIncSeq.distinctAbscissae();
    const multiplicities = strictIncSeq.multiplicities();
    for (let j = 0; j < abscissae.length; j++) {
        for(let i = 0; i < multiplicities[j]; i++) {
            knotAbscissae.push(abscissae[j]);
        }
    }
    if(strictIncSeq.isSequenceUpToC0Discontinuity) {
        return new IncreasingOpenKnotSequenceOpenCurve(maxMultOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knotAbscissae});
    } else {
        return new IncreasingOpenKnotSequenceOpenCurve(maxMultOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knotAbscissae});
    }
}