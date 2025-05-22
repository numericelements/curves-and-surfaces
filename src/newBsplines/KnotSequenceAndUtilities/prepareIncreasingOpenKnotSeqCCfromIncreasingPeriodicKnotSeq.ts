import { IncreasingPeriodicKnotSequenceClosedCurve } from "../IncreasingPeriodicKnotSequenceClosedCurve";
import { KnotIndexStrictlyIncreasingSequence } from "../KnotIndexStrictlyIncreasingSequence";
import { fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence } from "../KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence";
import { fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC } from "./fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC";

export function prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq(increasingSeq: IncreasingPeriodicKnotSequenceClosedCurve): {knots: number[], multiplicities: number[], uMax: number, indexKnotOrigin: KnotIndexStrictlyIncreasingSequence} {
    const strictlyIncPeriodicSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(increasingSeq);
    const strictlyIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictlyIncPeriodicSeq);
    return {knots: strictlyIncSeq.allAbscissae, multiplicities: strictlyIncSeq.multiplicities(), uMax: strictlyIncSeq.uMax, indexKnotOrigin: strictlyIncSeq.indexKnotOrigin};
}