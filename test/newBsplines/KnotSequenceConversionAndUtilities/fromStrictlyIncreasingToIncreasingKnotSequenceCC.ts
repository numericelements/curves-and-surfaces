import { expect } from 'chai';
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "../../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { fromStrictlyIncreasingToIncreasingKnotSequenceCC } from '../../../src/newBsplines/KnotSequenceAndUtilities/fromStrictlyIncreasingToIncreasingKnotSequenceCC';
import { STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS } from '../../../src/newBsplines/KnotSequenceConstructorInterface';


describe('Conversions from a strictly increasing knot sequence of a closed curve to an increasing open knot sequence of a closed curve', () => {

    it('can convert a strictly increasing sequence to an increasing knot sequence. Case of non uniform knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const maxMultiplicityOrder = 4
        const knots: number [] = [0, 1]
        const multiplicities: number [] = [4, 4];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
        const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
        expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        const abscissae: number[] = []
        for(const knot of increasingSeq) {
            if(knot !== undefined) {
                abscissae.push(knot)
            }
        }
        const referenceAbscissae: number[] = []
        for(let i = 0; i < knots.length; i++) {
            for(let j = 0; j < multiplicities[i]; j++) {
                referenceAbscissae.push(knots[i])
            }
        }
        expect(abscissae).to.eql(referenceAbscissae)
        expect(increasingSeq.multiplicities()).to.eql(multiplicities)
    });

    it('can convert a strictly increasing sequence to an increasing knot sequence. Case of arbitrary knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const maxMultiplicityOrder = 4
        const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6]
        const multiplicities: number [] = [2, 2, 1, 1, 2, 2, 1, 1];
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
        const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
        const abscissae: number[] = []
        for(const knot of increasingSeq) {
            if(knot !== undefined) {
                abscissae.push(knot)
            }
        }
        const referenceAbscissae: number[] = []
        for(let i = 0; i < knots.length; i++) {
            for(let j = 0; j < multiplicities[i]; j++) {
                referenceAbscissae.push(knots[i])
            }
        }
        expect(abscissae).to.eql(referenceAbscissae)
        expect(increasingSeq.multiplicities()).to.eql(multiplicities)
    });

    it('can convert a strictly increasing uniform knot sequence to an increasing knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const maxMultiplicityOrder = 3
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
        const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        expect(increasingSeq.multiplicities()).to.eql(multiplicities)
        expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
        const sequence: number[] = []
        for(const knot of increasingSeq) {
            if(knot !== undefined) sequence.push(knot)
        }
        expect(sequence).to.eql(knots)
    });

    it('can convert a strictly increasing knot sequence, with a multiplicity order higher than one of the knot origin of the sequence, to an increasing knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2 ]
        const multiplicities1: number [] = [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1];
        const maxMultiplicityOrder = 4
        const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
        expect(seq1.isSequenceUpToC0Discontinuity).to.eql(false)
        const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq1);
        expect(increasingSeq.multiplicities()).to.eql(multiplicities1)
        expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
        const sequence1: number[] = []
        for(const knot of increasingSeq) {
            if(knot !== undefined) sequence1.push(knot)
        }
        const referenceAbscissae: number[] = []
        for(let i = 0; i < knots1.length; i++) {
            for(let j = 0; j < multiplicities1[i]; j++) {
                referenceAbscissae.push(knots1[i])
            }
        }
        expect(sequence1).to.eql(referenceAbscissae)
    });

    it('preserves the knot sequence property about C0 discontinuity across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6]
        const multiplicities = [2, 2, 1, 1, 2, 2, 1, 1]
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
        expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
        const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        expect(increasingSeq.isSequenceUpToC0Discontinuity).to.eql(false)
    });

    it('preserves the knot sequence property about uniform knot spacing across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6]
        const multiplicities = [2, 2, 1, 1, 2, 2, 1, 1]
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
        expect(seq.isKnotSpacingUniform).to.eql(false)
        const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        expect(increasingSeq.isKnotSpacingUniform).to.eql(false)
    });

    it('preserves the knot sequence property about non uniform knot multiplicity across conversion.', () => {
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [0, 1]
        const multiplicities = [4, 4]
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
        expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        expect(increasingSeq.isKnotMultiplicityNonUniform).to.eql(false)
    });

    it('preserves the knot sequence property about uniform knot multiplicity across conversion.', () => {
        const curveDegree = 2;
        const maxMultiplicityOrder = curveDegree + 1
        const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
        const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
        expect(seq.isKnotMultiplicityUniform).to.eql(true)
        const increasingSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
        expect(increasingSeq.isKnotMultiplicityUniform).to.eql(true)
    });
});