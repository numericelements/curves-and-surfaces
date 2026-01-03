"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC = void 0;
const KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
const StrictlyIncreasingOpenKnotSequenceClosedCurve_1 = require("../StrictlyIncreasingOpenKnotSequenceClosedCurve");
const prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1 = require("./prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq");
function fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncSeq) {
    const maxMultOrder = strictIncSeq.maxMultiplicityOrder;
    const openSeqParams = (0, prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1.prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq)(strictIncSeq);
    const knotsOpenSequence = openSeqParams.knots;
    const multiplicitiesOpenSequence = openSeqParams.multiplicities;
    return new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder + 1, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotsOpenSequence, multiplicities: multiplicitiesOpenSequence });
}
exports.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC;
