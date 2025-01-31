import { StrictlyIncreasingOpenKnotSequenceInterface } from "../StrictlyIncreasingOpenKnotSequenceInterface";
import { strictlyIncreasingKnotSequenceExtractionInterface } from "./strictlyIncreasingKnotSequenceExtractionInterface";

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