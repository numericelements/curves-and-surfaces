import { expect } from 'chai';
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from '../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceOpenCurve';
import { fromStrictlyIncreasingtToIncreasingKnotSequenceOC } from '../../src/newBsplines/KnotSequenceAndUtilities/fromStrictlyIncreasingtToIncreasingKnotSequenceOC';
import { STRICTLYINCREASINGOPENKNOTSEQUENCE, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY } from '../../src/newBsplines/KnotSequenceConstructorInterface';

describe('Conversions from a strictly increasing knot sequence of an open curve to an increasing open knot sequence of an open curve', () => {

    it('can convert a srictly increasing knot sequence to an increasing knot sequence. Case of non uniform knot sequence', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 1]
        const multiplicities = [4, 4]
        const strSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
        const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strSeq);
        expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        const knotAbscissae: number[] = []
        for(const knot of increasingSeq) {
            if(knot !== undefined) {
                knotAbscissae.push(knot)
            }
        }
        const abscissaeInit: number[] = []
        for(const knot of strSeq) {
            if(knot !== undefined) {
                for(let i = 0; i < knot.multiplicity; i++) abscissaeInit.push(knot.abscissa)
            }
        }
        expect(knotAbscissae).to.eql(abscissaeInit)
    });

    it('can convert a srictly increasing knot sequence to an increasing knot sequence. Case of arbitrary knot sequence', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1]
        const multiplicities = [1, 1, 2, 1, 1, 2, 4]
        const strSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
        const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strSeq);
        expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        const knotAbscissae: number[] = []
        for(const knot of increasingSeq) {
            if(knot !== undefined) {
                knotAbscissae.push(knot)
            }
        }
        const abscissaeInit: number[] = []
        for(const knot of strSeq) {
            if(knot !== undefined) {
                for(let i = 0; i < knot.multiplicity; i++) abscissaeInit.push(knot.abscissa)
            }
        }
        expect(knotAbscissae).to.eql(abscissaeInit)
    });

    it('can convert a srictly increasing knot sequence to an increasing knot sequence. Case of arbitrary knot sequence with constructor' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1]
        const multiplicities = [1, 1, 2, 1, 1, 2, 4]
        const strSeq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots, multiplicities: multiplicities})
        expect(strSeq.isSequenceUpToC0Discontinuity).to.eql(true)
        const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(strSeq);
        expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(true)
        const knotAbscissae: number[] = []
        for(const knot of increasingSeq) {
            if(knot !== undefined) {
                knotAbscissae.push(knot)
            }
        }
        const abscissaeInit: number[] = []
        for(const knot of strSeq) {
            if(knot !== undefined) {
                for(let i = 0; i < knot.multiplicity; i++) abscissaeInit.push(knot.abscissa)
            }
        }
        expect(knotAbscissae).to.eql(abscissaeInit)
    });

    it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1]
        const multiplicities = [1, 1, 2, 1, 1, 2, 4]
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
        const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(seq);
        expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
    });

    it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 1]
        const multiplicities = [1, 1, 2, 1, 1, 2, 4]
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
        expect(seq.isKnotSpacingUniform).to.eql(false)
        const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(seq);
        expect(increasingSeq.isKnotSpacingUniform).to.eql(false)
    });

    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 1]
        const multiplicities = [4, 4]
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
        expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
        const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(seq);
        expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(true)
    });

    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
        const curveDegree = 2;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
        const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE, knots: knots, multiplicities: multiplicities})
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        const increasingSeq = fromStrictlyIncreasingtToIncreasingKnotSequenceOC(seq);
        expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true)
    });
});