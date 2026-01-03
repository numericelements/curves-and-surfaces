"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const IncreasingPeriodicKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/IncreasingPeriodicKnotSequenceClosedCurve");
const fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence");
const KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
describe('Conversions from an increasing periodic knot sequence of a closed curve to a strictly increasing periodic knot sequence of a closed curve', () => {
    it('can convert an increasing uniform periodic knot sequence to a strictly increasing periodic knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, () => {
        const periodicKnots = [0, 1, 2, 3, 4, 5];
        const maxMultiplicityOrder = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots });
        const seqStrictly = (0, fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence)(seq);
        (0, chai_1.expect)(seqStrictly.multiplicities()).to.eql([1, 1, 1, 1, 1, 1]);
        const sequence = [];
        for (const knot of seqStrictly) {
            if (knot !== undefined)
                sequence.push(knot.abscissa);
        }
        (0, chai_1.expect)(sequence).to.eql(periodicKnots);
    });
    it('can convert the increasing periodic knot sequence, with a multiplicity order higher than one of the knot origin of the sequence, to a strictly increasing periodic knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, () => {
        const periodicKnots = [0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1];
        const maxMultiplicityOrder = 3;
        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots });
        const seqStrictly1 = (0, fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence)(seq1);
        (0, chai_1.expect)(seqStrictly1.multiplicities()).to.eql([2, 1, 1, 1, 1, 1, 1, 2]);
        const sequence1 = [];
        for (const knot of seqStrictly1) {
            if (knot !== undefined)
                sequence1.push(knot.abscissa);
        }
        (0, chai_1.expect)(sequence1).to.eql([0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1]);
    });
    it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1];
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots });
        (0, chai_1.expect)(seq.isKnotSpacingUniform).to.eql(false);
        const increasingSeq = (0, fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotSpacingUniform).to.eql(false);
    });
    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
        const maxMultiplicityOrder = 3;
        const periodicKnots = [0, 0, 0, 1, 1, 1];
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots });
        (0, chai_1.expect)(seq.isKnotMultiplicityNonUniform).to.eql(false);
        const increasingSeq = (0, fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
        const maxMultiplicityOrder = 2;
        const periodicKnots = [0, 1, 2, 3, 4, 5, 6];
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve_1.IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots });
        (0, chai_1.expect)(seq.isKnotMultiplicityUniform).to.eql(true);
        const increasingSeq = (0, fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence_1.fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence)(seq);
        (0, chai_1.expect)(increasingSeq.isKnotMultiplicityUniform).to.eql(true);
    });
});
