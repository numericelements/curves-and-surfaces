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
var IncreasingOpenKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/IncreasingOpenKnotSequenceClosedCurve");
var fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC");
var KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
describe('Conversion from an increasing open knot sequence of a closed curve to a strictly increasing open knot sequence of a closed curve', function () {
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var e_1, _a;
        var maxMultiplicityOrder = 4;
        var knots = [0, 0, 0, 0, 1, 1, 1, 1];
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        var strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        chai_1.expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        var abscissa = [];
        var multiplicity = [];
        try {
            for (var strictIncreasingSeq_1 = __values(strictIncreasingSeq), strictIncreasingSeq_1_1 = strictIncreasingSeq_1.next(); !strictIncreasingSeq_1_1.done; strictIncreasingSeq_1_1 = strictIncreasingSeq_1.next()) {
                var knot = strictIncreasingSeq_1_1.value;
                if (knot !== undefined) {
                    abscissa.push(knot.abscissa);
                    multiplicity.push(knot.multiplicity);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (strictIncreasingSeq_1_1 && !strictIncreasingSeq_1_1.done && (_a = strictIncreasingSeq_1.return)) _a.call(strictIncreasingSeq_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        chai_1.expect(abscissa).to.eql([0, 1]);
        chai_1.expect(multiplicity).to.eql([maxMultiplicityOrder, maxMultiplicityOrder]);
    });
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var e_2, _a;
        var maxMultiplicityOrder = 4;
        var knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6];
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        var strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        chai_1.expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        var abscissa = [];
        var multiplicity = [];
        try {
            for (var strictIncreasingSeq_2 = __values(strictIncreasingSeq), strictIncreasingSeq_2_1 = strictIncreasingSeq_2.next(); !strictIncreasingSeq_2_1.done; strictIncreasingSeq_2_1 = strictIncreasingSeq_2.next()) {
                var knot = strictIncreasingSeq_2_1.value;
                if (knot !== undefined) {
                    abscissa.push(knot.abscissa);
                    multiplicity.push(knot.multiplicity);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (strictIncreasingSeq_2_1 && !strictIncreasingSeq_2_1.done && (_a = strictIncreasingSeq_2.return)) _a.call(strictIncreasingSeq_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        chai_1.expect(abscissa).to.eql([-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6]);
        chai_1.expect(multiplicity).to.eql([2, 2, 1, 1, 2, 2, 1, 1]);
    });
    it('can convert the increasing uniform knot sequence to a strictly increasing knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var e_3, _a;
        var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
        var maxMultiplicityOrder = 3;
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        var seqStrictly = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        chai_1.expect(seqStrictly.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        var sequence = [];
        try {
            for (var seqStrictly_1 = __values(seqStrictly), seqStrictly_1_1 = seqStrictly_1.next(); !seqStrictly_1_1.done; seqStrictly_1_1 = seqStrictly_1.next()) {
                var knot = seqStrictly_1_1.value;
                if (knot !== undefined)
                    sequence.push(knot.abscissa);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (seqStrictly_1_1 && !seqStrictly_1_1.done && (_a = seqStrictly_1.return)) _a.call(seqStrictly_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        chai_1.expect(sequence).to.eql(knots);
    });
    it('can convert the increasing knot sequence, with a multiplicity order higher than one of the knot origin of the sequence, to a strictly increasing knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var e_4, _a;
        var knots1 = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2];
        var maxMultiplicityOrder = 4;
        var seq1 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 });
        var seqStrictly1 = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq1);
        chai_1.expect(seqStrictly1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1]);
        var sequence1 = [];
        try {
            for (var seqStrictly1_1 = __values(seqStrictly1), seqStrictly1_1_1 = seqStrictly1_1.next(); !seqStrictly1_1_1.done; seqStrictly1_1_1 = seqStrictly1_1.next()) {
                var knot = seqStrictly1_1_1.value;
                if (knot !== undefined)
                    sequence1.push(knot.abscissa);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (seqStrictly1_1_1 && !seqStrictly1_1_1.done && (_a = seqStrictly1_1.return)) _a.call(seqStrictly1_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        chai_1.expect(sequence1).to.eql([-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2]);
    });
    it('preserves the knot sequence property about C0 discontinuity across conversion.', function () {
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6];
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        var increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        chai_1.expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot spacing across conversion.', function () {
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6];
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
        var increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        chai_1.expect(increasingSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', function () {
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [0, 0, 0, 0, 1, 1, 1, 1];
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
        var increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        chai_1.expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', function () {
        var curveDegree = 2;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
        var increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        chai_1.expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true);
    });
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
        var e_5, _a;
        var maxMultiplicityOrder = 4;
        var knots = [0, 0, 0, 0, 1, 1, 1, 1];
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
        var strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        chai_1.expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        chai_1.expect(strictIncreasingSeq.isSequenceUpToC0Discontinuity).to.eql(true);
        var abscissa = [];
        var multiplicity = [];
        try {
            for (var strictIncreasingSeq_3 = __values(strictIncreasingSeq), strictIncreasingSeq_3_1 = strictIncreasingSeq_3.next(); !strictIncreasingSeq_3_1.done; strictIncreasingSeq_3_1 = strictIncreasingSeq_3.next()) {
                var knot = strictIncreasingSeq_3_1.value;
                if (knot !== undefined) {
                    abscissa.push(knot.abscissa);
                    multiplicity.push(knot.multiplicity);
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (strictIncreasingSeq_3_1 && !strictIncreasingSeq_3_1.done && (_a = strictIncreasingSeq_3.return)) _a.call(strictIncreasingSeq_3);
            }
            finally { if (e_5) throw e_5.error; }
        }
        chai_1.expect(abscissa).to.eql([0, 1]);
        chai_1.expect(multiplicity).to.eql([maxMultiplicityOrder, maxMultiplicityOrder]);
    });
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
        var e_6, _a;
        var maxMultiplicityOrder = 4;
        var knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6];
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
        var strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        chai_1.expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        chai_1.expect(strictIncreasingSeq.isSequenceUpToC0Discontinuity).to.eql(true);
        var abscissa = [];
        var multiplicity = [];
        try {
            for (var strictIncreasingSeq_4 = __values(strictIncreasingSeq), strictIncreasingSeq_4_1 = strictIncreasingSeq_4.next(); !strictIncreasingSeq_4_1.done; strictIncreasingSeq_4_1 = strictIncreasingSeq_4.next()) {
                var knot = strictIncreasingSeq_4_1.value;
                if (knot !== undefined) {
                    abscissa.push(knot.abscissa);
                    multiplicity.push(knot.multiplicity);
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (strictIncreasingSeq_4_1 && !strictIncreasingSeq_4_1.done && (_a = strictIncreasingSeq_4.return)) _a.call(strictIncreasingSeq_4);
            }
            finally { if (e_6) throw e_6.error; }
        }
        chai_1.expect(abscissa).to.eql([-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6]);
        chai_1.expect(multiplicity).to.eql([2, 2, 1, 1, 2, 2, 1, 1]);
    });
    it('preserves the knot sequence property about C0 discontinuity across conversion.', function () {
        var curveDegree = 2;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
        var strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        chai_1.expect(strictIncreasingSeq.isSequenceUpToC0Discontinuity).to.eql(true);
    });
});
