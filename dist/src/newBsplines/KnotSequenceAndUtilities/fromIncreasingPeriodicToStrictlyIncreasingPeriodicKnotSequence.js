"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence = void 0;
const KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
const StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1 = require("../StrictlyIncreasingPeriodicKnotSequenceClosedCurve");
function fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(increasingSeq) {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities() });
}
exports.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence;
