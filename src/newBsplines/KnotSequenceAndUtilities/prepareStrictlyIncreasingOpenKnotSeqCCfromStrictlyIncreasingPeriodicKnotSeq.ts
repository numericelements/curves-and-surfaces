import { KnotIndexStrictlyIncreasingSequence } from "../KnotIndexStrictlyIncreasingSequence";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "../StrictlyIncreasingPeriodicKnotSequenceClosedCurve";

/**
 * Prepares the compact knot data (abscissae + multiplicities) needed to construct a
 * strictly increasing open knot sequence for a closed curve from a strictly increasing
 * periodic knot sequence.
 *
 * @description
 * Converts a compact periodic sequence into an open (clamped) compact sequence by
 * prepending and appending wrap-around knots shifted by the period length
 * (`uMax − u₀`). The number of complementary knots added at each boundary is
 * determined dynamically so that the cumulative multiplicity from the origin never
 * exceeds `maxMultiplicityOrder`.
 *
 * The algorithm runs two symmetric passes:
 * - **Left pass** — inserts boundary copies before the origin, taken from near-last
 *   knots of the periodic sequence, shifted by `−uMax`.
 * - **Centre** — copies all knots of the periodic sequence unchanged.
 * - **Right pass** — appends boundary copies after the last knot, taken from
 *   near-first knots of the periodic sequence, shifted by `+uMax`.
 *
 * @param strictIncSeq - Strictly increasing periodic knot sequence to convert.
 * @returns An object with the compact open-sequence knot abscissae (`knots`) and
 *   their multiplicities (`multiplicities`), suitable for passing directly to a
 *   strictly increasing open-sequence constructor.
 */
export function prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq(strictIncSeq: StrictlyIncreasingPeriodicKnotSequenceClosedCurve): {knots: readonly number[], multiplicities: readonly number[]} {
    const knotsOpenSequence: number[] = [];
    const multiplicitiesOpenSequence: number[] = [];
    const maxMultOrder = strictIncSeq.maxMultiplicityOrder;
    const lastIndex = strictIncSeq.length() - 1;
    const lastAbscissa = strictIncSeq.uMax;
    const multiplicityAtOrigin = strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0));
    let nbComplementaryKnots = maxMultOrder - (multiplicityAtOrigin - 1);
    let index = 0;
    while(index < nbComplementaryKnots) {
        const multiplicityExcess = nbComplementaryKnots - strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(lastIndex - (index + 1))) - index;
        if(multiplicityExcess <= 0) {
            nbComplementaryKnots = index + 1;
            break;
        } else if(multiplicityExcess < (nbComplementaryKnots - (index + 1))) {
            nbComplementaryKnots = nbComplementaryKnots - multiplicityExcess;
            index++;
        } else {
            index++;
        }
    }
    let cumulativeMultiplicityFromOrigin = multiplicityAtOrigin;
    for(let i = 0; i < nbComplementaryKnots; i++) {
        knotsOpenSequence.splice(0, 0, (strictIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(lastIndex - (i + 1))) - lastAbscissa));
        let multiplicityCurrentKnot = strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(lastIndex - (i + 1)));
        if((cumulativeMultiplicityFromOrigin + multiplicityCurrentKnot) > maxMultOrder) {
            multiplicityCurrentKnot = maxMultOrder - cumulativeMultiplicityFromOrigin + 1;
        }
        cumulativeMultiplicityFromOrigin += multiplicityCurrentKnot;
        multiplicitiesOpenSequence.splice(0, 0, multiplicityCurrentKnot);
    }
    for(const knot of strictIncSeq) {
        if(knot !== undefined) {
            knotsOpenSequence.push(knot.abscissa);
            multiplicitiesOpenSequence.push(knot.multiplicity);
        }
    }
    nbComplementaryKnots = maxMultOrder - (multiplicityAtOrigin - 1);
    index = 0;
    while(index < nbComplementaryKnots) {
        const multiplicityExcess = nbComplementaryKnots - strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(index + 1)) - index;
        if(multiplicityExcess <= 0) {
            nbComplementaryKnots = index + 1;
            break;
        } else if(multiplicityExcess < (nbComplementaryKnots - (index + 1))) {
            nbComplementaryKnots = nbComplementaryKnots - multiplicityExcess;
            index++;
        } else {
            index++;
        }
    }
    cumulativeMultiplicityFromOrigin = multiplicityAtOrigin;
    for(let i = 0; i < nbComplementaryKnots; i++) {
        if((i + 1) === lastIndex) {
            knotsOpenSequence.push(lastAbscissa + (lastAbscissa - strictIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(0))));
        } else {
            knotsOpenSequence.push(lastAbscissa + (strictIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(i + 1)) - strictIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(0))));
        }
        let multiplicityCurrentKnot = strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i + 1));
        if((cumulativeMultiplicityFromOrigin + multiplicityCurrentKnot) > maxMultOrder) {
            multiplicityCurrentKnot = maxMultOrder - cumulativeMultiplicityFromOrigin + 1;
        }
        cumulativeMultiplicityFromOrigin += multiplicityCurrentKnot;
        multiplicitiesOpenSequence.push(multiplicityCurrentKnot);
    }
    return {knots: knotsOpenSequence, multiplicities: multiplicitiesOpenSequence};
}
