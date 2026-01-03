"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const IncreasingOpenKnotSequenceOpenCurve_1 = require("../../../src/newBsplines/IncreasingOpenKnotSequenceOpenCurve");
const fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC");
const KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
describe('Conversions from an increasing open knot sequence of an open curve to strictly increasing open knot sequence of open curve', () => {
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [0, 0, 0, 0, 1, 1, 1, 1];
        const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        const increasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
        (0, chai_1.expect)(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        const abscissa = [];
        const multiplicity = [];
        for (const knot of increasingSeq) {
            if (knot !== undefined) {
                abscissa.push(knot.abscissa);
                multiplicity.push(knot.multiplicity);
            }
        }
        (0, chai_1.expect)(abscissa).to.eql([0, 1]);
        (0, chai_1.expect)(multiplicity).to.eql([4, 4]);
    });
    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
        const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        const increasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
        (0, chai_1.expect)(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        const abscissa = [];
        const multiplicity = [];
        for (const knot of increasingSeq) {
            if (knot !== undefined) {
                abscissa.push(knot.abscissa);
                multiplicity.push(knot.multiplicity);
            }
        }
        (0, chai_1.expect)(abscissa).to.eql([-2, -1, 0, 0.5, 0.6, 0.7, 1]);
        (0, chai_1.expect)(multiplicity).to.eql([1, 1, 2, 1, 1, 2, 4]);
    });
    it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
        const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        const increasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
        (0, chai_1.expect)(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1];
        const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
        const increasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [0, 0, 0, 0, 1, 1, 1, 1];
        const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(true);
        const increasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotMultiplicityNonUniform).to.eql(true);
    });
    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
        const curveDegree = 2;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
        const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
        (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
        const increasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotMultiplicityUniform).to.eql(true);
    });
    it('can convert an increasing sequence with knot multiplicities up to C0 discontinuity to a strictly increasing knot sequence.', () => {
        const maxMultiplicityOrder = 4;
        const knots = [-3, -2, -1, 0, 1, 1, 2, 3, 4, 5];
        const seq = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
        (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(true);
        const increasingSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(seq);
        (0, chai_1.expect)(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(true);
        (0, chai_1.expect)(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        const abscissa = [];
        const multiplicity = [];
        for (const knot of increasingSeq) {
            if (knot !== undefined) {
                abscissa.push(knot.abscissa);
                multiplicity.push(knot.multiplicity);
            }
        }
        (0, chai_1.expect)(abscissa).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5]);
        (0, chai_1.expect)(multiplicity).to.eql([1, 1, 1, 1, 2, 1, 1, 1, 1]);
    });
});
