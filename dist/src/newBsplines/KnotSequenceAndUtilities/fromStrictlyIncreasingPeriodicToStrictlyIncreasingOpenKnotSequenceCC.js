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
exports.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC = void 0;
var KnotIndexStrictlyIncreasingSequence_1 = require("../KnotIndexStrictlyIncreasingSequence");
var KnotSequenceConstructorInterface_1 = require("../KnotSequenceConstructorInterface");
var StrictlyIncreasingOpenKnotSequenceClosedCurve_1 = require("../StrictlyIncreasingOpenKnotSequenceClosedCurve");
function fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC(strictIncSeq) {
    var e_1, _a;
    var knotsOpenSequence = [];
    var multiplicitiesOpenSequence = [];
    var maxMultOrder = strictIncSeq.maxMultiplicityOrder;
    var lastIndex = strictIncSeq.length() - 1;
    var lastAbscissa = strictIncSeq.uMax;
    var multiplicityAtOrigin = strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
    var nbComplementaryKnots = maxMultOrder - (multiplicityAtOrigin - 1);
    var index = 0;
    while (index < nbComplementaryKnots) {
        var multiplicityExcess = nbComplementaryKnots - strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(lastIndex - (index + 1))) - index;
        if (multiplicityExcess <= 0) {
            nbComplementaryKnots = index + 1;
            break;
        }
        else if (multiplicityExcess < (nbComplementaryKnots - (index + 1))) {
            nbComplementaryKnots = nbComplementaryKnots - multiplicityExcess;
            index++;
        }
        else {
            index++;
        }
    }
    var cumulativeMultiplicityFromOrigin = multiplicityAtOrigin;
    for (var i = 0; i < nbComplementaryKnots; i++) {
        knotsOpenSequence.splice(0, 0, (strictIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(lastIndex - (i + 1))) - lastAbscissa));
        var multiplicityCurrentKnot = strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(lastIndex - (i + 1)));
        if ((cumulativeMultiplicityFromOrigin + multiplicityCurrentKnot) > maxMultOrder) {
            multiplicityCurrentKnot = maxMultOrder - cumulativeMultiplicityFromOrigin + 1;
        }
        cumulativeMultiplicityFromOrigin += multiplicityCurrentKnot;
        multiplicitiesOpenSequence.splice(0, 0, multiplicityCurrentKnot);
    }
    try {
        for (var strictIncSeq_1 = __values(strictIncSeq), strictIncSeq_1_1 = strictIncSeq_1.next(); !strictIncSeq_1_1.done; strictIncSeq_1_1 = strictIncSeq_1.next()) {
            var knot = strictIncSeq_1_1.value;
            if (knot !== undefined) {
                knotsOpenSequence.push(knot.abscissa);
                multiplicitiesOpenSequence.push(knot.multiplicity);
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
    nbComplementaryKnots = maxMultOrder - (multiplicityAtOrigin - 1);
    index = 0;
    while (index < nbComplementaryKnots) {
        var multiplicityExcess = nbComplementaryKnots - strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(index + 1)) - index;
        if (multiplicityExcess <= 0) {
            nbComplementaryKnots = index + 1;
            break;
        }
        else if (multiplicityExcess < (nbComplementaryKnots - (index + 1))) {
            nbComplementaryKnots = nbComplementaryKnots - multiplicityExcess;
            index++;
        }
        else {
            index++;
        }
    }
    cumulativeMultiplicityFromOrigin = multiplicityAtOrigin;
    for (var i = 0; i < nbComplementaryKnots; i++) {
        knotsOpenSequence.push(lastAbscissa + (strictIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i + 1)) - strictIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0))));
        var multiplicityCurrentKnot = strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i + 1));
        if ((cumulativeMultiplicityFromOrigin + multiplicityCurrentKnot) > maxMultOrder) {
            multiplicityCurrentKnot = maxMultOrder - cumulativeMultiplicityFromOrigin + 1;
        }
        cumulativeMultiplicityFromOrigin += multiplicityCurrentKnot;
        multiplicitiesOpenSequence.push(multiplicityCurrentKnot);
    }
    return new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultOrder + 1, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knotsOpenSequence, multiplicities: multiplicitiesOpenSequence });
}
exports.fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC = fromStrictlyIncreasingPeriodicToStrictlyIncreasingOpenKnotSequenceCC;
