"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const StrictlyIncreasingOpenKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve");
const fromStrictlyIncreasingToIncreasingKnotSequenceCC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromStrictlyIncreasingToIncreasingKnotSequenceCC");
const KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
describe('Conversions from a strictly increasing knot sequence of a closed curve to an increasing open knot sequence of a closed curve', () => {
    it('can convert a strictly increasing sequence to an increasing knot sequence. Case of non uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const maxMultiplicityOrder = 4;
        const knots = [0, 1];
        const multiplicities = [4, 4];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        const increasingSeq = (0, fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC)(seq);
        (0, chai_1.expect)(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
        (0, chai_1.expect)(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        const abscissae = [];
        for (const knot of increasingSeq) {
            if (knot !== undefined) {
                abscissae.push(knot);
            }
        }
        const referenceAbscissae = [];
        for (let i = 0; i < knots.length; i++) {
            for (let j = 0; j < multiplicities[i]; j++) {
                referenceAbscissae.push(knots[i]);
            }
        }
        (0, chai_1.expect)(abscissae).to.eql(referenceAbscissae);
        (0, chai_1.expect)(increasingSeq.multiplicities()).to.eql(multiplicities);
    });
    it('can convert a strictly increasing sequence to an increasing knot sequence. Case of arbitrary knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const maxMultiplicityOrder = 4;
        const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6];
        const multiplicities = [2, 2, 1, 1, 2, 2, 1, 1];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        const increasingSeq = (0, fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC)(seq);
        (0, chai_1.expect)(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        (0, chai_1.expect)(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
        const abscissae = [];
        for (const knot of increasingSeq) {
            if (knot !== undefined) {
                abscissae.push(knot);
            }
        }
        const referenceAbscissae = [];
        for (let i = 0; i < knots.length; i++) {
            for (let j = 0; j < multiplicities[i]; j++) {
                referenceAbscissae.push(knots[i]);
            }
        }
        (0, chai_1.expect)(abscissae).to.eql(referenceAbscissae);
        (0, chai_1.expect)(increasingSeq.multiplicities()).to.eql(multiplicities);
    });
    it('can convert a strictly increasing uniform knot sequence to an increasing knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
        const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const maxMultiplicityOrder = 3;
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        const increasingSeq = (0, fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC)(seq);
        (0, chai_1.expect)(increasingSeq.multiplicities()).to.eql(multiplicities);
        (0, chai_1.expect)(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
        const sequence = [];
        for (const knot of increasingSeq) {
            if (knot !== undefined)
                sequence.push(knot);
        }
        (0, chai_1.expect)(sequence).to.eql(knots);
    });
    it('can convert a strictly increasing knot sequence, with a multiplicity order higher than one of the knot origin of the sequence, to an increasing knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots1 = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2];
        const multiplicities1 = [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1];
        const maxMultiplicityOrder = 4;
        const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1 });
        (0, chai_1.expect)(seq1.isSequenceUpToC0Discontinuity).to.eql(false);
        const increasingSeq = (0, fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC)(seq1);
        (0, chai_1.expect)(increasingSeq.multiplicities()).to.eql(multiplicities1);
        (0, chai_1.expect)(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
        const sequence1 = [];
        for (const knot of increasingSeq) {
            if (knot !== undefined)
                sequence1.push(knot);
        }
        const referenceAbscissae = [];
        for (let i = 0; i < knots1.length; i++) {
            for (let j = 0; j < multiplicities1[i]; j++) {
                referenceAbscissae.push(knots1[i]);
            }
        }
        (0, chai_1.expect)(sequence1).to.eql(referenceAbscissae);
    });
    it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6];
        const multiplicities = [2, 2, 1, 1, 2, 2, 1, 1];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        (0, chai_1.expect)(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        const increasingSeq = (0, fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC)(seq);
        (0, chai_1.expect)(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6];
        const multiplicities = [2, 2, 1, 1, 2, 2, 1, 1];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
        const increasingSeq = (0, fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [0, 1];
        const multiplicities = [4, 4];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
        const increasingSeq = (0, fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
        const curveDegree = 2;
        const maxMultiplicityOrder = curveDegree + 1;
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
        const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve_1.StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities });
        (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
        const increasingSeq = (0, fromStrictlyIncreasingToIncreasingKnotSequenceCC_1.fromStrictlyIncreasingToIncreasingKnotSequenceCC)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotMultiplicityUniform).to.eql(true);
    });
});
