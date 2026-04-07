import { IncreasingPeriodicKnotSequenceClosedCurve } from "../IncreasingPeriodicKnotSequenceClosedCurve";
import { STRICTLYINCREASINGPERIODICKNOTSEQUENCE } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "../StrictlyIncreasingPeriodicKnotSequenceClosedCurve";

/**
 * Converts an {@link IncreasingPeriodicKnotSequenceClosedCurve} to the equivalent
 * {@link StrictlyIncreasingPeriodicKnotSequenceClosedCurve}.
 *
 * @description
 * Compresses the flat (increasing) knot vector into its compact representation by
 * collecting distinct abscissae and their associated multiplicities.
 *
 * @param increasingSeq - The increasing periodic knot sequence to convert.
 * @returns The equivalent strictly increasing periodic knot sequence.
 */
export function fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(increasingSeq: IncreasingPeriodicKnotSequenceClosedCurve): StrictlyIncreasingPeriodicKnotSequenceClosedCurve {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultOrder,  {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities()});
}