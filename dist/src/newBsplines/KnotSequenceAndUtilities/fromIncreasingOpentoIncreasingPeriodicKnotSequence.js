"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromIncreasingOpentoIncreasingPeriodicKnotSequence = void 0;
const KnotSequences_1 = require("../../ErrorMessages/KnotSequences");
const ErrorLoging_1 = require("../../errorProcessing/ErrorLoging");
const IncreasingPeriodicKnotSequenceClosedCurve_1 = require("../IncreasingPeriodicKnotSequenceClosedCurve");
const KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
function fromIncreasingOpentoIncreasingPeriodicKnotSequence(increasingSeq) {
    const maxMultOrder = increasingSeq.maxMultiplicityOrder;
    const indexOrigin = increasingSeq.indexKnotOrigin.knotIndex;
    const knotAbscissae = increasingSeq.allAbscissae;
    knotAbscissae.splice(knotAbscissae.length - 1 - (indexOrigin - 1), indexOrigin);
    knotAbscissae.splice(0, indexOrigin);
    if (increasingSeq.isSequenceUpToC0Discontinuity) {
        const multiplicities = increasingSeq.multiplicities();
        for (const multiplicity of multiplicities) {
            if (multiplicity === maxMultOrder) {
                const error = new ErrorLoging_1.ErrorLog("function", "fromIncreasingOpentoIncreasingPeriodicKnotSequence");
                error.addMessage(KnotSequences_1.EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION);
                console.log(error.generateMessageString());
                throw new RangeError(error.generateMessageString());
            }
        }
    }
    return new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultOrder - 1, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotAbscissae });
}
exports.fromIncreasingOpentoIncreasingPeriodicKnotSequence = fromIncreasingOpentoIncreasingPeriodicKnotSequence;
