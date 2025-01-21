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
var IncreasingOpenKnotSequenceOpenCurve_1 = require("../../../src/newBsplines/IncreasingOpenKnotSequenceOpenCurve");
var fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC");
var KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
describe('Conversions from an increasing open knot sequence of an open curve to strictly increasing open knot sequence of open curve', function () {
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence', function () {
        var e_1, _a;
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [0, 0, 0, 0, 1, 1, 1, 1];
        var seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        var increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
        chai_1.expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        var abscissa = [];
        var multiplicity = [];
        try {
            for (var increasingSeq_1 = __values(increasingSeq), increasingSeq_1_1 = increasingSeq_1.next(); !increasingSeq_1_1.done; increasingSeq_1_1 = increasingSeq_1.next()) {
                var knot = increasingSeq_1_1.value;
                if (knot !== undefined) {
                    abscissa.push(knot.abscissa);
                    multiplicity.push(knot.multiplicity);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (increasingSeq_1_1 && !increasingSeq_1_1.done && (_a = increasingSeq_1.return)) _a.call(increasingSeq_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        chai_1.expect(abscissa).to.eql([0, 1]);
        chai_1.expect(multiplicity).to.eql([4, 4]);
    });
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence', function () {
        var e_2, _a;
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
        var seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        var increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
        chai_1.expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        var abscissa = [];
        var multiplicity = [];
        try {
            for (var increasingSeq_2 = __values(increasingSeq), increasingSeq_2_1 = increasingSeq_2.next(); !increasingSeq_2_1.done; increasingSeq_2_1 = increasingSeq_2.next()) {
                var knot = increasingSeq_2_1.value;
                if (knot !== undefined) {
                    abscissa.push(knot.abscissa);
                    multiplicity.push(knot.multiplicity);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (increasingSeq_2_1 && !increasingSeq_2_1.done && (_a = increasingSeq_2.return)) _a.call(increasingSeq_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        chai_1.expect(abscissa).to.eql([-2, -1, 0, 0.5, 0.6, 0.7, 1]);
        chai_1.expect(multiplicity).to.eql([1, 1, 2, 1, 1, 2, 4]);
    });
    it('preserves the knot sequence property about C0 discontinuity across conversion.', function () {
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
        var seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        var increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
        chai_1.expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot spacing across conversion.', function () {
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
        var seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
        var increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
        chai_1.expect(increasingSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', function () {
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [0, 0, 0, 0, 1, 1, 1, 1];
        var seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(true);
        var increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
        chai_1.expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(true);
    });
    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', function () {
        var curveDegree = 2;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
        var seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
        var increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
        chai_1.expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true);
    });
    it('can convert an increasing sequence with knot multiplicities up to C0 discontinuity to a strictly increasing knot sequence.', function () {
        var e_3, _a;
        var maxMultiplicityOrder = 4;
        var knots = [-3, -2, -1, 0, 1, 1, 2, 3, 4, 5];
        var seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
        var increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
        chai_1.expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(true);
        chai_1.expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        var abscissa = [];
        var multiplicity = [];
        try {
            for (var increasingSeq_3 = __values(increasingSeq), increasingSeq_3_1 = increasingSeq_3.next(); !increasingSeq_3_1.done; increasingSeq_3_1 = increasingSeq_3.next()) {
                var knot = increasingSeq_3_1.value;
                if (knot !== undefined) {
                    abscissa.push(knot.abscissa);
                    multiplicity.push(knot.multiplicity);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (increasingSeq_3_1 && !increasingSeq_3_1.done && (_a = increasingSeq_3.return)) _a.call(increasingSeq_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        chai_1.expect(abscissa).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5]);
        chai_1.expect(multiplicity).to.eql([1, 1, 1, 1, 2, 1, 1, 1, 1]);
    });
});
