"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1 = require("../../src/newBsplines/StrictlyIncreasingPeriodicKnotSequenceClosedCurve");
const KnotSequenceConstructorInterface_1 = require("../../src/newBsplines/KnotSequenceConstructorInterface");
const KnotSequences_1 = require("../../src/ErrorMessages/KnotSequences");
const KnotSequences_2 = require("../../src/namedConstants/KnotSequences");
const GeneralPurpose_1 = require("../namedConstants/GeneralPurpose");
const KnotIndexStrictlyIncreasingSequence_1 = require("../../src/newBsplines/KnotIndexStrictlyIncreasingSequence");
const Knots_1 = require("../../src/ErrorMessages/Knots");
describe('StrictlyIncreasingPeriodicKnotSequenceClosedCurve', () => {
    describe('Constructor', () => {
        describe(KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, () => {
            it('cannot be initialized with a max multiplicity order smaller than 1 with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 0;
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE })).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('can be initialized with (maxMultiplicityOrder + 1) knots with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE });
                (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                const knots = [0, 1, 2];
                (0, chai_1.expect)(seq.allAbscissae).to.eql(knots);
                (0, chai_1.expect)(seq.length()).to.eql(maxMultiplicityOrder + 1);
                const seq1 = [];
                for (const knot of seq) {
                    if (knot !== undefined) {
                        seq1.push(knot.abscissa);
                        (0, chai_1.expect)(knot.multiplicity).to.eql(1);
                    }
                }
                (0, chai_1.expect)(seq1).to.eql(knots);
            });
            it('can be initialized with 3 knots when maxMultiplicityOrder = 1 with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 1;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE });
                (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                const knots = [0, 1, 2];
                (0, chai_1.expect)(seq.allAbscissae).to.eql(knots);
                (0, chai_1.expect)(seq.length()).to.eql(maxMultiplicityOrder + 2);
            });
            it('can get properties of the knot sequence initialized with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE });
                (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
                (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
                (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            });
            it('can check that the origin of a knot sequence coincides with OPEN_KNOT_SEQUENCE_ORIGIN when initialized with ' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE });
                (0, chai_1.expect)(() => seq.checkNormalizedBasisOrigin()).to.not.throw();
            });
            it('can get the uMax of a knot sequence initialized with ' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE });
                (0, chai_1.expect)(seq.uMax).to.eql(3);
            });
            it('can get the property of the knot sequence about non uniform multiplicity as true when maxMultiplicityOrder = 1 when initialized with type constructor' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 1;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE });
                (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            });
        });
        describe(KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 0;
                const BsplBasisSize = 2;
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize })).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than 2 when maxMultiplicity = 1 with ' + KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 1;
                const BsplBasisSize = 1;
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize })).to.throw(KnotSequences_1.EM_SIZENORMALIZED_BSPLINEBASIS);
            });
            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with ' + KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const BsplBasisSize = 1;
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize })).to.throw(KnotSequences_1.EM_SIZENORMALIZED_BSPLINEBASIS);
            });
            it('can be initialized with a size of normalized B-spline basis produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, () => {
                for (let i = 1; i < 4; i++) {
                    const maxMultiplicityOrder = i;
                    const upperBound = 4;
                    for (let j = maxMultiplicityOrder + 1; j < (maxMultiplicityOrder + upperBound); j++) {
                        if (!(i === 1 && j < 3)) {
                            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: j });
                            const knots = [];
                            for (let k = 0; k < j; k++) {
                                knots.push(k);
                            }
                            const seq1 = [];
                            for (const knot of seq) {
                                if (knot !== undefined) {
                                    seq1.push(knot.abscissa);
                                    (0, chai_1.expect)(knot.multiplicity).to.eql(1);
                                }
                            }
                            (0, chai_1.expect)(seq1).to.eql(knots);
                        }
                    }
                }
            });
            it('can check that the origin of a knot sequence coincides with OPEN_KNOT_SEQUENCE_ORIGIN when initialized with ' + KnotSequenceConstructorInterface_1.NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const BsplBasisSize = 3;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                (0, chai_1.expect)(() => seq.checkNormalizedBasisOrigin()).to.not.throw();
            });
            it('can get the u interval upper bound produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const BsplBasisSize = 3;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                (0, chai_1.expect)(seq.uMax).to.eql(BsplBasisSize - 1);
            });
            it('can get the properties of knot sequnence produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const BsplBasisSize = 3;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
                (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
                (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            });
        });
        describe(KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            it('cannot be initialized with a max multiplicity order smaller than 1 with type constructor' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 0;
                const periodicKnots = [1];
                const multiplicities = [1];
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot be initialized with a non increasing knot sequence with type constructor' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const periodicKnots = [0, 1, 2, 1.5, 3, 4];
                const multiplicities = [1, 1, 1, 1, 1, 1];
                const maxMultiplicityOrder = 2;
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_NON_STRICTLY_INCREASING_VALUES);
                const periodicKnots1 = [0, -0.5, 1, 2, 3, 4];
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_NON_STRICTLY_INCREASING_VALUES);
                const periodicKnots2 = [0, 1, 2, 3, 4, 3.5];
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots2, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_NON_STRICTLY_INCREASING_VALUES);
            });
            it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const periodicKnots = [0, 1, 1, 1, 2, 3];
                const multiplicities = [1, 3, 1, 1];
                const maxMultiplicityOrder = 2;
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities })).to.throw();
            });
            it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder at the sequence origin with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots = [0, 1, 2, 3];
                const multiplicities = [4, 1, 1, 4];
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it('cannot be initialized with a null knot length array ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots = [];
                const multiplicities = [1];
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_NULL_KNOT_SEQUENCE);
            });
            it('cannot be initialized with a null multiplicity length array ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots = [0, 1, 2, 3];
                const multiplicities = [];
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_NULL_MULTIPLICITY_ARRAY);
            });
            it('cannot be initialized when the size of the knot array differs from that of the multiplicity array ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots = [0, 1, 2, 3];
                const multiplicities = [1, 1, 1];
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL);
            });
            it('cannot initialize a periodic knot sequence if its origin is not zero', () => {
                const periodicKnots = [1, 2, 3, 4];
                const multiplicities = [1, 1, 1, 1];
                const maxMultiplicityOrder = 2;
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
            });
            it('cannot initialize a periodic knot sequence if end knot multiplicities differ when multiplicity is greater than maxMultiplicityOrder', () => {
                const periodicKnots = [0, 1, 2, 3, 4];
                const multiplicities = [2, 1, 1, 1, 1];
                const maxMultiplicityOrder = 1;
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it('cannot initialize a periodic knot sequence if end knot multiplicities differ when multiplicity is equal or lower than maxMultiplicityOrder', () => {
                const periodicKnots = [0, 1, 2, 3, 4];
                const multiplicities = [2, 1, 1, 1, 1];
                const maxMultiplicityOrder = 2;
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER);
            });
            it('cannot initialize a periodic knot sequence if knot sequence length is smaller than (degree + 2) to generate a basis of splines', () => {
                const periodicKnots = [0, 1];
                const multiplicities = [1, 1];
                const maxMultiplicityOrder = 2;
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities })).to.throw(KnotSequences_1.EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS);
                const periodicKnots1 = [0, 1];
                const multiplicities1 = [1, 1];
                const maxMultiplicityOrder1 = 1;
                (0, chai_1.expect)(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder1, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1 })).to.throw(KnotSequences_1.EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS);
            });
            it('can be initialized with uniform or non uniform knot sequences as examples', () => {
                const periodicKnots = [0, 1, 2];
                const multiplicities = [1, 1, 1];
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                (0, chai_1.expect)(seq.allAbscissae).to.eql(periodicKnots);
                const periodicKnots1 = [0, 1];
                const multiplicities1 = [2, 2];
                const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1 });
                (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                (0, chai_1.expect)(seq.allAbscissae).to.eql(periodicKnots);
            });
            it('can be initialized with uniform knot sequence as minimal case linear closed polygon', () => {
                const periodicKnots = [0, 1, 2];
                const multiplicities = [1, 1, 1];
                const maxMultiplicityOrder = 1;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                (0, chai_1.expect)(seq.allAbscissae).to.eql(periodicKnots);
                (0, chai_1.expect)(seq.multiplicities()).to.eql(multiplicities);
            });
            it('can get the properties of the knot sequence initialized with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2];
                const multiplicities = [1, 1, 1];
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
                (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
                (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            });
            it('can get the knot index of the knot sequence origin initialized with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2];
                const multiplicities = [1, 1, 1];
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                (0, chai_1.expect)(seq.allAbscissae[0]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            });
            it('can get the uMax of the knot sequence origin initialized with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2];
                const multiplicities = [1, 1, 1];
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                (0, chai_1.expect)(seq.uMax).to.eql(seq.allAbscissae[seq.allAbscissae.length - 1]);
            });
            describe('Initialization of knot sequences for non uniform closed B-splines', () => {
                it('can be initialized with an initializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE + '. Non uniform knot sequence of closed curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 3;
                    const periodicKnots = [0, 1];
                    const multiplicities = [3, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    const seq1 = [];
                    const multiplicities1 = [];
                    for (const knot of seq) {
                        if (knot !== undefined) {
                            seq1.push(knot.abscissa);
                            multiplicities1.push(knot.multiplicity);
                        }
                    }
                    (0, chai_1.expect)(seq1).to.eql(periodicKnots);
                    (0, chai_1.expect)(multiplicities1).to.eql(multiplicities);
                });
                it('can get the properties of the knot sequence with type constructor ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                    const maxMultiplicityOrder = 3;
                    const periodicKnots = [0, 1];
                    const multiplicities = [3, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
                    (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
                });
                it('check that the non uniform property is deactivated for all knot sequences of this class', () => {
                    const maxMultiplicityOrder = 3;
                    const periodicKnots = [0, 1];
                    const multiplicities = [3, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index and the abscissa of the upper bound of the normalized basis. Non uniform B-Spline without intermediate knot', () => {
                    const maxMultiplicityOrder = 3;
                    const periodicKnots = [0, 1];
                    const multiplicities = [3, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.allAbscissae[0]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
                    (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
                });
                it('can be initialized with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE + ' initializer. non uniform knot sequence of closed curve with intermediate knots', () => {
                    const maxMultiplicityOrder = 3;
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
                    const multiplicities = [3, 1, 1, 2, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    const seq1 = [];
                    const multiplicities1 = [];
                    for (const knot of seq) {
                        if (knot !== undefined) {
                            seq1.push(knot.abscissa);
                            multiplicities1.push(knot.multiplicity);
                        }
                    }
                    (0, chai_1.expect)(seq1).to.eql(periodicKnots);
                    (0, chai_1.expect)(multiplicities1).to.eql(multiplicities);
                });
                it('can get the properties of knot sequence: non uniform knot sequence of open curve with intermediate knots with type constructor ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                    const maxMultiplicityOrder = 3;
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
                    const multiplicities = [3, 1, 1, 2, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
                    (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
                    (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: non uniform knot sequence of open curve with intermediate knots', () => {
                    const maxMultiplicityOrder = 3;
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
                    const multiplicities = [3, 1, 1, 2, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.allAbscissae[0]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
                    (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
                });
            });
            describe('Initialization of knot sequences for uniform closed B-splines', () => {
                it('can be initialized with an initializer ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE + '. uniform knot sequence of open curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 2;
                    const periodicKnots = [0, 1, 2, 3, 5, 6];
                    const multiplicities = [1, 1, 1, 1, 1, 1];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    const seq1 = [];
                    const multiplicities1 = [];
                    for (const knot of seq) {
                        if (knot !== undefined) {
                            seq1.push(knot.abscissa);
                            multiplicities1.push(knot.multiplicity);
                        }
                    }
                    (0, chai_1.expect)(seq1).to.eql(periodicKnots);
                    (0, chai_1.expect)(multiplicities1).to.eql(multiplicities);
                });
                it('can get the properties of the knot sequence. uniform B-Spline with uniformly distributed knots with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                    const maxMultiplicityOrder = 1;
                    const periodicKnots = [0, 1, 2, 3, 4, 5];
                    const multiplicities = [1, 1, 1, 1, 1, 1];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
                    (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
                    (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the properties of the knot sequence. uniform B-Spline with non uniformly distributed knots with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                    const maxMultiplicityOrder = 1;
                    const periodicKnots = [0, 1, 2.5, 3, 4, 5];
                    const multiplicities = [1, 1, 1, 1, 1, 1];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
                    (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
                    (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: uniform knot sequence of closed curve', () => {
                    const maxMultiplicityOrder = 2;
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 0.8, 1];
                    const multiplicities = [1, 1, 1, 1, 1, 1];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.allAbscissae[0]).to.eql(0);
                    (0, chai_1.expect)(seq.uMax).to.eql(1);
                });
            });
            describe('Initialization of arbitrary knot sequences for B-splines', () => {
                it('can be initialized with ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE + ' initializer. arbitrary knot sequence', () => {
                    const maxMultiplicityOrder = 3;
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
                    const multiplicities = [2, 1, 1, 2, 2];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    const seq1 = [];
                    const multiplicities1 = [];
                    for (const knot of seq) {
                        if (knot !== undefined) {
                            seq1.push(knot.abscissa);
                            multiplicities1.push(knot.multiplicity);
                        }
                    }
                    (0, chai_1.expect)(seq1).to.eql(periodicKnots);
                    (0, chai_1.expect)(multiplicities1).to.eql(multiplicities);
                });
                it('can get the properties of the knot sequence. closed B-Spline with arbitrary distributed knots', () => {
                    const maxMultiplicityOrder = 3;
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
                    const multiplicities = [2, 1, 1, 2, 2];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
                    (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
                    (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: arbitrary knot sequence of closed B-spline', () => {
                    const maxMultiplicityOrder = 3;
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
                    const multiplicities = [2, 1, 1, 2, 2];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
                    (0, chai_1.expect)(seq.allAbscissae[0]).to.eql(0);
                    (0, chai_1.expect)(seq.uMax).to.eql(1);
                });
            });
        });
    });
    describe('Accessors', () => {
        it('can get all the abscissa of the knot sequence', () => {
            const maxMultiplicityOrder = 2;
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.allAbscissae).to.eql(periodicKnots);
        });
        it('can use the iterator to access the knots of the sequence', () => {
            const maxMultiplicityOrder = 3;
            const periodicKnots = [0, 1, 2];
            const multiplicities = [3, 1, 3];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            const seq1 = [];
            const multiplicities1 = [];
            for (const knot of seq) {
                if (knot !== undefined) {
                    seq1.push(knot.abscissa);
                    multiplicities1.push(knot.multiplicity);
                }
            }
            (0, chai_1.expect)(seq1).to.eql(periodicKnots);
            (0, chai_1.expect)(multiplicities1).to.eql(multiplicities);
        });
        it('can get the maximum multiplicity order of the knot sequence', () => {
            const maxMultiplicityOrder = 2;
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        });
    });
    describe('Methods', () => {
        it('can clone the knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const maxMultiplicityOrder = 3;
            const periodicKnots = [0, 1, 1.5, 2];
            const multiplicities = [3, 2, 1, 3];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const seq1 = seq.clone();
            (0, chai_1.expect)(seq1).to.eql(seq);
            const periodicKnots1 = [0, 1, 2, 3, 4];
            const multiplicities1 = [1, 1, 1, 1, 1];
            const seq2 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1 });
            const seq3 = seq2.clone();
            (0, chai_1.expect)(seq3).to.eql(seq2);
        });
        it('can get the length of a strictly increasing knot sequence', () => {
            const periodicKnots = [0, 1, 2, 3, 4];
            const multiplicities = [1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 2;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const length = seq.length();
            (0, chai_1.expect)(length).to.eql(periodicKnots.length);
            const periodicKnots1 = [0, 1, 2, 3, 4];
            const multiplicities1 = [1, 2, 1, 1, 1];
            const maxMultiplicityOrder1 = 2;
            const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder1, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1 });
            const length1 = seq1.length();
            (0, chai_1.expect)(length1).to.eql(periodicKnots1.length);
            const periodicKnots2 = [0, 1, 2, 3, 4];
            const multiplicities2 = [2, 1, 1, 1, 2];
            const maxMultiplicityOrder2 = 2;
            const seq2 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder2, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots2, multiplicities: multiplicities2 });
            const length2 = seq2.length();
            (0, chai_1.expect)(length2).to.eql(periodicKnots2.length);
        });
        it('can get the distinct abscissae of a minimal knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots = [0, 1];
            const multiplicities = [3, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.distinctAbscissae()).to.eql(periodicKnots);
        });
        it('can get the distinct abscissae of a knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.distinctAbscissae()).to.eql(periodicKnots);
        });
        it('can get the distinct multiplicities of a minimal knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots = [0, 1];
            const multiplicities = [3, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.multiplicities()).to.eql(multiplicities);
        });
        it('can get the distinct multiplicities of a knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.multiplicities()).to.eql(multiplicities);
        });
        it('can get the knot sequence length', () => {
            const maxMultiplicityOrder = 3;
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [2, 1, 1, 2, 2];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            (0, chai_1.expect)(seq.length()).to.eql(periodicKnots.length);
            const periodicKnots1 = [0, 1];
            const multiplicities1 = [3, 3];
            const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1 });
            (0, chai_1.expect)(seq1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            (0, chai_1.expect)(seq1.length()).to.eql(periodicKnots1.length);
        });
        it('can get the period of a knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.getPeriod()).to.eql(seq.lastKnot());
        });
        it('can get the period of a knot sequence conforming to a uniform B-spline', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.getPeriod()).to.eql(seq.lastKnot());
        });
        it('cannot get the knot abscissa from a sequence index when the index is out of range with negative values', () => {
            const maxMultiplicityOrder = 3;
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            (0, chai_1.expect)(() => seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1))).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
        });
        it('can obtain the knot abscissa given the knot index for a uniform knot sequence for all knots except the last one', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 2;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            (0, chai_1.expect)(seq.allAbscissae.length).to.eql(periodicKnots.length);
            for (let i = 0; i < periodicKnots.length - 1; i++) {
                (0, chai_1.expect)(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(periodicKnots[i]);
            }
        });
        it('can obtain the knot abscissa given the knot index for a uniform knot sequence for the last one', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 2;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            (0, chai_1.expect)(seq.allAbscissae.length).to.eql(periodicKnots.length);
            (0, chai_1.expect)(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(periodicKnots.length - 1))).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
        });
        it('can obtain the knot abscissa given the knot index for a non uniform knot sequence. The last knot corresponding to the period returns the knot sequence origin :' + KnotSequences_2.KNOT_SEQUENCE_ORIGIN, () => {
            const periodicKnots = [0, 1];
            const multiplicities = [2, 2];
            const maxMultiplicityOrder = 2;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            (0, chai_1.expect)(seq.allAbscissae.length).to.eql(periodicKnots.length);
            for (let i = 0; i < (periodicKnots.length - 1); i++) {
                (0, chai_1.expect)(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(periodicKnots[i]);
            }
            (0, chai_1.expect)(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(periodicKnots.length - 1))).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
        });
        it('can get the knot multiplicity from a knot sequence index', () => {
            const maxMultiplicityOrder = 3;
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            let cumulativeMult = 0;
            for (let i = 0; i < multiplicities.length; i++) {
                (0, chai_1.expect)(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
                cumulativeMult += multiplicities[i];
            }
        });
        it('can check if an abscissa coincides with a knot belonging to the interval of the normalized basis', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const abscissae = seq.distinctAbscissae();
            for (let i = 0; i < abscissae.length; i++) {
                if (abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE) < seq.uMax) {
                    (0, chai_1.expect)(seq.isAbscissaCoincidingWithKnot(abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                    (0, chai_1.expect)(seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.eql(true);
                }
                if (abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE) > 0) {
                    (0, chai_1.expect)(seq.isAbscissaCoincidingWithKnot(abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                    (0, chai_1.expect)(seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.eql(true);
                }
            }
        });
        it('can check if the knot multiplicity at a given abscissa is zero', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const abscissae = seq.distinctAbscissae();
            for (let i = 0; i < abscissae.length; i++) {
                (0, chai_1.expect)(seq.isKnotlMultiplicityZero(abscissae[i])).to.eql(false);
                if (abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE) < seq.uMax)
                    (0, chai_1.expect)(seq.isKnotlMultiplicityZero(abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(true);
                if (abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE) > 0)
                    (0, chai_1.expect)(seq.isKnotlMultiplicityZero(abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE))).to.eql(true);
            }
        });
        it('can revert the knot sequence for a uniform B-spline', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            // const seqRef = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for (let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                (0, chai_1.expect)(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            (0, chai_1.expect)(seq.multiplicities()).to.eql(seqReReversed.multiplicities());
            const periodicKnots1 = [0, 0.05, 0.2, 0.35, 0.4, 0.5];
            const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities });
            // const seqRef1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities})
            const seqReversed1 = seq1.revertKnotSequence();
            const seqReReversed1 = seqReversed1.revertKnotSequence();
            let i = 0;
            for (let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                (0, chai_1.expect)(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            (0, chai_1.expect)(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities());
        });
        it('can revert the knot sequence for a non uniform B-spline', () => {
            const periodicKnots = [0, 0.3, 0.4, 0.5, 0.8];
            const multiplicities = [2, 1, 1, 2, 2];
            const maxMultiplicityOrder = 2;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            // const seqRef = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for (let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                (0, chai_1.expect)(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            (0, chai_1.expect)(seq.multiplicities()).to.eql(seqReReversed.multiplicities());
            const periodicKnots1 = [0, 0.2, 0.5, 0.8];
            const multiplicities1 = [2, 2, 1, 2];
            const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1 });
            // const seqRef1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1})
            const seqReversed1 = seq1.revertKnotSequence();
            const seqReReversed1 = seqReversed1.revertKnotSequence();
            for (let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                (0, chai_1.expect)(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE);
            }
            (0, chai_1.expect)(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities());
        });
        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(() => seq.insertKnot(0.5)).to.throw(KnotSequences_1.EM_ABSCISSA_TOO_CLOSE_TO_KNOT);
            (0, chai_1.expect)(() => seq.insertKnot(0.5 + (KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.throw(KnotSequences_1.EM_ABSCISSA_TOO_CLOSE_TO_KNOT);
            (0, chai_1.expect)(() => seq.insertKnot(0.5 - (KnotSequences_2.KNOT_COINCIDENCE_TOLERANCE / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.throw(KnotSequences_1.EM_ABSCISSA_TOO_CLOSE_TO_KNOT);
        });
        it('cannot insert a new knot in the knot sequence if the new knot multiplicity is greater than maxMultiplicityOrder', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3;
            const newKnotAbscissa = 0.3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(() => seq.insertKnot(newKnotAbscissa, 5)).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
        });
        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case over uMax', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(() => seq.insertKnot(1.2, 1)).to.throw(KnotSequences_1.EM_KNOT_INSERTION_OVER_UMAX);
            const knots1 = [0, 1, 2, 3, 4];
            const multiplicities1 = [1, 1, 1, 1, 1];
            const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots1, multiplicities: multiplicities1 });
            (0, chai_1.expect)(() => seq1.insertKnot(4.2, 1)).to.throw(KnotSequences_1.EM_KNOT_INSERTION_OVER_UMAX);
        });
        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case lower than sequence origin', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 4;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(() => seq.insertKnot(-0.2, 1)).to.throw(KnotSequences_1.EM_KNOT_INSERTION_UNDER_SEQORIGIN);
            const knots1 = [0, 1, 2, 3, 4];
            const multiplicities1 = [1, 1, 1, 1, 1];
            const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots1, multiplicities: multiplicities1 });
            (0, chai_1.expect)(() => seq1.insertKnot(-0.2, 1)).to.throw(KnotSequences_1.EM_KNOT_INSERTION_UNDER_SEQORIGIN);
        });
        it('can insert a new knot in the knot sequence if the new knot abscissa is distinct from the existing ones', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const seq1 = seq.insertKnot(0.3, 3);
            (0, chai_1.expect)(seq1.distinctAbscissae()).to.eql([0, 0.3, 0.5, 0.6, 0.7, 1]);
            (0, chai_1.expect)(seq1.multiplicities()).to.eql([3, 3, 1, 1, 2, 3]);
        });
        it('check knot sequence properties after knot insertion', () => {
            const periodicKnots = [0, 1, 2, 3, 4];
            const multiplicities = [1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
            (0, chai_1.expect)(seq.allAbscissae[0]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            const seq2 = seq.insertKnot(1.2, 1);
            (0, chai_1.expect)(seq2.isKnotSpacingUniform).to.eql(false);
            (0, chai_1.expect)(seq2.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(seq2.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(seq2.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
            (0, chai_1.expect)(seq2.allAbscissae[0]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
            const seq1 = seq.insertKnot(1.2, 2);
            (0, chai_1.expect)(seq1.isKnotSpacingUniform).to.eql(false);
            (0, chai_1.expect)(seq1.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq1.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(seq1.uMax).to.eql(periodicKnots[periodicKnots.length - 1]);
            (0, chai_1.expect)(seq1.allAbscissae[0]).to.eql(KnotSequences_2.KNOT_SEQUENCE_ORIGIN);
        });
        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1))).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
        });
        it('can decrement the multiplicity of a knot when the knot index is an extreme knot with constructor type: ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [3, 1, 2, 1, 1, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const seq1 = seq.clone();
            seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
            const newMultiplicities = [2, 1, 2, 1, 1, 2];
            (0, chai_1.expect)(seq.multiplicities()).to.eql(newMultiplicities);
            const lastIndex = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length() - 1);
            seq1.decrementKnotMultiplicityMutSeq(lastIndex);
            (0, chai_1.expect)(seq1.multiplicities()).to.eql(newMultiplicities);
        });
        it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            for (let i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                const seq1 = seq.clone();
                seq1.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i));
                (0, chai_1.expect)(seq1.length()).to.eql(seq.length() - 1);
            }
        });
        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one and the knot is strictly inside the normalized basis interval', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            for (let i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                const seq1 = seq.clone();
                seq1.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i));
                if (seq.multiplicities()[i] === 1) {
                    (0, chai_1.expect)(seq1.length()).to.eql(seq.length() - 1);
                }
                else {
                    (0, chai_1.expect)(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1);
                }
            }
        });
        it('cannot decrement the multiplicity of an existing knot at sequence extremities and remove it when its multiplicity equals one', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0))).to.throw(KnotSequences_1.EM_SEQUENCE_ORIGIN_REMOVAL);
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.distinctAbscissae().length - 1))).to.throw(KnotSequences_1.EM_SEQUENCE_ORIGIN_REMOVAL);
        });
        it('can decrement the multiplicity of an existing knot and get updated knot spacing property of the sequence', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const abscissa = 0.3;
            const index = seq.findSpan(abscissa);
            (0, chai_1.expect)(seq.multiplicities()).to.eql(multiplicities);
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            seq.decrementKnotMultiplicityMutSeq(index);
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
        });
        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const abscissa = 0.2;
            const index = seq.findSpan(abscissa);
            (0, chai_1.expect)(seq.multiplicities()).to.eql(multiplicities);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            seq.decrementKnotMultiplicityMutSeq(index);
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
        });
        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence when the knot sequence  consistency is not checked', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.8];
            const multiplicities = [3, 1, 2, 1, 1, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length() - 1);
            (0, chai_1.expect)(seq.multiplicities()).to.eql(multiplicities);
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            seq.decrementKnotMultiplicityMutSeq(indexStrictInc);
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(seq.multiplicities()).to.eql([2, 1, 2, 1, 1, 2]);
        });
        it('cannot raise the multiplicity of an intermediate knot more than maxMultiplicityOrder with constructor type' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.length()).to.eql(periodicKnots.length);
            const mult = maxMultiplicityOrder - 1;
            for (let i = maxMultiplicityOrder; i < (periodicKnots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone();
                const index = seq.findSpan(periodicKnots[i]);
                (0, chai_1.expect)(() => seq1.raiseKnotMultiplicity(index, mult)).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
            }
        });
        it('can raise the order of multiplicity of a knot in the knot sequence of a periodic B-spline', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.multiplicities()).to.eql(multiplicities);
            let index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(1);
            const seq1 = seq.raiseKnotMultiplicity(index, 1);
            (0, chai_1.expect)(seq1.multiplicities()).to.eql([1, 2, 1, 1, 1, 1, 1, 1, 1]);
            (0, chai_1.expect)(seq1.knotMultiplicity(index)).to.eql(2);
            index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0);
            const seq2 = seq1.raiseKnotMultiplicity(index, 1);
            (0, chai_1.expect)(seq2.multiplicities()).to.eql([2, 2, 1, 1, 1, 1, 1, 1, 2]);
            (0, chai_1.expect)(seq2.knotMultiplicity(index)).to.eql(2);
        });
        it('check the knot sequence property update after raising the multiplicity of a knot of a uniform multiplicity sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            for (let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                const seq1 = seq.raiseKnotMultiplicity(index, 1);
                (0, chai_1.expect)(seq1.isKnotMultiplicityUniform).to.eql(false);
                (0, chai_1.expect)(seq1.isKnotMultiplicityNonUniform).to.eql(false);
            }
        });
        it('check the knot sequence property update after raising the multiplicity of a knot of a non uniform multiplicity sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [3, 1, 1, 1, 1, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            for (let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone();
                const index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                seq1.raiseKnotMultiplicity(index, 1);
                (0, chai_1.expect)(seq1.isKnotMultiplicityUniform).to.eql(false);
                (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            }
        });
        it('can raise the multiplicity of an existing knot with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const index = seq.findSpan(0.2);
            const seq1 = seq.raiseKnotMultiplicity(index, 1);
            (0, chai_1.expect)(seq1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1]);
            (0, chai_1.expect)(() => seq1.raiseKnotMultiplicity(index, 2)).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
        });
        it('can raise the multiplicity of an extreme knot with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0);
            const seq1 = seq.raiseKnotMultiplicity(indexStrictInc, 1);
            (0, chai_1.expect)(seq1.multiplicities()).to.eql([2, 1, 1, 1, 1, 2]);
            (0, chai_1.expect)(() => seq1.raiseKnotMultiplicity(indexStrictInc, 2)).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
        });
        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1))).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(KnotSequences_1.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
        });
        it('can decrement the multiplicity of a knot when the knot index is an extreme knot with constructor type: ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [3, 1, 2, 1, 1, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
            const newMultiplicities = [2, 1, 2, 1, 1, 2];
            (0, chai_1.expect)(seq1.multiplicities()).to.eql(newMultiplicities);
            const lastIndex = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length() - 1);
            const seq2 = seq.decrementKnotMultiplicity(lastIndex);
            (0, chai_1.expect)(seq2.multiplicities()).to.eql(newMultiplicities);
        });
        it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            for (let i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i));
                (0, chai_1.expect)(seq1.length()).to.eql(seq.length() - 1);
            }
        });
        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one and the knot is strictly inside the normalized basis interval', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            for (let i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i));
                if (seq.multiplicities()[i] === 1) {
                    (0, chai_1.expect)(seq1.length()).to.eql(seq.length() - 1);
                }
                else {
                    (0, chai_1.expect)(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1);
                }
            }
        });
        it('can decrement the multiplicity of an existing knot and get updated knot spacing property of the sequence', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const abscissa = 0.3;
            const indexStrictInc = seq.findSpan(abscissa);
            (0, chai_1.expect)(seq.multiplicities()).to.eql([1, 1, 2, 1, 1, 1]);
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            const seq1 = seq.decrementKnotMultiplicity(indexStrictInc);
            (0, chai_1.expect)(seq1.isKnotSpacingUniform).to.eql(false);
        });
        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const abscissa = 0.2;
            const indexStrictInc = seq.findSpan(abscissa);
            (0, chai_1.expect)(seq.multiplicities()).to.eql([1, 1, 2, 1, 1, 1]);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            const seq1 = seq.decrementKnotMultiplicity(indexStrictInc);
            (0, chai_1.expect)(seq1.isKnotSpacingUniform).to.eql(true);
            (0, chai_1.expect)(seq1.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(seq1.isKnotMultiplicityNonUniform).to.eql(false);
        });
        it('cannot decrement the multiplicity of an existing knot at sequence extremities and remove it when its multiplicity equals one', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0))).to.throw(KnotSequences_1.EM_SEQUENCE_ORIGIN_REMOVAL);
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.distinctAbscissae().length - 1))).to.throw(KnotSequences_1.EM_SEQUENCE_ORIGIN_REMOVAL);
        });
        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence when the knot sequence  consistency is not checked', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.8];
            const multiplicities = [3, 1, 2, 1, 1, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length() - 1);
            (0, chai_1.expect)(seq.multiplicities()).to.eql([3, 1, 2, 1, 1, 3]);
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            const seq1 = seq.decrementKnotMultiplicity(indexStrictInc);
            (0, chai_1.expect)(seq1.isKnotSpacingUniform).to.eql(false);
            (0, chai_1.expect)(seq1.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq1.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(seq1.multiplicities()).to.eql([2, 1, 2, 1, 1, 2]);
        });
        it('cannot find the span index in the knot sequence if the abscissa is negative', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(() => seq.findSpan(KnotSequences_2.KNOT_SEQUENCE_ORIGIN - 0.1)).to.throw(KnotSequences_1.EM_U_OUTOF_KNOTSEQ_RANGE);
        });
        it('can find the span index in the knot sequence if the abscissa is over the knot sequence period', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            let lastAbscissa = seq.lastKnot();
            const index1 = seq.findSpan(0.1);
            const nbPeriod = 3;
            for (let i = 1; i <= nbPeriod; i++) {
                const index = seq.findSpan(i * lastAbscissa + 0.1);
                (0, chai_1.expect)(index.knotIndex).to.eql(index1.knotIndex);
            }
        });
        it('can find the span index in the knot sequence from an abscissa for a non uniform periodic B-spline with multiplicity greater than one at its origin', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1];
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities });
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            for (let i = 0; i < seq.distinctAbscissae().length; i++) {
                const abscissa = seq.distinctAbscissae()[i];
                let index = seq.findSpan(abscissa);
                if (i !== (seq.distinctAbscissae().length - 1)) {
                    (0, chai_1.expect)(index.knotIndex).to.eql(i);
                }
                else {
                    (0, chai_1.expect)(index.knotIndex).to.eql(i - 1);
                }
                if (i < seq.distinctAbscissae().length - 1) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    (0, chai_1.expect)(index.knotIndex).to.eql(i);
                }
            }
        });
        it('can find the span index in the knot sequence from an abscissa for a periodic B-spline with an arbitrary knot sequence', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
            const multiplicities = [2, 1, 1, 1, 1, 2, 1, 1, 2];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            const lastAbscissa = seq.lastKnot();
            (0, chai_1.expect)(seq.uMax).to.eql(lastAbscissa);
            const lastAbscissaIndex = seq.distinctAbscissae().length - 1;
            for (let i = 0; i <= lastAbscissaIndex; i++) {
                const abscissa = seq.distinctAbscissae()[i];
                let index = seq.findSpan(abscissa);
                if (i !== lastAbscissaIndex) {
                    (0, chai_1.expect)(index.knotIndex).to.eql(i);
                }
                else {
                    (0, chai_1.expect)(index.knotIndex).to.eql(i - 1);
                }
                if (i < lastAbscissaIndex) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    (0, chai_1.expect)(index.knotIndex).to.eql(i);
                }
            }
        });
        it('can find the span index in the knot sequence from an abscissa for a uniform periodic B-spline', () => {
            const periodicKnots = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve_1.StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities });
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            for (let i = 0; i < seq.distinctAbscissae().length; i++) {
                const abscissa = seq.distinctAbscissae()[i];
                let index = seq.findSpan(abscissa);
                if (i !== (seq.distinctAbscissae().length - 1)) {
                    (0, chai_1.expect)(index.knotIndex).to.eql(i);
                }
                else {
                    (0, chai_1.expect)(index.knotIndex).to.eql(i - 1);
                }
                if (i < seq.distinctAbscissae().length - 1) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    (0, chai_1.expect)(index.knotIndex).to.eql(i);
                }
            }
        });
    });
});
