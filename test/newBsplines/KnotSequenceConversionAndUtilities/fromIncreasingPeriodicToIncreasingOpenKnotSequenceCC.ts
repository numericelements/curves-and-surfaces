import { expect } from 'chai';
import { IncreasingPeriodicKnotSequenceClosedCurve } from '../../../src/newBsplines/IncreasingPeriodicKnotSequenceClosedCurve';
import { fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC } from '../../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC';
import { INCREASINGPERIODICKNOTSEQUENCE } from '../../../src/newBsplines/KnotSequenceConstructorInterface';

describe('Conversions from an increasing periodic knot sequence of a closed curve to an increasing open knot sequence of a closed curve', () => {
    
    it('can convert a periodic increasing sequence to an open increasing knot sequence. Case of uniform knot sequence', () => {
        const periodicKnots = [0, 1, 2, 3, 4];
        const maxMultiplicityOrder = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
        const strictIncSeq = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(seq)
        expect(strictIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
        expect(strictIncSeq.isSequenceUpToC0Discontinuity).to.eql(false)
        expect(strictIncSeq.allAbscissae.length).to.eql(periodicKnots.length + 2 * maxMultiplicityOrder)
        expect(strictIncSeq.allAbscissae).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6])
        expect(strictIncSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1])
    });

    it('can convert a non uniform periodic increasing sequence with multiplicity order of maxMultiplicityOrder at its boundary to an open increasing knot sequence', () => {
        const periodicKnots = [0, 0, 1, 2, 3, 4, 4];
        const maxMultiplicityOrder = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
        const strictIncSeq = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(seq)
        expect(strictIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
        expect(strictIncSeq.isSequenceUpToC0Discontinuity).to.eql(false)
        expect(strictIncSeq.allAbscissae.length).to.eql(9)
        expect(strictIncSeq.allAbscissae).to.eql([-1, 0, 0, 1, 2, 3, 4, 4, 5])
        expect(strictIncSeq.multiplicities()).to.eql([1, 2, 1, 1, 1, 2, 1])
    });

    it('can convert a non uniform periodic increasing sequence with maximal multiplicities inside its interval to an open increasing knot sequence', () => {
        const periodicKnots = [0, 1, 1, 2, 3, 4, 5];
        const maxMultiplicityOrder = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
        const strictIncSeq = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(seq)
        expect(strictIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
        expect(strictIncSeq.isSequenceUpToC0Discontinuity).to.eql(false)
        expect(strictIncSeq.allAbscissae.length).to.eql(11)
        expect(strictIncSeq.allAbscissae).to.eql([-2, -1, 0, 1, 1, 2, 3, 4, 5, 6, 6])
        expect(strictIncSeq.multiplicities()).to.eql([1, 1, 1, 2, 1, 1, 1, 1, 2])

        const periodicKnots1 = [0, 1, 2, 2, 3, 4, 5];
        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1});
        const strictIncSeq1 = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(seq1)
        expect(strictIncSeq1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
        expect(strictIncSeq1.allAbscissae.length).to.eql(11)
        expect(strictIncSeq1.allAbscissae).to.eql([-2, -1, 0, 1, 2, 2, 3, 4, 5, 6, 7])
        expect(strictIncSeq1.multiplicities()).to.eql([1, 1, 1, 1, 2, 1, 1, 1, 1, 1])

        const periodicKnots2 = [0, 1, 2, 3, 3, 4, 5];
        const seq2 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots2});
        const strictIncSeq2 = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(seq2)
        expect(strictIncSeq2.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
        expect(strictIncSeq2.allAbscissae.length).to.eql(11)
        expect(strictIncSeq2.allAbscissae).to.eql([-2, -1, 0, 1, 2, 3, 3, 4, 5, 6, 7])
        expect(strictIncSeq2.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1])

        const periodicKnots3 = [0, 1, 2, 3, 4, 4, 5];
        const seq3 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots3});
        const strictIncSeq3 = fromIncreasingPeriodicToIncreasingOpenKnotSequenceCC(seq3)
        expect(strictIncSeq3.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
        expect(strictIncSeq3.allAbscissae.length).to.eql(11)
        expect(strictIncSeq3.allAbscissae).to.eql([-1, -1, 0, 1, 2, 3, 4, 4, 5, 6, 7])
        expect(strictIncSeq3.multiplicities()).to.eql([2, 1, 1, 1, 1, 2, 1, 1, 1])
    });
});
