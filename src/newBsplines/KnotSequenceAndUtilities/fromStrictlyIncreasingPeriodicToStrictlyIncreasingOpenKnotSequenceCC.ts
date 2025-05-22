import { STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "../StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "../StrictlyIncreasingPeriodicKnotSequenceClosedCurve";
import { prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq } from "./prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq";


export function fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncSeq: StrictlyIncreasingPeriodicKnotSequenceClosedCurve): StrictlyIncreasingOpenKnotSequenceClosedCurve {
    const maxMultOrder = strictIncSeq.maxMultiplicityOrder;
    const openSeqParams = prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq(strictIncSeq);
    const knotsOpenSequence = openSeqParams.knots;
    const multiplicitiesOpenSequence = openSeqParams.multiplicities;
    return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder + 1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotsOpenSequence, multiplicities: multiplicitiesOpenSequence});
}
