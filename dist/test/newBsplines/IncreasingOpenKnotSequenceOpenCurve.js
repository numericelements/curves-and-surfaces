"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const IncreasingOpenKnotSequenceOpenCurve_1 = require("../../src/newBsplines/IncreasingOpenKnotSequenceOpenCurve");
const Piegl_Tiller_NURBS_Book_1 = require("../../src/newBsplines/Piegl_Tiller_NURBS_Book");
const KnotSequenceConstructorInterface_1 = require("../../src/newBsplines/KnotSequenceConstructorInterface");
const fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1 = require("../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC");
const KnotSequences_1 = require("../../src/namedConstants/KnotSequences");
const KnotSequences_2 = require("../../src/ErrorMessages/KnotSequences");
const KnotSequences_3 = require("../../src/WarningMessages/KnotSequences");
const GeneralPurpose_1 = require("../namedConstants/GeneralPurpose");
const KnotIndexStrictlyIncreasingSequence_1 = require("../../src/newBsplines/KnotIndexStrictlyIncreasingSequence");
const KnotIndexIncreasingSequence_1 = require("../../src/newBsplines/KnotIndexIncreasingSequence");
const Knots_1 = require("../../src/ErrorMessages/Knots");
describe('IncreasingOpenKnotSequenceOpenCurve', () => {
    describe('Constructor', () => {
        describe(KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 0;
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot initialize a knot sequence with a maximal multiplicity order equal to one for a constructor type ' + KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 1;
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('can be initialized without a knot sequence with initializer ' + KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, () => {
                for (let i = 2; i < 4; i++) {
                    const maxMultiplicityOrder = i;
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE });
                    const knots = [];
                    for (let j = 1; j <= maxMultiplicityOrder; j++) {
                        knots.splice(0, 0, 0);
                        knots.splice((knots.length), 0, 1);
                    }
                    const seq1 = [];
                    for (const knot of seq) {
                        if (knot !== undefined)
                            seq1.push(knot);
                    }
                    (0, chai_1.expect)(seq1).to.eql(knots);
                }
            });
            it('can get the knot index of the knot sequence origin with ' + KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 3;
                const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE });
                (0, chai_1.expect)(seq.indexKnotOrigin.knotIndex).to.eql(0);
            });
            it('can get the properties of knot sequnence produced with the initializer ' + KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 3;
                const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE });
                (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
                (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
                (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(true);
            });
            it('can get the u interval upper bound produced with the initializer ' + KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 3;
                const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.NO_KNOT_OPEN_CURVE });
                const lastIndex = seq.length() - 1;
                (0, chai_1.expect)(seq.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0))).to.eql(0.0);
                (0, chai_1.expect)(seq.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(lastIndex))).to.eql(1.0);
                (0, chai_1.expect)(seq.uMax).to.eql(1.0);
            });
        });
        describe(KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 1;
                const BsplBasisSize = 2;
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const BsplBasisSize = 1;
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize })).to.throw(KnotSequences_2.EM_SIZENORMALIZED_BSPLINEBASIS);
            });
            it('can be initialized with a size of normalized B-spline basis produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, () => {
                for (let i = 2; i < 5; i++) {
                    const maxMultiplicityOrder = i;
                    const upperBound = 4;
                    for (let j = maxMultiplicityOrder; j < (maxMultiplicityOrder + upperBound); j++) {
                        const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: j });
                        const knots = [];
                        for (let k = -(maxMultiplicityOrder - 1); k < (j + maxMultiplicityOrder - 1); k++) {
                            knots.push(k);
                        }
                        const seq1 = [];
                        for (const knot of seq) {
                            if (knot !== undefined)
                                seq1.push(knot);
                        }
                        (0, chai_1.expect)(seq1).to.eql(knots);
                    }
                }
            });
            it('can get the knot index of the curve origin produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const BsplBasisSize = 3;
                const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                (0, chai_1.expect)(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1);
            });
            it('can get the u interval upper bound produced by the initializer ' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const BsplBasisSize = 3;
                const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                (0, chai_1.expect)(seq.uMax).to.eql(BsplBasisSize - 1);
            });
            it('can get the properties of knot sequnence produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const BsplBasisSize = 3;
                const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
                (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
                (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            });
        });
        describe(KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type' + KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 1;
                const BsplBasisSize = 2;
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot initialize a knot sequence with ' + KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE + ' initializer if the basis dimension prescribed does not enable generating a normalized basis of B-Splines', () => {
                const maxMultiplicityOrder = 3;
                const BsplBasisSize = 2;
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize })).to.throw(KnotSequences_2.EM_SIZENORMALIZED_BSPLINEBASIS);
            });
            it('can be initialized with a number of control points produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                for (let i = 2; i < 5; i++) {
                    const maxMultiplicityOrder = i;
                    const upperBound = 3;
                    for (let j = maxMultiplicityOrder; j < (maxMultiplicityOrder + upperBound); j++) {
                        const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: j });
                        const knots = [];
                        for (let k = 0; k < maxMultiplicityOrder; k++) {
                            knots.push(0);
                        }
                        for (let k = 0; k < maxMultiplicityOrder; k++) {
                            knots.push(j - maxMultiplicityOrder + 1);
                        }
                        for (let k = 0; k < (j - maxMultiplicityOrder); k++) {
                            knots.splice((maxMultiplicityOrder + k), 0, (k + 1));
                        }
                        const seq1 = [];
                        for (const knot of seq) {
                            if (knot !== undefined)
                                seq1.push(knot);
                        }
                        (0, chai_1.expect)(seq1).to.eql(knots);
                    }
                }
            });
            it('can get the knot index of the curve origin produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const BsplBasisSize = 4;
                const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                (0, chai_1.expect)(seq.indexKnotOrigin.knotIndex).to.eql(0);
            });
            it('can get the u interval upper bound produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const BsplBasisSize = 4;
                const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                (0, chai_1.expect)(seq.uMax).to.eql(BsplBasisSize - maxMultiplicityOrder + 1);
            });
            it('can get the properties of knot sequence produced by the initializer' + KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const BsplBasisSize = 4;
                const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize });
                (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
                (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
                (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(true);
            });
        });
        describe(KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 0;
                const knots = [0, 1];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot be initialized with a null knot sequence produced by the initializer' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const knots = [];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots })).to.throw(KnotSequences_2.EM_NULL_KNOT_SEQUENCE);
            });
            it('cannot initialize a knot sequence with a number of knots smaller than maxMultiplicityOrder for a constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 4;
                const knots = [-1, 0, 1];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots })).to.throw(KnotSequences_2.EM_NOT_NORMALIZED_BASIS);
            });
            it('cannot initialize a knot sequence with a number of knots such that there no interval of normalized basis left.', () => {
                const maxMultiplicityOrder = 4;
                const knots = [-2, -1, 0, 1, 2];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots })).to.throw(KnotSequences_2.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('cannot initialize a knot sequence with a number of knots such that the interval of normalized basis reduces to zero.', () => {
                const maxMultiplicityOrder = 4;
                const knots = [-3, -2, -1, 0, 1, 2, 3];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots })).to.throw(KnotSequences_2.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const knots = [0, 0, 0, 0.5, 2, 3, 4, 5, 5, 5, 5];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_KNOT);
                const knots1 = [0, 0, 0, 0, 0.5, 2, 3, 4, 5, 5, 5];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots1 })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_KNOT);
                const knots2 = [0, 0, 0, 0.5, 2, 2, 2, 2, 3, 4, 5, 5, 5];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots2 })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it('cannot be initialized with a non increasing knot sequence produced by the initializer' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const knots = [0, 0, 0, -0.5, 2, 3, 4, 5, 5, 5];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots })).to.throw(KnotSequences_2.EM_NON_INCREASING_KNOT_VALUES);
                const knots1 = [-2, -2.5, 0, 1, 2, 3, 4];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots1 })).to.throw(KnotSequences_2.EM_NON_INCREASING_KNOT_VALUES);
                const knots2 = [0, 0, 0, 1, 2, 3, 4, 4, 3.5];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots2 })).to.throw(KnotSequences_2.EM_NON_INCREASING_KNOT_VALUES);
            });
            it('cannot be initialized for non-uniform B-splines with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                let knots = [0, 0, 0, 0.5, 2, 3, 4, 5, 5, 5];
                const upperBound = knots.length;
                for (let i = maxMultiplicityOrder; i < upperBound - maxMultiplicityOrder; i++) {
                    const knots1 = knots.slice();
                    for (let j = 1; j < maxMultiplicityOrder; j++) {
                        knots.splice(i, 0, knots[i]);
                    }
                    (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
                    knots = knots1.slice();
                }
            });
            it('cannot be initialized for uniform B-splines with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
                let knots = [-2, -1, 0, 0.5, 1, 2, 3, 4, 5, 6, 7];
                const maxMultiplicityOrder = 3;
                const upperBound = knots.length;
                for (let i = maxMultiplicityOrder; i < upperBound - maxMultiplicityOrder; i++) {
                    const knots1 = knots.slice();
                    for (let j = 1; j < maxMultiplicityOrder; j++) {
                        knots.splice(i, 0, knots[i]);
                    }
                    (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
                    knots = knots1.slice();
                }
            });
            it("cannot be initialized with an initializer " + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE + "when knot multiplicities from the sequence start don't define a normalized basis", () => {
                const maxMultiplicityOrder = 4;
                const knots = [-1, -1, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots })).to.throw(KnotSequences_2.EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
            });
            it("cannot be initialized with an initializer " + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE + "when knot multiplicities from the sequence end don't define a normalized basis", () => {
                const maxMultiplicityOrder = 4;
                const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 2, 2];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots })).to.throw(KnotSequences_2.EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND);
            });
            describe('Initialization of knot sequences for non uniform B-splines', () => {
                it('can be initialized with an initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE + ' . Non uniform knot sequence of open curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 4;
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    const seq1 = [];
                    for (const knot of seq) {
                        if (knot !== undefined)
                            seq1.push(knot);
                    }
                    (0, chai_1.expect)(seq1).to.eql(knots);
                });
                it('can check the initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE + 'for consistency of the knot sequence and knot multiplicities', () => {
                    const maxMultiplicityOrder = 4;
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    const seq1 = seq.allAbscissae;
                    (0, chai_1.expect)(() => seq.checkSizeConsistency(seq1.slice(1, seq1.length - 1))).to.throw(KnotSequences_2.EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ);
                });
                it('can get the properties of the knot sequence. Non uniform B-Spline without intermediate knot', () => {
                    const maxMultiplicityOrder = 4;
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
                    (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
                    (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(true);
                });
                it('can get the knot index and the abscissa of the upper bound of the normalized basis. Non uniform B-Spline without intermediate knot', () => {
                    const maxMultiplicityOrder = 4;
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
                    (0, chai_1.expect)(seq.uMax).to.eql(knots[knots.length - 1]);
                });
                it('can be initialized with an initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE + '. non uniform knot sequence of open curve with intermediate knots', () => {
                    const maxMultiplicityOrder = 4;
                    const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    const seq1 = [];
                    for (const knot of seq) {
                        if (knot !== undefined)
                            seq1.push(knot);
                    }
                    (0, chai_1.expect)(seq1).to.eql(knots);
                });
                it('can get the properties of knot sequence: non uniform knot sequence of open curve with intermediate knots.', () => {
                    const maxMultiplicityOrder = 4;
                    const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
                    (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
                    (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(true);
                });
                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: non uniform knot sequence of open curve with intermediate knots', () => {
                    const curveDegree = 3;
                    const maxMultiplicityOrder = curveDegree + 1;
                    const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
                    (0, chai_1.expect)(seq.uMax).to.eql(1);
                });
            });
            describe('Initialization of knot sequences for uniform B-splines', () => {
                it('can be initialized with an initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE + '. uniform knot sequence of open curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 2;
                    const knots = [-1, 0, 1, 2, 3, 5, 6, 7];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    const seq1 = [];
                    for (const knot of seq) {
                        if (knot !== undefined)
                            seq1.push(knot);
                    }
                    (0, chai_1.expect)(seq1).to.eql(knots);
                });
                it('can get the properties of the knot sequence. uniform B-Spline with uniformly distributed knots', () => {
                    const maxMultiplicityOrder = 2;
                    const knots = [-1, 0, 1, 2, 3, 4, 5, 6];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
                    (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
                    (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the properties of the knot sequence. uniform B-Spline with non uniformly distributed knots', () => {
                    const maxMultiplicityOrder = 2;
                    const knots = [-1, 0, 1, 2.5, 3, 4, 5, 6];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
                    (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
                    (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: uniform knot sequence of open curve', () => {
                    const maxMultiplicityOrder = 3;
                    const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 0.7, 1, 2.5, 3];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(maxMultiplicityOrder - 1));
                    (0, chai_1.expect)(seq.uMax).to.eql(1);
                });
            });
            describe('Initialization of arbitrary knot sequences for B-splines', () => {
                it('can be initialized with uniform like knots at left and non-uniform knots at right.', () => {
                    const maxMultiplicityOrder = 4;
                    const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                    const seq1 = [];
                    for (const knot of seq) {
                        if (knot !== undefined)
                            seq1.push(knot);
                    }
                    (0, chai_1.expect)(seq1).to.eql(knots);
                });
                it('can get the properties of an arbitrary knot sequence', () => {
                    const maxMultiplicityOrder = 4;
                    const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
                    (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
                    (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
                });
                it('can get the knot index of the sequence origin and maximal abscissa of the normalized knot sequence', () => {
                    const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                    const maxMultiplicityOrder = 4;
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                    (0, chai_1.expect)(seq.indexKnotOrigin.knotIndex).to.eql(2);
                    (0, chai_1.expect)(seq.uMax).to.eql(1);
                });
            });
        });
        describe(KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 0;
                const knots = [0, 1];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_SEQUENCE);
            });
            it('cannot be initialized with a null knot sequence produced by the initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 3;
                const knots = [];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots })).to.throw(KnotSequences_2.EM_NULL_KNOT_SEQUENCE);
            });
            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 3;
                const knots = [0, 0.5, 2, 3, 4, 5, 5, 5, 5];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_KNOT);
                const knots1 = [0, 0, 0, 0, 0.5, 2, 3, 4, 5];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots1 })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_KNOT);
                const knots2 = [0, 0.5, 2, 2, 2, 2, 3, 4, 5];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots2 })).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_KNOT);
            });
            it('cannot be initialized with a knot sequence producing a non normalized basis', () => {
                const knots = [-1, 0, 1];
                const maxMultiplicityOrder = 4;
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots })).to.throw(KnotSequences_2.EM_NOT_NORMALIZED_BASIS);
            });
            it('cannot be initialized with a knot sequence able to produce normalized basis intervals that are incompatible with each other', () => {
                const knots = [-2, -1, 0, 1, 2];
                const maxMultiplicityOrder = 4;
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots })).to.throw(KnotSequences_2.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('cannot be initialized with a knot sequence producing a normalized basis interval with null amplitude', () => {
                const knots = [-3, -2, -1, 0, 1, 2, 3];
                const maxMultiplicityOrder = 4;
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots })).to.throw(KnotSequences_2.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('cannot be initialized with a non increasing knot sequence produced by the initializer ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 3;
                const knots = [0, 0, -0.5, 2, 3, 4, 5, 5, 5];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots })).to.throw(KnotSequences_2.EM_NON_INCREASING_KNOT_VALUES);
                const knots1 = [-2, -2.5, 0, 1, 2, 3, 4];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots1 })).to.throw(KnotSequences_2.EM_NON_INCREASING_KNOT_VALUES);
                const knots2 = [0, 0, 1, 2, 3, 4, 4, 3.5];
                (0, chai_1.expect)(() => new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots2 })).to.throw(KnotSequences_2.EM_NON_INCREASING_KNOT_VALUES);
            });
            it('can be initialized with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 3;
                let knots = [0, 0, 0, 0.5, 2, 3, 4, 5, 5];
                const upperBound = knots.length;
                const multiplicityFirstKnot = 3;
                const multiplicityLastKnot = 2;
                for (let i = multiplicityFirstKnot; i < upperBound - multiplicityLastKnot - 1; i++) {
                    const knots1 = knots.slice();
                    for (let j = 1; j < maxMultiplicityOrder; j++) {
                        knots.splice(i, 0, knots[i]);
                    }
                    const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
                    (0, chai_1.expect)(seq.allAbscissae).to.eql(knots);
                    knots = knots1.slice();
                }
            });
        });
    });
    describe('Accessors', () => {
        it('can get all the abscissa of the knot sequence', () => {
            const maxMultiplicityOrder = 3;
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.allAbscissae).to.eql(knots);
        });
        it('can use the iterator to access the knots of the sequence', () => {
            const maxMultiplicityOrder = 4;
            const knots = [0, 0, 0, 0, 1, 2, 2, 2, 2];
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            const seq1 = [];
            for (const knot of seq) {
                if (knot !== undefined)
                    seq1.push(knot);
            }
            (0, chai_1.expect)(seq1).to.eql(knots);
        });
        it('can get the status of the knot sequence about the description of C0 discontinuity', () => {
            const maxMultiplicityOrder = 3;
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
            (0, chai_1.expect)(seq1.isSequenceUpToC0Discontinuity).to.eql(true);
        });
        it('can get the maximum multiplicity order of the knot sequence', () => {
            const maxMultiplicityOrder = 3;
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        });
    });
    describe('Methods', () => {
        describe('Protected Methods', () => {
            let ProtectMethIncreasingOpenKnotSequenceOpenCurve;
            beforeEach(() => {
                ProtectMethIncreasingOpenKnotSequenceOpenCurve = class extends IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve {
                    constructor(maxMultiplicityOrder, knotParameters) {
                        super(maxMultiplicityOrder, knotParameters);
                    }
                    updateKnotSequenceThroughNormalizedBasisAnalysisMutSeqTest() {
                        this.updateKnotSequenceThroughNormalizedBasisAnalysisMutSeq();
                    }
                    decrementKnotMultiplicityMutSeqTest(index, checkSequenceConsistency = true) {
                        this.decrementKnotMultiplicityMutSeq(index, checkSequenceConsistency);
                    }
                    raiseKnotMultiplicityTest(arrayIndices, multiplicity, checkSequenceConsistency) {
                        this.raiseKnotMultiplicityKnotArrayMutSeq(arrayIndices, multiplicity, checkSequenceConsistency);
                    }
                };
            });
            it('cannot decrement the multiplicity of the knot at sequence origin when the knot multiplicity is one with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
                const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
                const maxMultiplicityOrder = 4;
                const seq = new ProtectMethIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                const seqStrInc = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
                const indexOrigin = seqStrInc.indexKnotOrigin;
                (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
                (0, chai_1.expect)(() => seq.decrementKnotMultiplicityMutSeqTest(indexOrigin, true)).to.throw(KnotSequences_2.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
                const seq1 = new ProtectMethIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
                const seqStrInc1 = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq1);
                const indexOrigin1 = seqStrInc1.indexKnotOrigin;
                (0, chai_1.expect)(seq1.isSequenceUpToC0Discontinuity).to.eql(true);
                seq1.decrementKnotMultiplicityMutSeqTest(indexOrigin1, false);
                (0, chai_1.expect)(seq1.allAbscissae).to.eql([-0.3, -0.2, -0.1, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);
            });
            it('cannot decrement the multiplicity of the knot if the normalized basis becomes overdefined at the left hand side of its interval with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
                const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
                const maxMultiplicityOrder = 4;
                const seq = new ProtectMethIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                const indexOrigin = seq.indexKnotOrigin;
                (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
                seq.decrementKnotMultiplicityMutSeqTest(indexOrigin, false);
                (0, chai_1.expect)(() => seq.updateKnotSequenceThroughNormalizedBasisAnalysisMutSeqTest()).to.throw(KnotSequences_2.EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
            });
            it('cannot decrement the multiplicity of the knot if the normalized basis becomes overdefined at the right hand side of its interval with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
                const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.4, 0.5, 0.6, 0.7, 0.8];
                const maxMultiplicityOrder = 4;
                const seq = new ProtectMethIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                const indexUMax = seq.getKnotIndexNormalizedBasisAtSequenceEnd().knot;
                (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
                seq.decrementKnotMultiplicityMutSeqTest(indexUMax, false);
                (0, chai_1.expect)(() => seq.updateKnotSequenceThroughNormalizedBasisAnalysisMutSeqTest()).to.throw(KnotSequences_2.EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND);
            });
            it('cannot update a knot sequence after decrementing knot multiplicities leading to too many knot removal with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
                const knots = [-0.2, -0.1, 0, 0.1, 0.2, 0.3];
                const maxMultiplicityOrder = 3;
                const seq = new ProtectMethIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                const indexUMax = seq.getKnotIndexNormalizedBasisAtSequenceEnd().knot;
                (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
                const index0 = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0);
                const arrayIndices = [index0, index0, index0, index0];
                seq.decrementKnotMultiplicityMutSeqTest(indexUMax, false);
                (0, chai_1.expect)(() => seq.updateKnotSequenceThroughNormalizedBasisAnalysisMutSeqTest()).to.throw(KnotSequences_2.EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT);
            });
            it('can increase the max multiplicity order of a knot sequence when increasing the multiplicity order of knots at the normalized basis bounds with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const knots = [0, 0, 0, 1, 1, 1];
                const maxMultiplicityOrder = 3;
                const seq = new ProtectMethIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
                (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
                const index0 = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0);
                const index1 = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(1);
                const arrayIndices = [index0, index1];
                seq.raiseKnotMultiplicityTest(arrayIndices, 1, false);
                seq.updateKnotSequenceThroughNormalizedBasisAnalysisMutSeqTest();
                (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1);
            });
        });
        describe('Decorators', () => {
            it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', () => {
                const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
                const maxMultiplicityOrder = 4;
                const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                const sequenceConsistencyCheck = false;
                const arrayIndices = [];
                arrayIndices.push(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(5));
                arrayIndices.push(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(4));
                const seq1 = seq.decrementKnotMultiplicity(arrayIndices, sequenceConsistencyCheck);
                (0, chai_1.expect)(seq1.length()).to.eql(seq.length() - 2);
            });
            it('can raise the multiplicity of any knot of a uniform sequence to more than maxMultiplicityOrder without knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
                const maxMultiplicityOrder = 4;
                const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
                (0, chai_1.expect)(seq.length()).to.eql(knots.length);
                (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(true);
                const multiplicities = seq.multiplicities();
                const seqStrInc = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
                const sequenceConsistencyCheck = false;
                const arrayIndices = [];
                for (let i = 0; i < multiplicities.length; i++) {
                    (0, chai_1.expect)(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
                }
                for (let i = 4; i < 8; i++) {
                    const index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                    arrayIndices.push(index);
                }
                const seq1 = seq.raiseKnotMultiplicity(arrayIndices, 1, sequenceConsistencyCheck);
                (0, chai_1.expect)(seq1.multiplicities()).to.eql([1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1]);
            });
            it('can insert a new knot in the knot sequence if the new knot abscissa is distinct from the existing ones', () => {
                const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
                const maxMultiplicityOrder = 4;
                const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
                const abscissae = [0.3, 0.8];
                const seq1 = seq.insertKnot(abscissae);
                (0, chai_1.expect)(seq1.distinctAbscissae()).to.eql([0, 0.3, 0.5, 0.6, 0.7, 0.8, 1]);
                (0, chai_1.expect)(seq1.multiplicities()).to.eql([4, 1, 1, 1, 2, 1, 4]);
            });
        });
        it('can clone the knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
            const maxMultiplicityOrder = 4;
            const knots = [0, 0, 0, 0, 1, 1, 1.5, 2, 2, 2, 2];
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            const seq1 = seq.clone();
            (0, chai_1.expect)(seq1.isSequenceUpToC0Discontinuity).to.eql(false);
            (0, chai_1.expect)(seq1).to.eql(seq);
        });
        it('can clone the knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const maxMultiplicityOrder = 4;
            const knots = [0, 0, 0, 0, 1, 1, 1.5, 2, 2, 2, 2];
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
            (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            const seq1 = seq.clone();
            (0, chai_1.expect)(seq1.isSequenceUpToC0Discontinuity).to.eql(true);
            (0, chai_1.expect)(seq1).to.eql(seq);
        });
        it('can compute the knot sequence length', () => {
            const maxMultiplicityOrder = 4;
            const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            (0, chai_1.expect)(seq.length()).to.eql(12);
            const knots1 = [0, 0, 0, 0, 1, 1, 1, 1];
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots1 });
            (0, chai_1.expect)(seq1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            (0, chai_1.expect)(seq1.length()).to.eql(8);
        });
        it('can get the distinct abscissae of a knot sequence', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const abscissae = seq.distinctAbscissae();
            (0, chai_1.expect)(abscissae).to.eql([0, 0.5, 0.6, 0.7, 1]);
        });
        it('can check the consistency of the abscissa origin of a knot sequence with the knot index of this origin', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
            const checkSequenceConsistency = false;
            const seq1 = seq.decrementKnotMultiplicity(seq.indexKnotOrigin, checkSequenceConsistency);
            const normalizedBasisAtStart = seq1.getKnotIndexNormalizedBasisAtSequenceStart();
            (0, chai_1.expect)(() => seq1.checkNormalizedBasisOrigin(normalizedBasisAtStart)).to.throw(KnotSequences_2.EM_ABSCISSA_AND_INDEX_ORIGIN_KNOT_SEQUENCE_INCONSISTENT);
        });
        it('can check the consistency of the abscissa origin of a knot sequence with the knot index of this origin', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
            const checkSequenceConsistency = false;
            const seq1 = seq.decrementKnotMultiplicity(seq.indexKnotOrigin, checkSequenceConsistency);
            (0, chai_1.expect)(() => seq1.updateNormalizedBasisOrigin()).to.throw(KnotSequences_2.EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE);
        });
        it('can get the multiplicity of each knot of a knot sequence', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const multiplicities = seq.multiplicities();
            (0, chai_1.expect)(multiplicities).to.eql([4, 1, 1, 2, 4]);
        });
        it('can check the coincidence of an abscissa with a knot', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const abscissae = seq.distinctAbscissae();
            for (let i = 0; i < abscissae.length; i++) {
                (0, chai_1.expect)(seq.isAbscissaCoincidingWithKnot(abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                (0, chai_1.expect)(seq.isAbscissaCoincidingWithKnot(abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE))).to.eql(false);
                (0, chai_1.expect)(seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.eql(true);
            }
        });
        it('can get the knot index in the associated strictly increasing sequence from a sequence index of the increasing sequence.', () => {
            const maxMultiplicityOrder = 4;
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            let index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0);
            let indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            (0, chai_1.expect)(indexStrictlyIncSeq.knotIndex).to.eql(0);
            index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            (0, chai_1.expect)(indexStrictlyIncSeq.knotIndex).to.eql(0);
            index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(4);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            (0, chai_1.expect)(indexStrictlyIncSeq.knotIndex).to.eql(1);
            index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(11);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            (0, chai_1.expect)(indexStrictlyIncSeq.knotIndex).to.eql(4);
        });
        it('can check if the knot multiplicity at a given abscissa is zero', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const abscissae = seq.distinctAbscissae();
            for (let i = 0; i < abscissae.length; i++) {
                (0, chai_1.expect)(seq.isKnotlMultiplicityZero(abscissae[i])).to.eql(false);
                (0, chai_1.expect)(seq.isKnotlMultiplicityZero(abscissae[i] + (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE))).to.eql(true);
                (0, chai_1.expect)(seq.isKnotlMultiplicityZero(abscissae[i] - (GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE))).to.eql(true);
            }
        });
        it('can get the knot multiplicity from an index of the strictly increasing sequence', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const multiplicities = seq.multiplicities();
            for (let i = 0; i < multiplicities.length; i++) {
                let index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                let multiplicity = seq.knotMultiplicity(index);
                (0, chai_1.expect)(multiplicity).to.eql(multiplicities[i]);
            }
            for (let i = 0; i < seq.allAbscissae.length; i++) {
                let index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                let indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
                let multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq);
                (0, chai_1.expect)(multiplicity).to.eql(multiplicities[indexStrictlyIncSeq.knotIndex]);
            }
        });
        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(() => seq.insertKnot(0.5)).to.throw(KnotSequences_2.EM_ABSCISSA_TOO_CLOSE_TO_KNOT);
            (0, chai_1.expect)(() => seq.insertKnot(0.5 + (KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.throw(KnotSequences_2.EM_ABSCISSA_TOO_CLOSE_TO_KNOT);
            (0, chai_1.expect)(() => seq.insertKnot(0.5 - (KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE / GeneralPurpose_1.COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.throw(KnotSequences_2.EM_ABSCISSA_TOO_CLOSE_TO_KNOT);
        });
        it('cannot insert a new knot in the knot sequence if the new knot multiplicity is greater than maxMultiplicityOrder', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const newKnotAbscissa = 0.3;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(() => seq.insertKnot(newKnotAbscissa, 5)).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_KNOT);
        });
        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case over uMax', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(() => seq.insertKnot(1.2, 1)).to.throw(KnotSequences_2.EM_KNOT_INSERTION_OVER_UMAX);
            const knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots1 });
            (0, chai_1.expect)(() => seq1.insertKnot(4.2, 1)).to.throw(KnotSequences_2.EM_KNOT_INSERTION_OVER_UMAX);
        });
        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case lower than sequence origin', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(() => seq.insertKnot(-0.2, 1)).to.throw(KnotSequences_2.EM_KNOT_INSERTION_UNDER_SEQORIGIN);
            const knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots1 });
            (0, chai_1.expect)(() => seq1.insertKnot(-3.2, 1)).to.throw(KnotSequences_2.EM_KNOT_INSERTION_UNDER_SEQORIGIN);
        });
        it('can insert a new knot in the knot sequence if the new knot abscissa is distinct from the existing ones', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const seq1 = seq.insertKnot(0.3, 3);
            (0, chai_1.expect)(seq1.distinctAbscissae()).to.eql([0, 0.3, 0.5, 0.6, 0.7, 1]);
            (0, chai_1.expect)(seq1.multiplicities()).to.eql([4, 3, 1, 1, 2, 4]);
        });
        it('check knot sequence properties after knot insertion', () => {
            const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(seq.uMax).to.eql(4);
            (0, chai_1.expect)(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1);
            const seq2 = seq.insertKnot(1.2, 1);
            (0, chai_1.expect)(seq2.isKnotSpacingUniform).to.eql(false);
            (0, chai_1.expect)(seq2.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(seq2.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(seq2.uMax).to.eql(4);
            (0, chai_1.expect)(seq2.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1);
            const seq1 = seq.insertKnot(1.2, 2);
            (0, chai_1.expect)(seq1.isKnotSpacingUniform).to.eql(false);
            (0, chai_1.expect)(seq1.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq1.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(seq1.uMax).to.eql(4);
            (0, chai_1.expect)(seq1.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1);
        });
        it('cannot get the knot abscissa from a sequence index when the index is out of range', () => {
            const maxMultiplicityOrder = 4;
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            (0, chai_1.expect)(() => seq.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(-1))).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            (0, chai_1.expect)(() => seq.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(seq.length()))).to.throw(KnotSequences_2.EM_KNOTINDEX_INC_SEQ_TOO_LARGE);
        });
        it('can get the knot abscissa from a sequence index. Case of non uniform B-Spline', () => {
            const maxMultiplicityOrder = 4;
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            const abscissae = seq.allAbscissae;
            for (let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                const abscissa = seq.abscissaAtIndex(index);
                (0, chai_1.expect)(abscissa).to.eql(abscissae[i]);
            }
        });
        it('can get the knot abscissa from a sequence index. Case of uniform B-Spline', () => {
            const maxMultiplicityOrder = 4;
            const knots = [-3, -2, -1, 0, 0.5, 0.6, 0.7, 0.7, 1, 2, 3, 4];
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            const abscissae = seq.allAbscissae;
            for (let i = 0; i < seq.length(); i++) {
                let index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                let abscissa = seq.abscissaAtIndex(index);
                (0, chai_1.expect)(abscissa).to.eql(abscissae[i]);
            }
        });
        it('can get the knot multiplicity from a sequence index', () => {
            const maxMultiplicityOrder = 4;
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
            const multiplicities = seq.multiplicities();
            let cumulativeMult = 0;
            for (let i = 0; i < multiplicities.length; i++) {
                let j = 0;
                while (j < multiplicities[i]) {
                    const index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(j + cumulativeMult);
                    const indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
                    (0, chai_1.expect)(seq.knotMultiplicity(indexStrictlyIncSeq)).to.eql(multiplicities[i]);
                    j++;
                }
                cumulativeMult += multiplicities[i];
            }
        });
        it('cannot extract a subset of an increasing knot sequence when indices are out of range', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.uMax).to.eql(0.5);
            let Istart = 0;
            let Iend = Istart;
            (0, chai_1.expect)(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Iend))).to.not.throw(KnotSequences_2.EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE);
            Istart = 6;
            Iend = 5;
            (0, chai_1.expect)(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Iend))).to.throw(KnotSequences_2.EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE);
            Iend = seq.distinctAbscissae().length;
            (0, chai_1.expect)(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Iend))).to.throw(KnotSequences_2.EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE);
            Istart = -1;
            Iend = seq.distinctAbscissae().length - 1;
            (0, chai_1.expect)(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Iend))).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
        });
        it('can extract a subset of an increasing knot sequence of a uniform B-spline', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.uMax).to.eql(0.5);
            const subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1));
            (0, chai_1.expect)(subseq).to.eql([-0.3, -0.2]);
            const subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(6));
            (0, chai_1.expect)(subseq1).to.eql([0, 0.1, 0.2, 0.3]);
            const subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(5), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(8));
            (0, chai_1.expect)(subseq2).to.eql([0.2, 0.3, 0.4, 0.5]);
            const subseq3 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(knots.length - 2), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(knots.length - 1));
            (0, chai_1.expect)(subseq3).to.eql([0.7, 0.8]);
            const subseq4 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(knots.length - 1));
            (0, chai_1.expect)(subseq4).to.eql(knots);
        });
        it('can extract a subset of an increasing knot sequence of a non uniform B-spline', () => {
            const knots = [0, 0, 0, 0, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1));
            (0, chai_1.expect)(subseq).to.eql([0, 0]);
            const subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(4));
            (0, chai_1.expect)(subseq1).to.eql([0, 0, 1]);
            const subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(5));
            (0, chai_1.expect)(subseq2).to.eql([0, 1, 1]);
            const subseq3 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(knots.length - 2), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(knots.length - 1));
            (0, chai_1.expect)(subseq3).to.eql([1, 1]);
            const subseq4 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(knots.length - 1));
            (0, chai_1.expect)(subseq4).to.eql(knots);
        });
        it('cannot convert a strictly increasing knot index into an increasing knot index if the strictly increasing index is out of range', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(() => seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1))).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            (0, chai_1.expect)(() => seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(KnotSequences_2.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
            const knots1 = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.4, 0.5, 0.5, 0.5, 1, 1, 1, 1];
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots1 });
            (0, chai_1.expect)(seq1.isKnotSpacingUniform).to.eql(false);
            (0, chai_1.expect)(seq1.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq1.isKnotMultiplicityNonUniform).to.eql(true);
            const seqStrcInc = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq1);
            (0, chai_1.expect)(() => seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1))).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            (0, chai_1.expect)(() => seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seqStrcInc.length()))).to.throw(KnotSequences_2.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
        });
        it('can convert a strictly increasing knot index into an increasing knot index for a uniform knot sequence', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            for (let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                const indexInc = seq.toKnotIndexIncreasingSequence(index);
                (0, chai_1.expect)(indexInc.knotIndex).to.eql(i);
            }
        });
        it('can convert a strictly increasing knot index into an increasing knot index for a non-uniform knot sequence', () => {
            const knots = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.4, 0.5, 0.5, 0.5, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(true);
            const seqStrcInc = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
            let offSet = 0;
            for (let i = 0; i < seqStrcInc.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i);
                const indexInc = seq.toKnotIndexIncreasingSequence(index);
                (0, chai_1.expect)(indexInc.knotIndex).to.eql(i + offSet);
                offSet = offSet + seq.knotMultiplicity(index) - 1;
            }
        });
        it('cannot raise the multiplicity of an intermediate knot more than (maxMultiplicityOrder - 1) whether knot sequence consistency check is active or not and with constructor type' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.length()).to.eql(knots.length);
            (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            const mult = maxMultiplicityOrder - 1;
            let sequenceConsistencyCheck = true;
            for (let i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone();
                const index = seq.findSpan(knots[i]);
                const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index);
                (0, chai_1.expect)(() => seq1.raiseKnotMultiplicity(indexStrictInc, mult, sequenceConsistencyCheck)).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
            }
            sequenceConsistencyCheck = false;
            for (let i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone();
                const index = seq.findSpan(knots[i]);
                const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index);
                (0, chai_1.expect)(() => seq1.raiseKnotMultiplicity(indexStrictInc, mult, sequenceConsistencyCheck)).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
            }
        });
        it('cannot raise the multiplicity of an intermediate knot to more than maxMultiplicityOrder with knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
            (0, chai_1.expect)(seq.length()).to.eql(knots.length);
            (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            const multiplicities = seq.multiplicities();
            const seqStrInc = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
            const sequenceConsistencyCheck = true;
            for (let i = 0; i < multiplicities.length; i++) {
                (0, chai_1.expect)(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
            }
            for (let i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone();
                const index = seq1.findSpan(knots[i]);
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                (0, chai_1.expect)(() => seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_ATKNOT);
            }
        });
        it('cannot raise the multiplicity of extreme knots with uniform knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
            (0, chai_1.expect)(seq.length()).to.eql(knots.length);
            (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            const multiplicities = seq.multiplicities();
            const seqStrInc = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
            const sequenceConsistencyCheck = true;
            for (let i = 0; i < multiplicities.length; i++) {
                (0, chai_1.expect)(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
            }
            for (let i = 0; i < maxMultiplicityOrder; i++) {
                let seq1 = seq.clone();
                let index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                let indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                (0, chai_1.expect)(() => seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(KnotSequences_2.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
                seq1 = seq.clone();
                index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(seq1.length() - i - 1);
                indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                (0, chai_1.expect)(() => seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(KnotSequences_2.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            }
        });
        it('cannot raise the multiplicity of extreme knots with non uniform knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots = [0, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
            (0, chai_1.expect)(seq.length()).to.eql(knots.length);
            (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            const multiplicities = seq.multiplicities();
            const seqStrInc = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
            const sequenceConsistencyCheck = true;
            for (let i = 0; i < multiplicities.length; i++) {
                (0, chai_1.expect)(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
            }
            for (let i = 0; i < maxMultiplicityOrder; i++) {
                let seq1 = seq.clone();
                let index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                let indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                (0, chai_1.expect)(() => seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(KnotSequences_2.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
                seq1 = seq.clone();
                index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(seq1.length() - i - 1);
                indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                (0, chai_1.expect)(() => seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(KnotSequences_2.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            }
        });
        it('can raise the multiplicity of any knot of a uniform sequence to more than maxMultiplicityOrder without knot sequence consistency check and with constructor type' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
            (0, chai_1.expect)(seq.length()).to.eql(knots.length);
            (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            const multiplicities = seq.multiplicities();
            const seqStrInc = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
            const sequenceConsistencyCheck = false;
            for (let i = 0; i < multiplicities.length; i++) {
                (0, chai_1.expect)(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i]);
            }
            for (let i = 0; i < knots.length; i++) {
                const seq1 = seq.clone();
                const index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                const seq2 = seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck);
                (0, chai_1.expect)(seq2.multiplicities()[i]).to.eql(maxMultiplicityOrder + 1);
            }
        });
        it('check the knot sequence property update after raising the multiplicity of a knot of a uniform multiplicity sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            const sequenceConsistencyCheck = true;
            for (let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone();
                const index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                const seq2 = seq1.raiseKnotMultiplicity(indexStrictInc, 1, sequenceConsistencyCheck);
                (0, chai_1.expect)(seq2.isKnotMultiplicityUniform).to.eql(false);
                (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            }
        });
        it('check the knot sequence property update after raising the multiplicity of a knot of a non uniform multiplicity sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
            const knots = [0, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(true);
            const sequenceConsistencyCheck = true;
            for (let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone();
                const index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index);
                const seq2 = seq1.raiseKnotMultiplicity(indexStrictInc, 1, sequenceConsistencyCheck);
                (0, chai_1.expect)(seq2.isKnotMultiplicityUniform).to.eql(false);
                (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(true);
            }
        });
        it('can raise the multiplicity of an existing knot with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const index = seq.findSpan(0.2);
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index);
            const sequenceConsistencyCheck = true;
            const seq1 = seq.raiseKnotMultiplicity(indexStrictInc, 1);
            (0, chai_1.expect)(seq1.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]);
            (0, chai_1.expect)(() => seq1.raiseKnotMultiplicity(indexStrictInc, 2, sequenceConsistencyCheck)).to.throw(KnotSequences_2.EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
        });
        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const seqStrInc = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
            (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            // test with knot sequence consistency check
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1))).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seqStrInc.length()))).to.throw(KnotSequences_2.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
            // test without knot sequence consistency check
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1), false)).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seqStrInc.length()), false)).to.throw(KnotSequences_2.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
        });
        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
            const seqStrInc = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
            (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(true);
            // test with knot sequence consistency check
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1))).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seqStrInc.length()))).to.throw(KnotSequences_2.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
            // test without knot sequence consistency check
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(-1), false)).to.throw(Knots_1.EM_KNOT_INDEX_VALUE);
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seqStrInc.length()), false)).to.throw(KnotSequences_2.EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE);
        });
        it('cannot decrement the multiplicity of a knot when the knot index is not an intermadiate knot (Case of non uniform B-Spline.) with constructor type: ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE + ' and active sequence consistency check', () => {
            const knots = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
            const basisAtEnd = seq.getKnotIndexNormalizedBasisAtSequenceEnd();
            // test with knot sequence consistency check
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0))).to.throw(KnotSequences_2.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
            (0, chai_1.expect)(() => seq.decrementKnotMultiplicity(basisAtEnd.knot)).to.throw(KnotSequences_2.EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS);
        });
        it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const sequenceConsistencyCheck = false;
            for (let i = 0; i < seq.distinctAbscissae().length; i++) {
                const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck);
                (0, chai_1.expect)(seq1.length()).to.eql(seq.length() - 1);
            }
        });
        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one and the knot is strictly inside the normalized basis interval', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const sequenceConsistencyCheck = true;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            for (let i = maxMultiplicityOrder; i < seq.distinctAbscissae().length - maxMultiplicityOrder; i++) {
                const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck);
                if (seq.multiplicities()[i] === 1) {
                    (0, chai_1.expect)(seq1.length()).to.eql(seq.length() - 1);
                }
                else {
                    (0, chai_1.expect)(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1);
                }
            }
            const seq2 = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
            for (let i = maxMultiplicityOrder; i < seq2.distinctAbscissae().length - maxMultiplicityOrder; i++) {
                const seq3 = seq2.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck);
                if (seq2.multiplicities()[i] === 1) {
                    (0, chai_1.expect)(seq3.length()).to.eql(seq2.length() - 1);
                }
                else {
                    (0, chai_1.expect)(seq3.multiplicities()[i]).to.eql(seq2.multiplicities()[i] - 1);
                }
            }
        });
        it('can decrement the multiplicity of an existing knot and remove it when its multiplicity equals one', () => {
            const knots = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5];
            const maxMultiplicityOrder = 4;
            const sequenceConsistencyCheck = true;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            for (let i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck);
                if (seq.multiplicities()[i] === 1) {
                    (0, chai_1.expect)(seq1.length()).to.eql(seq.length() - 1);
                }
                else {
                    (0, chai_1.expect)(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1);
                }
            }
            const seq2 = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
            for (let i = 1; i < seq2.distinctAbscissae().length - 1; i++) {
                const seq3 = seq2.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck);
                if (seq2.multiplicities()[i] === 1) {
                    (0, chai_1.expect)(seq3.length()).to.eql(seq2.length() - 1);
                }
                else {
                    (0, chai_1.expect)(seq3.multiplicities()[i]).to.eql(seq2.multiplicities()[i] - 1);
                }
            }
        });
        it('can decrement the multiplicity of an existing knot and get updated knot spacing property of the sequence', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const abscissa = 0.3;
            const index = seq.findSpan(abscissa);
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index);
            const sequenceConsistencyCheck = true;
            (0, chai_1.expect)(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]);
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            const seq1 = seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck);
            (0, chai_1.expect)(seq1.isKnotSpacingUniform).to.eql(false);
        });
        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const sequenceConsistencyCheck = true;
            const abscissa = 0.2;
            const index = seq.findSpan(abscissa);
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index);
            (0, chai_1.expect)(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            const seq1 = seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck);
            (0, chai_1.expect)(seq1.isKnotSpacingUniform).to.eql(true);
            (0, chai_1.expect)(seq1.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(seq1.isKnotMultiplicityNonUniform).to.eql(false);
        });
        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence when the knot sequence  consistency is not checked', () => {
            const knots = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.8, 0.8, 0.8, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const sequenceConsistencyCheck = false;
            const seqStrInc = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(seqStrInc.length() - 1);
            (0, chai_1.expect)(seq.multiplicities()).to.eql([4, 1, 2, 1, 1, 4]);
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(true);
            const seq1 = seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck);
            (0, chai_1.expect)(seq1.isKnotSpacingUniform).to.eql(false);
            (0, chai_1.expect)(seq1.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq1.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(seq1.multiplicities()).to.eql([4, 1, 2, 1, 1, 3]);
        });
        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence origin is updated as well as some abscissae', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const sequenceConsistencyCheck = false;
            const indexOrigin = seq.indexKnotOrigin;
            const abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin));
            (0, chai_1.expect)(abscissa).to.eql(KnotSequences_1.KNOT_SEQUENCE_ORIGIN);
            const seq1 = seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck);
            const seq2 = seq1.updateKnotSequenceThroughNormalizedBasisAnalysis();
            (0, chai_1.expect)(seq2.indexKnotOrigin).to.eql(indexOrigin);
            (0, chai_1.expect)(seq2.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin))).to.eql(KnotSequences_1.KNOT_SEQUENCE_ORIGIN);
            const updatedKnots = [-0.4, -0.3, -0.2, 0, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
            for (let i = 0; i < seq2.allAbscissae.length; i++) {
                (0, chai_1.expect)(seq2.allAbscissae[i]).to.be.closeTo(updatedKnots[i], KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
            }
            (0, chai_1.expect)(seq2.uMax).to.eql(0.4);
        });
        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at uMax is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence uMax is updated as well as some abscissae', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const sequenceConsistencyCheck = false;
            const indexUMax = seq.getKnotIndicesBoundingNormalizedBasis().end.knot;
            const abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexUMax));
            (0, chai_1.expect)(abscissa).to.eql(seq.uMax);
            const seq1 = seq.decrementKnotMultiplicity(indexUMax, sequenceConsistencyCheck);
            (0, chai_1.expect)(seq1.uMax).to.eql(seq.uMax);
            const seq2 = seq1.updateKnotSequenceThroughNormalizedBasisAnalysis();
            const updatedKnots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8];
            for (let i = 0; i < seq2.allAbscissae.length; i++) {
                (0, chai_1.expect)(seq2.allAbscissae[i]).to.be.closeTo(updatedKnots[i], KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
            }
            (0, chai_1.expect)(seq2.uMax).to.eql(0.4);
        });
        it('cannot get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement and the sequence origin cannot be updated', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.2, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const sequenceConsistencyCheck = false;
            const indexOrigin = seq.indexKnotOrigin;
            const abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin));
            (0, chai_1.expect)(abscissa).to.eql(KnotSequences_1.KNOT_SEQUENCE_ORIGIN);
            const seq1 = seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck);
            (0, chai_1.expect)(() => seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()).to.throw(KnotSequences_2.EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART);
        });
        it('can get normalized basis states at sequence extremities. Case of NotNormalized state', () => {
            const knots = [0, 0, 0, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const sequenceConsistencyCheck = false;
            const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0), sequenceConsistencyCheck);
            (0, chai_1.expect)(seq1.getKnotIndicesBoundingNormalizedBasis()).to.eql({ start: { knot: new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(1), basisAtSeqExt: KnotSequences_1.NormalizedBasisAtSequenceExtremity.OverDefined }, end: { knot: new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(1), basisAtSeqExt: KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized } });
            const seq2 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(1), sequenceConsistencyCheck);
            (0, chai_1.expect)(seq2.getKnotIndicesBoundingNormalizedBasis()).to.eql({ start: { knot: new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0), basisAtSeqExt: KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized }, end: { knot: new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0), basisAtSeqExt: KnotSequences_1.NormalizedBasisAtSequenceExtremity.OverDefined } });
        });
        it('can get normalized basis states at sequence extremities. Case of StrictlyNormalized state', () => {
            const knots = [0, 0, 0, 1, 2, 2, 2];
            const maxMultiplicityOrder = 3;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const sequenceConsistencyCheck = false;
            const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0), sequenceConsistencyCheck);
            seq1.updateKnotSequenceThroughNormalizedBasisAnalysis();
            const seq3 = seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(2), sequenceConsistencyCheck);
            (0, chai_1.expect)(seq3.getKnotIndicesBoundingNormalizedBasis()).to.eql({ start: { knot: new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(1), basisAtSeqExt: KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized }, end: { knot: new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(1), basisAtSeqExt: KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized } });
        });
        it('cannot get consistent knot sequence normalized basis when a knot multiplicity is decremented and the knot at origin is removed when the knot sequence consistency is not checked during knot multiplicity decrement', () => {
            const knots = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const sequenceConsistencyCheck = false;
            const indexOrigin = seq.indexKnotOrigin;
            let indexNormalizedBasisAtStart = seq.getKnotIndexNormalizedBasisAtSequenceStart();
            (0, chai_1.expect)(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
            (0, chai_1.expect)(indexNormalizedBasisAtStart.knot.knotIndex).to.eql(indexOrigin.knotIndex);
            const seq1 = seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck);
            indexNormalizedBasisAtStart = seq1.getKnotIndexNormalizedBasisAtSequenceStart();
            (0, chai_1.expect)(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
            (0, chai_1.expect)(indexNormalizedBasisAtStart.knot.knotIndex).to.not.eql(indexOrigin.knotIndex);
            (0, chai_1.expect)(seq1.abscissaAtIndex(seq1.toKnotIndexIncreasingSequence(indexNormalizedBasisAtStart.knot))).to.not.eql(KnotSequences_1.KNOT_SEQUENCE_ORIGIN);
            const knots1 = [0, 0, 0, 0, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5];
            const seq2 = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots1 });
            const indexOrigin1 = seq2.indexKnotOrigin;
            let indexNormalizedBasisAtStart1 = seq2.getKnotIndexNormalizedBasisAtSequenceStart();
            (0, chai_1.expect)(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
            (0, chai_1.expect)(indexNormalizedBasisAtStart1.knot.knotIndex).to.eql(indexOrigin1.knotIndex);
            const seq3 = seq2.decrementKnotMultiplicity(indexOrigin1, sequenceConsistencyCheck);
            indexNormalizedBasisAtStart1 = seq3.getKnotIndexNormalizedBasisAtSequenceStart();
            (0, chai_1.expect)(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(KnotSequences_1.NormalizedBasisAtSequenceExtremity.OverDefined);
            (0, chai_1.expect)(indexNormalizedBasisAtStart1.knot.knotIndex).to.not.eql(indexOrigin1.knotIndex);
            (0, chai_1.expect)(seq3.abscissaAtIndex(seq3.toKnotIndexIncreasingSequence(indexNormalizedBasisAtStart1.knot))).to.not.eql(KnotSequences_1.KNOT_SEQUENCE_ORIGIN);
        });
        it('can update the origin and uMax of a knot sequence whose knot multiplicities have been increased/decreased without knot conformity checking', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
            const sequenceConsistencyCheck = false;
            const indexOrigin = seq.indexKnotOrigin;
            const abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin));
            (0, chai_1.expect)(abscissa).to.eql(KnotSequences_1.KNOT_SEQUENCE_ORIGIN);
            (0, chai_1.expect)(seq.uMax).to.eql(0.5);
            const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0), sequenceConsistencyCheck);
            seq1.updateKnotSequenceThroughNormalizedBasisAnalysis();
            (0, chai_1.expect)(seq1.abscissaAtIndex(seq1.toKnotIndexIncreasingSequence(seq.indexKnotOrigin))).to.eql(KnotSequences_1.KNOT_SEQUENCE_ORIGIN);
            (0, chai_1.expect)(seq1.uMax).to.eql(0.4);
        });
        it('can revert the knot sequence for a uniform B-spline', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for (let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                (0, chai_1.expect)(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
            }
            (0, chai_1.expect)(seq.multiplicities()).to.eql(seqReReversed.multiplicities());
            const knots1 = [-0.3, -0.2, -0.1, 0, 0.05, 0.2, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8];
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots1 });
            const seqReversed1 = seq1.revertKnotSequence();
            const seqReReversed1 = seqReversed1.revertKnotSequence();
            let i = 0;
            for (let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                (0, chai_1.expect)(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
            }
            (0, chai_1.expect)(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities());
        });
        it('can revert the knot sequence for a non uniform B-spline', () => {
            const knots = [0, 0, 0, 0.3, 0.4, 0.5, 0.5, 0.8, 0.8, 0.8];
            const maxMultiplicityOrder = 3;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for (let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                (0, chai_1.expect)(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
            }
            (0, chai_1.expect)(seq.multiplicities()).to.eql(seqReReversed.multiplicities());
            const knots1 = [0, 0, 0, 0.2, 0.2, 0.5, 0.8, 0.8, 0.8];
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots1 });
            const seqReversed1 = seq1.revertKnotSequence();
            const seqReReversed1 = seqReversed1.revertKnotSequence();
            for (let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
                (0, chai_1.expect)(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE);
            }
            (0, chai_1.expect)(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities());
        });
        it('can get the order of multiplicity of a knot from its abscissa', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            const distinctKnots = seq.distinctAbscissae();
            const knotMultiplities = seq.multiplicities();
            for (let i = 0; i < distinctKnots.length; i++) {
                (0, chai_1.expect)(seq.knotMultiplicityAtAbscissa(distinctKnots[i])).to.eql(knotMultiplities[i]);
            }
        });
        it('get an order of multiplicity 0 and a warning message when the abscissa does not coincide with a knot', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.knotMultiplicityAtAbscissa(0.1)).to.eql(0);
            // test the warning message issued by the method
            const originalConsoleLog = console.log;
            let capturedMessage = '';
            console.log = (message) => {
                capturedMessage = message;
            };
            seq.knotMultiplicityAtAbscissa(0.1);
            (0, chai_1.expect)(capturedMessage.includes(KnotSequences_3.WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE)).to.eql(true);
            console.log = originalConsoleLog;
        });
        it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(true);
            let indexOffset = -1;
            let indexOffset1 = -1;
            for (let i = 0; i < seq.distinctAbscissae().length; i++) {
                const abscissa = seq.distinctAbscissae()[i];
                let index = seq.findSpan(abscissa);
                if (i !== (seq.distinctAbscissae().length - 1))
                    indexOffset = indexOffset + seq.knotMultiplicityAtAbscissa(abscissa);
                (0, chai_1.expect)(index.knotIndex).to.eql(indexOffset);
                if (i < seq.distinctAbscissae().length - 1) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    indexOffset1 = indexOffset1 + seq.knotMultiplicityAtAbscissa(abscissa);
                    (0, chai_1.expect)(index.knotIndex).to.eql(indexOffset1);
                }
            }
        });
        it('comparison with the former findSpan function devoted to non uniform B-spline', () => {
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            let index = seq.findSpan(0.0);
            // compare with the findSpan function initially set up and devoted to non-uniform B-splines
            let indexCompare = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(0.0, knots, curveDegree);
            (0, chai_1.expect)(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.1);
            indexCompare = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(0.1, knots, curveDegree);
            (0, chai_1.expect)(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.5);
            indexCompare = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(0.5, knots, curveDegree);
            (0, chai_1.expect)(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.55);
            indexCompare = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(0.55, knots, curveDegree);
            (0, chai_1.expect)(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.6);
            indexCompare = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(0.6, knots, curveDegree);
            (0, chai_1.expect)(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.65);
            indexCompare = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(0.65, knots, curveDegree);
            (0, chai_1.expect)(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.7);
            indexCompare = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(0.7, knots, curveDegree);
            (0, chai_1.expect)(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(0.9);
            indexCompare = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(0.9, knots, curveDegree);
            (0, chai_1.expect)(index.knotIndex).to.eql(indexCompare);
            index = seq.findSpan(1.0);
            indexCompare = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(1.0, knots, curveDegree);
            (0, chai_1.expect)(index.knotIndex).to.eql(indexCompare);
        });
        it('cannot find the span index in the knot sequence when the abscissa is outside the normalized basis interval for an arbitrary B-spline', () => {
            const knots = [-0.5, -0.5, -0.5, 0.0, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            (0, chai_1.expect)(() => seq.findSpan(KnotSequences_1.KNOT_SEQUENCE_ORIGIN - 1)).to.throw(KnotSequences_2.EM_U_OUTOF_KNOTSEQ_RANGE);
            (0, chai_1.expect)(() => seq.findSpan(seq.uMax + 1)).to.throw(KnotSequences_2.EM_U_OUTOF_KNOTSEQ_RANGE);
        });
        it('cannot find the span index in the knot sequence when the abscissa is outside the normalized basis interval for a uniform B-spline', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
            (0, chai_1.expect)(() => seq.findSpan(KnotSequences_1.KNOT_SEQUENCE_ORIGIN - 1)).to.throw(KnotSequences_2.EM_U_OUTOF_KNOTSEQ_RANGE);
            (0, chai_1.expect)(() => seq.findSpan(seq.uMax + 1)).to.throw(KnotSequences_2.EM_U_OUTOF_KNOTSEQ_RANGE);
        });
        it('can find the span index in the knot sequence from an abscissa for an arbitrary B-spline', () => {
            const knots = [-0.5, -0.5, -0.5, 0.0, 0.6, 0.7, 0.7, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
            let lastAbscissa = seq.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(seq.length() - 1));
            const indexOrigin = seq.indexKnotOrigin;
            const knotMultiplicityAtOrigin = seq.knotMultiplicity(indexOrigin);
            (0, chai_1.expect)(seq.uMax).to.eql(lastAbscissa);
            let indexOffset = maxMultiplicityOrder - knotMultiplicityAtOrigin - 1;
            let indexOffset2 = indexOffset;
            for (let i = indexOrigin.knotIndex; i < seq.distinctAbscissae().length; i++) {
                const abscissa = seq.distinctAbscissae()[i];
                let index = seq.findSpan(abscissa);
                if (i !== (seq.distinctAbscissae().length - 1))
                    indexOffset = indexOffset + seq.knotMultiplicityAtAbscissa(abscissa);
                (0, chai_1.expect)(index.knotIndex).to.eql(indexOffset);
                if (i < seq.distinctAbscissae().length - 1) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    indexOffset2 = indexOffset2 + seq.knotMultiplicityAtAbscissa(abscissa);
                    (0, chai_1.expect)(index.knotIndex).to.eql(indexOffset2);
                }
            }
            const knots1 = [-0.5, -0.5, -0.5, 0.0, 0.6, 0.7, 0.7, 1, 2.0];
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots1 });
            (0, chai_1.expect)(seq1.isKnotMultiplicityUniform).to.eql(false);
            (0, chai_1.expect)(seq1.isKnotMultiplicityNonUniform).to.eql(false);
            let indexNormalizedBasisAtEnd = seq1.getKnotIndexNormalizedBasisAtSequenceEnd();
            (0, chai_1.expect)(indexNormalizedBasisAtEnd.basisAtSeqExt).to.eql(KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
            const lastIndex = indexNormalizedBasisAtEnd.knot;
            lastAbscissa = seq1.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(lastIndex));
            (0, chai_1.expect)(seq1.uMax).to.eql(lastAbscissa);
            const indexOrigin1 = seq1.indexKnotOrigin;
            const knotMultiplicityAtOrigin1 = seq1.knotMultiplicity(indexOrigin1);
            let indexOffset1 = maxMultiplicityOrder - knotMultiplicityAtOrigin1 - 1;
            let indexOffset4 = indexOffset1;
            for (let i = indexOrigin1.knotIndex; i < lastIndex.knotIndex; i++) {
                const abscissa = seq.distinctAbscissae()[i];
                let index = seq.findSpan(abscissa);
                if (i !== (seq.distinctAbscissae().length - 1))
                    indexOffset1 = indexOffset1 + seq.knotMultiplicityAtAbscissa(abscissa);
                (0, chai_1.expect)(index.knotIndex).to.eql(indexOffset1);
                if (i < seq.distinctAbscissae().length - 1) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    indexOffset4 = indexOffset4 + seq.knotMultiplicityAtAbscissa(abscissa);
                    (0, chai_1.expect)(index.knotIndex).to.eql(indexOffset4);
                }
            }
        });
        it('can find the span index in the knot sequence from an abscissa for a uniform B-spline', () => {
            const knots = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
            const maxMultiplicityOrder = 4;
            const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
            (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(true);
            (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
            const indexNormalizedBasisAtEnd = seq.getKnotIndexNormalizedBasisAtSequenceEnd();
            (0, chai_1.expect)(indexNormalizedBasisAtEnd.basisAtSeqExt).to.eql(KnotSequences_1.NormalizedBasisAtSequenceExtremity.StrictlyNormalized);
            const lastIndex = indexNormalizedBasisAtEnd.knot;
            const lastAbscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(lastIndex));
            (0, chai_1.expect)(seq.uMax).to.eql(lastAbscissa);
            const indexOrigin = seq.indexKnotOrigin;
            const knotMultiplicityAtOrigin = seq.knotMultiplicity(indexOrigin);
            let indexOffset = maxMultiplicityOrder - knotMultiplicityAtOrigin - 1;
            let indexOffset1 = indexOffset;
            for (let i = indexOrigin.knotIndex; i < lastIndex.knotIndex; i++) {
                const abscissa = seq.distinctAbscissae()[i];
                let index = seq.findSpan(abscissa);
                if (i !== lastIndex.knotIndex)
                    indexOffset = indexOffset + seq.knotMultiplicityAtAbscissa(abscissa);
                (0, chai_1.expect)(index.knotIndex).to.eql(indexOffset);
                if (i < lastIndex.knotIndex) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2;
                    index = seq.findSpan(abscissa1);
                    indexOffset1 = indexOffset1 + seq.knotMultiplicityAtAbscissa(abscissa);
                    (0, chai_1.expect)(index.knotIndex).to.eql(indexOffset1);
                }
            }
        });
    });
});
