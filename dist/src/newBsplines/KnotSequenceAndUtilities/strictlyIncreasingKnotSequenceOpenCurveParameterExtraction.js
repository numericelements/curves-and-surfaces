"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictlyIncreasingKnotSequenceParameterExtraction = void 0;
function strictlyIncreasingKnotSequenceParameterExtraction(knotSeq) {
    const indexOriginIncreasingSeq = knotSeq.indexKnotOrigin.knotIndex;
    let indexRightBoundNormBasis = indexOriginIncreasingSeq;
    for (let index = indexOriginIncreasingSeq; index < knotSeq.allAbscissae.length; index++) {
        if (knotSeq.allAbscissae[index] === knotSeq.uMax) {
            indexRightBoundNormBasis = index;
            break;
        }
    }
    return { maxMultiplicityOrder: knotSeq.maxMultiplicityOrder, indexLeft: indexOriginIncreasingSeq, indexRight: indexRightBoundNormBasis, knots: knotSeq.allAbscissae, multiplicities: knotSeq.multiplicities() };
}
exports.strictlyIncreasingKnotSequenceParameterExtraction = strictlyIncreasingKnotSequenceParameterExtraction;
