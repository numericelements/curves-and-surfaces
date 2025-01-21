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
var StrictlyIncreasingOpenKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve");
var fromStrictlyIncreasingToIncreasingKnotSequenceCC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromStrictlyIncreasingToIncreasingKnotSequenceCC");
var KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
describe('Conversions from a strictly increasing knot sequence of a closed curve to an increasing open knot sequence of a closed curve', function () {
    it('can convert a strictly increasing sequence to an increasing knot sequence. Case of non uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var e_1, _a;
        var maxMultiplicityOrder = 4;
        var knots = [0, 1];
        var multiplicities = [4, 4];
        var seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        var increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        chai_1.expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
        chai_1.expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        var abscissae = [];
        try {
            for (var increasingSeq_1 = __values(increasingSeq), increasingSeq_1_1 = increasingSeq_1.next(); !increasingSeq_1_1.done; increasingSeq_1_1 = increasingSeq_1.next()) {
                var knot = increasingSeq_1_1.value;
                if (knot !== undefined) {
                    abscissae.push(knot);
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
        var referenceAbscissae = [];
        for (var i = 0; i < knots.length; i++) {
            for (var j = 0; j < multiplicities[i]; j++) {
                referenceAbscissae.push(knots[i]);
            }
        }
        chai_1.expect(abscissae).to.eql(referenceAbscissae);
        chai_1.expect(increasingSeq.multiplicities()).to.eql(multiplicities);
    });
    it('can convert a strictly increasing sequence to an increasing knot sequence. Case of arbitrary knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var e_2, _a;
        var maxMultiplicityOrder = 4;
        var knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6];
        var multiplicities = [2, 2, 1, 1, 2, 2, 1, 1];
        var seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        var increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        chai_1.expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        chai_1.expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
        var abscissae = [];
        try {
            for (var increasingSeq_2 = __values(increasingSeq), increasingSeq_2_1 = increasingSeq_2.next(); !increasingSeq_2_1.done; increasingSeq_2_1 = increasingSeq_2.next()) {
                var knot = increasingSeq_2_1.value;
                if (knot !== undefined) {
                    abscissae.push(knot);
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
        var referenceAbscissae = [];
        for (var i = 0; i < knots.length; i++) {
            for (var j = 0; j < multiplicities[i]; j++) {
                referenceAbscissae.push(knots[i]);
            }
        }
        chai_1.expect(abscissae).to.eql(referenceAbscissae);
        chai_1.expect(increasingSeq.multiplicities()).to.eql(multiplicities);
    });
    it('can convert a strictly increasing uniform knot sequence to an increasing knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var e_3, _a;
        var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
        var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        var maxMultiplicityOrder = 3;
        var seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        var increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        chai_1.expect(increasingSeq.multiplicities()).to.eql(multiplicities);
        chai_1.expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
        var sequence = [];
        try {
            for (var increasingSeq_3 = __values(increasingSeq), increasingSeq_3_1 = increasingSeq_3.next(); !increasingSeq_3_1.done; increasingSeq_3_1 = increasingSeq_3.next()) {
                var knot = increasingSeq_3_1.value;
                if (knot !== undefined)
                    sequence.push(knot);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (increasingSeq_3_1 && !increasingSeq_3_1.done && (_a = increasingSeq_3.return)) _a.call(increasingSeq_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        chai_1.expect(sequence).to.eql(knots);
    });
    it('can convert a strictly increasing knot sequence, with a multiplicity order higher than one of the knot origin of the sequence, to an increasing knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var e_4, _a;
        var knots1 = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2];
        var multiplicities1 = [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1];
        var maxMultiplicityOrder = 4;
        var seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1 });
        chai_1.expect(seq1.isSequenceUpToC0Discontinuity).to.eql(false);
        var increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq1);
        chai_1.expect(increasingSeq.multiplicities()).to.eql(multiplicities1);
        chai_1.expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
        var sequence1 = [];
        try {
            for (var increasingSeq_4 = __values(increasingSeq), increasingSeq_4_1 = increasingSeq_4.next(); !increasingSeq_4_1.done; increasingSeq_4_1 = increasingSeq_4.next()) {
                var knot = increasingSeq_4_1.value;
                if (knot !== undefined)
                    sequence1.push(knot);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (increasingSeq_4_1 && !increasingSeq_4_1.done && (_a = increasingSeq_4.return)) _a.call(increasingSeq_4);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var referenceAbscissae = [];
        for (var i = 0; i < knots1.length; i++) {
            for (var j = 0; j < multiplicities1[i]; j++) {
                referenceAbscissae.push(knots1[i]);
            }
        }
        chai_1.expect(sequence1).to.eql(referenceAbscissae);
    });
    it('preserves the knot sequence property about C0 discontinuity across conversion.', function () {
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6];
        var multiplicities = [2, 2, 1, 1, 2, 2, 1, 1];
        var seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        var increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        chai_1.expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot spacing across conversion.', function () {
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6];
        var multiplicities = [2, 2, 1, 1, 2, 2, 1, 1];
        var seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
        var increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        chai_1.expect(increasingSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', function () {
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [0, 1];
        var multiplicities = [4, 4];
        var seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
        var increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        chai_1.expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', function () {
        var curveDegree = 2;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
        var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        var seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
        var increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        chai_1.expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true);
    });
});
