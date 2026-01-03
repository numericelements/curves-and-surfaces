"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromStrictlyIncreasingToIncreasingKnotSequenceCC = void 0;
const IncreasingOpenKnotSequenceClosedCurve_1 = require("../IncreasingOpenKnotSequenceClosedCurve");
const KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
function fromStrictlyIncreasingToIncreasingKnotSequenceCC(strictIncSeq) {
    const knotAbscissae = strictIncSeq.toIncreasingSeqOfAbscissae();
    if (strictIncSeq.isSequenceUpToC0Discontinuity) {
        return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(strictIncSeq.maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knotAbscissae });
    }
    else {
        return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(strictIncSeq.maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotAbscissae });
    }
}
exports.fromStrictlyIncreasingToIncreasingKnotSequenceCC = fromStrictlyIncreasingToIncreasingKnotSequenceCC;
