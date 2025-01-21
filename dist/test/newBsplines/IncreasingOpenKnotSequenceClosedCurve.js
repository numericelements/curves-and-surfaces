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
var IncreasingOpenKnotSequenceClosedCurve_1 = require("../../src/newBsplines/IncreasingOpenKnotSequenceClosedCurve");
var Piegl_Tiller_NURBS_Book_1 = require("../../src/newBsplines/Piegl_Tiller_NURBS_Book");
var KnotSequenceConstructorInterface_1 = require("../../src/newBsplines/KnotSequenceConstructorInterface");
var fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1 = require("../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC");
var KnotSequences_1 = require("../../src/ErrorMessages/KnotSequences");
var GeneralPurpose_1 = require("../namedConstants/GeneralPurpose");
var KnotSequences_2 = require("../../src/namedConstants/KnotSequences");
var KnotIndexStrictlyIncreasingSequence_1 = require("../../src/newBsplines/KnotIndexStrictlyIncreasingSequence");
var KnotIndexIncreasingSequence_1 = require("../../src/newBsplines/KnotIndexIncreasingSequence");
var Knots_1 = require("../../src/ErrorMessages/Knots");
describe('IncreasingOpenKnotSequenceClosedCurve', function () {
    describe('Constructor', function () {
        describe(KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE, function () {
            it('cannot be initialized with a max multiplicity order smaller than 2 with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE, function () {
                var maxMultiplicityOrder = 1;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('can be initialized with (3 * maxMultiplicityOrder - 2) knots with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE, function () {
                var e_1, _a;
                var maxMultiplicityOrder = 3;
                var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE });
                chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                chai_1.expect(seq.length()).to.eql(3 * maxMultiplicityOrder - 2);
                chai_1.expect(seq.freeKnots).to.eql([1]);
                chai_1.expect(seq.periodicKnots).to.eql([0, 1, 2]);
                var seq1 = [];
                try {
                    for (var seq_1 = __values(seq), seq_1_1 = seq_1.next(); !seq_1_1.done; seq_1_1 = seq_1.next()) {
                        var knot = seq_1_1.value;
                        if (knot !== undefined)
                            seq1.push(knot);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (seq_1_1 && !seq_1_1.done && (_a = seq_1.return)) _a.call(seq_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                chai_1.expect(seq1).to.eql([-2, -1, 0, 1, 2, 3, 4]);
            });
            it('can be initialized with 5 knots ((3 * maxMultiplicityOrder - 1) knots) when maxMultiplicityOrder = 2 with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE, function () {
                var e_2, _a;
                var maxMultiplicityOrder = 2;
                var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE });
                chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                chai_1.expect(seq.length()).to.eql(5);
                chai_1.expect(seq.freeKnots).to.eql([1]);
                chai_1.expect(seq.periodicKnots).to.eql([0, 1, 2]);
                var seq1 = [];
                try {
                    for (var seq_2 = __values(seq), seq_2_1 = seq_2.next(); !seq_2_1.done; seq_2_1 = seq_2.next()) {
                        var knot = seq_2_1.value;
                        if (knot !== undefined)
                            seq1.push(knot);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (seq_2_1 && !seq_2_1.done && (_a = seq_2.return)) _a.call(seq_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                chai_1.expect(seq1).to.eql([-1, 0, 1, 2, 3]);
            });
            it('can get properties of the knot sequence initialized with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE, function () {
                var maxMultiplicityOrder = 2;
                var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE });
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            });
            it('can get the knot index of the origin of a knot sequence initialized with ' + KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE, function () {
                var maxMultiplicityOrder = 2;
                var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE });
                chai_1.expect(seq.indexKnotOrigin.knotIndex).to.eql(1);
            });
            it('can get the uMax of a knot sequence initialized with ' + KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE + 'specific case with maxMultiplicityOrder = 2', function () {
                var maxMultiplicityOrder = 2;
                var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE });
                chai_1.expect(seq.uMax).to.eql(2);
            });
            it('can get the uMax of a knot sequence initialized with ' + KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE + 'generic case with maxMultiplicityOrder > 2', function () {
                var maxMultiplicityOrder = 3;
                var upperBound = 4;
                for (var i = maxMultiplicityOrder; i < maxMultiplicityOrder + upperBound; i++) {
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(i, { type: KnotSequenceConstructorInterface_1.NO_KNOT_CLOSED_CURVE });
                    chai_1.expect(seq.uMax).to.eql(i - 1);
                }
            });
        });
        describe(KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 1;
                var BsplBasisSize = 2;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than 3 when maxMultiplicity = 2 with ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 2;
                var BsplBasisSize = 2;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize }); }).to.throw(KnotSequences_1.EM_SIZENORMALIZED_BSPLINEBASIS);
            });
            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var BsplBasisSize = 2;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize }); }).to.throw(KnotSequences_1.EM_SIZENORMALIZED_BSPLINEBASIS);
            });
            it('can be initialized with a size of normalized B-spline basis produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var e_3, _a;
                for (var i = 2; i < 5; i++) {
                    var maxMultiplicityOrder = i;
                    var upperBound = 4;
                    for (var j = maxMultiplicityOrder; j < (maxMultiplicityOrder + upperBound); j++) {
                        if (!(maxMultiplicityOrder === 2 && j < 3)) {
                            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: j });
                            var knots = [];
                            for (var k = -(maxMultiplicityOrder - 1); k < (j + maxMultiplicityOrder - 1); k++) {
                                knots.push(k);
                            }
                            var seq1 = [];
                            try {
                                for (var seq_3 = (e_3 = void 0, __values(seq)), seq_3_1 = seq_3.next(); !seq_3_1.done; seq_3_1 = seq_3.next()) {
                                    var knot = seq_3_1.value;
                                    if (knot !== undefined)
                                        seq1.push(knot);
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
                        }
                    }
                }
            });
            it('can get the knot index of the curve origin produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var BsplBasisSize = 3;
                var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                chai_1.expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1);
            });
            it('can get the u interval upper bound produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var BsplBasisSize = 3;
                var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                chai_1.expect(seq.uMax).to.eql(BsplBasisSize - 1);
            });
            it('can get the properties of knot sequnence produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var BsplBasisSize = 3;
                var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            });
        });
        describe(KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
            it('cannot be initialized with a max multiplicity order smaller than 2 with type constructor' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
                var maxMultiplicityOrder = 1;
                var periodicKnots = [0, 1];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot be initialized with a non increasing knot sequence with type constructor' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
                var knots = [0, 1, 2, 1.5, 3, 4];
                var maxMultiplicityOrder = 3;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: knots }); }).to.throw(KnotSequences_1.EM_NON_INCREASING_KNOT_VALUES);
                var knots1 = [0, -0.5, 1, 2, 3, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: knots1 }); }).to.throw(KnotSequences_1.EM_NON_INCREASING_KNOT_VALUES);
                var knots2 = [0, 1, 2, 3, 4, 3.5];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: knots2 }); }).to.throw(KnotSequences_1.EM_NON_INCREASING_KNOT_VALUES);
            });
            it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
                var maxMultiplicityOrder = 3;
                var periodicKnots = [0, 1, 1, 1, 1, 2, 3];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder at the sequence origin with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
                var maxMultiplicityOrder = 3;
                var periodicKnots = [0, 0, 0, 0, 1, 2, 3, 3, 3, 3];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it('cannot be initialized with a null knot length array ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
                var maxMultiplicityOrder = 3;
                var periodicKnots = [];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots }); }).to.throw(KnotSequences_1.EM_NULL_KNOT_SEQUENCE);
            });
            it('cannot initialize a knot sequence if end knot multiplicities differ when multiplicity is equal or greater than maxMultiplicityOrder', function () {
                var periodicKnots = [0, 0, 1, 2, 3, 4];
                var maxMultiplicityOrder = 2;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots }); }).to.throw(KnotSequences_1.EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER);
            });
            it('cannot initialize a knot sequence if end knot multiplicities differ when multiplicity is lower than maxMultiplicityOrder', function () {
                var periodicKnots = [0, 0, 1, 2, 3, 4];
                var maxMultiplicityOrder = 3;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots }); }).to.throw(KnotSequences_1.EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER);
            });
            it('can be initialized with type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
                var e_4, _a;
                var maxMultiplicityOrder = 2;
                var periodicKnots = [0, 1, 2];
                var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
                chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                var seq1 = [];
                try {
                    for (var seq_4 = __values(seq), seq_4_1 = seq_4.next(); !seq_4_1.done; seq_4_1 = seq_4.next()) {
                        var knot = seq_4_1.value;
                        if (knot !== undefined)
                            seq1.push(knot);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (seq_4_1 && !seq_4_1.done && (_a = seq_4.return)) _a.call(seq_4);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                chai_1.expect(seq.allAbscissae).to.eql(seq1);
                chai_1.expect(seq.periodicKnots).to.eql(periodicKnots);
            });
            it('can get the properties of the knot sequence initialized with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
                var maxMultiplicityOrder = 2;
                var periodicKnots = [0, 1, 2];
                var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                chai_1.expect(seq.uMax).to.eql(2);
            });
            it('can get the knot index of the knot sequence origin initialized with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
                var maxMultiplicityOrder = 2;
                var periodicKnots = [0, 1, 2];
                var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
                chai_1.expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1);
            });
            it('can get the uMax of the knot sequence origin initialized with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
                var maxMultiplicityOrder = 2;
                var periodicKnots = [0, 1, 2];
                var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
                chai_1.expect(seq.uMax).to.eql(seq.length() - maxMultiplicityOrder - 1);
            });
        });
        describe(KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
                var maxMultiplicityOrder = 0;
                var knots = [0, 1];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot be initialized with a null knot sequence with type constructor' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
                var knots = [];
                var maxMultiplicityOrder = 3;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_NULL_KNOT_SEQUENCE);
            });
            it('cannot initialize a knot sequence with a number of knots smaller than maxMultiplicityOrder for a constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
                var maxMultiplicityOrder = 4;
                var knots = [-1, 0, 1];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_NOT_NORMALIZED_BASIS);
            });
            it('cannot initialize a knot sequence with a number of knots such that there no interval of normalized basis left with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
                var maxMultiplicityOrder = 4;
                var knots = [-2, -1, 0, 1, 2];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('cannot initialize a knot sequence with a number of knots such that the interval of normalized basis reduces to zero with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
                var maxMultiplicityOrder = 4;
                var knots = [-3, -2, -1, 0, 1, 2, 3];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('cannot be initialized with a non increasing knot sequence with type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
                var knots = [-2, -1, 0, 1, 2, 1.5, 3, 4];
                var maxMultiplicityOrder = 3;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_NON_INCREASING_KNOT_VALUES);
                var knots1 = [-2, -2.5, 0, 1, 2, 3, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 }); }).to.throw(KnotSequences_1.EM_NON_INCREASING_KNOT_VALUES);
                var knots2 = [-2, -1, 0, 1, 2, 3, 4, 3.5];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2 }); }).to.throw(KnotSequences_1.EM_NON_INCREASING_KNOT_VALUES);
            });
            it('cannot be initialized with a knot sequence containing a knot at sequence extremity with more than maxMultiplicityOrder multiplicity with constryctor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
                var knots = [0, 0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                var maxMultiplicityOrder = 4;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it('cannot be initialized with a knot sequence containing a knot with more than maxMultiplicityOrder multiplicity with constryctor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
                var knots = [-0.3, 0, 0, 0, 0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.7, 1, 1, 1, 1.5];
                var maxMultiplicityOrder = 4;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it("cannot be initialized with an initializer " + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot multiplicities from the sequence start don't define a normalized basis", function () {
                var maxMultiplicityOrder = 4;
                var knots = [-1, -1, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
            });
            it("cannot be initialized with an initializer " + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot multiplicities from the sequence end don't define a normalized basis", function () {
                var maxMultiplicityOrder = 4;
                var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 2, 2];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND);
            });
            it("cannot be initialized with an initializer " + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot multiplicities at normalized basis extremities differ. Uniform B-Spline type", function () {
                var maxMultiplicityOrder = 4;
                var knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 6, 7, 8];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER);
            });
            it('cannot be initialized with the initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' when knot multiplicities at normalized basis extremities differ. Non-uniform B-Spline type', function () {
                var maxMultiplicityOrder = 4;
                var knots = [0, 0, 0, 0, 1, 1, 1, 2];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER);
            });
            it("cannot be initialized with an initializer " + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot intervals at left from the origin don't match those at the left hand side of the right bound of the normalized basis interval", function () {
                var maxMultiplicityOrder = 4;
                var knots = [-3, -2, -1, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 2, 3, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
                var knots1 = [-3, -2, -0.2, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 2, 3, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 }); }).to.throw(KnotSequences_1.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
                var knots2 = [-3, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 2, 3, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2 }); }).to.throw(KnotSequences_1.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
            });
            it("cannot be initialized with an initializer " + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot intervals at right from the right bound of the normalized basis interval don't match those at the right hand side of the origin", function () {
                var maxMultiplicityOrder = 4;
                var knots3 = [-0.3, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 2, 3, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots3 }); }).to.throw(KnotSequences_1.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
                var knots4 = [-0.3, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1.5, 3, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots4 }); }).to.throw(KnotSequences_1.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
                var knots5 = [-0.3, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1.5, 1.6, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots5 }); }).to.throw(KnotSequences_1.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
                var knots6 = [-0.3, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1.5, 1.6, 1.7];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots6 }); }).to.not.throw();
            });
            it("cannot be initialized with an initializer " + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot intervals at left from the origin don't match those at the left hand side of the right bound of the normalized basis interval. The knot at origin has a multiplicity greater than one.", function () {
                var maxMultiplicityOrder = 4;
                var knots = [-3, -2, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1, 3, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
                var knots1 = [-3, -0.2, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1, 3, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 }); }).to.throw(KnotSequences_1.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT);
            });
            it("cannot be initialized with an initializer " + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot intervals at right from the right bound of the normalized basis interval don't match those at the right hand side of the origin", function () {
                var maxMultiplicityOrder = 4;
                var knots3 = [-0.3, -0.2, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1, 3, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots3 }); }).to.throw(KnotSequences_1.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
                var knots4 = [-0.3, -0.2, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1, 1.5, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots4 }); }).to.throw(KnotSequences_1.EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT);
                var knots5 = [-0.3, -0.2, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1, 1.5, 1.6];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots5 }); }).to.not.throw();
            });
            it('cannot be initialized with the initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' when knot multiplicities at normalized basis extremities differ', function () {
                var maxMultiplicityOrder = 4;
                var knots = [0, 0, 0, 0, 1, 1, 1, 2];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER);
            });
            describe('Initialization of knot sequences for non uniform closed B-splines', function () {
                it('can be initialized with an initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + '. Non uniform knot sequence of closed curve without intermediate knots', function () {
                    var e_5, _a;
                    var maxMultiplicityOrder = 4;
                    var knots = [0, 0, 0, 0, 1, 1, 1, 1];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    var seq1 = [];
                    try {
                        for (var seq_5 = __values(seq), seq_5_1 = seq_5.next(); !seq_5_1.done; seq_5_1 = seq_5.next()) {
                            var knot = seq_5_1.value;
                            if (knot !== undefined)
                                seq1.push(knot);
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
                });
                it('can check the initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + 'for consistency of the knot sequence and knot multiplicities', function () {
                    var maxMultiplicityOrder = 4;
                    var knots = [0, 0, 0, 0, 1, 1, 1, 1];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    var seq1 = seq.allAbscissae;
                    chai_1.expect(function () { return seq.checkSizeConsistency(seq1.slice(1, seq1.length - 1)); }).to.throw(KnotSequences_1.EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ);
                });
                it('can get the properties of the knot sequence with type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
                    var maxMultiplicityOrder = 4;
                    var knots = [0, 0, 0, 0, 1, 1, 1, 1];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                    chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
                });
                it('check that the non uniform property is deactivated for all knot sequences of this class', function () {
                    var maxMultiplicityOrder = 4;
                    var knots = [0, 0, 0, 0, 1, 1, 1, 1];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index and the abscissa of the upper bound of the normalized basis. Non uniform B-Spline without intermediate knot', function () {
                    var maxMultiplicityOrder = 4;
                    var knots = [0, 0, 0, 0, 1, 1, 1, 1];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
                    chai_1.expect(seq.uMax).to.eql(knots[knots.length - 1]);
                });
                it('can be initialized with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' initializer. non uniform knot sequence of open curve with intermediate knots', function () {
                    var e_6, _a;
                    var maxMultiplicityOrder = 4;
                    var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    var seq1 = [];
                    try {
                        for (var seq_6 = __values(seq), seq_6_1 = seq_6.next(); !seq_6_1.done; seq_6_1 = seq_6.next()) {
                            var knot = seq_6_1.value;
                            if (knot !== undefined)
                                seq1.push(knot);
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
                });
                it('can get the properties of knot sequence: non uniform knot sequence of open curve with intermediate knots with type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
                    var maxMultiplicityOrder = 4;
                    var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
                    chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
                    chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: non uniform knot sequence of open curve with intermediate knots', function () {
                    var maxMultiplicityOrder = 4;
                    var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
                    chai_1.expect(seq.uMax).to.eql(1);
                });
            });
            describe('Initialization of knot sequences for uniform  closed B-splines', function () {
                it('can be initialized with an initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + '. uniform knot sequence of open curve without intermediate knots', function () {
                    var e_7, _a;
                    var maxMultiplicityOrder = 2;
                    var knots = [-1, 0, 1, 2, 3, 5, 6, 7];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    var seq1 = [];
                    try {
                        for (var seq_7 = __values(seq), seq_7_1 = seq_7.next(); !seq_7_1.done; seq_7_1 = seq_7.next()) {
                            var knot = seq_7_1.value;
                            if (knot !== undefined)
                                seq1.push(knot);
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
                });
                it('can get the properties of the knot sequence. uniform B-Spline with uniformly distributed knots with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
                    var maxMultiplicityOrder = 2;
                    var knots = [-1, 0, 1, 2, 3, 4, 5, 6];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                    chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                    chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the properties of the knot sequence. uniform B-Spline with non uniformly distributed knots with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
                    var maxMultiplicityOrder = 2;
                    var knots = [-1, 0, 1, 2.5, 3, 4, 5, 6];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
                    chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                    chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: uniform knot sequence of closed curve', function () {
                    var maxMultiplicityOrder = 3;
                    var knots = [-0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 1.5, 1.6];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(maxMultiplicityOrder - 1));
                    chai_1.expect(seq.uMax).to.eql(1);
                });
            });
            describe('Initialization of arbitrary knot sequences for B-splines', function () {
                it('can be initialized with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' initializer. arbitrary knot sequence', function () {
                    var e_8, _a;
                    var maxMultiplicityOrder = 4;
                    var knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    var seq1 = [];
                    try {
                        for (var seq_8 = __values(seq), seq_8_1 = seq_8.next(); !seq_8_1.done; seq_8_1 = seq_8.next()) {
                            var knot = seq_8_1.value;
                            if (knot !== undefined)
                                seq1.push(knot);
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
                });
                it('can get the properties of the knot sequence. closed B-Spline with arbitrary distributed knots', function () {
                    var maxMultiplicityOrder = 4;
                    var knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
                    chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
                    chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: arbitrary knot sequence of closed B-spline', function () {
                    var maxMultiplicityOrder = 4;
                    var knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6];
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(1));
                    chai_1.expect(seq.uMax).to.eql(1);
                });
            });
        });
        describe(KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
                var maxMultiplicityOrder = 0;
                var knots = [0, 1];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot be initialized with a null knot sequence produced by the initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
                var maxMultiplicityOrder = 3;
                var knots = [];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_NULL_KNOT_SEQUENCE);
            });
            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
                var maxMultiplicityOrder = 3;
                var knots = [0, 0.5, 2, 3, 4, 5, 5, 5, 5];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
                var knots1 = [0, 0, 0, 0, 0.5, 2, 3, 4, 5];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots1 }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
                var knots2 = [0, 0.5, 2, 2, 2, 2, 3, 4, 5];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots2 }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it('cannot be initialized with a knot sequence producing a non normalized basis', function () {
                var knots = [-1, 0, 1];
                var maxMultiplicityOrder = 4;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_NOT_NORMALIZED_BASIS);
            });
            it('cannot be initialized with a knot sequence able to produce normalized basis intervals that are incompatible with each other', function () {
                var knots = [-2, -1, 0, 1, 2];
                var maxMultiplicityOrder = 4;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('cannot be initialized with a knot sequence producing a normalized basis interval with null amplitude', function () {
                var knots = [-3, -2, -1, 0, 1, 2, 3];
                var maxMultiplicityOrder = 4;
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('cannot be initialized with a non increasing knot sequence produced by the initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
                var maxMultiplicityOrder = 3;
                var knots = [0, 0, -0.5, 2, 3, 4, 5, 5, 5];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots }); }).to.throw(KnotSequences_1.EM_NON_INCREASING_KNOT_VALUES);
                var knots1 = [-2, -2.5, 0, 1, 2, 3, 4];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots1 }); }).to.throw(KnotSequences_1.EM_NON_INCREASING_KNOT_VALUES);
                var knots2 = [0, 0, 1, 2, 3, 4, 4, 3.5];
                chai_1.expect(function () { return new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots2 }); }).to.throw(KnotSequences_1.EM_NON_INCREASING_KNOT_VALUES);
            });
            it('can be initialized with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
                var maxMultiplicityOrder = 3;
                var knots = [-1, 0, 0, 0.5, 2, 3, 4, 4, 4.5];
                var upperBound = knots.length;
                for (var i = maxMultiplicityOrder; i < upperBound - maxMultiplicityOrder; i++) {
                    var knots1 = knots.slice();
                    for (var j = 1; j < maxMultiplicityOrder; j++) {
                        knots.splice(i, 0, knots[i]);
                    }
                    var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
                    chai_1.expect(seq.allAbscissae).to.eql(knots);
                    knots = knots1.slice();
                }
            });
        });
    });
    describe('Accessors', function () {
        it('can get all the abscissa of the knot sequence', function () {
            var maxMultiplicityOrder = 3;
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.allAbscissae).to.eql(knots);
        });
        it('can use the iterator to access the knots of the sequence', function () {
            var e_9, _a;
            var maxMultiplicityOrder = 4;
            var knots = [0, 0, 0, 0, 1, 2, 2, 2, 2];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var seq1 = [];
            try {
                for (var seq_9 = __values(seq), seq_9_1 = seq_9.next(); !seq_9_1.done; seq_9_1 = seq_9.next()) {
                    var knot = seq_9_1.value;
                    if (knot !== undefined)
                        seq1.push(knot);
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (seq_9_1 && !seq_9_1.done && (_a = seq_9.return)) _a.call(seq_9);
                }
                finally { if (e_9) throw e_9.error; }
            }
            chai_1.expect(seq1).to.eql(knots);
        });
        it('can get the periodic knots of the knot sequence', function () {
            var maxMultiplicityOrder = 3;
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var knots1 = [];
            for (var i = seq.maxMultiplicityOrder - 1; i < (seq.length() - seq.maxMultiplicityOrder + 1); i++) {
                knots1.push(knots[i]);
            }
            chai_1.expect(seq.periodicKnots).to.eql(knots1);
        });
        it('can get the periodic knots of the knot sequence when the knot at the sequence origin has a multiplicity greater than one', function () {
            var maxMultiplicityOrder = 3;
            var knots = [-1, 0, 0, 1, 2, 3, 4, 5, 5, 6];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var knots1 = [];
            var indexOrigin = seq.indexKnotOrigin;
            var multiplicityOrigin = seq.knotMultiplicity(indexOrigin);
            for (var i = seq.maxMultiplicityOrder - multiplicityOrigin; i < (seq.length() - seq.maxMultiplicityOrder + multiplicityOrigin); i++) {
                knots1.push(knots[i]);
            }
            chai_1.expect(seq.periodicKnots).to.eql(knots1);
        });
        it('can get the free knots (the knots that are effectively independent of each other when considering the control points associated with the knot sequence) of the knot sequence', function () {
            var maxMultiplicityOrder = 3;
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var knots1 = [];
            for (var i = seq.maxMultiplicityOrder; i < (seq.length() - seq.maxMultiplicityOrder); i++) {
                knots1.push(knots[i]);
            }
            chai_1.expect(seq.freeKnots).to.eql(knots1);
        });
        it('can get the knot index of the knot defining the origin of the knot sequence', function () {
            var maxMultiplicityOrder = 3;
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(maxMultiplicityOrder - 1));
        });
        it('can get the knot index of the knot defining the origin of the knot sequence. Case of non-uniform knot sequence', function () {
            var maxMultiplicityOrder = 3;
            var knots = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
        });
        it('can get the status of the knot sequence about the description of C0 discontinuity', function () {
            var maxMultiplicityOrder = 3;
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            var seq1 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq1.isSequenceUpToC0Discontinuity).to.eql(true);
        });
        it('can get the maximum multiplicity order of the knot sequence', function () {
            var maxMultiplicityOrder = 3;
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        });
    });
    describe('Methods', function () {
        it('can clone the knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
            var maxMultiplicityOrder = 4;
            var knots = [0, 0, 0, 0, 1, 1, 1.5, 2, 2, 2, 2];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            var seq1 = seq.clone();
            chai_1.expect(seq1.isSequenceUpToC0Discontinuity).to.eql(false);
            chai_1.expect(seq1).to.eql(seq);
            var knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var seq2 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 });
            chai_1.expect(seq2.isSequenceUpToC0Discontinuity).to.eql(false);
            var seq3 = seq2.clone();
            chai_1.expect(seq3.isSequenceUpToC0Discontinuity).to.eql(false);
            chai_1.expect(seq3).to.eql(seq2);
        });
        it('can clone the knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
            var maxMultiplicityOrder = 4;
            var knots = [0, 0, 0, 0, 1, 1, 1.5, 2, 2, 2, 2];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            var seq1 = seq.clone();
            chai_1.expect(seq1.isSequenceUpToC0Discontinuity).to.eql(true);
            chai_1.expect(seq1).to.eql(seq);
            var knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var seq2 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots1 });
            chai_1.expect(seq2.isSequenceUpToC0Discontinuity).to.eql(true);
            var seq3 = seq2.clone();
            chai_1.expect(seq3.isSequenceUpToC0Discontinuity).to.eql(true);
            chai_1.expect(seq3).to.eql(seq2);
        });
        it('can get the knot sequence length', function () {
            var curveDegree = 3;
            var knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1);
            chai_1.expect(seq.length()).to.eql(knots.length);
            var knots1 = [0, 0, 0, 0, 1, 1, 1, 1];
            var seq1 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 });
            chai_1.expect(seq1.maxMultiplicityOrder).to.eql(curveDegree + 1);
            chai_1.expect(seq1.length()).to.eql(knots1.length);
        });
        it('can get the distinct abscissae of a minimal knot sequence conforming to a non-uniform B-spline', function () {
            var knots = [0, 0, 0, 0, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var knots1 = knots.slice(maxMultiplicityOrder - 1, knots.length - maxMultiplicityOrder + 1);
            chai_1.expect(seq.distinctAbscissae()).to.eql(knots1);
        });
        it('can get the distinct abscissae of a knot sequence conforming to a non-uniform B-spline', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1]);
        });
        it('can get the distinct multiplicities of a minimal knot sequence conforming to a non-uniform B-spline', function () {
            var knots = [0, 0, 0, 0, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.multiplicities()).to.eql([4, 4]);
        });
        it('can get the distinct multiplicities of a knot sequence conforming to a non-uniform B-spline', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.multiplicities()).to.eql([4, 1, 1, 2, 4]);
        });
        it('cannot get the knot abscissa from a sequence index when the index is out of range', function () {
            var maxMultiplicityOrder = 4;
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            chai_1.expect(function () { return seq.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(seq.length())); }).to.throw(KnotSequences_1.EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        });
        it('can get the knot abscissa from a sequence index. Case of non uniform B-Spline', function () {
            var maxMultiplicityOrder = 4;
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var abscissae = seq.allAbscissae;
            for (var i = 0; i < seq.length(); i++) {
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                var abscissa = seq.abscissaAtIndex(index);
                chai_1.expect(abscissa).to.eql(abscissae[i]);
            }
        });
        it('can get the knot abscissa from a sequence index. Case of uniform B-Spline', function () {
            var maxMultiplicityOrder = 4;
            var knots = [-0.4, -0.3, -0.3, 0, 0.5, 0.6, 0.7, 0.7, 1, 1.5, 1.6, 1.7];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var abscissae = seq.allAbscissae;
            for (var i = 0; i < seq.length(); i++) {
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                var abscissa = seq.abscissaAtIndex(index);
                chai_1.expect(abscissa).to.eql(abscissae[i]);
            }
        });
        it('can get the knot index in the associated strictly increasing sequence from a sequence index of the increasing sequence.', function () {
            var maxMultiplicityOrder = 4;
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0);
            var indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            chai_1.expect(indexStrictlyIncSeq.knotIndex).to.eql(0);
            index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            chai_1.expect(indexStrictlyIncSeq.knotIndex).to.eql(0);
            index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(4);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            chai_1.expect(indexStrictlyIncSeq.knotIndex).to.eql(1);
            index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(11);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            chai_1.expect(indexStrictlyIncSeq.knotIndex).to.eql(4);
        });
        it('cannot convert a strictly increasing knot index into an increasing knot index if the strictly increasing index is out of range', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            chai_1.expect(function () { return seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length())); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
            var knots1 = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.4, 0.5, 0.5, 0.5, 1, 1, 1, 1];
            var seq1 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 });
            chai_1.expect(seq1.isKnotSpacingUniform).to.eql(false);
            chai_1.expect(seq1.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq1.isKnotMultiplicityNonUniform).to.eql(false);
            var seqStrcInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq1);
            chai_1.expect(function () { return seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seqStrcInc.length())); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
        });
        it('can convert a strictly increasing knot index into an increasing knot index for a uniform knot sequence', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
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
            var knots = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.4, 0.5, 0.5, 0.5, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            var seqStrcInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            var offSet = 0;
            for (var i = 0; i < seqStrcInc.length(); i++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                var indexInc = seq.toKnotIndexIncreasingSequence(index);
                chai_1.expect(indexInc.knotIndex).to.eql(i + offSet);
                offSet = offSet + seq.knotMultiplicity(index) - 1;
            }
        });
        it('can get the knot multiplicity from a sequence index', function () {
            var maxMultiplicityOrder = 4;
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var multiplicities = seq.multiplicities();
            var cumulativeMult = 0;
            for (var i = 0; i < multiplicities.length; i++) {
                var j = 0;
                while (j < multiplicities[i]) {
                    var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(j + cumulativeMult);
                    var indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
                    chai_1.expect(seq.knotMultiplicity(indexStrictlyIncSeq)).to.eql(multiplicities[i]);
                    j++;
                }
                cumulativeMult += multiplicities[i];
            }
        });
        it('cannot extract a subset of an increasing knot sequence when indices are out of range', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.uMax).to.eql(0.5);
            var Istart = 0;
            var Iend = Istart;
            chai_1.expect(function () { return seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Iend)); }).to.not.throw(KnotSequences_1.EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE);
            Istart = 6;
            Iend = 5;
            chai_1.expect(function () { return seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Iend)); }).to.throw(KnotSequences_1.EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE);
            Iend = seq.distinctAbscissae().length;
            chai_1.expect(function () { return seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Iend)); }).to.throw(KnotSequences_1.EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE);
            Istart = -1;
            Iend = seq.distinctAbscissae().length - 1;
            chai_1.expect(function () { return seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Iend)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
        });
        it('can extract a subset of an increasing knot sequence of a uniform B-spline', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.uMax).to.eql(0.5);
            var subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1));
            chai_1.expect(subseq).to.eql([-0.3, -0.2]);
            var subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(6));
            chai_1.expect(subseq1).to.eql([0, 0.1, 0.2, 0.3]);
            var subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(5), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(8));
            chai_1.expect(subseq2).to.eql([0.2, 0.3, 0.4, 0.5]);
            var subseq3 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(knots.length - 2), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(knots.length - 1));
            chai_1.expect(subseq3).to.eql([0.7, 0.8]);
            var subseq4 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(knots.length - 1));
            chai_1.expect(subseq4).to.eql(knots);
        });
        it('can extract a subset of an increasing knot sequence of a non uniform B-spline', function () {
            var knots = [0, 0, 0, 0, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1));
            chai_1.expect(subseq).to.eql([0, 0]);
            var subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(4));
            chai_1.expect(subseq1).to.eql([0, 0, 1]);
            var subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(5));
            chai_1.expect(subseq2).to.eql([0, 1, 1]);
            var subseq3 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(knots.length - 2), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(knots.length - 1));
            chai_1.expect(subseq3).to.eql([1, 1]);
            var subseq4 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(knots.length - 1));
            chai_1.expect(subseq4).to.eql(knots);
        });
        it('can get knot multiplicity at knot sequence origin', function () {
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var maxMultiplicityOrder = 3;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.distinctAbscissae()).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]);
            chai_1.expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
            chai_1.expect(seq.getKnotMultiplicityAtSequenceOrigin()).to.eql(1);
            var knots1 = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2];
            maxMultiplicityOrder = 4;
            var seq1 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 });
            chai_1.expect(seq1.distinctAbscissae()).to.eql([-0.2, -0.1, 0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2]);
            chai_1.expect(seq1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1]);
            chai_1.expect(seq1.getKnotMultiplicityAtSequenceOrigin()).to.eql(2);
            var knots2 = [-0.1, 0.0, 0.0, 0.0, 0.1, 0.6, 0.7, 0.9, 1, 1, 1, 1.1];
            var seq2 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2 });
            chai_1.expect(seq2.distinctAbscissae()).to.eql([-0.1, 0, 0.1, 0.6, 0.7, 0.9, 1, 1.1]);
            chai_1.expect(seq2.multiplicities()).to.eql([1, 3, 1, 1, 1, 1, 3, 1]);
            chai_1.expect(seq2.getKnotMultiplicityAtSequenceOrigin()).to.eql(3);
            var knots3 = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var seq3 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots3 });
            chai_1.expect(seq3.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1]);
            chai_1.expect(seq3.multiplicities()).to.eql([4, 1, 1, 2, 4]);
            chai_1.expect(seq3.getKnotMultiplicityAtSequenceOrigin()).to.eql(4);
        });
        it('can check if an abscissa coincides with a knot belonging to the interval of the normalized basis', function () {
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var maxMultiplicityOrder = 3;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var abscissae = seq.distinctAbscissae();
            for (var i = maxMultiplicityOrder - 1; i < abscissae.length - maxMultiplicityOrder; i++) {
                chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.eql(true);
            }
        });
        it('cannot check if an abscissa coincides with a knot belonging to the interval of the curve if this abscissa is outside the interval of the normalized basis', function () {
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var maxMultiplicityOrder = 3;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var abscissae = seq.distinctAbscissae();
            var _loop_1 = function (i) {
                chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                chai_1.expect(function () { return seq.isAbscissaCoincidingWithKnot(abscissae[i]); }).to.throw(KnotSequences_1.EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE);
                chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[abscissae.length - 1 - i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[abscissae.length - 1 - i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                chai_1.expect(function () { return seq.isAbscissaCoincidingWithKnot(abscissae[abscissae.length - 1 - i]); }).to.throw(KnotSequences_1.EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE);
            };
            for (var i = 0; i < maxMultiplicityOrder - 1; i++) {
                _loop_1(i);
            }
        });
        it('can get the knot index in the associated strictly increasing sequence from a sequence index of the increasing sequence.', function () {
            var maxMultiplicityOrder = 4;
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0);
            var indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            chai_1.expect(indexStrictlyIncSeq.knotIndex).to.eql(0);
            index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            chai_1.expect(indexStrictlyIncSeq.knotIndex).to.eql(0);
            index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(4);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            chai_1.expect(indexStrictlyIncSeq.knotIndex).to.eql(1);
            index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(11);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            chai_1.expect(indexStrictlyIncSeq.knotIndex).to.eql(4);
        });
        it('can get the knot index in the associated strictly increasing sequence from a sequence index of the increasing uniform sequence.', function () {
            var maxMultiplicityOrder = 4;
            var knots = [-0.4, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 1.5, 1.6, 1.7];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            for (var i = 0; i < seq.allAbscissae.length; i++) {
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                var indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
                chai_1.expect(indexStrictlyIncSeq.knotIndex).to.eql(i);
            }
        });
        it('can check if the knot multiplicity at a given abscissa is zero', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var abscissae = seq.distinctAbscissae();
            for (var i = 0; i < abscissae.length; i++) {
                chai_1.expect(seq.isKnotlMultiplicityZero(abscissae[i])).to.eql(false);
                chai_1.expect(seq.isKnotlMultiplicityZero(abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(true);
                chai_1.expect(seq.isKnotlMultiplicityZero(abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(true);
            }
        });
        it('can get the knot multiplicity from an index of the strictly increasing sequence', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var multiplicities = seq.multiplicities();
            for (var i = 0; i < multiplicities.length; i++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                var multiplicity = seq.knotMultiplicity(index);
                chai_1.expect(multiplicity).to.eql(multiplicities[i]);
            }
            for (var i = 0; i < seq.allAbscissae.length; i++) {
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                var indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
                var multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq);
                chai_1.expect(multiplicity).to.eql(multiplicities[indexStrictlyIncSeq.knotIndex]);
            }
        });
        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.insertKnot(0.5)).to.eql(false);
            chai_1.expect(seq.insertKnot(0.5 + (KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.eql(false);
            chai_1.expect(seq.insertKnot(0.5 - (KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.eql(false);
        });
        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one and does not issue an error message if the multiplicity is greater than maxMultiplicityOrder', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.insertKnot(0.5, maxMultiplicityOrder)).to.eql(false);
            chai_1.expect(seq.insertKnot(0.5 + (KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.eql(false);
            chai_1.expect(seq.insertKnot(0.5 - (KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.eql(false);
        });
        it('cannot insert a new knot in the knot sequence if the new knot multiplicity is greater than maxMultiplicityOrder', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var newKnotAbscissa = 0.3;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(function () { return seq.insertKnot(newKnotAbscissa, 5); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
        });
        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case over uMax', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(function () { return seq.insertKnot(1.2, 1); }).to.throw(KnotSequences_1.EM_KNOT_INSERTION_OVER_UMAX);
            var knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var seq1 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 });
            chai_1.expect(function () { return seq1.insertKnot(4.2, 1); }).to.throw(KnotSequences_1.EM_KNOT_INSERTION_OVER_UMAX);
        });
        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case lower than sequence origin', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(function () { return seq.insertKnot(-0.2, 1); }).to.throw(KnotSequences_1.EM_KNOT_INSERTION_UNDER_SEQORIGIN);
            var knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var seq1 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 });
            chai_1.expect(function () { return seq1.insertKnot(-3.2, 1); }).to.throw(KnotSequences_1.EM_KNOT_INSERTION_UNDER_SEQORIGIN);
        });
        it('can insert a new knot in the knot sequence if the new knot abscissa is distinct from the existing ones', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.insertKnot(0.3, 3)).to.eql(true);
            chai_1.expect(seq.distinctAbscissae()).to.eql([0, 0.3, 0.5, 0.6, 0.7, 1]);
            chai_1.expect(seq.multiplicities()).to.eql([4, 3, 1, 1, 2, 4]);
        });
        it('check knot sequence properties after knot insertion', function () {
            var knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
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
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            chai_1.expect(function () { return seq.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(seq.length())); }).to.throw(KnotSequences_1.EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        });
        it('can get the knot abscissa from a sequence index. Case of non uniform B-Spline', function () {
            var maxMultiplicityOrder = 4;
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var abscissae = seq.allAbscissae;
            for (var i = 0; i < seq.length(); i++) {
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                var abscissa = seq.abscissaAtIndex(index);
                chai_1.expect(abscissa).to.eql(abscissae[i]);
            }
        });
        it('can get the knot abscissa from a sequence index. Case of uniform B-Spline', function () {
            var maxMultiplicityOrder = 4;
            var knots = [-0.4, -0.3, -0.3, 0, 0.5, 0.6, 0.7, 0.7, 1, 1.5, 1.6, 1.7];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var abscissae = seq.allAbscissae;
            for (var i = 0; i < seq.length(); i++) {
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                var abscissa = seq.abscissaAtIndex(index);
                chai_1.expect(abscissa).to.eql(abscissae[i]);
            }
        });
        it('can get the knot multiplicity from a sequence index', function () {
            var maxMultiplicityOrder = 4;
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var multiplicities = seq.multiplicities();
            var cumulativeMult = 0;
            for (var i = 0; i < multiplicities.length; i++) {
                var j = 0;
                while (j < multiplicities[i]) {
                    var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(j + cumulativeMult);
                    var indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
                    chai_1.expect(seq.knotMultiplicity(indexStrictlyIncSeq)).to.eql(multiplicities[i]);
                    j++;
                }
                cumulativeMult += multiplicities[i];
            }
        });
        it('cannot raise the multiplicity of an intermediate knot more than (maxMultiplicityOrder - 1) whether knot sequence consistency check is active or not and with constructor type' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.length()).to.eql(knots.length);
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            var mult = maxMultiplicityOrder - 1;
            var sequenceConsistencyCheck = true;
            var _loop_2 = function (i) {
                var seq1 = seq.clone();
                var index = seq.findSpan(knots[i]);
                var indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(indexStrictInc, mult, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
            };
            for (var i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                _loop_2(i);
            }
            sequenceConsistencyCheck = false;
            var _loop_3 = function (i) {
                var seq1 = seq.clone();
                var index = seq.findSpan(knots[i]);
                var indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(indexStrictInc, mult, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
            };
            for (var i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                _loop_3(i);
            }
        });
        it('cannot raise the multiplicity of an intermediate knot to more than maxMultiplicityOrder with knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.length()).to.eql(knots.length);
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            var multiplicities = seq.multiplicities();
            var seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            var sequenceConsistencyCheck = true;
            for (var i = 0; i < multiplicities.length; i++) {
                chai_1.expect(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
            }
            var _loop_4 = function (i) {
                var seq1 = seq.clone();
                var index = seq1.findSpan(knots[i]);
                var indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_ATKNOT);
            };
            for (var i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                _loop_4(i);
            }
        });
        it('cannot raise the multiplicity of extreme knots with uniform knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.length()).to.eql(knots.length);
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            var multiplicities = seq.multiplicities();
            var seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            var sequenceConsistencyCheck = true;
            for (var i = 0; i < multiplicities.length; i++) {
                chai_1.expect(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
            }
            var _loop_5 = function (i) {
                var seq1 = seq.clone();
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                var indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
                seq1 = seq.clone();
                index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(seq1.length() - i - 1);
                indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            };
            for (var i = 0; i < maxMultiplicityOrder; i++) {
                _loop_5(i);
            }
        });
        it('cannot raise the multiplicity of extreme knots with non uniform knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
            var knots = [0, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.length()).to.eql(knots.length);
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            var multiplicities = seq.multiplicities();
            var seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            var sequenceConsistencyCheck = true;
            for (var i = 0; i < multiplicities.length; i++) {
                chai_1.expect(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
            }
            var _loop_6 = function (i) {
                var seq1 = seq.clone();
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                var indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
                seq1 = seq.clone();
                index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(seq1.length() - i - 1);
                indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            };
            for (var i = 0; i < maxMultiplicityOrder; i++) {
                _loop_6(i);
            }
        });
        it('can raise the multiplicity of any knot of a uniform sequence to more than maxMultiplicityOrder without knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.length()).to.eql(knots.length);
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            var multiplicities = seq.multiplicities();
            var seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            var sequenceConsistencyCheck = false;
            for (var i = 0; i < multiplicities.length; i++) {
                chai_1.expect(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
            }
            for (var i = 0; i < knots.length; i++) {
                var seq1 = seq.clone();
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                var indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck);
                chai_1.expect(seq1.multiplicities()[i]).to.eql(maxMultiplicityOrder + 1);
            }
        });
        it('check the knot sequence property update after raising the multiplicity of a knot of a uniform multiplicity sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            var sequenceConsistencyCheck = true;
            for (var i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                var seq1 = seq.clone();
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                var indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                seq1.raiseKnotMultiplicity(indexStrictInc, 1, sequenceConsistencyCheck);
                chai_1.expect(seq1.isKnotMultiplicityUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            }
        });
        it('check the knot sequence property update after raising the multiplicity of a knot of a non uniform multiplicity sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
            var knots = [0, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            var sequenceConsistencyCheck = true;
            for (var i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                var seq1 = seq.clone();
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                var indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                seq1.raiseKnotMultiplicity(indexStrictInc, 1, sequenceConsistencyCheck);
                chai_1.expect(seq1.isKnotMultiplicityUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            }
        });
        it('can raise the multiplicity of an existing knot with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var index = seq.findSpan(0.2);
            var indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index);
            var sequenceConsistencyCheck = true;
            seq.raiseKnotMultiplicity(indexStrictInc, 1);
            chai_1.expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]);
            chai_1.expect(function () { return seq.raiseKnotMultiplicity(indexStrictInc, 2, sequenceConsistencyCheck); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
        });
        it('can revert the knot sequence for a uniform B-spline', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            // const seqRef = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            var seqReversed = seq.revertKnotSequence();
            var seqReReversed = seqReversed.revertKnotSequence();
            for (var i_1 = 0; i_1 < seq.length(); i_1++) {
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i_1);
                chai_1.expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities());
            var knots1 = [-0.3, -0.15, -0.1, 0, 0.05, 0.2, 0.35, 0.4, 0.5, 0.55, 0.7, 0.85];
            var seq1 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 });
            // const seqRef1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            var seqReversed1 = seq1.revertKnotSequence();
            var seqReReversed1 = seqReversed1.revertKnotSequence();
            var i = 0;
            for (var i_2 = 0; i_2 < seq1.length(); i_2++) {
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i_2);
                chai_1.expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities());
        });
        it('can revert the knot sequence for a non uniform B-spline', function () {
            var knots = [0, 0, 0, 0.3, 0.4, 0.5, 0.5, 0.8, 0.8, 0.8];
            var maxMultiplicityOrder = 3;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            // const seqRef = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            var seqReversed = seq.revertKnotSequence();
            var seqReReversed = seqReversed.revertKnotSequence();
            for (var i = 0; i < seq.length(); i++) {
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                chai_1.expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities());
            var knots1 = [0, 0, 0, 0.2, 0.2, 0.5, 0.8, 0.8, 0.8];
            var seq1 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 });
            // const seqRef1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            var seqReversed1 = seq1.revertKnotSequence();
            var seqReReversed1 = seqReversed1.revertKnotSequence();
            for (var i = 0; i < seq1.length(); i++) {
                var index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                chai_1.expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities());
        });
        it('can get the order of multiplicity of a knot from its abscissa', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var distinctKnots = seq.distinctAbscissae();
            var knotMultiplities = seq.multiplicities();
            for (var i = 0; i < distinctKnots.length; i++) {
                chai_1.expect(seq.knotMultiplicityAtAbscissa(distinctKnots[i])).to.eql(knotMultiplities[i]);
            }
        });
        it('get an order of multiplicity 0 and a warning message when the abscissa does not coincide with a knot', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.knotMultiplicityAtAbscissa(0.1)).to.eql(0);
            // const multiplicity = seq.knotMultiplicityAtAbscissa(0.1)
            // expect(() => seq.knotMultiplicityAtAbscissa(0.1)).to.eql(WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE)
        });
        it('can decrement the degree of a knot sequence of degree 3 without knots of multiplicity greater than one', function () {
            var e_10, _a;
            var knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var newSeq = seq.decrementMaxMultiplicityOrder();
            var newKnots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            chai_1.expect(newSeq.maxMultiplicityOrder).to.eql(3);
            var i = 0;
            try {
                for (var newSeq_1 = __values(newSeq), newSeq_1_1 = newSeq_1.next(); !newSeq_1_1.done; newSeq_1_1 = newSeq_1.next()) {
                    var knot = newSeq_1_1.value;
                    chai_1.expect(knot).to.eql(newKnots[i]);
                    i++;
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (newSeq_1_1 && !newSeq_1_1.done && (_a = newSeq_1.return)) _a.call(newSeq_1);
                }
                finally { if (e_10) throw e_10.error; }
            }
        });
        it('can decrement the degree of a knot sequence of degree 2 with knots of multiplicity greater than two', function () {
            var e_11, _a;
            var knots = [-2, -1, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 8];
            var maxMultiplicityOrder = 3;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
            var newSeq = seq.decrementMaxMultiplicityOrder();
            var newKnots = [-1, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8];
            chai_1.expect(newSeq.maxMultiplicityOrder).to.eql(2);
            var i = 0;
            try {
                for (var newSeq_2 = __values(newSeq), newSeq_2_1 = newSeq_2.next(); !newSeq_2_1.done; newSeq_2_1 = newSeq_2.next()) {
                    var knot = newSeq_2_1.value;
                    chai_1.expect(knot).to.eql(newKnots[i]);
                    i++;
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (newSeq_2_1 && !newSeq_2_1.done && (_a = newSeq_2.return)) _a.call(newSeq_2);
                }
                finally { if (e_11) throw e_11.error; }
            }
        });
        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            // test with knot sequence consistency check
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seqStrInc.length())); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
            // test without knot sequence consistency check
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1), false); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seqStrInc.length()), false); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
        });
        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
            var seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            // test with knot sequence consistency check
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seqStrInc.length())); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
            // test without knot sequence consistency check
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1), false); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seqStrInc.length()), false); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
        });
        it('cannot decrement the multiplicity of a knot when the knot index is not an intermadiate knot (Case of non uniform B-Spline.) with constructor type: ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' and active sequence consistency check', function () {
            var knots = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            var basisAtEnd = seq.getKnotIndexNormalizedBasisAtSequenceEnd();
            // test with knot sequence consistency check
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0)); }).to.throw(KnotSequences_1.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(basisAtEnd.knot); }).to.throw(KnotSequences_1.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
        });
        it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var sequenceConsistencyCheck = false;
            for (var i = 0; i < seq.distinctAbscissae().length; i++) {
                var seq1 = seq.clone();
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck);
                chai_1.expect(seq1.length()).to.eql(seq.length() - 1);
            }
        });
        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one and the knot is strictly inside the normalized basis interval', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7];
            var maxMultiplicityOrder = 4;
            var sequenceConsistencyCheck = true;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
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
            var seq2 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
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
            var knots = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5];
            var maxMultiplicityOrder = 4;
            var sequenceConsistencyCheck = true;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
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
            var seq2 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
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
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var abscissa = 0.3;
            var index = seq.findSpan(abscissa);
            var indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index);
            var sequenceConsistencyCheck = true;
            chai_1.expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2]);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
        });
        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var sequenceConsistencyCheck = true;
            var abscissa = 0.2;
            var index = seq.findSpan(abscissa);
            var indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index);
            chai_1.expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2]);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
        });
        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence when the knot sequence  consistency is not checked', function () {
            var knots = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.8, 0.8, 0.8, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var sequenceConsistencyCheck = false;
            var seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
            var indexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seqStrInc.length() - 1);
            chai_1.expect(seq.multiplicities()).to.eql([4, 1, 2, 1, 1, 4]);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            chai_1.expect(seq.multiplicities()).to.eql([4, 1, 2, 1, 1, 3]);
        });
        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence origin is updated as well as some abscissae', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var sequenceConsistencyCheck = false;
            var indexOrigin = seq.indexKnotOrigin;
            var abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin));
            chai_1.expect(abscissa).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck);
            seq.updateKnotSequenceThroughNormalizedBasisAnalysis();
            chai_1.expect(seq.indexKnotOrigin).to.eql(indexOrigin);
            chai_1.expect(seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin))).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            var updatedKnots = [-0.4, -0.3, -0.2, 0, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.6];
            for (var i = 0; i < seq.allAbscissae.length; i++) {
                chai_1.expect(seq.allAbscissae[i]).to.be.closeTo(updatedKnots[i], KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq.uMax).to.eql(0.4);
        });
        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at uMax is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence uMax is updated as well as some abscissae', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var sequenceConsistencyCheck = false;
            var indexUMax = seq.getKnotIndicesBoundingNormalizedBasis().end.knot;
            var abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexUMax));
            chai_1.expect(abscissa).to.eql(seq.uMax);
            seq.decrementKnotMultiplicity(indexUMax, sequenceConsistencyCheck);
            seq.updateKnotSequenceThroughNormalizedBasisAnalysis();
            chai_1.expect(seq.uMax).to.eql(0.4);
            var updatedKnots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.6, 0.7, 0.7];
            for (var i = 0; i < seq.allAbscissae.length; i++) {
                chai_1.expect(seq.allAbscissae[i]).to.be.closeTo(updatedKnots[i], KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq.uMax).to.eql(0.4);
        });
        it('cannot get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement and the sequence origin cannot be updated', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.2, 0.2, 0.2, 0.3, 0.4, 0.5, 0.7, 0.7, 0.7];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var sequenceConsistencyCheck = false;
            var indexOrigin = seq.indexKnotOrigin;
            var abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin));
            chai_1.expect(abscissa).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck);
            chai_1.expect(function () { return seq.updateKnotSequenceThroughNormalizedBasisAnalysis(); }).to.throw(KnotSequences_1.EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
        });
        it('cannot get consistent knot sequence normalized basis when a knot multiplicity is decremented and the knot at origin is removed when the knot sequence consistency is not checked during knot multiplicity decrement', function () {
            var knots = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var sequenceConsistencyCheck = false;
            var indexOrigin = seq.indexKnotOrigin;
            var indexNormalizedBasisAtStart = seq.getKnotIndexNormalizedBasisAtSequenceStart();
            chai_1.expect(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
            chai_1.expect(indexNormalizedBasisAtStart.knot.knotIndex).to.eql(indexOrigin.knotIndex);
            seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck);
            indexNormalizedBasisAtStart = seq.getKnotIndexNormalizedBasisAtSequenceStart();
            chai_1.expect(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
            chai_1.expect(indexNormalizedBasisAtStart.knot.knotIndex).to.not.eql(indexOrigin.knotIndex);
            chai_1.expect(seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexNormalizedBasisAtStart.knot))).to.not.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            var knots1 = [0, 0, 0, 0, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5];
            var seq1 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 });
            var indexOrigin1 = seq1.indexKnotOrigin;
            var indexNormalizedBasisAtStart1 = seq1.getKnotIndexNormalizedBasisAtSequenceStart();
            chai_1.expect(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(KnotSequences_2.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
            chai_1.expect(indexNormalizedBasisAtStart1.knot.knotIndex).to.eql(indexOrigin1.knotIndex);
            seq1.decrementKnotMultiplicity(indexOrigin1, sequenceConsistencyCheck);
            indexNormalizedBasisAtStart1 = seq1.getKnotIndexNormalizedBasisAtSequenceStart();
            chai_1.expect(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(KnotSequences_2.NormalizedBasisAtSequenceExtremity.OverDefined);
            chai_1.expect(indexNormalizedBasisAtStart1.knot.knotIndex).to.not.eql(indexOrigin1.knotIndex);
            chai_1.expect(seq1.abscissaAtIndex(seq1.toKnotIndexIncreasingSequence(indexNormalizedBasisAtStart1.knot))).to.not.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
        });
        it('can update the origin and uMax of a knot sequence whose knot multiplicities have been increased/decreased without knot conformity checking', function () {
            var knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
            var sequenceConsistencyCheck = false;
            var indexOrigin = seq.indexKnotOrigin;
            var abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin));
            chai_1.expect(abscissa).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            chai_1.expect(seq.uMax).to.eql(0.5);
            seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0), sequenceConsistencyCheck);
            seq.updateKnotSequenceThroughNormalizedBasisAnalysis();
            chai_1.expect(seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(seq.indexKnotOrigin))).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            chai_1.expect(seq.uMax).to.eql(0.4);
        });
        it('cannot decrement the maximal multiplicity order of the knot sequence when the maximal multiplicity order of a knot sequence is 2 with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
            var knots1 = [0, 0, 1, 2, 3, 4, 5, 6, 7, 7];
            var maxMultiplicityOrder1 = 2;
            var seq1 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 });
            chai_1.expect(seq1.isSequenceUpToC0Discontinuity).to.eql(false);
            chai_1.expect(function () { return seq1.decrementMaxMultiplicityOrder(); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
        });
        it('can decrement the maximal multiplicity order of a knot sequence of maxMultiplicity = 2 with knots of multiplicity greater than one', function () {
            var e_12, _a;
            var knots = [-1, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8];
            var maxMultiplicityOrder = 2;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
            var newSeq = seq.decrementMaxMultiplicityOrder();
            var newKnots = [0, 1, 2, 3, 4, 5, 6, 7];
            chai_1.expect(newSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
            var i = 0;
            try {
                for (var newSeq_3 = __values(newSeq), newSeq_3_1 = newSeq_3.next(); !newSeq_3_1.done; newSeq_3_1 = newSeq_3.next()) {
                    var knot = newSeq_3_1.value;
                    chai_1.expect(knot).to.eql(newKnots[i]);
                    i++;
                }
            }
            catch (e_12_1) { e_12 = { error: e_12_1 }; }
            finally {
                try {
                    if (newSeq_3_1 && !newSeq_3_1.done && (_a = newSeq_3.return)) _a.call(newSeq_3);
                }
                finally { if (e_12) throw e_12.error; }
            }
        });
        it('can decrement the maximal multiplicity order of a knot sequence of maxMultiplicity = 3 with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
            var e_13, _a;
            var knots = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8];
            var maxMultiplicityOrder = 3;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var newSeq = seq.decrementMaxMultiplicityOrder();
            var newKnots = [0, 0, 1, 2, 3, 4, 5, 6, 7, 7];
            chai_1.expect(newSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
            var i = 0;
            try {
                for (var newSeq_4 = __values(newSeq), newSeq_4_1 = newSeq_4.next(); !newSeq_4_1.done; newSeq_4_1 = newSeq_4.next()) {
                    var knot = newSeq_4_1.value;
                    chai_1.expect(knot).to.eql(newKnots[i]);
                    i++;
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (newSeq_4_1 && !newSeq_4_1.done && (_a = newSeq_4.return)) _a.call(newSeq_4);
                }
                finally { if (e_13) throw e_13.error; }
            }
        });
        it('can decrement the maximal multiplicity order of a knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
            var e_14, _a;
            var knots = [-3, -2, -1, 0, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var newSeq = seq.decrementMaxMultiplicityOrder();
            var newKnots = [-2, -1, 0, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9];
            chai_1.expect(newSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
            var i = 0;
            try {
                for (var newSeq_5 = __values(newSeq), newSeq_5_1 = newSeq_5.next(); !newSeq_5_1.done; newSeq_5_1 = newSeq_5.next()) {
                    var knot = newSeq_5_1.value;
                    chai_1.expect(knot).to.eql(newKnots[i]);
                    i++;
                }
            }
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (newSeq_5_1 && !newSeq_5_1.done && (_a = newSeq_5.return)) _a.call(newSeq_5);
                }
                finally { if (e_14) throw e_14.error; }
            }
        });
        it('can decrement the maximal multiplicity order of a knot sequence of maxMultiplicity = 2 with a knot of multiplicity greater than one at sequence origin', function () {
            var e_15, _a;
            var knots = [0, 0, 1, 2, 3, 4, 5, 6, 7, 7];
            var maxMultiplicityOrder = 2;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
            var newSeq = seq.decrementMaxMultiplicityOrder();
            var newKnots = [0, 1, 2, 3, 4, 5, 6, 7];
            chai_1.expect(newSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1);
            var i = 0;
            try {
                for (var newSeq_6 = __values(newSeq), newSeq_6_1 = newSeq_6.next(); !newSeq_6_1.done; newSeq_6_1 = newSeq_6.next()) {
                    var knot = newSeq_6_1.value;
                    chai_1.expect(knot).to.eql(newKnots[i]);
                    i++;
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (newSeq_6_1 && !newSeq_6_1.done && (_a = newSeq_6.return)) _a.call(newSeq_6);
                }
                finally { if (e_15) throw e_15.error; }
            }
        });
        it('check that the knot sequence properties are preserved when decrementing the maximal multiplicity order of a knot sequence', function () {
            var knots = [0, 0, 1, 2, 3, 4, 5, 6, 7, 7];
            var maxMultiplicityOrder = 2;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            var newSeq = seq.decrementMaxMultiplicityOrder();
            chai_1.expect(newSeq.maxMultiplicityOrder).to.eql(1);
            chai_1.expect(newSeq.isSequenceUpToC0Discontinuity).to.eql(true);
        });
        it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            var indexOffset = -1;
            var indexOffset1 = -1;
            for (var i = 0; i < seq.distinctAbscissae().length; i++) {
                var abscissa = seq.distinctAbscissae()[i];
                var index = seq.findSpan(abscissa);
                if (i !== (seq.distinctAbscissae().length - 1))
                    indexOffset = indexOffset + seq.knotMultiplicityAtAbscissa(abscissa);
                chai_1.expect(index.knotIndex).to.eql(indexOffset);
                if (i < seq.distinctAbscissae().length - 1) {
                    var abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    indexOffset1 = indexOffset1 + seq.knotMultiplicityAtAbscissa(abscissa);
                    chai_1.expect(index.knotIndex).to.eql(indexOffset1);
                }
            }
        });
        it('can find the span index in the knot sequence from an abscissa for a periodic B-spline with an arbitrary knot sequence', function () {
            var knots = [-0.2, -0.1, 0, 0, 0.1, 0.2, 0.5, 0.6, 0.7, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2];
            var maxMultiplicityOrder = 4;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            var lastAbscissa = seq.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(seq.length() - maxMultiplicityOrder));
            var indexOrigin = seq.indexKnotOrigin;
            var knotMultiplicityAtOrigin = seq.knotMultiplicity(indexOrigin);
            chai_1.expect(seq.uMax).to.eql(lastAbscissa);
            var indexOffset = maxMultiplicityOrder - knotMultiplicityAtOrigin - 1;
            var indexOffset2 = indexOffset;
            var lastAbscissaIndex = seq.distinctAbscissae().length - 1;
            var distinctAbscissae = seq.distinctAbscissae();
            while (distinctAbscissae[lastAbscissaIndex] !== seq.uMax) {
                lastAbscissaIndex--;
            }
            for (var i = indexOrigin.knotIndex; i <= lastAbscissaIndex; i++) {
                var abscissa = seq.distinctAbscissae()[i];
                var index = seq.findSpan(abscissa);
                if (i !== lastAbscissaIndex)
                    indexOffset = indexOffset + seq.knotMultiplicityAtAbscissa(abscissa);
                chai_1.expect(index.knotIndex).to.eql(indexOffset);
                if (i < lastAbscissaIndex) {
                    var abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    indexOffset2 = indexOffset2 + seq.knotMultiplicityAtAbscissa(abscissa);
                    chai_1.expect(index.knotIndex).to.eql(indexOffset2);
                }
            }
        });
        it('comparison with the former clampingFindSpan function devoted to periodic uniform B-splines with a periodic uniform B-Spline', function () {
            var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            var curveDegree = 2;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var index = seq.findSpan(0.0);
            // compare with the clampingFindSpan function initially set up and devoted to uniform B-splines
            var indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(0.0, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(1);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(1, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(2);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(2, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(3);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(3, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(4);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(4, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(5);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(5, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(6);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(6, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            // Currently, 04/2024, clampingFindSpan does not behave like findSpan function for the last knot
            // The method findSpan, at the opposite has the same behavior for the classes of knot sequences
            // -> this last comparison is removed while checking if necessary to distinguish these baheviors or not
            // index = seq.findSpan(7)
            // indexCompare = clampingFindSpan(7, knots, 2);
            // expect(index.knotIndex).to.eql(indexCompare)
        });
        it('comparison with the former clampingFindSpan function devoted to periodic uniform B-splines', function () {
            var knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            var curveDegree = 3;
            var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
            var index = seq.findSpan(0.0);
            // compare with the clampingFindSpan function initially set up and devoted to uniform B-splines
            var indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(0.0, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.1);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(0.1, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.5);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(0.5, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.55);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(0.55, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.6);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(0.6, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.65);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(0.65, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.7);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(0.7, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.9);
            indexCompare = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(0.9, knots, curveDegree);
            chai_1.expect(index.knotIndex).to.eql(indexCompare);
            // Similar remark to the test above
            // -> this last comparison is removed while checking if necessary to distinguish these baheviors or not
            // index = seq.findSpan(1.0)
            // indexCompare = clampingFindSpan(1.0, knots, curveDegree);
            // expect(index.knotIndex).to.eql(indexCompare)
        });
    });
});
