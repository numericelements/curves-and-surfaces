"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareIncreasingOpenKnotSequenceCC = void 0;
const KnotSequences_1 = require("../../ErrorMessages/KnotSequences");
const ErrorLoging_1 = require("../../errorProcessing/ErrorLoging");
const KnotSequences_2 = require("../../namedConstants/KnotSequences");
const IncreasingPeriodicKnotSequenceClosedCurve_1 = require("../IncreasingPeriodicKnotSequenceClosedCurve");
const KnotIndexStrictlyIncreasingSequence_1 = require("../KnotIndexStrictlyIncreasingSequence");
const KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
const prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq_1 = require("./prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq");
function prepareIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, knotParameters) {
    let multiplicityFirstKnot = 0;
    let i = 0;
    while (knotParameters.periodicKnots[i] === KnotSequences_2.KNOT_SEQUENCE_ORIGIN) {
        i++;
        multiplicityFirstKnot++;
    }
    if (multiplicityFirstKnot < maxMultiplicityOrder) {
        const periodicSeq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve((maxMultiplicityOrder - 1), { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotParameters.periodicKnots });
        const openSequence = (0, prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq_1.prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq)(periodicSeq);
        return { knots: openSequence.knots, multiplicities: openSequence.multiplicities, uMax: openSequence.uMax, indexKnotOrigin: openSequence.indexKnotOrigin };
    }
    else if (multiplicityFirstKnot === maxMultiplicityOrder) {
        const knots = [];
        const multiplicities = [];
        knots.push(knotParameters.periodicKnots[0]);
        multiplicities.push(1);
        for (let i = 1; i < knotParameters.periodicKnots.length; i++) {
            if (knotParameters.periodicKnots[i] === knots[knots.length - 1]) {
                multiplicities[multiplicities.length - 1]++;
            }
            else {
                knots.push(knotParameters.periodicKnots[i]);
                multiplicities.push(1);
            }
        }
        return { knots: knots, multiplicities: multiplicities, uMax: knotParameters.periodicKnots[knotParameters.periodicKnots.length - 1], indexKnotOrigin: new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0) };
    }
    else {
        const error = new ErrorLoging_1.ErrorLog('function', 'prepareIncreasingOpenKnotSequenceCC');
        error.addMessage(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
        console.log(error.generateMessageString());
        throw new RangeError(error.generateMessageString());
    }
}
exports.prepareIncreasingOpenKnotSequenceCC = prepareIncreasingOpenKnotSequenceCC;
