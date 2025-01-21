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
var chai_1 = require("chai");
var IncreasingPeriodicKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/IncreasingPeriodicKnotSequenceClosedCurve");
var fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence");
var KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
describe('Conversions from an increasing periodic knot sequence of a closed curve to a strictly increasing periodic knot sequence of a closed curve', function () {
    it('can convert an increasing uniform periodic knot sequence to a strictly increasing periodic knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, function () {
        var e_1, _a;
        var periodicKnots = [0, 1, 2, 3, 4, 5];
        var maxMultiplicityOrder = 2;
        var seq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots });
        var seqStrictly = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(seqStrictly.multiplicities()).to.eql([1, 1, 1, 1, 1, 1]);
        var sequence = [];
        try {
            for (var seqStrictly_1 = __values(seqStrictly), seqStrictly_1_1 = seqStrictly_1.next(); !seqStrictly_1_1.done; seqStrictly_1_1 = seqStrictly_1.next()) {
                var knot = seqStrictly_1_1.value;
                if (knot !== undefined)
                    sequence.push(knot.abscissa);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (seqStrictly_1_1 && !seqStrictly_1_1.done && (_a = seqStrictly_1.return)) _a.call(seqStrictly_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        chai_1.expect(sequence).to.eql(periodicKnots);
    });
    it('can convert the increasing periodic knot sequence, with a multiplicity order higher than one of the knot origin of the sequence, to a strictly increasing periodic knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, function () {
        var e_2, _a;
        var periodicKnots = [0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1];
        var maxMultiplicityOrder = 3;
        var seq1 = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots });
        var seqStrictly1 = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq1);
        chai_1.expect(seqStrictly1.multiplicities()).to.eql([2, 1, 1, 1, 1, 1, 1, 2]);
        var sequence1 = [];
        try {
            for (var seqStrictly1_1 = __values(seqStrictly1), seqStrictly1_1_1 = seqStrictly1_1.next(); !seqStrictly1_1_1.done; seqStrictly1_1_1 = seqStrictly1_1.next()) {
                var knot = seqStrictly1_1_1.value;
                if (knot !== undefined)
                    sequence1.push(knot.abscissa);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (seqStrictly1_1_1 && !seqStrictly1_1_1.done && (_a = seqStrictly1_1.return)) _a.call(seqStrictly1_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        chai_1.expect(sequence1).to.eql([0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1]);
    });
    it('preserves the knot sequence property about uniform knot spacing across conversion.', function () {
        var maxMultiplicityOrder = 3;
        var periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1];
        var seq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots });
        chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
        var increasingSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(increasingSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', function () {
        var maxMultiplicityOrder = 3;
        var periodicKnots = [0, 0, 0, 1, 1, 1];
        var seq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots });
        chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
        var increasingSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', function () {
        var maxMultiplicityOrder = 2;
        var periodicKnots = [0, 1, 2, 3, 4, 5, 6];
        var seq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots });
        chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
        var increasingSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true);
    });
});
