"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence = void 0;
var KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
var StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1 = require("../StrictlyIncreasingPeriodicKnotSequenceClosedCurve");
function fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(increasingSeq) {
    var maxMultOrder = increasingSeq.maxMultiplicityOrder;
    return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: increasingSeq.distinctAbscissae(), multiplicities: increasingSeq.multiplicities() });
}
exports.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence;
