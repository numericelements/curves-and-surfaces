import { IncreasingOpenKnotSequenceClosedCurve } from "../IncreasingOpenKnotSequenceClosedCurve";
import { STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "../StrictlyIncreasingOpenKnotSequenceClosedCurve";

/**
 * Converts an {@link IncreasingOpenKnotSequenceClosedCurve} to the equivalent
 * {@link StrictlyIncreasingOpenKnotSequenceClosedCurve}.
 *
 * @description
 * Compresses the flat (increasing) knot vector into its compact representation by
 * collecting distinct abscissae and their associated multiplicities. The constructor
 * type used for the result depends on whether the source sequence allows
 * C0-discontinuities (`isSequenceUpToC0Discontinuity`).
 *
 * @param increasingSeq - The increasing open knot sequence for a closed curve to convert.
 * @returns The equivalent strictly increasing open knot sequence for a closed curve.
 */
export function fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(increasingSeq: IncreasingOpenKnotSequenceClosedCurve): StrictlyIncreasingOpenKnotSequenceClosedCurve {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    if(increasingSeq.isSequenceUpToC0Discontinuity) {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
    } else {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
    }
}