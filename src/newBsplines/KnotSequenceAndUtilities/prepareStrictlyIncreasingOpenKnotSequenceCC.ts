import { StrictlyIncreasingOpenKnotSequenceCCurve, STRICTLYINCREASINGPERIODICKNOTSEQUENCE } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "../StrictlyIncreasingPeriodicKnotSequenceClosedCurve";
import { KnotIndexStrictlyIncreasingSequence } from "../KnotIndexStrictlyIncreasingSequence";
import { prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq } from "./prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq";
import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN } from "../../namedConstants/KnotSequences";

export function prepareStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder: number, knotParameters: StrictlyIncreasingOpenKnotSequenceCCurve): {knots: readonly number[], multiplicities: readonly number[], uMax: number, indexKnotOrigin: KnotIndexStrictlyIncreasingSequence} {
    if(knotParameters.multiplicities[0] < maxMultiplicityOrder) {
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotParameters.periodicKnots, multiplicities: knotParameters.multiplicities});
        const openSequence = prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq(strictIncPeriodicSeq);
        let indexOrigin = Infinity;
        for(let index = 0; index < openSequence.knots.length; index++) {
            if(openSequence.knots[index] > (KNOT_SEQUENCE_ORIGIN - KNOT_COINCIDENCE_TOLERANCE) && openSequence.knots[index] < (KNOT_SEQUENCE_ORIGIN + KNOT_COINCIDENCE_TOLERANCE)) indexOrigin = index
        }
        return {knots: openSequence.knots, multiplicities: openSequence.multiplicities, uMax: strictIncPeriodicSeq.uMax, indexKnotOrigin: new KnotIndexStrictlyIncreasingSequence(indexOrigin)};
    } else {
        return {knots: knotParameters.periodicKnots, multiplicities: knotParameters.multiplicities, uMax: knotParameters.periodicKnots[knotParameters.periodicKnots.length - 1], indexKnotOrigin:  new KnotIndexStrictlyIncreasingSequence(0)};
    }
}