"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromStrictlyIncreasingtToIncreasingKnotSequenceOC = void 0;
const IncreasingOpenKnotSequenceOpenCurve_1 = require("../IncreasingOpenKnotSequenceOpenCurve");
const KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
function fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strictIncSeq) {
    const knotAbscissae = [];
    const maxMultOrder = strictIncSeq.maxMultiplicityOrder;
    const abscissae = strictIncSeq.distinctAbscissae();
    const multiplicities = strictIncSeq.multiplicities();
    for (let j = 0; j < abscissae.length; j++) {
        for (let i = 0; i < multiplicities[j]; i++) {
            knotAbscissae.push(abscissae[j]);
        }
    }
    if (strictIncSeq.isSequenceUpToC0Discontinuity) {
        return new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knotAbscissae });
    }
    else {
        return new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knotAbscissae });
    }
}
exports.fromStrictlyIncreasingtToIncreasingKnotSequenceOC = fromStrictlyIncreasingtToIncreasingKnotSequenceOC;
