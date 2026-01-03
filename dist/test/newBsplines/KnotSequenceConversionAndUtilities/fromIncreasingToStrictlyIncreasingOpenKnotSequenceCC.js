"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const IncreasingOpenKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/IncreasingOpenKnotSequenceClosedCurve");
const fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC");
const KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
describe('Conversion from an increasing open knot sequence of a closed curve to a strictly increasing open knot sequence of a closed curve', () => {
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const maxMultiplicityOrder = 4;
        const knots = [0, 0, 0, 0, 1, 1, 1, 1];
        const seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        const strictIncreasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(seq);
        (0, chai_1.expect)(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        const abscissa = [];
        const multiplicity = [];
        for (const knot of strictIncreasingSeq) {
            if (knot !== undefined) {
                abscissa.push(knot.abscissa);
                multiplicity.push(knot.multiplicity);
            }
        }
        (0, chai_1.expect)(abscissa).to.eql([0, 1]);
        (0, chai_1.expect)(multiplicity).to.eql([maxMultiplicityOrder, maxMultiplicityOrder]);
    });
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const maxMultiplicityOrder = 4;
        const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6];
        const seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        const strictIncreasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(seq);
        (0, chai_1.expect)(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        const abscissa = [];
        const multiplicity = [];
        for (const knot of strictIncreasingSeq) {
            if (knot !== undefined) {
                abscissa.push(knot.abscissa);
                multiplicity.push(knot.multiplicity);
            }
        }
        (0, chai_1.expect)(abscissa).to.eql([-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6]);
        (0, chai_1.expect)(multiplicity).to.eql([2, 2, 1, 1, 2, 2, 1, 1]);
    });
    it('can convert the increasing uniform knot sequence to a strictly increasing knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
        const maxMultiplicityOrder = 3;
        const seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        const seqStrictly = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(seq);
        (0, chai_1.expect)(seqStrictly.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        const sequence = [];
        for (const knot of seqStrictly) {
            if (knot !== undefined)
                sequence.push(knot.abscissa);
        }
        (0, chai_1.expect)(sequence).to.eql(knots);
    });
    it('can convert the increasing knot sequence, with a multiplicity order higher than one of the knot origin of the sequence, to a strictly increasing knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots1 = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2];
        const maxMultiplicityOrder = 4;
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1 });
        const seqStrictly1 = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(seq1);
        (0, chai_1.expect)(seqStrictly1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1]);
        const sequence1 = [];
        for (const knot of seqStrictly1) {
            if (knot !== undefined)
                sequence1.push(knot.abscissa);
        }
        (0, chai_1.expect)(sequence1).to.eql([-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2]);
    });
    it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6];
        const seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        const increasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(seq);
        (0, chai_1.expect)(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6];
        const seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
        const increasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [0, 0, 0, 0, 1, 1, 1, 1];
        const seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
        const increasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
        const curveDegree = 2;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
        const seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
        const increasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotMultiplicityUniform).to.eql(true);
    });
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
        const maxMultiplicityOrder = 4;
        const knots = [0, 0, 0, 0, 1, 1, 1, 1];
        const seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
        (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(true);
        const strictIncreasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(seq);
        (0, chai_1.expect)(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        (0, chai_1.expect)(strictIncreasingSeq.isSequenceUpToC0Discontinuity).to.eql(true);
        const abscissa = [];
        const multiplicity = [];
        for (const knot of strictIncreasingSeq) {
            if (knot !== undefined) {
                abscissa.push(knot.abscissa);
                multiplicity.push(knot.multiplicity);
            }
        }
        (0, chai_1.expect)(abscissa).to.eql([0, 1]);
        (0, chai_1.expect)(multiplicity).to.eql([maxMultiplicityOrder, maxMultiplicityOrder]);
    });
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
        const maxMultiplicityOrder = 4;
        const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6];
        const seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
        (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(true);
        const strictIncreasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(seq);
        (0, chai_1.expect)(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        (0, chai_1.expect)(strictIncreasingSeq.isSequenceUpToC0Discontinuity).to.eql(true);
        const abscissa = [];
        const multiplicity = [];
        for (const knot of strictIncreasingSeq) {
            if (knot !== undefined) {
                abscissa.push(knot.abscissa);
                multiplicity.push(knot.multiplicity);
            }
        }
        (0, chai_1.expect)(abscissa).to.eql([-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6]);
        (0, chai_1.expect)(multiplicity).to.eql([2, 2, 1, 1, 2, 2, 1, 1]);
    });
    it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
        const curveDegree = 2;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
        const seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
        (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(true);
        const strictIncreasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(seq);
        (0, chai_1.expect)(strictIncreasingSeq.isSequenceUpToC0Discontinuity).to.eql(true);
    });
});
