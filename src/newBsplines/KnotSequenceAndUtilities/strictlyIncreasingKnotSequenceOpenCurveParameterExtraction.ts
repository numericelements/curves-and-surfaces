import { StrictlyIncreasingOpenKnotSequenceInterface } from "../StrictlyIncreasingOpenKnotSequenceInterface";
import { strictlyIncreasingKnotSequenceExtractionInterface } from "./strictlyIncreasingKnotSequenceExtractionInterface";

/**
 * Extracts the parameters of the normalised B-spline basis window from a strictly
 * increasing open knot sequence.
 *
 * @description
 * Locates the strictly increasing index of the origin knot and the strictly increasing
 * index of the knot at `uMax`, which together delimit the parameter window over which
 * the normalised B-spline basis is defined. The compact knot vector and its associated
 * multiplicity array are returned unchanged.
 *
 * @param knotSeq - The strictly increasing open knot sequence to extract from.
 * @returns A descriptor containing the compact knot vector, its multiplicities, and the
 *   strictly increasing indices delimiting the normalised basis window.
 */
export function strictlyIncreasingKnotSequenceParameterExtraction(knotSeq: StrictlyIncreasingOpenKnotSequenceInterface): strictlyIncreasingKnotSequenceExtractionInterface {
    const indexOriginIncreasingSeq = knotSeq.indexKnotOrigin.knotIndex;
    let indexRightBoundNormBasis = indexOriginIncreasingSeq;
    for(let index = indexOriginIncreasingSeq; index < knotSeq.allAbscissae.length; index++) {
        if(knotSeq.allAbscissae[index] === knotSeq.uMax) {
            indexRightBoundNormBasis = index;
            break;
        }
    }
    return { maxMultiplicityOrder: knotSeq.maxMultiplicityOrder, indexLeft: indexOriginIncreasingSeq, indexRight: indexRightBoundNormBasis ,knots: knotSeq.allAbscissae, multiplicities: knotSeq.multiplicities() };
}