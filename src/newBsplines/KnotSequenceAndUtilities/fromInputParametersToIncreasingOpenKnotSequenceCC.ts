import { KNOT_SEQUENCE_ORIGIN } from "../../namedConstants/KnotSequences";
import { IncreasingOpenKnotSequenceClosedCurve } from "../IncreasingOpenKnotSequenceClosedCurve";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "../IncreasingPeriodicKnotSequenceClosedCurve";
import { IncreasingOpenKnotSequenceCCurve, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, INCREASINGPERIODICKNOTSEQUENCE } from "../KnotSequenceConstructorInterface";
import { fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC } from "./fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC";

export function fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder: number, knotParameters: IncreasingOpenKnotSequenceCCurve): IncreasingOpenKnotSequenceClosedCurve {
    let multiplicityFirstKnot = 0;
    let i = 0;
    while(knotParameters.periodicKnots[i] === KNOT_SEQUENCE_ORIGIN) {
        i++;
        multiplicityFirstKnot++;
    }
    if(multiplicityFirstKnot < maxMultiplicityOrder) {
        const periodicSeq = new IncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotParameters.periodicKnots});
        const openSequence = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(periodicSeq);
        return new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: openSequence.allAbscissae});
    } else {
        return new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotParameters.periodicKnots});
    }
}