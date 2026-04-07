import { IncreasingPeriodicKnotSequenceClosedCurve } from "../IncreasingPeriodicKnotSequenceClosedCurve";
import { KnotIndexStrictlyIncreasingSequence } from "../KnotIndexStrictlyIncreasingSequence";
import { fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence } from "../KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence";
import { fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC } from "./fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC";

/**
 * Prepares the knot data needed to build an {@link IncreasingOpenKnotSequenceClosedCurve}
 * from an {@link IncreasingPeriodicKnotSequenceClosedCurve}.
 *
 * @description
 * Performs a two-step conversion: first compresses the flat periodic sequence into its
 * strictly increasing form via
 * {@link fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence}, then expands it
 * into a strictly increasing open sequence via
 * {@link fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC}.
 * Returns the constituent arrays required by the open-sequence constructor rather than
 * the sequence object itself, allowing the caller to choose the concrete constructor type.
 *
 * @param increasingSeq - The increasing periodic knot sequence to prepare from.
 * @returns An object containing the compact knot abscissae, multiplicities, upper parameter
 *   bound `uMax`, and the origin knot index of the resulting open sequence.
 */
export function prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq(increasingSeq: IncreasingPeriodicKnotSequenceClosedCurve): {knots: readonly number[], multiplicities: readonly number[], uMax: number, indexKnotOrigin: KnotIndexStrictlyIncreasingSequence} {
    const strictlyIncPeriodicSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(increasingSeq);
    const strictlyIncSeq = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictlyIncPeriodicSeq);
    return {knots: strictlyIncSeq.allAbscissae, multiplicities: strictlyIncSeq.multiplicities(), uMax: strictlyIncSeq.uMax, indexKnotOrigin: strictlyIncSeq.indexKnotOrigin};
}