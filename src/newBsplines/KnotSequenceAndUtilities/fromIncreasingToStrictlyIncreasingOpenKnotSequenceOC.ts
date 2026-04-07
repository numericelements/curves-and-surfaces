import { IncreasingOpenKnotSequenceOpenCurve } from "../IncreasingOpenKnotSequenceOpenCurve";
import { STRICTLYINCREASINGOPENKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "../StrictlyIncreasingOpenKnotSequenceOpenCurve";

/**
 * Converts an {@link IncreasingOpenKnotSequenceOpenCurve} to the equivalent
 * {@link StrictlyIncreasingOpenKnotSequenceOpenCurve}.
 *
 * @description
 * Compresses the flat (increasing) knot vector into its compact representation by
 * collecting distinct abscissae and their associated multiplicities. The constructor
 * type used for the result depends on whether the source sequence allows
 * C0-discontinuities (`isSequenceUpToC0Discontinuity`).
 *
 * @param increasingSeq - The increasing open knot sequence for an open curve to convert.
 * @returns The equivalent strictly increasing open knot sequence for an open curve.
 */
export function fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(increasingSeq: IncreasingOpenKnotSequenceOpenCurve): StrictlyIncreasingOpenKnotSequenceOpenCurve {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    if(increasingSeq.isSequenceUpToC0Discontinuity) {
        return new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
    } else {
        return new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
    }
}