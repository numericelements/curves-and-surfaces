import { expect } from 'chai';
import { IncreasingPeriodicKnotSequenceClosedCurve } from '../../../src/newBsplines/IncreasingPeriodicKnotSequenceClosedCurve';
import { INCREASINGPERIODICKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from '../../../src/newBsplines/KnotSequenceConstructorInterface';
import { prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq } from '../../../src/newBsplines/KnotSequenceAndUtilities/prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq';
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from '../../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve';

describe('Generate the parameters of an increasing open knot seuqence of closed curve from an increasing periodic knot sequence. The parameters are configured similarly to strictly increasing knot sequences', () => {
    
    it('can generate the parameters of an increasing knot sequence of a closed curve from a periodic increasing knot sequence. Case of uniform knot sequence', () => {
        const periodicKnots = [0, 1, 2, 3, 4];
        const maxMultiplicityOrder = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
        const strictIncSeq = prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq(seq)
        expect(strictIncSeq.knots.length).to.eql(periodicKnots.length + 2 * maxMultiplicityOrder)
        expect(strictIncSeq.knots).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6])
        expect(strictIncSeq.multiplicities).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1])
        expect(strictIncSeq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
        expect(strictIncSeq.indexKnotOrigin.knotIndex).to.eql(2)
        const strIncOpenKnotCC = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder + 1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: strictIncSeq.knots, multiplicities: strictIncSeq.multiplicities})
        expect(strIncOpenKnotCC.isSequenceUpToC0Discontinuity).to.eql(false)
        expect(strIncOpenKnotCC.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
    });

    it('can generate the parameyters of an increasing open knot seuqence of closed curve from a non uniform periodic increasing sequence with multiplicity order of maxMultiplicityOrder at its boundary', () => {
        const periodicKnots = [0, 0, 1, 2, 3, 4, 4];
        const maxMultiplicityOrder = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
        const strictIncSeq = prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq(seq)
        expect(strictIncSeq.knots.length).to.eql(7)
        expect(strictIncSeq.knots).to.eql([-1, 0, 1, 2, 3, 4, 5])
        expect(strictIncSeq.multiplicities).to.eql([1, 2, 1, 1, 1, 2, 1])
        expect(strictIncSeq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
        expect(strictIncSeq.indexKnotOrigin.knotIndex).to.eql(1)
        const strIncOpenKnotCC = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder + 1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: strictIncSeq.knots, multiplicities: strictIncSeq.multiplicities})
        expect(strIncOpenKnotCC.isSequenceUpToC0Discontinuity).to.eql(false)
        expect(strIncOpenKnotCC.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
    });

    it('can generate the parameters of an increasing non uniform knot sequence of closed curve from a non uniform periodic increasing sequence with maximal multiplicities inside its interval', () => {
        const periodicKnots = [0, 1, 1, 2, 3, 4, 5];
        const maxMultiplicityOrder = 2;
        const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
        const strictIncSeq = prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq(seq)
        expect(strictIncSeq.knots.length).to.eql(9)
        expect(strictIncSeq.knots).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6])
        expect(strictIncSeq.multiplicities).to.eql([1, 1, 1, 2, 1, 1, 1, 1, 2])
        expect(strictIncSeq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
        expect(strictIncSeq.indexKnotOrigin.knotIndex).to.eql(2)
        const strIncOpenKnotCC = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder + 1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: strictIncSeq.knots, multiplicities: strictIncSeq.multiplicities})
        expect(strIncOpenKnotCC.isSequenceUpToC0Discontinuity).to.eql(false)
        expect(strIncOpenKnotCC.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)

        const periodicKnots1 = [0, 1, 2, 2, 3, 4, 5];
        const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1});
        const strictIncSeq1 = prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq(seq1)
        expect(strictIncSeq1.knots.length).to.eql(10)
        expect(strictIncSeq1.knots).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(strictIncSeq1.multiplicities).to.eql([1, 1, 1, 1, 2, 1, 1, 1, 1, 1])
        expect(strictIncSeq1.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
        expect(strictIncSeq1.indexKnotOrigin.knotIndex).to.eql(2)
        const strIncOpenKnotCC1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder + 1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: strictIncSeq.knots, multiplicities: strictIncSeq.multiplicities})
        expect(strIncOpenKnotCC1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)

        const periodicKnots2 = [0, 1, 2, 3, 3, 4, 5];
        const seq2 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots2});
        const strictIncSeq2 = prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq(seq2)
        expect(strictIncSeq2.knots.length).to.eql(10)
        expect(strictIncSeq2.knots).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(strictIncSeq2.multiplicities).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1])
        expect(strictIncSeq2.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
        expect(strictIncSeq2.indexKnotOrigin.knotIndex).to.eql(2)
        const strIncOpenKnotCC2 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder + 1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: strictIncSeq.knots, multiplicities: strictIncSeq.multiplicities})
        expect(strIncOpenKnotCC2.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)

        const periodicKnots3 = [0, 1, 2, 3, 4, 4, 5];
        const seq3 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots3});
        const strictIncSeq3 = prepareIncreasingOpenKnotSeqCCfromIncreasingPeriodicKnotSeq(seq3)
        expect(strictIncSeq3.knots.length).to.eql(9)
        expect(strictIncSeq3.knots).to.eql([-1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(strictIncSeq3.multiplicities).to.eql([2, 1, 1, 1, 1, 2, 1, 1, 1])
        expect(strictIncSeq3.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
        expect(strictIncSeq3.indexKnotOrigin.knotIndex).to.eql(1)
        const strIncOpenKnotCC3 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder + 1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: strictIncSeq.knots, multiplicities: strictIncSeq.multiplicities})
        expect(strIncOpenKnotCC3.maxMultiplicityOrder).to.eql(maxMultiplicityOrder + 1)
    });
});
