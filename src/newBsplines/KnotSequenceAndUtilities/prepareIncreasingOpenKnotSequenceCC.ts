import { EM_MAXMULTIPLICITY_ORDER_KNOT } from "../../ErrorMessages/KnotSequences";
import { ErrorLog } from "../../errorProcessing/ErrorLoging";
import { KNOT_SEQUENCE_ORIGIN } from "../../namedConstants/KnotSequences";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "../IncreasingPeriodicKnotSequenceClosedCurve";
import { KnotIndexStrictlyIncreasingSequence } from "../KnotIndexStrictlyIncreasingSequence";
import { IncreasingOpenKnotSequenceCCurve, INCREASINGPERIODICKNOTSEQUENCE } from "../KnotSequenceConstructorInterface";
import { prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq } from "./prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq";

export function prepareIncreasingOpenKnotSequenceCC(maxMultiplicityOrder: number, knotParameters: IncreasingOpenKnotSequenceCCurve): {knots: number[], multiplicities: number[], uMax: number, indexKnotOrigin: KnotIndexStrictlyIncreasingSequence} {
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