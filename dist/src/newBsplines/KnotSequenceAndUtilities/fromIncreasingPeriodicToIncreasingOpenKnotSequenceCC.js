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
exports.fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC = void 0;
var IncreasingOpenKnotSequenceClosedCurve_1 = require("../IncreasingOpenKnotSequenceClosedCurve");
var KnotIndexStrictlyIncreasingSequence_1 = require("../KnotIndexStrictlyIncreasingSequence");
var KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
var fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1 = require("../KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence");
function fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(increasingSeq) {
    var e_1, _a;
    var knotsOpenSequence = [];
    var multiplicityAtOrigin = increasingSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
    var strictlyIncSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(increasingSeq);
    var strictSeqLength = strictlyIncSeq.length();
    var lastAbscissa = strictlyIncSeq.uMax;
    var knotNumber = 1;
    for (var i = 1; i <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)); i++) {
        for (var j = 0; j < strictlyIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(strictSeqLength - 1 - i)); j++) {
            if (knotNumber <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)))
                knotsOpenSequence.splice(0, 0, (strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(strictSeqLength - 1 - i)) - lastAbscissa));
            else
                break;
            knotNumber++;
        }
        if (knotNumber > (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)))
            break;
    }
    try {
        for (var increasingSeq_1 = __values(increasingSeq), increasingSeq_1_1 = increasingSeq_1.next(); !increasingSeq_1_1.done; increasingSeq_1_1 = increasingSeq_1.next()) {
            var knot = increasingSeq_1_1.value;
            if (knot !== undefined)
                knotsOpenSequence.push(knot);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (increasingSeq_1_1 && !increasingSeq_1_1.done && (_a = increasingSeq_1.return)) _a.call(increasingSeq_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    knotNumber = 1;
    for (var i = 1; i <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)); i++) {
        for (var j = 0; j < strictlyIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i)); j++) {
            if (knotNumber <= (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1))) {
                if (i === (strictSeqLength - 1)) {
                    knotsOpenSequence.push(lastAbscissa + (lastAbscissa - strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0))));
                }
                else {
                    knotsOpenSequence.push(lastAbscissa + (strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i)) - strictlyIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0))));
                }
            }
            else
                break;
            knotNumber++;
        }
        if (knotNumber > (increasingSeq.maxMultiplicityOrder - (multiplicityAtOrigin - 1)))
            break;
    }
    return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(increasingSeq.maxMultiplicityOrder + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotsOpenSequence });
}
exports.fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC;
