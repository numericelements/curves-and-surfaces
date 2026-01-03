"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq = void 0;
const fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1 = require("../KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence");
const fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1 = require("./fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC");
function prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq(increasingSeq) {
    const strictlyIncPeriodicSeq = (0, fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence)(increasingSeq);
    const strictlyIncSeq = (0, fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC_1.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC)(strictlyIncPeriodicSeq);
    return { knots: strictlyIncSeq.allAbscissae, multiplicities: strictlyIncSeq.multiplicities(), uMax: strictlyIncSeq.uMax, indexKnotOrigin: strictlyIncSeq.indexKnotOrigin };
}
exports.prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq = prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq;
