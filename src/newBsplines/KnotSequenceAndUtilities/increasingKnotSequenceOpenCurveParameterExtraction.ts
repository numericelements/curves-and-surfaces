import { IncreasingOpenKnotSequenceInterface } from "../IncreasingOpenKnotSequenceInterface";
import { increasingKnotSequenceExtractionInterface } from "./increasingKnotSequenceExtractionInterface";

/**
 * Extracts the parameters of the normalised B-spline basis window from an increasing
 * open knot sequence.
 *
 * @description
 * Locates the flat index of the origin knot and the flat index of the knot at `uMax`,
 * which together delimit the parameter window over which the normalised B-spline basis
 * is defined. The full flat knot vector is returned unchanged.
 *
 * @param knotSeq - The increasing open knot sequence to extract from.
 * @returns A descriptor containing the full knot vector and the flat indices delimiting
 *   the normalised basis window (from the origin knot to the knot at `uMax`).
 */
export function increasingKnotSequenceParameterExtraction(knotSeq: IncreasingOpenKnotSequenceInterface): increasingKnotSequenceExtractionInterface {
    const indexOriginIncreasingSeq = knotSeq.toKnotIndexIncreasingSequence(knotSeq.indexKnotOrigin).knotIndex;
    let indexRightBoundNormBasis = indexOriginIncreasingSeq;
    for(let index = indexOriginIncreasingSeq; index < knotSeq.allAbscissae.length; index++) {
        if(knotSeq.allAbscissae[index] === knotSeq.uMax) {
            indexRightBoundNormBasis = index;
            break;
        }
    }
    return { maxMultiplicityOrder: knotSeq.maxMultiplicityOrder, indexLeft: indexOriginIncreasingSeq, indexRight: indexRightBoundNormBasis ,knots: knotSeq.allAbscissae };
}