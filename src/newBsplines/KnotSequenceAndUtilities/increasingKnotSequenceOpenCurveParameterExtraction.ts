import { IncreasingOpenKnotSequenceInterface } from "../IncreasingOpenKnotSequenceInterface";
import { increasingKnotSequenceExtractionInterface } from "./increasingKnotSequenceExtractionInterface";

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