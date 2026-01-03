"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC = void 0;
const KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
const StrictlyIncreasingOpenKnotSequenceOpenCurve_1 = require("../StrictlyIncreasingOpenKnotSequenceOpenCurve");
function fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(increasingSeq) {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    if (increasingSeq.isSequenceUpToC0Discontinuity) {
        return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities() });
    }
    else {
        return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities() });
    }
}
exports.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC;
