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
var StrictlyIncreasingOpenKnotSequenceOpenCurve_1 = require("../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceOpenCurve");
var KnotSequenceConstructorInterface_1 = require("../../src/newBsplines/KnotSequenceConstructorInterface");
var KnotSequences_1 = require("../../src/ErrorMessages/KnotSequences");
var GeneralPurpose_1 = require("../namedConstants/GeneralPurpose");
var KnotSequences_2 = require("../../src/namedConstants/KnotSequences");
var AbstractBSplineR1toR2_1 = require("../../src/newBsplines/AbstractBSplineR1toR2");
var KnotIndexStrictlyIncreasingSequence_1 = require("../../src/newBsplines/KnotIndexStrictlyIncreasingSequence");
var Knots_1 = require("../../src/ErrorMessages/Knots");
describe('StrictlyIncreasingOpenKnotSequenceOpenCurve', function () {
    describe('Constructor', function () {
        describe(KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, function () {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, function () {
                var maxMultiplicityOrder = 0;
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('can be initialized without a knot sequence with initializer ' + KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, function () {
                var e_1, _a;
                for (var i = 1; i < 4; i++) {
                    var maxMultiplicityOrder = i;
                    var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE });
                    var knots = [0, 1];
                    var multiplicities = [];
                    for (var j = 0; j < knots.length; j++) {
                        multiplicities.push(maxMultiplicityOrder);
                    }
                    var seq1 = [];
                    var seq2 = [];
                    try {
                        for (var seq_1 = (e_1 = void 0, __values(seq)), seq_1_1 = seq_1.next(); !seq_1_1.done; seq_1_1 = seq_1.next()) {
                            var knot = seq_1_1.value;
                            if (knot !== undefined) {
                                seq1.push(knot.abscissa);
                                seq2.push(knot.multiplicity);
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (seq_1_1 && !seq_1_1.done && (_a = seq_1.return)) _a.call(seq_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    chai_1.expect(seq1).to.eql(knots);
                    chai_1.expect(seq2).to.eql(multiplicities);
                }
            });
            it('can get the knot index of the curve origin with ' + KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, function () {
                var maxMultiplicityOrder = 3;
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE });
                chai_1.expect(seq.indexKnotOrigin.knotIndex).to.eql(0);
            });
            it('can get the properties of knot sequnence produced with the initializer ' + KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, function () {
                var maxMultiplicityOrder = 3;
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE });
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(true);
            });
            it('can get the u interval upper bound produced with the initializer ' + KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, function () {
                var maxMultiplicityOrder = 3;
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE });
                var lastIndex = seq.length() - 1;
                chai_1.expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0))).to.eql(0.0);
                chai_1.expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(lastIndex))).to.eql(1.0);
                chai_1.expect(seq.uMax).to.eql(1.0);
            });
        });
        describe(KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 1;
                var BsplBasisSize = 2;
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 2;
                var BsplBasisSize = maxMultiplicityOrder - 1;
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize }); }).to.throw(KnotSequences_1.EM_SIZENORMALIZED_BSPLINEBASIS);
            });
            it('can be initialized with a size of normalized B-spline basis produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var e_2, _a;
                for (var i = 2; i < 5; i++) {
                    var maxMultiplicityOrder = i;
                    var upperBound = 4;
                    for (var j = maxMultiplicityOrder; j < (maxMultiplicityOrder + upperBound); j++) {
                        var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: j });
                        var knots = [];
                        var multiplicities = [];
                        for (var k = -(maxMultiplicityOrder - 1); k < (j + maxMultiplicityOrder - 1); k++) {
                            knots.push(k);
                            multiplicities.push(1);
                        }
                        var seq1 = [];
                        var seq2 = [];
                        try {
                            for (var seq_2 = (e_2 = void 0, __values(seq)), seq_2_1 = seq_2.next(); !seq_2_1.done; seq_2_1 = seq_2.next()) {
                                var knot = seq_2_1.value;
                                if (knot !== undefined) {
                                    seq1.push(knot.abscissa);
                                    seq2.push(knot.multiplicity);
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (seq_2_1 && !seq_2_1.done && (_a = seq_2.return)) _a.call(seq_2);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        chai_1.expect(seq1).to.eql(knots);
                        chai_1.expect(seq2).to.eql(multiplicities);
                    }
                }
            });
            it('can get the knot index of the curve origin produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var BsplBasisSize = 3;
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                chai_1.expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1);
            });
            it('can get the u interval upper bound produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var BsplBasisSize = 3;
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                chai_1.expect(seq.uMax).to.eql(BsplBasisSize - 1);
            });
            it('can get the properties of knot sequnence produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var BsplBasisSize = 3;
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            });
        });
        describe(KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, function () {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type' + KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 1;
                var BsplBasisSize = 2;
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot initialize a knot sequence with a maximal multiplicity order of two if the size of the B-spline basis is lower than maxMultiplicityOrder using initializer ' + KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 2;
                var BsplBasisSize = maxMultiplicityOrder - 1;
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize }); }).to.throw(KnotSequences_1.EM_SIZENORMALIZED_BSPLINEBASIS);
            });
            it('can be initialized with a number of control points produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, function () {
                var e_3, _a;
                for (var i = 2; i < 5; i++) {
                    var maxMultiplicityOrder = i;
                    var upperBound = 3;
                    for (var j = maxMultiplicityOrder; j < (maxMultiplicityOrder + upperBound); j++) {
                        var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: j });
                        var knots = [];
                        var multiplicities = [];
                        knots.push(0);
                        multiplicities.push(maxMultiplicityOrder);
                        knots.push(j - maxMultiplicityOrder + 1);
                        multiplicities.push(maxMultiplicityOrder);
                        for (var k = 0; k < (j - maxMultiplicityOrder); k++) {
                            knots.splice((1 + k), 0, (k + 1));
                            multiplicities.splice((1 + k), 0, 1);
                        }
                        var seq1 = [];
                        var seq2 = [];
                        try {
                            for (var seq_3 = (e_3 = void 0, __values(seq)), seq_3_1 = seq_3.next(); !seq_3_1.done; seq_3_1 = seq_3.next()) {
                                var knot = seq_3_1.value;
                                if (knot !== undefined) {
                                    seq1.push(knot.abscissa);
                                    seq2.push(knot.multiplicity);
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (seq_3_1 && !seq_3_1.done && (_a = seq_3.return)) _a.call(seq_3);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        chai_1.expect(seq1).to.eql(knots);
                        chai_1.expect(seq2).to.eql(multiplicities);
                    }
                }
            });
            it('can get the knot index of the curve origin produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var BsplBasisSize = 4;
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                chai_1.expect(seq.indexKnotOrigin.knotIndex).to.eql(0);
            });
            it('can get the u interval upper bound produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var BsplBasisSize = 4;
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                chai_1.expect(seq.uMax).to.eql(BsplBasisSize - maxMultiplicityOrder + 1);
            });
            it('can get the properties of knot sequence produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var BsplBasisSize = 4;
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(true);
            });
        });
        describe(KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 0;
                var knots = [0, 1];
                var multiplicities = [0, 0];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot be initialized with a null length array of knots with intializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var knots = [];
                var multiplicities = [1];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NULL_KNOT_SEQUENCE);
            });
            it('cannot be initialized with a null length array of multiplicities with intializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var knots = [0, 1, 2];
                var multiplicities = [];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NULL_MULTIPLICITY_ARRAY);
            });
            it('cannot be initialized with a knot sequence having a length differing from that of the multiplicities with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
                var knots = [0, 0.5, 0.6, 0.7, 1];
                var multiplicities = [4, 1, 1, 2];
                var maxMultiplicityOrder = 4;
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL);
            });
            it('cannot initialize a knot sequence with a number of knots smaller than maxMultiplicityOrder for a constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 4;
                var knots = [0, 1, 2];
                var multiplicities = [1, 1, 1];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NOT_NORMALIZED_BASIS);
            });
            it('cannot be initialized with a knot multiplicity smaller than one using initializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
                var knots = [0, 0.5, 0.6, 0.7, 1];
                var multiplicities = [3, 1, 1, 2, 3];
                var maxMultiplicityOrder = 3;
                for (var i = 0; i < knots.length; i++) {
                    var multiplicity = multiplicities[i];
                    multiplicities[i] = 0;
                    chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_KNOT_MULTIPLICITY_OUT_OF_RANGE);
                    multiplicities[i] = multiplicity;
                }
            });
            it('cannot be initialized if the knot sequence is not strictly increasing using initializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
                var knots = [0, 0.5, 0.6, 0.7, 1];
                var multiplicities = [3, 1, 1, 2, 3];
                var maxMultiplicityOrder = 3;
                for (var i = 1; i < knots.length; i++) {
                    var knot = knots[i];
                    knots[i] = knots[i - 1];
                    chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NON_STRICTLY_INCREASING_VALUES);
                    knots[i] = knot;
                }
            });
            it('cannot initialize a non uniform knot sequence if the first knot is not zero with initializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
                var knots = [0.1, 0.5, 0.6, 0.7, 1];
                var multiplicities = [4, 1, 1, 2, 4];
                var maxMultiplicityOrder = 4;
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_INCONSISTENT_ORIGIN_NONUNIFORM_KNOT_SEQUENCE);
            });
            it('cannot initialize a knot sequence with a number of knots such that there no interval of normalized basis left.', function () {
                var maxMultiplicityOrder = 4;
                var knots = [-2, -1, 0, 1, 2];
                var multiplicities = [1, 1, 1, 1, 1];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('cannot initialize a knot sequence with a number of knots such that the interval of normalized basis reduces to zero.', function () {
                var maxMultiplicityOrder = 4;
                var knots = [-3, -2, -1, 0, 1, 2, 3];
                var multiplicities = [1, 1, 1, 1, 1, 1, 1];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var knots = [0, 0.5, 2, 3, 4, 5];
                var multiplicities = [3, 1, 1, 1, 1, 4];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
                var multiplicities1 = [4, 1, 1, 1, 1, 3];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities1 }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
                var multiplicities2 = [3, 1, 4, 1, 1, 3];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities2 }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it('cannot be initialized for non-uniform B-splines with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var knots = [0, 0.5, 2, 3, 4, 5];
                var multiplicities = [3, 1, 1, 1, 1, 3];
                var upperBound = knots.length;
                for (var i = maxMultiplicityOrder; i < upperBound - maxMultiplicityOrder; i++) {
                    var multiplicities1 = multiplicities.slice();
                    multiplicities[i] = maxMultiplicityOrder;
                    chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
                    multiplicities = multiplicities1.slice();
                }
            });
            it('cannot be initialized for uniform B-splines with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
                var knots = [-2, -1, 0, 0.5, 1, 2, 3, 4, 5, 6, 7];
                var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
                var maxMultiplicityOrder = 3;
                var upperBound = knots.length;
                for (var i = maxMultiplicityOrder; i < upperBound - maxMultiplicityOrder; i++) {
                    var multiplicities1 = multiplicities.slice();
                    multiplicities[i] = maxMultiplicityOrder;
                    chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
                    multiplicities = multiplicities1.slice();
                }
            });
            it("cannot be initialized with an initializer " + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE + "when knot multiplicities from the sequence start don't define a normalized basis", function () {
                var maxMultiplicityOrder = 4;
                var knots = [-1, 0, 0.5, 0.6, 0.7, 1];
                var multiplicities = [2, 3, 1, 1, 2, 4];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
            });
            it("cannot be initialized with an initializer " + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE + "when knot multiplicities from the sequence end don't define a normalized basis", function () {
                var maxMultiplicityOrder = 4;
                var knots = [0, 0.5, 0.6, 0.7, 1, 2];
                var multiplicities = [4, 1, 1, 2, 3, 2];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND);
            });
        });
        describe('Initialization of knot sequences for non uniform B-splines', function () {
            it('can be initialized with an initializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE + ' . Non uniform knot sequence of open curve without intermediate knots', function () {
                var e_4, _a;
                var maxMultiplicityOrder = 4;
                var knots = [0, 1];
                var multiplicities = [4, 4];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                var seq1 = [];
                var multiplicities1 = [];
                try {
                    for (var seq_4 = __values(seq), seq_4_1 = seq_4.next(); !seq_4_1.done; seq_4_1 = seq_4.next()) {
                        var knot = seq_4_1.value;
                        if (knot !== undefined) {
                            seq1.push(knot.abscissa);
                            multiplicities1.push(knot.multiplicity);
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (seq_4_1 && !seq_4_1.done && (_a = seq_4.return)) _a.call(seq_4);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                chai_1.expect(seq1).to.eql(knots);
                chai_1.expect(multiplicities1).to.eql(multiplicities);
            });
            it('can get the properties of the knot sequence. Non uniform B-Spline without intermediate knot', function () {
                var maxMultiplicityOrder = 4;
                var knots = [0, 1];
                var multiplicities = [4, 4];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(true);
            });
            it('can be initialized as a description of a non-uniform B-spline with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
                var knots = [0.0, 0.5, 0.6, 0.7, 1];
                var multiplicities = [4, 1, 1, 2, 4];
                var maxMultiplicityOrder = 4;
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.distinctAbscissae()).to.eql([0.0, 0.5, 0.6, 0.7, 1]);
                chai_1.expect(seq.multiplicities()).to.eql([4, 1, 1, 2, 4]);
            });
            it('can get the knot index and the abscissa of the upper bound of the normalized basis. Non uniform B-Spline without intermediate knot', function () {
                var maxMultiplicityOrder = 4;
                var knots = [0, 1];
                var multiplicities = [4, 4];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
                chai_1.expect(seq.uMax).to.eql(knots[knots.length - 1]);
            });
            it('can be initialized with an initializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE + '. non uniform knot sequence of open curve with intermediate knots', function () {
                var e_5, _a;
                var maxMultiplicityOrder = 4;
                var knots = [0, 0.5, 0.6, 0.7, 1];
                var multiplicities = [4, 1, 1, 2, 4];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                var seq1 = [];
                var multiplicities1 = [];
                try {
                    for (var seq_5 = __values(seq), seq_5_1 = seq_5.next(); !seq_5_1.done; seq_5_1 = seq_5.next()) {
                        var knot = seq_5_1.value;
                        if (knot !== undefined) {
                            seq1.push(knot.abscissa);
                            multiplicities1.push(knot.multiplicity);
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (seq_5_1 && !seq_5_1.done && (_a = seq_5.return)) _a.call(seq_5);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                chai_1.expect(seq1).to.eql(knots);
                chai_1.expect(multiplicities1).to.eql(multiplicities);
            });
            it('can get the properties of knot sequence: non uniform knot sequence of open curve with intermediate knots.', function () {
                var maxMultiplicityOrder = 4;
                var knots = [0, 0.5, 0.6, 0.7, 1];
                var multiplicities = [4, 1, 1, 2, 4];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(true);
            });
            it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: non uniform knot sequence of open curve with intermediate knots', function () {
                var maxMultiplicityOrder = 4;
                var knots = [0, 0.5, 0.6, 0.7, 1];
                var multiplicities = [4, 1, 1, 2, 4];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
                chai_1.expect(seq.uMax).to.eql(1);
            });
        });
        describe('Initialization of knot sequences for uniform B-splines', function () {
            it('can be initialized with an initializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE + '. uniform knot sequence of open curve without intermediate knots', function () {
                var e_6, _a;
                var maxMultiplicityOrder = 2;
                var knots = [-1, 0, 1, 2, 3, 5, 6, 7];
                var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                var seq1 = [];
                var multiplicities1 = [];
                try {
                    for (var seq_6 = __values(seq), seq_6_1 = seq_6.next(); !seq_6_1.done; seq_6_1 = seq_6.next()) {
                        var knot = seq_6_1.value;
                        if (knot !== undefined) {
                            seq1.push(knot.abscissa);
                            multiplicities1.push(knot.multiplicity);
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (seq_6_1 && !seq_6_1.done && (_a = seq_6.return)) _a.call(seq_6);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                chai_1.expect(seq1).to.eql(knots);
                chai_1.expect(multiplicities1).to.eql(multiplicities);
            });
            it('can get the properties of the knot sequence. uniform B-Spline with uniformly distributed knots', function () {
                var maxMultiplicityOrder = 2;
                var knots = [-1, 0, 1, 2, 3, 4, 5, 6];
                var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            });
            it('can get the properties of the knot sequence. uniform B-Spline with non uniformly distributed knots', function () {
                var maxMultiplicityOrder = 2;
                var knots = [-1, 0, 1, 2.5, 3, 4, 5, 6];
                var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            });
            it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: uniform knot sequence of open curve', function () {
                var maxMultiplicityOrder = 3;
                var knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1, 2.5, 3];
                var multiplicities = [1, 1, 1, 1, 1, 2, 1, 1, 1];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(maxMultiplicityOrder - 1));
                chai_1.expect(seq.uMax).to.eql(1);
            });
        });
        describe('Initialization of arbitrary knot sequences for B-splines', function () {
            it('can be initialized with uniform like knots at left and non-uniform knots at right.', function () {
                var e_7, _a;
                var maxMultiplicityOrder = 4;
                var knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1];
                var multiplicities = [1, 1, 2, 1, 1, 2, 4];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                var seq1 = [];
                var multiplicities1 = [];
                try {
                    for (var seq_7 = __values(seq), seq_7_1 = seq_7.next(); !seq_7_1.done; seq_7_1 = seq_7.next()) {
                        var knot = seq_7_1.value;
                        if (knot !== undefined) {
                            seq1.push(knot.abscissa);
                            multiplicities1.push(knot.multiplicity);
                        }
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (seq_7_1 && !seq_7_1.done && (_a = seq_7.return)) _a.call(seq_7);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                chai_1.expect(seq1).to.eql(knots);
                chai_1.expect(multiplicities1).to.eql(multiplicities);
            });
            it('can get the properties of an arbitrary knot sequence', function () {
                var maxMultiplicityOrder = 4;
                var knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1];
                var multiplicities = [1, 1, 2, 1, 1, 2, 4];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            });
            it('can get the knot index of the sequence origin and maximal abscissa of the normalized knot sequence', function () {
                var knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1];
                var maxMultiplicityOrder = 4;
                var multiplicities = [1, 1, 2, 1, 1, 2, 4];
                var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
                chai_1.expect(seq.indexKnotOrigin.knotIndex).to.eql(2);
                chai_1.expect(seq.uMax).to.eql(1);
            });
        });
        describe(KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
                var maxMultiplicityOrder = 0;
                var knots = [0, 1];
                var multiplicities = [1, 1];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot be initialized with a null knot sequence produced by the initializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
                var maxMultiplicityOrder = 3;
                var knots = [];
                var multiplicities = [1, 1];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NULL_KNOT_SEQUENCE);
            });
            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
                var maxMultiplicityOrder = 3;
                var knots = [0, 0.5, 2, 3, 4, 5];
                var multiplicities = [1, 1, 1, 1, 1, 4];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
                var knots1 = [0, 0.5, 2, 3, 4, 5];
                var multiplicities1 = [4, 1, 1, 1, 1, 1];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots1, multiplicities: multiplicities1 }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
                var knots2 = [0, 0.5, 2, 3, 4, 5];
                var multiplicities2 = [1, 1, 4, 1, 1, 1];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots2, multiplicities: multiplicities2 }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it('cannot be initialized with a knot sequence producing a non normalized basis', function () {
                var knots = [-1, 0, 1];
                var multiplicities = [1, 1, 1];
                var maxMultiplicityOrder = 4;
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NOT_NORMALIZED_BASIS);
            });
            it('cannot be initialized with a knot sequence able to produce normalized basis intervals that are incompatible with each other', function () {
                var knots = [-2, -1, 0, 1, 2];
                var multiplicities = [1, 1, 1, 1, 1];
                var maxMultiplicityOrder = 4;
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('cannot be initialized with a knot sequence producing a normalized basis interval with null amplitude', function () {
                var knots = [-3, -2, -1, 0, 1, 2, 3];
                var multiplicities = [1, 1, 1, 1, 1, 1, 1];
                var maxMultiplicityOrder = 4;
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('cannot be initialized with a non increasing knot sequence produced by the initializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
                var maxMultiplicityOrder = 3;
                var knots = [0, -0.5, 2, 3, 4, 5];
                var multiplicities = [1, 1, 1, 1, 1, 1];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NON_STRICTLY_INCREASING_VALUES);
                var knots1 = [-2, -2.5, 0, 1, 2, 3, 4];
                var multiplicities1 = [1, 1, 1, 1, 1, 1, 1];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots1, multiplicities: multiplicities1 }); }).to.throw(KnotSequences_1.EM_NON_STRICTLY_INCREASING_VALUES);
                var knots2 = [0, 1, 2, 3, 4, 3.5];
                var multiplicities2 = [2, 1, 1, 1, 2, 1];
                chai_1.expect(function () { return new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots2, multiplicities: multiplicities2 }); }).to.throw(KnotSequences_1.EM_NON_STRICTLY_INCREASING_VALUES);
            });
            it('can be initialized with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
                var maxMultiplicityOrder = 3;
                var knots = [0, 0.5, 2, 3, 4, 5];
                var multiplicityFirstKnot = 3;
                var multiplicityLastKnot = 2;
                var multiplicities = [multiplicityFirstKnot, 1, 1, 1, 1, multiplicityLastKnot];
                var upperBound = knots.length;
                for (var i = 1; i < upperBound - 2; i++) {
                    var multiplicities1 = multiplicities.slice();
                    multiplicities1[i] = maxMultiplicityOrder;
                    var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities1 });
                    chai_1.expect(seq.allAbscissae).to.eql(knots);
                    chai_1.expect(seq.multiplicities()).to.eql(multiplicities1);
                }
            });
        });
    });
    describe('Accessors', function () {
        it('can get all the abscissa of the knot sequence: uniform knot sequence', function () {
            var maxMultiplicityOrder = 3;
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.allAbscissae).to.eql(knots);
        });
        it('can get all the abscissa of the knot sequence: non-uniform knot sequence', function () {
            var maxMultiplicityOrder = 3;
            var knots = [0, 1, 2, 3, 4, 5, 6, 7];
            var multiplicities = [3, 1, 1, 1, 1, 1, 1, 3];
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.allAbscissae).to.eql(knots);
        });
        it('can use the iterator to access the knots of the sequence', function () {
            var e_8, _a;
            var maxMultiplicityOrder = 4;
            var knots = [0, 1, 2];
            var multiplicities = [4, 1, 4];
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var seq1 = [];
            try {
                for (var seq_8 = __values(seq), seq_8_1 = seq_8.next(); !seq_8_1.done; seq_8_1 = seq_8.next()) {
                    var knot = seq_8_1.value;
                    if (knot !== undefined)
                        seq1.push(knot.abscissa);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (seq_8_1 && !seq_8_1.done && (_a = seq_8.return)) _a.call(seq_8);
                }
                finally { if (e_8) throw e_8.error; }
            }
            chai_1.expect(seq1).to.eql(knots);
            chai_1.expect(seq1).to.eql(seq.distinctAbscissae());
        });
        it('can get the status of the knot sequence about the description of C0 discontinuity', function () {
            var maxMultiplicityOrder = 3;
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            var seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq1.isSequenceUpToC0Discontinuity).to.eql(true);
        });
        it('can get the maximum multiplicity order of the knot sequence', function () {
            var maxMultiplicityOrder = 3;
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        });
    });
    describe('Methods', function () {
        it('can clone the knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
            var maxMultiplicityOrder = 4;
            var knots = [0, 1, 1.5, 2];
            var multiplicities = [4, 2, 1, 4];
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            var seq1 = seq.clone();
            chai_1.expect(seq1.isSequenceUpToC0Discontinuity).to.eql(false);
            chai_1.expect(seq1).to.eql(seq);
        });
        it('can clone the knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
            var maxMultiplicityOrder = 4;
            var knots = [0, 1, 1.5, 2];
            var multiplicities = [4, 2, 1, 4];
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            var seq1 = seq.clone();
            chai_1.expect(seq1.isSequenceUpToC0Discontinuity).to.eql(true);
            chai_1.expect(seq1).to.eql(seq);
        });
        it('can get the length of a knot sequence', function () {
            var knots = [-1, -0.5, -0.2, 0.0, 0.5, 0.6, 0.7, 1, 1.1, 1.5, 1.7];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.length()).to.eql(11);
            var knots1 = [0.0, 1];
            var multiplicities1 = [3, 3];
            maxMultiplicityOrder = 3;
            var seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1 });
            chai_1.expect(seq1.length()).to.eql(2);
        });
        it('can get the distinct abscissae of a knot sequence', function () {
            var knots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var abscissae = seq.distinctAbscissae();
            chai_1.expect(abscissae).to.eql(knots);
        });
        it('can get the multiplicity of each knot of a knot sequence', function () {
            var knots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.multiplicities()).to.eql(multiplicities);
        });
        it('can check the coincidence of an abscissa with a knot', function () {
            var knots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var abscissae = seq.distinctAbscissae();
            for (var i = 0; i < abscissae.length; i++) {
                chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.eql(true);
            }
        });
        it('can check if the knot multiplicity at a given abscissa is zero', function () {
            var knots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var abscissae = seq.distinctAbscissae();
            for (var i = 0; i < abscissae.length; i++) {
                chai_1.expect(seq.isKnotlMultiplicityZero(abscissae[i])).to.eql(false);
                chai_1.expect(seq.isKnotlMultiplicityZero(abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(true);
                chai_1.expect(seq.isKnotlMultiplicityZero(abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(true);
            }
        });
        it('can get the knot multiplicity from a sequence index', function () {
            var knots = [0.0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            for (var i = 0; i < seq.allAbscissae.length; i++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                var multiplicity = seq.knotMultiplicity(index);
                chai_1.expect(multiplicity).to.eql(multiplicities[i]);
            }
        });
        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one', function () {
            var knots = [0.0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.insertKnot(0.5)).to.eql(false);
            chai_1.expect(seq.insertKnot(0.5 + (KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.eql(false);
            chai_1.expect(seq.insertKnot(0.5 - (KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.eql(false);
        });
        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one and does not issue an error message if the multiplicity is greater than maxMultiplicityOrder', function () {
            var knots = [0.0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.insertKnot(0.5, maxMultiplicityOrder)).to.eql(false);
            chai_1.expect(seq.insertKnot(0.5 + (KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.eql(false);
            chai_1.expect(seq.insertKnot(0.5 - (KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.eql(false);
        });
        it('cannot insert a new knot in the knot sequence if the new knot multiplicity is greater than maxMultiplicityOrder', function () {
            var knots = [0.0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var newKnotAbscissa = 0.3;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(function () { return seq.insertKnot(newKnotAbscissa, 5); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
        });
        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case over uMax', function () {
            var knots = [0.0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(function () { return seq.insertKnot(1.2, 1); }).to.throw(KnotSequences_1.EM_KNOT_INSERTION_OVER_UMAX);
            var knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var multiplicities1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1 });
            chai_1.expect(function () { return seq1.insertKnot(4.2, 1); }).to.throw(KnotSequences_1.EM_KNOT_INSERTION_OVER_UMAX);
        });
        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case lower than sequence origin', function () {
            var knots = [0.0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(function () { return seq.insertKnot(-0.2, 1); }).to.throw(KnotSequences_1.EM_KNOT_INSERTION_UNDER_SEQORIGIN);
            var knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var multiplicities1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1 });
            chai_1.expect(function () { return seq1.insertKnot(-3.2, 1); }).to.throw(KnotSequences_1.EM_KNOT_INSERTION_UNDER_SEQORIGIN);
        });
        it('can insert a knot into knot sequence', function () {
            var knots = [0.0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.insertKnot(0.2, 2)).to.eql(true);
            chai_1.expect(seq.distinctAbscissae()).to.eql([0.0, 0.2, 0.5, 0.6, 0.7, 1]);
            chai_1.expect(seq.multiplicities()).to.eql([4, 2, 1, 1, 2, 4]);
        });
        it('check knot sequence properties after knot insertion', function () {
            var knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var seq1 = seq.clone();
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            chai_1.expect(seq.uMax).to.eql(4);
            chai_1.expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1);
            chai_1.expect(seq.insertKnot(1.2, 1)).to.eql(true);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            chai_1.expect(seq.uMax).to.eql(4);
            chai_1.expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1);
            chai_1.expect(seq1.insertKnot(1.2, 2)).to.eql(true);
            chai_1.expect(seq1.isKnotSpacingUniform).to.eql(false);
            chai_1.expect(seq1.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq1.isKnotMultiplicityNonUniform).to.eql(false);
            chai_1.expect(seq1.uMax).to.eql(4);
            chai_1.expect(seq1.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1);
        });
        it('cannot get the knot abscissa from a sequence index when the index is out of range', function () {
            var maxMultiplicityOrder = 4;
            var knots = [0.0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            chai_1.expect(function () { return seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.allAbscissae.length)); }).to.throw(KnotSequences_1.EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        });
        it('can get the knot abscissa from a knot index of the strictly increasing sequence. Case of non uniform B-Spline', function () {
            var knots = [0.0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            for (var i = 0; i < seq.length(); i++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                var abscissa = seq.abscissaAtIndex(index);
                chai_1.expect(abscissa).to.eql(knots[i]);
            }
        });
        it('can get the knot abscissa from a sequence index. Case of uniform B-Spline', function () {
            var maxMultiplicityOrder = 4;
            var knots = [-3, -2, -1, 0, 0.5, 0.6, 0.7, 1, 2, 3, 4];
            var multiplicities = [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1];
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var abscissae = seq.allAbscissae;
            for (var i = 0; i < seq.length(); i++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                var abscissa = seq.abscissaAtIndex(index);
                chai_1.expect(abscissa).to.eql(abscissae[i]);
            }
        });
        it('can get the knot multiplicity from a sequence index', function () {
            var maxMultiplicityOrder = 4;
            var knots = [0.0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var multiplicities1 = seq.multiplicities();
            for (var i = 0; i < multiplicities1.length; i++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                chai_1.expect(seq.knotMultiplicity(index)).to.eql(multiplicities[i]);
                chai_1.expect(seq.knotMultiplicity(index)).to.eql(multiplicities1[i]);
            }
        });
        it('cannot convert a strictly increasing knot index into an increasing knot index if the strictly increasing index is out of range', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            chai_1.expect(function () { return seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length())); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
            var knots1 = [0, 0.1, 0.2, 0.4, 0.5, 1];
            var multiplicities1 = [4, 1, 2, 1, 3, 4];
            var seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1 });
            chai_1.expect(seq1.isKnotSpacingUniform).to.eql(false);
            chai_1.expect(seq1.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq1.isKnotMultiplicityNonUniform).to.eql(true);
            chai_1.expect(function () { return seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq1.length())); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
        });
        it('can convert a strictly increasing knot index into an increasing knot index for a uniform knot sequence', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            for (var i = 0; i < seq.length(); i++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                var indexInc = seq.toKnotIndexIncreasingSequence(index);
                chai_1.expect(indexInc.knotIndex).to.eql(i);
            }
        });
        it('can convert a strictly increasing knot index into an increasing knot index for a non-uniform knot sequence', function () {
            var knots = [0, 0.1, 0.2, 0.4, 0.5, 1];
            var multiplicities = [4, 1, 2, 1, 3, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(true);
            var offSet = 0;
            for (var i = 0; i < seq.length(); i++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                var indexInc = seq.toKnotIndexIncreasingSequence(index);
                chai_1.expect(indexInc.knotIndex).to.eql(i + offSet);
                offSet = offSet + seq.knotMultiplicity(index) - 1;
            }
        });
        it('cannot raise the multiplicity of an intermediate knot more than (maxMultiplicityOrder - 1) whether knot sequence consistency check is active or not and with constructor type' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.length()).to.eql(knots.length);
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            var mult = maxMultiplicityOrder - 1;
            var sequenceConsistencyCheck = true;
            var _loop_1 = function (i) {
                var seq1 = seq.clone();
                var index = seq.findSpan(knots[i]);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(index, mult, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
            };
            for (var i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                _loop_1(i);
            }
            sequenceConsistencyCheck = false;
            var _loop_2 = function (i) {
                var seq1 = seq.clone();
                var index = seq.findSpan(knots[i]);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(index, mult, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
            };
            for (var i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                _loop_2(i);
            }
        });
        it('cannot raise the multiplicity of an intermediate knot to more than maxMultiplicityOrder with knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.length()).to.eql(knots.length);
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            var multiplicities1 = seq.multiplicities();
            var sequenceConsistencyCheck = true;
            for (var i = 0; i < multiplicities1.length; i++) {
                chai_1.expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
            }
            var _loop_3 = function (i) {
                var seq1 = seq.clone();
                var index = seq1.findSpan(knots[i]);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_ATKNOT);
            };
            for (var i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                _loop_3(i);
            }
        });
        it('cannot raise the multiplicity of extreme knots with uniform knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.length()).to.eql(knots.length);
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            var sequenceConsistencyCheck = true;
            for (var i = 0; i < multiplicities.length; i++) {
                chai_1.expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
            }
            var _loop_4 = function (i) {
                var seq1 = seq.clone();
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
                seq1 = seq.clone();
                index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq1.length() - i - 1);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            };
            for (var i = 0; i < maxMultiplicityOrder; i++) {
                _loop_4(i);
            }
        });
        it('cannot raise the multiplicity of extreme knots with non uniform knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
            var knots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [4, 1, 1, 1, 1, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.length()).to.eql(knots.length);
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            var sequenceConsistencyCheck = true;
            for (var i = 0; i < multiplicities.length; i++) {
                chai_1.expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
            }
            var seq1 = seq.clone();
            var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0);
            chai_1.expect(function () { return seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            seq1 = seq.clone();
            index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq1.length() - 1);
            chai_1.expect(function () { return seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
        });
        it('can raise the multiplicity of any knot of a uniform sequence to more than maxMultiplicityOrder without knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.length()).to.eql(knots.length);
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            var sequenceConsistencyCheck = false;
            for (var i = 0; i < multiplicities.length; i++) {
                chai_1.expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
            }
            for (var i = 0; i < knots.length; i++) {
                var seq1 = seq.clone();
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck);
                chai_1.expect(seq1.multiplicities()[i]).to.eql(maxMultiplicityOrder + 1);
            }
        });
        it('check the knot sequence property update after raising the multiplicity of a knot of a uniform multiplicity sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            var sequenceConsistencyCheck = true;
            for (var i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                var seq1 = seq.clone();
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                seq1.raiseKnotMultiplicity(index, 1, sequenceConsistencyCheck);
                chai_1.expect(seq1.isKnotMultiplicityUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            }
        });
        it('check the knot sequence property update after raising the multiplicity of a knot of a non uniform multiplicity sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
            var knots = [0, 0.1, 0.2, 0.4, 0.5, 1];
            var multiplicities = [4, 1, 2, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(true);
            var sequenceConsistencyCheck = true;
            for (var i = 1; i < (seq.length() - 1); i++) {
                var seq1 = seq.clone();
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                seq1.raiseKnotMultiplicity(index, 1, sequenceConsistencyCheck);
                chai_1.expect(seq1.isKnotMultiplicityUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(true);
            }
        });
        it('can raise the multiplicity of an existing knot with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var index = seq.findSpan(0.2);
            var sequenceConsistencyCheck = true;
            seq.raiseKnotMultiplicity(index, 1);
            chai_1.expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]);
            chai_1.expect(function () { return seq.raiseKnotMultiplicity(index, 2, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
        });
        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            // test with knot sequence consistency check
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length())); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
            // test without knot sequence consistency check
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1), false); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length()), false); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
        });
        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            // test with knot sequence consistency check
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length())); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
            // test without knot sequence consistency check
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1), false); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length()), false); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
        });
        it('cannot decrement the multiplicity of a knot when the knot index is not an intermadiate knot (Case of non uniform B-Spline.) with constructor type: ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE + ' and active sequence consistency check', function () {
            var knots = [0, 0.1, 0.2, 0.4, 0.5, 1];
            var multiplicities = [4, 1, 2, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            var basisAtEnd = seq.getKnotIndexNormalizedBasisAtSequenceEnd();
            // test with knot sequence consistency check
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0)); }).to.throw(KnotSequences_1.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(basisAtEnd.knot); }).to.throw(KnotSequences_1.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
        });
        it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var sequenceConsistencyCheck = false;
            for (var i = 0; i < seq.distinctAbscissae().length; i++) {
                var seq1 = seq.clone();
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck);
                chai_1.expect(seq1.length()).to.eql(seq.length() - 1);
            }
        });
        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one and the knot is strictly inside the normalized basis interval', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var sequenceConsistencyCheck = true;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            for (var i = maxMultiplicityOrder; i < seq.distinctAbscissae().length - maxMultiplicityOrder; i++) {
                var seq1 = seq.clone();
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck);
                if (seq.multiplicities()[i] === 1) {
                    chai_1.expect(seq1.length()).to.eql(seq.length() - 1);
                }
                else {
                    chai_1.expect(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1);
                }
            }
            var seq2 = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities });
            for (var i = maxMultiplicityOrder; i < seq2.distinctAbscissae().length - maxMultiplicityOrder; i++) {
                var seq1 = seq2.clone();
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck);
                if (seq2.multiplicities()[i] === 1) {
                    chai_1.expect(seq1.length()).to.eql(seq2.length() - 1);
                }
                else {
                    chai_1.expect(seq1.multiplicities()[i]).to.eql(seq2.multiplicities()[i] - 1);
                }
            }
        });
        it('can decrement the multiplicity of an existing knot and remove it when its multiplicity equals one', function () {
            var knots = [0, 0.1, 0.2, 0.4, 0.5, 1];
            var multiplicities = [4, 1, 2, 1, 1, 4];
            var maxMultiplicityOrder = 4;
            var sequenceConsistencyCheck = true;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            for (var i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                var seq1 = seq.clone();
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck);
                if (seq.multiplicities()[i] === 1) {
                    chai_1.expect(seq1.length()).to.eql(seq.length() - 1);
                }
                else {
                    chai_1.expect(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1);
                }
            }
            var seq2 = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities });
            for (var i = 1; i < seq2.distinctAbscissae().length - 1; i++) {
                var seq1 = seq2.clone();
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck);
                if (seq2.multiplicities()[i] === 1) {
                    chai_1.expect(seq1.length()).to.eql(seq2.length() - 1);
                }
                else {
                    chai_1.expect(seq1.multiplicities()[i]).to.eql(seq2.multiplicities()[i] - 1);
                }
            }
        });
        it('can decrement the multiplicity of an existing knot and get updated knot spacing property of the sequence', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var abscissa = 0.3;
            var index = seq.findSpan(abscissa);
            var sequenceConsistencyCheck = true;
            chai_1.expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            seq.decrementKnotMultiplicity(index, sequenceConsistencyCheck);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
        });
        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var sequenceConsistencyCheck = true;
            var abscissa = 0.2;
            var index = seq.findSpan(abscissa);
            chai_1.expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            seq.decrementKnotMultiplicity(index, sequenceConsistencyCheck);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
        });
        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence when the knot sequence  consistency is not checked', function () {
            var knots = [0, 0.1, 0.2, 0.3, 0.4, 0.8];
            var multiplicities = [4, 1, 2, 1, 1, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var sequenceConsistencyCheck = false;
            var indexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length() - 1);
            chai_1.expect(seq.multiplicities()).to.eql([4, 1, 2, 1, 1, 4]);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(true);
            seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            chai_1.expect(seq.multiplicities()).to.eql([4, 1, 2, 1, 1, 3]);
        });
        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence origin is updated as well as some abscissae', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var sequenceConsistencyCheck = false;
            var indexOrigin = seq.indexKnotOrigin;
            var abscissa = seq.abscissaAtIndex(indexOrigin);
            chai_1.expect(abscissa).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck);
            seq.updateKnotSequenceThroughNormalizedBasisAnalysis();
            chai_1.expect(seq.indexKnotOrigin).to.eql(indexOrigin);
            chai_1.expect(seq.abscissaAtIndex(indexOrigin)).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            var updatedKnots = [-0.4, -0.3, -0.2, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
            for (var i = 0; i < seq.allAbscissae.length; i++) {
                chai_1.expect(seq.allAbscissae[i]).to.be.closeTo(updatedKnots[i], AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE);
            }
            chai_1.expect(seq.uMax).to.eql(0.4);
        });
        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at uMax is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence uMax is updated as well as some abscissae', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var sequenceConsistencyCheck = false;
            var indexUMax = seq.getKnotIndicesBoundingNormalizedBasis().end.knot;
            var abscissa = seq.abscissaAtIndex(indexUMax);
            chai_1.expect(abscissa).to.eql(seq.uMax);
            seq.decrementKnotMultiplicity(indexUMax, sequenceConsistencyCheck);
            seq.updateKnotSequenceThroughNormalizedBasisAnalysis();
            chai_1.expect(seq.uMax).to.eql(0.4);
            var updatedKnots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8];
            for (var i = 0; i < seq.allAbscissae.length; i++) {
                chai_1.expect(seq.allAbscissae[i]).to.be.closeTo(updatedKnots[i], AbstractBSplineR1toR2_1.TOL_KNOT_COINCIDENCE);
            }
            chai_1.expect(seq.uMax).to.eql(0.4);
        });
        it('cannot get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement and the sequence origin cannot be updated', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var sequenceConsistencyCheck = false;
            var indexOrigin = seq.indexKnotOrigin;
            var abscissa = seq.abscissaAtIndex(indexOrigin);
            chai_1.expect(abscissa).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck);
            chai_1.expect(function () { return seq.updateKnotSequenceThroughNormalizedBasisAnalysis(); }).to.throw(KnotSequences_1.EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
        });
        it('cannot get consistent knot sequence normalized basis when a knot multiplicity is decremented and the knot at origin is removed when the knot sequence consistency is not checked during knot multiplicity decrement', function () {
            var knots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [4, 1, 2, 1, 1, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var sequenceConsistencyCheck = false;
            var indexOrigin = seq.indexKnotOrigin;
            var indexNormalizedBasisAtStart = seq.getKnotIndexNormalizedBasisAtSequenceStart();
            chai_1.expect(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
            chai_1.expect(indexNormalizedBasisAtStart.knot.knotIndex).to.eql(indexOrigin.knotIndex);
            seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck);
            indexNormalizedBasisAtStart = seq.getKnotIndexNormalizedBasisAtSequenceStart();
            chai_1.expect(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
            chai_1.expect(indexNormalizedBasisAtStart.knot.knotIndex).to.not.eql(indexOrigin.knotIndex);
            chai_1.expect(seq.abscissaAtIndex(indexNormalizedBasisAtStart.knot)).to.not.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            var knots1 = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities1 = [4, 2, 1, 1, 1, 4];
            var seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1 });
            var indexOrigin1 = seq1.indexKnotOrigin;
            var indexNormalizedBasisAtStart1 = seq1.getKnotIndexNormalizedBasisAtSequenceStart();
            chai_1.expect(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
            chai_1.expect(indexNormalizedBasisAtStart1.knot.knotIndex).to.eql(indexOrigin1.knotIndex);
            seq1.decrementKnotMultiplicity(indexOrigin1, sequenceConsistencyCheck);
            indexNormalizedBasisAtStart1 = seq1.getKnotIndexNormalizedBasisAtSequenceStart();
            chai_1.expect(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(KnotSequences_2.NormalizedBasisAtSequenceExtremity.OverDefined);
            chai_1.expect(indexNormalizedBasisAtStart1.knot.knotIndex).to.not.eql(indexOrigin1.knotIndex);
            chai_1.expect(seq1.abscissaAtIndex(indexNormalizedBasisAtStart1.knot)).to.not.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
        });
        it('can update the origin and uMax of a knot sequence whose knot multiplicities have been increased/decreased without knot conformity checking', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities });
            var sequenceConsistencyCheck = false;
            var indexOrigin = seq.indexKnotOrigin;
            var abscissa = seq.abscissaAtIndex(indexOrigin);
            chai_1.expect(abscissa).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            chai_1.expect(seq.uMax).to.eql(0.5);
            seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0), sequenceConsistencyCheck);
            seq.updateKnotSequenceThroughNormalizedBasisAnalysis();
            chai_1.expect(seq.abscissaAtIndex(seq.indexKnotOrigin)).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            chai_1.expect(seq.uMax).to.eql(0.4);
        });
        it('can revert the knot sequence for a uniform B-spline', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            // const seqRef = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            var seqReversed = seq.revertKnotSequence();
            var seqReReversed = seqReversed.revertKnotSequence();
            for (var i_1 = 0; i_1 < seq.length(); i_1++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i_1);
                chai_1.expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities());
            var knots1 = [-0.3, -0.2, -0.1, 0, 0.05, 0.2, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            var seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1 });
            // const seqRef1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1})
            var seqReversed1 = seq1.revertKnotSequence();
            var seqReReversed1 = seqReversed1.revertKnotSequence();
            var i = 0;
            for (var i_2 = 0; i_2 < seq1.length(); i_2++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i_2);
                chai_1.expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities());
        });
        it('can revert the knot sequence for a non uniform B-spline', function () {
            var knots = [0, 0.3, 0.4, 0.5, 0.8];
            var multiplicities = [3, 1, 1, 2, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            // const seqRef = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
            var seqReversed = seq.revertKnotSequence();
            var seqReReversed = seqReversed.revertKnotSequence();
            for (var i = 0; i < seq.length(); i++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                chai_1.expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities());
            var knots1 = [0, 0.2, 0.5, 0.8];
            var multiplicities1 = [3, 2, 1, 3];
            var seq1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1 });
            // const seqRef1 = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots1, multiplicities: multiplicities1})
            var seqReversed1 = seq1.revertKnotSequence();
            var seqReReversed1 = seqReversed1.revertKnotSequence();
            for (var i = 0; i < seq1.length(); i++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                chai_1.expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities());
        });
        it('can get the order of multiplicity of a knot from its abscissa', function () {
            var knots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            var distinctKnots = seq.distinctAbscissae();
            var knotMultiplities = seq.multiplicities();
            for (var i = 0; i < distinctKnots.length; i++) {
                chai_1.expect(seq.knotMultiplicityAtAbscissa(distinctKnots[i])).to.eql(knotMultiplities[i]);
            }
        });
        it('get an order of multiplicity 0 and a warning message when the abscissa does not coincide with a knot', function () {
            var knots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.knotMultiplicityAtAbscissa(0.1)).to.eql(0);
            // const multiplicity = seq.knotMultiplicityAtAbscissa(0.1)
            // expect(() => seq.knotMultiplicityAtAbscissa(0.1)).to.eql(WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE)
        });
        it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', function () {
            var knots = [0.0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [4, 1, 1, 2, 4];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve_1.StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(true);
            var indexOffset = -1;
            for (var i = 0; i < seq.distinctAbscissae().length; i++) {
                var abscissa = seq.distinctAbscissae()[i];
                var index = seq.findSpan(abscissa);
                if (i !== (seq.distinctAbscissae().length - 1))
                    indexOffset = i;
                chai_1.expect(index.knotIndex).to.eql(indexOffset);
                if (i < seq.distinctAbscissae().length - 1) {
                    var abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    chai_1.expect(index.knotIndex).to.eql(indexOffset);
                }
            }
        });
    });
});
