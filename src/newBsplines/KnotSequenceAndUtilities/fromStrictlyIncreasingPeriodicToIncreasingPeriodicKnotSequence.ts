import { IncreasingPeriodicKnotSequenceClosedCurve } from "../IncreasingPeriodicKnotSequenceClosedCurve";
import { INCREASINGPERIODICKNOTSEQUENCE } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "../StrictlyIncreasingPeriodicKnotSequenceClosedCurve";

/**
 * Converts a {@link StrictlyIncreasingPeriodicKnotSequenceClosedCurve} to the equivalent
 * {@link IncreasingPeriodicKnotSequenceClosedCurve}.
 *
 * @description
 * Expands the compact (strictly increasing) representation into the flat (increasing)
 * knot vector by repeating each distinct abscissa according to its multiplicity.
 *
 * @param strictIncSeq - The strictly increasing periodic knot sequence to convert.
 * @returns The equivalent increasing periodic knot sequence.
 */
export function fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence(strictIncSeq: StrictlyIncreasingPeriodicKnotSequenceClosedCurve): IncreasingPeriodicKnotSequenceClosedCurve {
    const knotAbscissae: number[] = [];
    for (const knot of strictIncSeq) {
        if(knot !== undefined) {
            for(let i = 0; i < knot.multiplicity; i++) {
                knotAbscissae.push(knot.abscissa);
            }
        }
    }
    return new IncreasingPeriodicKnotSequenceClosedCurve(strictIncSeq.maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotAbscissae});
}