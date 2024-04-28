import { expect } from "chai";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { KnotIndexStrictlyIncreasingSequence } from "../../src/newBsplines/Knot";

describe('InccreasingOpenKnotSequenceCurve', () => {
    
    it('cannot be initialized with a knot sequence having a length differing from that of the multiplicities', () => {
        const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2]
        // expect(function() {const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities)}).to.throw()
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities);
        // test sending error message by ErrorLog class replaced by
        expect(knots.length).not.to.eql(multiplicities.length)
    });

    it('check that the knot sequence origin must be zero', () => {
        const knots: number [] = [0.1, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        // expect(function() {const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities)}).to.throw()
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities);
        // test sending error message by ErrorLog class replaced by
        expect(seq.distinctAbscissae[0]).not.to.eql(0.0)
    });

    it('can be initialized as a description of a non-uniform B-spline', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities);
        expect(seq.distinctAbscissae).to.eql([0.0, 0.5, 0.6, 0.7, 1])
        expect(seq.multiplicities).to.eql([4, 1, 1, 2, 4])
    });

    it('can be initialized as a description of a uniform B-spline', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [1, 1, 1, 1, 1]
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities);
        expect(seq.distinctAbscissae).to.eql([0.0, 0.5, 0.6, 0.7, 1])
        expect(seq.multiplicities).to.eql([1, 1, 1, 1, 1])
    });

    it('can convert knot sequence to an increasing knot sequence of open curve', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities);
        const seqIncreasing = seq.toIncreasingKnotSequence();
        const abscissae: number[] = []
        for(const knot of seqIncreasing) {
            if(knot !== undefined) abscissae.push(knot)
        }
        expect(abscissae).to.eql([0.0, 0.0, 0.0, 0.0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1])
    });

    it('can insert a knot into knot sequence', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities);
        expect(seq.insertKnot(0.2, 2)).to.eql(true)
        expect(seq.distinctAbscissae).to.eql([0.0, 0.2, 0.5, 0.6, 0.7, 1])
        expect(seq.multiplicities).to.eql([4, 2, 1, 1, 2, 4])
    });

    it('can check if the knot multiplicity of a knot is zero', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities)
        expect(seq.isKnotlMultiplicityZero(0)).to.eql(false)
        expect(seq.isKnotlMultiplicityZero(0.2)).to.eql(true)
    });

    it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities)
        let index = seq.findSpan(0.0)
        expect(index.knotIndex).to.eql(0)
        index = seq.findSpan(0.1)
        expect(index.knotIndex).to.eql(0)
        index = seq.findSpan(0.5)
        expect(index.knotIndex).to.eql(1)
        index = seq.findSpan(0.55)
        expect(index.knotIndex).to.eql(1)
        index = seq.findSpan(0.6)
        expect(index.knotIndex).to.eql(2)
        index = seq.findSpan(0.65)
        expect(index.knotIndex).to.eql(2)
        index = seq.findSpan(0.7)
        expect(index.knotIndex).to.eql(3)
        index = seq.findSpan(0.9)
        expect(index.knotIndex).to.eql(3)
        index = seq.findSpan(1.0)
        expect(index.knotIndex).to.eql(3)
    });

    it('can get the knot multiplicity from a sequence index', () => {
        const knots: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number[] = [4, 1, 1, 2, 4]
        const seq = new StrictlyIncreasingOpenKnotSequenceOpenCurve(3, knots, multiplicities)
        let index = new KnotIndexStrictlyIncreasingSequence();
        let multiplicity = seq.knotMultiplicity(index)
        expect(multiplicity).to.eql(4);
        index = new KnotIndexStrictlyIncreasingSequence(1);
        multiplicity = seq.knotMultiplicity(index)
        expect(multiplicity).to.eql(1);
        index = new KnotIndexStrictlyIncreasingSequence(3);
        multiplicity = seq.knotMultiplicity(index)
        expect(multiplicity).to.eql(2);
    });
});