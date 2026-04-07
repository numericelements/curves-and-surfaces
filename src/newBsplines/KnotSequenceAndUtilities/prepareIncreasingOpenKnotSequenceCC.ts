import { EM_MAXMULTIPLICITY_ORDER_KNOT } from "../../ErrorMessages/KnotSequences";
import { ErrorLog } from "../../errorProcessing/ErrorLoging";
import { KNOT_SEQUENCE_ORIGIN } from "../../namedConstants/KnotSequences";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "../IncreasingPeriodicKnotSequenceClosedCurve";
import { KnotIndexStrictlyIncreasingSequence } from "../KnotIndexStrictlyIncreasingSequence";
import { IncreasingOpenKnotSequenceCCurve, INCREASINGPERIODICKNOTSEQUENCE } from "../KnotSequenceConstructorInterface";
import { prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq } from "./prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq";

/**
 * Prepares the knot data needed to construct an increasing open knot sequence for a
 * closed curve from a user-supplied periodic knot parameter object.
 *
 * @description
 * Examines the multiplicity of the first knot in `knotParameters.periodicKnots` relative
 * to `maxMultiplicityOrder` and branches accordingly:
 * - If the first-knot multiplicity is **less than** `maxMultiplicityOrder`, the input is
 *   treated as a purely periodic sequence and delegated to
 *   {@link prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq} for conversion.
 * - If it **equals** `maxMultiplicityOrder`, the input already carries clamped boundary
 *   knots; the function compresses it directly into a compact (strictly increasing) form.
 * - If it **exceeds** `maxMultiplicityOrder`, the input is invalid and a `RangeError` is thrown.
 *
 * @param maxMultiplicityOrder - Maximum allowed multiplicity order for the sequence.
 * @param knotParameters - Constructor parameter object carrying the raw periodic knot abscissae.
 * @returns An object containing the compact knot abscissae, multiplicities, upper parameter
 *   bound `uMax`, and the origin knot index ready for the open-sequence constructor.
 * @throws {RangeError} If the multiplicity of the first knot exceeds `maxMultiplicityOrder`.
 */
export function prepareIncreasingOpenKnotSequenceCC(maxMultiplicityOrder: number, knotParameters: IncreasingOpenKnotSequenceCCurve): {knots: readonly number[], multiplicities: readonly number[], uMax: number, indexKnotOrigin: KnotIndexStrictlyIncreasingSequence} {
    let multiplicityFirstKnot = 0;
    let i = 0;
    while(knotParameters.periodicKnots[i] === KNOT_SEQUENCE_ORIGIN) {
        i++;
        multiplicityFirstKnot++;
    }
    if(multiplicityFirstKnot < maxMultiplicityOrder) {
        const periodicSeq = new IncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotParameters.periodicKnots});
        const openSequence = prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq(periodicSeq);
        return {knots: openSequence.knots, multiplicities: openSequence.multiplicities, uMax: openSequence.uMax, indexKnotOrigin: openSequence.indexKnotOrigin};
    } else if(multiplicityFirstKnot === maxMultiplicityOrder) {
        const knots: number[] = [];
        const multiplicities: number[] = [];
        knots.push(knotParameters.periodicKnots[0]);
        multiplicities.push(1);
        for(let i = 1; i < knotParameters.periodicKnots.length; i++) {
            if(knotParameters.periodicKnots[i] === knots[knots.length - 1]) {
                multiplicities[multiplicities.length - 1]++;
            } else {
                knots.push(knotParameters.periodicKnots[i]);
                multiplicities.push(1);
            }
        }
        return {knots: knots, multiplicities: multiplicities, uMax: knotParameters.periodicKnots[knotParameters.periodicKnots.length - 1], indexKnotOrigin:  new KnotIndexStrictlyIncreasingSequence(0)};
    } else {
        const error = new ErrorLog('prepareIncreasingOpenKnotSequenceCC', 'prepareIncreasingOpenKnotSequenceCC');
        error.addMessage(EM_MAXMULTIPLICITY_ORDER_KNOT);
        console.log(error.generateMessageString());
        throw new RangeError(error.generateMessageString());
    }
}