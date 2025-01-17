import { expect } from 'chai';
import { IncreasingOpenKnotSequenceClosedCurve } from '../../../src/newBsplines/IncreasingOpenKnotSequenceClosedCurve';
import { fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC } from '../../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC';
import { INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from '../../../src/newBsplines/KnotSequenceConstructorInterface';

describe('Conversion from an increasing open knot sequence of a closed curve to a strictly increasing open knot sequence of a closed curve', () => {

    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const maxMultiplicityOrder = 4
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        const strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        const abscissa: number[] = []
        const multiplicity: number[] = []
        for(const knot of strictIncreasingSeq) {
            if(knot !== undefined) {
                abscissa.push(knot.abscissa)
                multiplicity.push(knot.multiplicity)
            }
        }
        expect(abscissa).to.eql([0, 1])
        expect(multiplicity).to.eql([maxMultiplicityOrder, maxMultiplicityOrder])
    });

    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const maxMultiplicityOrder = 4
        const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        const strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        const abscissa: number[] = []
        const multiplicity: number[] = []
        for(const knot of strictIncreasingSeq) {
            if(knot !== undefined) {
                abscissa.push(knot.abscissa)
                multiplicity.push(knot.multiplicity)
            }
        }
        expect(abscissa).to.eql([-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6])
        expect(multiplicity).to.eql([2, 2, 1, 1, 2, 2, 1, 1])
    });

    it('can convert the increasing uniform knot sequence to a strictly increasing knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        const seqStrictly = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        expect(seqStrictly.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        const sequence: number[] = []
        for(const knot of seqStrictly) {
            if(knot !== undefined) sequence.push(knot.abscissa)
        }
        expect(sequence).to.eql(knots)
    });

    it('can convert the increasing knot sequence, with a multiplicity order higher than one of the knot origin of the sequence, to a strictly increasing knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2 ]
        const maxMultiplicityOrder = 4
        const seq1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
        const seqStrictly1 = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq1);
        expect(seqStrictly1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1])
        const sequence1: number[] = []
        for(const knot of seqStrictly1) {
            if(knot !== undefined) sequence1.push(knot.abscissa)
        }
        expect(sequence1).to.eql([-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2])
    });

    it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
        const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
    });

    it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.isKnotSpacingUniform).to.eql(false)
        const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        expect(increasingSeq.isKnotSpacingUniform).to.eql(false)
    });

    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false)
    });

    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
        const curveDegree = 2;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true)
    });

    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
        const maxMultiplicityOrder = 4
        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
        const strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        expect(strictIncreasingSeq.isSequenceUpToC0Discontinuity).to.eql(true)
        const abscissa: number[] = []
        const multiplicity: number[] = []
        for(const knot of strictIncreasingSeq) {
            if(knot !== undefined) {
                abscissa.push(knot.abscissa)
                multiplicity.push(knot.multiplicity)
            }
        }
        expect(abscissa).to.eql([0, 1])
        expect(multiplicity).to.eql([maxMultiplicityOrder, maxMultiplicityOrder])
    });

    it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
        const maxMultiplicityOrder = 4
        const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
        const strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        expect(strictIncreasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        expect(strictIncreasingSeq.isSequenceUpToC0Discontinuity).to.eql(true)
        const abscissa: number[] = []
        const multiplicity: number[] = []
        for(const knot of strictIncreasingSeq) {
            if(knot !== undefined) {
                abscissa.push(knot.abscissa)
                multiplicity.push(knot.multiplicity)
            }
        }
        expect(abscissa).to.eql([-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6])
        expect(multiplicity).to.eql([2, 2, 1, 1, 2, 2, 1, 1])
    });

    it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
        const curveDegree = 2;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
        const strictIncreasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq);
        expect(strictIncreasingSeq.isSequenceUpToC0Discontinuity).to.eql(true)
    });
});