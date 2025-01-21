"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromIncreasingOpentoIncreasingPeriodicKnotSequence = void 0;
var KnotSequences_1 = require("../../ErrorMessages/KnotSequences");
var ErrorLoging_1 = require("../../errorProcessing/ErrorLoging");
var IncreasingPeriodicKnotSequenceClosedCurve_1 = require("../IncreasingPeriodicKnotSequenceClosedCurve");
var KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
function fromIncreasingOpentoIncreasingPeriodicKnotSequence(increasingSeq) {
    var e_1, _a;
    var maxMultOrder = increasingSeq.maxMultiplicityOrder;
    var indexOrigin = increasingSeq.indexKnotOrigin.knotIndex;
    var knotAbscissae = increasingSeq.allAbscissae;
    knotAbscissae.splice(knotAbscissae.length - 1 - (indexOrigin - 1), indexOrigin);
    knotAbscissae.splice(0, indexOrigin);
    if (increasingSeq.isSequenceUpToC0Discontinuity) {
        var multiplicities = increasingSeq.multiplicities();
        try {
            for (var multiplicities_1 = __values(multiplicities), multiplicities_1_1 = multiplicities_1.next(); !multiplicities_1_1.done; multiplicities_1_1 = multiplicities_1.next()) {
                var multiplicity = multiplicities_1_1.value;
                if (multiplicity === maxMultOrder) {
                    var error = new ErrorLoging_1.ErrorLog("function", "fromIncreasingOpentoIncreasingPeriodicKnotSequence");
                    error.addMessage(KnotSequences_1.EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION);
                    console.log(error.generateMessageString());
                    throw new RangeError(error.generateMessageString());
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (multiplicities_1_1 && !multiplicities_1_1.done && (_a = multiplicities_1.return)) _a.call(multiplicities_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultOrder - 1, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotAbscissae });
}
exports.fromIncreasingOpentoIncreasingPeriodicKnotSequence = fromIncreasingOpentoIncreasingPeriodicKnotSequence;
