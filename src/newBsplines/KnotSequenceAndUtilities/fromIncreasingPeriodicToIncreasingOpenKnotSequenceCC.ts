import { IncreasingOpenKnotSequenceClosedCurve } from "../IncreasingOpenKnotSequenceClosedCurve";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "../IncreasingPeriodicKnotSequenceClosedCurve";
import { KnotIndexStrictlyIncreasingSequence } from "../KnotIndexStrictlyIncreasingSequence";
import { INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from "../KnotSequenceConstructorInterface";
import { fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence } from "../KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence";

/**
 * Converts an {@link IncreasingPeriodicKnotSequenceClosedCurve} to the equivalent
 * {@link IncreasingOpenKnotSequenceClosedCurve}.
 *
 * @description
 * A periodic knot sequence carries only the minimal set of knots covering one period.
 * This function extends it into an open (clamped) representation by prepending and
 * appending wrap-around copies of the boundary knots, shifted by the period length.
 * The number of copies added at each end is `maxMultiplicityOrder - (multiplicityAtOrigin - 1)`,
 * ensuring that the resulting open sequence has the correct clamping structure for
 * closed-curve B-spline evaluation.
 *
 * @param increasingSeq - The increasing periodic knot sequence to convert.
 * @returns The equivalent increasing open knot sequence for a closed curve.
 */
export function fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(increasingSeq: IncreasingPeriodicKnotSequenceClosedCurve): IncreasingOpenKnotSequenceClosedCurve {
    const knotsOpenSequence: number[] = [];
    const multiplicityAtOrigin = increasingSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0));
    const strictlyIncSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(increasingSeq);
    const strictSeqLength = strictlyIncSeq.length();
    const lastAbscissa = strictlyIncSeq.uMax;
    let knotNumber = 1;
    for( let i = 1; i <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)); i++) {
        for(let j = 0; j < strictlyIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(strictSeqLength - 1 - i)); j++) {
            if (knotNumber <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)))
                knotsOpenSequence.splice(0, 0,(strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(strictSeqLength - 1 - i)) - lastAbscissa));
            else break;
            knotNumber++;
        }
        if (knotNumber > (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1))) break;
    }
    for(const knot of increasingSeq) {
        if(knot !== undefined) knotsOpenSequence.push(knot);
    }
    knotNumber = 1;
    for(let i = 1; i <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)); i++) {
        for(let j = 0; j <strictlyIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i)); j++) {
            if (knotNumber <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1))) {
                if(i === (strictSeqLength - 1)) {
                    knotsOpenSequence.push(lastAbscissa + (lastAbscissa - strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(0))));
                } else {
                    knotsOpenSequence.push(lastAbscissa + (strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(i)) - strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(0))));
                }
            } else break;
            knotNumber++;
        }
        if (knotNumber > (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1))) break;
    }
    return new IncreasingOpenKnotSequenceClosedCurve(increasingSeq.maxMultiplicityOrder + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotsOpenSequence});
}