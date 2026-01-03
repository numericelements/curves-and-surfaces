"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.increasingKnotSequenceParameterExtraction = void 0;
function increasingKnotSequenceParameterExtraction(knotSeq) {
    const indexOriginIncreasingSeq = knotSeq.toKnotIndexIncreasingSequence(knotSeq.indexKnotOrigin).knotIndex;
    let indexRightBoundNormBasis = indexOriginIncreasingSeq;
    for (let index = indexOriginIncreasingSeq; index < knotSeq.allAbscissae.length; index++) {
        if (knotSeq.allAbscissae[index] === knotSeq.uMax) {
            indexRightBoundNormBasis = index;
            break;
        }
    }
    return { maxMultiplicityOrder: knotSeq.maxMultiplicityOrder, indexLeft: indexOriginIncreasingSeq, indexRight: indexRightBoundNormBasis, knots: knotSeq.allAbscissae };
}
exports.increasingKnotSequenceParameterExtraction = increasingKnotSequenceParameterExtraction;
