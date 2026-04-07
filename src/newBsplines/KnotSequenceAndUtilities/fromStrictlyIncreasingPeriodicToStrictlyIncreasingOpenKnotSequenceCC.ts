import { STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "../StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "../StrictlyIncreasingPeriodicKnotSequenceClosedCurve";
import { prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq } from "./prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq";


/**
 * Converts a {@link StrictlyIncreasingPeriodicKnotSequenceClosedCurve} to the equivalent
 * {@link StrictlyIncreasingOpenKnotSequenceClosedCurve}.
 *
 * @description
 * Delegates parameter preparation to
 * {@link prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq},
 * which computes the wrap-around boundary knots needed to clamp the sequence.
 * The resulting open sequence uses `maxMultiplicityOrder + 1` to account for the
 * additional boundary multiplicity introduced by the clamping.
 *
 * @param strictIncSeq - The strictly increasing periodic knot sequence to convert.
 * @returns The equivalent strictly increasing open knot sequence for a closed curve.
 */
export function fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncSeq: StrictlyIncreasingPeriodicKnotSequenceClosedCurve): StrictlyIncreasingOpenKnotSequenceClosedCurve {
    const maxMultOrder = strictIncSeq.maxMultiplicityOrder;
    const openSeqParams = prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq(strictIncSeq);
    const knotsOpenSequence = openSeqParams.knots;
    const multiplicitiesOpenSequence = openSeqParams.multiplicities;
    return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder + 1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotsOpenSequence, multiplicities: multiplicitiesOpenSequence});
}
