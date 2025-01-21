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
var StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1 = require("../../src/newBsplines/StrictlyIncreasingPeriodicKnotSequenceClosedCurve");
var KnotSequenceConstructorInterface_1 = require("../../src/newBsplines/KnotSequenceConstructorInterface");
var KnotSequences_1 = require("../../src/ErrorMessages/KnotSequences");
var KnotSequences_2 = require("../../src/namedConstants/KnotSequences");
var GeneralPurpose_1 = require("../namedConstants/GeneralPurpose");
var KnotIndexStrictlyIncreasingSequence_1 = require("../../src/newBsplines/KnotIndexStrictlyIncreasingSequence");
var Knots_1 = require("../../src/ErrorMessages/Knots");
describe('StrictlyIncreasingPeriodicKnotSequenceClosedCurve', function () {
    describe('Constructor', function () {
        describe(KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, function () {
            it('cannot be initialized with a max multiplicity order smaller than 1 with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, function () {
                var maxMultiplicityOrder = 0;
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('can be initialized with (maxMultiplicityOrder + 1) knots with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, function () {
                var e_1, _a;
                var maxMultiplicityOrder = 2;
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE });
                chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                var knots = [0, 1, 2];
                chai_1.expect(seq.allAbscissae).to.eql(knots);
                chai_1.expect(seq.length()).to.eql(maxMultiplicityOrder + 1);
                var seq1 = [];
                try {
                    for (var seq_1 = __values(seq), seq_1_1 = seq_1.next(); !seq_1_1.done; seq_1_1 = seq_1.next()) {
                        var knot = seq_1_1.value;
                        if (knot !== undefined) {
                            seq1.push(knot.abscissa);
                            chai_1.expect(knot.multiplicity).to.eql(1);
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
            });
            it('can be initialized with 3 knots when maxMultiplicityOrder = 1 with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, function () {
                var maxMultiplicityOrder = 1;
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE });
                chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                var knots = [0, 1, 2];
                chai_1.expect(seq.allAbscissae).to.eql(knots);
                chai_1.expect(seq.length()).to.eql(maxMultiplicityOrder + 2);
            });
            it('can get properties of the knot sequence initialized with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, function () {
                var maxMultiplicityOrder = 2;
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE });
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            });
            it('can check that the origin of a knot sequence coincides with OPEN_KNOT_SEQUENCE_ORIGIN when initialized with ' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, function () {
                var maxMultiplicityOrder = 2;
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE });
                chai_1.expect(function () { return seq.checkCurveOrigin(); }).to.not.throw();
            });
            it('can get the uMax of a knot sequence initialized with ' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, function () {
                var maxMultiplicityOrder = 2;
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE });
                chai_1.expect(seq.uMax).to.eql(3);
            });
            it('can get the property of the knot sequence about non uniform multiplicity as true when maxMultiplicityOrder = 1 when initialized with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, function () {
                var maxMultiplicityOrder = 1;
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE });
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            });
        });
        describe(KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, function () {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 0;
                var BsplBasisSize = 2;
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than 2 when maxMultiplicity = 1 with ' + KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 1;
                var BsplBasisSize = 1;
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize }); }).to.throw(KnotSequences_1.EM_SIZENORMALIZED_BSPLINEBASIS);
            });
            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with ' + KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 2;
                var BsplBasisSize = 1;
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize }); }).to.throw(KnotSequences_1.EM_SIZENORMALIZED_BSPLINEBASIS);
            });
            it('can be initialized with a size of normalized B-spline basis produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, function () {
                var e_2, _a;
                for (var i = 1; i < 4; i++) {
                    var maxMultiplicityOrder = i;
                    var upperBound = 4;
                    for (var j = maxMultiplicityOrder + 1; j < (maxMultiplicityOrder + upperBound); j++) {
                        if (!(i === 1 && j < 3)) {
                            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: j });
                            var knots = [];
                            for (var k = 0; k < j; k++) {
                                knots.push(k);
                            }
                            var seq1 = [];
                            try {
                                for (var seq_2 = (e_2 = void 0, __values(seq)), seq_2_1 = seq_2.next(); !seq_2_1.done; seq_2_1 = seq_2.next()) {
                                    var knot = seq_2_1.value;
                                    if (knot !== undefined) {
                                        seq1.push(knot.abscissa);
                                        chai_1.expect(knot.multiplicity).to.eql(1);
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
                        }
                    }
                }
            });
            it('can check that the origin of a knot sequence coincides with OPEN_KNOT_SEQUENCE_ORIGIN when initialized with ' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, function () {
                var maxMultiplicityOrder = 2;
                var BsplBasisSize = 3;
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                chai_1.expect(function () { return seq.checkCurveOrigin(); }).to.not.throw();
            });
            it('can get the u interval upper bound produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 2;
                var BsplBasisSize = 3;
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                chai_1.expect(seq.uMax).to.eql(BsplBasisSize - 1);
            });
            it('can get the properties of knot sequnence produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 2;
                var BsplBasisSize = 3;
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            });
        });
        describe(KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
            it('cannot be initialized with a max multiplicity order smaller than 1 with type constructor' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 0;
                var periodicKnots = [1];
                var multiplicities = [1];
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot be initialized with a non increasing knot sequence with type constructor' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                var periodicKnots = [0, 1, 2, 1.5, 3, 4];
                var multiplicities = [1, 1, 1, 1, 1, 1];
                var maxMultiplicityOrder = 2;
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NON_STRICTLY_INCREASING_VALUES);
                var periodicKnots1 = [0, -0.5, 1, 2, 3, 4];
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NON_STRICTLY_INCREASING_VALUES);
                var periodicKnots2 = [0, 1, 2, 3, 4, 3.5];
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots2, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NON_STRICTLY_INCREASING_VALUES);
            });
            it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                var periodicKnots = [0, 1, 1, 1, 2, 3];
                var multiplicities = [1, 3, 1, 1];
                var maxMultiplicityOrder = 2;
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities }); }).to.throw();
            });
            it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder at the sequence origin with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var periodicKnots = [0, 1, 2, 3];
                var multiplicities = [4, 1, 1, 4];
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it('cannot be initialized with a null knot length array ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var periodicKnots = [];
                var multiplicities = [1];
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NULL_KNOT_SEQUENCE);
            });
            it('cannot be initialized with a null multiplicity length array ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var periodicKnots = [0, 1, 2, 3];
                var multiplicities = [];
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_NULL_MULTIPLICITY_ARRAY);
            });
            it('cannot be initialized when the size of the knot array differs from that of the multiplicity array ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 3;
                var periodicKnots = [0, 1, 2, 3];
                var multiplicities = [1, 1, 1];
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL);
            });
            it('cannot initialize a periodic knot sequence if its origin is not zero', function () {
                var periodicKnots = [1, 2, 3, 4];
                var multiplicities = [1, 1, 1, 1];
                var maxMultiplicityOrder = 2;
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
            });
            it('cannot initialize a periodic knot sequence if end knot multiplicities differ when multiplicity is greater than maxMultiplicityOrder', function () {
                var periodicKnots = [0, 1, 2, 3, 4];
                var multiplicities = [2, 1, 1, 1, 1];
                var maxMultiplicityOrder = 1;
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it('cannot initialize a periodic knot sequence if end knot multiplicities differ when multiplicity is equal or lower than maxMultiplicityOrder', function () {
                var periodicKnots = [0, 1, 2, 3, 4];
                var multiplicities = [2, 1, 1, 1, 1];
                var maxMultiplicityOrder = 2;
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER);
            });
            it('cannot initialize a periodic knot sequence if knot sequence length is smaller than (degree + 2) to generate a basis of splines', function () {
                var periodicKnots = [0, 1];
                var multiplicities = [1, 1];
                var maxMultiplicityOrder = 2;
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS);
                var periodicKnots1 = [0, 1];
                var multiplicities1 = [1, 1];
                var maxMultiplicityOrder1 = 1;
                chai_1.expect(function () { return new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder1, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1 }); }).to.throw(KnotSequences_1.EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS);
            });
            it('can be initialized with uniform or non uniform knot sequences as examples', function () {
                var periodicKnots = [0, 1, 2];
                var multiplicities = [1, 1, 1];
                var maxMultiplicityOrder = 2;
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                chai_1.expect(seq.allAbscissae).to.eql(periodicKnots);
                var periodicKnots1 = [0, 1];
                var multiplicities1 = [2, 2];
                var seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1 });
                chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                chai_1.expect(seq.allAbscissae).to.eql(periodicKnots);
            });
            it('can be initialized with uniform knot sequence as minimal case linear closed polygon', function () {
                var periodicKnots = [0, 1, 2];
                var multiplicities = [1, 1, 1];
                var maxMultiplicityOrder = 1;
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                chai_1.expect(seq.allAbscissae).to.eql(periodicKnots);
                chai_1.expect(seq.multiplicities()).to.eql(multiplicities);
            });
            it('can get the properties of the knot sequence initialized with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 2;
                var periodicKnots = [0, 1, 2];
                var multiplicities = [1, 1, 1];
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            });
            it('can get the knot index of the knot sequence origin initialized with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 2;
                var periodicKnots = [0, 1, 2];
                var multiplicities = [1, 1, 1];
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                chai_1.expect(seq.allAbscissae[0]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            });
            it('can get the uMax of the knot sequence origin initialized with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                var maxMultiplicityOrder = 2;
                var periodicKnots = [0, 1, 2];
                var multiplicities = [1, 1, 1];
                var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                chai_1.expect(seq.uMax).to.eql(seq.allAbscissae[seq.allAbscissae.length - 1]);
            });
            describe('Initialization of knot sequences for non uniform closed B-splines', function () {
                it('can be initialized with an initializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE + '. Non uniform knot sequence of closed curve without intermediate knots', function () {
                    var e_3, _a;
                    var maxMultiplicityOrder = 3;
                    var periodicKnots = [0, 1];
                    var multiplicities = [3, 3];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    var seq1 = [];
                    var multiplicities1 = [];
                    try {
                        for (var seq_3 = __values(seq), seq_3_1 = seq_3.next(); !seq_3_1.done; seq_3_1 = seq_3.next()) {
                            var knot = seq_3_1.value;
                            if (knot !== undefined) {
                                seq1.push(knot.abscissa);
                                multiplicities1.push(knot.multiplicity);
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
                    chai_1.expect(seq1).to.eql(periodicKnots);
                    chai_1.expect(multiplicities1).to.eql(multiplicities);
                });
                it('can get the properties of the knot sequence with type constructor ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                    var maxMultiplicityOrder = 3;
                    var periodicKnots = [0, 1];
                    var multiplicities = [3, 3];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                    chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
                });
                it('check that the non uniform property is deactivated for all knot sequences of this class', function () {
                    var maxMultiplicityOrder = 3;
                    var periodicKnots = [0, 1];
                    var multiplicities = [3, 3];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index and the abscissa of the upper bound of the normalized basis. Non uniform B-Spline without intermediate knot', function () {
                    var maxMultiplicityOrder = 3;
                    var periodicKnots = [0, 1];
                    var multiplicities = [3, 3];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    chai_1.expect(seq.allAbscissae[0]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
                    chai_1.expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
                });
                it('can be initialized with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE + ' initializer. non uniform knot sequence of closed curve with intermediate knots', function () {
                    var e_4, _a;
                    var maxMultiplicityOrder = 3;
                    var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
                    var multiplicities = [3, 1, 1, 2, 3];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
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
                    chai_1.expect(seq1).to.eql(periodicKnots);
                    chai_1.expect(multiplicities1).to.eql(multiplicities);
                });
                it('can get the properties of knot sequence: non uniform knot sequence of open curve with intermediate knots with type constructor ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                    var maxMultiplicityOrder = 3;
                    var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
                    var multiplicities = [3, 1, 1, 2, 3];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
                    chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
                    chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: non uniform knot sequence of open curve with intermediate knots', function () {
                    var maxMultiplicityOrder = 3;
                    var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
                    var multiplicities = [3, 1, 1, 2, 3];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    chai_1.expect(seq.allAbscissae[0]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
                    chai_1.expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
                });
            });
            describe('Initialization of knot sequences for uniform closed B-splines', function () {
                it('can be initialized with an initializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE + '. uniform knot sequence of open curve without intermediate knots', function () {
                    var e_5, _a;
                    var maxMultiplicityOrder = 2;
                    var periodicKnots = [0, 1, 2, 3, 5, 6];
                    var multiplicities = [1, 1, 1, 1, 1, 1];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
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
                    chai_1.expect(seq1).to.eql(periodicKnots);
                    chai_1.expect(multiplicities1).to.eql(multiplicities);
                });
                it('can get the properties of the knot sequence. uniform B-Spline with uniformly distributed knots with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                    var maxMultiplicityOrder = 1;
                    var periodicKnots = [0, 1, 2, 3, 4, 5];
                    var multiplicities = [1, 1, 1, 1, 1, 1];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
                    chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                    chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the properties of the knot sequence. uniform B-Spline with non uniformly distributed knots with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
                    var maxMultiplicityOrder = 1;
                    var periodicKnots = [0, 1, 2.5, 3, 4, 5];
                    var multiplicities = [1, 1, 1, 1, 1, 1];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
                    chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
                    chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: uniform knot sequence of closed curve', function () {
                    var maxMultiplicityOrder = 2;
                    var periodicKnots = [0, 0.5, 0.6, 0.7, 0.8, 1];
                    var multiplicities = [1, 1, 1, 1, 1, 1];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    chai_1.expect(seq.allAbscissae[0]).to.eql(0);
                    chai_1.expect(seq.uMax).to.eql(1);
                });
            });
            describe('Initialization of arbitrary knot sequences for B-splines', function () {
                it('can be initialized with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE + ' initializer. arbitrary knot sequence', function () {
                    var e_6, _a;
                    var maxMultiplicityOrder = 3;
                    var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
                    var multiplicities = [2, 1, 1, 2, 2];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
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
                    chai_1.expect(seq1).to.eql(periodicKnots);
                    chai_1.expect(multiplicities1).to.eql(multiplicities);
                });
                it('can get the properties of the knot sequence. closed B-Spline with arbitrary distributed knots', function () {
                    var maxMultiplicityOrder = 3;
                    var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
                    var multiplicities = [2, 1, 1, 2, 2];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
                    chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
                    chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: arbitrary knot sequence of closed B-spline', function () {
                    var maxMultiplicityOrder = 3;
                    var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
                    var multiplicities = [2, 1, 1, 2, 2];
                    var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    chai_1.expect(seq.allAbscissae[0]).to.eql(0);
                    chai_1.expect(seq.uMax).to.eql(1);
                });
            });
        });
    });
    describe('Accessors', function () {
        it('can get all the abscissa of the knot sequence', function () {
            var maxMultiplicityOrder = 2;
            var periodicKnots = [0, 1, 2, 3, 4, 5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.allAbscissae).to.eql(periodicKnots);
        });
        it('can use the iterator to access the knots of the sequence', function () {
            var e_7, _a;
            var maxMultiplicityOrder = 3;
            var periodicKnots = [0, 1, 2];
            var multiplicities = [3, 1, 3];
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
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
            chai_1.expect(seq1).to.eql(periodicKnots);
            chai_1.expect(multiplicities1).to.eql(multiplicities);
        });
        it('can get the maximum multiplicity order of the knot sequence', function () {
            var maxMultiplicityOrder = 2;
            var periodicKnots = [0, 1, 2, 3, 4, 5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        });
    });
    describe('Methods', function () {
        it('can clone the knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
            var maxMultiplicityOrder = 3;
            var periodicKnots = [0, 1, 1.5, 2];
            var multiplicities = [3, 2, 1, 3];
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            var seq1 = seq.clone();
            chai_1.expect(seq1).to.eql(seq);
            var periodicKnots1 = [0, 1, 2, 3, 4];
            var multiplicities1 = [1, 1, 1, 1, 1];
            var seq2 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1 });
            var seq3 = seq2.clone();
            chai_1.expect(seq3).to.eql(seq2);
        });
        it('can get the length of a strictly increasing knot sequence', function () {
            var periodicKnots = [0, 1, 2, 3, 4];
            var multiplicities = [1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 2;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            var length = seq.length();
            chai_1.expect(length).to.eql(periodicKnots.length);
            var periodicKnots1 = [0, 1, 2, 3, 4];
            var multiplicities1 = [1, 2, 1, 1, 1];
            var maxMultiplicityOrder1 = 2;
            var seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder1, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1 });
            var length1 = seq1.length();
            chai_1.expect(length1).to.eql(periodicKnots1.length);
            var periodicKnots2 = [0, 1, 2, 3, 4];
            var multiplicities2 = [2, 1, 1, 1, 2];
            var maxMultiplicityOrder2 = 2;
            var seq2 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder2, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots2, multiplicities: multiplicities2 });
            var length2 = seq2.length();
            chai_1.expect(length2).to.eql(periodicKnots2.length);
        });
        it('can get the distinct abscissae of a minimal knot sequence conforming to a non-uniform B-spline', function () {
            var periodicKnots = [0, 1];
            var multiplicities = [3, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.distinctAbscissae()).to.eql(periodicKnots);
        });
        it('can get the distinct abscissae of a knot sequence conforming to a non-uniform B-spline', function () {
            var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [3, 1, 1, 2, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.distinctAbscissae()).to.eql(periodicKnots);
        });
        it('can get the distinct multiplicities of a minimal knot sequence conforming to a non-uniform B-spline', function () {
            var periodicKnots = [0, 1];
            var multiplicities = [3, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.multiplicities()).to.eql(multiplicities);
        });
        it('can get the distinct multiplicities of a knot sequence conforming to a non-uniform B-spline', function () {
            var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [3, 1, 1, 2, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.multiplicities()).to.eql(multiplicities);
        });
        it('can get the period of a knot sequence conforming to a non-uniform B-spline', function () {
            var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [3, 1, 1, 2, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.getPeriod()).to.eql(seq.lastKnot());
        });
        it('can get the period of a knot sequence conforming to a uniform B-spline', function () {
            var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.getPeriod()).to.eql(seq.lastKnot());
        });
        it('cannot get the knot abscissa from a sequence index when the index is out of range with negative values', function () {
            var maxMultiplicityOrder = 3;
            var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [3, 1, 1, 2, 3];
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            chai_1.expect(function () { return seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
        });
        it('can obtain the knot abscissa given the knot index for a uniform knot sequence for all knots except the last one', function () {
            var periodicKnots = [0, 1, 2, 3, 4, 5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 2;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            chai_1.expect(seq.allAbscissae.length).to.eql(periodicKnots.length);
            for (var i = 0; i < periodicKnots.length - 1; i++) {
                chai_1.expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(periodicKnots[i]);
            }
        });
        it('can obtain the knot abscissa given the knot index for a uniform knot sequence for the last one', function () {
            var periodicKnots = [0, 1, 2, 3, 4, 5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 2;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            chai_1.expect(seq.allAbscissae.length).to.eql(periodicKnots.length);
            chai_1.expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(periodicKnots.length - 1))).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
        });
        it('can obtain the knot abscissa given the knot index for a uniform knot sequence whatever the index greater than the period', function () {
            var periodicKnots = [0, 1, 2, 3, 4, 5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 2;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            chai_1.expect(seq.allAbscissae.length).to.eql(periodicKnots.length);
            for (var i = periodicKnots.length - 1; i < 2 * (periodicKnots.length - 1); i++) {
                chai_1.expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(periodicKnots[i - (periodicKnots.length - 1)]);
            }
        });
        it('can get the knot multiplicity from a knot sequence index', function () {
            var maxMultiplicityOrder = 3;
            var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [3, 1, 1, 2, 3];
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            var cumulativeMult = 0;
            for (var i = 0; i < multiplicities.length; i++) {
                chai_1.expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
                cumulativeMult += multiplicities[i];
            }
        });
        it('cannot check if an abscissa coincides with a knot belonging to the interval of the curve if this abscissa is outside the interval of the normalized basis', function () {
            var periodicKnots = [0, 1, 2, 3, 4, 5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            var abscissae = 5.5;
            chai_1.expect(function () { return seq.isAbscissaCoincidingWithKnot(abscissae); }).to.throw(KnotSequences_1.EM_U_OUTOF_KNOTSEQ_RANGE);
            abscissae = -0.5;
            chai_1.expect(function () { return seq.isAbscissaCoincidingWithKnot(abscissae); }).to.throw(KnotSequences_1.EM_U_OUTOF_KNOTSEQ_RANGE);
        });
        it('can check if an abscissa coincides with a knot belonging to the interval of the normalized basis', function () {
            var periodicKnots = [0, 1, 2, 3, 4, 5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            var abscissae = seq.distinctAbscissae();
            for (var i = 0; i < abscissae.length; i++) {
                if (abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE) < seq.uMax) {
                    chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                    chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.eql(true);
                }
                if (abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE) > 0) {
                    chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                    chai_1.expect(seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.eql(true);
                }
            }
        });
        it('can check if the knot multiplicity at a given abscissa is zero', function () {
            var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [3, 1, 1, 2, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            var abscissae = seq.distinctAbscissae();
            for (var i = 0; i < abscissae.length; i++) {
                chai_1.expect(seq.isKnotlMultiplicityZero(abscissae[i])).to.eql(false);
                if (abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE) < seq.uMax)
                    chai_1.expect(seq.isKnotlMultiplicityZero(abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(true);
                if (abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE) > 0)
                    chai_1.expect(seq.isKnotlMultiplicityZero(abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(true);
            }
        });
        it('can revert the knot sequence for a uniform B-spline', function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 4;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            // const seqRef = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            var seqReversed = seq.revertKnotSequence();
            var seqReReversed = seqReversed.revertKnotSequence();
            for (var i_1 = 0; i_1 < seq.length(); i_1++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i_1);
                chai_1.expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities());
            var periodicKnots1 = [0, 0.05, 0.2, 0.35, 0.4, 0.5];
            var seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities });
            // const seqRef1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities})
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
            var periodicKnots = [0, 0.3, 0.4, 0.5, 0.8];
            var multiplicities = [2, 1, 1, 2, 2];
            var maxMultiplicityOrder = 2;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            // const seqRef = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            var seqReversed = seq.revertKnotSequence();
            var seqReReversed = seqReversed.revertKnotSequence();
            for (var i = 0; i < seq.length(); i++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                chai_1.expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities());
            var periodicKnots1 = [0, 0.2, 0.5, 0.8];
            var multiplicities1 = [2, 2, 1, 2];
            var seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1 });
            // const seqRef1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1})
            var seqReversed1 = seq1.revertKnotSequence();
            var seqReReversed1 = seqReversed1.revertKnotSequence();
            for (var i = 0; i < seq1.length(); i++) {
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                chai_1.expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            chai_1.expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities());
        });
        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [1, 1, 2, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1)); }).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length())); }).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
        });
        it('can decrement the multiplicity of a knot when the knot index is an extreme knot with constructor type: ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [3, 1, 2, 1, 1, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            var seq1 = seq.clone();
            seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
            var newMultiplicities = [2, 1, 2, 1, 1, 2];
            chai_1.expect(seq.multiplicities()).to.eql(newMultiplicities);
            var lastIndex = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length() - 1);
            seq1.decrementKnotMultiplicity(lastIndex);
            chai_1.expect(seq1.multiplicities()).to.eql(newMultiplicities);
        });
        it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            for (var i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                var seq1 = seq.clone();
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i));
                chai_1.expect(seq1.length()).to.eql(seq.length() - 1);
            }
        });
        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one and the knot is strictly inside the normalized basis interval', function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [1, 1, 2, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            for (var i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                var seq1 = seq.clone();
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i));
                if (seq.multiplicities()[i] === 1) {
                    chai_1.expect(seq1.length()).to.eql(seq.length() - 1);
                }
                else {
                    chai_1.expect(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1);
                }
            }
        });
        it('cannot decrement the multiplicity of an existing knot at sequence extremities and remove it when its multiplicity equals one', function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [1, 1, 2, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0)); }).to.throw(KnotSequences_1.EM_SEQUENCE_ORIGIN_REMOVAL);
            chai_1.expect(function () { return seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.distinctAbscissae().length - 1)); }).to.throw(KnotSequences_1.EM_SEQUENCE_ORIGIN_REMOVAL);
        });
        it('can decrement the multiplicity of an existing knot and get updated knot spacing property of the sequence', function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [1, 1, 2, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            var abscissa = 0.3;
            var index = seq.findSpan(abscissa);
            chai_1.expect(seq.multiplicities()).to.eql(multiplicities);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            seq.decrementKnotMultiplicity(index);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
        });
        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [1, 1, 2, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            var abscissa = 0.2;
            var index = seq.findSpan(abscissa);
            chai_1.expect(seq.multiplicities()).to.eql(multiplicities);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            seq.decrementKnotMultiplicity(index);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
        });
        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence when the knot sequence  consistency is not checked', function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.8];
            var multiplicities = [3, 1, 2, 1, 1, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            var indexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length() - 1);
            chai_1.expect(seq.multiplicities()).to.eql(multiplicities);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            seq.decrementKnotMultiplicity(indexStrictInc);
            chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            chai_1.expect(seq.multiplicities()).to.eql([2, 1, 2, 1, 1, 2]);
        });
        it('cannot raise the multiplicity of an intermediate knot more than maxMultiplicityOrder with constructor type' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.length()).to.eql(periodicKnots.length);
            var mult = maxMultiplicityOrder - 1;
            var _loop_1 = function (i) {
                var seq1 = seq.clone();
                var index = seq.findSpan(periodicKnots[i]);
                chai_1.expect(function () { return seq1.raiseKnotMultiplicity(index, mult); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
            };
            for (var i = maxMultiplicityOrder; i < (periodicKnots.length - maxMultiplicityOrder); i++) {
                _loop_1(i);
            }
        });
        it('can raise the order of multiplicity of a knot in the knot sequence of a periodic B-spline', function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.multiplicities()).to.eql(multiplicities);
            var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(1);
            seq.raiseKnotMultiplicity(index, 1);
            chai_1.expect(seq.multiplicities()).to.eql([1, 2, 1, 1, 1, 1, 1, 1, 1]);
            chai_1.expect(seq.knotMultiplicity(index)).to.eql(2);
            index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0);
            seq.raiseKnotMultiplicity(index, 1);
            chai_1.expect(seq.multiplicities()).to.eql([2, 2, 1, 1, 1, 1, 1, 1, 2]);
            chai_1.expect(seq.knotMultiplicity(index)).to.eql(2);
        });
        it('check the knot sequence property update after raising the multiplicity of a knot of a uniform multiplicity sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            for (var i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                var seq1 = seq.clone();
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                seq1.raiseKnotMultiplicity(index, 1);
                chai_1.expect(seq1.isKnotMultiplicityUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            }
        });
        it('check the knot sequence property update after raising the multiplicity of a knot of a non uniform multiplicity sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [3, 1, 1, 1, 1, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            for (var i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                var seq1 = seq.clone();
                var index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                seq1.raiseKnotMultiplicity(index, 1);
                chai_1.expect(seq1.isKnotMultiplicityUniform).to.eql(false);
                chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            }
        });
        it('can raise the multiplicity of an existing knot with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            var index = seq.findSpan(0.2);
            seq.raiseKnotMultiplicity(index, 1);
            chai_1.expect(seq.multiplicities()).to.eql([1, 1, 2, 1, 1, 1]);
            chai_1.expect(function () { return seq.raiseKnotMultiplicity(index, 2); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
        });
        it('can raise the multiplicity of an extreme knot with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var multiplicities = [1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            var indexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0);
            seq.raiseKnotMultiplicity(indexStrictInc, 1);
            chai_1.expect(seq.multiplicities()).to.eql([2, 1, 1, 1, 1, 2]);
            chai_1.expect(function () { return seq.raiseKnotMultiplicity(indexStrictInc, 2); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
        });
        it('cannot find the span index in the knot sequence if the abscissa is negative', function () {
            var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [3, 1, 1, 2, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            chai_1.expect(function () { return seq.findSpan(-0.1); }).to.throw(KnotSequences_1.EM_U_OUTOF_KNOTSEQ_RANGE);
        });
        it('can find the span index in the knot sequence if the abscissa is over the knot sequence period', function () {
            var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [3, 1, 1, 2, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            var lastAbscissa = seq.lastKnot();
            var index1 = seq.findSpan(0.1);
            var nbPeriod = 3;
            for (var i = 1; i <= nbPeriod; i++) {
                var index = seq.findSpan(i * lastAbscissa + 0.1);
                chai_1.expect(index.knotIndex).to.eql(index1.knotIndex);
            }
        });
        it('can find the span index in the knot sequence from an abscissa for a non uniform periodic B-spline with multiplicity greater than one at its origin', function () {
            var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            var multiplicities = [3, 1, 1, 2, 3];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            for (var i = 0; i < seq.distinctAbscissae().length; i++) {
                var abscissa = seq.distinctAbscissae()[i];
                var index = seq.findSpan(abscissa);
                if (i !== (seq.distinctAbscissae().length - 1)) {
                    chai_1.expect(index.knotIndex).to.eql(i);
                }
                else {
                    chai_1.expect(index.knotIndex).to.eql(i - 1);
                }
                if (i < seq.distinctAbscissae().length - 1) {
                    var abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    chai_1.expect(index.knotIndex).to.eql(i);
                }
            }
        });
        it('can find the span index in the knot sequence from an abscissa for a periodic B-spline with an arbitrary knot sequence', function () {
            var periodicKnots = [0, 0.1, 0.2, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
            var multiplicities = [2, 1, 1, 1, 1, 2, 1, 1, 2];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(false);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            var lastAbscissa = seq.lastKnot();
            chai_1.expect(seq.uMax).to.eql(lastAbscissa);
            var lastAbscissaIndex = seq.distinctAbscissae().length - 1;
            for (var i = 0; i <= lastAbscissaIndex; i++) {
                var abscissa = seq.distinctAbscissae()[i];
                var index = seq.findSpan(abscissa);
                if (i !== lastAbscissaIndex) {
                    chai_1.expect(index.knotIndex).to.eql(i);
                }
                else {
                    chai_1.expect(index.knotIndex).to.eql(i - 1);
                }
                if (i < lastAbscissaIndex) {
                    var abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    chai_1.expect(index.knotIndex).to.eql(i);
                }
            }
        });
        it('can find the span index in the knot sequence from an abscissa for a uniform periodic B-spline', function () {
            var periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            var multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1];
            var maxMultiplicityOrder = 3;
            var seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
            chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
            for (var i = 0; i < seq.distinctAbscissae().length; i++) {
                var abscissa = seq.distinctAbscissae()[i];
                var index = seq.findSpan(abscissa);
                if (i !== (seq.distinctAbscissae().length - 1)) {
                    chai_1.expect(index.knotIndex).to.eql(i);
                }
                else {
                    chai_1.expect(index.knotIndex).to.eql(i - 1);
                }
                if (i < seq.distinctAbscissae().length - 1) {
                    var abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    chai_1.expect(index.knotIndex).to.eql(i);
                }
            }
        });
    });
});
