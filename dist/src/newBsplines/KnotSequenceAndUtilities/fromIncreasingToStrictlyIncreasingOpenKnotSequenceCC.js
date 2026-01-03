"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC = void 0;
const KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
const StrictlyIncreasingOpenKnotSequenceClosedCurve_1 = require("../StrictlyIncreasingOpenKnotSequenceClosedCurve");
function fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(increasingSeq) {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    if (increasingSeq.isSequenceUpToC0Discontinuity) {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities() });
    }
    else {
        return new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities() });
    }
}
exports.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC;
