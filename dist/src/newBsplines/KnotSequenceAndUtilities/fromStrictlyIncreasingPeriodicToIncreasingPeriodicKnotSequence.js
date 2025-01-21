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
exports.fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence = void 0;
var IncreasingPeriodicKnotSequenceClosedCurve_1 = require("../IncreasingPeriodicKnotSequenceClosedCurve");
var KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
function fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence(strictIncSeq) {
    var e_1, _a;
    var knotAbscissae = [];
    try {
        for (var strictIncSeq_1 = __values(strictIncSeq), strictIncSeq_1_1 = strictIncSeq_1.next(); !strictIncSeq_1_1.done; strictIncSeq_1_1 = strictIncSeq_1.next()) {
            var knot = strictIncSeq_1_1.value;
            if (knot !== undefined) {
                for (var i = 0; i < knot.multiplicity; i++) {
                    knotAbscissae.push(knot.abscissa);
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (strictIncSeq_1_1 && !strictIncSeq_1_1.done && (_a = strictIncSeq_1.return)) _a.call(strictIncSeq_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(strictIncSeq.maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knotAbscissae });
}
exports.fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence = fromStrictlyIncreasingPeriodicToIncreasingPeriodicKnotSequence;
