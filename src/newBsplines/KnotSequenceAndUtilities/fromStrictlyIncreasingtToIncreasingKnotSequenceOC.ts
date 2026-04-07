import { IncreasingOpenKnotSequenceOpenCurve } from "../IncreasingOpenKnotSequenceOpenCurve";
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "../StrictlyIncreasingOpenKnotSequenceOpenCurve";

/**
 * Converts a {@link StrictlyIncreasingOpenKnotSequenceOpenCurve} to the equivalent
 * {@link IncreasingOpenKnotSequenceOpenCurve}.
 *
 * @description
 * Expands the compact (strictly increasing) representation into the flat (increasing)
 * knot vector by repeating each distinct abscissa according to its multiplicity.
 * The constructor type used for the result depends on whether the source sequence
 * allows C0-discontinuities (`isSequenceUpToC0Discontinuity`).
 *
 * @param strictIncSeq - The strictly increasing open knot sequence for an open curve to convert.
 * @returns The equivalent increasing open knot sequence for an open curve.
 */
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