import { expect } from 'chai';
import { IncreasingOpenKnotSequenceOpenCurve } from '../../src/newBsplines/IncreasingOpenKnotSequenceOpenCurve';
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY } from '../../src/newBsplines/KnotSequenceConstructorInterface';
import { fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC } from '../../src/newBsplines/KnotSequenceConversionAndUtilities';

describe('Conversions between knot sequences classes', () => {

    describe('Conversions from an increasing open knot sequence of an open curve to other knot sequences', () => {

        it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [0, 0, 0, 0, 1, 1, 1, 1]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
            expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissa: number[] = []
            const multiplicity: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) {
                    abscissa.push(knot.abscissa)
                    multiplicity.push(knot.multiplicity)
                }
            }
            expect(abscissa).to.eql([0, 1])
            expect(multiplicity).to.eql([4, 4])
        });

        it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
            expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissa: number[] = []
            const multiplicity: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) {
                    abscissa.push(knot.abscissa)
                    multiplicity.push(knot.multiplicity)
                }
            }
            expect(abscissa).to.eql([-2, -1, 0, 0.5, 0.6, 0.7, 1])
            expect(multiplicity).to.eql([1, 1, 2, 1, 1, 2, 4])
        });

        it('can convert an increasing sequence with knot multiplicities up to C0 discontinuity to a strictly increasing knot sequence.', () => {
            const maxMultiplicityOrder = 4
            const knots = [-3, -2, -1, 0, 1, 1, 2, 3, 4, 5]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            const increasingSeq = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq);
            expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissa: number[] = []
            const multiplicity: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) {
                    abscissa.push(knot.abscissa)
                    multiplicity.push(knot.multiplicity)
                }
            }
            expect(abscissa).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5])
            expect(multiplicity).to.eql([1, 1, 1, 1, 2, 1, 1, 1, 1])
        });
    });
});