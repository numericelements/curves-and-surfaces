import { EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION } from "../../ErrorMessages/KnotSequences";
import { ErrorLog } from "../../errorProcessing/ErrorLoging";
import { IncreasingOpenKnotSequenceClosedCurve } from "../IncreasingOpenKnotSequenceClosedCurve";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "../IncreasingPeriodicKnotSequenceClosedCurve";
import { INCREASINGPERIODICKNOTSEQUENCE } from "../KnotSequenceConstructorInterface";

/**
 * Converts an {@link IncreasingOpenKnotSequenceClosedCurve} to the equivalent
 * {@link IncreasingPeriodicKnotSequenceClosedCurve}.
 *
 * @description
 * An open knot sequence for a closed curve carries wrap-around copies of the
 * boundary knots at both ends. This function strips those copies to recover the
 * minimal periodic knot vector. When the sequence contains a C0-discontinuity
 * (i.e. `isSequenceUpToC0Discontinuity` is `true`), any knot whose multiplicity
 * equals `maxMultiplicityOrder` would produce a C0-discontinuity in the periodic
 * domain, which is not representable; the conversion is therefore rejected.
 *
 * @param increasingSeq - The increasing open knot sequence describing a closed curve.
 * @returns The equivalent increasing periodic knot sequence.
 * @throws {RangeError} If the sequence has `isSequenceUpToC0Discontinuity` set and
 *   any knot multiplicity equals `maxMultiplicityOrder`.
 */
export function fromIncreasingOpentoIncreasingPeriodicKnotSequence(increasingSeq: IncreasingOpenKnotSequenceClosedCurve): IncreasingPeriodicKnotSequenceClosedCurve {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    const indexOrigin = increasingSeq.indexKnotOrigin.knotIndex;
    const knotAbscissae = [...increasingSeq.allAbscissae];
    knotAbscissae.splice(knotAbscissae.length - 1 - (indexOrigin - 1), indexOrigin);
    knotAbscissae.splice(0, indexOrigin);
    if(increasingSeq.isSequenceUpToC0Discontinuity) {
        const multiplicities = increasingSeq.multiplicities();
        for(const multiplicity of multiplicities) {
            if(multiplicity === maxMultOrder) {
                const error = new ErrorLog("function", "fromIncreasingOpentoIncreasingPeriodicKnotSequence");
                error.addMessage(EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION);
                console.log(error.generateMessageString());
                throw new RangeError(error.generateMessageString());
            }
        }
    }
    return new IncreasingPeriodicKnotSequenceClosedCurve(maxMultOrder - 1, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotAbscissae});
}