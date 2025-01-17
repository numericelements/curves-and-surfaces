import { expect } from 'chai';
import { IncreasingPeriodicKnotSequenceClosedCurve } from '../../../src/newBsplines/IncreasingPeriodicKnotSequenceClosedCurve';
import { fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence } from '../../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence';
import { INCREASINGPERIODICKNOTSEQUENCE } from '../../../src/newBsplines/KnotSequenceConstructorInterface';

describe('Conversions from an increasing periodic knot sequence of a closed curve to a strictly increasing periodic knot sequence of a closed curve', () => {

    it('can convert an increasing uniform periodic knot sequence to a strictly increasing periodic knot sequence with constructor type ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
        const periodicKnots: number [] = [0, 1, 2, 3, 4, 5]
        const maxMultiplicityOrder = 2
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
        const seqStrictly = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq);
        expect(seqStrictly.multiplicities()).to.eql([1, 1, 1, 1, 1, 1])
        const sequence: number[] = []
        for(const knot of seqStrictly) {
            if(knot !== undefined) sequence.push(knot.abscissa)
        }
        expect(sequence).to.eql(periodicKnots)
    });

    it('can convert the increasing periodic knot sequence, with a multiplicity order higher than one of the knot origin of the sequence, to a strictly increasing periodic knot sequence with constructor type ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
        const periodicKnots: number [] = [0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1]
        const maxMultiplicityOrder = 3
        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
        const seqStrictly1 = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq1);
        expect(seqStrictly1.multiplicities()).to.eql([2, 1, 1, 1, 1, 1, 1, 2])
        const sequence1: number[] = []
        for(const knot of seqStrictly1) {
            if(knot !== undefined) sequence1.push(knot.abscissa)
        }
        expect(sequence1).to.eql([0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1])
    });

    it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
        const maxMultiplicityOrder = 3
        const periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1]
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
        expect(seq.isKnotSpacingUniform).to.eql(false)
        const increasingSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq);
        expect(increasingSeq.isKnotSpacingUniform).to.eql(false)
    });

    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
        const maxMultiplicityOrder = 3
        const periodicKnots = [0, 0, 0, 1, 1, 1]
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        const increasingSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq);
        expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false)
    });

    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
        const maxMultiplicityOrder = 2
        const periodicKnots = [0, 1, 2, 3, 4, 5, 6]
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        const increasingSeq = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq);
        expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true)
    });

});
