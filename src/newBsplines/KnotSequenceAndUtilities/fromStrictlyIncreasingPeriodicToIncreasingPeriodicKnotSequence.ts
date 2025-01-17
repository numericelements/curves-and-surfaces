import { IncreasingPeriodicKnotSequenceClosedCurve } from "../IncreasingPeriodicKnotSequenceClosedCurve";
import { INCREASINGPERIODICKNOTSEQUENCE } from "../KnotSequenceConstructorInterface";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "../StrictlyIncreasingPeriodicKnotSequenceClosedCurve";

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