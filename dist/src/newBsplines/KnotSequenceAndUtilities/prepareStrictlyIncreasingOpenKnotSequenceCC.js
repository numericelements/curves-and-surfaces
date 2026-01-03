"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareStrictlyIncreasingOpenKnotSequenceCC = void 0;
const KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
const StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1 = require("../StrictlyIncreasingPeriodicKnotSequenceClosedCurve");
const KnotIndexStrictlyIncreasingSequence_1 = require("../KnotIndexStrictlyIncreasingSequence");
const prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1 = require("./prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq");
const KnotSequences_1 = require("../../namedConstants/KnotSequences");
function prepareStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, knotParameters) {
    if (knotParameters.multiplicities[0] < maxMultiplicityOrder) {
        const strictIncPeriodicSeq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotParameters.periodicKnots, multiplicities: knotParameters.multiplicities });
        const openSequence = (0, prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq_1.prepareStrictlyIncreasingOpenKnotSeqCCfromStrictlyIncreasingPeriodicKnotSeq)(strictIncPeriodicSeq);
        let indexOrigin = Infinity;
        for (let index = 0; index < openSequence.knots.length; index++) {
            if (openSequence.knots[index] > (KnotSequences_1.KNOT_SEQUENCE_ORIGIN - KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) && openSequence.knots[index] < (KnotSequences_1.KNOT_SEQUENCE_ORIGIN + KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE))
                indexOrigin = index;
        }
        return { knots: openSequence.knots, multiplicities: openSequence.multiplicities, uMax: strictIncPeriodicSeq.uMax, indexKnotOrigin: new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(indexOrigin) };
    }
    else {
        return { knots: knotParameters.periodicKnots, multiplicities: knotParameters.multiplicities, uMax: knotParameters.periodicKnots[knotParameters.periodicKnots.length - 1], indexKnotOrigin: new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0) };
    }
}
exports.prepareStrictlyIncreasingOpenKnotSequenceCC = prepareStrictlyIncreasingOpenKnotSequenceCC;
