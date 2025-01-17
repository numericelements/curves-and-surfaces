import { expect } from 'chai';
import { IncreasingOpenKnotSequenceClosedCurve } from '../../../src/newBsplines/IncreasingOpenKnotSequenceClosedCurve';
import { fromIncreasingOpentoIncreasingPeriodicKnotSequence } from '../../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingOpentoIncreasingPeriodicKnotSequence';
import { INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from '../../../src/newBsplines/KnotSequenceConstructorInterface';
import { EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION } from '../../../src/ErrorMessages/KnotSequences';

describe('Conversions from an increasing open knot sequence of a closed curve to an increasing periodic knot sequence of a closed curve', () => {

    it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with maximal multiplicity at curve origin and type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots: number [] = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8]
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
        const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        expect(pSeq.length()).to.eql(seq.periodicKnots.length)
        expect(pSeq.allAbscissae).to.eql(seq.periodicKnots)
    });

    it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with maximal multiplicity at curve origin and type constructor ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
        const knots: number [] = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8]
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots});
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
        const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        expect(pSeq.length()).to.eql(seq.periodicKnots.length)
        expect(pSeq.allAbscissae).to.eql(seq.periodicKnots)
    });

    it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with uniform multiplicity one and type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
        const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        expect(pSeq.length()).to.eql(seq.periodicKnots.length)
        expect(pSeq.allAbscissae).to.eql(seq.periodicKnots)
    });

    it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with uniform multiplicity one and type constructor ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots});
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
        const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        expect(pSeq.length()).to.eql(seq.periodicKnots.length)
        expect(pSeq.allAbscissae).to.eql(seq.periodicKnots)
    });

    it('cannot convert the knot sequence to a periodic knot sequence if containing extreme knots with multiplicity maxMultiplicity with type constructor ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
        const knots: number [] = [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 7]
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots});
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
        expect(() => fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq)).to.throw(EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION)
    });

    it('cannot convert the knot sequence to a periodic knot sequence if it contains a knot with multiplicity maxMultiplicity with type constructor ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 3, 3, 4, 5, 6, 7, 8, 9]
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots});
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
        expect(() => fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq)).to.throw(EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION)
    });

    it('preserves the uniform knot spacing of the knot sequence when converting to a periodic knot sequence with type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots: number [] = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8]
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
        expect(seq.isKnotSpacingUniform).to.eql(true)
        const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        expect(pSeq.isKnotSpacingUniform).to.eql(true)
    });

    it('preserves the uniform knot multiplicity of the knot sequence when converting to a periodic knot sequence with type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        expect(pSeq.isKnotMultiplicityUniform).to.eql(true)
    });

    it('cannot propagate the non uniform knot multiplicity of a knot sequence to a periodic knot sequence. Initial knot sequence cannot have non uniform multiplicity property with type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots: number [] = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8]
        const maxMultiplicityOrder = 3
        const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        const pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        expect(pSeq.isKnotMultiplicityNonUniform).to.eql(false)
    });
});
