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
var StrictlyIncreasingOpenKnotSequenceOpenCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceOpenCurve");
var fromStrictlyIncreasingtToIncreasingKnotSequenceOC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromStrictlyIncreasingtToIncreasingKnotSequenceOC");
var KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
describe('Conversions from a strictly increasing knot sequence of an open curve to an increasing open knot sequence of an open curve', function () {
    it('can convert a srictly increasing knot sequence to an increasing knot sequence. Case of non uniform knot sequence', function () {
        var e_1, _a, e_2, _b;
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [0, 1];
        var multiplicities = [4, 4];
        var strSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
        var increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC_1.fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strSeq);
        chai_1.expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        var knotAbscissae = [];
        try {
            for (var increasingSeq_1 = __values(increasingSeq), increasingSeq_1_1 = increasingSeq_1.next(); !increasingSeq_1_1.done; increasingSeq_1_1 = increasingSeq_1.next()) {
                var knot = increasingSeq_1_1.value;
                if (knot !== undefined) {
                    knotAbscissae.push(knot);
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
        var abscissaeInit = [];
        try {
            for (var strSeq_1 = __values(strSeq), strSeq_1_1 = strSeq_1.next(); !strSeq_1_1.done; strSeq_1_1 = strSeq_1.next()) {
                var knot = strSeq_1_1.value;
                if (knot !== undefined) {
                    for (var i = 0; i < knot.multiplicity; i++)
                        abscissaeInit.push(knot.abscissa);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (strSeq_1_1 && !strSeq_1_1.done && (_b = strSeq_1.return)) _b.call(strSeq_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        chai_1.expect(knotAbscissae).to.eql(abscissaeInit);
    });
    it('can convert a srictly increasing knot sequence to an increasing knot sequence. Case of arbitrary knot sequence', function () {
        var e_3, _a, e_4, _b;
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1];
        var multiplicities = [1, 1, 2, 1, 1, 2, 4];
        var strSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
        var increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC_1.fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strSeq);
        chai_1.expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        var knotAbscissae = [];
        try {
            for (var increasingSeq_2 = __values(increasingSeq), increasingSeq_2_1 = increasingSeq_2.next(); !increasingSeq_2_1.done; increasingSeq_2_1 = increasingSeq_2.next()) {
                var knot = increasingSeq_2_1.value;
                if (knot !== undefined) {
                    knotAbscissae.push(knot);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (increasingSeq_2_1 && !increasingSeq_2_1.done && (_a = increasingSeq_2.return)) _a.call(increasingSeq_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var abscissaeInit = [];
        try {
            for (var strSeq_2 = __values(strSeq), strSeq_2_1 = strSeq_2.next(); !strSeq_2_1.done; strSeq_2_1 = strSeq_2.next()) {
                var knot = strSeq_2_1.value;
                if (knot !== undefined) {
                    for (var i = 0; i < knot.multiplicity; i++)
                        abscissaeInit.push(knot.abscissa);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (strSeq_2_1 && !strSeq_2_1.done && (_b = strSeq_2.return)) _b.call(strSeq_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
        chai_1.expect(knotAbscissae).to.eql(abscissaeInit);
    });
    it('can convert a srictly increasing knot sequence to an increasing knot sequence. Case of arbitrary knot sequence with constructor' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
        var e_5, _a, e_6, _b;
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1];
        var multiplicities = [1, 1, 2, 1, 1, 2, 4];
        var strSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities });
        chai_1.expect(strSeq.isSequenceUpToC0Discontinuity).to.eql(true);
        var increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC_1.fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strSeq);
        chai_1.expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        chai_1.expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(true);
        var knotAbscissae = [];
        try {
            for (var increasingSeq_3 = __values(increasingSeq), increasingSeq_3_1 = increasingSeq_3.next(); !increasingSeq_3_1.done; increasingSeq_3_1 = increasingSeq_3.next()) {
                var knot = increasingSeq_3_1.value;
                if (knot !== undefined) {
                    knotAbscissae.push(knot);
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (increasingSeq_3_1 && !increasingSeq_3_1.done && (_a = increasingSeq_3.return)) _a.call(increasingSeq_3);
            }
            finally { if (e_5) throw e_5.error; }
        }
        var abscissaeInit = [];
        try {
            for (var strSeq_3 = __values(strSeq), strSeq_3_1 = strSeq_3.next(); !strSeq_3_1.done; strSeq_3_1 = strSeq_3.next()) {
                var knot = strSeq_3_1.value;
                if (knot !== undefined) {
                    for (var i = 0; i < knot.multiplicity; i++)
                        abscissaeInit.push(knot.abscissa);
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (strSeq_3_1 && !strSeq_3_1.done && (_b = strSeq_3.return)) _b.call(strSeq_3);
            }
            finally { if (e_6) throw e_6.error; }
        }
        chai_1.expect(knotAbscissae).to.eql(abscissaeInit);
    });
    it('preserves the knot sequence property about C0 discontinuity across conversion.', function () {
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1];
        var multiplicities = [1, 1, 2, 1, 1, 2, 4];
        var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        var increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC_1.fromStrictlyIncreasingtToIncreasingKnotSequenceOC(seq);
        chai_1.expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot spacing across conversion.', function () {
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1];
        var multiplicities = [1, 1, 2, 1, 1, 2, 4];
        var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
        chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
        var increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC_1.fromStrictlyIncreasingtToIncreasingKnotSequenceOC(seq);
        chai_1.expect(increasingSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', function () {
        var curveDegree = 3;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [0, 1];
        var multiplicities = [4, 4];
        var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
        chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(true);
        var increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC_1.fromStrictlyIncreasingtToIncreasingKnotSequenceOC(seq);
        chai_1.expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(true);
    });
    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', function () {
        var curveDegree = 2;
        var maxMultiplicityOrder = curveDegree + 1;
        var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
        var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
        chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
        var increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC_1.fromStrictlyIncreasingtToIncreasingKnotSequenceOC(seq);
        chai_1.expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true);
    });
});
