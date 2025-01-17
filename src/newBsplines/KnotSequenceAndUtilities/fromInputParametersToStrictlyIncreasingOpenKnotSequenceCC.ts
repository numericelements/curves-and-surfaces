import { fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC } from "./fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC";
import { StrictlyIncreasingOpenKnotSequenceCCurve, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, STRICTLYINCREASINGPERIODICKNOTSEQUENCE } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "../StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "../StrictlyIncreasingPeriodicKnotSequenceClosedCurve";

export function fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder: number, knotParameters: StrictlyIncreasingOpenKnotSequenceCCurve): StrictlyIncreasingOpenKnotSequenceClosedCurve {
    if(knotParameters.multiplicities[0] < maxMultiplicityOrder) {
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotParameters.periodicKnots, multiplicities: knotParameters.multiplicities});
        const openSequence = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncPeriodicSeq);
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: openSequence.allAbscissae, multiplicities: openSequence.multiplicities()});
    } else {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotParameters.periodicKnots, multiplicities: knotParameters.multiplicities});
    }
}