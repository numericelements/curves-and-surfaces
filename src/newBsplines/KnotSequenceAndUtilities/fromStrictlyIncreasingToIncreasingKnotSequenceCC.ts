import { IncreasingOpenKnotSequenceClosedCurve } from "../IncreasingOpenKnotSequenceClosedCurve";
import { INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "../StrictlyIncreasingOpenKnotSequenceClosedCurve";

/**
 * Converts a {@link StrictlyIncreasingOpenKnotSequenceClosedCurve} to the equivalent
 * {@link IncreasingOpenKnotSequenceClosedCurve}.
 *
 * @description
 * Expands the compact (strictly increasing) representation into the flat (increasing)
 * knot vector by repeating each distinct abscissa according to its multiplicity.
 * The constructor type used for the result depends on whether the source sequence
 * allows C0-discontinuities (`isSequenceUpToC0Discontinuity`).
 *
 * @param strictIncSeq - The strictly increasing open knot sequence for a closed curve to convert.
 * @returns The equivalent increasing open knot sequence for a closed curve.
 */
export function fromStrictlyIncreasingToIncreasingKnotSequenceCC(strictIncSeq: StrictlyIncreasingOpenKnotSequenceClosedCurve): IncreasingOpenKnotSequenceClosedCurve {
    const knotAbscissae = strictIncSeq.toIncreasingSeqOfAbscissae();
    if(strictIncSeq.isSequenceUpToC0Discontinuity) {
        return new IncreasingOpenKnotSequenceClosedCurve(strictIncSeq.maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knotAbscissae});
    } else {
        return new IncreasingOpenKnotSequenceClosedCurve(strictIncSeq.maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotAbscissae});
    }
}