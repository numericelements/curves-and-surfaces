import { IncreasingPeriodicKnotSequenceClosedCurve } from "../IncreasingPeriodicKnotSequenceClosedCurve";
import { STRICTLYINCREASINGPERIODICKNOTSEQUENCE } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "../StrictlyIncreasingPeriodicKnotSequenceClosedCurve";

export function fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(increasingSeq: IncreasingPeriodicKnotSequenceClosedCurve): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultOrder,  {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
}